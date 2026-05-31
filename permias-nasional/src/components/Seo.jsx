import { Helmet } from 'react-helmet-async';
import { SITE_ORIGIN } from '../utils/site.js';

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

export function Seo({ title, description, path }) {
  const url = `${SITE_ORIGIN}${path === '/' ? '' : path}`;
  const ogImage = `${SITE_ORIGIN}/og-image.svg`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="id" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@permias.nasional" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
