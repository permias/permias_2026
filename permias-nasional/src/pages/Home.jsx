import { Helmet } from 'react-helmet-async';
import { Seo, DEFAULT_TAB_TITLE } from '../components/Seo.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { Stats } from '../components/sections/Stats.jsx';
import { WhatIsPermias } from '../components/sections/WhatIsPermias.jsx';
import { RecentPosts } from '../components/sections/RecentPosts.jsx';
import { PartnerMarquee } from '../components/sections/PartnerMarquee.jsx';
import { SocialHub } from '../components/sections/SocialHub.jsx';
import { NewsletterSection } from '../components/sections/NewsletterSection.jsx';
import { ChapterFinder } from '../components/sections/ChapterFinder.jsx';
import { InstagramGrid } from '../components/sections/InstagramGrid.jsx';
import { StoriesSection } from '../components/sections/StoriesSection.jsx';
import { SITE_ORIGIN } from '../utils/site.js';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PERMIAS Nasional',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/images/brand/logo-permias-horizontal.png`,
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
        description="Join the Indonesian student community across the United States—chapters, scholarships, visas, and national programs."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Hero />
      <Stats />
      <WhatIsPermias />
      <RecentPosts />
      <PartnerMarquee />
      <InstagramGrid headingKey="home.ig.title" />
      <StoriesSection />
      <SocialHub />
      <NewsletterSection />
      <ChapterFinder />
    </>
  );
}
