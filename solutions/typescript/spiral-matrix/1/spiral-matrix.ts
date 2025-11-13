export function ofSize(n: number): number[][] {
  const mat = Array.from({ length: n }, () => Array(n).fill(0));

  let top = 0, bottom = n - 1;
  let left = 0, right = n - 1;
  let val = 1;

  while (top <= bottom && left <= right) {
    // move right
    for (let j = left; j <= right; j++) mat[top][j] = val++;
    top++;

    // move down
    for (let i = top; i <= bottom; i++) mat[i][right] = val++;
    right--;

    // move left
    if (top <= bottom) {
      for (let j = right; j >= left; j--) mat[bottom][j] = val++;
      bottom--;
    }

    // move up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) mat[i][left] = val++;
      left++;
    }
  }

  return mat;
}
