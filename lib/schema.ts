export function calculatorSchema(args: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: args.name,
    description: args.description,
    url: args.url,
    applicationCategory: 'BusinessApplication',
  };
}

// ✅ aceitar ReadonlyArray e undefined/null
export function faqSchema(
  faq: ReadonlyArray<{ q: string; a: string }> | undefined | null
) {
  const list = Array.isArray(faq) ? Array.from(faq) : []; // copia sem mutar
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
