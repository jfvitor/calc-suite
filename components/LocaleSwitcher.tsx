"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mapeamento PT <-> EN
// A chave é o slug SEM o /pt ou /en
const routeMap: Record<
  string,
  { pt: string; en: string }
> = {
  "": { pt: "/pt", en: "/en" },
  "/idade-pets": { pt: "/pt/idade-pets", en: "/en/pet-age" },
  "/imc": { pt: "/pt/imc", en: "/en/bmi" },
  // Adicione mais rotas aqui conforme necessário
  // "/gravidez-ovulacao": { pt: "/pt/gravidez-ovulacao", en: "/en/pregnancy" },
};

export default function LocaleSwitcher() {
  const pathname = usePathname() || "/pt";

  // Detect locale atual
  const isPT = pathname.startsWith("/pt");
  const isEN = pathname.startsWith("/en");

  // Remove o prefixo do locale para achar no mapa
  const slug = pathname.replace(/^\/(pt|en)/, "") || "";

  const entry = routeMap[slug] ?? routeMap[""];

  const ptHref = entry.pt;
  const enHref = entry.en;

  return (
    <div className="text-xs flex gap-2">
      <Link
        href={ptHref}
        className={isPT ? "underline font-semibold" : "underline text-gray-500"}
      >
        PT
      </Link>
      <span>·</span>
      <Link
        href={enHref}
        className={isEN ? "underline font-semibold" : "underline text-gray-500"}
      >
        EN
      </Link>
    </div>
  );
}
