import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  FolderArchive,
  Activity,
  ShieldCheck,
  Zap,
  Radio,
  HardDrive,
  Sparkles,
  ExternalLink,
  Github,
  PlayCircle
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureDeck } from './components/ArchitectureDeck';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { exportAndroidProjectZip } from './utils/zipExporter';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'code' | 'architecture' | 'benchmark'>('simulator');
  const [refreshRate, setRefreshRate] = useState<120 | 90 | 60>(120);
  const [domInjectionActive, setDomInjectionActive] = useState<boolean>(true);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleGlobalZipDownload = async () => {
    setIsDownloadingZip(true);
    try {
      const zipBlob = await exportAndroidProjectZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AppleMusicUltra-AndroidStudio-Project.zip';
      a.click();
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#07090e]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20">
            <span className="text-white text-lg font-bold">♪</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base sm:text-lg tracking-tight">
                Apple Music Ultra
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-medium">
                Target SDK 34+
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Principal Android Engineer Edition • Zero-Lag 120Hz WebView
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeView === 'simulator'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>120Hz Simulator</span>
          </button>

          <button
            onClick={() => setActiveView('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeView === 'code'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Android Codebase</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeView === 'architecture'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Architecture Deck</span>
          </button>

          <button
            onClick={() => setActiveView('benchmark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
              activeView === 'benchmark'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification (11/11)</span>
          </button>
        </nav>

        {/* 1-Click Android Studio Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGlobalZipDownload}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 active:scale-95 transition cursor-pointer"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Project (.ZIP)</span>
            <span className="sm:hidden">.ZIP</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Switcher */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-b border-slate-800 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('simulator')}
          className={`px-2 py-1 rounded-lg ${activeView === 'simulator' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveView('code')}
          className={`px-2 py-1 rounded-lg ${activeView === 'code' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          Source Code
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          className={`px-2 py-1 rounded-lg ${activeView === 'architecture' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          Architecture
        </button>
        <button
          onClick={() => setActiveView('benchmark')}
          className={`px-2 py-1 rounded-lg ${activeView === 'benchmark' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          Audits
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Metric Badges Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">VSYNC PACING</span>
              <span className="text-xs font-semibold text-white">120Hz (8.33ms Budget)</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">SCREEN-OFF AUDIO</span>
              <span className="text-xs font-semibold text-white">CPU &amp; WifiLock Held</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">CUSTOM CACHE</span>
              <span className="text-xs font-semibold text-white">1 GB Flash Storage</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">USER-AGENT</span>
              <span className="text-xs font-semibold text-white">Safari 17 iOS Native</span>
            </div>
          </div>
        </div>

        {/* View Switching */}
        {activeView === 'simulator' && (
          <div className="space-y-6">
            <PhoneSimulator
              refreshRate={refreshRate}
              onRefreshRateChange={setRefreshRate}
              domInjectionActive={domInjectionActive}
              onToggleDomInjection={() => setDomInjectionActive(!domInjectionActive)}
            />

            {/* Quick Source Preview & Architecture Below Simulator */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-base">Key Code Deliverables Preview</h3>
                <button
                  onClick={() => setActiveView('code')}
                  className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  View full code editor &rarr;
                </button>
              </div>
              <CodeViewer />
            </div>
          </div>
        )}

        {activeView === 'code' && (
          <div className="space-y-6">
            <CodeViewer />
            <ArchitectureDeck />
          </div>
        )}

        {activeView === 'architecture' && (
          <div className="space-y-6">
            <ArchitectureDeck />
            <BenchmarkSuite />
          </div>
        )}

        {activeView === 'benchmark' && (
          <div className="space-y-6">
            <BenchmarkSuite />
            <ArchitectureDeck />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] px-4 lg:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Apple Music Ultra Android APK Wrapper</span>
          <span>•</span>
          <span>Targeting SDK 34+ / Android 14</span>
          <span>•</span>
          <span>Kotlin 2.0</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Zero-Lag Architecture</span>
          <span>Hardware Accelerated</span>
          <span>1GB HttpResponseCache</span>
        </div>
      </footer>
    </div>
  );
}
