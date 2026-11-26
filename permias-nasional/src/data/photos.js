import credits from './imageCredits.json';
import { publicUrl } from '../utils/site.js';

/**
 * Free-licensed photos (Wikimedia Commons), re-encoded from the originals as WebP at 800/1200/1600/2400 px.
 * `srcSet` lists every size so the browser picks by viewport and pixel density; `w`/`h` are the intrinsic size
 * (for width/height attributes). Attribution lives in imageCredits.json and public/images/CREDITS.md.
 */
export function photo(slug) {
  const c = credits[slug];
  if (!c) return null;
  const files = c.files || {};
  const widths = Object.keys(files)
    .map(Number)
    .sort((a, b) => a - b);
  const at = (min) => publicUrl(files[String(widths.find((w) => w >= min) ?? widths[widths.length - 1])]);
  const [w, h] = c.size || [1600, 1067];
  return {
    slug,
    src: at(1600),
    small: at(800),
    srcSet: widths.map((x) => `${publicUrl(files[String(x)])} ${x}w`).join(', '),
    w,
    h,
    alt: c.subject,
    artist: cleanArtist(c.artist),
    license: c.license,
    page: c.page,
  };
}

function cleanArtist(a) {
  if (!a) return 'Wikimedia Commons';
  const s = a.replace(/^File:.*?:\s*/, '').replace(/\s+/g, ' ').trim();
  return s || 'Wikimedia Commons';
}

export const PAGE_PHOTOS = {
  about: 'campus-columbia-low',
  team: 'campus-uw-quad',
  sejarah: 'us-lincoln-reflecting',
  resources: 'campus-stanford',
  partners: 'us-brooklyn-bridge',
  contact: 'seattle-kerry-park',
  events: 'chicago-skyline',
  register: 'campus-mit-dome',
  embassies: 'dc-capitol',
  visa: 'nyc-empire-state',
  academics: 'campus-cornell',
  jobs: 'pittsburgh-night',
  research: 'campus-purdue',
  scholarships: 'campus-ucla-royce',
  entrepreneurship: 'boston-skyline',
  cultural: 'id-prambanan',
};
