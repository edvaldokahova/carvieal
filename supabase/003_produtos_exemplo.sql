-- ============================================================
-- OPCIONAL — produtos de EXEMPLO para ver a loja preenchida.
-- Os preços e textos são exemplos. Apague ou edite tudo no painel
-- (Produtos) antes de divulgar a loja.
-- ============================================================

insert into carvieal_produtos (slug, nome, descricao, detalhes, preco, stock, categoria_id, imagens, opcoes, destaque, novidade, ordem)
select v.slug, v.nome, v.descricao, v.detalhes, v.preco, v.stock, c.id, v.imagens, v.opcoes::jsonb, v.destaque, v.novidade, v.ordem
from (values
  ('anel-trio-essencial', 'Conjunto de anéis Essencial', 'Três anéis finos em prata 925: liso, torcido e com um ponto de luz.', 'Prata 925
Conjunto de 3 anéis
Acabamento polido', 18500, 10, 'aneis', array['/img/aneis.webp'], '[{"nome":"Tamanho","valores":["12","14","16","18"]}]', true, true, 1),
  ('colar-duplo-medalha', 'Colar duplo Medalha', 'Duas correntes finas com medalha redonda e barra torcida.', 'Prata 925
Comprimento: 40 cm + 45 cm
Fecho de mosquetão', 24900, 8, 'colares', array['/img/colares.webp'], '[]', true, true, 2),
  ('argolas-classicas', 'Argolas clássicas', 'Argolas leves de 15 mm, para usar todos os dias.', 'Prata 925
Diâmetro: 15 mm
Vendidas aos pares', 12900, 15, 'brincos', array['/img/brincos.webp'], '[]', true, false, 3),
  ('pulseira-corrente-e-bracelete', 'Pulseira Corrente & Bracelete', 'Uma corrente fina e um bracelete liso que se usam juntos.', 'Prata 925
Corrente ajustável 16–19 cm
Bracelete rígido 6 cm', 21500, 6, 'pulseiras', array['/img/pulseiras.webp'], '[]', true, false, 4)
) as v(slug, nome, descricao, detalhes, preco, stock, cat, imagens, opcoes, destaque, novidade, ordem)
join carvieal_categorias c on c.slug = v.cat
on conflict (slug) do nothing;
