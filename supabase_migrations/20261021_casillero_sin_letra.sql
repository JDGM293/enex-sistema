-- Casilleros solo con número: "C-001" → "001"
update public.clientes set casillero = regexp_replace(casillero, '^C-', '') where casillero like 'C-%';
update public.wr       set casillero = regexp_replace(casillero, '^C-', '') where casillero like 'C-%';
update public.facturas set receptor_casillero = regexp_replace(receptor_casillero, '^C-', '') where receptor_casillero like 'C-%';
