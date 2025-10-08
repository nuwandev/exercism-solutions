export function isIsogram(word: string): boolean {
  word = word.replace(/[\s-]+/g,'').toLowerCase();
  for (let i = 0; i < word.length; i++) {
    for (let j = i + 1; j < word.length; j++) {
      if (word.charAt(i) === word.charAt(j)) {
        return false;
      }
    }
  }
  return true;
}
