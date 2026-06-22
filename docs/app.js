const defaultMaps = [
  { slug: "abyss", name: "Abyss", colors: ["#4454ff", "#131d53", "#87f4ff"] },
  { slug: "ascent", name: "Ascent", colors: ["#f8b75c", "#8c4e20", "#fff2c2"] },
  { slug: "bind", name: "Bind", colors: ["#c58d54", "#5f3722", "#f6d2a0"] },
  { slug: "breeze", name: "Breeze", colors: ["#18d1c1", "#0e5266", "#aef8ec"] },
  { slug: "fracture", name: "Fracture", colors: ["#ef7847", "#5c2c2b", "#ffd4a5"] },
  { slug: "haven", name: "Haven", colors: ["#59bb77", "#224c3d", "#d7ffd1"] },
  { slug: "icebox", name: "Icebox", colors: ["#8ce5ff", "#225276", "#f6fdff"] },
  { slug: "lotus", name: "Lotus", colors: ["#8ad04b", "#355f23", "#f0ffd2"] },
  { slug: "pearl", name: "Pearl", colors: ["#7c95ff", "#1f3268", "#dee2ff"] },
  { slug: "split", name: "Split", colors: ["#df6eff", "#5e2d78", "#ffd8ff"] },
  { slug: "sunset", name: "Sunset", colors: ["#ff8c63", "#67253a", "#ffe2b7"] },
];

const localStorageKey = "valorant-map-ranker-order";
const mapLookup = new Map(defaultMaps.map((map) => [map.slug, map]));
const rankingList = document.querySelector("#ranking-list");
const statusMessage = document.querySelector("#status-message");
const copyLinkButton = document.querySelector("#copy-link");
const resetOrderButton = document.querySelector("#reset-order");
const cardTemplate = document.querySelector("#map-card-template");

let ranking = loadInitialRanking();
let draggedSlug = null;

render();

copyLinkButton.addEventListener("click", async () => {
  syncUrl();
  const shareUrl = window.location.href;

  try {
    await navigator.clipboard.writeText(shareUrl);
    setStatus("Share link copied.");
  } catch (error) {
    window.prompt("Copy this link", shareUrl);
    setStatus("Share link ready to copy.");
  }
});

resetOrderButton.addEventListener("click", () => {
  ranking = defaultMaps.map((map) => map.slug);
  persistRanking();
  render();
  setStatus("Ranking reset to the default order.");
});

window.addEventListener("hashchange", () => {
  const nextRanking = decodeRanking(window.location.hash.slice(1));
  if (!nextRanking) {
    return;
  }

  ranking = nextRanking;
  persistRanking(false);
  render();
  setStatus("Ranking loaded from the shared link.");
});

function render() {
  rankingList.innerHTML = "";

  ranking.forEach((slug, index) => {
    const map = mapLookup.get(slug);
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const dragHandle = card.querySelector(".drag-handle");
    const upButton = card.querySelector('[data-direction="up"]');
    const downButton = card.querySelector('[data-direction="down"]');

    card.dataset.slug = slug;
    card.querySelector(".map-position").textContent = `${index + 1}`;
    card.querySelector(".map-thumb").src = buildThumbnail(map);
    card.querySelector(".map-thumb").alt = `${map.name} thumbnail`;
    card.querySelector(".map-name").textContent = map.name;

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("dragleave", clearDropMarker);
    card.addEventListener("drop", handleDrop);
    card.addEventListener("dragend", handleDragEnd);

    dragHandle.addEventListener("mousedown", () => {
      card.draggable = true;
    });

    dragHandle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
      }
    });

    upButton.disabled = index === 0;
    downButton.disabled = index === ranking.length - 1;

    upButton.addEventListener("click", () => moveByOffset(slug, -1));
    downButton.addEventListener("click", () => moveByOffset(slug, 1));

    rankingList.appendChild(card);
  });

  syncUrl();
}

function handleDragStart(event) {
  draggedSlug = event.currentTarget.dataset.slug;
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedSlug);
}

