function djb2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

const memo: { [key: string]: string } = {};

export default function hashStringToColor(str: string) {
  // use bounded HSL (instead of original RGB) to generate a more restricted,
  // more pleasant set of colors - for relatively high-constrast backgrounds
  if (memo[str]) return memo[str];
  const hash = djb2(str);
  const h = hash & 0x0000FF;
  const s = (hash & 0x00FF00) >> 8;
  const l = (hash & 0xFF0000) >> 16;
  const color = `hsl(${h}, ${30 + ((50 * s) / 256)}%, ${60 + ((30 * l) / 256)}%)`;
  memo[str] = color;
  return color;
}
