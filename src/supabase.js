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
  shipper: r.shipper, remitenteDir: r.remitente_dir || "",
  carrier: r.carrier, tracking: r.tracking,
  cajas: r.cajas, pesoLb: r.peso_lb, pesoKg: r.peso_kg,
  volLb: r.vol_lb, volKg: r.vol_kg, ft3: r.ft3, m3: r.m3,
  descripcion: r.descripcion, valor: r.valor, tipoEnvio: r.tipo_envio,
  tipoPago: r.tipo_pago || "", branch: r.branch || "", usuario: r.usuario || "",
  cargos: r.cargos || [], foto: r.foto || false, prealerta: r.prealerta || false,
  factura: r.factura || "",
  origCountry: r.orig_country, origCity: r.orig_city,
  destCountry: r.dest_country, destCity: r.dest_city,
  status: r.status_code ? {code:r.status_code, label:r.status_label, cls:r.status_cls} : null,
  historial: r.historial || [], dims: r.dims || [], notas: r.notas,
  reempaqueDe: r.reempaque_de || null,
  reempacadoEn: r.reempacado_en || null,
  sobranteDeGuia: r.sobrante_de_guia || "",
}) : null

export const wrToDB = (w) => ({
  id: w.id, fecha: w.fecha instanceof Date ? w.fecha.toISOString() : w.fecha,
  consignee: w.consignee, casillero: w.casillero, cliente_id: w.clienteId,
  shipper: w.shipper, carrier: w.carrier, tracking: w.tracking,
  cajas: w.cajas, peso_lb: w.pesoLb, peso_kg: w.pesoKg,
  vol_lb: w.volLb, vol_kg: w.volKg, ft3: w.ft3, m3: w.m3,
  descripcion: w.descripcion, valor: w.valor, tipo_envio: w.tipoEnvio,
  tipo_pago: w.tipoPago || "", branch: w.branch || "", usuario: w.usuario || "",
  cargos: w.cargos || [], foto: w.foto || false, prealerta: w.prealerta || false,
  factura: w.factura || "",
  orig_country: w.origCountry, orig_city: w.origCity,
  dest_country: w.destCountry, dest_city: w.destCity,
  status_code: w.status?.code, status_label: w.status?.label, status_cls: w.status?.cls,
  historial: w.historial || [], dims: w.dims || [], notas: w.notas,
  remitente_dir: w.remitenteDir || "",
  reempaque_de: w.reempaqueDe || null,
  reempacado_en: w.reempacadoEn || null,
  sobrante_de_guia: w.sobranteDeGuia || "",
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
    fecha: r.fecha || r.created_at || null,
    fechaSalida: r.fecha_salida, fechaLlegada: r.fecha_llegada,
    numVuelo: r.num_vuelo, awb: r.awb, bl: r.bl,
    notas: r.notas, containers: r.containers || [], wrIds: r.wr_ids || [],
    status: r.status || '1',
    usuario: r.usuario || null,
    totalWR: r.total_wr ?? 0,
    totalCajas: r.total_cajas ?? 0,
    totalLb: r.total_lb ?? 0,
    totalFt3: r.total_ft3 ?? 0,
    totalM3: r.total_m3 ?? 0,
    totalVolLb: r.total_vol_lb ?? 0,
    archivada: r.archivada ?? false,
    fechaRecibidaAlmacen: r.fecha_recibida_almacen || null,
  }))
}

export const dbUpsertConsolidacion = async (c) => {
  const { error } = await supabase.from('consolidaciones').upsert({
    id: c.id, destino: c.destino, tipo_envio: c.tipoEnvio,
    fecha: c.fecha || new Date().toISOString(),
    fecha_salida: c.fechaSalida, fecha_llegada: c.fechaLlegada,
    num_vuelo: c.numVuelo, awb: c.awb, bl: c.bl,
    notas: c.notas, containers: c.containers, wr_ids: c.wrIds || [],
    status: c.status || '1',
    usuario: c.usuario || null,
    total_wr: c.totalWR ?? 0,
    total_cajas: c.totalCajas ?? 0,
    total_lb: c.totalLb ?? 0,
    total_ft3: c.totalFt3 ?? 0,
    total_m3: c.totalM3 ?? 0,
    total_vol_lb: c.totalVolLb ?? 0,
    archivada: c.archivada ?? false,
    fecha_recibida_almacen: c.fechaRecibidaAlmacen || null,
  })
  if (error) console.error('upsertConsolidacion:', error)
}

