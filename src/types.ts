export type GameMode = 'spectate' | 'single' | 'twoplayer';

export interface Fighter {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
  barColor: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  currentWeapon: WeaponType | null;
  weaponAmmo: number;
  lastAttackTime: number;
  isHit: number; // timestamp or countdown for hit flash
  hasShield: boolean;
  shieldDuration: number;
  voiceLines: string[];
}

export type WeaponType = 
  | 'pistol' 
  | 'mic' 
  | 'sword' 
  | 'slingshot' 
  | 'ak47' 
  | 'flame' 
  | 'trident' 
  | 'shotgun' 
  | 'laser' 
  | 'health' 
  | 'bomb';

export interface WeaponItem {
  id: string;
  type: WeaponType;
  x: number;
  y: number;
  radius: number;
  spawnTime: number;
  pulsePhase: number;
}

export interface Projectile {
  id: string;
  ownerId: string;
  type: WeaponType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  maxLife: number;
  color: string;
  trail: { x: number; y: number }[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
  alpha: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  fontSize: number;
}

export interface CharacterPreset {
  id: string;
  name: string;
  shortName: string;
  title: string;
  primaryColor: string;
  barColor: string;
  avatarSvg: string; // SVG data or path
  voiceLines: string[];
  speechGreeting: string;
}
