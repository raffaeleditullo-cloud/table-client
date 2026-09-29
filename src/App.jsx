import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import ActionBar from './components/flow/ActionBar';
import LivePreview from './components/LivePreview';
import SuccessModal from './components/SuccessModal';
import FaqDrawer from './components/FaqDrawer';
import LiveCopilotModal from './components/copilot/LiveCopilotModal';
import CompanyScreen from './components/screens/CompanyScreen';
import { SectorScreen } from './components/screens/ChoiceScreens';
import SolutionsScreen from './components/screens/SolutionsScreen';
import ModulesScreen from './components/screens/ModulesScreen';
import VoiceAgentScreen from './components/screens/VoiceAgentScreen';
import ChannelsScreen from './components/screens/ChannelsScreen';
import GapScreen from './components/screens/GapScreen';
import LookScreen from './components/screens/LookScreen';
import SummaryScreen from './components/screens/SummaryScreen';

import { COLOR_PALETTES, FONT_OPTIONS, HOSTING_COMPLIANCE, AI_ORBS } from './data/configOptions';
import { SECTORS, getSolution } from './data/catalog';
import { validateContacts } from './data/contactFields';
import { generateProjectPdf } from './utils/pdfGenerator';
import { buildDossier, createDocCode } from './utils/dossier';
import { accentVars, INK } from './utils/color';

const BRAND_HEX = '#1f47d1';
const HOUSE_FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

const PHASES = [
  { id: 'company', label: 'Azienda' },
  { id: 'needs', label: 'Fabbisogno' },
  { id: 'gap', label: 'Miglioramento' },
  { id: 'look', label: 'Look & Feel' },
  { id: 'sheet', label: 'Scheda' }
];

// Guided steps for the operator. `auto`: a click selects and moves on. `when`: conditional step.
const SCREENS = [
  { key: 'company', phase: 0 },
  { key: 'sector', phase: 0, auto: true },
  { key: 'solutions', phase: 1 },
  { key: 'modules', phase: 1 },
  { key: 'voice', phase: 1, when: (s) => s.solutionIds.includes('voice') },
  { key: 'channels', phase: 1 },
  { key: 'gap', phase: 2 },
  { key: 'look', phase: 3 },
  { key: 'summary', phase: 4 }
];

const visibleScreens = (ctx) => SCREENS.filter((s) => !s.when || s.when(ctx));
const AUTO_ADVANCE_MS = 260;

const isTyping = (target) => Boolean(target.closest?.('input, textarea, select'));

