import type { Metadata } from "next";
import "./globals.css";

import CMP from "@/components/CMP";
import { ConsentDefaults } from "@/components/ConsentDefaults";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "CalcSuite — Calculadoras",
  description:
    "Calculadoras simples (Idade de Pets, IMC, Gravidez/Ovulação) — prontas para AdSense e conformes GDPR/LGPD.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        {/* dataLayer/gtag base ANTES de qualquer script de terceiros */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-indigo-50 via-fuchsia-50 to-violet-100 text-gray-900">
        {/* Consent Mode v2 default = denied; CMP fará update após escolha do usuário */}
        <ConsentDefaults />
        <CMP />

        {/* Navbar global com gradiente e links para todas as calculadoras */}
        <NavBar />

        {/* Conteúdo das páginas */}
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Rodapé com políticas e botão "Gerir cookies" */}
        <SiteFooter />
      </body>
    </html>
  );
}
