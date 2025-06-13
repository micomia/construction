import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ScaffoldEstimator from './components/ui/ScaffoldEstimator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScaffoldEstimator />
  </StrictMode>,
)
