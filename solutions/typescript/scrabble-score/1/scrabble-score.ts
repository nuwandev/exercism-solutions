const letterGroups: Record<number, string[]> = {
  1: ['A','E','I','O','U','L','N','R','S','T'],
  2: ['D','G'],
  3: ['B','C','M','P'],
  4: ['F','H','V','W','Y'],
  5: ['K'],
  8: ['J','X'],
  10: ['Q','Z']
};

const letterValues: Record<string, number> = {};
for (const [value, letters] of Object.entries(letterGroups)) {
  letters.forEach(letter => {
    letterValues[letter] = Number(value);
  });
}

export function score(word: string): number {
  if (!word || word.length === 0) {
    return 0
  }

  let total = 0;
  for (const letter of word.toUpperCase()) {
    total += letterValues[letter] ?? 0;
  }
  return total;
}
