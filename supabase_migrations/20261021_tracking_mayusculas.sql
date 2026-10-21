-- Normaliza a mayúsculas los campos del WR y el tracking de Recepción en Puerta,
-- y marca como registrado en scan_log cualquier tracking que ya tenga WR.

-- 1) WR: guardar siempre en mayúsculas los campos de texto del formulario
create or replace function public.wr_normalizar_mayusculas()
returns trigger language plpgsql as $$
begin
  new.tracking      := nullif(upper(trim(new.tracking)), '');
  new.consignee     := upper(new.consignee);
  new.shipper       := upper(new.shipper);
  new.carrier       := upper(new.carrier);
  new.casillero     := upper(new.casillero);
  new.descripcion   := upper(new.descripcion);
  new.remitente_dir := upper(new.remitente_dir);
  new.orig_city     := upper(new.orig_city);
  new.dest_city     := upper(new.dest_city);
  new.notas         := upper(new.notas);
  return new;
end $$;

drop trigger if exists trg_wr_mayusculas on public.wr;
create trigger trg_wr_mayusculas before insert or update on public.wr
for each row execute function public.wr_normalizar_mayusculas();

-- 2) Recepción en puerta: tracking siempre en mayúsculas
create or replace function public.scan_log_normalizar()
returns trigger language plpgsql as $$
begin
  new.tracking := upper(trim(new.tracking));
  return new;
end $$;

drop trigger if exists trg_scan_log_mayusculas on public.scan_log;
create trigger trg_scan_log_mayusculas before insert or update on public.scan_log
for each row execute function public.scan_log_normalizar();

-- 3) Al registrar un WR, sacar su tracking (y los de sus cajas) de la lista "por registrar"
create or replace function public.wr_marcar_scan_registrado()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.scan_log s
     set registered = true
   where coalesce(s.registered, false) = false
     and (
       s.tracking = new.tracking
       or exists (
         select 1 from jsonb_array_elements(coalesce(new.dims, '[]'::jsonb)) d
         where upper(trim(d->>'tracking')) = s.tracking
       )
     );
  return new;
end $$;

drop trigger if exists trg_wr_marcar_scan on public.wr;
create trigger trg_wr_marcar_scan after insert or update of tracking, dims on public.wr
for each row execute function public.wr_marcar_scan_registrado();

-- 4) Corregir datos existentes
update public.wr set tracking = upper(trim(tracking)) where tracking <> upper(trim(tracking));
update public.scan_log s set registered = true
 where coalesce(s.registered,false) = false
   and exists (select 1 from public.wr w where w.tracking = upper(trim(s.tracking)));
