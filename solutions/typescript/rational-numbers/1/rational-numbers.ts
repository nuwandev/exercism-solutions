export class Rational {
  numerator: number
  denominator: number

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) throw new Error('Denominator cannot be 0')
    const g = this.gcd(numerator, denominator)
    numerator /= g
    denominator /= g
    if (denominator < 0) {
      numerator = -numerator
      denominator = -denominator
    }
    this.numerator = numerator
    this.denominator = denominator
  }

  add(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    )
  }

  sub(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    )
  }

  mul(other: Rational): Rational {
    return new Rational(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    )
  }

  div(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator,
      this.denominator * other.numerator
    )
  }

  abs(): Rational {
    return new Rational(Math.abs(this.numerator), Math.abs(this.denominator))
  }

  exprational(n: number): Rational {
    if (n === 0) return new Rational(1, 1)
    if (n > 0) {
      return new Rational(
        Math.pow(this.numerator, n),
        Math.pow(this.denominator, n)
      )
    } else {
      const m = Math.abs(n)
      return new Rational(
        Math.pow(this.denominator, m),
        Math.pow(this.numerator, m)
      )
    }
  }

  expreal(x: number): number {
    return Math.pow(x, this.numerator / this.denominator)
  }

  reduce(): Rational {
    return new Rational(this.numerator, this.denominator) // constructor auto-reduces
  }

  private gcd(a: number, b: number): number {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      [a, b] = [b, a % b]
    }
    return a
  }
}
