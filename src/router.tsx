import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import {
  CategoryPage,
  ContactPage,
  CookiesPage,
  HomePage,
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
