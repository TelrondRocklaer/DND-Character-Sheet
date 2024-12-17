export default abstract class Effect {
  public $type: string = "Proficiency";

  protected constructor(type: string) {
    this.$type = type;
  }

  public abstract applyEffect(): Promise<void>;

  public abstract removeEffect(): Promise<void>;
}