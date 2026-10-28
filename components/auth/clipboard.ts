/** Copia texto al portapapeles. Devuelve false si el navegador no lo permite. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Descarga un archivo de texto generado en el navegador (sin pasar por el servidor). */
export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari necesita que la URL siga viva un instante tras el clic
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
