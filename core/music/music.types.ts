export type OfficialMusicOptionId = 'silence' | 'gregorian' | 'classical' | 'lofi';
export type MusicOptionId = OfficialMusicOptionId | 'custom';
export type MusicSource =
  | { type: 'silence' }
  | { type: 'youtube-playlist'; playlistId: string }
  | { type: 'youtube-video'; videoId: string };
export type CustomMusicSource = Exclude<MusicSource, { type: 'silence' }>;
export type MusicOption = { id: OfficialMusicOptionId; source: MusicSource };

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{6,}$/;

export function isCustomMusicSource(value: unknown): value is CustomMusicSource {
  if (!value || typeof value !== 'object') return false;

  const source = value as CustomMusicSource;
  return (source.type === 'youtube-playlist' && YOUTUBE_ID_PATTERN.test(source.playlistId)) ||
    (source.type === 'youtube-video' && YOUTUBE_ID_PATTERN.test(source.videoId));
}
