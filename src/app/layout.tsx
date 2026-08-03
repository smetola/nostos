import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nostos — Jardín Digital",
    template: "%s | Nostos",
  },
  description:
    "Investigaciones, reflexiones y apuntes personales. Un jardín digital donde explorar ideas sobre filosofía, salud, geopolítica y más.",
  keywords: [
    "blog personal",
    "jardín digital",
    "filosofía",
    "salud",
    "geopolítica",
    "reflexiones",
  ],
  authors: [{ name: "Santi" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Nostos",
    title: "Nostos — Jardín Digital",
    description:
      "Investigaciones, reflexiones y apuntes personales sobre filosofía, salud, geopolítica y más.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
