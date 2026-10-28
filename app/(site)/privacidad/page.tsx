import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/public";
import { HolderList, LegalPage, legalData } from "@/components/site/legal/LegalPage";
import { pageMetadata } from "@/components/site/seo";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata(parent, {
    title: "Política de privacidad",
    description: `Cómo trata ${s.name} tus datos personales cuando reservas o contactas con nosotros.`,
    path: "/privacidad",
    siteName: s.name,
  });
}

export default async function PrivacidadPage() {
  const s = await getSiteSettings();
  const d = legalData(s);

  return (
    <LegalPage title="Privacidad" path="/privacidad">
      <p>
        En {d.tradeName} tratamos tus datos personales con respeto y solo para lo imprescindible, conforme al Reglamento (UE) 2016/679
        (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos y garantía de los derechos digitales (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <HolderList settings={s} />

      <h2>2. Qué datos tratamos y para qué</h2>
      <h3>Reservas y consultas</h3>
      <p>
        Cuando nos escribes por WhatsApp, nos llamas o nos envías un email para reservar o preguntar algo, tratamos los datos que nos
        facilitas (nombre, teléfono, número de personas, día y hora, y lo que nos cuentes en tus comentarios) con la única finalidad de
        gestionar tu reserva o responderte.
      </p>
      <p>
        El formulario de reserva de esta web <strong>no envía tus datos a nuestros servidores</strong>: solo prepara en tu dispositivo un
        mensaje que tú decides enviar por WhatsApp.
      </p>
      <p>
        Si nos indicas alergias o intolerancias, las usamos únicamente para preparar tu visita con seguridad, con el consentimiento
        explícito que nos das al comunicárnoslas.
      </p>
      <h3>Navegación por la web</h3>
      <p>
        Usamos Vercel Web Analytics para conocer de forma agregada y anónima qué páginas se visitan (por ejemplo, país o tipo de
        dispositivo). No utiliza cookies ni identifica a las personas. El proveedor de alojamiento registra además datos técnicos de las
        conexiones (como la dirección IP) por motivos de seguridad.
      </p>

      <h2>3. Base jurídica</h2>
      <ul>
        <li>Gestionar tu reserva: aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</li>
        <li>Responder a tus consultas: tu consentimiento al contactarnos (art. 6.1.a RGPD).</li>
        <li>Alergias o intolerancias: tu consentimiento explícito (art. 9.2.a RGPD).</li>
        <li>Estadísticas anónimas y seguridad de la web: nuestro interés legítimo (art. 6.1.f RGPD).</li>
      </ul>

      <h2>4. Cuánto tiempo los conservamos</h2>
      <p>
        Solo el tiempo necesario para gestionar tu reserva o responder a tu consulta. Después se eliminan, salvo que una obligación legal
        exija conservarlos durante más tiempo.
      </p>

      <h2>5. Con quién los compartimos</h2>
      <p>
        No cedemos tus datos a terceros, salvo obligación legal. Para que la web funcione contamos con proveedores que actúan como
        encargados del tratamiento, como Vercel Inc. (alojamiento y analítica). Algunos pueden estar fuera del Espacio Económico Europeo; en
        ese caso, las transferencias se realizan con las garantías previstas en el RGPD, como las cláusulas contractuales tipo de la
        Comisión Europea o el Marco de Privacidad de Datos UE-EE. UU.
      </p>
      <p>
        WhatsApp, Google Maps, Instagram, Glovo y Uber Eats son servicios independientes: cuando los usas, se aplican sus propias políticas
        de privacidad.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como
        retirar tu consentimiento en cualquier momento, escribiéndonos
        {d.email ? (
          <>
            {" "}
            a <a href={`mailto:${d.email}`}>{d.email}</a>
          </>
        ) : null}
        {d.email ? " o " : " "}por correo postal a {d.address}, indicando el derecho que quieres ejercer.
      </p>
      <p>
        Si consideras que no hemos tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Esta web no instala cookies en tu navegador mientras navegas. Tienes todos los detalles en la{" "}
        <Link href="/cookies">política de cookies</Link>.
      </p>
    </LegalPage>
  );
}
