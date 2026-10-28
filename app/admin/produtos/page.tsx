"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listarCategoriasAdm, listarProdutosAdm } from "@/lib/admin";
import type { Categoria, Produto } from "@/lib/tipos";
import { kz } from "@/lib/formato";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";
import Foto from "@/components/Foto";

export default function Produtos() {
  const [prods, setProds] = useState<Produto[] | null>(null);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => { listarProdutosAdm().then(setProds); listarCategoriasAdm().then(setCats); }, []);
  const lista = useMemo(() => (prods ?? []).filter((p) => (!cat || p.categoria_id === cat) && (!busca || p.nome.toLowerCase().includes(busca.toLowerCase()))), [prods, cat, busca]);
  const nomeCat = (id: string | null) => cats.find((c) => c.id === id)?.nome ?? "Sem categoria";

  return (
    <div className="max-w-6xl">
      <Titulo acao={<Link href="/admin/produtos/editar" className="btn-choco !min-h-[44px] !px-5 text-[14px]"><Plus size={16} /> Nova peça</Link>}>Produtos</Titulo>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/40" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Procurar peça" className="campo !py-2.5 pl-9 text-[14px]" />
        </label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="campo !py-2.5 text-[14px] sm:!w-56" aria-label="Filtrar por categoria">
          <option value="">Todas as categorias</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>
      {!prods ? <p className="text-[14px] text-tinta/55">A carregar…</p> : lista.length === 0 ? (
        <Vazio>{prods.length ? "Nenhuma peça encontrada." : <>Ainda não há peças. <Link href="/admin/produtos/editar" className="text-choco underline">Adicione a primeira</Link>.</>}</Vazio>
      ) : (
        <div className={`${caixaAdm} divide-y divide-choco/10`}>
          {lista.map((p) => (
            <Link key={p.id} href={`/admin/produtos/editar?id=${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-avela-pale/40">
              <div className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-avela-pale"><Foto src={p.imagens[0]} alt="" sizes="48px" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px]">{p.nome}</p>
                <p className="text-[12px] text-tinta/55">{nomeCat(p.categoria_id)}{!p.ativo && <span className="ml-2 text-[#9b2c1d]">escondida</span>}{p.destaque && <span className="ml-2 text-choco">destaque</span>}</p>
              </div>
              <span className={`hidden w-24 text-right text-[13px] sm:block ${p.stock <= 0 ? "text-[#9b2c1d]" : p.stock <= 2 ? "text-[#7A4B0E]" : "text-tinta/60"}`}>{p.stock <= 0 ? "Esgotada" : `${p.stock} un.`}</span>
              <span className="w-28 text-right text-[14px] tabular-nums">{kz(p.preco)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
