-- ============================================================
-- CARVIEAL — correr UMA vez no SQL Editor do Supabase partilhado
-- (o mesmo projecto da NK Luzindalalu, REDE 29, etc.)
-- Cria a loja, as tabelas da Carvieal, as regras de segurança (RLS)
-- e as funções usadas pelo site (encomendas, rastreio, equipa).
-- ============================================================

-- 1) Loja e conteúdo editável -----------------------------------------
insert into stores (slug, name)
select 'carvieal', 'Carvieal'
where not exists (select 1 from stores where slug = 'carvieal');

insert into store_content (store_id, data)
select s.id, jsonb_build_object(
  'entregas', jsonb_build_array(
    jsonb_build_object('nome', 'Entrega em Luanda', 'descricao', 'Por motoboy, em 24 a 48 horas úteis', 'taxa', 2500),
    jsonb_build_object('nome', 'Entrega expressa em Luanda', 'descricao', 'No mesmo dia, para encomendas confirmadas até às 14h', 'taxa', 4000),
    jsonb_build_object('nome', 'Outras províncias', 'descricao', 'Por transportadora. A taxa é combinada no WhatsApp', 'taxa', 0)
  )
)
from stores s
where s.slug = 'carvieal'
  and not exists (select 1 from store_content c where c.store_id = s.id);

-- 2) Tabelas ----------------------------------------------------------
create table if not exists carvieal_categorias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  imagem text not null default '',
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists carvieal_produtos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  detalhes text not null default '',          -- material, medidas, cuidados (uma linha por item)
  preco numeric(12,2) not null default 0 check (preco >= 0),
  preco_antigo numeric(12,2),                   -- opcional: preço riscado
  stock int not null default 0,
  categoria_id uuid references carvieal_categorias(id) on delete set null,
  imagens text[] not null default '{}',
  opcoes jsonb not null default '[]'::jsonb,    -- [{"nome":"Tamanho","valores":["12","14"]}]
  destaque boolean not null default false,
  novidade boolean not null default false,
  ativo boolean not null default true,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists carvieal_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null unique,               -- só dígitos
  email text not null default '',
  localizacao text not null default '',
  endereco text not null default '',
  notas text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists carvieal_encomendas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  cliente_id uuid references carvieal_clientes(id) on delete set null,
  nome text not null,
  telefone text not null,
  email text not null default '',
  localizacao text not null default '',
  endereco text not null default '',
  referencia text not null default '',
  modalidade text not null default '',
  taxa_entrega numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  metodo_pagamento text not null default 'whatsapp' check (metodo_pagamento in ('whatsapp','referencia','express')),
  pago boolean not null default false,
  estado text not null default 'pendente'
    check (estado in ('pendente','confirmada','em_preparacao','enviada','entregue','cancelada')),
  notas_cliente text not null default '',
  notas_internas text not null default '',
  historico jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists carvieal_encomendas_estado_idx on carvieal_encomendas (estado, created_at desc);
create index if not exists carvieal_encomendas_cliente_idx on carvieal_encomendas (cliente_id);

create table if not exists carvieal_encomenda_itens (
  id uuid primary key default gen_random_uuid(),
  encomenda_id uuid not null references carvieal_encomendas(id) on delete cascade,
  produto_id uuid references carvieal_produtos(id) on delete set null,
  nome text not null,
  imagem text not null default '',
  opcoes jsonb not null default '{}'::jsonb,
  preco numeric(12,2) not null,
  quantidade int not null check (quantidade > 0)
);
create index if not exists carvieal_itens_encomenda_idx on carvieal_encomenda_itens (encomenda_id);

-- Equipa: até 5 funcionários, cada um com permissões próprias.
-- permissoes possíveis: 'encomendas', 'produtos', 'clientes'
create table if not exists carvieal_equipa (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null default '',
  funcao text not null default '',
  permissoes text[] not null default '{}',
  user_id uuid unique references auth.users(id) on delete set null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3) Funções de permissão --------------------------------------------
-- Gerente = utilizador ligado à loja em store_members (a dona).
create or replace function carvieal_e_gerente() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from store_members sm join stores s on s.id = sm.store_id
    where s.slug = 'carvieal' and sm.user_id = auth.uid()
  );
$$;

