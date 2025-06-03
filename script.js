document.addEventListener("DOMContentLoaded", async () => {
  const stableFingerprintIdEl = document.getElementById("stableFingerprintId");
  const copyBtn = document.getElementById("copyBtn");
  const pastedDataEl = document.getElementById("pastedData");
  const compareBtn = document.getElementById("compareBtn");
  const comparisonResultEl = document.getElementById("comparisonResult");

  let currentFingerprintData = null;

  console.log("Fingerprint script started.");

  async function sha256(message) {
    if (!window.crypto || !window.crypto.subtle) {
      console.error("sha256: Web Crypto API (crypto.subtle) not available.");
      return "N/A (CryptoNotAvailable)";
    }
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    } catch (e) {
      console.error("sha256: Error during hashing:", e);
      return "N/A (HashingError)";
    }
  }

  function getUserAgent() {
    return navigator.userAgent || "N/A";
  }
  function getLanguages() {
    return (
      navigator.languages || [navigator.language || navigator.userLanguage]
    ).join(",");
  }
  function getScreenInfo() {
    try {
      return `${screen.width}x${screen.height}x${screen.colorDepth}x${screen.pixelDepth}`;
    } catch (e) {
      console.warn("Error getScreenInfo:", e);
      return "N/A";
    }
  }
  function getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";
    } catch (e) {
      console.warn("Error getTimezone:", e);
      return "N/A";
    }
  }
  function getHardwareConcurrency() {
    return navigator.hardwareConcurrency || "N/A";
  }
  function getPlatform() {
    return navigator.platform || "N/A";
  }
  function getDoNotTrack() {
    return navigator.doNotTrack === "1"
      ? "Yes"
      : navigator.doNotTrack === "0" || navigator.doNotTrack === null
      ? "No"
      : "Unspecified";
  }
  function getPlugins() {
    try {
      return Array.from(navigator.plugins)
        .map((p) => p.name)
        .sort()
        .join(",");
    } catch (e) {
      return "N/A";
    }
  }

  function getCanvasFingerprint() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            const canvas = document.createElement("canvas");
            if (document.body) {
              document.body.offsetHeight;
            }
            const ctx = canvas.getContext("2d");
            const txt = "BrowserLeaks,com <canvas> 1.0";
            canvas.width = 200;
            canvas.height = 30;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            resolve(canvas.toDataURL());
          } catch (e) {
            console.warn("Error getCanvasFingerprint:", e);
            resolve("N/A (CanvasError)");
          }
        }, 50);
      });
    });
  }

  function getWebGLFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        return "N/A (No WebGL)";
      }
      const debugInfo = gl.getExtension("RENDERER");
      const vendor = gl.getParameter(
        debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : gl.VENDOR
      );
      const renderer = gl.getParameter(
        debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER
      );
      return `${vendor} - ${renderer}`;
    } catch (e) {
      console.warn("Error getWebGLFingerprint:", e);
      return "N/A";
    }
  }

  function getAudioFingerprint() {
    return new Promise((resolve) => {
      try {
        const OfflineAudioContext =
          window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!OfflineAudioContext) {
          resolve("N/A (AudioContext not supported)");
          return;
        }
        const audioCtx = new OfflineAudioContext(1, 44100, 44100);
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
        const compressor = audioCtx.createDynamicsCompressor();
        if (
          compressor.threshold &&
          typeof compressor.threshold.setValueAtTime === "function"
        ) {
          compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
        }
        oscillator.connect(compressor);
        compressor.connect(audioCtx.destination);
        oscillator.start(0);
        audioCtx
          .startRendering()
          .then(function (renderedBuffer) {
            let sum = 0;
            const pcmData = renderedBuffer.getChannelData(0);
            for (let i = 0; i < pcmData.length; i++) {
              sum += Math.abs(pcmData[i]);
            }
            resolve(sum.toString());
          })
          .catch((err) => {
            console.error(
              "getAudioFingerprint: Error during startRendering:",
              err
            );
            resolve("N/A (Audio Rendering Error)");
          });
      } catch (e) {
        console.error(
          "getAudioFingerprint: Error initializing AudioContext or nodes:",
          e
        );
        resolve("N/A (AudioContext General Error)");
      }
    });
  }

  function getFontsFingerprint() {
    try {
      const fontList = [
        "Arial",
        "Helvetica",
        "Times New Roman",
        "Times",
        "Courier New",
        "Courier",
        "Verdana",
        "Georgia",
        "Palatino",
        "Garamond",
        "Bookman",
        "Comic Sans MS",
        "Trebuchet MS",
        "Arial Black",
        "Impact",
        "Lucida Sans Unicode",
        "Tahoma",
        "Segoe UI",
        "Calibri",
        "Candara",
        "Optima",
        "Geneva",
        "Monaco",
        "Consolas",
      ];
      const detectedFonts = [];
      const baseFonts = ["monospace", "sans-serif", "serif"];
      const testString = "mmmmmmmmmmlli";
      const testSize = "72px";

      const body = document.body;
      if (!body) {
        console.warn("getFontsFingerprint: document.body not available yet.");
        return "N/A (DOM not ready for fonts)";
      }
      const h = document.createElement("div");
      h.style.fontSize = testSize;
      h.style.position = "absolute";
      h.style.left = "-9999px";
      h.style.visibility = "hidden";
      h.textContent = testString;
      body.appendChild(h);

      const defaultWidths = {};
      const defaultHeights = {};
      for (const baseFont of baseFonts) {
        h.style.fontFamily = baseFont;
        defaultWidths[baseFont] = h.offsetWidth;
        defaultHeights[baseFont] = h.offsetHeight;
      }

      for (const font of fontList) {
        let detected = false;
        for (const baseFont of baseFonts) {
          h.style.fontFamily = `"${font}", ${baseFont}`;
          if (
            h.offsetWidth !== defaultWidths[baseFont] ||
            h.offsetHeight !== defaultHeights[baseFont]
          ) {
            detected = true;
            break;
          }
        }
        if (detected) {
          detectedFonts.push(font);
        }
      }
      body.removeChild(h);
      return detectedFonts.sort().join(",") || "None";
    } catch (e) {
      console.error("Error in getFontsFingerprint:", e);
      return "N/A (FontDetectionError)";
    }
  }

  const CORE_STABLE_ATTRIBUTES = [
    "userAgent",
    "languages",
    "screenInfo",
    "timezone",
    "hardwareConcurrency",
    "platform",
    "webgl",
    "fonts",
  ];

  async function generateFingerprint() {
    stableFingerprintIdEl.textContent = "Generating... (Collecting components)";

    const [canvasFpValue, audioFpValue] = await Promise.all([
      getCanvasFingerprint(),
      getAudioFingerprint(),
    ]);

    const components = {
      userAgent: getUserAgent(),
      languages: getLanguages(),
      screenInfo: getScreenInfo(),
      timezone: getTimezone(),
      hardwareConcurrency: getHardwareConcurrency(),
      platform: getPlatform(),
      doNotTrack: getDoNotTrack(),
      plugins: getPlugins(),
      canvas: canvasFpValue,
      webgl: getWebGLFingerprint(),
      audio: audioFpValue,
      fonts: getFontsFingerprint(),
    };

    const stableComponentsValues = CORE_STABLE_ATTRIBUTES.map(
      (key) => components[key] || "N/A_STABLE_MISSING"
    ).join("|||");
    const stableId = await sha256(stableComponentsValues);

    stableFingerprintIdEl.textContent = "Generating... (Hashing Stable ID)";

    return { stableId, components };
  }

  async function displayCurrentFingerprint() {
    console.log("displayCurrentFingerprint: Initiating...");
    stableFingerprintIdEl.textContent = "Generating...";
    try {
      currentFingerprintData = await generateFingerprint();
      if (currentFingerprintData && currentFingerprintData.stableId) {
        stableFingerprintIdEl.textContent = currentFingerprintData.stableId;
      } else {
        stableFingerprintIdEl.textContent = "Error generating Stable ID.";
        console.error(
          "displayCurrentFingerprint: currentFingerprintData or stableId is null/undefined",
          currentFingerprintData
        );
      }
    } catch (error) {
      console.error(
        "Error in displayCurrentFingerprint's try-catch block:",
        error
      );
      stableFingerprintIdEl.textContent =
        "Failed to generate. See console for errors.";
    }
  }

  copyBtn.addEventListener("click", () => {
    if (currentFingerprintData) {
      const dataToCopy = JSON.stringify(currentFingerprintData, null, 2);
      navigator.clipboard
        .writeText(dataToCopy)
        .then(() =>
          alert(
            "Full fingerprint data (including Stable ID) copied to clipboard!"
          )
        )
        .catch((err) => {
          console.error("Failed to copy to clipboard:", err);
          alert("Failed to copy. See console for details.");
        });
    } else {
      alert("Fingerprint not generated yet.");
    }
  });

  const attributeWeights = {
    canvas: 5,
    webgl: 12,
    audio: 8,
    fonts: 10,
    userAgent: 7,
    plugins: 2,
    screenInfo: 5,
    timezone: 4,
    languages: 3,
    platform: 5,
    hardwareConcurrency: 2,
    doNotTrack: 1,
  };

  function getMatchProbability(score, maxScore) {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (maxScore === 0 && score === 0)
      return { text: "No attributes to compare", class: "neutral" };
    if (maxScore === 0)
      return { text: "Error in scoring (maxScore is 0)", class: "warning" };

    if (percentage > 95)
      return { text: "Very High Confidence Match", class: "match" };
    if (percentage > 80)
      return { text: "High Confidence Match", class: "match" };
    if (percentage > 60)
      return { text: "Medium Confidence Match", class: "mismatch" };
    if (percentage > 40)
      return { text: "Low Confidence Match", class: "mismatch" };
    return { text: "Likely Different Browsers/Sessions", class: "mismatch" };
  }

  compareBtn.addEventListener("click", async () => {
    const rawPastedJson = pastedDataEl.value;
    const pastedJson = rawPastedJson.trim();

    if (!pastedJson) {
      comparisonResultEl.innerHTML =
        '<p class="warning">Please paste fingerprint data first.</p>';
      return;
    }

    let oldFingerprintFullData;
    try {
      oldFingerprintFullData = JSON.parse(pastedJson);
      if (
        typeof oldFingerprintFullData !== "object" ||
        oldFingerprintFullData === null ||
        !oldFingerprintFullData.hasOwnProperty("stableId") ||
        !oldFingerprintFullData.hasOwnProperty("components") ||
        typeof oldFingerprintFullData.components !== "object" ||
        oldFingerprintFullData.components === null
      ) {
        throw new Error(
          "Invalid data structure. Expected JSON with 'stableId' (string) and 'components' (object)."
        );
      }
    } catch (e) {
      comparisonResultEl.innerHTML = `<p class="warning"><strong>Error parsing pasted data:</strong> ${escapeHtml(
        e.message
      )}</p>
                                          <p>Please ensure you copied the <em>entire JSON data block</em>.</p>`;
      console.error("Error parsing pasted JSON:", e, "Input:", pastedJson);
      return;
    }

    comparisonResultEl.innerHTML = "Comparing...";
    const newFingerprintFullData = await generateFingerprint();

    let html = `<h3>Comparison Result:</h3>`;
    html += `<p><strong>Pasted Stable Fingerprint ID:</strong> ${oldFingerprintFullData.stableId}</p>`;
    html += `<p><strong>Current Stable Fingerprint ID:</strong> ${newFingerprintFullData.stableId}</p>`;

    if (oldFingerprintFullData.stableId === newFingerprintFullData.stableId) {
      html += `<p class="match score"><strong>STABLE ID: MATCHED!</strong> Your core browser signature is the same.</p>`;
    } else {
      html += `<p class="mismatch score"><strong>STABLE ID: MISMATCHED!</strong> Your core browser signature differs.</p>`;
    }
    html += `<hr>`;

    let currentMatchScore = 0;
    let maxPossibleScore = 0;
    const oldComponents = oldFingerprintFullData.components;
    const newComponents = newFingerprintFullData.components;
    const allComponentKeys = new Set([
      ...Object.keys(oldComponents),
      ...Object.keys(newComponents),
    ]);

    let attributeDetailsHtml = `<h4>Full Attribute Breakdown & Overall Similarity Score:</h4>
                                  <p><small>This score considers all collected attributes, including more volatile ones, to show overall similarity.</small></p>
                                  <ul class="attribute-list">`;

    for (const key of allComponentKeys) {
      const oldValue =
        oldComponents[key] !== undefined
          ? String(oldComponents[key])
          : "N/A (missing in old)";
      const newValue =
        newComponents[key] !== undefined
          ? String(newComponents[key])
          : "N/A (missing in new)";
      const weight = attributeWeights[key] || 1;
      maxPossibleScore += weight;

      let itemClass = "neutral";
      let comparisonSymbol = "??";
      if (
        oldComponents.hasOwnProperty(key) &&
        newComponents.hasOwnProperty(key)
      ) {
        if (oldValue === newValue) {
          itemClass = "match";
          comparisonSymbol = "==";
          currentMatchScore += weight;
        } else {
          itemClass = "mismatch";
          comparisonSymbol = "!=";
        }
      } else if (oldComponents.hasOwnProperty(key)) {
        itemClass = "mismatch";
        comparisonSymbol = "-> Missing in New";
      } else {
        itemClass = "mismatch";
        comparisonSymbol = "New <- Missing in Old";
      }

      let note = "";
      if (!CORE_STABLE_ATTRIBUTES.includes(key) && itemClass === "mismatch") {
        note = `<br><small class="neutral"><em>(This attribute is not part of the Stable ID and can vary, e.g., between normal/incognito modes or due to browser state.)</em></small>`;
      }
      if (
        key === "canvas" &&
        oldValue !== newValue &&
        itemClass === "mismatch"
      ) {
        note += `<br><small class="neutral"><em>(Canvas can vary with rendering conditions, tab focus, etc.)</em></small>`;
      }

      attributeDetailsHtml += `<li class="${itemClass}"><strong>${key} (weight: ${weight}):</strong><br>
                      <small><em>Old:</em> ${escapeHtml(
                        oldValue.substring(0, 70)
                      )}${oldValue.length > 70 ? "..." : ""}</small><br>
                      <small><em>New:</em> ${escapeHtml(
                        newValue.substring(0, 70)
                      )}${newValue.length > 70 ? "..." : ""}</small><br>
                      <small><em>Status:</em> ${comparisonSymbol}</small>${note}
                   </li>`;
    }
    attributeDetailsHtml += `</ul>`;

    const probability = getMatchProbability(
      currentMatchScore,
      maxPossibleScore
    );
    html += `<p class="score ${
      probability.class
    }"><strong>Overall Similarity Score (all attributes):</strong> ${currentMatchScore} / ${maxPossibleScore} (${(maxPossibleScore >
    0
      ? (currentMatchScore / maxPossibleScore) * 100
      : 0
    ).toFixed(1)}%)</p>`;
    html += `<p class="score ${probability.class}"><strong>Probable Match Level (overall): ${probability.text}</strong></p>`;
    html += attributeDetailsHtml;

    comparisonResultEl.innerHTML = html;
  });

  function escapeHtml(unsafe) {
    if (typeof unsafe !== "string") unsafe = String(unsafe);
    return unsafe
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, '"')
      .replace(/'/g, "'");
  }

  await displayCurrentFingerprint();
  console.log("DOMContentLoaded: Initial fingerprint generation complete.");
});
