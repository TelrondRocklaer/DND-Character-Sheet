import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class AttributeEffect extends Effect {
  targetAttribute: string;
  setAttribute: boolean;
  modifier: number;
  addOrRemoveProficiencyInSavingThrows: boolean | undefined;
  hasAdvantageOrDisadvantageOnSavingThrows: boolean | undefined;
  hasAdvantageOrDisadvantageOnAbilityChecks: boolean | undefined;
  automaticallySucceedsOnSavingThrows: boolean | undefined;
  private originalValue: number | undefined;

  constructor(data: any) {
    super(data.$type);
    this.targetAttribute = data.targetAttribute;
    this.setAttribute = data.setAttribute;
    this.modifier = data.modifier;
    this.addOrRemoveProficiencyInSavingThrows = data.addOrRemoveProficiencyInSavingThrows;
    this.hasAdvantageOrDisadvantageOnSavingThrows = data.hasAdvantageOrDisadvantageOnSavingThrows;
    this.hasAdvantageOrDisadvantageOnAbilityChecks = data.hasAdvantageOrDisadvantageOnAbilityChecks;
    this.automaticallySucceedsOnSavingThrows = data.automaticallySucceedsOnSavingThrows;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AttributeEffect && effect.targetAttribute === this.targetAttribute);

    if (existingEffect) {
      playerCharacter.activeEffects.delete(existingEffect);
    }

    const attribute = playerCharacter.attributes[this.targetAttribute];
    this.originalValue = attribute.value;

    if (this.setAttribute) {
      attribute.value = this.modifier;
    } else {
      attribute.value += this.modifier;
    }

    if (this.addOrRemoveProficiencyInSavingThrows !== undefined) {
      attribute.proficient = this.addOrRemoveProficiencyInSavingThrows;
    }
    if (this.hasAdvantageOrDisadvantageOnSavingThrows !== undefined) {
      playerCharacter.advantageOnSavingThrows = this.hasAdvantageOrDisadvantageOnSavingThrows;
    }
    if (this.hasAdvantageOrDisadvantageOnAbilityChecks !== undefined) {
      playerCharacter.advantageOnChecks = this.hasAdvantageOrDisadvantageOnAbilityChecks;
    }
    if (this.automaticallySucceedsOnSavingThrows !== undefined) {
      playerCharacter.automaticallySucceedsOnSavingThrows = this.automaticallySucceedsOnSavingThrows;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const attribute = playerCharacter.attributes[this.targetAttribute];

    if (this.setAttribute && this.originalValue !== undefined) {
      attribute.value = this.originalValue;
    } else {
      attribute.value -= this.modifier;
    }

    if (this.addOrRemoveProficiencyInSavingThrows !== undefined) {
      attribute.proficient = !this.addOrRemoveProficiencyInSavingThrows;
    }
    if (this.hasAdvantageOrDisadvantageOnSavingThrows !== undefined) {
      playerCharacter.advantageOnSavingThrows = false;
    }
    if (this.hasAdvantageOrDisadvantageOnAbilityChecks !== undefined) {
      playerCharacter.advantageOnChecks = false;
    }
    if (this.automaticallySucceedsOnSavingThrows !== undefined) {
      playerCharacter.automaticallySucceedsOnSavingThrows = false;
    }

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof AttributeEffect && effect.targetAttribute === this.targetAttribute) as AttributeEffect | undefined;
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}