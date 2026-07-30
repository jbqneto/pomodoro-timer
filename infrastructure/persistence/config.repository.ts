import { MusicOptionId } from '@/core/music/music.types';

export type PersistedConfig = {
  activePlaylist: MusicOptionId;
  soundEnabled: boolean;
  autoPlay: boolean;
  soundVolume: number;
  musicVolume: number;
  showBreakTips: boolean;
};

export interface ConfigRepository {
  load(): PersistedConfig | null;
  save(config: PersistedConfig): void;
  clear(): void;
}
