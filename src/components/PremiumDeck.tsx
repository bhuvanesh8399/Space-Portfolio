import React, { useMemo, useState } from "react";
import "../styles/premium-deck.css";

type Card = {
  id: number;
  tag: string;
  title: string;
  stat: string;
  tech: string;
};

const CARDS: Card[] = [
  { id: 0, tag: "Backend",  title: "Spring Boot APIs",  stat: "15+ endpoints", tech: "Java · Spring · JPA" },
  { id: 1, tag: "Frontend", title: "React Dashboards",  stat: "Lighthouse 95+", tech: "React · Vite · TS" },
  { id: 2, tag: "Infra",    title: "Dockerized Apps",   stat: "Multi-stage",    tech: "Docker · CI/CD" },
  { id: 3, tag: "DB",       title: "SQL Modeling",      stat: "ACID first",     tech: "Postgres · JOOQ" },
  { id: 4, tag: "AI/UX",    title: "Smart UI",          stat: "UX micro-AI",    tech: "Forms · Haptics" },
];

export default function PremiumDeck() {
  const [active, setActive] = useState<number | null>(null);
  const stack = useMemo(() => CARDS, []);

  const handleMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * 10}deg`);
    el.style.setProperty("--rx", `${py * -10}deg`);
  };

  const resetMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--rx", `0deg`);
  };

  return (
    <section className="deck-wrap">
      <header className="deck-head">
        <p className="kicker">Portfolio</p>
        <h2 className="head">
          Premium <span className="ink">Card Showcase</span>
        </h2>
        <p className="lede">Layer-by-layer focus. Click a card → it floats to the top. Hover → soft tilt. Mobile → clean vertical flow.</p>
      </header>

      <ul className={`deck ${active !== null ? "has-active" : ""}`}>
        {stack.map((c, i) => {
          const isActive = active === i;
          const layer = active === null ? i : i === active ? 0 : Math.abs(i - active);
          const scale = active === null ? 0.98 : isActive ? 1.02 : 0.96;
          return (
            <li
              key={c.id}
              className={`card ${isActive ? "is-active" : ""}`}
              style={{
                "--i": layer,
                transform: `translateY(${layer * 12}px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(${scale})`,
                zIndex: isActive ? 50 : 50 - layer,
              } as React.CSSProperties}
              onMouseMove={handleMove}
              onMouseLeave={resetMove}
              onClick={() => setActive((p) => (p === i ? null : i))}
              role="button"
              aria-pressed={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive((p) => (p === i ? null : i));
                }
              }}
            >
              <div className="card-face">
                <span className="badge">{c.tag}</span>
                <h3 className="title">{c.title}</h3>
                <p className="tech">{c.tech}</p>
              </div>
              <div className="card-meta">
                <span className="highlight">{c.stat}</span>
                <button
                  className="mini-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  See projects
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
