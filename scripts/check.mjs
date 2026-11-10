import { access, readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { translations } from '../src/content/locales.js';

const root = fileURLToPath(new URL('../', import.meta.url));
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? filesIn(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}

export async function checkProject() {
  const html = await readFile(join(root, 'index.html'), 'utf8');
  const keys = [...html.matchAll(/data-copy="([^"]+)"/g)].map((match) => match[1]);
  for (const language of ['zh', 'en']) {
    for (const key of keys) {
      if (typeof translations[language][key] !== 'string') throw new Error(`Missing ${language} copy: ${key}`);
    }
  }
  if (Object.keys(translations.zh).sort().join() !== Object.keys(translations.en).sort().join()) {
    throw new Error('Language dictionaries must have the same keys.');
  }
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)) await access(join(root, match[1]));
  for (const file of await filesIn(join(root, 'src'))) {
    if (!file.endsWith('.js')) continue;
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr);
    const script = await readFile(file, 'utf8');
    if (script.includes('window.openai') || script.includes('new Tweak')) throw new Error('Host-only code in website source.');
  }
  console.log('Checked JavaScript syntax, bilingual copy, and local page assets.');
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await checkProject();
