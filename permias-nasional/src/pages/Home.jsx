import { Helmet } from 'react-helmet-async';
import { Seo } from '../components/Seo.jsx';
import { DEFAULT_TAB_TITLE } from '../utils/seo.js';
import { HeroSlideshow } from '../components/home/HeroSlideshow.jsx';
import { ChapterDirectory } from '../components/home/ChapterDirectory.jsx';
import { Bersama, Pengurus } from '../components/home/Institutional.jsx';
import { MapAct } from '../components/home/MapAct.jsx';
import { EventsRail, JoinBand, Moments, PartnersIndex, WhatWeDo } from '../components/home/HomeSections.jsx';
import { SITE_ORIGIN } from '../utils/site.js';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PERMIAS Nasional',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/images/brand/logo-permias-horizontal.png`,
  foundingDate: '1961-12-24',
  sameAs: [
    'https://www.instagram.com/permias.nasional/',
    'https://www.facebook.com/permias.nasional',
    'https://www.linkedin.com/company/permiasnasional',
    'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw',
  ],
  email: 'info@permiasnasional.com',
};

export function Home() {
  return (
    <>
      <Seo
        title={DEFAULT_TAB_TITLE}
        description="PERMIAS chapters for Indonesian students across the United States: find your campus community, events, and student guides."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <HeroSlideshow />
      <ChapterDirectory />
      <Bersama />
      <MapAct />
      <WhatWeDo />
      <EventsRail />
      <Pengurus />
      <PartnersIndex />
      <Moments />
      <JoinBand />
    </>
  );
}
