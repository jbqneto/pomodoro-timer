export type MusicOptionId = 'silence' | 'gregorian' | 'classical' | 'lofi';
export type MusicSource = { type: 'silence' } | { type: 'youtube-playlist'; playlistId: string };
export type MusicOption = { id: MusicOptionId; source: MusicSource };
