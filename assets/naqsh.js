/* Naqş kutubxonasi: girih, islimiy, naqş unsurlari, kompozitsiya, böyaş, mo'yqalam, rang */
"use strict";
(function () {
const TAU = Math.PI * 2;
const A = NQ.art = {};
NQ.sources = NQ.sources || {};

/* ================= RANG USLUBLARI ================= */
const PAL = A.PAL = {
  oqsaroy: { name: "Şahrisabz — Oqsaroy", bg: "#16366e", poly: ["#21509a", "#1a4386"], star: ["#f3e7c8", "#e2a93b"], band: "#fff7e3", outline: "#0b1d42", stem: "#e2a93b", leaf: "#f3e7c8", leafLine: "#0b1d42", flower: "#2a948b", center: "#e2a93b", frame: "#21509a" },
  buxoro: { name: "Buxoro — lojuvard", bg: "#0f2d5c", poly: ["#1d4e89", "#173f73"], star: ["#f2e6c9", "#c9a227"], band: "#f7f1e3", outline: "#081a37", stem: "#c9a227", leaf: "#f2e6c9", leafLine: "#081a37", flower: "#b5452c", center: "#c9a227", frame: "#1d4e89" },
  samarqand: { name: "Samarqand — firuza", bg: "#0d6b70", poly: ["#138a90", "#0f7b80"], star: ["#f6efdf", "#e0a526"], band: "#fdf8ec", outline: "#06393c", stem: "#f6efdf", leaf: "#e0a526", leafLine: "#06393c", flower: "#1f3f8f", center: "#f6efdf", frame: "#138a90" },
  xiva: { name: "Xiva — zangori-yaşil", bg: "#e9f0ee", poly: ["#d5e4df", "#c4d9d2"], star: ["#1f6f8b", "#2e7d4f"], band: "#ffffff", outline: "#173d3a", stem: "#1f6f8b", leaf: "#2e7d4f", leafLine: "#173d3a", flower: "#1f6f8b", center: "#e0a526", frame: "#2e7d4f" },
  toshkent: { name: "Toşkent — yaşil-oltin", bg: "#24533f", poly: ["#2f6b52", "#295e48"], star: ["#f1e2b8", "#c08a2e"], band: "#fbf3dc", outline: "#11291f", stem: "#c08a2e", leaf: "#f1e2b8", leafLine: "#11291f", flower: "#9c3b2d", center: "#c08a2e", frame: "#2f6b52" },
  fargona: { name: "Farğona — qizil-oltin", bg: "#7a1f22", poly: ["#93292c", "#842427"], star: ["#f7e9c6", "#d9a52c"], band: "#fff4dc", outline: "#3a0d0f", stem: "#d9a52c", leaf: "#f7e9c6", leafLine: "#3a0d0f", flower: "#1f3f8f", center: "#d9a52c", frame: "#93292c" },
  ganch: { name: "Ganç — oq-qaymoq", bg: "#f3ead6", poly: ["#e8dcc0", "#ddcfae"], star: ["#fffaf0", "#cdb98e"], band: "#fffdf7", outline: "#7a6342", stem: "#8f7650", leaf: "#fffaf0", leafLine: "#7a6342", flower: "#e8dcc0", center: "#cdb98e", frame: "#e8dcc0" }
};
A.palette = k => PAL[k] || PAL.oqsaroy;

/* ================= GEOMETRIYA: GIRIH ================= */
function regPoly(cx, cy, R, n, rot) { const v = []; for (let k = 0; k < n; k++) { const a = rot + k * TAU / n; v.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); } return v; }
function poly(v) { let cx = 0, cy = 0; v.forEach(p => { cx += p[0]; cy += p[1]; }); return { v, n: v.length, c: [cx / v.length, cy / v.length] }; }
function tiling(type, s, W, H) {
  const out = [], pad = s * 3, inside = (x, y) => x > -pad && x < W + pad && y > -pad && y < H + pad;
  if (type === "4") { for (let i = -1; i * s < W + s; i++) for (let j = -1; j * s < H + s; j++) out.push(poly(regPoly(i * s + s / 2, j * s + s / 2, s / Math.SQRT2, 4, Math.PI / 4))); }
  else if (type === "6") { const dx = Math.sqrt(3) * s, dy = 1.5 * s; for (let j = -1; j * dy < H + 2 * s; j++) for (let i = -1; i * dx < W + 2 * s; i++) out.push(poly(regPoly(i * dx + (j & 1 ? dx / 2 : 0), j * dy, s, 6, Math.PI / 6))); }
  else if (type === "488") { const R8 = s / (2 * Math.sin(Math.PI / 8)), w = s * (1 + Math.SQRT2); for (let i = -1; i * w < W + w; i++) for (let j = -1; j * w < H + w; j++) { out.push(poly(regPoly(i * w, j * w, R8, 8, Math.PI / 8))); out.push(poly(regPoly((i + .5) * w, (j + .5) * w, s / Math.SQRT2, 4, 0))); } }
  else if (type === "31212") { const R12 = s / (2 * Math.sin(Math.PI / 12)), r = s / (2 * Math.tan(Math.PI / 12)), dt = 2 * r / Math.sqrt(3), R3 = s / Math.sqrt(3);
    for (let j = -2; j * Math.sqrt(3) * r < H + 4 * r; j++) for (let i = -2 - Math.ceil(j / 2); (i * 2 * r + j * r) < W + 4 * r; i++) { const x = i * 2 * r + j * r, y = j * Math.sqrt(3) * r; if (!inside(x, y)) continue;
      out.push(poly(regPoly(x, y, R12, 12, Math.PI / 12))); out.push(poly(regPoly(x + dt * Math.cos(Math.PI / 6), y + dt * Math.sin(Math.PI / 6), R3, 3, Math.PI / 2))); out.push(poly(regPoly(x, y + dt, R3, 3, Math.PI / 6))); } }
  return out;
}
function hankin(p, theta) {
  const v = p.v, n = v.length, C = p.c, M = [], F = [], B = [], ct = Math.cos(theta), st = Math.sin(theta);
  for (let i = 0; i < n; i++) { const a = v[i], b = v[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let ex = b[0] - a[0], ey = b[1] - a[1]; const L = Math.hypot(ex, ey); ex /= L; ey /= L;
    let nx = -ey, ny = ex; if (nx * (C[0] - m[0]) + ny * (C[1] - m[1]) < 0) { nx = -nx; ny = -ny; } M.push(m); F.push([ct * ex + st * nx, ct * ey + st * ny]); B.push([-ct * ex + st * nx, -ct * ey + st * ny]); }
  const pts = [];
  for (let i = 0; i < n; i++) { const j = (i + 1) % n, p1 = M[i], d1 = F[i], p2 = M[j], d2 = B[j], den = d1[0] * d2[1] - d1[1] * d2[0]; let P;
    if (Math.abs(den) < 1e-9) P = C; else { const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den; P = [p1[0] + t * d1[0], p1[1] + t * d1[1]]; } pts.push(M[i], P); }
  return pts;
}
const trace = (ctx, pts) => { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); };
const inr = p => { const a = p.v[0], b = p.v[1]; return Math.hypot((a[0] + b[0]) / 2 - p.c[0], (a[1] + b[1]) / 2 - p.c[1]); };
A.girihStars = (o, W, H) => { const ps = tiling(o.tiling, o.size, W, H), mx = Math.max(...ps.map(p => p.n)); return ps.map(p => ({ p, s: hankin(p, o.theta * Math.PI / 180), big: p.n === mx })); };

function rosette(ctx, x, y, r, k, rot, P, alpha) {
  if (r <= 1) return; ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= (alpha == null ? 1 : alpha); ctx.lineWidth = Math.max(.8, r * .05); ctx.strokeStyle = P.outline || P.leafLine;
  const pet = (q, col, off) => { for (let i = 0; i < k; i++) { ctx.save(); ctx.rotate(rot + (i + off) * TAU / k); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(q * .3, -q * .42, q * .85, -q * .32, q, 0); ctx.bezierCurveTo(q * .85, q * .32, q * .3, q * .42, 0, 0); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); ctx.restore(); } };
  pet(r, P.flower, 0); pet(r * .62, P.leaf, .5);
  ctx.beginPath(); ctx.arc(0, 0, r * .2, 0, TAU); ctx.fillStyle = P.center; ctx.fill(); ctx.stroke(); ctx.restore();
}
A.rosette = rosette;
A.drawGirih = function (ctx, W, H, o) {
  const P = o.pal, prog = o.progress == null ? 1 : o.progress, stars = A.girihStars(o, W, H);
  const cx = W / 2, cy = H / 2, maxD = Math.hypot(W / 2, H / 2) + o.size * 2; stars.forEach(s => s.d = Math.hypot(s.p.c[0] - cx, s.p.c[1] - cy) / maxD);
  if (o.bg !== false) { ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H); }
  const vis = s => Math.max(0, Math.min(1, (prog * 1.25 - s.d) / .25));
  if (o.fill !== false) { for (const s of stars) { const a = vis(s); if (a <= 0) continue; ctx.globalAlpha = a; ctx.beginPath(); trace(ctx, s.p.v); ctx.fillStyle = s.big ? P.poly[0] : P.poly[1]; ctx.fill(); ctx.beginPath(); trace(ctx, s.s); ctx.fillStyle = s.big ? P.star[0] : P.star[1]; ctx.fill(); } ctx.globalAlpha = 1; }
  ctx.lineJoin = "miter"; ctx.miterLimit = 6;
  const passes = o.band > 0 ? [[P.outline, o.band + 3.2], [P.band, o.band]] : [[P.outline, 1.4]];
  for (const [col, lw] of passes) for (const s of stars) { const a = vis(s); if (a <= 0) continue; ctx.globalAlpha = a; ctx.beginPath(); trace(ctx, s.s); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
  ctx.globalAlpha = 1;
  if (o.floral) for (const s of stars) { const a = Math.max(0, Math.min(1, (prog * 1.25 - s.d - .12) / .25)); if (a <= 0) continue; const r = inr(s.p);
    if (s.big) rosette(ctx, s.p.c[0], s.p.c[1], r * .4, s.p.n, 0, P, a); else if (s.p.n >= 4) rosette(ctx, s.p.c[0], s.p.c[1], r * .3, 4, Math.PI / 4, P, a);
    else { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(s.p.c[0], s.p.c[1], r * .28, 0, TAU); ctx.fillStyle = P.flower; ctx.fill(); ctx.restore(); } }
};

