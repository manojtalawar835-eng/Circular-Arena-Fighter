import { CharacterPreset } from './types';

// Crisp vector SVG avatar for Abhijit Dipke
export const createAbhijitSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="abhijitBg" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#EFF6FF"/>
      <stop offset="100%" stop-color="#BFDBFE"/>
    </radialGradient>
    <linearGradient id="polo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#abhijitBg)" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="url(#polo)"/>
  <path d="M 44 68 L 50 78 L 56 68 Z" fill="#FACC15"/>
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FBBF24"/>
  <path d="M 31 42 C 28 24, 72 24, 69 42 C 65 26, 35 26, 31 42 Z" fill="#0F172A"/>
  <path d="M 32 30 C 44 20, 60 22, 68 32 C 60 26, 44 24, 32 30 Z" fill="#1E293B"/>
  <path d="M 38 52 C 42 66, 58 66, 62 52 C 62 62, 38 62, 38 52 Z" fill="#1E293B"/>
  <path d="M 42 51 C 47 54, 53 54, 58 51 C 54 53, 46 53, 42 51 Z" fill="#0F172A"/>
  <circle cx="44" cy="42" r="2.2" fill="#0F172A"/>
  <circle cx="56" cy="42" r="2.2" fill="#0F172A"/>
  <path d="M 41 37 Q 44 35 48 37" stroke="#0F172A" stroke-width="1.8" fill="none"/>
  <path d="M 52 37 Q 56 35 59 37" stroke="#0F172A" stroke-width="1.8" fill="none"/>
  <rect x="38" y="38" width="11" height="8" rx="2" fill="none" stroke="#0F172A" stroke-width="2"/>
  <rect x="51" y="38" width="11" height="8" rx="2" fill="none" stroke="#0F172A" stroke-width="2"/>
  <line x1="49" y1="42" x2="51" y2="42" stroke="#0F172A" stroke-width="2"/>
</svg>
`)}`;

export const abhijitCharacter: CharacterPreset = {
  id: 'abhijit',
  name: 'Abhijit dipke',
  shortName: 'Abhijit',
  title: 'The Challenger',
  primaryColor: '#3B82F6',
  barColor: '#3B82F6',
  avatarSvg: '/abhijit.png',
  speechGreeting: 'ओहो हमारे गांव में सरकारी स्कूल ठीक करो...',
  voiceLines: [
    'ओहो हमारे गांव में सरकारी स्कूल ठीक करो...',
    'लेने के देने पड़ गए!',
    'अरे भाई भाई भाई!',
    'मज़ा आया!',
    'ये बढ़िया था गुरु!'
  ],
  audio: {
    greetingSound: '/audio/abhijit_dialogue.mp3',
    themeMusic: '/audio/abhijit_theme.mp3',
    memeSounds: [
      '/audio/abhijit_dialogue.mp3',
      '/audio/meme_laugh.mp3'
    ],
    victorySound: '/audio/abhijit_theme.mp3'
  },
  customMemeSounds: []
};

/**
 * Add a new meme sound specifically to Abhijit Dipke
 */
export function addMemeSoundToAbhijit(soundUrl: string) {
  if (!abhijitCharacter.audio.memeSounds.includes(soundUrl)) {
    abhijitCharacter.audio.memeSounds.push(soundUrl);
  }
  if (!abhijitCharacter.customMemeSounds) {
    abhijitCharacter.customMemeSounds = [];
  }
  if (!abhijitCharacter.customMemeSounds.includes(soundUrl)) {
    abhijitCharacter.customMemeSounds.push(soundUrl);
  }
}
