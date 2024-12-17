class Attributes {
  strength: Attribute = new Attribute("Strength", "STR", 10, [new Skill("Athletics")]);
  dexterity: Attribute = new Attribute("Dexterity", "DEX", 10, [new Skill("Acrobatics"), new Skill("Sleight Of Hand"), new Skill("Stealth")]);
  constitution: Attribute = new Attribute("Constitution", "CON", 10, []);
  intelligence: Attribute = new Attribute("Intelligence", "INT", 10, [new Skill("Arcana"), new Skill("History"), new Skill("Investigation"), new Skill("Nature"), new Skill("Religion")]);
  wisdom: Attribute = new Attribute("Wisdom", "WIS", 10, [new Skill("Animal Handling"), new Skill("Insight"), new Skill("Medicine"), new Skill("Perception"), new Skill("Survival")]);
  charisma: Attribute = new Attribute("Charisma", "CHA", 10, [new Skill("Deception"), new Skill("Intimidation"), new Skill("Performance"), new Skill("Persuasion")]);

  public getAttribute(name: string): Attribute | undefined {
    return (this as any)[name.toLowerCase()];
  }

  public getSkill(name: string): Skill | undefined {
    return this.getAttributes().reduce((acc: Skill[], attribute: Attribute) => acc.concat(attribute.skills), [])
      .find(skill => skill.name === name);
  }

  public getAttributes = () : Attribute[] => {
    return [this.strength, this.dexterity, this.constitution, this.intelligence, this.wisdom, this.charisma];
  }

  public getSkills = () : Skill[] => {
    return this.getAttributes().reduce((acc: Skill[], attribute: Attribute) => acc.concat(attribute.skills), [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

class Attribute {
  name: string;
  shortName: string;
  value: number;
  proficientInSavingThrows: boolean;
  advantageOnSavingThrows: boolean | undefined;
  advantageOnChecks: boolean | undefined;
  skills: Skill[];

  constructor(name: string, shortName: string, value: number, skills: Skill[]) {
    this.name = name;
    this.shortName = shortName;
    this.value = value;
    this.proficientInSavingThrows = false;
    this.skills = skills.map(skill => {
      skill.parentAttribute = this;
      return skill;
    });
  }

  public modifier = () : number => {
    return Math.floor((this.value - 10) / 2);
  }
  public get(name: string): Skill | undefined {
    return (this as any)[name];
  }
}

class Skill {
  name: string;
  proficient: boolean;
  advantageOnChecks: boolean | undefined;
  parentAttribute: Attribute;

  constructor(name: string) {
    this.name = name;
    this.proficient = false;
    this.parentAttribute = new Attribute("", "", 0, []);
  }
}
export default Attributes;