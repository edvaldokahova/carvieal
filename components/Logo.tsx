import Image from "next/image";

export default function Logo({ claro = false, className = "h-6 w-auto" }: { claro?: boolean; className?: string }) {
  return <Image src={claro ? "/img/logo-claro.png" : "/img/logo.png"} alt="Carvieal" width={631} height={116} priority className={className} />;
}
