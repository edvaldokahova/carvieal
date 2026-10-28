"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listarEncomendas, listarProdutosAdm, type EncomendaAdm } from "@/lib/admin";
import type { Produto } from "@/lib/tipos";
import { kz, dataHora } from "@/lib/formato";
import { useAcesso, pode } from "@/components/admin/AdminShell";
import { Etiqueta, Titulo, caixaAdm } from "@/components/admin/ui";

export default function Resumo() {
  const a = useAcesso();
  const [enc, setEnc] = useState<EncomendaAdm[] | null>(null);
  const [prods, setProds] = useState<Produto[]>([]);

  useEffect(() => {
    if (pode(a, "encomendas")) listarEncomendas().then(setEnc); else setEnc([]);
    if (pode(a, "produtos")) listarProdutosAdm().then(setProds);
  }, [a]);

  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();
  const lista = enc ?? [];
  const pendentes = lista.filter((e) => e.estado === "pendente");
  const emCurso = lista.filter((e) => ["confirmada", "em_preparacao", "enviada"].includes(e.estado));
  const doMes = lista.filter((e) => e.created_at >= inicioMes && e.estado !== "cancelada");
  const vendasMes = doMes.filter((e) => e.pago).reduce((s, e) => s + e.total, 0);
  const stockBaixo = prods.filter((p) => p.ativo && p.stock <= 2);

  const numeros: [string, string, string][] = [
    ["Por confirmar", String(pendentes.length), "/admin/encomendas?estado=pendente"],
    ["Em curso", String(emCurso.length), "/admin/encomendas"],
    ["Encomendas este mês", String(doMes.length), "/admin/encomendas"],
    ["Vendido este mês", kz(vendasMes), "/admin/encomendas"],
  ];

  return (
    <div className="max-w-6xl">
      <Titulo>Olá{a.gerente ? "" : `, ${a.nome}`}.</Titulo>
      {pode(a, "encomendas") && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {numeros.map(([t, v, h]) => (
              <Link key={t} href={h} className={`${caixaAdm} p-5 transition-colors hover:border-choco/30`}>
                <p className="text-[13px] text-tinta/60">{t}</p>
                <p className="mt-2 font-display text-[30px] leading-none text-choco">{enc ? v : "…"}</p>
              </Link>
            ))}
          </div>
          <section className="mt-10">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-[24px] text-choco">Últimas encomendas</h2>
              <Link href="/admin/encomendas" className="text-[14px] text-choco underline-offset-4 hover:underline">Ver todas</Link>
            </div>
            <div className={`${caixaAdm} divide-y divide-choco/10`}>
              {lista.slice(0, 6).map((e) => (
                <Link key={e.id} href={`/admin/encomendas/${e.id}`} className="flex items-center gap-4 px-4 py-3.5 text-[14px] hover:bg-avela-pale/40">
                  <span className="w-24 shrink-0 font-medium">{e.codigo}</span>
                  <span className="min-w-0 flex-1 truncate">{e.nome}</span>
                  <span className="hidden text-tinta/55 sm:block">{dataHora(e.created_at)}</span>
                  <span className="w-28 text-right tabular-nums">{kz(e.total)}</span>
                  <Etiqueta estado={e.estado} />
                </Link>
              ))}
              {enc && lista.length === 0 && <p className="px-4 py-10 text-center text-[14px] text-tinta/55">Ainda não há encomendas. Assim que alguém comprar no site, aparece aqui.</p>}
            </div>
          </section>
        </>
      )}
      {pode(a, "produtos") && stockBaixo.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-[24px] text-choco">Stock a acabar</h2>
          <div className={`${caixaAdm} divide-y divide-choco/10`}>
            {stockBaixo.map((p) => (
              <Link key={p.id} href={`/admin/produtos/editar?id=${p.id}`} className="flex justify-between px-4 py-3.5 text-[14px] hover:bg-avela-pale/40">
                <span>{p.nome}</span><span className={p.stock <= 0 ? "text-[#9b2c1d]" : "text-tinta/60"}>{p.stock <= 0 ? "Esgotado" : `${p.stock} em stock`}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {!pode(a, "encomendas") && !pode(a, "produtos") && <p className="text-[15px] text-tinta/65">Use o menu para abrir a secção que pode gerir.</p>}
    </div>
  );
}
