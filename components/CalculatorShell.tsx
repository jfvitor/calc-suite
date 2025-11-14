import AdSlot from "@/components/AdSlot";
import type { ReactNode } from "react";

type CalculatorShellLabels = {
  dataTitle?: string;
  resultTitle?: string;
  faqTitle?: string;
};

type CalculatorShellProps = {
  title: string;
  subtitle: string;
  heroEmoji: string;
  form: ReactNode;
  result: ReactNode;
  faq: ReactNode;
  compact?: boolean; // Quando true, oculta AdSlots e reduz espaçamentos
  labels?: CalculatorShellLabels;
};

export default function CalculatorShell({
  title,
  subtitle,
  heroEmoji,
  form,
  result,
  faq,
  compact = false,
  labels,
}: CalculatorShellProps) {
  const dataTitle = labels?.dataTitle ?? "Dados";
  const resultTitle = labels?.resultTitle ?? "Resultado";
  const faqTitle = labels?.faqTitle ?? "FAQ";

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className="rounded-2xl p-6 bg-white border flex items-start gap-4">
        <div className="text-3xl" aria-hidden>
          {heroEmoji}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>

      {!compact && <AdSlot />}

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <section className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold mb-3">{dataTitle}</h2>
            {form}
          </section>

          <section className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold mb-3">{resultTitle}</h2>
            {result}
          </section>
        </div>

        <aside className="md:col-span-2 space-y-6">
          <section className="bg-white border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">{faqTitle}</h3>
            {faq}
          </section>
          {!compact && <AdSlot />}
        </aside>
      </div>
    </div>
  );
}
