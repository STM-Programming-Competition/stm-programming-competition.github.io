import { initHero } from './lib/hero.js';
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
    return localStorage.getItem(storageKey) === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
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
    ['.hero h1', '.hero-description', '.competition-board', '.hero-actions', '.hero-art']
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
  $('.language').dataset.locale = route.language;
  $('.event-brand').setAttribute('aria-label', text.homeLabel);
  $('.top-partners').setAttribute('aria-label', text.partnersLabel);
  $('.track-picker').setAttribute('aria-label', text.trackPickerLabel);
  $('.track-picker').dataset.track = rememberedTrack;
  $('.rules-navigation').setAttribute('aria-label', route.language === 'en' ? 'On this page' : '本页目录');
  $('.signal-art').setAttribute('aria-label', text.signalArtLabel);
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
    // Animate only in-page navigation. Fresh deep links and page changes position immediately.
    const behavior = !initial && !pageChanged && !reducedMotion.matches ? 'smooth' : 'instant';
    document.getElementById(route.section)?.scrollIntoView({ block: 'start', behavior });
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
    if (target.section) document.getElementById(target.section)?.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
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
  if (resource) { window.location.href = `./past-problems.html?lang=${route.language}&track=${rememberedTrack === 'b' ? 'vip' : 'ip'}`; return; }
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
initHero($('.signal-hero'));

// Language is a two-option selection, not an on/off switch.
$('.language').addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const language = ['ArrowLeft', 'Home'].includes(event.key) ? 'zh' : 'en';
  navigate({ ...route, language, track: rememberedTrack });
  $(`[data-language="${language}"]`).focus();
});

// Mirror the language selector's keyboard controls while retaining hash navigation.
$('.track-picker').addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const track = ['ArrowLeft', 'Home'].includes(event.key) ? 'a' : 'b';
  navigate({ ...route, track });
  $(`[data-select-track="${track}"]`).focus();
});

/* ==========================================
   SECTION FOLDING + SCROLL PARALLAX
   ========================================== */

// Only target the main sections of each page.
// Do not change nested sections or FAQ details.
const sectionDefinitions = [
  {
    page: "home",
    selector: "section.hero",
    zh: "赛事总览",
    en: "Competition Overview"
  },
  {
    page: "home",
    selector: "section.tracks-section",
    zh: "比赛赛道",
    en: "Competition Tracks"
  },
  {
    page: "home",
    selector: "section.awards-section",
    zh: "奖项信息",
    en: "Awards"
  },
  {
    page: "rules",
    selector: "section#competition",
    zh: "比赛规则",
    en: "Competition Rules"
  },
  {
    page: "rules",
    selector: "section#faq",
    zh: "常见问题",
    en: "FAQ"
  },
  {
    page: "rules",
    selector: "section#past",
    zh: "往届赛题",
    en: "Past Problems"
  },
  {
    page: "about",
    selector: "section.story-section",
    zh: "赛事历程",
    en: "Our Story"
  },
  {
    page: "about",
    selector: "section.team-section",
    zh: "学术支持与组织团队",
    en: "Academic Support & Organising Team"
  }
];

const sectionFolds = [];
let foldScrollFrame = 0;

// Create folding controls without rewriting HTML.
function initSectionFolds() {
  sectionDefinitions.forEach((definition, index) => {
    const article = document.querySelector(
      `[data-screen="${definition.page}"]`
    );

    const section = article?.querySelector(
      `:scope > ${definition.selector}`
    );

    if (!section) {
      console.warn(
        "Section not found:",
        definition.page,
        definition.selector
      );
      return;
    }

    // Prevent duplicate controls.
    if (section.dataset.foldReady === "true") return;

    section.dataset.foldReady = "true";
    section.classList.add("section-fold-target");

    if (!section.id) {
      section.id = `fold-section-${index}`;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "section-fold-toggle";
    button.setAttribute("aria-controls", section.id);
    button.setAttribute("aria-expanded", "true");

    const title = document.createElement("span");
    title.className = "section-fold-title";

    const symbol = document.createElement("span");
    symbol.className = "section-fold-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = "−";

    button.append(title, symbol);
    section.before(button);

    const entry = {
      definition,
      section,
      button,
      title,
      symbol,
      animating: false
    };

    sectionFolds.push(entry);

    button.addEventListener("click", () => {
      if (entry.animating) return;
      setSectionExpanded(entry, section.hidden);
    });
  });

  updateSectionFoldLabels();
  requestSectionParallax();
}

// Expand or collapse an existing section.
async function setSectionExpanded(
  entry,
  expand,
  animate = true
) {
  if (entry.animating) return;

  const { section, button, symbol } = entry;

  button.setAttribute("aria-expanded", String(expand));
  symbol.textContent = expand ? "−" : "+";

  const shouldAnimate =
    animate &&
    !reducedMotion.matches &&
    typeof section.animate === "function";

  if (!shouldAnimate) {
    section.hidden = !expand;
    requestSectionParallax();
    return;
  }

  entry.animating = true;

  if (expand) section.hidden = false;

  const frames = expand
    ? [
        {
          opacity: 0,
          clipPath: "inset(0 0 100% 0)"
        },
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0)"
        }
      ]
    : [
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0)"
        },
        {
          opacity: 0,
          clipPath: "inset(0 0 100% 0)"
        }
      ];

  const animation = section.animate(frames, {
    duration: 300,
    easing: "cubic-bezier(.2,.75,.2,1)",
    fill: "forwards"
  });

  try {
    await animation.finished;
  } catch {
    // The animation may be interrupted.
  }

  if (!expand) section.hidden = true;

  animation.cancel();
  entry.animating = false;

  requestSectionParallax();
}

