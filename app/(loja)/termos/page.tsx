import type { Metadata } from "next";
import Link from "next/link";
import Legal from "@/components/Legal";
import { marca } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Termos, entregas e trocas",
  description: "Condições de encomenda, pagamento, entrega em Luanda e outras províncias, trocas e devoluções na Carvieal.",
  alternates: { canonical: "/termos" },
};

const B = ({ children }: { children: React.ReactNode }) => <strong className="font-medium text-tinta">{children}</strong>;

export default function Termos() {
  return (
    <Legal titulo="Termos, Entregas e Trocas" assinatura>
      <p>A {marca.nome} é uma marca de acessórios que opera em Luanda, Angola. Ao realizares uma encomenda através da nossa loja online, aplicam-se as condições descritas nesta página.</p>

      <h2>Encomendas</h2>
      <ul>
        <li><B>Registo da encomenda:</B> após concluíres o processo de compra no site, receberás um código de encomenda para identificação e acompanhamento do pedido.</li>
        <li><B>Confirmação:</B> a encomenda será confirmada após a verificação do pagamento e da disponibilidade dos artigos.</li>
        <li><B>Artigos indisponíveis:</B> caso algum artigo deixe de estar disponível após a realização da encomenda, entraremos em contacto para apresentar as opções possíveis, incluindo a substituição por outro artigo, mediante acordo, ou o reembolso do valor pago, quando aplicável.</li>
        <li><B>Informações do cliente:</B> é da responsabilidade do cliente fornecer os dados de contacto e de entrega corretos e completos.</li>
      </ul>

      <h2>Preços e pagamento</h2>
      <ul>
        <li><B>Moeda:</B> todos os preços são apresentados em kwanzas (Kz).</li>
        <li><B>Taxa de entrega:</B> o custo da entrega será apresentado antes da conclusão da encomenda.</li>
        <li><B>Métodos de pagamento:</B> atualmente, aceitamos pagamentos por transferência bancária ou Multicaixa Express.</li>
        <li><B>Comprovativo de pagamento:</B> após efetuares o pagamento, envia o comprovativo através do WhatsApp: {marca.whatsappVisivel}.</li>
        <li><B>Encomendas pendentes:</B> as encomendas sem pagamento confirmado durante 48 horas poderão ser canceladas. Caso necessites de mais tempo, contacta-nos para verificar a possibilidade de prolongar a reserva.</li>
      </ul>

      <h2>Entregas</h2>
      <p>Queremos que recebas as tuas peças {marca.nome} com a mesma atenção ao detalhe com que foram preparadas.</p>
      <ul>
        <li><B>Luanda:</B> realizamos entregas ao domicílio através do nosso serviço de motoboy. Os prazos e os custos são apresentados durante a finalização da encomenda.</li>
        <li><B>Outras províncias:</B> o envio é organizado através de uma transportadora, com condições e custos previamente acordados pelo WhatsApp.</li>
        <li><B>Acompanhamento:</B> poderás consultar o estado da tua encomenda através da funcionalidade <Link href="/acompanhar" className="link text-choco">«Acompanhar encomenda»</Link>.</li>
        <li><B>Receção da encomenda:</B> certifica-te de que os dados de entrega estão corretos e de que existe alguém disponível para receber o pedido.</li>
      </ul>
      <p>Os prazos de entrega são estimados e poderão variar em função da localização, da disponibilidade do serviço de transporte ou de circunstâncias imprevistas. Caso ocorra algum atraso relevante, procuraremos informar-te.</p>

      <h2>Trocas e devoluções</h2>
      <p>Queremos que a tua experiência com a {marca.nome} corresponda às tuas expectativas.</p>

      <h3>Pedidos de troca</h3>
      <p>Poderás solicitar uma troca no prazo de sete dias após a receção da encomenda, nas condições aplicáveis e sem prejuízo dos direitos previstos na legislação.</p>
      <p>Para que possamos analisar o pedido, recomendamos que o artigo:</p>
      <ul>
        <li>Não apresente sinais de utilização ou danos causados após a entrega.</li>
        <li>Seja acompanhado da embalagem original e dos acessórios recebidos.</li>
        <li>Seja identificado através do respetivo código de encomenda ou comprovativo de compra.</li>
      </ul>
      <p>A aceitação e o procedimento da troca dependerão da situação apresentada, da disponibilidade do artigo pretendido e dos direitos legalmente aplicáveis.</p>

      <h3>Brincos e artigos de uso pessoal</h3>
      <p>Por razões de higiene, os brincos poderão estar sujeitos a condições específicas de troca. Esta restrição não se aplica de forma a eliminar direitos legais do consumidor, nomeadamente em situações de defeito ou desconformidade.</p>

      <h3>Artigos defeituosos ou incorretos</h3>
      <p>Se receberes um artigo com defeito ou diferente do que encomendaste, contacta-nos através do WhatsApp, indicando o código da encomenda e, sempre que possível, enviando fotografias que permitam identificar o problema.</p>
      <p>Após a análise, apresentaremos uma solução adequada, de acordo com a situação e a legislação aplicável.</p>

      <h3>Devoluções e reembolsos</h3>
      <p>Os pedidos de devolução e os eventuais reembolsos serão tratados de acordo com os direitos e prazos previstos na legislação angolana.</p>
      <p>Nas compras à distância, aplicam-se, quando legalmente previstos, os direitos de desistência do consumidor, incluindo as condições estabelecidas na Lei n.º 15/03, de 22 de julho.</p>
      <p>Os custos associados ao transporte de devoluções serão determinados de acordo com a legislação aplicável e as circunstâncias do pedido.</p>

      <h2>Contacto</h2>
      <p>Para questões relacionadas com encomendas, pagamentos, entregas, trocas ou devoluções, entra em contacto connosco:</p>
      <p>WhatsApp: <a href={`https://wa.me/${marca.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link text-choco">{marca.whatsappVisivel}</a></p>
      <p>Estamos disponíveis para te ajudar.</p>
    </Legal>
  );
}
