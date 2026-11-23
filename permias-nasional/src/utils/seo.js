/** Default `<title>` for the home page (matches browser tab pattern). */
export const DEFAULT_TAB_TITLE = 'PERMIAS Nasional | Indonesia';

/**
 * Build a tab title: `Page | PERMIAS Nasional | Indonesia`.
 * Call with no args (or empty) for the home default.
 */
export function pageTabTitle(pageLabel) {
  const label = typeof pageLabel === 'string' ? pageLabel.trim() : '';
  if (!label) return DEFAULT_TAB_TITLE;
  return `${label} | PERMIAS Nasional | Indonesia`;
}
