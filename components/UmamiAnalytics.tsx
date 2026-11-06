"use client";
import Script from 'next/script';
import { flushPendingUmamiEvents } from '@/infrastructure/analytics/umami-product-analytics';

export function UmamiAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script
      src="https://umami.thedevlab.site/script.js"
      data-website-id="c959afae-19c2-446f-8520-2943b00d04ea"
      data-domains="focus.thedevlab.site"
      strategy="afterInteractive"
      onReady={flushPendingUmamiEvents}
    />
  );
}
