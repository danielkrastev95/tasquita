import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Tasquita de Sara | Bar de Tapas y Hamburguesas Gourmet en Valdemoro",
  description: "Descubre La Tasquita de Sara en Valdemoro. Bar de tapas moderno con hamburguesas gourmet, raciones y cocina de mercado. Donde el barrio se sienta a la mesa.",
  keywords: "restaurante valdemoro, tapas valdemoro, hamburguesas gourmet, bar valdemoro, la tasquita de sara",
  openGraph: {
    title: "La Tasquita de Sara | Bar de Tapas en Valdemoro",
    description: "Donde el barrio se sienta a la mesa",
    images: [
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
