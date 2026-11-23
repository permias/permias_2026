import credits from './imageCredits.json';
import { publicUrl } from '../utils/site.js';

/**
 * Free-licensed photos (Wikimedia Commons), optimized to webp at 1600/800 px.
 * Attribution lives in imageCredits.json and public/images/CREDITS.md.
 */
export function photo(slug) {
  const c = credits[slug];
  if (!c) return null;
  const files = c.files || {};
  return {
    slug,
    src: publicUrl(files['1600'] || files['800']),
    small: publicUrl(files['800'] || files['1600']),
    srcSet: [files['800'] && `${publicUrl(files['800'])} 800w`, files['1600'] && `${publicUrl(files['1600'])} 1600w`].filter(Boolean).join(', '),
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
