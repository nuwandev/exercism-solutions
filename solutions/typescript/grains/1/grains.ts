const riceOnSquareObj: Record<number, number> = {};
let value = 1;
for (let i = 1; i <= 64; i++) {
  riceOnSquareObj[i] = value;
  value = value + value;
}

export const square = (num: number) => {
  if (num <= 0 || num > 64) throw Error('Invalid squre');
  
  return BigInt(riceOnSquareObj[num]);
}

export const total = () => {
  let total = BigInt(0);
  let value = 1;
  for (let i = 1; i <= 64; i++) {
    total+= BigInt(value);
    value = value + value;
  }
  return total;
}
