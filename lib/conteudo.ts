import { supabase, supabaseConfigurado, STORE_SLUG } from "./supabase";
import type { Conteudo } from "./tipos";

export const conteudoPadrao: Conteudo = {
  heroImagem: "/img/hero.webp",
  heroVideo: "/video/hero.mp4",
  heroTitulo: "Elegance you wear every single day.",
  heroTexto: "Joias em prata 925 pensadas para o dia a dia. Entregamos em casa, em Luanda.",
  instagram: "",
  tiktok: "",
  facebook: "",
  email: "",
  entregas: [
    { nome: "Entrega em Luanda", descricao: "Por motoboy, em 24 a 48 horas úteis", taxa: 2500, gratis: true },
    { nome: "Entrega expressa em Luanda", descricao: "No mesmo dia, para encomendas confirmadas até às 14h", taxa: 4000 },
    { nome: "Outras províncias", descricao: "Por transportadora. A taxa é combinada no WhatsApp", taxa: 0 },
  ],
  instrucoesPagamento:
    "Envia o comprovativo de pagamento pelo WhatsApp. Os dados para transferência ou Multicaixa Express são enviados na conversa.",
  avisoTopo: "Entrega gratuita em compras a partir de 150.000 Kz",
  entregaGratisAcima: 150000,
};

export async function obterStoreId(): Promise<string | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await supabase.from("stores").select("id").eq("slug", STORE_SLUG).maybeSingle();
  return data?.id ?? null;
}

export async function obterConteudo(): Promise<Conteudo> {
  if (!supabaseConfigurado) return conteudoPadrao;
  try {
    const id = await obterStoreId();
    if (!id) return conteudoPadrao;
    const { data } = await supabase.from("store_content").select("data").eq("store_id", id).maybeSingle();
    const d = (data?.data ?? {}) as Partial<Conteudo>;
    return { ...conteudoPadrao, ...d, heroVideo: d.heroVideo ?? conteudoPadrao.heroVideo, entregaGratisAcima: Number(d.entregaGratisAcima ?? conteudoPadrao.entregaGratisAcima) || 0, entregas: Array.isArray(d.entregas) && d.entregas.length ? d.entregas : conteudoPadrao.entregas };
  } catch {
    return conteudoPadrao;
  }
}

export async function guardarConteudo(c: Conteudo): Promise<string | null> {
  const id = await obterStoreId();
  if (!id) return "Loja não encontrada. Correu o ficheiro supabase/001_carvieal.sql?";
  const { data, error } = await supabase
    .from("store_content")
    .update({ data: c, updated_at: new Date().toISOString() })
    .eq("store_id", id)
    .select();
  if (error) return error.message;
  if (!data?.length) return "Sem permissão para guardar. Só a gerência pode alterar as definições.";
  return null;
}
