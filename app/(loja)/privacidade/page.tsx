import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { marca } from "@/lib/marca";

export const metadata: Metadata = { title: "Privacidade" };

export default function Privacidade() {
  return (
    <Legal titulo="Privacidade">
      <p>Esta página explica que dados pedimos quando faz uma encomenda na {marca.nome} e para que os usamos.</p>
      <h2>Que dados guardamos</h2>
      <ul>
        <li>Nome, telefone, email (se o indicar), localização e endereço de entrega.</li>
        <li>As encomendas que fez: peças, valores, forma de entrega e estado.</li>
      </ul>
      <h2>Para que servem</h2>
      <ul>
        <li>Preparar e entregar as suas encomendas e dar-lhe notícias do estado de cada uma.</li>
        <li>Responder às suas mensagens e, se quiser, avisá-la de novidades pelo WhatsApp.</li>
      </ul>
      <p>Não vendemos nem partilhamos os seus dados com terceiros, excepto com quem faz a entrega da sua encomenda.</p>
      <h2>No seu telemóvel</h2>
      <p>O site guarda no seu navegador o carrinho e os dados da última encomenda, para não ter de os escrever outra vez. Pode apagá-los limpando os dados do navegador.</p>
      <h2>Os seus direitos</h2>
      <p>Pode pedir para ver, corrigir ou apagar os seus dados pelo WhatsApp {marca.whatsappVisivel}.</p>
    </Legal>
  );
}
