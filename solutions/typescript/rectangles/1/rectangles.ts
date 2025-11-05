export function count(lines: string[]) {
  if (lines.length <=  1) return 0;

  const diagram = lines.map(line => line.split(''));
  // console.log(diagram)
  let count = 0;

  for (let r = 0; r < diagram.length; r++) {
    const plusCols: number[] = [];
    for (let c = 0; c < diagram[r].length; c++) {
      if (diagram[r][c] === '+') {
        plusCols.push(c)
      }
    }
    for (let i = 0; i < plusCols.length; i++) {
      for (let j = i + 1; j < plusCols.length; j++) {
        const c1 = plusCols[i];
        const c2 = plusCols[j];
        for (let r2 = r + 1; r2 < diagram.length; r2++) {
          const bottomLeft = diagram[r2][c1];
          const bottomRight = diagram[r2][c2];
          if (bottomLeft === '+' && bottomRight === '+') {
            if (
              isHorizontalValid(r, c1, c2) &&
              isHorizontalValid(r2, c1, c2) &&
              isVerticalValid(c1, r, r2) &&
              isVerticalValid(c2, r, r2)
            ) count++;
          }
        }
      } 
    }
  }

  return count;
  function isHorizontalValid(row: number, c1: number, c2: number) {
    for (let c = c1 + 1; c < c2; c++) {
      const ch = diagram[row][c];
      if (ch !== '-' && ch !== '+') return false;
    }
    return true;
  }
  
  function isVerticalValid(c: number, r1: number, r2: number) {
    for (let r3 = r1 + 1; r3 < r2; r3++) {
      const ch = diagram[r3][c];
      if (ch !== '|' && ch !== '+') return false;
    }
    return true;
  }
}