export function transpose(arr: string[]) {
  arr = pad(arr);

  if (arr.length === 0) return [];

  let result: string[] = new Array(arr[0].length).fill('');
  for (let j = 0; j < arr.length; j++) {
    for (let i = 0; i < arr[j].length; i++) {
      result[i] += arr[j][i];
    }
  }

  const lastIndex = result.length - 1;
  result[lastIndex] = result[lastIndex].trimEnd();

  return result
}

function pad(arr: string[]): string[] {
  let maxSize = 0;
  for (let i = 0; i < arr.length; i++) {
    if (maxSize < arr[i].length) maxSize = arr[i].length;
  }
  return arr.map(str => str.padEnd(maxSize, ' '));
}


