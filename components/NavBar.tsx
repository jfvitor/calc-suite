"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const LINKS_PT = [
  { href: "/pt/idade-pets", label: "Idade de Pets" },
  { href: "/pt/imc", label: "IMC" },
  { href: "/pt/gravidez-ovulacao", label: "Gravidez" }, 
];

const LINKS_EN = [
  { href: "/en/pet-age", label: "Pet Age" },
  { href: "/en/bmi", label: "BMI" },
  { href: "/en/pregnancy", label: "Pregnancy" },
];

export default function NavBar() {
  const pathname = usePathname() || "/pt";

  // Detecta idioma atual pela URL
  const isEn = pathname.startsWith("/en");
  const LINKS = isEn ? LINKS_EN : LINKS_PT;

  // Logo deve respeitar idioma atual
  const homeHref = isEn ? "/en" : "/pt";

  return (
    <nav className="sticky top-0 z-40 text-white shadow-md">
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href={homeHref}
            className="text-base font-bold tracking-tight hover:opacity-90"
          >
            CalcSuite
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 sm:gap-4 text-sm font-medium">
              {LINKS.map((l) => {
                const active = pathname?.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "px-3 py-1.5 rounded-lg transition",
                      active ? "bg-white/20" : "hover:bg-white/10",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Switcher de idioma */}
            <LocaleSwitcher />
          </div>
        </div>
      </div>
      {/* linha de acento colorida sob a navbar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400" />
    </nav>
  );
}
