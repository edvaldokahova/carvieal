"use client";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { conteudoPadrao, guardarConteudo, obterConteudo } from "@/lib/conteudo";
import type { Conteudo } from "@/lib/tipos";
import { useAcesso } from "@/components/admin/AdminShell";
import { Titulo, caixaAdm } from "@/components/admin/ui";

export default function Definicoes() {
  const a = useAcesso();
  const [c, setC] = useState<Conteudo | null>(null);
  const [msg, setMsg] = useState("");
  const [aGuardar, setAGuardar] = useState(false);
  useEffect(() => { obterConteudo().then(setC); }, []);
  if (!a.gerente) return <p className="text-[15px]">Só a gerência pode alterar as definições.</p>;
  if (!c) return <p className="text-[14px] text-tinta/55">A carregar…</p>;

  const set = <K extends keyof Conteudo>(k: K, v: Conteudo[K]) => setC({ ...c, [k]: v });
  const lbl = "mb-1.5 block text-[13px] font-medium text-tinta/80";

  const guardar = async () => {
    setAGuardar(true);
    const limpo: Conteudo = { ...c, entregas: c.entregas.filter((e) => e.nome.trim()).map((e) => ({ nome: e.nome.trim(), descricao: e.descricao.trim(), taxa: Number(e.taxa) || 0 })) };
    const erro = await guardarConteudo(limpo);
    setAGuardar(false);
    setMsg(erro ? `Erro: ${erro}` : "Guardado. A loja mostra as alterações dentro de um minuto.");
  };

  return (
    <div className="max-w-3xl">
      <Titulo>Definições</Titulo>

      <section className={`${caixaAdm} space-y-5 p-5 sm:p-6`}>
        <h2 className="text-[15px] font-medium">Página inicial</h2>
        <div><label className={lbl}>Frase no topo da loja</label><input className="campo" value={c.avisoTopo} onChange={(e) => set("avisoTopo", e.target.value)} placeholder="Ex.: Entregamos em casa, em Luanda." /></div>
        <div><label className={lbl}>Título principal</label><input className="campo" value={c.heroTitulo} onChange={(e) => set("heroTitulo", e.target.value)} /></div>
        <div><label className={lbl}>Texto por baixo do título</label><textarea rows={2} className="campo" value={c.heroTexto} onChange={(e) => set("heroTexto", e.target.value)} /></div>
        <div>
          <label className={lbl}>Foto principal (link ImgBB)</label>
          <input className="campo" value={c.heroImagem} onChange={(e) => set("heroImagem", e.target.value)} />
          <p className="mt-1 text-[12px] text-tinta/50">Horizontal, com espaço livre do lado esquerdo para o texto. Para voltar à foto original, escreva {conteudoPadrao.heroImagem}</p>
        </div>
      </section>

      <section className={`${caixaAdm} mt-6 p-5 sm:p-6`}>
        <h2 className="text-[15px] font-medium">Formas de entrega</h2>
        <p className="mt-1 text-[12px] text-tinta/50">Aparecem no passo «Finalizar encomenda». Taxa 0 aparece como «A combinar».</p>
        <div className="mt-4 space-y-3">
          {c.entregas.map((e, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_110px_auto]">
              <input className="campo !py-2.5 text-[14px]" value={e.nome} onChange={(ev) => set("entregas", c.entregas.map((x, k) => (k === i ? { ...x, nome: ev.target.value } : x)))} placeholder="Nome" />
              <input className="campo !py-2.5 text-[14px]" value={e.descricao} onChange={(ev) => set("entregas", c.entregas.map((x, k) => (k === i ? { ...x, descricao: ev.target.value } : x)))} placeholder="Prazo / detalhe" />
              <input className="campo !py-2.5 text-[14px]" inputMode="numeric" value={e.taxa} onChange={(ev) => set("entregas", c.entregas.map((x, k) => (k === i ? { ...x, taxa: Number(ev.target.value.replace(/\D/g, "")) } : x)))} placeholder="Kz" aria-label="Taxa em Kz" />
              <button onClick={() => set("entregas", c.entregas.filter((_, k) => k !== i))} aria-label="Remover" className="justify-self-start p-2 text-tinta/45 hover:text-[#9b2c1d]"><X size={16} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => set("entregas", [...c.entregas, { nome: "", descricao: "", taxa: 0 }])} className="btn-linha mt-4 !min-h-[40px] !px-4 text-[13px]"><Plus size={15} /> Adicionar forma de entrega</button>
      </section>

      <section className={`${caixaAdm} mt-6 space-y-5 p-5 sm:p-6`}>
        <h2 className="text-[15px] font-medium">Pagamento</h2>
        <div>
          <label className={lbl}>Instruções mostradas depois da encomenda</label>
          <textarea rows={3} className="campo" value={c.instrucoesPagamento} onChange={(e) => set("instrucoesPagamento", e.target.value)} placeholder="Ex.: IBAN AO06 …, titular Carla Viegas. Multicaixa Express: 9XX XXX XXX." />
          <p className="mt-1 text-[12px] text-tinta/50">Pode pôr aqui o IBAN e o número do Multicaixa Express, ou deixar a indicação de que os dados vão pelo WhatsApp.</p>
        </div>
      </section>

      <section className={`${caixaAdm} mt-6 grid gap-5 p-5 sm:grid-cols-2 sm:p-6`}>
        <h2 className="text-[15px] font-medium sm:col-span-2">Contactos e redes</h2>
        <div><label className={lbl}>Instagram (link)</label><input className="campo" value={c.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/…" /></div>
        <div><label className={lbl}>TikTok (link)</label><input className="campo" value={c.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@…" /></div>
        <div><label className={lbl}>Facebook (link)</label><input className="campo" value={c.facebook} onChange={(e) => set("facebook", e.target.value)} /></div>
        <div><label className={lbl}>Email</label><input className="campo" type="email" value={c.email} onChange={(e) => set("email", e.target.value)} /></div>
      </section>

      <div className="sticky bottom-[72px] mt-6 flex flex-wrap items-center gap-4 border-t border-choco/10 bg-marfim py-4 lg:bottom-0">
        <button onClick={guardar} disabled={aGuardar} className="btn-choco !min-h-[46px] text-[14px]">{aGuardar ? "A guardar…" : "Guardar definições"}</button>
        {msg && <p className="text-[14px] text-choco">{msg}</p>}
      </div>
    </div>
  );
}
