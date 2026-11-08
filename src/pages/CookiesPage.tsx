import { LegalPage } from '@/components/ui/LegalPage'
import { LegalSection } from '@/components/ui/LegalSection'
import { siteConfig } from '@/config/site'

/** Política de cookies: la web no usa cookies (sin analítica, sin terceros, fuentes alojadas en la propia web). */
export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" description="Esta web no utiliza cookies de análisis, publicidad ni de terceros." updated="noviembre de 2026">
      <LegalSection title="Esta web no usa cookies">
        <p>
          No utilizamos cookies de análisis, de publicidad ni de redes sociales, ni herramientas de estadísticas como Google
          Analytics. Tampoco guardamos información en tu navegador para seguir tu visita.
        </p>
        <p>
          Las tipografías y las imágenes se sirven desde la propia web, sin conectar con servicios de terceros, y no incluimos vídeos
          ni mapas incrustados que puedan instalar cookies. Por eso no te mostramos ningún aviso de cookies.
        </p>
      </LegalSection>

      <LegalSection title="El formulario de contacto">
        <p>
          Enviar el formulario no instala cookies. Los datos que escribes solo se usan para responderte, como se explica en la
          política de privacidad.
        </p>
      </LegalSection>

      <LegalSection title="Si esto cambia">
        <p>
          Si en el futuro incorporamos alguna herramienta que use cookies, actualizaremos esta página y, cuando la ley lo exija, te
          pediremos permiso antes de instalarlas. Para cualquier duda: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Cómo gestionar las cookies en tu navegador">
        <p>
          Puedes revisar y borrar las cookies de cualquier web desde los ajustes de privacidad de tu navegador (Chrome, Firefox,
          Safari, Edge…).
        </p>
      </LegalSection>
    </LegalPage>
  )
}
