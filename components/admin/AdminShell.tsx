"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Settings, ShoppingBag, Tags, Users, UserCog, ExternalLink } from "lucide-react";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import { meuAcesso, type Acesso } from "@/lib/admin";
import Logo from "@/components/Logo";

const AcessoCtx = createContext<Acesso>({ gerente: false, permissoes: [] });
export const useAcesso = () => useContext(AcessoCtx);
export const pode = (a: Acesso, p: string) => a.gerente || a.permissoes.includes(p);

const LINKS = [
  { href: "/admin", nome: "Resumo", icon: LayoutDashboard, perm: "" },
  { href: "/admin/encomendas", nome: "Encomendas", icon: ShoppingBag, perm: "encomendas" },
  { href: "/admin/produtos", nome: "Produtos", icon: Package, perm: "produtos" },
  { href: "/admin/categorias", nome: "Categorias", icon: Tags, perm: "produtos" },
  { href: "/admin/clientes", nome: "Clientes", icon: Users, perm: "clientes" },
  { href: "/admin/equipa", nome: "Equipa", icon: UserCog, perm: "gerente" },
  { href: "/admin/definicoes", nome: "Definições", icon: Settings, perm: "gerente" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/admin";
  const router = useRouter();
  const [acesso, setAcesso] = useState<Acesso | null>(null);
  const [estado, setEstado] = useState<"a-verificar" | "ok" | "sem-acesso">("a-verificar");
  const publica = path === "/admin/entrar";

  useEffect(() => {
    if (publica || !supabaseConfigurado) return;
    let ativo = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.replace("/admin/entrar");
      const a = await meuAcesso();
      if (!ativo) return;
      if (!a || (!a.gerente && a.permissoes.length === 0)) { setEstado("sem-acesso"); setAcesso(a); return; }
      setAcesso(a);
      setEstado("ok");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") router.replace("/admin/entrar"); });
    return () => { ativo = false; sub.subscription.unsubscribe(); };
  }, [publica, router]);

  if (!supabaseConfigurado) {
    return <div className="grid min-h-screen place-items-center bg-marfim p-8 text-center text-[15px] text-tinta/70">O painel precisa das variáveis do Supabase configuradas na Vercel.</div>;
  }
  if (publica) return <>{children}</>;

  const sair = async () => { await supabase.auth.signOut(); router.replace("/admin/entrar"); };

  if (estado === "a-verificar") return <div className="grid min-h-screen place-items-center bg-marfim text-[14px] text-tinta/55">A verificar o acesso…</div>;
  if (estado === "sem-acesso") {
    return (
      <div className="grid min-h-screen place-items-center bg-marfim p-8 text-center">
        <div className="max-w-sm">
          <Logo className="mx-auto h-6 w-auto" />
          <p className="mt-8 text-[16px]">Esta conta ainda não tem acesso ao painel da Carvieal.</p>
          <p className="mt-2 text-[14px] text-tinta/60">Peça à gerência para a adicionar em Equipa, com o mesmo email que usou para entrar.</p>
          <button onClick={sair} className="btn-linha mt-8">Sair</button>
        </div>
      </div>
    );
  }

  const a = acesso!;
  const links = LINKS.filter((l) => !l.perm || (l.perm === "gerente" ? a.gerente : pode(a, l.perm)));
  const ativo = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return (
    <AcessoCtx.Provider value={a}>
      <div className="min-h-screen bg-marfim text-tinta">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-choco px-4 py-7 text-avela-light lg:flex">
          <Link href="/admin" className="px-3"><Logo claro className="h-5 w-auto" /></Link>
          <p className="mt-2 px-3 text-[12px] text-avela/60">{a.gerente ? "Gerência" : a.nome}</p>
          <nav className="mt-8 flex-1 space-y-0.5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`flex items-center gap-3 rounded px-3 py-2.5 text-[14px] transition-colors ${ativo(l.href) ? "bg-avela/15 text-marfim-claro" : "text-avela-light/70 hover:text-marfim-claro"}`}>
                <l.icon size={17} strokeWidth={1.6} /> {l.nome}
              </Link>
            ))}
          </nav>
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-avela-light/70 hover:text-marfim-claro"><ExternalLink size={16} /> Ver a loja</a>
          <button onClick={sair} className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-avela-light/70 hover:text-marfim-claro"><LogOut size={16} /> Sair</button>
        </aside>

        {/* Telemóvel: barra inferior com as secções */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-choco/10 bg-marfim-claro px-4 lg:hidden">
          <Logo className="h-[18px] w-auto" />
          <button onClick={sair} aria-label="Sair" className="grid h-10 w-10 place-items-center text-choco"><LogOut size={18} /></button>
        </header>
        <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-choco/10 bg-marfim-claro pb-[env(safe-area-inset-bottom)] lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`flex min-w-[72px] flex-1 flex-col items-center gap-1 py-2.5 text-[11px] ${ativo(l.href) ? "text-choco" : "text-tinta/50"}`}>
              <l.icon size={19} strokeWidth={1.6} /> {l.nome}
            </Link>
          ))}
        </nav>

        <main className="px-4 pb-28 pt-6 sm:px-8 lg:ml-60 lg:px-12 lg:pb-16 lg:pt-10">{children}</main>
      </div>
    </AcessoCtx.Provider>
  );
}
