import chapterDirectory from './chapterDirectory.json';

/** @typedef {typeof chapterDirectory[number]} Chapter */

export const REGIONS = ['East Coast', 'Midwest', 'South', 'West Coast'];

export const REGION_LABELS = {
  'East Coast': { en: 'East Coast', id: 'Pesisir Timur' },
  Midwest: { en: 'Midwest', id: 'Midwest' },
  South: { en: 'South', id: 'Selatan' },
  'West Coast': { en: 'West Coast', id: 'Pesisir Barat' },
};

export const chapters = chapterDirectory;

export function chaptersByStateId() {
  const m = {};
  for (const c of chapters) {
    if (!m[c.stateId]) m[c.stateId] = [];
    m[c.stateId].push(c);
  }
  return m;
}

export const stateIdsWithChapters = [...new Set(chapters.map((c) => c.stateId))];

/** Count of US states (DC excluded) that have at least one chapter. */
export const stateCount = stateIdsWithChapters.filter((id) => id !== 'dc').length;
export const cityCount = new Set(chapters.map((c) => `${c.city}|${c.stateId}`)).size;

export function getStatesDropdown() {
  const by = chaptersByStateId();
  return Object.keys(by)
    .map((id) => ({
      id,
      label: by[id][0]?.state ?? id.toUpperCase(),
      count: by[id].length,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

const R = 6371;
const rad = (d) => (d * Math.PI) / 180;

/** Great-circle distance in km. */
export function distanceKm(aLat, aLng, bLat, bLng) {
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Chapters sorted by distance from a point, with `km` attached. */
export function nearestChapters(lat, lng, limit = 5) {
  return chapters
    .filter((c) => typeof c.lat === 'number')
    .map((c) => ({ ...c, km: distanceKm(lat, lng, c.lat, c.lng) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export function formatDistance(km, lang) {
  const miles = km * 0.621371;
  if (lang === 'id') return `${Math.round(km).toLocaleString('id-ID')} km`;
  return `${Math.round(miles).toLocaleString('en-US')} mi`;
}

export function instagramUrl(handle) {
  return handle ? `https://www.instagram.com/${handle.replace(/^@/, '')}/` : null;
}
