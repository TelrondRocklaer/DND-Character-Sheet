import Trait from "@/models/trait";
import Spell from "@/models/spell";
import EffectFactory from "@/models/effects/effect-factory";
import Effect from "@/models/effects/effect";
import ArmorType from "@/models/armor-type";
import ApiRequests from "@/app/api-requests";

export default class Armor {
  id: number;
  name: string;
  indexName: string;
  description: string;
  cost: number;
  weight: number;
  baseArmorClass: number;
  effects: Effect[] = [];
  armorTypeId: number;
  armorType: ArmorType;
  traits: Trait[] = [];
  spells: Spell[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.cost = data.cost;
    this.weight = data.weight;
    this.baseArmorClass = data.baseArmorClass;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
    this.armorTypeId = data.armorTypeId;
    this.armorType = data.armorType;
    this.traits = (data.traits) ? data.traits.map((trait: Trait) => new Trait(trait)) : [];
    this.spells = (data.spells) ? data.spells : [];
    this.initializeArmorType();
  }

  async initializeArmorType() {
    this.armorType = await ApiRequests.getArmorType(this.armorTypeId)
  }
}