// Update folding titles when the language changes.
function updateSectionFoldLabels() {
  const language = route.language === "zh" ? "zh" : "en";

  sectionFolds.forEach((entry) => {
    entry.title.textContent =
      entry.definition[language];
  });
}

// Restore collapsed sections when following
// Rules / FAQ / Past Problems navigation links.
function openLinkedSection(sectionId) {
  const entry = sectionFolds.find(
    (item) => item.section.id === sectionId
  );

  if (entry && entry.section.hidden) {
    setSectionExpanded(entry, true, false);
    return true;
  }

  return false;
}

// Light scroll parallax.
// Uses the CSS translate property to avoid overriding
// existing transform animations.
function updateSectionParallax() {
  foldScrollFrame = 0;

  if (reducedMotion.matches) return;

  const visibleSections = sectionFolds.filter((entry) => {
    const article = entry.section.closest("[data-screen]");

    return (
      article &&
      !article.hidden &&
      !entry.section.hidden
    );
  });

  visibleSections.forEach((entry, index) => {
    const section = entry.section;
    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight || 1;

    if (rect.bottom < 0 || rect.top > viewport) {
      return;
    }

    const relativePosition =
      (rect.top + rect.height / 2 - viewport / 2) /
      viewport;

    const depth = 4 + (index % 3) * 2;

    const shift = Math.max(
      -10,
      Math.min(10, -relativePosition * depth)
    );

    section.style.setProperty(
      "--fold-parallax-y",
      `${shift.toFixed(1)}px`
    );
    entry.button.style.setProperty(
  "--fold-parallax-y",
  `${shift.toFixed(1)}px`
);
  });
}

function requestSectionParallax() {
  if (foldScrollFrame) return;

  foldScrollFrame = requestAnimationFrame(
    updateSectionParallax
  );
}

// Open Rules sections before normal navigation runs.
document.addEventListener(
  "click",
  (event) => {
    const link = event.target.closest(
      "a[data-section]"
    );

    if (link) {
      openLinkedSection(link.dataset.section);
    }
  },
  true
);

// Handle route changes, including browser back/forward.
window.addEventListener("hashchange", () => {
  updateSectionFoldLabels();

  const current = parseRoute(
    window.location.hash,
    route.language
  );

  if (current.page === "rules" && current.section) {
    const wasClosed = openLinkedSection(current.section);

    if (wasClosed) {
      requestAnimationFrame(() => {
        document.getElementById(
          current.section
        )?.scrollIntoView({
          behavior: reducedMotion.matches
            ? "instant"
            : "smooth",
          block: "start"
        });
      });
    }
  }

  requestSectionParallax();
});

window.addEventListener(
  "scroll",
  requestSectionParallax,
  { passive: true }
);

window.addEventListener(
  "resize",
  requestSectionParallax
);

// Start the enhancement after the original site setup.
initSectionFolds();

/* ==========================================
   INERTIAL TEXT SCROLL LAG
   ========================================== */


/* ======================================
   SMOOTH TEXT SCROLL LAG
   ====================================== */

