export function isPangram(sentence: string):boolean {
  const letters = new Set(sentence.toLowerCase())
  const alphabet: string = "abcdefghijklmnopqrstuvwxyz"

  for (let letter of alphabet) {
    if (!letters.has(letter)) {
      return false
    }
  }

  return true
}
