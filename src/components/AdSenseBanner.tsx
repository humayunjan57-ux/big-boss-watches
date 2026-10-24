import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSenseBannerProps {
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const insElement = adRef.current;
    if (!insElement) return;

    // Prevent duplicate push if already initialized by AdSense or React StrictMode
    if (insElement.getAttribute('data-adsbygoogle-status')) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Safely ignore if blocked by client adblocker or already queued
    }
  }, []);

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 overflow-hidden ${className}`}>
      {/* BIG BOSS WATCHES */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3966286490143165"
        data-ad-slot="9021655991"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
