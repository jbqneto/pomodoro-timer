import { CustomMusicSource, MusicOptionId } from '@/core/music/music.types';

export type InterfaceMode = 'simple' | 'advanced';

export type PersistedConfig = {
  activePlaylist: MusicOptionId;
  customMusicSource: CustomMusicSource | null;
  soundEnabled: boolean;
  autoPlay: boolean;
  soundVolume: number;
  musicVolume: number;
  showBreakTips: boolean;
  interfaceMode: InterfaceMode;
  askForOccasionalFeedback?: boolean;
};

export interface ConfigRepository {
  load(): PersistedConfig | null;
  save(config: PersistedConfig): void;
  clear(): void;
}
