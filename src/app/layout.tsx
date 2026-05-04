import { AppShell } from "@/components/AppShell";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Painel — Loja da Jana",
  description: "Gestão de produtos da loja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
