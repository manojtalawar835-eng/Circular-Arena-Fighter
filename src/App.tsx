import React, { useState, useEffect, useCallback } from 'react';
import { ArenaCanvas } from './components/ArenaCanvas';
import { HealthBarHeader } from './components/HealthBarHeader';
import { WinnerModal } from './components/WinnerModal';
import { ControlsBar } from './components/ControlsBar';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { AppExportModal } from './components/AppExportModal';
import { VirtualJoystick } from './components/VirtualJoystick';
import { CHARACTER_PRESETS } from './data/characters';
import { Fighter, CharacterPreset, GameMode } from './types';
import { soundEngine } from './audio/soundEngine';

export default function App() {
  // Preset selection
  const [selectedPreset1, setSelectedPreset1] = useState<CharacterPreset>(CHARACTER_PRESETS[0]); // Modi ji
  const [selectedPreset2, setSelectedPreset2] = useState<CharacterPreset>(CHARACTER_PRESETS[1]); // Abhijit dipke

  // Fighters state
  const [fighter1, setFighter1] = useState<Fighter>(() => ({
    id: 'f1-' + CHARACTER_PRESETS[0].id,
    name: CHARACTER_PRESETS[0].name,
    avatarUrl: CHARACTER_PRESETS[0].avatarSvg,
    color: CHARACTER_PRESETS[0].primaryColor,
    barColor: CHARACTER_PRESETS[0].barColor,
    x: 180,
    y: 260,
    vx: -1.2,
    vy: 0.8,
    radius: 26,
    hp: 100,
    maxHp: 100,
    currentWeapon: null,
    weaponAmmo: 0,
    lastAttackTime: 0,
    isHit: 0,
    hasShield: false,
    shieldDuration: 0,
    voiceLines: CHARACTER_PRESETS[0].voiceLines
  }));

  const [fighter2, setFighter2] = useState<Fighter>(() => ({
    id: 'f2-' + CHARACTER_PRESETS[1].id,
    name: CHARACTER_PRESETS[1].name,
    avatarUrl: CHARACTER_PRESETS[1].avatarSvg,
    color: CHARACTER_PRESETS[1].primaryColor,
    barColor: CHARACTER_PRESETS[1].barColor,
    x: 340,
    y: 260,
    vx: 1.2,
    vy: -0.8,
    radius: 26,
    hp: 100,
    maxHp: 100,
    currentWeapon: null,
    weaponAmmo: 0,
    lastAttackTime: 0,
    isHit: 0,
    hasShield: false,
    shieldDuration: 0,
    voiceLines: CHARACTER_PRESETS[1].voiceLines
  }));

  // Game control state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [gameMode, setGameMode] = useState<GameMode>('spectate');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [winner, setWinner] = useState<Fighter | null>(null);

  // Modals
  const [isCharModalOpen, setIsCharModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Manual movements
  const [manualMoveP1, setManualMoveP1] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [manualMoveP2, setManualMoveP2] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keyboard controls for single & 2-player modes
  useEffect(() => {
    const keysPressed: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true;
      updateKeyMoves();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false;
      updateKeyMoves();
    };

    const updateKeyMoves = () => {
      if (gameMode === 'single' || gameMode === 'twoplayer') {
        let p1x = 0;
        let p1y = 0;
        if (keysPressed['w'] || keysPressed['arrowup']) p1y -= 1;
        if (keysPressed['s'] || keysPressed['arrowdown']) p1y += 1;
        if (keysPressed['a'] || keysPressed['arrowleft']) p1x -= 1;
        if (keysPressed['d'] || keysPressed['arrowright']) p1x += 1;
        setManualMoveP1({ x: p1x, y: p1y });
      }

      if (gameMode === 'twoplayer') {
        let p2x = 0;
        let p2y = 0;
        if (keysPressed['i']) p2y -= 1;
        if (keysPressed['k']) p2y += 1;
        if (keysPressed['j']) p2x -= 1;
        if (keysPressed['l']) p2x += 1;
        setManualMoveP2({ x: p2x, y: p2y });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameMode]);

  // HP callback
  const handleUpdateHp = useCallback((f1Hp: number, f2Hp: number) => {
    setFighter1((prev) => ({ ...prev, hp: f1Hp }));
    setFighter2((prev) => ({ ...prev, hp: f2Hp }));
  }, []);

  // Game over
  const handleGameOver = useCallback((winningFighter: Fighter) => {
    setWinner(winningFighter);
  }, []);

  // Restart match
  const handleRestart = useCallback(() => {
    setWinner(null);
    setFighter1((prev) => ({
      ...prev,
      hp: prev.maxHp,
      x: 180,
      y: 260,
      vx: -1.2,
      vy: 0.8,
      currentWeapon: null,
      weaponAmmo: 0
    }));
    setFighter2((prev) => ({
      ...prev,
      hp: prev.maxHp,
      x: 340,
      y: 260,
      vx: 1.2,
      vy: -0.8,
      currentWeapon: null,
      weaponAmmo: 0
    }));
    setIsPlaying(true);
    soundEngine.playPickup();
  }, []);

  // Update fighter 1 preset
  const handleSelectF1 = (preset: CharacterPreset) => {
    setSelectedPreset1(preset);
    setFighter1((prev) => ({
      ...prev,
      id: 'f1-' + preset.id,
      name: preset.name,
      avatarUrl: preset.avatarSvg,
      color: preset.primaryColor,
      barColor: preset.barColor,
      voiceLines: preset.voiceLines,
      hp: 100
    }));
  };

  // Update fighter 2 preset
  const handleSelectF2 = (preset: CharacterPreset) => {
    setSelectedPreset2(preset);
    setFighter2((prev) => ({
      ...prev,
      id: 'f2-' + preset.id,
      name: preset.name,
      avatarUrl: preset.avatarSvg,
      color: preset.primaryColor,
      barColor: preset.barColor,
      voiceLines: preset.voiceLines,
      hp: 100
    }));
  };

  // Random Meme sound
  const handleRandomMemeSound = () => {
    const list = [
      { text: 'Wah Modi ji Wah!', char: 'Modi ji' },
      { text: 'Aho gaon me sarkari school theek karo...', char: 'Abhijit dipke' },
      { text: 'Lene ke dene pad gaye!', char: 'Abhijit dipke' },
      { text: 'Arey bhai bhai bhai!', char: 'Abhijit dipke' },
      { text: 'Maza aaya!', char: 'Rahul ji' },
      { text: 'Khatam! Tata! Bye-bye!', char: 'Modi ji' },
      { text: 'Abki baar arena paar!', char: 'Modi ji' }
    ];
    const pick = list[Math.floor(Math.random() * list.length)];
    soundEngine.playMemeVoice(pick.text, pick.char);
  };

  // Sound toggle
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
  };

  return (
    <div className="min-h-screen bg-[#060A13] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Top Health and Name Bar Header */}
      <HealthBarHeader fighter1={fighter1} fighter2={fighter2} />

      {/* Main Radar Arena Stage */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-2 py-1">
        <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center">
          <ArenaCanvas
            fighter1={fighter1}
            fighter2={fighter2}
            onUpdateHp={handleUpdateHp}
            onGameOver={handleGameOver}
            isPlaying={isPlaying}
            gameSpeed={gameSpeed}
            gameMode={gameMode}
            manualMoveP1={manualMoveP1}
            manualMoveP2={manualMoveP2}
          />

          {/* Winner popup modal */}
          <WinnerModal winner={winner} onRestart={handleRestart} />
        </div>

        {/* On-screen Virtual Joysticks when in Interactive Play Mode */}
        {gameMode !== 'spectate' && (
          <div className="w-full max-w-[500px] flex justify-between px-6 pt-2 pb-1">
            <VirtualJoystick
              label={`${fighter1.name} (Move)`}
              color={fighter1.barColor}
              onMove={setManualMoveP1}
            />

            {gameMode === 'twoplayer' && (
              <VirtualJoystick
                label={`${fighter2.name} (Move)`}
                color={fighter2.barColor}
                onMove={setManualMoveP2}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Controls Bar */}
      <ControlsBar
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onRestart={handleRestart}
        gameSpeed={gameSpeed}
        onChangeSpeed={setGameSpeed}
        gameMode={gameMode}
        onChangeMode={setGameMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenCharacterSelect={() => setIsCharModalOpen(true)}
        onOpenAppExport={() => setIsExportModalOpen(true)}
        onRandomMemeSound={handleRandomMemeSound}
      />

      {/* Modals */}
      <CharacterSelectModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        selectedF1={selectedPreset1}
        selectedF2={selectedPreset2}
        onSelectF1={handleSelectF1}
        onSelectF2={handleSelectF2}
      />

      <AppExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
