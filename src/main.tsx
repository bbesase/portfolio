import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Re-enable transitions (suppressed by the `preload` class in index.html)
// only after the first real paint has committed, so nothing visibly
// transitions in from an unstyled default state on load.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.remove('preload')
  })
})
