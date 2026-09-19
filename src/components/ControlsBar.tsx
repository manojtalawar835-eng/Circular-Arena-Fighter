import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Users, Download, Sparkles, MessageSquare } from 'lucide-react';
import { GameMode } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface ControlsBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  gameSpeed: number;
  onChangeSpeed: (speed: number) => void;
  gameMode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCharacterSelect: () => void;
  onOpenAppExport: () => void;
  onRandomMemeSound: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  gameSpeed,
  onChangeSpeed,
  gameMode,
  onChangeMode,
  isMuted,
  onToggleMute,
  onOpenCharacterSelect,
  onOpenAppExport,
  onRandomMemeSound
}) => {
  return (
    <footer className="w-full max-w-[540px] mx-auto px-4 pb-4 pt-1 select-none space-y-2">
      {/* Primary Action Controls Row */}
      <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/90 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-xl">
        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title={isPlaying ? 'Pause Fight' : 'Start Fight'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'START'}</span>
        </button>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
          title="Restart Battle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Speed Toggles (1x, 1.5x, 2x) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          {[1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeed(spd)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                gameSpeed === spd
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Meme Audio Shout Trigger */}
        <button
          onClick={onRandomMemeSound}
          className="flex items-center gap-1 px-2.5 py-2 bg-rose-950/60 border border-rose-600/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          title="Play viral meme voice clip"
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Meme Voice</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-950/80 text-red-400 border border-red-800'
              : 'bg-slate-800 text-slate-200 hover:text-white'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Secondary Bar: Mode Switcher & Modals */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Mode Selector */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-[11px] font-medium">
          <button
            onClick={() => onChangeMode('spectate')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
              gameMode === 'spectate' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto Battle
          </button>
          <button
            onClick={() => onChangeMode('single')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
              gameMode === 'single' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Play P1
          </button>
          <button
            onClick={() => onChangeMode('twoplayer')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
              gameMode === 'twoplayer' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2-Player
          </button>
        </div>

        {/* Right action triggers */}
        <div className="flex items-center gap-1.5">
          {/* Change Fighters */}
          <button
            onClick={onOpenCharacterSelect}
            className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Fighters</span>
          </button>

          {/* Download ZIP */}
          <button
            onClick={onOpenAppExport}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-red-900/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get ZIP</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
