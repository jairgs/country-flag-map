const map = d3.select("#map");
const mapLayer = map.append("g").attr("class", "map-layer");
const mapPanel = document.querySelector(".map-panel");
const tooltip = document.querySelector("#tooltip");
const statusText = document.querySelector("#status");
const count = document.querySelector("#count");
const emojiOutput = document.querySelector("#emojiOutput");
const flagList = document.querySelector("#flagList");
const copyButton = document.querySelector("#copyButton");
const clearButton = document.querySelector("#clearButton");
const undoButton = document.querySelector("#undoButton");

const STORAGE_KEY = "flag-map:selected-country-ids";
const selected = [];
const countriesById = new Map();
let draggedCountryId = null;
const dragState = {
  active: false,
  started: false,
  startX: 0,
  startY: 0,
  startId: null,
  mode: "select",
};
const panState = {
  active: false,
  startX: 0,
  startY: 0,
  transform: d3.zoomIdentity,
};

if (window.lucide) {
  lucide.createIcons();
}

const numericToAlpha2 = {
  "004": "AF",
  "008": "AL",
  "010": "AQ",
  "012": "DZ",
  "016": "AS",
  "020": "AD",
  "024": "AO",
  "028": "AG",
  "031": "AZ",
  "032": "AR",
  "036": "AU",
  "040": "AT",
  "044": "BS",
  "048": "BH",
  "050": "BD",
  "051": "AM",
  "052": "BB",
  "056": "BE",
  "060": "BM",
  "064": "BT",
  "068": "BO",
  "070": "BA",
  "072": "BW",
  "074": "BV",
  "076": "BR",
  "084": "BZ",
  "086": "IO",
  "090": "SB",
  "092": "VG",
  "096": "BN",
  "100": "BG",
  "104": "MM",
  "108": "BI",
  "112": "BY",
  "116": "KH",
  "120": "CM",
  "124": "CA",
  "132": "CV",
  "136": "KY",
  "140": "CF",
  "144": "LK",
  "148": "TD",
  "152": "CL",
  "156": "CN",
  "158": "TW",
  "162": "CX",
  "166": "CC",
  "170": "CO",
  "174": "KM",
  "175": "YT",
  "178": "CG",
  "180": "CD",
  "184": "CK",
  "188": "CR",
  "191": "HR",
  "192": "CU",
  "196": "CY",
  "203": "CZ",
  "204": "BJ",
  "208": "DK",
  "212": "DM",
  "214": "DO",
  "218": "EC",
  "222": "SV",
  "226": "GQ",
  "231": "ET",
  "232": "ER",
  "233": "EE",
  "234": "FO",
  "238": "FK",
  "239": "GS",
  "242": "FJ",
  "246": "FI",
  "248": "AX",
  "250": "FR",
  "254": "GF",
  "258": "PF",
  "260": "TF",
  "262": "DJ",
  "266": "GA",
  "268": "GE",
  "270": "GM",
  "275": "PS",
  "276": "DE",
  "288": "GH",
  "292": "GI",
  "296": "KI",
  "300": "GR",
  "304": "GL",
  "308": "GD",
  "312": "GP",
  "316": "GU",
  "320": "GT",
  "324": "GN",
  "328": "GY",
  "332": "HT",
  "334": "HM",
  "336": "VA",
  "340": "HN",
  "344": "HK",
  "348": "HU",
  "352": "IS",
  "356": "IN",
  "360": "ID",
  "364": "IR",
  "368": "IQ",
  "372": "IE",
  "376": "IL",
  "380": "IT",
  "384": "CI",
  "388": "JM",
  "392": "JP",
  "398": "KZ",
  "400": "JO",
  "404": "KE",
  "408": "KP",
  "410": "KR",
  "414": "KW",
  "417": "KG",
  "418": "LA",
  "422": "LB",
  "426": "LS",
  "428": "LV",
  "430": "LR",
  "434": "LY",
  "438": "LI",
  "440": "LT",
  "442": "LU",
  "446": "MO",
  "450": "MG",
  "454": "MW",
  "458": "MY",
  "462": "MV",
  "466": "ML",
  "470": "MT",
  "474": "MQ",
  "478": "MR",
  "480": "MU",
  "484": "MX",
  "492": "MC",
  "496": "MN",
  "498": "MD",
  "499": "ME",
  "500": "MS",
  "504": "MA",
  "508": "MZ",
  "512": "OM",
  "516": "NA",
  "520": "NR",
  "524": "NP",
  "528": "NL",
  "531": "CW",
  "533": "AW",
  "534": "SX",
  "535": "BQ",
  "540": "NC",
  "548": "VU",
  "554": "NZ",
  "558": "NI",
  "562": "NE",
  "566": "NG",
  "570": "NU",
  "574": "NF",
  "578": "NO",
  "580": "MP",
  "581": "UM",
  "583": "FM",
  "584": "MH",
  "585": "PW",
  "586": "PK",
  "591": "PA",
  "598": "PG",
  "600": "PY",
  "604": "PE",
  "608": "PH",
  "612": "PN",
  "616": "PL",
  "620": "PT",
  "624": "GW",
  "626": "TL",
  "630": "PR",
  "634": "QA",
  "638": "RE",
  "642": "RO",
  "643": "RU",
  "646": "RW",
  "652": "BL",
  "654": "SH",
  "659": "KN",
  "660": "AI",
  "662": "LC",
  "663": "MF",
  "666": "PM",
  "670": "VC",
  "674": "SM",
  "678": "ST",
  "682": "SA",
  "686": "SN",
  "688": "RS",
  "690": "SC",
  "694": "SL",
  "702": "SG",
  "703": "SK",
  "704": "VN",
  "705": "SI",
  "706": "SO",
  "710": "ZA",
  "716": "ZW",
  "724": "ES",
  "728": "SS",
  "729": "SD",
  "732": "EH",
  "740": "SR",
  "744": "SJ",
  "748": "SZ",
  "752": "SE",
  "756": "CH",
  "760": "SY",
  "762": "TJ",
  "764": "TH",
  "768": "TG",
  "772": "TK",
  "776": "TO",
  "780": "TT",
  "784": "AE",
  "788": "TN",
  "792": "TR",
  "795": "TM",
  "796": "TC",
  "798": "TV",
  "800": "UG",
  "804": "UA",
  "807": "MK",
  "818": "EG",
  "826": "GB",
  "831": "GG",
  "832": "JE",
  "833": "IM",
  "834": "TZ",
  "840": "US",
  "850": "VI",
  "854": "BF",
  "858": "UY",
  "860": "UZ",
  "862": "VE",
  "876": "WF",
  "882": "WS",
  "887": "YE",
  "894": "ZM",
};

