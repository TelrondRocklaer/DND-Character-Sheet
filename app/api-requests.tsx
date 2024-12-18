import PlayerCharacter from "@/models/player-character";
import Armor from "@/models/armor";
import Weapon from "@/models/weapon";
import Tool from "@/models/tool";
import ArmorType from "@/models/armor-type";
import WeaponType from "@/models/weaponType";

class ApiRequests {
  static hostName = "http://localhost:5161/api/";

  public static async attemptRegister(username: string, password: string): Promise<boolean> {
    const response = await fetch(this.hostName + "register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.ok;
  }

  public static async attemptLogin(username: string, password: string): Promise<string> {
    const response = await fetch(this.hostName + "login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 401) {
      return "Unauthorized";
    }
    const data = await response.json();
    return data.token;
  }

  public static async getProfile(token: string): Promise<any> {
    if (!token) {
      throw new Error("No token found.");
    }
    const response = await fetch(this.hostName + "profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch profile.");
    }
    return await response.json();
  }

  public static async fetchPlayerCharacter(id: string): Promise<PlayerCharacter> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }
    const response = await fetch(this.hostName + "playercharacters/" + id, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return new PlayerCharacter(data);
  }

  public static async savePlayerCharacter(playerCharacter: PlayerCharacter) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }
    return await fetch(this.hostName + "playercharacters/" + playerCharacter.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(playerCharacter),
    });
  }

  public static async createPlayerCharacter(playerCharacter: PlayerCharacter) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }
    return await fetch(this.hostName + "playerCharacters", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(playerCharacter),
    });
  }

  public static async deletePlayerCharacter(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }
    return await fetch(this.hostName + "playerCharacters/" + id, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
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