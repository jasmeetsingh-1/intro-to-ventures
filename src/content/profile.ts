import type { FounderProfile } from './types'

const portfolioUrl = (import.meta.env.VITE_PORTFOLIO_URL || 'https://example.com').replace(
  /\/+$/,
  '',
)

export const profile: FounderProfile = {
  name: 'Jasmeet Singh',
  handle: 'JS',
  headline: 'JS, *Founder Mode*',
  intro:
    '[Placeholder] I build products from zero, on my own time and outside any job, and I build them in public. This is where every idea lives, from a rough sketch to something people use.',
  principles: [
    '[Placeholder] Ship small, ship often',
    '[Placeholder] Talk to users first',
    '[Placeholder] Write down every decision',
  ],
  portfolioUrl,
  contact: {
    email: 'jasmeets9877@gmail.com',
    linkedin: 'https://linkedin.com/in/jasmeet-singh-developer',
  },
}
