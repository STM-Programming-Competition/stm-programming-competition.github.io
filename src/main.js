import { translations } from './content/locales.js';
import { siteConfig } from './config.js';
import { externalUrl, formatRoute, parseRoute } from './lib/router.js';

const site = document.querySelector('.website');
const $ = (selector) => site.querySelector(selector);
const $$ = (selector) => [...site.querySelectorAll(selector)];
const copyElements = [...document.querySelectorAll('[data-copy]')];
const dialog = $('#entry-dialog');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const storageKey = 'stm-website-language';
let returnFocus = null;
let rememberedTrack = 'a';
let previousRoute = null;

function readLanguage() {
  try {
    return localStorage.getItem(storageKey) === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

let route = parseRoute(window.location.hash, readLanguage());
const copy = () => translations[route.language];

function rememberLanguage() {
  try { localStorage.setItem(storageKey, route.language); } catch { /* Optional preference only. */ }
}

function animatePage(initial = false) {
  if (reducedMotion.matches || typeof site.animate !== 'function') return;
  const article = $(`[data-screen="${route.page}"]`);
  if (initial && route.page === 'home') {
    ['.hero .event-name', '.hero h1', '.hero-description', '.hero-actions', '.hero-art']
      .forEach((selector, index) => {
        $(selector).animate([
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 360, delay: index * 45, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      });
  } else {
    article.animate([
      { opacity: 0.5, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 180, easing: 'ease-out' });
  }
}

function render() {
  const text = copy();
  const htmlLanguage = route.language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.lang = htmlLanguage;
  site.lang = htmlLanguage;
  copyElements.forEach((element) => {
    const value = text[element.dataset.copy];
    // The two display headings explicitly allow line breaks; all other copy is plain text.
    if (['rulesTitle', 'aboutTitle'].includes(element.dataset.copy)) {
      element.replaceChildren(...value.split('<br>').flatMap((line, index) =>
        index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
    } else {
      element.textContent = value;
    }
  });
  $$('[data-screen]').forEach((article) => { article.hidden = article.dataset.screen !== route.page; });
  $$('[data-page]').forEach((link) => {
    const target = {
      language: route.language,
      page: link.dataset.page,
      track: link.dataset.track || rememberedTrack,
    };
    link.href = formatRoute(target);
    if (link.closest('.primary-nav') && target.page === route.page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  $$('[data-section]').forEach((link) => {
    link.href = formatRoute({ ...route, page: 'rules', section: link.dataset.section });
  });
  $$('[data-language]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === route.language)));
  $$('[data-select-track]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.selectTrack === rememberedTrack)));
  $('.selected-track').textContent = rememberedTrack === 'b' ? text.trackB : text.trackA;
  $('.selected-track-role').textContent = rememberedTrack === 'b' ? text.trackBRole : text.trackARole;
  $('.selected-track-description').textContent = rememberedTrack === 'b' ? text.trackBDescription : text.trackADescription;
  $('.primary-nav').setAttribute('aria-label', text.mainNav);
  $('.language').setAttribute('aria-label', text.languageLabel);
  $('.event-brand').setAttribute('aria-label', text.homeLabel);
  $('.top-partners').setAttribute('aria-label', text.partnersLabel);
  $('.track-picker').setAttribute('aria-label', text.trackPickerLabel);
  $('.rules-navigation').setAttribute('aria-label', route.language === 'en' ? 'On this page' : '本页目录');
  $('.hero-art img').alt = text.posterAlt;
  $('.activity-mark').alt = route.language === 'en' ? 'STM competition logo' : 'STM 活动标识';
  $$('.uestc-mark').forEach((image) => { image.alt = route.language === 'en' ? 'University of Electronic Science and Technology of China' : '电子科技大学'; });
  $('.footer-path').textContent = formatRoute(route).slice(1);
  const pageTitle = text[`pageTitle${route.page[0].toUpperCase()}${route.page.slice(1)}`];
  document.title = `${text.eventName} | ${pageTitle}`;
  document.querySelector('meta[name="description"]').content = text.metaDescription;
  $('.screen-reader-status').textContent = text.openedPage + pageTitle;
  if (['upcoming', 'closed'].includes(siteConfig.registrationStatus)) {
    const label = siteConfig.registrationStatus === 'closed' ? text.registrationClosed : text.registrationNotOpen;
    $$('[data-register]').forEach((button) => { button.textContent = label; });
  }
}

function syncRoute({ initial = false } = {}) {
  const next = parseRoute(window.location.hash, route.language);
  if (next.page === 'rules') rememberedTrack = next.track;
  route = next;
  rememberLanguage();
  render();
  $('.primary-nav').classList.remove('open');
  $('[data-menu]').setAttribute('aria-expanded', 'false');
  const pageChanged = previousRoute && previousRoute.page !== route.page;
  const sectionChanged = route.section && (initial || previousRoute?.section !== route.section || pageChanged);
  if (sectionChanged) {
    document.getElementById(route.section)?.scrollIntoView({ block: 'start', behavior: 'instant' });
  } else if (pageChanged) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#main-content').focus({ preventScroll: true });
  }
  if (initial || pageChanged) animatePage(initial);
  previousRoute = { ...route };
}

function navigate(target) {
  const hash = formatRoute(target);
  if (window.location.hash === hash) {
    syncRoute();
    if (target.section) document.getElementById(target.section)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    window.location.hash = hash;
  }
}

function showEntry(kind, trigger) {
  const text = copy();
  const registration = kind === 'registration';
  const available = !registration || !['upcoming', 'closed'].includes(siteConfig.registrationStatus);
  const url = available ? externalUrl(siteConfig.links[kind === 'registration' ? 'registration' : 'pastProblems'], route.language) : null;
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  returnFocus = trigger;
  $('.notice-title').textContent = registration ? text.registrationTitle : text.resourcesTitle;
  $('.notice-text').textContent = registration
    ? siteConfig.registrationStatus === 'closed' ? text.registrationClosed
      : siteConfig.registrationStatus === 'upcoming' ? text.registrationNotOpen : text.registrationPending
    : text.resourcesPending;
  dialog.showModal();
}

site.addEventListener('click', (event) => {
  const pageLink = event.target.closest('a[data-page], a[data-section]');
  if (pageLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault();
    const target = parseRoute(new URL(pageLink.href).hash, route.language);
    navigate(target);
    return;
  }
  const language = event.target.closest('[data-language]');
  if (language) { navigate({ ...route, language: language.dataset.language, track: rememberedTrack }); return; }
  const track = event.target.closest('[data-select-track]');
  if (track) { navigate({ ...route, track: track.dataset.selectTrack }); return; }
  const menu = event.target.closest('[data-menu]');
  if (menu) {
    const open = $('.primary-nav').classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    return;
  }
  const registration = event.target.closest('[data-register]');
  if (registration) { showEntry('registration', registration); return; }
  const resource = event.target.closest('[data-resource]');
  if (resource) { showEntry('resources', resource); return; }
  if (event.target.closest('[data-close]')) dialog.close();
});

dialog.addEventListener('close', () => returnFocus?.focus({ preventScroll: true }));
site.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('.primary-nav').classList.contains('open')) {
    $('.primary-nav').classList.remove('open');
    $('[data-menu]').setAttribute('aria-expanded', 'false');
    $('[data-menu]').focus();
  }
});
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  $('#main-content').focus();
  $('#main-content').scrollIntoView({ block: 'start' });
});
window.addEventListener('hashchange', () => syncRoute());
if (!window.location.hash.startsWith('#/')) history.replaceState(null, '', formatRoute(route));
syncRoute({ initial: true });
