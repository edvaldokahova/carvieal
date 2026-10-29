"use client";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import type { Avaliacao } from "@/lib/tipos";
import { avaliar } from "@/lib/avaliacoes";
import Estrelas from "./Estrelas";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const dataCurta = (iso: string) => { const d = new Date(iso); return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };

export default function Avaliacoes({ produtoId, media, total, iniciais }: { produtoId: string; media: number; total: number; iniciais: Avaliacao[] }) {
  const [lista, setLista] = useState(iniciais);
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [comentario, setComentario] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const [mostrar, setMostrar] = useState(6);

  const contagem = [5, 4, 3, 2, 1].map((n) => ({ n, q: lista.filter((a) => a.nota === n).length }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!nota) return setErro("Escolha de 1 a 5 estrelas.");
    setAEnviar(true);
    const r = await avaliar({ produtoId, nome, telefone: tel, nota, comentario });
    setAEnviar(false);
    if (r.erro) return setErro(r.erro);
    if (r.publicada) {
      setLista((l) => [{ id: "nova", nome: nome.trim(), nota, comentario: comentario.trim(), verificada: true, created_at: new Date().toISOString() }, ...l]);
      setMsg("Obrigada! A sua avaliação já está publicada.");
    } else {
      setMsg("Obrigada! A sua avaliação foi recebida e aparece aqui depois de ser revista pela nossa equipa.");
    }
    setAberto(false);
    setNota(0); setNome(""); setTel(""); setComentario("");
  };

  return (
    <section id="avaliacoes" className="caixa scroll-mt-24 border-t border-tinta/10 py-14 sm:py-20" aria-labelledby="titulo-avaliacoes">
      <div className="grid gap-10 md:grid-cols-[300px_1fr] md:gap-16">
        <div>
          <h2 id="titulo-avaliacoes" className="text-[15px] font-medium uppercase tracking-[.14em] sm:text-[18px]">Avaliações</h2>
          {total > 0 ? (
            <>
              <p className="mt-5 flex items-end gap-3"><span className="font-display text-[54px] leading-none text-choco">{media.toLocaleString("pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span><Estrelas nota={media} tamanho={17} className="mb-2 text-tinta" /></p>
              <p className="mt-1 text-[12px] uppercase tracking-[.1em] text-tinta/60">{total} {total === 1 ? "avaliação" : "avaliações"}</p>
              <ul className="mt-5 space-y-1.5">
                {contagem.map(({ n, q }) => (
                  <li key={n} className="flex items-center gap-3 text-[12px] text-tinta/70">
                    <span className="w-3">{n}</span>
                    <span className="h-[3px] flex-1 bg-tinta/10"><span className="block h-full bg-tinta" style={{ width: `${lista.length ? (q / lista.length) * 100 : 0}%` }} /></span>
                    <span className="w-5 text-right tabular-nums">{q}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-[14px] text-tinta/65">Ainda sem avaliações. Seja a primeira a dizer o que achou desta peça.</p>
          )}
          {!aberto && <button onClick={() => { setAberto(true); setMsg(""); }} className="mt-7 h-12 w-full border border-tinta text-[12px] font-medium uppercase tracking-[.16em] transition-colors hover:bg-tinta hover:text-white">Escrever avaliação</button>}
          {msg && <p role="status" className="mt-4 text-[14px] text-choco">{msg}</p>}
        </div>

        <div>
          {aberto && (
            <form onSubmit={enviar} className="mb-10 space-y-4 bg-[#F6F3EF] p-5 sm:p-7">
              <fieldset>
                <legend className="rotulo">A sua nota</legend>
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`} aria-pressed={nota === n} onClick={() => setNota(n)} onMouseEnter={() => setHover(n)} className="grid h-11 w-11 place-items-center text-tinta">
                      <svg width="28" height="28" viewBox="0 0 20 20" aria-hidden><path fill={(hover || nota) >= n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z" /></svg>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="av-nome" className="rotulo">Nome</label><input id="av-nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={60} autoComplete="given-name" /></div>
                <div>
                  <label htmlFor="av-tel" className="rotulo">Telefone (não é publicado)</label>
                  <input id="av-tel" className="campo" value={tel} onChange={(e) => setTel(e.target.value)} required inputMode="tel" placeholder="9XX XXX XXX" autoComplete="tel" />
                </div>
              </div>
              <div><label htmlFor="av-com" className="rotulo">Comentário (opcional)</label><textarea id="av-com" rows={4} maxLength={1000} className="campo resize-none" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Como é a peça ao vivo? Usa-a no dia a dia?" /></div>
              <p className="text-[12px] text-tinta/55">Se já recebeu esta peça, use o mesmo número da encomenda: a avaliação fica com «Compra verificada».</p>
              {erro && <p role="alert" className="text-[14px] text-choco">{erro}</p>}
              <div className="flex gap-3">
                <button disabled={aEnviar} className="btn-choco flex-1 sm:flex-none">{aEnviar ? "A enviar…" : "Publicar avaliação"}</button>
                <button type="button" onClick={() => setAberto(false)} className="btn-linha">Cancelar</button>
              </div>
            </form>
          )}

          {lista.length > 0 && (
            <ul className="divide-y divide-tinta/10 border-y border-tinta/10">
              {lista.slice(0, mostrar).map((a) => (
                <li key={a.id + a.created_at} className="py-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Estrelas nota={a.nota} tamanho={14} className="text-tinta" />
                    <span className="text-[12px] text-tinta/50">{dataCurta(a.created_at)}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[.1em]">
                    {a.nome}
                    {a.verificada && <span className="inline-flex items-center gap-1 text-[11px] font-normal normal-case tracking-normal text-[#2F6B3A]"><BadgeCheck size={14} /> Compra verificada</span>}
                  </p>
                  {a.comentario && <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-tinta/80">{a.comentario}</p>}
                </li>
              ))}
            </ul>
          )}
          {lista.length > mostrar && <button onClick={() => setMostrar((m) => m + 6)} className="mt-6 text-[12px] font-medium uppercase tracking-[.14em] underline underline-offset-4">Ver mais avaliações</button>}
        </div>
      </div>
    </section>
  );
}
