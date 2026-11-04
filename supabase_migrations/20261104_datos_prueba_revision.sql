-- Datos para la revisión general (4-nov-2026). Solo datos de prueba; se puede repetir sin duplicar.
do $$
declare
  paises jsonb := (select valor from public.configuracion where clave = 'countries');
  m record; d record; a record; o record; u record;
  n int; nu int; nc int; cas int; te text;
  nombres text[] := array['ANA','LUIS','MARIA','CARLOS','SOFIA','JORGE','LUCIA','PEDRO','ELENA','MIGUEL','PAULA','DIEGO','VALERIA','ANDRES','CAMILA','RAFAEL','GABRIELA','FERNANDO','ISABEL','RICARDO'];
  apellidos text[] := array['PEREZ','GOMEZ','RODRIGUEZ','MARTINEZ','LOPEZ','HERNANDEZ','DIAZ','TORRES','RAMIREZ','FLORES','ROJAS','MORALES','CASTRO','ORTIZ','SILVA','MENDOZA','VARGAS','RIOS','SUAREZ','NAVARRO'];
  k int := 0;
  -- montos por moneda: aéreo lb / mín, marítimo ft3 / mín (predeterminada y especial)
begin
  -- 4) Panamá en dólares
  update public.configuracion set valor = (select jsonb_agg(case when e->>'iso' = 'PA' then e || '{"moneda":"USD"}'::jsonb else e end order by ord) from jsonb_array_elements(valor) with ordinality t(e, ord)) where clave = 'countries';
  update public.oficinas set moneda = 'USD' where codigo like 'PA-%';
  -- 5) Códigos IATA: Roma es ROM (FCO es el aeropuerto)
  update public.configuracion set valor = (select jsonb_agg(case when e->>'iso' = 'IT' then e || jsonb_build_object('cities', (select jsonb_agg(case when ci->>'code' = 'FCO' then ci || '{"code":"ROM"}'::jsonb else ci end) from jsonb_array_elements(e->'cities') ci)) else e end order by ord) from jsonb_array_elements(valor) with ordinality t(e, ord)) where clave = 'countries';
  paises := (select valor from public.configuracion where clave = 'countries');
  -- 6) Comisiones que faltaban
  update public.oficinas set com_prepaid_pct = '10', com_entrega_monto = '0.5', com_entrega_por = 'paquete'
    where coalesce(tipo,'Matriz') <> 'Matriz' and (com_prepaid_pct is null or com_entrega_monto is null or com_entrega_por is null);
  -- 7) Recibe en puerta: una sucursal en Europa y una en América
  update public.oficinas set recibe_puerta = true where codigo in ('ES-06', 'US-06');

  -- 1) Tarifas por matriz de salida hacia cada país con matriz
  create temp table _mz on commit drop as
    select ox.id, ox.codigo, left(ox.codigo, 2) iso,
           (select e->>'name' from jsonb_array_elements(paises) e where e->>'iso' = left(ox.codigo, 2)) pais
    from public.oficinas ox where coalesce(ox.tipo,'Matriz') = 'Matriz' and ox.activo is not false;
  create temp table _val(iso_grupo text, moneda text, a_lb numeric, a_min numeric, m_ft3 numeric, m_min numeric, ea_lb numeric, ea_min numeric, em_ft3 numeric, em_min numeric) on commit drop;
  insert into _val values ('USD','USD',8,25,40,40,7,21,37,37),('EUR','EUR',7,22,35,40,6,19,32,32),('COP','COP',26080,81500,130400,130400,22820,68500,120600,120600);
  -- destinatarios de tarifas: '' = predeterminada, agentes y autónomos con el país de su matriz
  create temp table _apl on commit drop as
    select ''::text tipo, ''::text aid, null::text iso
    union all select 'agente', a2.id, left(mz.codigo, 2) from public.agentes a2 join public.oficinas mz on mz.id = a2.matriz_id
    union all select 'autonomo', c.id, left(mz.codigo, 2) from public.clientes c join public.oficinas mz on mz.id = c.matriz_id where c.tipo = 'usuario' and c.rol = 'F';
  for m in select * from _mz order by codigo loop
    n := coalesce((select max(nullif(regexp_replace(substr(t.id, length(m.codigo) + 4), '\D', '', 'g'), '')::int) from public.tarifas t where t.id like m.codigo || '-T-%'), 0);
    for d in select * from _mz where iso <> m.iso order by codigo loop
      for a in select * from _apl x where x.tipo = '' or x.iso = d.iso loop
        foreach te in array array['AEREO', 'MARITIMO'] loop
          if exists (select 1 from public.tarifas t where t.matriz_id = m.id and coalesce(t.aplica_id,'') = a.aid
                     and upper(translate(t.pais_dest,'ÁÉÍÓÚÑ','AEIOUN')) = upper(translate(d.pais,'ÁÉÍÓÚÑ','AEIOUN')) and t.tipo_envio = te) then continue; end if;
          n := n + 1;
          insert into public.tarifas(id, matriz_id, pais_orig, ciudad_orig, pais_dest, ciudad_dest, tipo_envio, por_lb, por_ft3, min, moneda, activo, aplica_tipo, aplica_id, unidad)
          select m.codigo || '-T-' || lpad(n::text, 3, '0'), m.id, m.pais, '', d.pais, '', te,
                 case when te = 'AEREO' then (case when a.tipo = '' then v.a_lb else v.ea_lb end) else 0 end,
                 case when te = 'MARITIMO' then (case when a.tipo = '' then v.m_ft3 else v.em_ft3 end) else 0 end,
                 case when te = 'AEREO' then (case when a.tipo = '' then v.a_min else v.ea_min end) else (case when a.tipo = '' then v.m_min else v.em_min end) end,
                 v.moneda, true, nullif(a.tipo, ''), nullif(a.aid, ''), case when te = 'AEREO' then 'lb' else 'ft3' end
          from _val v where v.iso_grupo = case when m.iso = 'CO' then 'COP' when m.iso in ('ES','IT') then 'EUR' else 'USD' end;
        end loop;
      end loop;
    end loop;
  end loop;

  -- 8 y 9) Usuarios: uno por cada oficina que no tiene, y Gerente en las matrices sin gerente
  nu := (select coalesce(max(substr(id, 3)::int), 0) from public.clientes where id ~ '^U-\d+$');
  for o in select x.* from public.oficinas x where coalesce(x.tipo,'Matriz') <> 'Matriz' and x.activo is not false
           and not exists (select 1 from public.clientes c where c.tipo = 'usuario' and c.rol = 'G' and c.oficina_id = x.id) order by x.codigo loop
    nu := nu + 1;
    insert into public.clientes(id, tipo, rol, cliente_tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, dir, municipio, estado, pais, cp, tel1, tel2, email, casillero, login, oficina_id, activo)
    values ('U-' || lpad(nu::text, 3, '0'), 'usuario', 'G', 'oficina', 'OFICINA', '', replace(o.codigo, '-', ' '), '', '', '', '', '', '', '', '', '', '', '', lower(replace(o.codigo, '-', '')), o.id, true);
  end loop;
  for o in select x.* from public.oficinas x where coalesce(x.tipo,'Matriz') = 'Matriz' and x.activo is not false
           and not exists (select 1 from public.clientes c where c.tipo = 'usuario' and c.rol = 'B' and c.oficina_id = x.id) order by x.codigo loop
    nu := nu + 1;
    insert into public.clientes(id, tipo, rol, cliente_tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, dir, municipio, estado, pais, cp, tel1, tel2, email, casillero, login, oficina_id, activo)
    values ('U-' || lpad(nu::text, 3, '0'), 'usuario', 'B', 'matriz', 'GERENTE', '', replace(o.codigo, '-', ' '), '', '', '', '', '', '', '', '', '', '', '', 'ger' || lower(replace(o.codigo, '-', '')), o.id, true);
  end loop;

  -- 10) Clientes: 2 por oficina (directos), 2 por agente y 2 por autónomo
  nc := (select coalesce(max(substr(id, 3)::int), 0) from public.clientes where id ~ '^C-\d+$');
  cas := (select coalesce(max(nullif(regexp_replace(casillero, '\D', '', 'g'), '')::int), 0) from public.clientes);
  for o in select x.*, coalesce(case when coalesce(x.tipo,'Matriz') = 'Matriz' then x.id else x.matriz_id end, x.id) mat,
                  (select e->>'name' from jsonb_array_elements(paises) e where e->>'iso' = left(x.codigo, 2)) pais_n
           from public.oficinas x where x.activo is not false order by x.codigo loop
    for i in 1 .. greatest(0, 2 - (select count(*) from public.clientes c where c.tipo = 'cliente' and coalesce(c.cliente_tipo,'matriz') = 'matriz' and c.oficina_id = o.id)) loop
      nc := nc + 1; cas := cas + 1; k := k + 1;
      insert into public.clientes(id, tipo, rol, cliente_tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, dir, municipio, estado, pais, cp, tel1, tel2, email, casillero, oficina_id, matriz_id, activo)
      values ('C-' || lpad(nc::text, 3, '0'), 'cliente', 'I', 'matriz', nombres[1 + (k % 20)], '', apellidos[1 + ((k * 7) % 20)], '', '', '', o.ciudad, '', o.pais_n, '', '', '', '', lpad(cas::text, 3, '0'), o.id, o.mat, true);
    end loop;
  end loop;
  for a in select a2.*, (select e->>'name' from jsonb_array_elements(paises) e where e->>'iso' = left(mz.codigo, 2)) pais_n
           from public.agentes a2 join public.oficinas mz on mz.id = a2.matriz_id order by a2.codigo loop
    for i in 1 .. greatest(0, 2 - (select count(*) from public.clientes c where c.tipo = 'cliente' and c.cliente_tipo = 'agente' and c.agente_id = a.id)) loop
      nc := nc + 1; cas := cas + 1; k := k + 1;
      insert into public.clientes(id, tipo, rol, cliente_tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, dir, municipio, estado, pais, cp, tel1, tel2, email, casillero, agente_id, matriz_id, activo)
      values ('C-' || lpad(nc::text, 3, '0'), 'cliente', 'I', 'agente', nombres[1 + (k % 20)], '', apellidos[1 + ((k * 7) % 20)], '', '', '', '', '', a.pais_n, '', '', '', '', lpad(cas::text, 3, '0'), a.id, a.matriz_id, true);
    end loop;
  end loop;
  for u in select c2.*, (select e->>'name' from jsonb_array_elements(paises) e where e->>'iso' = left(mz.codigo, 2)) pais_n
           from public.clientes c2 join public.oficinas mz on mz.id = c2.matriz_id where c2.tipo = 'usuario' and c2.rol = 'F' order by c2.id loop
    for i in 1 .. greatest(0, 2 - (select count(*) from public.clientes c where c.tipo = 'cliente' and c.cliente_tipo = 'autonomo' and c.autonomo_id = u.id)) loop
      nc := nc + 1; cas := cas + 1; k := k + 1;
      insert into public.clientes(id, tipo, rol, cliente_tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, dir, municipio, estado, pais, cp, tel1, tel2, email, casillero, autonomo_id, matriz_id, activo)
      values ('C-' || lpad(nc::text, 3, '0'), 'cliente', 'I', 'autonomo', nombres[1 + (k % 20)], '', apellidos[1 + ((k * 7) % 20)], '', '', '', '', '', u.pais_n, '', '', '', '', lpad(cas::text, 3, '0'), u.id, u.matriz_id, true);
    end loop;
  end loop;
end $$;
