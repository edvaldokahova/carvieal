"use client";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCarrinho } from "@/lib/carrinho";
import { kz } from "@/lib/formato";
import Foto from "./Foto";

export default function CarrinhoGaveta({ gratisAcima = 0 }: { gratisAcima?: number }) {
  const { itens, aberto, fechar, mudarQtd, remover, subtotal } = useCarrinho();
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrinho">
      <button type="button" aria-label="Fechar carrinho" onClick={fechar} className="absolute inset-0 animate-fade bg-tinta/40" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] animate-entra flex-col bg-marfim-claro">
        <div className="flex h-16 items-center justify-between border-b border-choco/10 px-5 sm:px-7">
          <h2 className="font-display text-[22px] text-choco">Carrinho</h2>
          <button type="button" onClick={fechar} aria-label="Fechar carrinho" className="-mr-2 grid h-11 w-11 place-items-center text-choco"><X size={22} strokeWidth={1.4} /></button>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-2xl text-choco">O teu carrinho está vazio.</p>
            <p className="mt-2 text-[14px] text-tinta/60">Escolhe uma peça e ela aparece aqui.</p>
            <Link href="/loja" onClick={fechar} className="btn-choco mt-8">Ver a coleção</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-choco/10 overflow-y-auto px-5 sm:px-7">
              {itens.map((i) => (
                <li key={i.chave} className="flex gap-4 py-5">
                  <Link href={`/produto/${i.slug}`} onClick={fechar} className="relative aspect-[4/5] w-[84px] shrink-0 overflow-hidden bg-avela-pale">
                    <Foto src={i.imagem} alt={i.nome} sizes="84px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/produto/${i.slug}`} onClick={fechar} className="text-[15px] leading-snug text-tinta">{i.nome}</Link>
                      <button type="button" onClick={() => remover(i.chave)} aria-label={`Remover ${i.nome}`} className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center text-tinta/45 hover:text-choco"><X size={16} /></button>
                    </div>
                    {Object.entries(i.opcoes).map(([k, v]) => (
                      <p key={k} className="mt-0.5 text-[13px] text-tinta/55">{k}: {v}</p>
                    ))}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-choco/20">
                        <button type="button" onClick={() => mudarQtd(i.chave, i.quantidade - 1)} disabled={i.quantidade <= 1} aria-label="Menos uma" className="grid h-9 w-9 place-items-center disabled:opacity-30"><Minus size={14} /></button>
                        <span className="w-7 text-center text-[14px] tabular-nums">{i.quantidade}</span>
                        <button type="button" onClick={() => mudarQtd(i.chave, i.quantidade + 1)} disabled={i.quantidade >= Math.min(i.stock, 20)} aria-label="Mais uma" className="grid h-9 w-9 place-items-center disabled:opacity-30"><Plus size={14} /></button>
                      </div>
                      <span className="text-[15px] tabular-nums">{kz(i.preco * i.quantidade)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-choco/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px]">Subtotal</span>
                <span className="font-display text-2xl text-choco">{kz(subtotal)}</span>
              </div>
              <p className="mt-1 text-[13px] text-tinta/55">
                {gratisAcima > 0 && subtotal >= gratisAcima ? <span className="text-choco">A tua encomenda tem entrega normal grátis em Luanda.</span>
                  : gratisAcima > 0 ? <>Faltam {kz(gratisAcima - subtotal)} para teres entrega grátis em Luanda.</>
                  : "A entrega é calculada no passo seguinte."}
              </p>
              <Link href="/finalizar" onClick={fechar} className="btn-choco mt-5 w-full">Finalizar encomenda</Link>
              <button type="button" onClick={fechar} className="mt-3 w-full py-2 text-[14px] text-tinta/70 hover:text-choco">Continuar a ver</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
