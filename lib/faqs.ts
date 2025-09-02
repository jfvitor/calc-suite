export const faqs = {
  pets_pt: [
    { q: 'O cálculo é preciso?', a: 'É uma estimativa com base em heurísticas por porte/espécie. Consulte o veterinário para avaliações de saúde.' },
    { q: 'Raça influencia?', a: 'Sim, expectativa de vida varia por raça. Ajustamos quando possível.' },
  ],
  imc_pt: [
    { q: 'IMC serve para atletas?', a: 'IMC é limitado para quem tem muita massa muscular. Use como triagem, não diagnóstico.' },
  ],
  gravidez_pt: [
    { q: "O que é DUM?", a: "DUM é a data do início da sua última menstruação. Usamos a DUM para estimar a DPP aplicando a regra de Naegele (≈ 40 semanas)." },
    { q: "Meu ciclo não é de 28 dias. E agora?", a: "Você pode informar a duração média do seu ciclo. Ajustamos a estimativa da DPP e da ovulação com base nisso." },
    { q: "Posso usar a data de concepção?", a: "Sim. Se você souber a data de concepção, a DPP é estimada como concepção + 266 dias." },
    { q: "Quão precisa é a estimativa?", a: "É uma referência. Cada gestação é única, e exames/consultas médicas refinam a data mais adequada." },
    { q: "Tenho ciclos irregulares. Isso afeta?", a: "Sim, pode reduzir a precisão da DPP/ovulação. Use a faixa como guia e confirme com seu/ sua obstetra." },
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
