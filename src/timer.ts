export class Timer {
  start = +new Date();

  reset(): void {
    this.start = +new Date();
  }

  asMilli(): number {
    return Date.now() - this.start;
  }

  asSeconds(): number {
    return this.asMilli() / 1000;
  }
}
