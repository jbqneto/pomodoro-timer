export type YouTubePlayerInstance = {
  playVideo(): void; pauseVideo(): void; stopVideo(): void; previousVideo(): void; nextVideo(): void;
  setVolume(volume: number): void; getIframe(): HTMLElement; destroy(): void;
};
export type YouTubeApi = {
  Player: new (elementId: string, options: Record<string, unknown>) => YouTubePlayerInstance;
  PlayerState: { PLAYING: number };
};

declare global {
  interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void }
}

export function loadYouTubeApi(onReady: () => void): () => void {
  if (window.YT?.Player) { onReady(); return () => undefined; }
  const previous = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { previous?.(); onReady(); };
  let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
  if (!script) {
    script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
    document.head.appendChild(script);
  }
  return () => undefined;
}
