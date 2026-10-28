import { useState, useEffect, useRef, Fragment } from "react";
import { createPortal } from "react-dom";
import { supabase, resolverLogin, cuentaGuardar, cuentaEliminar, dbGetClientes, dbUpsertCliente, dbDeleteCliente, dbGetWR, dbUpsertWR, dbDeleteWR, dbGetAgentes, dbUpsertAgente, dbDeleteAgente, dbGetOficinas, dbUpsertOficina, dbDeleteOficina, dbGetTarifas, dbUpsertTarifa, dbDeleteTarifa, dbGetConsolidaciones, dbUpsertConsolidacion, dbDeleteConsolidacion, dbGetCargoReleases, dbUpsertCargoRelease, dbDeleteCargoRelease, dbGetDeliveryNotes, dbUpsertDeliveryNote, dbDeleteDeliveryNote, dbGetFacturas, dbUpsertFactura, dbDeleteFactura, dbGetPagos, dbUpsertPago, dbDeletePago, storageUploadComprobante, dbLogActividad, dbGetActividad, dbGetConfig, dbSetConfig, dbGetScanLog, dbInsertScan, dbSetScanRegistered, dbDeleteScanIds, storageUploadFoto, storageDeleteFoto, dbGetFotosByWR, dbInsertFoto, dbDeleteFoto, storageUploadFotoConsol, storageDeleteFotoConsol, dbGetFotosByConsol, dbInsertFotoConsol, dbDeleteFotoConsol } from "./supabase";

// ─── TEMA CLARO PROFESIONAL ───────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif}
:root{
  --bg:#F0F2F5;--bg2:#FFFFFF;--bg3:#F8F9FB;--bg4:#EEF0F4;--bg5:#E2E6ED;
  --gold:#B07D10;--gold2:#C8971C;--golda:rgba(176,125,16,0.1);--goldb:rgba(176,125,16,0.06);
  --navy:#1A2B4A;--navy2:#243554;--navy3:#2E4068;
  --cyan:#0080CC;--green:#1A8A4A;--red:#CC2233;--orange:#C05800;
  --purple:#5B3FB5;--teal:#007A6A;--sky:#1866CC;
  --t1:#1A2332;--t2:#445570;--t3:#8090AA;--t4:#C0CAD8;
  --b1:#D8DCE4;--b2:#E8EBF0;--b3:#F0F2F6;
  --shadow:0 1px 4px rgba(0,0,0,0.08);--shadow2:0 4px 16px rgba(0,0,0,0.12);
}
html,body{height:100%;overflow:hidden;margin:0;padding:0}
body{background:var(--bg);color:var(--t1);font-family:Arial,Helvetica,sans-serif;font-size:16px}
#root{height:100%}
::-webkit-scrollbar{width:12px;height:12px}
::-webkit-scrollbar-track{background:var(--bg4)}
::-webkit-scrollbar-thumb{background:#9AA8BC;border-radius:7px;border:2px solid var(--bg4);min-height:40px;min-width:40px}
::-webkit-scrollbar-thumb:hover{background:var(--navy)}
*{scrollbar-width:auto;scrollbar-color:#9AA8BC var(--bg4)}
input,select,textarea,button{font-family:Arial,Helvetica,sans-serif}
input.fi:not([type="email"]):not([type="password"]):not([type="number"]){text-transform:uppercase}

/* ── LAYOUT ─────────────────────────────────────────────────────────────── */
.app{display:flex;height:100vh;width:100vw;overflow:hidden}

/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
.sb{
  width:215px;flex-shrink:0;height:100vh;
  background:var(--navy);
  display:flex;flex-direction:column;overflow:hidden;
}
.sb-logo{padding:16px 14px 12px;border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;display:flex;align-items:center;gap:9px}
.sb-mark{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#C8971C,#E5AE3A);display:flex;align-items:center;justify-content:center;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:900;color:#1A2B4A;flex-shrink:0}
.sb-name{font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:2px;color:#FFFFFF}
.sb-name span{color:#E5AE3A}
.sb-sub{font-size:10px;color:#E5AE3A;letter-spacing:2.5px;text-transform:uppercase;opacity:.8}
.sb-nav{flex:1;padding:8px 6px;overflow-y:auto}
.sb-lbl{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);padding:10px 9px 3px;font-weight:700}
.ni{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:all .12s;font-size:15px;font-weight:500;color:rgba(255,255,255,0.7);border:1px solid transparent;margin-bottom:2px}
.ni:hover{background:rgba(255,255,255,0.1);color:#fff}
.ni.on{background:rgba(200,151,28,0.2);border-color:rgba(200,151,28,0.4);color:#E5AE3A}
.ni-ic{font-size:16px;width:16px;text-align:center;flex-shrink:0}
.ni-lbl{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
.n-bx{margin-left:auto;background:#E5AE3A;color:#1A2B4A;font-size:11px;font-weight:800;padding:1px 6px;border-radius:4px;flex-shrink:0}
.n-bx.r{background:#CC2233;color:#fff}
.sb-foot{padding:9px;border-top:1px solid rgba(255,255,255,0.1);flex-shrink:0}
.u-row{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:7px;background:rgba(255,255,255,0.08);cursor:pointer}
.u-row:hover{background:rgba(255,255,255,0.14)}
.u-av{width:30px;height:30px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:#E5AE3A;color:#1A2B4A}
.u-nm{font-size:14px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.u-rl{font-size:12px;color:rgba(255,255,255,0.4)}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
.main{flex:1;min-width:0;height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* ── TOPBAR ──────────────────────────────────────────────────────────────── */
.topbar{height:50px;background:var(--bg2);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;box-shadow:var(--shadow)}
.tb-ttl{font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;flex:1;color:var(--navy);letter-spacing:.3px}
.tb-srch{display:flex;align-items:center;gap:6px;background:var(--bg3);border:1px solid var(--b1);border-radius:7px;padding:5px 10px;transition:border .12s}
.tb-srch:focus-within{border-color:var(--gold2)}
.tb-srch input{background:none;border:none;outline:none;color:var(--t1);font-size:14px;width:180px}
.tb-srch input::placeholder{color:var(--t3)}
.tb-ic{width:30px;height:30px;border-radius:6px;background:var(--bg3);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;position:relative;flex-shrink:0;transition:background .12s}
.tb-ic:hover{background:var(--bg4)}
.tb-dot{position:absolute;top:4px;right:4px;width:5px;height:5px;border-radius:50%;background:var(--red)}

/* ── CONTENT ─────────────────────────────────────────────────────────────── */
.cnt{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0}
.page-scroll{flex:1;overflow-y:auto;min-height:0;padding:14px 18px}

/* ── STATS ───────────────────────────────────────────────────────────────── */
.stats{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:8px 14px 6px;flex-shrink:0}
.stat{
  background:var(--bg2);border:1px solid var(--b1);border-radius:8px;
  padding:7px 9px;position:relative;overflow:hidden;
  cursor:pointer;transition:all .15s;box-shadow:var(--shadow);
}
.stat:hover{border-color:var(--gold2);box-shadow:var(--shadow2);transform:translateY(-1px)}
.stat.active{border-color:var(--gold2);background:rgba(176,125,16,0.06)}
.stat-ic{font-size:14px;margin-bottom:2px;line-height:1}
.stat-v{font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:var(--navy);line-height:1}
.stat-l{font-size:11px;color:var(--t2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stat-d{font-size:10px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stat-d.up{color:var(--green)}.stat-d.dn{color:var(--red)}.stat-d.neu{color:var(--t3)}
.stat-bar{position:absolute;bottom:0;left:0;right:0;height:2px;border-radius:0 0 8px 8px}

/* ── DASH GRID ───────────────────────────────────────────────────────────── */
.dash-grid{display:grid;grid-template-columns:1fr 256px;gap:12px;flex:1;min-height:0;overflow:hidden}

/* ── WR PANEL ────────────────────────────────────────────────────────────── */
.wr-panel{display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--b1);border-radius:12px;min-width:0;overflow:hidden;box-shadow:var(--shadow)}
.wr-toolbar{display:flex;align-items:center;gap:7px;padding:8px 12px;border-bottom:1px solid var(--b2);flex-shrink:0;background:var(--bg3)}
.wr-ttl{font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;white-space:nowrap;color:var(--navy)}
.wr-cnt{font-size:11.5px;color:var(--t3);background:var(--bg4);padding:2px 7px;border-radius:4px;border:1px solid var(--b1)}
.flex1{flex:1}

/* search param */
.srch-adv{display:flex;align-items:center;gap:0;border:1px solid var(--b1);border-radius:7px;overflow:hidden;background:var(--bg2);flex-shrink:0}
.srch-param{background:var(--bg4);border:none;border-right:1px solid var(--b1);outline:none;color:var(--t2);font-size:12.5px;padding:5px 8px;cursor:pointer;height:30px}
.srch-adv input{border:none;outline:none;color:var(--t1);font-size:13px;padding:5px 10px;width:160px;background:transparent}
.srch-adv input::placeholder{color:var(--t3)}

.unit-tog{display:flex;align-items:center;gap:3px;background:var(--bg4);border-radius:5px;padding:2px 7px;border:1px solid var(--b1);flex-shrink:0}
.unit-tog span{font-size:11px;color:var(--t3)}
.utb{padding:2px 7px;border-radius:4px;font-size:11.5px;font-weight:600;cursor:pointer;border:none;transition:all .1s;background:none;color:var(--t2)}
.utb.on{background:var(--navy);color:#fff}

.st-sel{background:var(--bg4);border:1px solid var(--b1);border-radius:6px;padding:4px 7px;color:var(--t1);font-size:12px;outline:none;cursor:pointer;flex-shrink:0;max-width:160px}

/* BUTTONS */
.btn-p{padding:8px 18px;border-radius:7px;background:var(--navy);color:#fff;font-size:14px;font-weight:700;border:2px solid var(--navy3);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .12s;box-shadow:0 2px 6px rgba(26,43,74,0.25)}
.btn-p:hover{background:var(--navy2);box-shadow:0 4px 12px rgba(26,43,74,0.35);transform:translateY(-1px)}
.btn-s{padding:5px 10px;border-radius:6px;background:var(--bg3);color:var(--t1);font-size:13px;font-weight:600;border:1px solid var(--b1);cursor:pointer;white-space:nowrap;transition:background .12s}
.btn-s:hover{background:var(--bg4)}
.btn-g{padding:5px 10px;border-radius:6px;background:rgba(26,138,74,0.1);color:var(--green);font-size:13px;font-weight:600;border:1px solid rgba(26,138,74,0.25);cursor:pointer}
.btn-d{padding:5px 10px;border-radius:6px;background:rgba(204,34,51,0.08);color:var(--red);font-size:13px;font-weight:600;border:1px solid rgba(204,34,51,0.2);cursor:pointer}
.btn-c{padding:5px 10px;border-radius:6px;background:rgba(0,128,204,0.1);color:var(--cyan);font-size:13px;font-weight:600;border:1px solid rgba(0,128,204,0.25);cursor:pointer}

/* ── TABLE ───────────────────────────────────────────────────────────────── */
.wr-scroll{overflow:auto;flex:1;min-height:0}
.wr-scroll::-webkit-scrollbar{width:12px;height:14px}
.wr-scroll::-webkit-scrollbar-track{background:var(--bg4);border-top:1px solid var(--b1)}
.wr-scroll::-webkit-scrollbar-thumb{background:#9AA8BC;border-radius:7px;border:2px solid var(--bg4);min-width:40px;min-height:40px}
.wr-scroll::-webkit-scrollbar-thumb:hover{background:var(--navy)}
.wr-scroll{scrollbar-color:#9AA8BC var(--bg4);scrollbar-width:auto}
.wt{width:100%;border-collapse:collapse;font-size:14.5px;white-space:nowrap}
.wt thead{position:sticky;top:0;z-index:5}
.wt th{background:var(--navy);color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:.7px;text-transform:uppercase;font-weight:700;padding:9px 10px;border-bottom:2px solid var(--navy3);text-align:left;cursor:pointer;user-select:none;white-space:nowrap}
.wt th:hover{color:#fff}
.wt th:first-child{position:sticky;left:0;z-index:6;background:var(--navy)}
.wt td{padding:9px 10px;color:var(--t1);border-bottom:1px solid var(--b2);vertical-align:middle;white-space:nowrap;font-size:14.5px}
.wt td:first-child{position:sticky;left:0;z-index:2;background:var(--bg2)}
.wt tbody tr{transition:background .08s}
.wt tbody tr:hover td{background:#EEF3FF;cursor:pointer}
.wt tbody tr:hover td:first-child{background:#EEF3FF}
.wt tbody tr.sel td{background:#E8F0FE}
.wt tbody tr.sel td:first-child{background:#E8F0FE}
.wt tbody tr:last-child td{border-bottom:none}
.wt tbody tr.wr-row td{cursor:default}
.wt tbody tr.wr-row td:first-child{cursor:pointer}
/* Estado y Tipo Envío en la tabla WR: 1 nivel más pequeño que el resto (sin tocar el header) */
.wt td .st{font-size:11.5px;padding:2px 8px}
.wt td .type-b{font-size:11.5px;padding:2px 6px}

/* cells */
.c-wr{display:inline-block;font-family:'DM Mono',monospace;font-weight:700;font-size:14px;background:#fff;border:2px solid #1A2B4A;color:#1A2B4A;padding:3px 9px;border-radius:5px;letter-spacing:.5px;white-space:nowrap}
.c-route{font-size:12px;color:var(--t3);margin-top:3px}
.c-name{color:var(--t1);font-weight:600;font-size:15px}
.c-cas{font-family:'DM Mono',monospace;font-size:12px;color:var(--gold2);margin-top:2px}
.c-trk{font-family:'DM Mono',monospace;font-size:13px;color:var(--cyan)}
.c-val{font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:var(--green)}
.c-wt{font-family:'DM Mono',monospace;font-size:14px;color:var(--t1);font-weight:600}
.c-wtvol{font-family:'DM Mono',monospace;font-size:14px;color:var(--orange);font-weight:700}
.c-ft3{font-family:'DM Mono',monospace;font-size:13px;color:var(--sky)}
.c-m3{font-family:'DM Mono',monospace;font-size:13px;color:var(--teal)}
.c-note{font-size:14px;color:var(--orange);max-width:120px;overflow:hidden;text-overflow:ellipsis;display:block}
.c-dt{font-family:'DM Mono',monospace;font-size:14px;color:var(--t1);font-weight:600}
.c-tm{font-family:'DM Mono',monospace;font-size:12px;color:var(--t3);margin-top:2px}
.br-b{font-size:12px;background:var(--bg4);padding:2px 7px;border-radius:4px;color:var(--t2);border:1px solid var(--b1)}
.c-name{color:var(--t1);font-weight:600;font-size:13px}
.c-cas{font-family:'DM Mono',monospace;font-size:10.5px;color:var(--gold2);margin-top:1px}
.c-trk{font-family:'DM Mono',monospace;font-size:12px;color:var(--cyan)}
.c-val{font-family:'DM Mono',monospace;font-size:12.5px;font-weight:700;color:var(--green)}
.c-wt{font-family:'DM Mono',monospace;font-size:12px;color:var(--t1)}
.c-wtvol{font-family:'DM Mono',monospace;font-size:12px;color:var(--orange);font-weight:600}
.c-ft3{font-family:'DM Mono',monospace;font-size:11.5px;color:var(--sky)}
.c-m3{font-family:'DM Mono',monospace;font-size:11.5px;color:var(--teal)}
.c-note{font-size:12px;color:var(--orange);max-width:110px;overflow:hidden;text-overflow:ellipsis;display:block}
.c-dt{font-family:'DM Mono',monospace;font-size:12px;color:var(--t1);font-weight:600}
.c-tm{font-family:'DM Mono',monospace;font-size:11px;color:var(--t3);margin-top:1px}
.br-b{font-size:11px;background:var(--bg4);padding:2px 6px;border-radius:4px;color:var(--t2);border:1px solid var(--b1)}

/* carrier badges */
.car{display:inline-flex;padding:3px 8px;border-radius:4px;font-size:13px;font-weight:700;border:1px solid}
.car-ups{background:#FFF3E0;border-color:#E6A020;color:#8B5E00}
.car-fedex{background:#F3E8FF;border-color:#8B5CF6;color:#5B3FB5}
.car-dhl{background:#FFFDE7;border-color:#D4A017;color:#7A5C00}
.car-usps{background:#E8F0FE;border-color:#4A85E0;color:#1A4FA0}
.car-def{background:var(--bg4);border-color:var(--b1);color:var(--t2)}

/* status */
.st{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:700;white-space:nowrap}
.st-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.s1{background:#FEF9E7;color:#8B6914;border:1px solid #F0C040}.s1 .st-dot{background:#C8971C}
.s2{background:#E8F4FD;color:#1A6090;border:1px solid #90C8F0}.s2 .st-dot{background:#0080CC}
.s3{background:#E8F8EE;color:#1A6040;border:1px solid #80D0A0}.s3 .st-dot{background:#1A8A4A}
.s4{background:#FDE8EA;color:#8B1420;border:1px solid #F0A0A8}.s4 .st-dot{background:#CC2233}
.s5{background:#FEF0E8;color:#8B4000;border:1px solid #F0B880}.s5 .st-dot{background:#C05800}
.s6{background:#F0EAFE;color:#4A2A90;border:1px solid #C0A0F0}.s6 .st-dot{background:#5B3FB5}

/* type badges */
.type-b{display:inline-flex;padding:3px 8px;border-radius:4px;font-size:13px;font-weight:700;border:1px solid;white-space:nowrap}
.t-ae{background:#E8F4FD;color:#1A6090;border-color:#90C8F0}
.t-ae2{background:#EEF8FE;color:#2A7AAA;border-color:#B0D8F0}
.t-mf{background:#E8F8EE;color:#1A6040;border-color:#80D0A0}
.t-ml{background:#EEF8F2;color:#2A7050;border-color:#A0D8B8}
.t-tr{background:#FEF0E8;color:#8B4000;border-color:#F0B880}

/* icon buttons */
.ic-b{width:22px;height:22px;border-radius:4px;border:1px solid var(--b1);background:var(--bg3);display:inline-flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .1s}
.ic-b:hover{background:var(--bg4)}
.ic-b.has{background:#E8F8EE;border-color:#80D0A0;color:var(--green)}

/* dim popup */
.pos-rel{position:relative}
.dim-txt{font-size:14px;color:var(--t1);font-weight:600}
.dim-sub{font-size:12px;color:var(--t3);margin-top:2px}
.dim-btn{background:var(--bg3);border:1px solid var(--b1);border-radius:5px;color:var(--t2);font-size:13px;padding:4px 10px;cursor:pointer;transition:all .1s;font-weight:600}
.dim-btn:hover{border-color:var(--gold2);color:var(--gold2)}
.dim-pop{
  position:absolute;z-index:99;background:var(--bg2);border:1px solid var(--b1);
  border-radius:10px;padding:14px 16px;min-width:380px;
  box-shadow:0 8px 32px rgba(0,0,0,0.18);left:0;top:calc(100% + 6px);
}
.dim-pop-ttl{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:10px;font-family:Arial,Helvetica,sans-serif;letter-spacing:.5px}
.dr{display:grid;grid-template-columns:24px 72px 72px 72px 72px 80px;gap:4px;font-size:13px;padding:5px 0;border-bottom:1px solid var(--b2)}
.dr:last-child{border-bottom:none}
.dh{color:var(--t3);font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.dv{font-family:'DM Mono',monospace;color:var(--t1);font-weight:500}

/* ── PAGINATION ──────────────────────────────────────────────────────────── */
.pag{display:flex;align-items:center;justify-content:center;gap:4px;padding:8px 12px;border-top:1px solid var(--b2);flex-shrink:0;background:var(--bg3)}
.pag-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--b1);background:var(--bg2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;font-weight:600;color:var(--t2);transition:all .1s}
.pag-btn:hover{background:var(--bg4);color:var(--t1)}
.pag-btn.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.pag-btn:disabled{opacity:.4;cursor:default}
.pag-info{font-size:13px;color:var(--t3);padding:0 8px}

/* ── ROLE BADGES ─────────────────────────────────────────────────────────── */
.rb{display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:4px;font-size:10.5px;font-weight:800;letter-spacing:.3px;white-space:nowrap}
.rA{background:#FDE8EA;color:#8B1420;border:1px solid #F0A0A8}
.rB{background:#F0EAFE;color:#4A2A90;border:1px solid #C0A0F0}
.rC{background:#E8F4FD;color:#1A6090;border:1px solid #90C8F0}
.rD{background:#FEF9E7;color:#8B6914;border:1px solid #F0C040}
.rD1{background:#FFFDE7;color:#7A5A00;border:1px solid #E8D070}
.rD2{background:#FFF8E0;color:#6A4A00;border:1px solid #D8B840}
.rE{background:#E8F8F4;color:#1A6050;border:1px solid #80C8B0}
.rE1{background:#EEF8F5;color:#2A7060;border:1px solid #A0D8C0}
.rF{background:#E8F0FE;color:#1A4FA0;border:1px solid #90B8F0}
.rG{background:#FEE8F4;color:#8B2060;border:1px solid#F0A0C8}
.rG1{background:#FEF0F8;color:#7A1050;border:1px solid #E8B0D8}
.rH1{background:var(--bg4);color:var(--t2);border:1px solid var(--b1)}
.rH2{background:#E8F8EE;color:#1A6040;border:1px solid #80D0A0}

/* ── RIGHT PANEL ─────────────────────────────────────────────────────────── */
.rp{display:flex;flex-direction:column;gap:10px;overflow-y:auto;min-height:0}
.card{background:var(--bg2);border:1px solid var(--b1);border-radius:10px;padding:13px;flex-shrink:0;box-shadow:var(--shadow)}
.card-tt{font-size:14.5px;font-weight:700;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;font-family:Arial,Helvetica,sans-serif}
.card-sub{font-size:11px;padding:2px 6px;border-radius:4px;font-weight:700;background:#FDE8EA;color:var(--red)}
.card-lnk{font-size:12px;color:var(--gold2);cursor:pointer}
.alt-row{display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--b2);cursor:pointer}
.alt-row:last-child{border-bottom:none;padding-bottom:0}
.alt-ic{font-size:16px;flex-shrink:0;margin-top:1px}
.alt-t{font-size:13px;font-weight:700}.alt-b{font-size:11.5px;margin-top:1px;opacity:.8}
.alt-e .alt-t{color:var(--red)}.alt-e .alt-b{color:var(--red)}
.alt-w .alt-t{color:var(--orange)}.alt-w .alt-b{color:var(--orange)}
.alt-i .alt-t{color:var(--cyan)}.alt-i .alt-b{color:var(--cyan)}
.alt-ok .alt-t{color:var(--green)}.alt-ok .alt-b{color:var(--green)}
.pb-row{margin-bottom:8px}.pb-row:last-child{margin-bottom:0}
.pb-hd{display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px}
.pb-l{color:var(--t2)}.pb-v{font-family:'DM Mono',monospace;font-weight:600;color:var(--navy)}
.pb-bg{height:5px;background:var(--bg4);border-radius:3px;overflow:hidden}
.pb-fill{height:100%;border-radius:3px;transition:width .4s ease}
.cl-row{display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--b2)}
.cl-row:last-child{border-bottom:none;padding-bottom:0}
.cl-av{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;background:var(--navy);color:#fff}
.cl-nm{font-size:13px;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cl-cas{font-size:11px;color:var(--gold2);font-family:'DM Mono',monospace}

/* ── TABS ────────────────────────────────────────────────────────────────── */
.tabs{display:flex;gap:2px;background:var(--bg4);border:1px solid var(--b1);border-radius:8px;padding:3px;margin-bottom:14px;flex-wrap:nowrap;overflow-x:auto}
.tab{padding:6px 12px;border-radius:5px;cursor:pointer;font-size:13px;font-weight:600;color:var(--t2);transition:all .12s;white-space:nowrap;display:flex;align-items:center;gap:5px;flex-shrink:0}
.tab:hover{color:var(--t1)}.tab.on{background:var(--bg2);color:var(--navy);border:1px solid var(--b1);box-shadow:var(--shadow)}
.t-cnt{background:var(--navy);color:#fff;font-size:10px;font-weight:800;padding:1px 5px;border-radius:4px}

/* ── CLIENT TABLE ────────────────────────────────────────────────────────── */
.ct-wrap{overflow-x:auto}
.ct{width:100%;border-collapse:collapse;font-size:14.5px}
.ct th{text-align:left;font-size:12px;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,0.85);padding:9px 11px;border-bottom:2px solid var(--navy3);font-weight:700;background:var(--navy);white-space:nowrap}
.ct td{padding:11px 11px;color:var(--t1);border-bottom:1px solid var(--b2);font-size:14.5px}
.ct tr{transition:background .1s}.ct tr:hover td{background:#EEF3FF;cursor:pointer}.ct tr:last-child td{border-bottom:none}
.cn{color:var(--t1);font-weight:600;font-size:15px}
.cid{font-family:'DM Mono',monospace;font-size:13px;color:var(--gold2)}

/* ── ROLES ────────────────────────────────────────────────────────────────── */
.role-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.role-card{background:var(--bg2);border:1px solid var(--b1);border-radius:10px;padding:14px;box-shadow:var(--shadow)}
.rc-hd{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
.rc-icon{font-size:24px;flex-shrink:0}
.rc-desc{font-size:12px;color:var(--t2);line-height:1.55;margin-bottom:9px}
.rc-perms{display:flex;flex-wrap:wrap;gap:3px}
.perm{font-size:10.5px;padding:2px 5px;border-radius:3px;font-weight:600}
.perm.yes{background:#E8F8EE;color:var(--green);border:1px solid #80D0A0}
.perm.no{background:var(--bg4);color:var(--t3)}
.rc-subs{margin-top:8px;padding-top:8px;border-top:1px solid var(--b2)}
.rc-si{display:flex;align-items:center;gap:6px;padding:3px 0;font-size:12px;color:var(--t2)}

/* ── WR DETAIL ────────────────────────────────────────────────────────────── */
.wr-doc{background:var(--bg3);border:1px solid var(--b1);border-radius:12px;padding:20px}
.wr-doc-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;padding-bottom:8px;border-bottom:2px solid var(--navy)}
.wr-co{font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;color:var(--navy);letter-spacing:2px}
.wr-co-info{font-size:14px;color:var(--t2);line-height:1.6;margin-top:3px}
.wr-num-d{font-family:'DM Mono',monospace;font-size:24px;font-weight:800;color:var(--navy);letter-spacing:1px;text-align:right}
.wr-num-meta{font-size:14px;color:var(--t2);line-height:1.6;margin-top:3px;text-align:right}
.w2c{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.wb{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:12px}
.wb-t{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--navy);font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--b2)}
.wf{margin-bottom:6px}
.wfl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.wfv{font-size:14px;color:var(--t1);font-weight:500;margin-top:2px}
.wr-partes .wb-t{font-size:13px}.wr-partes .wfl{font-size:12px}.wr-partes .wfv{font-size:17px}
.wr-legal{font-size:11px;color:var(--t3);line-height:1.7;border-top:1px solid var(--b1);padding-top:10px;margin-top:10px}
.wr-sigs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px}
.wr-sig{border-top:2px solid var(--navy);padding-top:8px;font-size:11px;color:var(--t3);text-align:center}

/* ── FORMS ────────────────────────────────────────────────────────────────── */
.sdiv{font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--navy);padding:10px 0 6px;border-bottom:2px solid var(--navy);margin-bottom:12px}
.fg{display:flex;flex-direction:column;gap:4px}
.fl{font-size:11px;color:var(--t2);letter-spacing:.5px;font-weight:600;text-transform:uppercase}
.fi,.fs,.ft{background:var(--bg2);border:1px solid var(--b1);border-radius:7px;padding:8px 11px;color:var(--t1);font-size:14px;outline:none;width:100%;transition:border .12s,box-shadow .12s}
.fi:focus,.fs:focus,.ft:focus{border-color:var(--gold2);box-shadow:0 0 0 3px rgba(176,125,16,0.1)}
.fi::placeholder,.ft::placeholder{color:var(--t3)}
.fs option{background:var(--bg2)}
.ft{resize:vertical;min-height:66px}
.ro{background:var(--bg4)!important;color:var(--t3)!important;cursor:default!important}
.fgrid{display:grid;gap:10px}
.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr 1fr}
.g4{grid-template-columns:1fr 1fr 1fr 1fr}.full{grid-column:1/-1}
.fi-search{position:relative}
.fi-search input{padding-right:60px}
.fi-search-res{position:absolute;top:calc(100% + 3px);left:0;right:0;background:var(--bg2);border:1px solid var(--b1);border-radius:8px;box-shadow:var(--shadow2);z-index:50;max-height:180px;overflow-y:auto}
.fi-search-item{padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--b2);font-size:14px;color:var(--t1)}
.fi-search-item:hover{background:#EEF3FF}
.fi-search-item:last-child{border-bottom:none}
.fi-search-cas{font-size:12px;color:var(--gold2);font-family:'DM Mono',monospace;margin-left:8px}
.fi-search-new{padding:8px 12px;font-size:13px;color:var(--cyan);cursor:pointer;font-style:italic}

/* ── MODAL ────────────────────────────────────────────────────────────────── */
.ov{position:fixed;inset:0;background:rgba(26,43,74,0.5);z-index:500;display:flex;align-items:flex-start;justify-content:center;padding:14px;overflow-y:auto;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--b1);border-radius:14px;width:100%;padding:22px;animation:mfi .18s ease;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.msm{max-width:520px}.mmd{max-width:820px}.mlg{max-width:1060px}.mxl{max-width:1280px}
@keyframes mfi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mhd{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--b1)}
.mt{font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:700;flex:1;color:var(--navy)}
.mcl{width:28px;height:28px;border-radius:6px;background:var(--bg4);border:1px solid var(--b1);color:var(--t2);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.mcl:hover{background:var(--bg5);color:var(--t1)}
.mft{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;padding-top:14px;border-top:1px solid var(--b1)}

/* ── SCAN ─────────────────────────────────────────────────────────────────── */
.scan-row{display:flex;gap:8px}
.scan-btn{padding:7px 14px;border-radius:7px;background:var(--navy);border:none;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .12s;white-space:nowrap}
.scan-btn:hover{background:var(--navy2)}

/* ── ALERTS ───────────────────────────────────────────────────────────────── */
.alt{display:flex;gap:9px;padding:10px 12px;border-radius:8px;margin-bottom:7px;border:1px solid;cursor:pointer}
.alt:last-child{margin-bottom:0}
.alt.warn{background:#FEF3E8;border-color:#F0C080;color:var(--orange)}
.alt.err{background:#FEE8EA;border-color:#F0A0A8;color:var(--red)}
.alt.info{background:#E8F4FD;border-color:#90C8F0;color:var(--cyan)}
.alt.ok{background:#E8F8EE;border-color:#80D0A0;color:var(--green)}
.alt-t2{font-size:13px;font-weight:700}.alt-b2{font-size:12px;opacity:.8;margin-top:2px}
.alt-ic2{font-size:16px;flex-shrink:0;margin-top:1px}

/* ── WR NUMBER BUILDER ───────────────────────────────────────────────────── */
.wr-builder{background:var(--bg4);border:1px solid var(--b1);border-radius:10px;padding:14px;margin-bottom:16px}
.wr-preview{font-family:'DM Mono',monospace;font-size:24px;font-weight:700;letter-spacing:4px;text-align:center;padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:10px;border:2px solid var(--navy);color:var(--navy)}
.seg{display:inline-block;padding:2px 6px;border-radius:4px;margin:0 2px}
.sc{background:#E8F4FD;color:var(--cyan)}
.sk{background:#E8F8EE;color:var(--green)}
.sn{background:#FEF9E7;color:var(--gold2)}
.seg-leg{display:flex;gap:14px;justify-content:center;font-size:11px;color:var(--t3);margin-bottom:12px}

/* ── ETIQUETA TÉRMICA 4×6 pulgadas ────────────────────────────────────────── */
.label-wrap{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;padding:8px}
.label{
  width:384px;min-height:576px;
  border:2px solid #000;border-radius:4px;
  font-family:'DM Sans',sans-serif;background:#fff;color:#000;
  overflow:hidden;page-break-inside:avoid;display:flex;flex-direction:column;
}
.label-head{border-bottom:2px solid #000;text-align:center;padding:6px 10px}
.label-co{font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;letter-spacing:3px;color:#000}
.label-sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444;margin-top:1px}
.label-wr{border-bottom:1px solid #000;padding:6px 10px;display:flex;align-items:center;justify-content:space-between}
.label-wr-num{font-family:'DM Mono',monospace;font-size:14px;font-weight:800;color:#000;letter-spacing:.5px}
.label-wr-dt{font-size:11px;color:#333;text-align:right}
.label-caja{border-bottom:2px solid #000;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;padding:4px;letter-spacing:2px;color:#000}
.label-body{padding:8px 10px;flex:1}
.label-row{display:flex;gap:6px;margin-bottom:5px;align-items:flex-start}
.label-lbl{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.8px;font-weight:700;min-width:70px;margin-top:1px;flex-shrink:0}
.label-val{font-size:13px;color:#000;font-weight:600;line-height:1.3}
.label-divider{border:none;border-top:1px dashed #888;margin:6px 0}
.label-dims{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px}
.label-dim{border:1px solid #000;border-radius:3px;padding:4px 5px;text-align:center}
.label-dim-v{font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:#000}
.label-dim-l{font-size:9.5px;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-top:1px}
.label-barcode{padding:8px 10px;text-align:center;border-top:1px dashed #888;margin-top:auto}
.label-bc-bars{display:flex;align-items:flex-end;justify-content:center;gap:1px;height:44px;margin-bottom:4px}
.label-bc-code{font-family:'DM Mono',monospace;font-size:11px;color:#000;letter-spacing:1px;font-weight:600}
.label-tipo{display:inline-flex;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;border:1px solid #000;color:#000}
@media print{
  .label-overlay-bg,.label-print-btn,.mcl,.btn-s,.btn-p{display:none!important}
  .label{border:1px solid #000;page-break-inside:avoid;break-inside:avoid}
  .label-wrap{gap:0;padding:0}
  body{background:white;margin:0}
  @page{size:4in 6in;margin:0.1in}
}

.wr-print-only{display:none}
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  html,body{overflow:visible!important;height:auto!important;background:#fff!important;margin:0!important;padding:0!important}
  .app{display:block!important;overflow:visible!important;height:auto!important}
  .sb,.main,.mhd,.mft,.wr-doc,.btn-s,.btn-p,.btn-g,.mcl,.topbar,.wr-toolbar,.pag,.rp,.no-print{display:none!important}
  .ov{position:static!important;background:none!important;backdrop-filter:none!important;padding:0!important;overflow:visible!important;display:block!important}
  .wr-print-only{display:block!important}
  .modal{box-shadow:none!important;border:none!important;border-radius:0!important;max-height:none!important;overflow:visible!important;padding:0!important;margin:0!important;width:100%!important;max-width:100%!important;position:static!important}
  @page{size:letter portrait;margin:0.4in 0.5in}
}

/* ── RESPONSIVE ───────────────────────────────────────────────────────────── */
@media(max-width:1280px){.stats{grid-template-columns:repeat(8,1fr);gap:5px}}
/* Master de guías: 5 tarjetas */
.stats.stats-5{grid-template-columns:repeat(5,1fr)}
@media(max-width:900px){.stats.stats-5{grid-template-columns:repeat(3,1fr)}}
@media(max-width:540px){.stats.stats-5{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .sb{display:none}
  .stats{grid-template-columns:repeat(4,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .rp{display:none}
  .role-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:540px){
  .stats{grid-template-columns:repeat(2,1fr)}
}
`;

// ─── PERMISSION DEFINITIONS ──────────────────────────────────────────────────
const ALL_PERMS=[
  // Usuarios & Clientes
  "ver_usuarios","crear_usuario","editar_usuario","borrar_usuario",
  "crear_cliente","editar_cliente","borrar_cliente",
  // Agentes & Autónomos & Oficinas
  "ver_agente","crear_agente","editar_agente","borrar_agente",
  "ver_autonomo","crear_autonomo","editar_autonomo","borrar_autonomo",
  "ver_oficina","crear_oficina","editar_oficina","borrar_oficina",
  // Recepción en Puerta
  "ver_rp","hacer_rp","editar_rp","borrar_rp",
  // WR
  "ver_wr","crear_wr","editar_wr","borrar_wr",
  // Booking
  "ver_booking","crear_booking","editar_booking","borrar_booking",
  // Reempaque
  "ver_reempaque","crear_reempaque","editar_reempaque","borrar_reempaque","solicitar_reempaque",
  // Guía / Consolidación
  "ver_guia","crear_guia","editar_guia","borrar_guia",
  // Confirmación
  "ver_confirmacion","confirmar","desconfirmar",
  // Egreso / Cargo Release
  "ver_egreso","hacer_egreso","editar_egreso","borrar_egreso",
  // Recepción Destino
  "ver_recepcion_dest","hacer_recepcion_dest","editar_recepcion_dest","borrar_recepcion_dest",
  // Entrega
  "ver_entrega","entregar","revertir_entrega","editar_entrega","borrar_entrega",
  // Reportes
  "ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","rep_maestro",
  // Impresión
  "imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque",
  "imp_lista_conf","imp_guia_op","imp_postal","imp_packing","imp_recibo_entrega","imp_factura",
  // Estado de Cuenta
  "ver_estado_cuenta","ver_estado_cliente","ver_estado_agente","ver_estado_oficina",
  // Tracking & Pre-alerta
  "ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura",
  // Status
  "status_origen","status_destino",
  // Override de estado (escape hatch para Admin/Gerencia — corrige errores sin pasar por módulos)
  "override_estado",
  // Chat
  "chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones","chat_agente","chat_cliente",
  // Pick-up
  "ver_pickup","solicitar_pickup",
  // Servicios & Adicionales
  "ver_servicios","crear_servicio","editar_servicio","borrar_servicio","sel_servicio",
  "ver_adicionales","crear_adicional","editar_adicional","borrar_adicional","sel_adicional",
  // Calculadora & Tarifas
  "calculadora","ver_tarifas","crear_tarifa","editar_tarifa","borrar_tarifa",
  // Contabilidad — granulares (Lote 6)
  "facturar","ver_factura","registrar_cobro","ver_cuentas_cobrar",
  "crear_factura","editar_factura","anular_factura","borrar_factura",
  "registrar_pago","cobrar","anular_pago","nota_credito",
  // Admin
  "configuracion","gestionar_roles","registro_actividad","envio_masivo",
  "ver_bd_clientes","ver_bd_usuarios","paquetes_sin_reclamo",
  "ver_fotos","subir_foto","borrar_foto","todas_sucursales",
  // Completan Ver / Crear / Editar / Borrar en todos los módulos
  "editar_confirmacion","ver_alertas","crear_alerta","editar_alerta","borrar_alerta",
  "editar_pago","editar_pickup","borrar_pickup","editar_foto",
  "editar_prealerta","borrar_prealerta",
  "ver_documentos","crear_documento","editar_documento","borrar_documento",
  "crear_reporte","editar_reporte","borrar_reporte",
  // Permiso especial: salta los bloqueos del proceso por estado
  "saltar_bloqueos",
];

const PERM_LBL={
  ver_usuarios:"Ver Usuarios",crear_usuario:"Crear Usuario",editar_usuario:"Editar Usuario",borrar_usuario:"Borrar Usuario",
  crear_cliente:"Crear Cliente",editar_cliente:"Editar Cliente",borrar_cliente:"Borrar Cliente",
  ver_agente:"Ver Agente",crear_agente:"Crear Agente",editar_agente:"Editar Agente",borrar_agente:"Borrar Agente",
  ver_autonomo:"Ver Autónomo",crear_autonomo:"Crear Autónomo",editar_autonomo:"Editar Autónomo",borrar_autonomo:"Borrar Autónomo",
  ver_oficina:"Ver Oficina",crear_oficina:"Crear Oficina",editar_oficina:"Editar Oficina",borrar_oficina:"Borrar Oficina",
  ver_rp:"Ver Recepción Puerta",hacer_rp:"Hacer RP",editar_rp:"Editar RP",borrar_rp:"Borrar RP",
  ver_wr:"Ver WR",crear_wr:"Crear WR",editar_wr:"Editar WR",borrar_wr:"Borrar WR",
  ver_booking:"Ver Booking",crear_booking:"Crear Booking",editar_booking:"Editar Booking",borrar_booking:"Borrar Booking",
  ver_reempaque:"Ver Reempaque",crear_reempaque:"Crear Reempaque",editar_reempaque:"Editar Reempaque",borrar_reempaque:"Borrar Reempaque",solicitar_reempaque:"Solicitar Reempaque",
  ver_guia:"Ver Guía",crear_guia:"Crear Guía",editar_guia:"Editar Guía",borrar_guia:"Borrar Guía",
  ver_confirmacion:"Ver Confirmación",confirmar:"Confirmar",desconfirmar:"Desconfirmar",
  ver_egreso:"Ver Egreso",hacer_egreso:"Hacer Egreso",editar_egreso:"Editar Egreso",borrar_egreso:"Borrar Egreso",
  ver_recepcion_dest:"Ver Recep. Destino",hacer_recepcion_dest:"Hacer Recep. Destino",editar_recepcion_dest:"Editar Recep.",borrar_recepcion_dest:"Borrar Recep.",
  ver_entrega:"Ver Entrega",entregar:"Entregar",revertir_entrega:"Revertir Entrega",editar_entrega:"Editar Entrega",borrar_entrega:"Borrar Entrega",
  ver_reportes:"Ver Reportes",rep_confirmados:"Rep. Confirmados",rep_guia_op:"Rep. Guía Operacional",rep_postal:"Rep. Postal",rep_packing:"Packing List",rep_maestro:"Rep. Maestro",
  imp_wr:"Impr. WR",imp_guia:"Impr. Guía",imp_etiq_caja:"Impr. Etiq. Caja",imp_etiq_guia:"Impr. Etiq. Guía",imp_rp:"Impr. RP",imp_booking:"Impr. Booking",imp_reempaque:"Impr. Reempaque",
  imp_lista_conf:"Impr. Lista Conf.",imp_guia_op:"Impr. Guía Op.",imp_postal:"Impr. Postal",imp_packing:"Impr. Packing",imp_recibo_entrega:"Impr. Recibo Entrega",imp_factura:"Impr. Factura",
  ver_estado_cuenta:"Ver Estado Cuenta",ver_estado_cliente:"EC Cliente",ver_estado_agente:"EC Agente",ver_estado_oficina:"EC Oficina",
  ver_tracking:"Ver Tracking",rastrear:"Rastrear",ver_prealerta:"Ver Pre-alerta",pre_tracking:"Pre-alerta Tracking",pre_factura:"Pre-alerta Factura",
  status_origen:"Status Origen",status_destino:"Status Destino",
  override_estado:"Forzar Estado WR (override)",
  chat_admin:"Chat Admin",chat_gerencia:"Chat Gerencia",chat_auxiliar:"Chat Auxiliar",chat_operaciones:"Chat Operaciones",chat_agente:"Chat Agente",chat_cliente:"Chat Cliente",
  ver_pickup:"Ver Pick-up",solicitar_pickup:"Solicitar Pick-up",
  ver_servicios:"Ver Servicios",crear_servicio:"Crear Servicio",editar_servicio:"Editar Servicio",borrar_servicio:"Borrar Servicio",sel_servicio:"Seleccionar Servicio",
  ver_adicionales:"Ver Adicionales",crear_adicional:"Crear Adicional",editar_adicional:"Editar Adicional",borrar_adicional:"Borrar Adicional",sel_adicional:"Seleccionar Adicional",
  calculadora:"Calculadora Envío",ver_tarifas:"Ver Tarifas",crear_tarifa:"Crear Tarifa",editar_tarifa:"Editar Tarifa",borrar_tarifa:"Borrar Tarifa",
  facturar:"Facturar",ver_factura:"Ver Factura",registrar_cobro:"Registrar Cobro",ver_cuentas_cobrar:"Cuentas x Cobrar",
  crear_factura:"Crear Factura",editar_factura:"Editar Factura",anular_factura:"Anular Factura",borrar_factura:"Borrar Factura",
  registrar_pago:"Registrar Pago",cobrar:"Cobrar",anular_pago:"Anular Pago",nota_credito:"Nota de Crédito",
  configuracion:"Configuración Sistema",gestionar_roles:"Gestionar Roles",registro_actividad:"Registro Actividad",envio_masivo:"Envío Masivo Email",
  ver_bd_clientes:"Ver BD Clientes",ver_bd_usuarios:"Ver BD Usuarios",paquetes_sin_reclamo:"Paquetes Sin Reclamo",
  ver_fotos:"Ver Fotos",subir_foto:"Subir Foto",borrar_foto:"Borrar Foto",todas_sucursales:"Todas las Sucursales",
  editar_confirmacion:"Editar Confirmación",ver_alertas:"Ver Alertas",crear_alerta:"Crear Alerta",editar_alerta:"Editar Alerta",borrar_alerta:"Borrar Alerta",
  editar_pago:"Editar Pago",editar_pickup:"Editar Pick-up",borrar_pickup:"Borrar Pick-up",editar_foto:"Editar Foto",
  editar_prealerta:"Editar Pre-alerta",borrar_prealerta:"Borrar Pre-alerta",
  ver_documentos:"Ver Documentos",crear_documento:"Crear Documento",editar_documento:"Editar Documento",borrar_documento:"Borrar Documento",
  crear_reporte:"Crear Reporte",editar_reporte:"Editar Reporte",borrar_reporte:"Borrar Reporte",
  saltar_bloqueos:"Saltar bloqueos de estado",
};

// Tabla de Roles & Permisos: cada módulo con sus 4 acciones
const PERM_MODULES=[
  {m:"Usuarios",ic:"👤",ver:"ver_usuarios",crear:"crear_usuario",editar:"editar_usuario",borrar:"borrar_usuario"},
  {m:"Clientes",ic:"👥",ver:"ver_bd_clientes",crear:"crear_cliente",editar:"editar_cliente",borrar:"borrar_cliente"},
  {m:"Agentes",ic:"🤝",ver:"ver_agente",crear:"crear_agente",editar:"editar_agente",borrar:"borrar_agente"},
  {m:"Autónomos",ic:"🧑‍💻",ver:"ver_autonomo",crear:"crear_autonomo",editar:"editar_autonomo",borrar:"borrar_autonomo"},
  {m:"Oficinas",ic:"🏢",ver:"ver_oficina",crear:"crear_oficina",editar:"editar_oficina",borrar:"borrar_oficina"},
  {m:"Recepción en Puerta",ic:"📡",ver:"ver_rp",crear:"hacer_rp",editar:"editar_rp",borrar:"borrar_rp"},
  {m:"WR (Warehouse Receipt)",ic:"📦",ver:"ver_wr",crear:"crear_wr",editar:"editar_wr",borrar:"borrar_wr"},
  {m:"Booking",ic:"📑",ver:"ver_booking",crear:"crear_booking",editar:"editar_booking",borrar:"borrar_booking"},
  {m:"Reempaque",ic:"🔁",ver:"ver_reempaque",crear:"crear_reempaque",editar:"editar_reempaque",borrar:"borrar_reempaque"},
  {m:"Guías / Consolidación",ic:"🚢",ver:"ver_guia",crear:"crear_guia",editar:"editar_guia",borrar:"borrar_guia"},
  {m:"Confirmación",ic:"✅",ver:"ver_confirmacion",crear:"confirmar",editar:"editar_confirmacion",borrar:"desconfirmar"},
  {m:"Cargo Release (Egreso)",ic:"🚀",ver:"ver_egreso",crear:"hacer_egreso",editar:"editar_egreso",borrar:"borrar_egreso"},
  {m:"Recepción en Almacén",ic:"📥",ver:"ver_recepcion_dest",crear:"hacer_recepcion_dest",editar:"editar_recepcion_dest",borrar:"borrar_recepcion_dest"},
  {m:"Entregas",ic:"📝",ver:"ver_entrega",crear:"entregar",editar:"editar_entrega",borrar:"borrar_entrega"},
  {m:"Alertas",ic:"🔔",ver:"ver_alertas",crear:"crear_alerta",editar:"editar_alerta",borrar:"borrar_alerta"},
  {m:"Facturas",ic:"🧾",ver:"ver_factura",crear:"crear_factura",editar:"editar_factura",borrar:"borrar_factura"},
  {m:"Pagos y Cobros",ic:"💰",ver:"ver_cuentas_cobrar",crear:"registrar_pago",editar:"editar_pago",borrar:"anular_pago"},
  {m:"Tarifas",ic:"💲",ver:"ver_tarifas",crear:"crear_tarifa",editar:"editar_tarifa",borrar:"borrar_tarifa"},
  {m:"Servicios",ic:"🛠️",ver:"ver_servicios",crear:"crear_servicio",editar:"editar_servicio",borrar:"borrar_servicio"},
  {m:"Adicionales",ic:"➕",ver:"ver_adicionales",crear:"crear_adicional",editar:"editar_adicional",borrar:"borrar_adicional"},
  {m:"Pick-up",ic:"🚐",ver:"ver_pickup",crear:"solicitar_pickup",editar:"editar_pickup",borrar:"borrar_pickup"},
  {m:"Pre-alertas",ic:"📨",ver:"ver_prealerta",crear:"pre_tracking",editar:"editar_prealerta",borrar:"borrar_prealerta"},
  {m:"Fotos",ic:"📷",ver:"ver_fotos",crear:"subir_foto",editar:"editar_foto",borrar:"borrar_foto"},
  {m:"Documentos",ic:"📋",ver:"ver_documentos",crear:"crear_documento",editar:"editar_documento",borrar:"borrar_documento"},
  {m:"Reportes",ic:"📈",ver:"ver_reportes",crear:"crear_reporte",editar:"editar_reporte",borrar:"borrar_reporte"},
];
const PERM_ACTIONS=[{k:"ver",l:"Ver"},{k:"crear",l:"Crear"},{k:"editar",l:"Editar"},{k:"borrar",l:"Borrar"}];
const PERMS_EN_TABLA=new Set(PERM_MODULES.flatMap(m=>PERM_ACTIONS.map(a=>m[a.k])));

// Permisos por grupo para mostrar en UI
const PERM_GROUPS=[
  {label:"Usuarios & Clientes",perms:["ver_usuarios","crear_usuario","editar_usuario","borrar_usuario","crear_cliente","editar_cliente","borrar_cliente"]},
  {label:"Agentes / Autónomos / Oficinas",perms:["ver_agente","crear_agente","editar_agente","borrar_agente","ver_autonomo","crear_autonomo","editar_autonomo","borrar_autonomo","ver_oficina","crear_oficina","editar_oficina","borrar_oficina"]},
  {label:"Operaciones Origen",perms:["ver_rp","hacer_rp","editar_rp","ver_wr","crear_wr","editar_wr","borrar_wr","ver_booking","crear_booking","editar_booking","solicitar_reempaque","ver_reempaque","crear_reempaque","editar_reempaque","ver_guia","crear_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","status_origen"]},
  {label:"Operaciones Destino",perms:["ver_recepcion_dest","hacer_recepcion_dest","editar_recepcion_dest","ver_entrega","entregar","revertir_entrega","editar_entrega","status_destino"]},
  {label:"Reportes",perms:["ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","rep_maestro"]},
  {label:"Impresión",perms:["imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","imp_recibo_entrega","imp_factura"]},
  {label:"Estado de Cuenta & Tracking",perms:["ver_estado_cuenta","ver_estado_cliente","ver_estado_agente","ver_estado_oficina","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura"]},
  {label:"Servicios & Tarifas",perms:["ver_servicios","crear_servicio","editar_servicio","borrar_servicio","sel_servicio","ver_adicionales","crear_adicional","editar_adicional","borrar_adicional","sel_adicional","calculadora","ver_tarifas","crear_tarifa","editar_tarifa","borrar_tarifa"]},
  {label:"Chat & Pick-up",perms:["chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones","chat_agente","chat_cliente","ver_pickup","solicitar_pickup"]},
  {label:"Contabilidad",perms:["facturar","ver_factura","registrar_cobro","ver_cuentas_cobrar","imp_factura","crear_factura","editar_factura","anular_factura","borrar_factura","registrar_pago","cobrar","anular_pago","nota_credito"]},
  {label:"Administración",perms:["configuracion","gestionar_roles","registro_actividad","envio_masivo","ver_bd_clientes","ver_bd_usuarios","paquetes_sin_reclamo","ver_fotos","subir_foto","borrar_foto","todas_sucursales","override_estado","saltar_bloqueos"]},
];

// ─── ROLE DEFINITIONS ────────────────────────────────────────────────────────
const ROLE_DEFS={
  A:{code:"A",name:"Administrador",color:"rA",icon:"👑",
    desc:"Control total del sistema. Acceso a todo sin restricciones.",
    perms:ALL_PERMS},

  B:{code:"B",name:"Gerente",color:"rB",icon:"🏛️",
    desc:"Gestión general. Todo menos borrar registros y registro de actividad.",
    perms:ALL_PERMS.filter(p=>!["borrar_usuario","borrar_cliente","borrar_agente","borrar_autonomo","borrar_oficina","borrar_wr","borrar_rp","borrar_booking","borrar_reempaque","borrar_guia","borrar_egreso","borrar_recepcion_dest","borrar_entrega","borrar_alerta","borrar_pickup","borrar_prealerta","borrar_documento","borrar_reporte","registro_actividad","configuracion","gestionar_roles","saltar_bloqueos"].includes(p))},

  C:{code:"C",name:"Auxiliar",color:"rC",icon:"🗂️",
    desc:"Apoyo operativo. Crear y editar WR, reportes, confirmaciones.",
    perms:["ver_usuarios","crear_cliente","editar_cliente","crear_wr","editar_wr","ver_wr","ver_rp","hacer_rp","editar_rp","ver_reempaque","ver_booking","ver_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","imp_recibo_entrega","imp_factura","ver_estado_cuenta","ver_estado_cliente","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","status_origen","status_destino","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_tarifas","ver_factura","ver_bd_clientes","paquetes_sin_reclamo","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

  D:{code:"D",name:"Jefe de Operaciones",color:"rD",icon:"⚙️",
    desc:"Supervisa y ejecuta operaciones completas — origen + destino.",
    subs:["D1","D2"],
    perms:["ver_wr","crear_wr","editar_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","solicitar_reempaque","ver_reempaque","crear_reempaque","editar_reempaque","ver_guia","crear_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","ver_recepcion_dest","hacer_recepcion_dest","editar_recepcion_dest","ver_entrega","entregar","revertir_entrega","editar_entrega","status_origen","status_destino","ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","imp_recibo_entrega","ver_estado_cuenta","ver_estado_cliente","ver_tracking","rastrear","ver_prealerta","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_tarifas","ver_bd_clientes","ver_fotos","subir_foto","borrar_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones","todas_sucursales"]},

  D1:{code:"D1",name:"Operaciones Origen",color:"rD1",icon:"📤",
    desc:"Ejecuta operaciones de origen: RP, WR, guías, consolidación, egreso. Estados 1→7.",
    perms:["ver_wr","crear_wr","editar_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","solicitar_reempaque","ver_reempaque","crear_reempaque","editar_reempaque","ver_guia","crear_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","status_origen","ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","ver_tracking","rastrear","ver_prealerta","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","ver_bd_clientes","ver_fotos","subir_foto","borrar_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

  D2:{code:"D2",name:"Operaciones Destino",color:"rD2",icon:"📥",
    desc:"Ejecuta operaciones de destino: recepción, entrega. Estados 8→12P.",
    perms:["ver_wr","ver_rp","ver_guia","ver_recepcion_dest","hacer_recepcion_dest","editar_recepcion_dest","ver_entrega","entregar","revertir_entrega","editar_entrega","status_destino","ver_reportes","rep_confirmados","rep_guia_op","imp_wr","imp_guia","imp_etiq_caja","imp_lista_conf","imp_guia_op","imp_recibo_entrega","ver_tracking","rastrear","ver_estado_cliente","ver_bd_clientes","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

  E:{code:"E",name:"Agente",color:"rE",icon:"🤝",
    desc:"Agente externo. Gestiona sus clientes y WR propios.",
    subs:["E1"],
    perms:["crear_cliente","editar_cliente","crear_wr","editar_wr","ver_wr","ver_booking","ver_confirmacion","imp_wr","imp_factura","ver_estado_cuenta","ver_estado_agente","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_factura","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_agente"]},

  E1:{code:"E1",name:"Vendedor / Agente",color:"rE1",icon:"💼",
    desc:"Vendedor bajo un agente. Solo sus clientes.",
    perms:["crear_cliente","editar_cliente","crear_wr","ver_wr","ver_booking","imp_wr","imp_factura","ver_estado_cuenta","ver_estado_agente","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_factura","ver_fotos","subir_foto","chat_agente"]},

  F:{code:"F",name:"Autónomo",color:"rF",icon:"🧑‍💻",
    desc:"Operador independiente. Gestiona sus propios clientes.",
    perms:["crear_cliente","editar_cliente","crear_wr","editar_wr","ver_wr","ver_confirmacion","imp_wr","imp_factura","ver_estado_cuenta","ver_estado_cliente","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_factura","ver_fotos","subir_foto","chat_admin","chat_gerencia"]},

  G:{code:"G",name:"Oficina",color:"rG",icon:"🏢",
    desc:"Sucursal de la empresa. Ve la carga que recibe o que se envió por ella.",
    perms:["crear_cliente","editar_cliente","crear_wr","editar_wr","ver_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","ver_reempaque","ver_guia","crear_guia","ver_confirmacion","ver_entrega","entregar","ver_reportes","rep_confirmados","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_lista_conf","imp_recibo_entrega","imp_factura","ver_estado_cuenta","ver_estado_oficina","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_tarifas","ver_factura","registrar_cobro","ver_cuentas_cobrar","ver_bd_clientes","paquetes_sin_reclamo","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

  H:{code:"H",name:"Usuario Sistema",color:"rH1",icon:"👤",
    desc:"Usuario interno al que se le asigna un rol específico (A-G).",
    perms:["ver_wr","ver_tracking","rastrear","ver_estado_cuenta","ver_servicios","calculadora"]},

  I:{code:"I",name:"Cliente",color:"rH2",icon:"📦",
    desc:"Cliente externo. Solo ve sus propios envíos, estado de cuenta, tracking y factura.",
    perms:["ver_wr","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_estado_cuenta","ver_estado_cliente","ver_factura","imp_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_fotos","subir_foto","chat_agente"]},
};
// Los menús nuevos (Alertas, Documentos) se mantienen visibles para quien ya los usaba
["C","D","D1","D2"].forEach(r=>ROLE_DEFS[r].perms.push("ver_alertas","ver_documentos"));
ROLE_DEFS.G.perms.push("ver_documentos","crear_factura"); // la oficina de origen factura los PREPAID
// Quien ya podía crear/editar clientes sigue viendo el menú Clientes
["E","E1","F"].forEach(r=>ROLE_DEFS[r].perms.push("ver_bd_clientes"));
const ALL_ROLES=Object.values(ROLE_DEFS);
// Permisos por defecto de cada rol (los del código). Lo guardado en Configuración los reemplaza.
const DEFAULT_ROLE_PERMS=Object.fromEntries(ALL_ROLES.map(r=>[r.code,[...r.perms]]));
const RoleBadge=({code})=>{const r=ROLE_DEFS[code];if(!r)return null;return <span className={`rb ${r.color}`}>{r.icon} {r.code}·{r.name}</span>;};
const RoleChip=({code})=>{const r=ROLE_DEFS[code];if(!r)return null;return <span className={`rb ${r.color}`}>{r.code}</span>;};

const TYPE_CLS={"Aéreo Express":"t-ae","Aéreo Económico":"t-ae2","Marítimo FCL":"t-mf","Marítimo LCL":"t-ml","Terrestre":"t-tr"};
const CAR_CLS={"UPS":"car-ups","FedEx":"car-fedex","DHL":"car-dhl","USPS":"car-usps"};
const SEARCH_PARAMS=["N° WR","Consignatario","Casillero","Tracking","Factura","Carrier","Descripción","Estado"];

// Oficina actual del usuario (en producción vendría del login)
const OFFICE_CONFIG = {
  origCountry:"01", origCity:"MI",  // Miami, USA — oficina origen
  destCountry:"58", destCity:"VL",  // Valencia, Venezuela — oficina destino por defecto
  branch:"Casa Matriz",
};

// ─── NUMBERING BUILDERS ───────────────────────────────────────────────────────
// offCode: convierte un registro de oficina a código → "01MIA", "01VLN", etc.
const offCode=(o)=>o?`${String(o.codigo).padStart(2,"0")}${(o.ciudad||"").slice(0,3).toUpperCase()}`:"00???";
// Prefijo de casillero — cambiar aquí para cada empresa
const CASILLERO_PREFIX=""; // solo número: 001, 002 …
const CASILLERO_DIGITS=3;

// Parsea un nombre completo en sus partes (hasta 4 bloques)
const parseNombreCompleto=(nombre="")=>{
  const w=nombre.trim().split(/\s+/).filter(Boolean);
  if(w.length===0)return{primerNombre:"",segundoNombre:"",primerApellido:"",segundoApellido:""};
  if(w.length===1)return{primerNombre:w[0],segundoNombre:"",primerApellido:"",segundoApellido:""};
  if(w.length===2)return{primerNombre:w[0],segundoNombre:"",primerApellido:w[1],segundoApellido:""};
  if(w.length===3)return{primerNombre:w[0],segundoNombre:w[1],primerApellido:w[2],segundoApellido:""};
  return{primerNombre:w[0],segundoNombre:w[1],primerApellido:w[2],segundoApellido:w.slice(3).join(" ")};
};

// WR:
//   Tipo 1 → 0000001
//   Tipo 2 → empresa + origOfficeCode + destOfficeCode + seq  (ej: 1N01MIA01VLN0000001)
//   Tipo 3 → origCountry+origCity2 + destCountry+destCity2 + seq (ej: 01MI58VL0000001)
const buildWRNum=(origCode,destCode,seq,tipo=1,secInicio=1,empresa="1N")=>{
  const s=String(seq+(secInicio-1)).padStart(7,"0");
  switch(tipo){
    case 1: return s;
    case 2: return `${empresa}${origCode}${destCode}${s}`;
    case 3: default: return `${origCode}${destCode}${s}`;
  }
};
// CSA:
//   Tipo 1 → 0000001
//   Tipo 2 → origOfficeCode + destOfficeCode + seq  (ej: 01VLN01CCS0000001)
//   Tipo 3 → YYMMDD + destOfficeCode + seq + tipoEnvíoLetra  (ej: 26040801VLN0000001M)
const buildConsolNum=(origCode,destCode,seq,tipo=1,secInicio=1,tipoEnvio="Marítimo")=>{
  const s=String(seq+(secInicio-1)).padStart(7,"0");
  const te=(tipoEnvio||"").trim().charAt(0).toUpperCase()||"M";
  const now=new Date();
  const y=now.getFullYear().toString().slice(2);
  const m=String(now.getMonth()+1).padStart(2,"0");
  const d=String(now.getDate()).padStart(2,"0");
  switch(tipo){
    case 1: return s;
    case 2: return `${origCode}${destCode}${s}`;
    case 3: default: return `${y}${m}${d}${destCode}${s}${te}`;
  }
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
// phase    : origen | transito | destino | excep | entrega
// auto     : el sistema lo asigna automáticamente (no aparece como botón manual)
// manual   : el usuario puede fijarlo manualmente desde algún módulo
// channels : dónde aparece/puede ser editado el estado:
//              "dashboard"      → siempre visible para admin/operadores
//              "cliente"        → visible en tracking público / portal del cliente
//              "consolidacion"  → editable desde la barra de 7 fases de la guía
//              "recepcion"      → editable desde Recepción en Almacén
// exc:true → estado de excepción (faltante / investigación / sobrante)
const WR_STATUSES=[
  {code:"1",   label:"Recibido",        cls:"s1", phase:"origen",   auto:true,  manual:false, channels:["dashboard"]},
  {code:"2",   label:"Origen",          cls:"s2", phase:"origen",   auto:true,  manual:false, channels:["dashboard","cliente"]},
  {code:"2.3", label:"Reempacado",      cls:"s6", phase:"origen",   auto:true,  manual:false, channels:["dashboard"]},
  {code:"3",   label:"Confirmado",      cls:"s3", phase:"origen",   auto:true,  manual:false, channels:["dashboard"]},
  {code:"4",   label:"Consolidado",     cls:"s3", phase:"origen",   auto:true,  manual:false, channels:["dashboard"]},
  {code:"5",   label:"Entregado Línea", cls:"s2", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"6",   label:"Aduana Salida",   cls:"s5", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"7",   label:"Auditoria",       cls:"s4", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"8",   label:"Liberado",        cls:"s3", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"9",   label:"Tránsito",        cls:"s2", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"10",  label:"Aduana Tránsito", cls:"s5", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"11",  label:"Auditoria",       cls:"s4", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"12",  label:"Liberado",        cls:"s3", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"13",  label:"Tránsito Final",  cls:"s2", phase:"transito", auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"14",  label:"Aduana Destino",  cls:"s5", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","recepcion"]},
  {code:"15",  label:"Auditoría 3",     cls:"s4", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","recepcion"]},
  {code:"16",  label:"Liberado 3",      cls:"s3", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","recepcion"]},
  {code:"17",  label:"Almacén",         cls:"s6", phase:"destino",  auto:true,  manual:false, channels:["dashboard","recepcion"]},
  {code:"18",  label:"Faltante",        cls:"s4", phase:"excep",    auto:true,  manual:false, channels:["dashboard"],             exc:true},
  // Cierres de un faltante (se resuelven en Alertas). No cuentan como excepción abierta.
  {code:"18.2",label:"Indemnizado",     cls:"s3", phase:"excep",    auto:false, manual:false, channels:["dashboard"]},
  {code:"18.3",label:"Pérdida cerrada", cls:"s4", phase:"excep",    auto:false, manual:false, channels:["dashboard"]},
  {code:"18.1",label:"Investigación",   cls:"s4", phase:"excep",    auto:false, manual:true,  channels:["dashboard","recepcion"], exc:true},
  {code:"19",  label:"Sobrante",        cls:"s5", phase:"excep",    auto:true,  manual:false, channels:["dashboard","recepcion"], exc:true},
  {code:"20",  label:"Por Entrega",     cls:"s3", phase:"entrega",  auto:true,  manual:false, channels:["dashboard","cliente"]},
  {code:"20.1",label:"Despachado a Sucursal", cls:"s2", phase:"entrega", auto:true, manual:false, channels:["dashboard","cliente"]},
  {code:"20.2",label:"En Sucursal",     cls:"s6", phase:"entrega",  auto:true,  manual:false, channels:["dashboard","cliente"]},
  {code:"21",  label:"Entregado",       cls:"s3", phase:"entrega",  auto:true,  manual:false, channels:["dashboard","recepcion"]},
  {code:"22",  label:"Por Cobrar",      cls:"s5", phase:"entrega",  auto:true,  manual:false, channels:["dashboard"]},
  {code:"23",  label:"Cobrado",         cls:"s3", phase:"entrega",  auto:true,  manual:false, channels:["dashboard"]},
  {code:"25",  label:"Egresado",        cls:"s3", phase:"entrega",  auto:true,  manual:false, channels:["dashboard","cliente"]},
];
// Helpers de consulta sobre WR_STATUSES — usar siempre estos en vez de inspeccionar
// flags sueltos, así un cambio de modelo solo requiere tocar el array.
const getStatus       =(code)=>WR_STATUSES.find(s=>s.code===String(code));
const isAutoStatus    =(code)=>!!getStatus(code)?.auto;
const isManualStatus  =(code)=>!!getStatus(code)?.manual;
const statusInChannel =(code,channel)=>(getStatus(code)?.channels||[]).includes(channel);
// Estados visibles en el tracking público del cliente
const CLIENT_STATUSES =WR_STATUSES.filter(s=>s.channels?.includes("cliente"));
// Estados editables manualmente desde la barra de 7 fases en Consolidación
const CONSOL_STATUSES =WR_STATUSES.filter(s=>s.manual&&s.channels?.includes("consolidacion"));
// Estados que Recepción en Almacén puede fijar/leer
const RECEP_STATUSES  =WR_STATUSES.filter(s=>s.channels?.includes("recepcion"));
// GUIDE_PHASES — 9 fases de progreso de la guía consolidada (5→13)
// Cada fase representa un estado individual editable desde el módulo Consolidación.
// Una vez se fija la última (Tránsito 2 / 13), la guía queda lista para Recepción en
// Almacén y NO puede retroceder a fases anteriores.
const GUIDE_PHASES=[
  {key:"linea",   label:"Entregado Línea",  short:"Línea",     codes:["5"],  advance:"5",  icon:"🛫"},
  {key:"adsal",   label:"Aduana Salida",    short:"Ad. Sal.",  codes:["6"],  advance:"6",  icon:"🛃"},
  {key:"aud1",    label:"Auditoría 1",      short:"Auditoria", codes:["7"],  advance:"7",  icon:"🔍"},
  {key:"lib1",    label:"Liberado 1",       short:"Liberado 1",codes:["8"],  advance:"8",  icon:"✅"},
  {key:"trans1",  label:"Tránsito 1",       short:"Tránsito 1",codes:["9"],  advance:"9",  icon:"✈️"},
  {key:"adtrans", label:"Aduana Tránsito",  short:"Ad. Trans.",codes:["10"], advance:"10", icon:"🛂"},
  {key:"aud2",    label:"Auditoría 2",      short:"Auditoría 2",codes:["11"],advance:"11", icon:"🔍"},
  {key:"lib2",    label:"Liberado 2",       short:"Liberado 2",codes:["12"], advance:"12", icon:"✅"},
  {key:"trans2",  label:"Tránsito 2",       short:"Tránsito 2",codes:["13"], advance:"13", icon:"🚛"},
];
// Fases manejables desde Recepción en Almacén (NO desde Consolidación)
const RECEP_PHASES=[
  {key:"addest",  label:"Aduana Destino",   short:"Ad. Dest.", codes:["14"], advance:"14", icon:"🛂"},
  {key:"aud3",    label:"Auditoría 3",      short:"Auditoría 3",codes:["15"],advance:"15", icon:"🔍"},
  {key:"lib3",    label:"Liberado 3",       short:"Liberado 3",codes:["16"], advance:"16", icon:"✅"},
];
const currentGuidePhaseIdx=(code)=>{
  const idx=GUIDE_PHASES.findIndex(p=>p.codes.includes(String(code)));
  if(idx>=0) return idx;
  // Si el código es 4 o menor (Consolidado/preconsolidado) la guía aún no alcanza la primera fase
  const n=parseFloat(code);
  if(!isNaN(n)&&n<=4) return -1;
  // Si el código es 14+ la guía ya pasó todas las fases de tránsito (en destino/almacén)
  if(!isNaN(n)&&n>=14) return GUIDE_PHASES.length-1;
  return 0;
};
// Helper: ¿es Tránsito 2 (estado terminal de Consolidación)?
const isGuideFinalConsolPhase=(code)=>String(code)==="13";
// Índice de la fase actual dentro de RECEP_PHASES (Ad. Dest./Auditoría 3/Liberado 3)
const currentRecepPhaseIdx=(code)=>{
  const idx=RECEP_PHASES.findIndex(p=>p.codes.includes(String(code)));
  if(idx>=0) return idx;
  const n=parseFloat(code);
  // Si la guía está en Tránsito 2 (13) o antes, aún no entró a Recepción
  if(!isNaN(n)&&n<=13) return -1;
  // Si pasó del bloque Recepción (≥17 = Almacén / Por Entrega / etc.) marca todas como completadas
  if(!isNaN(n)&&n>=17) return RECEP_PHASES.length-1;
  return 0;
};
// Sesión guardada en el navegador para que recargar la página (Ctrl+F5) no
// saque al usuario. Solo se guarda el id del usuario y la hora de vencimiento.
const SESS_KEY="enex_sess";
const SESS_HORAS=12;
const sessRead=()=>{try{const o=JSON.parse(localStorage.getItem(SESS_KEY)||"null");return o&&o.id&&o.exp>Date.now()?o:null;}catch{return null;}};
const sessSave=(id)=>{try{localStorage.setItem(SESS_KEY,JSON.stringify({id,exp:Date.now()+SESS_HORAS*3600*1000}));}catch{}};
const sessClear=()=>{try{localStorage.removeItem(SESS_KEY);}catch{}};
const SEND_TYPES_INIT=["Aéreo Express","Aéreo Económico","Marítimo FCL","Marítimo LCL","Terrestre"];
const PAY_TYPES_INIT=["Prepago","Crédito","Contra Entrega","Corporativo","Gobierno"];
const CURR_SYM={USD:"$",EUR:"€",VES:"Bs.",COP:"$",MXN:"$",ARS:"$",CLP:"$",PEN:"S/",BRL:"R$",DOP:"RD$",PAB:"B/."};
const cSym=(c)=>CURR_SYM[c]||"$";
const PKG_TYPES=["Caja Cartón","Caja Madera","Paleta","Sobre","Tambor","Bolsa","Tubo","Maletín","Crate","Otro"];
const CHARGES_INIT=["Manejo Especial","Seguro","Sobredimensionado","Peligroso","Refrigerado","Entrega Especial","Combustible","Recargo Remoto"];
const CONTAINER_TYPES_INIT=[
  {code:"D",  name:"D — Door",        dim:"96×96×96 in",  maxLb:2000},
  {code:"E",  name:"E — Standard",    dim:"88×56×48 in",  maxLb:1500},
  {code:"EH", name:"EH — Extra High", dim:"88×56×60 in",  maxLb:1800},
  {code:"P",  name:"P — Pallet",      dim:"48×40×60 in",  maxLb:2500},
  {code:"LD3",name:"LD3 — Aéreo",     dim:"61×60×64 in",  maxLb:3500},
  {code:"LD7",name:"LD7 — Aéreo",     dim:"125×88×64 in", maxLb:7000},
  {code:"BLK",name:"BLK — Bulto",     dim:"Libre",        maxLb:9999},
];
// Nota legal del WR. Se configura por país en Configuración › Notas Legales.
// {EMPRESA} se reemplaza por el nombre de la empresa.
const NOTA_LEGAL_DEFAULT="NOTA: SE ESTÁ ENTREGANDO ESTA CAJA COMPLETAMENTE SELLADA. Certifico que este envío no contiene dinero, narcóticos, armas o dispositivos explosivos no autorizados. {EMPRESA} no se hace responsable de los artículos no retirados en los treinta (30) días siguientes a su recepción. Nuestra responsabilidad en caso de siniestros durante el transporte aéreo o marítimo, extravío o robos será de $100 dólares por recibo de almacén, si el cliente no asegura la carga. Estoy de acuerdo con que este envío está sujeto a los controles de seguridad de la compañía y otras regulaciones gubernamentales. SHIPPER autoriza a {EMPRESA} a que inspeccione toda la carga ofrecida del comercio aéreo a partir de la fecha de esta notificación de acuerdo con su Programa de Seguridad Standard de Transporte Aéreo Indirecto (IACSSP) aprobado por la TSA. Al recibir este documento y girar instrucciones de envío, da fe de haber leído, entendido y estar totalmente de acuerdo con los términos y regulaciones.";
const COUNTRIES_INIT=[
  {dial:"01",name:"USA 🇺🇸",cities:[{code:"MI",name:"Miami"},{code:"NY",name:"New York"},{code:"LA",name:"Los Angeles"},{code:"HO",name:"Houston"},{code:"OR",name:"Orlando"}]},
  {dial:"58",name:"Venezuela 🇻🇪",cities:[{code:"CCS",name:"Caracas"},{code:"VL",name:"Valencia"},{code:"MRB",name:"Maracaibo"},{code:"BCN",name:"Barcelona"},{code:"BAR",name:"Barquisimeto"}]},
  {dial:"57",name:"Colombia 🇨🇴",cities:[{code:"BOG",name:"Bogotá"},{code:"MDE",name:"Medellín"},{code:"CTG",name:"Cartagena"}]},
  {dial:"34",name:"España 🇪🇸",cities:[{code:"MAD",name:"Madrid"},{code:"BCN",name:"Barcelona"}]},
  {dial:"52",name:"México 🇲🇽",cities:[{code:"MEX",name:"CDMX"},{code:"GDL",name:"Guadalajara"}]},
  {dial:"51",name:"Perú 🇵🇪",cities:[{code:"LIM",name:"Lima"}]},
  {dial:"56",name:"Chile 🇨🇱",cities:[{code:"SCL",name:"Santiago"}]},
  {dial:"54",name:"Argentina 🇦🇷",cities:[{code:"EZE",name:"Buenos Aires"}]},
  {dial:"55",name:"Brasil 🇧🇷",cities:[{code:"GRU",name:"São Paulo"}]},
  {dial:"507",name:"Panamá 🇵🇦",cities:[{code:"PTY",name:"Panamá"}]},
];
// Moneda por dial de país (usada por Calculadora y otras vistas)
const PAIS_CURR={"01":"USD","58":"USD","57":"COP","34":"EUR","52":"MXN","51":"PEN","56":"CLP","54":"ARS","55":"BRL","507":"USD"};
// Clasificación de tipo de envío (global)
const tipoEsAereoG=(te)=>{const t=(te||"").toLowerCase().replace(/á/g,"a").replace(/é/g,"e");return t.includes("aereo")||t.includes("express")||t.includes("economico");};
const tipoEsMaritimoG=(te)=>{const t=(te||"").toLowerCase().replace(/í/g,"i");return t.includes("maritimo")||t.includes("fcl")||t.includes("lcl");};

// ─── INITIAL DATA — VACÍO (solo usuario Administrador) ────────────────────────
const CLIENTS_INIT=[
  {id:"U-001",tipo:"usuario",primerNombre:"Administrador",segundoNombre:"",primerApellido:"ENEX",segundoApellido:"",cedula:"V-00000001",dir:"",municipio:"",estado:"",pais:"",cp:"",tel1:"",tel2:"",email:"admin@enex.com",casillero:"",rol:"A",password:"admin123"},
];
const CONS_POOL=[];

// ─── VOL WEIGHT CALCULATIONS (CORRECTED) ──────────────────────────────────────
// En cm: L×A×H / 5000 = kg volumétrico
// En pulgadas: L×A×H / 139 = lb volumétrico
// Pies cúbicos: L(in)×A(in)×H(in) / 1728
// Metros cúbicos: L(cm)×A(cm)×H(cm) / 1,000,000
const calcVol = (l,a,h,unit="cm") => {
  if(unit==="cm"){
    const volKg = parseFloat((l*a*h/5000).toFixed(2));
    const volLb = parseFloat((volKg*2.205).toFixed(2));
    const m3    = parseFloat((l*a*h/1000000).toFixed(4));
    const lIn=l/2.54, aIn=a/2.54, hIn=h/2.54;
    const ft3   = parseFloat((lIn*aIn*hIn/1728).toFixed(3));
    return {volKg, volLb, m3, ft3};
  } else {
    // pulgadas
    const volLb = parseFloat((l*a*h/139).toFixed(2));
    const volKg = parseFloat((volLb/2.205).toFixed(2));
    const ft3   = parseFloat((l*a*h/1728).toFixed(3));
    const lCm=l*2.54, aCm=a*2.54, hCm=h*2.54;
    const m3    = parseFloat((lCm*aCm*hCm/1000000).toFixed(4));
    return {volKg, volLb, m3, ft3};
  }
};

// ─── WR INICIAL VACÍO ─────────────────────────────────────────────────────────
const WR_INIT=[];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate=d=>{if(!d)return"—";const dt=d instanceof Date?d:new Date(d);return dt.toLocaleDateString("es-VE",{day:"2-digit",month:"2-digit",year:"2-digit"});};
const fmtTime=d=>{if(!d)return"";const dt=d instanceof Date?d:new Date(d);return dt.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"});};
const fullName=p=>`${p.primerNombre} ${p.segundoNombre||""} ${p.primerApellido} ${p.segundoApellido||""}`.replace(/\s+/," ").trim();
const initials=p=>((p.primerNombre||"?")[0]+(p.primerApellido||"?")[0]).toUpperCase();
const toLb=v=>parseFloat((v*2.205).toFixed(1));
const toIn=v=>parseFloat((v/2.54).toFixed(1));
// Limpia el prefijo "Reempaque de: WR-X, WR-Y" de un texto (sólo va en Notas, nunca en Descripción)
const cleanReempaqueDesc=t=>String(t||"").replace(/^Reempaque de:\s*[^|]*(?:\s*\|\s*)?/i,"").trim();
const toUp=v=>typeof v==="string"?v.toUpperCase():v;
// Normaliza un tracking: sin espacios a los lados y en mayúsculas (para guardar y comparar)
const normTrk=v=>String(v||"").trim().toUpperCase();
// Todos los trackings de un WR (principal + los de cada caja), para búsquedas
const trkAll=w=>[w?.tracking,...(Array.isArray(w?.dims)?w.dims.map(d=>d?.tracking):[])].filter(Boolean).join(" ");
// Busca por coincidencia exacta y, si no hay, por los últimos dígitos o parte del texto.
// Devuelve: {item} si hay uno solo, {varios:[...]} si hay varios, {} si ninguno.
const buscarParcial=(v,items,campos)=>{
  const q=normTrk(v); if(!q)return {};
  const vals=it=>campos(it).flatMap(x=>String(x||"").toUpperCase().split(/\s+/)).filter(Boolean);
  const exactos=items.filter(it=>vals(it).some(x=>x===q));
  if(exactos.length===1)return {item:exactos[0]};
  if(exactos.length>1)return {varios:exactos};
  const finales=items.filter(it=>vals(it).some(x=>x.endsWith(q)));
  if(finales.length===1)return {item:finales[0]};
  if(finales.length>1)return {varios:finales};
  const parciales=items.filter(it=>vals(it).some(x=>x.includes(q)));
  if(parciales.length===1)return {item:parciales[0]};
  if(parciales.length>1)return {varios:parciales};
  return {};
};
// Buscador: WR y tracking coinciden por el final (últimos dígitos), el casillero por su
// número exacto y los nombres por palabras. Así "4321" no trae WR que solo lo contienen en medio.
const sinAcentos=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
const crearBuscador=texto=>{
  const Q=sinAcentos(texto).replace(/\s+/g," ");
  if(!Q)return null;
  const compacto=Q.replace(/[\s-]/g,"");
  const soloNum=/^\d+$/.test(compacto);
  const tieneLetra=/[A-Z]/.test(Q);
  const palabras=Q.split(" ").filter(Boolean);
  return {
    codigo:v=>{ // WR, tracking, guía
      if(!soloNum&&compacto.length<3)return false;
      if(soloNum&&compacto.length<3)return false;
      return String(v||"").split(/\s+/).some(x=>{const X=sinAcentos(x).replace(/[\s-]/g,"");return !!X&&(X===compacto||X.endsWith(compacto));});
    },
    casillero:v=>{
      const a=compacto.replace(/^C/,"").replace(/\D/g,""), b=String(v||"").replace(/\D/g,"");
      return /^C?\d+$/.test(compacto)&&!!a&&!!b&&parseInt(a,10)===parseInt(b,10);
    },
    nombre:v=>{
      if(!tieneLetra)return false;
      const pal=sinAcentos(v).split(/\s+/);
      return palabras.every(p=>pal.some(x=>x.startsWith(p)));
    },
  };
};
// ── ALCANCE POR USUARIO ─────────────────────────────────────────────
// Qué carga ve cada usuario externo. null = ve todo.
const cliDeWRCon=(w,clients)=>clients.find(c=>w.clienteId&&c.id===w.clienteId)||clients.find(c=>w.casillero&&c.casillero===w.casillero)||null;
const nombreCiudadCon=(v,countries)=>{const V=sinAcentos(v);for(const co of countries||[])for(const ci of (co.cities||[]))if(sinAcentos(ci.code)===V||sinAcentos(ci.name)===V)return sinAcentos(ci.name);return V;};
// Relación de un WR con una oficina: "salida" (se recibió allí), "entrega" (retira o se despachó allí) o null
const sucursalDeWR=(w,cli)=>(w&&w.sucursalEntrega!==null&&w.sucursalEntrega!==undefined)?(w.sucursalEntrega||""):((cli&&cli.tipo!=="usuario"&&cli.oficinaId)||"");
const wrRolOficina=(w,of,{clients,deliveryNotes,countries})=>{
  if(!of)return null;
  const cli=cliDeWRCon(w,clients);
  if(sucursalDeWR(w,cli)===of.id)return "entrega";
  if((deliveryNotes||[]).some(n=>!n.anulado&&n.receptorEntidad?.tipo==="oficina"&&n.receptorEntidad.id===of.id&&(n.wrIds||[]).includes(w.id)))return "entrega";
  const ciu=sinAcentos(of.ciudad);
  if(ciu&&nombreCiudadCon(w.origCity,countries)===ciu)return "salida";
  return null;
};
const crearAlcance=({u,clients,oficinas,deliveryNotes,countries,rolePerms})=>{
  if(!u||!["E","E1","F","G","I"].includes(u.rol))return null;
  if((rolePerms[u.rol]||[]).includes("todas_sucursales"))return null;
  const ct=c=>c?.clienteTipo||"matriz";
  let clienteOk=()=>false;
  if(u.rol==="E")clienteOk=c=>!!c&&c.tipo==="cliente"&&["agente","vendedor_agente"].includes(ct(c))&&!!u.agenteId&&c.agenteId===u.agenteId;
  else if(u.rol==="E1")clienteOk=c=>!!c&&c.tipo==="cliente"&&c.vendedorId===u.id;
  else if(u.rol==="F")clienteOk=c=>!!c&&ct(c)==="autonomo"&&c.autonomoId===u.id;
  else if(u.rol==="I")clienteOk=c=>!!c&&c.id===u.id;
  else if(u.rol==="G")clienteOk=c=>!!c&&c.tipo==="cliente"&&!!u.oficinaId&&c.oficinaId===u.oficinaId;
  const of=u.rol==="G"?oficinas.find(o=>o.id===u.oficinaId):null;
  const wrOk=u.rol==="G"
    ?w=>!!wrRolOficina(w,of,{clients,deliveryNotes,countries})
    :w=>clienteOk(cliDeWRCon(w,clients));
  return {clienteOk,wrOk};
};
// Si hay varias coincidencias, pide elegir una
const elegirDeVarios=(varios,etiqueta)=>{
  const lista=varios.slice(0,15).map((it,i)=>`${i+1}. ${etiqueta(it)}`).join("\n");
  const sel=window.prompt(`Hay ${varios.length} coincidencias. Escribe el número:\n\n${lista}${varios.length>15?"\n…":""}`,"1");
  const i=parseInt(sel,10)-1;
  return (!isNaN(i)&&i>=0&&i<Math.min(varios.length,15))?varios[i]:null;
};
const CU=CLIENTS_INIT.find(c=>c.rol==="A")||CLIENTS_INIT[0]||{id:"admin",rol:"A",primerNombre:"Admin",primerApellido:"ENEX",email:"admin@enex.com"};

const StBadge=({st})=>{if(!st||!st.cls)return <span className="st s1"><span className="st-dot"/>—</span>;return <span className={`st ${st.cls}`}><span className="st-dot"/>{st.label}</span>;};
const CarBadge=({c})=><span className={`car ${CAR_CLS[c]||"car-def"}`}>{c}</span>;
const TypeBadge=({t})=><span className={`type-b ${TYPE_CLS[t]||""}`}>{t}</span>;

// ─── CELDA CON UN VALOR DISTINTO POR CAJA ─────────────────────────────────────
// Un WR de varias cajas puede traer un tracking (o una descripcion, o una
// factura) distinto en cada caja, pero en la tabla solo entra un valor: hasta
// ahora se mostraba el de la primera caja y los demas quedaban invisibles.
// Cuando los valores difieren se muestra un boton "📦 N seguimientos" y al
// hacer click se abre el detalle caja por caja, igual que el popup de medidas.
// Mismo patron de portal + position:fixed (ver TxtCell / dim-pop).
const MultiCell=({dims=[],titulo,btn,columnas=[],tdStyle={},color="var(--navy)"})=>{
  const btnRef=useRef(null);
  const popRef=useRef(null);
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState(null);

  useEffect(()=>{
    if(!open){setPos(null);return;}
    const place=()=>{
      const el=btnRef.current;if(!el)return;
      const r=el.getBoundingClientRect();
      const W=420,H=Math.min(window.innerHeight*0.6,120+dims.length*30);
      let left=r.left,top=r.bottom+6;
      if(left+W>window.innerWidth-8)left=Math.max(8,window.innerWidth-W-8);
      if(top+H>window.innerHeight-8)top=Math.max(8,r.top-H-6);
      setPos({top,left});
    };
    place();
    const onDoc=e=>{
      if(popRef.current&&popRef.current.contains(e.target))return;
      const cell=btnRef.current&&btnRef.current.closest("td");
      if(cell&&cell.contains(e.target))return;
      setOpen(false);
    };
    window.addEventListener("scroll",place,true);
    window.addEventListener("resize",place);
    document.addEventListener("mousedown",onDoc);
    return()=>{
      window.removeEventListener("scroll",place,true);
      window.removeEventListener("resize",place);
      document.removeEventListener("mousedown",onDoc);
    };
  },[open,dims.length]);

  const grid=`26px ${columnas.map(c=>c.w||"1fr").join(" ")}`;
  return (
    <td style={tdStyle} onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}>
      <button ref={btnRef} type="button" className="dim-btn"
        style={{padding:"4px 10px",fontSize:13,fontWeight:600,background:"#E8F0FE",borderColor:"#90B8F0",color}}>
        {btn} {open?"▲":"▼"}
      </button>
      {open&&pos&&createPortal(
        <div ref={popRef} className="dim-pop"
          style={{position:"fixed",top:pos.top,left:pos.left,maxWidth:440,maxHeight:"60vh",overflowY:"auto"}}
          onClick={e=>e.stopPropagation()}>
          <div className="dim-pop-ttl">{titulo}</div>
          <div style={{display:"grid",gridTemplateColumns:grid,gap:8,padding:"5px 0",borderBottom:"1px solid var(--b1)"}}>
            <span className="dh">#</span>
            {columnas.map(c=><span key={c.h} className="dh">{c.h}</span>)}
          </div>
          {dims.map((d,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:grid,gap:8,padding:"6px 0",borderBottom:"1px solid var(--b3)",alignItems:"start"}}>
              <span className="dv" style={{color:"var(--t3)",fontWeight:600}}>{i+1}</span>
              {columnas.map(c=>(
                <span key={c.h} style={{fontSize:13,color:"var(--t1)",lineHeight:1.45,wordBreak:"break-word",
                  fontFamily:c.mono?"'DM Mono',monospace":"Arial,Helvetica,sans-serif"}}>{c.get(d)||"—"}</span>
              ))}
            </div>
          ))}
        </div>
      ,document.body)}
    </td>
  );
};

// ─── CELDA DE TEXTO CON POPUP DE CONTENIDO COMPLETO ───────────────────────────
// Cuando el texto no cabe en el ancho de la columna queda cortado con "…".
// En ese caso aparece un ⤢ al final de la celda y al hacer click se abre una
// ventanita con el contenido completo, igual que el popup de dimensiones
// cuando el WR tiene mas de una caja.
// Se renderiza en un portal con position:fixed porque .wr-scroll{overflow:auto}
// y .wr-panel{overflow:hidden} recortan cualquier popup absoluto.
const TxtCell=({value,titulo,tdStyle={},txtClass,txtStyle={},mono=false,color="var(--cyan)"})=>{
  const txt=(value===null||value===undefined||value==="")?"":String(value);
  const boxRef=useRef(null);
  const popRef=useRef(null);
  const [trunc,setTrunc]=useState(false);
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState(null);

  // ¿el texto esta cortado? scrollWidth > clientWidth significa que no cabe.
  // Se vuelve a medir al terminar de cargar las fuentes (DM Mono viene de
  // Google Fonts y cambia el ancho del texto) y al redimensionar la ventana.
  useEffect(()=>{
    let vivo=true;
    const check=()=>{const el=boxRef.current;if(el&&vivo)setTrunc(el.scrollWidth>el.clientWidth+1);};
    check();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(check).catch(()=>{});
    window.addEventListener("resize",check);
    return()=>{vivo=false;window.removeEventListener("resize",check);};
  },[txt]);

  useEffect(()=>{
    if(!open){setPos(null);return;}
    const place=()=>{
      const el=boxRef.current;if(!el)return;
      const r=el.getBoundingClientRect();
      const W=400,H=Math.min(window.innerHeight*0.5,110+Math.ceil(txt.length/46)*22);
      let left=r.left,top=r.bottom+6;
      if(left+W>window.innerWidth-8)left=Math.max(8,window.innerWidth-W-8);
      if(top+H>window.innerHeight-8)top=Math.max(8,r.top-H-6);
      setPos({top,left});
    };
    place();
    const onDoc=e=>{
      if(popRef.current&&popRef.current.contains(e.target))return;
      const cell=boxRef.current&&boxRef.current.closest("td");
      if(cell&&cell.contains(e.target))return;
      setOpen(false);
    };
    window.addEventListener("scroll",place,true);
    window.addEventListener("resize",place);
    document.addEventListener("mousedown",onDoc);
    return()=>{
      window.removeEventListener("scroll",place,true);
      window.removeEventListener("resize",place);
      document.removeEventListener("mousedown",onDoc);
    };
  },[open,txt]);

  return (
    <td style={tdStyle}
      onClick={trunc?(e=>{e.stopPropagation();setOpen(o=>!o);}):undefined}
      title={trunc?"Click para ver el contenido completo":undefined}>
      <div style={{display:"flex",alignItems:"center",gap:4,maxWidth:"100%",cursor:trunc?"pointer":"inherit"}}>
        <div ref={boxRef} className={txtClass}
          style={{...txtStyle,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {txt||"—"}
        </div>
        {trunc&&(
          <span style={{flexShrink:0,fontSize:10,lineHeight:1,fontWeight:700,color,
            background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4,padding:"3px 4px"}}>⤢</span>
        )}
      </div>
      {open&&pos&&createPortal(
        <div ref={popRef} className="dim-pop"
          style={{position:"fixed",top:pos.top,left:pos.left,maxWidth:400,maxHeight:"50vh",overflowY:"auto"}}
          onClick={e=>e.stopPropagation()}>
          <div className="dim-pop-ttl">{titulo}</div>
          <div style={{fontSize:13.5,color:"var(--t1)",lineHeight:1.55,whiteSpace:"pre-wrap",wordBreak:"break-word",
            fontFamily:mono?"'DM Mono',monospace":"Arial,Helvetica,sans-serif"}}>{txt||"—"}</div>
        </div>
      ,document.body)}
    </td>
  );
};

// ─── WR ROW ────────────────────────────────────────────────────────────────────
const CT_LABEL_WR={agente:"🤝 Agente",vendedor_agente:"💼 Vend. Agente",autonomo:"🧑‍💻 Autónomo",oficina:"🏢 Oficina",vendedor_oficina:"🛒 Vend. Oficina",matriz:"🏛️ Matriz"};
const WRRow=({w,sel,onClick,unitL,unitW,dimOpen,onDimToggle,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz",sendTypes=[],onAssignTipo,onFotoClick,onTimelineClick,consolList=[],onGuiaClick,canBypass=false})=>{
  const isIn=unitL==="in";
  const isLb=unitW==="lb";
  // Popup de cajas: se renderiza en un portal con position:fixed porque el
  // contenedor de la tabla (.wr-scroll overflow:auto / .wr-panel overflow:hidden)
  // recortaba el popup absoluto y lo dejaba invisible en la mayoria de las filas.
  const dimBtnRef=useRef(null);
  const dimPopRef=useRef(null);
  const [dimPos,setDimPos]=useState(null);
  useEffect(()=>{
    if(!dimOpen){setDimPos(null);return;}
    const n=(w.dims||[]).length;
    const place=()=>{
      const el=dimBtnRef.current;if(!el)return;
      const r=el.getBoundingClientRect();
      const W=420,H=Math.min(window.innerHeight*0.7,210+n*30);
      let left=r.left,top=r.bottom+6;
      if(left+W>window.innerWidth-8)left=Math.max(8,window.innerWidth-W-8);
      if(top+H>window.innerHeight-8)top=Math.max(8,r.top-H-6);
      setDimPos({top,left});
    };
    place();
    const onDoc=e=>{
      if(dimPopRef.current&&dimPopRef.current.contains(e.target))return;
      if(dimBtnRef.current&&dimBtnRef.current.contains(e.target))return;
      onDimToggle();
    };
    window.addEventListener("scroll",place,true);
    window.addEventListener("resize",place);
    document.addEventListener("mousedown",onDoc);
    return()=>{
      window.removeEventListener("scroll",place,true);
      window.removeEventListener("resize",place);
      document.removeEventListener("mousedown",onDoc);
    };
  },[dimOpen,w.dims]);
  const showVol = isLb ? `${w.volLb}lb` : `${w.volKg}kg`;
  const showPeso = isLb ? `${w.pesoLb}lb` : `${w.pesoKg}kg`;

  // Valores que pueden variar caja por caja (cada entrada de dims guarda su
  // propio carrier / tracking / factura / descripcion). Si difieren, la celda
  // pasa a mostrar un boton con el detalle por caja en vez de solo el 1er valor.
  const dimsArr=Array.isArray(w.dims)?w.dims:[];
  const distintos=k=>[...new Set(dimsArr.map(d=>String(d?.[k]??"").trim()).filter(Boolean))];
  const trkDist=distintos("tracking");
  const descDist=distintos("descripcion");

  const fmtDim=(d)=>isIn?`${toIn(d)}`:`${d}`;
  const fmtW=(pk)=>isLb?`${toLb(pk)}lb`:`${pk}kg`;
  const fmtVol=(l,a,h)=>{
    const v=calcVol(l,a,h,"cm");
    return isLb?`${v.volLb}lb`:`${v.volKg}kg`;
  };

  const dimCell=w.dims.length===1?(
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      <div className="dim-txt" style={{letterSpacing:.3,fontFamily:"'DM Mono',monospace",fontWeight:600}}>
        {fmtDim(w.dims[0].l)} × {fmtDim(w.dims[0].a)} × {fmtDim(w.dims[0].h)}
      </div>
      <div className="dim-sub">{isIn?"L×A×H pulg.":"L×A×H cm"}</div>
    </div>
  ):(
    <div className="pos-rel">
      <button ref={dimBtnRef} className="dim-btn" style={{padding:"4px 10px",fontSize:13,fontWeight:600,background:"#E8F0FE",borderColor:"#90B8F0",color:"var(--navy)"}} onClick={e=>{e.stopPropagation();onDimToggle();}}>
        📦 {w.dims.length} cajas {dimOpen?"▲":"▼"}
      </button>
      {dimOpen&&dimPos&&createPortal(
        <div ref={dimPopRef} className="dim-pop" style={{position:"fixed",top:dimPos.top,left:dimPos.left,maxHeight:"70vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
          <div className="dim-pop-ttl">📐 Detalle — {w.dims.length} cajas · {isIn?"Pulgadas":"Centímetros"} · {isLb?"Libras":"Kilos"}</div>
          <div className="dr">
            {["#","Largo","Ancho","Alto","Peso","Peso Vol."].map(h=><span key={h} className="dh">{h}</span>)}
          </div>
          {w.dims.map((d,i)=>(
            <div key={i} className="dr">
              <span className="dv" style={{color:"var(--t3)",fontWeight:600}}>{i+1}</span>
              <span className="dv">{fmtDim(d.l)}</span>
              <span className="dv">{fmtDim(d.a)}</span>
              <span className="dv">{fmtDim(d.h)}</span>
              <span className="dv" style={{color:"var(--t1)",fontWeight:600}}>{fmtW(d.pk)}</span>
              <span className="dv" style={{color:"var(--orange)",fontWeight:600}}>{fmtVol(d.l,d.a,d.h)}</span>
            </div>
          ))}
          {/* TOTALES */}
          <div style={{marginTop:10,paddingTop:10,borderTop:"2px solid var(--b1)",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,fontSize:13}}>
            <div style={{background:"var(--bg4)",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:11,marginBottom:2}}>TOTAL PESO</div>
              <div style={{fontWeight:700,color:"var(--navy)",fontFamily:"'DM Mono',monospace"}}>{isLb?`${w.pesoLb}lb`:`${w.pesoKg}kg`}</div>
            </div>
            <div style={{background:"#FEF0E8",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:11,marginBottom:2}}>TOTAL P.VOL.</div>
              <div style={{fontWeight:700,color:"var(--orange)",fontFamily:"'DM Mono',monospace"}}>{isLb?`${w.volLb}lb`:`${w.volKg}kg`}</div>
            </div>
            <div style={{background:"#EEF4FE",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:11,marginBottom:2}}>FT³</div>
              <div style={{fontWeight:700,color:"var(--sky)",fontFamily:"'DM Mono',monospace"}}>{w.ft3}</div>
            </div>
            <div style={{background:"#E8F6F4",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:11,marginBottom:2}}>M³</div>
              <div style={{fontWeight:700,color:"var(--teal)",fontFamily:"'DM Mono',monospace"}}>{w.m3}</div>
            </div>
          </div>
        </div>
      ,document.body)}
    </div>
  );
  return (
    <tr className={"wr-row"+(sel?" sel":"")}>
      {/* 1. N° WR — primera columna. Es la UNICA celda que abre el detalle del WR:
           antes el onClick estaba en todo el <tr>, y al cerrar un popup (cajas,
           seguimientos, etc.) haciendo clic fuera se abria sin querer otro WR. */}
      <td onClick={onClick} title="Abrir detalle del WR">
        <div className="c-wr" style={{display:"inline-flex",alignItems:"center",gap:6}}>
          {w.id}
          {onTimelineClick&&(
            <span onClick={e=>{e.stopPropagation();onTimelineClick(w);}} title="📅 Historia y fechas del WR"
              style={{cursor:"pointer",fontSize:12,opacity:.7,transition:"opacity .12s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=.7}>📅</span>
          )}
        </div>
        <div className="c-route">{w.origCity} → {w.destCity}</div>
      </td>
      {/* 2. TIPO ENVÍO (confirmación) — después de N° WR.
           Solo modificable si status ∈ {1, 2, 3}. Reempacado (2.3), Egresado (25) y
           Consolidado en adelante (4+) muestran el badge sin permitir cambios.
           Si el WR no tiene tipoEnvio pero está en una guía consolidada, hace fallback
           al tipoEnvio de la guía (display read-only, marcado con un asterisco discreto). */}
      <td onClick={e=>e.stopPropagation()} style={{minWidth:88,padding:"4px 6px"}}>
        {(()=>{
          const _wrLocked=!canBypass&&!["1","2","3"].includes(w.status?.code||"");
          // Fallback: si w.tipoEnvio está vacío, intentar inferirlo de la guía consolidada
          const guiaFallback=(!w.tipoEnvio)?(consolList.find(c=>{
            if(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))return true;
            return (c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id));
          })):null;
          const tipoMostrar=w.tipoEnvio||guiaFallback?.tipoEnvio||"";
          if(_wrLocked){
            return tipoMostrar
              ? <span style={{display:"inline-flex",alignItems:"center",gap:3}} title={!w.tipoEnvio&&guiaFallback?`Heredado de guía ${guiaFallback.id}`:""}>
                  <TypeBadge t={tipoMostrar}/>
                  {!w.tipoEnvio&&guiaFallback&&<span style={{fontSize:10,color:"var(--t3)",fontWeight:600}}>*</span>}
                </span>
              : <span style={{color:"var(--t4)",fontSize:11}}>—</span>;
          }
          return w.tipoEnvio
            ?<div style={{display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{display:"inline-flex"}}><TypeBadge t={w.tipoEnvio}/></span>
                {onAssignTipo&&<span onClick={()=>{if(window.confirm(`¿Quitar tipo de envío del WR ${w.id}?${w.status?.code==="3"?"\n\nTambién se revertirá la confirmación.":""}`))onAssignTipo(w,"");}} title="Quitar tipo de envío" style={{cursor:"pointer",fontSize:13,color:"var(--red)",padding:"0 3px",lineHeight:1,fontWeight:700}}>✕</span>}
              </div>
            :(onAssignTipo&&sendTypes.length>0
              ?<select value="" onChange={e=>{if(e.target.value)onAssignTipo(w,e.target.value);}} title="Confirmar tipo de envío" style={{fontSize:11,padding:"2px 3px",border:"1px dashed var(--navy)",borderRadius:4,background:"var(--bg3)",color:"var(--navy)",fontWeight:600,cursor:"pointer",minWidth:78}}>
                  <option value="">Asignar</option>
                  {sendTypes.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              :<span style={{color:"var(--t3)"}}>—</span>);
        })()}
      </td>
      {/* 3. ESTADO */}
      <td style={{minWidth:100,padding:"4px 6px"}} title={w.status?.label||""}><StBadge st={w.status}/></td>
      {/* 4. GUÍA — guía consolidada en la que se envió la carga (clic = abrirla) */}
      <td style={{minWidth:86,padding:"4px 6px",whiteSpace:"nowrap"}}>
        {(()=>{
          const g=consolList.find(c=>(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))||(c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id)));
          if(!g)return <span style={{color:"var(--t4)",fontSize:12}}>—</span>;
          return(
            <span onClick={onGuiaClick?()=>onGuiaClick(g):undefined} title={onGuiaClick?`Abrir guía ${g.id}`:`Guía ${g.id}`}
              style={{display:"inline-block",fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,letterSpacing:.5,color:"var(--navy)",background:"#EEF3FF",border:"2px solid #B8C8F0",borderRadius:5,padding:"3px 9px",cursor:onGuiaClick?"pointer":"default"}}>
              {g.id}
            </span>
          );
        })()}
      </td>
      <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{w.cajas}</td>
      <td>{(()=>{
        const cl=clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero===w.casillero);
        const ct=cl?.clienteTipo||"";
        let label="—", sub="";
        if(ct==="matriz"){label="🏛️ "+empresaNombre;}
        else if(ct==="agente"||ct==="vendedor_agente"){const ag=agentes.find(a=>a.id===cl?.agenteId);label=(ct==="agente"?"🤝":"💼")+" "+(ag?.nombre||ag?.codigo||"⚠️ Sin agente");sub=ct==="vendedor_agente"?"Vend. Agente":"Agente";}
        else if(ct==="oficina"||ct==="vendedor_oficina"){const of=oficinas.find(o=>o.id===cl?.oficinaId);label=(ct==="oficina"?"🏢":"🛒")+" "+(of?.nombre||of?.codigo||"⚠️ Sin oficina");sub=ct==="vendedor_oficina"?"Vend. Oficina":"Oficina";}
        else if(ct==="autonomo"){const au=clients.find(c=>c.id===cl?.autonomoId);label="🧑‍💻 "+(au?`${au.primerNombre} ${au.primerApellido}`:"⚠️ Sin autónomo");sub="Autónomo";}
        else{label=w.branch||"—";}
        return <div><div style={{fontSize:12,fontWeight:700,color:"var(--navy)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:120}}>{label}</div>{sub&&<div style={{fontSize:11,color:"var(--t3)"}}>{sub}</div>}</div>;
      })()}</td>
      <td><div className="c-dt">{fmtDate(w.fecha)}</div><div className="c-tm">{fmtTime(w.fecha)}</div></td>
      <td><div className="c-name">{w.consignee}</div><div className="c-cas">{w.casillero}</div></td>
      <td style={{maxWidth:72,overflow:"hidden",textOverflow:"ellipsis"}}>
        <span style={{fontWeight:700,fontSize:13,color:"var(--navy)"}}>{w.carrier||"—"}</span>
      </td>
      {trkDist.length>1
        ? <MultiCell dims={dimsArr} tdStyle={{maxWidth:190}} color="var(--cyan)"
            btn={`📦 ${trkDist.length} seguimientos`}
            titulo={`🔗 Seguimiento por caja — ${dimsArr.length} cajas · ${trkDist.length} números distintos`}
            columnas={[{h:"Transp.",w:"78px",get:d=>d.carrier},{h:"Nº de seguimiento",w:"1fr",mono:true,get:d=>d.tracking}]}/>
        : <TxtCell value={w.tracking} titulo="🔗 Nº de seguimiento" mono
            tdStyle={{maxWidth:170,overflow:"hidden"}} txtClass="c-trk"/>}
      {descDist.length>1
        ? <MultiCell dims={dimsArr} tdStyle={{minWidth:200,maxWidth:260}} color="var(--navy)"
            btn={`📦 ${descDist.length} descripciones`}
            titulo={`📝 Descripción por caja — ${dimsArr.length} cajas · ${descDist.length} descripciones distintas`}
            columnas={[{h:"Descripción",w:"1fr",get:d=>cleanReempaqueDesc(d.descripcion)},{h:"Factura",w:"88px",get:d=>d.factura}]}/>
        : <TxtCell value={cleanReempaqueDesc(w.descripcion)} titulo="📝 Descripción de la mercancía"
            tdStyle={{minWidth:200,maxWidth:260,overflow:"hidden"}} color="var(--navy)"/>}
      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t1)",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={w.factura||""}>{w.factura?w.factura:"—"}</td>
      <td style={{textAlign:"right"}}><span className="c-val">${w.valor?.toFixed(2)||"0.00"}</span></td>
      <td>{dimCell}</td>
      <td style={{textAlign:"right"}}><span className="c-wt">{showPeso}</span></td>
      <td style={{textAlign:"right"}}><span className="c-wtvol">{showVol}</span></td>
      <td style={{textAlign:"right"}}><span className="c-ft3">{w.ft3||"—"}</span></td>
      <td style={{textAlign:"right"}}><span className="c-m3">{w.m3||"—"}</span></td>
      <td><span className="c-note">{w.notas||"—"}</span></td>
      {/* FOTO — abre el visor de fotos del WR (Supabase Storage) */}
      <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        {w.foto
          ?<button type="button" title="Ver fotos del paquete" onClick={()=>onFotoClick&&onFotoClick(w)}
             style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",padding:0,lineHeight:1}}>📷</button>
          :<span className="ic-b" style={{color:"var(--t4)"}}>—</span>}
      </td>
      <td style={{textAlign:"center"}}><span className={`ic-b ${w.prealerta?"has":""}`}>{w.prealerta?"📎":"—"}</span></td>
    </tr>
  );
};

// ─── WR TABLE COMPONENT ────────────────────────────────────────────────────────
const PAGE_SIZE=50;
const WRTable=({rows,selId,onSelect,unitL,unitW,onSort,sortCol,sortDir,dimOpen,onDimToggle,page,onPage,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz",sendTypes=[],onAssignTipo,onFotoClick,onTimelineClick,consolList=[],onGuiaClick,canBypass=false})=>{
  const totalPages=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));
  const pageRows=rows.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const SortTh=({col,children,align})=>(
    <th style={align?{textAlign:align}:{}} onClick={()=>onSort(col)}>
      {children}{sortCol===col?(sortDir==="asc"?" ▲":" ▼"):""}
    </th>
  );
  return (
    <>
      <div className="wr-scroll">
        <table className="wt">
          <thead>
            <tr>
              <SortTh col="id">N° WR</SortTh>
              <th style={{minWidth:88}}>Tipo Envío</th>
              <th style={{minWidth:100}}>Estado</th>
              <th style={{minWidth:86}}>Guía</th>
              <SortTh col="cajas" align="center">Cajas</SortTh>
              <SortTh col="branch">Branch</SortTh>
              <SortTh col="fecha">Fecha / Hora</SortTh>
              <th style={{minWidth:160}}>Recipiente (Consignatario)</th>
              <th style={{width:72,maxWidth:72}}>Transp.</th>
              <th style={{minWidth:160}}>Seguimiento</th>
              <th style={{minWidth:200}}>Descripción</th>
              <th style={{width:90,maxWidth:100}}>Factura</th>
              <th style={{textAlign:"right",minWidth:100}}>Valor Decl.</th>
              <th style={{minWidth:180}}>Dimensiones</th>
              <th style={{textAlign:"right",minWidth:70}}>Peso</th>
              <th style={{textAlign:"right",minWidth:80}}>Peso Vol.</th>
              <th style={{textAlign:"right",minWidth:60}}>Ft³</th>
              <th style={{textAlign:"right",minWidth:60}}>M³</th>
              <th style={{minWidth:200}}>Notas</th>
              <th style={{textAlign:"center",width:48}}>📷 Foto</th>
              <th style={{textAlign:"center",width:65}}>Pre-Alerta</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length===0?(
              <tr><td colSpan={21} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No se encontraron registros.</td></tr>
            ):pageRows.map(w=>(
              <WRRow key={w.id} w={w} sel={selId===w.id} onClick={()=>onSelect(w)}
                unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
                sendTypes={sendTypes} onAssignTipo={onAssignTipo} onFotoClick={onFotoClick} onTimelineClick={onTimelineClick}
                consolList={consolList} onGuiaClick={onGuiaClick} canBypass={canBypass}
                dimOpen={dimOpen===w.id} onDimToggle={()=>onDimToggle(w.id)}/>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <div className="pag">
        <button className="pag-btn" disabled={page===1} onClick={()=>onPage(1)}>«</button>
        <button className="pag-btn" disabled={page===1} onClick={()=>onPage(page-1)}>‹</button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
          <button key={p} className={`pag-btn ${page===p?"on":""}`} onClick={()=>onPage(p)}>{p}</button>
        ))}
        <button className="pag-btn" disabled={page===totalPages} onClick={()=>onPage(page+1)}>›</button>
        <button className="pag-btn" disabled={page===totalPages} onClick={()=>onPage(totalPages)}>»</button>
        <span className="pag-info">
          {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE,rows.length)} de {rows.length} registros
        </span>
        <span style={{fontSize:12,color:"var(--t3)",marginLeft:4}}>| 50 por página</span>
      </div>
    </>
  );
};

// ─── WR FORM HELPERS (outside component) ─────────────────────────────────────
const emptyCaja=()=>({
  cantidad:1,
  carrier:"", tracking:"",
  carrier2:"", tracking2:"",
  carrier3:"", tracking3:"",
  proveedor:"", numFactura:"", montoFactura:"",
  largo:"", ancho:"", alto:"", pesoLb:"",
  descripcion:"", tipoEmbalaje:"",
  fotos:[], // [{id?, file, url, path?, source:'upload'|'webcam', mime, sizeBytes, filename, createdAt}]
});
// El tipoPago por defecto viene de la configuración del sistema (PAY_TYPES[0]).
// El usuario administra esa lista en Configuración → Tipos de Pago, y el primer
// elemento del listado es el que predetermina cada Nuevo WR. Si no hay nada
// configurado (caso límite), queda vacío y el select queda en el primer option.
const emptyWRF=(defaultTipoPago="")=>({
  consignee:"",casilleroSearch:"",casillero:"",clienteId:"",sucursalEntrega:"",
  remitente:"",remitenteDir:"",remitenteTel:"",remitenteEmail:"",remitenteDoc:"",remitenteId:"",
  chofer:"",idChofer:"",proNumber:"",ocNumber:"",
  tipoPago:defaultTipoPago,tipoEnvio:"",
  notas:"",cargos:[],
  unitDim:"in",unitPeso:"lb",
  cajas:[emptyCaja()],
  reempaqueDe:[], // IDs de WR padre cuando el modal se abre desde Reempaque
});

// ─── HEADER NAME HELPER ──────────────────────────────────────────────────────
// Devuelve el nombre dinámico a mostrar como encabezado del WR/etiqueta según el
// tipo de cliente: Matriz → empresaNombre, Agente/Vend.Agente → nombre del agente,
// Oficina/Vend.Oficina → "EMPRESA — OFICINA", Autónomo → "EMPRESA — #casillero".
const getHeaderName=(w,clients=[],agentes=[],oficinas=[],empresaNombre="")=>{
  if(!w)return empresaNombre;
  const cl=clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero===w.casillero);
  const ct=cl?.clienteTipo||"matriz";
  if(ct==="agente"||ct==="vendedor_agente"){
    const ag=agentes.find(a=>a.id===cl?.agenteId);
    return String(ag?.nombre||ag?.codigo||empresaNombre).toUpperCase();
  }
  if(ct==="oficina"||ct==="vendedor_oficina"){
    const of=oficinas.find(o=>o.id===cl?.oficinaId);
    return of?.nombre?`${empresaNombre} — ${String(of.nombre).toUpperCase()}`:empresaNombre;
  }
  if(ct==="autonomo"){
    // autónomos son usuarios (tipo="usuario", rol="F"); usar el ID (N° de Usuario) del autónomo
    const au=clients.find(c=>c.id===cl?.autonomoId);
    const num=au?.id||"";
    return num?`${empresaNombre} — ${num}`:empresaNombre;
  }
  return empresaNombre;
};

// ─── BARCODE COMPONENT (Code 128, escaneable) ────────────────────────────────
const WRBarcode=({value,height=50,width=2})=>{
  const B=["11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100","10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000","11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110","10110100000","10110000100","10011010000","10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010","10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","1100011101011"];
  const s=String(value);
  const codes=[104];
  let chk=104;
  for(let i=0;i<s.length;i++){const c=s.charCodeAt(i)-32;codes.push(c);chk+=(i+1)*c;}
  codes.push(chk%103);codes.push(106);
  const bits=codes.map(c=>B[c]||"").join("");
  const rects=[];let i=0;
  while(i<bits.length){const b=bits[i];let j=i;while(j<bits.length&&bits[j]===b)j++;if(b==="1")rects.push(<rect key={i} x={i*width} y={0} width={(j-i)*width} height={height} fill="#000"/>);i=j;}
  return <svg width={bits.length*width} height={height} style={{display:"block"}}>{rects}</svg>;
};

// Etiquetas de unidades de cobro
const UNI_LBL={lb:"lb",kg:"kg",ft3:"ft³","ft³":"ft³",m3:"m³"};
const unidadTarifa=(t,esAereo)=>{const u=t?.unidad;if(esAereo)return u==="kg"?"kg":"lb";return u==="m3"?"m3":"ft3";};
// Campo de contraseña con botón para ver / ocultar lo que se escribe
// Selección múltiple de lugares (país completo o ciudad) con buscador; pensado para cientos de opciones
const SelectorLugares=({titulo,countries,value,onChange})=>{
  const [q,setQ]=useState("");
  const [abierto,setAbierto]=useState(false);
  const opciones=[];
  (countries||[]).forEach(co=>{
    opciones.push({pais:co.name,ciudad:"",l:`${co.name} (todo el país)`});
    (co.cities||[]).forEach(ci=>opciones.push({pais:co.name,ciudad:ci.name,l:ci.name,sub:co.name,code:ci.code||""}));
  });
  const k=x=>`${sinAcentos(x.pais)}|${sinAcentos(x.ciudad)}`;
  const elegidos=value||[];
  const sel=new Set(elegidos.map(k));
  const Q=sinAcentos(q.trim());
  const vis=opciones.filter(o=>!sel.has(k(o))&&(!Q||sinAcentos(`${o.l} ${o.sub||""} ${o.code||""}`).includes(Q))).slice(0,30);
  const agregar=o=>{onChange([...elegidos,{pais:o.pais,ciudad:o.ciudad}]);setQ("");};
  const etiqueta=x=>x.ciudad?`${x.ciudad} · ${x.pais}`:`${x.pais} (todo el país)`;
  return(
    <div style={{flex:1,minWidth:260}}>
      <div className="sdiv">{titulo}</div>
      <div className="fi-search" style={{position:"relative"}}>
        <input className="fi" placeholder="Buscar país o ciudad…" value={q}
          onFocus={()=>setAbierto(true)} onBlur={()=>setTimeout(()=>setAbierto(false),150)}
          onChange={e=>{setQ(e.target.value);setAbierto(true);}}
          onKeyDown={e=>{if(e.key==="Enter"&&vis[0]){e.preventDefault();agregar(vis[0]);}}}/>
        {abierto&&vis.length>0&&(
          <div className="fi-search-res">
            {vis.map(o=>(
              <div key={k(o)} className="fi-search-item" onMouseDown={e=>{e.preventDefault();agregar(o);}}>
                {o.l}{o.sub&&<span style={{fontSize:12,color:"var(--t3)",marginLeft:8}}>{o.sub}{o.code?` · ${o.code}`:""}</span>}
              </div>))}
          </div>)}
      </div>
      {elegidos.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
          {elegidos.map(x=>(
            <span key={k(x)} style={{fontSize:12,fontWeight:600,padding:"3px 8px",borderRadius:12,background:"#EEF3FF",color:"var(--navy)",border:"1px solid #B8C8F0"}}>
              {etiqueta(x)} <span style={{cursor:"pointer",color:"var(--red)",marginLeft:4}} onClick={()=>onChange(elegidos.filter(y=>k(y)!==k(x)))}>✕</span>
            </span>))}
        </div>)}
    </div>
  );
};
const PwInput=({style,...props})=>{
  const [ver,setVer]=useState(false);
  return (
    <div style={{position:"relative",width:"100%"}}>
      <input {...props} type={ver?"text":"password"} style={{...(style||{}),width:"100%",paddingRight:38,textTransform:"none"}}/>
      <button type="button" tabIndex={-1} onClick={()=>setVer(v=>!v)} title={ver?"Ocultar":"Mostrar"}
        style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,padding:4,lineHeight:1,opacity:ver?1:.6}}>
        {ver?"🙈":"👁️"}
      </button>
    </div>
  );
};

// ─── STANDALONE COMPONENTS (outside main component to avoid hook issues) ─────
const ClientModal=({initial,onClose,onSave,title,agentes=[],oficinas=[],autonomos=[],allClients=[]})=>{
  const _ROL_TO_TIPO_INIT={"E":"agente","E1":"vendedor_agente","F":"autonomo","G":"oficina"};
  // Los clientes ya no pertenecen a oficinas (son sucursales): los antiguos pasan a Casa Matriz
  const _ct0=initial?.clienteTipo||(initial?.tipo==="usuario"&&initial?.rol?_ROL_TO_TIPO_INIT[initial.rol]||"matriz":"matriz");
  const _initClienteTipo=initial?.tipo!=="usuario"&&["oficina","vendedor_oficina"].includes(_ct0)?"matriz":_ct0;
  const [f,setF]=useState({clienteTipo:"matriz",password:"",...initial,clienteTipo:_initClienteTipo});
  const [emailErr,setEmailErr]=useState("");
  // Campos que NO deben convertirse a mayúsculas (IDs, enums, credenciales)
  const NO_UPPER_F=["email","login","password","tipo","clienteTipo","agenteId","oficinaId","autonomoId","vendedorId","rol","activo","id"];
  // Mapa rol → clienteTipo para usuarios (sincroniza automáticamente)
  const ROL_TO_TIPO={"E":"agente","E1":"vendedor_agente","F":"autonomo","G":"oficina"};
  const ff=(k,v)=>setF(p=>{
    const val=typeof v==="string"&&!NO_UPPER_F.includes(k)?v.toUpperCase():v;
    const upd={...p,[k]:val};
    // Cuando cambia el rol de un usuario → sincronizar clienteTipo automáticamente
    if(k==="rol"&&p.tipo==="usuario") upd.clienteTipo=ROL_TO_TIPO[v]||"matriz";
    return upd;
  });
  return (
    <div className="ov">
      <div className="modal mmd" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mt">{title}</div><button className="mcl" onClick={onClose}>✕</button></div>
        <div className="sdiv">TIPO DE REGISTRO</div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["cliente","🏠 Cliente"],["usuario","👤 Usuario Sistema"]].map(([v,l])=>
            <button key={v} className={`btn-${f.tipo===v?"p":"s"}`} onClick={()=>ff("tipo",v)}>{l}</button>)}
        </div>
        {/* Pertenece a — solo clientes (los usuarios lo toman de su rol) */}
        {f.tipo!=="usuario"&&(
          <div style={{marginBottom:14}}>
            <div className="sdiv">PERTENECE A</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:f.clienteTipo&&f.clienteTipo!=="matriz"?10:0}}>
              {[
                {v:"agente",l:"🤝 Agente"},
                {v:"vendedor_agente",l:"💼 Vendedor de Agente"},
                {v:"autonomo",l:"🧑‍💻 Autónomo"},
                {v:"matriz",l:"🏛️ Casa Matriz"},
              ].map(op=>(
                <button key={op.v} className={`btn-${(f.clienteTipo||"matriz")===op.v?"p":"s"}`}
                  style={{fontSize:13,padding:"5px 10px"}}
                  onClick={()=>ff("clienteTipo",op.v)}>{op.l}</button>
              ))}
            </div>
            {["agente","vendedor_agente"].includes(f.clienteTipo||"")&&agentes.length>0&&(
              <div className="fg" style={{marginTop:8}}><div className="fl">Agente *</div>
                <select className="fs" value={f.agenteId||""} onChange={e=>ff("agenteId",e.target.value)}>
                  <option value="">— Selecciona un Agente —</option>
                  {agentes.map(a=><option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}
                </select>
              </div>
            )}
            {f.clienteTipo==="vendedor_agente"&&(
              <div className="fg" style={{marginTop:8}}><div className="fl">Vendedor</div>
                <select className="fs" value={f.vendedorId||""} onChange={e=>ff("vendedorId",e.target.value)}>
                  <option value="">— Sin vendedor —</option>
                  {allClients.filter(c=>c.tipo==="usuario"&&c.rol==="E1"&&(!f.agenteId||c.agenteId===f.agenteId)).map(v=><option key={v.id} value={v.id}>{v.id} — {v.primerNombre} {v.primerApellido}</option>)}
                </select>
              </div>
            )}
            {f.clienteTipo==="autonomo"&&(
              <div className="fg" style={{marginTop:8}}><div className="fl">Autónomo *</div>
                <select className="fs" value={f.autonomoId||""} onChange={e=>ff("autonomoId",e.target.value)}>
                  <option value="">— Selecciona un Autónomo —</option>
                  {autonomos.map(a=><option key={a.id} value={a.id}>{a.id} — {a.primerNombre} {a.primerApellido}</option>)}
                </select>
                {autonomos.length===0&&<div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>No hay autónomos registrados en el sistema aún.</div>}
              </div>
            )}
            <div className="fg" style={{marginTop:10}}><div className="fl">Sucursal de entrega</div>
              <select className="fs" value={f.oficinaId||""} onChange={e=>ff("oficinaId",e.target.value)}>
                <option value="">🏛️ Principal</option>
                {oficinas.map(o=><option key={o.id} value={o.id}>🏢 {o.nombre}{o.ciudad?` — ${o.ciudad}`:""}{o.pais?`, ${o.pais}`:""}</option>)}
              </select>
            </div>
          </div>
        )}
        {/* Usuario de agente: su agente */}
        {f.tipo==="usuario"&&["E","E1"].includes(f.rol)&&(
          <div className="fg" style={{marginBottom:14}}><div className="fl">Agente *</div>
            <select className="fs" value={f.agenteId||""} onChange={e=>ff("agenteId",e.target.value)}>
              <option value="">— Selecciona un Agente —</option>
              {agentes.map(a=><option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}
            </select>
          </div>
        )}
        {/* Usuario de oficina: su sucursal */}
        {f.tipo==="usuario"&&f.rol==="G"&&(
          <div className="fg" style={{marginBottom:14}}><div className="fl">Oficina (sucursal) *</div>
            <select className="fs" value={f.oficinaId||""} onChange={e=>ff("oficinaId",e.target.value)}>
              <option value="">— Selecciona la oficina —</option>
              {oficinas.map(o=><option key={o.id} value={o.id}>{o.nombre}{o.ciudad?` — ${o.ciudad}`:""}{o.pais?`, ${o.pais}`:""}</option>)}
            </select>
          </div>
        )}
        <div className="sdiv">DATOS PERSONALES</div>
        <div className="fgrid g4" style={{marginBottom:10}}>
          <div className="fg"><div className="fl">Primer Nombre *</div><input className="fi" value={f.primerNombre} onChange={e=>ff("primerNombre",e.target.value)} placeholder="Primer nombre"/></div>
          <div className="fg"><div className="fl">Segundo Nombre</div><input className="fi" value={f.segundoNombre} onChange={e=>ff("segundoNombre",e.target.value)} placeholder="Segundo nombre"/></div>
          <div className="fg"><div className="fl">Primer Apellido *</div><input className="fi" value={f.primerApellido} onChange={e=>ff("primerApellido",e.target.value)} placeholder="Primer apellido"/></div>
          <div className="fg"><div className="fl">Segundo Apellido</div><input className="fi" value={f.segundoApellido} onChange={e=>ff("segundoApellido",e.target.value)} placeholder="Segundo apellido"/></div>
        </div>
        <div className="fgrid g3" style={{marginBottom:10}}>
          <div className="fg"><div className="fl">ID Identificación *</div><input className="fi" value={f.cedula} onChange={e=>ff("cedula",e.target.value)} placeholder="V-00000000"/></div>
          {f.tipo==="cliente"
            ?<div className="fg"><div className="fl">Casillero (auto)</div><input className="fi" value={f.casillero} onChange={e=>ff("casillero",e.target.value)} placeholder="Se genera automático" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}/></div>
            :<div className="fg"><div className="fl">Rol del Sistema</div><select className="fs" value={["H","I"].includes(f.rol)?"":(f.rol||"")} onChange={e=>ff("rol",e.target.value)}><option value="">— Selecciona el rol —</option>{ALL_ROLES.filter(r=>!["H","I"].includes(r.code)).map(r=><option key={r.code} value={r.code}>{r.code} — {r.name}</option>)}</select></div>}
          {f.tipo==="usuario"&&<div className="fg"><div className="fl">Login (usuario)</div><input className="fi" value={f.login||f.email} onChange={e=>ff("login",e.target.value)} placeholder="usuario@email.com o nick"/></div>}
        </div>
        {/* Password para todos los registros */}
        <div className="fgrid g2" style={{marginBottom:10}}>
          <div className="fg"><div className="fl">{initial?.authId?"Nueva contraseña":"Contraseña (acceso al sistema)"}</div>
            <PwInput className="fi" autoComplete="new-password" value={f.password||""} onChange={e=>ff("password",e.target.value)} placeholder={initial?.authId?"Déjala en blanco para no cambiarla":"Mínimo 6 caracteres"}/>
          </div>
          <div className="fg"><div className="fl" style={{fontSize:12,color:initial?.authId?"var(--green)":"var(--t3)"}}>{initial?.authId?"✓ Tiene acceso al sistema":"Sin acceso. Escribe una contraseña para dárselo."}</div></div>
        </div>
        <div className="sdiv">DIRECCIÓN COMPLETA</div>
        <div className="fgrid g2" style={{marginBottom:10}}>
          <div className="fg full"><div className="fl">Dirección *</div><input className="fi" value={f.dir} onChange={e=>ff("dir",e.target.value)} placeholder="Av. Principal, Edif. Centro, Piso 3, Apto 3A"/></div>
          <div className="fg"><div className="fl">Municipio *</div><input className="fi" value={f.municipio} onChange={e=>ff("municipio",e.target.value)}/></div>
          <div className="fg"><div className="fl">Estado / Provincia *</div><input className="fi" value={f.estado} onChange={e=>ff("estado",e.target.value)}/></div>
          <div className="fg"><div className="fl">País *</div><input className="fi" value={f.pais} onChange={e=>ff("pais",e.target.value)}/></div>
          <div className="fg"><div className="fl">Código Postal</div><input className="fi" value={f.cp} onChange={e=>ff("cp",e.target.value)}/></div>
        </div>
        <div className="sdiv">CONTACTO</div>
        <div className="fgrid g3" style={{marginBottom:10}}>
          <div className="fg"><div className="fl">Teléfono 1 *</div><input className="fi" value={f.tel1} onChange={e=>ff("tel1",e.target.value)} placeholder="+58 412 000 0000"/></div>
          <div className="fg"><div className="fl">Teléfono 2</div><input className="fi" value={f.tel2} onChange={e=>ff("tel2",e.target.value)}/></div>
          <div className="fg"><div className="fl">Email *</div><input className="fi" type="email" value={f.email} onChange={e=>ff("email",e.target.value)} placeholder="correo@email.com"/></div>
        </div>
        {emailErr&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:6,padding:"8px 12px",marginBottom:8,color:"#DC2626",fontSize:14,fontWeight:600}}>⚠️ {emailErr}</div>}
        <div className="mft"><button className="btn-s" onClick={onClose}>Cancelar</button><button className="btn-p" onClick={()=>{
          // Validar email duplicado
          const emailLower=(f.email||"").trim().toLowerCase();
          if(emailLower){
            const dup=allClients.find(c=>c.id!==f.id&&(c.email||"").trim().toLowerCase()===emailLower);
            if(dup){setEmailErr(`El email ya está registrado por ${dup.primerNombre} ${dup.primerApellido} (${dup.casillero||dup.id})`);return;}
          }
          if(f.password&&f.password.length<6){setEmailErr("La contraseña debe tener al menos 6 caracteres.");return;}
          if(f.password&&!(f.email||"").trim()&&!(f.login||"").trim()){setEmailErr(f.tipo==="usuario"?"Para dar acceso hace falta un email o un nombre de usuario.":"Para dar acceso al cliente hace falta su email.");return;}
          // Un usuario del sistema necesita un rol de trabajo (no "Cliente")
          if(f.tipo==="usuario"&&(!f.rol||["H","I"].includes(f.rol))){setEmailErr("Selecciona el rol del usuario.");return;}
          setEmailErr("");
          onSave(f);
        }}>Guardar ✅</button></div>
      </div>
    </div>
  );
};


// Lista de conceptos con precio (servicios / gastos adicionales)
const PriceListEditor=({title,items,onSave,placeholder})=>{
  const [nombre,setNombre]=useState("");
  const [precio,setPrecio]=useState("");
  const add=()=>{const n=nombre.trim().toUpperCase();if(!n)return;if(items.some(i=>i.nombre===n)){window.alert("Ya existe.");return;}onSave([...items,{nombre:n,precio:parseFloat(precio)||0}]);setNombre("");setPrecio("");};
  return (
    <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:10}}>{title}</div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <input className="fi" style={{flex:2,minWidth:200}} value={nombre} onChange={e=>setNombre(e.target.value.toUpperCase())} placeholder={placeholder} onKeyDown={e=>e.key==="Enter"&&add()}/>
        <input className="fi" type="number" step="0.01" style={{width:120}} value={precio} onChange={e=>setPrecio(e.target.value)} placeholder="Precio" onKeyDown={e=>e.key==="Enter"&&add()}/>
        <button className="btn-p" onClick={add}>+ Agregar</button>
      </div>
      {items.length===0?<div style={{color:"var(--t3)",fontSize:14}}>Sin conceptos.</div>:
        <table className="ct"><thead><tr><th>Concepto</th><th style={{width:140,textAlign:"right"}}>Precio</th><th style={{width:50}}></th></tr></thead>
          <tbody>{items.map((it,i)=>(
            <tr key={it.nombre}>
              <td style={{fontWeight:600}}>{it.nombre}</td>
              <td style={{textAlign:"right"}}><input className="fi" type="number" step="0.01" style={{width:110,textAlign:"right",fontFamily:"'DM Mono',monospace"}} defaultValue={it.precio}
                onBlur={e=>{const v=parseFloat(e.target.value)||0;if(v!==it.precio)onSave(items.map((x,j)=>j===i?{...x,precio:v}:x));}}/></td>
              <td><button className="btn-d" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>{if(window.confirm(`¿Quitar ${it.nombre}?`))onSave(items.filter((_,j)=>j!==i));}}>✕</button></td>
            </tr>))}</tbody></table>}
    </div>
  );
};
const ListEditor=({title,items,onAdd,onDelete,placeholder,mono})=>{
  const [v,setV]=useState("");
  return (
    <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:10}}>{title}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <input className="fi" style={{flex:1,fontFamily:mono?"'DM Mono',monospace":"inherit",textTransform:"uppercase"}}
          value={v} onChange={e=>setV(e.target.value.toUpperCase())}
          onKeyDown={e=>{if(e.key==="Enter"&&v.trim()){onAdd(v.trim().toUpperCase());setV("");}}}
          placeholder={placeholder}/>
        <button className="btn-p" style={{padding:"6px 14px"}} onClick={()=>{if(v.trim()){onAdd(v.trim().toUpperCase());setV("");}}} >+ Agregar</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {items.map((it,i)=>(
          <div key={i} style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,padding:"4px 10px",fontSize:14}}>
            <span style={{fontFamily:mono?"'DM Mono',monospace":"inherit",fontWeight:600,color:"var(--t1)"}}>{it}</span>
            <span onClick={()=>onDelete(i)} style={{color:"var(--red)",cursor:"pointer",fontSize:16,fontWeight:700,lineHeight:1}}>×</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const TimelineWR=({w,applyStatus,trkCanUpdate,statusAllowed,CU})=>{
  const hist=w.historial||[];
  // build full timeline from statuses
  const stOrder=WR_STATUSES;
  const currentIdx=stOrder.findIndex(s=>s.code===w.status?.code);
  return (
    <div style={{padding:"0 4px"}}>
      {stOrder.map((st,i)=>{
        const done=i<=currentIdx;
        const current=i===currentIdx;
        const entry=hist.find(h=>h.status?.code===st.code);
        return (
          <div key={st.code} style={{display:"flex",gap:12,marginBottom:2,opacity:done?1:.4}}>
            {/* Line */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0}}>
              <div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${current?"var(--navy)":done?"var(--green)":"var(--b1)"}`,background:current?"var(--navy)":done?"var(--green)":"transparent",flexShrink:0,zIndex:1}}/>
              {i<stOrder.length-1&&<div style={{width:2,flex:1,minHeight:14,background:done&&i<currentIdx?"var(--green)":"var(--b1)",marginTop:2}}/>}
            </div>
            <div style={{paddingBottom:8,flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,fontWeight:current?700:600,color:current?"var(--navy)":done?"var(--t1)":"var(--t3)"}}>{st.code} · {st.label}</span>
                {current&&<span style={{fontSize:11,background:"var(--navy)",color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:700}}>ACTUAL</span>}
              </div>
              {entry&&<div style={{fontSize:12,color:"var(--t3)",marginTop:2,fontFamily:"'DM Mono',monospace"}}>{fmtDate(entry.fecha)} {fmtTime(entry.fecha)} · {entry.user}{entry.nota?` · ${entry.nota}`:""}</div>}
              {!entry&&done&&!current&&<div style={{fontSize:12,color:"var(--t3)",marginTop:2,fontFamily:"'DM Mono',monospace"}}>—</div>}
            </div>
            {/* Acción rápida */}
            {trkCanUpdate&&statusAllowed(st)&&!current&&(
              <button onClick={()=>{
                const nota=window.prompt(`Nota para estado "${st.label}" (opcional):`)||"";
                applyStatus(w,st,nota);
              }} style={{alignSelf:"center",fontSize:12,padding:"2px 8px",borderRadius:4,border:"1px solid var(--b1)",background:"var(--bg3)",cursor:"pointer",color:"var(--t2)",flexShrink:0,marginBottom:6}}>
                Aplicar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

const emptyConsol=()=>({
  destino:"", tipoEnvio:"",
  fechaSalida:"", fechaLlegada:"",
  numVuelo:"", awb:"", bl:"",
  notas:"",
  containers:[{tipo:"",largo:"",ancho:"",alto:"",pesoLb:"",sello:"",wr:[],fotos:[]}],
});

// Parse "LxWxH in" / "88×56×48 in" → {l,w,h}. Returns null si no puede.
const parseContainerDim=(dimStr)=>{
  if(!dimStr||typeof dimStr!=="string")return null;
  if(dimStr.toLowerCase().includes("libre"))return null;
  const m=dimStr.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)/);
  return m?{l:m[1],a:m[2],h:m[3]}:null;
};

const emptyPickup=()=>({
  clienteId:"",clienteNombre:"",clienteDir:"",clienteTel:"",
  fecha:"",hora:"",chofer:"",notas:"",
  paquetes:[{descripcion:"",largo:"",ancho:"",alto:"",pesoLb:"",cantidad:1}],
  status:"Pendiente",cotizacion:null,
});

// ─── WEBCAM CAPTURE MODAL ────────────────────────────────────────────────────
// Modal autocontenido para capturar una foto desde la webcam del usuario.
// Props:
//   onCapture(file)  — callback con el File (image/jpeg) cuando el usuario confirma
//   onClose()        — cerrar sin capturar
function WebcamCaptureModal({ onCapture, onClose }){
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready,setReady] = useState(false);
  const [err,setErr] = useState("");
  const [shot,setShot] = useState(null); // {dataUrl, blob}
  const [facing,setFacing] = useState("environment"); // "user" | "environment"

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        // Detener stream previo si lo hay
        if(streamRef.current){
          streamRef.current.getTracks().forEach(t=>t.stop());
          streamRef.current = null;
        }
        const constraints = {
          video: { facingMode: facing, width:{ideal:1280}, height:{ideal:720} },
          audio: false
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if(cancelled){ stream.getTracks().forEach(t=>t.stop()); return; }
        streamRef.current = stream;
        if(videoRef.current){
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(()=>{});
        }
        setReady(true);
        setErr("");
      }catch(e){
        console.error("getUserMedia:", e);
        setErr(e.name==="NotAllowedError" ? "Permiso de cámara denegado. Habilitalo en el navegador e intentá de nuevo." : "No se pudo acceder a la cámara: "+(e.message||e.name||"error"));
        setReady(false);
      }
    })();
    return ()=>{
      cancelled=true;
      if(streamRef.current){
        streamRef.current.getTracks().forEach(t=>t.stop());
        streamRef.current = null;
      }
    };
  },[facing]);

  const capture = ()=>{
    const v = videoRef.current, c = canvasRef.current;
    if(!v || !c) return;
    const w = v.videoWidth || 1280, h = v.videoHeight || 720;
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    c.toBlob(blob=>{
      setShot({ dataUrl, blob });
    }, "image/jpeg", 0.9);
  };

  const retry = ()=> setShot(null);

  const confirm = ()=>{
    if(!shot || !shot.blob) return;
    const filename = `webcam_${Date.now()}.jpg`;
    const file = new File([shot.blob], filename, { type: "image/jpeg" });
    onCapture && onCapture(file);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg2)",borderRadius:12,overflow:"hidden",width:"100%",maxWidth:680,boxShadow:"var(--shadow2)",display:"flex",flexDirection:"column",maxHeight:"90vh"}}>
        {/* Header */}
        <div style={{padding:"14px 18px",borderBottom:"1px solid var(--b1)",background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📸</span> Capturar foto del paquete
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:18,fontWeight:700,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        {/* Body */}
        <div style={{padding:16,flex:1,overflow:"auto",background:"#000"}}>
          {err ? (
            <div style={{background:"rgba(204,34,51,0.15)",color:"#fff",padding:"16px 18px",borderRadius:8,border:"1px solid rgba(204,34,51,0.4)",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>⚠️</div>
              <div style={{fontSize:14,lineHeight:1.5}}>{err}</div>
            </div>
          ) : shot ? (
            <div style={{display:"flex",justifyContent:"center"}}>
              <img src={shot.dataUrl} alt="preview" style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:6,display:"block"}}/>
            </div>
          ) : (
            <div style={{position:"relative",display:"flex",justifyContent:"center",background:"#000",borderRadius:6,overflow:"hidden"}}>
              <video ref={videoRef} playsInline muted autoPlay style={{maxWidth:"100%",maxHeight:"60vh",display:"block",background:"#000"}}/>
              {!ready && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}}>Conectando cámara…</div>
              )}
            </div>
          )}
          <canvas ref={canvasRef} style={{display:"none"}}/>
        </div>
        {/* Footer */}
        <div style={{padding:"12px 18px",borderTop:"1px solid var(--b1)",background:"var(--bg3)",display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
          <div>
            {!shot && !err && (
              <button type="button" className="btn-s" style={{fontSize:12,padding:"6px 10px"}} onClick={()=>setFacing(f=>f==="user"?"environment":"user")}>
                🔄 {facing==="user"?"Cámara trasera":"Cámara frontal"}
              </button>
            )}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-s" onClick={onClose}>Cancelar</button>
            {shot ? (
              <>
                <button className="btn-s" onClick={retry}>↻ Tomar otra</button>
                <button className="btn-p" onClick={confirm}>✅ Usar esta foto</button>
              </>
            ) : (
              <button className="btn-p" disabled={!ready||!!err} onClick={capture} style={!ready||!!err?{opacity:.5,cursor:"not-allowed"}:{}}>
                📸 Capturar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PHOTO GALLERY MODAL ─────────────────────────────────────────────────────
// Visor de todas las fotos de un WR (agrupadas por caja).
// Props:
//   wrId           — id del WR
//   currentUser    — usuario actual (para permiso de borrar)
//   onClose()      — cerrar
function PhotoGalleryModal({ wrId, currentUser, onClose }){
  const [fotos,setFotos] = useState([]);
  const [loading,setLoading] = useState(true);
  const [viewing,setViewing] = useState(null); // foto seleccionada para zoom
  const canDelete = currentUser && Array.isArray(currentUser.perms) && currentUser.perms.includes("borrar_foto");

  const load = async()=>{
    setLoading(true);
    const rows = await dbGetFotosByWR(wrId);
    setFotos(rows);
    setLoading(false);
  };
  useEffect(()=>{ if(wrId) load(); /* eslint-disable-next-line */ },[wrId]);

  const handleDelete = async(foto)=>{
    if(!canDelete) return;
    if(!window.confirm("¿Borrar esta foto? No se puede deshacer.")) return;
    await dbDeleteFoto(foto.id, foto.path);
    await load();
  };

  // Agrupar por cajaIdx
  const grupos = {};
  fotos.forEach(f=>{
    const k = f.cajaIdx ?? 0;
    if(!grupos[k]) grupos[k] = [];
    grupos[k].push(f);
  });
  const cajaKeys = Object.keys(grupos).sort((a,b)=>Number(a)-Number(b));

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg2)",borderRadius:12,overflow:"hidden",width:"100%",maxWidth:900,boxShadow:"var(--shadow2)",display:"flex",flexDirection:"column",maxHeight:"92vh"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid var(--b1)",background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📷</span> Fotos del WR {wrId}
            {!loading && <span style={{background:"var(--gold)",fontSize:12,padding:"2px 8px",borderRadius:10}}>{fotos.length}</span>}
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:18,fontWeight:700,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        <div style={{padding:16,flex:1,overflow:"auto"}}>
          {loading ? (
            <div style={{textAlign:"center",padding:"40px 16px",color:"var(--t3)"}}>Cargando fotos…</div>
          ) : fotos.length===0 ? (
            <div style={{textAlign:"center",padding:"40px 16px",color:"var(--t3)",fontSize:14}}>
              <div style={{fontSize:40,marginBottom:10}}>📭</div>
              Este WR aún no tiene fotos cargadas.
            </div>
          ) : (
            cajaKeys.map(k=>(
              <div key={k} style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:1,marginBottom:8,borderBottom:"1px solid var(--b1)",paddingBottom:5}}>
                  📦 Caja {Number(k)+1} <span style={{color:"var(--t3)",fontWeight:500,marginLeft:6}}>({grupos[k].length} {grupos[k].length===1?"foto":"fotos"})</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:10}}>
                  {grupos[k].map(foto=>(
                    <div key={foto.id} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid var(--b1)",background:"var(--bg4)",cursor:"pointer"}} onClick={()=>setViewing(foto)}>
                      <img src={foto.url} alt={foto.filename} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      {canDelete && (
                        <button type="button" title="Borrar foto" onClick={e=>{e.stopPropagation();handleDelete(foto);}} style={{position:"absolute",top:5,right:5,width:24,height:24,borderRadius:"50%",border:"none",background:"rgba(204,34,51,0.95)",color:"#fff",fontSize:15,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                      )}
                      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(0,0,0,0.75), transparent)",color:"#fff",fontSize:10,padding:"10px 5px 4px",textAlign:"center",fontWeight:600}}>
                        {foto.source==='webcam'?'📸':'📁'} {new Date(foto.createdAt).toLocaleDateString("es-VE")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Zoom viewer */}
      {viewing && (
        <div onClick={()=>setViewing(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,cursor:"zoom-out"}}>
          <img src={viewing.url} alt={viewing.filename} style={{maxWidth:"95%",maxHeight:"95%",borderRadius:6,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}/>
          <button onClick={e=>{e.stopPropagation();setViewing(null);}} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:22,fontWeight:700,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function ENEXSystem(){
  // ── LOGIN STATE ────────────────────────────────────────────────────────────
  const [currentUser,setCurrentUser]=useState(null);
  // Sesión de Supabase Auth: contraseñas cifradas y login en el servidor
  const [authUid,setAuthUid]=useState(null);
  const [authReady,setAuthReady]=useState(false);
  const [recovery,setRecovery]=useState(false);   // llegó del enlace "olvidé mi contraseña"
  const [loginBusy,setLoginBusy]=useState(false);
  const [loginInfo,setLoginInfo]=useState("");
  const [pwModal,setPwModal]=useState(null);       // cambiar mi contraseña {a,b,err,ok}
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setAuthUid(data.session?.user?.id||null);setAuthReady(true);});
    const {data:sub}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="PASSWORD_RECOVERY")setRecovery(true);
      setAuthUid(session?.user?.id||null);
    });
    return()=>sub.subscription.unsubscribe();
  },[]);
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginErr,setLoginErr]=useState("");

  const [tab,setTab]=useState("dashboard");
  // Dashboard: tabla de WR ampliada (oculta stats y panel derecho). Reemplaza la
  // antigua pantalla "Warehouse Receipt", que era la misma tabla a pantalla completa.
  const [dashWide,setDashWide]=useState(false);
  // Loading Master: agrupa Consolidación, Recepción en Almacén y Estatus de guías
  // en una sola opción del menú, con sub-pestañas.
  const [lmTab,setLmTab]=useState("master"); // "master" | "status" | "recepcion"
  const [lmFilter,setLmFilter]=useState("todas"); // filtro de las tarjetas del Master
  const [lmSearch,setLmSearch]=useState(""); // búsqueda de la pestaña Status
  // Alertas — faltantes y sobrantes: se detectan en Recepción y se resuelven aquí.
  const [alTab,setAlTab]=useState("abiertas");   // "abiertas" | "historial"
  const [alFiltro,setAlFiltro]=useState("todos"); // "todos" | "faltantes" | "sobrantes"
  const [alSearch,setAlSearch]=useState("");
  const [alModal,setAlModal]=useState(null);      // {w, accion}
  const [alForm,setAlForm]=useState({montoCliente:"",montoTransportista:"",referencia:"",nota:""});
  const [wrList,setWrList]=useState(WR_INIT);
  const [clients,setClients]=useState(CLIENTS_INIT);
  const [selWR,setSelWR]=useState(null);
  const [editWR,setEditWR]=useState(null);
  const [showNewWR,setShowNewWR]=useState(false);
  const [showNewCl,setShowNewCl]=useState(false);
  const [showEditCl,setShowEditCl]=useState(null);
  const [showStatModal,setShowStatModal]=useState(null); // {key, label, rows}
  // Forzar Estado (override) — Admin/Gerencia. {wr, codigoDestino, motivo}
  const [overrideModal,setOverrideModal]=useState(null);
  // Timeline rápida (acceso desde fila sin abrir WR Modal completo). Guarda el WR.
  const [timelineWR,setTimelineWR]=useState(null);
  const [searchParam,setSearchParam]=useState("Tracking");
  const [search,setSearch]=useState("");
  const [filterSt,setFilterSt]=useState("all");
  // Default vacío: el módulo abre en blanco y obliga a elegir Clientes / Usuarios / Todos
  const [clFilter,setClFilter]=useState("");
  const [dimOpen,setDimOpen]=useState(null);
  // Atajo a Reempaque / Cargo Release en ventana, sin abandonar la pantalla actual
  const [quickTab,setQuickTab]=useState(null);
  const [unitL,setUnitL]=useState("in");
  const [unitW,setUnitW]=useState("lb");
  const [sortCol,setSortCol]=useState("fecha");
  const [sortDir,setSortDir]=useState("desc");
  const [page,setPage]=useState(1);
  const [scanV,setScanV]=useState("");
  const [scanLog,setScanLog]=useState([]); // {tracking, carrier, ts, registered}
  const [scanCarrier,setScanCarrier]=useState("");

  // ── NUMERACIÓN Y ETIQUETAS ───────────────────────────────────────────────
  const [wrNumTipo,setWrNumTipo]=useState(3);
  const [wrSecInicio,setWrSecInicio]=useState(1);
  const [consolNumTipo,setConsolNumTipo]=useState(3);
  const [consolSecInicio,setConsolSecInicio]=useState(1);
  const [labelWRTipo,setLabelWRTipo]=useState(1);   // 1=4×6 Básica, 2=4×6 Completa, 3=4×2 Básica, 4=4×2 Completa
  const [labelCSATipo,setLabelCSATipo]=useState(1); // 1=4×6 Grande, 2=4×2 Compacta
  const [empresaNombre,setEmpresaNombre]=useState("ENEX");
  const [empresaSlug,setEmpresaSlug]=useState("1N");

  // ── CONFIGURACIÓN — listas editables ──────────────────────────────────────
  const [SEND_TYPES,setSendTypes]=useState(SEND_TYPES_INIT);
  const [PAY_TYPES,setPayTypes]=useState(PAY_TYPES_INIT);
  const [CHARGES_OPT,setChargesOpt]=useState([]); // antiguo (solo nombres)
  // Catálogo con precio: servicios y gastos adicionales
  const [SERVICIOS_CAT,setServiciosCat]=useState([]);
  const [GASTOS_CAT,setGastosCat]=useState([]);
  const [catCargado,setCatCargado]=useState(false);
  const [CONTAINER_TYPES,setContainerTypes]=useState([]);
  const [COUNTRIES,setCountries]=useState([]);

  // ── REGISTRO DE ACTIVIDAD ────────────────────────────────────────────────
  const [actLog,setActLog]=useState([]);
  const [etqSearch,setEtqSearch]=useState("");
  const [etqTipo,setEtqTipo]=useState("wr"); // "wr" | "guia"
  const [selRole,setSelRole]=useState(null);
  // Permisos por rol editables desde Roles & Permisos (guardados en configuracion.role_perms)
  const [rolePerms,setRolePerms]=useState(DEFAULT_ROLE_PERMS);
  const [roleDraft,setRoleDraft]=useState({}); // cambios sin guardar {rol:[perms]}
  const [roleSaving,setRoleSaving]=useState(false);
  useEffect(()=>{
    if(!authUid)return;
    dbGetConfig('role_perms').then(v=>{
      if(v&&typeof v==="object"&&!Array.isArray(v)){
        setRolePerms({...DEFAULT_ROLE_PERMS,...Object.fromEntries(Object.entries(v).filter(([k,arr])=>DEFAULT_ROLE_PERMS[k]&&Array.isArray(arr)))});
      }
    }).catch(e=>console.error("role_perms:",e));
  },[authUid]);
  const [ecSearch,setEcSearch]=useState("");
  const [ecCliente,setEcCliente]=useState(null);
  const [ecResults,setEcResults]=useState([]);
  // Estado de Cuenta por grupo: además de un cliente, se puede elegir un agente,
  // una oficina o un autónomo y ver los WR de todos los clientes bajo su dominio.
  const [ecModo,setEcModo]=useState("cliente"); // "cliente" | "agente" | "oficina" | "autonomo"
  const [ecGrupo,setEcGrupo]=useState(null);    // {tipo,id,nombre,sub,email,tel}
  const [ecFiltro,setEcFiltro]=useState("todos");
  const [ecMes,setEcMes]=useState("");
  const [ecAnio,setEcAnio]=useState("");
  const [consolList,setConsolList]=useState([]);
  const [showNewConsol,setShowNewConsol]=useState(false);
  const [editConsolId,setEditConsolId]=useState(null);
  // Estado de módulos Reempaque y Recepción en Destino (deben declararse arriba
  // con el resto de hooks para cumplir las reglas de React).
  const [rpqSel,setRpqSel]=useState([]);
  const [rpqSearch,setRpqSearch]=useState("");
  // Modal de Reempaque scopeado a un cliente (desde Estado de Cuenta)
  const [rpqCliModal,setRpqCliModal]=useState(null); // null | {cliente, selectedIds:[]}
  // Bloque F — Histórico de Reempaques (oculto por defecto + filtros)
  const [rpqHistOpen,setRpqHistOpen]=useState(false);
  const [rpqHistCliente,setRpqHistCliente]=useState("");
  const [rpqHistDesde,setRpqHistDesde]=useState("");
  const [rpqHistHasta,setRpqHistHasta]=useState("");
  const [rdScan,setRdScan]=useState("");
  const [rdSearch,setRdSearch]=useState("");
  const [rdTab,setRdTab]=useState("pendientes"); // pendientes | archivadas
  const [rdSelGuia,setRdSelGuia]=useState(""); // id de la guía seleccionada para recepción
  // Filtros para guías archivadas (búsqueda histórico)
  const [rdArchSearch,setRdArchSearch]=useState("");
  const [rdArchTipo,setRdArchTipo]=useState("");
  const [rdArchFrom,setRdArchFrom]=useState("");
  const [rdArchTo,setRdArchTo]=useState("");
  // Guía archivada actualmente abierta en el modal de vista detallada
  const [rdArchView,setRdArchView]=useState(null);

  // Modales de fotos del paquete (Nuevo WR)
  const [webcamOpen,setWebcamOpen]=useState(null);  // null | {cajaIdx}
  const [photoGalleryOpen,setPhotoGalleryOpen]=useState(null); // null | {wrId}
  // Cargo Release (egresos)
  const [cargoReleases,setCargoReleases]=useState([]);
  const [crModal,setCrModal]=useState(null); // null | {wrIds:[], agenteCarga, contacto, documento, vehiculo, notas, editId?}
  // Multi-selección y filtros del módulo Cargo Release (estilo Reempaque)
  const [crSel,setCrSel]=useState([]); // ids de WR seleccionados para egreso múltiple
  const [crHistOpen,setCrHistOpen]=useState(false);
  const [crHistCliente,setCrHistCliente]=useState("");
  const [crHistDesde,setCrHistDesde]=useState("");
  const [crHistHasta,setCrHistHasta]=useState("");
  // Cargo Release individual (desde Estado de Cuenta) — modal con 4 campos
  const [crIndivModal,setCrIndivModal]=useState(null); // null | {wrs:[...], nombre, id, empresa, notas}
  const [crCliModal,setCrCliModal]=useState(null); // selector de WR del cliente para Cargo Release
  // Recibo de cargo release individual (para imprimir)
  const [crIndivRecibo,setCrIndivRecibo]=useState(null); // null | {cr, wr, cliente}
  const [crSearch,setCrSearch]=useState("");
  const [crPrint,setCrPrint]=useState(null); // release a imprimir
  // Delivery Notes (entregas)
  const [deliveryNotes,setDeliveryNotes]=useState([]);
  // Usuario de oficina: solo ve la carga de su sucursal. Se guarda la lista completa
  // aparte para poder recalcular cuando cambian clientes, oficinas o despachos.
  const wrAllRef=useRef(null);
  const [wrLoadTick,setWrLoadTick]=useState(0);
  const [dnModal,setDnModal]=useState(null); // null | {wrIds, consignatario, clienteId, receptorNombre, receptorDocumento, receptorTelefono, direccionEntrega, metodoEntrega, transportista, notas, editId?}
  const [dnSearch,setDnSearch]=useState("");
  const [dnTipoFiltro,setDnTipoFiltro]=useState("todos"); // "todos" | "entrega" | "despacho"
  const [dnPrint,setDnPrint]=useState(null); // nota a imprimir
  const [reciboVer,setReciboVer]=useState(null); // recibo en vista previa
  // Entregas por guía
  const [dnVista,setDnVista]=useState("guias"); // "guias" | "historial"
  const [dnGuiaSel,setDnGuiaSel]=useState(null); // id de guía abierta
  const [dnBuscar,setDnBuscar]=useState("");
  const [dnAbiertos,setDnAbiertos]=useState({}); // bloques desplegados {key:true}
  const [dnQuick,setDnQuick]=useState(null); // ventana de confirmar entrega/despacho
  const [labelTipo,setLabelTipo]=useState("WR");
  const [openDays,setOpenDays]=useState({});
  const [actFilter,setActFilter]=useState("");
  const [cfgTab,setCfgTab]=useState("numeracion");
  const [cfgSelPais,setCfgSelPais]=useState(0);
  // Notas legales por país: {_default:"...", "Venezuela 🇻🇪":"...", ...}
  const [notasLegales,setNotasLegales]=useState({});
  const [notaDraft,setNotaDraft]=useState(null); // {pais, texto} mientras se edita
  useEffect(()=>{
    if(!authUid)return;
    dbGetConfig('notas_legales').then(v=>{if(v&&typeof v==="object"&&!Array.isArray(v))setNotasLegales(v);}).catch(e=>console.error("notas_legales:",e));
  },[authUid]);
  const [cfgNewCity,setCfgNewCity]=useState("");
  const [cfgNewPais,setCfgNewPais]=useState("");
  const [cfgNewCont,setCfgNewCont]=useState({code:"",name:"",dim:"",maxLb:""});
  const [cfgEditContIdx,setCfgEditContIdx]=useState(null);
  const [agentes,setAgentes]=useState([]);
  const [oficinas,setOficinas]=useState([]);
  const [showNewAgente,setShowNewAgente]=useState(false);
  const [showNewOficina,setShowNewOficina]=useState(false);
  const [editAgente,setEditAgente]=useState(null);
  const [verAgente,setVerAgente]=useState(null);
  const [editOficina,setEditOficina]=useState(null);
  const [agForm,setAgForm]=useState({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});
  const [ofForm,setOfForm]=useState({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});
  const [tarifas,setTarifas]=useState([]);
  const [showNewTarifa,setShowNewTarifa]=useState(false);
  const [editTarifa,setEditTarifa]=useState(null);
  const [tafGrupo,setTafGrupo]=useState("");      // "" predeterminadas | "agente:<id>" | "autonomo:<id>" | "cliente:<id>"
  const [tafGrupoQ,setTafGrupoQ]=useState("");
  const [tafQ,setTafQ]=useState("");
  const [tafTipoFil,setTafTipoFil]=useState("");
  const [tafForm,setTafForm]=useState({paisOrig:"",ciudadOrig:"",paisDest:"",ciudadDest:"",tipoEnvio:"",porLb:"",porFt3:"",min:"",moneda:"USD"});
  const [tarifaTipoTab,setTarifaTipoTab]=useState("aereo");
  const [showNewFactura,setShowNewFactura]=useState(false);
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [wrf,setWrf]=useState(emptyWRF(PAY_TYPES[0]));
  const [clientSearch,setClientSearch]=useState("");
  const [clientResults,setClientResults]=useState([]);
  const [showLabels,setShowLabels]=useState(null);
  const [showConsolLabels,setShowConsolLabels]=useState(null); // {guia, containers, remitente}
  const [trkSearch,setTrkSearch]=useState("");
  const [trkSelected,setTrkSelected]=useState(null);
  const [trkMassivo,setTrkMassivo]=useState(false);
  const [trkMassIds,setTrkMassIds]=useState("");
  const [trkMassStatus,setTrkMassStatus]=useState(null);
  const [trkMassNota,setTrkMassNota]=useState("");
  const [trkMassResult,setTrkMassResult]=useState(null);
  const [chatConv,setChatConv]=useState("general");
  const [chatMsg,setChatMsg]=useState("");
  const [chatMsgs,setChatMsgs]=useState({general:[],operaciones:[],ventas:[]});
  const [pickupList,setPickupList]=useState([]);
  const [showNewPickup,setShowNewPickup]=useState(false);
  const [pickupClientSearch,setPickupClientSearch]=useState("");
  const [pickupClientResults,setPickupClientResults]=useState([]);
  const CALC_FORM_EMPTY={largo:"",ancho:"",alto:"",pesoLb:"",unitDim:"in",origPais:"",origCiudad:"",destPais:"",destCiudad:"",tipoEnvio:""};
  const [calcForm,setCalcForm]=useState(CALC_FORM_EMPTY);
  const [contabTab,setContabTab]=useState("porguia");
  const [cuadreSel,setCuadreSel]=useState(null);   // cuenta abierta {tipo,id,nombre}
  const [ctaQ,setCtaQ]=useState("");
  const [ctaFil,setCtaFil]=useState("");           // "" | cliente | agente | autonomo
  const [ctaSoloSaldo,setCtaSoloSaldo]=useState("con");   // con | sin | todas
  const [ctaMon,setCtaMon]=useState("USD");
  const [ctaDesde,setCtaDesde]=useState("");
  const [ctaHasta,setCtaHasta]=useState("");
  const hoyISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
  const [cajaDesde,setCajaDesde]=useState(hoyISO());
  const [cajaHasta,setCajaHasta]=useState(hoyISO());
  const [cajaUsr,setCajaUsr]=useState("");
  const [cuadreMarca,setCuadreMarca]=useState({}); // comisiones marcadas para acreditar
  const [cuadrePago,setCuadrePago]=useState(null); // {monto,moneda,tipoPago,referencia}
  const [facGuiaSel,setFacGuiaSel]=useState(null);   // guía abierta en Facturación › Por guía
  const [facGuiaBuscar,setFacGuiaBuscar]=useState("");
  const [facGuiaVista,setFacGuiaVista]=useState("pendientes"); // "pendientes" | "historial"
  const [facturas,setFacturas]=useState([]);
  const facturasAll=facturas;
  const [pagos,setPagos]=useState([]);
  const [cobroModal,setCobroModal]=useState(null);
  const [remCampo,setRemCampo]=useState(""); // campo del remitente que se está escribiendo (para sugerir clientes) // cobro a un pagador sobre varias facturas
  const pagosAll=pagos;
  // Facturación v2 (Lote 6)
  const [facModal,setFacModal]=useState(null);   // null | factura en edición
  const [facPrint,setFacPrint]=useState(null);   // factura a imprimir
  const [pagoModal,setPagoModal]=useState(null); // null | {facturaId, ...}
  const [ncModal,setNcModal]=useState(null);     // null | {facturaOrigen, monto, motivo}
  const [facFilter,setFacFilter]=useState({q:"",status:"",tipo:"",moneda:"",receptorTipo:"",receptorKey:"",receptorNom:"",recQ:""});
  const [facRecAbierto,setFacRecAbierto]=useState(false);
  const [nextInvoiceNum,setNextInvoiceNum]=useState(1); // secuencial 7 dígitos
  const [cf,setCf]=useState(emptyConsol());
  const [puf,setPuf]=useState(emptyPickup());
  const [contScanVal,setContScanVal]=useState({});
  const [contScanErr,setContScanErr]=useState({});
  // Reset calculadora al entrar al tab (no persiste entre visitas)
  useEffect(()=>{ if(tab==="calculadora") setCalcForm(CALC_FORM_EMPTY); /* eslint-disable-next-line */ },[tab]);
  // Reset Estado de Cuenta al entrar al tab (búsqueda y filtros en blanco)
  useEffect(()=>{
    if(tab==="estadocuenta"){
      setEcSearch("");setEcCliente(null);setEcResults([]);
      setEcFiltro("todos");setEcMes("");setEcAnio("");
    }
  /* eslint-disable-next-line */
  },[tab]);
  // Reset Impresión al entrar al tab (tipo y búsqueda en blanco)
  useEffect(()=>{
    if(tab==="etiquetas"){
      setEtqTipo("wr");
      setEtqSearch("");
    }
  /* eslint-disable-next-line */
  },[tab]);
  // Cierra modales que pudieran haber quedado abiertos al cambiar de módulo
  useEffect(()=>{
    setCrModal(null);
    setCrIndivModal(null);
    setCrPrint(null);
    setDnModal(null);
    setDnPrint(null);
    setCrSel([]);
    // Clientes & Usuarios: al entrar/abandonar, volver al estado en blanco con selector
    if(tab==="clients") setClFilter("");
  /* eslint-disable-next-line */
  },[tab]);
  // ── SUPABASE: cargar datos al iniciar sesión ─────────────────────────────
  useEffect(()=>{
    if(!authUid)return;
    const load=async()=>{
      const [cls,wrs,ags,ofs,tfs,cons,acts,scans,crs,dns,facs,pgs,sendT,payT,chargesT,contT,countriesT,
             wrNumT,wrSecT,consolNumT,consolSecT,empSlugT,labelWRT,labelCsaT,facSecT]=await Promise.all([
        dbGetClientes(),dbGetWR(),dbGetAgentes(),dbGetOficinas(),
        dbGetTarifas(),dbGetConsolidaciones(),dbGetActividad(),dbGetScanLog(),dbGetCargoReleases(),dbGetDeliveryNotes(),
        dbGetFacturas(),dbGetPagos(),
        dbGetConfig('send_types'),dbGetConfig('pay_types'),dbGetConfig('charges'),
        dbGetConfig('container_types'),dbGetConfig('countries'),
        dbGetConfig('wr_num_tipo'),dbGetConfig('wr_sec_inicio'),
        dbGetConfig('consol_num_tipo'),dbGetConfig('consol_sec_inicio'),
        dbGetConfig('empresa_slug'),dbGetConfig('label_wr_tipo'),dbGetConfig('label_csa_tipo'),
        dbGetConfig('factura_sec_next'),
      ]);
      if(cls.length>0)setClients(cls);
      // Usuario de la sesión: el registro enlazado a la cuenta
      {const u=cls.find(c=>c.authId===authUid&&c.activo!==false);
       if(u)setCurrentUser(u);
       else{await supabase.auth.signOut();setLoginErr("Esta cuenta no tiene acceso al sistema.");setAuthUid(null);}}
      if(wrs.length>0){
        // Mapeo de códigos viejos → nuevos (migración automática al cargar)
        const OLD_MAP={"1":"1","2":"1","2.1":"2","2.2":"3","2.3":"3",
          "3":"3","4":"4","5":"5","6":"6","6.1":"7","6.2":"8",
          "7":"9","7.1":"10","8":"13","9":"13","9.1":"14",
          "10":"17","10.1":"18","10.2":"19","11":"20",
          "12":"21","12C":"23","12P":"22"};
        const normalized=wrs.map(w=>{
          if(!w.status)return{...w,status:WR_STATUSES[0]};
          const st=WR_STATUSES.find(s=>s.code===w.status.code); // código ya es nuevo
          if(st)return{...w,status:st}; // actualizar label/cls con la definición nueva
          const newCode=OLD_MAP[w.status.code]||"1";
          return{...w,status:WR_STATUSES.find(s=>s.code===newCode)||WR_STATUSES[0]};
        });
        setWrList(normalized);
        wrAllRef.current=null;
        setWrLoadTick(t=>t+1);
      }
      if(ags.length>0)setAgentes(ags);
      if(ofs.length>0)setOficinas(ofs);
      if(tfs.length>0)setTarifas(tfs);
      if(cons.length>0)setConsolList(cons);
      if(acts.length>0)setActLog(acts);
      if(scans.length>0)setScanLog(scans);
      if(crs&&crs.length>0)setCargoReleases(crs);
      if(dns&&dns.length>0)setDeliveryNotes(dns);
      if(facs&&facs.length>0){
        setFacturas(facs);
        // Recalcular siguiente número como max(numero)+1 (defensivo: si el config quedó atrás)
        const maxN=facs.reduce((m,f)=>Math.max(m,f.numero||0),0);
        setNextInvoiceNum(Math.max(maxN+1, parseInt(facSecT)||1));
      } else if(facSecT){
        setNextInvoiceNum(parseInt(facSecT)||1);
      }
      if(pgs&&pgs.length>0)setPagos(pgs);
      if(sendT&&sendT.length>0){
        setSendTypes(sendT);
        // La calculadora sí queda con el primer tipo cargado por conveniencia.
        // El embarque (cf) NO se autocompleta — debe quedar vacío para que el usuario elija.
        setCalcForm(p=>({...p,tipoEnvio:p.tipoEnvio||sendT[0]}));
      }
      if(payT&&payT.length>0)setPayTypes(payT);
      if(chargesT&&chargesT.length>0)setChargesOpt(chargesT);
      {const [sv,gs]=await Promise.all([dbGetConfig('servicios_cat'),dbGetConfig('gastos_cat')]);
       const norm=a=>Array.isArray(a)?a.map(x=>typeof x==="string"?{nombre:x,precio:0}:{nombre:String(x.nombre||""),precio:parseFloat(x.precio)||0}).filter(x=>x.nombre):[];
       setServiciosCat(norm(sv));
       setGastosCat(Array.isArray(gs)?norm(gs):norm(chargesT));
       setCatCargado(true);}
      if(contT&&contT.length>0)setContainerTypes(contT);
      if(countriesT&&countriesT.length>0)setCountries(countriesT);
      if(wrNumT)setWrNumTipo(wrNumT);
      if(wrSecT)setWrSecInicio(wrSecT);
      if(consolNumT)setConsolNumTipo(consolNumT);
      if(consolSecT)setConsolSecInicio(consolSecT);
      if(empSlugT)setEmpresaSlug(empSlugT);
      if(labelWRT)setLabelWRTipo(Math.min(4,Math.max(1,parseInt(labelWRT)||1)));
      // Guía consolidada ahora solo tiene 2 tipos; normalizar si había 3 o 4 guardado
      if(labelCsaT){const n=parseInt(labelCsaT)||1;setLabelCSATipo(n>=2?2:1);}
    };
    load().catch(async e=>{
      console.error("load:",e);
      setLoginErr("No se pudieron cargar los datos. Vuelve a entrar.");
      try{await supabase.auth.signOut();}catch{}
      setAuthUid(null);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authUid]);

  // ── LOGIN HANDLER ──────────────────────────────────────────────────────────
  const doLogin=async()=>{
    const quien=loginEmail.trim();
    if(!quien||!loginPass){setLoginErr("Escribe tu email o usuario y tu contraseña");return;}
    setLoginBusy(true);setLoginErr("");setLoginInfo("");
    try{
      const email=await resolverLogin(quien);
      if(!email){setLoginErr("Usuario o contraseña incorrectos");return;}
      const {error}=await supabase.auth.signInWithPassword({email,password:loginPass});
      if(error){setLoginErr(/confirm/i.test(error.message)?"La cuenta no está confirmada":"Usuario o contraseña incorrectos");return;}
      setLoginPass("");
    }catch{setLoginErr("No se pudo conectar. Inténtalo de nuevo.");}
    finally{setLoginBusy(false);}
  };
  // Tras guardar un registro: crea o actualiza su cuenta de acceso (clave cifrada en Supabase Auth)
  const sincronizarCuenta=async(rec,password,anterior=null)=>{
    const tieneCuenta=!!anterior?.authId;
    const cambioId=anterior&&((anterior.email||"")!==(rec.email||"")||(anterior.login||"")!==(rec.login||""));
    if(!password&&!(tieneCuenta&&cambioId))return;
    const r=await cuentaGuardar(rec.id,password||"");
    if(r?.ok===false){window.alert(`Datos guardados, pero el acceso no se pudo ${tieneCuenta?"actualizar":"crear"}: ${r.error}`);return;}
    if(r?.creada)setClients(p=>p.map(c=>c.id===rec.id?{...c,authId:"(nueva)"}:c));
    logAction(tieneCuenta?(password?"Cambió contraseña de":"Actualizó acceso de"):"Creó acceso para",`${rec.id} — ${r?.email||""}`);
  };
  const doOlvide=async()=>{
    const quien=loginEmail.trim();
    if(!quien){setLoginErr("Escribe tu email o usuario y vuelve a pulsar «¿Olvidaste tu contraseña?»");return;}
    setLoginErr("");setLoginInfo("");
    const email=await resolverLogin(quien);
    if(!email){setLoginInfo("Si la cuenta existe, recibirás un correo para crear una nueva contraseña.");return;}
    if(email.endsWith("@usuarios.enex.app")){setLoginInfo("Tu usuario no tiene email: pide al administrador que te asigne una nueva contraseña.");return;}
    await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
    setLoginInfo("Si la cuenta existe, recibirás un correo para crear una nueva contraseña.");
  };
  const cambiarMiClave=async(nueva)=>{
    const {error}=await supabase.auth.updateUser({password:nueva});
    return error?(/same|different/i.test(error.message)?"La nueva contraseña debe ser distinta de la actual":"No se pudo cambiar la contraseña"):null;
  };

  const doLogout=async()=>{
    try{await supabase.auth.signOut();}catch{}
    window.location.reload();
  };

  // ── LOGIN GATE ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const alc=crearAlcance({u:currentUser,clients,oficinas,deliveryNotes,countries:COUNTRIES,rolePerms});
    if(!alc)return;
    setWrList(prev=>{
      if(!wrAllRef.current)wrAllRef.current=prev;           // primera vez: lista completa
      const m=new Map(wrAllRef.current.map(w=>[w.id,w]));
      prev.forEach(w=>m.set(w.id,w));                         // conservar cambios recientes
      wrAllRef.current=[...m.values()];
      return wrAllRef.current.filter(alc.wrOk);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser?.id,wrLoadTick,deliveryNotes,clients,oficinas,COUNTRIES,rolePerms]);

  // Recuperación de contraseña (llegó desde el enlace del correo)
  if(recovery)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--navy)"}}>
      <style>{S}</style>
      <div style={{background:"white",borderRadius:16,padding:40,width:360,boxShadow:"0 8px 40px rgba(0,0,0,.3)"}}>
        <div style={{textAlign:"center",fontSize:20,fontWeight:800,color:"var(--navy)",marginBottom:16}}>Nueva contraseña</div>
        <form onSubmit={async e=>{e.preventDefault();const a=e.target.a.value,b=e.target.b.value;
          if(a.length<6){setLoginErr("Mínimo 6 caracteres");return;}if(a!==b){setLoginErr("Las contraseñas no coinciden");return;}
          const err=await cambiarMiClave(a);if(err){setLoginErr(err);return;}setLoginErr("");setRecovery(false);}}
          style={{display:"flex",flexDirection:"column",gap:12}}>
          <PwInput className="fi" name="a" placeholder="Nueva contraseña (mínimo 6)"/>
          <PwInput className="fi" name="b" placeholder="Repite la contraseña"/>
          {loginErr&&<div style={{color:"var(--red)",fontSize:14,textAlign:"center"}}>{loginErr}</div>}
          <button className="btn-p" type="submit">Guardar y entrar</button>
        </form>
      </div>
    </div>
  );
  if(!currentUser&&(!authReady||authUid))return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--navy)",color:"#fff",fontFamily:"Arial,Helvetica,sans-serif",fontSize:16}}>
      <style>{S}</style>
      Cargando…
    </div>
  );
  if(!currentUser)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--navy)"}}>
      <style>{S}</style>
      <div style={{background:"white",borderRadius:16,padding:40,width:340,boxShadow:"0 8px 40px rgba(0,0,0,.3)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:30,fontWeight:800,color:"var(--navy)"}}>ENEX</div>
          <div style={{fontSize:15,color:"var(--t3)"}}>International Courier — Sistema</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input className="fi" placeholder="Email o usuario" autoComplete="username" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{textTransform:"none"}}/>
          <PwInput className="fi" autoComplete="current-password" placeholder="Contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          {loginErr&&<div style={{color:"var(--red)",fontSize:14,textAlign:"center"}}>{loginErr}</div>}
          {loginInfo&&<div style={{color:"var(--green)",fontSize:14,textAlign:"center"}}>{loginInfo}</div>}
          <button className="btn-p" onClick={doLogin} disabled={loginBusy} style={{marginTop:8}}>{loginBusy?"Entrando…":"Ingresar"}</button>
          <button type="button" onClick={doOlvide} style={{background:"none",border:"none",color:"var(--navy)",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>¿Olvidaste tu contraseña?</button>
        </div>
      </div>
    </div>
  );

  // ── USE currentUser INSTEAD OF CU FROM HERE ON ──────────────────────────────
  const logAction=(action,detail="")=>{
    setActLog(p=>[{ts:new Date(),user:currentUser.id||"admin",role:currentUser.rol,action,detail},...p.slice(0,199)]);
    dbLogActividad(currentUser.id||"U-001",currentUser.rol,action,detail);
  };

  // El Administrador (A) siempre tiene todo, para que nadie quede fuera del sistema.
  const hasPerm=p=>currentUser.rol==="A"||(rolePerms[currentUser.rol]||[]).includes(p);
  const canEdit=hasPerm("crear_wr")||hasPerm("editar_wr");
  // Al crear clientes, quedan bajo el dominio de quien los crea (agente, vendedor o autónomo)
  const presetDominio=()=>{
    const u=currentUser;
    if(u.rol==="E")return {clienteTipo:"agente",agenteId:u.agenteId||"",vendedorId:""};
    if(u.rol==="E1")return {clienteTipo:"vendedor_agente",agenteId:u.agenteId||"",vendedorId:u.id};
    if(u.rol==="F")return {clienteTipo:"autonomo",autonomoId:u.id};
    return {};
  };
  // Clientes que puede ver este usuario (externos: solo los suyos y los de su carga)
  const alcanceUsr=crearAlcance({u:currentUser,clients,oficinas,deliveryNotes,countries:COUNTRIES,rolePerms});
  const clientesVisibles=(()=>{
    if(!alcanceUsr)return clients;
    const enCarga=new Set(wrList.map(w=>cliDeWRCon(w,clients)?.id).filter(Boolean));
    return clients.filter(c=>c.id===currentUser.id||alcanceUsr.clienteOk(c)||enCarga.has(c.id));
  })();
  // Nota legal según el país de origen del WR (o la predeterminada)
  const notaLegalWR=w=>{
    const t=(w&&notasLegales[w.origCountry])||notasLegales._default||NOTA_LEGAL_DEFAULT;
    return String(t).split("{EMPRESA}").join(empresaNombre||"");
  };
  const canAdmin=currentUser.rol==="A";
  const canStatus=hasPerm("status_origen")||hasPerm("status_destino")||["A","B","C"].includes(currentUser.rol);

  const handleSort=col=>{if(sortCol===col)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortCol(col);setSortDir("desc");}setSortCol(col);};
  const handleDimToggle=id=>setDimOpen(p=>p===id?null:id);

  // Filter WR by search param
  const filteredWR=wrList.filter(w=>{
    if(!w.status)return false;
    const q=search.toLowerCase().trim();
    const ms=filterSt==="all"||w.status.code===filterSt;
    if(!q)return ms;
    let match=false;
    switch(searchParam){
      case "N° WR":        match=w.id.toLowerCase().includes(q);break;
      case "Consignatario":match=(w.consignee||"").toLowerCase().includes(q);break;
      case "Casillero":    match=(w.casillero||"").toLowerCase().includes(q);break;
      case "Tracking":     match=trkAll(w).toLowerCase().includes(q);break;
      case "Factura":      match=(w.factura||"").toLowerCase().includes(q);break;
      case "Carrier":      match=(w.carrier||"").toLowerCase().includes(q);break;
      case "Descripción":  match=(w.descripcion||"").toLowerCase().includes(q);break;
      case "Estado":       match=(w.status.label||"").toLowerCase().includes(q);break;
      default:             match=[w.id,w.consignee,w.casillero,trkAll(w)].some(v=>String(v||"").toLowerCase().includes(q));
    }
    return ms&&match;
  }).sort((a,b)=>{
    let va=a[sortCol],vb=b[sortCol];
    if(sortCol==="fecha"){va=a.fecha instanceof Date?a.fecha.getTime():new Date(a.fecha).getTime();vb=b.fecha instanceof Date?b.fecha.getTime():new Date(b.fecha).getTime();}
    if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}
    if(va<vb)return sortDir==="asc"?-1:1;if(va>vb)return sortDir==="asc"?1:-1;return 0;
  });

  // Si clFilter es "" se muestra el selector y la tabla no se renderiza, así que devolvemos vacío
  const filteredCl=!clFilter?[]:clients.filter(c=>clFilter==="todos"?true:c.tipo===(clFilter==="clientes"?"cliente":"usuario"));

  // Stats — usar SOLO códigos del modelo actual (WR_STATUSES). Los antiguos
  // "7.1", "6.1", "12C", "12P" fueron retirados del modelo y la tabla de
  // migración (línea ~1777) los convierte al cargar, pero quedaron filtros
  // viejos que daban conteos en cero. Los filtros se alinean ahora con
  // STAT_DEFS (renderDash) — una única fuente de verdad por estado.
  const stats={
    total:              wrList.length,
    porConfirmar:       wrList.filter(w=>w.status&&["1","2"].includes(w.status.code)).length,
    confirmed:          wrList.filter(w=>w.status&&w.status.code==="3").length,
    consolidados:       wrList.filter(w=>w.status&&w.status.code==="4").length,
    transit:            wrList.filter(w=>w.status&&["5","6","6.2","7","8","9","10","11","12","13"].includes(w.status.code)).length,
    customs:            wrList.filter(w=>w.status&&["6","6.2","10","14"].includes(w.status.code)).length,
    almacenDestino:     wrList.filter(w=>w.status&&w.status.code==="17").length,
    porEntrega:         wrList.filter(w=>w.status&&w.status.code==="20").length,
    entregados:         wrList.filter(w=>w.status&&w.status.code==="21").length,
    porCobrar:          wrList.filter(w=>w.status&&w.status.code==="22").length,
    cobrados:           wrList.filter(w=>w.status&&w.status.code==="23").length,
    egresados:          wrList.filter(w=>w.status&&w.status.code==="25").length,
    excepciones:        wrList.filter(w=>w.status&&["18","18.1","19"].includes(w.status.code)).length,
  };

  // Scan logic: register tracking in puerta
  const doScan=()=>{
    const trk=normTrk(scanV);
    if(!trk)return;
    const already=scanLog.find(s=>normTrk(s.tracking)===trk);
    if(!already){
      const entry={id:crypto.randomUUID(),tracking:trk,carrier:scanCarrier||"—",ts:new Date(),registered:false};
      setScanLog(p=>[entry,...p]);
      dbInsertScan(entry);
    }
    setScanV("");
  };
  // When creating WR, check if tracking matches scan log
  const checkAndRemoveScan=(tracking)=>{
    const trk=normTrk(tracking);
    if(!trk)return;
    setScanLog(p=>p.map(s=>normTrk(s.tracking)===trk?{...s,registered:true}:s));
    dbSetScanRegistered(trk);
  };

  // WR FORM state
  const EMAIL_KEYS_W=["remitenteId","remitenteEmail","email","password","unitDim","unitPeso","sucursalEntrega","clienteId"];
  const sw=(k,v)=>setWrf(p=>({...p,[k]:typeof v==="string"&&!EMAIL_KEYS_W.includes(k)?v.toUpperCase():v}));

  // Client search
  const handleClientSearch=(q)=>{
    setClientSearch(q);
    const t=q.trim(), bq=crearBuscador(t);
    if(!bq||(t.length<2&&!/^\d$/.test(t))){setClientResults([]);return;}
    const res=clientesVisibles.filter(c=>c.tipo==="cliente"&&(
      bq.casillero(c.casillero)||bq.nombre(fullName(c))||(t.length>=2&&fullName(c).toLowerCase().includes(t.toLowerCase()))
    )).sort((a,b)=>(bq.casillero(b.casillero)?1:0)-(bq.casillero(a.casillero)?1:0));
    setClientResults(res);
  };
  const selectClient=(c)=>{
    sw("consignee",fullName(c));
    sw("casillero",c.casillero);
    sw("clienteId",c.id);
    sw("casilleroSearch",c.casillero);
    sw("sucursalEntrega",c.oficinaId||"");
    setClientSearch(fullName(c));
    setClientResults([]);
  };

  const swCaja=(idx,k,v)=>setWrf(p=>({...p,cajas:p.cajas.map((c,i)=>i===idx?{...c,[k]:v}:c)}));
  const addCaja=()=>setWrf(p=>({...p,cajas:[...p.cajas,emptyCaja()]}));
  const removeCaja=(idx)=>setWrf(p=>({...p,cajas:p.cajas.filter((_,i)=>i!==idx)}));

  // ── FOTOS del paquete (por caja) ──────────────────────────────
  // Antes de guardar el WR estas fotos viven en memoria (objetURL + File).
  // Al submit se suben al bucket y se insertan las filas en wr_fotos.
  const addFotosToCaja=(idx, fileList, source="upload")=>{
    const arr = Array.from(fileList||[]).filter(f=>f && f.type && f.type.startsWith("image/"));
    if(!arr.length) return;
    const nuevas = arr.map(f=>({
      id: null, // aún no persistido
      file: f,
      url: URL.createObjectURL(f),
      path: null,
      source,
      mime: f.type || 'image/jpeg',
      sizeBytes: f.size || 0,
      filename: f.name || (source==='webcam'?'webcam.jpg':'upload.jpg'),
      createdAt: new Date(),
    }));
    setWrf(p=>({...p,cajas:p.cajas.map((c,i)=>i===idx?{...c,fotos:[...(c.fotos||[]),...nuevas]}:c)}));
  };
  const removeFotoFromCaja=(idx, fotoIdx)=>{
    setWrf(p=>({...p,cajas:p.cajas.map((c,i)=>{
      if(i!==idx) return c;
      const arr=[...(c.fotos||[])];
      const rem=arr.splice(fotoIdx,1)[0];
      // liberar objectURL si era local
      if(rem && rem.url && rem.url.startsWith('blob:')) {
        try{ URL.revokeObjectURL(rem.url); }catch{}
      }
      return {...c,fotos:arr};
    })}));
  };

  // ── FOTOS DE CONTENEDORES (Consolidación) ──────────────────────────────────
  // Mismo patrón que las fotos de WR: se acumulan en el form como objetos con
  // id=null (aún no persistido) y al guardar el embarque se suben al bucket
  // "consol-fotos" e insertan filas en la tabla consol_fotos.
  const addFotosToContainer=(ci, fileList, source="upload")=>{
    const arr = Array.from(fileList||[]).filter(f=>f && f.type && f.type.startsWith("image/"));
    if(!arr.length) return;
    const nuevas = arr.map(f=>({
      id: null,
      file: f,
      url: URL.createObjectURL(f),
      path: null,
      source,
      mime: f.type || 'image/jpeg',
      sizeBytes: f.size || 0,
      filename: f.name || (source==='webcam'?'webcam.jpg':'upload.jpg'),
      createdAt: new Date(),
    }));
    setCf(p=>({...p,containers:p.containers.map((c,i)=>i===ci?{...c,fotos:[...(c.fotos||[]),...nuevas]}:c)}));
  };
  const removeFotoFromContainer=(ci, fotoIdx)=>{
    setCf(p=>({...p,containers:p.containers.map((c,i)=>{
      if(i!==ci) return c;
      const arr=[...(c.fotos||[])];
      const rem=arr.splice(fotoIdx,1)[0];
      if(rem && rem.url && rem.url.startsWith('blob:')){
        try{ URL.revokeObjectURL(rem.url); }catch{}
      }
      return {...c,fotos:arr};
    })}));
  };
  // Sube las fotos nuevas (sin id) de cada contenedor al bucket y crea filas en consol_fotos.
  const uploadFotosForConsol=async(consolId, containers, userId)=>{
    let count=0;
    for(let i=0;i<containers.length;i++){
      const cont=containers[i];
      const nuevas=(cont.fotos||[]).filter(f=>f && f.file && !f.id);
      for(const foto of nuevas){
        try{
          const up=await storageUploadFotoConsol(foto.file, consolId, i);
          if(!up) continue;
          const row=await dbInsertFotoConsol({
            consolId, containerIdx:i, url:up.url, path:up.path,
            filename:foto.filename||'foto.jpg',
            mime:foto.mime||'image/jpeg',
            sizeBytes:foto.sizeBytes||0,
            source:foto.source||'upload',
            uploadedBy:userId||'',
          });
          if(row) count++;
        }catch(e){ console.error("uploadFotoConsol:",e); }
      }
    }
    return count;
  };

  // computed totals from all cajas (each multiplied by cantidad)
  const cajaCalcs=wrf.cajas.map(c=>{
    const l=parseFloat(c.largo)||0, a=parseFloat(c.ancho)||0, h=parseFloat(c.alto)||0;
    const rawW=parseFloat(c.pesoLb)||0;
    const qty=parseInt(c.cantidad)||1;
    const lCm=wrf.unitDim==="in"?l*2.54:l, aCm=wrf.unitDim==="in"?a*2.54:a, hCm=wrf.unitDim==="in"?h*2.54:h;
    // Convertir peso según unidad seleccionada
    const pkKg=wrf.unitPeso==="kg"?rawW:parseFloat((rawW/2.205).toFixed(2));
    const pkLb=wrf.unitPeso==="kg"?parseFloat((rawW*2.205).toFixed(1)):rawW;
    const vc=lCm&&aCm&&hCm?calcVol(lCm,aCm,hCm,"cm"):{volKg:0,volLb:0,ft3:0,m3:0};
    return {l,a,h,pkLb,pkKg,lCm,aCm,hCm,qty,...vc};
  });
  const totalPesoLb=parseFloat(cajaCalcs.reduce((s,c)=>s+c.pkLb*c.qty,0).toFixed(1));
  const totalPesoKg=parseFloat(cajaCalcs.reduce((s,c)=>s+c.pkKg*c.qty,0).toFixed(2));
  const totalVolLb=parseFloat(cajaCalcs.reduce((s,c)=>s+c.volLb*c.qty,0).toFixed(2));
  const totalVolKg=parseFloat(cajaCalcs.reduce((s,c)=>s+c.volKg*c.qty,0).toFixed(2));
  const totalFt3=parseFloat(cajaCalcs.reduce((s,c)=>s+c.ft3*c.qty,0).toFixed(3));
  const totalM3=parseFloat(cajaCalcs.reduce((s,c)=>s+c.m3*c.qty,0).toFixed(4));
  const totalCajasCount=cajaCalcs.reduce((s,c)=>s+c.qty,0);
  const dimCalc={volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3};

  // Derivar códigos de oficina para numeración
  const _origOff=oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.origCity.toUpperCase()))||oficinas[0];
  const _destOff=oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.destCity.toUpperCase()))||oficinas[oficinas.length-1]||_origOff;
  // Tipo 3 usa país+ciudad de Países y Ciudades (OFFICE_CONFIG); Tipo 2 usa código de oficina
  const _wrOrigCode=wrNumTipo===3?`${String(OFFICE_CONFIG.origCountry).padStart(2,"0")}${OFFICE_CONFIG.origCity.slice(0,2).toUpperCase()}`:(offCode(_origOff));
  const _wrDestCode=wrNumTipo===3?`${String(OFFICE_CONFIG.destCountry).padStart(2,"0")}${OFFICE_CONFIG.destCity.slice(0,2).toUpperCase()}`:(offCode(_destOff));
  // Usar el máximo secuencial existente +1 para evitar duplicados al borrar WRs
  const _wrNextSeq=(()=>{
    if(wrList.length===0)return 1;
    const nums=wrList.map(w=>{
      const id=String(w.id||"");
      const m=id.match(/(\d+)$/);
      return m?parseInt(m[1]):0;
    });
    return Math.max(...nums)+1;
  })();
  const wrNumPrev=buildWRNum(_wrOrigCode,_wrDestCode,_wrNextSeq,wrNumTipo,wrSecInicio,empresaSlug);
  const seqPrev=String(_wrNextSeq+(wrSecInicio-1)).padStart(7,"0");

  // Genera el próximo número de casillero basado en los existentes
  const nextCasillero=(lista=clients)=>{
    const nums=lista
      .filter(c=>c.casillero&&/\d/.test(c.casillero))
      .map(c=>parseInt(String(c.casillero).replace(/\D/g,""),10)||0);
    const max=nums.length>0?Math.max(...nums):0;
    return`${CASILLERO_PREFIX}${String(max+1).padStart(CASILLERO_DIGITS,"0")}`;
  };

  // Sube las fotos nuevas de cada caja al bucket y las inserta en wr_fotos.
  // Sólo procesa las fotos que aún no tienen id (es decir, las que acaba de
  // agregar el usuario). Retorna el número de fotos subidas exitosamente.
  const uploadFotosForWR=async(wrId, cajas, userId)=>{
    let count=0;
    for(let i=0;i<cajas.length;i++){
      const caja=cajas[i];
      const nuevas=(caja.fotos||[]).filter(f=>f && f.file && !f.id);
      for(const foto of nuevas){
        try{
          const up=await storageUploadFoto(foto.file, wrId, i);
          if(!up) continue;
          const row=await dbInsertFoto({
            wrId, cajaIdx:i, url:up.url, path:up.path,
            filename:foto.filename||'foto.jpg',
            mime:foto.mime||'image/jpeg',
            sizeBytes:foto.sizeBytes||0,
            source:foto.source||'upload',
            uploadedBy:userId||'',
          });
          if(row) count++;
        }catch(e){ console.error("uploadFoto:",e); }
      }
    }
    return count;
  };

  // Registra al remitente del WR como cliente (con su casillero) y lo enlaza
  const registrarRemitenteCliente=()=>{
    const rem=String(wrf.remitente||"").trim();
    if(!rem){window.alert("Escribe el nombre del remitente.");return;}
    if(!hasPerm("crear_cliente")){window.alert("Tu rol no tiene permiso para crear clientes.");return;}
    const doc=String(wrf.remitenteDoc||"").trim().toUpperCase(), em=String(wrf.remitenteEmail||"").trim().toLowerCase();
    const ya=clients.find(c=>doc&&String(c.cedula||"").trim().toUpperCase()===doc)
      ||clients.find(c=>em&&String(c.email||"").toLowerCase()===em)
      ||clients.find(c=>sinAcentos(fullName(c))===sinAcentos(rem));
    if(ya){setWrf(p=>({...p,remitenteId:ya.id}));return;}
    const parts=parseNombreCompleto(rem);
    const cas=nextCasillero();
    const nc={
      id:`CLI-${Date.now()}`,tipo:"cliente",
      primerNombre:parts.primerNombre,segundoNombre:parts.segundoNombre,
      primerApellido:parts.primerApellido,segundoApellido:parts.segundoApellido,
      cedula:doc,dir:String(wrf.remitenteDir||"").trim(),municipio:"",estado:"",pais:"",cp:"",
      tel1:String(wrf.remitenteTel||"").trim(),tel2:"",email:em,
      casillero:cas,rol:"I",login:"",password:"",
      clienteTipo:"matriz",agenteId:"",oficinaId:"",autonomoId:"",vendedorId:"",activo:true,
      ...presetDominio(),
    };
    setClients(p=>[...p,nc]);
    dbUpsertCliente(nc);
    setWrf(p=>({...p,remitenteId:nc.id}));
    logAction("Registró remitente como cliente",`${rem} → ${cas}`);
  };
  const submitWR=async ()=>{
    // Expand dims: each registro × cantidad generates individual dim entries
    const dims=[];
    cajaCalcs.forEach((c,i)=>{
      for(let q=0;q<c.qty;q++){
        dims.push({
          l:c.lCm,a:c.aCm,h:c.hCm,pk:c.pkKg,pkLb:c.pkLb,
          volKg:c.volKg,volLb:c.volLb,ft3:c.ft3,m3:c.m3,
          carrier:wrf.cajas[i].carrier,
          tracking:normTrk(wrf.cajas[i].tracking),
          factura:wrf.cajas[i].numFactura,
          descripcion:cleanReempaqueDesc(wrf.cajas[i].descripcion),
        });
      }
    });
    const now=new Date();

    // ── AUTO-REGISTRO DE CLIENTE si el consignatario no está registrado ─────
    let _clienteId=wrf.clienteId;
    let _casillero=wrf.casillero;
    if(!editWR&&!_clienteId&&wrf.consignee.trim()){
      const parts=parseNombreCompleto(wrf.consignee);
      const cas=nextCasillero();
      const newId=`CLI-${Date.now()}`;
      const newCliente={
        id:newId,tipo:"cliente",
        primerNombre:parts.primerNombre,segundoNombre:parts.segundoNombre,
        primerApellido:parts.primerApellido,segundoApellido:parts.segundoApellido,
        cedula:"",dir:"",municipio:"",estado:"",pais:"",cp:"",
        tel1:"",tel2:"",email:"",
        casillero:cas,rol:"I",login:"",password:"",
        clienteTipo:"matriz",agenteId:"",oficinaId:"",autonomoId:"",vendedorId:"",activo:true,
        ...presetDominio(),
      };
      setClients(p=>[...p,newCliente]);
      dbUpsertCliente(newCliente);
      _clienteId=newId;
      _casillero=cas;
      logAction("Auto-registró cliente",`${parts.primerNombre} ${parts.primerApellido} → ${cas}`);
    }
    // ── REMITENTE: enlazar con un cliente existente o registrarlo con su casillero ─
    let _remitenteId=wrf.remitenteId||"";
    {
      const rem=String(wrf.remitente||"").trim();
      const esEmpresa=!rem||[empresaNombre,"ENEX"].filter(Boolean).some(x=>sinAcentos(x)===sinAcentos(rem));
      if(!_remitenteId&&!esEmpresa){
        const lista=[...clients,...(_clienteId&&!clients.some(c=>c.id===_clienteId)?[{id:_clienteId,casillero:_casillero,...parseNombreCompleto(wrf.consignee),cedula:"",email:""}]:[])];
        const doc=String(wrf.remitenteDoc||"").trim().toUpperCase(), em=String(wrf.remitenteEmail||"").trim().toLowerCase();
        const ya=lista.find(c=>doc&&String(c.cedula||"").trim().toUpperCase()===doc)
          ||lista.find(c=>em&&String(c.email||"").toLowerCase()===em)
          ||lista.find(c=>sinAcentos(fullName(c))===sinAcentos(rem));
        if(ya)_remitenteId=ya.id;
      }
    }

    if(editWR){
      // ── EDIT MODE: update existing WR ──────────────────────────────────────
      const updated={
        ...editWR,
        cajas:totalCajasCount,
        consignee:wrf.consignee,casillero:wrf.casillero,clienteId:wrf.clienteId,
        carrier:wrf.cajas[0]?.carrier||"",tracking:normTrk(wrf.cajas[0]?.tracking),
        descripcion:cleanReempaqueDesc(wrf.cajas[0]?.descripcion||""),factura:wrf.cajas[0]?.numFactura||"",
        valor:wrf.cajas.reduce((s,c)=>s+parseFloat(c.montoFactura||0),0),
        dims,
        pesoKg:totalPesoKg,pesoLb:totalPesoLb,
        volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3,
        notas:wrf.notas,tipoEnvio:wrf.tipoEnvio,tipoPago:wrf.tipoPago,
        shipper:wrf.remitente,remitenteDir:wrf.remitenteDir||"",remitenteTel:wrf.remitenteTel||"",remitenteEmail:(wrf.remitenteEmail||"").trim(),remitenteDoc:(wrf.remitenteDoc||"").trim(),remitenteId:_remitenteId,cargos:wrf.cargos,
        sucursalEntrega:wrf.sucursalEntrega||"",
      };
      // Con tipo de envío asignado y aún en Recibido/Origen → Confirmado
      {const _w=updated;const _st3=WR_STATUSES.find(x=>x.code==="3");
        if(_w.tipoEnvio&&["1","2"].includes(_w.status?.code||"1")&&_st3){_w.status=_st3;_w.historial=[...(_w.historial||[]),{code:"3",label:_st3.label,fecha:new Date(),user:currentUser.id,nota:`Confirmado al editar: ${_w.tipoEnvio}`}];}}
      wrf.cajas.forEach(c=>[c.tracking,c.tracking2,c.tracking3].forEach(t=>{if(t)checkAndRemoveScan(t);}));
      // Subir fotos nuevas al bucket (antes de marcar foto=true)
      const uploadedCount=await uploadFotosForWR(editWR.id, wrf.cajas, currentUser?.id||'');
      if(uploadedCount>0) updated.foto=true;
      setWrList(p=>p.map(x=>x.id===editWR.id?updated:x));
      dbUpsertWR(updated);
      setShowNewWR(false);setEditWR(null);
      setWrf(emptyWRF(PAY_TYPES[0]));setClientSearch("");
      logAction("Editó WR",editWR.id);
      if(uploadedCount>0) logAction("Subió fotos WR",`${editWR.id} (${uploadedCount})`);
    } else {
      // ── CREATE MODE ────────────────────────────────────────────────────────
      const reempaqueIds=Array.isArray(wrf.reempaqueDe)?wrf.reempaqueDe:[];
      const esReempaque=reempaqueIds.length>0;
      const n={
        id:wrNumPrev,
        origCountry:COUNTRIES.find(c=>c.dial===OFFICE_CONFIG.origCountry)?.name||"USA 🇺🇸",
        origCity:OFFICE_CONFIG.origCity,
        destCountry:COUNTRIES.find(c=>c.dial===OFFICE_CONFIG.destCountry)?.name||"Venezuela 🇻🇪",
        destCity:OFFICE_CONFIG.destCity,
        cajas:totalCajasCount,
        branch:OFFICE_CONFIG.branch,
        fecha:now,
        consignee:wrf.consignee,casillero:_casillero,clienteId:_clienteId,
        carrier:esReempaque?"REEMPAQUE":(wrf.cajas[0]?.carrier||""),tracking:normTrk(wrf.cajas[0]?.tracking),
        descripcion:cleanReempaqueDesc(wrf.cajas[0]?.descripcion||""),
        factura:wrf.cajas[0]?.numFactura||"",
        valor:wrf.cajas.reduce((s,c)=>s+parseFloat(c.montoFactura||0),0),
        dims,
        pesoKg:totalPesoKg,pesoLb:totalPesoLb,
        volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3,
        status:WR_STATUSES[0],
        // Si es reempaque, anteponer la referencia a los WR padre en Notas (no en Descripción)
        notas:esReempaque
          ?`Reempaque de: ${reempaqueIds.join(", ")}${wrf.notas?` | ${wrf.notas}`:""}`
          :wrf.notas,
        tipoEnvio:wrf.tipoEnvio,tipoPago:wrf.tipoPago,
        shipper:wrf.remitente,remitenteDir:wrf.remitenteDir||"",remitenteTel:wrf.remitenteTel||"",remitenteEmail:(wrf.remitenteEmail||"").trim(),remitenteDoc:(wrf.remitenteDoc||"").trim(),remitenteId:_remitenteId,usuario:currentUser.id,foto:false,prealerta:false,
        sucursalEntrega:wrf.sucursalEntrega||"",
        cargos:wrf.cargos,
        ...(esReempaque?{reempaqueDe:[...reempaqueIds],historial:[{code:"1",label:"Recibido",fecha:now,user:currentUser.id,nota:`Reempaque de: ${reempaqueIds.join(", ")}`}]}:{}),
      };
      // Con tipo de envío asignado y aún en Recibido/Origen → Confirmado
      {const _w=n;const _st3=WR_STATUSES.find(x=>x.code==="3");
        if(_w.tipoEnvio&&["1","2"].includes(_w.status?.code||"1")&&_st3){_w.status=_st3;_w.historial=[...(_w.historial||[]),{code:"3",label:_st3.label,fecha:new Date(),user:currentUser.id,nota:`Confirmado al registrar: ${_w.tipoEnvio}`}];}}
      wrf.cajas.forEach(c=>[c.tracking,c.tracking2,c.tracking3].forEach(t=>{if(t)checkAndRemoveScan(t);}));
      // Si es reempaque, marcar padres como REEMPACADO (2.3) y guardar referencia hacia este WR nuevo
      let padresUpd=[];
      if(esReempaque){
        const stReempacado=WR_STATUSES.find(s=>s.code==="2.3");
        padresUpd=wrList.filter(w=>reempaqueIds.includes(w.id)).map(w=>({
          ...w,
          status:stReempacado,
          reempacadoEn:n.id,
          historial:[...(w.historial||[]),{code:"2.3",label:"Reempacado",fecha:now,user:currentUser.id,nota:`Reempacado → ${n.id}`}],
        }));
      }
      // Subir fotos al bucket (después del upsert para que el FK wr_id exista)
      dbUpsertWR(n);
      const uploadedCount=await uploadFotosForWR(n.id, wrf.cajas, currentUser?.id||'');
      if(uploadedCount>0){ n.foto=true; dbUpsertWR(n); }
      setWrList(p=>[n,...p.map(w=>padresUpd.find(pa=>pa.id===w.id)||w)]);
      padresUpd.forEach(dbUpsertWR);
      setShowNewWR(false);
      setWrf(emptyWRF(PAY_TYPES[0]));setClientSearch("");
      if(esReempaque){logAction("Creó Reempaque",`${n.id} ← [${reempaqueIds.join(", ")}]`);setRpqSel([]);}
      logAction("Creó WR",wrNumPrev);
      if(uploadedCount>0) logAction("Subió fotos WR",`${n.id} (${uploadedCount})`);
      setShowLabels({wr:n,dims,remitente:wrf.remitente,tipoEnvio:wrf.tipoEnvio});
      // PREPAID: abrir su factura al guardar (si se marcó la opción)
      if(String(n.tipoPago||"").toLowerCase().includes("prepa")&&wrf.facturarPrepaid!==false&&(hasPerm("crear_factura")||hasPerm("facturar"))){
        if(!n.tipoEnvio)window.alert(`WR ${n.id} guardado.\nPara facturarlo como PREPAID asigna el tipo de envío; luego usa «💰 Facturar PREPAID» en el WR.`);
        else facOpenNew(facConstruirWR(n));
      }
    }
  };

  // ── ASIGNAR TIPO DE ENVÍO Y CONFIRMAR ──────────────────────────────────────
  // Al asignar tipo a un WR sin tipo → cambia status a "3" (Confirmado).
  // Si ya tiene tipo, solo actualiza el tipo sin tocar status.
  const assignTipoEnvio=(w,tipo)=>{
    if(!w)return;
    // Bloque F — WR reempacado (2.3) queda fijo: no se puede asignar tipo ni confirmar
    const _saltar=hasPerm("saltar_bloqueos");
    if(wrTipoFijo(w)&&tipo!==w.tipoEnvio){window.alert(`El WR ${w.id} ya está facturado, en entrega, entregado o cerrado. Su tipo de envío no se puede cambiar.`);return;}
    if(!_saltar&&w.status?.code==="2.3"){
      window.alert(`El WR ${w.id} fue reempacado en ${w.reempacadoEn||"otro WR"} y queda fijo en estado Reempacado. No se puede confirmar ni cambiar su tipo de envío.`);
      return;
    }
    // WR egresado (25) tampoco se confirma ni cambia tipo
    if(!_saltar&&w.status?.code==="25"){
      window.alert(`El WR ${w.id} ya fue Egresado. No se puede confirmar ni cambiar su tipo de envío.`);
      return;
    }
    // Consolidado (4) o posterior — el tipo queda fijo
    if(!_saltar&&!wrEsModificable(w)){
      window.alert(`El WR ${w.id} ya está en estado ${w.status?.label||"?"}. Desde Consolidado en adelante no se puede cambiar el tipo de envío.`);
      return;
    }
    // Blanquear tipo: si está Confirmado (3), revertir al estado previo del historial (desconfirma)
    if(!tipo||!String(tipo).trim()){
      if(!hasPerm("desconfirmar")){window.alert("Tu rol no tiene permiso para quitar/revertir el tipo de envío.");return;}
      const currentCode=w.status?.code||"1";
      let stTarget=w.status;
      let histExtra=[];
      if(currentCode==="3"){
        const hist=Array.isArray(w.historial)?w.historial:[];
        const prev=[...hist].reverse().find(h=>h.code&&h.code!=="3");
        const stFallback=WR_STATUSES.find(s=>s.code==="1")||w.status;
        stTarget=prev?(WR_STATUSES.find(s=>s.code===prev.code)||stFallback):stFallback;
        histExtra=[{code:stTarget.code,label:stTarget.label,fecha:new Date(),user:currentUser.id,nota:"Tipo de envío removido — reversión de confirmación"}];
      }
      const upd={...w,tipoEnvio:"",status:stTarget,historial:[...(w.historial||[]),...histExtra]};
      setWrList(p=>p.map(x=>x.id===w.id?upd:x));
      if(selWR&&selWR.id===w.id)setSelWR(upd);
      dbUpsertWR(upd);
      logAction(currentCode==="3"?"Desconfirmó WR (quitó tipo)":"Quitó tipo de envío",w.id);
      return;
    }
    const stConfirmado=WR_STATUSES.find(s=>s.code==="3");
    const currentCode=w.status?.code||"1";
    // Solo cambiar status a Confirmado si estaba en "1" (Recibido) o "2" (algún intermedio pre-confirmación)
    // No degradar si ya está en 3 o en una fase posterior.
    const preConfirmCodes=["1","2"];
    const shouldConfirm=preConfirmCodes.includes(currentCode)&&stConfirmado;
    const upd={
      ...w,
      tipoEnvio:tipo,
      ...(shouldConfirm?{
        status:stConfirmado,
        historial:[...(w.historial||[]),{code:stConfirmado.code,label:stConfirmado.label,fecha:new Date(),user:currentUser.id,nota:`Confirmado al asignar tipo: ${tipo}`}],
      }:{}),
    };
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction(shouldConfirm?`Confirmó WR (${tipo})`:`Cambió tipo de envío → ${tipo}`,w.id);
  };

  // Revierte un WR Confirmado (status 3) al status anterior del historial.
  // Si no hay anterior registrado, vuelve a "1" (Recibido). También limpia el tipoEnvio
  // para permitir que el usuario vuelva a asignarlo y reconfirmar.
  const revertirConfirmacion=(w)=>{
    if(!w||w.status?.code!=="3")return;
    if(!hasPerm("desconfirmar")){window.alert("Tu rol no tiene permiso para revertir confirmaciones.");return;}
    if(!window.confirm(`¿Revertir la confirmación del WR ${w.id}?\nVolverá al estado anterior y se quitará el tipo de envío (para que puedas reasignarlo).`))return;
    const hist=Array.isArray(w.historial)?w.historial:[];
    // Buscar el último estado del historial que NO sea "3" (el previo a confirmar)
    const prev=[...hist].reverse().find(h=>h.code&&h.code!=="3");
    const stFallback=WR_STATUSES.find(s=>s.code==="1")||w.status;
    const stTarget=prev?(WR_STATUSES.find(s=>s.code===prev.code)||stFallback):stFallback;
    const upd={
      ...w,
      status:stTarget,
      tipoEnvio:"",
      historial:[...hist,{code:stTarget.code,label:stTarget.label,fecha:new Date(),user:currentUser.id,nota:"Reversión de confirmación (tipo de envío quitado)"}],
    };
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Revirtió confirmación WR",`${w.id} → ${stTarget.label}`);
  };


  // ── ALL ADDITIONAL STATE (must be declared before any render functions) ──────

  // ── TOOLBAR ────────────────────────────────────────────────────────────────
  const renderWRToolbar=()=>(
    <div className="wr-toolbar">
      {/* Nuevo WR — IZQUIERDA */}
      {hasPerm("crear_wr")&&<button className="btn-p" onClick={()=>{setWrf(emptyWRF(PAY_TYPES[0]));setShowNewWR(true);}}>+ Nuevo WR</button>}
      {/* ATAJOS — abren el módulo en una ventana encima, sin salir de esta pantalla */}
      {[{id:"reempaque",ic:"🔁",l:"Reempaque",c:"#5B3FB5"},{id:"cargorelease",ic:"🚀",l:"Cargo Release",c:"#0080CC"}].map(a=>(
        <button key={a.id} type="button" className="btn-s" title={`Abrir ${a.l} en una ventana, sin salir de esta pantalla`}
          onClick={()=>setQuickTab(a.id)}
          style={{color:a.c,borderColor:`${a.c}55`,background:`${a.c}12`,fontWeight:700}}>
          {a.ic} {a.l}
        </button>
      ))}
      {/* Búsqueda avanzada */}
      <div className="srch-adv">
        <select className="srch-param" value={searchParam} onChange={e=>{setSearchParam(e.target.value);setSearch("");}}>
          {SEARCH_PARAMS.map(p=><option key={p}>{p}</option>)}
        </select>
        <input placeholder={`Buscar por ${searchParam}…`} value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        {search&&<span style={{paddingRight:6,cursor:"pointer",color:"var(--t3)",fontSize:15}} onClick={()=>setSearch("")}>✕</span>}
      </div>
      <div className="flex1"/>
      {/* Unidades */}
      <div className="unit-tog">
        <span>Long:</span>
        {["cm","pulg."].map(u=><button key={u} className={`utb ${unitL===(u==="cm"?"cm":"in")?"on":""}`} onClick={()=>setUnitL(u==="cm"?"cm":"in")}>{u}</button>)}
        <span style={{marginLeft:4}}>Peso:</span>
        {["kg","lb"].map(u=><button key={u} className={`utb ${unitW===u?"on":""}`} onClick={()=>setUnitW(u)}>{u}</button>)}
      </div>
      <select className="st-sel" value={filterSt} onChange={e=>{setFilterSt(e.target.value);setPage(1);}}>
        <option value="all">Todos los estados</option>
        {WR_STATUSES.map(s=><option key={s.code} value={s.code}>{s.code} – {s.label}</option>)}
      </select>
      <span className="wr-cnt">{filteredWR.length} registros</span>
      <button type="button" className="btn-s" onClick={()=>setDashWide(v=>!v)}
        title={dashWide?"Volver a mostrar estadísticas y panel lateral":"Ocultar estadísticas y panel lateral para ver más filas y columnas"}
        style={{fontWeight:700,whiteSpace:"nowrap"}}>
        {dashWide?"🗗 Reducir tabla":"⛶ Ampliar tabla"}
      </button>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  // 8 cuadros que cubren el pipeline completo, alineados con el modelo actual
  // de WR_STATUSES. Filtros y conteos comparten códigos con el objeto `stats`
  // de más arriba (única fuente de verdad por estado).
  const STAT_DEFS=[
    {key:"total",          ic:"📦", label:"Total WR",        d:"Todos los WR del sistema",            cls:"up", filter:()=>wrList, color:"#1A2B4A"},
    {key:"porConfirmar",   ic:"🆕", label:"Por Confirmar",    d:"Recibido / Origen — falta tipo",       cls:"dn", filter:()=>wrList.filter(w=>w.status&&["1","2"].includes(w.status.code)), color:"#C05800"},
    {key:"confirmed",      ic:"✅", label:"Confirmados",      d:"Listos para consolidar",               cls:"up", filter:()=>wrList.filter(w=>w.status&&w.status.code==="3"), color:"#1A8A4A"},
    {key:"consolidados",   ic:"🗂️", label:"Consolidados",     d:"Asignados a una guía",                 cls:"up", filter:()=>wrList.filter(w=>w.status&&w.status.code==="4"), color:"#2A6FA0"},
    {key:"transit",        ic:"✈️", label:"En Tránsito",      d:"Viajando origen → destino",            cls:"up", filter:()=>wrList.filter(w=>w.status&&["5","6","6.2","7","8","9","10","11","12","13"].includes(w.status.code)), color:"#0080CC"},
    {key:"almacenDestino", ic:"📥", label:"Almacén Destino",  d:"Llegaron al almacén",                   cls:"up", filter:()=>wrList.filter(w=>w.status&&w.status.code==="17"), color:"#6A4FB0"},
    {key:"porEntrega",     ic:"🚚", label:"Por Entrega",      d:"Listos para retiro / envío",            cls:"up", filter:()=>wrList.filter(w=>w.status&&w.status.code==="20"), color:"#1A6040"},
    {key:"porCobrar",      ic:"💸", label:"Por Cobrar",       d:"Entregados sin pago",                   cls:"dn", filter:()=>wrList.filter(w=>w.status&&w.status.code==="22"), color:"#CC2233"},
  ];

  const renderDash=()=>(
    <>
      {/* STATS CLICKEABLES — ocultos con "Ampliar tabla" */}
      {!dashWide&&<div className="stats">
        {STAT_DEFS.map(s=>(
          <div key={s.key} className="stat" onClick={()=>setShowStatModal({...s,rows:s.filter()})}>
            <div className="stat-bar" style={{background:s.color,opacity:.7}}/>
            <div className="stat-ic">{s.ic}</div>
            <div className="stat-v">{stats[s.key]}</div>
            <div className="stat-l">{s.label}</div>
            <div className={`stat-d ${s.cls}`}>{s.d}</div>
          </div>
        ))}
      </div>}

      {/* DASH GRID */}
      <div className="dash-grid" style={{flex:1,minHeight:0,overflow:"hidden",padding:dashWide?"10px 16px 14px":"0 16px 14px",...(dashWide?{gridTemplateColumns:"1fr"}:{})}}>
        <div className="wr-panel">
          {renderWRToolbar()}
          <WRTable rows={filteredWR} selId={selWR?.id} onSelect={setSelWR}
            unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
            sendTypes={SEND_TYPES} onAssignTipo={assignTipoEnvio}
            onSort={handleSort} sortCol={sortCol} sortDir={sortDir}
            dimOpen={dimOpen} onDimToggle={handleDimToggle}
            onFotoClick={w=>setPhotoGalleryOpen({wrId:w.id})}
            onTimelineClick={w=>setTimelineWR(w)}
            consolList={consolList}
            onGuiaClick={g=>setRdArchView(g)}
            page={page} onPage={setPage}/>
        </div>

        {!dashWide&&<div className="rp">
          <div className="card">
            <div className="card-tt" onClick={()=>setTab("alerts")} title="Ver faltantes y sobrantes en Alertas" style={{cursor:"pointer"}}>🔔 Alertas <span className="card-sub">{stats.excepciones} excepciones ›</span></div>
            {[
              stats.customs>0&&{cls:"alt-e",ic:"🛃",t:"En Aduana / Retención",b:`${stats.customs} envío${stats.customs!==1?"s":""} en proceso aduanal`},
              stats.excepciones>0&&{cls:"alt-w",ic:"⚠️",t:"Excepciones",b:`${stats.excepciones} WR en Faltante / Investigación / Sobrante`},
              stats.porEntrega>0&&{cls:"alt-i",ic:"🚚",t:"Por Entrega",b:`${stats.porEntrega} envío${stats.porEntrega!==1?"s":""} esperan al cliente`},
              stats.porCobrar>0&&{cls:"alt-ok",ic:"💸",t:"Por Cobrar",b:`${stats.porCobrar} envío${stats.porCobrar!==1?"s":""} pendientes de cobro`},
            ].filter(Boolean).map((a,i)=>(
              <div key={i} className={`alt-row ${a.cls}`}>
                <div className="alt-ic">{a.ic}</div>
                <div><div className="alt-t">{a.t}</div><div className="alt-b">{a.b}</div></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-tt">📊 Distribución</div>
            {[
              {l:"Por Confirmar", v:stats.porConfirmar,   c:"#C05800"},
              {l:"Confirmados",   v:stats.confirmed,       c:"#1A8A4A"},
              {l:"Consolidados",  v:stats.consolidados,    c:"#2A6FA0"},
              {l:"En Tránsito",   v:stats.transit,         c:"#0080CC"},
              {l:"Almacén Dest.", v:stats.almacenDestino,  c:"#6A4FB0"},
              {l:"Por Entrega",   v:stats.porEntrega,      c:"#1A6040"},
              {l:"Entregados",    v:stats.entregados,      c:"#2A7A50"},
              {l:"Por Cobrar",    v:stats.porCobrar,       c:"#CC2233"},
              {l:"Cobrados",      v:stats.cobrados,        c:"#1A6040"},
            ].map(({l,v,c})=>{
              const pct=stats.total>0?Math.round((v/stats.total)*100):0;
              return (
                <div key={l} className="pb-row">
                  <div className="pb-hd">
                    <span className="pb-l">{l}</span>
                    <span className="pb-v">{v} <span style={{color:"var(--t3)",fontSize:11}}>{pct}%</span></span>
                  </div>
                  <div className="pb-bg"><div className="pb-fill" style={{width:`${pct}%`,background:c}}/></div>
                </div>
              );
            })}
          </div>
          {/* ACCESOS DIRECTOS — atajos a los modulos que no tienen cuadro de stat
              propio arriba. Ocupa el slot que estaba reservado en el panel derecho. */}
          <div className="card">
            <div className="card-tt">⚡ Accesos Directos</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {id:"reempaque",    ic:"🔁", l:"Reempaque",     n:wrList.filter(w=>w.status?.code==="2.3").length, sub:"reempacados", c:"#5B3FB5"},
                {id:"cargorelease", ic:"🚀", l:"Cargo Release", n:wrList.filter(w=>w.status?.code==="25").length,  sub:"egresados",   c:"#0080CC"},
              ].map(b=>(
                <button key={b.id} type="button" title={`Abrir ${b.l} en una ventana, sin salir del Dashboard`} onClick={()=>setQuickTab(b.id)}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"11px 6px",
                    borderRadius:9,border:`1px solid ${b.c}40`,background:`${b.c}10`,cursor:"pointer",transition:"all .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${b.c}22`;e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`${b.c}10`;e.currentTarget.style.transform="none";}}>
                  <span style={{fontSize:21,lineHeight:1}}>{b.ic}</span>
                  <span style={{fontSize:12.5,fontWeight:700,color:b.c,whiteSpace:"nowrap"}}>{b.l}</span>
                  <span style={{fontSize:11,color:"var(--t3)"}}>{b.n} {b.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>}
      </div>
    </>
  );

  // ── SCAN ────────────────────────────────────────────────────────────────────
  const toggleDay=day=>setOpenDays(p=>({...p,[day]:!p[day]}));

  const renderScan=()=>{
    const pending=scanLog.filter(s=>!s.registered);
    const history=scanLog.filter(s=>s.registered);
    const histByDay={};
    history.forEach(s=>{
      const day=fmtDate(s.ts);
      if(!histByDay[day])histByDay[day]=[];
      histByDay[day].push(s);
    });
    return (
    <div className="page-scroll">
      <div className="card" style={{marginBottom:14}}>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:12}}>📡 Recepción en Puerta — Control de Paquetería</div>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr auto",gap:8,marginBottom:8}}>
          <div className="fg">
            <div className="fl">Carrier / Transportista</div>
            <input className="fi" value={scanCarrier} onChange={e=>setScanCarrier(e.target.value.toUpperCase())} placeholder="UPS, FEDEX, DHL…" style={{textTransform:"uppercase",fontWeight:600}}/>
          </div>
          <div className="fg">
            <div className="fl">Tracking — Escanear o escribir</div>
            <input className="fi" style={{fontFamily:"'DM Mono',monospace",fontSize:16,letterSpacing:1}}
              placeholder="Escanear o escribir tracking…" value={scanV} onChange={e=>setScanV(e.target.value.toUpperCase())}
              onKeyDown={e=>{if(e.key==="Enter")doScan();}}/>
          </div>
          <div className="fg">
            <div className="fl">&nbsp;</div>
            <button className="scan-btn" onClick={doScan}>📡 Registrar</button>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* IZQUIERDA — PENDIENTES */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)"}}>⏳ Pendientes de WR</span>
            {pending.length>0&&<span style={{fontSize:12,background:"#FDE8EA",padding:"2px 8px",borderRadius:4,border:"1px solid #F0A0A8",color:"var(--red)",fontWeight:700}}>{pending.length}</span>}
          </div>
          {pending.length===0
            ?<div style={{textAlign:"center",padding:"24px 0",color:"var(--t3)",fontSize:13}}>Sin pendientes ✅</div>
            :<table className="ct">
              <thead><tr><th>#</th><th>Carrier</th><th>Tracking</th><th>Hora</th><th></th></tr></thead>
              <tbody>{pending.map((s,i)=>(
                <tr key={i}>
                  <td style={{color:"var(--t3)",fontSize:12}}>{i+1}</td>
                  <td style={{color:"var(--t1)",fontWeight:700,fontSize:13}}>{s.carrier||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--cyan)",fontSize:13,fontWeight:600}}>{s.tracking}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtTime(s.ts)}</td>
                  <td>{hasPerm("crear_wr")?<button className="btn-p" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>{setWrf(p=>({...p,cajas:[{...p.cajas[0],carrier:s.carrier||"",tracking:s.tracking},...p.cajas.slice(1)]}));setShowNewWR(true);}}>WR →</button>:<span style={{fontSize:12,color:"var(--t4)"}}>—</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          }
        </div>

        {/* DERECHA — HISTORIAL COLAPSABLE POR DÍA */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)"}}>✅ Historial por Día</span>
            {history.length>0&&<span style={{fontSize:12,background:"#E8F8EE",padding:"2px 8px",borderRadius:4,border:"1px solid #80D0A0",color:"var(--green)",fontWeight:700}}>{history.length} registrados</span>}
          </div>
          {Object.keys(histByDay).length===0
            ?<div style={{textAlign:"center",padding:"24px 0",color:"var(--t3)",fontSize:13}}>Sin registros aún</div>
            :Object.entries(histByDay).map(([day,items])=>{
              const open=openDays[day]===true; // default closed
              return (
                <div key={day} style={{marginBottom:8,border:"1px solid var(--b1)",borderRadius:8,overflow:"hidden"}}>
                  {/* Header clickeable */}
                  <div onClick={()=>toggleDay(day)} style={{background:"var(--bg4)",padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",borderBottom:open?"1px solid var(--b1)":"none"}}>
                    <span style={{fontWeight:700,fontSize:14,color:"var(--navy)"}}>
                      📅 {day} — {items.length} paquetes {open?"▲":"▼"}
                    </span>
                    {hasPerm("borrar_rp")&&<button className="btn-d" style={{fontSize:11,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();const ids=items.map(s=>s.id).filter(Boolean);setScanLog(p=>p.filter(s=>fmtDate(s.ts)!==day||!s.registered));dbDeleteScanIds(ids);}}>🗑 Borrar día</button>}
                  </div>
                  {open&&(
                    <table className="ct" style={{fontSize:12}}>
                      <thead><tr><th>#</th><th>Carrier</th><th>Tracking</th><th>Hora</th></tr></thead>
                      <tbody>{items.map((s,i)=>(
                        <tr key={i}>
                          <td style={{color:"var(--t3)"}}>{i+1}</td>
                          <td style={{fontWeight:600,color:"var(--t2)"}}>{s.carrier||"—"}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t2)",fontSize:12}}>{s.tracking}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmtTime(s.ts)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
    );
  };

  // ── CLIENTS ────────────────────────────────────────────────────────────────
  const renderClients=()=>{
    const clients=clientesVisibles;
    // Cuando no hay filtro seleccionado, mostramos sólo el selector (módulo en blanco)
    if(!clFilter){
      const totalCli=clients.filter(c=>c.tipo==="cliente").length;
      const totalUsr=clients.filter(c=>c.tipo==="usuario").length;
      const cards=[
        {v:"clientes",ic:"🏠",l:"Clientes",d:"Personas y empresas que envían/reciben paquetes.",n:totalCli,c1:"#E8F8EE",c2:"var(--green)"},
        {v:"usuarios",ic:"👤",l:"Usuarios del Sistema",d:"Empleados, agentes, oficinas y roles internos.",n:totalUsr,c1:"#F0EAFE",c2:"var(--purple)"},
        {v:"todos",   ic:"👥",l:"Todos",                d:"Lista combinada de Clientes y Usuarios.",       n:clients.length,c1:"#EEF3FF",c2:"var(--navy)"},
      ];
      return(
        <div className="page-scroll">
          <div className="card" style={{textAlign:"center",padding:"40px 24px",marginBottom:14}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:700,color:"var(--navy)",marginBottom:6}}>👥 Clientes & Usuarios</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,maxWidth:1080,margin:"0 auto"}}>
            {cards.map(card=>(
              <div key={card.v} onClick={()=>setClFilter(card.v)}
                style={{
                  background:"var(--bg2)",border:"2px solid var(--b1)",borderRadius:14,padding:"22px 20px",
                  cursor:"pointer",transition:"all .15s",textAlign:"center",
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=card.c2;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                <div style={{fontSize:42,marginBottom:6}}>{card.ic}</div>
                <div style={{fontSize:18,fontWeight:700,color:"var(--navy)"}}>{card.l}</div>
                <div style={{fontSize:13,color:"var(--t3)",marginTop:6,minHeight:36}}>{card.d}</div>
                <div style={{marginTop:14,display:"inline-block",background:card.c1,color:card.c2,fontWeight:700,fontSize:14,padding:"6px 14px",borderRadius:20,border:`1px solid ${card.c2}`}}>
                  {card.n} {card.v==="todos"?"registros":card.v==="clientes"?"clientes":"usuarios"}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div className="tabs" style={{flex:1}}>
          {[["todos","👥 Todos"],["clientes","🏠 Clientes"],["usuarios","👤 Usuarios"]].map(([v,l])=>(
            <div key={v} className={`tab ${clFilter===v?"on":""}`} onClick={()=>setClFilter(v)}>{l}
              <span className="t-cnt">{v==="todos"?clients.length:clients.filter(c=>c.tipo===(v==="clientes"?"cliente":"usuario")).length}</span>
            </div>
          ))}
          <div className="tab" onClick={()=>setClFilter("")} title="Volver al selector"
            style={{marginLeft:"auto",color:"var(--t3)",cursor:"pointer"}}>↩ Cambiar</div>
        </div>
        {hasPerm("crear_cliente")&&<button className="btn-p" onClick={()=>setShowNewCl(true)}>+ Agregar</button>}
      </div>
      <div className="card" style={{padding:0}}>
        <div className="ct-wrap">
          <table className="ct">
            <thead><tr>
              <th>ID</th><th>Tipo</th><th>Nombre Completo</th><th>ID Identificación</th>
              <th>Casillero</th><th>Dirección</th><th>Municipio</th><th>Estado</th>
              <th>País</th><th>CP</th><th>Teléfono 1</th><th>Teléfono 2</th><th>Email</th><th>Rol</th>
              <th>Designación</th><th>Pertenece a</th>
              {(hasPerm("editar_cliente")||hasPerm("borrar_cliente"))&&<th>Acc.</th>}
            </tr></thead>
            <tbody>
              {filteredCl.map(c=>{
                const CT_LABEL={agente:"🤝 Agente",vendedor_agente:"💼 Vend. Agente",autonomo:"🧑‍💻 Autónomo",oficina:"🏢 Oficina",vendedor_oficina:"🛒 Vend. Oficina",matriz:"🏛️ Matriz"};
                const CT_COLOR={agente:"#E8F0FE",vendedor_agente:"#FFF0E8",autonomo:"#E8FEF0",oficina:"#F0E8FE",vendedor_oficina:"#FEF0E8",matriz:"#EEF0F4"};
                const CT_TEXT={agente:"var(--cyan)",vendedor_agente:"var(--gold2)",autonomo:"var(--green)",oficina:"var(--purple)",vendedor_oficina:"#D0700A",matriz:"var(--t3)"};
                const ct=c.clienteTipo||"";
                const ctLabel=CT_LABEL[ct]||"—";
                const parentAut=c.autonomoId?clients.find(x=>x.id===c.autonomoId):null;
                const parentName=
                  ct==="matriz"?`🏛️ ${empresaNombre||"Casa Matriz"}`:
                  ct==="agente"||ct==="vendedor_agente"?(agentes.find(a=>a.id===c.agenteId)?.nombre||"⚠️ Sin agente asignado"):
                  ct==="autonomo"?(parentAut?`${parentAut.primerNombre} ${parentAut.primerApellido}`:"⚠️ Sin autónomo asignado"):
                  ct==="oficina"||ct==="vendedor_oficina"?(oficinas.find(o=>o.id===c.oficinaId)?.nombre||"⚠️ Sin oficina asignada"):
                  "—";
                return (
                <tr key={c.id}>
                  <td><span className="cid">{c.id}</span></td>
                  <td><span style={{fontSize:11,padding:"2px 6px",borderRadius:4,fontWeight:700,background:c.tipo==="usuario"?"#F0EAFE":"#E8F8EE",color:c.tipo==="usuario"?"var(--purple)":"var(--green)",border:"1px solid",borderColor:c.tipo==="usuario"?"#C0A0F0":"#80D0A0"}}>{c.tipo==="usuario"?"👤 Sistema":"🏠 Cliente"}</span></td>
                  <td><span className="cn">{fullName(c)}</span></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold2)",fontWeight:600}}>{c.cedula}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold2)",fontWeight:700}}>{c.casillero||"—"}</td>
                  <td style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis"}}>{c.dir}</td>
                  <td style={{fontSize:12}}>{c.municipio}</td>
                  <td style={{fontSize:12}}>{c.estado}</td>
                  <td style={{fontSize:12}}>{c.pais}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{c.cp||"—"}</td>
                  <td style={{fontSize:12,whiteSpace:"nowrap"}}>{c.tel1}</td>
                  <td style={{fontSize:12,color:"var(--t3)",whiteSpace:"nowrap"}}>{c.tel2||"—"}</td>
                  <td style={{fontSize:12,color:"var(--cyan)"}}>{c.email}</td>
                  <td><RoleBadge code={c.rol}/></td>
                  <td>{ct?<span style={{fontSize:11,padding:"2px 7px",borderRadius:4,fontWeight:700,background:CT_COLOR[ct]||"var(--bg4)",color:CT_TEXT[ct]||"var(--t2)",border:"1px solid currentColor",whiteSpace:"nowrap"}}>{ctLabel}</span>:<span style={{color:"var(--t4)",fontSize:12}}>—</span>}</td>
                  <td style={{fontSize:12,color:parentName&&parentName.startsWith("⚠️")?"var(--red)":ct==="matriz"?"var(--t3)":"var(--t1)",fontWeight:ct==="matriz"?400:600,whiteSpace:"nowrap"}}>{parentName}</td>
                  {(hasPerm("editar_cliente")||hasPerm("borrar_cliente"))&&<td><div style={{display:"flex",gap:3}}>
                    {hasPerm("editar_cliente")&&<span className="ic-b" onClick={()=>setShowEditCl(c)}>✏️</span>}
                    {hasPerm("borrar_cliente")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar "${fullName(c)}"? Esta acción no se puede deshacer.`)){setClients(p=>p.filter(x=>x.id!==c.id));(async()=>{if(c.authId)await cuentaEliminar(c.id);await dbDeleteCliente(c.id);})();logAction("Borró registro",`${c.id} — ${fullName(c)}`);}}}>🗑</span>}
                  </div></td>}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  // ── ROLES ──────────────────────────────────────────────────────────────────

  const renderRoles=()=>{
    const puedeEditar=hasPerm("gestionar_roles");
    const r=selRole?ROLE_DEFS[selRole]:null;
    const esAdmin=selRole==="A";
    const permsDe=code=>code==="A"?ALL_PERMS:(roleDraft[code]??rolePerms[code]??[]);
    const activos=new Set(selRole?permsDe(selRole):[]);
    const editable=puedeEditar&&!!selRole&&!esAdmin;
    const hayCambios=Object.keys(roleDraft).length>0;
    const toggle=(perms,on)=>{
      if(!editable)return;
      setRoleDraft(d=>{
        const base=new Set(d[selRole]??rolePerms[selRole]??[]);
        perms.forEach(p=>{if(on)base.add(p);else base.delete(p);});
        return {...d,[selRole]:ALL_PERMS.filter(p=>base.has(p))};
      });
    };
    const guardar=async()=>{
      setRoleSaving(true);
      const nuevo={...rolePerms,...roleDraft};
      const ok=await dbSetConfig('role_perms',nuevo);
      setRoleSaving(false);
      if(ok===false){window.alert("No se pudieron guardar los permisos. Inténtalo de nuevo.");return;}
      setRolePerms(nuevo);
      logAction("Editó permisos de roles",Object.keys(roleDraft).map(c=>ROLE_DEFS[c]?.name||c).join(", "));
      setRoleDraft({});
    };
    const restaurar=()=>{
      if(!r||!window.confirm(`¿Restaurar los permisos predeterminados del rol ${r.name}?\nLos cambios se aplican al pulsar "Guardar cambios".`))return;
      setRoleDraft(d=>({...d,[selRole]:[...DEFAULT_ROLE_PERMS[selRole]]}));
    };
    const chk=(on,onChange,title)=>(
      <input type="checkbox" checked={on} disabled={!editable} onChange={e=>onChange(e.target.checked)} title={title}
        style={{width:18,height:18,accentColor:"#1A2B4A",cursor:editable?"pointer":"default"}}/>
    );
    const otrosGrupos=[
      ...PERM_GROUPS.map(g=>({label:g.label,perms:g.perms.filter(p=>ALL_PERMS.includes(p)&&!PERMS_EN_TABLA.has(p))})),
      {label:"Otros",perms:ALL_PERMS.filter(p=>!PERMS_EN_TABLA.has(p)&&!PERM_GROUPS.some(g=>g.perms.includes(p)))},
    ].filter(g=>g.perms.length>0);
    const th={padding:"8px 10px",fontSize:12,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:"rgba(255,255,255,.9)",background:"var(--navy)",textAlign:"center",whiteSpace:"nowrap"};
    return (
    <div className="page-scroll">

      <div style={{display:"grid",gridTemplateColumns:"260px minmax(0,1fr)",gap:14}}>
        {/* LISTA DE ROLES */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {ALL_ROLES.map(ro=>(
            <div key={ro.code} onClick={()=>setSelRole(ro.code===selRole?null:ro.code)}
              style={{background:"var(--bg2)",border:`2px solid ${selRole===ro.code?"var(--navy)":"var(--b1)"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{ro.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className={`rb ${ro.color}`} style={{fontSize:12}}>{ro.code}</span>
                    <span style={{fontWeight:700,fontSize:14,color:"var(--t1)"}}>{ro.name}</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>
                    {permsDe(ro.code).length} / {ALL_PERMS.length} permisos
                    {roleDraft[ro.code]&&<span style={{color:"var(--orange)",fontWeight:700}}> · sin guardar</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE */}
        {r?(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,overflow:"hidden",minWidth:0}}>
            <div style={{padding:"12px 16px",background:"var(--navy)",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <span style={{fontSize:24}}>{r.icon}</span>
              <div style={{minWidth:0}}>
                <div style={{color:"#fff",fontSize:18,fontWeight:700}}>{r.code} — {r.name}</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:13,marginTop:2}}>{r.desc}</div>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap"}}>
                {editable&&<button className="btn-s" style={{fontSize:12,padding:"5px 10px",background:"#fff"}} onClick={restaurar}>↺ Predeterminados</button>}
                {hayCambios&&<button className="btn-s" style={{fontSize:12,padding:"5px 10px",background:"#fff"}} onClick={()=>setRoleDraft({})}>Descartar</button>}
                {puedeEditar&&<button className="btn-p" style={{fontSize:12,padding:"5px 12px"}} disabled={!hayCambios||roleSaving} onClick={guardar}>{roleSaving?"Guardando…":"💾 Guardar cambios"}</button>}
              </div>
            </div>
            {!puedeEditar&&<div style={{padding:"8px 16px",background:"var(--bg4)",color:"var(--t2)",fontSize:13,borderBottom:"1px solid var(--b1)"}}>Solo lectura: tu rol no tiene el permiso "Gestionar Roles".</div>}

            <div style={{padding:"14px 16px",maxHeight:"68vh",overflowY:"auto"}}>
              {/* TABLA MÓDULO × ACCIÓN */}
              <div style={{overflowX:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                  <thead>
                    <tr>
                      <th style={{...th,textAlign:"left"}}>Módulo</th>
                      {PERM_ACTIONS.map(a=>{
                        const col=PERM_MODULES.map(m=>m[a.k]);
                        const todos=col.every(p=>activos.has(p));
                        return <th key={a.k} style={th}>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                            {a.l}
                            {chk(todos,on=>toggle(col,on),`${a.l} en todos los módulos`)}
                          </div>
                        </th>;
                      })}
                      <th style={th}>Todo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERM_MODULES.map((m,i)=>{
                      const fila=PERM_ACTIONS.map(a=>m[a.k]);
                      return (
                        <tr key={m.m} style={{background:i%2?"var(--bg3)":"var(--bg2)",borderTop:"1px solid var(--b2)"}}>
                          <td style={{padding:"7px 10px",fontWeight:600,color:"var(--t1)",whiteSpace:"nowrap"}}><span style={{marginRight:6}}>{m.ic}</span>{m.m}</td>
                          {PERM_ACTIONS.map(a=>(
                            <td key={a.k} style={{textAlign:"center",padding:"6px"}}>
                              {chk(activos.has(m[a.k]),on=>toggle([m[a.k]],on),PERM_LBL[m[a.k]]||m[a.k])}
                            </td>
                          ))}
                          <td style={{textAlign:"center",padding:"6px",borderLeft:"1px solid var(--b2)"}}>
                            {chk(fila.every(p=>activos.has(p)),on=>toggle(fila,on),`Todo en ${m.m}`)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* OTROS PERMISOS */}
              <div style={{fontSize:13,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"var(--navy)",margin:"18px 0 8px"}}>Otros permisos</div>
              {otrosGrupos.map(g=>(
                <div key={g.label} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>{g.label}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {g.perms.map(p=>{
                      const on=activos.has(p);
                      return (
                        <label key={p} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:6,fontSize:13,fontWeight:600,cursor:editable?"pointer":"default",
                          background:on?"#E8F8EE":"var(--bg4)",color:on?"var(--green)":"var(--t3)",border:`1px solid ${on?"#80D0A0":"var(--b2)"}`}}>
                          {chk(on,v=>toggle([p],v))}
                          {PERM_LBL[p]||p}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:"var(--t3)",padding:60}}>
            <span style={{fontSize:42}}>🔐</span>
            <div style={{fontSize:16,fontWeight:600}}>Selecciona un rol para ver y editar sus permisos</div>
          </div>
        )}
      </div>
    </div>
    );
  };

  // ── CLIENT FORM MODAL ──────────────────────────────────────────────────────
  // ── NEW WR MODAL ────────────────────────────────────────────────────────────
  const renderNewWRModal=()=>(
    <div className="ov">
      <div className="modal mxl" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">{editWR?"✏️ Editar WR — "+editWR.id:"📦 Nuevo Warehouse Receipt"} — {wrf.cajas.length} {wrf.cajas.length===1?"caja":"cajas"}</div>
          <button className="mcl" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF(PAY_TYPES[0]));setClientSearch("");}}>✕</button>
        </div>

        {/* N° WR AUTOMÁTICO */}
        <div className="wr-builder">
          <div style={{fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--navy)",marginBottom:8}}>
            NÚMERO DE WR — GENERADO AUTOMÁTICAMENTE
            <span style={{marginLeft:10,fontWeight:400,color:"var(--t3)",textTransform:"none",letterSpacing:0}}>
              {wrNumTipo===1?"Tipo 1: Secuencia":wrNumTipo===2?"Tipo 2: Empresa + Oficinas + Secuencia":"Tipo 3: País + Ciudad + Secuencia"}
            </span>
          </div>
          <div className="wr-preview">
            {wrNumTipo===1&&(
              <span className="seg sn">{seqPrev}</span>
            )}
            {wrNumTipo===2&&(<>
              <span className="seg sk">{empresaSlug}</span>
              <span className="seg sc">{offCode(_origOff)}</span>
              <span className="seg sc">{offCode(_destOff)}</span>
              <span className="seg sn">{seqPrev}</span>
            </>)}
            {(wrNumTipo===3||!wrNumTipo)&&(<>
              <span className="seg sc">{String(OFFICE_CONFIG.origCountry).padStart(2,"0")}</span>
              <span className="seg sk">{OFFICE_CONFIG.origCity.slice(0,2).toUpperCase()}</span>
              <span className="seg sc">{String(OFFICE_CONFIG.destCountry).padStart(2,"0")}</span>
              <span className="seg sk">{OFFICE_CONFIG.destCity.slice(0,2).toUpperCase()}</span>
              <span className="seg sn">{seqPrev}</span>
            </>)}
          </div>
          {wrNumTipo===1&&<div className="seg-leg"><span>🟡 Secuencia</span></div>}
          {wrNumTipo===2&&<div className="seg-leg"><span>🟢 Empresa</span><span>🔵 Oficina Origen</span><span>🔵 Oficina Destino</span><span>🟡 Secuencia</span></div>}
          {(wrNumTipo===3||!wrNumTipo)&&<div className="seg-leg"><span>🔵 País Origen</span><span>🟢 Ciudad Origen</span><span>🔵 País Destino</span><span>🟢 Ciudad Destino</span><span>🟡 Secuencia</span></div>}
          <div style={{display:"flex",gap:8,justifyContent:"center",fontSize:13,color:"var(--t2)",marginTop:4}}>
            <span>🏢 <strong>{OFFICE_CONFIG.branch}</strong></span>
          </div>
        </div>

        {/* REMITENTE / CONSIGNATARIO */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div>
            <div className="sdiv">INFORMACIÓN DEL REMITENTE</div>
            <div className="fgrid" style={{gap:8}}>
              {(()=>{
                const elegir=c=>{setRemCampo("");setWrf(p=>({...p,remitenteId:c.id,remitente:fullName(c).toUpperCase(),remitenteDoc:c.cedula||p.remitenteDoc,remitenteTel:c.tel1||p.remitenteTel,remitenteEmail:c.email||p.remitenteEmail,remitenteDir:[c.dir,c.municipio,c.estado].filter(Boolean).join(", ").toUpperCase()||p.remitenteDir}));};
                const dig=v=>String(v||"").replace(/\D/g,"");
                const sugerir=campo=>{
                  if(wrf.remitenteId||remCampo!==campo)return null;
                  const v=String(wrf[campo]||"").trim(); let res=[];
                  if(campo==="remitente"&&(v.length>=2||/^\d$/.test(v))){const bq=crearBuscador(v);res=bq?clients.filter(c=>bq.nombre(fullName(c))||bq.casillero(c.casillero)):[];}
                  if(campo==="remitenteTel"&&dig(v).length>=4)res=clients.filter(c=>[c.tel1,c.tel2].some(t=>dig(t).endsWith(dig(v))||dig(t).includes(dig(v))));
                  if(campo==="remitenteEmail"&&v.length>=3)res=clients.filter(c=>String(c.email||"").toLowerCase().includes(v.toLowerCase()));
                  if(campo==="remitenteDoc"&&v.length>=3)res=clients.filter(c=>sinAcentos(c.cedula||"").replace(/[^A-Z0-9]/g,"").includes(sinAcentos(v).replace(/[^A-Z0-9]/g,"")));
                  res=res.filter(c=>c.tipo!=="usuario").slice(0,8);
                  return res.length>0&&<div className="fi-search-res">{res.map(c=>(
                    <div key={c.id} className="fi-search-item" onMouseDown={e=>{e.preventDefault();elegir(c);}}>
                      {fullName(c)}<span className="fi-search-cas">#{c.casillero}</span>
                      <span style={{fontSize:12,color:"var(--t3)",marginLeft:8}}>{[c.cedula&&`ID ${c.cedula}`,c.tel1,c.email].filter(Boolean).join(" · ")}</span>
                    </div>))}</div>;
                };
                const campo=(k,lbl,extra={})=>(
                  <div className="fg fi-search"><div className="fl">{lbl}</div>
                    <input className="fi" value={wrf[k]} onFocus={()=>setRemCampo(k)} onBlur={()=>setTimeout(()=>setRemCampo(x=>x===k?"":x),150)}
                      onChange={e=>{sw(k,e.target.value);setRemCampo(k);if(wrf.remitenteId&&k==="remitente")setWrf(p=>({...p,remitenteId:""}));}} {...extra}/>
                    {sugerir(k)}
                  </div>);
                const enl=wrf.remitenteId&&clients.find(x=>x.id===wrf.remitenteId);
                return <>
                  {campo("remitente",<>Nombre / Empresa {enl&&<span style={{color:"var(--gold2)",fontFamily:"'DM Mono',monospace",fontWeight:700}}>#{enl.casillero} <span onClick={()=>setWrf(p=>({...p,remitenteId:""}))} style={{cursor:"pointer",color:"var(--red)",marginLeft:4}}>✕</span></span>}</>,{placeholder:"Nombre o casillero"})}
                  {campo("remitenteDoc","ID Identificación")}
                  <div className="fg"><div className="fl">Dirección</div><input className="fi" value={wrf.remitenteDir} onChange={e=>sw("remitenteDir",e.target.value)}/></div>
                  {campo("remitenteTel","Teléfono",{placeholder:"+1 000 000 0000"})}
                  {campo("remitenteEmail","Email")}
                </>;
              })()}
              {!wrf.remitenteId&&String(wrf.remitente||"").trim()&&hasPerm("crear_cliente")&&<div className="fg" style={{alignSelf:"end"}}>
                <button type="button" className="btn-s" style={{fontSize:13,padding:"7px 12px",width:"100%",borderColor:"var(--green)",color:"var(--green)",fontWeight:700}} onClick={registrarRemitenteCliente}>➕ Registrar como cliente</button></div>}
            </div>
          </div>
          <div>
            <div className="sdiv">INFORMACIÓN DEL CONSIGNATARIO</div>
            <div className="fgrid" style={{gap:8}}>
              <div className="fg fi-search">
                <div className="fl">Buscar por Nombre o N° Casillero</div>
                <input className="fi" value={clientSearch} onChange={e=>handleClientSearch(e.target.value)} placeholder="Nombre o casillero"/>
                {clientResults.length>0&&(
                  <div className="fi-search-res">
                    {clientResults.map(c=>(
                      <div key={c.id} className="fi-search-item" onClick={()=>selectClient(c)}>
                        {fullName(c)} <span className="fi-search-cas">{c.casillero}</span>
                        <span style={{fontSize:11,color:"var(--t3)",marginLeft:6}}>{c.cedula}</span>
                      </div>
                    ))}
                    <div className="fi-search-new" onClick={()=>setClientResults([])}>+ Registrar como nuevo cliente después</div>
                  </div>
                )}
              </div>
              <div className="fg"><div className="fl">Nombre (si no está registrado)</div><input className="fi" value={wrf.consignee} onChange={e=>sw("consignee",e.target.value)} placeholder="Nombre completo"/></div>
              <div className="fg"><div className="fl">N° Casillero</div><input className="fi" value={wrf.casillero} onChange={e=>sw("casillero",e.target.value)} placeholder="NX-0000" style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:16,color:"var(--navy)",letterSpacing:1,background:"#EEF3FF",border:"2px solid #B8C8F0"}}/></div>
              <div className="fg"><div className="fl">Sucursal de entrega</div>
                <select className="fs" value={wrf.sucursalEntrega||""} onChange={e=>sw("sucursalEntrega",e.target.value)}>
                  <option value="">🏛️ Principal</option>
                  {oficinas.map(o=><option key={o.id} value={o.id}>🏢 {o.nombre}{o.ciudad?` — ${o.ciudad}`:""}{o.pais?`, ${o.pais}`:""}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TIPO ENVÍO / PAGO / CLIENTE */}
        <div className="fgrid g3" style={{marginBottom:14}}>
          <div className="fg">
            <div className="fl">Tipo de Envío</div>
            <select className="fs" value={wrf.tipoEnvio} onChange={e=>sw("tipoEnvio",e.target.value)}>
              <option value="">— Sin confirmar —</option>
              {SEND_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fg"><div className="fl">Tipo de Pago
            {!editWR&&String(wrf.tipoPago||"").toLowerCase().includes("prepa")&&(hasPerm("crear_factura")||hasPerm("facturar"))&&(
              <label style={{marginLeft:10,fontWeight:700,color:"var(--navy)",textTransform:"none",letterSpacing:0,cursor:"pointer"}}>
                <input type="checkbox" checked={wrf.facturarPrepaid!==false} onChange={e=>sw("facturarPrepaid",e.target.checked)} style={{marginRight:4}}/>🧾 Facturar al guardar
              </label>)}
          </div><select className="fs" value={wrf.tipoPago} onChange={e=>sw("tipoPago",e.target.value)}>{PAY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="fg">
            <div className="fl">Pertenece a</div>
            <div className="fi ro" style={{fontSize:13}}>
              {(()=>{
                const cl=wrf.clienteId?clients.find(c=>c.id===wrf.clienteId):null;
                const ct=cl?.clienteTipo||"";
                if(!cl)return<span style={{color:"var(--t3)"}}>Casa Matriz (por defecto)</span>;
                if(ct==="matriz")return<span>🏛️ Casa Matriz</span>;
                if(ct==="agente"||ct==="vendedor_agente"){const ag=agentes.find(a=>a.id===cl.agenteId);return<span>{ct==="agente"?"🤝":"💼"} {ag?.nombre||ag?.codigo||"Agente"}</span>;}
                if(ct==="oficina"||ct==="vendedor_oficina"){const of=oficinas.find(o=>o.id===cl.oficinaId);return<span>{ct==="oficina"?"🏢":"🛒"} {of?.nombre||of?.codigo||"Oficina"}</span>;}
                if(ct==="autonomo"){const au=clients.find(c=>c.id===cl.autonomoId);return<span>🧑‍💻 {au?`${au.primerNombre} ${au.primerApellido}`:"Autónomo"}</span>;}
                return<span style={{color:"var(--t3)"}}>Casa Matriz</span>;
              })()}
            </div>
          </div>
        </div>

        {/* CHOFER — solo una vez, carga especial */}
        <div style={{background:"#FEF9E7",border:"1px solid #F0C040",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
            <div className="fg"><div className="fl">Chofer</div><input className="fi" value={wrf.chofer} onChange={e=>sw("chofer",e.target.value)}/></div>
            <div className="fg"><div className="fl">ID Chofer</div><input className="fi" value={wrf.idChofer} onChange={e=>sw("idChofer",e.target.value)} placeholder="V-00000000"/></div>
            <div className="fg"><div className="fl">PRO Number</div><input className="fi" value={wrf.proNumber} onChange={e=>sw("proNumber",e.target.value)}/></div>
            <div className="fg"><div className="fl">OC Number</div><input className="fi" value={wrf.ocNumber||""} onChange={e=>sw("ocNumber",e.target.value)}/></div>
          </div>
        </div>

        {/* UNIDADES */}
        <div style={{display:"flex",gap:10,marginBottom:14,padding:"8px 14px",background:"var(--bg4)",borderRadius:8,border:"1px solid var(--b1)",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:600,color:"var(--navy)"}}>Unidades de medida:</span>
          <div style={{display:"flex",gap:4}}>
            <button type="button" className={`btn-${wrf.unitDim==="in"?"p":"s"}`} style={{padding:"4px 10px",fontSize:13}} onClick={()=>setWrf(p=>({...p,unitDim:"in"}))}>pulg.</button>
            <button type="button" className={`btn-${wrf.unitDim==="cm"?"p":"s"}`} style={{padding:"4px 10px",fontSize:13}} onClick={()=>setWrf(p=>({...p,unitDim:"cm"}))}>cm</button>
          </div>
          <span style={{fontSize:13,fontWeight:600,color:"var(--navy)",marginLeft:12}}>Unidades de peso:</span>
          <div style={{display:"flex",gap:4}}>
            <button type="button" className={`btn-${wrf.unitPeso==="lb"?"p":"s"}`} style={{padding:"4px 10px",fontSize:13}} onClick={()=>setWrf(p=>({...p,unitPeso:"lb"}))}>lb</button>
            <button type="button" className={`btn-${wrf.unitPeso==="kg"?"p":"s"}`} style={{padding:"4px 10px",fontSize:13}} onClick={()=>setWrf(p=>({...p,unitPeso:"kg"}))}>kg</button>
          </div>
        </div>

        {/* CAJAS — dinámicas */}
        {wrf.cajas.map((caja,idx)=>{
          const cc=cajaCalcs[idx]||{};
          const hasVol=cc.volLb>0;
          return (
            <div key={idx} style={{border:"2px solid var(--navy)",borderRadius:10,marginBottom:12,overflow:"hidden"}}>
              {/* Header registro */}
              <div style={{background:"var(--navy)",padding:"8px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:"#E5AE3A",fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:15}}>
                  📦 REGISTRO {idx+1} {wrf.cajas.length>1?`de ${wrf.cajas.length}`:""}
                </span>
                <div style={{flex:1}}/>
                {wrf.cajas.length>1&&(
                  <button onClick={()=>removeCaja(idx)} style={{background:"rgba(204,34,51,0.3)",border:"1px solid rgba(204,34,51,0.5)",color:"#FF8888",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:13,fontWeight:600}}>
                    🗑 Eliminar registro
                  </button>
                )}
              </div>

              <div style={{padding:"12px 14px"}}>
                {/* Trackings — una sola franja compacta con los 3 transportistas */}
                <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:7,padding:"8px 10px",marginBottom:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"95px minmax(140px,1fr) 1px 95px minmax(140px,1fr) 1px 95px minmax(140px,1fr)",columnGap:6,rowGap:6,alignItems:"end"}}>
                    {[0,1,2].map(ti=>{
                      const cfield=ti===0?"carrier":ti===1?"carrier2":"carrier3";
                      const tfield=ti===0?"tracking":ti===1?"tracking2":"tracking3";
                      return (
                        <Fragment key={ti}>
                          {/* Separador vertical entre grupos */}
                          {ti>0&&<div style={{width:1,height:30,background:"var(--b1)",alignSelf:"center"}}/>}
                          {/* Transportista */}
                          <div>
                            <div className="fl" style={{marginBottom:2,fontSize:10}}>Transp. {ti+1}{ti>0?" (opc.)":""}</div>
                            <input className="fi" style={{padding:"4px 6px",fontSize:12,textTransform:"uppercase",fontWeight:600}} value={caja[cfield]||""} onChange={e=>swCaja(idx,cfield,e.target.value.toUpperCase())} placeholder={ti===0?"UPS, FEDEX…":"Opcional"}/>
                          </div>
                          {/* Tracking */}
                          <div>
                            <div className="fl" style={{marginBottom:2,fontSize:10}}>Tracking {ti+1}</div>
                            <div style={{display:"flex",gap:4}}>
                              <input className="fi" style={{padding:"4px 6px",fontFamily:"'DM Mono',monospace",fontSize:12,flex:1}} value={caja[tfield]||""} onChange={e=>swCaja(idx,tfield,e.target.value.toUpperCase())} placeholder="Escanear…"/>
                              {ti===0&&<button type="button" className="scan-btn" style={{padding:"4px 8px",fontSize:13}} title="Escanear código de barras (requiere lector USB)">📡</button>}
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Proveedor + Factura + Monto */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  <div className="fg"><div className="fl">Proveedor</div><input className="fi" value={caja.proveedor} onChange={e=>swCaja(idx,"proveedor",e.target.value.toUpperCase())} style={{textTransform:"uppercase",fontWeight:600}}/></div>
                  <div className="fg"><div className="fl">N° Factura</div><input className="fi" value={caja.numFactura} onChange={e=>swCaja(idx,"numFactura",e.target.value.toUpperCase())} placeholder="INV-00000"/></div>
                  <div className="fg"><div className="fl">Monto ($)</div><input className="fi" type="number" value={caja.montoFactura} onChange={e=>swCaja(idx,"montoFactura",e.target.value)}/></div>
                </div>

                {/* Dims + Peso + calcs */}
                <div style={{display:"grid",gridTemplateColumns:"60px 120px 1fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  <div className="fg">
                    <div className="fl">Cantidad</div>
                    <input className="fi" type="number" min="1" value={caja.cantidad||1} onChange={e=>swCaja(idx,"cantidad",e.target.value)} style={{textAlign:"center",fontWeight:800,fontSize:16,color:"var(--navy)"}}/>
                  </div>
                  <div className="fg">
                    <div className="fl">Embalaje</div>
                    <input className="fi" value={caja.tipoEmbalaje} onChange={e=>swCaja(idx,"tipoEmbalaje",e.target.value.toUpperCase())} placeholder="Ej: Caja, Paleta…" style={{fontSize:13}}/>
                  </div>
                  <div className="fg"><div className="fl">Largo</div><input className="fi" type="number" value={caja.largo} onChange={e=>swCaja(idx,"largo",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Ancho</div><input className="fi" type="number" value={caja.ancho} onChange={e=>swCaja(idx,"ancho",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Alto</div><input className="fi" type="number" value={caja.alto} onChange={e=>swCaja(idx,"alto",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Peso ({wrf.unitPeso})</div><input className="fi" type="number" value={caja.pesoLb} onChange={e=>swCaja(idx,"pesoLb",e.target.value)}/></div>
                  <div className="fg"><div className="fl">P.Vol.lb 🔄</div><div className="fi ro" style={{color:"var(--orange)",fontWeight:700,fontSize:14}}>{hasVol?cc.volLb:"—"}</div></div>
                  <div className="fg"><div className="fl">P.Vol.kg 🔄</div><div className="fi ro" style={{color:"var(--orange)",fontSize:13}}>{hasVol?cc.volKg:"—"}</div></div>
                  <div className="fg"><div className="fl">Ft³ 🔄</div><div className="fi ro" style={{color:"var(--sky)",fontWeight:600,fontSize:13}}>{hasVol?cc.ft3:"—"}</div></div>
                </div>

                {/* Descripción */}
                <div className="fg">
                  <div className="fl">Descripción de la Mercancía</div>
                  <textarea className="fi" value={caja.descripcion} onChange={e=>swCaja(idx,"descripcion",e.target.value.toUpperCase())} placeholder="Descripción detallada de la mercancía: tipo de producto, materiales, uso, etc." rows={3} style={{resize:"vertical",minHeight:64,fontFamily:"inherit",fontSize:14,lineHeight:1.5}}/>
                </div>

                {/* FOTOS DEL PAQUETE (por caja) */}
                {hasPerm("subir_foto") && (
                  <div style={{marginTop:12,paddingTop:10,borderTop:"1px dashed var(--b1)"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:.8,display:"flex",alignItems:"center",gap:7}}>
                        <span style={{fontSize:15}}>📷</span> Fotos del paquete
                        {(caja.fotos||[]).length>0 && (
                          <span style={{background:"var(--gold)",color:"#fff",fontSize:11,padding:"2px 8px",borderRadius:10,fontWeight:700}}>{caja.fotos.length}</span>
                        )}
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <label className="btn-s" style={{fontSize:12,padding:"5px 10px",cursor:"pointer",margin:0,display:"inline-flex",alignItems:"center",gap:5}}>
                          <span>📁</span> Subir archivo
                          <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{addFotosToCaja(idx,e.target.files,"upload");e.target.value="";}}/>
                        </label>
                        <button type="button" className="btn-s" style={{fontSize:12,padding:"5px 10px",display:"inline-flex",alignItems:"center",gap:5}} onClick={()=>setWebcamOpen({cajaIdx:idx})}>
                          <span>📸</span> Cámara web
                        </button>
                      </div>
                    </div>
                    {(caja.fotos||[]).length===0 ? (
                      <div style={{padding:"12px",border:"2px dashed var(--b1)",borderRadius:8,background:"var(--bg4)",textAlign:"center",color:"var(--t3)",fontSize:13}}>
                        Sin fotos
                      </div>
                    ) : (
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(110px, 1fr))",gap:8}}>
                        {caja.fotos.map((foto,fi)=>(
                          <div key={fi} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid var(--b1)",background:"var(--bg4)"}}>
                            <img src={foto.url} alt={foto.filename||"foto"} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                            <div style={{position:"absolute",top:4,right:4,display:"flex",gap:4}}>
                              <button type="button" title="Quitar foto" onClick={()=>removeFotoFromCaja(idx,fi)} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"rgba(204,34,51,0.95)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                            </div>
                            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)",color:"#fff",fontSize:10,padding:"8px 4px 3px",textAlign:"center",fontWeight:600}}>
                              {foto.source==='webcam'?'📸 Cámara':'📁 Archivo'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* BOTÓN NUEVA CAJA */}
        <button onClick={addCaja} style={{width:"100%",padding:"12px",border:"2px dashed var(--navy)",borderRadius:10,background:"rgba(26,43,74,0.04)",color:"var(--navy)",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:14,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:20}}>📦</span> + Agregar
        </button>

        {/* TOTALES */}
        {wrf.cajas.length>0&&(
          <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
            <div style={{fontWeight:700,color:"var(--navy)",fontSize:12,textTransform:"uppercase",letterSpacing:1,gridColumn:"1/-1",marginBottom:4}}>TOTALES DEL WR — {wrf.cajas.length} {wrf.cajas.length===1?"caja":"cajas"}</div>
            {[["Peso total lb",`${totalPesoLb} lb`,"var(--t1)"],["Peso total kg",`${totalPesoKg} kg`,"var(--t2)"],["P.Vol. lb",`${totalVolLb} lb`,"var(--orange)"],["P.Vol. kg",`${totalVolKg} kg`,"var(--orange)"],["Ft³",String(totalFt3),"var(--sky)"],["M³",String(totalM3),"var(--teal)"]].map(([l,v,c])=>(
              <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"7px 10px",border:"1px solid var(--b1)"}}>
                <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:c,fontSize:15}}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* NOTAS Y CARGOS */}
        <div className="sdiv">NOTAS, SERVICIOS Y GASTOS ADICIONALES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
          <div className="fg"><div className="fl">Notas y Observaciones</div><textarea className="ft" value={wrf.notas} onChange={e=>sw("notas",e.target.value)} placeholder="Frágil, NO VOLTEAR, manejo especial…"/></div>
          <div className="fg">
            {[{t:"Servicios adicionales",l:SERVICIOS_CAT},{t:"Gastos adicionales",l:GASTOS_CAT}].map(g=>(
              <div key={g.t} style={{marginBottom:8}}>
                <div className="fl">{g.t}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:4}}>
                  {g.l.length===0&&<span style={{fontSize:12,color:"var(--t3)"}}>—</span>}
                  {g.l.map(({nombre:c,precio})=><button key={c} className={`btn-${wrf.cargos.includes(c)?"p":"s"}`} style={{fontSize:12,padding:"4px 9px"}} onClick={()=>sw("cargos",wrf.cargos.includes(c)?wrf.cargos.filter(x=>x!==c):[...wrf.cargos,c])}>{c} <span style={{opacity:.7}}>${precio}</span></button>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mft">
          <button className="btn-s" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF(PAY_TYPES[0]));setClientSearch("");}}>Cancelar</button>
          <button className="btn-c">👁 Vista Previa</button>
          <button className="btn-p" onClick={submitWR}>{editWR?"Guardar Cambios ✅":"Registrar WR ✅"}</button>
        </div>
      </div>
    </div>
  );

  // ── WR DETAIL MODAL ─────────────────────────────────────────────────────────
  const renderWRDetail=()=>{
    if(!selWR)return null;
    const _oc=oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith((selWR.origCity||"").toUpperCase()))||_origOff;
    const _cl=clients.find(c=>c.id===selWR.clienteId);
    const _destAddr=_cl?[_cl.dir,_cl.municipio,_cl.estado,_cl.pais].filter(Boolean).join(" · "):"";
    const _usuarioWR=clients.find(c=>c.id===selWR.usuario)||currentUser;
    const _usuarioNombre=_usuarioWR?fullName(_usuarioWR):(selWR.usuario||"—");
    const _bcBars=(code)=>String(code).split("").map((ch,i)=>{const v=ch.charCodeAt(0);return v>32?<div key={i} style={{width:v%3===0?3:v%3===1?2:1,height:14+(v*3)%22,background:"var(--navy)",flexShrink:0,display:"inline-block"}}/>:null;});
    return (
    <div className="ov">
      <div className="modal mlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">📋 Warehouse Receipt</div>
          <div style={{display:"flex",gap:6}}>
            {hasPerm("editar_wr")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>{
              setEditWR(selWR);
              // Reconstruir cajas desde dims (almacenadas en cm y kg) → convertir a pulg/lb para el form
              const _rawCajas=selWR.dims&&selWR.dims.length>0
                ?selWR.dims.map(d=>({...emptyCaja(),
                    largo:d.l?parseFloat((d.l/2.54).toFixed(2)):"",
                    ancho:d.a?parseFloat((d.a/2.54).toFixed(2)):"",
                    alto:d.h?parseFloat((d.h/2.54).toFixed(2)):"",
                    pesoLb:d.pk?parseFloat((d.pk*2.205).toFixed(1)):"",
                    cantidad:1,
                    carrier:d.carrier||"",tracking:d.tracking||"",
                    numFactura:d.factura||"",descripcion:cleanReempaqueDesc(d.descripcion||""),
                  }))
                :[emptyCaja()];
              setWrf({...emptyWRF(PAY_TYPES[0]),
                unitDim:"in",unitPeso:"lb", // mostrar en pulg/lb (unidades originales)
                cajas:_rawCajas,
                consignee:selWR.consignee||"",casilleroSearch:selWR.casillero||"",casillero:selWR.casillero||"",clienteId:selWR.clienteId||"",
                sucursalEntrega:sucursalDeWR(selWR,cliDeWRCon(selWR,clients)),
                remitente:selWR.shipper||"",remitenteDir:selWR.remitenteDir||"",remitenteTel:selWR.remitenteTel||"",remitenteEmail:selWR.remitenteEmail||"",remitenteDoc:selWR.remitenteDoc||"",remitenteId:selWR.remitenteId||"",tipoPago:selWR.tipoPago||PAY_TYPES[0]||"",tipoEnvio:selWR.tipoEnvio||"",
                notas:selWR.notas||"",cargos:selWR.cargos||[],
              });
              setShowNewWR(true);setSelWR(null);
            }}>✏️ Editar</button>}
            {hasPerm("borrar_wr")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar WR ${selWR.id}? Esta acción no se puede deshacer.`)){setWrList(p=>p.filter(x=>x.id!==selWR.id));dbDeleteWR(selWR.id);logAction("Borró WR",selWR.id);setSelWR(null);}}}>🗑 Borrar</button>}
            {crElegible(selWR)&&hasPerm("hacer_egreso")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",background:"#E8F5E9",borderColor:"#81C784",color:"#2E7D32",fontWeight:700}} onClick={()=>{crOpenNew([selWR.id]);setSelWR(null);}} title="Registrar egreso individual de este WR">🚀 Egresar</button>}
            {dnElegible(selWR)&&hasPerm("entregar")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",background:"#E3F2FD",borderColor:"#64B5F6",color:"#1565C0",fontWeight:700}} onClick={()=>{const w=selWR;setSelWR(null);dnEntregarDesdeWR(w);}}>📝 Entregar</button>}
            {/* Facturar — visible si el rol tiene permiso, el WR no está bloqueado
                (no Reempacado 2.3 ni Egresado 25) y no tiene factura activa.
                Para PREPAID factura al remitente; para COD al receptor según clienteTipo. */}
            {(hasPerm("crear_factura")||hasPerm("facturar"))&&(hasPerm("saltar_bloqueos")||wrPuedeFacturarse(selWR))&&!facturas.some(f=>f.status!=="anulada"&&Array.isArray(f.wrIds)&&f.wrIds.includes(selWR.id))&&(()=>{
              const esPrepaid=(selWR.tipoPago||"").toLowerCase().includes("prepa");
              return (
                <button className="btn-s" style={{fontSize:12,padding:"4px 10px",background:"#FFF9E7",borderColor:"#F0C040",color:"#8B6914",fontWeight:700}}
                  title={esPrepaid?"Facturar PREPAID al remitente":"Facturar COD al receptor según tipo de cliente"}
                  onClick={()=>{
                    if(!selWR.tipoEnvio){window.alert("Asigna primero el tipo de envío del WR para poder calcular la tarifa.");return;}
                    facOpenNew(facConstruirWR(selWR));
                    setSelWR(null);
                  }}>💰 Facturar {esPrepaid?"PREPAID":"COD"}</button>
              );
            })()}
            <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir</button>
            <button className="mcl" onClick={()=>setSelWR(null)}>✕</button>
          </div>
        </div>
        {/* Panel "Entrega y Facturación" — visibilidad rápida de DN + facturas asociadas al WR */}
        {(()=>{
          const dnsRel=deliveryNotes.filter(n=>!n.anulado&&Array.isArray(n.wrIds)&&n.wrIds.includes(selWR.id));
          const facsRel=facturas.filter(f=>f.status!=="anulada"&&Array.isArray(f.wrIds)&&f.wrIds.includes(selWR.id));
          if(dnsRel.length===0&&facsRel.length===0)return null;
          const statusFacLabel={borrador:"📝 Borrador",emitida:"📤 Emitida",pagada_parcial:"💵 Parcial",pagada:"✅ Pagada"};
          const statusFacColor=(s)=>s==="pagada"?"var(--green)":s==="pagada_parcial"?"var(--orange)":s==="emitida"?"var(--cyan)":"var(--t3)";
          return (
            <div className="no-print" style={{padding:"10px 14px",background:"#F5F7FB",borderBottom:"1px solid var(--b1)",display:"flex",gap:18,flexWrap:"wrap",fontSize:13}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontWeight:700,color:"var(--t3)",textTransform:"uppercase",fontSize:11,letterSpacing:.5}}>📝 Entrega:</span>
                {dnsRel.length===0
                  ?<span style={{color:"var(--t4)"}}>sin nota</span>
                  :dnsRel.map(n=>(<span key={n.id} style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#E8F0FE",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0"}}>{n.id}</span>))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontWeight:700,color:"var(--t3)",textTransform:"uppercase",fontSize:11,letterSpacing:.5}}>💰 Facturación:</span>
                {facsRel.length===0
                  ?<span style={{color:"var(--t4)"}}>sin factura</span>
                  :facsRel.map(f=>(
                      <span key={f.id} style={{display:"inline-flex",alignItems:"center",gap:4,fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#FFF9E7",padding:"2px 6px",borderRadius:4,border:"1px solid #F0C040"}}>
                        {f.id} <span style={{fontSize:11,color:statusFacColor(f.status),fontWeight:700}}>{statusFacLabel[f.status]||f.status}</span>
                        <span style={{fontSize:11,color:"var(--t2)"}}>· {f.moneda} {(parseFloat(f.total)||0).toFixed(2)}{(parseFloat(f.saldo)||0)>0?` (saldo ${f.moneda} ${(parseFloat(f.saldo)||0).toFixed(2)})`:""}</span>
                      </span>
                    ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontWeight:700,color:"var(--t3)",textTransform:"uppercase",fontSize:11,letterSpacing:.5}}>💳 Tipo Pago:</span>
                <span style={{fontWeight:700,color:(selWR.tipoPago||"").toLowerCase().includes("prepa")?"#1A6090":"var(--orange)"}}>{selWR.tipoPago||"—"}</span>
              </div>
            </div>
          );
        })()}
        {/* Bloque F — Banner cuando el WR fue REEMPACADO (queda fijo en estado 2.3) */}
        {selWR.status?.code==="2.3"&&(
          <div className="no-print" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#FFF8E1",borderBottom:"2px solid #FFC107",flexWrap:"wrap"}}>
            <span style={{fontSize:18}}>🔁</span>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontSize:13,fontWeight:700,color:"#7A5C00"}}>WR Reempacado — estado fijo</div>
              <div style={{fontSize:12,color:"#7A5C00"}}>
                Este WR fue reempacado en <strong>{selWR.reempacadoEn||"otro WR"}</strong>.
              </div>
            </div>
            {selWR.reempacadoEn&&(
              <button className="btn-s" style={{fontSize:12,padding:"4px 10px"}}
                onClick={()=>{const nuevo=wrList.find(x=>x.id===selWR.reempacadoEn);if(nuevo)setSelWR(nuevo);}}
                title="Abrir el WR de reempaque">→ Ver {selWR.reempacadoEn}</button>
            )}
          </div>
        )}
        {/* Barra de confirmación por tipo de envío — solo si el WR es modificable
            (estados 1, 2 o 3). Reempacado, Egresado y Consolidado+ quedan fijos. */}
        {canEdit&&!wrTipoFijo(selWR)&&(hasPerm("saltar_bloqueos")||wrEsModificable(selWR))&&(
          <div className="no-print" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:"var(--bg4)",borderBottom:"1px solid var(--b1)",flexWrap:"wrap"}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.5}}>Tipo de Envío:</div>
            <select className="fs" style={{fontSize:13,padding:"4px 8px",minWidth:180}} value={selWR.tipoEnvio||""}
              onChange={e=>{
                const v=e.target.value;
                if(v===selWR.tipoEnvio)return;
                if(!v){
                  if(selWR.status?.code==="3"){
                    if(!window.confirm(`¿Quitar tipo de envío del WR ${selWR.id}?\n\nTambién se revertirá la confirmación.`))return;
                  } else if(selWR.tipoEnvio&&!window.confirm(`¿Quitar tipo de envío del WR ${selWR.id}?`))return;
                }
                assignTipoEnvio(selWR,v);
              }}>
              <option value="">— Sin asignar —</option>
              {SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            {selWR.tipoEnvio
              ?<span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>✓ {selWR.status?.code==="3"?"Confirmado":"Tipo asignado"}</span>
              :<span style={{fontSize:12,color:"var(--orange)",fontWeight:600}}>⚠️ Asigna un tipo para confirmar el WR</span>}
            {selWR.status?.code==="3"&&hasPerm("desconfirmar")&&(
              <button className="btn-s" style={{fontSize:12,padding:"4px 10px",color:"var(--orange)",borderColor:"var(--orange)",marginLeft:"auto"}}
                onClick={()=>revertirConfirmacion(selWR)}
                title="Devolver este WR al estado anterior (antes de confirmar)">↩️ Revertir Confirmación</button>
            )}
          </div>
        )}
        <div className="wr-doc">
          <div className="wr-doc-hd">
            <div>
              <div className="wr-co">{getHeaderName(selWR,clients,agentes,oficinas,empresaNombre)}</div>
              <div className="wr-co-info">
                International Courier · {selWR.branch||_oc?.nombre||"Casa Matriz"}<br/>
                {_oc?.ciudad||selWR.origCity||"Miami"}{_oc?.pais?`, ${_oc.pais}`:""}<br/>
                {[_oc?.tel,_oc?.email].filter(Boolean).join(" · ")||"ops@enex.com"}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:"var(--t2)",marginBottom:2}}>Warehouse Receipt</div>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"flex-end",marginBottom:2}}><WRBarcode value={selWR.id} height={24} width={1.4}/></div>
              <div className="wr-num-d">{selWR.id}</div>
              <div className="wr-num-meta">
                📍 {selWR.origCity||"—"} → {selWR.destCity||"—"}<br/>
                {fmtDate(selWR.fecha)} {fmtTime(selWR.fecha)}<br/>
                Recibió: {_usuarioNombre}
              </div>
              <div style={{marginTop:6}}><StBadge st={selWR.status}/></div>
            </div>
          </div>
          <div className="w2c wr-partes">
            <div className="wb">
              <div className="wb-t">📤 Remitente / Shipper</div>
              <div className="wf"><div className="wfl">Nombre / Empresa</div><div className="wfv" style={{fontWeight:800,fontSize:20}}>{selWR.shipper||"—"}</div></div>
              <div className="wf"><div className="wfl">Recibido en</div><div className="wfv" style={{fontWeight:600}}>{_oc?.nombre||selWR.branch||"Casa Matriz"}{_oc?.ciudad?` — ${_oc.ciudad}`:""}</div></div>
              <div className="wf"><div className="wfl">Procedencia</div><div className="wfv">{selWR.remitenteDir||""}</div></div>
              {selWR.remitenteDoc&&<div className="wf"><div className="wfl">ID Identificación</div><div className="wfv">{selWR.remitenteDoc}</div></div>}
              {(selWR.remitenteTel||selWR.remitenteEmail)&&<div className="wf"><div className="wfl">Contacto</div><div className="wfv">{[selWR.remitenteTel,selWR.remitenteEmail].filter(Boolean).join(" · ")}</div></div>}
            </div>
            <div className="wb">
              <div className="wb-t">📥 Consignatario / Consignee</div>
              <div className="wf"><div className="wfl">Nombre</div><div className="wfv" style={{fontWeight:800,fontSize:20}}>{selWR.consignee||"—"}</div></div>
              <div className="wf"><div className="wfl">Casillero</div><div className="wfv" style={{color:"var(--gold2)",fontWeight:800,fontSize:20}}>#{selWR.casillero||"—"}</div></div>
              {_destAddr&&<div className="wf"><div className="wfl">Dirección</div><div className="wfv">{_destAddr}</div></div>}
              <div className="wf"><div className="wfl">Sucursal de entrega</div><div className="wfv" style={{fontWeight:600}}>{(()=>{const id=sucursalDeWR(selWR,cliDeWRCon(selWR,clients));const o=oficinas.find(x=>x.id===id);return o?`🏢 ${o.nombre}${o.ciudad?` — ${o.ciudad}`:""}`:"🏛️ Principal";})()}</div></div>
              <div className="wf"><div className="wfl">Ciudad Destino</div><div className="wfv" style={{fontWeight:600,color:"var(--navy)"}}>{selWR.destCity||"—"} · {selWR.destCountry||"—"}</div></div>
              {_cl?.tel1&&<div className="wf"><div className="wfl">Teléfono</div><div className="wfv">{_cl.tel1}</div></div>}
              {_cl?.email&&<div className="wf"><div className="wfl">Email</div><div className="wfv">{_cl.email}</div></div>}
            </div>
          </div>
          {/* SECCIÓN: TIPO PAGO / ENVÍO / CARGOS / NOTAS — reemplaza la sección de transportista */}
          <div className="wb" style={{marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr",gap:12}}>
              <div>
                <div className="wb-t">💳 Tipo de Pago</div>
                <div style={{fontWeight:600,fontSize:14,color:"var(--t1)"}}>{selWR.tipoPago||"—"}</div>
              </div>
              <div>
                <div className="wb-t">✈️ Tipo de Envío</div>
                <div><TypeBadge t={selWR.tipoEnvio}/></div>
              </div>
              <div>
                <div className="wb-t">⚡ Cargos Aplicables</div>
                <div style={{fontSize:13,color:"var(--t2)"}}>{selWR.cargos&&selWR.cargos.length>0?selWR.cargos.join(", "):"—"}</div>
              </div>
              <div>
                <div className="wb-t">📝 Notas y Observaciones</div>
                <div style={{fontSize:14,color:"var(--orange)",fontWeight:500,minHeight:32}}>{selWR.notas||"—"}</div>
              </div>
            </div>
          </div>
          <div className="wb" style={{marginBottom:12}}>
            <div className="wb-t" style={{fontSize:16}}>📐 Dimensiones y Peso — {selWR.cajas} {selWR.cajas===1?"caja":"cajas"}</div>
            {selWR.dims&&selWR.dims.length>0&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"30px 1.4fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:6,marginBottom:4,padding:"4px 0",borderBottom:"2px solid var(--navy)"}}>
                  {["#","Dims (in)","Lb.","Lb. Vol","Ft³","M³","Kg.","Kg. Vol","Tracking","Carrier"].map(h=>(
                    <div key={h} style={{fontSize:16,color:"var(--navy)",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>
                  ))}
                </div>
                {selWR.dims.map((d,i)=>{
                  const dv=calcVol(d.l,d.a,d.h,"cm");
                  const trk=d.tracking||selWR.tracking||"—";
                  const car=d.carrier||selWR.carrier||"—";
                  return (
                    <div key={i} style={{borderBottom:"1px solid var(--b2)",paddingBottom:6,marginBottom:4}}>
                      <div style={{display:"grid",gridTemplateColumns:"30px 1.4fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:6,padding:"4px 0",alignItems:"center"}}>
                        <div style={{fontWeight:700,color:"var(--navy)",fontSize:16}}>{i+1}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16}}>{toIn(d.l)}×{toIn(d.a)}×{toIn(d.h)}"</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:600}}>{toLb(d.pk)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--orange)",fontWeight:700}}>{dv.volLb}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--sky)"}}>{dv.ft3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--teal)"}}>{dv.m3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--t2)"}}>{d.pk?.toFixed?.(2)||"—"}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--orange)"}}>{dv.volKg}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:"var(--cyan)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trk}</div>
                        <div style={{fontWeight:700,fontSize:16,color:"var(--navy)"}}>{car}</div>
                      </div>
                      {(()=>{const _dDesc=cleanReempaqueDesc(d.descripcion);return _dDesc&&<div style={{fontSize:16,color:"var(--t2)",paddingLeft:28,marginTop:2}}>📦 {_dDesc}</div>;})()}
                      {d.factura&&<div style={{fontSize:16,color:"var(--t3)",paddingLeft:28}}>Factura: {d.factura}</div>}
                    </div>
                  );
                })}
                {/* Totales */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:10}}>
                  {[["Peso Total",`${selWR.pesoLb}lb / ${selWR.pesoKg}kg`,"var(--t1)"],["P.Vol. Total",`${selWR.volLb||"—"}lb / ${selWR.volKg}kg`,"var(--orange)"],["Ft³",String(selWR.ft3),"var(--sky)"],["M³",String(selWR.m3),"var(--teal)"],["Descripción",cleanReempaqueDesc(selWR.descripcion)||"—","var(--t1)"],["Valor Declarado",`$${typeof selWR.valor==="number"?selWR.valor.toFixed(2):selWR.valor}`,"var(--green)"]].map(([l,v,c])=>(
                    <div key={l} className="wf"><div className="wfl" style={{fontSize:12}}>{l}</div><div className="wfv" style={{color:c,fontSize:18,fontWeight:700}}>{v}</div></div>
                  ))}
                </div>
              </>
            )}
          </div>
          {hasPerm("override_estado")&&(
            <div className="no-print" style={{marginBottom:12,display:"flex",justifyContent:"flex-end"}}>
              <button className="btn-s" style={{fontSize:13,padding:"5px 12px",borderColor:"var(--orange)",color:"var(--orange)",fontWeight:700}}
                onClick={()=>setOverrideModal({wr:selWR,codigoDestino:selWR.status?.code||"",motivo:""})}>🛠 Forzar Estado</button>
            </div>
          )}
          {/* 📅 HISTORIA Y FECHAS — línea de tiempo de hitos del WR */}
          <div className="wb" style={{marginBottom:12}}>
            <div className="wb-t">📅 Historia y Fechas</div>
            <div style={{padding:"6px 4px"}}>
              {renderWRTimeline(selWR)}
            </div>
          </div>
          <div className="wr-legal" style={{whiteSpace:"pre-line"}}>{notaLegalWR(selWR)}</div>
          {/* Bloque de entrega/firma eliminado — la entrega ahora se gestiona vía Notas de Entrega (Delivery Notes) */}
        </div>
        {/* ══ DOCUMENTO DE IMPRESIÓN — solo visible con window.print() ══ */}
        {/* ══ DOCUMENTO DE IMPRESIÓN — solo visible con window.print() ══ */}
        <div className="wr-print-only">
          {(()=>{
            const P={fontFamily:"Arial,Helvetica,sans-serif",fontSize:13,color:"#000",lineHeight:1.4};
            const TH={border:"1px solid #888",padding:"3px 6px",background:"#ccc",fontSize:12,fontWeight:700,textAlign:"left"};
            const TD={border:"1px solid #888",padding:"4px 6px",fontSize:13,verticalAlign:"top"};
            const _cl2=clients.find(c=>c.id===selWR.clienteId);
            const _da=[_cl2?.dir,_cl2?.municipio,_cl2?.estado,_cl2?.pais].filter(Boolean).join(", ");
            const _oc2=oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith((selWR.origCity||"").toUpperCase()))||_origOff;
            return(
            <div style={{...P,padding:0,margin:0}}>

              {/* ── CABECERA ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:2}}><tbody><tr>
                {/* izquierda: empresa */}
                <td style={{verticalAlign:"top",paddingRight:16,width:"52%"}}>
                  <div style={{fontSize:34,fontWeight:900,letterSpacing:3,lineHeight:1,marginBottom:4,fontFamily:"Arial Black,Arial,sans-serif"}}>{getHeaderName(selWR,clients,agentes,oficinas,empresaNombre)}</div>
                  <div style={{fontSize:13,marginBottom:2}}>{_oc2?.ciudad||selWR.origCity||""}{_oc2?.pais?`, ${_oc2.pais}`:""}</div>
                  {_oc2?.email&&<div style={{fontSize:12,marginTop:2}}>{_oc2.email}</div>}
                  {_oc2?.tel&&<div style={{fontSize:12}}>Phone: {_oc2.tel}</div>}
                  <div style={{fontSize:11,color:"#666",marginTop:6}}>Powered by {empresaNombre} Courier System</div>
                </td>
                {/* derecha: WR # + barcode real */}
                <td style={{verticalAlign:"top",textAlign:"right",width:"48%"}}>
                  <div style={{fontSize:12,color:"#555",marginBottom:1}}>Warehouse Receipt #:</div>
                  <div style={{fontSize:30,fontWeight:900,fontFamily:"'Courier New',monospace",letterSpacing:2,lineHeight:1,marginBottom:3}}>{selWR.id}</div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:2}}>
                    <WRBarcode value={selWR.id} height={45} width={2}/>
                  </div>
                  <div style={{fontSize:11,color:"#444",marginTop:3}}>
                    Printed: {fmtDate(selWR.fecha)} {fmtTime(selWR.fecha)} | Received By: {_usuarioNombre}
                  </div>
                </td>
              </tr></tbody></table>

              {/* ── SHIPPER | CONSIGNEE ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0}}><tbody>
                <tr>
                  <td style={{...TH,width:"50%",borderRight:"none"}}>Shipper Information</td>
                  <td style={TH}>Consignee Information</td>
                </tr>
                <tr>
                  <td style={{...TD,borderRight:"none",borderTop:"none",minHeight:70}}>
                    <div style={{fontWeight:700}}>{selWR.shipper||"—"}</div>
                    {selWR.remitenteDir&&<div style={{fontSize:12,marginTop:2}}>{selWR.remitenteDir}</div>}
                  </td>
                  <td style={{...TD,borderTop:"none"}}>
                    <div style={{fontWeight:700,fontSize:14}}>{selWR.consignee||"—"}</div>
                    <div style={{fontSize:12,fontWeight:700,color:"#333",marginTop:2}}>#{selWR.casillero||"—"}</div>
                    {_da&&<div style={{fontSize:12,marginTop:2}}>{_da}</div>}
                    <div style={{fontSize:12,marginTop:4}}>{selWR.destCity||"—"}, {(selWR.destCountry||"").replace(/[^\w\s]/gi,"").trim()}</div>
                  </td>
                </tr>
              </tbody></table>

              {/* ── PAYMENT INFO | CIUDAD DESTINO ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0}}><tbody>
                <tr>
                  <td style={{...TD,borderTop:"none",width:"55%",padding:"3px 6px"}}>
                    <div style={{fontSize:10,color:"#555"}}>Payment Type | Shipment Type | # Casillero | Insurance | Tipo Cliente</div>
                    <div style={{fontSize:13,fontWeight:600}}>{selWR.tipoPago||"—"} | {selWR.tipoEnvio||"POR DEFINIR"} | # {selWR.casillero||"—"} | | {(()=>{const c=_cl2;if(!c)return"—";if(c.clienteTipo==="matriz")return"Matriz";if(c.clienteTipo==="agente")return"Agente";return c.clienteTipo||"Cliente";})()}</div>
                  </td>
                  <td style={{...TD,borderTop:"none",borderLeft:"none",fontSize:16,fontWeight:700}}>
                    Ciudad Destino: {selWR.destCity||"—"}
                  </td>
                </tr>
              </tbody></table>

              {/* ── NOTAS ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0}}><tbody>
                <tr><td style={{...TD,borderTop:"none",minHeight:36,padding:"4px 6px"}}>
                  <span style={{fontWeight:700,fontSize:12}}>Notas:</span>{selWR.notas?" "+selWR.notas:""}
                </td></tr>
              </tbody></table>

              {/* ── TABLA DE DIMENSIONES — 12 p1, 15 resto ── */}
              {(()=>{
                const R1=12,RN=15;
                const allDims=selWR.dims&&selWR.dims.length>0?selWR.dims:[];
                const cajasCount=parseInt(selWR.cajas)||0;
                const totalRows=Math.max(allDims.length,cajasCount);
                const rows=Array.from({length:Math.max(totalRows,1)},(_,i)=>allDims[i]||{});
                const chunks=[rows.slice(0,R1)];
                for(let i=R1;i<rows.length;i+=RN)chunks.push(rows.slice(i,i+RN));
                const totalPages=chunks.length;
                const DimThead=()=><thead><tr>
                  <th style={{...TH,width:"7%"}}>Line/Qty</th>
                  <th style={{...TH,width:"15%"}}>Dimensions (In)</th>
                  <th style={{...TH,width:"33%"}}>Tracking</th>
                  <th style={{...TH,width:"12%",textAlign:"right"}}>Weight lb</th>
                  <th style={{...TH,width:"12%",textAlign:"right"}}>Vol lb</th>
                  <th style={{...TH,width:"10%",textAlign:"right"}}>Ft³</th>
                  <th style={{...TH,width:"11%",textAlign:"right"}}>M³</th>
                </tr></thead>;
                const renderChunk=(chunk,pi)=>{
                  const offset=pi===0?0:R1+(pi-1)*RN;
                  const isLast=pi===totalPages-1;
                  return(
                  <div key={pi} style={pi>0?{pageBreakBefore:"always",paddingTop:"0.45in"}:{}}>
                    {pi>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #000",paddingBottom:4,marginBottom:6,fontSize:12}}>
                      <span style={{fontWeight:700}}>{empresaNombre}</span>
                      <span>WR# {selWR.id}</span>
                      <span>{selWR.consignee} | #{selWR.casillero}</span>
                      <span>Pág. {pi+1}/{totalPages}</span>
                    </div>}
                    <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0,marginTop:pi===0?4:0}}>
                      <DimThead/>
                      <tbody>
                        {chunk.length===0?<tr><td colSpan={7} style={{...TD,textAlign:"center",height:60,color:"#999"}}>Sin dimensiones registradas</td></tr>
                        :chunk.map((d,i)=>{
                          const idx=offset+i;
                          const hasDims=d.l||d.a||d.h;
                          const dv=hasDims?calcVol(d.l||0,d.a||0,d.h||0,"cm"):{volLb:0,ft3:0,m3:0};
                          return(
                          <tr key={idx}>
                            <td style={{...TD,verticalAlign:"top"}}>{idx+1}</td>
                            <td style={{...TD,verticalAlign:"top"}}>
                              {hasDims?<div>{toIn(d.l)}x{toIn(d.a)}x{toIn(d.h)}</div>:<div style={{color:"#999"}}>—</div>}
                              {d.carrier&&<div style={{fontSize:11,color:"#555"}}>{d.carrier}</div>}
                            </td>
                            <td style={{...TD,fontSize:12,verticalAlign:"top",fontFamily:"'Courier New',monospace"}}>
                              {d.tracking&&<div>{d.tracking}</div>}
                              {d.descripcion&&<div style={{fontSize:12,fontFamily:"Arial",color:"#222"}}>{d.descripcion}</div>}
                              {d.factura&&<div style={{fontSize:11,fontFamily:"Arial",color:"#555"}}>Fact: {d.factura}</div>}
                            </td>
                            <td style={{...TD,textAlign:"right",fontWeight:700}}>{d.pk?toLb(d.pk):"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.volLb:"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.ft3:"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.m3:"—"}</td>
                          </tr>);
                        })}
                      </tbody>
                      {isLast&&<tfoot>
                        <tr style={{background:"#f0f0f0"}}>
                          <td style={{...TD,fontWeight:700}}>Pzas: {selWR.cajas||0}</td>
                          <td style={TD}></td><td style={TD}></td>
                          <td style={{...TD,fontWeight:700,textAlign:"right"}}>{selWR.pesoLb}</td>
                          <td style={{...TD,fontWeight:700,textAlign:"right"}}>{selWR.volLb||"—"}</td>
                          <td style={{...TD,fontWeight:700,textAlign:"right"}}>{selWR.ft3}</td>
                          <td style={{...TD,fontWeight:700,textAlign:"right"}}>{selWR.m3||"—"}</td>
                        </tr>
                      </tfoot>}
                    </table>
                  </div>);
                };
                return chunks.map((chunk,pi)=>renderChunk(chunk,pi));
              })()}

              {/* Bloque "Entregado por" eliminado — la entrega se imprime ahora vía Nota de Entrega */}

              {/* ── 3 CASILLAS: EMPRESA · NOMBRE · FIRMA ── */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:10,marginBottom:6}}>
                <div style={{border:"1px solid #999",borderRadius:4,minHeight:54,display:"flex",flexDirection:"column"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:.4,padding:"3px 6px",borderBottom:"1px solid #ccc",background:"#f5f5f5"}}>Empresa</div>
                  <div style={{flex:1}}/>
                </div>
                <div style={{border:"1px solid #999",borderRadius:4,minHeight:54,display:"flex",flexDirection:"column"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:.4,padding:"3px 6px",borderBottom:"1px solid #ccc",background:"#f5f5f5"}}>Nombre</div>
                  <div style={{flex:1}}/>
                </div>
                <div style={{border:"1px solid #999",borderRadius:4,minHeight:54,display:"flex",flexDirection:"column"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:.4,padding:"3px 6px",borderBottom:"1px solid #ccc",background:"#f5f5f5"}}>Firma</div>
                  <div style={{flex:1}}/>
                </div>
              </div>

              {/* ── TEXTO LEGAL ── */}
              <div style={{fontSize:11,lineHeight:1.6,color:"#333",textAlign:"center",marginTop:8,borderTop:"1px solid #ccc",paddingTop:6}}>
                <div style={{whiteSpace:"pre-line"}}>{notaLegalWR(selWR)}</div>
              </div>

            </div>);
          })()}
        </div>

        <div className="mft">
          <button className="btn-s" onClick={()=>setSelWR(null)}>Cerrar</button>
          <button className="btn-g" style={{fontSize:12,padding:"4px 10px"}}>📧 Enviar al Cliente</button>
        </div>
      </div>
    </div>
  );};

  // ── STAT MODAL (clickable stats) ────────────────────────────────────────────
  const renderStatModal=()=>showStatModal&&(
    <div className="ov">
      <div className="modal mlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">{showStatModal.ic} {showStatModal.label} — {showStatModal.rows.length} registros</div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir lista</button>
            <button className="mcl" onClick={()=>setShowStatModal(null)}>✕</button>
          </div>
        </div>
        <div style={{overflowX:"auto",maxHeight:"70vh",overflowY:"auto"}}>
          <table className="wt" style={{minWidth:900}}>
            <thead><tr>
              <th>N° WR</th><th>Fecha</th><th>Consignatario</th><th>Casillero</th>
              <th>Carrier</th><th>Tracking</th><th>Valor</th><th>Peso</th><th>Estado</th><th>Tipo Envío</th>
            </tr></thead>
            <tbody>
              {showStatModal.rows.map(w=>(
                <tr key={w.id}>
                  <td><span className="c-wr">{w.id}</span></td>
                  <td><div className="c-dt">{fmtDate(w.fecha)}</div></td>
                  <td><div className="c-name">{w.consignee}</div></td>
                  <td><span className="c-cas">{w.casillero}</span></td>
                  <td><CarBadge c={w.carrier}/></td>
                  <td><span className="c-trk">{w.tracking}</span></td>
                  <td><span className="c-val">${w.valor.toFixed(2)}</span></td>
                  <td><span className="c-wt">{w.pesoKg}kg</span></td>
                  <td><StBadge st={w.status}/></td>
                  <td><TypeBadge t={w.tipoEnvio}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mft"><button className="btn-s" onClick={()=>setShowStatModal(null)}>Cerrar</button></div>
      </div>
    </div>
  );

  // ── ESTADO DE CUENTA ────────────────────────────────────────────────────────

  const buscarCliente=(q)=>{
    setEcSearch(q);
    setEcCliente(null);
    const t=q.trim(), bq=crearBuscador(t);
    if(!bq||(t.length<2&&!/^\d$/.test(t))){setEcResults([]);return;}
    const res=clientesVisibles.filter(c=>c.tipo==="cliente"&&(
      bq.casillero(c.casillero)||(t.length>=2&&(
      fullName(c).toLowerCase().includes(q.toLowerCase())||
      (c.casillero||"").toLowerCase().includes(q.toLowerCase())||
      (c.email||"").toLowerCase().includes(q.toLowerCase())||
      (c.tel1||"").includes(q)||(c.tel2||"").includes(q)))
    ));
    setEcResults(res);
  };

  // Clientes que pertenecen a un agente / oficina / autónomo (misma regla que la
  // columna "Branch" del Dashboard: tipo de cliente + id del responsable).
  const clientesDeGrupo=(g)=>{
    if(!g)return [];
    return clients.filter(c=>{
      if(c.tipo!=="cliente")return false;
      const ct=c.clienteTipo||"";
      if(g.tipo==="agente")  return ["agente","vendedor_agente"].includes(ct)&&c.agenteId===g.id;
      if(g.tipo==="oficina") return false; // las oficinas no tienen clientes: se usa su carga (ecWRsDeOficina)
      if(g.tipo==="autonomo")return ct==="autonomo"&&c.autonomoId===g.id;
      return false;
    });
  };
  // Branch al que pertenece un cliente — misma regla que la columna "Branch" del Dashboard.
  const branchDeCliente=(cl)=>{
    const ct=cl?.clienteTipo||"";
    if(ct==="matriz")return{ic:"🏛️",nombre:empresaNombre||"Casa Matriz",tipo:"Casa Matriz"};
    if(ct==="agente"||ct==="vendedor_agente"){const ag=agentes.find(a=>a.id===cl.agenteId);return{ic:ct==="agente"?"🤝":"💼",nombre:ag?.nombre||ag?.codigo||"⚠️ Sin agente",tipo:ct==="agente"?"Agente":"Vend. Agente"};}
    if(ct==="oficina"||ct==="vendedor_oficina"){const of=oficinas.find(o=>o.id===cl.oficinaId);return{ic:ct==="oficina"?"🏢":"🛒",nombre:of?.nombre||of?.codigo||"⚠️ Sin oficina",tipo:ct==="oficina"?"Oficina":"Vend. Oficina"};}
    if(ct==="autonomo"){const au=clients.find(c=>c.id===cl.autonomoId);return{ic:"🧑‍💻",nombre:au?`${au.primerNombre||""} ${au.primerApellido||""}`.trim():"⚠️ Sin autónomo",tipo:"Autónomo"};}
    return null;
  };
  // Carga de una oficina: lo que recibe como sucursal de entrega y lo que envía como oficina de salida
  const ecWRsDeOficina=g=>{
    const of=oficinas.find(o=>o.id===g?.id);
    if(!of)return [];
    return wrList.filter(w=>!!wrRolOficina(w,of,{clients,deliveryNotes,countries:COUNTRIES}));
  };
  const ecCambiarModo=(m)=>{setEcModo(m);setEcCliente(null);setEcGrupo(null);setEcSearch("");setEcResults([]);};
  const selEcGrupo=(g)=>{setEcGrupo(g);setEcSearch(g.nombre+(g.sub?" — "+g.sub:""));};
  const selEcCliente=(c)=>{
    setEcCliente(c);
    setEcSearch(fullName(c)+" — "+c.casillero);
    setEcResults([]);
  };

  // Devuelve la fecha real del evento solicitado leyendo el historial del WR.
  // Misma filosofía que getWRTimeline: una etapa se considera alcanzada si
  // existe su evento literal en historial O si el estado actual / cualquier
  // evento del historial es posterior en el flujo. Las fechas se toman del
  // evento literal cuando existe; si no, se infieren de una fuente externa
  // autoritativa (guía consolidada para "consolidado", nota de entrega para
  // "entregado", factura pagada para "cobrado"). NUNCA se infieren del
  // siguiente evento posterior — eso causaría que dos columnas compartan
  // fecha. Si está alcanzado sin fecha exacta, devuelve "—" en vez de mentir.
  //
  // Códigos por etapa:
  //   recibido     → evento "1" (o w.fecha como base si "1" no está en hist)
  //   confirmado   → evento "3"
  //   consolidado  → evento "4" (fallback: fecha de la guía consolidada)
  //   enviado      → primer evento de tránsito (5,6,6.2,7,8,9,10,11,12,13)
  //   almacen_dest → evento "17"
  //   entregado    → evento "21" (fallback: fecha de nota de entrega activa)
  //   cobrado      → evento "23" (fallback: fechaEmision de factura pagada)
  const getStatusDate=(w,code)=>{
    if(!w||!w.status)return"—";
    const hist=Array.isArray(w.historial)?w.historial:[];
    const findFirst=(codes)=>hist.find(h=>codes.includes(String(h.code)));
    const currentCode=w.status.code;
    // Detector de confirmación vigente: si después del último evento "3"
    // aparece en historial un evento con code "1" o "2", la confirmación
    // se revirtió y no debe contarse como vigente (aunque el evento "3"
    // siga en el log para auditoría).
    const findConfirmacionVigente=()=>{
      const lastConfIdx=(()=>{
        for(let i=hist.length-1;i>=0;i--){
          if(String(hist[i].code)==="3")return i;
        }
        return -1;
      })();
      if(lastConfIdx<0)return null;
      const revertido=hist.slice(lastConfIdx+1).some(h=>["1","2"].includes(String(h.code)));
      return revertido?null:hist[lastConfIdx];
    };
    const POST={
      recibido:     ["3","4","5","6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25","2.3"],
      confirmado:   ["4","5","6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"],
      consolidado: ["5","6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"],
      enviado:      ["6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"],
      almacen_dest: ["18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"],
      entregado:    ["22","23"],
      cobrado:      [],
    };
    const LITERAL={
      recibido:     ["1"],
      confirmado:   ["3"],
      consolidado: ["4"],
      enviado:      ["5","6","6.2","7","8","9","10","11","12","13"],
      almacen_dest: ["17"],
      entregado:    ["21"],
      cobrado:      ["23"],
    };
    const reached=(cat)=>{
      const lit=findFirst(LITERAL[cat]);
      if(lit)return true;
      if(LITERAL[cat].includes(currentCode))return true;
      if(POST[cat].includes(currentCode))return true;
      if(hist.some(h=>POST[cat].includes(String(h.code))))return true;
      return false;
    };
    if(code==="recibido"){
      // Caso especial: "recibido" es la creación del WR; siempre tiene w.fecha
      if(!w.fecha&&!reached("recibido"))return"—";
      const lit=findFirst(LITERAL.recibido);
      return fmtDate(lit?.fecha||w.fecha);
    }
    if(code==="confirmado"){
      // Caso especial: la confirmación puede haber sido revertida.
      // Si fue revertida y el WR no avanzó después por otra vía
      // (no hay estados posteriores que impliquen confirmación), no
      // mostrar fecha. Si hubo avance posterior real, mostramos la
      // fecha de la confirmación vigente (o "—" si no se conserva).
      const confVig=findConfirmacionVigente();
      if(confVig)return fmtDate(confVig.fecha);
      // Sin confirmación vigente: si el WR está/estuvo en estados
      // que implican confirmación (17, 20, etc.), conservamos "reached"
      // pero sin fecha. Si no, devolvemos "—".
      if(!reached("confirmado"))return"—";
      return "—"; // alcanzado por inferencia pero sin fecha exacta confiable
    }
    if(!reached(code))return"—";
    const lit=findFirst(LITERAL[code]||[]);
    if(lit)return fmtDate(lit.fecha);
    // Fuentes externas autoritativas
    if(code==="consolidado"){
      const guia=consolList.find(c=>(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))||(c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id)));
      if(guia?.fecha)return fmtDate(guia.fecha);
    }
    if(code==="entregado"){
      const dn=(deliveryNotes||[]).find(n=>!n.anulado&&Array.isArray(n.wrIds)&&n.wrIds.includes(w.id));
      if(dn?.fecha)return fmtDate(dn.fecha);
    }
    if(code==="cobrado"){
      const fac=(facturas||[]).find(f=>f.status==="pagada"&&Array.isArray(f.wrIds)&&f.wrIds.includes(w.id));
      if(fac?.fechaEmision||fac?.fecha)return fmtDate(fac.fechaEmision||fac.fecha);
    }
    return "—";
  };

  // N° Guía: lee el ID real de la guía consolidada del WR (consolList).
  // Antes generaba un placeholder fake "GU-" + slice del ID del WR.
  const getNumGuia=(w)=>{
    if(!w)return"—";
    const guia=consolList.find(c=>{
      if(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))return true;
      return (c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id));
    });
    return guia?.id||"—";
  };

  // ── IMPRESIÓN DE GUÍA ARCHIVADA (Recepción en Almacén) ────────────────────
  // Abre una ventana con un HTML imprimible: header de la guía, contenedores
  // (con sus WRs) y totales. Pensado para archivo físico al cerrar la recepción.
  const printGuiaArchivada=(c)=>{
    if(!c){window.alert("Guía no encontrada.");return;}
    const fechaImp=new Date().toLocaleString("es-VE",{dateStyle:"medium",timeStyle:"short"});
    const fmtD=(d)=>d?new Date(d).toLocaleDateString("es-VE",{day:"2-digit",month:"2-digit",year:"numeric"}):"—";
    const escapeHtml=(s)=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
    const containers=Array.isArray(c.containers)?c.containers:[];
    const totalWR=c.totalWR||containers.reduce((s,ct)=>s+(ct.wr?.length||0),0);
    const totalCajas=c.totalCajas||containers.reduce((s,ct)=>s+(ct.wr||[]).reduce((a,w)=>a+(w.cajas||1),0),0);
    const totalLb=c.totalLb||containers.reduce((s,ct)=>s+(ct.wr||[]).reduce((a,w)=>a+(w.pesoLb||0),0),0);
    const totalFt3=c.totalFt3||containers.reduce((s,ct)=>s+(ct.wr||[]).reduce((a,w)=>a+(w.ft3||0),0),0);
    const contBlocks=containers.map((ct,i)=>{
      const dimsTxt=[ct.largo,ct.ancho,ct.alto].filter(Boolean).join(" × ");
      const wrRows=(ct.wr||[]).map((w,wi)=>`
        <tr>
          <td style="border:1px solid #999;padding:3px 6px">${wi+1}</td>
          <td style="border:1px solid #999;padding:3px 6px;font-family:monospace;font-weight:700">${escapeHtml(w.id)}</td>
          <td style="border:1px solid #999;padding:3px 6px">${escapeHtml(w.consignee||"—")}</td>
          <td style="border:1px solid #999;padding:3px 6px;text-align:center">${w.cajas||0}</td>
          <td style="border:1px solid #999;padding:3px 6px;text-align:right;font-family:monospace">${(w.pesoLb||0).toFixed?(w.pesoLb||0).toFixed(1):w.pesoLb||0}lb</td>
          <td style="border:1px solid #999;padding:3px 6px;font-family:monospace">${w.ft3||"—"}</td>
          <td style="border:1px solid #999;padding:3px 6px">${escapeHtml(cleanReempaqueDesc(w.descripcion||"")||"—")}</td>
        </tr>`).join("")||`<tr><td colspan="7" style="border:1px solid #999;padding:8px;text-align:center;color:#999">(sin WR)</td></tr>`;
      return `
        <div style="border:2px solid #1A2B4A;border-radius:6px;margin-bottom:10px;overflow:hidden">
          <div style="background:#1A2B4A;color:#fff;padding:6px 10px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:700">📦 Contenedor ${i+1}${ct.tipo?` — ${escapeHtml(ct.tipo)}`:""}</span>
            <span style="font-size:11px;color:#E5AE3A">${dimsTxt?escapeHtml(dimsTxt)+" in":""}${ct.sello?` · Sello: ${escapeHtml(ct.sello)}`:""}${ct.pesoLb?` · ${ct.pesoLb}lb`:""}</span>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead><tr style="background:#F0F4FA">
              <th style="border:1px solid #999;padding:4px 6px;text-align:left">#</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:left">N° WR</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:left">Consignatario</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:center">Cajas</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:right">Peso</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:left">Ft³</th>
              <th style="border:1px solid #999;padding:4px 6px;text-align:left">Descripción</th>
            </tr></thead>
            <tbody>${wrRows}</tbody>
          </table>
        </div>`;
    }).join("");
    const html=`<!doctype html><html><head><title>Guía ${escapeHtml(c.id)} — Recepción Almacén</title>
<style>
  body{margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;background:#fff}
  .hd{border-bottom:3px solid #1A2B4A;padding-bottom:10px;margin-bottom:14px}
  .hd h1{margin:0;font-size:20px;color:#1A2B4A;letter-spacing:1px}
  .hd .sub{font-size:11px;color:#666;margin-top:3px}
  .info{background:#F0F4FA;border:1px solid #C0CDD8;border-radius:6px;padding:10px 14px;margin-bottom:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 14px;font-size:12px}
  .info b{color:#1A2B4A}
  .totals{background:#F0F4FA;border:1px solid #1A2B4A;border-radius:6px;padding:10px 14px;margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:13px;font-weight:700}
  .totals .lbl{font-size:10px;color:#666;font-weight:600;text-transform:uppercase}
  .ft{margin-top:18px;font-size:10px;color:#666;text-align:center;border-top:1px dashed #aaa;padding-top:8px}
  @media print{body{padding:0}}
</style></head><body>
  <div class="hd">
    <h1>${escapeHtml(empresaNombre||"ENEX")} — RECEPCIÓN EN ALMACÉN</h1>
    <div class="sub">Generado: ${fechaImp}</div>
  </div>
  <div class="info">
    <div><b>Guía:</b> ${escapeHtml(c.id)}</div>
    <div><b>Destino:</b> ${escapeHtml(c.destino||"—")}</div>
    <div><b>Tipo de envío:</b> ${escapeHtml(c.tipoEnvio||"—")}</div>
    <div><b>Fecha creación:</b> ${fmtD(c.fecha)}</div>
    <div><b>Fecha salida:</b> ${fmtD(c.fechaSalida)}</div>
    <div><b>Fecha llegada:</b> ${fmtD(fechaLlegadaGuia(c))}</div>
    <div><b>Recibida en almacén:</b> ${fmtD(c.fechaRecibidaAlmacen)}</div>
    <div><b>N° vuelo / barco:</b> ${escapeHtml(c.numVuelo||"—")}</div>
    <div><b>Estado:</b> ${escapeHtml(c.status||"Recibida")}</div>
    <div><b>AWB:</b> ${escapeHtml(c.awb||"—")}</div>
    <div><b>BL:</b> ${escapeHtml(c.bl||"—")}</div>
    <div><b>Notas:</b> ${escapeHtml(c.notas||"—")}</div>
  </div>
  ${contBlocks||"<div style='text-align:center;padding:20px;color:#888'>Sin contenedores.</div>"}
  <div class="totals">
    <div><div class="lbl">Total WR</div>${totalWR}</div>
    <div><div class="lbl">Total cajas</div>${totalCajas}</div>
    <div><div class="lbl">Peso total</div>${(totalLb||0).toFixed?totalLb.toFixed(1):totalLb}lb</div>
    <div><div class="lbl">Ft³ total</div>${(totalFt3||0).toFixed?totalFt3.toFixed(2):totalFt3}</div>
  </div>
  <div class="ft">Documento de archivo de recepción — ${escapeHtml(empresaNombre||"ENEX")} International Courier</div>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script>
</body></html>`;
    const w=window.open("","_blank","width=900,height=1200");
    if(!w){window.alert("Tu navegador bloqueó la ventana de impresión. Habilita pop-ups para este sitio.");return;}
    w.document.open();w.document.write(html);w.document.close();
  };

  // ── IMPRESIÓN DEL ESTADO DE CUENTA ────────────────────────────────────────
  // Abre una ventana con un HTML profesional del estado de cuenta del cliente
  // (header, cliente, tab/filtros activos, tabla de WRs, totales) y lanza print.
  // grupo (opcional): {tipo,nombre,sub,email,tel,nClientes,cliDe} — estado de cuenta
  // de un agente / oficina / autónomo; agrega la columna Cliente.
  const printEstadoCuenta=(cli,wrs,filtros,totales,grupo=null)=>{
    if(!cli&&!grupo){window.alert("Selecciona un cliente primero.");return;}
    const esc=(v)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;");
    const tituloNom=grupo?grupo.nombre:fullName(cli);
    const tabLabel={todos:"Todos",pendientes:"Pendientes",porconfirmar:"Por Confirmar",reempacados:"Reempacados",egresados:"Egresados",entregadoscob:"Entregados / Por Cobrar"}[filtros.tab]||filtros.tab;
    const MESES_P=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const periodo=(filtros.mes||filtros.anio)
      ? `${filtros.mes?MESES_P[parseInt(filtros.mes)-1]:"Todos los meses"} — ${filtros.anio||"Todos los años"}`
      : "Sin filtro de período";
    const fechaImp=new Date().toLocaleString("es-VE",{dateStyle:"medium",timeStyle:"short"});
    const rows=wrs.map(w=>`
      <tr>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd"><span style="background:#eef;color:#222;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:700">${w.status?.code||"—"}</span> ${w.status?.label||""}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace;font-weight:700">${w.id}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace;color:#5B3FB5">${esc(getNumGuia(w)||"—")}</td>
        ${grupo?(()=>{const c=grupo.cliDe(w);return `<td style="padding:5px 6px;border-bottom:1px solid #ddd">${esc(c?fullName(c):(w.consignee||"—"))}<div style="font-size:9px;color:#777">${esc(c?.casillero||w.casillero||"")}</div></td>`;})():""}
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;text-align:center">${w.cajas||0}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace">${w.pesoLb||0}lb</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace">${w.volLb||"—"}lb</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace">${w.ft3||"—"}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace">${w.m3||"—"}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd">${w.tipoEnvio||"—"}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;max-width:200px;overflow:hidden">${(cleanReempaqueDesc(w.descripcion)||"—").replace(/</g,"&lt;").slice(0,60)}</td>
        <td style="padding:5px 6px;border-bottom:1px solid #ddd;font-family:monospace;font-weight:700;text-align:right">$${(w.valor||0).toFixed(2)}</td>
      </tr>`).join("");
    const totalCajas=wrs.reduce((s,w)=>s+(w.cajas||0),0);
    const html=`<!doctype html><html><head><title>Estado de Cuenta — ${esc(tituloNom)}</title>
<style>
  body{margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;background:#fff}
  .hd{border-bottom:3px solid #1A2B4A;padding-bottom:10px;margin-bottom:14px}
  .hd h1{margin:0;font-size:20px;color:#1A2B4A;letter-spacing:1px}
  .hd .sub{font-size:11px;color:#666;margin-top:3px}
  .cli-box{background:#F0F4FA;border:1px solid #C0CDD8;border-radius:6px;padding:10px 14px;margin-bottom:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;font-size:12px}
  .cli-box b{color:#1A2B4A}
  .meta{display:flex;gap:14px;font-size:11px;color:#444;margin-bottom:10px}
  .meta span b{color:#000}
  table{width:100%;border-collapse:collapse;font-size:11px}
  thead th{background:#1A2B4A;color:#fff;padding:6px 6px;text-align:left;font-size:10px;letter-spacing:.6px;text-transform:uppercase}
  tfoot td{background:#F0F4FA;font-weight:700;padding:6px 6px;border-top:2px solid #1A2B4A}
  .ft{margin-top:18px;font-size:10px;color:#666;text-align:center;border-top:1px dashed #aaa;padding-top:8px}
  @media print{body{padding:0}}
</style></head><body>
  <div class="hd">
    <h1>${empresaNombre||"ENEX"} — ESTADO DE CUENTA</h1>
    <div class="sub">Generado: ${fechaImp}</div>
  </div>
  ${grupo?`<div class="cli-box">
    <div><b>${grupo.tipo==="agente"?"Agente":grupo.tipo==="oficina"?"Oficina":"Autónomo"}:</b> ${esc(grupo.nombre)}</div>
    <div><b>Código / Ref.:</b> ${esc(grupo.sub||"—")}</div>
    <div><b>Email:</b> ${esc(grupo.email||"—")}</div>
    <div><b>Teléfono:</b> ${esc(grupo.tel||"—")}</div>
    <div style="grid-column:1/-1"><b>${grupo.tipo==="oficina"?"Clientes con carga en esta oficina":"Clientes bajo su dominio"}:</b> ${grupo.nClientes}</div>
  </div>`:`<div class="cli-box">
    <div><b>Cliente:</b> ${fullName(cli)||"—"}</div>
    <div><b>Casillero:</b> ${cli.casillero||"—"}</div>
    <div><b>Email:</b> ${cli.email||"—"}</div>
    <div><b>Teléfono:</b> ${cli.tel1||"—"}</div>
    <div style="grid-column:1/-1"><b>Branch:</b> ${(()=>{const b=branchDeCliente(cli);return b?esc(`${b.nombre} (${b.tipo})`):"—";})()}</div>
    <div style="grid-column:1/-1"><b>Dirección:</b> ${[cli.municipio,cli.estado,cli.pais].filter(Boolean).join(", ")||"—"}</div>
  </div>`}
  <div class="meta">
    <span><b>Filtro:</b> ${tabLabel}</span>
    <span><b>Período:</b> ${periodo}</span>
    <span><b>Registros:</b> ${wrs.length}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>Estado</th><th>N° WR</th><th>N° Guía</th>${grupo?"<th>Cliente</th>":""}<th>Cajas</th><th>Peso</th><th>P.Vol</th><th>Ft³</th><th>M³</th><th>Tipo</th><th>Descripción</th><th style="text-align:right">Valor</th>
      </tr>
    </thead>
    <tbody>
      ${rows||`<tr><td colspan="${grupo?12:11}" style="padding:30px;text-align:center;color:#888">Sin registros para este filtro.</td></tr>`}
    </tbody>
    ${wrs.length>0?`<tfoot>
      <tr>
        <td colspan="${grupo?4:3}">TOTALES</td>
        <td style="text-align:center">${totalCajas}</td>
        <td style="font-family:monospace">${totales.pesoLb}lb</td>
        <td style="font-family:monospace">${totales.volLb}lb</td>
        <td style="font-family:monospace">${totales.ft3}</td>
        <td style="font-family:monospace">${totales.m3}</td>
        <td colspan="2"></td>
        <td style="text-align:right;font-family:monospace;color:#1A7A3A">$${totales.valor}</td>
      </tr>
    </tfoot>`:""}
  </table>
  <div class="ft">Documento generado por ${empresaNombre||"ENEX"} · Este estado refleja únicamente los movimientos del filtro seleccionado.</div>
</body></html>`;
    const w=window.open("","_blank","width=900,height=1100");
    if(!w){window.alert("El navegador bloqueó la ventana de impresión.");return;}
    w.document.write(html);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},300);
  };

  const renderEstadoCuenta=()=>{
    // Modo grupo: clientes del agente / oficina / autónomo elegido
    const ecWROficina=ecGrupo?.tipo==="oficina"?ecWRsDeOficina(ecGrupo):null;
    const ecCliGrupo=ecGrupo
      ?(ecWROficina?[...new Map(ecWROficina.map(w=>cliDeWRCon(w,clients)).filter(Boolean).map(c=>[c.id,c])).values()]:clientesDeGrupo(ecGrupo))
      :[];
    const ecGrpIds=new Set(ecCliGrupo.map(c=>c.id));
    const ecGrpCas=new Set(ecCliGrupo.map(c=>c.casillero).filter(Boolean));
    const ecCliDeWR=(w)=>clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero&&c.casillero===w.casillero);
    const wrTodos=ecCliente?wrList.filter(w=>
      w.clienteId===ecCliente.id||
      w.casillero===ecCliente.casillero||
      (w.consignee||"").trim().toUpperCase()===(fullName(ecCliente)||"").trim().toUpperCase()
    ):ecGrupo?(ecWROficina||wrList.filter(w=>ecGrpIds.has(w.clienteId)||(w.casillero&&ecGrpCas.has(w.casillero)))):[];
    // Resultados de búsqueda en modo grupo (lista corta: se muestra completa sin escribir)
    const ecGrpResults=(ecModo==="cliente"||ecGrupo)?[]:(()=>{
      const q=(ecSearch||"").toLowerCase().trim();
      let base=[];
      if(ecModo==="agente")  base=agentes.map(a=>({tipo:"agente",id:a.id,nombre:a.nombre||a.codigo||"Agente",sub:[a.codigo,a.ciudad].filter(Boolean).join(" · "),email:a.email||"",tel:a.tel||""}));
      if(ecModo==="oficina") base=oficinas.map(o=>({tipo:"oficina",id:o.id,nombre:o.nombre||o.codigo||"Oficina",sub:[o.codigo,o.ciudad].filter(Boolean).join(" · "),email:o.email||"",tel:o.tel||""}));
      if(ecModo==="autonomo")base=clients.filter(c=>c.tipo==="usuario"&&c.rol==="F").map(c=>({tipo:"autonomo",id:c.id,nombre:fullName(c),sub:[c.casillero,c.email].filter(Boolean).join(" · "),email:c.email||"",tel:c.tel1||""}));
      return base.filter(g=>!q||[g.nombre,g.sub].some(v=>String(v||"").toLowerCase().includes(q)));
    })();

    // Filtro por mes/año
    const wrFecha=wrTodos.filter(w=>{
      const f=w.fecha instanceof Date?w.fecha:new Date(w.fecha);
      if(ecMes&&(f.getMonth()+1)!==parseInt(ecMes))return false;
      if(ecAnio&&f.getFullYear()!==parseInt(ecAnio))return false;
      return true;
    });

    // Filtro por estado
    // Estados "finales" que sacan al WR del pipeline activo:
    //   21 Entregado, 22 Por Cobrar, 23 Cobrado, 25 Egresado
    const finales=["21","22","23","25"];
    // ¿El WR ya tiene algún pago registrado en cualquier factura no anulada?
    const wrTienePagoRegistrado=(wrId)=>{
      return facturas.some(f=>f.status!=="anulada"
        && Array.isArray(f.wrIds) && f.wrIds.includes(wrId)
        && (parseFloat(f.pagado)||0)>0);
    };
    const filtrarPorTab=(tab,w)=>{
      const c=w.status?.code||"";
      switch(tab){
        case "pendientes":      return !finales.includes(c) && c!=="2.3";    // pre-Entregado, sin reempacados ni egresados
        case "porconfirmar":    return ["1","2"].includes(c);                  // Recibido / Origen (aún sin tipo asignado)
        case "reempacados":     return c==="2.3";
        case "egresados":       return c==="25";
        case "entregadoscob":   return ["21","22"].includes(c) && !wrTienePagoRegistrado(w.id); // Entregados sin pago registrado
        default:                return true;
      }
    };
    const wrCliente=wrFecha.filter(w=>{
      if(!w.status)return ecFiltro==="todos";
      return filtrarPorTab(ecFiltro,w);
    });

    const totalPesoLbC=wrCliente.reduce((s,w)=>s+(w.pesoLb||0),0).toFixed(1);
    const totalVolLbC=wrCliente.reduce((s,w)=>s+(w.volLb||0),0).toFixed(1);
    const totalFt3C=wrCliente.reduce((s,w)=>s+(w.ft3||0),0).toFixed(2);
    const totalM3C=wrCliente.reduce((s,w)=>s+(w.m3||0),0).toFixed(3);
    const totalValorC=wrCliente.reduce((s,w)=>s+(w.valor||0),0).toFixed(2);

    const FILTROS=[
      {k:"todos",l:"Todos"},
      {k:"pendientes",l:"Pendientes"},
      {k:"porconfirmar",l:"Por Confirmar"},
      {k:"reempacados",l:"Reempacados"},
      {k:"egresados",l:"Egresados"},
      {k:"entregadoscob",l:"Entregados / Por Cobrar"},
    ];

    const MESES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const anios=[2023,2024,2025,2026];

    return (
      <div className="page-scroll">
        {/* BÚSQUEDA */}
        <div className="card" style={{marginBottom:14,maxWidth:700}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:12}}>
            👤 Estado de Cuenta — Búsqueda
          </div>
          {/* Buscar por: cliente / agente / oficina / autónomo */}
          <div style={{display:"flex",gap:3,background:"var(--bg4)",borderRadius:7,padding:3,border:"1px solid var(--b1)",marginBottom:10,width:"fit-content",flexWrap:"wrap"}}>
            {[["cliente","👤 Cliente"],["agente","🤝 Agente"],["oficina","🏢 Oficina"],["autonomo","🧑‍💻 Autónomo"]].map(([k,l])=>(
              <button key={k} type="button" onClick={()=>ecCambiarModo(k)}
                style={{padding:"5px 12px",borderRadius:5,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                  background:ecModo===k?"var(--navy)":"transparent",color:ecModo===k?"#fff":"var(--t2)"}}>{l}</button>
            ))}
          </div>
          <div style={{position:"relative"}}>
            <div style={{display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,fontSize:15}} value={ecSearch}
                onChange={e=>{if(ecModo==="cliente")buscarCliente(e.target.value);else{setEcGrupo(null);setEcSearch(e.target.value);}}}
                placeholder={ecModo==="cliente"?"Buscar por nombre, casillero, email o teléfono…":ecModo==="agente"?"Buscar agente por nombre o código…":ecModo==="oficina"?"Buscar oficina por nombre o código…":"Buscar autónomo por nombre, casillero o email…"}/>
              {(ecCliente||ecGrupo)&&<button className="btn-s" onClick={()=>{setEcCliente(null);setEcGrupo(null);setEcSearch("");setEcResults([]);}}>✕ Limpiar</button>}
            </div>
            {ecResults.length>0&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:50,maxHeight:220,overflowY:"auto"}}>
                {ecResults.map(c=>(
                  <div key={c.id} onClick={()=>selEcCliente(c)}
                    style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--b2)",display:"flex",alignItems:"center",gap:10}}
                    onMouseEnter={e=>e.currentTarget.style.background="#EEF3FF"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <div style={{width:32,height:32,borderRadius:8,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{initials(c)}</div>
                    <div>
                      <div style={{fontWeight:600,color:"var(--t1)",fontSize:15}}>{fullName(c)}</div>
                      <div style={{fontSize:13,color:"var(--t3)"}}>{c.casillero} · {c.email} · {c.tel1}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {ecGrpResults.length>0&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:50,maxHeight:320,overflowY:"auto"}}>
                {ecGrpResults.map(g=>{
                  const n=g.tipo==="oficina"?ecWRsDeOficina(g).length:clientesDeGrupo(g).length;
                  return(
                  <div key={g.tipo+g.id} onClick={()=>selEcGrupo(g)}
                    style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--b2)",display:"flex",alignItems:"center",gap:10}}
                    onMouseEnter={e=>e.currentTarget.style.background="#EEF3FF"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <div style={{width:32,height:32,borderRadius:8,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{g.tipo==="agente"?"🤝":g.tipo==="oficina"?"🏢":"🧑‍💻"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,color:"var(--t1)",fontSize:15}}>{g.nombre}</div>
                      <div style={{fontSize:13,color:"var(--t3)"}}>{g.sub||"—"}</div>
                    </div>
                    <span style={{fontSize:12,color:"var(--t3)",whiteSpace:"nowrap"}}>{n} {g.tipo==="oficina"?(n!==1?"WR":"WR"):(n!==1?"clientes":"cliente")}</span>
                  </div>
                  );
                })}
              </div>
            )}
            {ecModo!=="cliente"&&!ecGrupo&&ecGrpResults.length===0&&(
              <div style={{fontSize:13,color:"var(--t3)",marginTop:8}}>{ecSearch?"No hay coincidencias.":`No hay ${ecModo==="agente"?"agentes":ecModo==="oficina"?"oficinas":"autónomos"} registrados.`}</div>
            )}
          </div>
        </div>

        {(ecCliente||ecGrupo)&&(
          <>
            {ecGrupo?(
              /* HEADER GRUPO — agente / oficina / autónomo */
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:16,marginBottom:14,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",boxShadow:"var(--shadow)",alignItems:"center"}}>
                <div style={{width:56,height:56,borderRadius:12,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{ecGrupo.tipo==="agente"?"🤝":ecGrupo.tipo==="oficina"?"🏢":"🧑‍💻"}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t3)",letterSpacing:.8,textTransform:"uppercase"}}>{ecGrupo.tipo==="agente"?"Agente":ecGrupo.tipo==="oficina"?"Oficina":"Autónomo"}</div>
                  <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:700,color:"var(--navy)"}}>{ecGrupo.nombre}</div>
                  <div style={{display:"flex",gap:16,marginTop:4,fontSize:13,color:"var(--t2)",flexWrap:"wrap"}}>
                    {ecGrupo.sub&&<span>🏷️ {ecGrupo.sub}</span>}
                    {ecGrupo.email&&<span>📧 {ecGrupo.email}</span>}
                    {ecGrupo.tel&&<span>📞 {ecGrupo.tel}</span>}
                    <span>👥 <strong>{ecCliGrupo.length}</strong> cliente{ecCliGrupo.length!==1?"s":""}{ecGrupo?.tipo==="oficina"?" con carga en esta oficina":" bajo su dominio"}</span>
                  </div>
                </div>
                <div>{ecGrupo.tipo!=="oficina"&&(hasPerm("registrar_pago")||hasPerm("cobrar"))&&<button className="btn-p" style={{fontSize:13,padding:"6px 12px",background:"#2E7D32",borderColor:"#2E7D32"}} onClick={()=>cobroAbrir({tipo:ecGrupo.tipo,id:ecGrupo.id,nombre:ecGrupo.nombre})}>💵 Cobrar</button>}</div>
              </div>
            ):(<>
            {/* HEADER CLIENTE */}
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:16,marginBottom:14,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",boxShadow:"var(--shadow)",alignItems:"center"}}>
              <div style={{width:56,height:56,borderRadius:12,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22}}>{initials(ecCliente)}</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:700,color:"var(--navy)"}}>{fullName(ecCliente)}</div>
                  {(()=>{const b=branchDeCliente(ecCliente);
                    return b
                      ? <span title={`Branch: ${b.tipo}`} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:13,fontWeight:700,color:"var(--navy)",background:"#EEF3FF",border:"1px solid #B8C8F0",borderRadius:14,padding:"3px 10px"}}>
                          {b.ic} {b.nombre}<span style={{fontWeight:500,color:"var(--t3)",fontSize:12}}>· {b.tipo}</span>
                        </span>
                      : <span style={{fontSize:12,color:"var(--t3)",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:14,padding:"3px 10px"}}>Sin branch asignado</span>;})()}
                </div>
                <div style={{display:"flex",gap:16,marginTop:4,fontSize:13,color:"var(--t2)",flexWrap:"wrap"}}>
                  <span>📦 Casillero: <strong style={{color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{ecCliente.casillero}</strong></span>
                  <span>📧 {ecCliente.email}</span>
                  <span>📞 {ecCliente.tel1}</span>
                  <span>📍 {ecCliente.municipio}, {ecCliente.estado}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                {hasPerm("crear_wr")&&<button className="btn-p" style={{fontSize:13,padding:"6px 12px"}} onClick={()=>openWRModalForClient(ecCliente)}>+ Nuevo WR</button>}
                {hasPerm("crear_reempaque")&&<button className="btn-s" style={{fontSize:13,padding:"6px 12px"}} onClick={()=>setRpqCliModal({cliente:ecCliente,selectedIds:[]})}>🔁 Reempaque</button>}
                {hasPerm("hacer_egreso")&&<button className="btn-s" style={{fontSize:13,padding:"6px 12px"}} onClick={()=>setCrCliModal({cliente:ecCliente,selectedIds:[]})}>🚀 Cargo Release</button>}
                {(hasPerm("registrar_pago")||hasPerm("cobrar"))&&<button className="btn-p" style={{fontSize:13,padding:"6px 12px",background:"#2E7D32",borderColor:"#2E7D32"}} onClick={()=>cobroAbrir({tipo:"cliente",id:ecCliente.id,nombre:fullName(ecCliente)})}>💵 Cobrar</button>}
              </div>
            </div>

            </>)}

            {/* MINI STATS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:14}}>
              {[
                {ic:"📦",v:wrCliente.length,l:"Total WR"},
                {ic:"⚖️",v:`${totalPesoLbC}lb`,l:"Peso Total"},
                {ic:"📐",v:`${totalVolLbC}lb`,l:"Peso Vol. Total"},
                {ic:"📏",v:totalFt3C,l:"Ft³ Total"},
                {ic:"🌐",v:totalM3C,l:"M³ Total"},
                {ic:"💵",v:`$${totalValorC}`,l:"Valor Total"},
              ].map((s,i)=>(
                <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"10px 13px",boxShadow:"var(--shadow)"}}>
                  <div style={{fontSize:17,marginBottom:4}}>{s.ic}</div>
                  <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)"}}>{s.v}</div>
                  <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* TABLA */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,overflow:"hidden",boxShadow:"var(--shadow)"}}>

              {/* TOOLBAR CON FILTROS */}
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  {/* Tabs de filtro */}
                  <div style={{display:"flex",gap:3,background:"var(--bg4)",borderRadius:7,padding:"3px",border:"1px solid var(--b1)"}}>
                    {FILTROS.map(f=>{
                      const cnt=f.k==="todos"?wrFecha.length:wrFecha.filter(w=>{
                        if(!w.status)return false;
                        return filtrarPorTab(f.k,w);
                      }).length;
                      return (
                        <button key={f.k} onClick={()=>setEcFiltro(f.k)}
                          style={{padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                            background:ecFiltro===f.k?"var(--navy)":"transparent",
                            color:ecFiltro===f.k?"#fff":"var(--t2)",transition:"all .1s",display:"flex",alignItems:"center",gap:4}}>
                          {f.l}
                          <span style={{background:ecFiltro===f.k?"rgba(255,255,255,.2)":"var(--bg5)",borderRadius:3,padding:"0 5px",fontSize:11,fontWeight:800}}>{cnt}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{flex:1}}/>
                  {/* Filtro mes */}
                  <select className="st-sel" value={ecMes} onChange={e=>setEcMes(e.target.value)}>
                    <option value="">Todos los meses</option>
                    {MESES.map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                  {/* Filtro año */}
                  <select className="st-sel" value={ecAnio} onChange={e=>setEcAnio(e.target.value)}>
                    <option value="">Todos los años</option>
                    {anios.map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                  <span style={{fontSize:12,color:"var(--t3)",padding:"2px 8px",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4}}>{wrCliente.length} registros</span>
                  <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}}
                    onClick={()=>printEstadoCuenta(ecCliente,wrCliente,{tab:ecFiltro,mes:ecMes,anio:ecAnio},{pesoLb:totalPesoLbC,volLb:totalVolLbC,ft3:totalFt3C,m3:totalM3C,valor:totalValorC},ecGrupo?{...ecGrupo,nClientes:ecCliGrupo.length,cliDe:ecCliDeWR}:null)}>
                    🖨 Imprimir Estado
                  </button>
                </div>
              </div>

              <div className="wr-scroll" style={{overflow:"auto",maxHeight:"68vh"}}>
                {(()=>{
                  // Columnas dinámicas: Origen solo se muestra en el tab Reempacados.
                  const showOrigen = ecFiltro==="reempacados";
                  // En Reempacados ocultamos las fechas intermedias y N° Guía
                  const hideMiddle = showOrigen;
                  // Tipo Envío va siempre al final, salvo en Reempacados (que queda fijo en 2.3)
                  const showTipoEnvio = !showOrigen;
                  // Orden de columnas (pedido por usuario, mayo 2026):
                  //   Estado · N° WR · [Origen?] · Cajas · Peso · P.Vol · Ft³ · M³
                  //   · Tracking · Contenido · Valor   ← movidas aquí (entre M³ y Recibido)
                  //   · Recibido · Confirmado · Consolidado · Enviado
                  //   · Alm. Destino · Entregado · Cobrado   ← columna nueva
                  //   · N° Guía · [Tipo Envío?]
                  const baseCols = [
                    "Estado","N° WR",
                    ...(hideMiddle?[]:["N° Guía"]),
                    ...(ecGrupo?["Cliente"]:[]),
                    ...(showOrigen?["Origen"]:[]),
                    "Cajas","Peso lb","P.Vol lb","Ft³","M³",
                    "Tracking",
                    "Contenido","Valor",
                    "Recibido",
                    ...(hideMiddle?[]:["Confirmado","Consolidado","Enviado","Alm. Destino","Entregado","Cobrado"]),
                    ...(showTipoEnvio?["Tipo Envío"]:[])
                  ];
                  // Totales: la fila de TOTALES debe encajar con las celdas
                  // que SÍ suman (Cajas, Peso, P.Vol, Ft³, M³, Valor).
                  // - firstColspan cubre Estado+N°WR(+Origen) hasta Cajas (excl.)
                  // - midColspanBeforeValor cubre desde Contenido (excluida — descrip.)
                  //   hasta antes del Valor (que mostramos en su propia celda).
                  //   Aquí no hay celdas que sumar entre M³ y Valor (Contenido es texto).
                  // - tailColspan cubre Recibido..N°Guía (+Tipo Envío), todas no-sumables.
                  const firstColspan = 2 + (hideMiddle?0:1) + (ecGrupo?1:0) + (showOrigen?1:0);
                  const tailColspan  = 1 /*Recibido*/ + (hideMiddle?0:6 /*Confirmado..Cobrado*/) + (showTipoEnvio?1:0);
                return (
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5,whiteSpace:"nowrap"}}>
                  <thead>
                    <tr style={{background:"var(--navy)"}}>
                      {baseCols.map(h=>(
                        <th key={h} style={{position:"sticky",top:0,zIndex:2,background:"var(--navy)",color:"rgba(255,255,255,.8)",fontSize:11,letterSpacing:.8,textTransform:"uppercase",fontWeight:700,padding:"7px 8px",textAlign:"left",borderBottom:"2px solid var(--navy3)",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wrCliente.length===0?(
                      <tr><td colSpan={baseCols.length} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>
                        {ecFiltro==="todos"?"Este cliente no tiene envíos registrados.":"No hay envíos con este filtro."}
                      </td></tr>
                    ):wrCliente.map(w=>{
                      const codigo=w.status?.code||"";
                      const isReempacado=codigo==="2.3";
                      return (
                      <tr key={w.id} style={{borderBottom:"1px solid var(--b2)"}}
                        onMouseEnter={e=>{Array.from(e.currentTarget.cells).forEach(c=>c.style.background="#EEF3FF");}}
                        onMouseLeave={e=>{Array.from(e.currentTarget.cells).forEach(c=>c.style.background="");}}>
                        {/* Estado — badge */}
                        <td style={{padding:"7px 8px"}}><StBadge st={w.status}/></td>
                        {/* N° WR — clickeable para abrir detalle */}
                        <td style={{padding:"7px 8px"}}>
                          <div onClick={()=>setSelWR(w)} style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:13,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",display:"inline-block",cursor:"pointer",textDecoration:"underline"}}
                            onMouseEnter={e=>e.currentTarget.style.background="#D8E8FF"}
                            onMouseLeave={e=>e.currentTarget.style.background="#EEF3FF"}>
                            {w.id}
                          </div>
                        </td>
                        {/* N° Guía — justo después del N° WR */}
                        {!hideMiddle&&(
                          <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",fontWeight:600}}>
                            {(()=>{const gid=getNumGuia(w);const g=consolList.find(c=>c.id===gid);
                              return g
                                ? <span onClick={()=>setRdArchView(g)} title={`Abrir guía ${g.id}`} style={{cursor:"pointer",textDecoration:"underline"}}>{g.id}</span>
                                : gid;})()}
                          </td>
                        )}
                        {/* Cliente — solo en estado de cuenta de agente / oficina / autónomo.
                            Click abre el estado de cuenta de ese cliente. */}
                        {ecGrupo&&(()=>{
                          const cl=ecCliDeWR(w);
                          return(
                            <td style={{padding:"7px 8px"}}>
                              {cl
                                ? <span onClick={()=>{setEcModo("cliente");setEcGrupo(null);selEcCliente(cl);}} title="Ver el estado de cuenta de este cliente"
                                    style={{cursor:"pointer",fontWeight:600,color:"var(--navy)",textDecoration:"underline"}}>{fullName(cl)}</span>
                                : <span style={{fontWeight:600}}>{w.consignee||"—"}</span>}
                              <div style={{fontSize:11,color:"var(--t3)",fontFamily:"'DM Mono',monospace"}}>{cl?.casillero||w.casillero||""}</div>
                            </td>
                          );
                        })()}
                        {/* Origen — solo en tab Reempacados (en qué WR se reempacó / WR padre) */}
                        {showOrigen && (
                          <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",fontWeight:600}}>
                            {w.reempacadoEn
                              ? <span onClick={()=>{const wp=wrList.find(x=>x.id===w.reempacadoEn);if(wp)setSelWR(wp);}} style={{cursor:"pointer",textDecoration:"underline"}}>{w.reempacadoEn}</span>
                              : (Array.isArray(w.reempaqueDe)&&w.reempaqueDe.length>0
                                  ? w.reempaqueDe.map((rid,i)=>(
                                      <span key={rid}>{i>0?", ":""}<span onClick={()=>{const wp=wrList.find(x=>x.id===rid);if(wp)setSelWR(wp);}} style={{cursor:"pointer",textDecoration:"underline"}}>{rid}</span></span>
                                    ))
                                  : "—")}
                          </td>
                        )}
                        {/* Cajas — número simple, sin click */}
                        <td style={{padding:"7px 8px",textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{w.cajas}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--t1)"}}>{w.pesoLb}lb</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--orange)"}}>{w.volLb||"—"}lb</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{w.ft3}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",color:"var(--teal)"}}>{w.m3}</td>
                        {/* Tracking — igual que en el Dashboard: si las cajas traen
                            seguimientos distintos, botón con el detalle caja por caja
                            (MultiCell); si no, el número con ⤢ cuando se corta (TxtCell). */}
                        {(()=>{
                          const dimsArr=Array.isArray(w.dims)?w.dims:[];
                          const trkDist=[...new Set(dimsArr.map(d=>String(d?.tracking??"").trim()).filter(Boolean))];
                          return trkDist.length>1
                            ? <MultiCell dims={dimsArr} tdStyle={{padding:"7px 8px",maxWidth:190}} color="var(--cyan)"
                                btn={`📦 ${trkDist.length} seguimientos`}
                                titulo={`🔗 Seguimiento por caja — ${dimsArr.length} cajas · ${trkDist.length} números distintos`}
                                columnas={[{h:"Transp.",w:"78px",get:d=>d.carrier},{h:"Nº de seguimiento",w:"1fr",mono:true,get:d=>d.tracking}]}/>
                            : <TxtCell value={w.tracking} titulo="🔗 Nº de seguimiento" mono
                                tdStyle={{padding:"7px 8px",maxWidth:170,overflow:"hidden"}} txtClass="c-trk"/>;
                        })()}
                        {/* Contenido / Valor — movidas aquí (antes estaban al final). */}
                        <td style={{padding:"7px 8px",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",color:"var(--t2)"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${w.valor?.toFixed(2)||"0.00"}</td>
                        {/* Fechas del flujo, leídas del historial real (no inventadas). */}
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12}}>{getStatusDate(w,"recibido")}</td>
                        {!hideMiddle && (
                          <>
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"confirmado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"confirmado")}</td>
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"consolidado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"consolidado")}</td>
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"enviado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"enviado")}</td>
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"almacen_dest")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"almacen_dest")}</td>
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"entregado")==="—"?"var(--t3)":"var(--green)",fontWeight:getStatusDate(w,"entregado")==="—"?400:700}}>{getStatusDate(w,"entregado")}</td>
                            {/* Nueva columna Cobrado — antes de N° Guía. */}
                            <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"cobrado")==="—"?"var(--t3)":"var(--gold2)",fontWeight:getStatusDate(w,"cobrado")==="—"?400:700}}>{getStatusDate(w,"cobrado")}</td>
                          </>
                        )}
                        {/* TIPO ENVÍO — al final de la fila (mismo patrón que Dashboard).
                            Bloqueado para Reempacado (2.3), Egresado (25) y Consolidado en adelante (4+). */}
                        {showTipoEnvio && (
                          <td onClick={e=>e.stopPropagation()} style={{padding:"7px 8px",minWidth:90}}>
                            {!wrEsModificable(w)
                              ?(w.tipoEnvio
                                  ?<span style={{display:"inline-flex"}}><TypeBadge t={w.tipoEnvio}/></span>
                                  :<span style={{color:"var(--t4)",fontSize:11}}>—</span>)
                              :(w.tipoEnvio
                                ?<div style={{display:"inline-flex",alignItems:"center",gap:4}}>
                                    <span style={{display:"inline-flex"}}><TypeBadge t={w.tipoEnvio}/></span>
                                    {hasPerm("confirmar")&&<span onClick={()=>{if(window.confirm(`¿Quitar tipo de envío del WR ${w.id}?${w.status?.code==="3"?"\n\nTambién se revertirá la confirmación.":""}`))assignTipoEnvio(w,"");}} title="Quitar tipo de envío" style={{cursor:"pointer",fontSize:13,color:"var(--red)",padding:"0 3px",lineHeight:1,fontWeight:700}}>✕</span>}
                                  </div>
                                :(hasPerm("confirmar")
                                  ?<select value="" onChange={e=>{if(e.target.value)assignTipoEnvio(w,e.target.value);}} title="Confirmar tipo de envío" style={{fontSize:11,padding:"2px 3px",border:"1px dashed var(--navy)",borderRadius:4,background:"var(--bg3)",color:"var(--navy)",fontWeight:600,cursor:"pointer",minWidth:78}}>
                                      <option value="">Asignar</option>
                                      {SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                                    </select>
                                  :<span style={{color:"var(--t3)",fontSize:11}}>—</span>))}
                          </td>
                        )}
                      </tr>
                      );
                    })}
                  </tbody>
                  {wrCliente.length>0&&(
                    <tfoot>
                      <tr style={{background:"var(--bg4)",borderTop:"2px solid var(--navy)"}}>
                        <td colSpan={firstColspan} style={{padding:"8px",fontWeight:700,fontSize:13,color:"var(--navy)"}}>TOTALES</td>
                        <td style={{padding:"8px",textAlign:"center",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{wrCliente.reduce((s,w)=>s+(w.cajas||0),0)}</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--t1)"}}>{totalPesoLbC}lb</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--orange)"}}>{totalVolLbC}lb</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--sky)"}}>{totalFt3C}</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--teal)"}}>{totalM3C}</td>
                        <td/>{/* Tracking — texto, no suma */}
                        <td/>{/* Contenido — texto, no suma */}
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${totalValorC}</td>
                        <td colSpan={tailColspan}/>
                      </tr>
                    </tfoot>
                  )}
                </table>
                );})()}
              </div>
            </div>
            {(()=>{const pgEC=ecCliente?{tipo:"cliente",id:ecCliente.id,nombre:fullName(ecCliente),casillero:ecCliente.casillero||""}
              :(ecGrupo&&["agente","autonomo"].includes(ecGrupo.tipo))?{tipo:ecGrupo.tipo,id:ecGrupo.id,nombre:ecGrupo.nombre}:null;
              return pgEC&&<div style={{marginTop:14}}>{bloqueCuenta(pgEC)}</div>;})()}
          </>
        )}

        {/* MODAL REEMPAQUE POR CLIENTE — solo WR del cliente seleccionado */}
        {crCliModal&&(()=>{
          const cli=crCliModal.cliente;
          const cliWRs=wrList.filter(w=>{
            if(!crElegible(w))return false;
            return w.clienteId===cli.id||w.casillero===cli.casillero||(w.consignee||"").trim().toUpperCase()===(fullName(cli)||"").trim().toUpperCase();
          });
          const tog=(id)=>setCrCliModal(p=>({...p,selectedIds:p.selectedIds.includes(id)?p.selectedIds.filter(x=>x!==id):[...p.selectedIds,id]}));
          const ids=crCliModal.selectedIds;
          return (
            <div className="ov" onClick={()=>setCrCliModal(null)}>
              <div className="modal" style={{maxWidth:820}} onClick={e=>e.stopPropagation()}>
                <div className="mhd">
                  <div className="mt">🚀 Cargo Release — {fullName(cli)}</div>
                  <button className="mcl" onClick={()=>setCrCliModal(null)}>✕</button>
                </div>
                <div style={{maxHeight:"55vh",overflow:"auto",margin:"0 14px",border:"1px solid var(--b1)",borderRadius:8}}>
                  <table className="wt">
                    <thead><tr>
                      <th style={{width:40}}></th>
                      <th>N° WR</th><th>Fecha</th><th>Tracking</th><th>Descripción</th><th>Estado</th><th style={{textAlign:"right"}}>Cajas</th>
                    </tr></thead>
                    <tbody>
                      {cliWRs.length===0
                        ?<tr><td colSpan={7} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>Este cliente no tiene WR elegibles para egresar.</td></tr>
                        :cliWRs.map(w=>(
                          <tr key={w.id} className={ids.includes(w.id)?"sel":""} onClick={()=>tog(w.id)} style={{cursor:"pointer"}}>
                            <td style={{textAlign:"center"}}><input type="checkbox" checked={ids.includes(w.id)} onChange={()=>tog(w.id)}/></td>
                            <td><span className="c-wr">{w.id}</span></td>
                            <td><span className="c-dt">{fmtDate(w.fecha)}</span></td>
                            <td><span className="c-trk">{w.tracking||"—"}</span></td>
                            <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                            <td><StBadge st={w.status}/></td>
                            <td style={{textAlign:"right",fontWeight:700}}>{w.cajas||0}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="mft">
                  <div style={{fontSize:13,color:"var(--t2)",marginRight:"auto"}}>Seleccionados: <strong>{ids.length}</strong></div>
                  <button className="btn-s" onClick={()=>setCrCliModal(null)}>Cancelar</button>
                  <button className="btn-p" disabled={ids.length===0} style={{opacity:ids.length===0?.5:1}} onClick={()=>{
                    const sel=cliWRs.filter(w=>ids.includes(w.id));
                    setCrCliModal(null);
                    setCrIndivModal({wrs:sel,nombre:"",id:"",empresa:"",notas:""});
                  }}>Continuar → Datos del receptor</button>
                </div>
              </div>
            </div>
          );
        })()}
        {rpqCliModal&&(()=>{
          const cli=rpqCliModal.cliente;
          const cliWRs=wrList.filter(w=>{
            // Bloque F — Solo permitir WR con status ≤ Confirmado (1, 2, 3)
            if(!puedeReempacarse(w))return false;
            return w.clienteId===cli.id||w.casillero===cli.casillero||(w.consignee||"").trim().toUpperCase()===(fullName(cli)||"").trim().toUpperCase();
          });
          const tog=(id)=>setRpqCliModal(p=>({...p,selectedIds:p.selectedIds.includes(id)?p.selectedIds.filter(x=>x!==id):[...p.selectedIds,id]}));
          const ids=rpqCliModal.selectedIds;
          return (
            <div className="ov" onClick={()=>setRpqCliModal(null)}>
              <div className="modal" style={{maxWidth:820}} onClick={e=>e.stopPropagation()}>
                <div className="mhd">
                  <div className="mt">🔁 Reempaque — {fullName(cli)}</div>
                  <button className="mcl" onClick={()=>setRpqCliModal(null)}>✕</button>
                </div>
                <div style={{maxHeight:"55vh",overflow:"auto",margin:"0 14px",border:"1px solid var(--b1)",borderRadius:8}}>
                  <table className="wt">
                    <thead><tr>
                      <th style={{width:40}}></th>
                      <th>N° WR</th><th>Fecha</th><th>Tracking</th><th>Descripción</th><th>Estado</th><th style={{textAlign:"right"}}>Cajas</th>
                    </tr></thead>
                    <tbody>
                      {cliWRs.length===0
                        ?<tr><td colSpan={7} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>Este cliente no tiene WR elegibles para reempacar.</td></tr>
                        :cliWRs.map(w=>(
                          <tr key={w.id} className={ids.includes(w.id)?"sel":""} onClick={()=>tog(w.id)} style={{cursor:"pointer"}}>
                            <td style={{textAlign:"center"}}><input type="checkbox" checked={ids.includes(w.id)} onChange={()=>tog(w.id)}/></td>
                            <td><span className="c-wr">{w.id}</span></td>
                            <td><span className="c-dt">{fmtDate(w.fecha)}</span></td>
                            <td><span className="c-trk">{w.tracking||"—"}</span></td>
                            <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                            <td><StBadge st={w.status}/></td>
                            <td style={{textAlign:"right",fontWeight:700}}>{w.cajas||0}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="mft">
                  <div style={{fontSize:13,color:"var(--t2)",marginRight:"auto"}}>Seleccionados: <strong>{ids.length}</strong></div>
                  <button className="btn-s" onClick={()=>setRpqCliModal(null)}>Cancelar</button>
                  <button className="btn-p" disabled={ids.length===0} style={{opacity:ids.length===0?.5:1}} onClick={()=>{
                    const sel=[...ids];
                    setRpqCliModal(null);
                    openWRModalAsReempaque(sel,cli);
                  }}>Continuar → Crear WR de Reempaque</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // ── CONSOLIDACIÓN HELPERS ─────────────────────────────────────────────────
  const sc2=(k,v)=>setCf(p=>({...p,[k]:v}));
  const scCont=(ci,k,v)=>setCf(p=>({...p,containers:p.containers.map((c,i)=>i===ci?{...c,[k]:v}:c)}));
  const handleContScan=(ci,val)=>setContScanVal(p=>({...p,[ci]:val}));

  const addWRToContainer=(ci,wrId)=>{
    const wr=wrList.find(w=>w.id===wrId);
    if(!wr)return "WR no encontrado";
    // Bloqueo por estado: solo 3 Confirmado se puede consolidar
    if(!wrPuedeConsolidarse(wr)){
      const code=wr.status?.code||"?";
      if(code==="2.3")return `El WR ${wrId} está Reempacado (2.3) — no se puede consolidar. La mercancía está en el WR hijo (${wr.reempacadoEn||"otro WR"}).`;
      if(code==="25")return `El WR ${wrId} ya fue Egresado (25) — salió del flujo y no se puede consolidar.`;
      return `El WR ${wrId} está en estado ${wr.status?.label||code}. Solo WRs Confirmados (3) se pueden consolidar.`;
    }
    // Bloqueo por tipoEnvio: el WR debe ser del mismo tipo que la guía en curso
    if(cf.tipoEnvio&&wr.tipoEnvio&&wr.tipoEnvio!==cf.tipoEnvio){
      return `El WR ${wrId} es tipo ${wr.tipoEnvio} y la guía es ${cf.tipoEnvio}. No se mezclan tipos en un mismo embarque.`;
    }
    if(cf.containers.some(c=>c.wr.some(r=>r.id===wrId)))return "WR ya está en un contenedor";
    {const otra=consolList.find(g=>g.id!==editConsolId&&(g.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===wrId)));
     if(otra)return `El WR ${wrId} ya está en la guía ${otra.id}.`;}
    scCont(ci,"wr",[...cf.containers[ci].wr,{id:wr.id,consignee:wr.consignee,cajas:wr.cajas||1,pesoLb:wr.pesoLb||0,ft3:wr.ft3||0,descripcion:wr.descripcion||""}]);
    return null;
  };

  const doContScan=(ci)=>{
    const val=contScanVal[ci]||"";
    if(!val.trim()){setContScanErr(p=>({...p,[ci]:"Escanea un WR"}));return;}
    const r=buscarParcial(val,wrList,w=>[w.id,trkAll(w)]);
    const wr=r.item||(r.varios?elegirDeVarios(r.varios,w=>`${w.id} — ${w.consignee||""} (${w.status?.label||""})`):null);
    if(!wr){setContScanErr(p=>({...p,[ci]:r.varios?"Selección cancelada":`No se encontró WR con "${val.trim()}"`}));return;}
    const err=addWRToContainer(ci,wr.id);
    if(err)setContScanErr(p=>({...p,[ci]:err}));
    else{setContScanVal(p=>({...p,[ci]:""}));setContScanErr(p=>({...p,[ci]:""}));}
  };

  const addContainer=()=>setCf(p=>({...p,containers:[...p.containers,{tipo:"",largo:"",ancho:"",alto:"",pesoLb:"",sello:"",wr:[],fotos:[]}]}));
  const removeContainer=(ci)=>setCf(p=>({...p,containers:p.containers.filter((_,i)=>i!==ci)}));

  // Actualiza el estado de una guía consolidada y lo cascada a todos sus WRs
  // Solo permite avanzar a estados con channels.includes("consolidacion").
  // Estados auto (17 Almacén, 20 Por Entrega, etc.) no se deben fijar desde aquí.
  // Fecha de llegada de una guía = última vez que sus WR pasaron a Aduana Destino (14)
  const fechaLlegadaGuia=c=>{
    if(!c)return null;
    const ids=new Set([...(Array.isArray(c.wrIds)?c.wrIds:[]),...(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(r=>r.id))]);
    let min=null;
    wrList.forEach(w=>{
      if(!ids.has(w.id))return;
      (w.historial||[]).forEach(h=>{
        if(String(h.code)!=="14"||!h.fecha)return;
        const t=new Date(h.fecha);
        if(!isNaN(t)&&(!min||t>min))min=t;
      });
    });
    return min;
  };
  const updateGuideStatus=(consolId,stCode)=>{
    const st=getStatus(stCode);
    if(!st)return;
    if(!statusInChannel(stCode,"consolidacion")){
      alert(`El estado "${st.label}" no se puede fijar desde Consolidación.\nEste estado se asigna automáticamente desde otro módulo (ej: Recepción en Almacén).`);
      return;
    }
    // Actualizar el estado en la consolidación
    setConsolList(p=>p.map(c=>{
      if(c.id!==consolId)return c;
      const updated={...c,status:st.label};
      dbUpsertConsolidacion(updated);
      return updated;
    }));
    // Cascada: actualizar todos los WRs dentro de la guía
    const consol=consolList.find(c=>c.id===consolId);
    if(!consol)return;
    const allWrIds=(consol.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    if(allWrIds.length===0)return;
    setWrList(p=>p.map(w=>{
      if(!allWrIds.includes(w.id))return w;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:st.code,label:st.label,fecha:new Date(),user:currentUser.id,nota:`Guía ${consolId}`}]};
      dbUpsertWR(upd);
      return upd;
    }));
    logAction(`Guía ${consolId} → ${st.label}`,`${allWrIds.length} WRs actualizados`);
  };

  const submitConsol=async()=>{
    // Validaciones — destino y tipoEnvio son obligatorios
    if(!cf.destino){window.alert("⚠️ Debes seleccionar la Ciudad Destino antes de cerrar el embarque.");return;}
    if(!cf.tipoEnvio){window.alert("⚠️ Debes seleccionar el Tipo de Envío antes de cerrar el embarque.");return;}
    const now=new Date();
    const allWR=(cf.containers||[]).flatMap(c=>c.wr||[]);
    const totalLb=parseFloat(allWR.reduce((s,w)=>s+(w.pesoLb||0),0).toFixed(1));
    const totalFt3=parseFloat(allWR.reduce((s,w)=>s+(w.ft3||0),0).toFixed(2));
    const totalM3=0; // calcular si es necesario
    const totalWR=allWR.length;
    const totalCajas=allWR.reduce((s,w)=>s+(w.cajas||1),0);
    const totalVolLb=parseFloat(allWR.reduce((s,w)=>s+(w.volLb||0),0).toFixed(1));

    const existing=editConsolId?consolList.find(c=>c.id===editConsolId):null;
    const n={
      ...(existing||{}),
      id:existing?existing.id:buildConsolNum(offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.origCity.toUpperCase()))||oficinas[0]),offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.destCity.toUpperCase()))||oficinas[oficinas.length-1]||oficinas[0]),(()=>{if(consolList.length===0)return 1;const nums=consolList.map(c=>{const m=String(c.id||"").match(/(\d+)(?=[^0-9]*$)/);return m?parseInt(m[1]):0;});return Math.max(...nums)+1;})(),consolNumTipo,consolSecInicio,cf.tipoEnvio||"Marítimo"),
      fecha:existing?existing.fecha:now,destino:cf.destino,tipoEnvio:cf.tipoEnvio,
      fechaSalida:cf.fechaSalida,fechaLlegada:existing?.fechaLlegada||"",numVuelo:cf.numVuelo,awb:cf.awb,bl:cf.bl,
      notas:cf.notas,containers:cf.containers,
      wrIds:allWR.map(w=>w.id),
      totalWR,totalCajas,totalLb,totalFt3,totalM3,totalVolLb,
      status:existing?.status||"Consolidado",usuario:existing?.usuario||currentUser.id,
    };
    setConsolList(p=>existing?p.map(c=>c.id===n.id?n:c):[n,...p]);
    dbUpsertConsolidacion(n);
    // Persistir tipoEnvio en cada WR de la guía (si está vacío) + agregar entrada
    // de Consolidado (4) al historial para que el timeline tenga fecha exacta y
    // el Dashboard muestre el tipo correcto sin necesitar fallback.
    const wrIdsEnGuia=new Set(allWR.map(w=>w.id));
    // WR que estaban en la guía y se quitaron al editarla: vuelven a 3 Confirmado
    // (solo si siguen en 4; si ya avanzaron no se tocan).
    const quitados=new Set(existing?(existing.containers||[]).flatMap(ct=>(ct.wr||[]).map(r=>r.id)).filter(id=>!wrIdsEnGuia.has(id)):[]);
    const st4=getStatus("4"), st3=getStatus("3");
    setWrList(prev=>prev.map(w=>{
      if(quitados.has(w.id)){
        if(w.status?.code!=="4")return w;
        const upd={...w,status:st3,historial:[...(w.historial||[]),{code:"3",label:st3.label,fecha:now,user:currentUser.id,nota:`Quitado de la guía ${n.id}`}]};
        dbUpsertWR(upd);
        return upd;
      }
      if(!wrIdsEnGuia.has(w.id))return w;
      const yaEnHistorial=(w.historial||[]).some(h=>String(h.code)==="4");
      const tipoCambio=!w.tipoEnvio&&!!n.tipoEnvio;
      // FIX: antes solo se agregaba el "4" al historial y el estado seguía en
      // 3 Confirmado, así que el WR volvía a ofrecerse para otra guía.
      const subirA4=w.status?.code==="3";
      if(!tipoCambio&&yaEnHistorial&&!subirA4)return w;
      const upd={...w};
      if(tipoCambio)upd.tipoEnvio=n.tipoEnvio;
      if(subirA4)upd.status=st4;
      if(!yaEnHistorial||subirA4){
        upd.historial=[...(w.historial||[]),{code:"4",label:"Consolidado",fecha:now,user:currentUser.id,nota:`Guía ${n.id} · ${n.tipoEnvio||""}`}];
      }
      dbUpsertWR(upd);
      return upd;
    }));
    // Subir fotos pendientes (sin id) de cada contenedor al bucket
    const uploadedCount=await uploadFotosForConsol(n.id, cf.containers, currentUser?.id||'');
    setShowNewConsol(false);
    setEditConsolId(null);
    setCf(emptyConsol());
    setContScanVal({});
    setContScanErr({});
    logAction(existing?"Editó embarque":"Cerró embarque",n.id);
    if(uploadedCount>0) logAction("Subió fotos embarque",`${n.id} (${uploadedCount})`);
    // Abre el modal de etiquetas de Guía Consolidada (1 etiqueta por contenedor)
    setShowConsolLabels({
      guia:n,
      containers:cf.containers||[],
      remitente:empresaNombre||"ENEX",
    });
  };

  // ── ETIQUETAS ───────────────────────────────────────────────────────────────
  // ── LOADING MASTER · helpers de guía ─────────────────────────────────────────
  // Código de estado de una guía (c.status guarda el label). "Recibida" es el
  // estado que deja el botón Desarchivar: se trata como 17 Almacén.
  const guiaCode=(c)=>{
    const st=WR_STATUSES.find(s=>s.label===c.status);
    if(st)return st.code;
    if(c.status==="Recibida")return "17";
    return "4";
  };
  // Grupos de guías (tarjetas del Master y pestañas de Loading Master):
  //  preparacion ≤4 · transito 5–12 · recepcion ≥13 (Tránsito 2 en adelante,
  //  aún abierta) · cerradas = archivadas (recepción cerrada).
  const guiaGrupo=(c)=>{
    if(c.archivada)return "cerradas";
    const n=parseFloat(guiaCode(c))||0;
    if(n>=13)return "recepcion";
    if(n>=5)return "transito";
    return "preparacion";
  };
  const guiaEnFiltro=(c,f)=>f==="todas"||guiaGrupo(c)===f;

  // ── Acciones de guía (antes inline en la tabla de Consolidación; ahora las usa
  // la ventana de detalle que se abre al hacer clic en el N° de guía del Master).
  const guiaEtiquetas=(c)=>setShowLabels({
                        wr:{id:c.id,origCity:OFFICE_CONFIG.origCity,origCountry:"USA 🇺🇸",destCity:c.destino,destCountry:"Venezuela 🇻🇪",
                          consignee:"CONSOLIDADO",casillero:"—",fecha:c.fecha,branch:OFFICE_CONFIG.branch,tipoEnvio:c.tipoEnvio,
                          shipper:"ENEX",cajas:c.totalCajas,pesoLb:c.totalLb,volLb:c.totalVolLb,ft3:c.totalFt3,m3:c.totalM3},
                        dims:c.containers.map((ct,i)=>({l:0,a:0,h:0,pk:0,pkLb:parseFloat(ct.pesoLb)||0,volLb:0,ft3:0,m3:0,tracking:`Cont. ${i+1} · ${ct.tipo} · Sello: ${ct.sello||"—"}`})),
                        remitente:"ENEX",tipoEnvio:c.tipoEnvio,
                      });
  const guiaEditar=async(c)=>{
    // Cargar fotos guardadas del bucket consol-fotos para esta guía
    let fotosByCont={};
    try{
      const fotos=await dbGetFotosByConsol(c.id);
      fotos.forEach(f=>{
        const k=f.containerIdx??0;
        if(!fotosByCont[k])fotosByCont[k]=[];
        fotosByCont[k].push({id:f.id,url:f.url,path:f.path,filename:f.filename,mime:f.mime,sizeBytes:f.sizeBytes,source:f.source,createdAt:f.createdAt});
      });
    }catch(e){console.error("dbGetFotosByConsol:",e);}
    const conts=(c.containers||[]).map((ct,i)=>({...ct,fotos:[...(fotosByCont[i]||[]),...(ct.fotos||[]).filter(f=>!f.id)]}));
    setCf({
      destino:c.destino,tipoEnvio:c.tipoEnvio,fechaSalida:c.fechaSalida||"",numVuelo:c.numVuelo||"",
      awb:c.awb||"",bl:c.bl||"",notas:c.notas||"",containers:conts,
    });
    setEditConsolId(c.id);setShowNewConsol(true);
  };
  const guiaBorrar=(c)=>{
    // Solo revertir WRs que sigan en Consolidado (4). Los que
    // ya avanzaron (5+ tránsito, 17 almacén, 20+ entrega) NO
    // se tocan — esos eventos son posteriores y válidos, no
    // tiene sentido degradarlos a Confirmado solo porque la
    // guía padre se borra.
    const stConf=WR_STATUSES.find(s=>s.code==="3");
    const allWrIds=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    const wrsEnConsolidado=wrList.filter(w=>allWrIds.includes(w.id)&&w.status?.code==="4");
    const wrsBloqueados=wrList.filter(w=>allWrIds.includes(w.id)&&w.status?.code&&w.status.code!=="4");
    if(!window.confirm(
      `¿Borrar guía consolidada ${c.id}?\n`+
      `↩️ ${wrsEnConsolidado.length} WR en Consolidado volverán a Confirmado (3)\n`+
      (wrsBloqueados.length>0?`🔒 ${wrsBloqueados.length} WR ya avanzaron (tránsito/almacén/entrega) y NO se tocarán\n`:"")+
      `\nLa guía se elimina del sistema.`
    ))return;
    if(allWrIds.length>0&&stConf){
      setWrList(p=>p.map(w=>{
        if(!allWrIds.includes(w.id))return w;
        if(w.status?.code!=="4")return w;
        const upd={...w,status:stConf,historial:[...(w.historial||[]),{code:stConf.code,label:stConf.label,fecha:new Date(),user:currentUser.id,nota:`Guía ${c.id} eliminada — liberado del embarque`}]};
        dbUpsertWR(upd);
        return upd;
      }));
    }
    setConsolList(p=>p.filter(x=>x.id!==c.id));
    dbDeleteConsolidacion(c.id);
    logAction("Borró guía consolidada",`${c.id} · ${wrsEnConsolidado.length} WR liberados, ${wrsBloqueados.length} respetados`);
    return true;
  };
  // Origen de una guía: no hay campo propio, se toma de las ciudades de origen de
  // sus WR (normalmente una sola); si no hay WR, la oficina configurada.
  const guiaOrigen=(c)=>{
    const ids=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    const cs=[...new Set(wrList.filter(w=>ids.includes(w.id)).map(w=>w.origCity).filter(Boolean))];
    return cs.length?cs.join(", "):(OFFICE_CONFIG.origCity||"—");
  };

  const renderConsolidacion=()=>(
    <div className="page-scroll">
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🗂️ Master de Guías</div>
        </div>
        <button className="btn-p" onClick={()=>{setCf(emptyConsol());setEditConsolId(null);setContScanVal({});setContScanErr({});setShowNewConsol(true);}}>+ Nuevo Embarque</button>
      </div>

      {/* TARJETAS — estilo Dashboard, pero de guías. Click = filtrar la lista. */}
      {consolList.length>0&&(
        <div className="stats stats-5" style={{padding:0,marginBottom:14}}>
          {[
            {k:"todas",      ic:"📦", l:"Total Guías",    d:"Todas, abiertas y cerradas",       c:"#1A2B4A"},
            {k:"preparacion",ic:"🗂️", l:"En Preparación", d:"Consolidadas, sin despachar",       c:"#C05800"},
            {k:"transito",   ic:"✈️", l:"En Tránsito",    d:"Línea → Liberado 2",                c:"#0080CC"},
            {k:"recepcion",  ic:"📬", l:"En Recepción",   d:"Tránsito 2 en adelante",            c:"#6A4FB0"},
            {k:"cerradas",   ic:"🗄️", l:"Cerradas",       d:"Recepción cerrada / archivadas",    c:"#1A6040"},
          ].map(t=>{
            const n=consolList.filter(c=>guiaEnFiltro(c,t.k)).length;
            const on=lmFilter===t.k;
            return(
              <div key={t.k} className="stat" onClick={()=>setLmFilter(on&&t.k!=="todas"?"todas":t.k)}
                title={on&&t.k!=="todas"?"Click para ver todas":"Click para filtrar la lista"}
                style={on?{outline:`2px solid ${t.c}`,outlineOffset:-2}:undefined}>
                <div className="stat-bar" style={{background:t.c,opacity:.7}}/>
                <div className="stat-ic">{t.ic}</div>
                <div className="stat-v">{n}</div>
                <div className="stat-l">{t.l}</div>
                <div className="stat-d">{t.d}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* LISTA DE EMBARQUES */}
      {consolList.length===0?(
        <div className="card" style={{textAlign:"center",padding:60,color:"var(--t3)"}}>
          No hay embarques consolidados aún.<br/>
          <button className="btn-p" style={{marginTop:14}} onClick={()=>{setCf(emptyConsol());setEditConsolId(null);setContScanVal({});setContScanErr({});setShowNewConsol(true);}}>+ Crear primer embarque</button>
        </div>
      ):(
        <div className="card" style={{padding:0}}>
          <table className="ct">
            <thead><tr>
              <th>N° Guía</th><th>Fecha</th><th>Origen</th><th>Destino</th><th>Tipo Envío</th>
              <th style={{textAlign:"center"}}>Cont.</th><th style={{textAlign:"center"}}>WR</th><th style={{textAlign:"center"}}>Cajas</th>
              <th>Peso lb</th><th>Ft³</th><th>Vuelo/Barco</th><th>AWB / BL</th><th>Salida</th><th>Estado</th>
            </tr></thead>
            <tbody>
              {consolList.filter(c=>guiaEnFiltro(c,lmFilter)).length===0&&(
                <tr><td colSpan={14} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay guías en este grupo.</td></tr>
              )}
              {consolList.filter(c=>guiaEnFiltro(c,lmFilter)).map(c=>{
                const st=getStatus(guiaCode(c));
                return (
                <tr key={c.id} style={{cursor:"default"}}>
                  {/* N° de guía — único punto que abre el detalle (ver / editar / borrar / etiquetas) */}
                  <td onClick={()=>setRdArchView(c)} title="Abrir guía" style={{cursor:"pointer"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#fff",padding:"3px 8px",borderRadius:5,border:"2px solid var(--navy)",fontSize:13,whiteSpace:"nowrap"}}>{c.id}</span>
                  </td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,whiteSpace:"nowrap"}}>{fmtDate(c.fecha)}</td>
                  <td style={{fontWeight:600,color:"var(--t1)",whiteSpace:"nowrap"}}>{guiaOrigen(c)}</td>
                  <td style={{fontWeight:600,color:"var(--t1)",whiteSpace:"nowrap"}}>{c.destino||"—"}</td>
                  <td><TypeBadge t={c.tipoEnvio}/></td>
                  <td style={{textAlign:"center",fontWeight:700}}>{(c.containers||[]).length}</td>
                  <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.totalWR||0}</td>
                  <td style={{textAlign:"center"}}>{c.totalCajas||0}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t1)",fontWeight:600,whiteSpace:"nowrap"}}>{c.totalLb||0}lb</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{c.totalFt3||0}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)",whiteSpace:"nowrap"}}>{c.numVuelo||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",whiteSpace:"nowrap"}}>{c.awb||c.bl||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,whiteSpace:"nowrap"}}>{c.fechaSalida||"—"}</td>
                  {/* Estado — solo informativo; se cambia en la pestaña Status */}
                  <td style={{whiteSpace:"nowrap"}}>
                    {c.archivada
                      ? <span style={{fontSize:12,fontWeight:700,color:"#1A6040",background:"#E8F5E9",padding:"3px 10px",borderRadius:10,border:"1px solid #A5D6A7"}}>🗄️ Cerrada</span>
                      : <StBadge st={st||{cls:"s3",label:c.status||"En preparación"}}/>}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NUEVO EMBARQUE */}
      {showNewConsol&&(
        <div className="ov">
          <div className="modal mxl" onClick={e=>e.stopPropagation()}>
            <div className="mhd">
              <div className="mt">🗂️ {editConsolId?`Editar Embarque ${editConsolId}`:"Nuevo Embarque Consolidado"}</div>
              <button className="mcl" onClick={()=>{setShowNewConsol(false);setEditConsolId(null);setCf(emptyConsol());setContScanVal({});setContScanErr({});}}>✕</button>
            </div>

            {/* INFO GENERAL */}
            <div className="sdiv">INFORMACIÓN DEL EMBARQUE</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              <div className="fg">
                <div className="fl">Ciudad Destino *</div>
                <select className="fs" value={cf.destino} onChange={e=>sc2("destino",e.target.value)}>
                  <option value="">— Selecciona ciudad destino —</option>
                  {COUNTRIES.find(c=>c.dial===OFFICE_CONFIG.destCountry)?.cities.map(c=>(
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Tipo de Envío *</div>
                <select className="fs" value={cf.tipoEnvio} onChange={e=>sc2("tipoEnvio",e.target.value)}>
                  <option value="">— Selecciona tipo de envío —</option>
                  {SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Fecha de Salida</div>
                <input className="fi" type="date" value={cf.fechaSalida} onChange={e=>sc2("fechaSalida",e.target.value)}/>
              </div>
              <div className="fg">
                <div className="fl">N° Vuelo / Barco</div>
                <input className="fi" value={cf.numVuelo} onChange={e=>sc2("numVuelo",e.target.value)} placeholder="AA1234 / V-OCEANIA"/>
              </div>
              <div className="fg">
                <div className="fl">AWB (Guía Aérea)</div>
                <input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={cf.awb} onChange={e=>sc2("awb",e.target.value)} placeholder="000-12345678"/>
              </div>
              <div className="fg">
                <div className="fl">BL (Conocimiento Embarque)</div>
                <input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={cf.bl} onChange={e=>sc2("bl",e.target.value)} placeholder="ABCD1234567"/>
              </div>
              <div className="fg" style={{gridColumn:"span 2"}}>
                <div className="fl">Notas</div>
                <input className="fi" value={cf.notas} onChange={e=>sc2("notas",e.target.value)} placeholder="Observaciones…"/>
              </div>
            </div>

            {/* WR CONFIRMADOS DISPONIBLES — solo del tipoEnvio elegido */}
            <div className="sdiv">WR CONFIRMADOS DISPONIBLES{cf.tipoEnvio?` — ${cf.tipoEnvio} (clic para agregar al contenedor activo)`:" — selecciona primero el Tipo de Envío"}</div>
            <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"8px 12px",marginBottom:14,maxHeight:"40vh",overflowY:"auto"}}>
              {!cf.tipoEnvio?(
                <div style={{color:"var(--orange)",fontSize:13,padding:"8px 0",fontWeight:600}}>⚠️ Selecciona el Tipo de Envío.</div>
              ):(()=>{
                // WR ya metidos en OTRA guía (la que se edita no cuenta)
                const enOtraGuia=new Set(consolList.filter(g=>g.id!==editConsolId).flatMap(g=>(g.containers||[]).flatMap(ct=>(ct.wr||[]).map(r=>r.id))));
                const elegibles=wrList.filter(w=>
                  w.status?.code==="3"
                  && (w.tipoEnvio||"")===cf.tipoEnvio
                  && !cf.containers.some(c=>c.wr.some(r=>r.id===w.id))
                  && !enOtraGuia.has(w.id)
                );
                if(elegibles.length===0){
                  return <div style={{color:"var(--t3)",fontSize:13,padding:"8px 0"}}>No hay WR confirmados disponibles para tipo <b>{cf.tipoEnvio}</b>.</div>;
                }
                return elegibles.map(w=>(
                  <div key={w.id} onClick={()=>{
                      const ci=cf.containers.length-1;
                      const err=addWRToContainer(ci,w.id);
                      if(err)alert(err);
                    }}
                    style={{display:"inline-flex",alignItems:"center",gap:6,margin:"3px",padding:"5px 10px",background:"#fff",border:"2px solid #1A8A4A",borderRadius:6,cursor:"pointer",transition:"all .12s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#E8F8EE";e.currentTarget.style.transform="scale(1.02)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.transform="";}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--navy)",fontSize:14}}>{w.id}</span>
                    <span style={{color:"var(--t2)",fontSize:13}}>{w.consignee}</span>
                    <span style={{color:"var(--t3)",fontSize:12,background:"var(--bg4)",padding:"1px 5px",borderRadius:3}}>{w.cajas}cj · {w.pesoLb}lb</span>
                    <span style={{color:"var(--green)",fontSize:14}}>+</span>
                  </div>
                ));
              })()}
            </div>

            {/* CONTAINERS */}
            <div className="sdiv">CONTENEDORES</div>
            {cf.containers.map((cont,ci)=>{
              const contWRPeso=parseFloat(cont.wr.reduce((s,w)=>s+(w.pesoLb||0),0).toFixed(1));
              const contWRCajas=cont.wr.reduce((s,w)=>s+(w.cajas||1),0);
              const contType=CONTAINER_TYPES.find(t=>t.code===cont.tipo);
              const maxLb=contType?.maxLb||0;
              const pct=maxLb>0?Math.min(100,Math.round((contWRPeso/maxLb)*100)):0;
              return (
                <div key={ci} style={{border:"2px solid var(--navy)",borderRadius:10,marginBottom:12,overflow:"hidden"}}>
                  {/* Header container */}
                  <div style={{background:"var(--navy)",padding:"8px 14px",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{color:"#E5AE3A",fontFamily:"Arial,Helvetica,sans-serif",fontWeight:800,fontSize:16}}>
                      📦 CONTENEDOR {ci+1}
                    </span>
                    {/* Input + datalist: permite elegir un tipo registrado en Configuración
                        o escribir uno libre si el tipo no existe aún. */}
                    <input list={`container-types-${ci}`} value={cont.tipo}
                      placeholder="Selecciona o escribe el tipo…"
                      onChange={e=>{
                        const val=e.target.value;
                        const reg=CONTAINER_TYPES.find(t=>t.code===val||t.name===val);
                        const dims=reg?parseContainerDim(reg.dim):null;
                        setCf(p=>({...p,containers:p.containers.map((c,i)=>i===ci?{
                          ...c,
                          tipo:reg?reg.code:val,
                          // Si el tipo trae medidas oficiales, autollenar; si es libre o no existe, no tocar
                          ...(dims?{largo:dims.l,ancho:dims.a,alto:dims.h}:{})
                        }:c)}));
                      }}
                      style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:5,color:"#fff",padding:"3px 8px",fontSize:14,fontWeight:700,minWidth:180}}/>
                    <datalist id={`container-types-${ci}`}>
                      {CONTAINER_TYPES.map(t=><option key={t.code} value={t.code}>{t.name}</option>)}
                    </datalist>
                    <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{cont.tipo?(contType?.dim||"Manual / personalizado"):"Selecciona o escribe un tipo"}</span>
                    <div style={{flex:1}}/>
                    <span style={{fontSize:13,color:"#E5AE3A",fontWeight:600}}>{cont.wr.length} WR · {contWRCajas} cajas · {contWRPeso}lb</span>
                    {cf.containers.length>1&&(
                      <button onClick={()=>removeContainer(ci)} style={{background:"rgba(204,34,51,.3)",border:"1px solid rgba(204,34,51,.5)",color:"#FF8888",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontSize:13}}>🗑</button>
                    )}
                  </div>

                  <div style={{padding:"12px 14px"}}>
                    {/* Barra de capacidad */}
                    <div style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                        <span style={{color:"var(--t2)"}}>Capacidad usada</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:pct>90?"var(--red)":pct>70?"var(--orange)":"var(--green)"}}>{contWRPeso}lb / {maxLb||"—"}lb ({maxLb?pct:0}%)</span>
                      </div>
                      <div style={{height:6,background:"var(--bg4)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:3,background:pct>90?"var(--red)":pct>70?"var(--orange)":"var(--green)",width:`${pct}%`,transition:"width .3s"}}/>
                      </div>
                    </div>

                    {/* Medidas + Sello */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 200px",gap:8,marginBottom:10}}>
                      <div className="fg"><div className="fl">Largo (in)</div><input className="fi" type="number" value={cont.largo} onChange={e=>scCont(ci,"largo",e.target.value)}/></div>
                      <div className="fg"><div className="fl">Ancho (in)</div><input className="fi" type="number" value={cont.ancho} onChange={e=>scCont(ci,"ancho",e.target.value)}/></div>
                      <div className="fg"><div className="fl">Alto (in)</div><input className="fi" type="number" value={cont.alto} onChange={e=>scCont(ci,"alto",e.target.value)}/></div>
                      <div className="fg"><div className="fl">Peso Real (lb)</div><input className="fi" type="number" value={cont.pesoLb} onChange={e=>scCont(ci,"pesoLb",e.target.value)}/></div>
                      <div className="fg"><div className="fl">Ft³ 🔄</div><div className="fi ro" style={{color:"var(--sky)",fontWeight:600}}>
                        {cont.largo&&cont.ancho&&cont.alto?parseFloat(((parseFloat(cont.largo)*parseFloat(cont.ancho)*parseFloat(cont.alto))/1728).toFixed(2)):"—"}
                      </div></div>
                      <div className="fg"><div className="fl">N° Sello / Precinto</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontWeight:700}} value={cont.sello} onChange={e=>scCont(ci,"sello",e.target.value)} placeholder="SL-000000"/></div>
                    </div>

                    {/* Escáner de WR — autoFocus */}
                    <div style={{marginBottom:8}}>
                      <div className="fl" style={{marginBottom:4}}>Escanear o escribir N° WR</div>
                      <div style={{display:"flex",gap:8}}>
                        <input className="fi" style={{fontFamily:"'DM Mono',monospace",flex:1,fontWeight:600,fontSize:15}}
                          autoFocus={ci===cf.containers.length-1}
                          value={contScanVal[ci]||""}
                          onChange={e=>handleContScan(ci,e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")doContScan(ci);}}
                          placeholder="Escanear o escribir N° WR…"/>
                        <button className="scan-btn" onClick={()=>doContScan(ci)}>📡 Agregar</button>
                      </div>
                      {contScanErr[ci]&&<div style={{fontSize:12,color:"var(--red)",marginTop:4}}>⚠️ {contScanErr[ci]}</div>}
                    </div>

                    {/* WR en este contenedor */}
                    {cont.wr.length>0&&(
                      <div style={{border:"1px solid var(--b1)",borderRadius:7,overflow:"hidden"}}>
                        <table className="ct" style={{fontSize:12}}>
                          <thead><tr><th>#</th><th>N° WR</th><th>Consignatario</th><th>Cajas</th><th>Peso lb</th><th>Ft³</th><th>Descripción</th><th></th></tr></thead>
                          <tbody>
                            {cont.wr.map((w,wi)=>(
                              <tr key={w.id}>
                                <td style={{color:"var(--t3)"}}>{wi+1}</td>
                                <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:12}}>{w.id}</span></td>
                                <td style={{fontWeight:600}}>{w.consignee}</td>
                                <td style={{textAlign:"center"}}>{w.cajas}</td>
                                <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{w.pesoLb}lb</td>
                                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{w.ft3}</td>
                                <td style={{color:"var(--t2)"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                                <td><span style={{cursor:"pointer",color:"var(--red)",fontSize:14}} onClick={()=>{
                                  scCont(ci,"wr",cont.wr.filter(r=>r.id!==w.id));
                                  setWrList(p=>p.map(x=>x.id===w.id?{...x,status:WR_STATUSES.find(s=>s.code==="3")||x.status}:x));
                                }}>✕</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* FOTOS DEL CONTENEDOR (al guardar el embarque se suben al bucket consol-fotos) */}
                    {hasPerm("subir_foto") && (
                      <div style={{marginTop:12,paddingTop:10,borderTop:"1px dashed var(--b1)"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:.8,display:"flex",alignItems:"center",gap:7}}>
                            <span style={{fontSize:15}}>📷</span> Fotos del contenedor
                            {(cont.fotos||[]).length>0 && (
                              <span style={{background:"var(--gold)",color:"#fff",fontSize:11,padding:"2px 8px",borderRadius:10,fontWeight:700}}>{cont.fotos.length}</span>
                            )}
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <label className="btn-s" style={{fontSize:12,padding:"5px 10px",cursor:"pointer",margin:0,display:"inline-flex",alignItems:"center",gap:5}}>
                              <span>📁</span> Subir archivo
                              <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{addFotosToContainer(ci,e.target.files,"upload");e.target.value="";}}/>
                            </label>
                            <button type="button" className="btn-s" style={{fontSize:12,padding:"5px 10px",display:"inline-flex",alignItems:"center",gap:5}} onClick={()=>setWebcamOpen({containerIdx:ci})}>
                              <span>📸</span> Cámara web
                            </button>
                          </div>
                        </div>
                        {(cont.fotos||[]).length===0 ? (
                          <div style={{padding:"12px",border:"2px dashed var(--b1)",borderRadius:8,background:"var(--bg4)",textAlign:"center",color:"var(--t3)",fontSize:13}}>
                            Sin fotos
                          </div>
                        ) : (
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(110px, 1fr))",gap:8}}>
                            {cont.fotos.map((foto,fi)=>(
                              <div key={fi} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid var(--b1)",background:"var(--bg4)"}}>
                                <img src={foto.url} alt={foto.filename||"foto"} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                                <div style={{position:"absolute",top:4,right:4,display:"flex",gap:4}}>
                                  <button type="button" title="Quitar foto" onClick={()=>removeFotoFromContainer(ci,fi)} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"rgba(204,34,51,0.95)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                                </div>
                                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)",color:"#fff",fontSize:10,padding:"8px 4px 3px",textAlign:"center",fontWeight:600}}>
                                  {foto.source==='webcam'?'📸 Cámara':'📁 Archivo'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* BOTÓN AGREGAR CONTENEDOR */}
            <button onClick={addContainer} style={{width:"100%",padding:"10px",border:"2px dashed var(--navy)",borderRadius:10,background:"rgba(26,43,74,.04)",color:"var(--navy)",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:18}}>📦</span> + Agregar
            </button>

            {/* TOTALES */}
            {(()=>{
              const allWR=cf.containers.flatMap(c=>c.wr);
              const tLb=parseFloat(allWR.reduce((s,w)=>s+(w.pesoLb||0),0).toFixed(1));
              const tFt3=parseFloat(allWR.reduce((s,w)=>s+(w.ft3||0),0).toFixed(2));
              const tWR=allWR.length;
              const tCajas=allWR.reduce((s,w)=>s+(w.cajas||1),0);
              return tWR>0?(
                <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  <div style={{fontWeight:700,color:"var(--navy)",fontSize:12,textTransform:"uppercase",letterSpacing:1,gridColumn:"1/-1",marginBottom:4}}>TOTALES DEL EMBARQUE</div>
                  {[["WR incluidos",tWR,"var(--navy)"],["Total cajas",tCajas,"var(--t1)"],["Peso total",`${tLb}lb`,"var(--t1)"],["Ft³ total",String(tFt3),"var(--sky)"]].map(([l,v,c])=>(
                    <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"7px 10px",border:"1px solid var(--b1)"}}>
                      <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:c,fontSize:16}}>{v}</div>
                    </div>
                  ))}
                </div>
              ):null;
            })()}

            <div className="mft">
              <button className="btn-s" onClick={()=>{setShowNewConsol(false);setEditConsolId(null);setCf(emptyConsol());setContScanVal({});setContScanErr({});}}>Cancelar</button>
              <button className="btn-p" onClick={submitConsol}
                disabled={cf.containers.every(c=>c.wr.length===0)}
                style={{opacity:cf.containers.every(c=>c.wr.length===0)?0.5:1}}>
                ✅ Cerrar Embarque y Generar Etiquetas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── PÁGINA IMPRIMIR ETIQUETAS ───────────────────────────────────────────────
  const renderEtiquetasPage=()=>{
    const tipo=etqTipo||"wr";
    const Q=sinAcentos(etqSearch.trim());
    const hay=txt=>!Q||sinAcentos(txt).includes(Q);
    const porFecha=(a,b)=>new Date(b.fecha||0)-new Date(a.fecha||0);
    const MAX=30;
    const btn=(l,fn,extra={})=><button className="btn-s" style={{fontSize:13,padding:"5px 12px",whiteSpace:"nowrap",...extra}} onClick={fn}>{l}</button>;
    const mono={fontFamily:"'DM Mono',monospace",fontWeight:700};
    const imprimirWR=w=>{setSelWR(w);setTimeout(()=>window.print(),600);};
    const verImp=(ver,imp)=><>{btn("👁️ Ver",ver)}{btn("🖨️ Imprimir",imp)}</>;
    const verRecibo=rid=>setReciboVer(rid);
    // Usuarios externos: solo documentos de su carga
    const idsVis=new Set(wrList.map(w=>w.id));
    const tocaVis=ids=>!alcanceUsr||(ids||[]).some(id=>idsVis.has(id));
    const facsVis=alcanceUsr?facturas.filter(f=>tocaVis(f.wrIds)||(f.receptorId&&[currentUser.id,currentUser.agenteId].includes(f.receptorId))):facturas;
    const facIdsVis=new Set(facsVis.map(f=>f.id));
    const pagosVis=alcanceUsr?pagos.filter(p=>facIdsVis.has(p.facturaId)):pagos;
    const guiasVis=alcanceUsr?consolList.filter(g=>tocaVis((g.containers||[]).flatMap(c=>(c.wr||[]).map(w=>w.id)))):consolList;
    const TIPOS=[["wr","📦 WR"],["guia","🗂️ Guía"],["entrega","📝 Nota de entrega"],["egreso","🚚 Cargo Release"],["factura","🧾 Factura"],["recibo","💵 Recibo"]];
    let filas=[];
    if(tipo==="wr")filas=wrList.filter(w=>hay(`${w.id} ${w.consignee||""} ${w.casillero||""} ${w.shipper||""} ${(w.dims||[]).map(d=>d.tracking).join(" ")} ${w.tracking||""}`))
      .sort((a,b)=>String(b.id).localeCompare(String(a.id))).slice(0,MAX).map(w=>({k:w.id,
        izq:<><span style={{...mono,color:"var(--navy)"}}>{w.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{w.consignee||"—"}{w.casillero?` · #${w.casillero}`:""} · {w.cajas||1} caja{(w.cajas||1)===1?"":"s"}</div></>,
        estado:<StBadge st={w.status}/>,
        acc:<>{btn("📄 WR",()=>imprimirWR(w))}{btn("🏷️ Etiquetas",()=>setShowLabels({wr:w,dims:w.dims||[],remitente:w.shipper||"",tipoEnvio:w.tipoEnvio||""}))}</>}));
    if(tipo==="guia")filas=guiasVis.filter(g=>hay(`${g.id} ${g.destino||""} ${g.tipoEnvio||""} ${g.awb||""} ${g.bl||""}`))
      .sort((a,b)=>String(b.id).localeCompare(String(a.id))).slice(0,MAX).map(g=>({k:g.id,
        izq:<><span style={{...mono,color:"var(--purple)"}}>{g.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{g.destino||"—"} · {g.tipoEnvio||"—"} · {(g.containers||[]).length} cont. · {g.totalWR||0} WR</div></>,
        estado:<span style={{fontSize:12,color:"var(--t2)",fontWeight:600}}>{g.status||"—"}</span>,
        acc:<>{btn("📄 Guía",()=>printGuiaArchivada(g))}{btn("🏷️ Etiquetas",()=>setShowConsolLabels({guia:g,containers:g.containers||[],remitente:empresaNombre||"ENEX"}))}</>}));
    if(tipo==="entrega")filas=deliveryNotes.filter(n=>tocaVis(n.wrIds)&&hay(`${n.id} ${n.receptorNombre||""} ${n.consignatario||""} ${n.guiaId||""} ${(n.wrIds||[]).join(" ")}`))
      .sort(porFecha).slice(0,MAX).map(n=>({k:n.id,
        izq:<><span style={{...mono,color:"var(--navy)"}}>{n.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{fmtDate(n.fecha)} · {n.receptorEntidad?.nombre||n.receptorNombre||n.consignatario||"—"} · {(n.wrIds||[]).length} WR{n.guiaId?` · guía ${n.guiaId}`:""}</div></>,
        estado:n.anulado?<span style={{fontSize:12,fontWeight:700,color:"var(--red)"}}>Anulada</span>:<span style={{fontSize:12,fontWeight:700,color:"var(--green)"}}>{n.tipo==="despacho"?"Despacho":"Entrega"}</span>,
        acc:verImp(()=>setDnPrint(n),()=>{setDnPrint(n);setTimeout(()=>window.print(),600);})}));
    if(tipo==="egreso")filas=cargoReleases.filter(c=>tocaVis(c.wrIds)&&hay(`${c.id} ${c.agenteCarga||""} ${c.contacto||""} ${(c.wrIds||[]).join(" ")}`))
      .sort(porFecha).slice(0,MAX).map(c=>({k:c.id,
        izq:<><span style={{...mono,color:"var(--navy)"}}>{c.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{fmtDate(c.fecha)} · {c.agenteCarga||c.contacto||"—"} · {(c.wrIds||[]).length} WR</div></>,
        estado:c.anulado?<span style={{fontSize:12,fontWeight:700,color:"var(--red)"}}>Anulado</span>:null,
        acc:verImp(()=>setCrPrint(c),()=>{setCrPrint(c);setTimeout(()=>window.print(),600);})}));
    if(tipo==="factura")filas=facsVis.filter(f=>f.status!=="borrador"&&hay(`${f.id} ${f.receptorNombre||""} ${f.receptorCasillero||""} ${f.receptorDoc||""} ${(f.wrIds||[]).join(" ")}`))
      .sort((a,b)=>(b.numero||0)-(a.numero||0)).slice(0,MAX).map(f=>({k:f.id,
        izq:<><span style={{...mono,color:"var(--navy)"}}>{f.tipo==="nota_credito"?"NC ":""}{f.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{fmtDate(f.fechaEmision||f.fecha)} · {f.receptorNombre||"—"} · {fmtMoney(f.total,f.moneda)}</div></>,
        estado:<span className={`st ${FAC_STATUS_CLS[f.status]||"s5"}`}><span className="st-dot"/>{(FAC_STATUS_LABEL[f.status]||f.status).replace(/^\S+\s/,"")}</span>,
        acc:verImp(()=>setFacPrint(f),()=>printFactura(f))}));
    if(tipo==="recibo"){const m=new Map();pagosVis.forEach(p=>{if(!p.reciboId)return;if(!m.has(p.reciboId))m.set(p.reciboId,{id:p.reciboId,fecha:p.fecha,quien:p.pagadorNombre||(pagadorDePago(p)||{}).nombre||"—",monto:0,moneda:p.moneda||"USD",anulado:true,facs:new Set()});
        const r=m.get(p.reciboId);if(!p.anulado){r.anulado=false;if(p.tipoPago!=="saldo_favor")r.monto+=p.monto;}if(p.facturaId)r.facs.add(p.facturaId);});
      filas=[...m.values()].filter(r=>hay(`${r.id} ${r.quien} ${[...r.facs].join(" ")}`)).sort(porFecha).slice(0,MAX).map(r=>({k:r.id,
        izq:<><span style={{...mono,color:"var(--navy)"}}>{r.id}</span><div style={{fontSize:13,color:"var(--t3)"}}>{fmtDate(r.fecha)} · {r.quien} · {fmtMoney(r.monto,r.moneda)}{r.facs.size?` · fact. ${[...r.facs].join(", ")}`:""}</div></>,
        estado:r.anulado?<span style={{fontSize:12,fontWeight:700,color:"var(--red)"}}>Anulado</span>:null,
        acc:verImp(()=>verRecibo(r.id),()=>printRecibo(r.id))}));}
    const ph={wr:"Buscar WR, nombre, casillero o tracking…",guia:"Buscar guía, destino, AWB o BL…",entrega:"Buscar nota, receptor, guía o WR…",egreso:"Buscar cargo release, agente de carga o WR…",factura:"Buscar factura, cliente, casillero o WR…",recibo:"Buscar recibo, cliente o factura…"}[tipo];
    return (
    <div className="page-scroll">
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex",gap:3,background:"var(--bg4)",borderRadius:8,padding:3,border:"1px solid var(--b1)",flexWrap:"wrap",marginBottom:12}}>
          {TIPOS.map(([k,l])=><button key={k} onClick={()=>{setEtqTipo(k);setEtqSearch("");}} style={{flex:"1 1 130px",padding:"8px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:tipo===k?"var(--navy)":"transparent",color:tipo===k?"#fff":"var(--t2)"}}>{l}</button>)}
        </div>
        <input className="fi" autoFocus style={{fontSize:15,padding:"9px 12px"}} value={etqSearch} onChange={e=>setEtqSearch(e.target.value)} placeholder={ph}/>
      </div>
      <div className="card" style={{padding:0}}>
        {filas.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>{Q?"Sin coincidencias.":"No hay documentos."}</div>:
        filas.map(f=>(
          <div key={f.k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:"1px solid var(--b1)",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>{f.izq}</div>
            {f.estado}
            <div style={{display:"flex",gap:6}}>{f.acc}</div>
          </div>))}
        {!Q&&filas.length===MAX&&<div style={{padding:10,textAlign:"center",fontSize:13,color:"var(--t3)"}}>Últimos {MAX}. Usa el buscador para encontrar otros.</div>}
      </div>
    </div>
    );
  };

  // ── CONFIGURACIÓN ───────────────────────────────────────────────────────────

  const renderSettings=()=>{
    if(!canAdmin)return <div className="page-scroll"><div className="card" style={{textAlign:"center",padding:60,color:"var(--t3)"}}>Solo Administradores pueden acceder a Configuración.</div></div>;

    const CFG_TABS=[
      {k:"numeracion",l:"Numeración",ic:"🔢"},
      {k:"tipoenvio",l:"Tipo de Envío",ic:"✈️"},
      {k:"servicios",l:"Servicios Adicionales",ic:"⚡"},
      {k:"cargos",l:"Gastos Adicionales",ic:"💲"},
      {k:"pagos",l:"Tipos de Pago",ic:"💳"},
      {k:"contenedores",l:"Tipos de Contenedor",ic:"📦"},
      {k:"paises",l:"Países y Ciudades",ic:"🌎"},
      {k:"notas",l:"Notas Legales",ic:"📜"},
      {k:"agentes",l:"Agentes",ic:"🤝"},
      {k:"oficinas",l:"Oficinas",ic:"🏢"},
      {k:"tarifas",l:"Tarifas",ic:"💰"},
      {k:"actividad",l:"Registro de Actividad",ic:"📋"},
    ];

    return (
      <div className="page-scroll">
        {/* TAB BAR */}
        <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
          {CFG_TABS.map(t=>(
            <button key={t.k} onClick={()=>{setCfgTab(t.k);if(t.k!=="actividad")setActFilter("");}}
              style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--b1)",cursor:"pointer",fontSize:14,fontWeight:600,
                background:cfgTab===t.k?"var(--navy)":"var(--bg2)",
                color:cfgTab===t.k?"#fff":"var(--t2)",transition:"all .1s"}}>
              {t.ic} {t.l}
            </button>
          ))}
        </div>

        {/* ── NUMERACIÓN ── */}
        {cfgTab==="numeracion"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {/* WR */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"16px"}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:4}}>📦 Numeración de WR</div>
              {[
                {v:1,l:"Tipo 1 — 7 dígitos secuenciales",ex:"0000001"},
                {v:2,l:"Tipo 2 — Indicativo + Oficina Origen + Oficina Destino + Secuencia",ex:`${empresaSlug}01MIA01VLN0000001`},
                {v:3,l:"Tipo 3 — País+Ciudad Origen + País+Ciudad Destino + Secuencia",ex:"01MI58VL0000001"},
              ].map(t=>(
                <div key={t.v} onClick={()=>setWrNumTipo(t.v)} style={{padding:"10px 12px",borderRadius:8,border:`2px solid ${wrNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:wrNumTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:8,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${wrNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:wrNumTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                    <div style={{fontWeight:600,fontSize:14,color:"var(--t1)"}}>{t.l}</div>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--cyan)",marginTop:4,marginLeft:24}}>Ej: {t.ex}</div>
                </div>
              ))}
              {wrNumTipo===2&&(
                <div className="fg" style={{marginBottom:10}}>
                  <div className="fl">Indicativo de empresa (ej: 1N)</div>
                  <input className="fi" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,maxWidth:120}} value={empresaSlug} onChange={e=>setEmpresaSlug(e.target.value.toUpperCase())} maxLength={4}/>
                </div>
              )}
              <div className="fg">
                <div className="fl">Número de inicio de secuencia</div>
                <input className="fi" type="number" min="1" style={{maxWidth:150,fontFamily:"'DM Mono',monospace",fontWeight:700}} value={wrSecInicio} onChange={e=>setWrSecInicio(parseInt(e.target.value)||1)}/>
              </div>
              <div style={{marginTop:10,padding:"8px 12px",background:"var(--bg4)",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:14,color:"var(--navy)",fontWeight:700}}>
                Próximo WR: {buildWRNum(_wrOrigCode,_wrDestCode,_wrNextSeq,wrNumTipo,wrSecInicio,empresaSlug)}
              </div>
            </div>

            {/* GUÍA CONSOLIDADA */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"16px"}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:4}}>🗂️ Numeración de Guía Consolidada</div>
              {[
                {v:1,l:"Tipo 1 — 7 dígitos secuenciales",ex:"0000001"},
                {v:2,l:"Tipo 2 — Oficina Origen + Oficina Destino + Secuencia",ex:"01VLN01CCS0000001"},
                {v:3,l:"Tipo 3 — Fecha + Oficina Destino + Secuencia + Tipo Envío",ex:"26040801VLN0000001M"},
              ].map(t=>(
                <div key={t.v} onClick={()=>setConsolNumTipo(t.v)} style={{padding:"10px 12px",borderRadius:8,border:`2px solid ${consolNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:consolNumTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:8,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${consolNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:consolNumTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                    <div style={{fontWeight:600,fontSize:14,color:"var(--t1)"}}>{t.l}</div>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--cyan)",marginTop:4,marginLeft:24}}>Ej: {t.ex}</div>
                </div>
              ))}
              <div className="fg" style={{marginTop:8}}>
                <div className="fl">Número de inicio de secuencia</div>
                <input className="fi" type="number" min="1" style={{maxWidth:150,fontFamily:"'DM Mono',monospace",fontWeight:700}} value={consolSecInicio} onChange={e=>setConsolSecInicio(parseInt(e.target.value)||1)}/>
              </div>
              <div style={{marginTop:10,padding:"8px 12px",background:"var(--bg4)",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:14,color:"var(--navy)",fontWeight:700}}>
                Próxima Guía: {buildConsolNum(offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.origCity.toUpperCase()))||oficinas[0]),offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.destCity.toUpperCase()))||oficinas[oficinas.length-1]||oficinas[0]),(()=>{if(consolList.length===0)return 1;const nums=consolList.map(c=>{const m=String(c.id||"").match(/(\d+)(?=[^0-9]*$)/);return m?parseInt(m[1]):0;});return Math.max(...nums)+1;})(),consolNumTipo,consolSecInicio,"Marítimo")}
              </div>
            </div>

            {/* ETIQUETAS */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"16px",gridColumn:"1/-1"}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:12}}>🏷️ Tipo de Etiqueta Predeterminada</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--t2)",marginBottom:8}}>📦 Etiqueta WR</div>
                  {[{v:1,l:"4×6 pulg. — Tipo 1 Básica (7 franjas)"},{v:2,l:"4×6 pulg. — Tipo 2 Completa (5 franjas + QR)"},{v:3,l:"4×2 pulg. — Tipo 3 Básica (3 franjas)"},{v:4,l:"4×2 pulg. — Tipo 4 Completa (3 franjas)"}].map(t=>(
                    <div key={t.v} onClick={()=>setLabelWRTipo(t.v)} style={{padding:"8px 12px",borderRadius:6,border:`2px solid ${labelWRTipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelWRTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${labelWRTipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelWRTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                      <div style={{fontSize:14,fontWeight:600}}>{t.l}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--t2)",marginBottom:8}}>🗂️ Etiqueta Guía Consolidada</div>
                  {[{v:1,l:"4×6 pulg. — Tipo 1 Grande (5 franjas)"},{v:2,l:"4×2 pulg. — Tipo 2 Compacta"}].map(t=>(
                    <div key={t.v} onClick={()=>setLabelCSATipo(t.v)} style={{padding:"8px 12px",borderRadius:6,border:`2px solid ${labelCSATipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelCSATipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${labelCSATipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelCSATipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                      <div style={{fontSize:14,fontWeight:600}}>{t.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fg" style={{marginTop:12,maxWidth:300}}>
                <div className="fl">Nombre de la Empresa / Agente en etiquetas</div>
                <input className="fi" value={empresaNombre} onChange={e=>setEmpresaNombre(e.target.value.toUpperCase())} placeholder="ENEX"/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
              <button className="btn-p" style={{padding:"9px 24px",fontSize:15}} onClick={()=>{
                dbSetConfig('wr_num_tipo',wrNumTipo);
                dbSetConfig('wr_sec_inicio',wrSecInicio);
                dbSetConfig('consol_num_tipo',consolNumTipo);
                dbSetConfig('consol_sec_inicio',consolSecInicio);
                dbSetConfig('empresa_slug',empresaSlug);
                dbSetConfig('label_wr_tipo',labelWRTipo);
                dbSetConfig('label_csa_tipo',labelCSATipo);
                logAction("Guardó configuración de numeración","");
                alert("✅ Configuración de numeración guardada correctamente.");
              }}>💾 Guardar Numeración</button>
            </div>
          </div>
        )}

        {/* ── TIPO DE ENVÍO ── */}
        {cfgTab==="tipoenvio"&&(
          <ListEditor title="✈️ Tipos de Envío" items={SEND_TYPES}
            onAdd={v=>{const n=[...SEND_TYPES,v];setSendTypes(n);dbSetConfig('send_types',n);}}
            onDelete={i=>{const n=SEND_TYPES.filter((_,j)=>j!==i);setSendTypes(n);dbSetConfig('send_types',n);}}
            placeholder="Ej: Aéreo Premium, Courier…"/>
        )}

        {/* ── SERVICIOS ADICIONALES ── */}
        {cfgTab==="servicios"&&(
          <PriceListEditor title="⚡ Servicios Adicionales" items={SERVICIOS_CAT} placeholder="Ej: Embalaje especial, Custodia…"
            onSave={n=>{setServiciosCat(n);dbSetConfig('servicios_cat',n);}}/>
        )}

        {/* ── GASTOS ADICIONALES ── */}
        {cfgTab==="cargos"&&(
          <PriceListEditor title="💲 Gastos Adicionales" items={GASTOS_CAT} placeholder="Ej: Recargo combustible, Seguro…"
            onSave={n=>{setGastosCat(n);dbSetConfig('gastos_cat',n);}}/>
        )}

        {/* ── TIPOS DE PAGO ── */}
        {cfgTab==="pagos"&&(
          <ListEditor title="💳 Tipos de Pago" items={PAY_TYPES}
            onAdd={v=>{const n=[...PAY_TYPES,v];setPayTypes(n);dbSetConfig('pay_types',n);}}
            onDelete={i=>{const n=PAY_TYPES.filter((_,j)=>j!==i);setPayTypes(n);dbSetConfig('pay_types',n);}}
            placeholder="Ej: Zelle, Pago Móvil, Transferencia…"/>
        )}

        {/* ── TIPOS DE CONTENEDOR ── */}
        {cfgTab==="contenedores"&&(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:12}}>📦 Tipos de Contenedor</div>
            {/* Agregar / Editar */}
            <div style={{display:"grid",gridTemplateColumns:"100px 1fr 1fr 120px auto",gap:8,marginBottom:12,alignItems:"flex-end"}}>
              <div className="fg"><div className="fl">Código</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontWeight:700}} value={cfgNewCont.code} onChange={e=>setCfgNewCont(p=>({...p,code:e.target.value.toUpperCase()}))} placeholder="EH"/></div>
              <div className="fg"><div className="fl">Nombre</div><input className="fi" value={cfgNewCont.name} onChange={e=>setCfgNewCont(p=>({...p,name:e.target.value.toUpperCase()}))} placeholder="EH — EXTRA HIGH"/></div>
              <div className="fg"><div className="fl">Dimensiones</div><input className="fi" value={cfgNewCont.dim} onChange={e=>setCfgNewCont(p=>({...p,dim:e.target.value.toUpperCase()}))} placeholder="88×56×60 IN"/></div>
              <div className="fg"><div className="fl">Máx. lb</div><input className="fi" type="number" value={cfgNewCont.maxLb} onChange={e=>setCfgNewCont(p=>({...p,maxLb:e.target.value}))}/></div>
              <div style={{display:"flex",gap:6,alignSelf:"flex-end"}}>
                <button className="btn-p" style={{padding:"8px 14px"}} onClick={()=>{
                  if(!cfgNewCont.code||!cfgNewCont.name)return;
                  let n;
                  if(cfgEditContIdx!==null){
                    n=CONTAINER_TYPES.map((c,i)=>i===cfgEditContIdx?{...cfgNewCont,maxLb:parseInt(cfgNewCont.maxLb)||0}:c);
                    setCfgEditContIdx(null);
                  } else {
                    n=[...CONTAINER_TYPES,{...cfgNewCont,maxLb:parseInt(cfgNewCont.maxLb)||0}];
                  }
                  setContainerTypes(n);dbSetConfig('container_types',n);
                  setCfgNewCont({code:"",name:"",dim:"",maxLb:""});
                }}>{cfgEditContIdx!==null?"💾 Guardar":"+ Agregar"}</button>
                {cfgEditContIdx!==null&&<button className="btn-s" style={{padding:"8px 10px",fontSize:13}} onClick={()=>{setCfgEditContIdx(null);setCfgNewCont({code:"",name:"",dim:"",maxLb:""});}}>✕</button>}
              </div>
            </div>
            {/* Lista */}
            <table className="ct">
              <thead><tr><th>Código</th><th>Nombre</th><th>Dimensiones</th><th>Máx. lb</th><th>Acc.</th></tr></thead>
              <tbody>
                {CONTAINER_TYPES.length===0&&<tr><td colSpan={5} style={{textAlign:"center",padding:24,color:"var(--t3)"}}>No hay tipos de contenedor registrados.</td></tr>}
                {CONTAINER_TYPES.map((c,i)=>(
                  <tr key={i} style={{background:cfgEditContIdx===i?"#EEF3FF":""}}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--navy)",fontSize:15}}>{c.code}</span></td>
                    <td style={{fontWeight:600}}>{c.name}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--t2)"}}>{c.dim}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{(c.maxLb||0).toLocaleString()}lb</td>
                    <td><div style={{display:"flex",gap:4}}>
                      <button className="btn-s" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>{setCfgNewCont({code:c.code,name:c.name,dim:c.dim,maxLb:c.maxLb});setCfgEditContIdx(i);}}>✏️ Editar</button>
                      <button className="btn-d" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>{const n=CONTAINER_TYPES.filter((_,j)=>j!==i);setContainerTypes(n);dbSetConfig('container_types',n);if(cfgEditContIdx===i){setCfgEditContIdx(null);setCfgNewCont({code:"",name:"",dim:"",maxLb:""});}}}>🗑</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PAÍSES Y CIUDADES ── */}
        {cfgTab==="notas"&&(()=>{
          const opciones=[{k:"_default",l:"Predeterminada (todos los países)"},...COUNTRIES.map(c=>({k:c.name,l:c.name}))];
          const sel=notaDraft?.pais||"_default";
          const guardado=notasLegales[sel]||"";
          const texto=notaDraft&&notaDraft.pais===sel&&notaDraft.texto!==undefined?notaDraft.texto:(guardado||(sel==="_default"?NOTA_LEGAL_DEFAULT:""));
          const cambiado=texto!==(guardado||(sel==="_default"?NOTA_LEGAL_DEFAULT:""));
          const guardar=async(valor)=>{
            const n={...notasLegales};
            if(valor&&valor.trim())n[sel]=valor.trim();else delete n[sel];
            const ok=await dbSetConfig('notas_legales',n);
            if(ok===false){window.alert("No se pudo guardar la nota. Inténtalo de nuevo.");return;}
            setNotasLegales(n);setNotaDraft({pais:sel});
            logAction("Editó nota legal",sel==="_default"?"Predeterminada":sel);
          };
          return (
            <div style={{display:"grid",gridTemplateColumns:"260px minmax(0,1fr)",gap:14}}>
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                {opciones.map(o=>(
                  <div key={o.k} onClick={()=>setNotaDraft({pais:o.k})}
                    style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--b2)",fontSize:14,fontWeight:sel===o.k?700:500,
                      background:sel===o.k?"var(--navy)":"transparent",color:sel===o.k?"#fff":"var(--t1)",display:"flex",justifyContent:"space-between",gap:8}}>
                    <span>{o.l}</span>
                    {o.k!=="_default"&&notasLegales[o.k]&&<span style={{fontSize:12,opacity:.8}}>✓ propia</span>}
                  </div>
                ))}
              </div>
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:4}}>📜 {sel==="_default"?"Nota predeterminada":sel}</div>
                <div style={{fontSize:13,color:"var(--t3)",marginBottom:10}}>{"{EMPRESA}"} = nombre de la empresa</div>
                <textarea className="fi" rows={12} value={texto} onChange={e=>setNotaDraft({pais:sel,texto:e.target.value})}
                  placeholder={notasLegales._default||NOTA_LEGAL_DEFAULT}
                  style={{width:"100%",resize:"vertical",fontFamily:"inherit",fontSize:14,lineHeight:1.5,textTransform:"none"}}/>
                <div style={{display:"flex",gap:8,marginTop:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
                  {sel!=="_default"&&guardado&&<button className="btn-s" onClick={()=>{if(window.confirm(`¿Quitar la nota propia de ${sel}? Usará la predeterminada.`))guardar("");}}>Usar la predeterminada</button>}
                  {cambiado&&<button className="btn-s" onClick={()=>setNotaDraft({pais:sel})}>Descartar</button>}
                  <button className="btn-p" disabled={!cambiado} onClick={()=>guardar(texto)}>💾 Guardar</button>
                </div>
              </div>
            </div>
          );
        })()}
        {cfgTab==="paises"&&(
          <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:14}}>
            {/* Lista de países */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)"}}>🌎 Países</div>
              {/* Agregar país */}
              <div style={{padding:"10px 12px",borderBottom:"1px solid var(--b1)"}}>
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr auto",gap:6,alignItems:"flex-end"}}>
                  <div className="fg"><div className="fl" style={{fontSize:11}}>Código</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontSize:13}} value={cfgNewPais.dial} onChange={e=>setCfgNewPais(p=>({...p,dial:e.target.value}))} placeholder="57"/></div>
                  <div className="fg"><div className="fl" style={{fontSize:11}}>País + Bandera</div><input className="fi" style={{fontSize:13}} value={cfgNewPais.name} onChange={e=>setCfgNewPais(p=>({...p,name:e.target.value}))} placeholder="Colombia 🇨🇴"/></div>
                  <button className="btn-p" style={{padding:"6px 10px",fontSize:13,alignSelf:"flex-end"}} onClick={()=>{
                    if(cfgNewPais.dial&&cfgNewPais.name){
                      const n=[...COUNTRIES,{dial:cfgNewPais.dial,name:cfgNewPais.name,cities:[]}];
                      setCountries(n);dbSetConfig('countries',n);
                      setCfgNewPais({dial:"",name:""});
                    }
                  }}>+</button>
                </div>
              </div>
              <div style={{maxHeight:"60vh",overflowY:"auto"}}>
                {COUNTRIES.map((c,i)=>(
                  <div key={i} onClick={()=>setCfgSelPais(i)}
                    style={{padding:"9px 14px",cursor:"pointer",borderBottom:"1px solid var(--b2)",display:"flex",alignItems:"center",gap:8,
                      background:cfgSelPais===i?"#EEF3FF":"",borderLeft:cfgSelPais===i?"3px solid var(--navy)":"3px solid transparent"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:14}}>{c.name}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t3)"}}>+{c.dial} · {c.cities.length} ciudades</div>
                    </div>
                    <span onClick={e=>{e.stopPropagation();const n=COUNTRIES.filter((_,j)=>j!==i);setCountries(n);dbSetConfig('countries',n);if(cfgSelPais>=i)setCfgSelPais(Math.max(0,cfgSelPais-1));}} style={{color:"var(--red)",cursor:"pointer",fontSize:15,fontWeight:700}}>×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ciudades del país seleccionado */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)"}}>
                🏙️ Ciudades — {COUNTRIES[cfgSelPais]?.name||"Selecciona un país"}
              </div>
              {COUNTRIES[cfgSelPais]&&(
                <>
                  <div style={{padding:"10px 12px",borderBottom:"1px solid var(--b1)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"80px 1fr auto",gap:6,alignItems:"flex-end"}}>
                      <div className="fg"><div className="fl" style={{fontSize:11}}>Código</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontWeight:700}} value={cfgNewCity.code} onChange={e=>setCfgNewCity(p=>({...p,code:e.target.value.toUpperCase()}))} placeholder="MED"/></div>
                      <div className="fg"><div className="fl" style={{fontSize:11}}>Nombre Ciudad</div><input className="fi" value={cfgNewCity.name} onChange={e=>setCfgNewCity(p=>({...p,name:e.target.value}))} placeholder="Medellín"/></div>
                      <button className="btn-p" style={{padding:"6px 12px",alignSelf:"flex-end"}} onClick={()=>{
                        if(cfgNewCity.code&&cfgNewCity.name){
                          const n=COUNTRIES.map((c,i)=>i===cfgSelPais?{...c,cities:[...c.cities,{code:cfgNewCity.code,name:cfgNewCity.name}]}:c);
                          setCountries(n);dbSetConfig('countries',n);
                          setCfgNewCity({code:"",name:""});
                        }
                      }}>+ Agregar</button>
                    </div>
                  </div>
                  <div style={{padding:"8px 12px",display:"flex",flexWrap:"wrap",gap:6}}>
                    {(COUNTRIES[cfgSelPais]?.cities||[]).map((c,ci)=>(
                      <div key={ci} style={{display:"inline-flex",alignItems:"center",gap:5,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,padding:"4px 10px",fontSize:14}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:13}}>{c.code}</span>
                        <span style={{color:"var(--t2)"}}>{c.name}</span>
                        <span onClick={()=>{const n=COUNTRIES.map((co,i)=>i===cfgSelPais?{...co,cities:co.cities.filter((_,j)=>j!==ci)}:co);setCountries(n);dbSetConfig('countries',n);}} style={{color:"var(--red)",cursor:"pointer",fontSize:16,fontWeight:700}}>×</span>
                      </div>
                    ))}
                    {(COUNTRIES[cfgSelPais]?.cities||[]).length===0&&<div style={{color:"var(--t3)",fontSize:13,padding:"8px 0"}}>No hay ciudades registradas.</div>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── REGISTRO DE ACTIVIDAD ── */}
        {/* ── AGENTES ── */}
        {cfgTab==="agentes"&&(()=>{
          const usuariosDe=a=>clients.filter(c=>c.tipo==="usuario"&&["E","E1"].includes(c.rol)&&c.agenteId===a.id);
          const conDatos=a=>{const u=usuariosDe(a).find(c=>c.rol==="E")||usuariosDe(a)[0];if(!u)return a;
            return {...a,ciudad:a.ciudad||[u.municipio,u.estado].filter(Boolean).join(", "),pais:a.pais||u.pais||"",tel:a.tel||u.tel1||"",
              email:a.email||u.email||"",contacto:a.contacto||fullName(u)||""};};
          const abrirEditar=a=>{const d=conDatos(a);setAgForm({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:"",...d});setEditAgente(a);setShowNewAgente(true);};
          return(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:17,fontWeight:700,color:"var(--navy)",flex:1}}>🤝 Agentes registrados</div>
              {hasPerm("crear_agente")&&<button className="btn-p" style={{fontSize:13}} onClick={()=>{setAgForm({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});setShowNewAgente(true);}}>+ Nuevo Agente</button>}
            </div>
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <table className="ct">
                <thead><tr>
                  <th>Código</th><th>Nombre</th><th>Ciudad</th><th>País</th><th>Teléfono</th><th>Email</th><th>Contacto</th><th>Estado</th><th>Acc.</th>
                </tr></thead>
                <tbody>
                  {agentes.length===0&&<tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay agentes registrados.</td></tr>}
                  {agentes.map(a0=>{const a=conDatos(a0);return(
                    <tr key={a.id} style={{cursor:"pointer"}} onClick={()=>setVerAgente(a0)}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 8px",borderRadius:4,border:"1px solid #B8C8F0"}}>{a.codigo}</span></td>
                      <td style={{fontWeight:600}}>{a.nombre}</td>
                      <td style={{fontSize:13}}>{a.ciudad||"—"}</td>
                      <td style={{fontSize:13}}>{a.pais||"—"}</td>
                      <td style={{fontSize:13,fontFamily:"'DM Mono',monospace"}}>{a.tel||"—"}</td>
                      <td style={{fontSize:13,color:"var(--cyan)"}}>{a.email||"—"}</td>
                      <td style={{fontSize:13}}>{a.contacto||"—"}</td>
                      <td><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,background:a.activo?"#E8F8EE":"#FEE8E8",color:a.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:a.activo?"#80D0A0":"#F0A0A0"}}>{a.activo?"✅ Activo":"❌ Inactivo"}</span></td>
                      <td onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:4}}>
                        <span className="ic-b" title="Ver" onClick={()=>setVerAgente(a0)}>👁️</span>
                        {hasPerm("editar_agente")&&<span className="ic-b" onClick={()=>abrirEditar(a0)}>✏️</span>}
                        {hasPerm("borrar_agente")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(!window.confirm(`¿Borrar agente ${a.codigo} — ${a.nombre}?`))return;setAgentes(p=>p.filter(x=>x.id!==a.id));dbDeleteAgente(a.id);logAction("Borró agente",`${a.codigo} — ${a.nombre}`);}}>🗑</span>}
                      </div></td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
            {verAgente&&(()=>{const a=conDatos(verAgente);const us=usuariosDe(verAgente);
              const cls=clients.filter(c=>c.tipo==="cliente"&&["agente","vendedor_agente"].includes(c.clienteTipo)&&c.agenteId===verAgente.id);
              const tfs=tarifas.filter(t=>t.aplicaTipo==="agente"&&t.aplicaId===verAgente.id);
              const D=(l,v)=><div><div className="fl">{l}</div><div style={{fontSize:14,fontWeight:600}}>{v||"—"}</div></div>;
              return(
              <div className="ov" onClick={()=>setVerAgente(null)}>
                <div className="modal" style={{maxWidth:620}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">🤝 {a.codigo} — {a.nombre}</div><button className="mcl" onClick={()=>setVerAgente(null)}>✕</button></div>
                  <div className="fgrid g2" style={{gap:12,marginBottom:14}}>
                    {D("Ciudad",a.ciudad)}{D("País",a.pais)}{D("Teléfono",a.tel)}{D("Email",a.email)}{D("Contacto",a.contacto)}{D("Estado",a.activo!==false?"✅ Activo":"❌ Inactivo")}
                    {a.notas&&<div className="full">{D("Notas",a.notas)}</div>}
                  </div>
                  <div className="sdiv">USUARIOS ({us.length})</div>
                  <div style={{marginBottom:12}}>{us.length===0?<div style={{color:"var(--t3)",fontSize:13}}>—</div>:us.map(u=>(
                    <div key={u.id} style={{fontSize:13,padding:"4px 0",borderBottom:"1px solid var(--b1)"}}><b>{u.id}</b> · {fullName(u)} · {u.rol==="E"?"Agente":"Vendedor"}{u.email?` · ${u.email}`:""}{u.tel1?` · ${u.tel1}`:""}</div>))}</div>
                  <div className="sdiv">CLIENTES ({cls.length})</div>
                  <div style={{marginBottom:12,fontSize:13}}>{cls.length===0?<span style={{color:"var(--t3)"}}>—</span>:cls.map(c=><span key={c.id} style={{display:"inline-block",marginRight:10}}>#{c.casillero} {fullName(c)}</span>)}</div>
                  <div className="sdiv" style={{display:"flex",alignItems:"center"}}>TARIFAS ESPECIALES ({tfs.length})<span style={{marginLeft:"auto",cursor:"pointer",color:"var(--cyan)"}} onClick={()=>{const x=verAgente;setVerAgente(null);setTafGrupo(`agente:${x.id}`);setTafQ("");setCfgTab("tarifas");}}>💰 Ir a sus tarifas</span></div>
                  <div style={{fontSize:13,marginBottom:12}}>{tfs.length===0?<span style={{color:"var(--t3)"}}>—</span>:tfs.map(t=><div key={t.id}>{t.id} · {t.tipoEnvio} · {[t.ciudadOrig||t.paisOrig,t.ciudadDest||t.paisDest].map(x=>x||"Cualquiera").join(" → ")} · {cSym(t.moneda)}{/^a/i.test(t.tipoEnvio||"")?t.porLb:t.porFt3}/{t.unidad||(/^a/i.test(t.tipoEnvio||"")?"lb":"ft³")} · mín {cSym(t.moneda)}{t.min}</div>)}</div>
                  <div className="mft" style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                    {hasPerm("editar_agente")&&<button className="btn-p" onClick={()=>{const x=verAgente;setVerAgente(null);abrirEditar(x);}}>✏️ Editar</button>}
                    <button className="btn-s" onClick={()=>setVerAgente(null)}>Cerrar</button>
                  </div>
                </div>
              </div>);})()}
            {showNewAgente&&(
              <div className="ov">
                <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">{editAgente?"✏️ Editar Agente":"➕ Nuevo Agente"}</div><button className="mcl" onClick={()=>{setShowNewAgente(false);setEditAgente(null);}}>✕</button></div>
                  <div className="fgrid g2" style={{marginBottom:10}}>
                    <div className="fg full"><div className="fl">Nombre del Agente *</div><input className="fi" value={agForm.nombre} onChange={e=>setAgForm(p=>({...p,nombre:e.target.value.toUpperCase()}))} placeholder="Nombre completo o razón social"/></div>
                    <div className="fg"><div className="fl">Ciudad</div><input className="fi" value={agForm.ciudad} onChange={e=>setAgForm(p=>({...p,ciudad:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">País</div><input className="fi" value={agForm.pais} onChange={e=>setAgForm(p=>({...p,pais:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">Teléfono</div><input className="fi" value={agForm.tel} onChange={e=>setAgForm(p=>({...p,tel:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">Email</div><input className="fi" type="email" value={agForm.email} onChange={e=>setAgForm(p=>({...p,email:e.target.value}))}/></div>
                    <div className="fg full"><div className="fl">Persona de Contacto</div><input className="fi" value={agForm.contacto} onChange={e=>setAgForm(p=>({...p,contacto:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg full"><div className="fl">Notas</div><input className="fi" value={agForm.notas} onChange={e=>setAgForm(p=>({...p,notas:e.target.value.toUpperCase()}))}/></div>
                  </div>
                  <div className="mft">
                    <button className="btn-s" onClick={()=>{setShowNewAgente(false);setEditAgente(null);}}>Cancelar</button>
                    <button className="btn-p" onClick={()=>{
                      if(!agForm.nombre.trim())return;
                      if(editAgente){
                        const updated={...editAgente,...agForm};
                        setAgentes(p=>p.map(a=>a.id===editAgente.id?updated:a));
                        dbUpsertAgente(updated);
                        logAction("Actualizó agente",`${editAgente.codigo} — ${agForm.nombre}`);
                      }
                      else{
                        const nextCod=String(agentes.length+1).padStart(2,"0");
                        const newId=crypto.randomUUID();
                        const na={...agForm,id:newId,codigo:nextCod,activo:true};
                        setAgentes(p=>[...p,na]);
                        dbUpsertAgente(na);
                        logAction("Creó agente",`${nextCod} — ${agForm.nombre}`);
                      }
                      setShowNewAgente(false);setEditAgente(null);
                    }}>Guardar ✅</button>
                  </div>
                </div>
              </div>
            )}
          </div>);
        })()}

        {/* ── OFICINAS ── */}
        {cfgTab==="oficinas"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:17,fontWeight:700,color:"var(--navy)",flex:1}}>🏢 Oficinas / Sucursales</div>
              {hasPerm("crear_oficina")&&<button className="btn-p" style={{fontSize:13}} onClick={()=>{setOfForm({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:"",tipo:"Matriz"});setShowNewOficina(true);}}>+ Nueva Oficina</button>}
            </div>
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <table className="ct">
                <thead><tr>
                  <th>Código</th><th>Nombre</th><th>Tipo</th><th>Ciudad</th><th>País</th><th>Teléfono</th><th>Email</th><th>Contacto</th><th>Estado</th><th>Acc.</th>
                </tr></thead>
                <tbody>
                  {oficinas.length===0&&<tr><td colSpan={10} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay oficinas registradas aún.</td></tr>}
                  {oficinas.map(o=>(
                    <tr key={o.id}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--purple)",background:"#F3EFFE",padding:"2px 8px",borderRadius:4,border:"1px solid #C0A0F0"}}>{o.codigo}</span></td>
                      <td style={{fontWeight:600}}>{o.nombre}</td>
                      <td><span style={{fontSize:11,padding:"2px 10px",borderRadius:4,fontWeight:700,
                        background:o.tipo==="Asociado"?"#FEF0E8":"#EEF3FF",
                        color:o.tipo==="Asociado"?"var(--orange)":"var(--navy)",
                        border:"1px solid",
                        borderColor:o.tipo==="Asociado"?"#F0B880":"#B8C8F0"}}>
                        {o.tipo==="Asociado"?"🤝 Asociado":"🏛️ Matriz"}
                      </span></td>
                      <td style={{fontSize:13}}>{o.ciudad||"—"}</td>
                      <td style={{fontSize:13}}>{o.pais||"—"}</td>
                      <td style={{fontSize:13,fontFamily:"'DM Mono',monospace"}}>{o.tel||"—"}</td>
                      <td style={{fontSize:13,color:"var(--cyan)"}}>{o.email||"—"}</td>
                      <td style={{fontSize:13}}>{o.contacto||"—"}</td>
                      <td><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,background:o.activo?"#E8F8EE":"#FEE8E8",color:o.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:o.activo?"#80D0A0":"#F0A0A0"}}>{o.activo?"✅ Activo":"❌ Inactivo"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        {hasPerm("editar_oficina")&&<span className="ic-b" onClick={()=>{setOfForm(o);setEditOficina(o);setShowNewOficina(true);}}>✏️</span>}
                        {hasPerm("borrar_oficina")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(!window.confirm(`¿Borrar oficina ${o.codigo} — ${o.nombre}?`))return;setOficinas(p=>p.filter(x=>x.id!==o.id));dbDeleteOficina(o.id);logAction("Borró oficina",`${o.codigo} — ${o.nombre}`);}}>🗑</span>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showNewOficina&&(
              <div className="ov">
                <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">{editOficina?"✏️ Editar Oficina":"➕ Nueva Oficina"}</div><button className="mcl" onClick={()=>{setShowNewOficina(false);setEditOficina(null);}}>✕</button></div>
                  <div className="fgrid g2" style={{marginBottom:10}}>
                    <div className="fg full"><div className="fl">Nombre de la Oficina *</div><input className="fi" value={ofForm.nombre} onChange={e=>setOfForm(p=>({...p,nombre:e.target.value.toUpperCase()}))} placeholder="Ej: Oficina Valencia"/></div>
                    <div className="fg full">
                      <div className="fl">Tipo de Oficina *</div>
                      <div style={{display:"flex",gap:8,marginTop:4}}>
                        {["Matriz","Asociado"].map(t=>(
                          <button key={t} className={`btn-${(ofForm.tipo||"Matriz")===t?"p":"s"}`}
                            style={{flex:1,fontSize:13}}
                            onClick={()=>setOfForm(p=>({...p,tipo:t}))}>
                            {t==="Matriz"?"🏛️ Matriz (Oficina Propia)":"🤝 Asociado (Franquiciado)"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="fg"><div className="fl">Ciudad</div><input className="fi" value={ofForm.ciudad} onChange={e=>setOfForm(p=>({...p,ciudad:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">País</div><input className="fi" value={ofForm.pais} onChange={e=>setOfForm(p=>({...p,pais:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">Teléfono</div><input className="fi" value={ofForm.tel} onChange={e=>setOfForm(p=>({...p,tel:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg"><div className="fl">Email</div><input className="fi" type="email" value={ofForm.email} onChange={e=>setOfForm(p=>({...p,email:e.target.value}))}/></div>
                    <div className="fg full"><div className="fl">Persona de Contacto</div><input className="fi" value={ofForm.contacto} onChange={e=>setOfForm(p=>({...p,contacto:e.target.value.toUpperCase()}))}/></div>
                    <div className="fg full"><div className="fl">Notas</div><input className="fi" value={ofForm.notas} onChange={e=>setOfForm(p=>({...p,notas:e.target.value.toUpperCase()}))}/></div>
                  </div>
                  <div className="mft">
                    <button className="btn-s" onClick={()=>{setShowNewOficina(false);setEditOficina(null);}}>Cancelar</button>
                    <button className="btn-p" onClick={()=>{
                      if(!ofForm.nombre.trim())return;
                      if(editOficina){
                        setOficinas(p=>p.map(o=>o.id===editOficina.id?{...o,...ofForm}:o));
                        dbUpsertOficina({...editOficina,...ofForm});
                        logAction("Actualizó oficina",`${editOficina.codigo} — ${ofForm.nombre}`);
                      }
                      else{
                        const nextCod=String(oficinas.length+1).padStart(2,"0");
                        const no={...ofForm,id:crypto.randomUUID(),codigo:nextCod,activo:true};
                        setOficinas(p=>[...p,no]);
                        dbUpsertOficina(no);
                        logAction("Creó oficina",`${nextCod} — ${ofForm.nombre}`);
                      }
                      setShowNewOficina(false);setEditOficina(null);
                    }}>Guardar ✅</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TARIFAS ── */}
        {cfgTab==="tarifas"&&(()=>{
          const tipoEsAereo=(te)=>{const t=(te||"").toLowerCase().replace(/á/g,"a").replace(/é/g,"e");return t.includes("aereo")||t.includes("express")||t.includes("economico");};
          const tipoEsMaritimo=(te)=>{const t=(te||"").toLowerCase().replace(/í/g,"i");return t.includes("maritimo")||t.includes("fcl")||t.includes("lcl");};
          const filaNueva=te=>({tipoEnvio:te||"",unidad:"",precio:"",min:"",moneda:"USD"});
          const tafNuevo=()=>({aplicaTipo:"",aplicaId:"",orig:[],dest:[],filas:[filaNueva(SEND_TYPES.find(tipoEsAereo)),filaNueva(SEND_TYPES.find(tipoEsMaritimo))].filter(f=>f.tipoEnvio)});
          const tafDeTarifa=t=>({aplicaTipo:t.aplicaTipo||"",aplicaId:t.aplicaId||"",
            orig:(t.paisOrig||t.ciudadOrig)?[{pais:t.paisOrig||"",ciudad:t.ciudadOrig||""}]:[],
            dest:(t.paisDest||t.ciudadDest)?[{pais:t.paisDest||"",ciudad:t.ciudadDest||""}]:[],
            filas:[{tipoEnvio:t.tipoEnvio||"",unidad:t.unidad||"",precio:String((tipoEsMaritimo(t.tipoEnvio)?t.porFt3:t.porLb)??""),min:String(t.min??""),moneda:t.moneda||"USD"}]});
          const MONEDAS=["USD","EUR","VES","COP","MXN","ARS","CLP","PEN","BRL","DOP","PAB"];
          return(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:17,fontWeight:700,color:"var(--navy)",flex:1}}>💰 Tarifas por Ruta y Tipo de Envío</div>
              {hasPerm("crear_tarifa")&&<button className="btn-p" style={{fontSize:13}} onClick={()=>{
                const [gt,gi]=tafGrupo?tafGrupo.split(":"):["",""];
                setTafForm({...tafNuevo(),aplicaTipo:gt,aplicaId:gi||""});
                setEditTarifa(null);setShowNewTarifa(true);
              }}>+ Nueva Tarifa</button>}
            </div>
            {(()=>{
              const gKey=t=>t.aplicaTipo?`${t.aplicaTipo}:${t.aplicaId}`:"";
              const cuenta={};tarifas.forEach(t=>{const k=gKey(t);cuenta[k]=(cuenta[k]||0)+1;});
              const IC={agente:"🤝",autonomo:"🧑‍💻",cliente:"👤"};
              const grupos=[{k:"",l:"Predeterminadas",ic:"🌐"},
                ...agentes.map(a=>({k:`agente:${a.id}`,l:a.nombre||a.codigo,sub:`Agente ${a.codigo||""}`,ic:IC.agente})),
                ...clients.filter(c=>c.tipo==="usuario"&&c.rol==="F").map(c=>({k:`autonomo:${c.id}`,l:fullName(c),sub:`Autónomo ${c.id}`,ic:IC.autonomo})),
                ...Object.keys(cuenta).filter(k=>k.startsWith("cliente:")).map(k=>{const c=clients.find(x=>x.id===k.split(":")[1]);return {k,l:c?fullName(c):"?",sub:`Cliente ${c?.casillero||""}`,ic:IC.cliente};}),
              ];
              const GQ=sinAcentos(tafGrupoQ.trim());
              const gVis=grupos.filter(g=>!GQ||sinAcentos(`${g.l} ${g.sub||""}`).includes(GQ));
              const gSel=grupos.find(g=>g.k===tafGrupo)||grupos[0];
              const Q=sinAcentos(tafQ.trim());
              const lista=tarifas.filter(t=>gKey(t)===gSel.k)
                .filter(t=>!tafTipoFil||t.tipoEnvio===tafTipoFil)
                .filter(t=>!Q||sinAcentos(`${t.paisOrig} ${t.ciudadOrig} ${t.paisDest} ${t.ciudadDest} ${t.tipoEnvio} ${t.id}`).includes(Q))
                .sort((a,b)=>`${a.paisOrig}${a.ciudadOrig}${a.paisDest}${a.ciudadDest}${a.tipoEnvio}`.localeCompare(`${b.paisOrig}${b.ciudadOrig}${b.paisDest}${b.ciudadDest}${b.tipoEnvio}`));
              return(
            <div style={{display:"grid",gridTemplateColumns:"280px minmax(0,1fr)",gap:14,alignItems:"start"}}>
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:8,borderBottom:"1px solid var(--b1)",background:"var(--bg3)"}}>
                  <input className="fi" style={{fontSize:13,padding:"6px 8px"}} placeholder="Buscar agente, autónomo o cliente…" value={tafGrupoQ} onChange={e=>setTafGrupoQ(e.target.value)}/>
                </div>
                <div style={{maxHeight:520,overflowY:"auto"}}>
                  {gVis.map(g=>{const on=g.k===gSel.k;return(
                    <div key={g.k||"_"} onClick={()=>{setTafGrupo(g.k);setTafQ("");}} style={{padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid var(--b2)",display:"flex",alignItems:"center",gap:8,background:on?"var(--navy)":"transparent",color:on?"#fff":"var(--t1)"}}>
                      <span>{g.ic}</span>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:on?700:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.l}</div>{g.sub&&<div style={{fontSize:11,opacity:.75}}>{g.sub}</div>}</div>
                      <span style={{fontSize:12,fontWeight:700,padding:"1px 8px",borderRadius:10,background:on?"rgba(255,255,255,.2)":"var(--bg4)"}}>{cuenta[g.k]||0}</span>
                    </div>);})}
                  {gVis.length===0&&<div style={{padding:16,textAlign:"center",color:"var(--t3)",fontSize:13}}>Sin coincidencias.</div>}
                </div>
              </div>
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"10px 12px",borderBottom:"1px solid var(--b1)",background:"var(--bg3)",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>{gSel.ic} {gSel.l}</span>
                  <span style={{fontSize:13,color:"var(--t3)"}}>{lista.length} tarifa{lista.length===1?"":"s"}</span>
                  <input className="fi" style={{marginLeft:"auto",width:220,fontSize:13,padding:"6px 8px"}} placeholder="Buscar origen o destino…" value={tafQ} onChange={e=>setTafQ(e.target.value)}/>
                  <select className="fs" style={{width:160,fontSize:13}} value={tafTipoFil} onChange={e=>setTafTipoFil(e.target.value)}><option value="">Todos los envíos</option>{SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
                </div>
              <table className="ct">
                <thead><tr>
                  <th>Origen</th><th>Destino</th><th>Tipo Envío</th><th>Monto</th><th>Mínimo</th><th>Moneda</th><th>Estado</th><th>Acc.</th>
                </tr></thead>
                <tbody>
                  {lista.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>{Q||tafTipoFil?"Sin coincidencias.":"Sin tarifas."}</td></tr>}
                  {lista.map(t=>{
                    const esAereo=tipoEsAereo(t.tipoEnvio);
                    const esMaritimo=tipoEsMaritimo(t.tipoEnvio);
                    const sy=cSym(t.moneda);
                    const monto=esAereo?`${sy}${t.porLb}/${t.unidad==="kg"?"kg":"lb"}`:esMaritimo?`${sy}${t.porFt3}/${t.unidad==="m3"?"m³":"ft³"}`:`${sy}${t.porLb}/lb`;
                    return(
                    <tr key={t.id}>
                      <td style={{fontWeight:600,fontSize:13}}>{[t.paisOrig,t.ciudadOrig].filter(Boolean).join("-")||"Cualquiera"}</td>
                      <td style={{fontWeight:600,fontSize:13}}>{[t.paisDest,t.ciudadDest].filter(Boolean).join("-")||"Cualquiera"}</td>
                      <td><TypeBadge t={t.tipoEnvio}/></td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:esAereo?"var(--green)":"var(--sky)"}}>{monto}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--orange)"}}>{sy}{t.min}</td>
                      <td style={{fontSize:13}}>{t.moneda}</td>
                      <td><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,background:t.activo?"#E8F8EE":"#FEE8E8",color:t.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:t.activo?"#80D0A0":"#F0A0A0"}}>{t.activo?"✅ Activa":"❌ Inactiva"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        {hasPerm("editar_tarifa")&&<span className="ic-b" onClick={()=>{setTafForm(tafDeTarifa(t));setEditTarifa(t);setShowNewTarifa(true);}}>✏️</span>}
                        {hasPerm("editar_tarifa")&&<span className="ic-b" onClick={()=>{const upd={...t,activo:!t.activo};setTarifas(p=>p.map(x=>x.id===t.id?upd:x));dbUpsertTarifa(upd);logAction(upd.activo?"Activó tarifa":"Desactivó tarifa",`${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest}`);}}>{t.activo?"⏸":"▶️"}</span>}
                        {hasPerm("borrar_tarifa")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(!window.confirm(`¿Borrar tarifa ${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest}?`))return;setTarifas(p=>p.filter(x=>x.id!==t.id));dbDeleteTarifa(t.id);logAction("Borró tarifa",`${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest} · ${t.tipoEnvio}`);}}>🗑</span>}
                      </div></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>);
            })()}
            {showNewTarifa&&(
              <div className="ov">
                <div className="modal" style={{maxWidth:780}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">{editTarifa?"✏️ Editar Tarifa":"➕ Nuevas Tarifas"}</div><button className="mcl" onClick={()=>setShowNewTarifa(false)}>✕</button></div>
                  <div className="sdiv">APLICA A</div>
                  <div className="fgrid g2" style={{marginBottom:10}}>
                    <div className="fg"><div className="fl">Tipo</div>
                      <select className="fs" value={tafForm.aplicaTipo||""} onChange={e=>setTafForm(p=>({...p,aplicaTipo:e.target.value,aplicaId:""}))}>
                        <option value="">Todos (predeterminada)</option>
                        <option value="cliente">Un cliente</option>
                        <option value="agente">Un agente</option>
                        <option value="autonomo">Un autónomo</option>
                      </select>
                    </div>
                    {tafForm.aplicaTipo&&<div className="fg"><div className="fl">¿Cuál?</div>
                      <select className="fs" value={tafForm.aplicaId||""} onChange={e=>setTafForm(p=>({...p,aplicaId:e.target.value}))}>
                        <option value="">— Selecciona —</option>
                        {(tafForm.aplicaTipo==="agente"?agentes.map(a=>({id:a.id,l:`${a.codigo||""} — ${a.nombre||""}`}))
                          :tafForm.aplicaTipo==="autonomo"?clients.filter(c=>c.tipo==="usuario"&&c.rol==="F").map(c=>({id:c.id,l:`${c.id} — ${fullName(c)}`}))
                          :clients.filter(c=>c.tipo==="cliente").map(c=>({id:c.id,l:`${c.casillero||c.id} — ${fullName(c)}`}))
                        ).map(o=><option key={o.id} value={o.id}>{o.l}</option>)}
                      </select>
                    </div>}
                  </div>
                  {(()=>{
                    const F=tafForm, set=x=>setTafForm(p=>({...p,...x}));
                    const lugares=k=>F[k]||[];
                    const selector=(k,titulo)=><SelectorLugares titulo={titulo} countries={COUNTRIES} value={lugares(k)} onChange={v=>set({[k]:v})}/>;
                    const setFila=(i,x)=>set({filas:F.filas.map((f,j)=>j===i?{...f,...x}:f)});
                    const combos=(lugares("orig").length?lugares("orig"):[{pais:"",ciudad:""}]).flatMap(o=>(lugares("dest").length?lugares("dest"):[{pais:"",ciudad:""}]).flatMap(d=>(F.filas||[]).map(f=>({o,d,f}))));
                    const guardar=()=>{
                      if(F.aplicaTipo&&!F.aplicaId){window.alert("Elige a quién aplica la tarifa especial.");return;}
                      if(!F.aplicaTipo&&(!lugares("orig").length||!lugares("dest").length)){window.alert("Elige al menos un origen y un destino.");return;}
                      const filas=(F.filas||[]).filter(f=>f.tipoEnvio);
                      if(!filas.length){window.alert("Agrega al menos una tarifa con su tipo de envío.");return;}
                      if(filas.some(f=>!(parseFloat(f.precio)>0))){window.alert("Cada tarifa necesita su precio.");return;}
                      if(new Set(filas.map(f=>f.tipoEnvio)).size<filas.length){window.alert("Hay dos filas con el mismo tipo de envío.");return;}
                      let lista=[...tarifas];let maxN=Math.max(0,...lista.map(t=>parseInt(String(t.id).replace(/\D/g,""))||0));
                      const cambios=[];
                      const items=combos.filter(c=>c.f.tipoEnvio);
                      items.forEach((c,idx)=>{
                        const mar=tipoEsMaritimo(c.f.tipoEnvio),aer=tipoEsAereo(c.f.tipoEnvio);
                        const datos={aplicaTipo:F.aplicaTipo||"",aplicaId:F.aplicaId||"",paisOrig:c.o.pais,ciudadOrig:c.o.ciudad,paisDest:c.d.pais,ciudadDest:c.d.ciudad,
                          tipoEnvio:c.f.tipoEnvio,unidad:aer?(c.f.unidad==="kg"?"kg":"lb"):mar?(c.f.unidad==="m3"?"m3":"ft3"):"lb",
                          porLb:mar?0:parseFloat(c.f.precio)||0,porFt3:mar?parseFloat(c.f.precio)||0:0,min:parseFloat(c.f.min)||0,moneda:c.f.moneda||"USD",activo:true};
                        const key=t=>[t.aplicaTipo||"",t.aplicaId||"",sinAcentos(t.paisOrig||""),sinAcentos(t.ciudadOrig||""),sinAcentos(t.paisDest||""),sinAcentos(t.ciudadDest||""),sinAcentos(t.tipoEnvio||"")].join("|");
                        let ex=lista.find(t=>key(t)===key(datos));
                        if(!ex&&editTarifa&&items.length===1)ex=lista.find(t=>t.id===editTarifa.id);
                        const rec=ex?{...ex,...datos,activo:ex.activo!==false}:{...datos,id:`T-${String(++maxN).padStart(3,"0")}`};
                        lista=ex?lista.map(t=>t.id===ex.id?rec:t):[...lista,rec];
                        cambios.push(rec);
                      });
                      setTarifas(lista);
                      cambios.forEach(t=>dbUpsertTarifa(t));
                      logAction(editTarifa?"Actualizó tarifas":"Creó tarifas",`${cambios.length} tarifa(s)${F.aplicaTipo?` · ${nombreAplica(F)}`:""}`);
                      setShowNewTarifa(false);setEditTarifa(null);
                    };
                    return(<>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
                        {selector("orig","ORIGEN")}
                        {selector("dest","DESTINO")}
                      </div>
                      <div className="sdiv">TARIFAS</div>
                      <table className="ct" style={{marginBottom:8}}>
                        <thead><tr><th>Tipo de envío</th><th>Se cobra por</th><th>Precio</th><th>Mínimo</th><th>Moneda</th><th></th></tr></thead>
                        <tbody>{(F.filas||[]).map((f,i)=>{const mar=tipoEsMaritimo(f.tipoEnvio),aer=tipoEsAereo(f.tipoEnvio);return(
                          <tr key={i}>
                            <td><select className="fs" value={f.tipoEnvio} onChange={e=>setFila(i,{tipoEnvio:e.target.value,unidad:""})}><option value="">—</option>{SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></td>
                            <td><select className="fs" value={aer?(f.unidad==="kg"?"kg":"lb"):mar?(f.unidad==="m3"?"m3":"ft3"):"lb"} onChange={e=>setFila(i,{unidad:e.target.value})} disabled={!aer&&!mar}>
                              {mar?<><option value="ft3">ft³</option><option value="m3">m³</option></>:<><option value="lb">lb</option>{aer&&<option value="kg">kg</option>}</>}</select></td>
                            <td><input className="fi" type="number" step="0.01" min="0" style={{width:90}} value={f.precio} onChange={e=>setFila(i,{precio:e.target.value})}/></td>
                            <td><input className="fi" type="number" step="0.01" min="0" style={{width:90}} value={f.min} onChange={e=>setFila(i,{min:e.target.value})}/></td>
                            <td><select className="fs" value={f.moneda} onChange={e=>setFila(i,{moneda:e.target.value})}>{MONEDAS.map(m=><option key={m}>{m}</option>)}</select></td>
                            <td>{(F.filas||[]).length>1&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>set({filas:F.filas.filter((_,j)=>j!==i)})}>🗑</span>}</td>
                          </tr>);})}</tbody>
                      </table>
                      <button className="btn-s" style={{fontSize:13,marginBottom:10}} onClick={()=>set({filas:[...(F.filas||[]),filaNueva(SEND_TYPES.find(t=>!(F.filas||[]).some(f=>f.tipoEnvio===t)))]})}>+ Agregar tarifa</button>
                      <div className="mft">
                        <span style={{marginRight:"auto",fontSize:13,fontWeight:700,color:"var(--navy)"}}>{combos.filter(c=>c.f.tipoEnvio).length} tarifa(s)</span>
                        <button className="btn-s" onClick={()=>setShowNewTarifa(false)}>Cancelar</button>
                        <button className="btn-p" onClick={guardar}>Guardar ✅</button>
                      </div>
                    </>);
                  })()}
                </div>
              </div>
            )}
          </div>
          );
        })()}

        {cfgTab==="actividad"&&(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)"}}>📋 Registro de Actividad</span>
              <span style={{fontSize:12,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4,padding:"2px 8px",color:"var(--t3)"}}>{actLog.length} eventos</span>
              <div style={{flex:1}}/>
              <input className="fi" style={{width:200,fontSize:13}} value={actFilter} onChange={e=>setActFilter(e.target.value)} placeholder="Filtrar por usuario o acción…"/>
              <button className="btn-s" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Exportar</button>
            </div>
            <div style={{maxHeight:"60vh",overflowY:"auto"}}>
              <table className="ct">
                <thead><tr>
                  <th>Fecha / Hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Detalle</th>
                </tr></thead>
                <tbody>
                  {actLog.filter(a=>!actFilter||a.user.toLowerCase().includes(actFilter.toLowerCase())||a.action.toLowerCase().includes(actFilter.toLowerCase())||a.detail.toLowerCase().includes(actFilter.toLowerCase())).map((a,i)=>(
                    <tr key={i}>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,whiteSpace:"nowrap"}}>{fmtDate(a.ts)} {fmtTime(a.ts)}</td>
                      <td style={{fontWeight:600,color:"var(--navy)"}}>{a.user}</td>
                      <td><RoleChip code={a.role}/></td>
                      <td style={{fontWeight:500}}>{a.action}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)"}}>{a.detail||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── TRACKING INTERNACIONAL ───────────────────────────────────────────────
  // Por decisión de producto, este módulo es PURAMENTE INFORMATIVO (orientado a clientes).
  // Nada en esta vista debe modificar el estado de un WR. Los estados se gestionan desde
  // los módulos correspondientes (Consolidación, Recepción en Almacén, Cargo Release, etc.).
  const trkCanUpdate=false; // siempre false → desactiva edición masiva e individual aquí
  const trkCanOrigin=false;
  const trkCanDest=false;

  const statusAllowed=(st)=>{
    const cod=parseFloat(st.code);
    if(["A","B","C","D"].includes(currentUser.rol)) return true;
    if(currentUser.rol==="D1") return cod<=4||st.phase==="excep";       // origen + excepciones
    if(currentUser.rol==="D2") return cod>=17||st.phase==="entrega"||st.phase==="excep"; // destino + entrega + excepciones
    return false;
  };

  const applyStatus=(wr,newSt,nota="")=>{
    setWrList(p=>p.map(w=>{
      if(w.id===wr.id){
        const updated={...w,status:newSt,historial:[...(w.historial||[]),{status:newSt,fecha:new Date(),user:currentUser.id||"rdiaz",nota}]};
        dbUpsertWR(updated);
        return updated;
      }
      return w;
    }));
    logAction("Actualizó estado",`${wr.id} → ${newSt.code} ${newSt.label}`);
    if(trkSelected?.id===wr.id) setTrkSelected(p=>({...p,status:newSt,historial:[...(p.historial||[]),{status:newSt,fecha:new Date(),user:currentUser.id||"rdiaz",nota}]}));
  };

  const applyMassivo=()=>{
    const ids=trkMassIds.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    let ok=0,fail=[];
    ids.forEach(id=>{
      const w=wrList.find(x=>x.id===id||x.tracking===id);
      if(w&&trkMassStatus){applyStatus(w,trkMassStatus,trkMassNota);ok++;}
      else fail.push(id);
    });
    setTrkMassResult({ok,fail});
    logAction("Actualización masiva",`${ok} WR → ${trkMassStatus?.code} ${trkMassStatus?.label}`);
  };

  // Línea de tiempo de un WR

  const renderTracking=()=>{
    const trkResults=trkSearch.length>1?wrList.filter(w=>
      w.id.toLowerCase().includes(trkSearch.toLowerCase())||
      trkAll(w).toLowerCase().includes(trkSearch.toLowerCase())||
      (w.consignee||"").toLowerCase().includes(trkSearch.toLowerCase())||
      (w.casillero||"").toLowerCase().includes(trkSearch.toLowerCase())
    ).slice(0,30):[];

    return (
      <div className="page-scroll">
        {/* HEADER — vista informativa, sin acciones de modificación */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)"}}>🔍 Tracking Internacional</div>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:"var(--t3)",background:"#EEF2F7",padding:"4px 10px",borderRadius:10,border:"1px solid #DCE2EC"}}>👁️ Solo lectura</span>
        </div>

        {/* (Bloque de Actualización Masiva eliminado — Tracking es solo lectura) */}

        <div style={{display:"grid",gridTemplateColumns:trkSelected?"1fr 380px":"1fr",gap:14}}>
          {/* PANEL IZQUIERDO — búsqueda y lista */}
          <div>
            {/* Búsqueda */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
              <input className="fi" style={{fontSize:16}} value={trkSearch} onChange={e=>setTrkSearch(e.target.value)}
                placeholder="Buscar por N° WR, tracking, consignatario o casillero…" autoFocus/>
            </div>

            {/* Resultados */}
            {trkSearch.length>1&&(
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"8px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontSize:14,color:"var(--t3)"}}>
                  {trkResults.length} resultado{trkResults.length!==1?"s":""}
                </div>
                {trkResults.length===0?(
                  <div style={{padding:40,textAlign:"center",color:"var(--t3)",fontSize:15}}>No se encontraron WR con ese criterio.</div>
                ):trkResults.map(w=>(
                  <div key={w.id} onClick={()=>setTrkSelected(w)}
                    style={{padding:"12px 14px",borderBottom:"1px solid var(--b2)",cursor:"pointer",
                      background:trkSelected?.id===w.id?"#EEF3FF":"",display:"flex",alignItems:"center",gap:12,transition:"background .1s"}}
                    onMouseEnter={e=>{if(trkSelected?.id!==w.id)e.currentTarget.style.background="#F8F9FB"}}
                    onMouseLeave={e=>{if(trkSelected?.id!==w.id)e.currentTarget.style.background=""}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:15,color:"var(--navy)",background:"#EEF3FF",padding:"2px 7px",borderRadius:4,border:"1px solid #B8C8F0"}}>{w.id}</span>
                        <StBadge st={w.status}/>
                      </div>
                      <div style={{fontSize:15,fontWeight:600,color:"var(--t1)"}}>{w.consignee}</div>
                      <div style={{display:"flex",gap:10,marginTop:3,fontSize:13,color:"var(--t3)"}}>
                        <span>{w.casillero}</span>
                        <span>·</span>
                        <span>{w.origCity} → {w.destCity}</span>
                        <span>·</span>
                        <span className="c-trk">{w.tracking||"—"}</span>
                        <span>·</span>
                        <span>{fmtDate(w.fecha)}</span>
                      </div>
                    </div>
                    <div style={{fontSize:14,color:"var(--cyan)",fontWeight:600,flexShrink:0}}>Ver detalle →</div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado general si no hay búsqueda */}
            {trkSearch.length<=1&&!trkSelected&&(
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)"}}>
                  📊 Resumen por Estado
                </div>
                <div style={{padding:"12px 14px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {WR_STATUSES.map(st=>{
                    const cnt=wrList.filter(w=>w.status?.code===st.code).length;
                    if(cnt===0)return null;
                    return (
                      <div key={st.code} onClick={()=>setTrkSearch(st.label)} style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 12px",cursor:"pointer",transition:"all .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#EEF3FF"}
                        onMouseLeave={e=>e.currentTarget.style.background="var(--bg4)"}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:14,color:"var(--navy)"}}>{st.code}</span>
                          <span style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:800,color:"var(--navy)"}}>{cnt}</span>
                        </div>
                        <div style={{fontSize:13,color:"var(--t2)",fontWeight:600}}>{st.label}</div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            )}
          </div>

          {/* PANEL DERECHO — timeline del WR seleccionado */}
          {trkSelected&&(
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden",position:"sticky",top:0,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
              {/* Header */}
              <div style={{padding:"12px 14px",background:"var(--navy)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:16,color:"#E5AE3A",letterSpacing:.5}}>{trkSelected.id}</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,.7)",marginTop:2}}>{trkSelected.consignee} · {trkSelected.casillero}</div>
                </div>
                <button onClick={()=>setTrkSelected(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:14}}>✕</button>
              </div>
              {/* Info rápida */}
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",flexShrink:0,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[["Ruta",`${trkSelected.origCity} → ${trkSelected.destCity}`],["Tipo Envío",trkSelected.tipoEnvio||"—"],["Carrier",trkSelected.carrier||"—"],["Tracking",trkSelected.tracking||"—"],["Recibido",fmtDate(trkSelected.fecha)],["Cajas",String(trkSelected.cajas)]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{fontSize:11,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--t1)",fontFamily:l==="Tracking"?"'DM Mono',monospace":"inherit"}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Estado actual destacado */}
              <div style={{padding:"10px 14px",borderBottom:"1px solid var(--b1)",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,color:"var(--t3)"}}>Estado actual:</span>
                <StBadge st={trkSelected.status}/>
              </div>
              {/* Timeline scrollable */}
              <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
                <TimelineWR w={trkSelected} applyStatus={applyStatus} trkCanUpdate={trkCanUpdate} statusAllowed={statusAllowed} CU={CU}/>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── CHAT INTERNO ─────────────────────────────────────────────────────────────

  const CHAT_ROOMS=[
    {id:"general",ic:"💬",l:"General",desc:"Todo el equipo"},
    {id:"operaciones",ic:"⚙️",l:"Operaciones",desc:"D, D1, D2"},
    {id:"ventas",ic:"💼",l:"Ventas",desc:"E, E1, G, G1"},
  ];

  const sendChat=()=>{
    if(!chatMsg.trim())return;
    const msg={id:Date.now(),user:currentUser.id||"rdiaz",role:currentUser.rol,name:`${currentUser.primerNombre} ${currentUser.primerApellido}`,text:chatMsg.trim(),ts:new Date()};
    setChatMsgs(p=>({...p,[chatConv]:[...(p[chatConv]||[]),msg]}));
    setChatMsg("");
    logAction("Envió mensaje",`Canal: ${chatConv}`);
  };

  const renderChat=()=>(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",flex:1,minHeight:0,overflow:"hidden"}}>
        {/* SIDEBAR CANALES */}
        <div style={{background:"var(--navy)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 12px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"#E5AE3A",letterSpacing:1}}>💬 CHAT INTERNO</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:2}}>ENEX · {empresaNombre}</div>
          </div>
          <div style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
            <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.3)",padding:"8px 8px 4px",fontWeight:700}}>Canales</div>
            {CHAT_ROOMS.map(r=>(
              <div key={r.id} onClick={()=>setChatConv(r.id)}
                style={{padding:"9px 10px",borderRadius:7,cursor:"pointer",marginBottom:2,
                  background:chatConv===r.id?"rgba(200,151,28,.2)":"transparent",
                  border:`1px solid ${chatConv===r.id?"rgba(200,151,28,.4)":"transparent"}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{r.ic}</span>
                  <div>
                    <div style={{color:chatConv===r.id?"#E5AE3A":"rgba(255,255,255,.8)",fontSize:15,fontWeight:600}}>{r.l}</div>
                    <div style={{color:"rgba(255,255,255,.35)",fontSize:12}}>{r.desc}</div>
                  </div>
                  {(chatMsgs[r.id]||[]).length>0&&(
                    <span style={{marginLeft:"auto",background:chatConv===r.id?"#E5AE3A":"rgba(255,255,255,.2)",color:chatConv===r.id?"#1A2B4A":"rgba(255,255,255,.7)",fontSize:11,fontWeight:800,padding:"1px 6px",borderRadius:4}}>
                      {(chatMsgs[r.id]||[]).length}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.3)",padding:"12px 8px 4px",fontWeight:700}}>En línea</div>
            {clients.filter(c=>["A","B","C","D","D1","D2"].includes(c.rol)).map(c=>(
              <div key={c.id} style={{padding:"6px 10px",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#1A8A4A",flexShrink:0}}/>
                <div style={{width:24,height:24,borderRadius:6,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(c)}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.primerNombre} {c.primerApellido}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:"#E5AE3A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#1A2B4A",flexShrink:0}}>{initials(CU)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.primerNombre} {currentUser.primerApellido}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{ROLE_DEFS[currentUser.rol]?.name}</div>
            </div>
          </div>
        </div>

        {/* MENSAJES */}
        <div style={{display:"flex",flexDirection:"column",background:"var(--bg3)",overflow:"hidden"}}>
          {/* Header canal */}
          <div style={{padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:20}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.ic}</span>
            <div>
              <div style={{fontWeight:700,fontSize:16,color:"var(--navy)"}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.l}</div>
              <div style={{fontSize:13,color:"var(--t3)"}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.desc}</div>
            </div>
          </div>
          {/* Mensajes */}
          <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
            {(chatMsgs[chatConv]||[]).length===0?(
              <div style={{textAlign:"center",color:"var(--t3)",padding:"40px 0",fontSize:15}}>No hay mensajes en este canal aún.</div>
            ):(chatMsgs[chatConv]||[]).map(m=>{
              const isMe=m.user===(currentUser.id||"rdiaz");
              return (
                <div key={m.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",gap:10,alignItems:"flex-end"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:isMe?"var(--navy)":"var(--bg5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:isMe?"#fff":"var(--t2)",flexShrink:0}}>
                    {(m.name||"?").split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                  </div>
                  <div style={{maxWidth:"65%"}}>
                    <div style={{fontSize:12,color:"var(--t3)",marginBottom:3,textAlign:isMe?"right":"left"}}>
                      {m.name} · <span className={`rb ${ROLE_DEFS[m.role]?.color||"rH1"}`} style={{fontSize:10}}>{m.role}</span> · {fmtTime(m.ts)}
                    </div>
                    <div style={{background:isMe?"var(--navy)":"var(--bg2)",color:isMe?"#fff":"var(--t1)",padding:"10px 14px",borderRadius:isMe?"12px 12px 2px 12px":"12px 12px 12px 2px",fontSize:15,lineHeight:1.5,border:isMe?"none":"1px solid var(--b1)",boxShadow:"var(--shadow)"}}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Input */}
          <div style={{padding:"12px 16px",background:"var(--bg2)",borderTop:"1px solid var(--b1)",display:"flex",gap:8,flexShrink:0}}>
            <input className="fi" style={{flex:1,fontSize:15}} value={chatMsg}
              onChange={e=>setChatMsg(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
              placeholder={`Mensaje en #${chatConv}…`}/>
            <button className="btn-p" onClick={sendChat} style={{padding:"8px 16px"}}>Enviar ↵</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── TARIFAS BASE (usadas en Calculadora, Pick-up y Contabilidad) ─────────────
  const TARIFAS_BASE={"Aéreo Express":{porLb:1.8,porFt3:28,min:25},"Aéreo Económico":{porLb:1.4,porFt3:22,min:20},"Marítimo FCL":{porLb:0.6,porFt3:10,min:50},"Marítimo LCL":{porLb:0.8,porFt3:14,min:40},"Terrestre":{porLb:0.5,porFt3:8,min:30}};

  // ── PICK-UP ───────────────────────────────────────────────────────────────────
  const spuf=(k,v)=>setPuf(p=>({...p,[k]:v}));

  const calcPickupCotizacion=(paquetes)=>{
    let totalLb=0,totalFt3=0;
    paquetes.forEach(p=>{
      const l=parseFloat(p.largo)||0,a=parseFloat(p.ancho)||0,h=parseFloat(p.alto)||0;
      const lb=parseFloat(p.pesoLb)||0;
      const qty=parseInt(p.cantidad)||1;
      const ft3=l&&a&&h?parseFloat(((l*a*h)/1728).toFixed(3)):0;
      totalLb+=lb*qty;
      totalFt3+=ft3*qty;
    });
    const base=15; // tarifa mínima
    const porPeso=Math.max(base,totalLb*0.8);
    const porVol=Math.max(base,totalFt3*12);
    return {totalLb:parseFloat(totalLb.toFixed(1)),totalFt3:parseFloat(totalFt3.toFixed(3)),estimado:parseFloat(Math.max(porPeso,porVol).toFixed(2))};
  };

  const submitPickup=()=>{
    const cot=calcPickupCotizacion(puf.paquetes);
    const n={...puf,id:`PU-${String(pickupList.length+1).padStart(4,"0")}`,fecha_creado:new Date(),cotizacion:cot,status:"Pendiente"};
    setPickupList(p=>[n,...p]);
    setShowNewPickup(false);setPuf(emptyPickup());setPickupClientSearch("");setPickupClientResults([]);
    logAction("Creó Pick-up",n.id);
  };

  const renderPickup=()=>(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)"}}>🚐 Solicitudes de Pick-up</div>
        </div>
        <button className="btn-p" onClick={()=>setShowNewPickup(true)}>+ Nueva Solicitud</button>
      </div>

      {/* LISTA */}
      {pickupList.length===0?(
        <div className="card" style={{textAlign:"center",padding:60,color:"var(--t3)"}}>
          No hay solicitudes de pick-up aún.<br/>
          <button className="btn-p" style={{marginTop:14}} onClick={()=>setShowNewPickup(true)}>+ Crear primera solicitud</button>
        </div>
      ):(
        <div className="card" style={{padding:0}}>
          <table className="ct">
            <thead><tr><th>ID</th><th>Cliente</th><th>Dirección</th><th>Fecha</th><th>Hora</th><th>Chofer</th><th>Paquetes</th><th>Peso lb</th><th>Ft³</th><th>Cotización</th><th>Estado</th></tr></thead>
            <tbody>
              {pickupList.map(p=>(
                <tr key={p.id}>
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:14}}>{p.id}</span></td>
                  <td style={{fontWeight:600}}>{p.clienteNombre||"—"}</td>
                  <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",color:"var(--t2)",fontSize:14}}>{p.clienteDir||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{p.fecha||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{p.hora||"—"}</td>
                  <td style={{fontWeight:600,color:"var(--t1)"}}>{p.chofer||"—"}</td>
                  <td style={{textAlign:"center",fontWeight:700}}>{p.paquetes.reduce((s,x)=>s+(parseInt(x.cantidad)||1),0)}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{p.cotizacion?.totalLb||0}lb</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{p.cotizacion?.totalFt3||0}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${p.cotizacion?.estimado||0}</td>
                  <td><span className={`st ${p.status==="Pendiente"?"s1":p.status==="Completado"?"s3":"s2"}`}><span className="st-dot"/>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NUEVA SOLICITUD */}
      {showNewPickup&&(
        <div className="ov">
          <div className="modal mxl" onClick={e=>e.stopPropagation()}>
            <div className="mhd"><div className="mt">🚐 Nueva Solicitud de Pick-up</div><button className="mcl" onClick={()=>setShowNewPickup(false)}>✕</button></div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              {/* Cliente */}
              <div>
                <div className="sdiv">DATOS DEL CLIENTE</div>
                <div style={{position:"relative",marginBottom:10}}>
                  <div className="fl" style={{marginBottom:4}}>Buscar cliente</div>
                  <input className="fi" value={pickupClientSearch} onChange={e=>{
                    setPickupClientSearch(e.target.value);
                    if(e.target.value.length>1){
                      setPickupClientResults(clients.filter(c=>c.tipo==="cliente"&&(fullName(c).toLowerCase().includes(e.target.value.toLowerCase())||(c.casillero||"").toLowerCase().includes(e.target.value.toLowerCase()))));
                    }else setPickupClientResults([]);
                  }} placeholder="Nombre o casillero…"/>
                  {pickupClientResults.length>0&&(
                    <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:8,boxShadow:"var(--shadow2)",zIndex:50,maxHeight:180,overflowY:"auto"}}>
                      {pickupClientResults.map(c=>(
                        <div key={c.id} onClick={()=>{spuf("clienteId",c.id);spuf("clienteNombre",fullName(c));spuf("clienteDir",c.dir||"");spuf("clienteTel",c.tel1||"");setPickupClientSearch(fullName(c));setPickupClientResults([]);}} style={{padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid var(--b2)",fontSize:15}} onMouseEnter={e=>e.currentTarget.style.background="#EEF3FF"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                          {fullName(c)} <span style={{color:"var(--gold2)",fontFamily:"'DM Mono',monospace",fontSize:13}}>{c.casillero}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="fgrid g2" style={{gap:8}}>
                  <div className="fg full"><div className="fl">Dirección de Recogida</div><input className="fi" value={puf.clienteDir} onChange={e=>spuf("clienteDir",e.target.value)} placeholder="Dirección completa…"/></div>
                  <div className="fg"><div className="fl">Teléfono</div><input className="fi" value={puf.clienteTel} onChange={e=>spuf("clienteTel",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Notas</div><input className="fi" value={puf.notas} onChange={e=>spuf("notas",e.target.value)} placeholder="Instrucciones especiales…"/></div>
                </div>
              </div>
              {/* Logística */}
              <div>
                <div className="sdiv">FECHA, HORA Y CHOFER</div>
                <div className="fgrid g2" style={{gap:8}}>
                  <div className="fg"><div className="fl">Fecha de Recogida</div><input className="fi" type="date" value={puf.fecha} onChange={e=>spuf("fecha",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Hora Preferida</div><input className="fi" type="time" value={puf.hora} onChange={e=>spuf("hora",e.target.value)}/></div>
                  <div className="fg full"><div className="fl">Chofer Asignado</div>
                    <select className="fs" value={puf.chofer} onChange={e=>spuf("chofer",e.target.value)}>
                      <option value="">— Sin asignar —</option>
                      {clients.filter(c=>["D","D1"].includes(c.rol)).map(c=><option key={c.id} value={fullName(c)}>{fullName(c)}</option>)}
                      <option value="Chofer Externo">Chofer Externo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Paquetes */}
            <div className="sdiv">PAQUETES A RECOGER</div>
            {puf.paquetes.map((pkg,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 80px 80px 100px auto",gap:8,marginBottom:8,alignItems:"flex-end"}}>
                <div className="fg"><div className="fl">Cant.</div><input className="fi" type="number" min="1" value={pkg.cantidad} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,cantidad:e.target.value}:x)}))}/></div>
                <div className="fg"><div className="fl">Descripción</div><input className="fi" value={pkg.descripcion} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,descripcion:e.target.value}:x)}))} placeholder="Electrónica, ropa…"/></div>
                <div className="fg"><div className="fl">L (in)</div><input className="fi" type="number" value={pkg.largo} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,largo:e.target.value}:x)}))} /></div>
                <div className="fg"><div className="fl">A (in)</div><input className="fi" type="number" value={pkg.ancho} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,ancho:e.target.value}:x)}))} /></div>
                <div className="fg"><div className="fl">H (in)</div><input className="fi" type="number" value={pkg.alto} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,alto:e.target.value}:x)}))} /></div>
                <div className="fg"><div className="fl">Peso (lb)</div><input className="fi" type="number" value={pkg.pesoLb} onChange={e=>setPuf(p=>({...p,paquetes:p.paquetes.map((x,j)=>j===i?{...x,pesoLb:e.target.value}:x)}))} /></div>
                {puf.paquetes.length>1&&<button className="btn-d" style={{padding:"7px 10px"}} onClick={()=>setPuf(p=>({...p,paquetes:p.paquetes.filter((_,j)=>j!==i)}))}>🗑</button>}
              </div>
            ))}
            <button onClick={()=>setPuf(p=>({...p,paquetes:[...p.paquetes,{descripcion:"",largo:"",ancho:"",alto:"",pesoLb:"",cantidad:1}]}))} style={{width:"100%",padding:"8px",border:"2px dashed var(--b1)",borderRadius:8,background:"var(--bg4)",cursor:"pointer",fontSize:15,color:"var(--t2)",marginBottom:14}}>+ Agregar paquete</button>

            {/* Cotización previa */}
            {(()=>{const cot=calcPickupCotizacion(puf.paquetes);return(
              <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:8}}>💵 Cotización Estimada</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[["Peso Total",`${cot.totalLb} lb`,"var(--t1)"],["Ft³ Total",String(cot.totalFt3),"var(--sky)"],["Estimado",`$${cot.estimado}`,"var(--green)"]].map(([l,v,c])=>(
                    <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"8px 12px",border:"1px solid var(--b1)"}}>
                      <div style={{fontSize:12,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:800,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:13,color:"var(--t3)",marginTop:8}}>* Estimado basado en tarifa estándar. Puede variar según servicios adicionales.</div>
              </div>
            );})()}

            <div className="mft">
              <button className="btn-s" onClick={()=>setShowNewPickup(false)}>Cancelar</button>
              <button className="btn-p" onClick={submitPickup}>✅ Confirmar Solicitud</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── CALCULADORA ───────────────────────────────────────────────────────────────
  // Al cambiar país, resetear ciudad (evita selección inválida/obsoleta)
  const sc3=(k,v)=>setCalcForm(p=>{
    const next={...p,[k]:v};
    if(k==="origPais") next.origCiudad="";
    if(k==="destPais") next.destCiudad="";
    return next;
  });

  // Lookup de tarifa en la tabla real de Tarifas (config) — match exacto 5 campos;
  // fallback a paisOrig+paisDest+tipoEnvio si no hay match con ciudad; null si no hay nada.
  const findTarifa=(oPais,oCiu,dPais,dCiu,tipo)=>{
    if(!oPais||!dPais||!tipo)return null;
    const activas=(tarifas||[]).filter(t=>t.activo!==false);
    // 1) exact match (5 campos)
    let m=activas.find(t=>t.paisOrig===oPais&&t.ciudadOrig===oCiu&&t.paisDest===dPais&&t.ciudadDest===dCiu&&t.tipoEnvio===tipo);
    if(m)return {...m,matchLevel:"ciudad"};
    // 2) match por país origen + país destino + tipo
    m=activas.find(t=>t.paisOrig===oPais&&t.paisDest===dPais&&t.tipoEnvio===tipo);
    if(m)return {...m,matchLevel:"pais"};
    return null;
  };

  const calcTarifa=findTarifa(calcForm.origPais,calcForm.origCiudad,calcForm.destPais,calcForm.destCiudad,calcForm.tipoEnvio);
  // Moneda: la de la tarifa encontrada; si no hay, la del país origen
  const calcCurr=calcTarifa?.moneda||PAIS_CURR[calcForm.origPais]||"USD";
  const calcCurrSym=cSym(calcCurr);

  const calcResult=(()=>{
    const l=parseFloat(calcForm.largo)||0,a=parseFloat(calcForm.ancho)||0,h=parseFloat(calcForm.alto)||0;
    const pesoInput=parseFloat(calcForm.pesoLb)||0;
    if(!l&&!a&&!h&&!pesoInput)return null;
    // Si unitDim=cm el usuario ingresa kg → convertir a lb para cálculo
    const lb=calcForm.unitDim==="cm"?parseFloat((pesoInput*2.205).toFixed(2)):pesoInput;
    const lCm=calcForm.unitDim==="in"?l*2.54:l,aCm=calcForm.unitDim==="in"?a*2.54:a,hCm=calcForm.unitDim==="in"?h*2.54:h;
    const vc=calcVol(lCm,aCm,hCm,"cm");
    // Si no hay tarifa configurada para la ruta+tipo, devolver solo medidas sin total
    if(!calcTarifa){
      const kg=parseFloat((lb/2.205).toFixed(2));
      return {lb,kg,volLb:vc.volLb,ft3:vc.ft3,m3:vc.m3,total:null,billingLb:Math.max(lb,vc.volLb),tarifaMissing:true};
    }
    const porLb=parseFloat(calcTarifa.porLb)||0;
    const porFt3=parseFloat(calcTarifa.porFt3)||0;
    const min=parseFloat(calcTarifa.min)||0;
    // Peso facturable aéreo = max(real, volumétrico) · Marítimo = solo ft³
    const billingLb=Math.max(lb,vc.volLb);
    const esAereo=tipoEsAereoG(calcForm.tipoEnvio);
    const esMaritimo=tipoEsMaritimoG(calcForm.tipoEnvio);
    const rawByLb=billingLb*porLb;
    const rawByFt3=vc.ft3*porFt3;
    const byLb=Math.max(min,rawByLb);
    const byFt3=Math.max(min,rawByFt3);
    const rawSel=esAereo?rawByLb:(esMaritimo?rawByFt3:Math.max(rawByLb,rawByFt3));
    const totalFinal=Math.max(min,rawSel);
    const total=parseFloat(totalFinal.toFixed(2));
    const kg=parseFloat((lb/2.205).toFixed(2));
    return {
      lb,kg,volLb:vc.volLb,ft3:vc.ft3,m3:vc.m3,total,
      byLb:parseFloat(byLb.toFixed(2)),byFt3:parseFloat(byFt3.toFixed(2)),
      billingLb,
      raw:parseFloat(rawSel.toFixed(2)),
      usoMinimo:totalFinal>rawSel-0.001&&totalFinal<=min+0.001,
      tarifa:calcTarifa,
      tarifaMissing:false,
    };
  })();

  const renderCalculadora=()=>(
    <div className="page-scroll">
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:700,color:"var(--navy)",marginBottom:4}}>🧮 Calculadora de Envío</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {/* Ruta */}
          <div className="card">
            <div className="sdiv">RUTA DE ENVÍO</div>
            <div className="fgrid g2" style={{gap:10}}>
              <div className="fg">
                <div className="fl">País Origen</div>
                <select className="fs" value={calcForm.origPais} onChange={e=>sc3("origPais",e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  {COUNTRIES.map(c=><option key={c.dial} value={c.dial}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Ciudad Origen</div>
                <select className="fs" value={calcForm.origCiudad} onChange={e=>sc3("origCiudad",e.target.value)} disabled={!calcForm.origPais}>
                  <option value="">— Seleccionar —</option>
                  {(COUNTRIES.find(c=>c.dial===calcForm.origPais)?.cities||[]).map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">País Destino</div>
                <select className="fs" value={calcForm.destPais} onChange={e=>sc3("destPais",e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  {COUNTRIES.map(c=><option key={c.dial} value={c.dial}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Ciudad Destino</div>
                <select className="fs" value={calcForm.destCiudad} onChange={e=>sc3("destCiudad",e.target.value)} disabled={!calcForm.destPais}>
                  <option value="">— Seleccionar —</option>
                  {(COUNTRIES.find(c=>c.dial===calcForm.destPais)?.cities||[]).map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg full">
                <div className="fl">Tipo de Envío</div>
                <select className="fs" value={calcForm.tipoEnvio} onChange={e=>sc3("tipoEnvio",e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  {SEND_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Medidas */}
          <div className="card">
            <div className="sdiv">MEDIDAS Y PESO</div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              {["in","cm"].map(u=><button key={u} className={`btn-${calcForm.unitDim===u?"p":"s"}`} style={{flex:1}} onClick={()=>sc3("unitDim",u)}>{u==="in"?"Pulgadas":"Centímetros"}</button>)}
            </div>
            <div className="fgrid g2" style={{gap:10}}>
              <div className="fg"><div className="fl">Largo ({calcForm.unitDim})</div><input className="fi" type="number" value={calcForm.largo} onChange={e=>sc3("largo",e.target.value)}/></div>
              <div className="fg"><div className="fl">Ancho ({calcForm.unitDim})</div><input className="fi" type="number" value={calcForm.ancho} onChange={e=>sc3("ancho",e.target.value)}/></div>
              <div className="fg"><div className="fl">Alto ({calcForm.unitDim})</div><input className="fi" type="number" value={calcForm.alto} onChange={e=>sc3("alto",e.target.value)}/></div>
              <div className="fg"><div className="fl">Peso ({calcForm.unitDim==="in"?"lb":"kg"})</div><input className="fi" type="number" value={calcForm.pesoLb} onChange={e=>sc3("pesoLb",e.target.value)}/></div>
            </div>
          </div>
        </div>

        {/* Botón Limpiar */}
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
          <button className="btn-s" onClick={()=>setCalcForm(CALC_FORM_EMPTY)}>🧹 Limpiar valores</button>
        </div>

        {/* Resultado */}
        {calcResult&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              {[[`⚖️ Peso Real`,calcForm.unitDim==="cm"?`${calcResult.kg} kg`:`${calcResult.lb} lb`,"var(--t1)"],["📐 Peso Vol.",`${calcResult.volLb} lb`,"var(--orange)"],["📦 Ft³",String(calcResult.ft3),"var(--sky)"],["🌐 M³",String(calcResult.m3),"var(--teal)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",textAlign:"center",boxShadow:"var(--shadow)"}}>
                  <div style={{fontSize:15,marginBottom:6}}>{l}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:800,color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {calcResult.tarifaMissing?(
              <div style={{background:"#FEF3C7",border:"1.5px solid #F59E0B",borderRadius:14,padding:"20px",marginBottom:14,textAlign:"center"}}>
                <div style={{fontSize:26,marginBottom:6}}>⚠️</div>
                <div style={{fontSize:17,fontWeight:700,color:"#92400E",marginBottom:4}}>No hay tarifa configurada para esta ruta</div>
                <div style={{fontSize:14,color:"#92400E"}}>
                  {calcForm.origPais&&calcForm.destPais&&calcForm.tipoEnvio
                    ?`Configure una tarifa para ${COUNTRIES.find(c=>c.dial===calcForm.origPais)?.name||calcForm.origPais} → ${COUNTRIES.find(c=>c.dial===calcForm.destPais)?.name||calcForm.destPais} · ${calcForm.tipoEnvio} en Configuración → Tarifas.`
                    :"Complete país origen, país destino y tipo de envío para calcular el costo."}
                </div>
              </div>
            ):(
              <>
                <div style={{background:"var(--navy)",borderRadius:14,padding:"24px",marginBottom:14,textAlign:"center"}}>
                  <div style={{fontSize:15,color:"rgba(255,255,255,.6)",marginBottom:8}}>Costo Estimado · {calcForm.tipoEnvio||"—"} · {COUNTRIES.find(c=>c.dial===calcForm.origPais)?.name?.split(" ")[0]||"—"} → {COUNTRIES.find(c=>c.dial===calcForm.destPais)?.name?.split(" ")[0]||"—"}</div>
                  <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:54,fontWeight:800,color:"#E5AE3A",lineHeight:1}}>{calcCurrSym}{calcResult.total}</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,.4)",marginTop:6}}>{calcCurr} · Estimado aproximado{calcResult.usoMinimo?` · Aplicado mínimo ${calcCurrSym}${calcResult.tarifa.min}`:""}</div>
                </div>
                <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",marginBottom:14,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,fontSize:13}}>
                  <div><span style={{color:"var(--t3)"}}>Tarifa aplicada:</span> <b style={{fontFamily:"'DM Mono',monospace"}}>{calcCurrSym}{calcResult.tarifa.porLb||0}/lb · {calcCurrSym}{calcResult.tarifa.porFt3||0}/ft³</b></div>
                  <div><span style={{color:"var(--t3)"}}>Cargo mínimo:</span> <b style={{fontFamily:"'DM Mono',monospace"}}>{calcCurrSym}{calcResult.tarifa.min||0}</b></div>
                  <div><span style={{color:"var(--t3)"}}>Match:</span> <b>{calcResult.tarifa.matchLevel==="ciudad"?"🎯 Ciudad":"🌍 País"}</b></div>
                </div>
                <div style={{fontSize:14,color:"var(--t3)",textAlign:"center"}}>* Los precios son estimados basados en tarifas configuradas. Contacta a ENEX para una cotización exacta.</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── CONTABILIDAD & FACTURACIÓN (Lote 6, rewrite) ────────────────────────────
  // Paquetería internacional — solo USD o EUR, sin IVA, sin IGTF.
  // Números de factura correlativos de 7 dígitos (0000001 ...).
  // Receptor: cliente | agente | autonomo | oficina (snapshot al emitir).
  // Estados: borrador | emitida | pagada_parcial | pagada | anulada.
  // Pagos parciales permitidos; "Bs" solo va como nota referencial.

  const CUR_SYMBOL={USD:"$",EUR:"€"};
  const PAY_METHODS=[
    {k:"efectivo",l:"💵 Efectivo"},
    {k:"zelle",l:"📲 Zelle"},
    {k:"transferencia",l:"🏦 Transferencia"},
    {k:"pos_usd",l:"💳 POS (USD)"},
    {k:"pos_eur",l:"💳 POS (EUR)"},
    {k:"otro",l:"➕ Otro"},
    {k:"saldo_favor",l:"⭐ Saldo a favor",interno:true},
    {k:"nota_credito",l:"📝 Nota de crédito",interno:true},
    {k:"comision",l:"🤝 Comisión",interno:true},
    {k:"comision_quitada",l:"🚫 Comisión quitada",interno:true},
    {k:"pago_agente",l:"💸 Pago a agente",interno:true},
  ];
  const REC_TYPES=[
    {k:"cliente",l:"Cliente (consignatario)"},
    {k:"agente",l:"Agente"},
    {k:"autonomo",l:"Autónomo"},
  ];
  const FAC_STATUS_LABEL={borrador:"📝 Borrador",emitida:"📤 Emitida",pagada_parcial:"⏳ Pago parcial",pagada:"✅ Pagada",anulada:"✕ Anulada"};
  const FAC_STATUS_CLS={borrador:"s5",emitida:"s2",pagada_parcial:"s4",pagada:"s3",anulada:"s1"};

  const fmtMoney=(v,mon="USD")=>`${CUR_SYMBOL[mon]||"$"}${(parseFloat(v)||0).toFixed(2)}`;
  const buildFacturaId=(num)=>String(num).padStart(7,"0");

  // Busca datos del receptor (snapshot al emitir) según tipo+id
  const lookupReceptor=(tipo,id)=>{
    if(!id)return null;
    if(tipo==="cliente"||tipo==="autonomo"){
      const c=clients.find(x=>x.id===id);
      if(!c)return null;
      return{
        nombre:[c.primerNombre,c.segundoNombre,c.primerApellido,c.segundoApellido].filter(Boolean).join(" "),
        doc:c.cedula||"",
        dir:[c.dir,c.municipio,c.estado,c.pais].filter(Boolean).join(", "),
        tel:c.tel1||c.tel2||"",
        email:c.email||"",
        casillero:c.casillero||"",
      };
    }
    if(tipo==="agente"){
      const a=agentes.find(x=>x.id===id);
      if(!a)return null;
      return{nombre:a.nombre||a.name||"",doc:a.rif||a.cedula||"",dir:a.direccion||"",tel:a.telefono||"",email:a.email||"",casillero:""};
    }
    if(tipo==="oficina"){
      const o=oficinas.find(x=>x.id===id);
      if(!o)return null;
      return{nombre:o.nombre||"",doc:o.rif||"",dir:o.direccion||"",tel:o.telefono||"",email:o.email||"",casillero:""};
    }
    return null;
  };

  // ── FACTURACIÓN: helpers de receptor por tipo de pago y sync WR↔factura ─────
  // Para un WR COD: determina automáticamente a quién facturar según el
  // clienteTipo del consignatario:
  //   matriz                                  → al cliente final
  //   agente / vendedor_agente                 → al agente padre
  //   oficina / vendedor_oficina               → a la oficina padre
  //   autonomo                                 → al autónomo padre
  // Para un WR PREPAID: siempre al remitente (texto libre del WR; el operario puede
  // editar/ajustar al crear la factura).
  // Retorna {tipo, id, snapshot} donde snapshot es el dato del lookupReceptor.
  const facReceptorParaWR=(w)=>{
    if(!w)return null;
    const esPrepaid=(w.tipoPago||"").toLowerCase().includes("prepa");
    if(esPrepaid){
      // PREPAID paga el remitente. Si el remitente es la propia empresa (reempaque) o está vacío, paga el dueño de la carga.
      const rem=String(w.remitente||w.shipper||"").trim();
      const esEmpresa=!rem||[empresaNombre,"ENEX"].filter(Boolean).some(n=>sinAcentos(n)===sinAcentos(rem));
      if(!esEmpresa){
        if(w.remitenteId&&!clients.some(c=>c.id===w.remitenteId))return {tipo:"cliente",id:w.remitenteId,snapshot:{nombre:rem,doc:w.remitenteDoc||"",dir:w.remitenteDir||"",tel:w.remitenteTel||"",email:w.remitenteEmail||"",casillero:w._remitenteCas||""}};
        if(w.remitenteId&&clients.some(c=>c.id===w.remitenteId)){const sn=lookupReceptor("cliente",w.remitenteId);
          return {tipo:"cliente",id:w.remitenteId,snapshot:{...sn,doc:sn.doc||w.remitenteDoc||"",tel:sn.tel||w.remitenteTel||"",email:sn.email||w.remitenteEmail||"",dir:sn.dir||w.remitenteDir||""}};}
        const em=String(w.remitenteEmail||"").trim().toLowerCase();
        const reg=clients.find(c=>em&&String(c.email||"").toLowerCase()===em)
          ||clients.find(c=>sinAcentos(fullName(c))===sinAcentos(rem)||(c.empresa&&sinAcentos(c.empresa)===sinAcentos(rem)));
        if(reg)return {tipo:"cliente",id:reg.id,snapshot:lookupReceptor("cliente",reg.id)};
        return {tipo:"cliente", id:"", snapshot:{
          nombre:rem,doc:w.remitenteDoc||"",dir:w.remitenteDir||"",tel:w.remitenteTel||"",email:w.remitenteEmail||"",casillero:"",
        }};
      }
      const due=clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero===w.casillero);
      return {tipo:"cliente",id:due?.id||"",snapshot:due?lookupReceptor("cliente",due.id):{nombre:w.consignee||"",doc:"",dir:"",tel:"",email:"",casillero:w.casillero||""}};
    }
    // COD: mapear según clienteTipo del consignatario
    const cli=clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero===w.casillero);
    const ct=cli?.clienteTipo||"matriz";
    if(ct==="agente"||ct==="vendedor_agente"){
      const id=cli?.agenteId||"";
      return {tipo:"agente",id,snapshot:lookupReceptor("agente",id)};
    }
    if(ct==="autonomo"){
      const id=cli?.autonomoId||"";
      return {tipo:"autonomo",id,snapshot:lookupReceptor("autonomo",id)};
    }
    // matriz → al cliente mismo
    const id=cli?.id||"";
    return {tipo:"cliente",id,snapshot:lookupReceptor("cliente",id)};
  };

  // Aplica cambios de estado a los WRs vinculados a una factura, según el evento:
  //   "emitida"       → 21 (Entregado) → 22 (Por Cobrar)
  //   "pagada"        → 22 o 21 → 23 (Cobrado). PREPAID: 21 también salta a 23
  //   "pagada_parcial"→ 21 → 22 (al menos arrancó el cobro)
  //   "anulada"       → revertir 22/23 → 21 (Entregado) si todavía lo estaba; deja sin tocar si avanzó por otro lado
  //   "pago_anulado"  → si la factura ya no tiene pagado, revertir 23 → 22; si quedó parcial, dejar en 22
  // Solo toca WRs que estén en estado coherente — no degrada estados que ya avanzaron por otra vía.
  const syncWRStatusFromFactura=(factura,evento)=>{
    if(!factura||!Array.isArray(factura.wrIds)||factura.wrIds.length===0)return;
    const now=new Date();
    let cambios=0;
    setWrList(prev=>prev.map(w=>{
      if(!factura.wrIds.includes(w.id))return w;
      const c=w.status?.code||"";
      const esPrepaid=(w.tipoPago||"").toLowerCase().includes("prepa");
      let nuevoCode=null;
      let nota="";
      if(evento==="emitida"){
        // 21 → 22 (Por Cobrar). PREPAID: si ya está pagada, irá a 23 al disparar "pagada" después.
        if(c==="21"){nuevoCode="22";nota=`Factura ${factura.id} emitida`;}
      } else if(evento==="pagada"){
        // 21, 22 → 23 (Cobrado). PREPAID: 21 también salta directo a 23.
        if(["21","22"].includes(c)){nuevoCode="23";nota=`Factura ${factura.id} pagada${esPrepaid?" (PREPAID)":""}`;}
      } else if(evento==="pagada_parcial"){
        if(c==="21"){nuevoCode="22";nota=`Factura ${factura.id} pago parcial`;}
      } else if(evento==="anulada"){
        // Solo revertir si el WR todavía está en 22/23 por esta factura. Mandar a 21 (Entregado).
        if(["22","23"].includes(c)){nuevoCode="21";nota=`Factura ${factura.id} anulada — WR vuelve a Entregado`;}
      } else if(evento==="pago_anulado"){
        // Si la factura quedó con pagado=0 → revertir 23 → 22
        if(c==="23"&&(parseFloat(factura.pagado)||0)<=0.001){nuevoCode="22";nota=`Pago de ${factura.id} anulado`;}
      }
      if(!nuevoCode)return w;
      const st=getStatus(nuevoCode);
      if(!st)return w;
      cambios++;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:st.code,label:st.label,fecha:now,user:currentUser.id,nota}]};
      dbUpsertWR(upd);
      // Mantener selWR sincronizado si está abierto
      if(selWR&&selWR.id===upd.id)setSelWR(upd);
      return upd;
    }));
    if(cambios>0)logAction(`Sync WR ← factura (${evento})`,`${factura.id} → ${cambios} WR`);
    return cambios;
  };

  const emptyLinea=()=>({descripcion:"",cantidad:1,precio:0,total:0});
  const emptyFactura=()=>({
    id:"",numero:0,tipo:"factura",
    fecha:new Date(),fechaEmision:null,status:"borrador",moneda:"USD",
    receptorTipo:"cliente",receptorId:"",
    receptorNombre:"",receptorDoc:"",receptorDir:"",receptorTel:"",receptorEmail:"",receptorCasillero:"",
    lineas:[emptyLinea()],
    subtotal:0,descuento:0,descuentoTipo:"monto",descuentoValor:0,total:0,pagado:0,saldo:0,
    tipoEnvio:"",tarifa:null,
    wrIds:[],guiaIds:[],ncFacturaOrigen:"",
    notas:"",condiciones:"Pago contado. Después de 15 días, aplica recargo por mora.",
    usuario:currentUser.id||currentUser.email||"",motivoAnulacion:"",fechaAnulacion:null,
  });

  // Tipos de línea: flete (un WR × peso o volumen × tarifa), adicional (servicio/gasto de un WR),
  // minimo (ajuste automático al mínimo de la tarifa, sobre el total del flete) y extra (cobro libre).
  const r2=v=>Math.round((parseFloat(v)||0)*100)/100;
  const FAC_ORDEN={flete:0,adicional:1,minimo:2,extra:3};
  const recalcFactura=(f)=>{
    let lineas=(f.lineas||[]).filter(l=>l.tipo!=="minimo").map(l=>({...l,tipo:l.tipo||"extra",total:r2((parseFloat(l.cantidad)||0)*(parseFloat(l.precio)||0))}));
    const hayFlete=lineas.some(l=>l.tipo==="flete");
    const flete=lineas.filter(l=>l.tipo==="flete").reduce((s,l)=>s+l.total,0);
    const minimo=parseFloat(f.tarifa?.min)||0;
    if(hayFlete&&minimo>0&&flete<minimo){
      const aj=r2(minimo-flete);
      lineas.push({tipo:"minimo",descripcion:`Ajuste a mínimo de tarifa (${fmtMoney(minimo,f.moneda)})`,cantidad:1,precio:aj,total:aj});
    }
    lineas=lineas.map((l,i)=>({l,i})).sort((a,b)=>(FAC_ORDEN[a.l.tipo]??9)-(FAC_ORDEN[b.l.tipo]??9)||a.i-b.i).map(x=>x.l);
    const subtotal=r2(lineas.reduce((s,l)=>s+l.total,0));
    const dTipo=f.descuentoTipo||"monto";
    const dValor=parseFloat(f.descuentoValor??f.descuento)||0;
    const descuento=r2(dTipo==="pct"?subtotal*Math.min(100,Math.max(0,dValor))/100:dValor);
    const total=r2(Math.max(0,subtotal-descuento));
    const pagado=parseFloat(f.pagado)||0;
    const saldo=Math.max(0,total-pagado);
    return{...f,lineas,subtotal,descuento,descuentoTipo:dTipo,descuentoValor:dValor,total,saldo};
  };
  // Documento de la factura (se muestra en pantalla y se imprime tal cual)
  const facturaHTML=(f,listaPagos=pagos)=>{
    const e=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
    const $=v=>fmtMoney(v,f.moneda);
    const n=v=>(Math.round((parseFloat(v)||0)*100)/100).toLocaleString("es",{minimumFractionDigits:0,maximumFractionDigits:2});
    const L=(f.lineas||[]).map(l=>({...l,tipo:l.tipo||"extra"}));
    const fl=L.filter(l=>l.tipo==="flete"),ad=L.filter(l=>l.tipo==="adicional"),mn=L.filter(l=>l.tipo==="minimo"),ex=L.filter(l=>l.tipo==="extra");
    const S=(a,k)=>a.reduce((t,l)=>t+(parseFloat(l[k])||0),0);
    const aereo=/^a[eé]r/i.test(f.tipoEnvio||"")||fl.some(l=>["lb","kg"].includes(l.unidad));
    const uniC=fl[0]?.unidad||f.tarifa?.unidad||(aereo?"lb":"ft3");
    const uni=UNI_LBL[uniC]||uniC;
    const cm=aereo?(uniC==="kg"?[["pesoKg","Kg."],["volKg","Kg. Vol"]]:[["pesoLb","Lb."],["volLb","Lb. Vol"]]):[["ft3","Ft³"],["m3","M³"]];
    const conCli=fl.some(l=>l.cliente);
    const titulo=f.tipo==="nota_credito"?"NOTA DE CRÉDITO":f.tipo==="proforma"?"PROFORMA":"FACTURA";
    const pagosAplic=listaPagos.filter(p=>p.facturaId===f.id&&!p.anulado);
    const td='style="padding:5px 7px;border-bottom:1px solid #ddd"';
    const tdr='style="padding:5px 7px;border-bottom:1px solid #ddd;text-align:right;font-family:monospace"';
    const th=(t,r)=>`<th style="padding:6px 7px;background:#1A2B4A;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.5px;text-align:${r?"right":"left"}">${t}</th>`;
    const tablaFlete=fl.length?`<h3>WR y flete <span class="sub">(${aereo?"aéreo — el mayor entre peso real y volumétrico":"marítimo — "+(uniC==="m3"?"metros cúbicos":"pies cúbicos")})</span></h3>
      <table><thead><tr>${th("N° WR")}${conCli?th("Cliente"):""}${th("Cajas",1)}${cm.map(([,t])=>th(t,1)).join("")}${th("A cobrar ("+uni+")",1)}${th("Tarifa",1)}${th("Importe",1)}</tr></thead><tbody>
      ${fl.map(l=>`<tr><td ${td}><b>${e(l.wrId)}</b></td>${conCli?`<td ${td}>${e(l.cliente)}<div class="cas">${e(l.casillero)}</div></td>`:""}<td ${tdr}>${l.cajas||0}</td>${cm.map(([k])=>`<td ${tdr}>${n(l[k])}</td>`).join("")}<td ${tdr}><b>${n(l.cantidad)}</b></td><td ${tdr}>${$(l.precio)}</td><td ${tdr}><b>${$(l.total)}</b></td></tr>`).join("")}
      ${fl.length>1?`<tr class="tot"><td style="padding:5px 7px;border-bottom:1px solid #ddd;white-space:nowrap">TOTALES · ${fl.length} WR</td>${conCli?`<td ${td}></td>`:""}<td ${tdr}>${S(fl,"cajas")}</td>${cm.map(([k])=>`<td ${tdr}>${n(S(fl,k))}</td>`).join("")}<td ${tdr}>${n(S(fl,"cantidad"))} ${uni}</td><td ${td}></td><td ${tdr}>${$(S(fl,"total"))}</td></tr>`:""}
      </tbody></table>`:"";
    const tablaSimple=(tt,arr,conWR)=>arr.length?`<h3>${tt}</h3><table><thead><tr>${conWR?th("N° WR"):""}${th("Concepto")}${th("Cant.",1)}${th("Precio",1)}${th("Importe",1)}</tr></thead><tbody>
      ${arr.map(l=>`<tr>${conWR?`<td ${td}>${e(l.wrId||"")}</td>`:""}<td ${td}>${e(l.descripcion)}</td><td ${tdr}>${n(l.cantidad)}</td><td ${tdr}>${$(l.precio)}</td><td ${tdr}><b>${$(l.total)}</b></td></tr>`).join("")}</tbody></table>`:"";
    const filaTot=(k,v,cls="")=>`<div class="tr ${cls}"><span>${k}</span><span>${v}</span></div>`;
    return `<!doctype html><html><head><meta charset="utf-8"><title>${titulo} ${e(f.id)}</title><style>
      *{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:24px;font-size:13px}
      .hd{display:flex;justify-content:space-between;border-bottom:3px solid #1A2B4A;padding-bottom:10px;margin-bottom:14px}
      .emp{font-size:26px;font-weight:900;letter-spacing:2px;color:#1A2B4A}.num{font-size:18px;font-weight:900;font-family:monospace}
      .box{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;border:1px solid #ccc;border-radius:6px;padding:10px 12px;margin-bottom:12px}
      h3{font-size:14px;color:#1A2B4A;margin:16px 0 6px}h3 .sub{font-weight:400;color:#666;font-size:12px}
      table{width:100%;border-collapse:collapse;font-size:12.5px}.tot td{background:#F1F4F9;font-weight:800;border-top:2px solid #1A2B4A}.cas{font-size:11px;color:#8a6d1a;font-family:monospace}
      .totales{margin-left:auto;width:320px;margin-top:14px;border:1px solid #ccc;border-radius:6px;padding:10px 12px}
      .tr{display:flex;justify-content:space-between;padding:3px 0}.tr span:last-child{font-family:monospace}
      .gt{border-top:2px solid #1A2B4A;margin-top:6px;padding-top:6px;font-size:17px;font-weight:900;color:#1A2B4A}
      .anul{color:#C62828;font-weight:900;font-size:20px;text-align:center;border:2px solid #C62828;padding:4px;margin-bottom:10px}
      .pie{margin-top:16px;font-size:11.5px;color:#444;white-space:pre-wrap}
      @media print{body{padding:0}@page{size:letter portrait;margin:.45in}}
    </style></head><body>
      ${f.status==="anulada"?`<div class="anul">ANULADA${f.motivoAnulacion?` — ${e(f.motivoAnulacion)}`:""}</div>`:""}
      <div class="hd"><div><div class="emp">${e(empresaNombre||"ENEX")}</div><div>International Courier</div></div>
        <div style="text-align:right"><div style="font-weight:800">${titulo}</div><div class="num">Nº ${e(f.id)}</div>
          <div>Fecha: ${fmtDate(f.fecha)}</div>${f.fechaEmision?`<div>Emisión: ${fmtDate(f.fechaEmision)}</div>`:""}
          <div>Moneda: ${e(f.moneda)}</div>${f.ncFacturaOrigen?`<div>Ref. factura: ${e(f.ncFacturaOrigen)}</div>`:""}</div></div>
      <div class="box">
        <div><b>${f.receptorTipo==="agente"?"Agente":f.receptorTipo==="autonomo"?"Autónomo":"Cliente"}:</b> ${e(f.receptorNombre)}</div>
        <div><b>ID Identificación:</b> ${e(f.receptorDoc||"—")}</div>
        ${f.receptorCasillero?`<div><b>Casillero:</b> ${e(f.receptorCasillero)}</div>`:""}
        <div><b>Teléfono:</b> ${e(f.receptorTel||"—")}</div>
        <div style="grid-column:1/-1"><b>Dirección:</b> ${e(f.receptorDir||"—")}</div>
        <div><b>Email:</b> ${e(f.receptorEmail||"—")}</div>
        ${(f.guiaIds||[]).length?`<div><b>Guía:</b> ${e(f.guiaIds.join(", "))}</div>`:""}
        ${f.tipoEnvio?`<div><b>Tipo de envío:</b> ${e(f.tipoEnvio)}</div>`:""}
      </div>
      ${tablaFlete}
      ${tablaSimple("Servicios y gastos adicionales",ad,true)}
      ${tablaSimple("Cobros extra",ex,false)}
      <div class="totales">
        ${fl.length?filaTot("Flete",$(S(fl,"total"))):""}
        ${mn.length?filaTot("Ajuste a mínimo",$(S(mn,"total"))):""}
        ${ad.length?filaTot("Servicios y gastos",$(S(ad,"total"))):""}
        ${ex.length?filaTot("Cobros extra",$(S(ex,"total"))):""}
        ${filaTot("<b>Subtotal</b>",`<b>${$(f.subtotal)}</b>`)}
        ${(f.descuento||0)>0?filaTot(`Descuento${f.descuentoTipo==="pct"?` (${n(f.descuentoValor)}%)`:""}`,`−${$(f.descuento)}`):""}
        ${filaTot("TOTAL",$(f.total),"gt")}
        ${(f.pagado||0)>0?filaTot("Pagado",$(f.pagado))+filaTot("<b>Saldo</b>",`<b>${$(f.saldo)}</b>`):""}
      </div>
      ${pagosAplic.length?`<h3>Pagos aplicados</h3><table><thead><tr>${th("Nº Pago")}${th("Fecha")}${th("Tipo")}${th("Ref.")}${th("Monto",1)}</tr></thead><tbody>${pagosAplic.map(p=>`<tr><td ${td}>${e(p.id)}</td><td ${td}>${fmtDate(p.fecha)}</td><td ${td}>${e((PAY_METHODS.find(m=>m.k===p.tipoPago)||{l:p.tipoPago||""}).l)}</td><td ${td}>${e([p.referencia,p.notaReferencial].filter(Boolean).join(" · "))}</td><td ${tdr}>${fmtMoney(p.monto,p.moneda||f.moneda)}</td></tr>`).join("")}</tbody></table>`:""}
      ${f.notas?`<div class="pie"><b>Notas:</b> ${e(f.notas)}</div>`:""}
      ${f.condiciones?`<div class="pie"><b>Condiciones:</b> ${e(f.condiciones)}</div>`:""}
    </body></html>`;
  };
  const printFactura=(f,listaPagos=pagos)=>{
    const w=window.open("","_blank","width=900,height=1100");
    if(!w){window.alert("El navegador bloqueó la ventana de impresión.");return;}
    w.document.write(facturaHTML(f,listaPagos));w.document.close();
    setTimeout(()=>{w.focus();w.print();},300);
  };
  // Tarifa que aplica a un WR según tipo de envío, origen y destino (Configuración › Tarifas)
  // Primero una tarifa especial del receptor (cliente, agente o autónomo); si no tiene,
  // la predeterminada de la ruta. En una especial, la ruta vacía vale para cualquier ruta.
  const nombreAplica=t=>{
    if(t.aplicaTipo==="agente"){const a=agentes.find(x=>x.id===t.aplicaId);return `Agente ${a?.nombre||a?.codigo||"?"}`;}
    const c=clients.find(x=>x.id===t.aplicaId);
    return `${t.aplicaTipo==="autonomo"?"Autónomo":"Cliente"} ${c?fullName(c):"?"}${t.aplicaTipo==="cliente"&&c?.casillero?` (${c.casillero})`:""}`;
  };
  // País y ciudad a su forma única (nombre, código de ciudad, código telefónico o abreviatura del WR)
  const soloLetras=v=>sinAcentos(v).replace(/[^A-Z]/g,"");
  const paisCanon=v=>{
    const raw=String(v||"").trim();if(!raw)return "";
    const L=soloLetras(raw), D=raw.replace(/\D/g,"");
    for(const co of COUNTRIES){const n=soloLetras(co.name);
      if(L&&(n===L||n.startsWith(L)||L.startsWith(n)))return n;
      if(!L&&D&&co.dial&&parseInt(D,10)===parseInt(String(co.dial).replace(/\D/g,""),10))return n;}
    return L||D;
  };
  const ciudadCanon=(v,pais)=>{
    const V=soloLetras(v);if(!V)return "";
    const P=paisCanon(pais);
    const cos=COUNTRIES.filter(co=>!P||soloLetras(co.name)===P);
    const lista=(cos.length?cos:COUNTRIES).flatMap(co=>co.cities||[]);
    const f=lista.find(ci=>soloLetras(ci.code)===V||soloLetras(ci.name)===V)
      ||(V.length>=2?lista.find(ci=>soloLetras(ci.code).startsWith(V)||soloLetras(ci.name).startsWith(V)):null);
    return f?soloLetras(f.name):V;
  };
  const tarifaParaWR=(w,tipoEnvio,receptor=null)=>{
    const te=sinAcentos(tipoEnvio).replace(/[^A-Z]/g,"");
    const oc=ciudadCanon(w?.origCity,w?.origCountry), dc=ciudadCanon(w?.destCity,w?.destCountry);
    const op=paisCanon(w?.origCountry), dp=paisCanon(w?.destCountry);
    const mismoPais=(a,b)=>!!paisCanon(a)&&paisCanon(a)===b;
    const cands=tarifas.filter(t=>t.activo!==false&&sinAcentos(t.tipoEnvio).replace(/[^A-Z]/g,"")===te);
    const campo=(v,ok)=>!String(v||"").trim()?1:(ok?4:-100);   // vacío = comodín
    const ptsEsp=t=>campo(t.ciudadOrig,ciudadCanon(t.ciudadOrig,t.paisOrig)===oc)+campo(t.ciudadDest,ciudadCanon(t.ciudadDest,t.paisDest)===dc)+campo(t.paisOrig,mismoPais(t.paisOrig,op))+campo(t.paisDest,mismoPais(t.paisDest,dp));
    if(receptor?.tipo&&receptor?.id){
      const esp=cands.filter(t=>t.aplicaTipo===receptor.tipo&&t.aplicaId===receptor.id).sort((a,b)=>ptsEsp(b)-ptsEsp(a))[0];
      if(esp&&ptsEsp(esp)>0)return {...esp,_especial:true};
    }
    const pts=t=>(ciudadCanon(t.ciudadOrig,t.paisOrig)===oc&&oc?4:0)+(ciudadCanon(t.ciudadDest,t.paisDest)===dc&&dc?4:0)+(mismoPais(t.paisOrig,op)?2:0)+(mismoPais(t.paisDest,dp)?2:0);
    const best=cands.filter(t=>!t.aplicaTipo).sort((a,b)=>pts(b)-pts(a))[0];
    return best&&pts(best)>=2?best:null;
  };
  // Precio de un servicio o gasto adicional del catálogo
  const adicionalDeCatalogo=nombre=>{
    const s=SERVICIOS_CAT.find(x=>x.nombre===nombre);if(s)return {tipo:"Servicio",precio:s.precio};
    const g=GASTOS_CAT.find(x=>x.nombre===nombre);if(g)return {tipo:"Gasto",precio:g.precio};
    return null;
  };
  // Líneas de flete y adicionales para un grupo de WR
  const lineasDeWRs=(wrs,isAereo,precioUnidad,conCliente,unidad="")=>{
    const out=[];
    wrs.forEach(w=>{
      const pf=wrPesoFacturable(w,isAereo,unidad);
      const cl=cliDeWRCon(w,clients);
      out.push({tipo:"flete",wrId:w.id,cliente:conCliente?(cl?fullName(cl):(w.consignee||"")):"",casillero:cl?.casillero||w.casillero||"",
        cajas:w.cajas||1,pesoLb:parseFloat(w.pesoLb)||0,volLb:parseFloat(w.volLb)||0,pesoKg:parseFloat(w.pesoKg)||0,volKg:parseFloat(w.volKg)||0,
        ft3:parseFloat(w.ft3)||0,m3:parseFloat(w.m3)||0,unidad:pf.unidad,
        descripcion:`Flete WR ${w.id}`,cantidad:r2(pf.valor),precio:precioUnidad,total:0});
      (Array.isArray(w.cargos)?w.cargos:[]).forEach(c=>{
        const nombre=typeof c==="string"?c:(c?.concepto||c?.nombre||"");
        if(!nombre)return;
        const cat=adicionalDeCatalogo(nombre);
        out.push({tipo:"adicional",wrId:w.id,descripcion:nombre,cantidad:1,precio:cat?.precio||0,total:0});
      });
    });
    return out;
  };

  const facOpenNew=(prefill={})=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para crear facturas.");return;}
    // Si vienen wrIds, validar que ninguno esté Reempacado o Egresado
    if(Array.isArray(prefill.wrIds)&&prefill.wrIds.length>0){
      const bloqueados=prefill.wrIds.map(id=>wrList.find(w=>w.id===id)).filter(w=>w&&!hasPerm("saltar_bloqueos")&&!wrPuedeFacturarse(w));
      if(bloqueados.length>0){
        window.alert(`No se puede facturar — los siguientes WR están bloqueados por estado:\n${bloqueados.map(w=>`• ${w.id} (${w.status?.label||"?"})`).join("\n")}\n\nReempacados y Egresados quedan fijos.`);
        return;
      }
    }
    setFacModal(recalcFactura({...emptyFactura(),...prefill}));
  };
  const facOpenEdit=(f)=>{
    if(f.status!=="borrador"&&f.status!=="emitida"){window.alert("Solo facturas en borrador o emitidas se pueden editar.");return;}
    if(!hasPerm("editar_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para editar facturas.");return;}
    setFacModal({...f,_editing:true});
  };
  const facSaveBorrador=()=>{
    const f=facModal; if(!f)return;
    const isNew=!f._editing;
    let fact=recalcFactura(f);
    if(isNew){
      fact={...fact,id:buildFacturaId(nextInvoiceNum),numero:nextInvoiceNum};
    }
    setFacturas(p=>{
      const ex=p.find(x=>x.id===fact.id);
      return ex?p.map(x=>x.id===fact.id?fact:x):[fact,...p];
    });
    dbUpsertFactura(fact);
    if(isNew){
      setNextInvoiceNum(n=>{const nn=n+1;dbSetConfig('factura_sec_next',String(nn));return nn;});
    }
    logAction(isNew?"Creó borrador factura":"Editó borrador factura",`${fact.id} · ${fmtMoney(fact.total,fact.moneda)} · ${fact.receptorNombre}`);
    setFacModal(null);
  };
  const facEmitir=()=>{
    const f=facModal; if(!f)return;
    if(!f.receptorNombre.trim()){window.alert("Debes seleccionar o capturar un receptor.");return;}
    if(!f.lineas||f.lineas.length===0||f.lineas.every(l=>!l.descripcion.trim())){window.alert("Agrega al menos 1 línea con descripción.");return;}
    const isNew=!f._editing;
    let fact=recalcFactura({...f,status:"emitida",fechaEmision:f.fechaEmision||new Date()});
    if(isNew){
      fact={...fact,id:buildFacturaId(nextInvoiceNum),numero:nextInvoiceNum};
    }
    setFacturas(p=>{
      const ex=p.find(x=>x.id===fact.id);
      return ex?p.map(x=>x.id===fact.id?fact:x):[fact,...p];
    });
    dbUpsertFactura(fact);
    if(isNew){
      setNextInvoiceNum(n=>{const nn=n+1;dbSetConfig('factura_sec_next',String(nn));return nn;});
    }
    logAction("Emitió factura",`${fact.id} · ${fmtMoney(fact.total,fact.moneda)} · ${fact.receptorNombre}`);
    // Sync: WRs vinculados que estén en 21 (Entregado) pasan a 22 (Por Cobrar)
    syncWRStatusFromFactura(fact,"emitida");
    setFacModal(null);
    if(isNew||f.status==="borrador")cobrarSiPrepaid(fact);
  };
  // PREPAID se cobra al emitir: abrir el registro de cobro de esa factura
  const cobrarSiPrepaid=fact=>{
    if(fact.tipo==="nota_credito"||(fact.total||0)<=0)return;
    const ws=wrList.filter(w=>(fact.wrIds||[]).includes(w.id));
    if(!ws.length||!ws.every(w=>(w.tipoPago||"").toLowerCase().includes("prepa")))return;
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){printFactura(fact);return;}
    cobroAbrir(pagadorDeFactura(fact),null,{...fact,saldo:fact.total-(parseFloat(fact.pagado)||0)});
    setCobroModal(m=>m?{...m,imprimirFactura:fact}:m);
  };
  // Cerrar el cobro; si venía de emitir un PREPAID, se imprime la factura igual (queda pendiente)
  const cobroCerrar=()=>{const f=cobroModal?.imprimirFactura;setCobroModal(null);if(f)printFactura(f);};
  const facAnular=(f)=>{
    if(!hasPerm("anular_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para anular facturas.");return;}
    if(f.status==="anulada"){window.alert("Ya está anulada.");return;}
    if(f.tipo==="nota_credito"){const motivo=window.prompt(`Anular nota de crédito ${f.id}.\nMotivo:`);if(motivo)ncAnular(f,motivo);return;}
    if(f.pagado>0){window.alert("No puedes anular una factura con pagos. Anula los pagos primero o emite una nota de crédito.");return;}
    if(facturas.some(x=>x.tipo==="nota_credito"&&x.status!=="anulada"&&x.ncFacturaOrigen===f.id)){window.alert("Esta factura tiene notas de crédito activas. Anúlalas primero.");return;}
    const motivo=window.prompt(`Anular factura ${f.id}.\nMotivo:`);
    if(!motivo)return;
    const upd={...f,status:"anulada",motivoAnulacion:motivo,fechaAnulacion:new Date()};
    setFacturas(p=>p.map(x=>x.id===f.id?upd:x));
    dbUpsertFactura(upd);
    logAction("Anuló factura",`${f.id} — ${motivo}`);
    // Sync: WRs en 22/23 vuelven a 21 (Entregado)
    syncWRStatusFromFactura(upd,"anulada");
  };
  const facDelete=(f)=>{
    if(!hasPerm("borrar_factura")){window.alert("Tu rol no tiene permiso para borrar facturas.");return;}
    if(f.status!=="borrador"){window.alert("Solo borradores pueden borrarse permanentemente. Usa Anular para facturas emitidas.");return;}
    if(!window.confirm(`¿Borrar permanentemente el borrador ${f.id}?`))return;
    setFacturas(p=>p.filter(x=>x.id!==f.id));
    dbDeleteFactura(f.id);
    logAction("Borró borrador factura",f.id);
  };

  // ── Pagos ──────────────────────────────────────────────────────────────────
  const pagoBuildId=(extra=0)=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    const prefix=`PG-${y}${m}${dd}`;
    const sameDay=pagos.filter(p=>String(p.id).startsWith(prefix));
    return`${prefix}-${String(sameDay.length+1+extra).padStart(3,"0")}`;
  };
  const pagoOpen=(factura)=>{
    if(factura&&factura.status!=="anulada"&&factura.status!=="borrador"){cobroAbrir(pagadorDeFactura(factura),[factura.id]);return;}
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso para registrar pagos.");return;}
    if(factura.status==="anulada"||factura.status==="borrador"){window.alert("Factura no está emitida o fue anulada.");return;}
    setPagoModal({facturaId:factura.id,moneda:factura.moneda,monto:factura.saldo||factura.total,tipoPago:"efectivo",referencia:"",notaReferencial:"",fecha:new Date()});
  };
  const pagoSubmit=()=>{
    const p=pagoModal; if(!p)return;
    const monto=parseFloat(p.monto); if(!monto||monto<=0){window.alert("Monto inválido.");return;}
    const fact=facturas.find(f=>f.id===p.facturaId); if(!fact)return;
    if(monto>fact.saldo+0.01){window.alert(`El monto excede el saldo pendiente (${fmtMoney(fact.saldo,fact.moneda)}).`);return;}
    const pago={
      id:pagoBuildId(),facturaId:p.facturaId,fecha:p.fecha||new Date(),
      monto,moneda:p.moneda||fact.moneda,tipoPago:p.tipoPago||"efectivo",
      referencia:(p.referencia||"").trim(),notaReferencial:(p.notaReferencial||"").trim(),
      anulado:false,motivoAnulacion:"",usuario:currentUser.id||currentUser.email||"",
    };
    setPagos(pr=>[pago,...pr]);
    dbUpsertPago(pago);
    // Actualizar factura
    const nuevoPagado=(parseFloat(fact.pagado)||0)+monto;
    const nuevoSaldo=Math.max(0,fact.total-nuevoPagado);
    const nuevoStatus=nuevoSaldo<=0.001?"pagada":"pagada_parcial";
    const upd={...fact,pagado:nuevoPagado,saldo:nuevoSaldo,status:nuevoStatus};
    setFacturas(pr=>pr.map(f=>f.id===fact.id?upd:f));
    dbUpsertFactura(upd);
    logAction("Registró pago",`${pago.id} · ${fmtMoney(monto,pago.moneda)} → ${fact.id}`);
    // Sync: WRs vinculados pasan a 23 (Cobrado) o 22 (Por Cobrar) según total/parcial
    syncWRStatusFromFactura(upd,nuevoStatus==="pagada"?"pagada":"pagada_parcial");
    if(nuevoStatus==="pagada"){const coms=autoComisiones(facturas.map(f=>f.id===upd.id?upd:f),[pago,...pagos],new Set([upd.id]),1);
      if(coms.length){setPagos(pr=>[...coms,...pr]);coms.forEach(x=>dbUpsertPago(x));}}
    setPagoModal(null);
  };
  const pagoAnular=(pago)=>{
    if(!hasPerm("anular_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso para anular pagos.");return;}
    if(pago.anulado){window.alert("Ya está anulado.");return;}
    if(pago.tipoPago==="nota_credito"){window.alert(`Este saldo viene de la nota de crédito ${pago.referencia}. Anula la nota de crédito.`);return;}
    if(!pago.facturaId){const pg=pagadorDePago(pago);
      if(pg&&saldoFavorDe(pg,pago.moneda||"USD")+0.001<pago.monto){window.alert(`Ese saldo a favor ya se usó en otras facturas. Anula primero esos pagos.`);return;}}
    const motivo=window.prompt(`Anular pago ${pago.id}.\nMotivo:`);
    if(!motivo)return;
    const upd={...pago,anulado:true,motivoAnulacion:motivo};
    setPagos(pr=>pr.map(p=>p.id===pago.id?upd:p));
    dbUpsertPago(upd);
    // Revertir monto en la factura
    const fact=facturas.find(f=>f.id===pago.facturaId);
    if(fact){
      const nuevoPagado=Math.max(0,(parseFloat(fact.pagado)||0)-pago.monto);
      const nuevoSaldo=Math.max(0,fact.total-nuevoPagado);
      const nuevoStatus=nuevoPagado<=0.001?"emitida":(nuevoSaldo<=0.001?"pagada":"pagada_parcial");
      const updF={...fact,pagado:nuevoPagado,saldo:nuevoSaldo,status:nuevoStatus};
      setFacturas(pr=>pr.map(f=>f.id===fact.id?updF:f));
      dbUpsertFactura(updF);
      // Sync: si quedó sin pagos → revertir 23 → 22 (Por Cobrar)
      syncWRStatusFromFactura(updF,nuevoPagado<=0.001?"pago_anulado":"pagada_parcial");
    }
    logAction("Anuló pago",`${pago.id} — ${motivo}`);
  };

  // ── Cobros: un pago para varias facturas de un mismo pagador, con saldo a favor ─
  const pagKey=pg=>`${pg?.tipo||"cliente"}:${pg?.id||("n:"+sinAcentos(pg?.nombre||""))}`;
  const pagadorDeFactura=f=>({tipo:f.receptorTipo||"cliente",id:f.receptorId||"",nombre:f.receptorNombre||""});
  const pagadorDePago=p=>p.pagadorTipo?{tipo:p.pagadorTipo,id:p.pagadorId,nombre:p.pagadorNombre}
    :(()=>{const f=facturas.find(x=>x.id===p.facturaId);return f?pagadorDeFactura(f):null;})();
  const facAbiertasDe=pg=>{const k=pagKey(pg);
    return facturas.filter(f=>["emitida","pagada_parcial"].includes(f.status)&&f.tipo!=="nota_credito"&&(f.saldo||0)>0.001&&pagKey(pagadorDeFactura(f))===k)
      .sort((a,b)=>new Date(a.fechaEmision||a.fecha)-new Date(b.fechaEmision||b.fecha));};
  const saldoFavorDe=(pg,mon,lista=pagos)=>{const k=pagKey(pg);let t=0;
    lista.forEach(p=>{if(p.anulado||(p.moneda||"USD")!==mon)return;const pp=pagadorDePago(p);if(!pp||pagKey(pp)!==k)return;
      if(!p.facturaId)t+=p.monto||0; else if(p.tipoPago==="saldo_favor")t-=p.monto||0;});
    return Math.max(0,Math.round(t*100)/100);};
  const monedasDe=pg=>{const k=pagKey(pg);const m=new Set(facAbiertasDe(pg).map(f=>f.moneda||"USD"));
    pagos.forEach(p=>{if(!p.anulado&&!p.facturaId){const pp=pagadorDePago(p);if(pp&&pagKey(pp)===k)m.add(p.moneda||"USD");}});
    return [...m];};
  // Pagadores con deuda o saldo a favor (para elegir al recibir un pago)
  const pagadoresConMovimiento=()=>{const m=new Map();
    facturas.filter(f=>["emitida","pagada_parcial"].includes(f.status)&&f.tipo!=="nota_credito"&&(f.saldo||0)>0.001).forEach(f=>{const pg=pagadorDeFactura(f);m.set(pagKey(pg),pg);});
    pagos.filter(p=>!p.anulado&&!p.facturaId).forEach(p=>{const pg=pagadorDePago(p);if(pg)m.set(pagKey(pg),pg);});
    return [...m.values()].sort((a,b)=>String(a.nombre).localeCompare(String(b.nombre)));};
  const cobroAbrir=(pg,preSel=null,recien=null)=>{
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso para registrar pagos.");return;}
    if(recien){setCobroModal({fecha:new Date(),tipoPago:"efectivo",referencia:"",nota:"",archivo:null,pagador:pg,moneda:recien.moneda||"USD",sel:{[recien.id]:true},usarSaldo:saldoFavorDe(pg,recien.moneda||"USD")>0,
      monto:String(Math.max(0,Math.round(((recien.saldo??recien.total)-saldoFavorDe(pg,recien.moneda||"USD"))*100)/100))});return;}
    const base={fecha:new Date(),tipoPago:"efectivo",referencia:"",nota:"",archivo:null};
    if(!pg){setCobroModal({...base,pagador:null,moneda:"USD",sel:{},monto:"",usarSaldo:true});return;}
    const abiertas=facAbiertasDe(pg);
    const pre=preSel?abiertas.filter(f=>preSel.includes(f.id)):[];
    const moneda=pre[0]?.moneda||abiertas[0]?.moneda||monedasDe(pg)[0]||"USD";
    const marcadas=(pre.length?pre:abiertas).filter(f=>(f.moneda||"USD")===moneda);
    const sel={};marcadas.forEach(f=>{sel[f.id]=true;});
    const deuda=marcadas.reduce((t,f)=>t+(f.saldo||0),0), favor=saldoFavorDe(pg,moneda);
    setCobroModal({...base,pagador:pg,moneda,sel,usarSaldo:favor>0,monto:String(Math.max(0,Math.round((deuda-favor)*100)/100))});
  };
  // Reparto: primero las facturas más antiguas; el saldo a favor se usa antes que el dinero recibido
  const cobroCalc=m=>{
    const r2_=v=>Math.round(v*100)/100;
    const facs=m.pagador?facAbiertasDe(m.pagador).filter(f=>(f.moneda||"USD")===m.moneda):[];
    const favorDisp=m.pagador?saldoFavorDe(m.pagador,m.moneda):0;
    const recibido=Math.max(0,parseFloat(m.monto)||0);
    let disp=recibido+(m.usarSaldo?favorDisp:0);
    const aplic=[];
    facs.filter(f=>m.sel[f.id]).forEach(f=>{const a=r2_(Math.min(f.saldo||0,disp));if(a>0){aplic.push({f,monto:a});disp=r2_(disp-a);}});
    const totAplic=r2_(aplic.reduce((t,x)=>t+x.monto,0));
    const favorUsado=m.usarSaldo?r2_(Math.min(favorDisp,totAplic)):0;
    const efectivoAplic=r2_(totAplic-favorUsado);
    const excedente=r2_(Math.max(0,recibido-efectivoAplic));
    const deudaSel=r2_(facs.filter(f=>m.sel[f.id]).reduce((t,f)=>t+(f.saldo||0),0));
    const deudaTot=r2_(facs.reduce((t,f)=>t+(f.saldo||0),0));
    return {facs,favorDisp,recibido,aplic,totAplic,favorUsado,efectivoAplic,excedente,deudaSel,deudaTot,
      favorFinal:r2_(favorDisp-favorUsado+excedente),pendienteSel:r2_(deudaSel-totAplic)};
  };
  const reciboBuildId=()=>{
    const d=new Date();const prefix=`RC-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
    const n=new Set(pagos.filter(p=>String(p.reciboId||"").startsWith(prefix)).map(p=>p.reciboId)).size;
    return `${prefix}-${String(n+1).padStart(3,"0")}`;
  };
  const cobroSubmit=()=>{
    const m=cobroModal; if(!m)return;
    if(!m.pagador){window.alert("Elige quién paga.");return;}
    const c=cobroCalc(m);
    if(c.recibido<=0&&c.favorUsado<=0){window.alert("Escribe el monto recibido.");return;}
    if(c.totAplic<=0&&c.excedente<=0){window.alert("No hay nada que aplicar.");return;}
    if(c.excedente>0&&!window.confirm(`Sobran ${fmtMoney(c.excedente,m.moneda)}: quedarán como saldo a favor de ${m.pagador.nombre}. ¿Continuar?`))return;
    const reciboId=reciboBuildId();
    const fecha=m.fecha||new Date();
    const base={fecha,moneda:m.moneda,referencia:(m.referencia||"").trim(),notaReferencial:(m.nota||"").trim(),anulado:false,motivoAnulacion:"",
      usuario:currentUser.id||currentUser.email||"",reciboId,pagadorTipo:m.pagador.tipo,pagadorId:m.pagador.id||"",pagadorNombre:m.pagador.nombre||"",comprobanteUrl:""};
    const nuevos=[];let n=0;
    let favorRest=c.favorUsado;
    c.aplic.forEach(({f,monto})=>{
      const deFavor=Math.round(Math.min(favorRest,monto)*100)/100; favorRest=Math.round((favorRest-deFavor)*100)/100;
      const deCaja=Math.round((monto-deFavor)*100)/100;
      if(deFavor>0)nuevos.push({...base,id:pagoBuildId(n++),facturaId:f.id,monto:deFavor,tipoPago:"saldo_favor"});
      if(deCaja>0)nuevos.push({...base,id:pagoBuildId(n++),facturaId:f.id,monto:deCaja,tipoPago:m.tipoPago});
    });
    if(c.excedente>0)nuevos.push({...base,id:pagoBuildId(n++),facturaId:"",monto:c.excedente,tipoPago:m.tipoPago});
    setPagos(pr=>[...nuevos,...pr]);
    nuevos.forEach(p=>dbUpsertPago(p));
    const updF=c.aplic.map(({f,monto})=>{
      const pagado=Math.round(((parseFloat(f.pagado)||0)+monto)*100)/100, saldo=Math.max(0,Math.round((f.total-pagado)*100)/100);
      return {...f,pagado,saldo,status:saldo<=0.001?"pagada":"pagada_parcial"};
    });
    const mp=new Map(updF.map(f=>[f.id,f]));
    setFacturas(pr=>pr.map(f=>mp.get(f.id)||f));
    updF.forEach(f=>{dbUpsertFactura(f);syncWRStatusFromFactura(f,f.status==="pagada"?"pagada":"pagada_parcial");});
    {const pagadas=new Set(updF.filter(f=>f.status==="pagada").map(f=>f.id));
     if(pagadas.size){const coms=autoComisiones(facturas.map(f=>mp.get(f.id)||f),[...nuevos,...pagos],pagadas,n);
       if(coms.length){setPagos(pr=>[...coms,...pr]);coms.forEach(p=>dbUpsertPago(p));nuevos.push(...coms);}}}
    logAction("Registró cobro",`${reciboId} · ${fmtMoney(c.recibido,m.moneda)} · ${m.pagador.nombre} · ${updF.length} factura(s)${c.excedente>0?` · a favor ${fmtMoney(c.excedente,m.moneda)}`:""}`);
    if(m.archivo){
      storageUploadComprobante(m.archivo,reciboId).then(url=>{
        if(!url)return;
        setPagos(pr=>pr.map(p=>p.reciboId===reciboId?{...p,comprobanteUrl:url}:p));
        nuevos.forEach(p=>dbUpsertPago({...p,comprobanteUrl:url}));
      });
    }
    if(m.imprimirFactura){const f=m.imprimirFactura;printFactura(mp.get(f.id)||f,[...nuevos,...pagos]);}
    setCobroModal(null);
  };
  const reciboHTML=(reciboId,lista=pagos,facMap=null)=>{
    const e=v=>String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
    const ps=lista.filter(p=>p.reciboId===reciboId);
    if(!ps.length)return "";
    const p0=ps[0], mon=p0.moneda||"USD", $=v=>fmtMoney(v,mon);
    const pg=pagadorDePago(p0)||{nombre:p0.pagadorNombre};
    const activos=ps.filter(p=>!p.anulado);
    const recibido=activos.filter(p=>p.tipoPago!=="saldo_favor").reduce((t,p)=>t+p.monto,0);
    const usado=activos.filter(p=>p.tipoPago==="saldo_favor").reduce((t,p)=>t+p.monto,0);
    const aFavor=activos.filter(p=>!p.facturaId).reduce((t,p)=>t+p.monto,0);
    const porFac=new Map();activos.filter(p=>p.facturaId).forEach(p=>porFac.set(p.facturaId,(porFac.get(p.facturaId)||0)+p.monto));
    const metodo=(PAY_METHODS.find(x=>x.k===(ps.find(p=>p.tipoPago!=="saldo_favor")||p0).tipoPago)||{l:""}).l.replace(/^\S+\s/,"");
    const td='style="padding:6px 8px;border-bottom:1px solid #ddd"', tdr='style="padding:6px 8px;border-bottom:1px solid #ddd;text-align:right;font-family:monospace"';
    const th=(t,r)=>`<th style="padding:6px 8px;background:#1A2B4A;color:#fff;font-size:11px;text-transform:uppercase;text-align:${r?"right":"left"}">${t}</th>`;
    const filas=[...porFac.entries()].map(([fid,mt])=>{const f=(facMap&&facMap.get(fid))||facturas.find(x=>x.id===fid);
      return `<tr><td ${td}><b>${e(fid)}</b></td><td ${td}>${f?fmtDate(f.fechaEmision||f.fecha):""}</td><td ${tdr}>${f?$(f.total):""}</td><td ${tdr}><b>${$(mt)}</b></td><td ${tdr}>${f?$(f.saldo):""}</td></tr>`;}).join("");
    const fila=(k,v,cls="")=>`<div class="tr ${cls}"><span>${k}</span><span>${v}</span></div>`;
    const anulado=ps.every(p=>p.anulado);
    const favorHoy=pg?.tipo?saldoFavorDe(pg,mon,lista):0;
    return `<!doctype html><html><head><meta charset="utf-8"><title>Recibo ${e(reciboId)}</title><style>
      *{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:24px;font-size:13px}
      .hd{display:flex;justify-content:space-between;border-bottom:3px solid #1A2B4A;padding-bottom:10px;margin-bottom:14px}
      .emp{font-size:26px;font-weight:900;letter-spacing:2px;color:#1A2B4A}.num{font-size:18px;font-weight:900;font-family:monospace}
      .box{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;border:1px solid #ccc;border-radius:6px;padding:10px 12px;margin-bottom:12px}
      table{width:100%;border-collapse:collapse;font-size:12.5px}
      .totales{margin-left:auto;width:340px;margin-top:14px;border:1px solid #ccc;border-radius:6px;padding:10px 12px}
      .tr{display:flex;justify-content:space-between;padding:3px 0}.tr span:last-child{font-family:monospace}
      .gt{border-top:2px solid #1A2B4A;margin-top:6px;padding-top:6px;font-size:17px;font-weight:900;color:#1A2B4A}
      .fav{color:#2E7D32;font-weight:800}.anul{color:#C62828;font-weight:900;font-size:20px;text-align:center;border:2px solid #C62828;padding:4px;margin-bottom:10px}
      .firmas{display:flex;gap:60px;margin-top:60px}.firmas div{flex:1;text-align:center;border-top:1px solid #000;padding-top:4px;font-weight:700;font-size:12px}
      @media print{body{padding:0}@page{size:letter portrait;margin:.45in}}
    </style></head><body>
      ${anulado?`<div class="anul">ANULADO</div>`:""}
      <div class="hd"><div><div class="emp">${e(empresaNombre||"ENEX")}</div><div>International Courier</div></div>
        <div style="text-align:right"><div style="font-weight:800">RECIBO DE PAGO</div><div class="num">Nº ${e(reciboId)}</div>
          <div>Fecha: ${fmtDate(p0.fecha)} ${fmtTime(p0.fecha)}</div><div>Moneda: ${e(mon)}</div></div></div>
      <div class="box">
        <div><b>${pg?.tipo==="agente"?"Agente":pg?.tipo==="autonomo"?"Autónomo":"Cliente"}:</b> ${e(pg?.nombre||p0.pagadorNombre)}</div>
        <div><b>Forma de pago:</b> ${e(recibido>0?metodo:"Saldo a favor")}</div>
        ${p0.referencia?`<div><b>Referencia:</b> ${e(p0.referencia)}</div>`:""}
        ${p0.notaReferencial?`<div><b>Nota:</b> ${e(p0.notaReferencial)}</div>`:""}
      </div>
      ${filas?`<table><thead><tr>${th("Factura")}${th("Emisión")}${th("Total",1)}${th("Abonado",1)}${th("Saldo",1)}</tr></thead><tbody>${filas}</tbody></table>`:""}
      <div class="totales">
        ${fila("Monto recibido",$(recibido))}
        ${usado>0?fila("Saldo a favor usado",$(usado)):""}
        ${fila("Aplicado a facturas",$([...porFac.values()].reduce((t,v)=>t+v,0)))}
        ${aFavor>0?fila("Queda a favor",$(aFavor),"fav"):""}
        ${fila("Saldo a favor actual",$(favorHoy),"gt")}
      </div>
      <div class="firmas"><div>Recibido por</div><div>${e(pg?.nombre||"Pagador")}</div></div>
    </body></html>`;
  };
  const printRecibo=(reciboId,lista=pagos,facMap=null)=>{
    const html=reciboHTML(reciboId,lista,facMap); if(!html)return;
    const w=window.open("","_blank","width=900,height=1100");
    if(!w){window.alert("El navegador bloqueó la ventana del recibo.");return;}
    w.document.write(html);w.document.close();
    setTimeout(()=>{w.focus();w.print();},300);
  };

  // ── Nota de crédito (crea una factura tipo "nota_credito" ligada a una origen) ─
  // ── Cuadre con agentes y autónomos ──────────────────────────────────────────
  // Comisión de un WR PREPAID de un cliente de agente/autónomo que la empresa cobró:
  // flete cobrado − flete a la tarifa del agente/autónomo (con su mínimo).
  const comisionesPrepaid=(facs=facturas,pgs=pagos)=>{
    const acreditadas=new Set(pgs.filter(p=>!p.anulado&&p.tipoPago==="comision").map(p=>p.referencia));
    const quitadas=new Set(pgs.filter(p=>!p.anulado&&p.tipoPago==="comision_quitada").map(p=>p.referencia));
    const out=[];
    facs.filter(f=>f.tipo==="factura"&&f.status==="pagada").forEach(f=>{
      const ws=(f.wrIds||[]).map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
      ws.forEach(w=>{
        if(!(w.tipoPago||"").toLowerCase().includes("prepa"))return;
        const rem=w.remitenteId?clients.find(c=>c.id===w.remitenteId):null;
        const dom=[dnDominioDeCliente(cliDeWR(w)),dnDominioDeCliente(rem)].find(d=>d&&["agente","autonomo"].includes(d.tipo));
        if(!dom)return;
        if(f.receptorTipo===dom.tipo&&f.receptorId===dom.id)return;
        const te=f.tipoEnvio||w.tipoEnvio||"";
        const isAereo=/^a[eé]r/i.test(sinAcentos(te).toLowerCase())||/^a[eé]r/i.test(te);
        const L=f.lineas||[];
        const lin=L.filter(l=>l.tipo==="flete"&&l.wrId===w.id).reduce((t,l)=>t+(parseFloat(l.total)||0),0)
          +(ws.length===1?L.filter(l=>l.tipo==="minimo").reduce((t,l)=>t+(parseFloat(l.total)||0),0):0);
        const cobrado=r2(f.subtotal>0?lin*f.total/f.subtotal:lin);
        const tf=tarifaParaWR(w,te,{tipo:dom.tipo,id:dom.id});
        const pf=wrPesoFacturable(w,isAereo,unidadTarifa(tf,isAereo));
        const costo=tf?Math.max(r2(pf.valor*(parseFloat(isAereo?tf.porLb:tf.porFt3)||0)),parseFloat(tf.min)||0):0;
        const monedaOk=!!tf&&(tf.moneda||"USD")===(f.moneda||"USD");
        const ref=`${f.id}/${w.id}`;
        out.push({ref,f,w,dom,cobrado,costo:r2(costo),comision:monedaOk?Math.max(0,r2(cobrado-costo)):0,tf,monedaOk,moneda:f.moneda||"USD",acreditada:acreditadas.has(ref),
          faltante:["18","18.1"].includes(w.status?.code||""),perdido:["18.2","18.3"].includes(w.status?.code||"")});
      });
    });
    return out.filter(x=>!quitadas.has(x.ref));
  };
  // Comisiones que se cargan solas cuando una factura PREPAID queda pagada
  const autoComisiones=(facs,pgs,facIds,offset=0)=>{
    const items=comisionesPrepaid(facs,pgs).filter(x=>!x.acreditada&&x.comision>0&&facIds.has(x.f.id));
    return items.map((x,i)=>({id:pagoBuildId(offset+i),facturaId:"",fecha:new Date(),monto:x.comision,moneda:x.moneda,tipoPago:"comision",
      referencia:x.ref,notaReferencial:`Comisión WR ${x.w.id} · factura ${x.f.id}`,anulado:false,motivoAnulacion:"",
      usuario:currentUser.id||currentUser.email||"",reciboId:"",pagadorTipo:x.dom.tipo,pagadorId:x.dom.id,pagadorNombre:x.dom.nombre,comprobanteUrl:""}));
  };
  // ── Cuentas: dinero real vs. movimientos internos
  const PAGO_INTERNO=["saldo_favor","nota_credito","comision","comision_quitada"];
  const esDinero=p=>!PAGO_INTERNO.includes(p.tipoPago);
  const metodoLbl=k=>((PAY_METHODS.find(x=>x.k===k)||{l:k||""}).l);
  // Movimientos de una cuenta en una moneda: debe (nos debe) / haber (a su favor); saldo>0 nos debe, <0 le debemos
  const movimientosCuenta=(pg,mon)=>{
    const k=pagKey(pg);const out=[];
    facturas.forEach(f=>{
      if(["anulada","borrador"].includes(f.status)||(f.moneda||"USD")!==mon||pagKey(pagadorDeFactura(f))!==k)return;
      if(f.tipo==="factura")out.push({fecha:new Date(f.fechaEmision||f.fecha),doc:`Factura ${f.id}`,det:(f.wrIds||[]).length?`WR ${(f.wrIds||[]).join(", ")}`:"",debe:f.total||0,haber:0,factura:f});
      else if(f.tipo==="nota_credito")out.push({fecha:new Date(f.fechaEmision||f.fecha),doc:`Nota de crédito ${f.id}`,det:`a factura ${f.ncFacturaOrigen}`,debe:0,haber:Math.abs(f.total||0),nc:f});
    });
    const grupos=new Map();
    pagos.forEach(p=>{
      if(p.anulado||(p.moneda||"USD")!==mon)return;
      const pp=pagadorDePago(p);if(!pp||pagKey(pp)!==k)return;
      if(["saldo_favor","nota_credito","comision_quitada"].includes(p.tipoPago))return;
      if(p.tipoPago==="comision"){out.push({fecha:new Date(p.fecha),doc:"🤝 Comisión",det:p.notaReferencial,debe:0,haber:p.monto,pagos:[p]});return;}
      if(p.monto<0){out.push({fecha:new Date(p.fecha),doc:String(p.notaReferencial||"").startsWith("Reembolso")?"💵 Reembolso":"💸 Pago",det:[metodoLbl(p.tipoPago).replace(/^\S+\s/,""),p.referencia].filter(Boolean).join(" · "),debe:-p.monto,haber:0,pagos:[p]});return;}
      const g=p.reciboId||p.id;
      if(!grupos.has(g))grupos.set(g,{fecha:new Date(p.fecha),doc:`Cobro ${p.reciboId||p.id}`,det:"",debe:0,haber:0,pagos:[],facs:new Set(),metodo:metodoLbl(p.tipoPago).replace(/^\S+\s/,""),ref:p.referencia});
      const x=grupos.get(g);x.haber+=p.monto;x.pagos.push(p);if(p.facturaId)x.facs.add(p.facturaId);
    });
    grupos.forEach(x=>{x.det=[x.metodo,x.ref,x.facs.size?`fact. ${[...x.facs].join(", ")}`:"a favor"].filter(Boolean).join(" · ");out.push(x);});
    // Lo aplicado desde el saldo a favor no mueve el saldo, pero se muestra en el cobro
    pagos.forEach(p=>{if(p.anulado||p.tipoPago!=="saldo_favor"||(p.moneda||"USD")!==mon)return;const pp=pagadorDePago(p);if(!pp||pagKey(pp)!==k)return;
      const g=grupos.get(p.reciboId);if(g){g.pagos.push(p);g.usoFavor=(g.usoFavor||0)+p.monto;}});
    out.sort((a,b)=>a.fecha-b.fecha);
    return out;
  };
  // Resumen de todas las cuentas: nos debe / le debemos por moneda
  const resumenCuentas=(conClientes=false)=>{
    const m=new Map();
    const tocar=(pg)=>{const k=pagKey(pg);if(!m.has(k))m.set(k,{pg,debe:{},favor:{}});return m.get(k);};
    if(conClientes)clients.filter(c=>c.tipo==="cliente").forEach(c=>tocar({tipo:"cliente",id:c.id,nombre:fullName(c)}));
    agentes.forEach(a=>tocar({tipo:"agente",id:a.id,nombre:a.nombre||a.codigo||"Agente"}));
    clients.filter(c=>c.tipo==="usuario"&&c.rol==="F").forEach(c=>tocar({tipo:"autonomo",id:c.id,nombre:fullName(c)||"Autónomo"}));
    facturas.forEach(f=>{if(["anulada","borrador"].includes(f.status))return;const r=tocar(pagadorDeFactura(f));
      if(f.tipo==="factura"&&(f.saldo||0)>0.001){const mn=f.moneda||"USD";r.debe[mn]=r2((r.debe[mn]||0)+f.saldo);}});
    pagos.forEach(p=>{if(p.anulado)return;const pg=pagadorDePago(p);if(!pg)return;const r=tocar(pg);const mn=p.moneda||"USD";
      if(!p.facturaId)r.favor[mn]=r2((r.favor[mn]||0)+(p.monto||0));else if(p.tipoPago==="saldo_favor")r.favor[mn]=r2((r.favor[mn]||0)-(p.monto||0));});
    return [...m.values()].map(r=>{Object.keys(r.favor).forEach(mn=>{if(r.favor[mn]<0.005)delete r.favor[mn];});
      if(r.pg.tipo==="agente"){const a=agentes.find(x=>x.id===r.pg.id);if(a)r.pg={...r.pg,nombre:a.nombre||a.codigo};}
      else{const c=clients.find(x=>x.id===r.pg.id);if(c)r.pg={...r.pg,nombre:fullName(c)||r.pg.nombre,casillero:c.casillero||""};}
      return r;});
  };
  // Anular un cobro completo (todas sus líneas) o un pago suelto
  const pagoAnularGrupo=(ps,motivoPre=null)=>{
    if(!hasPerm("anular_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso para anular pagos.");return;}
    ps=ps.filter(p=>!p.anulado);if(!ps.length)return;
    if(ps.some(p=>p.tipoPago==="nota_credito"||(p.monto<0&&facturas.some(f=>f.id===p.referencia&&f.tipo==="nota_credito")))){window.alert("Ese movimiento viene de una nota de crédito. Anula la nota de crédito.");return;}
    const pg=pagadorDePago(ps[0]);
    const libera=ps.filter(p=>p.tipoPago==="saldo_favor").reduce((t,p)=>t+p.monto,0);
    const quita=ps.filter(p=>!p.facturaId).reduce((t,p)=>t+p.monto,0);
    if(pg&&quita>0&&saldoFavorDe(pg,ps[0].moneda||"USD")+libera+0.001<quita){window.alert("Ese saldo a favor ya se usó en otras facturas. Anula primero esos cobros.");return;}
    const motivo=motivoPre||window.prompt(`Anular ${ps[0].reciboId||ps[0].id}.\nMotivo:`);if(!motivo)return;
    const ids=new Set(ps.map(p=>p.id));
    let nuevosPagos=pagos.map(p=>ids.has(p.id)?{...p,anulado:true,motivoAnulacion:motivo}:p);
    ps.forEach(p=>dbUpsertPago({...p,anulado:true,motivoAnulacion:motivo}));
    const porFac={};ps.forEach(p=>{if(p.facturaId)porFac[p.facturaId]=(porFac[p.facturaId]||0)+p.monto;});
    const updF=Object.entries(porFac).map(([fid,monto])=>{const f=facturas.find(x=>x.id===fid);if(!f)return null;
      const pagado=Math.max(0,r2((parseFloat(f.pagado)||0)-monto)),saldo=Math.max(0,r2(f.total-pagado));
      return {...f,pagado,saldo,status:pagado<=0.001?"emitida":(saldo<=0.001?"pagada":"pagada_parcial")};}).filter(Boolean);
    // Si la factura deja de estar pagada, se revierten sus comisiones automáticas
    updF.filter(f=>f.status!=="pagada").forEach(f=>{
      nuevosPagos=nuevosPagos.map(p=>{if(p.anulado||p.tipoPago!=="comision"||!String(p.referencia).startsWith(f.id+"/"))return p;
        const u={...p,anulado:true,motivoAnulacion:`Cobro de factura ${f.id} anulado`};dbUpsertPago(u);return u;});});
    setPagos(nuevosPagos);
    const mp=new Map(updF.map(f=>[f.id,f]));
    setFacturas(pr=>pr.map(f=>mp.get(f.id)||f));
    updF.forEach(f=>{dbUpsertFactura(f);syncWRStatusFromFactura(f,f.pagado<=0.001?"pago_anulado":"pagada_parcial");});
    logAction("Anuló cobro",`${ps[0].reciboId||ps[0].id} — ${motivo}`);
  };
  // Quitar la comisión de un WR perdido (indemnizado o pérdida cerrada). Si ya estaba acreditada, se revierte.
  const cuadreQuitarComision=(pg,x)=>{
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso.");return;}
    if(!x.perdido){window.alert("Solo se quita la comisión de un WR cerrado como indemnizado o pérdida.");return;}
    const pc=pagos.find(p=>!p.anulado&&p.tipoPago==="comision"&&p.referencia===x.ref);
    if(pc&&saldoFavorDe(pg,pc.moneda||"USD")+0.001<pc.monto){window.alert("Esa comisión ya se usó en otras facturas o se pagó. Anula primero esos movimientos.");return;}
    if(!window.confirm(`Quitar la comisión de ${fmtMoney(x.comision,x.moneda)} del WR ${x.w.id} a ${pg.nombre}?`))return;
    if(pc){const u={...pc,anulado:true,motivoAnulacion:`WR ${x.w.id} perdido`};setPagos(pr=>pr.map(p=>p.id===pc.id?u:p));dbUpsertPago(u);}
    const marca={id:pagoBuildId(),facturaId:"",fecha:new Date(),monto:0,moneda:x.moneda,tipoPago:"comision_quitada",
      referencia:x.ref,notaReferencial:`Comisión quitada · WR ${x.w.id} perdido`,anulado:false,motivoAnulacion:"",
      usuario:currentUser.id||currentUser.email||"",reciboId:"",pagadorTipo:pg.tipo,pagadorId:pg.id,pagadorNombre:pg.nombre,comprobanteUrl:""};
    setPagos(pr=>[marca,...pr]);dbUpsertPago(marca);
    logAction("Quitó comisión",`${pg.nombre} · WR ${x.w.id} · ${fmtMoney(x.comision,x.moneda)}`);
  };
  const cuadreAcreditar=(pg,lista)=>{
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso.");return;}
    const items=lista.filter(x=>x.comision>0&&!x.acreditada);if(!items.length)return;
    const tot={};items.forEach(x=>{tot[x.moneda]=r2((tot[x.moneda]||0)+x.comision);});
    if(!window.confirm(`Acreditar ${items.length} comisión(es) a ${pg.nombre}: ${Object.entries(tot).map(([m,v])=>fmtMoney(v,m)).join(" + ")}?`))return;
    const nuevos=items.map((x,i)=>({id:pagoBuildId(i),facturaId:"",fecha:new Date(),monto:x.comision,moneda:x.moneda,tipoPago:"comision",
      referencia:x.ref,notaReferencial:`Comisión WR ${x.w.id} · factura ${x.f.id}`,anulado:false,motivoAnulacion:"",
      usuario:currentUser.id||currentUser.email||"",reciboId:"",pagadorTipo:pg.tipo,pagadorId:pg.id,pagadorNombre:pg.nombre,comprobanteUrl:""}));
    setPagos(pr=>[...nuevos,...pr]);
    nuevos.forEach(p=>dbUpsertPago(p));
    setCuadreMarca({});
    logAction("Acreditó comisiones",`${pg.nombre} · ${items.length} WR · ${Object.entries(tot).map(([m,v])=>fmtMoney(v,m)).join(" + ")}`);
  };
  const cuadrePagar=(pg)=>{
    const m=cuadrePago;if(!m)return;
    if(!hasPerm("registrar_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso.");return;}
    const monto=r2(m.monto);if(!monto||monto<=0){window.alert("Monto inválido.");return;}
    const disp=saldoFavorDe(pg,m.moneda);
    if(monto>disp+0.001){window.alert(`El saldo a favor de ${pg.nombre} es ${fmtMoney(disp,m.moneda)}.`);return;}
    const pago={id:pagoBuildId(),facturaId:"",fecha:new Date(),monto:-monto,moneda:m.moneda,tipoPago:m.tipoPago||"efectivo",
      referencia:(m.referencia||"").trim(),notaReferencial:`Pago a ${pg.nombre}`,anulado:false,motivoAnulacion:"",
      usuario:currentUser.id||currentUser.email||"",reciboId:"",pagadorTipo:pg.tipo,pagadorId:pg.id,pagadorNombre:pg.nombre,comprobanteUrl:""};
    setPagos(pr=>[pago,...pr]);dbUpsertPago(pago);
    setCuadrePago(null);
    logAction("Pagó a agente/autónomo",`${pg.nombre} · ${fmtMoney(monto,m.moneda)}`);
  };
  // Cargo adicional sobre una factura ya cobrada: factura nueva ligada a la original, mismo receptor y WR
  const facCargoAdicional=orig=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para crear facturas.");return;}
    setFacModal(recalcFactura({...emptyFactura(),
      moneda:orig.moneda,tipoEnvio:orig.tipoEnvio||"",
      receptorTipo:orig.receptorTipo,receptorId:orig.receptorId,receptorNombre:orig.receptorNombre,receptorDoc:orig.receptorDoc,
      receptorDir:orig.receptorDir,receptorTel:orig.receptorTel,receptorEmail:orig.receptorEmail,receptorCasillero:orig.receptorCasillero,
      lineas:[{tipo:"extra",descripcion:"",cantidad:1,precio:0,total:0}],
      wrIds:[...(orig.wrIds||[])],guiaIds:[...(orig.guiaIds||[])],ncFacturaOrigen:orig.id,
      notas:`Cargo adicional a factura ${orig.id}`,
    }));
  };
  const ncDisponible=(orig)=>r2((orig.total||0)-facturas.filter(f=>f.tipo==="nota_credito"&&f.status!=="anulada"&&f.ncFacturaOrigen===orig.id).reduce((t,f)=>t+Math.abs(f.total||0),0));
  const ncOpen=(facturaOrigen,opts={})=>{
    if(!hasPerm("nota_credito")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso.");return;}
    if(facturaOrigen.status==="anulada"){window.alert("La factura origen está anulada.");return;}
    const disp=ncDisponible(facturaOrigen);
    if(disp<=0.001){window.alert(`La factura ${facturaOrigen.id} ya tiene notas de crédito por su total.`);return;}
    const monto=opts.monto!=null?Math.min(r2(opts.monto),disp):disp;
    setNcModal({facturaOrigenId:facturaOrigen.id,monto,motivo:opts.motivo||"",notas:"",destino:"favor"});
  };
  const ncSubmit=()=>{
    const m=ncModal; if(!m)return;
    const orig=facturas.find(f=>f.id===m.facturaOrigenId); if(!orig)return;
    const monto=r2(m.monto); if(!monto||monto<=0){window.alert("Monto inválido.");return;}
    const disp=ncDisponible(orig);
    if(monto>disp+0.001){window.alert(`El monto excede lo disponible para acreditar (${fmtMoney(disp,orig.moneda)}).`);return;}
    // Primero rebaja lo pendiente de la factura; lo que ya estaba pagado se devuelve o queda a favor
    const aplicado=Math.min(monto,r2(orig.saldo||0));
    const excedente=r2(monto-aplicado);
    const destino=excedente>0?(m.destino||"favor"):"";
    const nc={
      ...emptyFactura(),
      id:buildFacturaId(nextInvoiceNum),numero:nextInvoiceNum,
      tipo:"nota_credito",status:"emitida",
      fecha:new Date(),fechaEmision:new Date(),
      moneda:orig.moneda,
      receptorTipo:orig.receptorTipo,receptorId:orig.receptorId,
      receptorNombre:orig.receptorNombre,receptorDoc:orig.receptorDoc,receptorDir:orig.receptorDir,
      receptorTel:orig.receptorTel,receptorEmail:orig.receptorEmail,receptorCasillero:orig.receptorCasillero,
      lineas:[{descripcion:`Nota de crédito a factura ${orig.id}${m.motivo?` — ${m.motivo}`:""}`,cantidad:1,precio:-monto,total:-monto,aplicado,excedente,destino}],
      subtotal:-monto,total:-monto,pagado:0,saldo:0,
      ncFacturaOrigen:orig.id,notas:[m.notas||"",destino==="reembolso"?`Reembolsado ${fmtMoney(excedente,orig.moneda)}`:""].filter(Boolean).join(" · "),
      usuario:currentUser.id||currentUser.email||"",
    };
    setFacturas(p=>[nc,...p]);
    dbUpsertFactura(nc);
    setNextInvoiceNum(n=>{const nn=n+1;dbSetConfig('factura_sec_next',String(nn));return nn;});
    if(aplicado>0){
      const pagado=r2((parseFloat(orig.pagado)||0)+aplicado), saldo=Math.max(0,r2(orig.total-pagado));
      const updOrig={...orig,pagado,saldo,status:saldo<=0.001?"pagada":"pagada_parcial"};
      setFacturas(p=>p.map(f=>f.id===orig.id?updOrig:f));
      dbUpsertFactura(updOrig);
    }
    if(excedente>0){
      const base={facturaId:"",fecha:new Date(),moneda:orig.moneda,anulado:false,motivoAnulacion:"",
        usuario:currentUser.id||currentUser.email||"",reciboId:"",
        pagadorTipo:orig.receptorTipo||"cliente",pagadorId:orig.receptorId||"",pagadorNombre:orig.receptorNombre||"",comprobanteUrl:""};
      const nuevosP=[{...base,id:pagoBuildId(0),monto:excedente,tipoPago:"nota_credito",referencia:nc.id,notaReferencial:`NC ${nc.id} a factura ${orig.id}`}];
      if(destino==="reembolso")nuevosP.push({...base,id:pagoBuildId(1),monto:-excedente,tipoPago:m.metodoReemb||"efectivo",referencia:nc.id,notaReferencial:`Reembolso NC ${nc.id}`});
      setPagos(pr=>[...nuevosP,...pr]);
      nuevosP.forEach(x=>dbUpsertPago(x));
    }
    logAction("Nota de crédito",`${nc.id} − ${fmtMoney(monto,nc.moneda)} → ${orig.id}${destino==="favor"?` · a favor ${fmtMoney(excedente,nc.moneda)}`:destino==="reembolso"?` · reembolso ${fmtMoney(excedente,nc.moneda)}`:""}`);
    setNcModal(null);
  };
  // Anular una NC: revierte lo rebajado en la factura origen y el saldo a favor que generó
  const ncAnular=(nc,motivo)=>{
    const ln=(nc.lineas||[])[0]||{};
    const aplicado=r2(ln.aplicado??Math.abs(nc.total||0));
    const pagoNC=pagos.find(p=>!p.anulado&&p.tipoPago==="nota_credito"&&p.referencia===nc.id);
    const reemb=pagos.find(p=>!p.anulado&&p.monto<0&&p.referencia===nc.id);
    if(pagoNC){const pg=pagadorDePago(pagoNC);
      if(pg&&saldoFavorDe(pg,pagoNC.moneda||"USD")+(reemb?-reemb.monto:0)+0.001<pagoNC.monto){window.alert("El saldo a favor de esta nota de crédito ya se usó en otras facturas. Anula primero esos pagos.");return false;}
      const anul=[pagoNC,reemb].filter(Boolean).map(p=>({...p,anulado:true,motivoAnulacion:`NC ${nc.id} anulada`}));
      const ids=new Set(anul.map(p=>p.id));
      setPagos(pr=>pr.map(p=>ids.has(p.id)?anul.find(x=>x.id===p.id):p));anul.forEach(p=>dbUpsertPago(p));}
    const orig=facturas.find(f=>f.id===nc.ncFacturaOrigen);
    if(orig&&aplicado>0){
      const pagado=Math.max(0,r2((parseFloat(orig.pagado)||0)-aplicado)), saldo=Math.max(0,r2(orig.total-pagado));
      const updO={...orig,pagado,saldo,status:pagado<=0.001?"emitida":(saldo<=0.001?"pagada":"pagada_parcial")};
      setFacturas(p=>p.map(f=>f.id===orig.id?updO:f));dbUpsertFactura(updO);
    }
    const upd={...nc,status:"anulada",motivoAnulacion:motivo,fechaAnulacion:new Date()};
    setFacturas(p=>p.map(x=>x.id===nc.id?upd:x));dbUpsertFactura(upd);
    logAction("Anuló nota de crédito",`${nc.id} — ${motivo}`);
    return true;
  };

  // ── Generar factura desde una guía consolidada ─────────────────────────────
  // Genera borradores COD desde una guía, agrupados según el clienteTipo del
  // consignatario de cada WR:
  //   matriz                     → 1 factura al cliente final
  //   agente / vendedor_agente   → 1 factura al agente padre (agrupa todos sus clientes)
  //   oficina / vendedor_oficina → 1 factura a la oficina padre
  //   autonomo                   → 1 factura al autónomo padre
  // Excluye los WR PREPAID (se facturan en origen al remitente) y los que ya tienen
  // factura activa. Si silent=true no muestra alerts (uso desde recibirGuiaCompleta).
  // Retorna el número de borradores creados.
  // WR facturables de una guía agrupados por receptor (cliente directo, agente o autónomo).
  // Cada grupo trae sus WR, las facturas activas que ya los cubren y los que faltan por facturar.
  const facGruposGuia=guia=>{
    const ids=new Set([...(Array.isArray(guia?.wrIds)?guia.wrIds:[]),...(guia?.containers||[]).flatMap(c=>(c.wr||[]).map(w=>w.id))]);
    const wrs=wrList.filter(w=>ids.has(w.id));
    const activas=facturas.filter(f=>f.status!=="anulada"&&f.tipo!=="nota_credito"&&Array.isArray(f.wrIds));
    const prepaid=[],grupos={},faltantes=[];
    wrs.forEach(w=>{
      if(["18","18.1","18.2","18.3"].includes(w.status?.code||""))faltantes.push(w);
      if(!wrPuedeFacturarse(w))return;
      if((w.tipoPago||"").toLowerCase().includes("prepa")){prepaid.push(w);return;}
      const r=facReceptorParaWR(w);
      if(!r)return;
      const key=`${r.tipo}::${r.id||w.casillero||w.consignee||"sin_id"}`;
      if(!grupos[key])grupos[key]={key,receptor:r,wrs:[]};
      grupos[key].wrs.push(w);
    });
    const lista=Object.values(grupos).map(g=>{
      const facs=activas.filter(f=>f.wrIds.some(id=>g.wrs.some(w=>w.id===id)));
      const cubiertos=new Set(facs.flatMap(f=>f.wrIds));
      return {...g,facturas:facs,pendientes:g.wrs.filter(w=>!cubiertos.has(w.id))};
    }).sort((x,y)=>({cliente:0,agente:1,autonomo:2}[x.receptor.tipo]??9)-({cliente:0,agente:1,autonomo:2}[y.receptor.tipo]??9)||String(x.receptor.snapshot?.nombre||"").localeCompare(String(y.receptor.snapshot?.nombre||"")));
    const facPrepaid=[...new Map(activas.filter(f=>f.wrIds.some(id=>prepaid.some(w=>w.id===id))).map(f=>[f.id,f])).values()];
    const prepaidSin=prepaid.filter(w=>!facPrepaid.some(f=>f.wrIds.includes(w.id)));
    return {grupos:lista,prepaid,facPrepaid,prepaidSin,faltantes};
  };
  // Arma la factura (borrador) de un receptor con sus WR de la guía
  const facConstruir=(guia,r,wrs,seq=0)=>{
    const isAereo=dnGuiaEsAerea(guia);
    const tf=tarifaParaWR(wrs[0],guia.tipoEnvio,{tipo:r.tipo,id:r.id});
    const precioUnidad=parseFloat(isAereo?tf?.porLb:tf?.porFt3)||0;
    const unidad=unidadTarifa(tf,isAereo);
    return recalcFactura({
      ...emptyFactura(),
      id:seq?buildFacturaId(seq):"",numero:seq||0,
      tipo:"factura",status:"borrador",moneda:tf?.moneda||"USD",
      fecha:new Date(),fechaEmision:null,
      receptorTipo:r.tipo,receptorId:r.id||"",
      receptorNombre:r.snapshot?.nombre||"",receptorDoc:r.snapshot?.doc||"",
      receptorDir:r.snapshot?.dir||"",receptorTel:r.snapshot?.tel||"",
      receptorEmail:r.snapshot?.email||"",receptorCasillero:r.snapshot?.casillero||"",
      tipoEnvio:guia.tipoEnvio||"",
      tarifa:tf?{porLb:parseFloat(tf.porLb)||0,porFt3:parseFloat(tf.porFt3)||0,min:parseFloat(tf.min)||0,moneda:tf.moneda||"USD",unidad,
        ruta:`${tf.ciudadOrig||tf.paisOrig||"Cualquiera"} → ${tf.ciudadDest||tf.paisDest||"Cualquiera"}`,especial:!!tf._especial,tarifaId:tf.id}
        :{porLb:0,porFt3:0,min:0,moneda:"USD",unidad,ruta:"Sin tarifa"},
      lineas:lineasDeWRs(wrs,isAereo,precioUnidad,r.tipo!=="cliente",unidad),
      wrIds:wrs.map(w=>w.id),
      guiaIds:[guia.id],
      notas:"",
      usuario:currentUser.id||currentUser.email||"",
    });
  };
  // Factura de un solo WR (PREPAID al registrarlo, o desde su detalle), con la tarifa de su tipo de envío
  const facConstruirWR=w=>{
    const r=facReceptorParaWR(w)||{tipo:"cliente",id:"",snapshot:{}};
    const f=facConstruir({id:"",tipoEnvio:w.tipoEnvio||""},r,[w]);
    return {...f,guiaIds:[],notas:(w.tipoPago||"").toLowerCase().includes("prepa")?`PREPAID · WR ${w.id} · consignatario ${w.consignee||""}${w.casillero?` (#${w.casillero})`:""}`:""};
  };
  // Crea los borradores de los receptores con WR pendientes (todos, o solo uno con soloKey)
  const facFromGuia=(guia,silent=false,soloKey=null)=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")){
      if(!silent)window.alert("Tu rol no tiene permiso.");
      return [];
    }
    const {grupos}=facGruposGuia(guia);
    const conPend=grupos.filter(g=>g.pendientes.length>0&&(!soloKey||g.key===soloKey));
    if(conPend.length===0){if(!silent)window.alert("No hay WR pendientes de facturar.");return [];}
    let seq=nextInvoiceNum;
    const nuevas=conPend.map(g=>facConstruir(guia,g.receptor,g.pendientes,seq++));
    setFacturas(p=>[...nuevas,...p]);
    nuevas.forEach(f=>dbUpsertFactura(f));
    setNextInvoiceNum(seq);
    dbSetConfig('factura_sec_next',String(seq));
    logAction("Generó facturas de guía",`${guia.id} → ${nuevas.length} borrador(es)`);
    return nuevas;
  };
  // Emitir sin abrir el editor
  const facEmitirRapido=f=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")&&!hasPerm("editar_factura")){window.alert("Tu rol no tiene permiso.");return;}
    if(!String(f.receptorNombre||"").trim()){window.alert("Falta el nombre del receptor: abre la factura y complétalo.");return;}
    if((f.total||0)<=0&&!window.confirm(`La factura ${f.id} tiene total ${fmtMoney(f.total||0,f.moneda)}. ¿Emitirla igual?`))return;
    const fact=recalcFactura({...f,status:"emitida",fechaEmision:f.fechaEmision||new Date()});
    setFacturas(p=>p.map(x=>x.id===fact.id?fact:x));
    dbUpsertFactura(fact);
    logAction("Emitió factura",`${fact.id} · ${fmtMoney(fact.total,fact.moneda)} · ${fact.receptorNombre}`);
    syncWRStatusFromFactura(fact,"emitida");
    cobrarSiPrepaid(fact);
  };

  // Emitir varios borradores de una vez (una sola confirmación)
  const facEmitirVarios=lista=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")&&!hasPerm("editar_factura")){window.alert("Tu rol no tiene permiso.");return;}
    const sinRec=lista.filter(f=>!String(f.receptorNombre||"").trim());
    const ok=lista.filter(f=>String(f.receptorNombre||"").trim());
    if(!ok.length){window.alert("Ninguna factura tiene receptor: ábrelas y complétalas.");return;}
    const porMon={};ok.forEach(f=>{porMon[f.moneda]=(porMon[f.moneda]||0)+(f.total||0);});
    const enCero=ok.filter(f=>(f.total||0)<=0);
    const msg=`¿Emitir ${ok.length} factura(s)?\nTotal: ${Object.entries(porMon).map(([m,v])=>fmtMoney(v,m)).join(" · ")}`
      +(enCero.length?`\n\n⚠️ ${enCero.length} con total 0: ${enCero.map(f=>f.id).join(", ")}`:"")
      +(sinRec.length?`\n\n${sinRec.length} sin receptor quedan en borrador: ${sinRec.map(f=>f.id).join(", ")}`:"");
    if(!window.confirm(msg))return;
    const now=new Date();
    const emitidas=ok.map(f=>recalcFactura({...f,status:"emitida",fechaEmision:f.fechaEmision||now}));
    const m=new Map(emitidas.map(f=>[f.id,f]));
    setFacturas(p=>p.map(x=>m.get(x.id)||x));
    emitidas.forEach(f=>{dbUpsertFactura(f);syncWRStatusFromFactura(f,"emitida");});
    logAction("Emitió facturas",`${emitidas.length} · ${emitidas.map(f=>f.id).join(", ")}`);
  };

  // Estado de cuenta de dinero (debe / haber / saldo) de un cliente, agente o autónomo.
  // Se usa en Contabilidad › Cuentas y en Estado de Cuenta.
  const bloqueCuenta=(pg,{onVolver=null}={})=>{
          const puede=hasPerm("registrar_pago")||hasPerm("cobrar");
          const puedeNC=hasPerm("nota_credito")||hasPerm("facturar");
          const IC={cliente:"👤",agente:"🤝",autonomo:"🧑‍💻"},TL={cliente:"Cliente",agente:"Agente",autonomo:"Autónomo"};
          const coms=comisionesPrepaid();
          const mono={fontFamily:"'DM Mono',monospace"};
          const k=pagKey(pg);
          const monsCon=["USD","EUR"].filter(mn=>movimientosCuenta(pg,mn).length>0);
          const mon=monsCon.includes(ctaMon)?ctaMon:(monsCon[0]||"USD");
          const movs=movimientosCuenta(pg,mon);
          const d0=ctaDesde?new Date(ctaDesde+"T00:00:00"):null, d1=ctaHasta?new Date(ctaHasta+"T23:59:59.999"):null;
          const anterior=r2(movs.filter(x=>d0&&x.fecha<d0).reduce((t,x)=>t+x.debe-x.haber,0));
          let run=anterior;
          const vis=movs.filter(x=>(!d0||x.fecha>=d0)&&(!d1||x.fecha<=d1)).map(x=>{run=r2(run+x.debe-x.haber);return {...x,saldo:run};});
          const saldoFin=r2(movs.reduce((t,x)=>t+x.debe-x.haber,0));
          const deuda=r2(facAbiertasDe(pg).filter(f=>(f.moneda||"USD")===mon).reduce((t,f)=>t+(f.saldo||0),0));
          const favor=saldoFavorDe(pg,mon);
          const cm=coms.filter(x=>pagKey(x.dom)===k);
          const pend=cm.filter(x=>!x.acreditada&&x.comision>0);
          const saldoTxt=v=>v>0.004?<span style={{color:"var(--orange)"}}>{fmtMoney(v,mon)}</span>:v<-0.004?<span style={{color:"var(--green)"}}>{fmtMoney(-v,mon)} a favor</span>:<span style={{color:"var(--t3)"}}>0</span>;
          const imprimir=()=>{
            const e=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
            const st=v=>v>0.004?fmtMoney(v,mon):v<-0.004?`${fmtMoney(-v,mon)} a favor`:"0";
            const w=window.open("","_blank","width=900,height=1100");if(!w){window.alert("El navegador bloqueó la ventana de impresión.");return;}
            w.document.write(`<html><head><title>Estado de cuenta ${e(pg.nombre)}</title><style>body{font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:24px;color:#111}h1{font-size:18px;margin:0}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border-bottom:1px solid #ddd;padding:5px 6px;text-align:left}th{background:#1A2B4A;color:#fff}.r{text-align:right}.hd{border-bottom:3px solid #1A2B4A;padding-bottom:8px;display:flex;justify-content:space-between}</style></head><body>
              <div class="hd"><div><h1>${e(empresaNombre||"ENEX")}</h1><div>Estado de cuenta · ${mon}</div></div><div class="r"><b>${e(pg.nombre)}</b><br>${e(TL[pg.tipo]||"Cliente")}${pg.casillero?` · #${e(pg.casillero)}`:""}<br>${fmtDate(new Date())}${ctaDesde||ctaHasta?`<br>Periodo: ${e(ctaDesde||"inicio")} a ${e(ctaHasta||"hoy")}`:""}</div></div>
              <table><thead><tr><th>Fecha</th><th>Documento</th><th>Detalle</th><th class="r">Debe</th><th class="r">Haber</th><th class="r">Saldo</th></tr></thead><tbody>
              ${d0?`<tr><td></td><td colspan="4"><b>Saldo anterior</b></td><td class="r">${st(anterior)}</td></tr>`:""}
              ${vis.map(x=>`<tr><td>${fmtDate(x.fecha)}</td><td>${e(x.doc)}</td><td>${e(x.det)}</td><td class="r">${x.debe?fmtMoney(x.debe,mon):""}</td><td class="r">${x.haber?fmtMoney(x.haber,mon):""}</td><td class="r">${st(x.saldo)}</td></tr>`).join("")}
              </tbody></table><p class="r" style="font-size:14px"><b>Saldo: ${st(saldoFin)}</b></p>
              <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`);
            w.document.close();
          };
          return(
            <div>
              <div className="card" style={{marginBottom:10,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                {onVolver&&<button className="btn-s" style={{fontSize:13}} onClick={onVolver}>← Cuentas</button>}
                {onVolver?<div><div style={{fontSize:18,fontWeight:700,color:"var(--navy)"}}>{IC[pg.tipo]||"👤"} {pg.nombre}</div>
                  <div style={{fontSize:12,color:"var(--t3)"}}>{TL[pg.tipo]||"Cliente"}{pg.casillero?` · #${pg.casillero}`:""}</div></div>
                  :<div style={{fontSize:16,fontWeight:700,color:"var(--navy)"}}>💰 Cuenta</div>}
                <div style={{display:"flex",gap:18,marginLeft:"auto",flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"var(--t3)"}}>Nos debe</div><div style={{...mono,fontSize:18,fontWeight:800,color:"var(--orange)"}}>{fmtMoney(deuda,mon)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"var(--t3)"}}>Le debemos</div><div style={{...mono,fontSize:18,fontWeight:800,color:"var(--green)"}}>{fmtMoney(favor,mon)}</div></div>
                  {puede&&<button className="btn-p" style={{fontSize:13}} onClick={()=>cobroAbrir(pg)}>💵 Cobrar</button>}
                  {puede&&favor>0&&!cuadrePago&&<button className="btn-s" style={{fontSize:13}} onClick={()=>setCuadrePago({monto:String(favor),moneda:mon,tipoPago:"efectivo",referencia:""})}>💸 Pagarle</button>}
                  <button className="btn-s" style={{fontSize:13}} onClick={imprimir}>🖨️ Imprimir</button>
                </div>
              </div>
              {cuadrePago&&(
                <div className="card" style={{marginBottom:10,display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
                  <b style={{alignSelf:"center",marginRight:8}}>💸 Pagar a {pg.nombre}</b>
                  <div><label className="fl">Monto</label><input className="fi" type="number" step="0.01" style={{width:130}} value={cuadrePago.monto} onChange={e=>setCuadrePago(x=>({...x,monto:e.target.value}))}/></div>
                  <div><label className="fl">Moneda</label><select className="fi" value={cuadrePago.moneda} onChange={e=>setCuadrePago(x=>({...x,moneda:e.target.value,monto:String(saldoFavorDe(pg,e.target.value)||"")}))}>{["USD","EUR"].map(m=><option key={m}>{m}</option>)}</select></div>
                  <div><label className="fl">Forma de pago</label><select className="fi" value={cuadrePago.tipoPago} onChange={e=>setCuadrePago(x=>({...x,tipoPago:e.target.value}))}>{PAY_METHODS.filter(x=>!x.interno).map(x=><option key={x.k} value={x.k}>{x.l}</option>)}</select></div>
                  <div><label className="fl">Referencia</label><input className="fi" style={{width:160}} value={cuadrePago.referencia} onChange={e=>setCuadrePago(x=>({...x,referencia:e.target.value}))}/></div>
                  <button className="btn-p" style={{fontSize:13}} onClick={()=>cuadrePagar(pg)}>💸 Registrar pago</button>
                  <button className="btn-s" style={{fontSize:13}} onClick={()=>setCuadrePago(null)}>Cancelar</button>
                </div>)}

              <div className="card" style={{padding:0,marginBottom:10}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>📒 Movimientos</span>
                  {monsCon.length>1&&monsCon.map(mn=><button key={mn} className={mon===mn?"btn-p":"btn-s"} style={{fontSize:12,padding:"3px 10px"}} onClick={()=>setCtaMon(mn)}>{mn}</button>)}
                  <span style={{marginLeft:"auto",fontSize:13,color:"var(--t2)"}}>Desde</span><input className="fi" type="date" style={{width:150,fontSize:13,padding:"4px 6px"}} value={ctaDesde} onChange={e=>setCtaDesde(e.target.value)}/>
                  <span style={{fontSize:13,color:"var(--t2)"}}>Hasta</span><input className="fi" type="date" style={{width:150,fontSize:13,padding:"4px 6px"}} value={ctaHasta} onChange={e=>setCtaHasta(e.target.value)}/>
                  {(ctaDesde||ctaHasta)&&<button className="btn-s" style={{fontSize:12,padding:"3px 10px"}} onClick={()=>{setCtaDesde("");setCtaHasta("");}}>Todo</button>}
                </div>
                {movs.length===0?<div style={{textAlign:"center",padding:30,color:"var(--t3)"}}>Sin movimientos.</div>:(
                <table className="ct">
                  <thead><tr><th>Fecha</th><th>Documento</th><th>Detalle</th><th style={{textAlign:"right"}}>Debe</th><th style={{textAlign:"right"}}>Haber</th><th style={{textAlign:"right"}}>Saldo</th><th></th></tr></thead>
                  <tbody>
                    {d0&&<tr style={{background:"var(--bg3)"}}><td></td><td colSpan={4} style={{fontWeight:700}}>Saldo anterior</td><td style={{...mono,textAlign:"right",fontWeight:800}}>{saldoTxt(anterior)}</td><td></td></tr>}
                    {vis.map((x,i)=>{const rid=x.pagos?.[0]?.reciboId;const comp=x.pagos?.find(p=>p.comprobanteUrl)?.comprobanteUrl;return(
                      <tr key={i}>
                        <td style={{...mono,fontSize:13,whiteSpace:"nowrap"}}>{fmtDate(x.fecha)}</td>
                        <td style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>{x.doc}{x.factura&&x.factura.status==="pagada"&&<span style={{marginLeft:6,fontSize:11,color:"var(--green)"}}>✓ pagada</span>}</td>
                        <td style={{fontSize:12,color:"var(--t2)",maxWidth:320,whiteSpace:"normal"}}>{x.det}{x.usoFavor>0&&<div style={{color:"var(--green)"}}>⭐ Usó {fmtMoney(x.usoFavor,mon)} de saldo a favor</div>}</td>
                        <td style={{...mono,textAlign:"right",fontWeight:700,color:"var(--orange)"}}>{x.debe?fmtMoney(x.debe,mon):""}</td>
                        <td style={{...mono,textAlign:"right",fontWeight:700,color:"var(--green)"}}>{x.haber?fmtMoney(x.haber,mon):""}</td>
                        <td style={{...mono,textAlign:"right",fontWeight:800}}>{saldoTxt(x.saldo)}</td>
                        <td style={{whiteSpace:"nowrap"}}>
                          {x.factura&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",marginRight:4}} title="Ver factura" onClick={()=>setFacPrint(x.factura)}>🖨️</button>}
                          {x.factura&&puedeNC&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",color:"var(--purple)",borderColor:"var(--purple)"}} title="Nota de crédito" onClick={()=>ncOpen(x.factura)}>📝</button>}
                          {x.factura&&["pagada","pagada_parcial"].includes(x.factura.status)&&(hasPerm("crear_factura")||hasPerm("facturar"))&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",marginLeft:4,color:"var(--cyan)",borderColor:"var(--cyan)"}} title="Cargo adicional" onClick={()=>facCargoAdicional(x.factura)}>➕</button>}
                          {x.nc&&puedeNC&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} title="Anular nota de crédito" onClick={()=>facAnular(x.nc)}>✕</button>}
                          {rid&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",marginRight:4}} title="Recibo" onClick={()=>setReciboVer(rid)}>🧾</button>}
                          {comp&&<a href={comp} target="_blank" rel="noreferrer" className="btn-s" style={{fontSize:12,padding:"2px 6px",marginRight:4,textDecoration:"none"}} title="Comprobante">📎</a>}
                          {x.pagos&&x.doc!=="🤝 Comisión"&&x.doc!=="💵 Reembolso"&&(hasPerm("anular_pago")||hasPerm("cobrar"))&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} title="Anular" onClick={()=>pagoAnularGrupo(x.pagos)}>✕</button>}
                        </td>
                      </tr>);})}
                  </tbody>
                </table>)}
              </div>

              {["agente","autonomo"].includes(pg.tipo)&&(
              <div className="card" style={{padding:0}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>🤝 Comisiones PREPAID</span>
                  {puede&&pend.length>0&&<button className="btn-p" style={{fontSize:13,padding:"5px 12px",marginLeft:"auto"}} onClick={()=>cuadreAcreditar(pg,pend)}>⭐ Acreditar todas ({pend.length})</button>}
                </div>
                {cm.length===0?<div style={{textAlign:"center",padding:24,color:"var(--t3)"}}>Sin WR PREPAID cobrados de sus clientes.</div>:(
                <table className="ct">
                  <thead><tr><th>WR</th><th>Factura</th><th>Cliente</th><th style={{textAlign:"right"}}>Cobrado</th><th>Su tarifa</th><th style={{textAlign:"right"}}>Costo</th><th style={{textAlign:"right"}}>Comisión</th><th>Estado</th></tr></thead>
                  <tbody>{cm.map(x=>{const cl=cliDeWR(x.w);return(
                    <tr key={x.ref}>
                      <td style={{...mono,fontWeight:700}}>{x.w.id}</td>
                      <td style={mono}>{x.f.id}</td>
                      <td style={{fontSize:13}}>{cl?fullName(cl):(x.w.consignee||"—")}</td>
                      <td style={{...mono,textAlign:"right"}}>{fmtMoney(x.cobrado,x.moneda)}</td>
                      <td style={{...mono,fontSize:12}}>{x.tf?`${x.tf.id}${x.tf._especial?" ⭐":""}`:"⚠️ Sin tarifa"}{x.tf&&!x.monedaOk?" ⚠️ "+x.tf.moneda:""}</td>
                      <td style={{...mono,textAlign:"right"}}>{x.tf?fmtMoney(x.costo,x.tf.moneda||x.moneda):"—"}</td>
                      <td style={{...mono,textAlign:"right",fontWeight:800,color:"var(--cyan)"}}>{fmtMoney(x.comision,x.moneda)}</td>
                      <td style={{whiteSpace:"nowrap"}}>
                        {x.acreditada?<span className="st s3"><span className="st-dot"/>Acreditada</span>
                          :x.comision>0&&puede?<button className="btn-s" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>cuadreAcreditar(pg,[x])}>⭐ Acreditar</button>
                          :<span style={{fontSize:12,color:"var(--t3)"}}>—</span>}
                        {x.faltante&&<span style={{marginLeft:6,fontSize:12,fontWeight:700,color:"var(--orange)"}}>⚠️ Faltante</span>}
                        {x.perdido&&<><span style={{marginLeft:6,fontSize:12,fontWeight:700,color:"var(--red)"}}>❌ {x.w.status?.label}</span>
                          {puede&&<button className="btn-s" style={{fontSize:12,padding:"2px 8px",marginLeft:6,color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>cuadreQuitarComision(pg,x)}>Quitar comisión</button>}</>}
                      </td>
                    </tr>);})}</tbody>
                </table>)}
              </div>)}
            </div>
          );
  };

  const renderContabilidad=()=>{
    const idsVis=new Set(wrList.map(w=>w.id));
    const facturas=alcanceUsr
      ?facturasAll.filter(f=>(f.wrIds||[]).some(id=>idsVis.has(id))||(f.receptorId&&[currentUser.id,currentUser.agenteId].includes(f.receptorId)))
      :facturasAll;
    const facIds=new Set(facturas.map(f=>f.id));
    const pagos=alcanceUsr?pagosAll.filter(p=>facIds.has(p.facturaId)):pagosAll;
    // Facturación: Por guía / Facturas · Contabilidad: Por Cobrar / Pagos / Reporte
    const enFacturacion=["porguia","facturas"].includes(contabTab);
    const CTABS=enFacturacion
      ?[{k:"porguia",l:"🚢 Por guía"},{k:"facturas",l:"📄 Facturas"}]
      :[{k:"cuentas",l:"👥 Cuentas"},{k:"caja",l:"💵 Caja"},{k:"reporte",l:"📊 Reporte"}];
    // Filtrar facturas (no incluye anuladas en stats principales)
    const facsActivas=facturas.filter(f=>f.status!=="anulada");
    // Stats por moneda (no se mezclan)
    const sumByMon=(arr,field)=>{
      const r={USD:0,EUR:0};
      arr.forEach(f=>{const m=f.moneda||"USD";r[m]=(r[m]||0)+(parseFloat(f[field])||0);});
      return r;
    };
    const totalPorCobrar=sumByMon(facsActivas.filter(f=>f.status==="emitida"||f.status==="pagada_parcial"),"saldo");
    const totalPagado=sumByMon(facsActivas,"pagado");
    const totalFacturado=sumByMon(facsActivas.filter(f=>f.status!=="borrador"&&f.tipo!=="nota_credito"),"total");
    const fmtMonyBoth=(obj)=>{
      const parts=[];
      if(obj.USD)parts.push(`$${obj.USD.toFixed(2)}`);
      if(obj.EUR)parts.push(`€${obj.EUR.toFixed(2)}`);
      return parts.length?parts.join(" / "):"$0.00";
    };

    // Filtros para tab Facturas
    const facFilt=facturas.filter(f=>{
      if(facFilter.status&&f.status!==facFilter.status)return false;
      if(facFilter.tipo&&f.tipo!==facFilter.tipo)return false;
      if(facFilter.moneda&&f.moneda!==facFilter.moneda)return false;
      if(facFilter.receptorTipo&&f.receptorTipo!==facFilter.receptorTipo)return false;
      if(facFilter.receptorKey&&pagKey(pagadorDeFactura(f))!==facFilter.receptorKey)return false;
      if(facFilter.q){
        const q=facFilter.q.toLowerCase();
        if(!`${f.id} ${f.receptorNombre||""} ${f.receptorDoc||""} ${f.receptorCasillero||""}`.toLowerCase().includes(q))return false;
      }
      return true;
    });

    return (
      <div className="page-scroll">

        {/* Mini stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {(enFacturacion?[
            ["📄","Total Facturas",facturas.length,"var(--navy)"],
            ["💰","Por Cobrar",fmtMonyBoth(totalPorCobrar),"var(--orange)"],
            ["✅","Pagado",fmtMonyBoth(totalPagado),"var(--green)"],
            ["📊","Facturado",fmtMonyBoth(totalFacturado),"var(--cyan)"],
          ]:(()=>{
            const kv=alcanceUsr?new Set(facturas.map(f=>pagKey(pagadorDeFactura(f)))):null;
            const rs=resumenCuentas().filter(r=>!kv||kv.has(pagKey(r.pg)));
            const suma=c=>{const o={USD:0,EUR:0};rs.forEach(r=>Object.entries(r[c]).forEach(([m,v])=>{o[m]=(o[m]||0)+v;}));return o;};
            const h0=new Date();h0.setHours(0,0,0,0);
            const hoyE={USD:0,EUR:0};pagos.forEach(p=>{if(!p.anulado&&esDinero(p)&&p.monto>0&&new Date(p.fecha)>=h0){const m=p.moneda||"USD";hoyE[m]=(hoyE[m]||0)+p.monto;}});
            const sinAcred=comisionesPrepaid().filter(x=>!x.acreditada&&x.comision>0&&(!kv||kv.has(pagKey(x.dom)))).length;
            return [
              ["💰","Nos deben",fmtMonyBoth(suma("debe")),"var(--orange)"],
              ["⭐","Les debemos",fmtMonyBoth(suma("favor")),"var(--green)"],
              ["💵","Entró hoy",fmtMonyBoth(hoyE),"var(--cyan)"],
              ["🤝","Comisiones sin acreditar",sinAcred,"var(--navy)"],
            ];})()).map(([ic,l,v,c])=>(
            <div key={l} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",boxShadow:"var(--shadow)"}}>
              <div style={{fontSize:20,marginBottom:6}}>{ic}</div>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:14,color:"var(--t2)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs + botón nueva factura */}
        <div style={{display:"flex",gap:4,marginBottom:14,background:"var(--bg4)",borderRadius:8,padding:"3px",border:"1px solid var(--b1)"}}>
          {CTABS.map(t=><button key={t.k} onClick={()=>setContabTab(t.k)} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:contabTab===t.k?"var(--navy)":"transparent",color:contabTab===t.k?"#fff":"var(--t2)"}}>{t.l}</button>)}
        </div>

        {/* ── FACTURAS ── */}
        {contabTab==="facturas"&&(
          <>
            <div className="card" style={{marginBottom:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <input className="fi" placeholder="Buscar por N°, receptor, doc, casillero…" value={facFilter.q} onChange={e=>setFacFilter(p=>({...p,q:e.target.value}))} style={{flex:1,minWidth:220,fontSize:14,padding:"6px 10px"}}/>
              <select className="fi" value={facFilter.status} onChange={e=>setFacFilter(p=>({...p,status:e.target.value}))} style={{fontSize:14,padding:"6px 10px"}}>
                <option value="">Todos los estados</option>
                <option value="borrador">Borrador</option>
                <option value="emitida">Emitida</option>
                <option value="pagada_parcial">Pago parcial</option>
                <option value="pagada">Pagada</option>
                <option value="anulada">Anulada</option>
              </select>
              <select className="fi" value={facFilter.tipo} onChange={e=>setFacFilter(p=>({...p,tipo:e.target.value}))} style={{fontSize:14,padding:"6px 10px"}}>
                <option value="">Todos los tipos</option>
                <option value="factura">Factura</option>
                <option value="proforma">Proforma</option>
                <option value="nota_credito">Nota de crédito</option>
              </select>
              <select className="fi" value={facFilter.moneda} onChange={e=>setFacFilter(p=>({...p,moneda:e.target.value}))} style={{fontSize:14,padding:"6px 10px"}}>
                <option value="">Todas las monedas</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <select className="fi" value={facFilter.receptorTipo} onChange={e=>setFacFilter(p=>({...p,receptorTipo:e.target.value,receptorKey:"",receptorNom:"",recQ:""}))} style={{fontSize:14,padding:"6px 10px"}}>
                <option value="">Todos los receptores</option>
                {REC_TYPES.map(r=><option key={r.k} value={r.k}>{r.l}</option>)}
              </select>
              {facFilter.receptorTipo&&(()=>{
                const tl=(REC_TYPES.find(r=>r.k===facFilter.receptorTipo)||{l:""}).l;
                const m=new Map();facturas.filter(f=>f.receptorTipo===facFilter.receptorTipo).forEach(f=>{const pg=pagadorDeFactura(f);const k=pagKey(pg);if(!m.has(k))m.set(k,{k,nombre:f.receptorNombre||"—",cas:f.receptorCasillero||"",n:0});m.get(k).n++;});
                const Q=sinAcentos((facFilter.recQ||"").trim());
                const ops=[...m.values()].filter(o=>!Q||sinAcentos(`${o.nombre} ${o.cas}`).includes(Q)).sort((a,b)=>a.nombre.localeCompare(b.nombre)).slice(0,30);
                return facFilter.receptorKey
                  ?<span style={{fontSize:13,fontWeight:700,padding:"5px 10px",borderRadius:14,background:"#EEF3FF",color:"var(--navy)",border:"1px solid #B8C8F0",whiteSpace:"nowrap"}}>{facFilter.receptorNom}
                    <span style={{cursor:"pointer",color:"var(--red)",marginLeft:6}} onClick={()=>setFacFilter(p=>({...p,receptorKey:"",receptorNom:"",recQ:""}))}>✕</span></span>
                  :<div className="fi-search" style={{position:"relative",minWidth:240}}>
                    <input className="fi" autoFocus placeholder={`Nombre del ${tl.toLowerCase().split(" ")[0]}…`} value={facFilter.recQ||""} style={{fontSize:14,padding:"6px 10px"}}
                      onFocus={()=>setFacRecAbierto(true)} onBlur={()=>setTimeout(()=>setFacRecAbierto(false),150)}
                      onChange={e=>{setFacFilter(p=>({...p,recQ:e.target.value}));setFacRecAbierto(true);}}
                      onKeyDown={e=>{if(e.key==="Enter"&&ops[0]){e.preventDefault();setFacFilter(p=>({...p,receptorKey:ops[0].k,receptorNom:ops[0].nombre}));}}}/>
                    {facRecAbierto&&ops.length>0&&<div className="fi-search-res">{ops.map(o=>(
                      <div key={o.k} className="fi-search-item" onMouseDown={e=>{e.preventDefault();setFacFilter(p=>({...p,receptorKey:o.k,receptorNom:o.nombre}));}}>
                        {o.nombre}{o.cas&&<span className="fi-search-cas">#{o.cas}</span>}<span style={{fontSize:12,color:"var(--t3)",marginLeft:8}}>{o.n} fact.</span>
                      </div>))}</div>}
                  </div>;
              })()}
              {(hasPerm("crear_factura")||hasPerm("facturar"))&&<button className="btn-p" onClick={()=>facOpenNew()}>+ Nueva Factura</button>}
            </div>
            <div className="card" style={{padding:0}}>
              {facFilt.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay facturas con esos filtros.</div>:(
                <table className="ct">
                  <thead><tr>
                    <th>N° Factura</th><th>Tipo</th><th>Fecha</th><th>Receptor</th>
                    <th>WR / Guía</th><th>Nota Entrega</th>
                    <th>Mon</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Estado</th><th style={{minWidth:160}}>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {facFilt.map(f=>{
                      const negativa=f.tipo==="nota_credito";
                      // Notas de entrega ligadas (comparten WRs con la factura)
                      const dnsRel=deliveryNotes.filter(n=>!n.anulado&&Array.isArray(n.wrIds)&&Array.isArray(f.wrIds)&&n.wrIds.some(id=>f.wrIds.includes(id)));
                      return(
                        <tr key={f.id}>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:14}}>{f.id}</span>{f.ncFacturaOrigen&&<div style={{fontSize:11,color:"var(--purple)",fontFamily:"'DM Mono',monospace"}}>← {f.ncFacturaOrigen}</div>}</td>
                          <td><span style={{fontSize:12,padding:"2px 6px",borderRadius:4,background:f.tipo==="nota_credito"?"var(--purple)":(f.tipo==="proforma"?"var(--gold2)":"var(--cyan)"),color:"#fff",fontWeight:700}}>{f.tipo==="nota_credito"?"NC":f.tipo==="proforma"?"PRF":"FAC"}</span></td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtDate(f.fecha)}</td>
                          <td style={{fontWeight:600}}>{f.receptorNombre||"—"}<div style={{fontSize:12,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{f.receptorCasillero||f.receptorDoc||""}</div></td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--t2)"}}>
                            {(f.wrIds||[]).length>0&&<div><b style={{color:"var(--navy)"}}>{(f.wrIds||[]).length} WR</b>{(f.wrIds||[]).length<=3&&<>: {(f.wrIds||[]).join(", ")}</>}</div>}
                            {(f.guiaIds||[]).length>0&&<div style={{color:"var(--purple)"}}>Guía: {(f.guiaIds||[]).join(", ")}</div>}
                            {(f.wrIds||[]).length===0&&(f.guiaIds||[]).length===0&&<span style={{color:"var(--t4)"}}>—</span>}
                          </td>
                          <td style={{fontSize:11}}>
                            {dnsRel.length===0
                              ?<span style={{color:"var(--t4)"}}>—</span>
                              :dnsRel.map(n=>(<div key={n.id} style={{fontFamily:"'DM Mono',monospace",color:"var(--navy)",fontWeight:600}}>{n.id}</div>))}
                          </td>
                          <td style={{textAlign:"center",fontWeight:700,fontSize:13}}>{f.moneda}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:negativa?"var(--purple)":"var(--navy)"}}>{fmtMoney(f.total,f.moneda)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--green)"}}>{fmtMoney(f.pagado,f.moneda)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:f.saldo>0?"var(--orange)":"var(--t3)"}}>{fmtMoney(f.saldo,f.moneda)}</td>
                          <td><span className={`st ${FAC_STATUS_CLS[f.status]||"s5"}`}><span className="st-dot"/>{FAC_STATUS_LABEL[f.status]||f.status}</span></td>
                          <td style={{whiteSpace:"nowrap"}}>
                            <button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4}} title="Ver / Imprimir" onClick={()=>setFacPrint(f)}>🖨️</button>
                            {(f.status==="borrador"||f.status==="emitida")&&(hasPerm("editar_factura")||hasPerm("facturar"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4}} title="Editar" onClick={()=>facOpenEdit(f)}>✏️</button>}
                            {(f.status==="emitida"||f.status==="pagada_parcial")&&(hasPerm("registrar_pago")||hasPerm("cobrar"))&&<button className="btn-p" style={{fontSize:12,padding:"3px 8px",marginRight:4}} title="Registrar pago" onClick={()=>pagoOpen(f)}>💵 Cobrar</button>}
                            {f.status!=="borrador"&&f.tipo==="factura"&&(hasPerm("nota_credito")||hasPerm("facturar"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4,color:"var(--purple)",borderColor:"var(--purple)"}} title="Nota de crédito" onClick={()=>ncOpen(f)}>📝 NC</button>}
                            {["pagada","pagada_parcial"].includes(f.status)&&f.tipo==="factura"&&(hasPerm("crear_factura")||hasPerm("facturar"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4,color:"var(--cyan)",borderColor:"var(--cyan)"}} title="Cargo adicional" onClick={()=>facCargoAdicional(f)}>➕ Cargo</button>}
                            {f.status!=="anulada"&&f.status!=="borrador"&&(hasPerm("anular_factura")||hasPerm("facturar"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4,color:"var(--red)",borderColor:"var(--red)"}} title="Anular" onClick={()=>facAnular(f)}>✕</button>}
                            {f.status==="borrador"&&hasPerm("borrar_factura")&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",color:"var(--red)",borderColor:"var(--red)"}} title="Borrar borrador" onClick={()=>facDelete(f)}>🗑️</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── CUENTAS ── */}
        {contabTab==="cuentas"&&(()=>{
          const puede=hasPerm("registrar_pago")||hasPerm("cobrar");
          const IC={cliente:"👤",agente:"🤝",autonomo:"🧑‍💻"},TL={cliente:"Cliente",agente:"Agente",autonomo:"Autónomo"};
          const keysVis=alcanceUsr?new Set(facturas.map(f=>pagKey(pagadorDeFactura(f)))):null;
          const coms=comisionesPrepaid();
          const pendCom=k=>coms.filter(x=>!x.acreditada&&x.comision>0&&pagKey(x.dom)===k);
          const fm=o=>Object.entries(o||{}).filter(([,v])=>Math.abs(v)>0.004).map(([mn,v])=>fmtMoney(v,mn));
          const mono={fontFamily:"'DM Mono',monospace"};
          if(!cuadreSel){
            const Q=sinAcentos(ctaQ.trim());
            const todas=resumenCuentas(ctaSoloSaldo!=="con"||!!Q).filter(r=>!keysVis||keysVis.has(pagKey(r.pg)));
            const filas=todas.filter(r=>!ctaFil||r.pg.tipo===ctaFil)
              .filter(r=>!Q||sinAcentos(`${r.pg.nombre} ${r.pg.casillero||""}`).includes(Q))
              .map(r=>({...r,pc:pendCom(pagKey(r.pg))}))
              .filter(r=>{const tiene=fm(r.debe).length>0||fm(r.favor).length>0||r.pc.length>0;
                return ctaSoloSaldo==="todas"||Q?true:ctaSoloSaldo==="con"?tiene:!tiene;})
              .sort((a,b)=>Object.values(b.debe).reduce((t,v)=>t+v,0)-Object.values(a.debe).reduce((t,v)=>t+v,0)||Object.values(b.favor).reduce((t,v)=>t+v,0)-Object.values(a.favor).reduce((t,v)=>t+v,0)||String(a.pg.nombre).localeCompare(String(b.pg.nombre)));
            const tot=(campo)=>{const o={};filas.forEach(r=>Object.entries(r[campo]).forEach(([mn,v])=>{o[mn]=r2((o[mn]||0)+v);}));return fm(o).join(" / ")||"—";};
            const MAX=300;
            return(
              <div className="card" style={{padding:0}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <input className="fi" style={{width:280,fontSize:14,padding:"6px 10px"}} placeholder="Buscar nombre o casillero…" value={ctaQ} onChange={e=>setCtaQ(e.target.value)}/>
                  {(()=>{const seg=(ops,val,set)=><div style={{display:"flex",gap:3,background:"var(--bg4)",borderRadius:7,padding:3,border:"1px solid var(--b1)"}}>
                      {ops.map(([k,l])=><button key={k||"t"} onClick={()=>set(k)} style={{padding:"4px 11px",borderRadius:5,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:val===k?"var(--navy)":"transparent",color:val===k?"#fff":"var(--t2)"}}>{l}</button>)}</div>;
                    return <>{seg([["","Todos"],["cliente","👤 Clientes"],["agente","🤝 Agentes"],["autonomo","🧑‍💻 Autónomos"]],ctaFil,setCtaFil)}
                      {seg([["con","Con saldo"],["sin","Sin saldo"],["todas","Con y sin saldo"]],ctaSoloSaldo,setCtaSoloSaldo)}</>;})()}
                  {puede&&<button className="btn-p" style={{fontSize:13,padding:"6px 12px",marginLeft:"auto"}} onClick={()=>cobroAbrir(null)}>💵 Recibir pago</button>}
                </div>
                {filas.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>{Q?"Sin coincidencias.":ctaSoloSaldo==="con"?"No hay cuentas con saldo. ✅":"No hay cuentas."}</div>:(
                <table className="ct">
                  <thead><tr><th>Cuenta</th><th style={{textAlign:"right"}}>Nos debe</th><th style={{textAlign:"right"}}>Le debemos</th><th></th></tr></thead>
                  <tbody>
                    {filas.slice(0,MAX).map(r=>(
                      <tr key={pagKey(r.pg)} style={{cursor:"pointer"}} onClick={()=>{setCuadreSel(r.pg);setCuadrePago(null);setCtaDesde("");setCtaHasta("");}}>
                        <td><span style={{fontWeight:700}}>{IC[r.pg.tipo]||"👤"} {r.pg.nombre||"—"}</span>
                          <div style={{fontSize:12,color:"var(--t3)"}}>{TL[r.pg.tipo]||"Cliente"}{r.pg.casillero?` · #${r.pg.casillero}`:""}</div></td>
                        <td style={{...mono,textAlign:"right",fontWeight:800,color:"var(--orange)"}}>{fm(r.debe).map(x=><div key={x}>{x}</div>)}{!fm(r.debe).length&&<span style={{color:"var(--t3)"}}>—</span>}</td>
                        <td style={{...mono,textAlign:"right",fontWeight:800,color:"var(--green)"}}>{fm(r.favor).map(x=><div key={x}>{x}</div>)}{!fm(r.favor).length&&<span style={{color:"var(--t3)"}}>—</span>}</td>
                        <td style={{fontSize:12,color:"var(--cyan)",fontWeight:700,whiteSpace:"nowrap"}}>{r.pc.length>0&&`🤝 ${r.pc.length} comisión${r.pc.length===1?"":"es"} sin acreditar`}</td>
                      </tr>))}
                    <tr style={{background:"var(--bg3)"}}>
                      <td style={{fontWeight:800}}>Total ({filas.length})</td>
                      <td style={{...mono,textAlign:"right",fontWeight:800,color:"var(--orange)"}}>{tot("debe")}</td>
                      <td style={{...mono,textAlign:"right",fontWeight:800,color:"var(--green)"}}>{tot("favor")}</td><td></td>
                    </tr>
                  </tbody>
                </table>)}
                {filas.length>MAX&&<div style={{padding:10,textAlign:"center",fontSize:13,color:"var(--t3)"}}>Se muestran {MAX} de {filas.length}. Usa el buscador.</div>}
              </div>
            );
          }
          return bloqueCuenta(cuadreSel,{onVolver:()=>setCuadreSel(null)});
        })()}

        {/* ── CAJA ── */}
        {contabTab==="caja"&&(()=>{
          const mono={fontFamily:"'DM Mono',monospace"};
          const d0=new Date((cajaDesde||hoyISO())+"T00:00:00"), d1=new Date((cajaHasta||cajaDesde||hoyISO())+"T23:59:59.999");
          const enRango=pagos.filter(p=>!p.anulado&&esDinero(p)&&new Date(p.fecha)>=d0&&new Date(p.fecha)<=d1);
          const usuarios=[...new Set(enRango.map(p=>p.usuario).filter(Boolean))];
          const nombreUsr=u=>{const c=clients.find(x=>x.id===u||x.email===u);return c?fullName(c):u;};
          const movs=enRango.filter(p=>!cajaUsr||p.usuario===cajaUsr);
          const resumen={};movs.forEach(p=>{const kk=`${p.tipoPago}|${p.moneda||"USD"}`;if(!resumen[kk])resumen[kk]={metodo:p.tipoPago,moneda:p.moneda||"USD",entra:0,sale:0};
            if(p.monto>0)resumen[kk].entra=r2(resumen[kk].entra+p.monto);else resumen[kk].sale=r2(resumen[kk].sale-p.monto);});
          const filasR=Object.values(resumen).sort((a,b)=>(a.moneda+a.metodo).localeCompare(b.moneda+b.metodo));
          const porMon={};filasR.forEach(r=>{if(!porMon[r.moneda])porMon[r.moneda]={entra:0,sale:0};porMon[r.moneda].entra=r2(porMon[r.moneda].entra+r.entra);porMon[r.moneda].sale=r2(porMon[r.moneda].sale+r.sale);});
          const grupos=[];const gm=new Map();
          movs.forEach(p=>{const g=p.monto>0&&p.reciboId?p.reciboId:p.id;if(!gm.has(g)){const x={id:g,fecha:new Date(p.fecha),quien:(pagadorDePago(p)||{}).nombre||p.pagadorNombre||"—",metodo:p.tipoPago,ref:p.referencia,monto:0,moneda:p.moneda||"USD",usuario:p.usuario,pagos:[],comp:""};gm.set(g,x);grupos.push(x);}
            const x=gm.get(g);x.monto=r2(x.monto+p.monto);x.pagos.push(p);if(p.comprobanteUrl)x.comp=p.comprobanteUrl;});
          grupos.sort((a,b)=>b.fecha-a.fecha);
          const setRango=(a,b)=>{setCajaDesde(a);setCajaHasta(b);};
          const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          const hoy=new Date();const ayer=new Date(hoy);ayer.setDate(hoy.getDate()-1);
          const hace7=new Date(hoy);hace7.setDate(hoy.getDate()-6);
          const mes1=new Date(hoy.getFullYear(),hoy.getMonth(),1);
          const mesAnt1=new Date(hoy.getFullYear(),hoy.getMonth()-1,1), mesAntF=new Date(hoy.getFullYear(),hoy.getMonth(),0);
          const ml=k=>metodoLbl(k);
          const imprimir=()=>{
            const e=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
            const w=window.open("","_blank","width=900,height=1100");if(!w){window.alert("El navegador bloqueó la ventana de impresión.");return;}
            w.document.write(`<html><head><title>Cierre de caja</title><style>body{font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:24px;color:#111}h1{font-size:18px;margin:0}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border-bottom:1px solid #ddd;padding:5px 6px;text-align:left}th{background:#1A2B4A;color:#fff}.r{text-align:right}</style></head><body>
              <h1>${e(empresaNombre||"ENEX")} · Cierre de caja</h1><div>${e(cajaDesde)}${cajaHasta&&cajaHasta!==cajaDesde?` a ${e(cajaHasta)}`:""}${cajaUsr?` · ${e(nombreUsr(cajaUsr))}`:""}</div>
              <table><thead><tr><th>Forma de pago</th><th>Moneda</th><th class="r">Entró</th><th class="r">Salió</th><th class="r">Neto</th></tr></thead><tbody>
              ${filasR.map(r=>`<tr><td>${e(ml(r.metodo))}</td><td>${r.moneda}</td><td class="r">${fmtMoney(r.entra,r.moneda)}</td><td class="r">${fmtMoney(r.sale,r.moneda)}</td><td class="r"><b>${fmtMoney(r.entra-r.sale,r.moneda)}</b></td></tr>`).join("")}
              ${Object.entries(porMon).map(([mn,v])=>`<tr><td><b>TOTAL</b></td><td>${mn}</td><td class="r"><b>${fmtMoney(v.entra,mn)}</b></td><td class="r"><b>${fmtMoney(v.sale,mn)}</b></td><td class="r"><b>${fmtMoney(v.entra-v.sale,mn)}</b></td></tr>`).join("")}
              </tbody></table>
              <table><thead><tr><th>Fecha</th><th>Documento</th><th>Quién</th><th>Forma</th><th>Ref.</th><th class="r">Monto</th></tr></thead><tbody>
              ${grupos.map(g=>`<tr><td>${fmtDate(g.fecha)} ${fmtTime(g.fecha)}</td><td>${e(g.id)}</td><td>${e(g.quien)}</td><td>${e(ml(g.metodo))}</td><td>${e(g.ref||"")}</td><td class="r">${fmtMoney(g.monto,g.moneda)}</td></tr>`).join("")}
              </tbody></table><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`);
            w.document.close();
          };
          return(
            <div>
              <div className="card" style={{marginBottom:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {[["Hoy",iso(hoy),iso(hoy)],["Ayer",iso(ayer),iso(ayer)],["Últimos 7 días",iso(hace7),iso(hoy)],["Este mes",iso(mes1),iso(hoy)],["Mes anterior",iso(mesAnt1),iso(mesAntF)]].map(([l,a,b])=>
                  <button key={l} className={cajaDesde===a&&cajaHasta===b?"btn-p":"btn-s"} style={{fontSize:13,padding:"5px 12px"}} onClick={()=>setRango(a,b)}>{l}</button>)}
                <span style={{fontSize:13,color:"var(--t2)",marginLeft:8}}>Desde</span><input className="fi" type="date" style={{width:150,fontSize:13,padding:"4px 6px"}} value={cajaDesde} onChange={e=>setCajaDesde(e.target.value)}/>
                <span style={{fontSize:13,color:"var(--t2)"}}>Hasta</span><input className="fi" type="date" style={{width:150,fontSize:13,padding:"4px 6px"}} value={cajaHasta} onChange={e=>setCajaHasta(e.target.value)}/>
                <select className="fs" style={{width:200,fontSize:13}} value={cajaUsr} onChange={e=>setCajaUsr(e.target.value)}>
                  <option value="">Todos los usuarios</option>{usuarios.map(u=><option key={u} value={u}>{nombreUsr(u)}</option>)}</select>
                <button className="btn-s" style={{fontSize:13,marginLeft:"auto"}} onClick={imprimir}>🖨️ Cierre de caja</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginBottom:10}}>
                {Object.keys(porMon).length===0&&<div className="card" style={{textAlign:"center",color:"var(--t3)"}}>Sin movimientos en este periodo.</div>}
                {Object.entries(porMon).map(([mn,v])=>(
                  <div key={mn} className="card">
                    <div style={{fontSize:13,color:"var(--t3)",fontWeight:700}}>{mn}</div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginTop:4}}><span>Entró</span><b style={{...mono,color:"var(--green)"}}>{fmtMoney(v.entra,mn)}</b></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}><span>Salió</span><b style={{...mono,color:"var(--red)"}}>{fmtMoney(v.sale,mn)}</b></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:16,borderTop:"1px solid var(--b1)",marginTop:4,paddingTop:4}}><span style={{fontWeight:700}}>Neto</span><b style={{...mono,color:"var(--navy)"}}>{fmtMoney(v.entra-v.sale,mn)}</b></div>
                  </div>))}
              </div>
              {filasR.length>0&&(
              <div className="card" style={{padding:0,marginBottom:10}}>
                <table className="ct">
                  <thead><tr><th>Forma de pago</th><th>Moneda</th><th style={{textAlign:"right"}}>Entró</th><th style={{textAlign:"right"}}>Salió</th><th style={{textAlign:"right"}}>Neto</th></tr></thead>
                  <tbody>{filasR.map(r=>(
                    <tr key={r.metodo+r.moneda}>
                      <td style={{fontWeight:600}}>{ml(r.metodo)}</td><td>{r.moneda}</td>
                      <td style={{...mono,textAlign:"right",color:"var(--green)"}}>{fmtMoney(r.entra,r.moneda)}</td>
                      <td style={{...mono,textAlign:"right",color:"var(--red)"}}>{fmtMoney(r.sale,r.moneda)}</td>
                      <td style={{...mono,textAlign:"right",fontWeight:800}}>{fmtMoney(r.entra-r.sale,r.moneda)}</td>
                    </tr>))}</tbody>
                </table>
              </div>)}
              {grupos.length>0&&(
              <div className="card" style={{padding:0}}>
                <table className="ct">
                  <thead><tr><th>Fecha</th><th>Documento</th><th>Quién</th><th>Forma</th><th>Referencia</th><th style={{textAlign:"right"}}>Monto</th><th>Usuario</th><th></th></tr></thead>
                  <tbody>{grupos.map(g=>(
                    <tr key={g.id}>
                      <td style={{...mono,fontSize:13,whiteSpace:"nowrap"}}>{fmtDate(g.fecha)} {fmtTime(g.fecha)}</td>
                      <td style={{...mono,fontSize:13}}>{g.id}</td>
                      <td style={{fontWeight:600,fontSize:13}}>{g.quien}</td>
                      <td style={{fontSize:13}}>{ml(g.metodo)}</td>
                      <td style={{...mono,fontSize:12,color:"var(--t2)"}}>{g.ref||"—"}</td>
                      <td style={{...mono,textAlign:"right",fontWeight:800,color:g.monto<0?"var(--red)":"var(--green)"}}>{fmtMoney(g.monto,g.moneda)}</td>
                      <td style={{fontSize:12}}>{nombreUsr(g.usuario)}</td>
                      <td style={{whiteSpace:"nowrap"}}>
                        {g.pagos[0].reciboId&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",marginRight:4}} title="Recibo" onClick={()=>setReciboVer(g.pagos[0].reciboId)}>🧾</button>}
                        {g.comp&&<a href={g.comp} target="_blank" rel="noreferrer" className="btn-s" style={{fontSize:12,padding:"2px 6px",marginRight:4,textDecoration:"none"}}>📎</a>}
                        {(hasPerm("anular_pago")||hasPerm("cobrar"))&&<button className="btn-s" style={{fontSize:12,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} title="Anular" onClick={()=>pagoAnularGrupo(pagos.filter(p=>!p.anulado&&(g.pagos[0].reciboId?p.reciboId===g.pagos[0].reciboId:p.id===g.id)))}>✕</button>}
                      </td>
                    </tr>))}</tbody>
                </table>
              </div>)}
            </div>
          );
        })()}

        {/* ── POR GUÍA ── */}
        {contabTab==="porguia"&&(()=>{
          const FST={borrador:{l:"Borrador",c:"#7A5C00",bg:"#FFF8E1"},emitida:{l:"Emitida",c:"#1565C0",bg:"#E3F2FD"},pagada_parcial:{l:"Pago parcial",c:"#E65100",bg:"#FFF3E0"},pagada:{l:"Pagada",c:"#2E7D32",bg:"#E8F5E9"}};
          const chipF=f=>{const st=FST[f.status]||{l:f.status,c:"var(--t2)",bg:"var(--bg4)"};return <span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:10,color:st.c,background:st.bg,whiteSpace:"nowrap"}}>{st.l}</span>;};
          const IC={cliente:"👤",agente:"🤝",autonomo:"🧑‍💻"};
          if(!facGuiaSel){
            const q=(facGuiaBuscar||"").trim().toUpperCase();
            const tarjetas=consolList.map(g=>{const {grupos,prepaid}=facGruposGuia(g);return {g,grupos,prepaid};})
              .filter(x=>x.grupos.length>0||x.prepaid.length>0)
              .map(x=>{const r=facGruposGuia(x.g);return {...x,...r,completa:x.grupos.every(gr=>gr.pendientes.length===0&&!gr.facturas.some(f=>f.status==="borrador"))&&r.prepaidSin.length===0&&!r.facPrepaid.some(f=>f.status==="borrador")};});
            const nPend=tarjetas.filter(x=>!x.completa).length, nHist=tarjetas.length-nPend;
            const visibles=tarjetas.filter(x=>facGuiaVista==="historial"?x.completa:!x.completa)
              .filter(x=>!q||String(x.g.id).toUpperCase().includes(q)||x.grupos.some(gr=>String(gr.receptor.snapshot?.nombre||"").toUpperCase().includes(q)))
              .sort((a,b)=>new Date(b.g.fecha||0)-new Date(a.g.fecha||0));
            return (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{display:"flex",gap:4,background:"var(--bg4)",borderRadius:7,padding:3,border:"1px solid var(--b1)"}}>
                    {[{k:"pendientes",l:"⏳ Pendientes",n:nPend},{k:"historial",l:"📜 Historial",n:nHist}].map(t=>(
                      <button key={t.k} onClick={()=>setFacGuiaVista(t.k)} style={{padding:"5px 14px",borderRadius:5,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",gap:6,alignItems:"center",
                        background:facGuiaVista===t.k?"var(--navy)":"transparent",color:facGuiaVista===t.k?"#fff":"var(--t2)"}}>{t.l}
                        <span style={{background:facGuiaVista===t.k?"rgba(255,255,255,.2)":"var(--bg5)",borderRadius:3,padding:"0 6px",fontSize:11,fontWeight:800}}>{t.n}</span></button>
                    ))}
                  </div>
                  <input className="fi" placeholder="Buscar guía o cliente…" value={facGuiaBuscar} onChange={e=>setFacGuiaBuscar(e.target.value)} style={{fontSize:15,padding:"9px 12px",flex:1,minWidth:220}}/>
                </div>
                {visibles.length===0?<div className="card" style={{textAlign:"center",padding:50,color:"var(--t3)"}}>{facGuiaVista==="historial"?"No hay guías completamente facturadas.":"No hay guías con carga por facturar."}</div>:
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
                  {visibles.map(({g,grupos,prepaid,facPrepaid,prepaidSin,faltantes})=>{
                    const wrsTot=grupos.reduce((t,x)=>t+x.wrs.length,0)+prepaid.length;
                    const tot=wrsTot, hechos=wrsTot-grupos.reduce((t,x)=>t+x.pendientes.length,0)-prepaidSin.length;
                    const facs=[...new Map([...grupos.flatMap(x=>x.facturas),...facPrepaid].map(f=>[f.id,f])).values()];
                    const porMon={};facs.forEach(f=>{porMon[f.moneda||"USD"]=(porMon[f.moneda||"USD"]||0)+(f.total||0);});
                    const pct=tot?Math.round(hechos*100/tot):0;
                    const nBor=facs.filter(f=>f.status==="borrador").length;
                    const nSin=grupos.reduce((t,x)=>t+x.pendientes.length,0)+prepaidSin.length;
                    return (
                      <div key={g.id} className="card" onClick={()=>{setFacGuiaSel(g.id);setFacGuiaBuscar("");}} style={{cursor:"pointer",padding:14,border:"1px solid var(--b1)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:18,color:"var(--navy)"}}>{g.id}</span><TypeBadge t={g.tipoEnvio}/>
                        </div>
                        <div style={{fontSize:14,color:"var(--t2)",marginBottom:8}}>📍 {g.destino||"—"} · {fmtDate(g.fecha)}</div>
                        <div style={{height:8,background:"var(--bg4)",borderRadius:4,overflow:"hidden",marginBottom:8}}><div style={{width:`${pct}%`,height:"100%",background:"var(--green)"}}/></div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,flexWrap:"wrap",gap:6}}>
                          <span><b style={{color:hechos===tot?"var(--green)":"var(--orange)"}}>{hechos}</b> / {tot} WR facturados</span>
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{Object.entries(porMon).map(([m,v])=>fmtMoney(v,m)).join(" · ")||"—"}</span>
                        </div>
                        {(nSin>0||nBor>0||faltantes.length>0||prepaid.length>0)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                          {prepaid.length>0&&<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:10,color:"var(--navy)",background:"#EEF3FF",border:"1px solid #B8C8F0"}}>💳 {prepaid.length} PREPAID</span>}
                          {faltantes.length>0&&<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:10,color:"var(--red)",background:"#FEE8E8",border:"1px solid #F0A0A0"}}>⚠️ {faltantes.length} faltante{faltantes.length===1?"":"s"}</span>}
                          {nSin>0&&<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:10,color:"#E65100",background:"#FFF3E0",border:"1px solid #FFCC80"}}>🧾 {nSin} WR sin facturar</span>}
                          {nBor>0&&<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:10,color:"#7A5C00",background:"#FFF8E1",border:"1px solid #FFE082"}}>📤 {nBor} por emitir</span>}
                        </div>}
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          }
          const g=consolList.find(c=>c.id===facGuiaSel);
          if(!g)return <div className="card" style={{padding:30,textAlign:"center"}}><button className="btn-s" onClick={()=>setFacGuiaSel(null)}>← Guías</button></div>;
          const {grupos,prepaid,facPrepaid}=facGruposGuia(g);
          const isAereoG=dnGuiaEsAerea(g);
          const pendTot=grupos.filter(x=>x.pendientes.length>0);
          const puedeFac=hasPerm("crear_factura")||hasPerm("facturar");
          const facturarUno=gr=>{const n=facFromGuia(g,true,gr.key);if(n[0])facOpenEdit(n[0]);};
          return (
            <div>
              <div className="card" style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:12}}>
                <button className="btn-s" onClick={()=>setFacGuiaSel(null)}>← Guías</button>
                <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:20,color:"var(--navy)"}}>{g.id}</span>
                <TypeBadge t={g.tipoEnvio}/><span style={{fontSize:14,color:"var(--t2)"}}>📍 {g.destino||"—"}</span>
                <span style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
                  {puedeFac&&pendTot.length>0&&<button className="btn-p" onClick={()=>{const n=facFromGuia(g,true);if(n.length)window.alert(`✅ ${n.length} factura(s) en borrador.`);}}>⚡ Facturar todo lo pendiente ({pendTot.length})</button>}
                  {(()=>{const bor=grupos.flatMap(x=>x.facturas.filter(f=>f.status==="borrador"));
                    return bor.length>0&&(puedeFac||hasPerm("editar_factura"))&&<button className="btn-p" style={{background:"#1565C0",borderColor:"#1565C0"}} onClick={()=>facEmitirVarios(bor)}>📤 Emitir todo ({bor.length})</button>;})()}
                </span>
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <table className="ct" style={{width:"100%",fontSize:14}}>
                  <thead><tr><th>Receptor</th><th style={{textAlign:"right"}}>WR</th><th style={{textAlign:"right"}}>A cobrar</th><th>Tarifa</th><th style={{textAlign:"right"}}>Importe</th><th>Factura</th><th style={{width:240}}></th></tr></thead>
                  <tbody>
                    {grupos.map(gr=>{
                      const r=gr.receptor;
                      const est=gr.pendientes.length?facConstruir(g,r,gr.pendientes):null;
                      const tf=tarifaParaWR(gr.wrs[0],g.tipoEnvio,{tipo:r.tipo,id:r.id});
                      const uC=unidadTarifa(tf,isAereoG), uniG=UNI_LBL[uC];
                      const cobrar=gr.wrs.reduce((t,w)=>t+wrPesoFacturable(w,isAereoG,uC).valor,0);
                      return (
                        <tr key={gr.key} style={{verticalAlign:"top"}}>
                          <td><div style={{fontWeight:700}}>{IC[r.tipo]||"•"} {r.snapshot?.nombre||"—"}</div>
                            <div style={{fontSize:12,color:"var(--t3)"}}>{r.tipo==="cliente"?(r.snapshot?.casillero?`#${r.snapshot.casillero}`:"Cliente"):r.tipo==="agente"?"Agente":"Autónomo"}</div></td>
                          <td style={{textAlign:"right",fontWeight:700}}>{gr.wrs.length}</td>
                          <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{r2(cobrar)} {uniG}</td>
                          <td>{tf?<span style={{fontSize:13}}>{tf._especial&&<b style={{color:"#E65100"}}>⭐ </b>}{fmtMoney(isAereoG?tf.porLb:tf.porFt3,tf.moneda)}/{uniG}<div style={{fontSize:11,color:"var(--t3)"}}>{tf._especial?"Especial":"Predeterminada"} · mín. {fmtMoney(tf.min,tf.moneda)}</div></span>
                            :<span style={{fontSize:13,color:"var(--red)",fontWeight:700}}>Sin tarifa</span>}</td>
                          <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:800}}>
                            {gr.facturas.map(f=><div key={f.id}>{fmtMoney(f.total,f.moneda)}</div>)}
                            {est&&<div style={{color:"var(--t3)",fontWeight:600}} title="Estimado de lo pendiente">≈ {fmtMoney(est.total,est.moneda)}</div>}
                          </td>
                          <td>{gr.facturas.map(f=><div key={f.id} style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                                <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{f.id}</span>{chipF(f)}</div>)}
                              {gr.pendientes.length>0&&<span style={{fontSize:12,fontWeight:700,color:"var(--orange)"}}>{gr.pendientes.length} WR sin facturar</span>}</td>
                          <td><div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                            {gr.pendientes.length>0&&puedeFac&&<button className="btn-p" style={{fontSize:13,padding:"5px 12px"}} onClick={()=>facturarUno(gr)}>🧾 Facturar</button>}
                            {gr.facturas.filter(f=>f.status==="borrador").map(f=><Fragment key={f.id}>
                              <button className="btn-s" style={{fontSize:13,padding:"5px 10px"}} onClick={()=>facOpenEdit(f)}>✏️ Revisar</button>
                              <button className="btn-p" style={{fontSize:13,padding:"5px 10px",background:"#1565C0",borderColor:"#1565C0"}} onClick={()=>facEmitirRapido(f)}>📤 Emitir</button>
                            </Fragment>)}
                            {gr.facturas.filter(f=>f.status==="emitida"&&(hasPerm("editar_factura")||hasPerm("facturar"))).map(f=><button key={"e"+f.id} className="btn-s" style={{fontSize:13,padding:"5px 10px"}} onClick={()=>facOpenEdit(f)}>✏️ Editar</button>)}
                            {gr.facturas.filter(f=>f.status!=="borrador").map(f=><button key={f.id} className="btn-s" style={{fontSize:13,padding:"5px 10px"}} onClick={()=>setFacPrint(f)}>🖨️ Ver</button>)}
                          </div></td>
                        </tr>
                      );
                    })}
                    {grupos.length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay WR por facturar en esta guía.</td></tr>}
                  </tbody>
                </table>
              </div>
              {prepaid.length>0&&(
                <div className="card" style={{padding:0,overflow:"hidden",marginTop:12}}>
                  <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontSize:15,fontWeight:700,color:"var(--navy)"}}>💳 PREPAID ({prepaid.length})</div>
                  <table className="ct">
                    <thead><tr><th>WR</th><th>Consignatario</th><th>Paga</th><th>Factura</th><th>Total</th><th>Estado</th><th></th></tr></thead>
                    <tbody>{prepaid.map(w=>{const f=facPrepaid.find(x=>x.wrIds.includes(w.id));return(
                      <tr key={w.id}>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{w.id}</td>
                        <td style={{fontSize:13}}>{w.consignee||"—"}{w.casillero?<span style={{color:"var(--gold2)",marginLeft:6,fontFamily:"'DM Mono',monospace"}}>#{w.casillero}</span>:null}</td>
                        <td style={{fontSize:13}}>{f?.receptorNombre||w.shipper||"—"}</td>
                        <td style={{fontFamily:"'DM Mono',monospace"}}>{f?.id||"—"}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{f?fmtMoney(f.total,f.moneda):"—"}</td>
                        <td>{f?chipF(f):<span style={{fontSize:12,fontWeight:700,color:"#E65100"}}>Sin facturar</span>}</td>
                        <td style={{whiteSpace:"nowrap"}}>{f?<button className="btn-s" style={{fontSize:12,padding:"3px 6px"}} onClick={()=>setFacPrint(f)}>🖨️</button>
                          :puedeFac&&<button className="btn-p" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>{if(!w.tipoEnvio){window.alert("Asigna primero el tipo de envío del WR.");return;}facOpenNew(facConstruirWR(w));}}>💰 Facturar</button>}</td>
                      </tr>);})}</tbody>
                  </table>
                </div>)}
            </div>
          );
        })()}

        {/* ── REPORTE ── */}
        {contabTab==="reporte"&&(()=>{
          // Reporte 1: por mes (separado por moneda)
          const porMes={};
          facsActivas.filter(f=>f.tipo!=="nota_credito").forEach(f=>{
            const k=fmtDate(f.fecha).slice(3); // MM/YYYY
            const mon=f.moneda||"USD";
            const id=`${k}__${mon}`;
            if(!porMes[id])porMes[id]={mes:k,moneda:mon,facturas:0,total:0,pagado:0,saldo:0};
            porMes[id].facturas++;
            porMes[id].total+=parseFloat(f.total)||0;
            porMes[id].pagado+=parseFloat(f.pagado)||0;
            porMes[id].saldo+=parseFloat(f.saldo)||0;
          });
          const meses=Object.values(porMes).sort((a,b)=>(b.mes+b.moneda).localeCompare(a.mes+a.moneda));
          // Reporte 2: por receptor (deudores)
          const porReceptor={};
          facsActivas.filter(f=>(f.status==="emitida"||f.status==="pagada_parcial")&&f.tipo!=="nota_credito").forEach(f=>{
            const key=`${f.receptorTipo}__${f.receptorId||f.receptorNombre}__${f.moneda}`;
            if(!porReceptor[key])porReceptor[key]={tipo:f.receptorTipo,nombre:f.receptorNombre||"—",casillero:f.receptorCasillero||"",moneda:f.moneda||"USD",facturas:0,total:0,pagado:0,saldo:0};
            porReceptor[key].facturas++;
            porReceptor[key].total+=parseFloat(f.total)||0;
            porReceptor[key].pagado+=parseFloat(f.pagado)||0;
            porReceptor[key].saldo+=parseFloat(f.saldo)||0;
          });
          const deudores=Object.values(porReceptor).sort((a,b)=>b.saldo-a.saldo);
          return (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="card" style={{padding:0}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)"}}>📊 Ingresos por Período (separado por moneda)</div>
                {meses.length===0?<div style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay datos para reportar aún.</div>:(
                  <table className="ct">
                    <thead><tr><th>Período</th><th>Mon</th><th>Facturas</th><th>Total Facturado</th><th>Pagado</th><th>Saldo</th><th>% Cobrado</th></tr></thead>
                    <tbody>
                      {meses.map(m=>{
                        const pct=m.total>0?Math.round((m.pagado/m.total)*100):0;
                        return(
                          <tr key={m.mes+"_"+m.moneda}>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{m.mes}</td>
                            <td style={{textAlign:"center",fontWeight:700}}>{m.moneda}</td>
                            <td style={{textAlign:"center",fontWeight:700}}>{m.facturas}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{fmtMoney(m.total,m.moneda)}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>{fmtMoney(m.pagado,m.moneda)}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--orange)"}}>{fmtMoney(m.saldo,m.moneda)}</td>
                            <td>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <div style={{flex:1,height:8,background:"var(--bg4)",borderRadius:4,overflow:"hidden"}}>
                                  <div style={{height:"100%",background:"var(--green)",width:`${pct}%`,borderRadius:4}}/>
                                </div>
                                <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,color:"var(--green)",minWidth:36}}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="card" style={{padding:0}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)"}}>👥 Quién debe cuánto</div>
                {deudores.length===0?<div style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay deudores. ✅</div>:(
                  <table className="ct">
                    <thead><tr><th>Tipo</th><th>Receptor</th><th>Mon</th><th>Facturas</th><th>Total</th><th>Pagado</th><th>Saldo</th></tr></thead>
                    <tbody>
                      {deudores.map((d,i)=>(
                        <tr key={i}>
                          <td style={{fontSize:13,fontWeight:700,color:"var(--purple)"}}>{(REC_TYPES.find(r=>r.k===d.tipo)||{l:d.tipo}).l}</td>
                          <td style={{fontWeight:600}}>{d.nombre}<div style={{fontSize:12,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{d.casillero||""}</div></td>
                          <td style={{textAlign:"center",fontWeight:700}}>{d.moneda}</td>
                          <td style={{textAlign:"center",fontWeight:700}}>{d.facturas}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{fmtMoney(d.total,d.moneda)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>{fmtMoney(d.pagado,d.moneda)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--orange)"}}>{fmtMoney(d.saldo,d.moneda)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // ── REEMPAQUE ───────────────────────────────────────────────────────────────
  // El flujo de Reempaque abre el WR Modal estándar con `reempaqueDe` preseteado:
  // al guardar el WR nuevo, se marcan automáticamente los padres como REEMPACADO (2.3).
  // Solo el WR nuevo factura; los padres quedan fuera del estado de cuenta.
  // Bloque F — Solo se puede reempacar WR cuyo status sea ≤ Confirmado (1, 2 o 3).
  // Cualquier estado superior (4+) o el propio 2.3 (ya reempacado) queda bloqueado.
  const REEMPAQUE_ALLOWED_CODES=["1","2","3"];
  const puedeReempacarse=(w)=>REEMPAQUE_ALLOWED_CODES.includes(w?.status?.code||"1");
  // Reglas de bloqueo del WR — Reempacado (2.3), Egresado (25) y todo lo que esté
  // en Consolidado (4) o posterior queda FIJO: no se edita, no se confirma tipo,
  // no se reempaqueta y no se egresa. Solo es modificable cuando el código es 1, 2 o 3.
  // El permiso "saltar_bloqueos" solo se aplica en acciones sobre un WR concreto
  // (detalle del WR), nunca en listas ni tablas.
  const wrEsModificable=(w)=>["1","2","3"].includes(w?.status?.code||"");
  // Tipo de envío fijo para todos (incluso con "saltar bloqueos"): ya en entrega, entregado, cobrado,
  // egresado, faltante o con factura activa
  const wrTipoFijo=(w)=>["2.3","18","18.1","18.2","18.3","20","20.1","20.2","21","22","23","25"].includes(w?.status?.code||"")
    ||facturas.some(f=>f.status!=="anulada"&&f.tipo!=="nota_credito"&&Array.isArray(f.wrIds)&&f.wrIds.includes(w?.id));
  // Un WR no puede facturarse si está Reempacado (2.3 — es fantasma, la mercancía
  // está en el WR hijo) ni si ya fue Egresado (25 — debió facturarse antes del despacho).
  // El resto de los estados sí pueden facturarse (PREPAID en origen, COD tras recepción).
  // No se facturan: reempacados, egresados ni faltantes (faltante, investigación, indemnizado, pérdida)
  const wrPuedeFacturarse=(w)=>!["2.3","25","18","18.1","18.2","18.3"].includes(w?.status?.code||"");
  // Un WR puede consolidarse SOLO si está en estado 3 Confirmado. Reempacado (2.3) y
  // Egresado (25) salieron del flujo; estados pre-Confirmado no están listos.
  const wrPuedeConsolidarse=(w)=>w?.status?.code==="3";

  // ── TIMELINE DE HITOS DEL WR ─────────────────────────────────────────────────
  // Construye la línea de tiempo según el camino del WR:
  //   • Reempacado (2.3) → terminal en Reempacado (muestra reempacadoEn)
  //   • Egresado (25)    → terminal en Despachado
  //   • Normal           → flujo completo (Registrado → Confirmado → Consolidado → Recibido
  //                        → Por Entrega → Entregado → Cobrado)
  // Confirmado se marca como alcanzado solo si tipoEnvio está seteado AHORA (no por historia).
  // Consolidado hace fallback a consolList si no hay entrada "4" en historial.
  // Cobrado hace fallback a facturas pagadas si no hay entrada "23" en historial.
  const getWRTimeline=(w)=>{
    // Retorna { lineal, especial }:
    //   - lineal: array de 7 hitos SIEMPRE en el mismo orden (Registrado,
    //     Confirmado, Consolidado, Recibido, Por Entrega, Entregado, Cobrado).
    //     Cada hito tiene reached:bool y fecha:Date|null. Hitos no alcanzados
    //     se ven en estado "pendiente". El timeline lineal es idéntico en
    //     estructura para todos los WRs — no hay ramas que rompan la lectura.
    //   - especial: hito único (Reempacado o Egresado) o null. Se renderiza
    //     en una sección APARTE para que el evento de rama (que puede o no
    //     pasar por el flujo normal) no se confunda con la secuencia lineal.
    if(!w)return {lineal:[],especial:null};
    const hist=Array.isArray(w.historial)?w.historial:[];
    const findFirst=(codes)=>hist.find(h=>codes.includes(String(h.code)));
    const findLast =(codes)=>[...hist].reverse().find(h=>codes.includes(String(h.code)));
    const code=w.status?.code||"1";
    const esReempacado=code==="2.3"||!!w.reempacadoEn;
    const esEgresado=code==="25";
    const tieneTipo=!!(w.tipoEnvio&&String(w.tipoEnvio).trim());
    const guiaConsol=consolList.find(c=>{
      if(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))return true;
      // Fallback: containers[].wr[].id
      return (c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id));
    });

    // ─────────────────────────────────────────────────────────────────────
    // Estados que SOLO pueden alcanzarse habiendo pasado por Confirmación.
    // OJO: 25 (Egresado) y 2.3 (Reempacado) NO están aquí — son ramas
    // terminales que pueden ocurrir desde 1/2 sin confirmar nunca el tipo
    // de envío (egreso en origen, reempaque de mercancía sin enviar).
    // ─────────────────────────────────────────────────────────────────────
    // Lista alineada con WR_STATUSES actual: sin "9.1", "10.1", "10.2",
    // "12C", "12P" (códigos retirados del modelo).
    const STATES_REQUIRE_CONFIRM=["4","5","6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"];

    // Helper: construye un hito "alcanzado por estado actual o evento
    // posterior". La fecha solo se usa cuando proviene del evento literal
    // del propio hito o de una fuente externa autoritativa (guía / nota /
    // factura). NUNCA se infiere de la fecha de un evento posterior — eso
    // hace que dos hitos distintos terminen con la misma fecha y miente
    // al usuario. Si no hay fecha exacta ni fuente autoritativa, el hito
    // queda alcanzado pero sin fecha (la UI mostrará "fecha no registrada").
    const buildHito=(literal, posteriores, fuenteFecha=null, fuenteNota="")=>{
      const lit=findFirst([literal]);
      const codeImplica=(code===literal)||posteriores.includes(code);
      const histImplica=hist.some(h=>posteriores.includes(String(h.code)));
      const reached=!!lit||codeImplica||histImplica;
      if(!reached)return {reached:false,fecha:null,fechaAprox:false,user:"",nota:""};
      if(lit)return {reached:true,fecha:lit.fecha,fechaAprox:false,user:lit.user||"",nota:lit.nota||""};
      if(fuenteFecha)return {reached:true,fecha:fuenteFecha,fechaAprox:true,user:"",nota:fuenteNota};
      return {reached:true,fecha:null,fechaAprox:false,user:"",nota:""};
    };

    const lineal=[];

    // ─────────────────────────────────────────────────────────────────────
    // 1) Registrado — siempre
    // ─────────────────────────────────────────────────────────────────────
    lineal.push({
      key:"registrado", label:"Registrado", ic:"📦", color:"var(--navy)",
      fecha:w.fecha, user:w.usuario||"", nota:`WR creado · ${w.id}`,
      extra:w.tipoPago?`💳 ${w.tipoPago}`:null,
      reached:!!w.fecha,
    });

    // ─────────────────────────────────────────────────────────────────────
    // 2) Confirmado — alcanzado SOLO con evidencia real:
    //    (a) evento "3" en historial, o
    //    (b) tipoEnvio asignado actualmente, o
    //    (c) estado actual / evento histórico que requiere haber pasado
    //        por confirmación (lista STATES_REQUIRE_CONFIRM — sin 25/2.3), o
    //    (d) WR incluido en una guía consolidada (implica confirmación).
    //
    //    Si no hay evidencia (p.ej. WR reempacado/egresado que nunca se
    //    confirmó), el hito se muestra en "pendiente". El timeline lineal
    //    siempre tiene los mismos 7 hitos, en el mismo orden, para todos
    //    los WRs — los estados rama (Reempacado/Egresado) viven en la
    //    sección "especial" separada y no rompen esta secuencia.
    // ─────────────────────────────────────────────────────────────────────
    // Detectar última confirmación VIGENTE (no revertida).
    // Una confirmación se considera revertida cuando después del evento "3"
    // aparece en historial un evento con code "1" o "2" (estado de origen),
    // que es lo que hace `revertirConfirmacion` / blanqueo de tipo: empuja al
    // WR al estado previo y agrega esa entrada al historial. En ese caso el
    // evento "3" queda en el log como auditoría, pero no representa una
    // confirmación vigente — el timeline no debe contarla.
    const confEntry=findLast(["3"]);
    let confEffective=confEntry;
    if(confEntry){
      const idx=hist.lastIndexOf(confEntry);
      const revertido=hist.slice(idx+1).some(h=>["1","2"].includes(String(h.code)));
      if(revertido)confEffective=null;
    }
    const codeImplicaConfirm=STATES_REQUIRE_CONFIRM.includes(code);
    const histImplicaConfirm=hist.some(h=>STATES_REQUIRE_CONFIRM.includes(String(h.code)));
    const pasoConfirmacion=!!confEffective||tieneTipo||codeImplicaConfirm||histImplicaConfirm||!!guiaConsol;
    const tipoEnvioMostrar=w.tipoEnvio||guiaConsol?.tipoEnvio||"";
    lineal.push({
      key:"confirmado", label:"Confirmado", ic:"✅", color:"var(--green)",
      fecha:confEffective?.fecha||null, fechaAprox:false,
      user:confEffective?.user||"",
      nota:confEffective?.nota||(pasoConfirmacion&&!confEffective?"(fecha exacta no registrada)":""),
      extra:pasoConfirmacion&&tipoEnvioMostrar?`✈️ Tipo de envío: ${tipoEnvioMostrar}${!w.tipoEnvio&&guiaConsol?` (de guía ${guiaConsol.id})`:""}`:null,
      reached:pasoConfirmacion,
    });

    // ─────────────────────────────────────────────────────────────────────
    // 3) Flujo normal: Consolidado → Recibido → Por Entrega → Entregado → Cobrado.
    //    Cada hito queda alcanzado solo con evidencia real (evento literal,
    //    estado actual posterior, evento posterior en historial, o fuente
    //    externa autoritativa). La fecha es exacta solo si proviene del
    //    evento literal del propio hito o de una fuente autoritativa
    //    (guía / nota de entrega / factura) — nunca se infiere de la
    //    fecha de un evento posterior. Si un WR salió temprano del flujo,
    //    los hitos posteriores quedan en "pendiente" sin inventar nada.
    // ─────────────────────────────────────────────────────────────────────

    // 3.a) Consolidado (4) — posteriores: 5..16, 17..23.
    //      Fuente externa autoritativa: fecha de creación de la guía
    //      consolidada (cuando el WR está incluido en una y no hay
    //      evento "4" registrado).
    const POST_CONSOLIDADO=["5","6","6.2","7","8","9","10","11","12","13","14","15","16","17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"];
    const hCons=buildHito("4",POST_CONSOLIDADO,guiaConsol?.fecha||null,guiaConsol?`(según fecha de guía ${guiaConsol.id})`:"");
    lineal.push({
      key:"consolidado", label:"Consolidado", ic:"🗂️", color:"var(--cyan)",
      fecha:hCons.fecha, fechaAprox:hCons.fechaAprox,
      user:hCons.user,
      nota:hCons.nota||(hCons.reached&&!hCons.fecha?"(fecha exacta no registrada)":""),
      extra:guiaConsol?`📋 Guía: ${guiaConsol.id} · ${guiaConsol.destino||""}`:null,
      reached:hCons.reached,
    });

    // 3.b) Recibido en Almacén (17) — posteriores: 18, 18.1, 19, 20, 21, 22, 23.
    //      Sin fuente externa autoritativa: si no hay evento "17", la
    //      fecha queda no registrada (no inferimos del evento posterior).
    const POST_ALMACEN=["18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23"];
    const hRec=buildHito("17",POST_ALMACEN);
    lineal.push({
      key:"recibido", label:"Recibido en Almacén", ic:"📥", color:"var(--purple)",
      fecha:hRec.fecha, fechaAprox:hRec.fechaAprox,
      user:hRec.user,
      nota:hRec.nota||(hRec.reached&&!hRec.fecha?"(fecha exacta no registrada)":""),
      reached:hRec.reached,
    });

    // 3.c) Por Entrega (20) — posteriores: 21, 22, 23. Sin fuente externa.
    const POST_PORENTREGA=["20.1","20.2","21","22","23"];
    const hPE=buildHito("20",POST_PORENTREGA);
    lineal.push({
      key:"porentrega", label:"Por Entrega", ic:"🚚", color:"var(--sky)",
      fecha:hPE.fecha, fechaAprox:hPE.fechaAprox,
      user:hPE.user,
      nota:hPE.nota||(hPE.reached&&!hPE.fecha?"(fecha exacta no registrada)":""),
      reached:hPE.reached,
    });

    // 3.d) Entregado (21) — posteriores: 22, 23. Fuente externa
    //      autoritativa: nota de entrega no anulada vinculada al WR.
    const POST_ENTREGADO=["22","23"];
    const dnRel=deliveryNotes.find(n=>!n.anulado&&Array.isArray(n.wrIds)&&n.wrIds.includes(w.id));
    const hEnt=buildHito("21",POST_ENTREGADO,dnRel?.fecha||null,dnRel?`(según nota ${dnRel.id})`:"");
    const entReached=hEnt.reached||!!dnRel;
    lineal.push({
      key:"entregado", label:"Entregado", ic:"📝", color:"var(--green)",
      fecha:hEnt.fecha, fechaAprox:hEnt.fechaAprox,
      user:hEnt.user,
      nota:hEnt.nota||(entReached&&!hEnt.fecha?"(fecha exacta no registrada)":""),
      extra:dnRel?`📋 Nota ${dnRel.id} → ${dnRel.receptorNombre||dnRel.consignatario||""}`:null,
      reached:entReached,
    });

    // 3.e) Cobrado (23) — fuente externa autoritativa: factura pagada
    //      vinculada al WR (fechaEmision como aproximación si no hay
    //      evento "23" explícito).
    const cobradoEntry=findFirst(["23"]);
    const facPagada=facturas.find(f=>f.status==="pagada"&&Array.isArray(f.wrIds)&&f.wrIds.includes(w.id));
    const cobradoReached=!!cobradoEntry||!!facPagada;
    const cobradoFecha=cobradoEntry?.fecha||facPagada?.fechaEmision||facPagada?.fecha||null;
    lineal.push({
      key:"cobrado", label:"Cobrado", ic:"💰", color:"var(--gold2)",
      fecha:cobradoFecha, fechaAprox:!cobradoEntry&&!!facPagada,
      user:cobradoEntry?.user||"",
      nota:cobradoEntry?.nota||(!cobradoEntry&&facPagada?`(según factura ${facPagada.id})`:(cobradoReached&&!cobradoFecha?"(fecha exacta no registrada)":"")),
      extra:facPagada?`📋 Factura ${facPagada.id} · ${facPagada.moneda} ${(parseFloat(facPagada.total)||0).toFixed(2)}`:null,
      reached:cobradoReached,
    });

    // ─────────────────────────────────────────────────────────────────────
    // 4) Sección especial — Reempacado o Egresado. Estados rama que
    //    NO forman parte del flujo lineal: se renderizan en un bloque
    //    APARTE para no romper la secuencia normal. Un WR puede haber
    //    pasado por todo el flujo (Recibido, Por Entrega…) y luego
    //    ser egresado: ambas cosas se ven al mismo tiempo, sin que el
    //    evento rama interfiera con el seguimiento lineal.
    // ─────────────────────────────────────────────────────────────────────
    let especial=null;
    if(esReempacado){
      const reempEntry=findFirst(["2.3"]);
      especial={
        key:"reempacado", label:"Reempacado", ic:"🔁", color:"var(--purple)",
        fecha:reempEntry?.fecha||null, user:reempEntry?.user||"", nota:reempEntry?.nota||"",
        extra:w.reempacadoEn?`📦 Reempacado en: ${w.reempacadoEn}`:null,
        reached:true, terminal:true,
        seccionTitulo:"🔁 Estado especial · Reempacado",
      };
    }else if(esEgresado){
      const egresEntry=findFirst(["25"]);
      const cr=(cargoReleases||[]).find(c=>!c.anulado&&Array.isArray(c.wrIds)&&c.wrIds.includes(w.id));
      especial={
        key:"despachado", label:"Despachado (Egresado)", ic:"🚀", color:"var(--orange)",
        fecha:egresEntry?.fecha||cr?.fecha||null, user:egresEntry?.user||cr?.usuario||"", nota:egresEntry?.nota||"",
        extra:cr?`📋 Egreso ${cr.id} → ${cr.agenteCarga||"agente"}`:null,
        reached:true, terminal:true,
        seccionTitulo:"🚀 Estado especial · Egresado (Cargo Release)",
      };
    }
    return {lineal,especial};
  };

  // Render una timeline visual (lista vertical) — usada en WR Modal y en timeline modal rápido.
  // Estructura:
  //   • Bloque LINEAL (7 hitos siempre, en el mismo orden, marcando alcanzado/pendiente).
  //   • Bloque ESPECIAL aparte (solo si el WR es Reempacado o Egresado) — visualmente
  //     separado con borde y título para no romper la lectura del flujo lineal.
  const renderWRTimeline=(w)=>{
    // Historia completa: cada cambio de estado con su fecha y hora, en orden.
    if(!w)return null;
    const hist=(Array.isArray(w.historial)?w.historial:[]).filter(h=>h&&h.code);
    const eventos=[...hist];
    if(!hist.some(h=>String(h.code)==="1")&&w.fecha){
      eventos.push({code:"1",label:"Recibido",fecha:w.fecha,user:w.usuario||"",nota:`WR creado · ${w.id}`});
    }
    eventos.sort((x,y)=>new Date(x.fecha||0)-new Date(y.fecha||0));
    const nombreUsuario=id=>{
      if(!id)return "";
      const u=clients.find(c=>c.id===id);
      return u?fullName(u):id;
    };
    if(eventos.length===0)return <div style={{fontSize:14,color:"var(--t3)"}}>—</div>;
    const fila=(h,actual,k)=>{
      const st=getStatus(String(h.code))||{label:h.label||h.code,cls:"s1"};
      return (
        <tr key={k} style={{borderBottom:"1px solid var(--b2)",background:actual?"var(--bg4)":"transparent"}}>
          <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:600,whiteSpace:"nowrap"}}>{h.fecha?fmtDate(h.fecha):"—"}</td>
          <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",color:"var(--t2)",whiteSpace:"nowrap"}}>{h.fecha?fmtTime(h.fecha):"—"}</td>
          <td style={{padding:"7px 8px",whiteSpace:"nowrap"}}><StBadge st={{...st,label:h.label||st.label}}/></td>
          <td style={{padding:"7px 8px",color:"var(--t2)",whiteSpace:"nowrap"}}>{nombreUsuario(h.user)||"—"}</td>
          <td style={{padding:"7px 8px",color:"var(--t2)"}}>{h.nota||""}</td>
        </tr>
      );
    };
    const cabecera=(
      <thead>
        <tr style={{borderBottom:"2px solid var(--navy)"}}>
          {["Fecha","Hora","Estado","Usuario","Nota"].map(h=>(
            <th key={h} style={{textAlign:"left",padding:"6px 8px",fontSize:12,fontWeight:700,color:"var(--navy)",textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr>
      </thead>
    );
    const anteriores=eventos.slice(0,-3);
    const recientes=eventos.slice(-3);
    return (
      <div style={{overflowX:"auto"}}>
        {anteriores.length>0&&(
          <details style={{marginBottom:6}}>
            <summary style={{cursor:"pointer",fontSize:13,fontWeight:600,color:"var(--navy)",padding:"4px 0"}}>Ver {anteriores.length} {anteriores.length===1?"cambio anterior":"cambios anteriores"}</summary>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,marginTop:4}}>
              {cabecera}
              <tbody>{anteriores.map((h,i)=>fila(h,false,"a"+i))}</tbody>
            </table>
          </details>
        )}
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          {cabecera}
          <tbody>{recientes.map((h,i)=>fila(h,i===recientes.length-1,"r"+i))}</tbody>
        </table>
      </div>
    );
  };
  const openWRModalAsReempaque=(parentIds,clientePrefill)=>{
    if(!hasPerm("crear_reempaque")){window.alert("Tu rol no tiene permiso para crear reempaques.");return;}
    if(!parentIds||parentIds.length===0){window.alert("Selecciona al menos un WR para reempacar.");return;}
    // Validación final: si algún WR ya pasó de Confirmado, abortar
    const bloqueados=wrList.filter(w=>parentIds.includes(w.id)&&!puedeReempacarse(w));
    if(bloqueados.length>0){
      window.alert(`No se puede reempacar — los siguientes WR ya superaron el estado Confirmado:\n${bloqueados.map(w=>`• ${w.id} (${w.status?.label})`).join("\n")}`);
      return;
    }
    const c=clientePrefill||null;
    setWrf({...emptyWRF(PAY_TYPES[0]),
      consignee:c?fullName(c):"",
      casilleroSearch:c?c.casillero:"",
      casillero:c?c.casillero:"",
      clienteId:c?c.id:"",
      reempaqueDe:[...parentIds],
      notas:`Reempaque de: ${parentIds.join(", ")}`,
    });
    setEditWR(null);
    setShowNewWR(true);
  };
  const createReempaque=()=>{
    openWRModalAsReempaque(rpqSel,null);
  };
  // Nuevo WR prellenado con un cliente (desde Estado de Cuenta)
  const openWRModalForClient=(c)=>{
    if(!hasPerm("crear_wr")){window.alert("Tu rol no tiene permiso para crear WR.");return;}
    setWrf({...emptyWRF(PAY_TYPES[0]),
      consignee:fullName(c),
      casilleroSearch:c.casillero||"",
      casillero:c.casillero||"",
      clienteId:c.id,
    });
    setEditWR(null);
    setShowNewWR(true);
  };
  const renderReempaque=()=>{
    // Candidatos: WR con status ≤ Confirmado (1, 2 o 3). Estados superiores se bloquean.
    const q=(rpqSearch||"").toLowerCase().trim();
    const candidatos=wrList.filter(w=>{
      if(!puedeReempacarse(w))return false;
      if(!q)return true;
      return [w.id,w.consignee,w.casillero,trkAll(w),w.descripcion].some(v=>String(v||"").toLowerCase().includes(q));
    });
    // Histórico filtrado por cliente y rango de fechas (oculto por defecto)
    const qCli=(rpqHistCliente||"").toLowerCase().trim();
    const dDesde=rpqHistDesde?new Date(rpqHistDesde+"T00:00:00"):null;
    const dHasta=rpqHistHasta?new Date(rpqHistHasta+"T23:59:59"):null;
    const yaReempacados=wrList.filter(w=>{
      if(w.status?.code!=="2.3")return false;
      if(qCli){
        const hit=[w.consignee,w.casillero,w.id].some(v=>String(v||"").toLowerCase().includes(qCli));
        if(!hit)return false;
      }
      if(dDesde||dHasta){
        const f=w.fecha?new Date(w.fecha):null;
        if(!f)return false;
        if(dDesde&&f<dDesde)return false;
        if(dHasta&&f>dHasta)return false;
      }
      return true;
    });
    const toggleSel=(id)=>setRpqSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    return (
      <div className="page-scroll">
        <div className="card" style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:10}}>
            <div style={{fontSize:17,fontWeight:700,color:"var(--navy)"}}>🔁 Reempaque de WR</div>
            <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
              <input className="fi" placeholder="Buscar WR, consignatario, tracking…" value={rpqSearch} onChange={e=>setRpqSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:260}}/>
              <span style={{fontSize:13,color:"var(--t2)",fontWeight:600}}>Seleccionados: {rpqSel.length}</span>
              {hasPerm("crear_reempaque")&&<button className="btn-p" disabled={rpqSel.length===0} style={{opacity:rpqSel.length===0?.5:1}} onClick={createReempaque}>+ Crear Reempaque ({wrNumPrev})</button>}
            </div>
          </div>
          <div style={{maxHeight:"50vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
            <table className="wt">
              <thead><tr>
                <th style={{width:40}}></th>
                <th>N° WR</th><th>Fecha</th><th>Consignatario</th><th>Casillero</th>
                <th>Tracking</th><th>Descripción</th><th>Estado</th><th style={{textAlign:"right"}}>Cajas</th>
              </tr></thead>
              <tbody>
                {candidatos.length===0
                  ?<tr><td colSpan={9} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay WR disponibles para reempacar.</td></tr>
                  :candidatos.map(w=>(
                    <tr key={w.id} className={rpqSel.includes(w.id)?"sel":""} onClick={()=>toggleSel(w.id)} style={{cursor:"pointer"}}>
                      <td style={{textAlign:"center"}}><input type="checkbox" checked={rpqSel.includes(w.id)} onChange={()=>toggleSel(w.id)}/></td>
                      <td><span className="c-wr">{w.id}</span></td>
                      <td><span className="c-dt">{fmtDate(w.fecha)}</span></td>
                      <td><span className="c-name">{w.consignee||"—"}</span></td>
                      <td><span className="c-cas">{w.casillero||"—"}</span></td>
                      <td><span className="c-trk">{w.tracking||"—"}</span></td>
                      <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                      <td><StBadge st={w.status}/></td>
                      <td style={{textAlign:"right",fontWeight:700}}>{w.cajas||0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Histórico de Reempaques — oculto por defecto, filtros por cliente y fecha */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:rpqHistOpen?10:0}}>
            <button
              onClick={()=>setRpqHistOpen(p=>!p)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--navy)",padding:0}}>
              {rpqHistOpen?"▼":"▶"} 📜 Histórico de Reempaques
            </button>
            <span style={{fontSize:12,color:"var(--t3)"}}>
              {rpqHistOpen?`${yaReempacados.length} resultado${yaReempacados.length===1?"":"s"}`:""}
            </span>
            {rpqHistOpen&&(
              <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <input className="fi" placeholder="Cliente, casillero o N° WR…" value={rpqHistCliente} onChange={e=>setRpqHistCliente(e.target.value)} style={{fontSize:13,padding:"5px 8px",width:200}}/>
                <label style={{fontSize:11,color:"var(--t3)",fontWeight:600}}>Desde</label>
                <input type="date" className="fi" value={rpqHistDesde} onChange={e=>setRpqHistDesde(e.target.value)} style={{fontSize:13,padding:"5px 8px"}}/>
                <label style={{fontSize:11,color:"var(--t3)",fontWeight:600}}>Hasta</label>
                <input type="date" className="fi" value={rpqHistHasta} onChange={e=>setRpqHistHasta(e.target.value)} style={{fontSize:13,padding:"5px 8px"}}/>
                {(rpqHistCliente||rpqHistDesde||rpqHistHasta)&&
                  <button className="btn-s" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>{setRpqHistCliente("");setRpqHistDesde("");setRpqHistHasta("");}}>✕ Limpiar</button>}
              </div>
            )}
          </div>
          {rpqHistOpen&&(
            <div style={{maxHeight:"55vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
              <table className="wt">
                <thead><tr><th>N° WR</th><th>Consignatario</th><th>Casillero</th><th>Fecha</th><th>Reempacado en</th><th>Estado</th></tr></thead>
                <tbody>
                  {yaReempacados.length===0
                    ?<tr><td colSpan={6} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay reempaques que coincidan con los filtros.</td></tr>
                    :yaReempacados.map(w=>(
                      <tr key={w.id}>
                        <td><span className="c-wr">{w.id}</span></td>
                        <td>{w.consignee||"—"}</td>
                        <td><span className="c-cas">{w.casillero||"—"}</span></td>
                        <td>{fmtDate(w.fecha)}</td>
                        <td><span className="c-wr" style={{borderColor:"var(--teal)",color:"var(--teal)"}}>{w.reempacadoEn||"—"}</span></td>
                        <td><StBadge st={w.status}/></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── RECEPCIÓN EN DESTINO ────────────────────────────────────────────────────
  // Permite recibir (manual o por escaneo) mercancía que llegó a destino:
  // cambia el WR de su estado actual (usualmente 16 Liberado / 14 Aduana / etc.)
  // al estado 17 Almacén. También acepta escaneo directo por N° WR o tracking.
  const recibirEnDestino=(w,nota="Recibido en destino")=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para registrar recepciones en destino.");return;}
    // Solo se recibe en almacén a partir de Liberado 3 (16). Del 5 al 15 la
    // guía sigue en tránsito / aduana: se avanza en Loading Master › Status.
    {const n=parseFloat(w.status?.code||"0");
     if(n>=5&&n<16){window.alert(`El WR ${w.id} está en "${w.status?.label||w.status?.code}".\nSolo se puede recibir cuando su guía llegue a Liberado 3.\nEl estado de la guía se cambia en Loading Master › Status.`);return;}}
    const st=WR_STATUSES.find(s=>s.code==="17");
    const upd={
      ...w,
      status:st,
      historial:[...(w.historial||[]),{code:"17",label:"Almacén",fecha:new Date(),user:currentUser.id,nota}],
    };
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Recibido en destino",w.id);
  };
  const rdOnScan=()=>{
    const v=(rdScan||"").trim().toUpperCase();
    if(!v)return;
    // 1) Buscar guía consolidada por ID (sólo si NO hay guía seleccionada para checklist)
    if(!rdSelGuia){
      const rg=buscarParcial(v,consolList,c=>[c.id]);
      const guia=rg.item||null;
      if(guia){
        if(guia.archivada){window.alert(`La guía ${guia.id} ya fue recibida y archivada.`);setRdScan("");return;}
        recibirGuiaCompleta(guia,`Recepción por escaneo de guía (${v})`);
        setRdScan("");
        return;
      }
    }
    // 2) Buscar WR por N° o tracking
    const rw=buscarParcial(v,wrList,w=>[w.id,trkAll(w)]);
    const match=rw.item||(rw.varios?elegirDeVarios(rw.varios,w=>`${w.id} — ${w.consignee||""} (${w.status?.label||""})`):null);
    if(!match){if(!rw.varios)window.alert(`No se encontró WR ni guía con "${v}".`);return;}
    // 2.a) Ya está en Almacén — avisar y no hacer nada
    if(match.status?.code==="17"){window.alert(`El WR ${match.id} ya está en Almacén.`);setRdScan("");return;}
    // 2.b) Checklist activo — verificar si el WR pertenece a la guía seleccionada
    if(rdSelGuia){
      const guia=consolList.find(c=>c.id===rdSelGuia);
      const wrIds=(guia?.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
      if(!wrIds.includes(match.id)){
        // Es SOBRANTE: el WR llegó pero no estaba en la lista de esta guía
        const ok=window.confirm(
          `⚠️ WR ${match.id} no pertenece a la guía ${rdSelGuia}.\n`+
          `Estado actual: ${match.status?.code} ${match.status?.label||""}\n\n`+
          `¿Registrar como SOBRANTE (19)? Luego decidirás si pasa a Por Entrega o vuelve a Consolidado para la próxima guía.`
        );
        if(!ok){setRdScan("");return;}
        marcarSobrante(match,rdSelGuia);
        setRdScan("");
        return;
      }
    }
    recibirEnDestino(match,`Recibido en destino por escaneo (${v})`);
    setRdScan("");
  };
  // Marca un WR como FALTANTE (18). Usado desde el checklist cuando el paquete
  // no llegó físicamente. La resolución (investigación/seguro/causante) es manual.
  const marcarFaltante=(w,guiaId="")=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso.");return;}
    if(["18","18.1","18.2","18.3"].includes(w.status?.code)){window.alert(`El WR ${w.id} ya está marcado como faltante.`);return;}
    if(!window.confirm(`¿Marcar WR ${w.id} como FALTANTE (18)?\nEsto indica que el paquete no llegó físicamente y debe investigarse.`))return;
    const st=getStatus("18");
    const upd={...w,status:st,historial:[...(w.historial||[]),{code:"18",label:"Faltante",fecha:new Date(),user:currentUser.id,nota:`Faltante en recepción${guiaId?` — guía ${guiaId}`:""}`}]};
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Marcó faltante",w.id);
  };
  // Promueve un FALTANTE (18) a INVESTIGACIÓN (18.1) con nota obligatoria.
  const marcarInvestigacion=(w)=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso.");return;}
    const nota=window.prompt(`Abrir INVESTIGACIÓN para WR ${w.id}.\nDescripción (obligatoria):\n- Seguro / Causante / Cláusula $100 / Otro`);
    if(!nota)return;
    const st=getStatus("18.1");
    const upd={...w,status:st,historial:[...(w.historial||[]),{code:"18.1",label:"Investigación",fecha:new Date(),user:currentUser.id,nota}]};
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Abrió investigación",`${w.id} — ${nota}`);
  };
  // Marca un WR como SOBRANTE (19), enlazándolo a la guía que lo detectó.
  // La resolución ocurre luego vía `resolverSobrante`.
  const marcarSobrante=(w,guiaId="")=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso.");return;}
    const st=getStatus("19");
    const upd={...w,status:st,sobranteDeGuia:guiaId||w.sobranteDeGuia||"",historial:[...(w.historial||[]),{code:"19",label:"Sobrante",fecha:new Date(),user:currentUser.id,nota:`Sobrante${guiaId?` detectado en guía ${guiaId}`:""}`}]};
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Marcó sobrante",`${w.id}${guiaId?` (guía ${guiaId})`:""}`);
  };
  // ── ALERTAS: resolución de faltantes (18 / 18.1) y sobrantes (19) ───────────
  // Cada acción agrega una entrada al historial del WR con `alerta:<acción>` y, si
  // corresponde, los montos (montoCliente = pagado al cliente, montoTransportista =
  // recuperado del transportista). El historial ya se guarda en la BD (jsonb).
  const ALERTA_ACC={
    investigar:{code:"18.1",txt:"Abrió investigación"},
    aparecio:  {code:"17",  txt:"Faltante apareció — recibido en almacén"},
    indemnizado:{code:"18.2",txt:"Faltante cerrado — indemnizado"},
    perdida:   {code:"18.3",txt:"Faltante cerrado — pérdida sin indemnización"},
    recobro:   {code:null,  txt:"Recobro al transportista registrado"},
    entregar:  {code:"20",  txt:"Sobrante → Por Entrega"},
    devolver:  {code:"3",   txt:"Sobrante devuelto a origen (vuelve a Confirmado)"},
    otraguia:  {code:"17",  txt:"Sobrante recibido en su guía correcta"},
  };
  const alertaResolver=(w,accion,datos={})=>{
    if(!w)return false;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para resolver faltantes y sobrantes.");return false;}
    const a=ALERTA_ACC[accion];if(!a)return false;
    const st=a.code?getStatus(a.code):w.status;
    const mC=parseFloat(datos.montoCliente)||0, mT=parseFloat(datos.montoTransportista)||0;
    const nota=[a.txt,datos.guia?`guía ${datos.guia}`:"",datos.referencia?`ref. ${datos.referencia}`:"",datos.nota||""].filter(Boolean).join(" — ");
    const entry={code:st.code,label:st.label,fecha:new Date(),user:currentUser.id,nota,alerta:accion,
      ...(mC?{montoCliente:mC}:{}),...(mT?{montoTransportista:mT}:{}),...(datos.referencia?{referencia:datos.referencia}:{})};
    const upd={...w,status:st,historial:[...(w.historial||[]),entry]};
    if(["entregar","devolver","otraguia"].includes(accion))upd.sobranteDeGuia="";
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction(`Alerta: ${a.txt}`,`${w.id}${mC?` · cliente $${mC}`:""}${mT?` · transportista $${mT}`:""}`);
    if(["indemnizado","perdida"].includes(accion)){
      const fac=facturas.find(f=>f.tipo==="factura"&&!["anulada","borrador"].includes(f.status)&&(f.wrIds||[]).includes(w.id));
      if(fac&&ncDisponible(fac)>0.001&&(hasPerm("nota_credito")||hasPerm("facturar"))&&window.confirm(`El WR ${w.id} está en la factura ${fac.id}. ¿Emitir nota de crédito?`)){
        const lin=(fac.lineas||[]).filter(l=>l.wrId===w.id).reduce((t,l)=>t+(parseFloat(l.total)||0),0);
        const monto=(fac.wrIds||[]).length<=1||!lin?fac.total:(fac.subtotal>0?lin*fac.total/fac.subtotal:lin);
        ncOpen(fac,{monto,motivo:`WR ${w.id} ${accion==="indemnizado"?"indemnizado":"pérdida"}`});
      }
    }
    return true;
  };
  // Resuelve un SOBRANTE (19). destino: "20" (Por Entrega) o "4" (vuelve a Consolidado para próxima guía).
  const resolverSobrante=(w,destino)=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso.");return;}
    if(!["20","4"].includes(destino)){window.alert("Destino de sobrante inválido.");return;}
    const st=getStatus(destino);
    const nota=destino==="20"?"Sobrante → Por Entrega":"Sobrante → vuelve a Consolidado para próxima guía";
    const upd={...w,status:st,sobranteDeGuia:"",historial:[...(w.historial||[]),{code:destino,label:st.label,fecha:new Date(),user:currentUser.id,nota}]};
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Resolvió sobrante",`${w.id} → ${destino} ${st.label}`);
  };
  // Revierte una recepción individual: del 17 Almacén vuelve al estado anterior
  // encontrado en el historial (busca el último que no sea 17).
  const revertirRecepcion=(w)=>{
    if(!w||w.status?.code!=="17")return;
    if(!hasPerm("editar_recepcion_dest")){window.alert("Tu rol no tiene permiso para revertir.");return;}
    if(!window.confirm(`¿Revertir la recepción de ${w.id}? Vuelve al estado anterior.`))return;
    const hist=[...(w.historial||[])];
    // quitar la última entrada (que es la del 17) y buscar el anterior
    const prev=[...hist].reverse().find(h=>h.code!=="17");
    const prevCode=prev?.code||"16";
    const st=getStatus(prevCode)||getStatus("16");
    const upd={...w,status:st,historial:[...hist,{code:prevCode,label:st.label,fecha:new Date(),user:currentUser.id,nota:"Revertida recepción en almacén"}]};
    setWrList(p=>p.map(x=>x.id===w.id?upd:x));
    if(selWR&&selWR.id===w.id)setSelWR(upd);
    dbUpsertWR(upd);
    logAction("Revirtió recepción",w.id);
  };
  // Avanza una guía dentro del módulo de Recepción en Almacén.
  // Estados editables aquí: 14 Aduana Destino, 15 Auditoría 3, 16 Liberado 3.
  // Cascada al estado de cada WR de la guía (excepto los ya en 17/excep/entrega).
  const updateGuideStatusRecep=(consolId,stCode)=>{
    const st=getStatus(stCode);
    if(!st)return;
    if(!statusInChannel(stCode,"recepcion")){
      window.alert(`El estado "${st.label}" no se asigna desde Recepción en Almacén.`);
      return;
    }
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para fijar este estado.");return;}
    setConsolList(p=>p.map(c=>{
      if(c.id!==consolId)return c;
      const updated={...c,status:st.label};
      dbUpsertConsolidacion(updated);
      return updated;
    }));
    const consol=consolList.find(c=>c.id===consolId);
    if(!consol)return;
    const allWrIds=(consol.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    if(allWrIds.length===0)return;
    setWrList(p=>p.map(w=>{
      if(!allWrIds.includes(w.id))return w;
      // No retroceder WRs ya recibidos/excep/entrega
      if(["17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25"].includes(w.status?.code||""))return w;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:st.code,label:st.label,fecha:new Date(),user:currentUser.id,nota:`Recepción → ${st.label} (guía ${consolId})`}]};
      dbUpsertWR(upd);
      return upd;
    }));
    logAction(`Recepción → ${st.label}`,`Guía ${consolId}`);
  };

  // Cierra la recepción de una guía: promueve todos los WR en 17 Almacén → 20 Por Entrega
  // y archiva la guía. Los faltantes (18/18.1) y sobrantes (19) permanecen en su estado.
  // Bloquea el cierre si quedan WR en estados pre-destino (< 17 y no excep/entrega).
  const cerrarRecepcionGuia=(guia)=>{
    if(!guia)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso.");return;}
    const allWrIds=(guia.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    const wrs=wrList.filter(w=>allWrIds.includes(w.id));
    const pendientes=wrs.filter(w=>{
      const c=w.status?.code||"";
      // WR todavía sin resolución: no está recibido (17), ni es excepción (18/18.1/19)
      return !["17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25"].includes(c);
    });
    if(pendientes.length>0){
      window.alert(
        `No se puede cerrar la guía ${guia.id}.\n`+
        `${pendientes.length} WR aún no están resueltos:\n`+
        pendientes.slice(0,5).map(w=>`• ${w.id} (${w.status?.code||"?"})`).join("\n")+
        (pendientes.length>5?`\n…y ${pendientes.length-5} más`:"")+
        `\n\nMárcalos como recibidos o faltantes antes de cerrar.`
      );
      return;
    }
    const recibidos=wrs.filter(w=>w.status?.code==="17");
    const faltantes=wrs.filter(w=>w.status?.code==="18"||w.status?.code==="18.1").length;
    const sobrantes=wrs.filter(w=>w.status?.code==="19").length;
    if(!window.confirm(
      `¿Cerrar recepción de la guía ${guia.id}?\n`+
      `✓ ${recibidos.length} recibidos pasarán a Por Entrega (20)\n`+
      `⚠️ ${faltantes} faltantes/investigación permanecerán pendientes\n`+
      `➕ ${sobrantes} sobrantes permanecerán como 19 (resuélvelos aparte)\n\n`+
      `La guía se archivará.`
    ))return;
    // Promover 17 → 20
    const st20=getStatus("20");
    setWrList(p=>p.map(w=>{
      if(!allWrIds.includes(w.id)||w.status?.code!=="17")return w;
      const upd={...w,status:st20,historial:[...(w.historial||[]),{code:"20",label:"Por Entrega",fecha:new Date(),user:currentUser.id,nota:`Cierre recepción guía ${guia.id}`}]};
      dbUpsertWR(upd);
      return upd;
    }));
    // Archivar guía
    const updGuia={...guia,archivada:true,status:"Recibida (cerrada)",fechaRecibidaAlmacen:new Date()};
    setConsolList(p=>p.map(c=>c.id===guia.id?updGuia:c));
    dbUpsertConsolidacion(updGuia);
    logAction(`Cerró recepción guía ${guia.id}`,`${recibidos.length} WR → Por Entrega · ${faltantes} faltantes · ${sobrantes} sobrantes`);
    setRdSelGuia("");
    // Las facturas se generan con el botón de Facturación (no automáticamente)
    window.alert(`✅ Guía ${guia.id} cerrada.\n${recibidos.length} WR pasaron a Por Entrega (20).`);
  };
  // Marca como recibidos (17 Almacén) todos los WR de una guía, en un paso.
  // NO archiva la guía — la archivación requiere `cerrarRecepcionGuia` (paso 2).
  // Sólo afecta a WRs que aún no estén en 17/18/18.1/19 (respeta faltantes y sobrantes).
  const recibirGuiaCompleta=(guia,nota="Recepción de guía completa en almacén")=>{
    if(!guia)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para registrar recepciones en destino.");return;}
    if((parseFloat(guiaCode(guia))||0)<16){window.alert(`La guía ${guia.id} aún no está en Liberado 3.\nCambia su estado en Loading Master › Status antes de recibir.`);return;}
    const st=getStatus("17");
    const allWrIds=(guia.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    if(allWrIds.length===0){window.alert(`La guía ${guia.id} no tiene WRs asociados.`);return;}
    let cambiados=0;
    setWrList(p=>p.map(w=>{
      if(!allWrIds.includes(w.id))return w;
      // respetar WRs ya procesados (Almacén, Faltante, Investigación, Sobrante, Por Entrega, etc.)
      if(["17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25"].includes(w.status?.code||""))return w;
      cambiados++;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:"17",label:"Almacén",fecha:new Date(),user:currentUser.id,nota:`${nota} — guía ${guia.id}`}]};
      dbUpsertWR(upd);
      return upd;
    }));
    logAction(`Recibió guía ${guia.id} (bulk)`,`${cambiados} WR → Almacén`);
    window.alert(`✅ ${cambiados} WR marcados como recibidos (Almacén).\nUsa "Cerrar recepción de guía" cuando termines el checklist para pasarlos a Por Entrega.`);
  };
  // ── CARGO RELEASE (Egreso) ──────────────────────────────────────────────────
  // Un Cargo Release agrupa 1+ WRs entregados a un agente/transportista.
  // Al crear: todos los WRs pasan a estado 25 Egresado. Sólo se puede egresar desde Origen,
  // antes de Consolidación. Estados elegibles: 1 (Recibido), 2 (Origen), 3 (Confirmado).
  // No elegibles: 2.3 (Reempacado), 4+ (Consolidado en adelante), 25 (ya Egresado).
  const crElegible=(w)=>["1","2","3"].includes(w.status?.code||"");
  const crBuildId=()=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    const prefix=`ER-${y}${m}${dd}`;
    const sameDay=cargoReleases.filter(c=>String(c.id).startsWith(prefix));
    const n=String(sameDay.length+1).padStart(3,"0");
    return `${prefix}-${n}`;
  };
  const crOpenNew=(preselectedIds=[])=>{
    if(!hasPerm("hacer_egreso")){window.alert("Tu rol no tiene permiso para registrar egresos.");return;}
    setCrModal({wrIds:preselectedIds,agenteCarga:"",contacto:"",documento:"",vehiculo:"",notas:"",editId:null});
  };
  const crOpenEdit=(cr)=>{
    if(!hasPerm("editar_egreso")){window.alert("Tu rol no tiene permiso para editar egresos.");return;}
    setCrModal({wrIds:cr.wrIds||[],agenteCarga:cr.agenteCarga||"",contacto:cr.contacto||"",documento:cr.documento||"",vehiculo:cr.vehiculo||"",notas:cr.notas||"",editId:cr.id});
  };
  const crSubmit=()=>{
    const f=crModal; if(!f)return;
    if(!f.agenteCarga.trim()){window.alert("El agente de carga es obligatorio.");return;}
    if(!f.wrIds||f.wrIds.length===0){window.alert("Agrega al menos 1 WR al egreso.");return;}
    const editing=!!f.editId;
    const id=editing?f.editId:crBuildId();
    const now=new Date();
    const cr={
      id,fecha:editing?(cargoReleases.find(c=>c.id===id)?.fecha||now):now,
      wrIds:f.wrIds,
      agenteCarga:f.agenteCarga.trim(),
      contacto:f.contacto.trim(),
      documento:f.documento.trim(),
      vehiculo:f.vehiculo.trim(),
      notas:f.notas.trim(),
      usuario:currentUser.id||currentUser.email||"",
      firmaDataUrl:"",
      anulado:false,motivoAnulacion:"",
    };
    if(editing){
      setCargoReleases(p=>p.map(c=>c.id===id?{...c,...cr}:c));
    }else{
      setCargoReleases(p=>[cr,...p]);
      // Promover WRs → 25 Egresado
      const st25=getStatus("25");
      setWrList(p=>p.map(w=>{
        if(!cr.wrIds.includes(w.id))return w;
        const upd={...w,status:st25,historial:[...(w.historial||[]),{code:"25",label:"Egresado",fecha:now,user:currentUser.id,nota:`Egreso ${id} → ${cr.agenteCarga}`}]};
        dbUpsertWR(upd);
        return upd;
      }));
    }
    dbUpsertCargoRelease(cr);
    logAction(editing?"Editó egreso":"Creó egreso",`${id} · ${cr.wrIds.length} WR → ${cr.agenteCarga}`);
    setCrModal(null);
    if(!editing)window.alert(`✅ Egreso ${id} creado.\n${cr.wrIds.length} WR → Egresado (25).`);
  };
  const crAnular=(cr)=>{
    if(!hasPerm("editar_egreso")){window.alert("Tu rol no tiene permiso.");return;}
    const motivo=window.prompt(`Anular egreso ${cr.id}.\nMotivo (obligatorio):`);
    if(!motivo)return;
    const upd={...cr,anulado:true,motivoAnulacion:motivo};
    setCargoReleases(p=>p.map(c=>c.id===cr.id?upd:c));
    dbUpsertCargoRelease(upd);
    // Revertir cada WR al estado que tenía ANTES del egreso (último h.code !== "25").
    // Un WR pudo egresarse desde múltiples estados (1, 2, 3 — egreso temprano —
    // o 20 — egreso post-recepción). Volver siempre a 20 sería incorrecto si el
    // WR estaba en 1/2/3. Si no encontramos historial previo, fallback a "1".
    // Si el WR ya avanzó a otro estado por otra vía (no debería ocurrir, pero
    // por seguridad), respetamos su estado actual.
    let revertidos=0;
    setWrList(p=>p.map(w=>{
      if(!cr.wrIds.includes(w.id))return w;
      if(w.status?.code!=="25")return w;
      const hist=Array.isArray(w.historial)?w.historial:[];
      const prev=[...hist].reverse().find(h=>h.code&&h.code!=="25");
      const prevCode=prev?.code||"1";
      const stPrev=getStatus(prevCode)||getStatus("1");
      if(!stPrev)return w;
      revertidos++;
      const u={...w,status:stPrev,historial:[...hist,{code:stPrev.code,label:stPrev.label,fecha:new Date(),user:currentUser.id,nota:`Egreso ${cr.id} anulado: ${motivo}`}]};
      dbUpsertWR(u);
      return u;
    }));
    logAction("Anuló egreso",`${cr.id} — ${motivo} — ${revertidos} WR revertidos al estado previo`);
  };
  const crDelete=(cr)=>{
    if(!hasPerm("borrar_egreso")){window.alert("Tu rol no tiene permiso para borrar egresos.");return;}
    // Bloqueo: solo se puede borrar permanentemente un egreso ya anulado.
    // Borrar uno activo dejaría WRs colgados en estado 25 sin egreso asociado.
    if(!cr.anulado){
      window.alert(`No se puede borrar un egreso activo.\n\nPrimero anúlalo (✕) — eso revierte los WRs al estado que tenían antes del egreso. Después podrás borrarlo permanentemente del historial.`);
      return;
    }
    if(!window.confirm(`¿Borrar permanentemente el egreso ${cr.id}?\nYa está anulado, así que los WR ya fueron revertidos. Esto solo elimina el registro del log.`))return;
    setCargoReleases(p=>p.filter(c=>c.id!==cr.id));
    dbDeleteCargoRelease(cr.id);
    logAction("Borró egreso",cr.id);
  };

  // ── CARGO RELEASE INDIVIDUAL (desde Estado de Cuenta) ──────────────────────
  // Modal simplificado con 4 campos (Nombre, ID, Empresa, Notas) para egresar
  // un único WR. Al confirmar crea el cargo_release, promueve el WR a 25, y
  // muestra un recibo imprimible.
  const crOpenIndivPorWR=(w)=>{
    if(!hasPerm("hacer_egreso")){window.alert("Tu rol no tiene permiso para registrar egresos.");return;}
    if(!crElegible(w)){window.alert(`El WR ${w.id} está en estado ${w.status?.label||"?"}. Solo se puede egresar desde Origen (Recibido / Origen / Confirmado). Reempacados, Consolidados y Egresados quedan fijos.`);return;}
    setCrIndivModal({wrs:[w],nombre:"",id:"",empresa:"",notas:""});
  };
  const crSubmitIndiv=()=>{
    const f=crIndivModal; if(!f)return;
    if(!f.nombre.trim()){window.alert("El nombre del receptor es obligatorio.");return;}
    if(!f.id.trim()){window.alert("El ID de identificación del receptor es obligatorio.");return;}
    const now=new Date();
    const id=crBuildId();
    const cr={
      id,fecha:now,
      wrIds:f.wrs.map(w=>w.id),
      agenteCarga:f.nombre.trim(),      // campo "Nombre"   → agenteCarga
      contacto:f.empresa.trim(),         // campo "Empresa"  → contacto
      documento:f.id.trim(),             // campo "ID"       → documento
      vehiculo:"",
      notas:f.notas.trim(),
      usuario:currentUser.id||currentUser.email||"",
      firmaDataUrl:"",
      anulado:false,motivoAnulacion:"",
    };
    setCargoReleases(p=>[cr,...p]);
    // Promover WR → 25 Egresado
    const st25=getStatus("25");
    const idsEgreso=f.wrs.map(w=>w.id);
    let wrActualizado=null;
    setWrList(p=>p.map(w=>{
      if(!idsEgreso.includes(w.id))return w;
      wrActualizado={...w,status:st25,historial:[...(w.historial||[]),{code:"25",label:"Egresado",fecha:now,user:currentUser.id,nota:`Egreso ${id} → ${cr.agenteCarga}${cr.contacto?` (${cr.contacto})`:""}`}]};
      dbUpsertWR(wrActualizado);
      return wrActualizado;
    }));
    dbUpsertCargoRelease(cr);
    logAction("Creó egreso individual",`${id} · ${idsEgreso.join(", ")} → ${cr.agenteCarga}`);
    // Cerrar modal + abrir recibo imprimible
    setCrIndivModal(null);
    if(f.wrs.length===1){
      const w0=f.wrs[0];
      const cli=clients.find(c=>c.id===w0.clienteId||c.casillero===w0.casillero);
      setCrIndivRecibo({cr,wr:wrActualizado||w0,cliente:cli||null});
    }else setCrPrint(cr);
  };

  // ── Delivery Notes (Notas de Entrega) ───────────────────────────────────────
  // Al crear: los WR pasan a estado 21 Entregado. Elegible: 20 Por Entrega y 25 Egresado
  // (por ejemplo, cuando el agente de carga ya llevó la mercancía y solo queda confirmar
  // la entrega firmada por el cliente final).
  // Sólo los WR en estado 20 Por Entrega son elegibles para Nota de Entrega.
  // Reempacados (2.3) son fantasmas; Egresados (25) ya salieron del sistema por
  // Cargo Release y no se entregan otra vez.
  const dnElegible=(w)=>["20","20.2"].includes(w?.status?.code||"");

  // ── Helpers de Entregas y Despachos ────────────────────────────────────────
  // Una guía es "aérea" si su tipoEnvio empieza con "Aer" (Aéreo, Aereo, AER).
  // El resto se considera marítima (incluye Marítimo, Maritimo, etc.).
  const dnGuiaEsAerea=(g)=>{
    const t=String(g?.tipoEnvio||"").toLowerCase();
    return t.startsWith("aer")||t.startsWith("aér");
  };
  // Peso/volumen facturable de un WR según el modo de transporte de la guía.
  // Aéreo: max(pesoLb, volLb) — estándar de la industria; lo voluminoso paga
  //        más que su peso bruto.
  // Marítimo: ft³ (también devolvemos m³ para mostrar ambos).
  // unidad: "lb" o "kg" (aéreo: el mayor entre peso real y volumétrico), "ft3" o "m3" (marítimo)
  const wrPesoFacturable=(w,isAereo,unidad="")=>{
    if(isAereo){
      const kg=unidad==="kg";
      const real=parseFloat(kg?w.pesoKg:w.pesoLb)||0;
      const vol =parseFloat(kg?w.volKg:w.volLb )||0;
      return {valor:Math.max(real,vol), unidad:kg?"kg":"lb", real, vol};
    }
    if(unidad==="m3")return {valor:parseFloat(w.m3)||0, unidad:"m3", ft3:parseFloat(w.ft3)||0, m3:parseFloat(w.m3)||0};
    return {valor:parseFloat(w.ft3)||0, unidad:"ft3", ft3:parseFloat(w.ft3)||0, m3:parseFloat(w.m3)||0};
  };
  // Resuelve a qué "dominio" pertenece un cliente:
  //   matriz → null (sin dominio, es cliente directo)
  //   agente / vendedor_agente   → { tipo:"agente",   id: agenteId,   nombre }
  //   oficina / vendedor_oficina → { tipo:"oficina",  id: oficinaId,  nombre }
  //   autonomo                   → { tipo:"autonomo", id: autonomoId, nombre }
  const cliDeWR=w=>w?(clients.find(c=>w.clienteId&&c.id===w.clienteId)||clients.find(c=>w.casillero&&c.casillero===w.casillero)||null):null;
  const dnDominioDeCliente=(c)=>{
    if(!c)return null;
    const ct=c.clienteTipo||"matriz";
    if(ct==="agente"||ct==="vendedor_agente"){
      const ag=agentes.find(a=>a.id===c.agenteId);
      return ag?{tipo:"agente",id:ag.id,nombre:ag.nombre||ag.codigo||"Agente"}:null;
    }
    if(ct==="oficina"||ct==="vendedor_oficina"){
      const of=oficinas.find(o=>o.id===c.oficinaId);
      return of?{tipo:"oficina",id:of.id,nombre:of.nombre||of.codigo||"Oficina"}:null;
    }
    if(ct==="autonomo"){
      const au=clients.find(x=>x.id===c.autonomoId);
      return au?{tipo:"autonomo",id:au.id,nombre:`${au.primerNombre||""} ${au.primerApellido||""}`.trim()||"Autónomo"}:null;
    }
    return null;
  };
  // Lista guías que tienen al menos un WR en estado 20 (Por Entrega).
  // Estas son las guías "abiertas" para generar entregas/despachos.
  const dnGuiasConPorEntregar=()=>{
    const ids=new Set(wrList.filter(w=>w.status?.code==="20").map(w=>w.id));
    return consolList.filter(c=>{
      const wrIds=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
      return wrIds.some(id=>ids.has(id));
    });
  };
  // WRs en estado 20 de la guía dada
  const dnWRsPorEntregarEnGuia=(guia)=>{
    if(!guia)return [];
    const ids=(guia.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    return wrList.filter(w=>ids.includes(w.id)&&w.status?.code==="20");
  };

  const dnBuildId=()=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    const prefix=`NE-${y}${m}${dd}`;
    const sameDay=deliveryNotes.filter(n=>String(n.id).startsWith(prefix));
    const n=String(sameDay.length+1).padStart(3,"0");
    return `${prefix}-${n}`;
  };
  // Abre el modal en modo "Entrega" (cliente directo) o "Despacho" (a agente/
  // oficina/autónomo). Ambos comparten el mismo modal pero el flujo de
  // selección de receptor y WRs cambia según el tipo. preselectedIds permite
  // arrancar con WRs ya marcados (caso "Entregar este WR" desde el WR Modal).
  const dnOpenNew=(preselectedIds=[],opts={})=>{
    if(!hasPerm("entregar")){window.alert("Tu rol no tiene permiso para registrar entregas.");return;}
    const tipo=opts.tipo||"entrega"; // "entrega" | "despacho"
    let auto={consignatario:"",clienteId:"",direccionEntrega:"",guiaId:"",receptorEntidad:null};
    if(preselectedIds.length>0){
      const pre=preselectedIds.map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
      const uniqCli=[...new Set(pre.map(w=>w.clienteId||"").filter(Boolean))];
      const uniqCon=[...new Set(pre.map(w=>w.consignee||"").filter(Boolean))];
      if(uniqCli.length===1)auto.clienteId=uniqCli[0];
      if(uniqCon.length===1)auto.consignatario=uniqCon[0];
      if(uniqCli.length===1){
        const cli=clients.find(c=>c.id===uniqCli[0]);
        if(cli)auto.direccionEntrega=[cli.dir,cli.municipio,cli.estado].filter(Boolean).join(", ");
      }
      // Inferir guía: si todos los WR pertenecen a una misma guía consolidada
      const guias=pre.map(w=>{
        return consolList.find(c=>(c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id)));
      }).filter(Boolean);
      const uniqGuias=[...new Set(guias.map(g=>g.id))];
      if(uniqGuias.length===1)auto.guiaId=uniqGuias[0];
    }
    setDnModal({
      tipo,
      guiaId:auto.guiaId,
      receptorEntidad:auto.receptorEntidad,
      wrIds:preselectedIds,
      consignatario:auto.consignatario,clienteId:auto.clienteId,
      receptorNombre:"",receptorDocumento:"",receptorTelefono:"",
      direccionEntrega:auto.direccionEntrega,
      metodoEntrega:"retiro_oficina",transportista:"",notas:"",
      editId:null,
    });
  };
  const dnOpenEdit=(dn)=>{
    if(!hasPerm("editar_entrega")){window.alert("Tu rol no tiene permiso para editar entregas.");return;}
    setDnModal({
      tipo:dn.tipo||"entrega",
      guiaId:dn.guiaId||"",
      receptorEntidad:dn.receptorEntidad||null,
      wrIds:dn.wrIds||[],
      consignatario:dn.consignatario||"",clienteId:dn.clienteId||"",
      receptorNombre:dn.receptorNombre||"",receptorDocumento:dn.receptorDocumento||"",receptorTelefono:dn.receptorTelefono||"",
      direccionEntrega:dn.direccionEntrega||"",
      metodoEntrega:dn.metodoEntrega||"retiro_oficina",transportista:dn.transportista||"",notas:dn.notas||"",
      editId:dn.id,
    });
  };
  // ── ENTREGAS POR GUÍA ─────────────────────────────────────────────
  // WR de una guía (contenedores + wrIds), sin reempacados
  const dnWrsDeGuia=g=>{
    if(!g)return [];
    const ids=new Set([...(Array.isArray(g.wrIds)?g.wrIds:[]),...(g.containers||[]).flatMap(ct=>(ct.wr||[]).map(r=>r.id))]);
    return wrList.filter(w=>ids.has(w.id)&&w.status?.code!=="2.3");
  };
  const dnGuiaDeWR=w=>consolList.find(c=>(Array.isArray(c.wrIds)&&c.wrIds.includes(w.id))||(c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id)))||null;
  // País: compara sin tildes, mayúsculas ni banderas ("USA 🇺🇸" = "USA", "España" = "ESPAÑA")
  const paisNorm=v=>sinAcentos(v).replace(/[^A-Z]/g,"");
  const mismoPais=(a,b)=>{const x=paisNorm(a),y=paisNorm(b);return !!x&&!!y&&(x===y||x.startsWith(y)||y.startsWith(x));};
  const ciudadNombre=v=>{const V=sinAcentos(v);for(const co of COUNTRIES)for(const ci of (co.cities||[]))if(sinAcentos(ci.code)===V||sinAcentos(ci.name)===V)return ci.name;return v||"";};
  // País de destino de una guía (según sus WR)
  const dnPaisGuia=g=>{const w=dnWrsDeGuia(g).find(x=>x.destCountry);return w?.destCountry||"";};
  // Dueño del cliente (agente / autónomo / oficina antigua), para mostrarlo como etiqueta
  const dnDuenoDeCliente=cli=>dnDominioDeCliente(cli);
  // A quién se despacha un WR en esta guía: agente o autónomo del cliente, o la sucursal de
  // entrega del cliente — solo si están en el país de destino. Si no, entrega directa (matriz).
  const dnDomDeWR=(w,g)=>{
    const cli=cliDeWR(w);
    const ct=cli?.clienteTipo||"matriz";
    const pais=g?dnPaisGuia(g):"";
    const enDestino=p=>!pais||!p||mismoPais(p,pais);
    if(ct==="agente"||ct==="vendedor_agente"){
      const ag=agentes.find(a=>a.id===cli.agenteId);
      if(ag&&enDestino(ag.pais))return {tipo:"agente",id:ag.id,nombre:ag.nombre||ag.codigo||"Agente"};
    }else if(ct==="autonomo"){
      const d=dnDominioDeCliente(cli);
      if(d)return d;
    }
    const sucId=sucursalDeWR(w,cli);
    if(sucId){
      const of=oficinas.find(o=>o.id===sucId);
      if(of&&enDestino(of.pais))return {tipo:"oficina",id:of.id,nombre:of.nombre||of.codigo||"Oficina"};
    }
    return {tipo:"matriz",id:"matriz",nombre:empresaNombre||"Matriz"};
  };
  const dnNotasDeWR=id=>deliveryNotes.filter(n=>!n.anulado&&(n.wrIds||[]).includes(id)).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  const dnFacturasPendientes=ws=>{
    const ids=new Set(ws.map(w=>w.id));
    return facturas.filter(f=>["emitida","pagada_parcial"].includes(f.status)&&Array.isArray(f.wrIds)&&f.wrIds.some(id=>ids.has(id)));
  };
  const dnDatosEntidad=dom=>{
    // Persona de contacto: la de la ficha; si no hay, el usuario enlazado a ese agente/oficina
    const usuarioDe=(campo,tipos)=>clients.find(c=>c.tipo==="usuario"&&c[campo]===dom.id&&tipos.includes(c.clienteTipo));
    if(dom.tipo==="agente"){const a=agentes.find(x=>x.id===dom.id);const u=usuarioDe("agenteId",["agente"]);return {contacto:(a?.contacto||"").trim()||(u?fullName(u):""),doc:a?.contacto?"":(u?.cedula||""),tel:a?.tel||u?.tel1||"",dir:[a?.dir,a?.ciudad].filter(Boolean).join(", ")};}
    if(dom.tipo==="oficina"){const o=oficinas.find(x=>x.id===dom.id);const u=usuarioDe("oficinaId",["oficina"]);return {contacto:(o?.contacto||"").trim()||(u?fullName(u):""),doc:o?.contacto?"":(u?.cedula||""),tel:o?.tel||u?.tel1||"",dir:[o?.dir,o?.ciudad].filter(Boolean).join(", ")};}
    if(dom.tipo==="autonomo"){const a=clients.find(x=>x.id===dom.id);return {contacto:a?fullName(a):"",doc:a?.cedula||"",tel:a?.tel1||"",dir:[a?.dir,a?.municipio,a?.estado].filter(Boolean).join(", ")};}
    return {contacto:"",doc:"",tel:"",dir:""};
  };
  // Abre la ventana de confirmar. tipo: "entrega" (a un cliente) | "despacho" (a agente/oficina/autónomo)
  const dnAbrirConfirmar=(tipo,guia,entidad,wrs,cli=null)=>{
    if(!hasPerm("entregar")){window.alert("Tu rol no tiene permiso para registrar entregas.");return;}
    if(!wrs.length)return;
    if(tipo==="entrega"){
      const nombre=cli?fullName(cli):(wrs[0].consignee||"");
      setDnQuick({tipo,guiaId:guia.id,entidad,wrs,wrIds:wrs.map(w=>w.id),clienteId:cli?.id||"",
        consignatario:nombre,recibe:"consignatario",receptorNombre:nombre,receptorDocumento:cli?.cedula||"",receptorTelefono:cli?.tel1||"",relacion:"",
        metodoEntrega:"retiro_oficina",direccionEntrega:cli?[cli.dir,cli.municipio,cli.estado].filter(Boolean).join(", "):"",notas:""});
    }else{
      const d=dnDatosEntidad(entidad);
      const aSuc=entidad.tipo==="oficina";
      setDnQuick({tipo,guiaId:guia.id,entidad,wrs,wrIds:wrs.map(w=>w.id),clienteId:"",
        consignatario:entidad.nombre,recibe:"encargado",
        // En sucursal quien recibe se anota al confirmar la llegada
        receptorNombre:aSuc?"":(d.contacto||"").toUpperCase(),receptorDocumento:aSuc?"":d.doc,receptorTelefono:d.tel,relacion:"",
        despacha:fullName(currentUser).toUpperCase(),chofer:"",choferId:"",vehiculo:"",
        metodoEntrega:"despacho",direccionEntrega:d.dir,notas:""});
    }
  };
  // Desde el detalle del WR: abre la entrega de ese cliente en su guía
  const dnEntregarDesdeWR=w=>{
    const g=dnGuiaDeWR(w);
    if(!g){window.alert(`El WR ${w.id} no pertenece a ninguna guía.`);return;}
    const cli=cliDeWR(w);
    const wrs=dnWrsDeGuia(g).filter(x=>dnElegible(x)&&(cli?cliDeWR(x)?.id===cli.id:x.casillero===w.casillero));
    dnAbrirConfirmar("entrega",g,cli?{tipo:"cliente",id:cli.id,nombre:fullName(cli)}:{tipo:"cliente",id:"",nombre:w.consignee||""},wrs.length?wrs:[w],cli);
  };
  const dnQuickSubmit=()=>{
    const f=dnQuick; if(!f)return;
    if(f.wrIds.length===0){window.alert("Marca al menos 1 WR.");return;}
    if(f.tipo==="despacho"){
      if(!String(f.despacha||"").trim()){window.alert("Falta quién despacha.");return;}
    }else{
      if(!f.receptorNombre.trim()){window.alert("Falta el nombre de quien firma.");return;}
      if(f.recibe==="encargado"&&!f.receptorDocumento.trim()){window.alert("Falta el ID de identificación de quien recibe.");return;}
    }
    if(f.metodoEntrega==="domicilio"&&!f.direccionEntrega.trim()){window.alert("Falta la dirección de entrega.");return;}
    const pend=dnFacturasPendientes(f.wrs.filter(w=>f.wrIds.includes(w.id)));
    if(pend.length>0&&!window.confirm(`⚠️ Hay ${pend.length} factura(s) con pago pendiente:\n${pend.map(x=>`• ${x.id} — ${fmtMoney(x.total-(x.pagado||0),x.moneda)}`).join("\n")}\n\n¿Entregar de todos modos?`))return;
    const now=new Date();
    const id=dnBuildId();
    const aSucursal=f.tipo==="despacho"&&f.entidad.tipo==="oficina";
    const dn={
      id,fecha:now,tipo:f.tipo,guiaId:f.guiaId,
      receptorEntidad:{...f.entidad,recibe:f.recibe,relacion:f.recibe==="encargado"?(f.relacion||"").trim():"",
        ...(f.tipo==="despacho"?{despacha:String(f.despacha||"").trim(),chofer:String(f.chofer||"").trim(),choferId:String(f.choferId||"").trim(),vehiculo:String(f.vehiculo||"").trim()}:{})},
      wrIds:[...f.wrIds],clienteId:f.clienteId||"",
      consignatario:f.consignatario.trim(),
      receptorNombre:f.receptorNombre.trim(),receptorDocumento:f.receptorDocumento.trim(),receptorTelefono:f.receptorTelefono.trim(),
      direccionEntrega:f.direccionEntrega.trim(),metodoEntrega:f.metodoEntrega,transportista:f.tipo==="despacho"?String(f.chofer||"").trim():"",notas:f.notas.trim(),
      usuario:currentUser.id||currentUser.email||"",firmaDataUrl:"",anulado:false,motivoAnulacion:"",
    };
    const st=getStatus(aSucursal?"20.1":"21");
    const notaHist=aSucursal
      ?`Despacho ${id} → ${f.entidad.nombre} · despacha ${dn.receptorEntidad.despacha}${dn.receptorEntidad.chofer?` · transporta ${dn.receptorEntidad.chofer}`:""}`
      :`${f.tipo==="despacho"?"Despacho":"Entrega"} ${id} → ${dn.receptorNombre||f.entidad.nombre}${f.recibe==="encargado"&&f.tipo!=="despacho"?` (encargado${dn.receptorEntidad.relacion?`, ${dn.receptorEntidad.relacion}`:""})`:""}${f.tipo==="despacho"?` por ${f.entidad.nombre}`:""}`;
    setDeliveryNotes(p=>[dn,...p]);
    setWrList(p=>p.map(w=>{
      if(!dn.wrIds.includes(w.id))return w;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:st.code,label:st.label,fecha:now,user:currentUser.id,nota:notaHist}]};
      dbUpsertWR(upd);
      return upd;
    }));
    dbUpsertDeliveryNote(dn);
    logAction(f.tipo==="despacho"?"Creó despacho":"Creó entrega",`${id} · ${dn.wrIds.length} WR → ${f.tipo==="despacho"?f.entidad.nombre:dn.consignatario}`);
    setDnQuick(null);
    setDnPrint(dn);
  };
  // La oficina confirma que recibió la carga despachada (20.1 → 20.2)
  const dnRecibirSucursal=(dom,wrs)=>{
    if(!hasPerm("entregar")){window.alert("Tu rol no tiene permiso.");return;}
    if(!wrs.length)return;
    const quien=window.prompt(`¿Quién recibe en ${dom.nombre}? (${wrs.length} WR)`,fullName(currentUser).toUpperCase());
    if(quien===null)return;
    if(!quien.trim()){window.alert("Escribe el nombre de quien recibe.");return;}
    const recibe=quien.trim().toUpperCase();
    const st=getStatus("20.2"); const now=new Date(); const ids=wrs.map(w=>w.id);
    // Anotar en las notas de despacho quién recibió y cuándo
    setDeliveryNotes(p=>p.map(n=>{
      if(n.anulado||n.tipo!=="despacho"||n.receptorEntidad?.tipo!=="oficina"||n.receptorEntidad?.id!==dom.id)return n;
      if(!(n.wrIds||[]).some(id=>ids.includes(id))||n.receptorEntidad?.recibidoPor)return n;
      const u={...n,receptorNombre:n.receptorNombre||recibe,receptorEntidad:{...n.receptorEntidad,recibidoPor:recibe,recibidoFecha:now.toISOString()}};
      dbUpsertDeliveryNote(u);
      return u;
    }));
    setWrList(p=>p.map(w=>{
      if(!ids.includes(w.id))return w;
      const upd={...w,status:st,historial:[...(w.historial||[]),{code:"20.2",label:st.label,fecha:now,user:currentUser.id,nota:`Recibido en sucursal ${dom.nombre} · recibe ${recibe}`}]};
      dbUpsertWR(upd);
      return upd;
    }));
    logAction("Recibido en sucursal",`${dom.nombre} · ${ids.length} WR`);
  };
  const dnSubmit=()=>{
    const f=dnModal; if(!f)return;
    if(!f.guiaId){window.alert("Selecciona la guía.");return;}
    if(!f.receptorEntidad){window.alert(f.tipo==="despacho"?"Selecciona el agente, oficina o autónomo.":"Selecciona el cliente.");return;}
    if(!f.wrIds||f.wrIds.length===0){window.alert("Marca al menos 1 WR.");return;}
    if(!f.consignatario.trim()){window.alert("Falta el consignatario.");return;}
    if(!f.receptorNombre.trim()){window.alert("Falta la persona que firma.");return;}
    const editing=!!f.editId;
    const id=editing?f.editId:dnBuildId();
    const now=new Date();
    const dn={
      id,fecha:editing?(deliveryNotes.find(n=>n.id===id)?.fecha||now):now,
      // Nuevos campos: tipo + guía + receptor estructurado. tipo es "entrega"
      // (cliente directo) o "despacho" (agente/oficina/autónomo). guiaId
      // identifica el embarque al que pertenecen los WR. receptorEntidad
      // describe a quién se le entregó la mercancía.
      tipo:f.tipo||"entrega",
      guiaId:f.guiaId||"",
      receptorEntidad:f.receptorEntidad||null,
      wrIds:f.wrIds,
      clienteId:f.clienteId||"",
      consignatario:f.consignatario.trim(),
      receptorNombre:f.receptorNombre.trim(),
      receptorDocumento:f.receptorDocumento.trim(),
      receptorTelefono:f.receptorTelefono.trim(),
      direccionEntrega:f.direccionEntrega.trim(),
      metodoEntrega:f.metodoEntrega||"retiro_oficina",
      transportista:f.transportista.trim(),
      notas:f.notas.trim(),
      usuario:currentUser.id||currentUser.email||"",
      firmaDataUrl:"",
      anulado:false,motivoAnulacion:"",
    };
    if(editing){
      setDeliveryNotes(p=>p.map(n=>n.id===id?{...n,...dn}:n));
    }else{
      setDeliveryNotes(p=>[dn,...p]);
      // Promover WRs → 21 Entregado
      const st21=getStatus("21");
      setWrList(p=>p.map(w=>{
        if(!dn.wrIds.includes(w.id))return w;
        const upd={...w,status:st21,historial:[...(w.historial||[]),{code:"21",label:"Entregado",fecha:now,user:currentUser.id,nota:`Nota ${id} → ${dn.receptorNombre} (${dn.consignatario})`}]};
        dbUpsertWR(upd);
        return upd;
      }));
    }
    dbUpsertDeliveryNote(dn);
    logAction(editing?"Editó entrega":"Creó entrega",`${id} · ${dn.wrIds.length} WR → ${dn.consignatario}`);
    setDnModal(null);
    if(!editing)window.alert(`✅ Nota de entrega ${id} creada.\n${dn.wrIds.length} WR → Entregado (21).`);
  };
  const dnAnular=(dn)=>{
    if(!hasPerm("revertir_entrega")&&!hasPerm("editar_entrega")){window.alert("Tu rol no tiene permiso.");return;}
    const motivo=window.prompt(`Anular nota de entrega ${dn.id}.\nMotivo (obligatorio):`);
    if(!motivo)return;
    const upd={...dn,anulado:true,motivoAnulacion:motivo};
    setDeliveryNotes(p=>p.map(n=>n.id===dn.id?upd:n));
    dbUpsertDeliveryNote(upd);
    // Revertir los WR al estado que tenían antes de esta nota
    const esDespSucursal=dn.tipo==="despacho"&&dn.receptorEntidad?.tipo==="oficina";
    const revertibles=esDespSucursal?["20.1","20.2"]:["21"];
    setWrList(p=>p.map(w=>{
      if(!dn.wrIds.includes(w.id))return w;
      if(!revertibles.includes(w.status?.code||""))return w; // si ya avanzó (22/23…), no revertir
      const h=w.historial||[];
      const idx=h.map(x=>String(x.nota||"")).map((t,i)=>t.includes(dn.id)?i:-1).filter(i=>i>=0).shift();
      const prevCode=idx>0?String(h[idx-1].code):"20";
      const stPrev=getStatus(["20","20.2"].includes(prevCode)?prevCode:"20");
      const u={...w,status:stPrev,historial:[...h,{code:stPrev.code,label:stPrev.label,fecha:new Date(),user:currentUser.id,nota:`${dn.tipo==="despacho"?"Despacho":"Entrega"} ${dn.id} anulado: ${motivo}`}]};
      dbUpsertWR(u);
      return u;
    }));
    logAction(dn.tipo==="despacho"?"Anuló despacho":"Anuló entrega",`${dn.id} — ${motivo}`);
  };
  const dnDelete=(dn)=>{
    if(!hasPerm("borrar_entrega")){window.alert("Tu rol no tiene permiso para borrar entregas.");return;}
    // Bloqueo simétrico a crDelete: una DN activa no puede borrarse sin anular
    // antes, porque los WRs quedan en estado 21 con la DN ya eliminada.
    if(!dn.anulado){
      window.alert(`No se puede borrar una nota de entrega activa.\n\nPrimero anúlala (✕) — eso revierte los WRs de Entregado (21) a Por Entrega (20). Después podrás borrarla permanentemente del historial.`);
      return;
    }
    if(!window.confirm(`¿Borrar permanentemente la nota de entrega ${dn.id}?\nYa está anulada, así que los WR ya fueron revertidos.`))return;
    setDeliveryNotes(p=>p.filter(n=>n.id!==dn.id));
    dbDeleteDeliveryNote(dn.id);
    logAction("Borró entrega",dn.id);
  };

  // ── LOADING MASTER · ESTATUS DE GUÍAS ───────────────────────────────────────
  // Una barra única de 12 fases por guía: 9 de origen/tránsito (GUIDE_PHASES,
  // canal "consolidacion", updateGuideStatus) + 3 de destino (RECEP_PHASES,
  // canal "recepcion", updateGuideStatusRecep). Mismas reglas que tenían las
  // barras cuando vivían dentro de Consolidación y Recepción:
  //  - Tránsito 2 (13) pide confirmación y bloquea las fases de origen.
  //  - Las fases de destino se habilitan desde Tránsito 2 y requieren
  //    permiso hacer_recepcion_dest. Con la guía en Almacén (17+) todo queda fijo.
  const renderGuiaEstatus=()=>{
    const q=(lmSearch||"").toLowerCase().trim();
    const guias=consolList.filter(c=>!c.archivada)
      .filter(c=>!q||[c.id,c.destino,c.awb,c.bl,c.numVuelo,c.tipoEnvio].some(v=>String(v||"").toLowerCase().includes(q)));
    const FASES=[
      ...GUIDE_PHASES.map(p=>({...p,canal:"consolidacion"})),
      ...RECEP_PHASES.map(p=>({...p,canal:"recepcion"})),
    ];
    const faseIdx=(code)=>{
      const g=GUIDE_PHASES.findIndex(p=>p.codes.includes(String(code)));
      if(g>=0)return g;
      const r=RECEP_PHASES.findIndex(p=>p.codes.includes(String(code)));
      if(r>=0)return GUIDE_PHASES.length+r;
      const n=parseFloat(code);
      if(!isNaN(n)&&n<=4)return -1;
      if(!isNaN(n)&&n>=17)return FASES.length; // ya en almacén: todas completadas
      return -1;
    };
    const puedeRecep=hasPerm("hacer_recepcion_dest");
    return(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:240}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>📶 Status de Guías</div>
        </div>
        <div style={{position:"relative"}}>
          <input className="fi" placeholder="Buscar guía, destino, AWB/BL, vuelo…" value={lmSearch} onChange={e=>setLmSearch(e.target.value)}
            style={{fontSize:14,padding:"7px 30px 7px 10px",width:280}}/>
          {lmSearch&&<span onClick={()=>setLmSearch("")} title="Limpiar búsqueda"
            style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"var(--t3)",fontSize:15}}>✕</span>}
        </div>
      </div>

      {guias.length===0?(
        <div className="card" style={{textAlign:"center",padding:50,color:"var(--t3)"}}>
          {q?"Ninguna guía activa coincide con la búsqueda.":"No hay guías activas."}
        </div>
      ):guias.map(c=>{
        const st=getStatus(guiaCode(c))||getStatus("4");
        const code=st?.code||"4";
        const n=parseFloat(code)||0;
        const cur=faseIdx(code);
        const origenBloqueado=n>=13;
        const enAlmacen=n>=17;
        const renderFase=(ph,i)=>{
          const isDone=cur>i, isCur=cur===i, isNext=cur+1===i;
          let editable,tip;
          if(ph.canal==="consolidacion"){
            editable=!origenBloqueado&&statusInChannel(ph.advance,"consolidacion");
            tip=origenBloqueado?`${ph.label} — bloqueada (la guía ya pasó a Tránsito 2)`
              :`${ph.label} — click para fijar esta fase${ph.advance==="13"?"\n⚠️ Al confirmar Tránsito 2 ya no se podrá retroceder.":""}`;
          }else{
            editable=origenBloqueado&&!enAlmacen&&puedeRecep&&statusInChannel(ph.advance,"recepcion");
            tip=enAlmacen?`${ph.label} — la guía ya está en almacén`
              :!origenBloqueado?`${ph.label} — se habilita cuando la guía llegue a Tránsito 2`
              :!puedeRecep?`${ph.label} — tu rol no tiene permiso de recepción en destino`
              :`${ph.label} — click para fijar esta fase`;
          }
          const onClick=editable?(()=>{
            if(ph.canal==="consolidacion"){
              if(ph.advance==="13"&&!window.confirm(`⚠️ Al fijar Tránsito 2, la guía ${c.id} quedará BLOQUEADA en las fases de origen/tránsito.\nNo podrás regresar a fases anteriores.\nSe habilitarán las fases de destino (Ad. Dest., Auditoría 3, Liberado 3).\n\n¿Confirmar?`))return;
              updateGuideStatus(c.id,ph.advance);
            }else{
              if(window.confirm(`¿Fijar el estado "${ph.label}" en la guía ${c.id}?\nSe aplicará a todos los WR pendientes de la guía.`))
                updateGuideStatusRecep(c.id,ph.advance);
            }
          }):undefined;
          const bg=isDone?"var(--navy)":isCur?"var(--cyan)":isNext&&editable?"#EEF3FF":"#fff";
          const color=isDone||isCur?"#fff":editable?"var(--t2)":"var(--t3)";
          return(
            <span key={ph.key} title={`${i+1}. ${tip}`} onClick={onClick}
              style={{flex:1,minWidth:62,cursor:editable?"pointer":"not-allowed",padding:"7px 2px 6px",textAlign:"center",
                background:bg,color,borderRadius:4,opacity:editable||isDone||isCur?1:.6,
                fontWeight:isCur?700:600,minHeight:50,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
                border:isCur?"1.5px solid var(--navy)":"1px solid transparent",transition:"all .15s",whiteSpace:"nowrap",overflow:"hidden"}}>
              <span style={{display:"block",fontSize:15,lineHeight:1}}>{ph.icon}</span>
              <span style={{display:"block",fontSize:10,marginTop:3,lineHeight:1.1,fontWeight:600}}>{ph.short}</span>
            </span>
          );
        };
        const grupo=(titulo,fases,offset)=>(
          <div style={{flex:fases.length,minWidth:0}}>
            <div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",letterSpacing:.6,textTransform:"uppercase",margin:"0 0 4px 2px"}}>{titulo}</div>
            <div style={{display:"flex",gap:2,background:"#F3F5F9",border:"1px solid #DFE4EE",borderRadius:6,padding:3}}>
              {fases.map((ph,k)=>renderFase(ph,offset+k))}
            </div>
          </div>
        );
        return(
          <div key={c.id} className="card" style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:10}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"3px 8px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:14}}>{c.id}</span>
              <TypeBadge t={c.tipoEnvio}/>
              <span style={{fontWeight:700,color:"var(--t1)"}}>{c.destino||"—"}</span>
              <span style={{fontSize:12,color:"var(--t3)"}}>{c.totalWR||0} WR · {c.totalCajas||0} cajas · {c.totalLb||0}lb</span>
              {(c.numVuelo||c.awb||c.bl)&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)"}}>{[c.numVuelo,c.awb||c.bl].filter(Boolean).join(" · ")}</span>}
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
                <StBadge st={st||{cls:"s3",label:c.status||"En preparación"}}/>
                <span style={{fontSize:12,color:"var(--t3)"}}>
                  {cur<0?"Pre-tránsito":cur>=FASES.length?"En almacén":`Fase ${cur+1}/${FASES.length}`}
                </span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto"}}>
              {grupo("Origen · Tránsito",GUIDE_PHASES.map(p=>({...p,canal:"consolidacion"})),0)}
              {grupo("Destino",RECEP_PHASES.map(p=>({...p,canal:"recepcion"})),GUIDE_PHASES.length)}
            </div>
          </div>
        );
      })}
    </div>
    );
  };

  // Detalle de guía (modal) — compartido por las pestañas de Loading Master.
  const renderGuiaDetalle=()=>(
    <>
        {/* MODAL — DETALLE DE GUÍA (todas: abiertas y cerradas). Se abre con el N° de guía del Master. */}
        {rdArchView&&(()=>{
          const c=rdArchView;
          const containers=Array.isArray(c.containers)?c.containers:[];
          return (
            <div className="ov" onClick={()=>setRdArchView(null)}>
              <div className="modal mlg" onClick={e=>e.stopPropagation()} style={{maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
                <div className="mhd">
                  <div className="mt">📦 Guía {c.id}{c.archivada?" — Cerrada":""}</div>
                  <div style={{display:"flex",gap:6}}>
                    <button className="mcl" onClick={()=>setRdArchView(null)}>✕</button>
                  </div>
                </div>
                <div style={{padding:"14px 16px",overflowY:"auto",flex:1}}>
                  {/* Información de la guía */}
                  <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px 18px",fontSize:13}}>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Origen:</span> <strong style={{color:"var(--t1)"}}>{guiaOrigen(c)}</strong></div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Destino:</span> <strong style={{color:"var(--t1)"}}>{c.destino||"—"}</strong></div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Tipo de envío:</span> <TypeBadge t={c.tipoEnvio}/></div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Estado:</span> {c.archivada?<strong style={{color:"var(--green)"}}>🗄️ Cerrada</strong>:<StBadge st={getStatus(guiaCode(c))||{cls:"s3",label:c.status||"En preparación"}}/>}</div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Fecha creación:</span> {fmtDate(c.fecha)}</div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Fecha salida:</span> {c.fechaSalida?fmtDate(c.fechaSalida):"—"}</div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>Fecha llegada:</span> {(()=>{const f=fechaLlegadaGuia(c);return f?`${fmtDate(f)} ${fmtTime(f)}`:"—";})()}</div>
                      {c.fechaRecibidaAlmacen&&<div><span style={{color:"var(--t3)",fontWeight:600}}>Recibida en almacén:</span> {fmtDate(c.fechaRecibidaAlmacen)} {fmtTime(c.fechaRecibidaAlmacen)}</div>}
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>N° vuelo / barco:</span> {c.numVuelo||"—"}</div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>AWB:</span> <span style={{fontFamily:"'DM Mono',monospace"}}>{c.awb||"—"}</span></div>
                      <div><span style={{color:"var(--t3)",fontWeight:600}}>BL:</span> <span style={{fontFamily:"'DM Mono',monospace"}}>{c.bl||"—"}</span></div>
                      {c.notas&&<div style={{gridColumn:"1/-1"}}><span style={{color:"var(--t3)",fontWeight:600}}>Notas:</span> {c.notas}</div>}
                    </div>
                  </div>

                  {/* Totales */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                    {[
                      ["Total WR",c.totalWR||0,"var(--navy)"],
                      ["Total cajas",c.totalCajas||0,"var(--t1)"],
                      ["Peso total",`${c.totalLb||0}lb`,"var(--t1)"],
                      ["Ft³ total",String(c.totalFt3||0),"var(--sky)"],
                    ].map(([l,v,col])=>(
                      <div key={l} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:8,padding:"8px 12px"}}>
                        <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6}}>{l}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:col,fontSize:18}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Contenedores con sus WRs */}
                  {containers.length===0?(
                    <div style={{textAlign:"center",padding:30,color:"var(--t3)"}}>Esta guía no tiene contenedores registrados.</div>
                  ):containers.map((ct,i)=>(
                    <div key={i} style={{border:"2px solid var(--navy)",borderRadius:10,marginBottom:12,overflow:"hidden"}}>
                      <div style={{background:"var(--navy)",padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <span style={{color:"#E5AE3A",fontWeight:700,fontSize:14}}>📦 Contenedor {i+1}{ct.tipo?` — ${ct.tipo}`:""}</span>
                        <div style={{flex:1}}/>
                        <span style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>
                          {[ct.largo,ct.ancho,ct.alto].filter(Boolean).join(" × ")}{[ct.largo,ct.ancho,ct.alto].filter(Boolean).length===3?" in":""}
                          {ct.sello?` · Sello: ${ct.sello}`:""}{ct.pesoLb?` · ${ct.pesoLb}lb`:""}
                        </span>
                      </div>
                      {(ct.wr||[]).length>0?(
                        <table className="ct" style={{fontSize:12}}>
                          <thead><tr><th>#</th><th>N° WR</th><th>Consignatario</th><th>Cajas</th><th>Peso</th><th>Ft³</th><th>Descripción</th></tr></thead>
                          <tbody>
                            {(ct.wr||[]).map((w,wi)=>(
                              <tr key={w.id}>
                                <td style={{color:"var(--t3)"}}>{wi+1}</td>
                                <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{w.id}</span></td>
                                <td style={{fontWeight:600}}>{w.consignee}</td>
                                <td style={{textAlign:"center"}}>{w.cajas}</td>
                                <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{w.pesoLb}lb</td>
                                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{w.ft3}</td>
                                <td style={{color:"var(--t2)"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ):(
                        <div style={{padding:14,textAlign:"center",color:"var(--t3)",fontSize:12}}>(contenedor sin WR)</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mft">
                  {!c.archivada&&hasPerm("borrar_guia")&&(
                    <button className="btn-s" style={{color:"var(--red)",borderColor:"var(--red)",marginRight:"auto"}}
                      onClick={()=>{if(guiaBorrar(c))setRdArchView(null);}}>🗑 Borrar</button>
                  )}
                  <button className="btn-s" onClick={()=>setRdArchView(null)}>Cerrar</button>
                  <button className="btn-c" onClick={()=>guiaEtiquetas(c)}>🏷️ Etiquetas</button>
                  {c.archivada&&hasPerm("imp_guia")&&(
                    <button className="btn-s" onClick={()=>printGuiaArchivada(c)}>🖨 Imprimir guía</button>
                  )}
                  {hasPerm("editar_guia")&&(
                    <button className="btn-p" onClick={()=>{setRdArchView(null);setLmTab("master");setTab("loadingmaster");guiaEditar(c);}}>✏️ Editar</button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );

  const renderLoadingMaster=()=>{
    const nAbiertas=consolList.filter(c=>!c.archivada).length;
    const nRecep=consolList.filter(c=>guiaGrupo(c)==="recepcion").length;
    return(
    <div className="cnt">
      <div style={{padding:"12px 18px 0"}}>
        <div className="tabs" style={{marginBottom:0}}>
          {[["master","🗂️ Master",consolList.length],["status","📶 Status",nAbiertas],["recepcion","📬 Recepción",nRecep]].map(([v,l,n])=>(
            <div key={v} className={`tab ${lmTab===v?"on":""}`} onClick={()=>setLmTab(v)}>{l}<span className="t-cnt">{n}</span></div>
          ))}
        </div>
      </div>
      {lmTab==="master"?renderConsolidacion():lmTab==="status"?renderGuiaEstatus():renderRecepcionDest()}
    </div>
    );
  };

  // modo: "pendientes" (pestaña Recepción) | "archivadas" (pestaña Cerradas).
  // Sin modo usa rdTab y muestra sus propios botones de pestaña.
  const renderRecepcionDest=(modo)=>{
    const vista=modo||rdTab;
    const q=(rdSearch||"").toLowerCase().trim();
    // Guías activas (no archivadas): se muestran para selección manual o escaneo
    const guiasActivas=consolList.filter(c=>!c.archivada);
    const guiasArchivadas=consolList.filter(c=>c.archivada);
    // Guías que corresponden a Recepción: abiertas y desde Tránsito 2 (13) en adelante.
    const guiasRecep=guiasActivas.filter(c=>guiaGrupo(c)==="recepcion");
    const guiaSel=guiasActivas.find(c=>c.id===rdSelGuia);
    // Solo se recibe cuando la guía llegó a Liberado 3 (16) o más.
    // (debe ir DESPUÉS de guiaSel: usarla antes rompía la pestaña en blanco)
    const puedeRecibir=!!guiaSel&&(parseFloat(guiaCode(guiaSel))||0)>=16;
    // WRs de la guía seleccionada
    const guiaWrIds=guiaSel?(guiaSel.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id)):[];
    // Checklist completo de la guía (WRs en su estado actual, sean pre-destino, 17, 18, etc.)
    const checklist=guiaSel?wrList.filter(w=>guiaWrIds.includes(w.id)&&(!q||[w.id,w.consignee,w.casillero,trkAll(w)].some(v=>String(v||"").toLowerCase().includes(q)))):[];
    // Sobrantes detectados para esta guía (linkeados vía sobranteDeGuia)
    const sobrantesGuia=guiaSel?wrList.filter(w=>w.sobranteDeGuia===guiaSel.id&&w.status?.code==="19"):[];
    // Stats de la guía seleccionada
    const chkCode=(w)=>w.status?.code||"";
    const nRecibidos=checklist.filter(w=>chkCode(w)==="17").length;
    const nFaltantes=checklist.filter(w=>["18","18.1","18.2","18.3"].includes(chkCode(w))).length;
    const nPorEntrega=checklist.filter(w=>["20","20.1","20.2","21","22","23","25"].includes(chkCode(w))).length;
    const nPendientes=checklist.filter(w=>{const c=chkCode(w);return c&&!["17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25"].includes(c);}).length;
    // Candidatos globales (cuando NO hay guía seleccionada): WRs en tránsito destino o liberados
    const candidatos=wrList.filter(w=>{
      const c=w.status?.code||"";
      // Códigos válidos en el modelo actual (sin "9.1", "10.1", "10.2"
      // que fueron retirados). "Tránsito destino" = últimos pasos antes
      // de llegar a almacén (14 Aduana Dest., 15 Aud.3, 16 Lib.3) + tránsito
      // final (13). Más liberados de tránsito previo (8, 12).
      const esTransitoDest=["13","14","15","16"].includes(c);
      const puedoRecibir=esTransitoDest||["8","12"].includes(c);
      if(!puedoRecibir)return false;
      if(!q)return true;
      return [w.id,w.consignee,w.casillero,trkAll(w)].some(v=>String(v||"").toLowerCase().includes(q));
    });
    const enAlmacen=wrList.filter(w=>w.status?.code==="17").slice(0,30);
    // Render de las acciones por WR en el checklist — depende del estado actual
    const renderChkActions=(w)=>{
      const c=chkCode(w);
      if(!hasPerm("hacer_recepcion_dest"))return<span style={{fontSize:12,color:"var(--t4)"}}>—</span>;
      // Pre-destino (14/15/16/13/etc) o estados de tránsito
      if(!["17","18","18.1","18.2","18.3","19","20","20.1","20.2","21","22","23","25"].includes(c)){
        if(guiaSel&&!puedeRecibir)return<span style={{fontSize:11,fontWeight:600,color:"#8A6100"}}>⏳ Esperando Liberado 3</span>;
        return(<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          <button className="btn-s" style={{fontSize:11,padding:"3px 7px",background:"#E8F5E9",borderColor:"#81C784",color:"#2E7D32"}}
            onClick={()=>recibirEnDestino(w,`Checklist guía ${guiaSel?.id||"?"}`)}>✅ Recibir</button>
          <button className="btn-s" style={{fontSize:11,padding:"3px 7px",background:"#FFEBEE",borderColor:"#E57373",color:"#C62828"}}
            onClick={()=>marcarFaltante(w,guiaSel?.id)}>❌ Faltante</button>
        </div>);
      }
      if(c==="17"){
        return(<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#2E7D32"}}>✓ Recibido</span>
          {hasPerm("editar_recepcion_dest")&&<button className="btn-s" style={{fontSize:11,padding:"3px 7px"}} onClick={()=>revertirRecepcion(w)}>↩️ Revertir</button>}
        </div>);
      }
      // Faltantes: se resuelven en Alertas (investigar, apareció, indemnizado, pérdida)
      if(["18","18.1"].includes(c)){
        return(<div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,color:c==="18"?"#C62828":"#E65100"}}>{c==="18"?"⚠️ Faltante":"🔍 En investigación"}</span>
          <button className="btn-s" style={{fontSize:11,padding:"3px 7px"}} onClick={()=>{setAlTab("abiertas");setAlSearch(w.id);setTab("alerts");}}>🔔 Ver en Alertas</button>
        </div>);
      }
      if(c==="18.2")return<span style={{fontSize:11,fontWeight:700,color:"#2E7D32"}}>💵 Indemnizado</span>;
      if(c==="18.3")return<span style={{fontSize:11,fontWeight:700,color:"var(--t3)"}}>❌ Pérdida cerrada</span>;
      if(c==="19")return<span style={{fontSize:11,fontWeight:700,color:"#7B1FA2"}}>➕ Sobrante</span>;
      return<span style={{fontSize:11,fontWeight:700,color:"var(--t3)"}}>{c} {w.status?.label||""}</span>;
    };
    return (
      <div className="page-scroll">
        {/* HEADER + TABS */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>{vista==="archivadas"?"🗄️ Guías Cerradas":"📬 Recepción en Almacén"}</div>
            <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>{vista==="archivadas"?"Guías cuya recepción ya se cerró (archivadas). Se pueden ver, imprimir o desarchivar.":"Guías desde Tránsito 2 en adelante. Recibe guías completas o WR individuales; al cerrar la recepción la guía pasa a Archivadas."}</div>
          </div>
          {!modo&&(
          <div style={{display:"flex",gap:4,background:"#EEF2F7",border:"1px solid #DCE2EC",borderRadius:8,padding:3}}>
            <button onClick={()=>setRdTab("pendientes")} style={{fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",background:rdTab==="pendientes"?"var(--navy)":"transparent",color:rdTab==="pendientes"?"#fff":"var(--t2)"}}>⏳ Pendientes ({guiasActivas.length})</button>
            <button onClick={()=>setRdTab("archivadas")} style={{fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",background:rdTab==="archivadas"?"var(--navy)":"transparent",color:rdTab==="archivadas"?"#fff":"var(--t2)"}}>📦 Archivadas ({guiasArchivadas.length})</button>
          </div>
          )}
        </div>


        {vista==="pendientes"&&<>
          {/* SCAN / MANUAL */}
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:8}}>🔎 Escanear o seleccionar guía</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignItems:"end"}}>
              <div>
                <div style={{fontSize:12,color:"var(--t3)",marginBottom:3,fontWeight:600}}>Por escaneo (N° guía / N° WR / Tracking)</div>
                <div style={{display:"flex",gap:6}}>
                  <input className="fi" placeholder="Escanear o escribir…" value={rdScan} onChange={e=>setRdScan(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==="Enter"&&hasPerm("hacer_recepcion_dest"))rdOnScan();}} disabled={!hasPerm("hacer_recepcion_dest")} style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:15,letterSpacing:1,padding:"8px 12px",opacity:hasPerm("hacer_recepcion_dest")?1:.5}} autoFocus/>
                  {hasPerm("hacer_recepcion_dest")&&<button className="btn-p" onClick={rdOnScan}>📥 Recibir</button>}
                </div>
              </div>
              <div>
                <div style={{fontSize:12,color:"var(--t3)",marginBottom:3,fontWeight:600}}>Seleccionar guía manualmente</div>
                <div style={{display:"flex",gap:6}}>
                  <select className="fi" value={rdSelGuia} onChange={e=>setRdSelGuia(e.target.value)} style={{flex:1,fontSize:14,padding:"8px 10px"}}>
                    <option value="">— Todas las guías en recepción —</option>
                    {guiasRecep.map(c=>(<option key={c.id} value={c.id}>{c.id} · {c.destino} · {c.totalWR||0} WR · {c.status||"—"}</option>))}
                  </select>
                  {guiaSel&&puedeRecibir&&hasPerm("hacer_recepcion_dest")&&(
                    <button className="btn-s" title={`Marcar como recibidos todos los ${guiaWrIds.length} WR pendientes de ${guiaSel.id} (bulk → estado 17 Almacén). No archiva.`}
                      onClick={()=>{if(window.confirm(`¿Marcar todos los WR pendientes de ${guiaSel.id} como recibidos (17 Almacén)?\nNo archivará la guía — luego usa "Cerrar Recepción" cuando estés conforme.`))recibirGuiaCompleta(guiaSel,"Recepción bulk (atajo checklist)");}}>
                      📥 Marcar todos recibidos
                    </button>
                  )}
                </div>
              </div>
            </div>
            {!hasPerm("hacer_recepcion_dest")&&<div style={{fontSize:13,color:"var(--red)",fontWeight:600,marginTop:6}}>⚠️ Tu rol no tiene permiso para registrar recepciones.</div>}
          </div>

          {/* GUÍAS EN RECEPCIÓN — listado estilo Dashboard; click = abrir checklist */}
          <div className="card" style={{marginBottom:14,padding:0}}>
            <div style={{padding:"10px 14px",fontSize:15,fontWeight:700,color:"var(--navy)",borderBottom:"1px solid var(--b1)"}}>
              📬 Guías en recepción ({guiasRecep.length})
            </div>
            {guiasRecep.length===0?(
              <div style={{textAlign:"center",padding:30,color:"var(--t3)",fontSize:13}}>No hay guías en Tránsito 2 o en destino.</div>
            ):(
              <table className="ct">
                <thead><tr>
                  <th>N° Guía</th><th>Fecha</th><th>Destino</th><th>Tipo</th><th>WR</th><th>Cajas</th>
                  <th>Vuelo/Barco</th><th>AWB / BL</th><th>Estado</th><th>Recibidos</th>
                </tr></thead>
                <tbody>
                  {guiasRecep.map(c=>{
                    const ids=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
                    const ws=wrList.filter(w=>ids.includes(w.id));
                    const rec=ws.filter(w=>["17","20","20.1","20.2","21","22","23","25"].includes(w.status?.code||"")).length;
                    const sel=rdSelGuia===c.id;
                    const sb=sel?{background:"#E8F0FE"}:{};
                    return(
                      <tr key={c.id} onClick={()=>setRdSelGuia(sel?"":c.id)} style={{cursor:"pointer"}}
                        title={sel?"Click para cerrar el checklist":"Click para abrir el checklist"}>
                        <td style={sb}><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:`${sel?2:1}px solid ${sel?"var(--navy)":"#B8C8F0"}`,fontSize:13}}>{c.id}</span></td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,...sb}}>{fmtDate(c.fecha)}</td>
                        <td style={{fontWeight:600,color:"var(--t1)",...sb}}>{c.destino}</td>
                        <td style={sb}><TypeBadge t={c.tipoEnvio}/></td>
                        <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)",...sb}}>{c.totalWR||ids.length}</td>
                        <td style={{textAlign:"center",...sb}}>{c.totalCajas||0}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)",...sb}}>{c.numVuelo||"—"}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",...sb}}>{c.awb||c.bl||"—"}</td>
                        <td style={sb}><StBadge st={getStatus(guiaCode(c))||{cls:"s3",label:c.status||"—"}}/></td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:rec===ws.length&&ws.length>0?"var(--green)":"var(--t2)",...sb}}>{rec}/{ws.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* CHECKLIST DE GUÍA SELECCIONADA */}
          {guiaSel&&(()=>{
            const stGuiaActual=WR_STATUSES.find(s=>s.label===guiaSel.status)||WR_STATUSES.find(s=>s.code==="13");
            const recPhaseIdx=currentRecepPhaseIdx(stGuiaActual?.code||"13");
            return(
            <div className="card" style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexWrap:"wrap"}}>
                <div style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>📋 Checklist {guiaSel.id} ({checklist.length} WR)</div>
                {/* Stats inline */}
                <div style={{display:"flex",gap:8,fontSize:13,alignItems:"center"}}>
                  <span style={{background:"#E8F5E9",color:"#2E7D32",padding:"2px 8px",borderRadius:10,fontWeight:700,border:"1px solid #A5D6A7"}}>✓ {nRecibidos} recibidos</span>
                  <span style={{background:"#FFEBEE",color:"#C62828",padding:"2px 8px",borderRadius:10,fontWeight:700,border:"1px solid #EF9A9A"}}>⚠️ {nFaltantes} faltantes</span>
                  <span style={{background:"#F3E5F5",color:"#7B1FA2",padding:"2px 8px",borderRadius:10,fontWeight:700,border:"1px solid #CE93D8"}}>➕ {sobrantesGuia.length} sobrantes</span>
                  {nPorEntrega>0&&<span style={{background:"#E3F2FD",color:"#1565C0",padding:"2px 8px",borderRadius:10,fontWeight:700,border:"1px solid #90CAF9"}}>🚚 {nPorEntrega} por entrega</span>}
                  <span style={{background:nPendientes>0?"#FFF3E0":"#F5F5F5",color:nPendientes>0?"#E65100":"var(--t3)",padding:"2px 8px",borderRadius:10,fontWeight:700,border:`1px solid ${nPendientes>0?"#FFCC80":"#E0E0E0"}`}}>⏳ {nPendientes} pendientes</span>
                </div>
                <input className="fi" placeholder="Buscar en checklist…" value={rdSearch} onChange={e=>setRdSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:200,marginLeft:"auto"}}/>
              </div>

              {/* Estado de la guía (se cambia en Loading Master › Status). Solo se
                  puede recibir cuando la guía llega a Liberado 3 (16). */}
              <div style={{marginBottom:10,padding:"8px 10px",background:puedeRecibir?"#EEF7F0":"#FFF8E6",border:`1px solid ${puedeRecibir?"#B8DCC0":"#F0D68A"}`,borderRadius:8,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>Estado de la guía:</span>
                <StBadge st={stGuiaActual||{cls:"s3",label:guiaSel.status||"—"}}/>
                <span style={{fontSize:12,color:puedeRecibir?"#1A6040":"#8A6100",fontWeight:600}}>
                  {puedeRecibir?"✅ Lista para recibir":"⏳ Aún no se puede recibir — la guía debe llegar a Liberado 3 (se cambia en la pestaña Status)"}
                </span>
                {!puedeRecibir&&<button type="button" className="btn-s" style={{fontSize:12,padding:"3px 10px",fontWeight:700,marginLeft:"auto"}}
                  onClick={()=>{setLmSearch(guiaSel.id);setLmTab("status");}}>📶 Ir a Status</button>}
              </div>

              <div style={{maxHeight:"62vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                <table className="wt">
                  <thead><tr>
                    <th style={{width:30,textAlign:"center"}}>#</th>
                    <th>N° WR</th><th>Consignatario</th><th>Casillero</th>
                    <th>Tracking</th><th>Estado</th><th style={{width:180}}>Acción</th>
                  </tr></thead>
                  <tbody>
                    {checklist.length===0
                      ?<tr><td colSpan={7} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay WR que coincidan con la búsqueda.</td></tr>
                      :checklist.map((w,i)=>{
                        const c=chkCode(w);
                        const rowBg=c==="17"?"#F1F8E9":["18","18.1","18.2","18.3"].includes(c)?"#FFF5F5":c==="19"?"#FAF4FC":["20","20.1","20.2","21","22","23","25"].includes(c)?"#F0F7FF":"";
                        return(
                          <tr key={w.id} style={{background:rowBg}}>
                            <td style={{textAlign:"center",fontSize:12,color:"var(--t3)",fontFamily:"'DM Mono',monospace"}}>{i+1}</td>
                            <td><span className="c-wr">{w.id}</span></td>
                            <td><span className="c-name">{w.consignee||"—"}</span></td>
                            <td><span className="c-cas">{w.casillero||"—"}</span></td>
                            <td><span className="c-trk">{w.tracking||"—"}</span></td>
                            <td><StBadge st={w.status}/></td>
                            <td>{renderChkActions(w)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* SOBRANTES DE ESTA GUÍA */}
              {sobrantesGuia.length>0&&(
                <div style={{marginTop:12,border:"1px dashed #CE93D8",borderRadius:8,padding:10,background:"#FCF5FF"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#7B1FA2",marginBottom:6}}>➕ Sobrantes detectados en {guiaSel.id} ({sobrantesGuia.length})</div>
                  <div style={{maxHeight:"40vh",overflow:"auto"}}>
                    <table className="wt">
                      <thead><tr><th>N° WR</th><th>Consignatario</th><th>Tracking</th><th style={{width:260}}>Resolución</th></tr></thead>
                      <tbody>
                        {sobrantesGuia.map(w=>(
                          <tr key={w.id}>
                            <td><span className="c-wr">{w.id}</span></td>
                            <td>{w.consignee||"—"}</td>
                            <td><span className="c-trk">{w.tracking||"—"}</span></td>
                            <td>{hasPerm("hacer_recepcion_dest")?(
                              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                {/* Los sobrantes se resuelven en Alertas */}
                                <button className="btn-s" style={{fontSize:11,padding:"3px 7px"}}
                                  onClick={()=>{setAlTab("abiertas");setAlSearch(w.id);setTab("alerts");}}>🔔 Resolver en Alertas</button>
                              </div>
                            ):<span style={{fontSize:12,color:"var(--t4)"}}>—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CERRAR RECEPCIÓN */}
              {hasPerm("hacer_recepcion_dest")&&(
                <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",paddingTop:10,borderTop:"1px solid var(--b2)"}}>
                  <div style={{fontSize:13,color:"var(--t3)"}}>
                    {nPendientes>0
                      ?<span style={{color:"#E65100",fontWeight:600}}>⚠️ Quedan {nPendientes} WR sin resolver. Márcalos como Recibidos o Faltantes antes de cerrar.</span>
                      :"Todos los WR están resueltos. Listos para cerrar la recepción."}
                  </div>
                  <div style={{flex:1}}/>
                  <button className="btn-p" disabled={nPendientes>0} style={{opacity:nPendientes>0?.45:1,fontSize:14,padding:"8px 18px"}}
                    onClick={()=>cerrarRecepcionGuia(guiaSel)}>
                    ✅ Cerrar Recepción de Guía ({nRecibidos} → Por Entrega)
                  </button>
                </div>
              )}
            </div>
            );
          })()}

          {/* LISTA GLOBAL (sin guía seleccionada) */}
          {!guiaSel&&(
            <div className="card" style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>⏳ WR pendientes en tránsito destino ({candidatos.length})</div>
                <input className="fi" placeholder="Buscar…" value={rdSearch} onChange={e=>setRdSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:220,marginLeft:"auto"}}/>
              </div>
              <div style={{maxHeight:"60vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                <table className="wt">
                  <thead><tr>
                    <th>N° WR</th><th>Consignatario</th><th>Casillero</th>
                    <th>Tracking</th><th>Estado actual</th><th style={{width:130}}>Acción</th>
                  </tr></thead>
                  <tbody>
                    {candidatos.length===0
                      ?<tr><td colSpan={6} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay WR pendientes de recepción.</td></tr>
                      :candidatos.map(w=>(
                        <tr key={w.id}>
                          <td><span className="c-wr">{w.id}</span></td>
                          <td><span className="c-name">{w.consignee||"—"}</span></td>
                          <td><span className="c-cas">{w.casillero||"—"}</span></td>
                          <td><span className="c-trk">{w.tracking||"—"}</span></td>
                          <td><StBadge st={w.status}/></td>
                          <td>{hasPerm("hacer_recepcion_dest")?<button className="btn-s" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>recibirEnDestino(w,"Recepción manual en destino")}>📥 Recibir</button>:<span style={{fontSize:12,color:"var(--t4)"}}>—</span>}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {enAlmacen.length>0&&(
            <div className="card">
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                <div style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>📦 Últimos WR recibidos en Almacén</div>
              </div>
              <div style={{maxHeight:"50vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                <table className="wt">
                  <thead><tr><th>N° WR</th><th>Consignatario</th><th>Casillero</th><th>Tracking</th><th>Estado</th><th style={{width:170}}>Acciones</th></tr></thead>
                  <tbody>
                    {enAlmacen.map(w=>(
                      <tr key={w.id}>
                        <td><span className="c-wr">{w.id}</span></td>
                        <td>{w.consignee||"—"}</td>
                        <td>{w.casillero||"—"}</td>
                        <td><span className="c-trk">{w.tracking||"—"}</span></td>
                        <td><StBadge st={w.status}/></td>
                        <td onClick={e=>e.stopPropagation()}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            <button className="btn-s" style={{fontSize:11,padding:"3px 7px"}}
                              onClick={()=>setSelWR(w)} title="Abrir detalle del WR">👁 Ver</button>
                            {hasPerm("hacer_recepcion_dest")&&(
                              <button className="btn-s" style={{fontSize:11,padding:"3px 7px",background:"#E3F2FD",borderColor:"#64B5F6",color:"#1565C0",fontWeight:700}}
                                title="Mover a Por Entrega (20)"
                                onClick={()=>{
                                  if(!window.confirm(`¿Pasar el WR ${w.id} a Por Entrega (20)?\n\nEsto se usa cuando un WR quedó atrapado en Almacén porque la guía no se cerró bien.\nQueda asentado en el historial.`))return;
                                  const st20=getStatus("20");
                                  if(!st20)return;
                                  const upd={...w,status:st20,historial:[...(w.historial||[]),{code:"20",label:"Por Entrega",fecha:new Date(),user:currentUser.id,nota:"Avance individual 17→20 desde Recepción en Almacén"}]};
                                  setWrList(p=>p.map(x=>x.id===w.id?upd:x));
                                  dbUpsertWR(upd);
                                  logAction("Pasó WR a Por Entrega (individual)",upd.id);
                                }}>🚚 Pasar a Por Entrega</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>}

        {vista==="archivadas"&&(()=>{
          const qa=(rdArchSearch||"").toLowerCase().trim();
          const tipoF=(rdArchTipo||"").trim();
          const fromTs=rdArchFrom?new Date(rdArchFrom+"T00:00:00").getTime():null;
          const toTs  =rdArchTo  ?new Date(rdArchTo  +"T23:59:59").getTime():null;
          const archFiltradas=guiasArchivadas.filter(c=>{
            if(qa&&!String(c.id||"").toLowerCase().includes(qa)&&!String(c.destino||"").toLowerCase().includes(qa))return false;
            if(tipoF&&c.tipoEnvio!==tipoF)return false;
            const ref=c.fechaRecibidaAlmacen?new Date(c.fechaRecibidaAlmacen).getTime():(c.fecha?new Date(c.fecha).getTime():0);
            if(fromTs&&ref<fromTs)return false;
            if(toTs&&ref>toTs)return false;
            return true;
          });
          return(
          <>
            <div className="card" style={{marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div>
                  <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,marginBottom:3}}>Buscar (N° guía o destino)</div>
                  <input className="fi" placeholder="Ej: GUI-2026-001 / Caracas…" value={rdArchSearch} onChange={e=>setRdArchSearch(e.target.value)} style={{fontSize:14,padding:"7px 10px",width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,marginBottom:3}}>Tipo de envío</div>
                  <select className="fi" value={rdArchTipo} onChange={e=>setRdArchTipo(e.target.value)} style={{fontSize:14,padding:"7px 10px",width:"100%"}}>
                    <option value="">— Todos —</option>
                    {SEND_TYPES.map(t=>(<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,marginBottom:3}}>Desde</div>
                  <input type="date" className="fi" value={rdArchFrom} onChange={e=>setRdArchFrom(e.target.value)} style={{fontSize:13,padding:"7px 10px",width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,marginBottom:3}}>Hasta</div>
                  <input type="date" className="fi" value={rdArchTo} onChange={e=>setRdArchTo(e.target.value)} style={{fontSize:13,padding:"7px 10px",width:"100%"}}/>
                </div>
                <button className="btn-s" style={{fontSize:12,padding:"7px 12px"}}
                  onClick={()=>{setRdArchSearch("");setRdArchTipo("");setRdArchFrom("");setRdArchTo("");}}>✕ Limpiar</button>
              </div>
              <div style={{fontSize:12,color:"var(--t3)",marginTop:6}}>
                {archFiltradas.length} de {guiasArchivadas.length} guías archivadas
              </div>
            </div>
          <div className="card" style={{padding:0}}>
            {archFiltradas.length===0?(
              <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>{guiasArchivadas.length===0?"Aún no hay guías recibidas/archivadas.":"Ninguna guía coincide con los filtros."}</div>
            ):(
              <table className="ct">
                <thead><tr>
                  <th>N° Guía</th><th>Destino</th><th>Tipo</th><th>WR</th><th>Cajas</th>
                  <th>Peso lb</th><th>Ft³</th><th>Fecha creación</th><th>Recibida en almacén</th>
                  <th style={{width:240}}>Acciones</th>
                </tr></thead>
                <tbody>
                  {archFiltradas.map(c=>(
                    <tr key={c.id} style={{cursor:"pointer"}} onClick={()=>setRdArchView(c)}
                      onMouseEnter={e=>{Array.from(e.currentTarget.cells).forEach(cell=>cell.style.background="#EEF3FF");}}
                      onMouseLeave={e=>{Array.from(e.currentTarget.cells).forEach(cell=>cell.style.background="");}}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{c.id}</span></td>
                      <td style={{fontWeight:600,color:"var(--t1)"}}>{c.destino}</td>
                      <td><TypeBadge t={c.tipoEnvio}/></td>
                      <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.totalWR||0}</td>
                      <td style={{textAlign:"center"}}>{c.totalCajas||0}</td>
                      <td style={{fontFamily:"'DM Mono',monospace"}}>{c.totalLb||0}lb</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{c.totalFt3||0}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(c.fecha)}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--navy)",fontWeight:600}}>{fmtDate(c.fechaRecibidaAlmacen)}</td>
                      <td onClick={e=>e.stopPropagation()}>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} title="Ver detalle de la guía"
                            onClick={()=>setRdArchView(c)}>👁 Ver</button>
                          {hasPerm("imp_guia")&&(
                            <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} title="Imprimir guía archivada"
                              onClick={()=>printGuiaArchivada(c)}>🖨 Imprimir</button>
                          )}
                          {hasPerm("editar_guia")&&(
                            <button className="btn-s" style={{fontSize:12,padding:"3px 8px",color:"var(--orange)",borderColor:"var(--orange)"}} title="Desarchivar (volver a pendientes)"
                              onClick={()=>{
                                // Desarchivar = revertir el cierre de recepción.
                                // Los WRs que pasaron a "Por Entrega" (20) por el cierre
                                // vuelven a "Almacén" (17). WRs que ya avanzaron más
                                // (21 Entregado, 22 Por Cobrar, 23 Cobrado, 25 Egresado)
                                // NO se tocan — esos eventos son posteriores y válidos.
                                const allWrIds=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
                                const wrsEnPorEntrega=wrList.filter(w=>allWrIds.includes(w.id)&&w.status?.code==="20");
                                const wrsBloqueados=wrList.filter(w=>allWrIds.includes(w.id)&&["21","22","23","25"].includes(w.status?.code||""));
                                if(!window.confirm(
                                  `¿Desarchivar la guía ${c.id}?\n`+
                                  `↩️ ${wrsEnPorEntrega.length} WR en Por Entrega volverán a Almacén (17)\n`+
                                  (wrsBloqueados.length>0?`🔒 ${wrsBloqueados.length} WR ya avanzaron a Entregado/Cobrado/Egresado y NO se tocarán\n`:"")+
                                  `\nLa guía vuelve a pendientes.`
                                ))return;
                                // Revertir 20 → 17 con entrada en historial
                                const st17=getStatus("17");
                                let revertidos=0;
                                setWrList(p=>p.map(w=>{
                                  if(!allWrIds.includes(w.id)||w.status?.code!=="20")return w;
                                  revertidos++;
                                  const upd={...w,status:st17,historial:[...(w.historial||[]),{code:"17",label:"Almacén",fecha:new Date(),user:currentUser.id,nota:`Desarchivado guía ${c.id} — reversión de cierre`}]};
                                  dbUpsertWR(upd);
                                  return upd;
                                }));
                                // Actualizar guía
                                const upd={...c,archivada:false,fechaRecibidaAlmacen:null,status:"Recibida"};
                                setConsolList(p=>p.map(x=>x.id===c.id?upd:x));
                                dbUpsertConsolidacion(upd);
                                logAction("Desarchivó guía",`${c.id} · ${wrsEnPorEntrega.length} WR revertidos 20→17`);
                              }}>↩️</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          </>
          );
        })()}

      </div>
    );
  };

  // ── ALERTAS — faltantes y sobrantes ─────────────────────────────────────────
  // Recepción solo DETECTA (faltante / sobrante); aquí la oficina los RESUELVE,
  // aunque la guía ya esté archivada. Un caso = un WR con historial de 18 o 19.
  const renderAlertas=()=>{
    const OPEN=["18","18.1","19"];
    const esFaltante=c=>["18","18.1","18.2","18.3"].includes(c);
    const guiaDeWR=(id)=>consolList.find(c=>(Array.isArray(c.wrIds)&&c.wrIds.includes(id))||(c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===id)));
    const cliDeWR=(w)=>clients.find(c=>c.id===w.clienteId)||clients.find(c=>c.casillero&&c.casillero===w.casillero);
    const userName=(id)=>{const u=clients.find(c=>c.id===id);return u?fullName(u):(id||"—");};
    const dias=(f)=>f?Math.max(0,Math.floor((Date.now()-new Date(f).getTime())/864e5)):0;
    const money=(n)=>`$${(n||0).toFixed(2)}`;
    const caso=(w)=>{
      const h=w.historial||[];
      const inicio=[...h].reverse().find(e=>["18","19"].includes(String(e.code)));
      const tipo=inicio?(String(inicio.code)==="19"?"sobrante":"faltante"):(w.status?.code==="19"?"sobrante":"faltante");
      const cierre=[...h].reverse().find(e=>e.alerta&&e.alerta!=="investigar"&&e.alerta!=="recobro");
      const ultNota=[...h].reverse().find(e=>e.nota)?.nota||"";
      const mC=h.reduce((t,e)=>t+(parseFloat(e.montoCliente)||0),0);
      const mT=h.reduce((t,e)=>t+(parseFloat(e.montoTransportista)||0),0);
      const g=tipo==="faltante"?guiaDeWR(w.id):(consolList.find(c=>c.id===w.sobranteDeGuia)||null);
      const gCorrecta=tipo==="sobrante"?(consolList.find(c=>c.id!==w.sobranteDeGuia&&((c.containers||[]).some(ct=>(ct.wr||[]).some(r=>r.id===w.id))))||null):null;
      return {w,tipo,inicio,cierre,ultNota,mC,mT,g,gCorrecta,cli:cliDeWR(w)};
    };
    const abiertos=wrList.filter(w=>OPEN.includes(w.status?.code||"")).map(caso);
    const cerrados=wrList.filter(w=>!OPEN.includes(w.status?.code||"")&&(w.historial||[]).some(e=>["18","19"].includes(String(e.code)))).map(caso)
      .sort((a,b)=>new Date(b.cierre?.fecha||0)-new Date(a.cierre?.fecha||0));
    const q=(alSearch||"").toLowerCase().trim();
    const lista=(alTab==="abiertas"?abiertos:cerrados)
      .filter(k=>alFiltro==="todos"||(alFiltro==="faltantes"?k.tipo==="faltante":k.tipo==="sobrante"))
      .filter(k=>!q||[k.w.id,k.w.consignee,k.w.casillero,trkAll(k.w),k.g?.id,k.cli&&fullName(k.cli)].some(v=>String(v||"").toLowerCase().includes(q)));
    if(alTab==="abiertas")lista.sort((a,b)=>new Date(a.inicio?.fecha||0)-new Date(b.inicio?.fecha||0)); // más antiguos primero
    const hoy=new Date();
    const cerradosMes=cerrados.filter(k=>{const f=k.cierre?.fecha&&new Date(k.cierre.fecha);return f&&f.getMonth()===hoy.getMonth()&&f.getFullYear()===hoy.getFullYear();}).length;
    const delAnio=cerrados.filter(k=>{const f=k.cierre?.fecha&&new Date(k.cierre.fecha);return f&&f.getFullYear()===hoy.getFullYear();});
    const pagadoAnio=delAnio.reduce((t,k)=>t+k.mC,0), recupAnio=delAnio.reduce((t,k)=>t+k.mT,0);
    const puede=hasPerm("hacer_recepcion_dest");
    const abrir=(w,accion)=>{setAlForm({montoCliente:"",montoTransportista:"",referencia:"",nota:""});setAlModal({w,accion});};
    const btn=(label,onClick,col)=><button className="btn-s" style={{fontSize:11,padding:"3px 7px",...(col?{color:col,borderColor:col}:{})}} onClick={onClick}>{label}</button>;
    const acciones=(k)=>{
      if(!puede)return <span style={{fontSize:12,color:"var(--t4)"}}>—</span>;
      const c=k.w.status?.code;
      if(alTab==="historial")return (["18.2","18.3"].includes(c))?btn("💲 Registrar recobro",()=>abrir(k.w,"recobro")):<span style={{fontSize:12,color:"var(--t4)"}}>—</span>;
      if(k.tipo==="faltante")return(<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {c==="18"&&btn("🔍 Investigar",()=>abrir(k.w,"investigar"),"#E65100")}
        {btn("📦 Apareció",()=>abrir(k.w,"aparecio"),"#2E7D32")}
        {btn("💵 Indemnizado",()=>abrir(k.w,"indemnizado"),"#1565C0")}
        {btn("❌ Pérdida",()=>abrir(k.w,"perdida"),"var(--red)")}
      </div>);
      return(<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {btn("🚚 Entregar",()=>abrir(k.w,"entregar"),"#1565C0")}
        {k.gCorrecta
          ? btn(`📦 Es de ${k.gCorrecta.id}`,()=>abrir(k.w,"otraguia"),"#2E7D32")
          : btn("↩️ Devolver a origen",()=>abrir(k.w,"devolver"))}
      </div>);
    };
    const Card=({ic,v,l,d,c})=>(
      <div className="stat" style={{cursor:"default"}}>
        <div className="stat-bar" style={{background:c,opacity:.7}}/>
        <div className="stat-ic">{ic}</div><div className="stat-v">{v}</div>
        <div className="stat-l">{l}</div><div className="stat-d">{d}</div>
      </div>
    );
    // ---- ventana de resolución ----
    const modal=alModal&&(()=>{
      const {w,accion}=alModal; const k=caso(w); const a=ALERTA_ACC[accion];
      const pideCli=accion==="indemnizado", pideTr=["indemnizado","perdida","recobro"].includes(accion);
      const notaObl=["investigar","perdida"].includes(accion);
      const titulo={investigar:"🔍 Abrir investigación",aparecio:"📦 El paquete apareció",indemnizado:"💵 Cerrar como indemnizado",perdida:"❌ Cerrar como pérdida",
        recobro:"💲 Registrar recobro al transportista",entregar:"🚚 Entregar sobrante al cliente",devolver:"↩️ Devolver sobrante a origen",otraguia:"📦 Recibir en su guía correcta"}[accion];
      const explica={investigar:"El caso queda abierto en investigación con tu nota.",aparecio:"El WR pasa a 17 Almacén y el caso se cierra.",
        indemnizado:"El WR pasa a 18.2 Indemnizado. Registra lo pagado al cliente y, si ya lo hay, lo recuperado del transportista.",
        perdida:"El WR pasa a 18.3 Pérdida cerrada, sin pago al cliente.",recobro:"Suma lo recuperado del transportista a este caso cerrado.",
        entregar:"El WR pasa a 20 Por Entrega y sigue como uno más.",devolver:"El WR vuelve a 3 Confirmado para poder meterlo en una guía nueva.",
        otraguia:`El WR pertenece a la guía ${k.gCorrecta?.id||""}: pasa a 17 Almacén en esa guía.`}[accion];
      const ok=()=>{
        if(notaObl&&!alForm.nota.trim()){window.alert("Escribe una nota.");return;}
        if(pideCli&&!(parseFloat(alForm.montoCliente)>0)){window.alert("Indica el monto pagado al cliente.");return;}
        if(accion==="recobro"&&!(parseFloat(alForm.montoTransportista)>0)){window.alert("Indica el monto recuperado.");return;}
        if(alertaResolver(w,accion,{...alForm,guia:accion==="otraguia"?k.gCorrecta?.id:""}))setAlModal(null);
      };
      return(
        <div className="ov">
          <div className="modal" style={{maxWidth:480}}>
            <div className="mhd"><div className="mt">{titulo} — {w.id}</div><button className="mcl" onClick={()=>setAlModal(null)}>✕</button></div>
            <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:13,color:"var(--t2)"}}>{k.cli?fullName(k.cli):(w.consignee||"—")} · {w.casillero||""} · {w.cajas||0} caja{w.cajas===1?"":"s"} · valor declarado ${(w.valor||0).toFixed(2)}</div>
              <div style={{fontSize:13,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,padding:"8px 10px"}}>{explica}</div>
              {pideCli&&<div className="fg"><div className="fl">Pagado al cliente (USD) *</div><input className="fi" type="number" min="0" step="0.01" value={alForm.montoCliente} onChange={e=>setAlForm(p=>({...p,montoCliente:e.target.value}))}/></div>}
              {pideTr&&<div className="fg"><div className="fl">Recuperado del transportista (USD){accion==="recobro"?" *":""}</div><input className="fi" type="number" min="0" step="0.01" value={alForm.montoTransportista} onChange={e=>setAlForm(p=>({...p,montoTransportista:e.target.value}))}/></div>}
              {pideTr&&<div className="fg"><div className="fl">Transportista / N° de reclamo</div><input className="fi" value={alForm.referencia} onChange={e=>setAlForm(p=>({...p,referencia:e.target.value}))}/></div>}
              <div className="fg"><div className="fl">Nota{notaObl?" *":""}</div><textarea className="fi" rows={3} value={alForm.nota} onChange={e=>setAlForm(p=>({...p,nota:e.target.value}))} placeholder={accion==="investigar"?"Seguro, causante, cláusula $100, otro…":""}/></div>
            </div>
            <div className="mft">
              <button className="btn-s" onClick={()=>setAlModal(null)}>Cancelar</button>
              <button className="btn-p" onClick={ok}>Confirmar</button>
            </div>
          </div>
        </div>
      );
    })();
    return(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:260}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🔔 Alertas — Faltantes y Sobrantes</div>
        </div>
        <div className="tabs" style={{marginBottom:0}}>
          <div className={`tab ${alTab==="abiertas"?"on":""}`} onClick={()=>setAlTab("abiertas")}>Abiertas<span className="t-cnt">{abiertos.length}</span></div>
          <div className={`tab ${alTab==="historial"?"on":""}`} onClick={()=>setAlTab("historial")}>Historial<span className="t-cnt">{cerrados.length}</span></div>
        </div>
      </div>

      <div className="stats stats-5" style={{padding:0,marginBottom:10}}>
        <Card ic="⚠️" v={abiertos.filter(k=>k.w.status?.code==="18").length} l="Faltantes" d="Sin investigar" c="#CC2233"/>
        <Card ic="🔍" v={abiertos.filter(k=>k.w.status?.code==="18.1").length} l="En investigación" d="Faltantes en curso" c="#E65100"/>
        <Card ic="➕" v={abiertos.filter(k=>k.tipo==="sobrante").length} l="Sobrantes" d="Por decidir" c="#7B1FA2"/>
        <Card ic="⏳" v={abiertos.length?Math.max(...abiertos.map(k=>dias(k.inicio?.fecha))):0} l="Días del más antiguo" d="Caso abierto más viejo" c="#C05800"/>
        <Card ic="✅" v={cerradosMes} l="Cerrados este mes" d={`${hoy.getFullYear()}: pagado ${money(pagadoAnio)} · recuperado ${money(recupAnio)}`} c="#1A8A4A"/>
      </div>

      <div className="card" style={{padding:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid var(--b1)",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:3,background:"var(--bg4)",borderRadius:7,padding:3,border:"1px solid var(--b1)"}}>
            {[["todos","Todos"],["faltantes","Faltantes"],["sobrantes","Sobrantes"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAlFiltro(v)} style={{padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:alFiltro===v?"var(--navy)":"transparent",color:alFiltro===v?"#fff":"var(--t2)"}}>{l}</button>
            ))}
          </div>
          <input className="fi" placeholder="Buscar WR, cliente, casillero, tracking o guía…" value={alSearch} onChange={e=>setAlSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:300,marginLeft:"auto"}}/>
          {alSearch&&<button className="btn-s" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>setAlSearch("")}>✕</button>}
        </div>
        {lista.length===0?(
          <div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>{alTab==="abiertas"?(q?"Ningún caso abierto coincide.":"✅ No hay faltantes ni sobrantes abiertos."):"Aún no hay casos cerrados."}</div>
        ):(
          <div style={{overflowX:"auto"}}>
          <table className="ct">
            <thead><tr>
              <th>Tipo</th><th>N° WR</th><th>Cliente</th><th>Guía</th><th>Estado</th>
              <th>{alTab==="abiertas"?"Abierto":"Cerrado"}</th>
              {alTab==="historial"&&<th style={{textAlign:"right"}}>Pagado cliente</th>}
              {alTab==="historial"&&<th style={{textAlign:"right"}}>Recuperado</th>}
              <th style={{minWidth:200}}>Última nota</th><th style={{minWidth:220}}>Acciones</th>
            </tr></thead>
            <tbody>
              {lista.map(k=>{
                const d=dias(k.inicio?.fecha);
                return(
                <tr key={k.w.id}>
                  <td style={{whiteSpace:"nowrap",fontWeight:700,color:k.tipo==="faltante"?"#C62828":"#7B1FA2"}}>{k.tipo==="faltante"?"⚠️ Faltante":"➕ Sobrante"}</td>
                  <td><span onClick={()=>setSelWR(k.w)} title="Abrir WR" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",cursor:"pointer",textDecoration:"underline"}}>{k.w.id}</span></td>
                  <td><div style={{fontWeight:600}}>{k.cli?fullName(k.cli):(k.w.consignee||"—")}</div><div style={{fontSize:11,color:"var(--t3)"}}>{k.w.casillero||""}</div></td>
                  <td style={{whiteSpace:"nowrap"}}>{k.g?<span onClick={()=>setRdArchView(k.g)} title="Abrir guía" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",cursor:"pointer",textDecoration:"underline"}}>{k.g.id}</span>:"—"}
                    {k.gCorrecta&&<div style={{fontSize:11,color:"#2E7D32"}}>es de {k.gCorrecta.id}</div>}</td>
                  <td><StBadge st={k.w.status}/></td>
                  <td style={{whiteSpace:"nowrap",fontSize:12}}>
                    {alTab==="abiertas"
                      ? <span style={{fontWeight:700,color:d>14?"var(--red)":d>7?"#E65100":"var(--t2)"}}>{d===0?"hoy":`hace ${d} día${d===1?"":"s"}`}</span>
                      : <>{fmtDate(k.cierre?.fecha)}<div style={{fontSize:11,color:"var(--t3)"}}>{userName(k.cierre?.user)}</div></>}
                  </td>
                  {alTab==="historial"&&<td style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{k.mC?money(k.mC):"—"}</td>}
                  {alTab==="historial"&&<td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:"var(--green)"}}>{k.mT?money(k.mT):"—"}</td>}
                  <td style={{fontSize:12,color:"var(--t2)",maxWidth:280,whiteSpace:"normal"}}>{k.ultNota||"—"}</td>
                  <td>{acciones(k)}</td>
                </tr>);
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
      {modal}
    </div>
    );
  };

  // ── CARGO RELEASE RENDER ────────────────────────────────────────────────────
  const renderCargoRelease=()=>{
    const q=(crSearch||"").toLowerCase().trim();
    // Candidatos: WR elegibles (estados 1, 2, 2.3, 3 — antes de Consolidación)
    const candidatos=wrList.filter(w=>{
      if(!crElegible(w))return false;
      if(!q)return true;
      return [w.id,w.consignee,w.casillero,trkAll(w),w.descripcion].some(v=>String(v||"").toLowerCase().includes(q));
    });
    const toggleSel=(id)=>setCrSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    const toggleAll=()=>{
      if(candidatos.every(w=>crSel.includes(w.id))) setCrSel(p=>p.filter(id=>!candidatos.some(w=>w.id===id)));
      else setCrSel(p=>[...new Set([...p,...candidatos.map(w=>w.id)])]);
    };
    // Histórico filtrado (oculto por defecto) — buscar por cliente/N° egreso y rango de fechas
    const qCli=(crHistCliente||"").toLowerCase().trim();
    const dDesde=crHistDesde?new Date(crHistDesde+"T00:00:00"):null;
    const dHasta=crHistHasta?new Date(crHistHasta+"T23:59:59"):null;
    const historico=cargoReleases.filter(c=>{
      if(qCli){
        const wrIds=c.wrIds||[];
        const consigs=wrIds.map(id=>{const w=wrList.find(x=>x.id===id);return w?(w.consignee||""):"";}).join(" ").toLowerCase();
        const hit=[c.id,c.agenteCarga,c.contacto,c.vehiculo,consigs].some(v=>String(v||"").toLowerCase().includes(qCli));
        if(!hit)return false;
      }
      if(dDesde||dHasta){
        const f=c.fecha?new Date(c.fecha):null;
        if(!f)return false;
        if(dDesde&&f<dDesde)return false;
        if(dHasta&&f>dHasta)return false;
      }
      return true;
    });
    const activos=cargoReleases.filter(c=>!c.anulado);
    const anulados=cargoReleases.filter(c=>c.anulado);
    return(
      <div className="page-scroll">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🚀 Cargo Release (Egresos)</div>
          </div>
          <div style={{display:"flex",gap:6,fontSize:13}}>
            <span style={{background:"#E8F5E9",color:"#2E7D32",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #A5D6A7"}}>✓ {activos.length} activos</span>
            <span style={{background:"#FFF3E0",color:"#E65100",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #FFCC80"}}>✕ {anulados.length} anulados</span>
          </div>
        </div>


        {/* CANDIDATOS — multi-selección estilo Reempaque */}
        <div className="card" style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:10}}>
            <div style={{fontSize:17,fontWeight:700,color:"var(--navy)"}}>📦 WR elegibles para egresar</div>
            <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
              <input className="fi" placeholder="Buscar WR, consignatario, tracking…" value={crSearch} onChange={e=>setCrSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:260}}/>
              <span style={{fontSize:13,color:"var(--t2)",fontWeight:600}}>Seleccionados: {crSel.length}</span>
              {hasPerm("hacer_egreso")&&<button className="btn-p" disabled={crSel.length===0} style={{opacity:crSel.length===0?.5:1}} onClick={()=>crOpenNew(crSel)}>🚀 Egresar ({crSel.length})</button>}
            </div>
          </div>
          <div style={{maxHeight:"50vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
            <table className="wt">
              <thead><tr>
                <th style={{width:36,textAlign:"center"}}>
                  <input type="checkbox"
                    checked={candidatos.length>0&&candidatos.every(w=>crSel.includes(w.id))}
                    onChange={toggleAll}/>
                </th>
                <th>N° WR</th><th>Fecha</th><th>Consignatario</th><th>Casillero</th>
                <th>Tracking</th><th>Descripción</th><th>Estado</th><th style={{textAlign:"right"}}>Cajas</th>
              </tr></thead>
              <tbody>
                {candidatos.length===0
                  ?<tr><td colSpan={9} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay WR elegibles para egreso.</td></tr>
                  :candidatos.map(w=>(
                    <tr key={w.id} className={crSel.includes(w.id)?"sel":""} onClick={()=>toggleSel(w.id)} style={{cursor:"pointer"}}>
                      <td style={{textAlign:"center"}}><input type="checkbox" checked={crSel.includes(w.id)} onChange={()=>toggleSel(w.id)}/></td>
                      <td><span className="c-wr">{w.id}</span></td>
                      <td><span className="c-dt">{fmtDate(w.fecha)}</span></td>
                      <td><span className="c-name">{w.consignee||"—"}</span></td>
                      <td><span className="c-cas">{w.casillero||"—"}</span></td>
                      <td><span className="c-trk">{w.tracking||"—"}</span></td>
                      <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                      <td><StBadge st={w.status}/></td>
                      <td style={{textAlign:"right",fontWeight:700}}>{w.cajas||0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HISTÓRICO — oculto por defecto, filtros por cliente/fecha */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:crHistOpen?10:0}}>
            <button
              onClick={()=>setCrHistOpen(p=>!p)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--navy)",padding:0}}>
              {crHistOpen?"▼":"▶"} 📜 Histórico de Cargo Release
            </button>
            <span style={{fontSize:12,color:"var(--t3)"}}>
              {crHistOpen?`${historico.length} resultado${historico.length===1?"":"s"}`:""}
            </span>
            {crHistOpen&&(
              <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <input className="fi" placeholder="Cliente, agente, N° egreso…" value={crHistCliente} onChange={e=>setCrHistCliente(e.target.value)} style={{fontSize:13,padding:"5px 8px",width:200}}/>
                <label style={{fontSize:11,color:"var(--t3)",fontWeight:600}}>Desde</label>
                <input type="date" className="fi" value={crHistDesde} onChange={e=>setCrHistDesde(e.target.value)} style={{fontSize:13,padding:"5px 8px"}}/>
                <label style={{fontSize:11,color:"var(--t3)",fontWeight:600}}>Hasta</label>
                <input type="date" className="fi" value={crHistHasta} onChange={e=>setCrHistHasta(e.target.value)} style={{fontSize:13,padding:"5px 8px"}}/>
                {(crHistCliente||crHistDesde||crHistHasta)&&
                  <button className="btn-s" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>{setCrHistCliente("");setCrHistDesde("");setCrHistHasta("");}}>✕ Limpiar</button>}
              </div>
            )}
          </div>
          {crHistOpen&&(
            <div style={{maxHeight:"60vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
              <table className="ct">
                <thead><tr>
                  <th>N° Egreso</th><th>Fecha</th><th>Agente</th><th>Contacto</th><th>Vehículo</th>
                  <th style={{textAlign:"center"}}>WR</th><th>Usuario</th><th>Estado</th><th style={{width:200}}>Acciones</th>
                </tr></thead>
                <tbody>
                  {historico.length===0?(
                    <tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay egresos en el rango filtrado.</td></tr>
                  ):historico.map(c=>(
                    <tr key={c.id} style={{background:c.anulado?"#FFF5F5":""}}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{c.id}</span></td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(c.fecha)} {fmtTime(c.fecha)}</td>
                      <td style={{fontWeight:600,color:"var(--t1)"}}>{c.agenteCarga||"—"}</td>
                      <td style={{fontSize:13,color:"var(--t2)"}}>{c.contacto||"—"}{c.documento?` · ${c.documento}`:""}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)"}}>{c.vehiculo||"—"}</td>
                      <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{(c.wrIds||[]).length}</td>
                      <td style={{fontSize:13,color:"var(--t3)"}}>{c.usuario||"—"}</td>
                      <td>{c.anulado
                        ?<span style={{fontSize:12,fontWeight:700,color:"#C62828"}}>✕ Anulado</span>
                        :<span style={{fontSize:12,fontWeight:700,color:"#2E7D32"}}>✓ Activo</span>}
                        {c.anulado&&c.motivoAnulacion&&<div style={{fontSize:11,color:"#C62828",marginTop:2}}>{c.motivoAnulacion}</div>}
                      </td>
                      <td>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>setCrPrint(c)} title="Ver / Imprimir nota">🖨️ Nota</button>
                          {!c.anulado&&hasPerm("editar_egreso")&&<button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>crOpenEdit(c)}>✏️ Editar</button>}
                          {!c.anulado&&hasPerm("editar_egreso")&&<button className="btn-s" style={{fontSize:12,padding:"3px 8px",background:"#FFF3E0",borderColor:"#FFB74D",color:"#E65100"}} onClick={()=>crAnular(c)}>✕ Anular</button>}
                          {hasPerm("borrar_egreso")&&<button className="btn-d" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>crDelete(c)}>🗑️</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── ENTREGAS Y DESPACHOS — vista por guía ─────────────────────────
  const DN_DOM_ORDEN={matriz:0,oficina:1,agente:2,autonomo:3};
  const DN_DOM_IC={matriz:"🏛️",oficina:"🏢",agente:"🤝",autonomo:"🧑‍💻"};
  const DN_DOM_LBL={matriz:"Clientes directos",oficina:"Oficina",agente:"Agente",autonomo:"Autónomo"};
  const dnCuenta=ws=>({
    total:ws.length,
    pend:ws.filter(w=>w.status?.code==="20").length,
    suc:ws.filter(w=>["20.1","20.2"].includes(w.status?.code||"")).length,
    ent:ws.filter(w=>["21","22","23"].includes(w.status?.code||"")).length,
  });
  const renderDnGuias=()=>{
    // Tarjetas de guías con carga por entregar
    if(!dnGuiaSel){
      const guias=consolList
        .map(g=>({g,ws:dnWrsDeGuia(g)}))
        .filter(x=>x.ws.some(w=>["20","20.1","20.2"].includes(w.status?.code||"")))
        .sort((a,b)=>new Date(b.g.fecha||0)-new Date(a.g.fecha||0));
      const bq=crearBuscador(dnBuscar);
      const lista=bq?guias.filter(x=>bq.codigo(x.g.id)||x.ws.some(w=>bq.codigo(w.id)||bq.codigo(trkAll(w))||bq.casillero(cliDeWR(w)?.casillero||w.casillero)||bq.nombre(cliDeWR(w)?fullName(cliDeWR(w)):w.consignee))):guias;
      return (
        <div>
          <input className="fi" placeholder="Buscar guía, WR, tracking, casillero o cliente…" value={dnBuscar} onChange={e=>setDnBuscar(e.target.value)}
            style={{fontSize:15,padding:"9px 12px",marginBottom:12,width:"100%"}}/>
          {lista.length===0
            ?<div className="card" style={{textAlign:"center",padding:50,color:"var(--t3)",fontSize:15}}>No hay guías con carga por entregar.</div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {lista.map(({g,ws})=>{
                const c=dnCuenta(ws);
                const pct=c.total?Math.round(c.ent*100/c.total):0;
                return (
                  <div key={g.id} className="card" onClick={()=>{setDnGuiaSel(g.id);setDnBuscar("");setDnAbiertos({});}}
                    style={{cursor:"pointer",padding:14,border:"1px solid var(--b1)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:18,color:"var(--navy)"}}>{g.id}</span>
                      <TypeBadge t={g.tipoEnvio}/>
                    </div>
                    <div style={{fontSize:14,color:"var(--t2)",marginBottom:10}}>📍 {g.destino||"—"} · {fmtDate(g.fecha)}</div>
                    <div style={{height:8,background:"var(--bg4)",borderRadius:4,overflow:"hidden",marginBottom:8}}>
                      <div style={{width:`${pct}%`,height:"100%",background:"var(--green)"}}/>
                    </div>
                    <div style={{display:"flex",gap:12,fontSize:13,flexWrap:"wrap"}}>
                      <span><b style={{color:"var(--orange)"}}>{c.pend}</b> por entregar</span>
                      {c.suc>0&&<span><b style={{color:"var(--sky)"}}>{c.suc}</b> en sucursal</span>}
                      <span><b style={{color:"var(--green)"}}>{c.ent}</b> / {c.total} entregados</span>
                    </div>
                  </div>
                );
              })}
            </div>}
        </div>
      );
    }

    // Panel de una guía
    const g=consolList.find(c=>c.id===dnGuiaSel);
    if(!g)return <div className="card" style={{padding:30,textAlign:"center"}}><button className="btn-s" onClick={()=>setDnGuiaSel(null)}>← Guías</button></div>;
    const ws=dnWrsDeGuia(g);
    const c=dnCuenta(ws);
    // Agrupar por dominio → cliente
    const bloques=new Map();
    ws.forEach(w=>{
      const dom=dnDomDeWR(w,g);
      const k=`${dom.tipo}:${dom.id}`;
      if(!bloques.has(k))bloques.set(k,{key:k,dom,clientes:new Map()});
      const cli=cliDeWR(w);
      const ck=cli?.id||`cas:${w.casillero||w.consignee||w.id}`;
      const b=bloques.get(k);
      if(!b.clientes.has(ck))b.clientes.set(ck,{key:ck,cli,nombre:cli?fullName(cli):(w.consignee||"—"),casillero:cli?.casillero||w.casillero||"",wrs:[]});
      b.clientes.get(ck).wrs.push(w);
    });
    const bq=crearBuscador(dnBuscar);
    const q=!!bq;
    const wrCoincide=w=>!!bq&&(bq.codigo(w.id)||bq.codigo(trkAll(w)));
    const clienteCoincide=cl=>!bq||bq.nombre(cl.nombre)||bq.casillero(cl.casillero)||cl.wrs.some(wrCoincide);
    const lista=[...bloques.values()]
      .map(b=>({...b,clientesArr:[...b.clientes.values()].sort((x,y)=>x.nombre.localeCompare(y.nombre))}))
      .map(b=>({...b,visibles:b.clientesArr.filter(clienteCoincide)}))
      .filter(b=>b.visibles.length>0)
      .sort((x,y)=>(DN_DOM_ORDEN[x.dom.tipo]??9)-(DN_DOM_ORDEN[y.dom.tipo]??9)||x.dom.nombre.localeCompare(y.dom.nombre));
    const chip=w=>{
      const nota=dnNotasDeWR(w.id)[0];
      return (
        <span key={w.id} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 8px",borderRadius:6,border:wrCoincide(w)?"2px solid var(--orange)":"1px solid var(--b1)",background:wrCoincide(w)?"#FFF3E0":"var(--bg2)",fontSize:13}}>
          <span onClick={()=>setSelWR(w)} title="Abrir WR" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",cursor:"pointer"}}>{w.id}</span>
          <StBadge st={w.status}/>
          {nota&&<span onClick={()=>setDnPrint(nota)} title={`Imprimir nota ${nota.id}`} style={{cursor:"pointer"}}>🖨️</span>}
        </span>
      );
    };
    const filaCliente=(b,cl)=>{
      const entregables=cl.wrs.filter(dnElegible);
      return (
        <div key={cl.key} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderTop:"1px solid var(--b2)",flexWrap:"wrap"}}>
          <div style={{minWidth:200,flex:"0 0 220px"}}>
            <div style={{fontWeight:700,fontSize:15,color:"var(--t1)"}}>{cl.nombre}</div>
            <div style={{fontSize:13,color:"var(--gold2)",fontFamily:"'DM Mono',monospace",fontWeight:700}}>#{cl.casillero||"—"}
              {(()=>{const d=dnDuenoDeCliente(cl.cli);return d&&!(d.tipo===b.dom.tipo&&d.id===b.dom.id)
                ?<span style={{marginLeft:8,fontFamily:"inherit",fontSize:11,fontWeight:700,color:"var(--t2)",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4,padding:"1px 6px"}}>{DN_DOM_IC[d.tipo]||"•"} {d.nombre}</span>:null;})()}
            </div>
          </div>
          <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap",minWidth:200}}>{cl.wrs.map(chip)}</div>
          {entregables.length>0&&hasPerm("entregar")&&(
            <button className="btn-p" style={{fontSize:13,padding:"6px 12px",background:"#2E7D32",borderColor:"#2E7D32"}}
              onClick={()=>dnAbrirConfirmar("entrega",g,cl.cli?{tipo:"cliente",id:cl.cli.id,nombre:cl.nombre}:{tipo:"cliente",id:"",nombre:cl.nombre},entregables,cl.cli)}>
              📦 Entregar ({entregables.length})
            </button>
          )}
        </div>
      );
    };
    return (
      <div>
        <div className="card" style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:12}}>
          <button className="btn-s" onClick={()=>{setDnGuiaSel(null);setDnBuscar("");}}>← Guías</button>
          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:20,color:"var(--navy)"}}>{g.id}</span>
          <TypeBadge t={g.tipoEnvio}/>
          <span style={{fontSize:14,color:"var(--t2)"}}>📍 {g.destino||"—"}</span>
          <span style={{fontSize:14,marginLeft:"auto",display:"flex",gap:12,flexWrap:"wrap"}}>
            <span><b style={{color:"var(--orange)"}}>{c.pend}</b> por entregar</span>
            {c.suc>0&&<span><b style={{color:"var(--sky)"}}>{c.suc}</b> en sucursal</span>}
            <span><b style={{color:"var(--green)"}}>{c.ent}</b> / {c.total} entregados</span>
          </span>
        </div>
        <input className="fi" autoFocus placeholder="WR o tracking (últimos dígitos), casillero o nombre…" value={dnBuscar} onChange={e=>setDnBuscar(e.target.value)}
          style={{fontSize:15,padding:"9px 12px",marginBottom:12,width:"100%"}}/>
        {lista.length===0&&<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>Sin coincidencias.</div>}
        {lista.map(b=>{
          const dom=b.dom;
          const todos=b.clientesArr.flatMap(x=>x.wrs);
          const cb=dnCuenta(todos);
          const paraDespachar=todos.filter(w=>w.status?.code==="20");
          const enCamino=todos.filter(w=>w.status?.code==="20.1");
          const esMatriz=dom.tipo==="matriz";
          // Abierto por defecto si hay carga en sucursal esperando entrega al cliente
          const porDefecto=todos.some(w=>w.status?.code==="20.2");
          const abierto=esMatriz||!!q||(dnAbiertos[b.key]??porDefecto);
          return (
            <div key={b.key} className="card" style={{padding:0,marginBottom:12,overflow:"hidden",borderLeft:`4px solid ${esMatriz?"var(--navy)":"#E65100"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--bg3)",flexWrap:"wrap",cursor:esMatriz?"default":"pointer"}}
                onClick={()=>{if(!esMatriz)setDnAbiertos(p=>({...p,[b.key]:!(p[b.key]??porDefecto)}));}}>
                <span style={{fontSize:20}}>{DN_DOM_IC[dom.tipo]||"•"}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:"var(--navy)"}}>{esMatriz?DN_DOM_LBL.matriz:dom.nombre}</div>
                  <div style={{fontSize:12,color:"var(--t3)"}}>{esMatriz?(empresaNombre||"Matriz"):DN_DOM_LBL[dom.tipo]} · {b.clientesArr.length} {b.clientesArr.length===1?"cliente":"clientes"} · {cb.total} WR</div>
                </div>
                <span style={{fontSize:13,display:"flex",gap:10,marginLeft:"auto",flexWrap:"wrap",alignItems:"center"}}>
                  <span><b style={{color:"var(--orange)"}}>{cb.pend}</b> pend.</span>
                  {cb.suc>0&&<span><b style={{color:"var(--sky)"}}>{cb.suc}</b> suc.</span>}
                  <span><b style={{color:"var(--green)"}}>{cb.ent}</b> entr.</span>
                  {!esMatriz&&enCamino.length>0&&hasPerm("entregar")&&(
                    <button className="btn-s" style={{fontSize:13,padding:"5px 10px",borderColor:"var(--sky)",color:"var(--sky)",fontWeight:700}}
                      onClick={e=>{e.stopPropagation();dnRecibirSucursal(dom,enCamino);}}>📥 Recibido en sucursal ({enCamino.length})</button>
                  )}
                  {!esMatriz&&paraDespachar.length>0&&hasPerm("entregar")&&(
                    <button className="btn-p" style={{fontSize:13,padding:"6px 12px",background:"#E65100",borderColor:"#E65100"}}
                      onClick={e=>{e.stopPropagation();dnAbrirConfirmar("despacho",g,dom,paraDespachar);}}>🚚 Despachar ({paraDespachar.length})</button>
                  )}
                  {!esMatriz&&<span style={{fontSize:14,color:"var(--t3)"}}>{abierto?"▲":"▼"}</span>}
                </span>
              </div>
              {abierto&&b.visibles.map(cl=>filaCliente(b,cl))}
            </div>
          );
        })}
      </div>
    );
  };
  const renderDeliveryNotes=()=>(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)",flex:1}}>📝 Entregas y Despachos</div>
        <div style={{display:"flex",gap:4,background:"var(--bg4)",borderRadius:7,padding:3,border:"1px solid var(--b1)"}}>
          {[{k:"guias",l:"🚢 Por guía"},{k:"historial",l:"📜 Historial"}].map(t=>(
            <button key={t.k} onClick={()=>setDnVista(t.k)}
              style={{padding:"5px 14px",borderRadius:5,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,
                background:dnVista===t.k?"var(--navy)":"transparent",color:dnVista===t.k?"#fff":"var(--t2)"}}>{t.l}</button>
          ))}
        </div>
      </div>
      {dnVista==="guias"?renderDnGuias():renderDnHistorial()}
    </div>
  );
  const renderDnHistorial=()=>{
    const q=(dnSearch||"").toLowerCase().trim();
    const tipoFiltro=dnTipoFiltro||"todos"; // "todos" | "entrega" | "despacho"
    const tipoDe=(n)=>n.tipo||"entrega"; // notas viejas sin campo tipo se tratan como "entrega"
    const activas=deliveryNotes.filter(n=>!n.anulado);
    const anuladas=deliveryNotes.filter(n=>n.anulado);
    const totEntrega =deliveryNotes.filter(n=>tipoDe(n)==="entrega"&&!n.anulado).length;
    const totDespacho=deliveryNotes.filter(n=>tipoDe(n)==="despacho"&&!n.anulado).length;
    const lista=deliveryNotes.filter(n=>{
      if(tipoFiltro!=="todos"&&tipoDe(n)!==tipoFiltro)return false;
      if(!q)return true;
      return [n.id,n.consignatario,n.receptorNombre,n.receptorDocumento,n.transportista,n.guiaId].some(v=>String(v||"").toLowerCase().includes(q));
    });
    const metodoLabel={retiro_oficina:"🏢 Retiro oficina",domicilio:"🏠 Domicilio",transportista:"🚚 Transportista",despacho:"🚚 Despacho"};
    const tipoBadge=(t)=>t==="despacho"
      ?<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"#FFF3E0",color:"#E65100",border:"1px solid #FFCC80",letterSpacing:.4}}>🚚 DESPACHO</span>
      :<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"#E8F5E9",color:"#2E7D32",border:"1px solid #A5D6A7",letterSpacing:.4}}>📦 ENTREGA</span>;
    return(
      <div>
        <div className="card" style={{marginBottom:10,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,background:"var(--bg4)",borderRadius:7,padding:"3px",border:"1px solid var(--b1)"}}>
            {[
              {k:"todos",l:"Todos",n:deliveryNotes.length},
              {k:"entrega",l:"📦 Entregas",n:totEntrega},
              {k:"despacho",l:"🚚 Despachos",n:totDespacho},
            ].map(t=>(
              <button key={t.k} onClick={()=>setDnTipoFiltro(t.k)}
                style={{padding:"4px 12px",borderRadius:5,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                  background:tipoFiltro===t.k?"var(--navy)":"transparent",
                  color:tipoFiltro===t.k?"#fff":"var(--t2)",display:"flex",alignItems:"center",gap:6}}>
                {t.l}
                <span style={{background:tipoFiltro===t.k?"rgba(255,255,255,.2)":"var(--bg5)",borderRadius:3,padding:"0 6px",fontSize:11,fontWeight:800}}>{t.n}</span>
              </button>
            ))}
          </div>
          <input className="fi" placeholder="Buscar por N° nota, consignatario, receptor, guía…"
            value={dnSearch} onChange={e=>setDnSearch(e.target.value)} style={{fontSize:14,flex:1,minWidth:240,padding:"8px 12px"}}/>
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {lista.length===0?(
            <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>No hay {tipoFiltro==="todos"?"entregas ni despachos":(tipoFiltro==="entrega"?"entregas":"despachos")} registrados.</div>
          ):(
            <table className="ct">
              <thead><tr>
                <th>N° Nota</th><th>Tipo</th><th>Fecha</th><th>Guía</th><th>Receptor</th><th>Método</th>
                <th style={{textAlign:"center"}}>WR</th><th>Factura</th><th>Usuario</th><th>Estado</th><th style={{width:200}}>Acciones</th>
              </tr></thead>
              <tbody>
                {lista.map(n=>{
                  const facsRel=facturas.filter(f=>f.status!=="anulada"&&Array.isArray(f.wrIds)&&(n.wrIds||[]).some(id=>f.wrIds.includes(id)));
                  const statusBadge={borrador:"📝 Borrador",emitida:"📤 Emitida",pagada_parcial:"💵 Parcial",pagada:"✅ Pagada"};
                  const t=tipoDe(n);
                  return (
                  <tr key={n.id} style={{background:n.anulado?"#FFF5F5":""}}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{n.id}</span></td>
                    <td>{tipoBadge(t)}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(n.fecha)} {fmtTime(n.fecha)}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",fontWeight:600}}>{n.guiaId||"—"}</td>
                    <td style={{fontWeight:600,color:"var(--t1)"}}>
                      {n.receptorEntidad?.nombre||n.consignatario||"—"}
                      {n.receptorNombre&&<div style={{fontSize:11,color:"var(--t3)",fontWeight:500}}>{n.receptorNombre}{n.receptorDocumento?` · ${n.receptorDocumento}`:""}</div>}
                    </td>
                    <td style={{fontSize:12,color:"var(--t2)"}}>{metodoLabel[n.metodoEntrega]||"—"}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{(n.wrIds||[]).length}</td>
                    <td style={{fontSize:12}}>
                      {facsRel.length===0
                        ?<span style={{color:"var(--t4)"}}>—</span>
                        :facsRel.map(f=>(
                            <div key={f.id} style={{fontFamily:"'DM Mono',monospace",color:"var(--navy)",fontWeight:600}}>
                              {f.id} <span style={{fontSize:11,color:f.status==="pagada"?"var(--green)":f.status==="pagada_parcial"?"var(--orange)":"var(--t3)",fontWeight:700,marginLeft:4}}>{statusBadge[f.status]||f.status}</span>
                            </div>
                          ))}
                    </td>
                    <td style={{fontSize:13,color:"var(--t3)"}}>{n.usuario||"—"}</td>
                    <td>{n.anulado
                      ?<span style={{fontSize:12,fontWeight:700,color:"#C62828"}}>✕ Anulada</span>
                      :<span style={{fontSize:12,fontWeight:700,color:"#2E7D32"}}>✓ Activa</span>}
                      {n.anulado&&n.motivoAnulacion&&<div style={{fontSize:11,color:"#C62828",marginTop:2}}>{n.motivoAnulacion}</div>}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>setDnPrint(n)} title="Ver / Imprimir nota">🖨️ Nota</button>
                        {!n.anulado&&hasPerm("editar_entrega")&&<button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>dnOpenEdit(n)}>✏️ Editar</button>}
                        {!n.anulado&&(hasPerm("revertir_entrega")||hasPerm("editar_entrega"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 8px",background:"#FFF3E0",borderColor:"#FFB74D",color:"#E65100"}} onClick={()=>dnAnular(n)}>✕ Anular</button>}
                        {hasPerm("borrar_entrega")&&<button className="btn-d" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>dnDelete(n)}>🗑️</button>}
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // ── NAV ─────────────────────────────────────────────────────────────────────
  // Shortcut handler: abre Configuración preseleccionando un tab
  const goSettingsTab=(t)=>{setTab("settings");setCfgTab(t);};

  const navGroups=[
    {label:"Principal",items:[
      {id:"dashboard",ic:"📊",l:"Dashboard"},
      {id:"estadocuenta",ic:"📄",l:"Estado de Cuenta"},
    ]},
    {label:"Operación",items:[
      {id:"scan",ic:"📡",l:"Recepción en Puerta",badge:scanLog.filter(s=>!s.registered).length>0?String(scanLog.filter(s=>!s.registered).length):null,red:true},
      {id:"loadingmaster",ic:"🚢",l:"Loading Master"},
      {id:"alerts",ic:"🔔",l:"Alertas",badge:(()=>{const n=wrList.filter(w=>["18","18.1","19"].includes(w.status?.code||"")).length;return n>0?String(n):null;})(),red:true},
      {id:"reempaque",ic:"🔁",l:"Reempaque"},
      {id:"cargorelease",ic:"🚀",l:"Cargo Release"},
    ]},
    {label:"Administración",items:[
      {id:"facturacion",ic:"🧾",l:"Facturación",onClick:()=>{setTab("contabilidad");setContabTab("porguia");setFacGuiaSel(null);},activeWhen:()=>tab==="contabilidad"&&["porguia","facturas"].includes(contabTab)},
      {id:"entregasydespachos",ic:"📝",l:"Entregas y Despachos"},
      {id:"contabilidad",ic:"💰",l:"Contabilidad",onClick:()=>{setTab("contabilidad");setContabTab("cuentas");setCuadreSel(null);},activeWhen:()=>tab==="contabilidad"&&!["porguia","facturas"].includes(contabTab)},
    ]},
    {label:"Gestión",items:[
      {id:"clients",ic:"👥",l:"Clientes & Usuarios"},
      {id:"agentes",ic:"🤝",l:"Agentes",onClick:()=>goSettingsTab("agentes"),activeWhen:()=>tab==="settings"&&cfgTab==="agentes"},
      {id:"oficinas",ic:"🏢",l:"Oficinas",onClick:()=>goSettingsTab("oficinas"),activeWhen:()=>tab==="settings"&&cfgTab==="oficinas"},
      {id:"etiquetas",ic:"🖨️",l:"Impresión"},
      {id:"tracking",ic:"🔍",l:"Tracking"},
      {id:"pickup",ic:"🚐",l:"Pick-up"},
    ]},
    {label:"Herramientas",items:[
      {id:"calculadora",ic:"🧮",l:"Calculadora"},
      {id:"chat",ic:"💬",l:"Chat Interno"},
      {id:"docs",ic:"📋",l:"Documentos"},
      {id:"reports",ic:"📈",l:"Reportes"},
    ]},
    {label:"Sistema",items:[
      ...(canAdmin?[{id:"settings",ic:"⚙️",l:"Configuración"}]:[]),
      {id:"roles",ic:"🔐",l:"Roles & Permisos"},
      {id:"actividad",ic:"📋",l:"Actividad",onClick:()=>goSettingsTab("actividad"),activeWhen:()=>tab==="settings"&&cfgTab==="actividad"},
    ]},
  ];
  // Cada menú se muestra solo si el rol tiene al menos uno de estos permisos
  // (se asignan en Roles & Permisos). Los que no aparecen aquí se ven siempre.
  const NAV_PERMS={
    dashboard:["ver_wr"],estadocuenta:["ver_estado_cuenta","ver_estado_cliente","ver_estado_agente","ver_estado_oficina"],
    scan:["ver_rp"],loadingmaster:["ver_guia","ver_recepcion_dest"],alerts:["ver_alertas"],
    reempaque:["ver_reempaque"],cargorelease:["ver_egreso"],
    entregasydespachos:["ver_entrega"],facturacion:["ver_factura"],contabilidad:["ver_cuentas_cobrar","ver_factura"],
    clients:["ver_bd_clientes","ver_usuarios"],agentes:["ver_agente"],oficinas:["ver_oficina"],
    etiquetas:ALL_PERMS.filter(p=>p.startsWith("imp_")),tracking:["ver_tracking"],pickup:["ver_pickup"],
    calculadora:["calculadora"],chat:ALL_PERMS.filter(p=>p.startsWith("chat_")),docs:["ver_documentos"],reports:["ver_reportes"],
    roles:["gestionar_roles"],actividad:["registro_actividad"],
  };
  const navVisible=n=>!NAV_PERMS[n.id]||NAV_PERMS[n.id].some(p=>hasPerm(p));

  const PAGE_TITLES={dashboard:"Dashboard General",loadingmaster:"Loading Master",scan:"Recepción en Puerta",etiquetas:"Imprimir Etiquetas",clients:"Clientes & Usuarios",estadocuenta:"Estado de Cuenta",roles:"Roles & Permisos",consolidation:"Consolidación",tracking:"Tracking",pickup:"Pick-up",contabilidad:"Contabilidad",calculadora:"Calculadora de Envío",chat:"Chat Interno",docs:"Documentos",reports:"Reportes",alerts:"Alertas",settings:"Configuración",reempaque:"Reempaque",recepciondest:"Recepción en Almacén",cargorelease:"Cargo Release (Egreso)",entregas:"Notas de Entrega",entregasydespachos:"Entregas y Despachos",facturacion:"Facturación"};

  const renderPage=()=>{
    if(!navVisible({id:tab}))return (
      <div style={{padding:60,textAlign:"center",color:"var(--t3)"}}>
        <div style={{fontSize:42}}>🔒</div>
        <div style={{fontSize:16,fontWeight:600,marginTop:8}}>Tu rol no tiene permiso para ver esta sección.</div>
      </div>
    );
    switch(tab){
      case "dashboard":    try{return <div className="cnt">{renderDash()}</div>;}catch(e){return <div style={{padding:20,color:"red"}}><b>Dashboard error:</b><pre>{String(e)}</pre></div>;}
      case "scan":         return renderScan();
      case "etiquetas":    return renderEtiquetasPage();
      case "clients":      return renderClients();
      case "estadocuenta": return renderEstadoCuenta();
      case "loadingmaster":return renderLoadingMaster();
      case "tracking":     return renderTracking();
      case "pickup":       return renderPickup();
      case "contabilidad": return renderContabilidad();
      case "calculadora":  return renderCalculadora();
      case "chat":         return <div className="cnt" style={{display:"flex",flexDirection:"column",overflow:"hidden",flex:1}}>{renderChat()}</div>;
      case "roles":        return renderRoles();
      case "settings":     return renderSettings();
      case "reempaque":    return renderReempaque();
      case "cargorelease": return renderCargoRelease();
      case "entregasydespachos": return renderDeliveryNotes();
      case "alerts":       return renderAlertas();
      // case "entregas" — Notas de Entrega también accesible desde Impresión (etqMode="entregas")
      default:             return <div className="page-scroll"><div className="card" style={{textAlign:"center",padding:60,color:"var(--t3)"}}>{PAGE_TITLES[tab]} — Módulo próximamente</div></div>;
    }
  };
  return (
    <><style>{S}</style>
    <div className="app" onClick={()=>setDimOpen(null)} translate="no" lang="en">
      {/* SIDEBAR */}
      <div className="sb">
        <div className="sb-logo">
          <div className="sb-mark">N/X</div>
          <div><div className="sb-name">E<span>N</span>E<span>X</span></div><div className="sb-sub">Int&apos;l Courier</div></div>
        </div>
        <nav className="sb-nav">
          {navGroups.map(g=>({...g,items:g.items.filter(navVisible)})).filter(g=>g.items.length>0).map(g=>(
            <div key={g.label}>
              <div className="sb-lbl">{g.label}</div>
              {g.items.map(n=>{
                const isActive=n.activeWhen?n.activeWhen():(tab===n.id);
                return (
                <div key={n.id} className={`ni ${isActive?"on":""}`} onClick={n.onClick?n.onClick:()=>setTab(n.id)}>
                  <span className="ni-ic">{n.ic}</span>
                  <span className="ni-lbl">{n.l}</span>
                  {n.badge&&n.badge!=="0"&&<span className={`n-bx${n.red?" r":""}`}>{n.badge}</span>}
                </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="u-row">
            <div className="u-av">{initials(currentUser)}</div>
            <div style={{flex:1,minWidth:0}}><div className="u-nm">{currentUser.primerNombre} {currentUser.primerApellido}</div><div className="u-rl">{currentUser.email}</div></div>
            <RoleBadge code={currentUser.rol}/>
          </div>
          <button className="btn-s" style={{width:"100%",marginTop:8,fontSize:13,padding:"6px 10px"}} onClick={()=>setPwModal({a:"",b:"",err:"",ok:false})}>🔑 Cambiar contraseña</button>
          <button className="btn-d" style={{width:"100%",marginTop:6,fontSize:13,padding:"6px 10px"}} onClick={doLogout}>🚪 Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div className="tb-ttl">{tab==="contabilidad"&&["porguia","facturas"].includes(contabTab)?"Facturación":(PAGE_TITLES[tab]||tab)}</div>
          <div className="tb-srch">
            <span style={{color:"var(--t3)"}}>🔍</span>
            <input placeholder="Buscar en el sistema…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <div className="tb-ic">🌐</div>
          <div className="tb-ic">🔔<div className="tb-dot"/></div>
          <div style={{width:28,height:28,borderRadius:6,background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,cursor:"pointer",color:"#fff"}}>{initials(currentUser)}</div>
        </div>
        {renderPage()}
      </div>

      {/* MODALS */}
      {/* Detalle de guía — se abre desde Loading Master, el Dashboard (columna Guía)
          y el Estado de Cuenta (columna N° Guía), encima de la pantalla actual. */}
      {renderGuiaDetalle()}
      {/* VENTANA DE ATAJO — Reempaque / Cargo Release encima de la pantalla actual.
          El módulo se renderiza igual que a pantalla completa; al cerrar se vuelve
          exactamente a donde estabas (Dashboard, WR, lo que sea). */}
      {quickTab&&(
        <div className="ov" style={{alignItems:"stretch",padding:10}}>
          <div className="modal" style={{maxWidth:1600,padding:16,display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 20px)"}}>
            <div className="mhd">
              <div className="mt">{quickTab==="reempaque"?"🔁 Reempaque":"🚀 Cargo Release (Egreso)"}</div>
              <button type="button" className="btn-s" title="Abrir el módulo a pantalla completa"
                onClick={()=>{const t=quickTab;setQuickTab(null);setTab(t);}}>⛶ Pantalla completa</button>
              <button type="button" className="mcl" title="Cerrar y volver" onClick={()=>setQuickTab(null)}>✕</button>
            </div>
            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",overflow:"hidden",margin:"0 -16px -16px"}}>
              {quickTab==="reempaque"?renderReempaque():renderCargoRelease()}
            </div>
          </div>
        </div>
      )}
      {showNewWR&&renderNewWRModal()}
      {selWR&&renderWRDetail()}
      {showStatModal&&renderStatModal()}
      {webcamOpen&&<WebcamCaptureModal onClose={()=>setWebcamOpen(null)} onCapture={(file)=>{
        // El modal de cámara web sirve tanto para fotos de caja (Nuevo WR)
        // como para fotos de contenedor (Nuevo Embarque). Ruteo según la
        // propiedad presente en webcamOpen.
        if(typeof webcamOpen.containerIdx==='number'){
          addFotosToContainer(webcamOpen.containerIdx,[file],"webcam");
        } else if(typeof webcamOpen.cajaIdx==='number'){
          addFotosToCaja(webcamOpen.cajaIdx,[file],"webcam");
        }
        setWebcamOpen(null);
      }}/>}
      {photoGalleryOpen&&<PhotoGalleryModal wrId={photoGalleryOpen.wrId} currentUser={currentUser} onClose={()=>setPhotoGalleryOpen(null)}/>}

      {/* TIMELINE RÁPIDA — abierta desde el botón 📅 en filas (sin abrir WR Modal completo) */}
      {timelineWR&&(()=>{
        const w=timelineWR;
        return (
          <div className="ov" onClick={()=>setTimelineWR(null)}>
            <div className="modal mmd" onClick={e=>e.stopPropagation()} style={{maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
              <div className="mhd">
                <div className="mt">📅 Historia y Fechas — WR {w.id}</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn-s" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>{setSelWR(w);setTimelineWR(null);}} title="Abrir detalle completo del WR">📋 Ver WR completo</button>
                  <button className="mcl" onClick={()=>setTimelineWR(null)}>✕</button>
                </div>
              </div>
              <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>
                <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <StBadge st={w.status}/>
                  <span style={{fontWeight:600,color:"var(--t1)"}}>{w.consignee||"—"}</span>
                  <span style={{color:"var(--t3)",fontFamily:"'DM Mono',monospace"}}>{w.casillero||""}</span>
                  <div style={{flex:1}}/>
                  <span style={{fontSize:12,color:"var(--t3)"}}>💳 {w.tipoPago||"—"} · {w.tipoEnvio||"—"}</span>
                </div>
                {renderWRTimeline(w)}
              </div>
            </div>
          </div>
        );
      })()}

      {/* FORZAR ESTADO — modal (reemplaza window.prompt que truncaba la lista) */}
      {overrideModal&&(()=>{
        const m=overrideModal;
        const w=m.wr;
        const stTarget=WR_STATUSES.find(s=>s.code===m.codigoDestino);
        const sameAsCurrent=stTarget&&w.status?.code===stTarget.code;
        // Agrupar estados por phase para presentar
        const grupos=[
          {label:"📍 Origen",states:WR_STATUSES.filter(s=>s.phase==="origen")},
          {label:"🛫 Tránsito",states:WR_STATUSES.filter(s=>s.phase==="transito")},
          {label:"📥 Destino",states:WR_STATUSES.filter(s=>s.phase==="destino")},
          {label:"⚠️ Excepciones",states:WR_STATUSES.filter(s=>s.phase==="excep")},
          {label:"🚚 Entrega / Cierre",states:WR_STATUSES.filter(s=>s.phase==="entrega")},
        ];
        const aplicar=()=>{
          if(!stTarget){window.alert("Seleccionas un estado destino.");return;}
          if(sameAsCurrent){window.alert("El WR ya está en ese estado.");return;}
          if(!m.motivo||!m.motivo.trim()){window.alert("El motivo es obligatorio. Quedará en el historial.");return;}
          const upd={...w,status:stTarget,historial:[...(w.historial||[]),{code:stTarget.code,label:stTarget.label,fecha:new Date(),user:currentUser.id,nota:`OVERRIDE por ${currentUser.id||currentUser.email}: ${m.motivo.trim()}`}]};
          setWrList(p=>p.map(x=>x.id===upd.id?upd:x));
          if(selWR&&selWR.id===upd.id)setSelWR(upd);
          dbUpsertWR(upd);
          logAction(`Override estado → ${stTarget.label}`,`${upd.id} · ${m.motivo.trim()}`);
          setOverrideModal(null);
        };
        return (
          <div className="ov" onClick={()=>setOverrideModal(null)}>
            <div className="modal mmd" onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div className="mt">🛠 Forzar Estado — WR {w.id}</div>
                <button className="mcl" onClick={()=>setOverrideModal(null)}>✕</button>
              </div>
              <div style={{padding:"14px 18px"}}>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:13,color:"var(--t3)",fontWeight:600,marginBottom:4}}>Estado actual</div>
                  <div style={{padding:"8px 12px",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,display:"flex",alignItems:"center",gap:8}}>
                    <StBadge st={w.status}/>
                    <span style={{fontFamily:"'DM Mono',monospace",color:"var(--t2)",fontSize:13}}>{w.status?.code||"—"}</span>
                  </div>
                </div>
                <div className="fg" style={{marginBottom:14}}>
                  <div className="fl">Estado destino *</div>
                  <select className="fs" value={m.codigoDestino} onChange={e=>setOverrideModal(p=>({...p,codigoDestino:e.target.value}))}>
                    <option value="">— Seleccionar estado —</option>
                    {grupos.map(g=>(
                      <optgroup key={g.label} label={g.label}>
                        {g.states.map(s=>(
                          <option key={s.code} value={s.code} disabled={w.status?.code===s.code}>
                            {s.code} {s.label}{w.status?.code===s.code?" (actual)":""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {stTarget&&!sameAsCurrent&&(
                  <div style={{padding:"8px 12px",background:"#E8F0FE",border:"1px solid #90B8F0",borderRadius:6,marginBottom:14,fontSize:13,color:"#1A6090",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <StBadge st={w.status}/><span>→</span><StBadge st={stTarget}/>
                  </div>
                )}
                <div className="fg" style={{marginBottom:6}}>
                  <div className="fl">Motivo del override *</div>
                  <textarea className="fi" rows={3} placeholder="Ej: WR quedó atrapado en Almacén tras cierre fallido de guía; movido manualmente a Por Entrega."
                    value={m.motivo} onChange={e=>setOverrideModal(p=>({...p,motivo:e.target.value}))}
                    style={{resize:"vertical",minHeight:64,fontFamily:"inherit",fontSize:14,lineHeight:1.5}}/>
                </div>
              </div>
              <div className="mft">
                <button className="btn-s" onClick={()=>setOverrideModal(null)}>Cancelar</button>
                <button className="btn-p" style={{background:"var(--orange)"}} onClick={aplicar} disabled={!stTarget||sameAsCurrent||!m.motivo.trim()}>🛠 Aplicar Override</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CARGO RELEASE INDIVIDUAL — formulario simplificado */}
      {crIndivModal&&(()=>{
        const f=crIndivModal;
        return (
          <div className="ov" onClick={()=>setCrIndivModal(null)}>
            <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div className="mt">🚀 Cargo Release — {f.wrs.length===1?`WR ${f.wrs[0].id}`:`${f.wrs.length} WR`}</div>
                <button className="mcl" onClick={()=>setCrIndivModal(null)}>✕</button>
              </div>
              <div style={{padding:"8px 16px 0",display:"grid",gap:10}}>
                <div className="fg">
                  <div className="fl">Nombre del receptor *</div>
                  <input className="fi" value={f.nombre} onChange={e=>setCrIndivModal(p=>({...p,nombre:e.target.value.toUpperCase()}))} placeholder="Ej: JUAN PÉREZ" style={{textTransform:"uppercase",fontWeight:600}} autoFocus/>
                </div>
                <div className="fg">
                  <div className="fl">ID Identificación *</div>
                  <input className="fi" value={f.id} onChange={e=>setCrIndivModal(p=>({...p,id:e.target.value}))} placeholder="Nº de identificación"/>
                </div>
                <div className="fg">
                  <div className="fl">Empresa</div>
                  <input className="fi" value={f.empresa} onChange={e=>setCrIndivModal(p=>({...p,empresa:e.target.value.toUpperCase()}))} placeholder="Ej: TRANSPORTES XYZ" style={{textTransform:"uppercase"}}/>
                </div>
                <div className="fg">
                  <div className="fl">Notas</div>
                  <textarea className="fi" value={f.notas} onChange={e=>setCrIndivModal(p=>({...p,notas:e.target.value}))} placeholder="Observaciones opcionales…" rows={3} style={{resize:"vertical",minHeight:60,fontFamily:"inherit",fontSize:14}}/>
                </div>
              </div>
              <div className="mft">
                <button className="btn-s" onClick={()=>setCrIndivModal(null)}>Cancelar</button>
                <button className="btn-p" onClick={crSubmitIndiv}>🚀 Confirmar Egreso</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RECIBO DE CARGO RELEASE INDIVIDUAL — imprimible */}
      {crIndivRecibo&&(()=>{
        const {cr:_cr,wr:_wr,cliente:_cli}=crIndivRecibo;
        const _fecha=new Date(_cr.fecha).toLocaleString("es-VE",{dateStyle:"medium",timeStyle:"short"});
        return (
          <div className="ov" onClick={()=>setCrIndivRecibo(null)} style={{background:"rgba(0,0,0,0.7)"}}>
            <div className="modal" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
              <div className="mhd no-print">
                <div className="mt">🧾 Recibo de Cargo Release</div>
                <button className="mcl" onClick={()=>setCrIndivRecibo(null)}>✕</button>
              </div>
              <div id="cr-recibo-print" style={{padding:24,background:"#fff",color:"#000",fontFamily:"Arial,Helvetica,sans-serif",fontSize:13,lineHeight:1.5}}>
                <div style={{textAlign:"center",borderBottom:"2px solid #000",paddingBottom:10,marginBottom:14}}>
                  <div style={{fontSize:22,fontWeight:900,letterSpacing:2}}>{empresaNombre||"ENEX"}</div>
                  <div style={{fontSize:12,marginTop:4,color:"#444"}}>CARGO RELEASE — COMPROBANTE DE EGRESO</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700,marginTop:6}}>{_cr.id}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div><b>Fecha:</b> {_fecha}</div>
                  <div style={{textAlign:"right"}}><b>Operador:</b> {_cr.usuario||"—"}</div>
                </div>
                <div style={{border:"1px solid #000",padding:10,marginBottom:12,borderRadius:4}}>
                  <div style={{fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:6,borderBottom:"1px solid #999",paddingBottom:3}}>Datos del WR</div>
                  <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:13}}>
                    <div style={{fontWeight:700}}>N° WR:</div><div style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{_wr.id}</div>
                    <div style={{fontWeight:700}}>Consignatario:</div><div>{_wr.consignee||"—"}</div>
                    <div style={{fontWeight:700}}>Casillero:</div><div>{_wr.casillero||(_cli?.casillero)||"—"}</div>
                    <div style={{fontWeight:700}}>Cajas:</div><div>{_wr.cajas||0}</div>
                    <div style={{fontWeight:700}}>Peso:</div><div>{_wr.pesoLb||0} lb ({_wr.pesoKg||0} kg)</div>
                    <div style={{fontWeight:700}}>Descripción:</div><div>{_wr.descripcion||"—"}</div>
                    <div style={{fontWeight:700}}>Valor Declarado:</div><div>${(_wr.valor||0).toFixed(2)}</div>
                  </div>
                </div>
                <div style={{border:"1px solid #000",padding:10,marginBottom:12,borderRadius:4}}>
                  <div style={{fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:6,borderBottom:"1px solid #999",paddingBottom:3}}>Receptor / Retira</div>
                  <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:13}}>
                    <div style={{fontWeight:700}}>Nombre:</div><div style={{fontWeight:600}}>{_cr.agenteCarga||"—"}</div>
                    <div style={{fontWeight:700}}>ID Identificación:</div><div style={{fontFamily:"'DM Mono',monospace"}}>{_cr.documento||"—"}</div>
                    <div style={{fontWeight:700}}>Empresa:</div><div>{_cr.contacto||"—"}</div>
                    {_cr.notas&&(<><div style={{fontWeight:700}}>Notas:</div><div style={{fontStyle:"italic",color:"#444"}}>{_cr.notas}</div></>)}
                  </div>
                </div>
                <div style={{marginTop:22,display:"flex",gap:30,paddingTop:20}}>
                  <div style={{flex:1,borderTop:"1px solid #000",paddingTop:6,textAlign:"center",fontSize:11,fontWeight:700}}>Firma del Receptor</div>
                  <div style={{flex:1,borderTop:"1px solid #000",paddingTop:6,textAlign:"center",fontSize:11,fontWeight:700}}>Firma / Sello ENEX</div>
                </div>
                <div style={{marginTop:18,fontSize:10,color:"#666",textAlign:"center",borderTop:"1px dashed #999",paddingTop:8}}>
                  El receptor certifica haber recibido la mercancía descrita en buenas condiciones. Este documento es comprobante de egreso y libera de responsabilidad a {empresaNombre||"ENEX"}.
                </div>
              </div>
              <div className="mft no-print">
                <button className="btn-s" onClick={()=>setCrIndivRecibo(null)}>Cerrar</button>
                <button className="btn-p" onClick={()=>{
                  const html=document.getElementById("cr-recibo-print")?.outerHTML||"";
                  const w=window.open("","_blank","width=800,height=900");
                  if(!w){window.alert("El navegador bloqueó la ventana de impresión.");return;}
                  w.document.write(`<!doctype html><html><head><title>Recibo ${_cr.id}</title><style>body{margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background:#fff}@media print{body{padding:0}}</style></head><body>${html}</body></html>`);
                  w.document.close();
                  setTimeout(()=>{w.focus();w.print();},250);
                }}>🖨 Imprimir Recibo</button>
              </div>
            </div>
          </div>
        );
      })()}
      {showLabels&&(()=>{
        const _lwr=showLabels.wr;const _ldims=showLabels.dims||[];
        const _hdrName=getHeaderName(_lwr,clients,agentes,oficinas,empresaNombre);
        // ── ETIQUETAS DE CAJA WR — 4 TIPOS ──────────────────────────────────
        // TODAS: fondo blanco, letras negras, orientación correcta.
        // Tipo 1 Básica:  4"ancho × 6"alto portrait (384×576)  · 7 franjas
        // Tipo 2 Completa:4"ancho × 6"alto portrait (384×576)  · 5 franjas + QR placeholder
        // Tipo 3 Básica:  4"ancho × 2"alto landscape (384×192) · 3 franjas
        // Tipo 4 Completa:4"ancho × 2"alto landscape (384×192) · 3 franjas
        // Barcode de caja: `${WR#}-${idx}/${total}`

        const _fechaStr=_lwr?.fecha?new Date(_lwr.fecha).toLocaleDateString("es-VE"):"—";
        const _horaStr=_lwr?.fecha?new Date(_lwr.fecha).toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}):"";
        const _shipperName=showLabels.remitente||_lwr?.shipper||_lwr?.remitente||"—";
        const _referencia=_lwr?.proNumber||_lwr?.ocNumber||"—";

        // ── Tipo 1 Básica — 4"×6" (portrait) 7 franjas ──────────────────────
        const LabelCaja1=({d,idx,total})=>{
          const bval=`${_lwr?.id||""}-${idx}/${total}`;
          const dimStr=d.l&&d.a&&d.h?`${parseFloat((d.l/2.54).toFixed(1))}×${parseFloat((d.a/2.54).toFixed(1))}×${parseFloat((d.h/2.54).toFixed(1))}"`:"—";
          const pkLb=d.pkLb||(d.pk?parseFloat((d.pk*2.205).toFixed(1)):null);
          const pvLb=d.volLb||d.pv||null;
          const ft3=d.ft3||null;
          const m3=d.m3||null;
          return(
            <div className="label-card label-4x6" style={{width:384,height:576,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Nombre dinámico */}
              <div style={{textAlign:"center",padding:"10px 8px",borderBottom:"2px solid #000"}}>
                <div style={{fontWeight:900,fontSize:26,letterSpacing:3,lineHeight:1.05,color:"#000"}}>{_hdrName}</div>
              </div>
              {/* Franja 2 — WR# + barcode */}
              <div style={{padding:"6px 10px",borderBottom:"2px solid #000",textAlign:"center"}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:20,letterSpacing:2,marginBottom:2}}>{_lwr?.id||"—"}</div>
                <div style={{overflow:"hidden"}}><WRBarcode value={_lwr?.id||""} height={40} width={1.6}/></div>
              </div>
              {/* Franja 3 — Shipper */}
              <div style={{padding:"6px 10px",borderBottom:"1.5px solid #000"}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#000"}}>Shipper</div>
                <div style={{fontSize:15,fontWeight:700,lineHeight:1.2}}>{_shipperName}</div>
                {_lwr?.remitenteTel&&<div style={{fontSize:12,fontFamily:"'DM Mono',monospace"}}>{_lwr.remitenteTel}</div>}
              </div>
              {/* Franja 4 — Consignatario (Nombre y Apellido) */}
              <div style={{padding:"6px 10px",borderBottom:"1.5px solid #000"}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Consignatario</div>
                <div style={{fontSize:18,fontWeight:900,lineHeight:1.1}}>{_lwr?.consignee||"—"}</div>
                <div style={{fontSize:12,fontFamily:"'DM Mono',monospace",fontWeight:700,marginTop:1}}>#{_lwr?.casillero||"—"}</div>
              </div>
              {/* Franja 5 — Origen | Destino */}
              <div style={{display:"flex",borderBottom:"1.5px solid #000"}}>
                <div style={{flex:1,padding:"6px 10px",borderRight:"1.5px solid #000"}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Origen</div>
                  <div style={{fontSize:16,fontWeight:800}}>{_lwr?.origCity||"—"}</div>
                </div>
                <div style={{flex:1,padding:"6px 10px",textAlign:"right"}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Destino</div>
                  <div style={{fontSize:16,fontWeight:800}}>{_lwr?.destCity||"—"}</div>
                </div>
              </div>
              {/* Franja 6 — Tracking + pesos + medidas + recuadro pieza */}
              <div style={{padding:"6px 10px",borderBottom:"1.5px solid #000",display:"flex",alignItems:"stretch",gap:8,flex:1}}>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:3,fontSize:12}}>
                  <div><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Tracking </span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,wordBreak:"break-all"}}>{d.tracking||"—"}</span></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                    <span>P: {pkLb?`${pkLb} lb`:"—"}</span>
                    <span>Pv: {pvLb?`${pvLb} lb`:"—"}</span>
                    <span>ft³: {ft3||"—"}</span>
                    <span>m³: {m3||"—"}</span>
                  </div>
                  <div><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Medidas </span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{dimStr}</span></div>
                </div>
                {/* Recuadro pequeño — número de pieza */}
                <div style={{width:70,border:"2px solid #000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Pieza</div>
                  <div style={{fontFamily:"'Arial Black',Arial,sans-serif",fontSize:24,fontWeight:900,lineHeight:1}}>{idx}/{total}</div>
                </div>
              </div>
              {/* Franja 7 — Fecha y hora de registro + barcode pieza */}
              <div style={{padding:"3px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{_fechaStr} {_horaStr}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{bval}</span>
              </div>
            </div>
          );
        };

        // ── Tipo 2 Completa — 4"×6" (portrait) 5 franjas ────────────────────
        const LabelCaja2=({d,idx,total})=>{
          const bval=`${_lwr?.id||""}-${idx}/${total}`;
          const dimStr=d.l&&d.a&&d.h?`${parseFloat((d.l/2.54).toFixed(1))}×${parseFloat((d.a/2.54).toFixed(1))}×${parseFloat((d.h/2.54).toFixed(1))}"`:"—";
          const pkLb=d.pkLb||(d.pk?parseFloat((d.pk*2.205).toFixed(1)):null);
          const pvLb=d.volLb||d.pv||null;
          return(
            <div className="label-card label-4x6" style={{width:384,height:576,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Shipper | Consignatario */}
              <div style={{display:"flex",borderBottom:"2px solid #000"}}>
                <div style={{flex:1,padding:"6px 10px",borderRight:"2px solid #000"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Shipper</div>
                  <div style={{fontSize:14,fontWeight:700,lineHeight:1.2}}>{_shipperName}</div>
                </div>
                <div style={{flex:1,padding:"6px 10px"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Consignatario</div>
                  <div style={{fontSize:15,fontWeight:900,lineHeight:1.15}}>{_lwr?.consignee||"—"}</div>
                  <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:700}}>#{_lwr?.casillero||"—"}</div>
                </div>
              </div>
              {/* Franja 2 — Pesos + medidas + recuadro pieza */}
              <div style={{padding:"6px 10px",borderBottom:"2px solid #000",display:"flex",alignItems:"stretch",gap:8}}>
                <div style={{flex:1,fontSize:12,display:"flex",flexDirection:"column",gap:2}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                    <span>Peso: {pkLb?`${pkLb} lb`:"—"}</span>
                    <span>P.Vol: {pvLb?`${pvLb} lb`:"—"}</span>
                    <span>ft³: {d.ft3||"—"}</span>
                    <span>m³: {d.m3||"—"}</span>
                  </div>
                  <div><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Medidas </span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{dimStr}</span></div>
                </div>
                <div style={{width:70,border:"2px solid #000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Pieza</div>
                  <div style={{fontFamily:"'Arial Black',Arial,sans-serif",fontSize:24,fontWeight:900,lineHeight:1}}>{idx}/{total}</div>
                </div>
              </div>
              {/* Franja 3 — N° WR + Código Barra + Tipo Envío */}
              <div style={{padding:"6px 10px",borderBottom:"2px solid #000",textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:18,letterSpacing:2}}>{_lwr?.id||"—"}</div>
                  <div style={{fontSize:12,fontWeight:700,border:"1.5px solid #000",padding:"2px 8px",borderRadius:3}}>{_lwr?.tipoEnvio||showLabels.tipoEnvio||"—"}</div>
                </div>
                <div style={{overflow:"hidden"}}><WRBarcode value={_lwr?.id||""} height={38} width={1.5}/></div>
              </div>
              {/* Franja 4 — Notas + Referencia + Tipo de Pago */}
              <div style={{padding:"6px 10px",borderBottom:"2px solid #000",flex:1,display:"flex",flexDirection:"column",gap:3}}>
                <div><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Notas </span><span style={{fontSize:12,fontWeight:600}}>{_lwr?.notas||"—"}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Ref </span><span style={{fontSize:12,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{_referencia}</span></div>
                  <div><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Pago </span><span style={{fontSize:12,fontWeight:700}}>{_lwr?.tipoPago||"—"}</span></div>
                </div>
              </div>
              {/* Franja 5 — QR + Origen/Destino + fecha/hora */}
              <div style={{padding:"6px 10px",display:"flex",alignItems:"stretch",gap:8}}>
                {/* QR placeholder */}
                <div style={{width:70,height:70,border:"1.5px dashed #888",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontSize:9,color:"#888",textAlign:"center",fontWeight:700}}>QR<br/>RUTA<br/>(futuro)</div>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:800}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Origen</div>
                      <div>{_lwr?.origCity||"—"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Destino</div>
                      <div>{_lwr?.destCity||"—"}</div>
                    </div>
                  </div>
                  <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700,textAlign:"right"}}>{_fechaStr} {_horaStr}</div>
                </div>
              </div>
            </div>
          );
        };

        // ── Tipo 3 Básica — 4"×2" (landscape) 3 franjas ─────────────────────
        const LabelCaja3=({d,idx,total})=>{
          const bval=`${_lwr?.id||""}-${idx}/${total}`;
          const dimStr=d.l&&d.a&&d.h?`${parseFloat((d.l/2.54).toFixed(1))}×${parseFloat((d.a/2.54).toFixed(1))}×${parseFloat((d.h/2.54).toFixed(1))}"`:"—";
          const pkLb=d.pkLb||(d.pk?parseFloat((d.pk*2.205).toFixed(1)):null);
          return(
            <div className="label-card label-4x2" style={{width:384,height:192,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Col 1 Nombre | Col 2 Consignatario */}
              <div style={{display:"flex",borderBottom:"1.5px solid #000"}}>
                <div style={{flex:1,padding:"4px 8px",borderRight:"1.5px solid #000"}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>De</div>
                  <div style={{fontSize:14,fontWeight:900,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_hdrName}</div>
                </div>
                <div style={{flex:1,padding:"4px 8px"}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Consignatario</div>
                  <div style={{fontSize:14,fontWeight:900,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_lwr?.consignee||"—"}</div>
                  <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:700}}>#{_lwr?.casillero||"—"}</div>
                </div>
              </div>
              {/* Franja 2 — N° WR + barcode + Ciudad Destino */}
              <div style={{padding:"3px 8px",borderBottom:"1.5px solid #000",display:"flex",alignItems:"center",gap:6}}>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:13,letterSpacing:1}}>{_lwr?.id||"—"}</div>
                  <div style={{overflow:"hidden"}}><WRBarcode value={_lwr?.id||""} height={28} width={1.2}/></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Destino</div>
                  <div style={{fontSize:14,fontWeight:900}}>{_lwr?.destCity||"—"}</div>
                </div>
              </div>
              {/* Franja 3 — Pesos + medidas + tracking + pieza */}
              <div style={{padding:"3px 8px",flex:1,display:"flex",alignItems:"stretch",gap:6}}>
                <div style={{flex:1,fontSize:11,display:"flex",flexDirection:"column",justifyContent:"center",gap:1,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  <div>{pkLb?`${pkLb}lb`:"—"} · {dimStr}</div>
                  <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Trk: {d.tracking||"—"}</div>
                </div>
                <div style={{width:52,border:"1.5px solid #000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>Pieza</div>
                  <div style={{fontFamily:"'Arial Black',Arial,sans-serif",fontSize:17,fontWeight:900,lineHeight:1}}>{idx}/{total}</div>
                </div>
              </div>
            </div>
          );
        };

        // ── Tipo 4 Completa — 4"×2" (landscape) 3 franjas 2-col ─────────────
        const LabelCaja4=({d,idx,total})=>{
          const bval=`${_lwr?.id||""}-${idx}/${total}`;
          const dimStr=d.l&&d.a&&d.h?`${parseFloat((d.l/2.54).toFixed(1))}×${parseFloat((d.a/2.54).toFixed(1))}×${parseFloat((d.h/2.54).toFixed(1))}"`:"—";
          const pkLb=d.pkLb||(d.pk?parseFloat((d.pk*2.205).toFixed(1)):null);
          return(
            <div className="label-card label-4x2" style={{width:384,height:192,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Col1 (más pequeña) Nombre | Col2 WR# + barcode */}
              <div style={{display:"flex",borderBottom:"1.5px solid #000"}}>
                <div style={{width:110,padding:"3px 6px",borderRight:"1.5px solid #000",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>De</div>
                  <div style={{fontSize:13,fontWeight:900,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_hdrName}</div>
                </div>
                <div style={{flex:1,padding:"3px 8px"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:13,letterSpacing:1}}>{_lwr?.id||"—"}</div>
                  <div style={{overflow:"hidden"}}><WRBarcode value={_lwr?.id||""} height={26} width={1.2}/></div>
                </div>
              </div>
              {/* Franja 2 — Col1 Shipper | Col2 Consignatario */}
              <div style={{display:"flex",borderBottom:"1.5px solid #000"}}>
                <div style={{flex:1,padding:"3px 8px",borderRight:"1.5px solid #000"}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Shipper</div>
                  <div style={{fontSize:12,fontWeight:700,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_shipperName}</div>
                </div>
                <div style={{flex:1,padding:"3px 8px"}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Consignatario</div>
                  <div style={{fontSize:12,fontWeight:900,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_lwr?.consignee||"—"}</div>
                  <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700}}>#{_lwr?.casillero||"—"}</div>
                </div>
              </div>
              {/* Franja 3 — Col1 Pesos/Medidas/Tracking | Col2 Envío/Pago/Pieza/Ruta */}
              <div style={{display:"flex",flex:1}}>
                <div style={{flex:1,padding:"3px 8px",borderRight:"1.5px solid #000",fontSize:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:1,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  <div>P: {pkLb?`${pkLb}lb`:"—"}</div>
                  <div>Med: {dimStr}</div>
                  <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Trk: {d.tracking||"—"}</div>
                </div>
                <div style={{flex:1,padding:"3px 8px",fontSize:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:1,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  <div>Env: {_lwr?.tipoEnvio||showLabels.tipoEnvio||"—"}</div>
                  <div>Pago: {_lwr?.tipoPago||"—"}</div>
                  <div>Pz: <b style={{fontSize:12}}>{idx}/{total}</b></div>
                  <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{_lwr?.origCity||"—"} → {_lwr?.destCity||"—"}</div>
                </div>
              </div>
            </div>
          );
        };

        // Router — selecciona el componente según labelWRTipo
        const LabelCaja=labelWRTipo===2?LabelCaja2:labelWRTipo===3?LabelCaja3:labelWRTipo===4?LabelCaja4:LabelCaja1;
        const _tipoDesc=labelWRTipo===2?"4×6 Tipo 2 Completa":labelWRTipo===3?"4×2 Tipo 3 Básica":labelWRTipo===4?"4×2 Tipo 4 Completa":"4×6 Tipo 1 Básica";

        return(
        <div className="ov">
          <div className="modal mxl" onClick={e=>e.stopPropagation()} style={{maxHeight:"90vh",overflowY:"auto"}}>
            <div className="mhd">
              <div className="mt">🏷️ Etiquetas de Caja — {_lwr?.id}</div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨️ Imprimir todo</button>
                <button className="mcl" onClick={()=>setShowLabels(null)}>✕</button>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:4}}>📦 Etiquetas de Caja ({_ldims.length||_lwr?.cajas||0}) · Tipo actual: <span style={{fontFamily:"'DM Mono',monospace"}}>{_tipoDesc}</span></div>
              <div style={{fontSize:12,color:"var(--t3)",marginBottom:8}}>Cambia el tipo de etiqueta en <b>Configuración → Etiquetas</b>.</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
                {_ldims.length>0?_ldims.map((d,i)=><LabelCaja key={i} d={d} idx={i+1} total={_ldims.length}/>)
                  :Array.from({length:_lwr?.cajas||1},(_,i)=><LabelCaja key={i} d={{}} idx={i+1} total={_lwr?.cajas||1}/>)}
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── ETIQUETAS DE GUÍA CONSOLIDADA ─────────────────────────────────── */}
      {showConsolLabels&&(()=>{
        const _g=showConsolLabels.guia;
        const _conts=showConsolLabels.containers||[];
        const _rem=showConsolLabels.remitente||empresaNombre||"ENEX";
        const _total=_conts.length||1;
        const _totalWR=_conts.reduce((s,c)=>s+(c.wr?.length||0),0);
        const _totalCajas=_conts.reduce((s,c)=>s+(c.wr||[]).reduce((a,w)=>a+(w.cajas||1),0),0);

        // Helper: resolver tipo de contenedor y medidas — CONTAINER_TYPES manda;
        // si el código no existe en la config, se usan las medidas manuales del container.
        const contDims=(ct)=>{
          const reg=CONTAINER_TYPES.find(t=>t.code===ct.tipo);
          if(reg&&reg.dim&&reg.dim.toLowerCase()!=="libre")return{tipo:reg.name||reg.code,dim:reg.dim,manual:false};
          const l=ct.largo,a=ct.ancho,h=ct.alto;
          if(l&&a&&h)return{tipo:ct.tipo||"—",dim:`${l}×${a}×${h} in`,manual:true};
          return{tipo:ct.tipo||"—",dim:"—",manual:true};
        };

        // Helpers de fecha/hora (registro de la guía)
        const _gfechaStr=(()=>{const d=_g?.fecha?new Date(_g.fecha):null;return d?d.toLocaleDateString("es-VE"):(_g?.fechaSalida||"—");})();
        const _ghoraStr=(()=>{const d=_g?.fecha?new Date(_g.fecha):null;return d?d.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}):"";})();

        // ── Tipo 1 Grande — 4" ancho × 6" alto (portrait 384×576), 5 franjas ─
        const LabelGuiaConsol1=({ct,idx,total})=>{
          const bval=`${_g?.id||""}-${idx}/${total}`;
          const cd=contDims(ct);
          const cajasInCont=(ct.wr||[]).reduce((a,w)=>a+(w.cajas||1),0);
          return(
            <div className="label-card label-4x6" style={{width:384,height:576,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Nombre Empresa Matriz */}
              <div style={{textAlign:"center",padding:"8px 10px",borderBottom:"2px solid #000"}}>
                <div style={{fontWeight:900,fontSize:24,letterSpacing:4,lineHeight:1}}>{_rem}</div>
                <div style={{fontSize:11,letterSpacing:3,marginTop:3,fontWeight:700}}>GUÍA CONSOLIDADA</div>
              </div>
              {/* Franja 2 — Número de Guía */}
              <div style={{textAlign:"center",padding:"10px 10px",borderBottom:"2px solid #000",background:"#fff"}}>
                <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>N° Guía</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:28,letterSpacing:3,marginTop:2}}>{_g?.id||"—"}</div>
              </div>
              {/* Franja 3 — Origen | Destino */}
              <div style={{display:"flex",borderBottom:"2px solid #000"}}>
                <div style={{flex:1,padding:"8px 10px",borderRight:"1.5px solid #000",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>Origen</div>
                  <div style={{fontSize:16,fontWeight:900,marginTop:2}}>{OFFICE_CONFIG.origCity||"—"}</div>
                </div>
                <div style={{flex:1,padding:"8px 10px",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>Destino</div>
                  <div style={{fontSize:16,fontWeight:900,marginTop:2}}>{_g?.destino||"—"}</div>
                </div>
              </div>
              {/* Franja 4 — Tipo Envío | Tipo Cont+Medidas | Peso Contenedor */}
              <div style={{display:"flex",borderBottom:"2px solid #000"}}>
                <div style={{flex:"0 0 100px",padding:"6px 6px",borderRight:"1px solid #000",textAlign:"center"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Tipo Envío</div>
                  <div style={{fontSize:13,fontWeight:900,marginTop:2}}>{_g?.tipoEnvio||"—"}</div>
                </div>
                <div style={{flex:1,padding:"6px 6px",borderRight:"1px solid #000",textAlign:"center"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Contenedor</div>
                  <div style={{fontSize:12,fontWeight:900,marginTop:2}}>{cd.tipo}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,marginTop:1}}>{cd.dim}{cd.manual&&<span style={{fontSize:9,marginLeft:3}}>(man)</span>}</div>
                </div>
                <div style={{flex:"0 0 88px",padding:"6px 6px",textAlign:"center"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Peso</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:900,marginTop:2}}>{ct.pesoLb?`${ct.pesoLb} lb`:"—"}</div>
                </div>
              </div>
              {/* Franja 5 — Barcode + Pieza + recuadro paquetes + fecha/hora */}
              <div style={{flex:1,padding:"8px 8px",display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div style={{overflow:"hidden",width:"100%"}}><WRBarcode value={bval} height={70} width={1.9}/></div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,fontWeight:700,marginTop:2}}>{bval}</div>
                  </div>
                  <div style={{flex:"0 0 54px",textAlign:"center",border:"1.5px solid #000",padding:"4px 2px"}}>
                    <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Pieza</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:900,lineHeight:1,marginTop:2}}>{idx}/{total}</div>
                  </div>
                  <div style={{flex:"0 0 54px",textAlign:"center",border:"2px solid #000",padding:"4px 2px"}}>
                    <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Paq.</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:900,lineHeight:1,marginTop:2}}>{cajasInCont}</div>
                  </div>
                </div>
                <div style={{textAlign:"center",fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,marginTop:6,paddingTop:4,borderTop:"1px dashed #888"}}>
                  {_gfechaStr} {_ghoraStr}
                </div>
              </div>
            </div>
          );
        };

        // ── Tipo 2 Compacta — 4" ancho × 2" alto (landscape 384×192), 3 franjas ─
        const LabelGuiaConsol2=({ct,idx,total})=>{
          const bval=`${_g?.id||""}-${idx}/${total}`;
          const cd=contDims(ct);
          const cajasInCont=(ct.wr||[]).reduce((a,w)=>a+(w.cajas||1),0);
          return(
            <div className="label-card label-4x2" style={{width:384,height:192,border:"2px solid #000",background:"#fff",color:"#000",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              {/* Franja 1 — Empresa Matriz + N° Guía */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 8px",borderBottom:"1.5px solid #000"}}>
                <div style={{fontWeight:900,fontSize:15,letterSpacing:2,lineHeight:1}}>{_rem}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:900,fontSize:15,letterSpacing:1}}>{_g?.id||"—"}</div>
              </div>
              {/* Franja 2 — Ruta + tipo envío + contenedor/medidas + peso */}
              <div style={{padding:"3px 8px",borderBottom:"1.5px solid #000"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700}}>
                  <span>{OFFICE_CONFIG.origCity||"—"} → {_g?.destino||"—"}</span>
                  <span>{_g?.tipoEnvio||"—"}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:700,marginTop:2}}>
                  <span>{cd.tipo} {cd.dim}</span>
                  <span>{ct.pesoLb?`${ct.pesoLb}lb`:"—"}</span>
                </div>
              </div>
              {/* Franja 3 — Barcode + Pieza + Paquetes */}
              <div style={{flex:1,padding:"3px 6px",display:"flex",alignItems:"center",gap:4}}>
                <div style={{flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{overflow:"hidden",width:"100%"}}><WRBarcode value={bval} height={42} width={1.3}/></div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1,fontWeight:700,marginTop:1}}>{bval}</div>
                </div>
                <div style={{flex:"0 0 40px",textAlign:"center",border:"1.5px solid #000",padding:"2px 1px"}}>
                  <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Pz.</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:900,lineHeight:1}}>{idx}/{total}</div>
                </div>
                <div style={{flex:"0 0 40px",textAlign:"center",border:"2px solid #000",padding:"2px 1px"}}>
                  <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Paq.</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:900,lineHeight:1}}>{cajasInCont}</div>
                </div>
              </div>
            </div>
          );
        };

        // Router — solo 2 tipos: 1=Grande 4×6, 2=Compacta 4×2
        const LabelGuiaConsol=labelCSATipo===2?LabelGuiaConsol2:LabelGuiaConsol1;
        const _tipoDesc=labelCSATipo===2?"4×2 Tipo 2 Compacta":"4×6 Tipo 1 Grande";

        return(
          <div className="ov">
            <div className="modal mxl" onClick={e=>e.stopPropagation()} style={{maxHeight:"90vh",overflowY:"auto"}}>
              <div className="mhd">
                <div className="mt">📋 Etiquetas de Guía Consolidada — {_g?.id}</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨️ Imprimir todo</button>
                  <button className="mcl" onClick={()=>setShowConsolLabels(null)}>✕</button>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:4}}>📋 Etiquetas de Guía Consolidada ({_total}) · Tipo actual: <span style={{fontFamily:"'DM Mono',monospace"}}>{_tipoDesc}</span></div>
                <div style={{fontSize:12,color:"var(--t3)",marginBottom:8}}>Una etiqueta por contenedor · Total: {_totalWR} WR · {_totalCajas} cajas. Cambia el tipo en <b>Configuración → Etiquetas</b>.</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
                  {_conts.map((ct,i)=><LabelGuiaConsol key={i} ct={ct} idx={i+1} total={_total}/>)}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {showNewCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title="➕ Nuevo Registro" initial={{tipo:"cliente",clienteTipo:"matriz",primerNombre:"",segundoNombre:"",primerApellido:"",segundoApellido:"",cedula:"",dir:"",municipio:"",estado:"",pais:"",cp:"",tel1:"",tel2:"",email:"",casillero:"",rol:"I",password:"",...presetDominio()}} onClose={()=>setShowNewCl(false)} onSave={f=>{const esUser=f.tipo==="usuario";const prefix=esUser?"U":"C";const nextNum=clients.filter(c=>c.tipo===(esUser?"usuario":"cliente")).length+1;const newId=`${prefix}-${String(nextNum).padStart(3,"0")}`;const casillero=(!esUser&&!f.casillero)?nextCasillero():f.casillero;const newRec={...f,id:newId,casillero,clienteTipo:f.clienteTipo||"matriz",password:""};setClients(p=>[...p,newRec]);setShowNewCl(false);logAction("Creó registro",`${newId} — ${f.primerNombre} ${f.primerApellido}`);(async()=>{await dbUpsertCliente(newRec);await sincronizarCuenta(newRec,f.password);})();}}/>}
      {showEditCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title={`✏️ Editar — ${fullName(showEditCl)}`} initial={showEditCl} onClose={()=>setShowEditCl(null)} onSave={f=>{const ant=showEditCl;const rec={...f,clienteTipo:f.clienteTipo||"matriz",password:""};setClients(p=>p.map(c=>c.id===f.id?rec:c));logAction("Editó registro",`${f.id} — ${f.primerNombre} ${f.primerApellido}`);setShowEditCl(null);(async()=>{await dbUpsertCliente(rec);await sincronizarCuenta(rec,f.password,ant);})();}}/>}

      {/* ── Cargo Release — MODAL FORMULARIO ───────────────────────────────── */}
      {crModal&&(()=>{
        const f=crModal;
        const editing=!!f.editId;
        // WRs elegibles = 1, 2, 2.3, 3 + los ya seleccionados (aunque estén en 25 por ser edit)
        const elegibles=wrList.filter(w=>crElegible(w)||f.wrIds.includes(w.id));
        const sel=f.wrIds.map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const qRef=f._q||"";
        const filtered=elegibles.filter(w=>{
          if(f.wrIds.includes(w.id))return false;
          if(!qRef)return true;
          const qq=qRef.toLowerCase();
          return [w.id,w.consignee,w.shipper,trkAll(w),w.proNumber].some(v=>String(v||"").toLowerCase().includes(qq));
        }).slice(0,30);
        const agentesCarga=agentes.filter(a=>a.tipo==="transporte"||a.tipoAgente==="transporte"||!a.tipoAgente);
        return(
          <div className="ov">
            <div className="modal mlg" style={{maxWidth:1100,width:"96%"}} onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div style={{flex:1}}>
                  <div className="mt">🚀 {editing?`Editar Egreso ${f.editId}`:"Nuevo Egreso (Cargo Release)"}</div>
                </div>
                <button className="mcl" onClick={()=>setCrModal(null)}>✕</button>
              </div>
              <div className="mbd" style={{maxHeight:"70vh",overflow:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Agente de carga *</div>
                    <input className="fi" list="cr-agentes" value={f.agenteCarga} onChange={e=>setCrModal(p=>({...p,agenteCarga:e.target.value}))} placeholder="Nombre del agente/transportista…"/>
                    <datalist id="cr-agentes">{agentesCarga.map(a=>(<option key={a.id||a.nombre} value={a.nombre||a.name||""}/>))}</datalist>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Contacto (persona)</div>
                    <input className="fi" value={f.contacto} onChange={e=>setCrModal(p=>({...p,contacto:e.target.value}))} placeholder="Ej: Luis Pérez · 0414-1234567"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>ID Identificación</div>
                    <input className="fi" value={f.documento} onChange={e=>setCrModal(p=>({...p,documento:e.target.value}))} placeholder="Nº de identificación"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Vehículo (placa/modelo)</div>
                    <input className="fi" value={f.vehiculo} onChange={e=>setCrModal(p=>({...p,vehiculo:e.target.value}))} placeholder="AB1234 · Ford 350"/>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Notas</div>
                  <textarea className="fi" rows={2} value={f.notas} onChange={e=>setCrModal(p=>({...p,notas:e.target.value}))} placeholder="Observaciones del egreso…" style={{resize:"vertical"}}/>
                </div>

                <div style={{background:"#F5F7FB",padding:10,borderRadius:6,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>📦 WR Seleccionados ({sel.length})</div>
                    {sel.length>0&&<button className="btn-s" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>setCrModal(p=>({...p,wrIds:[]}))}>Limpiar todos</button>}
                  </div>
                  {sel.length===0?(
                    <div style={{fontSize:13,color:"var(--t3)",padding:"6px 0"}}>Sin WR — agrega abajo.</div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {sel.map(w=>(
                        <div key={w.id} style={{display:"flex",alignItems:"center",gap:8,background:"#fff",padding:"4px 8px",borderRadius:4,border:"1px solid #E0E7EF",fontSize:13}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",minWidth:80}}>{w.id}</span>
                          <span className={`st ${w.status?.cls||"s1"}`} style={{fontSize:11}}>{w.status?.label||"—"}</span>
                          <span style={{flex:1,color:"var(--t2)"}}>{w.consignee||"—"}</span>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t3)"}}>{w.tracking||"—"}</span>
                          <button className="btn-s" style={{fontSize:11,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>setCrModal(p=>({...p,wrIds:p.wrIds.filter(id=>id!==w.id)}))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:4}}>➕ Agregar WR</div>
                  <input className="fi" placeholder="Buscar por WR, consignee, tracking…" value={qRef} onChange={e=>setCrModal(p=>({...p,_q:e.target.value}))} style={{marginBottom:6}}/>
                  <div style={{maxHeight:"40vh",overflow:"auto",border:"1px solid #E0E7EF",borderRadius:4}}>
                    {filtered.length===0?(
                      <div style={{padding:10,color:"var(--t3)",fontSize:13,textAlign:"center"}}>No hay WR disponibles{qRef?` para "${qRef}"`:""}</div>
                    ):filtered.map(w=>(
                      <div key={w.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",borderBottom:"1px solid #EEF",fontSize:13,cursor:"pointer"}} onClick={()=>setCrModal(p=>({...p,wrIds:[...p.wrIds,w.id]}))}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",minWidth:80}}>{w.id}</span>
                        <span className={`st ${w.status?.cls||"s1"}`} style={{fontSize:11}}>{w.status?.label||"—"}</span>
                        <span style={{flex:1,color:"var(--t2)"}}>{w.consignee||"—"}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t3)"}}>{w.tracking||"—"}</span>
                        <span style={{color:"var(--cyan)",fontSize:12,fontWeight:700}}>+ agregar</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mft" style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                <button className="btn-s" onClick={()=>setCrModal(null)}>Cancelar</button>
                <button className="btn-p" onClick={crSubmit}>{editing?"💾 Guardar cambios":"🚀 Crear Egreso"}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Cargo Release — NOTA IMPRIMIBLE ─────────────────────────────────── */}
      {crPrint&&(()=>{
        const cr=crPrint;
        const wrs=(cr.wrIds||[]).map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const totalCajas=wrs.reduce((s,w)=>s+(w.dims?.length||0),0);
        const totalLb=wrs.reduce((s,w)=>s+(w.dims||[]).reduce((a,d)=>a+parseFloat(d.pkLb||d.pk*2.205||0),0),0);
        return(
          <div className="ov">
            <div className="modal mlg" style={{maxWidth:900,width:"96%"}}>
              <div className="mhd no-print">
                <div className="mt">🖨️ Nota de Egreso — {cr.id}</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn-p" style={{fontSize:13,padding:"4px 12px"}} onClick={()=>window.print()}>🖨️ Imprimir</button>
                  <button className="mcl" onClick={()=>setCrPrint(null)}>✕</button>
                </div>
              </div>
              <div className="mbd" style={{maxHeight:"78vh",overflow:"auto"}}>
                <div className="cr-print" style={{background:"#fff",color:"#000",padding:"24px 28px",fontFamily:"Arial,Helvetica,sans-serif",fontSize:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"2px solid #000",paddingBottom:10,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:22,fontWeight:900,letterSpacing:2}}>ENEX</div>
                      <div style={{fontSize:12}}>{empresaNombre||"Int'l Courier"}</div>
                      <div style={{fontSize:11,color:"#555"}}>Nota de Egreso / Cargo Release</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700}}>N° {cr.id}</div>
                      <div style={{fontSize:12}}>Fecha: {fmtDate(cr.fecha)} {fmtTime(cr.fecha)}</div>
                      <div style={{fontSize:12}}>Usuario: {cr.usuario||"—"}</div>
                      {cr.anulado&&<div style={{fontSize:13,fontWeight:900,color:"#C62828",marginTop:4,border:"2px solid #C62828",padding:"2px 6px",display:"inline-block"}}>ANULADO</div>}
                    </div>
                  </div>

                  <table style={{width:"100%",fontSize:13,marginBottom:12}}>
                    <tbody>
                      <tr><td style={{fontWeight:700,width:120,paddingBottom:3}}>Agente de carga:</td><td style={{paddingBottom:3}}>{cr.agenteCarga||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Contacto:</td><td style={{paddingBottom:3}}>{cr.contacto||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>ID Identificación:</td><td style={{paddingBottom:3}}>{cr.documento||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Vehículo:</td><td style={{paddingBottom:3}}>{cr.vehiculo||"—"}</td></tr>
                      {cr.notas&&<tr><td style={{fontWeight:700,paddingBottom:3,verticalAlign:"top"}}>Notas:</td><td style={{paddingBottom:3,whiteSpace:"pre-wrap"}}>{cr.notas}</td></tr>}
                      {cr.anulado&&cr.motivoAnulacion&&<tr><td style={{fontWeight:700,color:"#C62828"}}>Motivo anulación:</td><td style={{color:"#C62828"}}>{cr.motivoAnulacion}</td></tr>}
                    </tbody>
                  </table>

                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Detalle de carga ({wrs.length} WR · {totalCajas} cajas · {totalLb.toFixed(1)} lb)</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
                    <thead>
                      <tr style={{background:"#EEE"}}>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>#</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>WR</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Consignatario</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Tracking</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>Cajas</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>Peso (lb)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wrs.map((w,i)=>{
                        const c=(w.dims||[]).length;
                        const lb=(w.dims||[]).reduce((a,d)=>a+parseFloat(d.pkLb||d.pk*2.205||0),0);
                        return(
                          <tr key={w.id}>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{i+1}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",fontWeight:700}}>{w.id}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{w.consignee||"—"}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",fontFamily:"monospace"}}>{w.tracking||"—"}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"center"}}>{c}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right"}}>{lb.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                      {wrs.length===0&&(<tr><td colSpan={6} style={{border:"1px solid #999",padding:"8px 6px",textAlign:"center",color:"#999"}}>(sin WR)</td></tr>)}
                      <tr style={{background:"#F8F8F8",fontWeight:700}}>
                        <td colSpan={4} style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>TOTALES:</td>
                        <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>{totalCajas}</td>
                        <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>{totalLb.toFixed(1)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{display:"flex",justifyContent:"space-between",gap:40,marginTop:40}}>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Entrega ENEX</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>Firma y sello</div>
                    </div>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Recibe (Agente de carga)</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{cr.agenteCarga||"—"}{cr.documento?` · ${cr.documento}`:""}</div>
                    </div>
                  </div>
                  <div style={{marginTop:24,fontSize:11,color:"#777",textAlign:"center",borderTop:"1px dashed #999",paddingTop:6}}>
                    La firma confirma recepción conforme de los WR listados. Cualquier discrepancia debe reportarse al momento de la entrega.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delivery Note — MODAL FORMULARIO ────────────────────────────────── */}
      {pwModal&&(
        <div className="ov" onClick={()=>setPwModal(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div className="mhd"><div className="mt">🔑 Cambiar mi contraseña</div><button className="mcl" onClick={()=>setPwModal(null)}>✕</button></div>
            <div className="mbd" style={{display:"flex",flexDirection:"column",gap:10}}>
              {pwModal.ok
                ?<div style={{color:"var(--green)",fontWeight:700,textAlign:"center",padding:10}}>✓ Contraseña cambiada</div>
                :<>
                  <PwInput className="fi" placeholder="Nueva contraseña (mínimo 6)" value={pwModal.a} onChange={e=>setPwModal(p=>({...p,a:e.target.value}))}/>
                  <PwInput className="fi" placeholder="Repite la contraseña" value={pwModal.b} onChange={e=>setPwModal(p=>({...p,b:e.target.value}))}/>
                  {pwModal.err&&<div style={{color:"var(--red)",fontSize:14}}>{pwModal.err}</div>}
                </>}
            </div>
            <div className="mft">
              <button className="btn-s" onClick={()=>setPwModal(null)}>{pwModal.ok?"Cerrar":"Cancelar"}</button>
              {!pwModal.ok&&<button className="btn-p" onClick={async()=>{
                if(pwModal.a.length<6){setPwModal(p=>({...p,err:"Mínimo 6 caracteres"}));return;}
                if(pwModal.a!==pwModal.b){setPwModal(p=>({...p,err:"Las contraseñas no coinciden"}));return;}
                const err=await cambiarMiClave(pwModal.a);
                setPwModal(p=>err?{...p,err}:{a:"",b:"",err:"",ok:true});
                if(!err)logAction("Cambió su contraseña",currentUser.id);
              }}>Guardar</button>}
            </div>
          </div>
        </div>
      )}
      {dnQuick&&(()=>{
        const f=dnQuick;
        const esDesp=f.tipo==="despacho";
        const color=esDesp?"#E65100":"#2E7D32";
        const set=(k,v)=>setDnQuick(p=>({...p,[k]:v}));
        const tog=id=>setDnQuick(p=>({...p,wrIds:p.wrIds.includes(id)?p.wrIds.filter(x=>x!==id):[...p.wrIds,id]}));
        const sel=f.wrs.filter(w=>f.wrIds.includes(w.id));
        const pend=dnFacturasPendientes(sel);
        const aSucursal=esDesp&&f.entidad.tipo==="oficina";
        const lbl={fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:3,textTransform:"uppercase",letterSpacing:.4};
        const campo=(t,k,ph,extra={})=>(
          <div><div style={lbl}>{t}</div><input className="fi" value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{fontSize:15,width:"100%",...extra}}/></div>
        );
        return (
          <div className="ov">
            <div className="modal" style={{maxWidth:760,width:"96%"}} onClick={e=>e.stopPropagation()}>
              <div className="mhd" style={{borderTop:`4px solid ${color}`}}>
                <div className="mt">{esDesp?`🚚 Despacho — ${f.entidad.nombre}`:`📦 Entrega — ${f.consignatario||f.entidad.nombre}`}</div>
                <button className="mcl" onClick={()=>setDnQuick(null)}>✕</button>
              </div>
              <div className="mbd" style={{maxHeight:"72vh",overflow:"auto"}}>
                <div style={{fontSize:13,color:"var(--t3)",marginBottom:8}}>Guía <b style={{fontFamily:"'DM Mono',monospace",color:"var(--navy)"}}>{f.guiaId}</b>{aSucursal?" · pasa a Despachado a Sucursal":""}</div>
                <div style={{border:"1px solid var(--b1)",borderRadius:8,overflow:"hidden",marginBottom:12}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                    <thead><tr style={{background:"var(--bg3)"}}>
                      <th style={{width:34,padding:6}}><input type="checkbox" checked={f.wrIds.length===f.wrs.length} onChange={e=>set("wrIds",e.target.checked?f.wrs.map(w=>w.id):[])}/></th>
                      {["N° WR","Cliente","Casillero","Cajas","Peso"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 8px",fontSize:12,color:"var(--navy)",textTransform:"uppercase"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {f.wrs.map(w=>{
                        const cl=cliDeWR(w);
                        return (
                          <tr key={w.id} onClick={()=>tog(w.id)} style={{cursor:"pointer",borderTop:"1px solid var(--b2)",background:f.wrIds.includes(w.id)?"#FFF9E6":""}}>
                            <td style={{textAlign:"center",padding:6}}><input type="checkbox" checked={f.wrIds.includes(w.id)} readOnly/></td>
                            <td style={{padding:"6px 8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{w.id}</td>
                            <td style={{padding:"6px 8px"}}>{cl?fullName(cl):(w.consignee||"—")}</td>
                            <td style={{padding:"6px 8px",fontFamily:"'DM Mono',monospace",color:"var(--gold2)",fontWeight:700}}>{cl?.casillero||w.casillero||"—"}</td>
                            <td style={{padding:"6px 8px"}}>{w.cajas||1}</td>
                            <td style={{padding:"6px 8px",fontFamily:"'DM Mono',monospace"}}>{w.pesoLb||0} lb</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {pend.length>0&&(
                  <div style={{background:"#FFF3E0",border:"1px solid #FFB74D",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:14,color:"#BF360C"}}>
                    ⚠️ Pago pendiente: {pend.map(x=>`${x.id} (${fmtMoney((x.total||0)-(x.pagado||0),x.moneda)})`).join(" · ")}
                  </div>
                )}
                {!esDesp&&(
                  <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                    {[{k:"consignatario",l:"👤 Recibe el consignatario"},{k:"encargado",l:"🧑‍🤝‍🧑 Recibe un encargado"}].map(o=>(
                      <button key={o.k} className={f.recibe===o.k?"btn-p":"btn-s"} style={{fontSize:14}}
                        onClick={()=>setDnQuick(p=>o.k==="consignatario"
                          ?{...p,recibe:"consignatario",receptorNombre:p.consignatario,receptorDocumento:(clients.find(c=>c.id===p.clienteId)?.cedula)||"",relacion:""}
                          :{...p,recibe:"encargado",receptorNombre:"",receptorDocumento:"",relacion:""})}>{o.l}</button>
                    ))}
                  </div>
                )}
                {esDesp&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {campo("Despacha (empleado) *","despacha","Nombre y apellido",{textTransform:"uppercase",fontWeight:600})}
                    {campo("Transporta (chofer / transportista)","chofer","Nombre o empresa",{textTransform:"uppercase"})}
                    {campo("ID de quien transporta","choferId","Nº de identificación")}
                    {campo("Vehículo / placa","vehiculo","Placa",{textTransform:"uppercase"})}
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {!aSucursal&&campo(esDesp?`Recibe por ${f.entidad.nombre}`:(f.recibe==="encargado"?"Nombre del encargado *":"Nombre de quien firma *"),"receptorNombre","Nombre y apellido",{textTransform:"uppercase",fontWeight:600})}
                  {!aSucursal&&campo(f.recibe==="encargado"&&!esDesp?"ID Identificación *":"ID Identificación","receptorDocumento","Nº de identificación")}
                  {!aSucursal&&campo("Teléfono","receptorTelefono","Teléfono")}
                  {f.recibe==="encargado"&&!esDesp
                    ?campo("Relación con el consignatario","relacion","Familiar, empleado, chófer…")
                    :<div/>}
                  {!esDesp&&(
                    <div style={{gridColumn:"1/-1"}}>
                      <div style={lbl}>Entrega</div>
                      <div style={{display:"flex",gap:8}}>
                        {[{k:"retiro_oficina",l:"🏢 Retiro en oficina"},{k:"domicilio",l:"🏠 A domicilio"}].map(o=>(
                          <button key={o.k} className={f.metodoEntrega===o.k?"btn-p":"btn-s"} style={{fontSize:14}} onClick={()=>set("metodoEntrega",o.k)}>{o.l}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {(esDesp||f.metodoEntrega==="domicilio")&&<div style={{gridColumn:"1/-1"}}>{campo(esDesp?"Dirección":"Dirección de entrega *","direccionEntrega","Dirección")}</div>}
                  <div style={{gridColumn:"1/-1"}}>
                    <div style={lbl}>Notas</div>
                    <textarea className="fi" rows={2} value={f.notas} onChange={e=>set("notas",e.target.value)} style={{width:"100%",resize:"vertical",fontSize:14}}/>
                  </div>
                </div>
              </div>
              <div className="mft">
                <div style={{fontSize:14,color:"var(--t2)",marginRight:"auto"}}><b>{f.wrIds.length}</b> de {f.wrs.length} WR</div>
                <button className="btn-s" onClick={()=>setDnQuick(null)}>Cancelar</button>
                <button className="btn-p" style={{background:color,borderColor:color}} onClick={dnQuickSubmit}>{esDesp?"🚚 Confirmar despacho":"📦 Confirmar entrega"}</button>
              </div>
            </div>
          </div>
        );
      })()}
      {dnModal&&(()=>{
        const f=dnModal;
        const editing=!!f.editId;
        const esDespacho=f.tipo==="despacho";
        const guiaSel=f.guiaId?consolList.find(c=>c.id===f.guiaId):null;
        const isAereo=dnGuiaEsAerea(guiaSel);
        // WRs en estado 20 de la guía elegida (o todos los preseleccionados al
        // editar, para no perder los ya marcados aunque cambien de estado).
        const wrsGuia=guiaSel?dnWRsPorEntregarEnGuia(guiaSel):[];
        const wrsEdit=editing?(f.wrIds||[]).map(id=>wrList.find(w=>w.id===id)).filter(Boolean):[];
        const wrsBase=[...wrsGuia,...wrsEdit.filter(w=>!wrsGuia.some(x=>x.id===w.id))];
        // Para Entrega: agrupar WRs por cliente
        // Para Despacho: agrupar WRs por dominio (agente/oficina/autónomo del cliente)
        const wrsDelReceptor=wrsBase.filter(w=>{
          if(!f.receptorEntidad)return false;
          const cli=cliDeWR(w);
          if(esDespacho){
            const dom=dnDominioDeCliente(cli);
            return dom&&dom.tipo===f.receptorEntidad.tipo&&dom.id===f.receptorEntidad.id;
          }else{
            return f.receptorEntidad.tipo==="cliente"&&cli?.id===f.receptorEntidad.id;
          }
        });
        // Receptores disponibles según el tipo
        const receptoresDisponibles=(()=>{
          if(!guiaSel)return [];
          if(esDespacho){
            const acc=new Map();
            wrsGuia.forEach(w=>{
              const cli=cliDeWR(w);
              const dom=dnDominioDeCliente(cli);
              if(!dom)return;
              const k=`${dom.tipo}:${dom.id}`;
              if(!acc.has(k))acc.set(k,{...dom,count:0});
              acc.get(k).count++;
            });
            return [...acc.values()];
          }else{
            const acc=new Map();
            wrsGuia.forEach(w=>{
              const cli=cliDeWR(w);
              if(!cli)return;
              if(!acc.has(cli.id)){
                acc.set(cli.id,{
                  tipo:"cliente",id:cli.id,
                  nombre:[cli.primerNombre,cli.primerApellido].filter(Boolean).join(" "),
                  casillero:cli.casillero||"",
                  count:0,
                });
              }
              acc.get(cli.id).count++;
            });
            return [...acc.values()];
          }
        })();
        // Prefill datos del receptor al elegir
        const elegirReceptor=(rec)=>{
          let pref={consignatario:"",direccionEntrega:"",receptorTelefono:""};
          if(rec.tipo==="cliente"){
            const cli=clients.find(c=>c.id===rec.id);
            if(cli){
              pref.consignatario=[cli.primerNombre,cli.segundoNombre,cli.primerApellido,cli.segundoApellido].filter(Boolean).join(" ");
              pref.direccionEntrega=[cli.dir,cli.municipio,cli.estado].filter(Boolean).join(", ");
              pref.receptorTelefono=cli.tel1||"";
            }
          }else if(rec.tipo==="agente"){
            const ag=agentes.find(a=>a.id===rec.id);
            if(ag){pref.consignatario=ag.nombre||ag.codigo||"";pref.direccionEntrega=[ag.dir,ag.ciudad].filter(Boolean).join(", ");pref.receptorTelefono=ag.tel||"";}
          }else if(rec.tipo==="oficina"){
            const of=oficinas.find(o=>o.id===rec.id);
            if(of){pref.consignatario=of.nombre||of.codigo||"";pref.direccionEntrega=[of.dir,of.ciudad].filter(Boolean).join(", ");pref.receptorTelefono=of.tel||"";}
          }else if(rec.tipo==="autonomo"){
            const au=clients.find(c=>c.id===rec.id);
            if(au){pref.consignatario=[au.primerNombre,au.primerApellido].filter(Boolean).join(" ");pref.direccionEntrega=[au.dir,au.municipio,au.estado].filter(Boolean).join(", ");pref.receptorTelefono=au.tel1||"";}
          }
          // Auto-seleccionar todos los WRs del receptor por defecto
          const wrIdsAuto=wrsBase.filter(w=>{
            const cli=cliDeWR(w);
            if(esDespacho){
              const dom=dnDominioDeCliente(cli);
              return dom&&dom.tipo===rec.tipo&&dom.id===rec.id;
            }
            return rec.tipo==="cliente"&&cli?.id===rec.id;
          }).map(w=>w.id);
          setDnModal(p=>({
            ...p,
            receptorEntidad:{tipo:rec.tipo,id:rec.id,nombre:rec.nombre},
            clienteId:rec.tipo==="cliente"?rec.id:p.clienteId,
            consignatario:pref.consignatario||p.consignatario,
            direccionEntrega:pref.direccionEntrega||p.direccionEntrega,
            receptorTelefono:pref.receptorTelefono||p.receptorTelefono,
            receptorNombre:p.receptorNombre||(rec.tipo==="cliente"?pref.consignatario:""),
            wrIds:wrIdsAuto,
          }));
        };
        const guiasDisponibles=dnGuiasConPorEntregar();
        const guiasParaUI=editing&&guiaSel&&!guiasDisponibles.some(g=>g.id===guiaSel.id)
          ?[guiaSel,...guiasDisponibles]:guiasDisponibles;
        const toggleWR=(wrId)=>setDnModal(p=>({...p,wrIds:p.wrIds.includes(wrId)?p.wrIds.filter(x=>x!==wrId):[...p.wrIds,wrId]}));
        // Totales del peso facturable seleccionado
        const totalFact=wrsDelReceptor
          .filter(w=>f.wrIds.includes(w.id))
          .reduce((s,w)=>s+wrPesoFacturable(w,isAereo).valor,0);
        const colorTipo=esDespacho?"#E65100":"#2E7D32";
        return(
          <div className="ov">
            <div className="modal mlg" style={{maxWidth:1100,width:"96%"}} onClick={e=>e.stopPropagation()}>
              <div className="mhd" style={{borderTop:`4px solid ${colorTipo}`}}>
                <div style={{flex:1}}>
                  <div className="mt">{esDespacho?"🚚":"📦"} {editing?`Editar Nota ${f.editId}`:(esDespacho?"Nuevo Despacho":"Nueva Entrega")}</div>
                </div>
                <button className="mcl" onClick={()=>setDnModal(null)}>✕</button>
              </div>
              <div className="mbd" style={{maxHeight:"72vh",overflow:"auto"}}>
                {/* PASO 1 — Selección de guía */}
                <div style={{background:"#F5F7FB",borderRadius:6,padding:10,marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",marginBottom:4}}>1️⃣ Guía consolidada *</div>
                  <select className="fs" value={f.guiaId} onChange={e=>setDnModal(p=>({...p,guiaId:e.target.value,receptorEntidad:null,wrIds:[]}))} style={{width:"100%"}}>
                    <option value="">— Selecciona una guía con WR por entregar —</option>
                    {guiasParaUI.map(g=>(
                      <option key={g.id} value={g.id}>{g.id} · {g.destino||"?"} · {g.tipoEnvio||"?"} · {dnWRsPorEntregarEnGuia(g).length} WR por entregar</option>
                    ))}
                  </select>
                  {guiaSel&&(
                    <div style={{fontSize:11,color:"var(--t3)",marginTop:6,display:"flex",gap:14,flexWrap:"wrap"}}>
                      <span>📦 <b>Destino:</b> {guiaSel.destino||"—"}</span>
                      <span>{isAereo?"✈️":"🚢"} <b>Modo:</b> {guiaSel.tipoEnvio||"—"}</span>
                      <span>📋 <b>Total WR x entregar:</b> {wrsGuia.length}</span>
                    </div>
                  )}
                </div>

                {/* PASO 2 — Selección de receptor */}
                {guiaSel&&(
                  <div style={{background:"#F5F7FB",borderRadius:6,padding:10,marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",marginBottom:4}}>2️⃣ {esDespacho?"Agente / Oficina / Autónomo *":"Cliente *"}</div>
                    {receptoresDisponibles.length===0?(
                      <div style={{fontSize:13,color:"var(--t3)",padding:6}}>
                        {esDespacho
                          ?"No hay clientes bajo agente/oficina/autónomo con WR por entregar en esta guía."
                          :"No hay clientes con WR por entregar en esta guía."}
                      </div>
                    ):(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6,maxHeight:"35vh",overflow:"auto"}}>
                        {receptoresDisponibles.map(r=>{
                          const isSel=f.receptorEntidad?.tipo===r.tipo&&f.receptorEntidad?.id===r.id;
                          const icon={cliente:"👤",agente:"🤝",oficina:"🏢",autonomo:"🧑‍💻"}[r.tipo]||"•";
                          return (
                            <div key={`${r.tipo}:${r.id}`} onClick={()=>elegirReceptor(r)}
                              style={{cursor:"pointer",padding:"6px 10px",borderRadius:6,
                                background:isSel?"#1A2B4A":"#fff",
                                color:isSel?"#fff":"var(--t1)",
                                border:`1px solid ${isSel?"#1A2B4A":"#E0E7EF"}`,
                                display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                              <span style={{fontSize:16}}>{icon}</span>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.nombre}</div>
                                {r.casillero&&<div style={{fontSize:11,opacity:.8,fontFamily:"'DM Mono',monospace"}}>{r.casillero}</div>}
                              </div>
                              <span style={{fontSize:11,fontWeight:700,padding:"1px 6px",borderRadius:4,background:isSel?"rgba(255,255,255,.2)":"var(--bg4)"}}>{r.count} WR</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 3 — Selección de WRs del receptor */}
                {guiaSel&&f.receptorEntidad&&(
                  <div style={{background:"#F5F7FB",borderRadius:6,padding:10,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:8}}>
                      <div style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>3️⃣ WR a entregar — {f.wrIds.length} de {wrsDelReceptor.length} seleccionados</div>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn-s" style={{fontSize:11,padding:"2px 8px"}} onClick={()=>setDnModal(p=>({...p,wrIds:wrsDelReceptor.map(w=>w.id)}))}>✓ Todos</button>
                        <button className="btn-s" style={{fontSize:11,padding:"2px 8px"}} onClick={()=>setDnModal(p=>({...p,wrIds:[]}))}>✕ Ninguno</button>
                      </div>
                    </div>
                    <div style={{maxHeight:"45vh",overflow:"auto",border:"1px solid #E0E7EF",borderRadius:4,background:"#fff"}}>
                      <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
                        <thead><tr style={{background:"#F5F7FB",position:"sticky",top:0}}>
                          <th style={{padding:"4px 6px",textAlign:"center",width:28}}></th>
                          <th style={{padding:"4px 6px",textAlign:"left"}}>N° WR</th>
                          <th style={{padding:"4px 6px",textAlign:"left"}}>Cliente</th>
                          <th style={{padding:"4px 6px",textAlign:"left"}}>Descripción</th>
                          <th style={{padding:"4px 6px",textAlign:"center"}}>Cajas</th>
                          <th style={{padding:"4px 6px",textAlign:"right"}}>Peso</th>
                          <th style={{padding:"4px 6px",textAlign:"right"}}>{isAereo?"P. Vol.":"M³"}</th>
                          <th style={{padding:"4px 6px",textAlign:"right",background:"#FFF3E0"}}>{isAereo?"A cobrar (lb)":"Ft³"}</th>
                        </tr></thead>
                        <tbody>
                          {wrsDelReceptor.map(w=>{
                            const fact=wrPesoFacturable(w,isAereo);
                            const cli=cliDeWR(w);
                            const check=f.wrIds.includes(w.id);
                            return (
                              <tr key={w.id} style={{borderTop:"1px solid #EEF",cursor:"pointer",background:check?"#FFF9E6":""}} onClick={()=>toggleWR(w.id)}>
                                <td style={{padding:"4px 6px",textAlign:"center"}}><input type="checkbox" checked={check} readOnly/></td>
                                <td style={{padding:"4px 6px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{w.id}</td>
                                <td style={{padding:"4px 6px",color:"var(--t2)"}}>{cli?[cli.primerNombre,cli.primerApellido].filter(Boolean).join(" "):w.consignee||"—"}</td>
                                <td style={{padding:"4px 6px",color:"var(--t2)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanReempaqueDesc(w.descripcion)||"—"}</td>
                                <td style={{padding:"4px 6px",textAlign:"center"}}>{w.cajas||1}</td>
                                <td style={{padding:"4px 6px",textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{w.pesoLb||0}lb</td>
                                <td style={{padding:"4px 6px",textAlign:"right",fontFamily:"'DM Mono',monospace",color:"var(--orange)"}}>{isAereo?`${w.volLb||0}lb`:(w.m3||0)}</td>
                                <td style={{padding:"4px 6px",textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"#E65100",background:"#FFF8E1"}}>{fact.valor.toFixed(isAereo?1:2)}{isAereo?" lb":" ft³"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {f.wrIds.length>0&&(
                          <tfoot>
                            <tr style={{background:"#FFF3E0",fontWeight:700,borderTop:"2px solid #E65100"}}>
                              <td colSpan={7} style={{padding:"5px 8px",textAlign:"right"}}>TOTAL A COBRAR:</td>
                              <td style={{padding:"5px 8px",textAlign:"right",fontFamily:"'DM Mono',monospace",color:"#BF360C",fontSize:13}}>{totalFact.toFixed(isAereo?1:2)}{isAereo?" lb":" ft³"}</td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                )}

                {/* PASO 4 — Datos del receptor */}
                {guiaSel&&f.receptorEntidad&&f.wrIds.length>0&&(
                  <div style={{background:"#F5F7FB",borderRadius:6,padding:10,marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",marginBottom:6}}>4️⃣ Datos del receptor que firma</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Consignatario *</div>
                        <input className="fi" value={f.consignatario} onChange={e=>setDnModal(p=>({...p,consignatario:e.target.value}))} placeholder="Nombre del destinatario / empresa"/>
                      </div>
                      <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Persona que firma *</div>
                        <input className="fi" value={f.receptorNombre} onChange={e=>setDnModal(p=>({...p,receptorNombre:e.target.value}))} placeholder="Nombre y apellido"/>
                      </div>
                      <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>ID Identificación</div>
                        <input className="fi" value={f.receptorDocumento} onChange={e=>setDnModal(p=>({...p,receptorDocumento:e.target.value}))} placeholder="Nº de identificación"/>
                      </div>
                      <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Teléfono</div>
                        <input className="fi" value={f.receptorTelefono} onChange={e=>setDnModal(p=>({...p,receptorTelefono:e.target.value}))} placeholder="0414-1234567"/>
                      </div>
                      <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Método de entrega</div>
                        <select className="fs" value={f.metodoEntrega} onChange={e=>setDnModal(p=>({...p,metodoEntrega:e.target.value}))} style={{width:"100%"}}>
                          <option value="retiro_oficina">🏢 Retiro en oficina</option>
                          <option value="domicilio">🏠 Entrega a domicilio</option>
                          <option value="transportista">🚚 Transportista / Agente</option>
                        </select>
                      </div>
                      {f.metodoEntrega==="transportista"&&(
                        <div><div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Transportista</div>
                          <input className="fi" value={f.transportista} onChange={e=>setDnModal(p=>({...p,transportista:e.target.value}))} placeholder="MRW, Zoom…"/>
                        </div>
                      )}
                      <div style={{gridColumn:"1/-1"}}>
                        <div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Dirección de entrega</div>
                        <input className="fi" value={f.direccionEntrega} onChange={e=>setDnModal(p=>({...p,direccionEntrega:e.target.value}))} placeholder="Av. Principal, Edif X — Municipio, Estado"/>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <div style={{fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:2}}>Notas</div>
                        <textarea className="fi" rows={2} value={f.notas} onChange={e=>setDnModal(p=>({...p,notas:e.target.value}))} placeholder="Observaciones de la entrega…" style={{resize:"vertical"}}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mft" style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                <div style={{fontSize:12,color:"var(--t3)"}}>
                  
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn-s" onClick={()=>setDnModal(null)}>Cancelar</button>
                  <button className="btn-p" style={{background:colorTipo,borderColor:colorTipo}}
                    onClick={dnSubmit}>
                    {editing?"💾 Guardar cambios":(esDespacho?"🚚 Crear Despacho":"📦 Crear Entrega")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delivery Note — NOTA IMPRIMIBLE ─────────────────────────────────── */}
      {dnPrint&&(()=>{
        const dn=dnPrint;
        const wrs=(dn.wrIds||[]).map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const esDespacho=(dn.tipo||"entrega")==="despacho";
        const guia=dn.guiaId?consolList.find(c=>c.id===dn.guiaId):null;
        const isAereo=dnGuiaEsAerea(guia);
        const totalCajas=wrs.reduce((s,w)=>s+(w.cajas||0),0);
        const totalRealLb=wrs.reduce((s,w)=>s+(parseFloat(w.pesoLb)||0),0);
        const totalVolLb =wrs.reduce((s,w)=>s+(parseFloat(w.volLb )||0),0);
        const totalFt3   =wrs.reduce((s,w)=>s+(parseFloat(w.ft3   )||0),0);
        const totalM3    =wrs.reduce((s,w)=>s+(parseFloat(w.m3    )||0),0);
        const totalFact  =wrs.reduce((s,w)=>s+wrPesoFacturable(w,isAereo).valor,0);
        const metodoLabel={retiro_oficina:"Retiro en oficina",domicilio:"Entrega a domicilio",transportista:"Transportista / Agente",despacho:"Despacho"};
        // Para despacho, agrupar visualmente los WR por cliente
        const grupos=esDespacho?(()=>{
          const m=new Map();
          wrs.forEach(w=>{
            const cli=cliDeWR(w);
            const k=cli?.id||"sin_cliente";
            if(!m.has(k))m.set(k,{cliente:cli,nombre:cli?[cli.primerNombre,cli.primerApellido].filter(Boolean).join(" "):(w.consignee||"—"),casillero:cli?.casillero||"",wrs:[]});
            m.get(k).wrs.push(w);
          });
          return [...m.values()];
        })():null;
        return(
          <div className="ov">
            <div className="modal mlg" style={{maxWidth:900,width:"96%"}}>
              <div className="mhd no-print">
                <div className="mt">🖨️ Nota de {esDespacho?"Despacho":"Entrega"} — {dn.id}</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn-p" style={{fontSize:13,padding:"4px 12px"}} onClick={()=>window.print()}>🖨️ Imprimir</button>
                  <button className="mcl" onClick={()=>setDnPrint(null)}>✕</button>
                </div>
              </div>
              <div className="mbd" style={{maxHeight:"78vh",overflow:"auto"}}>
                <div className="dn-print" style={{background:"#fff",color:"#000",padding:"24px 28px",fontFamily:"Arial,Helvetica,sans-serif",fontSize:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"2px solid #000",paddingBottom:10,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:22,fontWeight:900,letterSpacing:2}}>ENEX</div>
                      <div style={{fontSize:12}}>{empresaNombre||"Int'l Courier"}</div>
                      <div style={{fontSize:11,color:"#555"}}>Nota de {esDespacho?"Despacho a Agente / Oficina / Autónomo":"Entrega al Cliente"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700}}>N° {dn.id}</div>
                      <div style={{fontSize:12}}>Fecha: {fmtDate(dn.fecha)} {fmtTime(dn.fecha)}</div>
                      <div style={{fontSize:12}}>Guía: <b>{dn.guiaId||"—"}</b>{guia?.tipoEnvio?` · ${guia.tipoEnvio}`:""}</div>
                      <div style={{fontSize:12}}>Usuario: {dn.usuario||"—"}</div>
                      {dn.anulado&&<div style={{fontSize:13,fontWeight:900,color:"#C62828",marginTop:4,border:"2px solid #C62828",padding:"2px 6px",display:"inline-block"}}>ANULADA</div>}
                    </div>
                  </div>

                  <table style={{width:"100%",fontSize:13,marginBottom:12}}>
                    <tbody>
                      <tr><td style={{fontWeight:700,width:140,paddingBottom:3}}>{esDespacho?"Receptor (entidad):":"Consignatario:"}</td><td style={{paddingBottom:3}}>{dn.consignatario||dn.receptorEntidad?.nombre||"—"}</td></tr>
                      {esDespacho&&dn.receptorEntidad?.despacha&&<tr><td style={{fontWeight:700,paddingBottom:3}}>Despacha:</td><td style={{paddingBottom:3}}>{dn.receptorEntidad.despacha}</td></tr>}
                      {esDespacho&&dn.receptorEntidad?.chofer&&<tr><td style={{fontWeight:700,paddingBottom:3}}>Transporta:</td><td style={{paddingBottom:3}}>{dn.receptorEntidad.chofer}{dn.receptorEntidad.choferId?` · ID ${dn.receptorEntidad.choferId}`:""}{dn.receptorEntidad.vehiculo?` · ${dn.receptorEntidad.vehiculo}`:""}</td></tr>}
                      {esDespacho&&dn.receptorEntidad?.recibidoPor&&<tr><td style={{fontWeight:700,paddingBottom:3}}>Recibido en sucursal:</td><td style={{paddingBottom:3}}>{dn.receptorEntidad.recibidoPor} · {fmtDate(dn.receptorEntidad.recibidoFecha)} {fmtTime(dn.receptorEntidad.recibidoFecha)}</td></tr>}
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>{esDespacho||dn.receptorEntidad?.recibe==="encargado"?"Recibe:":"Persona que firma:"}</td><td style={{paddingBottom:3}}>{dn.receptorNombre||"—"}{dn.receptorEntidad?.recibe==="encargado"&&!esDespacho?" (encargado)":""}{dn.receptorEntidad?.relacion?` · ${dn.receptorEntidad.relacion}`:""}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>ID Identificación:</td><td style={{paddingBottom:3}}>{dn.receptorDocumento||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Teléfono:</td><td style={{paddingBottom:3}}>{dn.receptorTelefono||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Método:</td><td style={{paddingBottom:3}}>{metodoLabel[dn.metodoEntrega]||"—"}</td></tr>
                      {dn.direccionEntrega&&<tr><td style={{fontWeight:700,paddingBottom:3,verticalAlign:"top"}}>Dirección:</td><td style={{paddingBottom:3}}>{dn.direccionEntrega}</td></tr>}
                      {dn.transportista&&!esDespacho&&<tr><td style={{fontWeight:700,paddingBottom:3}}>Transportista:</td><td style={{paddingBottom:3}}>{dn.transportista}</td></tr>}
                      {dn.notas&&<tr><td style={{fontWeight:700,paddingBottom:3,verticalAlign:"top"}}>Notas:</td><td style={{paddingBottom:3,whiteSpace:"pre-wrap"}}>{dn.notas}</td></tr>}
                      {dn.anulado&&dn.motivoAnulacion&&<tr><td style={{fontWeight:700,color:"#C62828"}}>Motivo anulación:</td><td style={{color:"#C62828"}}>{dn.motivoAnulacion}</td></tr>}
                    </tbody>
                  </table>

                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>
                    Detalle de la {esDespacho?"despacho":"entrega"} · {wrs.length} WR · {totalCajas} cajas
                    {isAereo
                      ?<> · Peso real {totalRealLb.toFixed(1)}lb · P.Vol {totalVolLb.toFixed(1)}lb</>
                      :<> · {totalFt3.toFixed(2)}ft³ · {totalM3.toFixed(3)}m³</>}
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
                    <thead>
                      <tr style={{background:"#EEE"}}>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>#</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>WR</th>
                        {esDespacho&&<th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Cliente</th>}
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Descripción</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>Cajas</th>
                        {isAereo?(
                          <>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>Peso real (lb)</th>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>P. Vol. (lb)</th>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",background:"#FFF3E0"}}>A cobrar (lb)</th>
                          </>
                        ):(
                          <>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>Peso (lb)</th>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",background:"#FFF3E0"}}>Ft³</th>
                            <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",background:"#FFF3E0"}}>M³</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(()=>{
                        const totCols=esDespacho?(isAereo?8:8):(isAereo?7:7);
                        const rows=[];
                        const renderRow=(w,i)=>{
                          const desc=cleanReempaqueDesc(w.descripcion)||"—";
                          const cli=cliDeWR(w);
                          const cliLabel=cli?`${[cli.primerNombre,cli.primerApellido].filter(Boolean).join(" ")}${cli.casillero?` · ${cli.casillero}`:""}`:w.consignee||"—";
                          const fact=wrPesoFacturable(w,isAereo);
                          return(
                            <tr key={w.id}>
                              <td style={{border:"1px solid #999",padding:"3px 6px"}}>{i+1}</td>
                              <td style={{border:"1px solid #999",padding:"3px 6px",fontWeight:700,fontFamily:"monospace"}}>{w.id}</td>
                              {esDespacho&&<td style={{border:"1px solid #999",padding:"3px 6px"}}>{cliLabel}</td>}
                              <td style={{border:"1px solid #999",padding:"3px 6px"}}>{desc.length>60?desc.slice(0,57)+"…":desc}</td>
                              <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"center"}}>{w.cajas||1}</td>
                              {isAereo?(
                                <>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace"}}>{(parseFloat(w.pesoLb)||0).toFixed(1)}</td>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace"}}>{(parseFloat(w.volLb)||0).toFixed(1)}</td>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:700,background:"#FFF8E1"}}>{fact.valor.toFixed(1)}</td>
                                </>
                              ):(
                                <>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace"}}>{(parseFloat(w.pesoLb)||0).toFixed(1)}</td>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:700,background:"#FFF8E1"}}>{(parseFloat(w.ft3)||0).toFixed(2)}</td>
                                  <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace",background:"#FFF8E1"}}>{(parseFloat(w.m3)||0).toFixed(3)}</td>
                                </>
                              )}
                            </tr>
                          );
                        };
                        let idx=0;
                        if(esDespacho&&grupos&&grupos.length>0){
                          grupos.forEach((g,gi)=>{
                            rows.push(
                              <tr key={`hdr-${gi}`} style={{background:"#F0F4FA"}}>
                                <td colSpan={totCols} style={{border:"1px solid #999",padding:"4px 8px",fontWeight:700}}>👤 {g.nombre}{g.casillero?` · ${g.casillero}`:""} ({g.wrs.length} WR)</td>
                              </tr>
                            );
                            g.wrs.forEach(w=>{rows.push(renderRow(w,idx));idx++;});
                          });
                        }else{
                          wrs.forEach(w=>{rows.push(renderRow(w,idx));idx++;});
                        }
                        if(wrs.length===0){
                          rows.push(<tr key="empty"><td colSpan={totCols} style={{border:"1px solid #999",padding:"8px 6px",textAlign:"center",color:"#999"}}>(sin WR)</td></tr>);
                        }
                        // Totales
                        rows.push(
                          <tr key="tot" style={{background:"#F8F8F8",fontWeight:700}}>
                            <td colSpan={esDespacho?4:3} style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>TOTALES:</td>
                            <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>{totalCajas}</td>
                            {isAereo?(
                              <>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace"}}>{totalRealLb.toFixed(1)}</td>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace"}}>{totalVolLb.toFixed(1)}</td>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:900,background:"#FFE0B2",fontSize:13,color:"#BF360C"}}>{totalFact.toFixed(1)} lb</td>
                              </>
                            ):(
                              <>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace"}}>{totalRealLb.toFixed(1)}</td>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:900,background:"#FFE0B2",fontSize:13,color:"#BF360C"}}>{totalFt3.toFixed(2)} ft³</td>
                                <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:900,background:"#FFE0B2",fontSize:13,color:"#BF360C"}}>{totalM3.toFixed(3)} m³</td>
                              </>
                            )}
                          </tr>
                        );
                        return rows;
                      })()}
                    </tbody>
                  </table>

                  <div style={{border:"1px solid #000",padding:"8px 10px",fontSize:12,background:"#FAFAFA",marginBottom:30}}>
                    <b>DECLARACIÓN DE RECEPCIÓN:</b> El receptor declara haber recibido conforme, en buen estado y en la cantidad indicada, la mercancía descrita en esta nota. Cualquier discrepancia o daño visible debe ser reportado al momento de la firma. Una vez firmada, ENEX queda liberado de toda responsabilidad sobre la custodia de la mercancía listada.
                  </div>

                  <div style={{display:"flex",justifyContent:"space-between",gap:40,marginTop:40}}>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>{esDespacho?"Despacha":"Entrega ENEX"}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{esDespacho&&dn.receptorEntidad?.despacha?dn.receptorEntidad.despacha:"Firma y sello"}</div>
                    </div>
                    {esDespacho&&<div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Transporta</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{dn.receptorEntidad?.chofer||"\u00a0"}{dn.receptorEntidad?.choferId?` · ${dn.receptorEntidad.choferId}`:""}</div>
                    </div>}
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Recibe conforme</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{dn.receptorNombre||"—"}{dn.receptorDocumento?` · ${dn.receptorDocumento}`:""}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Factura Modal (borrador / editar / emitir) ── */}
      {facModal&&(()=>{
        const f=facModal;
        const setF=fn=>setFacModal(p=>recalcFactura(fn(p)));
        const updL=(idx,k,v)=>setF(p=>({...p,lineas:p.lineas.map((l,i)=>i===idx?{...l,[k]:v}:l)}));
        const delL=idx=>setF(p=>({...p,lineas:p.lineas.filter((_,i)=>i!==idx)}));
        const addL=l=>setF(p=>({...p,lineas:[...(p.lineas||[]),{cantidad:1,precio:0,total:0,descripcion:"",...l}]}));
        const L=(f.lineas||[]).map((l,i)=>({...l,tipo:l.tipo||"extra",_i:i}));
        const fl=L.filter(l=>l.tipo==="flete"), ad=L.filter(l=>l.tipo==="adicional"), mn=L.filter(l=>l.tipo==="minimo"), ex=L.filter(l=>l.tipo==="extra");
        const sum=(arr,k)=>arr.reduce((t,l)=>t+(parseFloat(l[k])||0),0);
        const esAereoF=/^a[eé]r/i.test(f.tipoEnvio||"")||fl.some(l=>["lb","kg"].includes(l.unidad));
        const uniC=fl[0]?.unidad||f.tarifa?.unidad||(esAereoF?"lb":"ft3");
        const uni=UNI_LBL[uniC]||uniC;
        const colsMed=esAereoF?(uniC==="kg"?[["pesoKg","Kg."],["volKg","Kg. Vol"]]:[["pesoLb","Lb."],["volLb","Lb. Vol"]]):[["ft3","Ft³"],["m3","M³"]];
        const conCli=fl.some(l=>l.cliente);
        const catalogo=[...SERVICIOS_CAT.map(x=>({...x,g:"Servicio"})),...GASTOS_CAT.map(x=>({...x,g:"Gasto"}))];
        const setTarifa=(k,v)=>setF(p=>{
          const t={...(p.tarifa||{porLb:0,porFt3:0,min:0}),[k]:parseFloat(v)||0};
          const precio=esAereoF?t.porLb:t.porFt3;
          return {...p,tarifa:t,lineas:(k==="min")?p.lineas:p.lineas.map(l=>l.tipo==="flete"?{...l,precio}:l)};
        });
        const numIn=(val,on,w=90)=><input className="fi" type="number" step="0.01" value={val} onChange={e=>on(e.target.value)} style={{width:w,fontFamily:"'DM Mono',monospace",textAlign:"right",padding:"4px 6px"}}/>;
        const del=i=><button className="btn-s" style={{fontSize:11,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>delL(i)}>✕</button>;
        const secT={fontSize:15,fontWeight:700,color:"var(--navy)",margin:"16px 0 6px",display:"flex",alignItems:"center",gap:10};
        const setRec=(tipo,id)=>{
          const r=lookupReceptor(tipo,id);
          setFacModal(p=>({...p,receptorTipo:tipo,receptorId:id,
            receptorNombre:r?.nombre||"",receptorDoc:r?.doc||"",receptorDir:r?.dir||"",
            receptorTel:r?.tel||"",receptorEmail:r?.email||"",receptorCasillero:r?.casillero||""}));
        };
        // Opciones de receptor según tipo
        const recOptions=f.receptorTipo==="cliente"||f.receptorTipo==="autonomo"
          ?clients.map(c=>({id:c.id,label:`${[c.primerNombre,c.primerApellido].filter(Boolean).join(" ")} · ${c.casillero||""} · ${c.cedula||""}`}))
          :f.receptorTipo==="agente"
            ?agentes.map(a=>({id:a.id,label:`${a.nombre||a.name||""} · ${a.rif||""}`}))
            :f.receptorTipo==="oficina"
              ?oficinas.map(o=>({id:o.id,label:`${o.nombre||""} · ${o.rif||""}`}))
              :[];
        return(
          <div className="modal-backdrop">
            <div className="modal" style={{width:1150,maxWidth:"98vw",maxHeight:"94vh",overflow:"auto"}}>
              <div className="mh">
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"var(--navy)"}}>
                    {f._editing?"✏️ Editar factura":"📄 Nueva factura"}
                    {f.id&&<span style={{fontFamily:"'DM Mono',monospace",marginLeft:10,color:"var(--navy)"}}>{f.id}</span>}
                    {!f.id&&<span style={{fontFamily:"'DM Mono',monospace",marginLeft:10,color:"var(--t3)"}}>#{buildFacturaId(nextInvoiceNum)}</span>}
                  </div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>Tipo: {f.tipo==="proforma"?"Proforma":"Factura"} · {f.status==="borrador"?"Borrador":FAC_STATUS_LABEL[f.status]}</div>
                </div>
                <button className="mcl" onClick={()=>setFacModal(null)}>✕</button>
              </div>
              <div className="mb" style={{padding:14}}>
                {(f.guiaIds||[]).length>0&&!f._verDatos?(
                  <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{flex:1,minWidth:260}}>
                      <div style={{fontSize:17,fontWeight:800,color:"var(--navy)"}}>{f.receptorNombre||"—"}</div>
                      <div style={{fontSize:13,color:"var(--t2)",marginTop:2}}>
                        {[f.receptorTipo==="agente"?"Agente":f.receptorTipo==="autonomo"?"Autónomo":"Cliente",f.receptorCasillero&&`#${f.receptorCasillero}`,f.receptorDoc&&`ID ${f.receptorDoc}`,f.receptorTel,f.receptorEmail].filter(Boolean).join(" · ")}
                      </div>
                      {f.receptorDir&&<div style={{fontSize:13,color:"var(--t3)"}}>{f.receptorDir}</div>}
                    </div>
                    <div style={{fontSize:13,color:"var(--t2)",textAlign:"right"}}>{fmtDate(f.fecha)} · {f.moneda}</div>
                    <button className="btn-s" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>setFacModal(p=>({...p,_verDatos:true}))}>✏️ Editar datos</button>
                  </div>
                ):(<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
                  <div>
                    <label className="fl">Tipo documento</label>
                    <select className="fi" value={f.tipo} onChange={e=>setFacModal(p=>({...p,tipo:e.target.value}))}>
                      <option value="factura">Factura</option>
                      <option value="proforma">Proforma</option>
                    </select>
                  </div>
                  <div>
                    <label className="fl">Moneda</label>
                    <select className="fi" value={f.moneda} onChange={e=>setFacModal(p=>({...p,moneda:e.target.value}))}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="fl">Tipo de receptor</label>
                    <select className="fi" value={f.receptorTipo} onChange={e=>setFacModal(p=>({...p,receptorTipo:e.target.value,receptorId:"",receptorNombre:"",receptorDoc:"",receptorDir:"",receptorTel:"",receptorEmail:"",receptorCasillero:""}))}>
                      {REC_TYPES.map(r=><option key={r.k} value={r.k}>{r.l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="fl">Fecha</label>
                    <input className="fi" type="date" value={new Date(f.fecha).toISOString().slice(0,10)} onChange={e=>setFacModal(p=>({...p,fecha:new Date(e.target.value+"T12:00:00")}))}/>
                  </div>
                </div>

                <div style={{marginBottom:10}}>
                  <label className="fl">Seleccionar {(REC_TYPES.find(r=>r.k===f.receptorTipo)||{l:""}).l}</label>
                  <select className="fi" value={f.receptorId} onChange={e=>setRec(f.receptorTipo,e.target.value)}>
                    <option value="">— Selecciona —</option>
                    {recOptions.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10}}>
                  <div>
                    <label className="fl">Nombre / Razón social</label>
                    <input className="fi" value={f.receptorNombre} onChange={e=>setFacModal(p=>({...p,receptorNombre:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="fl">ID Identificación</label>
                    <input className="fi" value={f.receptorDoc} onChange={e=>setFacModal(p=>({...p,receptorDoc:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="fl">Casillero</label>
                    <input className="fi" value={f.receptorCasillero} onChange={e=>setFacModal(p=>({...p,receptorCasillero:e.target.value}))}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10}}>
                  <div>
                    <label className="fl">Dirección</label>
                    <input className="fi" value={f.receptorDir} onChange={e=>setFacModal(p=>({...p,receptorDir:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="fl">Teléfono</label>
                    <input className="fi" value={f.receptorTel} onChange={e=>setFacModal(p=>({...p,receptorTel:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="fl">Email</label>
                    <input className="fi" value={f.receptorEmail} onChange={e=>setFacModal(p=>({...p,receptorEmail:e.target.value}))}/>
                  </div>
                </div>

</>)}
                {/* GUÍA, TIPO DE ENVÍO Y TARIFA */}
                <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 12px",marginTop:6}}>
                  <div><div className="fl">Guía</div><div style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--navy)"}}>{(f.guiaIds||[]).join(", ")||"—"}</div></div>
                  <div><div className="fl">Tipo de envío</div><div style={{fontWeight:700}}>{f.tipoEnvio||"—"}</div></div>
                  {f.tarifa?.ruta&&<div><div className="fl">Ruta</div><div style={{fontWeight:600}}>{f.tarifa.ruta}</div></div>}
                  {fl.length>0&&<>
                    <div><div className="fl">Tarifa por {uni}</div>{numIn(esAereoF?(f.tarifa?.porLb??0):(f.tarifa?.porFt3??0),v=>setTarifa(esAereoF?"porLb":"porFt3",v))}</div>
                    <div><div className="fl">Mínimo factura</div>{numIn(f.tarifa?.min??0,v=>setTarifa("min",v))}</div>
                  </>}
                </div>

                {/* WR Y FLETE */}
                {fl.length>0&&<>
                  <div style={secT}>📦 WR y flete</div>
                  <div style={{overflowX:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                    <table className="ct" style={{width:"100%",fontSize:14}}>
                      <thead><tr>
                        <th>N° WR</th>{conCli&&<th>Cliente</th>}<th style={{textAlign:"right"}}>Cajas</th>{colsMed.map(([k,t])=><th key={k} style={{textAlign:"right"}}>{t}</th>)}
                        <th style={{textAlign:"right"}}>A cobrar ({uni})</th><th style={{textAlign:"right"}}>Tarifa</th><th style={{textAlign:"right"}}>Importe</th><th></th>
                      </tr></thead>
                      <tbody>
                        {fl.map(l=>(
                          <tr key={l._i}>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{l.wrId}</td>
                            {conCli&&<td>{l.cliente}<div style={{fontSize:12,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{l.casillero}</div></td>}
                            <td style={{textAlign:"right"}}>{l.cajas}</td>
                            {colsMed.map(([k])=><td key={k} style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{l[k]??"—"}</td>)}
                            <td style={{textAlign:"right"}}>{numIn(l.cantidad,v=>updL(l._i,"cantidad",v),80)}</td>
                            <td style={{textAlign:"right"}}>{numIn(l.precio,v=>updL(l._i,"precio",v),80)}</td>
                            <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(l.total,f.moneda)}</td>
                            <td>{del(l._i)}</td>
                          </tr>
                        ))}
                        {fl.length>1&&<tr style={{background:"var(--bg4)",fontWeight:800,borderTop:"2px solid var(--navy)"}}>
                          <td style={{whiteSpace:"nowrap"}}>TOTALES · {fl.length} WR</td>{conCli&&<td></td>}
                          <td style={{textAlign:"right"}}>{sum(fl,"cajas")}</td>
                          {colsMed.map(([k])=><td key={k} style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{r2(sum(fl,k))}</td>)}
                          <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{r2(sum(fl,"cantidad"))} {uni}</td>
                          <td></td>
                          <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{fmtMoney(sum(fl,"total"),f.moneda)}</td><td></td>
                        </tr>}
                      </tbody>
                    </table>
                  </div>
                </>}

                {/* SERVICIOS Y GASTOS ADICIONALES */}
                <div style={secT}>⚡ Servicios y gastos adicionales
                  <select className="fs" value="" style={{fontSize:13,padding:"3px 6px",width:"auto"}} onChange={e=>{
                    const c=catalogo.find(x=>x.nombre===e.target.value);
                    if(c)addL({tipo:"adicional",wrId:(f.wrIds||[])[0]||"",descripcion:c.nombre,precio:c.precio});
                  }}>
                    <option value="">+ Agregar del catálogo…</option>
                    {catalogo.map(c=><option key={c.g+c.nombre} value={c.nombre}>{c.g}: {c.nombre} — {fmtMoney(c.precio,f.moneda)}</option>)}
                  </select>
                </div>
                {ad.length===0?<div style={{fontSize:13,color:"var(--t3)"}}>—</div>:
                  <table className="ct" style={{width:"100%",fontSize:14}}>
                    <thead><tr><th>N° WR</th><th>Concepto</th><th style={{textAlign:"right"}}>Cant.</th><th style={{textAlign:"right"}}>Precio</th><th style={{textAlign:"right"}}>Importe</th><th></th></tr></thead>
                    <tbody>{ad.map(l=>(
                      <tr key={l._i}>
                        <td><select className="fs" value={l.wrId||""} onChange={e=>updL(l._i,"wrId",e.target.value)} style={{fontSize:13,padding:"3px 6px"}}>
                          <option value="">—</option>{(f.wrIds||[]).map(id=><option key={id} value={id}>{id}</option>)}</select></td>
                        <td><input className="fi" value={l.descripcion} onChange={e=>updL(l._i,"descripcion",e.target.value)}/></td>
                        <td style={{textAlign:"right"}}>{numIn(l.cantidad,v=>updL(l._i,"cantidad",v),70)}</td>
                        <td style={{textAlign:"right"}}>{numIn(l.precio,v=>updL(l._i,"precio",v))}</td>
                        <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(l.total,f.moneda)}</td>
                        <td>{del(l._i)}</td>
                      </tr>))}</tbody>
                  </table>}

                {/* COBROS EXTRA */}
                <div style={secT}>➕ Cobros extra
                  <button className="btn-s" style={{fontSize:12,padding:"3px 10px"}} onClick={()=>addL({tipo:"extra"})}>+ Agregar</button>
                </div>
                {ex.length===0?<div style={{fontSize:13,color:"var(--t3)"}}>—</div>:
                  <table className="ct" style={{width:"100%",fontSize:14}}>
                    <thead><tr><th>Concepto</th><th style={{textAlign:"right"}}>Cant.</th><th style={{textAlign:"right"}}>Precio</th><th style={{textAlign:"right"}}>Importe</th><th></th></tr></thead>
                    <tbody>{ex.map(l=>(
                      <tr key={l._i}>
                        <td><input className="fi" value={l.descripcion||""} onChange={e=>updL(l._i,"descripcion",e.target.value)} placeholder="Concepto"/></td>
                        <td style={{textAlign:"right"}}>{numIn(l.cantidad,v=>updL(l._i,"cantidad",v),70)}</td>
                        <td style={{textAlign:"right"}}>{numIn(l.precio,v=>updL(l._i,"precio",v))}</td>
                        <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(l.total,f.moneda)}</td>
                        <td>{del(l._i)}</td>
                      </tr>))}</tbody>
                  </table>}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:16}}>
                  <div>
                    <label className="fl">Notas</label>
                    <textarea className="fi" rows={3} value={f.notas||""} onChange={e=>setFacModal(p=>({...p,notas:e.target.value}))} style={{resize:"vertical",textTransform:"none"}}/>
                    <label className="fl" style={{marginTop:8}}>Condiciones</label>
                    <textarea className="fi" rows={2} value={f.condiciones||""} onChange={e=>setFacModal(p=>({...p,condiciones:e.target.value}))} style={{resize:"vertical",textTransform:"none"}}/>
                  </div>
                  <div style={{background:"var(--bg4)",padding:12,borderRadius:8,border:"1px solid var(--b1)",fontSize:14}}>
                    {[["Flete",sum(fl,"total")],["Ajuste a mínimo",sum(mn,"total")],["Servicios y gastos",sum(ad,"total")],["Cobros extra",sum(ex,"total")]].filter(([k,v])=>v!==0||k==="Flete").map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>{k}:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(v,f.moneda)}</span></div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",margin:"6px 0",paddingTop:6,borderTop:"1px solid var(--b1)",fontWeight:700}}><span>Subtotal:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.subtotal||0,f.moneda)}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,marginBottom:6}}>
                      <span>Descuento:</span>
                      <span style={{display:"flex",gap:4,alignItems:"center"}}>
                        <select className="fs" value={f.descuentoTipo||"monto"} onChange={e=>setF(p=>({...p,descuentoTipo:e.target.value}))} style={{fontSize:13,padding:"3px 6px",width:"auto"}}>
                          <option value="monto">Monto</option><option value="pct">%</option>
                        </select>
                        {numIn(f.descuentoValor??0,v=>setF(p=>({...p,descuentoValor:parseFloat(v)||0})),80)}
                        <span style={{fontFamily:"'DM Mono',monospace",color:"var(--red)",minWidth:80,textAlign:"right"}}>−{fmtMoney(f.descuento||0,f.moneda)}</span>
                      </span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"2px solid var(--navy)",fontSize:18,fontWeight:800,color:"var(--navy)"}}>
                      <span>TOTAL:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.total||0,f.moneda)}</span>
                    </div>
                    {(f.pagado||0)>0&&<>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:13,color:"var(--green)"}}><span>Pagado:</span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(f.pagado,f.moneda)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--orange)",fontWeight:700}}><span>Saldo:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.saldo,f.moneda)}</span></div>
                    </>}
                  </div>
                </div>
              </div>
              <div className="mf" style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn-s" onClick={()=>setFacModal(null)}>Cancelar</button>
                {f.status==="borrador"&&<button className="btn-s" onClick={facSaveBorrador}>💾 Guardar borrador</button>}
                {(f.status==="borrador"||f.status==="emitida")&&<button className="btn-p" onClick={facEmitir}>📤 {f.status==="emitida"?"Actualizar emitida":"Emitir"}</button>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Cobro (varias facturas + saldo a favor) ── */}
      {cobroModal&&(()=>{
        const m=cobroModal, c=cobroCalc(m);
        const set=patch=>setCobroModal(x=>({...x,...patch}));
        const lista=m.pagador?null:pagadoresConMovimiento();
        const mons=m.pagador?monedasDe(m.pagador):[];
        const IC={cliente:"👤",agente:"🤝",autonomo:"🧑‍💻"};
        const aplicDe=id=>c.aplic.find(x=>x.f.id===id)?.monto||0;
        return(
          <div className="ov">
            <div className="modal mmd">
              <div className="mhd">
                <div style={{flex:1}}>
                  <div className="mt">💵 Registrar cobro</div>
                  {m.pagador&&<div style={{fontSize:14,color:"var(--t2)",fontWeight:600}}>{IC[m.pagador.tipo]||"•"} {m.pagador.nombre}</div>}
                </div>
                <button className="mcl" onClick={cobroCerrar}>✕</button>
              </div>
              <div>
                {!m.pagador?(
                  <div>
                    <label className="fl">¿Quién paga?</label>
                    {lista.length===0?<div style={{padding:20,textAlign:"center",color:"var(--t3)"}}>No hay facturas pendientes.</div>:
                    <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:420,overflowY:"auto"}}>
                      {lista.map(pg=>{const fs=facAbiertasDe(pg);const porMon={};fs.forEach(f=>{porMon[f.moneda||"USD"]=(porMon[f.moneda||"USD"]||0)+(f.saldo||0);});
                        return <button key={pagKey(pg)} className="btn-s" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",fontSize:14,textAlign:"left"}} onClick={()=>cobroAbrir(pg)}>
                          <span><b>{IC[pg.tipo]||"•"} {pg.nombre}</b> <span style={{color:"var(--t3)",fontSize:12}}>· {fs.length} factura(s)</span></span>
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--orange)"}}>{Object.entries(porMon).map(([k,v])=>fmtMoney(v,k)).join(" · ")||"—"}</span>
                        </button>;})}
                    </div>}
                  </div>
                ):(<>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    <div className="card" style={{padding:10}}><div style={{fontSize:12,color:"var(--t3)"}}>Deuda total</div><div style={{fontSize:18,fontWeight:800,color:"var(--orange)",fontFamily:"'DM Mono',monospace"}}>{fmtMoney(c.deudaTot,m.moneda)}</div></div>
                    <div className="card" style={{padding:10}}><div style={{fontSize:12,color:"var(--t3)"}}>Saldo a favor</div><div style={{fontSize:18,fontWeight:800,color:"var(--green)",fontFamily:"'DM Mono',monospace"}}>{fmtMoney(c.favorDisp,m.moneda)}</div></div>
                    <div className="card" style={{padding:10}}><div style={{fontSize:12,color:"var(--t3)"}}>Marcado</div><div style={{fontSize:18,fontWeight:800,color:"var(--navy)",fontFamily:"'DM Mono',monospace"}}>{fmtMoney(c.deudaSel,m.moneda)}</div></div>
                  </div>
                  {mons.length>1&&<div style={{display:"flex",gap:6,marginBottom:10}}>{mons.map(k=><button key={k} className={m.moneda===k?"btn-p":"btn-s"} style={{fontSize:13,padding:"4px 12px"}} onClick={()=>{const sel={};facAbiertasDe(m.pagador).filter(f=>(f.moneda||"USD")===k).forEach(f=>{sel[f.id]=true;});set({moneda:k,sel,usarSaldo:saldoFavorDe(m.pagador,k)>0});}}>{k}</button>)}</div>}
                  {c.facs.length===0?<div style={{padding:14,textAlign:"center",color:"var(--t3)",border:"1px dashed var(--b1)",borderRadius:8,marginBottom:12}}>Sin facturas pendientes: el pago queda como saldo a favor.</div>:
                  <table className="ct" style={{width:"100%",fontSize:14,marginBottom:12}}>
                    <thead><tr><th style={{width:30}}><input type="checkbox" checked={c.facs.every(f=>m.sel[f.id])} onChange={e=>{const sel={};if(e.target.checked)c.facs.forEach(f=>{sel[f.id]=true;});set({sel});}}/></th><th>Factura</th><th>Emisión</th><th style={{textAlign:"right"}}>Saldo</th><th style={{textAlign:"right"}}>Se abona</th><th style={{textAlign:"right"}}>Queda</th></tr></thead>
                    <tbody>{c.facs.map(f=>{const a=aplicDe(f.id);return(
                      <tr key={f.id} style={{opacity:m.sel[f.id]?1:.5}}>
                        <td><input type="checkbox" checked={!!m.sel[f.id]} onChange={e=>set({sel:{...m.sel,[f.id]:e.target.checked}})}/></td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{f.id}</td>
                        <td style={{fontSize:13}}>{fmtDate(f.fechaEmision||f.fecha)}</td>
                        <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.saldo,f.moneda)}</td>
                        <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontWeight:800,color:a>0?"var(--green)":"var(--t4)"}}>{a>0?fmtMoney(a,f.moneda):"—"}</td>
                        <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:(f.saldo-a)>0.001?"var(--orange)":"var(--green)"}}>{m.sel[f.id]?fmtMoney(Math.max(0,f.saldo-a),f.moneda):""}</td>
                      </tr>);})}</tbody>
                  </table>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label className="fl">Monto recibido ({m.moneda})</label>
                      <input className="fi" type="number" step="0.01" min="0" value={m.monto} onChange={e=>set({monto:e.target.value})} style={{fontSize:18,fontWeight:800}}/></div>
                    <div><label className="fl">Fecha</label>
                      <input className="fi" type="date" value={new Date(m.fecha).toISOString().slice(0,10)} onChange={e=>set({fecha:new Date(e.target.value+"T12:00:00")})}/></div>
                    <div><label className="fl">Forma de pago</label>
                      <select className="fi" value={m.tipoPago} onChange={e=>set({tipoPago:e.target.value})}>{PAY_METHODS.filter(x=>!x.interno).map(x=><option key={x.k} value={x.k}>{x.l}</option>)}</select></div>
                    <div><label className="fl">Referencia</label>
                      <input className="fi" value={m.referencia} onChange={e=>set({referencia:e.target.value})}/></div>
                    <div><label className="fl">Comprobante</label>
                      <input className="fi" type="file" accept="image/*,application/pdf" onChange={e=>set({archivo:e.target.files?.[0]||null})}/></div>
                    <div><label className="fl">Nota</label>
                      <input className="fi" value={m.nota} onChange={e=>set({nota:e.target.value})}/></div>
                  </div>
                  {c.favorDisp>0&&<label style={{display:"flex",alignItems:"center",gap:8,marginTop:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                    <input type="checkbox" checked={!!m.usarSaldo} onChange={e=>set({usarSaldo:e.target.checked})}/> Usar saldo a favor ({fmtMoney(c.favorDisp,m.moneda)})</label>}
                  <div style={{marginTop:12,border:"1px solid var(--b1)",borderRadius:8,padding:"10px 14px",background:"var(--bg3)",fontSize:14}}>
                    {[["Recibido",c.recibido,"var(--t1)"],c.favorUsado>0&&["Saldo a favor usado",c.favorUsado,"var(--t1)"],["Aplicado a facturas",c.totAplic,"var(--navy)"],
                      c.pendienteSel>0.001&&["Queda pendiente",c.pendienteSel,"var(--orange)"],c.excedente>0&&["Queda a favor",c.excedente,"var(--green)"],["Saldo a favor final",c.favorFinal,"var(--green)"]]
                      .filter(Boolean).map(([k,v,col])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}><span>{k}</span><b style={{fontFamily:"'DM Mono',monospace",color:col}}>{fmtMoney(v,m.moneda)}</b></div>)}
                  </div>
                </>)}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,paddingTop:12,borderTop:"1px solid var(--b1)"}}>
                {m.pagador&&<button className="btn-s" style={{marginRight:"auto"}} onClick={()=>set({pagador:null})}>← Cambiar pagador</button>}
                <button className="btn-s" onClick={cobroCerrar}>Cancelar</button>
                {m.pagador&&<button className="btn-p" onClick={cobroSubmit}>💵 Registrar y emitir recibo</button>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Pago Modal ── */}
      {pagoModal&&(()=>{
        const p=pagoModal;
        const fact=facturas.find(x=>x.id===p.facturaId);
        if(!fact)return null;
        return(
          <div className="modal-backdrop">
            <div className="modal" style={{width:560}}>
              <div className="mh">
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"var(--navy)"}}>💵 Registrar pago</div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>Factura {fact.id} · Saldo {fmtMoney(fact.saldo,fact.moneda)}</div>
                </div>
                <button className="mcl" onClick={()=>setPagoModal(null)}>✕</button>
              </div>
              <div className="mb" style={{padding:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div>
                    <label className="fl">Monto ({fact.moneda})</label>
                    <input className="fi" type="number" step="0.01" value={p.monto} onChange={e=>setPagoModal(x=>({...x,monto:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="fl">Fecha</label>
                    <input className="fi" type="date" value={new Date(p.fecha).toISOString().slice(0,10)} onChange={e=>setPagoModal(x=>({...x,fecha:new Date(e.target.value+"T12:00:00")}))}/>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <label className="fl">Tipo de pago</label>
                  <select className="fi" value={p.tipoPago} onChange={e=>setPagoModal(x=>({...x,tipoPago:e.target.value}))}>
                    {PAY_METHODS.filter(m=>!m.interno).map(m=><option key={m.k} value={m.k}>{m.l}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:10}}>
                  <label className="fl">Referencia</label>
                  <input className="fi" value={p.referencia} onChange={e=>setPagoModal(x=>({...x,referencia:e.target.value}))} placeholder="Nº confirmación, últimos 4 dígitos, etc."/>
                </div>
                <div>
                  <label className="fl">Nota referencial</label>
                  <textarea className="fi" rows={2} value={p.notaReferencial} onChange={e=>setPagoModal(x=>({...x,notaReferencial:e.target.value}))} style={{resize:"vertical"}}/>
                </div>
              </div>
              <div className="mf" style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn-s" onClick={()=>setPagoModal(null)}>Cancelar</button>
                <button className="btn-p" onClick={pagoSubmit}>💵 Registrar pago</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Nota de Crédito Modal ── */}
      {ncModal&&(()=>{
        const orig=facturas.find(x=>x.id===ncModal.facturaOrigenId);
        if(!orig)return null;
        return(
          <div className="modal-backdrop">
            <div className="modal" style={{width:520}}>
              <div className="mh">
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"var(--purple)"}}>📝 Nota de Crédito</div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>Factura origen: {orig.id} · Total {fmtMoney(orig.total,orig.moneda)} · Pagado {fmtMoney(orig.pagado,orig.moneda)}</div>
                </div>
                <button className="mcl" onClick={()=>setNcModal(null)}>✕</button>
              </div>
              <div className="mb" style={{padding:14}}>
                <div style={{marginBottom:10}}>
                  <label className="fl">Monto a acreditar ({orig.moneda})</label>
                  <input className="fi" type="number" step="0.01" value={ncModal.monto} onChange={e=>setNcModal(x=>({...x,monto:e.target.value}))}/>
                </div>
                {(()=>{const exc=r2((parseFloat(ncModal.monto)||0)-Math.min(parseFloat(ncModal.monto)||0,orig.saldo||0));if(exc<=0)return null;
                  return(<div style={{marginBottom:10}}>
                    <label className="fl">Ya pagado: {fmtMoney(exc,orig.moneda)}</label>
                    <div style={{display:"flex",gap:6}}>
                      {[["favor","⭐ Saldo a favor"],["reembolso","💵 Reembolsado"]].map(([k,l])=><button key={k} className={ncModal.destino===k?"btn-p":"btn-s"} style={{fontSize:13,padding:"5px 12px"}} onClick={()=>setNcModal(x=>({...x,destino:k}))}>{l}</button>)}
                      {ncModal.destino==="reembolso"&&<select className="fs" style={{width:170}} value={ncModal.metodoReemb||"efectivo"} onChange={e=>setNcModal(x=>({...x,metodoReemb:e.target.value}))}>{PAY_METHODS.filter(x=>!x.interno).map(x=><option key={x.k} value={x.k}>{x.l}</option>)}</select>}
                    </div>
                  </div>);})()}
                <div style={{marginBottom:10}}>
                  <label className="fl">Motivo</label>
                  <input className="fi" value={ncModal.motivo} onChange={e=>setNcModal(x=>({...x,motivo:e.target.value}))} placeholder="Ej: Descuento por retraso, devolución parcial…"/>
                </div>
                <div>
                  <label className="fl">Notas internas</label>
                  <textarea className="fi" rows={2} value={ncModal.notas} onChange={e=>setNcModal(x=>({...x,notas:e.target.value}))} style={{resize:"vertical"}}/>
                </div>
              </div>
              <div className="mf" style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn-s" onClick={()=>setNcModal(null)}>Cancelar</button>
                <button className="btn-p" style={{background:"var(--purple)"}} onClick={ncSubmit}>📝 Emitir NC</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Factura Print Modal ── */}
      {reciboVer&&(
        <div className="ov">
          <div className="modal mlg" style={{maxWidth:900,width:"96%"}}>
            <div className="mhd no-print">
              <div className="mt">🖨️ Recibo de Cobro — {reciboVer}</div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-p" style={{fontSize:13,padding:"4px 12px"}} onClick={()=>printRecibo(reciboVer)}>🖨️ Imprimir</button>
                <button className="mcl" onClick={()=>setReciboVer(null)}>✕</button>
              </div>
            </div>
            <div className="mbd" style={{maxHeight:"78vh",overflow:"hidden",padding:0}}>
              <iframe title="Recibo" srcDoc={reciboHTML(reciboVer)||""} style={{width:"100%",height:"76vh",border:"none",background:"#fff",display:"block"}}/>
            </div>
          </div>
        </div>
      )}
      {facPrint&&(()=>{
        const f=facPrint;
        const pagosAplic=pagos.filter(p=>p.facturaId===f.id&&!p.anulado);
        return(
          <div className="ov">
            <div className="modal mlg" style={{maxWidth:900,width:"96%"}}>
              <div className="mhd no-print">
                <div className="mt">🖨️ {f.tipo==="nota_credito"?"Nota de Crédito":f.tipo==="proforma"?"Proforma":"Factura"} — {f.id}
                  {f.status==="anulada"&&<span style={{marginLeft:10,color:"var(--red)",fontWeight:800}}>ANULADA</span>}</div>
                <div style={{display:"flex",gap:6}}>
                  {hasPerm("imp_factura")&&<button className="btn-p" style={{fontSize:13,padding:"4px 12px"}} onClick={()=>printFactura(f)}>🖨️ Imprimir</button>}
                  <button className="mcl" onClick={()=>setFacPrint(null)}>✕</button>
                </div>
              </div>
              <div className="mbd" style={{maxHeight:"78vh",overflow:"hidden",padding:0}}>
                <iframe title="Factura" srcDoc={facturaHTML(f)} style={{width:"100%",height:"76vh",border:"none",background:"#fff",display:"block"}}/>
              </div>
            </div>
          </div>
        );
      })()}
    </div></>
  );
}
