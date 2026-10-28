/** Esqueleto mientras llega la página (la carcasa del panel se queda fija, sin saltos). */
export default function PanelLoading() {
  return (
    <div role="status" aria-label="Cargando" className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-9 w-48 rounded-xl bg-cream-300" />
        <div className="h-4 w-full max-w-md rounded-lg bg-cream-300/70" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:max-w-sm">
        <div className="h-12 rounded-xl bg-cream-300" />
        <div className="h-12 rounded-xl bg-cream-300/70" />
      </div>
      <div className="space-y-3 rounded-2xl border border-cream-400/50 bg-white/70 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-14 shrink-0 rounded-xl bg-cream-300/80" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded-md bg-cream-300" />
              <div className="h-3 w-1/3 rounded-md bg-cream-300/70" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