export const dbDeleteConsolidacion = async (id) => {
  const { error } = await supabase.from('consolidaciones').delete().eq('id', id)
  if (error) console.error('deleteConsolidacion:', error)
}

// ── CARGO RELEASES (Egresos) ─────────────────────────────────
export const dbGetCargoReleases = async () => {
  const { data, error } = await supabase.from('cargo_releases').select('*').order('fecha', {ascending:false})
  if (error) { console.error('getCargoReleases:', error); return [] }
  return data.map(r => ({
    id: r.id,
    fecha: r.fecha ? new Date(r.fecha) : new Date(),
    wrIds: r.wr_ids || [],
    agenteCarga: r.agente_carga || '',
    contacto: r.contacto || '',
    documento: r.documento || '',
    vehiculo: r.vehiculo || '',
    notas: r.notas || '',
    usuario: r.usuario || '',
    firmaDataUrl: r.firma_data_url || '',
    anulado: r.anulado ?? false,
    motivoAnulacion: r.motivo_anulacion || '',
  }))
}

export const dbUpsertCargoRelease = async (cr) => {
  const { error } = await supabase.from('cargo_releases').upsert({
    id: cr.id,
    fecha: cr.fecha instanceof Date ? cr.fecha.toISOString() : cr.fecha,
    wr_ids: cr.wrIds || [],
    agente_carga: cr.agenteCarga || '',
    contacto: cr.contacto || '',
    documento: cr.documento || '',
    vehiculo: cr.vehiculo || '',
    notas: cr.notas || '',
    usuario: cr.usuario || '',
    firma_data_url: cr.firmaDataUrl || '',
    anulado: cr.anulado ?? false,
    motivo_anulacion: cr.motivoAnulacion || '',
  })
  if (error) console.error('upsertCargoRelease:', error)
}

export const dbDeleteCargoRelease = async (id) => {
  const { error } = await supabase.from('cargo_releases').delete().eq('id', id)
  if (error) console.error('deleteCargoRelease:', error)
}

// ── DELIVERY NOTES (Notas de Entrega) ────────────────────────
export const dbGetDeliveryNotes = async () => {
  const { data, error } = await supabase.from('delivery_notes').select('*').order('fecha', {ascending:false})
  if (error) { console.error('getDeliveryNotes:', error); return [] }
  return data.map(r => ({
    id: r.id,
    fecha: r.fecha ? new Date(r.fecha) : new Date(),
    wrIds: r.wr_ids || [],
    clienteId: r.cliente_id || '',
    consignatario: r.consignatario || '',
    receptorNombre: r.receptor_nombre || '',
    receptorDocumento: r.receptor_documento || '',
    receptorTelefono: r.receptor_telefono || '',
    direccionEntrega: r.direccion_entrega || '',
    metodoEntrega: r.metodo_entrega || '', // "retiro_oficina" | "domicilio" | "transportista"
    transportista: r.transportista || '',
    notas: r.notas || '',
    usuario: r.usuario || '',
    firmaDataUrl: r.firma_data_url || '',
    anulado: r.anulado ?? false,
    motivoAnulacion: r.motivo_anulacion || '',
  }))
}

export const dbUpsertDeliveryNote = async (dn) => {
  const { error } = await supabase.from('delivery_notes').upsert({
    id: dn.id,
    fecha: dn.fecha instanceof Date ? dn.fecha.toISOString() : dn.fecha,
    wr_ids: dn.wrIds || [],
    cliente_id: dn.clienteId || '',
    consignatario: dn.consignatario || '',
    receptor_nombre: dn.receptorNombre || '',
    receptor_documento: dn.receptorDocumento || '',
    receptor_telefono: dn.receptorTelefono || '',
    direccion_entrega: dn.direccionEntrega || '',
    metodo_entrega: dn.metodoEntrega || '',
    transportista: dn.transportista || '',
    notas: dn.notas || '',
    usuario: dn.usuario || '',
    firma_data_url: dn.firmaDataUrl || '',
    anulado: dn.anulado ?? false,
    motivo_anulacion: dn.motivoAnulacion || '',
  })
  if (error) console.error('upsertDeliveryNote:', error)
}

export const dbDeleteDeliveryNote = async (id) => {
  const { error } = await supabase.from('delivery_notes').delete().eq('id', id)
  if (error) console.error('deleteDeliveryNote:', error)
}

