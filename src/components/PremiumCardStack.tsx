import React, { useRef, useState } from "react";
import "./premium-card-stack.css";

type Card = {
  tag: string;
  title: string;
  stat: string;
  tech: string;
  blurb: string;
};

const CARDS: Card[] = [
  { tag:"Backend",  title:"Spring Boot APIs", stat:"15+ endpoints", tech:"Java · Spring · JPA", blurb:"Secure REST services, pagination, caching, and auth baked in." },
  { tag:"Frontend", title:"React Dashboards",  stat:"Lighthouse 95+", tech:"React · Vite · TS", blurb:"Atomic components, charts, and buttery interactions." },
  { tag:"Infra",    title:"Dockerized Apps",   stat:"Multi-stage",   tech:"Docker · CI/CD", blurb:"Lean images, healthchecks, and zero-downtime deploy." },
  { tag:"DB",       title:"SQL Modeling",      stat:"ACID first",    tech:"Postgres · JOOQ", blurb:"Migrations, indexing, and query performance." },
  { tag:"AI/UX",    title:"Smart UI",          stat:"UX micro-AI",   tech:"Forms · Haptics", blurb:"Assistive inputs and predictive UI for speed." },
];

export default function PremiumCardStack() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % CARDS.length);
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  };

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    el.style.setProperty("--rx", `${y}deg`);
    el.style.setProperty("--ry", `${x}deg`);
  };
  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const c = CARDS[index];

  return (
    <section className="premium-showcase">
      <header className="ps-head">
        <h2>Featured Work</h2>
        <div className="ps-ctas">
          <button className="ps-btn" onClick={prev} aria-label="Previous">‹</button>
          <span className="ps-dot">{index + 1} / {CARDS.length}</span>
          <button className="ps-btn" onClick={next} aria-label="Next">›</button>
        </div>
      </header>

      {/* Layered stack container */}
      <div
        className={`ps-stack ${flipped ? "is-flipped" : ""}`}
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        aria-label="Premium card"
        tabIndex={0}
      >
        {/* Front face */}
        <article className="ps-card card-front">
          <span className="badge">{c.tag}</span>
          <h3 className="ps-title">{c.title}</h3>
          <p className="ps-tech">{c.tech}</p>
          <div className="ps-meta">
            <strong>{c.stat}</strong>
          </div>
        </article>

        {/* Back face */}
        <article className="ps-card card-back">
          <span className="badge badge--glow">Highlight</span>
          <h4>{c.stat}</h4>
          <p className="ps-blurb">{c.blurb}</p>
          <button
            className="mini-btn"
            onClick={(e) => { e.stopPropagation(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            See Projects
          </button>
        </article>
      </div>
      <p className="ps-hint">Click to flip • move mouse to tilt • auto “breathing” float</p>
    </section>
  );
}

