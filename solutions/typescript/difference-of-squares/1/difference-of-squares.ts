export class Squares {
  private n: number;
  
  constructor(count: number) {
    this.n = count;
  }

  get sumOfSquares(): number {
    return (this.n * (this.n + 1) * (2 * this.n + 1)) / 6;
  }

  get squareOfSum(): number {
    return Math.pow((this.n * (this.n + 1)) / 2, 2);
  }

  get difference(): number {
    return this.squareOfSum - this.sumOfSquares;
  }
}