/* ================= ISLIMIY ================= */
function armPts(L, r0, turns) {
  const pts = [], R = L * .27, Cc = [r0 + L * .78, -L * .04], S = [Cc[0], Cc[1] + R], B0 = [r0, 0], Q = [r0 + L * .42, S[1]], n1 = 46;
  for (let i = 0; i <= n1; i++) { const t = i / n1, u = 1 - t; pts.push([u * u * B0[0] + 2 * u * t * Q[0] + t * t * S[0], u * u * B0[1] + 2 * u * t * Q[1] + t * t * S[1]]); }
  const n2 = Math.round(70 * turns), b = Math.log(7) / (turns * TAU);
  for (let i = 1; i <= n2; i++) { const ph = i / n2 * turns * TAU, r = R * Math.exp(-b * ph), a = Math.PI / 2 - ph; pts.push([Cc[0] + r * Math.cos(a), Cc[1] + r * Math.sin(a)]); }
  return { pts, n1 };
}
function leafShape(ctx, len, wid) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(len * .25, -wid * 1.1, len * .7, -wid * .9, len, -wid * .15); ctx.bezierCurveTo(len * .72, wid * .35, len * .35, wid * .55, 0, 0); ctx.closePath(); }
function drawArm(ctx, L, r0, o, P, prog, depth) {
  const { pts, n1 } = armPts(L, r0, o.turns), N = pts.length, shown = Math.floor(prog * (N - 1)); if (shown < 1) return;
  const w0 = Math.max(1.5, L * .035);
  for (const pass of [0, 1]) for (let i = 1; i <= shown; i++) { const w = w0 * (1 - .65 * i / N); ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineCap = "round"; ctx.lineWidth = pass ? w : w + 2.4; ctx.strokeStyle = pass ? P.stem : P.leafLine; ctx.stroke(); }
  const nl = o.leaves;
  for (let k = 0; k < nl; k++) { const idx = Math.round(6 + (k / Math.max(1, nl)) * (n1 + (N - n1) * .55 - 6)); if (idx >= N - 2) continue; const g = Math.max(0, Math.min(1, (shown - idx) / 10)); if (g <= 0) continue;
    const p = pts[idx], q = pts[idx + 1], ang = Math.atan2(q[1] - p[1], q[0] - p[0]), side = k % 2 ? 1 : -1, sz = L * .24 * (1 - .55 * idx / N) * g;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang + side * .95); if (side > 0) ctx.scale(1, -1); leafShape(ctx, sz, sz * .36); ctx.fillStyle = P.leaf; ctx.fill(); ctx.lineWidth = Math.max(1, L * .008); ctx.strokeStyle = P.leafLine; ctx.stroke(); ctx.restore(); }
  if (shown >= N - 1) { const p = pts[N - 1], q = pts[N - 2], ang = Math.atan2(p[1] - q[1], p[0] - q[0]), s = L * .075; ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(-s * .2, 0); ctx.bezierCurveTo(s * .3, -s, s * 1.3, -s * .4, s * 1.5, 0); ctx.bezierCurveTo(s * 1.3, s * .4, s * .3, s, -s * .2, 0); ctx.fillStyle = P.flower; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = P.leafLine; ctx.stroke(); ctx.restore(); }
  if (depth > 0) { const at = Math.round(n1 * .55), sp = Math.max(0, Math.min(1, (shown - at) / (N * .6))); if (sp > 0) { const p = pts[at], q = pts[at + 1], ang = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang - .5); ctx.scale(1, -1); drawArm(ctx, L * .42, 0, { turns: o.turns * .9, leaves: Math.max(0, Math.round(o.leaves / 3)) }, P, sp, depth - 1); ctx.restore(); } }
}
A.drawArm = drawArm;
A.islimiyMedallion = function (ctx, cx, cy, L, o, P, prog) {
  const r0 = L * .17, sym = o.sym; ctx.save(); ctx.translate(cx, cy);
  for (let s = 0; s < sym; s++) { ctx.save(); ctx.rotate(s * TAU / sym - Math.PI / 2);
    if (o.mirror) { ctx.save(); ctx.rotate(-Math.PI / sym * .5); drawArm(ctx, L, r0, o, P, prog, 1); ctx.restore(); ctx.save(); ctx.rotate(Math.PI / sym * .5); ctx.scale(1, -1); drawArm(ctx, L, r0, o, P, prog, 1); ctx.restore(); }
    else drawArm(ctx, L, r0, o, P, prog, 1); ctx.restore(); }
  const rs = Math.min(1, prog * 5); if (rs > 0) rosette(ctx, 0, 0, r0 * 1.15 * rs, sym * 2, 0, P, 1); ctx.restore();
};
A.drawIslimiy = function (ctx, W, H, o) {
  const P = o.pal, prog = o.progress == null ? 1 : o.progress;
  if (o.bg !== false) { ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H); }
  if (o.repeat) { const L = Math.min(W, H) * .2; [[0, 0], [W, 0], [0, H], [W, H], [W / 2, H / 2]].forEach(c => A.islimiyMedallion(ctx, c[0], c[1], L, o, P, prog));
    const o2 = Object.assign({}, o, { sym: 4, leaves: Math.max(0, o.leaves - 2) }); [[W / 2, 0], [W / 2, H], [0, H / 2], [W, H / 2]].forEach(c => A.islimiyMedallion(ctx, c[0], c[1], L * .55, o2, P, prog)); }
  else { const L = Math.min(W, H) * .33; A.islimiyMedallion(ctx, W / 2, H / 2, L, o, P, prog);
    if (prog >= 1) { ctx.save(); ctx.strokeStyle = P.stem; ctx.lineWidth = Math.max(2, W * .006); ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.min(W, H) * .47, 0, TAU); ctx.stroke(); ctx.restore(); } }
};

/* ================= GENERATOR HOLATI ================= */
A.genDefaults = { mode: "girih", pal: "oqsaroy", tiling: "488", size: 70, theta: 67.5, band: 6, sym: 4, turns: 1.5, leaves: 6, mirror: true, repeat: false, l1on: true, l2on: true, l1: 1, l2: .9, swap: false };
A.genState = Object.assign({}, A.genDefaults);
A.render = function (ctx, W, H, mode, opts) {
  const o = Object.assign({}, A.genState, opts || {}); o.pal = typeof o.pal === "string" ? A.palette(o.pal) : o.pal;
  const sc = W / 900, gO = Object.assign({}, o, { size: o.size * sc, band: o.band * sc });
  ctx.clearRect(0, 0, W, H);
  if (mode === "girih") A.drawGirih(ctx, W, H, gO);
  else if (mode === "gulli") A.drawGirih(ctx, W, H, Object.assign(gO, { floral: true }));
  else if (mode === "islimiy") A.drawIslimiy(ctx, W, H, o);
  else if (mode === "madohil") {
    ctx.fillStyle = o.pal.bg; ctx.fillRect(0, 0, W, H);
    const isl = () => { ctx.save(); ctx.globalAlpha = o.l1on ? o.l1 : 0; A.drawIslimiy(ctx, W, H, Object.assign({}, o, { repeat: true, bg: !o.swap })); ctx.restore(); };
    const gir = () => { ctx.save(); ctx.globalAlpha = o.l2on ? o.l2 : 0; A.drawGirih(ctx, W, H, Object.assign({}, gO, { fill: o.swap, bg: o.swap, pal: o.swap ? o.pal : Object.assign({}, o.pal, { band: o.pal.flower }) })); ctx.restore(); };
    if (!o.swap) { isl(); gir(); } else { gir(); isl(); }
  }
};
A.texture = function (mode, size, opts) {
  const c = document.createElement("canvas"); c.width = c.height = size || 1024; const o = Object.assign({}, opts || {});
  if (mode === "islimiy" && o.repeat == null) o.repeat = true;
  const st = Object.assign({}, A.genState, o);
  if (st.tiling === "4") o.size = 900 / Math.max(3, Math.round(900 / st.size));
  if (st.tiling === "488") { const k = Math.max(2, Math.round(900 / (st.size * (1 + Math.SQRT2)))); o.size = 900 / (k * (1 + Math.SQRT2)); }
  A.render(c.getContext("2d"), c.width, c.height, mode, o); return c;
};
["girih", "gulli", "islimiy", "madohil"].forEach(m => NQ.sources[m] = (sz, o) => Promise.resolve(A.texture(m, sz, o)));

/* ================= NAQŞ UNSURLARI (200×200 maydonda SVG yöllar) ================= */
const f2 = n => (+n).toFixed(1);
function leafD(x, y, ang, len, wid, curl) { // barg: asos (x,y), yönaliş ang (radian)
  const c = Math.cos(ang), s = Math.sin(ang), P = (u, v) => f2(x + u * c - v * s) + " " + f2(y + u * s + v * c);
  const k = curl || 0;
  return `M${P(0, 0)} C${P(len * .22, -wid * 1.05)} ${P(len * .68, -wid * .95)} ${P(len, -wid * .1 + k)} C${P(len * .7, wid * .7)} ${P(len * .25, wid * .9)} ${P(0, 0)}Z`;
}
function veinD(x, y, ang, len, wid) { const c = Math.cos(ang), s = Math.sin(ang), P = (u, v) => f2(x + u * c - v * s) + " " + f2(y + u * s + v * c); return `M${P(len * .06, 0)} Q${P(len * .5, -wid * .05)} ${P(len * .9, -wid * .1)}`; }
function petalD(cx, cy, a, r1, r2, w) { const c = Math.cos(a), s = Math.sin(a), P = (u, v) => f2(cx + u * c - v * s) + " " + f2(cy + u * s + v * c), d = r2 - r1;
  return `M${P(r1, 0)} C${P(r1 + d * .2, -w)} ${P(r1 + d * .75, -w * .95)} ${P(r2, 0)} C${P(r1 + d * .75, w * .95)} ${P(r1 + d * .2, w)} ${P(r1, 0)}Z`; }
