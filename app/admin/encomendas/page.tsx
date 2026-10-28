"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { listarEncomendas, type EncomendaAdm } from "@/lib/admin";
import { ESTADOS } from "@/lib/tipos";
import { kz, dataHora, soDigitos } from "@/lib/formato";
import { Etiqueta, Titulo, Vazio, caixaAdm } from "@/components/admin/ui";

function Lista() {
  const sp = useSearchParams();
  const [enc, setEnc] = useState<EncomendaAdm[] | null>(null);
  const [filtro, setFiltro] = useState(sp.get("estado") ?? "");
  const [busca, setBusca] = useState("");

  useEffect(() => { listarEncomendas().then(setEnc); }, []);

  const lista = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return (enc ?? []).filter((e) => (!filtro || e.estado === filtro) && (!b || e.codigo.toLowerCase().includes(b) || e.nome.toLowerCase().includes(b) || (soDigitos(b) && e.telefone.includes(soDigitos(b)))));
  }, [enc, filtro, busca]);

  const conta = (id: string) => (enc ?? []).filter((e) => e.estado === id).length;

  return (
    <div className="max-w-6xl">
      <Titulo>Encomendas</Titulo>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
          {[{ id: "", nome: "Todas" }, ...ESTADOS].map((s) => (
            <button key={s.id} onClick={() => setFiltro(s.id)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${filtro === s.id ? "border-choco bg-choco text-marfim-claro" : "border-choco/20 hover:border-choco"}`}>
              {s.nome}{s.id ? ` (${conta(s.id)})` : ""}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/40" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Código, nome ou telefone" className="campo !py-2.5 pl-9 text-[14px]" />
        </label>
      </div>
      {!enc ? <p className="text-[14px] text-tinta/55">A carregar…</p> : lista.length === 0 ? (
        <Vazio>Nenhuma encomenda {filtro ? "neste estado" : "ainda"}.</Vazio>
      ) : (
        <div className={`${caixaAdm} divide-y divide-choco/10`}>
          {lista.map((e) => (
            <Link key={e.id} href={`/admin/encomendas/${e.id}`} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-4 text-[14px] hover:bg-avela-pale/40 sm:grid-cols-[110px_1fr_150px_110px_130px] sm:items-center">
              <span className="font-medium">{e.codigo}</span>
              <span className="text-right sm:order-last sm:text-left"><Etiqueta estado={e.estado} /></span>
              <span className="truncate text-tinta/80">{e.nome}<span className="block text-[12px] text-tinta/50 sm:hidden">{dataHora(e.created_at)}</span></span>
              <span className="hidden text-tinta/55 sm:block">{dataHora(e.created_at)}</span>
              <span className="text-right tabular-nums sm:text-left">{kz(e.total)}{e.pago && <span className="ml-1.5 text-[11px] text-[#2F5A1E]">pago</span>}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Encomendas() {
  return <Suspense><Lista /></Suspense>;
}
