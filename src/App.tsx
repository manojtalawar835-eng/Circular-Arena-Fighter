import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArenaCanvas } from './components/ArenaCanvas';
import { HealthBarHeader } from './components/HealthBarHeader';
import { WinnerModal } from './components/WinnerModal';
import { ControlsBar } from './components/ControlsBar';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { OnlineRoomModal } from './components/OnlineRoomModal';
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
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState<boolean>(false);

  // Online Multiplayer State
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerSlot, setPlayerSlot] = useState<'p1' | 'p2' | null>(null);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState<boolean>(false);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const lastRestartCounterRef = useRef<number>(0);
  const lastBroadcastRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });

  // Manual movements
  const [manualMoveP1, setManualMoveP1] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [manualMoveP2, setManualMoveP2] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Send movement input to opponent via reliable REST API
  const broadcastInput = useCallback((vx: number, vy: number) => {
    if (!roomCode || !playerSlot || !playerIdRef.current) return;
    if (lastBroadcastRef.current.vx === vx && lastBroadcastRef.current.vy === vy) return;
    lastBroadcastRef.current = { vx, vy };

    fetch('/api/rooms/input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        playerId: playerIdRef.current,
        slot: playerSlot,
        vx,
        vy
      })
    }).catch(() => {});
  }, [roomCode, playerSlot]);

  // Create Room via REST API (100% reliable through Cloud Run reverse proxy)
  const handleCreateOnlineRoom = async () => {
    setOnlineError(null);
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fighter1.name })
      });
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.code);
        setPlayerSlot('p1');
        playerIdRef.current = data.playerId;
        setIsWaitingForOpponent(true);
        setOpponentName(null);
        setGameMode('single');
      } else {
        setOnlineError(data.error || 'Failed to create arena room.');
      }
    } catch {
      setOnlineError('Could not reach multiplayer server. Please try again.');
    }
  };

  // Join Room via REST API
  const handleJoinOnlineRoom = async (code: string) => {
    setOnlineError(null);
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          name: fighter2.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.code);
        setPlayerSlot('p2');
        playerIdRef.current = data.playerId;
        setOpponentName(data.opponentName || 'Player 1');
        setIsWaitingForOpponent(false);
        setGameMode('single');
        soundEngine.playVictory();
      } else {
        setOnlineError(data.error || 'Room not found or already full.');
      }
    } catch {
      setOnlineError('Could not connect to room. Please check code.');
    }
  };

  // Leave / cancel online room
  const handleLeaveOnlineRoom = () => {
    setRoomCode(null);
    setPlayerSlot(null);
    setIsWaitingForOpponent(false);
    setOpponentName(null);
    setOnlineError(null);
    playerIdRef.current = null;
    setGameMode('spectate');
    handleLocalRestart();
  };

  // Local restart helper
  const handleLocalRestart = useCallback(() => {
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
    soundEngine.playFightBell();
  }, []);

  // Real-time synchronization loop
  useEffect(() => {
    if (!roomCode || !playerIdRef.current) return;

    let isSubscribed = true;

    const pollInterval = setInterval(async () => {
      if (!isSubscribed || !roomCode || !playerIdRef.current) return;
      try {
        const res = await fetch(`/api/rooms/${roomCode}/poll?playerId=${playerIdRef.current}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data.success || !isSubscribed) return;

        // Check if opponent connected
        if (data.hasOpponent && data.opponentName) {
          setIsWaitingForOpponent(false);
          setOpponentName((prev) => {
            if (!prev) soundEngine.playVictory();
            return data.opponentName;
          });
        }

        // Sync opponent's real-time movement
        if (playerSlot === 'p1') {
          setManualMoveP2({ x: data.opponentVx || 0, y: data.opponentVy || 0 });
        } else if (playerSlot === 'p2') {
          setManualMoveP1({ x: data.opponentVx || 0, y: data.opponentVy || 0 });
        }

        // Sync restart if opponent triggered it
        if (data.restartCounter > lastRestartCounterRef.current) {
          lastRestartCounterRef.current = data.restartCounter;
          handleLocalRestart();
        }
      } catch {
        // Quiet retry on network hiccups
      }
    }, 90);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
    };
  }, [roomCode, playerSlot, handleLocalRestart]);

  // Keyboard controls for single, 2-player, and online modes
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
      // In Online mode:
      if (roomCode && playerSlot) {
        let mx = 0;
        let my = 0;
        if (keysPressed['w'] || keysPressed['arrowup']) my -= 1;
        if (keysPressed['s'] || keysPressed['arrowdown']) my += 1;
        if (keysPressed['a'] || keysPressed['arrowleft']) mx -= 1;
        if (keysPressed['d'] || keysPressed['arrowright']) mx += 1;

        if (playerSlot === 'p1') {
          setManualMoveP1({ x: mx, y: my });
        } else {
          setManualMoveP2({ x: mx, y: my });
        }
        broadcastInput(mx, my);
        return;
      }

      // Offline local modes:
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
  }, [gameMode, roomCode, playerSlot, broadcastInput]);

  // Real Viral Meme Sound Trigger:
  // Plays the authentic dialogue and meme laugh audio without captions/subtitles
  const handlePlayVideoDialogue = useCallback(() => {
    soundEngine.playViralDialogueSequence();
  }, []);

  // Automated dialogue loop during fight (plays every 15 seconds, starting 2.5s into battle)
  useEffect(() => {
    if (!isPlaying || winner || isMuted) return;

    const initialTimer = setTimeout(() => {
      handlePlayVideoDialogue();
    }, 2500);

    const interval = setInterval(() => {
      if (isPlaying && !winner && !isMuted) {
        handlePlayVideoDialogue();
      }
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isPlaying, winner, isMuted, handlePlayVideoDialogue]);

  // HP callback
  const handleUpdateHp = useCallback((f1Hp: number, f2Hp: number) => {
    setFighter1((prev) => ({ ...prev, hp: f1Hp }));
    setFighter2((prev) => ({ ...prev, hp: f2Hp }));
  }, []);

  // Game over
  const handleGameOver = useCallback((winningFighter: Fighter) => {
    setWinner(winningFighter);
  }, []);

  // Restart match (syncs with room if in online match)
  const handleRestart = useCallback(() => {
    handleLocalRestart();
    if (roomCode && playerIdRef.current) {
      fetch('/api/rooms/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          playerId: playerIdRef.current,
          restart: true
        })
      }).catch(() => {});
    }
  }, [roomCode, handleLocalRestart]);

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

        {/* On-screen Virtual Joysticks when in Interactive Play Mode or Online Mode */}
        {((gameMode !== 'spectate') || (roomCode !== null)) && (
          <div className="w-full max-w-[500px] flex justify-between px-6 pt-2 pb-1">
            {/* Player 1 Joystick */}
            {(!roomCode || playerSlot === 'p1') && (
              <VirtualJoystick
                label={roomCode ? `You (${fighter1.name})` : `${fighter1.name} (Move)`}
                color={fighter1.barColor}
                onMove={(vec) => {
                  setManualMoveP1(vec);
                  if (roomCode) broadcastInput(vec.x, vec.y);
                }}
              />
            )}

            {/* Player 2 Joystick (in local 2-player or if local player is p2) */}
            {(!roomCode && gameMode === 'twoplayer') || (roomCode && playerSlot === 'p2') ? (
              <VirtualJoystick
                label={roomCode ? `You (${fighter2.name})` : `${fighter2.name} (Move)`}
                color={fighter2.barColor}
                onMove={(vec) => {
                  setManualMoveP2(vec);
                  if (roomCode) broadcastInput(vec.x, vec.y);
                }}
              />
            ) : null}
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
        onPlayVideoDialogue={handlePlayVideoDialogue}
        onOpenOnlineModal={() => setIsOnlineModalOpen(true)}
        isOnlineConnected={opponentName !== null}
        onlineRoomCode={roomCode}
      />

      {/* Online Multiplayer Room Code Modal */}
      <OnlineRoomModal
        isOpen={isOnlineModalOpen}
        onClose={() => setIsOnlineModalOpen(false)}
        onCreateRoom={handleCreateOnlineRoom}
        onJoinRoom={handleJoinOnlineRoom}
        onLeaveRoom={handleLeaveOnlineRoom}
        roomCode={roomCode}
        playerSlot={playerSlot}
        isWaitingForOpponent={isWaitingForOpponent}
        opponentName={opponentName}
        error={onlineError}
      />

      {/* Fighter Roster Modal */}
      <CharacterSelectModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        selectedF1={selectedPreset1}
        selectedF2={selectedPreset2}
        onSelectF1={handleSelectF1}
        onSelectF2={handleSelectF2}
      />
    </div>
  );
}
