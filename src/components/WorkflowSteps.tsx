import type { WorkflowStep } from '../content/types'
import './WorkflowSteps.css'

export function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="flow" role="list">
      {steps.map((s, i) => (
        <li key={s.title} className="flow__step">
          <span className="flow__num num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="flow__title">{s.title}</h3>
            <p className="flow__detail">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
