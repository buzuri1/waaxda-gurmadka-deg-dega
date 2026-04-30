import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gurmadka Deg Dega ee Gobolka Banadir",
  description: "Nidaamka Maareynta Dabka — Banadir Region Fire & Emergency Services",
  keywords: "Mogadishu, Fire, Emergency, Banadir, Somalia, Gurmadka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="so" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
