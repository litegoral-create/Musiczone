import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCacheQuota,
  getFrameBudget,
  isSafariMobileUA,
  validateRequiredPermissions,
  generateInjectedCss,
  calculateOverscrollOffset,
  IOS_SAFARI_USER_AGENT
} from './androidConfig.ts';

test('computeCacheQuota computes 1GB accurately', () => {
  const quota = computeCacheQuota(1024 * 1024 * 1024);
  assert.equal(quota.maxSizeBytes, 1073741824);
  assert.equal(quota.maxSizeMB, 1024);
  assert.equal(quota.maxSizeGB, 1);
  assert.equal(quota.formattedQuota, '1 GB (1024 MB)');
});

test('getFrameBudget matches 120Hz display refresh time (8.333ms)', () => {
  const budget120 = getFrameBudget(120);
  assert.equal(budget120.frameBudgetMs, 8.333);
  assert.equal(budget120.vsyncIntervalNs, 8333333);

  const budget90 = getFrameBudget(90);
  assert.equal(budget90.frameBudgetMs, 11.111);
});

test('isSafariMobileUA identifies the iPhone Safari 17 user agent', () => {
  assert.equal(isSafariMobileUA(IOS_SAFARI_USER_AGENT), true);
  assert.equal(isSafariMobileUA('Mozilla/5.0 (Linux; Android 14; Pixel 8)'), false);
});

test('validateRequiredPermissions identifies presence and omissions in Manifest', () => {
  const sampleManifest = `
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
      <uses-permission android:name="android.permission.INTERNET" />
      <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
      <uses-permission android:name="android.permission.WAKE_LOCK" />
      <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
      <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
      <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    </manifest>
  `;
  const result = validateRequiredPermissions(sampleManifest);
  assert.equal(result.allPresent, true);
  assert.equal(result.missing.length, 0);

  const brokenManifest = `<manifest><uses-permission android:name="android.permission.INTERNET" /></manifest>`;
  const brokenResult = validateRequiredPermissions(brokenManifest);
  assert.equal(brokenResult.allPresent, false);
  assert.ok(brokenResult.missing.includes('android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'));
});

test('generateInjectedCss targets open-in-app banners and removes tap delay', () => {
  const css = generateInjectedCss();
  assert.ok(css.includes('open-in-app'));
  assert.ok(css.includes('-webkit-tap-highlight-color'));
  assert.ok(css.includes('overscroll-behavior-y: none'));
});

test('calculateOverscrollOffset applies realistic elastic resistance', () => {
  const initialOffset = 0;
  const dragged = calculateOverscrollOffset(20, initialOffset);
  assert.ok(dragged > 0 && dragged < 20); // Damped

  const highOffset = 200;
  const furtherDrag = calculateOverscrollOffset(20, highOffset);
  assert.ok(furtherDrag - highOffset < dragged); // Higher resistance when stretched
});
