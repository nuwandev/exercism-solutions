export function transpose(arr: string[]) {
  arr = arr.map(str => str.padEnd(Math.max(...arr.map(str => str.length)), ' '));

  if (arr.length === 0) return [];

  let result: string[] = new Array(arr[0].length).fill('');
  
  arr.forEach((string) => {
    string.split('').forEach((character, i) => {
      result[i] += character;
    })
  })

  const lastIndex = result.length - 1;
  result[lastIndex] = result[lastIndex].trimEnd();

  return result
}