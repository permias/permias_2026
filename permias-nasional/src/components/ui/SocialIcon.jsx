/** Social marks drawn in one colour (currentColor), so they follow the surrounding text instead of each brand's palette. */
export function SocialIcon({ id, className = 'h-5 w-5' }) {
  const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" {...line} />
          <circle cx="12" cy="12" r="3.9" {...line} />
          <circle cx="17" cy="7" r="1" fill="currentColor" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3.1z"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M5.3 9h3v10.5h-3V9zm1.5-4.8a1.7 1.7 0 1 1 0 3.5 1.7 1.7 0 0 1 0-3.5zM10.2 9h2.9v1.4h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.06h-3v-5.37c0-1.28-.02-2.93-1.79-2.93-1.79 0-2.06 1.4-2.06 2.84v5.46h-3V9z"
          />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect x="2.75" y="5.5" width="18.5" height="13" rx="4" {...line} />
          <path fill="currentColor" d="M10.2 9.2 15 12l-4.8 2.8V9.2z" />
        </svg>
      );
    case 'google-groups':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <circle cx="9" cy="9" r="2.6" {...line} />
          <circle cx="16" cy="9.5" r="2.2" {...line} />
          <path d="M4 18.5c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4M14.5 14.3c.5-.2 1-.3 1.5-.3 2.3 0 4 1.5 4 3.8" {...line} />
        </svg>
      );
    case 'email':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...line} />
          <path d="m4.5 7.5 7.5 5.5 7.5-5.5" {...line} />
        </svg>
      );
    default:
      return null;
  }
}
