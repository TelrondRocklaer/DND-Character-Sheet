import Attributes from "@/models/attributes";
import Resistance from "@/models/resistance";

class PlayerCharacter {
  id: string;
  name: string = "";
  level: number = 1;
  maxHitPoints: number = 0;
  currentHitPoints: number = 0;
  temporaryHitPoints: number = 0;
  movementSpeed: number = 0;
  numberOfActions: number = 1;
  inspiration: boolean = false;
  numberOfBonusActions: number = 1;
  numberOfReactions: number = 1;
  numberOfSpecialPoints: number = 0;
  currentNumberOfSpecialPoints: number = 0;
  spellSlots: { level: number, maxSlots: number, currentSlots: number }[] = [];
  armorClass: number = 10;
  attributes: Attributes = new Attributes();
  resistances: Resistance = new Resistance();
  advantageOnConcentrationSavingThrows: boolean | undefined;
  advantageOnDeathSavingThrows: boolean | undefined;
  spellAttackRollBonus: number = 0;
  weaponAttackRollBonus: number = 0;
  concentrating: boolean = false;
  exhaustion: number = 0;
  proficiencies: { type: string, proficiency: string}[] = [];
  notes: { title: string, content: string }[] = [];

  constructor(id: string) {
    this.id = id;
  }

  public proficiencyBonus = () : number => {
    return Math.ceil(this.level / 4) + 1;
  }

  public passivePerception = () : number => {
    return 10 + this.attributes.wisdom.modifier() + (this.attributes.wisdom.get("perception")?.proficient ? this.proficiencyBonus() : 0);
  }

  public passiveInvestigation = () : number => {
    return 10 + this.attributes.intelligence.modifier() + (this.attributes.intelligence.get("investigation")?.proficient ? this.proficiencyBonus() : 0);
  }

  public passiveInsight = () : number => {
    return 10 + this.attributes.wisdom.modifier() + (this.attributes.wisdom.get("insight")?.proficient ? this.proficiencyBonus() : 0);
  }
}

export default PlayerCharacter;