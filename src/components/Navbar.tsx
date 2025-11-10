import React, { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Problem Solving", href: "#problem-solving" },
  { label: "Contact", href: "#contact" },
];

// 4-mode theme now
type Theme = "dark" | "solar" | "lunar" | "blackhole";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [toggleFlash, setToggleFlash] = useState(false);
  const [justChangedTheme, setJustChangedTheme] = useState(false);
  const [active, setActive] = useState("#home");
  const [booted, setBooted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeStr, setTimeStr] = useState<string>("");

  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<Record<string, HTMLAnchorElement | null>>({});
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (y / total) * 100 : 0;
      setScrollProgress(pct);

      const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 110 && rect.bottom > 110) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("bhu-theme-4") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bhu-theme-4", theme);
    try {
      window.dispatchEvent(new CustomEvent("bhu-theme-change", { detail: { theme } }));
    } catch {}
  }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 220);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const target = linksRef.current[active];
    if (!indicator || !target) return;
    const rect = target.getBoundingClientRect();
    const parentRect = target.parentElement?.getBoundingClientRect();
    if (!parentRect) return;
    const left = rect.left - parentRect.left;
    const width = rect.width;
    indicator.style.setProperty("--bhu-indicator-left", `${left}px`);
    indicator.style.setProperty("--bhu-indicator-width", `${width}px`);
  }, [active, isMenuOpen]);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      bg.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // live IST time (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 5.5 * 60 * 60 * 1000);
      const hh = ist.getHours().toString().padStart(2, "0");
      const mm = ist.getMinutes().toString().padStart(2, "0");
      const ss = ist.getSeconds().toString().padStart(2, "0");
      setTimeStr(`${hh}:${mm}:${ss}`);
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleThemeCycle = () => {
    setTheme((prev) => {
      let next: Theme;
      if (prev === "dark") next = "solar";
      else if (prev === "solar") next = "lunar";
      else if (prev === "lunar") next = "blackhole";
      else next = "dark";

      // flash + orbit motion
      setToggleFlash(true);
      setJustChangedTheme(true);
      setTimeout(() => {
        setToggleFlash(false);
        setJustChangedTheme(false);
      }, 450);

      return next;
    });
  };

  const getContextText = () => {
    switch (active) {
      case "#projects":
        return "Latest Missions online";
      case "#experience":
        return "EazyByts · 2025";
      case "#problem-solving":
        return "Daily DSA · LeetCode/HackerRank";
      case "#skills":
        return "Stack: React · Vite · Spring";
      case "#about":
        return "B.Tech IT · India (+05:30)";
      default:
        return "Docked in India · IST";
    }
  };

  const getStatusText = () => {
    if (active === "#projects") return "Mission Control · Projects";
    if (active === "#experience") return "Docked at EazyByts";
    if (active === "#problem-solving") return "Daily Algorithms Online";
    if (active === "#skills") return "Systems Nominal · Skills";
    return "Docked in India · IST";
  };

  return (
    <header
      className={`bhu-nav bhu-nav--dark ${scrolled ? "bhu-nav--scrolled" : ""} ${
        isMenuOpen ? "bhu-nav--open" : ""
      } ${booted ? "bhu-nav--booted" : ""}`}
    >
      {/* scroll progress rail */}
      <div className="bhu-nav__progress" style={{ width: `${scrollProgress}%` }} />

      {/* bg */}
      <div className="bhu-nav__bg-wrap" ref={bgRef} aria-hidden>
        <div className="bhu-nav__bg-base" />
        <div className="bhu-nav__bg-glass" />
        <div className="bhu-nav__noise" />
        <div className="bhu-nav__space">
          <div className="bhu-nav__layer bhu-nav__layer--far" />
          <div className="bhu-nav__layer bhu-nav__layer--mid" />
          <div className="bhu-nav__layer bhu-nav__layer--near" />
          {/* nebula removed as requested */}
          <div className="bhu-nav__comet" />
          <div className="bhu-nav__chip bhu-nav__chip--1" />
          <div className="bhu-nav__chip bhu-nav__chip--2" />
        </div>
      </div>

      <div className="bhu-nav__inner">
        <div className="bhu-nav__edge bhu-nav__edge--top" aria-hidden />
        <div className="bhu-nav__edge bhu-nav__edge--bottom" aria-hidden />

        <div className="bhu-nav__left">
          <a
            href="#home"
            className={`bhu-nav__brand bhu-brand--${theme}`}
            aria-label="Go to hero"
          >
            <span className="bhu-nav__planet" aria-hidden />
            <span className={`bhu-nav__brand-text ${booted ? "is-ready" : ""}`}>
              <span key={theme} className="bhu-nav__brand-line bhu-text-burst">
                {theme === "solar" && "Bhuvanesh"}
                {theme === "lunar" && "Bhuvanesh"}
                {theme === "blackhole" && "Bhuvanesh"}
                {theme === "dark" && "Bhuvanesh"}
                <span className="bhu-nav__brand-underline" aria-hidden />
                <span className="bhu-nav__cursor" aria-hidden />
              </span>
              <span className="bhu-nav__tagline">
                {theme === "dark" && "Full Stack · AI · IT"}
                {theme === "solar" && "Designing luminous web experiences"}
                {theme === "lunar" && "Calm, stable, production-ready"}
                {theme === "blackhole" && "High-gravity dashboards & trading UIs"}
                <span className="bhu-nav__tagline-line" aria-hidden />
              </span>
            </span>
          </a>
        </div>

        <nav className="bhu-nav__center" aria-label="Primary navigation">
          <div ref={indicatorRef} className="bhu-nav__indicator" aria-hidden />
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              ref={(el) => (linksRef.current[link.href] = el)}
              className={`bhu-nav__link ${active === link.href ? "is-active" : ""}`}
            >
              <span className="bhu-nav__link-dot" aria-hidden />
              <span className="bhu-nav__link-glass" aria-hidden />
              <span>{link.label}</span>
              {link.label === "Experience" ? (
                <span className="bhu-nav__pill">EazyByts</span>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="bhu-nav__right">
          <div className="bhu-nav__context">
            <span className="bhu-nav__context-dot" aria-hidden />
            <span className="bhu-nav__context-text">{getContextText()}</span>
          </div>

          <div
            className={`bhu-nav__status bhu-status--${theme}`}
            aria-label="Current mission and time"
          >
            <span className="bhu-nav__status-dot" aria-hidden />
            <span className="bhu-nav__status-text">
              {getStatusText()} {timeStr ? `· ${timeStr}` : ""}
            </span>
            <span className="bhu-nav__status-health" aria-hidden />
          </div>

          {/* 🔄 4-mode space toggle */}
          <button
            type="button"
            onClick={handleThemeCycle}
            className={`bhu-nav__icon-btn bhu-nav__icon-btn--bubble bhu-mode--${theme} ${
              toggleFlash ? "bhu-toggle--flash" : ""
            } ${justChangedTheme ? "bhu-toggle--orbit" : ""}`}
            aria-label="Cycle theme"
            title={`Theme: ${theme}`}
          >
            <span className="bhu-toggle__inner">
              {theme === "dark" && <span className="bhu-toggle-icon">🌙</span>}
              {theme === "solar" && <span className="bhu-toggle-icon">☀️</span>}
              {theme === "lunar" && <span className="bhu-toggle-icon">🪐</span>}
              {theme === "blackhole" && (
                <span className="bhu-toggle-icon bhu-toggle-icon--blackhole" aria-hidden>
                  <span className="bhu-bh-core" />
                  <span className="bhu-bh-ring" />
                </span>
              )}
            </span>

            <span className="bhu-toggle-label">
              {theme === "dark" && "Dark Orbit"}
              {theme === "solar" && "Solar Flux"}
              {theme === "lunar" && "Lunar Ops"}
              {theme === "blackhole" && "Singularity"}
            </span>

            <span className="bhu-toggle-dots" aria-hidden>
              <span className={`dot ${theme === "dark" ? "is-on" : ""}`} />
              <span className={`dot ${theme === "solar" ? "is-on" : ""}`} />
              <span className={`dot ${theme === "lunar" ? "is-on" : ""}`} />
              <span className={`dot ${theme === "blackhole" ? "is-on" : ""}`} />
            </span>
          </button>

          <button
            type="button"
            className="bhu-nav__icon-btn bhu-nav__icon-btn--bubble bhu-nav__icon-btn--assistant"
            aria-label="Open AI assistant"
          >
            🤖
          </button>

          <a className="bhu-nav__cta" href="#projects">
            <span className="bhu-nav__cta-glow" aria-hidden />
            Enter My Universe
          </a>

          <button
            type="button"
            className={`bhu-nav__burger ${isMenuOpen ? "is-active" : ""}`}
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="bhu-nav__mobile">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`bhu-nav__mobile-link ${active === link.href ? "is-active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <div className="bhu-nav__mobile-footer">
          <button
            type="button"
            onClick={handleThemeCycle}
            className="bhu-nav__mobile-btn"
          >
            Theme: {theme}
          </button>
          <a
            className="bhu-nav__mobile-btn bhu-nav__mobile-btn--primary"
            href="#projects"
          >
            Enter My Universe 🚀
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
