import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderMarkdown } from '../src/lib/markdown.js';

test('the actual IP file renders all questions and preserves the unnumbered samples',async()=>{
 const source=await readFile(new URL('../src/content/problems/2025-ip-track.md',import.meta.url),'utf8');
 const {html,toc}=renderMarkdown(source);
 assert.equal(toc.filter(h=>h.level===2).length,3);
 assert.match(html,/20 4\n1 2 5 10/);
 assert.match(html,/5\n7\n11\n101/);
 assert.equal(new Set(toc.map(h=>h.id)).size,toc.length);
 assert.ok(toc.some(h=>h.id==='md-level-2-the-scroll-of-unveiling'));
});
test('the actual VIP file renders GFM tables and numbered LaTeX without errors',async()=>{
 const source=await readFile(new URL('../src/content/problems/2025-vip-track.md',import.meta.url),'utf8');
 const {html,toc}=renderMarkdown(source);
 assert.match(html,/<table>/);assert.match(html,/class="katex"/);assert.match(html,/<math /);
 assert.doesNotMatch(html,/katex-error/);assert.match(html,/3\.6/);assert.ok(toc.some(h=>h.title==='Example Input'));
});
test('code is escaped and highlighted while raw HTML and unsafe links are not executable',()=>{
 const {html}=renderMarkdown('```python\nprint("<script>")\n```\n\n<script>alert(1)</script>\n\n[x](javascript:alert%281%29)');
 assert.match(html,/hljs/);assert.match(html,/(?:&lt;|&#x3C;)script/);assert.doesNotMatch(html,/<script>|href="javascript:/);
});
