import type { Metadata, ResolvingMetadata } from "next";
import { getSiteSettings } from "@/lib/data/public";
import { HolderList, LegalPage, legalData } from "@/components/site/legal/LegalPage";
import { pageMetadata } from "@/components/site/seo";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata(parent, {
    title: "Aviso legal",
    description: `Aviso legal de ${s.name}: datos del titular, condiciones de uso de la web y propiedad intelectual.`,
    path: "/aviso-legal",
    siteName: s.name,
  });
}

export default async function AvisoLegalPage() {
  const s = await getSiteSettings();
  const d = legalData(s);
  const who = d.holder ?? d.tradeName;

  return (
    <LegalPage title="Aviso legal" path="/aviso-legal">
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE), te informamos de los datos de quien gestiona este sitio web.
      </p>

      <h2>1. Datos identificativos</h2>
      <HolderList settings={s} />

      <h2>2. Objeto</h2>
      <p>
        Este sitio web informa sobre {d.tradeName}: su carta y precios, horarios, eventos, ubicación y las formas de contactar y reservar
        mesa. No se venden productos ni servicios a través de él; los pedidos a domicilio se gestionan en las plataformas de terceros
        enlazadas.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso a la web es libre y gratuito. Al usarla te comprometes a hacerlo de forma lícita, sin dañar su funcionamiento ni los
        derechos de terceros. {who} puede modificar, suspender o retirar contenidos de la web en cualquier momento.
      </p>

      <h2>4. Carta, precios y alérgenos</h2>
      <p>
        Los precios mostrados incluyen el IVA. La carta, los precios, los horarios y los eventos pueden cambiar sin previo aviso: en caso de
        diferencia, prevalece la información disponible en el local. Si tienes alguna alergia o intolerancia alimentaria, consulta siempre
        al personal antes de pedir.
      </p>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>
        Los textos, fotografías, logotipos y el diseño de esta web pertenecen a {who} o se usan con autorización de sus titulares. No está
        permitida su reproducción, distribución o transformación con fines comerciales sin permiso previo.
      </p>

      <h2>6. Enlaces a otros sitios</h2>
      <p>
        La web enlaza a servicios de terceros (WhatsApp, Instagram, Google Maps, Glovo y Uber Eats, entre otros). Al abrirlos sales de este
        sitio y pasan a aplicarse sus propias condiciones y políticas de privacidad, de las que {who} no es responsable.
      </p>

      <h2>7. Responsabilidad</h2>
      <p>
        Trabajamos para que la información sea correcta y esté actualizada, pero no podemos garantizar la ausencia de errores u
        interrupciones técnicas. {who} no se hace responsable de los daños derivados de un uso indebido de la web.
      </p>

      <h2>8. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Si eres consumidor, para cualquier controversia serán competentes los juzgados
        y tribunales de tu domicilio.
      </p>
    </LegalPage>
  );
}
