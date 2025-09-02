export const LANGS = ['pt','en'] as const;
export type Lang = typeof LANGS[number];
export function t(lang: Lang, key: string): string {
  const dict: Record<string, Record<string,string>> = {
    pt: {
      pets_title: 'Idade de Pets (Cão/Gato)',
      pets_sub: 'Calcule a idade humana aproximada e expectativa de vida.',
      imc_title: 'Calculadora de IMC',
      imc_sub: 'Descubra seu IMC e faixas recomendadas.',
      preg_title: 'Gravidez e Ovulação',
      preg_sub: 'Calcule a data provável do parto e janela fértil.',
    },
    en: {
      pets_title: 'Pet Age (Dog/Cat)',
      pets_sub: 'Estimate human age equivalent and life expectancy.',
      imc_title: 'BMI Calculator',
      imc_sub: 'Find your BMI and target ranges.',
      preg_title: 'Pregnancy & Ovulation',
      preg_sub: 'Estimated due date and fertile window.',
    }
  };
  return dict[lang]?.[key] ?? key;
}
