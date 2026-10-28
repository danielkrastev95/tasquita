import { ArrowRight, CalendarDays, CalendarPlus, Clock, ExternalLink, Plus, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { QuickAnnouncement } from "@/components/admin/QuickAnnouncement";
import { buttonClasses } from "@/components/ui/Button";
import { getDashboardData } from "@/lib/data/admin";
import { formatEventDate } from "@/lib/format";
import { TIME_ZONE, describeOpenStatus, formatDayHours, formatTime, getOpenStatus, madridNow } from "@/lib/schedule";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORY_LABELS } from "@/lib/validations/events";

export const metadata: Metadata = { title: "Inicio" };

export default async function DashboardPage() {
  const session = await requireAdmin();
  const { settings, stats, nextEvents } = await getDashboardData();

  const now = new Date();
  const status = getOpenStatus(settings.openingHours, now);
  const today = madridNow(now).weekday;
  const firstName = session.user.name.trim().split(/\s+/)[0] || "Sara";
  const todayLabel = new Intl.DateTimeFormat("es-ES", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="space-y-1">
        <p className="text-sm font-medium text-ink-muted first-letter:uppercase">{todayLabel}</p>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink italic md:text-5xl">Hola, {firstName}</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-6">
        {/* Estado del local ahora mismo */}
        <section
          aria-label="Estado del local"
          className={cn(
            "relative min-w-0 overflow-hidden rounded-2xl p-5 text-white shadow-sm md:p-6",
            status.open ? "bg-primary" : "bg-ink",
          )}
        >
          <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase opacity-80">
            <span className={cn("relative inline-flex size-2.5 rounded-full", status.open ? "bg-[#7ee2b8]" : "bg-gold")}>
              {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-[#7ee2b8] opacity-60" />}
            </span>
            Ahora en la web
          </p>
          <p className="mt-3 font-serif text-3xl font-bold italic">{status.open ? "Abierto" : "Cerrado"}</p>
          <p className="mt-1 text-sm opacity-90">
            {status.open
              ? `Cierra a las ${formatTime(status.closesAt)}`
              : status.opensAt
                ? describeOpenStatus(status, now).replace(/^Cerrado · a/, "A")
                : "No hay horas de apertura en el horario"}
          </p>
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/15 pt-4">
            <p className="text-sm">
              <span className="block text-xs opacity-70">Horario de hoy</span>
              <span className="font-medium">{formatDayHours(settings.openingHours[today])}</span>
            </p>
            <Link
              href="/admin/contenido/horario"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white/15 px-3.5 text-sm font-semibold transition hover:bg-white/25"
            >
              <Clock className="size-4" aria-hidden />
              Cambiar
            </Link>
          </div>
          {settings.hoursNote && <p className="mt-3 text-xs opacity-80">{settings.hoursNote}</p>}
        </section>

        <QuickAnnouncement initialEnabled={settings.announcementEnabled} initialText={settings.announcementText} />
      </div>

      {/* Accesos rápidos */}
      <section aria-labelledby="atajos">
        <h2 id="atajos" className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Accesos rápidos
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickAction href="/admin/carta/platos/nuevo" icon={Plus} label="Añadir plato" />
          <QuickAction href="/admin/eventos/nuevo" icon={CalendarPlus} label="Crear evento" />
          <QuickAction href="/admin/contenido/horario" icon={Clock} label="Cambiar horario" />
          <QuickAction href="/" icon={ExternalLink} label="Ver la web" external />
        </ul>
      </section>

      {/* Cifras */}
      <section aria-labelledby="cifras">
        <h2 id="cifras" className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Tu web en cifras
        </h2>
        <ul className="grid grid-cols-3 gap-3">
          <Stat href="/admin/carta" label="Platos visibles" value={stats.visibleItems} detail={stats.hiddenItems ? `${stats.hiddenItems} oculto${stats.hiddenItems === 1 ? "" : "s"}` : "Ninguno oculto"} />
          <Stat
            href="/admin/carta"
            label="Categorías"
            value={stats.categories}
            detail={stats.hiddenCategories ? `${stats.hiddenCategories} oculta${stats.hiddenCategories === 1 ? "" : "s"}` : "Todas visibles"}
          />
          <Stat href="/admin/eventos" label="Próximos eventos" value={stats.upcomingEvents} detail={settings.eventsEnabled ? "Sección visible" : "Sección oculta"} />
        </ul>
      </section>

      {/* Próximos eventos */}
      <section aria-labelledby="proximos">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="proximos" className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Próximos eventos
          </h2>
          {nextEvents.length > 0 && (
            <Link href="/admin/eventos" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary">
              Ver todos <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
        {nextEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No hay eventos a la vista"
            action={
              <Link href="/admin/eventos/nuevo" className={buttonClasses("primary", "md")}>
                <CalendarPlus className="size-4" aria-hidden /> Crear evento
              </Link>
            }
          >
            Un concierto, una cata o un partido: anúncialo y aparecerá en la web.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-400/70 bg-white">
            {nextEvents.map((event) => {
              const date = formatEventDate(event.date);
              return (
                <li key={event.id}>
                  <Link href={`/admin/eventos/${event.id}`} className="flex items-center gap-4 p-4 transition hover:bg-cream-100">
                    <span className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-primary-light py-1.5 text-primary-dark">
                      <span className="text-lg leading-none font-bold tabular-nums">{date.day}</span>
                      <span className="text-[11px] font-semibold uppercase">{date.monthShort}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{event.title}</span>
                      <span className="block text-sm text-ink-muted first-letter:uppercase">
                        {date.weekday} · {formatTime(event.time)} h
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      <Badge tone={event.isFeatured ? "gold" : "muted"}>{event.isFeatured ? "Destacado" : EVENT_CATEGORY_LABELS[event.category]}</Badge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="flex items-center justify-center gap-2 pt-2 text-xs text-ink-muted">
        <UtensilsCrossed className="size-3.5" aria-hidden />
        Los cambios que guardas aquí se ven en la web al momento.
      </p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, external }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; external?: boolean }) {
  const className =
    "flex min-h-24 flex-col justify-between gap-3 rounded-2xl border border-cream-400/70 bg-white p-4 text-ink shadow-[0_1px_2px_rgba(28,28,24,0.04)] transition hover:border-primary/40 hover:shadow-md active:scale-[0.98]";
  const content = (
    <>
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
        <Icon className="size-5" />
      </span>
      <span className="text-sm leading-tight font-semibold">{label}</span>
    </>
  );
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener" className={className}>
          {content}
          <span className="sr-only">(se abre en otra pestaña)</span>
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}

function Stat({ href, label, value, detail }: { href: string; label: string; value: number; detail: string }) {
  return (
    <li>
      <Link href={href} className="block h-full rounded-2xl border border-cream-400/70 bg-white p-3.5 transition hover:border-primary/40 md:p-5">
        <span className="block text-xs leading-tight font-medium text-ink-muted">{label}</span>
        <span className="mt-2 block font-serif text-3xl leading-none font-bold text-ink tabular-nums md:text-4xl">{value}</span>
        <span className="mt-1.5 block text-[11px] leading-tight text-ink-muted md:text-xs">{detail}</span>
      </Link>
    </li>
  );
}
