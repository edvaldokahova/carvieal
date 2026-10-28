// Dados fixos da marca. Contactos e redes editáveis estão no painel (Definições).
export const marca = {
  nome: "Carvieal",
  slogan: "Elegance you wear every single day.",
  dona: "Carla Viegas",
  whatsapp: "244930746575", // suporte e finalização de encomendas
  whatsappVisivel: "+244 930 746 575",
  cidade: "Luanda, Angola",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://carvieal.vercel.app",
};

/** Pagamento imediato (referência / Multicaixa Express): fica activo quando a API for integrada. */
export const PAGAMENTO_IMEDIATO_ATIVO = false;
