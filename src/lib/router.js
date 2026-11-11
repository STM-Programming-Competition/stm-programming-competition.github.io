export const languages = ['zh', 'en'];
export const pages = ['home', 'rules', 'about'];
export const sections = ['competition', 'faq', 'past'];

/** Hash routes work on GitHub Pages without a server-side rewrite or a 404 fallback. */
export function parseRoute(hash, fallbackLanguage = 'en') {
  const fallback = languages.includes(fallbackLanguage) ? fallbackLanguage : 'en';
  const path = String(hash || '').replace(/^#/, '');
  const [pathname, query = ''] = path.split('?');
  const parts = pathname.split('/').filter(Boolean);
  const language = languages.includes(parts[0]) ? parts[0] : fallback;
  const page = pages.includes(parts[1]) ? parts[1] : 'home';
  const params = new URLSearchParams(query);
  const track = page === 'rules' && params.get('track') === 'b' ? 'b' : 'a';
  const section = page === 'rules' && sections.includes(params.get('section'))
    ? params.get('section') : '';
  return { language, page, track, section };
}

export function formatRoute({ language = 'en', page = 'home', track = 'a', section = '' }) {
  const lang = languages.includes(language) ? language : 'en';
  const currentPage = pages.includes(page) ? page : 'home';
  const params = new URLSearchParams();
  if (currentPage === 'rules') {
    if (track === 'b') params.set('track', 'b');
    if (sections.includes(section)) params.set('section', section);
  }
  const query = params.size ? `?${params}` : '';
  return `#/${lang}/${currentPage === 'home' ? '' : currentPage}${query}`;
}

export function externalUrl(links, language) {
  const value = links?.[language]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
