import Proficiency from "@/models/proficiencies/proficiency";
import Equipment from "@/models/equipment";
import Feat from "@/models/feat";
import Trait from "@/models/trait";
import ProficiencyFactory from "@/models/proficiencies/proficiency-factory";

export default class Background {
  id: number;
  name: string;
  description: string;
  proficiencies: Proficiency[];
  startingGold: number;
  equipment: Equipment[];
  feats: Feat[] = [];
  traits: Trait[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.proficiencies = (data.proficiencies) ? data.proficiencies.map((proficiency: any) => {
      return ProficiencyFactory.createProficiency(proficiency);
    }) : [];
    this.startingGold = data.startingGold;
    this.equipment = (data.equipment) ? data.equipment.map((equipment: Equipment) => new Equipment(equipment)) : [];
    this.feats = (data.feats) ? data.feats.map((feat: Feat) => new Feat(feat)) : [];
    this.traits = (data.traits) ? data.traits.map((trait: Trait) => new Trait(trait)) : [];
  }
}