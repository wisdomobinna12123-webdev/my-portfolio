/* =========================================================
   Wisdom Obinna — Portfolio behavior
   ========================================================= */

/* -----------------------------------------------------------
   EDIT YOUR PROJECTS HERE.
   Add, remove, or change entries in this array — the page
   rebuilds the Projects section from this list automatically.

   `image`  — optional path to a screenshot, e.g. "assets/projects/project-one.jpg"
              (recommended ~1200x750px / 16:10). Leave as "" to show a plain
              placeholder instead — the layout stays identical either way.
   `live` and `github` are optional too: leave either as "" to hide that link.
----------------------------------------------------------- */
const projects = [
  {
    title: "Savour",
    description: "A short, clear description of what this project does and the problem it solves for its users.",
    image: "savour.jpg",
    tags: ["HTML", "CSS", "JAVASCRIPT"],
    live: "https://restsavour.vercel.app",
    github: "https://github.com/wisdomobinna12123-webdev"
  },
  {
    title: "Project Two",
    description: "A short, clear description of what this project does and the problem it solves for its users.",
    image: "assets/projects/project-two.jpg",
    tags: ["JavaScript", "Express", "REST API"],
    live: "",
    github: "https://github.com/wisdomobinna12123-webdev"
  },
  {
    title: "Project Three",
    description: "A short, clear description of what this project does and the problem it solves for its users.",
    image: "assets/projects/project-three.jpg",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "",
    github: "https://github.com/wisdomobinna12123-webdev"
  }
];

/* Shown automatically whenever a project's image is missing or fails to load. */
const PROJECT_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23EAF1F6'/%3E%3Cpath d='M0 200l90-70 70 50 90-90 150 110v0H0z' fill='%23D7E3EA'/%3E%3Ccircle cx='320' cy='60' r='22' fill='%23D7E3EA'/%3E%3C/svg%3E";

/* ---------- Render projects ---------- */
/* ---------- Render projects ---------- */
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects.map((p) => {
    const tags = p.tags.map((t) => `<li>${escapeHTML(t)}</li>`).join("");
    const links = [];
    if (p.live) links.push(`<a href="${escapeAttr(p.live)}" target="_blank" rel="noopener noreferrer">Live site</a>`);
    if (p.github) links.push(`<a href="${escapeAttr(p.github)}" target="_blank" rel="noopener noreferrer">Code</a>`);

    const imgSrc = p.image ? escapeAttr(p.image) : PROJECT_IMAGE_FALLBACK;

    return `
      <article class="project-card reveal">
        <div class="project-media">
          <img src="${imgSrc}" alt="Screenshot of ${escapeAttr(p.title)}" loading="lazy">
        </div>
        <div class="project-card-body">
          <h3>${escapeHTML(p.title)}</h3>
          <p class="project-desc">${escapeHTML(p.description)}</p>
          <ul class="project-tags">${tags}</ul>
          <div class="project-links">${links.join("")}</div>
        </div>
      </article>
    `;
  }).join("");

  // Attach the fallback with a real event listener — no inline JS to escape.
  grid.querySelectorAll(".project-media img").forEach((img) => {
    img.addEventListener("error", function onError() {
      img.removeEventListener("error", onError);
      img.src = PROJECT_IMAGE_FALLBACK;
    });
  });
}
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

/* ---------- Theme toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const applyLabel = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };
  applyLabel();

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    applyLabel();
  });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* ---------- Footer year ---------- */
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  // Stagger items that reveal together (same grid / list) without delaying later sections.
  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((group) => {
    group.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i, 5) * 80}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Active nav link while scrolling ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".main-nav a");
  if (!sections.length || !links.length) return;

  const linkFor = (id) => document.querySelector(`.main-nav a[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initThemeToggle();
  initMobileMenu();
  setYear();
  initScrollReveal();
  initScrollSpy();
});
