import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SLUGS_ESTOJO, obterEstojos, estojoPara } from "@/lib/presente";
import { listarCategorias, listarProdutos, obterProduto } from "@/lib/loja";
import { obterConteudo } from "@/lib/conteudo";
import { kz } from "@/lib/formato";
import { marca } from "@/lib/marca";
import Galeria from "@/components/Galeria";
import Comprar from "@/components/Comprar";
import CartaoProduto from "@/components/CartaoProduto";
import Avaliacoes from "@/components/Avaliacoes";
import Estrelas from "@/components/Estrelas";
import { avaliacoesPublicas } from "@/lib/avaliacoes";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await obterProduto(params.slug);
  if (!p) return { title: "Peça não encontrada" };
  const img = p.imagens[0];
  return {
    title: p.nome,
    description: p.descricao || `${p.nome} em prata 925.`,
    alternates: { canonical: `/produto/${p.slug}` },
    openGraph: { title: `${p.nome} | ${marca.nome}`, description: p.descricao, images: img ? [{ url: img }] : undefined },
  };
}

export default async function PaginaProduto({ params }: Props) {
  const p = await obterProduto(params.slug);
  if (SLUGS_ESTOJO.includes(params.slug)) redirect("/presente");
  if (!p) notFound();
  const [categorias, c, avaliacoes, estojo] = await Promise.all([listarCategorias(), obterConteudo(), avaliacoesPublicas(p.id), obterEstojos()]);
  const cat = categorias.find((k) => k.id === p.categoria_id);
  const relacionados = (await listarProdutos({ categoriaId: p.categoria_id ?? undefined, limite: 5 })).filter((x) => x.id !== p.id).slice(0, 4);
  const detalhes = p.detalhes.split("\n").map((l) => l.trim()).filter(Boolean);
  const entregaMin = c.entregas.filter((e) => e.taxa > 0).sort((a, b) => a.taxa - b.taxa)[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nome,
    description: p.descricao,
    image: p.imagens.map((i) => (i.startsWith("/") ? marca.url + i : i)),
    brand: { "@type": "Brand", name: marca.nome },
    material: "Prata 925",
    ...(p.avaliacao_total > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.avaliacao_media, reviewCount: p.avaliacao_total, bestRating: 5, worstRating: 1 } } : {}),
    offers: { "@type": "Offer", priceCurrency: "AOA", price: p.preco, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  };

  const blocos: [string, React.ReactNode][] = [
    ["Detalhes", detalhes.length ? <ul className="space-y-1">{detalhes.map((d) => <li key={d}>{d}</li>)}</ul> : "Prata 925."],
    ["Cuidados", "Retira a peça antes do banho, da praia e do ginásio. Aplica perfume e cremes antes de a colocares e guarda-a separada, na embalagem Carvieal."],
    ["Entrega e trocas", `Entrega em casa em Luanda${entregaMin ? `, a partir de ${kz(entregaMin.taxa)}` : ""}. Trocas até 7 dias após a entrega, com a peça sem uso e na embalagem original.`],
  ];

  return (
    <>
      <div className="caixa pb-16 pt-4 sm:pt-8">
        <nav aria-label="Caminho" className="mb-5 hidden text-[13px] text-tinta/55 md:block">
          <Link href="/loja" className="hover:text-choco">Loja</Link>
          {cat && <> <span aria-hidden>/</span> <Link href={`/loja?categoria=${cat.slug}`} className="hover:text-choco">{cat.nome}</Link></>}
        </nav>
        <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-20">
          <div className="-mx-5 sm:mx-0"><Galeria imagens={p.imagens} nome={p.nome} /></div>
          <div className="md:sticky md:top-28 md:self-start">
            <h1 className="text-[20px] font-medium uppercase leading-snug tracking-[.1em] text-tinta sm:text-[26px]">{p.nome}</h1>
            <a href="#avaliacoes" className="mt-3 inline-flex items-center gap-2 text-tinta">
              <Estrelas nota={p.avaliacao_total ? p.avaliacao_media : 0} tamanho={14} />
              <span className="text-[11px] uppercase tracking-[.1em] text-tinta/60 underline-offset-4 hover:underline">{p.avaliacao_total ? `${p.avaliacao_total} ${p.avaliacao_total === 1 ? "avaliação" : "avaliações"}` : "Sê a primeira a avaliar"}</span>
            </a>
            <p className="mt-3 text-[18px] tabular-nums text-tinta">
              {p.preco_antigo && p.preco_antigo > p.preco && <span className="mr-3 text-tinta/40 line-through">{kz(p.preco_antigo)}</span>}
              {kz(p.preco)}
            </p>
            {p.descricao && <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-tinta/75">{p.descricao}</p>}
            <Comprar p={p} estojo={estojoPara(cat?.slug, estojo)} />
            <div className="mt-10 divide-y divide-choco/15 border-y border-choco/15">
              {blocos.map(([t, conteudo], i) => (
                <details key={t} className="group py-4" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[15px]">
                    {t}
                    <span className="text-xl font-light text-choco transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 text-[14px] leading-relaxed text-tinta/70">{conteudo}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Avaliacoes produtoId={p.id} media={p.avaliacao_media} total={p.avaliacao_total} iniciais={avaliacoes} />

      {relacionados.length > 0 && (
        <section className="border-t border-tinta/10 py-14 sm:py-20">
          <div className="caixa">
            <h2 className="text-[15px] font-medium uppercase tracking-[.14em] sm:text-[18px]">Combina com</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-[3px] gap-y-10 sm:gap-x-4 lg:grid-cols-4">
              {relacionados.map((r) => <CartaoProduto key={r.id} p={r} />)}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
