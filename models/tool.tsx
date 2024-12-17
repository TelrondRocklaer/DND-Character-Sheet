import Equipment from "@/models/equipment";

export default class Tool {
  id: number;
  name: string;
  indexName: string;
  craftableItems: Equipment[];
  actions: {name: string, attribute: string, dc: number}[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.indexName = data.indexName;
    this.craftableItems = (data.craftableItems) ? data.craftableItems : [];
    this.actions = data.actions;
  }
}