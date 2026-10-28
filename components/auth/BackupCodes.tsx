"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { copyText, downloadText } from "./clipboard";

export const BACKUP_CODES_FILENAME = "tasquita-codigos-respaldo.txt";

function buildFile(codes: string[], email: string) {
  const date = new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date());
  return [
    "LA TASQUITA DE SARA · Códigos de respaldo del panel",
    "",
    `Cuenta: ${email}`,
    `Generados el ${date}`,
    "",
    "Úsalos para entrar al panel si no tienes a mano el móvil con tu app de autenticación:",
    "en la pantalla del código, toca «Usa un código de respaldo» y escribe uno de estos.",
    "",
    ...codes.map((code, i) => `  ${String(i + 1).padStart(2, " ")}.  ${code}`),
    "",
    "· Cada código sirve UNA sola vez.",
    "· Si generas códigos nuevos, estos dejan de funcionar.",
    "· Guarda este archivo en un sitio seguro y no lo compartas con nadie.",
    "",
  ].join("\r\n");
}

/** Rejilla de códigos de respaldo con "Copiar todos" y "Descargar .txt". */
export function BackupCodes({ codes, email }: { codes: string[]; email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(codes.join("\n"));
    if (ok) {
      setCopied(true);
      toast.success("Códigos copiados. Pégalos en un sitio seguro.");
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error("No se han podido copiar. Descárgalos o apúntalos a mano.");
    }
  }

  function handleDownload() {
    downloadText(BACKUP_CODES_FILENAME, buildFile(codes, email));
    toast.success("Archivo descargado");
  }

  return (
    <div className="space-y-3">
      <ol aria-label="Códigos de respaldo" className="grid grid-cols-2 gap-2 rounded-2xl bg-cream-100 p-2.5 font-mono sm:gap-2.5 sm:p-3">
        {codes.map((code, i) => (
          <li key={code} className="flex items-baseline gap-2 rounded-lg bg-white px-2.5 py-2.5 shadow-[0_1px_0_rgba(28,28,24,0.04)] sm:px-3">
            <span aria-hidden className="text-[0.7rem] text-ink-muted/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.9rem] tracking-wide text-ink select-all sm:text-[0.95rem]">{code}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 min-[420px]:grid-cols-2">
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copiados" : "Copiar todos"}
        </Button>
        <Button variant="secondary" onClick={handleDownload}>
          <Download className="size-4" aria-hidden />
          Descargar .txt
        </Button>
      </div>
    </div>
  );
}
