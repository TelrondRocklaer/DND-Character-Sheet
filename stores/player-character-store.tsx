import { create } from 'zustand';
import PlayerCharacter from '@/models/player-character';

const usePlayerCharacterStore = create((set: any) => ({
  playerCharacter: set.playerCharacter,
  setPlayerCharacter: (character: PlayerCharacter) => set({ playerCharacter: character })
}));

export default usePlayerCharacterStore;