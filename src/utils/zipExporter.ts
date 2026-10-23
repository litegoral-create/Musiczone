import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidFiles';

export async function exportAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root project files
  zip.file(
    'build.gradle.kts',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`
  );

  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AppleMusicUltra"
include(":app")
`
  );

  zip.file(
    'README.md',
    `# Apple Music Ultra Android APK • Principal Engineer Edition

A production-grade, zero-lag Android wrapper for the Apple Music Web Player (music.apple.com) targeting Android 14+ (SDK 34).

## Architecture Highlights
- **120Hz Smooth Frame Pacing**: Synchronized with \`Choreographer.getInstance().postFrameCallback()\` and display mode refresh rate locking (8.33ms render budget).
- **Uninterrupted Background Audio (Screen Off)**: Foreground service with \`FOREGROUND_SERVICE_MEDIA_PLAYBACK\`, holding a CPU \`PARTIAL_WAKE_LOCK\` and High-Perf \`WIFI_MODE_FULL_HIGH_PERF\` WifiLock.
- **1GB Custom HTTP Cache**: Installed via \`HttpResponseCache.install()\` at \`context.cacheDir\` with 1024 * 1024 * 1024 byte allocation.
- **Native iOS Safari User-Agent**: Impersonates Mobile Safari 17 on iPhone so Apple Music serves native touch layouts.
- **Dynamic DOM Injection**: Strips 'Open in App' upsell popups and adapts viewport padding.
- **iOS Elastic Bounce**: Custom \`BounceWebView\` implementing physics-based dampening and spring-back.

## How to Build in Android Studio
1. Open Android Studio (Hedgehog, Iguana, or newer).
2. Open this directory as an existing project.
3. Sync Gradle and run on a physical device with a 90Hz/120Hz display (e.g. Pixel 8/9, Galaxy S23/S24).
`
  );

  // Add each file in its proper folder
  for (const file of ANDROID_FILES) {
    zip.file(file.path, file.code);
  }

  // Add sample drawables
  zip.file(
    'app/src/main/res/drawable/bg_top_scrim.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:angle="270"
        android:startColor="#66000000"
        android:endColor="#00000000" />
</shape>`
  );

  zip.file(
    'app/src/main/res/drawable/ic_music_note.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFA243C"
        android:pathData="M12,3v10.55c-0.59,-0.34 -1.27,-0.55 -2,-0.55 -2.21,0 -4,1.79 -4,4s1.79,4 4,4 4,-1.79 4,-4V7h4V3h-6z"/>
</vector>`
  );

  zip.file(
    'app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Apple Music Ultra</string>
</resources>`
  );

  return await zip.generateAsync({ type: 'blob' });
}
