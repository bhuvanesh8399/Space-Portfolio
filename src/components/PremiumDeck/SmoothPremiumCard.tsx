import { useEffect, useRef } from "react";
import "./smooth-premium-card.css";
import { certificates } from "./data";

export default function SmoothPremiumCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !hasFinePointer) return;

    let frame = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;

      const maxTilt = 10;
      const tiltX = -dy * maxTilt;
      const tiltY = dx * maxTilt;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty("--tiltX", `${tiltX}deg`);
        card.style.setProperty("--tiltY", `${tiltY}deg`);
      });
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.setProperty("--tiltX", "0deg");
      card.style.setProperty("--tiltY", "0deg");
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const featured = certificates.slice(0, 3);

  return (
    <div className="spc-root">
      <div ref={cardRef} className="spc-card">
        <div className="spc-inner">
          <h2 className="spc-heading">PREMIUM</h2>

          <div className="spc-coins">
            <span className="spc-coin">✓</span>
            <span className="spc-coin">✓</span>
            <span className="spc-coin">✓</span>
          </div>

          <ul className="spc-list">
            {featured.map((c) => (
              <li key={c.id}>
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spc-cert-row"
                  title="View certificate on HackerRank"
                >
                  <span className="spc-cert-title">{c.title}</span>
                  <span
                    className={
                      "spc-cert-tag " +
                      (c.tag === "ROLE"
                        ? "spc-cert-tag-role"
                        : "spc-cert-tag-skill")
                    }
                  >
                    {c.tag}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
