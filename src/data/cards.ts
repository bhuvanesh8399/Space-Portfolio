export type CardT = {
  id: number;
  tag: string;
  title: string;
  stat: string;
  tech: string;
};

export const CARDS: CardT[] = [
  { id:0, tag:"Backend",  title:"Spring Boot APIs", stat:"15+ endpoints", tech:"Java · Spring · JPA" },
  { id:1, tag:"Frontend", title:"React Dashboards", stat:"Lighthouse 95+", tech:"React · Vite · TS" },
  { id:2, tag:"Infra",    title:"Dockerized Apps",  stat:"Multi-stage",   tech:"Docker · CI/CD" },
  { id:3, tag:"DB",       title:"SQL Modeling",     stat:"ACID first",    tech:"Postgres · JOOQ" },
  { id:4, tag:"AI/UX",    title:"Smart UI",         stat:"UX micro-AI",   tech:"Forms · Haptics" },
];