const circD = (x, y, r) => `M${f2(x - r)} ${f2(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
function flowerParts(cx, cy, R, k, rot) {
  const p = [];
  for (let i = 0; i < k; i++) p.push({ d: petalD(cx, cy, rot + i * TAU / k, R * .18, R, R * TAU / k * .62), r: "flower" });
  for (let i = 0; i < k; i++) p.push({ d: petalD(cx, cy, rot + (i + .5) * TAU / k, R * .15, R * .62, R * TAU / k * .3), r: "leaf" });
  p.push({ d: circD(cx, cy, R * .2), r: "center" });
  return p;
}
function spiralD(cx, cy, R, turns, a0, dir) { let d = ""; const n = 60, b = Math.log(6) / (turns * TAU); for (let i = 0; i <= n; i++) { const ph = i / n * turns * TAU, r = R * Math.exp(-b * ph), a = a0 + dir * ph; d += (i ? "L" : "M") + f2(cx + r * Math.cos(a)) + " " + f2(cy + r * Math.sin(a)); } return d; }

const EL = A.EL = {
  barg: { name: "Barg", parts: () => [{ d: leafD(100, 188, -Math.PI / 2, 172, 62, 6), r: "leaf" }, { d: veinD(100, 188, -Math.PI / 2, 172, 62), r: "vein" },
    { d: "M100 150 Q80 135 70 118 M100 120 Q122 105 130 88 M100 95 Q84 82 80 66", r: "vein" }] },
  gul: { name: "Gul (rozetka)", parts: () => flowerParts(100, 100, 92, 8, -Math.PI / 2) },
  bargli_gul: { name: "Bargli gul", parts: () => [{ d: "M100 196 C96 160 104 130 100 100", r: "stem" },
    { d: leafD(99, 165, -Math.PI / 2 - .95, 70, 24), r: "leaf" }, { d: leafD(101, 145, -Math.PI / 2 + .95, 66, 22), r: "leaf" }]
    .concat(flowerParts(100, 70, 58, 6, -Math.PI / 2)) },
  shobarg: { name: "Şobarg (şoxbarg)", parts: () => {
    // yirik, böğinli barg: çeti tişsimon (pallali), uçi buralgan
    let L = "M100 192", R = "";
    const lobes = 4, top = 22, bot = 192, H = bot - top;
    const wAt = t => 78 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), .75);
    const ptsL = [], ptsR = [];
    for (let i = 1; i <= lobes; i++) { const t0 = (i - 1) / lobes, t1 = i / lobes, tm = (t0 + t1) / 2;
      ptsL.push([100 - wAt(tm) * 1.05, bot - H * tm + 8, 100 - wAt(t1) * .55, bot - H * t1 + 4]); ptsR.push([100 + wAt(tm) * 1.05, bot - H * tm + 8, 100 + wAt(t1) * .55, bot - H * t1 + 4]); }
    ptsL.forEach(p => L += ` Q${f2(p[0])} ${f2(p[1])} ${f2(p[2])} ${f2(p[3])}`);
    L += ` Q100 ${top - 6} 118 ${top + 10}`;
    for (let i = ptsR.length - 1; i >= 0; i--) { const p = ptsR[i], prev = i > 0 ? ptsR[i - 1] : [0, 0, 100, 192]; R += ` Q${f2(p[0])} ${f2(p[1])} ${f2(prev[2])} ${f2(prev[3])}`; }
    const outline = L + " L" + f2(ptsR[lobes - 1][2]) + " " + f2(ptsR[lobes - 1][3]) + R + "Z";
    return [{ d: outline, r: "leaf" }, { d: "M100 188 C98 140 104 80 106 30", r: "vein" },
      { d: "M101 160 Q75 150 55 160 M102 120 Q128 108 148 116 M103 85 Q82 74 66 80 M104 58 Q122 48 134 52", r: "vein" },
      { d: spiralD(116, 30, 10, 1.1, Math.PI, 1), r: "vein" }]; } },
  qoshbarg: { name: "Qöşbarg", parts: () => [{ d: leafD(100, 190, -Math.PI / 2 - .38, 160, 44, 4), r: "leaf" }, { d: leafD(100, 190, -Math.PI / 2 + .38, 160, 44, -4), r: "leaf" },
    { d: veinD(100, 190, -Math.PI / 2 - .38, 160, 44), r: "vein" }, { d: veinD(100, 190, -Math.PI / 2 + .38, 160, 44), r: "vein" }, { d: circD(100, 186, 8), r: "center" }] },
  bofta: { name: "Bofta", parts: () => [{ d: "M22 182 C60 150 146 128 146 74 A46 46 0 1 0 54 74 C54 128 140 150 178 182", r: "band" }, { d: circD(100, 66, 14), r: "flower" }] },
  shukufta: { name: "Şukufta", parts: () => [{ d: "M14 176 C30 120 70 150 88 112", r: "stem" }, { d: "M186 176 C170 120 130 150 112 112", r: "stem" },
    { d: spiralD(28, 150, 22, 1.2, 0, 1), r: "stem" }, { d: spiralD(172, 150, 22, 1.2, Math.PI, -1), r: "stem" },
    { d: "M80 112 C64 76 84 46 100 18 C116 46 136 76 120 112Z", r: "flower" }, { d: "M90 108 C84 82 94 62 100 46 C106 62 116 82 110 108Z", r: "leaf" },
    { d: "M74 116 Q100 104 126 116 Q100 130 74 116Z", r: "center" }] },
  yakkaband: { name: "Yakkaband novda", parts: () => [{ d: "M12 186 C40 90 120 200 150 104 C166 52 120 30 104 60 C94 80 120 92 128 74", r: "stem" },
    { d: leafD(38, 140, -2.1, 46, 15), r: "leaf" }, { d: leafD(80, 150, .5, 44, 14), r: "leaf" }, { d: leafD(134, 140, -.9, 42, 14), r: "leaf" },
    { d: leafD(150, 80, -1.2, 36, 12), r: "leaf" }, { d: petalD(128, 74, -1.4, 0, 22, 9), r: "flower" }] },
  qoshband: { name: "Qöşband novda", parts: () => [{ d: "M10 100 C50 20 90 20 100 100 C110 180 150 180 190 100", r: "stem" }, { d: "M10 100 C50 180 90 180 100 100 C110 20 150 20 190 100", r: "stem" },
    { d: leafD(50, 40, -.5, 40, 13), r: "leaf" }, { d: leafD(50, 160, .5, 40, 13), r: "leaf" }, { d: leafD(150, 40, -2.6, 40, 13), r: "leaf" }, { d: leafD(150, 160, 2.6, 40, 13), r: "leaf" },
    { d: circD(100, 100, 13), r: "flower" }, { d: circD(100, 100, 5), r: "center" }] },
  margula: { name: "Marğula", parts: () => [{ d: "M24 186 C24 104 104 40 154 74 C190 100 162 158 120 144 C92 134 104 98 130 106", r: "band" }, { d: petalD(130, 106, -.3, 0, 18, 7), r: "flower" }] },
  kurtak: { name: "Kurtak (ğunça)", parts: () => [{ d: "M100 196 L100 140", r: "stem" }, { d: leafD(100, 150, -Math.PI / 2 - 1.05, 50, 15), r: "leaf" }, { d: leafD(100, 150, -Math.PI / 2 + 1.05, 50, 15), r: "leaf" },
    { d: "M100 146 C62 120 72 58 100 22 C128 58 138 120 100 146Z", r: "flower" }, { d: "M100 140 C84 118 88 82 100 60 C112 82 116 118 100 140Z", r: "leaf" }] },
  gajak: { name: "Ğajak", parts: () => [{ d: "M20 180 C40 110 110 60 150 84 " + spiralD(140, 110, 28, 1.6, -Math.PI / 2 + .35, 1).replace(/^M/, "L"), r: "stem" }, { d: leafD(62, 128, -2.2, 34, 11), r: "leaf" }] },
  madohil: { name: "Madohil", parts: () => [{ d: "M100 12 C142 58 188 78 174 140 C164 178 122 190 100 166 C78 190 36 178 26 140 C12 78 58 58 100 12Z", r: "frame" },
    { d: "M100 40 C128 72 156 88 148 132 C142 158 116 164 100 148 C84 164 58 158 52 132 C44 88 72 72 100 40Z", r: "leaf" }].concat(flowerParts(100, 112, 32, 6, -Math.PI / 2)) },
  tanob: { name: "Tanob", parts: () => [{ d: "M10 160 C40 160 40 40 100 40 C160 40 160 160 190 160", r: "band" }, { d: "M10 40 C40 40 40 160 100 160 C160 160 160 40 190 40", r: "band" }, { d: circD(100, 100, 12), r: "flower" }] }
};
A.roleStyle = function (role, P) {
  switch (role) {
    case "leaf": return { fill: P.leaf, stroke: P.leafLine, w: 2 };
    case "flower": return { fill: P.flower, stroke: P.leafLine, w: 2 };
    case "center": return { fill: P.center, stroke: P.leafLine, w: 1.6 };
    case "frame": return { fill: P.frame || P.poly[0], stroke: P.leafLine, w: 2.2 };
    case "stem": return { fill: "none", stroke: P.stem, w: 6, outline: P.leafLine };
    case "band": return { fill: "none", stroke: P.band, w: 9, outline: P.leafLine };
    case "vein": return { fill: "none", stroke: P.leafLine, w: 1.4 };
  } return { fill: "#ccc", stroke: "#333", w: 1 };
};
A.elementSVG = function (id, P, opts) {
  P = P || A.palette("oqsaroy"); opts = opts || {}; const parts = EL[id].parts(); let s = "";
  parts.forEach(p => { const st = A.roleStyle(p.r, P), cls = opts.anim ? ' class="dr"' : "";
    if (st.outline) s += `<path d="${p.d}" fill="none" stroke="${st.outline}" stroke-width="${st.w + 3}" stroke-linecap="round" stroke-linejoin="round"${cls}/>`;
    s += `<path d="${p.d}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="${st.w}" stroke-linecap="round" stroke-linejoin="round"${cls}${opts.anim && st.fill !== "none" ? ' data-fill="1"' : ''}/>`; });
  return s;
};
A.drawElement = function (ctx, id, x, y, size, rot, P, mirror) {
  const parts = EL[id].parts(), k = size / 200; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); if (mirror) ctx.scale(-1, 1); ctx.scale(k, k); ctx.translate(-100, -100);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  parts.forEach(p => { const st = A.roleStyle(p.r, P), path = new Path2D(p.d);
    if (st.outline) { ctx.strokeStyle = st.outline; ctx.lineWidth = st.w + 3; ctx.stroke(path); }
    if (st.fill !== "none") { ctx.fillStyle = st.fill; ctx.fill(path); }
    ctx.strokeStyle = st.stroke; ctx.lineWidth = st.w; ctx.stroke(path); });
  ctx.restore();
};

/* ================= VIDJET: Unsurlar galereyasi ================= */
NQ.W.elements = function (el, cfg) {
  const items = cfg.items || Object.keys(EL).map(id => ({ id }));
  el.innerHTML = `<div class="split"><div><svg class="art big" viewBox="0 0 200 200" style="max-width:560px;margin:auto"></svg>
    <div class="row mt" style="justify-content:center"><button class="btn gold" data-a="draw">▶ Çiziliş animatsiyasi</button><select data-a="pal" style="width:auto"></select></div></div>
    <div class="card"><h3 class="nm"></h3><div class="ds big"></div><h3 class="mt">Unsurlar</h3><div class="tiles"></div></div></div>`;
  const sel = NQ.$("[data-a=pal]", el); for (const k in PAL) sel.add(new Option(PAL[k].name, k)); sel.value = cfg.pal || "oqsaroy";
  const tiles = NQ.$(".tiles", el), big = NQ.$("svg.big", el); let cur = 0;
  function tilesRender() { tiles.innerHTML = items.map((it, i) => `<div class="tile${i === cur ? " sel" : ""}" data-i="${i}"><svg viewBox="-10 -10 220 220">${A.elementSVG(it.id, A.palette(sel.value))}</svg><b>${it.name || EL[it.id].name}</b></div>`).join("");
    NQ.$$(".tile", tiles).forEach(t => t.onclick = () => { cur = +t.dataset.i; show(true); tilesRender(); }); }
  function show(anim) { const it = items[cur]; NQ.$(".nm", el).textContent = it.name || EL[it.id].name; NQ.$(".ds", el).innerHTML = it.desc || "";
    big.innerHTML = `<rect x="-20" y="-20" width="240" height="240" fill="#fffdf7"/><g>${A.elementSVG(it.id, A.palette(sel.value), { anim: true })}</g>`;
    const paths = NQ.$$("path", big);
    paths.forEach((p, k) => { const fill = p.getAttribute("fill"); let L = 600; try { L = p.getTotalLength(); } catch (e) { }
      if (!anim) return; p.style.fillOpacity = 0; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect();
      p.style.transition = `stroke-dashoffset 1.4s ease ${k * .12}s, fill-opacity .8s ease ${1.2 + k * .12}s`; p.style.strokeDashoffset = 0; p.style.fillOpacity = 1; }); }
  NQ.$("[data-a=draw]", el).onclick = () => show(true); sel.onchange = () => { tilesRender(); show(false); };
  tilesRender(); show(true);
};

