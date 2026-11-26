import { chapters, distanceKm } from '../data/chapters.js';
import { photo } from '../data/photos.js';
import { publicUrl } from '../utils/site.js';
import { isRegional } from './campus.js';

// chapterMedia.json is written by the media collector; the site works with or without it.
const mediaModules = import.meta.glob('../data/chapterMedia.json', { eager: true, import: 'default' });
const MEDIA = Object.values(mediaModules)[0] || {};

export const chapterSlug = (c) => c.id.replace(/^c-/, '');
export const chapterPath = (c) => `/chapters/${chapterSlug(c)}`;
export const chapterBySlug = (slug) => chapters.find((c) => chapterSlug(c) === slug || c.id === slug);

/**
 * { logo: {src,w,h,source} | null, photos: [{src,alt,w,h,source,graphic?}], checked, note } with public URLs resolved.
 * `graphic` marks collages and text graphics: they stay in galleries (after the clean photos), never in hero or card positions.
 */
export function chapterMedia(c) {
  const m = MEDIA[c.id];
  if (!m) return { logo: null, photos: [], checked: null, note: null };
  const fix = (x) => (x && x.src ? { ...x, src: x.src.startsWith('http') ? x.src : publicUrl(x.src) } : null);
  const photos = (m.photos || []).map(fix).filter(Boolean);
  return {
    logo: fix(m.logo),
    photos: [...photos.filter((p) => !p.graphic), ...photos.filter((p) => p.graphic)],
    checked: m.checked || null,
    note: m.note || null,
  };
}

/** A clean (non-collage) landscape photo the chapter posted, or null. */
export function cleanWidePhoto(c, minRatio = 1.2) {
  return chapterMedia(c).photos.find((p) => !p.graphic && p.w && p.h && p.w / p.h >= minRatio) || null;
}

/** Small card image: the chapter's own clean wide photo, else its campus or city photo. */
export function cardPhoto(c) {
  return cleanWidePhoto(c)?.src || placePhoto(c).small;
}

/** Two-letter monogram from the chapter name, skipping the shared "Permias" prefix. */
export function monogram(c) {
  const words = c.chapterName.replace(/^permias\s+/i, '').split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Campus photos we hold (Wikimedia Commons, credited in imageCredits.json), then city, then state, then region.
const CAMPUS = [
  [/berkeley|cal\b/i, 'berkeley-glade'],
  [/university of washington|^uw\b(?![\s–-]*madison)/i, 'campus-uw-quad'],
  [/harvard/i, 'harvard-yard-autumn'],
  [/\bmit\b|massachusetts institute/i, 'campus-mit-dome'],
  [/stanford/i, 'campus-stanford'],
  [/ucla|los angeles/i, 'campus-ucla-royce'],
  [/columbia/i, 'campus-columbia-low'],
  [/cornell/i, 'campus-cornell'],
  [/purdue/i, 'campus-purdue'],
  [/texas a&m/i, 'campus-tamu-academic'],
  [/ut austin|university of texas at austin/i, 'austin-ut-tower'],
];
const CITY = [
  [/boston|cambridge|medford|waltham|wellesley/i, 'boston-skyline'],
  [/chicago|evanston/i, 'chicago-skyline'],
  [/seattle|bellevue|tacoma/i, 'seattle-kerry-park'],
  [/new york|brooklyn/i, 'nyc-empire-state'],
  [/los angeles|pasadena|irvine|santa monica|malibu|long beach|claremont|la mirada|la jolla|san diego/i, 'la-skyline'],
  [/pittsburgh/i, 'pittsburgh-night'],
  [/washington|arlington|baltimore/i, 'dc-capitol'],
  [/san francisco|oakland|palo alto|san jose|davis/i, 'golden-gate-sunset'],
  [/atlanta/i, 'atlanta-skyline'],
  [/houston/i, 'houston-night'],
  [/honolulu|laie/i, 'honolulu-diamond-head'],
  [/phoenix|tucson|tempe/i, 'phoenix-skyline'],
  [/salt lake/i, 'salt-lake-city'],
  [/denver|boulder|golden/i, 'denver-skyline'],
];
const STATE = { ca: 'golden-gate-sunset', ny: 'us-liberty', ma: 'boston-skyline', il: 'chicago-skyline', wa: 'seattle-kerry-park', pa: 'pittsburgh-night', dc: 'dc-capitol', md: 'dc-capitol', va: 'dc-capitol', nj: 'us-brooklyn-bridge', in: 'campus-purdue', tx: 'houston-night', ga: 'atlanta-skyline', hi: 'honolulu-diamond-head', az: 'phoenix-skyline', ut: 'salt-lake-city', co: 'denver-skyline', or: 'seattle-kerry-park' };
const REGION = { 'East Coast': 'us-brooklyn-bridge', Midwest: 'chicago-skyline', South: 'atlanta-skyline', 'West Coast': 'golden-gate-sunset' };

/** The best photo we have for a chapter's place: { slug, kind: 'campus'|'city'|'region', ...photo() }. */
export function placePhoto(c) {
  const uni = `${c.university} ${c.universityFull || ''}`;
  if (!isRegional(c)) {
    const hit = CAMPUS.find(([re]) => re.test(uni));
    if (hit) return { ...photo(hit[1]), kind: 'campus' };
  }
  const city = CITY.find(([re]) => re.test(c.city));
  if (city) return { ...photo(city[1]), kind: 'city' };
  if (STATE[c.stateId]) return { ...photo(STATE[c.stateId]), kind: 'city' };
  return { ...photo(REGION[c.region] || 'us-brooklyn-bridge'), kind: 'region' };
}

/**
 * The hero image for a chapter page. The chapter's own photo only when it is a clean landscape shot at least 1600 px wide
 * (Instagram's 1080 px posts look soft full-bleed); otherwise the high-resolution campus or city photo. Chapter photos
 * still appear in the gallery below.
 */
export function heroImage(c) {
  const own = cleanWidePhoto(c, 1.3);
  if (own && own.w >= 1600) return { src: own.src, srcSet: undefined, w: own.w, h: own.h, alt: own.alt || c.chapterName, source: own.source, own: true };
  const p = placePhoto(c);
  return { src: p.src, srcSet: p.srcSet, w: p.w, h: p.h, alt: p.alt, artist: p.artist, license: p.license, page: p.page, own: false, kind: p.kind };
}

export function nearbyChapters(c, limit = 4) {
  if (typeof c.lat !== 'number') return [];
  return chapters
    .filter((x) => x.id !== c.id && typeof x.lat === 'number')
    .map((x) => ({ ...x, km: distanceKm(c.lat, c.lng, x.lat, x.lng) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export const mediaCount = () => Object.values(MEDIA).filter((m) => m && (m.logo || (m.photos || []).length)).length;

/** Chapter photos for mosaics: wide shots first, one per chapter, spread across regions. */
export function featuredChapterPhotos(n = 5) {
  const rows = chapters
    .map((c) => ({ c, p: cleanWidePhoto(c) }))
    .filter((r) => r.p);
  const out = [];
  const regions = [...new Set(rows.map((r) => r.c.region))];
  for (let k = 0; out.length < n && k < rows.length; k++) {
    for (const reg of regions) {
      const r = rows.filter((x) => x.c.region === reg)[k];
      if (r && out.length < n) out.push(r);
    }
  }
  return out;
}
