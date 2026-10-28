"use client";

import { CalendarDays, ChevronRight, Ellipsis, ExternalLink, House, LogOut, PenLine, QrCode, ShieldCheck, Smartphone, Soup, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Dialog } from "./Dialog";
import { InstallDialog, useShowInstallOption } from "./InstallHelp";

type Icon = React.ComponentType<{ className?: string; "aria-hidden"?: boolean; strokeWidth?: number }>;
type NavItem = { href: string; label: string; icon: Icon; match: (path: string) => boolean };

const startsWith = (prefix: string) => (path: string) => path === prefix || path.startsWith(`${prefix}/`);

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Inicio", icon: House, match: (p) => p === "/admin" },
  { href: "/admin/carta", label: "Carta", icon: UtensilsCrossed, match: startsWith("/admin/carta") },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, match: startsWith("/admin/eventos") },
  { href: "/admin/contenido", label: "Contenido", icon: PenLine, match: startsWith("/admin/contenido") },
];
const SECURITY: NavItem = { href: "/admin/seguridad", label: "Seguridad", icon: ShieldCheck, match: startsWith("/admin/seguridad") };
/** En escritorio, el menú del día tiene entrada propia (en móvil se llega desde Inicio). */
const DAILY_MENU: NavItem = { href: "/admin/menu-del-dia", label: "Menú del día", icon: Soup, match: startsWith("/admin/menu-del-dia") };
const SIDEBAR_NAV: NavItem[] = [MAIN_NAV[0], MAIN_NAV[1], DAILY_MENU, ...MAIN_NAV.slice(2)];

/** Fichas de edición: en móvil se oculta la barra de pestañas y manda la barra de Guardar. */
const DETAIL_ROUTE = /^\/admin\/(carta\/platos\/|eventos\/[^/]+|contenido\/[^/]+|menu-del-dia)/;

type ShellUser = { name: string; email: string };

export function AdminShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetail = DETAIL_ROUTE.test(pathname);
  const moreActive = SECURITY.match(pathname);
  const [moreOpen, setMoreOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const showInstall = useShowInstallOption();
  const signOut = useSignOut();

  return (
    <div className="min-h-dvh md:pl-[calc(16rem+env(safe-area-inset-left))]">
      <a
        href="#contenido-panel"
        className="sr-only z-50 rounded-xl bg-primary px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      {/* ── Escritorio: barra lateral ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[calc(16rem+env(safe-area-inset-left))] flex-col border-r border-cream-400/70 bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] md:flex">
        <div className="px-6 pt-7 pb-6">
          <Brand />
        </div>
        <nav aria-label="Secciones del panel" className="flex-1 space-y-1 overflow-y-auto px-3">
          {SIDEBAR_NAV.map((item) => (
            <SidebarLink key={item.href} item={item} active={item.match(pathname)} />
          ))}
          <div className="my-3 h-px bg-cream-300" aria-hidden />
          <SidebarLink item={SECURITY} active={SECURITY.match(pathname)} />
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition hover:bg-cream-100 hover:text-ink"
          >
            <ExternalLink className="size-[18px]" aria-hidden />
            Ver la web
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </nav>
        <div className="border-t border-cream-300 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut.run}
            disabled={signOut.pending}
            className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition hover:bg-danger/10 hover:text-danger disabled:opacity-60"
          >
            <LogOut className="size-[18px]" aria-hidden />
            {signOut.pending ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      {/* ── Móvil: barra superior ── */}
      <header className="sticky top-0 z-30 border-b border-cream-400/60 bg-cream-100/85 pt-[env(safe-area-inset-top)] backdrop-blur-md md:hidden [@media(max-height:480px)]:static">
        <div className="flex h-14 items-center justify-between gap-3 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] [@media(max-height:480px)]:h-12">
          <Link href="/admin" aria-label="Inicio del panel" className="-ml-1 rounded-xl p-1">
            <Brand compact />
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-cream-400 bg-white px-3.5 text-sm font-semibold text-ink shadow-sm active:scale-[0.98]"
          >
            Ver web
            <ExternalLink className="size-3.5" aria-hidden />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </div>
      </header>

      <main
        id="contenido-panel"
        tabIndex={-1}
        className="mx-auto max-w-5xl [--gl:max(1rem,env(safe-area-inset-left))] [--gr:max(1rem,env(safe-area-inset-right))] pt-5 pr-(--gr) pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pl-(--gl) outline-none md:[--gl:2rem] md:[--gr:max(2rem,env(safe-area-inset-right))] md:pt-10 md:pb-12 [@media(max-height:480px)]:pb-[calc(env(safe-area-inset-bottom)+4.5rem)]"
      >
        {children}
      </main>

      {/* ── Móvil: barra de pestañas ── */}
      {!isDetail && (
        <nav
          aria-label="Secciones del panel"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-400/70 bg-white/92 pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto grid max-w-md grid-cols-5 [@media(max-height:480px)]:max-w-2xl">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <TabLink item={item} active={item.match(pathname)} />
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                className={tabClasses(moreActive)}
              >
                <TabIcon icon={Ellipsis} active={moreActive} />
                Más
              </button>
            </li>
          </ul>
        </nav>
      )}

      <Dialog open={moreOpen} onClose={() => setMoreOpen(false)} title="Más opciones">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-cream-100 p-3">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
        </div>
        <ul className="divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-400/70">
          <li>
            <Link href={SECURITY.href} onClick={() => setMoreOpen(false)} className={sheetRowClasses}>
              <ShieldCheck className="size-5 text-primary" aria-hidden />
              <span className="flex-1">
                <span className="block font-semibold">Seguridad</span>
                <span className="block text-xs text-ink-muted">Contraseña y verificación en dos pasos</span>
              </span>
              <ChevronRight className="size-4 text-ink-muted" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/admin/carta/qr" onClick={() => setMoreOpen(false)} className={sheetRowClasses}>
              <QrCode className="size-5 text-primary" aria-hidden />
              <span className="flex-1">
                <span className="block font-semibold">QR de la carta</span>
                <span className="block text-xs text-ink-muted">Descárgalo o imprime tarjetas para las mesas</span>
              </span>
              <ChevronRight className="size-4 text-ink-muted" aria-hidden />
            </Link>
          </li>
          {showInstall && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  setInstallOpen(true);
                }}
                className={cn(sheetRowClasses, "w-full text-left")}
              >
                <Smartphone className="size-5 text-primary" aria-hidden />
                <span className="flex-1">
                  <span className="block font-semibold">Instalar en el móvil</span>
                  <span className="block text-xs text-ink-muted">Ábrelo como una app desde la pantalla de inicio</span>
                </span>
                <ChevronRight className="size-4 text-ink-muted" aria-hidden />
              </button>
            </li>
          )}
          <li>
            <a href="/" target="_blank" rel="noopener" className={sheetRowClasses}>
              <ExternalLink className="size-5 text-primary" aria-hidden />
              <span className="flex-1 font-semibold">Ver la web</span>
              <span className="sr-only">(se abre en otra pestaña)</span>
            </a>
          </li>
          <li>
            <button type="button" onClick={signOut.run} disabled={signOut.pending} className={cn(sheetRowClasses, "w-full text-left text-danger")}>
              <LogOut className="size-5" aria-hidden />
              <span className="flex-1 font-semibold">{signOut.pending ? "Cerrando sesión…" : "Cerrar sesión"}</span>
            </button>
          </li>
        </ul>
      </Dialog>
      <InstallDialog open={installOpen} onClose={() => setInstallOpen(false)} />
    </div>
  );
}

