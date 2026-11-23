import { geoAlbers, geoConicEqualArea } from 'd3-geo';
import params from '../data/mapProjection.json';

/* Same projection fit as scripts/project-chapters.mjs, so a visitor's location lands on the same map as the chapter pins. */
function make(p, factory) {
  const proj = factory().rotate(p.rotate).center(p.center).parallels(p.parallels).scale(1000).translate([0, 0]);
  return (lng, lat) => {
    const xy = proj([lng, lat]);
    if (!xy) return null;
    return { mapX: p.fx.a * xy[0] + p.fx.b, mapY: p.fy.a * xy[1] + p.fy.b };
  };
}

const lower48 = make(params.lower48, geoAlbers);
const hawaii = make(params.hawaii, geoConicEqualArea);

/** Map coordinates for a lat/lng inside the lower 48 or Hawaii; null elsewhere (Alaska, abroad). */
export function projectToMap(lat, lng) {
  if (lat > 18 && lat < 23 && lng > -161 && lng < -154) return hawaii(lng, lat);
  if (lat > 24 && lat < 50 && lng > -125.5 && lng < -66) return lower48(lng, lat);
  return null;
}
