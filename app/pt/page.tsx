export default function Home() {
  const cards = [
    {
      href: '/pt/idade-pets',
      title: 'Idade de Pets',
      desc: 'Descubra a idade humana aproximada do seu cão ou gato.',
      icon: '/icons/paw.svg'
    },
    {
      href: '/pt/imc',
      title: 'IMC',
      desc: 'Calcule seu Índice de Massa Corporal e veja sua classificação.',
      icon: '/icons/bmi.svg'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header de contexto para UX e SEO */}
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold">
          SuiteCálculo — calculadoras simples e rápidas para o dia a dia
        </h1>
        <p className="text-gray-700 max-w-prose">
          Use as nossas ferramentas para obter cálculos essenciais de forma clara e confiável.
          Sem anúncios intrusivos, sem confusão — apenas o que você precisa.
        </p>
      </header>

      {/* Grid de calculadoras */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="group bg-white border rounded-2xl p-5 hover:shadow transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                {/* Ícone corrigido */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src={c.icon}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <h2 className="text-lg font-semibold group-hover:underline">{c.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
            </div>
            <span className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              Abrir calculadora →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
