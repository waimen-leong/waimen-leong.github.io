/* =====================================================================
   main.js — builds the page from the PORTFOLIO object in data.js.
   You don't need to edit this to change your content.

   How it works (big picture):
     1. data.js runs first and creates a global object called PORTFOLIO.
     2. This file reads PORTFOLIO and turns each piece into HTML.
     3. It inserts that HTML into the empty containers in index.html
        (found by their id, e.g. document.getElementById("project-list")).
   ===================================================================== */

(function () {
  const P = PORTFOLIO;

  // Turns text into safe HTML (so a "<" in your text doesn't break the page)
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const $ = (id) => document.getElementById(id);

  const CATEGORY_LABEL = { engine: "Engine", gameplay: "Gameplay", graphics: "Graphics", software: "Software" };

  /* ---------- 1. Top section ---------- */
  document.title = `${P.name} | ${P.role}`;
  $("brand").textContent = P.name;
  $("hero-name").textContent = P.name;
  $("hero-role").textContent = P.role;
  $("hero-tagline").textContent = P.tagline;
  if (P.status) $("hero-status").textContent = P.status;
  else $("hero-status").remove();

  function linkButtons() {
    const L = P.links || {};
    const out = [];
    if (L.email) out.push(`<a class="btn primary" href="mailto:${esc(L.email)}">Email me</a>`);
    if (L.github) out.push(`<a class="btn" href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (L.linkedin) out.push(`<a class="btn" href="${esc(L.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (L.resume) out.push(`<a class="btn" href="${esc(L.resume)}" target="_blank" rel="noopener">Resume (PDF)</a>`);
    return out.join("");
  }
  $("hero-links").innerHTML = linkButtons();
  $("contact-links").innerHTML = linkButtons();

  /* ---------- 2. Projects ---------- */
  function mediaHTML(m, title) {
    if (!m) return "";
      if (m.type === "youtube" && m.id) {
      return `<div class="media"><iframe src="https://www.youtube.com/embed/${esc(m.id)}"
        title="${esc(title)} video" loading="lazy" allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`;
    }
    if (m.type === "image" && m.src) {
      return `<div class="media"><img src="${esc(m.src)}" alt="${esc(title)} screenshot" loading="lazy"></div>`;
    }
    return "";
  }

  function projectHTML(p) {
    const cat = CATEGORY_LABEL[p.category] ? p.category : "engine";
    const highlights = (p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");
    const tech = (p.tech || []).map((t) => `<li>${esc(t)}</li>`).join("");
    const links = (p.links || [])
      .filter((l) => l.url)
      .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
      .join("");
    return `
      <article class="project cat-${cat}" data-category="${cat}">
        <div class="project-meta">
          <span class="cat">${CATEGORY_LABEL[cat]}</span>
          ${p.role ? `<div>${esc(p.role)}</div>` : ""}
          ${p.period ? `<div>${esc(p.period)}</div>` : ""}
        </div>
        <div>
          <h3>${esc(p.title)}</h3>
          ${mediaHTML(p.media, p.title)}
          <p class="summary">${esc(p.summary)}</p>
          ${highlights ? `<ul>${highlights}</ul>` : ""}
          ${tech ? `<ul class="tech" aria-label="Tech used">${tech}</ul>` : ""}
          ${links ? `<div class="project-links">${links}</div>` : ""}
        </div>
      </article>`;
  }
  $("project-list").innerHTML = (P.projects || []).map(projectHTML).join("");

  // Filter buttons: only show categories that actually have projects
  const used = [...new Set((P.projects || []).map((p) => p.category))].filter((c) => CATEGORY_LABEL[c]);
  const filterKeys = ["all", ...used];
  $("filters").innerHTML = filterKeys
    .map((k) => {
      const dot = k === "all" ? "" : `<i class="ax ${{ engine: "x", gameplay: "y", graphics: "z", software: "w" }[k]}"></i>`;
      return `<button type="button" data-filter="${k}" aria-pressed="${k === "all"}">${dot}${k === "all" ? "All" : CATEGORY_LABEL[k]}</button>`;
    })
    .join("");
  $("filters").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const f = btn.dataset.filter;
    $("filters").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    document.querySelectorAll(".project").forEach((el) => {
      el.hidden = f !== "all" && el.dataset.category !== f;
    });
  });

  /* ---------- 3. About, skills, timeline ---------- */
  $("about-text").innerHTML = (P.about || []).map((t) => `<p>${esc(t)}</p>`).join("");
  $("skills").innerHTML = (P.skills || [])
    .map((s) => `<div><dt>${esc(s.group)}</dt><dd>${(s.items || []).map(esc).join(", ")}</dd></div>`)
    .join("");
  $("timeline").innerHTML = (P.timeline || [])
    .map((t) => `<li><span class="when">${esc(t.period)}</span>
      <span><span class="what">${esc(t.title)}</span><br><span class="where">${esc(t.place)}</span></span></li>`)
    .join("");

  $("footer").textContent = `© ${new Date().getFullYear()} ${P.name}. Hosted on GitHub Pages.`;

  /* ---------- 4. The hero viewport ----------
     A wireframe icosahedron, its axis-aligned bounding box (recomputed
     every frame from the rotated vertices), and an XYZ gizmo.
     Plain canvas 2D + a tiny bit of 3D math: rotate → perspective divide. */
  const canvas = $("viewport-canvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const t = (1 + Math.sqrt(5)) / 2;
  const V = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; });
  const F = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  const E = new Set();
  F.forEach(([a, b, c]) => [[a, b], [b, c], [c, a]].forEach(([i, j]) => E.add(i < j ? `${i}-${j}` : `${j}-${i}`)));
  const edges = [...E].map((s) => s.split("-").map(Number));

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function rotate([x, y, z], ay, ax) {
    let c = Math.cos(ay), s = Math.sin(ay);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(ax); s = Math.sin(ax);
    [y, z] = [y * c - z * s, y * s + z * c];
    return [x, y, z];
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const ink = css("--ink"), muted = css("--muted");
    const ay = time * 0.00035, ax = 0.45 + Math.sin(time * 0.0002) * 0.25;
    const scale = Math.min(w, h) * 0.28, cx = w / 2, cy = h / 2 - 8, camZ = 3.2;
    const project = ([x, y, z]) => {
      const k = camZ / (camZ - z);
      return [cx + x * scale * k, cy - y * scale * k];
    };

    const R = V.map((v) => rotate(v, ay, ax));

    // AABB of the rotated mesh (in world space), drawn in perspective
    const mn = [0, 1, 2].map((i) => Math.min(...R.map((v) => v[i])));
    const mx = [0, 1, 2].map((i) => Math.max(...R.map((v) => v[i])));
    const box = [];
    for (let i = 0; i < 8; i++) box.push(project([i & 1 ? mx[0] : mn[0], i & 2 ? mx[1] : mn[1], i & 4 ? mx[2] : mn[2]]));
    const boxEdges = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
    ctx.setLineDash([4, 5]); ctx.lineWidth = 1; ctx.strokeStyle = css("--y");
    ctx.beginPath();
    boxEdges.forEach(([a, b]) => { ctx.moveTo(...box[a]); ctx.lineTo(...box[b]); });
    ctx.stroke(); ctx.setLineDash([]);

    // Mesh wireframe: edges facing away are fainter
    edges.forEach(([a, b]) => {
      const depth = (R[a][2] + R[b][2]) / 2;
      ctx.strokeStyle = depth > -0.1 ? ink : muted;
      ctx.globalAlpha = depth > -0.1 ? 0.9 : 0.35;
      ctx.lineWidth = depth > -0.1 ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(...project(R[a])); ctx.lineTo(...project(R[b])); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    R.forEach((v) => {
      if (v[2] < -0.1) return;
      const [px, py] = project(v);
      ctx.fillStyle = ink; ctx.fillRect(px - 2, py - 2, 4, 4);
    });

    // Gizmo in the top-right corner
    const gx = w - 46, gy = 46, gl = 26;
    [["--x", [1, 0, 0]], ["--y", [0, 1, 0]], ["--z", [0, 0, 1]]]
      .map(([c, a]) => [c, rotate(a, ay, ax)])
      .sort((p, q) => p[1][2] - q[1][2])
      .forEach(([c, a]) => {
        ctx.strokeStyle = css(c); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + a[0] * gl, gy - a[1] * gl); ctx.stroke();
        ctx.fillStyle = css(c);
        ctx.beginPath(); ctx.arc(gx + a[0] * gl, gy - a[1] * gl, 3.5, 0, Math.PI * 2); ctx.fill();
      });
  }

  function loop(time) { draw(time); requestAnimationFrame(loop); }

  resize();
  window.addEventListener("resize", () => { resize(); if (reduceMotion) draw(4000); });
  if (reduceMotion) draw(4000); else requestAnimationFrame(loop);
})();
