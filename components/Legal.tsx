import { marca } from "@/lib/marca";

export default function Legal({ titulo, children, assinatura = false }: { titulo: string; children: React.ReactNode; assinatura?: boolean }) {
  return (
    <div className="caixa max-w-3xl pb-24 pt-10 sm:pt-16">
      <h1 className="titulo text-[40px] sm:text-[52px]">{titulo}</h1>
      <p className="mt-3 text-[13px] text-tinta/55">Última atualização: Outubro de 2026</p>
      <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-tinta/75 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:text-choco [&_li]:ml-5 [&_li]:list-disc [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-tinta [&_ul]:space-y-1.5">
        {children}
      </div>
      {assinatura && (
        <div className="mt-16 border-t border-choco/15 pt-8 text-center">
          <p className="font-display text-[22px] tracking-[.18em] text-choco">CARVIEAL</p>
          <p className="mt-1 font-display italic text-tinta/65">{marca.slogan}</p>
        </div>
      )}
    </div>
  );
}
