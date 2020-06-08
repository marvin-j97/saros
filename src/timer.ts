export class Timer {
  start = +new Date();

  asMilli(): number {
    return Date.now() - this.start;
  }
}
