// GitHub Pages has no SPA rewrites: a deep link with no file behind it gets 404.html with HTTP 404 (a console error,
// and crawlers drop the page). Write the app shell into every route's folder so deep links answer 200, and keep
// 404.html as the fallback for anything else. Keep the static list in step with the routes in src/App.jsx.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resourceSections } from '../src/data/resources.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const chapters = JSON.parse(readFileSync(join(root, 'src/data/chapterDirectory.json'), 'utf8'));

const routes = [
  'chapters',
  'chapters/register',
  'about',
  'about/chapters',
  'about/team',
  'about/sejarah',
  'resources',
  'events',
  'team',
  'contact',
  'partners',
  ...resourceSections.map((s) => `resources/${s.id}`),
  ...chapters.map((c) => `chapters/${c.id.replace(/^c-/, '')}`),
];

const shell = join(dist, 'index.html');
copyFileSync(shell, join(dist, '404.html'));
for (const r of routes) {
  mkdirSync(join(dist, r), { recursive: true });
  copyFileSync(shell, join(dist, r, 'index.html'));
}
console.log(`route pages: ${routes.length} folders + 404.html`);
