export default function Home() {
  const cards = [
    { href: '/pt/idade-pets', title: 'Idade de Pets', desc: 'Calcule idade humana do seu cão/gato.', icon: '/icons/paw.svg' },
    { href: '/pt/imc', title: 'IMC', desc: 'Índice de Massa Corporal, metas e TDEE (breve).', icon: '/icons/bmi.svg' },
    { href: '/pt/gravidez-ovulacao', title: 'Gravidez', desc: 'Data provável do parto e janela fértil.', icon: '/icons/pregnancy.svg' }
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {cards.map((c) => (
        <a key={c.href} href={c.href} className="group bg-white border rounded-2xl p-5 hover:shadow transition">
          <div className="flex items-center gap-3">
            <img src={c.icon} alt="" className="w-8 h-8" />
            <h2 className="text-lg font-semibold group-hover:underline">{c.title}</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
        </a>
      ))}
    </div>
  );
}
