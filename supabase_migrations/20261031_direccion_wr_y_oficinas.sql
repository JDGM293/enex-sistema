-- Qué dirección sale en el WR de clientes de agentes y autónomos (matriz u oficina de origen)
alter table public.agentes add column if not exists wr_dir text;
alter table public.clientes add column if not exists wr_dir text;
-- Dirección de cada oficina
alter table public.oficinas add column if not exists dir text, add column if not exists estado text, add column if not exists cp text;

-- Tipo de oficina (Matriz / Asociado): el formulario ya lo enviaba y la columna no existía
alter table public.oficinas add column if not exists tipo text;
