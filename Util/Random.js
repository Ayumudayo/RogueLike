const VARIATION_RATIO = 0.2

export function getRand(value, variation = VARIATION_RATIO) {
  const min = value * (1 - variation);
  const max = value * (1 + variation);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}