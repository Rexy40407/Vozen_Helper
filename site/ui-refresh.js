(() => {
  "use strict";

  const routes = [
    ["/", "Dashboard", "⌂"],
    ["/quick-setup", "Setup", "✦"],
    ["/features", "Modules", "◇"],
    ["/activity", "Activity", "◷"],
    ["/rank-card", "XP", "▣"],
  ];
  const state = { lastPath: "", scheduled: 0, applying: false };

  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

  const CATEGORY_LABELS = {
    protection: "Protection",
    community: "Community",
    management: "Management",
    utility: "Utilities",
    social: "Social alerts",
    growth: "Growth",
    web3: "Web3",
  };

  const CATEGORY_TONES = {
    protection: "#66c8ff",
    community: "#72e2c2",
    management: "#a8b0ff",
    utility: "#f0c56a",
    social: "#ff98b5",
    growth: "#a7df78",
    web3: "#cb9af2",
  };

  const RECOMMENDED_MODULES = new Set(["spam protection", "welcome messages", "levels & xp"]);

  const MODULE_ICON_KEYS = {
    "spam protection": "shield-message",
    "fraud protection": "broken-link",
    "anti-raid": "users-shield",
    "join protection": "door-check",
    "join gate": "door-check",
    "levels & xp": "levels",
    "xp leaderboard": "podium",
    starboard: "star-message",
    suggestions: "idea",
    giveaways: "gift",
    tickets: "ticket",
    "welcome messages": "welcome",
    "welcome channel": "door-flag",
    "role panels": "role-panel",
    "server events": "calendar-star",
    achievements: "medal",
    birthdays: "cake",
    economy: "coins",
    "xp card": "id-card",
    nickname: "name-tag",
    automations: "workflow",
    polls: "poll",
    "statistics channels": "channel-chart",
    moderator: "moderation",
    "custom commands": "terminal",
    "audit and permissions": "clipboard-check",
    "privacy and data": "lock-file",
    "templates and import": "layers-arrow",
    "invite tracker": "invite",
    help: "lifebuoy",
    timers: "timer",
    emojis: "smile-spark",
    embeds: "embed",
    "search something": "search",
    "temporary channels": "voice-timer",
    "twitch alerts": "twitch",
    "youtube alerts": "youtube",
    "instagram alerts": "instagram",
    "reddit alerts": "reddit",
    "x alerts": "x",
    "tiktok alerts": "tiktok",
    "rss feeds": "rss",
    podcasts: "podcast",
    "kick alerts": "kick",
    "bluesky alerts": "bluesky",
    monetization: "monetization",
    "nft statistics": "nft-chart",
    "nft lookups": "nft-search",
    "nft sales and listings": "nft-tag",
    "crypto statistics": "crypto-chart",
    "cryptocurrency lookups": "crypto-search",
    "gas tracker": "gas",
    gating: "gating",
  };

  const ICONS = {
    "shield-message": '<path d="M12 3 5 6v5c0 4.3 2.8 7.9 7 9 4.2-1.1 7-4.7 7-9V6l-7-3Z"/><path d="M8.5 10.5h7M8.5 13.5h5"/>',
    "broken-link": '<path d="m9.2 14.8-1.4 1.4a3 3 0 0 1-4.2-4.2l2.1-2.1a3 3 0 0 1 4.2 0"/><path d="m14.8 9.2 1.4-1.4a3 3 0 0 1 4.2 4.2l-2.1 2.1a3 3 0 0 1-4.2 0"/><path d="m8 16 8-8"/>',
    "users-shield": '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M3.5 19a4.5 4.5 0 0 1 9 0"/><path d="m17 4 3 1.3v3.2c0 2.3-1.2 4.3-3 5.5-1.8-1.2-3-3.2-3-5.5V5.3L17 4Z"/>',
    "door-check": '<path d="M6 20V4l9-1v17"/><path d="M6 20h13"/><path d="m16 11 1.5 1.5L20 10"/><path d="M9 12h.1"/>',
    levels: '<path d="m4 17 4-4 3 2 6-7"/><path d="M16 8h3v3"/><path d="M4 20h16"/>',
    podium: '<path d="M5 20v-6h4v6M10 20V9h4v11M15 20v-3h4v3"/><path d="M12 4v3M9.5 5.5h5"/>',
    "star-message": '<path d="m12 3 1.8 5.1L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.9L12 3Z"/><path d="M5 19h10M5 19v-3"/>',
    idea: '<path d="M9 18h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.2 1.2-1.3 2.5H9.8c-.1-1.3-.5-1.9-1.3-2.5Z"/><path d="M12 2v1M4.9 5l.7.7M19.1 5l-.7.7"/>',
    gift: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7H8.5a2.5 2.5 0 1 1 2.2-3.7L12 7ZM12 7h3.5a2.5 2.5 0 1 0-2.2-3.7L12 7Z"/>',
    ticket: '<path d="M4 7a2 2 0 0 0 0 4 2 2 0 0 0 0 4v2h16v-2a2 2 0 0 0 0-4 2 2 0 0 0 0-4V5H4v2Z"/><path d="M12 8v1M12 11v1M12 14v1"/>',
    welcome: '<path d="M4 5h16v11H8l-4 3V5Z"/><path d="M9 10c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5"/>',
    "door-flag": '<path d="M6 20V4l9-1v17M6 20h13"/><path d="M15 7h4v4h-4M9 12h.1"/>',
    "role-panel": '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6.5 15a2.5 2.5 0 0 1 5 0M14 9h3M14 12h3M14 15h2"/>',
    "calendar-star": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16"/><path d="m12 12 .8 2.1 2.2.2-1.7 1.4.5 2.1-1.8-1.1-1.8 1.1.5-2.1-1.7-1.4 2.2-.2L12 12Z"/>',
    medal: '<circle cx="12" cy="14" r="5"/><path d="m9 10-2-7 5 3 5-3-2 7M10.5 14l1 1 2-2"/>',
    cake: '<path d="M4 13h16v6H4zM4 13c0-2 2-3 4-1 2-2 4-2 6 0 2-2 4-1 6 1"/><path d="M7 9V6M12 9V5M17 9V6M7 5h.1M12 4h.1M17 5h.1"/>',
    coins: '<circle cx="9" cy="9" r="4"/><path d="M13 11h2a4 4 0 1 1-4 4v-2"/><path d="M7 9h4M9 7v4"/>',
    "id-card": '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6.5 15a2.5 2.5 0 0 1 5 0M14 10h3M14 13h3"/>',
    "name-tag": '<path d="M4 5h10l6 7-6 7H4V5Z"/><circle cx="8" cy="10" r="1"/><path d="m11 15 3-3-3-3"/>',
    workflow: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4v0M8 18h4a4 4 0 0 0 4-4v0"/>',
    poll: '<path d="M5 19V9M12 19V5M19 19v-7"/><path d="M3 19h18"/>',
    "channel-chart": '<path d="M4 4h16v16H4z"/><path d="M7 16v-3M12 16V8M17 16v-6"/><path d="M6 8h.1M9 6h.1M15 5h.1"/>',
    moderation: '<path d="M12 3 5 6v5c0 4.3 2.8 7.9 7 9 4.2-1.1 7-4.7 7-9V6l-7-3Z"/><path d="M9 12h6M10 15h4"/>',
    terminal: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m8 10 2 2-2 2M12 15h4"/>',
    "clipboard-check": '<rect x="6" y="5" width="12" height="15" rx="2"/><path d="M9 5V3h6v2M9 13l2 2 4-4"/>',
    "lock-file": '<rect x="5" y="4" width="12" height="16" rx="2"/><path d="M9 4v-1h6v1M14 14h.1"/><rect x="12" y="11" width="6" height="5" rx="1"/>',
    "layers-arrow": '<path d="m12 4 8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4"/><path d="M17 10v5M15 13l2 2 2-2"/>',
    invite: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M17 9v6M14 12h6"/>',
    lifebuoy: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m6.3 6.3 3.6 3.6M14.1 14.1l3.6 3.6M17.7 6.3l-3.6 3.6M9.9 14.1l-3.6 3.6"/>',
    timer: '<circle cx="12" cy="13" r="7"/><path d="M12 13V9M9 3h6M12 3v3"/>',
    "smile-spark": '<circle cx="12" cy="12" r="7"/><path d="M9 14c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5M9 10h.1M15 10h.1M19 4l.7 1.5L21 6l-1.3.5L19 8l-.7-1.5L17 6l1.3-.5L19 4Z"/>',
    embed: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M7 9h10M7 12h6M7 15h8"/>',
    search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4M8 10.5h5"/>',
    "voice-timer": '<path d="M5 10v4M8 8v8M11 6v12M14 10v4"/><circle cx="18" cy="17" r="3"/><path d="M18 15v2l1 1"/>',
    twitch: '<path d="M5 4h14v10l-4 4h-4l-2 2v-2H5V4Z"/><path d="M9 8v3M15 8v3"/>',
    youtube: '<rect x="4" y="7" width="16" height="10" rx="3"/><path d="m11 10 4 2-4 2v-4Z"/>',
    instagram: '<rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M16.5 7.5h.1"/>',
    reddit: '<circle cx="12" cy="12" r="7"/><path d="M8.5 12.5c.8 1 1.8 1.5 3.5 1.5s2.7-.5 3.5-1.5M9 10h.1M15 10h.1M15 5l2-1 1 2"/>',
    x: '<path d="m6 5 12 14M18 5 6 19M5 5h4l10 14h-4L5 5Z"/>',
    tiktok: '<path d="M14 5v9a3 3 0 1 1-3-3"/><path d="M14 5c1 2 2 3 5 3"/>',
    rss: '<path d="M5 18h.1M5 13a6 6 0 0 1 6 6M5 8a11 11 0 0 1 11 11"/>',
    podcast: '<circle cx="12" cy="12" r="7"/><path d="M9 12a3 3 0 0 1 6 0v4H9v-4ZM12 5v2"/>',
    kick: '<path d="M5 5h5v4h4V5h5v5h-4v4h4v5h-5v-4h-4v4H5V5Z"/>',
    bluesky: '<path d="M12 18c-1.5-2.3-6-4.7-7-8.1C4.2 7.1 5.6 5 8 6.1c1.3.6 2.7 2.2 4 4.1 1.3-1.9 2.7-3.5 4-4.1 2.4-1.1 3.8 1 3 3.8-1 3.4-5.5 5.8-7 8.1Z"/>',
    monetization: '<circle cx="10" cy="12" r="5"/><path d="M10 9v6M8 11h4M15 5l4 4M17 5h2v2"/>',
    "nft-chart": '<path d="M5 19V7h14v12H5Z"/><path d="m8 15 3-3 2 2 3-4"/><path d="M8 19v-2M12 19v-4M16 19v-6"/>',
    "nft-search": '<path d="m12 4 6 3v6l-6 3-6-3V7l6-3Z"/><circle cx="16" cy="17" r="3"/><path d="m18 19 2 2"/>',
    "nft-tag": '<path d="m5 5 8-1 7 7-8 8-7-7V5Z"/><circle cx="9" cy="9" r="1"/><path d="m13 13 3-3"/>',
    "crypto-chart": '<circle cx="10" cy="12" r="6"/><path d="M10 8v8M8 10h3a2 2 0 1 1 0 4H8M15 5l4 4M17 5h2v2"/>',
    "crypto-search": '<circle cx="10" cy="10" r="5"/><path d="M8 10h4M10 8v4M14 14l5 5"/>',
    gas: '<path d="M9 4h6v16H9zM7 7h2M15 8h2a2 2 0 0 1 2 2v5h-2M12 8l-2 4h3l-2 4"/>',
    gating: '<path d="M12 3 5 6v5c0 4.3 2.8 7.9 7 9 4.2-1.1 7-4.7 7-9V6l-7-3Z"/><circle cx="12" cy="11" r="2"/><path d="M12 13v2"/>',
    default: '<circle cx="12" cy="12" r="7"/><path d="M12 8v8M8 12h8"/>',
  };

  const STATUS_ICONS = {
    active: '<circle cx="12" cy="12" r="4"/>',
    available: '<circle cx="12" cy="12" r="6"/>',
    beta: '<path d="M9 4h6M10 4v4l-3 6a3 3 0 0 0 2.7 4h4.6A3 3 0 0 0 17 14l-3-6V4M9 14h6"/>',
    planned: '<circle cx="12" cy="12" r="7"/><path d="M12 8v4l2 2"/>',
    blocked: '<rect x="6" y="10" width="12" height="9" rx="2"/><path d="M9 10V8a3 3 0 0 1 6 0v2"/>',
    roadmap: '<path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h5M8 15h7"/>',
  };

  function svgIcon(body, className = "") {
    return `<svg class="vozen-svg-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function moduleTitle(card) {
    return cleanText(one("h3", card)?.textContent).toLowerCase();
  }

  function moduleIconKey(card) {
    return MODULE_ICON_KEYS[moduleTitle(card)] || "default";
  }

  function categoryIcon(category) {
    const body = category === "protection" ? ICONS["shield-message"] : category === "community" ? ICONS["star-message"] : category === "management" ? ICONS.workflow : category === "utility" ? ICONS.embed : category === "social" ? ICONS.rss : category === "growth" ? ICONS.levels : category === "web3" ? ICONS.gating : ICONS.default;
    return svgIcon(body, "vozen-category-svg");
  }

  function statusIcon(status) {
    return svgIcon(STATUS_ICONS[status] || STATUS_ICONS.available, "vozen-status-svg");
  }

  function moduleAction(card, status) {
    const original = cleanText(one("button", card)?.textContent).toLowerCase();
    if (original.includes("customize")) return "Customize";
    if (status === "active") return "Manage";
    if (status === "blocked") return "View plan";
    if (status === "planned") return "View roadmap";
    return "Configure";
  }

  function routeInfo() {
    const raw = (window.location.hash || "#/").replace(/^#/, "") || "/";
    const [path, hashQuery = ""] = raw.split("?");
    const query = new URLSearchParams(window.location.search);
    new URLSearchParams(hashQuery).forEach((value, key) => query.set(key, value));
    return { path, query };
  }

  function go(path) {
    window.location.hash = path.startsWith("#") ? path : `#${path}`;
  }

  function writeFeatureQuery({ status = "available", category = "all", q = "" }) {
    const url = new URL(window.location.href);
    url.search = "";
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (category && category !== "all") params.set("category", category);
    if (q) params.set("q", q);
    url.search = params.toString();
    url.hash = "#/features";
    window.history.replaceState(window.history.state, "", url.href);
  }

  function enhanceShell(path) {
    const sidebar = one(".sidebar");
    if (!sidebar) return;

    sidebar.dataset.uiShell = "true";
    const existingNav = one("nav", sidebar);
    if (existingNav) existingNav.setAttribute("aria-label", "Main navigation");

    let mobileHeader = one("#vozen-mobile-header");
    if (!mobileHeader) {
      mobileHeader = document.createElement("div");
      mobileHeader.id = "vozen-mobile-header";
      mobileHeader.className = "vozen-mobile-header";
      mobileHeader.innerHTML = `
        <div class="vozen-mobile-server">
          <span class="vozen-mobile-server-mark" aria-hidden="true">◈</span>
          <label class="vozen-mobile-server-select">
            <span>Server</span>
            <select aria-label="Select server"></select>
          </label>
        </div>
        <span class="vozen-mobile-sync" role="status" aria-live="polite"></span>`;
      document.body.append(mobileHeader);
    }

    const sourceSelect = one(".workspace select", sidebar);
    const mobileSelect = one(".vozen-mobile-server-select select", mobileHeader);
    if (sourceSelect && mobileSelect) {
      if (mobileSelect.options.length !== sourceSelect.options.length) {
        mobileSelect.replaceChildren(...[...sourceSelect.options].map((option) => option.cloneNode(true)));
      }
      mobileSelect.value = sourceSelect.value;
      if (!mobileSelect.dataset.uiBound) {
        mobileSelect.dataset.uiBound = "true";
        mobileSelect.addEventListener("change", () => {
          sourceSelect.value = mobileSelect.value;
          sourceSelect.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }
    }

    let mobileNav = one("#vozen-mobile-nav");
    if (!mobileNav) {
      mobileNav = document.createElement("nav");
      mobileNav.id = "vozen-mobile-nav";
      mobileNav.className = "vozen-mobile-nav";
      mobileNav.setAttribute("aria-label", "Mobile navigation");
      mobileNav.innerHTML = routes
        .map(([href, label, icon]) => `<a href="#${href}" data-route="${href}"><span aria-hidden="true">${icon}</span><b>${label}</b></a>`)
        .join("");
      document.body.append(mobileNav);
    }

    all(".vozen-mobile-nav a, .sidebar .nav").forEach((link) => {
      const target = link.dataset.route || link.getAttribute("href")?.replace(/^#/, "") || "";
      const active = target === path || (path === "/" && target === "/");
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const desktopSync = one(".header-state");
    const mobileSync = one(".vozen-mobile-sync");
    if (desktopSync) {
      desktopSync.setAttribute("role", "status");
      desktopSync.setAttribute("aria-live", "polite");
      desktopSync.dataset.syncState = /error|offline/i.test(desktopSync.textContent)
        ? "error"
        : /sync|all good/i.test(desktopSync.textContent)
          ? "synced"
          : "syncing";
      if (mobileSync) {
        const syncText = cleanText(desktopSync.textContent);
        if (mobileSync.textContent !== syncText) mobileSync.textContent = syncText;
      }
    } else if (mobileSync) {
      if (mobileSync.textContent !== "Synced") mobileSync.textContent = "Synced";
    }

    document.body.dataset.uiRoute = path;
  }

  function enhanceOverview() {
    const welcome = one(".welcome");
    if (!welcome) return;
    welcome.classList.add("ui-dashboard-focus");

    const primary = one("button.primary", welcome);
    if (primary) {
      primary.textContent = "Continue setup";
      primary.setAttribute("aria-label", "Continue quick setup");
      if (!primary.dataset.uiBound) {
        primary.dataset.uiBound = "true";
        primary.addEventListener("click", () => go("/quick-setup"));
      }
    }

    const quickGrid = one(".quick-grid");
    const recommendedHeading = quickGrid?.previousElementSibling;
    if (quickGrid) quickGrid.hidden = true;
    if (recommendedHeading?.classList.contains("section-heading")) recommendedHeading.hidden = true;

    const metrics = one(".metrics");
    if (metrics) {
      metrics.classList.add("ui-metric-strip");
      metrics.setAttribute("role", "list");
      all(".metric", metrics).forEach((metric) => metric.setAttribute("role", "listitem"));
    }
    const quota = one(".quota");
    if (quota) quota.classList.add("ui-secondary-info");
  }

  function createFilterButton(label, id, count) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "vozen-filter-button";
    button.dataset.filter = id;
    button.innerHTML = `<span class="vozen-filter-label">${statusIcon(id)}<span>${label}</span></span><span class="vozen-filter-count">${count}</span>`;
    button.setAttribute("aria-label", `${label}: ${count}`);
    button.setAttribute("aria-pressed", "false");
    return button;
  }

  function featureStatus(card) {
    const text = cleanText(one(".pill", card)?.textContent).toLowerCase();
    if (text.includes("beta")) return "beta";
    if (text.includes("ativa") || text.includes("active")) return "active";
    if (text.includes("dispon") || text.includes("avail")) return "available";
    if (text.includes("bloque") || text.includes("block")) return "blocked";
    if (text.includes("plane") || text.includes("plan")) return "planned";
    return "planned";
  }

  function decorateCatalogCard(card, status, category) {
    const title = moduleTitle(card);
    const icon = one(".feature-icon", card);
    const heading = one("h3", card);
    const description = one("p", card);
    const pill = one(".pill", card);
    const action = one("button", card);
    const iconKey = moduleIconKey(card);
    const recommended = RECOMMENDED_MODULES.has(title) && ["active", "available", "beta"].includes(status);
    const decorationSignature = `${title}:${status}:${category}:${recommended}`;
    if (card.dataset.uiDecorationSignature === decorationSignature) return;

    card.classList.add("vozen-module-row");
    card.dataset.uiIcon = iconKey;
    card.dataset.uiRecommended = String(recommended);
    card.dataset.uiCategoryTone = category;
    if (recommended) card.dataset.uiRecommendationReason = title === "spam protection"
      ? "Recommended because no protection module is active."
      : title === "welcome messages"
        ? "Recommended to give new members a clear first step."
        : "Recommended to bring healthy activity to the community.";

    if (icon) {
      icon.classList.add("vozen-module-icon");
      icon.dataset.category = category;
      if (icon.dataset.uiIconKey !== iconKey) {
        icon.innerHTML = svgIcon(ICONS[iconKey] || ICONS.default, "vozen-module-svg");
        icon.dataset.uiIconKey = iconKey;
      }
      icon.setAttribute("aria-hidden", "true");
    }

    if (heading) {
      let eyebrow = one(".vozen-module-category", card);
      if (!eyebrow) {
        eyebrow = document.createElement("span");
        eyebrow.className = "vozen-module-category";
        heading.before(eyebrow);
      }
      const categoryLabel = CATEGORY_LABELS[category] || "Module";
      if (eyebrow.textContent !== categoryLabel) eyebrow.textContent = categoryLabel;
    }

    if (pill) {
      pill.classList.add("vozen-module-status");
      pill.dataset.status = status;
      const statusLabel = status === "active" ? "Active" : status === "beta" ? "Beta" : status === "blocked" ? "Blocked" : status === "planned" ? "Planned" : "Available";
      if (pill.dataset.uiStatusLabel !== statusLabel) {
        pill.innerHTML = `${statusIcon(status)}<span>${statusLabel}</span>`;
        pill.dataset.uiStatusLabel = statusLabel;
      }
    }

    if (description) {
      description.title = cleanText(description.textContent);
      let context = one(".vozen-module-context", card);
      if (!context) {
        context = document.createElement("span");
        context.className = "vozen-module-context";
        description.after(context);
      }
      const contextText = recommended
        ? "Recommended for this server"
        : status === "blocked"
          ? "Unavailable on this server"
          : status === "planned"
            ? "Planned for a future release"
            : "";
      if (context.textContent !== contextText) context.textContent = contextText;
      context.hidden = !contextText;
    }

    if (action) {
      action.classList.add("vozen-module-action");
      action.dataset.status = status;
      const actionLabel = moduleAction(card, status);
      if (action.dataset.uiActionLabel !== actionLabel) {
        action.innerHTML = `<span>${actionLabel}</span><span class="vozen-action-arrow" aria-hidden="true">→</span>`;
        action.dataset.uiActionLabel = actionLabel;
      }
      action.setAttribute("aria-label", `${actionLabel} ${cleanText(one("h3", card)?.textContent)}`);
      if (status === "planned") action.disabled = true;
      if (!action.dataset.uiRowBound) {
        action.dataset.uiRowBound = "true";
        card.addEventListener("click", (event) => {
          if (event.target.closest("button, a, input, select, textarea")) return;
          if (!action.disabled) action.click();
        });
      }
    }

    card.style.setProperty("--module-tone", CATEGORY_TONES[category] || "#8ee5d2");
    card.dataset.uiDecorationSignature = decorationSignature;
  }

  function decorateCategoryButton(button, category, label, count) {
    button.innerHTML = `<span class="vozen-category-button-main">${categoryIcon(category)}<span>${label}</span></span><span class="vozen-category-count">${count}</span>`;
    button.setAttribute("aria-label", `${label}: ${count}`);
    button.setAttribute("aria-pressed", "false");
  }

  function enhanceCatalog() {
    const toolbar = one(".catalog-toolbar");
    const grid = one(".feature-grid");
    if (!toolbar || !grid) return;

    const cards = all(".feature", grid);
    const counts = { active: 0, available: 0, beta: 0, planned: 0, blocked: 0 };
    const categories = new Map([["all", "All"]]);
    const categoryCounts = { all: cards.length };
    cards.forEach((card) => {
      const status = featureStatus(card);
      counts[status] += 1;
      const category = [...card.querySelectorAll(".feature-icon")][0]?.className.match(/feature-icon ([^ ]+)/)?.[1];
      if (category && !categories.has(category)) {
        categories.set(category, CATEGORY_LABELS[category] || category);
      }
      categoryCounts[category || "other"] = (categoryCounts[category || "other"] || 0) + 1;
      card.dataset.uiStatus = status;
      card.dataset.uiCategory = category || "other";
      decorateCatalogCard(card, status, category || "other");
    });

    const recommendedCards = cards.filter((card) => card.dataset.uiRecommended === "true");
    const firstFeatureCards = all(".feature", grid).slice(0, recommendedCards.length);
    if (recommendedCards.length && !recommendedCards.every((card) => firstFeatureCards.includes(card))) {
      [...recommendedCards].reverse().forEach((card) => grid.prepend(card));
    }
    let recommendationHeading = one(".vozen-recommendations-heading", grid);
    if (!recommendationHeading) {
      recommendationHeading = document.createElement("div");
      recommendationHeading.className = "vozen-recommendations-heading";
      recommendationHeading.innerHTML = `<div><span class="vozen-eyebrow">SERVER SIGNAL</span><h3>Recommended for this server</h3><p>Start with the tools that cover your community's next important step.</p></div><span class="vozen-recommendation-count">Top picks</span>`;
      grid.prepend(recommendationHeading);
    } else if (grid.firstElementChild !== recommendationHeading) {
      grid.prepend(recommendationHeading);
    }

    let layout = one("#vozen-catalog-layout");
    if (!layout) {
      layout = document.createElement("div");
      layout.id = "vozen-catalog-layout";
      layout.className = "vozen-catalog-layout";
      grid.parentElement.insertBefore(layout, grid);
      layout.append(grid);
    }

    let controls = one("#vozen-catalog-controls");
    if (!controls) {
      controls = document.createElement("section");
      controls.id = "vozen-catalog-controls";
      controls.className = "vozen-catalog-controls card";
      controls.setAttribute("aria-label", "Module filters");
      controls.innerHTML = `
        <div class="vozen-catalog-controls-main">
          <label class="vozen-search-label">
            <span>Search modules</span>
            <input type="search" class="vozen-catalog-search" placeholder="Search modules…" autocomplete="off">
          </label>
          <div class="vozen-status-filters" role="group" aria-label="Availability filters"></div>
          <p class="vozen-catalog-result-summary" role="status" aria-live="polite"></p>
        </div>
        <div class="vozen-category-panel">
          <label for="vozen-category-select">Category</label>
          <select id="vozen-category-select" class="vozen-category-select"></select>
          <div class="vozen-category-list" role="group" aria-label="Categories"></div>
        </div>`;
      const originalFilters = one(".filters", toolbar.parentElement);
      const section = toolbar.parentElement;
      section.insertBefore(controls, originalFilters || grid);
      if (originalFilters) originalFilters.hidden = true;
      const originalSearch = one(".search", toolbar);
      if (originalSearch) originalSearch.hidden = true;
    }

    if (one(".filters", toolbar.parentElement)) one(".filters", toolbar.parentElement).hidden = true;
    if (controls.parentElement !== layout) layout.insertBefore(controls, grid);
    const params = routeInfo().query;
    const selectedStatus = params.get("status") || "available";
    const selectedCategory = params.get("category") || "all";
    const search = params.get("q") || "";
    const statusLabels = [
      ["active", "Active", counts.active],
      ["available", "Available", counts.active + counts.available],
      ["beta", "Beta", counts.beta],
      ["planned", "Planned", counts.planned],
      ["blocked", "Blocked", counts.blocked],
      ["roadmap", "Roadmap", counts.planned + counts.blocked],
    ];
    const filterWrap = one(".vozen-status-filters", controls);
    const statusSignature = statusLabels.map(([id, , count]) => `${id}:${count}`).join("|");
    if (filterWrap.dataset.uiSignature !== statusSignature) {
      filterWrap.replaceChildren(...statusLabels.map(([id, label, count]) => createFilterButton(label, id, count)));
      filterWrap.dataset.uiSignature = statusSignature;
      all(".vozen-filter-button", filterWrap).forEach((button) => {
        button.addEventListener("click", () => {
          writeFeatureQuery({ status: button.dataset.filter, category: routeInfo().query.get("category") || "all", q: one(".vozen-catalog-search", controls).value.trim() });
          applyCatalogFilter(controls, grid);
        });
      });
    }
    all(".vozen-filter-button", filterWrap).forEach((button) => button.classList.toggle("active", button.dataset.filter === selectedStatus));

    const categorySelect = one(".vozen-category-select", controls);
    const categoryList = one(".vozen-category-list", controls);
    const categorySignature = [...categories.entries()].map(([id, label]) => `${id}:${label}`).join("|");
    if (categoryList.dataset.uiSignature !== categorySignature) {
      categorySelect.replaceChildren(...[...categories.entries()].map(([id, label]) => new Option(label, id)));
      categoryList.replaceChildren(...[...categories.entries()].map(([id, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.category = id;
        decorateCategoryButton(button, id, label, categoryCounts[id] || 0);
        button.addEventListener("click", () => {
          writeFeatureQuery({ status: routeInfo().query.get("status") || "available", category: id, q: one(".vozen-catalog-search", controls).value.trim() });
          applyCatalogFilter(controls, grid);
        });
        return button;
      }));
      categoryList.dataset.uiSignature = categorySignature;
    }
    categorySelect.value = selectedCategory;
    all(".vozen-category-list button", categoryList).forEach((button) => {
      const active = button.dataset.category === selectedCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (!categorySelect.dataset.uiBound) {
      categorySelect.dataset.uiBound = "true";
      categorySelect.addEventListener("change", () => {
        writeFeatureQuery({ status: selectedStatus, category: categorySelect.value, q: one(".vozen-catalog-search", controls).value.trim() });
        applyCatalogFilter(controls, grid);
      });
    }
    const searchInput = one(".vozen-catalog-search", controls);
    searchInput.value = search;
    if (!searchInput.dataset.uiBound) {
      searchInput.dataset.uiBound = "true";
      searchInput.addEventListener("input", () => {
        const next = routeInfo().query;
        writeFeatureQuery({ status: next.get("status") || "available", category: next.get("category") || "all", q: searchInput.value.trim() });
        applyCatalogFilter(controls, grid);
      });
    }
    applyCatalogFilter(controls, grid);
  }

  function applyCatalogFilter(controls, grid) {
    const params = routeInfo().query;
    const statusFilter = params.get("status") || "available";
    const categoryFilter = params.get("category") || "all";
    const query = (params.get("q") || "").toLowerCase();
    let visible = 0;
    all(".feature", grid).forEach((card) => {
      const status = card.dataset.uiStatus || featureStatus(card);
      const usable = status === "active" || status === "available" || status === "beta";
      const statusMatch = statusFilter === "available" ? usable : statusFilter === "roadmap" ? ["planned", "blocked"].includes(status) : status === statusFilter;
      const categoryMatch = categoryFilter === "all" || card.dataset.uiCategory === categoryFilter;
      const textMatch = !query || cleanText(card.textContent).toLowerCase().includes(query);
      const show = statusMatch && categoryMatch && textMatch;
      card.hidden = !show;
      card.setAttribute("aria-hidden", String(!show));
      if (show) visible += 1;
    });

    all(".vozen-filter-button", controls).forEach((button) => {
      const active = button.dataset.filter === statusFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    all(".vozen-category-list button", controls).forEach((button) => {
      const active = button.dataset.category === categoryFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const select = one(".vozen-category-select", controls);
    if (select) select.value = categoryFilter;

    const summary = one(".vozen-catalog-result-summary", controls);
    if (summary) {
      const noun = visible === 1 ? "module" : "modules";
      summary.textContent = `${visible} ${noun} shown${query ? ` for "${params.get("q")}"` : ""}`;
    }
    const recommendationHeading = one(".vozen-recommendations-heading", grid);
    const recommendedVisible = all('.feature[data-ui-recommended="true"]', grid).some((card) => !card.hidden);
    if (recommendationHeading) {
      recommendationHeading.hidden = statusFilter !== "available" || categoryFilter !== "all" || Boolean(query) || !recommendedVisible;
    }

    let empty = one("#vozen-catalog-empty");
    if (!empty) {
      empty = document.createElement("div");
      empty.id = "vozen-catalog-empty";
      empty.className = "vozen-catalog-empty card";
      empty.innerHTML = `<span aria-hidden="true">⌕</span><h3>No modules match these filters</h3><p>Try clearing the search or showing available modules again.</p><button type="button" class="secondary">Clear filters</button>`;
      grid.after(empty);
      one("button", empty).addEventListener("click", () => {
        writeFeatureQuery({ status: "available", category: "all", q: "" });
        const input = one(".vozen-catalog-search", controls);
        if (input) input.value = "";
        applyCatalogFilter(controls, grid);
      });
    }
    empty.hidden = visible > 0;
  }

  function enhanceQuickSetup() {
    const page = one(".quick-setup-page");
    if (!page) return;
    page.classList.add("ui-quick-setup");
    const progress = one(".setup-progress", page);
    if (!progress || one(".vozen-setup-journey", page)) return;
    const journey = document.createElement("div");
    journey.className = "vozen-setup-journey";
    journey.setAttribute("aria-label", "Setup phases");
    journey.innerHTML = `
      <div class="active"><span>1</span><div><b>Goals</b><small>Define the essentials</small></div></div>
      <div><span>2</span><div><b>Modules</b><small>Apply safe defaults</small></div></div>
      <div><span>3</span><div><b>Publish</b><small>Review and confirm</small></div></div>`;
    progress.before(journey);
    progress.setAttribute("aria-label", "Setup substeps");
  }

  function enhanceActivity() {
    const empty = one(".activity .empty");
    if (!empty || empty.dataset.uiEnhanced) return;
    empty.dataset.uiEnhanced = "true";
    empty.innerHTML = `<span class="vozen-empty-icon" aria-hidden="true">◷</span><h3>Activity starts here</h3><p>After you configure or publish a module, this is where your server history will appear.</p><button type="button" class="primary">Configure your first module</button>`;
    one("button", empty).addEventListener("click", () => go("/features"));
  }

  function formSnapshot(container) {
    return all("input, select, textarea", container).map((field) => `${field.name || field.type}:${field.type === "checkbox" ? field.checked : field.value}`).join("|");
  }

  function validateForm(container) {
    let invalid = false;
    all("input, select, textarea", container).forEach((field) => {
      const emptyRequired = field.required && !String(field.value || "").trim();
      const numberInvalid = field.type === "number" && ((field.min !== "" && Number(field.value) < Number(field.min)) || (field.max !== "" && Number(field.value) > Number(field.max)));
      const fieldInvalid = emptyRequired || numberInvalid;
      field.setAttribute("aria-invalid", String(fieldInvalid));
      invalid ||= fieldInvalid;
    });
    return invalid;
  }

  function previewField(container, terms, fallback = "Not set") {
    const needles = terms.map((term) => term.toLowerCase());
    const field = all("input, select, textarea", container).find((candidate) => {
      const label = cleanText(candidate.closest("label")?.textContent || "").toLowerCase();
      const name = String(candidate.name || candidate.id || "").toLowerCase();
      return needles.some((needle) => label.includes(needle) || name.includes(needle));
    });
    if (!field) return fallback;
    if (field.type === "checkbox") return field.checked ? "Enabled" : "Disabled";
    return String(field.value || fallback).trim() || fallback;
  }

  function simulationRows(page, route) {
    const container = one(".detail-layout", page) || page;
    if (/community\.levels/.test(route)) {
      const minXp = previewField(container, ["minimum xp", "minxp"], "15");
      const maxXp = previewField(container, ["maximum xp", "maxxp"], "30");
      const cooldown = previewField(container, ["cooldown", "cooldownseconds"], "60");
      const stackRoles = previewField(container, ["stack level roles", "stackroles"], "Disabled");
      const channel = previewField(container, ["announcement channel", "announcementchannel"], "Not selected");
      return [
        { tone: "event", label: "EVENT", title: "A member sends a message", text: "The Helper checks the XP cooldown before continuing." },
        { tone: "reward", label: "XP REWARD", title: `${minXp}–${maxXp} XP awarded`, text: "A random amount inside this range is added to the member's progression." },
        { tone: "cooldown", label: "COOLDOWN", title: `${cooldown} seconds`, text: "Messages inside this cooldown window do not award additional XP." },
        { tone: "roles", label: "LEVEL ROLES", title: stackRoles, text: channel === "Not selected" ? "No announcement channel is selected." : `Announcements use ${channel}.` },
      ];
    }
    const values = all("input, select, textarea", container)
      .map((field) => ({
        label: cleanText(field.closest("label")?.querySelector("span")?.textContent || field.name || field.type || "Setting"),
        value: field.type === "checkbox" ? (field.checked ? "Enabled" : "Disabled") : String(field.value || "Not set").trim(),
      }))
      .filter((item) => item.label && item.value)
      .slice(0, 4);
    return values.length
      ? [{ tone: "config", label: "CONFIGURATION", title: "Current values loaded", text: values.map((item) => `${item.label}: ${item.value}`).join(" · ") }]
      : [{ tone: "config", label: "CONFIGURATION", title: "Ready to preview", text: "The current module settings will be checked without publishing anything." }];
  }

  function simulationVisual(page, route) {
    const container = one(".detail-layout", page) || page;
    if (/protection\.antispam/.test(route)) {
      const windowCount = previewField(container, ["messages in time window"], "6");
      const duplicate = previewField(container, ["duplicate messages"], "3");
      const timeout = previewField(container, ["initial timeout"], "60");
      return {
        channel: "general",
        eyebrow: "LIVE EXAMPLE",
        title: "Protection in action",
        messages: [
          { kind: "normal", initials: "N", name: "Nova", meta: "Community message", text: "Can someone share the event details?" },
          { kind: "warning", initials: "K", name: "Kairo", meta: `${duplicate} repeated messages`, text: "join join join join join join" },
          { kind: "action", initials: "VH", name: "Vozen Helper", meta: "Protection rule triggered", text: "Message held for review" },
        ],
        action: `Would prepare a ${timeout}s timeout after ${windowCount} messages in the time window.`,
      };
    }
    if (/community\.levels/.test(route)) {
      const minXp = previewField(container, ["minimum xp", "minxp"], "15");
      const maxXp = previewField(container, ["maximum xp", "maxxp"], "30");
      return {
        channel: "general",
        eyebrow: "LIVE EXAMPLE",
        title: "Progress in action",
        messages: [
          { kind: "normal", initials: "M", name: "Mira", meta: "Community message", text: "That strategy worked perfectly!" },
          { kind: "helper", initials: "VH", name: "Vozen Helper", meta: "XP event", text: `+${minXp}-${maxXp} XP added to Mira` },
          { kind: "success", initials: "UP", name: "Level progress", meta: "Preview state", text: "Member moves closer to the next level" },
        ],
        action: "The configured XP and cooldown rules are applied locally for this preview.",
      };
    }
    const firstValue = all("input, select, textarea", container)
      .map((field) => String(field.value || "").trim())
      .find(Boolean) || "the current settings";
    return {
      channel: "general",
      eyebrow: "LIVE EXAMPLE",
      title: "Configuration in action",
      messages: [
        { kind: "normal", initials: "M", name: "Member", meta: "Community event", text: "A new event arrives in the server" },
        { kind: "helper", initials: "VH", name: "Vozen Helper", meta: "Rule evaluated", text: `Uses ${firstValue}` },
        { kind: "success", initials: "OK", name: "Preview complete", meta: "No external effects", text: "The configured response is ready" },
      ],
      action: "This sequence is simulated locally and will not publish anything.",
    };
  }

  function closeSimulationPreview(page) {
    const modal = one("#vozen-simulation-modal");
    if (!modal) return;
    document.body.classList.remove("vozen-modal-open");
    document.removeEventListener("keydown", modal._onKeyDown);
    modal.remove();
    page._simulationTrigger?.focus();
  }

  function openSimulationPreview(page, route, trigger) {
    closeSimulationPreview(page);
    const title = cleanText(one("h2", page)?.textContent) || "Module";
    const rows = simulationRows(page, route);
    const visual = simulationVisual(page, route);
    const modal = document.createElement("div");
    modal.id = "vozen-simulation-modal";
    modal.className = "vozen-simulation-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "vozen-simulation-title");
    modal.innerHTML = `
      <div class="vozen-simulation-backdrop" data-simulation-close="true"></div>
      <section class="vozen-simulation-dialog" role="document">
        <header class="vozen-simulation-header">
          <div>
            <span class="vozen-eyebrow">SAFE PREVIEW</span>
            <h2 id="vozen-simulation-title">${escapeHtml(title)}</h2>
            <p>See what this configuration would do before publishing.</p>
          </div>
          <button type="button" class="vozen-simulation-close" aria-label="Close simulation preview">×</button>
        </header>
        <div class="vozen-simulation-badge"><span aria-hidden="true">●</span> Preview only · No real action will be sent</div>
        <div class="vozen-simulation-content">
          <div class="vozen-simulation-timeline">
            ${rows.map((row, index) => `<article class="vozen-simulation-step" data-tone="${escapeHtml(row.tone)}"><span class="vozen-simulation-step-number">${index + 1}</span><div><span class="vozen-eyebrow">${escapeHtml(row.label)}</span><h3>${escapeHtml(row.title)}</h3><p>${escapeHtml(row.text)}</p></div></article>`).join("")}
          </div>
          <aside class="vozen-live-preview" aria-label="Live simulation example">
            <div class="vozen-live-preview-head">
              <div>
                <span class="vozen-eyebrow">${escapeHtml(visual.eyebrow)}</span>
                <h3>${escapeHtml(visual.title)}</h3>
              </div>
              <button type="button" class="vozen-preview-replay" aria-label="Replay live example">Replay</button>
            </div>
            <div class="vozen-discord-preview" aria-live="polite">
              <div class="vozen-discord-channel"><span aria-hidden="true">#</span> ${escapeHtml(visual.channel)} <small>SIMULATED</small></div>
              <div class="vozen-discord-messages">
                ${visual.messages.map((message, index) => `<div class="vozen-preview-message" data-kind="${escapeHtml(message.kind)}" data-preview-animate="true" style="--preview-delay:${index * 260}ms"><span class="vozen-preview-avatar" aria-hidden="true">${escapeHtml(message.initials)}</span><div class="vozen-preview-message-copy"><div><strong>${escapeHtml(message.name)}</strong><small>now</small></div><p>${escapeHtml(message.text)}</p><span>${escapeHtml(message.meta)}</span></div></div>`).join("")}
              </div>
              <div class="vozen-helper-action" data-preview-animate="true" style="--preview-delay:${visual.messages.length * 260}ms"><span class="vozen-helper-action-label">HELPER ACTION</span><strong>${escapeHtml(visual.action)}</strong></div>
            </div>
            <p class="vozen-live-preview-note">Visual example only. Nothing is sent to Discord.</p>
          </aside>
        </div>
        <footer class="vozen-simulation-footer"><span>These are simulated results based on the values currently in the form.</span><button type="button" class="primary vozen-simulation-done">Close preview</button></footer>
      </section>`;
    document.body.append(modal);
    document.body.classList.add("vozen-modal-open");
    page._simulationTrigger = trigger;
    const close = () => closeSimulationPreview(page);
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    modal._onKeyDown = onKeyDown;
    document.addEventListener("keydown", onKeyDown);
    one(".vozen-simulation-close", modal)?.addEventListener("click", close);
    one(".vozen-simulation-done", modal)?.addEventListener("click", close);
    one("[data-simulation-close]", modal)?.addEventListener("click", close);
    const startVisualAnimation = () => all("[data-preview-animate]", modal).forEach((item) => item.classList.add("is-running"));
    one(".vozen-preview-replay", modal)?.addEventListener("click", () => {
      all("[data-preview-animate]", modal).forEach((item) => item.classList.remove("is-running"));
      window.requestAnimationFrame(startVisualAnimation);
    });
    window.requestAnimationFrame(() => {
      startVisualAnimation();
      one(".vozen-simulation-close", modal)?.focus();
    });
  }

  function simulationVisual(page, route) {
    const container = one(".detail-layout", page) || page;
    if (/protection\.antispam/.test(route)) {
      const windowCount = previewField(container, ["messages in time window"], "6");
      const duplicate = previewField(container, ["duplicate messages"], "3");
      const timeout = previewField(container, ["initial timeout"], "60");
      return {
        scene: "antispam", icon: "shield-message", theme: "protection", eyebrow: "LIVE SCENARIO", title: "Protection in action",
        accent: "#5EDCF5", secondary: "#F0C56A", duration: 6200, duplicate, windowCount, timeout,
        finalSummary: "Spam stopped before it reached the channel.",
        stages: [
          { label: "NORMAL", title: "Channel healthy", text: "Conversation is flowing normally.", status: "Channel healthy", tone: "calm" },
          { label: "SIGNAL", title: "Repeated messages arrive", text: `${duplicate} duplicate messages cross the configured threshold.`, status: "Signal detected", tone: "warning" },
          { label: "DETECTION", title: "Pattern detected", text: "The Helper connects repeated content into one moderation signal.", status: "Pattern detected", tone: "signal" },
          { label: "ACTION", title: "Messages held", text: `A ${timeout}s timeout is prepared for the simulated offender.`, status: "Helper action", tone: "action" },
          { label: "RESOLUTION", title: "Channel protected", text: "Normal conversation can continue without the spam burst.", status: "Protected", tone: "success" },
        ],
      };
    }
    if (/support\.welcome/.test(route)) {
      const channel = previewField(container, ["public channel"], "general");
      const publicMessage = previewField(container, ["public message"], "Welcome, {member}! Read the rules and enjoy your stay.");
      const sendDm = previewField(container, ["send private message"], "Disabled");
      const role = previewField(container, ["role", "auto role"], "No role selected");
      return {
        scene: "welcome", icon: "welcome", theme: "support", eyebrow: "LIVE SCENARIO", title: "Welcome in action",
        accent: "#76DFC1", secondary: "#F2B880", duration: 6400, channel, publicMessage, sendDm, role,
        finalSummary: "The new member is ready to join the conversation.",
        stages: [
          { label: "NORMAL", title: "Waiting for new members", text: "The welcome flow is standing by.", status: "Waiting", tone: "calm" },
          { label: "EVENT", title: "A new member joins", text: "A simulated member enters the server.", status: "Member joined", tone: "signal" },
          { label: "PERSONALIZE", title: "Message prepared", text: `Variables resolve before posting to #${channel}.`, status: "Personalized", tone: "action" },
          { label: "WELCOME", title: "Public welcome ready", text: publicMessage, status: "Welcome prepared", tone: "success" },
          { label: "RESOLUTION", title: "Onboarding complete", text: sendDm === "Enabled" ? `Private message and ${role} are ready.` : "The public welcome is ready for the member.", status: "Ready to join", tone: "success" },
        ],
      };
    }
    if (/community\.levels/.test(route)) {
      const min = Number.parseFloat(String(previewField(container, ["minimum xp", "minxp"], "15")).replace(",", ".")) || 15;
      const max = Number.parseFloat(String(previewField(container, ["maximum xp", "maxxp"], "30")).replace(",", ".")) || 30;
      const xpGain = Math.round((min + max) / 2);
      return {
        scene: "levels", icon: "levels", theme: "community", eyebrow: "LIVE SCENARIO", title: "Progress in action",
        accent: "#F0C56A", secondary: "#8EE5D2", duration: 5800, xpGain,
        finalSummary: `Level progress complete. ${xpGain} XP was added in this local preview.`,
        stages: [
          { label: "NORMAL", title: "A healthy message lands", text: "A member contributes to the conversation.", status: "Community active", tone: "calm" },
          { label: "ELIGIBILITY", title: "Cooldown clear", text: "The message qualifies for an XP reward.", status: "Cooldown clear", tone: "signal" },
          { label: "REWARD", title: `+${xpGain} XP awarded`, text: "The configured range produces a deterministic preview reward.", status: "XP reward", tone: "action" },
          { label: "PROGRESS", title: "Progress reaches the next level", text: "The member's bar fills and the level marker updates.", status: "Progress updated", tone: "success" },
          { label: "RESOLUTION", title: "Next level started", text: "The member continues from the new level.", status: "Level reached", tone: "success" },
        ],
      };
    }
    if (/social\.twitch/.test(route)) {
      const channelName = previewField(container, ["twitch channel"], "rexy40407");
      const destination = previewField(container, ["discord channel"], "streams");
      const alertMessage = previewField(container, ["alert message"], "{broadcaster} is live now!");
      return {
        scene: "twitch", icon: "twitch", theme: "social", eyebrow: "LIVE SCENARIO", title: "Twitch alert in action",
        accent: "#A8B0FF", secondary: "#FF7A84", duration: 6000, channelName, destination, alertMessage,
        finalSummary: `Twitch alert ready for #${destination}.`,
        stages: [
          { label: "NORMAL", title: "Stream offline", text: `${channelName} is waiting for a live event.`, status: "Offline", tone: "calm" },
          { label: "EVENT", title: "Channel goes live", text: "A simulated broadcast signal reaches the Helper.", status: "Live event", tone: "signal" },
          { label: "MATCH", title: "Channel event matched", text: "The configured alert rule matches the simulated event.", status: "Rule matched", tone: "action" },
          { label: "COMPOSE", title: "Alert assembled", text: alertMessage, status: "Alert prepared", tone: "success" },
          { label: "RESOLUTION", title: "Twitch alert ready", text: `The alert would post to #${destination}.`, status: "Ready to post", tone: "success" },
        ],
      };
    }
    const firstValue = all("input, select, textarea", container).map((field) => String(field.value || "").trim()).find(Boolean) || "the current settings";
    return {
      scene: "generic", icon: "workflow", theme: "support", eyebrow: "LIVE SCENARIO", title: "Configuration in action",
      accent: "#5EDCF5", secondary: "#8EE5D2", duration: 5200, firstValue,
      finalSummary: "The configured response is ready in this local preview.",
      stages: [
        { label: "NORMAL", title: "Server is ready", text: "The module is waiting for a matching event.", status: "Ready", tone: "calm" },
        { label: "EVENT", title: "A server event arrives", text: "The Helper receives a simulated trigger.", status: "Event received", tone: "signal" },
        { label: "MATCH", title: "Rules evaluated", text: `The current setting is ${firstValue}.`, status: "Rules checked", tone: "action" },
        { label: "ACTION", title: "Helper response prepared", text: "The configured response is staged locally.", status: "Action prepared", tone: "success" },
        { label: "RESOLUTION", title: "Preview complete", text: "No external action was performed.", status: "Complete", tone: "success" },
      ],
    };
  }

  function stageMarkup(visual) {
    const common = `<div class="vozen-stage-topline"><span class="vozen-stage-status" data-stage-status>${escapeHtml(visual.stages[0].status)}</span><span class="vozen-stage-live-label">SIMULATED</span></div>`;
    if (visual.scene === "antispam") return `${common}<div class="vozen-scene vozen-scene-antispam"><div class="vozen-scene-grid"></div><div class="vozen-chat-lane"><div class="vozen-stage-item vozen-chat-message is-complete" data-beat="0"><span class="vozen-scene-avatar">N</span><div><strong>Nova</strong><small>now</small><p>Can someone share the event details?</p></div></div><div class="vozen-stage-item vozen-chat-message vozen-spam-cluster" data-beat="1"><span class="vozen-scene-avatar vozen-avatar-warning">K</span><div><strong>Kairo</strong><small>now</small><p>join join join join join join</p><span class="vozen-scene-meta"><span data-spam-count>0/3</span> repeated messages</span></div></div><div class="vozen-stage-item vozen-detection-card" data-beat="2"><span>${svgIcon(ICONS["shield-message"], "vozen-scene-inline-icon")}</span><div><strong>Pattern detected</strong><small>Duplicate content linked</small></div></div></div><div class="vozen-stage-item vozen-scene-shield" data-beat="3">${svgIcon(ICONS["shield-message"], "vozen-scene-hero-icon")}<span>HELD</span></div><div class="vozen-stage-item vozen-scene-action" data-beat="3"><span class="vozen-scene-action-label">HELPER ACTION</span><strong>Message held for review</strong></div><div class="vozen-stage-item vozen-scene-result" data-beat="4"><span>${svgIcon(ICONS["shield-message"], "vozen-scene-result-icon")}</span><strong>Spam stopped before it reached the channel</strong></div></div>`;
    if (visual.scene === "welcome") return `${common}<div class="vozen-scene vozen-scene-welcome"><div class="vozen-scene-grid"></div><div class="vozen-welcome-orbit"><span class="vozen-welcome-node">${svgIcon(ICONS.welcome, "vozen-scene-inline-icon")}</span><span class="vozen-welcome-avatar vozen-stage-item is-complete" data-beat="1">M</span><i></i><i></i></div><div class="vozen-welcome-count vozen-stage-item is-complete" data-beat="1"><strong>+1</strong><small>new member</small></div><div class="vozen-welcome-message vozen-stage-item" data-beat="3"><span class="vozen-welcome-message-label">WELCOME PREPARED</span><strong>Welcome, Mira!</strong><p>${escapeHtml(visual.publicMessage)}</p><small>#${escapeHtml(visual.channel)}</small></div><div class="vozen-welcome-actions vozen-stage-item" data-beat="4"><span>${visual.sendDm === "Enabled" ? "DM ready" : "DM skipped"}</span><span>${visual.role !== "No role selected" ? escapeHtml(visual.role) : "No role selected"}</span></div><div class="vozen-scene-result vozen-stage-item" data-beat="4"><span>${svgIcon(ICONS.welcome, "vozen-scene-result-icon")}</span><strong>Ready to join the conversation</strong></div></div>`;
    if (visual.scene === "levels") return `${common}<div class="vozen-scene vozen-scene-levels"><div class="vozen-scene-grid"></div><div class="vozen-level-message vozen-stage-item is-complete" data-beat="0"><span class="vozen-scene-avatar">M</span><div><strong>Mira</strong><small>now</small><p>That strategy worked perfectly!</p></div></div><div class="vozen-cooldown-check vozen-stage-item" data-beat="1"><span>${svgIcon(ICONS["shield-message"], "vozen-scene-inline-icon")}</span><strong>Cooldown clear</strong></div><div class="vozen-xp-reward vozen-stage-item" data-beat="2"><span class="vozen-xp-orbit"><i></i><i></i><i></i></span><strong>+${escapeHtml(visual.xpGain)} XP</strong><small>community reward</small></div><div class="vozen-xp-progress vozen-stage-item" data-beat="3"><div class="vozen-xp-progress-head"><span>LEVEL 11</span><strong data-xp-value>72%</strong></div><div class="vozen-xp-track"><span data-xp-fill></span></div></div><div class="vozen-level-up vozen-stage-item" data-beat="4"><span>${svgIcon(ICONS.levels, "vozen-scene-result-icon")}</span><strong>Level 12 reached</strong><small>Next level started</small></div></div>`;
    if (visual.scene === "twitch") return `${common}<div class="vozen-scene vozen-scene-twitch"><div class="vozen-scene-grid"></div><div class="vozen-twitch-status vozen-stage-item is-complete" data-beat="0"><span class="vozen-twitch-dot" data-live-dot></span><strong data-live-status>OFFLINE</strong><small>${escapeHtml(visual.channelName)}</small></div><div class="vozen-broadcast-rings vozen-stage-item" data-beat="1"><i></i><i></i><span>${svgIcon(ICONS.twitch, "vozen-scene-hero-icon")}</span></div><div class="vozen-twitch-match vozen-stage-item" data-beat="2"><span>${svgIcon(ICONS["shield-message"], "vozen-scene-inline-icon")}</span><strong>Channel event matched</strong></div><div class="vozen-alert-card vozen-stage-item" data-beat="3"><span class="vozen-alert-live">LIVE</span><strong>${escapeHtml(visual.channelName)}</strong><p>${escapeHtml(visual.alertMessage)}</p><small>Simulated Twitch alert</small></div><div class="vozen-twitch-destination vozen-stage-item" data-beat="4"><span>#${escapeHtml(visual.destination)}</span><strong>Twitch alert ready</strong><small>Would post here</small></div></div>`;
    return `${common}<div class="vozen-scene vozen-scene-generic"><div class="vozen-scene-grid"></div><div class="vozen-generic-node vozen-stage-item is-complete" data-beat="0">${svgIcon(ICONS.workflow, "vozen-scene-hero-icon")}<strong>Ready</strong></div><div class="vozen-generic-flow vozen-stage-item" data-beat="1"><span></span><span></span><span></span></div><div class="vozen-generic-result vozen-stage-item" data-beat="4"><strong>Preview complete</strong><small>No external effects</small></div></div>`;
  }

  function closeSimulationPreview(page) {
    const modal = one("#vozen-simulation-modal");
    if (!modal) return;
    modal._previewCleanup?.();
    document.body.classList.remove("vozen-modal-open");
    modal.remove();
    page._simulationTrigger?.focus();
  }

  function openSimulationPreview(page, route, trigger) {
    closeSimulationPreview(page);
    const title = cleanText(one("h2", page)?.textContent) || "Module";
    const visual = simulationVisual(page, route);
    const modal = document.createElement("div");
    modal.id = "vozen-simulation-modal";
    modal.className = "vozen-simulation-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "vozen-simulation-title");
    modal.setAttribute("aria-describedby", "vozen-simulation-description");
    modal.innerHTML = `<div class="vozen-simulation-backdrop" data-simulation-close="true"></div><section class="vozen-simulation-dialog" role="document" style="--preview-accent:${escapeHtml(visual.accent)};--preview-secondary:${escapeHtml(visual.secondary)}"><header class="vozen-simulation-header"><div><span class="vozen-eyebrow">SAFE PREVIEW</span><h2 id="vozen-simulation-title">${escapeHtml(title)}</h2><p id="vozen-simulation-description">See what this configuration would do before publishing.</p></div><button type="button" class="vozen-simulation-close" aria-label="Close simulation preview">×</button></header><div class="vozen-simulation-badge"><span aria-hidden="true">●</span> Preview only · No real action will be sent</div><div class="vozen-simulation-content"><ol class="vozen-scenario-rail" aria-label="Preview scenario steps">${visual.stages.map((stage, index) => `<li class="vozen-scenario-step ${index === 0 ? "is-active" : ""}" data-rail-beat="${index}"><span>${index + 1}</span><div><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.title)}</small></div></li>`).join("")}</ol><div class="vozen-signal-column"><div class="vozen-signal-stage" data-scene="${escapeHtml(visual.scene)}" aria-hidden="true">${stageMarkup(visual)}</div><p class="vozen-live-preview-note">Visual example only. Nothing is sent to Discord or external services.</p></div></div><p class="vozen-preview-sr-summary" aria-live="polite">Preview ready.</p><footer class="vozen-simulation-footer"><div class="vozen-preview-progress-wrap"><div class="vozen-preview-progress" role="progressbar" aria-label="Preview progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-preview-progress></span></div><span data-preview-state>Ready</span></div><div class="vozen-preview-controls"><button type="button" class="vozen-preview-replay" aria-label="Replay preview">Replay</button><button type="button" class="primary vozen-preview-playback" aria-label="Play preview">Play preview</button><button type="button" class="secondary vozen-simulation-done">Close preview</button></div></footer></section>`;
    document.body.append(modal);
    document.body.classList.add("vozen-modal-open");
    page._simulationTrigger = trigger;
    const playback = { status: "idle", elapsed: 0, startedAt: 0, raf: 0, timeout: 0, beat: 0, observer: null };
    const progress = one("[data-preview-progress]", modal);
    const progressTrack = one(".vozen-preview-progress", modal);
    const stateLabel = one("[data-preview-state]", modal);
    const playbackButton = one(".vozen-preview-playback", modal);
    const replayButton = one(".vozen-preview-replay", modal);
    const srSummary = one(".vozen-preview-sr-summary", modal);
    const beatForTime = (elapsed) => Math.min(visual.stages.length - 1, Math.floor((elapsed / visual.duration) * visual.stages.length));
    const updateSceneProgress = (elapsed) => {
      if (visual.scene === "levels") {
        const fill = one("[data-xp-fill]", modal); const value = one("[data-xp-value]", modal);
        const start = visual.duration * 0.45; const end = visual.duration * 0.69;
        const ratio = elapsed <= start ? 0 : Math.min(1, (elapsed - start) / (end - start)); const percentage = Math.round(72 + ratio * 28);
        fill?.style.setProperty("--xp-progress", `${percentage}%`); if (value) value.textContent = `${percentage}%`;
      }
      if (visual.scene === "antispam") {
        const count = one("[data-spam-count]", modal); const start = visual.duration * 0.11; const end = visual.duration * 0.28;
        const ratio = elapsed <= start ? 0 : Math.min(1, (elapsed - start) / (end - start)); if (count) count.textContent = `${Math.round(ratio * 3)}/3`;
      }
      if (visual.scene === "twitch") {
        const live = playback.beat >= 1; const status = one("[data-live-status]", modal); const dot = one("[data-live-dot]", modal);
        if (status) status.textContent = live ? "LIVE" : "OFFLINE"; dot?.classList.toggle("is-live", live);
      }
    };
    const renderBeat = (beat) => {
      playback.beat = beat;
      all("[data-rail-beat]", modal).forEach((item) => { const itemBeat = Number(item.dataset.railBeat); item.classList.toggle("is-active", itemBeat === beat); item.classList.toggle("is-complete", itemBeat < beat || playback.status === "completed"); });
      all("[data-beat]", modal).forEach((item) => { const itemBeat = Number(item.dataset.beat); item.classList.toggle("is-active", itemBeat === beat); item.classList.toggle("is-complete", itemBeat < beat || playback.status === "completed"); });
      const status = one("[data-stage-status]", modal); if (status) status.textContent = visual.stages[beat]?.status || "Preview";
    };
    const setStatus = (status) => {
      playback.status = status; modal.dataset.playback = status;
      const labels = { idle: ["Play preview", "Play preview", false, "Ready"], playing: ["Pause preview", "Pause preview", false, "Playing"], paused: ["Resume preview", "Resume preview", false, "Paused"], replaying: ["Preparing preview…", "Replay", true, "Replaying"], completed: ["Replay", "Replay", false, "Complete"], error: ["Try again", "Replay", false, "Unavailable"] };
      const [label, aria, disabled, state] = labels[status] || labels.idle;
      if (playbackButton) { playbackButton.textContent = label; playbackButton.setAttribute("aria-label", aria); playbackButton.disabled = disabled; }
      if (replayButton) replayButton.disabled = disabled;
      if (stateLabel) stateLabel.textContent = state;
      if (status === "completed" && srSummary) srSummary.textContent = `Preview complete. ${visual.finalSummary}`;
      if (status === "paused" && srSummary) srSummary.textContent = `Preview paused at ${visual.stages[playback.beat]?.label || "current step"}.`;
    };
    const render = () => {
      if (playback.status !== "playing") return;
      playback.elapsed = Math.min(visual.duration, performance.now() - playback.startedAt); renderBeat(beatForTime(playback.elapsed)); updateSceneProgress(playback.elapsed);
      const percentage = Math.round((playback.elapsed / visual.duration) * 100); if (progress) progress.style.width = `${percentage}%`; if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(percentage));
      if (playback.elapsed >= visual.duration) { setStatus("completed"); renderBeat(visual.stages.length - 1); updateSceneProgress(visual.duration); return; }
      playback.raf = window.requestAnimationFrame(render);
    };
    const start = () => { playback.startedAt = performance.now() - playback.elapsed; setStatus("playing"); playback.raf = window.requestAnimationFrame(render); };
    const pause = () => { if (playback.status !== "playing") return; window.cancelAnimationFrame(playback.raf); playback.elapsed = Math.min(visual.duration, performance.now() - playback.startedAt); setStatus("paused"); renderBeat(beatForTime(playback.elapsed)); updateSceneProgress(playback.elapsed); };
    const replay = () => { window.cancelAnimationFrame(playback.raf); window.clearTimeout(playback.timeout); playback.elapsed = 0; if (progress) progress.style.width = "0%"; setStatus("replaying"); renderBeat(0); updateSceneProgress(0); playback.timeout = window.setTimeout(() => start(), 180); };
    const togglePlayback = () => { if (playback.status === "playing") pause(); else if (playback.status === "paused") start(); else replay(); };
    const close = () => closeSimulationPreview(page);
    const onKeyDown = (event) => { if (event.key === "Escape") close(); };
    const onVisibility = () => { if (document.hidden) pause(); };
    modal._previewCleanup = () => { window.cancelAnimationFrame(playback.raf); window.clearTimeout(playback.timeout); document.removeEventListener("keydown", onKeyDown); document.removeEventListener("visibilitychange", onVisibility); playback.observer?.disconnect(); };
    document.addEventListener("keydown", onKeyDown); document.addEventListener("visibilitychange", onVisibility);
    one(".vozen-simulation-close", modal)?.addEventListener("click", close); one(".vozen-simulation-done", modal)?.addEventListener("click", close); one("[data-simulation-close]", modal)?.addEventListener("click", close);
    playbackButton?.addEventListener("click", togglePlayback); replayButton?.addEventListener("click", replay);
    playback.observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => { if (!entries[0]?.isIntersecting) pause(); }) : null; playback.observer?.observe(modal);
    renderBeat(0); setStatus("idle"); playback.timeout = window.setTimeout(() => start(), 300); window.requestAnimationFrame(() => one(".vozen-simulation-close", modal)?.focus());
  }

  function normalizeEnglishPresets(container, route) {
    if (container.dataset.uiEnglishPresets === "true") return;
    const presetGroups = [
      {
        route: /support\.welcome/,
        presets: [
          {
            matches: [
              "Bem-vindo(a), {member}! Lê as regras e diverte-te.",
              "Bem-vindo(a), {member}! Le as regras e diverte-te.",
            ],
            value: "Welcome, {member}! Read the rules and enjoy your stay.",
            terms: ["public message", "mensagem pública", "mensagem publica"],
          },
          {
            matches: ["Olá {member}, bem-vindo(a) ao servidor!", "Ola {member}, bem-vindo(a) ao servidor!"],
            value: "Hi {member}, welcome to the server!",
            terms: ["private message", "mensagem privada"],
          },
        ],
      },
      {
        route: /community\.levels/,
        presets: [
          { matches: ["{member} chegou ao nível {level}!", "{member} chegou ao nivel {level}!"], value: "{member} reached level {level}!" },
        ],
      },
      {
        route: /social\.twitch/,
        presets: [
          { matches: ["{broadcaster} está ao vivo!\nhttps://twitch.tv/{login}", "{broadcaster} esta ao vivo!\nhttps://twitch.tv/{login}"], value: "{broadcaster} is live now!\nhttps://twitch.tv/{login}" },
        ],
      },
    ];
    const group = presetGroups.find((candidate) => candidate.route.test(route));
    if (!group) return;
    const presets = group.presets;
    presets.forEach((preset) => {
      const field = all("textarea, input", container).find((candidate) => {
        const label = cleanText(candidate.closest("label")?.textContent || "").toLowerCase(); const name = String(candidate.name || candidate.id || "").toLowerCase();
        const currentValue = String(candidate.value || "").trim();
        const labelledMatch = !preset.terms || preset.terms.some((term) => label.includes(term) || name.includes(term));
        return labelledMatch && preset.matches.includes(currentValue);
      });
      if (!field) return;
      const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set; setter?.call(field, preset.value); field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    container.dataset.uiEnglishPresets = "true";
  }

  function enhanceModuleForm() {
    const page = one(".detail-page");
    if (!page || !one(".detail-intro", page)) return;
    const route = routeInfo().path;
    page.classList.add("ui-module-form");
    const container = one(".detail-layout", page) || page;
    normalizeEnglishPresets(container, route);
    const key = `${route}:${one("h2", page)?.textContent || ""}`;
    if (container.dataset.uiFormKey !== key) {
      container.dataset.uiFormKey = key;
      container.dataset.uiBaseline = formSnapshot(container);
      container.dataset.uiDirty = "false";
    }
    const baseline = container.dataset.uiBaseline || "";
    const dirty = formSnapshot(container) !== baseline;
    const invalid = validateForm(container);
    container.dataset.uiDirty = String(dirty);

    all(".advanced", page).forEach((details) => {
      const summary = one("summary", details);
      if (!summary) return;
      summary.setAttribute("aria-expanded", String(details.open));
      if (!summary.dataset.uiBound) {
        summary.dataset.uiBound = "true";
        details.addEventListener("toggle", () => summary.setAttribute("aria-expanded", String(details.open)));
      }
    });

    const actions = one(".sticky-actions", page);
    if (actions) {
      actions.classList.toggle("is-visible", dirty);
      const save = one("button.primary", actions);
      if (save) {
        save.disabled = !dirty || invalid;
        save.setAttribute("aria-disabled", String(save.disabled));
      }
      if (!actions.dataset.uiBound) {
        actions.dataset.uiBound = "true";
        all("input, select, textarea", container).forEach((field) => {
          field.addEventListener("input", () => schedule());
          field.addEventListener("change", () => schedule());
        });
        const discard = one("button.secondary", actions);
        if (discard) discard.addEventListener("click", () => window.setTimeout(schedule, 80));
      }
      const simulate = one("button.secondary", one(".detail-aside", page) || page);
      if (simulate && /simulat|simular/i.test(simulate.textContent) && !simulate.dataset.uiPreviewBound) {
        simulate.dataset.uiPreviewBound = "true";
        simulate.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          openSimulationPreview(page, route, simulate);
        });
      }
    }
  }

  function enhance() {
    if (state.applying) return;
    state.applying = true;
    try {
      const { path } = routeInfo();
      enhanceShell(path);
      if (path === "/" || path === "") enhanceOverview();
      if (path === "/quick-setup") enhanceQuickSetup();
      if (path === "/features") enhanceCatalog();
      if (path === "/activity") enhanceActivity();
      if (path.startsWith("/config/")) enhanceModuleForm();
      state.lastPath = path;
    } finally {
      state.applying = false;
    }
  }

  function schedule() {
    window.clearTimeout(state.scheduled);
    state.scheduled = window.setTimeout(enhance, 60);
  }

  function boot() {
    enhance();
    window.addEventListener("hashchange", schedule);
    window.addEventListener("popstate", schedule);
    window.addEventListener("beforeunload", (event) => {
      const form = one(".ui-module-form .detail-layout");
      if (form?.dataset.uiDirty === "true") {
        event.preventDefault();
        event.returnValue = "";
      }
    });
    const root = one("#root");
    if (root) {
      const observer = new MutationObserver(schedule);
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
