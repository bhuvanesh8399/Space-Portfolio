import React, { useEffect, useRef, useState } from "react";
import "../styles/home-ultra.css";

const WHAT_I_DO = [
  { title: "Full‑Stack Java", blurb: "Spring Boot · REST · JPA · Auth · CI/CD" },
  { title: "React & TypeScript", blurb: "Vite · TS · Forms · State" },
  { title: "Spring Boot APIs", blurb: "Secure APIs · Validation · Docs" },
  { title: "Docker & CI/CD", blurb: "Docker · Compose · Pipelines" },
  { title: "SQL · Postgres", blurb: "Schema · Migrations · Queries" },
  { title: "Cloud Basics (AWS)", blurb: "S3 · EC2 · Basics" },
];

// Spline removed

export default function HomeUltra() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const WORDS = ["intelligent", "scalable", "secure", "realtime"] as const;
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const xn = e.clientX / window.innerWidth - 0.5;
      const yn = e.clientY / window.innerHeight - 0.5;
      const amp = 14; // calm parallax amplitude (px)
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", (xn * amp).toFixed(2));
        el.style.setProperty("--py", (yn * amp).toFixed(2));
        // Spline removed; only update section parallax
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let dpr = 1;
    let stars: { x: number; y: number; s: number; v: number; a: number; t: number; w: number }[] = [];
    type Streak = { x: number; y: number; vx: number; vy: number; len: number; life: number };
    let streaks: Streak[] = [];
    let comet = { x: -0.2, y: 0.18, vx: 0.004, vy: -0.0008, life: 0 };

    const init = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = window.innerWidth > 980 ? 420 : 260;
      stars = new Array(starCount).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 1.0 + 0.2,
        v: Math.random() * 0.05 + 0.01,
        a: Math.random() * 0.4 + 0.3,
        t: Math.random() * Math.PI * 2,
        w: 0.008 + Math.random() * 0.006,
      }));
      streaks = [];
      comet = { x: -0.2, y: 0.18, vx: 0.004, vy: -0.0008, life: 0 };
    };

    const maybeSpawnStreak = () => {
      if (Math.random() < 0.008) {
        streaks.push({ x: Math.random() * width, y: -20, vx: -1.6, vy: 3.2, len: 60 + Math.random() * 50, life: 0 });
      }
    };

    const drawStreaks = () => {
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.vx; s.y += s.vy; s.life++;
        ctx.strokeStyle = 'rgba(180,200,255,0.35)';
        ctx.lineWidth = dpr * 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.35);
        ctx.stroke();
        if (s.y > height + 80) streaks.splice(i, 1);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const st of stars) {
        st.t += st.w;
        const twinkle = 0.72 + Math.sin(st.t) * 0.28;
        ctx.globalAlpha = twinkle * st.a;
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--bhu-star")
          .trim() || "#b9e1ff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
        if (!prefersReduce) st.x -= st.v;
        if (st.x < -2) st.x = width + 2;
      }
      ctx.globalAlpha = 1;

      // comet sweep
      comet.x += comet.vx;
      comet.y += comet.vy;
      comet.life += 1;
      const cx = comet.x * width;
      const cy = comet.y * height;
      const tail = ctx.createRadialGradient(cx, cy, 1, cx, cy, 140);
      tail.addColorStop(0, 'rgba(255,255,255,0.22)');
      tail.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy + 10, 140, 60, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'rgba(250,250,255,0.85)';
      ctx.arc(cx, cy, 2.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (cx > width + 120 || cy < -120) {
        comet = { x: -0.2, y: 0.3 + Math.random() * 0.2, vx: 0.0035 + Math.random() * 0.0015, vy: -0.0007 - Math.random() * 0.0006, life: 0 };
      }

      // rare streak meteors
      maybeSpawnStreak();
      drawStreaks();
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

  // Spline removed

  return (
    <section id="home" className="home-ultra" ref={wrapRef} aria-label="Hero">
      <div className="launch-overlay" aria-hidden>
        <div className="hud">
          <span className="led"></span> Initializing starfield… <span className="mono">OK</span><br/>
          Calibrating gyro… <span className="mono">OK</span>
        </div>
      </div>
      <canvas className="home-ultra__canvas" ref={canvasRef} aria-hidden></canvas>
      <div className="home-ultra__nebula" aria-hidden></div>
      <div className="home-ultra__rings" aria-hidden></div>

      <div className="home-ultra__inner">
        <div className="home-ultra__left">
          <p className="intro lede-top">Calm builds. Stellar results. Shipping fast without the drama.</p>
          <h1 className="title">I build <span className="title__accent nowrap" aria-live="polite">{WORDS[wi]},</span> production‑ready web apps.</h1>
          <p className="lede">B.Tech IT · React · Vite · TypeScript · Spring Boot · Docker · REST · CI/CD</p>

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
              <span className="v">Ship a sleek, space‑themed portfolio</span>
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

        {/* Right column with Spline removed */}
      </div>
    </section>
  );
}
