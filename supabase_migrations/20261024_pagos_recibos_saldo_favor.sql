alter table public.pagos add column if not exists recibo_id text default '';
alter table public.pagos add column if not exists pagador_tipo text default '';
alter table public.pagos add column if not exists pagador_id text default '';
alter table public.pagos add column if not exists pagador_nombre text default '';
alter table public.pagos add column if not exists comprobante_url text default '';
create index if not exists pagos_recibo_idx on public.pagos(recibo_id);
create index if not exists pagos_pagador_idx on public.pagos(pagador_tipo,pagador_id);
