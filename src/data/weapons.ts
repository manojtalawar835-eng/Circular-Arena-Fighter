import { WeaponType } from '../types';

export interface WeaponDef {
  type: WeaponType;
  name: string;
  damage: number;
  ammo: number;
  cooldown: number; // ms between attacks
  bulletSpeed: number;
  bulletRadius: number;
  bulletColor: string;
  isMelee?: boolean;
  isAura?: boolean;
  isSpread?: boolean;
  spreadCount?: number;
  isHeal?: boolean;
  healAmount?: number;
  description: string;
}

export const WEAPON_DEFS: Record<WeaponType, WeaponDef> = {
  pistol: {
    type: 'pistol',
    name: 'Pistol',
    damage: 12,
    ammo: 6,
    cooldown: 550,
    bulletSpeed: 7.5,
    bulletRadius: 4,
    bulletColor: '#F59E0B',
    description: 'Accurate single fire handgun'
  },
  mic: {
    type: 'mic',
    name: 'Reporter Mic',
    damage: 15,
    ammo: 4,
    cooldown: 700,
    bulletSpeed: 6.0,
    bulletRadius: 7,
    bulletColor: '#38BDF8',
    description: 'Blasts deafening acoustic headline waves'
  },
  sword: {
    type: 'sword',
    name: 'Broadsword',
    damage: 22,
    ammo: 5,
    cooldown: 600,
    bulletSpeed: 9.0,
    bulletRadius: 6,
    bulletColor: '#FCD34D',
    description: 'High velocity piercing slash blade'
  },
  slingshot: {
    type: 'slingshot',
    name: 'Gulel Slingshot',
    damage: 16,
    ammo: 5,
    cooldown: 650,
    bulletSpeed: 6.8,
    bulletRadius: 5,
    bulletColor: '#A3E635',
    description: 'Elastic slingshot firing heavy bouncing stones'
  },
  ak47: {
    type: 'ak47',
    name: 'AK-47',
    damage: 8,
    ammo: 12,
    cooldown: 220,
    bulletSpeed: 8.5,
    bulletRadius: 3.5,
    bulletColor: '#EF4444',
    description: 'Rapid-fire burst assault rifle'
  },
  flame: {
    type: 'flame',
    name: 'Flame Aura',
    damage: 18,
    ammo: 4,
    cooldown: 650,
    bulletSpeed: 5.5,
    bulletRadius: 8,
    bulletColor: '#F97316',
    isAura: true,
    description: 'Fiery blast ring incinerating enemies'
  },
  trident: {
    type: 'trident',
    name: 'Trishul',
    damage: 25,
    ammo: 3,
    cooldown: 800,
    bulletSpeed: 7.2,
    bulletRadius: 6,
    bulletColor: '#EAB308',
    description: 'Sacred trident with high penetration'
  },
  shotgun: {
    type: 'shotgun',
    name: 'Shotgun',
    damage: 9,
    ammo: 4,
    cooldown: 850,
    bulletSpeed: 6.5,
    bulletRadius: 4,
    bulletColor: '#FB923C',
    isSpread: true,
    spreadCount: 3,
    description: 'Heavy multi-pellet blast'
  },
  laser: {
    type: 'laser',
    name: 'Plasma Blaster',
    damage: 20,
    ammo: 5,
    cooldown: 600,
    bulletSpeed: 11.0,
    bulletRadius: 4.5,
    bulletColor: '#EC4899',
    description: 'Instant futuristic laser beam'
  },
  health: {
    type: 'health',
    name: 'Medical Heart',
    damage: 0,
    ammo: 1,
    cooldown: 0,
    bulletSpeed: 0,
    bulletRadius: 0,
    bulletColor: '#EF4444',
    isHeal: true,
    healAmount: 25,
    description: 'Restores +25 HP on touch'
  },
  bomb: {
    type: 'bomb',
    name: 'Dynamite',
    damage: 30,
    ammo: 2,
    cooldown: 900,
    bulletSpeed: 4.8,
    bulletRadius: 7,
    bulletColor: '#DC2626',
    description: 'Heavy explosive causing massive shockwave'
  }
};
