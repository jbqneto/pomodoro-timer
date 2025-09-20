"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Timer } from "@/components/Timer";
import { Controls } from "@/components/Controls";
import { PresetSelector } from "@/components/PresetSelector";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { TimerProvider } from "@/context/TimerContext";

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TimerProvider>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-2xl mx-auto">
                {/* Header with Theme Toggle */}
                <div className="flex justify-between items-start mb-12">
                  <div className="text-center flex-1">
                    <h1 className="text-3xl font-light text-foreground mb-2 tracking-wide">
                      Pomodoro Timer
                    </h1>
                    <p className="text-muted-foreground text-base font-light">
                      Técnica de Foco • Focus Technique
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Main Timer Card */}
                <div className="bg-card rounded-2xl p-12 mb-8 shadow-sm border border-border">
                  <Timer />
                  
                  <div className="mt-12">
                    <Controls />
                  </div>
                </div>

                {/* Settings Section */}
                <div className="bg-card rounded-2xl p-8 mb-8 shadow-sm border border-border">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                        Timer Presets
                      </h3>
                      <PresetSelector />
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                        Background Music
                      </h3>
                      <PlaylistSelector />
                    </div>
                  </div>
                </div>

                {/* YouTube Player */}
                <div className="mb-8">
                  <YouTubePlayer />
                </div>

                {/* Ad Placeholder */}
                <AdPlaceholder />
              </div>
            </div>
            
            <Footer />
          </div>
        </TimerProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}