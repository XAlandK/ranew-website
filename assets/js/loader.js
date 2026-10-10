/* Intro loader video: plays once per session (like nishtmansi.com), then fades out.
   Loaded right after the #loader markup so the page never flashes underneath. */
(function () {
  var loader = document.getElementById("loader");
  var video = document.getElementById("loaderVideo");
  var seen = false;
  try { seen = sessionStorage.getItem("ranewIntroSeen") === "1"; } catch (e) {}
  if (seen || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    loader.remove(); return;
  }
  document.documentElement.classList.add("is-loading");
  var done = false;
  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem("ranewIntroSeen", "1"); } catch (e) {}
    document.documentElement.classList.remove("is-loading");
    loader.classList.add("is-done");
    setTimeout(function () { loader.remove(); }, 800);
  }
  video.addEventListener("ended", finish);
  video.addEventListener("error", finish);          // missing/unsupported file: never block the site
  document.getElementById("loaderSkip").addEventListener("click", finish);
  var p = video.play(); if (p && p.catch) p.catch(finish);
  setTimeout(finish, 12000);                        // hard cap in case the video stalls
})();
