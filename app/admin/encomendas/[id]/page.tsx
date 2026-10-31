"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { guardarNotas, mudarEstado, obterEncomenda, type EncomendaAdm, type ItemAdm } from "@/lib/admin";
import { ESTADOS, nomeEstado } from "@/lib/tipos";
import { dataHora, kz, waLink } from "@/lib/formato";
import { useAcesso, pode } from "@/components/admin/AdminShell";
import { Etiqueta, caixaAdm } from "@/components/admin/ui";
import Foto from "@/components/Foto";
import WaIcone from "@/components/WaIcone";

const FLUXO = ["pendente", "confirmada", "em_preparacao", "enviada", "entregue"];

function mensagemCliente(e: EncomendaAdm, estado: string, link: string) {
  const nome = e.nome.split(" ")[0];
  const t: Record<string, string> = {
    pendente: `Olá, ${nome}! Recebemos a sua encomenda ${e.codigo} (${kz(e.total)}). Assim que confirmarmos o pagamento, damos notícias.`,
    confirmada: `Olá, ${nome}! O pagamento da encomenda ${e.codigo} foi confirmado. Vamos preparar as suas peças com todo o cuidado.`,
    em_preparacao: `Olá, ${nome}! A sua encomenda ${e.codigo} está a ser embalada.`,
    enviada: `Olá, ${nome}! A sua encomenda ${e.codigo} saiu para entrega. O nosso motoboy vai a caminho de ${e.localizacao || "si"}.`,
    entregue: `Olá, ${nome}! A sua encomenda ${e.codigo} foi entregue. Obrigada por escolher a Carvieal. Esperamos que goste muito das suas peças.`,
    cancelada: `Olá, ${nome}. A encomenda ${e.codigo} foi cancelada. Se tiver alguma dúvida, responda a esta mensagem.`,
  };
  return `${t[estado] ?? ""}\n\nAcompanhe aqui: ${link}`;
}

