export const metadata = {
  title: "SuiteCálculo — Online Calculators",
  description:
    "Use our simple Pet Age and BMI calculators to get quick, reliable results without distractions.",
};

export default function Home() {
  const cards = [
    {
      href: "/en/pet-age",
      title: "Pet Age",
      desc: "Convert your dog’s or cat’s age into human years.",
      icon: "/icons/paw.svg",
    },
    {
      href: "/en/bmi",
      title: "BMI",
      desc: "Calculate your Body Mass Index and see your category.",
      icon: "/icons/bmi.svg",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header / intro for UX and SEO */}
      <section className="space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          SuiteCálculo — simple calculators for everyday questions
        </h1>
        <p className="text-gray-700 max-w-prose">
          Quickly check your BMI or estimate your pet’s age in human years with
          clear, easy-to-use tools. No sign-up, no clutter — just the numbers
          you need.
        </p>
      </section>

      {/* Calculator grid */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="group bg-white border rounded-2xl p-5 hover:shadow transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <img src={c.icon} alt="" className="w-8 h-8" />
                <h2 className="text-lg font-semibold group-hover:underline">
                  {c.title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
            </div>
            <span className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              Open calculator →
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
