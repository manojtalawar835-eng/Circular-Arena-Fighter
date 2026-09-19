import { CharacterPreset } from '../types';

// Crisp, embedded high-resolution SVG avatars tailored to each character likeness
const createModiSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
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
  <!-- Background circle -->
  <circle cx="50" cy="50" r="48" fill="url(#modiBg)" stroke="#FFFFFF" stroke-width="4"/>
  <!-- Torso & Kurta / Nehru Jacket -->
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="url(#jacket)"/>
  <path d="M 44 68 L 56 68 L 54 92 L 46 92 Z" fill="#F8FAFC"/>
  <circle cx="50" cy="74" r="1.5" fill="#334155"/>
  <circle cx="50" cy="80" r="1.5" fill="#334155"/>
  <circle cx="50" cy="86" r="1.5" fill="#334155"/>
  <!-- Head / Face -->
  <ellipse cx="50" cy="46" rx="20" ry="22" fill="#FCD34D"/>
  <!-- White Hair -->
  <path d="M 30 42 C 28 26, 72 26, 70 42 C 68 28, 32 28, 30 42 Z" fill="#F8FAFC"/>
  <path d="M 29 42 C 26 48, 28 56, 32 58 C 30 50, 31 44, 33 42 Z" fill="#E2E8F0"/>
  <path d="M 71 42 C 74 48, 72 56, 68 58 C 70 50, 69 44, 67 42 Z" fill="#E2E8F0"/>
  <!-- White Beard & Moustache -->
  <path d="M 34 52 C 34 68, 66 68, 66 52 C 66 64, 34 64, 34 52 Z" fill="#F1F5F9"/>
  <path d="M 40 50 C 46 54, 54 54, 60 50 C 56 53, 44 53, 40 50 Z" fill="#F8FAFC"/>
  <!-- Eyes & Eyebrows -->
  <ellipse cx="43" cy="43" rx="2.5" ry="1.8" fill="#1E293B"/>
  <ellipse cx="57" cy="43" rx="2.5" ry="1.8" fill="#1E293B"/>
  <path d="M 40 38 Q 43 36 47 38" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 53 38 Q 57 36 60 38" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Spectacles / Glasses (Gold frame) -->
  <rect x="38" y="39" width="10" height="8" rx="3" fill="none" stroke="#D97706" stroke-width="1.8"/>
  <rect x="52" y="39" width="10" height="8" rx="3" fill="none" stroke="#D97706" stroke-width="1.8"/>
  <line x1="48" y1="43" x2="52" y2="43" stroke="#D97706" stroke-width="1.8"/>
  <!-- Forehead mark / Teeka subtle -->
  <circle cx="50" cy="35" r="1.5" fill="#EF4444"/>
</svg>
`)}`;

const createAbhijitSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
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
  <!-- Background circle -->
  <circle cx="50" cy="50" r="48" fill="url(#abhijitBg)" stroke="#FFFFFF" stroke-width="4"/>
  <!-- Polo Shirt with Yellow / White Accent -->
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="url(#polo)"/>
  <path d="M 44 68 L 50 78 L 56 68 Z" fill="#FACC15"/>
  <!-- Face -->
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FBBF24"/>
  <!-- Modern Black Hair -->
  <path d="M 31 42 C 28 24, 72 24, 69 42 C 65 26, 35 26, 31 42 Z" fill="#0F172A"/>
  <path d="M 32 30 C 44 20, 60 22, 68 32 C 60 26, 44 24, 32 30 Z" fill="#1E293B"/>
  <!-- Stylish Trimmed Beard & Moustache -->
  <path d="M 38 52 C 42 66, 58 66, 62 52 C 62 62, 38 62, 38 52 Z" fill="#1E293B"/>
  <path d="M 42 51 C 47 54, 53 54, 58 51 C 54 53, 46 53, 42 51 Z" fill="#0F172A"/>
  <!-- Eyes -->
  <circle cx="44" cy="42" r="2.2" fill="#0F172A"/>
  <circle cx="56" cy="42" r="2.2" fill="#0F172A"/>
  <path d="M 41 37 Q 44 35 48 37" stroke="#0F172A" stroke-width="1.8" fill="none"/>
  <path d="M 52 37 Q 56 35 59 37" stroke="#0F172A" stroke-width="1.8" fill="none"/>
  <!-- Dark Rectangular Glasses -->
  <rect x="38" y="38" width="11" height="8" rx="2" fill="none" stroke="#0F172A" stroke-width="2"/>
  <rect x="51" y="38" width="11" height="8" rx="2" fill="none" stroke="#0F172A" stroke-width="2"/>
  <line x1="49" y1="42" x2="51" y2="42" stroke="#0F172A" stroke-width="2"/>
</svg>
`)}`;

const createRahulSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#ECFDF5" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="#059669"/>
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FDE68A"/>
  <path d="M 31 40 C 30 24, 70 24, 69 40 C 65 26, 35 26, 31 40 Z" fill="#334155"/>
  <circle cx="44" cy="43" r="2" fill="#1E293B"/>
  <circle cx="56" cy="43" r="2" fill="#1E293B"/>
  <path d="M 44 54 Q 50 58 56 54" stroke="#B45309" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

const createYogiSvg = () => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 22 92 C 22 74, 34 68, 50 68 C 66 68, 78 74, 78 92 Z" fill="#D97706"/>
  <ellipse cx="50" cy="46" rx="19" ry="22" fill="#FCD34D"/>
  <circle cx="44" cy="43" r="2" fill="#1E293B"/>
  <circle cx="56" cy="43" r="2" fill="#1E293B"/>
  <path d="M 44 53 Q 50 56 56 53" stroke="#B45309" stroke-width="2" fill="none"/>
  <circle cx="50" cy="34" r="2" fill="#EF4444"/>
</svg>
`)}`;

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
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
    ]
  },
  {
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
    ]
  },
  {
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
      'Darr ko khatam karo!'
    ]
  },
  {
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
      'Suraksha sabse pehle!'
    ]
  }
];
