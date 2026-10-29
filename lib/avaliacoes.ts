// Avaliações das peças e lista de emails. A validação está no Supabase (004_avaliacoes.sql).
import { supabase, supabaseConfigurado } from "./supabase";
import type { Avaliacao } from "./tipos";

export async function avaliacoesPublicas(produtoId: string): Promise<Avaliacao[]> {
  if (!supabaseConfigurado) return [];
  try {
    const { data } = await supabase.rpc("carvieal_avaliacoes_publicas", { p_produto: produtoId });
    return (data ?? []) as Avaliacao[];
  } catch {
    return [];
  }
}

export async function avaliar(a: { produtoId: string; nome: string; telefone: string; nota: number; comentario: string }): Promise<{ publicada?: boolean; erro?: string }> {
  const { data, error } = await supabase.rpc("carvieal_avaliar", { p_produto: a.produtoId, p_nome: a.nome, p_telefone: a.telefone, p_nota: a.nota, p_comentario: a.comentario });
  if (error) return { erro: error.message || "Não foi possível enviar. Tente de novo." };
  return { publicada: Boolean((data as { publicada?: boolean })?.publicada) };
}

export async function entrarLista(email: string): Promise<string | null> {
  if (!supabaseConfigurado) return "A loja ainda não está ligada à base de dados.";
  const { error } = await supabase.rpc("carvieal_entrar_lista", { p_email: email });
  return error ? (error.message.includes("inválido") ? "Verifique o email." : "Não foi possível guardar. Tente de novo.") : null;
}

// Painel ------------------------------------------------------------------
export interface AvaliacaoAdm extends Avaliacao {
  produto_id: string;
  telefone: string;
  aprovada: boolean;
  produto: { nome: string; slug: string } | null;
}

export async function listarAvaliacoesAdm(): Promise<AvaliacaoAdm[]> {
  const { data } = await supabase.from("carvieal_avaliacoes").select("*, produto:carvieal_produtos(nome,slug)").order("created_at", { ascending: false }).limit(300);
  return (data ?? []) as AvaliacaoAdm[];
}

export async function aprovarAvaliacao(id: string, aprovada: boolean) {
  const { error } = await supabase.from("carvieal_avaliacoes").update({ aprovada }).eq("id", id);
  return error?.message ?? null;
}

export async function apagarAvaliacao(id: string) {
  const { error } = await supabase.from("carvieal_avaliacoes").delete().eq("id", id);
  return error?.message ?? null;
}

export async function listarLista(): Promise<{ id: string; email: string; created_at: string }[]> {
  const { data } = await supabase.from("carvieal_lista").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
