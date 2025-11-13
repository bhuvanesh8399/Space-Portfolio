import javaBadgeImg from "../../assets/badges/java basic.png";
import problemBadgeImg from "../../assets/badges/problem solving.png";
import sweBadgeImg from "../../assets/badges/software engineer.png";

import javaPdf from "../../assets/certificates/java_basic certificate (1).pdf";
import psPdf from "../../assets/certificates/problem_solving_intermediate certificate (1).pdf";
import swePdf from "../../assets/certificates/software_engineer_intern certificate (1).pdf";

export type Certificate = {
  id: string;
  title: string;
  tag: "SKILL" | "ROLE";
  pdf: string;
  verifyUrl: string;
};

export type SkillBadge = {
  title: string;
  img: string;
};

export const roleCard = {
  title: "Software Engineer Intern",
  tagline: "HackerRank-verified role with strong Java + problem solving skills.",
  badgeImg: sweBadgeImg,
};

export const certificates: Certificate[] = [
  {
    id: "java-basic",
    title: "Java (Basic)",
    tag: "SKILL",
    pdf: javaPdf,
    verifyUrl: "https://www.hackerrank.com/certificates/8438bc27f016",
  },
  {
    id: "problem-solving",
    title: "Problem Solving (Intermediate)",
    tag: "SKILL",
    pdf: psPdf,
    verifyUrl: "https://www.hackerrank.com/certificates/38d891ca2cd3",
  },
  {
    id: "swe-intern",
    title: "Software Engineer Intern",
    tag: "ROLE",
    pdf: swePdf,
    verifyUrl: "https://www.hackerrank.com/certificates/0db8cce3825c",
  },
];

export const skillBadges: SkillBadge[] = [
  { title: "Java (Basic)", img: javaBadgeImg },
  { title: "Problem Solving (Intermediate)", img: problemBadgeImg },
];