/* ================= VIDJET: Generator ================= */
NQ.W.gen = function (el, cfg) {
  const S = A.genState; Object.assign(S, cfg.state || {}); const modes = cfg.modes || ["girih", "gulli", "islimiy", "madohil"]; S.mode = cfg.mode || modes[0];
  const names = { girih: "Girih", gulli: "Gulli girih", islimiy: "Islimiy", madohil: "Madohil" };
  el.innerHTML = `<div class="subtabs">${modes.map(m => `<button data-m="${m}">${names[m]}</button>`).join("")}</div>
  <div class="split"><div><canvas class="art" width="900" height="900"></canvas></div><div class="card">
   <div class="ctrl two"><label>Rang uslubi</label><select data-k="pal"></select></div>
   <div data-g="g"><h3 class="mt">Girih töri</h3>
    <div class="ctrl two"><label>Asos tör</label><select data-k="tiling"><option value="488">8 qirrali yulduz (4.8.8)</option><option value="4">4 qirrali (kvadrat)</option><option value="6">6 qirrali (oltiburçak)</option><option value="31212">12 qirrali (3.12.12)</option></select></div>
    <div class="ctrl"><label>Unsur ölçami</label><input type="range" data-k="size" min="30" max="140"><output></output></div>
    <div class="ctrl"><label>Yulduz burçagi</label><input type="range" data-k="theta" min="25" max="85" step=".5"><output></output></div>
    <div class="ctrl"><label>Tasma kengligi</label><input type="range" data-k="band" min="0" max="16"><output></output></div></div>
   <div data-g="i"><h3 class="mt">Islimiy</h3>
    <div class="ctrl"><label>Simmetriya</label><input type="range" data-k="sym" min="2" max="8"><output></output></div>
    <div class="ctrl"><label>Ğajak aylanişi</label><input type="range" data-k="turns" min=".6" max="2.4" step=".1"><output></output></div>
    <div class="ctrl"><label>Barglar soni</label><input type="range" data-k="leaves" min="0" max="12"><output></output></div>
    <label class="row"><input type="checkbox" data-k="mirror"> Oynasimon simmetriya</label><label class="row" data-g="rep"><input type="checkbox" data-k="repeat"> Takrorlanuvçi tör (rapport)</label></div>
   <div data-g="m"><h3 class="mt">Qatlamlar</h3>
    <label class="row"><input type="checkbox" data-k="l1on"> 1-qatlam: islimiy</label><div class="ctrl"><label>Şaffoflik</label><input type="range" data-k="l1" min="0" max="1" step=".05"><output></output></div>
    <label class="row"><input type="checkbox" data-k="l2on"> 2-qatlam: girih</label><div class="ctrl"><label>Şaffoflik</label><input type="range" data-k="l2" min="0" max="1" step=".05"><output></output></div>
    <label class="row"><input type="checkbox" data-k="swap"> Qatlamlar örnini almaştiriş</label></div>
   <div class="row mt"><button class="btn gold" data-a="anim">▶ Animatsiya</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   ${cfg.note ? `<div class="note mt">${cfg.note}</div>` : ""}</div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"), ps = NQ.$("[data-k=pal]", el);
  for (const k in PAL) ps.add(new Option(PAL[k].name, k));
  const draw = p => A.render(ctx, cv.width, cv.height, S.mode, { progress: p });
  NQ.$$("[data-k]", el).forEach(i => { const k = i.dataset.k;
    if (i.type === "checkbox") { i.checked = !!S[k]; i.onchange = () => { S[k] = i.checked; draw(); }; }
    else { i.value = S[k]; const o = i.nextElementSibling; const upd = () => { S[k] = i.tagName === "SELECT" && k !== "tiling" && k !== "pal" ? i.value : (isNaN(+i.value) ? i.value : (k === "tiling" ? i.value : +i.value)); if (o && o.tagName === "OUTPUT") o.textContent = i.value; };
      upd(); i.addEventListener("input", () => { upd(); if (k === "tiling") { S.theta = { "488": 67.5, "4": 60, "6": 60, "31212": 70 }[i.value]; NQ.$("[data-k=theta]", el).value = S.theta; NQ.$("[data-k=theta]", el).nextElementSibling.textContent = S.theta; } draw(); }); } });
  function setMode(m) { S.mode = m; NQ.$$(".subtabs button", el).forEach(b => b.classList.toggle("active", b.dataset.m === m));
    NQ.$("[data-g=g]", el).style.display = m === "islimiy" ? "none" : ""; NQ.$("[data-g=i]", el).style.display = (m === "girih" || m === "gulli") ? "none" : "";
    NQ.$("[data-g=m]", el).style.display = m === "madohil" ? "" : "none"; NQ.$("[data-g=rep]", el).style.display = m === "madohil" ? "none" : ""; draw(); }
  NQ.$$(".subtabs button", el).forEach(b => b.onclick = () => setMode(b.dataset.m));
  let stop = null; NQ.$("[data-a=anim]", el).onclick = () => { if (stop) stop(); stop = NQ.animate(S.mode === "islimiy" ? 5000 : 3500, p => draw(NQ.ease(p))); };
  NQ.$("[data-a=png]", el).onclick = () => NQ.download(cv.toDataURL("image/png"), "naqsh_" + S.mode + ".png");
  setMode(S.mode);
  el._show = () => draw();
  NQ.sources.gen = (sz, o) => Promise.resolve(A.texture(S.mode, sz, o));
};

/* ================= VIDJET: Kompozitsiya konstruktori ================= */
A.compose = function (ctx, W, H, o) {
  const P = A.palette(o.pal); ctx.fillStyle = o.bgc || P.bg; ctx.fillRect(0, 0, W, H);
  const el = o.el, el2 = o.el2 || o.el, sz = o.size, n = o.n;
  const put = (id, x, y, s, r, m) => A.drawElement(ctx, id, x, y, s, r, P, m);
  if (o.st === "lenta") {
    const rows = o.rows || 3, bh = H / rows;
    for (let r = 0; r < rows; r++) { const y0 = r * bh, cy = y0 + bh / 2;
      ctx.fillStyle = r % 2 ? P.poly[1] : P.poly[0]; ctx.fillRect(0, y0 + 8, W, bh - 16);
      ctx.strokeStyle = P.band; ctx.lineWidth = 4; ctx.strokeRect(-5, y0 + 12, W + 10, bh - 24);
      const step = W / n;
      for (let i = 0; i < n; i++) { const alt = i % 2 === 1, id = alt && o.alt ? el2 : el; const mode = (o.rhythm || "oddiy");
        const rot = mode === "oynaviy" ? 0 : (mode === "aylanma" ? (alt ? Math.PI : 0) : 0), mir = mode === "oynaviy" && alt;
        put(id, step * (i + .5), cy, Math.min(sz, bh * .85, step * 1.1), rot + (o.rot || 0) * Math.PI / 180, mir); } }
  } else if (o.st === "rozetka") {
    for (let i = 0; i < n; i++) { const a = i * TAU / n; const R = Math.min(W, H) * .25; const id = (i % 2 && o.alt) ? el2 : el;
      put(id, W / 2 + Math.cos(a - Math.PI / 2) * R, H / 2 + Math.sin(a - Math.PI / 2) * R, sz, a + (o.rot || 0) * Math.PI / 180, o.mirror && i % 2); }
    rosette(ctx, W / 2, H / 2, Math.min(W, H) * .1, Math.max(6, n), 0, P, 1);
    ctx.strokeStyle = P.stem; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.min(W, H) * .46, 0, TAU); ctx.stroke();
  } else if (o.st === "tor") {
    const k = Math.max(2, Math.round(n / 2)), step = W / k;
    for (let i = 0; i <= k; i++) for (let j = 0; j <= k; j++) { const off = o.drop && (i % 2) ? step / 2 : 0; const id = ((i + j) % 2 && o.alt) ? el2 : el;
      put(id, i * step + step / 2 * 0, j * step + off, Math.min(sz, step * .95), (o.rot || 0) * Math.PI / 180, o.mirror && (i % 2)); }
    ctx.strokeStyle = P.band; ctx.lineWidth = 2; ctx.globalAlpha = .45;
    for (let i = 0; i <= k; i++) { ctx.beginPath(); ctx.moveTo(i * step + step / 2, 0); ctx.lineTo(i * step + step / 2, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * step + step / 2); ctx.lineTo(W, i * step + step / 2); ctx.stroke(); }
    ctx.globalAlpha = 1;
  } else if (o.st === "turunj") {
    const m = 54; ctx.fillStyle = P.poly[0]; ctx.fillRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(m, m, W - 2 * m, H - 2 * m);
    ctx.strokeStyle = P.band; ctx.lineWidth = 4; ctx.strokeRect(m, m, W - 2 * m, H - 2 * m); ctx.strokeRect(6, 6, W - 12, H - 12);
    const kk = Math.round(W / 90); for (let i = 0; i < kk; i++) { const t = (i + .5) * W / kk; [[t, m / 2], [t, H - m / 2], [m / 2, t], [W - m / 2, t]].forEach(([x, y], q) => put(el2, x, y, m * .8, q < 2 ? Math.PI / 2 : 0, false)); }
    ctx.save(); ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * .3, H * .3, 0, 0, TAU); ctx.fillStyle = P.poly[1]; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = P.band; ctx.stroke(); ctx.restore();
    for (let i = 0; i < n; i++) { const a = i * TAU / n; put(el, W / 2 + Math.cos(a) * W * .17, H / 2 + Math.sin(a) * H * .17, sz * .8, a + Math.PI / 2, o.mirror && i % 2); }
    rosette(ctx, W / 2, H / 2, W * .07, 8, 0, P, 1);
    [[m, m, 0], [W - m, m, Math.PI / 2], [W - m, H - m, Math.PI], [m, H - m, -Math.PI / 2]].forEach(([x, y, r]) => put(el, x + Math.cos(r + Math.PI / 4) * sz * .55, y + Math.sin(r + Math.PI / 4) * sz * .55, sz * .9, r + Math.PI * .75, false));
  } else if (o.st === "burchak") {
    ctx.fillStyle = P.poly[0]; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = P.band; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W * .1, H * .9); ctx.quadraticCurveTo(W * .1, H * .1, W * .9, H * .1); ctx.stroke();
    for (let i = 0; i < n; i++) { const t = (i + .5) / n, u = 1 - t, x = u * u * W * .1 + 2 * u * t * W * .1 + t * t * W * .9, y = u * u * H * .9 + 2 * u * t * H * .1 + t * t * H * .1;
      put(i % 2 && o.alt ? el2 : el, x, y, sz * (1 - .4 * Math.abs(t - .5)), -Math.PI / 4 + (i % 2 ? .4 : -.4), i % 2 === 1); }
  }
};
NQ.W.composer = function (el, cfg) {
  const o = Object.assign({ el: "barg", el2: "gul", st: "lenta", n: 8, size: 130, rot: 0, pal: "oqsaroy", alt: true, mirror: true, rhythm: "oddiy", rows: 3, drop: false }, cfg.state || {});
  const elist = cfg.elements || Object.keys(EL), stl = cfg.structures || ["lenta", "rozetka", "tor", "turunj", "burchak"];
  const SN = { lenta: "Lenta (hoşiya, bordyur)", rozetka: "Rozetka (markaziy)", tor: "Tör (rapport)", turunj: "Turunj + hoşiya", burchak: "Burçak kompozitsiyasi" };
  el.innerHTML = `<div class="split"><div><canvas class="art" width="900" height="900"></canvas></div><div class="card">
   <div class="ctrl two"><label>Tuziliş</label><select data-k="st">${stl.map(s => `<option value="${s}">${SN[s]}</option>`).join("")}</select></div>
   <div class="ctrl two"><label>Asosiy unsur</label><select data-k="el">${elist.map(s => `<option value="${s}">${EL[s].name}</option>`).join("")}</select></div>
   <div class="ctrl two"><label>Ikkinçi unsur</label><select data-k="el2">${elist.map(s => `<option value="${s}">${EL[s].name}</option>`).join("")}</select></div>
   <div class="ctrl two" data-g="rh"><label>Ritm</label><select data-k="rhythm"><option value="oddiy">Oddiy takror</option><option value="oynaviy">Oynaviy (közgu)</option><option value="aylanma">Aylanma (180°)</option></select></div>
   <div class="ctrl"><label>Soni</label><input type="range" data-k="n" min="2" max="16"><output></output></div>
   <div class="ctrl"><label>Ölçami</label><input type="range" data-k="size" min="50" max="300"><output></output></div>
   <div class="ctrl"><label>Burilişi</label><input type="range" data-k="rot" min="-180" max="180" step="5"><output></output></div>
   <div class="ctrl two"><label>Rang uslubi</label><select data-k="pal">${Object.keys(PAL).map(k => `<option value="${k}">${PAL[k].name}</option>`).join("")}</select></div>
   <label class="row"><input type="checkbox" data-k="alt"> Ikki unsurni galma-gal joylaş</label>
   <label class="row"><input type="checkbox" data-k="mirror"> Oynaviy aks ettiriş</label>
   <label class="row" data-g="dr"><input type="checkbox" data-k="drop"> Siljigan tör (yarim qadam)</label>
   <div class="row mt"><button class="btn gold" data-a="anim">▶ Yiğiliş</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   ${cfg.note ? `<div class="note mt">${cfg.note}</div>` : ""}</div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d");
  const draw = () => { A.compose(ctx, cv.width, cv.height, o); NQ.$("[data-g=rh]", el).style.display = o.st === "lenta" ? "" : "none"; NQ.$("[data-g=dr]", el).style.display = o.st === "tor" ? "" : "none"; };
  NQ.$$("[data-k]", el).forEach(i => { const k = i.dataset.k; if (i.type === "checkbox") { i.checked = !!o[k]; i.onchange = () => { o[k] = i.checked; draw(); }; }
    else { i.value = o[k]; const out = i.nextElementSibling; const upd = () => { o[k] = i.type === "range" ? +i.value : i.value; if (out && out.tagName === "OUTPUT") out.textContent = i.value; }; upd(); i.addEventListener("input", () => { upd(); draw(); }); } });
  NQ.$("[data-a=png]", el).onclick = () => NQ.download(cv.toDataURL("image/png"), "kompozitsiya.png");
  NQ.$("[data-a=anim]", el).onclick = () => { const N0 = o.n; NQ.animate(2200, p => { o.n = Math.max(1, Math.round(N0 * p)); draw(); }, () => { o.n = N0; draw(); }); };
  draw(); el._show = draw;
  NQ.sources.composer = (sz) => { const c = document.createElement("canvas"); c.width = c.height = sz || 1024; A.compose(c.getContext("2d"), c.width, c.height, Object.assign({}, o, { size: o.size * c.width / 900 })); return Promise.resolve(c); };
};


