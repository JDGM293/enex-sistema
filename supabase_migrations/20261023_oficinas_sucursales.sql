-- Las oficinas son sucursales: los clientes ya no les pertenecen.
-- 1) Clientes "de oficina" o "de vendedor de oficina" pasan a Casa Matriz.
--    Su oficina queda como sucursal de entrega (se puede cambiar en la ficha).
update public.clientes set cliente_tipo = 'matriz'
 where tipo = 'cliente' and cliente_tipo in ('oficina', 'vendedor_oficina');

-- 2) Una oficina de origen no es sucursal de entrega: se quita en esos clientes
--    (en los datos actuales, 01MIA - Miami y 01MAD - Madrid).
update public.clientes set oficina_id = null
 where tipo = 'cliente'
   and oficina_id in (select id from public.oficinas where nombre in ('01MIA', '01MAD'));

-- 3) Los vendedores de oficina pasan a ser Autónomos.
update public.clientes set rol = 'F', cliente_tipo = 'autonomo', oficina_id = null
 where tipo = 'usuario' and (rol = 'G1' or cliente_tipo = 'vendedor_oficina');
