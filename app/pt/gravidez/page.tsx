import { JsonLd } from "@/components/Seo";
import { calculatorSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import GravidezCalculator from "./GravidezCalculator";

export const metadata = { title: "Calculadora de Gravidez e Ovulação — PT" };

export default function Page() {
  const faq = faqs.gravidez_pt;
  return (
    <>
      <JsonLd
        json={calculatorSchema({
          name: "Calculadora de Gravidez e Ovulação",
          description:
            "Estime a data provável do parto e a ovulação/janela fértil com base na DUM ou data de concepção.",
          url: "https://seusite.com/pt/gravidez",
        })}
      />
      <JsonLd json={faqSchema(faq)} />
      <GravidezCalculator faq={faq} />
    </>
  );
}
