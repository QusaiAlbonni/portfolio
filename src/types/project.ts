export interface Project {
  id: string;
  title: string;
  description: string;
  img: string;
  gallery?: string[];
  skills: string[];
  demoUrl?: string;
  repoUrl?: string;
  longNotes?: string;
}
