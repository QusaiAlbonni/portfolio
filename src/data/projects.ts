import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: 'proj-physics-sim',
    title: '3D Physics Sandbox',
    description: 'A little 3D physics playground built with Three.js and a WebAssembly physics core.',
    img: '/assets/projects/physics-sim.gif',
    skills: ['threejs', 'js', 'wasm']
  },
  {
    id: 'proj-chatters',
    title: 'Realtime Chat App',
    description: 'Real-time chat with presence and typing indicators — built with NestJS and Socket.IO.',
    img: '/assets/projects/chatters.gif',
    skills: ['nestjs', 'nodejs', 'socketio', 'ts']
  },
  {
    id: 'proj-crunch',
    title: 'Data Cruncher',
    description: 'ETL microservice that processes datasets, stores them in Postgres and exposes a small API.',
    img: '/assets/projects/data-crunch.gif',
    skills: ['python', 'postgres', 'aws']
  }
]
