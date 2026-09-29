const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

doc.setLineHeightFactor(1.35);

const PAGE_W = 210;
const PAGE_H = 297;
const M = 16;
const CONTENT_W = PAGE_W - (M * 2);
const TOP = 36;
const BOTTOM = 275;

// Color Palette Medical Luxury (Blu Medicale Conflavoro, Cyan Clinico, Nero Antracite)
const C = {
  ink: [11, 11, 12],          // #0b0b0c
  brand: [31, 71, 209],       // #1f47d1 (Conflavoro Blue)
  cyan: [14, 116, 144],       // #0e7490 (Medical Cyan)
  soft: [43, 43, 48],
  muted: [102, 102, 109],
  faint: [155, 155, 161],
  line: [228, 226, 219],
  paper: [248, 248, 246],
  white: [255, 255, 255],
  emeraldLight: [236, 253, 245],
  emeraldBorder: [167, 243, 208],
  emeraldText: [6, 95, 70],
  cyanLight: [236, 254, 255],
  cyanBorder: [165, 243, 252],
  cyanText: [21, 94, 117]
};

const docCode = `DOSSIER-MIMIT-2026-CORAZZI-MED88`;
const dateFormatted = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

function drawPageHeader(pageNo, totalPages) {
  // Top brand line
  doc.setFillColor(...C.brand);
  doc.rect(0, 0, PAGE_W, 2.5, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(M, 0, 40, 2.5, 'F');

  // Header Mark & Title
  doc.setFillColor(...C.ink);
  doc.rect(M, 9, 10, 10, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(M + 5, 14, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...C.ink);
  doc.text('CONFLAVORO AI • FORNITORE ABILITATO MIMIT', M + 14, 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Dossier Tecnico Specialistico • Voucher Cloud & Cybersecurity 2026', M + 14, 18.5);

  // Right Code & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.ink);
  doc.text(docCode, PAGE_W - M, 14.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text(dateFormatted, PAGE_W - M, 18.5, { align: 'right' });

  // Header divider
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.line(M, 23, PAGE_W - M, 23);

  // Page Footer
  doc.line(M, PAGE_H - 12, PAGE_W - M, PAGE_H - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text('Studio Medico Dott. Fabio Corazzi • Consulenza Tecnica: Raffaele Di Tullo • Conflavoro Servizi S.r.l.', M, PAGE_H - 7);
  doc.text(`Pagina ${pageNo} di ${totalPages}`, PAGE_W - M, PAGE_H - 7, { align: 'right' });
}

// Helper functions
const font = (style = 'normal', size = 9) => { doc.setFont('helvetica', style); doc.setFontSize(size); };
const color = (...args) => {
  const c = Array.isArray(args[0]) ? args[0] : args;
  doc.setTextColor(...c);
};
const fill = (...args) => {
  const c = Array.isArray(args[0]) ? args[0] : args;
  doc.setFillColor(...c);
};
const stroke = (...args) => {
  let c = args[0];
  let w = 0.25;
  if (Array.isArray(c)) {
    if (args.length > 1) w = args[1];
  } else if (args.length >= 3) {
    c = [args[0], args[1], args[2]];
    if (args.length > 3) w = args[3];
  }
  doc.setDrawColor(...c);
  doc.setLineWidth(w);
};
const lineH = (size) => size * 0.3528 * 1.35;

function sectionTitle(title, yPos) {
  fill(C.cyan);
  doc.rect(M, yPos - 2.5, 2.5, 2.5, 'F');
  font('bold', 10);
  color(C.ink);
  doc.text(title.toUpperCase(), M + 5, yPos, { charSpace: 0.3 });
  stroke(C.line, 0.3);
  doc.line(M, yPos + 2.5, PAGE_W - M, yPos + 2.5);
  return yPos + 7;
}

function textParagraph(txt, yPos, { size = 8.5, c = C.soft, width = CONTENT_W, x = M } = {}) {
  font('normal', size);
  color(c);
  const lines = doc.splitTextToSize(String(txt || ''), width);
  lines.forEach((l) => {
    doc.text(l, x, yPos);
    yPos += lineH(size);
  });
  return yPos;
}

const TOTAL_PAGES = 3;

// ==========================================
// PAGINA 1: PRESENTAZIONE ESECUTIVA & DOSSIER
// ==========================================
drawPageHeader(1, TOTAL_PAGES);
let y = TOP;

// Titolo Principale
font('bold', 15.5);
color(C.ink);
doc.text('PROPOSTA PROGETTUALE SPECIALISTICA MEDICALE', M, y);
y += 6;

font('bold', 10.5);
color(C.cyan);
doc.text('Hub Clinico AI, Acquisizione Multi-Camera (5 Cam), Comparazione Foto & Controllo Vocale', M, y);
y += 5;

y = textParagraph(
  'Documento di inquadramento tecnico redatto a seguito del colloquio specialistico con il Dott. Fabio Corazzi, per l\'innovazione del sistema di imaging clinico, analisi Before/After con Vision AI e controllo vocale hands-free con accesso al Voucher MIMIT Cloud 2026 (50% a fondo perduto).',
  y,
  { size: 8.5, c: C.muted }
);
y += 3;

// Box Dati Committente
fill(C.paper);
stroke(C.line);
doc.roundedRect(M, y, CONTENT_W, 28, 1.5, 1.5, 'FD');

font('bold', 8);
color(C.cyan);
doc.text('COMMITTENTE / DATI STUDIO MEDICO SPECIALISTICO', M + 5, y + 6);

font('bold', 9);
color(C.ink);
doc.text('Dott. Fabio Corazzi', M + 5, y + 12);
font('normal', 8);
color(C.muted);
doc.text('Attività: Medico Chirurgo • Medicina Estetica, Dermatologia & Trattamenti Clinici', M + 5, y + 16.5);
doc.text('Inquadramento: Libero Professionista / Studio Medico Specialistico', M + 5, y + 21);
doc.text('Flusso Attuale: Gestione consensi, diario clinico, fatture e visite già operative', M + 5, y + 25.5);

doc.setFont('helvetica', 'bold');
doc.text('Infrastruttura & Hardware Studio:', M + 105, y + 12);
doc.setFont('helvetica', 'normal');
doc.text('• Sistema 5 Fotocamere (frontale, laterali, 3/4) motorizzato', M + 105, y + 16.5);
doc.text('• Target: Migrazione da Windows a macOS / Cloud Privato Studio', M + 105, y + 21);
doc.text('• Controllo: Assistente Vocale Hands-Free & Vision AI comparativa', M + 105, y + 25.5);

y += 34;

// Sezione 1: Sintesi del Fabbisogno
y = sectionTitle('1. Analisi del Fabbisogno & Criticità Risolte', y);

const challenges = [
  {
    title: 'Acquisizione Multi-Camera (5 Cam) & Comparazione Immagini Before/After',
    desc: 'L\'attuale gestione delle fotografie cliniche è rallentata da software legacy. Il nuovo sistema coordina le 5 fotocamere (angolazioni frontale, laterale dx/sx e 3/4) con visualizzazione simultanea side-by-side per confrontare istantaneamente lo stato del paziente prima (T0) e dopo i cicli di trattamento (T1, T2).'
  },
  {
    title: 'Assistente Vocale Hands-Free per l\'uso durante i trattamenti clinici',
    desc: 'Durante l\'esecuzione di trattamenti iniettabili o laser, il medico indossa guanti sterili e non può toccare tastiera o mouse. L\'Assistente Vocale AI integrato riconosce la voce dell\'operatore per impartire comandi vocali in tempo reale (scatto, cambio fotocamera, zoom e dettatura note nel referto).'
  },
  {
    title: 'Vision AI per catalogazione trattamenti (Capillari, Macchie, Discromie) & Privacy GDPR',
    desc: 'L\'AI assiste il medico nella rilevazione guidata di parametri dermatologici (macchie solari, rossori, lesioni vascolari) generando report clinici automatici. I dati e i file ad altissima risoluzione risiedono su database e server interni protetti (Edge AI), garantendo la massima riservatezza medica GDPR.'
  }
];

challenges.forEach((item, idx) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 16.5, 1.5, 1.5, 'FD');
  
  fill(C.cyan);
  doc.rect(M, y, 2, 16.5, 'F');

  font('bold', 8.5);
  color(C.ink);
  doc.text(`${idx + 1}. ${item.title}`, M + 5, y + 5.5);

  y = textParagraph(item.desc, y + 9.5, { size: 7.7, c: C.soft, width: CONTENT_W - 8, x: M + 5 });
  y += 3;
});

y += 1.5;

// Sezione 2: Il Quadro Agevolativo MIMIT
y = sectionTitle('2. Inquadramento Voucher MIMIT 2026', y);

fill(C.emeraldLight);
stroke(C.emeraldBorder);
doc.roundedRect(M, y, CONTENT_W, 25, 1.5, 1.5, 'FD');

font('bold', 9);
color(C.emeraldText);
doc.text('VANTAGGIO ECONOMICO: CONTRIBUTO A FONDO PERDUTO 50%', M + 5, y + 6);

font('normal', 8.2);
color(C.emeraldText);
const mimitText = 'Il progetto rientra nelle categorie Cloud SaaS Medicale, Integrazione Vision AI & Voice Control e Cybersecurity Dati Sanitari del Bando MIMIT 2026. Conflavoro Servizi S.r.l. è fornitore formalmente abilitato: l\'offerta viene formulata con i codici identificativi ministeriali per consentire al Dott. Fabio Corazzi di ottenere il rimborso del 50% a fondo perduto delle spese sostenute (fino a 20.000 €).';
y = textParagraph(mimitText, y + 11, { size: 7.8, c: C.emeraldText, width: CONTENT_W - 8, x: M + 5 });

// ==========================================
// PAGINA 2: I 4 PILASTRI DELLA SOLUZIONE
// ==========================================
doc.addPage();
drawPageHeader(2, TOTAL_PAGES);
y = TOP;

y = sectionTitle('3. I 4 Pilastri della Soluzione Conflavoro AI', y);

const pillars = [
  {
    tag: 'PILASTRO 1 • GESTIONALE IMAGING MEDICO & CONTROLLO 5 FOTOCAMERE',
    title: 'Hub di Acquisizione Multi-Angolo & Comparazione Before/After',
    points: [
      'Account unico centralizzato per il controllo e scatto sincronizzato delle 5 fotocamere Wi-Fi.',
      'Interfaccia moderna e reattiva nativa per macOS e ambienti cloud privati con gestione zoom e parametri di scatto.',
      'Visualizzatore comparativo avanzato: visualizzazione affiancata side-by-side e overlay trasparente tra date diverse.'
    ]
  },
  {
    tag: 'PILASTRO 2 • ASSISTENTE VOCALE HANDS-FREE (VOICE CONTROL IN STUDIO)',
    title: 'Comando Vocale Operativo in Tempo Reale per Procedure Mediche',
    points: [
      'Riconoscimento vocale avanzato calibrato sulla voce del medico: scatto foto, selezione camera e zoom a mani libere.',
      'Dettatura automatica in linguaggio naturale delle note cliniche e dei parametri di trattamento direttamente nel report.',
      'Azzeramento dei tempi morti durante le sedute e totale rispetto dei protocolli igienico-sanitari.'
    ]
  },
  {
    tag: 'PILASTRO 3 • VISION AI DETERMINISTICA & REPORTISTICA TRATTAMENTI',
    title: 'Analisi Assistita Discromie, Capillari e Macchie Solari',
    points: [
      'Pre-impostazioni diagnostiche personalizzabili in base al trattamento (capillari, macchie solari, rossori, texture).',
      'Generazione automatica di dossier clinici fotografici per il paziente con confronto temporale e firma digitale.',
      'Motore di validazione deterministico con supervisione e conferma obbligatoria del medico prima del salvataggio.'
    ]
  },
  {
    tag: 'PILASTRO 4 • CYBERSECURITY, EDGE SERVER PRIVATO & CONFORMITÀ GDPR',
    title: 'Protezione Dati Sanitari Sensibili & Isolamento Locale',
    points: [
      'Database crittografato su server locale dello studio con backup cloud ridondato e cifrato su server europei.',
      'Conformità rigorosa al Regolamento UE 2016/679 (GDPR) e alle linee guida del Garante per la protezione dati sanitari.',
      'Protezione endpoint contro ransomware, malware e accessi non autorizzati all\'archivio immagini.'
    ]
  }
];

pillars.forEach((p) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 35, 1.5, 1.5, 'FD');

  font('bold', 7.5);
  color(C.cyan);
  doc.text(p.tag, M + 5, y + 5.5);

  font('bold', 9.5);
  color(C.ink);
  doc.text(p.title, M + 5, y + 10.5);

  let py = y + 15;
  p.points.forEach((pt) => {
    fill(C.cyan);
    doc.circle(M + 7, py - 1, 0.8, 'F');
    py = textParagraph(pt, py, { size: 7.8, c: C.soft, width: CONTENT_W - 14, x: M + 10 });
    py += 0.5;
  });

  y += 38;
});

// ==========================================
// PAGINA 3: CRONOPROGRAMMA & PROSSIMI PASSI
// ==========================================
doc.addPage();
drawPageHeader(3, TOTAL_PAGES);
y = TOP;

// Sezione 4: Cronoprogramma Rilascio
y = sectionTitle('4. Cronoprogramma Operativo di Realizzazione', y);

y = textParagraph(
  'Lo sviluppo del software specialistico e l\'addestramento dei motori AI sono gestiti dal team di ingegneri Conflavoro AI a stretto contatto con il Dott. Corazzi. Tempi stimati per la messa in produzione: 25-35 giorni lavorativi:',
  y,
  { size: 8.5, c: C.muted }
);
y += 2;

const phases = [
  { phase: 'FASE 1 (~7 gg)', title: 'Architettura macOS/Server & Connettori 5 Cam', desc: 'Sviluppo backend, protocollo di comunicazione Wi-Fi con le 5 fotocamere e gestione sincronizzazione scatti.' },
  { phase: 'FASE 2 (~8 gg)', title: 'Motore Comparativo Before/After & UI Studio', desc: 'Creazione interfaccia grafica comparativa side-by-side, overlay temporale e gestione cartelle fotografiche.' },
  { phase: 'FASE 3 (~8 gg)', title: 'Assistente Vocale Hands-Free & Modulo Vision AI', desc: 'Integrazione comandi vocali in tempo reale e algoritmi di rilevazione guidata discromie/trattamenti.' },
  { phase: 'FASE 4 (~6 gg)', title: 'Collaudo in Studio, Test Sicurezza & Rilascio', desc: 'Test operativo con il Dott. Corazzi sulle apparecchiature dello studio, collaudo GDPR e messa in produzione.' }
];

phases.forEach((ph) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 14.5, 1.2, 1.2, 'FD');

  font('bold', 8);
  color(C.cyan);
  doc.text(ph.phase, M + 4, y + 5.5);

  font('bold', 8.5);
  color(C.ink);
  doc.text(ph.title, M + 36, y + 5.5);

  font('normal', 7.5);
  color(C.muted);
  doc.text(ph.desc, M + 36, y + 10.5);

  y += 17.5;
});

