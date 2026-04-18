export const SITE_ORIGIN =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : 'https://permiasnasional.com';

export function canonicalPath(pathname) {
  return `${SITE_ORIGIN}${pathname === '/' ? '' : pathname}`;
}
