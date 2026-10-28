"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { apagarCategoria, guardarCategoria, listarCategoriasAdm } from "@/lib/admin";
import type { Categoria } from "@/lib/tipos";
import { slugify } from "@/lib/formato";
import { Titulo, caixaAdm } from "@/components/admin/ui";
import Foto from "@/components/Foto";

type Linha = Partial<Categoria> & { _novo?: boolean };

export default function Categorias() {
  const [lista, setLista] = useState<Linha[] | null>(null);
  const [msg, setMsg] = useState("");
  const carregar = () => listarCategoriasAdm().then(setLista);
  useEffect(() => { carregar(); }, []);

  const mudar = (i: number, c: Partial<Categoria>) => setLista((l) => (l ?? []).map((x, k) => (k === i ? { ...x, ...c } : x)));

  const guardar = async (c: Linha) => {
    if (!c.nome?.trim()) return setMsg("Erro: a categoria precisa de nome.");
    const dados = { nome: c.nome.trim(), slug: c.slug || slugify(c.nome), descricao: (c.descricao ?? "").trim(), imagem: (c.imagem ?? "").trim(), ordem: Number(c.ordem ?? 0), ativo: c.ativo ?? true };
    const erro = await guardarCategoria(c._novo ? null : c.id!, dados);
    setMsg(erro ? `Erro: ${erro}` : `«${dados.nome}» guardada.`);
    if (!erro) carregar();
  };

  const apagar = async (c: Linha) => {
    if (c._novo) return setLista((l) => (l ?? []).filter((x) => x !== c));
    if (!window.confirm(`Apagar a categoria «${c.nome}»? As peças ficam sem categoria, mas não são apagadas.`)) return;
    const erro = await apagarCategoria(c.id!);
    setMsg(erro ? `Erro: ${erro}` : "Categoria apagada.");
    if (!erro) carregar();
  };

  return (
    <div className="max-w-4xl">
      <Titulo acao={<button onClick={() => setLista((l) => [...(l ?? []), { _novo: true, nome: "", descricao: "", imagem: "", ordem: (l?.length ?? 0) + 1, ativo: true }])} className="btn-choco !min-h-[44px] !px-5 text-[14px]"><Plus size={16} /> Nova categoria</button>}>Categorias</Titulo>
      <p className="-mt-4 mb-6 text-[14px] text-tinta/60">As categorias aparecem no menu da loja e na página inicial. Pode criar novas a qualquer momento, por exemplo «Conjuntos» ou «Tornozeleiras».</p>
      {msg && <p className="mb-4 text-[14px] text-choco">{msg}</p>}
      {!lista ? <p className="text-[14px] text-tinta/55">A carregar…</p> : (
        <div className="space-y-4">
          {lista.map((c, i) => (
            <div key={c.id ?? `novo-${i}`} className={`${caixaAdm} grid gap-4 p-4 sm:grid-cols-[88px_1fr]`}>
              <div className="relative aspect-[3/4] w-[88px] overflow-hidden bg-avela-pale">{c.imagem && <Foto src={c.imagem} alt="" sizes="88px" />}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="campo !py-2.5 text-[14px]" value={c.nome ?? ""} onChange={(e) => mudar(i, { nome: e.target.value })} placeholder="Nome (ex.: Anéis)" aria-label="Nome" />
                <input className="campo !py-2.5 text-[14px]" value={c.imagem ?? ""} onChange={(e) => mudar(i, { imagem: e.target.value })} placeholder="Link da foto (ImgBB), vertical 3:4" aria-label="Foto" />
                <input className="campo !py-2.5 text-[14px] sm:col-span-2" value={c.descricao ?? ""} onChange={(e) => mudar(i, { descricao: e.target.value })} placeholder="Frase curta (opcional)" aria-label="Descrição" />
                <div className="flex flex-wrap items-center gap-4 text-[13px] sm:col-span-2">
                  <label className="flex items-center gap-2">Ordem <input type="number" className="campo !w-20 !py-1.5" value={c.ordem ?? 0} onChange={(e) => mudar(i, { ordem: Number(e.target.value) })} /></label>
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={c.ativo ?? true} onChange={(e) => mudar(i, { ativo: e.target.checked })} className="h-4 w-4 accent-[#4F2C1D]" /> Visível na loja</label>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => apagar(c)} aria-label="Apagar categoria" className="p-2 text-tinta/45 hover:text-[#9b2c1d]"><Trash2 size={16} /></button>
                    <button onClick={() => guardar(c)} className="btn-choco !min-h-[38px] !px-4 text-[13px]">Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
