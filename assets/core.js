/* Amaliy bezak san'ati — interaktiv işlanmalar: umumiy dvigatel */
"use strict";
window.NQ = window.NQ || {};
NQ.W = NQ.W || {};
NQ.$ = (s, r) => (r || document).querySelector(s);
NQ.$$ = (s, r) => [...(r || document).querySelectorAll(s)];
NQ.h = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };
NQ.svgNS = "http://www.w3.org/2000/svg";
NQ.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
NQ.download = (url, name) => { const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); };
NQ.animate = (dur, fn, done) => { const t0 = performance.now(); let stop = false; function f(t) { if (stop) return; const p = Math.min(1, (t - t0) / dur); fn(p); if (p < 1) requestAnimationFrame(f); else done && done(); } requestAnimationFrame(f); return () => { stop = true; }; };
NQ.ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

/* ---------- Bölimlar (tablar) ---------- */
NQ.showTab = function (id) {
  NQ.$$("section.tab").forEach(s => s.classList.toggle("active", s.id === id));
  NQ.$$("nav.tabs button[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === id));
  const sec = document.getElementById(id);
  if (sec) NQ.$$("[data-w]", sec).forEach(el => { if (!el._inited) NQ.initWidget(el); if (el._show) el._show(); });
  try { history.replaceState(null, "", "#" + id); } catch (e) { }
  window.scrollTo({ top: 0, behavior: "smooth" });
};
NQ.initWidget = function (el) {
  if (el._inited) return; el._inited = true;
  const name = el.dataset.w, f = NQ.W[name];
  let cfg = {}; try { cfg = JSON.parse(el.dataset.cfg || "{}"); } catch (e) { console.error("cfg", name, e); }
  if (!f) { el.innerHTML = '<div class="warn">Vidjet topilmadi: ' + name + '</div>'; return; }
  try { f(el, cfg); } catch (e) { console.error(name, e); el.innerHTML = '<div class="warn">Xatolik: ' + e.message + '</div>'; }
};
NQ.boot = function () {
  NQ.$$("nav.tabs button[data-tab]").forEach(b => b.onclick = () => NQ.showTab(b.dataset.tab));
  const fs = NQ.$("#fsBtn"); if (fs) fs.onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
  const first = NQ.$("section.tab.active") || NQ.$("section.tab");
  const hash = location.hash.slice(1);
  NQ.showTab(hash && document.getElementById(hash) ? hash : first.id);
  // faol bölimdagi vidjetlardan tashqari qolganlarini sekin işga tuşiramiz
  setTimeout(() => NQ.$$("[data-w]:not([data-lazy])").forEach(el => NQ.initWidget(el)), 300);
  document.addEventListener("keydown", e => {
    if (e.target.matches("input,textarea,select")) return;
    const sec = NQ.$("section.tab.active"); if (!sec) return;
    const st = NQ.$("[data-w=stepper]", sec); if (!st || !st._go) return;
    if (e.key === "ArrowRight") st._go(1); if (e.key === "ArrowLeft") st._go(-1);
  });
};
document.addEventListener("DOMContentLoaded", () => NQ.boot());

/* ---------- Bosqiçma-bosqiç SVG animatsiya ---------- */
NQ.W.stepper = function (el, cfg) {
  el.innerHTML = `<div class="split"><div><svg class="art" viewBox="${cfg.vb || "0 0 600 600"}"></svg>${cfg.caption ? '<p class="legend">' + cfg.caption + '</p>' : ''}</div>
   <div class="card"><div class="row" style="margin-bottom:10px">
   <button class="btn ghost" data-a="prev">◀ Oldingi</button><button class="btn" data-a="next">Keyingi ▶</button>
   <button class="btn gold" data-a="play">▶ Avto</button><button class="btn ghost" data-a="reset">↺ Boşidan</button></div>
   <ol class="steps"></ol><p class="legend">Klaviatura: <span class="kbd">→</span> keyingi, <span class="kbd">←</span> oldingi bosqiç.</p>${cfg.note ? '<div class="note">' + cfg.note + '</div>' : ''}</div></div>`;
  const svg = NQ.$("svg", el), list = NQ.$("ol", el);
  if (cfg.bg !== false) svg.insertAdjacentHTML("beforeend", `<rect x="-2000" y="-2000" width="5000" height="5000" fill="${cfg.bg || "#fffdf7"}"/>`);
  if (cfg.base) svg.insertAdjacentHTML("beforeend", `<g>${cfg.base}</g>`);
  const groups = cfg.steps.map((s, i) => { const g = document.createElementNS(NQ.svgNS, "g"); g.innerHTML = s.svg || ""; g.style.opacity = 0; svg.appendChild(g); return g; });
  cfg.steps.forEach((s, i) => { const li = NQ.h("li", null, s.t); li.onclick = () => go(i + 1, true); list.appendChild(li); });
  let cur = 0, timer = null;
  const fadeAt = cfg.fade || 1e9;
  function go(n, anim) {
    n = Math.max(0, Math.min(groups.length, n));
    groups.forEach((g, i) => {
      const st = i + 1, show = cfg.solo ? st === n : st <= n;
      NQ.$$(".guide", g).forEach(x => { x.style.transition = "opacity .6s"; x.style.opacity = (n >= fadeAt && st < fadeAt) ? 0.22 : 1; });
      if (!show) { g.style.transition = "none"; g.style.opacity = 0; return; }
      if (anim && st > cur) {
        g.style.transition = "none"; g.style.opacity = 0; g.getBoundingClientRect(); g.style.transition = "opacity .5s"; g.style.opacity = 1;
        NQ.$$(".dr", g).forEach((s, k) => {
          let L = 400; try { L = s.getTotalLength(); } catch (e) { }
          const keep = s.getAttribute("stroke-dasharray") || "";
          s.style.transition = "none"; s.style.strokeDasharray = L; s.style.strokeDashoffset = L; s.getBoundingClientRect();
          const del = Math.min(k * 0.07, 1.4);
          s.style.transition = `stroke-dashoffset ${cfg.dur || 1.2}s ease ${del}s`; s.style.strokeDashoffset = 0;
          setTimeout(() => { s.style.strokeDasharray = keep; s.style.strokeDashoffset = ""; }, ((cfg.dur || 1.2) + del) * 1000 + 60);
        });
        NQ.$$(".pop", g).forEach((s, k) => { const op = s.getAttribute("opacity") || 1; s.style.transition = "none"; s.style.opacity = 0; s.getBoundingClientRect(); s.style.transition = `opacity .6s ease ${0.3 + k * 0.05}s`; s.style.opacity = op; });
      } else { g.style.transition = "opacity .3s"; g.style.opacity = 1; }
    });
    cur = n;
    [...list.children].forEach((li, i) => { li.classList.toggle("done", i < n - 1); li.classList.toggle("cur", i === n - 1); });
  }
  const play = NQ.$("[data-a=play]", el);
  const stop = () => { clearInterval(timer); timer = null; play.textContent = "▶ Avto"; };
  NQ.$("[data-a=next]", el).onclick = () => go(cur + 1, true);
  NQ.$("[data-a=prev]", el).onclick = () => go(cur - 1, false);
  NQ.$("[data-a=reset]", el).onclick = () => { stop(); go(0, false); };
  play.onclick = () => { if (timer) { stop(); return; } if (cur >= groups.length) go(0, false); play.textContent = "⏸ Pauza"; timer = setInterval(() => { if (cur >= groups.length) stop(); else go(cur + 1, true); }, cfg.interval || 2300); };
  el._go = d => d > 0 ? go(cur + 1, true) : go(cur - 1, false);
  go(cfg.start || 0, false);
};

/* ---------- Test ---------- */
NQ.W.quiz = function (el, cfg) {
  el.innerHTML = `<div class="split"><div class="qs"></div><div class="card" style="position:sticky;top:70px"><h3>Natija</h3><div class="score"></div><div class="grade"></div>
    <div class="prog" style="margin:10px 0"><i></i></div><div class="row" style="justify-content:center"><button class="btn ghost">↺ Qayta yeçiş</button></div></div></div>`;
  const box = NQ.$(".qs", el), Q = cfg.q; let score = 0, done = 0;
  function upd() { NQ.$(".score", el).textContent = score + " / " + Q.length; NQ.$(".prog i", el).style.width = (done / Q.length * 100) + "%";
    const g = NQ.$(".grade", el); if (done < Q.length) g.textContent = `Javob berildi: ${done} / ${Q.length}`;
    else { const p = score / Q.length * 100; g.textContent = p >= 86 ? "A'lo! «5»" : p >= 71 ? "Yaxşi «4»" : p >= 55 ? "Qoniqarli «3»" : "Takrorlaş kerak «2»"; } }
  function render() {
    box.innerHTML = ""; score = 0; done = 0;
    Q.forEach(([q, opts, ok, exp], i) => {
      const d = NQ.h("div", { class: "card q" }, `<b>${i + 1}. ${q}</b><div class="opts"></div><div class="exp">✔ ${exp || ""}</div>`);
      const o = NQ.$(".opts", d);
      const order = cfg.shuffle === false ? opts.map((_, j) => j) : NQ.shuffle(opts.map((_, j) => j));
      order.forEach((j, n) => { const b = NQ.h("button", { class: "opt" }); b.textContent = String.fromCharCode(65 + n) + ") " + opts[j]; b.dataset.j = j;
        b.onclick = () => { if (d.classList.contains("answered")) return; d.classList.add("answered"); done++;
          if (j === ok) { b.classList.add("ok"); score++; } else { b.classList.add("bad"); NQ.$$("button", o).find(x => +x.dataset.j === ok).classList.add("ok"); } upd(); };
        o.appendChild(b); });
      box.appendChild(d);
    }); upd();
  }
  NQ.$(".card .btn", el).onclick = render; render();
};

/* ---------- Baholaş mezonlari ---------- */
NQ.W.rubric = function (el, cfg) {
  el.innerHTML = `<div class="rb"></div><div class="score">0</div><div class="grade">—</div><p class="legend" style="text-align:center">86–100: «5» (a'lo) · 71–85: «4» (yaxşi) · 55–70: «3» (qoniqarli) · 0–54: «2»</p>`;
  const rb = NQ.$(".rb", el);
  cfg.items.forEach(([n, m]) => { const d = NQ.h("div", { class: "ctrl" }); d.style.gridTemplateColumns = "1fr 120px 44px";
    d.innerHTML = `<label>${n} <span class="legend">(${m})</span></label><input type="range" min="0" max="${m}" value="0"><output>0</output>`; rb.appendChild(d); });
  const upd = () => { let s = 0; NQ.$$("input", rb).forEach(r => { s += +r.value; r.nextElementSibling.textContent = r.value; });
    NQ.$(".score", el).textContent = s + " ball";
    const g = NQ.$(".grade", el); g.textContent = s >= 86 ? "«5» — a'lo" : s >= 71 ? "«4» — yaxşi" : s >= 55 ? "«3» — qoniqarli" : "«2» — qoniqarsiz";
    g.style.color = s >= 86 ? "#2e8b57" : s >= 71 ? "#1d4e89" : s >= 55 ? "#b07a12" : "#a8432a"; };
  rb.addEventListener("input", upd); upd();
};

/* ---------- Taymer ---------- */
NQ.W.timer = function (el, cfg) {
  const opts = cfg.opts || [cfg.min || 40, 30, 20, 10, 5];
  el.innerHTML = `<div class="timer">00:00</div><div class="row" style="justify-content:center;margin-top:6px"><button class="btn gold">▶ Boşlaş</button><button class="btn ghost">↺ Qayta</button>
    <select style="width:auto">${[...new Set(opts)].map(m => `<option value="${m}">${m} daq</option>`).join("")}</select></div>`;
  const t = NQ.$(".timer", el), [b1, b2] = NQ.$$("button", el), sel = NQ.$("select", el); let left = (cfg.min || 40) * 60, iv = null;
  const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const draw = () => { t.textContent = fmt(left); t.classList.toggle("low", left <= 300); };
  b1.onclick = () => { if (iv) { clearInterval(iv); iv = null; b1.textContent = "▶ Davom"; return; } b1.textContent = "⏸ Pauza";
    iv = setInterval(() => { left--; draw(); if (left <= 0) { clearInterval(iv); iv = null; b1.textContent = "▶ Boşlaş"; t.textContent = "Vaqt tugadi!"; } }, 1000); };
  const reset = () => { clearInterval(iv); iv = null; left = +sel.value * 60; b1.textContent = "▶ Boşlaş"; draw(); };
  b2.onclick = reset; sel.onchange = reset; draw();
};

/* ---------- Topşiriq variantlari ---------- */
NQ.W.variants = function (el, cfg) {
  el.innerHTML = `<div class="subtabs">${cfg.v.map((v, i) => `<button data-i="${i}">${i + 1}-variant</button>`).join("")}</div><div class="vb"></div>`;
  const body = NQ.$(".vb", el);
  function show(i) { const v = cfg.v[i];
    body.innerHTML = `<p class="big" style="margin:4px 0"><b>${v.t}</b>${v.f ? ` · <span class="pill">${v.f}</span>` : ""}</p>
      <ul class="check" style="padding:0">${v.s.map((s, k) => `<li><label><input type="checkbox"> ${k + 1}. ${s}</label></li>`).join("")}</ul>${v.n ? `<div class="note">${v.n}</div>` : ""}`;
    NQ.$$(".subtabs button", el).forEach(b => b.classList.toggle("active", +b.dataset.i === i)); }
  NQ.$$(".subtabs button", el).forEach(b => b.onclick = () => show(+b.dataset.i)); show(0);
};

/* ---------- Nazorat ro'yxati ---------- */
NQ.W.checklist = function (el, cfg) {
  el.innerHTML = `<div class="prog" style="margin-bottom:8px"><i></i></div><ul class="check" style="padding:0">${cfg.items.map(s => `<li><label><input type="checkbox"> ${s}</label></li>`).join("")}</ul><div class="legend cnt"></div>`;
  const upd = () => { const c = NQ.$$("input", el), k = c.filter(x => x.checked).length; NQ.$(".prog i", el).style.width = (k / c.length * 100) + "%"; NQ.$(".cnt", el).textContent = `Bajarildi: ${k} / ${c.length}`; };
  el.addEventListener("change", upd); upd();
};

/* ---------- Moslaştiriş öyini ---------- */
NQ.W.match = function (el, cfg) {
  el.innerHTML = `<p class="legend">${cfg.hint || "Çapdagi tuşunçani, söng öngdagi mos javobni bosing."}</p><div class="match"><div class="L" style="display:grid;gap:8px"></div><div class="R" style="display:grid;gap:8px"></div></div>
    <div class="row" style="margin-top:10px"><b class="res"></b><span class="sp" style="flex:1"></span><button class="btn ghost">↺ Qayta</button></div>`;
  function render() {
    const L = NQ.$(".L", el), R = NQ.$(".R", el); L.innerHTML = R.innerHTML = ""; let sel = null, ok = 0, err = 0;
    const upd = () => NQ.$(".res", el).textContent = `Töğri: ${ok} / ${cfg.pairs.length} · Xato: ${err}` + (ok === cfg.pairs.length ? " — Barakalla! 🎉" : "");
    NQ.shuffle(cfg.pairs.map((p, i) => i)).forEach(i => { const b = NQ.h("button", null, cfg.pairs[i][0]); b.dataset.i = i; b.onclick = () => { if (b.classList.contains("ok")) return; NQ.$$("button", L).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); sel = b; }; L.appendChild(b); });
    NQ.shuffle(cfg.pairs.map((p, i) => i)).forEach(i => { const b = NQ.h("button", null, cfg.pairs[i][1]); b.dataset.i = i; b.onclick = () => { if (!sel || b.classList.contains("ok")) return;
      if (sel.dataset.i === b.dataset.i) { sel.classList.remove("sel"); sel.classList.add("ok"); b.classList.add("ok"); ok++; sel = null; } else { err++; b.classList.remove("bad"); void b.offsetWidth; b.classList.add("bad"); } upd(); }; R.appendChild(b); });
    upd();
  }
  NQ.$(".row .btn", el).onclick = render; render();
};

