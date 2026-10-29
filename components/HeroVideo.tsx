"use client";
import { useEffect, useRef, useState } from "react";
import Foto from "./Foto";

// Vídeo de fundo do topo. Enquanto carrega (ou se o telemóvel poupar dados) mostra a fotografia.
export default function HeroVideo({ video, imagem, alt }: { video: string; imagem: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [aTocar, setATocar] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir) return;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0">
      <Foto src={imagem} alt={alt} sizes="100vw" priority className="object-[80%_center] sm:object-center" />
      {video && (
        <video ref={ref} src={video} poster={imagem} muted loop playsInline autoPlay preload="metadata" aria-hidden onPlaying={() => setATocar(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[80%_center] transition-opacity duration-700 sm:object-center ${aTocar ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}
