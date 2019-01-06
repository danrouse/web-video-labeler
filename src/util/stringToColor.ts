class Random {
  static iseed = 1;
  static seed(str: string) {
    this.iseed = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  }
  static get next() {
    const x = Math.sin(this.iseed) * 10000;
    this.iseed += 1;
    return x - Math.floor(x);
  }
}

const memo: { [key: string]: string } = {};

export default function stringToColor(str: string) {
  if (memo[str]) return memo[str];
  Random.seed(str);
  const h = Math.floor(Random.next * 256);
  const s = Math.floor(Random.next * 256);
  const l = Math.floor(Random.next * 256);
  const color = `hsl(${h}, ${50 + ((50 * s) / 256)}%, ${60 + ((30 * l) / 256)}%)`;
  memo[str] = color;
  return color;
}