export default function DetalheEncomenda({ params }: { params: { id: string } }) {
  const a = useAcesso();
  const [e, setE] = useState<EncomendaAdm | null>(null);
  const [itens, setItens] = useState<ItemAdm[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [notas, setNotas] = useState("");
  const [msg, setMsg] = useState("");
  const [aMudar, setAMudar] = useState("");

  const carregar = useCallback(async () => {
    const r = await obterEncomenda(params.id);
    setE(r.encomenda);
    setItens(r.itens);
    setNotas(r.encomenda?.notas_internas ?? "");
    setCarregado(true);
  }, [params.id]);
  useEffect(() => { carregar(); }, [carregar]);

  if (!carregado) return <p className="text-[14px] text-tinta/55">A carregar…</p>;
  if (!e) return <p className="text-[15px]">Encomenda não encontrada. <Link href="/admin/encomendas" className="underline">Voltar</Link></p>;

  const podeEditar = pode(a, "encomendas");
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/encomenda/${e.codigo}?t=${e.telefone}`;
  const idx = FLUXO.indexOf(e.estado);
  const proximo = idx >= 0 && idx < FLUXO.length - 1 ? FLUXO[idx + 1] : null;

  const mudar = async (estado: string) => {
    if (estado === "cancelada" && !window.confirm(`Cancelar a encomenda ${e.codigo}? O stock das peças é reposto.`)) return;
    setAMudar(estado);
    const erro = await mudarEstado(e.id, estado);
    setAMudar("");
    if (erro) setMsg(`Erro: ${erro}`); else { setMsg(`Estado alterado para «${nomeEstado(estado)}». Avise a cliente pelo WhatsApp.`); carregar(); }
  };

  return (
    <div className="max-w-6xl">
      <Link href="/admin/encomendas" className="mb-6 inline-flex items-center gap-2 text-[14px] text-tinta/60 hover:text-choco"><ArrowLeft size={16} /> Encomendas</Link>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-[34px] leading-none text-choco">{e.codigo}</h1>
        <Etiqueta estado={e.estado} />
        <span className="text-[14px] text-tinta/55">{dataHora(e.created_at)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {podeEditar && (
            <section className={`${caixaAdm} p-5`}>
              <h2 className="mb-4 text-[15px] font-medium">Estado da encomenda</h2>
              <ol className="mb-5 flex flex-wrap gap-y-2">
                {FLUXO.map((s, k) => (
                  <li key={s} className="flex items-center text-[13px]">
                    <span className={`flex items-center gap-1.5 ${k <= idx ? "text-choco" : "text-tinta/40"}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full border ${k <= idx ? "border-choco bg-choco text-marfim-claro" : "border-choco/25"}`}>{k <= idx && <Check size={11} strokeWidth={3} />}</span>
                      {nomeEstado(s)}
                    </span>
                    {k < FLUXO.length - 1 && <span className="mx-2 h-px w-4 bg-choco/20" />}
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                {proximo && e.estado !== "cancelada" && (
                  <button onClick={() => mudar(proximo)} disabled={!!aMudar} className="btn-choco !min-h-[44px] !px-5 text-[14px]">
                    {aMudar === proximo ? "A guardar…" : `Marcar como «${nomeEstado(proximo)}»`}
                  </button>
                )}
                <select value="" onChange={(ev) => ev.target.value && mudar(ev.target.value)} className="campo !w-auto !py-2.5 text-[14px]" aria-label="Escolher outro estado">
                  <option value="">Outro estado…</option>
                  {ESTADOS.filter((s) => s.id !== e.estado).map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
              <a href={waLink(e.telefone, mensagemCliente(e, e.estado, link))} target="_blank" rel="noopener noreferrer" className="btn-wa mt-4 !min-h-[44px] w-full !px-5 text-[14px] sm:w-auto">
                <WaIcone size={18} /> Avisar cliente: «{nomeEstado(e.estado)}»
              </a>
              {msg && <p className="mt-3 text-[14px] text-choco">{msg}</p>}
            </section>
          )}

          <section className={caixaAdm}>
            <h2 className="border-b border-choco/10 px-5 py-4 text-[15px] font-medium">Peças</h2>
            <ul className="divide-y divide-choco/10">
              {itens.map((i) => (
                <li key={i.id} className="flex gap-4 px-5 py-4">
                  <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-avela-pale"><Foto src={i.imagem} alt={i.nome} sizes="56px" /></div>
                  <div className="min-w-0 flex-1 text-[14px]">
                    <p>{i.nome}</p>
                    <p className="text-[13px] text-tinta/55">{[...Object.entries(i.opcoes || {}).map(([k, v]) => `${k}: ${v}`), `${i.quantidade} × ${kz(i.preco)}`].join(", ")}</p>
                  </div>
                  <span className="text-[14px] tabular-nums">{kz(i.preco * i.quantidade)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-choco/10 px-5 py-4 text-[14px]">
              <div className="flex justify-between"><dt className="text-tinta/60">Subtotal</dt><dd className="tabular-nums">{kz(e.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-tinta/60">{e.modalidade || "Entrega"}</dt><dd className="tabular-nums">{e.taxa_entrega > 0 ? kz(e.taxa_entrega) : "Sem taxa (grátis ou a combinar)"}</dd></div>
              <div className="flex justify-between pt-1 text-[16px]"><dt>Total</dt><dd className="font-medium tabular-nums">{kz(e.total)}</dd></div>
              <div className="flex justify-between text-[13px] text-tinta/60"><dt>Pagamento</dt><dd>{e.metodo_pagamento === "whatsapp" ? "Comprovativo por WhatsApp" : e.metodo_pagamento === "referencia" ? "Referência" : "Multicaixa Express"}{e.pago ? ", confirmado" : ", por confirmar"}</dd></div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className={`${caixaAdm} p-5 text-[14px]`}>
            <h2 className="mb-3 text-[15px] font-medium">Cliente</h2>
            <p className="text-[16px]">{e.nome}</p>
            <a href={waLink(e.telefone)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-[#178a45] hover:underline"><WaIcone size={15} /> +{e.telefone.length === 9 ? "244 " + e.telefone : e.telefone}</a>
            {e.email && <p className="mt-1 text-tinta/65">{e.email}</p>}
            <h3 className="mb-1 mt-5 text-[13px] text-tinta/55">Entrega</h3>
            <p>{e.localizacao}</p>
            <p>{e.endereco}</p>
            {e.referencia && <p className="text-tinta/65">Referência: {e.referencia}</p>}
            {e.notas_cliente && (<><h3 className="mb-1 mt-5 text-[13px] text-tinta/55">Observações da cliente</h3><p className="whitespace-pre-line">{e.notas_cliente}</p></>)}
          </section>

          {podeEditar && (
            <section className={`${caixaAdm} p-5`}>
              <h2 className="mb-3 text-[15px] font-medium">Notas internas</h2>
              <textarea rows={3} value={notas} onChange={(ev) => setNotas(ev.target.value)} placeholder="Só a equipa vê. Ex.: entregar depois das 17h." className="campo resize-none text-[14px]" />
              <button onClick={async () => { const er = await guardarNotas(e.id, notas); setMsg(er ? `Erro: ${er}` : "Notas guardadas."); }} className="btn-linha mt-3 !min-h-[40px] !px-4 text-[13px]">Guardar notas</button>
            </section>
          )}

          <section className={`${caixaAdm} p-5`}>
            <h2 className="mb-3 text-[15px] font-medium">Histórico</h2>
            <ul className="space-y-2.5 text-[13px]">
              {[...e.historico].reverse().map((h, k) => (
                <li key={k} className="flex justify-between gap-3">
                  <span>{nomeEstado(h.estado)}{h.por ? <span className="text-tinta/50"> por {h.por}</span> : null}</span>
                  <span className="shrink-0 text-tinta/55">{dataHora(h.em)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
