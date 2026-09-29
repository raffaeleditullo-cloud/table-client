import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getSolution } from '../../data/catalog';
import { CURRENT_STATE_CHIPS } from '../../data/configOptions';
import ScreenFrame from '../flow/ScreenFrame';
import { NoteArea } from '../flow/Fields';

// "Situazione attuale vs miglioramento richiesto" — core of the MIMIT application
export default function GapScreen({ solutionIds, currentState, onChangeCurrent, improvement, onChangeImprovement }) {
  const improvementSuggestions = solutionIds.flatMap((id) => getSolution(id)?.improvements || []);

  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Situazione attuale e miglioramento atteso"
      subtitle="Sezione fondamentale per la domanda ministeriale: cosa usa oggi l'azienda e cosa cambia con il progetto Conflavoro AI."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
        <NoteArea
          label="Stato iniziale dell'azienda"
          hint="Strumenti, processi e limiti attuali."
          value={currentState}
          onChange={onChangeCurrent}
          placeholder="Es. appuntamenti su agenda cartacea, clienti in fogli Excel, centralino analogico senza segreteria…"
          suggestions={CURRENT_STATE_CHIPS}
          rows={8}
        />
        <div className="hidden lg:flex items-center" aria-hidden="true">
          <span className="w-11 h-11 flex items-center justify-center bg-ink text-white">
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>
        <NoteArea
          label="Miglioramento sostanziale atteso"
          hint="Nuove funzioni e automazioni introdotte dal progetto."
          value={improvement}
          onChange={onChangeImprovement}
          placeholder="Es. prenotazioni automatiche 24/7 sincronizzate con il gestionale cloud, nessuna chiamata persa…"
          suggestions={improvementSuggestions}
          rows={8}
          tone="brand"
        />
      </div>
    </ScreenFrame>
  );
}
