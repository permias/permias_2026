import { chapterMedia, monogram } from '../../lib/chapterInfo.js';
import { cn } from '../../utils/cn.js';

const TONE_BG = {
  'East Coast': 'bg-merah text-white',
  Midwest: 'bg-[#8A5A0B] text-white',
  South: 'bg-teal text-white dark:text-[#0A1220]',
  'West Coast': 'bg-[#2F5DA8] text-white',
};

/** Chapter logo from chapterMedia.json, or a region-toned monogram when no logo was found. */
export function ChapterLogo({ c, size = 48, className, ring = true }) {
  const { logo } = chapterMedia(c);
  const style = { width: size, height: size };
  if (logo) {
    return (
      <span
        className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full bg-white', ring && 'ring-1 ring-ink/10 dark:ring-white/15', className)}
        style={style}
      >
        <img src={logo.src} alt="" width={size} height={size} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </span>
    );
  }
  const text = monogram(c);
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-display leading-none', TONE_BG[c.region] || TONE_BG['East Coast'], className)}
      style={{ ...style, fontSize: size * (text.length > 2 ? 0.3 : 0.38) }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
