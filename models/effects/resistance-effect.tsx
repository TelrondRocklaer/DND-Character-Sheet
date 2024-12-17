import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class ResistanceEffect extends Effect {
  damageType: string;
  isVulnerable: boolean;
  isResistant: boolean;
  isImmune: boolean;

  constructor(data: any) {
    super(data.$type);
    this.damageType = data.damageType;
    this.isVulnerable = data.isVulnerable;
    this.isResistant = data.isResistant;
    this.isImmune = data.isImmune;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    if (this.isVulnerable) {
      playerCharacter.resistances.vulnerabilities.add(this.damageType);
    }
    if (this.isResistant) {
      playerCharacter.resistances.resistances.add(this.damageType);
    }
    if (this.isImmune) {
      playerCharacter.resistances.immunities.add(this.damageType);
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    if (this.isVulnerable) {
      playerCharacter.resistances.vulnerabilities.delete(this.damageType);
    }
    if (this.isResistant) {
      playerCharacter.resistances.resistances.delete(this.damageType);
    }
    if (this.isImmune) {
      playerCharacter.resistances.immunities.delete(this.damageType);
    }
  }
}