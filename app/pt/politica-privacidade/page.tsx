export const metadata = { title: "Política de Privacidade" };

export default function Page() {
  return (
    <main className="prose prose-indigo max-w-3xl mx-auto p-6">
      <h1>Política de Privacidade</h1>
      <p>
        Valorizamos a sua privacidade. Esta política explica como tratamos dados quando você utiliza nossas
        calculadoras (idade de pets, IMC e gravidez/ovulação).
      </p>

      <h2>Que dados coletamos</h2>
      <ul>
        <li>
          <strong>Dados inseridos nos formulários</strong> (ex.: datas, altura, peso) — processados no seu navegador,
          sem envio ao servidor.
        </li>
        <li>
          <strong>Cookies essenciais</strong> — necessários para o funcionamento do site.
        </li>
        <li>
          <strong>Cookies opcionais</strong> (analytics e/ou publicidade) — ativados apenas com o seu consentimento.
        </li>
      </ul>

      <h2>Base legal</h2>
      <p>
        Utilizamos consentimento para cookies não-essenciais e legítimo interesse/execução de contrato para o restante,
        conforme aplicável.
      </p>

      <h2>Partilha com terceiros</h2>
      <p>
        Podemos utilizar serviços de terceiros para medição de audiência e/ou exibição de anúncios, apenas conforme o
        consentimento fornecido por você através do gestor de cookies (CMP).
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção ou eliminação dos seus dados e retirar o consentimento a qualquer momento.
        Para exercer direitos, utilize o contacto abaixo.
      </p>

      <h2>Contacto</h2>
      <p>Envie-nos um e-mail (substitua aqui pelo seu contacto oficial).</p>
    </main>
  );
}
