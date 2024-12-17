import Effect from "@/models/effects/effect";

export default class SpellCostEffect extends Effect {
  action: boolean;
  bonusAction: boolean;
  reaction: boolean;

  constructor(data: any) {
    super(data.$type);
    this.action = data.action;
    this.bonusAction = data.bonusAction;
    this.reaction = data.reaction;
  }

  applyEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }
}