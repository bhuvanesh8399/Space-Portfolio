import React, { useEffect, useRef } from "react";
import "../styles/game-launcher-deck.css";

type LauncherCard = {
  tag: string;
  title: string;
  sub: string;
  progress: number; // 0..1
};

const CARDS: LauncherCard[] = [
  { tag: "Highlight", title: "15+ endpoints", sub: "Spring Boot APIs", progress: 0.95 },
  { tag: "Frontend", title: "React Dashboards", sub: "React · Vite · TS", progress: 0.8 },
  { tag: "Infra", title: "Dockerized Apps", sub: "Docker · CI/CD", progress: 0.7 },
  { tag: "DB", title: "SQL Modeling", sub: "Postgres · jOOQ", progress: 0.65 },
  { tag: "AI/UX", title: "Smart UI", sub: "Forms · Haptics", progress: 0.55 },
];

export default function GameLauncherDeck() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    listRef.current?.querySelectorAll<HTMLElement>(".card").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -6;
    el.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const onLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "";
  };

  return (
    <div ref={listRef} className="launcher" aria-label="Project/skill launcher">
      {CARDS.map((c, i) => (
        <article
          key={i}
          className="card"
          role="button"
          tabIndex={0}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <span className="badge">
            <i className="dot" /> {c.tag}
          </span>
          <h3>{c.title}</h3>
          <p>{c.sub}</p>
          <div
            className="bar"
            style={{ ["--w" as any]: `${Math.round(c.progress * 100)}%` }}
          >
            <i />
          </div>
        </article>
      ))}
    </div>
  );
}

