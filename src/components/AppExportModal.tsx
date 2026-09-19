import React, { useState } from 'react';
import { X, Download, Smartphone, Terminal, CheckCircle2 } from 'lucide-react';
import { generateProjectZip } from '../utils/zipGenerator';

interface AppExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppExportModal: React.FC<AppExportModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      // Generate zip using in-browser generator
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'circular-arena-fighter-app.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error('ZIP generation error', e);
      // Fallback: direct link to static zip if generated
      window.location.href = '/circular-arena-fighter-game.zip';
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold">Export Game & Build Mobile App</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Download Button */}
        <div className="p-4 bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/40 rounded-xl mb-5 text-center">
          <p className="text-sm font-semibold text-slate-200 mb-3">
            Download the complete standalone project source code ZIP (all sounds, images, code & guides included):
          </p>
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>ZIP Download Started!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Preparing ZIP...' : 'Download Game ZIP File'}</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Simple Steps to Build Android APK */}
        <div className="space-y-3 text-xs text-slate-300">
          <p className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            How to Build Android APK (Capacitor Guide):
          </p>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] leading-relaxed">
            <span className="text-slate-500"># 1. Unzip the downloaded file and install dependencies:</span>
            <br />
            <span className="text-emerald-400">npm install</span>
            <br /><br />
            <span className="text-slate-500"># 2. Build the production web bundle:</span>
            <br />
            <span className="text-emerald-400">npm run build</span>
            <br /><br />
            <span className="text-slate-500"># 3. Add Android Capacitor package:</span>
            <br />
            <span className="text-emerald-400">npm install @capacitor/android</span>
            <br />
            <span className="text-emerald-400">npx cap add android</span>
            <br /><br />
            <span className="text-slate-500"># 4. Open in Android Studio & click &quot;Build APK&quot;:</span>
            <br />
            <span className="text-emerald-400">npx cap open android</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <p className="font-semibold text-slate-200">📱 Why this works seamlessly as an app:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>All sound effects are synthesized offline via Web Audio API (0MB audio download, zero latency).</li>
              <li>High-resolution character vector portraits are embedded directly.</li>
              <li>Touch responsive virtual joystick & responsive circular arena layout.</li>
            </ul>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
