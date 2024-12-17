import playerCharacterStore from "@/stores/player-character-store";
import Effect from "@/models/effects/effect";

export default class SkillEffect extends Effect {
  attributeName: string;
  skillName: string;
  addOrRemoveProficiency: boolean | undefined;
  hasAdvantageOrDisadvantageOnChecks: boolean | undefined;

  constructor(data: any) {
    super(data.$type);
    this.attributeName = data.attributeName;
    this.skillName = data.skillName;
    this.addOrRemoveProficiency = data.addOrRemoveProficiency;
    this.hasAdvantageOrDisadvantageOnChecks = data.hasAdvantageOrDisadvantageOnChecks;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const skill = playerCharacter.attributes[this.attributeName].skills[this.skillName];

    if (this.addOrRemoveProficiency !== undefined) {
      skill.proficient = this.addOrRemoveProficiency;
    }
    if (this.hasAdvantageOrDisadvantageOnChecks !== undefined) {
      playerCharacter.advantageOnChecks = this.hasAdvantageOrDisadvantageOnChecks;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const skill = playerCharacter.attributes[this.attributeName].skills[this.skillName];

    if (this.addOrRemoveProficiency !== undefined) {
      skill.proficient = !this.addOrRemoveProficiency;
    }
    if (this.hasAdvantageOrDisadvantageOnChecks !== undefined) {
      playerCharacter.advantageOnChecks = false;
    }
  }
}