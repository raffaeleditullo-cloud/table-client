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

const docCode = `DOSSIER-MIMIT-2026-ROCCO-9921`;
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
  doc.text('Studio & Centro Benessere Rocco • Conflavoro Servizi S.r.l. (Fornitore Abilitato MIMIT)', M, PAGE_H - 7);
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
color(C.brand);
doc.text('Hub Digitale Cloud, CRM WhatsApp, E-Commerce & Assistente AI', M, y);
y += 5;

y = textParagraph(
  'Documento di inquadramento tecnico-funzionale redatto a seguito del colloquio di analisi del fabbisogno per il settore Benessere & Bellezza, finalizzato all\'accesso al Voucher MIMIT Cloud & Cybersecurity 2026 (Contributo a fondo perduto 50%).',
  y,
  { size: 8.5, c: C.muted }
);
y += 3;

// Box Dati Committente
fill(C.paper);
stroke(C.line);
doc.roundedRect(M, y, CONTENT_W, 26, 1.5, 1.5, 'FD');

font('bold', 8);
color(C.brand);
doc.text('COMMITTENTE / DATI ATTIVITÀ BENESSERE & BELLEZZA', M + 5, y + 6);

font('bold', 9);
color(C.ink);
doc.text('Cliente: Rocco', M + 5, y + 12);
font('normal', 8);
color(C.muted);
doc.text('Settore: Benessere, Bellezza & Cura Personale (Centro Estetico / Studio Benessere)', M + 5, y + 17);
doc.text('Inquadramento: Professionista / Impresa operante sul territorio nazionale', M + 5, y + 22);

doc.setFont('helvetica', 'bold');
doc.text('Aree Tecnologiche Richieste:', M + 105, y + 12);
doc.setFont('helvetica', 'normal');
doc.text('• Gestionale Cloud (Magazzino, Ordini, Fornitori)', M + 105, y + 17);
doc.text('• CRM & Automazioni WhatsApp, E-commerce & AI Chatbot', M + 105, y + 22);

y += 32;

// Sezione 1: Sintesi del Fabbisogno
y = sectionTitle('1. Analisi del Fabbisogno & Criticità Risolte', y);

const challenges = [
  {
    title: 'Azzeramento dei "No-Show" e disordine negli appuntamenti',
    desc: 'La gestione manuale delle prenotazioni genera buchi in agenda e clienti che dimenticano la seduta. Il sistema integra promemoria WhatsApp automatici 24 ore prima e messaggi di follow-up a 30 giorni per richiamare i clienti ai trattamenti successivi.'
  },
  {
    title: 'Gestione scorte magazzino prodotti e ordini fornitori',
    desc: 'I prodotti cosmetici e le materie prime per i trattamenti richiedono un controllo continuo delle giacenze. Il modulo Cloud SaaS monitora consumi, scorte minime e genera ordini automatici ai fornitori, integrandosi anche con i dispositivi già in uso nello studio.'
  },
  {
    title: 'Perdita di prenotazioni e vendite prodotti fuori dall\'orario di apertura',
    desc: 'I clienti cercano trattamenti e prodotti anche la sera o nei weekend. Il portale web con e-commerce integrato e il Chatbot AI consentono prenotazioni e acquisti 24 ore su 24 con pagamenti online sincronizzati in tempo reale con l\'agenda.'
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

fill(C.emeraldLight);
stroke(C.emeraldBorder);
doc.roundedRect(M, y, CONTENT_W, 26, 1.5, 1.5, 'FD');

font('bold', 9);
color(C.emeraldText);
doc.text('VANTAGGIO ECONOMICO: CONTRIBUTO A FONDO PERDUTO 50%', M + 5, y + 6.5);

font('normal', 8.2);
color(C.emeraldText);
const mimitText = 'Il progetto rientra pienamente nelle categorie Cloud SaaS, E-Commerce Integrato, CRM & Automazione Workflow e Intelligenza Artificiale del Bando MIMIT 2026. Conflavoro Servizi S.r.l. è fornitore abilitato: l\'offerta viene formulata con i codici identificativi ministeriali per consentire a Rocco di ottenere il rimborso del 50% delle spese ammissibili (fino a 20.000 € a fondo perduto).';
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
    tag: 'PILASTRO 1 • GESTIONALE CLOUD SAAS (ERP)',
    title: 'Centro di Comando Magazzino, Ordini & Fornitori',
    points: [
      'Monitoraggio in tempo reale delle giacenze prodotti cosmetici, creme e monouso di consumo.',
      'Soglie di riordino automatico e gestione listini fornitori con generazione rapida ordini.',
      'Compatibilità con i dispositivi già in possesso dello studio (tablet, totem touch e postazioni cassa).'
    ]
  },
  {
    tag: 'PILASTRO 2 • CRM & AUTOMAZIONE WORKFLOW (WHATSAPP)',
    title: 'Rubrica Intelligente Clienti & Promemoria Anti-No-Show',
    points: [
      'Anagrafica completa clienti con scheda trattamenti, note personalizzate e storico sedute.',
      'Automazione promemoria WhatsApp 24h prima dell\'appuntamento per azzerare i no-show.',
      'Follow-up automatici (es. "Sono passati 30 giorni dal tuo ultimo trattamento, prenota ora la nuova seduta").',
      'Dashboard con statistiche di incasso, affluenza clienti e prestazioni del centro.'
    ]
  },
  {
    tag: 'PILASTRO 3 • PORTALE WEB, E-COMMERCE & PRENOTAZIONI 24/7',
    title: 'Sito Web Integrato & Vendita Online Prodotti di Bellezza',
    points: [
      'Portale moderno e accattivante con visualizzazione servizi, listino prezzi e gallery.',
      'Modulo di prenotazione online 24/7 sincronizzato in tempo reale con l\'agenda del personale.',
      'E-commerce per la vendita online dei prodotti di bellezza e cosmetici con pagamento digitale sicuro.'
    ]
  },
  {
    tag: 'PILASTRO 4 • CHATBOT & ASSISTENTE AI MULTICANALE',
    title: 'Assistenza Immediata & Qualificazione Richieste',
    points: [
      'Chatbot AI operativo su Web, WhatsApp Business e Telegram per rispondere alle domande frequenti.',
      'Guida i clienti nella scelta dei trattamenti e nella prenotazione in autonomia.',
      'Massima trasparenza (dichiarazione di assistenza automatica) e passaggio a operatore umano se richiesto.'
    ]
  }
];

