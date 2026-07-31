import { describe, expect, it } from 'vitest';
import { getMusicOptions, getMusicSource } from '@/core/music/music.catalog';
import { parseYouTubeUrl } from '@/core/music/youtube-url';

describe('official music catalog', () => {
  it('contains each official option', () => expect(getMusicOptions().map(({ id }) => id)).toEqual(['silence', 'gregorian', 'classical', 'lofi']));
  it('maps silence without a YouTube source', () => expect(getMusicSource('silence')).toEqual({ type: 'silence' }));
  it('preserves official playlist IDs', () => {
    expect(getMusicSource('gregorian')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr' });
    expect(getMusicSource('classical')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_ztab0cICj_wIqo1GHjtzDd' });
    expect(getMusicSource('lofi')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_yqpTYSAgshj_vjoaMs0GP8' });
  });
  it('parses custom YouTube videos and playlists', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=2ojMshIhLmw')).toEqual({ type: 'youtube-video', videoId: '2ojMshIhLmw' });
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=4v_vYiK2qeY&list=PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr' });
    expect(parseYouTubeUrl('https://example.com/video')).toBeNull();
  });
});
