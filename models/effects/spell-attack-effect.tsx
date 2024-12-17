import Effect from "@/models/effects/effect";

export default class SpellAttackEffect extends Effect {
  dice: string | undefined;
  isAttackRoll: boolean;
  damageType: string | undefined;
  savingThrowAttribute: string | undefined;
  savingThrowDC: number | undefined;
  savingThrowSuccessEffect: string | undefined;

  constructor(data: any) {
    super(data.$type);
    this.dice = data.dice;
    this.isAttackRoll = data.isAttackRoll;
    this.damageType = data.damageType;
    this.savingThrowAttribute = data.savingThrowAttribute;
    this.savingThrowDC = data.savingThrowDC;
    this.savingThrowSuccessEffect = data.savingThrowSuccessEffect;
  }

  applyEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }
}