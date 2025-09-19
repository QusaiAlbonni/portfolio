export interface Project {
  id: string
  title: string
  description: string
  img: string
  skills: string[]
  demoUrl?: string;
  repoUrl?: string;
  longNotes?: string;
}