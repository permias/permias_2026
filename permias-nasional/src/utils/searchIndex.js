import { chapters, chaptersByStateId } from '../data/chapters.js';
import { posts } from '../data/posts.js';
import { flattenResourcesForSearch, resourceSections } from '../data/resources.js';
import { flattenTeamForSearch } from '../data/team.js';

/*
 * Instant fuzzy search across chapters, states, cities, universities, events, resources, team and pages.
 * - accent/case folding, "&" -> "and"
 * - EN/ID synonyms (beasiswa -> scholarship, kedutaan -> embassy, ...)
 * - per-token scoring: exact word > prefix > substring > typo (Damerau-Levenshtein) > subsequence
 * - every query token must match something (AND), results ranked by weighted score
 */

const STATE_ABBR = {
  al: 'alabama', ak: 'alaska', az: 'arizona', ar: 'arkansas', ca: 'california', co: 'colorado', ct: 'connecticut',
  de: 'delaware', dc: 'district of columbia washington dc', fl: 'florida', ga: 'georgia', hi: 'hawaii', id: 'idaho',
  il: 'illinois', in: 'indiana', ia: 'iowa', ks: 'kansas', ky: 'kentucky', la: 'louisiana', me: 'maine', md: 'maryland',
  ma: 'massachusetts', mi: 'michigan', mn: 'minnesota', ms: 'mississippi', mo: 'missouri', mt: 'montana', ne: 'nebraska',
  nv: 'nevada', nh: 'new hampshire', nj: 'new jersey', nm: 'new mexico', ny: 'new york', nc: 'north carolina',
  nd: 'north dakota', oh: 'ohio', ok: 'oklahoma', or: 'oregon', pa: 'pennsylvania', ri: 'rhode island',
  sc: 'south carolina', sd: 'south dakota', tn: 'tennessee', tx: 'texas', ut: 'utah', vt: 'vermont', va: 'virginia',
  wa: 'washington', wv: 'west virginia', wi: 'wisconsin', wy: 'wyoming',
};

/** Query-side synonyms: Indonesian (and common shorthand) -> words that appear in the index. */
const SYNONYMS = {
  beasiswa: 'scholarship', kedutaan: 'embassy', kbri: 'embassy', kjri: 'consulate', konsulat: 'consulate',
  perwakilan: 'embassy', acara: 'event', kegiatan: 'event', webinar: 'webinar', pengumuman: 'announcement',
  kerja: 'jobs', karir: 'jobs', karier: 'jobs', lowongan: 'jobs', magang: 'internship', riset: 'research',
  penelitian: 'research', budaya: 'cultural', akademik: 'academics', kuliah: 'university', kampus: 'campus',
  universitas: 'university', kewirausahaan: 'entrepreneurship', usaha: 'entrepreneurship', sejarah: 'history',
  tim: 'team', pengurus: 'team', mitra: 'partners', hubungi: 'contact', kontak: 'contact', daftar: 'register',
  pendaftaran: 'register', terdekat: 'near', dekat: 'near', kota: 'city', negara: 'state', bagian: '',
  visa: 'visa', paspor: 'passport', pelajar: 'student', mahasiswa: 'student', amerika: 'america', california: 'california',
  kalifornia: 'california', 'new york': 'new york', ny: 'new york', la: 'los angeles', sf: 'san francisco',
  nyc: 'new york', dc: 'washington', bay: 'bay area', socal: 'los angeles san diego', norcal: 'san francisco',
};

const UNI_ALIASES = {
  mit: 'massachusetts institute of technology', ucla: 'university of california los angeles', usc: 'university of southern california',
  nyu: 'new york university', uiuc: 'university of illinois urbana champaign', umich: 'university of michigan',
  uw: 'university of washington', ut: 'university of texas', tamu: 'texas a&m', cmu: 'carnegie mellon',
  bu: 'boston university', psu: 'penn state', osu: 'ohio state', msu: 'michigan state', gt: 'georgia tech',
  gsu: 'georgia state', ucsd: 'uc san diego', uci: 'uc irvine', ucb: 'uc berkeley', ucd: 'uc davis',
  jhu: 'johns hopkins', upenn: 'university of pennsylvania', pitt: 'university of pittsburgh', vt: 'virginia tech',
  wvu: 'west virginia university', umn: 'university of minnesota', uf: 'university of florida', ku: 'university of kansas',
  ou: 'university of oklahoma', wpi: 'worcester polytechnic', lmu: 'loyola marymount', smc: 'santa monica college',
  pcc: 'pasadena city college', csulb: 'cal state long beach', byu: 'brigham young', usf: 'university of san francisco',
  dvc: 'diablo valley college', nd: 'notre dame', iu: 'indiana university',
};

