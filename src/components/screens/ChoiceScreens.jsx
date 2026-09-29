import React from 'react';
import { SECTORS } from '../../data/catalog';
import { getIcon } from '../../data/icons';
import ScreenFrame from '../flow/ScreenFrame';
import ChoiceCard from '../flow/ChoiceCard';

// ── Sector ──
export function SectorScreen({ selectedSector, onSelect }) {
  return (
    <ScreenFrame
      eyebrow="Azienda"
      title="In che settore opera l'azienda?"
      subtitle="Serve a evidenziare le soluzioni più richieste nel settore."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SECTORS.map((sector) => (
          <ChoiceCard
            key={sector.id}
            compact
            icon={getIcon(sector.icon)}
            title={sector.name}
            selected={selectedSector?.id === sector.id}
            onSelect={() => onSelect(sector)}
          />
        ))}
      </div>
    </ScreenFrame>
  );
}