function handleDragOver(event) {
  event.preventDefault();
  const targetCard = event.currentTarget;
  if (!draggedSlug || targetCard.dataset.slug === draggedSlug) {
    clearDropMarker({ currentTarget: targetCard });
    return;
  }

  const { placeAfter } = getDropPosition(event, targetCard);
  targetCard.classList.toggle("drop-before", !placeAfter);
  targetCard.classList.toggle("drop-after", placeAfter);
}

function handleDrop(event) {
  event.preventDefault();
  const targetCard = event.currentTarget;
  const targetSlug = targetCard.dataset.slug;

  if (!draggedSlug || draggedSlug === targetSlug) {
    clearDropMarker({ currentTarget: targetCard });
    return;
  }

  const draggedIndex = ranking.indexOf(draggedSlug);
  const targetIndex = ranking.indexOf(targetSlug);
  const { placeAfter } = getDropPosition(event, targetCard);
  const nextIndex = draggedIndex < targetIndex
    ? targetIndex + (placeAfter ? 0 : -1)
    : targetIndex + (placeAfter ? 1 : 0);

  reorderRanking(draggedIndex, nextIndex);
  clearDropMarker({ currentTarget: targetCard });
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  draggedSlug = null;
  document.querySelectorAll(".drop-before, .drop-after").forEach((card) => {
    card.classList.remove("drop-before", "drop-after");
  });
}

function clearDropMarker(event) {
  event.currentTarget.classList.remove("drop-before", "drop-after");
}

function getDropPosition(event, card) {
  const rect = card.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  return { placeAfter: event.clientY >= midpoint };
}

function moveByOffset(slug, offset) {
  const currentIndex = ranking.indexOf(slug);
  const nextIndex = currentIndex + offset;

  if (nextIndex < 0 || nextIndex >= ranking.length) {
    return;
  }

  reorderRanking(currentIndex, nextIndex);
}

function reorderRanking(fromIndex, toIndex) {
  if (fromIndex === toIndex) {
    return;
  }

  const nextRanking = [...ranking];
  const [moved] = nextRanking.splice(fromIndex, 1);
  nextRanking.splice(toIndex, 0, moved);
  ranking = nextRanking;
  persistRanking();
  render();
  setStatus("Ranking updated.");
}

function persistRanking(updateHash = true) {
  localStorage.setItem(localStorageKey, ranking.join("."));
  if (updateHash) {
    syncUrl();
  }
}

function syncUrl() {
  const encoded = ranking.join(".");
  const nextHash = `r=${encoded}`;

  if (window.location.hash !== `#${nextHash}`) {
    window.history.replaceState(null, "", `#${nextHash}`);
  }
}

function loadInitialRanking() {
  const fromHash = decodeRanking(window.location.hash.slice(1));
  if (fromHash) {
    return fromHash;
  }

  const fromStorage = decodeRanking(localStorage.getItem(localStorageKey) || "");
  if (fromStorage) {
    return fromStorage;
  }

  return defaultMaps.map((map) => map.slug);
}

function decodeRanking(rawValue) {
  const cleanedValue = rawValue.startsWith("r=") ? rawValue.slice(2) : rawValue;
  if (!cleanedValue) {
    return null;
  }

  const entries = cleanedValue.split(".").filter(Boolean);
  const uniqueEntries = new Set(entries);

  if (entries.length !== defaultMaps.length || uniqueEntries.size !== defaultMaps.length) {
    return null;
  }

  if (entries.some((slug) => !mapLookup.has(slug))) {
    return null;
  }

  return entries;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function buildThumbnail(map) {
  const [start, end, accent] = map.colors;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="128" viewBox="0 0 192 128" role="img" aria-label="${map.name}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="192" height="128" rx="22" fill="url(#bg)" />
      <path d="M18 103L58 64L85 88L124 36L174 88V128H18Z" fill="${accent}" fill-opacity="0.32" />
      <path d="M18 94L51 60L79 76L116 42L174 84" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="150" cy="33" r="14" fill="${accent}" fill-opacity="0.82" />
      <text x="18" y="34" fill="white" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700">${map.name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
