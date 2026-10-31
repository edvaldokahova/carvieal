// Embalagem especial para presente (estojo). É um produto normal da loja com o slug
// abaixo: o preço, a foto e o stock mudam-se no painel, em Produtos.
// Não aparece no catálogo; é oferecido na página de cada peça, no carrinho e em /presente.
import { obterProduto } from "./loja";
import type { Produto } from "./tipos";

export const ESTOJO_SLUG = "estojo-presente";

export async function obterEstojo(): Promise<Produto | null> {
  const p = await obterProduto(ESTOJO_SLUG);
  return p && p.stock > 0 ? p : null;
}

/** Dados mínimos do estojo que os componentes do navegador precisam. */
export type EstojoInfo = { id: string; slug: string; nome: string; preco: number; imagem: string; stock: number } | null;

export function estojoInfo(p: Produto | null): EstojoInfo {
  return p ? { id: p.id, slug: p.slug, nome: p.nome, preco: p.preco, imagem: p.imagens[0] || "/img/estojo.webp", stock: p.stock } : null;
}
