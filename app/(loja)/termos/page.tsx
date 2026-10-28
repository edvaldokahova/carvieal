import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { marca } from "@/lib/marca";

export const metadata: Metadata = { title: "Termos, entregas e trocas" };

export default function Termos() {
  return (
    <Legal titulo="Termos, entregas e trocas">
      <p>A loja online {marca.nome} é propriedade de {marca.dona}, com actividade em {marca.cidade}. Ao fazer uma encomenda no site, aceita as condições abaixo.</p>
      <h2>Encomendas</h2>
      <ul>
        <li>A encomenda fica registada quando a conclui no site e recebe um código (por exemplo, CV-3F9A21).</li>
        <li>A encomenda é confirmada depois de verificarmos o pagamento e a disponibilidade das peças.</li>
        <li>Se uma peça deixar de estar disponível, contactamo-la para trocar a peça ou devolver o valor pago.</li>
      </ul>
      <h2>Preços e pagamento</h2>
      <ul>
        <li>Os preços estão em kwanzas (Kz). A taxa de entrega aparece antes de concluir a encomenda.</li>
        <li>Neste momento o pagamento é feito por transferência ou Multicaixa Express, com envio do comprovativo pelo WhatsApp {marca.whatsappVisivel}.</li>
        <li>Encomendas pendentes sem pagamento durante 48 horas podem ser canceladas.</li>
      </ul>
      <h2>Entregas</h2>
      <ul>
        <li>Entregamos em casa, em Luanda, pelo nosso serviço de motoboy. Os prazos e taxas de cada modalidade aparecem no passo de finalização.</li>
        <li>Para outras províncias, o envio é feito por transportadora e combinado pelo WhatsApp.</li>
        <li>Pode acompanhar o estado da encomenda em «Acompanhar encomenda».</li>
      </ul>
      <h2>Trocas</h2>
      <ul>
        <li>Pode pedir a troca até 7 dias depois de receber a encomenda, com a peça sem uso e na embalagem original.</li>
        <li>Por razões de higiene, brincos só são trocados em caso de defeito de fabrico.</li>
        <li>Para pedir uma troca, escreva-nos no WhatsApp com o código da encomenda.</li>
      </ul>
      <h2>Contacto</h2>
      <p>WhatsApp {marca.whatsappVisivel}.</p>
    </Legal>
  );
}
