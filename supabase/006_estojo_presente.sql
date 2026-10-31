-- 006 · Embalagem especial para presente: 2 estojos
-- Correr uma vez no Supabase: SQL Editor > New query > colar tudo > Run.
-- Cria os estojos como produtos da loja (não aparecem no catálogo).
-- Depois, o preço, a foto e o stock de cada um mudam-se no painel, em Produtos.

insert into carvieal_produtos (slug, nome, descricao, detalhes, preco, stock, imagens, opcoes, destaque, novidade, ativo, ordem)
values
  ('estojo-anel', 'Estojo de presente para anel',
   'Estojo em camurça para oferecer um anel Carvieal. Opção facultativa: a encomenda segue também na embalagem normal da Carvieal.',
   'Estojo em camurça com interior acolchoado', 5000, 50, array['/img/estojo-anel.webp'], '[]'::jsonb, false, false, true, 998),
  ('estojo-joias', 'Estojo de presente para brincos, colares e pulseiras',
   'Estojo em camurça para oferecer brincos, colares ou pulseiras Carvieal. Opção facultativa: a encomenda segue também na embalagem normal da Carvieal.',
   'Estojo em camurça com interior acolchoado', 5000, 50, array['/img/estojo-joias.webp'], '[]'::jsonb, false, false, true, 999)
on conflict (slug) do nothing;

-- Se a versão anterior (um só estojo) já tinha sido criada, fica desativada
update carvieal_produtos set ativo = false where slug = 'estojo-presente';
