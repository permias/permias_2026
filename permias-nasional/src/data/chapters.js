import chapterDirectory from './chapterDirectory.json';

/** @typedef {typeof chapterDirectory[number]} Chapter */

export const REGIONS = ['East Coast', 'Midwest', 'South', 'West Coast'];

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
