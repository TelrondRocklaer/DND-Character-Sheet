import Proficiency from "@/models/proficiencies/proficiency";
import usePlayerCharacterStore from "@/stores/player-character-store";

export default class SkillProficiency extends Proficiency {
  public skillName: string = "";

  constructor(data: any) {
    super(data.$type);
    this.skillName = data.skillName;
  }

  async applyProficiency() {
    const playerCharacter = usePlayerCharacterStore.getState().playerCharacter;
    if (playerCharacter) {
      const skill = playerCharacter.attributes.getSkill(this.skillName);
      if (skill) {
        skill.proficient = true;
      }
    }
  }

  async removeProficiency() {
    const playerCharacter = usePlayerCharacterStore.getState().playerCharacter;
    if (playerCharacter) {
      const skill = playerCharacter.attributes.getSkill(this.skillName);
      if (skill) {
        skill.proficient = false;
      }
    }
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as SkillProficiency).skillName === this.skillName;
  }
}