export function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[@#'’.]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(s) {
  return fold(s).split(' ').filter(Boolean);
}

/** Damerau-Levenshtein distance with early exit above `max`. */
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

function isSubsequence(q, w) {
  let i = 0;
  for (const ch of w) if (ch === q[i]) i++;
  return i === q.length;
}

function tokenScore(token, fieldWords, fieldText) {
  let best = 0;
  for (const w of fieldWords) {
    if (w === token) return 1;
    if (w.startsWith(token)) best = Math.max(best, token.length >= 2 ? 0.86 : 0.5);
    else if (token.length >= 3 && w.includes(token)) best = Math.max(best, 0.62);
    else if (token.length >= 4) {
      const max = token.length >= 7 ? 2 : 1;
      const dist = editDistance(token, w.slice(0, token.length + max), max);
      if (dist <= max) best = Math.max(best, 0.55 - dist * 0.08);
      else if (token.length >= 4 && w.length >= token.length && isSubsequence(token, w)) best = Math.max(best, 0.28);
    }
  }
  if (!best && token.length >= 3 && fieldText.includes(token)) best = 0.5;
  return best;
}

function expandQuery(q) {
  const folded = fold(q);
  if (!folded) return [];
  const raw = folded.split(' ');
  // each token becomes a group of alternatives; a group matches if any alternative matches
  return raw.map((tok) => {
    const alts = [tok];
    if (SYNONYMS[tok] !== undefined && SYNONYMS[tok] !== tok) alts.push(...words(SYNONYMS[tok]));
    if (STATE_ABBR[tok] && tok.length === 2) alts.push(...words(STATE_ABBR[tok]));
    if (UNI_ALIASES[tok]) alts.push(...words(UNI_ALIASES[tok]));
    return [...new Set(alts.filter(Boolean))];
  }).filter((g) => !(g.length === 1 && SYNONYMS[g[0]] === ''));
}

function prepare(item) {
  const fields = [
    { w: 1, text: item.title },
    { w: 0.75, text: item.subtitle },
    { w: 0.6, text: (item.keywords || []).join(' ') },
  ].map((f) => ({ ...f, folded: fold(f.text), words: words(f.text) }));
  return { ...item, _fields: fields };
}

const PAGES = [
  { id: 'p-home', title: { en: 'Home', id: 'Beranda' }, href: '/', kw: 'beranda home start' },
  { id: 'p-chapters', title: { en: 'Chapter map', id: 'Peta chapter' }, href: '/chapters', kw: 'map peta chapters directory near me terdekat find cari' },
  { id: 'p-register', title: { en: 'Register a chapter', id: 'Daftarkan chapter' }, href: '/chapters/register', kw: 'register daftar new club klub baru start mulai' },
  { id: 'p-events', title: { en: 'Events and posts', id: 'Acara dan pengumuman' }, href: '/events', kw: 'events acara announcements pengumuman webinar town hall' },
  { id: 'p-resources', title: { en: 'Student resources', id: 'Sumber daya mahasiswa' }, href: '/resources', kw: 'resources sumber daya guide panduan' },
  { id: 'p-team', title: { en: 'National team', id: 'Tim nasional' }, href: '/team', kw: 'team tim pengurus board leadership' },
  { id: 'p-about', title: { en: 'About PERMIAS', id: 'Tentang PERMIAS' }, href: '/about', kw: 'about tentang vision visi mission misi' },
  { id: 'p-sejarah', title: { en: 'Our history', id: 'Sejarah kami' }, href: '/about/sejarah', kw: 'history sejarah 1961 congress kongres' },
  { id: 'p-partners', title: { en: 'Partners', id: 'Mitra' }, href: '/partners', kw: 'partners mitra sponsors sponsor collaborators' },
  { id: 'p-contact', title: { en: 'Contact', id: 'Hubungi kami' }, href: '/contact', kw: 'contact kontak hubungi email emergency darurat hotline' },
];

