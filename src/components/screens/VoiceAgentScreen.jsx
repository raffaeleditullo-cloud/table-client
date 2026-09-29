import React from 'react';
import { VOICE_GENDERS, VOICE_ROLES } from '../../data/configOptions';
import { getIcon } from '../../data/icons';
import ScreenFrame, { SectionTitle } from '../flow/ScreenFrame';
import ChoiceCard from '../flow/ChoiceCard';
import { ToggleChip, NoteArea } from '../flow/Fields';

// Voice agent spec: no audio playback, only what the Presidency needs to scope the project
export default function VoiceAgentScreen({ voice, onChange }) {
  const toggleRole = (id) =>
    onChange({ roles: voice.roles.includes(id) ? voice.roles.filter((r) => r !== id) : [...voice.roles, id] });

  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Agente vocale: voce, compiti e istruzioni"
      subtitle="Specifiche del Centralino Virtuale VoIP & Agente Vocale AI."
    >
      <SectionTitle>Tipologia voce</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VOICE_GENDERS.map((g) => (
          <ChoiceCard
            key={g.id}
            compact
            icon={getIcon(g.icon)}
            title={g.name}
            description={g.desc}
            selected={voice.gender === g.id}
            onSelect={() => onChange({ gender: g.id })}
          />
        ))}
      </div>

      <div className="mt-10">
        <SectionTitle hint="Selezione multipla">Ruolo e compiti dell'assistente vocale</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {VOICE_ROLES.map((r) => (
            <ToggleChip key={r.id} icon={getIcon(r.icon)} selected={voice.roles.includes(r.id)} onToggle={() => toggleRole(r.id)}>
              {r.name}
            </ToggleChip>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <NoteArea
          label="Note / istruzioni di prompting"
          hint="Cosa deve sapere l'assistente vocale e su quali informazioni aziendali deve essere istruito."
          value={voice.prompt}
          onChange={(prompt) => onChange({ prompt })}
          placeholder="Es. orari di apertura, servizi offerti, a chi passare le chiamate urgenti, domande frequenti dei clienti, informazioni da NON comunicare…"
          suggestions={[
            'Orari di apertura e chiusura',
            'Elenco servizi / prodotti offerti',
            'A chi trasferire le chiamate urgenti',
            'Domande frequenti dei clienti',
            'Lingue da gestire'
          ]}
        />
      </div>
    </ScreenFrame>
  );
}
