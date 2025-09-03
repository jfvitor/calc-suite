"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function LocaleSwitcher() {
  const path = usePathname() || "/pt";
  const en = path.replace(/^\/pt(?=\/|$)/, "/en");
  const pt = path.replace(/^\/en(?=\/|$)/, "/pt");
  return (
    <div className="text-xs flex gap-2">
      <Link href={pt} className="underline">PT</Link>
      <span>·</span>
      <Link href={en} className="underline">EN</Link>
    </div>
  );
}
