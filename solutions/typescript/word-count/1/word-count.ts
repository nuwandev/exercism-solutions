export function count(sentence: string): Map<string, number> {
  const wordCount = new Map<string, number>();
  const words = sentence
    .replace(/[!@#$%^&.*()_+/?:]/g, '')
    .replace(/(^|\s)['"]|['"](\s|$)/g, '$1$2')
    .split(/[\s,]+/)
    .map(word => word.toLowerCase())
    .filter(w => w !== '');

  for (let word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  }

  return wordCount;
}
