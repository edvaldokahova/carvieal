"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCarrinho } from "@/lib/carrinho";
import Logo from "./Logo";

export default function Cabecalho({ categorias, aviso }: { categorias: { slug: string; nome: string }[]; aviso: string }) {
  const { contagem, abrir } = useCarrinho();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [busca, setBusca] = useState(false);
  const [termo, setTermo] = useState("");
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffect(() => { if (busca) campo.current?.focus(); }, [busca]);

  const procurar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termo.trim()) return;
    setBusca(false);
    router.push(`/loja?q=${encodeURIComponent(termo.trim())}`);
  };

  const links = [
    { href: "/loja?novidades=1", nome: "Novidades" },
    ...categorias.map((c) => ({ href: `/loja?categoria=${c.slug}`, nome: c.nome })),
    { href: "/loja?destaque=1", nome: "Os favoritos Carvieal" },
    { href: "/presente", nome: "Embalagem Especial para Oferecer" },
  ];
  const icone = "grid h-11 w-11 place-items-center text-tinta";

  return (
    <>
      {aviso && <div className="bg-choco py-2 text-center text-[11px] uppercase tracking-[.14em] text-avela-light">{aviso}</div>}
      <header className="sticky top-0 z-40 border-b border-tinta/10 bg-white">
        <div className="caixa grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-[72px]">
          <div className="flex items-center">
            <button type="button" onClick={() => setMenu(true)} aria-label="Abrir menu" className={`${icone} -ml-2.5`}>
              <Menu size={24} strokeWidth={1.2} />
            </button>
            <nav className="ml-6 hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[.14em] text-tinta/80 xl:flex">
              {links.slice(0, 5).map((l) => <Link key={l.href} href={l.href} className="hover:text-choco">{l.nome}</Link>)}
            </nav>
          </div>
          <Link href="/" aria-label="Carvieal, página inicial" className="justify-self-center">
            <Logo className="h-[22px] w-auto sm:h-[26px]" />
          </Link>
          <div className="-mr-2.5 flex items-center justify-end">
            <button type="button" onClick={() => setBusca((v) => !v)} aria-label="Procurar" aria-expanded={busca} className={icone}>
              <Search size={22} strokeWidth={1.3} />
            </button>
            <button type="button" onClick={abrir} aria-label={`Abrir carrinho (${contagem} artigos)`} className={`${icone} relative`}>
              <ShoppingBag size={22} strokeWidth={1.3} />
              {contagem > 0 && <span className="absolute right-1 top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-choco px-1 text-[10px] font-medium text-white">{contagem}</span>}
            </button>
          </div>
        </div>
        {busca && (
          <form onSubmit={procurar} className="animate-fade border-t border-tinta/10 bg-white">
            <div className="caixa flex items-center gap-3 py-3">
              <Search size={18} strokeWidth={1.3} className="text-tinta/50" />
              <input ref={campo} value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Procurar anéis, colares, brincos…" aria-label="Procurar"
                className="h-11 flex-1 bg-transparent text-[16px] outline-none placeholder:text-tinta/40" />
              <button type="button" onClick={() => setBusca(false)} aria-label="Fechar pesquisa" className="grid h-10 w-10 place-items-center text-tinta/60"><X size={20} strokeWidth={1.3} /></button>
            </div>
          </form>
        )}
      </header>

      {menu && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" onClick={() => setMenu(false)} className="absolute inset-0 animate-fade bg-tinta/40" />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-entraEsq flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-tinta/10 px-5">
              <Logo className="h-5 w-auto" />
              <button type="button" onClick={() => setMenu(false)} aria-label="Fechar menu" className="-mr-2 grid h-11 w-11 place-items-center"><X size={22} strokeWidth={1.3} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 pt-4">
              {[{ href: "/loja", nome: "Ver tudo" }, ...links].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block border-b border-tinta/10 py-4 text-[13px] font-medium uppercase tracking-[.16em] text-tinta">
                  {l.nome}
                </Link>
              ))}
            </nav>
            <div className="space-y-4 border-t border-tinta/10 px-5 py-6 text-[12px] uppercase tracking-[.14em] text-tinta/70">
              <Link href="/sobre" onClick={() => setMenu(false)} className="block">Sobre nós</Link>
              <Link href="/acompanhar" onClick={() => setMenu(false)} className="block">Acompanhar encomenda</Link>
              <Link href="/perguntas" onClick={() => setMenu(false)} className="block">Perguntas frequentes</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
