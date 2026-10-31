-- 007 · Texto dos estojos de presente no formato «Detalhes do produto» + «Características»
-- Correr uma vez no Supabase: SQL Editor > New query > colar tudo > Run.
-- Depois pode ser editado no painel, em Produtos.

update carvieal_produtos set
  descricao = 'O estojo para anel Carvieal foi pensado para apresentar e oferecer um anel com elegância. O interior acolchoado mantém a peça no lugar e protege-a, tornando o momento de oferecer ainda mais especial.

É uma opção facultativa e pode ser adicionado a qualquer anel da coleção.',
  detalhes = 'Material: Camurça, com interior acolchoado
Cor: Castanho chocolate, com interior marfim
Indicado para: Anéis
Utilização: Para oferecer ou guardar a peça
Nota: A encomenda inclui também a embalagem habitual da Carvieal'
where slug = 'estojo-anel';

update carvieal_produtos set
  descricao = 'O estojo para brincos, colares e pulseiras Carvieal foi pensado para apresentar e oferecer as tuas joias com elegância. O interior acolchoado protege a peça e valoriza cada detalhe, tornando o momento de oferecer ainda mais especial.

É uma opção facultativa e pode ser adicionado a brincos, colares ou pulseiras da coleção.',
  detalhes = 'Material: Camurça, com interior acolchoado
Cor: Castanho chocolate, com interior marfim
Indicado para: Brincos, colares e pulseiras
Utilização: Para oferecer ou guardar a peça
Nota: A encomenda inclui também a embalagem habitual da Carvieal'
where slug = 'estojo-joias';
