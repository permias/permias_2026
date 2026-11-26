export const isRegional = (c) => /^regional/i.test(c.university);
/** Campus name for sorting/A-Z; regional chapters sort by their city. */
export const campusName = (c) => (isRegional(c) ? `${c.city} (${c.state})` : c.university);
