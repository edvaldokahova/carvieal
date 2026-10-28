import Link from "next/link";
import Image from "next/image";
import { obterConteudo } from "@/lib/conteudo";
import { listarCategorias, listarProdutos } from "@/lib/loja";
import { marca } from "@/lib/marca";
import { FAQ } from "@/lib/faq";
import CartaoProduto from "@/components/CartaoProduto";
import Foto from "@/components/Foto";

export const revalidate = 60;

export default async function Inicio() {
  const [c, categorias, destaques] = await Promise.all([obterConteudo(), listarCategorias(), listarProdutos({ destaque: true, limite: 8 })]);
  const produtos = destaques.length ? destaques : await listarProdutos({ limite: 8 });
  const perguntas = FAQ.flatMap((t) => t.perguntas).slice(0, 4);

  return (
    <>
      {/* Hero: a fotografia é a protagonista; o slogan ocupa o espaço vazio à esquerda */}
      <section className="relative">
        <div className="relative h-[68svh] min-h-[420px] w-full overflow-hidden bg-avela-pale sm:h-[calc(100svh-108px)] sm:min-h-[560px]">
          <Foto src={c.heroImagem} alt="Mulher com colares, brincos e anéis em prata 925 Carvieal" sizes="100vw" priority className="object-[72%_center] sm:object-center" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#d8c3ab]/50 via-transparent to-transparent sm:block" />
          <div className="caixa absolute inset-0 hidden items-center sm:flex">
            <div className="max-w-[560px] animate-sobe">
              <h1 className="titulo text-[64px] lg:text-[88px]">{c.heroTitulo}</h1>
              <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-tinta/75">{c.heroTexto}</p>
              <div className="mt-9 flex gap-3">
                <Link href="/loja" className="btn-choco">Ver a colecção</Link>
                <Link href="#categorias" className="btn-linha">Escolher por peça</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="caixa py-10 sm:hidden">
          <h1 className="titulo animate-sobe text-[44px]">{c.heroTitulo}</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-tinta/75">{c.heroTexto}</p>
          <Link href="/loja" className="btn-choco mt-7 w-full">Ver a colecção</Link>
        </div>
      </section>

      {/* Categorias */}
      {categorias.length > 0 && (
        <section id="categorias" className="caixa scroll-mt-24 py-14 sm:py-24">
          <h2 className="titulo text-[34px] sm:text-[44px]">Escolha por peça</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-12 sm:gap-x-5 lg:grid-cols-4">
            {categorias.map((k, i) => (
              <Link key={k.id} href={`/loja?categoria=${k.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-avela-pale">
                  <Foto src={k.imagem} alt={k.nome} sizes="(max-width: 1024px) 50vw, 25vw" priority={i < 2} className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <p className="mt-4 font-display text-[22px] text-choco sm:text-[26px]">{k.nome}</p>
                {k.descricao && <p className="mt-1 hidden text-[14px] text-tinta/60 sm:block">{k.descricao}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Peças em destaque */}
      {produtos.length > 0 && (
        <section className="bg-marfim py-14 sm:py-24">
          <div className="caixa">
            <div className="flex items-end justify-between gap-6">
              <h2 className="titulo text-[34px] sm:text-[44px]">Para usar todos os dias</h2>
              <Link href="/loja" className="link shrink-0 text-[14px] text-choco">Ver tudo</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:mt-12 sm:gap-x-5 lg:grid-cols-4">
              {produtos.map((p) => <CartaoProduto key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Editorial: embalagem e promessa */}
      <section className="caixa grid items-center gap-10 py-16 sm:py-28 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-avela-pale">
          <Image src="/img/embalagem.webp" alt="Caixa Carvieal castanha aberta com um colar de prata e saco de oferta bege" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <h2 className="titulo text-[36px] sm:text-[48px]">Chega a casa pronta a oferecer.</h2>
          <p className="mt-6 text-[16px] leading-relaxed text-tinta/75">
            Cada peça é embalada na caixa Carvieal e entregue pelo nosso motoboy, em Luanda. Seja para si ou para alguém especial, só tem de abrir.
          </p>
          <dl className="mt-10 divide-y divide-choco/15 border-y border-choco/15 text-[15px]">
            {[
              ["Prata 925", "Todas as joias em prata de lei, feitas para durar."],
              ["Entrega em casa", "Em Luanda, por motoboy. Acompanhe cada passo da encomenda."],
              ["Pagamento simples", "Feche a encomenda pelo WhatsApp e envie o comprovativo."],
            ].map(([t, d]) => (
              <div key={t} className="grid grid-cols-[140px_1fr] gap-4 py-4">
                <dt className="font-display text-[19px] text-choco">{t}</dt>
                <dd className="text-tinta/70">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Perguntas */}
      <section className="border-t border-choco/10 bg-marfim py-14 sm:py-24">
        <div className="caixa grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <h2 className="titulo text-[34px] sm:text-[44px]">Perguntas frequentes</h2>
            <p className="mt-4 max-w-sm text-[15px] text-tinta/70">Materiais, cuidados, pagamentos, entregas e trocas.</p>
            <Link href="/perguntas" className="btn-linha mt-8">Ver todas as respostas</Link>
          </div>
          <div className="divide-y divide-choco/15 border-y border-choco/15">
            {perguntas.map((q) => (
              <details key={q.p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] text-tinta">
                  {q.p}
                  <span className="text-xl font-light text-choco transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-tinta/70">{q.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="caixa py-16 text-center sm:py-24">
        <p className="titulo mx-auto max-w-3xl text-[30px] italic sm:text-[44px]">{marca.slogan}</p>
      </section>
    </>
  );
}
