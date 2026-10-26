// 地理大挑戰: the screens. Pick a subject and a level, answer ten (or twenty) questions against the clock.
import { LEVELS, TOPICS, makeQuiz } from './quiz.js';
import { loadMaps, worldSVG, twSVG } from './map.js';
import { sfx, setMute, muted } from './sfx.js';

const $ = (s, el = document) => el.querySelector(s), app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } } };
const cfg = Object.assign({ topic: 'mix', lv: 0, n: 10 }, ls.get('geoquiz.cfg', {}));
const best = ls.get('geoquiz.best', {});
let G = null, timer = 0;

// ---------------------------------------------------------------- home
function home() {
  clearInterval(timer); G = null;
  app.innerHTML = `<div class="home"><div class="title"><div class="globe">🌍</div><h1>地理大挑戰</h1><p>世界地圖・國旗・首都・台灣縣市</p></div>
    <section class="card"><h2>考什麼</h2><div class="topics">${TOPICS.map((t) => `<button class="topic ${cfg.topic === t.id ? 'on' : ''}" data-topic="${t.id}"><span>${t.icon}</span><b>${t.name}</b><small>${t.note}</small></button>`).join('')}</div></section>
    <section class="card"><h2>難度</h2><div class="levels">${LEVELS.map((L, i) => `<button class="lv lv${i} ${cfg.lv === i ? 'on' : ''}" data-lv="${i}"><b>${L.name}</b><small>${L.note}</small><i>最佳 ${best[cfg.topic + i] || 0}</i></button>`).join('')}</div>
    <div class="row">題數 ${[10, 20, 30].map((n) => `<button class="pill ${cfg.n === n ? 'on' : ''}" data-n="${n}">${n} 題</button>`).join('')}</div></section>
    <button class="go" data-act="start">開始挑戰 ▶</button>
    <p class="foot">地圖資料：Natural Earth（world-atlas）、內政部（taiwan-atlas）；國旗：flag-icons。</p></div>`;
}

// ---------------------------------------------------------------- a round
function start() {
  ls.set('geoquiz.cfg', cfg);
  const qs = makeQuiz(cfg.topic, cfg.lv, cfg.n);
  G = { qs, i: -1, score: 0, right: 0, streak: 0, bestStreak: 0, wrong: [], topic: cfg.topic, lv: cfg.lv };
  next();
}
function next() {
  G.i++;
  if (G.i >= G.qs.length) return results();
  const q = G.qs[G.i], L = LEVELS[G.lv];
  G.t0 = Date.now(); G.done = false;
  app.innerHTML = `<div class="play"><header class="bar"><button class="x" data-act="home">✕</button><div class="prog"><i style="width:${G.i / G.qs.length * 100}%"></i></div>
      <span class="count">${G.i + 1}/${G.qs.length}</span><span class="score">⭐ ${G.score}</span><button class="x" data-act="mute">${muted() ? '🔇' : '🔊'}</button></header>
    <div class="timer"><i></i></div>
    <div class="q card"><div class="tag">${L.name}${G.streak >= 2 ? ` <span class="streak">🔥 連對 ${G.streak}</span>` : ''}</div><h2>${esc(q.ask)}</h2><div class="show">${showOf(q)}</div>
      <div class="opts n${q.opts ? q.opts.length : 0}">${q.opts ? q.opts.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('') : ''}</div>
      ${q.flags ? `<div class="flags n${q.flags.length}">${q.flags.map((f) => `<button class="fl" data-o="${esc(f.name)}"><img src="flags/${f.a2}.svg" alt=""></button>`).join('')}</div>` : ''}
      <div class="feedback"></div></div></div>`;
  app.querySelectorAll('.opt, .fl').forEach((b) => b.onclick = () => answer(b.dataset.o, b));
  app.querySelectorAll('.clickable .c').forEach((p) => {
    p.onclick = () => { const id = p.dataset.id; if (id) answer(q.show.map === 'tw' ? id : +id, p); };
  });
  clearInterval(timer);
  timer = setInterval(() => {
    const left = q.time * 1000 - (Date.now() - G.t0), bar = $('.timer i');
    if (bar) { bar.style.width = Math.max(0, left / (q.time * 1000)) * 100 + '%'; bar.parentNode.classList.toggle('low', left < 4000); }
    if (left <= 0 && !G.done) answer(null);
  }, 100);
}
function showOf(q) {
  const s = q.show; if (!s) return '';
  if (s.flag) return `<img class="flag ${s.small ? 'small' : ''}" src="flags/${s.flag}.svg" alt="">`;
  if (s.map === 'world') return worldSVG(s);
  if (s.map === 'tw') return twSVG(s);
  return '';
}
function answer(pick, el) {
  if (G.done) return;
  G.done = true; clearInterval(timer);
  const q = G.qs[G.i], L = LEVELS[G.lv], ok = pick != null && pick === q.ans, used = (Date.now() - G.t0) / 1000;
  let gain = 0;
  if (ok) { G.right++; G.streak++; G.bestStreak = Math.max(G.bestStreak, G.streak); gain = Math.round((100 + 100 * Math.max(0, 1 - used / q.time) + Math.min(5, G.streak - 1) * 20) * L.mult); G.score += gain; sfx('ok'); }
  else { G.streak = 0; G.wrong.push(q); sfx('bad'); }
  // show what was right
  app.querySelectorAll('.opt, .fl').forEach((b) => { b.disabled = true; if (b.dataset.o === q.ans) b.classList.add('right'); else if (b === el) b.classList.add('wrong'); });
  if (q.show?.click) {
    const svg = $('.map'), right = svg.querySelector(`[data-id="${q.ans}"]`);
    right?.classList.add('right'); if (el && !ok) el.classList.add('wrong'); svg.classList.remove('clickable');
  }
  if (q.after) $('.show').innerHTML = q.after.map === 'tw' ? twSVG(q.after) : worldSVG(q.after);
  if (q.flags) app.querySelectorAll('.fl').forEach((b) => { b.insertAdjacentHTML('beforeend', `<small>${esc(b.dataset.o)}</small>`); });
  $('.feedback').innerHTML = `<div class="${ok ? 'good' : 'bad'}">${ok ? `答對了！ +${gain}` : pick == null ? '時間到！' : '答錯了'}${!ok ? `　正確答案：<b>${esc(q.ansName || q.ans)}</b>` : ''}</div><p>${esc(q.info || '')}</p><button class="go small" data-act="next">${G.i + 1 < G.qs.length ? '下一題 ▶' : '看成績'}</button>`;
  $('.score').textContent = '⭐ ' + G.score;
}

