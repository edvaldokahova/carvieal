-- 006 · Embalagem especial para presente (estojo)
-- Correr uma vez no Supabase: SQL Editor > New query > colar tudo > Run.
-- Cria o estojo como um produto da loja (não aparece no catálogo).
-- Depois, o preço, a foto e o stock mudam-se no painel, em Produtos › «Embalagem especial para presente».

insert into carvieal_produtos (slug, nome, descricao, detalhes, preco, stock, imagens, opcoes, destaque, novidade, ativo, ordem)
values (
  'estojo-presente',
  'Embalagem especial para presente',
  'Estojo em camurça para oferecer a tua peça Carvieal. Opção facultativa: a encomenda continua a seguir na embalagem normal da Carvieal.',
  'Estojo em camurça com interior acolchoado',
  5000,
  50,
  array['/img/estojo.webp'],
  '[]'::jsonb,
  false, false, true, 999
)
on conflict (slug) do nothing;
