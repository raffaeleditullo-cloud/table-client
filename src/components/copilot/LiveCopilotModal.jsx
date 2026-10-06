import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  X,
  Copy,
  Check,
  MessageCircleQuestion,
  FileText,
  Loader2,
  Sparkles,
  Download,
  User,
  UserCheck
} from 'lucide-react';
import { LIVE_RULES, TONE_STYLES } from '../../lib/liveRules';
import { liveSpeechSupported, startLiveSpeech } from '../../lib/liveSpeech';
import { startRecording } from '../../lib/recorder';
import { fetchLiveCoach, fetchPostCallAnalysis, fallbackExtraction } from '../../lib/aiCoach';
import { generateProjectPdf } from '../../utils/pdfGenerator';
import { buildDossier, createDocCode } from '../../utils/dossier';
import { normalizeExtraction, normalizeCoach } from '../../utils/normalizeExtraction';
import { SECTORS } from '../../data/catalog';
import { COLOR_PALETTES, FONT_OPTIONS, HOSTING_COMPLIANCE, AI_ORBS } from '../../data/configOptions';

function classifySpeaker(text, currentMessages) {
  const clean = text.toLowerCase();
  const patternOperatore = /buongiorno|salve|sono raffaele|conflavoro|voucher|bando mimit|durc|fondo perduto|spid|firma digitale|de minimis|click-day|20 ottobre|10 novembre|30 mbps|connettività|investimento|ammissibile|le illustro|le spiego/;
  const patternCliente = /quanto costa|chi paga|dobbiamo anticipare|siamo una|ho una ditta|lo studio|commercialista|non capisco|mandatemi|non mi interessa|ci penso|fatturato|dipendenti|computer|hardware|licenze/;

  if (patternOperatore.test(clean) && !patternCliente.test(clean)) return 'operatore';
  if (patternCliente.test(clean) && !patternOperatore.test(clean)) return 'cliente';

  const lastMsg = currentMessages[currentMessages.length - 1];
  if (!lastMsg) return 'operatore';
  return lastMsg.speaker === 'operatore' ? 'cliente' : 'operatore';
}

