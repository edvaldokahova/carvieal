export default function Legal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="caixa max-w-3xl pb-24 pt-10 sm:pt-16">
      <h1 className="titulo text-[40px] sm:text-[52px]">{titulo}</h1>
      <p className="mt-3 text-[13px] text-tinta/55">Última actualização: Outubro de 2026</p>
      <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-tinta/75 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:text-choco [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}
