import React, { useRef, useEffect, useCallback } from 'react';
import { Fighter, WeaponItem, Projectile, Particle, FloatingText, WeaponType, GameMode } from '../types';
import { WEAPON_DEFS } from '../data/weapons';
import { soundEngine } from '../audio/soundEngine';

interface ArenaCanvasProps {
  fighter1: Fighter;
  fighter2: Fighter;
  onUpdateHp: (f1Hp: number, f2Hp: number) => void;
  onGameOver: (winner: Fighter) => void;
  isPlaying: boolean;
  gameSpeed: number;
  gameMode: GameMode;
  manualMoveP1?: { x: number; y: number };
  manualMoveP2?: { x: number; y: number };
  activeSubtitle?: string | null;
}

// Preload avatar images for drawing on canvas
const avatarCache: { [url: string]: HTMLImageElement } = {};
function getAvatarImage(url: string): HTMLImageElement {
  if (!avatarCache[url]) {
    const img = new Image();
    img.src = url;
    avatarCache[url] = img;
  }
  return avatarCache[url];
}

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  fighter1,
  fighter2,
  onUpdateHp,
  onGameOver,
  isPlaying,
  gameSpeed,
  gameMode,
  manualMoveP1 = { x: 0, y: 0 },
  manualMoveP2 = { x: 0, y: 0 },
  activeSubtitle
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable game simulation state held in refs for 60fps performance
  const f1Ref = useRef<Fighter>({ ...fighter1 });
  const f2Ref = useRef<Fighter>({ ...fighter2 });
  const itemsRef = useRef<WeaponItem[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lastItemSpawnRef = useRef<number>(0);
  const isFinishedRef = useRef<boolean>(false);
  const dashOffsetRef = useRef<number>(0);

  // Sync prop changes (e.g. on reset or fighter swap)
  useEffect(() => {
    f1Ref.current = { ...fighter1 };
    f2Ref.current = { ...fighter2 };
    itemsRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    isFinishedRef.current = false;
  }, [fighter1.id, fighter2.id, fighter1.maxHp, fighter2.maxHp]);

  // Reset arena state
  const resetArena = useCallback(() => {
    f1Ref.current.hp = fighter1.maxHp;
    f2Ref.current.hp = fighter2.maxHp;
    f1Ref.current.currentWeapon = null;
    f2Ref.current.currentWeapon = null;
    f1Ref.current.weaponAmmo = 0;
    f2Ref.current.weaponAmmo = 0;
    itemsRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    isFinishedRef.current = false;
    onUpdateHp(fighter1.maxHp, fighter2.maxHp);
  }, [fighter1.maxHp, fighter2.maxHp, onUpdateHp]);

  // Expose reset trigger if needed
  useEffect(() => {
    if (fighter1.hp === fighter1.maxHp && fighter2.hp === fighter2.maxHp && isFinishedRef.current) {
      resetArena();
    }
  }, [fighter1.hp, fighter2.hp, fighter1.maxHp, fighter2.maxHp, resetArena]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Spawn a new weapon or health item inside the circular arena
    const spawnItem = (arenaRadius: number, centerX: number, centerY: number) => {
      // Don't clutter arena with too many items
      if (itemsRef.current.length >= 4) return;

      const weaponTypes: WeaponType[] = [
        'pistol', 'mic', 'sword', 'slingshot', 'ak47', 
        'flame', 'trident', 'shotgun', 'laser', 'health', 'bomb'
      ];
      // Slightly higher probability for health when someone is low
      let selectedType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
      if ((f1Ref.current.hp < 40 || f2Ref.current.hp < 40) && Math.random() < 0.4) {
        selectedType = 'health';
      }

      // Random position inside circle (away from outer edge)
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (arenaRadius * 0.72);
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      itemsRef.current.push({
        id: 'item-' + Math.random().toString(36).substring(2, 8),
        type: selectedType,
        x,
        y,
        radius: 20,
        spawnTime: performance.now(),
        pulsePhase: Math.random() * Math.PI
      });
    };

    // Draw weapon icon inside circle item
    const drawWeaponIcon = (
      c: CanvasRenderingContext2D, 
      type: WeaponType, 
      x: number, 
      y: number, 
      radius: number
    ) => {
      c.save();
      c.translate(x, y);

      switch (type) {
        case 'pistol': {
          // Handgun silhouette
          c.fillStyle = '#CBD5E1';
          c.fillRect(-6, -3, 14, 5); // barrel
          c.fillRect(-6, 0, 5, 8);  // grip
          c.fillStyle = '#94A3B8';
          c.fillRect(-2, -1, 3, 2); // trigger guard
          break;
        }
        case 'mic': {
          // Reporter microphone
          c.fillStyle = '#38BDF8';
          c.beginPath();
          c.arc(0, -3, 6, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#1E293B';
          c.fillRect(-3, 3, 6, 8);
          // Red badge
          c.fillStyle = '#EF4444';
          c.fillRect(-5, 0, 10, 3);
          break;
        }
        case 'sword': {
          // Sharp golden blade
          c.rotate(-Math.PI / 4);
          c.fillStyle = '#FCD34D';
          c.fillRect(-2, -10, 4, 14);
          // blade tip
          c.beginPath();
          c.moveTo(-2, -10);
          c.lineTo(0, -14);
          c.lineTo(2, -10);
          c.fill();
          // Crossguard & hilt
          c.fillStyle = '#D97706';
          c.fillRect(-6, 4, 12, 2.5);
          c.fillStyle = '#78350F';
          c.fillRect(-1.5, 6.5, 3, 5);
          break;
        }
        case 'slingshot': {
          // Y-shaped catapult / Gulel
          c.strokeStyle = '#D97706';
          c.lineWidth = 3;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(0, 9);
          c.lineTo(0, 0);
          c.lineTo(-6, -8);
          c.moveTo(0, 0);
          c.lineTo(6, -8);
          c.stroke();
          // Rubber band
          c.strokeStyle = '#EF4444';
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(-6, -7);
          c.lineTo(0, -3);
          c.lineTo(6, -7);
          c.stroke();
          // Stone
          c.fillStyle = '#475569';
          c.beginPath();
          c.arc(0, -3, 2.5, 0, Math.PI * 2);
          c.fill();
          break;
        }
        case 'ak47': {
          // Rifle shape
          c.fillStyle = '#475569';
          c.fillRect(-9, -2, 18, 4); // body
          c.fillStyle = '#78350F';
          c.fillRect(-10, -2, 4, 7); // stock
          // Curved banana magazine
          c.fillStyle = '#1E293B';
          c.beginPath();
          c.ellipse(1, 4, 2.5, 5, 0.4, 0, Math.PI * 2);
          c.fill();
          break;
        }
        case 'flame': {
          // Fiery flame
          c.fillStyle = '#F97316';
          c.beginPath();
          c.moveTo(0, -10);
          c.quadraticCurveTo(8, -2, 6, 6);
          c.quadraticCurveTo(0, 10, -6, 6);
          c.quadraticCurveTo(-8, -2, 0, -10);
          c.fill();
          // Inner yellow flame
          c.fillStyle = '#FACC15';
          c.beginPath();
          c.moveTo(0, -4);
          c.quadraticCurveTo(4, 0, 3, 4);
          c.quadraticCurveTo(0, 7, -3, 4);
          c.quadraticCurveTo(-4, 0, 0, -4);
          c.fill();
          break;
        }
        case 'trident': {
          // Trishul with 3 prongs
          c.strokeStyle = '#EAB308';
          c.lineWidth = 2.5;
          c.beginPath();
          c.moveTo(0, 10);
          c.lineTo(0, -10);
          c.stroke();
          c.beginPath();
          c.moveTo(-6, -4);
          c.lineTo(-6, -8);
          c.lineTo(-1, -2);
          c.moveTo(6, -4);
          c.lineTo(6, -8);
          c.lineTo(1, -2);
          c.stroke();
          break;
        }
        case 'shotgun': {
          c.fillStyle = '#94A3B8';
          c.fillRect(-10, -2, 20, 3.5);
          c.fillStyle = '#78350F';
          c.fillRect(-11, -1, 6, 6);
          break;
        }
        case 'laser': {
          // Sci-fi ray blaster
          c.fillStyle = '#EC4899';
          c.fillRect(-7, -4, 14, 5);
          c.fillStyle = '#06B6D4';
          c.fillRect(7, -3, 3, 3);
          c.fillStyle = '#1E293B';
          c.fillRect(-4, 1, 4, 6);
          break;
        }
        case 'health': {
          // Red medical heart with white cross
          c.fillStyle = '#EF4444';
          c.beginPath();
          c.arc(-3, -3, 4, Math.PI, 0, false);
          c.arc(3, -3, 4, Math.PI, 0, false);
          c.lineTo(0, 6);
          c.closePath();
          c.fill();
          // White medical plus
          c.fillStyle = '#FFFFFF';
          c.fillRect(-1, -3, 2, 6);
          c.fillRect(-3, -1, 6, 2);
          break;
        }
        case 'bomb': {
          // Round black bomb with fuse
          c.fillStyle = '#1E293B';
          c.beginPath();
          c.arc(0, 2, 7, 0, Math.PI * 2);
          c.fill();
          // Fuse
          c.strokeStyle = '#F97316';
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(0, -5);
          c.quadraticCurveTo(4, -8, 2, -11);
          c.stroke();
          // Spark
          c.fillStyle = '#FACC15';
          c.beginPath();
          c.arc(2, -11, 2, 0, Math.PI * 2);
          c.fill();
          break;
        }
      }
      c.restore();
    };

    // Main animation & physics loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1) * gameSpeed;
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const arenaRadius = Math.min(width, height) * 0.46;

      ctx.clearRect(0, 0, width, height);

      // --- 1. DRAW RADAR ARENA BACKGROUND ---
      // Outer deep dark blue space
      ctx.fillStyle = '#080E1A';
      ctx.fillRect(0, 0, width, height);

      // Save arena clipping region for grid
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius, 0, Math.PI * 2);
      ctx.clip();

      // Inside Arena background
      ctx.fillStyle = '#0B132B';
      ctx.fillRect(centerX - arenaRadius, centerY - arenaRadius, arenaRadius * 2, arenaRadius * 2);

      // Draw coordinate grid lines (subtle dark blue lines as seen in video)
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = centerX - arenaRadius; x <= centerX + arenaRadius; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, centerY - arenaRadius);
        ctx.lineTo(x, centerY + arenaRadius);
        ctx.stroke();
      }
      for (let y = centerY - arenaRadius; y <= centerY + arenaRadius; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(centerX - arenaRadius, y);
        ctx.lineTo(centerX + arenaRadius, y);
        ctx.stroke();
      }

      // Subtle concentric radar distance rings
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius * 0.33, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius * 0.66, 0, Math.PI * 2);
      ctx.stroke();

      // Empty small circle / radar marker ring near bottom (as seen in video)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX + 30, centerY + arenaRadius * 0.65, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Arena Outer Ring Border with subtle pulsating glow
      ctx.save();
      ctx.shadowColor = 'rgba(147, 197, 253, 0.4)';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- 2. GAME LOGIC (IF PLAYING & NOT FINISHED) ---
      if (isPlaying && !isFinishedRef.current) {
        const now = performance.now();

        // Spawn items periodically (every 2.8s)
        if (now - lastItemSpawnRef.current > 2800 / gameSpeed) {
          lastItemSpawnRef.current = now;
          spawnItem(arenaRadius, centerX, centerY);
        }

        const f1 = f1Ref.current;
        const f2 = f2Ref.current;

        // Steering / Movement AI & Manual Controls
        const updateFighterMotion = (
          f: Fighter, 
          opponent: Fighter, 
          manualMove: { x: number; y: number }, 
          isManual: boolean
        ) => {
          if (isManual && (manualMove.x !== 0 || manualMove.y !== 0)) {
            // Manual controls from Joystick / Keys
            f.vx = manualMove.x * 2.8;
            f.vy = manualMove.y * 2.8;
          } else {
            // Autonomous Arena AI:
            // Look for closest item if no weapon or low HP
            let targetX = opponent.x;
            let targetY = opponent.y;
            let targetDist = Math.hypot(opponent.x - f.x, opponent.y - f.y);

            // If health is low, seek medical hearts!
            const healthItem = itemsRef.current.find(it => it.type === 'health');
            if (f.hp < 50 && healthItem) {
              targetX = healthItem.x;
              targetY = healthItem.y;
            } else if (!f.currentWeapon && itemsRef.current.length > 0) {
              // Seek closest weapon
              let closest = itemsRef.current[0];
              let minDist = Math.hypot(closest.x - f.x, closest.y - f.y);
              for (const it of itemsRef.current) {
                const d = Math.hypot(it.x - f.x, it.y - f.y);
                if (d < minDist) {
                  minDist = d;
                  closest = it;
                }
              }
              targetX = closest.x;
              targetY = closest.y;
            } else if (f.currentWeapon) {
              // We have a weapon: stay at ideal range (130-180px) and strafe
              const desiredDist = 150;
              const angleToOpp = Math.atan2(opponent.y - f.y, opponent.x - f.x);
              if (targetDist < desiredDist) {
                // back up slightly
                targetX = f.x - Math.cos(angleToOpp) * 60;
                targetY = f.y - Math.sin(angleToOpp) * 60;
              } else {
                // Strafe sideways
                targetX = opponent.x + Math.cos(angleToOpp + Math.PI / 2) * 80;
                targetY = opponent.y + Math.sin(angleToOpp + Math.PI / 2) * 80;
              }
            }

            // Steer velocity towards target with smooth wander
            const steerAngle = Math.atan2(targetY - f.y, targetX - f.x);
            const speed = 1.9;
            f.vx += (Math.cos(steerAngle) * speed - f.vx) * 0.05;
            f.vy += (Math.sin(steerAngle) * speed - f.vy) * 0.05;
          }

          // Apply position update
          f.x += f.vx * dt * 60;
          f.y += f.vy * dt * 60;

          // Arena circular wall bounce physics
          const distFromCenter = Math.hypot(f.x - centerX, f.y - centerY);
          if (distFromCenter + f.radius > arenaRadius) {
            const normalAngle = Math.atan2(f.y - centerY, f.x - centerX);
            // Reposition back inside
            f.x = centerX + Math.cos(normalAngle) * (arenaRadius - f.radius);
            f.y = centerY + Math.sin(normalAngle) * (arenaRadius - f.radius);

            // Reflect velocity vector
            const normalX = Math.cos(normalAngle);
            const normalY = Math.sin(normalAngle);
            const dot = f.vx * normalX + f.vy * normalY;
            f.vx = (f.vx - 2 * dot * normalX) * 0.85;
            f.vy = (f.vy - 2 * dot * normalY) * 0.85;
          }
        };

        const isP1Manual = gameMode === 'single' || gameMode === 'twoplayer';
        const isP2Manual = gameMode === 'twoplayer';
        updateFighterMotion(f1, f2, manualMoveP1, isP1Manual);
        updateFighterMotion(f2, f1, manualMoveP2, isP2Manual);

        // Fighter vs Fighter elastic collision
        const fightersDist = Math.hypot(f2.x - f1.x, f2.y - f1.y);
        const minDist = f1.radius + f2.radius;
        if (fightersDist < minDist && fightersDist > 0) {
          const overlap = minDist - fightersDist;
          const nx = (f2.x - f1.x) / fightersDist;
          const ny = (f2.y - f1.y) / fightersDist;
          f1.x -= nx * overlap * 0.5;
          f1.y -= ny * overlap * 0.5;
          f2.x += nx * overlap * 0.5;
          f2.y += ny * overlap * 0.5;

          // Swap velocities with bounce
          const tempVx = f1.vx;
          const tempVy = f1.vy;
          f1.vx = f2.vx * 0.9;
          f1.vy = f2.vy * 0.9;
          f2.vx = tempVx * 0.9;
          f2.vy = tempVy * 0.9;

          // Bump sound
          soundEngine.playHit();
        }

        // Weapon Pickup Check
        itemsRef.current = itemsRef.current.filter(item => {
          const checkPickup = (f: Fighter) => {
            const d = Math.hypot(item.x - f.x, item.y - f.y);
            if (d < f.radius + item.radius) {
              // Picked up!
              if (item.type === 'health') {
                const healAmt = 25;
                f.hp = Math.min(f.maxHp, f.hp + healAmt);
                soundEngine.playHeal();
                floatingTextsRef.current.push({
                  id: 'ft-' + Math.random(),
                  text: `+${healAmt} HP`,
                  x: f.x,
                  y: f.y - 30,
                  color: '#22C55E',
                  life: 1.0,
                  maxLife: 1.0,
                  fontSize: 18
                });
              } else {
                const def = WEAPON_DEFS[item.type];
                f.currentWeapon = item.type;
                f.weaponAmmo = def.ammo;
                soundEngine.playPickup();
                floatingTextsRef.current.push({
                  id: 'ft-' + Math.random(),
                  text: def.name,
                  x: f.x,
                  y: f.y - 30,
                  color: '#FACC15',
                  life: 0.8,
                  maxLife: 0.8,
                  fontSize: 16
                });

                // Meme voice trigger on picking up strong weapon!
                if (Math.random() < 0.45) {
                  const quotes = f.voiceLines;
                  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                  soundEngine.playMemeVoice(randomQuote, f.name);
                }
              }

              // Sparkles on pickup
              for (let i = 0; i < 8; i++) {
                particlesRef.current.push({
                  id: 'p-' + Math.random(),
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#FACC15',
                  radius: Math.random() * 3 + 2,
                  life: 0.5,
                  maxLife: 0.5,
                  alpha: 1.0
                });
              }
              return true;
            }
            return false;
          };

          if (checkPickup(f1) || checkPickup(f2)) {
            onUpdateHp(f1.hp, f2.hp);
            return false;
          }
          return true;
        });

        // Weapon Attack Logic
        const handleAttacking = (attacker: Fighter, defender: Fighter) => {
          if (!attacker.currentWeapon || attacker.weaponAmmo <= 0) return;
          const def = WEAPON_DEFS[attacker.currentWeapon];
          const canAttack = now - attacker.lastAttackTime >= def.cooldown / gameSpeed;

          if (canAttack) {
            attacker.lastAttackTime = now;
            attacker.weaponAmmo -= 1;

            const angle = Math.atan2(defender.y - attacker.y, defender.x - attacker.x);

            // Play weapon sound
            switch (attacker.currentWeapon) {
              case 'pistol': soundEngine.playPistol(); break;
              case 'ak47': soundEngine.playAK47(); break;
              case 'mic': soundEngine.playMicSonic(); break;
              case 'sword': soundEngine.playSword(); break;
              case 'slingshot': soundEngine.playSlingshot(); break;
              case 'laser': soundEngine.playLaser(); break;
              case 'flame': soundEngine.playFlame(); break;
              case 'trident': soundEngine.playTrident(); break;
              case 'shotgun': soundEngine.playShotgun(); break;
              case 'bomb': soundEngine.playBomb(); break;
            }

            // Spawn Projectile(s)
            if (def.isSpread && def.spreadCount) {
              const spreadAngles = [-0.18, 0, 0.18];
              spreadAngles.forEach(offset => {
                const finalAngle = angle + offset;
                projectilesRef.current.push({
                  id: 'proj-' + Math.random(),
                  ownerId: attacker.id,
                  type: attacker.currentWeapon!,
                  x: attacker.x + Math.cos(finalAngle) * (attacker.radius + 8),
                  y: attacker.y + Math.sin(finalAngle) * (attacker.radius + 8),
                  vx: Math.cos(finalAngle) * def.bulletSpeed,
                  vy: Math.sin(finalAngle) * def.bulletSpeed,
                  radius: def.bulletRadius,
                  damage: def.damage,
                  life: 1.4,
                  maxLife: 1.4,
                  color: def.bulletColor,
                  trail: []
                });
              });
            } else {
              projectilesRef.current.push({
                id: 'proj-' + Math.random(),
                ownerId: attacker.id,
                type: attacker.currentWeapon,
                x: attacker.x + Math.cos(angle) * (attacker.radius + 8),
                y: attacker.y + Math.sin(angle) * (attacker.radius + 8),
                vx: Math.cos(angle) * def.bulletSpeed,
                vy: Math.sin(angle) * def.bulletSpeed,
                radius: def.bulletRadius,
                damage: def.damage,
                life: 1.6,
                maxLife: 1.6,
                color: def.bulletColor,
                trail: []
              });
            }

            // If out of ammo, drop weapon
            if (attacker.weaponAmmo <= 0) {
              attacker.currentWeapon = null;
            }
          }
        };

        handleAttacking(f1, f2);
        handleAttacking(f2, f1);

        // Update Projectiles
        projectilesRef.current = projectilesRef.current.filter(p => {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          p.life -= dt;

          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 5) p.trail.shift();

          // Check hit against opponent
          const target = p.ownerId === f1.id ? f2 : f1;
          const distToTarget = Math.hypot(p.x - target.x, p.y - target.y);
          if (distToTarget < p.radius + target.radius) {
            // HIT!
            target.hp = Math.max(0, target.hp - p.damage);
            target.isHit = now;
            onUpdateHp(f1.hp, f2.hp);
            soundEngine.playHit();

            // Knockback impulse
            const pushAngle = Math.atan2(target.y - p.y, target.x - p.x);
            target.vx += Math.cos(pushAngle) * 2.2;
            target.vy += Math.sin(pushAngle) * 2.2;

            // Floating damage indicator text
            floatingTextsRef.current.push({
              id: 'dmg-' + Math.random(),
              text: `-${p.damage}`,
              x: target.x + (Math.random() - 0.5) * 16,
              y: target.y - 25,
              color: '#EF4444',
              life: 0.9,
              maxLife: 0.9,
              fontSize: 20
            });

            // Spark hit particles
            for (let i = 0; i < 10; i++) {
              particlesRef.current.push({
                id: 'part-' + Math.random(),
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: p.color,
                radius: Math.random() * 3 + 1.5,
                life: 0.45,
                maxLife: 0.45,
                alpha: 1.0
              });
            }

            // Check game over
            if (target.hp <= 0 && !isFinishedRef.current) {
              isFinishedRef.current = true;
              const winner = target.id === f1.id ? f2 : f1;
              soundEngine.playVictory();
              soundEngine.playMemeVoice('Khatam! Tata! Bye-bye!', winner.name);
              onGameOver(winner);
            }

            return false;
          }

          // Wall bounce / dissipation
          const distFromCenter = Math.hypot(p.x - centerX, p.y - centerY);
          if (distFromCenter > arenaRadius) {
            return false;
          }

          return p.life > 0;
        });

        // Update Particles
        particlesRef.current = particlesRef.current.filter(part => {
          part.x += part.vx * dt * 60;
          part.y += part.vy * dt * 60;
          part.life -= dt;
          part.alpha = Math.max(0, part.life / part.maxLife);
          return part.life > 0;
        });

        // Update Floating Texts
        floatingTextsRef.current = floatingTextsRef.current.filter(ft => {
          ft.y -= 1.2 * dt * 60;
          ft.life -= dt;
          return ft.life > 0;
        });
      }

      // --- 3. DRAW ITEMS ON ARENA ---
      itemsRef.current.forEach(item => {
        const pulse = Math.sin(time * 0.005 + item.pulsePhase) * 2;
        const r = item.radius + pulse;

        // Item circle background badge
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.arc(item.x, item.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Glowing border
        ctx.strokeStyle = item.type === 'health' ? '#EF4444' : '#64748B';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw weapon icon inside
        drawWeaponIcon(ctx, item.type, item.x, item.y, r);
        ctx.restore();
      });

      // --- 4. DRAW DASHED TARGETING LINE IF FIGHTER READY TO FIRE ---
      // (Exact match to video: yellow dashed line from attacker aiming at defender!)
      dashOffsetRef.current = (dashOffsetRef.current + 0.8) % 16;
      const f1 = f1Ref.current;
      const f2 = f2Ref.current;

      const drawAimingLaser = (attacker: Fighter, defender: Fighter) => {
        if (!attacker.currentWeapon || attacker.weaponAmmo <= 0) return;
        ctx.save();
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -dashOffsetRef.current;
        ctx.beginPath();
        ctx.moveTo(attacker.x, attacker.y);
        ctx.lineTo(defender.x, defender.y);
        ctx.stroke();
        ctx.restore();
      };

      if (f1.currentWeapon && f1.weaponAmmo > 0) drawAimingLaser(f1, f2);
      if (f2.currentWeapon && f2.weaponAmmo > 0) drawAimingLaser(f2, f1);

      // --- 5. DRAW PROJECTILES & TRAILS ---
      projectilesRef.current.forEach(p => {
        ctx.save();
        // Draw trail
        if (p.trail.length > 1) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.radius * 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw projectile head
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 6. DRAW PARTICLES ---
      particlesRef.current.forEach(part => {
        ctx.save();
        ctx.globalAlpha = part.alpha;
        ctx.fillStyle = part.color;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 7. DRAW FIGHTER TOKENS (AVATARS + BADGES) ---
      const drawFighterToken = (f: Fighter) => {
        ctx.save();
        const isRecentlyHit = performance.now() - f.isHit < 180;

        // Hit flash or weapon aura
        if (isRecentlyHit) {
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 18;
        } else if (f.currentWeapon === 'flame') {
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 16;
        }

        // Outer white/colored border ring
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = isRecentlyHit ? '#EF4444' : '#FFFFFF';
        ctx.stroke();

        // Draw Avatar Image inside clipped circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius - 2, 0, Math.PI * 2);
        ctx.clip();

        const img = getAvatarImage(f.avatarUrl);
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(
            img, 
            f.x - f.radius, 
            f.y - f.radius, 
            f.radius * 2, 
            f.radius * 2
          );
        } else {
          // Fallback initial colored disc
          ctx.fillStyle = f.color;
          ctx.fillRect(f.x - f.radius, f.y - f.radius, f.radius * 2, f.radius * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.name.slice(0, 1), f.x, f.y);
        }
        ctx.restore();

        // Draw equipped weapon mini-badge beside fighter if holding a weapon
        if (f.currentWeapon && f.weaponAmmo > 0) {
          const badgeX = f.x + f.radius * 0.8;
          const badgeY = f.y - f.radius * 0.8;
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          drawWeaponIcon(ctx, f.currentWeapon, badgeX, badgeY, 12);
          ctx.restore();
        }

        // Draw Name badge pill right under the token (exact match to video: "Modi ji" / "Abhijit dipke")
        ctx.font = 'bold 13px system-ui, sans-serif';
        const textWidth = ctx.measureText(f.name).width;
        const pillW = textWidth + 14;
        const pillH = 20;
        const pillX = f.x - pillW / 2;
        const pillY = f.y + f.radius + 6;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 8);
        ctx.fill();

        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.name, f.x, pillY + pillH / 2);

        ctx.restore();
      };

      drawFighterToken(f1);
      drawFighterToken(f2);

      // --- 8. DRAW FLOATING DAMAGE & HEAL TEXTS ---
      floatingTextsRef.current.forEach(ft => {
        ctx.save();
        const alpha = Math.max(0, ft.life / ft.maxLife);
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${ft.fontSize}px system-ui, sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameSpeed, gameMode, manualMoveP1, manualMoveP2, onUpdateHp, onGameOver]);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={520}
        height={520}
        className="w-full h-full rounded-full shadow-2xl touch-none select-none"
      />

      {/* Meme Voice Subtitle Overlay (exact match to video captions: "लवडे न भोजन" / "ओहो हमारे गांव में सरकारी स्कूल ठीक करो...") */}
      {activeSubtitle && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 bg-black/85 backdrop-blur-md border border-red-500/60 rounded-full shadow-xl shadow-red-500/20 text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="text-white font-extrabold text-sm md:text-base tracking-wide drop-shadow-md">
            {activeSubtitle}
          </span>
        </div>
      )}
    </div>
  );
};
