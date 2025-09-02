export const faqs = {
  pets_pt: [
    { q: 'O cálculo é preciso?', a: 'É uma estimativa com base em heurísticas por porte/espécie. Consulte o veterinário para avaliações de saúde.' },
    { q: 'Raça influencia?', a: 'Sim, expectativa de vida varia por raça. Ajustamos quando possível.' },
  ],
  imc_pt: [
    { q: 'IMC serve para atletas?', a: 'IMC é limitado para quem tem muita massa muscular. Use como triagem, não diagnóstico.' },
  ],
  preg_pt: [
    { q: 'É um diagnóstico médico?', a: 'Não. Use como referência e consulte um profissional de saúde.' },
  ],

  pets_en: [
    { q: 'Is the calculation accurate?', a: 'It is an estimate based on species/size heuristics. Consult your vet for health advice.' },
  ],
  imc_en: [
    { q: 'Is BMI good for athletes?', a: 'BMI can be misleading for high muscle mass individuals. Treat as a screening tool.' },
  ],
  preg_en: [
    { q: 'Is this medical advice?', a: 'No. This is informational only; consult a healthcare provider.' },
  ],
} as const;
