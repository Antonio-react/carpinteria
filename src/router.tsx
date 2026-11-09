import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
// Inicio se importa directamente (no en diferido): es la página por la que entra casi todo el mundo.
// En diferido, al entrar se descargaba en cadena (código común → código de Inicio → fotos del hero)
// y se veía la sierra antes del hero. Pesa poco (~21 KB), así que compensa traerlo desde el principio.
import HomePage from '@/pages/HomePage'
import {
  CategoryPage,
  ContactPage,
  CookiesPage,
  LegalNoticePage,
  NotFoundPage,
  PrivacyPage,
  ProcessPage,
  WorksPage,
} from '@/pages/lazyPages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/trabajos', element: <WorksPage /> },
      { path: '/trabajos/:slug', element: <CategoryPage /> },
      { path: '/como-trabajamos', element: <ProcessPage /> },
      { path: '/contacto', element: <ContactPage /> },
      { path: '/aviso-legal', element: <LegalNoticePage /> },
      { path: '/privacidad', element: <PrivacyPage /> },
      { path: '/cookies', element: <CookiesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