/* ---------- Kartalar (galereya + oyna) ---------- */
NQ.modal = function (title, html) {
  let m = NQ.$("#nqModal");
  if (!m) { m = NQ.h("div", { class: "modal", id: "nqModal" }, `<div class="box"><button class="x">✕</button><div class="c"></div></div>`); document.body.appendChild(m);
    m.onclick = e => { if (e.target === m || e.target.classList.contains("x")) m.classList.remove("open"); }; }
  NQ.$(".c", m).innerHTML = `<h3>${title}</h3>${html}`; m.classList.add("open");
};
NQ.W.cards = function (el, cfg) {
  el.innerHTML = `<div class="tiles">${cfg.items.map((c, i) => `<div class="tile" data-i="${i}"><div class="ic">${c.ic || "◆"}</div><b>${c.t}</b>${c.sub ? `<small>${c.sub}</small>` : ""}</div>`).join("")}</div>`;
  NQ.$$(".tile", el).forEach(t => t.onclick = () => { const c = cfg.items[+t.dataset.i]; NQ.$$(".tile", el).forEach(x => x.classList.remove("sel")); t.classList.add("sel");
    NQ.modal((c.ic ? c.ic + " " : "") + c.t, `<p class="big">${c.body}</p>${c.extra || ""}`); });
};

