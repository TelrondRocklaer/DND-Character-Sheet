import Trait from "@/models/trait";
import Spell from "@/models/spell";

export default class Subclass {
  id: number;
  classId: number;
  name: string;
  description: string;
  traits: Trait[] = [];
  spells: Spell[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.classId = data.classId;
    this.name = data.name;
    this.description = data.description;
    this.traits = (data.traits) ? data.traits.map((trait: any) => new Trait(trait)) : [];
    this.spells = (data.spells) ? data.spells.map((spell: any) => new Spell(spell)) : [];
  }
}