export default function LiveCopilotModal({ isOpen, onClose, onApplyToConfigurator }) {
  const [phase, setPhase] = useState('idle'); // idle | recording | transcribing | finished
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [interim, setInterim] = useState('');
  const [tips, setTips] = useState([]);
  const [coach, setCoach] = useState({
    ask: [
      'Ha già verificato la regolarità del DURC aziendale?',
      'Disponete di una linea fissa con velocità di almeno 30 Mbps?'
    ],
    propose: [
      'Pacchetto Cloud Gestionale + Connettori AI MIMIT coperto al 50% a fondo perduto'
    ],
    checklist: []
  });
  const [isThinking, setIsThinking] = useState(false);
  const [copiedTipId, setCopiedTipId] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [pdfFeedback, setPdfFeedback] = useState(false);

  const recRef = useRef(null);
  const firedRulesRef = useRef(new Set());
  const linesRef = useRef([]);
  const coachRef = useRef(coach);
  coachRef.current = coach;
  const feedEndRef = useRef(null);
  const sessionRef = useRef(0);

  const supported = liveSpeechSupported();

  const stopCapture = () => {
    const rec = recRef.current;
    recRef.current = null;
    rec?.cancel();
  };

  useEffect(() => {
    if (isOpen) {
      if (phase === 'idle') handleStartRecording();
      return;
    }
    sessionRef.current += 1;
    stopCapture();
    if (phase !== 'idle') setPhase('idle');
  }, [isOpen]);

  useEffect(
    () => () => {
      sessionRef.current += 1;
      stopCapture();
    },
    []
  );

  // Timer & Audio Level
  useEffect(() => {
    if (phase !== 'recording') return undefined;
    const started = Date.now();
    const id = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - started) / 1000));
      setLevel(recRef.current?.level() ?? 0);
    }, 200);
    return () => window.clearInterval(id);
  }, [phase]);

  // Live Speech Recognition & Instant Rules
  useEffect(() => {
    if (phase !== 'recording' || !supported) return undefined;

    return startLiveSpeech(
      (finalText) => {
        const time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        setChatMessages((prev) => {
          const speaker = classifySpeaker(finalText, prev);
          const newMsg = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            speaker,
            text: finalText,
            time
          };
          linesRef.current = [...linesRef.current, `${speaker === 'operatore' ? 'Raffaele' : 'Cliente'}: ${finalText}`];
          return [...prev, newMsg];
        });

        // Instant Regex matching
        for (const rule of LIVE_RULES) {
          if (firedRulesRef.current.has(rule.id) || !rule.match.test(finalText)) continue;
          firedRulesRef.current.add(rule.id);
          const atTime = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
          setTips((prev) => [{ rule, at: atTime, quote: finalText }, ...prev]);
        }
      },
      (interimText) => {
        setInterim(interimText);
      }
    );
  }, [phase, supported]);

  // Periodic AI Coach Polling
  useEffect(() => {
    if (phase !== 'recording') return undefined;
    let isBusy = false;
    let lastLength = 0;

    const tick = async () => {
      const fullText = linesRef.current.join('\n');
      if (isBusy || fullText.length - lastLength < 25) return;
      isBusy = true;
      setIsThinking(true);
      lastLength = fullText.length;
      const session = sessionRef.current;

      try {
        const result = normalizeCoach(await fetchLiveCoach(fullText, coachRef.current.checklist));
        if (result && session === sessionRef.current) {
          setCoach((prev) => ({
            ask: result.ask && result.ask.length > 0 ? result.ask : prev.ask,
            propose: result.propose && result.propose.length > 0 ? result.propose : prev.propose,
            checklist: result.checklist ?? prev.checklist
          }));
        }
      } catch (err) {
        console.warn('Coach tick error:', err);
      } finally {
        isBusy = false;
        setIsThinking(false);
      }
    };

    const id = window.setInterval(tick, 14000);
    return () => window.clearInterval(id);
  }, [phase]);

  // Auto-scroll
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, interim]);

  const handleStartRecording = async () => {
    const session = ++sessionRef.current;
    firedRulesRef.current = new Set();
    linesRef.current = [];
    setChatMessages([]);
    setInterim('');
    setTips([]);
    setAnalysisData(null);

    let rec;
    try {
      rec = await startRecording();
    } catch (err) {
      if (session !== sessionRef.current) return;
      console.error('Avvio registrazione fallito:', err);
      alert("Consenti l'accesso al microfono nel browser per registrare la chiamata.");
      onClose();
      return;
    }

    if (session !== sessionRef.current) {
      rec.cancel();
      return;
    }
    recRef.current = rec;
    setSeconds(0);
    setPhase('recording');
  };

  const handleStopRecording = async () => {
    const activeRec = recRef.current;
    if (!activeRec) {
      setPhase('idle');
      return;
    }
    const session = sessionRef.current;
    recRef.current = null;

    setPhase('transcribing');
    setInterim('');
    const rawText = linesRef.current.join('\n').trim();
    let data;
    try {
      await activeRec.stop();
      data = await fetchPostCallAnalysis(rawText, '');
    } catch (err) {
      console.error('Stop analysis error:', err);
      data = fallbackExtraction(rawText, '', "Analisi completata.");
    }

    if (session !== sessionRef.current) return;

    let extracted = normalizeExtraction(data);
    if (!extracted) {
      data = fallbackExtraction(rawText, '', 'Dati estratti.');
      extracted = normalizeExtraction(data);
    }
    setAnalysisData(extracted);
    setPhase('finished');
  };

  const toggleSpeaker = (msgId) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, speaker: m.speaker === 'operatore' ? 'cliente' : 'operatore' }
          : m
      )
    );
  };

  const handleCopyTip = (tip) => {
    navigator.clipboard.writeText(tip.rule.say);
    setCopiedTipId(tip.rule.id);
    setTimeout(() => setCopiedTipId(null), 2000);
  };

  const handleDirectDownloadPdf = () => {
    const dataToUse = analysisData || fallbackExtraction(linesRef.current.join('\n'), '', 'Dossier provvisorio');
    const sectorObj = SECTORS.find((s) => s.id === dataToUse.sectorId) || SECTORS[0];
    const dossier = buildDossier({
      sector: sectorObj,
      solutionIds: dataToUse.solutionIds?.length ? dataToUse.solutionIds : ['gestionale', 'crm'],
      modules: dataToUse.modules || {},
      voice: dataToUse.voice || { gender: 'female', roles: ['appointments'], prompt: '' },
      channelIds: dataToUse.channelIds?.length ? dataToUse.channelIds : ['whatsapp'],
      hosting: HOSTING_COMPLIANCE[0],
      currentState: dataToUse.currentState || 'Gestione iniziale non centralizzata',
      improvement: dataToUse.improvement || 'Piattaforma Cloud SaaS integrata con automazioni',
      primaryColor: COLOR_PALETTES[0],
      font: FONT_OPTIONS[0],
      uiBorderRadius: 'rounded-xl',
      brandFont: '',
      selectedOrb: AI_ORBS[0],
      clientInfo: dataToUse.clientInfo || { company: 'Cliente MIMIT', name: 'Referente', vat: '', email: '', phone: '' },
      operatorNotes: dataToUse.operatorNotes || 'Pratica idonea Voucher MIMIT 2026'
    });

    const docCode = createDocCode();
    generateProjectPdf(dossier, docCode);
    setPdfFeedback(true);
    setTimeout(() => setPdfFeedback(false), 2500);

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const risposteMostrate = tips.length > 0 ? tips : LIVE_RULES.slice(0, 3).map(r => ({ rule: r }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f19] text-white font-sans animate-in fade-in duration-200">
      
      {/* ─── TESTATA PULITA: STATO + I 2 SOLI TASTI ─── */}
      <header className="h-16 px-6 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg">
        {/* Info & Stato REC */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-black/40 border border-amber-400/40 grid place-items-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black uppercase tracking-wider text-amber-400">
                Copilota Chiamata Live
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-brand text-white font-extrabold rounded-sm uppercase tracking-wider">
                Voucher MIMIT
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1.5 text-xs text-white/70">
                <span className={`w-2 h-2 rounded-full ${phase === 'recording' ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                {phase === 'recording' ? `REC ${formatTime(seconds)}` : phase === 'finished' ? 'Chiamata Registrata' : 'In attesa'}
              </span>
            </div>
          </div>
        </div>

        {/* I 2 SOLI TASTI RICHIESTI */}
        <div className="flex items-center gap-3">
          {/* Tasto 1: Avvia REC / Termina REC */}
          {phase === 'recording' ? (
            <button
              type="button"
              onClick={handleStopRecording}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-md shadow-lg transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Termina REC</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartRecording}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black rounded-md shadow-lg transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Avvia REC</span>
            </button>
          )}

          {/* Tasto 2: Scarica Report */}
          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 rounded-md shadow-md transition-colors cursor-pointer"
          >
            {pdfFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{pdfFeedback ? 'Scaricato!' : 'Scarica Report'}</span>
          </button>

          {/* Tasto Chiudi */}
          <button
            type="button"
            onClick={() => {
              stopCapture();
              setPhase('idle');
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white border border-white/20 hover:border-white transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── WORKSPACE A 2 COLONNE: CHAT DAVANTI (70%) + CONSIGLI (30%) ─── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 bg-[#0f172a] text-white">

        {/* ── SINISTRA: CHAT DI CONVERSAZIONE (Fumetti separati a due voci) ── */}
        <section className="md:col-span-8 flex flex-col border-r border-white/10 bg-[#0b0f19] min-h-0">
          <div className="px-5 py-3 border-b border-white/10 bg-[#0f172a] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">Conversazione Live</span>
              <span className="text-[11px] text-white/50 font-medium">· Voci separate in tempo reale</span>
            </div>
            <span className="text-[11px] text-white/60 font-mono">
              {chatMessages.length} {chatMessages.length === 1 ? 'battuta' : 'battute'}
            </span>
          </div>

          {/* Area Feed Messaggi */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
            {chatMessages.length === 0 && !interim && (
              <div className="text-center py-20 text-white/50">
                <Mic className="w-9 h-9 mx-auto mb-3 text-amber-400 animate-pulse" />
                <p className="font-bold text-white text-sm">In ascolto della conversazione…</p>
                <p className="text-xs mt-1 text-white/60">
                  Parla normalmente o metti il cliente in vivavoce. I messaggi appariranno divisi tra te e il cliente.
                </p>
              </div>
            )}

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.speaker === 'operatore' ? 'items-end' : 'items-start'}`}
              >
                {/* Badge Mittente */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => toggleSpeaker(msg.id)}
                    className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer hover:underline ${
                      msg.speaker === 'operatore' ? 'text-amber-400' : 'text-sky-400'
                    }`}
                    title="Clicca per invertire il parlante"
                  >
                    {msg.speaker === 'operatore' ? <UserCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span>{msg.speaker === 'operatore' ? 'Raffaele (Tu)' : 'Cliente'}</span>
                  </button>
                  <span className="text-white/40 text-[10px] font-mono">{msg.time}</span>
                </div>

                {/* Bolla del messaggio */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-[13.5px] leading-relaxed shadow-md ${
                    msg.speaker === 'operatore'
                      ? 'bg-amber-400/10 border border-amber-400/30 text-white rounded-tr-xs ml-auto'
                      : 'bg-white/10 border border-white/20 text-white rounded-tl-xs mr-auto'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {interim && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>In ascolto…</span>
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs p-3 text-[13px] italic bg-amber-400/10 border border-amber-400/30 text-white/90">
                  «{interim}»
                </div>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>
        </section>

        {/* ── DESTRA: CONSIGLI IN TEMPO REALE (30%) ── */}
        <aside className="md:col-span-4 flex flex-col bg-[#0f172a] min-h-0 border-l border-white/10">
          <div className="px-5 py-3 border-b border-white/10 bg-[#0b0f19] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">Consigli in Tempo Reale</span>
            </div>
            {isThinking && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> AI...
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* BOX: COSA CHIEDERE ADESSO */}
            <div className="p-4 bg-white/5 border border-amber-400/40 rounded-lg shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
                <MessageCircleQuestion className="w-4 h-4" />
                <span>Cosa Chiedere Adesso</span>
              </div>
              <ul className="mt-2.5 space-y-2">
                {coach.ask.map((q, idx) => (
                  <li key={idx} className="text-[12.5px] font-semibold text-white/90 leading-snug flex items-start gap-2">
                    <span className="text-amber-400 font-bold">➔</span>
                    <span>«{q}»</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ALERT & RISPOSTE LIVE */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-white/50 px-1">
                Risposte Strategiche per la Chiamata
              </div>

              {risposteMostrate.map((item, idx) => {
                const rule = item.rule;
                const isCopied = copiedTipId === rule.id;
                return (
                  <article
                    key={rule.id || idx}
                    className="p-3.5 bg-white/5 border border-white/10 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/10 text-amber-300 rounded">
                        {rule.badge}
                      </span>
                      {item.at && <span className="text-[10px] text-white/40 font-mono">{item.at}</span>}
                    </div>

                    <h4 className="text-xs font-bold text-white">{rule.hint}</h4>

                    <p className="text-[12.5px] text-white/90 bg-black/30 p-2.5 rounded border border-white/10 leading-relaxed">
                      «{rule.say}»
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10.5px] text-white/40 italic truncate max-w-[180px]">
                        {item.quote ? `Sentito: "${item.quote}"` : 'Voucher MIMIT 2026'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTip(item)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiato!' : 'Copia'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
