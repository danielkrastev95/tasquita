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
