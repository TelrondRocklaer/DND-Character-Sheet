export default abstract class Proficiency {
  public $type: string = "Proficiency";

  protected constructor(type: string) {
    this.$type = type;
  }

  public abstract applyProficiency(): Promise<void>;

  public abstract removeProficiency(): Promise<void>;

  public abstract equals(proficiency: Proficiency): boolean;
}