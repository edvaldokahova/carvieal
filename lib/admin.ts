// Consultas do painel. As regras de acesso (RLS) estão no Supabase: cada pessoa só lê/edita o que pode.
import { supabase } from "./supabase";
import type { Categoria, Produto } from "./tipos";

export interface Acesso {
  gerente: boolean;
  nome?: string;
  funcao?: string;
  permissoes: string[];
}

export async function meuAcesso(): Promise<Acesso | null> {
  const { data, error } = await supabase.rpc("carvieal_meu_acesso");
  if (error || !data) return null;
  return data as Acesso;
}

export interface EncomendaAdm {
  id: string;
  codigo: string;
  cliente_id: string | null;
  nome: string;
  telefone: string;
  email: string;
  localizacao: string;
  endereco: string;
  referencia: string;
  modalidade: string;
  taxa_entrega: number;
  subtotal: number;
  total: number;
  metodo_pagamento: string;
  pago: boolean;
  estado: string;
  notas_cliente: string;
  notas_internas: string;
  historico: { estado: string; em: string; por?: string }[];
  created_at: string;
  updated_at: string;
}

export interface ItemAdm {
  id: string;
  nome: string;
  imagem: string;
  opcoes: Record<string, string>;
  preco: number;
  quantidade: number;
  produto_id: string | null;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  localizacao: string;
  endereco: string;
  notas: string;
  created_at: string;
}

export interface Funcionario {
  id: string;
  email: string;
  nome: string;
  funcao: string;
  permissoes: string[];
  user_id: string | null;
  ativo: boolean;
}

const num = <T extends Record<string, unknown>>(o: T, ks: (keyof T)[]) => {
  const c = { ...o };
  ks.forEach((k) => ((c as Record<string, unknown>)[k as string] = Number(o[k])));
  return c;
};

export async function listarEncomendas(): Promise<EncomendaAdm[]> {
  const { data } = await supabase.from("carvieal_encomendas").select("*").order("created_at", { ascending: false }).limit(500);
  return (data ?? []).map((e) => num(e as EncomendaAdm & Record<string, unknown>, ["total", "subtotal", "taxa_entrega"]));
}

export async function obterEncomenda(id: string) {
  const [{ data: e }, { data: itens }] = await Promise.all([
    supabase.from("carvieal_encomendas").select("*").eq("id", id).maybeSingle(),
    supabase.from("carvieal_encomenda_itens").select("*").eq("encomenda_id", id),
  ]);
  return {
    encomenda: e ? num(e as EncomendaAdm & Record<string, unknown>, ["total", "subtotal", "taxa_entrega"]) : null,
    itens: (itens ?? []).map((i) => ({ ...(i as ItemAdm), preco: Number(i.preco) })),
  };
}

export async function mudarEstado(id: string, estado: string) {
  const { error } = await supabase.rpc("carvieal_mudar_estado", { p_id: id, p_estado: estado });
  return error?.message ?? null;
}

export async function guardarNotas(id: string, notas: string) {
  const { error } = await supabase.from("carvieal_encomendas").update({ notas_internas: notas, updated_at: new Date().toISOString() }).eq("id", id);
  return error?.message ?? null;
}

export async function listarProdutosAdm(): Promise<Produto[]> {
  const { data } = await supabase.from("carvieal_produtos").select("*").order("ordem").order("created_at", { ascending: false });
  return (data ?? []).map((p) => ({ ...(p as Produto), preco: Number(p.preco), preco_antigo: p.preco_antigo == null ? null : Number(p.preco_antigo), opcoes: Array.isArray(p.opcoes) ? p.opcoes : [] }));
}

export async function obterProdutoAdm(id: string): Promise<Produto | null> {
  const { data } = await supabase.from("carvieal_produtos").select("*").eq("id", id).maybeSingle();
  return data ? { ...(data as Produto), preco: Number(data.preco), preco_antigo: data.preco_antigo == null ? null : Number(data.preco_antigo), opcoes: Array.isArray(data.opcoes) ? data.opcoes : [] } : null;
}

export async function guardarProduto(id: string | null, p: Partial<Produto>) {
  const q = id ? supabase.from("carvieal_produtos").update(p).eq("id", id).select("id") : supabase.from("carvieal_produtos").insert(p).select("id");
  const { data, error } = await q;
  if (error) return error.message.includes("duplicate") ? "Já existe uma peça com este endereço (slug). Mude o nome ou o endereço." : error.message;
  if (!data?.length) return "Sem permissão para guardar produtos.";
  return null;
}

export async function apagarProduto(id: string) {
  const { error } = await supabase.from("carvieal_produtos").delete().eq("id", id);
  return error?.message ?? null;
}

export async function listarCategoriasAdm(): Promise<Categoria[]> {
  const { data } = await supabase.from("carvieal_categorias").select("*").order("ordem").order("nome");
  return (data as Categoria[]) ?? [];
}

export async function guardarCategoria(id: string | null, c: Partial<Categoria>) {
  const q = id ? supabase.from("carvieal_categorias").update(c).eq("id", id).select("id") : supabase.from("carvieal_categorias").insert(c).select("id");
  const { data, error } = await q;
  if (error) return error.message.includes("duplicate") ? "Já existe uma categoria com este nome." : error.message;
  if (!data?.length) return "Sem permissão para guardar categorias.";
  return null;
}

export async function apagarCategoria(id: string) {
  const { error } = await supabase.from("carvieal_categorias").delete().eq("id", id);
  return error?.message ?? null;
}

export async function listarClientes(): Promise<Cliente[]> {
  const { data } = await supabase.from("carvieal_clientes").select("*").order("updated_at", { ascending: false }).limit(1000);
  return (data as Cliente[]) ?? [];
}

export async function listarEquipa(): Promise<Funcionario[]> {
  const { data } = await supabase.from("carvieal_equipa").select("*").order("created_at");
  return (data as Funcionario[]) ?? [];
}

export async function guardarFuncionario(id: string | null, f: Partial<Funcionario>) {
  const dados = { ...f, email: f.email?.trim().toLowerCase() };
  const q = id ? supabase.from("carvieal_equipa").update(dados).eq("id", id).select("id") : supabase.from("carvieal_equipa").insert(dados).select("id");
  const { data, error } = await q;
  if (error) {
    if (error.message.includes("Limite")) return "Já tem 5 funcionários. Remova um para adicionar outro.";
    if (error.message.includes("duplicate")) return "Este email já está na equipa.";
    return error.message;
  }
  if (!data?.length) return "Só a gerência pode gerir a equipa.";
  return null;
}

export async function removerFuncionario(id: string) {
  const { error } = await supabase.from("carvieal_equipa").delete().eq("id", id);
  return error?.message ?? null;
}

export const PERMISSOES: { id: string; nome: string; descricao: string }[] = [
  { id: "encomendas", nome: "Encomendas", descricao: "Ver encomendas, mudar o estado e avisar clientes" },
  { id: "produtos", nome: "Produtos e categorias", descricao: "Criar, editar e esconder peças, preços e stock" },
  { id: "clientes", nome: "Clientes", descricao: "Ver a lista de clientes e o histórico de compras" },
];

export const FUNCOES: { nome: string; permissoes: string[] }[] = [
  { nome: "Atendimento e encomendas", permissoes: ["encomendas", "clientes"] },
  { nome: "Gestão de produtos", permissoes: ["produtos"] },
  { nome: "Gestão completa da loja", permissoes: ["encomendas", "produtos", "clientes"] },
];
