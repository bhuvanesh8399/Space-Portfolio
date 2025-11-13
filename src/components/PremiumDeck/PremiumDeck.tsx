import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import JSConfetti from "js-confetti";
import "./premium-deck.css";
import { certificates, roleCard, skillBadges } from "./data";

export default function PremiumDeck() {
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const frontInnerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    setMounted(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      jsConfettiRef.current = new JSConfetti();
      jsConfettiRef.current.addConfetti({
        emojis: ["✨", "🚀", "🪐"],
        confettiNumber: 60,
      });
      setTimeout(() => badgeRef.current?.classList.add("badge-drop-in"), 150);
    } else {
      badgeRef.current?.classList.add("badge-no-anim");
    }
  }, []);

  useEffect(() => {
    const cardInner = frontInnerRef.current;
    if (!cardInner) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReduced || !finePointer) return;

    const handleMove = (event: MouseEvent) => {
      const rect = cardInner.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = (x / rect.width - 0.5) * 2;
      const dy = (y / rect.height - 0.5) * 2;
      const maxTilt = 14;
      const rotateY = dx * maxTilt;
      const rotateX = -dy * maxTilt;
      cardInner.style.setProperty("--tiltX", `${rotateX}deg`);
      cardInner.style.setProperty("--tiltY", `${rotateY}deg`);
    };

    const handleLeave = () => {
      cardInner.style.setProperty("--tiltX", "0deg");
      cardInner.style.setProperty("--tiltY", "0deg");
    };

    cardInner.addEventListener("mousemove", handleMove);
    cardInner.addEventListener("mouseleave", handleLeave);
    return () => {
      cardInner.removeEventListener("mousemove", handleMove);
      cardInner.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const toggleFlip = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsFlipped((prev) => !prev);
    if (!prefersReduced && jsConfettiRef.current) {
      jsConfettiRef.current.addConfetti({
        emojis: ["✨", "⭐"],
        confettiNumber: 40,
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  };

  const handleHoverBurst = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced && jsConfettiRef.current) {
      jsConfettiRef.current.addConfetti({
        confettiColors: ["#a855f7", "#22d3ee", "#facc15", "#f97316"],
        confettiNumber: 25,
      });
    }
  };

  return (
    <div
      className={`premium-stack ${mounted ? "mounted" : ""} ${isFlipped ? "stack-flipped" : ""}`}
      onMouseEnter={handleHoverBurst}
    >
      <div className="premium-card premium-card-c" aria-hidden>
        <h3 className="sub-title">Verified Skills</h3>
        <div className="badge-grid">
          {skillBadges.map((badge) => (
            <div key={badge.title} className="mini-badge">
              <img src={badge.img} alt={`${badge.title} badge`} />
              <span>{badge.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-card premium-card-b" aria-hidden>
        <h3 className="sub-title">Certificates</h3>
        <div className="cert-list">
          {certificates.map((cert) => (
            <div key={cert.title} className="cert-row">
              <div className="cert-left">
                <span className="cert-icon">📄</span>
                <div className="cert-text">
                  <p>{cert.title}</p>
                  <a href={cert.verifyUrl} target="_blank" rel="noreferrer" className="verify-link">
                    View on HackerRank ↗
                  </a>
                </div>
              </div>
              <a href={cert.pdf} download className="download-btn" title="Download PDF certificate">
                ⬇
              </a>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`premium-card premium-card-a ${isFlipped ? "is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
      >
        <div ref={frontInnerRef} className="premium-card-inner">
          <div className="premium-card-face premium-card-front">
            <div ref={badgeRef} className="badge-rocket">
              <img src={roleCard.badgeImg} alt="Role badge" />
            </div>
            <p className="pill-label">Premium Profile</p>
            <h2 className="premium-title">{roleCard.title}</h2>
            <p className="premium-tagline">{roleCard.tagline}</p>
            <div className="gold-medal-row">
              <div className="medal-circle">✓</div>
              <div className="medal-circle">✓</div>
              <div className="medal-circle">✓</div>
            </div>
            <ul className="front-highlights">
              <li>3x HackerRank verified credentials</li>
              <li>Strong Java + problem solving foundations</li>
              <li>Ready for software engineering internships</li>
            </ul>
            <p className="hint-text">Click / tap to flip</p>
          </div>

          <div className="premium-card-face premium-card-back">
            <h3 className="sub-title">Snapshot</h3>
            <div className="back-section">
              <span className="back-label">Role</span>
              <p className="back-main">{roleCard.title}</p>
            </div>
            <div className="back-section">
              <span className="back-label">Certificates</span>
              <ul className="back-list">
                {certificates.map((record) => (
                  <li key={record.title}>{record.title}</li>
                ))}
              </ul>
            </div>
            <div className="back-section">
              <span className="back-label">Skills</span>
              <ul className="back-list">
                {skillBadges.map((badge) => (
                  <li key={badge.title}>{badge.title}</li>
                ))}
              </ul>
            </div>
            <p className="hint-text">Click / tap to return</p>
          </div>
        </div>
      </div>
    </div>
  );
}
