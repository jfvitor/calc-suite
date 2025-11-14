import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import ImcCalculator from "./ImcCalculator";

export const metadata = {
  title: "Calculadora de IMC — SuiteCálculo",
  description:
    "Calcule o seu Índice de Massa Corporal (IMC) de forma simples e rápida com a calculadora de IMC da SuiteCálculo.",
};

export default function Page() {
  const faq = faqs.imc_pt;

  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Calculadora de IMC — SuiteCálculo",
          description:
            "Use a calculadora de IMC da SuiteCálculo para descobrir o seu Índice de Massa Corporal e verificar em que faixa você se encontra.",
          url: "https://www.suitecalculo.com/pt/imc",
        })}
      />
      <JsonLd json={faqSchema(faq)} />
      <ImcCalculator faq={faq} />
    </>
  );
}
