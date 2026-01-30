import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Question Card App",
  description: "Aplicación interactiva de cartas de preguntas",
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
