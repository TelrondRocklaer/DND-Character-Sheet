import Trait from "@/models/trait";
import Language from "@/models/language";

export default class Race {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  size: string;
  baseMovementSpeed: number;
  traits: Trait[] = [];
  languages: Language[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.fullDescription = data.fullDescription;
    this.size = data.size;
    this.baseMovementSpeed = data.baseMovementSpeed;
    this.traits = (data.traits) ? data.traits.map((trait: any) => new Trait(trait)) : [];
    this.languages = (data.languages) ? data.languages.map((language: any) => new Language(language)) : [];
  }
}