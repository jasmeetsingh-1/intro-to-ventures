export type Stage = 'idea' | 'building' | 'beta' | 'live' | 'paused'

export interface Link {
  label: string
  url: string
}

export interface Milestone {
  label: string
  state: 'done' | 'doing' | 'next'
  date?: string // ISO yyyy-mm-dd, for done items
}

export interface JourneyEntry {
  date: string // ISO yyyy-mm-dd
  title: string
  body: string // 1–4 short paragraphs, plain text; blank line = new paragraph
  kind: 'shipped' | 'decision' | 'learning' | 'milestone' | 'setback'
  links?: Link[]
}

export interface WorkflowStep {
  title: string // a few words
  detail: string // one or two sentences
}

export interface Venture {
  slug: string
  name: string
  oneLiner: string // shown in the table and the journey hero
  stage: Stage
  category: string // e.g. "AI tooling", "Productivity", "Consumer"
  startedOn: string // ISO yyyy-mm
  lastUpdated?: string // ISO yyyy-mm-dd; derived from the journey if omitted
  nextMilestone?: string // short text for the table
  role?: string // e.g. "Solo founder", "Co-founder & CTO"
  liveUrl?: string
  links?: Link[] // repo, demo video, write-up
  // Journey page
  problem: string // the story: why this exists
  audience?: string // who it's for
  workflow: WorkflowStep[] // how it works, in order
  stack: string[]
  architectureNote?: string
  milestones: Milestone[] // where it stands
  journey: JourneyEntry[] // the log, any order (sorted newest first in UI)
  roadmap?: string[] // what's next
  metrics?: { label: string; value: string }[] // only real numbers
}

export interface FounderProfile {
  name: string
  handle: string // "JS"
  headline: string // e.g. "JS, *Founder Mode*" (asterisks mark the italic part)
  intro: string // 2–3 sentences
  principles?: string[] // optional short list: how I build
  portfolioUrl: string
  contact: { email: string; linkedin: string; github?: string }
}

export type JourneyKind = JourneyEntry['kind']
