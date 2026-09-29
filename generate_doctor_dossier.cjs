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

// Color Palette Conflavoro Luxury
const C = {
  ink: [11, 11, 12],          // #0b0b0c
  brand: [31, 71, 209],       // #1f47d1 (Conflavoro Blue)
  teal: [0, 163, 163],        // #00a3a3 (Nexus Emerald)
  soft: [43, 43, 48],
  muted: [102, 102, 109],
  faint: [155, 155, 161],
  line: [228, 226, 219],
  paper: [247, 246, 242],
  white: [255, 255, 255],
  emeraldLight: [236, 253, 245],
  emeraldBorder: [167, 243, 208],
  emeraldText: [6, 95, 70]
};

const docCode = `DOSSIER-MIMIT-2026-PECI-7741`;
const dateFormatted = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

function drawPageHeader(pageNo, totalPages) {
  // Top brand line
  doc.setFillColor(...C.brand);
  doc.rect(0, 0, PAGE_W, 2.5, 'F');

  // Header Mark & Title
  doc.setFillColor(...C.ink);
  doc.rect(M, 9, 10, 10, 'F');
  doc.setFillColor(...C.brand);
  doc.rect(M + 5, 14, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...C.ink);
  doc.text('CONFLAVORO AI • FORNITORE ABILITATO MIMIT', M + 14, 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Dossier Progettuale su Misura • Voucher Cloud & Cybersecurity 2026', M + 14, 18.5);

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
  doc.text('Studio Medico Dott. Nunzio Peci • Conflavoro Servizi S.r.l. (Fornitore Abilitato MIMIT)', M, PAGE_H - 7);
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
  fill(C.brand);
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
font('bold', 16);
color(C.ink);
doc.text('PROPOSTA PROGETTUALE SU MISURA', M, y);
y += 6;

font('bold', 11);
color(...C.brand);
doc.text('Hub Sanitario Cloud, Automazione RENTRI & Centralino Vocale AI', M, y);
y += 5;

y = textParagraph(
  'Documento di inquadramento tecnico-funzionale redatto a seguito del colloquio specialistico, per la digitalizzazione integrata dello studio medico con accesso al Voucher MIMIT Cloud & Cybersecurity 2026 (Contributo a fondo perduto 50%).',
  y,
  { size: 8.5, c: C.muted }
);
y += 3;

// Box Dati Committente
fill(C.paper);
stroke(C.line);
doc.roundedRect(M, y, CONTENT_W, 26, 1.5, 1.5, 'FD');

font('bold', 8);
color(...C.brand);
doc.text('COMMITTENTE / DATI DELLO STUDIO MEDICO', M + 5, y + 6);

font('bold', 9);
color(C.ink);
doc.text('Dott. Nunzio Peci', M + 5, y + 12);
font('normal', 8);
color(...C.muted);
doc.text('Medico Chirurgo • Specialista in Neurologia (Iscr. Ordine Medici CT n. 10225)', M + 5, y + 17);
doc.text('Sede: Via Martiri della Libertà, 34 - Paternò (CT)', M + 5, y + 22);

doc.setFont('helvetica', 'bold');
doc.text('Attività Clinica Specialistica:', M + 105, y + 12);
doc.setFont('helvetica', 'normal');
doc.text('• Elettroencefalografia (EEG) & Elettromiografia (EMG)', M + 105, y + 17);
doc.text('• Eco-ColorDoppler Transcranico & Visite Neurologiche', M + 105, y + 22);

y += 32;

// Sezione 1: Sintesi del Fabbisogno
y = sectionTitle('1. Analisi del Fabbisogno & Criticità Risolte', y);

const challenges = [
  {
    title: 'Interruzioni durante le visite per il RENTRI',
    desc: 'Lo smaltimento dei rifiuti speciali pericolosi a rischio infettivo (aghi EEG/EMG e cotone ematico) impone oggi l\'accesso digitale con firma. Il sistema elimina le interruzioni delle visite ai pazienti, predisponendo la pratica per una validazione rapida in 1-click.'
  },
  {
    title: 'Frammentazione di 6-7 software e portali separati',
    desc: 'Attualmente lo studio salta continuamente tra il software dei tracciati EEG, il portale RENTRI, il Fascicolo Sanitario Regionale, i portali di prenotazione online (MioDottore/Doctolib) e la fatturazione sanitaria. Il progetto unifica tutti i flussi in un unico Hub Cloud protetto.'
  },
  {
    title: 'Chiamate dei pazienti perse durante gli esami strumentali',
    desc: 'Durante l\'esecuzione di un EEG o di una visita neurologica il medico non può rispondere al telefono. L\'Agente Vocale AI accoglie i pazienti 24/7, fissa gli appuntamenti e fornisce le istruzioni di preparazione all\'esame (es. capelli puliti senza lacca/gel).'
  }
];

challenges.forEach((item, idx) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 17, 1.5, 1.5, 'FD');
  
  fill(C.brand);
  doc.rect(M, y, 2, 17, 'F');

  font('bold', 8.5);
  color(C.ink);
  doc.text(`${idx + 1}. ${item.title}`, M + 5, y + 5.5);

  y = textParagraph(item.desc, y + 9.5, { size: 7.8, c: C.soft, width: CONTENT_W - 8, x: M + 5 });
  y += 3;
});

