import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/premium-orbit-deck.css";

type Card = {
  id: number;
  tag: string;
  title: string;
  stat: string;
  tech: string;
};

const CARDS: Card[] = [
  { id: 0, tag: "Highlight", title: "15+ endpoints", stat: "Backend", tech: "Spring Boot · JPA" },
  { id: 1, tag: "Frontend", title: "React Dashboards", stat: "Lighthouse 95+", tech: "React · Vite · TS" },
  { id: 2, tag: "Infra", title: "Dockerized Apps", stat: "Multi-stage build", tech: "Docker · CI/CD" },
  { id: 3, tag: "DB", title: "SQL Modeling", stat: "ACID-first", tech: "Postgres · jOOQ" },
  { id: 4, tag: "AI/UX", title: "Smart UI", stat: "Micro-AI UX", tech: "Forms · Haptics" },
];

export default function PremiumOrbitDeck() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="deck-wrap">
      <div className="deck">
        <AnimatePresence>
          {CARDS.map((c, i) => (
            <motion.button
              key={c.id}
              className={`card ${active === i ? "is-flipped" : ""}`}
              style={{
                transform: `translateZ(${(CARDS.length - i) * 6}px)`,
                zIndex: 100 - i,
              }}
              onClick={() => setActive((p) => (p === i ? null : i))}
              onMouseMove={(e) => {
                const t = e.currentTarget as HTMLButtonElement;
                const r = t.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
                const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
                t.style.setProperty("--rx", `${y}deg`);
                t.style.setProperty("--ry", `${x}deg`);
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget as HTMLButtonElement;
                t.style.setProperty("--rx", `0deg`);
                t.style.setProperty("--ry", `0deg`);
              }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
                delay: i * 0.1,
              }}
            >
              <div className="face front">
                <span className="badge">{c.tag}</span>
                <h3>{c.title}</h3>
                <p className="muted">{c.tech}</p>
              </div>

              <div className="face back">
                <span className="badge badge--glow">Highlight</span>
                <h4>{c.stat}</h4>
                <span className="cta">See projects →</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

