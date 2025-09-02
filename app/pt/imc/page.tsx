import CalculatorShell from '@/components/CalculatorShell';
import { JsonLd } from '@/components/Seo';
import { calculatorSchema, faqSchema } from '@/lib/schema';
import { faqs } from '@/lib/faqs';
export const metadata = { title: 'IMC — PT' };
export default function Page() {
  const faq = faqs.imc_pt;
  return (
    <>
      <JsonLd json={calculatorSchema({ name: 'IMC', description: 'Calculadora de IMC.', url: 'https://seusite.com/pt/imc' })} />
      <JsonLd json={faqSchema(faq)} />
      <CalculatorShell title={'Calculadora de IMC'} subtitle={'Descubra seu IMC e faixas.'} heroEmoji={'💪'} form={<Form />} result={<Result />} faq={<Faq items={faq} />} />
    </>
  );
}
function Form() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <span className="block mb-1">Altura (cm)</span>
        <input type="number" className="w-full border rounded-lg p-2" placeholder="170" />
      </label>
      <label className="text-sm">
        <span className="block mb-1">Peso (kg)</span>
        <input type="number" className="w-full border rounded-lg p-2" placeholder="65" />
      </label>
    </form>
  );
}
function Result() { return <div className="text-sm text-gray-600">Seu IMC aparecerá aqui…</div>; }
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
