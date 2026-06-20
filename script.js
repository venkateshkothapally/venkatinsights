/*
 * Shared portal behaviour
 * - Builds one accessible, expandable card component from the existing markup.
 * - Routes search results to an exact card and highlights it for 7 seconds.
 * - Keeps page-specific HTML small by deriving safe fallback details at runtime.
 */

const darkBtn = document.getElementById("darkModeBtn");
const searchInput = document.getElementById("searchInput");
const searchIndex = window.SITE_SEARCH_INDEX || []; // Note: emergency cards keywords are also handled via portal HTML.
const SEARCH_HIGHLIGHT_MS = 7000;

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\u00c0-\uFFFF]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function slugify(value) {
    return normalizeText(value).replace(/\s+/g, "-") || "service";
}

function setActiveNavigation() {
    const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    document.querySelectorAll(".nav-links a").forEach((link) => {
        const linkPage = (link.getAttribute("href") || "").split(/[?#]/)[0].toLowerCase();
        const active = linkPage === currentPage;
        link.classList.toggle("active", active);
        active ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
    });
}

function setDarkToggleSymbol() {
    if (!darkBtn) return;
    const isDark = document.body.classList.contains("dark-mode");
    darkBtn.textContent = isDark ? "☀" : "☾";
    darkBtn.setAttribute("aria-pressed", String(isDark));
    darkBtn.setAttribute("aria-label", isDark ? "Use light mode" : "Use dark mode");
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

setActiveNavigation();
setDarkToggleSymbol();

darkBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    setDarkToggleSymbol();
});

function getSearchText(item) {
    return normalizeText([item.title, item.category, item.description, item.keywords].join(" "));
}

function getSearchResults(query, limit = 50) {
    const value = normalizeText(query);
    if (!value) return [];
    const terms = value.split(" ");

    return searchIndex
        .map((item) => {
            const title = normalizeText(item.title);
            const category = normalizeText(item.category);
            const haystack = getSearchText(item);
            let score = item.page === "index.html" ? 0 : 30; // Prefer a dedicated service page over a home-page shortcut.

            terms.forEach((term) => {
                if (title === term) score += 15;
                if (title.includes(term)) score += 8;
                if (category.includes(term)) score += 4;
                if (haystack.includes(term)) score += 2;
            });

            if (title === value) score += 15;
            if (title.startsWith(value)) score += 8;
            if (haystack.includes(value)) score += 4;
            return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
        .slice(0, limit);
}

function buildCardUrl(item) {
    const params = new URLSearchParams({ card: item.title });
    if (item.category) params.set("category", item.category);
    return `${item.page}?${params.toString()}#${slugify(item.title)}`;
}

function navigateToSearch(query) {
    const value = String(query || "").trim();
    if (value) window.location.href = `search.html?q=${encodeURIComponent(value)}`;
}

function createSearchResult(item, compact = false) {
    const element = document.createElement(compact ? "button" : "a");
    element.className = compact ? "search-result-item" : "search-result-card";

    if (compact) {
        element.type = "button";
        element.addEventListener("click", () => { window.location.href = buildCardUrl(item); });
    } else {
        element.href = buildCardUrl(item);
    }

    const title = document.createElement("span");
    title.className = "search-result-title";
    title.textContent = item.title;

    const category = document.createElement("span");
    category.className = "search-result-meta";
    category.textContent = item.category || "Portal service"; // Never expose internal filenames in the UI.

    element.append(title, category);

    if (!compact && item.description) {
        const description = document.createElement("span");
        description.className = "search-result-description";
        description.textContent = item.description;
        element.append(description);
    }
    return element;
}

function initializeSearch() {
    if (searchInput) {
        const resultBox = document.createElement("div");
        resultBox.id = "searchResults";
        resultBox.hidden = true;
        resultBox.setAttribute("role", "listbox");
        searchInput.setAttribute("role", "combobox");
        searchInput.setAttribute("aria-autocomplete", "list");
        searchInput.setAttribute("aria-controls", resultBox.id);
        searchInput.setAttribute("aria-expanded", "false");
        searchInput.parentNode.appendChild(resultBox);

        const closeResults = () => {
            resultBox.replaceChildren();
            resultBox.hidden = true;
            searchInput.setAttribute("aria-expanded", "false");
        };

        searchInput.addEventListener("input", () => {
            const value = searchInput.value.trim();
            resultBox.replaceChildren();
            if (value.length < 2) return closeResults();

            const matches = getSearchResults(value, 8);
            if (!matches.length) return closeResults();
            matches.forEach((item) => resultBox.append(createSearchResult(item, true)));
            resultBox.hidden = false;
            searchInput.setAttribute("aria-expanded", "true");
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeResults();
            if (event.key === "ArrowDown" && !resultBox.hidden) {
                event.preventDefault();
                resultBox.querySelector("button")?.focus();
            }
        });

        resultBox.addEventListener("keydown", (event) => {
            if (!/ArrowDown|ArrowUp/.test(event.key)) return;
            event.preventDefault();
            const options = [...resultBox.querySelectorAll("button")];
            const current = options.indexOf(document.activeElement);
            const next = event.key === "ArrowDown" ? (current + 1) % options.length : (current - 1 + options.length) % options.length;
            options[next]?.focus();
        });

        document.addEventListener("click", (event) => {
            if (!searchInput.parentNode.contains(event.target)) closeResults();
        });
        searchInput.form?.addEventListener("submit", (event) => {
            event.preventDefault();
            navigateToSearch(searchInput.value);
        });
    }

    const resultsPage = document.getElementById("searchResultsPage");
    const summary = document.getElementById("searchSummary");
    if (!resultsPage || !summary) return;

    const query = new URLSearchParams(window.location.search).get("q") || "";
    if (searchInput) searchInput.value = query;
    const results = getSearchResults(query, 100);
    resultsPage.replaceChildren();

    if (!query.trim()) return;
    if (!results.length) {
        summary.textContent = `No results found for “${query}”. Try another service, exam, newspaper, or tool name.`;
        return;
    }

    summary.textContent = `${results.length} result${results.length === 1 ? "" : "s"} found for “${query}”.`;
    results.forEach((item) => resultsPage.append(createSearchResult(item)));
}

function directText(card) {
    return [...card.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .filter(Boolean)
        .join(" ");
}

function sectionName(card) {
    return card.closest("section")?.querySelector(".section-title")?.textContent.trim() || "Portal Services";
}

function fallbackOpenUrl(title, category) {
    const value = normalizeText(`${title} ${category}`);
    if (/aadhaar|pan|passport|ration|government|meeseva|bhubharati/.test(value)) return "government.html";
    if (/education|exam|admission|scholarship|eapcet|ecet|icet|cpget|polycet/.test(value)) return "educational.html";
    if (/job|recruit|tspsc|dsc|police|ssc|upsc|railway/.test(value)) return "jobs.html";
    if (/news|paper|eenadu|sakshi|jyothy|hindu/.test(value)) return "newspapers.html";
    if (/tool|pdf|image|generator|calculator|converter/.test(value)) return "tools.html";
    return "";
}

function makeDetailItem(label, content) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-detail-item";
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = content;
    wrapper.append(term, description);
    return wrapper;
}

function setCardExpanded(card, expanded) {
    card.classList.toggle("is-expanded", expanded);
    const button = card.querySelector(".card-toggle");
    if (!button) return;
    button.setAttribute("aria-expanded", String(expanded));
    button.innerHTML = `<span aria-hidden="true">${expanded ? "−" : "+"}</span> ${expanded ? "" : ""}`;
}

function enhanceCard(card, index) {
    if (card.dataset.enhanced === "true") return;
    card.dataset.enhanced = "true";

    let titleElement = card.querySelector("h3");
    const textTitle = directText(card);
    if (!titleElement) {
        titleElement = document.createElement("h3");
        titleElement.textContent = textTitle || `Portal Service ${index + 1}`;
        [...card.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
            .forEach((node) => node.remove());
        card.prepend(titleElement);
    }

    const title = titleElement.textContent.trim();
    const category = sectionName(card);
    const baseId = slugify(title);
    let id = baseId;
    let suffix = 2;
    while (document.getElementById(id)) id = `${baseId}-${suffix++}`;
    card.id = id;
    card.dataset.cardTitle = normalizeText(title);
    card.dataset.cardCategory = normalizeText(category);
    card.tabIndex = 0;
    card.setAttribute("role", "group");
    card.setAttribute("aria-labelledby", `${id}-title`);
    titleElement.id = `${id}-title`;

    const existingDescription = card.querySelector("p");
    const shortDescription = existingDescription?.textContent.trim() || `Access ${title} information, requirements, and official resources.`;
    if (existingDescription) {
        existingDescription.classList.add("card-summary");
    } else {
        const summary = document.createElement("p");
        summary.className = "card-summary";
        summary.textContent = shortDescription;
        titleElement.after(summary);
    }

    const originalLinks = [...card.querySelectorAll("a[href]")];
    const existingOpen = originalLinks.find((link) => normalizeText(link.textContent) === "open");
    const openUrl = card.dataset.openUrl || existingOpen?.getAttribute("href") || fallbackOpenUrl(title, category);
    const openTarget = card.dataset.openTarget || existingOpen?.getAttribute("target") || "";
    existingOpen?.remove();

    // Allow tel: cards (e.g., Emergency Services) to act as "Call" buttons.
    if (card.dataset.openUrl && typeof card.dataset.openUrl === "string" && card.dataset.openUrl.trim().toLowerCase().startsWith("tel:")) {
        card.dataset.openText = card.dataset.openText || "Call";
        // Do not allow link injection from fallbackOpenUrl logic for tel cards.
        // (We keep openUrl as provided via dataset.)
    }

    const controls = document.createElement("div");
    controls.className = "card-actions";

    let openControl;

    const openTextFromData = card.dataset.openText;
    const openIsTel = typeof openUrl === "string" && openUrl.trim().toLowerCase().startsWith("tel:");
    const openAriaLabelPrefix = openIsTel ? "Call" : "Open";

    if (openUrl && openUrl !== "#") {
        openControl = document.createElement("a");
        openControl.href = openUrl;
        if (openTarget) {
            openControl.target = openTarget;
            if (openTarget === "_blank") openControl.rel = "noopener noreferrer";
        }
    } else {
        openControl = document.createElement("button");
        openControl.type = "button";
        openControl.disabled = true;
        openControl.title = "Official link not yet available";
    }

    openControl.className = "card-open-link";

    if (openIsTel) {
        openControl.textContent = openTextFromData || "Call";
    } else {
        openControl.textContent = "Open";
    }

    openControl.setAttribute("aria-label", `${openAriaLabelPrefix} ${title}`);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "card-action-btn card-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", `${id}-details`);
    toggle.innerHTML = '<span aria-hidden="true">+</span> ';
    toggle.addEventListener("click", () => setCardExpanded(card, !card.classList.contains("is-expanded")));
    controls.append(openControl, toggle);

    const details = document.createElement("div");
    details.className = "card-details";
    details.id = `${id}-details`;
    const detailGrid = document.createElement("dl");
    detailGrid.className = "card-detail-grid";
    detailGrid.append(
       
        
    );

    const official = makeDetailItem("Official Links", "An official online link is not currently listed.");
    if (openUrl && openUrl !== "#") {
        const officialLink = document.createElement("a");
        officialLink.href = openUrl;
        officialLink.textContent = `Visit ${title}`;
        if (openTarget) {
            officialLink.target = openTarget;
            if (openTarget === "_blank") officialLink.rel = "noopener noreferrer";
        }
        official.querySelector("dd").replaceChildren(officialLink);
    }
    detailGrid.append(official);
    detailGrid.append(
        
        
    );
    details.append(detailGrid);
    card.append(controls, details);

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.target.closest("a, button")) {
            event.preventDefault();
            setCardExpanded(card, !card.classList.contains("is-expanded"));
        }
    });
}

