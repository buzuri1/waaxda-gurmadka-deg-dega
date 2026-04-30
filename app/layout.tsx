import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="so" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
