import { motion } from 'motion/react';
import { photo } from '../../data/photos.js';
import { motionTokens } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Inner-page hero: a framed campus/city photo with the title on a dark glass pane.
 * One quiet entrance (photo settles, pane rises); the h1 itself never starts invisible.
 */
export function PageHeader({ title, description, children, image, className, compact = false }) {
  const { t } = useLanguage();
  const p = photo(image);

  return (
    <section className={cn('px-2 pt-2 sm:px-3 sm:pt-3', className)}>
      <div
        className={cn(
          'relative isolate flex overflow-hidden rounded-sheet bg-night',
          compact ? 'min-h-[400px] md:min-h-[440px]' : 'min-h-[480px] md:min-h-[min(68vh,620px)]',
        )}
      >
        {p && (
          <div className="absolute inset-0 -z-10">
            <motion.img
              src={p.src}
              srcSet={p.srcSet}
              sizes="100vw"
              alt=""
              width={p.w}
              height={p.h}
              className="photo-grade h-full w-full object-cover"
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: motionTokens.duration.crawl * 1.6, ease: motionTokens.easing.smooth }}
              fetchPriority="high"
            />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,19,21,.45)_0%,rgba(18,19,21,0)_35%,rgba(18,19,21,.55)_100%)]" aria-hidden="true" />

        <div className="container-x flex flex-col justify-end pb-6 pt-28 md:pb-10">
          <motion.div
            className="glass-photo max-w-3xl rounded-[30px] p-6 md:p-9"
            initial={{ y: motionTokens.distance.md }}
            animate={{ y: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
          >
            <h1 className="text-white display-lg">{title}</h1>
            {description && <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-white/85 md:text-lg">{description}</p>}
            {children && <div className="mt-6">{children}</div>}
          </motion.div>
        </div>

        {p && (
          <a
            href={p.page}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-4 hidden max-w-[40%] truncate rounded-full bg-black/30 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur hover:text-white md:block"
          >
            {t('photo.credit', { who: p.artist, lic: p.license })}
          </a>
        )}
      </div>
    </section>
  );
}
