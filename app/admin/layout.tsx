import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel · La Tasquita" },
  robots: { index: false, follow: false },
  // Panel instalable como app en el móvil (independiente de la web pública)
  manifest: "/panel.webmanifest",
  applicationName: "Panel Tasquita",
  appleWebApp: { capable: true, title: "Panel Tasquita", statusBarStyle: "default" },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream-100 text-ink">
      {children}
      <Toaster position="top-center" richColors closeButton toastOptions={{ className: "font-sans" }} />
    </div>
  );
}
