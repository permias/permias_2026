/**
 * Home slideshow: US landmarks and campuses alternating with Indonesian monuments.
 * Every photo is free-licensed from Wikimedia Commons (see imageCredits.json / public/images/CREDITS.md).
 * `chapters` = PERMIAS chapters that meet near a US landmark (ids from chapterDirectory.json).
 */
export const heroSlides = [
  { slug: 'golden-gate-sunset', country: 'us', name: { en: 'Golden Gate Bridge', id: 'Jembatan Golden Gate' }, place: 'San Francisco, California', chapters: ['c-permiassfba', 'c-permiasusfca', 'c-berkeleybisa'] },
  { slug: 'borobudur-sunrise', country: 'id', name: { en: 'Borobudur', id: 'Candi Borobudur' }, place: 'Magelang, Jawa Tengah' },
  { slug: 'campus-columbia-low', country: 'us', name: { en: 'Low Memorial Library, Columbia University', id: 'Low Memorial Library, Columbia University' }, place: 'New York City', chapters: ['c-indonesiacolumbia', 'c-nyuindonesia', 'c-permiasnyc'] },
  { slug: 'id-prambanan', country: 'id', name: { en: 'Prambanan', id: 'Candi Prambanan' }, place: 'Sleman, Yogyakarta' },
  { slug: 'us-lincoln-reflecting', country: 'us', name: { en: 'Lincoln Memorial Reflecting Pool', id: 'Kolam Lincoln Memorial' }, place: 'Washington, DC', chapters: ['c-permiasdc'] },
  { slug: 'id-ulun-danu', country: 'id', name: { en: 'Pura Ulun Danu Bratan', id: 'Pura Ulun Danu Bratan' }, place: 'Tabanan, Bali' },
  { slug: 'campus-uw-quad', country: 'us', name: { en: 'The Quad, University of Washington', id: 'The Quad, University of Washington' }, place: 'Seattle, Washington', chapters: ['c-isauwhuskies', 'c-permiasseattle'] },
  { slug: 'id-gedung-sate', country: 'id', name: { en: 'Gedung Sate', id: 'Gedung Sate' }, place: 'Bandung, Jawa Barat' },
  { slug: 'us-brooklyn-bridge', country: 'us', name: { en: 'Brooklyn Bridge', id: 'Jembatan Brooklyn' }, place: 'New York City', chapters: ['c-permiasnyc'] },
  { slug: 'id-monas', country: 'id', name: { en: 'National Monument (Monas)', id: 'Monumen Nasional (Monas)' }, place: 'Jakarta' },
  { slug: 'campus-stanford', country: 'us', name: { en: 'Main Quad, Stanford University', id: 'Main Quad, Stanford University' }, place: 'Stanford, California', chapters: ['c-stanfordindonesia'] },
  { slug: 'id-tanah-lot', country: 'id', name: { en: 'Pura Tanah Lot', id: 'Pura Tanah Lot' }, place: 'Tabanan, Bali' },
  { slug: 'berkeley-glade', country: 'us', name: { en: 'Memorial Glade and Sather Tower, UC Berkeley', id: 'Memorial Glade dan Sather Tower, UC Berkeley' }, place: 'Berkeley, California', chapters: ['c-berkeleybisa'] },
  { slug: 'id-jam-gadang', country: 'id', name: { en: 'Jam Gadang', id: 'Jam Gadang' }, place: 'Bukittinggi, Sumatera Barat' },
];
