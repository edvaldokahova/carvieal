import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { marca } from "@/lib/marca";
import { CarrinhoProvider } from "@/lib/carrinho";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Jost({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const titulo = `${marca.nome} — Joias em prata 925`;
const descricao = "Joias em prata 925 para usar todos os dias. Anéis, colares, brincos e pulseiras com entrega em casa, em Luanda.";

export const metadata: Metadata = {
  metadataBase: new URL(marca.url),
  title: { default: titulo, template: `%s · ${marca.nome}` },
  description: descricao,
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: { type: "website", locale: "pt_AO", siteName: marca.nome, title: titulo, description: descricao, images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#4F2C1D", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CarrinhoProvider>{children}</CarrinhoProvider>
      </body>
    </html>
  );
}
