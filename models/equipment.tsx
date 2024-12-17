import EffectFactory from "@/models/effects/effect-factory";
import Effect from "@/models/effects/effect";

export default class Equipment {
  id: number;
  name: string;
  indexName: string;
  description: string;
  cost: number;
  weight: number;
  equipmentCategoryId: number;
  equipmentCategory: {id: number, name: string};
  effects: Effect[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.cost = data.cost;
    this.weight = data.weight;
    this.equipmentCategoryId = data.equipmentCategoryId;
    this.equipmentCategory = data.equipmentCategory;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
  }
}