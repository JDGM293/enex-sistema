// src/supabase.js
// Cliente Supabase para ENEX International Courier

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── HELPERS DE CONVERSIÓN ────────────────────────────────────
// Supabase usa snake_case, React usa camelCase

export const clienteFromDB = (r) => r ? ({
  id: r.id, tipo: r.tipo,
  primerNombre: r.primer_nombre, segundoNombre: r.segundo_nombre,
  primerApellido: r.primer_apellido, segundoApellido: r.segundo_apellido,
  cedula: r.cedula, dir: r.dir, municipio: r.municipio,
  estado: r.estado, pais: r.pais, cp: r.cp,
  tel1: r.tel1, tel2: r.tel2, email: r.email,
  casillero: r.casillero, rol: r.rol, login: r.login,
  password: r.password, clienteTipo: r.cliente_tipo || 'matriz',
  agenteId: r.agente_id, oficinaId: r.oficina_id,
  autonomoId: r.autonomo_id, activo: r.activo,
}) : null

export const clienteToDB = (c) => ({
  id: c.id, tipo: c.tipo,
  primer_nombre: c.primerNombre, segundo_nombre: c.segundoNombre,
  primer_apellido: c.primerApellido, segundo_apellido: c.segundoApellido,
  cedula: c.cedula, dir: c.dir, municipio: c.municipio,
  estado: c.estado, pais: c.pais, cp: c.cp,
  tel1: c.tel1, tel2: c.tel2, email: c.email,
  casillero: c.casillero, rol: c.rol, login: c.login,
  password: c.password, cliente_tipo: c.clienteTipo || 'matriz',
  agente_id: c.agenteId, oficina_id: c.oficinaId,
  autonomo_id: c.autonomoId, activo: c.activo ?? true,
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

// ── CLIENTES ─────────────────────────────────────────────────
export const dbGetClientes = async () => {
  const { data, error } = await supabase.from('clientes').select('*').order('id')
  if (error) { console.error('getClientes:', error); return [] }
  return data.map(clienteFromDB)
}

export const dbUpsertCliente = async (cliente) => {
  const { error } = await supabase.from('clientes').upsert(clienteToDB(cliente))
  if (error) console.error('upsertCliente:', error)
}

export const dbDeleteCliente = async (id) => {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) console.error('deleteCliente:', error)
}

// ── WR ───────────────────────────────────────────────────────
export const dbGetWR = async () => {
  const { data, error } = await supabase.from('wr').select('*').order('fecha', {ascending:false})
  if (error) { console.error('getWR:', error); return [] }
  return data.map(wrFromDB)
}

export const dbUpsertWR = async (wr) => {
  const { error } = await supabase.from('wr').upsert(wrToDB(wr))
  if (error) console.error('upsertWR:', error)
}

export const dbDeleteWR = async (id) => {
  const { error } = await supabase.from('wr').delete().eq('id', id)
  if (error) console.error('deleteWR:', error)
}

// ── AGENTES ──────────────────────────────────────────────────
export const dbGetAgentes = async () => {
  const { data, error } = await supabase.from('agentes').select('*').order('codigo')
  if (error) { console.error('getAgentes:', error); return [] }
  return data ?? []
}

export const dbUpsertAgente = async (ag) => {
  // Limpiar campos undefined para evitar errores en Supabase
  const payload = Object.fromEntries(Object.entries(ag).filter(([,v]) => v !== undefined))
  const { data, error } = await supabase.from('agentes').upsert(payload, { onConflict: 'id' }).select()
  if (error) { console.error('upsertAgente:', error.message, error.details, payload); return null }
  return data?.[0] ?? null
}

export const dbDeleteAgente = async (id) => {
  const { error } = await supabase.from('agentes').delete().eq('id', id)
  if (error) console.error('deleteAgente:', error)
}

// ── OFICINAS ─────────────────────────────────────────────────
export const dbGetOficinas = async () => {
  const { data, error } = await supabase.from('oficinas').select('*').order('codigo')
  if (error) { console.error('getOficinas:', error); return [] }
  return data
}

export const dbUpsertOficina = async (of) => {
  const { error } = await supabase.from('oficinas').upsert(of)
  if (error) console.error('upsertOficina:', error)
}

export const dbDeleteOficina = async (id) => {
  const { error } = await supabase.from('oficinas').delete().eq('id', id)
  if (error) console.error('deleteOficina:', error)
}

// ── TARIFAS ──────────────────────────────────────────────────
export const dbGetTarifas = async () => {
  const { data, error } = await supabase.from('tarifas').select('*').order('id')
  if (error) { console.error('getTarifas:', error); return [] }
  return data.map(r => ({
    id: r.id, paisOrig: r.pais_orig, ciudadOrig: r.ciudad_orig,
    paisDest: r.pais_dest, ciudadDest: r.ciudad_dest,
    tipoEnvio: r.tipo_envio, porLb: r.por_lb, porFt3: r.por_ft3,
    min: r.min, moneda: r.moneda, activo: r.activo,
  }))
}

export const dbUpsertTarifa = async (t) => {
  const { error } = await supabase.from('tarifas').upsert({
    id: t.id, pais_orig: t.paisOrig, ciudad_orig: t.ciudadOrig,
    pais_dest: t.paisDest, ciudad_dest: t.ciudadDest,
    tipo_envio: t.tipoEnvio, por_lb: t.porLb, por_ft3: t.porFt3,
    min: t.min, moneda: t.moneda, activo: t.activo,
  })
  if (error) console.error('upsertTarifa:', error)
}

export const dbDeleteTarifa = async (id) => {
  const { error } = await supabase.from('tarifas').delete().eq('id', id)
  if (error) console.error('deleteTarifa:', error)
}

// ── ACTIVIDAD ────────────────────────────────────────────────
export const dbLogActividad = async (userId, role, action, detail='') => {
  const { error } = await supabase.from('actividad').insert({
    ts: new Date().toISOString(), user_id: userId, user_role: role, action, detail
  })
  if (error) console.error('logActividad:', error)
}

export const dbGetActividad = async () => {
  const { data, error } = await supabase.from('actividad').select('*').order('ts', {ascending:false}).limit(200)
  if (error) { console.error('getActividad:', error); return [] }
  return data.map(r => ({ ts: new Date(r.ts), user: r.user_id, role: r.user_role, action: r.action, detail: r.detail }))
}

// ── CONSOLIDACIONES ──────────────────────────────────────────
export const dbGetConsolidaciones = async () => {
  const { data, error } = await supabase.from('consolidaciones').select('*').order('created_at', {ascending:false})
  if (error) { console.error('getConsolidaciones:', error); return [] }
  return data.map(r => ({
    id: r.id, destino: r.destino, tipoEnvio: r.tipo_envio,
    fechaSalida: r.fecha_salida, fechaLlegada: r.fecha_llegada,
    numVuelo: r.num_vuelo, awb: r.awb, bl: r.bl,
    notas: r.notas, containers: r.containers || [], wrIds: r.wr_ids || [],
  }))
}

export const dbUpsertConsolidacion = async (c) => {
  const { error } = await supabase.from('consolidaciones').upsert({
    id: c.id, destino: c.destino, tipo_envio: c.tipoEnvio,
    fecha_salida: c.fechaSalida, fecha_llegada: c.fechaLlegada,
    num_vuelo: c.numVuelo, awb: c.awb, bl: c.bl,
    notas: c.notas, containers: c.containers, wr_ids: c.wrIds || [],
  })
  if (error) console.error('upsertConsolidacion:', error)
}

// ── CONFIGURACION (tipos de envio, pago, contenedor, paises) ─
export const dbGetConfig = async (clave) => {
  const { data, error } = await supabase
    .from('configuracion').select('valor').eq('clave', clave).limit(1)
  if (error) { console.error('getConfig:', clave, error); return null }
  return data?.[0]?.valor ?? null
}

export const dbSetConfig = async (clave, valor) => {
  // Borrar primero para evitar duplicados (funciona independiente del PK de la tabla)
  await supabase.from('configuracion').delete().eq('clave', clave)
  const { error } = await supabase.from('configuracion').insert({ clave, valor })
  if (error) console.error('setConfig:', clave, error)
}

// ── SCAN LOG (Recepción en Puerta) ────────────────────────────
export const dbGetScanLog = async () => {
  const { data, error } = await supabase.from('scan_log').select('*').order('ts', {ascending:false}).limit(1000)
  if (error) { console.error('getScanLog:', error); return [] }
  return data.map(r => ({
    id: r.id, tracking: r.tracking, carrier: r.carrier || '—',
    ts: new Date(r.ts), registered: r.registered ?? false,
  }))
}

export const dbInsertScan = async (entry) => {
  const { error } = await supabase.from('scan_log').insert({
    id: entry.id, tracking: entry.tracking, carrier: entry.carrier || '—',
    ts: entry.ts instanceof Date ? entry.ts.toISOString() : entry.ts,
    registered: entry.registered ?? false,
  })
  if (error) console.error('insertScan:', error)
}

export const dbSetScanRegistered = async (tracking) => {
  const { error } = await supabase.from('scan_log').update({ registered: true }).eq('tracking', tracking)
  if (error) console.error('setScanRegistered:', error)
}

export const dbDeleteScanIds = async (ids) => {
  if (!ids || !ids.length) return
  const { error } = await supabase.from('scan_log').delete().in('id', ids)
  if (error) console.error('deleteScanIds:', error)
}
