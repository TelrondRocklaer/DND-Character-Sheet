import Attributes from "@/models/attributes";
import Resistance from "@/models/resistance";
import Condition from "@/models/condition";
import Proficiency from "@/models/proficiencies/proficiency";
import ProficiencyFactory from "@/models/proficiencies/proficiency-factory";
import Feat from "@/models/feat";
import Equipment from "@/models/equipment";
import Armor from "@/models/armor";
import Language from "@/models/language";
import Weapon from "@/models/weapon";
import Spell from "@/models/spell";
import Race from "@/models/race";
import Subrace from "@/models/subrace";
import Class from "@/models/class";
import Subclass from "@/models/subclass";
import Background from "@/models/background";
import usePlayerCharacterStore from "@/stores/player-character-store";
import Tool from "@/models/tool";
import ArmorType from "@/models/armor-type";
import WeaponType from "@/models/weaponType";
import Effect from "@/models/effects/effect";

export default class PlayerCharacter {
  id: string;
  name: string = "";
  level: number = 1;
  maxHitPoints: number = 0;
  currentHitPoints: number = 0;
  temporaryHitPoints: number = 0;
  movementSpeed: number = 0;
  numberOfActions: number = 1;
  hitDieCount: number = 1;
  inspiration: boolean = false;
  numberOfBonusActions: number = 1;
  numberOfReactions: number = 1;
  numberOfSpecialPoints: number = 0;
  currentNumberOfSpecialPoints: number = 0;
  spellSlots: { level: number, maxAvailable: number, used: number }[] = [];
  armorClass: number = 10;
  race?: Race;
  subrace?: Subrace;
  class?: Class;
  subclass?: Subclass;
  background?: Background;
  attributes: Attributes = new Attributes();
  resistances: Resistance = new Resistance();
  advantageOnConcentrationSavingThrows: boolean | undefined;
  advantageOnDeathSavingThrows: boolean | undefined;
  spellAttackRollBonus: number = 0;
  weaponAttackRollBonus: number = 0;
  advantageOnChecks: boolean | undefined = false;
  concentrating: boolean = false;
  exhaustion: number = 0;
  notes: { title: string, content: string }[] = [];
  activeConditions: Set<Condition> = new Set<Condition>();
  proficiencies: Set<Proficiency> = new Set<Proficiency>();
  feats: Set<Feat> = new Set<Feat>();
  inventory: Equipment[] = [];
  equippedArmor: Armor[] = [];
  equippedWeapons: Weapon[] = [];
  spells: Set<Spell> = new Set<Spell>();
  languages: Set<Language> = new Set<Language>();

