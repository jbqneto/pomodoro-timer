import { MusicOptionId } from '@/core/music/music.types';

export type InterfaceMode = 'simple' | 'advanced';

export type PersistedConfig = {
  activePlaylist: MusicOptionId;
  soundEnabled: boolean;
  autoPlay: boolean;
  soundVolume: number;
  musicVolume: number;
  showBreakTips: boolean;
  interfaceMode: InterfaceMode;
};

export interface ConfigRepository {
  load(): PersistedConfig | null;
  save(config: PersistedConfig): void;
  clear(): void;
}
