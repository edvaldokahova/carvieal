import type { Metadata } from "next";
import Acompanhar from "@/components/Acompanhar";

export const metadata: Metadata = { title: "Acompanhar encomenda", description: "Veja em que ponto está a sua encomenda Carvieal." };

export default function PaginaAcompanhar() {
  return <Acompanhar />;
}
