/**
 * Borrado automático de los envíos del formulario de contacto guardados en Netlify.
 *
 * La política de privacidad promete que los datos de quien pide presupuesto no se guardan en Netlify
 * más de 6 meses. El cliente no entra en el panel de Netlify, así que esta tarea programada lo hace
 * sola: cada día (ver netlify.toml) borra los envíos, válidos y de spam, con más de RETENTION_MONTHS
 * meses. Con el envío se van también sus adjuntos (los enlaces de los avisos por email dejan de
 * funcionar), por eso el plazo da tiempo de sobra para descargarlos.
 *
 * Variables de entorno (panel de Netlify):
 *   FORMS_CLEANUP_TOKEN    token personal de la cuenta de Netlify DUEÑA del proyecto (obligatoria).
 *                          Si el proyecto cambia de cuenta, hay que crear un token nuevo en la nueva.
 *   FORMS_CLEANUP_DRY_RUN  "true" = solo cuenta lo que borraría, sin borrar nada (para probar).
 *
 * Solo se ejecuta en la versión publicada (no en previsualizaciones). Para probarla: panel de Netlify
 * → Logs → Functions → purge-form-submissions → "Run now", y mirar el registro.
 */

const RETENTION_MONTHS = 6
const API = 'https://api.netlify.com/api/v1'
const PAGE_SIZE = 100

interface Submission {
  id: string
  created_at: string
}

/** Lo que usamos del objeto Context que Netlify pasa a cada función. */
interface FunctionContext {
  site?: { id?: string }
}

/** Objeto global de Netlify en las funciones (solo usamos la lectura de variables de entorno). */
declare const Netlify: { env: { get(name: string): string | undefined } }

type SubmissionState = 'verified' | 'spam'

/** Todas las páginas de envíos de un estado (válidos o spam). */
async function listSubmissions(siteId: string, state: SubmissionState, headers: HeadersInit): Promise<Submission[]> {
  const all: Submission[] = []
  for (let page = 1; ; page++) {
    const params = new URLSearchParams({ page: String(page), per_page: String(PAGE_SIZE) })
    if (state === 'spam') params.set('state', 'spam')
    const response = await fetch(`${API}/sites/${siteId}/submissions?${params}`, { headers })
    if (!response.ok) throw new Error(`No se pudieron listar los envíos (${state}): HTTP ${response.status}`)
    const batch = (await response.json()) as Submission[]
    all.push(...batch)
    if (batch.length < PAGE_SIZE) return all
  }
}

export default async (_request: Request, context: FunctionContext): Promise<Response> => {
  const token = Netlify.env.get('FORMS_CLEANUP_TOKEN')
  const siteId = context.site?.id ?? Netlify.env.get('SITE_ID')
  const dryRun = Netlify.env.get('FORMS_CLEANUP_DRY_RUN') === 'true'

  if (!token || !siteId) {
    console.error('[purge] Falta FORMS_CLEANUP_TOKEN o el identificador del proyecto: no se borra nada.')
    return new Response('Falta configuración', { status: 500 })
  }

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS)
  const headers: HeadersInit = { Authorization: `Bearer ${token}`, 'User-Agent': 'carpinteria-forms-cleanup' }

  let deleted = 0
  let failed = 0
  for (const state of ['verified', 'spam'] as const) {
    const old = (await listSubmissions(siteId, state, headers)).filter((item) => new Date(item.created_at) < cutoff)
    for (const item of old) {
      if (dryRun) {
        deleted++
        continue
      }
      const response = await fetch(`${API}/submissions/${item.id}`, { method: 'DELETE', headers })
      if (response.ok) deleted++
      else failed++
    }
  }

  const summary = `${dryRun ? '[prueba, sin borrar] ' : ''}Envíos anteriores al ${cutoff.toISOString().slice(0, 10)}: ${deleted} ${dryRun ? 'se borrarían' : 'borrados'}${failed ? `, ${failed} con error` : ''}.`
  console.log(`[purge] ${summary}`)
  return new Response(summary, { status: failed ? 500 : 200 })
}
