import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Fighter } from '../types';
import { RotateCcw, Award } from 'lucide-react';

interface WinnerModalProps {
  winner: Fighter | null;
  onRestart: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onRestart }) => {
  useEffect(() => {
    if (winner) {
      // Fire celebratory confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-slate-950/95 border-2 border-red-500/90 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_35px_rgba(239,68,68,0.4)]">
        {/* Glow accent */}
        <div className="flex justify-center mb-3 text-amber-400">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        {/* Subtitle */}
        <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-1">
          WINNER
        </p>

        {/* Winner Name in Big Bold Typography (Exact to video) */}
        <h2 className="text-2xl sm:text-3xl font-black text-red-500 uppercase tracking-tight my-2 drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]">
          {winner.name}
        </h2>

        {/* Status */}
        <p className="text-slate-300 font-extrabold text-sm tracking-widest uppercase mb-6">
          WINS
        </p>

        {/* Start Next Fight button */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm tracking-wide"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Press START for next fight</span>
        </button>
      </div>
    </div>
  );
};