const nameOverrides = {
  "010": "Antarctica",
  "158": "Taiwan",
  "275": "Palestine",
  "336": "Vatican City",
  "410": "South Korea",
  "408": "North Korea",
  "643": "Russia",
  "840": "United States",
  "826": "United Kingdom",
  "834": "Tanzania",
};

function idKey(id) {
  return String(id).padStart(3, "0");
}

function alpha2ToFlag(alpha2) {
  if (!alpha2) return "🏳";
  return [...alpha2.toUpperCase()]
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}

function selectedEmojis() {
  return selected.map((country) => country.flag).join(" ");
}

function saveSelection() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected.map((country) => country.id)));
  } catch {
    statusText.textContent = "Selection could not be saved in this browser.";
  }
}

function restoreSelection() {
  let savedIds = [];

  try {
    savedIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    savedIds = [];
  }

  selected.splice(0, selected.length);
  savedIds.forEach((id) => {
    const country = countriesById.get(id);
    if (country && !selected.some((selectedCountry) => selectedCountry.id === id)) {
      selected.push(country);
    }
  });

  map.selectAll(".selected").classed("selected", false).attr("aria-pressed", "false");
  selected.forEach((country) => {
    map
      .selectAll(`[data-id="${CSS.escape(country.id)}"]`)
      .classed("selected", true)
      .attr("aria-pressed", "true");
  });
}

function addDragStartHandlers(element, country) {
  element.draggable = true;
  element.dataset.id = country.id;
  element.addEventListener("dragstart", (event) => {
    draggedCountryId = country.id;
    element.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", country.id);
  });
  element.addEventListener("dragend", () => {
    draggedCountryId = null;
    element.classList.remove("dragging");
    document
      .querySelectorAll(".drag-over")
      .forEach((node) => node.classList.remove("drag-over"));
    document
      .querySelectorAll(".drop-slot.active")
      .forEach((node) => node.classList.remove("active"));
  });
}