create or replace function carvieal_pode(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select carvieal_e_gerente() or exists (
    select 1 from carvieal_equipa e
    where e.user_id = auth.uid() and e.ativo and p = any (e.permissoes)
  );
$$;

create or replace function carvieal_limite_equipa() returns trigger
language plpgsql as $$
begin
  if (select count(*) from carvieal_equipa) >= 5 then
    raise exception 'Limite de 5 funcionários atingido.';
  end if;
  new.email := lower(trim(new.email));
  return new;
end $$;
drop trigger if exists carvieal_limite_equipa on carvieal_equipa;
create trigger carvieal_limite_equipa before insert on carvieal_equipa
  for each row execute function carvieal_limite_equipa();

-- 4) RLS ----------------------------------------------------------------
alter table carvieal_categorias enable row level security;
alter table carvieal_produtos enable row level security;
alter table carvieal_clientes enable row level security;
alter table carvieal_encomendas enable row level security;
alter table carvieal_encomenda_itens enable row level security;
alter table carvieal_equipa enable row level security;

drop policy if exists cv_cat_ler on carvieal_categorias;
create policy cv_cat_ler on carvieal_categorias for select using (ativo or carvieal_pode('produtos'));
drop policy if exists cv_cat_gerir on carvieal_categorias;
create policy cv_cat_gerir on carvieal_categorias for all using (carvieal_pode('produtos')) with check (carvieal_pode('produtos'));

drop policy if exists cv_prod_ler on carvieal_produtos;
create policy cv_prod_ler on carvieal_produtos for select using (ativo or carvieal_pode('produtos'));
drop policy if exists cv_prod_gerir on carvieal_produtos;
create policy cv_prod_gerir on carvieal_produtos for all using (carvieal_pode('produtos')) with check (carvieal_pode('produtos'));

drop policy if exists cv_cli_ler on carvieal_clientes;
create policy cv_cli_ler on carvieal_clientes for select using (carvieal_pode('clientes') or carvieal_pode('encomendas'));
drop policy if exists cv_cli_editar on carvieal_clientes;
create policy cv_cli_editar on carvieal_clientes for update using (carvieal_pode('clientes')) with check (carvieal_pode('clientes'));

drop policy if exists cv_enc_ler on carvieal_encomendas;
create policy cv_enc_ler on carvieal_encomendas for select using (carvieal_pode('encomendas') or carvieal_pode('clientes'));
drop policy if exists cv_enc_editar on carvieal_encomendas;
create policy cv_enc_editar on carvieal_encomendas for update using (carvieal_pode('encomendas')) with check (carvieal_pode('encomendas'));

drop policy if exists cv_itens_ler on carvieal_encomenda_itens;
create policy cv_itens_ler on carvieal_encomenda_itens for select using (carvieal_pode('encomendas') or carvieal_pode('clientes'));

drop policy if exists cv_eq_gerente on carvieal_equipa;
create policy cv_eq_gerente on carvieal_equipa for all using (carvieal_e_gerente()) with check (carvieal_e_gerente());
drop policy if exists cv_eq_proprio on carvieal_equipa;
create policy cv_eq_proprio on carvieal_equipa for select using (user_id = auth.uid());

-- 5) Encomenda feita no site (o visitante nunca escreve directamente nas tabelas)
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
begin
  if length(v_nome) < 2 then raise exception 'Indique o seu nome.'; end if;
  if length(v_tel) < 9 then raise exception 'Indique um número de telefone válido.'; end if;
  if length(v_end) < 4 then raise exception 'Indique o endereço de entrega.'; end if;
  if v_metodo not in ('whatsapp','referencia','express') then raise exception 'Método de pagamento inválido.'; end if;
  if jsonb_typeof(p->'itens') <> 'array' or jsonb_array_length(p->'itens') = 0 then raise exception 'O carrinho está vazio.'; end if;
  if jsonb_array_length(p->'itens') > 30 then raise exception 'Demasiados artigos numa só encomenda.'; end if;

  -- taxa de entrega definida pela loja (store_content.data.entregas)
  select c.data->'entregas' into v_entregas
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

  update carvieal_encomendas set subtotal = v_sub, total = v_sub + v_taxa where id = v_id;

  return jsonb_build_object('codigo', v_codigo, 'subtotal', v_sub, 'taxa', v_taxa, 'total', v_sub + v_taxa);
end $$;

