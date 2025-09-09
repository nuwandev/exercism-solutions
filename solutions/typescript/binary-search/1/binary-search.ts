export function find(arr: number[], key: number): number | never {
  let low = 0;
  let high = arr[arr.length-1];

  while (low <= high) {
    const m = Math.floor((low+high)/2);

    if (key == arr[m]) {
      return m;
    }
    if (key > arr[m]) {
      low = m+1;
    }else {
      high = m-1;
    }
  }

  throw new Error('Value not in array');
}
