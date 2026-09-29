import React from 'react';
import { CHANNELS, CHANNEL_GROUPS } from '../../data/configOptions';
import { getIcon } from '../../data/icons';
import ScreenFrame, { SectionTitle } from '../flow/ScreenFrame';
import { ToggleChip } from '../flow/Fields';

export default function ChannelsScreen({ channelIds, onToggle }) {
  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Canali e sistemi da collegare"
      subtitle="Con cosa deve dialogare la soluzione: canali di contatto, programmi già in uso e dispositivi."
    >
      <div className="space-y-8">
        {CHANNEL_GROUPS.map((group) => (
          <div key={group.id}>
            <SectionTitle>{group.name}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.filter((c) => c.group === group.id).map((c) => (
                <ToggleChip key={c.id} icon={getIcon(c.icon)} selected={channelIds.includes(c.id)} onToggle={() => onToggle(c.id)}>
                  {c.name}
                </ToggleChip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScreenFrame>
  );
}
