import { CharacterPreset } from './types';

// Crisp vector SVG avatar for Yogi Adityanath
export const createYogiSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="yogiBg" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#yogiBg)" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="#D97706"/>
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FCD34D"/>
  <path d="M 32 38 C 34 26, 66 26, 68 38" stroke="#F59E0B" stroke-width="3" fill="none"/>
  <circle cx="44" cy="43" r="2.2" fill="#1E293B"/>
  <circle cx="56" cy="43" r="2.2" fill="#1E293B"/>
  <path d="M 44 53 Q 50 56 56 53" stroke="#B45309" stroke-width="2" fill="none"/>
  <circle cx="50" cy="34" r="2.2" fill="#EF4444"/>
  <!-- Gold Kundal / Ear rings -->
  <circle cx="29" cy="48" r="2.5" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
  <circle cx="71" cy="48" r="2.5" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
</svg>
`)}`;

export const yogiCharacter: CharacterPreset = {
  id: 'yogi',
  name: 'Yogi ji',
  shortName: 'Yogi',
  title: 'The Enforcer',
  primaryColor: '#F59E0B',
  barColor: '#F59E0B',
  avatarSvg: createYogiSvg(),
  speechGreeting: 'Bulldozer action!',
  voiceLines: [
    'Bulldozer action!',
    'Prashasan tayyar hai!',
    'Suraksha sabse pehle!',
    'Aparadh par zero tolerance!'
  ],
  audio: {
    greetingSound: '/audio/yogi_action.mp3',
    themeMusic: '/audio/yogi_theme.mp3',
    memeSounds: [
      '/audio/yogi_action.mp3'
    ],
    victorySound: '/audio/yogi_theme.mp3'
  },
  customMemeSounds: []
};

/**
 * Add a new meme sound specifically to Yogi ji
 */
export function addMemeSoundToYogi(soundUrl: string) {
  if (!yogiCharacter.audio.memeSounds.includes(soundUrl)) {
    yogiCharacter.audio.memeSounds.push(soundUrl);
  }
  if (!yogiCharacter.customMemeSounds) {
    yogiCharacter.customMemeSounds = [];
  }
  if (!yogiCharacter.customMemeSounds.includes(soundUrl)) {
    yogiCharacter.customMemeSounds.push(soundUrl);
  }
}
