const D = await import('../js/data.js'), E = await import('../js/data_en.js');
let bad = 0; const no = (m) => { console.log('BAD', m); bad++; };
for (const c of D.COUNTRIES) { const e = E.EN.get(c.a2); if (!e) { no('no english ' + c.a2); continue; } if ((e.cap == null) !== (c.cap == null)) no('capital mismatch ' + c.a2); }
if (E.EN.size !== D.COUNTRIES.length) no('sizes ' + E.EN.size + ' ' + D.COUNTRIES.length);
if (E.FACTS_EN.length !== D.FACTS.length) no('facts ' + E.FACTS_EN.length + ' ' + D.FACTS.length);
E.FACTS_EN.forEach((f, i) => { if (f.length !== 5) no('fact len ' + i); if (new Set(f.slice(1)).size !== 4) no('fact dup ' + i); });
for (const [n, s] of D.TW) { const e = E.TW_EN[n]; if (!e) no('tw ' + n); else if (e[1].length !== s.split('、').length) no('tw sights ' + n); }
const names = [...E.EN.values()].map((x) => x.name); if (new Set(names).size !== names.length) no('dup names');
console.log(bad ? 'FAILED' : 'all ok');
