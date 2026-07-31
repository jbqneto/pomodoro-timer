import { CustomMusicSource } from './music.types';

const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'music.youtube.com', 'www.youtube.com']);
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{6,}$/;

function isValidYouTubeId(value: string | null): value is string {
  return value !== null && YOUTUBE_ID_PATTERN.test(value);
}

export function parseYouTubeUrl(value: string): CustomMusicSource | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    const playlistId = url.searchParams.get('list');

    if ((YOUTUBE_HOSTS.has(host) || host === 'youtu.be') && isValidYouTubeId(playlistId)) {
      return { type: 'youtube-playlist', playlistId };
    }

    if (host === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
      return isValidYouTubeId(videoId) ? { type: 'youtube-video', videoId } : null;
    }

    if (!YOUTUBE_HOSTS.has(host)) return null;

    const videoId = url.pathname === '/watch'
      ? url.searchParams.get('v')
      : url.pathname.startsWith('/embed/')
        ? url.pathname.split('/')[2] ?? null
        : null;

    return isValidYouTubeId(videoId) ? { type: 'youtube-video', videoId } : null;
  } catch {
    return null;
  }
}
