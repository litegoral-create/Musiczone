import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FolderArchive,
  Search,
  FileCode2,
  FileText,
  ExternalLink,
  Sparkles,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANDROID_FILES, AndroidCodeFile } from '../data/androidFiles';
import { exportAndroidProjectZip } from '../utils/zipExporter';

export const CodeViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('manifest');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const currentFile: AndroidCodeFile =
    ANDROID_FILES.find((f) => f.id === selectedFileId) || ANDROID_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zipBlob = await exportAndroidProjectZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AppleMusicUltra-AndroidStudio-Project.zip';
      a.click();
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  const lines = currentFile.code.split('\n');
  const filteredLineIndices = searchQuery.trim()
    ? lines
        .map((line, idx) => (line.toLowerCase().includes(searchQuery.toLowerCase()) ? idx : -1))
        .filter((idx) => idx !== -1)
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header & File Navigation Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-white text-lg">Production Android Source Code</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono">
              SDK 34+ Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exhaustive, uncompromised Kotlin and XML architecture for immediate compilation in Android Studio.
          </p>
        </div>

        {/* Action Buttons: ZIP & Single download */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
          >
            <FolderArchive className="w-4 h-4" />
            {isZipping ? 'Packaging ZIP...' : 'Export Full Android Studio Project (.ZIP)'}
          </button>
        </div>
      </div>

      {/* File Tabs Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {ANDROID_FILES.map((file) => {
          const isSelected = file.id === selectedFileId;
          return (
            <button
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 text-white font-medium shadow-inner border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileCode2 className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
              <span>{file.filename}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {file.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* File Meta Header & Search */}
      <div className="bg-slate-900/60 px-4 py-3 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-slate-400">
          <span className="font-mono text-slate-200 font-semibold bg-black/40 px-2 py-0.5 rounded border border-white/5 w-fit">
            {currentFile.path}
          </span>
          <span className="text-slate-400 text-[11px] sm:text-xs">{currentFile.description}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Quick Search in code */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search in file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-black/50 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500 w-36 sm:w-44"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Download Single File */}
          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium cursor-pointer"
            title="Download this file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Editor / High-Fidelity Viewer */}
      <div className="relative bg-[#0d1117] overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs text-slate-200 p-4">
        <table className="leading-relaxed w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isMatch = filteredLineIndices.includes(idx);
              return (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isMatch ? 'bg-amber-500/15' : ''
                  }`}
                >
                  <td className="w-12 text-right pr-4 select-none text-slate-600 font-mono text-[11px] align-top">
                    {lineNum}
                  </td>
                  <td className="whitespace-pre overflow-x-auto text-slate-200 font-mono align-top">
                    {line}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
