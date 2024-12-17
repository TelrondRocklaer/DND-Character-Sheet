import Effect from "@/models/effects/effect";
import playerCharacterStore from "@/stores/player-character-store";

export default class ExtraWeaponDamageEffect extends Effect {
  damageType: string;
  damageDie?: string;
  damageBonus?: number;

  constructor(data: any) {
    super(data.$type);
    this.damageType = data.damageType;
    this.damageDie = data.damageDie;
    this.damageBonus = data.damageBonus;
  }

  async applyEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;
    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ExtraWeaponDamageEffect && effect.damageType === this.damageType) as ExtraWeaponDamageEffect | undefined;

    if (existingEffect) {
      playerCharacter.activeEffects.delete(existingEffect);
    }

    if (this.damageDie) {
      playerCharacter.weaponDamageDice.push(this.damageDie);
    }
    if (this.damageBonus) {
      playerCharacter.weaponDamageBonus += this.damageBonus;
    }
  }

  async removeEffect(): Promise<void> {
    const playerCharacter = playerCharacterStore.getState().playerCharacter;

    if (this.damageDie) {
      const index = playerCharacter.weaponDamageDice.indexOf(this.damageDie);
      if (index > -1) {
        playerCharacter.weaponDamageDice.splice(index, 1);
      }
    }
    if (this.damageBonus) {
      playerCharacter.weaponDamageBonus -= this.damageBonus;
    }

    const existingEffect = Array.from(playerCharacter.activeEffects).find(effect => effect instanceof ExtraWeaponDamageEffect && effect.damageType === this.damageType) as ExtraWeaponDamageEffect | undefined;
    if (existingEffect) {
      await existingEffect.applyEffect();
    }
  }
}