function revealCards(cards) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cards.forEach((card) => card.classList.add("is-visible"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    cards.forEach((card) => {
        card.classList.add("card-reveal");
        observer.observe(card);
    });
}

function highlightRequestedCard(cards) {
    const params = new URLSearchParams(window.location.search);
    const requestedTitle = normalizeText(params.get("card"));
    const requestedCategory = normalizeText(params.get("category"));
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    const hash = normalizeText(hashId.replace(/-/g, " "));
    if (!requestedTitle && !hash) return;

    const title = requestedTitle || hash;
    const cardFromHash = hashId ? document.getElementById(hashId) : null;
    let candidates = cardFromHash?.classList.contains("service-card") ? [cardFromHash] : [];
    if (!candidates.length) candidates = cards.filter((card) => card.dataset.cardTitle === title);
    if (!candidates.length) candidates = cards.filter((card) => card.dataset.cardTitle.includes(title) || title.includes(card.dataset.cardTitle));
    if (!candidates.length) {
        const compactTitle = title.replace(/\s+/g, "");
        candidates = cards.filter((card) => {
            const compactCardTitle = card.dataset.cardTitle.replace(/\s+/g, "");
            return compactCardTitle === compactTitle || compactCardTitle.includes(compactTitle) || compactTitle.includes(compactCardTitle);
        });
    }
    const card = candidates.find((item) => requestedCategory && item.dataset.cardCategory === requestedCategory) || candidates[0];
    if (!card) return;

    setCardExpanded(card, true);
    card.classList.add("is-visible", "search-target");
    requestAnimationFrame(() => {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => card.focus({ preventScroll: true }), 450);
    });
    window.setTimeout(() => card.classList.remove("search-target"), SEARCH_HIGHLIGHT_MS);
}

