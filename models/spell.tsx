import Effect from "@/models/effects/effect";
import EffectFactory from "@/models/effects/effect-factory";

export default class Spell {
  id: number;
  name: string;
  indexName: string;
  description: string;
  canTargetSelf: boolean;
  effects: Effect[] = [];
  spellSlotLevel: number;
  upcastEffect: string;
  upgradeLevels: number[];
  baseNumberOfCasts: number;
  range: string;
  verbalComponent: boolean;
  somaticComponent: boolean;
  materialComponent: boolean;
  materialComponentDescription: string;
  duration: string;
  castingTime: string;
  isRitual: boolean;
  cooldown: string;
  concentration: boolean;
  isRecurring: boolean;
  isRecurringOnMove: boolean;
  school: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.description = data.description;
    this.canTargetSelf = data.canTargetSelf;
    this.effects = (data.effects) ? data.effects.map((effect: Effect) => EffectFactory.createEffect(effect)) : [];
    this.spellSlotLevel = data.spellSlotLevel;
    this.upcastEffect = data.upcastEffect;
    this.upgradeLevels = data.upgradeLevels;
    this.baseNumberOfCasts = data.baseNumberOfCasts;
    this.range = data.range;
    this.verbalComponent = data.verbalComponent;
    this.somaticComponent = data.somaticComponent;
    this.materialComponent = data.materialComponent;
    this.materialComponentDescription = data.materialComponentDescription;
    this.duration = data.duration;
    this.castingTime = data.castingTime;
    this.isRitual = data.isRitual;
    this.cooldown = data.cooldown;
    this.concentration = data.concentration;
    this.isRecurring = data.isRecurring;
    this.isRecurringOnMove = data.isRecurringOnMove;
    this.school = data.school;
  }
}