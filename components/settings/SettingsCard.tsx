"use client";

import { PlaylistSelector } from "../PlaylistSelector";
import { Music4 } from "lucide-react";

export default function SettingsCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
      <div className="grid gap-6">
        <section>
          <div className="flex items-center gap-2 text-neutral-300">
            <Music4 className="h-4 w-4 text-sky-300" />
            <h3 className="text-sm font-semibold tracking-wider">BACKGROUND MUSIC</h3>
          </div>
          <div className="mt-3">
            <PlaylistSelector />
          </div>
        </section>
      </div>
    </div>
  );
}
