import type { Metadata } from "next";
import { FAQ } from "@/lib/faq";
import { marca } from "@/lib/marca";
import { waLink } from "@/lib/formato";

export const metadata: Metadata = { title: "Perguntas frequentes", description: "Respostas às perguntas mais frequentes sobre materiais, cuidados, pagamentos, entregas e trocas na Carvieal.", alternates: { canonical: "/perguntas" } };

const ancora = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

export default function Perguntas() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((t) => t.perguntas).map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
  };
  return (
    <div className="caixa pb-24 pt-10 sm:pt-16">
      <h1 className="titulo text-[40px] sm:text-[60px]">Perguntas Frequentes</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-tinta/70 sm:text-[16px]">Encontra aqui as respostas às perguntas mais frequentes sobre os nossos materiais, cuidados, pagamentos, entregas e trocas.</p>
      <div className="mt-12 grid gap-14 md:grid-cols-[220px_1fr]">
        <nav className="hidden md:block">
          <ul className="sticky top-28 space-y-3 text-[15px]">
            {FAQ.map((t) => <li key={t.tema}><a href={`#${ancora(t.tema)}`} className="text-tinta/70 hover:text-choco">{t.tema}</a></li>)}
          </ul>
        </nav>
        <div className="space-y-14">
          {FAQ.map((t) => (
            <section key={t.tema} id={ancora(t.tema)} className="scroll-mt-28">
              <h2 className="font-display text-[28px] text-choco">{t.tema}</h2>
              <div className="mt-4 divide-y divide-choco/15 border-y border-choco/15">
                {t.perguntas.map((q) => (
                  <details key={q.p} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px]">
                      {q.p}<span className="text-xl font-light text-choco transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 max-w-prose space-y-3 text-[15px] leading-relaxed text-tinta/70">{q.r.split("\n\n").map((x) => <p key={x}>{x}</p>)}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="border-t border-choco/15 pt-10 text-center">
            <h2 className="text-[15px] font-medium uppercase tracking-[.16em] text-tinta sm:text-[18px]">Ainda tens dúvidas?</h2>
            <p className="mt-3 font-display text-[22px] text-choco">Estamos aqui para ajudar.</p>
            <p className="mt-2 text-[15px] text-tinta/70">Escreve-nos no WhatsApp e teremos todo o gosto em esclarecer as tuas questões.</p>
            <a href={waLink(marca.whatsapp, "Olá, Carvieal! Tenho uma pergunta.")} target="_blank" rel="noopener noreferrer" className="btn-choco mt-6 uppercase tracking-[.14em] text-[13px]">Falar no WhatsApp</a>
            <p className="mt-14 font-display text-[22px] tracking-[.18em] text-choco">CARVIEAL</p>
            <p className="mt-1 font-display italic text-tinta/65">{marca.slogan}</p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
