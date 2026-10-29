-- ============================================================
-- CARVIEAL — AVALIAÇÕES DAS PEÇAS + LISTA DE EMAILS
-- Correr UMA vez no SQL Editor do Supabase (depois do 001).
-- • Qualquer cliente pode avaliar uma peça (1 a 5 estrelas + comentário).
-- • Quem já recebeu essa peça (mesmo telefone de uma encomenda entregue)
--   fica com «Compra verificada» e a avaliação aparece logo.
-- • As restantes ficam à espera de aprovação no painel (Avaliações).
-- ============================================================

alter table carvieal_produtos add column if not exists avaliacao_media numeric(3,2) not null default 0;
alter table carvieal_produtos add column if not exists avaliacao_total int not null default 0;

create table if not exists carvieal_avaliacoes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references carvieal_produtos(id) on delete cascade,
  nome text not null,
  telefone text not null,                 -- só a equipa vê
  nota smallint not null check (nota between 1 and 5),
  comentario text not null default '',
  verificada boolean not null default false,
  aprovada boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists carvieal_avaliacoes_unica on carvieal_avaliacoes (produto_id, telefone);
create index if not exists carvieal_avaliacoes_prod on carvieal_avaliacoes (produto_id, aprovada, created_at desc);

create table if not exists carvieal_lista (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Média e total guardados no produto (para mostrar as estrelas sem consultas extra)
create or replace function carvieal_recalcular_avaliacoes() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_prod uuid := coalesce(new.produto_id, old.produto_id);
begin
  update carvieal_produtos p set
    avaliacao_total = s.total,
    avaliacao_media = s.media
  from (select count(*)::int total, coalesce(round(avg(nota)::numeric, 2), 0) media
        from carvieal_avaliacoes where produto_id = v_prod and aprovada) s
  where p.id = v_prod;
  if tg_op = 'UPDATE' and old.produto_id is distinct from new.produto_id then
    update carvieal_produtos p set
      avaliacao_total = (select count(*) from carvieal_avaliacoes where produto_id = old.produto_id and aprovada),
      avaliacao_media = coalesce((select round(avg(nota)::numeric, 2) from carvieal_avaliacoes where produto_id = old.produto_id and aprovada), 0)
    where p.id = old.produto_id;
  end if;
  return null;
end;
$$;

drop trigger if exists carvieal_avaliacoes_recalc on carvieal_avaliacoes;
create trigger carvieal_avaliacoes_recalc after insert or update or delete on carvieal_avaliacoes
for each row execute function carvieal_recalcular_avaliacoes();

-- Regras de segurança: o público não lê a tabela directamente (tem telefones)
alter table carvieal_avaliacoes enable row level security;
alter table carvieal_lista enable row level security;

drop policy if exists cv_av_gerir on carvieal_avaliacoes;
create policy cv_av_gerir on carvieal_avaliacoes for all using (carvieal_pode('produtos')) with check (carvieal_pode('produtos'));
drop policy if exists cv_lista_ler on carvieal_lista;
create policy cv_lista_ler on carvieal_lista for select using (carvieal_pode('clientes'));
drop policy if exists cv_lista_apagar on carvieal_lista;
create policy cv_lista_apagar on carvieal_lista for delete using (carvieal_pode('clientes'));

grant select, update, delete on carvieal_avaliacoes to authenticated;
grant select, delete on carvieal_lista to authenticated;

-- Avaliações publicadas de uma peça (sem telefones)
create or replace function carvieal_avaliacoes_publicas(p_produto uuid)
returns table (id uuid, nome text, nota smallint, comentario text, verificada boolean, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.id, a.nome, a.nota, a.comentario, a.verificada, a.created_at
  from carvieal_avaliacoes a
  where a.produto_id = p_produto and a.aprovada
  order by a.verificada desc, a.created_at desc
  limit 100;
$$;

-- Enviar uma avaliação
create or replace function carvieal_avaliar(p_produto uuid, p_nome text, p_telefone text, p_nota int, p_comentario text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_tel text := right(regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g'), 9);
  v_nome text := left(trim(coalesce(p_nome, '')), 60);
  v_com text := left(trim(coalesce(p_comentario, '')), 1000);
  v_verif boolean;
begin
  if not exists (select 1 from carvieal_produtos where id = p_produto and ativo) then raise exception 'Peça não encontrada.'; end if;
  if length(v_nome) < 2 then raise exception 'Escreva o seu nome.'; end if;
  if length(v_tel) <> 9 then raise exception 'Indique um número de telefone válido.'; end if;
  if p_nota is null or p_nota < 1 or p_nota > 5 then raise exception 'Escolha de 1 a 5 estrelas.'; end if;
  if exists (select 1 from carvieal_avaliacoes where produto_id = p_produto and telefone = v_tel) then
    raise exception 'Já avaliou esta peça com este número. Obrigada!';
  end if;
  -- limite contra abusos: no máximo 5 avaliações por número em 24 horas
  if (select count(*) from carvieal_avaliacoes where telefone = v_tel and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'Demasiadas avaliações seguidas. Tente amanhã.';
  end if;

  select exists (
    select 1 from carvieal_encomendas e join carvieal_encomenda_itens i on i.encomenda_id = e.id
    where right(regexp_replace(e.telefone, '\D', '', 'g'), 9) = v_tel and e.estado = 'entregue' and i.produto_id = p_produto
  ) into v_verif;

  insert into carvieal_avaliacoes (produto_id, nome, telefone, nota, comentario, verificada, aprovada)
  values (p_produto, v_nome, v_tel, p_nota, v_com, v_verif, v_verif);

  return jsonb_build_object('publicada', v_verif);
end;
$$;

-- Entrar na lista de emails (novidades)
create or replace function carvieal_entrar_lista(p_email text) returns void
language plpgsql security definer set search_path = public as $$
declare v text := lower(trim(coalesce(p_email, '')));
begin
  if v !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v) > 200 then raise exception 'Email inválido.'; end if;
  insert into carvieal_lista (email) values (v) on conflict (email) do nothing;
end;
$$;

revoke all on function carvieal_avaliar(uuid, text, text, int, text) from public;
revoke all on function carvieal_avaliacoes_publicas(uuid) from public;
revoke all on function carvieal_entrar_lista(text) from public;
grant execute on function carvieal_avaliar(uuid, text, text, int, text) to anon, authenticated;
grant execute on function carvieal_avaliacoes_publicas(uuid) to anon, authenticated;
grant execute on function carvieal_entrar_lista(text) to anon, authenticated;
