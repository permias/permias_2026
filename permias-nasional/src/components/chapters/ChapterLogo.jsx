import { chapterMedia, monogram } from '../../lib/chapterInfo.js';
import { cn } from '../../utils/cn.js';

/** Chapter logo from chapterMedia.json, or a neutral monogram when no logo was found. Logos are small sources: keep size <= 96. */
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
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-display leading-none text-ink/70', ring && 'ring-1 ring-ink/10 dark:ring-white/15', className)}
      style={{ ...style, fontSize: size * (text.length > 2 ? 0.3 : 0.38) }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
