// Makes the questions, in Chinese or English. Each one says what to show (a map with a country lit up, a flag, a
// map to click on, or just words), the choices and the answer, and a line to show afterwards.
import { COUNTRIES, CONT, REGION_OF, TW, FACTS } from './data.js';
import { EN, CONT_EN, TW_EN, FACTS_EN } from './data_en.js';

export const rnd = (n) => Math.floor(Math.random() * n), pick = (a) => a[rnd(a.length)];
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

let lang = 'zh';
export const setLang = (l) => { lang = l; };
const en = () => lang === 'en';
const nm = (c) => (en() ? EN.get(c.a2).name : c.name), cp = (c) => (en() ? EN.get(c.a2).cap : c.cap);
const ct = (k) => (en() ? CONT_EN : CONT)[k];
const twN = (n) => (en() ? TW_EN[n][0] : n), twSights = (n) => (en() ? TW_EN[n][1] : TW.find((t) => t[0] === n)[1].split('、'));
const list = (a) => (en() ? a.join(', ') : a.join('、'));

export const LEVELS = [
  { name: '簡單', en: 'Easy', tier: 1, opts: 4, time: 20, mult: 1, note: '有名的國家，四選一，每題 20 秒', noteEn: 'Well-known countries, 4 choices, 20 s each' },
  { name: '普通', en: 'Normal', tier: 2, opts: 4, time: 15, mult: 1.2, note: '更多國家，加上在地圖上點出位置，每題 15 秒', noteEn: 'More countries, plus finding them on the map, 15 s' },
  { name: '困難', en: 'Hard', tier: 3, opts: 4, time: 15, mult: 1.5, near: true, note: '全世界的國家，選項都是鄰近國家，每題 15 秒', noteEn: 'Every country, wrong answers from its neighbours, 15 s' },
  { name: '專家', en: 'Expert', tier: 3, opts: 6, time: 10, mult: 2, near: true, world: true, note: '六選一，在整張世界地圖上點，每題 10 秒', noteEn: '6 choices, click on the whole world map, 10 s' },
];
export const TOPICS = [
  { id: 'mix', name: '綜合', en: 'Mixed', icon: '🌏', note: '什麼都考', noteEn: 'A bit of everything' },
  { id: 'map', name: '世界地圖', en: 'World map', icon: '🗺️', note: '看地圖認國家、在地圖上找國家', noteEn: 'Name the country, find it on the map' },
  { id: 'flag', name: '國旗', en: 'Flags', icon: '🚩', note: '看國旗猜國家、找出正確的國旗', noteEn: 'Whose flag is it? Pick the right flag' },
  { id: 'cap', name: '首都', en: 'Capitals', icon: '🏛️', note: '各國的首都', noteEn: 'Capital cities' },
  { id: 'tw', name: '台灣', en: 'Taiwan', icon: '<img src="flags/tw.svg" alt="">', note: '台灣的縣市、景點和地理', noteEn: 'Taiwan’s counties and sights' },
  { id: 'fact', name: '地理常識', en: 'Geography', icon: '⛰️', note: '山、河、海、名勝古蹟', noteEn: 'Mountains, rivers, seas, landmarks' },
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
    const q = make(t, L, lv);
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
const names = (c, L) => shuffle([nm(c), ...others(c, L, nm, L.opts - 1).map(nm)]);
// the words of each question
const ASK = {
  mapName: ['地圖上亮起來的是哪一個國家？', 'Which country is lit up on the map?'],
  mapClick: [(x) => `請在地圖上點出「${x}」`, (x) => `Click on ${x} on the map`],
  flagName: ['這是哪一個國家的國旗？', 'Whose flag is this?'],
  flagPick: [(x) => `哪一面是「${x}」的國旗？`, (x) => `Which is the flag of ${x}?`],
  capOf: [(x) => `「${x}」的首都是哪裡？`, (x) => `What is the capital of ${x}?`],
  capRev: [(x) => `「${x}」是哪一個國家的首都？`, (x) => `${x} is the capital of which country?`],
  contOf: [(x) => `「${x}」在哪一個洲？`, (x) => `Which continent is ${x} in?`],
  twName: ['地圖上亮起來的是哪一個縣市？', 'Which county or city is lit up on the map?'],
  twClick: [(x) => `請在地圖上點出「${x}」`, (x) => `Click on ${x} on the map`],
  twFact: [(x) => `「${x}」在哪一個縣市？`, (x) => `Where in Taiwan is ${x}?`],
};
const ask = (t, x) => { const a = ASK[t][en() ? 1 : 0]; return typeof a === 'function' ? a(x) : a; };
const capInfo = (c) => (en() ? `The capital of ${nm(c)} is ${cp(c)}.` : `${nm(c)}的首都是${cp(c)}。`);
function infoOf(c) {
  const k = contOf(c);
  if (en()) return `${nm(c)}${k ? `, in ${ct(k)}` : ''}${cp(c) ? `; its capital is ${cp(c)}` : ''}.`;
  return `${nm(c)}${k ? `，在${ct(k)}` : ''}${cp(c) ? `，首都是${cp(c)}` : ''}。`;
}
const twInfo = (n) => `${twN(n)}${en() ? ': ' : '：'}${list(twSights(n))}${en() ? '.' : '。'}`;

function make(t, L, lv) {
  if (t === 'mapName') {
    const c = pick(pool(L, (x) => ON_MAP.has(+x.num))); if (!c) return null;
    return { key: t + c.num, ask: ask(t), show: { map: 'world', lit: +c.num, region: contOf(c), whole: L.world }, opts: names(c, L), ans: nm(c), info: infoOf(c) };
  }
  if (t === 'mapClick') {
    const c = pick(pool(L, (x) => BIG.has(+x.num) && (lv >= 3 || x.tier <= 2))); if (!c) return null;
    return { key: t + c.num, ask: ask(t, nm(c)), show: { map: 'world', click: true, region: contOf(c), whole: L.world }, ans: +c.num, ansName: nm(c), info: infoOf(c) };
  }
  if (t === 'flagName') {
    const c = pick(pool(L));
    return { key: t + c.num, ask: ask(t), show: { flag: c.a2 }, opts: names(c, L), ans: nm(c), info: infoOf(c) };
  }
  if (t === 'flagPick') {
    const c = pick(pool(L)), o = shuffle([c, ...others(c, L, nm, L.opts - 1)]);
    return { key: t + c.num, ask: ask(t, nm(c)), flags: o.map((x) => ({ a2: x.a2, name: nm(x) })), ans: nm(c), info: infoOf(c) };
  }
  if (t === 'capOf') {
    const c = pick(pool(L, (x) => cp(x)));
    const o = shuffle([cp(c), ...others(c, L, cp, L.opts - 1).map(cp)]);
    return { key: t + c.num, ask: ask(t, nm(c)), show: { flag: c.a2, small: true }, opts: o, ans: cp(c), info: capInfo(c) };
  }
  if (t === 'capRev') {
    const c = pick(pool(L, (x) => cp(x) && !cp(x).includes(nm(x)) && !COUNTRIES.some((y) => y !== x && cp(y) === cp(x)))); if (!c) return null;
    return { key: t + c.num, ask: ask(t, cp(c)), opts: names(c, L), ans: nm(c), info: capInfo(c) };
  }
  if (t === 'contOf') {
    const c = pick(pool(L, (x) => x.cont && ON_MAP.has(+x.num)));
    const all = Object.keys(CONT).map(ct), right = ct(c.cont);
    return { key: t + c.num, ask: ask(t, nm(c)), show: { map: 'world', lit: +c.num, whole: true }, opts: shuffle([right, ...shuffle(all.filter((x) => x !== right)).slice(0, L.opts - 1)]), ans: right, info: infoOf(c) };
  }
  if (t === 'twName') {
    const [n] = pick(TW);
    return { key: t + n, ask: ask(t), show: { map: 'tw', lit: n }, opts: twNames(n, L), ans: twN(n), info: twInfo(n) };
  }
  if (t === 'twClick') {
    const [n] = pick(TW);
    return { key: t + n, ask: ask(t, twN(n)), show: { map: 'tw', click: true }, ans: n, ansName: twN(n), info: twInfo(n) };
  }
  if (t === 'twFact') {
    const [n] = pick(TW), i = rnd(twSights(n).length), sight = twSights(n)[i];
    return { key: t + n + i, ask: ask(t, sight), opts: twNames(n, L), ans: twN(n), info: twInfo(n), after: { map: 'tw', lit: n } };
  }
  if (t === 'twTrivia' || t === 'fact') {
    const ids = FACTS.map((f, i) => i).filter((i) => FACTS[i][5] <= lv + 1 + (lv === 3 ? 9 : 0) && (t === 'fact' || /台灣|縣/.test(FACTS[i][0])));
    if (!ids.length) return null;
    const i = pick(ids), f = en() ? FACTS_EN[i] : FACTS[i], wrong = f.slice(2, 5);
    return { key: 'fact' + i, ask: f[0], opts: shuffle([f[1], ...wrong.slice(0, Math.min(L.opts - 1, wrong.length))]), ans: f[1], info: en() ? `The answer is ${f[1]}.` : `答案是「${f[1]}」。` };
  }
  return null;
}
// counties next to each other make the harder wrong choices
const TW_NEAR = { 台北市: '新北市基隆市桃園市', 新北市: '台北市基隆市宜蘭縣桃園市', 基隆市: '新北市台北市宜蘭縣', 桃園市: '新北市新竹縣台北市', 新竹市: '新竹縣苗栗縣桃園市', 新竹縣: '新竹市苗栗縣桃園市',
  苗栗縣: '新竹縣台中市新竹市', 台中市: '苗栗縣彰化縣南投縣', 彰化縣: '台中市南投縣雲林縣', 南投縣: '台中市彰化縣雲林縣嘉義縣花蓮縣', 雲林縣: '彰化縣嘉義縣南投縣', 嘉義市: '嘉義縣雲林縣台南市',
  嘉義縣: '嘉義市雲林縣台南市南投縣', 台南市: '嘉義縣高雄市嘉義市', 高雄市: '台南市屏東縣台東縣', 屏東縣: '高雄市台東縣', 宜蘭縣: '新北市花蓮縣基隆市', 花蓮縣: '宜蘭縣台東縣南投縣',
  台東縣: '花蓮縣屏東縣高雄市', 澎湖縣: '金門縣連江縣台南市', 金門縣: '連江縣澎湖縣', 連江縣: '金門縣澎湖縣' };
function twNames(n, L) {
  const near = (TW_NEAR[n] || '').match(/.{2}[市縣]/g) || [], all = TW.map((t) => t[0]).filter((x) => x !== n);
  const wrong = [...new Set([...(L.near ? shuffle(near) : []), ...shuffle(all)])].filter((x) => x !== n).slice(0, L.opts - 1);
  return shuffle([n, ...wrong]).map(twN);
}
