import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import PetCalculator from "./PetCalculator";

export const metadata = {
  title: "Idade de Pets — SuiteCálculo",
  description:
    "Calcule a idade humana aproximada do seu cão ou gato com a calculadora de idade de pets da SuiteCálculo.",
};

export default function Page() {
  const faq = faqs.pets_pt;

  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Calculadora de Idade de Pets — SuiteCálculo",
          description:
            "Descubra rapidamente a idade humana aproximada do seu cão ou gato usando a calculadora de idade de pets da SuiteCálculo.",
          url: "https://www.suitecalculo.com/pt/idade-pets",
        })}
      />
      <JsonLd json={faqSchema(faq)} />
      <PetCalculator faq={faq} />
    </>
  );
}
