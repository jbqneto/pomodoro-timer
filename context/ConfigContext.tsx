import { createContext, ReactNode, useContext, useState } from "react";

const playlists = {
  lofi: 'PLgRDBI6ZEX_yqpTYSAgshj_vjoaMs0GP8', // Lo-fi study playlist
  classical: 'PLgRDBI6ZEX_ztab0cICj_wIqo1GHjtzDd', // Classical study playlist
  catholic: 'PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr' // Catholic hymns playlist
};

interface ConfigContextType {
  soundEnabled: boolean;
  autoPlay: boolean;
  activePlaylist: PlaylistType | null;
  soundVolume: number;
  setAutoPlay: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setActivePlaylist: (playlist: PlaylistType | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  getPlaylistId: (playlist: PlaylistType) => string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [activePlaylist, setActivePlaylist] = useState<PlaylistType | null>('catholic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [soundVolume, setSoundVolume] = useState(80); // Default volume

  const getPlaylistId = (playlist: PlaylistType) => {
    return playlists[playlist];
  }
  
  return (
    <ConfigContext.Provider value={{
      soundEnabled,
      activePlaylist,
      autoPlay,
      soundVolume,
      setAutoPlay,
      setSoundVolume,
      setActivePlaylist,
      setSoundEnabled,
      getPlaylistId
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}