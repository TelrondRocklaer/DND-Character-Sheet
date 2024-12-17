import Proficiency from "@/models/proficiencies/proficiency";
import playerCharacterStore from "@/stores/player-character-store";

export default class ProficiencyGroup extends Proficiency {
  public group: string = "";

  constructor(data: any) {
    super(data.$type);
    this.group = data.proficiencyGroupName;
  }

  async applyProficiency() {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    switch (this.group) {
      case "Simple Weapons":
        playerCharacter.simpleWeaponProficiencies = true;
        break;
      case "Martial Weapons":
        playerCharacter.martialWeaponProficiencies = true;
        break;
      case "Armor":
        playerCharacter.allArmorProficiencies = true;
        break;
      case "Tool":
        playerCharacter.allToolProficiencies = true;
        break;
      case "Skill":
        playerCharacter.attributes.getSkills().forEach((skill: any) => skill.proficient = true);
        break;
      case "Saving Throw":
        playerCharacter.attributes.strength.proficientInSavingThrows = true;
        playerCharacter.attributes.dexterity.proficientInSavingThrows = true;
        playerCharacter.attributes.constitution.proficientInSavingThrows = true;
        playerCharacter.attributes.intelligence.proficientInSavingThrows = true;
        playerCharacter.attributes.wisdom.proficientInSavingThrows = true;
        playerCharacter.attributes.charisma.proficientInSavingThrows = true;
        break;
    }
  }

  async removeProficiency() {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    switch (this.group) {
      case "Simple Weapons":
        playerCharacter.simpleWeaponProficiencies = false;
        break;
      case "Martial Weapons":
        playerCharacter.martialWeaponProficiencies = false;
        break;
      case "Armor":
        playerCharacter.allArmorProficiencies = false;
        break;
      case "Tool":
        playerCharacter.allToolProficiencies = false;
        break;
      case "Skill":
        playerCharacter.attributes.getSkills().forEach((skill: any) => skill.proficient = false);
        playerCharacter.proficiencies.filter((proficiency: Proficiency) => proficiency.$type === "SkillProficiency").forEach(async (proficiency: Proficiency) => await proficiency.applyProficiency());
        break;
      case "Saving Throw":
        playerCharacter.attributes.strength.proficientInSavingThrows = false;
        playerCharacter.attributes.dexterity.proficientInSavingThrows = false;
        playerCharacter.attributes.constitution.proficientInSavingThrows = false;
        playerCharacter.attributes.intelligence.proficientInSavingThrows = false;
        playerCharacter.attributes.wisdom.proficientInSavingThrows = false;
        playerCharacter.attributes.charisma.proficientInSavingThrows = false;
        playerCharacter.proficiencies.filter((proficiency: Proficiency) => proficiency.$type === "SavingThrowProficiency").forEach(async (proficiency: Proficiency) => await proficiency.applyProficiency());
        break;
    }
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as ProficiencyGroup).group === this.group;
  }
}