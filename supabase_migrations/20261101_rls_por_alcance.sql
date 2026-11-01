-- Seguridad por cuenta: cada cuenta solo puede leer y escribir lo que le toca.
-- Internos (A, B, C, D, D1, D2, o externos con "todas_sucursales") ven todo.
-- Externos (E agente, E1 vendedor, F autónomo, G oficina, I cliente) ven solo su alcance,
-- igual que las pantallas (crearAlcance en App.jsx). Borrar: solo el Administrador.

-- ── Ayudantes ───────────────────────────────────────────────────────────────
create or replace function public.rls_norm(t text) returns text language sql immutable as $$
  select upper(translate(trim(coalesce(t,'')),'áéíóúàèìòùäëïöüâêîôûñÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑ','aeiouaeiouaeiouaeiounAEIOUAEIOUAEIOUAEIOUN'));
$$;

create or replace function public.rls_yo() returns public.clientes language sql stable security definer set search_path to 'public' as $$
  select * from public.clientes where auth_id = auth.uid() and coalesce(activo,true) limit 1;
$$;

-- Permisos del rol: los guardados en Roles & Permisos o, si no hay, los predeterminados que publica la app
create or replace function public.rls_perms(r text) returns text[] language sql stable security definer set search_path to 'public' as $$
  select coalesce(
    (select array(select jsonb_array_elements_text(valor->r)) from public.configuracion where clave='role_perms' and valor ? r),
    (select array(select jsonb_array_elements_text(valor->r)) from public.configuracion where clave='role_perms_def' and valor ? r),
    array[]::text[]);
$$;

create or replace function public.rls_tiene(p text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select case when (public.rls_yo()).rol = 'A' then true
              when (public.rls_yo()).id is null then false
              else p = any(public.rls_perms((public.rls_yo()).rol)) end;
$$;

-- Cuenta interna: ve todo
create or replace function public.rls_interno() returns boolean language sql stable security definer set search_path to 'public' as $$
  select (public.rls_yo()).id is not null
     and ((public.rls_yo()).rol not in ('E','E1','F','G','I') or public.rls_tiene('todas_sucursales'));
$$;

create or replace function public.rls_admin() returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((public.rls_yo()).rol = 'A', false);
$$;

-- ¿Este cliente es de mi alcance?
create or replace function public.rls_cliente_ok(c public.clientes) returns boolean language plpgsql stable security definer set search_path to 'public' as $$
declare u public.clientes := public.rls_yo(); ct text := coalesce(nullif(c.cliente_tipo,''),'matriz');
begin
  if u.id is null or c.id is null then return false; end if;
  if public.rls_interno() then return true; end if;
  if c.id = u.id then return true; end if;
  if u.rol = 'E'  then return c.tipo='cliente' and ct in ('agente','vendedor_agente') and coalesce(u.agente_id,'')<>'' and c.agente_id = u.agente_id; end if;
  if u.rol = 'E1' then return c.tipo='cliente' and c.vendedor_id = u.id; end if;
  if u.rol = 'F'  then return ct='autonomo' and c.autonomo_id = u.id; end if;
  if u.rol = 'G'  then return c.tipo='cliente' and coalesce(u.oficina_id,'')<>'' and c.oficina_id = u.oficina_id; end if;
  return false;
end $$;

create or replace function public.rls_cliente_id_ok(cid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_cliente_ok(c) from public.clientes c where c.id = cid limit 1), false);
$$;

-- Nombre normalizado de una ciudad (código o nombre) según configuración de países
create or replace function public.rls_ciudad(v text) returns text language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_norm(ci->>'name')
    from public.configuracion, jsonb_array_elements(valor) co, jsonb_array_elements(coalesce(co->'cities','[]'::jsonb)) ci
    where clave='countries' and (public.rls_norm(ci->>'code')=public.rls_norm(v) or public.rls_norm(ci->>'name')=public.rls_norm(v)) limit 1),
    public.rls_norm(v));
$$;

-- ¿Este WR es de mi alcance?
create or replace function public.rls_wr_ok(w public.wr) returns boolean language plpgsql stable security definer set search_path to 'public' as $$
declare u public.clientes := public.rls_yo(); cli public.clientes; ofi public.oficinas; suc text;
begin
  if u.id is null then return false; end if;
  if public.rls_interno() then return true; end if;
  select * into cli from public.clientes c where coalesce(w.cliente_id,'')<>'' and c.id = w.cliente_id limit 1;
  if cli.id is null then select * into cli from public.clientes c where coalesce(w.casillero,'')<>'' and c.casillero = w.casillero limit 1; end if;
  if u.rol = 'G' then
    if coalesce(u.oficina_id,'') = '' then return false; end if;
    suc := case when w.sucursal_entrega is not null then w.sucursal_entrega
                when cli.id is not null and cli.tipo <> 'usuario' then coalesce(cli.oficina_id,'') else '' end;
    if suc = u.oficina_id then return true; end if;
    if exists(select 1 from public.delivery_notes n where not coalesce(n.anulado,false)
              and n.receptor_entidad->>'tipo'='oficina' and n.receptor_entidad->>'id'=u.oficina_id
              and coalesce(n.wr_ids,'[]'::jsonb) ? w.id) then return true; end if;
    select * into ofi from public.oficinas o where o.id = u.oficina_id;
    return ofi.id is not null and public.rls_norm(ofi.ciudad) <> '' and public.rls_ciudad(w.orig_city) = public.rls_norm(ofi.ciudad);
  end if;
  return cli.id is not null and public.rls_cliente_ok(cli);
