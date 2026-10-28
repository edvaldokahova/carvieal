"use client";
// Carrinho guardado no navegador do cliente (localStorage), partilhado por todas as páginas.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ItemCarrinho } from "./tipos";

const CHAVE = "carvieal-carrinho-v1";

interface CarrinhoCtx {
  itens: ItemCarrinho[];
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  adicionar: (i: Omit<ItemCarrinho, "chave" | "quantidade">, qtd?: number) => void;
  mudarQtd: (chave: string, qtd: number) => void;
  remover: (chave: string) => void;
  limpar: () => void;
  subtotal: number;
  contagem: number;
}

const Ctx = createContext<CarrinhoCtx | null>(null);

export function chaveItem(produtoId: string, opcoes: Record<string, string>) {
  return produtoId + "|" + Object.keys(opcoes).sort().map((k) => `${k}=${opcoes[k]}`).join("&");
}

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [aberto, setAberto] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (raw) setItens(JSON.parse(raw));
    } catch {
      /* sem armazenamento */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      /* ignora */
    }
  }, [itens, pronto]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
  }, [aberto]);

  const adicionar = useCallback((i: Omit<ItemCarrinho, "chave" | "quantidade">, qtd = 1) => {
    const chave = chaveItem(i.produtoId, i.opcoes);
    setItens((lista) => {
      const ex = lista.find((x) => x.chave === chave);
      if (ex) return lista.map((x) => (x.chave === chave ? { ...x, quantidade: Math.min(x.quantidade + qtd, Math.max(1, i.stock)) } : x));
      return [...lista, { ...i, chave, quantidade: Math.min(qtd, Math.max(1, i.stock)) }];
    });
    setAberto(true);
  }, []);

  const mudarQtd = useCallback((chave: string, qtd: number) => {
    setItens((lista) => lista.map((x) => (x.chave === chave ? { ...x, quantidade: Math.max(1, Math.min(qtd, Math.max(1, x.stock), 20)) } : x)));
  }, []);

  const remover = useCallback((chave: string) => setItens((l) => l.filter((x) => x.chave !== chave)), []);
  const limpar = useCallback(() => setItens([]), []);

  const valor = useMemo<CarrinhoCtx>(() => {
    const subtotal = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const contagem = itens.reduce((s, i) => s + i.quantidade, 0);
    return { itens, aberto, abrir: () => setAberto(true), fechar: () => setAberto(false), adicionar, mudarQtd, remover, limpar, subtotal, contagem };
  }, [itens, aberto, adicionar, mudarQtd, remover, limpar]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCarrinho() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCarrinho fora do CarrinhoProvider");
  return c;
}
