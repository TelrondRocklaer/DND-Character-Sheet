import Effect from "@/models/effects/effect";

export default class EsotericEffect extends Effect {
  name: string;
  description: string;

  constructor(data: any) {
    super(data.$type);
    this.name = data.name;
    this.description = data.description;
  }

  applyEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeEffect(): Promise<void> {
    return Promise.resolve(undefined);
  }
}