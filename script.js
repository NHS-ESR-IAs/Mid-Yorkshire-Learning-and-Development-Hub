// Toggle page visibility and re-render Mermaid diagrams with larger font size
function showPage(pageId) {
  // Hide all pages
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));

  // Show the requested page
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add("active");

    // Re-initialize Mermaid with custom font size
    if (window.mermaid) {
      mermaid.initialize({
        theme: "default",
        themeVariables: {
          fontSize: "22px", // Try "20px" or "22px" for extra clarity
          fontFamily: "Segoe UI, sans-serif",
        },
      });

      // Render Mermaid diagrams inside the active page
      mermaid.init(undefined, activePage.querySelectorAll(".mermaid"));
    }
  }
}

// Search input: filters pages + cards
function searchPages(query) {
  query = query.toLowerCase();
  const pages = document.querySelectorAll(".page");
  const homePage = document.getElementById("home");

  function showAllCards() {
    document.querySelectorAll(".text-start").forEach((card) => {
      card.style.display = "block";
    });
  }

  function filterCards(q) {
    document.querySelectorAll(".page.active .text-start").forEach((card) => {
      const match = card.innerText.toLowerCase().includes(q);
      card.style.display = match ? "block" : "none";
    });
  }

  if (query === "") {
    showPage("home");
    pages.forEach((page) => {
      if (page.id !== "home") page.classList.remove("active");
    });
    showAllCards();
  } else {
    homePage.classList.remove("active");
    pages.forEach((page) => {
      const match = page.innerText.toLowerCase().includes(query);
      page.classList.toggle("active", match);
    });
    filterCards(query);
  }
}

// Open a popup window with provided URL
function openPopup(url) {
  window.open(url, "popupWindow", "width=auto,height=auto,scrollbars=yes");
}

// ===== THEME SWITCHER =====
function applyMermaidTheme() {
  const styles = getComputedStyle(document.body);

  const accent = styles.getPropertyValue("--accent-color").trim();
  const text = styles.getPropertyValue("--text-color").trim();
  const isDark =
    document.body.classList.contains("dark-mode") ||
    document.body.classList.contains("theme-contrast");

  const line = isDark ? "#ffffff" : accent;

  if (window.mermaid) {
    mermaid.initialize({
      theme: "default",
      themeVariables: {
        primaryColor: accent,
        primaryTextColor: text,
        lineColor: line,
        fontSize: "18px",
        fontFamily: "Segoe UI, sans-serif",
      },
    });
  }
}

const themeSelectors = document.querySelectorAll(".theme-selector");

themeSelectors.forEach((selector) => {
  selector.addEventListener("change", function () {
    const selectedTheme = this.value;

    // Remove existing theme-* classes
    document.body.className = document.body.className
      .split(" ")
      .filter((cls) => !cls.startsWith("theme-"))
      .join(" ")
      .trim();

    // Apply new theme
    document.body.classList.add("theme-" + selectedTheme);

    // Preserve dark mode
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
    }

    // Save theme
    localStorage.setItem("theme", selectedTheme);
  });
});

// ===== DARK MODE TOGGLE =====
const toggleButtons = document.querySelectorAll(".toggle-dark");
const body = document.body;

function updateDarkMode() {
  const isDark = body.classList.toggle("dark-mode");
  toggleButtons.forEach((btn) => {
    btn.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
  });
}

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", updateDarkMode);
});

// ===== TEXT SIZE SWITCHER =====
function setTextSize(sizeClass) {
  document.body.classList.remove(
    "scale-small",
    "scale-medium",
    "scale-large",
    "scale-xlarge"
  );
  document.body.classList.add(sizeClass);
  localStorage.setItem("text-size", sizeClass);
}

// ===== RESTORE SETTINGS ON LOAD =====
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const darkMode = localStorage.getItem("darkMode") === "true";

  // Apply saved theme or default to NHS Blue
  const themeToApply = savedTheme || "blue";
  document.body.classList.add("theme-" + themeToApply);

  // Sync both selectors
  document.querySelectorAll(".theme-selector").forEach((el) => {
    el.value = themeToApply;
  });

  // Store default theme if none was saved
  if (!savedTheme) {
    localStorage.setItem("theme", "blue");
  }

  // Apply dark mode if enabled
  if (darkMode) {
    document.body.classList.add("dark-mode");
  }
});

// ===== TOGLLE SECTION VISIBILITY ====//
function toggleSection(id) {
  var section = document.getElementById(id);
  section.style.display = section.style.display === "none" ? "block" : "none";
}

document.querySelectorAll(".toggle-submenu").forEach((button) => {
  button.addEventListener("click", () => {
    const submenu = button.nextElementSibling;
    const isOpen = submenu.classList.contains("open");

    // Toggle submenu
    submenu.classList.toggle("open");

    // Update arrow
    button.textContent = button.textContent.replace(
      isOpen ? "▴" : "▾",
      isOpen ? "▾" : "▴"
    );
  });
});

// ===== Instant Collapse on Scroll Start =====

const banner = document.querySelector(".banner-wrapper");
const toolbar = document.getElementById("desktop-nav-toolbar");
const header = document.querySelector(".nhs-header");

let isCollapsed = false;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Buffer zone: collapse if scrollY > 30, expand only if scrollY < 10
  if (scrollY > 1 && !isCollapsed) {
    banner?.classList.add("shrink");
    header?.classList.add("shrink");
    toolbar?.classList.add("hide-on-scroll");
    isCollapsed = true;
  } else if (scrollY < 1 && isCollapsed) {
    banner?.classList.remove("shrink");
    header?.classList.remove("shrink");
    toolbar?.classList.remove("hide-on-scroll");
    isCollapsed = false;
  }
});

// ==== One Nav Menu ====

const navHTML = document.getElementById("shared-nav").innerHTML;
// Wrap in a <ul> for horizontal layout
document.getElementById(
  "main-nav"
).innerHTML = `<ul class="nav nav-horizontal">${navHTML}</ul>`;

document.getElementById("sidebar-nav").innerHTML = navHTML;

// ===== Copy Snippet to Clipboard =====

function copyVisibleSnippet() {
  // Find the currently visible page
  const visiblePage = Array.from(document.querySelectorAll(".page")).find(
    (page) => page.offsetParent !== null
  );

  if (!visiblePage) return;

  // Within that page, find the snippet
  const snippet = visiblePage.querySelector(".snippet");
  if (snippet) {
    navigator.clipboard.writeText(snippet.innerText).then(() => {
      // Optional: nicer feedback than alert()
      const btn = visiblePage.querySelector("button");
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  }
}
