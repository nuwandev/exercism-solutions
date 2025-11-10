export function saddlePoints(map: number[][]) {
  let result: {[key: string]: number}[] = [];
  for (let i = 0; i < map.length; i++) {
    let maxInRow = Math.max(...map[i]);
    for (let j = 0; j < map[i].length; j++) {
      let columnValues = [];
      for (let k = 0; k < map.length; k++) {
        columnValues.push(map[k][j]);
      }
      let minInColumn = Math.min(...columnValues);

      if (map[i][j] === maxInRow && map[i][j] === minInColumn) {
        result.push({'row': i+1, 'column': j+1});
      }
    }
  }
  return result;
}
