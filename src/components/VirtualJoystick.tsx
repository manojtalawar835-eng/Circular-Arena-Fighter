import React, { useRef, useState, useCallback } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  label?: string;
  color?: string;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  label = 'Move',
  color = '#EF4444'
}) => {
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [active, setActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const maxRadius = 40;

  const handlePointerDown = (e: React.PointerEvent) => {
    setActive(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      onMove({ x: dx / maxRadius, y: dy / maxRadius });
    } else {
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * maxRadius;
      const ky = Math.sin(angle) * maxRadius;
      setKnobPos({ x: kx, y: ky });
      onMove({ x: Math.cos(angle), y: Math.sin(angle) });
    }
  }, [onMove]);

  const handlePointerUp = (e: React.PointerEvent) => {
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={active ? handlePointerMove : undefined}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-24 h-24 rounded-full bg-slate-900/80 border-2 border-slate-700/80 touch-none flex items-center justify-center shadow-lg"
      >
        {/* Center marker */}
        <div className="w-3 h-3 rounded-full bg-slate-700/60" />

        {/* Dynamic Knob */}
        <div
          className="absolute w-12 h-12 rounded-full shadow-md transition-transform duration-75 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}`
          }}
        >
          <div className="w-4 h-4 rounded-full bg-white/40" />
        </div>
      </div>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );
};
