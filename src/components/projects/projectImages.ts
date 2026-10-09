/**
 * Real project screenshots, resolved by file name: dropping
 * `src/assets/projects/<project-id>.webp` (or .png / .jpg / .jpeg) is all it
 * takes for that project to show the screenshot instead of its SVG artwork.
 * Vite fingerprints each file and prefixes the deploy base path.
 */

import type { ProjectId } from '../../content/types'

const FILES = import.meta.glob<string>(
  '../../assets/projects/*.{webp,png,jpg,jpeg}',
  { eager: true, import: 'default' },
)

const IMAGE_BY_ID: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

/** The screenshot URL for a project, or `null` when it has none yet. */
export function projectImage(id: ProjectId): string | null {
  return IMAGE_BY_ID[id] ?? null
}
