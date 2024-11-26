class Attributes {
  strength: Attribute = new Attribute("Strength", "STR", 10, [new Skill("athletics")]);
  dexterity: Attribute = new Attribute("Dexterity", "DEX", 10, [new Skill("acrobatics"), new Skill("sleightOfHand"), new Skill("stealth")]);
  constitution: Attribute = new Attribute("Constitution", "CON", 10, []);
  intelligence: Attribute = new Attribute("Intelligence", "INT", 10, [new Skill("arcana"), new Skill("history"), new Skill("investigation"), new Skill("nature"), new Skill("religion")]);
  wisdom: Attribute = new Attribute("Wisdom", "WIS", 10, [new Skill("animalHandling"), new Skill("insight"), new Skill("medicine"), new Skill("perception"), new Skill("survival")]);
  charisma: Attribute = new Attribute("Charisma", "CHA", 10, [new Skill("deception"), new Skill("intimidation"), new Skill("performance"), new Skill("persuasion")]);

  public get(name: string): Attribute | undefined {
    return (this as any)[name];
  }

  public getAttributes = () : Attribute[] => {
    return [this.strength, this.dexterity, this.constitution, this.intelligence, this.wisdom, this.charisma];
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
    this.skills = skills;
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

  constructor(name: string) {
    this.name = name;
    this.proficient = false;
  }
}

export default Attributes;