-- 6) Rastreio público: código + telefone ------------------------------
create or replace function carvieal_rastrear(p_codigo text, p_telefone text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_e carvieal_encomendas%rowtype;
  v_tel text := right(regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g'), 9);
begin
  select * into v_e from carvieal_encomendas where codigo = upper(trim(p_codigo));
  if not found or length(v_tel) < 9 or right(v_e.telefone, 9) <> v_tel then
    return null;
  end if;
  return jsonb_build_object(
    'codigo', v_e.codigo, 'nome', v_e.nome, 'estado', v_e.estado, 'historico', v_e.historico,
    'criada_em', v_e.created_at, 'modalidade', v_e.modalidade, 'localizacao', v_e.localizacao,
    'endereco', v_e.endereco, 'metodo', v_e.metodo_pagamento, 'pago', v_e.pago,
    'subtotal', v_e.subtotal, 'taxa', v_e.taxa_entrega, 'total', v_e.total,
    'itens', (select coalesce(jsonb_agg(jsonb_build_object('nome', i.nome, 'imagem', i.imagem, 'opcoes', i.opcoes,
               'preco', i.preco, 'quantidade', i.quantidade)), '[]'::jsonb)
              from carvieal_encomenda_itens i where i.encomenda_id = v_e.id)
  );
end $$;

-- 7) Mudar estado (painel) — guarda histórico e devolve stock se cancelar
create or replace function carvieal_mudar_estado(p_id uuid, p_estado text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_antigo text;
begin
  if not carvieal_pode('encomendas') then raise exception 'Sem permissão.'; end if;
  if p_estado not in ('pendente','confirmada','em_preparacao','enviada','entregue','cancelada') then
    raise exception 'Estado inválido.';
  end if;
  select estado into v_antigo from carvieal_encomendas where id = p_id for update;
  if not found then raise exception 'Encomenda não encontrada.'; end if;
  if v_antigo = p_estado then return; end if;

  if p_estado = 'cancelada' then
    update carvieal_produtos pr set stock = pr.stock + i.quantidade
    from carvieal_encomenda_itens i where i.encomenda_id = p_id and i.produto_id = pr.id;
  elsif v_antigo = 'cancelada' then
    update carvieal_produtos pr set stock = pr.stock - i.quantidade
    from carvieal_encomenda_itens i where i.encomenda_id = p_id and i.produto_id = pr.id;
  end if;

  update carvieal_encomendas
  set estado = p_estado,
      pago = case when p_estado in ('confirmada','em_preparacao','enviada','entregue') then true else pago end,
      historico = historico || jsonb_build_array(jsonb_build_object('estado', p_estado, 'em', now(),
                  'por', coalesce(auth.jwt()->>'email', ''))),
      updated_at = now()
  where id = p_id;
end $$;

-- 8) Acesso ao painel: liga o convite do funcionário ao login e diz o que pode fazer
create or replace function carvieal_meu_acesso() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(coalesce(auth.jwt()->>'email', ''));
  v_eq carvieal_equipa%rowtype;
begin
  if auth.uid() is null then return null; end if;
  update carvieal_equipa set user_id = auth.uid()
  where email = v_email and user_id is null and ativo;
  if carvieal_e_gerente() then
    return jsonb_build_object('gerente', true, 'nome', 'Gerência',
      'permissoes', jsonb_build_array('encomendas','produtos','clientes'));
  end if;
  select * into v_eq from carvieal_equipa where user_id = auth.uid() and ativo;
  if not found then return jsonb_build_object('gerente', false, 'permissoes', '[]'::jsonb); end if;
  return jsonb_build_object('gerente', false, 'nome', v_eq.nome, 'funcao', v_eq.funcao, 'permissoes', to_jsonb(v_eq.permissoes));
end $$;

grant execute on function carvieal_criar_encomenda(jsonb) to anon, authenticated;
grant execute on function carvieal_rastrear(text, text) to anon, authenticated;
grant execute on function carvieal_mudar_estado(uuid, text) to authenticated;
grant execute on function carvieal_meu_acesso() to authenticated;
grant execute on function carvieal_pode(text) to anon, authenticated;
grant execute on function carvieal_e_gerente() to anon, authenticated;

-- 9) Categorias iniciais (pode editar no painel) -------------------------
insert into carvieal_categorias (slug, nome, descricao, imagem, ordem) values
  ('aneis', 'Anéis', 'Finos, para usar sozinhos ou em conjunto.', '/img/aneis.webp', 1),
  ('colares', 'Colares', 'Correntes delicadas e pendentes discretos.', '/img/colares.webp', 2),
  ('brincos', 'Brincos', 'Argolas e pontos de luz para todos os dias.', '/img/brincos.webp', 3),
  ('pulseiras', 'Pulseiras', 'Correntes e braceletes que se sobrepõem bem.', '/img/pulseiras.webp', 4)
on conflict (slug) do nothing;