// ---------------------------------------------------------------- the end of a round
function results() {
  const key = G.topic + G.lv, prev = best[key] || 0, isBest = G.score > prev;
  if (isBest) { best[key] = G.score; ls.set('geoquiz.best', best); }
  const pct = G.right / G.qs.length, stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
  sfx(stars >= 2 ? 'win' : 'end');
  const T = TOPICS.find((t) => t.id === G.topic);
  app.innerHTML = `<div class="home"><section class="card result"><div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <h1>${G.score} 分</h1><p>${T.icon} ${T.name}・${LEVELS[G.lv].name}　答對 ${G.right} / ${G.qs.length} 題・最多連對 ${G.bestStreak} 題</p>
    ${isBest ? '<p class="nb">🎉 新紀錄！</p>' : `<p class="hint">最佳紀錄 ${prev} 分</p>`}
    ${G.wrong.length ? `<h2>答錯的題目</h2><ul class="review">${G.wrong.map((q) => `<li><b>${esc(q.ask)}</b><span>${esc(q.ansName || q.ans)}</span><small>${esc(q.info || '')}</small></li>`).join('')}</ul>` : '<p class="nb">全部答對，太厲害了！</p>'}
    <button class="go" data-act="start">再玩一次</button><button class="go ghost" data-act="home">換題目 / 難度</button></section></div>`;
}

// ---------------------------------------------------------------- clicks
app.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.topic) { cfg.topic = b.dataset.topic; ls.set('geoquiz.cfg', cfg); home(); }
  else if (b.dataset.lv) { cfg.lv = +b.dataset.lv; ls.set('geoquiz.cfg', cfg); home(); }
  else if (b.dataset.n) { cfg.n = +b.dataset.n; ls.set('geoquiz.cfg', cfg); home(); }
  else if (b.dataset.act === 'start') start();
  else if (b.dataset.act === 'next') next();
  else if (b.dataset.act === 'home') home();
  else if (b.dataset.act === 'mute') { setMute(!muted()); b.textContent = muted() ? '🔇' : '🔊'; }
});
document.addEventListener('keydown', (e) => {
  if (!G) return;
  if (G.done && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); return next(); }
  const k = '123456'.indexOf(e.key); if (k < 0 || G.done) return;
  const bs = app.querySelectorAll('.opt, .fl'); bs[k]?.click();
});

app.innerHTML = '<div class="loading">🌍 載入地圖中…</div>';
loadMaps().then(home, (e) => { app.innerHTML = `<div class="loading">地圖載入失敗：${esc(e.message)}</div>`; });
window.GQ = { get G() { return G; }, makeQuiz, cfg };
