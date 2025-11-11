import React, { useEffect } from "react";
import { cards } from "../data/orbitCards";
import "./orbit.css";

export default function OrbitDeck() {
  useEffect(() => {
    const wrap = document.getElementById("orbit-deck");
    if (!wrap) return;

    const handle = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 40;
      const y = (e.clientY - innerHeight / 2) / 40;
      wrap.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="orbit-deck-wrapper" id="orbit-deck">
      <div className="nebula-glow-field">
        <div className="nebula-blob purple"></div>
        <div className="nebula-blob cyan"></div>
      </div>

      <ul className="orbit-stack">
        {cards.map((c, i) => (
          <li
            key={i}
            className="orbit-card layer"
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="orbit-glow"></div>
            <span className="orbit-tag">{c.tag}</span>
            <h3 className="orbit-title">{c.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
