export class LinkedList<T> {
  private list: T[] = [];
  
  public push(element: T) {
    this.list = [...this.list, element];
  }

  public pop(): T | undefined {
    return this.list.pop();
  }

  public shift(): T | undefined {
    return this.list.shift();
  }

  public unshift(element: T) {
    return this.list.unshift(element);
  }

  public delete(element: T) {
    return this.list = this.list.filter((e) => e!==element);
  }

  public count(): number {
    return this.list.length;
  }
}
