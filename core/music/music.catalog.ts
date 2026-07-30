import { MusicOption, MusicOptionId, MusicSource } from './music.types';

const options: readonly MusicOption[] = [
  { id: 'silence', source: { type: 'silence' } },
  { id: 'gregorian', source: { type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr' } },
  { id: 'classical', source: { type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_ztab0cICj_wIqo1GHjtzDd' } },
  { id: 'lofi', source: { type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_yqpTYSAgshj_vjoaMs0GP8' } },
];

export function getMusicOptions(): readonly MusicOption[] { return options; }
export function getMusicOption(id: MusicOptionId): MusicOption { return options.find((option) => option.id === id)!; }
export function getMusicSource(id: MusicOptionId): MusicSource { return getMusicOption(id).source; }
export function isMusicOptionId(value: unknown): value is MusicOptionId {
  return typeof value === 'string' && options.some((option) => option.id === value);
}
