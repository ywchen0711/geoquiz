// Makes the questions. Each one says what to show (a map with a country lit up, a flag, a map to click on, or just
// words), the choices and the answer, and a line to show afterwards.
import { COUNTRIES, CONT, REGION_OF, TW, FACTS } from './data.js';

export const rnd = (n) => Math.floor(Math.random() * n), pick = (a) => a[rnd(a.length)];
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export const LEVELS = [
  { name: '簡單', tier: 1, opts: 4, time: 20, mult: 1, note: '有名的國家，四選一，每題 20 秒' },
  { name: '普通', tier: 2, opts: 4, time: 15, mult: 1.2, note: '更多國家，加上在地圖上點出位置，每題 15 秒' },
  { name: '困難', tier: 3, opts: 4, time: 15, mult: 1.5, near: true, note: '全世界的國家，選項都是鄰近國家，每題 15 秒' },
  { name: '專家', tier: 3, opts: 6, time: 10, mult: 2, near: true, world: true, note: '六選一，在整張世界地圖上點，每題 10 秒' },
];
export const TOPICS = [
  { id: 'mix', name: '綜合', icon: '🌏', note: '什麼都考' },
  { id: 'map', name: '世界地圖', icon: '🗺️', note: '看地圖認國家、在地圖上找國家' },
  { id: 'flag', name: '國旗', icon: '🚩', note: '看國旗猜國家、找出正確的國旗' },
  { id: 'cap', name: '首都', icon: '🏛️', note: '各國的首都' },
  { id: 'tw', name: '台灣', icon: '<img src="flags/tw.svg" alt="">', note: '台灣的縣市、景點和地理' },
  { id: 'fact', name: '地理常識', icon: '⛰️', note: '山、河、海、名勝古蹟' },
];
const TYPES = {
  mix: ['mapName', 'mapClick', 'flagName', 'flagPick', 'capOf', 'capRev', 'contOf', 'twName', 'twClick', 'twFact', 'fact'],
  map: ['mapName', 'mapName', 'mapClick', 'contOf'], flag: ['flagName', 'flagName', 'flagPick'], cap: ['capOf', 'capOf', 'capRev'],
  tw: ['twName', 'twClick', 'twFact', 'twFact', 'twTrivia'], fact: ['fact'],
};
const NEED = { mapClick: 1, flagPick: 1, capRev: 2, twClick: 1 }; // the lowest level (0-3) that asks it
export const contOf = (c) => c.cont || REGION_OF[+c.num];

// countries on the map, set by the map module once it has loaded (the small islands are not drawn)
export const ON_MAP = new Set(), BIG = new Set();
export function makeQuiz(topic, lv, n) {
  const L = LEVELS[lv], types = TYPES[topic].filter((t) => (NEED[t] || 0) <= lv), out = [], used = new Set();
  for (let k = 0, tries = 0; out.length < n && tries < n * 30; tries++) {
    const t = types[k % types.length]; k++;
    const q = make(shuffle([t])[0], L, lv);
    if (!q || used.has(q.key)) continue;
    used.add(q.key); out.push({ ...q, time: L.time });
  }
  return shuffle(out);
}
const pool = (L, f = () => true) => COUNTRIES.filter((c) => c.tier <= L.tier && f(c));
// wrong choices: neighbours on the same continent when the level asks for it
function others(c, L, key, n) {
  const all = COUNTRIES.filter((x) => x !== c && key(x) && key(x) !== key(c));
  const near = L.near ? all.filter((x) => contOf(x) === contOf(c)) : [];
  const easy = all.filter((x) => x.tier <= Math.max(L.tier, 2));
  const res = [];
  for (const x of [...shuffle(near), ...shuffle(easy), ...shuffle(all)]) { if (res.length >= n) break; if (!res.some((y) => key(y) === key(x))) res.push(x); }
  return res;
}
const names = (c, L) => shuffle([c.name, ...others(c, L, (x) => x.name, L.opts - 1).map((x) => x.name)]);

