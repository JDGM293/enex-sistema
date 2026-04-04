// src/supabase.js — usa proxy de Vercel en lugar de llamadas directas a Supabase

const API_BASE = '/api/db';

async function dbRequest(path, method = 'GET', body = undefined) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, method, body }),
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export const clienteFromDB = (r) => r ? ({
  id: r.id, tipo: r.tipo,
  primerNombre: r.primer_nombre, segundoNombre: r.segundo_nombre,
  primerApellido: r.primer_apellido, segundoApellido: r.segundo_apellido,
  cedula: r.cedula, dir: r.dir, municipio: r.municipio,
  estado: r.estado, pais: r.pais, cp: r.cp,
  tel1: r.tel1, tel2: r.tel2, email: r.email,
  casillero: r.casillero, rol: r.rol, login: r.login,
  password: r.password, clienteTipo: r.cliente_tipo,
  agenteId: r.agente_id, oficinaId: r.oficina_id, activo: r.activo,
}) : null

export const clienteToDB = (c) => ({
  id: c.id, tipo: c.tipo,
  primer_nombre: c.primerNombre, segundo_nombre: c.segundoNombre,
  primer_apellido: c.primerApellido, segundo_apellido: c.segundoApellido,
  cedula: c.cedula, dir: c.dir, municipio: c.municipio,
  estado: c.estado, pais: c.pais, cp: c.cp,
  tel1: c.tel1, tel2: c.tel2, email: c.email,
  casillero: c.casillero, rol: c.rol, login: c.login,
  password: c.password, cliente_tipo: c.clienteTipo,
  agente_id: c.agenteId, oficina_id: c.oficinaId, activo: c.activo ?? true,
})

export const wrFromDB = (r) => r ? ({
  id: r.id, fecha: r.fecha ? new Date(r.fecha) : new Date(),
  consignee: r.consignee, casillero: r.casillero, clienteId: r.cliente_id,
  shipper: r.shipper, carrier: r.carrier, tracking: r.tracking,
  cajas: r.cajas, pesoLb: r.peso_lb, pesoKg: r.peso_kg,
  volLb: r.vol_lb, volKg: r.vol_kg, ft3: r.ft3, m3: r.m3,
  descripcion: r.descripcion, valor: r.valor, tipoEnvio: r.tipo_envio,
  origCountry: r.orig_country, origCity: r.orig_city,
  destCountry: r.dest_country, destCity: r.dest_city,
  status: r.status_code ? {code:r.status_code, label:r.status_label, cls:r.status_cls} : null,
  historial: r.historial || [], dims: r.dims || [], notas: r.notas,
}) : null

export const wrToDB = (w) => ({
  id: w.id, fecha: w.fecha instanceof Date ? w.fecha.toISOString() : w.fecha,
  consignee: w.consignee, casillero: w.casillero, cliente_id: w.clienteId,
  shipper: w.shipper, carrier: w.carrier, tracking: w.tracking,
  cajas: w.cajas, peso_lb: w.pesoLb, peso_kg: w.pesoKg,
  vol_lb: w.volLb, vol_kg: w.volKg, ft3: w.ft3, m3: w.m3,
  descripcion: w.descripcion, valor: w.valor, tipo_envio: w.tipoEnvio,
  orig_country: w.origCountry, orig_city: w.origCity,
  dest_country: w.destCountry, dest_city: w.destCity,
  status_code: w.status?.code, status_label: w.status?.label, status_cls: w.status?.cls,
  historial: w.historial || [], dims: w.dims || [], notas: w.notas,
})

export const dbGetClientes = async () => {
  const data = await dbRequest('clientes?order=id')
  return data.map(clienteFromDB)
}

export const dbUpsertCliente = async (cliente) => {
  try { await dbRequest('clientes', 'POST', clienteToDB(cliente)) }
  catch { await dbRequest(`clientes?id=eq.${cliente.id}`, 'PATCH', clienteToDB(cliente)) }
}

export const dbDeleteCliente = async (id) => {
  await dbRequest(`clientes?id=eq.${id}`, 'DELETE')
}