end $$;

create or replace function public.rls_wr_id_ok(wid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_wr_ok(w) from public.wr w where w.id = wid limit 1), false);
$$;

-- ¿Alguno de estos WR (lista jsonb de ids) es de mi alcance?
create or replace function public.rls_wr_ids_ok(ids jsonb) returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists(select 1 from jsonb_array_elements_text(case when jsonb_typeof(ids)='array' then ids else '[]'::jsonb end) x where public.rls_wr_id_ok(x));
$$;

-- Guía con alguno de mis WR (en wr_ids o dentro de los contenedores)
create or replace function public.rls_guia_ok(g public.consolidaciones) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_interno() or public.rls_wr_ids_ok(g.wr_ids)
    or exists(select 1 from jsonb_array_elements(case when jsonb_typeof(g.containers)='array' then g.containers else '[]'::jsonb end) ct,
                     jsonb_array_elements(case when jsonb_typeof(ct->'wr')='array' then ct->'wr' else '[]'::jsonb end) x
              where public.rls_wr_id_ok(x->>'id'));
$$;

create or replace function public.rls_factura_ok(fid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_interno()
      or f.receptor_id in ((public.rls_yo()).id, (public.rls_yo()).agente_id, (public.rls_yo()).oficina_id)
      or public.rls_wr_ids_ok(f.wr_ids)
    from public.facturas f where f.id = fid limit 1), false);
$$;

-- Emisor de facturas propias de la cuenta: agente (E/E1), autónomo (F) u oficina (G)
create or replace function public.rls_fp_ok(et text, eid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_interno() or (
    case (public.rls_yo()).rol
      when 'E'  then et='agente'   and eid=(public.rls_yo()).agente_id
      when 'E1' then et='agente'   and eid=(public.rls_yo()).agente_id
      when 'F'  then et='autonomo' and eid=(public.rls_yo()).id
      when 'G'  then et='oficina'  and eid=(public.rls_yo()).oficina_id
      else false end);
$$;

-- Máximos de numeración visibles para todos (sin exponer los registros)
create or replace function public.secuencias() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case when (public.rls_yo()).id is null then '{}'::jsonb else jsonb_build_object(
    'wr',  (select coalesce(max((substring(id from '(\d+)$'))::bigint),0) from public.wr),
    'cli', (select coalesce(max((substring(id from '^C-(\d+)$'))::bigint),0) from public.clientes),
    'usr', (select coalesce(max((substring(id from '^U-(\d+)$'))::bigint),0) from public.clientes),
    'cas', (select coalesce(max(nullif(regexp_replace(casillero,'\D','','g'),'')::bigint),0) from public.clientes),
    'pu',  (select coalesce(max(nullif(regexp_replace(id,'\D','','g'),'')::bigint),0) from public.pickup),
    'pa',  (select coalesce(max(nullif(regexp_replace(id,'\D','','g'),'')::bigint),0) from public.prealertas)
  ) end;
$$;

-- Nadie se sube de rol ni toca cuentas de acceso desde la app
create or replace function public.rls_clientes_guarda() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare u public.clientes := public.rls_yo();
  rk_u int; rk_new int; rk_old int;
begin
  if auth.uid() is null or u.id is null then return new; end if; -- clave de servicio
  if u.rol = 'A' then return new; end if;
  rk_u   := case u.rol when 'A' then 0 when 'B' then 1 when 'C' then 2 else 3 end;
  rk_new := case new.rol when 'A' then 0 when 'B' then 1 when 'C' then 2 else 3 end;
  if tg_op = 'INSERT' then
    if new.auth_id is not null then raise exception 'No permitido: cuenta de acceso'; end if;
    if coalesce(new.rol,'I') <> 'I' and rk_new <= rk_u then raise exception 'No permitido: rol'; end if;
  else
    if new.auth_id is distinct from old.auth_id then raise exception 'No permitido: cuenta de acceso'; end if;
    rk_old := case old.rol when 'A' then 0 when 'B' then 1 when 'C' then 2 else 3 end;
    if new.rol is distinct from old.rol and (rk_new <= rk_u or rk_old <= rk_u) then raise exception 'No permitido: rol'; end if;
    if old.rol = 'A' then raise exception 'No permitido'; end if;
  end if;
  return new;
end $$;
drop trigger if exists clientes_guarda on public.clientes;
create trigger clientes_guarda before insert or update on public.clientes for each row execute function public.rls_clientes_guarda();

revoke execute on function public.rls_yo(), public.rls_perms(text), public.rls_tiene(text), public.rls_interno(), public.rls_admin(),
  public.rls_cliente_ok(public.clientes), public.rls_cliente_id_ok(text), public.rls_ciudad(text), public.rls_wr_ok(public.wr),
  public.rls_wr_id_ok(text), public.rls_wr_ids_ok(jsonb), public.rls_guia_ok(public.consolidaciones), public.rls_factura_ok(text),
  public.rls_fp_ok(text,text), public.secuencias() from anon, public;
grant execute on function public.rls_yo(), public.rls_perms(text), public.rls_tiene(text), public.rls_interno(), public.rls_admin(),
  public.rls_cliente_ok(public.clientes), public.rls_cliente_id_ok(text), public.rls_ciudad(text), public.rls_wr_ok(public.wr),
  public.rls_wr_id_ok(text), public.rls_wr_ids_ok(jsonb), public.rls_guia_ok(public.consolidaciones), public.rls_factura_ok(text),
  public.rls_fp_ok(text,text), public.secuencias() to authenticated;
