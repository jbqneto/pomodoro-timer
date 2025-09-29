"use client";

import { useConfig } from "@/context/ConfigContext";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export default function SettingsDialog({ open, onClose }: Props) {
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume, autoPlay:autoPlayMusic, setAutoPlay:setAutoPlayMusic } = useConfig();

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Configurações</h2>

        <div className="space-y-5">
          <label className="flex items-center justify-between gap-4">
            <span>🔔 Alarm</span>
            <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
          </label>

          <div className={`${soundEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
            <label className="mb-1 block text-sm text-neutral-300">Volume</label>
            <input
              type="range"
              min={0}
              max={100}
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="h-1 w-full appearance-none rounded bg-white/10 accent-sky-400"
            />
          </div>

          <label className="flex items-center justify-between gap-4">
            <span>🎵 Start music with timer</span>
            <input type="checkbox" checked={autoPlayMusic} onChange={(e) => setAutoPlayMusic(e.target.checked)} />
          </label>
        </div>

        <button className="mt-6 w-full rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-400" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
