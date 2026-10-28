import type { Metadata } from "next";
import { FAQ } from "@/lib/faq";
import { marca } from "@/lib/marca";
import { waLink } from "@/lib/formato";

export const metadata: Metadata = { title: "Perguntas frequentes", description: "Materiais, cuidados com a prata 925, pagamentos, entregas em Luanda e trocas." };

export default function Perguntas() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((t) => t.perguntas).map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
  };
  return (
    <div className="caixa pb-24 pt-10 sm:pt-16">
      <h1 className="titulo text-[40px] sm:text-[60px]">Perguntas frequentes</h1>
      <div className="mt-12 grid gap-14 md:grid-cols-[220px_1fr]">
        <nav className="hidden md:block">
          <ul className="sticky top-28 space-y-3 text-[15px]">
            {FAQ.map((t) => <li key={t.tema}><a href={`#${t.tema}`} className="text-tinta/70 hover:text-choco">{t.tema}</a></li>)}
          </ul>
        </nav>
        <div className="space-y-14">
          {FAQ.map((t) => (
            <section key={t.tema} id={t.tema} className="scroll-mt-28">
              <h2 className="font-display text-[28px] text-choco">{t.tema}</h2>
              <div className="mt-4 divide-y divide-choco/15 border-y border-choco/15">
                {t.perguntas.map((q) => (
                  <details key={q.p} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px]">
                      {q.p}<span className="text-xl font-light text-choco transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-tinta/70">{q.r}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <p className="text-[15px] text-tinta/70">
            Não encontrou a resposta? <a href={waLink(marca.whatsapp, "Olá, Carvieal! Tenho uma pergunta.")} target="_blank" rel="noopener noreferrer" className="link text-choco">Escreva-nos no WhatsApp</a>.
          </p>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
