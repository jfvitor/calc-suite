import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import PetCalculator from "./PetCalculator";

export const metadata = {
  title: "Pet Age Calculator — SuiteCálculo",
  description:
    "Convert your dog or cat’s age into human years with the Pet Age Calculator from SuiteCálculo.",
};

export default function Page() {
  const faq = faqs.pets_en;

  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Pet Age Calculator — SuiteCálculo",
          description:
            "Quickly estimate your dog or cat’s age in human years using the Pet Age Calculator from SuiteCálculo.",
          url: "https://www.suitecalculo.com/en/pet-age",
        })}
      />
      <JsonLd json={faqSchema(faq)} />

      {/* Passando labels EN para dentro do PetCalculator */}
      <PetCalculator
        faq={faq}
        labels={{
          dataTitle: "Inputs",
          resultTitle: "Result",
          faqTitle: "FAQ"
        }}
      />
    </>
  );
}
