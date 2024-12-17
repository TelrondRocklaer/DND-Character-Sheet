import PlayerCharacter from "@/models/player-character";
import Armor from "@/models/armor";
import Weapon from "@/models/weapon";
import Tool from "@/models/tool";
import ArmorType from "@/models/armor-type";
import WeaponType from "@/models/weaponType";

class ApiRequests {
  static hostName = "http://localhost:5161/api/";

  public static async fetchPlayerCharacter(id: string): Promise<PlayerCharacter> {
    const response = await fetch(this.hostName + "playercharacters/" + id);
    const data = await response.json();
    return new PlayerCharacter(data);
  }

  public static async savePlayerCharacter(playerCharacter: PlayerCharacter) {
    return await fetch(this.hostName + "playercharacters/" + playerCharacter.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerCharacter),
    });
  }

  public static async createPlayerCharacter(playerCharacter: PlayerCharacter) {
    return await fetch(this.hostName + "playerCharacters", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerCharacter),
    });
  }

  public static async deletePlayerCharacter(id: string) {
    return await fetch(this.hostName + "playerCharacters/" + id, {
      method: 'DELETE',
    });
  }

  public static async getArmor(id: number) {
    const response = await fetch(this.hostName + "armor/" + id);
    const data = await response.json();
    return new Armor(data);
  }

  public static async getArmorType(id: number) {
    const response = await fetch(this.hostName + "armortypes/" + id);
    const data = await response.json();
    return new ArmorType(data);
  }

  public static async getWeapon(id: number) {
    const response = await fetch(this.hostName + "weapons/" + id);
    const data = await response.json();
    return new Weapon(data);
  }

  public static async getWeaponType(id: number) {
    const response = await fetch(this.hostName + "weapontypes/" + id);
    const data = await response.json();
    return new WeaponType(data);
  }

  public static async getTool(id: number) {
    const response = await fetch(this.hostName + "tools/" + id);
    const data = await response.json();
    return new Tool(data);
  }
}

export default ApiRequests;