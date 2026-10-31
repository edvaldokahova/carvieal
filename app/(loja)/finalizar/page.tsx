import type { Metadata } from "next";
import { obterConteudo } from "@/lib/conteudo";
import Finalizar from "@/components/Finalizar";

export const metadata: Metadata = { title: "Finalizar encomenda", robots: { index: false } };
export const revalidate = 60;

export default async function PaginaFinalizar() {
  const c = await obterConteudo();
  return <Finalizar entregas={c.entregas} gratisAcima={c.entregaGratisAcima} />;
}
