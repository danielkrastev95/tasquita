// Enlaces de WhatsApp (wa.me). Sin dependencias: se puede usar en componentes de cliente.

/** "624 43 45 93" → "34624434593"; "+44 7700 900123" → "447700900123". */
export function normalizeWhatsappPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("00")) return digits.slice(2);
  return digits.length === 9 ? `34${digits}` : digits;
}

/** Enlace que abre un chat de WhatsApp con el mensaje ya escrito. */
export function whatsappLink(phone: string, message?: string) {
  const base = `https://wa.me/${normalizeWhatsappPhone(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