/* ---------- Vaqt çiziği ---------- */
NQ.W.timeline = function (el, cfg) {
  el.innerHTML = `<div class="tl">${cfg.items.map((x, i) => `<div class="it" data-i="${i}"><b>${x.y}</b><div class="dt"></div><span>${x.t}</span></div>`).join("")}</div>
   <div class="card mt tlb" style="min-height:110px"></div><div class="row mt"><button class="btn ghost" data-a="p">◀</button><button class="btn gold" data-a="a">▶ Avto</button><button class="btn ghost" data-a="n">▶</button></div>`;
  let cur = 0, iv = null; const its = NQ.$$(".it", el), body = NQ.$(".tlb", el);
  function show(i) { cur = (i + its.length) % its.length; its.forEach((x, k) => x.classList.toggle("sel", k === cur)); const x = cfg.items[cur];
    body.innerHTML = `<h3 style="margin:0 0 6px">${x.y} — ${x.t}</h3><p class="big" style="margin:0">${x.b}</p>`; its[cur].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }
  its.forEach(x => x.onclick = () => show(+x.dataset.i));
  NQ.$("[data-a=p]", el).onclick = () => show(cur - 1); NQ.$("[data-a=n]", el).onclick = () => show(cur + 1);
  const a = NQ.$("[data-a=a]", el); a.onclick = () => { if (iv) { clearInterval(iv); iv = null; a.textContent = "▶ Avto"; return; } a.textContent = "⏸ Pauza"; iv = setInterval(() => show(cur + 1), 3500); };
  show(0);
};

