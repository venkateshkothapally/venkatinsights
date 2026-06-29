/**
 * ==========================================================================
 * Popup Information System Central Data Registry & Core Architecture
 * ==========================================================================
 */

const popupData = {
  "image-resizer": {
    title: "Image Resizer",
    icon: "🖼️",
    category: "Image Tools",
    shortDesc: "Resize images efficiently without loss of canvas fidelity.",
    description: "A secure framework utility intended for resizing images down to targeted proportions or specific dimension criteria, handling format encoding instantly inside the browser context.",
    features: ["Lossless compression scaling", "Precise width and height setting", "Asynchronous background rendering", "No analytical logs stored"],
    steps: ["Upload target imagery from directory layout.", "Define scaling restrictions inside resolution parameters.", "Click calculate transform button.", "Save optimized final copy down locally."],
    eligibility: "Unrestricted open utility available safely across all public platform devices.",
    documents: ["Source image artifact (PNG, JPG, WebP)"],
    links: { tool: "image resizer.html", apply: "#", status: "#", website: "https://venkatinsights.example.com", faq: "#" },
    important: "Processing massive multi-megapixel files might leverage device execution threads for brief rendering periods.",
    notes: "Local memory calculations mean raw visual data never travels across modern external internet pipes.",
    related: ["image-converter", "jpg-to-png", "png-to-jpg"]
  },
  "merge-pdf": {
    title: "Merge PDF",
    icon: "📑",
    category: "PDF Tools",
    shortDesc: "Combine multiple document files into one compiled artifact.",
    description: "An isolated toolkit built to append distinct portable document files together chronologically, preserving structural layouts and embedded hyperlinks seamlessly.",
    features: ["Drag and drop ordering", "Preserves vector font paths", "High-speed document assembly", "Zero configuration defaults"],
    steps: ["Select or drag your source files into the tool context.", "Reorder files to reflect the intended sequence.", "Initiate execution processing.", "Download the unified consolidated file."],
    eligibility: "Public access framework tool.",
    documents: ["Two or more document format files (.pdf)"],
    links: { tool: "#", apply: "#", status: "#", website: "https://venkatinsights.example.com", faq: "#" },
    important: "Encrypted or password-protected inputs require access clearance definitions before running compilation stages.",
    notes: "Total consolidated sizing ceilings conform strictly to client-side allocation allotments.",
    related: ["split-pdf", "compress-pdf", "pdf-to-word"]
  },
  "age-calculator": {
    title: "Age Calculator",
    icon: "📅",
    category: "Calculators",
    shortDesc: "Accurately compute total chronological age spans down to days.",
    description: "A verification processing block that displays exact year, month, and day increments separating specified point dates.",
    features: ["Leap year consideration logic", "Real-time date comparisons", "Clean accessibility interfaces"],
    steps: ["Input your precise target origin birth date.", "Set alternate execution target date matrix endpoints.", "Trigger calculation calculations."],
    eligibility: "General open utility access parameters.",
    documents: ["Valid primary verification reference (e.g., [Omitted Identity Document Card Reference], Metric sheet)"],
    links: { tool: "#", apply: "#", status: "#", website: "https://venkatinsights.example.com", faq: "#" },
    important: "System defaults match global timeline calculations automatically unless override variables are passed manually.",
    notes: "Useful for checking official enrollment or service registration deadlines.",
    related: ["percentage-calculator", "bmi-calculator"]
  }
};

// Application Registry State Tracker
let activeToolKey = null;
let structuredFocusElement = null;

document.addEventListener("DOMContentLoaded", () => {
  initToolInteractives();
  initModalListeners();
});

/**
 * Attaches Tooltips and Initialization Click Triggers
 */
function initToolInteractives() {
  const cards = document.querySelectorAll("[data-tool]");
  
  cards.forEach(card => {
    const toolKey = card.getAttribute("data-tool");
    const data = popupData[toolKey] || {
      title: card.querySelector("h3")?.innerText || "Utility Tool",
      shortDesc: "Click to explore settings and usage definitions.",
      category: "General Utilities"
    };

    // Inject Floating Informational Tooltip Block
    const tooltip = document.createElement("div");
    tooltip.className = "tool-tooltip";
    tooltip.innerHTML = `
      <div class="tooltip-title">${data.title}</div>
      <div>${data.shortDesc}</div>
      <div class="tooltip-action">Click to view details →</div>
    `;
    card.appendChild(tooltip);

    // Click Redirection Logic Override
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openToolModal(toolKey, card);
    });
  });
}

/**
 * Binds Functional Modal Management Events
 */
function initModalListeners() {
  const overlay = document.getElementById("toolModalOverlay");
  const closeBtn = document.getElementById("modalCloseBtn");
  const closeFooter = document.getElementById("btnCloseFooter");

  closeBtn.addEventListener("click", closeToolModal);
  closeFooter.addEventListener("click", closeToolModal);
  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeToolModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeToolModal();
    }
    if (e.key === "Tab" && overlay.classList.contains("active")) {
      handleModalFocusTrap(e);
    }
  });

  // Action Button Operational Events
  document.getElementById("btnOpenTool").addEventListener("click", () => {
    if (activeToolKey && popupData[activeToolKey]?.links?.tool) {
      window.location.href = popupData[activeToolKey].links.tool;
    }
  });

  document.getElementById("btnCopyLink").addEventListener("click", () => {
    const dummyUrl = `${window.location.origin}${window.location.pathname}?tool=${activeToolKey}`;
    navigator.clipboard.writeText(dummyUrl).then(() => alert("Tool quick-link copied to clipboard!"));
  });

  document.getElementById("btnShareTool").addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({ title: popupData[activeToolKey]?.title, url: window.location.href });
    } else {
      alert("Sharing API not supported on this framework interface browser.");
    }
  });

  document.getElementById("btnPrintTool").addEventListener("click", () => window.print());
  document.getElementById("btnBookmarkTool").addEventListener("click", () => alert("Press Ctrl+D (or Cmd+D) to bookmark this tools portfolio."));
}

