export function transform(old: {[key: number]: string[]}):{ [key: string]: number } {
  let newObj:{ [key: string]: number } = {};
  for (const score in old) {
    for (let letter of old[score]) {
      newObj[letter.toLowerCase()] = Number(score);
    }
  }
  return newObj;
}