function addReorderHandlers(element, country) {
  addDragStartHandlers(element, country);
  element.addEventListener("dragover", (event) => {
    if (!draggedCountryId || draggedCountryId === country.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    element.classList.add("drag-over");
    element.classList.toggle("drag-after", shouldDropAfter(event, element));
  });
  element.addEventListener("dragleave", () => {
    element.classList.remove("drag-over");
    element.classList.remove("drag-after");
  });
  element.addEventListener("drop", (event) => {
    event.preventDefault();
    element.classList.remove("drag-over");
    element.classList.remove("drag-after");
    reorderSelected(draggedCountryId, country.id, shouldDropAfter(event, element));
  });
}

function shouldDropAfter(event, element) {
  const rect = element.getBoundingClientRect();
  return event.clientY > rect.top + rect.height / 2;
}

function createDropSlot(index) {
  const slot = document.createElement("span");
  slot.className = "drop-slot";

  slot.addEventListener("dragover", (event) => {
    if (!draggedCountryId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    emojiOutput
      .querySelectorAll(".drop-slot.active")
      .forEach((node) => node.classList.remove("active"));
    slot.classList.add("active");
  });

  slot.addEventListener("dragleave", () => {
    slot.classList.remove("active");
  });

  slot.addEventListener("drop", (event) => {
    event.preventDefault();
    slot.classList.remove("active");
    reorderSelectedToIndex(draggedCountryId, index);
  });

  return slot;
}

function renderEmojiImages(node) {
  if (!window.twemoji) return;
  twemoji.parse(node, {
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    folder: "svg",
    ext: ".svg",
    className: "twemoji",
  });
}

function updateUi() {
  count.textContent = selected.length;
  const emojis = selectedEmojis();
  emojiOutput.value = emojis;
  const emojiNodes = [];
  selected.forEach((country, index) => {
    emojiNodes.push(createDropSlot(index));
    const chip = document.createElement("span");
    chip.className = "emoji-chip";
    chip.title = country.name;
    chip.textContent = country.flag;
    addDragStartHandlers(chip, country);
    emojiNodes.push(chip);
  });
  emojiNodes.push(createDropSlot(selected.length));
  emojiOutput.replaceChildren(...emojiNodes);
  statusText.textContent = "Click or drag to select. Shift-click or Shift-drag to deselect.";

  copyButton.disabled = selected.length === 0;
  clearButton.disabled = selected.length === 0;
  undoButton.disabled = selected.length === 0;

  flagList.replaceChildren(
    ...selected.map((country) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.id = country.id;
      button.title = `Remove ${country.name}`;
      button.innerHTML = `<span class="drag-handle" aria-hidden="true">⋮⋮</span><span class="flag" aria-hidden="true">${country.flag}</span><span class="name">${country.name}</span>`;
      button.addEventListener("click", () => toggleCountry(country.id));
      addReorderHandlers(item, country);
      item.append(button);
      return item;
    }),
  );

  renderEmojiImages(emojiOutput);
  renderEmojiImages(flagList);
  saveSelection();
}

function reorderSelected(sourceId, targetId, afterTarget = false) {
  if (!sourceId || !targetId || sourceId === targetId) return;

  const sourceIndex = selected.findIndex((country) => country.id === sourceId);
  const targetIndex = selected.findIndex((country) => country.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [country] = selected.splice(sourceIndex, 1);
  const adjustedTargetIndex = selected.findIndex((selectedCountry) => selectedCountry.id === targetId);
  selected.splice(adjustedTargetIndex + (afterTarget ? 1 : 0), 0, country);
  updateUi();
}

function reorderSelectedToIndex(sourceId, targetIndex) {
  if (!sourceId) return;

  const sourceIndex = selected.findIndex((country) => country.id === sourceId);
  if (sourceIndex < 0) return;

  const [country] = selected.splice(sourceIndex, 1);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  selected.splice(Math.max(0, Math.min(adjustedTargetIndex, selected.length)), 0, country);
  updateUi();
}

function setCountrySelected(id, shouldSelect) {
  const index = selected.findIndex((country) => country.id === id);
  const countryElements = map.selectAll(`[data-id="${CSS.escape(id)}"]`);

  if (shouldSelect && index < 0) {
    selected.push(countriesById.get(id));
    countryElements.classed("selected", true).attr("aria-pressed", "true");
    updateUi();
  }

  if (!shouldSelect && index >= 0) {
    selected.splice(index, 1);
    countryElements.classed("selected", false).attr("aria-pressed", "false");
    updateUi();
  }
}

function toggleCountry(id) {
  const index = selected.findIndex((country) => country.id === id);
  setCountrySelected(id, index < 0);
}

function setDragTarget(target, shouldSelect) {
  const countryPath = target.closest?.(".country");
  if (!countryPath) return;
  setCountrySelected(countryPath.dataset.id, shouldSelect);
}

function setCountryAtPointer(event, shouldSelect) {
  const target = document.elementFromPoint(event.clientX, event.clientY);
  setDragTarget(target, shouldSelect);
}

function positionTooltip(event, country) {
  const panelRect = mapPanel.getBoundingClientRect();
  tooltip.hidden = false;
  tooltip.textContent = `${country.flag} ${country.name}`;
  renderEmojiImages(tooltip);
  tooltip.style.left = `${event.clientX - panelRect.left}px`;
  tooltip.style.top = `${event.clientY - panelRect.top}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function drawMap(world) {
  const countries = topojson.feature(world, world.objects.countries).features;
  const markerCountryIds = new Set(["336"]);
  const markerCountries = countries.filter((feature) => markerCountryIds.has(idKey(feature.id)));
  const fitCountries = {
    type: "FeatureCollection",
    features: countries.filter((feature) => idKey(feature.id) !== "010"),
  };
  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  let currentZoom = d3.zoomIdentity;

  const updateMarkerSize = () => {
    mapLayer.selectAll("circle.country-marker").attr("r", 2.4 / currentZoom.k);
  };

  const countryAtPointer = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const countryElement = target?.closest?.(".country");
    if (countryElement) return countriesById.get(countryElement.dataset.id)?.feature || null;

    const panelRect = mapPanel.getBoundingClientRect();
    const screenPoint = [event.clientX - panelRect.left, event.clientY - panelRect.top];
    const projectedPoint = currentZoom.invert(screenPoint);
    const coordinates = projection.invert(projectedPoint);

    if (!coordinates) return null;
    return countries.find((feature) => d3.geoContains(feature, coordinates)) || null;
  };

  const zoom = d3
    .zoom()
    .filter((event) => event.type === "wheel")
    .scaleExtent([1, 12])
    .on("zoom", (event) => {
      currentZoom = event.transform;
      mapLayer.attr("transform", currentZoom);
      updateMarkerSize();
    });

  map.call(zoom).on("dblclick.zoom", null);
  mapPanel.addEventListener("pointermove", (event) => {
    if (dragState.active || panState.active) {
      hideTooltip();
      return;
    }

    const feature = countryAtPointer(event);
    if (!feature) {
      hideTooltip();
      return;
    }

    positionTooltip(event, countriesById.get(idKey(feature.id)));
  });
  mapPanel.addEventListener("pointerleave", hideTooltip);
  mapPanel.addEventListener("pointerdown", (event) => {
    if (event.button !== 1) return;
    event.preventDefault();
    hideTooltip();
    mapPanel.setPointerCapture?.(event.pointerId);
    panState.active = true;
    panState.startX = event.clientX;
    panState.startY = event.clientY;
    panState.transform = currentZoom;
  });
  mapPanel.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });

  const render = () => {
    const node = map.node();
    const width = node.clientWidth;
    const height = node.clientHeight;

    map.attr("viewBox", `0 0 ${width} ${height}`);
    const horizontalCrop = width * 0.08;
    const topCrop = height * 0.08;
    const bottomCrop = height * 0.02;
    projection.fitExtent(
      [
        [-horizontalCrop, -topCrop],
        [width + horizontalCrop, height + bottomCrop],
      ],
      fitCountries,
    );
    const [x, y] = projection.translate();
    projection.translate([x - width * 0.045, y - height * 0.035]);
    zoom.translateExtent([
      [-width * 2, -height * 2],
      [width * 3, height * 3],
    ]);
    mapLayer.selectAll("path").attr("d", path);
    mapLayer
      .selectAll("circle.country-marker")
      .attr("cx", (feature) => path.centroid(feature)[0])
      .attr("cy", (feature) => path.centroid(feature)[1]);
    updateMarkerSize();
    mapLayer.attr("transform", currentZoom);
  };

  countries.forEach((feature) => {
    const id = idKey(feature.id);
    const alpha2 = numericToAlpha2[id];
    countriesById.set(id, {
      id,
      alpha2,
      feature,
      flag: alpha2ToFlag(alpha2),
      name: nameOverrides[id] || feature.properties?.name || `Country ${id}`,
    });
  });

  const addCountryInteractions = (selection) => {
    selection
      .attr("data-id", (feature) => idKey(feature.id))
      .attr("tabindex", "0")
      .attr("role", "button")
      .attr("aria-pressed", "false")
      .attr("aria-label", (feature) => countriesById.get(idKey(feature.id)).name)
      .on("pointerdown", (event, feature) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragState.active = true;
        dragState.started = false;
        dragState.startX = event.clientX;
        dragState.startY = event.clientY;
        dragState.startId = idKey(feature.id);
        dragState.mode = event.shiftKey ? "deselect" : "select";
      })
      .on("pointerenter", (event) => {
        if (!dragState.active) return;
        event.preventDefault();
        dragState.started = true;
        const shouldSelect = dragState.mode === "select";
        if (dragState.startId) setCountrySelected(dragState.startId, shouldSelect);
        setCountryAtPointer(event, shouldSelect);
      })
      .on("pointermove", (event) => {
        if (!dragState.active) return;
        event.preventDefault();
        const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
        if (distance < 4) return;
        dragState.started = true;
        const shouldSelect = dragState.mode === "select";
        if (dragState.startId) setCountrySelected(dragState.startId, shouldSelect);
        setCountryAtPointer(event, shouldSelect);
      })
      .on("click", (event, feature) => {
        if (dragState.started) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey) {
          setCountrySelected(idKey(feature.id), false);
        } else {
          toggleCountry(idKey(feature.id));
        }
      })
      .on("keydown", (event, feature) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCountry(idKey(feature.id));
        }
      });
  };

  addCountryInteractions(
    mapLayer.selectAll("path").data(countries).join("path").attr("class", "country"),
  );

  addCountryInteractions(
    mapLayer
      .selectAll("circle.country-marker")
      .data(markerCountries)
      .join("circle")
      .attr("class", "country country-marker"),
  );

  window.addEventListener("pointerup", () => {
    dragState.active = false;
    dragState.startId = null;
    panState.active = false;
    requestAnimationFrame(() => {
      dragState.started = false;
    });
  });

  window.addEventListener(
    "pointermove",
    (event) => {
      if (panState.active) {
        event.preventDefault();
        const dx = event.clientX - panState.startX;
        const dy = event.clientY - panState.startY;
        const nextZoom = d3.zoomIdentity
          .translate(panState.transform.x + dx, panState.transform.y + dy)
          .scale(panState.transform.k);
        map.call(zoom.transform, nextZoom);
        return;
      }

      if (!dragState.active) return;
      event.preventDefault();
      const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
      if (distance < 4) return;
      dragState.started = true;
      const shouldSelect = dragState.mode === "select";
      if (dragState.startId) setCountrySelected(dragState.startId, shouldSelect);
      setCountryAtPointer(event, shouldSelect);
    },
    { passive: false },
  );

  render();
  new ResizeObserver(render).observe(map.node());
  restoreSelection();
  updateUi();
}

copyButton.addEventListener("click", async () => {
  const text = selectedEmojis();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    statusText.textContent = "Copied flags to clipboard.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(emojiOutput);
    selection.removeAllRanges();
    selection.addRange(range);
    statusText.textContent = "Clipboard blocked. The flag text is selected.";
  }
});

clearButton.addEventListener("click", () => {
  selected.splice(0, selected.length);
  map.selectAll(".selected").classed("selected", false).attr("aria-pressed", "false");
  updateUi();
});

undoButton.addEventListener("click", () => {
  const last = selected.at(-1);
  if (last) toggleCountry(last.id);
});

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
  .then((world) => drawMap(world))
  .catch(() => {
    statusText.textContent = "The map data could not load. Check the network connection and refresh.";
    copyButton.disabled = true;
    clearButton.disabled = true;
    undoButton.disabled = true;
  });
