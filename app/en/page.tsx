export const metadata = {
    title: "Calc Suite — Calculators",
    description: "Choose a calculator: Pet Age, BMI and Pregnancy/Ovulation.",
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
            desc: "Body Mass Index calculator, goals and TDEE (coming soon).",
            icon: "/icons/bmi.svg",
        },
        {
            href: "/en/pregnancy",
            title: "Pregnancy",
            desc: "Estimated due date and fertile window.",
            icon: "/icons/pregnancy.svg",
        },
    ];

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8">Calc Suite</h1>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {cards.map((c) => (
                    <a
                        key={c.href}
                        href={c.href}
                        className="group bg-white border rounded-2xl p-5 hover:shadow transition"
                    >
                        <div className="flex items-center gap-3">
                            <img src={c.icon} alt="" className="w-8 h-8" />
                            <h2 className="text-lg font-semibold group-hover:underline">
                                {c.title}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
                    </a>
                ))}
            </div>
        </main>
    );
}
