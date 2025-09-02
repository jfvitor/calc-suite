import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import ImcCalculator from "./ImcCalculator";


export const metadata = { title: "Calculadora de IMC — PT" };


export default function Page() {
  const faq = faqs.imc_pt;
  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Calculadora de IMC",
          description: "Calcule o Índice de Massa Corporal de forma simples.",
          url: "https://seusite.com/pt/imc",
        })}
      />
      <JsonLd json={faqSchema(faq)} />
      <ImcCalculator faq={faq} />
    </>
  );
}