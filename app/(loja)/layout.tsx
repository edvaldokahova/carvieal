import { obterConteudo } from "@/lib/conteudo";
import { listarCategorias } from "@/lib/loja";
import Cabecalho from "@/components/Cabecalho";
import CarrinhoGaveta from "@/components/CarrinhoGaveta";
import Rodape from "@/components/Rodape";

export const revalidate = 60;

export default async function LojaLayout({ children }: { children: React.ReactNode }) {
  const [c, categorias] = await Promise.all([obterConteudo(), listarCategorias()]);
  const cats = categorias.map((k) => ({ slug: k.slug, nome: k.nome }));
  return (
    <>
      <Cabecalho categorias={cats} aviso={c.avisoTopo} />
      <main id="conteudo">{children}</main>
      <Rodape c={c} categorias={cats} />
      <CarrinhoGaveta gratisAcima={c.entregaGratisAcima} />
    </>
  );
}