y += 2;

// Sezione 2: Il Quadro Agevolativo MIMIT
y = sectionTitle('2. Inquadramento Voucher MIMIT 2026', y);

fill(...C.emeraldLight);
stroke(...C.emeraldBorder);
doc.roundedRect(M, y, CONTENT_W, 26, 1.5, 1.5, 'FD');

font('bold', 9);
color(...C.emeraldText);
doc.text('VANTAGGIO ECONOMICO: CONTRIBUTO A FONDO PERDUTO 50%', M + 5, y + 6.5);

font('normal', 8.2);
color(...C.emeraldText);
const mimitText = 'Il progetto rientra pienamente nelle categorie Cloud SaaS, Automazione Workflow e Cybersecurity del Bando MIMIT 2026. Conflavoro Servizi S.r.l. è fornitore abilitato: l\'offerta viene formulata con i codici identificativi ministeriali per consentire allo studio medico di ottenere il rimborso del 50% delle spese ammissibili (fino a 20.000 € a fondo perduto).';
y = textParagraph(mimitText, y + 11.5, { size: 7.8, c: C.emeraldText, width: CONTENT_W - 8, x: M + 5 });

// ==========================================
// PAGINA 2: I 4 PILASTRI DELLA SOLUZIONE
// ==========================================
doc.addPage();
drawPageHeader(2, TOTAL_PAGES);
y = TOP;

y = sectionTitle('3. I 4 Pilastri della Soluzione Conflavoro AI', y);

const pillars = [
  {
    tag: 'PILASTRO 1 • GESTIONALE CLOUD SAAS & CARTELLE EEG',
    title: 'Hub Unificato dello Studio Medico',
    points: [
      'Cartella clinica neurologica digitale con anagrafica pazienti unificata.',
      'Archiviazione e associazione immediata dei referti e tracciati strumentali (EEG, EMG, Doppler) in formato PDF conforme.',
      'Accesso sicuro da qualsiasi dispositivo (PC studio, portatile, tablet) con credenziali protette e protocolli crittografici sanitari.'
    ]
  },
  {
    tag: 'PILASTRO 2 • WORKFLOW RENTRI & SISTEMA TESSERA SANITARIA',
    title: 'Interoperabilità e Automazione Senza Interruzioni',
    points: [
      'Modulo RENTRI: ricezione e pre-compilazione automatica dei dati del Formulario Rifiuti (FIR) all\'arrivo della ditta di smaltimento, con notifica e validazione in 1-click.',
      'Connettore Fatturazione Sanitaria: generazione fatture elettroniche ed esportazione automatica verso il Sistema Tessera Sanitaria (spese sanitarie 730).',
      'Predisposizione referti nei formati digitali standard (CDA2/PDF sanitari) per il Fascicolo Sanitario Elettronico (FSE).'
    ]
  },
  {
    tag: 'PILASTRO 3 • CENTRALINO VOIP & AGENTE VOCALE AI',
    title: 'Accoglienza Telefonica 24/7 & Prenotazioni EEG',
    points: [
      'Assistente Vocale AI configurato con voce professionale e terminologia clinica.',
      'Gestione autonoma delle prenotazioni sincronizzata in tempo reale con l\'agenda dello studio.',
      'Fornitura istruzioni pre-esame (preparazione corretta per elettroencefalografia).',
      'Invio automatico di promemoria e conferme su WhatsApp Business per azzerare i no-show.'
    ]
  },
  {
    tag: 'PILASTRO 4 • CYBERSECURITY & SOVRANITÀ DATI GDPR',
    title: 'Protezione Dati Sensibili & Continuità Operativa',
    points: [
      'Crittografia a riposo e in transito per tutte le cartelle cliniche e referti sanitari.',
      'Backup cloud automatico ridondato su server europei (100% GDPR Compliant).',
      'Protezione endpoint avanzata contro ransomware, malware e accessi non autorizzati.'
    ]
  }
];

