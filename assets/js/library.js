(function () {
  "use strict";

  /* ---------- Library: pick a book from the shelf (library.html) ----------
     Moving the cursor along the shelf lifts the books near it in a soft wave that falls
     off with distance, and picks the one under it: that book stays pulled out and its
     page is shown on the stand below. Touch picks by tapping; keyboard by arrow keys. */
  var shelf = document.getElementById("shelf");
  var stand = document.getElementById("bookStand");
  if (!shelf || !stand) return;
  var bookcase = shelf.closest(".bookcase");

  var spines = Array.prototype.slice.call(shelf.querySelectorAll(".spine"));
  var pages = {};
  Array.prototype.forEach.call(stand.querySelectorAll(".stand__book"), function (el) {
    pages[el.getAttribute("data-book")] = el;
  });

  var WAVE = 30;    // px the book right under the cursor rises
  var SPREAD = 44;  // px; how far the wave reaches into the neighbouring books
  var SPREAD_3D = 20; // in 3D only the book under the cursor comes out, as when taking one off a shelf
  var PICKED = 16;  // px the picked book stays pulled out
  var REACH = 90;   // px; further than this from every spine, the cursor picks nothing new

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = shelf.querySelector(".spine.is-selected") || spines[0];
  var pointerX = null, frame = 0;

  function pick(spine) {
    if (spine === current) return;
    current.classList.remove("is-selected");
    current.setAttribute("aria-pressed", "false");
    current.tabIndex = -1;
    pages[current.getAttribute("data-book")].classList.remove("is-active");
    current = spine;
    spine.classList.add("is-selected");
    spine.setAttribute("aria-pressed", "true");
    spine.tabIndex = 0;
    pages[spine.getAttribute("data-book")].classList.add("is-active");
  }

  function layout() {
    frame = 0;
    var nearest = null, best = Infinity;
    var spread = bookcase.classList.contains("bookcase--3d") ? SPREAD_3D : SPREAD;
    var lifts = spines.map(function (s) {
      if (pointerX === null) return 0;
      var r = s.getBoundingClientRect();
      var dx = pointerX - (r.left + r.width / 2);
      if (Math.abs(dx) < best) { best = Math.abs(dx); nearest = s; }
      return WAVE * Math.exp(-(dx * dx) / (2 * spread * spread));
    });
    if (nearest && best <= REACH) pick(nearest);
    spines.forEach(function (s, i) {
      s.style.setProperty("--lift", (lifts[i] + (s === current ? PICKED : 0)).toFixed(1));
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(layout); }

  // the wave follows a mouse or pen; a finger scrolls the shelf and picks by tapping
  shelf.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    pointerX = e.clientX;
    schedule();
  });
  shelf.addEventListener("pointerleave", function () { pointerX = null; schedule(); });
  // the bookcase's inside scrolls on narrow screens, sliding the books under a resting cursor;
  // the 3D camera rides on the shelf, so it is re-aimed at the middle of what is in view
  var scroller = shelf.parentNode;
  function aimCamera() {
    var view = scroller.getBoundingClientRect(), box = shelf.getBoundingClientRect();
    shelf.style.setProperty("--eye-x", Math.round(view.left + view.width / 2 - box.left) + "px");
  }
  scroller.addEventListener("scroll", function () {
    aimCamera();
    if (pointerX !== null) schedule();
  }, { passive: true });
  window.addEventListener("resize", aimCamera);
  aimCamera();

  spines.forEach(function (spine) {
    spine.addEventListener("focus", function () {
      // a keyboard pick wins over wherever the mouse happens to rest on the shelf
      if (matchesFocusVisible(spine)) pointerX = null;
      pick(spine);
      schedule();
    });
    spine.addEventListener("click", function () {
      pick(spine);
      schedule();
      // taking a book off the shelf brings its page on the stand into view
      if (stand.getBoundingClientRect().top > window.innerHeight * 0.6) {
        stand.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
  });

  shelf.addEventListener("keydown", function (e) {
    var i = spines.indexOf(current);
    var rtl = getComputedStyle(shelf).direction === "rtl";
    var next;
    if (e.key === "ArrowLeft") next = spines[i + (rtl ? 1 : -1)];
    else if (e.key === "ArrowRight") next = spines[i + (rtl ? -1 : 1)];
    else if (e.key === "Home") next = spines[0];
    else if (e.key === "End") next = spines[spines.length - 1];
    else return;
    e.preventDefault();
    pointerX = null;
    if (next) next.focus();
  });

  /* ---------- Fit every full title on its spine ----------
     A title wraps onto as many lines as its spine is wide, and its font shrinks until
     the whole title fits, so none is cut short. It runs again once the web font has
     loaded, when the language switch replaces the titles, and when the spines resize. */
  var MIN_TITLE_PX = 9;
  function fitTitles() {
    spines.forEach(function (s) {
      var box = s.querySelector(".spine__title");
      var text = box.firstElementChild;
      box.style.fontSize = "";
      var size = parseFloat(getComputedStyle(box).fontSize);
      while (size > MIN_TITLE_PX && (text.offsetWidth > box.clientWidth || text.offsetHeight > box.clientHeight)) {
        size -= 0.5;
        box.style.fontSize = size + "px";
      }
    });
  }
  var fitFrame = 0;
  function scheduleFit() {
    if (!fitFrame) fitFrame = requestAnimationFrame(function () { fitFrame = 0; fitTitles(); });
  }
  fitTitles();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
  if ("MutationObserver" in window) new MutationObserver(scheduleFit).observe(shelf, { childList: true, subtree: true });
  window.addEventListener("resize", scheduleFit);

  function matchesFocusVisible(el) {
    try { return el.matches(":focus-visible"); } catch (e) { return true; }
  }

  /* ---------- 2D / 3D shelf switch, remembered per browser ---------- */
  var viewBtns = Array.prototype.slice.call(document.querySelectorAll("[data-shelf-view]"));
  var VIEW_KEY = "ranew_shelf_view";
  function setView(view) {
    bookcase.classList.toggle("bookcase--3d", view === "3d");
    viewBtns.forEach(function (btn) {
      var on = btn.getAttribute("data-shelf-view") === view;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  viewBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var view = btn.getAttribute("data-shelf-view");
      setView(view);
      try { localStorage.setItem(VIEW_KEY, view); } catch (e) {}
    });
  });
  var savedView = null;
  try { savedView = localStorage.getItem(VIEW_KEY); } catch (e) {}
  if (savedView === "2d" || savedView === "3d") setView(savedView);

  layout();
})();
