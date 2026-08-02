(() => {
  "use strict";

  const routes = [
    ["/", "Painel", "⌂"],
    ["/quick-setup", "Setup", "✦"],
    ["/features", "Módulos", "◇"],
    ["/activity", "Atividade", "◷"],
    ["/rank-card", "XP", "▣"],
  ];
  const state = { lastPath: "", scheduled: 0, applying: false };

  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();

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
    if (existingNav) existingNav.setAttribute("aria-label", "Navegação principal");

    let mobileHeader = one("#vozen-mobile-header");
    if (!mobileHeader) {
      mobileHeader = document.createElement("div");
      mobileHeader.id = "vozen-mobile-header";
      mobileHeader.className = "vozen-mobile-header";
      mobileHeader.innerHTML = `
        <div class="vozen-mobile-server">
          <span class="vozen-mobile-server-mark" aria-hidden="true">◈</span>
          <label class="vozen-mobile-server-select">
            <span>Servidor</span>
            <select aria-label="Selecionar servidor"></select>
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
      mobileNav.setAttribute("aria-label", "Navegação móvel");
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
      desktopSync.dataset.syncState = /erro|offline/i.test(desktopSync.textContent)
        ? "error"
        : /sincroniz|tudo certo/i.test(desktopSync.textContent)
          ? "synced"
          : "syncing";
      if (mobileSync) {
        const syncText = cleanText(desktopSync.textContent);
        if (mobileSync.textContent !== syncText) mobileSync.textContent = syncText;
      }
    } else if (mobileSync) {
      if (mobileSync.textContent !== "Sincronizado") mobileSync.textContent = "Sincronizado";
    }

    document.body.dataset.uiRoute = path;
  }

  function enhanceOverview() {
    const welcome = one(".welcome");
    if (!welcome) return;
    welcome.classList.add("ui-dashboard-focus");

    const primary = one("button.primary", welcome);
    if (primary) {
      primary.textContent = "Continuar setup";
      primary.setAttribute("aria-label", "Continuar a configuração rápida");
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
    button.innerHTML = `${label}<span>${count}</span>`;
    button.setAttribute("aria-label", `${label}: ${count}`);
    return button;
  }

  function featureStatus(card) {
    const text = cleanText(one(".pill", card)?.textContent).toLowerCase();
    if (text.includes("beta")) return "beta";
    if (text.includes("ativa")) return "active";
    if (text.includes("dispon")) return "available";
    if (text.includes("bloque")) return "blocked";
    return "planned";
  }

  function enhanceCatalog() {
    const toolbar = one(".catalog-toolbar");
    const grid = one(".feature-grid");
    if (!toolbar || !grid) return;

    const cards = all(".feature", grid);
    const counts = { active: 0, available: 0, beta: 0, planned: 0, blocked: 0 };
    const categories = new Map([["all", "Todas"]]);
    cards.forEach((card) => {
      const status = featureStatus(card);
      counts[status] += 1;
      const category = [...card.querySelectorAll(".feature-icon")][0]?.className.match(/feature-icon ([^ ]+)/)?.[1];
      if (category && !categories.has(category)) {
        const labels = {
          protection: "Proteção",
          community: "Comunidade",
          management: "Gestão",
          utility: "Utilidades",
          social: "Alertas sociais",
          growth: "Crescimento",
          web3: "Web3",
        };
        categories.set(category, labels[category] || category);
      }
      card.dataset.uiStatus = status;
      card.dataset.uiCategory = category || "other";
    });

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
      controls.setAttribute("aria-label", "Filtros de funcionalidades");
      controls.innerHTML = `
        <div class="vozen-catalog-controls-main">
          <label class="vozen-search-label">
            <span>Pesquisar módulos</span>
            <input type="search" class="vozen-catalog-search" placeholder="Pesquisar funcionalidade…" autocomplete="off">
          </label>
          <div class="vozen-status-filters" role="group" aria-label="Disponibilidade"></div>
        </div>
        <div class="vozen-category-panel">
          <label for="vozen-category-select">Categoria</label>
          <select id="vozen-category-select" class="vozen-category-select"></select>
          <div class="vozen-category-list" role="group" aria-label="Categorias"></div>
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
      ["active", "Ativos", counts.active],
      ["available", "Disponíveis", counts.active + counts.available],
      ["beta", "Beta", counts.beta],
      ["planned", "Planeados", counts.planned],
      ["blocked", "Bloqueados", counts.blocked],
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
        button.textContent = label;
        button.addEventListener("click", () => {
          writeFeatureQuery({ status: routeInfo().query.get("status") || "available", category: id, q: one(".vozen-catalog-search", controls).value.trim() });
          applyCatalogFilter(controls, grid);
        });
        return button;
      }));
      categoryList.dataset.uiSignature = categorySignature;
    }
    categorySelect.value = selectedCategory;
    all(".vozen-category-list button", categoryList).forEach((button) => button.classList.toggle("active", button.dataset.category === selectedCategory));
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

    all(".vozen-filter-button", controls).forEach((button) => button.classList.toggle("active", button.dataset.filter === statusFilter));
    all(".vozen-category-list button", controls).forEach((button) => button.classList.toggle("active", button.dataset.category === categoryFilter));
    const select = one(".vozen-category-select", controls);
    if (select) select.value = categoryFilter;

    let empty = one("#vozen-catalog-empty");
    if (!empty) {
      empty = document.createElement("div");
      empty.id = "vozen-catalog-empty";
      empty.className = "vozen-catalog-empty card";
      empty.innerHTML = `<span aria-hidden="true">⌕</span><h3>Nenhum módulo corresponde aos filtros</h3><p>Experimenta remover a pesquisa ou voltar a mostrar os módulos disponíveis.</p><button type="button" class="secondary">Limpar filtros</button>`;
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
    journey.setAttribute("aria-label", "Fases da configuração");
    journey.innerHTML = `
      <div class="active"><span>1</span><div><b>Objetivos</b><small>Define o essencial</small></div></div>
      <div><span>2</span><div><b>Módulos</b><small>Aplica defaults seguros</small></div></div>
      <div><span>3</span><div><b>Publicar</b><small>Revê e confirma</small></div></div>`;
    progress.before(journey);
    progress.setAttribute("aria-label", "Subpassos da configuração");
  }

  function enhanceActivity() {
    const empty = one(".activity .empty");
    if (!empty || empty.dataset.uiEnhanced) return;
    empty.dataset.uiEnhanced = "true";
    empty.innerHTML = `<span class="vozen-empty-icon" aria-hidden="true">◷</span><h3>A atividade começa aqui</h3><p>Quando configurares ou publicares um módulo, encontrarás aqui o histórico do servidor.</p><button type="button" class="primary">Configurar o primeiro módulo</button>`;
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

  function enhanceModuleForm() {
    const page = one(".detail-page");
    if (!page || !one(".detail-intro", page)) return;
    const route = routeInfo().path;
    page.classList.add("ui-module-form");
    const container = one(".detail-layout", page) || page;
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
        const simulate = one("button.secondary", one(".detail-aside", page) || page);
        if (simulate && /simular/i.test(simulate.textContent) && !simulate.dataset.uiBound) {
          simulate.dataset.uiBound = "true";
          simulate.addEventListener("click", () => {
            let result = one(".vozen-simulation-output", page);
            if (!result) {
              result = document.createElement("div");
              result.className = "vozen-simulation-output";
              result.setAttribute("role", "status");
              result.setAttribute("aria-live", "polite");
              simulate.after(result);
            }
            result.textContent = "Simulação concluída — nenhuma ação foi enviada.";
          });
        }
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
