export function squareRoot(radicand: number): number {
  for (let i = 1; i < radicand; i++) {
    if (i * i === radicand) {
      return i;
    }
  }
  return 1;
}
