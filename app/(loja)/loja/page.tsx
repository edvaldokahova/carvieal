import type { Metadata } from "next";
import Link from "next/link";
import { listarCategorias, listarProdutos } from "@/lib/loja";
import CartaoProduto from "@/components/CartaoProduto";

export const revalidate = 60;

type Props = { searchParams: { categoria?: string; ordem?: string } };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cats = await listarCategorias();
  const k = cats.find((c) => c.slug === searchParams.categoria);
  return { title: k ? `${k.nome} em prata 925` : "Loja", description: k?.descricao || "Todas as joias Carvieal em prata 925." };
}

export default async function Loja({ searchParams }: Props) {
  const categorias = await listarCategorias();
  const atual = categorias.find((c) => c.slug === searchParams.categoria);
  let produtos = await listarProdutos({ categoriaId: atual?.id });
  const ordem = searchParams.ordem;
  if (ordem === "preco-asc") produtos = [...produtos].sort((a, b) => a.preco - b.preco);
  if (ordem === "preco-desc") produtos = [...produtos].sort((a, b) => b.preco - a.preco);
  if (ordem === "novidades") produtos = [...produtos].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const q = (extra: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const cat = "categoria" in extra ? extra.categoria : searchParams.categoria;
    const ord = "ordem" in extra ? extra.ordem : searchParams.ordem;
    if (cat) p.set("categoria", cat);
    if (ord) p.set("ordem", ord);
    const s = p.toString();
    return s ? `/loja?${s}` : "/loja";
  };

  return (
    <div className="caixa pb-20 pt-10 sm:pb-28 sm:pt-16">
      <h1 className="titulo text-[40px] sm:text-[60px]">{atual ? atual.nome : "Todas as joias"}</h1>
      {atual?.descricao && <p className="mt-3 max-w-xl text-[15px] text-tinta/70">{atual.descricao}</p>}

      <div className="sticky top-16 z-20 -mx-5 mt-8 border-b border-choco/10 bg-marfim-claro/95 px-5 backdrop-blur sm:top-[72px] sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between gap-4">
          <nav aria-label="Categorias" className="-mb-px flex gap-6 overflow-x-auto text-[14px] [scrollbar-width:none]">
            {[{ slug: undefined as string | undefined, nome: "Tudo" }, ...categorias].map((k) => {
              const on = (k.slug ?? "") === (atual?.slug ?? "");
              return (
                <Link key={k.nome} href={q({ categoria: k.slug })} className={`shrink-0 border-b py-4 transition-colors ${on ? "border-choco text-choco" : "border-transparent text-tinta/60 hover:text-choco"}`}>
                  {k.nome}
                </Link>
              );
            })}
          </nav>
          <div className="hidden shrink-0 items-center gap-4 text-[13px] text-tinta/60 sm:flex">
            {[["", "Relevância"], ["novidades", "Novidades"], ["preco-asc", "Preço ↑"], ["preco-desc", "Preço ↓"]].map(([v, n]) => (
              <Link key={v} href={q({ ordem: v || undefined })} className={(ordem ?? "") === v ? "text-choco" : "hover:text-choco"}>{n}</Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[13px] text-tinta/55">{produtos.length} {produtos.length === 1 ? "peça" : "peças"}</p>

      {produtos.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-choco">Ainda não há peças nesta categoria.</p>
          <Link href="/loja" className="btn-linha mt-8">Ver todas as joias</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {produtos.map((p, i) => <CartaoProduto key={p.id} p={p} prioridade={i < 4} />)}
        </div>
      )}
    </div>
  );
}
