import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  X,
  Copy,
  Check,
  Lightbulb,
  MessageCircleQuestion,
  CheckCircle2,
  MinusCircle,
  CircleDashed,
  FileText,
  ClipboardCheck,
  Loader2,
  Sparkles,
  PhoneCall,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { LIVE_RULES, TONE_STYLES } from '../../lib/liveRules';
import { liveSpeechSupported, startLiveSpeech } from '../../lib/liveSpeech';
import { startRecording } from '../../lib/recorder';
import { fetchLiveCoach, fetchPostCallAnalysis } from '../../lib/aiCoach';
import { generateProjectPdf } from '../../utils/pdfGenerator';
import { buildDossier, createDocCode } from '../../utils/dossier';
import { SECTORS, getSolution } from '../../data/catalog';
import { COLOR_PALETTES, FONT_OPTIONS, HOSTING_COMPLIANCE, AI_ORBS } from '../../data/configOptions';

export default function LiveCopilotModal({ isOpen, onClose, onApplyToConfigurator }) {
  const [phase, setPhase] = useState('idle'); // idle | recording | transcribing | finished
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState([]);
  const [interim, setInterim] = useState('');
  const [tips, setTips] = useState([]);
  const [coach, setCoach] = useState({ ask: [], propose: [], checklist: [] });
  const [isThinking, setIsThinking] = useState(false);
  const [copiedTipId, setCopiedTipId] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('report'); // report | extracted | transcript

  const recRef = useRef(null);
  const firedRulesRef = useRef(new Set());
  const linesRef = useRef([]);
  const coachRef = useRef(coach);
  coachRef.current = coach;
  const feedEndRef = useRef(null);

  const supported = liveSpeechSupported();

  // Reset when opened
  useEffect(() => {
    if (isOpen && phase === 'idle') {
      handleStartRecording();
    }
  }, [isOpen]);

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

  // Live Speech Recognition & Instant Keyword Rule Triggers (0 ms)
  useEffect(() => {
    if (phase !== 'recording' || !supported) return undefined;

    return startLiveSpeech(
      (finalText) => {
        linesRef.current = [...linesRef.current, finalText];
        setLines([...linesRef.current]);

        // Instant Regex Rule matching (0 ms)
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

  // Periodic AI Coach Polling (every 14 seconds)
  useEffect(() => {
    if (phase !== 'recording') return undefined;
    let isBusy = false;
    let lastLength = 0;

    const tick = async () => {
      const fullText = linesRef.current.join('\n');
      if (isBusy || fullText.length - lastLength < 20) return;
      isBusy = true;
      setIsThinking(true);
      lastLength = fullText.length;

      try {
        const result = await fetchLiveCoach(fullText, coachRef.current.checklist);
        if (result) {
          setCoach({
            ask: Array.isArray(result.ask) ? result.ask.slice(0, 2) : [],
            propose: Array.isArray(result.propose) ? result.propose.slice(0, 2) : [],
            checklist: Array.isArray(result.checklist) ? result.checklist : coachRef.current.checklist
          });
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

  // Auto-scroll transcript feed
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, interim]);

  const handleStartRecording = async () => {
    try {
      firedRulesRef.current = new Set();
      linesRef.current = [];
      setLines([]);
      setTips([]);
      setCoach({ ask: [], propose: [], checklist: [] });
      setAnalysisData(null);
      recRef.current = await startRecording();
      setSeconds(0);
      setPhase('recording');
    } catch (err) {
      alert("Consenti l'accesso al microfono nel browser per registrare la chiamata.");
      onClose();
    }
  };

  const handleStopRecording = async () => {
    const activeRec = recRef.current;
    if (!activeRec) return;

    setPhase('transcribing');
    try {
      await activeRec.stop();
      const rawText = linesRef.current.join('\n').trim() || 'Chiamata completata.';
      const checklistSummary = coach.checklist.length
        ? coach.checklist.map((c) => `- [${c.status.toUpperCase()}] ${c.item}: ${c.note || ''}`).join('\n')
        : '';

      const data = await fetchPostCallAnalysis(rawText, checklistSummary);
      setAnalysisData(data);
      setPhase('finished');
    } catch (err) {
      console.error('Stop analysis error:', err);
      setPhase('finished');
    } finally {
      recRef.current = null;
    }
  };

  const handleCopyTip = (tip) => {
    navigator.clipboard.writeText(tip.rule.say);
    setCopiedTipId(tip.rule.id);
    setTimeout(() => setCopiedTipId(null), 2000);
  };

  const handleApplyToTableClient = () => {
    if (analysisData && onApplyToConfigurator) {
      onApplyToConfigurator(analysisData);
    }
    setPhase('idle');
    onClose();
  };

  const handleDirectDownloadPdf = () => {
    if (!analysisData) return;
    const sectorObj = SECTORS.find((s) => s.id === analysisData.sectorId) || SECTORS[0];
    const dossier = buildDossier({
      sector: sectorObj,
      solutionIds: analysisData.solutionIds || ['gestionale', 'crm'],
      modules: analysisData.modules || {},
      voice: analysisData.voice || { gender: 'female', roles: ['appointments'], prompt: '' },
      channelIds: analysisData.channelIds || ['whatsapp'],
      hosting: HOSTING_COMPLIANCE[0],
      currentState: analysisData.currentState || 'Gestione iniziale non centralizzata',
      improvement: analysisData.improvement || 'Piattaforma Cloud SaaS integrata con automazioni',
      primaryColor: COLOR_PALETTES[0],
      font: FONT_OPTIONS[0],
      uiBorderRadius: 'rounded-xl',
      brandFont: '',
      selectedOrb: AI_ORBS[0],
      clientInfo: analysisData.clientInfo || { company: 'Cliente MIMIT', name: 'Referente', vat: '', email: '', phone: '' },
      operatorNotes: analysisData.operatorNotes || 'Pratica idonea Voucher MIMIT 2026'
    });

    const docCode = createDocCode();
    generateProjectPdf(dossier, docCode);

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f19] text-white font-sans animate-in fade-in duration-200">
      {/* ── TOP LUXURY BAR ── */}
      <header className="h-16 px-6 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <span className={`w-3.5 h-3.5 rounded-full ${phase === 'recording' ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black uppercase tracking-wider text-amber-400">
                Conflavoro AI • Copilota Chiamata Live
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-brand text-white font-extrabold rounded-sm uppercase tracking-wider">
                Voucher MIMIT 2026
              </span>
            </div>
            <p className="text-[12px] text-white/70">
              {phase === 'recording' ? `Registrazione in corso · ${formatTime(seconds)}` : phase === 'finished' ? 'Chiamata analizzata con successo' : 'In attesa...'}
            </p>
          </div>
        </div>

        {/* Audio Level visualizer */}
        {phase === 'recording' && (
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 transition-all duration-100"
                style={{ width: `${Math.min(level * 250, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
          {phase === 'recording' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  recRef.current?.cancel();
                  setPhase('idle');
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleStopRecording}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Termina Chiamata & Analizza</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPhase('idle');
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ── WORKSPACE CONTENT ── */}
      {phase === 'transcribing' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 bg-[#0b0f19] text-white">
          <div className="relative">
            <Loader2 className="w-14 h-14 animate-spin text-brand" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute top-0 right-0 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-white">Elaborazione Dossier & Precompilazione Scheda...</h2>
          <p className="text-white/60 max-w-md text-sm leading-relaxed">
            Gemini AI sta analizzando la trascrizione per estrarre anagrafica, settore, soluzioni ammissibili MIMIT e il report per il Manager Rocco Di Tolla.
          </p>
        </div>
      ) : phase === 'finished' && analysisData ? (
        /* ── FINISHED SUMMARY & 1-CLICK ACTIONS ── */
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0f172a] text-white">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* ACTION BANNER */}
            <div className="p-6 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-2 border-brand rounded-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-500 text-black font-mono">
                  ✓ Chiamata Analizzata
                </span>
                <h2 className="text-2xl font-black text-white mt-1.5">
                  {analysisData.clientInfo?.company || 'Nuovo Cliente'}
                </h2>
                <p className="text-xs text-white/70">
                  Referente: <strong className="text-white">{analysisData.clientInfo?.name || 'In definizione'}</strong> ({analysisData.clientInfo?.role || 'Titolare'}) · Settore: <strong className="text-amber-300">{analysisData.sectorId?.toUpperCase()}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleApplyToTableClient}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-black" />
                  <span>⚡ Precompila Scheda & Vai al PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDirectDownloadPdf}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-brand hover:bg-brand-ink text-white text-xs font-black uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Scarica PDF Subito</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`SCHEDA PER IL MANAGER (ROCCO DI TOLLA)\nCliente: ${analysisData.clientInfo?.company}\nReferente: ${analysisData.clientInfo?.name}\n\n${analysisData.reportMarkdown}`);
                    alert('Scheda per Rocco Di Tolla copiata negli appunti!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <span>Copia per Rocco Di Tolla</span>
                </button>
              </div>
            </div>

            {/* TABS SELECTOR */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'report' ? 'bg-brand text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Scheda Manager Rocco Di Tolla
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('extracted')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'extracted' ? 'bg-brand text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Configurazione Tecnica Estratta ({analysisData.solutionIds?.length || 0} Soluzioni)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'transcript' ? 'bg-brand text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Trascrizione Integrale ({lines.length} Frasi)
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'report' && (
              <div className="p-6 bg-white text-ink rounded-sm shadow-md font-sans text-sm leading-relaxed whitespace-pre-wrap">
                {analysisData.reportMarkdown}
              </div>
            )}

            {activeTab === 'extracted' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">Anagrafica & Settore</h4>
                  <div className="space-y-1.5 text-xs text-white/80">
                    <p><strong className="text-white">Azienda:</strong> {analysisData.clientInfo?.company || '-'}</p>
                    <p><strong className="text-white">Partita IVA:</strong> {analysisData.clientInfo?.vat || 'In acquisizione'}</p>
                    <p><strong className="text-white">Referente:</strong> {analysisData.clientInfo?.name || '-'}</p>
                    <p><strong className="text-white">Ruolo:</strong> {analysisData.clientInfo?.role || '-'}</p>
                    <p><strong className="text-white">Settore Rilevato:</strong> {analysisData.sectorId}</p>
                  </div>
                </div>

                <div className="p-5 bg-white/5 border border-white/10 rounded-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Soluzioni & Moduli MIMIT</h4>
                  <div className="space-y-1.5 text-xs text-white/80">
                    <p><strong className="text-white">Soluzioni Selezionate:</strong> {(analysisData.solutionIds || []).join(', ')}</p>
                    <p><strong className="text-white">Canali Integrati:</strong> {(analysisData.channelIds || []).join(', ')}</p>
                    <p><strong className="text-white">Stato Iniziale:</strong> {analysisData.currentState}</p>
                    <p><strong className="text-white">Miglioramento:</strong> {analysisData.improvement}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="p-6 bg-[#0b0f19] border border-white/10 rounded-sm space-y-2 max-h-[500px] overflow-y-auto font-mono text-xs text-white/80">
                {lines.map((l, i) => (
                  <p key={i} className="leading-relaxed"><span className="text-brand font-bold mr-2">[{i + 1}]</span>{l}</p>
                ))}
              </div>
            )}

          </div>
        </div>
      ) : (
        /* ── DUAL COLUMN LIVE COPILOT ── */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 bg-paper text-ink">
          {/* LEFT: Live Streaming Transcript (60% / 7 cols) */}
          <section className="md:col-span-7 flex flex-col border-r border-line bg-white min-h-0">
            <div className="px-5 py-3 border-b border-line bg-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand" />
                <span className="text-xs font-black uppercase tracking-wider text-ink">Trascrizione Live in Tempo Reale</span>
              </div>
              <span className="text-[11px] text-muted font-bold">Riconoscimento vocale continuo attivo</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 font-sans text-sm min-h-0">
              {lines.length === 0 && !interim && (
                <div className="text-center py-16 text-muted">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-brand animate-bounce" />
                  <p className="font-bold text-ink">In ascolto della chiamata...</p>
                  <p className="text-xs mt-1">Metti il telefono in vivavoce e parla normalmente con il cliente.</p>
                </div>
              )}

              {lines.map((l, idx) => (
                <div key={idx} className="p-2.5 rounded bg-surface border border-line text-ink leading-relaxed">
                  <span className="font-bold text-brand mr-1.5">●</span>
                  {l}
                </div>
              ))}

              {interim && (
                <div className="p-2.5 rounded bg-brand-soft/30 border border-brand/40 text-brand-ink italic">
                  <span className="animate-pulse">🎙️ {interim}</span>
                </div>
              )}
              <div ref={feedEndRef} />
            </div>
          </section>

          {/* RIGHT: Live Suggestions & Instant Alert Cards (40% / 5 cols) */}
          <aside className="md:col-span-5 flex flex-col bg-paper min-h-0">
            <div className="px-5 py-3 border-b border-line bg-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-wider text-ink">Suggerimenti & Alert Live</span>
              </div>
              {isThinking && (
                <span className="inline-flex items-center gap-1 text-[11px] text-brand font-bold">
                  <Loader2 className="w-3 h-3 animate-spin" /> AI elabora...
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {/* CHIEDI ADESSO BOX */}
              <div className="p-4 bg-white border-2 border-brand shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand">
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>Cosa Chiedere Adesso</span>
                </div>
                {coach.ask.length > 0 ? (
                  <ul className="mt-2.5 space-y-2">
                    {coach.ask.map((q, idx) => (
                      <li key={idx} className="text-[13px] font-bold text-ink leading-snug flex items-start gap-1.5">
                        <span className="text-brand font-black">➔</span>
                        <span>«{q}»</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted">
                    Dopo i primi scambi della conversazione ti suggerirò le domande chiave per guidare la chiamata.
                  </p>
                )}

                {/* COSA PROPORRE */}
                {coach.propose.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-line">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      <span>Cosa Proporre (Ammissibile MIMIT)</span>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {coach.propose.map((p, idx) => (
                        <li key={idx} className="text-[12.5px] text-emerald-900 leading-snug">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CHECKLIST REQUISITI */}
              {coach.checklist.length > 0 && (
                <div className="p-3.5 bg-white border border-line shadow-xs">
                  <div className="text-[11px] font-black uppercase tracking-wider text-muted flex items-center justify-between">
                    <span>Checklist Requisiti Bando</span>
                    <span className="text-brand font-bold">
                      {coach.checklist.filter((c) => c.status === 'ok').length}/{coach.checklist.length} verificati
                    </span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5">
                    {coach.checklist.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px]">
                        {c.status === 'ok' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : c.status === 'na' ? (
                          <MinusCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                        ) : (
                          <CircleDashed className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <span className={c.status === 'todo' ? 'font-bold text-ink' : 'text-muted'}>
                          {c.item} {c.note ? <span className="text-[11px] font-normal italic">({c.note})</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* INSTANT TRIGGER CARDS */}
              {tips.length === 0 ? (
                <div className="p-3 bg-surface border border-line text-xs text-muted text-center">
                  Gli alert istantanei su <strong>Prezzi, Hardware, Bandi Camerali, 4 Passaggi e Rimborso</strong> compariranno qui non appena il cliente o tu pronunciate le parole chiave.
                </div>
              ) : (
                tips.map((tip) => {
                  const style = TONE_STYLES[tip.rule.tone] || TONE_STYLES.blue;
                  const isCopied = copiedTipId === tip.rule.id;
                  return (
                    <article
                      key={tip.rule.id}
                      className={`p-3.5 border-l-4 border shadow-sm ${style.border}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${style.badge}`}>
                          {tip.rule.badge}
                        </span>
                        <span className="text-[10px] text-muted font-bold">{tip.at}</span>
                      </div>
                      <h4 className="mt-2 text-[13px] font-bold text-ink leading-tight">{tip.rule.hint}</h4>
                      <p className="mt-1 text-[13px] font-extrabold text-ink-soft bg-white/80 p-2 border border-black/10">
                        «{tip.rule.say}»
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[10.5px] text-muted italic truncate max-w-[200px]">
                          Sentito: "{tip.quote}"
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTip(tip)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-white border border-line hover:border-ink cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copiato!' : 'Copia'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
