/** One colour per region: PERMIAS red plus three supporting accents. */
export const REGION_TONE = {
  'East Coast': { dot: 'bg-merah', text: 'text-merah', bar: 'from-merah' },
  Midwest: { dot: 'bg-emas', text: 'text-[#8A5A0B] dark:text-emas', bar: 'from-emas' },
  South: { dot: 'bg-teal', text: 'text-teal', bar: 'from-teal' },
  'West Coast': { dot: 'bg-[#2F5DA8] dark:bg-[#7FA6EA]', text: 'text-[#2F5DA8] dark:text-[#7FA6EA]', bar: 'from-[#2F5DA8]' },
};

export const isRegional = (c) => /^regional/i.test(c.university);
/** Campus name for sorting/A-Z; regional chapters sort by their city. */
export const campusName = (c) => (isRegional(c) ? `${c.city} (${c.state})` : c.university);
