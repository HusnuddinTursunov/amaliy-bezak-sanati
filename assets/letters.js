/* Yozuv, şrift, plakat va piktogramma vidjetlari */
"use strict";
(function () {
const FONTS = [["Georgia, 'Times New Roman', serif", "Antikva (serifli)"], ["'Segoe UI', Arial, sans-serif", "Grotesk (serifsiz)"], ["Impact, 'Arial Black', sans-serif", "Qalin plakat şrifti"],
  ["'Courier New', monospace", "Teng kenglikli"], ["'Brush Script MT', 'Segoe Script', cursive", "Yozma (kursiv)"], ["'Trebuchet MS', Verdana, sans-serif", "Gumanistik"]];
NQ.FONTS = FONTS;

/* ---------- Kvadrat kufiy uslubi ---------- */
NQ.W.kufiy = function (el, cfg) {
  el.innerHTML = `<div class="split"><div><canvas class="art" width="900" height="900"></canvas></div><div class="card">
   <div class="ctrl two"><label>Matn</label><input type="text" class="tx" value="${cfg.text || "NAQSH"}"></div>
   <div class="ctrl two"><label>Joylaşuv</label><select class="md"><option value="line">Bir satr (lenta)</option><option value="frame">Kvadrat ramka (4 tomon)</option><option value="spiral">Markazga buraluvçi</option></select></div>
   <div class="ctrl"><label>Katak ölçami</label><input type="range" class="cs" min="8" max="40" value="22"><output></output></div>
   <div class="ctrl two"><label>Ranglar</label><select class="pl"><option value="0">Ğişt + firuza</option><option value="1">Lojuvard + oltin</option><option value="2">Ganç + jigarrang</option></select></div>
   <label class="row"><input type="checkbox" class="gr" checked> Katak törini körsatiş</label>
   <div class="row mt"><button class="btn gold" data-a="anim">▶ Terib çiqiş</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   <div class="note mt">${cfg.note || "Kvadrat kufiy — harflar katak (ğişt) törida faqat gorizontal va vertikal çiziqlar bilan quriladi; me'moriy obidalar devorlarida keng uçraydi."}</div></div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"); const P = [["#c98a5a", "#1fa3a3", "#f3e6d2"], ["#1f3f8f", "#d4a72c", "#0f2347"], ["#efe3c6", "#6b3e26", "#fbf6ea"]];
  const bits = (txt, h) => { const c = document.createElement("canvas"), x = c.getContext("2d"); x.font = `bold ${h}px Arial, sans-serif`; const w = Math.ceil(x.measureText(txt).width) + 2; c.width = w; c.height = h + 2;
    x.font = `bold ${h}px Arial, sans-serif`; x.textBaseline = "top"; x.fillStyle = "#000"; x.fillText(txt, 1, 1); const d = x.getImageData(0, 0, w, h + 2).data, out = [];
    for (let j = 0; j < h + 2; j++) { const r = []; for (let i = 0; i < w; i++) r.push(d[(j * w + i) * 4 + 3] > 110 ? 1 : 0); out.push(r); } return out; };
  function draw(prog) { prog = prog == null ? 1 : prog; const txt = (NQ.$(".tx", el).value || " ").toUpperCase(), cs = +NQ.$(".cs", el).value, pal = P[+NQ.$(".pl", el).value], md = NQ.$(".md", el).value;
    NQ.$(".cs", el).nextElementSibling.textContent = cs; ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, 900, 900);
    const n = Math.floor(900 / cs), grid = Array.from({ length: n }, () => Array(n).fill(0));
    const put = (b, ox, oy, rot) => { b.forEach((r, j) => r.forEach((v, i) => { if (!v) return; let x = i, y = j; const H = b.length, W = r.length;
      if (rot === 1) { x = H - 1 - j; y = i; } if (rot === 2) { x = W - 1 - i; y = H - 1 - j; } if (rot === 3) { x = j; y = W - 1 - i; }
      const X = ox + x, Y = oy + y; if (X >= 0 && Y >= 0 && X < n && Y < n) grid[Y][X] = 1; })); };
    if (md === "line") { const b = bits(txt, 9); const ox = Math.max(0, Math.floor((n - b[0].length) / 2)); put(b, ox, Math.floor(n / 2) - 5, 0); }
    else if (md === "frame") { const b = bits(txt, 7); const L = b[0].length, off = 1; for (let k = 0; k < 4; k++) { const ox = k === 0 ? Math.floor((n - L) / 2) : k === 1 ? n - 1 - off - 8 : k === 2 ? Math.floor((n - L) / 2) : off, oy = k === 0 ? off : k === 1 ? Math.floor((n - L) / 2) : k === 2 ? n - 1 - off - 8 : Math.floor((n - L) / 2); put(b, ox, oy, k); } }
    else { const b = bits(txt, 6); let s = 2; for (let k = 0; k < 4 && s < n / 2 - 4; k++) { put(b, s, s, 0); put(b, n - s - 8, s, 1); put(b, s, n - s - 8, 2); put(b, s, s + 9, 3); s += 9; } }
    let cnt = 0; const total = grid.flat().filter(Boolean).length, lim = Math.round(total * prog);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { if (grid[j][i] && cnt++ < lim) { ctx.fillStyle = pal[1]; ctx.fillRect(i * cs + 1, j * cs + 1, cs - 2, cs - 2); } else { ctx.fillStyle = pal[0]; ctx.fillRect(i * cs + 1, j * cs + 1, cs - 2, cs - 2); } }
    if (NQ.$(".gr", el).checked) { ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.lineWidth = 1; for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, n * cs); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(n * cs, i * cs); ctx.stroke(); } } }
  NQ.$$("input,select", el).forEach(i => i.addEventListener("input", () => draw()));
  NQ.$("[data-a=anim]", el).onclick = () => NQ.animate(3000, p => draw(p)); NQ.$("[data-a=png]", el).onclick = () => NQ.download(cv.toDataURL("image/png"), "kufiy.png");
  draw(); el._show = () => draw();
};

/* ---------- Plakat konstruktori ---------- */
NQ.W.poster = function (el, cfg) {
  const o = Object.assign({ title: "NAQQOŞLIK — MILLIY MEROS", sub: "Ustoz-şogird maktabi · 2026", font: 2, lay: "center", bg: "#1f3f8f", fg: "#f6f0e1", ac: "#d4a72c", border: true, orn: "gul", grid: false }, cfg.state || {});
  el.innerHTML = `<div class="split"><div><canvas class="art" width="900" height="1200"></canvas></div><div class="card">
   <div class="ctrl two"><label>Sarlavha</label><input type="text" data-k="title"></div><div class="ctrl two"><label>Qöşimça matn</label><input type="text" data-k="sub"></div>
   <div class="ctrl two"><label>Şrift</label><select data-k="font">${FONTS.map((f, i) => `<option value="${i}">${f[1]}</option>`).join("")}</select></div>
   <div class="ctrl two"><label>Kompozitsiya</label><select data-k="lay"><option value="center">Simmetrik (markaziy)</option><option value="left">Assimetrik (çap tomonda)</option><option value="diag">Dinamik (diagonal)</option></select></div>
   <div class="ctrl two"><label>Fon</label><input type="color" data-k="bg"></div><div class="ctrl two"><label>Matn rangi</label><input type="color" data-k="fg"></div><div class="ctrl two"><label>Urğu rangi</label><input type="color" data-k="ac"></div>
   <div class="ctrl two"><label>Bezak unsuri</label><select data-k="orn">${Object.keys(NQ.art.EL).map(k => `<option value="${k}">${NQ.art.EL[k].name}</option>`).join("")}</select></div>
   <label class="row"><input type="checkbox" data-k="border"> Naqşli hoşiya</label><label class="row"><input type="checkbox" data-k="grid"> Kompozitsion tör (modul)</label>
   <div class="row mt"><button class="btn gold" data-a="anim">▶ Quriliş</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>${cfg.note ? `<div class="note mt">${cfg.note}</div>` : ""}</div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"), W = 900, H = 1200;
  function wrap(t, max, size, font) { ctx.font = `${size}px ${font}`; const w = t.split(" "), lines = []; let l = ""; w.forEach(x => { const tt = l ? l + " " + x : x; if (ctx.measureText(tt).width > max && l) { lines.push(l); l = x; } else l = tt; }); if (l) lines.push(l); return lines; }
  function draw(p) { p = p == null ? 1 : p; const f = FONTS[+o.font][0], P = { leaf: o.fg, flower: o.ac, center: o.fg, frame: o.ac, stem: o.ac, band: o.fg, leafLine: o.bg, outline: o.bg, poly: [o.bg, o.bg], star: [o.fg, o.ac], bg: o.bg };
    ctx.fillStyle = o.bg; ctx.fillRect(0, 0, W, H);
    if (o.grid) { ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(i * W / 6, 0); ctx.lineTo(i * W / 6, H); ctx.stroke(); } for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, i * H / 8); ctx.lineTo(W, i * H / 8); ctx.stroke(); } }
    if (o.border && p > .1) { ctx.globalAlpha = Math.min(1, (p - .1) * 3); ctx.strokeStyle = o.ac; ctx.lineWidth = 6; ctx.strokeRect(30, 30, W - 60, H - 60); ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
      const k = 9; for (let i = 0; i < k; i++) { const t = 50 + (i + .5) * (W - 100) / k; NQ.art.drawElement(ctx, o.orn, t, 50, 34, Math.PI / 2, P); NQ.art.drawElement(ctx, o.orn, t, H - 50, 34, -Math.PI / 2, P); }
      for (let i = 0; i < 12; i++) { const t = 50 + (i + .5) * (H - 100) / 12; NQ.art.drawElement(ctx, o.orn, 50, t, 34, 0, P); NQ.art.drawElement(ctx, o.orn, W - 50, t, 34, Math.PI, P); } ctx.globalAlpha = 1; }
    const big = o.lay === "diag" ? [W * .68, H * .3] : o.lay === "left" ? [W * .7, H * .32] : [W / 2, H * .34];
    if (p > .3) { ctx.save(); ctx.globalAlpha = Math.min(1, (p - .3) * 3); NQ.art.rosette(ctx, big[0], big[1], 210 * Math.min(1, (p - .3) * 2), 12, 0, P, 1); NQ.art.drawElement(ctx, o.orn, big[0], big[1], 160, 0, P); ctx.restore(); }
    if (p > .55) { ctx.save(); ctx.globalAlpha = Math.min(1, (p - .55) * 3); ctx.fillStyle = o.fg; const align = o.lay === "center" ? "center" : "left", x = o.lay === "center" ? W / 2 : 120;
      if (o.lay === "diag") { ctx.translate(W / 2, H * .7); ctx.rotate(-.18); ctx.translate(-W / 2, -H * .7); }
      ctx.textAlign = align; ctx.textBaseline = "alphabetic"; let size = 96; let lines = wrap(o.title, W - 240, size, f); while (lines.length > 3 && size > 40) { size -= 8; lines = wrap(o.title, W - 240, size, f); }
      ctx.font = `${size}px ${f}`; lines.forEach((l, i) => ctx.fillText(l, x, H * .66 + i * size * 1.08));
      ctx.fillStyle = o.ac; ctx.fillRect(o.lay === "center" ? W / 2 - 130 : x, H * .66 + lines.length * size * 1.08 - size * .55, 260, 8);
      ctx.fillStyle = o.fg; ctx.font = `${Math.round(size * .36)}px ${f}`; ctx.fillText(o.sub, x, H * .66 + lines.length * size * 1.08 + size * .1); ctx.restore(); } }
  NQ.$$("[data-k]", el).forEach(i => { const k = i.dataset.k; if (i.type === "checkbox") { i.checked = !!o[k]; i.onchange = () => { o[k] = i.checked; draw(); }; } else { i.value = o[k]; i.addEventListener("input", () => { o[k] = i.value; draw(); }); } });
  NQ.$("[data-a=anim]", el).onclick = () => NQ.animate(2600, p => draw(p)); NQ.$("[data-a=png]", el).onclick = () => NQ.download(cv.toDataURL("image/png"), "plakat.png");
  draw(); el._show = () => draw();
  NQ.sources.poster = sz => { const c = document.createElement("canvas"); c.width = c.height = sz || 1024; const x = c.getContext("2d"); x.fillStyle = o.bg; x.fillRect(0, 0, c.width, c.height); const k = c.height / H; x.drawImage(cv, (c.width - W * k) / 2, 0, W * k, c.height); return Promise.resolve(c); };
};

