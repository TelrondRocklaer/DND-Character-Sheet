import Proficiency from "@/models/proficiencies/proficiency";
import playerCharacterStore from "@/stores/player-character-store";
import ApiRequests from "@/app/api-requests";
import ArmorType from "@/models/armor-type";

export default class ArmorProficiency extends Proficiency {
  public armorTypeId: number = 0;
  public armorType: ArmorType | undefined;

  constructor(data: any) {
    super(data.$type);
    this.armorTypeId = data.armorTypeId;
  }

  private async initializeArmorType() {
    this.armorType = await ApiRequests.getArmorType(this.armorTypeId)
  }

  async applyProficiency() {
    await this.initializeArmorType();
    playerCharacterStore.getState().playerCharacter.armorProficiencies.add(this.armorType);
  }

  async removeProficiency() {
    playerCharacterStore.getState().playerCharacter.armorProficiencies = playerCharacterStore.getState().playerCharacter.armorProficiencies.filter((ap: ArmorType) => ap.id !== this.armorTypeId);
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as ArmorProficiency).armorTypeId === this.armorTypeId;
  }

}