/* ================= VIDJET: Lenta kompozitsiyalari to'plami ================= */
NQ.W.bandset = function (el, cfg) {
  const ps = cfg.presets || [];
  el.innerHTML = `<div class="grid g2">${ps.map((p, i) => `<div class="card" style="padding:10px"><canvas class="art" width="900" height="240" data-i="${i}"></canvas><p class="legend" style="margin:6px 2px 0"><b>${i + 1}.</b> ${p.t || ""}</p></div>`).join("")}</div>
   <div class="row mt"><button class="btn gold">▶ Ketma-ket körsatiş</button></div>`;
  const draw = (cv, p, k) => { const o = Object.assign({ st: "lenta", rows: 1, size: 200, n: 6, alt: true, pal: "oqsaroy", rhythm: "oddiy" }, p); o.n = Math.max(1, Math.round(o.n * (k == null ? 1 : k))); A.compose(cv.getContext("2d"), cv.width, cv.height, o); };
  const cvs = NQ.$$("canvas", el); cvs.forEach((c, i) => draw(c, ps[i]));
  NQ.$(".btn", el).onclick = () => cvs.forEach((c, i) => setTimeout(() => NQ.animate(900, k => draw(c, ps[i], k)), i * 350));
};

/* ================= VIDJET: Böyaş va pardozlaş ================= */
const COLORS = [["Lojuvard", "#1f3f8f"], ["Firuza", "#1fa3a3"], ["Ganç oq", "#f6f0e1"], ["Oltin", "#d4a72c"], ["Qirmizi", "#b3262e"], ["Zarğaldoq", "#e39b1b"],
  ["Yaşil", "#2e7d4f"], ["Jigarrang", "#6b3e26"], ["Puşti", "#d98aa0"], ["Siyohrang", "#4b2a6b"], ["Moviy", "#5b9bd5"], ["Qora", "#1b1b1b"]];
