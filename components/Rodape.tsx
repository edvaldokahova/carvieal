import Link from "next/link";
import { marca } from "@/lib/marca";
import { waLink } from "@/lib/formato";
import type { Conteudo } from "@/lib/tipos";
import Logo from "./Logo";
import ListaEmail from "./ListaEmail";

const link = "block py-2 text-[12px] uppercase tracking-[.14em] text-tinta/65 transition-colors hover:text-tinta sm:text-[13px]";
const titulo = "mb-3 text-[13px] font-semibold uppercase tracking-[.14em] text-tinta sm:text-[14px]";

export default function Rodape({ c, categorias }: { c: Conteudo; categorias: { slug: string; nome: string }[] }) {
  const redes = [
    { nome: "Instagram", href: c.instagram },
    { nome: "TikTok", href: c.tiktok },
    { nome: "Facebook", href: c.facebook },
  ].filter((r) => r.href);
  return (
    <footer className="border-t border-tinta/10 bg-white text-tinta">
      <div className="caixa py-14 sm:py-20">
        <div className="max-w-xl">
          <p className={titulo}>Junte-se à lista</p>
          <p className="mb-6 text-[12px] uppercase leading-relaxed tracking-[.1em] text-tinta/65 sm:text-[13px]">
            Inscreva-se e seja a primeira a saber das novidades, peças exclusivas e promoções.
          </p>
          <ListaEmail />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <nav aria-label="Apoio">
            <p className={titulo}>Apoio</p>
            <Link href="/acompanhar" className={link}>Acompanhar encomenda</Link>
            <Link href="/termos" className={link}>Entregas e trocas</Link>
            <Link href="/perguntas" className={link}>Perguntas frequentes</Link>
            <a href={waLink(marca.whatsapp, "Olá, Carvieal!")} target="_blank" rel="noopener noreferrer" className={link}>Contacte-nos</a>
          </nav>
          <nav aria-label="Geral">
            <p className={titulo}>Geral</p>
            <Link href="/loja" className={link}>Loja</Link>
            <Link href="/sobre" className={link}>Sobre nós</Link>
            <Link href="/perguntas#cuidados" className={link}>Cuidados com a prata</Link>
            <Link href="/termos" className={link}>Termos e condições</Link>
            <Link href="/privacidade" className={link}>Privacidade</Link>
          </nav>
          <nav aria-label="Colecção">
            <p className={titulo}>Colecção</p>
            {categorias.map((k) => <Link key={k.slug} href={`/loja?categoria=${k.slug}`} className={link}>{k.nome}</Link>)}
          </nav>
          <div>
            <p className={titulo}>Siga-nos</p>
            {redes.map((r) => <a key={r.nome} href={r.href} target="_blank" rel="noopener noreferrer" className={link}>{r.nome}</a>)}
            <a href={waLink(marca.whatsapp, "Olá, Carvieal!")} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp</a>
            {c.email && <a href={`mailto:${c.email}`} className={`${link} normal-case tracking-normal`}>{c.email}</a>}
          </div>
        </div>
      </div>
      <div className="border-t border-tinta/10">
        <div className="caixa flex flex-col items-center gap-3 py-8 text-center">
          <Logo className="h-5 w-auto" />
          <p className="text-[11px] uppercase tracking-[.14em] text-tinta/50">© {new Date().getFullYear()} {marca.nome}. Prata 925. {marca.cidade}.</p>
        </div>
      </div>
    </footer>
  );
}