y += 3;

// Sezione 5: Calendario Ministeriale MIMIT
y = sectionTitle('5. Scadenze Ministeriali & Prossimi Passi', y);

const stepsMimit = [
  { date: '20 OTTOBRE 2026', title: 'Precompilazione Ministeriale (SPID/Firma)', desc: 'Accesso alla piattaforma Invitalia/MIMIT, inserimento preventivo ufficiale Conflavoro e firma digitale (.p7m) del Dott. Fabio Corazzi.' },
  { date: '10 NOVEMBRE 2026', title: 'Click-Day / Apertura Invio Formale', desc: 'Invio telematico prioritario della domanda alle ore 12:00 per garantire la posizione nella graduatoria cronologica a sportello.' },
  { date: 'POST CONCESSIONE', title: 'Esecuzione Sviluppo & Erogazione Rimborso', desc: 'Sottoscrizione contratto, sviluppo specialistico in affiancamento ed erogazione del contributo a fondo perduto del 50% dal Ministero.' }
];

stepsMimit.forEach((st) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 15, 1.2, 1.2, 'FD');

  fill(C.ink);
  doc.rect(M, y, 32, 15, 'F');
  font('bold', 7.2);
  color(C.white);
  doc.text(st.date, M + 3, y + 9);

  font('bold', 8.5);
  color(C.ink);
  doc.text(st.title, M + 36, y + 5.5);

  font('normal', 7.5);
  color(C.muted);
  doc.text(st.desc, M + 36, y + 10.5);

  y += 18;
});

