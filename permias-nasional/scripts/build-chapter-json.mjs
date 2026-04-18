/**
 * One-off helper: emits src/data/chapterDirectory.sample.json structure.
 * Full national list is maintained in chapterDirectory.json (imported by chapters.js).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const ph = (t) => `https://placehold.co/96x96/CE1126/FFFFFF?text=${encodeURIComponent(t.slice(0, 4))}`;

/** @type {Array<{chapterName:string, university:string, city:string, state:string, stateId:string, region:string, instagram:string, website:string}>} */
const rows = [
  ['Permias ISANU', '@isanu_', 'Northeastern University', 'Boston', 'Massachusetts', 'ma', 'East Coast'],
  ['ISA BU', '@the.isabu', 'Boston University', 'Boston', 'Massachusetts', 'ma', 'East Coast'],
  ['Permias Massachusetts', '@permiasmass', 'Regional MA', 'Boston', 'Massachusetts', 'ma', 'East Coast'],
  ['BIA Babson', '@bia.babson', 'Babson College', 'Wellesley', 'Massachusetts', 'ma', 'East Coast'],
  ['AIS at MIT', '@indonesia.mit', 'MIT', 'Cambridge', 'Massachusetts', 'ma', 'East Coast'],
  ['Permias Rhode Island', '@permiasri', 'Regional RI', 'Providence', 'Rhode Island', 'ri', 'East Coast'],
  ['Harvard ISA', '@indonesiaharvard', 'Harvard University', 'Cambridge', 'Massachusetts', 'ma', 'East Coast'],
  ['ISA University of New Hampshire', '@isaunh', 'University of New Hampshire', 'Durham', 'New Hampshire', 'nh', 'East Coast'],
  ['ISA Amherst', '@isa.umass', 'UMass Amherst', 'Amherst', 'Massachusetts', 'ma', 'East Coast'],
  ['Indonesia WPI', '@indonesia.wpi', 'Worcester Polytechnic Institute', 'Worcester', 'Massachusetts', 'ma', 'East Coast'],
  ['Berklee Indonesia', '@berkleeindo', 'Berklee College of Music', 'Boston', 'Massachusetts', 'ma', 'East Coast'],
  ['Permias Penn State', '@permiaspennstate', 'Penn State', 'University Park', 'Pennsylvania', 'pa', 'East Coast'],
  ['ISCMU (Carnegie Mellon)', '@cmu_permias', 'Carnegie Mellon', 'Pittsburgh', 'Pennsylvania', 'pa', 'East Coast'],
  ['Permias NYC', '@permiasnyc', 'Regional NYC', 'New York', 'New York', 'ny', 'East Coast'],
  ['Columbia Indonesia', '@indonesiacolumbia', 'Columbia University', 'New York', 'New York', 'ny', 'East Coast'],
  ['ISA at Pitt', '@permias.upitt', 'University of Pittsburgh', 'Pittsburgh', 'Pennsylvania', 'pa', 'East Coast'],
  ['Permias Syracuse', '@permiascuse', 'Syracuse University', 'Syracuse', 'New York', 'ny', 'East Coast'],
  ['Permias New Jersey', '@permiasnj', 'Regional NJ', 'New Brunswick', 'New Jersey', 'nj', 'East Coast'],
  ['Cornell Indonesian Association', '@indonesiaatcornell', 'Cornell University', 'Ithaca', 'New York', 'ny', 'East Coast'],
  ['Permias Rochester', '@permiasrochesterny', 'Regional Rochester', 'Rochester', 'New York', 'ny', 'East Coast'],
  ['NYU Indonesia Community', '@nyu.indonesia', 'NYU', 'New York', 'New York', 'ny', 'East Coast'],
  ['Penncasila', '@penncasila', 'University of Pennsylvania', 'Philadelphia', 'Pennsylvania', 'pa', 'East Coast'],
  ['Permias DC', '@permiasdc', 'Regional DC', 'Washington', 'District of Columbia', 'dc', 'East Coast'],
  ['Permias at NC State University', '@permiasncstate', 'NC State', 'Raleigh', 'North Carolina', 'nc', 'East Coast'],
  ['Permias Virginia Tech', '@permiasvt', 'Virginia Tech', 'Blacksburg', 'Virginia', 'va', 'East Coast'],
  ['Indonesian Student Association at John Hopkins', '@indonesiahopkins', 'Johns Hopkins', 'Baltimore', 'Maryland', 'md', 'East Coast'],
  ['Permias WV', '@permias.wv', 'West Virginia University', 'Morgantown', 'West Virginia', 'wv', 'East Coast'],
  ['Permias UoSC', '@permias.uofsc', 'University of South Carolina', 'Columbia', 'South Carolina', 'sc', 'East Coast'],
  ['Permias Michigan', '@indonesia.umich', 'University of Michigan', 'Ann Arbor', 'Michigan', 'mi', 'Midwest'],
  ['PERMIAS Ohio University', '@permias_ou', 'Ohio University', 'Athens', 'Ohio', 'oh', 'Midwest'],
  ['Permias Kalamazoo', '@permiaskalamazoo', 'Western Michigan University', 'Kalamazoo', 'Michigan', 'mi', 'Midwest'],
  ['PERMIAS Columbus', '@permiascolumbus', 'Ohio State', 'Columbus', 'Ohio', 'oh', 'Midwest'],
  ['Permias MSU', '@permias.msu', 'Michigan State', 'East Lansing', 'Michigan', 'mi', 'Midwest'],
  ['Permias Purdue', '@permiaspurdue', 'Purdue University', 'West Lafayette', 'Indiana', 'in', 'Midwest'],
  ['Permias Notre Dame', '@permiasnd', 'Notre Dame', 'Notre Dame', 'Indiana', 'in', 'Midwest'],
  ['Permias Bloomington', '@permiasbloomington', 'Indiana University Bloomington', 'Bloomington', 'Indiana', 'in', 'Midwest'],
  ['Missouri ISA', '@permiasmissouri', 'University of Missouri', 'Columbia', 'Missouri', 'mo', 'Midwest'],
  ['Permias Kansas', '@permiaskansas', 'University of Kansas', 'Lawrence', 'Kansas', 'ks', 'Midwest'],
  ['Permias Ames', '@permias.ames', 'Iowa State', 'Ames', 'Iowa', 'ia', 'Midwest'],
  ['Permias UIUC', '@permiasuiuc', 'UIUC', 'Champaign', 'Illinois', 'il', 'Midwest'],
  ['PERMIAS Chicago', '@permiaschicago', 'Regional Chicago', 'Chicago', 'Illinois', 'il', 'Midwest'],
  ['IDSA Northwestern University', '@idsa.nu', 'Northwestern', 'Evanston', 'Illinois', 'il', 'Midwest'],
  ['Permias Madison', '@permiasmadison', 'UW–Madison', 'Madison', 'Wisconsin', 'wi', 'Midwest'],
  ['Indos at KU (ISAKU)', '@indoatku', 'University of Kansas', 'Lawrence', 'Kansas', 'ks', 'Midwest'],
  ['Permias Minnesota', '@permiasmn', 'University of Minnesota', 'Minneapolis', 'Minnesota', 'mn', 'Midwest'],
  ['Permias Texas A&M', '@permiastamu', 'Texas A&M', 'College Station', 'Texas', 'tx', 'South'],
  ['Permias Austin', '@permiasaustin', 'UT Austin', 'Austin', 'Texas', 'tx', 'South'],
  ['Permias Arkansas', '@permiasarkansas', 'University of Arkansas', 'Fayetteville', 'Arkansas', 'ar', 'South'],
  ['Permias Georgia Tech', '@isa.gatech', 'Georgia Tech', 'Atlanta', 'Georgia', 'ga', 'South'],
  ['Permias Auburn', '@ais.auburn', 'Auburn University', 'Auburn', 'Alabama', 'al', 'South'],
  ['Permias Oklahoma', '@permiasok', 'University of Oklahoma', 'Norman', 'Oklahoma', 'ok', 'South'],
  ['Permias UF (Gainesville)', '@permiasgainesville', 'University of Florida', 'Gainesville', 'Florida', 'fl', 'South'],
  ['Permias Dallas', '@permiasdallas', 'Regional Dallas', 'Dallas', 'Texas', 'tx', 'South'],
  ['ISA GSU', '@isa.gsu', 'Georgia State', 'Atlanta', 'Georgia', 'ga', 'South'],
  ['BYUH-Indonesia', '@byuhindonesianchapter', 'BYU–Hawaii', 'Laie', 'Hawaii', 'hi', 'West Coast'],
  ['Permias San Diego', '@permias.sdia', 'UC San Diego', 'La Jolla', 'California', 'ca', 'West Coast'],
  ['ISUCI', '@permias.isuci', 'UC Irvine', 'Irvine', 'California', 'ca', 'West Coast'],
  ['Permias SMC', '@permiassmc', 'Santa Monica College', 'Santa Monica', 'California', 'ca', 'West Coast'],
  ['Permias Pasadena', '@permiaspasadena', 'Pasadena City College', 'Pasadena', 'California', 'ca', 'West Coast'],
  ['Permias LA', '@permiasla', 'Regional LA', 'Los Angeles', 'California', 'ca', 'West Coast'],
  ['Permias Hawaii', '@permiashawaii', 'Regional Hawaii', 'Honolulu', 'Hawaii', 'hi', 'West Coast'],
  ['ILMU', '@indoatlmu', 'LMU', 'Los Angeles', 'California', 'ca', 'West Coast'],
  ['USC ASIS', '@uscasis', 'USC', 'Los Angeles', 'California', 'ca', 'West Coast'],
  ['Pepperdine BOIS', '@pepperdine.bois', 'Pepperdine', 'Malibu', 'California', 'ca', 'West Coast'],
  ['IBSA Bruins UCLA', '@bruins.ibsa', 'UCLA', 'Los Angeles', 'California', 'ca', 'West Coast'],
  ['Permias Phoenix', '@permiasphoenix', 'University of Phoenix', 'Phoenix', 'Arizona', 'az', 'West Coast'],
  ['Permias Tucson', '@permiastucson', 'University of Arizona', 'Tucson', 'Arizona', 'az', 'West Coast'],
  ['Permias Claremont', '@permiasclaremont', 'Claremont Colleges', 'Claremont', 'California', 'ca', 'West Coast'],
  ['Permias Utah', '@permiasutah', 'Regional Utah', 'Salt Lake City', 'Utah', 'ut', 'West Coast'],
  ['Permias CSULB', '@permiaslb', 'CSU Long Beach', 'Long Beach', 'California', 'ca', 'West Coast'],
  ['Permias Golden - Colorado', '@permiasgolden.colorado', 'Regional Colorado', 'Denver', 'Colorado', 'co', 'West Coast'],
  ['Biola Bisa', '@biolabisa', 'Biola University', 'La Mirada', 'California', 'ca', 'West Coast'],
  ['Permias Art Center', '@permias_ac', 'Art Center College of Design', 'Pasadena', 'California', 'ca', 'West Coast'],
  ['Permias USF', '@permias.usfca', 'University of San Francisco', 'San Francisco', 'California', 'ca', 'West Coast'],
  ['Stanford ISA', '@stanford.indonesia', 'Stanford', 'Stanford', 'California', 'ca', 'West Coast'],
  ['Berkeley BISA', '@berkeleybisa', 'UC Berkeley', 'Berkeley', 'California', 'ca', 'West Coast'],
  ['Permias De Anza', '@permias_deanza', 'De Anza College', 'Cupertino', 'California', 'ca', 'West Coast'],
  ['Permias UC Davis', '@permiasucd', 'UC Davis', 'Davis', 'California', 'ca', 'West Coast'],
  ['Permias SFBA', '@permias.sfba', 'Regional SF Bay', 'San Francisco', 'California', 'ca', 'West Coast'],
  ['IndoDVC', '@indodvc', 'Diablo Valley College', 'Pleasant Hill', 'California', 'ca', 'West Coast'],
  ['Permias Spokane', '@permiasspokane', 'Gonzaga University', 'Spokane', 'Washington', 'wa', 'West Coast'],
  ['Permias Seattle', '@permiasseattle', 'Regional Seattle', 'Seattle', 'Washington', 'wa', 'West Coast'],
  ['Permias Bellevue', '@bellevueindoclub', 'Bellevue College', 'Bellevue', 'Washington', 'wa', 'West Coast'],
  ['Permias Oregon', '@permiasoregon', 'Oregon State', 'Corvallis', 'Oregon', 'or', 'West Coast'],
  ['ISAUW', '@isauwhuskies', 'University of Washington', 'Seattle', 'Washington', 'wa', 'West Coast'],
  ['ISC Shoreline', '@iscshoreline', 'Shoreline CC', 'Shoreline', 'Washington', 'wa', 'West Coast'],
  ['Permias Bellingham', '@permiasbham', 'Regional Bellingham', 'Bellingham', 'Washington', 'wa', 'West Coast'],
  ['Edmonds Indonesian Club', '@eicindoclub', 'Edmonds College', 'Lynnwood', 'Washington', 'wa', 'West Coast'],
  ['ISO at Green River College', '@isogrc', 'Green River College', 'Auburn', 'Washington', 'wa', 'West Coast'],
  ['IMAPA USA Canada', '@imapausacanada', 'National', 'Washington', 'District of Columbia', 'dc', 'West Coast'],
];

const chapters = rows.map(([chapterName, instagram, university, city, state, stateId, region], i) => {
  const igHandle = instagram.replace(/^@/, '');
  const id = `c-${igHandle.replace(/[^a-z0-9]/gi, '').slice(0, 24) || `ch-${i}`}`;
  return {
    id,
    chapterName,
    university,
    city,
    state,
    stateId,
    region,
    instagram,
    line: '',
    whatsapp: '',
    email: `${igHandle || 'chapter'}@permiasnasional.com`,
    website: `https://instagram.com/${igHandle}`,
    logoUrl: ph(chapterName),
  };
});

const out = path.join(root, 'src/data/chapterDirectory.json');
fs.writeFileSync(out, JSON.stringify(chapters, null, 2));
console.log('Wrote', chapters.length, 'chapters to', out);
