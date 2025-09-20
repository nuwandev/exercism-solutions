export class Triangle {
  private side1: number;
  private side2: number;
  private side3: number;
  
  constructor(a: number, b: number, c: number) {
      this.side1 = a;
      this.side2 = b;
      this.side3 = c;
  }

  get isEquilateral() {
    if (!this.isValidTriangle) {
      return false;
    }
    
    return (
      this.side1 === this.side2 && 
      this.side1 === this.side3 && 
      this.side2 === this.side3
    )
  }

  get isIsosceles() {
    if (!this.isValidTriangle) {
      return false;
    }else if (this.isEquilateral) {
      return true
    }
    
    return (
      this.side1 === this.side2 && this.side1 !== this.side3 ||
      this.side1 === this.side3 && this.side1 !== this.side2 ||
      this.side2 === this.side3 && this.side2 !== this.side1
    )
  }

  get isScalene() {
    if (!this.isValidTriangle) {
      return false;
    }
    
    return (
      this.side1 !== this.side2 && 
      this.side1 !== this.side3 && 
      this.side2 !== this.side3
    )
  }

  private get isValidTriangle() {
    return (
      this.side1 + this.side2 > this.side3 &&
      this.side1 + this.side3 > this.side2 &&
      this.side2 + this.side3 > this.side1 &&
      ![this.side1, this.side2, this.side3].includes(0)
    )
  }
}
