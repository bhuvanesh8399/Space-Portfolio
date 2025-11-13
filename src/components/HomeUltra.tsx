import React, { useEffect, useRef, useState } from "react";
import "../styles/home-ultra.css";
import "../styles/overrides.css";
import { SmoothPremiumCard } from "./PremiumDeck";
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
  // Hero effects and premium deck interactions handled in child components
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
      const amp = 18; // calm parallax amplitude (px)
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

  // Optional: soft deck drift following cursor (desktop only)
  useEffect(() => {
    const hero = wrapRef.current;
    if (!hero) return;
    const stack = hero.querySelector('.orbit-stack') as HTMLElement | null;
    if (!stack) return;
    const prefersTouch = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
    if (prefersTouch) return; // disable on touch for smoothness
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * -6;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stack.style.transform = `translateY(${y}px) translateX(${x}px)`;
      });
    };
    hero.addEventListener('mousemove', onMove);
    return () => {
      hero.removeEventListener('mousemove', onMove);
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
    type Shooter = { x: number; y: number; life: number; vx: number; vy: number };
    let shooters: Shooter[] = [];
    let lastShooter = 0;
    type Comet = { x: number; y: number; vx: number; vy: number; life: number };
    let comets: Comet[] = [];
    let comet = { x: -0.2, y: 0.18, vx: 0.004, vy: -0.0008, life: 0 };

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = 420;
      stars = new Array(starCount).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 1.0 + 0.2,
        v: Math.random() * 0.05 + 0.01,
        a: Math.random() * 0.4 + 0.3,
        t: Math.random() * Math.PI * 2,
        w: 0.008 + Math.random() * 0.006,
      }));
      shooters = [];
      comets = [];
      comet = { x: -0.2, y: 0.18, vx: 0.004, vy: -0.0008, life: 0 };
    };

    const maybeSpawnShooter = (t: number, w: number, h: number) => {
      if (t - lastShooter < 3000 + Math.random() * 4000) return;
      lastShooter = t;
      shooters.push({
        x: Math.random() * w * 0.6 + w * 0.2,
        y: h * 0.15,
        life: 0,
        vx: -2 - Math.random() * 2,
        vy: 2 + Math.random() * 1.5,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const st of stars) {
        st.t += st.w;
        const twinkle = 0.7 + Math.sin(st.t) * 0.25;
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

      // rare comets (trailing line)
      if (Math.random() < 0.002) {
        const y = Math.random() * 0.4 * height + height * 0.1;
        comets.push({ x: -40, y, vx: 4, vy: -0.7, life: 1 });
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx; c.y += c.vy; c.life -= 0.004;
        const grad = ctx.createLinearGradient(c.x - 80, c.y + 14, c.x, c.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,0.8)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(c.x - 80, c.y + 14);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        if (c.x > width + 40 || c.life <= 0) comets.splice(i, 1);
      }

      // occasional shooting stars
      maybeSpawnShooter(performance.now(), width, height);
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.x += s.vx; s.y += s.vy; s.life += 1;
        ctx.globalAlpha = Math.max(0, 1 - s.life / 80);
        ctx.strokeStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--bhu-star")
          .trim() || "#b9e1ff";
        ctx.lineWidth = dpr * 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
        ctx.stroke();
        if (s.life > 80) shooters.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      // quick comet line (soft streak)
      const tsoft = performance.now() / 10000;
      const cx2 = (tsoft % 1) * width;
      const cy2 = (Math.sin(tsoft * 6) * 0.3 + 0.5) * height;
      const grad2 = ctx.createLinearGradient(cx2 - 120, cy2 - 40, cx2, cy2);
      grad2.addColorStop(0, "rgba(255,255,255,0)");
      grad2.addColorStop(1, "rgba(255,255,255,.35)");
      ctx.strokeStyle = grad2;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx2 - 120, cy2 - 40);
      ctx.lineTo(cx2, cy2);
      ctx.stroke();

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
          <p className="intro-cycler" aria-label="intro">
            <span className="intro-track">
              <b>Full-Stack Java</b>
              <b>React + TS</b>
              <b>Docker CI/CD</b>
              <b>Space UI Lover</b>
            </span>
          </p>
          <h1 className="title">I build <span className="title__accent">stellar</span>, production‑grade web apps.</h1>
          <p className="lede">Full-Stack Java · React · Spring Boot · Docker · SQL</p>

          <div className="cta">
            <button className="btn btn--primary" onClick={() => scrollToId("#projects")}>Enter My Universe</button>
            <button className="btn btn--ghost" onClick={() => scrollToId("#contact")}>Contact</button>
          </div>

          <ul className="chips" role="list">
            {WHAT_I_DO.map((t) => (
              <li key={t.title} className="chip" role="listitem">
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

        <div className="home-ultra__right" aria-hidden={false}>
          <SmoothPremiumCard />
        </div>

      </div>
    </section>
  );
}
