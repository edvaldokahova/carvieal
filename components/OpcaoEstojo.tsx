"use client";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { kz } from "@/lib/formato";
import type { EstojoInfo } from "@/lib/presente";

// Opção facultativa «Adicionar estojo para presente» na página da peça.
export default function OpcaoEstojo({ estojo, marcado, mudar }: { estojo: NonNullable<EstojoInfo>; marcado: boolean; mudar: (v: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-4 border p-3 pr-4 transition-colors ${marcado ? "border-choco bg-avela-pale/50" : "border-choco/20 hover:border-choco/50"}`}>
      <input type="checkbox" className="peer sr-only" checked={marcado} onChange={(e) => mudar(e.target.checked)} />
      <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-avela-pale">
        <Image src={estojo.imagem} alt={estojo.nome} fill sizes="64px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] text-tinta">Adicionar {estojo.nome.charAt(0).toLowerCase() + estojo.nome.slice(1)}</span>
        <span className="mt-0.5 block text-[13px] text-tinta/60">+ {kz(estojo.preco)} · <Link href="/presente" className="link" onClick={(e) => e.stopPropagation()}>ver estojo</Link></span>
      </span>
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-choco/40 ${marcado ? "border-choco bg-choco text-marfim-claro" : "border-choco/40"}`}>
        {marcado && <Check size={14} strokeWidth={2} />}
      </span>
    </label>
  );
}
