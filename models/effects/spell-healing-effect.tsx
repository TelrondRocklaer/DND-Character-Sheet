import Effect from "@/models/effects/effect";

export default class SpellHealingEffect extends Effect {
  dice: string | undefined;
  amount: number | undefined;
  isTempHP: boolean;

  constructor(data: any) {
    super(data.$type);
    this.dice = data.dice;
    this.amount = data.amount;
    this.isTempHP = data.isTempHP;
  }

  applyEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }
}