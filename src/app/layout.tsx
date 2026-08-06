import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nostos",
    template: "%s | Nostos",
  },
  description:
    "Investigaciones, reflexiones y apuntes personales donde explorar ideas sobre filosofía, salud, geopolítica y más.",
  keywords: [
    "blog personal",
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
    title: "Nostos",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nostos",
              description:
                "Investigaciones, reflexiones y apuntes personales.",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://nostos.vercel.app",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
