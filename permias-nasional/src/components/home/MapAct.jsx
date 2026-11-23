import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, REGION_LABELS, REGIONS, stateCount } from '../../data/chapters.js';
import { REGION_TONE } from '../../lib/regionTone.js';
import { cn } from '../../utils/cn.js';
import { ChapterMap } from '../chapters/ChapterMap.jsx';
import { IconArrowRight } from '../ui/Icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal.jsx';

/** Home: the real chapter map. Pins sweep in west to east once, then pulse gently; states and pins open the directory. */
export function MapAct() {
  const { t, pick } = useLanguage();
  const navigate = useNavigate();
  const regionCounts = REGIONS.map((r) => ({ r, n: chapters.filter((c) => c.region === r).length, s: new Set(chapters.filter((c) => c.region === r).map((c) => c.stateId)).size }));

  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="map-act-title">
      <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <div className="lg:pt-6">
          <Reveal>
            <p className="font-display text-[22px] text-merah" lang="id">
              Peta
            </p>
            <h2 id="map-act-title" className="display-lg mt-1 text-ink">
              {t('home.map.title')}
            </h2>
            <p className="lede mt-4">{t('home.map.sub', { n: chapters.length, s: stateCount })}</p>
          </Reveal>
          <Stagger className="mt-8 grid gap-2" aria-label={t('chapters.filterRegion')}>
            {regionCounts.map(({ r, n, s }, k) => (
              <StaggerItem key={r} index={k}>
                <button
                  type="button"
                  onClick={() => navigate(`/chapters?region=${encodeURIComponent(r)}`)}
                  className="group flex min-h-[56px] w-full items-center gap-3 rounded-[14px] border border-border bg-surface px-4 text-left transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_12px_30px_-20px_rgba(19,35,63,.5)] active:scale-[0.98]"
                >
                  <span className={cn('h-3 w-3 shrink-0 rounded-full', REGION_TONE[r].dot)} aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{pick(REGION_LABELS[r])}</span>
                    <span className="block text-sm text-muted-foreground">{t('home.map.regionMeta', { n, s })}</span>
                  </span>
                  <IconArrowRight className="h-4 w-4 text-ink/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-merah" />
                </button>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2}>
            <Link to="/chapters" className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-merah">
              {t('home.kaca.map')}
              <IconArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>

        <Reveal x={-24} className="rounded-[28px] border border-border bg-surface p-3 shadow-[0_30px_80px_-50px_rgba(19,35,63,.55)] sm:p-6">
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