// ── FACTURAS ──────────────────────────────────────────────────
export const dbGetFacturas = async () => {
  const { data, error } = await supabase.from('facturas').select('*').order('numero', {ascending:false})
  if (error) { console.error('getFacturas:', error); return [] }
  return data.map(r => ({
    id: r.id,
    numero: r.numero || 0,
    tipo: r.tipo || 'factura',
    fecha: r.fecha ? new Date(r.fecha) : new Date(),
    fechaEmision: r.fecha_emision ? new Date(r.fecha_emision) : null,
    status: r.status || 'borrador',
    moneda: r.moneda || 'USD',
    receptorTipo: r.receptor_tipo || 'cliente',
    receptorId: r.receptor_id || '',
    receptorNombre: r.receptor_nombre || '',
    receptorDoc: r.receptor_doc || '',
    receptorDir: r.receptor_dir || '',
    receptorTel: r.receptor_tel || '',
    receptorEmail: r.receptor_email || '',
    receptorCasillero: r.receptor_casillero || '',
    lineas: r.lineas || [],
    subtotal: parseFloat(r.subtotal) || 0,
    descuento: parseFloat(r.descuento) || 0,
    total: parseFloat(r.total) || 0,
    pagado: parseFloat(r.pagado) || 0,
    saldo: parseFloat(r.saldo) || 0,
    wrIds: r.wr_ids || [],
    guiaIds: r.guia_ids || [],
    ncFacturaOrigen: r.nc_factura_origen || '',
    notas: r.notas || '',
    condiciones: r.condiciones || '',
    usuario: r.usuario || '',
    motivoAnulacion: r.motivo_anulacion || '',
    fechaAnulacion: r.fecha_anulacion ? new Date(r.fecha_anulacion) : null,
  }))
}

export const dbUpsertFactura = async (f) => {
  const { error } = await supabase.from('facturas').upsert({
    id: f.id,
    numero: f.numero || 0,
    tipo: f.tipo || 'factura',
    fecha: f.fecha instanceof Date ? f.fecha.toISOString() : f.fecha,
    fecha_emision: f.fechaEmision instanceof Date ? f.fechaEmision.toISOString() : (f.fechaEmision || null),
    status: f.status || 'borrador',
    moneda: f.moneda || 'USD',
    receptor_tipo: f.receptorTipo || 'cliente',
    receptor_id: f.receptorId || '',
    receptor_nombre: f.receptorNombre || '',
    receptor_doc: f.receptorDoc || '',
    receptor_dir: f.receptorDir || '',
    receptor_tel: f.receptorTel || '',
    receptor_email: f.receptorEmail || '',
    receptor_casillero: f.receptorCasillero || '',
    lineas: f.lineas || [],
    subtotal: f.subtotal || 0,
    descuento: f.descuento || 0,
    total: f.total || 0,
    pagado: f.pagado || 0,
    saldo: f.saldo || 0,
    wr_ids: f.wrIds || [],
    guia_ids: f.guiaIds || [],
    nc_factura_origen: f.ncFacturaOrigen || '',
    notas: f.notas || '',
    condiciones: f.condiciones || '',
    usuario: f.usuario || '',
    motivo_anulacion: f.motivoAnulacion || '',
    fecha_anulacion: f.fechaAnulacion instanceof Date ? f.fechaAnulacion.toISOString() : (f.fechaAnulacion || null),
  })
  if (error) console.error('upsertFactura:', error)
}

export const dbDeleteFactura = async (id) => {
  const { error } = await supabase.from('facturas').delete().eq('id', id)
  if (error) console.error('deleteFactura:', error)
}

// ── PAGOS ─────────────────────────────────────────────────────
export const dbGetPagos = async () => {
  const { data, error } = await supabase.from('pagos').select('*').order('fecha', {ascending:false})
  if (error) { console.error('getPagos:', error); return [] }
  return data.map(r => ({
    id: r.id,
    facturaId: r.factura_id || '',
    fecha: r.fecha ? new Date(r.fecha) : new Date(),
    monto: parseFloat(r.monto) || 0,
    moneda: r.moneda || 'USD',
    tipoPago: r.tipo_pago || 'efectivo',
    referencia: r.referencia || '',
    notaReferencial: r.nota_referencial || '',
    anulado: r.anulado ?? false,
    motivoAnulacion: r.motivo_anulacion || '',
    usuario: r.usuario || '',
  }))
}

