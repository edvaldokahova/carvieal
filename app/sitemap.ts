import type { MetadataRoute } from "next";
import { marca } from "@/lib/marca";
import { listarCategorias, listarProdutos } from "@/lib/loja";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, prods] = await Promise.all([listarCategorias(), listarProdutos()]);
  const agora = new Date();
  return [
    { url: marca.url, lastModified: agora, priority: 1 },
    { url: `${marca.url}/loja`, lastModified: agora, priority: 0.9 },
    ...cats.map((c) => ({ url: `${marca.url}/loja?categoria=${c.slug}`, lastModified: agora, priority: 0.8 })),
    ...prods.map((p) => ({ url: `${marca.url}/produto/${p.slug}`, lastModified: new Date(p.created_at), priority: 0.7 })),
    { url: `${marca.url}/perguntas`, lastModified: agora, priority: 0.5 },
    { url: `${marca.url}/termos`, lastModified: agora, priority: 0.3 },
    { url: `${marca.url}/privacidade`, lastModified: agora, priority: 0.3 },
  ];
}
