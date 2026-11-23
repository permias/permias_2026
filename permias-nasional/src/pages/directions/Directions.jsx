import { Link, useParams } from 'react-router-dom';
import { DirPeta } from './DirPeta.jsx';
import { DirKaca } from './DirKaca.jsx';
import { DirMerahPutih } from './DirMerahPutih.jsx';

const DIRECTIONS = [
  { id: 'peta', name: 'Peta', note: 'The chapter map is the hero. Plus Jakarta Sans, cool white ground, glass over the map, pins sweep in west to east.', C: DirPeta },
  { id: 'kaca', name: 'Kaca', note: 'Full-bleed campus photography under liquid glass. Bricolage Grotesque + Plus Jakarta Sans, pointer-following sheen, scroll zoom, glass dock.', C: DirKaca },
  { id: 'merah-putih', name: 'Merah Putih', note: 'Flag split layout, Archivo variable wordmark that stretches from condensed to expanded, city photo rail.', C: DirMerahPutih },
];

/** Dev preview of the three M1 style directions: /__directions and /__directions/:id */
export function Directions() {
  const { id } = useParams();
  const dir = DIRECTIONS.find((d) => d.id === id);
  if (dir) return <dir.C />;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-ui">
      <h1 className="text-4xl font-bold">Style directions</h1>
      <ul className="mt-8 space-y-4">
        {DIRECTIONS.map((d) => (
          <li key={d.id}>
            <Link className="text-xl font-semibold text-brand-red underline" to={`/__directions/${d.id}`}>
              {d.name}
            </Link>
            <p className="mt-1 text-muted-foreground">{d.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
