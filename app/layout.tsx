import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteBaseUrl, getOrganizationSameAs } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const siteUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Synergy | Founders & Makers",
    template: "%s | Synergy",
  },
  description:
    "Networking sin fricción: conecta founders y makers con eventos, comunidad de miembros e IA para emparejar perfiles.",
  applicationName: "Synergy",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Synergy",
    title: "Synergy | Founders & Makers",
    description:
      "Networking sin fricción: founders y makers, eventos, comunidad e IA para conectar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synergy | Founders & Makers",
    description:
      "Networking sin fricción: founders y makers, eventos y comunidad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sameAs = getOrganizationSameAs();
  const organizationJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Synergy",
    url: siteUrl,
    description:
      "Plataforma de networking para founders y makers: eventos, inscripciones, app de networking e comunidad de miembros.",
  };
  if (sameAs.length > 0) {
    organizationJsonLd.sameAs = sameAs;
  }

  return (
    <html lang="es">
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
