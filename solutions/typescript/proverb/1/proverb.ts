export function proverb(...inputList: string[]) {
  let rhyme = '';
  for (let i = 0; i < inputList.length - 1; i++) {
    rhyme += `For want of a ${inputList[i]} the ${inputList[i+1]} was lost.\n`
  }
  return rhyme + `And all for the want of a ${inputList[0]}.`
}