function initTextScrollLag() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Text moves; cards and borders stay still.
  const selectors = [
    '[data-screen="home"] .hero h1',
    '[data-screen="home"] .hero-description',
    '[data-screen="home"] .section-heading h2',
    '[data-screen="home"] .awards-section h2',

    '[data-screen="rules"] .subpage-title h1',
    '[data-screen="rules"] .subpage-title p',
    '[data-screen="rules"] .selected-track',
    '[data-screen="rules"] .selected-track-description',
    '[data-screen="rules"] .rule-grid dt',
    '[data-screen="rules"] .rule-grid dd',

    '[data-screen="about"] .subpage-title h1',
    '[data-screen="about"] .story-timeline h3',
    '[data-screen="about"] .story-timeline p',
    '[data-screen="about"] .person-card h4',
    '[data-screen="about"] .person-bio'
  ];

  const elements = [
    ...document.querySelectorAll(selectors.join(","))
  ];

  elements.forEach(element => {
    element.classList.add("scroll-lag-text");
  });

  let previousScroll = window.scrollY;
  let velocity = 0;
  let displacement = 0;
  let frame = 0;

  // Animation parameters
  const strength = 0.35;
  const damping = 0.78;
  const follow = 0.18;
  const maxOffset = 14;

  function reset() {
    velocity = 0;
    displacement = 0;
    previousScroll = window.scrollY;

    elements.forEach(element => {
      element.style.removeProperty("--scroll-lag-y");
    });
  }

  function animate() {
    frame = 0;

    if (reducedMotion.matches) {
      reset();
      return;
    }

    velocity *= damping;
    displacement += (velocity - displacement) * follow;

    const offset = Math.max(
      -maxOffset,
      Math.min(maxOffset, displacement)
    );

    elements.forEach(element => {
      const page = element.closest("[data-screen]");
      const panel = element.closest(".section-fold-target");

      if (page?.hidden || panel?.hidden) {
        element.style.removeProperty("--scroll-lag-y");
        return;
      }

      const isHeading = element.matches("h1,h2,h3,h4");
      const depth = isHeading ? 1 : 0.6;

      element.style.setProperty(
        "--scroll-lag-y",
        `${(offset * depth).toFixed(2)}px`
      );
    });

    if (
      Math.abs(velocity) > 0.05 ||
      Math.abs(displacement) > 0.05
    ) {
      frame = requestAnimationFrame(animate);
    } else {
      reset();
    }
  }

  function onScroll() {
    const currentScroll = window.scrollY;
    const delta = currentScroll - previousScroll;
    previousScroll = currentScroll;

    if (reducedMotion.matches) return;

    velocity = Math.max(
      -28,
      Math.min(28, velocity + delta * strength)
    );

    if (!frame) {
      frame = requestAnimationFrame(animate);
    }
  }

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  window.addEventListener("hashchange", reset);
  reducedMotion.addEventListener?.("change", reset);
}

// Initialise only once
initTextScrollLag();


  function animateLag() {
    animationFrame = 0;

    if (motionQuery.matches) {
      smoothY = window.scrollY;
      resetLag();
      return;
    }

    const actualY = window.scrollY;

    const difference = actualY - smoothY;

    // Gradually follow the real scroll position.
    smoothY += difference * followSpeed;

    // Translate scroll difference into text lag.
    const offset = Math.max(
      -maxLag,
      Math.min(maxLag, difference * lagStrength)
    );

    elements.forEach((element, index) => {

      const page = element.closest(
        "[data-screen]"
      );

      const panel = element.closest(
        ".section-fold-target"
      );

      // Ignore hidden pages and collapsed panels.
      if (
        !page ||
        page.hidden ||
        (panel && panel.hidden)
      ) {
        element.style.removeProperty(
          "--scroll-lag-y"
        );
        return;
      }

      // Slightly different lag for each text group.
      const depth = 0.75 + (index % 3) * 0.12;

      const y = offset * depth;

      element.style.setProperty(
        "--scroll-lag-y",
        `${y.toFixed(2)}px`
      );

    });

    // Continue until the text catches up.
    if (Math.abs(difference) > 0.15) {
      animationFrame = requestAnimationFrame(
        animateLag
      );
    } else {
      smoothY = window.scrollY;
      resetLag();
    }
  }

  function requestLagAnimation() {
    if (animationFrame) return;

    animationFrame = requestAnimationFrame(
      animateLag
    );
  }

  // Native scrolling is preserved.
  window.addEventListener(
    "scroll",
    requestLagAnimation,
    { passive: true }
  );

  // Reset when switching pages.
  window.addEventListener("hashchange", () => {
    smoothY = window.scrollY;
    resetLag();
  });

  // Reset if reduced motion is enabled.
  motionQuery.addEventListener?.("change", () => {
    if (motionQuery.matches) {
      smoothY = window.scrollY;
      resetLag();
    }
  });
/* ==========================================
   UNIFIED TEXT SCROLL LAG — FULL SITE
   ========================================== */

