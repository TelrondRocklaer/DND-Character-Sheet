import Proficiency from "@/models/proficiencies/proficiency";
import Tool from "@/models/tool";
import ApiRequests from "@/app/api-requests";
import playerCharacterStore from "@/stores/player-character-store";

export default class ToolProficiency extends Proficiency
{
  public toolId: number = 0;
  public tool: Tool | undefined;

  constructor(data: any)
  {
    super(data.$type);
    this.toolId = data.toolId;
  }

  private async initializeTool() {
    this.tool = await ApiRequests.getTool(this.toolId);
  }

  async applyProficiency() {
    if (localStorage.getItem('tools') === null) {
      await this.initializeTool();
    }
    else {
      const tools = JSON.parse(localStorage.getItem('tools')!);
      this.tool = tools.find((t: Tool) => t.id === this.toolId);
    }
    playerCharacterStore.getState().playerCharacter.toolProficiencies.add(this.tool);
  }

  async removeProficiency() {
    playerCharacterStore.getState().playerCharacter.toolProficiencies = playerCharacterStore.getState().playerCharacter.toolProficiencies.filter((tp: Tool) => tp.id !== this.toolId);
  }

  equals(proficiency: Proficiency): boolean {
    return proficiency.$type === this.$type && (proficiency as ToolProficiency).toolId === this.toolId;
  }

  toJSON() {
    return {
      $type: this.$type,
      toolId: this.toolId,
    };
  }
}