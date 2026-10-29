"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Produto } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";

// Botão «+» do cartão: junta ao carrinho num toque. Peças com tamanhos abrem a página para escolher.
export default function AdicionarRapido({ p }: { p: Produto }) {
  const { adicionar, abrir } = useCarrinho();
  const cls = "grid h-10 w-10 place-items-center rounded-full bg-white/90 text-tinta shadow-[0_1px_8px_rgba(0,0,0,.06)] transition-colors hover:bg-choco hover:text-marfim-claro";
  if (p.stock <= 0) return null;
  if (p.opcoes.some((o) => o.valores.length)) {
    return <Link href={`/produto/${p.slug}`} aria-label={`Escolher tamanho de ${p.nome}`} className={cls}><Plus size={20} strokeWidth={1.3} /></Link>;
  }
  return (
    <button type="button" aria-label={`Juntar ${p.nome} ao carrinho`} className={cls}
      onClick={(e) => { e.preventDefault(); adicionar({ produtoId: p.id, slug: p.slug, nome: p.nome, imagem: p.imagens[0] ?? "", preco: p.preco, opcoes: {}, stock: p.stock }); abrir(); }}>
      <Plus size={20} strokeWidth={1.3} />
    </button>
  );
}
