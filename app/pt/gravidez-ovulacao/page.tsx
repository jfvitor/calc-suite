import CalculatorShell from '@/components/CalculatorShell';
import { JsonLd } from '@/components/Seo';
import { calculatorSchema, faqSchema } from '@/lib/schema';
import { faqs } from '@/lib/faqs';
export const metadata = { title: 'Gravidez e Ovulação — PT' };
export default function Page() {
  const faq = faqs.preg_pt;
  return (
    <>
      <JsonLd json={calculatorSchema({ name: 'Gravidez e Ovulação', description: 'Cálculo de data provável do parto e janela fértil.', url: 'https://seusite.com/pt/gravidez-ovulacao' })} />
      <JsonLd json={faqSchema(faq)} />
      <CalculatorShell title={'Gravidez e Ovulação'} subtitle={'Cálculos informativos — não substitui aconselhamento médico.'} heroEmoji={'🤰'} form={<Form />} result={<Result />} faq={<Faq items={faq} />} />
    </>
  );
}
function Form() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <span className="block mb-1">Data do último período</span>
        <input type="date" className="w-full border rounded-lg p-2" />
      </label>
      <label className="text-sm">
        <span className="block mb-1">Ciclo médio (dias)</span>
        <input type="number" className="w-full border rounded-lg p-2" placeholder="28" />
      </label>
    </form>
  );
}
function Result() { return <div className="text-sm text-gray-600">Janela fértil e DPP aparecerão aqui…</div>; }
function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <ul className="text-sm text-gray-700 space-y-2">
      {items.map((it) => (
        <li key={it.q}>
          <p className="font-medium">{it.q}</p>
          <p className="text-gray-600">{it.a}</p>
        </li>
      ))}
    </ul>
  );
}
