"use client";

import { useState } from 'react';

export function YouTubePlayer() {
  const [currentPlaylist, setCurrentPlaylist] = useState<'lofi' | 'classical'>('lofi');
  
  // YouTube playlist IDs for lo-fi and classical music
  const playlists = {
    lofi: 'PLOHoVaTp8R7eQ0KbK2nvClIQHhz6Kjq6M', // Lo-fi study playlist
    classical: 'PLcGrPBXgGlCF3d3nP_s6JNDUj2RiVpnLD' // Classical study playlist
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/videoseries?list=${playlists[currentPlaylist]}&autoplay=1&mute=1&loop=1`}
          title="Background Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      
      {/* Playlist switcher - hidden for cleaner design, controlled by PlaylistSelector */}
    </div>
  );
}