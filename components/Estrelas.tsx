// Estrelas de avaliação (só visual). «nota» pode ter casas decimais.
export default function Estrelas({ nota, tamanho = 13, className = "" }: { nota: number; tamanho?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`} role="img" aria-label={`${nota.toLocaleString("pt-PT", { maximumFractionDigits: 1 })} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, nota - i));
        return (
          <svg key={i} width={tamanho} height={tamanho} viewBox="0 0 20 20" aria-hidden>
            <defs><linearGradient id={`e${i}-${Math.round(fill * 100)}`}><stop offset={fill} stopColor="currentColor" /><stop offset={fill} stopColor="currentColor" stopOpacity=".2" /></linearGradient></defs>
            <path fill={`url(#e${i}-${Math.round(fill * 100)})`} d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z" />
          </svg>
        );
      })}
    </span>
  );
}
