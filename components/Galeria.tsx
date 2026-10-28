"use client";
import { useRef, useState } from "react";
import Foto from "./Foto";

// Telemóvel: deslizar entre fotos. Computador: fotos empilhadas em coluna.
export default function Galeria({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const lista = imagens.length ? imagens : [""];
  const onScroll = () => {
    const el = ref.current;
    if (el) setI(Math.round(el.scrollLeft / el.clientWidth));
  };
  return (
    <div>
      <div ref={ref} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:hidden">
        {lista.map((src, k) => (
          <div key={k} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-avela-pale">
            <Foto src={src} alt={`${nome}, foto ${k + 1}`} sizes="100vw" priority={k === 0} />
          </div>
        ))}
      </div>
      {lista.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
          {lista.map((_, k) => <span key={k} className={`h-[3px] transition-all ${k === i ? "w-6 bg-choco" : "w-3 bg-choco/25"}`} />)}
        </div>
      )}
      <div className="hidden gap-3 md:grid">
        {lista.map((src, k) => (
          <div key={k} className="relative aspect-[4/5] w-full bg-avela-pale">
            <Foto src={src} alt={`${nome}, foto ${k + 1}`} sizes="55vw" priority={k === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
