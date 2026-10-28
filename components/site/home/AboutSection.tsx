import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { SmartImage } from "../SmartImage";
import { pad2, splitCity } from "../utils";

const VALUE_COLS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export function AboutSection({ settings: s }: { settings: SiteSettings }) {
  const { locality } = splitCity(s.addressCity);
  const gallery = [s.aboutImage2, s.aboutImage3].filter((v): v is string => Boolean(v));

  return (
    <section id="nosotros" aria-labelledby="nosotros-title">
      {/* Banda oscura con foto y titular gigante */}
      <div className="relative isolate overflow-hidden bg-ink text-white">
        {s.aboutImage1 && (
          <SmartImage src={s.aboutImage1} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-50" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/75 to-ink/20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay" />
        <div className="mx-auto flex min-h-[36rem] max-w-[100rem] flex-col justify-end px-5 pt-28 pb-14 md:min-h-[44rem] md:px-10 md:pb-20 lg:min-h-[min(88svh,56rem)] lg:px-14">
          <p className="reveal mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gold uppercase md:mb-7">
            <span aria-hidden className="h-px w-10 bg-gold" />
            Nosotros · {locality}
          </p>
          <h2
            id="nosotros-title"
            className="reveal font-serif text-[clamp(3rem,13.5vw,10.5rem)] leading-[0.84] font-extrabold tracking-[-0.035em] text-balance uppercase italic"
          >
            {s.aboutHeroTitle}
            <span className="mt-[0.06em] block">
              <span aria-hidden className="text-gold">· </span>
              Desde {s.yearFounded}
            </span>
          </h2>
          {s.aboutParagraph1 && (
            <p className="reveal mt-8 max-w-xl text-base leading-relaxed text-white/80 text-pretty md:mt-10 md:text-lg">{s.aboutParagraph1}</p>
          )}
        </div>
      </div>

      {/* Cita + segundo párrafo */}
      <div className="grid gap-px border-b border-primary bg-primary md:grid-cols-2">
        <figure className="flex flex-col justify-center bg-cream px-5 py-14 md:px-10 md:py-20 lg:px-14 lg:py-28">
          <blockquote className="reveal font-serif text-[clamp(1.75rem,4vw,3.1rem)] leading-[1.06] font-bold text-balance text-primary italic">
            “{s.aboutQuote}”
          </blockquote>
          {s.aboutQuoteAuthor && (
            <figcaption className="mt-8 flex items-center gap-4 text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">
              <span aria-hidden className="h-1 w-12 bg-gold" />
              {s.aboutQuoteAuthor}
            </figcaption>
          )}
        </figure>
        {s.aboutParagraph2 && (
          <div className="flex flex-col justify-center bg-cream px-5 py-14 md:px-10 md:py-20 lg:px-14 lg:py-28">
            <p className="reveal max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted text-pretty first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[4.25rem] first-letter:leading-[0.78] first-letter:font-extrabold first-letter:text-primary md:text-lg">
              {s.aboutParagraph2}
            </p>
          </div>
        )}
      </div>

      {/* Díptico de fotos del local */}
      {gallery.length > 0 && (
        <div className={cn("grid gap-px border-b border-primary bg-primary", gallery.length === 2 && "grid-cols-2")}>
          {gallery.map((src) => (
            <div key={src} className="group relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-[clamp(26rem,58vw,44rem)]">
              <SmartImage
                src={src}
                alt={`Ambiente de ${s.name}`}
                fill
                sizes={gallery.length === 2 ? "50vw" : "100vw"}
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03] md:object-[50%_70%]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Valores */}
      <div className="mx-auto max-w-[100rem] px-5 py-16 md:px-10 md:py-24 lg:px-14 lg:py-32">
        <h2 className="reveal mb-10 font-serif text-[clamp(2.75rem,11vw,8rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-balance text-ink uppercase italic md:mb-16">
          {s.aboutValuesTitle}
        </h2>
        <ol className={cn("reveal grid gap-px border border-primary bg-primary", VALUE_COLS[s.values.length])}>
          {s.values.map((value, i) => (
            <li key={value.title} className="flex flex-col bg-cream p-6 md:p-8 lg:p-10">
              <span className="font-serif text-5xl leading-none font-bold glyph-outline text-gold-deep md:text-6xl" aria-hidden>
                {pad2(i + 1)}
              </span>
              <span aria-hidden className="my-6 h-px w-full bg-gold/60" />
              <h3 className="font-serif text-[1.6rem] leading-[1.02] font-extrabold text-balance text-ink uppercase md:text-[1.85rem]">{value.title}</h3>
              {value.description && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted text-pretty">{value.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
