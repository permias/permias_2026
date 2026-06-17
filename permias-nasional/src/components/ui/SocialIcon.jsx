/** Recognizable brand marks for social links */
export function SocialIcon({ id, className = 'h-5 w-5' }) {
  switch (id) {
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#feda75" />
              <stop offset="25%" stopColor="#fa7e1e" />
              <stop offset="50%" stopColor="#d62976" />
              <stop offset="75%" stopColor="#962fbf" />
              <stop offset="100%" stopColor="#4f5bd5" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="#fff" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="6" fill="#1877F2" />
          <path
            fill="#fff"
            d="M15.12 8.5H13.5c-.55 0-.72.28-.72.68v1.32h2.44l-.32 2.58h-2.12V20h-2.66v-6.92H8.5v-2.58h1.7V8.78c0-1.68 1.03-2.6 2.53-2.6 1.02 0 1.58.08 1.84.12v2.2z"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M7.2 9.5h2.2V20H7.2V9.5zM8.3 5a1.27 1.27 0 1 1 0 2.54A1.27 1.27 0 0 1 8.3 5zM12 9.5h2.1v1.43h.03c.29-.55 1-1.13 2.06-1.13 2.2 0 2.6 1.45 2.6 3.33V20h-2.2v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94V20H12V9.5z"
          />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="6" fill="#FF0000" />
          <path fill="#fff" d="M10 8.5l5.5 3.5L10 15.5V8.5z" />
        </svg>
      );
    case 'google-groups':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="6" fill="#fff" stroke="#dadce0" />
          <circle cx="9" cy="10" r="2.5" fill="#1a73e8" />
          <circle cx="15.5" cy="10" r="2.5" fill="#34a853" />
          <path d="M6 16.5c0-1.8 1.8-3 3-3s3 1.2 3 3" fill="none" stroke="#1a73e8" strokeWidth="1.5" />
          <path d="M12.5 16.5c0-1.8 1.5-3 3-3s3 1.2 3 3" fill="none" stroke="#34a853" strokeWidth="1.5" />
        </svg>
      );
    case 'email':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="6" fill="#CE1126" />
          <path
            fill="#fff"
            d="M5 8.5 12 13l7-4.5V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v.5zm0 2.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5.3L12 14.8 5 10.7z"
          />
        </svg>
      );
    default:
      return null;
  }
}
