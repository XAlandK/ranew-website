/* Intro loader video: plays once per session (like nishtmansi.com), then fades out.
   Loaded right after the #loader markup so the page never flashes underneath.
   If the browser refuses to autoplay video (iOS Low Power Mode, some Android data savers),
   the same clip is shown as an animated WebP (assets/video/loader.webp) instead. */
(function () {
  var loader = document.getElementById("loader");
  var video = document.getElementById("loaderVideo");
  var FALLBACK = "assets/video/loader.webp";
  var FALLBACK_MS = 3700;                           // length of the clip
  var seen = false;
  try { seen = sessionStorage.getItem("ranewIntroSeen") === "1"; } catch (e) {}
  var saveData = navigator.connection && navigator.connection.saveData;
  if (seen || saveData || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    loader.remove(); return;
  }
  document.documentElement.classList.add("is-loading");
  var done = false, usingFallback = false;
  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem("ranewIntroSeen", "1"); } catch (e) {}
    document.documentElement.classList.remove("is-loading");
    loader.classList.add("is-done");
    setTimeout(function () { loader.remove(); }, 800);
  }
  function fallback() {
    if (done || usingFallback) return;
    usingFallback = true;
    var img = new Image();
    img.alt = "";
    img.onload = function () {
      if (done) return;
      video.replaceWith(img);
      loader.classList.add("is-image");
      setTimeout(finish, FALLBACK_MS);
    };
    img.onerror = finish;                           // nothing playable: just show the site
    img.src = FALLBACK;
  }
  video.addEventListener("ended", finish);
  video.addEventListener("error", fallback);
  document.getElementById("loaderSkip").addEventListener("click", finish);
  video.muted = true;                               // iOS/Android only autoplay muted, inline video
  video.setAttribute("muted", "");
  var p = video.play();
  if (p && p.catch) p.catch(fallback);              // autoplay blocked (e.g. iOS Low Power Mode)
  // not started after 3s (blocked without an error, or a very slow connection): try the image, then give up
  setTimeout(function () { if (!usingFallback && !video.currentTime) fallback(); }, 3000);
  setTimeout(finish, 12000);                        // hard cap so the site is never blocked
})();
