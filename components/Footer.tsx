"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Language switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 bg-muted rounded-full p-1">
            <Button
              onClick={() => setLanguage('en')}
              size="sm"
              variant={language === 'en' ? 'default' : 'ghost'}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all focus-ring ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:bg-background/50'
              }`}
            >
              <Globe className="w-3 h-3 mr-1" />
              EN
            </Button>
            
            <Button
              onClick={() => setLanguage('pt')}
              size="sm"
              variant={language === 'pt' ? 'default' : 'ghost'}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all focus-ring ${
                language === 'pt'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:bg-background/50'
              }`}
            >
              <Globe className="w-3 h-3 mr-1" />
              PT
            </Button>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="text-center text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
          {t('disclaimer')}
        </div>
        
        <div className="text-center text-muted-foreground/60 text-xs mt-6">
          © 2025 Pomodoro Timer App
        </div>
      </div>
    </footer>
  );
}