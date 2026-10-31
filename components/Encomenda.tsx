"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { lerLocal, mensagemWhatsApp, rastrear, type Rastreio } from "@/lib/encomendas";
import { ESTADOS, nomeEstado } from "@/lib/tipos";
import { dataHora, kz, waLink } from "@/lib/formato";
import { marca } from "@/lib/marca";
import Foto from "./Foto";
import WaIcone from "./WaIcone";

const PASSOS = ESTADOS.filter((e) => e.id !== "cancelada");

export default function Encomenda({ codigo, telefone, nova, instrucoes, gratisAcima = 0 }: { codigo: string; telefone: string; nova: boolean; instrucoes: string; gratisAcima?: number }) {
  const [tel, setTel] = useState(telefone);
  const [dados, setDados] = useState<Rastreio | null>(null);
  const [estado, setEstado] = useState<"a-carregar" | "pedir-telefone" | "ok" | "nao-encontrada">("a-carregar");
  const [entrada, setEntrada] = useState("");

  const carregar = async (t: string) => {
    setEstado("a-carregar");
    const r = await rastrear(codigo, t);
    if (r) { setDados(r); setTel(t); setEstado("ok"); } else setEstado(t ? "nao-encontrada" : "pedir-telefone");
  };

  useEffect(() => {
    let t = telefone;
    if (!t) t = lerLocal().find((e) => e.codigo === codigo.toUpperCase())?.telefone ?? "";
    if (t) carregar(t); else setEstado("pedir-telefone");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  if (estado === "a-carregar") return <div className="caixa py-32 text-center text-tinta/55">A carregar a encomenda…</div>;

  if (estado !== "ok" || !dados) {
    return (
      <div className="caixa max-w-md py-24">
        <h1 className="titulo text-[34px]">Encomenda {codigo.toUpperCase()}</h1>
        <p className="mt-3 text-[15px] text-tinta/70">
          {estado === "nao-encontrada" ? "Não encontrámos esta encomenda com esse número. Confirma o telefone utilizado na compra." : "Para ver a encomenda, indica o telefone utilizado na compra."}
        </p>
        <form onSubmit={(e) => { e.preventDefault(); carregar(entrada); }} className="mt-6 space-y-3">
          <input className="campo" value={entrada} onChange={(e) => setEntrada(e.target.value)} inputMode="tel" placeholder="9XX XXX XXX" aria-label="Telefone" />
          <button className="btn-choco w-full">Ver encomenda</button>
        </form>
      </div>
    );
  }

  const cancelada = dados.estado === "cancelada";
  const idx = PASSOS.findIndex((p) => p.id === dados.estado);
  const quando = (id: string) => [...dados.historico].reverse().find((h) => h.estado === id)?.em;
  const linhas = dados.itens.map((i) => {
    const op = Object.entries(i.opcoes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
    return `• ${i.quantidade}× ${i.nome}${op ? ` (${op})` : ""}: ${kz(i.preco * i.quantidade)}`;
  });
  const wa = waLink(marca.whatsapp, mensagemWhatsApp(dados.codigo, dados.nome.split(" ")[0], linhas, kz(dados.total), dados.modalidade));
  const linkRastreio = typeof window !== "undefined" ? `${window.location.origin}/encomenda/${dados.codigo}?t=${tel}` : "";

  return (
    <div className="caixa pb-24 pt-10 sm:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          {nova && dados.estado === "pendente" ? (
            <>
              <p className="text-[14px] text-tinta/60">Encomenda {dados.codigo}</p>
              <h1 className="titulo mt-2 text-[40px] sm:text-[56px]">Falta só enviar no WhatsApp.</h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-tinta/75">
                A tua encomenda está registada. Toca no botão para abrir o WhatsApp da Carvieal com o resumo escrito e envia o comprovativo de pagamento na mesma conversa.
              </p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8 w-full sm:w-auto sm:px-10">
                <WaIcone /> Enviar encomenda no WhatsApp
              </a>
              <div className="mt-8 max-w-lg border-l-2 border-avela pl-5 text-[14px] leading-relaxed text-tinta/70">
                <p className="mb-1 text-tinta">Pagamento</p>
                {instrucoes}
              </div>
            </>
          ) : (
            <>
              <p className="text-[14px] text-tinta/60">Encomenda {dados.codigo}, feita a {dataHora(dados.criada_em)}</p>
              <h1 className="titulo mt-2 text-[40px] sm:text-[56px]">{nomeEstado(dados.estado)}</h1>
              <p className="mt-4 max-w-lg text-[16px] text-tinta/75">{ESTADOS.find((e) => e.id === dados.estado)?.descricao}</p>
            </>
          )}

          {!cancelada && (
            <ol className="mt-12 space-y-0" aria-label="Estado da encomenda">
              {PASSOS.map((p, k) => {
                const feito = k <= idx;
                const em = quando(p.id);
                return (
                  <li key={p.id} className="relative flex gap-4 pb-7 last:pb-0">
                    {k < PASSOS.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-px ${k < idx ? "bg-choco" : "bg-choco/20"}`} aria-hidden />}
                    <span className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${feito ? "border-choco bg-choco text-marfim-claro" : "border-choco/30 bg-marfim-claro"}`}>
                      {feito && <Check size={13} strokeWidth={2.5} />}
                    </span>
                    <div className="-mt-0.5">
                      <p className={`text-[15px] ${feito ? "text-tinta" : "text-tinta/45"}`}>{p.nome}</p>
                      {em && feito && <p className="text-[13px] text-tinta/55">{dataHora(em)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            {!(nova && dados.estado === "pendente") && (
              <a href={waLink(marca.whatsapp, `Olá, Carvieal! Tenho uma questão sobre a encomenda ${dados.codigo}.`)} target="_blank" rel="noopener noreferrer" className="btn-linha"><WaIcone size={18} /> Falar connosco</a>
            )}
            {linkRastreio && (
              <button type="button" onClick={() => navigator.clipboard?.writeText(linkRastreio)} className="btn-linha">Copiar link desta página</button>
            )}
          </div>
        </div>

        <aside>
          <div className="border border-choco/15 bg-marfim p-5 sm:p-7">
            <h2 className="font-display text-[22px] text-choco">Resumo</h2>
            <ul className="mt-5 space-y-4">
              {dados.itens.map((i, k) => (
                <li key={k} className="flex gap-4">
                  <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-avela-pale"><Foto src={i.imagem} alt={i.nome} sizes="64px" /></div>
                  <div className="min-w-0 flex-1 text-[14px]">
                    <p>{i.nome}</p>
                    <p className="text-[13px] text-tinta/55">{[...Object.entries(i.opcoes || {}).map(([a, b]) => `${a}: ${b}`), `Qtd. ${i.quantidade}`].join(", ")}</p>
                  </div>
                  <span className="text-[14px] tabular-nums">{kz(Number(i.preco) * i.quantidade)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-choco/15 pt-5 text-[14px]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{kz(dados.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>{dados.modalidade || "Entrega"}</dt><dd className="tabular-nums">{Number(dados.taxa) > 0 ? kz(dados.taxa) : gratisAcima > 0 && Number(dados.subtotal) >= gratisAcima ? "Grátis" : "A combinar"}</dd></div>
              <div className="flex items-baseline justify-between border-t border-choco/15 pt-3"><dt>Total</dt><dd className="font-display text-[26px] text-choco">{kz(dados.total)}</dd></div>
            </dl>
            <p className="mt-5 text-[13px] leading-relaxed text-tinta/60">Entrega em: {dados.localizacao}, {dados.endereco}</p>
          </div>
          <p className="mt-4 text-[13px] text-tinta/55">Guarda o código <b className="font-medium text-tinta">{dados.codigo}</b>. Podes acompanhar a encomenda em <Link href="/acompanhar" className="link">Acompanhar encomenda</Link>.</p>
        </aside>
      </div>
    </div>
  );
}