export const dbGetWR = async () => {
  const data = await dbRequest('wr?order=fecha.desc')
  return data.map(wrFromDB)
}

export const dbUpsertWR = async (wr) => {
  try { await dbRequest('wr', 'POST', wrToDB(wr)) }
  catch { await dbRequest(`wr?id=eq.${wr.id}`, 'PATCH', wrToDB(wr)) }
}

export const dbDeleteWR = async (id) => {
  await dbRequest(`wr?id=eq.${id}`, 'DELETE')
}

export const dbGetAgentes = async () => {
  return await dbRequest('agentes?order=codigo')
}

export const dbUpsertAgente = async (ag) => {
  try { await dbRequest('agentes', 'POST', ag) }
  catch { await dbRequest(`agentes?id=eq.${ag.id}`, 'PATCH', ag) }
}

export const dbDeleteAgente = async (id) => {
  await dbRequest(`agentes?id=eq.${id}`, 'DELETE')
}

export const dbGetOficinas = async () => {
  return await dbRequest('oficinas?order=codigo')
}

export const dbUpsertOficina = async (of) => {
  try { await dbRequest('oficinas', 'POST', of) }
  catch { await dbRequest(`oficinas?id=eq.${of.id}`, 'PATCH', of) }
}

export const dbDeleteOficina = async (id) => {
  await dbRequest(`oficinas?id=eq.${id}`, 'DELETE')
}

export const dbGetTarifas = async () => {
  const data = await dbRequest('tarifas?order=id')
  return data.map(r => ({
    id: r.id, paisOrig: r.pais_orig, ciudadOrig: r.ciudad_orig,
    paisDest: r.pais_dest, ciudadDest: r.ciudad_dest,
    tipoEnvio: r.tipo_envio, porLb: r.por_lb, porFt3: r.por_ft3,
    min: r.min, moneda: r.moneda, activo: r.activo,
  }))
}

export const dbUpsertTarifa = async (t) => {
  const row = {
    id: t.id, pais_orig: t.paisOrig, ciudad_orig: t.ciudadOrig,
    pais_dest: t.paisDest, ciudad_dest: t.ciudadDest,
    tipo_envio: t.tipoEnvio, por_lb: t.porLb, por_ft3: t.porFt3,
    min: t.min, moneda: t.moneda, activo: t.activo,
  }
  try { await dbRequest('tarifas', 'POST', row) }
  catch { await dbRequest(`tarifas?id=eq.${t.id}`, 'PATCH', row) }
}

export const dbDeleteTarifa = async (id) => {
  await dbRequest(`tarifas?id=eq.${id}`, 'DELETE')
}

export const dbLogActividad = async (userId, role, action, detail = '') => {
  try { await dbRequest('actividad', 'POST', { user_id: userId, user_role: role, action, detail }) }
  catch (e) { console.error('logActividad:', e) }
}

export const dbGetActividad = async () => {
  const data = await dbRequest('actividad?order=ts.desc&limit=200')
  return data.map(r => ({ ts: new Date(r.ts), user: r.user_id, role: r.user_role, action: r.action, detail: r.detail }))
}

export const dbGetConsolidaciones = async () => {
  const data = await dbRequest('consolidaciones?order=created_at.desc')
  return data.map(r => ({
    id: r.id, destino: r.destino, tipoEnvio: r.tipo_envio,
    fechaSalida: r.fecha_salida, fechaLlegada: r.fecha_llegada,
    numVuelo: r.num_vuelo, awb: r.awb, bl: r.bl,
    notas: r.notas, containers: r.containers || [], wrIds: r.wr_ids || [],
  }))
}

export const dbUpsertConsolidacion = async (c) => {
  const row = {
    id: c.id, destino: c.destino, tipo_envio: c.tipoEnvio,
    fecha_salida: c.fechaSalida, fecha_llegada: c.fechaLlegada,
    num_vuelo: c.numVuelo, awb: c.awb, bl: c.bl,
    notas: c.notas, containers: c.containers, wr_ids: c.wrIds || [],
  }
  try { await dbRequest('consolidaciones', 'POST', row) }
  catch { await dbRequest(`consolidaciones?id=eq.${c.id}`, 'PATCH', row) }
}
