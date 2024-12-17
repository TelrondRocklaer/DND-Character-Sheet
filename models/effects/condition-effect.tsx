import Condition from "@/models/condition";
import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class ConditionEffect extends Effect {
  condition?: Condition;
  savingThrowAttribute: string;
  savingThrowDC: number;

  constructor(data: any) {
    super(data.$type);
    this.condition = (data.condition !== null) ? new Condition(data.condition) : undefined;
    this.savingThrowAttribute = data.savingThrowAttribute;
    this.savingThrowDC = data.savingThrowDC;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    if (this.condition) {
      playerCharacter.activeConditions.add(this.condition);
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    if (this.condition) {
      playerCharacter.activeConditions.delete(this.condition);
    }
  }
}