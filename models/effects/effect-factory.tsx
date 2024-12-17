import ActionEconomyEffect from "@/models/effects/action-economy-effect";
import AbilityCheckEffect from "@/models/effects/ability-check-effect";
import ArmorClassEffect from "@/models/effects/armor-class-effect";
import AttackRollEffect from "@/models/effects/attack-roll-effect";
import AttributeEffect from "@/models/effects/attribute-effect";
import ConditionEffect from "@/models/effects/condition-effect";
import EsotericEffect from "@/models/effects/esoteric-effect";
import ExtraWeaponDamageEffect from "@/models/effects/extra-weapon-damage-effect";
import OtherCharacterEffect from "@/models/effects/other-character-effect";
import ResistanceEffect from "@/models/effects/resistance-effect";
import SkillEffect from "@/models/effects/skill-effect";
import SpellAttackEffect from "@/models/effects/spell-attack-effect";
import SpellCostEffect from "@/models/effects/spell-cost-effect";
import SpellHealingEffect from "@/models/effects/spell-healing-effect";

export default class EffectFactory {
  public static createEffect(data: any) {
    switch (data.$type) {
      case "AbilityCheckEffect":
        return new AbilityCheckEffect(data);
      case "ActionEconomyEffect":
        return new ActionEconomyEffect(data);
      case "ArmorClassEffect":
        return new ArmorClassEffect(data);
      case "AttackRollEffect":
        return new AttackRollEffect(data);
      case "AttributeEffect":
        return new AttributeEffect(data);
      case "ConditionEffect":
        return new ConditionEffect(data);
      case "EsotericEffect":
        return new EsotericEffect(data);
      case "ExtraWeaponDamageEffect":
        return new ExtraWeaponDamageEffect(data);
      case "OtherCharacterEffect":
        return new OtherCharacterEffect(data);
      case "ResistanceEffect":
        return new ResistanceEffect(data);
      case "SkillEffect":
        return new SkillEffect(data);
      case "SpellAttackEffect":
        return new SpellAttackEffect(data);
      case "SpellCostEffect":
        return new SpellCostEffect(data);
      case "SpellHealingEffect":
        return new SpellHealingEffect(data);
      default:
        throw new Error("Invalid effect type");
    }
  }
}