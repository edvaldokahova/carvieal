import Link from "next/link";
import Logo from "@/components/Logo";

export default function NaoEncontrado() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-marfim-claro px-6 text-center">
      <div>
        <Logo className="mx-auto h-6 w-auto" />
        <h1 className="titulo mt-12 text-[40px]">Esta página não existe.</h1>
        <p className="mt-3 text-tinta/65">Pode ter sido removida ou o link está incompleto.</p>
        <Link href="/loja" className="btn-choco mt-8">Ver a colecção</Link>
      </div>
    </main>
  );
}
