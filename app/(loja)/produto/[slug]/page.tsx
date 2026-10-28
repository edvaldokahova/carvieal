import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listarCategorias, listarProdutos, obterProduto } from "@/lib/loja";
import { obterConteudo } from "@/lib/conteudo";
import { kz } from "@/lib/formato";
import { marca } from "@/lib/marca";
import Galeria from "@/components/Galeria";
import Comprar from "@/components/Comprar";
import CartaoProduto from "@/components/CartaoProduto";

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
  if (!p) notFound();
  const [categorias, c] = await Promise.all([listarCategorias(), obterConteudo()]);
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
    offers: { "@type": "Offer", priceCurrency: "AOA", price: p.preco, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  };

  const blocos: [string, React.ReactNode][] = [
    ["Detalhes", detalhes.length ? <ul className="space-y-1">{detalhes.map((d) => <li key={d}>{d}</li>)}</ul> : "Prata 925."],
    ["Cuidados", "Retire a peça antes do banho, da praia e do ginásio. Aplique perfume e cremes antes de a pôr e guarde-a separada, na caixa Carvieal."],
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
            <h1 className="titulo text-[32px] sm:text-[42px]">{p.nome}</h1>
            <p className="mt-3 text-[18px] tabular-nums text-tinta">
              {p.preco_antigo && p.preco_antigo > p.preco && <span className="mr-3 text-tinta/40 line-through">{kz(p.preco_antigo)}</span>}
              {kz(p.preco)}
            </p>
            {p.descricao && <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-tinta/75">{p.descricao}</p>}
            <Comprar p={p} />
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

      {relacionados.length > 0 && (
        <section className="border-t border-choco/10 bg-marfim py-14 sm:py-20">
          <div className="caixa">
            <h2 className="titulo text-[30px] sm:text-[38px]">Combina com</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {relacionados.map((r) => <CartaoProduto key={r.id} p={r} />)}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
