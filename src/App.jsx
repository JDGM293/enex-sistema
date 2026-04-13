import { useState, useEffect, useRef } from "react";
import { dbGetClientes, dbUpsertCliente, dbDeleteCliente, dbGetWR, dbUpsertWR, dbDeleteWR, dbGetAgentes, dbUpsertAgente, dbDeleteAgente, dbGetOficinas, dbUpsertOficina, dbDeleteOficina, dbGetTarifas, dbUpsertTarifa, dbDeleteTarifa, dbGetConsolidaciones, dbUpsertConsolidacion, dbLogActividad, dbGetActividad, dbGetConfig, dbSetConfig, dbGetScanLog, dbInsertScan, dbSetScanRegistered, dbDeleteScanIds } from "./supabase";

// ─── TEMA CLARO PROFESIONAL ───────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
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
body{background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;font-size:14px}
#root{height:100%}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:var(--bg3)}
::-webkit-scrollbar-thumb{background:var(--b1);border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:var(--t4)}
input,select,textarea,button{font-family:'Inter',sans-serif}
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
.sb-mark{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#C8971C,#E5AE3A);display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:900;color:#1A2B4A;flex-shrink:0}
.sb-name{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;letter-spacing:2px;color:#FFFFFF}
.sb-name span{color:#E5AE3A}
.sb-sub{font-size:8px;color:#E5AE3A;letter-spacing:2.5px;text-transform:uppercase;opacity:.8}
.sb-nav{flex:1;padding:8px 6px;overflow-y:auto}
.sb-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);padding:10px 9px 3px;font-weight:700}
.ni{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:all .12s;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);border:1px solid transparent;margin-bottom:2px}
.ni:hover{background:rgba(255,255,255,0.1);color:#fff}
.ni.on{background:rgba(200,151,28,0.2);border-color:rgba(200,151,28,0.4);color:#E5AE3A}
.ni-ic{font-size:14px;width:16px;text-align:center;flex-shrink:0}
.ni-lbl{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
.n-bx{margin-left:auto;background:#E5AE3A;color:#1A2B4A;font-size:9px;font-weight:800;padding:1px 6px;border-radius:4px;flex-shrink:0}
.n-bx.r{background:#CC2233;color:#fff}
.sb-foot{padding:9px;border-top:1px solid rgba(255,255,255,0.1);flex-shrink:0}
.u-row{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:7px;background:rgba(255,255,255,0.08);cursor:pointer}
.u-row:hover{background:rgba(255,255,255,0.14)}
.u-av{width:30px;height:30px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:#E5AE3A;color:#1A2B4A}
.u-nm{font-size:12px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.u-rl{font-size:10px;color:rgba(255,255,255,0.4)}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
.main{flex:1;min-width:0;height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* ── TOPBAR ──────────────────────────────────────────────────────────────── */
.topbar{height:50px;background:var(--bg2);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0;box-shadow:var(--shadow)}
.tb-ttl{font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;flex:1;color:var(--navy);letter-spacing:.3px}
.tb-srch{display:flex;align-items:center;gap:6px;background:var(--bg3);border:1px solid var(--b1);border-radius:7px;padding:5px 10px;transition:border .12s}
.tb-srch:focus-within{border-color:var(--gold2)}
.tb-srch input{background:none;border:none;outline:none;color:var(--t1);font-size:12px;width:180px}
.tb-srch input::placeholder{color:var(--t3)}
.tb-ic{width:30px;height:30px;border-radius:6px;background:var(--bg3);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;position:relative;flex-shrink:0;transition:background .12s}
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
.stat-ic{font-size:18px;margin-bottom:5px}
.stat-v{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;color:var(--navy);line-height:1}
.stat-l{font-size:11px;color:var(--t2);margin-top:3px;white-space:nowrap}
.stat-d{font-size:10px;margin-top:4px}
.stat-d.up{color:var(--green)}.stat-d.dn{color:var(--red)}.stat-d.neu{color:var(--t3)}
.stat-bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 10px 10px}

/* ── DASH GRID ───────────────────────────────────────────────────────────── */
.dash-grid{display:grid;grid-template-columns:1fr 256px;gap:12px;flex:1;min-height:0;overflow:hidden}

/* ── WR PANEL ────────────────────────────────────────────────────────────── */
.wr-panel{display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--b1);border-radius:12px;min-width:0;overflow:hidden;box-shadow:var(--shadow)}
.wr-toolbar{display:flex;align-items:center;gap:7px;padding:8px 12px;border-bottom:1px solid var(--b2);flex-shrink:0;background:var(--bg3)}
.wr-ttl{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;white-space:nowrap;color:var(--navy)}
.wr-cnt{font-size:9.5px;color:var(--t3);background:var(--bg4);padding:2px 7px;border-radius:4px;border:1px solid var(--b1)}
.flex1{flex:1}

/* search param */
.srch-adv{display:flex;align-items:center;gap:0;border:1px solid var(--b1);border-radius:7px;overflow:hidden;background:var(--bg2);flex-shrink:0}
.srch-param{background:var(--bg4);border:none;border-right:1px solid var(--b1);outline:none;color:var(--t2);font-size:10.5px;padding:5px 8px;cursor:pointer;height:30px}
.srch-adv input{border:none;outline:none;color:var(--t1);font-size:11px;padding:5px 10px;width:160px;background:transparent}
.srch-adv input::placeholder{color:var(--t3)}

.unit-tog{display:flex;align-items:center;gap:3px;background:var(--bg4);border-radius:5px;padding:2px 7px;border:1px solid var(--b1);flex-shrink:0}
.unit-tog span{font-size:9px;color:var(--t3)}
.utb{padding:2px 7px;border-radius:4px;font-size:9.5px;font-weight:600;cursor:pointer;border:none;transition:all .1s;background:none;color:var(--t2)}
.utb.on{background:var(--navy);color:#fff}

.st-sel{background:var(--bg4);border:1px solid var(--b1);border-radius:6px;padding:4px 7px;color:var(--t1);font-size:10px;outline:none;cursor:pointer;flex-shrink:0;max-width:160px}

/* BUTTONS */
.btn-p{padding:8px 18px;border-radius:7px;background:var(--navy);color:#fff;font-size:12px;font-weight:700;border:2px solid var(--navy3);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .12s;box-shadow:0 2px 6px rgba(26,43,74,0.25)}
.btn-p:hover{background:var(--navy2);box-shadow:0 4px 12px rgba(26,43,74,0.35);transform:translateY(-1px)}
.btn-s{padding:5px 10px;border-radius:6px;background:var(--bg3);color:var(--t1);font-size:11px;font-weight:600;border:1px solid var(--b1);cursor:pointer;white-space:nowrap;transition:background .12s}
.btn-s:hover{background:var(--bg4)}
.btn-g{padding:5px 10px;border-radius:6px;background:rgba(26,138,74,0.1);color:var(--green);font-size:11px;font-weight:600;border:1px solid rgba(26,138,74,0.25);cursor:pointer}
.btn-d{padding:5px 10px;border-radius:6px;background:rgba(204,34,51,0.08);color:var(--red);font-size:11px;font-weight:600;border:1px solid rgba(204,34,51,0.2);cursor:pointer}
.btn-c{padding:5px 10px;border-radius:6px;background:rgba(0,128,204,0.1);color:var(--cyan);font-size:11px;font-weight:600;border:1px solid rgba(0,128,204,0.25);cursor:pointer}

/* ── TABLE ───────────────────────────────────────────────────────────────── */
.wr-scroll{overflow:auto;flex:1;min-height:0}
.wt{width:100%;border-collapse:collapse;font-size:12.5px;white-space:nowrap}
.wt thead{position:sticky;top:0;z-index:5}
.wt th{background:var(--navy);color:rgba(255,255,255,0.85);font-size:10px;letter-spacing:.7px;text-transform:uppercase;font-weight:700;padding:9px 10px;border-bottom:2px solid var(--navy3);text-align:left;cursor:pointer;user-select:none;white-space:nowrap}
.wt th:hover{color:#fff}
.wt th:first-child{position:sticky;left:0;z-index:6;background:var(--navy)}
.wt td{padding:9px 10px;color:var(--t1);border-bottom:1px solid var(--b2);vertical-align:middle;white-space:nowrap;font-size:12.5px}
.wt td:first-child{position:sticky;left:0;z-index:2;background:var(--bg2)}
.wt tbody tr{transition:background .08s}
.wt tbody tr:hover td{background:#EEF3FF;cursor:pointer}
.wt tbody tr:hover td:first-child{background:#EEF3FF}
.wt tbody tr.sel td{background:#E8F0FE}
.wt tbody tr.sel td:first-child{background:#E8F0FE}
.wt tbody tr:last-child td{border-bottom:none}

/* cells */
.c-wr{display:inline-block;font-family:'DM Mono',monospace;font-weight:700;font-size:12px;background:#fff;border:2px solid #1A2B4A;color:#1A2B4A;padding:3px 9px;border-radius:5px;letter-spacing:.5px;white-space:nowrap}
.c-route{font-size:10px;color:var(--t3);margin-top:3px}
.c-name{color:var(--t1);font-weight:600;font-size:13px}
.c-cas{font-family:'DM Mono',monospace;font-size:10px;color:var(--gold2);margin-top:2px}
.c-trk{font-family:'DM Mono',monospace;font-size:11px;color:var(--cyan)}
.c-val{font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:var(--green)}
.c-wt{font-family:'DM Mono',monospace;font-size:12px;color:var(--t1);font-weight:600}
.c-wtvol{font-family:'DM Mono',monospace;font-size:12px;color:var(--orange);font-weight:700}
.c-ft3{font-family:'DM Mono',monospace;font-size:11px;color:var(--sky)}
.c-m3{font-family:'DM Mono',monospace;font-size:11px;color:var(--teal)}
.c-note{font-size:12px;color:var(--orange);max-width:120px;overflow:hidden;text-overflow:ellipsis;display:block}
.c-dt{font-family:'DM Mono',monospace;font-size:12px;color:var(--t1);font-weight:600}
.c-tm{font-family:'DM Mono',monospace;font-size:10px;color:var(--t3);margin-top:2px}
.br-b{font-size:10px;background:var(--bg4);padding:2px 7px;border-radius:4px;color:var(--t2);border:1px solid var(--b1)}
.c-name{color:var(--t1);font-weight:600;font-size:11px}
.c-cas{font-family:'DM Mono',monospace;font-size:8.5px;color:var(--gold2);margin-top:1px}
.c-trk{font-family:'DM Mono',monospace;font-size:10px;color:var(--cyan)}
.c-val{font-family:'DM Mono',monospace;font-size:10.5px;font-weight:700;color:var(--green)}
.c-wt{font-family:'DM Mono',monospace;font-size:10px;color:var(--t1)}
.c-wtvol{font-family:'DM Mono',monospace;font-size:10px;color:var(--orange);font-weight:600}
.c-ft3{font-family:'DM Mono',monospace;font-size:9.5px;color:var(--sky)}
.c-m3{font-family:'DM Mono',monospace;font-size:9.5px;color:var(--teal)}
.c-note{font-size:10px;color:var(--orange);max-width:110px;overflow:hidden;text-overflow:ellipsis;display:block}
.c-dt{font-family:'DM Mono',monospace;font-size:10px;color:var(--t1);font-weight:600}
.c-tm{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);margin-top:1px}
.br-b{font-size:9px;background:var(--bg4);padding:2px 6px;border-radius:4px;color:var(--t2);border:1px solid var(--b1)}

/* carrier badges */
.car{display:inline-flex;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;border:1px solid}
.car-ups{background:#FFF3E0;border-color:#E6A020;color:#8B5E00}
.car-fedex{background:#F3E8FF;border-color:#8B5CF6;color:#5B3FB5}
.car-dhl{background:#FFFDE7;border-color:#D4A017;color:#7A5C00}
.car-usps{background:#E8F0FE;border-color:#4A85E0;color:#1A4FA0}
.car-def{background:var(--bg4);border-color:var(--b1);color:var(--t2)}

/* status */
.st{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap}
.st-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.s1{background:#FEF9E7;color:#8B6914;border:1px solid #F0C040}.s1 .st-dot{background:#C8971C}
.s2{background:#E8F4FD;color:#1A6090;border:1px solid #90C8F0}.s2 .st-dot{background:#0080CC}
.s3{background:#E8F8EE;color:#1A6040;border:1px solid #80D0A0}.s3 .st-dot{background:#1A8A4A}
.s4{background:#FDE8EA;color:#8B1420;border:1px solid #F0A0A8}.s4 .st-dot{background:#CC2233}
.s5{background:#FEF0E8;color:#8B4000;border:1px solid #F0B880}.s5 .st-dot{background:#C05800}
.s6{background:#F0EAFE;color:#4A2A90;border:1px solid #C0A0F0}.s6 .st-dot{background:#5B3FB5}

/* type badges */
.type-b{display:inline-flex;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;border:1px solid;white-space:nowrap}
.t-ae{background:#E8F4FD;color:#1A6090;border-color:#90C8F0}
.t-ae2{background:#EEF8FE;color:#2A7AAA;border-color:#B0D8F0}
.t-mf{background:#E8F8EE;color:#1A6040;border-color:#80D0A0}
.t-ml{background:#EEF8F2;color:#2A7050;border-color:#A0D8B8}
.t-tr{background:#FEF0E8;color:#8B4000;border-color:#F0B880}

/* icon buttons */
.ic-b{width:22px;height:22px;border-radius:4px;border:1px solid var(--b1);background:var(--bg3);display:inline-flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;transition:all .1s}
.ic-b:hover{background:var(--bg4)}
.ic-b.has{background:#E8F8EE;border-color:#80D0A0;color:var(--green)}

/* dim popup */
.pos-rel{position:relative}
.dim-txt{font-size:12px;color:var(--t1);font-weight:600}
.dim-sub{font-size:10px;color:var(--t3);margin-top:2px}
.dim-btn{background:var(--bg3);border:1px solid var(--b1);border-radius:5px;color:var(--t2);font-size:11px;padding:4px 10px;cursor:pointer;transition:all .1s;font-weight:600}
.dim-btn:hover{border-color:var(--gold2);color:var(--gold2)}
.dim-pop{
  position:absolute;z-index:99;background:var(--bg2);border:1px solid var(--b1);
  border-radius:10px;padding:14px 16px;min-width:380px;
  box-shadow:0 8px 32px rgba(0,0,0,0.18);left:0;top:calc(100% + 6px);
}
.dim-pop-ttl{font-size:12px;font-weight:700;color:var(--navy);margin-bottom:10px;font-family:'Rajdhani',sans-serif;letter-spacing:.5px}
.dr{display:grid;grid-template-columns:24px 72px 72px 72px 72px 80px;gap:4px;font-size:11px;padding:5px 0;border-bottom:1px solid var(--b2)}
.dr:last-child{border-bottom:none}
.dh{color:var(--t3);font-size:9px;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.dv{font-family:'DM Mono',monospace;color:var(--t1);font-weight:500}

/* ── PAGINATION ──────────────────────────────────────────────────────────── */
.pag{display:flex;align-items:center;justify-content:center;gap:4px;padding:8px 12px;border-top:1px solid var(--b2);flex-shrink:0;background:var(--bg3)}
.pag-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--b1);background:var(--bg2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;font-weight:600;color:var(--t2);transition:all .1s}
.pag-btn:hover{background:var(--bg4);color:var(--t1)}
.pag-btn.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.pag-btn:disabled{opacity:.4;cursor:default}
.pag-info{font-size:11px;color:var(--t3);padding:0 8px}

/* ── ROLE BADGES ─────────────────────────────────────────────────────────── */
.rb{display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:4px;font-size:8.5px;font-weight:800;letter-spacing:.3px;white-space:nowrap}
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
.card-tt{font-size:12.5px;font-weight:700;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;font-family:'Rajdhani',sans-serif}
.card-sub{font-size:9px;padding:2px 6px;border-radius:4px;font-weight:700;background:#FDE8EA;color:var(--red)}
.card-lnk{font-size:10px;color:var(--gold2);cursor:pointer}
.alt-row{display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--b2);cursor:pointer}
.alt-row:last-child{border-bottom:none;padding-bottom:0}
.alt-ic{font-size:14px;flex-shrink:0;margin-top:1px}
.alt-t{font-size:11px;font-weight:700}.alt-b{font-size:9.5px;margin-top:1px;opacity:.8}
.alt-e .alt-t{color:var(--red)}.alt-e .alt-b{color:var(--red)}
.alt-w .alt-t{color:var(--orange)}.alt-w .alt-b{color:var(--orange)}
.alt-i .alt-t{color:var(--cyan)}.alt-i .alt-b{color:var(--cyan)}
.alt-ok .alt-t{color:var(--green)}.alt-ok .alt-b{color:var(--green)}
.pb-row{margin-bottom:8px}.pb-row:last-child{margin-bottom:0}
.pb-hd{display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px}
.pb-l{color:var(--t2)}.pb-v{font-family:'DM Mono',monospace;font-weight:600;color:var(--navy)}
.pb-bg{height:5px;background:var(--bg4);border-radius:3px;overflow:hidden}
.pb-fill{height:100%;border-radius:3px;transition:width .4s ease}
.cl-row{display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--b2)}
.cl-row:last-child{border-bottom:none;padding-bottom:0}
.cl-av{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;background:var(--navy);color:#fff}
.cl-nm{font-size:11px;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cl-cas{font-size:9px;color:var(--gold2);font-family:'DM Mono',monospace}

/* ── TABS ────────────────────────────────────────────────────────────────── */
.tabs{display:flex;gap:2px;background:var(--bg4);border:1px solid var(--b1);border-radius:8px;padding:3px;margin-bottom:14px;flex-wrap:nowrap;overflow-x:auto}
.tab{padding:6px 12px;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;color:var(--t2);transition:all .12s;white-space:nowrap;display:flex;align-items:center;gap:5px;flex-shrink:0}
.tab:hover{color:var(--t1)}.tab.on{background:var(--bg2);color:var(--navy);border:1px solid var(--b1);box-shadow:var(--shadow)}
.t-cnt{background:var(--navy);color:#fff;font-size:8px;font-weight:800;padding:1px 5px;border-radius:4px}

/* ── CLIENT TABLE ────────────────────────────────────────────────────────── */
.ct-wrap{overflow-x:auto}
.ct{width:100%;border-collapse:collapse;font-size:12.5px}
.ct th{text-align:left;font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,0.85);padding:9px 11px;border-bottom:2px solid var(--navy3);font-weight:700;background:var(--navy);white-space:nowrap}
.ct td{padding:11px 11px;color:var(--t1);border-bottom:1px solid var(--b2);font-size:12.5px}
.ct tr{transition:background .1s}.ct tr:hover td{background:#EEF3FF;cursor:pointer}.ct tr:last-child td{border-bottom:none}
.cn{color:var(--t1);font-weight:600;font-size:13px}
.cid{font-family:'DM Mono',monospace;font-size:11px;color:var(--gold2)}

/* ── ROLES ────────────────────────────────────────────────────────────────── */
.role-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.role-card{background:var(--bg2);border:1px solid var(--b1);border-radius:10px;padding:14px;box-shadow:var(--shadow)}
.rc-hd{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
.rc-icon{font-size:22px;flex-shrink:0}
.rc-desc{font-size:10px;color:var(--t2);line-height:1.55;margin-bottom:9px}
.rc-perms{display:flex;flex-wrap:wrap;gap:3px}
.perm{font-size:8.5px;padding:2px 5px;border-radius:3px;font-weight:600}
.perm.yes{background:#E8F8EE;color:var(--green);border:1px solid #80D0A0}
.perm.no{background:var(--bg4);color:var(--t3)}
.rc-subs{margin-top:8px;padding-top:8px;border-top:1px solid var(--b2)}
.rc-si{display:flex;align-items:center;gap:6px;padding:3px 0;font-size:10px;color:var(--t2)}

/* ── WR DETAIL ────────────────────────────────────────────────────────────── */
.wr-doc{background:var(--bg3);border:1px solid var(--b1);border-radius:12px;padding:20px}
.wr-doc-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;padding-bottom:8px;border-bottom:2px solid var(--navy)}
.wr-co{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:800;color:var(--navy);letter-spacing:3px}
.wr-co-info{font-size:10px;color:var(--t2);line-height:1.9;margin-top:3px}
.wr-num-d{font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:var(--navy);letter-spacing:2px;text-align:right}
.wr-num-meta{font-size:10px;color:var(--t2);line-height:1.9;margin-top:3px;text-align:right}
.w2c{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.wb{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:12px}
.wb-t{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--navy);font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--b2)}
.wf{margin-bottom:6px}
.wfl{font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.wfv{font-size:12px;color:var(--t1);font-weight:500;margin-top:2px}
.wr-legal{font-size:9px;color:var(--t3);line-height:1.7;border-top:1px solid var(--b1);padding-top:10px;margin-top:10px}
.wr-sigs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px}
.wr-sig{border-top:2px solid var(--navy);padding-top:8px;font-size:9px;color:var(--t3);text-align:center}

/* ── FORMS ────────────────────────────────────────────────────────────────── */
.sdiv{font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--navy);padding:10px 0 6px;border-bottom:2px solid var(--navy);margin-bottom:12px}
.fg{display:flex;flex-direction:column;gap:4px}
.fl{font-size:9px;color:var(--t2);letter-spacing:.5px;font-weight:600;text-transform:uppercase}
.fi,.fs,.ft{background:var(--bg2);border:1px solid var(--b1);border-radius:7px;padding:8px 11px;color:var(--t1);font-size:12px;outline:none;width:100%;transition:border .12s,box-shadow .12s}
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
.fi-search-item{padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--b2);font-size:12px;color:var(--t1)}
.fi-search-item:hover{background:#EEF3FF}
.fi-search-item:last-child{border-bottom:none}
.fi-search-cas{font-size:10px;color:var(--gold2);font-family:'DM Mono',monospace;margin-left:8px}
.fi-search-new{padding:8px 12px;font-size:11px;color:var(--cyan);cursor:pointer;font-style:italic}

/* ── MODAL ────────────────────────────────────────────────────────────────── */
.ov{position:fixed;inset:0;background:rgba(26,43,74,0.5);z-index:500;display:flex;align-items:flex-start;justify-content:center;padding:14px;overflow-y:auto;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--b1);border-radius:14px;width:100%;padding:22px;animation:mfi .18s ease;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.msm{max-width:520px}.mmd{max-width:820px}.mlg{max-width:1060px}.mxl{max-width:1280px}
@keyframes mfi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mhd{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--b1)}
.mt{font-family:'Rajdhani',sans-serif;font-size:19px;font-weight:700;flex:1;color:var(--navy)}
.mcl{width:28px;height:28px;border-radius:6px;background:var(--bg4);border:1px solid var(--b1);color:var(--t2);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.mcl:hover{background:var(--bg5);color:var(--t1)}
.mft{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;padding-top:14px;border-top:1px solid var(--b1)}

/* ── SCAN ─────────────────────────────────────────────────────────────────── */
.scan-row{display:flex;gap:8px}
.scan-btn{padding:7px 14px;border-radius:7px;background:var(--navy);border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;transition:all .12s;white-space:nowrap}
.scan-btn:hover{background:var(--navy2)}

/* ── ALERTS ───────────────────────────────────────────────────────────────── */
.alt{display:flex;gap:9px;padding:10px 12px;border-radius:8px;margin-bottom:7px;border:1px solid;cursor:pointer}
.alt:last-child{margin-bottom:0}
.alt.warn{background:#FEF3E8;border-color:#F0C080;color:var(--orange)}
.alt.err{background:#FEE8EA;border-color:#F0A0A8;color:var(--red)}
.alt.info{background:#E8F4FD;border-color:#90C8F0;color:var(--cyan)}
.alt.ok{background:#E8F8EE;border-color:#80D0A0;color:var(--green)}
.alt-t2{font-size:11px;font-weight:700}.alt-b2{font-size:10px;opacity:.8;margin-top:2px}
.alt-ic2{font-size:14px;flex-shrink:0;margin-top:1px}

/* ── WR NUMBER BUILDER ───────────────────────────────────────────────────── */
.wr-builder{background:var(--bg4);border:1px solid var(--b1);border-radius:10px;padding:14px;margin-bottom:16px}
.wr-preview{font-family:'DM Mono',monospace;font-size:22px;font-weight:700;letter-spacing:4px;text-align:center;padding:12px;background:var(--bg2);border-radius:8px;margin-bottom:10px;border:2px solid var(--navy);color:var(--navy)}
.seg{display:inline-block;padding:2px 6px;border-radius:4px;margin:0 2px}
.sc{background:#E8F4FD;color:var(--cyan)}
.sk{background:#E8F8EE;color:var(--green)}
.sn{background:#FEF9E7;color:var(--gold2)}
.seg-leg{display:flex;gap:14px;justify-content:center;font-size:9px;color:var(--t3);margin-bottom:12px}

/* ── ETIQUETA TÉRMICA 4×6 pulgadas ────────────────────────────────────────── */
.label-wrap{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;padding:8px}
.label{
  width:384px;min-height:576px;
  border:2px solid #000;border-radius:4px;
  font-family:'DM Sans',sans-serif;background:#fff;color:#000;
  overflow:hidden;page-break-inside:avoid;display:flex;flex-direction:column;
}
.label-head{border-bottom:2px solid #000;text-align:center;padding:6px 10px}
.label-co{font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:800;letter-spacing:3px;color:#000}
.label-sub{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#444;margin-top:1px}
.label-wr{border-bottom:1px solid #000;padding:6px 10px;display:flex;align-items:center;justify-content:space-between}
.label-wr-num{font-family:'DM Mono',monospace;font-size:12px;font-weight:800;color:#000;letter-spacing:.5px}
.label-wr-dt{font-size:9px;color:#333;text-align:right}
.label-caja{border-bottom:2px solid #000;text-align:center;font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:800;padding:4px;letter-spacing:2px;color:#000}
.label-body{padding:8px 10px;flex:1}
.label-row{display:flex;gap:6px;margin-bottom:5px;align-items:flex-start}
.label-lbl{font-size:8px;color:#555;text-transform:uppercase;letter-spacing:.8px;font-weight:700;min-width:70px;margin-top:1px;flex-shrink:0}
.label-val{font-size:11px;color:#000;font-weight:600;line-height:1.3}
.label-divider{border:none;border-top:1px dashed #888;margin:6px 0}
.label-dims{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px}
.label-dim{border:1px solid #000;border-radius:3px;padding:4px 5px;text-align:center}
.label-dim-v{font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:#000}
.label-dim-l{font-size:7.5px;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-top:1px}
.label-barcode{padding:8px 10px;text-align:center;border-top:1px dashed #888;margin-top:auto}
.label-bc-bars{display:flex;align-items:flex-end;justify-content:center;gap:1px;height:44px;margin-bottom:4px}
.label-bc-code{font-family:'DM Mono',monospace;font-size:9px;color:#000;letter-spacing:1px;font-weight:600}
.label-tipo{display:inline-flex;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700;border:1px solid #000;color:#000}
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
  .sb,.topbar,.wr-toolbar,.pag,.rp,.mft,.mhd,.wr-doc,.btn-s,.btn-p,.btn-g,.mcl{display:none!important}
  .wr-print-only{display:block!important}
  .modal{box-shadow:none!important;border:none!important;border-radius:0!important;max-height:none!important;overflow:visible!important;padding:0!important;margin:0!important;width:100%!important;position:static!important}
  .ov{position:static!important;background:none!important;backdrop-filter:none!important;padding:0!important;overflow:visible!important;display:block!important}
  body,html{background:#fff!important;margin:0!important;padding:0!important}
  .wr-page-chunk+.wr-page-chunk{page-break-before:always!important;break-before:page!important}
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
  // Contabilidad
  "facturar","ver_factura","registrar_cobro","ver_cuentas_cobrar",
  // Admin
  "configuracion","gestionar_roles","registro_actividad","envio_masivo",
  "ver_bd_clientes","ver_bd_usuarios","paquetes_sin_reclamo",
  "ver_fotos","subir_foto","todas_sucursales",
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
  configuracion:"Configuración Sistema",gestionar_roles:"Gestionar Roles",registro_actividad:"Registro Actividad",envio_masivo:"Envío Masivo Email",
  ver_bd_clientes:"Ver BD Clientes",ver_bd_usuarios:"Ver BD Usuarios",paquetes_sin_reclamo:"Paquetes Sin Reclamo",
  ver_fotos:"Ver Fotos",subir_foto:"Subir Foto",todas_sucursales:"Todas las Sucursales",
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
  {label:"Contabilidad",perms:["facturar","ver_factura","registrar_cobro","ver_cuentas_cobrar","imp_factura"]},
  {label:"Administración",perms:["configuracion","gestionar_roles","registro_actividad","envio_masivo","ver_bd_clientes","ver_bd_usuarios","paquetes_sin_reclamo","ver_fotos","subir_foto","todas_sucursales"]},
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
    perms:["ver_wr","crear_wr","editar_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","solicitar_reempaque","ver_reempaque","crear_reempaque","editar_reempaque","ver_guia","crear_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","ver_recepcion_dest","hacer_recepcion_dest","editar_recepcion_dest","ver_entrega","entregar","revertir_entrega","editar_entrega","status_origen","status_destino","ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","imp_recibo_entrega","ver_estado_cuenta","ver_estado_cliente","ver_tracking","rastrear","ver_prealerta","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","calculadora","ver_tarifas","ver_bd_clientes","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones","todas_sucursales"]},

  D1:{code:"D1",name:"Operaciones Origen",color:"rD1",icon:"📤",
    desc:"Ejecuta operaciones de origen: RP, WR, guías, consolidación, egreso. Estados 1→7.",
    perms:["ver_wr","crear_wr","editar_wr","ver_rp","hacer_rp","editar_rp","ver_booking","crear_booking","editar_booking","solicitar_reempaque","ver_reempaque","crear_reempaque","editar_reempaque","ver_guia","crear_guia","editar_guia","ver_confirmacion","confirmar","desconfirmar","ver_egreso","hacer_egreso","editar_egreso","status_origen","ver_reportes","rep_confirmados","rep_guia_op","rep_postal","rep_packing","imp_wr","imp_guia","imp_etiq_caja","imp_etiq_guia","imp_rp","imp_booking","imp_reempaque","imp_lista_conf","imp_guia_op","imp_postal","imp_packing","ver_tracking","rastrear","ver_prealerta","ver_servicios","sel_servicio","ver_adicionales","sel_adicional","ver_bd_clientes","ver_fotos","subir_foto","chat_admin","chat_gerencia","chat_auxiliar","chat_operaciones"]},

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
// phase: origen | transito | destino | excep | entrega
// guide:true → se actualiza desde la guía consolidada y cascada a WRs
// auto:true  → se asigna automáticamente por el sistema
// exc:true   → estado de excepción
const WR_STATUSES=[
  {code:"1",   label:"Recibido",        cls:"s1", phase:"origen",   auto:true},
  {code:"2",   label:"Origen",          cls:"s2", phase:"origen",   auto:true},
  {code:"3",   label:"Confirmado",      cls:"s3", phase:"origen",   auto:true},
  {code:"4",   label:"Consolidado",     cls:"s3", phase:"origen",   auto:true},
  {code:"5",   label:"Entregado Línea", cls:"s2", phase:"transito", guide:true},
  {code:"6",   label:"Aduana Salida",   cls:"s5", phase:"transito", guide:true},
  {code:"7",   label:"Auditoria",       cls:"s4", phase:"transito", guide:true},
  {code:"8",   label:"Liberado",        cls:"s3", phase:"transito", guide:true},
  {code:"9",   label:"Tránsito",        cls:"s2", phase:"transito", guide:true},
  {code:"10",  label:"Aduana Tránsito", cls:"s5", phase:"transito", guide:true},
  {code:"11",  label:"Auditoria",       cls:"s4", phase:"transito", guide:true},
  {code:"12",  label:"Liberado",        cls:"s3", phase:"transito", guide:true},
  {code:"13",  label:"Tránsito Final",  cls:"s2", phase:"transito", guide:true},
  {code:"14",  label:"Aduana Destino",  cls:"s5", phase:"destino",  guide:true},
  {code:"15",  label:"Auditoria",       cls:"s4", phase:"destino",  guide:true},
  {code:"16",  label:"Liberado",        cls:"s3", phase:"destino",  guide:true},
  {code:"17",  label:"Almacén",         cls:"s6", phase:"destino",  auto:true},
  {code:"18",  label:"Faltante",        cls:"s4", phase:"excep",    exc:true},
  {code:"18.1",label:"Investigación",   cls:"s4", phase:"excep",    exc:true},
  {code:"19",  label:"Sobrante",        cls:"s5", phase:"excep",    exc:true},
  {code:"20",  label:"Por Entrega",     cls:"s3", phase:"entrega",  auto:true},
  {code:"21",  label:"Entregado",       cls:"s3", phase:"entrega"},
  {code:"22",  label:"Por Cobrar",      cls:"s5", phase:"entrega"},
  {code:"23",  label:"Cobrado",         cls:"s3", phase:"entrega"},
];
const SEND_TYPES_INIT=["Aéreo Express","Aéreo Económico","Marítimo FCL","Marítimo LCL","Terrestre"];
const PAY_TYPES_INIT=["Prepago","Crédito","Contra Entrega","Corporativo","Gobierno"];
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
const WRRow=({w,sel,onClick,unitL,unitW,dimOpen,onDimToggle,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz"})=>{
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
      <button className="dim-btn" style={{padding:"4px 10px",fontSize:11,fontWeight:600,background:"#E8F0FE",borderColor:"#90B8F0",color:"var(--navy)"}} onClick={e=>{e.stopPropagation();onDimToggle();}}>
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
          <div style={{marginTop:10,paddingTop:10,borderTop:"2px solid var(--b1)",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,fontSize:11}}>
            <div style={{background:"var(--bg4)",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:9,marginBottom:2}}>TOTAL PESO</div>
              <div style={{fontWeight:700,color:"var(--navy)",fontFamily:"'DM Mono',monospace"}}>{isLb?`${w.pesoLb}lb`:`${w.pesoKg}kg`}</div>
            </div>
            <div style={{background:"#FEF0E8",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:9,marginBottom:2}}>TOTAL P.VOL.</div>
              <div style={{fontWeight:700,color:"var(--orange)",fontFamily:"'DM Mono',monospace"}}>{isLb?`${w.volLb}lb`:`${w.volKg}kg`}</div>
            </div>
            <div style={{background:"#EEF4FE",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:9,marginBottom:2}}>FT³</div>
              <div style={{fontWeight:700,color:"var(--sky)",fontFamily:"'DM Mono',monospace"}}>{w.ft3}</div>
            </div>
            <div style={{background:"#E8F6F4",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"var(--t3)",fontSize:9,marginBottom:2}}>M³</div>
              <div style={{fontWeight:700,color:"var(--teal)",fontFamily:"'DM Mono',monospace"}}>{w.m3}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <tr className={sel?"sel":""} onClick={onClick}>
      <td>
        <div className="c-wr">{w.id}</div>
        <div className="c-route">{w.origCity} → {w.destCity}</div>
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
        return <div><div style={{fontSize:10,fontWeight:700,color:"var(--navy)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:120}}>{label}</div>{sub&&<div style={{fontSize:9,color:"var(--t3)"}}>{sub}</div>}</div>;
      })()}</td>
      <td><div className="c-dt">{fmtDate(w.fecha)}</div><div className="c-tm">{fmtTime(w.fecha)}</div></td>
      <td><div className="c-name">{w.consignee}</div><div className="c-cas">{w.casillero}</div></td>
      <td style={{maxWidth:72,overflow:"hidden",textOverflow:"ellipsis"}}>
        <span style={{fontWeight:700,fontSize:11,color:"var(--navy)"}}>{w.carrier||"—"}</span>
      </td>
      <td><span className="c-trk">{w.tracking||"—"}</span></td>
      <td style={{minWidth:200,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.descripcion||"—"}</td>
      <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--t1)"}}>{w.factura?w.factura:"—"}</td>
      <td style={{textAlign:"right"}}><span className="c-val">${w.valor?.toFixed(2)||"0.00"}</span></td>
      <td>{dimCell}</td>
      <td style={{textAlign:"right"}}><span className="c-wt">{showPeso}</span></td>
      <td style={{textAlign:"right"}}><span className="c-wtvol">{showVol}</span></td>
      <td style={{textAlign:"right"}}><span className="c-ft3">{w.ft3||"—"}</span></td>
      <td style={{textAlign:"right"}}><span className="c-m3">{w.m3||"—"}</span></td>
      <td style={{maxWidth:90,padding:"4px 6px"}}><div style={{maxWidth:84,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}><StBadge st={w.status}/></div></td>
      <td><span className="c-note">{w.notas||"—"}</span></td>
      <td><TypeBadge t={w.tipoEnvio}/></td>
      <td style={{textAlign:"center"}}><span className={`ic-b ${w.foto?"has":""}`}>{w.foto?"📷":"—"}</span></td>
      <td style={{textAlign:"center"}}><span className={`ic-b ${w.prealerta?"has":""}`}>{w.prealerta?"📎":"—"}</span></td>
    </tr>
  );
};

// ─── WR TABLE COMPONENT ────────────────────────────────────────────────────────
const PAGE_SIZE=50;
const WRTable=({rows,selId,onSelect,unitL,unitW,onSort,sortCol,sortDir,dimOpen,onDimToggle,page,onPage,clients=[],agentes=[],oficinas=[],empresaNombre="Casa Matriz"})=>{
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
              <SortTh col="cajas" align="center">Cajas</SortTh>
              <SortTh col="branch">Branch</SortTh>
              <SortTh col="fecha">Fecha / Hora</SortTh>
              <th style={{minWidth:160}}>Recipiente (Consignatario)</th>
              <th style={{width:72,maxWidth:72}}>Transp.</th>
              <th style={{minWidth:160}}>Seguimiento</th>
              <th style={{minWidth:200}}>Descripción</th>
              <th style={{minWidth:100}}>Factura</th>
              <th style={{textAlign:"right",minWidth:100}}>Valor Decl.</th>
              <th style={{minWidth:180}}>Dimensiones</th>
              <th style={{textAlign:"right",minWidth:70}}>Peso</th>
              <th style={{textAlign:"right",minWidth:80}}>Peso Vol.</th>
              <th style={{textAlign:"right",minWidth:60}}>Ft³</th>
              <th style={{textAlign:"right",minWidth:60}}>M³</th>
              <th style={{width:90,maxWidth:90}}>Estado</th>
              <th style={{minWidth:110}}>Notas</th>
              <th style={{minWidth:110}}>Tipo Envío</th>
              <th style={{textAlign:"center",width:40}}>📷</th>
              <th style={{textAlign:"center",width:65}}>Pre-Alerta</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length===0?(
              <tr><td colSpan={19} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No se encontraron registros.</td></tr>
            ):pageRows.map(w=>(
              <WRRow key={w.id} w={w} sel={selId===w.id} onClick={()=>onSelect(w)}
                unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
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
        <span style={{fontSize:10,color:"var(--t3)",marginLeft:4}}>| 50 por página</span>
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
});
const emptyWRF=()=>({
  consignee:"",casilleroSearch:"",casillero:"",clienteId:"",
  remitente:"",remitenteDir:"",remitenteTel:"",remitenteEmail:"",
  chofer:"",idChofer:"",proNumber:"",ocNumber:"",
  tipoPago:"Prepago",tipoEnvio:"",
  notas:"",cargos:[],
  unitDim:"in",unitPeso:"lb",
  cajas:[emptyCaja()],
});

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
    <div className="ov" onClick={onClose}>
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
                  style={{fontSize:11,padding:"5px 10px"}}
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
                {autonomos.length===0&&<div style={{fontSize:10,color:"var(--t3)",marginTop:4}}>No hay autónomos registrados en el sistema aún.</div>}
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
          <div className="fg"><div className="fl" style={{fontSize:10,color:"var(--t3)"}}>{f.tipo==="usuario"?"El usuario podrá cambiarla al ingresar.":"Déjalo en blanco si el cliente no accede al sistema."}</div></div>
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
        {emailErr&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:6,padding:"8px 12px",marginBottom:8,color:"#DC2626",fontSize:12,fontWeight:600}}>⚠️ {emailErr}</div>}
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
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:10}}>{title}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <input className="fi" style={{flex:1,fontFamily:mono?"'DM Mono',monospace":"inherit",textTransform:"uppercase"}}
          value={v} onChange={e=>setV(e.target.value.toUpperCase())}
          onKeyDown={e=>{if(e.key==="Enter"&&v.trim()){onAdd(v.trim().toUpperCase());setV("");}}}
          placeholder={placeholder}/>
        <button className="btn-p" style={{padding:"6px 14px"}} onClick={()=>{if(v.trim()){onAdd(v.trim().toUpperCase());setV("");}}} >+ Agregar</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {items.map((it,i)=>(
          <div key={i} style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,padding:"4px 10px",fontSize:12}}>
            <span style={{fontFamily:mono?"'DM Mono',monospace":"inherit",fontWeight:600,color:"var(--t1)"}}>{it}</span>
            <span onClick={()=>onDelete(i)} style={{color:"var(--red)",cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:1}}>×</span>
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
                <span style={{fontSize:12,fontWeight:current?700:600,color:current?"var(--navy)":done?"var(--t1)":"var(--t3)"}}>{st.code} · {st.label}</span>
                {current&&<span style={{fontSize:9,background:"var(--navy)",color:"#fff",padding:"1px 6px",borderRadius:4,fontWeight:700}}>ACTUAL</span>}
              </div>
              {entry&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,fontFamily:"'DM Mono',monospace"}}>{fmtDate(entry.fecha)} {fmtTime(entry.fecha)} · {entry.user}{entry.nota?` · ${entry.nota}`:""}</div>}
              {!entry&&done&&!current&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,fontFamily:"'DM Mono',monospace"}}>—</div>}
            </div>
            {/* Acción rápida */}
            {trkCanUpdate&&statusAllowed(st)&&!current&&(
              <button onClick={()=>{
                const nota=window.prompt(`Nota para estado "${st.label}" (opcional):`)||"";
                applyStatus(w,st,nota);
              }} style={{alignSelf:"center",fontSize:10,padding:"2px 8px",borderRadius:4,border:"1px solid var(--b1)",background:"var(--bg3)",cursor:"pointer",color:"var(--t2)",flexShrink:0,marginBottom:6}}>
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
  containers:[{tipo:"E",largo:"",ancho:"",alto:"",pesoLb:"",sello:"",wr:[]}],
});

const emptyPickup=()=>({
  clienteId:"",clienteNombre:"",clienteDir:"",clienteTel:"",
  fecha:"",hora:"",chofer:"",notas:"",
  paquetes:[{descripcion:"",largo:"",ancho:"",alto:"",pesoLb:"",cantidad:1}],
  status:"Pendiente",cotizacion:null,
});

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
  const [labelWRTipo,setLabelWRTipo]=useState(1);   // 1=6×4 Tipo1, 2=6×4 Tipo2, 3=2×4 Tipo1, 4=2×4 Tipo2
  const [labelCSATipo,setLabelCSATipo]=useState(1); // 1=6×4 Tipo1, 2=6×4 Tipo2, 3=2×4 Tipo1, 4=2×4 Tipo2
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
  const [selRole,setSelRole]=useState(null);
  const [ecSearch,setEcSearch]=useState("");
  const [ecCliente,setEcCliente]=useState(null);
  const [ecResults,setEcResults]=useState([]);
  const [ecFiltro,setEcFiltro]=useState("todos");
  const [ecMes,setEcMes]=useState(new Date().getMonth());
  const [ecAnio,setEcAnio]=useState(new Date().getFullYear());
  const [consolList,setConsolList]=useState([]);
  const [showNewConsol,setShowNewConsol]=useState(false);
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
  const [calcForm,setCalcForm]=useState({largo:"",ancho:"",alto:"",pesoLb:"",unitDim:"in",origPais:"01",origCiudad:"MI",destPais:"58",destCiudad:"VL",tipoEnvio:""});
  const [contabTab,setContabTab]=useState("facturas");
  const [facturas,setFacturas]=useState([]);
  const [pagos,setPagos]=useState([]);
  const [cf,setCf]=useState(emptyConsol());
  const [puf,setPuf]=useState(emptyPickup());
  const [contScanVal,setContScanVal]=useState({});
  const [contScanErr,setContScanErr]=useState({});
  // ── SUPABASE: cargar datos al iniciar ────────────────────────────────────
  useEffect(()=>{
    const load=async()=>{
      const [cls,wrs,ags,ofs,tfs,cons,acts,scans,sendT,payT,chargesT,contT,countriesT,
             wrNumT,wrSecT,consolNumT,consolSecT,empSlugT,labelWRT,labelCsaT]=await Promise.all([
        dbGetClientes(),dbGetWR(),dbGetAgentes(),dbGetOficinas(),
        dbGetTarifas(),dbGetConsolidaciones(),dbGetActividad(),dbGetScanLog(),
        dbGetConfig('send_types'),dbGetConfig('pay_types'),dbGetConfig('charges'),
        dbGetConfig('container_types'),dbGetConfig('countries'),
        dbGetConfig('wr_num_tipo'),dbGetConfig('wr_sec_inicio'),
        dbGetConfig('consol_num_tipo'),dbGetConfig('consol_sec_inicio'),
        dbGetConfig('empresa_slug'),dbGetConfig('label_wr_tipo'),dbGetConfig('label_csa_tipo'),
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
      if(labelWRT)setLabelWRTipo(labelWRT);
      if(labelCsaT)setLabelCSATipo(labelCsaT);
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
          <div style={{fontSize:28,fontWeight:800,color:"var(--navy)"}}>ENEX</div>
          <div style={{fontSize:13,color:"var(--t3)"}}>International Courier — Sistema</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input className="fi" placeholder="Correo electrónico" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          <input className="fi" type="password" placeholder="Contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          {loginErr&&<div style={{color:"var(--red)",fontSize:12,textAlign:"center"}}>{loginErr}</div>}
          <button className="btn-p" onClick={doLogin} style={{marginTop:8}}>Ingresar</button>
        </div>
        <div style={{fontSize:10,color:"var(--t3)",marginTop:16,textAlign:"center"}}>Demo: admin@enex.com / admin123</div>
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

  const submitWR=()=>{
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
      setWrList(p=>p.map(x=>x.id===editWR.id?updated:x));
      dbUpsertWR(updated);
      setShowNewWR(false);setEditWR(null);
      setWrf(emptyWRF());setClientSearch("");
      logAction("Editó WR",editWR.id);
    } else {
      // ── CREATE MODE ────────────────────────────────────────────────────────
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
        carrier:wrf.cajas[0]?.carrier||"",tracking:wrf.cajas[0]?.tracking||"",
        descripcion:wrf.cajas[0]?.descripcion||"",factura:wrf.cajas[0]?.numFactura||"",
        valor:wrf.cajas.reduce((s,c)=>s+parseFloat(c.montoFactura||0),0),
        dims,
        pesoKg:totalPesoKg,pesoLb:totalPesoLb,
        volKg:totalVolKg,volLb:totalVolLb,ft3:totalFt3,m3:totalM3,
        status:WR_STATUSES[0],notas:wrf.notas,
        tipoEnvio:wrf.tipoEnvio,tipoPago:wrf.tipoPago,
        shipper:wrf.remitente,remitenteDir:wrf.remitenteDir||"",usuario:currentUser.id,foto:false,prealerta:false,
        cargos:wrf.cargos,
      };
      wrf.cajas.forEach(c=>{if(c.tracking)checkAndRemoveScan(c.tracking);});
      setWrList(p=>[n,...p]);
      dbUpsertWR(n);
      setShowNewWR(false);
      setWrf(emptyWRF());setClientSearch("");
      logAction("Creó WR",wrNumPrev);
      setShowLabels({wr:n,dims,remitente:wrf.remitente,tipoEnvio:wrf.tipoEnvio});
    }
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
        {search&&<span style={{paddingRight:6,cursor:"pointer",color:"var(--t3)",fontSize:13}} onClick={()=>setSearch("")}>✕</span>}
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
            onSort={handleSort} sortCol={sortCol} sortDir={sortDir}
            dimOpen={dimOpen} onDimToggle={handleDimToggle}
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
                    <span className="pb-v">{v} <span style={{color:"var(--t3)",fontSize:9}}>{pct}%</span></span>
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
  const renderWR=()=>(
    <div className="wr-panel" style={{margin:"0 16px 14px",flex:1,minHeight:0}}>
      {renderWRToolbar()}
      <WRTable rows={filteredWR} selId={selWR?.id} onSelect={setSelWR}
        unitL={unitL} unitW={unitW} clients={clients} agentes={agentes} oficinas={oficinas} empresaNombre={empresaNombre}
        onSort={handleSort} sortCol={sortCol} sortDir={sortDir}
        dimOpen={dimOpen} onDimToggle={handleDimToggle}
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
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:12}}>📡 Recepción en Puerta — Control de Paquetería</div>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr auto",gap:8,marginBottom:8}}>
          <div className="fg">
            <div className="fl">Carrier / Transportista</div>
            <input className="fi" value={scanCarrier} onChange={e=>setScanCarrier(e.target.value.toUpperCase())} placeholder="UPS, FEDEX, DHL…" style={{textTransform:"uppercase",fontWeight:600}}/>
          </div>
          <div className="fg">
            <div className="fl">Tracking — Escanear o escribir</div>
            <input className="fi" style={{fontFamily:"'DM Mono',monospace",fontSize:14,letterSpacing:1}}
              placeholder="Escanear o escribir tracking…" value={scanV} onChange={e=>setScanV(e.target.value.toUpperCase())}
              onKeyDown={e=>{if(e.key==="Enter")doScan();}}/>
          </div>
          <div className="fg">
            <div className="fl">&nbsp;</div>
            <button className="scan-btn" onClick={doScan}>📡 Registrar</button>
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--t3)"}}>Presiona <strong>Enter</strong> o el botón. Al crear el WR el tracking pasa automáticamente al historial de la derecha.</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* IZQUIERDA — PENDIENTES */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)"}}>⏳ Pendientes de WR</span>
            {pending.length>0&&<span style={{fontSize:10,background:"#FDE8EA",padding:"2px 8px",borderRadius:4,border:"1px solid #F0A0A8",color:"var(--red)",fontWeight:700}}>{pending.length}</span>}
          </div>
          {pending.length===0
            ?<div style={{textAlign:"center",padding:"24px 0",color:"var(--t3)",fontSize:11}}>Sin pendientes ✅</div>
            :<table className="ct">
              <thead><tr><th>#</th><th>Carrier</th><th>Tracking</th><th>Hora</th><th></th></tr></thead>
              <tbody>{pending.map((s,i)=>(
                <tr key={i}>
                  <td style={{color:"var(--t3)",fontSize:10}}>{i+1}</td>
                  <td style={{color:"var(--t1)",fontWeight:700,fontSize:11}}>{s.carrier||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--cyan)",fontSize:11,fontWeight:600}}>{s.tracking}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{fmtTime(s.ts)}</td>
                  <td><button className="btn-p" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>{setWrf(p=>({...p,cajas:[{...p.cajas[0],carrier:s.carrier||"",tracking:s.tracking},...p.cajas.slice(1)]}));setShowNewWR(true);}}>WR →</button></td>
                </tr>
              ))}</tbody>
            </table>
          }
        </div>

        {/* DERECHA — HISTORIAL COLAPSABLE POR DÍA */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)"}}>✅ Historial por Día</span>
            {history.length>0&&<span style={{fontSize:10,background:"#E8F8EE",padding:"2px 8px",borderRadius:4,border:"1px solid #80D0A0",color:"var(--green)",fontWeight:700}}>{history.length} registrados</span>}
          </div>
          {Object.keys(histByDay).length===0
            ?<div style={{textAlign:"center",padding:"24px 0",color:"var(--t3)",fontSize:11}}>Sin registros aún</div>
            :Object.entries(histByDay).map(([day,items])=>{
              const open=openDays[day]===true; // default closed
              return (
                <div key={day} style={{marginBottom:8,border:"1px solid var(--b1)",borderRadius:8,overflow:"hidden"}}>
                  {/* Header clickeable */}
                  <div onClick={()=>toggleDay(day)} style={{background:"var(--bg4)",padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",borderBottom:open?"1px solid var(--b1)":"none"}}>
                    <span style={{fontWeight:700,fontSize:12,color:"var(--navy)"}}>
                      📅 {day} — {items.length} paquetes {open?"▲":"▼"}
                    </span>
                    {canAdmin&&<button className="btn-d" style={{fontSize:9,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();const ids=items.map(s=>s.id).filter(Boolean);setScanLog(p=>p.filter(s=>fmtDate(s.ts)!==day||!s.registered));dbDeleteScanIds(ids);}}>🗑 Borrar día</button>}
                  </div>
                  {open&&(
                    <table className="ct" style={{fontSize:10}}>
                      <thead><tr><th>#</th><th>Carrier</th><th>Tracking</th><th>Hora</th></tr></thead>
                      <tbody>{items.map((s,i)=>(
                        <tr key={i}>
                          <td style={{color:"var(--t3)"}}>{i+1}</td>
                          <td style={{fontWeight:600,color:"var(--t2)"}}>{s.carrier||"—"}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t2)",fontSize:10}}>{s.tracking}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:9}}>{fmtTime(s.ts)}</td>
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
        {canEdit&&<button className="btn-p" onClick={()=>setShowNewCl(true)}>+ Agregar</button>}
      </div>
      <div className="card" style={{padding:0}}>
        <div className="ct-wrap">
          <table className="ct">
            <thead><tr>
              <th>ID</th><th>Tipo</th><th>Nombre Completo</th><th>Cédula</th>
              <th>Casillero</th><th>Dirección</th><th>Municipio</th><th>Estado</th>
              <th>País</th><th>CP</th><th>Teléfono 1</th><th>Teléfono 2</th><th>Email</th><th>Rol</th>
              <th>Designación</th><th>Pertenece a</th>
              {canEdit&&<th>Acc.</th>}
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
                  <td><span style={{fontSize:9,padding:"2px 6px",borderRadius:4,fontWeight:700,background:c.tipo==="usuario"?"#F0EAFE":"#E8F8EE",color:c.tipo==="usuario"?"var(--purple)":"var(--green)",border:"1px solid",borderColor:c.tipo==="usuario"?"#C0A0F0":"#80D0A0"}}>{c.tipo==="usuario"?"👤 Sistema":"🏠 Cliente"}</span></td>
                  <td><span className="cn">{fullName(c)}</span></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--gold2)",fontWeight:600}}>{c.cedula}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--gold2)",fontWeight:700}}>{c.casillero||"—"}</td>
                  <td style={{fontSize:10,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis"}}>{c.dir}</td>
                  <td style={{fontSize:10}}>{c.municipio}</td>
                  <td style={{fontSize:10}}>{c.estado}</td>
                  <td style={{fontSize:10}}>{c.pais}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{c.cp||"—"}</td>
                  <td style={{fontSize:10,whiteSpace:"nowrap"}}>{c.tel1}</td>
                  <td style={{fontSize:10,color:"var(--t3)",whiteSpace:"nowrap"}}>{c.tel2||"—"}</td>
                  <td style={{fontSize:10,color:"var(--cyan)"}}>{c.email}</td>
                  <td><RoleBadge code={c.rol}/></td>
                  <td>{ct?<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,fontWeight:700,background:CT_COLOR[ct]||"var(--bg4)",color:CT_TEXT[ct]||"var(--t2)",border:"1px solid currentColor",whiteSpace:"nowrap"}}>{ctLabel}</span>:<span style={{color:"var(--t4)",fontSize:10}}>—</span>}</td>
                  <td style={{fontSize:10,color:parentName&&parentName.startsWith("⚠️")?"var(--red)":ct==="matriz"?"var(--t3)":"var(--t1)",fontWeight:ct==="matriz"?400:600,whiteSpace:"nowrap"}}>{parentName}</td>
                  {canEdit&&<td><div style={{display:"flex",gap:3}}>
                    <span className="ic-b" onClick={()=>setShowEditCl(c)}>✏️</span>
                    {canAdmin&&<span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar "${fullName(c)}"? Esta acción no se puede deshacer.`)){setClients(p=>p.filter(x=>x.id!==c.id));dbDeleteCliente(c.id);logAction("Borró registro",`${c.id} — ${fullName(c)}`);}}}>🗑</span>}
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
                <span style={{fontSize:20}}>{r.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className={`rb ${r.color}`} style={{fontSize:11}}>{r.code}</span>
                    <span style={{fontWeight:700,fontSize:13,color:"var(--t1)"}}>{r.name}</span>
                    {r.subs&&<span style={{fontSize:10,color:"var(--t3)"}}>+{r.subs.length} sub</span>}
                  </div>
                  <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{r.perms?.length||0} permisos</div>
                </div>
                <span style={{fontSize:12,color:"var(--t3)"}}>{selRole===r.code?"▲":"▼"}</span>
              </div>
              {selRole===r.code&&<div style={{fontSize:11,color:"var(--t2)",marginTop:8,paddingTop:8,borderTop:"1px solid var(--b2)",lineHeight:1.6}}>{r.desc}</div>}
              {r.subs&&selRole===r.code&&(
                <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                  {r.subs.map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:4,background:"var(--bg4)",borderRadius:5,padding:"3px 8px",fontSize:11}}><RoleChip code={s}/><span style={{color:"var(--t2)"}}>{ROLE_DEFS[s]?.name}</span></div>)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DETALLE DE PERMISOS */}
        {selRole?(
          <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",background:"var(--navy)",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>{ROLE_DEFS[selRole]?.icon}</span>
              <div>
                <div style={{color:"#fff",fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700}}>{ROLE_DEFS[selRole]?.code} — {ROLE_DEFS[selRole]?.name}</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:12,marginTop:2}}>{ROLE_DEFS[selRole]?.desc}</div>
              </div>
              <div style={{marginLeft:"auto",background:"rgba(229,174,58,.2)",border:"1px solid rgba(229,174,58,.4)",borderRadius:6,padding:"4px 12px",color:"#E5AE3A",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700}}>
                {ROLE_DEFS[selRole]?.perms.length} / {ALL_PERMS.length} permisos
              </div>
            </div>
            <div style={{padding:"14px 16px",maxHeight:"65vh",overflowY:"auto"}}>
              {PERM_GROUPS.map(g=>{
                const gPerms=g.perms.filter(p=>ALL_PERMS.includes(p));
                const hasAny=gPerms.some(p=>ROLE_DEFS[selRole]?.perms?.includes(p));
                return (
                  <div key={g.label} style={{marginBottom:16}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:hasAny?"var(--navy)":"var(--t4)",marginBottom:8,paddingBottom:4,borderBottom:`2px solid ${hasAny?"var(--navy)":"var(--b2)"}`}}>
                      {g.label}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {gPerms.map(p=>{
                        const has=ROLE_DEFS[selRole]?.perms?.includes(p);
                        return (
                          <span key={p} style={{
                            display:"inline-flex",alignItems:"center",gap:4,
                            padding:"3px 9px",borderRadius:5,fontSize:11,fontWeight:600,
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
            <span style={{fontSize:40}}>🔐</span>
            <div style={{fontSize:14,fontWeight:600}}>Selecciona un rol para ver sus permisos</div>
          </div>
        )}
      </div>
    </div>
  );

  // ── CLIENT FORM MODAL ──────────────────────────────────────────────────────
  // ── NEW WR MODAL ────────────────────────────────────────────────────────────
  const renderNewWRModal=()=>(
    <div className="ov" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF());setClientSearch("");}}>
      <div className="modal mxl" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">{editWR?"✏️ Editar WR — "+editWR.id:"📦 Nuevo Warehouse Receipt"} — {wrf.cajas.length} {wrf.cajas.length===1?"caja":"cajas"}</div>
          <button className="mcl" onClick={()=>{setShowNewWR(false);setEditWR(null);setWrf(emptyWRF());setClientSearch("");}}>✕</button>
        </div>

        {/* N° WR AUTOMÁTICO */}
        <div className="wr-builder">
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--navy)",marginBottom:8}}>
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
          <div style={{display:"flex",gap:8,justifyContent:"center",fontSize:11,color:"var(--t2)",marginTop:4}}>
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
                        <span style={{fontSize:9,color:"var(--t3)",marginLeft:6}}>{c.cedula}</span>
                      </div>
                    ))}
                    <div className="fi-search-new" onClick={()=>setClientResults([])}>+ Registrar como nuevo cliente después</div>
                  </div>
                )}
              </div>
              <div className="fg"><div className="fl">Nombre (si no está registrado)</div><input className="fi" value={wrf.consignee} onChange={e=>sw("consignee",e.target.value)} placeholder="Nombre completo"/></div>
              <div className="fg"><div className="fl">N° Casillero</div><input className="fi" value={wrf.casillero} onChange={e=>sw("casillero",e.target.value)} placeholder="NX-0000" style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:14,color:"var(--navy)",letterSpacing:1,background:"#EEF3FF",border:"2px solid #B8C8F0"}}/></div>
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
            <div className="fi ro" style={{fontSize:11}}>
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
          <span style={{fontSize:11,fontWeight:600,color:"var(--navy)"}}>Unidades de medida:</span>
          <div style={{display:"flex",gap:4}}>
            <button type="button" className={`btn-${wrf.unitDim==="in"?"p":"s"}`} style={{padding:"4px 10px",fontSize:11}} onClick={()=>setWrf(p=>({...p,unitDim:"in"}))}>pulg.</button>
            <button type="button" className={`btn-${wrf.unitDim==="cm"?"p":"s"}`} style={{padding:"4px 10px",fontSize:11}} onClick={()=>setWrf(p=>({...p,unitDim:"cm"}))}>cm</button>
          </div>
          <span style={{fontSize:11,fontWeight:600,color:"var(--navy)",marginLeft:12}}>Unidades de peso:</span>
          <div style={{display:"flex",gap:4}}>
            <button type="button" className={`btn-${wrf.unitPeso==="lb"?"p":"s"}`} style={{padding:"4px 10px",fontSize:11}} onClick={()=>setWrf(p=>({...p,unitPeso:"lb"}))}>lb</button>
            <button type="button" className={`btn-${wrf.unitPeso==="kg"?"p":"s"}`} style={{padding:"4px 10px",fontSize:11}} onClick={()=>setWrf(p=>({...p,unitPeso:"kg"}))}>kg</button>
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
                <span style={{color:"#E5AE3A",fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:13}}>
                  📦 REGISTRO {idx+1} {wrf.cajas.length>1?`de ${wrf.cajas.length}`:""}
                </span>
                <div style={{flex:1}}/>
                {wrf.cajas.length>1&&(
                  <button onClick={()=>removeCaja(idx)} style={{background:"rgba(204,34,51,0.3)",border:"1px solid rgba(204,34,51,0.5)",color:"#FF8888",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>
                    🗑 Eliminar registro
                  </button>
                )}
              </div>

              <div style={{padding:"12px 14px"}}>
                {/* 3 trackings en una sola línea */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {[0,1,2].map(ti=>{
                    const tkeys=[["carrier","tracking"],["carrier2","tracking2"],["carrier3","tracking3"]];
                    const [ck,tk]=tkeys[ti];
                    // per-caja only has carrier/tracking for first; use caja fields
                    const cfield=ti===0?"carrier":ti===1?"carrier2":"carrier3";
                    const tfield=ti===0?"tracking":ti===1?"tracking2":"tracking3";
                    return (
                      <div key={ti} style={{background:"var(--bg4)",borderRadius:7,padding:"8px 10px",border:"1px solid var(--b1)"}}>
                        <div className="fl" style={{marginBottom:4}}>Transportista {ti+1}{ti>0?" (opc.)":""}</div>
                        <input className="fi" style={{marginBottom:6,fontSize:11,textTransform:"uppercase",fontWeight:600}} value={caja[cfield]||""} onChange={e=>swCaja(idx,cfield,e.target.value.toUpperCase())} placeholder={ti===0?"UPS, FEDEX…":"Opcional"}/>
                        <div className="fl" style={{marginBottom:4}}>Tracking {ti+1}</div>
                        <div style={{display:"flex",gap:4}}>
                          <input className="fi" style={{fontFamily:"'DM Mono',monospace",fontSize:11,flex:1}} value={caja[tfield]||""} onChange={e=>swCaja(idx,tfield,e.target.value)} placeholder="Escanear…"/>
                          {ti===0&&<button className="scan-btn" style={{padding:"5px 8px",fontSize:11}}>📡</button>}
                        </div>
                      </div>
                    );
                  })}
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
                    <input className="fi" type="number" min="1" value={caja.cantidad||1} onChange={e=>swCaja(idx,"cantidad",e.target.value)} style={{textAlign:"center",fontWeight:800,fontSize:14,color:"var(--navy)"}}/>
                  </div>
                  <div className="fg">
                    <div className="fl">Embalaje</div>
                    <input className="fi" value={caja.tipoEmbalaje} onChange={e=>swCaja(idx,"tipoEmbalaje",e.target.value)} placeholder="Ej: Caja, Paleta…" style={{fontSize:11}}/>
                  </div>
                  <div className="fg"><div className="fl">Largo</div><input className="fi" type="number" value={caja.largo} onChange={e=>swCaja(idx,"largo",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Ancho</div><input className="fi" type="number" value={caja.ancho} onChange={e=>swCaja(idx,"ancho",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Alto</div><input className="fi" type="number" value={caja.alto} onChange={e=>swCaja(idx,"alto",e.target.value)}/></div>
                  <div className="fg"><div className="fl">Peso ({wrf.unitPeso})</div><input className="fi" type="number" value={caja.pesoLb} onChange={e=>swCaja(idx,"pesoLb",e.target.value)}/></div>
                  <div className="fg"><div className="fl">P.Vol.lb 🔄</div><div className="fi ro" style={{color:"var(--orange)",fontWeight:700,fontSize:12}}>{hasVol?cc.volLb:"—"}</div></div>
                  <div className="fg"><div className="fl">P.Vol.kg 🔄</div><div className="fi ro" style={{color:"var(--orange)",fontSize:11}}>{hasVol?cc.volKg:"—"}</div></div>
                  <div className="fg"><div className="fl">Ft³ 🔄</div><div className="fi ro" style={{color:"var(--sky)",fontWeight:600,fontSize:11}}>{hasVol?cc.ft3:"—"}</div></div>
                </div>

                {/* Descripción */}
                <div className="fg">
                  <div className="fl">Descripción de la Mercancía</div>
                  <textarea className="fi" value={caja.descripcion} onChange={e=>swCaja(idx,"descripcion",e.target.value)} placeholder="Descripción detallada de la mercancía: tipo de producto, materiales, uso, etc." rows={3} style={{resize:"vertical",minHeight:64,fontFamily:"inherit",fontSize:12,lineHeight:1.5}}/>
                </div>
              </div>
            </div>
          );
        })}

        {/* BOTÓN NUEVA CAJA */}
        <button onClick={addCaja} style={{width:"100%",padding:"12px",border:"2px dashed var(--navy)",borderRadius:10,background:"rgba(26,43,74,0.04)",color:"var(--navy)",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:18}}>📦</span> + Agregar
        </button>

        {/* TOTALES */}
        {wrf.cajas.length>0&&(
          <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
            <div style={{fontWeight:700,color:"var(--navy)",fontSize:10,textTransform:"uppercase",letterSpacing:1,gridColumn:"1/-1",marginBottom:4}}>TOTALES DEL WR — {wrf.cajas.length} {wrf.cajas.length===1?"caja":"cajas"}</div>
            {[["Peso total lb",`${totalPesoLb} lb`,"var(--t1)"],["Peso total kg",`${totalPesoKg} kg`,"var(--t2)"],["P.Vol. lb",`${totalVolLb} lb`,"var(--orange)"],["P.Vol. kg",`${totalVolKg} kg`,"var(--orange)"],["Ft³",String(totalFt3),"var(--sky)"],["M³",String(totalM3),"var(--teal)"]].map(([l,v,c])=>(
              <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"7px 10px",border:"1px solid var(--b1)"}}>
                <div style={{fontSize:9,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:c,fontSize:13}}>{v}</div>
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
              {CHARGES_OPT.map(c=><button key={c} className={`btn-${wrf.cargos.includes(c)?"p":"s"}`} style={{fontSize:10,padding:"4px 9px"}} onClick={()=>sw("cargos",wrf.cargos.includes(c)?wrf.cargos.filter(x=>x!==c):[...wrf.cargos,c])}>{c}</button>)}
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
    <div className="ov" onClick={()=>setSelWR(null)}>
      <div className="modal mlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">📋 Warehouse Receipt</div>
          <div style={{display:"flex",gap:6}}>
            {canEdit&&<button className="btn-s" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>{
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
            {canAdmin&&<button className="btn-s" style={{fontSize:10,padding:"4px 10px",color:"var(--red)",borderColor:"var(--red)"}} onClick={()=>{if(window.confirm(`¿Borrar WR ${selWR.id}? Esta acción no se puede deshacer.`)){setWrList(p=>p.filter(x=>x.id!==selWR.id));dbDeleteWR(selWR.id);logAction("Borró WR",selWR.id);setSelWR(null);}}}>🗑 Borrar</button>}
            <button className="btn-p" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir</button>
            <button className="mcl" onClick={()=>setSelWR(null)}>✕</button>
          </div>
        </div>
        <div className="wr-doc">
          <div className="wr-doc-hd">
            <div>
              <div className="wr-co">{empresaNombre}</div>
              <div className="wr-co-info">
                International Courier · {selWR.branch||_oc?.nombre||"Casa Matriz"}<br/>
                {_oc?.ciudad||selWR.origCity||"Miami"}{_oc?.pais?`, ${_oc.pais}`:""}<br/>
                {[_oc?.tel,_oc?.email].filter(Boolean).join(" · ")||"ops@enex.com"}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)",marginBottom:2}}>Warehouse Receipt</div>
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
              <div className="wf"><div className="wfl">Nombre</div><div className="wfv" style={{fontWeight:700,fontSize:13}}>{selWR.consignee||"—"}</div></div>
              <div className="wf"><div className="wfl">Casillero</div><div className="wfv" style={{color:"var(--gold2)",fontWeight:700,fontSize:13}}>#{selWR.casillero||"—"}</div></div>
              {_destAddr&&<div className="wf"><div className="wfl">Dirección</div><div className="wfv" style={{fontSize:11}}>{_destAddr}</div></div>}
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
                <div style={{fontWeight:600,fontSize:12,color:"var(--t1)"}}>{selWR.tipoPago||"—"}</div>
              </div>
              <div>
                <div className="wb-t">✈️ Tipo de Envío</div>
                <div><TypeBadge t={selWR.tipoEnvio}/></div>
              </div>
              <div>
                <div className="wb-t">⚡ Cargos Aplicables</div>
                <div style={{fontSize:11,color:"var(--t2)"}}>{selWR.cargos&&selWR.cargos.length>0?selWR.cargos.join(", "):"—"}</div>
              </div>
              <div>
                <div className="wb-t">📝 Notas y Observaciones</div>
                <div style={{fontSize:12,color:"var(--orange)",fontWeight:500,minHeight:32}}>{selWR.notas||"—"}</div>
              </div>
            </div>
          </div>
          <div className="wb" style={{marginBottom:12}}>
            <div className="wb-t">📐 Dimensiones y Peso — {selWR.cajas} {selWR.cajas===1?"caja":"cajas"}</div>
            {selWR.dims&&selWR.dims.length>0&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:4,marginBottom:4,padding:"4px 0",borderBottom:"2px solid var(--navy)"}}>
                  {["#","Dims (in)","Peso lb","P.Vol lb","Ft³","M³","Peso kg","P.Vol kg","Tracking","Carrier"].map(h=>(
                    <div key={h} style={{fontSize:8,color:"var(--navy)",fontWeight:700,textTransform:"uppercase",letterSpacing:.7}}>{h}</div>
                  ))}
                </div>
                {selWR.dims.map((d,i)=>{
                  const dv=calcVol(d.l,d.a,d.h,"cm");
                  const trk=d.tracking||selWR.tracking||"—";
                  const car=d.carrier||selWR.carrier||"—";
                  return (
                    <div key={i} style={{borderBottom:"1px solid var(--b2)",paddingBottom:6,marginBottom:4}}>
                      <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr",gap:4,padding:"4px 0",alignItems:"center"}}>
                        <div style={{fontWeight:700,color:"var(--navy)",fontSize:11}}>{i+1}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{toIn(d.l)}×{toIn(d.a)}×{toIn(d.h)}"</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:600}}>{toLb(d.pk)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--orange)",fontWeight:700}}>{dv.volLb}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--sky)"}}>{dv.ft3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--teal)"}}>{dv.m3}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--t2)"}}>{d.pk?.toFixed?.(2)||"—"}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--orange)"}}>{dv.volKg}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--cyan)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trk}</div>
                        <div style={{fontWeight:700,fontSize:11,color:"var(--navy)"}}>{car}</div>
                      </div>
                      {d.descripcion&&<div style={{fontSize:10,color:"var(--t2)",paddingLeft:28,marginTop:2}}>📦 {d.descripcion}</div>}
                      {d.factura&&<div style={{fontSize:10,color:"var(--t3)",paddingLeft:28}}>Factura: {d.factura}</div>}
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
              {/* Grupos de estados manuales para WR individuales */}
              {[
                {label:"📍 Origen",filter:s=>s.phase==="origen"&&!s.auto},
                {label:"⚠️ Excepciones",filter:s=>s.phase==="excep"},
                {label:"🚚 Entrega",filter:s=>s.phase==="entrega"&&!s.auto},
              ].map(grp=>{
                const sts=WR_STATUSES.filter(grp.filter);
                if(sts.length===0)return null;
                return(
                  <div key={grp.label} style={{marginBottom:8}}>
                    <div style={{fontSize:9,fontWeight:700,color:"var(--t3)",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{grp.label}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {sts.map(s=>(
                        <button key={s.code}
                          className={`btn-${selWR.status?.code===s.code?"p":"s"}`}
                          style={{fontSize:9,padding:"3px 8px"}}
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
              <div style={{fontSize:9,color:"var(--t3)",marginTop:4}}>Los estados 5→16 (tránsito) se actualizan desde la Guía Consolidada → cascada automática.</div>
            </div>
          )}
          <div className="wr-legal">
            NOTA: SE ESTÁ ENTREGANDO ESTA CAJA COMPLETAMENTE SELLADA. Certifico que este envío no contiene dinero, narcóticos, armas o dispositivos explosivos no autorizados. <strong>{empresaNombre} International Courier</strong> no se hace responsable de los artículos no retirados en los treinta (30) días siguientes a su recepción. Nuestra responsabilidad en siniestros será de $100 por recibo si el cliente no asegura la carga. SHIPPER autoriza a {empresaNombre} a inspeccionar la carga de acuerdo con el Programa IACSSP aprobado por la TSA. Al recibir este documento, da fe de haber leído y estar de acuerdo con los términos y regulaciones.
          </div>
          {/* Sección de entrega */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",gap:12,margin:"10px 0 6px"}}>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:9,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Entregado por</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:600,color:"var(--navy)"}}>{selWR.shipper||"—"}</div>
            </div>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:9,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Nombre completo del receptor</div>
              <div style={{height:20,borderBottom:"1px solid var(--b1)"}}/>
            </div>
            <div style={{borderTop:"2px solid var(--navy)",paddingTop:8}}>
              <div style={{fontSize:9,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:.5}}>Fecha y Hora de entrega</div>
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
            const P={fontFamily:"Arial,Helvetica,sans-serif",fontSize:11,color:"#000",lineHeight:1.4};
            const TH={border:"1px solid #888",padding:"3px 6px",background:"#ccc",fontSize:10,fontWeight:700,textAlign:"left"};
            const TD={border:"1px solid #888",padding:"4px 6px",fontSize:11,verticalAlign:"top"};
            const _cl2=clients.find(c=>c.id===selWR.clienteId);
            const _da=[_cl2?.dir,_cl2?.municipio,_cl2?.estado,_cl2?.pais].filter(Boolean).join(", ");
            const _oc2=oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith((selWR.origCity||"").toUpperCase()))||_origOff;
            return(
            <div style={{...P,padding:0,margin:0}}>

              {/* ── CABECERA ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:2}}><tbody><tr>
                {/* izquierda: empresa */}
                <td style={{verticalAlign:"top",paddingRight:16,width:"52%"}}>
                  <div style={{fontSize:32,fontWeight:900,letterSpacing:3,lineHeight:1,marginBottom:4,fontFamily:"Arial Black,Arial,sans-serif"}}>{empresaNombre}</div>
                  <div style={{fontSize:11,marginBottom:2}}>{_oc2?.ciudad||selWR.origCity||""}{_oc2?.pais?`, ${_oc2.pais}`:""}</div>
                  {_oc2?.email&&<div style={{fontSize:10,marginTop:2}}>{_oc2.email}</div>}
                  {_oc2?.tel&&<div style={{fontSize:10}}>Phone: {_oc2.tel}</div>}
                  <div style={{fontSize:9,color:"#666",marginTop:6}}>Powered by {empresaNombre} Courier System</div>
                </td>
                {/* derecha: WR # + barcode real */}
                <td style={{verticalAlign:"top",textAlign:"right",width:"48%"}}>
                  <div style={{fontSize:10,color:"#555",marginBottom:1}}>Warehouse Receipt #:</div>
                  <div style={{fontSize:28,fontWeight:900,fontFamily:"'Courier New',monospace",letterSpacing:2,lineHeight:1,marginBottom:3}}>{selWR.id}</div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:2}}>
                    <WRBarcode value={selWR.id} height={45} width={2}/>
                  </div>
                  <div style={{fontSize:9,color:"#444",marginTop:3}}>
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
                  </td>
                  <td style={{...TD,borderTop:"none"}}>
                    <div style={{fontWeight:700,fontSize:12}}>{selWR.consignee||"—"}</div>
                    <div style={{fontSize:10,fontWeight:700,color:"#333",marginTop:2}}>#{selWR.casillero||"—"}</div>
                    {_da&&<div style={{fontSize:10,marginTop:2}}>{_da}</div>}
                    <div style={{fontSize:10,marginTop:4}}>{selWR.destCity||"—"}, {(selWR.destCountry||"").replace(/[^\w\s]/gi,"").trim()}</div>
                  </td>
                </tr>
              </tbody></table>

              {/* ── PAYMENT INFO | CIUDAD DESTINO ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0}}><tbody>
                <tr>
                  <td style={{...TD,borderTop:"none",width:"55%",padding:"3px 6px"}}>
                    <div style={{fontSize:8,color:"#555"}}>Payment Type | Shipment Type | # Casillero | Insurance | Tipo Cliente</div>
                    <div style={{fontSize:11,fontWeight:600}}>{selWR.tipoPago||"—"} | {selWR.tipoEnvio||"POR DEFINIR"} | # {selWR.casillero||"—"} | | {(()=>{const c=_cl2;if(!c)return"—";if(c.clienteTipo==="matriz")return"Matriz";if(c.clienteTipo==="agente")return"Agente";return c.clienteTipo||"Cliente";})()}</div>
                  </td>
                  <td style={{...TD,borderTop:"none",borderLeft:"none",fontSize:14,fontWeight:700}}>
                    Ciudad Destino: {selWR.destCity||"—"}
                  </td>
                </tr>
              </tbody></table>

              {/* ── NOTAS ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0}}><tbody>
                <tr><td style={{...TD,borderTop:"none",minHeight:36,padding:"4px 6px"}}>
                  <span style={{fontWeight:700,fontSize:10}}>Notas:</span>{selWR.notas?" "+selWR.notas:""}
                </td></tr>
              </tbody></table>

              {/* ── TABLA DE DIMENSIONES — 15 filas por página ── */}
              {(()=>{
                const ROWS_PER_PAGE=15;
                const allDims=selWR.dims&&selWR.dims.length>0?selWR.dims:[];
                const cajasCount=parseInt(selWR.cajas)||0;
                const totalRows=Math.max(allDims.length,cajasCount);
                const rows=Array.from({length:Math.max(totalRows,1)},(_,i)=>allDims[i]||{});
                const chunks=[];
                for(let i=0;i<rows.length;i+=ROWS_PER_PAGE)chunks.push(rows.slice(i,i+ROWS_PER_PAGE));
                if(chunks.length===0)chunks.push([]);
                const totalPages=chunks.length;
                const DimThead=()=><thead><tr>
                  <th style={{...TH,width:"7%"}}>Line/Qty</th>
                  <th style={{...TH,width:"13%"}}>Dimensions (In)</th>
                  <th style={{...TH,width:"28%"}}>Tracking</th>
                  <th style={{...TH,width:"10%",textAlign:"right"}}>Weight lb</th>
                  <th style={{...TH,width:"10%",textAlign:"right"}}>Vol lb</th>
                  <th style={{...TH,width:"9%",textAlign:"right"}}>Ft³</th>
                  <th style={{...TH,width:"9%",textAlign:"right"}}>M³</th>
                  <th style={{...TH,width:"10%",textAlign:"right"}}>Weight Kg</th>
                </tr></thead>;
                return chunks.map((chunk,pi)=>{
                  const offset=pi*ROWS_PER_PAGE;
                  const isLast=pi===totalPages-1;
                  return(
                  <div key={pi} className="wr-page-chunk" style={pi>0?{pageBreakBefore:"always",breakBefore:"page",paddingTop:"0.45in",display:"block"}:{display:"block"}}>
                    {pi>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #000",paddingBottom:4,marginBottom:6,fontSize:10}}>
                      <span style={{fontWeight:700}}>{empresaNombre}</span>
                      <span>WR# {selWR.id}</span>
                      <span>{selWR.consignee} | {selWR.casillero}</span>
                      <span>Pág. {pi+1}/{totalPages}</span>
                    </div>}
                    <table style={{width:"100%",borderCollapse:"collapse",marginBottom:0,marginTop:pi===0?4:0}}>
                      <DimThead/>
                      <tbody>
                        {chunk.length===0?<tr><td colSpan={8} style={{...TD,textAlign:"center",height:60,color:"#999"}}>Sin dimensiones registradas</td></tr>
                        :chunk.map((d,i)=>{
                          const idx=offset+i;
                          const hasDims=d.l||d.a||d.h;
                          const dv=hasDims?calcVol(d.l||0,d.a||0,d.h||0,"cm"):{volLb:0,ft3:0,m3:0};
                          return(
                          <tr key={idx}>
                            <td style={{...TD,verticalAlign:"top"}}>{idx+1}</td>
                            <td style={{...TD,verticalAlign:"top"}}>
                              {hasDims?<div>{toIn(d.l)}x{toIn(d.a)}x{toIn(d.h)}</div>:<div style={{color:"#999"}}>—</div>}
                              {d.carrier&&<div style={{fontSize:9,color:"#555"}}>{d.carrier}</div>}
                            </td>
                            <td style={{...TD,fontSize:10,verticalAlign:"top",fontFamily:"'Courier New',monospace"}}>
                              {d.tracking&&<div>{d.tracking}</div>}
                              {d.descripcion&&<div style={{fontSize:10,fontFamily:"Arial",color:"#222"}}>{d.descripcion}</div>}
                              {d.factura&&<div style={{fontSize:9,fontFamily:"Arial",color:"#555"}}>Fact: {d.factura}</div>}
                            </td>
                            <td style={{...TD,textAlign:"right",fontWeight:700}}>{d.pk?toLb(d.pk):"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.volLb:"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.ft3:"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{hasDims?dv.m3:"—"}</td>
                            <td style={{...TD,textAlign:"right"}}>{d.pk?.toFixed?.(2)||"—"}</td>
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
                          <td style={{...TD,fontWeight:700,textAlign:"right"}}>{selWR.pesoKg}</td>
                        </tr>
                      </tfoot>}
                    </table>
                  </div>);
                });
              })()}

              {/* ── ENTREGADO POR ── */}
              <table style={{width:"100%",borderCollapse:"collapse",marginTop:4}}><tbody>
                <tr>
                  <td style={{...TD,width:"33%",borderRight:"none"}}>
                    <div style={{fontSize:9,color:"#555"}}>Entregado por:</div>
                    <div style={{fontWeight:700}}>{selWR.shipper||"—"}</div>
                  </td>
                  <td style={{...TD,width:"34%",borderRight:"none"}}>
                    <div style={{fontSize:9,color:"#555"}}>Nombre Completo</div>
                    <div style={{height:18}}/>
                  </td>
                  <td style={{...TD,width:"33%"}}>
                    <div style={{fontSize:9,color:"#555"}}>Fecha y Hora</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:18}}>
                      <span/>
                      <span style={{fontSize:9,color:"#555"}}>Pag: 1/1</span>
                    </div>
                  </td>
                </tr>
              </tbody></table>

              {/* ── TEXTO LEGAL ── */}
              <div style={{fontSize:9,lineHeight:1.6,color:"#333",textAlign:"center",marginTop:8,borderTop:"1px solid #ccc",paddingTop:6}}>
                <div style={{fontWeight:700,marginBottom:3,fontSize:10}}>NOTA: SE ESTA ENTREGANDO ESTA CAJA COMPLETAMENTE SELLADA.</div>
                Certifico que este envío no contiene dinero, narcóticos, armas o dispositivos explosivos no autorizados. {empresaNombre} no se hace responsable de los artículos no retirados en los treinta (30) días siguientes a su recepción. Nuestra responsabilidad en caso de siniestros durante el transporte aéreo o marítimo, extravío o robos será de $100 dólares por recibo de almacén, si el cliente no asegura la carga. Estoy de acuerdo con que este envío está sujeto a los controles de seguridad de la compañía y otras regulaciones gubernamentales. SHIPPER autoriza a {empresaNombre} a que inspeccione toda la carga ofrecida del comercio aéreo a partir de la fecha de esta notificación de acuerdo con su Programa de Seguridad Standart de Transporte Aéreo Indirecto (IACSSP) aprobado por la TSA. Al recibir este documento y girar instrucciones de envío, da fe de haber leído, entendido y estar totalmente de acuerdo con los términos y regulaciones.
              </div>

            </div>);
          })()}
        </div>

        <div className="mft">
          <button className="btn-s" onClick={()=>setSelWR(null)}>Cerrar</button>
          <button className="btn-g" style={{fontSize:10,padding:"4px 10px"}}>📧 Enviar al Cliente</button>
        </div>
      </div>
    </div>
  );};

  // ── STAT MODAL (clickable stats) ────────────────────────────────────────────
  const renderStatModal=()=>showStatModal&&(
    <div className="ov" onClick={()=>setShowStatModal(null)}>
      <div className="modal mlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div className="mt">{showStatModal.ic} {showStatModal.label} — {showStatModal.rows.length} registros</div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn-p" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir lista</button>
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
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:12}}>
            👤 Estado de Cuenta — Búsqueda de Cliente
          </div>
          <div style={{position:"relative"}}>
            <div style={{display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,fontSize:13}} value={ecSearch}
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
                    <div style={{width:32,height:32,borderRadius:8,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{initials(c)}</div>
                    <div>
                      <div style={{fontWeight:600,color:"var(--t1)",fontSize:13}}>{fullName(c)}</div>
                      <div style={{fontSize:11,color:"var(--t3)"}}>{c.casillero} · {c.email} · {c.tel1}</div>
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
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,marginBottom:14,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",boxShadow:"var(--shadow)"}}>
              <div style={{width:56,height:56,borderRadius:12,background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20}}>{initials(ecCliente)}</div>
              <div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)"}}>{fullName(ecCliente)}</div>
                <div style={{display:"flex",gap:16,marginTop:4,fontSize:11,color:"var(--t2)",flexWrap:"wrap"}}>
                  <span>📦 Casillero: <strong style={{color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{ecCliente.casillero}</strong></span>
                  <span>📧 {ecCliente.email}</span>
                  <span>📞 {ecCliente.tel1}</span>
                  <span>📍 {ecCliente.municipio}, {ecCliente.estado}</span>
                </div>
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
                  <div style={{fontSize:15,marginBottom:4}}>{s.ic}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>{s.v}</div>
                  <div style={{fontSize:10,color:"var(--t2)",marginTop:2}}>{s.l}</div>
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
                          style={{padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
                            background:ecFiltro===f.k?"var(--navy)":"transparent",
                            color:ecFiltro===f.k?"#fff":"var(--t2)",transition:"all .1s",display:"flex",alignItems:"center",gap:4}}>
                          {f.l}
                          <span style={{background:ecFiltro===f.k?"rgba(255,255,255,.2)":"var(--bg5)",borderRadius:3,padding:"0 5px",fontSize:9,fontWeight:800}}>{cnt}</span>
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
                  <span style={{fontSize:10,color:"var(--t3)",padding:"2px 8px",background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4}}>{wrCliente.length} registros</span>
                  <button className="btn-p" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Imprimir</button>
                </div>
              </div>

              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5,whiteSpace:"nowrap"}}>
                  <thead>
                    <tr style={{background:"var(--navy)"}}>
                      {["N° WR","Cajas","Peso lb","P.Vol lb","Ft³","M³","Recibido","Confirmado","Consolidado","Enviado","Alm. Destino","Entregado","N° Guía","Tipo Envío","Contenido","Valor"].map(h=>(
                        <th key={h} style={{color:"rgba(255,255,255,.8)",fontSize:9,letterSpacing:.8,textTransform:"uppercase",fontWeight:700,padding:"7px 8px",textAlign:"left",borderBottom:"2px solid var(--navy3)",whiteSpace:"nowrap"}}>{h}</th>
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
                          <div onClick={()=>setSelWR(w)} style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:11,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",display:"inline-block",cursor:"pointer",textDecoration:"underline"}}
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
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10}}>{getStatusDate(w,"recibido")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:getStatusDate(w,"confirmado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"confirmado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:getStatusDate(w,"consolidado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"consolidado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:getStatusDate(w,"enviado")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"enviado")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:getStatusDate(w,"almacen_dest")==="—"?"var(--t3)":"var(--t1)"}}>{getStatusDate(w,"almacen_dest")}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:getStatusDate(w,"entregado")==="—"?"var(--t3)":"var(--green)",fontWeight:getStatusDate(w,"entregado")==="—"?400:700}}>{getStatusDate(w,"entregado")}</td>
                        {/* N° Guía — generado al consolidar, NO es el tracking del carrier */}
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--purple)",fontWeight:600}}>{getNumGuia(w)}</td>
                        <td style={{padding:"7px 8px"}}><TypeBadge t={w.tipoEnvio}/></td>
                        <td style={{padding:"7px 8px",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",color:"var(--t2)"}}>{w.descripcion||"—"}</td>
                        <td style={{padding:"7px 8px",fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${w.valor?.toFixed(2)||"0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                  {wrCliente.length>0&&(
                    <tfoot>
                      <tr style={{background:"var(--bg4)",borderTop:"2px solid var(--navy)"}}>
                        <td colSpan={2} style={{padding:"8px",fontWeight:700,fontSize:11,color:"var(--navy)"}}>TOTALES</td>
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
  const updateGuideStatus=(consolId,stCode)=>{
    const st=WR_STATUSES.find(s=>s.code===stCode);
    if(!st)return;
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

    const n={
      id:buildConsolNum(offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.origCity.toUpperCase()))||oficinas[0]),offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.destCity.toUpperCase()))||oficinas[oficinas.length-1]||oficinas[0]),(()=>{if(consolList.length===0)return 1;const nums=consolList.map(c=>{const m=String(c.id||"").match(/(\d+)(?=[^0-9]*$)/);return m?parseInt(m[1]):0;});return Math.max(...nums)+1;})(),consolNumTipo,consolSecInicio,cf.tipoEnvio||"Marítimo"),
      fecha:now,destino:cf.destino,tipoEnvio:cf.tipoEnvio,
      fechaSalida:cf.fechaSalida,fechaLlegada:"",numVuelo:cf.numVuelo,awb:cf.awb,bl:cf.bl,
      notas:cf.notas,containers:cf.containers,
      wrIds:allWR.map(w=>w.id),
      totalWR,totalCajas,totalLb,totalFt3,totalM3,totalVolLb,
      status:"En preparación",usuario:currentUser.id,
    };
    setConsolList(p=>[n,...p]);
    dbUpsertConsolidacion(n);
    setShowNewConsol(false);
    setCf(emptyConsol(SEND_TYPES[0]||""));
    setContScanVal({});
    setContScanErr({});
    logAction("Cerró embarque",n.id);
    setShowLabels({
      wr:{id:n.id,origCity:OFFICE_CONFIG.origCity,origCountry:"USA 🇺🇸",destCity:cf.destino,destCountry:"Venezuela 🇻🇪",
        consignee:"CONSOLIDADO",casillero:"—",fecha:n.fecha,branch:OFFICE_CONFIG.branch,tipoEnvio:cf.tipoEnvio,
        shipper:"ENEX",cajas:totalCajas,pesoLb:totalLb,volLb:totalVolLb,ft3:totalFt3,m3:totalM3},
      dims:(cf.containers||[]).map((ct,i)=>({l:0,a:0,h:0,pk:0,pkLb:parseFloat(ct.pesoLb)||0,volLb:0,ft3:0,m3:0,tracking:`Cont. ${i+1} · ${ct.tipo} · Sello: ${ct.sello||"—"}`})),
      remitente:"ENEX",tipoEnvio:cf.tipoEnvio,
    });
  };

  // ── ETIQUETAS ───────────────────────────────────────────────────────────────
  const renderConsolidacion=()=>(
    <div className="page-scroll">
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700,color:"var(--navy)"}}>🗂️ Consolidación de Embarques</div>
          <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>Agrupa WR confirmados en contenedores y genera el embarque.</div>
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
              <th>Vuelo/Barco</th><th>AWB / BL</th><th>Salida</th><th>Estado</th><th>Acc.</th>
            </tr></thead>
            <tbody>
              {consolList.map(c=>(
                <tr key={c.id}>
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",background:"#EEF3FF",padding:"2px 6px",borderRadius:4,border:"1px solid #B8C8F0",fontSize:11}}>{c.id}</span></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{fmtDate(c.fecha)}</td>
                  <td style={{fontWeight:600,color:"var(--t1)"}}>{c.destino}</td>
                  <td><TypeBadge t={c.tipoEnvio}/></td>
                  <td style={{textAlign:"center",fontWeight:700}}>{c.containers.length}</td>
                  <td style={{textAlign:"center",fontWeight:700,color:"var(--navy)"}}>{c.totalWR}</td>
                  <td style={{textAlign:"center"}}>{c.totalCajas}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t1)",fontWeight:600}}>{c.totalLb}lb</td>
                  <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{c.totalFt3}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--cyan)"}}>{c.numVuelo||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--purple)"}}>{c.awb||c.bl||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{c.fechaSalida||"—"}</td>
                  <td style={{minWidth:130}}>
                    <div style={{marginBottom:4}}><span className="st s3"><span className="st-dot"/>{c.status||"En preparación"}</span></div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                      {WR_STATUSES.filter(s=>s.guide).map(s=>(
                        <button key={s.code} title={s.label}
                          className={`btn-${c.status===s.label?"p":"s"}`}
                          style={{fontSize:8,padding:"1px 5px",lineHeight:1.4}}
                          onClick={()=>updateGuideStatus(c.id,s.code)}>
                          {s.code}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="btn-c" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>setShowLabels({
                      wr:{id:c.id,origCity:OFFICE_CONFIG.origCity,origCountry:"USA 🇺🇸",destCity:c.destino,destCountry:"Venezuela 🇻🇪",
                        consignee:"CONSOLIDADO",casillero:"—",fecha:c.fecha,branch:OFFICE_CONFIG.branch,tipoEnvio:c.tipoEnvio,
                        shipper:"ENEX",cajas:c.totalCajas,pesoLb:c.totalLb,volLb:c.totalVolLb,ft3:c.totalFt3,m3:c.totalM3},
                      dims:c.containers.map((ct,i)=>({l:0,a:0,h:0,pk:0,pkLb:parseFloat(ct.pesoLb)||0,volLb:0,ft3:0,m3:0,tracking:`Cont. ${i+1} · ${ct.tipo} · Sello: ${ct.sello||"—"}`})),
                      remitente:"ENEX",tipoEnvio:c.tipoEnvio,
                    })}>🏷️ Etiquetas</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NUEVO EMBARQUE */}
      {showNewConsol&&(
        <div className="ov" onClick={()=>setShowNewConsol(false)}>
          <div className="modal mxl" onClick={e=>e.stopPropagation()}>
            <div className="mhd">
              <div className="mt">🗂️ Nuevo Embarque Consolidado</div>
              <button className="mcl" onClick={()=>setShowNewConsol(false)}>✕</button>
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
                <div style={{color:"var(--t3)",fontSize:11,padding:"8px 0"}}>No hay WR confirmados disponibles.</div>
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
                  <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--navy)",fontSize:12}}>{w.id}</span>
                  <span style={{color:"var(--t2)",fontSize:11}}>{w.consignee}</span>
                  <span style={{color:"var(--t3)",fontSize:10,background:"var(--bg4)",padding:"1px 5px",borderRadius:3}}>{w.cajas}cj · {w.pesoLb}lb</span>
                  <span style={{color:"var(--green)",fontSize:12}}>+</span>
                </div>
              ))}
            </div>

            {/* CONTAINERS */}
            <div className="sdiv">CONTENEDORES</div>
            {cf.containers.map((cont,ci)=>{
              const contWRPeso=parseFloat(cont.wr.reduce((s,w)=>s+(w.pesoLb||0),0).toFixed(1));
              const contWRCajas=cont.wr.reduce((s,w)=>s+(w.cajas||1),0);
              const contType=CONTAINER_TYPES.find(t=>t.code===cont.tipo)||CONTAINER_TYPES[0];
              const pct=contType.maxLb>0?Math.min(100,Math.round((contWRPeso/contType.maxLb)*100)):0;
              return (
                <div key={ci} style={{border:"2px solid var(--navy)",borderRadius:10,marginBottom:12,overflow:"hidden"}}>
                  {/* Header container */}
                  <div style={{background:"var(--navy)",padding:"8px 14px",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{color:"#E5AE3A",fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:14}}>
                      📦 CONTENEDOR {ci+1}
                    </span>
                    <select value={cont.tipo} onChange={e=>scCont(ci,"tipo",e.target.value)}
                      style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:5,color:"#fff",padding:"3px 8px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      {CONTAINER_TYPES.map(t=><option key={t.code} value={t.code} style={{background:"var(--navy)"}}>{t.name}</option>)}
                    </select>
                    <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>{contType.dim}</span>
                    <div style={{flex:1}}/>
                    <span style={{fontSize:11,color:"#E5AE3A",fontWeight:600}}>{cont.wr.length} WR · {contWRCajas} cajas · {contWRPeso}lb</span>
                    {cf.containers.length>1&&(
                      <button onClick={()=>removeContainer(ci)} style={{background:"rgba(204,34,51,.3)",border:"1px solid rgba(204,34,51,.5)",color:"#FF8888",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontSize:11}}>🗑</button>
                    )}
                  </div>

                  <div style={{padding:"12px 14px"}}>
                    {/* Barra de capacidad */}
                    <div style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3}}>
                        <span style={{color:"var(--t2)"}}>Capacidad usada</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:pct>90?"var(--red)":pct>70?"var(--orange)":"var(--green)"}}>{contWRPeso}lb / {contType.maxLb}lb ({pct}%)</span>
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
                        <input className="fi" style={{fontFamily:"'DM Mono',monospace",flex:1,fontWeight:600,fontSize:13}}
                          autoFocus={ci===cf.containers.length-1}
                          value={contScanVal[ci]||""}
                          onChange={e=>handleContScan(ci,e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")doContScan(ci);}}
                          placeholder="Escanear o escribir N° WR…"/>
                        <button className="scan-btn" onClick={()=>doContScan(ci)}>📡 Agregar</button>
                      </div>
                      {contScanErr[ci]&&<div style={{fontSize:10,color:"var(--red)",marginTop:4}}>⚠️ {contScanErr[ci]}</div>}
                    </div>

                    {/* WR en este contenedor */}
                    {cont.wr.length>0&&(
                      <div style={{border:"1px solid var(--b1)",borderRadius:7,overflow:"hidden"}}>
                        <table className="ct" style={{fontSize:10}}>
                          <thead><tr><th>#</th><th>N° WR</th><th>Consignatario</th><th>Cajas</th><th>Peso lb</th><th>Ft³</th><th>Descripción</th><th></th></tr></thead>
                          <tbody>
                            {cont.wr.map((w,wi)=>(
                              <tr key={w.id}>
                                <td style={{color:"var(--t3)"}}>{wi+1}</td>
                                <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:10}}>{w.id}</span></td>
                                <td style={{fontWeight:600}}>{w.consignee}</td>
                                <td style={{textAlign:"center"}}>{w.cajas}</td>
                                <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{w.pesoLb}lb</td>
                                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{w.ft3}</td>
                                <td style={{color:"var(--t2)"}}>{w.descripcion||"—"}</td>
                                <td><span style={{cursor:"pointer",color:"var(--red)",fontSize:12}} onClick={()=>{
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
            <button onClick={addContainer} style={{width:"100%",padding:"10px",border:"2px dashed var(--navy)",borderRadius:10,background:"rgba(26,43,74,.04)",color:"var(--navy)",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:16}}>📦</span> + Agregar
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
                  <div style={{fontWeight:700,color:"var(--navy)",fontSize:10,textTransform:"uppercase",letterSpacing:1,gridColumn:"1/-1",marginBottom:4}}>TOTALES DEL EMBARQUE</div>
                  {[["WR incluidos",tWR,"var(--navy)"],["Total cajas",tCajas,"var(--t1)"],["Peso total",`${tLb}lb`,"var(--t1)"],["Ft³ total",String(tFt3),"var(--sky)"]].map(([l,v,c])=>(
                    <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"7px 10px",border:"1px solid var(--b1)"}}>
                      <div style={{fontSize:9,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:c,fontSize:14}}>{v}</div>
                    </div>
                  ))}
                </div>
              ):null;
            })()}

            <div className="mft">
              <button className="btn-s" onClick={()=>{setShowNewConsol(false);setCf(emptyConsol(SEND_TYPES[0]||""));setContScanVal({});setContScanErr({});}}>Cancelar</button>
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
  const renderEtiquetasPage=()=>(
    <div className="page-scroll">
      <div className="card" style={{maxWidth:640}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:10}}>🏷️ Imprimir Etiquetas</div>
        <input className="fi" style={{marginBottom:12}} value={etqSearch} onChange={e=>setEtqSearch(e.target.value)} placeholder="Buscar WR por número, nombre o casillero…"/>
        {etqSearch.length>1&&(wrList||[]).filter(w=>w.id.toLowerCase().includes(etqSearch.toLowerCase())||(w.consignee||"").toLowerCase().includes(etqSearch.toLowerCase())).slice(0,20).map(w=>(
          <div key={w.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"1px solid var(--b1)",marginBottom:6,cursor:"pointer",background:"var(--bg3)"}}
            onClick={()=>setShowLabels({wr:w,dims:w.dims||[],remitente:w.shipper||"",tipoEnvio:w.tipoEnvio||""})}>
            <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:12,color:"var(--navy)"}}>{w.id}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{w.consignee}</div><div style={{fontSize:11,color:"var(--t3)"}}>{w.casillero} · {w.cajas} cajas</div></div>
            <StBadge st={w.status}/>
            <span style={{color:"var(--cyan)",fontSize:12,fontWeight:600}}>🏷️ Imprimir</span>
          </div>
        ))}
        {etqSearch.length<=1&&<div style={{color:"var(--t3)",fontSize:12,textAlign:"center",padding:20}}>Escribe al menos 2 caracteres para buscar</div>}
      </div>
    </div>
  );

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
              style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--b1)",cursor:"pointer",fontSize:12,fontWeight:600,
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
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:4}}>📦 Numeración de WR</div>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:12}}>Selecciona el tipo y el número de inicio de secuencia.</div>
              {[
                {v:1,l:"Tipo 1 — 7 dígitos secuenciales",ex:"0000001"},
                {v:2,l:"Tipo 2 — Indicativo + Oficina Origen + Oficina Destino + Secuencia",ex:`${empresaSlug}01MIA01VLN0000001`},
                {v:3,l:"Tipo 3 — País+Ciudad Origen + País+Ciudad Destino + Secuencia",ex:"01MI58VL0000001"},
              ].map(t=>(
                <div key={t.v} onClick={()=>setWrNumTipo(t.v)} style={{padding:"10px 12px",borderRadius:8,border:`2px solid ${wrNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:wrNumTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:8,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${wrNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:wrNumTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                    <div style={{fontWeight:600,fontSize:12,color:"var(--t1)"}}>{t.l}</div>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--cyan)",marginTop:4,marginLeft:24}}>Ej: {t.ex}</div>
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
              <div style={{marginTop:10,padding:"8px 12px",background:"var(--bg4)",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--navy)",fontWeight:700}}>
                Próximo WR: {buildWRNum(_wrOrigCode,_wrDestCode,_wrNextSeq,wrNumTipo,wrSecInicio,empresaSlug)}
              </div>
            </div>

            {/* GUÍA CONSOLIDADA */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"16px"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:4}}>🗂️ Numeración de Guía Consolidada</div>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:12}}>Selecciona el tipo y el número de inicio de secuencia.</div>
              {[
                {v:1,l:"Tipo 1 — 7 dígitos secuenciales",ex:"0000001"},
                {v:2,l:"Tipo 2 — Oficina Origen + Oficina Destino + Secuencia",ex:"01VLN01CCS0000001"},
                {v:3,l:"Tipo 3 — Fecha + Oficina Destino + Secuencia + Tipo Envío",ex:"26040801VLN0000001M"},
              ].map(t=>(
                <div key={t.v} onClick={()=>setConsolNumTipo(t.v)} style={{padding:"10px 12px",borderRadius:8,border:`2px solid ${consolNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:consolNumTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:8,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${consolNumTipo===t.v?"var(--navy)":"var(--b1)"}`,background:consolNumTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                    <div style={{fontWeight:600,fontSize:12,color:"var(--t1)"}}>{t.l}</div>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--cyan)",marginTop:4,marginLeft:24}}>Ej: {t.ex}</div>
                </div>
              ))}
              <div className="fg" style={{marginTop:8}}>
                <div className="fl">Número de inicio de secuencia</div>
                <input className="fi" type="number" min="1" style={{maxWidth:150,fontFamily:"'DM Mono',monospace",fontWeight:700}} value={consolSecInicio} onChange={e=>setConsolSecInicio(parseInt(e.target.value)||1)}/>
              </div>
              <div style={{marginTop:10,padding:"8px 12px",background:"var(--bg4)",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--navy)",fontWeight:700}}>
                Próxima Guía: {buildConsolNum(offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.origCity.toUpperCase()))||oficinas[0]),offCode(oficinas.find(o=>(o.ciudad||"").toUpperCase().startsWith(OFFICE_CONFIG.destCity.toUpperCase()))||oficinas[oficinas.length-1]||oficinas[0]),(()=>{if(consolList.length===0)return 1;const nums=consolList.map(c=>{const m=String(c.id||"").match(/(\d+)(?=[^0-9]*$)/);return m?parseInt(m[1]):0;});return Math.max(...nums)+1;})(),consolNumTipo,consolSecInicio,"Marítimo")}
              </div>
            </div>

            {/* ETIQUETAS */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"16px",gridColumn:"1/-1"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:12}}>🏷️ Tipo de Etiqueta Predeterminada</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:8}}>📦 Etiqueta WR</div>
                  {[{v:1,l:"6×4 pulg. — Tipo 1 (completa con 8 franjas)"},{v:2,l:"6×4 pulg. — Tipo 2 (limpia y moderna)"},{v:3,l:"2×4 pulg. — Tipo 1 (compacta 3 franjas)"},{v:4,l:"2×4 pulg. — Tipo 2 (diseño ENEX)"}].map(t=>(
                    <div key={t.v} onClick={()=>setLabelWRTipo(t.v)} style={{padding:"8px 12px",borderRadius:6,border:`2px solid ${labelWRTipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelWRTipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${labelWRTipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelWRTipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                      <div style={{fontSize:12,fontWeight:600}}>{t.l}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:8}}>🗂️ Etiqueta Guía Consolidada</div>
                  {[{v:1,l:"6×4 pulg. — Tipo 1 (completa)"},{v:2,l:"6×4 pulg. — Tipo 2 (limpia)"},{v:3,l:"2×4 pulg. — Tipo 1 (compacta)"},{v:4,l:"2×4 pulg. — Tipo 2 (diseño ENEX)"}].map(t=>(
                    <div key={t.v} onClick={()=>setLabelCSATipo(t.v)} style={{padding:"8px 12px",borderRadius:6,border:`2px solid ${labelCSATipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelCSATipo===t.v?"#EEF3FF":"var(--bg3)",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${labelCSATipo===t.v?"var(--navy)":"var(--b1)"}`,background:labelCSATipo===t.v?"var(--navy)":"transparent",flexShrink:0}}/>
                      <div style={{fontSize:12,fontWeight:600}}>{t.l}</div>
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
              <button className="btn-p" style={{padding:"9px 24px",fontSize:13}} onClick={()=>{
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
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:8}}>💲 Cargos Adicionales</div>
            <div style={{fontSize:11,color:"var(--t3)",marginBottom:10}}>Los cargos adicionales se gestionan junto con Servicios. Ambas listas se usan en la creación de WR.</div>
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
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:12}}>📦 Tipos de Contenedor</div>
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
                {cfgEditContIdx!==null&&<button className="btn-s" style={{padding:"8px 10px",fontSize:11}} onClick={()=>{setCfgEditContIdx(null);setCfgNewCont({code:"",name:"",dim:"",maxLb:""});}}>✕</button>}
              </div>
            </div>
            {/* Lista */}
            <table className="ct">
              <thead><tr><th>Código</th><th>Nombre</th><th>Dimensiones</th><th>Máx. lb</th><th>Acc.</th></tr></thead>
              <tbody>
                {CONTAINER_TYPES.length===0&&<tr><td colSpan={5} style={{textAlign:"center",padding:24,color:"var(--t3)"}}>No hay tipos de contenedor registrados.</td></tr>}
                {CONTAINER_TYPES.map((c,i)=>(
                  <tr key={i} style={{background:cfgEditContIdx===i?"#EEF3FF":""}}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--navy)",fontSize:13}}>{c.code}</span></td>
                    <td style={{fontWeight:600}}>{c.name}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--t2)"}}>{c.dim}</td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{(c.maxLb||0).toLocaleString()}lb</td>
                    <td><div style={{display:"flex",gap:4}}>
                      <button className="btn-s" style={{fontSize:10,padding:"2px 8px"}} onClick={()=>{setCfgNewCont({code:c.code,name:c.name,dim:c.dim,maxLb:c.maxLb});setCfgEditContIdx(i);}}>✏️ Editar</button>
                      <button className="btn-d" style={{fontSize:10,padding:"2px 8px"}} onClick={()=>{const n=CONTAINER_TYPES.filter((_,j)=>j!==i);setContainerTypes(n);dbSetConfig('container_types',n);if(cfgEditContIdx===i){setCfgEditContIdx(null);setCfgNewCont({code:"",name:"",dim:"",maxLb:""});}}}>🗑</button>
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
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)"}}>🌎 Países</div>
              {/* Agregar país */}
              <div style={{padding:"10px 12px",borderBottom:"1px solid var(--b1)"}}>
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr auto",gap:6,alignItems:"flex-end"}}>
                  <div className="fg"><div className="fl" style={{fontSize:9}}>Código</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontSize:11}} value={cfgNewPais.dial} onChange={e=>setCfgNewPais(p=>({...p,dial:e.target.value}))} placeholder="57"/></div>
                  <div className="fg"><div className="fl" style={{fontSize:9}}>País + Bandera</div><input className="fi" style={{fontSize:11}} value={cfgNewPais.name} onChange={e=>setCfgNewPais(p=>({...p,name:e.target.value}))} placeholder="Colombia 🇨🇴"/></div>
                  <button className="btn-p" style={{padding:"6px 10px",fontSize:11,alignSelf:"flex-end"}} onClick={()=>{
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
                      <div style={{fontWeight:600,fontSize:12}}>{c.name}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--t3)"}}>+{c.dial} · {c.cities.length} ciudades</div>
                    </div>
                    <span onClick={e=>{e.stopPropagation();const n=COUNTRIES.filter((_,j)=>j!==i);setCountries(n);dbSetConfig('countries',n);if(cfgSelPais>=i)setCfgSelPais(Math.max(0,cfgSelPais-1));}} style={{color:"var(--red)",cursor:"pointer",fontSize:13,fontWeight:700}}>×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ciudades del país seleccionado */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)"}}>
                🏙️ Ciudades — {COUNTRIES[cfgSelPais]?.name||"Selecciona un país"}
              </div>
              {COUNTRIES[cfgSelPais]&&(
                <>
                  <div style={{padding:"10px 12px",borderBottom:"1px solid var(--b1)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"80px 1fr auto",gap:6,alignItems:"flex-end"}}>
                      <div className="fg"><div className="fl" style={{fontSize:9}}>Código</div><input className="fi" style={{fontFamily:"'DM Mono',monospace",fontWeight:700}} value={cfgNewCity.code} onChange={e=>setCfgNewCity(p=>({...p,code:e.target.value.toUpperCase()}))} placeholder="MED"/></div>
                      <div className="fg"><div className="fl" style={{fontSize:9}}>Nombre Ciudad</div><input className="fi" value={cfgNewCity.name} onChange={e=>setCfgNewCity(p=>({...p,name:e.target.value}))} placeholder="Medellín"/></div>
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
                      <div key={ci} style={{display:"inline-flex",alignItems:"center",gap:5,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:6,padding:"4px 10px",fontSize:12}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:11}}>{c.code}</span>
                        <span style={{color:"var(--t2)"}}>{c.name}</span>
                        <span onClick={()=>{const n=COUNTRIES.map((co,i)=>i===cfgSelPais?{...co,cities:co.cities.filter((_,j)=>j!==ci)}:co);setCountries(n);dbSetConfig('countries',n);}} style={{color:"var(--red)",cursor:"pointer",fontSize:14,fontWeight:700}}>×</span>
                      </div>
                    ))}
                    {(COUNTRIES[cfgSelPais]?.cities||[]).length===0&&<div style={{color:"var(--t3)",fontSize:11,padding:"8px 0"}}>No hay ciudades registradas.</div>}
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
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",flex:1}}>🤝 Agentes registrados</div>
              <button className="btn-p" style={{fontSize:11}} onClick={()=>{setAgForm({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:""});setShowNewAgente(true);}}>+ Nuevo Agente</button>
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
                      <td style={{fontSize:11}}>{a.ciudad||"—"}</td>
                      <td style={{fontSize:11}}>{a.pais||"—"}</td>
                      <td style={{fontSize:11,fontFamily:"'DM Mono',monospace"}}>{a.tel||"—"}</td>
                      <td style={{fontSize:11,color:"var(--cyan)"}}>{a.email||"—"}</td>
                      <td style={{fontSize:11}}>{a.contacto||"—"}</td>
                      <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:4,fontWeight:700,background:a.activo?"#E8F8EE":"#FEE8E8",color:a.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:a.activo?"#80D0A0":"#F0A0A0"}}>{a.activo?"✅ Activo":"❌ Inactivo"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        <span className="ic-b" onClick={()=>{setAgForm(a);setEditAgente(a);setShowNewAgente(true);}}>✏️</span>
                        <span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{setAgentes(p=>p.filter(x=>x.id!==a.id));logAction("Borró agente",`${a.codigo} — ${a.nombre}`);}}>🗑</span>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showNewAgente&&(
              <div className="ov" onClick={()=>setShowNewAgente(false)}>
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
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",flex:1}}>🏢 Oficinas / Sucursales</div>
              <button className="btn-p" style={{fontSize:11}} onClick={()=>{setOfForm({nombre:"",ciudad:"",pais:"",tel:"",email:"",contacto:"",notas:"",tipo:"Matriz"});setShowNewOficina(true);}}>+ Nueva Oficina</button>
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
                      <td><span style={{fontSize:9,padding:"2px 10px",borderRadius:4,fontWeight:700,
                        background:o.tipo==="Asociado"?"#FEF0E8":"#EEF3FF",
                        color:o.tipo==="Asociado"?"var(--orange)":"var(--navy)",
                        border:"1px solid",
                        borderColor:o.tipo==="Asociado"?"#F0B880":"#B8C8F0"}}>
                        {o.tipo==="Asociado"?"🤝 Asociado":"🏛️ Matriz"}
                      </span></td>
                      <td style={{fontSize:11}}>{o.ciudad||"—"}</td>
                      <td style={{fontSize:11}}>{o.pais||"—"}</td>
                      <td style={{fontSize:11,fontFamily:"'DM Mono',monospace"}}>{o.tel||"—"}</td>
                      <td style={{fontSize:11,color:"var(--cyan)"}}>{o.email||"—"}</td>
                      <td style={{fontSize:11}}>{o.contacto||"—"}</td>
                      <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:4,fontWeight:700,background:o.activo?"#E8F8EE":"#FEE8E8",color:o.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:o.activo?"#80D0A0":"#F0A0A0"}}>{o.activo?"✅ Activo":"❌ Inactivo"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        <span className="ic-b" onClick={()=>{setOfForm(o);setEditOficina(o);setShowNewOficina(true);}}>✏️</span>
                        <span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{setOficinas(p=>p.filter(x=>x.id!==o.id));logAction("Borró oficina",`${o.codigo} — ${o.nombre}`);}}>🗑</span>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showNewOficina&&(
              <div className="ov" onClick={()=>setShowNewOficina(false)}>
                <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
                  <div className="mhd"><div className="mt">{editOficina?"✏️ Editar Oficina":"➕ Nueva Oficina"}</div><button className="mcl" onClick={()=>{setShowNewOficina(false);setEditOficina(null);}}>✕</button></div>
                  <div className="fgrid g2" style={{marginBottom:10}}>
                    <div className="fg full"><div className="fl">Nombre de la Oficina *</div><input className="fi" value={ofForm.nombre} onChange={e=>setOfForm(p=>({...p,nombre:e.target.value.toUpperCase()}))} placeholder="Ej: Oficina Valencia"/></div>
                    <div className="fg full">
                      <div className="fl">Tipo de Oficina *</div>
                      <div style={{display:"flex",gap:8,marginTop:4}}>
                        {["Matriz","Asociado"].map(t=>(
                          <button key={t} className={`btn-${(ofForm.tipo||"Matriz")===t?"p":"s"}`}
                            style={{flex:1,fontSize:11}}
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
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--navy)",flex:1}}>💰 Tarifas por Ruta y Tipo de Envío</div>
              <button className="btn-p" style={{fontSize:11}} onClick={()=>{
                setTafForm({paisOrig:"",ciudadOrig:"",paisDest:"",ciudadDest:"",tipoEnvio:SEND_TYPES[0]||"",porLb:"",porFt3:"",min:"",moneda:"USD"});
                setEditTarifa(null);setShowNewTarifa(true);
              }}>+ Nueva Tarifa</button>
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
                    const monto=esAereo?`$${t.porLb}/lb`:esMaritimo?`$${t.porFt3}/ft³`:`$${t.porLb}/lb`;
                    return(
                    <tr key={t.id}>
                      <td style={{fontWeight:600,fontSize:11}}>{t.paisOrig}-{t.ciudadOrig}</td>
                      <td style={{fontWeight:600,fontSize:11}}>{t.paisDest}-{t.ciudadDest}</td>
                      <td><TypeBadge t={t.tipoEnvio}/></td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:esAereo?"var(--green)":"var(--sky)"}}>{monto}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--orange)"}}>${t.min}</td>
                      <td style={{fontSize:11}}>{t.moneda}</td>
                      <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:4,fontWeight:700,background:t.activo?"#E8F8EE":"#FEE8E8",color:t.activo?"var(--green)":"var(--red)",border:"1px solid",borderColor:t.activo?"#80D0A0":"#F0A0A0"}}>{t.activo?"✅ Activa":"❌ Inactiva"}</span></td>
                      <td><div style={{display:"flex",gap:4}}>
                        <span className="ic-b" onClick={()=>{setTafForm(t);setEditTarifa(t);setShowNewTarifa(true);}}>✏️</span>
                        <span className="ic-b" onClick={()=>setTarifas(p=>p.map(x=>x.id===t.id?{...x,activo:!x.activo}:x))}>{t.activo?"⏸":"▶️"}</span>
                        <span className="ic-b" style={{color:"var(--red)"}} onClick={()=>{setTarifas(p=>p.filter(x=>x.id!==t.id));dbDeleteTarifa(t.id);logAction("Borró tarifa",`${t.paisOrig}-${t.ciudadOrig} → ${t.paisDest}-${t.ciudadDest} · ${t.tipoEnvio}`);}}>🗑</span>
                      </div></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {showNewTarifa&&(
              <div className="ov" onClick={()=>setShowNewTarifa(false)}>
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
                    {formEsAereo&&<div className="fg"><div className="fl">Precio por lb ($)</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porLb} onChange={e=>setTafForm(p=>({...p,porLb:e.target.value}))}/></div>}
                    {formEsMaritimo&&<div className="fg"><div className="fl">Precio por ft³ ($)</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porFt3} onChange={e=>setTafForm(p=>({...p,porFt3:e.target.value}))}/></div>}
                    {!formEsAereo&&!formEsMaritimo&&tafForm.tipoEnvio&&<div className="fg"><div className="fl">Precio por lb ($)</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.porLb} onChange={e=>setTafForm(p=>({...p,porLb:e.target.value}))}/></div>}
                    <div className="fg"><div className="fl">Cargo mínimo ($)</div><input className="fi" type="number" step="0.01" min="0" value={tafForm.min} onChange={e=>setTafForm(p=>({...p,min:e.target.value}))}/></div>
                    <div className="fg"><div className="fl">Moneda</div><select className="fs" value={tafForm.moneda} onChange={e=>setTafForm(p=>({...p,moneda:e.target.value}))}><option>USD</option><option>EUR</option><option>VES</option></select></div>
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
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)"}}>📋 Registro de Actividad</span>
              <span style={{fontSize:10,background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:4,padding:"2px 8px",color:"var(--t3)"}}>{actLog.length} eventos</span>
              <div style={{flex:1}}/>
              <input className="fi" style={{width:200,fontSize:11}} value={actFilter} onChange={e=>setActFilter(e.target.value)} placeholder="Filtrar por usuario o acción…"/>
              <button className="btn-s" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>window.print()}>🖨 Exportar</button>
            </div>
            <div style={{maxHeight:"60vh",overflowY:"auto"}}>
              <table className="ct">
                <thead><tr>
                  <th>Fecha / Hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Detalle</th>
                </tr></thead>
                <tbody>
                  {actLog.filter(a=>!actFilter||a.user.toLowerCase().includes(actFilter.toLowerCase())||a.action.toLowerCase().includes(actFilter.toLowerCase())||a.detail.toLowerCase().includes(actFilter.toLowerCase())).map((a,i)=>(
                    <tr key={i}>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,whiteSpace:"nowrap"}}>{fmtDate(a.ts)} {fmtTime(a.ts)}</td>
                      <td style={{fontWeight:600,color:"var(--navy)"}}>{a.user}</td>
                      <td><RoleChip code={a.role}/></td>
                      <td style={{fontWeight:500}}>{a.action}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--cyan)"}}>{a.detail||"—"}</td>
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
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🔍 Tracking Internacional</div>
            <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>Seguimiento y actualización de estados por WR</div>
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
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)",marginBottom:12}}>⚡ Actualización Masiva de Estados</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div className="fg">
                <div className="fl">N° WR o Tracking (uno por línea, coma o punto y coma)</div>
                <textarea className="ft" style={{minHeight:100,fontFamily:"'DM Mono',monospace",fontSize:12}} value={trkMassIds} onChange={e=>setTrkMassIds(e.target.value)} placeholder={"01MI58VL0000001\n01MI58VL0000002\n01MI58VL0000003"}/>
              </div>
              <div>
                <div className="fl" style={{marginBottom:8}}>Nuevo Estado</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,maxHeight:160,overflowY:"auto"}}>
                  {WR_STATUSES.filter(s=>statusAllowed(s)).map(s=>(
                    <button key={s.code} onClick={()=>setTrkMassStatus(s)}
                      className={`btn-${trkMassStatus?.code===s.code?"p":"s"}`}
                      style={{fontSize:11,padding:"4px 10px"}}>
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
                <div style={{fontSize:12}}>
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
              <input className="fi" style={{fontSize:14}} value={trkSearch} onChange={e=>setTrkSearch(e.target.value)}
                placeholder="Buscar por N° WR, tracking, consignatario o casillero…" autoFocus/>
            </div>

            {/* Resultados */}
            {trkSearch.length>1&&(
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"8px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontSize:12,color:"var(--t3)"}}>
                  {trkResults.length} resultado{trkResults.length!==1?"s":""}
                </div>
                {trkResults.length===0?(
                  <div style={{padding:40,textAlign:"center",color:"var(--t3)",fontSize:13}}>No se encontraron WR con ese criterio.</div>
                ):trkResults.map(w=>(
                  <div key={w.id} onClick={()=>setTrkSelected(w)}
                    style={{padding:"12px 14px",borderBottom:"1px solid var(--b2)",cursor:"pointer",
                      background:trkSelected?.id===w.id?"#EEF3FF":"",display:"flex",alignItems:"center",gap:12,transition:"background .1s"}}
                    onMouseEnter={e=>{if(trkSelected?.id!==w.id)e.currentTarget.style.background="#F8F9FB"}}
                    onMouseLeave={e=>{if(trkSelected?.id!==w.id)e.currentTarget.style.background=""}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:13,color:"var(--navy)",background:"#EEF3FF",padding:"2px 7px",borderRadius:4,border:"1px solid #B8C8F0"}}>{w.id}</span>
                        <StBadge st={w.status}/>
                      </div>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{w.consignee}</div>
                      <div style={{display:"flex",gap:10,marginTop:3,fontSize:11,color:"var(--t3)"}}>
                        <span>{w.casillero}</span>
                        <span>·</span>
                        <span>{w.origCity} → {w.destCity}</span>
                        <span>·</span>
                        <span className="c-trk">{w.tracking||"—"}</span>
                        <span>·</span>
                        <span>{fmtDate(w.fecha)}</span>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:"var(--cyan)",fontWeight:600,flexShrink:0}}>Ver detalle →</div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado general si no hay búsqueda */}
            {trkSearch.length<=1&&!trkSelected&&(
              <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)"}}>
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
                          <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:12,color:"var(--navy)"}}>{st.code}</span>
                          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:20,fontWeight:800,color:"var(--navy)"}}>{cnt}</span>
                        </div>
                        <div style={{fontSize:11,color:"var(--t2)",fontWeight:600}}>{st.label}</div>
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
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:14,color:"#E5AE3A",letterSpacing:.5}}>{trkSelected.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.7)",marginTop:2}}>{trkSelected.consignee} · {trkSelected.casillero}</div>
                </div>
                <button onClick={()=>setTrkSelected(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:12}}>✕</button>
              </div>
              {/* Info rápida */}
              <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",flexShrink:0,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[["Ruta",`${trkSelected.origCity} → ${trkSelected.destCity}`],["Tipo Envío",trkSelected.tipoEnvio||"—"],["Carrier",trkSelected.carrier||"—"],["Tracking",trkSelected.tracking||"—"],["Recibido",fmtDate(trkSelected.fecha)],["Cajas",String(trkSelected.cajas)]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>{l}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--t1)",fontFamily:l==="Tracking"?"'DM Mono',monospace":"inherit"}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Estado actual destacado */}
              <div style={{padding:"10px 14px",borderBottom:"1px solid var(--b1)",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:"var(--t3)"}}>Estado actual:</span>
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
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700,color:"#E5AE3A",letterSpacing:1}}>💬 CHAT INTERNO</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2}}>ENEX · {empresaNombre}</div>
          </div>
          <div style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.3)",padding:"8px 8px 4px",fontWeight:700}}>Canales</div>
            {CHAT_ROOMS.map(r=>(
              <div key={r.id} onClick={()=>setChatConv(r.id)}
                style={{padding:"9px 10px",borderRadius:7,cursor:"pointer",marginBottom:2,
                  background:chatConv===r.id?"rgba(200,151,28,.2)":"transparent",
                  border:`1px solid ${chatConv===r.id?"rgba(200,151,28,.4)":"transparent"}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>{r.ic}</span>
                  <div>
                    <div style={{color:chatConv===r.id?"#E5AE3A":"rgba(255,255,255,.8)",fontSize:13,fontWeight:600}}>{r.l}</div>
                    <div style={{color:"rgba(255,255,255,.35)",fontSize:10}}>{r.desc}</div>
                  </div>
                  {(chatMsgs[r.id]||[]).length>0&&(
                    <span style={{marginLeft:"auto",background:chatConv===r.id?"#E5AE3A":"rgba(255,255,255,.2)",color:chatConv===r.id?"#1A2B4A":"rgba(255,255,255,.7)",fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:4}}>
                      {(chatMsgs[r.id]||[]).length}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.3)",padding:"12px 8px 4px",fontWeight:700}}>En línea</div>
            {clients.filter(c=>["A","B","C","D","D1","D2"].includes(c.rol)).map(c=>(
              <div key={c.id} style={{padding:"6px 10px",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#1A8A4A",flexShrink:0}}/>
                <div style={{width:24,height:24,borderRadius:6,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(c)}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.primerNombre} {c.primerApellido}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:"#E5AE3A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#1A2B4A",flexShrink:0}}>{initials(CU)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.primerNombre} {currentUser.primerApellido}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{ROLE_DEFS[currentUser.rol]?.name}</div>
            </div>
          </div>
        </div>

        {/* MENSAJES */}
        <div style={{display:"flex",flexDirection:"column",background:"var(--bg3)",overflow:"hidden"}}>
          {/* Header canal */}
          <div style={{padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:18}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.ic}</span>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"var(--navy)"}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.l}</div>
              <div style={{fontSize:11,color:"var(--t3)"}}>{CHAT_ROOMS.find(r=>r.id===chatConv)?.desc}</div>
            </div>
          </div>
          {/* Mensajes */}
          <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
            {(chatMsgs[chatConv]||[]).length===0?(
              <div style={{textAlign:"center",color:"var(--t3)",padding:"40px 0",fontSize:13}}>No hay mensajes en este canal aún.</div>
            ):(chatMsgs[chatConv]||[]).map(m=>{
              const isMe=m.user===(currentUser.id||"rdiaz");
              return (
                <div key={m.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",gap:10,alignItems:"flex-end"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:isMe?"var(--navy)":"var(--bg5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:isMe?"#fff":"var(--t2)",flexShrink:0}}>
                    {(m.name||"?").split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                  </div>
                  <div style={{maxWidth:"65%"}}>
                    <div style={{fontSize:10,color:"var(--t3)",marginBottom:3,textAlign:isMe?"right":"left"}}>
                      {m.name} · <span className={`rb ${ROLE_DEFS[m.role]?.color||"rH1"}`} style={{fontSize:8}}>{m.role}</span> · {fmtTime(m.ts)}
                    </div>
                    <div style={{background:isMe?"var(--navy)":"var(--bg2)",color:isMe?"#fff":"var(--t1)",padding:"10px 14px",borderRadius:isMe?"12px 12px 2px 12px":"12px 12px 12px 2px",fontSize:13,lineHeight:1.5,border:isMe?"none":"1px solid var(--b1)",boxShadow:"var(--shadow)"}}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Input */}
          <div style={{padding:"12px 16px",background:"var(--bg2)",borderTop:"1px solid var(--b1)",display:"flex",gap:8,flexShrink:0}}>
            <input className="fi" style={{flex:1,fontSize:13}} value={chatMsg}
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
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700,color:"var(--navy)"}}>🚐 Solicitudes de Pick-up</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>Recogidas a domicilio programadas</div>
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
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:12}}>{p.id}</span></td>
                  <td style={{fontWeight:600}}>{p.clienteNombre||"—"}</td>
                  <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",color:"var(--t2)",fontSize:12}}>{p.clienteDir||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{p.fecha||"—"}</td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{p.hora||"—"}</td>
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
        <div className="ov" onClick={()=>setShowNewPickup(false)}>
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
                        <div key={c.id} onClick={()=>{spuf("clienteId",c.id);spuf("clienteNombre",fullName(c));spuf("clienteDir",c.dir||"");spuf("clienteTel",c.tel1||"");setPickupClientSearch(fullName(c));setPickupClientResults([]);}} style={{padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid var(--b2)",fontSize:13}} onMouseEnter={e=>e.currentTarget.style.background="#EEF3FF"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                          {fullName(c)} <span style={{color:"var(--gold2)",fontFamily:"'DM Mono',monospace",fontSize:11}}>{c.casillero}</span>
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
            <button onClick={()=>setPuf(p=>({...p,paquetes:[...p.paquetes,{descripcion:"",largo:"",ancho:"",alto:"",pesoLb:"",cantidad:1}]}))} style={{width:"100%",padding:"8px",border:"2px dashed var(--b1)",borderRadius:8,background:"var(--bg4)",cursor:"pointer",fontSize:13,color:"var(--t2)",marginBottom:14}}>+ Agregar paquete</button>

            {/* Cotización previa */}
            {(()=>{const cot=calcPickupCotizacion(puf.paquetes);return(
              <div style={{background:"var(--bg4)",border:"1px solid var(--b1)",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:8}}>💵 Cotización Estimada</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[["Peso Total",`${cot.totalLb} lb`,"var(--t1)"],["Ft³ Total",String(cot.totalFt3),"var(--sky)"],["Estimado",`$${cot.estimado}`,"var(--green)"]].map(([l,v,c])=>(
                    <div key={l} style={{background:"var(--bg2)",borderRadius:6,padding:"8px 12px",border:"1px solid var(--b1)"}}>
                      <div style={{fontSize:10,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:800,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:8}}>* Estimado basado en tarifa estándar. Puede variar según servicios adicionales.</div>
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
  const sc3=(k,v)=>setCalcForm(p=>({...p,[k]:v}));

  const calcResult=(()=>{
    const l=parseFloat(calcForm.largo)||0,a=parseFloat(calcForm.ancho)||0,h=parseFloat(calcForm.alto)||0;
    const pesoInput=parseFloat(calcForm.pesoLb)||0;
    if(!l&&!a&&!h&&!pesoInput)return null;
    // Si unitDim=cm el usuario ingresa kg → convertir a lb para cálculo
    const lb=calcForm.unitDim==="cm"?parseFloat((pesoInput*2.205).toFixed(2)):pesoInput;
    const lCm=calcForm.unitDim==="in"?l*2.54:l,aCm=calcForm.unitDim==="in"?a*2.54:a,hCm=calcForm.unitDim==="in"?h*2.54:h;
    const vc=calcVol(lCm,aCm,hCm,"cm");
    const tarifa=TARIFAS_BASE[calcForm.tipoEnvio]||TARIFAS_BASE[SEND_TYPES[0]]||{porLb:1.8,porFt3:28,min:25};
    const byLb=Math.max(tarifa.min,lb*tarifa.porLb);
    const byFt3=Math.max(tarifa.min,vc.ft3*tarifa.porFt3);
    const total=parseFloat(Math.max(byLb,byFt3).toFixed(2));
    const kg=parseFloat((lb/2.205).toFixed(2));
    return {lb,kg,volLb:vc.volLb,ft3:vc.ft3,m3:vc.m3,total,byLb:parseFloat(byLb.toFixed(2)),byFt3:parseFloat(byFt3.toFixed(2))};
  })();

  const renderCalculadora=()=>(
    <div className="page-scroll">
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:20,fontWeight:700,color:"var(--navy)",marginBottom:4}}>🧮 Calculadora de Envío</div>
        <div style={{fontSize:13,color:"var(--t3)",marginBottom:16}}>Ingresa las medidas y peso para obtener un estimado de costo.</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {/* Ruta */}
          <div className="card">
            <div className="sdiv">RUTA DE ENVÍO</div>
            <div className="fgrid g2" style={{gap:10}}>
              <div className="fg">
                <div className="fl">País Origen</div>
                <select className="fs" value={calcForm.origPais} onChange={e=>sc3("origPais",e.target.value)}>
                  {COUNTRIES.map(c=><option key={c.dial} value={c.dial}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Ciudad Origen</div>
                <select className="fs" value={calcForm.origCiudad} onChange={e=>sc3("origCiudad",e.target.value)}>
                  {(COUNTRIES.find(c=>c.dial===calcForm.origPais)?.cities||[]).map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">País Destino</div>
                <select className="fs" value={calcForm.destPais} onChange={e=>sc3("destPais",e.target.value)}>
                  {COUNTRIES.map(c=><option key={c.dial} value={c.dial}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <div className="fl">Ciudad Destino</div>
                <select className="fs" value={calcForm.destCiudad} onChange={e=>sc3("destCiudad",e.target.value)}>
                  {(COUNTRIES.find(c=>c.dial===calcForm.destPais)?.cities||[]).map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="fg full">
                <div className="fl">Tipo de Envío</div>
                <select className="fs" value={calcForm.tipoEnvio} onChange={e=>sc3("tipoEnvio",e.target.value)}>
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

        {/* Resultado */}
        {calcResult&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              {[[`⚖️ Peso Real`,calcForm.unitDim==="cm"?`${calcResult.kg} kg`:`${calcResult.lb} lb`,"var(--t1)"],["📐 Peso Vol.",`${calcResult.volLb} lb`,"var(--orange)"],["📦 Ft³",String(calcResult.ft3),"var(--sky)"],["🌐 M³",String(calcResult.m3),"var(--teal)"]].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",textAlign:"center",boxShadow:"var(--shadow)"}}>
                  <div style={{fontSize:13,marginBottom:6}}>{l}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:20,fontWeight:800,color:c}}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{background:"var(--navy)",borderRadius:14,padding:"24px",marginBottom:14,textAlign:"center"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:8}}>Costo Estimado · {calcForm.tipoEnvio} · {COUNTRIES.find(c=>c.dial===calcForm.origPais)?.name?.split(" ")[0]} → {COUNTRIES.find(c=>c.dial===calcForm.destPais)?.name?.split(" ")[0]}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:52,fontWeight:800,color:"#E5AE3A",lineHeight:1}}>${calcResult.total}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:6}}>USD · Estimado aproximado</div>
            </div>

            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",marginBottom:14}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:10}}>📊 Comparación por Tipo de Envío</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                {SEND_TYPES.map(t=>{
                  const tar=TARIFAS_BASE[t];
                  if(!tar)return null;
                  const lb=parseFloat(calcForm.pesoLb)||0;
                  const ft3=calcResult.ft3;
                  const est=parseFloat(Math.max(tar.min,Math.max(lb*tar.porLb,ft3*tar.porFt3)).toFixed(2));
                  const isActive=t===calcForm.tipoEnvio;
                  return (
                    <div key={t} onClick={()=>sc3("tipoEnvio",t)} style={{background:isActive?"var(--navy)":"var(--bg4)",border:`2px solid ${isActive?"var(--navy)":"var(--b1)"}`,borderRadius:8,padding:"10px",textAlign:"center",cursor:"pointer",transition:"all .1s"}}>
                      <div style={{fontSize:11,fontWeight:600,color:isActive?"#E5AE3A":"var(--t2)",marginBottom:4}}>{t}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:800,color:isActive?"#fff":"var(--navy)"}}>${est}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--t3)",textAlign:"center"}}>* Los precios son estimados basados en tarifas estándar. Contacta a ENEX para una cotización exacta.</div>
          </>
        )}
        {!calcResult&&(
          <div style={{textAlign:"center",padding:"40px",color:"var(--t3)",fontSize:14}}>
            Ingresa las medidas y peso para ver el estimado 👆
          </div>
        )}
      </div>
    </div>
  );

  // ── CONTABILIDAD ──────────────────────────────────────────────────────────────

  const buildFacturaNum=(seq)=>`FAC-${new Date().getFullYear()}-${String(seq).padStart(5,"0")}`;

  const generarFacturasGuia=(guia)=>{
    // Una factura por cliente/consignatario en la guía
    const allWR=guia.containers.flatMap(c=>c.wr);
    const porCliente={};
    allWR.forEach(w=>{
      const key=w.casillero||w.consignee;
      if(!porCliente[key])porCliente[key]={consignee:w.consignee,casillero:w.casillero,wrs:[]};
      porCliente[key].wrs.push(w);
    });
    const nuevas=Object.values(porCliente).map((c,i)=>{
      const subtotal=c.wrs.reduce((s,w)=>s+(w.valor||0),0);
      const pesoLb=c.wrs.reduce((s,w)=>s+(w.pesoLb||0),0);
      const ft3=c.wrs.reduce((s,w)=>s+(w.ft3||0),0);
      const tarifa=TARIFAS_BASE[guia.tipoEnvio]||TARIFAS_BASE[SEND_TYPES[0]]||{porLb:1.8,porFt3:28,min:25};
      const flete=parseFloat(Math.max(tarifa.min,Math.max(pesoLb*tarifa.porLb,ft3*tarifa.porFt3)).toFixed(2));
      return {
        id:buildFacturaNum(facturas.length+i+1),
        guiaId:guia.id, fecha:new Date(),
        consignee:c.consignee, casillero:c.casillero,
        wrs:c.wrs, pesoLb:parseFloat(pesoLb.toFixed(1)), ft3:parseFloat(ft3.toFixed(2)),
        valorDeclarado:parseFloat(subtotal.toFixed(2)),
        flete, total:parseFloat((flete+subtotal*0.01).toFixed(2)), // flete + 1% seguro
        status:"Pendiente", tipoPago:"",
      };
    });
    setFacturas(p=>[...nuevas,...p]);
    logAction("Generó facturas",`Guía ${guia.id} → ${nuevas.length} facturas`);
    setShowNewFactura(null);
  };

  const registrarPago=(facId,monto,tipo)=>{
    setFacturas(p=>p.map(f=>f.id===facId?{...f,status:"Pagada",tipoPago:tipo,fechaPago:new Date()}:f));
    setPagos(p=>[{id:`PAG-${String(p.length+1).padStart(4,"0")}`,facturaId:facId,monto:parseFloat(monto),tipo,fecha:new Date()},...p]);
    logAction("Registró pago",`Factura ${facId} · $${monto}`);
  };

  const renderContabilidad=()=>{
    const CTABS=[{k:"facturas",l:"📄 Facturas",ic:"📄"},{k:"cxc",l:"💰 Por Cobrar",ic:"💰"},{k:"pagos",l:"✅ Pagos",ic:"✅"},{k:"generar",l:"⚡ Generar de Guía",ic:"⚡"},{k:"reporte",l:"📊 Reporte",ic:"📊"}];
    const pendientes=facturas.filter(f=>f.status==="Pendiente");
    const totalPendiente=pendientes.reduce((s,f)=>s+f.total,0).toFixed(2);
    const totalCobrado=facturas.filter(f=>f.status==="Pagada").reduce((s,f)=>s+f.total,0).toFixed(2);

    return (
      <div className="page-scroll">
        {/* Mini stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[["📄","Total Facturas",facturas.length,"var(--navy)"],["💰","Por Cobrar",`$${totalPendiente}`,"var(--orange)"],["✅","Cobrado",`$${totalCobrado}`,"var(--green)"],["📋","Guías con factura",new Set(facturas.map(f=>f.guiaId)).size,"var(--cyan)"]].map(([ic,l,v,c])=>(
            <div key={l} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px",boxShadow:"var(--shadow)"}}>
              <div style={{fontSize:18,marginBottom:6}}>{ic}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:24,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,background:"var(--bg4)",borderRadius:8,padding:"3px",border:"1px solid var(--b1)"}}>
          {CTABS.map(t=><button key={t.k} onClick={()=>setContabTab(t.k)} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:contabTab===t.k?"var(--navy)":"transparent",color:contabTab===t.k?"#fff":"var(--t2)"}}>{t.l}</button>)}
        </div>

        {/* ── FACTURAS ── */}
        {contabTab==="facturas"&&(
          <div className="card" style={{padding:0}}>
            {facturas.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay facturas generadas aún. Ve a "Generar de Guía".</div>:(
              <table className="ct">
                <thead><tr><th>N° Factura</th><th>Guía</th><th>Consignatario</th><th>WRs</th><th>Peso lb</th><th>Ft³</th><th>Val. Decl.</th><th>Flete</th><th>Total</th><th>Estado</th><th>Acc.</th></tr></thead>
                <tbody>
                  {facturas.map(f=>(
                    <tr key={f.id}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:12}}>{f.id}</span></td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--purple)"}}>{f.guiaId}</td>
                      <td style={{fontWeight:600}}>{f.consignee}<div style={{fontSize:10,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{f.casillero}</div></td>
                      <td style={{textAlign:"center",fontWeight:700}}>{f.wrs.length}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{f.pesoLb}lb</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--sky)"}}>{f.ft3}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",color:"var(--t2)"}}>${f.valorDeclarado}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>${f.flete}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--green)",fontSize:13}}>${f.total}</td>
                      <td><span className={`st ${f.status==="Pagada"?"s3":"s5"}`}><span className="st-dot"/>{f.status}</span></td>
                      <td>
                        {f.status==="Pendiente"&&(
                          <button className="btn-p" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>{
                            const tipo=window.prompt("Tipo de pago (Efectivo, Zelle, Transferencia…):")||"Efectivo";
                            registrarPago(f.id,f.total,tipo);
                          }}>💵 Cobrar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── CUENTAS POR COBRAR ── */}
        {contabTab==="cxc"&&(
          <div>
            {pendientes.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay cuentas pendientes. ✅</div>:(
              <div className="card" style={{padding:0}}>
                <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)"}}>💰 Cuentas por Cobrar</span>
                  <span style={{fontSize:12,color:"var(--orange)",fontWeight:700,marginLeft:"auto"}}>Total pendiente: ${totalPendiente}</span>
                </div>
                <table className="ct">
                  <thead><tr><th>Factura</th><th>Consignatario</th><th>Guía</th><th>Fecha</th><th>Total</th><th>Días</th><th>Acc.</th></tr></thead>
                  <tbody>
                    {pendientes.map(f=>{
                      const dias=Math.floor((new Date()-new Date(f.fecha))/(1000*60*60*24));
                      return (
                        <tr key={f.id}>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:12,color:"var(--navy)"}}>{f.id}</span></td>
                          <td style={{fontWeight:600}}>{f.consignee}<div style={{fontSize:10,color:"var(--gold2)",fontFamily:"'DM Mono',monospace"}}>{f.casillero}</div></td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--purple)"}}>{f.guiaId}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmtDate(f.fecha)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--orange)",fontSize:13}}>${f.total}</td>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:dias>30?"var(--red)":dias>15?"var(--orange)":"var(--t1)"}}>{dias}d</span></td>
                          <td><button className="btn-p" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>{const tipo=window.prompt("Tipo de pago:")||"Efectivo";registrarPago(f.id,f.total,tipo);}}>💵 Cobrar</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PAGOS REGISTRADOS ── */}
        {contabTab==="pagos"&&(
          <div className="card" style={{padding:0}}>
            {pagos.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay pagos registrados aún.</div>:(
              <table className="ct">
                <thead><tr><th>N° Pago</th><th>Factura</th><th>Monto</th><th>Tipo Pago</th><th>Fecha</th></tr></thead>
                <tbody>
                  {pagos.map(p=>(
                    <tr key={p.id}>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:12,color:"var(--navy)"}}>{p.id}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{p.facturaId}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:"var(--green)",fontSize:13}}>${p.monto}</td>
                      <td style={{fontWeight:600}}>{p.tipo}</td>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmtDate(p.fecha)} {fmtTime(p.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── GENERAR DE GUÍA ── */}
        {contabTab==="generar"&&(
          <div>
            <div style={{fontSize:13,color:"var(--t2)",marginBottom:12}}>Selecciona una guía consolidada para generar las facturas por consignatario.</div>
            {consolList.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay guías consolidadas. Primero crea un embarque en Consolidación.</div>:(
              <div className="card" style={{padding:0}}>
                <table className="ct">
                  <thead><tr><th>N° Guía</th><th>Destino</th><th>Fecha</th><th>WR</th><th>Tipo Envío</th><th>Ya facturada</th><th>Acc.</th></tr></thead>
                  <tbody>
                    {consolList.map(g=>{
                      const yaFact=facturas.some(f=>f.guiaId===g.id);
                      return (
                        <tr key={g.id}>
                          <td><span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)",fontSize:12}}>{g.id}</span></td>
                          <td style={{fontWeight:600}}>{g.destino}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmtDate(g.fecha)}</td>
                          <td style={{textAlign:"center",fontWeight:700}}>{g.totalWR}</td>
                          <td><TypeBadge t={g.tipoEnvio}/></td>
                          <td>{yaFact?<span className="st s3"><span className="st-dot"/>Sí</span>:<span className="st s5"><span className="st-dot"/>No</span>}</td>
                          <td>
                            {!yaFact&&<button className="btn-p" style={{fontSize:10,padding:"3px 10px"}} onClick={()=>generarFacturasGuia(g)}>⚡ Generar Facturas</button>}
                            {yaFact&&<span style={{fontSize:11,color:"var(--t3)"}}>Ya generada</span>}
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
          const porMes={};
          facturas.forEach(f=>{const k=fmtDate(f.fecha).slice(3);if(!porMes[k])porMes[k]={mes:k,facturas:0,total:0,cobrado:0};porMes[k].facturas++;porMes[k].total+=f.total;if(f.status==="Pagada")porMes[k].cobrado+=f.total;});
          const meses=Object.values(porMes);
          return (
            <div>
              {meses.length===0?<div className="card" style={{textAlign:"center",padding:40,color:"var(--t3)"}}>No hay datos para reportar aún.</div>:(
                <div className="card" style={{padding:0}}>
                  <div style={{padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--b1)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"var(--navy)"}}>📊 Reporte de Ingresos por Período</div>
                  <table className="ct">
                    <thead><tr><th>Período</th><th>Facturas</th><th>Total Facturado</th><th>Total Cobrado</th><th>Pendiente</th><th>% Cobrado</th></tr></thead>
                    <tbody>
                      {meses.map(m=>(
                        <tr key={m.mes}>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{m.mes}</td>
                          <td style={{textAlign:"center",fontWeight:700}}>{m.facturas}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--navy)"}}>${m.total.toFixed(2)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--green)"}}>${m.cobrado.toFixed(2)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--orange)"}}>${(m.total-m.cobrado).toFixed(2)}</td>
                          <td>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{flex:1,height:8,background:"var(--bg4)",borderRadius:4,overflow:"hidden"}}>
                                <div style={{height:"100%",background:"var(--green)",width:`${Math.round((m.cobrado/m.total)*100)}%`,borderRadius:4}}/>
                              </div>
                              <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:"var(--green)",minWidth:36}}>{Math.round((m.cobrado/m.total)*100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    );
  };

  // ── NAV ─────────────────────────────────────────────────────────────────────
  const navGroups=[
    {label:"Principal",items:[
      {id:"dashboard",ic:"📊",l:"Dashboard"},
      {id:"wr",ic:"📦",l:"Warehouse Receipts",badge:String(filteredWR.length)},
      {id:"scan",ic:"📡",l:"Recepción en Puerta",badge:scanLog.filter(s=>!s.registered).length>0?String(scanLog.filter(s=>!s.registered).length):null,red:true},
      {id:"etiquetas",ic:"🏷️",l:"Imprimir Etiquetas"},
    ]},
    {label:"Gestión",items:[
      {id:"clients",ic:"👥",l:"Clientes & Usuarios"},
      {id:"estadocuenta",ic:"📄",l:"Estado de Cuenta"},
      {id:"consolidation",ic:"🗂️",l:"Consolidación"},
      {id:"tracking",ic:"🔍",l:"Tracking"},
      {id:"pickup",ic:"🚐",l:"Pick-up"},
      {id:"contabilidad",ic:"💰",l:"Contabilidad"},
    ]},
    {label:"Herramientas",items:[
      {id:"calculadora",ic:"🧮",l:"Calculadora"},
      {id:"chat",ic:"💬",l:"Chat Interno"},
      {id:"roles",ic:"🔐",l:"Roles & Permisos"},
      {id:"docs",ic:"📋",l:"Documentos"},
      {id:"reports",ic:"📈",l:"Reportes"},
    ]},
    {label:"Sistema",items:[
      {id:"alerts",ic:"🔔",l:"Alertas"},
      ...(canAdmin?[{id:"settings",ic:"⚙️",l:"Configuración"}]:[]),
    ]},
  ];

  const PAGE_TITLES={dashboard:"Dashboard General",wr:"Warehouse Receipts",scan:"Recepción en Puerta",etiquetas:"Imprimir Etiquetas",clients:"Clientes & Usuarios",estadocuenta:"Estado de Cuenta",roles:"Roles & Permisos",consolidation:"Consolidación",tracking:"Tracking",pickup:"Pick-up",contabilidad:"Contabilidad",calculadora:"Calculadora de Envío",chat:"Chat Interno",docs:"Documentos",reports:"Reportes",alerts:"Alertas",settings:"Configuración"};

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
              {g.items.map(n=>(
                <div key={n.id} className={`ni ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
                  <span className="ni-ic">{n.ic}</span>
                  <span className="ni-lbl">{n.l}</span>
                  {n.badge&&n.badge!=="0"&&<span className={`n-bx${n.red?" r":""}`}>{n.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="u-row">
            <div className="u-av">{initials(currentUser)}</div>
            <div style={{flex:1,minWidth:0}}><div className="u-nm">{currentUser.primerNombre} {currentUser.primerApellido}</div><div className="u-rl">{currentUser.email}</div></div>
            <RoleBadge code={currentUser.rol}/>
          </div>
          <button className="btn-d" style={{width:"100%",marginTop:8,fontSize:11,padding:"6px 10px"}} onClick={doLogout}>🚪 Cerrar sesión</button>
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
          <div style={{width:28,height:28,borderRadius:6,background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,cursor:"pointer",color:"#fff"}}>{initials(currentUser)}</div>
        </div>
        {renderPage()}
      </div>

      {/* MODALS */}
      {showNewWR&&renderNewWRModal()}
      {selWR&&renderWRDetail()}
      {showStatModal&&renderStatModal()}
      {showLabels&&(()=>{
        const _lwr=showLabels.wr;const _ldims=showLabels.dims||[];
        const _totalPk=_ldims.reduce((s,d)=>s+(parseFloat(d.pk)||0),0);
        const _totalPLb=_ldims.reduce((s,d)=>s+(parseFloat(d.pv)||0),0);
        const LabelCaja=({d,idx,total})=>{
          const bval=d.tracking||_lwr?.id||"";
          const dimStr=d.l&&d.a&&d.h?`${parseFloat((d.l/2.54).toFixed(1))}"×${parseFloat((d.a/2.54).toFixed(1))}"×${parseFloat((d.h/2.54).toFixed(1))}"`:null;
          return(
            <div className="label-card" style={{width:288,minHeight:192,border:"2px solid #000",borderRadius:4,background:"#fff",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              <div className="label-head" style={{background:"#000",color:"#fff",textAlign:"center",padding:"4px 8px"}}>
                <div style={{fontWeight:900,fontSize:16,letterSpacing:3}}>{empresaNombre}</div>
                <div style={{fontSize:8,letterSpacing:2,opacity:.8}}>INTERNATIONAL COURIER</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",borderBottom:"1px solid #000"}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700}}>WAREHOUSE RECEIPT</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontWeight:800,fontSize:12}}>{_lwr?.id}</div>
              </div>
              <div style={{textAlign:"center",padding:"4px 6px",borderBottom:"2px solid #000",fontFamily:"'Rajdhani',sans-serif",fontSize:20,fontWeight:900,letterSpacing:2}}>
                CAJA {idx} / {total}
              </div>
              <div style={{padding:"6px 8px",flex:1}}>
                <div style={{display:"flex",gap:4,marginBottom:3,alignItems:"flex-start"}}>
                  <span style={{fontSize:8,color:"#555",fontWeight:700,minWidth:64,textTransform:"uppercase",marginTop:1}}>Consignatario</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#000",lineHeight:1.2}}>{_lwr?.consignee}</span>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:3}}>
                  <span style={{fontSize:8,color:"#555",fontWeight:700,minWidth:64,textTransform:"uppercase"}}>Casillero</span>
                  <span style={{fontSize:11,fontWeight:800,color:"#000"}}>#{_lwr?.casillero}</span>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:3}}>
                  <span style={{fontSize:8,color:"#555",fontWeight:700,minWidth:64,textTransform:"uppercase"}}>Ruta</span>
                  <span style={{fontSize:10,fontWeight:600,color:"#000"}}>{_lwr?.origCity||"—"} → {_lwr?.destCity||"—"}</span>
                </div>
                {dimStr&&<div style={{display:"flex",gap:4,marginBottom:3}}>
                  <span style={{fontSize:8,color:"#555",fontWeight:700,minWidth:64,textTransform:"uppercase"}}>Dims</span>
                  <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#000"}}>{dimStr} · {d.pk?`${d.pk}kg`:"—"}</span>
                </div>}
                {d.tracking&&<div style={{display:"flex",gap:4,marginBottom:3}}>
                  <span style={{fontSize:8,color:"#555",fontWeight:700,minWidth:64,textTransform:"uppercase"}}>Tracking</span>
                  <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#000",wordBreak:"break-all"}}>{d.tracking}</span>
                </div>}
              </div>
              {bval&&<div style={{borderTop:"1px dashed #888",padding:"6px 8px",textAlign:"center",background:"#fafafa"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:2,overflow:"hidden"}}><WRBarcode value={bval} height={40} width={1.5}/></div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:1,color:"#000",fontWeight:700}}>{bval}</div>
              </div>}
            </div>
          );
        };
        const LabelGuia=()=>{
          const bval=_lwr?.id||"";
          return(
            <div className="label-card" style={{width:576,minHeight:192,border:"2px solid #000",borderRadius:4,background:"#fff",display:"flex",flexDirection:"column",pageBreakInside:"avoid",fontFamily:"Arial,sans-serif"}}>
              <div style={{background:"#000",color:"#fff",textAlign:"center",padding:"5px 8px"}}>
                <div style={{fontWeight:900,fontSize:20,letterSpacing:4}}>{empresaNombre}</div>
                <div style={{fontSize:8,letterSpacing:3,opacity:.8}}>INTERNATIONAL COURIER — GUÍA DE ENVÍO</div>
              </div>
              <div style={{display:"flex",flex:1}}>
                <div style={{flex:1,padding:"8px 10px",borderRight:"1px solid #000"}}>
                  <div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>Remitente / Shipper</div>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:8}}>{showLabels.remitente||"—"}</div>
                  <div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>Consignatario / Consignee</div>
                  <div style={{fontWeight:800,fontSize:14,marginBottom:2}}>{_lwr?.consignee}</div>
                  <div style={{fontSize:10,color:"#555"}}>Casillero <b style={{color:"#000"}}>#{_lwr?.casillero}</b></div>
                </div>
                <div style={{flex:1,padding:"8px 10px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                    <div><div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase"}}>Origen</div><div style={{fontWeight:700,fontSize:12}}>{_lwr?.origCity||"—"}</div></div>
                    <div><div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase"}}>Destino</div><div style={{fontWeight:700,fontSize:12}}>{_lwr?.destCity||"—"}</div></div>
                    <div><div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase"}}>Cajas</div><div style={{fontWeight:800,fontSize:14}}>{_lwr?.cajas||_ldims.length}</div></div>
                    <div><div style={{fontSize:8,color:"#555",fontWeight:700,textTransform:"uppercase"}}>Peso</div><div style={{fontWeight:700,fontSize:12}}>{_totalPk.toFixed(1)} kg</div></div>
                  </div>
                  <div style={{textAlign:"center",borderTop:"1px dashed #888",paddingTop:6}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:2,overflow:"hidden"}}><WRBarcode value={bval} height={44} width={2}/></div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,fontWeight:700}}>{bval}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        };
        return(
        <div className="ov" onClick={()=>setShowLabels(null)}>
          <div className="modal mxl" onClick={e=>e.stopPropagation()} style={{maxHeight:"90vh",overflowY:"auto"}}>
            <div className="mhd">
              <div className="mt">🏷️ Etiquetas — {_lwr?.id}</div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-p" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>window.print()}>🖨️ Imprimir todo</button>
                <button className="mcl" onClick={()=>setShowLabels(null)}>✕</button>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:8}}>📦 Etiquetas de Caja ({_ldims.length||_lwr?.cajas||0})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {_ldims.length>0?_ldims.map((d,i)=><LabelCaja key={i} d={d} idx={i+1} total={_ldims.length}/>)
                  :Array.from({length:_lwr?.cajas||1},(_,i)=><LabelCaja key={i} d={{}} idx={i+1} total={_lwr?.cajas||1}/>)}
              </div>
            </div>
            <div style={{borderTop:"2px solid var(--b1)",paddingTop:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:8}}>📋 Etiqueta de Guía</div>
              <LabelGuia/>
            </div>
          </div>
        </div>
        );
      })()}
      {showNewCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title="➕ Nuevo Registro" initial={{tipo:"cliente",clienteTipo:"matriz",primerNombre:"",segundoNombre:"",primerApellido:"",segundoApellido:"",cedula:"",dir:"",municipio:"",estado:"",pais:"",cp:"",tel1:"",tel2:"",email:"",casillero:"",rol:"I",password:""}} onClose={()=>setShowNewCl(false)} onSave={f=>{const esUser=f.tipo==="usuario";const prefix=esUser?"U":"C";const nextNum=clients.filter(c=>c.tipo===(esUser?"usuario":"cliente")).length+1;const newId=`${prefix}-${String(nextNum).padStart(3,"0")}`;const casillero=(!esUser&&!f.casillero)?newId:f.casillero;const newRec={...f,id:newId,casillero,clienteTipo:f.clienteTipo||"matriz"};setClients(p=>[...p,newRec]);dbUpsertCliente(newRec);setShowNewCl(false);logAction("Creó registro",`${newId} — ${f.primerNombre} ${f.primerApellido}`);}}/>}
      {showEditCl&&<ClientModal agentes={agentes} oficinas={oficinas} autonomos={clients.filter(c=>c.tipo==="usuario"&&c.rol==="F")} allClients={clients} title={`✏️ Editar — ${fullName(showEditCl)}`} initial={showEditCl} onClose={()=>setShowEditCl(null)} onSave={f=>{setClients(p=>p.map(c=>c.id===f.id?f:c));dbUpsertCliente({...f,clienteTipo:f.clienteTipo||"matriz"});logAction("Editó registro",`${f.id} — ${f.primerNombre} ${f.primerApellido}`);setShowEditCl(null);}}/>}
    </div></>
  );
}
