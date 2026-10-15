/* ============================================================
   The good tree (Ibrahim 14:24–25), revealed with scroll.
   The section is pinned while the reader scrolls through it:
   - during the first step the tree grows out of the "good word" (scrubbed, forwards and back);
   - after that, each fifth of the scroll is one step: the section gets data-step="1"…"5",
     which the CSS uses to light up that part of the tree, and the matching card,
     verse phrase and step button get .is-active.
   ============================================================ */
(function () {
  "use strict";
  var section = document.getElementById("tree");
  if (!section) return;
  var STEPS = 5;
  var GROW_END = 0.15;    // the tree is fully grown by this point of the scroll
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var svg = section.querySelector(".gtree__svg");
  var roots = svg.querySelector(".gt-roots");
  var trunk = svg.querySelector(".gt-trunk");
  var canopy = svg.querySelector(".gt-canopy");
  var bar = document.getElementById("treeBar");
  var marked = Array.prototype.slice.call(section.querySelectorAll(".gtree__card, .gtree__phrase, .gtree__step"));
  var buttons = Array.prototype.slice.call(section.querySelectorAll(".gtree__step"));

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
  function easeOutBack(t) { t = clamp01(t); var c = 1.3; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  // SVG transform attributes (not CSS) so the pivots are exact in every browser
  function scaleAbout(el, x, y, sx, sy) {
    el.setAttribute("transform", "translate(" + x + " " + y + ") scale(" + sx.toFixed(4) + " " + sy.toFixed(4) + ") translate(" + -x + " " + -y + ")");
  }
  var lastGrow = -1;
  function grow(g) {
    if (Math.abs(g - lastGrow) < 0.0005) return;
    lastGrow = g;
    var r = smooth(g / 0.45), t = smooth((g - 0.15) / 0.45), c = easeOutBack((g - 0.45) / 0.55);
    scaleAbout(roots, 300, 520, r, r);
    scaleAbout(trunk, 300, 524, 0.55 + 0.45 * t, t);
    scaleAbout(canopy, 300, 390, c, c);
    canopy.style.visibility = c > 0.001 ? "" : "hidden";
  }

  var step = 0;
  function setStep(s) {
    if (s === step) return;
    step = s;
    section.setAttribute("data-step", String(s));
    marked.forEach(function (el) { el.classList.toggle("is-active", +el.getAttribute("data-step") === s); });
    buttons.forEach(function (el) { el.setAttribute("aria-pressed", +el.getAttribute("data-step") === s ? "true" : "false"); });
  }

  function render(T) {
    grow(T / GROW_END);
    if (bar) bar.style.width = (T * 100).toFixed(1) + "%";
    setStep(Math.min(STEPS, Math.floor(T * STEPS) + 1));
  }

  /* ---------- scroll → progress (smoothed) ---------- */
  var FINISH = 0.94;      // reach the last step slightly before the section unpins
  var target = 0, current = 0, rafId = 0;
  function travel() { return section.offsetHeight - window.innerHeight; }
  function readTarget() {
    var tr = travel();
    var p = tr > 0 ? clamp01(-section.getBoundingClientRect().top / tr) : 1;
    target = clamp01(p / FINISH);
  }
  function tick() {
    var d = target - current;
    if (reduceMotion || Math.abs(d) < 0.0005) { current = target; rafId = 0; }
    else { current += d * 0.14; rafId = requestAnimationFrame(tick); }
    render(current);
  }
  function onScroll() {
    readTarget();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // the step buttons jump to the middle of their step (step 1: once the tree has grown)
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = +btn.getAttribute("data-step");
      var T = i === 1 ? GROW_END + 0.02 : (i - 0.5) / STEPS;
      var top = window.pageYOffset + section.getBoundingClientRect().top;
      window.scrollTo({ top: top + T * FINISH * travel(), behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  readTarget(); current = target;
  render(current);
})();
