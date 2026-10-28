"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { listarClientes, listarEncomendas, type Cliente, type EncomendaAdm } from "@/lib/admin";
import { dataHora, kz, waLink } from "@/lib/formato";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";
import WaIcone from "@/components/WaIcone";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  const [enc, setEnc] = useState<EncomendaAdm[]>([]);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  useEffect(() => { listarClientes().then(setClientes); listarEncomendas().then(setEnc); }, []);

  const resumo = useMemo(() => {
    const m: Record<string, { n: number; total: number; ultima: string; lista: EncomendaAdm[] }> = {};
    enc.forEach((e) => {
      if (!e.cliente_id) return;
      const r = (m[e.cliente_id] ??= { n: 0, total: 0, ultima: "", lista: [] });
      r.lista.push(e);
      if (e.estado === "cancelada") return;
      r.n += 1;
      if (e.pago) r.total += e.total;
      if (e.created_at > r.ultima) r.ultima = e.created_at;
    });
    return m;
  }, [enc]);

  const lista = (clientes ?? []).filter((c) => !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca.replace(/\D/g, "") || "x"));

  return (
    <div className="max-w-5xl">
      <Titulo>Clientes</Titulo>
      <label className="relative mb-5 block max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/40" />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome ou telefone" className="campo !py-2.5 pl-9 text-[14px]" />
      </label>
      {!clientes ? <p className="text-[14px] text-tinta/55">A carregar…</p> : lista.length === 0 ? <Vazio>As clientes aparecem aqui depois da primeira encomenda.</Vazio> : (
        <div className={`${caixaAdm} divide-y divide-choco/10`}>
          {lista.map((c) => {
            const r = resumo[c.id];
            const nome = c.nome.split(" ")[0];
            return (
              <div key={c.id}>
                <button onClick={() => setAberto(aberto === c.id ? null : c.id)} className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 text-left text-[14px] hover:bg-avela-pale/40 sm:grid-cols-[1fr_140px_120px_130px]">
                  <span><span className="block text-[15px]">{c.nome}</span><span className="text-[12px] text-tinta/55">{c.localizacao}</span></span>
                  <span className="text-right text-tinta/65 sm:text-left">{r?.n ?? 0} {r?.n === 1 ? "encomenda" : "encomendas"}</span>
                  <span className="hidden tabular-nums sm:block">{kz(r?.total ?? 0)}</span>
                  <span className="hidden text-[13px] text-tinta/55 sm:block">{r?.ultima ? dataHora(r.ultima).split(" às")[0] : "—"}</span>
                </button>
                {aberto === c.id && (
                  <div className="space-y-4 bg-avela-pale/30 px-4 py-4 text-[14px]">
                    <div className="flex flex-wrap gap-2">
                      <a href={waLink(c.telefone)} target="_blank" rel="noopener noreferrer" className="btn-wa !min-h-[38px] !px-4 text-[13px]"><WaIcone size={16} /> Conversar</a>
                      <a href={waLink(c.telefone, `Olá, ${nome}! Temos peças novas na Carvieal que achamos que vai gostar. Veja aqui: ${typeof window !== "undefined" ? window.location.origin : ""}/loja`)} target="_blank" rel="noopener noreferrer" className="btn-linha !min-h-[38px] !px-4 text-[13px]">Enviar novidades</a>
                    </div>
                    <p className="text-tinta/70">+{c.telefone.length === 9 ? "244 " + c.telefone : c.telefone}{c.email ? `, ${c.email}` : ""}. {c.endereco}</p>
                    <ul className="divide-y divide-choco/10 border-y border-choco/10">
                      {(r?.lista ?? []).map((e) => (
                        <li key={e.id}><Link href={`/admin/encomendas/${e.id}`} className="flex justify-between py-2 hover:text-choco"><span>{e.codigo}, {dataHora(e.created_at).split(" às")[0]}</span><span className="tabular-nums">{kz(e.total)}</span></Link></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
