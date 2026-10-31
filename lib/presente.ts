// Embalagem especial para presente: dois estojos, cada um é um produto normal da loja
// (slugs abaixo). Preço, foto e stock mudam-se no painel, em Produtos.
// Não aparecem no catálogo; são oferecidos na página de cada peça, no carrinho e em /presente.
import { obterProduto } from "./loja";
import type { Produto } from "./tipos";

export const ESTOJO_ANEL = "estojo-anel"; // para anéis
export const ESTOJO_JOIAS = "estojo-joias"; // para brincos, colares e pulseiras
export const SLUGS_ESTOJO = [ESTOJO_ANEL, ESTOJO_JOIAS];

/** Dados mínimos de um estojo que os componentes do navegador precisam. */
export type EstojoInfo = { id: string; slug: string; nome: string; preco: number; imagem: string; stock: number } | null;
export type Estojos = { anel: EstojoInfo; joias: EstojoInfo };

function info(p: Produto | null, img: string): EstojoInfo {
  return p && p.stock > 0 ? { id: p.id, slug: p.slug, nome: p.nome, preco: p.preco, imagem: p.imagens[0] || img, stock: p.stock } : null;
}

export async function obterEstojos(): Promise<Estojos> {
  const [a, j] = await Promise.all([obterProduto(ESTOJO_ANEL), obterProduto(ESTOJO_JOIAS)]);
  return { anel: info(a, "/img/estojo-anel.webp"), joias: info(j, "/img/estojo-joias.webp") };
}

/** Estojo certo para uma peça: anéis → estojo de anel; o resto → estojo de joias. */
export function estojoPara(categoriaSlug: string | undefined, e: Estojos): EstojoInfo {
  return categoriaSlug === "aneis" ? e.anel : e.joias;
}
