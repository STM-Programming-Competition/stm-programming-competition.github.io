import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, formatRoute, externalUrl } from '../src/lib/router.js';

test('shared rules URLs retain language, track, and target section after refresh', () => {
  const target = { language:'en', page:'rules', track:'b', section:'faq' };
  assert.deepEqual(parseRoute(formatRoute(target)), target);
});
test('language switching preserves the same rules context', () => {
  const target = parseRoute('#/zh/rules?track=b&section=past');
  assert.deepEqual(parseRoute(formatRoute({ ...target, language:'en' })), { ...target, language:'en' });
});
test('home and about links cannot carry stale rules parameters', () => {
  assert.equal(formatRoute({ language:'en', page:'about', track:'b', section:'faq' }), '#/en/about');
  assert.deepEqual(parseRoute('#/en/about?track=b&section=faq'), { language:'en', page:'about', track:'a', section:'' });
});
test('invalid routes and parameters safely fall back to valid content', () => {
  assert.deepEqual(parseRoute('#/xx/missing?track=bad&section=missing','en'), { language:'en', page:'home', track:'a', section:'' });
  assert.deepEqual(parseRoute('#/zh/rules?track=a&section=past'), { language:'zh', page:'rules', track:'a', section:'past' });
});
test('external entry points require a valid URL for the selected language', () => {
  assert.equal(externalUrl({ zh:'', en:'https://example.org/form' },'zh'), null);
  assert.equal(externalUrl({ en:'https://example.org/form' },'en'), 'https://example.org/form');
  assert.equal(externalUrl({ en:'javascript:alert(1)' },'en'), null);
  assert.equal(externalUrl({ en:'relative-path' },'en'), null);
});
