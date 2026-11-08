import { LegalPage } from '@/components/ui/LegalPage'
import { LegalSection } from '@/components/ui/LegalSection'
import { siteConfig } from '@/config/site'
import { formatLocality } from '@/utils/address'

/** Política de privacidad (RGPD y LOPDGDD), centrada en el formulario de contacto. */
export default function PrivacyPage() {
  const { titular, nif, direccion, email } = siteConfig
  return (
    <LegalPage title="Política de privacidad" description="Cómo tratamos los datos que nos envías por el formulario o por correo." updated="noviembre de 2026">
      <LegalSection title="Responsable del tratamiento">
        <ul>
          <li>
            {titular} · NIF {nif}
          </li>
          <li>
            {direccion.calle}, {direccion.poligono}, {formatLocality(direccion)}
          </li>
          <li>
            Correo: <a href={`mailto:${email}`}>{email}</a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Qué datos tratamos">
        <p>
          Los que nos facilitas en el formulario de contacto o por correo: nombre, correo electrónico, teléfono (opcional),
          localidad o zona del trabajo, la descripción de tu idea y, si los adjuntas, planos o fotografías.
        </p>
      </LegalSection>

      <LegalSection title="Para qué los usamos">
        <p>
          Únicamente para responder a tu consulta y, si lo pides, preparar un presupuesto. No los usamos para enviarte publicidad ni
          tomamos decisiones automatizadas con ellos.
        </p>
      </LegalSection>

      <LegalSection title="Base legal">
        <p>
          Tu consentimiento, que nos das al marcar la casilla del formulario (art. 6.1.a del RGPD), y la aplicación de medidas
          precontractuales a petición tuya cuando nos pides un presupuesto (art. 6.1.b del RGPD).
        </p>
      </LegalSection>

      <LegalSection title="Cuánto tiempo los conservamos">
        <p>
          El tiempo necesario para atender tu consulta. Los envíos del formulario, con sus archivos adjuntos, se borran
          automáticamente de Netlify a los 6 meses. La copia que nos llega por correo electrónico la eliminamos en un plazo máximo de
          un año si no llega a haber encargo. Si hay encargo, conservamos los datos durante la relación comercial y los plazos que
          exija la ley (por ejemplo, fiscales).
        </p>
      </LegalSection>

      <LegalSection title="Quién más accede a ellos">
        <p>No cedemos tus datos a terceros. Para que la web y el correo funcionen trabajamos con estos proveedores:</p>
        <ul>
          <li>
            Netlify, Inc.: alojamiento de la web y recepción del formulario. Sus servidores pueden estar en Estados Unidos; la
            transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. y en las cláusulas contractuales tipo de la
            Comisión Europea.
          </li>
          <li>Google (Gmail): gestión del correo electrónico en el que recibimos las consultas, con garantías equivalentes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>
          Puedes pedir acceder a tus datos, rectificarlos o suprimirlos, oponerte a su tratamiento, limitarlo, solicitar su
          portabilidad y retirar tu consentimiento en cualquier momento, escribiendo a <a href={`mailto:${email}`}>{email}</a>. Si
          crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">
            www.aepd.es
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Menores de edad">
        <p>Esta web no está dirigida a menores de 14 años. Si eres menor de esa edad, no nos envíes tus datos.</p>
      </LegalSection>
    </LegalPage>
  )
}
