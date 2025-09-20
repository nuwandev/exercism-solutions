export function steps(count: number): number {
  if (count <= 0 || !Number.isInteger(count)){
    throw new Error('Only positive integers are allowed');
  }
  
  let steps = 0;
  let res = count;
  while (res !== 1) {
    if (res%2 == 0) {
      res = res / 2;
    }else {
      res = res * 3 +1;
    }
    steps++;
  }
  return steps;
}