function make(t, L, lv) {
  if (t === 'mapName') {
    const c = pick(pool(L, (x) => ON_MAP.has(+x.num))); if (!c) return null;
    return { key: t + c.num, ask: '地圖上亮起來的是哪一個國家？', show: { map: 'world', lit: +c.num, region: contOf(c), whole: L.world }, opts: names(c, L), ans: c.name, info: infoOf(c) };
  }
  if (t === 'mapClick') {
    const c = pick(pool(L, (x) => BIG.has(+x.num) && (lv >= 3 || x.tier <= 2))); if (!c) return null;
    return { key: t + c.num, ask: `請在地圖上點出「${c.name}」`, show: { map: 'world', click: true, region: contOf(c), whole: L.world }, ans: +c.num, ansName: c.name, info: infoOf(c) };
  }
  if (t === 'flagName') {
    const c = pick(pool(L));
    return { key: t + c.num, ask: '這是哪一個國家的國旗？', show: { flag: c.a2 }, opts: names(c, L), ans: c.name, info: infoOf(c) };
  }
  if (t === 'flagPick') {
    const c = pick(pool(L)), o = shuffle([c, ...others(c, L, (x) => x.name, L.opts - 1)]);
    return { key: t + c.num, ask: `哪一面是「${c.name}」的國旗？`, flags: o.map((x) => ({ a2: x.a2, name: x.name })), ans: c.name, info: infoOf(c) };
  }
  if (t === 'capOf') {
    const c = pick(pool(L, (x) => x.cap));
    const o = shuffle([c.cap, ...others(c, L, (x) => x.cap, L.opts - 1).map((x) => x.cap)]);
    return { key: t + c.num, ask: `「${c.name}」的首都是哪裡？`, show: { flag: c.a2, small: true }, opts: o, ans: c.cap, info: `${c.name}的首都是${c.cap}。` };
  }
  if (t === 'capRev') {
    const c = pick(pool(L, (x) => x.cap && !x.cap.includes(x.name) && !COUNTRIES.some((y) => y !== x && y.cap === x.cap))); if (!c) return null;
    return { key: t + c.num, ask: `「${c.cap}」是哪一個國家的首都？`, opts: names(c, L), ans: c.name, info: `${c.cap}是${c.name}的首都。` };
  }
  if (t === 'contOf') {
    const c = pick(pool(L, (x) => x.cont && ON_MAP.has(+x.num)));
    const all = Object.values(CONT), right = CONT[c.cont];
    return { key: t + c.num, ask: `「${c.name}」在哪一個洲？`, show: { map: 'world', lit: +c.num, whole: true, hideName: true }, opts: shuffle([right, ...shuffle(all.filter((x) => x !== right)).slice(0, L.opts - 1)]), ans: right, info: `${c.name}在${right}。` };
  }
  if (t === 'twName') {
    const [name, known] = pick(TW);
    return { key: t + name, ask: '地圖上亮起來的是哪一個縣市？', show: { map: 'tw', lit: name }, opts: twNames(name, L), ans: name, info: `${name}：${known}。` };
  }
  if (t === 'twClick') {
    const [name, known] = pick(TW);
    return { key: t + name, ask: `請在地圖上點出「${name}」`, show: { map: 'tw', click: true }, ans: name, ansName: name, info: `${name}：${known}。` };
  }
  if (t === 'twFact') {
    const [name, known] = pick(TW), sight = pick(known.split('、'));
    return { key: t + name + sight, ask: `「${sight}」在哪一個縣市？`, opts: twNames(name, L), ans: name, info: `${name}：${known}。`, after: { map: 'tw', lit: name } };
  }
  if (t === 'twTrivia' || t === 'fact') {
    const list = FACTS.filter((f) => f[5] <= lv + 1 + (lv === 3 ? 9 : 0) && (t === 'fact' || /台灣|縣/.test(f[0])));
    const f = pick(list); if (!f) return null;
    const wrong = f.slice(2, 5);
    return { key: 'fact' + f[0], ask: f[0], opts: shuffle([f[1], ...wrong.slice(0, Math.min(L.opts - 1, wrong.length))]), ans: f[1], info: `答案是「${f[1]}」。` };
  }
  return null;
}
// counties next to each other make the harder wrong choices
const TW_NEAR = { 台北市: '新北市基隆市桃園市', 新北市: '台北市基隆市宜蘭縣桃園市', 基隆市: '新北市台北市宜蘭縣', 桃園市: '新北市新竹縣台北市', 新竹市: '新竹縣苗栗縣桃園市', 新竹縣: '新竹市苗栗縣桃園市',
  苗栗縣: '新竹縣台中市新竹市', 台中市: '苗栗縣彰化縣南投縣', 彰化縣: '台中市南投縣雲林縣', 南投縣: '台中市彰化縣雲林縣嘉義縣花蓮縣', 雲林縣: '彰化縣嘉義縣南投縣', 嘉義市: '嘉義縣雲林縣台南市',
  嘉義縣: '嘉義市雲林縣台南市南投縣', 台南市: '嘉義縣高雄市嘉義市', 高雄市: '台南市屏東縣台東縣', 屏東縣: '高雄市台東縣', 宜蘭縣: '新北市花蓮縣基隆市', 花蓮縣: '宜蘭縣台東縣南投縣',
  台東縣: '花蓮縣屏東縣高雄市', 澎湖縣: '金門縣連江縣台南市', 金門縣: '連江縣澎湖縣', 連江縣: '金門縣澎湖縣' };
function twNames(name, L) {
  const near = (TW_NEAR[name] || '').match(/.{2}[市縣]/g) || [], all = TW.map((t) => t[0]).filter((x) => x !== name);
  const wrong = [...new Set([...(L.near ? shuffle(near) : []), ...shuffle(all)])].filter((x) => x !== name).slice(0, L.opts - 1);
  return shuffle([name, ...wrong]);
}
function infoOf(c) { return `${c.name}${contOf(c) ? `，在${CONT[contOf(c)]}` : ''}${c.cap ? `，首都是${c.cap}` : ''}。`; }