A.COLORS = COLORS;
function tplTurunj() { // 600×600 qatlamlar: [d, guruh, evenodd]
  const R = [], C = 300, pol = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)], circ = (r, x = C, y = C) => circD(x, y, r);
  R.push([`M0 0H600V600H0Z M42 42V558H558V42Z`, "hosiya", 1]);
  for (let s = 0; s < 4; s++) for (let k = 0; k < 11; k++) { const t = 42 + (k + .5) * (516 / 11), q = 13; let cx, cy; if (s === 0) { cx = t; cy = 21; } else if (s === 1) { cx = 579; cy = t; } else if (s === 2) { cx = 600 - t; cy = 579; } else { cx = 21; cy = 600 - t; }
    R.push([`M${f2(cx)} ${f2(cy - q)}L${f2(cx + q)} ${f2(cy)}L${f2(cx)} ${f2(cy + q)}L${f2(cx - q)} ${f2(cy)}Z`, "romb"]); }
  R.push([`M42 42H558V558H42Z ${circ(252)}`, "zamin", 1]);
  [[42, 42, 1, 1], [558, 42, -1, 1], [558, 558, -1, -1], [42, 558, 1, -1]].forEach(([x, y, sx, sy]) => { const P = (u, v) => f2(x + sx * u) + " " + f2(y + sy * v);
    R.push([`M${P(6, 6)} C${P(70, 10)} ${P(120, 40)} ${P(118, 92)} C${P(100, 70)} ${P(60, 62)} ${P(40, 60)} C${P(62, 40)} ${P(30, 14)} ${P(6, 6)}Z`, "burchak"]);
    R.push([`M${P(6, 6)} C${P(10, 70)} ${P(40, 120)} ${P(92, 118)} C${P(70, 100)} ${P(62, 60)} ${P(60, 40)} C${P(40, 62)} ${P(14, 30)} ${P(6, 6)}Z`, "burchak"]);
    R.push([circ(9, x + sx * 24, y + sy * 24), "burchak2"]); });
  R.push([`${circ(252)} ${circ(232)}`, "halqa", 1]); R.push([circ(232), "doira"]);
  const rin = 150 * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
  for (let k = 0; k < 8; k++) R.push([petalD(C, C, Math.PI / 8 + k * Math.PI / 4, rin + 2, 226, 40), "gulbarg"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C, C, k * Math.PI / 4, 154, 214, 17), "gulbarg2"]);
  for (let k = 0; k < 8; k++) { const t = pol(150, k * Math.PI / 4), a = pol(rin, k * Math.PI / 4 - Math.PI / 8), b = pol(rin, k * Math.PI / 4 + Math.PI / 8); R.push([`M${f2(a[0])} ${f2(a[1])}L${f2(t[0])} ${f2(t[1])}L${f2(b[0])} ${f2(b[1])}Z`, "yulduz"]); }
  let od = ""; for (let k = 0; k < 8; k++) { const p = pol(rin, Math.PI / 8 + k * Math.PI / 4); od += (k ? "L" : "M") + f2(p[0]) + " " + f2(p[1]); } R.push([od + "Z", "markaz"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C, C, k * Math.PI / 4, 18, 82, 20), "markazgul"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C, C, Math.PI / 8 + k * Math.PI / 4, 18, 56, 11), "markazgul2"]);
  R.push([circ(18), "nuqta"]);
  return { R, sample: { hosiya: "#1f3f8f", romb: "#d4a72c", zamin: "#1fa3a3", burchak: "#f6f0e1", burchak2: "#d4a72c", halqa: "#1f3f8f", doira: "#1f3f8f", gulbarg: "#f6f0e1", gulbarg2: "#b3262e", yulduz: "#d4a72c", markaz: "#1fa3a3", markazgul: "#f6f0e1", markazgul2: "#e39b1b", nuqta: "#b3262e" },
    order: ["zamin", "hosiya", "halqa", "doira", "gulbarg", "yulduz", "markaz", "burchak", "gulbarg2", "markazgul", "markazgul2", "burchak2", "romb", "nuqta"] };
}
function tplGulbarg() {
  const R = [], C = [300, 250];
  R.push([`M0 0H600V600H0Z`, "zamin"]);
  R.push([`M300 590 C290 500 312 420 300 330`, "poya"]);
  R.push([leafD(298, 520, -Math.PI / 2 - 1.0, 170, 52, 6), "barg"]); R.push([leafD(302, 470, -Math.PI / 2 + 1.0, 160, 48, -6), "barg"]);
  R.push([leafD(298, 410, -Math.PI / 2 - .7, 120, 36), "barg2"]); R.push([leafD(302, 390, -Math.PI / 2 + .7, 115, 34), "barg2"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C[0], C[1], -Math.PI / 2 + k * TAU / 8, 34, 190, 70), "gulbarg"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C[0], C[1], -Math.PI / 2 + (k + .5) * TAU / 8, 30, 120, 34), "gulbarg2"]);
  for (let k = 0; k < 8; k++) R.push([petalD(C[0], C[1], -Math.PI / 2 + k * TAU / 8, 20, 70, 18), "ichki"]);
  R.push([circD(C[0], C[1], 30), "markaz"]); R.push([circD(C[0], C[1], 12), "nuqta"]);
  return { R, sample: { zamin: "#1f3f8f", poya: "#d4a72c", barg: "#2e7d4f", barg2: "#1fa3a3", gulbarg: "#b3262e", gulbarg2: "#f6f0e1", ichki: "#e39b1b", markaz: "#d4a72c", nuqta: "#b3262e" },
    order: ["zamin", "poya", "barg", "barg2", "gulbarg", "gulbarg2", "ichki", "markaz", "nuqta"], stroke: { poya: 1 } };
}
function tplLenta(cfg) {
  const R = [], ids = cfg.els || ["barg", "gul", "bargli_gul", "shobarg", "qoshbarg", "bofta", "shukufta", "kurtak", "madohil", "margula"], n = ids.length;
  const W = 600, rows = 2, perRow = Math.ceil(n / rows), cw = W / perRow, bh = 300;
  for (let r = 0; r < rows; r++) { R.push([`M0 ${r * bh}H600V${r * bh + bh}H0Z`, "zamin" + r]); R.push([`M0 ${r * bh + 10}H600V${r * bh + 22}H0Z M0 ${r * bh + bh - 22}H600V${r * bh + bh - 10}H0Z`, "hoshiya"]); }
  ids.forEach((id, i) => { const r = Math.floor(i / perRow), c = i % perRow, cx = c * cw + cw / 2, cy = r * bh + bh / 2, k = Math.min(cw, bh - 50) / 200;
    const tf = `translate(${f2(cx)} ${f2(cy)}) scale(${k.toFixed(4)}) translate(-100 -100)`;
    EL[id].parts().forEach(p => { if (p.r === "vein") return; R.push([p.d, "u_" + p.r, 0, (p.r === "stem" || p.r === "band") ? 1 : 0, tf, k]); }); });
  return { R, sample: { zamin0: "#1f3f8f", zamin1: "#2e7d4f", hoshiya: "#d4a72c", u_leaf: "#f6f0e1", u_flower: "#b3262e", u_center: "#d4a72c", u_frame: "#1fa3a3", u_stem: "#d4a72c", u_band: "#f6f0e1" },
    order: ["zamin0", "zamin1", "hoshiya", "u_frame", "u_leaf", "u_flower", "u_center", "u_stem", "u_band"] };
}
function tplElement(cfg) {
  const R = [], id = cfg.el || "shobarg"; R.push([`M0 0H600V600H0Z`, "zamin"]);
  const tf = "translate(300 300) scale(2.7) translate(-100 -100)";
  EL[id].parts().forEach((p, i) => { if (p.r !== "vein") R.push([p.d, "q" + i, 0, (p.r === "stem" || p.r === "band") ? 1 : 0, tf, 2.7]); });
  return { R, sample: { zamin: "#1f3f8f" }, order: ["zamin"] };
}
function tplLagan() {
  const R = [], C = 300; R.push([`M0 0H600V600H0Z`, "fon"]); R.push([`${circD(C, C, 290)} ${circD(C, C, 240)}`, "gardish", 1]);
  for (let k = 0; k < 24; k++) R.push([petalD(C, C, k * TAU / 24, 246, 284, 9), "gardishgul"]);
  R.push([circD(C, C, 240), "zamin"]);
  for (let k = 0; k < 6; k++) { const a = k * TAU / 6 - Math.PI / 2; R.push([leafD(C + Math.cos(a) * 70, C + Math.sin(a) * 70, a, 150, 46, 5), "barg"]); }
  for (let k = 0; k < 6; k++) { const a = (k + .5) * TAU / 6 - Math.PI / 2; R.push([petalD(C, C, a, 80, 200, 30), "gulbarg"]); }
  for (let k = 0; k < 12; k++) R.push([petalD(C, C, k * TAU / 12, 14, 70, 15), "markazgul"]); R.push([circD(C, C, 16), "nuqta"]);
  return { R, sample: { fon: "#f6efe0", gardish: "#1f3f8f", gardishgul: "#d4a72c", zamin: "#1fa3a3", barg: "#f6f0e1", gulbarg: "#b3262e", markazgul: "#d4a72c", nuqta: "#1f3f8f" },
    order: ["fon", "zamin", "gardish", "gulbarg", "barg", "gardishgul", "markazgul", "nuqta"] };
}
A.templates = { turunj: tplTurunj, gulbarg: tplGulbarg, lenta: tplLenta, element: tplElement, lagan: tplLagan };
NQ.W.paint = function (el, cfg) {
  const T = A.templates[cfg.template || "turunj"](cfg);
  el.innerHTML = `<div class="split"><div><svg class="art" viewBox="0 0 600 600"><defs>
    <filter id="kundalF_${cfg.template}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/><feSpecularLighting in="b" surfaceScale="4" specularConstant=".75" specularExponent="16" lighting-color="#fff6d8" result="s"><fePointLight x="-150" y="-250" z="260"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0"/></filter>
    <pattern id="targil_${cfg.template}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="8" height="8" fill="none"/><line x1="0" y1="0" x2="0" y2="8" stroke="#fff" stroke-width="2.2" stroke-opacity=".55"/></pattern>
    <pattern id="nuqta_${cfg.template}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.2" fill="#fff8e0" fill-opacity=".9"/></pattern></defs>
    <g class="rgs"></g><g class="ov1" pointer-events="none" style="display:none"></g><g class="ov2" pointer-events="none" style="display:none"></g></svg></div>
   <div class="card"><h3>1. Rangni tanlang</h3><div class="swatches"></div><div class="row">Boşqa rang: <input type="color" value="#7a3b8f"></div>
   <label class="row mt"><input type="checkbox" class="sym" checked> Simmetrik böyaş (bir xil unsurlar birga böyaladi)</label>
   <h3 class="mt">2. Pardozlaş</h3><div class="row">
    <button class="btn ghost" data-p="tahrir">✎ Tahrir (kontur)</button><button class="btn ghost" data-p="oltin">✦ Oltin tahrir</button>
    <button class="btn ghost" data-p="targil">≋ Tarğil</button><button class="btn ghost" data-p="nuqta">∴ Nuqtali pardoz</button><button class="btn ghost" data-p="kundal">◐ Kundal (hajm)</button></div>
   <h3 class="mt">3. Boşqaruv</h3><div class="row"><button class="btn gold" data-a="sample">★ Namunaviy böyaş</button><button class="btn ghost" data-a="undo">↶ Ortga</button>
    <button class="btn red" data-a="clear">✕ Tozalaş</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   <div class="note mt">${cfg.note || "<b>Böyaş tartibi:</b> avval zamin (fon), söng yirik unsurlar, keyin mayda unsurlar böyaladi. Pardoz eng oxirida beriladi."}</div></div></div>`;
  const svg = NQ.$("svg", el), rg = NQ.$(".rgs", el), ov1 = NQ.$(".ov1", el), ov2 = NQ.$(".ov2", el);
  const box = NQ.$(".swatches", el); let cur = COLORS[0][1];
  COLORS.forEach(([n, c], i) => { const d = NQ.h("div", { class: "sw" + (i ? "" : " sel"), title: n }, `<span>${n}</span>`); d.style.background = c; d.onclick = () => { cur = c; NQ.$$(".sw", box).forEach(x => x.classList.remove("sel")); d.classList.add("sel"); }; box.appendChild(d); });
  NQ.$("input[type=color]", el).oninput = e => { cur = e.target.value; NQ.$$(".sw", box).forEach(x => x.classList.remove("sel")); };
  const DEF = "#fbf7ee", all = [];
  T.R.forEach(([d, g, eo, line, tf, k]) => { const p = document.createElementNS(NQ.svgNS, "path"); p.setAttribute("d", d); p.dataset.g = g; if (eo) p.setAttribute("fill-rule", "evenodd");
    k = k || 1; p.dataset.k = k; if (tf) p.setAttribute("transform", tf);
    if (line) { p.dataset.line = 1; p.setAttribute("fill", "none"); p.setAttribute("stroke-width", (g === "poya" ? 14 : 10) / k); p.setAttribute("stroke-linecap", "round"); }
    p.style.cursor = "pointer"; rg.appendChild(p); all.push(p); });
  [ov1, ov2].forEach((ov, k) => all.forEach(p => { if (p.dataset.line) return; const q = p.cloneNode(); q.setAttribute("fill", `url(#${k ? "nuqta" : "targil"}_${cfg.template})`); q.removeAttribute("stroke"); ov.appendChild(q); }));
  let tahrir = false, oltin = false;
  const getC = p => p.dataset.line ? p.getAttribute("stroke") : p.getAttribute("fill");
  const setC = (p, c) => { if (p.dataset.line) p.setAttribute("stroke", c); else p.setAttribute("fill", c); };
  function strokes() { all.forEach(p => { if (p.dataset.line) return; p.setAttribute("stroke", oltin ? "#d4a72c" : tahrir ? "#2b2015" : "#b9ab8c"); p.setAttribute("stroke-width", (oltin ? 2.8 : tahrir ? 1.8 : .8) / (+p.dataset.k || 1)); }); }
  all.forEach(p => setC(p, p.dataset.line ? "#b9ab8c" : DEF)); strokes();
  const hist = [], snap = () => { hist.push(all.map(getC)); if (hist.length > 60) hist.shift(); };
  all.forEach(p => p.addEventListener("click", () => { snap(); const sym = NQ.$(".sym", el).checked; (sym ? all.filter(q => q.dataset.g === p.dataset.g) : [p]).forEach(q => { q.style.transition = "fill .3s,stroke .3s"; setC(q, cur); }); }));
  const tg = (b, on) => { b.classList.toggle("on", on); };
  NQ.$$("[data-p]", el).forEach(b => b.onclick = () => { const k = b.dataset.p;
    if (k === "tahrir") { tahrir = !tahrir; tg(b, tahrir); strokes(); }
    if (k === "oltin") { oltin = !oltin; tg(b, oltin); strokes(); }
    if (k === "targil") { const on = ov1.style.display === "none"; ov1.style.display = on ? "" : "none"; tg(b, on); }
    if (k === "nuqta") { const on = ov2.style.display === "none"; ov2.style.display = on ? "" : "none"; tg(b, on); }
    if (k === "kundal") { const on = !rg.getAttribute("filter"); if (on) rg.setAttribute("filter", `url(#kundalF_${cfg.template})`); else rg.removeAttribute("filter"); tg(b, on); } });
  NQ.$("[data-a=sample]", el).onclick = () => { snap(); const pal = A.palette(cfg.samplePal || "oqsaroy");
    const pool = [pal.bg, pal.star[0], pal.star[1], pal.flower, pal.poly[0], pal.leaf, "#b3262e", "#d4a72c", "#1fa3a3"];
    const groups = [...new Set(all.map(p => p.dataset.g))]; const order = (T.order || []).concat(groups.filter(g => !(T.order || []).includes(g)));
    order.forEach((g, i) => setTimeout(() => all.filter(p => p.dataset.g === g).forEach(p => { p.style.transition = "fill .45s,stroke .45s"; setC(p, (T.sample && T.sample[g]) || pool[i % pool.length]); }), i * 220));
    setTimeout(() => { if (!tahrir) NQ.$("[data-p=tahrir]", el).click(); }, order.length * 220 + 100); };
  NQ.$("[data-a=undo]", el).onclick = () => { const h = hist.pop(); if (h) all.forEach((p, i) => setC(p, h[i])); };
  NQ.$("[data-a=clear]", el).onclick = () => { snap(); all.forEach(p => setC(p, p.dataset.line ? "#b9ab8c" : DEF)); };
  const toCanvas = (size) => new Promise((res, rej) => { const cl = svg.cloneNode(true); cl.setAttribute("xmlns", NQ.svgNS); cl.setAttribute("width", size); cl.setAttribute("height", size);
    const img = new Image(); img.onload = () => { const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, size, size); x.drawImage(img, 0, 0, size, size); res(c); };
    img.onerror = rej; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
  NQ.$("[data-a=png]", el).onclick = () => toCanvas(1200).then(c => NQ.download(c.toDataURL("image/png"), "boyalgan_naqsh.png"));
  NQ.sources.paint = sz => toCanvas(sz || 1024);
  if (cfg.prefill) NQ.$("[data-a=sample]", el).click();
};

/* ================= VIDJET: Mo'yqalam (erkin çiziş, simmetriya) ================= */
NQ.W.brush = function (el, cfg) {
  el.innerHTML = `<div class="split"><div style="position:relative"><canvas class="art" width="900" height="900"></canvas></div><div class="card">
   <div class="ctrl two"><label>Asbob</label><select data-k="tool"><option value="qalam">Qalam (ingiçka, qattiq)</option><option value="moyqalam">Möyqalam (uçli, bosimga sezgir)</option><option value="keng">Keng möyqalam</option><option value="ochirgich">Öçirğiç</option></select></div>
   <div class="ctrl"><label>Qalinlik</label><input type="range" data-k="size" min="1" max="40" value="${cfg.size || 6}"><output></output></div>
   <div class="ctrl"><label>Simmetriya</label><input type="range" data-k="sym" min="1" max="12" value="${cfg.sym || 1}"><output></output></div>
   <label class="row"><input type="checkbox" data-k="mir" ${cfg.mirror ? "checked" : ""}> Oynaviy (közgu) aks</label>
   <label class="row"><input type="checkbox" data-k="guide" checked> Yordamçi çiziqlar va namuna</label>
   <div class="ctrl two"><label>Namuna (iz)</label><select data-k="tpl"><option value="">— yöq —</option>${Object.keys(EL).map(k => `<option value="${k}" ${cfg.template === k ? "selected" : ""}>${EL[k].name}</option>`).join("")}</select></div>
   <h3 class="mt">Rang</h3><div class="swatches"></div>
   <div class="row"><button class="btn ghost" data-a="undo">↶ Ortga</button><button class="btn red" data-a="clear">✕ Tozalaş</button><button class="btn ghost" data-a="png">⬇ PNG</button></div>
   ${cfg.note ? `<div class="note mt">${cfg.note}</div>` : ""}</div></div>`;
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  const ink = document.createElement("canvas"); ink.width = W; ink.height = H; const ic = ink.getContext("2d");
  let col = "#1b1b1b"; const box = NQ.$(".swatches", el);
  [["Qora", "#1b1b1b"]].concat(COLORS).forEach(([n, c], i) => { const d = NQ.h("div", { class: "sw" + (i ? "" : " sel"), title: n }, `<span>${n}</span>`); d.style.background = c; d.onclick = () => { col = c; NQ.$$(".sw", box).forEach(x => x.classList.remove("sel")); d.classList.add("sel"); }; box.appendChild(d); });
  const g = k => NQ.$(`[data-k=${k}]`, el);
  NQ.$$("input[type=range]", el).forEach(r => { const o = r.nextElementSibling; o.textContent = r.value; r.oninput = () => { o.textContent = r.value; comp(); }; });
  ["mir", "guide", "tpl"].forEach(k => g(k).onchange = comp);
  function comp() { ctx.fillStyle = "#fffdf7"; ctx.fillRect(0, 0, W, H);
    if (g("guide").checked) { const n = +g("sym").value; ctx.save(); ctx.strokeStyle = "rgba(120,100,60,.35)"; ctx.setLineDash([8, 8]); ctx.lineWidth = 1.5;
      if (n > 1 || g("mir").checked) for (let k = 0; k < Math.max(1, n); k++) { const a = k * Math.PI / Math.max(1, n); ctx.beginPath(); ctx.moveTo(W / 2 - 600 * Math.cos(a - Math.PI / 2), H / 2 - 600 * Math.sin(a - Math.PI / 2)); ctx.lineTo(W / 2 + 600 * Math.cos(a - Math.PI / 2), H / 2 + 600 * Math.sin(a - Math.PI / 2)); ctx.stroke(); }
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(W / 2, H / 2, 420, 0, TAU); ctx.stroke(); ctx.restore();
      if (g("tpl").value) { ctx.save(); ctx.globalAlpha = .18; A.drawElement(ctx, g("tpl").value, W / 2, H / 2, 640, 0, A.palette("ganch")); ctx.restore(); } }
    ctx.drawImage(ink, 0, 0); }
  const hist = []; let last = null, lastT = 0;
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height, e.pressure || .5]; };
  function seg(a, b, w) { const n = +g("sym").value, mir = g("mir").checked, tool = g("tool").value;
    ic.save(); ic.lineCap = "round"; ic.lineJoin = "round"; ic.strokeStyle = col; ic.globalCompositeOperation = tool === "ochirgich" ? "destination-out" : "source-over";
    if (tool === "keng") ic.globalAlpha = .55;
    for (let k = 0; k < n; k++) for (const m of (mir ? [1, -1] : [1])) { ic.save(); ic.translate(W / 2, H / 2); ic.rotate(k * TAU / n); ic.scale(m, 1); ic.translate(-W / 2, -H / 2);
      ic.lineWidth = w; ic.beginPath(); ic.moveTo(a[0], a[1]); ic.lineTo(b[0], b[1]); ic.stroke(); ic.restore(); }
    ic.restore(); }
  cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); hist.push(ic.getImageData(0, 0, W, H)); if (hist.length > 25) hist.shift(); last = pos(e); lastT = performance.now(); });
  cv.addEventListener("pointermove", e => { if (!last) return; const p = pos(e), t = performance.now(), sz = +g("size").value, tool = g("tool").value;
    const sp = Math.hypot(p[0] - last[0], p[1] - last[1]) / Math.max(1, t - lastT); let w = sz;
    if (tool === "moyqalam") w = Math.max(1, sz * (e.pointerType === "pen" ? p[2] * 1.6 : Math.max(.25, 1.3 - sp * .9)));
    if (tool === "qalam") w = Math.max(1, sz * .5); if (tool === "keng") w = sz * 2.2; if (tool === "ochirgich") w = sz * 2.5;
    seg(last, p, w); last = p; lastT = t; comp(); });
  const up = () => { last = null; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointerleave", up);
  NQ.$("[data-a=undo]", el).onclick = () => { const h = hist.pop(); if (h) { ic.putImageData(h, 0, 0); comp(); } };
  NQ.$("[data-a=clear]", el).onclick = () => { hist.push(ic.getImageData(0, 0, W, H)); ic.clearRect(0, 0, W, H); comp(); };
  NQ.$("[data-a=png]", el).onclick = () => { const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.drawImage(ink, 0, 0); NQ.download(c.toDataURL("image/png"), "chizma.png"); };
  comp(); el._show = comp;
};

