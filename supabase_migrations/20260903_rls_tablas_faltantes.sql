-- 2026-09-03 — Habilitar RLS en las 5 tablas que quedaron sin el tras el
-- incidente de la pausa de Supabase (cargo_releases, delivery_notes, pagos,
-- wr_fotos, consol_fotos).
--
-- Se aplica la MISMA politica permisiva que ya usan wr / clientes / facturas,
-- asi que el comportamiento de la app no cambia: sigue funcionando con la
-- anon key.
--
-- IMPORTANTE: esto NO endurece la seguridad, solo deja el esquema consistente.
-- La app no usa Supabase Auth (los usuarios son filas de `clientes`), asi que
-- la anon key embebida en el bundle JS sigue dando acceso total a todo.
-- El endurecimiento real requiere migrar a Supabase Auth.

alter table public.cargo_releases enable row level security;
alter table public.delivery_notes enable row level security;
alter table public.pagos          enable row level security;
alter table public.wr_fotos       enable row level security;
alter table public.consol_fotos   enable row level security;

drop policy if exists "allow all" on public.cargo_releases;
drop policy if exists "allow all" on public.delivery_notes;
drop policy if exists "allow all" on public.pagos;
drop policy if exists "allow all" on public.wr_fotos;
drop policy if exists "allow all" on public.consol_fotos;

create policy "allow all" on public.cargo_releases for all using (true) with check (true);
create policy "allow all" on public.delivery_notes for all using (true) with check (true);
create policy "allow all" on public.pagos          for all using (true) with check (true);
create policy "allow all" on public.wr_fotos       for all using (true) with check (true);
create policy "allow all" on public.consol_fotos   for all using (true) with check (true);