export const dbUpsertPago = async (p) => {
  const { error } = await supabase.from('pagos').upsert({
    id: p.id,
    factura_id: p.facturaId || '',
    fecha: p.fecha instanceof Date ? p.fecha.toISOString() : p.fecha,
    monto: p.monto || 0,
    moneda: p.moneda || 'USD',
    tipo_pago: p.tipoPago || 'efectivo',
    referencia: p.referencia || '',
    nota_referencial: p.notaReferencial || '',
    anulado: p.anulado ?? false,
    motivo_anulacion: p.motivoAnulacion || '',
    usuario: p.usuario || '',
  })
  if (error) console.error('upsertPago:', error)
}

export const dbDeletePago = async (id) => {
  const { error } = await supabase.from('pagos').delete().eq('id', id)
  if (error) console.error('deletePago:', error)
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

// ── FOTOS DEL PAQUETE (wr_fotos + Storage bucket wr-fotos) ─────
// Cada WR puede tener 0..N fotos por caja. El archivo vive en el bucket
// "wr-fotos" y la tabla wr_fotos mantiene metadata (qué archivo, de qué
// WR, qué caja, quién lo subió, cuándo).

const FOTOS_BUCKET = 'wr-fotos'

// Sube un archivo al bucket y retorna { path, url }. path se usa para
// borrar después; url es la URL pública para mostrar.
export const storageUploadFoto = async (file, wrId, cajaIdx=0) => {
  if (!file) return null
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2,8)
  const ext = (file.name && file.name.includes('.')) ? file.name.split('.').pop().toLowerCase() : 'jpg'
  const safeExt = ext.replace(/[^a-z0-9]/g,'') || 'jpg'
  const path = `${wrId}/caja_${cajaIdx}/${ts}_${rand}.${safeExt}`
  const { error } = await supabase.storage.from(FOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg',
  })
  if (error) { console.error('storageUploadFoto:', error); return null }
  const { data: pub } = supabase.storage.from(FOTOS_BUCKET).getPublicUrl(path)
  return { path, url: pub?.publicUrl || '' }
}

// Borra el blob del bucket (solo Storage, no la fila en wr_fotos).
export const storageDeleteFoto = async (path) => {
  if (!path) return
  const { error } = await supabase.storage.from(FOTOS_BUCKET).remove([path])
  if (error) console.error('storageDeleteFoto:', error)
}

export const fotoFromDB = (r) => r ? ({
  id: r.id, wrId: r.wr_id, cajaIdx: r.caja_idx ?? 0,
  url: r.url, path: r.path, filename: r.filename || '',
  mime: r.mime || 'image/jpeg', sizeBytes: r.size_bytes || 0,
  source: r.source || 'upload', uploadedBy: r.uploaded_by || '',
  createdAt: r.created_at ? new Date(r.created_at) : new Date(),
}) : null

// Lee todas las fotos de un WR. Retorna array ordenado por cajaIdx asc y createdAt asc.
export const dbGetFotosByWR = async (wrId) => {
  if (!wrId) return []
  const { data, error } = await supabase.from('wr_fotos')
    .select('*').eq('wr_id', wrId)
    .order('caja_idx', {ascending:true})
    .order('created_at', {ascending:true})
  if (error) { console.error('getFotosByWR:', error); return [] }
  return (data||[]).map(fotoFromDB)
}

// Inserta una fila en wr_fotos. Retorna la foto creada (con id generado) o null.
export const dbInsertFoto = async ({ wrId, cajaIdx=0, url, path, filename='', mime='image/jpeg', sizeBytes=0, source='upload', uploadedBy='' }) => {
  if (!wrId || !url || !path) return null
  const { data, error } = await supabase.from('wr_fotos').insert({
    wr_id: wrId, caja_idx: cajaIdx, url, path, filename, mime,
    size_bytes: sizeBytes, source, uploaded_by: uploadedBy,
  }).select().single()
  if (error) { console.error('insertFoto:', error); return null }
  return fotoFromDB(data)
}

// Borra una fila + su blob. Si no pasás path, solo borra la fila.
export const dbDeleteFoto = async (id, path=null) => {
  if (!id) return
  const { error } = await supabase.from('wr_fotos').delete().eq('id', id)
  if (error) { console.error('deleteFoto:', error); return }
  if (path) await storageDeleteFoto(path)
}
