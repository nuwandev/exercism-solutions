export class List<T> {
  private list: T[] = [];

  constructor(list: T[]) {
    this.list = list;
  }
  
  public static create<T>(...values: T[]): List<T> {
    return new List([...values])
  }

  public forEach(callback: (item: T) => void) {
    for (let item of this.list) {
      callback(item)
    }
  }

  public append(other: List<T>): List<T> {
    return new List([...this.list, ...other.list])
  }

  public concat(lists: List<List<T>>) {
    let result: T[] = [...this.list];
    for (let sublist of lists.list) {
      for (let item of sublist.list) {
        result = [...result, item]
      }
    }
    return new List(result)
  }

  public filter(callback: (el: T) => boolean): List<T> {
    let result: T[] = [];
    for (let el of this.list) {
      if (callback(el)) {
        result = [...result, el]
      } 
    }
    return new List(result)
  }

  public length(): number {
    return this.list.length;
  }

  public map(callback: (item: T) => T): List<T> {
    let result: T[] = []
    for (let item of this.list) {
      result = [...result, callback(item)]
    }
    return new List(result)
  }

  public foldl(callback: (acc: T, el: T) => T, ini: T): T {
    let acc: T = ini;
    for (let el of this.list) {
      acc = callback(acc, el)
    }
    return acc;
  }

  public foldr(callback: (acc: T, el: T) => T, ini: T): T {
    let acc: T = ini;
    for (let i = this.list.length - 1; i >= 0; i--) {
      acc = callback(acc, this.list[i])
    }
    return acc
  }

  public reverse(): List<T> {
    let reversed: T[] = [];
    for (let i = this.list.length - 1; i >= 0; i--) {
      reversed = [...reversed, this.list[i]]
    }
    return new List(reversed);
  }
  
}
