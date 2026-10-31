import type { Metadata } from "next";
import Link from "next/link";
import Foto from "@/components/Foto";
import BotaoEstojo from "@/components/BotaoEstojo";
import { obterEstojos } from "@/lib/presente";
import { kz } from "@/lib/formato";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Embalagem Especial para Presente",
  description: "Estojos Carvieal para oferecer a tua peça em prata 925: um para anéis e outro para brincos, colares e pulseiras.",
  alternates: { canonical: "/presente" },
};

export default async function Presente() {
  const { anel, joias } = await obterEstojos();
  const modelos = [
    { e: anel, titulo: "Estojo para anel", texto: "Com encaixe acolchoado para um anel.", img: "/img/estojo-anel.webp" },
    { e: joias, titulo: "Estojo para brincos, colares e pulseiras", texto: "Serve para brincos, colares e pulseiras.", img: "/img/estojo-joias.webp" },
  ];
  return (
    <div className="pb-24">
      <section className="caixa grid gap-10 pt-8 sm:pt-14 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden bg-avela-pale">
          <Foto src="/img/estojo.webp" alt="Estojos Carvieal para presente" sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>
        <div className="max-w-md">
          <h1 className="titulo text-[36px] sm:text-[48px]">Embalagem Especial para Presente</h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-tinta/75">
            <p>Para os momentos em que a peça é para alguém especial, podes juntar à encomenda um estojo em camurça, pensado para oferecer.</p>
            <p>É uma opção facultativa: todas as encomendas continuam a ser enviadas na embalagem normal da Carvieal.</p>
            <p>Podes escolher o estojo na página de cada peça, antes de a adicionares ao carrinho, ou diretamente no carrinho.</p>
          </div>
        </div>
      </section>

      <section className="caixa mt-16 grid gap-10 sm:grid-cols-2 sm:gap-6 lg:max-w-4xl">
        {modelos.map((m) => (
          <div key={m.titulo}>
            <div className="relative aspect-square overflow-hidden bg-avela-pale">
              <Foto src={m.e?.imagem || m.img} alt={m.titulo} sizes="(min-width: 640px) 40vw, 100vw" />
            </div>
            <h2 className="mt-5 text-[15px] font-medium uppercase tracking-[.14em] text-tinta">{m.titulo}</h2>
            <p className="mt-1 text-[14px] text-tinta/60">{m.texto}</p>
            {m.e ? (
              <>
                <p className="mt-3 text-[16px] text-tinta">+ {kz(m.e.preco)}</p>
                <BotaoEstojo estojo={m.e} />
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
