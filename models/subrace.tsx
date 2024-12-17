import Trait from "@/models/trait";

export default class Subrace {
  id: number;
  name: string;
  description: string;
  parentRaceId: number;
  traits: Trait[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.parentRaceId = data.parentRaceId;
    this.traits = (data.traits) ? data.traits.map((trait: any) => new Trait(trait)) : [];
  }
}