import { translations } from '../content/locales.js';
import { siteConfig } from '../config.js';
import { externalUrl } from '../lib/router.js';
import { renderMarkdown } from '../assets/vendor/markdown/renderer.js';

const $ = selector => document.querySelector(selector);
const body = $('.markdown-body');
const status = $('.reading-status');
const toc = $('.problem-toc nav');
const files = {ip:'2025-ip-track.md',vip:'2025-vip-track.md'};
const legacy = {prime:'md-level-1-the-gate-of-prime-sigils',scroll:'md-level-2-the-scroll-of-unveiling',tribute:'md-level-3-the-guardians-tribute',hypnos:'md-objective'};
let locale='en', track='ip', loaded='', request=0, controller, observer, timer;
function urlState(){const q=new URLSearchParams(location.search);locale=q.get('lang')==='zh'?'zh':'en';track=q.get('track')==='vip'?'vip':'ip';}
function chrome(){
 const t=translations[locale];document.documentElement.lang=locale==='zh'?'zh-CN':'en';$('.website').lang=document.documentElement.lang;
 document.title=locale==='zh'?'2025 往届试题 | STM':'2025 Past Problems | STM';
 document.querySelectorAll('[data-zh][data-en]').forEach(el=>el.textContent=el.dataset[locale]);
 document.querySelectorAll('[data-copy]').forEach(el=>{if(t[el.dataset.copy])el.textContent=t[el.dataset.copy];});
 document.querySelectorAll('[data-page]').forEach(el=>el.href=`./index.html#/${locale}/${el.dataset.page==='home'?'':el.dataset.page}`);
 $('[data-back]').href=`./index.html#/${locale}/rules?section=past`;
 $('.primary-nav [data-page=rules]').setAttribute('aria-current','page');
 $('.language').dataset.locale=locale;
 document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===locale)));
 document.querySelectorAll('[data-archive-track]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.archiveTrack===track)));
 $('.archive-track-picker').dataset.track=track==='vip'?'b':'a';
 $('.footer-path').textContent=`/past-problems?lang=${locale}&track=${track}`;
 document.querySelectorAll('[data-copy-markdown]').forEach(el=>el.textContent=locale==='zh'?'复制':'Copy');
}
function position(){
 const old=new URLSearchParams(location.search).get('problem');
 const id=location.hash.slice(1)||legacy[old];
 if(id)document.getElementById(id)?.scrollIntoView({block:'start'});
}
async function load(){
 chrome();if(loaded===track){position();return;}
 loaded='';controller?.abort();controller=new AbortController();const token=++request;
 observer?.disconnect();body.replaceChildren();toc.replaceChildren();status.hidden=false;
 status.textContent=locale==='zh'?'正在读取 Markdown…':'Loading Markdown…';body.setAttribute('aria-busy','true');
 try{
  const response=await fetch(new URL(`../content/problems/${files[track]}`,import.meta.url),{signal:controller.signal,cache:'no-cache'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const markdown=await response.text();const rendered=renderMarkdown(markdown);
  if(token!==request)return;
  body.innerHTML=rendered.html;loaded=track;
  for(const item of rendered.toc){if(item.level===1)continue;const a=document.createElement('a');a.href='#'+item.id;a.textContent=item.title;a.dataset.level=item.level;toc.append(a);}
  body.querySelectorAll('pre').forEach((pre,i)=>{
   const wrapper=document.createElement('div');wrapper.className='code-wrapper';
   const bar=document.createElement('div');bar.className='code-toolbar';
   const label=document.createElement('span');label.textContent=pre.querySelector('code')?.className.match(/language-([\w+-]+)/)?.[1]||'text';
   const button=document.createElement('button');button.type='button';button.dataset.copyMarkdown=String(i);button.textContent=locale==='zh'?'复制':'Copy';
   pre.id=`code-${track}-${i}`;bar.append(label,button);pre.replaceWith(wrapper);wrapper.append(bar,pre);
  });
  observer=new IntersectionObserver(entries=>{
   const visible=entries.filter(entry=>entry.isIntersecting);
   const current=visible[visible.length-1];
   if(!current)return;
   let active=null;
   toc.querySelectorAll('a').forEach(a=>{
    if(a.hash==='#'+current.target.id){a.setAttribute('aria-current','location');active=a;}
    else a.removeAttribute('aria-current');
   });
   if(!active)return;
   const viewport=toc.getBoundingClientRect();
   const item=active.getBoundingClientRect();
   let top=toc.scrollTop;
   if(item.top<viewport.top)top-=viewport.top-item.top;
   else if(item.bottom>viewport.bottom)top+=item.bottom-viewport.bottom;
   if(top!==toc.scrollTop)toc.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  },{rootMargin:'-5% 0px -65% 0px'});
  body.querySelectorAll('h2,h3').forEach(h=>observer.observe(h));status.hidden=true;position();
 }catch(error){
  if(error.name==='AbortError'||token!==request)return;
  status.textContent=locale==='zh'?'题目加载失败，请重试。':'Unable to load the problem statements. Please retry.';
  const retry=document.createElement('button');retry.type='button';retry.dataset.retry='';retry.textContent=locale==='zh'?'重试':'Retry';status.append(retry);
 }finally{if(token===request)body.removeAttribute('aria-busy');}
}
function change(values){const url=new URL(location.href);for(const [key,value]of Object.entries(values))url.searchParams.set(key,value);if(values.track){url.searchParams.delete('problem');url.hash='';}history.pushState(null,'',url);urlState();load();}
urlState();load();$('.problem-toc').open=!matchMedia('(max-width:760px)').matches;
document.addEventListener('click',async event=>{
 const lang=event.target.closest('[data-language]');if(lang){change({lang:lang.dataset.language});return;}
 const tab=event.target.closest('[data-archive-track]');if(tab){change({track:tab.dataset.archiveTrack});return;}
 if(event.target.closest('[data-retry]')){loaded='';load();return;}
 const copy=event.target.closest('[data-copy-markdown]');if(copy){
  const text=document.getElementById(`code-${track}-${copy.dataset.copyMarkdown}`).textContent;
  const message=$('.copy-status');try{await navigator.clipboard.writeText(text);message.textContent=locale==='zh'?'已复制到剪贴板':'Copied to clipboard';}catch{message.textContent=locale==='zh'?'请选中文字手动复制':'Please select and copy the text manually';}
  clearTimeout(timer);timer=setTimeout(()=>{message.textContent='';},2400);
 }
 const menu=event.target.closest('[data-menu]');if(menu){const open=$('.primary-nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));}
 if(event.target.closest('[data-register]')){
  const target=externalUrl(siteConfig.links.registration,locale);
  if(target&&!['upcoming','closed'].includes(siteConfig.registrationStatus))window.open(target,'_blank','noopener,noreferrer');
  else{$('.notice-title').textContent=translations[locale].registrationTitle;$('.notice-text').textContent=translations[locale].registrationPending;$('#entry-dialog').showModal();}
 }
 if(event.target.closest('[data-close]'))$('#entry-dialog').close();
});
for(const [selector,attribute,values]of [['.language','language',['zh','en']],['.archive-track-picker','archive-track',['ip','vip']]])$(selector).addEventListener('keydown',event=>{if(!['Home','End','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const value=values[['End','ArrowRight'].includes(event.key)?1:0];const button=$(`[data-${attribute}="${value}"]`);button.click();button.focus();});
window.addEventListener('popstate',()=>{urlState();load();});
