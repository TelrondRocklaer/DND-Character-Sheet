class DamageType {
  public damageType: string;
  public vulnerable: boolean;
  public resistant: boolean;
  public immune: boolean;

  constructor(damageType: string) {
    this.damageType = damageType;
    this.vulnerable = false;
    this.resistant = false;
    this.immune = false;
  }
}

class Resistance {
  public bludgeoning: DamageType = new DamageType("bludgeoning");
  public piercing: DamageType = new DamageType("piercing");
  public slashing: DamageType = new DamageType("slashing");
  public fire: DamageType = new DamageType("fire");
  public cold: DamageType = new DamageType("cold");
  public poison: DamageType = new DamageType("poison");
  public acid: DamageType = new DamageType("acid");
  public lightning: DamageType = new DamageType("lightning");
  public thunder: DamageType = new DamageType("thunder");
  public psychic: DamageType = new DamageType("psychic");
  public necrotic: DamageType = new DamageType("necrotic");
  public radiant: DamageType = new DamageType("radiant");
  public force: DamageType = new DamageType("force");

  public get(name: string): DamageType | undefined {
    return (this as any)[name];
  }
}

export default Resistance;