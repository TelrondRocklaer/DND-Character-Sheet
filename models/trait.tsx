import Effect from "@/models/effects/effect";
import EffectFactory from "@/models/effects/effect-factory";

export default class Trait {
  id: number;
  name: string;
  indexName: string;
  description: string;
  effects: Effect[] = [];
  requirement: string;
  unlockLevel: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
    this.requirement = data.requirement;
    this.unlockLevel = data.unlockLevel;
  }
}