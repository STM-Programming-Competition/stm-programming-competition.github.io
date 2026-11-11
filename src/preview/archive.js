import { translations } from '../content/locales.js';
import { siteConfig } from '../config.js';
import { externalUrl } from '../lib/router.js';

const site = document.querySelector('.website');
let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
let codeLanguage = 'python';
let statusTimer;
const dialog = document.querySelector('#entry-dialog');
function render() {
  const t = translations[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  site.lang = document.documentElement.lang;
  document.title = language === 'zh' ? '2025 往届试题 | STM' : '2025 Past Problems | STM';
  document.querySelectorAll('[data-zh][data-en]').forEach(el => { el.textContent = el.dataset[language]; });
  document.querySelectorAll('[data-copy]').forEach(el => { if (t[el.dataset.copy]) el.textContent = t[el.dataset.copy]; });
  document.querySelectorAll('[data-page]').forEach(el => { el.href = `./index.html#/${language}/${el.dataset.page === 'home' ? '' : el.dataset.page}`; });
  document.querySelector('[data-back]').href = `./index.html#/${language}/rules?section=past`;
  document.querySelector('.language').dataset.locale = language;
  document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === language)));
  document.querySelector('.footer-path').textContent = `/past-problems?lang=${language}`;
  document.querySelector('.primary-nav [data-page=rules]').setAttribute('aria-current','page');
}
render();
document.querySelector('.problem-toc').open = !matchMedia('(max-width:760px)').matches;
document.addEventListener('click', async event => {
  const lang = event.target.closest('[data-language]');
  if (lang) {
    language = lang.dataset.language;
    const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url);
    render(); return;
  }
  const menu = event.target.closest('[data-menu]');
  if (menu) { const open = document.querySelector('.primary-nav').classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); }
  const tab = event.target.closest('[data-code-tab]');
  if (tab) {
    codeLanguage = tab.dataset.codeTab;
    document.querySelectorAll('[data-code-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.codeTab===codeLanguage)));
    document.querySelectorAll('[data-snippet]').forEach(el=>{el.hidden=el.dataset.snippet!==codeLanguage;});
  }
  const copy = event.target.closest('[data-copy-code]');
  if (copy) {
    const target = copy.dataset.copyCode === 'solution-code'
      ? document.querySelector(`[data-snippet="${codeLanguage}"] pre`) : document.getElementById(copy.dataset.copyCode);
    const status = document.querySelector('.copy-status');
    try { await navigator.clipboard.writeText(target.textContent); status.textContent=language==='zh'?'已复制到剪贴板':'Copied to clipboard'; }
    catch { status.textContent=language==='zh'?'请选中文字手动复制':'Please select the text and copy manually'; }
    clearTimeout(statusTimer); statusTimer=setTimeout(()=>{status.textContent='';},2400);
  }
  if (event.target.closest('[data-register]')) {
    const url=externalUrl(siteConfig.links.registration,language);
    if(url && !['upcoming','closed'].includes(siteConfig.registrationStatus)) { window.open(url,'_blank','noopener,noreferrer');return; }
    document.querySelector('.notice-title').textContent=translations[language].registrationTitle;
    document.querySelector('.notice-text').textContent=translations[language].registrationPending;
    dialog.showModal();
  }
  if(event.target.closest('[data-close]'))dialog.close();
});
document.querySelector('.language').addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();document.querySelector(`[data-language="${['Home','ArrowLeft'].includes(event.key)?'zh':'en'}"]`).click();
});
const observer = new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
    document.querySelectorAll('.problem-toc a').forEach(a=>{if(a.hash===`#${entry.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
},{rootMargin:'-5% 0px -60% 0px'});
document.querySelectorAll('.problem-article>section').forEach(section=>observer.observe(section));

let archiveTrack=new URLSearchParams(location.search).get('track')==='vip'?'vip':'ip';
let question=new URLSearchParams(location.search).get('problem')||(archiveTrack==='vip'?'hypnos':'prime');
function archiveRender(){
  if(!document.querySelector(`[data-problem="${question}"][data-track="${archiveTrack}"]`))question=archiveTrack==='vip'?'hypnos':'prime';
  document.querySelectorAll('[data-problem]').forEach(el=>el.hidden=el.dataset.problem!==question);
  document.querySelector('[data-ip-intro]').hidden=archiveTrack!=='ip';
  document.querySelectorAll('[data-question]').forEach(el=>{el.hidden=el.dataset.track!==archiveTrack;el.href=`?lang=${language}&track=${el.dataset.track}&problem=${el.dataset.question}`;if(el.dataset.question===question)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  document.querySelectorAll('[data-archive-track]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.archiveTrack===archiveTrack)));
  document.querySelector('.archive-track-picker').dataset.track=archiveTrack==='vip'?'b':'a';
  document.querySelector('.archive-track-picker').setAttribute('aria-label',language==='zh'?'选择赛道':'Choose a track');
  const url=new URL(location.href);url.searchParams.set('lang',language);url.searchParams.set('track',archiveTrack);url.searchParams.set('problem',question);history.replaceState(null,'',url);
}
archiveRender();
document.addEventListener('click',event=>{
 const track=event.target.closest('[data-archive-track]');const selected=event.target.closest('[data-question]');
 if(selected){event.preventDefault();question=selected.dataset.question;}
 if(track){archiveTrack=track.dataset.archiveTrack;question=archiveTrack==='vip'?'hypnos':'prime';}
 if(track||selected||event.target.closest('[data-language]'))archiveRender();
 if(selected)document.querySelector('.problem-article').scrollIntoView({block:'start',behavior:'instant'});
});

document.querySelector('.archive-track-picker').addEventListener('keydown',event=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 event.preventDefault();
 const track=['ArrowLeft','Home'].includes(event.key)?'ip':'vip';
 document.querySelector(`[data-archive-track="${track}"]`).click();
 document.querySelector(`[data-archive-track="${track}"]`).focus();
});
