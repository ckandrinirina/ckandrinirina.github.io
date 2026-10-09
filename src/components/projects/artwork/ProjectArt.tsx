/**
 * ProjectArt — thin dispatcher that renders the inline-SVG artwork for a
 * project `id`. Each of the nine projects owns a self-contained `*Art`
 * component; adding a project is a new `*Art` + one map entry (Open/Closed).
 *
 * For an unknown id the dispatcher renders nothing (an empty fallback) rather
 * than throwing — the grid/modal stay resilient to a missing artwork.
 */

import type { ComponentType } from 'react'
import type { ProjectId } from '../../../content/types'
import SokaArt from './SokaArt'
import SokaLiveArt from './SokaLiveArt'
import LudokaArt from './LudokaArt'
import IntranetArt from './IntranetArt'
import EerArt from './EerArt'
import ShoyoArt from './ShoyoArt'
import OcrArt from './OcrArt'
import HappyArt from './HappyArt'
import TheseisArt from './TheseisArt'

export interface ArtProps {
  className?: string
}

export interface ProjectArtProps extends ArtProps {
  id: ProjectId
}

const ART_BY_ID: Record<ProjectId, ComponentType<ArtProps>> = {
  soka: SokaArt,
  'soka-live': SokaLiveArt,
  ludoka: LudokaArt,
  'bmoi-intranet': IntranetArt,
  eer: EerArt,
  shoyo: ShoyoArt,
  ocr: OcrArt,
  happy: HappyArt,
  theseis: TheseisArt,
}

export default function ProjectArt({ id, className }: ProjectArtProps) {
  const Art = ART_BY_ID[id]
  if (!Art) return null
  return <Art className={className} />
}
