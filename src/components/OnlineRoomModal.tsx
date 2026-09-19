import React, { useState } from 'react';
import { Users, KeyRound, Copy, Check, ArrowRight, ShieldAlert, Sparkles, X, Radio } from 'lucide-react';

interface OnlineRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onLeaveRoom?: () => void;
  roomCode: string | null;
  playerSlot: 'p1' | 'p2' | null;
  isWaitingForOpponent: boolean;
  opponentName: string | null;
  error: string | null;
}

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  roomCode,
  playerSlot,
  isWaitingForOpponent,
  opponentName,
  error,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinRoom(inputCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          id="close-online-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Online Multiplayer Duel</h2>
            <p className="text-xs text-slate-400">Play together in real-time using room codes</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* State 1: In Room Waiting for Opponent */}
        {roomCode && isWaitingForOpponent ? (
          <div className="text-center py-4 space-y-4">
            <div className="p-4 bg-slate-800/80 border border-indigo-500/40 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Your Arena Room Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-black font-mono tracking-widest text-white">
                  {roomCode}
                </span>
                <button
                  id="copy-room-code-btn"
                  onClick={handleCopy}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                  title="Copy room code"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400 mt-1">Code copied to clipboard!</p>}
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-300 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Waiting for Player 2 to join with code...</span>
            </div>

            <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
              💡 <strong>How to play:</strong> Tell your friend to open the game on their phone or PC, click <strong>"Online Codes"</strong>, and enter code <strong className="text-indigo-300">{roomCode}</strong>.
            </div>

            {onLeaveRoom && (
              <button
                id="cancel-room-btn"
                onClick={onLeaveRoom}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel & Return
              </button>
            )}
          </div>
        ) : roomCode && opponentName ? (
          /* State 2: Opponent Connected! */
          <div className="text-center py-4 space-y-4">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-1">Opponent Connected!</h3>
              <p className="text-sm text-emerald-300 font-medium">
                {opponentName} has entered the arena!
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                <span>Room Code:</span>
                <strong className="font-mono text-white">{roomCode}</strong>
                <span>• Slot:</span>
                <strong className="text-amber-400">{playerSlot === 'p1' ? 'Player 1 (Modi ji)' : 'Player 2 (Abhijit dipke)'}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                id="start-online-match-btn"
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Start Battle Now!
              </button>

              {onLeaveRoom && (
                <button
                  id="leave-match-btn"
                  onClick={onLeaveRoom}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Leave
                </button>
              )}
            </div>
          </div>
        ) : (
          /* State 3: Menu - Create or Join */
          <div className="space-y-4">
            {/* Create Room Button */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl hover:border-indigo-500/60 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Create New Match</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Generate a 4-digit code and invite your friend to duel you.
              </p>
              <button
                id="create-room-btn"
                onClick={onCreateRoom}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-[0.99]"
              >
                <span>Create Arena Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-slate-700/60" />
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">OR</span>
              <div className="h-px flex-1 bg-slate-700/60" />
            </div>

            {/* Join Room Form */}
            <form onSubmit={handleJoinSubmit} className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl hover:border-purple-500/60 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Join with Room Code</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Enter the 4-digit code provided by your friend.
              </p>
              <div className="flex gap-2">
                <input
                  id="room-code-input"
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 4829"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-purple-500"
                />
                <button
                  id="submit-join-room-btn"
                  type="submit"
                  disabled={!inputCode.trim()}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
