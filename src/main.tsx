import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
// Fuentes alojadas en el propio proyecto (sin CDN ni cookies de terceros).
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/courier-prime/400.css'
import './index.css'
import { router } from '@/router'

// Al abrir o recargar cualquier página, empieza arriba del todo (no donde se quedó el scroll).
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
