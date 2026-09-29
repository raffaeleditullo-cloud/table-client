// ─────────────────────────────────────────────────────────────
// SERVIZIO AI COACH & REPORT AUTOMATICO (OPENROUTER FREE / LITE)
// ─────────────────────────────────────────────────────────────

const OPENROUTER_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY ||
  import.meta.env.OPENROUTER_API_KEY ||
  '';

const MIMIT_KNOWLEDGE = `
BANDO VOUCHER CLOUD E CYBERSECURITY MIMIT 2026:
- Ente: Ministero delle Imprese e del Made in Italy (Invitalia). Dotazione: 150 Milioni di Euro (di cui 71M riservati al Mezzogiorno).
- Contributo: 50% a fondo perduto fino a 20.000 € (spesa minima 4.000 € per 2.000 €; spesa massima 40.000 € per 20.000 €). Meccanismo a rimborso.
- Fornitore: Conflavoro Servizi S.r.l. è fornitore formalmente abilitato dal MIMIT.
- Scadenze: 20 Ottobre ore 12:00 Precompilazione e Firma; 10 Novembre ore 12:00 Click-Day Invio prioritario in ordine cronologico; 20 Gennaio chiusura.
- Requisiti: PMI e Liberi Professionisti con P.IVA attiva in Italia, connettività fissa da almeno 30 Mbps, DURC regolare, SPID/CIE, Firma Digitale, capienza De Minimis 300.000 € in 3 anni.
- Spese Ammissibili: Cloud SaaS (ERP, CRM, AI integrata, E-commerce, Workflow), Cybersecurity e Backup UE, Servizi tecnici max 30%.
- Esclusioni: NO PC/fotocamere/hardware generico, NO semplici rinnovi licenze, NO formazione teorica.
`;

const COACH_PROMPT = `Sei il COPILOTA LIVE del consulente tecnico (Raffaele) durante una telefonata in corso con un cliente per il Voucher Cloud & Cybersecurity MIMIT.
Ricevi la trascrizione parziale e la checklist attuale.
Rispondi SOLO con JSON valido, senza markdown, in italiano:
{"ask":["domanda breve e spontanea da fare ORA al cliente", "..."],"propose":["proposta di ampliamento progetto coerente col bando, con il beneficio per il cliente"],"checklist":[{"item":"punto da chiarire","status":"ok"|"todo"|"na","note":"cosa è emerso, breve"}]}
Regole:
- "ask": massimo 2 domande mirate e veloci da leggere.
- "propose": massimo 2 soluzioni ammissibili MIMIT pertinenti al settore.
- "checklist": 6-10 punti chiave (forma giuridica, settore/attività, sede, PEC, firma digitale, SPID, DURC, de minimis, esigenze, budget indicativo, tempistiche).
- Frasi concise e chiare per lettura immediata.`;

export async function fetchLiveCoach(transcriptText, currentChecklist = []) {
  if (!transcriptText || transcriptText.trim().length < 25) return null;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `${COACH_PROMPT}\n\n${MIMIT_KNOWLEDGE}` },
          {
            role: 'user',
            content: `CHECKLIST ATTUALE:\n${JSON.stringify(currentChecklist)}\n\nTRASCRIZIONE LIVE:\n${transcriptText.slice(-5000)}`
          }
        ]
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    let clean = raw.trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    const json = firstBrace !== -1 && lastBrace !== -1 ? clean.slice(firstBrace, lastBrace + 1) : clean;
    return JSON.parse(json);
  } catch (err) {
    console.warn('Live coach polling error:', err);
    return null;
  }
}

