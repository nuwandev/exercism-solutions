export function sum(baseValuesArray: number[], level: number):number {
  const multiples = new Set<number>();
  for (let j = 0; j < baseValuesArray.length; j++) {
    for (let i = 1; i < level; i++) {
      if (i % baseValuesArray[j] === 0) {
        multiples.add(i);
      }
    }
  }
  let sum = 0;
  for (let mul of multiples) {
    sum += mul;
  }

  return sum;
}
