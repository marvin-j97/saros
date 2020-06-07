export class Stack<T> {
  private _items: T[] = [];

  peek(): T | undefined {
    return this._items[this._items.length - 1];
  }

  push(...items: T[]): void {
    this._items.push(...items);
  }

  pop(): T | undefined {
    return this._items.pop();
  }
}
