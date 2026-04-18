/** Flattened cards for search + grouped by section id */
import { sectionImages } from './siteMedia.js';

export const visaStages = [
  {
    id: 'f1',
    title: {
      en: 'F-1 initial entry',
      id: 'Masuk awal F-1',
    },
    body: {
      en: 'Receive I-20, pay SEVIS fee, schedule visa interview, arrive within port-of-entry window.',
      id: 'Terima I-20, bayar SEVIS, jadwalkan wawancara visa, datang sesi jendela kedatangan.',
    },
  },
  {
    id: 'maintain',
    title: {
      en: 'Maintaining F-1 status',
      id: 'Mempertahankan status F-1',
    },
    body: {
      en: 'Full course of study, update address in 10 days, consult DSO before work or travel.',
      id: 'Beban studi penuh, update alamat dalam 10 hari, konsultasi DSO sebelum kerja atau bepergian.',
    },
  },
  {
    id: 'j1',
    title: {
      en: 'J-1 exchange',
      id: 'Pertukaran J-1',
    },
    body: {
      en: 'DS-2019 from sponsor, two-year home residency may apply—confirm with your RO.',
      id: 'DS-2019 dari sponsor; aturan two-year home residency mungkin berlaku—konfirmasi ke RO.',
    },
  },
  {
    id: 'opt',
    title: {
      en: 'OPT / STEM OPT',
      id: 'OPT / STEM OPT',
    },
    body: {
      en: 'Apply through USCIS portal timelines; unemployment day limits apply.',
      id: 'Ajukan lewat portal USCIS; batas hari menganggur berlaku.',
    },
  },
];

