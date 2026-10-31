import type { Metadata } from "next";
import Link from "next/link";
import Foto from "@/components/Foto";
import { marca } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "A Carvieal é uma marca de acessórios para mulheres que encontram beleza na simplicidade. Joias em prata 925.",
  alternates: { canonical: "/sobre" },
};

// Fotografias da página (troque os ficheiros em public/img para mudar).
const FOTOS = ["/img/sobre-1.webp", "/img/sobre-2.webp", "/img/sobre-3.webp", "/img/sobre-4.webp"];

const SECCOES: { titulo: string; textos: string[] }[] = [
  {
    titulo: "A nossa filosofia",
    textos: [
      "Na Carvieal, valorizamos a simplicidade, a versatilidade e a beleza de peças que permanecem relevantes para além das tendências.",
      "Acreditamos que os acessórios devem adaptar-se a ti, ao teu estilo e à tua forma de viver. Por isso, procuramos peças que possam ser usadas individualmente ou combinadas entre si, criando diferentes expressões de elegância.",
      "A nossa abordagem privilegia designs equilibrados, linhas delicadas e detalhes que fazem a diferença sem exigir demasiado.",
      "O resultado é uma seleção pensada para acompanhar o teu dia a dia, do mais simples ao mais especial.",
    ],
  },
  {
    titulo: "A nossa seleção",
    textos: [
      "Cada peça Carvieal é escolhida tendo em conta o design, a versatilidade e a forma como se integra no estilo da mulher contemporânea.",
      "A nossa seleção inclui joias em prata 925, um material que oferece diferentes possibilidades de utilização, acabamento e estilo.",
      "Procuramos reunir peças que conciliem estética, funcionalidade e acessibilidade, permitindo-te construir uma coleção pessoal de acessórios que fazem sentido para ti.",
      "Porque acreditamos que o verdadeiro valor de uma peça está também na forma como a usas, combinas e tornas tua.",
    ],
  },
  {
    titulo: "Qualidade e atenção aos detalhes",
    textos: [
      "Acreditamos que uma boa experiência começa antes mesmo de receberes a tua encomenda.",
      "Por isso, procuramos dar atenção a cada etapa da experiência Carvieal: desde a seleção dos artigos até à apresentação e ao cuidado da embalagem.",
      "Valorizamos a transparência na descrição dos materiais e dos acabamentos, para que possas fazer as tuas escolhas com maior confiança.",
      "Queremos que cada encomenda reflita a identidade da marca e que a experiência de receber uma peça Carvieal seja tão especial quanto a própria peça.",
    ],
  },
  {
    titulo: "A nossa visão",
    textos: [
      "Queremos tornar a elegância mais acessível, aproximando o design intemporal do quotidiano das mulheres que valorizam o seu estilo pessoal.",
      "Mais do que acompanhar tendências, procuramos oferecer uma seleção de acessórios que te permita expressar quem és, com confiança e naturalidade.",
      "Acreditamos que o estilo não precisa de ser complicado. Precisa apenas de refletir aquilo que te torna única.",
    ],
  },
];

const rotulo = "text-[11px] font-medium uppercase tracking-[.2em] text-tinta/55 sm:text-[12px]";

export default function Sobre() {
  return (
    <div className="pb-20 sm:pb-28">
      <section className="caixa max-w-4xl pb-14 pt-12 text-center sm:pb-20 sm:pt-20">
        <h1 className="titulo text-[38px] sm:text-[64px]">A elegância está nos detalhes.</h1>
        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-[16px] leading-relaxed text-tinta/75 sm:text-[17px]">
          <p>A Carvieal é uma marca de acessórios criada para mulheres que encontram beleza na simplicidade e acreditam que a elegância está nos pequenos detalhes.</p>
          <p>A nossa visão assenta numa ideia simples: os acessórios não precisam de ser extravagantes para fazer a diferença. Uma peça bem escolhida pode transformar um visual, expressar personalidade e acompanhar-te em diferentes momentos da vida.</p>
          <p>Inspiramo-nos numa estética minimalista, clean e intemporal para selecionar peças versáteis, pensadas para complementar o teu estilo sem o limitar.</p>
          <p>Acreditamos numa elegância natural, que não depende de ocasiões especiais, mas que faz parte do quotidiano.</p>
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
        <Link href="/loja" className="btn-choco mt-10 uppercase tracking-[.14em] text-[13px]">Descobrir a coleção</Link>
      </section>
    </div>
  );
}
