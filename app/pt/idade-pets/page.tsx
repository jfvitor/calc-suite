import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import PetCalculator from "./PetCalculator";

export const metadata = { title: "Idade de Pets — PT" };

export default function Page() {
  const faq = faqs.pets_pt;
  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Idade de Pets",
          description: "Calcule a idade humana do seu cão/gato.",
          url: "https://seusite.com/pt/idade-pets",
        })}
      />
      <JsonLd json={faqSchema(faq)} />
      <PetCalculator faq={faq} />
    </>
  );
}
