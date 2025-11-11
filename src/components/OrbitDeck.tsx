import { useEffect, useMemo, useRef, useState } from "react";
import "./orbit-deck.css";

type DeckCard = {
  tag: string;
  title: string;
  meta: string;
  stat: string;
  back?: string;
};

const CARDS: DeckCard[] = [
  { tag: "React + TS", title: "Cosmic UI Kit", meta: "Production-grade components with dark space vibes.", stat: "12k installs • 98% Lighthouse" },
  { tag: "Spring Boot APIs", title: "API Nebula", meta: "Scalable backend APIs with CI/CD.", stat: "p95 68ms • 99.99% uptime" },
  { tag: "Full-Stack", title: "Galaxy Commerce", meta: "SSR storefront + payments.", stat: "+27% CR • Web Vitals Good" },
  { tag: "DevOps", title: "Orbit CI", meta: "Zero-downtime CI deployment.", stat: "14m setup • Slack alerts" },
];

export default function OrbitDeck() {
  const [hero, setHero] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // cycle every 3.5s
  useEffect(() => {
    const id = setInterval(() => setHero((h) => (h + 1) % CARDS.length), 3500);
    return () => clearInterval(id);
  }, []);

  // exactly two visible cards
  const visible = useMemo(() => [CARDS[hero]], [hero]);

  // pointer tilt
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x}`);
      el.style.setProperty("--my", `${y}`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="orbit-root" aria-label="Premium card showcase" ref={rootRef}>
      <div className="od-stage">
        {visible.map((c, i) => (
          <article key={i} className={`od-card ${i === 0 ? "is-hero" : "is-trailer"}`} style={{ "--depth": i } as React.CSSProperties}>
            {/* soft moving glow field */}
            <div className="od-glow" aria-hidden="true" />
            <div className="od-top">
              <span className="od-chip">{c.tag}</span>
              <button className="od-cta" aria-label={`View ${c.title}`}>View</button>
            </div>

            <h3 className="od-title">{c.title}</h3>
            <p className="od-meta">{c.meta}</p>
            <p className="od-stat">{c.stat}</p>

            {/* decorative planet */}
            <div className="od-planet" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
