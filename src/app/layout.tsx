import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadPronto AI - Pare de perder vendas",
  description: "A plataforma de IA que transforma sua comunicação de vendas. Gere conteúdo, scripts de WhatsApp e campanhas completas em segundos.",
  keywords: ["vendas", "IA", "marketing", "WhatsApp", "leads", "conteúdo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  );
}
