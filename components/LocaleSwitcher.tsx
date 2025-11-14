"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Lista de rotas equivalentes PT <-> EN
const routes: { pt: string; en: string }[] = [
  { pt: "/pt", en: "/en" },
  { pt: "/pt/idade-pets", en: "/en/pet-age" },
  { pt: "/pt/imc", en: "/en/bmi" },
  // Se adicionar novas páginas, é só colocar aqui:
  // { pt: "/pt/alguma-coisa", en: "/en/some-page" },
];

export default function LocaleSwitcher() {
  const pathname = usePathname() || "/pt";

  const isPT = pathname.startsWith("/pt");
  const isEN = pathname.startsWith("/en");

  // Descobre qual par de rotas corresponde à página atual
  const current =
    routes.find((r) => r.pt === pathname || r.en === pathname) ?? routes[0];

  const ptHref = current.pt;
  const enHref = current.en;

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
