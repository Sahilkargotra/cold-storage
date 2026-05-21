import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@vrushabh-b/oneiot-ui'
import '@vrushabh-b/oneiot-ui/tokens'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider applyToDocument defaultMode="dark">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
