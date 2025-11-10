import React from "react";
import "../styles/solar-system.css";

export default function SolarSystem(){
  return (
    <main className="solar-system" aria-label="Galilean moons">
      <section className="solar-system__io-trajectory" aria-hidden>
        <article className="solar-system__io-trajectory__io" aria-label="Io" />
      </section>

      <section className="solar-system__europa-trajectory" aria-hidden>
        <article className="solar-system__europa-trajectory__europa" aria-label="Europa" />
      </section>

      <section className="solar-system__ganymede-trajectory" aria-hidden>
        <article className="solar-system__ganymede-trajectory__ganymede" aria-label="Ganymede" />
      </section>

      <section className="solar-system__callisto-trajectory" aria-hidden>
        <article className="solar-system__callisto-trajectory__callisto" aria-label="Callisto" />
      </section>
    </main>
  )
}
