/* ============================================================
   Scroll-scrubbed oak tree. Like nishtmansi.com's frame sequence,
   the tree's growth is tied to scroll position (forwards and back),
   but it is drawn procedurally on a canvas instead of from images.
   ============================================================ */
(function () {
  "use strict";
  var section = document.getElementById("oak");
  var canvas = document.getElementById("oakCanvas");
  if (!section || !canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var bar = document.getElementById("oakBar");
  var stages = Array.prototype.slice.call(section.querySelectorAll(".oak__stage"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- deterministic randomness so the tree is the same every load ---------- */
  var seed = 20240611;
  function rand() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function rnd(a, b) { return a + rand() * (b - a); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  /* ---------- build the tree (units: trunk length = 1, y up) ---------- */
  var MAX_DEPTH = 7;
  var branches = [];
  var clusters = [];
  var roots = [];
  var LEAF_GREENS = ["#2f6b3a", "#3b7a43", "#4a8a48", "#5a9850", "#6ea35a", "#2a5e34", "#82b066"];

  function grow(x, y, ang, len, w, depth, t0) {
    var n = depth < 2 ? 10 : depth < 4 ? 6 : 3;
    var seg = len / n;
    var pts = [[x, y]], widths = [], angs = [];
    var a = ang;
    for (var i = 0; i < n; i++) {
      a += rnd(-0.2, 0.2);
      // oaks spread wide: gently pull deep branches outward, keep within a sane fan
      if (depth >= 2) a += (a > 0 ? 1 : -1) * 0.025;
      a = Math.max(-1.75, Math.min(1.75, a));
      x += Math.sin(a) * seg; y += Math.cos(a) * seg;
      pts.push([x, y]); angs.push(a);
      widths.push(w * (1 - 0.38 * (i / n)));
    }
    var dur = 0.05 + 0.13 * len;
    var b = { pts: pts, widths: widths, t0: t0, t1: t0 + dur, depth: depth };
    branches.push(b);

    if (depth < MAX_DEPTH && len > 0.035) {
      var count = depth === 0 ? 3 : (rand() < 0.35 ? 3 : 2);
      var side = rand() < 0.5 ? -1 : 1;
      for (var c = 0; c < count; c++) {
        var f, childAng;
        if (depth === 0) {
          f = rnd(0.62, 0.95);
          childAng = [-1.0, 0.15, 0.95][c] + rnd(-0.15, 0.15);
        } else {
          f = c === 0 ? 1 : rnd(0.45, 0.95);
          side = -side;
          childAng = angs[Math.max(0, Math.round(f * n) - 1)] + side * rnd(0.3, 0.75);
        }
        var idx = Math.max(1, Math.round(f * n));
        var p = pts[idx];
        var wAt = widths[idx - 1] || w;
        var childLen = len * (depth === 0 ? rnd(0.62, 0.75) : rnd(0.64, 0.8));
        grow(p[0], p[1], childAng, childLen, wAt * rnd(0.58, 0.7), depth + 1, t0 + dur * f);
      }
    }

    if (depth >= 4) {
      var end = pts[pts.length - 1];
      var leaves = [];
      var k = depth >= 6 ? 7 : 4;
      for (var j = 0; j < k; j++) {
        leaves.push({
          dx: rnd(-0.055, 0.055), dy: rnd(-0.04, 0.06),
          rot: rnd(-Math.PI, Math.PI), size: rnd(0.035, 0.055),
          color: LEAF_GREENS[(rand() * LEAF_GREENS.length) | 0], delay: rnd(0, 0.04)
        });
      }
      clusters.push({ x: end[0], y: end[1], t: b.t1, leaves: leaves, acorn: depth >= 6 && rand() < 0.12 });
    }
  }
  grow(0, 0, rnd(-0.05, 0.05), 1, 0.17, 0, 0);

  for (var r = 0; r < 6; r++) {
    var ra = (r / 5 - 0.5) * 2.6 + rnd(-0.15, 0.15);
    var rx = 0, ry = 0, pts = [[0, 0]];
    for (var s = 0; s < 6; s++) {
      ra += rnd(-0.25, 0.25);
      rx += Math.sin(ra) * 0.045; ry -= Math.abs(Math.cos(ra)) * 0.03 + 0.012;
      pts.push([rx, ry]);
    }
    roots.push({ pts: pts, w: rnd(0.03, 0.05), t0: rnd(0, 0.04) });
  }

  // Remap raw growth times into the scroll timeline:
  // 0–0.10 acorn + roots, 0.10–0.82 wood, leaves pop in as each twig finishes, up to ~1.
  var maxRaw = 0;
  branches.forEach(function (b) { if (b.t1 > maxRaw) maxRaw = b.t1; });
  function mapT(t) { return 0.1 + (t / maxRaw) * 0.72; }
  branches.forEach(function (b) { b.t0 = mapT(b.t0); b.t1 = mapT(b.t1); });
  clusters.forEach(function (c) { c.t = Math.min(mapT(c.t) + 0.04, 0.9); });

  var minX = Infinity, maxX = -Infinity, maxY = 0;
  branches.forEach(function (b) {
    b.pts.forEach(function (p) {
      if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; if (p[1] > maxY) maxY = p[1];
    });
  });
  minX -= 0.08; maxX += 0.08; maxY += 0.08;

  /* ---------- oak leaf shape (base at 0,0, tip at 0,-1) ---------- */
  var leafPath = typeof Path2D === "function" ? new Path2D(
    "M0,0 Q.16,-.06 .24,-.2 Q.12,-.27 .17,-.34 Q.36,-.4 .3,-.55 Q.15,-.58 .19,-.65" +
    " Q.3,-.74 .2,-.85 Q.1,-.96 0,-1 Q-.1,-.96 -.2,-.85 Q-.3,-.74 -.19,-.65" +
    " Q-.15,-.58 -.3,-.55 Q-.36,-.4 -.17,-.34 Q-.12,-.27 -.24,-.2 Q-.16,-.06 0,0Z"
  ) : null;

  /* ---------- rendering ---------- */
  var W = 0, H = 0, dpr = 1, scale = 1, ox = 0, oy = 0;
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    // mobile browsers fire resize when the URL bar shows/hides; skip tiny height-only changes
    if (w === W && d === dpr && Math.abs(h - H) < 40) return;
    dpr = d; W = w; H = h;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    var groundY = H * 0.88;
    scale = Math.min((W * 0.96) / (maxX - minX), (groundY - H * 0.03) / maxY);
    ox = W / 2 - ((minX + maxX) / 2) * scale;
    oy = groundY;
    draw(current);
  }
  function X(x) { return ox + x * scale; }
  function Y(y) { return oy - y * scale; }

  function barkColor(depth) {
    var t = depth / MAX_DEPTH;
    var r = Math.round(74 + (110 - 74) * t), g = Math.round(51 + (84 - 51) * t), b = Math.round(36 + (52 - 36) * t);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function draw(T) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // ground + canopy shadow
    var leafAmt = clamp01((T - 0.45) / 0.45);
    ctx.fillStyle = "rgba(47,107,58," + (0.08 + 0.1 * leafAmt) + ")";
    ctx.beginPath();
    ctx.ellipse(X(0), oy + 4, Math.max(30, (maxX - minX) * scale * (0.15 + 0.35 * leafAmt)), 10 + 8 * leafAmt, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(74,51,36,.25)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W * 0.1, oy); ctx.lineTo(W * 0.9, oy); ctx.stroke();

    // roots (drawn under the soil line, faded)
    ctx.globalAlpha = 0.45;
    roots.forEach(function (rt) {
      var g = clamp01((T - 0.03 - rt.t0) / 0.12);
      if (g <= 0) return;
      strokePartial(rt.pts, null, rt.w, g, "#5b4030");
    });
    ctx.globalAlpha = 1;

    // acorn: sits on the ground, then splits open as the sprout appears
    if (T < 0.16) {
      var fade = 1 - clamp01((T - 0.09) / 0.07);
      ctx.globalAlpha = fade;
      drawAcorn(X(0), oy - 9, 1.4 + 0.3 * clamp01(T / 0.08));
      ctx.globalAlpha = 1;
    }

    // wood: thickens over time like a real trunk
    for (var i = 0; i < branches.length; i++) {
      var b = branches[i];
      if (T <= b.t0) continue;
      var g2 = clamp01((T - b.t0) / (b.t1 - b.t0));
      var girth = 0.35 + 0.65 * easeOut(clamp01((T - b.t0) / 0.55));
      strokePartial(b.pts, b.widths, null, g2, barkColor(b.depth), girth);
    }

    // leaves + acorns
    for (var c = 0; c < clusters.length; c++) {
      var cl = clusters[c];
      if (T <= cl.t) continue;
      for (var l = 0; l < cl.leaves.length; l++) {
        var lf = cl.leaves[l];
        var lg = clamp01((T - cl.t - lf.delay) / 0.07);
        if (lg <= 0) continue;
        var s = easeOutBack(lg) * lf.size * scale;
        var cos = Math.cos(lf.rot) * s, sin = Math.sin(lf.rot) * s;
        ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin, dpr * cos, dpr * X(cl.x + lf.dx), dpr * Y(cl.y + lf.dy));
        ctx.fillStyle = lf.color;
        if (leafPath) ctx.fill(leafPath);
        else { ctx.beginPath(); ctx.ellipse(0, -0.5, 0.3, 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (cl.acorn && T > 0.9) {
        ctx.globalAlpha = clamp01((T - 0.9) / 0.06);
        drawAcorn(X(cl.x), Y(cl.y) + 6, 0.8);
        ctx.globalAlpha = 1;
      }
    }
  }

  function strokePartial(pts, widths, w, g, color, girth) {
    var n = pts.length - 1, upto = g * n;
    ctx.strokeStyle = color;
    for (var i = 0; i < n && i < upto; i++) {
      var a = pts[i], b = pts[i + 1], f = Math.min(1, upto - i);
      ctx.lineWidth = Math.max(0.6, (widths ? widths[i] * (girth || 1) : w) * scale);
      ctx.beginPath();
      ctx.moveTo(X(a[0]), Y(a[1]));
      ctx.lineTo(X(a[0] + (b[0] - a[0]) * f), Y(a[1] + (b[1] - a[1]) * f));
      ctx.stroke();
    }
  }

  function drawAcorn(x, y, k) {
    ctx.fillStyle = "#9a6a35";
    ctx.beginPath(); ctx.ellipse(x, y + 2 * k, 4 * k, 5.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5e4128";
    ctx.beginPath(); ctx.ellipse(x, y - 1.5 * k, 4.8 * k, 2.8 * k, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - 0.6 * k, y - 6 * k, 1.2 * k, 2.4 * k);
  }

  /* ---------- scroll → progress (smoothed, like the reference site) ---------- */
  var target = 0, current = 0, rafId = 0;
  function readTarget() {
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    var p = travel > 0 ? clamp01(-rect.top / travel) : 1;
    target = clamp01(p / 0.9); // finish slightly before the section unpins
  }
  function updateUI(T) {
    if (bar) bar.style.width = (T * 100).toFixed(1) + "%";
    var active = 0;
    stages.forEach(function (el, i) { if (T >= parseFloat(el.getAttribute("data-at"))) active = i; });
    stages.forEach(function (el, i) { el.classList.toggle("is-active", i === active); });
  }
  function tick() {
    var d = target - current;
    if (reduceMotion || Math.abs(d) < 0.0006) { current = target; rafId = 0; }
    else { current += d * 0.12; rafId = requestAnimationFrame(tick); }
    draw(current); updateUI(current);
  }
  function onScroll() {
    readTarget();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { resize(); onScroll(); });
  readTarget(); current = target;
  resize(); updateUI(current);
})();
