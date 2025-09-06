export class Clock {
  hour: number;
  minute: number;
  normalized: number;
  
  constructor(hour: number, minute: number = 0) {
    this.normalized = ((((hour * 60) + minute) % (24 * 60)) + (24 * 60)) % (24 * 60);
    this.hour = Math.floor(this.normalized / 60);
    this.minute = this.normalized % 60;
  }

  public toString(): string {
    const time = `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
    return time;
  }

  public plus(minutes: number): Clock {
    const updatedNormalized = this.normalized + minutes;
    return new Clock(0, updatedNormalized);
  }

  public minus(minutes: number): Clock {
    const updatedNormalized = this.normalized - minutes;
    return new Clock(0, updatedNormalized);
  }

  public equals(other: Clock): boolean {
    return this.hour === other.hour && this.minute === other.minute;
  }
}