function initUnifiedTextLag() {
  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const selector = [
    // fold titles
    '.section-fold-title',

    // HOME
    '[data-screen="home"] .hero h1',
    '[data-screen="home"] .hero-description',
    '[data-screen="home"] .section-heading h2',
    '[data-screen="home"] .section-heading p',
    '[data-screen="home"] .track-caption h3',
    '[data-screen="home"] .track-caption .track-role',
    '[data-screen="home"] .track-caption .track-description',
    '[data-screen="home"] .track-caption .track-arrow',
    '[data-screen="home"] .awards-section h2',
    '[data-screen="home"] .awards-section p',
    '[data-screen="home"] .awards-section .inline-link',

    // RULES
    '[data-screen="rules"] .subpage-title h1',
    '[data-screen="rules"] .subpage-title p',
    '[data-screen="rules"] .selected-track',
    '[data-screen="rules"] .selected-track-role',
    '[data-screen="rules"] .selected-track-description',
    '[data-screen="rules"] .rule-grid dt',
    '[data-screen="rules"] .rule-grid dd',
    '[data-screen="rules"] #faq summary',
    '[data-screen="rules"] #faq details p',
    '[data-screen="rules"] #past .past-section h2',
    '[data-screen="rules"] #past .past-section p',
    '[data-screen="rules"] #past .past-section .cta',

    // ABOUT
    '[data-screen="about"] .subpage-title h1',
    '[data-screen="about"] .subpage-title p',
    '[data-screen="about"] .story-section > h2',
    '[data-screen="about"] .story-timeline h3',
    '[data-screen="about"] .story-timeline p',
    '[data-screen="about"] .team-directory-header h2',
    '[data-screen="about"] .team-directory-header p',
    '[data-screen="about"] .team-group-title',
    '[data-screen="about"] .person-card h4',
    '[data-screen="about"] .person-bio'
  ].join(',');

  let targets = [];
  let lastScroll = window.scrollY;
  let targetOffset = 0;
  let currentOffset = 0;
  let frame = 0;

  // 统一参数：全站所有文字同一套速度
  const strength = 0.22;
  const follow = 0.16;
  const damping = 0.80;
  const maxOffset = 14;

  function collectTargets() {
    targets = [...document.querySelectorAll(selector)].filter((element) => {
      const page = element.closest('[data-screen]');
      return !!page;
    });

    targets.forEach((element) => {
      element.classList.add('st-unified-lag');
    });
  }

  function isVisibleTarget(element) {
    const page = element.closest('[data-screen]');
    const panel = element.closest('.section-fold-target');

    if (!page || page.hidden) return false;
    if (panel && panel.hidden) return false;

    return true;
  }

  function applyOffset(value) {
    targets.forEach((element) => {
      if (!isVisibleTarget(element)) {
        element.style.removeProperty('--st-unified-lag-y');
        return;
      }

      element.style.setProperty(
        '--st-unified-lag-y',
        `${value.toFixed(2)}px`
      );
    });
  }

  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    targetOffset = 0;
    currentOffset = 0;
    lastScroll = window.scrollY;
    applyOffset(0);
  }

  function tick() {
    frame = 0;

    targetOffset *= damping;
    currentOffset += (targetOffset - currentOffset) * follow;

    applyOffset(currentOffset);

    if (
      Math.abs(targetOffset) > 0.05 ||
      Math.abs(currentOffset) > 0.05
    ) {
      frame = requestAnimationFrame(tick);
    } else {
      reset();
    }
  }

  function onScroll() {
    if (motionQuery.matches) return;

    const now = window.scrollY;
    const delta = now - lastScroll;
    lastScroll = now;

    targetOffset = Math.max(
      -maxOffset,
      Math.min(maxOffset, targetOffset + delta * strength)
    );

    if (!frame) {
      frame = requestAnimationFrame(tick);
    }
  }

  function refreshTargets() {
    collectTargets();
    applyOffset(0);
  }

  // 初次收集
  collectTargets();
  applyOffset(0);

  // 滚动监听
  window.addEventListener('scroll', onScroll, {
    passive: true
  });

  // 路由切换后重新抓取
  window.addEventListener('hashchange', () => {
    refreshTargets();
    reset();
  });

  // 语言切换 / 动态插入折叠标题后重新抓取
  const observer = new MutationObserver(() => {
    refreshTargets();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  motionQuery.addEventListener?.('change', () => {
    if (motionQuery.matches) {
      reset();
    } else {
      refreshTargets();
    }
  });
}

initUnifiedTextLag();

// Initialise once.
