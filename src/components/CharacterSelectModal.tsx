import React, { useState } from 'react';
import { CHARACTER_PRESETS } from '../data/characters';
import { CharacterPreset } from '../types';
import { X, Upload, Volume2, Check } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedF1: CharacterPreset;
  selectedF2: CharacterPreset;
  onSelectF1: (preset: CharacterPreset) => void;
  onSelectF2: (preset: CharacterPreset) => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  isOpen,
  onClose,
  selectedF1,
  selectedF2,
  onSelectF1,
  onSelectF2
}) => {
  const [activeSlot, setActiveSlot] = useState<'p1' | 'p2'>('p1');
  const [customName, setCustomName] = useState<string>('');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustom = () => {
    if (!customPhoto) return;
    const name = customName.trim() || (activeSlot === 'p1' ? 'Player 1' : 'Player 2');
    const customPreset: CharacterPreset = {
      id: 'custom-' + Date.now(),
      name,
      shortName: name,
      title: 'Custom Challenger',
      primaryColor: activeSlot === 'p1' ? '#EF4444' : '#3B82F6',
      barColor: activeSlot === 'p1' ? '#EF4444' : '#3B82F6',
      avatarSvg: customPhoto,
      speechGreeting: 'Ready to fight!',
      voiceLines: ['Maza aayega!', 'Chalo shuru karte hain!', 'Khatam! Tata! Bye-bye!']
    };

    if (activeSlot === 'p1') {
      onSelectF1(customPreset);
    } else {
      onSelectF2(customPreset);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-bold">Select Arena Fighters</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Switcher Tab (Player 1 vs Player 2) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-4">
          <button
            onClick={() => setActiveSlot('p1')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSlot === 'p1'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Left: {selectedF1.name}</span>
          </button>
          <button
            onClick={() => setActiveSlot('p2')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSlot === 'p2'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Right: {selectedF2.name}</span>
          </button>
        </div>

        {/* Preset Fighters Grid */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Choose Character Preset
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CHARACTER_PRESETS.map((p) => {
              const isCurrent = activeSlot === 'p1' ? selectedF1.id === p.id : selectedF2.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (activeSlot === 'p1') onSelectF1(p);
                    else onSelectF2(p);
                    soundEngine.playMemeVoice(p.speechGreeting, p.name);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <img
                    src={p.avatarSvg}
                    alt={p.name}
                    className="w-11 h-11 rounded-full border border-white/40 object-cover shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="font-bold text-sm truncate text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{p.title}</p>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Custom Fighter Section */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
          <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Custom Photo & Name</span>
          </p>
          <div className="flex gap-3 items-center">
            {customPhoto ? (
              <img
                src={customPhoto}
                alt="Custom"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 shrink-0 text-xs">
                No Img
              </div>
            )}
            <label className="flex-1 cursor-pointer py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-center transition-colors">
              Choose Photo File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Fighter Name (e.g. My Friend)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleApplyCustom}
              disabled={!customPhoto}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
