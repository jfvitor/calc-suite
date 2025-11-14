import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import ImcCalculator from "./ImcCalculator";

export const metadata = {
  title: "BMI Calculator — SuiteCálculo",
  description:
    "Calculate your Body Mass Index (BMI) quickly and easily with the online BMI calculator from SuiteCálculo.",
};

export default function Page() {
  const faq = faqs.imc_en;

  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "BMI Calculator — SuiteCálculo",
          description:
            "Use the SuiteCálculo BMI Calculator to find out your Body Mass Index and see which category you fall into.",
          url: "https://www.suitecalculo.com/en/bmi",
        })}
      />
      <JsonLd json={faqSchema(faq)} />

      <ImcCalculator
        faq={faq}
        labels={{
          dataTitle: "Inputs",
          resultTitle: "Result",
          faqTitle: "FAQ",
        }}
      />
    </>
  );
}
