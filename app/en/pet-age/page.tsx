import CalculatorShell from '@/components/CalculatorShell';
import { JsonLd } from '@/components/Seo';
import { calculatorSchema, faqSchema } from '@/lib/schema';
import { faqs } from '@/lib/faqs';
export const metadata = { title: 'Pet Age — EN' };
export default function Page() {
  const faq = faqs.pets_en;
  return (
    <>
      <JsonLd json={calculatorSchema({ name: 'Pet Age', description: 'Estimate human age equivalent.', url: 'https://seusite.com/en/pet-age' })} />
      <JsonLd json={faqSchema(faq)} />
      <CalculatorShell title={'Pet Age (Dog/Cat)'} subtitle={'Enter basic data to estimate a human age equivalent.'} heroEmoji={'🐾'} form={<Form />} result={<Result />} faq={<Faq items={faq} />} />
    </>
  );
}
function Form() { return <div className="text-sm">Form goes here…</div>; }
function Result() { return <div className="text-sm text-gray-600">Result here…</div>; }
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
