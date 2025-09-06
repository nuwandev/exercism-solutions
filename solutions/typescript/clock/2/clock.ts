export class Clock {
  private hour: number;
  private minute: number;
  
  constructor(hour: number, minute: number = 0) {
    const totalMinutes = (((hour * 60 + minute) % (24 * 60)) + (24 * 60)) % (24 * 60);
    this.hour = Math.floor(totalMinutes / 60);
    this.minute = totalMinutes % 60;
  }

  public toString(): string {
    const time = `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
    return time;
  }

  public plus(minutes: number): Clock {
    return new Clock(this.hour, this.minute + minutes);
  }

  public minus(minutes: number): Clock {
    return new Clock(this.hour, this.minute - minutes);
  }

  public equals(other: Clock): boolean {
    return this.hour === other.hour && this.minute === other.minute;
  }
}
