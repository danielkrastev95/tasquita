"use client";

import { Download, ExternalLink, FileCode, Printer } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Format = "a6" | "a5";

const FORMATS: Record<Format, { label: string; detail: string; perSheet: number; page: string; fontMm: number }> = {
  // Las medidas de la tarjeta van en «em»: el tamaño de letra fija el tamaño físico.
  a6: { label: "A6", detail: "Tarjeta de mesa · 4 por folio", perSheet: 4, page: "A4 portrait", fontMm: 4 },
  a5: { label: "A5", detail: "Para la barra o la entrada · 2 por folio", perSheet: 2, page: "A4 landscape", fontMm: 5.65 },
};

const FILE_BASE = "qr-carta-la-tasquita";
const noopSubscribe = () => () => {};

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type Props = { url: string; svg: string; name: string; instagram: string };

/** Descargas del QR (PNG/SVG) y tarjetas imprimibles con la marca. */
export function QrStudio({ url, svg, name, instagram }: Props) {
  const [format, setFormat] = useState<Format>("a6");
  const [busy, setBusy] = useState(false);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const config = FORMATS[format];
  const displayUrl = url.replace(/^https?:\/\//, "");

  const downloadPng = async () => {
    setBusy(true);
    try {
      const { toDataURL } = await import("qrcode");
      const dataUrl = await toDataURL(url, { width: 2048, margin: 4, errorCorrectionLevel: "Q", color: { dark: "#1c1c18", light: "#ffffff" } });
      download(dataUrl, `${FILE_BASE}.png`);
      toast.success("QR descargado (PNG de 2048 px)");
    } catch {
      toast.error("No se ha podido generar la imagen. Inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    download(href, `${FILE_BASE}.svg`);
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    toast.success("QR descargado (SVG, para imprenta)");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start md:gap-6">
        <Card>
          <CardTitle>El código</CardTitle>
          <div className="mx-auto w-full max-w-64 rounded-2xl border border-cream-400/70 bg-white p-4 shadow-sm">
            <div className="aspect-square [&_svg]:size-full" role="img" aria-label={`Código QR que abre ${displayUrl}`} dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <p className="mt-4 text-center text-sm text-ink-muted">
            Abre{" "}
            <a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold break-all text-primary underline-offset-2 hover:underline">
              {displayUrl}
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button onClick={downloadPng} loading={busy}>
              <Download className="size-4" aria-hidden />
              PNG
            </Button>
            <Button variant="secondary" onClick={downloadSvg}>
              <FileCode className="size-4" aria-hidden />
              SVG
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">PNG para WhatsApp, redes o Word. SVG si lo va a imprimir una imprenta (no pierde calidad a ningún tamaño).</p>
        </Card>

        <Card>
          <CardTitle description="Tarjetas con vuestra marca listas para recortar. Mejor en cartulina; plastificadas duran años.">Tarjetas para imprimir</CardTitle>
          <div role="group" aria-label="Tamaño de la tarjeta" className="grid grid-cols-2 gap-2">
            {(Object.keys(FORMATS) as Format[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={format === key}
                onClick={() => setFormat(key)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition",
                  format === key ? "border-primary bg-primary-light text-primary-dark" : "border-cream-400 bg-white text-ink hover:border-primary/50",
                )}
              >
                <span className="block text-sm font-bold">{FORMATS[key].label}</span>
                <span className="block text-xs leading-snug text-ink-muted">{FORMATS[key].detail}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex justify-center rounded-2xl bg-cream-200/70 p-5">
            {/* Vista previa a escala (el mismo diseño que se imprime) */}
            <div style={{ fontSize: format === "a6" ? "10px" : "9px" }} className="shadow-lg">
              <MenuCard svg={svg} name={name} instagram={instagram} displayUrl={displayUrl} />
            </div>
          </div>

          <Button onClick={() => window.print()} className="mt-5 w-full">
            <Printer className="size-4" aria-hidden />
            Imprimir {config.perSheet} tarjetas
          </Button>
          <p className="mt-2 text-center text-xs text-ink-muted">En el cuadro de imprimir: tamaño A4, escala 100 % y sin márgenes.</p>
        </Card>
      </div>

      {isClient &&
        createPortal(
          <div className="qr-print" aria-hidden>
            <style>{`
              .qr-print { display: none; }
              @media print {
                @page { size: ${config.page}; margin: 0; }
                html, body { background: #fff !important; }
                body > *:not(.qr-print) { display: none !important; }
                .qr-print {
                  display: grid !important;
                  grid-template-columns: repeat(2, 1fr);
                  width: ${format === "a6" ? "210mm" : "297mm"};
                  height: ${format === "a6" ? "297mm" : "210mm"};
                  font-size: ${config.fontMm}mm;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .qr-print > div { display: flex; align-items: center; justify-content: center; outline: 0.2mm dashed #c9c4bb; }
              }
            `}</style>
            {Array.from({ length: config.perSheet }, (_, i) => (
              <div key={i}>
                <MenuCard svg={svg} name={name} instagram={instagram} displayUrl={displayUrl} />
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

/** Tarjeta de mesa. Todas las medidas en «em» para escalar igual en pantalla y en papel (A6 = 26,25 × 37 em). */
function MenuCard({ svg, name, instagram, displayUrl }: { svg: string; name: string; instagram: string; displayUrl: string }) {
  return (
    <div
      className="flex flex-col items-center justify-between bg-cream text-center text-ink"
      style={{ width: "26.25em", height: "37em", padding: "2.4em 2.2em 2.1em", borderTop: "0.55em solid #2f7780" }}
    >
      <div>
        <p className="font-sans font-semibold text-primary uppercase" style={{ fontSize: "0.85em", letterSpacing: "0.22em" }}>
          {name}
        </p>
        <p className="font-serif font-bold italic" style={{ fontSize: "2.3em", lineHeight: 1.05, marginTop: "0.45em" }}>
          Escanea y mira
          <br />
          nuestra carta
        </p>
      </div>
      <div className="bg-white" style={{ width: "15.5em", padding: "1.1em", borderRadius: "1.2em", boxShadow: "0 0.15em 0.6em rgba(28,28,24,0.08)" }}>
        <div className="aspect-square [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="font-sans">
        <p className="font-semibold" style={{ fontSize: "1.05em" }}>
          Abre la cámara y apunta aquí
        </p>
        <p className="text-ink-muted" style={{ fontSize: "0.85em", marginTop: "0.35em" }}>
          {instagram ? `@${instagram} · ` : ""}
          {displayUrl}
        </p>
      </div>
    </div>
  );
}
