"use client";

import { MusicOptionId } from '@/core/music/music.types';
import { ConfigRepository, InterfaceMode, PersistedConfig } from '@/infrastructure/persistence/config.repository';
import { defaultConfigRepository } from '@/infrastructure/persistence/local-storage-config.repository';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const DEFAULT_CONFIG: PersistedConfig = {
  activePlaylist: 'gregorian', soundEnabled: true, autoPlay: true, soundVolume: 80, musicVolume: 80, showBreakTips: true, interfaceMode: 'simple',
};
interface ConfigContextType extends PersistedConfig {
  setAutoPlay(value: boolean): void;
  setSoundVolume(value: number): void;
  setMusicVolume(value: number): void;
  setActivePlaylist(value: MusicOptionId): void;
  setSoundEnabled(value: boolean): void;
  setShowBreakTips(value: boolean): void;
  setInterfaceMode(value: InterfaceMode): void;
}
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children, repository = defaultConfigRepository }: { children: ReactNode; repository?: ConfigRepository }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const stored = repository.load();
    if (stored) setConfig(stored);
    setHydrated(true);
  }, [repository]);
  useEffect(() => { if (hydrated) repository.save(config); }, [config, hydrated, repository]);
  const update = <K extends keyof PersistedConfig>(key: K, value: PersistedConfig[K]) => setConfig((current) => ({ ...current, [key]: value }));
  return <ConfigContext.Provider value={{ ...config,
    setAutoPlay: (value) => update('autoPlay', value), setSoundVolume: (value) => update('soundVolume', value),
    setMusicVolume: (value) => update('musicVolume', value), setActivePlaylist: (value) => update('activePlaylist', value),
    setSoundEnabled: (value) => update('soundEnabled', value),
    setShowBreakTips: (value) => update('showBreakTips', value),
    setInterfaceMode: (value) => update('interfaceMode', value),
  }}>{children}</ConfigContext.Provider>;
}
export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
}
