/** Events feed for /events and homepage — swap with CMS later */
import { resolveAssetUrl } from '../utils/site.js';

const rawPosts = [
  {
    id: 'e1',
    type: 'event',
    title: 'Webinar: Mengenal Sistem Pendidikan di Amerika Serikat',
    date: '2026-05-04T16:00:00',
    location: 'Virtual · Zoom',
    description:
      'Featuring Dr. Iip Ichsanudin, S.S., M.A., Atase Pendidikan dan Kebudayaan KBRI Washington D.C. Selasa, 4 Mei 2026 · 16:00 WIB / 5:00 EST.',
    imageUrl: '/images/events/webinar-sistem-pendidikan-as.png',
    imageAspect: 'portrait',
    externalLink: 'https://bit.ly/SeminarAtdikbud_UNESCO',
    tags: ['webinar', 'education'],
  },
  {
    id: 'e2',
    type: 'event',
    title: 'WAREKADA: A Discussion on Makanan Bergizi Gratis',
    date: '2026-04-28T21:00:00',
    location: 'Virtual · Zoom + YouTube Live',
    description:
      'Panel with Nabilla Audina and Irman Faiz, with keynote Dirgayuza Setiawan, Special Assistant to the President of Indonesia.',
    imageUrl: '/images/events/warekada-mbg.png',
    imageAspect: 'portrait',
    externalLink: 'https://permias.org/warekadambg',
    tags: ['warekada', 'policy'],
  },
  {
    id: 'e3',
    type: 'event',
    title: "Ambassador's Town Hall: Indonesian Researchers in the US",
    date: '2026-04-16T20:00:00',
    location: 'Virtual · PERMIAS Nasional Zoom',
    description:
      'Town hall with Bapak Indroyono Soesilo, Duta Besar Indonesia untuk Amerika Serikat. Kamis, 16 April 2026 · 20:00 EST / 17:00 PST.',
    imageUrl: '/images/events/ambassador-town-hall-researchers.png',
    imageAspect: 'landscape',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['town-hall', 'research'],
  },
  {
    id: 'e4',
    type: 'event',
    title: 'Polemik Tunjangan Wakil Rakyat',
    date: '2025-11-12T19:00:00',
    location: 'Virtual',
    description:
      'Co-hosted with PERMIKA Nasional. Featuring Aichiro Suryo Prabowo, Edbert Gani Suryahudaya, and Dr. Riandy Laksono.',
    imageUrl: '/images/events/polemik-tunjangan-wakil-rakyat.png',
    imageAspect: 'landscape',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['policy', 'permika'],
  },
  {
    id: 'e5',
    type: 'event',
    title: 'Conversations with Danantara Indonesia',
    date: '2025-09-19T14:00:00',
    location: 'KJRI New York + Zoom',
    description:
      'Discussion with Pandu Patria Sjahrir, Chief Investment Officer of Danantara Indonesia. Friday, 19 September 2025 · 2:00 PM ET / 11:00 AM PT.',
    imageUrl: '/images/events/conversations-danantara.png',
    imageAspect: 'portrait',
    externalLink: 'https://permias.org/danantara-signup',
    tags: ['danantara', 'investment'],
  },
  {
    id: 'e6',
    type: 'event',
    title: 'Compass Series: US University Applications 101',
    date: '2024-11-09T10:00:00',
    location: 'Virtual',
    description:
      'Covers freshman entry, community college transfer, master’s, and PhD admissions. Saturday, 9 November 2024 · 10:00 AM WIB / 10:00 PM EST.',
    imageUrl: '/images/events/compass-us-applications-101.png',
    imageAspect: 'square',
    externalLink: 'https://bit.ly/USApplications',
    tags: ['compass', 'admissions'],
  },
  {
    id: 'e7',
    type: 'event',
    title: 'Compass Series: Know Your Test — SAT/ACT Guide',
    date: '2024-10-19T10:00:00',
    location: 'Virtual',
    description:
      'Compass Series session on navigating standardized tests for US university applications.',
    imageUrl: '/images/events/compass-sat-act-guide.png',
    imageAspect: 'landscape',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['compass', 'sat', 'act'],
  },
  {
    id: 'e8',
    type: 'event',
    title: 'Career Week 2024',
    date: '2024-04-14T09:00:00',
    location: 'Virtual',
    description:
      'PERMIAS Nasional × Indonesian Professionals Association. 14–18 April 2024 — explore, engage, excel.',
    imageUrl: '/images/events/career-week-2024.png',
    imageAspect: 'square',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['careers', 'ipa'],
  },
];

export const posts = rawPosts.map((post) => ({
  ...post,
  imageUrl: resolveAssetUrl(post.imageUrl),
}));

export function getRecentPosts(n = 3) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, n);
}
