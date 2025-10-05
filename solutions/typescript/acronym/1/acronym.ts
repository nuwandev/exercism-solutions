export function parse(phrase: string): string {
  if (phrase.includes(":")) {
    phrase = phrase.slice(0, phrase.indexOf(":"))
  }
  
  let validate = phrase.split(/\s|-/);
  
  let acronyms = "";
  for (let word of validate) {
    acronyms += word.charAt(0);
    for (let i = 1; i < word.length; i++) {
      if (/[A-Z]/.test(word.charAt(i))) {
        acronyms += word.charAt(i);
      }
    }
  }
  return acronyms.toUpperCase();
}
