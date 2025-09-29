"use client";

import { useConfig } from '@/context/ConfigContext';
import { useTimer } from '@/context/TimerContext';
import { useEffect, useRef, useState } from 'react';

type PlayerProperties = {
  width?: number;
  height?: number;
}

export function YouTubePlayer({ width = 640, height = 360 }: PlayerProperties) {
  const { activePlaylist, getPlaylistId } = useConfig();
  const {state, preset} = useTimer();
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
    console.log(`Loading YouTube: ${activePlaylist} (${apiReady})`);
    if (!apiReady || !activePlaylist) return;
    // @ts-ignore
    const YT = window.YT;
    const playlistId = getPlaylistId(activePlaylist);

    if (!playlistId) return;

    playerRef.current = new YT.Player(containerId.current, {
      // use host "nocookie" para privacy-enhanced mode
      host: "https://www.youtube.com",
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
          if (state === 'running') {
            playVideo();
          }

          try { playerRef.current.setVolume(80); } catch {}
        },
      },
    });

    return () => {
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
    };
  }, [apiReady, activePlaylist]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (state === 'running') {
      playVideo();
    } else if (state === 'paused' || state === 'idle') {
      pauseVideo()
    }

  }, [state, preset]);

  if (!apiReady) return <></>

  return (
    <div className="w-full aspect-video overflow-hidden rounded-xl">
      <div id={containerId.current} className="w-full h-full" />
    </div>
  );
}