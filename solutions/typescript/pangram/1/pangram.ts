export function isPangram(sentence: string):boolean {
  sentence = sentence.toLowerCase();
  const allLetters: string = "abcdefghijklmnopqrstuvwxyz"

  for (let letter of allLetters) {
    if (!sentence.includes(letter)) {
      return false
    }
  }

  return true
}
