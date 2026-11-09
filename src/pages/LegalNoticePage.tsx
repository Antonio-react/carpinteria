import { LegalPage } from '@/components/ui/LegalPage'
import { LegalSection } from '@/components/ui/LegalSection'
import { siteConfig } from '@/config/site'
import { formatLocality } from '@/utils/address'

/** Aviso legal (LSSI-CE, art. 10). Identificación completa del titular, tomada de site.ts. */
export default function LegalNoticePage() {
  const { titular, nif, nombre, direccion, email, telefonos, dominio } = siteConfig
  return (
    <LegalPage title="Aviso legal" description="Datos del titular de la web y condiciones de uso." updated="noviembre de 2026">
      <LegalSection title="Titular de la web">
        <p>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE),
          se informa de que esta web ({dominio.com}) pertenece a:
        </p>
        <ul>
          <li>Titular: {titular} (empresario autónomo)</li>
          <li>NIF: {nif}</li>
          <li>Nombre comercial: {nombre}</li>
          <li>
            Domicilio: {direccion.calle}, {direccion.poligono}, {formatLocality(direccion)}
          </li>
          <li>
            Correo electrónico: <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li>Teléfono: {telefonos.principal}</li>
          <li>Actividad: ebanistería y carpintería a medida.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Objeto y uso de la web">
        <p>
          Esta web informa sobre los trabajos de carpintería y decoración del titular y permite enviar consultas y solicitudes de
          presupuesto. Quien la visita se compromete a usarla de forma lícita y a no introducir en el formulario datos falsos ni de
          terceros sin su permiso.
        </p>
      </LegalSection>

      <LegalSection title="Propiedad intelectual">
        <p>
          Los textos, el diseño, el logotipo y las fotografías de esta web pertenecen al titular o se usan con permiso de sus
          autores. Las fotografías de trabajos muestran obras realizadas por la empresa, publicadas con la autorización de sus
          propietarios.
          No se permite copiarlos ni reutilizarlos sin autorización por escrito.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilidad">
        <p>
          El titular procura que la información de la web sea correcta y esté actualizada, pero no garantiza la ausencia de errores
          ni la disponibilidad permanente de la web. La información publicada no constituye una oferta vinculante: cada trabajo se
          presupuesta de forma individual.
        </p>
      </LegalSection>

      <LegalSection title="Legislación aplicable">
        <p>
          Esta web se rige por la legislación española. Para cualquier conflicto, las partes se someten a los juzgados y tribunales
          que correspondan según la ley; si quien reclama es un consumidor, los de su domicilio.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
