export class Gigasecond {
  private startDate: Date;
  private static readonly GIGASECOND_IN_MS = 1e9 * 1000;
  
  constructor(startDate: Date) {
    this.startDate = startDate;
  }
  public date(): Date {
    return new Date(this.startDate.getTime() + Gigasecond.GIGASECOND_IN_MS);
  }
}
