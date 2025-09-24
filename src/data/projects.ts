import type { Project } from "../types/project";
import deltaMd from "../markdown/delta.md?raw";
import rahalMd from "../markdown/rahal.md?raw";
import chattersMd from "../markdown/chatters.md?raw";

export const projects: Project[] = [
  {
    id: "proj-rahal",
    title: "Rahal",
    description: "A Ride Hailing App that matches drivers with riders.",
    img: "/rahal/logo.jpg",
    longNotes:
      "This project was a major challenge due to the numerous moving parts and the highly asynchronous nature of the system. It required significant time and effort, and it was awarded the highest grade among all university projects at the time.",
    md: rahalMd,
    gallery: [
      "/rahal/thumbnail.jpg",
      "/rahal/1.jpg",
      "/rahal/2.jpg",
      "/rahal/3.jpg",
      "/rahal/4.jpg",
    ],
    skills: [
      "nestjs",
      "ts",
      "express",
      "postgres",
      "nodejs",
      "redis",
      "tile38",
    ],
  },
  {
    id: "proj-delta-team",
    title: "Delta Team",
    description:
      "Delta Team is a modern mobile education platform designed to make learning simple, flexible, and accessible.  ",
    md: deltaMd,
    img: "/delta/thumbnail.jpg",
    skills: ["nestjs", "nodejs", "ts", "postgres", "express"],
    gallery: ["/delta/1.jpg", "/delta/2.jpg", "/delta/3.jpg"],
    longNotes:
      "This project was made in NestJS for a Team of teachers who wanted a solution for their tiring long hours of repeated teaching while still managing to make it easy for students and not need extra payment gateways and complicated setups.",
  },
  {
    id: "proj-chatters",
    title: "Chatters",
    description:
      "Chatters is a real-time chat application that experiments with real time translations between users.",
    longNotes:
      "This web app was made as a prototype for someone who wanted to experiment with such an idea, making the app scale with limited translation calls was the most challenging thing about it.",
    img: "/chatters/logo.svg",
    md: chattersMd,
    gallery: [
      "/chatters/1.png",
      "/chatters/2.png",
      "/chatters/3.png",
      "/chatters/4.png",
      "/chatters/5.png",
    ],
    repoUrl: "https://github.com/QusaiAlbonni/chatters",
    skills: ["django", "python", "postgres", "aws", "vuejs", "ts"],
  },
];
