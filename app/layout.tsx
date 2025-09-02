import './globals.css';
import type { ReactNode } from 'react';
export const metadata = {
  title: 'Calculadoras — Pets, IMC, Gravidez',
  description: 'Suite de calculadoras simples com SEO e performance',
  icons: { icon: '/favicon.ico' },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold">CalcSuite</a>
            <nav className="text-sm flex gap-4">
              <a href="/pt/idade-pets" className="hover:underline">Idade de Pets</a>
              <a href="/pt/imc" className="hover:underline">IMC</a>
              <a href="/pt/gravidez-ovulacao" className="hover:underline">Gravidez</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">{children}</main>
        <footer className="border-t bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>© {new Date().getFullYear()} CalcSuite</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacidade</a>
              <a href="#" className="hover:underline">Termos</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
