import { lazy } from 'react'

// Cada página se descarga solo cuando se visita (mientras, la sierra del logo gira si tarda).
// Inicio NO va aquí: viene en el código principal (ver router.tsx).
export const WorksPage = lazy(() => import('@/pages/WorksPage'))
export const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
export const ProcessPage = lazy(() => import('@/pages/ProcessPage'))
export const ContactPage = lazy(() => import('@/pages/ContactPage'))
export const LegalNoticePage = lazy(() => import('@/pages/LegalNoticePage'))
export const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
export const CookiesPage = lazy(() => import('@/pages/CookiesPage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
