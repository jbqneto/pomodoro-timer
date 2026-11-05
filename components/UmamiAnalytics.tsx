import Script from 'next/script';

export function UmamiAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script
      src="https://umami.thedevlab.site/script.js"
      data-website-id="c959afae-19c2-446f-8520-2943b00d04ea"
      data-domains="focus.thedevlab.site"
      strategy="afterInteractive"
    />
  );
}
