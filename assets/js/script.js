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
