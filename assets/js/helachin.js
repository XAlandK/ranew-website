(function () {
  "use strict";

  var MAX_UPLOAD_MB = 20; // keep in sync with backend MAX_UPLOAD_MB (backend/.env)
  var REQUEST_TIMEOUT_MS = 180000; // 3 minutes — large documents take a while

  var MSG = {
    unsupportedType: "تکایە تەنها فایلێکی .docx باربکە.",
    emptyFile: "فایلەکە بەتاڵە یان بە دروستی هەڵنەبژێردراوە.",
    tooLarge: "قەبارەی فایلەکە زۆر گەورەیە (زۆرترین قەبارە " + MAX_UPLOAD_MB + " مێگابایت). تکایە بەڵگەنامەیەکی بچووکتر باربکە.",
    network: "پەیوەندی بە ڕاژەکارەوە سەرکەوتوو نەبوو. تکایە ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵبدەرەوە.",
    timeout: "کاتی چاوەڕوانی تەواو بوو. تکایە دووبارە هەوڵبدەرەوە.",
    fallback: "هەڵەیەکی چاوەڕواننەکراو ڕوویدا. تکایە دواتر هەوڵبدەرەوە.",
    uploading: "بەڵگەنامەکە بار دەکرێت...",
    processing: "بەڵگەنامەکە چاک دەکرێتەوە... تکایە چاوەڕێبە"
  };

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
    var match = /filename="?([^"]+)"?/.exec(header);
    return match ? match[1] : fallback;
  }

  function readBlobAsText(blob, callback) {
    var reader = new FileReader();
    reader.onload = function () { callback(reader.result); };
    reader.onerror = function () { callback(""); };
    reader.readAsText(blob);
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
    xhr.responseType = "blob";
    xhr.timeout = REQUEST_TIMEOUT_MS;

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
})();
