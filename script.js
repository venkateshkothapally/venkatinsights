/*
 * Shared portal behaviour
 * - Builds one accessible, expandable card component from the existing markup.
 * - Routes search results to an exact card and highlights it for 7 seconds.
 * - Keeps page-specific HTML small by deriving safe fallback details at runtime.
 */

const darkBtn = document.getElementById("darkModeBtn");
const searchInput = document.getElementById("searchInput");
const searchIndex = window.SITE_SEARCH_INDEX || [];
const SEARCH_HIGHLIGHT_MS = 7000;

function initLogoLink() {
    document.querySelectorAll(".navbar .logo").forEach((logo) => {
        if (logo.closest("a")) return;
        const link = document.createElement("a");
        link.href = "index.html";
        link.className = "logo-link logo";
        link.innerHTML = logo.innerHTML;
        link.setAttribute("aria-label", "Venkat Insights Home");
        logo.replaceWith(link);
    });
}

function initMobileNav() {
    const navbar = document.querySelector(".navbar");
    const nav = navbar?.querySelector("nav");
    if (!navbar || !nav || navbar.querySelector(".nav-toggle")) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Toggle navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';

    const logo = navbar.querySelector(".logo, .logo-link");
    logo?.after(toggle);

    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = open
            ? '<i class="fas fa-xmark" aria-hidden="true"></i>'
            : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        });
    });
}

function initEnhancedFooter() {
    document.querySelectorAll("footer").forEach((footer) => {
        if (footer.querySelector(".footer-grid")) return;

        const heading = footer.querySelector("h3")?.textContent || "Venkat Insights";
        const paragraphs = [...footer.querySelectorAll("p")];
        const copyright = paragraphs.find((p) => /copyright/i.test(p.textContent))?.textContent
            || "Copyright © 2026 Venkat Insights | Developed by Venkatesh Kothapally";

        footer.innerHTML = `
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>${heading}</h3>
                    <p>Your trusted portal for government services, education, jobs, news, and online tools.</p>
                </div>
                <div class="footer-col">
                    <h4>Portal</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="government.html">Government</a></li>
                        <li><a href="educational.html">Education</a></li>
                        <li><a href="jobs.html">Jobs</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>More</h4>
                    <ul>
                        <li><a href="newspapers.html">News Papers</a></li>
                        <li><a href="tools.html">Tools</a></li>
                        <li><a href="search.html">Search</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="about.html">About</a></li>
                        <li><a href="https://www.facebook.com/venkatinsights" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://www.instagram.com/venkatinsights/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://x.com/Venkatinsights" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom"><p>${copyright}</p></div>
        `;
    });
}

initLogoLink();
initMobileNav();
initEnhancedFooter();

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
    // Keep UI human-readable (card/category). Use hash + a separate highlight param to
    // reliably pick the exact match when multiple cards exist.
    const params = new URLSearchParams({
        card: item.title,
        highlight: item.title,
    });
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


    // Ensure this element exists before any reveal/animation logic runs.
    // (Avoids layout glitches on fast navigation like search.html?q=...)

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

    // Allow a separate query parameter (from search.html) to identify the exact match.
    // Example: ?card=Police&category=Emergency%20Services&highlight=Police
    const exactMatch = normalizeText(params.get("highlight"));

    // Keep highlight consistent with how the exact match was generated.
    // If exactMatch exists, prefer it over the normalized hash fragment.
    const highlightPrefer = exactMatch || title;


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
    const highlightNeedle = exactMatch || title;

    // If multiple matches exist, try to find the exact human-readable card title.
    const exactCandidate = candidates.find((item) => item.dataset.cardTitle === highlightNeedle);
    const card = (requestedCategory
        ? (exactCandidate && exactCandidate.dataset.cardCategory === requestedCategory ? exactCandidate : candidates.find((item) => item.dataset.cardCategory === requestedCategory && item.dataset.cardTitle === highlightNeedle))
        : exactCandidate) || candidates.find((item) => requestedCategory && item.dataset.cardCategory === requestedCategory) || candidates[0];

    if (!card) return;

    setCardExpanded(card, true);
    card.classList.add("is-visible", "search-target");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
        card.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
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
    // IMPORTANT: contact.html and about.html must remain clean profile pages.
    if (page === "contact.html" || page === "about.html") return;

    // Ensure we only enable the modal system on jobs.html (per your request).
    document.body.dataset.modalEnabled = page === "jobs.html" ? "true" : "false";


    // Latest-update tiles use the same reusable interaction model as service cards.
    document.querySelectorAll(".update-card").forEach((card) => card.classList.add("service-card"));


    const cards = [...document.querySelectorAll(".service-card")];

    // Include search result cards in page reveal animation.
    // (Prevents “cards not showing at top” perception when navigating to search.html.)
    const searchCards = [...document.querySelectorAll(".search-result-card")];


    // Emergency cards are customized (phone button + compact layout). Skip enhancement injection.
    cards
        .filter((card) => !card.classList.contains("emergency-card"))
        .forEach(enhanceCard);

    // Still reveal/highlight them visually.
    revealCards(cards.concat(searchCards));

    highlightRequestedCard(cards);
    initializeNewspaperSearchHighlight();

    // Ensure emergency cards don't get expanded/toggled by injected logic.
    // (We already skip enhanceCard for them.)
}


