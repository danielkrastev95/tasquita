/* Iconos de marca que lucide-react ya no incluye y pequeñas ayudas tipográficas. */

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Logotipo de WhatsApp (glifo simplificado). */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.97L2 22l5.17-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.89.9-2.99-.2-.31a8.21 8.21 0 1 1 6.87 3.74Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.96-.14.17-.29.19-.54.06a6.73 6.73 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.1-.5.12-.12.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.72c.59.25 1.05.4 1.4.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/** Email que, si no cabe, parte por la arroba en vez de por cualquier letra. */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at < 0) return email;
  return (
    <>
      {email.slice(0, at)}
      <wbr />@{email.slice(at + 1)}
    </>
  );
}