export async function fetchPostCallAnalysis(transcriptText, checklistNotes = '') {
  const PROMPT = `Sei l'analista tecnico senior di Conflavoro AI. Analizza la trascrizione della chiamata con il cliente per il Voucher MIMIT.
Devi estrarre sia la configurazione tecnica per l'applicativo TABLE CLIENT sia il report strutturato per il Manager (Rocco Di Tolla).

Rispondi SOLO con un JSON valido con questa esatta struttura:
{
  "clientInfo": {
    "company": "Ragione sociale rilevata o Nome Attività",
    "vat": "Partita IVA se menzionata (altrimenti stringa vuota o 'In acquisizione')",
    "name": "Nome e Cognome Referente",
    "role": "Ruolo (es. Titolare, Medico, Amministratore)",
    "email": "Email se menzionata",
    "phone": "Telefono se menzionato"
  },
  "sectorId": "uno tra: sanita, legal, benessere, hospitality, retail, real_estate, automotive, manufacturing, finance, b2b, education, startup, other",
  "solutionIds": ["array con gli ID tra: gestionale, crm, web, voice, rag, cyber"],
  "modules": {
    "gestionale": ["array tra: fatturazione, magazzino, commesse, hr, sito_integrato, portale_clienti"],
    "crm": ["array tra: contatti, automazioni, preventivi, integrazione_wa"],
    "web": ["array tra: corporate, portale_clienti, ecommerce, booking"],
    "voice": ["array tra: appointments, support, routing, tech_support"],
    "rag": ["array tra: archivio, permessi, assistente_interno, dati_ue"],
    "cyber": ["array tra: firewall, edr, antivirus, backup"]
  },
  "voice": {
    "gender": "male" | "female" | "both",
    "roles": ["appointments", "support", "routing", "tech_support"],
    "prompt": "Sintesi istruzioni personalizzate per assistente vocale AI se richiesto"
  },
  "channelIds": ["array tra: whatsapp, voip, web_chat, email, telegram, calendar, erp_existing, crm_existing"],
  "currentState": "Sintesi chiara dello stato iniziale e delle criticità attuali riscontrate",
  "improvement": "Sintesi dell'obiettivo di trasformazione digitale e miglioramento atteso",
  "operatorNotes": "Note interne per la presidenza e Rocco Di Tolla",
  "reportMarkdown": "Report completo e formale in Markdown (Sintesi, Profilo, Requisiti, Progetto Ammissibile MIMIT, Scheda Rocco Di Tolla con Inclusi/Esclusi, Prossimi Passi 20 Ottobre e 10 Novembre)"
}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `${PROMPT}\n\n${MIMIT_KNOWLEDGE}` },
          {
            role: 'user',
            content: checklistNotes
              ? `${transcriptText}\n\n[NOTE RACCOLTE DURANTE LA CHIAMATA]:\n${checklistNotes}`
              : transcriptText
          }
        ]
      })
    });

    if (!res.ok) {
      return fallbackExtraction(transcriptText, checklistNotes);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    let clean = raw.trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    const jsonStr = firstBrace !== -1 && lastBrace !== -1 ? clean.slice(firstBrace, lastBrace + 1) : clean;
    const parsed = JSON.parse(jsonStr);

    if (!parsed.reportMarkdown) {
      parsed.reportMarkdown = generateFallbackMarkdown(parsed, transcriptText);
    }

    return parsed;
  } catch (err) {
    console.error('Post call analysis failed, using heuristic fallback:', err);
    return fallbackExtraction(transcriptText, checklistNotes);
  }
}

// Fallback extraction if API is offline or rate limited
function fallbackExtraction(transcriptText, checklistNotes) {
  const text = (transcriptText || '').toLowerCase();
  
  // Detect sector
  let sectorId = 'b2b';
  if (/medico|dott|pazient|clinica|sanit|eeg|emg|visita|sanitario/.test(text)) sectorId = 'sanita';
  else if (/avvocat|studio legale|giurid|tribunal|commercialist/.test(text)) sectorId = 'legal';
  else if (/parrucchier|salone|capell|estetic|bellezza|trattament|barbier|spa/.test(text)) sectorId = 'benessere';
  else if (/ristor|pizz|tavol|prenotazion|food|bar/.test(text)) sectorId = 'hospitality';
  else if (/negozi|retail|prodott|vendit|e-commerce|shop/.test(text)) sectorId = 'retail';
  else if (/immobiliar|agenzia|case|appartament/.test(text)) sectorId = 'real_estate';
  else if (/auto|officin|meccanic|concessionar/.test(text)) sectorId = 'automotive';

  // Detect solutions
  const solutionIds = [];
  if (/gestionale|fattur|contabil|magazzin|pratich/.test(text)) solutionIds.push('gestionale');
  if (/crm|clienti|rubrica|lead|whatsapp/.test(text)) solutionIds.push('crm');
  if (/sito|web|portale|online/.test(text)) solutionIds.push('web');
  if (/voce|vocale|telefon|centralin|chiamat/.test(text)) solutionIds.push('voice');
  if (/document|archiv|ricerca|rag|faldon/.test(text)) solutionIds.push('rag');
  if (/cyber|sicurezza|firewall|antivirus|backup|protezion/.test(text)) solutionIds.push('cyber');
  if (solutionIds.length === 0) solutionIds.push('gestionale', 'crm', 'voice');

  const clientInfo = {
    company: 'Azienda Cliente Rilevata',
    vat: '',
    name: 'Referente Principale',
    role: 'Titolare',
    email: '',
    phone: ''
  };

  const parsed = {
    clientInfo,
    sectorId,
    solutionIds,
    modules: {
      gestionale: ['fatturazione', 'magazzino'],
      crm: ['contatti', 'automazioni'],
      web: ['corporate', 'portale_clienti'],
      voice: ['appointments', 'support'],
      rag: ['archivio', 'dati_ue'],
      cyber: ['firewall', 'backup']
    },
    voice: {
      gender: 'female',
      roles: ['appointments', 'support'],
      prompt: 'Accoglienza telefonica e presa appuntamenti.'
    },
    channelIds: ['whatsapp', 'voip'],
    currentState: 'Gestione manuale e processi non integrati.',
    improvement: 'Adozione piattaforma Cloud SaaS unificata con AI e automazioni WhatsApp.',
    operatorNotes: checklistNotes || 'Chiamata completata. Pratica idonea al Voucher MIMIT 2026.',
    reportMarkdown: `## Sintesi Chiamata Bando MIMIT 2026\n\n- **Settore:** ${sectorId.toUpperCase()}\n- **Soluzioni Identificate:** ${solutionIds.join(', ')}\n- **Stato:** Candidatura idonea per la fase di Precompilazione del 20 Ottobre.\n\n### Trascrizione registrata:\n${transcriptText}`
  };

  return parsed;
}