/* Newspapers retain their original full-card links. Search highlighting is the
   only enhancement applied on newspapers.html. */
function initializeNewspaperSearchHighlight() {
    const cards = [...document.querySelectorAll("a.card")];
    if (!cards.length) return;

    const usedIds = new Set();
    cards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent.trim() || "Newspaper";
        const category = sectionName(card);
        const baseId = slugify(title);
        let id = baseId;
        let suffix = 2;
        while (usedIds.has(id) || document.getElementById(id)) id = `${baseId}-${suffix++}`;
        usedIds.add(id);
        card.id = id;
        card.dataset.cardTitle = normalizeText(title);
        card.dataset.cardCategory = normalizeText(category);
    });

    const params = new URLSearchParams(window.location.search);
    const requestedTitle = normalizeText(params.get("card"));
    const requestedCategory = normalizeText(params.get("category"));
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    const hashTitle = normalizeText(hashId.replace(/-/g, " "));
    const title = requestedTitle || hashTitle;
    if (!title && !hashId) return;

    const fromHash = hashId ? document.getElementById(hashId) : null;
    let matches = fromHash?.matches("a.card") ? [fromHash] : [];
    if (!matches.length) matches = cards.filter((card) => card.dataset.cardTitle === title);
    if (!matches.length) matches = cards.filter((card) => card.dataset.cardTitle.includes(title) || title.includes(card.dataset.cardTitle));
    if (!matches.length) {
        const compactTitle = title.replace(/\s+/g, "");
        matches = cards.filter((card) => {
            const compactCardTitle = card.dataset.cardTitle.replace(/\s+/g, "");
            return compactCardTitle === compactTitle || compactCardTitle.includes(compactTitle) || compactTitle.includes(compactCardTitle);
        });
    }

    const card = matches.find((item) => requestedCategory && item.dataset.cardCategory === requestedCategory) || matches[0];
    if (!card) return;

    card.classList.add("newspaper-search-target");
    requestAnimationFrame(() => {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => card.focus({ preventScroll: true }), 450);
    });
    window.setTimeout(() => card.classList.remove("newspaper-search-target"), SEARCH_HIGHLIGHT_MS);
}

