import playerCharacterStore from "@/stores/player-character-store";
import Effect from "@/models/effects/effect";

export default class OtherCharacterEffect extends Effect {
  movementSpeedModifier: number;
  specialPointsModifier: number;
  spellSlotModifier: { level: number, modifier: number };
  hasAdvantageOrDisadvantageOnConcentrationSavingThrows: boolean | undefined;

  constructor(data: any) {
    super(data.$type);
    this.movementSpeedModifier = data.movementSpeedModifier;
    this.specialPointsModifier = data.specialPointsModifier;
    this.spellSlotModifier = data.spellSlotModifier;
    this.hasAdvantageOrDisadvantageOnConcentrationSavingThrows = data.hasAdvantageOrDisadvantageOnConcentrationSavingThrows;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    playerCharacter.movementSpeed += this.movementSpeedModifier;
    playerCharacter.currentNumberOfSpecialPoints += this.specialPointsModifier;

    const spellSlot = playerCharacter.spellSlots.find((slot: any) => slot.level === this.spellSlotModifier.level);
    if (spellSlot) {
      spellSlot.maxAvailable += this.spellSlotModifier.modifier;
    }

    if (this.hasAdvantageOrDisadvantageOnConcentrationSavingThrows !== undefined) {
      playerCharacter.advantageOnConcentrationSavingThrows = this.hasAdvantageOrDisadvantageOnConcentrationSavingThrows;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    playerCharacter.movementSpeed -= this.movementSpeedModifier;
    playerCharacter.currentNumberOfSpecialPoints -= this.specialPointsModifier;

    const spellSlot = playerCharacter.spellSlots.find((slot: any) => slot.level === this.spellSlotModifier.level);
    if (spellSlot) {
      spellSlot.maxAvailable -= this.spellSlotModifier.modifier;
    }

    if (this.hasAdvantageOrDisadvantageOnConcentrationSavingThrows !== undefined) {
      playerCharacter.advantageOnConcentrationSavingThrows = false;
    }
  }
}