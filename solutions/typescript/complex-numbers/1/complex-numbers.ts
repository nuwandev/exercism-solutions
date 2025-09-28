export class ComplexNumber {
  private realNum: number;
  private imaginaryNum: number;
  
  constructor(real: number, imaginary: number) {
    this.realNum = real;
    this.imaginaryNum = imaginary; 
  }

  public get real(): number {
    return this.realNum;
  }

  public get imag(): number {
    return this.imaginaryNum;
  }

  public add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.realNum + other.real,
      this.imaginaryNum + other.imag
    )
  }

  public sub(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.realNum - other.real,
      this.imaginaryNum - other.imag
    )
  }

  public div(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      (this.realNum * other.real + this.imaginaryNum * other.imag) / (other.real * other.real + other.imag * other.imag),
      (this.imaginaryNum * other.real - this.realNum * other.imag) / (other.real * other.real + other.imag * other.imag)
    )
  }

  public mul(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      (this.realNum * other.real - this.imaginaryNum * other.imag),
      (this.imaginaryNum * other.real + this.realNum * other.imag)
    )
  }

  public get abs(): number {
    return Math.sqrt(this.realNum*this.realNum + this.imaginaryNum*this.imaginaryNum)
  }
  
  public get conj(): ComplexNumber {
     return new ComplexNumber(this.realNum, -this.imaginaryNum || 0);
  }

  public get exp(): ComplexNumber {
    const expA = Math.exp(this.realNum);
    
    return new ComplexNumber(
      expA * Math.cos(this.imaginaryNum),
      expA * Math.sin(this.imaginaryNum)
    );
  }
}
