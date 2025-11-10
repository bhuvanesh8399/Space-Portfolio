import React, { useEffect, useRef, lazy, Suspense, useState } from "react";
import "../styles/home-ultra.css";

const WHAT_I_DO = [
  { title: "Fullâ€‘Stack Java", blurb: "Spring Boot Â· REST Â· JPA Â· Auth Â· CI/CD" },
  { title: "React & TypeScript", blurb: "Vite Â· TS Â· Forms Â· State" },
  { title: "Spring Boot APIs", blurb: "Secure APIs Â· Validation Â· Docs" },
  { title: "Docker & CI/CD", blurb: "Docker Â· Compose Â· Pipelines" },
  { title: "SQL Â· Postgres", blurb: "Schema Â· Migrations Â· Queries" },
  { title: "Cloud Basics (AWS)", blurb: "S3 Â· EC2 Â· Basics" },
];

const SPLINE_SCENE = "https://prod.spline.design/HHrEorsxJ793wPXn/scene.splinecode";
const Spline = lazy(() => import("@splinetool/react-spline"));

export default function HomeUltra() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const splineRef = useRef<HTMLDivElement | null>(null);

  // Animated headline word loop
  const WORDS = ["intelligent", "scalable", "secure", "realtime"] as const;
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Subtle mouse parallax for nebula
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4; // toned down
      const y = (e.clientY / window.innerHeight - 0.5) * 4; // toned down
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(2));
        el.style.setProperty("--py", y.toFixed(2));
        const s = splineRef.current;
        if (s) {
          s.style.setProperty("--sx", ‑${(x) * 1.5}deg‑); // subtle tilt
          s.style.setProperty("--sy", ‑${(-y) * 1.5}deg‑);
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Theme ping on navbar theme change
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onTheme = () => {
      el.classList.remove("is-theme-ping");
      void el.offsetWidth;
      el.classList.add("is-theme-ping");
      setTimeout(() => el.classList.remove("is-theme-ping"), 900);
    };
    window.addEventListener("bhu-theme-change" as any, onTheme as any);
    return () => window.removeEventListener("bhu-theme-change" as any, onTheme as any);
  }, []);

  // Lightweight star canvas background (respects reduced motion)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
  let stars: { x: number; y: number; s: number; v: number; a: number; t: number; w: number }[] = [];

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / 8000);
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 1.0 + 0.2,
        v: Math.random() * 0.05 + 0.01,
        a: Math.random() * 0.4 + 0.3,
        t: Math.random() * Math.PI * 2,
        w: 0.008 + Math.random() * 0.006,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const st of stars) {
        st.t += st.w;
        const twinkle = 0.75 + Math.sin(st.t) * 0.25;
        ctx.globalAlpha = twinkle * st.a;
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--bhu-star")
          .trim() || "#b9e1ff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
        if (!prefersReduce) st.x -= st.v; // slow drift
        if (st.x < -2) st.x = width + 2;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      init();
      draw();
    };

    init();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToId = (id: string) => {
    const node = document.querySelector(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Lazy-mount Spline when visible
  const [mountSpline, setMountSpline] = useState(false);
  useEffect(() => {
    const el = splineRef.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setMountSpline(true); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="home" className="home-ultra" ref={wrapRef} aria-label="Hero">
      {/* Background layers */}
      <div className="launch-overlay" aria-hidden>
        <div className="hud">
          <span className="led"></span> Initializing starfield…€¦ <span className="mono">OK</span><br/>
          Calibrating gyro…€¦ <span className="mono">OK</span>
        </div>
      </div>
      <canvas className="home-ultra__canvas" ref={canvasRef} aria-hidden></canvas>
      <div className="home-ultra__nebula" aria-hidden></div>
      <div className="home-ultra__rings" aria-hidden></div>

      {/* Foreground content */}
      <div className="home-ultra__inner">
        <div className="home-ultra__left">
          <div className="pill">Bhuvanesh Â· Fullâ€‘Stack Java & React</div>

          <p className="intro">Calm builds. Stellar results. Shipping fast without the drama.</p>
          <h1 className="title">I build <span className="title__accent" aria-live="polite">{WORDS[wi]}</span>, productionâ€‘ready web apps.</h1>

          <p className="lede">B.Tech IT Â· React Â· Vite Â· TypeScript Â· Spring Boot Â· Docker Â· REST Â· CI/CD</p>

          <div className="cta">
            <button className="btn btn--primary" onClick={() => scrollToId("#projects")}>Enter My Universe</button>
            <button className="btn btn--ghost" onClick={() => scrollToId("#contact")}>Contact</button>
          </div>

          <ul className="chips">
            {WHAT_I_DO.map((t) => (
              <li key={t.title} className="chip">
                <span className="dot" /> {t.title}
              </li>
            ))}
          </ul>

          <ul className="meta" role="list">
            <li className="card">
              <span className="k">Current Mission</span>
              <span className="v">Ship a sleek, spaceâ€‘themed portfolio</span>
            </li>
            <li className="card">
              <span className="k">Status</span>
              <span className="v">Open to internships / roles</span>
            </li>
            <li className="card">
              <span className="k">Location</span>
              <span className="v">Tamil Nadu, India</span>
            </li>
          </ul>
        </div>

        <div className="home-ultra__right" aria-hidden>
          {/* Spline viewer with overlays (non-destructive cover for branding) */}
          <div className="spline" ref={splineRef}>
            {/* Scene fill layer */}
            {mountSpline ? (
              <div className="spline__scene" aria-hidden>
                <Suspense fallback={<div className="skeleton" /> }>
                  <Spline scene={SPLINE_SCENE} aria-hidden />
                </Suspense>
              </div>
            ) : (
              <div className="skeleton" />
            )}

            {/* Overlay helpers (theme-aware) */}
            <div className="corner-mask" aria-hidden />
            <div className="corner-chip" aria-hidden>
              <span className="dot" /> AI Â· Java Â· React
            </div>
            <div className="corner-sticker" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
