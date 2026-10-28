// Leituras públicas do catálogo (funcionam no servidor e no navegador).
import { supabase, supabaseConfigurado } from "./supabase";
import type { Categoria, Produto } from "./tipos";

function normaliza(p: Record<string, unknown>): Produto {
  const x = p as unknown as Produto;
  return { ...x, preco: Number(x.preco), preco_antigo: x.preco_antigo == null ? null : Number(x.preco_antigo), imagens: x.imagens ?? [], opcoes: Array.isArray(x.opcoes) ? x.opcoes : [] };
}

export async function listarCategorias(): Promise<Categoria[]> {
  if (!supabaseConfigurado) return [];
  const { data } = await supabase.from("carvieal_categorias").select("*").eq("ativo", true).order("ordem").order("nome");
  return (data as Categoria[]) ?? [];
}

export async function listarProdutos(opts: { categoriaId?: string; destaque?: boolean; limite?: number } = {}): Promise<Produto[]> {
  if (!supabaseConfigurado) return [];
  let q = supabase.from("carvieal_produtos").select("*").eq("ativo", true);
  if (opts.categoriaId) q = q.eq("categoria_id", opts.categoriaId);
  if (opts.destaque) q = q.eq("destaque", true);
  q = q.order("ordem").order("created_at", { ascending: false });
  if (opts.limite) q = q.limit(opts.limite);
  const { data } = await q;
  return (data ?? []).map(normaliza);
}

export async function obterProduto(slug: string): Promise<Produto | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await supabase.from("carvieal_produtos").select("*").eq("slug", slug).eq("ativo", true).maybeSingle();
  return data ? normaliza(data) : null;
}