function Configurator({ onReset, onForceReset }) {
  const [screenKey, setScreenKey] = useState('company');
  const [faqOpen, setFaqOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Company & need
  const [clientInfo, setClientInfo] = useState({ company: '', vat: '', name: '', role: '', email: '', phone: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [selectedSector, setSelectedSector] = useState(null);
  const [solutionIds, setSolutionIds] = useState([]);
  const [solutionsError, setSolutionsError] = useState('');
  const [modules, setModules] = useState({});
  const [voice, setVoice] = useState({ gender: null, roles: [], prompt: '' });
  const [channelIds, setChannelIds] = useState([]);
  const [selectedHosting, setSelectedHosting] = useState(HOSTING_COMPLIANCE[0]);
  const [currentState, setCurrentState] = useState('');
  const [improvement, setImprovement] = useState('');

  // Look & Feel & 3D AI Orb
  const [selectedOrb, setSelectedOrb] = useState(AI_ORBS[0]);
  const [primaryColor, setPrimaryColor] = useState(COLOR_PALETTES[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [uiBorderRadius, setUiBorderRadius] = useState('rounded-xl');
  const [brandFont, setBrandFont] = useState('');

  const [operatorNotes, setOperatorNotes] = useState('');

  // One document code per sheet, shown in UI and PDF
  const [docCode] = useState(createDocCode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedFilename, setGeneratedFilename] = useState('');

  // ── Navigation ──
  const screens = useMemo(() => visibleScreens({ solutionIds }), [solutionIds]);
  const screenIndex = Math.max(0, screens.findIndex((s) => s.key === screenKey));
  const screen = screens[screenIndex];
  const autoTimer = useRef(null);

  const goTo = useCallback((key) => {
    clearTimeout(autoTimer.current);
    setScreenKey(key);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => () => clearTimeout(autoTimer.current), []);

  // ── Handlers ──
  const handleClientInfoChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
    if (contactErrors[field]) setContactErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleSolution = (id) => {
    setSolutionsError('');
    setSolutionIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleModule = (solutionId, moduleId) =>
    setModules((prev) => {
      const list = prev[solutionId] || [];
      return { ...prev, [solutionId]: list.includes(moduleId) ? list.filter((m) => m !== moduleId) : [...list, moduleId] };
    });

  const toggleChannel = (id) =>
    setChannelIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const handleSelectPreset = (preset) => {
    setSelectedFont(FONT_OPTIONS.find((f) => f.id === preset.fontId) || FONT_OPTIONS[0]);
    setUiBorderRadius(preset.radius);
  };

  const checkCompany = () => {
    const errors = validateContacts(clientInfo);
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkSolutions = () => {
    if (solutionIds.length) return true;
    setSolutionsError('Seleziona almeno una soluzione per proseguire.');
    return false;
  };

  // Precompile entire Configurator from Copilot analysis
  const handleApplyCopilot = (extracted) => {
    if (!extracted) return;

    if (extracted.clientInfo) {
      setClientInfo((prev) => ({
        company: extracted.clientInfo.company || prev.company,
        vat: extracted.clientInfo.vat || prev.vat,
        name: extracted.clientInfo.name || prev.name,
        role: extracted.clientInfo.role || prev.role,
        email: extracted.clientInfo.email || prev.email,
        phone: extracted.clientInfo.phone || prev.phone
      }));
    }

    if (extracted.sectorId) {
      const matchSector = SECTORS.find((s) => s.id === extracted.sectorId);
      if (matchSector) setSelectedSector(matchSector);
    }

    if (Array.isArray(extracted.solutionIds) && extracted.solutionIds.length > 0) {
      setSolutionIds(extracted.solutionIds);
    }

    if (extracted.modules && typeof extracted.modules === 'object') {
      setModules(extracted.modules);
    }

    if (extracted.voice) {
      setVoice((prev) => ({
        ...prev,
        gender: extracted.voice.gender || prev.gender,
        roles: extracted.voice.roles || prev.roles,
        prompt: extracted.voice.prompt || prev.prompt
      }));
    }

    if (Array.isArray(extracted.channelIds) && extracted.channelIds.length > 0) {
      setChannelIds(extracted.channelIds);
    }

    if (extracted.currentState) setCurrentState(extracted.currentState);
    if (extracted.improvement) setImprovement(extracted.improvement);
    if (extracted.operatorNotes) setOperatorNotes(extracted.operatorNotes);

    // Navigate straight to the summary review & PDF generation screen
    goTo('summary');
  };

  const dossier = buildDossier({
    sector: selectedSector,
    solutionIds,
    modules,
    voice,
    channelIds,
    hosting: selectedHosting,
    currentState,
    improvement,
    primaryColor,
    font: selectedFont,
    uiBorderRadius,
    brandFont,
    selectedOrb,
    clientInfo,
    operatorNotes
  });

  // Generate PDF Handler
  const handleGeneratePdf = () => {
    if (!checkCompany()) return goTo('company');
    if (!checkSolutions()) return goTo('solutions');
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const filename = generateProjectPdf(dossier, docCode);
        setGeneratedFilename(filename);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, shapes: ['square'], colors: [BRAND_HEX, INK, '#d8d5cc'], scalar: 0.9 });
        } catch (e) {
          console.log('Confetti effect skipped', e);
        }
        setIsSuccessModalOpen(true);
      } catch (err) {
        console.error('Error creating PDF:', err);
        alert('Si è verificato un errore nella generazione del PDF. Riprova.');
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  // ── Bottom bar actions ──
  const goBack = screenIndex > 0 ? () => goTo(screens[screenIndex - 1].key) : null;
  const goNext = () => {
    if (screen.key === 'summary') return handleGeneratePdf();
    if (screen.key === 'company' && !checkCompany()) return;
    if (screen.key === 'solutions' && !checkSolutions()) return;
    const next = screens[screenIndex + 1];
    if (next) goTo(next.key);
  };

  // Keyboard: ← back · → next · F cheat-sheet · C Copilota (ignored while typing)
  const navRef = useRef({});
  useEffect(() => {
    navRef.current = { goBack, goNext, blocked: isSuccessModalOpen || faqOpen || copilotOpen };
  });
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setFaqOpen((v) => !v);
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setCopilotOpen((v) => !v);
        return;
      }
      if (navRef.current.blocked) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navRef.current.goNext();
      } else if (e.key === 'ArrowLeft' && navRef.current.goBack) {
        e.preventDefault();
        navRef.current.goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Warn before closing the tab with a half-filled sheet
  const hasData = Boolean(clientInfo.company || clientInfo.name || solutionIds.length || currentState || operatorNotes);
  useEffect(() => {
    if (!hasData) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasData]);

  // Preview renders with the client's color and 3D Orb
  const preview = (
    <div style={accentVars(primaryColor.hex)}>
      <LivePreview
        config={{
          companyName: clientInfo.company,
          solutionNames: solutionIds.map((id) => getSolution(id)?.name).filter(Boolean),
          primaryColor,
          font: selectedFont,
          uiBorderRadius,
          selectedOrb
        }}
      />
    </div>
  );

  const renderScreen = () => {
    switch (screen.key) {
      case 'company':
        return <CompanyScreen clientInfo={clientInfo} onChange={handleClientInfoChange} errors={contactErrors} />;
      case 'sector':
        return (
          <SectorScreen
            selectedSector={selectedSector}
            onSelect={(sector) => {
              setSelectedSector(sector);
              clearTimeout(autoTimer.current);
              autoTimer.current = setTimeout(() => goTo('solutions'), AUTO_ADVANCE_MS);
            }}
          />
        );
      case 'solutions':
        return <SolutionsScreen selectedSector={selectedSector} solutionIds={solutionIds} onToggle={toggleSolution} error={solutionsError} />;
      case 'modules':
        return <ModulesScreen solutionIds={solutionIds} modules={modules} onToggleModule={toggleModule} />;
      case 'voice':
        return <VoiceAgentScreen voice={voice} onChange={(patch) => setVoice((v) => ({ ...v, ...patch }))} />;
      case 'channels':
        return <ChannelsScreen channelIds={channelIds} onToggle={toggleChannel} />;
      case 'gap':
        return (
          <GapScreen
            solutionIds={solutionIds}
            currentState={currentState}
            onChangeCurrent={setCurrentState}
            improvement={improvement}
            onChangeImprovement={setImprovement}
          />
        );
      case 'look':
        return (
          <LookScreen
            primaryColor={primaryColor}
            onSelectColor={setPrimaryColor}
            selectedFont={selectedFont}
            uiBorderRadius={uiBorderRadius}
            onSelectPreset={handleSelectPreset}
            brandFont={brandFont}
            onChangeBrandFont={setBrandFont}
            selectedOrb={selectedOrb}
            onSelectOrb={setSelectedOrb}
            preview={preview}
          />
        );
      case 'summary':
        return (
          <SummaryScreen
            dossier={dossier}
            docCode={docCode}
            operatorNotes={operatorNotes}
            onChangeNotes={setOperatorNotes}
            onEdit={goTo}
            onGeneratePdf={handleGeneratePdf}
            isGenerating={isGenerating}
            tech={{
              hosting: selectedHosting,
              setHosting: setSelectedHosting,
              font: selectedFont,
              setFont: setSelectedFont,
              radius: uiBorderRadius,
              setRadius: setUiBorderRadius
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col antialiased" style={{ fontFamily: HOUSE_FONT, ...accentVars(BRAND_HEX) }}>
      <Header
        phases={PHASES}
        currentPhase={screen.phase}
        onPhaseClick={(phase) => {
          const first = screens.find((s) => PHASES[s.phase].id === phase.id);
          if (first) goTo(first.key);
        }}
        onReset={() => onReset(hasData)}
        onOpenFaq={() => setFaqOpen(true)}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-12 pb-40">
        <div key={screen.key}>{renderScreen()}</div>
      </main>

      <ActionBar
        onBack={goBack}
        onNext={goNext}
        nextLabel={screen.key === 'summary' ? 'Genera PDF' : 'Avanti'}
        nextDisabled={isGenerating}
        position={screenIndex + 1}
        total={screens.length}
        docCode={docCode}
        companyName={clientInfo.company}
      />

      <FaqDrawer open={faqOpen} onClose={() => setFaqOpen(false)} />

      <LiveCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onApplyToConfigurator={handleApplyCopilot}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        generatedFilename={generatedFilename}
        docCode={docCode}
        onDownloadAgain={handleGeneratePdf}
        onNewSheet={onForceReset}
      />
    </div>
  );
}

export default function App() {
  // Changing the key remounts the configurator with a fresh state (next call)
  const [sessionKey, setSessionKey] = useState(0);
  const reset = () => {
    setSessionKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  };
  const handleReset = (hasData) => {
    if (!hasData || window.confirm('Iniziare una nuova scheda? I dati non salvati andranno persi.')) reset();
  };
  return <Configurator key={sessionKey} onReset={handleReset} onForceReset={reset} />;
}
