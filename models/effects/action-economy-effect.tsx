import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class ActionEconomyEffect extends Effect {
  numberOfActions?: number;
  numberOfBonusActions?: number;
  numberOfReactions?: number;

  constructor(data: any) {
    super(data.$type);
    this.numberOfActions = data.numberOfActions;
    this.numberOfBonusActions = data.numberOfBonusActions;
    this.numberOfReactions = data.numberOfReactions;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ActionEconomyEffect);

    if (existingEffect) {
      if (this.numberOfActions && this.numberOfActions < playerCharacter.numberOfActions) {
        playerCharacter.numberOfActions = this.numberOfActions;
      }
      if (this.numberOfBonusActions && this.numberOfBonusActions < playerCharacter.numberOfBonusActions) {
        playerCharacter.numberOfBonusActions = this.numberOfBonusActions;
      }
      if (this.numberOfReactions && this.numberOfReactions < playerCharacter.numberOfReactions) {
        playerCharacter.numberOfReactions = this.numberOfReactions;
      }
      playerCharacter.activeEffects.delete(existingEffect);
    }
    else {
      playerCharacter.numberOfActions = this.numberOfActions ?? playerCharacter.numberOfActions;
      playerCharacter.numberOfBonusActions = this.numberOfBonusActions ?? playerCharacter.numberOfBonusActions;
      playerCharacter.numberOfReactions = this.numberOfReactions ?? playerCharacter.numberOfReactions;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    playerCharacter.numberOfActions = 1;
    playerCharacter.numberOfBonusActions = 1;
    playerCharacter.numberOfReactions = 1;

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ActionEconomyEffect);
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}