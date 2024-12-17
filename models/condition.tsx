import Effect from "@/models/effects/effect";
import EffectFactory from "@/models/effects/effect-factory";

export default class Condition {
  id: number;
  name: string;
  description: string;
  effects: Effect[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
  }
}