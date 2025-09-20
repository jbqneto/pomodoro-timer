"use client";

import { useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export function PlaylistSelector() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<'lofi' | 'classical' | null>('lofi');
  const { t } = useLanguage();

  return (
    <div className="flex gap-3 items-center">
      <Music className="w-4 h-4 text-muted-foreground mr-3" />
      
      <Button
        onClick={() => setSelectedPlaylist(selectedPlaylist === 'lofi' ? null : 'lofi')}
        variant={selectedPlaylist === 'lofi' ? 'default' : 'secondary'}
        size="sm"
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all focus-ring ${
          selectedPlaylist === 'lofi'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        {t('lofi')}
      </Button>
      
      <Button
        onClick={() => setSelectedPlaylist(selectedPlaylist === 'classical' ? null : 'classical')}
        variant={selectedPlaylist === 'classical' ? 'default' : 'secondary'}
        size="sm"
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all focus-ring ${
          selectedPlaylist === 'classical'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        {t('classical')}
      </Button>
    </div>
  );
}