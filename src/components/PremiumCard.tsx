import { useEffect, useRef, useState } from "react";
import "../styles/premium-card.css";

type Premium = {
  tag: string;
  title: string;
  meta: string;
  stat: string;
  details: string;
  features: string[];
  link?: string;
};

const card: Premium = {
  tag: "DevOps",
  title: "Orbit CI",
  meta: "Zero-downtime CI deployment.",
  stat: "14m setup • Slack alerts",
  details: "Docker • Canary • OIDC • Preview stacks.",
  features: ["Blue/Green", "Canary", "Preview Stacks", "OIDC", "Slack"],
  link: "#projects",
};

export default function PremiumCard() {
  const [flipped, setFlipped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // mouse-based tilt + aura coords
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const rx = ((my / rect.height) - 0.5) * -6; // tilt
      const ry = ((mx / rect.width) - 0.5) * 6;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
    };

    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="orbit-root one">
      <article
        ref={rootRef}
        className={`od-card is-hero ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label="Premium project card. Click to flip for details."
      >
        {/* drifting sparks */}
        <div className="od-sparks" aria-hidden>
          <span />
          <span />
          <span />
        </div>

        {/* FRONT */}
        <div className="od-face od-front">
          <div className="od-top">
            <span className="od-tag">{card.tag}</span>
            <a className="od-cta" href={card.link ?? "#"} onClick={(e)=>e.stopPropagation()}>
              View
            </a>
          </div>
          <h3 className="od-title">{card.title}</h3>
          <p className="od-meta">{card.meta}</p>
          <p className="od-stat">{card.stat}</p>

          <div className="od-feats">
            {card.features.slice(0, 4).map((f) => (
              <span key={f} className="od-chip">{f}</span>
            ))}
          </div>
        </div>

        {/* BACK */}
        <div className="od-face od-back">
          <span className="od-badge">Details</span>
          <p className="od-details">{card.details}</p>
          <div className="od-feats">
            {card.features.map((f) => (
              <span key={f} className="od-chip">{f}</span>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

