import type { Metadata } from "next";
import { La_Belle_Aurore, Manrope, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const laBelleAurore = La_Belle_Aurore({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-la-belle",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Portofolio Mutiara",
  description: "Junior Full-Stack Developer dengan spesialisasi Pengembangan Web dan Analisis Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${laBelleAurore.variable} ${manrope.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
