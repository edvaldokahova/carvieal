import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { marca } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Que dados pessoais a Carvieal recolhe, para que os utiliza e como podes exercer os teus direitos.",
  alternates: { canonical: "/privacidade" },
};

const B = ({ children }: { children: React.ReactNode }) => <strong className="font-medium text-tinta">{children}</strong>;

export default function Privacidade() {
  return (
    <Legal titulo="Política de Privacidade">
      <p>Na {marca.nome}, respeitamos a tua privacidade e tratamos os teus dados pessoais com responsabilidade.</p>
      <p>Esta política explica quais os dados que recolhemos quando visitas a nossa loja online ou realizas uma encomenda, para que os utilizamos e como podes exercer os teus direitos.</p>

      <h2>1. Que dados recolhemos?</h2>
      <p>Consoante a tua interação com a nossa loja, poderemos recolher os seguintes dados:</p>
      <ul>
        <li><B>Dados de identificação:</B> nome e apelido.</li>
        <li><B>Dados de contacto:</B> número de telefone e endereço de e-mail, quando fornecido.</li>
        <li><B>Dados de entrega:</B> morada e outras informações necessárias para a entrega da encomenda.</li>
        <li><B>Dados da encomenda:</B> artigos adquiridos, valores, método de entrega e estado do pedido.</li>
        <li><B>Dados de pagamento:</B> informações necessárias para confirmar o pagamento. Os comprovativos enviados por WhatsApp poderão ser utilizados para validar a transação.</li>
      </ul>
      <p>A {marca.nome} não solicita palavras-passe bancárias, códigos secretos ou PINs de cartões para confirmar pagamentos.</p>

      <h2>2. Para que utilizamos os teus dados?</h2>
      <p>Utilizamos os teus dados para:</p>
      <ul>
        <li>Registar, confirmar, preparar e entregar as tuas encomendas.</li>
        <li>Confirmar pagamentos e prestar informações sobre o estado dos pedidos.</li>
        <li>Responder a perguntas e prestar apoio ao cliente.</li>
        <li>Gerir pedidos de troca, devolução ou reclamação.</li>
        <li>Melhorar a experiência de utilização da nossa loja online.</li>
        <li>Enviar novidades, lançamentos e promoções, quando aplicável e de acordo com as tuas preferências e a legislação.</li>
      </ul>
      <p>As comunicações promocionais não são necessárias para realizar uma compra. Poderás solicitar a sua interrupção.</p>

      <h2>3. Com quem partilhamos os teus dados?</h2>
      <p>A {marca.nome} não vende os teus dados pessoais.</p>
      <p>Poderemos partilhar os dados estritamente necessários com prestadores de serviços que nos ajudam a operar a loja, processar pagamentos, gerir encomendas ou realizar entregas.</p>
      <p>Por exemplo, os dados de contacto e a morada poderão ser disponibilizados ao serviço de motoboy ou à transportadora responsável pela entrega.</p>
      <p>Os dados também poderão ser comunicados quando tal for exigido por lei ou por uma autoridade competente.</p>
      <p>Procuramos limitar a partilha ao necessário para a finalidade em causa.</p>

      <h2>4. Como protegemos os teus dados?</h2>
      <p>Adotamos medidas razoáveis para proteger os dados pessoais contra o acesso não autorizado, a perda, a alteração ou a divulgação indevida.</p>
      <p>O acesso aos dados das encomendas deverá ser limitado às pessoas e aos serviços que necessitem dessas informações para desempenhar as suas funções.</p>
      <p>Apesar destas medidas, nenhum sistema de transmissão ou armazenamento de dados pode garantir segurança absoluta.</p>

      <h2>5. Por quanto tempo guardamos os teus dados?</h2>
      <p>Conservamos os dados pessoais apenas durante o período necessário para cumprir as finalidades para as quais foram recolhidos, gerir encomendas, resolver reclamações e cumprir eventuais obrigações legais.</p>
      <p>Quando os dados deixarem de ser necessários, serão eliminados ou tratados de forma adequada, salvo quando a sua conservação for legalmente exigida.</p>

      <h2>6. Cookies e dados guardados no dispositivo</h2>
      <p>A nossa loja online poderá utilizar cookies ou tecnologias semelhantes para permitir o funcionamento do site, conservar informações do carrinho e melhorar a experiência de navegação.</p>
      <p>O navegador também poderá guardar informações relativas à tua utilização da loja, como os artigos adicionados ao carrinho ou dados introduzidos anteriormente.</p>
      <p>Poderás gerir ou eliminar os dados guardados através das definições do teu navegador. A desativação de determinados cookies poderá afetar algumas funcionalidades da loja.</p>

      <h2>7. Os teus direitos</h2>
      <p>Nos termos da legislação aplicável, poderás ter o direito de solicitar:</p>
      <ul>
        <li>Acesso aos teus dados pessoais.</li>
        <li>Correção de dados incorretos ou desatualizados.</li>
        <li>Eliminação dos dados, quando legalmente aplicável.</li>
        <li>Informações sobre a utilização dos teus dados.</li>
        <li>Oposição a determinadas formas de tratamento, quando aplicável.</li>
        <li>Interrupção das comunicações promocionais.</li>
      </ul>
      <p>Alguns pedidos poderão estar sujeitos a limitações legais, nomeadamente quando determinados dados tenham de ser conservados para cumprir obrigações legais.</p>

      <h2>8. Privacidade e WhatsApp</h2>
      <p>A {marca.nome} utiliza o WhatsApp como um dos seus canais de comunicação com os clientes.</p>
      <p>As mensagens e os comprovativos enviados através dessa plataforma poderão conter informações pessoais utilizadas para confirmar pagamentos, responder a questões e gerir encomendas.</p>
      <p>A utilização do WhatsApp está igualmente sujeita às condições e à política de privacidade do respetivo fornecedor.</p>
      <p>Recomendamos que envies apenas as informações necessárias para tratar do teu pedido.</p>

      <h2>9. Alterações a esta política</h2>
      <p>A {marca.nome} poderá atualizar esta política para refletir alterações nos seus serviços, nas funcionalidades da loja ou nas exigências legais.</p>
      <p>A versão mais recente estará disponível nesta página, acompanhada da respetiva data de atualização.</p>

      <h2>10. Contacto</h2>
      <p>Se tiveres dúvidas sobre esta política ou pretenderes exercer os teus direitos relativamente aos teus dados pessoais, contacta-nos:</p>
      <p>WhatsApp: <a href={`https://wa.me/${marca.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link text-choco">{marca.whatsappVisivel}</a></p>
    </Legal>
  );
}
