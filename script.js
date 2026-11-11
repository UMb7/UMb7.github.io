/* Portfolio interactions: theme, mobile navigation, active section, footer year. */
(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = [...document.querySelectorAll(".nav-link")];
  const year = document.getElementById("current-year");

  if (!navLinks || !menuButton || !themeButton) {
    return;
  }

  // Restore a previously selected theme; otherwise use the system preference.
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  root.dataset.theme = initialTheme;
  updateThemeButton(initialTheme);

  function updateThemeButton(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeButton.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeButton.setAttribute("title", `Switch to ${nextTheme} mode`);
  }

  themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    updateThemeButton(nextTheme);
  });

  function closeMenu() {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("open", !isOpen);
  });

  navItems.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) closeMenu();
  });

  // Update the highlighted navigation item as the visitor scrolls.
  const sections = ["home", "about", "courses", "projects", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const current = entry.target.id;
          navItems.forEach(link => {
            const active = link.getAttribute("href") === `#${current}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
