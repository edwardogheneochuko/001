import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user": framer-motion skips transform animations when the OS asks for reduced motion */}
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
)
