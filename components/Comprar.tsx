"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Produto } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";
import { marca } from "@/lib/marca";
import { waLink } from "@/lib/formato";

export default function Comprar({ p }: { p: Produto }) {
  const { adicionar } = useCarrinho();
  const [esc, setEsc] = useState<Record<string, string>>({});
  const [qtd, setQtd] = useState(1);
  const [aviso, setAviso] = useState("");
  const esgotado = p.stock <= 0;
  const faltam = p.opcoes.filter((o) => o.valores.length && !esc[o.nome]);

  const add = () => {
    if (faltam.length) {
      setAviso(`Escolha ${faltam.map((o) => o.nome.toLowerCase()).join(" e ")}.`);
      return;
    }
    setAviso("");
    adicionar({ produtoId: p.id, slug: p.slug, nome: p.nome, imagem: p.imagens[0] ?? "", preco: p.preco, opcoes: esc, stock: p.stock }, qtd);
  };

  return (
    <div className="mt-8 space-y-7">
      {p.opcoes.filter((o) => o.valores.length).map((o) => (
        <fieldset key={o.nome}>
          <legend className="mb-3 text-[14px] text-tinta/75">
            {o.nome}{esc[o.nome] ? <span className="text-tinta">: {esc[o.nome]}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {o.valores.map((v) => {
              const on = esc[o.nome] === v;
              return (
                <button key={v} type="button" aria-pressed={on} onClick={() => { setEsc((e) => ({ ...e, [o.nome]: v })); setAviso(""); }}
                  className={`min-h-[44px] min-w-[48px] border px-4 text-[14px] transition-colors ${on ? "border-choco bg-choco text-marfim-claro" : "border-choco/25 hover:border-choco"}`}>
                  {v}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {!esgotado && (
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-tinta/75">Quantidade</span>
          <div className="flex items-center border border-choco/25">
            <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} disabled={qtd <= 1} aria-label="Menos uma" className="grid h-11 w-11 place-items-center disabled:opacity-30"><Minus size={15} /></button>
            <span className="w-8 text-center tabular-nums">{qtd}</span>
            <button type="button" onClick={() => setQtd((q) => Math.min(q + 1, p.stock, 20))} disabled={qtd >= Math.min(p.stock, 20)} aria-label="Mais uma" className="grid h-11 w-11 place-items-center disabled:opacity-30"><Plus size={15} /></button>
          </div>
          {p.stock <= 3 && <span className="text-[13px] text-choco-soft">Últimas {p.stock} unidades</span>}
        </div>
      )}

      <div>
        {esgotado ? (
          <a href={waLink(marca.whatsapp, `Olá, Carvieal! Gostaria de saber quando volta a ter a peça «${p.nome}».`)} target="_blank" rel="noopener noreferrer" className="btn-linha w-full">
            Esgotado. Avise-me pelo WhatsApp
          </a>
        ) : (
          <button type="button" onClick={add} className="btn-choco w-full">Adicionar ao carrinho</button>
        )}
        {aviso && <p role="alert" className="mt-3 text-[14px] text-[#9b2c1d]">{aviso}</p>}
      </div>
    </div>
  );
}
