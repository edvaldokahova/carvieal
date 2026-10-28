"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Package, ShoppingBag, X } from "lucide-react";
import { useCarrinho } from "@/lib/carrinho";
import Logo from "./Logo";

export default function Cabecalho({ categorias, aviso }: { categorias: { slug: string; nome: string }[]; aviso: string }) {
  const { contagem, abrir } = useCarrinho();
  const [menu, setMenu] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const links = [{ href: "/loja", nome: "Ver tudo" }, ...categorias.map((c) => ({ href: `/loja?categoria=${c.slug}`, nome: c.nome }))];

  return (
    <>
      {aviso && <div className="bg-choco py-2 text-center text-[12px] tracking-[.04em] text-avela-light">{aviso}</div>}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${rolou ? "border-choco/10 bg-marfim-claro/95 backdrop-blur" : "border-transparent bg-marfim-claro"}`}>
        <div className="caixa grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-[72px]">
          <div className="flex items-center gap-7">
            <button type="button" onClick={() => setMenu(true)} aria-label="Abrir menu" className="-ml-2 grid h-11 w-11 place-items-center text-choco lg:hidden">
              <Menu size={22} strokeWidth={1.4} />
            </button>
            <nav className="hidden items-center gap-7 text-[14px] text-tinta/80 lg:flex">
              {links.slice(1, 5).map((l) => (
                <Link key={l.href} href={l.href} className="transition-colors hover:text-choco">{l.nome}</Link>
              ))}
              <Link href="/loja" className="transition-colors hover:text-choco">Loja</Link>
            </nav>
          </div>
          <Link href="/" aria-label="Carvieal, página inicial" className="justify-self-center">
            <Logo className="h-[22px] w-auto sm:h-[26px]" />
          </Link>
          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link href="/acompanhar" aria-label="Acompanhar encomenda" className="hidden h-11 items-center gap-2 px-2 text-[14px] text-tinta/80 hover:text-choco sm:flex">
              <Package size={19} strokeWidth={1.4} /> <span className="hidden xl:inline">Acompanhar encomenda</span>
            </Link>
            <button type="button" onClick={abrir} aria-label={`Abrir carrinho (${contagem} artigos)`} className="relative -mr-2 grid h-11 w-11 place-items-center text-choco">
              <ShoppingBag size={21} strokeWidth={1.4} />
              {contagem > 0 && (
                <span className="absolute right-1 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-choco px-1 text-[10px] font-medium text-marfim-claro">{contagem}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" onClick={() => setMenu(false)} className="absolute inset-0 animate-fade bg-tinta/40" />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm animate-entraEsq flex-col bg-marfim-claro">
            <div className="flex h-16 items-center justify-between px-5">
              <Logo className="h-5 w-auto" />
              <button type="button" onClick={() => setMenu(false)} aria-label="Fechar menu" className="-mr-2 grid h-11 w-11 place-items-center text-choco"><X size={22} strokeWidth={1.4} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 pt-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block border-b border-choco/10 py-4 font-display text-[26px] text-choco">
                  {l.nome}
                </Link>
              ))}
            </nav>
            <div className="space-y-3 border-t border-choco/10 px-5 py-6 text-[14px] text-tinta/75">
              <Link href="/acompanhar" onClick={() => setMenu(false)} className="flex items-center gap-2"><Package size={17} strokeWidth={1.4} /> Acompanhar encomenda</Link>
              <Link href="/perguntas" onClick={() => setMenu(false)} className="block">Perguntas frequentes</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
