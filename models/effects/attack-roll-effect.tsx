import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class AttackRollEffect extends Effect {
  sasAdvantageOrDisadvantage: boolean | undefined;
  attackersHaveAdvantageOrDisadvantage: boolean | undefined;
  spellAttackRollBonusModifier: number;
  weaponAttackRollBonusModifier: number;

  constructor(data: any) {
    super(data.$type);
    this.sasAdvantageOrDisadvantage = data.sasAdvantageOrDisadvantage;
    this.attackersHaveAdvantageOrDisadvantage = data.attackersHaveAdvantageOrDisadvantage;
    this.spellAttackRollBonusModifier = data.spellAttackRollBonusModifier;
    this.weaponAttackRollBonusModifier = data.weaponAttackRollBonusModifier;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AttackRollEffect);

    if (existingEffect) {
      playerCharacter.activeEffects.delete(existingEffect);
    }

    if (this.sasAdvantageOrDisadvantage !== undefined) {
      playerCharacter.advantageOnChecks = this.sasAdvantageOrDisadvantage;
    }
    if (this.attackersHaveAdvantageOrDisadvantage !== undefined) {
      playerCharacter.attackersHaveAdvantageOrDisadvantage = this.attackersHaveAdvantageOrDisadvantage;
    }
    playerCharacter.spellAttackRollBonus += this.spellAttackRollBonusModifier;
    playerCharacter.weaponAttackRollBonus += this.weaponAttackRollBonusModifier;

    playerCharacter.activeEffects.add(this);
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    if (this.sasAdvantageOrDisadvantage !== undefined) {
      playerCharacter.advantageOnChecks = false;
    }
    if (this.attackersHaveAdvantageOrDisadvantage !== undefined) {
      playerCharacter.attackersHaveAdvantageOrDisadvantage = false;
    }
    playerCharacter.spellAttackRollBonus -= this.spellAttackRollBonusModifier;
    playerCharacter.weaponAttackRollBonus -= this.weaponAttackRollBonusModifier;

    playerCharacter.activeEffects.delete(this);

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AttackRollEffect);
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}