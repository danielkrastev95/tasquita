"use client";

import { CircleCheck, ExternalLink, Info, MessageCircle, Minus, Plus, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { upcomingClosures } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { normalizeTaxId, taxIdKind } from "@/lib/validations/legal";
import type { SectionValues } from "@/lib/validations/settings";
import { normalizeWhatsappPhone, whatsappLink } from "@/lib/whatsapp";
import { ClosuresEditor, type ClosureDraft } from "./ClosuresEditor";
import { SectionForm, TextRow, useSectionForm } from "./SectionForm";
import { StringListEditor, fromEntries, toEntries, type ListEntry } from "./StringListEditor";

/* Secciones de Contenido añadidas para el día a día del bar. */

const toNumberOrRaw = (raw: string) => {
  const n = Number(raw.trim().replace(",", "."));
  return raw.trim() !== "" && Number.isFinite(n) ? n : raw;
};

/* ─────────────────────────── Cierres y festivos ─────────────────────────── */

export function CierresForm({ initial, today }: { initial: SectionValues<"cierres">; today: string }) {
  const toState = (v: SectionValues<"cierres">) => ({ specialClosures: v.specialClosures.map((c): ClosureDraft => ({ from: c.from, to: c.to, note: c.note })) });
  const form = useSectionForm<"cierres", { specialClosures: ClosureDraft[] }>("cierres", toState(initial), { fromSaved: toState });
  const upcoming = upcomingClosures(form.values.specialClosures.filter((c) => c.from && c.to));
  return (
    <SectionForm form={form}>
      <div className="flex items-start gap-3 rounded-2xl bg-primary-light/50 p-4 text-sm leading-relaxed text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p>
          No hace falta tocar el horario: esos días la web dirá <strong>«Cerrado»</strong> y avisará de cuándo volvéis a abrir. Si quieres, añade también un{" "}
          <Link href="/admin/contenido/aviso" className="font-semibold text-primary underline underline-offset-2">
            aviso superior
          </Link>
          .
        </p>
      </div>
      <ClosuresEditor
        value={form.values.specialClosures}
        onChange={(next) => form.set("specialClosures", next)}
        today={today}
        errorFor={(key) => form.errorFor(key)}
        fieldId={form.fieldId}
      />
      {form.errorFor("specialClosures") && <p className="text-sm text-danger">{form.errorFor("specialClosures")}</p>}
      {upcoming.length > 0 && (
        <p className="text-xs text-ink-muted">
          {upcoming.length === 1 ? "1 cierre por venir" : `${upcoming.length} cierres por venir`}. Al guardar se ordenan por fecha.
        </p>
      )}
    </SectionForm>
  );
}

/* ─────────────────────────── Notas de la carta ─────────────────────────── */

const NOTE_IDEAS = ["IVA incluido.", "Porción de pan: 1 €.", "Suplemento del 10 % en terraza.", "Consulta los alérgenos a nuestro personal."];

export function NotasForm({ initial }: { initial: SectionValues<"notas"> }) {
  const toState = (v: SectionValues<"notas">) => ({ menuNotes: toEntries(v.menuNotes, "n") });
  const form = useSectionForm<"notas", { menuNotes: ListEntry[] }>("notas", toState(initial), {
    toPayload: (v) => ({ menuNotes: fromEntries(v.menuNotes) }),
    fromSaved: toState,
  });
  const notes = form.values.menuNotes;
  const present = new Set(notes.map((n) => n.text.trim().toLowerCase()));
  const ideas = NOTE_IDEAS.filter((idea) => !present.has(idea.toLowerCase()));

  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Salen al final de la carta, en letra pequeña. Una idea por nota; el orden de aquí es el de la web.">Notas al pie</CardTitle>
        <StringListEditor
          title="Notas"
          hideHeader
          items={notes}
          onChange={(next) => form.set("menuNotes", next)}
          max={8}
          maxLength={200}
          placeholder="Ej.: Porción de pan: 1 €."
          itemLabel="nota"
          inputId={(index) => form.fieldId(`menuNotes.${index}`)}
          error={form.errorFor("menuNotes", true)}
          emptyHint="Puedes pegar varias notas a la vez, una por línea."
        />
        {ideas.length > 0 && notes.length < 8 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-ink-muted">Ideas habituales</p>
            <div className="flex flex-wrap gap-2">
              {ideas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => form.set("menuNotes", [...notes, { key: `idea-${idea}`, text: idea }])}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full border border-cream-400 bg-white px-3 text-xs font-medium text-ink transition hover:border-primary hover:text-primary"
                >
                  <Plus className="size-3.5" aria-hidden />
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="mt-4 text-right text-xs text-ink-muted tabular-nums">{notes.length}/8 notas</p>
      </Card>
    </SectionForm>
  );
}

/* ───────────────────────── Reservas por WhatsApp ───────────────────────── */

type ReservasState = Omit<SectionValues<"reservas">, "reservationMaxGuests"> & { reservationMaxGuests: string };

export function ReservasForm({ initial }: { initial: SectionValues<"reservas"> }) {
  const toState = (v: SectionValues<"reservas">): ReservasState => ({ ...v, reservationMaxGuests: String(v.reservationMaxGuests) });
  const form = useSectionForm<"reservas", ReservasState>("reservas", toState(initial), {
    toPayload: (v) => ({ ...v, reservationMaxGuests: toNumberOrRaw(v.reservationMaxGuests) as number }),
    fromSaved: toState,
  });
  const v = form.values;
  const digits = normalizeWhatsappPhone(v.whatsappPhone);
  const phoneLooksValid = /^\d{9,15}$/.test(digits);
  const guests = Number(v.reservationMaxGuests) || 0;
  const setGuests = (n: number) => form.set("reservationMaxGuests", String(Math.min(200, Math.max(1, n))));
  const guestsError = form.errorFor("reservationMaxGuests");

  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="Un botón para escribiros directamente por WhatsApp desde la web.">WhatsApp</CardTitle>
        <div className="space-y-5">
          <Switch
            checked={v.whatsappEnabled}
            onCheckedChange={(on) => form.set("whatsappEnabled", on)}
            label="Botón de WhatsApp en la web"
            description={v.whatsappEnabled ? "Visible para los clientes." : "Oculto: tampoco se podrá reservar."}
          />
          <TextRow
            form={form}
            name="whatsappPhone"
            label="Número de WhatsApp"
            max={30}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="624 43 45 93"
            hint={phoneLooksValid ? `Se abrirá el chat con +${digits}. Si no es de España, ponlo con su prefijo (+44…).` : "Un móvil con WhatsApp. Si no es de España, ponlo con su prefijo (+44…)."}
          />
          {phoneLooksValid && (
            <a
              href={whatsappLink(v.whatsappPhone, "Hola, esto es una prueba desde el panel de La Tasquita 👋")}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25d366]/12 px-4 text-sm font-semibold text-[#128c4a] transition hover:bg-[#25d366]/20"
            >
              <MessageCircle className="size-4" aria-hidden />
              Probar enlace
              <span className="sr-only">(abre WhatsApp)</span>
            </a>
          )}
        </div>
      </Card>

      <Card className={cn(!v.whatsappEnabled && "opacity-70")}>
        <CardTitle description="Los clientes eligen día, hora y personas en la web y te llega un WhatsApp con la petición ya escrita. Tú la confirmas respondiendo.">
          Reservas
        </CardTitle>
        <div className="space-y-5">
          <Switch
            checked={v.reservationsEnabled}
            onCheckedChange={(on) => form.set("reservationsEnabled", on)}
            disabled={!v.whatsappEnabled}
            label="Aceptar reservas por WhatsApp"
            description={!v.whatsappEnabled ? "Activa primero el botón de WhatsApp." : v.reservationsEnabled ? "Activas." : "Desactivadas: solo se ve el botón de escribir."}
          />
          <div className="space-y-1.5">
            <label htmlFor={form.fieldId("reservationMaxGuests")} className="text-sm font-medium">
              Máximo de personas por reserva
            </label>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" className="size-12" onClick={() => setGuests(guests - 1)} disabled={guests <= 1} aria-label="Una persona menos">
                <Minus className="size-4" aria-hidden />
              </Button>
              <Input
                id={form.fieldId("reservationMaxGuests")}
                inputMode="numeric"
                value={v.reservationMaxGuests}
                onChange={(e) => form.set("reservationMaxGuests", e.target.value.replace(/[^\d]/g, "").slice(0, 3))}
                aria-invalid={guestsError ? true : undefined}
                className="w-20 text-center tabular-nums"
              />
              <Button variant="secondary" size="icon" className="size-12" onClick={() => setGuests(guests + 1)} disabled={guests >= 200} aria-label="Una persona más">
                <Plus className="size-4" aria-hidden />
              </Button>
            </div>
            {guestsError ? <p className="text-sm text-danger">{guestsError}</p> : <p className="text-xs text-ink-muted">Para grupos más grandes, la web les pedirá que os llamen.</p>}
          </div>
          <TextRow form={form} name="reservationsNote" label="Nota junto al botón de reservar" max={200} rows={2} hint="Ej.: «Te confirmamos la reserva por WhatsApp lo antes posible.»" />
        </div>
      </Card>
    </SectionForm>
  );
}

