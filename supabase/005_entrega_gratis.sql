-- 005 · Entrega grátis automática a partir de um valor (ex.: 150.000 Kz)
-- Correr uma vez no Supabase: SQL Editor > New query > colar tudo > Run.

-- 1) Liga a entrega grátis a partir de 150.000 Kz e muda a frase do topo da loja
update store_content c
set data = c.data
  || jsonb_build_object('entregaGratisAcima', 150000)
  || jsonb_build_object('avisoTopo', 'Entregas grátis em compras iguais ou superiores a 150.000 Kz')
from stores s
where s.id = c.store_id and s.slug = 'carvieal';

-- 2) A encomenda passa a calcular a entrega grátis no servidor (o site não pode ser enganado)
create or replace function carvieal_criar_encomenda(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_tel text := regexp_replace(coalesce(p->'cliente'->>'telefone', ''), '\D', '', 'g');
  v_nome text := trim(coalesce(p->'cliente'->>'nome', ''));
  v_email text := lower(trim(coalesce(p->'cliente'->>'email', '')));
  v_local text := trim(coalesce(p->'entrega'->>'localizacao', ''));
  v_end text := trim(coalesce(p->'entrega'->>'endereco', ''));
  v_ref text := trim(coalesce(p->'entrega'->>'referencia', ''));
  v_mod text := trim(coalesce(p->'entrega'->>'modalidade', ''));
  v_metodo text := coalesce(p->>'metodo', 'whatsapp');
  v_notas text := left(trim(coalesce(p->>'notas', '')), 500);
  v_taxa numeric := 0;
  v_sub numeric := 0;
  v_cliente uuid;
  v_id uuid;
  v_codigo text;
  v_item jsonb;
  v_prod carvieal_produtos%rowtype;
  v_qtd int;
  v_entregas jsonb;
  v_ent jsonb;
  v_gratis numeric := 0;
begin
  if length(v_nome) < 2 then raise exception 'Indique o seu nome.'; end if;
  if length(v_tel) < 9 then raise exception 'Indique um número de telefone válido.'; end if;
  if length(v_end) < 4 then raise exception 'Indique o endereço de entrega.'; end if;
  if v_metodo not in ('whatsapp','referencia','express') then raise exception 'Método de pagamento inválido.'; end if;
  if jsonb_typeof(p->'itens') <> 'array' or jsonb_array_length(p->'itens') = 0 then raise exception 'O carrinho está vazio.'; end if;
  if jsonb_array_length(p->'itens') > 30 then raise exception 'Demasiados artigos numa só encomenda.'; end if;

  -- taxa de entrega definida pela loja (store_content.data.entregas)
  select c.data->'entregas', coalesce(nullif(c.data->>'entregaGratisAcima', '')::numeric, 0) into v_entregas, v_gratis
  from store_content c join stores s on s.id = c.store_id where s.slug = 'carvieal';
  if v_entregas is not null and jsonb_typeof(v_entregas) = 'array' and jsonb_array_length(v_entregas) > 0 then
    select e.value into v_ent from jsonb_array_elements(v_entregas) as e where e.value->>'nome' = v_mod limit 1;
    if v_ent is null then raise exception 'Escolha uma modalidade de entrega.'; end if;
    v_taxa := coalesce((v_ent->>'taxa')::numeric, 0);
  end if;

  -- cliente (identificado pelo telefone)
  insert into carvieal_clientes (nome, telefone, email, localizacao, endereco)
  values (v_nome, v_tel, v_email, v_local, v_end)
  on conflict (telefone) do update
    set nome = excluded.nome,
        email = case when excluded.email <> '' then excluded.email else carvieal_clientes.email end,
        localizacao = excluded.localizacao,
        endereco = excluded.endereco,
        updated_at = now()
  returning id into v_cliente;

  loop
    v_codigo := 'CV-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from carvieal_encomendas where codigo = v_codigo);
  end loop;

  insert into carvieal_encomendas (codigo, cliente_id, nome, telefone, email, localizacao, endereco, referencia,
    modalidade, taxa_entrega, metodo_pagamento, notas_cliente, historico)
  values (v_codigo, v_cliente, v_nome, v_tel, v_email, v_local, v_end, v_ref, v_mod, v_taxa, v_metodo, v_notas,
    jsonb_build_array(jsonb_build_object('estado', 'pendente', 'em', now())))
  returning id into v_id;

  for v_item in select * from jsonb_array_elements(p->'itens') loop
    v_qtd := coalesce((v_item->>'quantidade')::int, 0);
    if v_qtd < 1 or v_qtd > 20 then raise exception 'Quantidade inválida.'; end if;
    select * into v_prod from carvieal_produtos where id = (v_item->>'produto_id')::uuid and ativo for update;
    if not found then raise exception 'Um dos artigos já não está disponível.'; end if;
    if v_prod.stock < v_qtd then
      raise exception 'Só temos % unidade(s) de «%».', greatest(v_prod.stock, 0), v_prod.nome;
    end if;
    insert into carvieal_encomenda_itens (encomenda_id, produto_id, nome, imagem, opcoes, preco, quantidade)
    values (v_id, v_prod.id, v_prod.nome, coalesce(v_prod.imagens[1], ''), coalesce(v_item->'opcoes', '{}'::jsonb), v_prod.preco, v_qtd);
    update carvieal_produtos set stock = stock - v_qtd where id = v_prod.id;
    v_sub := v_sub + v_prod.preco * v_qtd;
  end loop;

  -- entrega grátis automática a partir do valor definido no painel
  if v_gratis > 0 and v_sub >= v_gratis then v_taxa := 0; end if;

  update carvieal_encomendas set subtotal = v_sub, taxa_entrega = v_taxa, total = v_sub + v_taxa where id = v_id;

  return jsonb_build_object('codigo', v_codigo, 'subtotal', v_sub, 'taxa', v_taxa, 'total', v_sub + v_taxa);
end $$;