/* ---------- Şrift anatomiyasi ---------- */
NQ.W.anatomy = function (el, cfg) {
  el.innerHTML = `<div class="split"><div><canvas class="art" width="1000" height="600"></canvas></div><div class="card">
   <div class="ctrl two"><label>Matn</label><input type="text" class="tx" value="${cfg.text || "Naqş Ag"}"></div>
   <div class="ctrl two"><label>Şrift</label><select class="fn">${FONTS.map((f, i) => `<option value="${i}">${f[1]}</option>`).join("")}</select></div>
   <label class="row"><input type="checkbox" class="ln" checked> Yordamçi çiziqlar</label><label class="row"><input type="checkbox" class="bx"> Harf ölçamlari (kegl)</label>
   <div class="note mt">${cfg.note || ""}</div></div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d");
  function draw() { const f = FONTS[+NQ.$(".fn", el).value][0], t = NQ.$(".tx", el).value || "Ag", size = 230; ctx.fillStyle = "#fffdf7"; ctx.fillRect(0, 0, 1000, 600);
    ctx.font = `${size}px ${f}`; ctx.textBaseline = "alphabetic"; const base = 400, x0 = 80; const m = ctx.measureText(t);
    const mx = ctx.measureText("x"), mH = ctx.measureText("H"), mh = ctx.measureText("h"), mp = ctx.measureText("p");
    const xh = mx.actualBoundingBoxAscent, cap = mH.actualBoundingBoxAscent, asc = Math.max(mh.actualBoundingBoxAscent, cap), desc = mp.actualBoundingBoxDescent;
    if (NQ.$(".ln", el).checked) { const L = (y, c, lab) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash([10, 6]); ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(970, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = c; ctx.font = "bold 20px Segoe UI, Arial"; ctx.fillText(lab, 760, y - 8); ctx.font = `${size}px ${f}`; };
      L(base, "#a8432a", "asos çiziği"); L(base - xh, "#1f8a8a", "kiçik harf balandligi (x)"); L(base - cap, "#123a6b", "boş harf balandligi"); L(base - asc - 2, "#7a3b8f", "yuqori çiqiq"); L(base + desc, "#b07a12", "pastki çiqiq"); }
    ctx.fillStyle = "#1d2433"; ctx.fillText(t, x0, base);
    if (NQ.$(".bx", el).checked) { ctx.strokeStyle = "rgba(201,162,39,.8)"; ctx.lineWidth = 2; ctx.strokeRect(x0, base - m.actualBoundingBoxAscent, m.width, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent); } }
  NQ.$$("input,select", el).forEach(i => i.addEventListener("input", draw)); draw();
};

/* ---------- Piktogramma muharriri ---------- */
NQ.W.pikto = function (el, cfg) {
  const N = 16; const presets = cfg.presets || [];
  el.innerHTML = `<div class="split"><div><canvas class="art" width="800" height="800"></canvas></div><div class="card">
   <h3>Namunalar</h3><div class="tiles pr"></div>
   <h3 class="mt">Muharrir</h3><div class="row"><label>Belgi rangi <input type="color" class="c1" value="#ffffff"></label><label>Fon <input type="color" class="c2" value="#2e7d4f"></label>
   <select class="sh" style="width:auto"><option value="sq">Kvadrat</option><option value="ci">Doira</option><option value="tr">Uçburçak</option></select></div>
   <div class="row mt"><button class="btn red" data-a="clr">✕ Tozalaş</button><button class="btn ghost" data-a="inv">◐ Teskari</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   <div class="note mt">${cfg.note || "Kataklarni bosib, öz belgingizni yarating."}</div></div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"); let g = Array.from({ length: N }, () => Array(N).fill(0));
  const load = s => { g = s.map(r => r.padEnd(N, ".").split("").map(c => c === "#" ? 1 : 0)); draw(); };
  function draw() { const c1 = NQ.$(".c1", el).value, c2 = NQ.$(".c2", el).value, sh = NQ.$(".sh", el).value; ctx.fillStyle = "#fffdf7"; ctx.fillRect(0, 0, 800, 800);
    ctx.save(); ctx.beginPath(); if (sh === "sq") ctx.roundRect ? ctx.roundRect(40, 40, 720, 720, 40) : ctx.rect(40, 40, 720, 720); else if (sh === "ci") ctx.arc(400, 400, 370, 0, Math.PI * 2); else { ctx.moveTo(400, 30); ctx.lineTo(780, 740); ctx.lineTo(20, 740); ctx.closePath(); }
    ctx.fillStyle = c2; ctx.fill(); ctx.restore();
    const cs = 520 / N, ox = 140, oy = sh === "tr" ? 230 : 140, sc = sh === "tr" ? .75 : 1;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = ox + (i * cs) * sc + (sh === "tr" ? 65 : 0), y = oy + (j * cs) * sc, s = cs * sc;
      if (g[j][i]) { ctx.fillStyle = c1; ctx.fillRect(x, y, s + .5, s + .5); } else { ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.strokeRect(x, y, s, s); } }
    cv._geom = { cs: cs * sc, ox: ox + (sh === "tr" ? 65 : 0), oy }; }
  cv.addEventListener("pointerdown", e => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 800 / r.width, y = (e.clientY - r.top) * 800 / r.height, G = cv._geom;
    const i = Math.floor((x - G.ox) / G.cs), j = Math.floor((y - G.oy) / G.cs); if (i >= 0 && j >= 0 && i < N && j < N) { g[j][i] ^= 1; draw(); } });
  const pr = NQ.$(".pr", el); pr.innerHTML = presets.map((p, i) => `<div class="tile" data-i="${i}"><b>${p.t}</b></div>`).join("");
  NQ.$$(".tile", pr).forEach(t => t.onclick = () => { const p = presets[+t.dataset.i]; NQ.$(".c2", el).value = p.bg || "#2e7d4f"; NQ.$(".sh", el).value = p.sh || "sq"; load(p.g); NQ.$$(".tile", pr).forEach(x => x.classList.toggle("sel", x === t)); });
  NQ.$$("input,select", el).forEach(i => i.addEventListener("input", draw));
  NQ.$("[data-a=clr]", el).onclick = () => { g = g.map(r => r.map(() => 0)); draw(); }; NQ.$("[data-a=inv]", el).onclick = () => { g = g.map(r => r.map(v => v ^ 1)); draw(); };
  NQ.$("[data-a=png]", el).onclick = () => NQ.download(cv.toDataURL("image/png"), "piktogramma.png");
  if (presets[0]) NQ.$(".tile", pr).click(); else draw();
};
})();
