/** Aviso superior editable (vacaciones, cierres, novedades). */
export function AnnouncementBar({ text }: { text: string }) {
  return (
    <aside aria-label="Aviso" className="bg-primary-dark text-white">
      <p className="mx-auto max-w-[100rem] px-5 py-2.5 text-center text-[0.8125rem] leading-snug font-semibold tracking-[0.02em] text-balance md:px-10">
        <span aria-hidden className="mr-2.5 inline-block size-1.5 animate-pulse-dot bg-gold align-middle" />
        {text}
      </p>
    </aside>
  );
}