/* ---------- Faol nuqtalar (sahna ustida) ---------- */
NQ.W.hotspots = function (el, cfg) {
  const find = cfg.mode === "find";
  el.innerHTML = `<div class="split"><div><svg class="art" viewBox="${cfg.vb || "0 0 800 560"}">${cfg.svg}</svg></div><div class="card"><h3>${cfg.title || ""}</h3>
    ${find ? `<div class="prog"><i></i></div><p class="cnt big"></p>` : ""}<div class="info big">${cfg.hint || "Sahnadagi belgilangan nuqtalarni bosing."}</div></div></div>`;
  const svg = NQ.$("svg", el); let found = 0;
  cfg.spots.forEach((s, i) => {
    const g = document.createElementNS(NQ.svgNS, "g"); g.setAttribute("class", "hs");
    g.innerHTML = `<circle class="ring" cx="${s.x}" cy="${s.y}" r="${s.r || 22}" ${find ? 'style="opacity:0"' : ''}/>` + (find ? "" : `<text x="${s.x}" y="${s.y + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#0b2546">${i + 1}</text>`);
    g.onclick = () => { NQ.$(".info", el).innerHTML = `<b>${s.t}</b><br>${s.b}`;
      if (find && !g.classList.contains("found")) { g.classList.add("found"); NQ.$("circle", g).style.opacity = 1; found++; upd(); } else if (!find) { NQ.$$(".hs", svg).forEach(x => x.classList.remove("found")); g.classList.add("found"); } };
    svg.appendChild(g);
  });
  function upd() { if (!find) return; NQ.$(".prog i", el).style.width = (found / cfg.spots.length * 100) + "%"; NQ.$(".cnt", el).textContent = `Topildi: ${found} / ${cfg.spots.length}` + (found === cfg.spots.length ? " — barça xavflar aniqlandi! ✔" : ""); }
  upd();
};

/* ---------- Taqqoslaş jadvali / oddiy HTML ---------- */
NQ.W.html = function (el, cfg) { el.innerHTML = cfg.html || ""; };
