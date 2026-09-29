const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

// Initialize jsPDF A4 portrait
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 14;
const contentWidth = pageWidth - (margin * 2);

// Colors
const navyBg = [15, 23, 42];      // slate-900
const cyanAccent = [6, 182, 212];  // cyan-500
const textDark = [30, 41, 59];     // slate-800
const textMuted = [100, 116, 139]; // slate-500
const boxBg = [248, 250, 252];    // slate-50
const boxBorder = [226, 232, 240];// slate-200

function drawHeader(pageNumber, totalPages) {
  // Top Header Banner
  doc.setFillColor(...navyBg);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(...cyanAccent);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('CONFLAVORO AI • VOUCHER MIMIT 2026', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CHEAT-SHEET OPERATIVO AL TELEFONO: DOMANDE E RISPOSTE INFALLIBILI PER I CLIENTI', margin, 19);
  doc.text('Guida per l\'operatore durante la compilazione della Scheda Tecnica • Uso Interno Riservato', margin, 24);

  // Badge right
  doc.setFillColor(...cyanAccent);
  doc.roundedRect(pageWidth - margin - 35, 8, 35, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GUIDA OPERATORE', pageWidth - margin - 33, 12.5);

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.setDrawColor(...boxBorder);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.text('Conflavoro Servizi S.r.l. - Fornitore Abilitato MIMIT • Guida allineata al D.D. 4 Agosto 2026 e FAQ MIMIT', margin, pageHeight - 7);
  doc.text(`Pagina ${pageNumber} di ${totalPages}`, pageWidth - margin - 20, pageHeight - 7);
}

const QA_LIST = [
  {
    num: "1",
    q: 'Se il cliente chiede: "Quanto mi costa? Mi fai un prezzo adesso?"',
    a: '"Oggi stiamo definendo insieme l\'architettura tecnica e tutto il fabbisogno del progetto (sistemi, integrazioni, canali). Questa scheda tecnica che stiamo compilando viene trasmessa direttamente alla presidenza e all\'ufficio amministrazione di Conflavoro. Saranno loro a formularvi l\'offerta economica formale con i codici identificativi ministeriali abilitati MIMIT, che vi permetteranno di ottenere il 50% a fondo perduto fino a 20.000 €."'
  },
  {
    num: "2",
    q: 'Se il cliente chiede: "Possiamo fare solo il sito web aziendale?"',
    a: '"Il Ministero esclude i siti web vetrina tradizionali o statici. Tuttavia, la misura finanzia pienamente i sistemi Cloud SaaS. Quindi, se colleghiamo il sito web a un gestionale, a un CRM, a un\'area riservata clienti o a un flusso con intelligenza artificiale e automazioni, il progetto rientra al 100% come soluzione Cloud ammissibile al voucher."'
  },
  {
    num: "3",
    q: 'Se il cliente chiede: "I soldi del voucher arrivano subito o devo anticiparli?"',
    a: '"Il bando MIMIT funziona a rimborso: l\'azienda sostiene l\'investimento con Conflavoro e poi riceve il 50% a fondo perduto dal Ministero (anche in due tranche, di cui la prima già al 50% dell\'avanzamento). Cosa fondamentale: contratti e pagamenti partiranno solo dopo la presentazione formale della domanda a novembre, così che ogni spesa sia perfettamente rimborsabile."'
  },
  {
    num: "4",
    q: 'Se il cliente chiede: "Perché ci stiamo sentendo adesso se l\'invio è a novembre?"',
    a: '"La piattaforma ministeriale apre la precompilazione il 20 ottobre, mentre il click-day per l\'invio formale è il 10 novembre. Poiché il Ministero assegna i fondi in rigoroso ordine cronologico di invio fino a esaurimento risorse, dobbiamo avere il progetto tecnico e il preventivo pronti e firmati digitalmente prima del 20 ottobre. In questo modo il 10 novembre la vostra pratica sarà tra le primissime a partire."'
  },
  {
    num: "5",
    q: 'Se il cliente chiede: "Che cosa fa esattamente Conflavoro in tutto questo?"',
    a: '"Conflavoro Servizi S.r.l. è fornitore abilitato MIMIT. Non vi fornisce solo la tecnologia e l\'infrastruttura AI/Cloud su misura, ma certifica che i singoli servizi corrispondano ai codici ammessi dal Ministero, supportandovi in tutta la documentazione per non rischiare errori in fase di rendicontazione."'
  },
  {
    num: "6",
    q: 'Se il cliente chiede: "Se usiamo già un gestionale o CRM, possiamo partecipare comunque?"',
    a: '"Sì, assolutamente, a patto che il progetto introduca un miglioramento sostanziale (ad es. integrazione con Voice AI telefonica, automazioni avanzate, o migrazione da un vecchio software installato su PC locale a una piattaforma Cloud SaaS moderna). Il bando esclude soltanto i semplici rinnovi di canoni identici o il mero acquisto di licenze aggiuntive senza evoluzione tecnica."'
  },
  {
    num: "7",
    q: 'Se il cliente chiede: "L\'Intelligenza Artificiale (Chatbot, Voice AI, RAG) è davvero coperta?"',
    a: '"Sì, l\'AI è coperta al 100% purché sia integrata all\'interno di una soluzione Cloud SaaS (come il centralino virtuale con assistente vocale, il CRM o il portale documentale aziendale). Il Ministero esclude la consulenza teorica generica o i corsi formativi, mentre la tecnologia e l\'implementazione operativa sono ammesse."'
  },
  {
    num: "8",
    q: 'Se il cliente chiede: "Quali requisiti base dobbiamo avere per non avere problemi?"',
    a: '"I requisiti sono già verificati a vostro favore: essere una PMI o lavoratore autonomo con P.IVA attiva in Italia, DURC regolare, una connessione internet aziendale con velocità di almeno 30 Mbps in download, e la disponibilità di SPID e firma digitale del legale rappresentante per la convalida telematica."'
  },
  {
    num: "9",
    q: 'Se il cliente chiede: "C\'è una spesa minima o massima per il progetto?"',
    a: '"Sì: il piano minimo ammissibile dal Ministero è di 4.000 € (con rimborso di 2.000 € a fondo perduto). L\'investimento ideale che satura al 100% il contributo massimo è di 40.000 € (con rimborso di 20.000 €). Progetti intermedi beneficiano sempre del 50% di rimborso esatto (es. 20.000 € di spesa = 10.000 € rimborsati)."'
  },
  {
    num: "10",
    q: 'Se il cliente chiede: "Cosa dobbiamo fare subito dopo questa telefonata?"',
    a: '"Appena chiudiamo la chiamata genero la Scheda Tecnica ufficiale con tutte le specifiche che abbiamo concordato e la inoltro alla Presidenza. L\'amministrazione Conflavoro predisporrà il preventivo con i codici ministeriali MIMIT e vi ricontatteremo tempestivamente per definire gli ultimi dettagli prima dell\'apertura del 20 ottobre."'
  }
];

let curPage = 1;
const totalPages = 2;

drawHeader(curPage, totalPages);
let y = 36;

for (let i = 0; i < QA_LIST.length; i++) {
  const item = QA_LIST[i];

  // If we reach item 5, jump to page 2 for clean layout
  if (i === 5) {
    doc.addPage();
    curPage++;
    drawHeader(curPage, totalPages);
    y = 36;
  }

  // Calculate heights
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  const qLines = doc.splitTextToSize(`${item.num}. ${item.q}`, contentWidth - 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const aLines = doc.splitTextToSize(`COSA RISPONDERE:\n${item.a}`, contentWidth - 12);

  const blockHeight = (qLines.length * 4.5) + (aLines.length * 3.8) + 9;

  // Box background
  doc.setFillColor(...boxBg);
  doc.setDrawColor(...boxBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'FD');

  // Left accent pill for item number
  doc.setFillColor(...cyanAccent);
  doc.rect(margin, y, 2.5, blockHeight, 'F');

  // Question text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(qLines, margin + 6, y + 5.5);

  const qBottom = y + (qLines.length * 4.5) + 6.5;

  // Answer text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...cyanAccent);
  doc.text('RISPOSTA CONSIGLIATA AL TELEFONO:', margin + 6, qBottom);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700
  const actualAnswerLines = doc.splitTextToSize(item.a, contentWidth - 12);
  doc.text(actualAnswerLines, margin + 6, qBottom + 4);

  y += blockHeight + 3.5;
}

const outputPath = path.join(__dirname, 'CHEAT_SHEET_MIMIT_CONFLAVORO.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
console.log('PDF generated successfully at:', outputPath);
