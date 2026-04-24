import { useState, useEffect, useRef, Fragment } from "react";
import { dbGetClientes, dbUpsertCliente, dbDeleteCliente, dbGetWR, dbUpsertWR, dbDeleteWR, dbGetAgentes, dbUpsertAgente, dbDeleteAgente, dbGetOficinas, dbUpsertOficina, dbDeleteOficina, dbGetTarifas, dbUpsertTarifa, dbDeleteTarifa, dbGetConsolidaciones, dbUpsertConsolidacion, dbDeleteConsolidacion, dbGetCargoReleases, dbUpsertCargoRelease, dbDeleteCargoRelease, dbGetDeliveryNotes, dbUpsertDeliveryNote, dbDeleteDeliveryNote, dbGetFacturas, dbUpsertFactura, dbDeleteFactura, dbGetPagos, dbUpsertPago, dbDeletePago, dbLogActividad, dbGetActividad, dbGetConfig, dbSetConfig, dbGetScanLog, dbInsertScan, dbSetScanRegistered, dbDeleteScanIds, storageUploadFoto, storageDeleteFoto, dbGetFotosByWR, dbInsertFoto, dbDeleteFoto } from "./supabase";

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
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:var(--bg3)}
::-webkit-scrollbar-thumb{background:var(--b1);border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:var(--t4)}
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
.stats{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:12px 16px 8px;flex-shrink:0}
.stat{
  background:var(--bg2);border:1px solid var(--b1);border-radius:10px;
  padding:11px 13px;position:relative;overflow:hidden;
  cursor:pointer;transition:all .15s;box-shadow:var(--shadow);
}
.stat:hover{border-color:var(--gold2);box-shadow:var(--shadow2);transform:translateY(-1px)}
.stat.active{border-color:var(--gold2);background:rgba(176,125,16,0.06)}
.stat-ic{font-size:20px;margin-bottom:5px}
.stat-v{font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:var(--navy);line-height:1}
.stat-l{font-size:13px;color:var(--t2);margin-top:3px;white-space:nowrap}
.stat-d{font-size:12px;margin-top:4px}
.stat-d.up{color:var(--green)}.stat-d.dn{color:var(--red)}.stat-d.neu{color:var(--t3)}
.stat-bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 10px 10px}

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
.wr-co{font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;color:var(--navy);letter-spacing:3px}
.wr-co-info{font-size:12px;color:var(--t2);line-height:1.9;margin-top:3px}
.wr-num-d{font-family:'DM Mono',monospace;font-size:18px;font-weight:700;color:var(--navy);letter-spacing:2px;text-align:right}
.wr-num-meta{font-size:12px;color:var(--t2);line-height:1.9;margin-top:3px;text-align:right}
.w2c{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.wb{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:12px}
.wb-t{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--navy);font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--b2)}
.wf{margin-bottom:6px}
.wfl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.wfv{font-size:14px;color:var(--t1);font-weight:500;margin-top:2px}
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
};

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
  {label:"Administración",perms:["configuracion","gestionar_roles","registro_actividad","envio_masivo","ver_bd_clientes","ver_bd_usuarios","paquetes_sin_reclamo","ver_fotos","subir_foto","borrar_foto","todas_sucursales"]},
];

