export function solve(puzzle: string): unknown {
  const [exp, answer] = puzzle.split(' == ');
  const left: string[] = exp.split(' + ');
  const letters = Array.from(new Set([...left.join('').split(''), ...answer.split('')]));
  const leading = new Set<string>();
  for (const word of [...left, answer]) {
    if (word.length > 1) leading.add(word[0]);
  }

  function isValid(mapping: Map<string, number>): boolean {
    const sum = left
      .map(word => Number(word.split('').map(l => mapping.get(l)).join('')))
      .reduce((a, b) => a + b, 0);
    const target = Number(answer.split('').map(l => mapping.get(l)).join(''));
    return sum === target;
  }

  function search(idx: number, currentMap: Map<string, number>, usedDigits: Set<number>): Map<string, number> | null {
    if (idx === letters.length) {
      if (isValid(currentMap)) return currentMap;
      return null;
    }

    const letter = letters[idx];
    for (let digit = 0; digit <= 9; digit++) {
      if (usedDigits.has(digit)) continue;
      if (digit === 0 && leading.has(letter)) continue;
      currentMap.set(letter, digit);
      usedDigits.add(digit);
      const result = search(idx + 1, currentMap, usedDigits);
      if (result) return result;
      currentMap.delete(letter);
      usedDigits.delete(digit);
    }

    return null;
  }

  const solution = search(0, new Map(), new Set());
  if (!solution) return undefined;

  const obj: Record<string, number> = {};
  solution.forEach((v, k) => obj[k] = v);
  return obj;
}
