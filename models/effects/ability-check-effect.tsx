import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class AbilityCheckEffect extends Effect {
  hasAdvantageOrDisadvantage: boolean;

  constructor(data: any) {
    super(data.$type);
    this.hasAdvantageOrDisadvantage = data.hasAdvantageOrDisadvantage;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AbilityCheckEffect);

    if (existingEffect) {
      if (this.hasAdvantageOrDisadvantage !== playerCharacter.advantageOnChecks) {
        playerCharacter.activeEffects.delete(existingEffect);
      }
    } else {
      playerCharacter.advantageOnChecks = this.hasAdvantageOrDisadvantage;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    playerCharacter.advantageOnChecks = undefined;

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AbilityCheckEffect);
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}