pillars.forEach((p) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 35, 1.5, 1.5, 'FD');

  font('bold', 7.5);
  color(...C.brand);
  doc.text(p.tag, M + 5, y + 5.5);

  font('bold', 9.5);
  color(C.ink);
  doc.text(p.title, M + 5, y + 10.5);

  let py = y + 15;
  p.points.forEach((pt) => {
    fill(C.brand);
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
  'Grazie all\'infrastruttura di scaffolding AI proprietaria di Conflavoro e ai moduli modulari pre-certificati, i tempi di sviluppo, testing clinico e messa in produzione sono stimati in circa 3-4 settimane lavorative:',
  y,
  { size: 8.5, c: C.muted }
);
y += 2;

const phases = [
  { phase: 'FASE 1 (~5 gg)', title: 'Setup Architettura Cloud & Cartella Sanitaria', desc: 'Attivazione ambiente cloud protetto, configurazione anagrafica pazienti e template refertazione EEG/EMG.' },
  { phase: 'FASE 2 (~6 gg)', title: 'Connettori Workflow, RENTRI & Fatturazione TS', desc: 'Configurazione flusso pre-compilazione formulari rifiuti e connettore per fatturazione sanitaria.' },
  { phase: 'FASE 3 (~5 gg)', title: 'Addestramento Agente Vocale & WhatsApp', desc: 'Configurazione prompt clinico, orari studio, istruzioni preparatorie EEG e linea VoIP.' },
  { phase: 'FASE 4 (~4 gg)', title: 'Collaudo con il Medico, Test & Go-Live', desc: 'Periodo di prova operativa con il Dott. Peci, simulazione chiamate reali e affiancamento al rilascio.' }
];

phases.forEach((ph) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 14.5, 1.2, 1.2, 'FD');

  font('bold', 8);
  color(...C.brand);
  doc.text(ph.phase, M + 4, y + 5.5);

  font('bold', 8.5);
  color(C.ink);
  doc.text(ph.title, M + 36, y + 5.5);

  font('normal', 7.5);
  color(...C.muted);
  doc.text(ph.desc, M + 36, y + 10.5);

  y += 17.5;
});

y += 3;

// Sezione 5: Calendario Ministeriale MIMIT
y = sectionTitle('5. Scadenze Ministeriali & Prossimi Passi', y);

const stepsMimit = [
  { date: '20 OTTOBRE 2026', title: 'Fase di Precompilazione Ministeriale', desc: 'Accesso alla piattaforma MIMIT, caricamento progetto/offerta e firma digitale del Dott. Peci con rilascio del codice di predisposizione.' },
  { date: '10 NOVEMBRE 2026', title: 'Apertura Invio Formale (Click-Day)', desc: 'Invio telematico prioritario della domanda alle ore 12:00 per garantire la posizione nella graduatoria cronologica a sportello.' },
  { date: 'POST CONCESSIONE', title: 'Avvio Lavori & Rendicontazione a Rimborso', desc: 'Sottoscrizione contratto, rilascio piattaforma ed erogazione del contributo del 50% da parte del Ministero.' }
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
  color(...C.muted);
  doc.text(st.desc, M + 36, y + 10.5);

  y += 18;
});

y += 3;

// Box Istituzionale Chiusura Presidenza
fill(...C.ink);
doc.roundedRect(M, y, CONTENT_W, 23, 1.5, 1.5, 'F');
fill(...C.brand);
doc.rect(M, y + 21.8, CONTENT_W, 1.2, 'F');

font('bold', 7.5);
color(...C.brand);
doc.text('NOTA ISTITUZIONALE RISERVATA • PRESIDENZA ROBERTO CAPOBIANCO', M + 5, y + 6);

font('normal', 7.8);
color(C.white);
doc.text('Il presente documento sintetizza il fabbisogno tecnico specialistico rilevato per lo Studio Medico Dott. Nunzio Peci.', M + 5, y + 11.5);
doc.text('Trasmesso alla Presidenza e all\'Ufficio Amministrazione di Conflavoro per la formulazione dell\'offerta economica', M + 5, y + 15.5);
doc.text('ufficiale con i codici identificativi fornitore abilitato MIMIT e la predisposizione del fascicolo per il 20 ottobre.', M + 5, y + 19.5);

// Output file directly to Desktop
const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\stree', 'Desktop', 'PROPOSTA_PROGETTO_MIMIT_DOTT_NUNZIO_PECI.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(desktopPath, Buffer.from(pdfBytes));

console.log('PDF Dossier created successfully on Desktop at:', desktopPath);
