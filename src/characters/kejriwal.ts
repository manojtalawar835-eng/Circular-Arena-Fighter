import { CharacterPreset } from './types';

// Crisp vector SVG avatar for Arvind Kejriwal with his iconic muffler and AAP topi
export const createKejriwalSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="kejriBg" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </radialGradient>
    <linearGradient id="sweater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#kejriBg)" stroke="#FFFFFF" stroke-width="4"/>
  <!-- Dark sweater -->
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="url(#sweater)"/>
  <!-- Iconic Muffler wrapped around neck -->
  <path d="M 30 64 C 36 60, 64 60, 70 64 C 74 72, 26 72, 30 64 Z" fill="#92400E"/>
  <path d="M 38 66 L 36 92 L 44 92 L 46 66 Z" fill="#B45309"/>
  <!-- Face -->
  <ellipse cx="50" cy="46" rx="19" ry="21" fill="#FDE047"/>
  <!-- Iconic AAP White Cap / Topi -->
  <path d="M 28 32 C 32 18, 68 18, 72 32 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="27" y="30" width="46" height="5" rx="2" fill="#E2E8F0"/>
  <!-- Hair & Moustache -->
  <path d="M 32 40 C 30 33, 70 33, 68 40" stroke="#1E293B" stroke-width="2" fill="none"/>
  <path d="M 42 53 C 46 55, 54 55, 58 53" stroke="#1E293B" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="43" cy="43" r="2.2" fill="#1E293B"/>
  <circle cx="57" cy="43" r="2.2" fill="#1E293B"/>
  <!-- Thin Rim Eyeglasses -->
  <rect x="37" y="39" width="11" height="8" rx="2" fill="none" stroke="#475569" stroke-width="1.8"/>
  <rect x="52" y="39" width="11" height="8" rx="2" fill="none" stroke="#475569" stroke-width="1.8"/>
  <line x1="48" y1="43" x2="52" y2="43" stroke="#475569" stroke-width="1.8"/>
</svg>
`)}`;

export const kejriwalCharacter: CharacterPreset = {
  id: 'kejriwal',
  name: 'Arvind Kejriwal',
  shortName: 'Kejriwal',
  title: 'The Muffler Man',
  primaryColor: '#0EA5E9',
  barColor: '#0EA5E9',
  avatarSvg: createKejriwalSvg(),
  speechGreeting: 'सब मिले हुए हैं जी!',
  voiceLines: [
    'सब मिले हुए हैं जी!',
    'तो मैं क्या करूँ नौकरी छोड़ दूँ?',
    'धरना शुरू होगा!',
    'बिजली-पानी मुफ्त!'
  ],
  audio: {
    greetingSound: '/audio/kejriwal_dialogue.mp3',
    themeMusic: '/audio/kejriwal_theme.mp3',
    memeSounds: [
      '/audio/kejriwal_dialogue.mp3',
      '/audio/kejriwal_meme.mp3'
    ],
    victorySound: '/audio/kejriwal_theme.mp3'
  },
  customMemeSounds: []
};

/**
 * Add a new meme sound specifically to Arvind Kejriwal
 */
export function addMemeSoundToKejriwal(soundUrl: string) {
  if (!kejriwalCharacter.audio.memeSounds.includes(soundUrl)) {
    kejriwalCharacter.audio.memeSounds.push(soundUrl);
  }
  if (!kejriwalCharacter.customMemeSounds) {
    kejriwalCharacter.customMemeSounds = [];
  }
  if (!kejriwalCharacter.customMemeSounds.includes(soundUrl)) {
    kejriwalCharacter.customMemeSounds.push(soundUrl);
  }
}
