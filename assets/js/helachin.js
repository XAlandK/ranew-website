(function () {
  "use strict";

  var MAX_UPLOAD_MB = 20; // keep in sync with backend MAX_UPLOAD_MB (backend/.env)
  var UPLOAD_TIMEOUT_MS = 300000; // 5 minutes — covers slow connections uploading a large file
  var DOWNLOAD_TIMEOUT_MS = 120000; // 2 minutes — fetching the finished result
  var POLL_INTERVAL_MS = 2500;
  var POLL_TIMEOUT_MS = 30000; // a single status check should be near-instant
  var MAX_POLL_FAILURES = 5; // consecutive network failures before giving up

  // Correction on a large real document can take minutes — the algorithm
  // itself is slow at that scale, not the connection — so the backend runs
  // it as a background job and this page polls for completion instead of
  // holding one long request open (which is what timed out in production).

  var MSG = {
    unsupportedType: "تکایە تەنها فایلێکی .docx باربکە.",
    emptyFile: "فایلەکە بەتاڵە یان بە دروستی هەڵنەبژێردراوە.",
    tooLarge: "قەبارەی فایلەکە زۆر گەورەیە (زۆرترین قەبارە " + MAX_UPLOAD_MB + " مێگابایت). تکایە بەڵگەنامەیەکی بچووکتر باربکە.",
    network: "پەیوەندی بە ڕاژەکارەوە سەرکەوتوو نەبوو. تکایە ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵبدەرەوە.",
    timeout: "کاتی چاوەڕوانی تەواو بوو. تکایە دووبارە هەوڵبدەرەوە.",
    fallback: "هەڵەیەکی چاوەڕواننەکراو ڕوویدا. تکایە دواتر هەوڵبدەرەوە.",
    uploading: "بەڵگەنامەکە بار دەکرێت...",
    processing: "بەڵگەنامەکە چاک دەکرێتەوە... ئەمە بۆ بەڵگەنامەی گەورە دەکرێت چەند خولەکێک بخایەنێت.",
    emptyText: "تکایە دەقێک بنووسە بۆ چاککردن.",
    processingText: "دەقەکە چاک دەکرێتەوە..."
  };

  var TEXT_TIMEOUT_MS = 30000;

  function resolveApiBase() {
    var isLocalHost = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    if (isLocalHost) return "http://127.0.0.1:8001";
    var meta = document.querySelector('meta[name="helachin-api-base"]');
    return meta ? meta.getAttribute("content").trim().replace(/\/+$/, "") : "";
  }
  var API_BASE_URL = resolveApiBase();

  var drop = document.getElementById("helachinDrop");
  var fileInput = document.getElementById("helachinFileInput");
  var fileBox = document.getElementById("helachinFile");
  var fileName = document.getElementById("helachinFileName");
  var fileSize = document.getElementById("helachinFileSize");
  var fileRemove = document.getElementById("helachinFileRemove");
  var startBtn = document.getElementById("helachinStart");
  var progressBox = document.getElementById("helachinProgress");
  var progressFill = document.getElementById("helachinProgressFill");
  var statusText = document.getElementById("helachinStatus");
  var successBox = document.getElementById("helachinSuccess");
  var errorBox = document.getElementById("helachinError");
  var errorMessage = document.getElementById("helachinErrorMessage");
  var downloadLink = document.getElementById("helachinDownload");
  var retryAfterSuccess = document.getElementById("helachinRetryAfterSuccess");
  var retryAfterError = document.getElementById("helachinRetryAfterError");

  var textInput = document.getElementById("helachinTextInput");
  var textSubmit = document.getElementById("helachinTextSubmit");
  var textStatus = document.getElementById("helachinTextStatus");
  var textResult = document.getElementById("helachinTextResult");
  var textOutput = document.getElementById("helachinTextOutput");
  var textErrorBox = document.getElementById("helachinTextError");
  var textErrorMessage = document.getElementById("helachinTextErrorMessage");

  if (!drop) return; // this script only applies to helachin.html

  var selectedFile = null;
  var currentXhr = null;
  var lastObjectUrl = null;

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function resetToIdle() {
    selectedFile = null;
    fileInput.value = "";
    fileBox.hidden = true;
    drop.hidden = false;
    startBtn.disabled = true;
    progressBox.hidden = true;
    successBox.hidden = true;
    errorBox.hidden = true;
    setProgress(0, false);
    if (lastObjectUrl) {
      URL.revokeObjectURL(lastObjectUrl);
      lastObjectUrl = null;
    }
  }

  function setProgress(pct, indeterminate) {
    progressFill.style.width = pct + "%";
    progressFill.classList.toggle("is-indeterminate", !!indeterminate);
  }

  function showFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    drop.hidden = true;
    fileBox.hidden = false;
    startBtn.disabled = false;
    errorBox.hidden = true;
    successBox.hidden = true;
  }

  function validateAndSetFile(file) {
    if (!file) return;
    var lowerName = (file.name || "").toLowerCase();
    if (!lowerName.endsWith(".docx")) {
      showError(MSG.unsupportedType);
      return;
    }
    if (file.size === 0) {
      showError(MSG.emptyFile);
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      showError(MSG.tooLarge);
      return;
    }
    showFile(file);
  }

  function showError(message) {
    progressBox.hidden = true;
    successBox.hidden = true;
    errorMessage.textContent = message;
    errorBox.hidden = false;
  }

  function extractFilename(xhr, fallback) {
    var header = xhr.getResponseHeader("Content-Disposition") || "";
    // Prefer filename* (RFC 6266, UTF-8 percent-encoded) so non-ASCII names
    // (Kurdish/Arabic) come through correctly instead of the ASCII fallback.
    var star = /filename\*=UTF-8''([^;]+)/i.exec(header);
    if (star) {
      try { return decodeURIComponent(star[1]); } catch (e) { /* fall through */ }
    }
    var match = /filename="?([^";]+)"?/.exec(header);
    return match ? match[1] : fallback;
  }

  function readBlobAsText(blob, callback) {
    var reader = new FileReader();
    reader.onload = function () { callback(reader.result); };
    reader.onerror = function () { callback(""); };
    reader.readAsText(blob);
  }

  function downloadResult(jobId) {
    var xhr = new XMLHttpRequest();
    currentXhr = xhr;
    xhr.open("GET", API_BASE_URL + "/api/correct/" + jobId + "/download");
    xhr.responseType = "blob";
    xhr.timeout = DOWNLOAD_TIMEOUT_MS;

    xhr.onload = function () {
      startBtn.disabled = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        var blob = xhr.response;
        var name = extractFilename(xhr, "corrected.docx");
        if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
        lastObjectUrl = URL.createObjectURL(blob);
        downloadLink.href = lastObjectUrl;
        downloadLink.setAttribute("download", name);
        progressBox.hidden = true;
        successBox.hidden = false;
      } else {
        readBlobAsText(xhr.response, function (text) {
          var message = MSG.fallback;
          try {
            var parsed = JSON.parse(text);
            if (parsed && parsed.detail) message = parsed.detail;
          } catch (e) { /* keep fallback message */ }
          showError(message);
        });
      }
    };
    xhr.onerror = function () {
      startBtn.disabled = false;
      showError(MSG.network);
    };
    xhr.ontimeout = function () {
      startBtn.disabled = false;
      showError(MSG.timeout);
    };

    xhr.send();
  }

  function pollJobStatus(jobId, failureCount) {
    var xhr = new XMLHttpRequest();
    currentXhr = xhr;
    xhr.open("GET", API_BASE_URL + "/api/correct/" + jobId);
    xhr.responseType = "json";
    xhr.timeout = POLL_TIMEOUT_MS;

    function retryOrGiveUp() {
      var next = failureCount + 1;
      if (next >= MAX_POLL_FAILURES) {
        startBtn.disabled = false;
        showError(MSG.network);
        return;
      }
      setTimeout(function () { pollJobStatus(jobId, next); }, POLL_INTERVAL_MS);
    }

    xhr.onload = function () {
      var body = xhr.response;
      if (xhr.status < 200 || xhr.status >= 300 || !body || !body.status) {
        retryOrGiveUp();
        return;
      }
      if (body.status === "processing") {
        setTimeout(function () { pollJobStatus(jobId, 0); }, POLL_INTERVAL_MS);
      } else if (body.status === "done") {
        downloadResult(jobId);
      } else if (body.status === "error") {
        startBtn.disabled = false;
        showError(body.detail || MSG.fallback);
      } else {
        retryOrGiveUp();
      }
    };
    xhr.onerror = retryOrGiveUp;
    xhr.ontimeout = retryOrGiveUp;

    xhr.send();
  }

  function startUpload() {
    if (!selectedFile) return;

    progressBox.hidden = false;
    successBox.hidden = true;
    errorBox.hidden = true;
    setProgress(0, false);
    statusText.textContent = MSG.uploading;
    startBtn.disabled = true;

    var formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    var xhr = new XMLHttpRequest();
    currentXhr = xhr;
    xhr.open("POST", API_BASE_URL + "/api/correct");
    xhr.responseType = "json";
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100), false);
      }
    };
    xhr.upload.onload = function () {
      setProgress(100, true);
      statusText.textContent = MSG.processing;
    };

    xhr.onload = function () {
      var body = xhr.response;
      if (xhr.status === 202 && body && body.job_id) {
        pollJobStatus(body.job_id, 0);
      } else {
        startBtn.disabled = false;
        showError((body && body.detail) || MSG.fallback);
      }
    };
    xhr.onerror = function () {
      startBtn.disabled = false;
      showError(MSG.network);
    };
    xhr.ontimeout = function () {
      startBtn.disabled = false;
      showError(MSG.timeout);
    };

    xhr.send(formData);
  }

  // ---------- Wiring ----------
  // Clicking the dropzone is handled natively: the file input is absolutely
  // positioned to cover it. Only keyboard activation needs wiring here.
  drop.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    drop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.add("is-dragover");
    });
  });
  ["dragleave", "dragend"].forEach(function (evt) {
    drop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.remove("is-dragover");
    });
  });
  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    drop.classList.remove("is-dragover");
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) validateAndSetFile(files[0]);
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files.length) validateAndSetFile(fileInput.files[0]);
  });

  fileRemove.addEventListener("click", function (e) {
    e.stopPropagation();
    resetToIdle();
  });

  startBtn.addEventListener("click", startUpload);
  retryAfterSuccess.addEventListener("click", resetToIdle);
  retryAfterError.addEventListener("click", function () {
    errorBox.hidden = true;
    if (selectedFile) {
      drop.hidden = true;
      fileBox.hidden = false;
    } else {
      resetToIdle();
    }
  });

  // ---------- Paste-text correction ----------
  function showTextError(message) {
    textResult.hidden = true;
    textErrorMessage.textContent = message;
    textErrorBox.hidden = false;
  }

  function submitText() {
    var text = textInput.value;
    if (!text || !text.trim()) {
      showTextError(MSG.emptyText);
      return;
    }

    textResult.hidden = true;
    textErrorBox.hidden = true;
    textStatus.hidden = false;
    textStatus.textContent = MSG.processingText;
    textSubmit.disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", API_BASE_URL + "/api/correct-text");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.timeout = TEXT_TIMEOUT_MS;

    xhr.onload = function () {
      textSubmit.disabled = false;
      textStatus.hidden = true;
      var body = xhr.response;
      if (xhr.status >= 200 && xhr.status < 300 && body && typeof body.html === "string") {
        textOutput.innerHTML = body.html;
        textResult.hidden = false;
      } else {
        showTextError((body && body.detail) || MSG.fallback);
      }
    };
    xhr.onerror = function () {
      textSubmit.disabled = false;
      textStatus.hidden = true;
      showTextError(MSG.network);
    };
    xhr.ontimeout = function () {
      textSubmit.disabled = false;
      textStatus.hidden = true;
      showTextError(MSG.timeout);
    };

    xhr.send(JSON.stringify({ text: text }));
  }

  if (textSubmit) textSubmit.addEventListener("click", submitText);
})();
