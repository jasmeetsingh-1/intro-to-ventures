import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

if (import.meta.env.DEV) {
  void Promise.all([import('./content/validate'), import('./content/ventures')]).then(
    ([{ validateContent }, { projectFiles }]) => validateContent(projectFiles),
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
