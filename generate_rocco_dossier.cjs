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

// Color Palette Luxury (Bianco, Nero Profondo, Oro 24K, Conflavoro Blue)
const C = {
  ink: [11, 11, 12],          // #0b0b0c
  brand: [31, 71, 209],       // #1f47d1 (Conflavoro Blue)
  gold: [197, 155, 39],       // #c59b27 (Luxury Gold Accent)
  goldLight: [254, 252, 232],
  soft: [43, 43, 48],
  muted: [102, 102, 109],
  faint: [155, 155, 161],
  line: [228, 226, 219],
  paper: [248, 247, 244],
  white: [255, 255, 255],
  emeraldLight: [236, 253, 245],
  emeraldBorder: [167, 243, 208],
  emeraldText: [6, 95, 70]
};

const docCode = `DOSSIER-MIMIT-2026-TAFFORA-4SEDI`;
const dateFormatted = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

function drawPageHeader(pageNo, totalPages) {
  // Top brand line with gold accent
  doc.setFillColor(...C.ink);
  doc.rect(0, 0, PAGE_W, 2.5, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(M, 0, 40, 2.5, 'F');

  // Header Mark & Title
  doc.setFillColor(...C.ink);
  doc.rect(M, 9, 10, 10, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(M + 5, 14, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...C.ink);
  doc.text('CONFLAVORO AI • FORNITORE ABILITATO MIMIT', M + 14, 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Dossier Progettuale Multi-Sede • Voucher Cloud & Cybersecurity 2026', M + 14, 18.5);

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
  doc.text('Rocco Taffora (Catena 4 Saloni) • Consulenza Tecnica: R. Di Tullo & Y. Corti • Conflavoro Servizi S.r.l.', M, PAGE_H - 7);
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
  fill(C.gold);
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
doc.text('PROPOSTA PROGETTUALE MULTI-SEDE SU MISURA', M, y);
y += 6;

font('bold', 10.5);
color(C.gold);
doc.text('Hub Digitale Cloud, CRM WhatsApp, E-Commerce & Booking per 4 Saloni', M, y);
y += 5;

y = textParagraph(
  'Documento di inquadramento tecnico redatto a seguito del colloquio specialistico con Rocco Taffora, per la digitalizzazione integrata e proprietaria delle 4 sedi operative con accesso al Voucher MIMIT Cloud & Cybersecurity 2026 (Fondo perduto 50%).',
  y,
  { size: 8.5, c: C.muted }
);
y += 3;

// Box Dati Committente Completo
fill(C.paper);
stroke(C.line);
doc.roundedRect(M, y, CONTENT_W, 28, 1.5, 1.5, 'FD');

font('bold', 8);
color(C.gold);
doc.text('COMMITTENTE / DATI RETE SALONI DI BELLEZZA', M + 5, y + 6);

font('bold', 9);
color(C.ink);
doc.text('Rocco Taffora', M + 5, y + 12);
font('normal', 8);
color(C.muted);
doc.text('Email: rocco.taffora999@gmail.com', M + 5, y + 16.5);
doc.text('Attività: Rete Saloni Parrucchieri & Hair Styling Luxury', M + 5, y + 21);
doc.text('Struttura: 4 Sedi Operative (8 Linee Telefoniche & WhatsApp dedicati)', M + 5, y + 25.5);

doc.setFont('helvetica', 'bold');
doc.text('Stato Tecnologico & Hardware:', M + 105, y + 12);
doc.setFont('helvetica', 'normal');
doc.text('• Software attuale da evolvere: Panema', M + 105, y + 16.5);
doc.text('• Contabilità/Fatture: Già attiva su Docasy (commercialista)', M + 105, y + 21);
doc.text('• Hardware già presente: Totem touch, tablet reception, POS', M + 105, y + 25.5);

y += 34;

// Sezione 1: Sintesi del Fabbisogno
y = sectionTitle('1. Analisi del Fabbisogno & Criticità Risolte', y);

const challenges = [
  {
    title: 'Superamento dei limiti di "Panema" con piattaforma proprietaria per 4 Sedi',
    desc: 'L\'attuale gestione tramite Panema limita la scalabilità e non offre un sito web proprietario né un e-commerce centralizzato. Il progetto crea una piattaforma unica Cloud SaaS che gestisce le 4 sedi in modo autonomo ma centralizzato, riutilizzando tutti i tablet e totem touch già presenti nei saloni.'
  },
  {
    title: 'Azzeramento No-Show e gestione appuntamenti tramite WhatsApp Business (8 Linee)',
    desc: 'Con 4 saloni e 8 numeri telefonici, la gestione manuale delle prenotazioni genera sovrapposizioni e appuntamenti saltati. Il sistema automatizza l\'invio di promemoria WhatsApp 24h prima e attiva workflow di follow-up (es. invito a rinnovare il colore/taglio a 30-40 giorni).'
  },
  {
    title: 'Landing Page Luxury con E-Commerce & Booking Online 24/7',
    desc: 'I clienti potranno selezionare la sede desiderata, scegliere il parrucchiere/stilista, prenotare il servizio o acquistare online i prodotti professionali per capelli a qualsiasi ora, con pagamenti digitali e sincronizzazione istantanea con l\'agenda dei collaboratori.'
  }
];

challenges.forEach((item, idx) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 16.5, 1.5, 1.5, 'FD');
  
  fill(C.gold);
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
const mimitText = 'Il progetto rientra nelle categorie Cloud SaaS, E-Commerce Integrato a Gestionale e CRM Automazione Workflow del Bando MIMIT 2026. Conflavoro Servizi S.r.l. è fornitore formalmente abilitato: l\'offerta viene formulata con i codici identificativi ministeriali per consentire a Rocco Taffora di ottenere il rimborso del 50% a fondo perduto delle spese sostenute (fino a 20.000 €).';
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
    tag: 'PILASTRO 1 • GESTIONALE CLOUD SAAS MULTI-SEDE (4 SEDI)',
    title: 'Centro di Comando Magazzino, Fornitori & Personale',
    points: [
      'Gestione unificata ma distinta per le 4 sedi operative: giacenze prodotti cosmetici, tinte e consumo salone.',
      'Soglie di riordino automatico e listini fornitori (esclusa la contabilità/fatture già gestita con successo su Docasy).',
      'Piena compatibilità nativa con i totem touch, tablet reception e postazioni POS già presenti nei saloni.'
    ]
  },
  {
    tag: 'PILASTRO 2 • CRM & AUTOMAZIONE WORKFLOW (WHATSAPP BUSINESS & TELEGRAM)',
    title: 'Rubrica Clienti Intelligente & Promemoria Anti-No-Show',
    points: [
      'Anagrafica clienti con storico trattamenti, formule colori personalizzate e frequenza di visita per sede.',
      'Gestione degli 8 numeri di contatto con smistamento e messaggistica WhatsApp Business centralizzata.',
      'Promemoria automatici WhatsApp 24h prima della seduta per azzerare gli appuntamenti persi.',
      'Campagne automatiche di fidelizzazione (compleanni, promozioni e riordino seduta dopo 30-45 giorni).'
    ]
  },
  {
    tag: 'PILASTRO 3 • PORTALE WEB LUXURY, E-COMMERCE & PRENOTAZIONI 24/7',
    title: 'Sito Proprietario Bianco/Nero/Oro & Vendita Prodotti Capelli',
    points: [
      'Design personalizzato Luxury (palette Bianco/Nero con accenti Oro 24K e Tortora) ad altissimo impatto visivo.',
      'Modulo di prenotazione online per sede con selezione stilista/trattamento e sincronizzazione in tempo reale.',
      'E-commerce per la vendita diretta di shampoo, creme e trattamenti professionali con pagamento digitale.'
    ]
  },
  {
    tag: 'PILASTRO 4 • INTELLIGENZA ARTIFICIALE & CHATBOT MULTICANALE',
    title: 'Assistenza H24 & Qualificazione Richieste Clienti',
    points: [
      'Assistente AI operativo su Web, WhatsApp e Telegram per rispondere alle domande frequenti e guidare alla prenotazione.',
      'Massima conformità normativa (dichiarazione automatica di assistenza AI) e passaggio immediato a operatore umano.',
      'Infrastruttura sicura ospitata su server europei con pieno rispetto della privacy dei clienti (GDPR).'
    ]
  }
];

pillars.forEach((p) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 35, 1.5, 1.5, 'FD');

  font('bold', 7.5);
  color(C.gold);
  doc.text(p.tag, M + 5, y + 5.5);

  font('bold', 9.5);
  color(C.ink);
  doc.text(p.title, M + 5, y + 10.5);

  let py = y + 15;
  p.points.forEach((pt) => {
    fill(C.gold);
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
  'La realizzazione del software è affidata a un team di programmatori dedicati Conflavoro AI. I tempi tecnici di sviluppo, personalizzazione grafica Luxury, test e rilascio operativo sono stimati in 20-30 giorni lavorativi:',
  y,
  { size: 8.5, c: C.muted }
);
y += 2;

const phases = [
  { phase: 'FASE 1 (~6 gg)', title: 'Setup Cloud Multi-Sede & Magazzino', desc: 'Configurazione architettura per le 4 sedi, importazione anagrafica servizi/trattamenti e listini fornitori.' },
  { phase: 'FASE 2 (~7 gg)', title: 'CRM, WhatsApp (8 Linee) & Automazioni', desc: 'Integrazione canali WhatsApp Business e Telegram, impostazione promemoria anti no-show e schede clienti.' },
  { phase: 'FASE 3 (~7 gg)', title: 'Design Luxury, Booking & E-Commerce', desc: 'Sviluppo interfaccia grafica Bianco/Nero/Oro, carrello e-commerce prodotti e modulo prenotazioni per sede.' },
  { phase: 'FASE 4 (~5 gg)', title: 'Collaudo con Rocco, Test Totem/Tablet & Go-Live', desc: 'Test su tablet/totem dei saloni, formazione al personale delle 4 sedi e messa online ufficiale.' }
];

phases.forEach((ph) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 14.5, 1.2, 1.2, 'FD');

  font('bold', 8);
  color(C.gold);
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
  { date: '20 OTTOBRE 2026', title: 'Precompilazione Ministeriale (SPID/Firma)', desc: 'Accesso alla piattaforma Invitalia/MIMIT, inserimento preventivo ufficiale Conflavoro e firma digitale (.p7m) di Rocco Taffora.' },
  { date: '10 NOVEMBRE 2026', title: 'Click-Day / Apertura Invio Formale', desc: 'Invio telematico prioritario della domanda alle ore 12:00 per garantire la posizione nella graduatoria cronologica a sportello.' },
  { date: 'POST CONCESSIONE', title: 'Esecuzione Sviluppo & Erogazione Rimborso', desc: 'Sottoscrizione contratto, sviluppo software in 20-30 gg lavorativi ed erogazione del 50% a fondo perduto dal Ministero.' }
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
fill(C.gold);
doc.rect(M, y + 21.8, CONTENT_W, 1.2, 'F');

font('bold', 7.5);
color(C.gold);
doc.text('NOTA ISTITUZIONALE RISERVATA • PRESIDENZA ROBERTO CAPOBIANCO', M + 5, y + 6);

font('normal', 7.8);
color(C.white);
doc.text('Documento tecnico redatto dai consulenti Raffaele Di Tullo & Ylenia Corti per il committente Rocco Taffora.', M + 5, y + 11.5);
doc.text('Trasmesso alla Presidenza e all\'Ufficio Amministrazione di Conflavoro per la formulazione dell\'offerta economica', M + 5, y + 15.5);
doc.text('ufficiale con i codici identificativi fornitore abilitato MIMIT per la precompilazione del 20 ottobre.', M + 5, y + 19.5);

// Output file directly to Desktop
const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\stree', 'Desktop', 'PROPOSTA_PROGETTO_MIMIT_ROCCO_TAFFORA.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(desktopPath, Buffer.from(pdfBytes));

console.log('PDF Dossier created successfully on Desktop at:', desktopPath);
