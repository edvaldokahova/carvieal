import Link from "next/link";
import { marca } from "@/lib/marca";
import { waLink } from "@/lib/formato";
import type { Conteudo } from "@/lib/tipos";
import Logo from "./Logo";

export default function Rodape({ c, categorias }: { c: Conteudo; categorias: { slug: string; nome: string }[] }) {
  const redes = [
    { nome: "Instagram", href: c.instagram },
    { nome: "TikTok", href: c.tiktok },
    { nome: "Facebook", href: c.facebook },
  ].filter((r) => r.href);
  return (
    <footer className="bg-choco text-avela-light">
      <div className="caixa grid gap-12 py-16 sm:py-20 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo claro className="h-6 w-auto" />
          <p className="mt-5 max-w-xs font-display text-[19px] leading-snug text-avela">{marca.slogan}</p>
        </div>
        <div>
          <p className="mb-4 text-[13px] text-avela/70">Colecção</p>
          <ul className="space-y-2.5 text-[14px]">
            {categorias.map((k) => (
              <li key={k.slug}><Link href={`/loja?categoria=${k.slug}`} className="hover:text-marfim-claro">{k.nome}</Link></li>
            ))}
            <li><Link href="/loja" className="hover:text-marfim-claro">Ver tudo</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[13px] text-avela/70">Ajuda</p>
          <ul className="space-y-2.5 text-[14px]">
            <li><Link href="/acompanhar" className="hover:text-marfim-claro">Acompanhar encomenda</Link></li>
            <li><Link href="/perguntas" className="hover:text-marfim-claro">Perguntas frequentes</Link></li>
            <li><Link href="/termos" className="hover:text-marfim-claro">Termos, entregas e trocas</Link></li>
            <li><Link href="/privacidade" className="hover:text-marfim-claro">Privacidade</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[13px] text-avela/70">Contacto</p>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href={waLink(marca.whatsapp, "Olá, Carvieal!")} target="_blank" rel="noopener noreferrer" className="hover:text-marfim-claro">WhatsApp {marca.whatsappVisivel}</a></li>
            {c.email && <li><a href={`mailto:${c.email}`} className="hover:text-marfim-claro">{c.email}</a></li>}
            {redes.map((r) => (
              <li key={r.nome}><a href={r.href} target="_blank" rel="noopener noreferrer" className="hover:text-marfim-claro">{r.nome}</a></li>
            ))}
            <li className="text-avela/70">{marca.cidade}. Loja exclusivamente online.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-avela/15">
        <div className="caixa flex flex-col gap-2 py-6 text-[12px] text-avela/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {marca.nome}. Propriedade de {marca.dona}.</span>
          <span>Joias em prata 925.</span>
        </div>
      </div>
    </footer>
  );
}
