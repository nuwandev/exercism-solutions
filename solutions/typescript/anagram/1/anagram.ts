export class Anagram {
  private input: string;
  
  constructor(input: string) {
    this.input = input.toLowerCase();
  }

  public matches(...potentials: string[]): string[] {
    const anagramList: string[] = [];
    for (let word of potentials) {
      if (this.input !== word.toLowerCase() && this.input.length === word.length) {
        const sortedWord = word.toLowerCase().split('').sort().join('');
        const sortedInput = this.input.split('').sort().join('');

        if (sortedInput === sortedWord) {
          anagramList.push(word);
        }
      }
    }
    console.log(anagramList)
    return anagramList;
  }
}
