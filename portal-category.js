(() => {
  const CSS = {
    wrapper: 'portal-cat-wrapper',
    bar: 'portal-cat-bar',
    scroll: 'portal-cat-scroll',
    btn: 'portal-cat-btn',
    active: 'is-active',
    fade: 'portal-cat-fade',
    fadeVisible: 'is-visible',
    ripple: 'portal-cat-ripple',
    loading: 'portal-cat-loading',
    loadingReady: 'is-ready',
    filterInput: 'portal-cat-filter',
  };

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9\u00c0-\uFFFF]+/g, ' ')
      .trim();
  }

  function getPageCategories() {
    // Each page should declare window.PORTAL_CATEGORIES = [{label, targetId, icon?, badge?}...]
    // and window.PORTAL_PAGE = { title: '...' }
    if (!Array.isArray(window.PORTAL_CATEGORIES)) return [];
    return window.PORTAL_CATEGORIES;
  }

  function getTargets() {
    return getPageCategories()
      .map((c) => ({
        ...c,
        targetId: c.targetId || c.id || ''
      }))
      .filter((c) => c.label && c.targetId);
  }

  function ensureDOM() {
    const categories = getTargets();
    if (!categories.length) return null;

    // If page already has wrapper (allow rerender), return it.
    let wrapper = document.querySelector('.portal-cat-wrapper');
    if (wrapper) return wrapper;

    // Create wrapper below main navbar
    wrapper = document.createElement('div');
    wrapper.className = CSS.wrapper;
    wrapper.setAttribute('data-portal-category', 'true');

    const bar = document.createElement('div');
    bar.className = CSS.bar;
    bar.innerHTML = `
      <div class="${CSS.fade} left" aria-hidden="true"></div>
      <div class="portal-cat-search" role="search">
        <input class="${CSS.filterInput}" type="search" placeholder="Search categories..." aria-label="Search categories" />
      </div>
      <div class="portal-cat-chevron" aria-hidden="true" title="Categories">
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="${CSS.scroll}" role="list" aria-label="Service categories"></div>
      <div class="${CSS.fade} right" aria-hidden="true"></div>
    `;

    wrapper.appendChild(bar);

    // Insert right after navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.parentNode) {
      navbar.parentNode.insertBefore(wrapper, navbar.nextSibling);
    } else {
      document.body.insertBefore(wrapper, document.body.firstChild);
    }

    return wrapper;
  }

  function createCategoryButtons({ listEl, categories, activeTargetId, renderStart = 0, renderCount = 60 }) {
    const frag = document.createDocumentFragment();
    const slice = categories.slice(renderStart, renderStart + renderCount);

    const fragBtns = [];
    slice.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${CSS.btn} ${CSS.loading}`;
      btn.role = 'listitem';
      btn.setAttribute('data-target-id', c.targetId);
      btn.setAttribute('aria-label', c.badge ? `${c.label} (${c.badge})` : c.label);
      btn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:10px;">
          ${c.icon ? `<i class="${c.icon}" aria-hidden="true"></i>` : ''}
          <span>${c.label}</span>
        </span>
        ${c.badge ? `<span style="margin-left:10px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.16);padding:3px 10px;border-radius:999px;font-size:11px;font-weight:900;">${c.badge}</span>` : ''}
      `;
      if (c.targetId === activeTargetId) btn.classList.add(CSS.active);
      fragBtns.push(btn);
      frag.appendChild(btn);
    });

    listEl.appendChild(frag);
    // Mark loading -> ready
    requestAnimationFrame(() => {
      fragBtns.forEach((b) => b.classList.add(CSS.loadingReady));
      // Remove loading class after transition
      fragBtns.forEach((b) => setTimeout(() => b.classList.remove(CSS.loading), 450));
    });

    return slice.length;
  }

  function updateFade(listEl) {
    const leftFade = listEl.parentElement.querySelector('.portal-cat-fade.left');
    const rightFade = listEl.parentElement.querySelector('.portal-cat-fade.right');
    if (!leftFade || !rightFade) return;

    const canScrollLeft = listEl.scrollLeft > 2;
    const maxScroll = listEl.scrollWidth - listEl.clientWidth;
    const canScrollRight = listEl.scrollLeft < maxScroll - 2;

    leftFade.classList.toggle(CSS.fadeVisible, canScrollLeft);
    rightFade.classList.toggle(CSS.fadeVisible, canScrollRight);
  }

  function smoothScrollToTarget(scrollEl, btn) {
    const parentLeft = scrollEl.getBoundingClientRect().left;
    const btnLeft = btn.getBoundingClientRect().left;
    const offset = btnLeft - parentLeft;
    scrollEl.scrollTo({ left: scrollEl.scrollLeft + offset - 6, behavior: 'smooth' });
  }

  function initInteractions({ wrapper }) {
    const categoriesAll = getTargets();
    if (!categoriesAll.length) return;

    const scrollEl = wrapper.querySelector('.portal-cat-scroll');
    const filterEl = wrapper.querySelector('.portal-cat-filter');

    if (!scrollEl) return;

    // Determine active by hash
    const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const activeTargetId = hash || categoriesAll[0].targetId;

    let filtered = categoriesAll;
    let renderIndex = 0;
    const RENDER_BATCH = 80;

    // Lazy initial render
    createCategoryButtons({
      listEl: scrollEl,
      categories: filtered,
      activeTargetId,
      renderStart: 0,
      renderCount: RENDER_BATCH,
    });
    renderIndex = Math.min(filtered.length, RENDER_BATCH);

    updateFade(scrollEl);

    // Buttons event: click + ripple + active highlight + scroll to section
    const onClick = (e) => {
      const btn = e.target.closest('.portal-cat-btn');
      if (!btn) return;

      const targetId = btn.getAttribute('data-target-id');

      // Active
      scrollEl.querySelectorAll('.portal-cat-btn.is-active').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Ripple
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = CSS.ripple;
      const size = Math.max(rect.width, rect.height) * 0.8;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Snap align
      smoothScrollToTarget(scrollEl, btn);

      // Jump to section with focus for accessibility
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => target.focus({ preventScroll: true }), 350);
        window.location.hash = targetId;
      }
    };

    scrollEl.addEventListener('click', onClick);

    // Update fade on scroll
    scrollEl.addEventListener('scroll', () => {
      updateFade(scrollEl);

      // Lazy render more if user is approaching end and we have more
      const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      const nearEnd = scrollEl.scrollLeft > maxScroll - 220;
      if (nearEnd && renderIndex < filtered.length) {
        const added = createCategoryButtons({
          listEl: scrollEl,
          categories: filtered,
          activeTargetId,
          renderStart: renderIndex,
          renderCount: RENDER_BATCH,
        });
        renderIndex = clamp(renderIndex + added, 0, filtered.length);
      }
    }, { passive: true });

    // Mouse wheel horizontal support
    scrollEl.addEventListener('wheel', (e) => {
      // If horizontal wheel intent or shift key, scroll horizontally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        // native horizontal already works
        return;
      }
      // Convert vertical wheel to horizontal
      const delta = e.deltaY;
      scrollEl.scrollLeft += delta;
    }, { passive: true });

    // Drag-to-scroll
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    scrollEl.addEventListener('pointerdown', (e) => {
      isDown = true;
      scrollEl.setPointerCapture(e.pointerId);
      startX = e.clientX;
      scrollLeft = scrollEl.scrollLeft;
    });

    scrollEl.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      scrollEl.scrollLeft = scrollLeft - dx;
    });

    scrollEl.addEventListener('pointerup', () => { isDown = false; });
    scrollEl.addEventListener('pointercancel', () => { isDown = false; });

    // Keyboard navigation: ArrowLeft/ArrowRight within bar
    wrapper.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const active = document.activeElement;
      if (!active || !active.classList.contains(CSS.btn)) return;

      const buttons = [...wrapper.querySelectorAll('.portal-cat-btn')];
      const idx = buttons.indexOf(active);
      if (idx < 0) return;

      const next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      const targetBtn = buttons[next] || buttons[0] || null;
      if (!targetBtn) return;

      e.preventDefault();
      targetBtn.focus({ preventScroll: true });
      smoothScrollToTarget(scrollEl, targetBtn);

      // Enter activates
      if (e.key === 'Enter') targetBtn.click();
    });

    // Filter categories
    if (filterEl) {
      filterEl.addEventListener('input', () => {
        const q = normalize(filterEl.value);
        filtered = categoriesAll.filter((c) => {
          const text = normalize([c.label, c.targetId, c.badge].join(' '));
          return !q || text.includes(q);
        });

        // Clear and rerender
        scrollEl.replaceChildren();
        renderIndex = 0;
        // If current active not present in filtered, move activeTargetId to the first match.
        const nextActive = filtered.find((c) => c.targetId === activeTargetId) || filtered[0];
        const nextActiveId = nextActive?.targetId || (filtered[0] && filtered[0].targetId) || activeTargetId;

        createCategoryButtons({
          listEl: scrollEl,
          categories: filtered,
          activeTargetId: nextActiveId,
          renderStart: 0,
          renderCount: RENDER_BATCH,
        });
        renderIndex = Math.min(filtered.length, RENDER_BATCH);
        updateFade(scrollEl);

        if (nextActiveId && nextActiveId !== activeTargetId) {
          window.location.hash = nextActiveId;
        }
      });
    }

  }


  // Tiny helper for CSS.escape attr isn’t needed; use direct id matching in selector without escaping by limiting to IDs without quotes.
  // So we’ll avoid fancy selection.

  function main() {
    const wrapper = ensureDOM();
    if (!wrapper) return;
    initInteractions({ wrapper });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();

