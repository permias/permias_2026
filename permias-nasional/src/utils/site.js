export const SITE_ORIGIN =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : 'https://permiasnasional.com/permias_2026';

export function canonicalPath(pathname) {
  return `${SITE_ORIGIN}${pathname === '/' ? '' : pathname}`;
}

export const BASE = import.meta.env.BASE_URL;

export function publicUrl(path) {
  return `${BASE}${path.replace(/^\//, '')}`;
}

/** Prefix local public paths with Vite base; leave external URLs unchanged. */
export function resolveAssetUrl(url) {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return publicUrl(url);
}
