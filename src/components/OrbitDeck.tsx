import React, { useMemo, useRef, useState, useEffect } from "react";

type Card = {
  id: number;
  tag: string;
  title: string;
  stat: string;
  tech: string;
};

type Props = {
  accent?: string; // CSS color token
  cards?: Card[];
  compact?: boolean; // tighter vertical rhythm
};

// ---- tiny SFX ping (WebAudio) ----
function usePing(f = 880) {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);
  return () => {
    try {
      if (!ctxRef.current)
        ctxRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const ctx = ctxRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };
}

// ---- cursor glow layer ----
function usePointerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, []);
  return ref;
}

export default function OrbitDeck({ accent = "#8A5BFF", cards, compact }: Props) {
  const PING = usePing(980);
  const glowRef = usePointerGlow();

  const data = useMemo<Card[]>(
    () =>
      cards ?? [
        { id: 0, tag: "Backend", title: "Spring Boot APIs", stat: "15+ endpoints", tech: "Java · Spring · JPA" },
        { id: 1, tag: "Frontend", title: "React Dashboards", stat: "Lighthouse 95+", tech: "React · Vite · TS" },
        { id: 2, tag: "Infra", title: "Dockerized Apps", stat: "Multi-stage", tech: "Docker · CI/CD" },
        { id: 3, tag: "DB", title: "SQL Modeling", stat: "ACID first", tech: "Postgres · JOOQ" },
        { id: 4, tag: "AI/UX", title: "Smart UI", stat: "UX micro‑AI", tech: "Forms · Haptics" },
      ],
    [cards]
  );

  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);

  // hue-adaptive identity
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  // breathing float for hero
  useEffect(() => {
    let raf = 0;
    const root = document.querySelector(".orbit-root") as HTMLElement | null;
    if (!root) return;
    const start = performance.now();
    const loop = (t: number) => {
      const s = (t - start) / 1000;
      const y = Math.sin(s * 1.2) * 4;
      root.style.setProperty("--floatY", y.toFixed(2) + "px");
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // keyboard nav for launcher vibes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setActive((p) => Math.min(p + 1, data.length - 1));
      if (e.key === "ArrowUp") setActive((p) => Math.max(p - 1, 0));
      if (e.key === "Enter" || e.key === " ") {
        PING();
        setLocked(true);
        setTimeout(() => setLocked(false), 240);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data.length, PING]);

  const onClickCard = (i: number) => {
    setActive(i);
    PING();
    setLocked(true);
    setTimeout(() => setLocked(false), 240);
  };

  return (
    <section className={"orbit-root" + (compact ? " is-compact" : "")} ref={glowRef}>
      <div className="orbit-bg">
        <div className="glyph-field" aria-hidden="true" />
      </div>

      <div className="stack">
        {data.map((c, i) => {
          const isActive = i === active;
          const depth = i - active;
          return (
            <button
              key={c.id}
              className={"card " + (isActive ? "is-hero " : "") + (locked && isActive ? "is-locked " : "")}
              style={{ "--z": String(100 - i), "--depth": String(depth) } as React.CSSProperties}
              onClick={() => onClickCard(i)}
              onMouseMove={(e) => {
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
                const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
                (e.currentTarget as HTMLElement).style.setProperty("--rx", y + "deg");
                (e.currentTarget as HTMLElement).style.setProperty("--ry", x + "deg");
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.setProperty("--rx", "0deg");
                (e.currentTarget as HTMLElement).style.setProperty("--ry", "0deg");
              }}
            >
              <span className="rim" />
              <span className="tag">{c.tag}</span>
              <span className="title">{c.title}</span>
              <span className="meta">{c.tech}</span>
              <span className="stat">{c.stat}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

