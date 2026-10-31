import type { Metadata } from "next";
import Link from "next/link";
import Foto from "@/components/Foto";
import BotaoEstojo from "@/components/BotaoEstojo";
import { obterEstojos } from "@/lib/presente";
import { kz } from "@/lib/formato";
import DetalhesProduto from "@/components/DetalhesProduto";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Embalagem Especial para Oferecer",
  description: "Estojos Carvieal para oferecer a tua peça em prata 925: um para anéis e outro para brincos, colares e pulseiras.",
  alternates: { canonical: "/presente" },
};

export default async function Presente() {
  const { anel, joias } = await obterEstojos();
  const modelos = [
    { e: anel, titulo: "Estojo para anel", texto: "Mini estojo em tom taupe, para um anel ou um par de brincos pequenos.", img: "/img/estojo-anel.webp" },
    { e: joias, titulo: "Estojo para brincos, colares e pulseiras", texto: "Serve para brincos, colares e pulseiras.", img: "/img/estojo-joias.webp" },
  ];
  return (
    <div className="pb-24">
      <section className="caixa grid gap-10 pt-8 sm:pt-14 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative mx-auto aspect-[4/3] w-[88%] max-w-[480px] overflow-hidden bg-avela-pale md:w-full">
          <Foto src="/img/estojo.webp" alt="Estojos Carvieal para presente" sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>
        <div className="max-w-md">
          <h1 className="titulo text-[36px] sm:text-[48px]">Embalagem Especial para Oferecer</h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-tinta/75">
            <p>Para tornar o momento de oferecer ainda mais especial, podes adicionar à tua encomenda um estojo Carvieal, cuidadosamente selecionado para apresentar a tua joia.</p>
            <p>A embalagem especial é opcional. Todas as encomendas incluem a embalagem habitual da Carvieal.</p>
            <p>Podes adicionar o estojo na página de cada peça ou diretamente no carrinho.</p>
          </div>
        </div>
      </section>

      <section className="caixa mt-16 grid max-w-3xl gap-12 sm:grid-cols-2 sm:gap-8">
        {modelos.map((m) => (
          <div key={m.titulo} className="mx-auto w-full max-w-[300px] sm:max-w-none">
            <div className="relative aspect-square overflow-hidden bg-avela-pale">
              <Foto src={m.e?.imagem || m.img} alt={m.titulo} sizes="(min-width: 640px) 40vw, 100vw" />
            </div>
            <h2 className="mt-5 text-[13px] font-medium uppercase tracking-[.08em] text-tinta">{m.titulo}</h2>
            <p className="mt-1 text-[14px] text-tinta/60">{m.texto}</p>
            {m.e ? (
              <>
                <p className="mt-3 text-[16px] text-tinta">+ {kz(m.e.preco)}</p>
                <BotaoEstojo estojo={m.e} />
                {(m.e.descricao || m.e.detalhes) && (
                  <details className="group mt-5 border-y border-choco/15 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] text-tinta">
                      Detalhes do produto
                      <span className="text-xl font-light text-choco transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 text-[14px] leading-relaxed text-tinta/70">
                      <DetalhesProduto descricao={m.e.descricao} caracteristicas={m.e.detalhes} />
                    </div>
                  </details>
                )}
              </>
            ) : (
              <p className="mt-3 text-[14px] text-tinta/55">Esgotado de momento.</p>
            )}
          </div>
        ))}
      </section>

      <div className="caixa mt-12">
        <Link href="/loja" className="link text-[14px] text-choco">Descobrir a coleção</Link>
      </div>
    </div>
  );
}
