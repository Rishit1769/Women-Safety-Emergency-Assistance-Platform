'use client';

import { useState } from 'react';

/**
 * DownloadApp — Floating bottom-right app download section.
 * Uses placeholder URLs for Android/iOS — replace with real store links when ready.
 */
export default function DownloadApp() {
  const [expanded, setExpanded] = useState(false);

  // Future: replace with real APK / App Store URLs
  const ANDROID_URL = '#android-coming-soon';
  const IOS_URL = '#ios-coming-soon';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Expandable panel */}
      {expanded && (
        <div className="mb-1 w-56 rounded-2xl border border-white/10 bg-[#0e1630]/90 backdrop-blur-xl shadow-2xl p-4 animate-slide-up">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
            Download Mobile App
          </p>

          {/* Android */}
          <a
            href={ANDROID_URL}
            aria-label="Download for Android"
            className="flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5 mb-2 group"
          >
            <AndroidIcon />
            <div>
              <p className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                Android APK
              </p>
              <p className="text-white/30 text-[10px]">Coming soon</p>
            </div>
          </a>

          {/* iOS */}
          <a
            href={IOS_URL}
            aria-label="Download for iOS"
            className="flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5 group"
          >
            <AppleIcon />
            <div>
              <p className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                App Store
              </p>
              <p className="text-white/30 text-[10px]">Coming soon</p>
            </div>
          </a>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Close app download' : 'Download mobile app'}
        className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all duration-200 px-4 py-2.5 shadow-lg active:scale-95"
      >
        <PhoneIcon />
        <span className="text-white/70 text-xs font-medium whitespace-nowrap">
          {expanded ? 'Close' : 'Download App'}
        </span>
      </button>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.523 15.341a.5.5 0 0 0-.5.5v3.5a.5.5 0 0 0 1 0v-3.5a.5.5 0 0 0-.5-.5zm-11 0a.5.5 0 0 0-.5.5v3.5a.5.5 0 0 0 1 0v-3.5a.5.5 0 0 0-.5-.5zM5 9h14v7.5A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5V9z"
        fill="#4CAF50"
      />
      <path
        d="M5 9h14V8a7 7 0 0 0-14 0v1zm2.5-6.232 1 1.732M16.5 2.768l-1 1.732"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12" r=".75" fill="white" />
      <circle cx="15" cy="12" r=".75" fill="white" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="white" fillOpacity="0.75">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