export const resourceSections = [
  {
    id: 'embassies',
    title: { en: 'Contact the Indonesian Embassies', id: 'Hubungi perwakilan Indonesia' },
    cards: [
      {
        title: 'Embassy of the Republic of Indonesia in USA',
        subtitle: { en: 'Embassy of Indonesia in the U.S.', id: 'Kedutaan Indonesia di AS' },
        description: {
          en: 'Embassy of Indonesia in Washington, D.C.',
          id: 'Kedutaan Besar Republik Indonesia di Washington, D.C.',
        },
        address: '2020 Massachusetts Ave NW, Washington, DC 20036',
        phone: '+1 (202) 775-5200',
        href: 'https://www.embassyofindonesia.org',
        image: sectionImages.borobudur,
        keywords: ['embassy', 'dc', 'passport', 'kbri', 'washington'],
      },
      {
        title: 'Embassy of the United States in Indonesia',
        subtitle: { en: 'U.S. Embassy in Indonesia', id: 'Kedutaan AS di Indonesia' },
        description: {
          en: 'U.S. diplomatic mission in Jakarta.',
          id: 'Perwakilan diplomatik AS di Jakarta.',
        },
        address: 'Jl. Medan Merdeka Selatan No. 3–5, Jakarta 10110',
        phone: '+62-21-5083-1000',
        href: 'https://id.usembassy.gov',
        image: sectionImages.mountRushmore,
        keywords: ['us embassy', 'jakarta', 'indonesia'],
      },
      {
        title: 'KJRI San Francisco',
        subtitle: { en: 'Consulate General of Indonesia', id: 'Konsulat Jenderal RI' },
        description: {
          en: 'West Coast & Pacific jurisdiction.',
          id: 'Wilayah Pantai Barat dan Pasifik.',
        },
        address: '1111 Columbus Avenue, San Francisco, CA 94133',
        phone: '+1 (415) 875 0793',
        href: 'https://kemlu.go.id/sanfrancisco/id',
        image: sectionImages.goldenGate,
        keywords: ['san francisco', 'kjri', 'bay area'],
      },
      {
        title: 'KJRI New York',
        subtitle: { en: 'Consulate General of Indonesia', id: 'Konsulat Jenderal RI' },
        description: {
          en: 'Northeast U.S. jurisdiction.',
          id: 'Wilayah timur laut AS.',
        },
        address: '5 E 68th St, New York, NY 10065',
        phone: '+1 (212) 879-0600',
        href: 'https://kjrinewyork.org/',
        image: sectionImages.statueLiberty,
        keywords: ['new york', 'kjri', 'consulate'],
      },
      {
        title: 'KJRI Chicago',
        subtitle: { en: 'Consulate General of Indonesia', id: 'Konsulat Jenderal RI' },
        description: {
          en: 'Midwest U.S. jurisdiction.',
          id: 'Wilayah Midwest AS.',
        },
        address: '211 N Carpenter St, Chicago, IL 60607',
        phone: '+1 (312) 920 1880',
        href: 'https://kemlu.go.id/chicago',
        image: sectionImages.chicagoNight,
        keywords: ['chicago', 'illinois', 'kjri'],
      },
      {
        title: 'KJRI Houston',
        subtitle: { en: 'Consulate General of Indonesia', id: 'Konsulat Jenderal RI' },
        description: {
          en: 'Southern U.S. jurisdiction.',
          id: 'Wilayah selatan AS.',
        },
        address: '10900 Richmond Avenue, Houston, TX 77042',
        phone: '+1 (713) 785 1691',
        href: 'https://kemlu.go.id/houston/',
        image: sectionImages.houston,
        keywords: ['houston', 'texas', 'kjri'],
      },
      {
        title: 'KJRI Los Angeles',
        subtitle: { en: 'Consulate General of Indonesia', id: 'Konsulat Jenderal RI' },
        description: {
          en: 'Southwest U.S. & Hawaii jurisdiction.',
          id: 'Wilayah barat daya AS & Hawaii.',
        },
        address: '3457 Wilshire Boulevard, Los Angeles, CA 90010',
        phone: '+1 (213) 387 7041',
        href: 'https://kemlu.go.id/losangeles/',
        image: sectionImages.santaMonica,
        keywords: ['los angeles', 'california', 'kjri'],
      },
    ],
  },
  {
    id: 'visa',
    title: { en: 'VISA process', id: 'Proses VISA' },
    cards: [
      {
        title: 'Study in the States (SEVP)',
        description: 'Official guidance for F/M students from DHS.',
        href: 'https://studyinthestates.dhs.gov/',
        keywords: ['f1', 'sevp', 'dhs', 'status'],
      },
      {
        title: 'CEAC visa appointment',
        description: 'Track DS-160 and interview appointment status.',
        href: 'https://ceac.state.gov/',
        keywords: ['visa', 'interview', 'ds160'],
      },
      {
        title: 'USCIS OPT overview',
        description: 'Optional Practical Training filing and reporting rules.',
        href: 'https://www.uscis.gov/opt',
        keywords: ['opt', 'stem', 'uscis', 'ead'],
      },
      {
        title: 'Travel.state.gov',
        description: 'Nonimmigrant visa policy updates from the State Department.',
        href: 'https://travel.state.gov/',
        keywords: ['state', 'travel', 'policy'],
      },
    ],
  },
  {
    id: 'academics',
    title: { en: 'Applying to U.S. universities', id: 'Melamar ke universitas AS' },
    cards: [
      {
        title: 'IIEF education portal',
        description: 'Information on studying in the United States from Indonesian institutions.',
        href: 'https://www.iief.or.id',
        keywords: ['iief', 'education', 'advising'],
      },
      {
        title: 'EducationUSA',
        description: 'Advising centers for applying to U.S. universities.',
        href: 'https://www.educationusa.info/',
        keywords: ['educationusa', 'apply', 'college'],
      },
      {
        title: 'Common App',
        description: 'Undergraduate application platform used by many U.S. colleges.',
        href: 'https://www.commonapp.org/',
        keywords: ['common app', 'undergraduate', 'apply'],
      },
      {
        title: 'GradCAS / program portals',
        description: 'Many graduate programs use centralized application services—check each department.',
        href: 'https://www.liaisonedu.com/',
        keywords: ['graduate', 'application', 'admissions'],
      },
    ],
  },
  {
    id: 'scholarships',
    title: { en: 'Scholarship opportunities', id: 'Peluang beasiswa' },
    cards: [
      {
        title: 'Lembaga Pengelola Dana Pendidikan (LPDP)',
        description: 'Indonesian government graduate funding with return-service obligations.',
        href: 'https://lpdp.kemenkeu.go.id',
        keywords: ['lpdp', 'beasiswa', 'indonesia'],
      },
      {
        title: 'Fulbright / AMINEF',
        description: 'Exchange programs between Indonesia and the United States.',
        href: 'https://www.aminef.or.id',
        keywords: ['fulbright', 'aminef', 'exchange'],
      },
      {
        title: 'United States–Indonesia Society (USINDO)',
        description: 'Scholarships and programs strengthening U.S.–Indonesia ties.',
        href: 'https://usindo.org/',
        keywords: ['usindo', 'scholarship', 'bilateral'],
      },
      {
        title: 'Fulbright doctoral programs',
        description: 'Doctoral and research opportunities—check AMINEF for Indonesian applicants.',
        href: 'https://www.aminef.or.id',
        keywords: ['fulbright', 'doctoral', 'research'],
      },
    ],
  },
  {
    id: 'jobs',
    title: { en: 'Jobs & internships', id: 'Kerja & magang' },
    cards: [
      {
        title: 'LinkedIn student jobs',
        description: 'Filter internships by visa-friendly keywords and location.',
        href: 'https://www.linkedin.com/jobs/',
        keywords: ['linkedin', 'internship', 'job'],
      },
      {
        title: 'Handshake (campus careers)',
        description: 'Many universities host employer listings here first.',
        href: 'https://joinhandshake.com/',
        keywords: ['handshake', 'campus', 'career'],
      },
      {
        title: 'Simplify (internship tracker)',
        description: 'Track applications and deadlines in one workspace.',
        href: 'https://simplify.jobs/',
        keywords: ['applications', 'tracker'],
      },
      {
        title: 'PERMIAS Nasional LinkedIn',
        description: 'National updates on hiring treks and partner employers.',
        href: 'https://www.linkedin.com/company/permiasnasional',
        keywords: ['permias', 'linkedin', 'hiring'],
      },
    ],
  },
  {
    id: 'research',
    title: { en: 'Research opportunities', id: 'Peluang riset' },
    cards: [
      {
        title: 'NSF REU sites',
        description: 'Undergraduate research experiences across U.S. campuses.',
        href: 'https://www.nsf.gov/crssprgm/reu/',
        keywords: ['reu', 'research', 'nsf'],
      },
      {
        title: 'Pathways to Science',
        description: 'Search funded summer research and mentoring programs.',
        href: 'https://pathwaystoscience.org/',
        keywords: ['summer', 'stem', 'mentor'],
      },
      {
        title: 'MIT UROP model (reference)',
        description: 'Learn how structured undergraduate research works at research universities.',
        href: 'https://urop.mit.edu/',
        keywords: ['urop', 'lab', 'undergraduate'],
      },
      {
        title: 'Google Research internships',
        description: 'Industry research internships—competitive global pipelines.',
        href: 'https://research.google/jobs/',
        keywords: ['google', 'research', 'intern'],
      },
    ],
  },
  {
    id: 'entrepreneurship',
    title: { en: 'Entrepreneurship', id: 'Kewirausahaan' },
    cards: [
      {
        title: 'Y Combinator Startup School',
        description: 'Free curriculum on building products and finding users.',
        href: 'https://www.startupschool.org/',
        keywords: ['startup', 'yc', 'free'],
      },
      {
        title: 'MIT Venture Mentoring Service (reference)',
        description: 'Template for how universities structure founder mentoring.',
        href: 'https://vms.mit.edu/',
        keywords: ['venture', 'mentor', 'mit'],
      },
      {
        title: '500 Global blog',
        description: 'Global accelerator insights on pitching and growth.',
        href: 'https://500.co/blog',
        keywords: ['accelerator', 'pitch', 'growth'],
      },
      {
        title: 'Antler founder resources',
        description: 'Guides on validating ideas before incorporating.',
        href: 'https://www.antler.co/',
        keywords: ['antler', 'validate', 'idea'],
      },
    ],
  },
  {
    id: 'cultural',
    title: { en: 'Cultural resources', id: 'Sumber budaya' },
    cards: [
      {
        title: 'Atamerica',
        description: 'Programs, discussions, and cultural events hosted by the U.S. Embassy Jakarta.',
        href: 'https://atamerica.or.id',
        keywords: ['atamerica', 'culture', 'embassy', 'jakarta'],
      },
      {
        title: 'PERMIAS YouTube',
        description: 'Panels, recordings, and national town halls.',
        href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw',
        keywords: ['youtube', 'permias', 'video'],
      },
    ],
  },
];

function cardDescriptionPlain(c) {
  if (!c.description) return '';
  return typeof c.description === 'string' ? c.description : c.description.en ?? '';
}

export function flattenResourcesForSearch() {
  return resourceSections.flatMap((sec) =>
    sec.cards.map((c, i) => ({
      id: `${sec.id}-${i}`,
      category: 'resources',
      title: c.title,
      subtitle: sec.title.en,
      href: `/resources/${sec.id}`,
      anchor: `/resources/${sec.id}`,
      keywords: [c.title, cardDescriptionPlain(c), ...(c.keywords || []), sec.id],
    })),
  );
}
