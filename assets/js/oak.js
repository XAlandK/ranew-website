/* ============================================================
   Scroll-scrubbed oak tree. Like nishtmansi.com's frame sequence,
   the tree's growth is tied to scroll position (forwards and back),
   but it is drawn procedurally on a canvas instead of from images.

   Realism comes from three ideas:
   - the skeleton is grown once with 3-D space colonization, so limbs
     compete for room inside a lumpy oak-shaped crown like real wood;
   - every branch is as thick as everything it carries (pipe model),
     so the trunk keeps thickening while the crown fills in;
   - foliage is drawn from pre-lit leaf-clump sprites, and clumps that
     end up shaded inside the crown are shed, leaving a lit outer shell.
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
  function easeOutBack(t) { var c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }

  /* ---------- timeline (scroll progress 0..1) ---------- */
  var T_SPROUT = 0.085;   // shoot breaks the soil
  var T_WOOD_END = 0.83;  // last twig finished
  var LEAF_IN = 0.04;     // a clump takes this long to unfold
  var LEAF_OUT = 0.09;    // ...and this long to drop once it is shaded inside the crown

  /* ---------- 1. skeleton: 3-D space colonization (units: ground y=0, y up) ---------- */
  var STEP = 0.034, R_INF = 0.3, R_KILL = 0.07;
  var nx = [], ny = [], nz = [], par = [], born = [];
  function addNode(x, y, z, p, it) {
    nx.push(x); ny.push(y); nz.push(z); par.push(p); born.push(it);
    return nx.length - 1;
  }

  // a short, slightly leaning and twisting bole
  var it = 0, TRUNK_H = 0.34;
  var lean = rnd(-0.12, 0.12), twist = rnd(-0.08, 0.08);
  addNode(0, 0, 0, -1, 0);
  while (ny[nx.length - 1] < TRUNK_H) {
    var last = nx.length - 1, h = ny[last] / TRUNK_H;
    it++;
    addNode(nx[last] + STEP * (lean * (0.4 + h) + Math.sin(h * 5) * twist), ny[last] + STEP, nz[last] + STEP * twist * 0.5, last, it);
  }
  var TRUNK_ITS = it;
  // oaks are decurrent: the bole splits into a few big limbs instead of keeping one leader
  var top = nx.length - 1, LIMBS = 3, phi0 = rnd(0, Math.PI * 2);
  for (var lb = 0; lb < LIMBS; lb++) {
    var phi = phi0 + (lb / LIMBS) * Math.PI * 2 + rnd(-0.3, 0.3), el = rnd(0.5, 0.8);
    var ldx = Math.sin(el) * Math.cos(phi), ldy = Math.cos(el), ldz = Math.sin(el) * Math.sin(phi) * 0.8;
    var prev = top;
    for (var ls = 1; ls <= 2; ls++) {
      prev = addNode(nx[prev] + STEP * ldx, ny[prev] + STEP * ldy, nz[prev] + STEP * ldz, prev, it + ls);
    }
  }
  it += 2;

  // crown envelope: a broad dome plus irregular lobes, wider than tall like an open-grown oak,
  // nudged towards the side the limbs lean
  var CROWN = { x: nx[nx.length - 1] * 0.5, y: 0.93, z: 0, rx: 0.78, ry: 0.42, rz: 0.62 };
  var LOBES = [];
  for (var l = 0; l < 10; l++) {
    var la = (l / 10) * Math.PI * 2 + rnd(-0.25, 0.25);
    var le = rnd(-0.25, 0.9);
    LOBES.push({
      x: CROWN.x + Math.cos(la) * Math.cos(le) * CROWN.rx * 0.92,
      y: CROWN.y + Math.sin(le) * CROWN.ry * 0.9,
      z: CROWN.z + Math.sin(la) * Math.cos(le) * CROWN.rz * 0.92,
      r: rnd(0.2, 0.33)
    });
  }
  function inCrown(x, y, z) {
    if (y < 0.5) return false;
    var dx = (x - CROWN.x) / CROWN.rx, dy = (y - CROWN.y) / CROWN.ry, dz = (z - CROWN.z) / CROWN.rz;
    if (dx * dx + dy * dy + dz * dz <= 1) return true;
    for (var i = 0; i < LOBES.length; i++) {
      var o = LOBES[i], ex = x - o.x, ey = y - o.y, ez = z - o.z;
      if (ex * ex + ey * ey + ez * ez <= o.r * o.r) return true;
    }
    return false;
  }
  var NPTS = 1100, ax = [], ay = [], az = [];
  while (ax.length < NPTS) {
    var px = rnd(-1.15, 1.15), py = rnd(0.45, 1.45), pz = rnd(-1, 1);
    if (inCrown(px, py, pz)) { ax.push(px); ay.push(py); az.push(pz); }
  }

  // spatial hash of attraction points so each new node only checks its neighbourhood
  var grid = {};
  function cellKey(ix, iy, iz) { return ix + "," + iy + "," + iz; }
  for (var p = 0; p < NPTS; p++) {
    var k0 = cellKey(Math.floor(ax[p] / R_INF), Math.floor(ay[p] / R_INF), Math.floor(az[p] / R_INF));
    (grid[k0] || (grid[k0] = [])).push(p);
  }
  var alive = [], bestD = [], bestN = [], aliveCount = NPTS;
  for (p = 0; p < NPTS; p++) { alive.push(1); bestD.push(Infinity); bestN.push(-1); }
  var RI2 = R_INF * R_INF, RK2 = R_KILL * R_KILL;
  function influence(n) {
    var cx = Math.floor(nx[n] / R_INF), cy = Math.floor(ny[n] / R_INF), cz = Math.floor(nz[n] / R_INF);
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) for (var k = -1; k <= 1; k++) {
      var list = grid[cellKey(cx + i, cy + j, cz + k)];
      if (!list) continue;
      for (var q = 0; q < list.length; q++) {
        var a = list[q];
        if (!alive[a]) continue;
        var dx = ax[a] - nx[n], dy = ay[a] - ny[n], dz = az[a] - nz[n], d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < RK2) { alive[a] = 0; aliveCount--; }
        else if (d2 < RI2 && d2 < bestD[a]) { bestD[a] = d2; bestN[a] = n; }
      }
    }
  }
  for (var n0 = 0; n0 < nx.length; n0++) influence(n0);

  var kids = [];
  for (n0 = 0; n0 < nx.length; n0++) kids.push([]);
  for (n0 = 1; n0 < nx.length; n0++) kids[par[n0]].push(n0);
  var MAX_IT = TRUNK_ITS + 120;
  while (aliveCount > 0 && it < MAX_IT) {
    it++;
    var sx = {}, order = [];
    for (p = 0; p < NPTS; p++) {
      if (!alive[p] || bestN[p] < 0) continue;
      var bn = bestN[p], vx = ax[p] - nx[bn], vy = ay[p] - ny[bn], vz = az[p] - nz[bn];
      var vl = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      if (!sx[bn]) { sx[bn] = [0, 0, 0]; order.push(bn); }
      sx[bn][0] += vx / vl; sx[bn][1] += vy / vl; sx[bn][2] += vz / vl;
    }
    order.sort(function (a, b) { return a - b; });
    var created = [];
    for (var o = 0; o < order.length; o++) {
      var src = order[o], v = sx[src];
      if (kids[src].length >= 3 || born[src] <= TRUNK_ITS) continue;
      var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      if (len < 1e-6) continue;
      // oak wood is gnarly: jitter every step, with a faint pull upwards
      var dx = v[0] / len + rnd(-0.32, 0.32), dy = v[1] / len + rnd(-0.32, 0.32) + 0.06, dz = v[2] / len + rnd(-0.32, 0.32);
      var dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
      var c = addNode(nx[src] + STEP * dx / dl, ny[src] + STEP * dy / dl, nz[src] + STEP * dz / dl, src, it);
      kids.push([]); kids[src].push(c); created.push(c);
    }
    if (!created.length) break;
    for (o = 0; o < created.length; o++) influence(created[o]);
  }
  var LAST_IT = it, N = nx.length;

  // relax kinks along unbranched runs (branch points and the base stay put)
  for (var pass = 0; pass < 2; pass++) {
    for (var i = 1; i < N; i++) {
      if (kids[i].length !== 1 || born[i] <= TRUNK_ITS) continue;
      var a = par[i], b = kids[i][0];
      nx[i] = nx[i] * 0.5 + (nx[a] + nx[b]) * 0.25;
      ny[i] = ny[i] * 0.5 + (ny[a] + ny[b]) * 0.25;
      nz[i] = nz[i] * 0.5 + (nz[a] + nz[b]) * 0.25;
    }
  }

  // tips carried by each node (final tree), for the pipe model and to pick the main axis
  var tips = new Array(N);
  for (i = N - 1; i >= 0; i--) {
    var tsum = kids[i].length ? 0 : 1;
    for (var kk = 0; kk < kids[i].length; kk++) tsum += tips[kids[i][kk]];
    tips[i] = tsum;
  }

  // growth window of each node: it grows from its parent between ts and te
  var T_SAPLING = 0.22; // bole finished, limbs start
  function timeOf(k) {
    if (k <= TRUNK_ITS) return T_SPROUT + (T_SAPLING - T_SPROUT) * (k / TRUNK_ITS);
    return T_SAPLING + (T_WOOD_END - T_SAPLING) * Math.pow((k - TRUNK_ITS) / (LAST_IT - TRUNK_ITS), 0.95);
  }
  var ts = new Float64Array(N), te = new Float64Array(N);
  for (i = 0; i < N; i++) { ts[i] = timeOf(Math.max(0, born[i] - 1)); te[i] = timeOf(born[i]); }
  te[0] = ts[0] = T_SPROUT;

  // pipe model: area of a segment = sum of the areas it carries; width = sqrt(area)
  var TRUNK_W = 0.15;
  var W_K = TRUNK_W / Math.sqrt(tips[0]);
  var area = new Float64Array(N), wNow = new Float64Array(N), gNow = new Float64Array(N);
  function flare(y) { return y < 0.1 ? 1 + 0.75 * Math.pow(1 - y / 0.1, 2.2) : 1; }

  /* ---------- 2. chains: each run of wood drawn as one tapered shape ---------- */
  var chains = [];
  (function () {
    var stack = [[0]];
    while (stack.length) {
      var seq = stack.pop();
      var cur = seq[seq.length - 1];
      for (;;) {
        var ks = kids[cur];
        if (!ks.length) break;
        var main = ks[0];
        for (var q = 1; q < ks.length; q++) if (tips[ks[q]] > tips[main]) main = ks[q];
        for (q = 0; q < ks.length; q++) if (ks[q] !== main) stack.push([cur, ks[q]]);
        seq.push(main); cur = main;
      }
      if (seq.length < 2) continue;
      var zs = 0;
      for (var q2 = 0; q2 < seq.length; q2++) zs += nz[seq[q2]];
      var chain = { nodes: seq, z: zs / seq.length, root: seq[0] === 0 && chains.length === 0, streaks: [] };
      // bark fissures for the thick wood (drawn only once it is wide enough on screen)
      var wFinal = W_K * Math.sqrt(tips[seq[1]]);
      if (wFinal > 0.022) {
        var count = Math.round(seq.length * (chain.root ? 7 : 2.4));
        for (q = 0; q < count; q++) {
          chain.streaks.push({ o: rnd(-0.85, 0.85), s: rnd(0, seq.length - 1.5), len: rnd(0.8, 3.2), dark: rand() < 0.72 });
        }
      }
      chains.push(chain);
    }
    chains.sort(function (a, b) { return a.z - b.z; });
  })();

  /* ---------- 3. foliage clumps ---------- */
  // a clump lives on young wood and is shed once the branch has grown SHED_DIST steps past it
  var SHED_DIST = 6;
  var reach = new Array(N);
  for (i = N - 1; i >= 0; i--) {
    var r = [te[i]];
    for (var d = 1; d <= SHED_DIST; d++) {
      var best = Infinity;
      for (kk = 0; kk < kids[i].length; kk++) { var rc = reach[kids[i][kk]][d - 1]; if (rc < best) best = rc; }
      r.push(best);
    }
    reach[i] = r;
  }

  var VARIANTS = 6, LEVELS = 8;
  var clumps = [], youngLeaves = [];
  for (i = 1; i < N; i++) {
    var tIn = ts[i] + (te[i] - ts[i]) * 0.4, tOut = reach[i][SHED_DIST];
    if (tOut < tIn + LEAF_IN * 0.8) continue;
    if (born[i] <= TRUNK_ITS) {
      // the sapling carries a few real-size leaves instead of clumps
      if (ny[i] < 0.05) continue;
      var pa = par[i], tx = nx[i] - nx[pa], ty = ny[i] - ny[pa], ang = Math.atan2(tx, ty);
      youngLeaves.push({ n: i, rot: ang + (i % 2 ? 1 : -1) * rnd(0.7, 1.15), size: rnd(0.026, 0.034), tIn: tIn, tOut: tOut, shade: rnd(-0.08, 0.08) });
      if (kids[i].length === 0 || i % 3 === 0) youngLeaves.push({ n: i, rot: ang + rnd(-0.3, 0.3), size: rnd(0.02, 0.028), tIn: tIn + 0.01, tOut: tOut, shade: rnd(-0.08, 0.08) });
      continue;
    }
    var final = tOut === Infinity;
    // thin out interior clumps: tips always carry one, shaded inner growth only sometimes
    if (kids[i].length && (final ? born[i] % 2 && rand() < 0.7 : rand() < 0.55)) continue;
    clumps.push({
      n: i, x: nx[i] + rnd(-0.025, 0.025), y: ny[i] + rnd(-0.02, 0.025), z: nz[i],
      r: (final ? rnd(0.066, 0.088) : rnd(0.05, 0.07)) * (kids[i].length ? 1 : 1.1),
      tIn: tIn, tOut: tOut, v: (rand() * VARIANTS) | 0, lv: 0, final: final
    });
  }

  // light each clump: sun from upper-left-front, darker deep inside the crown
  (function () {
    var fx0 = Infinity, fx1 = -Infinity, fy0 = Infinity, fy1 = -Infinity, fz0 = Infinity, fz1 = -Infinity;
    clumps.forEach(function (c) {
      if (!c.final) return;
      fx0 = Math.min(fx0, c.x); fx1 = Math.max(fx1, c.x); fy0 = Math.min(fy0, c.y);
      fy1 = Math.max(fy1, c.y); fz0 = Math.min(fz0, c.z); fz1 = Math.max(fz1, c.z);
    });
    var cx = (fx0 + fx1) / 2, cy = (fy0 + fy1) / 2 - 0.05, cz = (fz0 + fz1) / 2;
    var rx = (fx1 - fx0) / 2 || 1, ry = (fy1 - fy0) / 2 || 1, rz = (fz1 - fz0) / 2 || 1;
    var L = [-0.5, 0.72, 0.48], Ll = Math.sqrt(L[0] * L[0] + L[1] * L[1] + L[2] * L[2]);
    clumps.forEach(function (c) {
      var b;
      if (c.final) {
        var ux = (c.x - cx) / rx, uy = (c.y - cy) / ry, uz = (c.z - cz) / rz;
        var ul = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1;
        var diffuse = Math.max(0, (ux * L[0] + uy * L[1] + uz * L[2]) / (ul * Ll));
        var depth = clamp01(ul);
        b = (0.3 + 0.7 * diffuse) * (0.35 + 0.65 * Math.pow(depth, 1.3));
      } else {
        b = 0.45 + rnd(0, 0.3); // young growth is out in the light while it lives
      }
      c.lv = Math.max(0, Math.min(LEVELS - 1, Math.round((b + rnd(-0.07, 0.07)) * (LEVELS - 1))));
    });
  })();
  clumps.sort(function (a, b) { return a.z - b.z; });

  // painter's order: wood and foliage are drawn in depth slices, back to front,
  // so far branches hide behind near leaves and a twig disappears into its own clump
  var SLICES = 4, sliceZ = [], sliceStart = [0];
  for (var sI = 1; sI < SLICES; sI++) sliceZ.push(clumps.length ? clumps[Math.floor(clumps.length * sI / SLICES)].z : 0);
  function sliceOf(z) { var q = 0; while (q < sliceZ.length && z >= sliceZ[q]) q++; return q; }
  for (sI = 1; sI < SLICES; sI++) {
    var at = sliceStart[sI - 1];
    while (at < clumps.length && clumps[at].z < sliceZ[sI - 1]) at++;
    sliceStart.push(at);
  }
  sliceStart.push(clumps.length);
  chains.forEach(function (ch) { ch.slice = ch.root ? SLICES - 2 : sliceOf(ch.z); });

  // leaf layouts for each sprite variant (positions in a unit disc; screen y down)
  var layouts = [];
  for (var vI = 0; vI < VARIANTS; vI++) {
    var lay = [];
    for (var lf = 0; lf < 36; lf++) {
      var rr = Math.sqrt(rand()) * 0.8, aa = rand() * Math.PI * 2;
      var lx = Math.cos(aa) * rr, ly = Math.sin(aa) * rr * 0.82 + 0.04;
      lay.push({ x: lx, y: ly, rot: rnd(-Math.PI, Math.PI), s: rnd(0.24, 0.34), ls: clamp01(0.5 + 0.55 * (-0.55 * lx - 0.83 * ly)), j: rnd(-0.08, 0.08) });
    }
    lay.sort(function (a, b) { return a.ls - b.ls; });
    layouts.push(lay);
  }

  /* ---------- ground details ---------- */
  var grass = [];
  for (var gI = 0; gI < 70; gI++) {
    var gx = rnd(-1.05, 1.05) * Math.pow(rand(), 0.5) * (rand() < 0.5 ? 1 : 0.6);
    var blades = [];
    for (var bI = 0, bn2 = 3 + ((rand() * 4) | 0); bI < bn2; bI++) {
      blades.push({ dx: rnd(-0.006, 0.006), h: rnd(0.012, 0.034), bend: rnd(-0.012, 0.012), c: (rand() * 3) | 0 });
    }
    grass.push({ x: gx, y: rnd(-0.012, 0.01), blades: blades, front: rand() < 0.45 });
  }
  var surfaceRoots = [];
  for (var sr = 0; sr < 5; sr++) {
    var dir = (sr / 4 - 0.5) * 2;
    surfaceRoots.push({ dir: dir + rnd(-0.15, 0.15), len: rnd(0.07, 0.13) * (0.6 + 0.4 * Math.abs(dir)), w: rnd(0.32, 0.45), drop: rnd(0.008, 0.02) });
  }

  // extents of the finished tree, for framing
  var minX = Infinity, maxX = -Infinity, maxY = 0;
  for (i = 0; i < N; i++) { if (nx[i] < minX) minX = nx[i]; if (nx[i] > maxX) maxX = nx[i]; if (ny[i] > maxY) maxY = ny[i]; }
  minX -= 0.09; maxX += 0.09; maxY += 0.08;
  var CX = (minX + maxX) / 2;

  // past this point nothing changes, so the finished frame is drawn once and reused
  var T_DONE = T_WOOD_END;
  clumps.concat(youngLeaves).forEach(function (c) {
    T_DONE = Math.max(T_DONE, c.tOut === Infinity ? c.tIn + LEAF_IN : c.tOut + LEAF_OUT);
  });
  T_DONE += 0.005;

  /* ---------- oak leaf shape (base at 0,0, tip at 0,-1) ---------- */
  var leafPath = typeof Path2D === "function" ? new Path2D(
    "M0,0 Q.16,-.06 .24,-.2 Q.12,-.27 .17,-.34 Q.36,-.4 .3,-.55 Q.15,-.58 .19,-.65" +
    " Q.3,-.74 .2,-.85 Q.1,-.96 0,-1 Q-.1,-.96 -.2,-.85 Q-.3,-.74 -.19,-.65" +
    " Q-.15,-.58 -.3,-.55 Q-.36,-.4 -.17,-.34 Q-.12,-.27 -.24,-.2 Q-.16,-.06 0,0Z"
  ) : null;
  function fillLeaf(c) {
    if (leafPath) c.fill(leafPath);
    else { c.beginPath(); c.ellipse(0, -0.5, 0.3, 0.5, 0, 0, Math.PI * 2); c.fill(); }
  }

  // summer oak greens from deep shade to sunlit
  var RAMP = [[22, 44, 22], [30, 60, 28], [42, 80, 36], [58, 100, 42], [80, 124, 50], [112, 152, 64], [150, 182, 86]];
  function leafColor(b) {
    b = clamp01(b) * (RAMP.length - 1);
    var i0 = Math.floor(b), i1 = Math.min(RAMP.length - 1, i0 + 1), f = b - i0;
    var c0 = RAMP[i0], c1 = RAMP[i1];
    return "rgb(" + Math.round(c0[0] + (c1[0] - c0[0]) * f) + "," + Math.round(c0[1] + (c1[1] - c0[1]) * f) + "," +
      Math.round(c0[2] + (c1[2] - c0[2]) * f) + ")";
  }

  /* ---------- rendering ---------- */
  var W = 0, H = 0, dpr = 1, scaleFinal = 1, scale = 1, ox = 0, oy = 0;
  var atlas = null, SPR = 0, CELL = 0, cache = null, cacheOk = false;
  var ZOOM_MAX = 3.4;

  function buildSprites() {
    // every clump variant × light level lives in one atlas (one texture to draw from);
    // rendered with headroom so the zoomed-in mid-growth frames stay crisp
    SPR = Math.max(16, Math.min(240, Math.ceil(2 * 0.095 * scaleFinal * dpr * 2)));
    CELL = SPR + 4; // padding so filtering never bleeds in a neighbour
    atlas = atlas || document.createElement("canvas");
    atlas.width = CELL * VARIANTS; atlas.height = CELL * LEVELS;
    var c = atlas.getContext("2d");
    for (var v = 0; v < VARIANTS; v++) {
      for (var lv = 0; lv < LEVELS; lv++) {
        var R = SPR / 2, b = lv / (LEVELS - 1), cx0 = v * CELL + 2, cy0 = lv * CELL + 2;
        var lay = layouts[v];
        // pass 0: the same leaves pushed down-right in shade give the clump depth and fill its gaps
        for (var pass = 0; pass < 2; pass++) {
          for (var q = 0; q < lay.length; q++) {
            var L = lay[q], s = L.s * R * (pass ? 0.62 : 0.7);
            var cs = Math.cos(L.rot) * s, sn = Math.sin(L.rot) * s;
            var off = pass ? 0 : 0.1;
            c.setTransform(cs, sn, -sn, cs, cx0 + R + (L.x * 0.92 + off * 0.6) * R, cy0 + R + (L.y * 0.92 + off) * R);
            c.fillStyle = pass ? leafColor(b * 0.85 + (L.ls - 0.5) * 0.42 + L.j + 0.04) : leafColor(b * 0.3 + L.j * 0.5);
            fillLeaf(c);
          }
        }
      }
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    // mobile browsers fire resize when the URL bar shows/hides; skip tiny height-only changes
    if (w === W && d === dpr && Math.abs(h - H) < 40) return;
    var rebuild = w !== W || d !== dpr || !atlas;
    dpr = d; W = w; H = h;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    oy = H * 0.88;
    scaleFinal = Math.min((W * 0.96) / (maxX - minX), (oy - H * 0.03) / maxY);
    if (rebuild) buildSprites();
    cacheOk = false;
    draw(current);
  }
  function X(x) { return ox + x * scale; }
  function Y(y) { return oy - y * scale; }

  /* per-frame state: widths (pipe model) and how far each node has grown */
  var curMinX = 0, curMaxX = 0, curMaxY = 0;
  function computeFrame(T) {
    curMinX = -0.06; curMaxX = 0.06; curMaxY = 0.07;
    for (var i = N - 1; i >= 0; i--) {
      var g = T <= ts[i] ? 0 : i === 0 ? 1 : clamp01((T - ts[i]) / Math.max(1e-6, te[i] - ts[i]));
      gNow[i] = g;
      if (g <= 0) { area[i] = 0; wNow[i] = 0; continue; }
      var a = Math.max(area[i], g);
      wNow[i] = W_K * Math.sqrt(a) * flare(ny[i]);
      if (i > 0) area[par[i]] += a;
      area[i] = 0;
      var pp = par[i] < 0 ? i : par[i];
      var x = nx[pp] + (nx[i] - nx[pp]) * g, y = ny[pp] + (ny[i] - ny[pp]) * g;
      if (x < curMinX) curMinX = x; if (x > curMaxX) curMaxX = x; if (y > curMaxY) curMaxY = y;
    }
    // camera: close on the seed and sapling, pulling back as the crown spreads
    var halfW = Math.max(CX - curMinX, curMaxX - CX) + 0.1;
    var fit = Math.min((W * 0.96) / (2 * halfW), (oy - H * 0.03) / (curMaxY + 0.09));
    scale = Math.max(scaleFinal, Math.min(scaleFinal * ZOOM_MAX, fit));
    ox = W / 2 - CX * scale;
  }

  function draw(T) {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (T >= T_DONE) {
      if (!cacheOk) {
        if (!cache) cache = document.createElement("canvas");
        cache.width = canvas.width; cache.height = canvas.height;
        var main = ctx;
        ctx = cache.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        drawScene(1);
        ctx = main;
        cacheOk = true;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(cache, 0, 0);
      return;
    }
    drawScene(T);
  }

  function drawScene(T) {
    computeFrame(T);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    var leafAmt = clamp01((T - 0.4) / 0.45);
    drawGround(leafAmt);
    drawRoots();
    drawAcorn(T);
    for (var s = 0; s < SLICES; s++) {
      drawWood(s);
      drawClumps(T, sliceStart[s], sliceStart[s + 1]);
    }
    drawYoungLeaves(T);
    drawGrass(true);
  }

  /* ---------- ground: lawn patch, canopy shadow, grass ---------- */
  function drawGround(leafAmt) {
    ctx.save();
    ctx.translate(X(0), oy + 2);
    ctx.scale(1, 0.085);
    var rx = Math.min(W * 0.55, 1.35 * scale);
    var lawn = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    lawn.addColorStop(0, "rgba(96,112,64,.22)");
    lawn.addColorStop(0.6, "rgba(110,128,74,.10)");
    lawn.addColorStop(1, "rgba(110,128,74,0)");
    ctx.fillStyle = lawn;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();

    // canopy shadow, thrown a little to the right because the sun is upper-left
    var spread = Math.max(CX - curMinX, curMaxX - CX);
    var sr = Math.min(W * 0.5, spread * scale * 1.02);
    if (sr > 4) {
      ctx.save();
      ctx.translate(X(0.12 * leafAmt), oy + 3);
      ctx.scale(1, 0.12);
      var sh = ctx.createRadialGradient(0, 0, 0, 0, 0, sr);
      sh.addColorStop(0, "rgba(34,52,26," + (0.1 + 0.32 * leafAmt) + ")");
      sh.addColorStop(0.55, "rgba(34,52,26," + (0.06 + 0.2 * leafAmt) + ")");
      sh.addColorStop(1, "rgba(34,52,26,0)");
      ctx.fillStyle = sh;
      ctx.fillRect(-sr, -sr, sr * 2, sr * 2);
      ctx.restore();
    }
    // contact shadow right under the trunk
    var bw = Math.max(6, wNow[0] * scale * 2.2);
    ctx.save();
    ctx.translate(X(0.01), oy + 1);
    ctx.scale(1, 0.25);
    var cs = ctx.createRadialGradient(0, 0, 0, 0, 0, bw);
    cs.addColorStop(0, "rgba(40,30,20,.35)");
    cs.addColorStop(1, "rgba(40,30,20,0)");
    ctx.fillStyle = cs;
    ctx.fillRect(-bw, -bw, bw * 2, bw * 2);
    ctx.restore();
    drawGrass(false);
  }

  var GRASS = ["rgba(92,128,60,.75)", "rgba(120,150,72,.7)", "rgba(70,104,48,.75)"];
  function drawGrass(front) {
    // grass is a scale cue next to the seed; around the grown tree it should stay quiet
    var near = clamp01((scale / scaleFinal - 1) / 1.4);
    ctx.globalAlpha = 0.35 + 0.65 * near;
    ctx.lineWidth = Math.max(0.6, scale * 0.0035);
    for (var c = 0; c < 3; c++) {
      ctx.strokeStyle = GRASS[c];
      ctx.beginPath();
      for (var i = 0; i < grass.length; i++) {
        var g = grass[i];
        if (g.front !== front) continue;
        var bx = X(g.x);
        if (bx < -10 || bx > W + 10) continue;
        for (var j = 0; j < g.blades.length; j++) {
          var b = g.blades[j];
          if (b.c !== c) continue;
          var x0 = X(g.x + b.dx), y0 = oy + 1 - g.y * scale * 0.5;
          ctx.moveTo(x0, y0);
          ctx.quadraticCurveTo(x0 + b.bend * 0.3 * scale, y0 - b.h * 0.6 * scale, x0 + b.bend * scale, y0 - b.h * scale);
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- wood ---------- */
  var BUF = 1024;
  var BX = new Float64Array(BUF), BY = new Float64Array(BUF), BW = new Float64Array(BUF), NX = new Float64Array(BUF), NY = new Float64Array(BUF);
  var LIGHT2D = [-0.55, -0.83]; // towards the sun in screen space (y down)

  function trace(n, off0, sideSign, reverse, moveFirst) {
    // walks an offset line along the buffered centreline; offsets are fractions of the half-width
    for (var k = 0; k < n; k++) {
      var i = reverse ? n - 1 - k : k;
      var o = off0 * sideSign * BW[i] * 0.5;
      var x = BX[i] + NX[i] * o, y = BY[i] + NY[i] * o;
      if (k === 0 && moveFirst) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }
  function band(n, a, b, sideSign, style) {
    ctx.fillStyle = style;
    ctx.beginPath();
    trace(n, a, sideSign, false, true);
    trace(n, b, sideSign, true, false);
    ctx.closePath();
    ctx.fill();
  }

  function barkRGB(order, k) {
    // grey-brown oak bark; younger wood is warmer
    var r = 86 + 18 * order, g = 74 + 10 * order, b = 62 + 4 * order;
    return "rgb(" + Math.round(r * k) + "," + Math.round(g * k) + "," + Math.round(b * k) + ")";
  }

  function drawWood(slice) {
    var thin = [[], [], []]; // batched hairline twigs by width bucket
    for (var ci = 0; ci < chains.length; ci++) {
      var ch = chains[ci], nodes = ch.nodes, n = 0, maxW = 0;
      if (ch.slice !== slice) continue;
      var startK = ch.root ? 0 : 1;
      if (gNow[nodes[startK]] <= 0) continue;
      for (var k = 0; k < nodes.length && n < BUF; k++) {
        var id = nodes[k], g = k === 0 ? 1 : gNow[id];
        if (g <= 0) break;
        var pp = par[id] < 0 ? id : par[id], x, y;
        if (g < 1) { x = nx[pp] + (nx[id] - nx[pp]) * g; y = ny[pp] + (ny[id] - ny[pp]) * g; }
        else { x = nx[id]; y = ny[id]; }
        BX[n] = X(x); BY[n] = Y(y);
        var w = (k === 0 && !ch.root) ? wNow[nodes[1]] * 1.18 : wNow[id];
        if (n > 0 && w < BW[n - 1] / scale * 0.86) w = BW[n - 1] / scale * 0.86;
        BW[n] = w * scale; if (BW[n] > maxW) maxW = BW[n];
        n++;
        if (g < 1) break;
      }
      if (n < 2) continue;
      if (maxW < 1.7) {
        // hairline twigs are stroked later in three batched paths
        var pts = [];
        for (var q = 0; q < n; q++) pts.push(BX[q], BY[q]);
        thin[maxW < 0.9 ? 0 : maxW < 1.3 ? 1 : 2].push(pts);
        continue;
      }
      // normals and which side faces the sun (fixed per chain so shading never flips mid-branch)
      var dot = 0;
      for (var i = 0; i < n; i++) {
        var a = i > 0 ? i - 1 : 0, b2 = i < n - 1 ? i + 1 : n - 1;
        var tx = BX[b2] - BX[a], ty = BY[b2] - BY[a], tl = Math.sqrt(tx * tx + ty * ty) || 1;
        NX[i] = -ty / tl; NY[i] = tx / tl;
        dot += NX[i] * LIGHT2D[0] + NY[i] * LIGHT2D[1];
      }
      var side = dot >= 0 ? 1 : -1, contrast = Math.min(1, 0.45 + Math.abs(dot / n));
      var order = ch.root ? 0 : Math.min(1, 0.25 + (1 - Math.min(1, maxW / 30)) * 0.75);

      // body with a rounded tip
      ctx.fillStyle = barkRGB(order, 1);
      ctx.beginPath();
      trace(n, 1, 1, false, true);
      ctx.arc(BX[n - 1], BY[n - 1], BW[n - 1] * 0.5, Math.atan2(NY[n - 1], NX[n - 1]), Math.atan2(-NY[n - 1], -NX[n - 1]), (NX[n - 1] * (BY[n - 1] - BY[n - 2]) - NY[n - 1] * (BX[n - 1] - BX[n - 2])) > 0);
      trace(n, -1, 1, true, false);
      ctx.closePath();
      ctx.fill();
      if (!ch.root) {
        // a collar where the branch leaves its parent
        ctx.beginPath(); ctx.arc(BX[0], BY[0], BW[0] * 0.5, 0, Math.PI * 2); ctx.fill();
      }
      if (maxW >= 3.5) {
        // cylindrical shading: core shadow on the far side, soft light on the sun side
        band(n, -1, -0.05, side, "rgba(30,22,16," + (0.22 * contrast).toFixed(3) + ")");
        if (maxW >= 6) band(n, -1, -0.5, side, "rgba(24,18,12," + (0.3 * contrast).toFixed(3) + ")");
        band(n, 0.2, 0.75, side, "rgba(196,184,164," + (0.2 * contrast).toFixed(3) + ")");
        if (maxW >= 10) band(n, 0.82, 1, side, "rgba(40,30,22,.18)");
      }
      if (ch.streaks.length && maxW >= 5) drawStreaks(ch, n);
    }
    // hairline twigs, batched
    for (var bI = 0; bI < 3; bI++) {
      var list = thin[bI];
      if (!list.length) continue;
      ctx.strokeStyle = barkRGB(1, 1);
      ctx.lineWidth = [0.75, 1.1, 1.5][bI];
      ctx.beginPath();
      for (var li = 0; li < list.length; li++) {
        var pts2 = list[li];
        ctx.moveTo(pts2[0], pts2[1]);
        for (var pI = 2; pI < pts2.length; pI += 2) ctx.lineTo(pts2[pI], pts2[pI + 1]);
      }
      ctx.stroke();
    }
  }

  function drawStreaks(ch, n) {
    ctx.lineWidth = Math.max(0.7, Math.min(1.6, scale * 0.0032));
    for (var pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? "rgba(214,204,186,.22)" : "rgba(28,20,14,.42)";
      ctx.beginPath();
      for (var s = 0; s < ch.streaks.length; s++) {
        var st = ch.streaks[s];
        if (st.dark === !!pass) continue;
        var end = Math.min(n - 1, st.s + st.len);
        if (st.s >= end) continue;
        var first = true;
        for (var u = st.s; u <= end + 1e-6; u += 0.34) {
          var i = Math.floor(u), f = u - i;
          if (i >= n - 1) { i = n - 2; f = 1; }
          var w = BW[i] + (BW[i + 1] - BW[i]) * f;
          if (w < 5) { first = true; continue; }
          var o = st.o * w * 0.5;
          var x = BX[i] + (BX[i + 1] - BX[i]) * f + (NX[i] + (NX[i + 1] - NX[i]) * f) * o;
          var y = BY[i] + (BY[i + 1] - BY[i]) * f + (NY[i] + (NY[i + 1] - NY[i]) * f) * o;
          if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }

  function drawRoots() {
    var w0 = wNow[0] * scale;
    if (w0 < 2) return;
    for (var i = 0; i < surfaceRoots.length; i++) {
      var r = surfaceRoots[i];
      var x0 = X(r.dir * 0.012), y0 = Y(0.012);
      var len = r.len * scale * clamp01(w0 / (TRUNK_W * scaleFinal * 0.6));
      var x1 = x0 + r.dir * len, y1 = y0 + r.drop * scale + 2;
      var wr = w0 * r.w;
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, barkRGB(0, 1));
      g.addColorStop(0.7, barkRGB(0, 0.85));
      g.addColorStop(1, "rgba(70,58,46,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0 - wr * 0.5, y0 - wr * 0.25);
      ctx.quadraticCurveTo(x0 + (x1 - x0) * 0.4, y0 - wr * 0.3, x1, y1);
      ctx.quadraticCurveTo(x0 + (x1 - x0) * 0.35, y0 + wr * 0.35, x0 + wr * 0.4, y0 + wr * 0.3);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* ---------- foliage ---------- */
  function drawClumps(T, from, to) {
    for (var i = from; i < to; i++) {
      var c = clumps[i];
      if (T <= c.tIn || T >= c.tOut + LEAF_OUT) continue;
      var gin = clamp01((T - c.tIn) / LEAF_IN);
      var gout = c.tOut === Infinity ? 0 : clamp01((T - c.tOut) / LEAF_OUT);
      // shaded inner growth darkens and dwindles rather than turning see-through
      var s = c.r * scale * easeOutBack(gin) * (1 - 0.75 * gout);
      if (s < 0.6) continue;
      var lv = gout ? Math.max(0, c.lv - Math.round(gout * 3)) : c.lv;
      ctx.globalAlpha = Math.min(1, gin * 8) * (1 - gout * gout * gout);
      ctx.drawImage(atlas, c.v * CELL + 2, lv * CELL + 2, SPR, SPR, X(c.x) - s, Y(c.y) - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  function drawYoungLeaves(T) {
    for (var i = 0; i < youngLeaves.length; i++) {
      var L = youngLeaves[i];
      if (T <= L.tIn || T >= L.tOut + LEAF_OUT) continue;
      var gin = clamp01((T - L.tIn) / LEAF_IN);
      var gout = L.tOut === Infinity ? 0 : clamp01((T - L.tOut) / LEAF_OUT);
      var s = L.size * scale * easeOutBack(gin);
      if (s < 1) continue;
      // a shed seedling leaf yellows, then flutters down towards the grass
      var n = L.n, fall = smooth((gout - 0.35) / 0.65);
      var x = X(nx[n]) + Math.sin(fall * 7 + i) * s * 0.7 * fall;
      var y = Y(ny[n]) + fall * fall * Math.min(ny[n] * scale * 0.9, s * 9);
      var rot = L.rot + fall * (i % 2 ? 2.4 : -2.4);
      var cs = Math.cos(rot) * s, sn = Math.sin(rot) * s;
      ctx.globalAlpha = Math.min(1, gin * 6) * (1 - smooth((gout - 0.75) / 0.25));
      ctx.setTransform(dpr * cs, dpr * sn, -dpr * sn, dpr * cs, dpr * x, dpr * y);
      // fresh, slightly glossy spring leaf with a pale midrib
      ctx.fillStyle = gout ? autumn(0.62 + L.shade, smooth(gout / 0.5)) : leafColor(0.62 + L.shade);
      fillLeaf(ctx);
      ctx.strokeStyle = "rgba(200,220,150,.55)";
      ctx.lineWidth = 0.06;
      ctx.beginPath(); ctx.moveTo(0, 0.12); ctx.lineTo(0, -0.85); ctx.stroke();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.globalAlpha = 1;
  }

  function autumn(b, f) {
    // green → straw yellow → brown as a shed leaf dies
    b = clamp01(b) * (RAMP.length - 1);
    var c0 = RAMP[Math.min(RAMP.length - 1, Math.round(b))];
    var y = [196, 164, 74], br = [140, 98, 52], t = f < 0.6 ? f / 0.6 : 1, u = f < 0.6 ? 0 : (f - 0.6) / 0.4;
    var r = c0[0] + (y[0] - c0[0]) * t, g = c0[1] + (y[1] - c0[1]) * t, bl = c0[2] + (y[2] - c0[2]) * t;
    r += (br[0] - r) * u; g += (br[1] - g) * u; bl += (br[2] - bl) * u;
    return "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(bl) + ")";
  }
  function weather(hex, dk) {
    // darkens the empty acorn shell as it decays into the soil
    var v = parseInt(hex.slice(1), 16), r = v >> 16, g = (v >> 8) & 255, b = v & 255, m = dk * 0.6;
    return "rgb(" + Math.round(r + (58 - r) * m) + "," + Math.round(g + (42 - g) * m) + "," + Math.round(b + (30 - b) * m) + ")";
  }

  /* ---------- the acorn: sits on the soil, cracks, and roots before the shoot appears ---------- */
  function drawAcorn(T) {
    if (T > 0.4) return;
    var fade = 1 - smooth((T - 0.29) / 0.1), dk = smooth((T - 0.15) / 0.13);
    if (fade <= 0) return;
    var k = scale * 0.019;          // acorn half-width in px
    var x = X(-0.024), y = oy - k * 1.05;
    ctx.save();
    ctx.globalAlpha = fade;
    // radicle: a pale root curling down into the soil once the shell cracks
    var rg = smooth((T - 0.03) / 0.06);
    if (rg > 0) {
      ctx.strokeStyle = "rgba(226,214,180,.95)";
      ctx.lineWidth = Math.max(1, k * 0.32);
      ctx.beginPath();
      ctx.moveTo(x + k * 0.45, y + k * 0.9);
      ctx.quadraticCurveTo(x + k * (0.6 + 0.9 * rg), y + k * (1.1 + 0.4 * rg), x + k * (0.5 + 1.1 * rg), y + k * (1.2 + 1.3 * rg));
      ctx.stroke();
    }
    ctx.translate(x, y);
    ctx.rotate(-0.42 + 0.06 * Math.sin(clamp01(T / 0.08) * Math.PI * 3));
    // nut
    var body = ctx.createRadialGradient(-k * 0.35, -k * 0.2, k * 0.1, 0, k * 0.2, k * 1.4);
    body.addColorStop(0, weather("#c99a55", dk));
    body.addColorStop(0.55, weather("#9a6a33", dk));
    body.addColorStop(1, weather("#5e3c1c", dk));
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-k, -k * 0.2);
    ctx.bezierCurveTo(-k, k * 1.0, -k * 0.35, k * 1.55, 0, k * 1.62);
    ctx.bezierCurveTo(k * 0.35, k * 1.55, k, k * 1.0, k, -k * 0.2);
    ctx.closePath();
    ctx.fill();
    // faint lengthwise stripes and a glossy highlight
    ctx.strokeStyle = "rgba(80,50,24,.25)"; ctx.lineWidth = Math.max(0.5, k * 0.06);
    for (var s = -1; s <= 1; s++) {
      ctx.beginPath(); ctx.moveTo(s * k * 0.45, 0); ctx.quadraticCurveTo(s * k * 0.5, k * 0.9, s * k * 0.15, k * 1.45); ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,240,210," + (0.35 * (1 - dk)).toFixed(3) + ")";
    ctx.beginPath(); ctx.ellipse(-k * 0.45, k * 0.35, k * 0.14, k * 0.45, 0.15, 0, Math.PI * 2); ctx.fill();
    // crack that opens as it germinates
    var cr = smooth((T - 0.025) / 0.04);
    if (cr > 0) {
      ctx.strokeStyle = "rgba(50,30,14," + (0.8 * cr) + ")"; ctx.lineWidth = Math.max(0.6, k * 0.08);
      ctx.beginPath(); ctx.moveTo(k * 0.1, k * 1.58); ctx.lineTo(k * 0.25, k * (1.58 - 0.7 * cr)); ctx.lineTo(k * 0.05, k * (1.58 - 1.1 * cr)); ctx.stroke();
    }
    // scaly cup
    var cup = ctx.createLinearGradient(0, -k * 0.9, 0, k * 0.1);
    cup.addColorStop(0, weather("#7d6142", dk));
    cup.addColorStop(1, weather("#4d3720", dk));
    ctx.fillStyle = cup;
    ctx.beginPath();
    ctx.moveTo(-k * 1.12, -k * 0.05);
    ctx.bezierCurveTo(-k * 1.2, -k * 0.75, -k * 0.5, -k * 0.98, 0, -k * 0.98);
    ctx.bezierCurveTo(k * 0.5, -k * 0.98, k * 1.2, -k * 0.75, k * 1.12, -k * 0.05);
    ctx.quadraticCurveTo(0, k * 0.22, -k * 1.12, -k * 0.05);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,26,12,.45)"; ctx.lineWidth = Math.max(0.5, k * 0.07);
    for (var row = 0; row < 3; row++) {
      var yy = -k * (0.18 + row * 0.24), span = 1.05 - row * 0.22;
      ctx.beginPath();
      for (var sc = -span; sc < span; sc += 0.3) ctx.arc(k * (sc + 0.15), yy, k * 0.15, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    }
    ctx.fillStyle = "#4a3420";
    ctx.fillRect(-k * 0.09, -k * 1.32, k * 0.18, k * 0.4);
    ctx.restore();
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
