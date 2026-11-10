// STM interaction draft v1. Local-only review prototype; no network requests.
(() => {
  const root = document.getElementById('stm-wireframes');
  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const overlay = $('.preview-overlay');
  const site = $('.site');
  let previousFocus = null;
  let state = {page:'home', track:'a', view:'pages', device:'desktop', lang:'zh'};
  const paths = {home:'/',rules:'/rules',about:'/about'};
  const titles = {home:'主页',rules:'赛制详情',about:'介绍 About'};
  const english = {
    '编程大赛':'Programming Competition', '主页':'Home', '赛制详情':'Rules', '介绍':'About', '菜单':'Menu',
    '立即报名 ↗':'Register ↗', '支持单位':'Supported by', '赞助商 LOGO':'SPONSOR LOGO',
    '活动简介：面向哪些学生、挑战什么问题，以及参赛可以获得什么。':'Event introduction: who can take part, the challenges, and what participants can gain.',
    '了解赛制 →':'Explore the rules →', '赛事主视觉 / 海报':'Event artwork / poster', '图片占位':'Image placeholder',
    '比赛时间':'Date & time', '日期与时段待定':'Date and time to be confirmed', '比赛地点':'Venue', '校区 / 场地待定':'Campus / venue to be confirmed',
    '报名截止':'Registration deadline', '截止时间待定':'Deadline to be confirmed', '选择你的赛道':'Choose your track',
    '赛道名称及数量示意，按实际配置调整。':'Track names and number shown for layout purposes only.',
    '赛道 A · 名称待定':'Track A · Name to be confirmed', '赛道 B · 名称待定':'Track B · Name to be confirmed',
    '一句话说明适合对象与挑战方向。':'A brief introduction to the intended participants and challenge.',
    '一句话说明与另一赛道的区别。':'A brief explanation of how this track differs from the other.',
    '查看本赛道规则 →':'View track rules →', '奖项与奖品':'Awards & prizes', '奖项名称':'Award', '待公布':'To be announced',
    '获奖名额':'Number of winners', '奖金 / 奖品 / 证书':'Prizes / certificates', '参赛前，了解更多':'Before you take part',
    '常见问题':'FAQs', '去年赛题参考':'Last year’s problems', '认识策划团队':'Meet the team',
    '比赛信息':'Competition information', '本期规则、常见问题与往届参考资料。':'This year’s rules, frequently asked questions, and past problems.',
    '本期赛制':'This year’s rules', '赛道 A':'Track A', '赛道 B':'Track B',
    '参赛资格':'Eligibility', '面向对象、年级及基础要求待确认。':'Eligible students, year groups, and prerequisites to be confirmed.',
    '组队方式':'Teams', '个人 / 团队、人数限制待确认。':'Individual or team entry and team sizes to be confirmed.',
    '比赛形式':'Format', '时长、语言、设备与允许使用的资料待确认。':'Duration, languages, equipment, and permitted resources to be confirmed.',
    '评分与提交':'Scoring & submission', '评审标准、提交内容与截止时间待确认。':'Judging criteria, required submissions, and deadlines to be confirmed.',
    '参赛流程':'Competition schedule', '报名':'Registration', '日期待定':'Date to be confirmed', '参赛':'Competition', '评审 / 颁奖':'Judging / awards',
    '问题为排版示意，答案以最终规则为准。':'Example questions for the wireframe. Answers will follow the final rules.',
    '没有编程基础可以参加吗？':'Can I join without programming experience?',
    '此处说明适合的赛道、最低基础要求与准备建议。具体内容待确认。':'Suitable tracks, prerequisites, and preparation advice will be listed here. Details to be confirmed.',
    '可以跨专业或跨年级组队吗？':'Can teams include different majors or year groups?',
    '此处说明组队人数、跨专业及跨年级限制。具体内容待确认。':'Team size and any restrictions on majors or year groups will be listed here. Details to be confirmed.',
    '比赛需要自带电脑吗？':'Do I need to bring a laptop?',
    '此处列出设备、开发环境与现场网络要求。具体内容待确认。':'Equipment, development environment, and network requirements will be listed here. Details to be confirmed.',
    '如何报名，报名后如何接收通知？':'How do I register and receive updates?',
    '此处说明报名表入口、报名确认方式和后续通知渠道。具体内容待确认。':'Registration, confirmation, and update channels will be explained here. Details to be confirmed.',
    '仅供了解题目形式与难度，本期规则以本页为准。':'For reference on format and difficulty. This year’s rules take precedence.',
    '去年赛题资料':'Last year’s materials', '题目说明 / 样例 / 附件':'Problem statements / examples / attachments', '查看资料 ↗':'View materials ↗',
    '准备好参加了吗？':'Ready to take part?', '关于 STM':'ABOUT STM', '从比赛，':'Code together.', '到共同成长。':'Grow together.',
    '活动定位与初衷：为什么发起 STM 编程大赛。':'Our purpose: why the STM Programming Competition was created.',
    '活动发展历程':'Our story', '创办年份':'Founding year', '第一届活动':'The first competition', '创办背景与最初目标，内容待补充。':'The founding story and original goals will appear here.',
    '往届年份':'Past editions', '成长与变化':'Growth & change', '重要赛制变化、活动成果或关键事件，内容待补充。':'Key changes, achievements, and milestones will appear here.',
    '本届':'This edition', '本期 STM 编程大赛':'This year’s STM competition', '本届亮点与延续的活动理念，内容待补充。':'This year’s highlights and continuing aims will appear here.',
    '策划团队':'Organising team', '按职责分组，成员数量与名单待确认。':'Grouped by role. Members and team size to be confirmed.',
    '统筹策划':'Coordination & planning', '成员姓名 · 职责':'Member name · Role', '赛题与评审':'Problems & judging', '宣传与设计':'Publicity & design', '现场与技术支持':'Event & technical support',
    '查看本期赛制 →':'View this year’s rules →', '赞助与支持':'Sponsors & supporters', '活动联系渠道 · 待补充':'Contact details · To be added', '返回顶部 ↑':'Back to top ↑',
    '报名入口预览':'Registration preview', '关闭 ×':'Close ×', '链接待提供':'Link to be added',
    'STM，返回主页':'STM, return to home', '网站主导航':'Main navigation', '选择语言':'Choose language',
    '主页草图':'Home wireframe', '赛制详情草图':'Rules wireframe', '介绍页草图':'About wireframe',
    '赛事主视觉或海报占位':'Event artwork or poster placeholder', '赛制页内导航':'On this page', '赛道规则':'Track rules',
    '关闭预览':'Close preview', 'STM 网站原型':'STM website prototype'
  };
  const textBindings = [];
  const walker = document.createTreeWalker(site, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const original = node.nodeValue;
    const key = original.trim();
    if (Object.hasOwn(english,key)) textBindings.push({node,original,translated:original.replace(key,english[key])});
  }
  const labelBindings = [...site.querySelectorAll('[aria-label]'),site].filter(el=>el.hasAttribute('aria-label')).map(el=>({el,original:el.getAttribute('aria-label')}));
  function localize() {
    site.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    textBindings.forEach(binding=>binding.node.nodeValue = state.lang === 'en' ? binding.translated : binding.original);
    labelBindings.forEach(({el,original})=>el.setAttribute('aria-label',state.lang === 'en' ? (english[original] || original) : original));
    $$('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===state.lang)));
    // The language selector deliberately names each language in that language.
    $$('[data-route]').forEach(el=>el.setAttribute('href','#/'+state.lang+(paths[el.dataset.route] || '/')));
    $('.selected-track-title').textContent = state.lang === 'en' ? 'Track '+state.track.toUpperCase()+' · Rules' : '赛道 '+state.track.toUpperCase()+' · 规则说明';
    // A shorter label keeps the brand readable beside the desktop navigation.
    $$('.brand-caption').forEach(el=>el.textContent=state.lang==='en'?'Competition':'编程大赛');
    $('.footer-nav [data-route=about]').textContent=state.lang==='en'?'About':'介绍';
    $('.wireframe-label').textContent=state.lang==='en'?'Wireframe · Content to be confirmed':'线框示意 · 非最终视觉';
  }
  function restore(value) {
    const saved = value?.privateContent;
    if (!saved) return;
    if (paths[saved.page]) state.page = saved.page;
    if (['a','b'].includes(saved.track)) state.track = saved.track;
    if (['pages','flow'].includes(saved.view)) state.view = saved.view;
    if (['desktop','mobile'].includes(saved.device)) state.device = saved.device;
    if (['zh','en'].includes(saved.lang)) state.lang = saved.lang;
  }
  function save() {
    try { localStorage.setItem('stm-prototype-v1', JSON.stringify({privateContent:state})); } catch { /* Private browsing or file storage may be unavailable. */ }
  }
  function render() {
    $$('[data-page]').forEach(el => el.hidden = el.dataset.page !== state.page);
    $$('a[data-route]').forEach(el => {
      if (el.closest('.site-nav') && el.dataset.route === state.page) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    $('.route-label').textContent = 'STM /' + state.lang + paths[state.page];
    $('.pages-view').hidden = state.view !== 'pages';
    $('.flow-view').hidden = state.view !== 'flow';
    $('.device-controls').hidden = state.view !== 'pages';
    $$('[data-view]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.view === state.view)));
    $$('[data-device]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.device === state.device)));
    root.classList.toggle('mobile', state.device === 'mobile');
    $$('[data-track-tab]').forEach(el => el.setAttribute('aria-selected',String(el.dataset.trackTab === state.track)));
    $('.selected-track-title').textContent = '赛道 ' + state.track.toUpperCase() + ' · 规则说明';
    $('#stm-track-panel').setAttribute('aria-labelledby', 'stm-track-' + state.track);
    localize();
  }
  function jump(section) {
    const el = section ? $('#stm-' + section) : $('.browser-bar');
    el?.scrollIntoView({block:'start',behavior:'instant'});
  }
  function route(page, section, track) {
    if (!paths[page]) return;
    state.page = page; state.view = 'pages';
    if (track) state.track = track;
    $('.site-nav').classList.remove('open');
    $('.menu-toggle').setAttribute('aria-expanded','false');
    render(); save();
    $('.sr-status').textContent = state.lang === 'en' ? 'Opened '+({home:'Home',rules:'Rules',about:'About'}[page]) : '已切换至' + titles[page];
    jump(section);
  }
  function openPreview(kind, trigger) {
    previousFocus = trigger;
    const registration = kind === 'registration';
    $('#stm-dialog-title').textContent = registration ? '报名入口预览' : '去年赛题入口预览';
    $('.dialog-copy').textContent = registration ? '正式页面点击报名后，在新标签页打开外部报名表。赛事网站只负责展示和引导。' : '正式页面可在新标签页打开资料页或 PDF，并提供附件下载。';
    $('.destination-slot').textContent = registration ? '外部报名表链接 · 待提供' : '去年赛题文件或资料链接 · 待提供';
    $('[data-destination]').textContent = registration ? '报名表待接入' : '赛题资料待接入';
    if(state.lang==='en') {
      $('#stm-dialog-title').textContent=registration?'Registration preview':'Past materials preview';
      $('.dialog-copy').textContent=registration?'The live website will open an external registration form in a new tab. This site provides event information and links.':'The live website will open the resource page or PDF in a new tab, with attachments available to download.';
      $('.destination-slot').textContent=registration?'External registration form · Link to be added':'Past problems or resource page · Link to be added';
      $('[data-destination]').textContent=registration?'Registration form to be linked':'Materials to be linked';
    }
    overlay.hidden = false;
    site.querySelectorAll(':scope > header, :scope > .sponsor-strip, :scope > main, :scope > footer').forEach(el=>el.inert=true);
    jump();
    $('[data-close]').focus({preventScroll:true});
  }
  function closePreview() {
    overlay.hidden = true;
    site.querySelectorAll('[inert]').forEach(el=>el.inert=false);
    previousFocus?.focus({preventScroll:true});
  }
  root.addEventListener('click', event => {
    const language = event.target.closest('[data-lang]');
    if(language){state.lang=language.dataset.lang;render();save();$('.sr-status').textContent=state.lang==='en'?'Language changed to English':'已切换至中文';return;}
    const link = event.target.closest('[data-route]');
    if (link) {event.preventDefault(); route(link.dataset.route,link.dataset.section,link.dataset.track);return;}
    const view = event.target.closest('[data-view]');
    if(view){state.view=view.dataset.view;render();save();return;}
    const device = event.target.closest('[data-device]');
    if(device){state.device=device.dataset.device;render();save();return;}
    const page = event.target.closest('[data-open-page]');
    if(page){route(page.dataset.openPage);return;}
    const tab = event.target.closest('[data-track-tab]');
    if(tab){state.track=tab.dataset.trackTab;render();save();return;}
    const anchor = event.target.closest('[data-jump]');
    if(anchor){event.preventDefault();jump(anchor.dataset.jump);return;}
    if(event.target.closest('[data-register]')){openPreview('registration',event.target.closest('[data-register]'));return;}
    if(event.target.closest('[data-resource]')){openPreview('resource',event.target.closest('[data-resource]'));return;}
    if(event.target.closest('[data-close]') || event.target === overlay){closePreview();return;}
    if(event.target.closest('.menu-toggle')){
      const open=$('.site-nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));return;
    }
    if(event.target.closest('[data-top]')) jump();
  });
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape' && !overlay.hidden){closePreview();return;}
    const tab = event.target.closest('[data-track-tab]');
    if(tab && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();state.track=event.key==='Home'?'a':event.key==='End'?'b':state.track==='a'?'b':'a';render();save();$('#stm-track-'+state.track).focus();
    }
    if(event.key==='Tab' && !overlay.hidden){event.preventDefault();$('[data-close]').focus();}
  });
  try { restore(JSON.parse(localStorage.getItem('stm-prototype-v1') || 'null')); } catch { /* Use the default view if storage is unavailable. */ }
  render();
})();
