/** Mock feed for /events and homepage — swap with CMS later */
export const posts = [
  {
    id: 'p1',
    type: 'event',
    title: 'National Leadership Summit 2026',
    date: '2026-08-15T18:00:00',
    location: 'Chicago, IL',
    description:
      'Join chapter leaders from across the country for workshops on advocacy, chapter operations, and community building.',
    imageUrl: 'https://placehold.co/800x450/CE1126/FFFFFF?text=Leadership+Summit',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['leadership', 'national'],
  },
  {
    id: 'p2',
    type: 'announcement',
    title: 'Spring mailing list refresh',
    date: '2026-04-01T12:00:00',
    location: 'Virtual',
    description:
      'We are updating our Google Groups permissions. Please re-confirm your subscription to keep receiving national updates.',
    imageUrl: 'https://placehold.co/800x450/1A1A1A/FFFFFF?text=Announcement',
    externalLink: 'https://groups.google.com/g/permias-nasional',
    tags: ['communication'],
  },
  {
    id: 'p3',
    type: 'opportunity',
    title: 'LPDP info session with alumni mentors',
    date: '2026-04-22T19:00:00',
    location: 'Virtual',
    description:
      'Learn about returning-service pathways and essay tips from PERMIAS alumni who received LPDP funding.',
    imageUrl: 'https://placehold.co/800x450/1C1C1C/FFFFFF?text=LPDP+Session',
    externalLink: 'https://lpdp.kemenkeu.go.id',
    tags: ['scholarship', 'lpdp'],
  },
  {
    id: 'p4',
    type: 'event',
    title: 'Welcoming Ramadan: community iftar tour',
    date: '2026-03-10T17:30:00',
    location: 'Multiple chapters',
    description:
      'Chapters host open iftars for new students—check your local PERMIAS Instagram for RSVP details.',
    imageUrl: 'https://placehold.co/800x450/CE1126/FFFFFF?text=Iftar+Tour',
    externalLink: 'https://www.instagram.com/permias.nasional/',
    tags: ['community', 'culture'],
  },
  {
    id: 'p5',
    type: 'announcement',
    title: 'Chapter registration window open',
    date: '2026-02-20T10:00:00',
    location: 'United States',
    description:
      'New university-based organizations can register to affiliate with PERMIAS Nasional for the 2026–2027 academic year.',
    imageUrl: 'https://placehold.co/800x450/1A1A1A/FFFFFF?text=Chapters',
    externalLink: 'https://forms.gle/bx9bQx9eRBDgLTy57',
    tags: ['chapters'],
  },
  {
    id: 'p6',
    type: 'opportunity',
    title: 'Fulbright campus ambassador cohort',
    date: '2026-05-05T23:59:00',
    location: 'Virtual',
    description:
      'AMINEF is recruiting student ambassadors—ideal for PERMIAS members interested in public diplomacy.',
    imageUrl: 'https://placehold.co/800x450/1C1C1C/FFFFFF?text=Fulbright',
    externalLink: 'https://www.aminef.or.id',
    tags: ['fulbright', 'grants'],
  },
  {
    id: 'p7',
    type: 'event',
    title: 'Career fair: Indonesia–US hiring partners',
    date: '2026-09-01T15:00:00',
    location: 'New York, NY',
    description:
      'Employers with Indonesia operations meet students for internships and new-grad roles. Business casual.',
    imageUrl: 'https://placehold.co/800x450/CE1126/FFFFFF?text=Career+Fair',
    externalLink: 'https://www.linkedin.com/company/permiasnasional',
    tags: ['careers'],
  },
  {
    id: 'p8',
    type: 'announcement',
    title: 'Atamerica cultural pass partnership',
    date: '2026-01-18T09:00:00',
    location: 'Washington, DC',
    description:
      'Selected chapters receive guest passes for embassy cultural programming—details emailed to presidents.',
    imageUrl: 'https://placehold.co/800x450/1A1A1A/FFFFFF?text=Atamerica',
    externalLink: 'https://atamerica.or.id',
    tags: ['culture', 'embassy'],
  },
];

export function getRecentPosts(n = 3) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, n);
}