/* ──────────────────────────── Reseñas de Google ─────────────────────────── */

export function ResenasForm({ initial }: { initial: SectionValues<"resenas"> }) {
  const toState = (v: SectionValues<"resenas">) => ({ googleReviewsUrl: v.googleReviewsUrl ?? "" });
  const form = useSectionForm<"resenas", { googleReviewsUrl: string }>("resenas", toState(initial), { fromSaved: toState });
  const url = form.values.googleReviewsUrl.trim();
  return (
    <SectionForm form={form}>
      <Card>
        <CardTitle description="En el pie de la web aparece «Déjanos tu reseña en Google», que lleva directo a escribirla en Google.">Enlace de reseñas</CardTitle>
        <div className="space-y-5">
          <div className="rounded-xl bg-cream-100 p-4 text-sm leading-relaxed">
            <p className="flex items-center gap-2 font-semibold">
              <Star className="size-4 text-gold-deep" aria-hidden /> Dónde se consigue
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-muted">
              <li>Entra en tu Perfil de Empresa de Google (busca «La Tasquita de Sara» en Google con tu cuenta, o ve a business.google.com).</li>
              <li>Pulsa «Pedir reseñas» (a veces sale como «Conseguir más reseñas»).</li>
              <li>Copia el enlace que te da (empieza por https://g.page/… ) y pégalo aquí.</li>
            </ol>
          </div>
          <TextRow form={form} name="googleReviewsUrl" label="Enlace para pedir reseñas" max={500} type="url" inputMode="url" optional placeholder="https://g.page/r/…/review" hint="Si lo dejas vacío, no se muestra el botón." />
          {/^https:\/\//.test(url) && (
            <a href={url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary">
              <ExternalLink className="size-4" aria-hidden />
              Probar el enlace
            </a>
          )}
        </div>
      </Card>
    </SectionForm>
  );
}

/* ───────────────────────────── Datos legales ───────────────────────────── */

export function LegalForm({ initial, businessAddress }: { initial: SectionValues<"legal">; businessAddress: string }) {
  const form = useSectionForm("legal", initial);
  const taxId = form.values.legalTaxId.trim();
  const kind = taxId ? taxIdKind(taxId) : null;
  const taxError = form.errorFor("legalTaxId");

  return (
    <SectionForm form={form}>
      <div className="flex items-start gap-3 rounded-2xl bg-primary-light/50 p-4 text-sm leading-relaxed text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p>
          La ley (LSSI y RGPD) obliga a que la web diga quién es el titular. Estos datos aparecen en las páginas <strong>Aviso legal</strong> y <strong>Política de privacidad</strong>
          , enlazadas al pie de la web. Tu gestoría te los puede confirmar.
        </p>
      </div>
      <Card>
        <CardTitle>Titular de la web</CardTitle>
        <div className="space-y-5">
          <TextRow form={form} name="legalName" label="Nombre o razón social" max={120} placeholder="Ej.: La Tasquita de Sara S.L. o Sara Pérez García" hint="Tal como aparece en tus facturas." />
          <div className="space-y-1.5">
            <TextRow
              form={form}
              name="legalTaxId"
              label="NIF / CIF"
              max={20}
              placeholder="B12345674"
              hint="DNI con letra si eres autónoma; CIF si es una sociedad."
              onBlur={(value) => {
                const clean = normalizeTaxId(value);
                if (clean !== value) form.set("legalTaxId", clean);
              }}
            />
            {taxId && !taxError && (
              <p className={cn("flex items-center gap-1.5 text-xs font-medium", kind ? "text-success" : "text-gold-deep")} aria-live="polite">
                {kind ? <CircleCheck className="size-3.5" aria-hidden /> : <Info className="size-3.5" aria-hidden />}
                {kind ? `${kind} con formato correcto` : "Revisa números y letra: no cuadra el dígito de control"}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <TextRow form={form} name="legalAddress" label="Domicilio fiscal" max={200} rows={2} placeholder="Calle, número, código postal y localidad" />
            {businessAddress && form.values.legalAddress.trim() !== businessAddress && (
              <button
                type="button"
                onClick={() => form.set("legalAddress", businessAddress)}
                className="inline-flex min-h-11 items-center rounded-lg px-1 text-left text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                Usar la dirección del bar ({businessAddress})
              </button>
            )}
          </div>
          <TextRow
            form={form}
            name="legalEmail"
            label="Correo para temas legales y de privacidad"
            max={120}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="hola@latasquitadesara.com"
            hint="Donde un cliente puede pedir que borréis sus datos, por ejemplo."
          />
        </div>
      </Card>
    </SectionForm>
  );
}
