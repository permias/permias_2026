import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { photo } from '../../data/photos.js';
import { motionTokens, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Inner-page hero: a framed campus/city photo that zooms as it scrolls away,
 * with the title on a glass pane. The h1 itself never starts invisible.
 */
export function PageHeader({ title, description, children, image, className, compact = false }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const p = photo(image);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const paneY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={ref} className={cn('px-2 pt-2 sm:px-3 sm:pt-3', className)}>
      <div
        className={cn(
          'relative isolate flex overflow-hidden rounded-sheet bg-[#0A1220]',
          compact ? 'min-h-[400px] md:min-h-[440px]' : 'min-h-[480px] md:min-h-[min(68vh,620px)]',
        )}
      >
        {p && (
          <motion.div className="absolute inset-0 -z-10" style={{ scale, y }}>
            <motion.img
              src={p.src}
              srcSet={p.srcSet}
              sizes="100vw"
              alt=""
              className="h-full w-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: motionTokens.duration.crawl * 1.6, ease: motionTokens.easing.smooth }}
              fetchPriority="high"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,18,32,.45)_0%,rgba(10,18,32,0)_35%,rgba(10,18,32,.55)_100%)]" aria-hidden="true" />

        <div className="container-x flex flex-col justify-end pb-6 pt-28 md:pb-10">
          <motion.div style={{ y: paneY }} className="max-w-3xl">
          <motion.div
            className="glass-photo sheen rounded-[30px] p-6 md:p-9"
            initial={{ y: motionTokens.distance.lg }}
            animate={{ y: 0 }}
            transition={springs.gentle}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
              e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            <h1 className="relative z-[2] text-white display-lg">{title}</h1>
            {description && <p className="relative z-[2] mt-4 max-w-[56ch] text-[17px] leading-relaxed text-white/85 md:text-lg">{description}</p>}
            {children && <div className="relative z-[2] mt-6">{children}</div>}
          </motion.div>
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