// ─── ROLE DEFINITIONS ────────────────────────────────────────────────────────
const ROLE_DEFS={
  A:{code:"A",name:"Administrador",color:"rA",icon:"👑",
    desc:"Control total del sistema. Acceso a todo sin restricciones.",
    perms:ALL_PERMS},

  B:{code:"B",name:"Gerente",color:"rB",icon:"🏛️",
    desc:"Gestión general. Todo menos borrar registros y registro de actividad.",
    perms:ALL_PERMS.filter(p=>!["borrar_usuario","borrar_cliente","borrar_agente","borrar_autonomo","borrar_oficina","borrar_wr","borrar_rp","borrar_booking","borrar_reempaque","borrar_guia","borrar_egreso","borrar_recepcion_dest","borrar_entrega","registro_actividad","configuracion","gestionar_roles"].includes(p))},

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
    desc:"Sucursal regional. Gestiona sus clientes y operaciones locales.",
    subs:["G1"],
    perms:["crear_cliente","editar_cliente","crear_wr","editar_wr","ver_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","ver_reempaque","ver_guia","crear_guia","ver_confirmacion","ver_entrega","entregar","ver_reportes","rep_confirmados","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_lista_conf","imp_recibo_entrega","imp_factura","ver_estado_cuenta","ver_estado_oficina","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_tarifas","ver_factura","registrar_cobro","ver_cuentas_cobrar","ver_bd_clientes","paquetes_sin_reclamo","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

  G1:{code:"G1",name:"Vendedor / Oficina",color:"rG1",icon:"🛒",
    desc:"Vendedor bajo una oficina. Solo sus clientes.",
    perms:["crear_cliente","editar_cliente","crear_wr","ver_wr","ver_confirmacion","imp_wr","imp_factura","ver_estado_cuenta","ver_estado_oficina","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_factura","ver_fotos","subir_foto","chat_admin"]},

  H:{code:"H",name:"Usuario Sistema",color:"rH1",icon:"👤",
    desc:"Usuario interno al que se le asigna un rol específico (A-G).",
    perms:["ver_wr","ver_tracking","rastrear","ver_estado_cuenta","ver_servicios","calculadora"]},

  I:{code:"I",name:"Cliente",color:"rH2",icon:"📦",
    desc:"Cliente externo. Solo ve sus propios envíos, estado de cuenta, tracking y factura.",
    perms:["ver_wr","ver_tracking","rastrear","ver_prealerta","pre_tracking","pre_factura","ver_estado_cuenta","ver_estado_cliente","ver_factura","imp_factura","ver_pickup","solicitar_pickup","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_fotos","subir_foto","chat_agente"]},
};
const ALL_ROLES=Object.values(ROLE_DEFS);
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
const CASILLERO_PREFIX="C-";
const CASILLERO_DIGITS=3; // C-001, C-002 … (ajustar si se quiere más dígitos)

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
  {code:"14",  label:"Aduana Destino",  cls:"s5", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"15",  label:"Auditoria",       cls:"s4", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"16",  label:"Liberado",        cls:"s3", phase:"destino",  auto:false, manual:true,  channels:["dashboard","cliente","consolidacion"]},
  {code:"17",  label:"Almacén",         cls:"s6", phase:"destino",  auto:true,  manual:false, channels:["dashboard","recepcion"]},
  {code:"18",  label:"Faltante",        cls:"s4", phase:"excep",    auto:true,  manual:false, channels:["dashboard"],             exc:true},
  {code:"18.1",label:"Investigación",   cls:"s4", phase:"excep",    auto:false, manual:true,  channels:["dashboard","recepcion"], exc:true},
  {code:"19",  label:"Sobrante",        cls:"s5", phase:"excep",    auto:true,  manual:false, channels:["dashboard","recepcion"], exc:true},
  {code:"20",  label:"Por Entrega",     cls:"s3", phase:"entrega",  auto:true,  manual:false, channels:["dashboard","cliente"]},
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
// GUIDE_PHASES — 7 fases de progreso de la guía consolidada
// Cada fase representa un hito macro; agrupan los códigos WR_STATUSES con guide:true
// El código "avance" es el que se fija al avanzar a esa fase (código más representativo del grupo)
const GUIDE_PHASES=[
  {key:"consol",  label:"Consolidado",      short:"Consol.",  codes:["4"],             advance:"4",  icon:"🗂️"},
  {key:"linea",   label:"Entregado Línea",  short:"Línea",    codes:["5"],             advance:"5",  icon:"🛫"},
  {key:"adsal",   label:"Aduana Salida",    short:"Ad. Sal.", codes:["6","7","8"],     advance:"6",  icon:"🛃"},
  {key:"trans",   label:"Tránsito",         short:"Tránsito", codes:["9","10","11","12","13"], advance:"9", icon:"✈️"},
  {key:"addest",  label:"Aduana Destino",   short:"Ad. Dest.",codes:["14","15"],       advance:"14", icon:"🛂"},
  {key:"liber",   label:"Liberado",         short:"Liberado", codes:["16"],            advance:"16", icon:"✅"},
  {key:"almacen", label:"En Almacén",       short:"Almacén",  codes:["17"],            advance:"17", icon:"🏬"},
];
const currentGuidePhaseIdx=(code)=>{
  const idx=GUIDE_PHASES.findIndex(p=>p.codes.includes(String(code)));
  if(idx>=0) return idx;
  // Si el código es anterior a "4" (1/2/2.3/3) la guía aún no alcanza la primera fase
  const n=parseFloat(code);
  if(!isNaN(n)&&n<4) return -1;
  return 0;
};
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
const toUp=v=>typeof v==="string"?v.toUpperCase():v;
const CU=CLIENTS_INIT.find(c=>c.rol==="A")||CLIENTS_INIT[0]||{id:"admin",rol:"A",primerNombre:"Admin",primerApellido:"ENEX",email:"admin@enex.com"};

const StBadge=({st})=>{if(!st||!st.cls)return <span className="st s1"><span className="st-dot"/>—</span>;return <span className={`st ${st.cls}`}><span className="st-dot"/>{st.label}</span>;};
const CarBadge=({c})=><span className={`car ${CAR_CLS[c]||"car-def"}`}>{c}</span>;
const TypeBadge=({t})=><span className={`type-b ${TYPE_CLS[t]||""}`}>{t}</span>;

// ─── WR ROW ────────────────────────────────────────────────────────────────────
const CT_LABEL_WR={agente:"🤝 Agente",vendedor_agente:"💼 Vend. Agente",autonomo:"🧑‍💻 Autónomo",oficina:"🏢 Oficina",vendedor_oficina:"🛒 Vend. Oficina",matriz:"🏛️ Matriz"};
const WRRow=({w,sel,onClick,unitL,unitW,dimOpen,onDimToggle,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz",sendTypes=[],onAssignTipo,onFotoClick})=>{
  const isIn=unitL==="in";
  const isLb=unitW==="lb";
  const showVol = isLb ? `${w.volLb}lb` : `${w.volKg}kg`;
  const showPeso = isLb ? `${w.pesoLb}lb` : `${w.pesoKg}kg`;

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
      <button className="dim-btn" style={{padding:"4px 10px",fontSize:13,fontWeight:600,background:"#E8F0FE",borderColor:"#90B8F0",color:"var(--navy)"}} onClick={e=>{e.stopPropagation();onDimToggle();}}>
        📦 {w.dims.length} cajas {dimOpen?"▲":"▼"}
      </button>
      {dimOpen&&(
        <div className="dim-pop" onClick={e=>e.stopPropagation()}>
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
      )}
    </div>
  );
  return (
    <tr className={sel?"sel":""} onClick={onClick}>
      {/* 1. TIPO ENVÍO (confirmación) — primera columna */}
      <td onClick={e=>e.stopPropagation()} style={{minWidth:110,padding:"4px 6px"}}>
        {w.tipoEnvio
          ?<div style={{display:"inline-flex",alignItems:"center",gap:4}}>
              <TypeBadge t={w.tipoEnvio}/>
              {onAssignTipo&&<span onClick={()=>{if(window.confirm(`¿Quitar tipo de envío del WR ${w.id}?${w.status?.code==="3"?"\n\nTambién se revertirá la confirmación.":""}`))onAssignTipo(w,"");}} title="Quitar tipo de envío" style={{cursor:"pointer",fontSize:14,color:"var(--red)",padding:"0 4px",lineHeight:1,fontWeight:700}}>✕</span>}
            </div>
          :(onAssignTipo&&sendTypes.length>0
            ?<select value="" onChange={e=>{if(e.target.value)onAssignTipo(w,e.target.value);}} title="Confirmar tipo de envío" style={{fontSize:12,padding:"2px 4px",border:"1px dashed var(--navy)",borderRadius:4,background:"var(--bg3)",color:"var(--navy)",fontWeight:600,cursor:"pointer",minWidth:100}}>
                <option value="">— Asignar —</option>
                {sendTypes.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            :<span style={{color:"var(--t3)"}}>—</span>)}
      </td>
      {/* 2. N° WR */}
      <td>
        <div className="c-wr">{w.id}</div>
        <div className="c-route">{w.origCity} → {w.destCity}</div>
      </td>
      {/* 3. ESTADO */}
      <td style={{minWidth:130,padding:"4px 6px"}} title={w.status?.label||""}><StBadge st={w.status}/></td>
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
      <td><span className="c-trk">{w.tracking||"—"}</span></td>
      <td style={{minWidth:200,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.descripcion||"—"}</td>
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
const WRTable=({rows,selId,onSelect,unitL,unitW,onSort,sortCol,sortDir,dimOpen,onDimToggle,page,onPage,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz",sendTypes=[],onAssignTipo,onFotoClick})=>{
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
              <th style={{minWidth:110}}>Tipo Envío</th>
              <SortTh col="id">N° WR</SortTh>
              <th style={{minWidth:130}}>Estado</th>
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
              <tr><td colSpan={20} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No se encontraron registros.</td></tr>
            ):pageRows.map(w=>(
              <WRRow key={w.id} w={w} sel={selId===w.id} onClick={()=>onSelect(w)}
                unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
                sendTypes={sendTypes} onAssignTipo={onAssignTipo} onFotoClick={onFotoClick}
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
const emptyWRF=()=>({
  consignee:"",casilleroSearch:"",casillero:"",clienteId:"",
  remitente:"",remitenteDir:"",remitenteTel:"",remitenteEmail:"",
  chofer:"",idChofer:"",proNumber:"",ocNumber:"",
  tipoPago:"Prepago",tipoEnvio:"",
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

// ─── STANDALONE COMPONENTS (outside main component to avoid hook issues) ─────
const ClientModal=({initial,onClose,onSave,title,agentes=[],oficinas=[],autonomos=[],allClients=[]})=>{
  const _ROL_TO_TIPO_INIT={"E":"agente","E1":"vendedor_agente","F":"autonomo","G":"oficina","G1":"vendedor_oficina"};
  const _initClienteTipo=initial?.clienteTipo||(initial?.tipo==="usuario"&&initial?.rol?_ROL_TO_TIPO_INIT[initial.rol]||"matriz":"matriz");
  const [f,setF]=useState({clienteTipo:"matriz",password:"",...initial,clienteTipo:_initClienteTipo});
  const [emailErr,setEmailErr]=useState("");
  // Campos que NO deben convertirse a mayúsculas (IDs, enums, credenciales)
  const NO_UPPER_F=["email","login","password","tipo","clienteTipo","agenteId","oficinaId","autonomoId","rol","activo","id"];
  // Mapa rol → clienteTipo para usuarios (sincroniza automáticamente)
  const ROL_TO_TIPO={"E":"agente","E1":"vendedor_agente","F":"autonomo","G":"oficina","G1":"vendedor_oficina"};
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
        {/* Pertenece a — clientes y usuarios */}
        {(
          <div style={{marginBottom:14}}>
            <div className="sdiv">PERTENECE A</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:f.clienteTipo&&f.clienteTipo!=="matriz"?10:0}}>
              {[
                {v:"agente",l:"🤝 Agente"},
                {v:"vendedor_agente",l:"💼 Vendedor de Agente"},
                {v:"autonomo",l:"🧑‍💻 Autónomo"},
                {v:"oficina",l:"🏢 Oficina"},
                {v:"vendedor_oficina",l:"🛒 Vendedor de Oficina"},
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
            {f.clienteTipo==="autonomo"&&(
              <div className="fg" style={{marginTop:8}}><div className="fl">Autónomo *</div>
                <select className="fs" value={f.autonomoId||""} onChange={e=>ff("autonomoId",e.target.value)}>
                  <option value="">— Selecciona un Autónomo —</option>
                  {autonomos.map(a=><option key={a.id} value={a.id}>{a.id} — {a.primerNombre} {a.primerApellido}</option>)}
                </select>
                {autonomos.length===0&&<div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>No hay autónomos registrados en el sistema aún.</div>}
              </div>
            )}
            {["oficina","vendedor_oficina"].includes(f.clienteTipo||"")&&oficinas.length>0&&(
              <div className="fg" style={{marginTop:8}}><div className="fl">Oficina *</div>
                <select className="fs" value={f.oficinaId||""} onChange={e=>ff("oficinaId",e.target.value)}>
                  <option value="">— Selecciona una Oficina —</option>
                  {oficinas.map(o=><option key={o.id} value={o.id}>{o.codigo} — {o.nombre}</option>)}
                </select>
              </div>
            )}
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
          <div className="fg"><div className="fl">Nº Identificación *</div><input className="fi" value={f.cedula} onChange={e=>ff("cedula",e.target.value)} placeholder="V-00000000"/></div>
          {f.tipo==="cliente"
            ?<div className="fg"><div className="fl">Casillero (auto)</div><input className="fi" value={f.casillero} onChange={e=>ff("casillero",e.target.value)} placeholder="Se genera automático" style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}/></div>
            :<div className="fg"><div className="fl">Rol del Sistema</div><select className="fs" value={f.rol} onChange={e=>ff("rol",e.target.value)}>{ALL_ROLES.filter(r=>!["H","I"].includes(r.code)).map(r=><option key={r.code} value={r.code}>{r.code} — {r.name}</option>)}</select></div>}
          {f.tipo==="usuario"&&<div className="fg"><div className="fl">Login (usuario)</div><input className="fi" value={f.login||f.email} onChange={e=>ff("login",e.target.value)} placeholder="usuario@email.com o nick"/></div>}
        </div>
        {/* Password para todos los registros */}
        <div className="fgrid g2" style={{marginBottom:10}}>
          <div className="fg"><div className="fl">Contraseña {f.tipo==="usuario"?"*":"(acceso al sistema)"}</div>
            <input className="fi" type="password" value={f.password||""} onChange={e=>ff("password",e.target.value)} placeholder="Mínimo 6 caracteres"/>
          </div>
          <div className="fg"><div className="fl" style={{fontSize:12,color:"var(--t3)"}}>{f.tipo==="usuario"?"El usuario podrá cambiarla al ingresar.":"Déjalo en blanco si el cliente no accede al sistema."}</div></div>
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
          setEmailErr("");
          onSave(f);
        }}>Guardar ✅</button></div>
      </div>
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

const emptyConsol=(firstType="")=>({
  destino:"VL", tipoEnvio:firstType,
  fechaSalida:"", fechaLlegada:"",
  numVuelo:"", awb:"", bl:"",
  notas:"",
  containers:[{tipo:"",largo:"",ancho:"",alto:"",pesoLb:"",sello:"",wr:[]}],
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
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginErr,setLoginErr]=useState("");

  const [tab,setTab]=useState("dashboard");
  const [wrList,setWrList]=useState(WR_INIT);
  const [clients,setClients]=useState(CLIENTS_INIT);
  const [selWR,setSelWR]=useState(null);
  const [editWR,setEditWR]=useState(null);
  const [showNewWR,setShowNewWR]=useState(false);
  const [showNewCl,setShowNewCl]=useState(false);
  const [showEditCl,setShowEditCl]=useState(null);
  const [showStatModal,setShowStatModal]=useState(null); // {key, label, rows}
  const [searchParam,setSearchParam]=useState("Tracking");
  const [search,setSearch]=useState("");
  const [filterSt,setFilterSt]=useState("all");
  const [clFilter,setClFilter]=useState("todos");
  const [dimOpen,setDimOpen]=useState(null);
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
  const [CHARGES_OPT,setChargesOpt]=useState([]);
  const [CONTAINER_TYPES,setContainerTypes]=useState([]);
  const [COUNTRIES,setCountries]=useState([]);

  // ── REGISTRO DE ACTIVIDAD ────────────────────────────────────────────────
  const [actLog,setActLog]=useState([]);
  const [etqSearch,setEtqSearch]=useState("");
  const [etqTipo,setEtqTipo]=useState("wr"); // "wr" | "guia"
  const [selRole,setSelRole]=useState(null);
  const [ecSearch,setEcSearch]=useState("");
  const [ecCliente,setEcCliente]=useState(null);
  const [ecResults,setEcResults]=useState([]);
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
  const [rdScan,setRdScan]=useState("");
  const [rdSearch,setRdSearch]=useState("");
  const [rdTab,setRdTab]=useState("pendientes"); // pendientes | archivadas
  const [rdSelGuia,setRdSelGuia]=useState(""); // id de la guía seleccionada para recepción

  // Modales de fotos del paquete (Nuevo WR)
  const [webcamOpen,setWebcamOpen]=useState(null);  // null | {cajaIdx}
  const [photoGalleryOpen,setPhotoGalleryOpen]=useState(null); // null | {wrId}
  // Cargo Release (egresos)
  const [cargoReleases,setCargoReleases]=useState([]);
  const [crModal,setCrModal]=useState(null); // null | {wrIds:[], agenteCarga, contacto, documento, vehiculo, notas, editId?}
  const [crSearch,setCrSearch]=useState("");
  const [crPrint,setCrPrint]=useState(null); // release a imprimir
  // Delivery Notes (entregas)
  const [deliveryNotes,setDeliveryNotes]=useState([]);
  const [dnModal,setDnModal]=useState(null); // null | {wrIds, consignatario, clienteId, receptorNombre, receptorDocumento, receptorTelefono, direccionEntrega, metodoEntrega, transportista, notas, editId?}
  const [dnSearch,setDnSearch]=useState("");
  const [dnPrint,setDnPrint]=useState(null); // nota a imprimir
  const [labelTipo,setLabelTipo]=useState("WR");
  const [openDays,setOpenDays]=useState({});
  const [actFilter,setActFilter]=useState("");
  const [cfgTab,setCfgTab]=useState("numeracion");
  const [cfgSelPais,setCfgSelPais]=useState(0);
  const [cfgNewCity,setCfgNewCity]=useState("");
  const [cfgNewPais,setCfgNewPais]=useState("");
  const [cfgNewCont,setCfgNewCont]=useState({code:"",name:"",dim:"",maxLb:""});
  const [cfgEditContIdx,setCfgEditContIdx]=useState(null);
  const [agentes,setAgentes]=useState([]);
  const [oficinas,setOficinas]=useState([]);
  const [showNewAgente,setShowNewAgente]=useState(false);
  const [showNewOficina,setShowNewOficina]=useState(false);
  const [editAgente,setEditAgente]=useState(null);
  const [editOficina,setEditOficina]=useState(null);
  const [agForm,setAgForm]=useState({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});
  const [ofForm,setOfForm]=useState({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});
  const [tarifas,setTarifas]=useState([]);
  const [showNewTarifa,setShowNewTarifa]=useState(false);
  const [editTarifa,setEditTarifa]=useState(null);
  const [tafForm,setTafForm]=useState({paisOrig:"",ciudadOrig:"",paisDest:"",ciudadDest:"",tipoEnvio:"",porLb:"",porFt3:"",min:"",moneda:"USD"});
  const [tarifaTipoTab,setTarifaTipoTab]=useState("aereo");
  const [showNewFactura,setShowNewFactura]=useState(false);
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [wrf,setWrf]=useState(emptyWRF());
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
  const [contabTab,setContabTab]=useState("facturas");
  const [facturas,setFacturas]=useState([]);
  const [pagos,setPagos]=useState([]);
  // Facturación v2 (Lote 6)
  const [facModal,setFacModal]=useState(null);   // null | factura en edición
  const [facPrint,setFacPrint]=useState(null);   // factura a imprimir
  const [pagoModal,setPagoModal]=useState(null); // null | {facturaId, ...}
  const [ncModal,setNcModal]=useState(null);     // null | {facturaOrigen, monto, motivo}
  const [facFilter,setFacFilter]=useState({q:"",status:"",tipo:"",moneda:"",receptorTipo:""});
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
  // ── SUPABASE: cargar datos al iniciar ────────────────────────────────────
  useEffect(()=>{
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
        // Sincronizar forms que aún no tienen tipo de envío con el primero disponible
        setCf(p=>({...p,tipoEnvio:p.tipoEnvio||sendT[0]}));
        setCalcForm(p=>({...p,tipoEnvio:p.tipoEnvio||sendT[0]}));
      }
      if(payT&&payT.length>0)setPayTypes(payT);
      if(chargesT&&chargesT.length>0)setChargesOpt(chargesT);
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
    load();
  },[]);

  // ── LOGIN HANDLER ──────────────────────────────────────────────────────────
  const doLogin=()=>{
    const email=loginEmail.toLowerCase().trim();
    const u=clients.find(c=>c.email===email&&c.password===loginPass)
           ||CLIENTS_INIT.find(c=>c.email===email&&c.password===loginPass);
    if(u){setCurrentUser(u);setLoginErr("");}
    else setLoginErr("Correo o contraseña incorrectos");
  };

  const doLogout=()=>{
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPass("");
    setLoginErr("");
  };

  // ── LOGIN GATE ─────────────────────────────────────────────────────────────
  if(!currentUser)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--navy)"}}>
      <style>{S}</style>
      <div style={{background:"white",borderRadius:16,padding:40,width:340,boxShadow:"0 8px 40px rgba(0,0,0,.3)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:30,fontWeight:800,color:"var(--navy)"}}>ENEX</div>
          <div style={{fontSize:15,color:"var(--t3)"}}>International Courier — Sistema</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input className="fi" placeholder="Correo electrónico" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          <input className="fi" type="password" placeholder="Contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          {loginErr&&<div style={{color:"var(--red)",fontSize:14,textAlign:"center"}}>{loginErr}</div>}
          <button className="btn-p" onClick={doLogin} style={{marginTop:8}}>Ingresar</button>
        </div>
        <div style={{fontSize:12,color:"var(--t3)",marginTop:16,textAlign:"center"}}>Demo: admin@enex.com / admin123</div>
      </div>
    </div>
  );

  // ── USE currentUser INSTEAD OF CU FROM HERE ON ──────────────────────────────
  const logAction=(action,detail="")=>{
    setActLog(p=>[{ts:new Date(),user:currentUser.id||"admin",role:currentUser.rol,action,detail},...p.slice(0,199)]);
    dbLogActividad(currentUser.id||"U-001",currentUser.rol,action,detail);
  };

  const hasPerm=p=>ROLE_DEFS[currentUser.rol]?.perms.includes(p);
  const canEdit=hasPerm("crear_wr")||hasPerm("editar_wr");
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
      case "Tracking":     match=(w.tracking||"").toLowerCase().includes(q);break;
      case "Factura":      match=(w.factura||"").toLowerCase().includes(q);break;
      case "Carrier":      match=(w.carrier||"").toLowerCase().includes(q);break;
      case "Descripción":  match=(w.descripcion||"").toLowerCase().includes(q);break;
      case "Estado":       match=(w.status.label||"").toLowerCase().includes(q);break;
      default:             match=w.id.toLowerCase().includes(q)||(w.consignee||"").toLowerCase().includes(q);
    }
    return ms&&match;
  }).sort((a,b)=>{
    let va=a[sortCol],vb=b[sortCol];
    if(sortCol==="fecha"){va=a.fecha instanceof Date?a.fecha.getTime():new Date(a.fecha).getTime();vb=b.fecha instanceof Date?b.fecha.getTime():new Date(b.fecha).getTime();}
    if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}
    if(va<vb)return sortDir==="asc"?-1:1;if(va>vb)return sortDir==="asc"?1:-1;return 0;
  });

  const filteredCl=clients.filter(c=>clFilter==="todos"?true:c.tipo===(clFilter==="clientes"?"cliente":"usuario"));

  // Stats
  const stats={
    total:wrList.length,
    transit:wrList.filter(w=>w.status&&["7","7.1","8"].includes(w.status.code)).length,
    confirmed:wrList.filter(w=>w.status&&w.status.code==="3").length,
    customs:wrList.filter(w=>w.status&&["6","6.1","9","9.1"].includes(w.status.code)).length,
    ready:wrList.filter(w=>w.status&&w.status.code==="11").length,
    entregadoCobrado:wrList.filter(w=>w.status&&w.status.code==="12C").length,
    entregadoPorCobrar:wrList.filter(w=>w.status&&w.status.code==="12P").length,
  };

  // Scan logic: register tracking in puerta
  const doScan=()=>{
    if(!scanV.trim())return;
    const already=scanLog.find(s=>s.tracking===scanV.trim());
    if(!already){
      const entry={id:crypto.randomUUID(),tracking:scanV.trim(),carrier:scanCarrier||"—",ts:new Date(),registered:false};
      setScanLog(p=>[entry,...p]);
      dbInsertScan(entry);
    }
    setScanV("");
  };
  // When creating WR, check if tracking matches scan log
  const checkAndRemoveScan=(tracking)=>{
    setScanLog(p=>p.map(s=>s.tracking===tracking?{...s,registered:true}:s));
    dbSetScanRegistered(tracking);
  };

  // WR FORM state
  const EMAIL_KEYS_W=["remitenteEmail","email","password","unitDim","unitPeso"];
  const sw=(k,v)=>setWrf(p=>({...p,[k]:typeof v==="string"&&!EMAIL_KEYS_W.includes(k)?v.toUpperCase():v}));

  // Client search
  const handleClientSearch=(q)=>{
    setClientSearch(q);
    if(q.length<2){setClientResults([]);return;}
    const res=clients.filter(c=>c.tipo==="cliente"&&(
      fullName(c).toLowerCase().includes(q.toLowerCase())||
      c.casillero.toLowerCase().includes(q.toLowerCase())
    ));
    setClientResults(res);
  };
  const selectClient=(c)=>{
    sw("consignee",fullName(c));
    sw("casillero",c.casillero);
    sw("clienteId",c.id);
    sw("casilleroSearch",c.casillero);
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
  const nextCasillero=()=>{
    const nums=clients
      .filter(c=>c.casillero&&c.casillero.startsWith(CASILLERO_PREFIX))
      .map(c=>parseInt(c.casillero.slice(CASILLERO_PREFIX.length))||0);
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

  const submitWR=async ()=>{
    // Expand dims: each registro × cantidad generates individual dim entries
    const dims=[];
    cajaCalcs.forEach((c,i)=>{
      for(let q=0;q<c.qty;q++){
        dims.push({
          l:c.lCm,a:c.aCm,h:c.hCm,pk:c.pkKg,pkLb:c.pkLb,
          volKg:c.volKg,volLb:c.volLb,ft3:c.ft3,m3:c.m3,
          carrier:wrf.cajas[i].carrier,
          tracking:wrf.cajas[i].tracking,
          factura:wrf.cajas[i].numFactura,
          descripcion:wrf.cajas[i].descripcion,
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
        casillero:cas,rol:"C",login:"",password:"",
        clienteTipo:"matriz",agenteId:"",oficinaId:"",autonomoId:"",activo:true,
      };
      setClients(p=>[...p,newCliente]);
      dbUpsertCliente(newCliente);
      _clienteId=newId;
      _casillero=cas;
      logAction("Auto-registró cliente",`${parts.primerNombre} ${parts.primerApellido} → ${cas}`);
    }

    if(editWR){
      // ── EDIT MODE: update existing WR ──────────────────────────────────────
      const updated={
        ...editWR,
        cajas:totalCajasCount,
        consignee:wrf.consignee,casillero:wrf.casillero,clienteId:wrf.clienteId,
        carrier:wrf.cajas[0]?.carrier||"",tracking:wrf.cajas[0]?.tracking||"",
        descripcion:wrf.cajas[0]?.descripcion||"",factura:wrf.cajas[0]?.numFactura||"",
        valor:wrf.cajas.reduce((s,c)=>s+parseFloat(c.montoFactura||0),0),
        dims,
        pesoKg:totalPesoKg,pesoLb:totalPesoLb,
        volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3,
        notas:wrf.notas,tipoEnvio:wrf.tipoEnvio,tipoPago:wrf.tipoPago,
        shipper:wrf.remitente,remitenteDir:wrf.remitenteDir||"",cargos:wrf.cargos,
      };
      wrf.cajas.forEach(c=>{if(c.tracking)checkAndRemoveScan(c.tracking);});
      // Subir fotos nuevas al bucket (antes de marcar foto=true)
      const uploadedCount=await uploadFotosForWR(editWR.id, wrf.cajas, currentUser?.id||'');
      if(uploadedCount>0) updated.foto=true;
      setWrList(p=>p.map(x=>x.id===editWR.id?updated:x));
      dbUpsertWR(updated);
      setShowNewWR(false);setEditWR(null);
      setWrf(emptyWRF());setClientSearch("");
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
        carrier:esReempaque?"REEMPAQUE":(wrf.cajas[0]?.carrier||""),tracking:wrf.cajas[0]?.tracking||"",
        descripcion:wrf.cajas[0]?.descripcion||(esReempaque?`Reempaque de: ${reempaqueIds.join(", ")}`:""),
        factura:wrf.cajas[0]?.numFactura||"",
        valor:wrf.cajas.reduce((s,c)=>s+parseFloat(c.montoFactura||0),0),
        dims,
        pesoKg:totalPesoKg,pesoLb:totalPesoLb,
        volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3,
        status:WR_STATUSES[0],notas:wrf.notas,
        tipoEnvio:wrf.tipoEnvio,tipoPago:wrf.tipoPago,
        shipper:wrf.remitente,remitenteDir:wrf.remitenteDir||"",usuario:currentUser.id,foto:false,prealerta:false,
        cargos:wrf.cargos,
        ...(esReempaque?{reempaqueDe:[...reempaqueIds],historial:[{code:"1",label:"Recibido",fecha:now,user:currentUser.id,nota:`Reempaque de: ${reempaqueIds.join(", ")}`}]}:{}),
      };
      wrf.cajas.forEach(c=>{if(c.tracking)checkAndRemoveScan(c.tracking);});
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
      setWrf(emptyWRF());setClientSearch("");
      if(esReempaque){logAction("Creó Reempaque",`${n.id} ← [${reempaqueIds.join(", ")}]`);setRpqSel([]);}
      logAction("Creó WR",wrNumPrev);
      if(uploadedCount>0) logAction("Subió fotos WR",`${n.id} (${uploadedCount})`);
      setShowLabels({wr:n,dims,remitente:wrf.remitente,tipoEnvio:wrf.tipoEnvio});
    }
  };

  // ── ASIGNAR TIPO DE ENVÍO Y CONFIRMAR ──────────────────────────────────────
  // Al asignar tipo a un WR sin tipo → cambia status a "3" (Confirmado).
  // Si ya tiene tipo, solo actualiza el tipo sin tocar status.
  const assignTipoEnvio=(w,tipo)=>{
    if(!w)return;
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
      {hasPerm("crear_wr")&&<button className="btn-p" onClick={()=>{setWrf(emptyWRF());setShowNewWR(true);}}>+ Nuevo WR</button>}
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
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const STAT_DEFS=[
    {key:"total",ic:"📦",label:"Total WR",d:"↑ 12% este mes",cls:"up",filter:()=>wrList,color:"#1A2B4A"},
    {key:"transit",ic:"✈️",label:"En Tránsito",d:"Activos ahora",cls:"up",filter:()=>wrList.filter(w=>["7","7.1","8"].includes(w.status.code)),color:"#0080CC"},
    {key:"confirmed",ic:"✅",label:"Confirmados",d:"Listos para despachar",cls:"up",filter:()=>wrList.filter(w=>w.status.code==="3"),color:"#1A8A4A"},
    {key:"customs",ic:"🛃",label:"En Aduana",d:"Requieren atención",cls:"dn",filter:()=>wrList.filter(w=>["6","6.1","9","9.1"].includes(w.status.code)),color:"#CC2233"},
    {key:"ready",ic:"🟢",label:"Listos Entrega",d:"Pendiente retiro",cls:"up",filter:()=>wrList.filter(w=>w.status.code==="11"),color:"#1A8A4A"},
    {key:"entregadoCobrado",ic:"💵",label:"Entregado / Cobrado",d:"Pagados",cls:"up",filter:()=>wrList.filter(w=>w.status.code==="12C"),color:"#1A6040"},
    {key:"entregadoPorCobrar",ic:"⏳",label:"Entregado / Por Cobrar",d:"Pendiente de cobro",cls:"dn",filter:()=>wrList.filter(w=>w.status.code==="12P"),color:"#C05800"},
  ];

  const renderDash=()=>(
    <>
      {/* STATS CLICKEABLES */}
      <div className="stats">
        {STAT_DEFS.map(s=>(
          <div key={s.key} className="stat" onClick={()=>setShowStatModal({...s,rows:s.filter()})}>
            <div className="stat-bar" style={{background:s.color,opacity:.7}}/>
            <div className="stat-ic">{s.ic}</div>
            <div className="stat-v">{stats[s.key]}</div>
            <div className="stat-l">{s.label}</div>
            <div className={`stat-d ${s.cls}`}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* DASH GRID */}
      <div className="dash-grid" style={{flex:1,minHeight:0,overflow:"hidden",padding:"0 16px 14px"}}>
        <div className="wr-panel">
          {renderWRToolbar()}
          <WRTable rows={filteredWR} selId={selWR?.id} onSelect={setSelWR}
            unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
            sendTypes={SEND_TYPES} onAssignTipo={assignTipoEnvio}
            onSort={handleSort} sortCol={sortCol} sortDir={sortDir}
            dimOpen={dimOpen} onDimToggle={handleDimToggle}
            onFotoClick={w=>setPhotoGalleryOpen({wrId:w.id})}
            page={page} onPage={setPage}/>
        </div>

        <div className="rp">
          <div className="card">
            <div className="card-tt">🔔 Alertas <span className="card-sub">{wrList.filter(w=>["6.1","10.1"].includes(w.status?.code)).length} urgentes</span></div>
            {[
              stats.customs>0&&{cls:"alt-e",ic:"🛃",t:"En Aduana / Retención",b:`${stats.customs} envío${stats.customs!==1?"s":""} en proceso aduanal`},
              wrList.filter(w=>["6.1","10.1"].includes(w.status?.code)).length>0&&{cls:"alt-w",ic:"⚠️",t:"Envíos Urgentes",b:`${wrList.filter(w=>["6.1","10.1"].includes(w.status?.code)).length} requieren atención inmediata`},
              stats.ready>0&&{cls:"alt-i",ic:"✅",t:"Listos para Entrega",b:`${stats.ready} envío${stats.ready!==1?"s":""} esperan al cliente`},
              stats.entregadoPorCobrar>0&&{cls:"alt-ok",ic:"💵",t:"Por Cobrar",b:`${stats.entregadoPorCobrar} envío${stats.entregadoPorCobrar!==1?"s":""} pendientes de cobro`},
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
              {l:"En Tránsito",v:stats.transit,c:"#0080CC"},
              {l:"Confirmados",v:stats.confirmed,c:"#1A8A4A"},
              {l:"En Aduana",v:stats.customs,c:"#CC2233"},
              {l:"Listos",v:stats.ready,c:"#1A6040"},
              {l:"Cobrado",v:stats.entregadoCobrado,c:"#2A7A50"},
              {l:"Por Cobrar",v:stats.entregadoPorCobrar,c:"#C05800"},
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
          <div className="card">
            <div className="card-tt">👥 Clientes <span className="card-lnk" onClick={()=>setTab("clients")}>Ver todos →</span></div>
            {clients.filter(c=>c.tipo==="cliente").slice(0,5).map(c=>(
              <div key={c.id} className="cl-row">
                <div className="cl-av">{initials(c)}</div>
                <div style={{flex:1,minWidth:0}}><div className="cl-nm">{fullName(c)}</div><div className="cl-cas">{c.casillero}</div></div>
                <RoleBadge code={c.rol}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // ── WR PAGE ────────────────────────────────────────────────────────────────
  // Vista simple y enfocada: solo tabla (sin stats, sin panel derecho).
  // El Dashboard muestra la vista panorámica con métricas + tabla + alertas.
  const renderWR=()=>(
    <div className="wr-panel" style={{margin:"0 16px 14px",flex:1,minHeight:0}}>
      {renderWRToolbar()}
      <WRTable rows={filteredWR} selId={selWR?.id} onSelect={setSelWR}
        unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
        sendTypes={SEND_TYPES} onAssignTipo={assignTipoEnvio}
        onSort={handleSort} sortCol={sortCol} sortDir={sortDir}
        dimOpen={dimOpen} onDimToggle={handleDimToggle}
        onFotoClick={w=>setPhotoGalleryOpen({wrId:w.id})}
        page={page} onPage={setPage}/>
    </div>
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
        <div style={{fontSize:12,color:"var(--t3)"}}>Presiona <strong>Enter</strong> o el botón. Al crear el WR el tracking pasa automáticamente al historial de la derecha.</div>
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
  const renderClients=()=>(
    <div className="page-scroll">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div className="tabs" style={{flex:1}}>
          {[["todos","👥 Todos"],["clientes","🏠 Clientes"],["usuarios","👤 Usuarios"]].map(([v,l])=>(
            <div key={v} className={`tab ${clFilter===v?"on":""}`} onClick={()=>setClFilter(v)}>{l}
              <span className="t-cnt">{v==="todos"?clients.length:clients.filter(c=>c.tipo===(v==="clientes"?"cliente":"usuario")).length}</span>
            </div>
          ))}
        </div>
        {hasPerm("crear_cliente")&&<button className="btn-p" onClick={()=>setShowNewCl(true)}>+ Agregar</button>}
      </div>
      <div className="card" style={{padding:0}}>
        <div className="ct-wrap">
          <table className="ct">
            <thead><tr>
              <th>ID</th><th>Tipo</th><th>Nombre Completo</th><th>Cédula</th>
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
                    {hasPerm("borrar_cliente")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar "${fullName(c)}"? Esta acción no se puede deshacer.`)){setClients(p=>p.filter(x=>x.id!==c.id));dbDeleteCliente(c.id);logAction("Borró registro",`${c.id} — ${fullName(c)}`);}}}>🗑</span>}
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

  // ── ROLES ──────────────────────────────────────────────────────────────────

  const renderRoles=()=>(
    <div className="page-scroll">
      <div className="alt info" style={{marginBottom:14}}>
        <span className="alt-ic2">🔐</span>
        <div><div className="alt-t2">Jerarquía de Roles ENEX — 14 niveles (A→I)</div><div className="alt-b2">Haz clic en un rol para ver sus permisos detallados por categoría.</div></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:14}}>
        {/* LISTA DE ROLES */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {ALL_ROLES.map(r=>(
            <div key={r.code} onClick={()=>setSelRole(r.code===selRole?null:r.code)}
              style={{background:"var(--bg2)",border:`2px solid ${selRole===r.code?"var(--navy)":"var(--b1)"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"all .1s"}}
              onMouseEnter={e=>{if(selRole!==r.code)e.currentTarget.style.borderColor="var(--t3)"}}
              onMouseLeave={e=>{if(selRole!==r.code)e.currentTarget.style.borderColor="var(--b1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>{r.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className={`rb ${r.color}`} style={{fontSize:13}}>{r.code}</span>
                    <span style={{fontWeight:700,fontSize:15,color:"var(--t1)"}}>{r.name}</span>
                    {r.subs&&<span style={{fontSize:12,color:"var(--t3)"}}>+{r.subs.length} sub</span>}
                  </div>
                  <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>{r.perms?.length||0} permisos</div>
                </div>
                <span style={{fontSize:14,color:"var(--t3)"}}>{selRole===r.code?"▲":"▼"}</span>
              </div>
              {selRole===r.code&&<div style={{fontSize:13,color:"var(--t2)",marginTop:8,paddingTop:8,borderTop:"1px solid var(--b2)",lineHeight:1.6}}>{r.desc}</div>}
              {r.subs&&selRole===r.code&&(
                <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                  {r.subs.map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:4,background:"var(--bg4)",borderRadius:5,padding:"3px 8px",fontSize:13}}><RoleChip code={s}/><span style={{color:"var(--t2)"}}>{ROLE_DEFS[s]?.name}</span></div>)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DETALLE DE PERMISOS */}
        {selRole?(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",background:"var(--navy)",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:26}}>{ROLE_DEFS[selRole]?.icon}</span>
              <div>
                <div style={{color:"#fff",fontFamily:"Arial,Helvetica,sans-serif",fontSize:20,fontWeight:700}}>{ROLE_DEFS[selRole]?.code} — {ROLE_DEFS[selRole]?.name}</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:14,marginTop:2}}>{ROLE_DEFS[selRole]?.desc}</div>
              </div>
              <div style={{marginLeft:"auto",background:"rgba(229,174,58,.2)",border:"1px solid rgba(229,174,58,.4)",borderRadius:6,padding:"4px 12px",color:"#E5AE3A",fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700}}>
                {ROLE_DEFS[selRole]?.perms.length} / {ALL_PERMS.length} permisos
              </div>
            </div>
            <div style={{padding:"14px 16px",maxHeight:"65vh",overflowY:"auto"}}>
              {PERM_GROUPS.map(g=>{
                const gPerms=g.perms.filter(p=>ALL_PERMS.includes(p));
                const hasAny=gPerms.some(p=>ROLE_DEFS[selRole]?.perms?.includes(p));
                return (
                  <div key={g.label} style={{marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:hasAny?"var(--navy)":"var(--t4)",marginBottom:8,paddingBottom:4,borderBottom:`2px solid ${hasAny?"var(--navy)":"var(--b2)"}`}}>
                      {g.label}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {gPerms.map(p=>{
                        const has=ROLE_DEFS[selRole]?.perms?.includes(p);
                        return (
                          <span key={p} style={{
                            display:"inline-flex",alignItems:"center",gap:4,
                            padding:"3px 9px",borderRadius:5,fontSize:13,fontWeight:600,
                            background:has?"#E8F8EE":"var(--bg4)",
                            color:has?"var(--green)":"var(--t3)",
                            border:`1px solid ${has?"#80D0A0":"var(--b2)"}`,
                          }}>
                            {has?"✓":"✗"} {PERM_LBL[p]||p}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ):(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:"var(--t3)",padding:60}}>
            <span style={{fontSize:42}}>🔐</span>
            <div style={{fontSize:16,fontWeight:600}}>Selecciona un rol para ver sus permisos</div>
          </div>
        )}
      </div>
    </div>
  );

  // ── CLIENT FORM MODAL ──────────────────────────────────────────────────────
  // ── NEW WR MODAL ────────────────────────────────────────────────────────────
  const renderNewWRModal=()=>(
    <div className="ov">
      <div className="modal mxl" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">{editWR?"✏️ Editar WR — "+editWR.id:"📦 Nuevo Warehouse Receipt"} — {wrf.cajas.length} {wrf.cajas.length===1?"caja":"cajas"}</div>
          <button className="mcl" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF());setClientSearch("");}}>✕</button>
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
              <div className="fg"><div className="fl">Nombre / Empresa</div><input className="fi" value={wrf.remitente} onChange={e=>sw("remitente",e.target.value)} placeholder="Empresa / Remitente"/></div>
              <div className="fg"><div className="fl">Dirección</div><input className="fi" value={wrf.remitenteDir} onChange={e=>sw("remitenteDir",e.target.value)}/></div>
              <div className="fg"><div className="fl">Teléfono</div><input className="fi" value={wrf.remitenteTel} onChange={e=>sw("remitenteTel",e.target.value)} placeholder="+1 000 000 0000"/></div>
              <div className="fg"><div className="fl">Email</div><input className="fi" value={wrf.remitenteEmail} onChange={e=>sw("remitenteEmail",e.target.value)}/></div>
            </div>
          </div>
          <div>
            <div className="sdiv">INFORMACIÓN DEL CONSIGNATARIO</div>
            <div className="fgrid" style={{gap:8}}>
              <div className="fg fi-search">
                <div className="fl">Buscar por Nombre o N° Casillero</div>
                <input className="fi" value={clientSearch} onChange={e=>handleClientSearch(e.target.value)} placeholder="Escribir nombre o casillero NX-0000…"/>
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
          <div className="fg"><div className="fl">Tipo de Pago</div><select className="fs" value={wrf.tipoPago} onChange={e=>sw("tipoPago",e.target.value)}>{PAY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
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
                  <div style={{display:"grid",gridTemplateColumns:"95px 1fr auto 1px 95px 1fr 1px 95px 1fr",gap:6,alignItems:"end"}}>
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
                              <input className="fi" style={{padding:"4px 6px",fontFamily:"'DM Mono',monospace",fontSize:12,flex:1}} value={caja[tfield]||""} onChange={e=>swCaja(idx,tfield,e.target.value)} placeholder="Escanear…"/>
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
                  <div className="fg"><div className="fl">N° Factura</div><input className="fi" value={caja.numFactura} onChange={e=>swCaja(idx,"numFactura",e.target.value)} placeholder="INV-00000"/></div>
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
                    <input className="fi" value={caja.tipoEmbalaje} onChange={e=>swCaja(idx,"tipoEmbalaje",e.target.value)} placeholder="Ej: Caja, Paleta…" style={{fontSize:13}}/>
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
                  <textarea className="fi" value={caja.descripcion} onChange={e=>swCaja(idx,"descripcion",e.target.value)} placeholder="Descripción detallada de la mercancía: tipo de producto, materiales, uso, etc." rows={3} style={{resize:"vertical",minHeight:64,fontFamily:"inherit",fontSize:14,lineHeight:1.5}}/>
                </div>

                {/* FOTOS DEL PAQUETE (por caja) */}
                {hasPerm(currentUser,"subir_foto") && (
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
                        Sin fotos — usa los botones de arriba para agregar fotos del paquete de esta caja
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
        <div className="sdiv">NOTAS Y CARGOS APLICABLES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
          <div className="fg"><div className="fl">Notas y Observaciones</div><textarea className="ft" value={wrf.notas} onChange={e=>sw("notas",e.target.value)} placeholder="Frágil, NO VOLTEAR, manejo especial…"/></div>
          <div className="fg"><div className="fl">Cargos Aplicables</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:4}}>
              {CHARGES_OPT.map(c=><button key={c} className={`btn-${wrf.cargos.includes(c)?"p":"s"}`} style={{fontSize:12,padding:"4px 9px"}} onClick={()=>sw("cargos",wrf.cargos.includes(c)?wrf.cargos.filter(x=>x!==c):[...wrf.cargos,c])}>{c}</button>)}
            </div>
          </div>
        </div>

        <div className="mft">
          <button className="btn-s" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF());setClientSearch("");}}>Cancelar</button>
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
                    numFactura:d.factura||"",descripcion:d.descripcion||"",
                  }))
                :[emptyCaja()];
              setWrf({...emptyWRF(),
                unitDim:"in",unitPeso:"lb", // mostrar en pulg/lb (unidades originales)
                cajas:_rawCajas,
                consignee:selWR.consignee||"",casilleroSearch:selWR.casillero||"",casillero:selWR.casillero||"",clienteId:selWR.clienteId||"",
                remitente:selWR.shipper||"",remitenteDir:selWR.remitenteDir||"",tipoPago:selWR.tipoPago||"Prepago",tipoEnvio:selWR.tipoEnvio||"",
                notas:selWR.notas||"",cargos:selWR.cargos||[],
              });
              setShowNewWR(true);setSelWR(null);
            }}>✏️ Editar</button>}
            {hasPerm("borrar_wr")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar WR ${selWR.id}? Esta acción no se puede deshacer.`)){setWrList(p=>p.filter(x=>x.id!==selWR.id));dbDeleteWR(selWR.id);logAction("Borró WR",selWR.id);setSelWR(null);}}}>🗑 Borrar</button>}
            {crElegible(selWR)&&hasPerm("hacer_egreso")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",background:"#E8F5E9",borderColor:"#81C784",color:"#2E7D32",fontWeight:700}} onClick={()=>{crOpenNew([selWR.id]);setSelWR(null);}} title="Registrar egreso individual de este WR">🚀 Egresar</button>}
            {dnElegible(selWR)&&hasPerm("entregar")&&<button className="btn-s" style={{fontSize:12,padding:"4px 10px",background:"#E3F2FD",borderColor:"#64B5F6",color:"#1565C0",fontWeight:700}} onClick={()=>{dnOpenNew([selWR.id]);setSelWR(null);}} title="Registrar entrega al cliente">📝 Entregar</button>}
            <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir</button>
            <button className="mcl" onClick={()=>setSelWR(null)}>✕</button>
          </div>
        </div>
        {/* Barra de confirmación por tipo de envío */}
        {canEdit&&(
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
              <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)",marginBottom:2}}>Warehouse Receipt</div>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"flex-end",marginBottom:4}}><WRBarcode value={selWR.id} height={36} width={2}/></div>
              <div className="wr-num-d">{selWR.id}</div>
              <div className="wr-num-meta">
                📍 {selWR.origCity||"—"} → {selWR.destCity||"—"}<br/>
                {fmtDate(selWR.fecha)} {fmtTime(selWR.fecha)}<br/>
                Recibió: {_usuarioNombre}
              </div>
              <div style={{marginTop:6}}><StBadge st={selWR.status}/></div>
            </div>
          </div>
          <div className="w2c">
            <div className="wb">
              <div className="wb-t">📤 Remitente / Shipper</div>
              <div className="wf"><div className="wfl">Nombre / Empresa</div><div className="wfv">{selWR.shipper||"—"}</div></div>
              <div className="wf"><div className="wfl">Recibido en</div><div className="wfv" style={{fontWeight:600}}>{_oc?.nombre||selWR.branch||"Casa Matriz"}{_oc?.ciudad?` — ${_oc.ciudad}`:""}</div></div>
              <div className="wf"><div className="wfl">Procedencia</div><div className="wfv">{selWR.remitenteDir||""}</div></div>
            </div>
            <div className="wb">
              <div className="wb-t">📥 Consignatario / Consignee</div>
              <div className="wf"><div className="wfl">Nombre</div><div className="wfv" style={{fontWeight:700,fontSize:15}}>{selWR.consignee||"—"}</div></div>
              <div className="wf"><div className="wfl">Casillero</div><div className="wfv" style={{color:"var(--gold2)",fontWeight:700,fontSize:15}}>#{selWR.casillero||"—"}</div></div>
              {_destAddr&&<div className="wf"><div className="wfl">Dirección</div><div className="wfv" style={{fontSize:13}}>{_destAddr}</div></div>}
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
            <div className="wb-t">📐 Dimensiones y Peso — {selWR.cajas} {selWR.cajas===1?"caja":"cajas"}</div>
            {selWR.dims&&selWR.dims.length>0&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:4,marginBottom:4,padding:"4px 0",borderBottom:"2px solid var(--navy)"}}>
                  {["#","Dims (in)","Peso lb","P.Vol lb","Ft³","M³","Peso kg","P.Vol kg","Tracking","Carrier"].map(h=>(
                    <div key={h} style={{fontSize:10,color:"var(--navy)",fontWeight:700,textTransform:"uppercase",letterSpacing:.7}}>{h}</div>
                  ))}
                </div>
                {selWR.dims.map((d,i)=>{
                  const dv=calcVol(d.l,d.a,d.h,"cm");
                  const trk=d.tracking||selWR.tracking||"—";
                  const car=d.carrier||selWR.carrier||"—";
                  return (
                    <div key={i} style={{borderBottom:"1px solid var(--b2)",paddingBottom:6,marginBottom:4}}>
                      <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:4,padding:"4px 0",alignItems:"center"}}>
                        <div style={{fontWeight:700,color:"var(--navy)",fontSize:13}}>{i+1}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{toIn(d.l)}×{toIn(d.a)}×{toIn(d.h)}"</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600}}>{toLb(d.pk)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--orange)",fontWeight:700}}>{dv.volLb}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--sky)"}}>{dv.ft3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--teal)"}}>{dv.m3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t2)"}}>{d.pk?.toFixed?.(2)||"—"}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--orange)"}}>{dv.volKg}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trk}</div>
                        <div style={{fontWeight:700,fontSize:13,color:"var(--navy)"}}>{car}</div>
                      </div>
                      {d.descripcion&&<div style={{fontSize:12,color:"var(--t2)",paddingLeft:28,marginTop:2}}>📦 {d.descripcion}</div>}
                      {d.factura&&<div style={{fontSize:12,color:"var(--t3)",paddingLeft:28}}>Factura: {d.factura}</div>}
                    </div>
                  );
                })}
                {/* Totales */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:10}}>
                  {[["Peso Total",`${selWR.pesoLb}lb / ${selWR.pesoKg}kg`,"var(--t1)"],["P.Vol. Total",`${selWR.volLb||"—"}lb / ${selWR.volKg}kg`,"var(--orange)"],["Ft³",String(selWR.ft3),"var(--sky)"],["M³",String(selWR.m3),"var(--teal)"],["Descripción",selWR.descripcion||"—","var(--t1)"],["Valor Declarado",`$${typeof selWR.valor==="number"?selWR.valor.toFixed(2):selWR.valor}`,"var(--green)"]].map(([l,v,c])=>(
                    <div key={l} className="wf"><div className="wfl">{l}</div><div className="wfv" style={{color:c}}>{v}</div></div>
                  ))}
                </div>
              </>
            )}
          </div>
          {canStatus&&(
            <div style={{marginBottom:12}}>
              <div className="sdiv">ACTUALIZAR ESTADO</div>
              {/* Grupos de estados manuales para WR individuales.
                  Criterio: filtramos por `s.manual` excepto Excepciones (18/18.1/19
                  tienen flujos especiales propios) y mantenemos el botón Entregado (21)
                  transitoriamente hasta que Lote 5 (Notas de Entrega) lo reemplace. */}
              {[
                {label:"📍 Origen",filter:s=>s.phase==="origen"&&s.manual},
                {label:"⚠️ Excepciones",filter:s=>s.phase==="excep"},
                {label:"🚚 Entrega",filter:s=>s.phase==="entrega"&&(s.manual||s.code==="21")},
              ].map(grp=>{
                const sts=WR_STATUSES.filter(grp.filter);
                if(sts.length===0)return null;
                return(
                  <div key={grp.label} style={{marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{grp.label}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {sts.map(s=>(
                        <button key={s.code}
                          className={`btn-${selWR.status?.code===s.code?"p":"s"}`}
                          style={{fontSize:11,padding:"3px 8px"}}
                          onClick={()=>{
                            // Flujo especial: Entregado → preguntar cobro
                            if(s.code==="21"){
                              const cobrado=window.confirm("¿Se cobró al momento de la entrega?\n✅ Aceptar = Cobrado (23)\n❌ Cancelar = Por Cobrar (22)");
                              const finalSt=WR_STATUSES.find(x=>x.code===(cobrado?"23":"22"));
                              const upd={...selWR,status:finalSt,historial:[...(selWR.historial||[]),{code:finalSt.code,label:finalSt.label,fecha:new Date(),user:currentUser.id}]};
                              setSelWR(upd);setWrList(p=>p.map(w=>w.id===upd.id?upd:w));dbUpsertWR(upd);
                              logAction(cobrado?"Cobrado":"Por Cobrar",upd.id);
                              return;
                            }
                            // Flujo especial: Faltante → preguntar si se quedó en origen
                            if(s.code==="18"){
                              const enOrigen=window.confirm("¿El paquete se quedó en Origen?\n✅ Aceptar = Vuelve a Consolidado (4) para próxima guía\n❌ Cancelar = Pasa a Investigación (18.1)");
                              const finalSt=WR_STATUSES.find(x=>x.code===(enOrigen?"4":"18.1"));
                              const nota=enOrigen?"Faltante — quedó en origen, reasignar a próxima guía":"Faltante — en investigación";
                              const upd={...selWR,status:finalSt,historial:[...(selWR.historial||[]),{code:finalSt.code,label:finalSt.label,fecha:new Date(),user:currentUser.id,nota}]};
                              setSelWR(upd);setWrList(p=>p.map(w=>w.id===upd.id?upd:w));dbUpsertWR(upd);
                              logAction(finalSt.label,upd.id);
                              return;
                            }
                            // Flujo especial: Investigación → agregar nota de resultado
                            if(s.code==="18.1"){
                              const nota=window.prompt("Resultado de la investigación (requerido):");
                              if(!nota)return;
                              const upd={...selWR,status:s,historial:[...(selWR.historial||[]),{code:s.code,label:s.label,fecha:new Date(),user:currentUser.id,nota}]};
                              setSelWR(upd);setWrList(p=>p.map(w=>w.id===upd.id?upd:w));dbUpsertWR(upd);
                              logAction("Investigación",`${upd.id} — ${nota}`);
                              return;
                            }
                            // Flujo especial: Sobrante → resolver
                            if(s.code==="19"){
                              const aceptar=window.confirm("¿Cómo se resuelve el Sobrante?\n✅ Aceptar = Aceptación manual → pasa a Almacén (17)\n❌ Cancelar = Asignar a próxima guía (queda en Sobrante)");
                              const finalSt=WR_STATUSES.find(x=>x.code===(aceptar?"17":"19"));
                              const nota=aceptar?"Sobrante — aceptación manual, pasa a Almacén":"Sobrante — pendiente asignación a próxima guía";
                              const upd={...selWR,status:finalSt,historial:[...(selWR.historial||[]),{code:finalSt.code,label:finalSt.label,fecha:new Date(),user:currentUser.id,nota}]};
                              setSelWR(upd);setWrList(p=>p.map(w=>w.id===upd.id?upd:w));dbUpsertWR(upd);
                              logAction(finalSt.label,upd.id);
                              return;
                            }
                            // Estado normal
                            const upd={...selWR,status:s,historial:[...(selWR.historial||[]),{code:s.code,label:s.label,fecha:new Date(),user:currentUser.id}]};
                            setSelWR(upd);setWrList(p=>p.map(w=>w.id===upd.id?upd:w));dbUpsertWR(upd);
                            logAction(`Estado → ${s.label}`,upd.id);
                          }}>
                          {s.code} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{fontSize:11,color:"var(--t3)",marginTop:4}}>Los estados 5→16 (tránsito) se actualizan desde la Guía Consolidada → cascada automática.</div>
            </div>
          )}
          <div className="wr-legal">
            NOTA: SE ESTÁ ENTREGANDO ESTA CAJA COMPLETAMENTE SELLADA. Certifico que este envío no contiene dinero, narcóticos, armas o dispositivos explosivos no autorizados. <strong>{empresaNombre} International Courier</strong> no se hace responsable de los artículos no retirados en los treinta (30) días siguientes a su recepción. Nuestra responsabilidad en siniestros será de $100 por recibo si el cliente no asegura la carga. SHIPPER autoriza a {empresaNombre} a inspeccionar la carga de acuerdo con el Programa IACSSP aprobado por la TSA. Al recibir este documento, da fe de haber leído y estar de acuerdo con los términos y regulaciones.
          </div>
          {/* Sección de entrega */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",gap:12,margin:"10px 0 6px"}}>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Entregado por</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:"var(--navy)"}}>{selWR.shipper||"—"}</div>
            </div>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Nombre completo del receptor</div>
              <div style={{height:20,borderBottom:"1px solid var(--b1)"}}/>
            </div>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Fecha y Hora de entrega</div>
              <div style={{height:20,borderBottom:"1px solid var(--b1)"}}/>
            </div>
          </div>
          <div className="wr-sigs">
            <div className="wr-sig">Firma y Nombre del Receptor · C.I. / Pasaporte</div>
            <div className="wr-sig">{empresaNombre} · Responsable de Recepción · Sello</div>
          </div>
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

              {/* ── ENTREGADO POR ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginTop:4}}><tbody>
                <tr>
                  <td style={{...TD,width:"33%",borderRight:"none"}}>
                    <div style={{fontSize:11,color:"#555"}}>Entregado por:</div>
                    <div style={{fontWeight:700}}>{selWR.shipper||"—"}</div>
                  </td>
                  <td style={{...TD,width:"34%",borderRight:"none"}}>
                    <div style={{fontSize:11,color:"#555"}}>Nombre Completo</div>
                    <div style={{height:18}}/>
                  </td>
                  <td style={{...TD,width:"33%"}}>
                    <div style={{fontSize:11,color:"#555"}}>Fecha y Hora</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:18}}>
                      <span/>
                      <span style={{fontSize:11,color:"#555"}}>Pag: 1/1</span>
                    </div>
                  </td>
                </tr>
              </tbody></table>

              {/* ── TEXTO LEGAL ── */}
              <div style={{fontSize:11,lineHeight:1.6,color:"#333",textAlign:"center",marginTop:8,borderTop:"1px solid #ccc",paddingTop:6}}>
                <div style={{fontWeight:700,marginBottom:3,fontSize:12}}>NOTA: SE ESTA ENTREGANDO ESTA CAJA COMPLETAMENTE SELLADA.</div>
                Certifico que este envío no contiene dinero, narcóticos, armas o dispositivos explosivos no autorizados. {empresaNombre} no se hace responsable de los artículos no retirados en los treinta (30) días siguientes a su recepción. Nuestra responsabilidad en caso de siniestros durante el transporte aéreo o marítimo, extravío o robos será de $100 dólares por recibo de almacén, si el cliente no asegura la carga. Estoy de acuerdo con que este envío está sujeto a los controles de seguridad de la compañía y otras regulaciones gubernamentales. SHIPPER autoriza a {empresaNombre} a que inspeccione toda la carga ofrecida del comercio aéreo a partir de la fecha de esta notificación de acuerdo con su Programa de Seguridad Standart de Transporte Aéreo Indirecto (IACSSP) aprobado por la TSA. Al recibir este documento y girar instrucciones de envío, da fe de haber leído, entendido y estar totalmente de acuerdo con los términos y regulaciones.
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
    if(q.length<2){setEcResults([]);return;}
    const res=clients.filter(c=>c.tipo==="cliente"&&(
      fullName(c).toLowerCase().includes(q.toLowerCase())||
      (c.casillero||"").toLowerCase().includes(q.toLowerCase())||
      (c.email||"").toLowerCase().includes(q.toLowerCase())||
      (c.tel1||"").includes(q)||(c.tel2||"").includes(q)
    ));
    setEcResults(res);
  };

  const selEcCliente=(c)=>{
    setEcCliente(c);
    setEcSearch(fullName(c)+" — "+c.casillero);
    setEcResults([]);
  };

  const getStatusDate=(w,code)=>{
    if(!w.status)return"—";
    const base=w.fecha instanceof Date?w.fecha:new Date(w.fecha);
    const add=(days)=>{const d=new Date(base);d.setDate(d.getDate()+days);return fmtDate(d);};
    const stOrder=["1","2","3","4","5","6","6.2","7","8","9","10","11","12C","12P"];
    const idx=stOrder.indexOf(w.status.code);
    switch(code){
      case "recibido":     return fmtDate(w.fecha);
      case "confirmado":   return idx>=2?add(1):"—";
      case "consolidado":  return idx>=3?add(2):"—";
      case "enviado":      return idx>=4?add(3):"—";
      case "almacen_dest": return idx>=9?add(8):"—";
      case "entregado":    return(w.status.code==="12C"||w.status.code==="12P")?add(12):"—";
      default: return"—";
    }
  };

  // N° Guía se genera al consolidar (simulado como ID de consolidación)
  const getNumGuia=(w)=>{
    if(!w.status)return"—";
    const stOrder=["1","2","3","4","5","6","6.2","7","8","9","10","11","12C","12P"];
    const idx=stOrder.indexOf(w.status.code);
    if(idx<3)return"—"; // no consolidado aún
    // Generar número de guía basado en el WR (simula número asignado al consolidar)
    return "GU-"+w.id.slice(8,14);
  };

  const renderEstadoCuenta=()=>{
    const wrTodos=ecCliente?wrList.filter(w=>
      w.clienteId===ecCliente.id||
      w.casillero===ecCliente.casillero||
      (w.consignee||"").trim().toUpperCase()===(fullName(ecCliente)||"").trim().toUpperCase()
    ):[];

    // Filtro por mes/año
    const wrFecha=wrTodos.filter(w=>{
      const f=w.fecha instanceof Date?w.fecha:new Date(w.fecha);
      if(ecMes&&(f.getMonth()+1)!==parseInt(ecMes))return false;
      if(ecAnio&&f.getFullYear()!==parseInt(ecAnio))return false;
      return true;
    });

    // Filtro por estado
    const entregados=["12C","12P"];
    const wrCliente=wrFecha.filter(w=>{
      if(!w.status)return ecFiltro==="todos";
      const c=w.status.code;
      switch(ecFiltro){
        case "pendientes":   return !entregados.includes(c);
        case "porconfirmar": return !["3","4","5","6","6.1","6.2","7","7.1","8","9","9.1","10","10.1","10.2","11","12C","12P"].includes(c);
        case "reempacados":  return c==="2.3";
        case "cobrados":     return c==="12C";
        case "porcobrar":    return c==="12P";
        default:             return true;
      }
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
      {k:"cobrados",l:"Entregado/Cobrado"},
      {k:"porcobrar",l:"Entregado/Por Cobrar"},
    ];

    const MESES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const anios=[2023,2024,2025,2026];

    return (
      <div className="page-scroll">
        {/* BÚSQUEDA */}
        <div className="card" style={{marginBottom:14,maxWidth:700}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:12}}>
            👤 Estado de Cuenta — Búsqueda de Cliente
          </div>
          <div style={{position:"relative"}}>
            <div style={{display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,fontSize:15}} value={ecSearch}
                onChange={e=>buscarCliente(e.target.value)}
                placeholder="Buscar por nombre, casillero, email o teléfono…"/>
              {ecCliente&&<button className="btn-s" onClick={()=>{setEcCliente(null);setEcSearch("");setEcResults([]);}}>✕ Limpiar</button>}
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
          </div>
        </div>

        {ecCliente&&(
          <>
            {/* HEADER CLIENTE */}
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:16,marginBottom:14,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",boxShadow:"var(--shadow)",alignItems:"center"}}>
              <div style={{width:56,height:56,borderRadius:12,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22}}>{initials(ecCliente)}</div>
              <div>
                <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:22,fontWeight:700,color:"var(--navy)"}}>{fullName(ecCliente)}</div>
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
              </div>
            </div>

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
                        const c=w.status.code;
                        switch(f.k){
                          case "pendientes":   return !entregados.includes(c);
                          case "porconfirmar": return !["3","4","5","6","6.1","6.2","7","7.1","8","9","9.1","10","10.1","10.2","11","12C","12P"].includes(c);
                          case "reempacados":  return c==="2.3";
                          case "cobrados":     return c==="12C";
                          case "porcobrar":    return c==="12P";
                          default:             return true;
                        }
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
                  <button className="btn-p" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir</button>
                </div>
              </div>

              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5,whiteSpace:"nowrap"}}>
                  <thead>
                    <tr style={{background:"var(--navy)"}}>
                      {["N° WR","Cajas","Peso lb","P.Vol lb","Ft³","M³","Recibido","Confirmado","Consolidado","Enviado","Alm. Destino","Entregado","N° Guía","Tipo Envío","Contenido","Valor"].map(h=>(
                        <th key={h} style={{color:"rgba(255,255,255,.8)",fontSize:11,letterSpacing:.8,textTransform:"uppercase",fontWeight:700,padding:"7px 8px",textAlign:"left",borderBottom:"2px solid var(--navy3)",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wrCliente.length===0?(
                      <tr><td colSpan={16} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>
                        {ecFiltro==="todos"?"Este cliente no tiene envíos registrados.":"No hay envíos con este filtro."}
                      </td></tr>
                    ):wrCliente.map(w=>(
                      <tr key={w.id} style={{borderBottom:"1px solid var(--b2)"}}
                        onMouseEnter={e=>{Array.from(e.currentTarget.cells).forEach(c=>c.style.background="#EEF3FF");}}
                        onMouseLeave={e=>{Array.from(e.currentTarget.cells).forEach(c=>c.style.background="");}}>
                        {/* N° WR — clickeable para abrir detalle */}
                        <td style={{padding:"7px 8px"}}>
                          <div onClick={()=>setSelWR(w)} style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:13,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",display:"inline-block",cursor:"pointer",textDecoration:"underline"}}
                            onMouseEnter={e=>e.currentTarget.style.background="#D8E8FF"}
                            onMouseLeave={e=>e.currentTarget.style.background="#EEF3FF"}>
                            {w.id}
                          </div>
                        </td>
                        {/* Cajas — número simple, sin click */}
                        <td style={{padding:"7px 8px",textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{w.cajas}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--t1)"}}>{w.pesoLb}lb</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--orange)"}}>{w.volLb||"—"}lb</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{w.ft3}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",color:"var(--teal)"}}>{w.m3}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12}}>{getStatusDate(w,"recibido")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"confirmado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"confirmado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"consolidado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"consolidado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"enviado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"enviado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"almacen_dest")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"almacen_dest")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:getStatusDate(w,"entregado")==="—"?"var(--t3)":"var(--green)",fontWeight:getStatusDate(w,"entregado")==="—"?400:700}}>{getStatusDate(w,"entregado")}</td>
                        {/* N° Guía — generado al consolidar, NO es el tracking del carrier */}
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)",fontWeight:600}}>{getNumGuia(w)}</td>
                        <td style={{padding:"7px 8px"}}><TypeBadge t={w.tipoEnvio}/></td>
                        <td style={{padding:"7px 8px",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",color:"var(--t2)"}}>{w.descripcion||"—"}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${w.valor?.toFixed(2)||"0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                  {wrCliente.length>0&&(
                    <tfoot>
                      <tr style={{background:"var(--bg4)",borderTop:"2px solid var(--navy)"}}>
                        <td colSpan={2} style={{padding:"8px",fontWeight:700,fontSize:13,color:"var(--navy)"}}>TOTALES</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--t1)"}}>{totalPesoLbC}lb</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--orange)"}}>{totalVolLbC}lb</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--sky)"}}>{totalFt3C}</td>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--teal)"}}>{totalM3C}</td>
                        <td colSpan={9}/>
                        <td style={{padding:"8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${totalValorC}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}

        {/* MODAL REEMPAQUE POR CLIENTE — solo WR del cliente seleccionado */}
        {rpqCliModal&&(()=>{
          const cli=rpqCliModal.cliente;
          const cliWRs=wrList.filter(w=>{
            const c=w.status?.code||"1";
            // Excluir ya reempacados o fases tardías
            if(["2.3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","18.1","19","20","21","22","23"].includes(c))return false;
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
                <div style={{padding:"0 14px 10px",fontSize:13,color:"var(--t2)"}}>Selecciona los WR de este cliente que se agruparán. Se creará un nuevo WR y los seleccionados quedarán marcados como REEMPACADO.</div>
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
                            <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.descripcion||"—"}</td>
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
    if(cf.containers.some(c=>c.wr.some(r=>r.id===wrId)))return "WR ya está en un contenedor";
    scCont(ci,"wr",[...cf.containers[ci].wr,{id:wr.id,consignee:wr.consignee,cajas:wr.cajas||1,pesoLb:wr.pesoLb||0,ft3:wr.ft3||0,descripcion:wr.descripcion||""}]);
    return null;
  };

  const doContScan=(ci)=>{
    const val=contScanVal[ci]||"";
    if(!val.trim()){setContScanErr(p=>({...p,[ci]:"Escanea un WR"}));return;}
    const err=addWRToContainer(ci,val.trim());
    if(err)setContScanErr(p=>({...p,[ci]:err}));
    else{setContScanVal(p=>({...p,[ci]:""}));setContScanErr(p=>({...p,[ci]:""}));}
  };

  const addContainer=()=>setCf(p=>({...p,containers:[...p.containers,{tipo:"E",largo:"",ancho:"",alto:"",pesoLb:"",sello:"",wr:[]}]}));
  const removeContainer=(ci)=>setCf(p=>({...p,containers:p.containers.filter((_,i)=>i!==ci)}));

  // Actualiza el estado de una guía consolidada y lo cascada a todos sus WRs
  // Solo permite avanzar a estados con channels.includes("consolidacion").
  // Estados auto (17 Almacén, 20 Por Entrega, etc.) no se deben fijar desde aquí.
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

  const submitConsol=()=>{
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
    setShowNewConsol(false);
    setEditConsolId(null);
    setCf(emptyConsol(SEND_TYPES[0]||""));
    setContScanVal({});
    setContScanErr({});
    logAction(existing?"Editó embarque":"Cerró embarque",n.id);
    // Abre el modal de etiquetas de Guía Consolidada (1 etiqueta por contenedor)
    setShowConsolLabels({
      guia:n,
      containers:cf.containers||[],
      remitente:empresaNombre||"ENEX",
    });
  };

  // ── ETIQUETAS ───────────────────────────────────────────────────────────────
  const renderConsolidacion=()=>(
    <div className="page-scroll">
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🗂️ Consolidación de Embarques</div>
          <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Agrupa WR confirmados en contenedores y genera el embarque.</div>
        </div>
        <button className="btn-p" onClick={()=>setShowNewConsol(true)}>+ Nuevo Embarque</button>
      </div>

      {/* LISTA DE EMBARQUES */}
      {consolList.length===0?(
        <div className="card" style={{textAlign:"center",padding:60,color:"var(--t3)"}}>
          No hay embarques consolidados aún.<br/>
          <button className="btn-p" style={{marginTop:14}} onClick={()=>setShowNewConsol(true)}>+ Crear primer embarque</button>
        </div>
      ):(
        <div className="card" style={{padding:0}}>
          <table className="ct">
            <thead><tr>
              <th>N° Embarque</th><th>Fecha</th><th>Destino</th><th>Tipo Envío</th>
              <th>Containers</th><th>WR</th><th>Cajas</th><th>Peso lb</th><th>Ft³</th>
              <th>Vuelo/Barco</th><th>AWB / BL</th><th>Salida</th>
              <th style={{minWidth:260}}>Estado (guía)</th>
              <th style={{minWidth:170}}>Acciones</th>
            </tr></thead>
            <tbody>
              {consolList.map(c=>{
                const stActual=WR_STATUSES.find(s=>s.label===c.status)||WR_STATUSES.find(s=>s.code==="4");
                const curPhaseIdx=currentGuidePhaseIdx(stActual?.code||"4");
                return (
                <tr key={c.id}>
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{c.id}</span></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(c.fecha)}</td>
                  <td style={{fontWeight:600,color:"var(--t1)"}}>{c.destino}</td>
                  <td><TypeBadge t={c.tipoEnvio}/></td>
                  <td style={{textAlign:"center",fontWeight:700}}>{c.containers.length}</td>
                  <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.totalWR}</td>
                  <td style={{textAlign:"center"}}>{c.totalCajas}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t1)",fontWeight:600}}>{c.totalLb}lb</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{c.totalFt3}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--cyan)"}}>{c.numVuelo||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--purple)"}}>{c.awb||c.bl||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{c.fechaSalida||"—"}</td>
                  <td style={{minWidth:320,padding:"6px 8px"}}>
                    {/* Estado actual destacado */}
                    <div style={{marginBottom:6,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <StBadge st={stActual||{cls:"s3",label:c.status||"En preparación"}}/>
                      <span style={{fontSize:12,color:"var(--t3)"}}>
                        {curPhaseIdx>=0?`Fase ${curPhaseIdx+1}/7`:"Pre-consolidado"}
                      </span>
                    </div>
                    {/* Barra de progreso 7 fases */}
                    <div style={{display:"flex",alignItems:"stretch",gap:2,background:"#F3F5F9",border:"1px solid #DFE4EE",borderRadius:6,padding:2,overflow:"hidden"}}>
                      {GUIDE_PHASES.map((ph,i)=>{
                        const isDone=curPhaseIdx>i;
                        const isCur=curPhaseIdx===i;
                        const isNext=curPhaseIdx+1===i;
                        const editable=statusInChannel(ph.advance,"consolidacion");
                        const bg=isDone?"var(--navy)":isCur?"var(--cyan)":isNext&&editable?"#EEF3FF":"#fff";
                        const color=isDone||isCur?"#fff":editable?"var(--t2)":"var(--t3)";
                        return (
                          <span key={ph.key}
                            title={editable
                              ?`${i+1}. ${ph.label} — click para fijar esta fase`
                              :`${i+1}. ${ph.label} — se asigna automáticamente (no editable aquí)`}
                            onClick={editable?(()=>updateGuideStatus(c.id,ph.advance)):undefined}
                            style={{
                              flex:1,cursor:editable?"pointer":"not-allowed",padding:"4px 2px",textAlign:"center",
                              background:bg,color,borderRadius:4,opacity:editable?1:.6,
                              fontSize:11,fontWeight:isCur?700:600,
                              border:isCur?"1.5px solid var(--navy)":"1px solid transparent",
                              transition:"all .15s",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                            }}>
                            <span style={{display:"block",fontSize:13,lineHeight:1}}>{ph.icon}</span>
                            <span style={{display:"block",fontSize:10,marginTop:1,lineHeight:1}}>{ph.short}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{minWidth:170}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      <button className="btn-c" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>setShowLabels({
                        wr:{id:c.id,origCity:OFFICE_CONFIG.origCity,origCountry:"USA 🇺🇸",destCity:c.destino,destCountry:"Venezuela 🇻🇪",
                          consignee:"CONSOLIDADO",casillero:"—",fecha:c.fecha,branch:OFFICE_CONFIG.branch,tipoEnvio:c.tipoEnvio,
                          shipper:"ENEX",cajas:c.totalCajas,pesoLb:c.totalLb,volLb:c.totalVolLb,ft3:c.totalFt3,m3:c.totalM3},
                        dims:c.containers.map((ct,i)=>({l:0,a:0,h:0,pk:0,pkLb:parseFloat(ct.pesoLb)||0,volLb:0,ft3:0,m3:0,tracking:`Cont. ${i+1} · ${ct.tipo} · Sello: ${ct.sello||"—"}`})),
                        remitente:"ENEX",tipoEnvio:c.tipoEnvio,
                      })}>🏷️ Etiquetas</button>
                      {hasPerm("editar_guia")&&(
                        <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} title="Editar guía"
                          onClick={()=>{setCf({
                            destino:c.destino,tipoEnvio:c.tipoEnvio,fechaSalida:c.fechaSalida||"",numVuelo:c.numVuelo||"",
                            awb:c.awb||"",bl:c.bl||"",notas:c.notas||"",containers:c.containers||[],
                          });setEditConsolId(c.id);setShowNewConsol(true);}}>✏️ Editar</button>
                      )}
                      {hasPerm("borrar_guia")&&(
                        <button className="btn-s" style={{fontSize:12,padding:"3px 8px",color:"var(--red)",borderColor:"var(--red)"}} title="Borrar guía"
                          onClick={()=>{
                            if(!window.confirm(`¿Borrar guía consolidada ${c.id}?\nLos WR asociados quedarán libres (estado Confirmado).`))return;
                            // Liberar WR asociados → volver a estado "3" Confirmado
                            const stConf=WR_STATUSES.find(s=>s.code==="3");
                            const allWrIds=(c.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
                            if(allWrIds.length>0&&stConf){
                              setWrList(p=>p.map(w=>{
                                if(!allWrIds.includes(w.id))return w;
                                const upd={...w,status:stConf,historial:[...(w.historial||[]),{code:stConf.code,label:stConf.label,fecha:new Date(),user:currentUser.id,nota:`Guía ${c.id} eliminada`}]};
                                dbUpsertWR(upd);
                                return upd;
                              }));
                            }
                            setConsolList(p=>p.filter(x=>x.id!==c.id));
                            dbDeleteConsolidacion(c.id);
                            logAction("Borró guía consolidada",c.id);
                          }}>🗑 Borrar</button>
                      )}
                    </div>
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
              <button className="mcl" onClick={()=>{setShowNewConsol(false);setEditConsolId(null);}}>✕</button>
            </div>

            {/* INFO GENERAL */}
            <div className="sdiv">INFORMACIÓN DEL EMBARQUE</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              <div className="fg">
                <div className="fl">Ciudad Destino</div>
                <select className="fs" value={cf.destino} onChange={e=>sc2("destino",e.target.value)}>
                  {COUNTRIES.find(c=>c.dial===OFFICE_CONFIG.destCountry)?.cities.map(c=>(
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Tipo de Envío</div>
                <select className="fs" value={cf.tipoEnvio} onChange={e=>sc2("tipoEnvio",e.target.value)}>
                  {SEND_TYPES.map(t=><option key={t}>{t}</option>)}
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

            {/* WR CONFIRMADOS DISPONIBLES — clickeables */}
            <div className="sdiv">WR CONFIRMADOS DISPONIBLES — clic para agregar al contenedor activo</div>
            <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"8px 12px",marginBottom:14,maxHeight:160,overflowY:"auto"}}>
              {wrList.filter(w=>w.status?.code==="3"&&!cf.containers.some(c=>c.wr.some(r=>r.id===w.id))).length===0?(
                <div style={{color:"var(--t3)",fontSize:13,padding:"8px 0"}}>No hay WR confirmados disponibles.</div>
              ):wrList.filter(w=>w.status?.code==="3"&&!cf.containers.some(c=>c.wr.some(r=>r.id===w.id))).map(w=>(
                <div key={w.id} onClick={()=>{
                    // Add to last container (or first)
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
              ))}
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
                    <select value={cont.tipo} onChange={e=>{
                        const code=e.target.value;
                        const reg=CONTAINER_TYPES.find(t=>t.code===code);
                        const dims=reg?parseContainerDim(reg.dim):null;
                        setCf(p=>({...p,containers:p.containers.map((c,i)=>i===ci?{
                          ...c,
                          tipo:code,
                          // Si el tipo trae medidas oficiales, autollenar; si es "Libre" o no existe, dejar manual
                          ...(dims?{largo:dims.l,ancho:dims.a,alto:dims.h}:{})
                        }:c)}));
                      }}
                      style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:5,color:"#fff",padding:"3px 8px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                      <option value="" style={{background:"var(--navy)"}}>— Seleccionar tipo —</option>
                      {CONTAINER_TYPES.map(t=><option key={t.code} value={t.code} style={{background:"var(--navy)"}}>{t.name}</option>)}
                    </select>
                    <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{cont.tipo?(contType?.dim||"Manual"):"Selecciona un tipo"}</span>
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
                                <td style={{color:"var(--t2)"}}>{w.descripcion||"—"}</td>
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
              <button className="btn-s" onClick={()=>{setShowNewConsol(false);setEditConsolId(null);setCf(emptyConsol(SEND_TYPES[0]||""));setContScanVal({});setContScanErr({});}}>Cancelar</button>
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
    const [etqMode,_etqMode]=[etqTipo,setEtqTipo];
    return (
    <div className="page-scroll">
      <div className="card" style={{maxWidth:640}}>
        <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:17,fontWeight:700,color:"var(--navy)",marginBottom:4}}>🖨️ Impresión</div>
        <div style={{fontSize:13,color:"var(--t3)",marginBottom:10}}>Etiquetas de caja, guía consolidada, notas de entrega, egresos y recibos (próximamente).</div>
        {/* Selector tipo de impresión */}
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          <button className={`btn-${etqMode==="wr"?"p":"s"}`} style={{flex:"1 1 160px"}} onClick={()=>{_etqMode("wr");setEtqSearch("");}}>📦 Etiquetas WR</button>
          <button className={`btn-${etqMode==="guia"?"p":"s"}`} style={{flex:"1 1 160px"}} onClick={()=>{_etqMode("guia");setEtqSearch("");}}>🗂️ Etiquetas Guía</button>
          <button className="btn-s" style={{flex:"1 1 160px",opacity:.5,cursor:"not-allowed"}} disabled title="Disponible próximamente">📄 Nota Entrega</button>
          <button className="btn-s" style={{flex:"1 1 160px",opacity:.5,cursor:"not-allowed"}} disabled title="Disponible próximamente">🪪 Egreso WR</button>
          <button className="btn-s" style={{flex:"1 1 160px",opacity:.5,cursor:"not-allowed"}} disabled title="Disponible próximamente">💵 Recibo de Pago</button>
        </div>
        <input className="fi" style={{marginBottom:12}} value={etqSearch} onChange={e=>setEtqSearch(e.target.value)}
          placeholder={etqMode==="guia"?"Buscar guía por número, destino o tipo…":"Buscar WR por número, nombre o casillero…"}/>
        {etqMode==="wr"&&etqSearch.length>1&&(wrList||[]).filter(w=>w.id.toLowerCase().includes(etqSearch.toLowerCase())||(w.consignee||"").toLowerCase().includes(etqSearch.toLowerCase())).slice(0,20).map(w=>(
          <div key={w.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"1px solid var(--b1)",marginBottom:6,cursor:"pointer",background:"var(--bg3)"}}
            onClick={()=>setShowLabels({wr:w,dims:w.dims||[],remitente:w.shipper||"",tipoEnvio:w.tipoEnvio||""})}>
            <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:"var(--navy)"}}>{w.id}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:15}}>{w.consignee}</div><div style={{fontSize:13,color:"var(--t3)"}}>{w.casillero} · {w.cajas} cajas</div></div>
            <StBadge st={w.status}/>
            <span style={{color:"var(--cyan)",fontSize:14,fontWeight:600}}>🏷️ Imprimir</span>
          </div>
        ))}
        {etqMode==="guia"&&etqSearch.length>1&&(consolList||[]).filter(g=>{
          const q=etqSearch.toLowerCase();
          return String(g.id||"").toLowerCase().includes(q)||String(g.destino||"").toLowerCase().includes(q)||String(g.tipoEnvio||"").toLowerCase().includes(q);
        }).slice(0,20).map(g=>(
          <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"1px solid var(--b1)",marginBottom:6,cursor:"pointer",background:"var(--bg3)"}}
            onClick={()=>setShowConsolLabels({guia:g,containers:g.containers||[],remitente:empresaNombre||"ENEX"})}>
            <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:"var(--purple)"}}>{g.id}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:15}}>{g.destino||"—"} · {g.tipoEnvio||"—"}</div>
              <div style={{fontSize:13,color:"var(--t3)"}}>{(g.containers||[]).length} cont. · {g.totalWR||0} WR · {g.totalCajas||0} cajas</div>
            </div>
            <span style={{fontSize:12,color:"var(--t2)",fontWeight:600,background:"var(--bg4)",padding:"3px 7px",borderRadius:4,border:"1px solid var(--b1)"}}>{g.status||"—"}</span>
            <span style={{color:"var(--cyan)",fontSize:14,fontWeight:600}}>🏷️ Imprimir</span>
          </div>
        ))}
        {etqSearch.length<=1&&<div style={{color:"var(--t3)",fontSize:14,textAlign:"center",padding:20}}>Escribe al menos 2 caracteres para buscar</div>}
        {etqSearch.length>1&&etqMode==="wr"&&(wrList||[]).filter(w=>w.id.toLowerCase().includes(etqSearch.toLowerCase())||(w.consignee||"").toLowerCase().includes(etqSearch.toLowerCase())).length===0&&<div style={{color:"var(--t3)",fontSize:14,textAlign:"center",padding:20}}>No se encontraron WR.</div>}
        {etqSearch.length>1&&etqMode==="guia"&&(consolList||[]).filter(g=>{const q=etqSearch.toLowerCase();return String(g.id||"").toLowerCase().includes(q)||String(g.destino||"").toLowerCase().includes(q)||String(g.tipoEnvio||"").toLowerCase().includes(q);}).length===0&&<div style={{color:"var(--t3)",fontSize:14,textAlign:"center",padding:20}}>No se encontraron guías consolidadas.</div>}
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
      {k:"cargos",l:"Cargos Adicionales",ic:"💲"},
      {k:"pagos",l:"Tipos de Pago",ic:"💳"},
      {k:"contenedores",l:"Tipos de Contenedor",ic:"📦"},
      {k:"paises",l:"Países y Ciudades",ic:"🌎"},
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
              <div style={{fontSize:13,color:"var(--t3)",marginBottom:12}}>Selecciona el tipo y el número de inicio de secuencia.</div>
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
              <div style={{fontSize:13,color:"var(--t3)",marginBottom:12}}>Selecciona el tipo y el número de inicio de secuencia.</div>
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
          <ListEditor title="⚡ Servicios Adicionales" items={CHARGES_OPT}
            onAdd={v=>{const n=[...CHARGES_OPT,v];setChargesOpt(n);dbSetConfig('charges',n);}}
            onDelete={i=>{const n=CHARGES_OPT.filter((_,j)=>j!==i);setChargesOpt(n);dbSetConfig('charges',n);}}
            placeholder="Ej: Embalaje Especial, Custodia…"/>
        )}

        {/* ── CARGOS ADICIONALES ── */}
        {cfgTab==="cargos"&&(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:8}}>💲 Cargos Adicionales</div>
            <div style={{fontSize:13,color:"var(--t3)",marginBottom:10}}>Los cargos adicionales se gestionan junto con Servicios. Ambas listas se usan en la creación de WR.</div>
            <ListEditor title="" items={CHARGES_OPT}
              onAdd={v=>{const n=[...CHARGES_OPT,v];setChargesOpt(n);dbSetConfig('charges',n);}}
              onDelete={i=>{const n=CHARGES_OPT.filter((_,j)=>j!==i);setChargesOpt(n);dbSetConfig('charges',n);}}
              placeholder="Ej: Recargo Combustible, Seguro Premium…"/>
          </div>
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
              <div style={{maxHeight:400,overflowY:"auto"}}>
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
        {cfgTab==="agentes"&&(
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
                  {agentes.length===0&&<tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay agentes registrados. El código 01 está reservado para la empresa matriz.</td></tr>}
                  {agentes.map(a=>(
                    <tr key={a.id}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 8px",borderRadius:4,border:"1px solid #B8C8F0"}}>{a.codigo}</span></td>
                      <td style={{fontWeight:600}}>{a.nombre}</td>
                      <td style={{fontSize:13}}>{a.ciudad||"—"}</td>
                      <td style={{fontSize:13}}>{a.pais||"—"}</td>
                      <td style={{fontSize:13,fontFamily:"'DM Mono',monospace"}}>{a.tel||"—"}</td>
                      <td style={{fontSize:13,color:"var(--cyan)"}}>{a.email||"—"}</td>
                      <td style={{fontSize:13}}>{a.contacto||"—"}</td>
                      <td><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,background:a.activo?"#E8F8EE":"#FEE8E8",color:a.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:a.activo?"#80D0A0":"#F0A0A0"}}>{a.activo?"✅ Activo":"❌ Inactivo"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        {hasPerm("editar_agente")&&<span className="ic-b" onClick={()=>{setAgForm(a);setEditAgente(a);setShowNewAgente(true);}}>✏️</span>}
                        {hasPerm("borrar_agente")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(!window.confirm(`¿Borrar agente ${a.codigo} — ${a.nombre}?`))return;setAgentes(p=>p.filter(x=>x.id!==a.id));dbDeleteAgente(a.id);logAction("Borró agente",`${a.codigo} — ${a.nombre}`);}}>🗑</span>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </div>
        )}

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
          const formEsAereo=tipoEsAereo(tafForm.tipoEnvio);
          const formEsMaritimo=tipoEsMaritimo(tafForm.tipoEnvio);
          return(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:17,fontWeight:700,color:"var(--navy)",flex:1}}>💰 Tarifas por Ruta y Tipo de Envío</div>
              {hasPerm("crear_tarifa")&&<button className="btn-p" style={{fontSize:13}} onClick={()=>{
                setTafForm({paisOrig:"",ciudadOrig:"",paisDest:"",ciudadDest:"",tipoEnvio:SEND_TYPES[0]||"",porLb:"",porFt3:"",min:"",moneda:"USD"});
                setEditTarifa(null);setShowNewTarifa(true);
              }}>+ Nueva Tarifa</button>}
            </div>
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <table className="ct">
                <thead><tr>
                  <th>Origen</th><th>Destino</th><th>Tipo Envío</th><th>Monto</th><th>Mínimo</th><th>Moneda</th><th>Estado</th><th>Acc.</th>
                </tr></thead>
                <tbody>
                  {tarifas.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:30,color:"var(--t3)"}}>No hay tarifas registradas.</td></tr>}
                  {tarifas.map(t=>{
                    const esAereo=tipoEsAereo(t.tipoEnvio);
                    const esMaritimo=tipoEsMaritimo(t.tipoEnvio);
                    const sy=cSym(t.moneda);
                    const monto=esAereo?`${sy}${t.porLb}/lb`:esMaritimo?`${sy}${t.porFt3}/ft³`:`${sy}${t.porLb}/lb`;
                    return(
                    <tr key={t.id}>
                      <td style={{fontWeight:600,fontSize:13}}>{t.paisOrig}-{t.ciudadOrig}</td>
                      <td style={{fontWeight:600,fontSize:13}}>{t.paisDest}-{t.ciudadDest}</td>
                      <td><TypeBadge t={t.tipoEnvio}/></td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:esAereo?"var(--green)":"var(--sky)"}}>{monto}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--orange)"}}>{sy}{t.min}</td>
                      <td style={{fontSize:13}}>{t.moneda}</td>
                      <td><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,background:t.activo?"#E8F8EE":"#FEE8E8",color:t.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:t.activo?"#80D0A0":"#F0A0A0"}}>{t.activo?"✅ Activa":"❌ Inactiva"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        {hasPerm("editar_tarifa")&&<span className="ic-b" onClick={()=>{setTafForm(t);setEditTarifa(t);setShowNewTarifa(true);}}>✏️</span>}
                        {hasPerm("editar_tarifa")&&<span className="ic-b" onClick={()=>{const upd={...t,activo:!t.activo};setTarifas(p=>p.map(x=>x.id===t.id?upd:x));dbUpsertTarifa(upd);logAction(upd.activo?"Activó tarifa":"Desactivó tarifa",`${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest}`);}}>{t.activo?"⏸":"▶️"}</span>}
                        {hasPerm("borrar_tarifa")&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(!window.confirm(`¿Borrar tarifa ${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest}?`))return;setTarifas(p=>p.filter(x=>x.id!==t.id));dbDeleteTarifa(t.id);logAction("Borró tarifa",`${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest} · ${t.tipoEnvio}`);}}>🗑</span>}
                      </div></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {showNewTarifa&&(
              <div className="ov">
                <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">{editTarifa?"✏️ Editar Tarifa":"➕ Nueva Tarifa"}</div><button className="mcl" onClick={()=>setShowNewTarifa(false)}>✕</button></div>
                  <div className="sdiv">RUTA</div>
                  <div className="fgrid g4" style={{marginBottom:10}}>
                    <div className="fg"><div className="fl">País Origen</div><input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={tafForm.paisOrig} onChange={e=>setTafForm(p=>({...p,paisOrig:e.target.value.toUpperCase()}))} placeholder="Ej: 01"/></div>
                    <div className="fg"><div className="fl">Ciudad Origen</div><input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={tafForm.ciudadOrig} onChange={e=>setTafForm(p=>({...p,ciudadOrig:e.target.value.toUpperCase()}))} placeholder="Ej: MIA"/></div>
                    <div className="fg"><div className="fl">País Destino</div><input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={tafForm.paisDest} onChange={e=>setTafForm(p=>({...p,paisDest:e.target.value.toUpperCase()}))} placeholder="Ej: 58"/></div>
                    <div className="fg"><div className="fl">Ciudad Destino</div><input className="fi" style={{fontFamily:"'DM Mono',monospace"}} value={tafForm.ciudadDest} onChange={e=>setTafForm(p=>({...p,ciudadDest:e.target.value.toUpperCase()}))} placeholder="Ej: CCS"/></div>
                  </div>
                  <div className="sdiv">TARIFA</div>
                  <div className="fgrid g3" style={{marginBottom:10}}>
                    <div className="fg"><div className="fl">Tipo de Envío</div>
                      <select className="fs" value={tafForm.tipoEnvio} onChange={e=>setTafForm(p=>({...p,tipoEnvio:e.target.value,porLb:"",porFt3:""}))}>
                        <option value="">— Seleccionar —</option>
                        {SEND_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {formEsAereo&&<div className="fg"><div className="fl">Precio por lb ({cSym(tafForm.moneda)})</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porLb} onChange={e=>setTafForm(p=>({...p,porLb:e.target.value}))}/></div>}
                    {formEsMaritimo&&<div className="fg"><div className="fl">Precio por ft³ ({cSym(tafForm.moneda)})</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porFt3} onChange={e=>setTafForm(p=>({...p,porFt3:e.target.value}))}/></div>}
                    {!formEsAereo&&!formEsMaritimo&&tafForm.tipoEnvio&&<div className="fg"><div className="fl">Precio por lb ({cSym(tafForm.moneda)})</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porLb} onChange={e=>setTafForm(p=>({...p,porLb:e.target.value}))}/></div>}
                    <div className="fg"><div className="fl">Cargo mínimo ({cSym(tafForm.moneda)})</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.min} onChange={e=>setTafForm(p=>({...p,min:e.target.value}))}/></div>
                    <div className="fg"><div className="fl">Moneda</div><select className="fs" value={tafForm.moneda} onChange={e=>setTafForm(p=>({...p,moneda:e.target.value}))}><option>USD</option><option>EUR</option><option>VES</option><option>COP</option><option>MXN</option><option>ARS</option><option>CLP</option><option>PEN</option><option>BRL</option><option>DOP</option><option>PAB</option></select></div>
                  </div>
                  <div className="mft">
                    <button className="btn-s" onClick={()=>setShowNewTarifa(false)}>Cancelar</button>
                    <button className="btn-p" onClick={()=>{
                      if(!tafForm.tipoEnvio)return;
                      const porLbF=parseFloat(tafForm.porLb)||0;
                      const porFt3F=parseFloat(tafForm.porFt3)||0;
                      const minF=parseFloat(tafForm.min)||0;
                      if(editTarifa){
                        const updated={...editTarifa,...tafForm,porLb:porLbF,porFt3:porFt3F,min:minF};
                        setTarifas(p=>p.map(t=>t.id===editTarifa.id?updated:t));
                        dbUpsertTarifa(updated);
                        logAction("Actualizó tarifa",`${tafForm.paisOrig}-${tafForm.ciudadOrig} → ${tafForm.paisDest}-${tafForm.ciudadDest} · ${tafForm.tipoEnvio}`);
                      } else {
                        const existing=tarifas.find(t=>t.paisOrig===tafForm.paisOrig&&t.ciudadOrig===tafForm.ciudadOrig&&t.paisDest===tafForm.paisDest&&t.ciudadDest===tafForm.ciudadDest&&t.tipoEnvio===tafForm.tipoEnvio);
                        if(existing){
                          const updated={...existing,...tafForm,porLb:porLbF,porFt3:porFt3F,min:minF};
                          setTarifas(p=>p.map(t=>t.id===existing.id?updated:t));
                          dbUpsertTarifa(updated);
                        } else {
                          const nid=`T-${String(tarifas.length+1).padStart(3,"0")}`;
                          const nt={...tafForm,id:nid,porLb:porLbF,porFt3:porFt3F,min:minF,activo:true};
                          setTarifas(p=>[...p,nt]);
                          dbUpsertTarifa(nt);
                          logAction("Creó tarifa",`${tafForm.paisOrig}-${tafForm.ciudadOrig} → ${tafForm.paisDest}-${tafForm.ciudadDest} · ${tafForm.tipoEnvio}`);
                        }
                      }
                      setShowNewTarifa(false);setEditTarifa(null);
                    }}>Guardar ✅</button>
                  </div>
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

  // Permisos de tracking por rol
  const trkCanUpdate=["A","B","C","D","D1","D2"].includes(currentUser.rol);
  const trkCanOrigin=["A","B","C","D","D1"].includes(currentUser.rol);   // estados 1-7
  const trkCanDest=["A","B","C","D","D2"].includes(currentUser.rol);     // estados 8-12P

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
      (w.tracking||"").toLowerCase().includes(trkSearch.toLowerCase())||
      (w.consignee||"").toLowerCase().includes(trkSearch.toLowerCase())||
      (w.casillero||"").toLowerCase().includes(trkSearch.toLowerCase())
    ).slice(0,30):[];

    return (
      <div className="page-scroll">
        {/* HEADER */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)"}}>🔍 Tracking Internacional</div>
            <div style={{fontSize:14,color:"var(--t3)",marginTop:2}}>Seguimiento y actualización de estados por WR</div>
          </div>
          {trkCanUpdate&&(
            <button className={`btn-${trkMassivo?"s":"p"}`} onClick={()=>{setTrkMassivo(p=>!p);setTrkMassResult(null);}}>
              {trkMassivo?"✕ Cancelar":"⚡ Actualización Masiva"}
            </button>
          )}
        </div>

        {/* ACTUALIZACIÓN MASIVA */}
        {trkMassivo&&(
          <div style={{background:"var(--bg2)",border:"2px solid var(--navy)",borderRadius:12,padding:"16px",marginBottom:14}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)",marginBottom:12}}>⚡ Actualización Masiva de Estados</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div className="fg">
                <div className="fl">N° WR o Tracking (uno por línea, coma o punto y coma)</div>
                <textarea className="ft" style={{minHeight:100,fontFamily:"'DM Mono',monospace",fontSize:14}} value={trkMassIds} onChange={e=>setTrkMassIds(e.target.value)} placeholder={"01MI58VL0000001\n01MI58VL0000002\n01MI58VL0000003"}/>
              </div>
              <div>
                <div className="fl" style={{marginBottom:8}}>Nuevo Estado</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,maxHeight:160,overflowY:"auto"}}>
                  {WR_STATUSES.filter(s=>statusAllowed(s)).map(s=>(
                    <button key={s.code} onClick={()=>setTrkMassStatus(s)}
                      className={`btn-${trkMassStatus?.code===s.code?"p":"s"}`}
                      style={{fontSize:13,padding:"4px 10px"}}>
                      {s.code} {s.label}
                    </button>
                  ))}
                </div>
                <div className="fg" style={{marginTop:10}}>
                  <div className="fl">Nota / Observación (opcional)</div>
                  <input className="fi" value={trkMassNota} onChange={e=>setTrkMassNota(e.target.value)} placeholder="Ej: Liberado por aduana, vuelo AA1234…"/>
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button className="btn-p" onClick={applyMassivo} disabled={!trkMassStatus||!trkMassIds.trim()} style={{opacity:(!trkMassStatus||!trkMassIds.trim())?0.5:1}}>
                ✅ Aplicar a todos
              </button>
              {trkMassResult&&(
                <div style={{fontSize:14}}>
                  <span style={{color:"var(--green)",fontWeight:700}}>✓ {trkMassResult.ok} actualizados</span>
                  {trkMassResult.fail.length>0&&<span style={{color:"var(--red)",marginLeft:10}}>✗ No encontrados: {trkMassResult.fail.join(", ")}</span>}
                </div>
              )}
            </div>
          </div>
        )}

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
          <div style={{fontSize:14,color:"var(--t3)",marginTop:2}}>Recogidas a domicilio programadas</div>
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
        <div style={{fontSize:15,color:"var(--t3)",marginBottom:16}}>Ingresa las medidas y peso para obtener un estimado de costo.</div>

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
        {!calcResult&&(
          <div style={{textAlign:"center",padding:"40px",color:"var(--t3)",fontSize:16}}>
            Ingresa las medidas y peso para ver el estimado 👆
          </div>
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
  ];
  const REC_TYPES=[
    {k:"cliente",l:"Cliente (consignatario)"},
    {k:"agente",l:"Agente"},
    {k:"autonomo",l:"Autónomo"},
    {k:"oficina",l:"Oficina"},
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

  const emptyLinea=()=>({descripcion:"",cantidad:1,precio:0,total:0});
  const emptyFactura=()=>({
    id:"",numero:0,tipo:"factura",
    fecha:new Date(),fechaEmision:null,status:"borrador",moneda:"USD",
    receptorTipo:"cliente",receptorId:"",
    receptorNombre:"",receptorDoc:"",receptorDir:"",receptorTel:"",receptorEmail:"",receptorCasillero:"",
    lineas:[emptyLinea()],
    subtotal:0,descuento:0,total:0,pagado:0,saldo:0,
    wrIds:[],guiaIds:[],ncFacturaOrigen:"",
    notas:"",condiciones:"Pago contado. Después de 15 días, aplica recargo por mora.",
    usuario:currentUser.id||currentUser.email||"",motivoAnulacion:"",fechaAnulacion:null,
  });

  const recalcFactura=(f)=>{
    const lineas=(f.lineas||[]).map(l=>({...l,total:(parseFloat(l.cantidad)||0)*(parseFloat(l.precio)||0)}));
    const subtotal=lineas.reduce((s,l)=>s+l.total,0);
    const descuento=parseFloat(f.descuento)||0;
    const total=Math.max(0,subtotal-descuento);
    const pagado=parseFloat(f.pagado)||0;
    const saldo=Math.max(0,total-pagado);
    return{...f,lineas,subtotal,total,saldo};
  };

  const facOpenNew=(prefill={})=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para crear facturas.");return;}
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
    setFacModal(null);
  };
  const facAnular=(f)=>{
    if(!hasPerm("anular_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso para anular facturas.");return;}
    if(f.status==="anulada"){window.alert("Ya está anulada.");return;}
    if(f.pagado>0){window.alert("No puedes anular una factura con pagos. Anula los pagos primero o emite una nota de crédito.");return;}
    const motivo=window.prompt(`Anular factura ${f.id}.\nMotivo:`);
    if(!motivo)return;
    const upd={...f,status:"anulada",motivoAnulacion:motivo,fechaAnulacion:new Date()};
    setFacturas(p=>p.map(x=>x.id===f.id?upd:x));
    dbUpsertFactura(upd);
    logAction("Anuló factura",`${f.id} — ${motivo}`);
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
  const pagoBuildId=()=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    const prefix=`PG-${y}${m}${dd}`;
    const sameDay=pagos.filter(p=>String(p.id).startsWith(prefix));
    return`${prefix}-${String(sameDay.length+1).padStart(3,"0")}`;
  };
  const pagoOpen=(factura)=>{
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
    setPagoModal(null);
  };
  const pagoAnular=(pago)=>{
    if(!hasPerm("anular_pago")&&!hasPerm("cobrar")){window.alert("Tu rol no tiene permiso para anular pagos.");return;}
    if(pago.anulado){window.alert("Ya está anulado.");return;}
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
    }
    logAction("Anuló pago",`${pago.id} — ${motivo}`);
  };

  // ── Nota de crédito (crea una factura tipo "nota_credito" ligada a una origen) ─
  const ncOpen=(facturaOrigen)=>{
    if(!hasPerm("nota_credito")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso.");return;}
    if(facturaOrigen.status==="anulada"){window.alert("La factura origen está anulada.");return;}
    setNcModal({facturaOrigenId:facturaOrigen.id,monto:facturaOrigen.saldo||facturaOrigen.total,motivo:"",notas:""});
  };
  const ncSubmit=()=>{
    const m=ncModal; if(!m)return;
    const orig=facturas.find(f=>f.id===m.facturaOrigenId); if(!orig)return;
    const monto=parseFloat(m.monto); if(!monto||monto<=0){window.alert("Monto inválido.");return;}
    if(monto>orig.total){window.alert("Monto excede el total de la factura origen.");return;}
    const nc={
      ...emptyFactura(),
      id:buildFacturaId(nextInvoiceNum),numero:nextInvoiceNum,
      tipo:"nota_credito",status:"emitida",
      fecha:new Date(),fechaEmision:new Date(),
      moneda:orig.moneda,
      receptorTipo:orig.receptorTipo,receptorId:orig.receptorId,
      receptorNombre:orig.receptorNombre,receptorDoc:orig.receptorDoc,receptorDir:orig.receptorDir,
      receptorTel:orig.receptorTel,receptorEmail:orig.receptorEmail,receptorCasillero:orig.receptorCasillero,
      lineas:[{descripcion:`Nota de crédito a factura ${orig.id}${m.motivo?` — ${m.motivo}`:""}`,cantidad:1,precio:-monto,total:-monto}],
      subtotal:-monto,total:-monto,pagado:0,saldo:0,
      ncFacturaOrigen:orig.id,notas:m.notas||"",
      usuario:currentUser.id||currentUser.email||"",
    };
    setFacturas(p=>[nc,...p]);
    dbUpsertFactura(nc);
    setNextInvoiceNum(n=>{const nn=n+1;dbSetConfig('factura_sec_next',String(nn));return nn;});
    // Ajustar saldo de la factura origen (reducir lo acreditado)
    const nuevoPagado=(parseFloat(orig.pagado)||0)+monto; // se toma como "compensado"
    const nuevoSaldo=Math.max(0,orig.total-nuevoPagado);
    const nuevoStatus=nuevoSaldo<=0.001?"pagada":"pagada_parcial";
    const updOrig={...orig,pagado:nuevoPagado,saldo:nuevoSaldo,status:nuevoStatus};
    setFacturas(p=>p.map(f=>f.id===orig.id?updOrig:f));
    dbUpsertFactura(updOrig);
    logAction("Nota de crédito",`${nc.id} − ${fmtMoney(monto,nc.moneda)} → ${orig.id}`);
    setNcModal(null);
  };

  // ── Generar factura desde una guía consolidada ─────────────────────────────
  const facFromGuia=(guia)=>{
    if(!hasPerm("crear_factura")&&!hasPerm("facturar")){window.alert("Tu rol no tiene permiso.");return;}
    const allWR=(guia.containers||[]).flatMap(c=>c.wr||[]);
    if(allWR.length===0){window.alert("La guía no tiene WR.");return;}
    // Agrupar por cliente (casillero); una factura por cliente
    const porCliente={};
    allWR.forEach(w=>{
      const key=w.clienteId||w.casillero||w.consignee||"sin_cliente";
      if(!porCliente[key])porCliente[key]={clienteId:w.clienteId||"",casillero:w.casillero||"",consignee:w.consignee||"",wrs:[]};
      porCliente[key].wrs.push(w);
    });
    const prev=facturas.length>0?facturas[0]:null;
    let seq=nextInvoiceNum;
    const nuevas=[];
    Object.values(porCliente).forEach(grp=>{
      const cli=grp.clienteId?clients.find(c=>c.id===grp.clienteId):null;
      const rec=cli?lookupReceptor("cliente",cli.id):null;
      const fleteTotal=grp.wrs.reduce((s,w)=>s+(parseFloat(w.cargos?.find?.(c=>c.concepto==="Flete"||c.tipo==="flete")?.monto)||0),0);
      const lineas=[
        {descripcion:`Flete internacional — Guía ${guia.id} (${grp.wrs.length} WR)`,cantidad:1,precio:fleteTotal,total:fleteTotal},
      ];
      const fact={
        ...emptyFactura(),
        id:buildFacturaId(seq),numero:seq,
        tipo:"factura",status:"borrador",moneda:"USD",
        fecha:new Date(),fechaEmision:null,
        receptorTipo:"cliente",receptorId:cli?.id||"",
        receptorNombre:rec?.nombre||grp.consignee,
        receptorDoc:rec?.doc||"",receptorDir:rec?.dir||"",
        receptorTel:rec?.tel||"",receptorEmail:rec?.email||"",
        receptorCasillero:rec?.casillero||grp.casillero||"",
        lineas,
        wrIds:grp.wrs.map(w=>w.id),
        guiaIds:[guia.id],
        notas:`Factura auto-generada desde guía ${guia.id}. Revisa líneas antes de emitir.`,
        usuario:currentUser.id||currentUser.email||"",
      };
      nuevas.push(recalcFactura(fact));
      seq++;
    });
    setFacturas(p=>[...nuevas,...p]);
    nuevas.forEach(f=>dbUpsertFactura(f));
    setNextInvoiceNum(seq);
    dbSetConfig('factura_sec_next',String(seq));
    logAction("Generó borradores de guía",`${guia.id} → ${nuevas.length} facturas`);
    window.alert(`✅ ${nuevas.length} borradores creados. Revisa y emite uno por uno desde "Facturas".`);
  };

  const renderContabilidad=()=>{
    const CTABS=[
      {k:"facturas",l:"📄 Facturas"},
      {k:"cxc",l:"💰 Por Cobrar"},
      {k:"pagos",l:"✅ Pagos"},
      {k:"generar",l:"⚡ Generar de Guía"},
      {k:"reporte",l:"📊 Reporte"},
    ];
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
          {[
            ["📄","Total Facturas",facturas.length,"var(--navy)"],
            ["💰","Por Cobrar",fmtMonyBoth(totalPorCobrar),"var(--orange)"],
            ["✅","Pagado",fmtMonyBoth(totalPagado),"var(--green)"],
            ["📊","Facturado",fmtMonyBoth(totalFacturado),"var(--cyan)"],
          ].map(([ic,l,v,c])=>(
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
              <select className="fi" value={facFilter.receptorTipo} onChange={e=>setFacFilter(p=>({...p,receptorTipo:e.target.value}))} style={{fontSize:14,padding:"6px 10px"}}>
                <option value="">Todos los receptores</option>
                {REC_TYPES.map(r=><option key={r.k} value={r.k}>{r.l}</option>)}
              </select>
              {(hasPerm("crear_factura")||hasPerm("facturar"))&&<button className="btn-p" onClick={()=>facOpenNew()}>+ Nueva Factura</button>}
            </div>
            <div className="card" style={{padding:0}}>
              {facFilt.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay facturas con esos filtros. {(hasPerm("crear_factura")||hasPerm("facturar"))&&<>Crea la primera con <b>+ Nueva Factura</b> o desde <b>Generar de Guía</b>.</>}</div>:(
                <table className="ct">
                  <thead><tr>
                    <th>N° Factura</th><th>Tipo</th><th>Fecha</th><th>Receptor</th>
                    <th>Mon</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Estado</th><th style={{minWidth:160}}>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {facFilt.map(f=>{
                      const negativa=f.tipo==="nota_credito";
                      return(
                        <tr key={f.id}>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:14}}>{f.id}</span>{f.ncFacturaOrigen&&<div style={{fontSize:11,color:"var(--purple)",fontFamily:"'DM Mono',monospace"}}>← {f.ncFacturaOrigen}</div>}</td>
                          <td><span style={{fontSize:12,padding:"2px 6px",borderRadius:4,background:f.tipo==="nota_credito"?"var(--purple)":(f.tipo==="proforma"?"var(--gold2)":"var(--cyan)"),color:"#fff",fontWeight:700}}>{f.tipo==="nota_credito"?"NC":f.tipo==="proforma"?"PRF":"FAC"}</span></td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtDate(f.fecha)}</td>
                          <td style={{fontWeight:600}}>{f.receptorNombre||"—"}<div style={{fontSize:12,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{f.receptorCasillero||f.receptorDoc||""}</div></td>
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

        {/* ── CUENTAS POR COBRAR ── */}
        {contabTab==="cxc"&&(()=>{
          const cxc=facturas.filter(f=>(f.status==="emitida"||f.status==="pagada_parcial")&&f.tipo!=="nota_credito")
            .map(f=>({...f,_dias:Math.floor((new Date()-new Date(f.fechaEmision||f.fecha))/(1000*60*60*24))}))
            .sort((a,b)=>b._dias-a._dias);
          return(
            <div>
              {cxc.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay cuentas pendientes. ✅</div>:(
                <div className="card" style={{padding:0}}>
                  <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)"}}>💰 Cuentas por Cobrar</span>
                    <span style={{fontSize:14,color:"var(--orange)",fontWeight:700,marginLeft:"auto"}}>Total pendiente: {fmtMonyBoth(totalPorCobrar)}</span>
                  </div>
                  <table className="ct">
                    <thead><tr><th>Factura</th><th>Receptor</th><th>Emitida</th><th>Mon</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Días</th><th>Acc.</th></tr></thead>
                    <tbody>
                      {cxc.map(f=>{
                        const dias=f._dias;
                        return (
                          <tr key={f.id}>
                            <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:"var(--navy)"}}>{f.id}</span></td>
                            <td style={{fontWeight:600}}>{f.receptorNombre||"—"}<div style={{fontSize:12,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{f.receptorCasillero||f.receptorDoc||""}</div></td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtDate(f.fechaEmision||f.fecha)}</td>
                            <td style={{textAlign:"center",fontWeight:700}}>{f.moneda}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>{fmtMoney(f.total,f.moneda)}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--green)"}}>{fmtMoney(f.pagado,f.moneda)}</td>
                            <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--orange)"}}>{fmtMoney(f.saldo,f.moneda)}</td>
                            <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:dias>30?"var(--red)":dias>15?"var(--orange)":"var(--t1)"}}>{dias}d</span></td>
                            <td>
                              <button className="btn-s" style={{fontSize:12,padding:"3px 6px",marginRight:4}} onClick={()=>setFacPrint(f)}>🖨️</button>
                              {(hasPerm("registrar_pago")||hasPerm("cobrar"))&&<button className="btn-p" style={{fontSize:12,padding:"3px 8px"}} onClick={()=>pagoOpen(f)}>💵 Cobrar</button>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── PAGOS REGISTRADOS ── */}
        {contabTab==="pagos"&&(
          <div className="card" style={{padding:0}}>
            {pagos.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay pagos registrados aún.</div>:(
              <table className="ct">
                <thead><tr><th>N° Pago</th><th>Factura</th><th>Mon</th><th>Monto</th><th>Tipo Pago</th><th>Referencia</th><th>Nota</th><th>Fecha</th><th>Estado</th><th>Acc.</th></tr></thead>
                <tbody>
                  {pagos.map(p=>{
                    const tipoLbl=(PAY_METHODS.find(m=>m.k===p.tipoPago)||{l:p.tipoPago||"—"}).l;
                    return(
                      <tr key={p.id} style={p.anulado?{opacity:.55,textDecoration:"line-through"}:{}}>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:"var(--navy)"}}>{p.id}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{p.facturaId}</td>
                        <td style={{textAlign:"center",fontWeight:700}}>{p.moneda||"USD"}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--green)",fontSize:15}}>{fmtMoney(p.monto,p.moneda)}</td>
                        <td style={{fontWeight:600,fontSize:13}}>{tipoLbl}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--t2)"}}>{p.referencia||"—"}</td>
                        <td style={{fontSize:12,color:"var(--t2)",maxWidth:180,whiteSpace:"normal"}}>{p.notaReferencial||"—"}</td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtDate(p.fecha)} {fmtTime(p.fecha)}</td>
                        <td>{p.anulado?<span className="st s1"><span className="st-dot"/>Anulado</span>:<span className="st s3"><span className="st-dot"/>Activo</span>}</td>
                        <td>{!p.anulado&&(hasPerm("anular_pago")||hasPerm("cobrar"))&&<button className="btn-s" style={{fontSize:12,padding:"3px 6px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>pagoAnular(p)}>✕ Anular</button>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── GENERAR DE GUÍA ── */}
        {contabTab==="generar"&&(
          <div>
            <div style={{fontSize:15,color:"var(--t2)",marginBottom:12}}>Selecciona una guía consolidada para generar borradores de factura por consignatario. Luego revisa cada borrador y emítelo.</div>
            {consolList.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay guías consolidadas. Primero crea un embarque en Consolidación.</div>:(
              <div className="card" style={{padding:0}}>
                <table className="ct">
                  <thead><tr><th>N° Guía</th><th>Destino</th><th>Fecha</th><th>WR</th><th>Tipo Envío</th><th>Borradores ya creados</th><th>Acc.</th></tr></thead>
                  <tbody>
                    {consolList.map(g=>{
                      const yaFact=facturas.filter(f=>(f.guiaIds||[]).includes(g.id));
                      return (
                        <tr key={g.id}>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:14}}>{g.id}</span></td>
                          <td style={{fontWeight:600}}>{g.destino}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtDate(g.fecha)}</td>
                          <td style={{textAlign:"center",fontWeight:700}}>{g.totalWR}</td>
                          <td><TypeBadge t={g.tipoEnvio}/></td>
                          <td>{yaFact.length>0?<span style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{yaFact.length} factura(s)</span>:<span style={{fontSize:13,color:"var(--t3)"}}>—</span>}</td>
                          <td>
                            {(hasPerm("crear_factura")||hasPerm("facturar"))&&<button className="btn-p" style={{fontSize:12,padding:"3px 10px"}} onClick={()=>facFromGuia(g)}>⚡ Generar Borradores</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
  const openWRModalAsReempaque=(parentIds,clientePrefill)=>{
    if(!hasPerm("crear_reempaque")){window.alert("Tu rol no tiene permiso para crear reempaques.");return;}
    if(!parentIds||parentIds.length===0){window.alert("Selecciona al menos un WR para reempacar.");return;}
    const c=clientePrefill||null;
    setWrf({...emptyWRF(),
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
    setWrf({...emptyWRF(),
      consignee:fullName(c),
      casilleroSearch:c.casillero||"",
      casillero:c.casillero||"",
      clienteId:c.id,
    });
    setEditWR(null);
    setShowNewWR(true);
  };
  const renderReempaque=()=>{
    // Candidatos: WR en origen no consolidados y no ya reempacados
    const q=(rpqSearch||"").toLowerCase().trim();
    const candidatos=wrList.filter(w=>{
      const c=w.status?.code||"1";
      if(["2.3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","18.1","19","20","21","22","23"].includes(c))return false;
      if(!q)return true;
      return [w.id,w.consignee,w.casillero,w.tracking,w.descripcion].some(v=>String(v||"").toLowerCase().includes(q));
    });
    const yaReempacados=wrList.filter(w=>w.status?.code==="2.3").slice(0,50);
    const toggleSel=(id)=>setRpqSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    return (
      <div className="page-scroll">
        <div className="card" style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:10}}>
            <div style={{fontSize:17,fontWeight:700,color:"var(--navy)"}}>🔁 Reempaque de WR</div>
            <div style={{fontSize:13,color:"var(--t3)"}}>Selecciona los WR a reempacar y crea un WR nuevo que los agrupe.</div>
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
                      <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.descripcion||"—"}</td>
                      <td><StBadge st={w.status}/></td>
                      <td style={{textAlign:"right",fontWeight:700}}>{w.cajas||0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {yaReempacados.length>0&&(
          <div className="card">
            <div style={{fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:8}}>📜 Histórico — Últimos WR Reempacados</div>
            <div style={{maxHeight:"28vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
              <table className="wt">
                <thead><tr><th>N° WR</th><th>Consignatario</th><th>Fecha</th><th>Reempacado en</th><th>Estado</th></tr></thead>
                <tbody>
                  {yaReempacados.map(w=>(
                    <tr key={w.id}>
                      <td><span className="c-wr">{w.id}</span></td>
                      <td>{w.consignee||"—"}</td>
                      <td>{fmtDate(w.fecha)}</td>
                      <td><span className="c-wr" style={{borderColor:"var(--teal)",color:"var(--teal)"}}>{w.reempacadoEn||"—"}</span></td>
                      <td><StBadge st={w.status}/></td>
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

  // ── RECEPCIÓN EN DESTINO ────────────────────────────────────────────────────
  // Permite recibir (manual o por escaneo) mercancía que llegó a destino:
  // cambia el WR de su estado actual (usualmente 16 Liberado / 14 Aduana / etc.)
  // al estado 17 Almacén. También acepta escaneo directo por N° WR o tracking.
  const recibirEnDestino=(w,nota="Recibido en destino")=>{
    if(!w)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para registrar recepciones en destino.");return;}
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
      const guia=consolList.find(c=>String(c.id).toUpperCase()===v);
      if(guia){
        if(guia.archivada){window.alert(`La guía ${guia.id} ya fue recibida y archivada.`);setRdScan("");return;}
        recibirGuiaCompleta(guia,`Recepción por escaneo de guía (${v})`);
        setRdScan("");
        return;
      }
    }
    // 2) Buscar WR por N° o tracking
    const match=wrList.find(w=>String(w.id).toUpperCase()===v||String(w.tracking||"").toUpperCase()===v);
    if(!match){window.alert(`No se encontró WR ni guía con "${v}".`);return;}
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
    if(w.status?.code==="18"||w.status?.code==="18.1"){window.alert(`El WR ${w.id} ya está marcado como faltante.`);return;}
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
      return !["17","18","18.1","19","20","21","22","23","25"].includes(c);
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
    window.alert(`✅ Guía ${guia.id} cerrada.\n${recibidos.length} WR pasaron a Por Entrega (20).`);
  };
  // Marca como recibidos (17 Almacén) todos los WR de una guía, en un paso.
  // NO archiva la guía — la archivación requiere `cerrarRecepcionGuia` (paso 2).
  // Sólo afecta a WRs que aún no estén en 17/18/18.1/19 (respeta faltantes y sobrantes).
  const recibirGuiaCompleta=(guia,nota="Recepción de guía completa en almacén")=>{
    if(!guia)return;
    if(!hasPerm("hacer_recepcion_dest")){window.alert("Tu rol no tiene permiso para registrar recepciones en destino.");return;}
    const st=getStatus("17");
    const allWrIds=(guia.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id));
    if(allWrIds.length===0){window.alert(`La guía ${guia.id} no tiene WRs asociados.`);return;}
    let cambiados=0;
    setWrList(p=>p.map(w=>{
      if(!allWrIds.includes(w.id))return w;
      // respetar WRs ya procesados (Almacén, Faltante, Investigación, Sobrante, Por Entrega, etc.)
      if(["17","18","18.1","19","20","21","22","23","25"].includes(w.status?.code||""))return w;
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
  // Al crear: todos los WRs pasan a estado 25 Egresado. Elegible solo desde 20 Por Entrega
  // (lo habitual) o 17 Almacén (egreso directo sin pasar por Por Entrega).
  const crElegible=(w)=>["17","20"].includes(w.status?.code||"");
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
    // Revertir WRs a 20 Por Entrega
    const st20=getStatus("20");
    setWrList(p=>p.map(w=>{
      if(!cr.wrIds.includes(w.id))return w;
      if(w.status?.code!=="25")return w; // si ya avanzó, no revertir
      const u={...w,status:st20,historial:[...(w.historial||[]),{code:"20",label:"Por Entrega",fecha:new Date(),user:currentUser.id,nota:`Egreso ${cr.id} anulado: ${motivo}`}]};
      dbUpsertWR(u);
      return u;
    }));
    logAction("Anuló egreso",`${cr.id} — ${motivo}`);
  };
  const crDelete=(cr)=>{
    if(!hasPerm("borrar_egreso")){window.alert("Tu rol no tiene permiso para borrar egresos.");return;}
    if(!window.confirm(`¿Borrar permanentemente el egreso ${cr.id}? Esto NO revierte los estados de los WR. Si quieres deshacer, usa "Anular" en vez de borrar.`))return;
    setCargoReleases(p=>p.filter(c=>c.id!==cr.id));
    dbDeleteCargoRelease(cr.id);
    logAction("Borró egreso",cr.id);
  };

  // ── Delivery Notes (Notas de Entrega) ───────────────────────────────────────
  // Al crear: los WR pasan a estado 21 Entregado. Elegible: 20 Por Entrega y 25 Egresado
  // (por ejemplo, cuando el agente de carga ya llevó la mercancía y solo queda confirmar
  // la entrega firmada por el cliente final).
  const dnElegible=(w)=>["20","25"].includes(w.status?.code||"");
  const dnBuildId=()=>{
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
    const prefix=`NE-${y}${m}${dd}`;
    const sameDay=deliveryNotes.filter(n=>String(n.id).startsWith(prefix));
    const n=String(sameDay.length+1).padStart(3,"0");
    return `${prefix}-${n}`;
  };
  const dnOpenNew=(preselectedIds=[])=>{
    if(!hasPerm("entregar")){window.alert("Tu rol no tiene permiso para registrar entregas.");return;}
    // Intentar auto-completar consignatario/clienteId si todos los WR preseleccionados son del mismo cliente
    let auto={consignatario:"",clienteId:"",direccionEntrega:""};
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
    }
    setDnModal({wrIds:preselectedIds,consignatario:auto.consignatario,clienteId:auto.clienteId,receptorNombre:"",receptorDocumento:"",receptorTelefono:"",direccionEntrega:auto.direccionEntrega,metodoEntrega:"retiro_oficina",transportista:"",notas:"",editId:null});
  };
  const dnOpenEdit=(dn)=>{
    if(!hasPerm("editar_entrega")){window.alert("Tu rol no tiene permiso para editar entregas.");return;}
    setDnModal({wrIds:dn.wrIds||[],consignatario:dn.consignatario||"",clienteId:dn.clienteId||"",receptorNombre:dn.receptorNombre||"",receptorDocumento:dn.receptorDocumento||"",receptorTelefono:dn.receptorTelefono||"",direccionEntrega:dn.direccionEntrega||"",metodoEntrega:dn.metodoEntrega||"retiro_oficina",transportista:dn.transportista||"",notas:dn.notas||"",editId:dn.id});
  };
  const dnSubmit=()=>{
    const f=dnModal; if(!f)return;
    if(!f.consignatario.trim()){window.alert("El consignatario es obligatorio.");return;}
    if(!f.receptorNombre.trim()){window.alert("El nombre del receptor es obligatorio.");return;}
    if(!f.wrIds||f.wrIds.length===0){window.alert("Agrega al menos 1 WR a la nota de entrega.");return;}
    const editing=!!f.editId;
    const id=editing?f.editId:dnBuildId();
    const now=new Date();
    const dn={
      id,fecha:editing?(deliveryNotes.find(n=>n.id===id)?.fecha||now):now,
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
    // Revertir WRs a 20 Por Entrega
    const st20=getStatus("20");
    setWrList(p=>p.map(w=>{
      if(!dn.wrIds.includes(w.id))return w;
      if(w.status?.code!=="21")return w; // si ya avanzó (22/23…), no revertir
      const u={...w,status:st20,historial:[...(w.historial||[]),{code:"20",label:"Por Entrega",fecha:new Date(),user:currentUser.id,nota:`Entrega ${dn.id} anulada: ${motivo}`}]};
      dbUpsertWR(u);
      return u;
    }));
    logAction("Anuló entrega",`${dn.id} — ${motivo}`);
  };
  const dnDelete=(dn)=>{
    if(!hasPerm("borrar_entrega")){window.alert("Tu rol no tiene permiso para borrar entregas.");return;}
    if(!window.confirm(`¿Borrar permanentemente la nota de entrega ${dn.id}? Esto NO revierte los estados de los WR. Si quieres deshacer, usa "Anular".`))return;
    setDeliveryNotes(p=>p.filter(n=>n.id!==dn.id));
    dbDeleteDeliveryNote(dn.id);
    logAction("Borró entrega",dn.id);
  };

  const renderRecepcionDest=()=>{
    const q=(rdSearch||"").toLowerCase().trim();
    // Guías activas (no archivadas): se muestran para selección manual o escaneo
    const guiasActivas=consolList.filter(c=>!c.archivada);
    const guiasArchivadas=consolList.filter(c=>c.archivada);
    const guiaSel=guiasActivas.find(c=>c.id===rdSelGuia);
    // WRs de la guía seleccionada
    const guiaWrIds=guiaSel?(guiaSel.containers||[]).flatMap(ct=>(ct.wr||[]).map(w=>w.id)):[];
    // Checklist completo de la guía (WRs en su estado actual, sean pre-destino, 17, 18, etc.)
    const checklist=guiaSel?wrList.filter(w=>guiaWrIds.includes(w.id)&&(!q||[w.id,w.consignee,w.casillero,w.tracking].some(v=>String(v||"").toLowerCase().includes(q)))):[];
    // Sobrantes detectados para esta guía (linkeados vía sobranteDeGuia)
    const sobrantesGuia=guiaSel?wrList.filter(w=>w.sobranteDeGuia===guiaSel.id&&w.status?.code==="19"):[];
    // Stats de la guía seleccionada
    const chkCode=(w)=>w.status?.code||"";
    const nRecibidos=checklist.filter(w=>chkCode(w)==="17").length;
    const nFaltantes=checklist.filter(w=>["18","18.1"].includes(chkCode(w))).length;
    const nPorEntrega=checklist.filter(w=>["20","21","22","23","25"].includes(chkCode(w))).length;
    const nPendientes=checklist.filter(w=>{const c=chkCode(w);return c&&!["17","18","18.1","19","20","21","22","23","25"].includes(c);}).length;
    // Candidatos globales (cuando NO hay guía seleccionada): WRs en tránsito destino o liberados
    const candidatos=wrList.filter(w=>{
      const c=w.status?.code||"";
      const esTransitoDest=["13","14","15","16","9.1","10.1","10.2"].includes(c);
      const puedoRecibir=esTransitoDest||["8","12"].includes(c);
      if(!puedoRecibir)return false;
      if(!q)return true;
      return [w.id,w.consignee,w.casillero,w.tracking].some(v=>String(v||"").toLowerCase().includes(q));
    });
    const enAlmacen=wrList.filter(w=>w.status?.code==="17").slice(0,30);
    // Render de las acciones por WR en el checklist — depende del estado actual
    const renderChkActions=(w)=>{
      const c=chkCode(w);
      if(!hasPerm("hacer_recepcion_dest"))return<span style={{fontSize:12,color:"var(--t4)"}}>—</span>;
      // Pre-destino (14/15/16/13/etc) o estados de tránsito
      if(!["17","18","18.1","19","20","21","22","23","25"].includes(c)){
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
      if(c==="18"){
        return(<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#C62828"}}>⚠️ Faltante</span>
          <button className="btn-s" style={{fontSize:11,padding:"3px 7px",background:"#FFF3E0",borderColor:"#FFB74D",color:"#E65100"}}
            onClick={()=>marcarInvestigacion(w)}>🔍 Investigar</button>
        </div>);
      }
      if(c==="18.1")return<span style={{fontSize:11,fontWeight:700,color:"#E65100"}}>🔍 En investigación</span>;
      if(c==="19")return<span style={{fontSize:11,fontWeight:700,color:"#7B1FA2"}}>➕ Sobrante</span>;
      return<span style={{fontSize:11,fontWeight:700,color:"var(--t3)"}}>{c} {w.status?.label||""}</span>;
    };
    return (
      <div className="page-scroll">
        {/* HEADER + TABS */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>📬 Recepción en Almacén</div>
            <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Recibe guías completas o WR individuales. Las guías recibidas se archivan automáticamente.</div>
          </div>
          <div style={{display:"flex",gap:4,background:"#EEF2F7",border:"1px solid #DCE2EC",borderRadius:8,padding:3}}>
            <button onClick={()=>setRdTab("pendientes")} style={{fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",background:rdTab==="pendientes"?"var(--navy)":"transparent",color:rdTab==="pendientes"?"#fff":"var(--t2)"}}>⏳ Pendientes ({guiasActivas.length})</button>
            <button onClick={()=>setRdTab("archivadas")} style={{fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",background:rdTab==="archivadas"?"var(--navy)":"transparent",color:rdTab==="archivadas"?"#fff":"var(--t2)"}}>📦 Archivadas ({guiasArchivadas.length})</button>
          </div>
        </div>

        {rdTab==="pendientes"&&<>
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
                    <option value="">— Todas las guías pendientes —</option>
                    {guiasActivas.map(c=>(<option key={c.id} value={c.id}>{c.id} · {c.destino} · {c.totalWR||0} WR · {c.status||"—"}</option>))}
                  </select>
                  {guiaSel&&hasPerm("hacer_recepcion_dest")&&(
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

          {/* CHECKLIST DE GUÍA SELECCIONADA */}
          {guiaSel&&(
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
              <div style={{maxHeight:"42vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
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
                        const rowBg=c==="17"?"#F1F8E9":["18","18.1"].includes(c)?"#FFF5F5":c==="19"?"#FAF4FC":["20","21","22","23","25"].includes(c)?"#F0F7FF":"";
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
                  <div style={{maxHeight:"20vh",overflow:"auto"}}>
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
                                <button className="btn-s" style={{fontSize:11,padding:"3px 7px",background:"#E3F2FD",borderColor:"#64B5F6",color:"#1565C0"}}
                                  onClick={()=>resolverSobrante(w,"20")}>🚚 A Por Entrega (20)</button>
                                <button className="btn-s" style={{fontSize:11,padding:"3px 7px"}}
                                  onClick={()=>resolverSobrante(w,"4")}>🔄 Próx. guía (4)</button>
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
          )}

          {/* LISTA GLOBAL (sin guía seleccionada) */}
          {!guiaSel&&(
            <div className="card" style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>⏳ WR pendientes en tránsito destino ({candidatos.length})</div>
                <div style={{fontSize:12,color:"var(--t3)"}}>Selecciona una guía arriba para ver el checklist completo.</div>
                <input className="fi" placeholder="Buscar…" value={rdSearch} onChange={e=>setRdSearch(e.target.value)} style={{fontSize:14,padding:"6px 10px",width:220,marginLeft:"auto"}}/>
              </div>
              <div style={{maxHeight:"40vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
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
              <div style={{fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:8}}>📦 Últimos WR recibidos en Almacén</div>
              <div style={{maxHeight:"28vh",overflow:"auto",border:"1px solid var(--b1)",borderRadius:8}}>
                <table className="wt">
                  <thead><tr><th>N° WR</th><th>Consignatario</th><th>Casillero</th><th>Tracking</th><th>Estado</th></tr></thead>
                  <tbody>
                    {enAlmacen.map(w=>(
                      <tr key={w.id}>
                        <td><span className="c-wr">{w.id}</span></td>
                        <td>{w.consignee||"—"}</td>
                        <td>{w.casillero||"—"}</td>
                        <td><span className="c-trk">{w.tracking||"—"}</span></td>
                        <td><StBadge st={w.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>}

        {rdTab==="archivadas"&&(
          <div className="card" style={{padding:0}}>
            {guiasArchivadas.length===0?(
              <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>Aún no hay guías recibidas/archivadas.</div>
            ):(
              <table className="ct">
                <thead><tr>
                  <th>N° Guía</th><th>Destino</th><th>Tipo</th><th>WR</th><th>Cajas</th>
                  <th>Peso lb</th><th>Ft³</th><th>Fecha creación</th><th>Recibida en almacén</th>
                  <th style={{width:130}}>Acciones</th>
                </tr></thead>
                <tbody>
                  {guiasArchivadas.map(c=>(
                    <tr key={c.id}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{c.id}</span></td>
                      <td style={{fontWeight:600,color:"var(--t1)"}}>{c.destino}</td>
                      <td><TypeBadge t={c.tipoEnvio}/></td>
                      <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.totalWR||0}</td>
                      <td style={{textAlign:"center"}}>{c.totalCajas||0}</td>
                      <td style={{fontFamily:"'DM Mono',monospace"}}>{c.totalLb||0}lb</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{c.totalFt3||0}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(c.fecha)}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--navy)",fontWeight:600}}>{fmtDate(c.fechaRecibidaAlmacen)}</td>
                      <td>
                        {hasPerm("editar_guia")&&(
                          <button className="btn-s" style={{fontSize:12,padding:"3px 8px"}} title="Desarchivar (volver a pendientes)"
                            onClick={()=>{
                              if(!window.confirm(`¿Desarchivar la guía ${c.id}? Volverá a pendientes pero los WR permanecerán en Almacén.`))return;
                              const upd={...c,archivada:false,fechaRecibidaAlmacen:null};
                              setConsolList(p=>p.map(x=>x.id===c.id?upd:x));
                              dbUpsertConsolidacion(upd);
                              logAction("Desarchivó guía",c.id);
                            }}>↩️ Desarchivar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── CARGO RELEASE RENDER ────────────────────────────────────────────────────
  const renderCargoRelease=()=>{
    const q=(crSearch||"").toLowerCase().trim();
    const activos=cargoReleases.filter(c=>!c.anulado);
    const anulados=cargoReleases.filter(c=>c.anulado);
    const lista=cargoReleases.filter(c=>!q||[c.id,c.agenteCarga,c.contacto,c.documento,c.vehiculo].some(v=>String(v||"").toLowerCase().includes(q)));
    return(
      <div className="page-scroll">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🚀 Cargo Release (Egresos)</div>
            <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Liberación de carga a agente/transportista. Los WR pasan a Egresado (25). Estado elegible: 17 Almacén o 20 Por Entrega.</div>
          </div>
          <div style={{display:"flex",gap:6,fontSize:13}}>
            <span style={{background:"#E8F5E9",color:"#2E7D32",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #A5D6A7"}}>✓ {activos.length} activos</span>
            <span style={{background:"#FFF3E0",color:"#E65100",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #FFCC80"}}>✕ {anulados.length} anulados</span>
          </div>
          {hasPerm("hacer_egreso")&&<button className="btn-p" onClick={()=>crOpenNew()}>➕ Nuevo Egreso</button>}
        </div>

        <div className="card" style={{marginBottom:10}}>
          <input className="fi" placeholder="Buscar por N° egreso, agente, contacto, documento, vehículo…"
            value={crSearch} onChange={e=>setCrSearch(e.target.value)} style={{fontSize:14,width:"100%",padding:"8px 12px"}}/>
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {lista.length===0?(
            <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>No hay egresos registrados.</div>
          ):(
            <table className="ct">
              <thead><tr>
                <th>N° Egreso</th><th>Fecha</th><th>Agente</th><th>Contacto</th><th>Vehículo</th>
                <th style={{textAlign:"center"}}>WR</th><th>Usuario</th><th>Estado</th><th style={{width:200}}>Acciones</th>
              </tr></thead>
              <tbody>
                {lista.map(c=>(
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
          )}
        </div>
      </div>
    );
  };

  const renderDeliveryNotes=()=>{
    const q=(dnSearch||"").toLowerCase().trim();
    const activas=deliveryNotes.filter(n=>!n.anulado);
    const anuladas=deliveryNotes.filter(n=>n.anulado);
    const lista=deliveryNotes.filter(n=>!q||[n.id,n.consignatario,n.receptorNombre,n.receptorDocumento,n.transportista].some(v=>String(v||"").toLowerCase().includes(q)));
    const metodoLabel={retiro_oficina:"🏢 Retiro oficina",domicilio:"🏠 Domicilio",transportista:"🚚 Transportista"};
    return(
      <div className="page-scroll">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Arial,Helvetica,sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>📝 Notas de Entrega</div>
            <div style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Entrega física al cliente final. Los WR pasan a Entregado (21). Estado elegible: 20 Por Entrega o 25 Egresado.</div>
          </div>
          <div style={{display:"flex",gap:6,fontSize:13}}>
            <span style={{background:"#E8F5E9",color:"#2E7D32",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #A5D6A7"}}>✓ {activas.length} activas</span>
            <span style={{background:"#FFF3E0",color:"#E65100",padding:"4px 10px",borderRadius:10,fontWeight:700,border:"1px solid #FFCC80"}}>✕ {anuladas.length} anuladas</span>
          </div>
          {hasPerm("entregar")&&<button className="btn-p" onClick={()=>dnOpenNew()}>➕ Nueva Entrega</button>}
        </div>

        <div className="card" style={{marginBottom:10}}>
          <input className="fi" placeholder="Buscar por N° nota, consignatario, receptor, documento, transportista…"
            value={dnSearch} onChange={e=>setDnSearch(e.target.value)} style={{fontSize:14,width:"100%",padding:"8px 12px"}}/>
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {lista.length===0?(
            <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>No hay entregas registradas.</div>
          ):(
            <table className="ct">
              <thead><tr>
                <th>N° Nota</th><th>Fecha</th><th>Consignatario</th><th>Receptor</th><th>Método</th>
                <th style={{textAlign:"center"}}>WR</th><th>Usuario</th><th>Estado</th><th style={{width:200}}>Acciones</th>
              </tr></thead>
              <tbody>
                {lista.map(n=>(
                  <tr key={n.id} style={{background:n.anulado?"#FFF5F5":""}}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:13}}>{n.id}</span></td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmtDate(n.fecha)} {fmtTime(n.fecha)}</td>
                    <td style={{fontWeight:600,color:"var(--t1)"}}>{n.consignatario||"—"}</td>
                    <td style={{fontSize:13,color:"var(--t2)"}}>{n.receptorNombre||"—"}{n.receptorDocumento?` · ${n.receptorDocumento}`:""}</td>
                    <td style={{fontSize:12,color:"var(--t2)"}}>{metodoLabel[n.metodoEntrega]||"—"}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{(n.wrIds||[]).length}</td>
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
                ))}
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
      {id:"wr",ic:"📦",l:"Warehouse Receipt",badge:String(filteredWR.length)},
      {id:"reempaque",ic:"🔁",l:"Reempaque"},
      {id:"consolidation",ic:"🗂️",l:"Consolidación"},
      {id:"recepciondest",ic:"📬",l:"Recepción en Almacén"},
      {id:"cargorelease",ic:"🚀",l:"Cargo Release"},
      {id:"entregas",ic:"📝",l:"Notas de Entrega"},
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
    {label:"Administración",items:[
      {id:"facturacion",ic:"🧾",l:"Facturación",onClick:()=>{setTab("contabilidad");setContabTab("facturas");},activeWhen:()=>tab==="contabilidad"&&contabTab==="facturas"},
      {id:"contabilidad",ic:"💰",l:"Contabilidad"},
    ]},
    {label:"Sistema",items:[
      {id:"alerts",ic:"🔔",l:"Alertas"},
      {id:"roles",ic:"🔐",l:"Roles & Permisos"},
      {id:"actividad",ic:"📋",l:"Registro de Actividad",onClick:()=>goSettingsTab("actividad"),activeWhen:()=>tab==="settings"&&cfgTab==="actividad"},
      ...(canAdmin?[{id:"settings",ic:"⚙️",l:"Configuración"}]:[]),
    ]},
  ];

  const PAGE_TITLES={dashboard:"Dashboard General",wr:"Warehouse Receipts",scan:"Recepción en Puerta",etiquetas:"Imprimir Etiquetas",clients:"Clientes & Usuarios",estadocuenta:"Estado de Cuenta",roles:"Roles & Permisos",consolidation:"Consolidación",tracking:"Tracking",pickup:"Pick-up",contabilidad:"Contabilidad",calculadora:"Calculadora de Envío",chat:"Chat Interno",docs:"Documentos",reports:"Reportes",alerts:"Alertas",settings:"Configuración",reempaque:"Reempaque",recepciondest:"Recepción en Destino",cargorelease:"Cargo Release (Egreso)",entregas:"Notas de Entrega"};

  const renderPage=()=>{
    switch(tab){
      case "dashboard":    try{return <div className="cnt">{renderDash()}</div>;}catch(e){return <div style={{padding:20,color:"red"}}><b>Dashboard error:</b><pre>{String(e)}</pre></div>;}
      case "wr":           return <div className="cnt" style={{display:"flex",flexDirection:"column",padding:"10px 0 0"}}>{renderWR()}</div>;
      case "scan":         return renderScan();
      case "etiquetas":    return renderEtiquetasPage();
      case "clients":      return renderClients();
      case "estadocuenta": return renderEstadoCuenta();
      case "consolidation":return renderConsolidacion();
      case "tracking":     return renderTracking();
      case "pickup":       return renderPickup();
      case "contabilidad": return renderContabilidad();
      case "calculadora":  return renderCalculadora();
      case "chat":         return <div className="cnt" style={{display:"flex",flexDirection:"column",overflow:"hidden",flex:1}}>{renderChat()}</div>;
      case "roles":        return renderRoles();
      case "settings":     return renderSettings();
      case "reempaque":    return renderReempaque();
      case "recepciondest":return renderRecepcionDest();
      case "cargorelease": return renderCargoRelease();
      case "entregas":     return renderDeliveryNotes();
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
          {navGroups.map(g=>(
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
          <button className="btn-d" style={{width:"100%",marginTop:8,fontSize:13,padding:"6px 10px"}} onClick={doLogout}>🚪 Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div className="tb-ttl">{PAGE_TITLES[tab]||tab}</div>
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
      {showNewWR&&renderNewWRModal()}
      {selWR&&renderWRDetail()}
      {showStatModal&&renderStatModal()}
      {webcamOpen&&<WebcamCaptureModal onClose={()=>setWebcamOpen(null)} onCapture={(file)=>{addFotosToCaja(webcamOpen.cajaIdx,[file],"webcam");setWebcamOpen(null);}}/>}
      {photoGalleryOpen&&<PhotoGalleryModal wrId={photoGalleryOpen.wrId} currentUser={currentUser} onClose={()=>setPhotoGalleryOpen(null)}/>}
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

      {showNewCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title="➕ Nuevo Registro" initial={{tipo:"cliente",clienteTipo:"matriz",primerNombre:"",segundoNombre:"",primerApellido:"",segundoApellido:"",cedula:"",dir:"",municipio:"",estado:"",pais:"",cp:"",tel1:"",tel2:"",email:"",casillero:"",rol:"I",password:""}} onClose={()=>setShowNewCl(false)} onSave={f=>{const esUser=f.tipo==="usuario";const prefix=esUser?"U":"C";const nextNum=clients.filter(c=>c.tipo===(esUser?"usuario":"cliente")).length+1;const newId=`${prefix}-${String(nextNum).padStart(3,"0")}`;const casillero=(!esUser&&!f.casillero)?newId:f.casillero;const newRec={...f,id:newId,casillero,clienteTipo:f.clienteTipo||"matriz"};setClients(p=>[...p,newRec]);dbUpsertCliente(newRec);setShowNewCl(false);logAction("Creó registro",`${newId} — ${f.primerNombre} ${f.primerApellido}`);}}/>}
      {showEditCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title={`✏️ Editar — ${fullName(showEditCl)}`} initial={showEditCl} onClose={()=>setShowEditCl(null)} onSave={f=>{setClients(p=>p.map(c=>c.id===f.id?f:c));dbUpsertCliente({...f,clienteTipo:f.clienteTipo||"matriz"});logAction("Editó registro",`${f.id} — ${f.primerNombre} ${f.primerApellido}`);setShowEditCl(null);}}/>}

      {/* ── Cargo Release — MODAL FORMULARIO ───────────────────────────────── */}
      {crModal&&(()=>{
        const f=crModal;
        const editing=!!f.editId;
        // WRs elegibles = 17 o 20, + los ya seleccionados (aunque estén en 25 por ser edit)
        const elegibles=wrList.filter(w=>crElegible(w)||f.wrIds.includes(w.id));
        const sel=f.wrIds.map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const qRef=f._q||"";
        const filtered=elegibles.filter(w=>{
          if(f.wrIds.includes(w.id))return false;
          if(!qRef)return true;
          const qq=qRef.toLowerCase();
          return [w.id,w.consignee,w.shipper,w.tracking,w.proNumber].some(v=>String(v||"").toLowerCase().includes(qq));
        }).slice(0,30);
        const agentesCarga=agentes.filter(a=>a.tipo==="transporte"||a.tipoAgente==="transporte"||!a.tipoAgente);
        return(
          <div className="modal-bg" onClick={()=>{}}>
            <div className="modal" style={{maxWidth:900,width:"94%"}} onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div>
                  <div className="mtitle">🚀 {editing?`Editar Egreso ${f.editId}`:"Nuevo Egreso (Cargo Release)"}</div>
                  <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>Los WR seleccionados pasarán a <b>Egresado (25)</b> al guardar.</div>
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
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Documento/Cédula</div>
                    <input className="fi" value={f.documento} onChange={e=>setCrModal(p=>({...p,documento:e.target.value}))} placeholder="V-12345678"/>
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
                  <div style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:4}}>➕ Agregar WR (elegibles: 17 Almacén, 20 Por Entrega)</div>
                  <input className="fi" placeholder="Buscar por WR, consignee, tracking…" value={qRef} onChange={e=>setCrModal(p=>({...p,_q:e.target.value}))} style={{marginBottom:6}}/>
                  <div style={{maxHeight:160,overflow:"auto",border:"1px solid #E0E7EF",borderRadius:4}}>
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
          <div className="modal-bg">
            <div className="modal" style={{maxWidth:900,width:"96%"}}>
              <div className="mhd no-print">
                <div className="mtitle">🖨️ Nota de Egreso — {cr.id}</div>
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
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Documento:</td><td style={{paddingBottom:3}}>{cr.documento||"—"}</td></tr>
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
      {dnModal&&(()=>{
        const f=dnModal;
        const editing=!!f.editId;
        const elegibles=wrList.filter(w=>dnElegible(w)||f.wrIds.includes(w.id));
        const sel=f.wrIds.map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const qRef=f._q||"";
        const filtered=elegibles.filter(w=>{
          if(f.wrIds.includes(w.id))return false;
          if(!qRef)return true;
          const qq=qRef.toLowerCase();
          return [w.id,w.consignee,w.shipper,w.tracking,w.proNumber].some(v=>String(v||"").toLowerCase().includes(qq));
        }).slice(0,30);
        const clientesMatriz=clients.filter(c=>c.tipo==="cliente");
        return(
          <div className="modal-bg">
            <div className="modal" style={{maxWidth:900,width:"94%"}} onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div>
                  <div className="mtitle">📝 {editing?`Editar Nota de Entrega ${f.editId}`:"Nueva Nota de Entrega"}</div>
                  <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>Los WR seleccionados pasarán a <b>Entregado (21)</b> al guardar.</div>
                </div>
                <button className="mcl" onClick={()=>setDnModal(null)}>✕</button>
              </div>
              <div className="mbd" style={{maxHeight:"72vh",overflow:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Cliente (casillero)</div>
                    <select className="fs" value={f.clienteId} onChange={e=>{
                      const cid=e.target.value;
                      const cli=clients.find(c=>c.id===cid);
                      setDnModal(p=>({
                        ...p,
                        clienteId:cid,
                        consignatario:cli?[cli.primerNombre,cli.segundoNombre,cli.primerApellido,cli.segundoApellido].filter(Boolean).join(" "):p.consignatario,
                        direccionEntrega:cli?[cli.dir,cli.municipio,cli.estado].filter(Boolean).join(", "):p.direccionEntrega,
                      }));
                    }} style={{width:"100%"}}>
                      <option value="">— Sin cliente asociado —</option>
                      {clientesMatriz.map(c=>(<option key={c.id} value={c.id}>{c.casillero||c.id} · {[c.primerNombre,c.primerApellido].filter(Boolean).join(" ")}</option>))}
                    </select>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Consignatario *</div>
                    <input className="fi" value={f.consignatario} onChange={e=>setDnModal(p=>({...p,consignatario:e.target.value}))} placeholder="Nombre del destinatario/empresa"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Receptor (persona que firma) *</div>
                    <input className="fi" value={f.receptorNombre} onChange={e=>setDnModal(p=>({...p,receptorNombre:e.target.value}))} placeholder="Nombre y apellido"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Documento/Cédula</div>
                    <input className="fi" value={f.receptorDocumento} onChange={e=>setDnModal(p=>({...p,receptorDocumento:e.target.value}))} placeholder="V-12345678"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Teléfono</div>
                    <input className="fi" value={f.receptorTelefono} onChange={e=>setDnModal(p=>({...p,receptorTelefono:e.target.value}))} placeholder="0414-1234567"/>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Método de entrega</div>
                    <select className="fs" value={f.metodoEntrega} onChange={e=>setDnModal(p=>({...p,metodoEntrega:e.target.value}))} style={{width:"100%"}}>
                      <option value="retiro_oficina">🏢 Retiro en oficina</option>
                      <option value="domicilio">🏠 Entrega a domicilio</option>
                      <option value="transportista">🚚 Transportista / Agente</option>
                    </select>
                  </div>
                </div>

                {f.metodoEntrega==="domicilio"&&(
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Dirección de entrega</div>
                    <input className="fi" value={f.direccionEntrega} onChange={e=>setDnModal(p=>({...p,direccionEntrega:e.target.value}))} placeholder="Av. Principal, Edif X, piso Y — Municipio, Estado"/>
                  </div>
                )}
                {f.metodoEntrega==="transportista"&&(
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Transportista / Agente</div>
                    <input className="fi" value={f.transportista} onChange={e=>setDnModal(p=>({...p,transportista:e.target.value}))} placeholder="MRW, Zoom, agente, etc."/>
                  </div>
                )}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:4}}>Notas</div>
                  <textarea className="fi" rows={2} value={f.notas} onChange={e=>setDnModal(p=>({...p,notas:e.target.value}))} placeholder="Observaciones de la entrega…" style={{resize:"vertical"}}/>
                </div>

                <div style={{background:"#F5F7FB",padding:10,borderRadius:6,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>📦 WR Seleccionados ({sel.length})</div>
                    {sel.length>0&&<button className="btn-s" style={{fontSize:12,padding:"2px 8px"}} onClick={()=>setDnModal(p=>({...p,wrIds:[]}))}>Limpiar todos</button>}
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
                          <button className="btn-s" style={{fontSize:11,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>setDnModal(p=>({...p,wrIds:p.wrIds.filter(id=>id!==w.id)}))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:4}}>➕ Agregar WR (elegibles: 20 Por Entrega, 25 Egresado)</div>
                  <input className="fi" placeholder="Buscar por WR, consignee, tracking…" value={qRef} onChange={e=>setDnModal(p=>({...p,_q:e.target.value}))} style={{marginBottom:6}}/>
                  <div style={{maxHeight:160,overflow:"auto",border:"1px solid #E0E7EF",borderRadius:4}}>
                    {filtered.length===0?(
                      <div style={{padding:10,color:"var(--t3)",fontSize:13,textAlign:"center"}}>No hay WR disponibles{qRef?` para "${qRef}"`:""}</div>
                    ):filtered.map(w=>(
                      <div key={w.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",borderBottom:"1px solid #EEF",fontSize:13,cursor:"pointer"}} onClick={()=>setDnModal(p=>({...p,wrIds:[...p.wrIds,w.id]}))}>
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
                <button className="btn-s" onClick={()=>setDnModal(null)}>Cancelar</button>
                <button className="btn-p" onClick={dnSubmit}>{editing?"💾 Guardar cambios":"📝 Crear Nota de Entrega"}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delivery Note — NOTA IMPRIMIBLE ─────────────────────────────────── */}
      {dnPrint&&(()=>{
        const dn=dnPrint;
        const wrs=(dn.wrIds||[]).map(id=>wrList.find(w=>w.id===id)).filter(Boolean);
        const totalCajas=wrs.reduce((s,w)=>s+(w.dims?.length||0),0);
        const totalLb=wrs.reduce((s,w)=>s+(w.dims||[]).reduce((a,d)=>a+parseFloat(d.pkLb||d.pk*2.205||0),0),0);
        const metodoLabel={retiro_oficina:"Retiro en oficina",domicilio:"Entrega a domicilio",transportista:"Transportista / Agente"};
        return(
          <div className="modal-bg">
            <div className="modal" style={{maxWidth:900,width:"96%"}}>
              <div className="mhd no-print">
                <div className="mtitle">🖨️ Nota de Entrega — {dn.id}</div>
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
                      <div style={{fontSize:11,color:"#555"}}>Nota de Entrega al Cliente</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700}}>N° {dn.id}</div>
                      <div style={{fontSize:12}}>Fecha: {fmtDate(dn.fecha)} {fmtTime(dn.fecha)}</div>
                      <div style={{fontSize:12}}>Usuario: {dn.usuario||"—"}</div>
                      {dn.anulado&&<div style={{fontSize:13,fontWeight:900,color:"#C62828",marginTop:4,border:"2px solid #C62828",padding:"2px 6px",display:"inline-block"}}>ANULADA</div>}
                    </div>
                  </div>

                  <table style={{width:"100%",fontSize:13,marginBottom:12}}>
                    <tbody>
                      <tr><td style={{fontWeight:700,width:140,paddingBottom:3}}>Consignatario:</td><td style={{paddingBottom:3}}>{dn.consignatario||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Receptor:</td><td style={{paddingBottom:3}}>{dn.receptorNombre||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Documento:</td><td style={{paddingBottom:3}}>{dn.receptorDocumento||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Teléfono:</td><td style={{paddingBottom:3}}>{dn.receptorTelefono||"—"}</td></tr>
                      <tr><td style={{fontWeight:700,paddingBottom:3}}>Método:</td><td style={{paddingBottom:3}}>{metodoLabel[dn.metodoEntrega]||"—"}</td></tr>
                      {dn.direccionEntrega&&<tr><td style={{fontWeight:700,paddingBottom:3,verticalAlign:"top"}}>Dirección:</td><td style={{paddingBottom:3}}>{dn.direccionEntrega}</td></tr>}
                      {dn.transportista&&<tr><td style={{fontWeight:700,paddingBottom:3}}>Transportista:</td><td style={{paddingBottom:3}}>{dn.transportista}</td></tr>}
                      {dn.notas&&<tr><td style={{fontWeight:700,paddingBottom:3,verticalAlign:"top"}}>Notas:</td><td style={{paddingBottom:3,whiteSpace:"pre-wrap"}}>{dn.notas}</td></tr>}
                      {dn.anulado&&dn.motivoAnulacion&&<tr><td style={{fontWeight:700,color:"#C62828"}}>Motivo anulación:</td><td style={{color:"#C62828"}}>{dn.motivoAnulacion}</td></tr>}
                    </tbody>
                  </table>

                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Detalle de la entrega ({wrs.length} WR · {totalCajas} cajas · {totalLb.toFixed(1)} lb)</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
                    <thead>
                      <tr style={{background:"#EEE"}}>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>#</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>WR</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Descripción</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"left"}}>Tracking</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>Cajas</th>
                        <th style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right"}}>Peso (lb)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wrs.map((w,i)=>{
                        const c=(w.dims||[]).length;
                        const lb=(w.dims||[]).reduce((a,d)=>a+parseFloat(d.pkLb||d.pk*2.205||0),0);
                        const desc=(w.dims||[]).map(d=>d.descripcion).filter(Boolean).join(" · ")||w.notas||"—";
                        return(
                          <tr key={w.id}>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{i+1}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",fontWeight:700}}>{w.id}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{desc.length>60?desc.slice(0,57)+"…":desc}</td>
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

                  <div style={{border:"1px solid #000",padding:"8px 10px",fontSize:12,background:"#FAFAFA",marginBottom:30}}>
                    <b>DECLARACIÓN DE RECEPCIÓN:</b> El receptor declara haber recibido conforme, en buen estado y en la cantidad indicada, la mercancía descrita en esta nota. Cualquier discrepancia o daño visible debe ser reportado al momento de la firma. Una vez firmada, ENEX queda liberado de toda responsabilidad sobre la custodia de la mercancía listada.
                  </div>

                  <div style={{display:"flex",justifyContent:"space-between",gap:40,marginTop:40}}>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Entrega ENEX</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>Firma y sello</div>
                    </div>
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
        const addLinea=()=>setFacModal(p=>({...p,lineas:[...(p.lineas||[]),{descripcion:"",cantidad:1,precio:0,total:0}]}));
        const updLinea=(i,k,v)=>setFacModal(p=>{
          const L=[...(p.lineas||[])];
          L[i]={...L[i],[k]:v};
          L[i].total=(parseFloat(L[i].cantidad)||0)*(parseFloat(L[i].precio)||0);
          const subtotal=L.reduce((s,l)=>s+l.total,0);
          const desc=parseFloat(p.descuento)||0;
          const total=Math.max(0,subtotal-desc);
          const pagado=parseFloat(p.pagado)||0;
          const saldo=Math.max(0,total-pagado);
          return{...p,lineas:L,subtotal,total,saldo};
        });
        const delLinea=(i)=>setFacModal(p=>{
          const L=(p.lineas||[]).filter((_,j)=>j!==i);
          const subtotal=L.reduce((s,l)=>s+(parseFloat(l.total)||0),0);
          const desc=parseFloat(p.descuento)||0;
          const total=Math.max(0,subtotal-desc);
          const pagado=parseFloat(p.pagado)||0;
          const saldo=Math.max(0,total-pagado);
          return{...p,lineas:L.length?L:[{descripcion:"",cantidad:1,precio:0,total:0}],subtotal,total,saldo};
        });
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
            <div className="modal" style={{width:900,maxHeight:"92vh",overflow:"auto"}}>
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
                    <label className="fl">Documento / RIF</label>
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

                <div style={{marginTop:12,marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:15,fontWeight:700,color:"var(--navy)"}}>Líneas</div>
                  <button className="btn-s" style={{fontSize:12,padding:"2px 8px"}} onClick={addLinea}>+ Agregar línea</button>
                </div>
                <table className="ct" style={{width:"100%"}}>
                  <thead><tr><th style={{width:"50%"}}>Descripción</th><th style={{width:80}}>Cantidad</th><th style={{width:100}}>Precio</th><th style={{width:100}}>Total</th><th style={{width:40}}></th></tr></thead>
                  <tbody>
                    {(f.lineas||[]).map((l,i)=>(
                      <tr key={i}>
                        <td><input className="fi" value={l.descripcion} onChange={e=>updLinea(i,"descripcion",e.target.value)} placeholder="Descripción del servicio/producto"/></td>
                        <td><input className="fi" type="number" step="0.01" value={l.cantidad} onChange={e=>updLinea(i,"cantidad",e.target.value)}/></td>
                        <td><input className="fi" type="number" step="0.01" value={l.precio} onChange={e=>updLinea(i,"precio",e.target.value)}/></td>
                        <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,textAlign:"right"}}>{fmtMoney(l.total,f.moneda)}</td>
                        <td><button className="btn-s" style={{fontSize:11,padding:"2px 6px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>delLinea(i)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
                  <div>
                    <label className="fl">Notas</label>
                    <textarea className="fi" rows={3} value={f.notas||""} onChange={e=>setFacModal(p=>({...p,notas:e.target.value}))} style={{resize:"vertical"}}/>
                    <label className="fl" style={{marginTop:8}}>Condiciones</label>
                    <textarea className="fi" rows={2} value={f.condiciones||""} onChange={e=>setFacModal(p=>({...p,condiciones:e.target.value}))} style={{resize:"vertical"}}/>
                  </div>
                  <div>
                    <div style={{background:"var(--bg4)",padding:12,borderRadius:8,border:"1px solid var(--b1)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:14}}>
                        <span>Subtotal:</span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(f.subtotal||0,f.moneda)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,fontSize:14}}>
                        <span>Descuento:</span>
                        <input className="fi" type="number" step="0.01" value={f.descuento||0} onChange={e=>setFacModal(p=>{
                          const desc=parseFloat(e.target.value)||0;
                          const total=Math.max(0,(parseFloat(p.subtotal)||0)-desc);
                          const saldo=Math.max(0,total-(parseFloat(p.pagado)||0));
                          return{...p,descuento:desc,total,saldo};
                        })} style={{width:100,fontFamily:"'DM Mono',monospace",textAlign:"right"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"2px solid var(--navy)",fontSize:17,fontWeight:800,color:"var(--navy)"}}>
                        <span>TOTAL:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.total||0,f.moneda)}</span>
                      </div>
                      {(f.pagado||0)>0&&<>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:13,color:"var(--green)"}}>
                          <span>Pagado:</span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtMoney(f.pagado,f.moneda)}</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--orange)",fontWeight:700}}>
                          <span>Saldo:</span><span style={{fontFamily:"'DM Mono',monospace"}}>{fmtMoney(f.saldo,f.moneda)}</span>
                        </div>
                      </>}
                    </div>
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
                    {PAY_METHODS.map(m=><option key={m.k} value={m.k}>{m.l}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:10}}>
                  <label className="fl">Referencia</label>
                  <input className="fi" value={p.referencia} onChange={e=>setPagoModal(x=>({...x,referencia:e.target.value}))} placeholder="Nº confirmación, últimos 4 dígitos, etc."/>
                </div>
                <div>
                  <label className="fl">Nota referencial <span style={{color:"var(--t3)",fontWeight:400}}>(ej: "Recibido 100€ equivalente a $108 al cambio del día" o "Pago en Bs. 40,00 Bs/USD")</span></label>
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
                <div style={{marginBottom:10}}>
                  <label className="fl">Motivo (aparece en la línea)</label>
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
      {facPrint&&(()=>{
        const f=facPrint;
        const pagosAplic=pagos.filter(p=>p.facturaId===f.id&&!p.anulado);
        return(
          <div className="modal-backdrop" style={{overflow:"auto"}}>
            <div className="modal" style={{width:820,maxHeight:"94vh",display:"flex",flexDirection:"column"}}>
              <div className="mh">
                <div style={{fontSize:16,fontWeight:700,color:"var(--navy)"}}>
                  {f.tipo==="nota_credito"?"📝 Nota de Crédito":f.tipo==="proforma"?"📋 Proforma":"📄 Factura"} · {f.id}
                  {f.status==="anulada"&&<span style={{marginLeft:10,color:"var(--red)",fontWeight:800}}>ANULADA</span>}
                </div>
                <div style={{display:"flex",gap:6}}>
                  {hasPerm("imp_factura")&&<button className="btn-p" style={{fontSize:13,padding:"4px 10px"}} onClick={()=>window.print()}>🖨️ Imprimir</button>}
                  <button className="mcl" onClick={()=>setFacPrint(null)}>✕</button>
                </div>
              </div>
              <div className="mb" style={{padding:24,overflow:"auto",background:"#fff",color:"#000"}}>
                <div id="print-area" style={{fontFamily:"Arial,Helvetica,sans-serif",color:"#000",fontSize:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"2px solid #000",paddingBottom:10,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:26,fontWeight:900,letterSpacing:3}}>ENEX</div>
                      <div style={{fontSize:13}}>{empresaNombre||"Int'l Courier"}</div>
                      <div style={{fontSize:12,color:"#555"}}>Paquetería Internacional</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:15,fontWeight:800}}>{f.tipo==="nota_credito"?"NOTA DE CRÉDITO":f.tipo==="proforma"?"PROFORMA":"FACTURA"}</div>
                      <div style={{fontSize:16,fontWeight:900,fontFamily:"'DM Mono',monospace"}}>Nº {f.id}</div>
                      <div style={{fontSize:12,marginTop:4}}>Fecha: {fmtDate(f.fecha)}</div>
                      {f.fechaEmision&&<div style={{fontSize:12}}>Emisión: {fmtDate(f.fechaEmision)}</div>}
                      <div style={{fontSize:12}}>Moneda: {f.moneda}</div>
                      {f.ncFacturaOrigen&&<div style={{fontSize:12,color:"#7209b7"}}>Ref. factura: {f.ncFacturaOrigen}</div>}
                    </div>
                  </div>

                  <div style={{border:"1px solid #999",padding:"8px 10px",marginBottom:12,background:"#FAFAFA"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:4}}>RECEPTOR ({(REC_TYPES.find(r=>r.k===f.receptorTipo)||{l:f.receptorTipo}).l})</div>
                    <div style={{fontSize:15,fontWeight:700}}>{f.receptorNombre||"—"}</div>
                    <div style={{fontSize:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
                      {f.receptorDoc&&<div><b>Documento:</b> {f.receptorDoc}</div>}
                      {f.receptorCasillero&&<div><b>Casillero:</b> {f.receptorCasillero}</div>}
                      {f.receptorTel&&<div><b>Teléfono:</b> {f.receptorTel}</div>}
                      {f.receptorEmail&&<div><b>Email:</b> {f.receptorEmail}</div>}
                      {f.receptorDir&&<div style={{gridColumn:"1 / span 2"}}><b>Dirección:</b> {f.receptorDir}</div>}
                    </div>
                  </div>

                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:10}}>
                    <thead>
                      <tr style={{background:"#EEE"}}>
                        <th style={{border:"1px solid #999",padding:"5px 6px",textAlign:"left"}}>Descripción</th>
                        <th style={{border:"1px solid #999",padding:"5px 6px",textAlign:"center",width:60}}>Cant</th>
                        <th style={{border:"1px solid #999",padding:"5px 6px",textAlign:"right",width:90}}>Precio</th>
                        <th style={{border:"1px solid #999",padding:"5px 6px",textAlign:"right",width:100}}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(f.lineas||[]).map((l,i)=>(
                        <tr key={i}>
                          <td style={{border:"1px solid #999",padding:"4px 6px"}}>{l.descripcion||"—"}</td>
                          <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"center"}}>{l.cantidad}</td>
                          <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace"}}>{fmtMoney(l.precio,f.moneda)}</td>
                          <td style={{border:"1px solid #999",padding:"4px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:700}}>{fmtMoney(l.total,f.moneda)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
                    <table style={{fontSize:13,minWidth:280}}>
                      <tbody>
                        <tr><td style={{padding:"2px 8px"}}>Subtotal:</td><td style={{padding:"2px 8px",textAlign:"right",fontFamily:"monospace"}}>{fmtMoney(f.subtotal,f.moneda)}</td></tr>
                        {(f.descuento||0)>0&&<tr><td style={{padding:"2px 8px"}}>Descuento:</td><td style={{padding:"2px 8px",textAlign:"right",fontFamily:"monospace"}}>−{fmtMoney(f.descuento,f.moneda)}</td></tr>}
                        <tr style={{fontWeight:900,borderTop:"2px solid #000"}}><td style={{padding:"6px 8px",fontSize:15}}>TOTAL:</td><td style={{padding:"6px 8px",textAlign:"right",fontFamily:"monospace",fontSize:16}}>{fmtMoney(f.total,f.moneda)}</td></tr>
                        {(f.pagado||0)>0&&<tr style={{color:"#0B6B2F"}}><td style={{padding:"2px 8px"}}>Pagado:</td><td style={{padding:"2px 8px",textAlign:"right",fontFamily:"monospace",fontWeight:700}}>{fmtMoney(f.pagado,f.moneda)}</td></tr>}
                        {f.saldo>0.001&&<tr style={{color:"#C96703",fontWeight:800}}><td style={{padding:"2px 8px"}}>Saldo:</td><td style={{padding:"2px 8px",textAlign:"right",fontFamily:"monospace"}}>{fmtMoney(f.saldo,f.moneda)}</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  {pagosAplic.length>0&&<div style={{marginBottom:14}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Pagos aplicados ({pagosAplic.length})</div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr style={{background:"#EEE"}}>
                        <th style={{border:"1px solid #999",padding:"3px 6px",textAlign:"left"}}>Nº Pago</th>
                        <th style={{border:"1px solid #999",padding:"3px 6px",textAlign:"left"}}>Fecha</th>
                        <th style={{border:"1px solid #999",padding:"3px 6px",textAlign:"left"}}>Tipo</th>
                        <th style={{border:"1px solid #999",padding:"3px 6px",textAlign:"left"}}>Ref.</th>
                        <th style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right"}}>Monto</th>
                      </tr></thead>
                      <tbody>
                        {pagosAplic.map(p=>(
                          <tr key={p.id}>
                            <td style={{border:"1px solid #999",padding:"3px 6px",fontFamily:"monospace"}}>{p.id}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{fmtDate(p.fecha)}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{(PAY_METHODS.find(m=>m.k===p.tipoPago)||{l:p.tipoPago}).l}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px"}}>{p.referencia||"—"}{p.notaReferencial?` · ${p.notaReferencial}`:""}</td>
                            <td style={{border:"1px solid #999",padding:"3px 6px",textAlign:"right",fontFamily:"monospace",fontWeight:700}}>{fmtMoney(p.monto,p.moneda)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>}

                  {f.notas&&<div style={{marginBottom:10,fontSize:12,whiteSpace:"pre-wrap"}}><b>Notas:</b> {f.notas}</div>}
                  {f.condiciones&&<div style={{marginBottom:10,fontSize:12,whiteSpace:"pre-wrap",color:"#555"}}><b>Condiciones:</b> {f.condiciones}</div>}
                  {f.status==="anulada"&&f.motivoAnulacion&&<div style={{marginBottom:10,fontSize:13,color:"#C62828",fontWeight:700}}>Motivo anulación: {f.motivoAnulacion}</div>}

                  <div style={{display:"flex",justifyContent:"space-between",gap:40,marginTop:40}}>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>ENEX</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>Firma y sello</div>
                    </div>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{borderTop:"1px solid #000",paddingTop:4,fontSize:12,fontWeight:700}}>Cliente</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{f.receptorNombre||"—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div></>
  );
}
