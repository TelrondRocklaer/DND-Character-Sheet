export default class WeaponType {
  id: number;
  name: string;
  isMartial: boolean;
  baseDamage: string;
  damageType: string;
  baseCost: number;
  weight: number;
  properties: { name: string, extraInfo: string | undefined }[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.isMartial = data.isMartial;
    this.baseDamage = data.baseDamage;
    this.damageType = data.damageType;
    this.baseCost = data.baseCost;
    this.weight = data.weight;
    this.properties = data.properties;
  }
}