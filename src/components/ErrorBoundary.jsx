import React from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { LogoMark } from './Logo';
import Corners from './ui/Corners';
import Button from './ui/Button';

// Catches render errors anywhere below it and shows a calm recovery screen instead of a blank page.
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Errore di rendering intercettato:', error, info?.componentStack);
  }

  handleRetry = () => this.setState({ error: null });

  handleReload = () => window.location.reload();

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div role="alert" className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12 antialiased">
        <div className="relative w-full max-w-xl bg-surface border border-line p-8 sm:p-10 shadow-sm">
          <Corners />

          <div className="flex items-center gap-3">
            <LogoMark size={36} />
            <span className="label text-muted">Conflavoro · Table Client Studio</span>
          </div>

          <div className="mt-8 flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 flex items-center justify-center bg-brand-soft text-brand">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">Qualcosa non ha funzionato</h1>
              <p className="mt-2 text-[15px] text-muted leading-relaxed">
                Si è verificato un errore imprevisto nella visualizzazione. Prova a riprendere: se il problema si
                ripete, ricarica la pagina. I dati non ancora esportati in PDF potrebbero andare persi.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" onClick={this.handleRetry}>
              <RotateCcw className="w-4 h-4" />
              Riprova
            </Button>
            <Button variant="ghost" onClick={this.handleReload}>
              <RefreshCw className="w-4 h-4" />
              Ricarica la pagina
            </Button>
          </div>

          <details className="mt-8 border-t border-line pt-4">
            <summary className="label text-faint cursor-pointer select-none">Dettagli tecnici</summary>
            <pre className="mt-3 max-h-48 overflow-auto p-3 bg-sunken text-[12px] font-mono text-ink-soft whitespace-pre-wrap break-words">
              {String(error?.message || error)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
