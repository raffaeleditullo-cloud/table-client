import React from 'react';
import { Check, Download, X, FileText, RotateCcw } from 'lucide-react';
import Corners from './ui/Corners';
import Button from './ui/Button';

export default function SuccessModal({ isOpen, onClose, generatedFilename, docCode, onDownloadAgain, onNewSheet }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-[3px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        className="relative w-full max-w-lg bg-surface border border-ink shadow-[12px_12px_0_0_rgba(11,11,12,0.12)]"
      >
        <Corners size={16} className="text-brand" />
        <div aria-hidden="true" className="h-[3px] bg-brand" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-line text-muted hover:text-ink hover:border-ink transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-9">
          <div className="w-14 h-14 flex items-center justify-center bg-brand text-white">
            <Check className="w-7 h-7" strokeWidth={2.75} />
          </div>

          <span className="mt-5 block text-[14px] font-bold text-brand">Scheda generata</span>
          <h3 id="success-title" className="mt-1 text-[26px] leading-tight font-bold text-ink tracking-[-0.02em]">
            Scheda Tecnica pronta per la Presidenza
          </h3>
          <p className="mt-2 text-[15px] text-muted leading-relaxed">
            Il PDF è stato salvato sul dispositivo. Inoltralo alla Presidenza e all'Ufficio Gare/Amministrazione per la quantificazione dell'offerta.
          </p>

          <div className="mt-6 flex items-stretch border border-line">
            <div className="w-12 shrink-0 flex items-center justify-center bg-sunken border-r border-line text-ink">
              <FileText className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0 px-4 py-3">
              <span className="block text-[13px] font-bold text-ink truncate">{generatedFilename}</span>
              <span className="text-[12px] text-faint font-mono">{docCode} · PDF A4</span>
            </div>
            <button
              type="button"
              onClick={onDownloadAgain}
              title="Scarica di nuovo"
              aria-label="Scarica di nuovo"
              className="w-12 shrink-0 flex items-center justify-center border-l border-line text-ink hover:bg-sunken transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-2.5">
            <button
              type="button"
              onClick={onNewSheet}
              className="h-12 px-4 flex items-center justify-center gap-2.5 bg-ink text-white text-[14px] font-semibold hover:bg-ink-soft transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Nuova scheda (prossima chiamata)
            </button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Torna al riepilogo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
