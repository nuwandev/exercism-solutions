export class Matrix {
  private matrixStr: string;
  constructor(matrixStr: string) {
    this.matrixStr = matrixStr;
  }

  get rows(): number[][] {
    return this.matrixStr.split('\n').map((line) => line.trim().split(' ').map(Number));
  }

  get columns(): number[][] {
    return this.rows[0].map((_,i)=> this.rows.map(row => row[i]))
  }
}
