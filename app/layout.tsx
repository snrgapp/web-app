import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synergy | Founders & Makers",
  description: "Networking, pero fácil. Conecta founders y makers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