export function buildSearchIndex(lang = 'en') {
  const pick = (o) => (typeof o === 'string' ? o : o?.[lang] ?? o?.en ?? '');
  const by = chaptersByStateId();

  const chapterItems = chapters.map((c) => ({
    id: c.id,
    category: 'chapters',
    title: c.chapterName,
    subtitle: `${c.university}, ${c.city}, ${c.state}`,
    href: `/chapters/${c.id.replace(/^c-/, '')}`,
    keywords: [c.university, c.universityFull, c.city, c.state, c.stateId, c.instagram, c.region, pick(c.description)],
    boost: 0.05,
  }));

  const stateItems = Object.entries(by).map(([id, list]) => ({
    id: `state-${id}`,
    category: 'places',
    title: list[0].state,
    subtitle: lang === 'id' ? `${list.length} chapter` : `${list.length} chapter${list.length > 1 ? 's' : ''}`,
    href: `/chapters?state=${id}`,
    keywords: [id, STATE_ABBR[id], 'state negara bagian'],
    boost: 0.12,
  }));

  const cityMap = new Map();
  for (const c of chapters) {
    const k = `${c.city}|${c.stateId}`;
    if (!cityMap.has(k)) cityMap.set(k, { city: c.city, state: c.state, stateId: c.stateId, n: 0 });
    cityMap.get(k).n++;
  }
  const cityItems = [...cityMap.values()].map((x) => ({
    id: `city-${x.city}-${x.stateId}`,
    category: 'places',
    title: `${x.city}, ${x.state}`,
    subtitle: lang === 'id' ? `${x.n} chapter` : `${x.n} chapter${x.n > 1 ? 's' : ''}`,
    href: `/chapters?state=${x.stateId}&q=${encodeURIComponent(x.city)}`,
    keywords: [x.city, 'city kota'],
    boost: 0.08,
  }));

  const postItems = posts.map((p) => ({
    id: p.id,
    category: 'events',
    title: p.title,
    subtitle: new Date(p.date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    href: `/events#${p.id}`,
    keywords: [p.description, p.location, p.type, ...(p.tags || [])],
  }));

  const topicItems = resourceSections.map((s) => ({
    id: `topic-${s.id}`,
    category: 'resources',
    title: pick(s.title),
    subtitle: lang === 'id' ? 'Topik sumber daya' : 'Resource topic',
    href: `/resources/${s.id}`,
    keywords: [s.id, s.title.en, s.title.id],
    boost: 0.1,
  }));

  const pageItems = PAGES.map((p) => ({
    id: p.id,
    category: 'pages',
    title: pick(p.title),
    subtitle: '',
    href: p.href,
    keywords: [p.kw, p.title.en, p.title.id],
    boost: 0.04,
  }));

  return [...stateItems, ...cityItems, ...chapterItems, ...topicItems, ...flattenResourcesForSearch(), ...postItems, ...flattenTeamForSearch(), ...pageItems].map(prepare);
}

/** Returns ranked results with `score` and `ranges` (title highlight ranges in the original string). */
export function searchIndex(query, index, limit = 40) {
  const groups = expandQuery(query);
  if (!groups.length) return [];
  const out = [];
  for (const item of index) {
    let total = 0;
    let ok = true;
    for (const alts of groups) {
      let best = 0;
      for (const tok of alts) {
        for (const f of item._fields) {
          const s = tokenScore(tok, f.words, f.folded) * f.w;
          if (s > best) best = s;
        }
      }
      if (best === 0) {
        ok = false;
        break;
      }
      total += best;
    }
    if (!ok) continue;
    out.push({ ...item, score: total / groups.length + (item.boost || 0), ranges: highlight(item.title, groups) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

function highlight(title, groups) {
  const text = String(title);
  const lower = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const ranges = [];
  for (const alts of groups) {
    for (const tok of alts) {
      if (tok.length < 2) continue;
      const re = new RegExp(`(^|[^a-z0-9])(${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
      let m;
      while ((m = re.exec(lower))) {
        const start = m.index + m[1].length;
        ranges.push([start, start + tok.length]);
      }
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged.at(-1);
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}
