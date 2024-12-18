import Trait from "@/models/trait";
import Spell from "@/models/spell";
import Effect from "@/models/effects/effect";
import EffectFactory from "@/models/effects/effect-factory";
import WeaponType from "@/models/weaponType";
import ApiRequests from "@/app/api-requests";

export default class Weapon {
  id: number;
  name: string;
  indexName: string;
  description: string;
  magicBonus: number;
  weaponTypeId: number;
  weaponType: WeaponType;
  cost: number;
  weight: number;
  effects: Effect[] = [];
  attunementRequired: boolean;
  traits: Trait[];
  spells: Spell[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.magicBonus = data.magicBonus;
    this.weaponTypeId = data.weaponTypeId;
    this.weaponType = data.weaponType;
    this.cost = data.cost;
    this.weight = data.weight;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
    this.attunementRequired = data.attunementRequired;
    this.traits = (data.traits) ? data.traits.map((trait: any) => new Trait(trait)) : [];
    this.spells = (data.spells) ? data.spells : [];
    this.initializeWeaponType();
  }

  async initializeWeaponType() {
    this.weaponType = await ApiRequests.getWeaponType(this.weaponTypeId)
  }
}
