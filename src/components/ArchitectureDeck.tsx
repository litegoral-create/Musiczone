import React, { useState } from 'react';
import {
  Zap,
  Radio,
  HardDrive,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
  Smartphone
} from 'lucide-react';

export const ArchitectureDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'120hz' | 'background' | 'cache' | 'ios-ui'>('120hz');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-white text-lg">Principal Android Architecture Deck</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive performance rationale, Android 14 API 34 constraints, and system-level guarantees.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('120hz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeTab === '120hz'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>120Hz & Frame Pacing</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeTab === 'background'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Background Audio & WakeLocks</span>
          </button>

          <button
            onClick={() => setActiveTab('cache')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeTab === 'cache'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>1GB Custom Cache</span>
          </button>

          <button
            onClick={() => setActiveTab('ios-ui')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeTab === 'ios-ui'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>iOS UI & Safari UA</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 120Hz & Frame Pacing */}
      {activeTab === '120hz' && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                120Hz Frame Budget
              </span>
              <div className="text-2xl font-bold text-red-400 font-mono mt-1">8.333 ms</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Compared to standard 60Hz (16.67ms), 120Hz doubles the VSync frequency. If a single frame exceeds 8.33ms, micro-stutters occur.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Display Mode Lock
              </span>
              <div className="text-2xl font-bold text-purple-400 font-mono mt-1">preferredDisplayModeId</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Iterates <code className="text-red-300">display.supportedModes</code> and pins the Window to 120Hz to prevent dynamic LTPO downclocking while browsing.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Choreographer Loop
              </span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">postFrameCallback</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hooks directly into Android’s hardware display vsync pulse. Synchronizes WebView layer invalidation with GPU compositing ticks.
              </p>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
            <div className="text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
              <Terminal className="w-4 h-4 text-red-500" />
              <span>Choreographer & WebSettings Optimization Implementation</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`// 1. Hardware acceleration enabled on WebView instance
webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

// 2. High Render Priority & WebSettings
settings.javaScriptEnabled = true
settings.domStorageEnabled = true
settings.databaseEnabled = true
@Suppress("DEPRECATION")
settings.setRenderPriority(WebSettings.RenderPriority.HIGH)

// 3. Hardware Choreographer synchronization loop
override fun doFrame(frameTimeNanos: Long) {
    if (webView.isAttachedToWindow && webView.visibility == View.VISIBLE) {
        webView.postInvalidateOnAnimation()
    }
    choreographer.postFrameCallback(this)
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Background Audio & WakeLocks */}
      {activeTab === 'background' && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Android 14 API 34 Policy
              </span>
              <div className="text-base font-bold text-red-400 font-mono mt-1">
                foregroundServiceType="mediaPlayback"
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Android 14 strictly kills foreground services that do not declare explicit types in Manifest and pass them during <code className="text-red-300">startForeground()</code>.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                CPU Partial WakeLock
              </span>
              <div className="text-base font-bold text-cyan-400 font-mono mt-1">
                PowerManager.PARTIAL_WAKE_LOCK
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Keeps the CPU running at minimum frequency when the display goes dark, preventing the audio decoder thread from sleeping.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                High-Performance WifiLock
              </span>
              <div className="text-base font-bold text-amber-400 font-mono mt-1">
                WIFI_MODE_FULL_HIGH_PERF
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Android power management aggressively lowers Wi-Fi radio power when screen is off. The high-performance lock prevents streaming buffer underruns.
              </p>
            </div>
          </div>

          <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-red-300 font-semibold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Critical Architectural Insight: Why webView.onPause() is NEVER Called</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Android templates call <code className="text-red-400">webView.onPause()</code> and <code className="text-red-400">webView.pauseTimers()</code> inside the Activity lifecycle. Doing so halts Chromium’s V8 event loop and pauses HTML5 audio playback immediately when the user turns off the screen or switches apps.
              In <code className="text-red-300">MainActivity.kt</code>, we explicitly call <code className="text-emerald-400 font-mono">webView.resumeTimers()</code> in both <code className="text-slate-200">onPause()</code> and <code className="text-slate-200">onStop()</code>, delegating process survival to <code className="text-slate-200">PlaybackService</code>.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: 1GB Custom Cache */}
      {activeTab === 'cache' && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Cache Pool Quota
              </span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">1,073,741,824 B</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Exactly 1024 * 1024 * 1024 bytes (1 GB) dedicated to HTTP response caching on persistent flash storage.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Installation Target
              </span>
              <div className="text-base font-bold text-slate-200 font-mono mt-1">
                context.cacheDir/http_apple_music_cache
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Installed via <code className="text-emerald-300">HttpResponseCache.install()</code>, intercepted by the WebView’s internal network stack.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Cached Assets
              </span>
              <div className="text-base font-bold text-cyan-400 font-mono mt-1">
                HLS Audio &amp; Hi-Res Artwork
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Album covers from mzstatic.com, Apple Music JS bundles, and streaming segments load in 0ms on repeat sessions.
              </p>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
            <div className="text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>1GB Cache Initialization &amp; Lifecycle Code</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`val httpCacheDir = File(cacheDir, "http_apple_music_cache")
val HTTP_CACHE_SIZE_BYTES = 1024L * 1024L * 1024L // 1 GB

if (HttpResponseCache.getInstalled() == null) {
    HttpResponseCache.install(httpCacheDir, HTTP_CACHE_SIZE_BYTES)
    Log.i(TAG, "Installed 1GB HTTP Cache at: \${httpCacheDir.absolutePath}")
}

// In onStop() and onDestroy(), flush pending cache writes
HttpResponseCache.getInstalled()?.flush()`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: iOS UI & Safari UA */}
      {activeTab === 'ios-ui' && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Window Insets Controller (Edge-to-Edge)
              </span>
              <div className="text-sm font-bold text-red-400 font-mono mt-1">
                BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hides Android navigation and status bars completely. Transient bars only appear on swipe and auto-hide without shifting the layout viewport.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
                Safari Mobile User-Agent Impersonation
              </span>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-1 truncate">
                Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tricks Apple Music servers into returning their touch-optimized iOS layout rather than desktop or generic Android browser shells.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-white mb-2">
              Injected CSS Dynamic Rules (onPageFinished):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-red-400 font-mono font-semibold block mb-1">
                  1. Strips Upsells &amp; Banners
                </span>
                <span className="text-slate-400 text-[11px]">
                  Hides <code className="text-slate-300">.open-in-app</code>, <code className="text-slate-300">[data-testid="upsell-banner"]</code>, and marketing headers so users never get prompted to install the native app.
                </span>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-red-400 font-mono font-semibold block mb-1">
                  2. iOS Touch &amp; Safe Area Insets
                </span>
                <span className="text-slate-400 text-[11px]">
                  Applies <code className="text-slate-300">-webkit-touch-callout: none</code> and <code className="text-slate-300">env(safe-area-inset-bottom)</code> padding to match iPhone bezels seamlessly.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
