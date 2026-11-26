import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { teamDepartments } from '../data/team.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { SectionHead } from '../components/ui/Section.jsx';
import { motionTokens, springs } from '../lib/motion.js';
import { cn } from '../utils/cn.js';

/** Crop focus for portraits: lower % shows higher in the frame (faces). */
const FOCUS = {
  'Axel Hutapea': 'center 14%',
  'Bayu Prasetyo': 'center 14%',
  'Aaron Timothy Soetopo': 'center 18%',
  'Hanna Talitha': 'center 20%',
  'Samantha Lie': 'center 16%',
  'Michelle Nugroho': 'center 20%',
  'Mario Andika Raharja': 'center 12%',
  'William Luky': 'center 22%',
  'Patrick Roland Wijaya': 'center 20%',
};

const initials = (name) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// "https://www.linkedin.com/" placeholders in team.json are not real profiles, so they are not shown.
const realProfile = (u) => u && !/^https?:\/\/(www\.)?linkedin\.com\/?$/.test(u);

function Portrait({ m, size = 'md', index }) {
  const { pick } = useLanguage();
  return (
    <motion.article
      initial={{ opacity: 0, y: index < 8 ? motionTokens.distance.md : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth, delay: Math.min(index, 8) * motionTokens.stagger.children }}
      className="group"
    >
      <div className={cn('relative overflow-hidden rounded-[24px] bg-mist', size === 'lg' ? 'aspect-[4/5]' : 'aspect-[4/5]')}>
        {m.imageUrl ? (
          <img
            src={m.imageUrl}
            alt={m.name}
            width="480"
            height="600"
            loading="lazy"
            className="media-outline h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: FOCUS[m.name] ?? 'center 25%' }}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-night font-display text-6xl text-white" aria-hidden="true">
            {initials(m.name)}
          </span>
        )}
      </div>
      <h3 className={cn('mt-4 font-display leading-tight text-ink', size === 'lg' ? 'text-[30px]' : 'text-[24px]')}>{m.name}</h3>
      <p className="mt-1 text-[16px] font-semibold text-muted-foreground">{m.role}</p>
      {m.education && <p className="mt-1 text-[16px] leading-snug text-muted-foreground">{m.education}</p>}
      {m.hometown && (
        <p className="mt-1 text-[16px] text-muted-foreground">
          {pick({ en: 'From', id: 'Asal' })} {m.hometown}
        </p>
      )}
      {realProfile(m.linkedin) && (
        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet mt-2 inline-flex min-h-[32px] items-center text-[15px] font-semibold text-ink">
          LinkedIn
        </a>
      )}
    </motion.article>
  );
}

/** Team: the president and vice president first, then one directorate at a time. */
export function Team() {
  const { t, pick } = useLanguage();
  const [params, setParams] = useSearchParams();
  const exec = teamDepartments.find((d) => d.id === 'executive');
  const directorates = teamDepartments.filter((d) => d.id !== 'executive');
  const tab = directorates.some((d) => d.id === params.get('d')) ? params.get('d') : directorates[0].id;
  const active = directorates.find((d) => d.id === tab);
  const total = teamDepartments.reduce((n, d) => n + d.members.length, 0);

  return (
    <>
      <Seo title={pageTabTitle('National Team')} description="Meet the PERMIAS Nasional volunteer leadership." path="/team" />
      <PageHeader image={PAGE_PHOTOS.team} title={t('team.title')} description={t('team.sub')} />

      {exec && (
        <section className="container-x mt-16 md:mt-24" aria-labelledby="team-exec">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <SectionHead
              id="team-exec"
              word="Pengurus inti"
              title={t(exec.titleKey)}
              intro={pick({
                en: `${total} students volunteer on the national board, alongside their studies on campuses across the United States.`,
                id: `${total} mahasiswa menjadi relawan pengurus nasional, sambil kuliah di kampus-kampus di seluruh Amerika Serikat.`,
              })}
            />
            <div className="grid grid-cols-2 gap-5 md:gap-8">
              {exec.members.map((m, i) => (
                <Portrait key={m.name} m={m} size="lg" index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="team-dirs">
        <SectionHead id="team-dirs" word="Direktorat" title={pick({ en: 'Directorates', id: 'Direktorat' })} />
        <div role="group" aria-label={pick({ en: 'Choose a directorate', id: 'Pilih direktorat' })} className="no-scrollbar -mx-5 mt-8 flex gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {directorates.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={tab === d.id}
              onClick={() => setParams({ d: d.id }, { replace: true, preventScrollReset: true })}
              className={cn('relative flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full text-[15px] font-semibold transition-colors duration-150', tab === d.id ? 'text-mist' : 'text-ink/70 hover:text-ink')}
            >
              {tab === d.id ? (
                <motion.span layoutId="team-tab" className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-ink px-4" transition={springs.snappy}>
                  {t(d.titleKey)} <span className="tabular text-mist/75">{d.members.length}</span>
                </motion.span>
              ) : (
                <span className="flex items-center gap-1.5 px-4">
                  {t(d.titleKey)} <span className="tabular text-muted-foreground">{d.members.length}</span>
                </span>
              )}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
            className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
            aria-live="polite"
          >
            {active.members.map((m, i) => (
              <Portrait key={m.name} m={m} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}
