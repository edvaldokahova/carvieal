"use client";
import { useEffect, useState } from "react";
import { BadgeCheck, Check, EyeOff, Trash2 } from "lucide-react";
import { apagarAvaliacao, aprovarAvaliacao, listarAvaliacoesAdm, type AvaliacaoAdm } from "@/lib/avaliacoes";
import { dataHora } from "@/lib/formato";
import { Titulo, Vazio, caixaAdm } from "@/components/admin/ui";
import Estrelas from "@/components/Estrelas";

export default function AvaliacoesAdm() {
  const [lista, setLista] = useState<AvaliacaoAdm[] | null>(null);
  const [filtro, setFiltro] = useState<"pendentes" | "publicadas" | "todas">("pendentes");
  const [msg, setMsg] = useState("");
  const carregar = () => listarAvaliacoesAdm().then(setLista);
  useEffect(() => { carregar(); }, []);

  const mudar = async (a: AvaliacaoAdm, aprovada: boolean) => {
    const e = await aprovarAvaliacao(a.id, aprovada);
    setMsg(e ? `Erro: ${e}` : aprovada ? "Avaliação publicada." : "Avaliação escondida.");
    carregar();
  };
  const apagar = async (a: AvaliacaoAdm) => {
    if (!window.confirm(`Apagar a avaliação de ${a.nome}?`)) return;
    const e = await apagarAvaliacao(a.id);
    setMsg(e ? `Erro: ${e}` : "Avaliação apagada.");
    carregar();
  };

  const pendentes = (lista ?? []).filter((a) => !a.aprovada);
  const mostrar = (lista ?? []).filter((a) => (filtro === "todas" ? true : filtro === "pendentes" ? !a.aprovada : a.aprovada));

  return (
    <div className="max-w-4xl">
      <Titulo>Avaliações</Titulo>
      <p className="-mt-4 mb-6 max-w-2xl text-[14px] text-tinta/60">
        Avaliações de quem já recebeu a peça (mesmo telefone de uma encomenda entregue) são publicadas logo, com «Compra verificada». As outras esperam aqui pela sua aprovação.
      </p>
      <div className="mb-5 flex flex-wrap gap-2 text-[14px]">
        {(["pendentes", "publicadas", "todas"] as const).map((f) => (
          <button key={f} onClick={() => setFiltro(f)} className={`rounded-full border px-4 py-1.5 capitalize ${filtro === f ? "border-choco bg-choco text-marfim-claro" : "border-choco/20"}`}>
            {f}{f === "pendentes" && pendentes.length ? ` (${pendentes.length})` : ""}
          </button>
        ))}
      </div>
      {msg && <p className="mb-4 text-[14px] text-choco">{msg}</p>}
      {lista === null ? <p className="text-[14px] text-tinta/55">A carregar…</p> : mostrar.length === 0 ? (
        <Vazio>{filtro === "pendentes" ? "Nenhuma avaliação à espera de aprovação." : "Ainda não há avaliações."}</Vazio>
      ) : (
        <ul className="space-y-3">
          {mostrar.map((a) => (
            <li key={a.id} className={`${caixaAdm} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Estrelas nota={a.nota} tamanho={15} className="text-choco" />
                  <span className="text-[14px] font-medium">{a.nome}</span>
                  {a.verificada && <span className="inline-flex items-center gap-1 text-[12px] text-[#2F6B3A]"><BadgeCheck size={14} /> Compra verificada</span>}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[12px] ${a.aprovada ? "bg-[#DDEBD6] text-[#2F5A1E]" : "bg-[#F3E3C3] text-[#7A4B0E]"}`}>{a.aprovada ? "Publicada" : "Pendente"}</span>
              </div>
              <p className="mt-1 text-[13px] text-tinta/55">
                {a.produto ? <a href={`/produto/${a.produto.slug}`} target="_blank" className="underline">{a.produto.nome}</a> : "Peça removida"}, {dataHora(a.created_at)}, tel. {a.telefone}
              </p>
              {a.comentario && <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{a.comentario}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {a.aprovada ? (
                  <button onClick={() => mudar(a, false)} className="btn-linha !min-h-[40px] !px-4 text-[13px]"><EyeOff size={15} /> Esconder</button>
                ) : (
                  <button onClick={() => mudar(a, true)} className="btn-choco !min-h-[40px] !px-4 text-[13px]"><Check size={15} /> Publicar</button>
                )}
                <button onClick={() => apagar(a)} className="inline-flex min-h-[40px] items-center gap-2 px-3 text-[13px] text-[#7E2A1E] hover:underline"><Trash2 size={15} /> Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
