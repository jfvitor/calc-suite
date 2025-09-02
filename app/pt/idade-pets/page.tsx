import CalculatorShell from '@/components/CalculatorShell';
import { JsonLd } from '@/components/Seo';
import { calculatorSchema, faqSchema } from '@/lib/schema';
import { faqs } from '@/lib/faqs';

export const metadata = { title: 'Idade de Pets — PT' };
export default function Page() {
  const faq = faqs.pets_pt;
  return (
    <>
      <JsonLd json={calculatorSchema({ name: 'Idade de Pets', description: 'Calcule a idade humana do seu cão/gato.', url: 'https://seusite.com/pt/idade-pets' })} />
      <JsonLd json={faqSchema(faq)} />
      <CalculatorShell
        title={'Idade de Pets (Cão/Gato)'}
        subtitle={'Informe dados básicos para estimar a idade humana equivalente.'}
        heroEmoji={'🐾'}
        form={<Form />}
        result={<Result />}
        faq={<Faq items={faq} />}
      />
    </>
  );
}

function Form() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <span className="block mb-1">Espécie</span>
        <select className="w-full border rounded-lg p-2">
          <option>Cão</option>
          <option>Gato</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1">Data de nascimento</span>
        <input type="date" className="w-full border rounded-lg p-2" />
      </label>
      <label className="text-sm">
        <span className="block mb-1">Porte</span>
        <select className="w-full border rounded-lg p-2">
          <option>Pequeno</option>
          <option>Médio</option>
          <option>Grande</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1">Raça (opcional)</span>
        <input type="text" className="w-full border rounded-lg p-2" placeholder="Ex.: Labrador" />
      </label>
    </form>
  );
}
function Result() { return <div className="text-sm text-gray-600">O resultado aparecerá aqui…</div>; }
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
