import { useState } from 'react';
import { teamDepartments } from '../data/team.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { cn } from '../utils/cn.js';

/** Crop focus for circular avatars — lower % = show higher in frame (faces). */
const TEAM_PHOTO_FOCUS = {
  'Axel Hutapea': 'center 11%',
  'Bayu Prasetyo': 'center 12%',
  'Aaron Timothy Soetopo': 'center 18%',
  'Hanna Talitha': 'center 22%',
  'Samantha Lie': 'center 14%',
  'Michelle Nugroho': 'center 20%',
  'Mario Andika Raharja': 'center 10%',
  'William Luky': 'center 24%',
  'Patrick Roland Wijaya': 'center 22%',
};

export function Team() {
  const { t } = useLanguage();
  const [tab, setTab] = useState(teamDepartments[0].id);
  const active = teamDepartments.find((d) => d.id === tab) || teamDepartments[0];

  return (
    <>
      <Seo title={pageTabTitle('National Team')} description="Meet the PERMIAS Nasional volunteer leadership." path="/team" />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('team.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('team.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {teamDepartments.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setTab(d.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition',
                tab === d.id ? 'bg-brand-red text-white' : 'bg-black/5 text-brand-charcoal dark:bg-white/10 dark:text-white',
              )}
            >
              {t(d.titleKey)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.members.map((mem, i) => (
            <ScrollReveal key={mem.name} staggerIndex={i % 5}>
              <article className="group relative h-full rounded-2xl border border-brand-charcoal/10 border-t-[3px] border-t-transparent bg-white p-6 shadow-sm transition duration-150 hover:-translate-y-1 hover:border-t-brand-red dark:border-white/10 dark:bg-surface-card">
                <div className="flex items-start gap-4">
                  {mem.imageUrl ? (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-brand-red/20 shadow-sm">
                      <img
                        src={mem.imageUrl}
                        alt={mem.name}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: TEAM_PHOTO_FOCUS[mem.name] ?? 'center 35%' }}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-red text-lg font-black text-white">
                      {mem.name
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-lg font-bold">{mem.name}</h3>
                    <p className="text-sm font-semibold text-brand-red">{mem.role}</p>
                    {mem.education && (
                      <p className="text-sm text-brand-charcoal/60 dark:text-white/60">{mem.education}</p>
                    )}
                  </div>
                </div>
                {mem.hometown && (
                  <p className="mt-4 text-sm text-brand-charcoal/75 opacity-0 transition group-hover:opacity-100 dark:text-white/75">
                    <span className="font-semibold">{t('team.hometown')}: </span>
                    {mem.hometown}
                  </p>
                )}
                {mem.linkedin && (
                  <a
                    href={mem.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-bold text-brand-red underline-offset-4 hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  );
}
