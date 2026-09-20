export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateAP({ aMin = 2, aMax = 7, dMin = 1, dMax = 5, n = 4 } = {}) {
  return { a: randInt(aMin, aMax), d: randInt(dMin, dMax), n }
}

export function nthTerm(a, d, n) {
  return a + (n - 1) * d
}

export function sumOfN(a, d, n) {
  return (n / 2) * (2 * a + (n - 1) * d)
}
