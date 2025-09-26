// components/YouTubeConsentPlayer.tsx
"use client";
import { useConfig } from "@/context/ConfigContext";
import { useState, useEffect } from "react";

export default function YouTubeConsentPlayer() {
  const [consented, setConsented] = useState(false);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const { activePlaylist, getPlaylistId } = useConfig();
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your CMP read (e.g., window.__tcfapi or CMP SDK)
    const consent = localStorage.getItem("consent_ads_media") === "granted";
    setConsented(consent);
  }, []);

  useEffect(() => {
    console.log("Active playlist changed:", activePlaylist);
    if (!activePlaylist) {
      setReadyToLoad(false);
    } else {
      setReadyToLoad(true);
      setPlaylistId(getPlaylistId(activePlaylist));
    }
  }, [activePlaylist]);

  return (
    <div className="w-full max-w-2xl">
      {!consented ? (
        <div className="rounded-xl border p-4 text-sm bg-neutral-900 text-neutral-100">
    <p className="mb-3">
      This embedded playlist is hosted on YouTube. To play it, please grant media/ads consent.
    </p>

    <div className="flex flex-col items-start gap-2">
      <button
        className="btn w-full sm:w-auto btn-primary"
        onClick={() => {
          localStorage.setItem("consent_ads_media", "granted");
          setConsented(true);
        }}
      >
        Grant consent & play
      </button>

      <button
        className="btn-outline w-full sm:w-auto text-sm"
        onClick={() => localStorage.setItem("consent_ads_media", "denied")}
      >
        Continue without media
      </button>
    </div>
  </div>
      ) : readyToLoad && (
        <div
          className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800"
        >
          <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0`}
              title="Focus playlist"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
        </div>
      )}
    </div>
  );
}
