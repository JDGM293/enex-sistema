-- Chat interno: canales (configurables en configuracion.chat_canales) y mensajes directos.
-- conv = 'c:<canal>' para canales, 'd:<idA>:<idB>' (ids ordenados) para directos.

create or replace function public.chat_yo_id() returns text language sql stable security definer set search_path to 'public' as $$
  select id from public.clientes where auth_id = auth.uid() and coalesce(activo,true) limit 1;
$$;
create or replace function public.chat_yo_rol() returns text language sql stable security definer set search_path to 'public' as $$
  select rol from public.clientes where auth_id = auth.uid() and coalesce(activo,true) limit 1;
$$;

-- ¿El usuario actual tiene un permiso? Usa los permisos guardados en Roles & Permisos;
-- si aún no se han guardado, aplica los predeterminados que se indiquen.
create or replace function public.chat_tiene_perm(p text, roles_por_defecto text[]) returns boolean language sql stable security definer set search_path to 'public' as $$
  select case when public.chat_yo_rol() = 'A' then true
    else coalesce((select (valor -> public.chat_yo_rol()) ? p from public.configuracion where clave = 'role_perms'),
                  public.chat_yo_rol() = any(roles_por_defecto)) end;
$$;

create or replace function public.chat_puede_ver(c text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.es_cuenta_enex() and (
    (c like 'd:%' and public.chat_yo_id() = any(string_to_array(substr(c,3), ':')))
    or (c like 'c:%' and (public.chat_yo_rol() = 'A' or exists(
          select 1 from public.configuracion, jsonb_array_elements(valor) ch
          where clave = 'chat_canales' and 'c:' || (ch->>'id') = c and (ch->'roles') ? public.chat_yo_rol())))
  );
$$;

create table if not exists public.chat_mensajes (
  id uuid primary key default gen_random_uuid(),
  conv text not null,
  autor_id text not null,
  autor_nombre text,
  autor_rol text,
  texto text not null default '',
  adjuntos jsonb not null default '[]'::jsonb,
  creado timestamptz not null default now(),
  editado timestamptz,
  borrado boolean not null default false
);
create index if not exists chat_mensajes_conv_creado on public.chat_mensajes (conv, creado desc);

create table if not exists public.chat_leidos (
  usuario_id text not null,
  conv text not null,
  visto timestamptz not null default now(),
  primary key (usuario_id, conv)
);

alter table public.chat_mensajes enable row level security;
alter table public.chat_leidos enable row level security;

create policy chat_ver on public.chat_mensajes for select to authenticated using (public.chat_puede_ver(conv));
create policy chat_enviar on public.chat_mensajes for insert to authenticated
  with check (autor_id = public.chat_yo_id() and public.chat_puede_ver(conv));
-- Editar / borrar: el autor durante 15 minutos, o quien tenga el permiso de moderar.
create policy chat_cambiar on public.chat_mensajes for update to authenticated
  using (public.chat_puede_ver(conv) and (
    (autor_id = public.chat_yo_id() and creado > now() - interval '15 minutes')
    or public.chat_tiene_perm('chat_moderar', array['B'])))
  with check (public.chat_puede_ver(conv));

create policy chat_mis_leidos on public.chat_leidos for all to authenticated
  using (usuario_id = public.chat_yo_id()) with check (usuario_id = public.chat_yo_id());

-- No leídos por conversación del usuario actual (respeta la seguridad de las tablas).
create or replace function public.chat_no_leidos() returns table(conv text, n bigint, ultimo timestamptz)
language sql stable security invoker set search_path to 'public' as $$
  select m.conv, count(*) filter (where m.autor_id <> public.chat_yo_id() and not m.borrado and m.creado > coalesce(l.visto,'-infinity')), max(m.creado)
  from public.chat_mensajes m
  left join public.chat_leidos l on l.conv = m.conv and l.usuario_id = public.chat_yo_id()
  group by m.conv;
$$;

alter publication supabase_realtime add table public.chat_mensajes;

-- Adjuntos: bucket privado, solo cuentas del sistema.
insert into storage.buckets (id, name, public) values ('chat-adjuntos','chat-adjuntos', false) on conflict (id) do nothing;
create policy chat_adj_ver on storage.objects for select to authenticated using (bucket_id = 'chat-adjuntos' and public.es_cuenta_enex());
create policy chat_adj_subir on storage.objects for insert to authenticated with check (bucket_id = 'chat-adjuntos' and public.es_cuenta_enex());

-- Canales iniciales (se editan en Configuración → Chat).
insert into public.configuracion (clave, valor)
select 'chat_canales', '[
  {"id":"general","nombre":"General","roles":["A","B","C","D","D1","D2"]},
  {"id":"operaciones","nombre":"Operaciones","roles":["A","B","D","D1","D2"]},
  {"id":"comercial","nombre":"Agentes y oficinas","roles":["A","B","C","E","E1","F","G"]}
]'::jsonb
where not exists (select 1 from public.configuracion where clave = 'chat_canales');

revoke execute on function public.chat_puede_ver(text), public.chat_tiene_perm(text,text[]), public.chat_yo_id(), public.chat_yo_rol(), public.chat_no_leidos() from anon, public;
grant execute on function public.chat_puede_ver(text), public.chat_tiene_perm(text,text[]), public.chat_yo_id(), public.chat_yo_rol(), public.chat_no_leidos() to authenticated;
