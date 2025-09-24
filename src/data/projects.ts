import type { Project } from "../types/project";
import deltaMd from "../markdown/delta.md?raw";

export const projects: Project[] = [
  {
    id: "proj-physics-sim",
    title: "3D Physics Sandbox",
    description:
      "A little 3D physics playground built with Three.js and a WebAssembly physics core.",
    img: "https://www.shutterstock.com/shutterstock/photos/1932042689/display_1500/stock-photo-businessman-using-mobile-smart-phone-business-global-internet-connection-application-technology-1932042689.jpg",
    demoUrl: "hello.com",
    repoUrl: "https://github.com/hello/hello",
    longNotes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis augue ut ullamcorper mattis. Nulla facilisis nisi sit amet purus convallis, et bibendum enim luctus. Ut eu sem sit amet ipsum rhoncus convallis. Etiam arcu quam, congue quis libero in, laoreet feugiat lectus. Sed mollis dapibus lectus, vitae posuere lacus elementum vel. Pellentesque convallis felis quis maximus semper. Fusce vel libero vel velit condimentum iaculis at at nisi.\n Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus pellentesque eros a ligula feugiat, non gravida nisl efficitur. Etiam eu turpis quis massa lobortis volutpat. Nam eleifend augue in sem ornare feugiat. Curabitur ullamcorper, nisi ac molestie scelerisque, eros orci pharetra tellus, et semper ligula metus ut sapien. Maecenas sed eros non enim fringilla placerat. Curabitur vehicula egestas magna, quis vehicula eros finibus ac. In imperdiet cursus orci eget mattis",
    gallery: [
      "https://www.shutterstock.com/shutterstock/photos/1932042689/display_1500/stock-photo-businessman-using-mobile-smart-phone-business-global-internet-connection-application-technology-1932042689.jpg",
      "https://thumbs.dreamstime.com/b/chain-code-shown-blue-orange-color-scheme-chain-made-up-many-small-links-each-which-single-373808566.jpg",
    ],
    skills: ["threejs", "js", "wasm"],
  },
  {
    id: "proj-delta-team",
    title: "Delta Team",
    description: 'Delta Team is a modern mobile education platform designed to make learning simple, flexible, and accessible.  ',
    md: deltaMd,
    img: "/delta/thumbnail.jpg",
    skills: ["nestjs", "nodejs", "ts", "postgres", "express"],
    gallery: ['/delta/1.jpg', '/delta/2.jpg', '/delta/3.jpg'],
    longNotes: 'This project was made in NestJS for a Team of teachers who wanted a solution for their tiring long hours of repeated teaching while still managing to make it easy for students and not need extra payment gateways and complicated setups.'
  },
  {
    id: "proj-crunch",
    title: "Data Cruncher",
    description:
      "ETL microservice that processes datasets, stores them in Postgres and exposes a small API.",
    img: "/assets/projects/data-crunch.gif",
    skills: ["python", "postgres", "aws"],
  },
];