const sheetRowClasses = "flex min-h-14 items-center gap-3 bg-white px-4 py-3 text-sm text-ink transition active:bg-cream-100 disabled:opacity-60";

function useSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const run = async () => {
    setPending(true);
    try {
      await authClient.signOut();
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setPending(false);
      toast.error("No se ha podido cerrar la sesión. Inténtalo otra vez.");
    }
  };
  return { run, pending };
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-white italic shadow-sm">
        T
      </span>
      <span className="leading-none">
        <span className="block font-serif text-lg font-bold tracking-tight text-ink italic">La Tasquita</span>
        {!compact && <span className="mt-1 block text-[11px] font-semibold tracking-[0.16em] text-ink-muted uppercase">Panel de gestión</span>}
      </span>
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/25 text-sm font-bold text-gold-deep">
      {name.trim().charAt(0).toUpperCase() || "S"}
    </span>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
        active ? "bg-primary-light font-semibold text-primary-dark" : "text-ink-muted hover:bg-cream-100 hover:text-ink",
      )}
    >
      {active && <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-1 rounded-r-full bg-primary" />}
      <Icon className="size-[18px]" aria-hidden strokeWidth={active ? 2.25 : 2} />
      {item.label}
    </Link>
  );
}

const tabClasses = (active: boolean) =>
  cn(
    "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors active:scale-[0.97] [@media(max-height:480px)]:h-12 [@media(max-height:480px)]:flex-row [@media(max-height:480px)]:gap-1.5 [@media(max-height:480px)]:text-xs",
    active ? "text-primary-dark" : "text-ink-muted",
  );

function TabIcon({ icon: Icon, active }: { icon: Icon; active: boolean }) {
  return (
    <span className={cn("inline-flex h-7 w-14 items-center justify-center rounded-full transition-colors duration-200 [@media(max-height:480px)]:w-9", active && "bg-primary-light")}>
      <Icon className="size-[22px]" aria-hidden strokeWidth={active ? 2.25 : 1.9} />
    </span>
  );
}

function TabLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined} className={tabClasses(active)}>
      <TabIcon icon={item.icon} active={active} />
      {item.label}
    </Link>
  );
}
