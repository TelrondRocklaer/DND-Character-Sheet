import SkillProficiency from "@/models/proficiencies/skill-proficiency";
import SavingThrowProficiency from "@/models/proficiencies/saving-throw-proficiency";
import ArmorProficiency from "@/models/proficiencies/armor-proficiency";
import ProficiencyGroup from "@/models/proficiencies/proficiency-group";
import WeaponProficiency from "@/models/proficiencies/weapon-proficiency";
import ToolProficiency from "@/models/proficiencies/tool-proficiency";

export default class ProficiencyFactory {
  public static createProficiency(data: any) {
    switch (data.$type) {
      case "ArmorProficiency":
        return new ArmorProficiency(data);
      case "ProficiencyGroup":
        return new ProficiencyGroup(data);
      case "SavingThrowProficiency":
        return new SavingThrowProficiency(data);
      case "SkillProficiency":
        return new SkillProficiency(data);
      case "ToolProficiency":
        return new ToolProficiency(data);
      case "WeaponProficiency":
        return new WeaponProficiency(data);
      default:
        throw new Error("Invalid proficiency type");
    }
  }
}