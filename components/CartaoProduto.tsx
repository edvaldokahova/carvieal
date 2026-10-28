import Link from "next/link";
import type { Produto } from "@/lib/tipos";
import { kz } from "@/lib/formato";
import Foto from "./Foto";

export default function CartaoProduto({ p, prioridade = false }: { p: Produto; prioridade?: boolean }) {
  const esgotado = p.stock <= 0;
  return (
    <Link href={`/produto/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-avela-pale">
        <Foto src={p.imagens[0]} alt={p.nome} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={prioridade} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        {p.imagens[1] && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <Foto src={p.imagens[1]} alt="" sizes="(max-width: 640px) 50vw, 25vw" />
          </div>
        )}
        {(p.novidade || esgotado) && (
          <span className="absolute left-3 top-3 bg-marfim-claro/90 px-2.5 py-1 text-[11px] tracking-[.03em] text-choco">
            {esgotado ? "Esgotado" : "Novo"}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4">
        <h3 className="text-[14px] leading-snug text-tinta sm:text-[15px]">{p.nome}</h3>
        <p className="text-[14px] tabular-nums text-tinta/75">
          {p.preco_antigo && p.preco_antigo > p.preco && <span className="mr-2 text-tinta/40 line-through">{kz(p.preco_antigo)}</span>}
          {kz(p.preco)}
        </p>
      </div>
    </Link>
  );
}
