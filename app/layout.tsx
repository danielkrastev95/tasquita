import type { Metadata, Viewport } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "La Tasquita de Sara · Bar de tapas en Valdemoro",
    template: "%s · La Tasquita de Sara",
  },
  applicationName: "La Tasquita de Sara",
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#fcf9f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${newsreader.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
