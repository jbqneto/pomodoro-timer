"use client";

import { PlaylistSelector } from "../PlaylistSelector";
import { PresetSelector } from "../PresetSelector";

export default function SettingsCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
      <div className="grid gap-6">
        <section>
          <h3 className="text-sm font-semibold tracking-wider text-neutral-300">TIMER PRESETS</h3>
          <div className="mt-3">
            <PresetSelector />
          </div>
        </section>

        <hr className="border-white/10" />

        <section>
          <h3 className="text-sm font-semibold tracking-wider text-neutral-300">BACKGROUND MUSIC</h3>
          <div className="mt-3">
            <PlaylistSelector />
          </div>
        </section>
      </div>
    </div>
  );
}
