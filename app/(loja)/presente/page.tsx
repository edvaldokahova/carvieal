import type { Metadata } from "next";
import Link from "next/link";
import Foto from "@/components/Foto";
import BotaoEstojo from "@/components/BotaoEstojo";
import { obterEstojo, estojoInfo } from "@/lib/presente";
import { kz } from "@/lib/formato";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Embalagem Especial para Presente",
  description: "Estojo Carvieal para oferecer a tua peça em prata 925. Opção facultativa, adicionada à encomenda.",
  alternates: { canonical: "/presente" },
};

export default async function Presente() {
  const e = await obterEstojo();
  const info = estojoInfo(e);
  return (
    <div className="caixa grid gap-10 pb-24 pt-8 sm:pt-14 md:grid-cols-2 md:items-center md:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden bg-avela-pale">
        <Foto src={info?.imagem || "/img/estojo.webp"} alt="Estojos Carvieal para presente" sizes="(min-width: 768px) 50vw, 100vw" priority />
      </div>
      <div className="max-w-md">
        <h1 className="titulo text-[36px] sm:text-[48px]">Embalagem Especial para Presente</h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-tinta/75">
          <p>Para os momentos em que a peça é para alguém especial, podes juntar à encomenda um estojo em camurça, pensado para oferecer.</p>
          <p>É uma opção facultativa: todas as encomendas continuam a ser enviadas na embalagem normal da Carvieal.</p>
          <p>Podes escolher o estojo na página de cada peça, antes de a adicionares ao carrinho, ou diretamente no carrinho.</p>
        </div>
        {info ? (
          <>
            <p className="mt-8 font-display text-[28px] text-choco">+ {kz(info.preco)} <span className="text-[15px] text-tinta/55">por estojo</span></p>
            <BotaoEstojo estojo={info} />
          </>
        ) : (
          <p className="mt-8 text-[15px] text-tinta/60">De momento, os estojos para presente estão esgotados.</p>
        )}
        <Link href="/loja" className="link mt-6 inline-block text-[14px] text-choco">Descobrir a coleção</Link>
      </div>
    </div>
  );
}