/* ================= VIDJET: Rangşunoslik ================= */
function ryb2rgb(r, y, b) { // Gossett–Chen interpolyatsiyasi
  const C = [[1, 1, 1], [1, 1, 0], [1, 0, 0], [1, .5, 0], [.163, .373, .6], [0, .66, .2], [.5, 0, .5], [.2, .094, 0]];
  const L = (a, b, t) => a + (b - a) * t, out = [0, 0, 0];
  for (let i = 0; i < 3; i++) { const x0 = L(C[0][i], C[4][i], b), x1 = L(C[2][i], C[6][i], b), x2 = L(C[3][i], C[7][i], b), x3 = L(C[1][i], C[5][i], b), y0 = L(x0, x1, r), y1 = L(x3, x2, r); out[i] = L(y0, y1, y); }
  return out;
}
const hex = c => "#" + c.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, "0")).join("");
A.hsl = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return hex([f(0), f(8), f(4)]); };
NQ.W.colors = function (el, cfg) {
  const tabs = [["doira", "Rang doirasi"], ["iliq", "Iliq va sovuq"], ["axrom", "Axromatik va xromatik"], ["aral", "Ranglarni aralaştiriş"], ["uygun", "Rang uyğunligi (kolorit)"]];
  el.innerHTML = `<div class="subtabs">${tabs.map(t => `<button data-t="${t[0]}">${t[1]}</button>`).join("")}</div><div class="split"><div class="vis"></div><div class="card side"></div></div>`;
  const vis = NQ.$(".vis", el), side = NQ.$(".side", el);
  const wheel = [["Sariq", [0, 1, 0], "asosiy"], ["Sariq-zarğaldoq", [.25, 1, 0], "murakkab"], ["Zarğaldoq", [.5, 1, 0], "hosila"], ["Qizil-zarğaldoq", [.75, 1, 0], "murakkab"], ["Qizil", [1, 0, 0], "asosiy"], ["Qizil-binafşa", [1, 0, .5], "murakkab"],
    ["Binafşa", [1, 0, 1], "hosila"], ["Kök-binafşa", [.5, 0, 1], "murakkab"], ["Kök", [0, 0, 1], "asosiy"], ["Kök-yaşil", [0, .5, 1], "murakkab"], ["Yaşil", [0, 1, 1], "hosila"], ["Sariq-yaşil", [0, 1, .5], "murakkab"]];
  const wc = wheel.map(w => hex(ryb2rgb(...w[1])));
  const warm = i => i <= 5;
  function wheelSVG(hl) { let s = ""; for (let i = 0; i < 12; i++) { const a0 = (i - .5) * TAU / 12 - Math.PI / 2, a1 = (i + .5) * TAU / 12 - Math.PI / 2, R = 240, r = 110;
      const p = (rr, a) => f2(300 + rr * Math.cos(a)) + " " + f2(300 + rr * Math.sin(a));
      const op = hl ? (hl(i) ? 1 : .18) : 1;
      s += `<path data-i="${i}" d="M${p(r, a0)} L${p(R, a0)} A${R} ${R} 0 0 1 ${p(R, a1)} L${p(r, a1)} A${r} ${r} 0 0 0 ${p(r, a0)}Z" fill="${wc[i]}" stroke="#fff" stroke-width="3" opacity="${op}" style="cursor:pointer;transition:opacity .4s"/>`; }
    return `<svg class="art" viewBox="0 0 600 600"><rect width="600" height="600" fill="#fffdf7"/>${s}<circle cx="300" cy="300" r="100" fill="#fffdf7"/><text x="300" y="306" text-anchor="middle" font-size="22" font-weight="700" fill="#123a6b" class="lbl">Rang doirasi</text></svg>`; }
  function naqshCanvas(pal, mode) { const c = document.createElement("canvas"); c.width = c.height = 600; c.className = "art"; A.render(c.getContext("2d"), 600, 600, mode || "gulli", { pal, tiling: "488", size: 80, theta: 67.5, band: 6 }); return c; }
  const show = {
    doira() { vis.innerHTML = wheelSVG(); side.innerHTML = `<h3>12 qismli rang doirasi</h3><p class="big">Sektorni bosing.</p><div class="info big"></div><div class="row mt"><button class="btn ghost" data-h="asosiy">Asosiy</button><button class="btn ghost" data-h="hosila">Hosila</button><button class="btn ghost" data-h="murakkab">Murakkab</button><button class="btn ghost" data-h="">Hammasi</button></div>`;
      const svg = NQ.$("svg", vis); NQ.$$("path", svg).forEach(p => p.onclick = () => { const i = +p.dataset.i, w = wheel[i], op = wheel[(i + 6) % 12];
        NQ.$(".lbl", svg).textContent = w[0]; NQ.$(".info", side).innerHTML = `<b>${w[0]}</b> — ${w[2]} rang.<br>${warm(i) ? "Iliq" : "Sovuq"} ranglar guruhiga kiradi.<br>Qaramaqarşi (komplementar) rangi: <b>${op[0]}</b> <span style="display:inline-block;width:18px;height:18px;border-radius:4px;vertical-align:middle;background:${wc[(i + 6) % 12]}"></span>`; });
      NQ.$$("[data-h]", side).forEach(b => b.onclick = () => { const k = b.dataset.h; NQ.$$("path", svg).forEach(p => p.setAttribute("opacity", !k || wheel[+p.dataset.i][2] === k ? 1 : .15)); }); },
    iliq() { vis.innerHTML = `<div class="grid g2"></div>`; const gg = NQ.$(".grid", vis);
      const pw = Object.assign({}, PAL.fargona, { bg: "#8a2a1c", poly: ["#a8432a", "#963a22"], star: ["#f7e3b5", "#e39b1b"], flower: "#e3b51b" });
      const pc = Object.assign({}, PAL.samarqand, { bg: "#173d6b", poly: ["#1f5f8b", "#1a5278"], star: ["#e6f2f2", "#5fb3b3"], flower: "#4b2a6b", center: "#9fd3d3", stem: "#9fd3d3" });
      [["Iliq kolorit", pw], ["Sovuq kolorit", pc]].forEach(([t, p]) => { const d = NQ.h("div", null, `<h3>${t}</h3>`); d.appendChild(naqshCanvas(p)); gg.appendChild(d); });
      side.innerHTML = `<h3>Iliq va sovuq ranglar</h3><p class="big"><b>Iliq ranglar</b> (sariq, zarğaldoq, qizil) — quyoş, olov rangi; yaqinlaşib, oldinga çiqib körinadi.</p><p class="big"><b>Sovuq ranglar</b> (kök, firuza, binafşa) — suv, osmon rangi; uzoqlaşib, çuqurlaşib körinadi.</p><div class="note">Bir xil naqş ikki xil koloritda butunlay boşqa kayfiyat beradi.</div>`;
      vis.insertAdjacentHTML("beforeend", `<div class="mt">${wheelSVG(warm).replace('class="art"', 'class="art" style="max-width:300px;display:inline-block"')}${wheelSVG(i => !warm(i)).replace('class="art"', 'class="art" style="max-width:300px;display:inline-block;margin-left:12px"')}</div>`); },
    axrom() { vis.innerHTML = `<div class="sc"></div><div class="mt grid g2"><div><h3>Rangli</h3></div><div><h3>Faqat ton (axromatik)</h3></div></div>`;
      let sc = '<div style="display:flex;border-radius:10px;overflow:hidden;height:70px">'; for (let i = 0; i <= 10; i++) { const v = Math.round(255 * i / 10); sc += `<div style="flex:1;background:rgb(${v},${v},${v})"></div>`; } NQ.$(".sc", vis).innerHTML = sc + "</div>";
      const c1 = naqshCanvas("oqsaroy"), c2 = naqshCanvas("oqsaroy"); c2.style.filter = "grayscale(1)"; NQ.$$(".grid>div", vis)[0].appendChild(c1); NQ.$$(".grid>div", vis)[1].appendChild(c2);
      side.innerHTML = `<h3>Axromatik va xromatik ranglar</h3><p class="big"><b>Axromatik</b> — oq, qora va kulrangning barça tuslari; ularda faqat <b>ton (oçlik)</b> bor.</p><p class="big"><b>Xromatik</b> — rang tusi (qizil, kök, sariq…) bölgan barça ranglar.</p><div class="note">Naqşni kulrangda körib, ton muvozanati (töq-oç almaşinuvi) töğriligini tekşiriş mumkin.</div>`; },
    aral() { const paints = [["Sariq", [0, 1, 0]], ["Qizil", [1, 0, 0]], ["Kök", [0, 0, 1]], ["Oq", [0, 0, 0]], ["Qora", [1, 1, 1]], ["Zarğaldoq", [.5, 1, 0]], ["Yaşil", [0, 1, 1]]];
      const opt = paints.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("");
      vis.innerHTML = `<svg class="art" viewBox="0 0 600 420"><rect width="600" height="420" fill="#fffdf7"/><circle class="a" cx="170" cy="150" r="110"/><circle class="b" cx="430" cy="150" r="110"/><path d="M270 150 L330 150" stroke="#999" stroke-width="3"/><circle class="m" cx="300" cy="310" r="95" stroke="#fff" stroke-width="6"/><text x="300" y="412" text-anchor="middle" font-size="20" font-weight="700" fill="#123a6b" class="t"></text></svg>`;
      side.innerHTML = `<h3>Böyoqlarni aralaştiriş</h3><div class="ctrl two"><label>1-böyoq</label><select class="s1">${opt}</select></div><div class="ctrl two"><label>2-böyoq</label><select class="s2">${opt}</select></div>
        <div class="ctrl"><label>Nisbat</label><input type="range" class="r" min="0" max="100" value="50"><output>50%</output></div><div class="note">Böyoqlar aralaşganda rang <b>subtraktiv</b> usulda hosil böladi: sariq + kök = yaşil, qizil + sariq = zarğaldoq, qizil + kök = binafşa. Oq qöşilsa — oçaradi, qora qöşilsa — töqlaşadi.</div>`;
      const s1 = NQ.$(".s1", side), s2 = NQ.$(".s2", side), r = NQ.$(".r", side); s2.value = 2;
      const upd = () => { const a = paints[s1.value][1], b = paints[s2.value][1], t = r.value / 100, m = a.map((v, i) => v * (1 - t) + b[i] * t);
        const svg = NQ.$("svg", vis); NQ.$(".a", svg).setAttribute("fill", hex(ryb2rgb(...a))); NQ.$(".b", svg).setAttribute("fill", hex(ryb2rgb(...b))); NQ.$(".m", svg).setAttribute("fill", hex(ryb2rgb(...m)));
        NQ.$(".t", svg).textContent = `${paints[s1.value][0]} ${100 - r.value}% + ${paints[s2.value][0]} ${r.value}%`; r.nextElementSibling.textContent = r.value + "%"; };
      [s1, s2, r].forEach(x => x.oninput = upd); upd(); },
    uygun() { vis.innerHTML = `<div class="nq"></div><div class="row mt chips"></div>`;
      side.innerHTML = `<h3>Rang uyğunligi</h3><div class="ctrl"><label>Asosiy rang tusi</label><input type="range" class="h" min="0" max="359" value="215"><output></output></div>
       <div class="ctrl two"><label>Sxema</label><select class="s"><option value="mono">Monoxrom (bir tus)</option><option value="komp">Komplementar (qaramaqarşi)</option><option value="analog">Analog (qöşni)</option><option value="triada">Triada (uçlik)</option></select></div>
       <div class="note">Tanlangan sxema darhol naqşga qöllanadi. An'anaviy naqqoşlikda kök–oltin (komplementarga yaqin) va kök–firuza–yaşil (analog) uyğunliklari keng tarqalgan.</div>`;
      const h = NQ.$(".h", side), s = NQ.$(".s", side);
      const upd = () => { const H = +h.value; h.nextElementSibling.textContent = H + "°"; let hs;
        if (s.value === "mono") hs = [H, H, H, H, H]; else if (s.value === "komp") hs = [H, H, (H + 180) % 360, (H + 180) % 360, H]; else if (s.value === "analog") hs = [H, (H + 30) % 360, (H + 330) % 360, (H + 30) % 360, H]; else hs = [H, (H + 120) % 360, (H + 240) % 360, (H + 120) % 360, H];
        const c = [A.hsl(hs[0], 60, 26), A.hsl(hs[1], 55, 40), A.hsl(hs[2], 70, 55), A.hsl(hs[3], 45, 88), A.hsl(hs[4], 50, 15)];
        const pal = { bg: c[0], poly: [c[1], A.hsl(hs[1], 55, 34)], star: [c[3], c[2]], band: "#fffaf0", outline: c[4], stem: c[2], leaf: c[3], leafLine: c[4], flower: c[2], center: c[3] };
        const nq = NQ.$(".nq", vis); nq.innerHTML = ""; nq.appendChild(naqshCanvas(pal));
        NQ.$(".chips", vis).innerHTML = c.map(x => `<span style="display:inline-block;width:56px;height:36px;border-radius:8px;background:${x};box-shadow:0 0 0 1px #ccc"></span>`).join(""); };
      h.oninput = upd; s.onchange = upd; upd(); }
  };
  NQ.$$(".subtabs button", el).forEach(b => b.onclick = () => { NQ.$$(".subtabs button", el).forEach(x => x.classList.toggle("active", x === b)); show[b.dataset.t](); });
  NQ.$(".subtabs button", el).click();
};

