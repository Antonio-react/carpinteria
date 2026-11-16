import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'

/**
 * Lee netlify.toml (la configuración real de publicación) para que los tests comprueben lo que de
 * verdad se publica, sin copiar las cabeceras ni las redirecciones a mano en dos sitios.
 */

export interface NetlifyRedirect {
  from: string
  to: string
  status?: number
  force?: boolean
}

export interface NetlifyHeaderRule {
  for: string
  values: Record<string, string>
}

interface NetlifyConfig {
  redirects: NetlifyRedirect[]
  headers: NetlifyHeaderRule[]
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

function toRedirect(value: unknown): NetlifyRedirect | null {
  if (!isRecord(value) || typeof value.from !== 'string' || typeof value.to !== 'string') return null
  return {
    from: value.from,
    to: value.to,
    status: typeof value.status === 'number' ? value.status : undefined,
    force: typeof value.force === 'boolean' ? value.force : undefined,
  }
}

function toHeaderRule(value: unknown): NetlifyHeaderRule | null {
  if (!isRecord(value) || typeof value.for !== 'string' || !isRecord(value.values)) return null
  const values: Record<string, string> = {}
  for (const [key, item] of Object.entries(value.values)) if (typeof item === 'string') values[key] = item
  return { for: value.for, values }
}

const raw: unknown = parse(readFileSync(new URL('../../../netlify.toml', import.meta.url), 'utf8'))
const table = isRecord(raw) ? raw : {}
const listOf = (key: string): unknown[] => {
  const value = table[key]
  return Array.isArray(value) ? value : []
}

export const netlify: NetlifyConfig = {
  redirects: listOf('redirects').map(toRedirect).filter((item): item is NetlifyRedirect => item !== null),
  headers: listOf('headers').map(toHeaderRule).filter((item): item is NetlifyHeaderRule => item !== null),
}

/** Cabeceras que Netlify añade a TODAS las páginas (regla for = "/*"). */
export const siteHeaders: Record<string, string> = netlify.headers.find((rule) => rule.for === '/*')?.values ?? {}

/** Directivas de la CSP como mapa: "script-src" → ["'self'"]. */
export function parseCsp(policy: string): Map<string, string[]> {
  const directives = new Map<string, string[]>()
  for (const part of policy.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/)
    if (name) directives.set(name.toLowerCase(), sources)
  }
  return directives
}

/**
 * Cabeceras para el servidor local de pruebas (http://localhost): las mismas que Netlify, menos
 * las que solo tienen sentido con HTTPS (HSTS y upgrade-insecure-requests, que en http://
 * intentarían pasar a https:// y romperían la carga).
 */
export function localTestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [name, value] of Object.entries(siteHeaders)) {
    if (name.toLowerCase() === 'strict-transport-security') continue
    headers[name.toLowerCase()] =
      name.toLowerCase() === 'content-security-policy'
        ? value
            .split(';')
            .map((part) => part.trim())
            .filter((part) => part && part !== 'upgrade-insecure-requests')
            .join('; ')
        : value
  }
  return headers
}
