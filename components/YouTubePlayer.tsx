"use client";

import { loadYouTubeApi, YouTubePlayerInstance } from '@/infrastructure/music/youtube-api';
import { CustomMusicSource } from '@/core/music/music.types';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface YoutubePlayerRef { playVideo(): void; pauseVideo(): void; stopVideo(): void; previousVideo(): void; nextVideo(): void; setVolume(value: number): void }
type Props = { source: CustomMusicSource; volume: number; shouldPlay: boolean; onPlaybackStateChange?(playing: boolean): void };

const YouTubePlayer = forwardRef<YoutubePlayerRef, Props>(({ source, volume, shouldPlay, onPlaybackStateChange }, ref) => {
  const containerId = useRef(`yt-${Math.random().toString(36).slice(2)}`);
  const player = useRef<YouTubePlayerInstance | null>(null);
  const volumeRef = useRef(volume);
  const shouldPlayRef = useRef(shouldPlay);
  volumeRef.current = volume;
  shouldPlayRef.current = shouldPlay;
  const [apiReady, setApiReady] = useState(false);
  const call = (method: keyof YoutubePlayerRef, value?: number) => {
    try { const fn = player.current?.[method] as ((arg?: number) => void) | undefined; fn?.call(player.current, value); } catch { /* API may be tearing down. */ }
  };
  useImperativeHandle(ref, () => ({ playVideo: () => call('playVideo'), pauseVideo: () => call('pauseVideo'),
    stopVideo: () => call('stopVideo'), previousVideo: () => call('previousVideo'), nextVideo: () => call('nextVideo'),
    setVolume: (value) => call('setVolume', value) }));
  useEffect(() => loadYouTubeApi(() => setApiReady(true)), []);
  useEffect(() => {
    if (!apiReady || !window.YT) return;
    player.current = new window.YT.Player(containerId.current, {
      host: 'https://www.youtube-nocookie.com', height: '100%', width: '100%',
      videoId: source.type === 'youtube-video' ? source.videoId : undefined,
      playerVars: { ...(source.type === 'youtube-playlist' ? { listType: 'playlist', list: source.playlistId } : {}), rel: 0, autoplay: 0, controls: 0, disablekb: 1, fs: 0,
        modestbranding: 1, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: () => { player.current?.getIframe().setAttribute('tabindex', '-1'); player.current?.setVolume(volumeRef.current); if (shouldPlayRef.current) player.current?.playVideo(); },
        onStateChange: (event: { data: number }) => onPlaybackStateChange?.(event.data === window.YT?.PlayerState.PLAYING),
      },
    });
    return () => { onPlaybackStateChange?.(false); try { player.current?.destroy(); } catch {} player.current = null; };
  }, [apiReady, onPlaybackStateChange, source]);
  useEffect(() => { call('setVolume', volume); }, [volume]);
  useEffect(() => { call(shouldPlay ? 'playVideo' : 'pauseVideo'); }, [shouldPlay]);
  if (!apiReady) return null;
  return <div className="w-full aspect-video overflow-hidden rounded-xl"><div id={containerId.current} className="pointer-events-none h-full w-full" /></div>;
});
YouTubePlayer.displayName = 'YouTubePlayer';
export default YouTubePlayer;
