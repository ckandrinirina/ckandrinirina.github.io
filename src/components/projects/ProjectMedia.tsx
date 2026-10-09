/**
 * ProjectMedia — the visual inside a card's or modal's `.art` header: the real
 * screenshot when `src/assets/projects/<id>.*` exists, else the inline-SVG
 * `ProjectArt` fallback.
 */

import type { Project } from '../../content/types'
import ProjectArt from './artwork/ProjectArt'
import { projectImage } from './projectImages'

export interface ProjectMediaProps {
  project: Pick<Project, 'id' | 'name'>
}

export default function ProjectMedia({ project }: ProjectMediaProps) {
  const src = projectImage(project.id)
  if (!src) return <ProjectArt id={project.id} />
  return (
    <img
      className="shot"
      src={src}
      alt={project.name}
      loading="lazy"
      decoding="async"
    />
  )
}
