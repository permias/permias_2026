import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, REGION_LABELS, REGIONS, stateCount } from '../../data/chapters.js';
import { ChapterMap } from '../chapters/ChapterMap.jsx';
import { IconArrowRight } from '../ui/Icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal.jsx';

/** Home: the real chapter map with static neutral markers; states and markers open the directory. */
export function MapAct() {
  const { t, pick } = useLanguage();
  const navigate = useNavigate();
  const regionCounts = REGIONS.map((r) => ({ r, n: chapters.filter((c) => c.region === r).length, s: new Set(chapters.filter((c) => c.region === r).map((c) => c.stateId)).size }));

  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="map-act-title">
      <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <div className="lg:pt-6">
          <Reveal>
            <p className="font-display text-[22px] text-muted-foreground" lang="id">
              Peta
            </p>
            <h2 id="map-act-title" className="display-lg mt-1 text-ink">
              {t('home.map.title')}
            </h2>
            <p className="lede mt-4">{t('home.map.sub', { n: chapters.length, s: stateCount })}</p>
          </Reveal>
          <Stagger className="mt-8 divide-y divide-border border-y border-border" aria-label={t('chapters.filterRegion')}>
            {regionCounts.map(({ r, n, s }, k) => (
              <StaggerItem key={r} index={k}>
                <button
                  type="button"
                  onClick={() => navigate(`/chapters?region=${encodeURIComponent(r)}`)}
                  className="group flex min-h-[60px] w-full items-center gap-3 px-1 text-left"
                >
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{pick(REGION_LABELS[r])}</span>
                    <span className="block text-sm text-muted-foreground">{t('home.map.regionMeta', { n, s })}</span>
                  </span>
                  <IconArrowRight className="h-4 w-4 text-ink/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                </button>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2}>
            <Link to="/chapters" className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent">
              {t('home.kaca.map')}
              <IconArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>

        <Reveal x={-24} className="rounded-[28px] border border-border bg-surface p-3 sm:p-6">
          <ChapterMap
            onSelectState={(id) => id && navigate(`/chapters?state=${id}`)}
            onSelectCluster={(items) =>
              navigate(items.length === 1 ? `/chapters?state=${items[0].stateId}&chapter=${items[0].id}` : `/chapters?state=${items[0].stateId}`)
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
