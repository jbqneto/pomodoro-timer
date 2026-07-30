"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type PlaylistType = "silence" | "gregorian" | "classical" | "lofi";

const playlists: Record<Exclude<PlaylistType, "silence">, string> = {
  lofi: "PLgRDBI6ZEX_yqpTYSAgshj_vjoaMs0GP8",
  classical: "PLgRDBI6ZEX_ztab0cICj_wIqo1GHjtzDd",
  // The existing playlist is retained; only its internal legacy category is migrated.
  gregorian: "PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr",
};

interface ConfigContextType {
  soundEnabled: boolean;
  autoPlay: boolean;
  activePlaylist: PlaylistType;
  soundVolume: number;
  musicVolume: number;
  setAutoPlay: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setActivePlaylist: (playlist: PlaylistType) => void;
  setSoundEnabled: (enabled: boolean) => void;
  getPlaylistId: (playlist: PlaylistType) => string | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);
const STORAGE_KEY = "focus-timer-config";

function validVolume(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function migratePlaylist(value: unknown): PlaylistType | null {
  if (value === "catholic") return "gregorian";
  if (value === "silence" || value === "gregorian" || value === "lofi" || value === "classical") return value;
  return null;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [activePlaylist, setActivePlaylist] = useState<PlaylistType>("gregorian");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(80);
  const [musicVolume, setMusicVolumeState] = useState(30);
  const [hydrated, setHydrated] = useState(false);

  const setSoundVolume = useCallback((volume: number) => {
    if (validVolume(volume)) setSoundVolumeState(volume);
  }, []);
  const setMusicVolume = useCallback((volume: number) => {
    if (validVolume(volume)) setMusicVolumeState(volume);
  }, []);
  const getPlaylistId = useCallback((playlist: PlaylistType) => (
    playlist === "silence" ? null : playlists[playlist]
  ), []);

  useEffect(() => {
    const storedConfig = window.localStorage.getItem(STORAGE_KEY);
    if (storedConfig) {
      try {
        const parsed: unknown = JSON.parse(storedConfig);
        if (parsed && typeof parsed === "object") {
          const config = parsed as Record<string, unknown>;
          if (typeof config.soundEnabled === "boolean") setSoundEnabled(config.soundEnabled);
          if (typeof config.autoPlay === "boolean") setAutoPlay(config.autoPlay);
          if (validVolume(config.soundVolume)) setSoundVolumeState(config.soundVolume);
          if (validVolume(config.musicVolume)) setMusicVolumeState(config.musicVolume);
          const playlist = migratePlaylist(config.activePlaylist);
          if (playlist) setActivePlaylist(playlist);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activePlaylist, soundEnabled, autoPlay, soundVolume, musicVolume,
    }));
  }, [activePlaylist, autoPlay, hydrated, musicVolume, soundEnabled, soundVolume]);

  return <ConfigContext.Provider value={{
    soundEnabled, activePlaylist, autoPlay, soundVolume, musicVolume,
    setAutoPlay, setSoundVolume, setMusicVolume, setActivePlaylist,
    setSoundEnabled, getPlaylistId,
  }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within a ConfigProvider");
  return context;
}
