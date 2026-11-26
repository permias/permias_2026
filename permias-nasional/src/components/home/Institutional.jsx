import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, cityCount, stateCount } from '../../data/chapters.js';
import { sejarahMission, sejarahVision } from '../../data/sejarah.js';
import { teamDepartments } from '../../data/team.js';
import { CountUp } from '../ui/CountUp.jsx';
import { IconArrowRight } from '../ui/Icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal.jsx';

/** "Bersama": who PERMIAS is, vision and mission from the sejarah page, and four counted figures. */
export function Bersama() {
  const { t, pick } = useLanguage();
  const stats = [
    { value: chapters.length, label: t('home.stat.chapters') },
    { value: stateCount, label: t('home.stat.states') },
    { value: cityCount, label: t('home.stat.cities') },
    { value: 1961, label: t('bersama.founded'), plain: true },
  ];
  return (
    <section className="mt-24 bg-mist py-20 md:mt-32 md:py-28" aria-labelledby="bersama-title">
      <div className="container-x grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-display text-[clamp(4rem,2rem+8vw,9rem)] leading-[0.9] text-ink" lang="id">
              Bersama
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">{t('bersama.gloss')}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="bersama-title" className="display-md mt-8 max-w-[22ch] text-ink">
              {t('bersama.title')}
            </h2>
            <p className="lede mt-4 max-w-[58ch]">{t('bersama.sub')}</p>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, k) => (
              <StaggerItem key={s.label} index={k} className="border-t border-ink/15 pt-4">
                <p className="font-display text-[44px] leading-none text-ink tabular">
                  {s.plain ? s.value : <CountUp value={s.value} />}
                </p>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div className="grid gap-5 self-center">
          {[sejarahVision, sejarahMission].map((block, k) => (
            <Reveal key={k} delay={0.08 * k}>
              <article className="rounded-[22px] border border-border bg-surface p-7">
                <p className="text-sm font-semibold text-muted-foreground">{pick(block.title)}</p>
                <p className="mt-3 font-display text-[23px] leading-snug text-ink">{pick(block.items[0])}</p>
              </article>
            </Reveal>
          ))}
          <Reveal delay={0.16}>
            <Link to="/about/sejarah" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent">
              {t('bersama.history')}
              <IconArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

/** Leadership preview: the executive board, then a link to the full team. */
export function Pengurus() {
  const { t } = useLanguage();
  const exec = teamDepartments.find((d) => d.id === 'executive')?.members || [];
  const total = teamDepartments.reduce((n, d) => n + d.members.length, 0);
  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="pengurus-title">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="font-display text-[22px] text-muted-foreground">{t('pengurus.word')}</p>
          <h2 id="pengurus-title" className="display-lg mt-1 text-ink">
            {t('pengurus.title')}
          </h2>
          <p className="lede mt-4 max-w-[52ch]">{t('pengurus.sub', { n: total, d: teamDepartments.length })}</p>
          <Link
            to="/team"
            className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-[12px] bg-ink hover:bg-ink/85 px-5 text-[15px] font-semibold text-background transition-[background-color,transform] duration-150 active:scale-[0.97]"
          >
            {t('pengurus.cta')}
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {exec.map((m, k) => (
            <StaggerItem key={m.name} index={k}>
              <article className="group overflow-hidden rounded-[22px] border border-border bg-surface">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center font-display text-5xl text-ink/40">{initials(m.name)}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-muted-foreground">{m.role}</p>
                  <h3 className="mt-1 font-display text-[26px] leading-tight text-ink">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.education}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
