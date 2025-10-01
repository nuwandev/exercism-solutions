type Options = {
  minFactor?: number
  maxFactor?: number
  sum: number
}

export function triplets({minFactor, maxFactor, sum}: Options): Triplet[] {
  const result: Triplet[] = [];
  for (let a = minFactor ?? 1; a < (maxFactor ?? sum/3); a++) {
    for (let b = Math.max(a+1, minFactor ?? 1); b < (maxFactor ?? sum/2); b++) {
      let c = sum - a - b;
      if (a**2 + b**2 === c**2 && c <= (maxFactor ?? Infinity)) {
        result.push(new Triplet(a, b, c));
      }
    }
  }

  return result;
}

class Triplet {
  a: number;
  b: number;
  c: number;
  
  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  toArray(): [number, number, number] {
    return [this.a, this.b, this.c];
  }
}
