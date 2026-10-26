// The maps: the world (Natural Earth 1:110m, from world-atlas) and Taiwan's counties (from taiwan-atlas, Ministry of
// the Interior data), drawn as SVG with d3-geo. A map can light one place up, or let the player click on one.
import { ON_MAP, BIG } from './quiz.js';
const d3 = window.d3, topojson = window.topojson;
let WORLD = null, TWF = null;
let lang = 'zh';
export const setMapLang = (l) => { lang = l; };
const INSET = { zh: { 連江縣: '連江', 金門縣: '金門' }, en: { 連江縣: 'Matsu', 金門縣: 'Kinmen' } };
const W = 800;
const tall = () => window.innerWidth < 560; // phones get a taller map, so the zoomed-in part is bigger
// how far to zoom in for each continent (corners in longitude, latitude)
const BOX = { 亞: [[25, -10], [150, 55]], 歐: [[-25, 34], [45, 71]], 非: [[-20, -36], [55, 38]], 北: [[-170, 5], [-50, 75]], 南: [[-85, -56], [-33, 13]], 洋: [[110, -48], [180, 0]] };

export async function loadMaps() {
  const [w, t] = await Promise.all([fetch('data/world-110m.json').then((r) => r.json()), fetch('data/tw-counties.json').then((r) => r.json())]);
  WORLD = topojson.feature(w, w.objects.countries).features.filter((f) => f.id !== '010'); // no Antarctica
  TWF = topojson.feature(t, t.objects.counties).features;
  const pj = d3.geoNaturalEarth1().fitSize([W, 460], { type: 'FeatureCollection', features: WORLD }), path = d3.geoPath(pj);
  for (const f of WORLD) { if (f.id == null) continue; ON_MAP.add(+f.id); if (path.area(f) > 30) BIG.add(+f.id); }
}
const box = (k) => ({ type: 'MultiPoint', coordinates: [BOX[k][0], BOX[k][1], [BOX[k][0][0], BOX[k][1][1]], [BOX[k][1][0], BOX[k][0][1]]] });

// opts: lit (country number), click (true), region (continent letter), whole (the whole world)
export function worldSVG(o) {
  const H = !o.whole && o.region && tall() ? 640 : 460;
  const pj = o.whole || !o.region ? d3.geoNaturalEarth1() : d3.geoMercator();
  if (o.whole || !o.region) pj.fitExtent([[6, 6], [W - 6, H - 6]], { type: 'FeatureCollection', features: WORLD });
  else pj.fitExtent([[10, 10], [W - 10, H - 10]], box(o.region));
  const path = d3.geoPath(pj);
  let rings = '';
  const ps = WORLD.map((f) => {
    const id = f.id == null ? '' : +f.id, d = path(f); if (!d) return '';
    if (id === o.lit && path.area(f) < 120) { const [x, y] = path.centroid(f); rings = `<circle class="ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16"/>`; }
    return `<path d="${d}" data-id="${id}" class="c ${id === o.lit ? 'lit' : ''}"/>`;
  }).join('');
  const grat = path(d3.geoGraticule10());
  return `<svg class="map world ${o.click ? 'clickable' : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><rect class="sea" width="${W}" height="${H}"/><path class="grat" d="${grat}"/>${ps}${rings}</svg>`;
}
// Taiwan with Kinmen and Matsu in their own boxes
export function twSVG(o) {
  const TWW = 380, TWH = 500, main = TWF.filter((f) => !['金門縣', '連江縣'].includes(f.properties.COUNTYNAME));
  const draw = (fs, pj) => { const path = d3.geoPath(pj); return fs.map((f) => { const n = f.properties.COUNTYNAME; return `<path d="${path(f)}" data-id="${n}" class="c ${n === o.lit ? 'lit' : ''}"/>`; }).join(''); };
  const pm = d3.geoMercator().fitExtent([[100, 12], [TWW - 12, TWH - 12]], { type: 'FeatureCollection', features: main });
  // the main islands of each, not every far-off islet
  const AREA = { 連江縣: [[119.86, 25.94], [120.32, 26.32]], 金門縣: [[118.2, 24.38], [118.5, 24.53]] };
  const inset = (name, y) => { const fs = TWF.filter((f) => f.properties.COUNTYNAME === name), [a, b] = AREA[name]; const pj = d3.geoMercator().fitExtent([[12, y + 18], [92, y + 94]], { type: 'MultiPoint', coordinates: [a, b] }).clipExtent([[7, y + 1], [97, y + 99]]); return `<rect class="inset" x="6" y="${y}" width="92" height="100" rx="6"/><text x="52" y="${y + 14}" class="lbl">${INSET[lang][name]}</text>${draw(fs, pj)}`; };
  // a ring around the small places, so they can be seen
  let ring = '';
  if (o.lit) { const f = TWF.find((x) => x.properties.COUNTYNAME === o.lit); if (f && main.includes(f)) { const path = d3.geoPath(pm); if (path.area(f) < 300) { const [x, y] = path.centroid(f); ring = `<circle class="ring" cx="${x}" cy="${y}" r="14"/>`; } } }
  return `<svg class="map tw ${o.click ? 'clickable' : ''}" viewBox="0 0 ${TWW} ${TWH}"><rect class="sea" width="${TWW}" height="${TWH}"/>${draw(main, pm)}${inset('連江縣', 20)}${inset('金門縣', 130)}${ring}</svg>`;
}
