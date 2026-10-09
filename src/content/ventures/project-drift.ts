import type { Venture } from '../types'

// Placeholder venture: every text field below is dummy copy.
export const projectDrift: Venture = {
  slug: 'project-drift',
  name: 'Project Drift',
  oneLiner: '[Placeholder] An idea for catching when AI agents drift off task.',
  stage: 'idea',
  category: 'AI tooling',
  startedOn: '2026-09',
  lastUpdated: '2026-09-24',
  nextMilestone: 'Validate with 10 interviews',
  problem:
    '[Placeholder] The problem I keep running into, and the hunch that there is a product here. Nothing is built yet.',
  audience: '[Placeholder] Teams running AI agents in production.',
  workflow: [
    {
      title: 'Watch agent runs',
      detail: '[Placeholder] Read the trace of each agent run as it happens.',
    },
    {
      title: 'Compare to the goal',
      detail: '[Placeholder] Score each step against the original instruction.',
    },
    { title: 'Flag the drift', detail: '[Placeholder] Alert a human when a run wanders too far.' },
    {
      title: 'Learn from fixes',
      detail: '[Placeholder] Use human corrections to tune the scoring.',
    },
  ],
  stack: ['Python', 'FastAPI', 'Claude API'],
  milestones: [
    { label: 'Write the problem brief', state: 'done', date: '2026-09-10' },
    { label: 'Validate with 10 interviews', state: 'doing' },
    { label: 'Decide: build or drop', state: 'next' },
    { label: 'Throwaway prototype', state: 'next' },
  ],
  journey: [
    {
      date: '2026-09-08',
      kind: 'learning',
      title: '[Placeholder] Where the idea came from',
      body: '[Placeholder] The project where I first saw the problem.',
    },
    {
      date: '2026-09-10',
      kind: 'milestone',
      title: '[Placeholder] Problem brief written',
      body: '[Placeholder] A one-page brief to test with potential users.',
    },
    {
      date: '2026-09-24',
      kind: 'decision',
      title: '[Placeholder] Interviews before code',
      body: '[Placeholder] Why I am not writing code until the interviews are done.',
    },
  ],
}
