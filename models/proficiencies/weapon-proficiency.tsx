import Proficiency from "@/models/proficiencies/proficiency";
import ApiRequests from "@/app/api-requests";
import playerCharacterStore from "@/stores/player-character-store";
import WeaponType from "@/models/weaponType";

export default class WeaponProficiency extends Proficiency {
  public weaponTypeId: number = 0;
  public weaponType: WeaponType | undefined;

  constructor(data: any) {
    super(data.$type);
    this.weaponTypeId = data.weaponTypeId;
  }

  private async initializeWeaponType() {
    this.weaponType = await ApiRequests.getWeaponType(this.weaponTypeId)
  }


  async applyProficiency() {
    await this.initializeWeaponType();
    playerCharacterStore.getState().playerCharacter.weaponProficiencies.add(this.weaponType);
  }

  async removeProficiency() {
    playerCharacterStore.getState().playerCharacter.weaponProficiencies = playerCharacterStore.getState().playerCharacter.weaponProficiencies.filter((wp: WeaponType) => wp.id !== this.weaponTypeId);
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as WeaponProficiency).weaponTypeId === this.weaponTypeId;
  }
}