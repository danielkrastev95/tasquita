import type { Metadata } from "next";
import { Montserrat, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="es" className={`${montserrat.variable} ${newsreader.variable} ${spaceGrotesk.variable}`}>
      <body className={`${montserrat.className} antialiased`} style={{ backgroundColor: '#fcf9f3' }}>{children}</body>
    </html>
  );
}
