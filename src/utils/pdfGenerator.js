import jsPDF from 'jspdf';
import { hexToRgb } from './color';
import { ECONOMIC_NOTICE, INTERNAL_USE_NOTICE } from '../data/mimitFaq';

// ── Layout (mm, A4 portrait) ──
const PAGE_W = 210;
const M = 16;
const CONTENT_W = PAGE_W - M * 2;
const TOP = 38;
const BOTTOM = 277;

const DOC_TITLE = 'CONFLAVORO AI - SCHEDA TECNICA DI FABBISOGNO AZIENDALE';
const DOC_SUBTITLE = 'Dossier Preliminare per Progetto Voucher MIMIT Cloud & Cybersecurity 2026';
const BRAND_HEX = '#1f47d1';

const C = {
  ink: [11, 11, 12],
  soft: [43, 43, 48],
  muted: [102, 102, 109],
  faint: [155, 155, 161],
  line: [228, 226, 219],
  paper: [247, 246, 242],
  white: [255, 255, 255],
  onInk: [178, 178, 184]
};

const rgb = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return [r, g, b];
};

// Scheda Tecnica di Fabbisogno — no prices anywhere in this document
export function generateProjectPdf(dossier, docCode) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setLineHeightFactor(1.35);

  const BRAND = rgb(BRAND_HEX);
  const dateFormatted = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const companyRow = (label) => dossier.company.find((r) => r.label === label)?.value;

  let y = TOP;
  let sectionNo = 0;

  // ── Primitives ──
  const fill = (c) => doc.setFillColor(...c);
  const stroke = (c, w = 0.25) => { doc.setDrawColor(...c); doc.setLineWidth(w); };
  const color = (c) => doc.setTextColor(...c);
  const font = (style = 'normal', size = 9) => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const lineH = (size) => size * 0.3528 * 1.35;
  const hr = (c = C.line, w = 0.2) => { stroke(c, w); doc.line(M, y, PAGE_W - M, y); };

  // Tracked uppercase micro-label (manual width so right alignment stays exact)
  const label = (text, x, yy, { align = 'left', c = C.faint, size = 6.5, bold = false } = {}) => {
    const txt = String(text ?? '').toUpperCase();
    const cs = 0.42;
    font(bold ? 'bold' : 'normal', size);
    color(c);
    const w = doc.getTextWidth(txt) + cs * Math.max(0, txt.length - 1);
    doc.text(txt, align === 'right' ? x - w : x, yy, { charSpace: cs });
  };

  const drawHeader = () => {
    fill(BRAND);
    doc.rect(0, 0, PAGE_W, 2.2, 'F');

    // Mark: 2×2 "table", one filled cell
    fill(C.ink);
    doc.rect(M, 10, 11, 11, 'F');
    stroke(C.white, 0.5);
    doc.rect(M + 2.35, 12.35, 2.75, 2.75, 'S');
    doc.rect(M + 5.9, 12.35, 2.75, 2.75, 'S');
    doc.rect(M + 2.35, 15.9, 2.75, 2.75, 'S');
    fill(BRAND);
    doc.rect(M + 5.65, 15.65, 3.3, 3.3, 'F');

    font('bold', 11);
    color(C.ink);
    doc.text('CONFLAVORO AI', M + 15, 15.2, { charSpace: 0.45 });
    label('Scheda tecnica di fabbisogno · Voucher MIMIT 2026', M + 15, 19.8, { c: C.muted, size: 6 });

    label('Scheda n°', PAGE_W - M, 13.2, { align: 'right' });
    font('bold', 9);
    color(C.ink);
    doc.text(docCode, PAGE_W - M, 17.6, { align: 'right' });
    label(dateFormatted, PAGE_W - M, 21.6, { align: 'right', c: C.muted });

    stroke(C.line);
    doc.line(M, 27, PAGE_W - M, 27);
  };

  const newPage = () => {
    doc.addPage();
    drawHeader();
    y = TOP;
  };
  const ensure = (h) => {
    if (y + h > BOTTOM) newPage();
  };

  const section = (title) => {
    ensure(24);
    sectionNo += 1;
    fill(BRAND);
    doc.rect(M, y - 2.5, 2.5, 2.5, 'F');
    label(String(sectionNo).padStart(2, '0'), M + 5, y, { c: C.faint, size: 7 });
    font('bold', 9.5);
    color(C.ink);
    doc.text(title.toUpperCase(), M + 12, y, { charSpace: 0.35 });
    y += 3;
    hr(C.ink, 0.35);
    y += 6;
  };

  const paragraph = (text, { size = 9, c = C.muted, width = CONTENT_W, x = M } = {}) => {
    font('normal', size);
    color(c);
    doc.splitTextToSize(String(text || ''), width).forEach((line) => {
      ensure(lineH(size));
      doc.text(line, x, y);
      y += lineH(size);
    });
  };

  // Multi-line free text with a left rule; flows across pages
  const textBlock = (text, { bar = C.line, empty = 'Non indicato.' } = {}) => {
    const size = 9;
    const content = String(text || '').trim();
    font('normal', size);
    const lines = content ? doc.splitTextToSize(content, CONTENT_W - 6) : [empty];
    lines.forEach((line) => {
      ensure(lineH(size));
      fill(bar);
      doc.rect(M, y - 3.4, 0.9, lineH(size), 'F');
      font('normal', size);
      color(content ? C.soft : C.faint);
      doc.text(line, M + 5, y);
      y += lineH(size);
    });
  };

  const bullets = (items, { x = M, width = CONTENT_W, empty = 'Nessuna funzione specificata.' } = {}) => {
    if (!items.length) {
      paragraph(empty, { c: C.faint, x, width });
      return;
    }
    items.forEach((item) => {
      font('normal', 8.8);
      const lines = doc.splitTextToSize(item, width - 5);
      ensure(lines.length * lineH(8.8) + 1);
      fill(BRAND);
      doc.rect(x, y - 2.2, 1.9, 1.9, 'F');
      color(C.soft);
      doc.text(lines, x + 4.5, y);
      y += lines.length * lineH(8.8) + 1.2;
    });
  };

  // Label/value rows
  const kvTable = (rows) => {
    const col = 48;
    const valueW = CONTENT_W - col - 2;
    rows.forEach((r, i) => {
      font('bold', 9);
      const lines = doc.splitTextToSize(String(r.value || 'Non indicato'), valueW - (r.swatch ? 6 : 0));
      const h = Math.max(8, lines.length * 4.3 + 3.8);
      ensure(h);
      if (i > 0) hr();
      const ty = y + 5.2;
      font('normal', 8.5);
      color(C.muted);
      doc.text(r.label, M, ty);
      let vx = M + col;
      if (r.swatch) {
        fill(rgb(r.swatch));
        doc.rect(vx, ty - 2.9, 3.4, 3.4, 'F');
        vx += 5.8;
      }
      font('bold', 9);
      color(r.value ? C.ink : C.faint);
      doc.text(lines, vx, ty);
      y += h;
    });
    hr();
    y += 7;
  };

  const subheading = (text) => {
    ensure(12);
    font('bold', 10.5);
    color(C.ink);
    doc.text(text, M, y);
    y += 5.5;
  };

  // ── Cover ──
  drawHeader();
  y = 41;
  label('Dossier preliminare · uso interno', M, y, { c: BRAND, bold: true, size: 7 });
  y += 8;
  font('bold', 17);
  color(C.ink);
  const titleLines = doc.splitTextToSize(DOC_TITLE, CONTENT_W);
  doc.text(titleLines, M, y);
  y += (titleLines.length - 1) * 8.1 + 6;
  paragraph(DOC_SUBTITLE, { size: 10, c: C.muted });
  y += 5;

  // Key facts strip
  const facts = [
    { label: 'Azienda', value: companyRow('Ragione sociale') || 'Non indicata' },
    { label: 'Partita IVA', value: companyRow('Partita IVA') || 'Non indicata' },
    { label: 'Settore', value: companyRow('Settore') || 'Non indicato' },
    { label: 'Aree richieste', value: `${dossier.solutions.length} ${dossier.solutions.length === 1 ? 'soluzione' : 'soluzioni'}` }
  ];
  const fw = CONTENT_W / facts.length;
  const fh = 19;
  fill(C.paper);
  doc.rect(M, y, CONTENT_W, fh, 'F');
  facts.forEach((f, i) => {
    const fx = M + i * fw;
    if (i > 0) {
      stroke(C.white, 0.6);
      doc.line(fx, y, fx, y + fh);
    }
    label(f.label, fx + 4, y + 5.5);
    font('bold', 9.5);
    color(C.ink);
    doc.text(doc.splitTextToSize(f.value, fw - 8).slice(0, 2), fx + 4, y + 11.2);
  });
  fill(BRAND);
  doc.rect(M, y + fh, 18, 1.1, 'F');
  y += fh + 12;

  // ── 01 Company & contact ──
  section('Dati Azienda & Referente');
  const cw = CONTENT_W / 2;
  const ch = 14;
  const rowsNeeded = Math.ceil(dossier.company.length / 2);
  ensure(ch * rowsNeeded);
  stroke(C.line);
  dossier.company.forEach((cell, i) => {
    const cx = M + (i % 2) * cw;
    const cy = y + Math.floor(i / 2) * ch;
    doc.rect(cx, cy, cw, ch, 'S');
    label(cell.label, cx + 4, cy + 5.2);
    font('bold', 9.5);
    color(cell.value ? C.ink : C.faint);
    doc.text(doc.splitTextToSize(cell.value || 'Non indicato', cw - 8)[0], cx + 4, cy + 10.6);
  });
  y += ch * rowsNeeded + 9;

  // ── 02 Requested architecture ──
  section('Soluzione Architetturale Richiesta');
  dossier.solutions.forEach((sol, idx) => {
    ensure(22);
    label(`Area ${String(idx + 1).padStart(2, '0')}`, M, y, { c: BRAND, bold: true });
    y += 5;
    subheading(sol.name);
    paragraph(sol.eligibility, { size: 8.3, c: C.muted });
    y += 2.5;
    bullets(sol.modules);
    y += 5;
  });

  if (dossier.voice) {
    ensure(30);
    label('Specifiche agente vocale AI', M, y, { c: BRAND, bold: true });
    y += 5;
    kvTable([
      { label: 'Tipologia voce', value: dossier.voice.gender },
      { label: 'Ruolo e compiti', value: dossier.voice.roles.join('; ') }
    ]);
    ensure(10);
    label('Note / istruzioni di prompting', M, y);
    y += 5;
    textBlock(dossier.voice.prompt, { bar: BRAND });
    y += 6;
  }

  ensure(20);
  label('Canali, integrazioni & infrastruttura', M, y, { c: BRAND, bold: true });
  y += 5;
  kvTable([
    { label: 'Canali & integrazioni', value: dossier.channels.join(', ') },
    { label: 'Infrastruttura dati', value: dossier.hosting }
  ]);

  // ── 03 Improvement analysis ──
  section('Analisi del Miglioramento Sostanziale');
  ensure(12);
  label('Stato iniziale dell\'azienda', M, y);
  y += 5;
  textBlock(dossier.currentState, { bar: C.faint });
  y += 4;
  ensure(12);
  fill(C.ink);
  doc.triangle(M, y - 3, M + 4, y - 3, M + 2, y, 'F');
  label('Soluzione proposta · miglioramento atteso', M + 7, y - 0.6, { c: BRAND, bold: true });
  y += 5.5;
  textBlock(dossier.improvement, { bar: BRAND });
  y += 9;

  // ── 04 Look & Feel ──
  section('Look & Feel Desiderato');
  kvTable(dossier.look);

  // ── 05 Stima Tempistiche di Realizzazione (Sviluppo AI) ──
  if (dossier.timeline) {
    section('Stima Tempistiche Operative di Rilascio');
    const timeRows = [
      { label: 'Tempo totale stimato', value: `~${dossier.timeline.weeks} ${dossier.timeline.weeks === 1 ? 'settimana' : 'settimane'} (ca. ${dossier.timeline.totalDays} giorni lavorativi con AI)` },
      ...dossier.timeline.phases.map((ph) => ({ label: ph.name, value: `~${ph.days} gg · ${ph.desc}` }))
    ];
    kvTable(timeRows);
  }

  // ── 06 Reserved economic proposal (no prices) ──
  section('Proposta Economica');
  font('normal', 8.8);
  const noticeLines = doc.splitTextToSize(ECONOMIC_NOTICE, CONTENT_W - 12);
  const noticeH = noticeLines.length * lineH(8.8) + 11;
  ensure(noticeH);
  fill(C.paper);
  doc.rect(M, y, CONTENT_W, noticeH, 'F');
  fill(BRAND);
  doc.rect(M, y, 1.2, noticeH, 'F');
  font('normal', 8.8);
  color(C.soft);
  doc.text(noticeLines, M + 6, y + 7);
  y += noticeH + 9;

  // ── 06 Operator notes ──
  section('Note Operative');
  textBlock(dossier.operatorNotes, { bar: C.faint, empty: 'Nessuna nota operativa.' });
  y += 9;

  // ── Closing box ──
  font('bold', 9);
  const closeLines = doc.splitTextToSize(INTERNAL_USE_NOTICE, CONTENT_W - 12);
  const closeH = closeLines.length * lineH(9) + 17;
  ensure(closeH);
  fill(C.ink);
  doc.rect(M, y, CONTENT_W, closeH, 'F');
  fill(BRAND);
  doc.rect(M, y + closeH - 1.3, CONTENT_W, 1.3, 'F');
  label('Riservato', M + 6, y + 6.5, { c: C.onInk });
  font('bold', 9);
  color(C.white);
  doc.text(closeLines, M + 6, y + 12);
  label(`Scheda ${docCode} · compilata il ${dateFormatted}`, M + 6, y + closeH - 4.5, { c: C.onInk, size: 5.8 });
  y += closeH;

  // ── Footer on every page ──
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    stroke(C.line);
    doc.line(M, 284, PAGE_W - M, 284);
    label(`${docCode} · Scheda tecnica di fabbisogno · Documento a uso interno`, M, 289, { size: 5.8 });
    label(`Pagina ${p} / ${pages}`, PAGE_W - M, 289, { align: 'right', c: C.muted, size: 5.8 });
  }

  const company = companyRow('Ragione sociale') || 'Azienda';
  const filename = `Scheda_Fabbisogno_MIMIT_${company.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);

  return filename;
}
