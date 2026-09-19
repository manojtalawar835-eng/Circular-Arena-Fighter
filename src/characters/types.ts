export interface CharacterAudio {
  /** Main greeting or entrance speech sound */
  greetingSound: string;
  /** Background theme music or victory stinger */
  themeMusic: string;
  /** Collection of iconic meme sounds for attacks, specials, and soundboard */
  memeSounds: string[];
  /** Custom attack impact or grunt audio */
  attackSound?: string;
  /** Victory triumph fanfare sound */
  victorySound?: string;
}

export interface CharacterPreset {
  id: string;
  name: string;
  shortName: string;
  title: string;
  primaryColor: string;
  barColor: string;
  avatarSvg: string; // SVG string or image URL
  audio: CharacterAudio;
  voiceLines: string[];
  speechGreeting: string;
  /** Additional custom meme sounds dynamically added by user */
  customMemeSounds?: string[];
}
