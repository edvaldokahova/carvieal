import Image from "next/image";

// Imagens locais e do ImgBB passam pela optimização do Next; outros links usam <img> simples.
export default function Foto({ src, alt, sizes, priority = false, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  if (!src) return <div className={`absolute inset-0 bg-avela-pale ${className}`} aria-hidden />;
  const otimizavel = src.startsWith("/") || src.startsWith("https://i.ibb.co/");
  if (otimizavel) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
}
