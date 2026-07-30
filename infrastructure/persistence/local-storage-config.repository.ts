import { isMusicOptionId } from '@/core/music/music.catalog';
import { ConfigRepository, PersistedConfig } from './config.repository';

export const CONFIG_STORAGE_KEY = 'focus-timer-config';
const DEFAULTS: PersistedConfig = { activePlaylist: 'gregorian', soundEnabled: true, autoPlay: true, soundVolume: 80, musicVolume: 80, showBreakTips: true };
const isVolume = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;

export class LocalStorageConfigRepository implements ConfigRepository {
  constructor(private readonly storage: Storage) {}
  load(): PersistedConfig | null {
    const raw = this.storage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw) as Record<string, unknown>;
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid config');
      const migratedPlaylist = value.activePlaylist === 'catholic' ? 'gregorian' : value.activePlaylist;
      if (value.activePlaylist !== undefined && !isMusicOptionId(migratedPlaylist)) throw new Error('Invalid config');
      if (value.soundEnabled !== undefined && typeof value.soundEnabled !== 'boolean') throw new Error('Invalid config');
      if (value.autoPlay !== undefined && typeof value.autoPlay !== 'boolean') throw new Error('Invalid config');
      if (value.soundVolume !== undefined && !isVolume(value.soundVolume)) throw new Error('Invalid config');
      if (value.musicVolume !== undefined && !isVolume(value.musicVolume)) throw new Error('Invalid config');
      return { activePlaylist: isMusicOptionId(migratedPlaylist) ? migratedPlaylist : DEFAULTS.activePlaylist,
        soundEnabled: typeof value.soundEnabled === 'boolean' ? value.soundEnabled : DEFAULTS.soundEnabled,
        autoPlay: typeof value.autoPlay === 'boolean' ? value.autoPlay : DEFAULTS.autoPlay,
        soundVolume: isVolume(value.soundVolume) ? value.soundVolume : DEFAULTS.soundVolume,
        musicVolume: isVolume(value.musicVolume) ? value.musicVolume : DEFAULTS.musicVolume,
        showBreakTips: typeof value.showBreakTips === 'boolean' ? value.showBreakTips : DEFAULTS.showBreakTips };
    } catch {
      this.clear();
      return null;
    }
  }
  save(config: PersistedConfig): void { this.storage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config)); }
  clear(): void { this.storage.removeItem(CONFIG_STORAGE_KEY); }
}

export const defaultConfigRepository: ConfigRepository = {
  load: () => typeof window === 'undefined' ? null : new LocalStorageConfigRepository(window.localStorage).load(),
  save: (config) => { if (typeof window !== 'undefined') new LocalStorageConfigRepository(window.localStorage).save(config); },
  clear: () => { if (typeof window !== 'undefined') new LocalStorageConfigRepository(window.localStorage).clear(); },
};
