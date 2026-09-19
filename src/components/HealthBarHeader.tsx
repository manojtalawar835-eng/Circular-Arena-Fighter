import React from 'react';
import { Fighter } from '../types';

interface HealthBarHeaderProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

export const HealthBarHeader: React.FC<HealthBarHeaderProps> = ({ fighter1, fighter2 }) => {
  const f1Percent = Math.max(0, Math.min(100, (fighter1.hp / fighter1.maxHp) * 100));
  const f2Percent = Math.max(0, Math.min(100, (fighter2.hp / fighter2.maxHp) * 100));

  return (
    <header className="w-full max-w-[540px] mx-auto px-4 pt-2 select-none">
      {/* Top Health Bars Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Fighter 1 (Left - Red / Pink) */}
        <div className="flex-1">
          <div className="text-white text-xs md:text-sm font-bold tracking-wide mb-1 flex justify-between">
            <span>{fighter1.name}</span>
            <span className="text-red-300 font-mono font-semibold">{Math.ceil(fighter1.hp)} HP</span>
          </div>
          <div className="relative h-4 bg-slate-900/80 border border-slate-700/80 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full transition-all duration-200 ease-out shadow-[0_0_12px_rgba(239,68,68,0.5)]"
              style={{ width: `${f1Percent}%` }}
            />
          </div>
        </div>

        {/* Fighter 2 (Right - Blue / Cyan) */}
        <div className="flex-1">
          <div className="text-white text-xs md:text-sm font-bold tracking-wide mb-1 flex justify-between">
            <span>{fighter2.name}</span>
            <span className="text-sky-300 font-mono font-semibold">{Math.ceil(fighter2.hp)} HP</span>
          </div>
          <div className="relative h-4 bg-slate-900/80 border border-slate-700/80 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-200 ease-out ml-auto shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              style={{ width: `${f2Percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Match Title Banner (Exact match to video: "Modi ji vs abhijit dipke") */}
      <div className="text-center mt-3 mb-1">
        <h1 className="text-white font-extrabold text-lg sm:text-xl tracking-tight drop-shadow-md">
          {fighter1.name} <span className="text-slate-400 font-medium text-base">vs</span> {fighter2.name}
        </h1>
      </div>
    </header>
  );
};
