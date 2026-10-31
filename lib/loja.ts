// Leituras públicas do catálogo (funcionam no servidor e no navegador).
import { supabase, supabaseConfigurado } from "./supabase";
import type { Categoria, Produto } from "./tipos";

function normaliza(p: Record<string, unknown>): Produto {
  const x = p as unknown as Produto;
  return { ...x, preco: Number(x.preco), preco_antigo: x.preco_antigo == null ? null : Number(x.preco_antigo), imagens: x.imagens ?? [], avaliacao_media: Number(x.avaliacao_media ?? 0), avaliacao_total: Number(x.avaliacao_total ?? 0), opcoes: Array.isArray(x.opcoes) ? x.opcoes : [] };
}

export async function listarCategorias(): Promise<Categoria[]> {
  if (!supabaseConfigurado) return [];
  const { data } = await supabase.from("carvieal_categorias").select("*").eq("ativo", true).order("ordem").order("nome");
  return (data as Categoria[]) ?? [];
}

export async function listarProdutos(opts: { categoriaId?: string; destaque?: boolean; novidade?: boolean; busca?: string; limite?: number } = {}): Promise<Produto[]> {
  if (!supabaseConfigurado) return [];
  // O estojo de presente não aparece no catálogo (ver lib/presente.ts)
  let q = supabase.from("carvieal_produtos").select("*").eq("ativo", true).neq("slug", "estojo-presente");
  if (opts.categoriaId) q = q.eq("categoria_id", opts.categoriaId);
  if (opts.destaque) q = q.eq("destaque", true);
  if (opts.novidade) q = q.eq("novidade", true);
  if (opts.busca) q = q.ilike("nome", `%${opts.busca.replace(/[%_,()]/g, " ").trim()}%`);
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
