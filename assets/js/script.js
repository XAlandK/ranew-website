(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mainNav.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  function onScrollSpy() {
    var scrollPos = window.scrollY + 140;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    if (window.scrollY < 80) currentId = "top";
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href.charAt(0) !== "#") return;
      var target = href.replace("#", "");
      link.classList.toggle("active", target === currentId);
    });
  }
  onScrollSpy();
  window.addEventListener("scroll", onScrollSpy, { passive: true });

  /* ---------- Book promo: linked scroll timeline ----------
     One master timeline is scrubbed by scroll while the banner is pinned. Each child tween is
     linked to the one before it (starts at an offset into the previous), so the sequence plays
     books → fan → text forwards when scrolling down and rewinds when scrolling up. */
  var promoSection = document.querySelector(".promo-section");
  var promo = promoSection && promoSection.querySelector(".promo");
  if (promo && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    // wrap the container in a sticky pin
    var pin = document.createElement("div");
    pin.className = "promo-section__pin";
    while (promoSection.firstChild) pin.appendChild(promoSection.firstChild);
    promoSection.appendChild(pin);
    promoSection.classList.add("is-pinned");

    var q = function (sel) { return promo.querySelector(sel); };
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var tracks = [];   // { el, from, to, start, dur }
    var cursor = 0;
    // add(el, from, to, dur, offset): offset is relative to the END of the previous tween ("-=" overlap if negative)
    var add = function (el, from, to, dur, offset) {
      if (!el) return;
      var start = Math.max(0, cursor + (offset || 0));
      el.setAttribute("data-tl", "");
      tracks.push({ el: el, from: from, to: to, start: start, dur: dur });
      cursor = start + dur;
    };
    var BOOK = { x: 0, y: 0, r: 0, s: 1, o: 1 };
    var at = function (o) { var r = {}; for (var k in BOOK) r[k] = k in o ? o[k] : BOOK[k]; return r; };

    // 1) books drop in one after another (stacked), 2) fan out, 3) text lines follow
    add(q(".promo__book-img--back"),  at({ y: 60, r: -25, o: 0, s: .9 }), at({ x: 4, y: 4, r: -8 }), .16);
    add(q(".promo__book-img--mid"),   at({ y: 60, r: 20, o: 0, s: .9 }),  at({ x: 2, y: 2, r: -3 }), .16, -.08);
    add(q(".promo__book-img--front"), at({ y: 70, r: -12, o: 0, s: .9 }), at({ r: 2 }), .16, -.08);
    add(q(".promo__book-img--back"),  at({ x: 4, y: 4, r: -8 }), at({ x: -38, y: 8, r: -17 }), .16, 0);
    add(q(".promo__book-img--mid"),   at({ x: 2, y: 2, r: -3 }), at({ x: 38, y: 6, r: 12 }), .16, -.16);
    add(q(".promo__book-img--front"), at({ r: 2 }), at({ y: -4, r: 3, s: 1.04 }), .16, -.16);
    add(q(".promo__content .eyebrow"), at({ y: 30, o: 0 }), at({}), .1, -.08);
    add(q(".promo__title"),            at({ y: 30, o: 0 }), at({}), .1, -.05);
    add(q(".promo__desc"),             at({ y: 30, o: 0 }), at({}), .1, -.05);
    add(q(".promo__content .btn"),     at({ y: 30, o: 0, s: .95 }), at({}), .1, -.05);
    var total = cursor;
    // background calligraphy drifts across the whole timeline
    var overlay = q(".promo__overlay");

    // tracks that share an element: later tweens only take over once they have started
    var byEl = new Map();
    tracks.forEach(function (t) { (byEl.get(t.el) || byEl.set(t.el, []).get(t.el)).push(t); });

    var render = function (p) {
      var time = p * total;
      byEl.forEach(function (list, el) {
        var active = list[0];
        for (var i = 1; i < list.length; i++) if (time >= list[i].start) active = list[i];
        var t = ease(Math.min(1, Math.max(0, (time - active.start) / active.dur)));
        var v = {}; for (var k in BOOK) v[k] = lerp(active.from[k], active.to[k], t);
        // books move in % of their own size; text in px
        var unit = el.tagName === "IMG" ? "%" : "px";
        el.style.transform = "translate(" + v.x.toFixed(2) + unit + "," + v.y.toFixed(2) + unit + ") rotate(" + v.r.toFixed(2) + "deg) scale(" + v.s.toFixed(3) + ")";
        el.style.opacity = v.o.toFixed(3);
      });
      if (overlay) overlay.style.transform = "translateY(" + (lerp(30, -30, p)).toFixed(1) + "px) rotate(" + lerp(4, -4, p).toFixed(2) + "deg) scale(1.08)";
    };

    var target = 0, current = 0, raf = 0;
    var read = function () {
      var r = promoSection.getBoundingClientRect();
      var travel = r.height - window.innerHeight;
      var p = travel > 0 ? -r.top / travel : 1;
      // leave a little dwell at both ends of the pin
      p = (p - 0.05) / 0.85;
      target = p < 0 ? 0 : p > 1 ? 1 : p;
    };
    var tick = function () {
      var d = target - current;
      if (Math.abs(d) < 0.0008) { current = target; raf = 0; }
      else { current += d * 0.12; raf = requestAnimationFrame(tick); }
      render(current);
    };
    var onScroll = function () { read(); if (!raf) raf = requestAnimationFrame(tick); };
    // shrink the banner if it is taller than the space under the fixed header (small phones)
    var fit = function () {
      var box = pin.firstElementChild;
      box.style.transform = "";
      var avail = window.innerHeight - 83 - 16;
      var s = Math.min(1, avail / promo.offsetHeight);
      if (s < 1) box.style.transform = "scale(" + s.toFixed(3) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { fit(); onScroll(); });
    fit(); read(); current = target; render(current);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, (i % 4) * 90);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var statNums = Array.prototype.slice.call(document.querySelectorAll(".stat__num"));
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value.toLocaleString("en-US") + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (statNums.length) {
    if ("IntersectionObserver" in window) {
      var statIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      statNums.forEach(function (el) { statIo.observe(el); });
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------- Image zoom (magnifier), Amazon-style ---------- */
  (function () {
    var covers = Array.prototype.slice.call(document.querySelectorAll(".book-row__cover"));
    if (!covers.length) return;

    var backdrop = document.createElement("div");
    backdrop.className = "zoom-backdrop";
    document.body.appendChild(backdrop);

    var activeHide = null;

    covers.forEach(function (cover) {
      var img = cover.querySelector("img");
      if (!img) return;

      var lens, result;
      var lensSize = 110;

      function build() {
        lens = document.createElement("div");
        lens.className = "zoom-lens";
        result = document.createElement("div");
        result.className = "zoom-result";
        cover.appendChild(lens);
        document.body.appendChild(result);
        result.style.backgroundImage = "url(" + JSON.stringify(img.currentSrc || img.src) + ")";
      }

      /* The image renders with object-fit:contain, so its visible pixels
         occupy a letterboxed sub-box of the element's own rect. Zoom math
         must use that content box, not the full element box, or the
         magnified result gets stretched to the element's aspect ratio. */
      function getContentBox() {
        var rect = img.getBoundingClientRect();
        var natW = img.naturalWidth || rect.width;
        var natH = img.naturalHeight || rect.height;
        var boxAspect = rect.width / rect.height;
        var imgAspect = natW / natH;
        var width, height;
        if (imgAspect > boxAspect) {
          width = rect.width;
          height = rect.width / imgAspect;
        } else {
          height = rect.height;
          width = rect.height * imgAspect;
        }
        return {
          left: rect.left + (rect.width - width) / 2,
          top: rect.top + (rect.height - height) / 2,
          coverLeft: cover.getBoundingClientRect().left,
          coverTop: cover.getBoundingClientRect().top,
          width: width,
          height: height
        };
      }

      function update(clientX, clientY) {
        if (!lens) build();
        var box = getContentBox();

        var x = clientX - box.left;
        var y = clientY - box.top;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > box.width) x = box.width;
        if (y > box.height) y = box.height;

        var lensX = x - lensSize / 2;
        var lensY = y - lensSize / 2;
        var maxLensX = Math.max(0, box.width - lensSize);
        var maxLensY = Math.max(0, box.height - lensSize);
        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > maxLensX) lensX = maxLensX;
        if (lensY > maxLensY) lensY = maxLensY;

        lens.style.width = lensSize + "px";
        lens.style.height = lensSize + "px";
        lens.style.left = (box.left - box.coverLeft + lensX) + "px";
        lens.style.top = (box.top - box.coverTop + lensY) + "px";

        var resultW = result.offsetWidth;
        var resultH = result.offsetHeight;
        var factor = Math.min(resultW, resultH) / lensSize;
        result.style.backgroundSize = (box.width * factor) + "px " + (box.height * factor) + "px";
        result.style.backgroundPosition = "-" + (lensX * factor) + "px -" + (lensY * factor) + "px";

        result.style.left = ((window.innerWidth - resultW) / 2) + "px";
        result.style.top = ((window.innerHeight - resultH) / 2) + "px";
      }

      function show() {
        if (!lens) build();
        lens.style.display = "block";
        result.style.display = "block";
        backdrop.style.display = "block";
        activeHide = hide;
      }
      function hide() {
        if (lens) lens.style.display = "none";
        if (result) result.style.display = "none";
        backdrop.style.display = "none";
        if (activeHide === hide) activeHide = null;
      }

      cover.addEventListener("mouseenter", function (e) {
        update(e.clientX, e.clientY);
        show();
      });
      cover.addEventListener("mousemove", function (e) {
        update(e.clientX, e.clientY);
      });
      cover.addEventListener("mouseleave", hide);

      /* Fallback for touch devices (and any device where hover events
         don't fire reliably): tap to open centered on the tap point,
         tap again to close. */
      cover.addEventListener("click", function (e) {
        if (result && result.style.display === "block") {
          hide();
          return;
        }
        var point = (e.touches && e.touches[0]) || e;
        update(point.clientX, point.clientY);
        show();
      });
    });

    document.addEventListener("click", function (e) {
      if (activeHide && !e.target.closest(".book-row__cover")) activeHide();
    });
  })();

  /* ---------- Team photo viewer: tap / click an avatar to see it full size ---------- */
  (function () {
    var avatars = Array.prototype.slice.call(document.querySelectorAll(".team-card__avatar--photo"));
    if (!avatars.length) return;

    var box = document.createElement("div");
    box.className = "photo-viewer";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.hidden = true;
    box.innerHTML =
      '<button type="button" class="photo-viewer__close" data-i18n-attr="aria-label:aria.closePhoto" aria-label="داخستنی وێنە">&times;</button>' +
      '<figure class="photo-viewer__figure"><img class="photo-viewer__img" alt="">' +
      '<figcaption class="photo-viewer__caption"><strong></strong><span></span></figcaption></figure>';
    document.body.appendChild(box);

    var closeBtn = box.querySelector(".photo-viewer__close");
    var bigImg = box.querySelector(".photo-viewer__img");
    var capName = box.querySelector(".photo-viewer__caption strong");
    var capRole = box.querySelector(".photo-viewer__caption span");
    var opener = null, hideTimer = 0;

    function open(avatar) {
      var img = avatar.querySelector("img");
      var card = avatar.closest(".team-card");
      var name = card && card.querySelector("h3");
      var role = card && card.querySelector("p");
      clearTimeout(hideTimer);
      opener = avatar;
      bigImg.src = img.currentSrc || img.src;
      bigImg.alt = name ? name.textContent : "";
      capName.textContent = name ? name.textContent : "";
      capRole.textContent = role ? role.textContent : "";
      box.setAttribute("aria-label", capName.textContent);
      box.hidden = false;
      document.documentElement.classList.add("photo-viewer-open");
      void box.offsetWidth; // start the fade from the hidden state
      box.classList.add("is-open");
      closeBtn.focus();
    }
    function close() {
      if (box.hidden) return;
      box.classList.remove("is-open");
      document.documentElement.classList.remove("photo-viewer-open");
      hideTimer = setTimeout(function () { box.hidden = true; }, 250);
      if (opener) opener.focus();
      opener = null;
    }

    avatars.forEach(function (avatar, i) {
      var img = avatar.querySelector("img");
      var name = avatar.closest(".team-card") && avatar.closest(".team-card").querySelector("h3");
      if (!img) return;
      // the avatar becomes a button named after the member (follows language switches via aria-labelledby)
      avatar.removeAttribute("aria-hidden");
      avatar.setAttribute("role", "button");
      avatar.setAttribute("tabindex", "0");
      if (name) {
        if (!name.id) name.id = "team-member-" + (i + 1);
        avatar.setAttribute("aria-labelledby", name.id);
      }
      avatar.addEventListener("click", function () { open(avatar); });
      avatar.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(avatar); }
      });
    });

    closeBtn.addEventListener("click", close);
    // tapping anywhere outside the photo closes it
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("photo-viewer__figure")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); }
    });
  })();

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  function onScrollBackToTop() {
    backToTop.classList.toggle("is-visible", window.scrollY > 480);
  }
  onScrollBackToTop();
  window.addEventListener("scroll", onScrollBackToTop, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
