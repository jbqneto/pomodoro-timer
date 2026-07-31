"use client";

import { CustomMusicSource, MusicOptionId } from '@/core/music/music.types';
import { ConfigRepository, InterfaceMode, PersistedConfig } from '@/infrastructure/persistence/config.repository';
import { defaultConfigRepository } from '@/infrastructure/persistence/local-storage-config.repository';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ProductAnalytics } from '@/application/ports/product-analytics';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';

const DEFAULT_CONFIG: Required<PersistedConfig> = {
  activePlaylist: 'gregorian', customMusicSource: null, soundEnabled: true, autoPlay: true, soundVolume: 25, musicVolume: 25, showBreakTips: true, interfaceMode: 'simple', askForOccasionalFeedback: true,
};
interface ConfigContextType extends Required<PersistedConfig> {
  isFirstVisit: boolean;
  setAutoPlay(value: boolean): void;
  setSoundVolume(value: number): void;
  setMusicVolume(value: number): void;
  setActivePlaylist(value: MusicOptionId): void;
  setCustomMusicSource(value: CustomMusicSource): void;
  setSoundEnabled(value: boolean): void;
  setShowBreakTips(value: boolean): void;
  setInterfaceMode(value: InterfaceMode): void;
  setAskForOccasionalFeedback(value: boolean): void;
}
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children, repository = defaultConfigRepository, analytics = new NoopProductAnalytics() }: { children: ReactNode; repository?: ConfigRepository; analytics?: ProductAnalytics }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  useEffect(() => {
    const stored = repository.load();
    setIsFirstVisit(stored === null);
    if (stored) setConfig({ ...stored, customMusicSource: stored.customMusicSource ?? null, askForOccasionalFeedback: stored.askForOccasionalFeedback ?? true });
    setHydrated(true);
  }, [repository]);
  useEffect(() => { if (hydrated) repository.save(config); }, [config, hydrated, repository]);
  const update = <K extends keyof PersistedConfig>(key: K, value: PersistedConfig[K]) => setConfig((current) => ({ ...current, [key]: value }));
  return <ConfigContext.Provider value={{ ...config, isFirstVisit,
    setAutoPlay: (value) => update('autoPlay', value), setSoundVolume: (value) => update('soundVolume', value),
    setMusicVolume: (value) => update('musicVolume', value), setActivePlaylist: (value) => update('activePlaylist', value),
    setCustomMusicSource: (value) => update('customMusicSource', value),
    setSoundEnabled: (value) => update('soundEnabled', value),
    setShowBreakTips: (value) => update('showBreakTips', value),
    setInterfaceMode: (value) => setConfig((current) => { if (current.interfaceMode !== value) analytics.track({name:'interface_mode_changed',properties:{from:current.interfaceMode,to:value}}); return {...current,interfaceMode:value}; }),
    setAskForOccasionalFeedback: (value) => update('askForOccasionalFeedback', value),
  }}>{children}</ConfigContext.Provider>;
}
export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
}