y += 3;

// Box Istituzionale Chiusura Presidenza
fill(C.ink);
doc.roundedRect(M, y, CONTENT_W, 23, 1.5, 1.5, 'F');
fill(C.cyan);
doc.rect(M, y + 21.8, CONTENT_W, 1.2, 'F');

font('bold', 7.5);
color(C.cyan);
doc.text('NOTA ISTITUZIONALE RISERVATA • PRESIDENZA ROBERTO CAPOBIANCO', M + 5, y + 6);

font('normal', 7.8);
color(C.white);
doc.text('Documento tecnico redatto dal consulente Raffaele Di Tullo per il committente Dott. Fabio Corazzi (Studio Medico).', M + 5, y + 11.5);
doc.text('Trasmesso alla Presidenza e all\'Ufficio Amministrazione di Conflavoro per la formulazione dell\'offerta economica', M + 5, y + 15.5);
doc.text('ufficiale con i codici identificativi fornitore abilitato MIMIT per la precompilazione del 20 ottobre.', M + 5, y + 19.5);

// Output file directly to Desktop
const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\stree', 'Desktop', 'PROPOSTA_PROGETTO_MIMIT_DOTT_FABIO_CORAZZI.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(desktopPath, Buffer.from(pdfBytes));

console.log('PDF Dossier created successfully on Desktop at:', desktopPath);
