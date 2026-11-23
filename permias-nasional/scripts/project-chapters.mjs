/**
 * Fits the @svg-maps/usa artwork to real geography and writes map x/y for every chapter.
 *
 * The SVG map is an Albers-style drawing with Alaska/Hawaii insets. We project every state with
 * d3-geo, fit a per-axis linear transform (scale + offset) from projected bounds to the SVG path
 * bounds (least squares), and report the residual so a bad fit is visible.
 *
 * usage: node scripts/project-chapters.mjs   (reads/writes src/data/chapterDirectory.json)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoAlbers, geoConicEqualArea } from 'd3-geo';
import { feature } from 'topojson-client';
import { svgPathBbox } from 'svg-path-bbox';

const require = createRequire(import.meta.url);
const usaMap = require('@svg-maps/usa').default ?? require('@svg-maps/usa');
const topo = require('us-atlas/states-10m.json');
const states = feature(topo, topo.objects.states).features;
const DATA = new URL('../src/data/chapterDirectory.json', import.meta.url);

const svgByName = new Map(usaMap.locations.map((l) => [l.name.toLowerCase(), l]));

function lsq(pairs) {
  // y = a*x + b
  const n = pairs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of pairs) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { a, b: (sy - a * sx) / n };
}

function fit(projection, names) {
  const xs = [], ys = [];
  for (const f of states) {
    const name = f.properties.name.toLowerCase();
    if (!names(name)) continue;
    const svg = svgByName.get(name);
    if (!svg) continue;
    const [[x0, y0], [x1, y1]] = boundsOf(projection, f);
    const [sx0, sy0, sx1, sy1] = svgPathBbox(svg.path);
    xs.push([x0, sx0], [x1, sx1]);
    ys.push([y0, sy0], [y1, sy1]);
  }
  const fx = lsq(xs), fy = lsq(ys);
  const err = Math.sqrt(
    [...xs.map(([p, s]) => fx.a * p + fx.b - s), ...ys.map(([p, s]) => fy.a * p + fy.b - s)]
      .reduce((m, d) => m + d * d, 0) / (xs.length + ys.length),
  );
  return { fx, fy, err };
}

function boundsOf(projection, f) {
  // projected bounds of the largest polygon only (ignores far-flung islands)
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  let best = null, bestN = -1;
  for (const p of polys) if (p[0].length > bestN) { best = p; bestN = p[0].length; }
  const g = { type: 'Feature', geometry: { type: 'Polygon', coordinates: best } };
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [lng, lat] of g.geometry.coordinates[0]) {
    const [x, y] = projection([lng, lat]);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return [[x0, y0], [x1, y1]];
}

// Lower 48: try a few common Albers parameterisations and keep the best fit.
const lower48 = (n) => n !== 'alaska' && n !== 'hawaii' && n !== 'puerto rico';
let best = null;
for (const rot of [96, 96.5, 97, 98]) {
  for (const par of [[29.5, 45.5], [33, 45], [29.5, 49.5]]) {
    const proj = geoAlbers().rotate([rot, 0]).center([0, 38]).parallels(par).scale(1000).translate([0, 0]);
    const r = fit(proj, lower48);
    if (!best || r.err < best.err) best = { ...r, proj, rot, par };
  }
}
const hiProj = geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]).scale(1000).translate([0, 0]);
const hi = fit(hiProj, (n) => n === 'hawaii');
console.log(`lower48 fit: rotate ${best.rot}, parallels ${best.par}, rms error ${best.err.toFixed(2)} svg units`);
console.log(`hawaii fit rms error ${hi.err.toFixed(2)} svg units`);

const rows = JSON.parse(readFileSync(DATA, 'utf8'));
for (const c of rows) {
  if (typeof c.lat !== 'number' || typeof c.lng !== 'number') continue;
  const isHi = c.stateId === 'hi';
  const { proj, fx, fy } = isHi ? { proj: hiProj, ...hi } : best;
  const [px, py] = proj([c.lng, c.lat]);
  c.mapX = Math.round((fx.a * px + fx.b) * 10) / 10;
  c.mapY = Math.round((fy.a * py + fy.b) * 10) / 10;
}
writeFileSync(DATA, `${JSON.stringify(rows, null, 2)}\n`);
console.log(`wrote mapX/mapY for ${rows.filter((r) => r.mapX != null).length} chapters`);
