import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { checkProject } from './check.mjs';
import { buildMarkdown } from './build-markdown.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
await buildMarkdown();
await checkProject();
// Only generated output is replaced. Git metadata and source files are never touched.
const output = join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'past-problems.html', 'src', '.nojekyll', 'LICENSE']) {
  await cp(join(root, name), join(output, name), { recursive: true });
}
console.log('Built static website in dist/. No runtime dependencies or remote assets.');
