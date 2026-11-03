-- El cliente de un agente o de un autónomo pertenece a la matriz de ese agente o autónomo
create or replace function public.cliente_matriz_heredada() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare m text;
begin
  if new.tipo = 'cliente' then
    if new.cliente_tipo in ('agente','vendedor_agente') and coalesce(new.agente_id,'') <> '' then
      select a.matriz_id into m from public.agentes a where a.id = new.agente_id;
      if m is not null then new.matriz_id := m; end if;
    elsif new.cliente_tipo = 'autonomo' and coalesce(new.autonomo_id,'') <> '' then
      select c.matriz_id into m from public.clientes c where c.id = new.autonomo_id;
      if m is not null then new.matriz_id := m; end if;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists cliente_matriz_heredada on public.clientes;
create trigger cliente_matriz_heredada before insert or update on public.clientes for each row execute function public.cliente_matriz_heredada();

-- Si cambia la matriz de un agente o de un autónomo, sus clientes cambian con él
create or replace function public.cascada_matriz_agente() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if new.matriz_id is distinct from old.matriz_id and new.matriz_id is not null then
    update public.clientes set matriz_id = new.matriz_id
      where tipo = 'cliente' and cliente_tipo in ('agente','vendedor_agente') and agente_id = new.id and matriz_id is distinct from new.matriz_id;
  end if;
  return new;
end $$;
drop trigger if exists cascada_matriz_agente on public.agentes;
create trigger cascada_matriz_agente after update on public.agentes for each row execute function public.cascada_matriz_agente();

create or replace function public.cascada_matriz_autonomo() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if new.rol = 'F' and new.tipo = 'usuario' and new.matriz_id is distinct from old.matriz_id and new.matriz_id is not null then
    update public.clientes set matriz_id = new.matriz_id
      where tipo = 'cliente' and cliente_tipo = 'autonomo' and autonomo_id = new.id and matriz_id is distinct from new.matriz_id;
  end if;
  return new;
end $$;
drop trigger if exists cascada_matriz_autonomo on public.clientes;
create trigger cascada_matriz_autonomo after update on public.clientes for each row execute function public.cascada_matriz_autonomo();

-- Datos: GGG es autónomo; TREELUX y TITANIUM pertenecen a VE-01; sus clientes heredan la matriz
update public.clientes set cliente_tipo = 'autonomo' where tipo = 'usuario' and rol = 'F' and coalesce(cliente_tipo,'') <> 'autonomo';
update public.agentes set matriz_id = (select id from public.oficinas where codigo = 'VE-01') where matriz_id is null;
update public.clientes c set matriz_id = a.matriz_id from public.agentes a
  where c.tipo = 'cliente' and c.cliente_tipo in ('agente','vendedor_agente') and c.agente_id = a.id and a.matriz_id is not null;
update public.clientes c set matriz_id = u.matriz_id from public.clientes u
  where c.tipo = 'cliente' and c.cliente_tipo = 'autonomo' and c.autonomo_id = u.id and u.matriz_id is not null;
