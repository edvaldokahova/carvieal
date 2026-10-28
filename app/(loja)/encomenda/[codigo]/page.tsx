import type { Metadata } from "next";
import { obterConteudo } from "@/lib/conteudo";
import Encomenda from "@/components/Encomenda";

export const metadata: Metadata = { title: "A sua encomenda", robots: { index: false } };

export default async function PaginaEncomenda({ params, searchParams }: { params: { codigo: string }; searchParams: { t?: string; nova?: string } }) {
  const c = await obterConteudo();
  return <Encomenda codigo={params.codigo} telefone={searchParams.t ?? ""} nova={searchParams.nova === "1"} instrucoes={c.instrucoesPagamento} />;
}