/* ================= VIDJET: Pardoz turlari ================= */
NQ.W.pardoz = function (el, cfg) {
  const kinds = [["toza", "Pardozsiz"], ["siyoh", "Siyoh qalam (tahrir)"], ["targil", "Tarğil"], ["taroq", "Taroq"], ["obi", "Obi tortiş"], ["oltin", "Oltin pardoz"]];
  el.innerHTML = `<div class="split"><div><canvas class="art" width="800" height="800"></canvas></div><div class="card"><h3>Pardoz turlari</h3><div class="row">${kinds.map(k => `<button class="btn ghost" data-k="${k[0]}">${k[1]}</button>`).join("")}</div>
    <div class="info big mt"></div><div class="ctrl two mt"><label>Unsur</label><select class="el">${["shobarg", "barg", "kurtak", "qoshbarg", "madohil"].map(k => `<option value="${k}">${EL[k].name}</option>`).join("")}</select></div></div></div>`;
  const D = cfg.desc || {};
  const cv = NQ.$("canvas", el), ctx = cv.getContext("2d"); let kind = "toza", stop = null;
  const P = { leaf: "#2e7d4f", flower: "#b3262e", center: "#d4a72c", frame: "#1f3f8f", stem: "#d4a72c", band: "#f6f0e1", leafLine: "#2e7d4f", outline: "#123" };
  function base(id) { ctx.fillStyle = "#1f3f8f"; ctx.fillRect(0, 0, 800, 800); const flat = Object.assign({}, P); A.drawElement(ctx, id, 400, 400, 720, 0, flat); }
  function draw(p) { const id = NQ.$(".el", el).value; base(id); const parts = EL[id].parts(); const k = 720 / 200;
    ctx.save(); ctx.translate(400, 400); ctx.scale(k, k); ctx.translate(-100, -100);
    parts.forEach(pt => { if (pt.r === "vein") return; const path = new Path2D(pt.d); ctx.save(); ctx.clip(path);
      if (kind === "targil") { ctx.globalAlpha = .55; for (let i = 0; i < 40 * p; i++) { ctx.strokeStyle = i % 2 ? "#f6f0e1" : "#0b3d24"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-20 + i * 7, 210); ctx.lineTo(-20 + i * 7 + 40, -10); ctx.stroke(); } }
      if (kind === "taroq") { ctx.globalAlpha = .8; ctx.strokeStyle = "#f6f0e1"; ctx.lineWidth = .9; for (let i = 0; i < 26 * p; i++) { ctx.beginPath(); ctx.moveTo(100, 196); ctx.quadraticCurveTo(100 + (i - 13) * 6, 110, 100 + (i - 13) * 9, 0); ctx.stroke(); } }
      if (kind === "obi") { const g = ctx.createLinearGradient(0, 200 * (1 - p), 0, 0); g.addColorStop(0, "rgba(255,255,240,0)"); g.addColorStop(1, "rgba(255,255,240,.55)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 200, 200);
        const g2 = ctx.createRadialGradient(100, 120, 5, 100, 120, 110); g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, `rgba(0,30,10,${.45 * p})`); ctx.fillStyle = g2; ctx.fillRect(0, 0, 200, 200); }
      ctx.restore(); });
    if (kind === "siyoh" || kind === "oltin" || kind === "targil" || kind === "taroq" || kind === "obi") {
      ctx.setLineDash([2000]); ctx.lineDashOffset = 2000 * (1 - (kind === "siyoh" || kind === "oltin" ? p : 1));
      parts.forEach(pt => { const path = new Path2D(pt.d); ctx.strokeStyle = kind === "oltin" ? "#e8c25a" : "#111"; ctx.lineWidth = kind === "oltin" ? 2.4 : 1.6; ctx.stroke(path); });
      ctx.setLineDash([]); }
    if (kind === "oltin" && p >= 1) { parts.forEach(pt => { if (pt.r !== "vein") return; ctx.strokeStyle = "#e8c25a"; ctx.lineWidth = 1.4; ctx.stroke(new Path2D(pt.d)); }); }
    ctx.restore(); }
  NQ.$$("[data-k]", el).forEach(b => b.onclick = () => { kind = b.dataset.k; NQ.$$("[data-k]", el).forEach(x => x.classList.toggle("on", x === b)); NQ.$(".info", el).innerHTML = D[kind] || ""; if (stop) stop(); stop = NQ.animate(1600, p => draw(NQ.ease(p))); });
  NQ.$(".el", el).onchange = () => draw(1);
  NQ.$("[data-k=toza]", el).click();
};
})();