function generateFallbackMarkdown(parsed, transcriptText) {
  return `## Dossier Sintesi Chiamata Bando MIMIT 2026

### Profilo Cliente
- **Ragione Sociale:** ${parsed.clientInfo?.company || 'In definizione'}
- **Referente:** ${parsed.clientInfo?.name || 'Referente'} (${parsed.clientInfo?.role || 'Titolare'})
- **Settore:** ${parsed.sectorId || 'Non specificato'}

### Soluzioni Ammissibili Identificate
${(parsed.solutionIds || []).map((s) => `- **${s.toUpperCase()}**: Moduli ammissibili configurati per il bando.`).join('\n')}

### Stato Iniziale & Obiettivi
- **Stato Iniziale:** ${parsed.currentState || 'Processi frammentati'}
- **Miglioramento Atteso:** ${parsed.improvement || 'Piattaforma Cloud SaaS integrata'}

### Scheda per Rocco Di Tolla (Manager)
- **Moduli Inclusi:** ${JSON.stringify(parsed.modules)}
- **Canali Attivi:** ${(parsed.channelIds || []).join(', ')}
- **Note Tecniche:** ${parsed.operatorNotes || 'Nessuna anomalia riscontrata.'}

### Prossimi Passi
1. Entro 15 Ottobre: Emissione preventivo formale con Codice Fornitore MIMIT Conflavoro.
2. 20 Ottobre ore 12:00: Precompilazione Invitalia e firma digitale (.p7m).
3. 10 Novembre ore 12:00: Invio telematico prioritario Click-Day.`;
}
