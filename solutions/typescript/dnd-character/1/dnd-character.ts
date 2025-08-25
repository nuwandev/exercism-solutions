export class DnDCharacter {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  hitpoints: number;
  
  constructor(){
    this.strength = DnDCharacter.generateAbilityScore();
    this.dexterity = DnDCharacter.generateAbilityScore();
    this.constitution = DnDCharacter.generateAbilityScore();
    this.intelligence = DnDCharacter.generateAbilityScore();
    this.wisdom = DnDCharacter.generateAbilityScore();
    this.charisma = DnDCharacter.generateAbilityScore();
    this.hitpoints = 10 + DnDCharacter.getModifierFor(this.constitution)
  }
  
  public static generateAbilityScore(): number {
    const dice1 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    const dice2 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    const dice3 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    const dice4 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

    let arrOfResults: number[] = [dice1, dice2, dice3, dice4]

    arrOfResults = arrOfResults.sort((a,b)=> b-a)
    arrOfResults.splice(arrOfResults.indexOf(Math.min(...arrOfResults)),1)

    let sum = 0;
    for (let res of arrOfResults) {
      sum+= res;
    }

    return sum;
  }

  public static getModifierFor(abilityValue: number): number {
    return Math.floor((abilityValue - 10) / 2)
  }
}
