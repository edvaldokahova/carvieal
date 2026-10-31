export interface Categoria {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  imagem: string;
  ordem: number;
  ativo: boolean;
}

export interface Opcao {
  nome: string;
  valores: string[];
}

export interface Produto {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  detalhes: string;
  preco: number;
  preco_antigo: number | null;
  stock: number;
  categoria_id: string | null;
  imagens: string[];
  opcoes: Opcao[];
  destaque: boolean;
  novidade: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  avaliacao_media: number;
  avaliacao_total: number;
}

export type Estado = "pendente" | "confirmada" | "em_preparacao" | "enviada" | "entregue" | "cancelada";

export const ESTADOS: { id: Estado; nome: string; descricao: string }[] = [
  { id: "pendente", nome: "Pendente", descricao: "Recebemos a encomenda e aguardamos a confirmação do pagamento." },
  { id: "confirmada", nome: "Confirmada", descricao: "Pagamento verificado e artigos reservados." },
  { id: "em_preparacao", nome: "Em preparação", descricao: "A tua encomenda está a ser embalada." },
  { id: "enviada", nome: "Enviada", descricao: "O motoboy está a caminho da tua morada." },
  { id: "entregue", nome: "Entregue", descricao: "Encomenda entregue. Obrigada pela preferência." },
  { id: "cancelada", nome: "Cancelada", descricao: "Esta encomenda foi cancelada." },
];

export function nomeEstado(e: string) {
  return ESTADOS.find((x) => x.id === e)?.nome ?? e;
}

export interface Entrega {
  nome: string;
  descricao: string;
  taxa: number;
}

export interface Conteudo {
  heroImagem: string;
  heroVideo: string;
  heroTitulo: string;
  heroTexto: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  email: string;
  entregas: Entrega[];
  instrucoesPagamento: string;
  avisoTopo: string;
  /** Entrega grátis quando o subtotal é igual ou superior a este valor (Kz). 0 = desligado. */
  entregaGratisAcima: number;
}

export interface ItemCarrinho {
  chave: string; // produto + opções
  produtoId: string;
  slug: string;
  nome: string;
  imagem: string;
  preco: number;
  opcoes: Record<string, string>;
  quantidade: number;
  stock: number;
}

export interface Avaliacao {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  verificada: boolean;
  created_at: string;
}
