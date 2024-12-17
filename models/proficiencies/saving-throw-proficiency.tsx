import Proficiency from "@/models/proficiencies/proficiency";
import usePlayerCharacterStore from "@/stores/player-character-store";

export default class SavingThrowProficiency extends Proficiency {
  public ability: string = "";

  constructor(data: any) {
    super(data.$type);
    this.ability = data.ability;
  }

  async applyProficiency() {
    const playerCharacter = usePlayerCharacterStore.getState().playerCharacter;
    if (playerCharacter) {
      const attribute = playerCharacter.attributes.getAttribute(this.ability);
      if (attribute) {
        attribute.proficientInSavingThrows = true;
      }
    }
  }

  async removeProficiency() {
    const playerCharacter = usePlayerCharacterStore.getState().playerCharacter;
    if (playerCharacter) {
      const attribute = playerCharacter.attributes.getAttribute(this.ability);
      if (attribute) {
        attribute.proficientInSavingThrows = false;
      }
    }
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as SavingThrowProficiency).ability === this.ability;
  }
}