"use client";

import { useConfig } from '@/context/ConfigContext';
import { useTimer } from '@/context/TimerContext';
import { useEffect, useRef, useState } from 'react';

export function YouTubePlayer() {
  const { activePlaylist, getPlaylistId } = useConfig();
  const {state, preset} = useTimer();
  const containerId = useRef(`yt-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);

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
      height: "360",
      width: "640",
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
    if (state === 'running') {
      try { playerRef.current?.playVideo?.(); } catch {}
    } else if (state === 'paused') {
      try { playerRef.current?.pauseVideo?.(); } catch {}
    }

  }, [state, preset]);

  return (
    <div className="w-full max-w-2xl aspect-video overflow-hidden rounded-xl">
      <div id={containerId.current} className="w-full h-full" />
    </div>
  );
}