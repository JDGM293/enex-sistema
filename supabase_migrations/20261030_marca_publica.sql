-- La marca (nombre, subtítulo, logo) se lee antes de iniciar sesión, en la pantalla de ingreso.
-- Solo esa fila de configuración es visible sin sesión. (ya aplicada en producción)
create policy marca_publica on public.configuracion for select to anon using (clave = 'marca');
