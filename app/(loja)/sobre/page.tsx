import type { Metadata } from "next";
import Link from "next/link";
import Foto from "@/components/Foto";
import { marca } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "A Carvieal é uma marca de acessórios para mulheres que encontram beleza na simplicidade. Joalharia em prata 925.",
  alternates: { canonical: "/sobre" },
};

// Fotografias da página (troque os ficheiros em public/img para mudar).
const FOTOS = ["/img/sobre-1.webp", "/img/sobre-3.webp", "/img/sobre-2.webp"];

const SECCOES: { titulo: string; destaque?: string; textos: string[] }[] = [
  {
    titulo: "A nossa filosofia",
    destaque: "Acreditamos numa elegância natural, sem excessos.",
    textos: [
      "Na Carvieal, valorizamos peças que combinam simplicidade, personalidade e sofisticação. Joias que podem ser usadas todos os dias, que se adaptam a diferentes ocasiões e que permitem expressar o estilo de cada mulher com autenticidade.",
      "Mais do que seguir tendências, privilegiamos escolhas intemporais.",
    ],
  },
  {
    titulo: "A nossa seleção",
    textos: [
      "A nossa coleção dá destaque à joalharia em prata 925, um material escolhido pela sua beleza e características.",
      "Cada peça é selecionada com atenção ao design, aos acabamentos e aos detalhes, procurando equilibrar estética, versatilidade e valor.",
      "Queremos tornar a elegância mais acessível, sem comprometer a experiência que acompanha cada escolha.",
    ],
  },
  {
    titulo: "Os detalhes fazem a diferença",
    destaque: "Acreditamos que a experiência Carvieal vai além da peça escolhida.",
    textos: [
      "Desde a seleção dos produtos à apresentação de cada encomenda, procuramos cuidar de cada detalhe para tornar cada compra especial.",
      "Seja para oferecer ou para ti, queremos que cada peça chegue acompanhada de uma experiência à altura.",
    ],
  },
];


export default function Sobre() {
  return (
    <div className="pb-20 sm:pb-28">
      <section className="caixa max-w-4xl pb-14 pt-12 text-center sm:pb-20 sm:pt-20">
        <h1 className="titulo text-[38px] sm:text-[64px]">Elegância que acompanha cada momento.</h1>
        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-[16px] leading-relaxed text-tinta/75 sm:text-[17px]">
          <p>A Carvieal nasce da apreciação pela beleza dos detalhes e da ideia de que a elegância não precisa de ser extraordinária para se fazer notar.</p>
          <p>Somos uma marca de joalharia e acessórios que acredita na beleza da simplicidade, na versatilidade e no valor das peças que permanecem relevantes ao longo do tempo.</p>
          <p>Criamos uma seleção pensada para acompanhar diferentes momentos, estilos e formas de expressão, porque acreditamos que os pequenos detalhes fazem toda a diferença.</p>
        </div>
      </section>

      <div className="space-y-[3px]">
        {SECCOES.map((s, i) => (
          <section key={s.titulo} className="grid items-center bg-white md:grid-cols-2">
            <div className={`relative aspect-[4/5] overflow-hidden bg-avela-pale ${i % 2 ? "md:order-2" : ""}`}>
              <Foto src={FOTOS[i]} alt="" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="px-5 py-12 sm:px-12 sm:py-16 lg:px-20">
              <h2 className="text-[15px] font-medium uppercase tracking-[.16em] text-tinta sm:text-[18px]">{s.titulo}</h2>
              {s.destaque && <p className="mt-6 max-w-lg font-display text-[24px] leading-snug text-choco sm:text-[28px]">{s.destaque}</p>}
              <div className="mt-6 max-w-lg space-y-4 text-[15px] leading-relaxed text-tinta/75 sm:text-[16px]">
                {s.textos.map((t) => <p key={t}>{t}</p>)}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="caixa pt-20 text-center sm:pt-28">
        <p className="font-display text-[34px] tracking-[.18em] text-choco sm:text-[44px]">CARVIEAL</p>
        <p className="mt-3 font-display text-[18px] italic text-tinta/70 sm:text-[20px]">{marca.slogan}</p>
        <p className="mx-auto mt-5 max-w-md text-[12px] uppercase leading-relaxed tracking-[.16em] text-tinta/55 sm:text-[13px]">Elegância para todos os dias. Beleza nos detalhes. Peças para permanecer.</p>
        <Link href="/loja" className="btn-choco mt-10 uppercase tracking-[.14em] text-[13px]">Descobrir a coleção</Link>
      </section>
    </div>
  );
}
