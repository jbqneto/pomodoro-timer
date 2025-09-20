"use client";

import { useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { useConfig } from '@/context/ConfigContext';

type ButtonType = {
  id: PlaylistType;
  labelKey: string;
};

const buttons: ButtonType[] = [
  { id: 'lofi', labelKey: 'lofi' },
  { id: 'classical', labelKey: 'classical' },
  { id: 'catholic', labelKey: 'catholic' },
];

export function PlaylistSelector() {
  const { t } = useLanguage();
  const { setActivePlaylist, activePlaylist } = useConfig()

  return (
    <div className="flex gap-3 items-center">
      <Music className="w-4 h-4 text-muted-foreground mr-3" />

      {
      buttons.map((button) => (
        <Button
          key={button.id}
          onClick={() => setActivePlaylist(button.id === activePlaylist ? null : button.id)}
          variant={activePlaylist === button.id ? 'default' : 'secondary'}
      >
        {t(button.id)}
        </Button>))
      }
    </div>
  );
}