  activeEffects: Set<Effect> = new Set<Effect>();
  armorProficiencies: Set<ArmorType> = new Set<ArmorType>();
  weaponProficiencies: Set<WeaponType> = new Set<WeaponType>();
  toolProficiencies: Set<Tool> = new Set<Tool>();
  simpleWeaponProficiencies: boolean = false;
  martialWeaponProficiencies: boolean = false;
  allArmorProficiencies: boolean = false;
  allToolProficiencies: boolean = false;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    this.maxHitPoints = data.maxHitPoints;
    this.currentHitPoints = data.maxHitPoints;
    this.numberOfSpecialPoints = data.specialPoints;
    this.currentNumberOfSpecialPoints = data.specialPoints;
    this.spellSlots = data.spellSlots;
    this.attributes = new Attributes();
    this.attributes.strength.value = data.attributes.strength.value;
    this.attributes.dexterity.value = data.attributes.dexterity.value;
    this.attributes.constitution.value = data.attributes.constitution.value;
    this.attributes.intelligence.value = data.attributes.intelligence.value;
    this.attributes.wisdom.value = data.attributes.wisdom.value;
    this.attributes.charisma.value = data.attributes.charisma.value;
    this.proficiencies = data.proficiencies ? new Set(data.proficiencies.map((proficiency: Proficiency) => ProficiencyFactory.createProficiency(proficiency))) : new Set<Proficiency>();
    this.notes = data.notes;
    this.race = (data.race) ? new Race(data.race) : undefined;
    this.subrace = (data.subrace) ? new Subrace(data.subrace) : undefined;
    this.class = (data.class) ? new Class(data.class) : undefined;
    this.subclass = (data.subclass) ? new Subclass(data.subclass) : undefined;
    this.background = (data.background) ? new Background(data.background) : undefined;
    this.feats = (data.feats) ? data.feats.map((feat: Feat) => new Feat(feat)) : [];
    this.inventory = (data.inventory) ? data.inventory.map((equipment: Equipment) => new Equipment(equipment)) : [];
    this.equippedArmor = (data.equipedArmor) ? data.equipedArmor.map((armor: Armor) => new Armor(armor)) : [];
    this.equippedWeapons = (data.equipedWeapons) ? data.equipedWeapons.map((weapon: Weapon) => new Weapon(weapon)) : [];
    this.spells = (data.spells) ? data.spells.map((spell: Spell) => new Spell(spell)) : [];
    if (this.class && this.class.proficiencies) {
      this.class.proficiencies.forEach(proficiency => this.proficiencies.add(proficiency));
    }
    if (this.background && this.background.proficiencies) {
      this.background.proficiencies.forEach(proficiency => this.proficiencies.add(proficiency));
    }
    if (this.race && this.race.languages) {
      this.race.languages.forEach(language => this.languages.add(language));
      this.movementSpeed = this.race.baseMovementSpeed;
    }
    data.languages ? data.languages.forEach((language: Language) => this.languages.add(new Language(language))) : [];
    this.languages = new Set<Language>(Array.from(this.languages).reduce((uniqueLanguages: Language[], languageData: any) => {
      const language = new Language(languageData);
      if (!uniqueLanguages.some(l => l.equals(language))) {
        uniqueLanguages.push(language);
      }
      return uniqueLanguages;
    }, []));
    usePlayerCharacterStore.getState().setPlayerCharacter(this);
    const uniqueProficiencies = new Set<Proficiency>();
    this.proficiencies.forEach(proficiency => {
      if (![...uniqueProficiencies].some(p => p.equals(proficiency))) {
        uniqueProficiencies.add(proficiency);
      }
    });
    this.proficiencies = uniqueProficiencies;
    this.proficiencies.forEach(async proficiency => await proficiency.applyProficiency());
    if (this.equippedArmor) {
      this.equippedArmor.forEach(armor => armor.effects.forEach(async effect => await effect.applyEffect()));
    }
    if (this.equippedWeapons) {
      this.equippedWeapons.forEach(weapon => weapon.effects.forEach(async effect => await effect.applyEffect()));
    }
    if (this.feats) {
      this.feats.forEach(feat => feat.effects.forEach(async effect => await effect.applyEffect()));
    }
    if (this.activeConditions) {
      this.activeConditions.forEach(condition => condition.effects.forEach(async effect => await effect.applyEffect()));
    }
  }

  public proficiencyBonus = (): number => {
    return Math.ceil(this.level / 4) + 1;
  }

  public passivePerception = (): number => {
    return 10 + this.attributes.wisdom.modifier() + (this.attributes.wisdom.get("perception")?.proficient ? this.proficiencyBonus() : 0);
  }

  public passiveInvestigation = (): number => {
    return 10 + this.attributes.intelligence.modifier() + (this.attributes.intelligence.get("investigation")?.proficient ? this.proficiencyBonus() : 0);
  }

  public passiveInsight = (): number => {
    return 10 + this.attributes.wisdom.modifier() + (this.attributes.wisdom.get("insight")?.proficient ? this.proficiencyBonus() : 0);
  }

  public initiative = (): number => {
    return this.attributes.dexterity.modifier();
  }

  public longRest = (): void => {
    this.currentHitPoints = this.maxHitPoints;
    this.temporaryHitPoints = 0;
    this.exhaustion = 0;
    this.currentNumberOfSpecialPoints = this.numberOfSpecialPoints;
    this.concentrating = false;
    this.hitDieCount = Math.max(1, Math.floor(this.level / 2));
    this.activeConditions.clear();
    this.spellSlots.forEach(slot => slot.used = 0);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      maxHitPoints: this.maxHitPoints,
      specialPoints: this.numberOfSpecialPoints,
      spellSlots: this.spellSlots,
      attributes: {
        strength: { name: "Strength", value: this.attributes.strength.value },
        dexterity: { name: "Dexterity", value: this.attributes.dexterity.value },
        constitution: { name: "Constitution", value: this.attributes.constitution.value },
        intelligence: { name: "Intelligence", value: this.attributes.intelligence.value },
        wisdom: { name: "Wisdom", value: this.attributes.wisdom.value },
        charisma: { name: "Charisma", value: this.attributes.charisma.value },
      },
      proficiencies: Array.from(this.proficiencies),
      notes: this.notes,
      raceId: this.race ? this.race.id : null,
      race: this.race ? this.race : null,
      subraceId: this.subrace ? this.subrace.id : null,
      subrace: this.subrace ? this.subrace : null,
      classId: this.class ? this.class.id : null,
      class: this.class ? this.class : null,
      subclassId: this.subclass ? this.subclass.id : null,
      subclass: this.subclass ? this.subclass : null,
      backgroundId: this.background ? this.background.id : null,
      background: this.background ? this.background : null,
      feats: Array.from(this.feats),
      inventory: Array.from(this.inventory),
      equippedArmor: this.equippedArmor,
      equippedWeapons: this.equippedWeapons,
      spells: Array.from(this.spells),
      languages: Array.from(this.languages),
    };
  }
}