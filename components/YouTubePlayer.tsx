"use client";

import { useConfig } from '@/context/ConfigContext';
import { useTimer } from '@/context/TimerContext';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type YouTubePlayerInstance = {
  playVideo: () => void; pauseVideo: () => void; stopVideo: () => void;
  previousVideo: () => void; nextVideo: () => void; setVolume: (volume: number) => void;
  getIframe: () => HTMLIFrameElement; destroy: () => void;
};
type YouTubeApi = {
  Player: new (id: string, options: Record<string, unknown>) => YouTubePlayerInstance;
  PlayerState: { PLAYING: number };
};
declare global { interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void } }

type PlayerProperties = {
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export interface YoutubePlayerRef {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  previousVideo: () => void;
  nextVideo: () => void;
  setVolume: (volume: number) => void;
}

const YouTubePlayer = forwardRef<YoutubePlayerRef, PlayerProperties>(({ onPlaybackStateChange }, ref) => {
    
  const { activePlaylist, autoPlay, musicVolume, getPlaylistId } = useConfig();
  const { state } = useTimer();
  const containerId = useRef(`yt-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const [apiReady, setApiReady] = useState(false);


  const playVideo = () => {
    if (!playerRef.current) return;
    try { playerRef.current.playVideo(); } catch {}
  }

  const pauseVideo = () => {
    if (!playerRef.current) return;
    try { playerRef.current.pauseVideo(); } catch {}
  }

  const stopVideo = () => {
    if (!playerRef.current) return;
    try { playerRef.current.stopVideo(); } catch {}
  }

  const previousVideo = () => {
    if (!playerRef.current) return;
    try { playerRef.current.previousVideo(); } catch {}
  }

  const nextVideo = () => {
    if (!playerRef.current) return;
    try { playerRef.current.nextVideo(); } catch {}
  }

  const setVolume = (volume: number) => {
    if (!playerRef.current) return;
    try { playerRef.current.setVolume(volume); } catch {}
  }

  useImperativeHandle(ref, () => ({
    playVideo: () => {
      playVideo();
    },
    pauseVideo: () => {
      pauseVideo();
    },
    stopVideo: () => {
      stopVideo();
    },
    previousVideo: () => {
      previousVideo();
    },
    nextVideo: () => {
      nextVideo();
    },
    setVolume: (volume: number) => {
      setVolume(volume);
    }
  }));

  useEffect(() => {
    if (activePlaylist === "silence") {
      playerRef.current?.stopVideo();
      playerRef.current?.destroy();
      playerRef.current = null;
      setApiReady(false);
      onPlaybackStateChange?.(false);
      return;
    }
    const init = () => {
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        return;
      }
      window.onYouTubeIframeAPIReady = () => setApiReady(true);
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    };
    init();
  }, [activePlaylist, onPlaybackStateChange]);

  useEffect(() => {
    if (!apiReady || activePlaylist === "silence") {
      onPlaybackStateChange?.(false);
      return;
    }
    const YT = window.YT;
    if (!YT) return;
    const playlistId = getPlaylistId(activePlaylist);

    if (!playlistId) return;

    playerRef.current = new YT.Player(containerId.current, {
      host: "https://www.youtube-nocookie.com",
      height: '100%',
      width: '100%',
      playerVars: {
        listType: "playlist",
        list: playlistId,
        rel: 0,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        // necessário para JS API
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          const player = playerRef.current;
          if (!player) return;
          player.getIframe().setAttribute("tabindex", "-1");

          if (state === 'running' && autoPlay) {
            playVideo();
          }

          try { player.setVolume(musicVolume); } catch {}
        },
        onStateChange: (event: { data: number }) => {
          const YT = window.YT;
          onPlaybackStateChange?.(event.data === YT?.PlayerState.PLAYING);
        },
      },
    });

    return () => {
      onPlaybackStateChange?.(false);
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
    };
  }, [apiReady, activePlaylist, onPlaybackStateChange]);

  useEffect(() => {
    if (!playerRef.current) return;

    setVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (state === 'running' && autoPlay) {
      playVideo();
    } else {
      pauseVideo()
    }

  }, [state, autoPlay]);

  if (!apiReady || activePlaylist === "silence") return null;

  return (
    <div className="w-full aspect-video overflow-hidden rounded-xl">
      <div id={containerId.current} className="pointer-events-none h-full w-full" />
    </div>
  );
});
YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
