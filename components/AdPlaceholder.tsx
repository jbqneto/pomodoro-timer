"use client";

import { useLanguage } from "@/context/LanguageContext";

const AD_TOGGLE = process.env.NEXT_PUBLIC_TOGGLE_ADS === 'true';

export function AdPlaceholder() {
  const { t } = useLanguage();

  if (!AD_TOGGLE) return <></>
  
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
      <div className="bg-muted/50 rounded-xl p-8 border-2 border-dashed border-border">
        <div className="text-muted-foreground text-sm font-medium mb-2">
          {t('adPlaceholder')}
        </div>
        <div className="text-muted-foreground/60 text-xs mb-1">
          728 x 90
        </div>
        <div className="text-muted-foreground/40 text-xs">
          Google AdSense Integration Ready
        </div>
      </div>
    </div>
  );
}