"use client";
import { useCarrinho } from "@/lib/carrinho";
import type { EstojoInfo } from "@/lib/presente";

export default function BotaoEstojo({ estojo }: { estojo: NonNullable<EstojoInfo> }) {
  const { adicionar } = useCarrinho();
  return (
    <button type="button" onClick={() => adicionar({ produtoId: estojo.id, slug: estojo.slug, nome: estojo.nome, imagem: estojo.imagem, preco: estojo.preco, opcoes: {}, stock: estojo.stock })}
      className="btn-choco mt-4 w-full uppercase tracking-[.14em] text-[13px]">
      Adicionar ao carrinho
    </button>
  );
}
