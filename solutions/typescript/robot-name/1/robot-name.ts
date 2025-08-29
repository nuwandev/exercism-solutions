export class Robot {
  private static names = new Set<string>(); 
  private _name: string = this.generateName();
  
  constructor() { }

  public get name(): string {
    return this._name;
  }

  public resetName(): void {
    this._name = this.generateName();
  }

  public static releaseNames(): void {
    Robot.names.clear();
  }

  private generateName(): string {
    const letter1 = String.fromCharCode(this.getRndInteger(65, 90));
    const letter2 = String.fromCharCode(this.getRndInteger(65, 90));
    const digit1 = this.getRndInteger(0, 9);
    const digit2 = this.getRndInteger(0, 9);
    const digit3 = this.getRndInteger(0, 9);
    const name = `${letter1}${letter2}${digit1}${digit2}${digit3}`;
  
    if (Robot.names.has(name)) {
      return this.generateName();
    }else {
      Robot.names.add(name);
      return name;
    }
  }
  
  private getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
