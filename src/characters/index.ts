import { CharacterPreset } from './types';
import { modiCharacter, addMemeSoundToModi } from './modi';
import { abhijitCharacter, addMemeSoundToAbhijit } from './abhijit';
import { rahulCharacter, addMemeSoundToRahul } from './rahul';
import { yogiCharacter, addMemeSoundToYogi } from './yogi';
import { kejriwalCharacter, addMemeSoundToKejriwal } from './kejriwal';

export * from './types';
export * from './modi';
export * from './abhijit';
export * from './rahul';
export * from './yogi';
export * from './kejriwal';

/**
 * List of all active character presets
 */
export const CHARACTER_PRESETS: CharacterPreset[] = [
  modiCharacter,
  abhijitCharacter,
  rahulCharacter,
  yogiCharacter,
  kejriwalCharacter
];

/**
 * Lookup character preset by ID
 */
export function getCharacterById(id: string): CharacterPreset | undefined {
  return CHARACTER_PRESETS.find(c => c.id === id);
}

/**
 * Dynamically add a custom meme sound or audio track to any character
 */
export function addCustomMemeSound(characterId: string, soundUrl: string): boolean {
  switch (characterId) {
    case 'modi':
      addMemeSoundToModi(soundUrl);
      return true;
    case 'abhijit':
      addMemeSoundToAbhijit(soundUrl);
      return true;
    case 'rahul':
      addMemeSoundToRahul(soundUrl);
      return true;
    case 'yogi':
      addMemeSoundToYogi(soundUrl);
      return true;
    case 'kejriwal':
      addMemeSoundToKejriwal(soundUrl);
      return true;
    default: {
      const char = CHARACTER_PRESETS.find(c => c.id === characterId);
      if (char) {
        if (!char.audio.memeSounds.includes(soundUrl)) {
          char.audio.memeSounds.push(soundUrl);
        }
        if (!char.customMemeSounds) char.customMemeSounds = [];
        if (!char.customMemeSounds.includes(soundUrl)) {
          char.customMemeSounds.push(soundUrl);
        }
        return true;
      }
      return false;
    }
  }
}
