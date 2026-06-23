const defaultMaps = [
  { slug: "abyss", name: "Abyss", colors: ["#4454ff", "#131d53", "#87f4ff"], imageUrl: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/ffa08e5d943b92543bf8110ab07d921f6e6c1eb5-515x515.png?accountingTag=VAL" },
  { slug: "ascent", name: "Ascent", colors: ["#f8b75c", "#8c4e20", "#fff2c2"], imageUrl: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/a31ef0d024e1add0214eb49698ca13e58f62d17e-641x641.jpg?accountingTag=VAL" },
  { slug: "bind", name: "Bind", colors: ["#c58d54", "#5f3722", "#f6d2a0"], imageUrl: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/9c2f75aa4d00022c440615ce08988c7dd5f2bb00-641x641.png?accountingTag=VAL" },
  { slug: "breeze", name: "Breeze", colors: ["#18d1c1", "#0e5266", "#aef8ec"], imageUrl: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/5e9322e5270fea63d82e956ba7d4ccffe95eb84a-515x515.png?accountingTag=VAL" },
  { slug: "corrode", name: "Corrode", colors: ["#8c92ac", "#20293a", "#4cfac8"], imageUrl: "https://media.valorant-api.com/maps/1c18ab1f-420d-0d8b-71d0-77ad3c439115/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/421063d481e9e1b2b5f2f834f53b7512f77413b9-2000x2000.jpg?accountingTag=VAL&auto=format&fit=fill&q=80&w=1600" },
  { slug: "fracture", name: "Fracture", colors: ["#ef7847", "#5c2c2b", "#ffd4a5"], imageUrl: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/d7916de5399e878e06bc20bb4a36f5b8a8637050-515x515.webp?accountingTag=VAL" },
  { slug: "haven", name: "Haven", colors: ["#59bb77", "#224c3d", "#d7ffd1"], imageUrl: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/d9f3c040be38a8fc1f49f18d1221680419877c05-641x641.png?accountingTag=VAL" },
  { slug: "icebox", name: "Icebox", colors: ["#8ce5ff", "#225276", "#f6fdff"], imageUrl: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/31a4841787552309dde1cbae7a75d120d064e8d6-915x515.jpg?accountingTag=VAL" },
  { slug: "lotus", name: "Lotus", colors: ["#8ad04b", "#355f23", "#f0ffd2"], imageUrl: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/a660e638ac2a27d458ef22a6db17b3e372137d09-1873x1873.jpg?accountingTag=VAL" },
  { slug: "pearl", name: "Pearl", colors: ["#7c95ff", "#1f3268", "#dee2ff"], imageUrl: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/0c05fb9a4aa08553afb85842f91fad6f9d3fe87e-515x515.png?accountingTag=VAL" },
  { slug: "split", name: "Split", colors: ["#df6eff", "#5e2d78", "#ffd8ff"], imageUrl: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/dc8a607601339a6c79c8d144c93e17915cde8ac9-515x513.jpg?accountingTag=VAL" },
  { slug: "sunset", name: "Sunset", colors: ["#ff8c63", "#67253a", "#ffe2b7"], imageUrl: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/listviewicon.png", layoutUrl: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/699c33a4ee5f5daf71e87c0f3bf6ddf6995b4bb3-2000x2000.jpg?accountingTag=VAL" },
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
    
    const positionInput = card.querySelector(".map-position");
    positionInput.value = index + 1;
    positionInput.max = ranking.length;
    
    // Prevent card drag start when interacting with position input
    positionInput.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });
    positionInput.addEventListener("focus", () => {
      card.draggable = false;
    });
    positionInput.addEventListener("blur", () => {
      card.draggable = true;
    });
    positionInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.target.blur();
      }
    });
    positionInput.addEventListener("change", (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) {
        positionInput.value = index + 1;
        return;
      }
      val = Math.max(1, Math.min(ranking.length, val));
      const targetIndex = val - 1;
      if (targetIndex !== index) {
        reorderRanking(index, targetIndex);
      } else {
        positionInput.value = index + 1;
      }
    });

    const mapThumb = card.querySelector(".map-thumb");
    mapThumb.src = map.imageUrl || buildThumbnail(map);
    mapThumb.alt = `${map.name} thumbnail`;
    mapThumb.title = `Click to view ${map.name} layout`;
    mapThumb.addEventListener("error", () => {
      mapThumb.src = buildThumbnail(map);
    });
    mapThumb.addEventListener("click", () => {
      window.open(map.layoutUrl || `https://playvalorant.com/en-us/maps/${map.slug}/`, "_blank");
    });
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
  
  // Filter out any entries that are not valid map slugs
  const validEntries = entries.filter((slug) => mapLookup.has(slug));
  
  // Deduplicate entries while preserving order
  const uniqueValidEntries = Array.from(new Set(validEntries));
  
  if (uniqueValidEntries.length === 0) {
    return null;
  }

  // If there are missing maps (e.g. from an older version of the app),
  // append them to the end in their default relative order.
  if (uniqueValidEntries.length < defaultMaps.length) {
    defaultMaps.forEach((map) => {
      if (!uniqueValidEntries.includes(map.slug)) {
        uniqueValidEntries.push(map.slug);
      }
    });
  }

  // Ensure the list is precisely the current set of maps
  return uniqueValidEntries.slice(0, defaultMaps.length);
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
