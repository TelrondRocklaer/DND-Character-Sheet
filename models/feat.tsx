import Effect from "@/models/effects/effect";
import EffectFactory from "@/models/effects/effect-factory";

export default class Feat {
  id: number;
  name: string;
  indexName: string;
  description: string;
  effects: Effect[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
  }
}