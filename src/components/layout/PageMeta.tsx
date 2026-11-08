import { useEffect } from 'react'
import { useLocation } from 'react-router'

const SITE_DOMAIN = import.meta.env.VITE_SITE_DOMAIN

interface PageMetaProps {
  title: string
  description: string
}

function setMeta(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.append(tag)
  }
  tag.content = content
}

/**
 * Título, descripción y URL canónica propios de cada página.
 * Actualiza las etiquetas que ya trae index.html (en vez de duplicarlas).
 * La imagen al compartir (Open Graph) es fija para toda la web, en index.html.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
    setMeta('description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `https://${SITE_DOMAIN}${pathname === '/' ? '/' : pathname}`
  }, [title, description, pathname])

  return null
}
