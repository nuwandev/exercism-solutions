export function encode(numbers: number[]): number[] {
  const result: number[] = [];

  for (let num of numbers) {
    if (num === 0) {
      result.push(0);
      continue;
    }

    const bytes: number[] = [];
    while (num > 0) {
      bytes.unshift(num & 0x7f); // take last 7 bits
      num >>>= 7; // unsigned shift
    }

    for (let i = 0; i < bytes.length - 1; i++) {
      bytes[i] |= 0x80; // set continuation bit
    }

    result.push(...bytes);
  }

  return result;
}

export function decode(bytes: number[]): number[] {
  const result: number[] = [];
  let value = 0;
  let inSequence = false;

  for (const byte of bytes) {
    inSequence = true;
    value = (value << 7) | (byte & 0x7f);

    if ((byte & 0x80) === 0) {
      result.push(value >>> 0); // ensure unsigned 32-bit
      value = 0;
      inSequence = false;
    }
  }

  if (inSequence) throw new Error('Incomplete sequence');

  return result;
}
