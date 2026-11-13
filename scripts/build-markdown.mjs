import { build } from 'esbuild';
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../',import.meta.url));
export async function buildMarkdown() {
  await build({ absWorkingDir:root, entryPoints:['src/lib/markdown.js'], outfile:'src/assets/vendor/markdown/renderer.js', bundle:true, format:'esm', platform:'browser', target:'es2022', minify:true, legalComments:'eof' });
  await mkdir(root+'src/assets/vendor/katex',{recursive:true});
  await cp(root+'node_modules/katex/dist/katex.min.css',root+'src/assets/vendor/katex/katex.min.css');
  await cp(root+'node_modules/katex/dist/fonts',root+'src/assets/vendor/katex/fonts',{recursive:true});
  await cp(root+'node_modules/katex/LICENSE',root+'src/assets/vendor/katex/LICENSE');
  console.log('Built local Markdown, GFM, math, and code renderer.');
}
if(process.argv[1] === fileURLToPath(import.meta.url)) await buildMarkdown();
