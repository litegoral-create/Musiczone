import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Battery,
  Wifi,
  Radio,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { IOS_SAFARI_USER_AGENT, calculateOverscrollOffset } from '../utils/androidConfig';

export interface PhoneSimulatorProps {
  refreshRate: 120 | 90 | 60;
  onRefreshRateChange: (rate: 120 | 90 | 60) => void;
  domInjectionActive: boolean;
  onToggleDomInjection: () => void;
}

const PLAYLIST = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    duration: '3:20'
  },
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: '2:47'
  },
  {
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    duration: '2:58'
  }
];

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  refreshRate,
  onRefreshRateChange,
  domInjectionActive,
  onToggleDomInjection
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isScreenOff, setIsScreenOff] = useState(false);
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38);
  const [cacheUsedMB, setCacheUsedMB] = useState(318);
  const [overscrollY, setOverscrollY] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Audio Context simulation for ambient audio feedback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Playback timer & progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
        // Simulate streaming segments being saved into 1GB cache
        setCacheUsedMB((prev) => (prev < 1024 ? prev + 0.05 : prev));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isPlaying) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        // Subtle synthesized sound pulse to confirm real audio pipeline
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.5);
      } catch (e) {
        // Safe fallback
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    setCacheUsedMB((prev) => Math.min(1024, prev + 8));
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  // iOS-style elastic bounce gesture handlers
  const handleTouchStart = (clientY: number) => {
    setTouchStartY(clientY);
  };

  const handleTouchMove = (clientY: number) => {
    if (touchStartY === null) return;
    const deltaY = clientY - touchStartY;
    setOverscrollY((prev) => calculateOverscrollOffset(deltaY * 0.4, prev, 180));
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    // Smooth spring return to zero
    setOverscrollY(0);
  };

  const frameTimeBudget = (1000 / refreshRate).toFixed(2);

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 py-4">
      {/* Phone Hardware Shell */}
      <div className="relative">
        {/* Glow ambient background */}
        <div
          className={`absolute -inset-6 rounded-[52px] blur-2xl transition-all duration-700 opacity-40 ${
            isPlaying ? 'bg-gradient-to-r from-red-600 via-pink-600 to-rose-700' : 'bg-slate-800'
          }`}
        />

        {/* Chassis Frame */}
        <div className="relative w-[360px] sm:w-[380px] h-[760px] bg-[#0a0a0c] rounded-[50px] p-3 shadow-2xl border-[4px] border-slate-700/80 flex flex-col ring-1 ring-white/10 select-none">
          {/* Hardware buttons on frame */}
          <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-600 rounded-l-md" />
          <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-slate-600 rounded-l-md" />
          <div className="absolute -left-[7px] top-58 w-[3px] h-12 bg-slate-600 rounded-l-md" />
          <div
            onClick={() => setIsScreenOff(!isScreenOff)}
            title="Toggle Device Screen Power"
            className="absolute -right-[7px] top-36 w-[3px] h-16 bg-red-500 hover:bg-red-400 active:scale-95 cursor-pointer rounded-r-md transition-colors"
          />

          {/* Screen Display Area */}
          <div className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex flex-col border border-white/5">
            {/* Top Island / Camera notch */}
            <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-2 pb-1 text-xs text-white/90">
              <span className="font-semibold text-xs tracking-tight">9:41</span>
              {/* Dynamic Island pill */}
              <div
                onClick={() => setShowNotificationShade(!showNotificationShade)}
                className={`cursor-pointer transition-all duration-300 flex items-center gap-2 px-3 py-1 rounded-full bg-black/90 border border-white/15 shadow-lg ${
                  isPlaying ? 'w-32 justify-between' : 'w-20 justify-center'
                }`}
              >
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] text-red-400 font-mono truncate max-w-[60px]">
                      {currentTrack.title}
                    </span>
                    <div className="flex gap-0.5 items-end h-2.5">
                      <span className="w-0.5 bg-red-400 animate-pulse h-3" />
                      <span className="w-0.5 bg-red-400 animate-pulse delay-75 h-2" />
                      <span className="w-0.5 bg-red-400 animate-pulse delay-150 h-3.5" />
                    </div>
                  </>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-red-950/70 border border-red-500/30 text-red-400">
                  {refreshRate}Hz
                </span>
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* SCREEN OFF / AMOLED BLACKOUT OVERLAY */}
            {isScreenOff ? (
              <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-between p-6 text-center text-white select-none">
                <div className="pt-16">
                  <span className="text-4xl font-light tracking-tighter text-white/80">09:41</span>
                  <p className="text-xs text-white/40 mt-1">Wednesday, October 21</p>
                </div>

                {/* WakeLock Active Indicator */}
                <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-red-500/40 rounded-2xl p-4 shadow-xl text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-white tracking-wide">
                        MusicPlaybackService Active
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">
                      DISPLAY OFF
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                    Android 14 Media Service is holding <span className="text-emerald-400 font-mono">CPU WakeLock</span> &amp; <span className="text-cyan-400 font-mono">WifiLock</span>. WebView timers are running with zero throttling.
                  </p>

                  <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentTrack.cover}
                        alt="cover"
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="text-xs font-medium text-white truncate max-w-[140px]">
                          {currentTrack.title}
                        </div>
                        <div className="text-[10px] text-white/50">{currentTrack.artist}</div>
                      </div>
                    </div>
                    <button
                      onClick={togglePlay}
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition"
                      aria-label={isPlaying ? "Pause music in background" : "Play music in background"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>
                </div>

                <div className="pb-4">
                  <button
                    onClick={() => setIsScreenOff(false)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white/90 border border-white/10 transition"
                  >
                    Tap or Click Side Button to Wake Screen
                  </button>
                </div>
              </div>
            ) : null}

            {/* NOTIFICATION SHADE OVERLAY */}
            {showNotificationShade && !isScreenOff && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold text-white/80">Notification Shade</span>
                  <button
                    onClick={() => setShowNotificationShade(false)}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Android 14 MediaStyle Notification */}
                <div className="mt-4 bg-slate-900/95 border border-red-500/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between text-[11px] text-white/60 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">
                        ♪
                      </div>
                      <span className="font-medium text-white">Apple Music Ultra</span>
                      <span>•</span>
                      <span>120Hz Foreground</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">STICKY</span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <img
                      src={currentTrack.cover}
                      alt="album"
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                      <p className="text-xs text-white/60 truncate">{currentTrack.artist}</p>
                      <p className="text-[10px] text-red-400 truncate mt-0.5">{currentTrack.album} • 120Hz</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Notification Media Controls */}
                  <div className="flex items-center justify-around pt-2">
                    <button
                      onClick={handlePrev}
                      className="text-white/80 hover:text-white p-1"
                      aria-label="Previous track"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg"
                      aria-label={isPlaying ? "Pause notification playback" : "Play notification playback"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <button
                      onClick={handleNext}
                      className="text-white/80 hover:text-white p-1"
                      aria-label="Next track"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/50 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Cpu className="w-3 h-3" /> WAKE_LOCK HELD
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Wifi className="w-3 h-3" /> FULL_HIGH_PERF
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATED WEBVIEW CONTENT (Elastic iOS Bounce on drag) */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar pt-10 pb-6 px-4 flex flex-col justify-between transition-transform duration-100 cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateY(${overscrollY}px)`,
                transition: touchStartY === null ? 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
              }}
              onMouseDown={(e) => handleTouchStart(e.clientY)}
              onMouseMove={(e) => touchStartY !== null && handleTouchMove(e.clientY)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onTouchStart={(e) => handleTouchStart(e.touches[0].clientY)}
              onTouchMove={(e) => handleTouchMove(e.touches[0].clientY)}
              onTouchEnd={handleTouchEnd}
            >
              {/* Optional Web Banner (shows when DOM injection is OFF) */}
              {!domInjectionActive && (
                <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Open in the Apple Music app</span>
                  </div>
                  <button className="px-2 py-0.5 rounded bg-amber-500 text-black font-semibold text-[10px]">
                    OPEN
                  </button>
                </div>
              )}

              {/* Apple Music Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">♪</span>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-tight">Apple Music</h2>
                      <span className="text-[10px] text-white/50">Listen Now • Web Player</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-red-400">120Hz VSync</span>
                  </div>
                </div>

                {/* Hero Album Artwork */}
                <div className="relative group w-full aspect-square max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 my-2">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.album}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Spatial Audio Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-medium text-white/90">
                    Spatial Audio • Lossless
                  </div>

                  {/* 1GB Cache hit indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    Cached (0ms)
                  </div>
                </div>

                {/* Track Title and Artist */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-white truncate px-2">{currentTrack.title}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{currentTrack.artist}</p>
                </div>

                {/* Scrubber Bar */}
                <div className="mt-5 px-2">
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                      setProgress(percentage);
                    }}
                    className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden cursor-pointer relative group"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 group-hover:from-red-500 group-hover:to-rose-300 transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                    <span>1:12</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="my-2">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={handlePrev}
                    className="text-white/70 hover:text-white transition active:scale-90 p-2"
                    aria-label="Previous Song"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30 transition active:scale-95 ring-2 ring-red-400/30"
                    aria-label={isPlaying ? "Pause Song" : "Play Song"}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>

                  <button
                    onClick={handleNext}
                    className="text-white/70 hover:text-white transition active:scale-90 p-2"
                    aria-label="Next Song"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2 px-4 mt-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white/50 hover:text-white text-xs"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-full accent-red-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                    aria-label="Volume slider"
                  />
                </div>
              </div>

              {/* Bottom iOS Home Indicator */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="w-28 h-1 bg-white/40 rounded-full" />
                <span className="text-[9px] text-white/30 font-mono tracking-tight">
                  Drag up/down for iOS Bounce
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Control & Telemetry Panel */}
      <div className="w-full max-w-xl space-y-4">
        {/* Quick Simulator Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-white text-base">Live Android APK Simulator</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              SDK 34 (Android 14)
            </span>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {/* Display Refresh Rate Selector */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Frame Pacing Rate
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[120, 90, 60].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onRefreshRateChange(rate as any)}
                    className={`py-1 text-xs font-mono font-medium rounded-lg transition ${
                      refreshRate === rate
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}Hz
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                Budget: {frameTimeBudget}ms / frame
              </span>
            </div>

            {/* Screen Power Toggle (Background Audio Test) */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Screen Power (Sleep)
              </label>
              <button
                onClick={() => setIsScreenOff(!isScreenOff)}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  isScreenOff
                    ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isScreenOff ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isScreenOff ? 'Display Sleeping' : 'Turn Display Off'}
              </button>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono truncate">
                {isScreenOff ? 'WakeLock active' : 'Simulates screen-off'}
              </span>
            </div>

            {/* Injected DOM Script Toggle */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                DOM CSS/JS Injection
              </label>
              <button
                onClick={onToggleDomInjection}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  domInjectionActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-amber-600/30 border border-amber-500/40 text-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {domInjectionActive ? 'Injected (iOS)' : 'Default Web'}
              </button>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono truncate">
                {domInjectionActive ? 'Banners hidden' : 'Showing banners'}
              </span>
            </div>
          </div>

          {/* Real-Time Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800">
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">HTTP Disk Cache</span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                {cacheUsedMB.toFixed(1)} / 1024 MB
              </span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(cacheUsedMB / 1024) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">CPU WakeLock</span>
              <span className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                PARTIAL_LOCK
              </span>
              <span className="text-[9px] text-slate-500 block mt-1">Screen-off hold</span>
            </div>

            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">Wi-Fi Radio Lock</span>
              <span className="text-xs font-semibold text-amber-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                FULL_HIGH_PERF
              </span>
              <span className="text-[9px] text-slate-500 block mt-1">0 packet drop</span>
            </div>

            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">Choreographer</span>
              <span className="text-xs font-semibold text-purple-400 font-mono">
                VSync Locked
              </span>
              <span className="text-[9px] text-slate-500 block mt-1">{refreshRate} fps target</span>
            </div>
          </div>
        </div>

        {/* User Agent & Injection Callout */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">Active Mobile User-Agent Impersonation:</span>
            <span className="text-[10px] text-red-400 font-mono">Safari 17 / iPhone</span>
          </div>
          <p className="font-mono text-[11px] text-slate-400 bg-black/60 p-2.5 rounded-lg border border-white/5 break-all">
            {IOS_SAFARI_USER_AGENT}
          </p>
        </div>
      </div>
    </div>
  );
};
