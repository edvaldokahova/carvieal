"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { apagarProduto, guardarProduto, listarCategoriasAdm, obterProdutoAdm } from "@/lib/admin";
import type { Categoria, Opcao, Produto } from "@/lib/tipos";
import { slugify } from "@/lib/formato";
import { Titulo, caixaAdm } from "@/components/admin/ui";
import Foto from "@/components/Foto";

type Form = { nome: string; slug: string; descricao: string; detalhes: string; preco: string; preco_antigo: string; stock: string; categoria_id: string; imagens: string[]; opcoes: Opcao[]; destaque: boolean; novidade: boolean; ativo: boolean; ordem: string };
const vazio: Form = { nome: "", slug: "", descricao: "", detalhes: "Prata 925\n", preco: "", preco_antigo: "", stock: "1", categoria_id: "", imagens: [""], opcoes: [], destaque: false, novidade: true, ativo: true, ordem: "0" };

function Editor() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const [f, setF] = useState<Form>(vazio);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [slugManual, setSlugManual] = useState(false);
  const [carregado, setCarregado] = useState(!id);
  const [msg, setMsg] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    listarCategoriasAdm().then(setCats);
    if (id) obterProdutoAdm(id).then((p) => {
      if (p) setF({ nome: p.nome, slug: p.slug, descricao: p.descricao, detalhes: p.detalhes, preco: String(p.preco), preco_antigo: p.preco_antigo ? String(p.preco_antigo) : "", stock: String(p.stock), categoria_id: p.categoria_id ?? "", imagens: p.imagens.length ? p.imagens : [""], opcoes: p.opcoes, destaque: p.destaque, novidade: p.novidade, ativo: p.ativo, ordem: String(p.ordem) });
      setSlugManual(true);
      setCarregado(true);
    });
  }, [id]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const setNome = (v: string) => setF((x) => ({ ...x, nome: v, slug: slugManual ? x.slug : slugify(v) }));

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMsg("");
    const preco = Number(f.preco.replace(/\./g, "").replace(",", "."));
    if (!f.nome.trim()) return setMsg("Erro: indique o nome da peça.");
    if (!preco || preco <= 0) return setMsg("Erro: indique o preço em Kz (só números).");
    const imagens = f.imagens.map((s) => s.trim()).filter(Boolean);
    const opcoes = f.opcoes.map((o) => ({ nome: o.nome.trim(), valores: o.valores.map((v) => v.trim()).filter(Boolean) })).filter((o) => o.nome && o.valores.length);
    const dados: Partial<Produto> = {
      nome: f.nome.trim(), slug: slugify(f.slug || f.nome), descricao: f.descricao.trim(), detalhes: f.detalhes.trim(), preco,
      preco_antigo: f.preco_antigo ? Number(f.preco_antigo.replace(/\./g, "").replace(",", ".")) : null,
      stock: Math.max(0, parseInt(f.stock || "0", 10)), categoria_id: f.categoria_id || null, imagens, opcoes,
      destaque: f.destaque, novidade: f.novidade, ativo: f.ativo, ordem: parseInt(f.ordem || "0", 10),
    };
    setAGuardar(true);
    const erro = await guardarProduto(id, dados);
    setAGuardar(false);
    if (erro) return setMsg(`Erro: ${erro}`);
    router.push("/admin/produtos");
  };

  const apagar = async () => {
    if (!id || !window.confirm("Apagar esta peça? As encomendas antigas mantêm o nome e o preço. Para a tirar só da loja, desmarque «Visível na loja».")) return;
    const erro = await apagarProduto(id);
    if (erro) setMsg(`Erro: ${erro}`); else router.push("/admin/produtos");
  };

  const moverImg = (i: number, d: -1 | 1) => {
    const l = [...f.imagens]; const j = i + d;
    if (j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]]; set("imagens", l);
  };

  if (!carregado) return <p className="text-[14px] text-tinta/55">A carregar…</p>;
  const lbl = "mb-1.5 block text-[13px] font-medium text-tinta/80";
  const ajuda = "mt-1 text-[12px] text-tinta/50";

  return (
    <form onSubmit={guardar} className="max-w-3xl">
      <Link href="/admin/produtos" className="mb-6 inline-flex items-center gap-2 text-[14px] text-tinta/60 hover:text-choco"><ArrowLeft size={16} /> Produtos</Link>
      <Titulo>{id ? "Editar peça" : "Nova peça"}</Titulo>

      <section className={`${caixaAdm} space-y-5 p-5 sm:p-6`}>
        <div>
          <label className={lbl} htmlFor="nome">Nome</label>
          <input id="nome" className="campo" value={f.nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Anel Essencial" required />
          <p className={ajuda}>Endereço da página: /produto/<input value={f.slug} onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }} className="border-b border-choco/20 bg-transparent text-tinta/70 outline-none focus:border-choco" aria-label="Endereço da página" /></p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={lbl} htmlFor="preco">Preço (Kz)</label>
            <input id="preco" className="campo" value={f.preco} onChange={(e) => set("preco", e.target.value)} inputMode="numeric" placeholder="18500" required />
          </div>
          <div>
            <label className={lbl} htmlFor="antigo">Preço antigo (opcional)</label>
            <input id="antigo" className="campo" value={f.preco_antigo} onChange={(e) => set("preco_antigo", e.target.value)} inputMode="numeric" placeholder="Aparece riscado" />
          </div>
          <div>
            <label className={lbl} htmlFor="stock">Stock</label>
            <input id="stock" type="number" min={0} className="campo" value={f.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={lbl} htmlFor="cat">Categoria</label>
          <select id="cat" className="campo" value={f.categoria_id} onChange={(e) => set("categoria_id", e.target.value)}>
            <option value="">Sem categoria</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl} htmlFor="desc">Descrição</label>
          <textarea id="desc" rows={3} className="campo" value={f.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Uma ou duas frases sobre a peça." />
        </div>
        <div>
          <label className={lbl} htmlFor="det">Detalhes</label>
          <textarea id="det" rows={4} className="campo" value={f.detalhes} onChange={(e) => set("detalhes", e.target.value)} placeholder={"Prata 925\nComprimento: 45 cm\nFecho de mosquetão"} />
          <p className={ajuda}>Um detalhe por linha: material, medidas, peso, fecho.</p>
        </div>
      </section>

      <section className={`${caixaAdm} mt-6 p-5 sm:p-6`}>
        <h2 className="text-[15px] font-medium">Fotografias</h2>
        <p className={ajuda}>Cole o link de cada foto (ImgBB: «Ver links» → link directo). A primeira é a principal. Ideal: vertical 4:5, por exemplo 1080 × 1350.</p>
        <div className="mt-4 space-y-3">
          {f.imagens.map((src, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-avela-pale">{src.trim() && <Foto src={src.trim()} alt="" sizes="48px" />}</div>
              <input className="campo !py-2.5 text-[14px]" value={src} onChange={(e) => set("imagens", f.imagens.map((x, k) => (k === i ? e.target.value : x)))} placeholder="https://i.ibb.co/..." />
              <button type="button" onClick={() => moverImg(i, -1)} disabled={i === 0} aria-label="Subir" className="p-1.5 text-tinta/45 disabled:opacity-25"><ArrowUp size={16} /></button>
              <button type="button" onClick={() => moverImg(i, 1)} disabled={i === f.imagens.length - 1} aria-label="Descer" className="p-1.5 text-tinta/45 disabled:opacity-25"><ArrowDown size={16} /></button>
              <button type="button" onClick={() => set("imagens", f.imagens.filter((_, k) => k !== i))} aria-label="Remover foto" className="p-1.5 text-tinta/45 hover:text-[#9b2c1d]"><X size={16} /></button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => set("imagens", [...f.imagens, ""])} className="btn-linha !min-h-[40px] !px-4 text-[13px]"><Plus size={15} /> Adicionar foto</button>
          <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="btn-linha !min-h-[40px] !px-4 text-[13px]">Abrir ImgBB</a>
        </div>
      </section>

      <section className={`${caixaAdm} mt-6 p-5 sm:p-6`}>
        <h2 className="text-[15px] font-medium">Opções</h2>
        <p className={ajuda}>Para peças com escolha: tamanho do anel, comprimento da corrente, cor da pedra. A cliente escolhe antes de adicionar ao carrinho.</p>
        <div className="mt-4 space-y-4">
          {f.opcoes.map((o, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
              <input className="campo !py-2.5 text-[14px]" value={o.nome} onChange={(e) => set("opcoes", f.opcoes.map((x, k) => (k === i ? { ...x, nome: e.target.value } : x)))} placeholder="Ex.: Tamanho" />
              <input className="campo !py-2.5 text-[14px]" value={o.valores.join(", ")} onChange={(e) => set("opcoes", f.opcoes.map((x, k) => (k === i ? { ...x, valores: e.target.value.split(",").map((v) => v.trimStart()) } : x)))} placeholder="Valores separados por vírgula: 12, 14, 16" />
              <button type="button" onClick={() => set("opcoes", f.opcoes.filter((_, k) => k !== i))} aria-label="Remover opção" className="justify-self-start p-2 text-tinta/45 hover:text-[#9b2c1d]"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => set("opcoes", [...f.opcoes, { nome: "", valores: [] }])} className="btn-linha mt-4 !min-h-[40px] !px-4 text-[13px]"><Plus size={15} /> Adicionar opção</button>
      </section>

      <section className={`${caixaAdm} mt-6 space-y-3 p-5 sm:p-6 text-[14px]`}>
        {([["ativo", "Visível na loja", "Desmarque para esconder a peça sem a apagar."], ["destaque", "Mostrar na página inicial", "Aparece em «Para usar todos os dias»."], ["novidade", "Marcar como novidade", "Mostra a etiqueta «Novo» na foto."]] as const).map(([k, t, d]) => (
          <label key={k} className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#4F2C1D]" />
            <span><span className="block">{t}</span><span className="text-[12px] text-tinta/50">{d}</span></span>
          </label>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <label htmlFor="ordem" className="text-tinta/70">Ordem na loja</label>
          <input id="ordem" type="number" className="campo !w-24 !py-2" value={f.ordem} onChange={(e) => set("ordem", e.target.value)} />
          <span className="text-[12px] text-tinta/50">Números menores aparecem primeiro.</span>
        </div>
      </section>

      <div className="sticky bottom-[72px] mt-6 flex flex-wrap items-center gap-3 border-t border-choco/10 bg-marfim py-4 lg:bottom-0">
        <button disabled={aGuardar} className="btn-choco !min-h-[46px] text-[14px]">{aGuardar ? "A guardar…" : "Guardar peça"}</button>
        {id && <button type="button" onClick={apagar} className="ml-auto text-[13px] text-tinta/55 hover:text-[#9b2c1d]">Apagar peça</button>}
        {msg && <p role="alert" className="w-full text-[14px] text-[#9b2c1d]">{msg}</p>}
      </div>
    </form>
  );
}

export default function EditarProduto() {
  return <Suspense><Editor /></Suspense>;
}
