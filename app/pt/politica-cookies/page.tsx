import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Cookies" };

export default function Page(): JSX.Element {
  return (
    <main className="prose prose-indigo max-w-3xl mx-auto p-6">
      <h1>Política de Cookies</h1>
      <p>
        Utilizamos cookies para garantir o funcionamento do site e, opcionalmente, para estatísticas e publicidade,
        conforme o seu consentimento.
      </p>

      <h2>Tipos de cookies</h2>
      <ul>
        <li>
          <strong>Essenciais:</strong> necessários para funcionalidades básicas (autenticação, segurança, preferências).
        </li>
        <li>
          <strong>Analytics (opcional):</strong> ajudam a melhorar o site de forma agregada.
        </li>
        <li>
          <strong>Publicidade (opcional):</strong> permitem anúncios e medição de performance/publicidade.
        </li>
      </ul>

      <h2>Como gerir o consentimento</h2>
      <p>
        Você pode alterar as suas escolhas a qualquer momento clicando em <em>“Gerir cookies”</em> no rodapé. Um gestor
        de preferências (CMP) será aberto para permitir ativar/desativar categorias.
      </p>

      <h2>Mais informações</h2>
      <p>
        Para monetização no EEE/Reino Unido utilizamos um CMP certificado (IAB TCF) e Google Consent Mode v2. Fora do
        EEE/UK, aplicamos as exigências locais (por ex., LGPD no Brasil).
      </p>
    </main>
  );
}
