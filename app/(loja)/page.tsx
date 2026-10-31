import Link from "next/link";
import { obterConteudo } from "@/lib/conteudo";
import { listarCategorias, listarProdutos } from "@/lib/loja";
import CartaoProduto from "@/components/CartaoProduto";
import Foto from "@/components/Foto";
import HeroVideo from "@/components/HeroVideo";
import Carrossel from "@/components/Carrossel";

export const revalidate = 60;

const rotulo = "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-3 pb-3 pt-10 text-[11px] font-medium uppercase tracking-[.16em] text-white sm:px-5 sm:pb-5 sm:text-[14px]";

export default async function Inicio() {
  const [c, categorias, destaques, novidades, todos] = await Promise.all([
    obterConteudo(),
    listarCategorias(),
    listarProdutos({ destaque: true, limite: 8 }),
    listarProdutos({ novidade: true, limite: 1 }),
    listarProdutos({ limite: 24 }),
  ]);
  const maisVendidos = destaques.length ? destaques : todos.slice(0, 8);
  const looks = todos.filter((p) => p.imagens.length).slice(0, 8);
  const galeria = [...new Set(todos.flatMap((p) => p.imagens))].slice(0, 9);

  return (
    <>
      {/* Topo: vídeo a toda a largura com o título ao centro */}
      <section className="relative h-[calc(100svh-96px)] min-h-[480px] w-full overflow-hidden bg-avela-pale sm:h-[calc(100svh-108px)] sm:min-h-[560px]">
        <HeroVideo video={c.heroVideo} imagem={c.heroImagem} alt="Mulher com colares, brincos e anéis em prata 925 Carvieal" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div className="animate-sobe">
            <h1 className="mx-auto max-w-[14ch] text-[38px] font-medium uppercase leading-[1.08] tracking-[.06em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.25)] sm:max-w-[18ch] sm:text-[60px] lg:text-[72px]">{c.heroTitulo}</h1>
            <Link href="/loja" className="mt-7 inline-block border-b border-white/80 pb-1 text-[13px] font-medium uppercase tracking-[.2em] text-white hover:border-white sm:text-[14px]">Descobrir a coleção</Link>
          </div>
        </div>
      </section>

      {/* Categorias: quatro mosaicos lado a lado, também no telemóvel */}
      {categorias.length > 0 && (
        <section aria-label="Categorias" className="grid grid-cols-4 gap-[3px] bg-white pt-[3px]">
          {categorias.slice(0, 4).map((k, i) => (
            <Link key={k.id} href={`/loja?categoria=${k.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-avela-pale">
              <Foto src={k.imagem} alt={k.nome} sizes="25vw" priority={i < 4} className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" />
              <span className={`${rotulo} !px-1 text-center !text-[9.5px] sm:!text-[14px]`}>{k.nome}</span>
            </Link>
          ))}
        </section>
      )}

      {/* Novidades e mais vendidos */}
      <section className="grid grid-cols-2 gap-[3px] bg-white pt-[3px]">
        {[
          { href: "/loja?novidades=1", nome: "Novidades", img: novidades[0]?.imagens[0] || "/img/colares.webp" },
          { href: "/loja?destaque=1", nome: "Os favoritos Carvieal", img: "/img/embalagem.webp" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="group relative block aspect-[3/4] overflow-hidden bg-avela-pale sm:aspect-[4/5]">
            <Foto src={t.img} alt={t.nome} sizes="50vw" className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
            <span className={rotulo}>{t.nome}</span>
          </Link>
        ))}
      </section>

      {/* Os favoritos Carvieal */}
      {maisVendidos.length > 0 && (
        <section className="caixa py-12 sm:py-20">
          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <h2 className="text-[15px] font-medium uppercase tracking-[.14em] text-tinta sm:text-[18px]">Os favoritos Carvieal</h2>
            <Link href="/loja" className="text-[11px] font-medium uppercase tracking-[.14em] text-tinta/60 hover:text-tinta sm:text-[12px]">Ver tudo</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-[3px] gap-y-10 sm:gap-x-4 lg:grid-cols-4">
            {maisVendidos.map((p, i) => <CartaoProduto key={p.id} p={p} prioridade={i < 2} />)}
          </div>
        </section>
      )}

      {/* Looks: carrossel editorial */}
      {looks.length > 1 && (
        <section className="pb-12 sm:pb-20">
          <Carrossel itens={looks.map((p) => ({ href: `/produto/${p.slug}`, img: p.imagens[1] || p.imagens[0], nome: p.nome }))} />
        </section>
      )}

      {/* Galeria estilo Instagram */}
      {galeria.length >= 3 && (
        <section className="pb-4">
          <div className="caixa mb-6 flex items-end justify-between">
            <h2 className="text-[15px] font-medium uppercase tracking-[.14em] text-tinta sm:text-[18px]">Carvieal no dia a dia</h2>
            {c.instagram && <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium uppercase tracking-[.14em] text-tinta/60 hover:text-tinta sm:text-[12px]">Instagram</a>}
          </div>
          <div className="grid grid-cols-3 gap-[3px]">
            {galeria.slice(0, galeria.length - (galeria.length % 3)).map((src, i) => {
              const p = todos.find((x) => x.imagens.includes(src))!;
              return (
                <Link key={src} href={`/produto/${p.slug}`} className="group relative block aspect-square overflow-hidden bg-avela-pale">
                  <Foto src={src} alt={i === 0 ? p.nome : ""} sizes="33vw" className="transition-transform duration-700 group-hover:scale-[1.05]" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
