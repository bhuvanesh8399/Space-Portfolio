import React, { lazy, Suspense, useEffect, useRef } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));
import "../styles/Home.css";

const Home: React.FC = () => {
  // Ultra hero enhancements
  const wrapRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle mouse parallax (GPU friendly)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6; // -3..3
      const y = (e.clientY / window.innerHeight - 0.5) * 6; // -3..3
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(2));
        el.style.setProperty("--py", y.toFixed(2));
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Optional: gently ping glow when navbar cycles theme
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = () => {
      el.classList.remove("is-theme-ping");
      void el.offsetWidth; // reflow
      el.classList.add("is-theme-ping");
      setTimeout(() => el.classList.remove("is-theme-ping"), 900);
    };
    window.addEventListener("bhu-theme-change" as any, handler as any);
    return () => window.removeEventListener("bhu-theme-change" as any, handler as any);
  }, []);

  // Lightweight star canvas backdrop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let stars: { x: number; y: number; s: number; v: number; a: number }[] = [];

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
        s: Math.random() * 1.2 + 0.2,
        v: Math.random() * 0.2 + 0.02,
        a: Math.random() * 0.5 + 0.3,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const st of stars) {
        ctx.globalAlpha = st.a;
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="home-ultra" ref={wrapRef} aria-label="Hero">
      {/* Background layers */}
      <canvas className="home-ultra__canvas" ref={canvasRef} aria-hidden></canvas>
      <div className="home-ultra__nebula" aria-hidden></div>
      <div className="home-ultra__rings" aria-hidden></div>

      {/* Foreground content */}
      <div className="home-ultra__inner">
        <div className="home-ultra__left">
          <div className="pill">Bhuvanesh · Full‑Stack & AI</div>

          <h1 className="title">
            I build <span className="title__accent">intelligent</span>, modern web apps.
          </h1>

          <p className="lede">B.Tech IT · React · Vite · TypeScript · Spring Boot</p>

          <div className="cta">
            <button className="btn btn--primary" onClick={() => scrollTo("projects")}>
              Enter My Universe
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo("contact")}>
              Contact
            </button>
          </div>

          <div className="chips" aria-hidden>
            <span className="chip"><span className="dot" /> Java · Spring Boot</span>
            <span className="chip"><span className="dot" /> React · Vite · TS</span>
            <span className="chip"><span className="dot" /> AI · Systems</span>
          </div>

          <ul className="meta" role="list">
            <li className="card">
              <span className="k">Current Mission</span>
              <span className="v">Stock Trading Simulator v2</span>
            </li>
            <li className="card">
              <span className="k">Status</span>
              <span className="v">Available for Internships</span>
            </li>
            <li className="card">
              <span className="k">Location</span>
              <span className="v">India · IST (+05:30)</span>
            </li>
          </ul>
        </div>

        <div className="home-ultra__right" aria-hidden>
          <div className="spline">
            <Suspense fallback={<div className="skeleton" /> }>
              <Spline scene="https://prod.spline.design/HHrEorsxJ793wPXn/scene.splinecode" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