pillars.forEach((p) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 35, 1.5, 1.5, 'FD');

  font('bold', 7.5);
  color(C.brand);
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
  'Grazie all\'infrastruttura di moduli pre-ingegnerizzati di Conflavoro AI, i tempi tecnici di sviluppo, testing e rilascio operativo sono stimati in circa 3-4 settimane lavorative:',
  y,
  { size: 8.5, c: C.muted }
);
y += 2;

const phases = [
  { phase: 'FASE 1 (~5 gg)', title: 'Setup Cloud & Configurazione Magazzino', desc: 'Attivazione ambiente Cloud SaaS, importazione catalogo trattamenti, giacenze prodotti e listini fornitori.' },
  { phase: 'FASE 2 (~6 gg)', title: 'CRM, Connettore WhatsApp & Promemoria', desc: 'Configurazione anagrafica clienti, creazione template messaggi WhatsApp anti no-show e sincronizzazione agenda.' },
  { phase: 'FASE 3 (~5 gg)', title: 'Sito Web, Booking Online & Chatbot AI', desc: 'Pubblicazione portale web con prenotazioni online, carrello e-commerce e addestramento del Chatbot AI.' },
  { phase: 'FASE 4 (~4 gg)', title: 'Collaudo con Rocco, Test Pagamenti & Go-Live', desc: 'Simulazione completa ordini e prenotazioni, formazione operativa a Rocco e rilascio in produzione.' }
];

phases.forEach((ph) => {
  fill(C.paper);
  stroke(C.line);
  doc.roundedRect(M, y, CONTENT_W, 14.5, 1.2, 1.2, 'FD');

  font('bold', 8);
  color(C.brand);
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
  { date: '20 OTTOBRE 2026', title: 'Fase di Precompilazione Ministeriale', desc: 'Accesso alla piattaforma Invitalia/MIMIT, caricamento progetto/offerta con codici fornitore Conflavoro e firma digitale di Rocco.' },
  { date: '10 NOVEMBRE 2026', title: 'Apertura Invio Formale (Click-Day)', desc: 'Invio telematico prioritario della domanda alle ore 12:00 per garantire la posizione nella graduatoria cronologica a sportello.' },
  { date: 'POST CONCESSIONE', title: 'Avvio Lavori & Rendicontazione a Rimborso', desc: 'Sottoscrizione contratto, rilascio piattaforma ed erogazione del contributo a fondo perduto del 50% da parte del Ministero.' }
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
fill(C.brand);
doc.rect(M, y + 21.8, CONTENT_W, 1.2, 'F');

font('bold', 7.5);
color(C.brand);
doc.text('NOTA ISTITUZIONALE RISERVATA • PRESIDENZA ROBERTO CAPOBIANCO', M + 5, y + 6);

font('normal', 7.8);
color(C.white);
doc.text('Il presente documento sintetizza il fabbisogno tecnico specialistico rilevato per il Cliente Rocco (Settore Benessere & Bellezza).', M + 5, y + 11.5);
doc.text('Trasmesso alla Presidenza e all\'Ufficio Amministrazione di Conflavoro per la formulazione dell\'offerta economica', M + 5, y + 15.5);
doc.text('ufficiale con i codici identificativi fornitore abilitato MIMIT e la predisposizione del fascicolo per il 20 ottobre.', M + 5, y + 19.5);

// Output file directly to Desktop
const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\stree', 'Desktop', 'PROPOSTA_PROGETTO_MIMIT_ROCCO_BENESSERE.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(desktopPath, Buffer.from(pdfBytes));

console.log('PDF Dossier created successfully on Desktop at:', desktopPath);
