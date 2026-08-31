import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
// Self-hosted so there is no third-party font request. Inria Serif ships
// 300/400/700 only — these are the three faces the stylesheet actually uses.
import '@fontsource/inria-serif/400.css'
import '@fontsource/inria-serif/400-italic.css'
import '@fontsource/inria-serif/700.css'
import './styles/global.css'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
