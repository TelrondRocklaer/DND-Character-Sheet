import Proficiency from "@/models/proficiencies/proficiency";
import Trait from "@/models/trait";
import Equipment from "@/models/equipment";
import ProficiencyFactory from "@/models/proficiencies/proficiency-factory";

export default class Class {
  id: number;
  name: string;
  primaryAbility: string;
  hitDie: number;
  specialPointsName: string;
  skillProficiencyOptions: string[];
  startingGold: number;
  proficiencies: Proficiency[];
  startingEquipment: Equipment[];
  traits: Trait[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.primaryAbility = data.primaryAbility;
    this.hitDie = data.hitDie;
    this.specialPointsName = data.specialPointsName;
    this.skillProficiencyOptions = data.skillProficiencyOptions;
    this.startingGold = data.startingGold;
    this.proficiencies = (data.proficiencies) ? data.proficiencies.map((proficiency: any) => {
      return ProficiencyFactory.createProficiency(proficiency);
    }) : [];
    this.startingEquipment = (data.startingEquipment) ? data.startingEquipment.map((equipment: Equipment) => new Equipment(equipment)) : [];
    this.traits = (data.traits) ? data.traits.map((trait: Trait) => new Trait(trait)) : [];
  }
}