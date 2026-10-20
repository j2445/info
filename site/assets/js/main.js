// Portfolio interactions. Plain ES modules, no dependencies.
import { initHeatmap } from "./heatmap.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* --------------------------------------------------------------- Intro --- */
// Only play the opening sequence once per session.
try {
  if (sessionStorage.getItem("sd-intro")) document.documentElement.classList.add("no-intro");
  sessionStorage.setItem("sd-intro", "1");
} catch { /* storage blocked — intro just plays */ }

const introDelay = document.documentElement.classList.contains("no-intro") || reduceMotion.matches ? 0 : 900;
setTimeout(() => {
  $("[data-hero]")?.classList.add("is-ready");
}, introDelay);

/* ---------------------------------------------------------- Navigation --- */
function initNav() {
  const nav = $("[data-nav]");
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-menu]");
  if (!nav || !toggle || !menu) return;

  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    // hide on scroll down, reveal on scroll up — never while the menu is open
    nav.classList.toggle("is-hidden", y > 480 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  const label = $(".visually-hidden", toggle);
  const focusables = () => $$("a, button", menu).concat(toggle);

  const open = () => {
    menu.hidden = false;
    // next frame so the clip-path transition runs
    requestAnimationFrame(() => menu.classList.add("is-open"));
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    label.textContent = "Close menu";
    document.body.style.overflow = "hidden";
    $("a", menu)?.focus();
  };
  const close = (returnFocus = true) => {
    menu.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    label.textContent = "Open menu";
    document.body.style.overflow = "";
    const done = () => { if (!menu.classList.contains("is-open")) menu.hidden = true; };
    reduceMotion.matches ? done() : setTimeout(done, 700);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => (menu.classList.contains("is-open") ? close() : open()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(false); });
  document.addEventListener("keydown", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (e.key === "Tab") {
      // keep focus inside the open menu (toggle + menu items)
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
    if (e.matches && menu.classList.contains("is-open")) close(false);
  });

  // Active section highlighting
  const links = $$("[data-navlink]");
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  // Every section is observed so that sections without a nav link
  // (hero, activity) clear the highlight instead of leaving a stale one.
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      byId.get(entry.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -54% 0px" });
  $$("main > section").forEach((s) => spy.observe(s));
}

/* -------------------------------------------------------------- Reveals --- */
function initReveals() {
  const targets = $$("[data-reveal], .contact__title, .signature, .case, .principle");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    $(".contact")?.classList.add("is-ready");
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      // the contact headline uses the same line-mask reveal as the hero
      if (entry.target.classList.contains("contact__title")) entry.target.parentElement.classList.add("is-ready");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  targets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------- Scroll fallbacks --- */
function initScrollFallbacks() {
  const needsProgress = !CSS.supports("animation-timeline: scroll()");
  const bar = $(".scroll-progress");
  const timeline = $("[data-timeline]");
  if (!needsProgress) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar?.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      timeline.style.setProperty("--tl", p.toFixed(3));
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}

/* ------------------------------------------------------ Pointer effects --- */
function initPointer() {
  if (!finePointer.matches || reduceMotion.matches) return;

  // Hero light follows the pointer
  const hero = $("[data-hero]");
  if (hero) {
    let raf = 0;
    hero.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        hero.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  // Magnetic buttons: small pull toward the cursor, released on leave
  $$("[data-magnetic]").forEach((el) => {
    const strength = 0.22;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--mag-x", `${x * strength}px`);
      el.style.setProperty("--mag-y", `${y * strength}px`);
      el.style.setProperty("--bx", `${((e.clientX - r.left) / r.width) * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    });
  });

  // 3D tilt on the portrait and project visuals
  $$("[data-tilt]").forEach((el) => {
    const target = el.classList.contains("portrait") ? $(".portrait__frame", el) : el;
    const max = el.classList.contains("portrait") ? 6 : 7;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
      target.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
      target.style.setProperty("--sx", `${px * 100}%`);
      target.style.setProperty("--sy", `${py * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      target.style.setProperty("--rx", "0deg");
      target.style.setProperty("--ry", "0deg");
    });
  });

  // Skill panels: light follows pointer
  $$(".panel").forEach((panel) => {
    panel.addEventListener("pointermove", (e) => {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--px", `${e.clientX - r.left}px`);
      panel.style.setProperty("--py", `${e.clientY - r.top}px`);
    });
  });
}

/* ------------------------------------------------------- Case studies --- */
function initCaseStudies() {
  $$(".case__toggle").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    const label = btn.lastChild;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      label.textContent = open ? " Close case study" : " Case study";
    });
  });
}

/* --------------------------------------------------------- Skill notes --- */
function initSkills() {
  $$(".panel").forEach((panel) => {
    const note = $(".panel__note", panel);
    if (!note) return;
    const fallback = note.textContent;
    let pinned = null;
    const show = (btn) => { note.textContent = btn.dataset.note; note.classList.add("is-context"); };
    const reset = () => {
      if (pinned) return show(pinned);
      note.textContent = fallback;
      note.classList.remove("is-context");
    };
    $$("button.skill", panel).forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("mouseenter", () => show(btn));
      btn.addEventListener("focus", () => show(btn));
      btn.addEventListener("mouseleave", reset);
      btn.addEventListener("blur", reset);
      // tap / Enter pins the note (useful on touch screens)
      btn.addEventListener("click", () => {
        const same = pinned === btn;
        $$("button.skill", panel).forEach((b) => b.setAttribute("aria-pressed", "false"));
        pinned = same ? null : btn;
        btn.setAttribute("aria-pressed", String(!same));
        same ? reset() : show(btn);
      });
    });
  });
}

/* ---------------------------------------------------------- Copy email --- */
function initCopy() {
  const btn = $("[data-copy]");
  if (!btn) return;
  const label = $("[data-copy-label]", btn);
  const icon = $("[data-copy-icon] use", btn);
  const status = $("[data-copy-status]");
  let timer;
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Fallback for browsers without async clipboard access
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
    }
    label.textContent = ok ? "Copied" : "Press ⌘/Ctrl+C";
    icon?.setAttribute("href", ok ? "#i-check" : "#i-copy");
    status.textContent = ok ? "Email address copied to clipboard" : "Copy failed — the address is " + text;
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = "Copy email";
      icon?.setAttribute("href", "#i-copy");
    }, 2200);
  });
}

/* ------------------------------------------------------------- Ticker --- */
function initTicker() {
  const track = $(".ticker__track");
  if (!track || reduceMotion.matches) return;
  // duplicate items once so the -50% marquee loops seamlessly
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.append(clone);
  });
}

/* --------------------------------------------------------------- Boot --- */
initNav();
initReveals();
initScrollFallbacks();
initPointer();
initCaseStudies();
initSkills();
initCopy();
initTicker();
initHeatmap($("[data-heatmap]"));

$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
