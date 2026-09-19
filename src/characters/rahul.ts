import { CharacterPreset } from './types';

// Crisp vector SVG avatar for Rahul Gandhi
export const createRahulSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="rahulBg" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#ECFDF5"/>
      <stop offset="100%" stop-color="#A7F3D0"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#rahulBg)" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="#059669"/>
  <path d="M 46 68 L 54 68 L 52 92 L 48 92 Z" fill="#FFFFFF"/>
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FDE68A"/>
  <path d="M 31 40 C 30 24, 70 24, 69 40 C 65 26, 35 26, 31 40 Z" fill="#334155"/>
  <path d="M 36 53 C 40 64, 60 64, 64 53" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="44" cy="43" r="2.2" fill="#1E293B"/>
  <circle cx="56" cy="43" r="2.2" fill="#1E293B"/>
  <path d="M 44 54 Q 50 58 56 54" stroke="#B45309" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

export const rahulCharacter: CharacterPreset = {
  id: 'rahul',
  name: 'Rahul ji',
  shortName: 'Rahul',
  title: 'The Yatri',
  primaryColor: '#10B981',
  barColor: '#10B981',
  avatarSvg: createRahulSvg(),
  speechGreeting: 'Maza aaya!',
  voiceLines: [
    'Maza aaya!',
    'Khatam! Tata! Bye-bye!',
    'Darr ko khatam karo!',
    'Aisi machine lagaunga!'
  ],
  audio: {
    greetingSound: '/audio/rahul_maza.mp3',
    themeMusic: '/audio/rahul_theme.mp3',
    memeSounds: [
      '/audio/rahul_maza.mp3',
      '/audio/rahul_khatam.mp3'
    ],
    victorySound: '/audio/rahul_theme.mp3'
  },
  customMemeSounds: []
};

/**
 * Add a new meme sound specifically to Rahul ji
 */
export function addMemeSoundToRahul(soundUrl: string) {
  if (!rahulCharacter.audio.memeSounds.includes(soundUrl)) {
    rahulCharacter.audio.memeSounds.push(soundUrl);
  }
  if (!rahulCharacter.customMemeSounds) {
    rahulCharacter.customMemeSounds = [];
  }
  if (!rahulCharacter.customMemeSounds.includes(soundUrl)) {
    rahulCharacter.customMemeSounds.push(soundUrl);
  }
}
