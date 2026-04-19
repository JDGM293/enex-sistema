# PROYECTO: ENEX International Courier — WMS/CRM
**Stack:** React 18.2 + Vite · Supabase (PostgreSQL) · Vercel → `intranet.titaniumcargo.com`  
**Archivo principal:** `src/App.jsx` (~4800+ líneas, todo en uno)  
**Repo local:** `C:\Claudio Gabriel\enex-sistema`

---

## CAMBIOS DE ESTA SESIÓN (pendientes de push)

### 1. Pestañas diarias en Recepción en Puerta → cerradas por defecto
**Línea ~1791:**
```js
const open = openDays[day] === true; // antes era !== false
```

### 2. Formulario Nuevo WR → se limpia al cerrar
Los tres cierres del modal (overlay, botón ✕, Cancelar) ahora llaman:
```js
setWrf(emptyWRF()); setClientSearch("");
```

### 3. Documento de impresión del WR reescrito
- Activado solo con `window.print()` → clase `.wr-print-only`
- CSS `@media print` oculta todo el UI y muestra solo el documento impreso
- Estructura idéntica al PDF `wr_261162.pdf` (formato ENEX Venezuela/Tecnokargo)

**Secciones del impreso:**
| Sección | Contenido |
|---|---|
| Cabecera izquierda | Nombre empresa (40px, Arial Black), dirección/tel de la oficina origen, "Powered by [empresa] Courier System" |
| Cabecera derecha | Barcode Code 128 real + número WR grande + fecha y usuario que recibió |
| Shipper Info | Remitente + origen |
| Consignee Info | Nombre cliente, casillero, dirección completa del registro, ciudad destino |
| Fila info | Payment Type / Shipment Type / # Casillero / Tipo Cliente → Ciudad Destino |
| Notas | Campo notas del WR |
| Tabla dims | Line/Qty · Dimensions (in) · Tracking · Weight lb · Vol lb · Weight Ft3 · Vol Ft3 · Weight Kg |
| Fila totales | Pzas: N con totales por columna |
| Entrega | Entregado por / Nombre Completo / Fecha y Hora + Pag: 1/1 |
| Texto legal | 9px, centrado, texto completo IACSSP/TSA |

### 4. Código de barras real (Code 128 escaneable)
- **`index.html`** → script CDN JsBarcode 3.11.6 agregado en `<head>`
- **Componente `WRBarcode`** con `useRef` + `useEffect` → llama `window.JsBarcode()`
- `useRef` agregado al import de React (línea 1 de App.jsx)

### 5. `renderWRDetail` convertido a función de bloque
Variables locales disponibles en el render:
- `_oc` → oficina de origen (desde `oficinas[]`)
- `_cl` → cliente del WR (desde `clients[]`)
- `_destAddr` → dirección completa del cliente (`dir, municipio, estado, pais`)
- `_bcBars()` → barcode CSS decorativo (solo pantalla)

---

## CAMBIOS SESIÓN ANTERIOR (ya en producción)

| Cambio | Descripción |
|---|---|
| Botones lb/kg, pulg/cm | `type="button"`, `setWrf` directo, añadidos a `EMAIL_KEYS_W` |
| `cajaCalcs` | Respeta `unitPeso` para convertir correctamente kg↔lb |
| Edit mode | Reconstruye cajas convirtiendo cm→in y kg→lb al abrir |
| Numeración WR y Guías | `Math.max(...ids)+1` — evita duplicados al borrar |
| 8 mejoras UI formulario WR | Tipo Envío primero, Descripción→textarea, Embalaje→texto libre, etc. |
| Auto-registro clientes | Al crear WR con cliente nuevo → crea registro con `parseNombreCompleto` y `nextCasillero` |
| Email único | Validación en `ClientModal` — no permite duplicar email |
| Casillero configurable | `CASILLERO_PREFIX="C-"`, `CASILLERO_DIGITS=3` al inicio del archivo |

---

## ARCHIVOS MODIFICADOS (pendiente push)
- `src/App.jsx`
- `index.html` ← en la RAÍZ del proyecto, no en src/

## COMANDO PARA PUSH
```bash
cd "C:\Claudio Gabriel\enex-sistema"
git add src/App.jsx index.html
git commit -m "fix: barcode real, WR print mejorado, tabs cerradas, form limpio"
git push
```

---

## PENDIENTE / PRÓXIMOS PASOS
- Verificar que el barcode Code 128 se ve y escanea bien al imprimir
- Botón "📧 Enviar al Cliente" → implementar envío real de email con el WR (necesita servicio: Resend, SendGrid, Supabase Edge Functions, etc.)
- Confirmar en producción que pestañas cerradas y form limpio funcionan

---

## REFERENCIA RÁPIDA — CONSTANTES CLAVE

```js
const CASILLERO_PREFIX = "C-";
const CASILLERO_DIGITS = 3;           // C-001, C-002...
const EMAIL_KEYS_W = ["remitenteEmail","email","password","unitDim","unitPeso"];
const OFFICE_CONFIG = {
  origCountry:"01", origCity:"MI",    // Miami, USA
  destCountry:"58", destCity:"VL",    // Valencia, Venezuela
  branch:"Casa Matriz",
};
```

## FUNCIÓN `emptyWRF()`
```js
const emptyWRF = () => ({
  consignee:"", casilleroSearch:"", casillero:"", clienteId:"",
  remitente:"", remitenteDir:"", remitenteTel:"", remitenteEmail:"",
  chofer:"", idChofer:"", proNumber:"", ocNumber:"",
  tipoPago:"Prepago", tipoEnvio:"",
  notas:"", cargos:[],
  unitDim:"in", unitPeso:"lb",
  cajas:[emptyCaja()],
});
```
