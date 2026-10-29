"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Foto from "./Foto";

// Carrossel editorial: fotografias grandes lado a lado, desliza com o dedo ou com as setas.
export default function Carrossel({ itens }: { itens: { href: string; img: string; nome: string }[] }) {
  const faixa = useRef<HTMLDivElement>(null);
  const mover = (dir: number) => {
    const f = faixa.current;
    if (f) f.scrollBy({ left: dir * f.clientWidth * 0.66, behavior: "smooth" });
  };
  const seta = "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center text-white [filter:drop-shadow(0_1px_6px_rgba(0,0,0,.35))]";
  return (
    <div className="relative">
      <div ref={faixa} className="flex snap-x snap-mandatory gap-[3px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {itens.map((t) => (
          <Link key={t.href} href={t.href} className="group relative block aspect-[3/4] w-[66%] shrink-0 snap-start overflow-hidden bg-avela-pale sm:w-[40%] lg:w-[33.2%]">
            <Foto src={t.img} alt={t.nome} sizes="(max-width: 640px) 66vw, 40vw" className="transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-12 text-[12px] font-medium uppercase tracking-[.16em] text-white sm:px-6 sm:pb-6 sm:text-[14px]">{t.nome}</span>
          </Link>
        ))}
      </div>
      <button type="button" onClick={() => mover(-1)} aria-label="Anterior" className={`${seta} left-2`}><ChevronLeft size={30} strokeWidth={1.2} /></button>
      <button type="button" onClick={() => mover(1)} aria-label="Seguinte" className={`${seta} right-2`}><ChevronRight size={30} strokeWidth={1.2} /></button>
    </div>
  );
}
