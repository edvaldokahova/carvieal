import { supabase } from "./supabase";

export interface PedidoInput {
  cliente: { nome: string; telefone: string; email: string };
  entrega: { localizacao: string; endereco: string; referencia: string; modalidade: string };
  metodo: "whatsapp" | "referencia" | "express";
  notas: string;
  itens: { produto_id: string; quantidade: number; opcoes: Record<string, string> }[];
}

export interface PedidoCriado {
  codigo: string;
  subtotal: number;
  taxa: number;
  total: number;
}

export async function criarEncomenda(p: PedidoInput): Promise<{ ok: true; dados: PedidoCriado } | { ok: false; erro: string }> {
  const { data, error } = await supabase.rpc("carvieal_criar_encomenda", { p });
  if (error) return { ok: false, erro: error.message || "Não foi possível registar a encomenda." };
  const d = data as PedidoCriado;
  return { ok: true, dados: { ...d, subtotal: Number(d.subtotal), taxa: Number(d.taxa), total: Number(d.total) } };
}

export interface Rastreio {
  codigo: string;
  nome: string;
  estado: string;
  historico: { estado: string; em: string }[];
  criada_em: string;
  modalidade: string;
  localizacao: string;
  endereco: string;
  metodo: string;
  pago: boolean;
  subtotal: number;
  taxa: number;
  total: number;
  itens: { nome: string; imagem: string; opcoes: Record<string, string>; preco: number; quantidade: number }[];
}

export async function rastrear(codigo: string, telefone: string): Promise<Rastreio | null> {
  const { data, error } = await supabase.rpc("carvieal_rastrear", { p_codigo: codigo, p_telefone: telefone });
  if (error || !data) return null;
  return data as Rastreio;
}

// Encomendas feitas neste navegador (para a cliente voltar ao rastreio sem procurar o código).
const CHAVE = "carvieal-encomendas-v1";
export function guardarLocal(codigo: string, telefone: string) {
  try {
    const l = JSON.parse(localStorage.getItem(CHAVE) || "[]") as { codigo: string; telefone: string; em: string }[];
    l.unshift({ codigo, telefone, em: new Date().toISOString() });
    localStorage.setItem(CHAVE, JSON.stringify(l.slice(0, 10)));
  } catch {
    /* ignora */
  }
}
export function lerLocal(): { codigo: string; telefone: string; em: string }[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "[]");
  } catch {
    return [];
  }
}

const CLIENTE = "carvieal-cliente-v1";
export function lembrarCliente(d: Record<string, string>) {
  try { localStorage.setItem(CLIENTE, JSON.stringify(d)); } catch { /* ignora */ }
}
export function clienteGuardado(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(CLIENTE) || "{}"); } catch { return {}; }
}

export function mensagemWhatsApp(codigo: string, nome: string, linhas: string[], total: string, modalidade: string) {
  return [
    `Olá, Carvieal! Sou ${nome}.`,
    `Fiz a encomenda *${codigo}* no site:`,
    "",
    ...linhas,
    "",
    `Entrega: ${modalidade}`,
    `*Total: ${total}*`,
    "",
    "Vou enviar o comprovativo de pagamento por aqui.",
  ].join("\n");
}
