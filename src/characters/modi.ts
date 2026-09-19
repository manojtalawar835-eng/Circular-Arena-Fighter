import { CharacterPreset } from './types';

// Crisp vector SVG avatar for Modi ji
export const createModiSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="modiBg" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFF7ED"/>
      <stop offset="100%" stop-color="#FED7AA"/>
    </radialGradient>
    <linearGradient id="jacket" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#modiBg)" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="url(#jacket)"/>
  <path d="M 44 68 L 56 68 L 54 92 L 46 92 Z" fill="#F8FAFC"/>
  <circle cx="50" cy="74" r="1.5" fill="#334155"/>
  <circle cx="50" cy="80" r="1.5" fill="#334155"/>
  <circle cx="50" cy="86" r="1.5" fill="#334155"/>
  <ellipse cx="50" cy="46" rx="20" ry="22" fill="#FCD34D"/>
  <path d="M 30 42 C 28 26, 72 26, 70 42 C 68 28, 32 28, 30 42 Z" fill="#F8FAFC"/>
  <path d="M 29 42 C 26 48, 28 56, 32 58 C 30 50, 31 44, 33 42 Z" fill="#E2E8F0"/>
  <path d="M 71 42 C 74 48, 72 56, 68 58 C 70 50, 69 44, 67 42 Z" fill="#E2E8F0"/>
  <path d="M 34 52 C 34 68, 66 68, 66 52 C 66 64, 34 64, 34 52 Z" fill="#F1F5F9"/>
  <path d="M 40 50 C 46 54, 54 54, 60 50 C 56 53, 44 53, 40 50 Z" fill="#F8FAFC"/>
  <ellipse cx="43" cy="43" rx="2.5" ry="1.8" fill="#1E293B"/>
  <ellipse cx="57" cy="43" rx="2.5" ry="1.8" fill="#1E293B"/>
  <path d="M 40 38 Q 43 36 47 38" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 53 38 Q 57 36 60 38" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="38" y="39" width="10" height="8" rx="3" fill="none" stroke="#D97706" stroke-width="1.8"/>
  <rect x="52" y="39" width="10" height="8" rx="3" fill="none" stroke="#D97706" stroke-width="1.8"/>
  <line x1="48" y1="43" x2="52" y2="43" stroke="#D97706" stroke-width="1.8"/>
  <circle cx="50" cy="35" r="1.5" fill="#EF4444"/>
</svg>
`)}`;

export const modiCharacter: CharacterPreset = {
  id: 'modi',
  name: 'Modi ji',
  shortName: 'Modi ji',
  title: 'The Leader',
  primaryColor: '#EF4444',
  barColor: '#EF4444',
  avatarSvg: '/modi.png',
  speechGreeting: 'लवडे न भोजन',
  voiceLines: [
    'लवडे न भोजन',
    'वाह मोदी जी वाह!',
    'मित्रों!',
    'खत्म! टाटा! बाय-बाय!',
    'अबकी बार अरीना पार!'
  ],
  audio: {
    greetingSound: '/audio/modi_dialogue.mp3',
    themeMusic: '/audio/modi_theme.mp3',
    memeSounds: [
      '/audio/modi_dialogue.mp3',
      '/audio/modi_mitron.mp3',
      '/audio/modi_wah.mp3'
    ],
    victorySound: '/audio/modi_theme.mp3'
  },
  customMemeSounds: []
};

/**
 * Add a new meme sound specifically to Modi ji
 */
export function addMemeSoundToModi(soundUrl: string) {
  if (!modiCharacter.audio.memeSounds.includes(soundUrl)) {
    modiCharacter.audio.memeSounds.push(soundUrl);
  }
  if (!modiCharacter.customMemeSounds) {
    modiCharacter.customMemeSounds = [];
  }
  if (!modiCharacter.customMemeSounds.includes(soundUrl)) {
    modiCharacter.customMemeSounds.push(soundUrl);
  }
}
