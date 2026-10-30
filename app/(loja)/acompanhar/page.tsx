import type { Metadata } from "next";
import Acompanhar from "@/components/Acompanhar";

export const metadata: Metadata = { title: "Acompanhar encomenda", description: "Introduz o código da encomenda e o número de telefone para consultares o estado da tua encomenda Carvieal." };

export default function PaginaAcompanhar() {
  return <Acompanhar />;
}
