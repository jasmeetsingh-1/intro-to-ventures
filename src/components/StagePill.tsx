import type { Stage } from '../content/types'
import { stageLabel } from '../lib/stages'
import './StagePill.css'

export function StagePill({ stage }: { stage: Stage }) {
  return (
    <span className={`stage-pill stage-pill--${stage}`}>
      <span className="stage-pill__dot" aria-hidden="true" />
      {stageLabel[stage]}
    </span>
  )
}
