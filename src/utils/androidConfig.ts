/**
 * Android Performance & Configuration Utilities
 * Pure logic helpers for 120Hz frame budgets, 1GB HTTP Cache quotas,
 * Android 14 (API 34) permissions, and iOS DOM injection rules.
 */

export interface CacheQuotaInfo {
  maxSizeBytes: number;
  maxSizeMB: number;
  maxSizeGB: number;
  formattedQuota: string;
}

export function computeCacheQuota(bytes: number = 1024 * 1024 * 1024): CacheQuotaInfo {
  const mb = bytes / (1024 * 1024);
  const gb = bytes / (1024 * 1024 * 1024);
  return {
    maxSizeBytes: bytes,
    maxSizeMB: Math.round(mb),
    maxSizeGB: Number(gb.toFixed(2)),
    formattedQuota: `${gb.toFixed(0)} GB (${Math.round(mb)} MB)`
  };
}

export function getFrameBudget(refreshRate: 60 | 90 | 120 | 144): { frameBudgetMs: number; vsyncIntervalNs: number } {
  const frameBudgetMs = Number((1000 / refreshRate).toFixed(3));
  const vsyncIntervalNs = Math.round((1_000_000_000 / refreshRate));
  return { frameBudgetMs, vsyncIntervalNs };
}

export const IOS_SAFARI_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export function isSafariMobileUA(ua: string): boolean {
  return ua.includes('iPhone') && ua.includes('Safari') && ua.includes('Version/17');
}

export const REQUIRED_ANDROID_34_PERMISSIONS = [
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.WAKE_LOCK',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.POST_NOTIFICATIONS'
];

export function validateRequiredPermissions(manifestXml: string): { missing: string[]; allPresent: boolean } {
  const missing = REQUIRED_ANDROID_34_PERMISSIONS.filter(
    (perm) => !manifestXml.includes(perm)
  );
  return {
    missing,
    allPresent: missing.length === 0
  };
}

/**
 * Generates the minified CSS payload injected into Apple Music DOM onPageFinished
 */
export function generateInjectedCss(): string {
  return `
    /* Hide Apple Music web-only marketing popups, headers, & 'Open in App' smart banners */
    .smart-banner,
    .open-in-app,
    [data-testid="upsell-banner"],
    [data-testid="open-in-apple-music"],
    .web-navigation__auth,
    .locale-switcher-bar,
    .app-banner-overlay,
    aside[aria-label*="Open in"],
    aside[aria-label*="Download"],
    .inline-upsell,
    .web-chrome-header__actions > button[data-testid*="native"] {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    /* Edge-to-edge viewport padding and native touch scroll optimization */
    html, body {
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
      overscroll-behavior-y: none !important;
      padding-top: env(safe-area-inset-top, 0px) !important;
      padding-bottom: env(safe-area-inset-bottom, 16px) !important;
      background-color: #000000 !important;
    }

    /* Fast 120Hz smooth scrolling */
    * {
      -webkit-tap-highlight-color: transparent !important;
    }
  `.trim();
}

/**
 * Pure elastic bounce physics calculation for simulated iOS overscroll
 */
export function calculateOverscrollOffset(deltaY: number, currentOffset: number, maxResistance: number = 220): number {
  if (deltaY === 0) return currentOffset;
  // Logarithmic damping curve
  const resistance = 0.55 * (1 - Math.min(Math.abs(currentOffset) / maxResistance, 0.85));
  return currentOffset + deltaY * resistance;
}
