import { Link } from 'react-router-dom';
import { photo } from '../../data/photos.js';
import { cn } from '../../utils/cn.js';
import { Reveal } from './Reveal.jsx';

/**
 * Section opening used on every inner page: an Indonesian word as the label (serif italic, red),
 * a regular-weight serif heading and an optional lede. Never bold serif.
 */
export function SectionHead({ word, title, intro, id, className, align = 'left', as: H = 'h2', children }) {
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      {word && (
        <p className="font-display text-xl italic text-merah" lang="id">
          {word}
        </p>
      )}
      <H id={id} className="display-md mt-2 text-ink">
        {title}
      </H>
      {intro && <p className={cn('lede mt-4 max-w-[62ch]', align === 'center' && 'mx-auto')}>{intro}</p>}
      {children}
    </Reveal>
  );
}

/** Full-bleed photo tile with a serif title and up to two text links (Apple's product tiles, applied to guides and pages). */
export function PhotoTile({ image, title, sub, to, links = [], className, size = 'md', priority = false }) {
  const p = photo(image);
  const tall = size === 'lg' ? 'min-h-[420px] md:min-h-[520px]' : size === 'sm' ? 'min-h-[260px]' : 'min-h-[340px] md:min-h-[380px]';
  const Wrapper = to ? Link : 'div';
  return (
    <Wrapper
      {...(to ? { to } : {})}
      className={cn('group relative isolate flex flex-col justify-end overflow-hidden rounded-[28px] bg-[#0A1220] p-6 text-white md:p-8', tall, className)}
    >
      {p && (
        <img
          src={size === 'lg' ? p.src : p.small}
          srcSet={p.srcSet}
          sizes={size === 'lg' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
          alt=""
          width="1600"
          height="1067"
          loading={priority ? 'eager' : 'lazy'}
          className="photo-grade absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      )}
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,18,32,.05)_25%,rgba(10,18,32,.8)_100%)]" aria-hidden="true" />
      <span className="font-display text-[clamp(1.7rem,1.3rem+1.2vw,2.5rem)] leading-[1.05]">{title}</span>
      {sub && <span className="mt-2 max-w-[44ch] text-[16px] leading-relaxed text-white/85">{sub}</span>}
      {links.length > 0 && (
        <span className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-semibold">
          {links.map((l) => (
            <span key={l} className="underline decoration-white/40 underline-offset-4 transition-colors group-hover:decoration-white">
              {l}
            </span>
          ))}
        </span>
      )}
      {p && <span className="sr-only">{p.alt}</span>}
    </Wrapper>
  );
}

/** Small photo credit line for an image from imageCredits.json. */
export function Credit({ image, className }) {
  const p = photo(image);
  if (!p) return null;
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {p.alt}.{' '}
      <a href={p.page} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
        {p.artist}, {p.license}
      </a>
    </p>
  );
}
