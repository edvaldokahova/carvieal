"use client";
import { useState } from "react";
import { useCarrinho } from "@/lib/carrinho";
import { kz } from "@/lib/formato";
import type { Estojos } from "@/lib/presente";
import Foto from "./Foto";

// No carrinho: «Vai oferecer?» com a escolha entre os dois estojos.
export default function SugestaoEstojo({ estojos, temAnel }: { estojos: Estojos; temAnel: boolean }) {
  const { adicionar } = useCarrinho();
  const opcoes = [
    estojos.anel && { chave: "anel", rotulo: "Anel", e: estojos.anel },
    estojos.joias && { chave: "joias", rotulo: "Brincos, colares, pulseiras", e: estojos.joias },
  ].filter(Boolean) as { chave: string; rotulo: string; e: NonNullable<Estojos["anel"]> }[];
  const [esc, setEsc] = useState(temAnel && estojos.anel ? "anel" : opcoes[opcoes.length - 1].chave);
  const atual = opcoes.find((o) => o.chave === esc) ?? opcoes[0];
  const e = atual.e;

  return (
    <div className="mx-5 mb-4 border border-choco/15 bg-white p-3 sm:mx-7">
      <div className="flex items-center gap-3">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-avela-pale"><Foto src={e.imagem} alt="" sizes="56px" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug text-tinta">Vai oferecer? Adicionar estojo para presente</p>
          <p className="text-[13px] text-tinta/55">+ {kz(e.preco)}</p>
        </div>
        <button type="button" onClick={() => adicionar({ produtoId: e.id, slug: e.slug, nome: e.nome, imagem: e.imagem, preco: e.preco, opcoes: {}, stock: e.stock })}
          className="shrink-0 border border-choco px-3 py-2 text-[12px] font-medium uppercase tracking-[.12em] text-choco hover:bg-choco hover:text-marfim-claro">Adicionar</button>
      </div>
      {opcoes.length > 1 && (
        <div className="mt-3 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Modelo do estojo">
          {opcoes.map((o) => (
            <button key={o.chave} type="button" role="radio" aria-checked={esc === o.chave} onClick={() => setEsc(o.chave)}
              className={`border px-2 py-2 text-[12px] leading-tight transition-colors ${esc === o.chave ? "border-choco bg-choco text-marfim-claro" : "border-choco/20 text-tinta/70"}`}>
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