function initializeCards() {
    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    // IMPORTANT: contact.html must remain completely unmodified.
    // Do not inject Open buttons, expand/collapse controls, card-actions/details, etc.
    if (page === "contact.html") return;

    // Latest-update tiles use the same reusable interaction model as service cards.
    document.querySelectorAll(".update-card").forEach((card) => card.classList.add("service-card"));

    const cards = [...document.querySelectorAll(".service-card")];

    // Emergency cards are customized (phone button + compact layout). Skip enhancement injection.
    cards
        .filter((card) => !card.classList.contains("emergency-card"))
        .forEach(enhanceCard);

    // Still reveal/highlight them visually.
    revealCards(cards);
    highlightRequestedCard(cards);
    initializeNewspaperSearchHighlight();

    // Ensure emergency cards don't get expanded/toggled by injected logic.
    // (We already skip enhanceCard for them.)
}


initializeSearch();
initializeCards();

const topBtn = document.createElement("button");
topBtn.id = "topBtn";
topBtn.type = "button";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i><span class="sr-only">Back to top</span>';
topBtn.hidden = true;
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => { topBtn.hidden = window.scrollY <= 300; }, { passive: true });
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const clock = document.createElement("div");
clock.id = "liveClock";
clock.setAttribute("aria-hidden", "true");
document.body.appendChild(clock);
function updateClock() { clock.textContent = new Date().toLocaleString(); }
setInterval(updateClock, 1000);
updateClock();
