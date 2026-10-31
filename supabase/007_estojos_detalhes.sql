-- 007 · Texto dos estojos de presente no formato «Detalhes do produto» + «Características»
-- Correr uma vez no Supabase: SQL Editor > New query > colar tudo > Run.
-- Depois pode ser editado no painel, em Produtos.

update carvieal_produtos set
  descricao = 'Um detalhe especial para tornar o momento de oferecer ainda mais memorável.

Com um design simples e intemporal, o mini estojo apresenta um acabamento elegante em tom taupe (bege acinzentado), ideal para complementar a apresentação de uma joia Carvieal.

O seu interior acolchoado permite acomodar e apresentar delicadamente um anel, tornando-o uma opção especial para quem deseja oferecer uma joia com uma apresentação cuidada.',
  detalhes = 'Material: Pele sintética (PU).
Dimensões: 6 × 5 cm.
Design: Estojo compacto com estrutura rígida.
Capacidade: Um anel ou um par de brincos pequenos.
Cor: Taupe (bege acinzentado).
Nota: Disponível como opção adicional na compra de uma joia Carvieal.'
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
