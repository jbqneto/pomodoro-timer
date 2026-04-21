"use client";

import { useConfig } from '@/context/ConfigContext';
import { useTimer } from '@/context/TimerContext';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type PlayerProperties = {
  width?: number;
  height?: number;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export interface YoutubePlayerRef {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
}

const YouTubePlayer = forwardRef<YoutubePlayerRef, PlayerProperties>(({ width = 640, height = 360, onPlaybackStateChange }, ref) => {
    
  const { activePlaylist, autoPlay, soundVolume, getPlaylistId } = useConfig();
  const { state } = useTimer();
  const containerId = useRef(`yt-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<any>(null);
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
    setVolume: (volume: number) => {
      setVolume(volume);
    }
  }));

  useEffect(() => {
    const init = () => {
      // @ts-ignore
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        return;
      }
      // @ts-ignore
      window.onYouTubeIframeAPIReady = () => setApiReady(true);
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    };
    init();
  }, []);

  useEffect(() => {
    if (!apiReady || !activePlaylist) {
      onPlaybackStateChange?.(false);
      return;
    }
    // @ts-ignore
    const YT = window.YT;
    const playlistId = getPlaylistId(activePlaylist);

    if (!playlistId) return;

    playerRef.current = new YT.Player(containerId.current, {
      host: "https://www.youtube-nocookie.com",
      height: '' + height,
      width: '' + width,
      playerVars: {
        listType: "playlist",
        list: playlistId,
        rel: 0,
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        // necessário para JS API
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          if (state === 'running' && autoPlay) {
            playVideo();
          }

          try { playerRef.current.setVolume(soundVolume); } catch {}
        },
        onStateChange: (event: { data: number }) => {
          // @ts-ignore
          const YT = window.YT;
          onPlaybackStateChange?.(event.data === YT.PlayerState.PLAYING);
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

    setVolume(soundVolume);
  }, [soundVolume]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (state === 'running' && autoPlay) {
      playVideo();
    } else {
      pauseVideo()
    }

  }, [state, autoPlay]);

  if (!apiReady) return <></>

  return (
    <div className="w-full aspect-video overflow-hidden rounded-xl">
      <div id={containerId.current} className="w-full h-full" />
    </div>
  );
});

export default YouTubePlayer;
