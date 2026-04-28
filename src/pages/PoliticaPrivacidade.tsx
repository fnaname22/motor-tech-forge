import { Seo } from "@/components/seo/Seo";

const PoliticaPrivacidade = () => (
  <>
    <Seo title="Política de Privacidade — MotorTech Parts" description="Política de privacidade conforme LGPD: coleta, uso, armazenamento e direitos do titular dos dados." />
    <div className="container max-w-3xl py-10 prose prose-sm prose-neutral dark:prose-invert">
      <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider">Política de Privacidade</h1>
      <p className="text-muted-foreground text-sm">Última atualização: 28/04/2026</p>

      <h2>1. Quem somos</h2>
      <p>
        A <strong>MotorTech Parts</strong> (CNPJ 00.000.000/0001-00), com sede na Av. das Indústrias, 1000, São Paulo/SP, é a
        controladora dos dados pessoais coletados em www.motortechparts.com.br, em conformidade com a Lei Geral de Proteção
        de Dados (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>2. Quais dados coletamos</h2>
      <ul>
        <li><strong>Cadastro:</strong> nome completo, CPF, e-mail, telefone, senha (criptografada).</li>
        <li><strong>Endereço:</strong> CEP, rua, número, complemento, bairro, cidade, estado.</li>
        <li><strong>Pagamento:</strong> dados processados diretamente pelo Mercado Pago (não armazenamos dados de cartão).</li>
        <li><strong>Navegação:</strong> cookies, IP, páginas visitadas e dispositivo utilizado.</li>
      </ul>

      <h2>3. Como usamos seus dados</h2>
      <ul>
        <li>Processar pedidos, pagamentos e entregas.</li>
        <li>Enviar comunicações sobre seu pedido (status, rastreio).</li>
        <li>Enviar ofertas e novidades, somente com seu consentimento (newsletter).</li>
        <li>Cumprir obrigações legais e fiscais.</li>
        <li>Melhorar a experiência de navegação e segurança do site.</li>
      </ul>

      <h2>4. Compartilhamento de dados</h2>
      <p>
        Compartilhamos dados estritamente necessários com: <strong>Mercado Pago</strong> (pagamentos), <strong>Melhor Envio
        e transportadoras</strong> (entregas) e autoridades públicas quando exigido por lei. Nunca vendemos seus dados.
      </p>

      <h2>5. Armazenamento e segurança</h2>
      <p>
        Seus dados ficam em servidores seguros com criptografia em trânsito (SSL/TLS) e em repouso. Adotamos controles de
        acesso, monitoramento e backups regulares.
      </p>

      <h2>6. Seus direitos como titular (LGPD)</h2>
      <ul>
        <li>Confirmação da existência e acesso aos seus dados.</li>
        <li>Correção de dados incompletos ou desatualizados.</li>
        <li>Exclusão de dados pessoais tratados com base no consentimento.</li>
        <li>Portabilidade a outro fornecedor.</li>
        <li>Revogação do consentimento a qualquer momento.</li>
      </ul>
      <p>Para exercer seus direitos, envie e-mail para <strong>privacidade@motortechparts.com.br</strong>.</p>

      <h2>7. Cookies</h2>
      <p>
        Utilizamos cookies essenciais (necessários ao funcionamento), de desempenho (estatísticas anônimas) e de marketing
        (somente com consentimento). Você pode configurar suas preferências no banner de cookies ou nas configurações do navegador.
      </p>

      <h2>8. Alterações desta política</h2>
      <p>
        Esta política pode ser atualizada periodicamente. Recomendamos a revisão regular desta página.
      </p>

      <h2>9. Contato do Encarregado (DPO)</h2>
      <p>E-mail: <strong>dpo@motortechparts.com.br</strong></p>
    </div>
  </>
);

export default PoliticaPrivacidade;
