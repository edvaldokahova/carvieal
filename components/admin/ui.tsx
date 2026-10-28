// Peças pequenas reutilizadas no painel.
import { nomeEstado } from "@/lib/tipos";

export const CORES_ESTADO: Record<string, string> = {
  pendente: "bg-[#F3E3C3] text-[#7A4B0E]",
  confirmada: "bg-[#DCE7F2] text-[#24476B]",
  em_preparacao: "bg-[#EADCF0] text-[#5B2E6E]",
  enviada: "bg-[#D9ECE9] text-[#1E5B52]",
  entregue: "bg-[#DDEBD6] text-[#2F5A1E]",
  cancelada: "bg-[#EFDAD6] text-[#7E2A1E]",
};

export function Etiqueta({ estado }: { estado: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] ${CORES_ESTADO[estado] ?? "bg-avela-pale"}`}>{nomeEstado(estado)}</span>;
}

export function Titulo({ children, acao }: { children: React.ReactNode; acao?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-[32px] leading-none text-choco sm:text-[38px]">{children}</h1>
      {acao}
    </div>
  );
}

export function Vazio({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-choco/20 px-6 py-16 text-center text-[15px] text-tinta/60">{children}</div>;
}

export const caixaAdm = "border border-choco/10 bg-marfim-claro";
