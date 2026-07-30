import { describe, expect, it } from 'vitest';
import { getMusicOptions, getMusicSource } from '@/core/music/music.catalog';

describe('official music catalog', () => {
  it('contains each official option', () => expect(getMusicOptions().map(({ id }) => id)).toEqual(['silence', 'gregorian', 'classical', 'lofi']));
  it('maps silence without a YouTube source', () => expect(getMusicSource('silence')).toEqual({ type: 'silence' }));
  it('preserves official playlist IDs', () => {
    expect(getMusicSource('gregorian')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_zsw_JKMy_lEyXvvNENoEyr' });
    expect(getMusicSource('classical')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_ztab0cICj_wIqo1GHjtzDd' });
    expect(getMusicSource('lofi')).toEqual({ type: 'youtube-playlist', playlistId: 'PLgRDBI6ZEX_yqpTYSAgshj_vjoaMs0GP8' });
  });
});
