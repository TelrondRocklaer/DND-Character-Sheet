import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class ArmorClassEffect extends Effect {
  setArmorClass: boolean;
  armorClassModifier: string;

  constructor(data: any) {
    super(data.$type);
    this.setArmorClass = data.setArmorClass;
    this.armorClassModifier = data.armorClassModifier;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ArmorClassEffect);

    if (existingEffect) {
      playerCharacter.activeEffects.delete(existingEffect);
    }

    if (this.setArmorClass) {
      playerCharacter.armorClass = parseInt(this.armorClassModifier);
    }
    else {
      playerCharacter.armorClass += parseInt(this.armorClassModifier);
    }

    playerCharacter.activeEffects.add(this);
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    if (this.setArmorClass) {
      playerCharacter.armorClass = 10;
    }
    else {
      playerCharacter.armorClass -= parseInt(this.armorClassModifier);
    }

    playerCharacter.activeEffects.delete(this);

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ArmorClassEffect);
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}