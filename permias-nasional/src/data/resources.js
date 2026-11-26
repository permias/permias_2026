/** Flattened cards for search + grouped by section id */

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
        photo: 'dc-indonesian-embassy',
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
        photo: 'id-monas',
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
        photo: 'golden-gate-sunset',
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
        photo: 'us-liberty',
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
        photo: 'chicago-skyline',
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
        photo: 'houston-night',
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
        photo: 'la-skyline',
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
      {
        title: 'Info for Student Visa',
        subtitle: { en: 'U.S. Department of State', id: 'Departemen Luar Negeri AS' },
        description: {
          en: 'Student visa (F and M) requirements and how to apply, from the U.S. Department of State.',
          id: 'Syarat visa pelajar (F dan M) dan cara mengajukannya, dari Departemen Luar Negeri AS.',
        },
        href: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
        keywords: ['student visa', 'f1', 'visa pelajar', 'state department'],
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
        href: 'https://educationusa.state.gov/',
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
      {
        title: 'Study in the States (Homeland Security)',
        subtitle: { en: 'U.S. Department of Homeland Security', id: 'Departemen Keamanan Dalam Negeri AS' },
        description: {
          en: 'The DHS guide for international students, from choosing a school to keeping your status.',
          id: 'Panduan DHS untuk mahasiswa internasional, dari memilih kampus hingga menjaga status.',
        },
        href: 'https://studyinthestates.dhs.gov/',
        keywords: ['homeland security', 'dhs', 'study in the states', 'sevp'],
      },
      {
        title: 'US Grad School Admissions',
        subtitle: { en: 'QS Top Universities', id: 'QS Top Universities' },
        description: {
          en: 'Seven steps for applying to graduate school in the United States.',
          id: 'Tujuh langkah mendaftar ke program pascasarjana di Amerika Serikat.',
        },
        href: 'https://www.topuniversities.com/student-info/admissions-advice/us-grad-school-admissions-7-steps',
        keywords: ['graduate', 'grad school', 'admissions', 'pascasarjana'],
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
        title: 'Fulbright Doctoral Degree Scholarship',
        subtitle: { en: 'AMINEF', id: 'AMINEF' },
        description: {
          en: 'A prestigious scholarship program supporting Indonesian students to pursue doctoral studies in the U.S.',
          id: 'Program beasiswa bergengsi yang mendukung mahasiswa Indonesia menempuh studi doktoral di AS.',
        },
        href: 'https://www.aminef.or.id/grants-for-indonesians/fulbright-programs/scholarship/fulbright-doctoral-degree-phd-scholarship/',
        keywords: ['fulbright', 'doctoral', 'phd', 's3', 'research'],
      },
      {
        title: 'AIFIS Fellowship',
        subtitle: { en: 'American Institute for Indonesian Studies', id: 'American Institute for Indonesian Studies' },
        description: {
          en: 'A fellowship program supporting research collaborations between Indonesian and American scholars.',
          id: 'Program fellowship yang mendukung kolaborasi riset antara akademisi Indonesia dan Amerika.',
        },
        href: 'https://www.aifis.org/fellowships',
        keywords: ['aifis', 'fellowship', 'research'],
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
      {
        title: 'Aparatur Sipil Negara Recruitment (SSCASN)',
        subtitle: { en: 'Indonesian civil service', id: 'Aparatur Sipil Negara' },
        description: {
          en: 'The national portal for Indonesian civil service (ASN) recruitment, run by BKN.',
          id: 'Portal nasional seleksi calon Aparatur Sipil Negara (ASN) yang dikelola BKN.',
        },
        href: 'https://sscasn.bkn.go.id/',
        keywords: ['asn', 'cpns', 'pns', 'bkn', 'civil service', 'indonesia'],
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
        href: 'https://research.google/careers/',
        keywords: ['google', 'research', 'intern'],
      },
      {
        title: 'National Labs',
        subtitle: { en: 'Major academic institutions (outside universities)', id: 'Institusi akademik besar (di luar universitas)' },
        description: {
          en: 'Government research labs generally offer various postdoctoral positions.',
          id: 'Laboratorium riset pemerintah umumnya membuka berbagai posisi postdoktoral.',
        },
        href: 'https://www.energy.gov/national-laboratories',
        keywords: ['national labs', 'doe', 'postdoc', 'government'],
      },
      ...[
        ['The Brookings Institution', 'https://www.brookings.edu/', ['policy', 'think tank']],
        ['Harvard Kennedy School Belfer Center', 'https://www.belfercenter.org/', ['harvard', 'policy', 'international affairs']],
        ['Broad Institute', 'https://www.broadinstitute.org/', ['genomics', 'biomedical', 'mit', 'harvard']],
        ['Genentech', 'https://www.gene.com/', ['biotech', 'industry']],
        ['National Bureau of Economic Research', 'https://www.nber.org/', ['nber', 'economics']],
        ['OpenAI', 'https://openai.com/', ['ai', 'artificial intelligence', 'industry']],
      ].map(([title, href, keywords]) => ({
        title,
        subtitle: { en: 'Private research institutions', id: 'Lembaga riset swasta' },
        href,
        keywords,
      })),
      ...[
        ['Indonesia Corruption Watch', 'https://www.antikorupsi.org/', ['icw', 'governance', 'anti-corruption']],
        ['CSIS', 'https://www.csis.or.id/', ['csis', 'policy', 'jakarta']],
        ['Economic Research Institute for ASEAN and East Asia', 'https://www.eria.org/', ['eria', 'asean', 'economics']],
        ['Center for Indonesian Policy Studies', 'https://www.cips-indonesia.org/', ['cips', 'policy']],
        ['LIPI (now part of BRIN)', 'https://www.brin.go.id/', ['lipi', 'brin', 'science']],
        ['The Habibie Center', 'https://habibiecenter.or.id/', ['habibie', 'democracy', 'policy']],
        ['World Bank Indonesia', 'https://www.worldbank.org/en/country/indonesia', ['world bank', 'development']],
        ['JPAL Indonesia', 'https://www.povertyactionlab.org/southeast-asia', ['j-pal', 'jpal', 'poverty', 'economics']],
        ['Center for Sustainable Development Goals Studies, Universitas Padjadjaran', 'https://csdgs.unpad.ac.id/', ['sdgs', 'unpad', 'sustainability']],
      ].map(([title, href, keywords]) => ({
        title,
        subtitle: { en: 'Indonesian research communities & think tanks', id: 'Komunitas riset & think tank Indonesia' },
        href,
        keywords,
      })),
      ...[
        ['IEEE Indonesia Section', 'https://ieee.id/', ['ieee', 'engineering']],
        ['Indonesian Society of Human Genetics (InaSHG)', 'https://www.inashg.org/', ['genetics', 'inashg']],
        ['The Indonesian Society for Biochemistry and Molecular Biology', 'https://pbbmi.org/', ['pbbmi', 'isbmb', 'biochemistry']],
      ].map(([title, href, keywords]) => ({
        title,
        subtitle: { en: 'Formal academic communities & societies', id: 'Komunitas & perhimpunan akademik' },
        href,
        keywords,
      })),
      {
        title: 'Research collaboration in Indonesia (BRIN)',
        subtitle: { en: 'Research collaboration', id: 'Kolaborasi riset' },
        description: {
          en: 'To do research in Indonesia, foreign researchers are required to have collaborators in Indonesia who can sponsor their study.',
          id: 'Untuk meneliti di Indonesia, peneliti asing wajib memiliki mitra kolaborator di Indonesia yang dapat menyponsori penelitiannya.',
        },
        href: 'https://www.brin.go.id/',
        keywords: ['brin', 'ristek', 'collaboration', 'indonesia'],
      },
      {
        title: 'Foreign Research Permit',
        subtitle: { en: 'Research collaboration', id: 'Kolaborasi riset' },
        description: {
          en: 'A Foreign Research Permit is required for international researchers. BRIN handles permits and ethical clearance.',
          id: 'Peneliti asing wajib memiliki Izin Penelitian Asing. BRIN mengurus perizinan dan klirens etik.',
        },
        href: 'https://klirensetik.brin.go.id/?lang=en',
        keywords: ['permit', 'frp', 'izin penelitian', 'brin', 'foreign researcher'],
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
      ...[
        ['Intudo Ventures', 'https://www.intudovc.com/', 'A leading independent VC firm focusing on Indonesia’s early-stage and growth-stage startups.', 'Firma VC independen terkemuka yang berfokus pada startup Indonesia tahap awal dan tahap pertumbuhan.'],
        ['Agaeti Ventures', 'https://agaeti.vc/', 'A venture capital firm investing in high-growth startups across various sectors in Indonesia.', 'Firma modal ventura yang berinvestasi di startup bertumbuh cepat di berbagai sektor di Indonesia.'],
        ['Alpha JWC Ventures', 'https://www.alphajwc.com/', 'An Indonesia-based venture capital firm investing in tech startups across Southeast Asia.', 'Firma modal ventura berbasis di Indonesia yang berinvestasi di startup teknologi di Asia Tenggara.'],
        ['GDP Ventures', 'https://gdpventure.com/', 'A strategic investment firm focusing on digital communities, media, commerce, and solutions.', 'Firma investasi strategis yang berfokus pada komunitas digital, media, perdagangan, dan solusi.'],
        ['East Ventures', 'https://east.vc/', 'A pioneering sector-agnostic venture capital firm backing tech startups in Southeast Asia.', 'Firma modal ventura perintis lintas sektor yang mendukung startup teknologi di Asia Tenggara.'],
        ['Convergence Ventures', 'https://www.convergencevc.com/', 'An early-stage venture capital firm investing in Indonesia’s digital economy.', 'Firma modal ventura tahap awal yang berinvestasi di ekonomi digital Indonesia.'],
        ['Kejora Capital', 'https://www.kejorahq.com/', 'A venture capital firm accelerating startup growth in Indonesia and Southeast Asia.', 'Firma modal ventura yang mempercepat pertumbuhan startup di Indonesia dan Asia Tenggara.'],
        ['CyberAgent Capital', 'https://www.cyberagentcapital.com/en/', 'A Japan-based venture capital firm actively investing in Southeast Asian startups.', 'Firma modal ventura asal Jepang yang aktif berinvestasi di startup Asia Tenggara.'],
        ['Ideosource', 'https://ideosource.com/', 'A VC firm supporting digital innovation and technological transformation in Indonesia.', 'Firma VC yang mendukung inovasi digital dan transformasi teknologi di Indonesia.'],
        ['Venturra Capital', 'https://www.venturra.com/', 'A Southeast Asian-focused venture capital firm investing in tech-driven startups.', 'Firma modal ventura berfokus Asia Tenggara yang berinvestasi di startup berbasis teknologi.'],
      ].map(([title, href, en, id]) => ({
        title,
        subtitle: { en: 'Venture capital in Indonesia', id: 'Modal ventura di Indonesia' },
        description: { en, id },
        href,
        keywords: ['venture capital', 'vc', 'funding', 'startup', 'indonesia'],
      })),
      {
        title: 'Dana Ilmu Pengetahuan Indonesia (DIPI)',
        subtitle: { en: 'Research funding', id: 'Pendanaan riset' },
        description: {
          en: 'An Indonesian science and innovation funding agency supporting research and development.',
          id: 'Lembaga pendanaan ilmu pengetahuan dan inovasi Indonesia yang mendukung riset dan pengembangan.',
        },
        href: 'https://dipi.id/',
        keywords: ['dipi', 'funding', 'science', 'research'],
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