/**
 * Populates and Presents the Glassmorphism Modal Overlay System
 */
function openToolModal(toolKey, triggeringElement) {
  const data = popupData[toolKey];
  if (!data) return;

  activeToolKey = toolKey;
  structuredFocusElement = triggeringElement;

  // Header Elements Setup
  document.getElementById("modalIcon").innerText = data.icon || "🔧";
  document.getElementById("modalCategory").innerText = data.category || "Utility";
  document.getElementById("modalTitle").innerText = data.title;
  document.getElementById("modalShortDesc").innerText = data.shortDesc;
  document.getElementById("modalFullDesc").innerText = data.description;

  // Features Element Setup
  const featuresBox = document.getElementById("modalFeatures");
  featuresBox.innerHTML = "";
  (data.features || ["Fully Secure Framework Execution", "Optimized Core Architecture Layout"]).forEach(feat => {
    featuresBox.innerHTML += `<div class="feature-check-card"><i class="fas fa-check-circle"></i><span>${feat}</span></div>`;
  });

  // Flow Step Setup
  const stepsBox = document.getElementById("modalSteps");
  stepsBox.innerHTML = "";
  (data.steps || ["Open specified toolkit link.", "Provide initialization setup parameters.", "Compile transformation pipeline results."]).forEach(step => {
    stepsBox.innerHTML += `<li>${step}</li>`;
  });

  // Conditional Sections UI Rendering Logic
  toggleSectionVisibility("eligibilitySection", "modalEligibility", data.eligibility);
  toggleSectionVisibility("importantSection", "modalImportant", data.important);
  toggleSectionVisibility("notesSection", "modalNotes", data.notes);

  // Chips Array Population for Documents Section
  const docsSection = document.getElementById("documentsSection");
  if (data.documents && data.documents.length > 0) {
    docsSection.style.display = "block";
    const docsFlex = document.getElementById("modalDocuments");
    docsFlex.innerHTML = "";
    data.documents.forEach(doc => {
      docsFlex.innerHTML += `<span class="document-chip">${doc}</span>`;
    });
  } else {
    docsSection.style.display = "none";
  }

  // Anchor Target Population
  const linksBox = document.getElementById("modalLinks");
  linksBox.innerHTML = "";
  if (data.links) {
    Object.entries(data.links).forEach(([label, destination]) => {
      if (destination && destination !== "#") {
        const readableLabel = label.replace(/^\w/, c => c.toUpperCase()) + " Link Reference";
        linksBox.innerHTML += `<a href="${destination}" target="_blank" rel="noopener noreferrer" class="action-link-btn">${readableLabel} <i class="fas fa-external-link-alt" style="font-size:0.75rem;"></i></a>`;
      }
    });
  }

  // Related Category Setup
  const relatedSection = document.getElementById("relatedSection");
  if (data.related && data.related.length > 0) {
    relatedSection.style.display = "block";
    const relatedFlex = document.getElementById("modalRelated");
    relatedFlex.innerHTML = "";
    data.related.forEach(relKey => {
      const targetData = popupData[relKey];
      if (targetData) {
        const tag = document.createElement("span");
        tag.className = "related-tag";
        tag.innerText = targetData.title;
        tag.addEventListener("click", () => {
          closeToolModal();
          setTimeout(() => { openToolModal(relKey, structuredFocusElement); }, 310);
        });
        relatedFlex.appendChild(tag);
      }
    });
  } else {
    relatedSection.style.display = "none";
  }

  // Engage State Adjustments
  const overlay = document.getElementById("toolModalOverlay");
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  // Snap Focus Sequence for Device Accessibility
  setTimeout(() => {
    document.getElementById("modalCloseBtn").focus();
  }, 50);
}

/**
 * Dynamic View Toggle Helper
 */
function toggleSectionVisibility(sectionId, elementId, contentSource) {
  const targetSection = document.getElementById(sectionId);
  if (contentSource) {
    targetSection.style.display = "block";
    document.getElementById(elementId).innerText = contentSource;
  } else {
    targetSection.style.display = "none";
  }
}

/**
 * Handles Closing Animations and Restores UI State
 */
function closeToolModal() {
  const overlay = document.getElementById("toolModalOverlay");
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  activeToolKey = null;
  if (structuredFocusElement) {
    structuredFocusElement.focus();
  }
}

/**
 * Captures and Confines Tab Traversal to the Active Dialog Box
 */
function handleModalFocusTrap(event) {
  const container = document.getElementById("modalContainer");
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const elements = container.querySelectorAll(focusableSelectors);
  const firstEl = elements[0];
  const lastEl = elements[elements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstEl) {
      lastEl.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastEl) {
      firstEl.focus();
      event.preventDefault();
    }
  }
}