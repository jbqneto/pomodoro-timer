"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useConfig } from '@/context/ConfigContext';

type ButtonType = {
  id: PlaylistType;
  labelKey: string;
};

const buttons: ButtonType[] = [
  { id: 'catholic', labelKey: 'catholic' },
  { id: 'lofi', labelKey: 'lofi' },
  { id: 'classical', labelKey: 'classical' },
];

export function PlaylistSelector() {
  const { t } = useLanguage();
  const { setActivePlaylist, activePlaylist } = useConfig();

  return (
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
      {buttons.map((button) => (
        <Button
          key={button.id}
          onClick={() => setActivePlaylist(button.id === activePlaylist ? null : button.id)}
          variant={activePlaylist === button.id ? 'default' : 'secondary'}
          className="w-full justify-center sm:w-auto"
        >
          {t(button.id)}
        </Button>
      ))}
    </div>
  );
}
