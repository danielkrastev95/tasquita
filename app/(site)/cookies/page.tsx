import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/public";
import { LegalPage } from "@/components/site/legal/LegalPage";
import { pageMetadata } from "@/components/site/seo";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata(parent, {
    title: "Política de cookies",
    description: `Qué cookies usa la web de ${s.name}: ninguna mientras navegas.`,
    path: "/cookies",
    siteName: s.name,
  });
}

const BROWSERS = [
  { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
  { name: "Safari", href: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
  { name: "Firefox", href: "https://support.mozilla.org/es/kb/Borrar%20cookies" },
  { name: "Edge", href: "https://support.microsoft.com/es-es/microsoft-edge" },
];

export default async function CookiesPage() {
  const s = await getSiteSettings();

  return (
    <LegalPage title="Cookies" path="/cookies">
      <p>
        Las cookies son pequeños archivos que algunas webs guardan en tu navegador para recordar información sobre tu visita. Aquí te
        contamos, sin letra pequeña, cómo funciona esta web.
      </p>

      <h2>1. Esta web no usa cookies mientras navegas</h2>
      <p>
        La web de {s.name} <strong>no instala cookies propias ni de terceros</strong> en tu navegador mientras la visitas. Por eso no te
        mostramos ningún aviso para aceptarlas.
      </p>
      <ul>
        <li>
          <strong>Estadísticas:</strong> usamos Vercel Web Analytics, que mide las visitas de forma agregada y anónima sin cookies ni
          identificadores persistentes.
        </li>
        <li>
          <strong>Mapa de Google:</strong> el mapa de la sección de contacto no se carga hasta que pulsas «Ver mapa interactivo». Hasta
          entonces no hay ninguna conexión con Google. Si decides cargarlo, Google puede instalar sus propias cookies según su{" "}
          <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">
            política de cookies
          </a>
          .
        </li>
        <li>
          <strong>Enlaces externos:</strong> WhatsApp, Instagram, Google Maps («Cómo llegar»), Glovo y Uber Eats se abren fuera de esta
          web; allí se aplican sus propias políticas.
        </li>
        <li>
          <strong>Panel de gestión:</strong> el área privada del personal usa únicamente cookies técnicas de sesión, imprescindibles para
          iniciar sesión de forma segura y exentas de consentimiento (art. 22.2 de la LSSI-CE). No afectan a los visitantes de la web.
        </li>
      </ul>

      <h2>2. Cómo gestionar las cookies de tu navegador</h2>
      <p>Puedes consultar, bloquear o borrar las cookies desde la configuración de tu navegador:</p>
      <ul>
        {BROWSERS.map((b) => (
          <li key={b.name}>
            <a href={b.href} target="_blank" rel="noopener noreferrer">
              {b.name}
            </a>
          </li>
        ))}
      </ul>

      <h2>3. Más información</h2>
      <p>
        Si tienes dudas sobre cómo tratamos tus datos, consulta la <Link href="/privacidad">política de privacidad</Link> o el{" "}
        <Link href="/aviso-legal">aviso legal</Link>.
      </p>
    </LegalPage>
  );
}
