import Link from "next/link";
import type { Produto } from "@/lib/tipos";
import { kz } from "@/lib/formato";
import Foto from "./Foto";
import Estrelas from "./Estrelas";
import AdicionarRapido from "./AdicionarRapido";

export default function CartaoProduto({ p, prioridade = false }: { p: Produto; prioridade?: boolean }) {
  const esgotado = p.stock <= 0;
  const desconto = p.preco_antigo && p.preco_antigo > p.preco ? Math.round((1 - p.preco / p.preco_antigo) * 100) : 0;
  const etiqueta = esgotado ? "Esgotado" : desconto ? `Poupa ${desconto}%` : p.novidade ? "Novo" : "";
  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F1EEEA]">
        <Link href={`/produto/${p.slug}`} aria-label={p.nome} className="absolute inset-0">
          <Foto src={p.imagens[0]} alt={p.nome} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={prioridade} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          {p.imagens[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Foto src={p.imagens[1]} alt="" sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
          )}
        </Link>
        {etiqueta && <span className="pointer-events-none absolute left-3 top-3 bg-white px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[.12em] text-tinta sm:left-4 sm:top-4 sm:text-[11px]">{etiqueta}</span>}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4"><AdicionarRapido p={p} /></div>
      </div>
      <Link href={`/produto/${p.slug}`} className="mt-3 block px-1 sm:mt-4 sm:px-2">
        {p.avaliacao_total > 0 && (
          <p className="mb-1.5 flex items-center gap-1.5 text-tinta">
            <Estrelas nota={p.avaliacao_media} tamanho={12} />
            <span className="text-[10px] uppercase tracking-[.08em] text-tinta/60 sm:text-[11px]">({p.avaliacao_total} {p.avaliacao_total === 1 ? "avaliação" : "avaliações"})</span>
          </p>
        )}
        <h3 className="text-[12px] font-medium uppercase leading-snug tracking-[.1em] text-tinta sm:text-[13px]">{p.nome}</h3>
        <p className="mt-1.5 text-[12px] uppercase tabular-nums tracking-[.08em] text-tinta/70 sm:text-[13px]">
          {desconto > 0 && <span className="mr-2 text-tinta/40 line-through">{kz(p.preco_antigo!)}</span>}
          {kz(p.preco)}
        </p>
      </Link>
    </div>
  );
}