initializeSearch();
initializeCards();

// ================= CARD MODAL (jobs.html only) =================
(function initCardModal() {
    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page !== "jobs.html") return;

    const MODAL_BACKDROP_ID = "cardModalBackdrop";
    const MODAL_CONTAINER_ID = "cardModal";

    let backdrop = document.getElementById(MODAL_BACKDROP_ID);
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = MODAL_BACKDROP_ID;
        backdrop.className = "card-modal-backdrop";
        backdrop.setAttribute("role", "dialog");
        backdrop.setAttribute("aria-modal", "true");
        backdrop.setAttribute("aria-hidden", "true");

        backdrop.innerHTML = `
            <div class="card-modal" id="${MODAL_CONTAINER_ID}">
                <div class="card-modal-header">
                    <div class="card-modal-title">
                        <h2 id="cardModalTitle">Loading...</h2>
                        <div class="meta" id="cardModalMeta"></div>
                    </div>
                    <button type="button" class="card-modal-close" id="cardModalClose" aria-label="Close modal">✕</button>
                </div>
                <div class="card-modal-body">
                    <p class="card-modal-description" id="cardModalDescription"></p>

                    <div class="card-modal-actions" id="cardModalActions"></div>

                    <div class="card-modal-section">
                        <h3>How it works</h3>
                        <ul id="cardModalHow"></ul>
                    </div>

                    <div class="card-modal-section">
                        <h3>Application Form</h3>
                        <ul id="cardModalForm"></ul>
                    </div>

                    <div class="card-modal-section">
                        <h3>Eligibility</h3>
                        <ul id="cardModalEligibility"></ul>
                    </div>

                    <div class="card-modal-section">
                        <h3>Status</h3>
                        <ul id="cardModalStatus"></ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
    }

    const titleEl = document.getElementById("cardModalTitle");
    const metaEl = document.getElementById("cardModalMeta");
    const descEl = document.getElementById("cardModalDescription");
    const actionsEl = document.getElementById("cardModalActions");

    const howEl = document.getElementById("cardModalHow");
    const formEl = document.getElementById("cardModalForm");
    const eligEl = document.getElementById("cardModalEligibility");
    const statusEl = document.getElementById("cardModalStatus");

    const closeBtn = document.getElementById("cardModalClose");

    let lastScrollY = 0;
    let lastFocused = null;

    function setList(ul, items) {
        ul.replaceChildren();
        items.forEach((t) => {
            const li = document.createElement("li");
            li.textContent = t;
            ul.appendChild(li);
        });
    }

    function extractCardInfo(card) {
        const cardTitle = card.querySelector("h3")?.textContent?.trim() || "Service";
        const cardDescription = card.querySelector("p")?.textContent?.trim() || "";
        const category = sectionName(card);

        const openLink = card.querySelector('a[href]')
            ? [...card.querySelectorAll('a[href]')].find(a => normalizeText(a.textContent) === "open")
            : null;

        const fallbackOpenLink = openLink || [...card.querySelectorAll('a[href]')].find(a => !a.classList.contains("card-modal-open"));

        const url = fallbackOpenLink?.getAttribute("href") || "#";
        const text = openLink ? (openLink.textContent.trim() || "Open") : "Open";

        return { cardTitle, cardDescription, category, url, text };
    }

    function openModalForCard(card) {
        const info = extractCardInfo(card);

        lastScrollY = window.scrollY || 0;
        lastFocused = document.activeElement;

        titleEl.textContent = info.cardTitle;
        metaEl.textContent = info.category || "Jobs";
        descEl.textContent = info.cardDescription || `Explore official resources for ${info.cardTitle}.`;

        // Build actions
        actionsEl.replaceChildren();
        const primary = document.createElement("a");
        primary.className = "card-modal-primary";
        primary.href = info.url && info.url !== "#" ? info.url : "#";
        primary.target = "_blank";
        primary.rel = "noopener noreferrer";
        primary.textContent = info.text || "Open";

        actionsEl.appendChild(primary);

        const secondary = document.createElement("button");
        secondary.className = "card-modal-secondary";
        secondary.type = "button";
        secondary.textContent = "Close";
        secondary.addEventListener("click", closeModal);
        actionsEl.appendChild(secondary);

        // Static content ONLY on jobs.html (as requested)
        const t = info.cardTitle;
        setList(howEl, [
            `Open the official link for ${t}.`,
            "Read eligibility and requirements before applying.",
            "Fill the form using the official website instructions.",
            "Track updates using the status/notification section if available."
        ]);

        setList(formEl, [
            `Application form for ${t} is available on the official site.`,
            "If the form is not available yet, check for 'Apply Online' announcements."
        ]);

        setList(eligEl, [
            "Eligibility depends on the official notification (age limit, qualification, category).",
            "Refer to the official notification for exact cut-offs."
        ]);

        setList(statusEl, [
            "Status is updated through official releases on the notification portal.",
            "Use the official link provided above to check latest updates."
        ]);

        backdrop.classList.add("is-open");
        backdrop.setAttribute("aria-hidden", "false");
        closeBtn.focus({ preventScroll: true });

        // Prevent body scroll while modal open
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        backdrop.classList.remove("is-open");
        backdrop.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // restore scroll and focus
        window.scrollTo({ top: lastScrollY, behavior: "auto" });
        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus({ preventScroll: true });
        }
    }

    // Close on backdrop click
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal();
    });

    // Close button
    closeBtn?.addEventListener("click", closeModal);

    // ESC closes
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && backdrop.classList.contains("is-open")) closeModal();
    });

    // Make cards open modal on click (but do NOT steal the existing 'Open' link navigation)
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".service-card");
        if (!card) return;
        if (card.classList.contains("emergency-card")) return; // keep emergency tel: behavior

        // If user clicked the internal Open link, allow normal navigation
        const clickedOpenLink = e.target.closest("a[href]") && normalizeText(e.target.closest("a[href]").textContent) === "open";
        if (clickedOpenLink) return;

        // Prevent also when clicking already generated card controls (we keep existing behaviour)
        const isInsideCardDetails = !!e.target.closest(".card-details, .card-actions");
        if (isInsideCardDetails) {
            // Only toggle expansion on Enter handled in script.js; for click we avoid opening modal there.
            // (Stops modal from fighting with expandable cards.)
            return;
        }

        // Prevent navigation when the card or its overlay is clickable
        e.preventDefault?.();
        openModalForCard(card);
    });
})();


const topBtn = document.createElement("button");
topBtn.id = "topBtn";
topBtn.type = "button";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i><span class="sr-only">Back to top</span>';
topBtn.hidden = true;
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => { topBtn.hidden = window.scrollY <= 300; }, { passive: true });
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ================= HOME CLICK GLOW (5s) =================
(function initHomeClickGlow() {
  const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
  if (page !== "index.html") return;

  const CLICK_GLOW_MS = 5000;

  function triggerGlow(el) {
    if (!el) return;
    if (el.dataset.glowTimeoutId) {
      clearTimeout(Number(el.dataset.glowTimeoutId));
    }
    el.classList.add("home-glow-light");
    const t = window.setTimeout(() => {
      el.classList.remove("home-glow-light");
      delete el.dataset.glowTimeoutId;
    }, CLICK_GLOW_MS);
    el.dataset.glowTimeoutId = String(t);
  }

  // Delegated click + key activation
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-glow-5s='true'], [data-glow-5s=\"true\"]");
    if (!card) return;
    triggerGlow(card);
    const href = card.getAttribute("data-redirect");
    if (href && href !== "") {
      if (/^https?:\/\//i.test(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-glow-5s='true'], [data-glow-5s=\"true\"]");
    if (!card) return;
    e.preventDefault();
    triggerGlow(card);
    const href = card.getAttribute("data-redirect");
    if (href && href !== "") {
      if (/^https?:\/\//i.test(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  });
})();

const clock = document.createElement("div");

clock.id = "liveClock";
clock.setAttribute("aria-hidden", "true");
document.body.appendChild(clock);
function updateClock() { clock.textContent = new Date().toLocaleString(); }
setInterval(updateClock, 1000);
updateClock();
document.addEventListener("DOMContentLoaded", () => {
    
    // Select all interactive cards (Portal Cards & Social Cards)
    const interactiveCards = document.querySelectorAll('.portal-card, .social-card');

    // Accessibility: Allow keyboard users to trigger links using Spacebar 
    // (Enter works natively on <a> tags, but Spacebar sometimes scrolls the page).
    interactiveCards.forEach(card => {
        card.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault(); // Prevent page scroll
                card.click(); // Trigger the native link behavior
            }
        });
    });

    // NOTE: 
    // - No "Expand" logic is included.
    // - No "Collapse" logic is included.
    // - No "Open Buttons" or "Details Toggles" are included.
    // The entire card acts natively as a standard <a> tag.
});