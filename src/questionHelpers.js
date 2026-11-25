// Shared building blocks for the endless practice-question generators (ratioQuestions, sharingQuestions, ...).
// Question shape: { text, type: 'mcq' | 'number' | 'word', options?, answer, accept?, unit?, working }
//   'word' = type a single word, ratio or fraction; `accept` lists every spelling we mark right.

export const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
export const pick = arr => arr[Math.floor(Math.random() * arr.length)]
export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
export const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
export const r = (a, b) => `${a} : ${b}`
export const simp = (a, b) => { const g = gcd(a, b); return [a / g, b / g] }
export const rs = (a, b) => r(...simp(a, b))

export const QUICK_COUNT = 5

// two different whole numbers that share no common factor, e.g. 3 and 4
export function coprimePair(max = 9, min = 1) {
  for (;;) {
    const a = rand(min, max), b = rand(min, max)
    if (a !== b && gcd(a, b) === 1) return [a, b]
  }
}

// correct answer + unique distractors, topped up from `extra()` until there are 4
export function mcq(answer, distractors, extra) {
  const opts = [answer]
  for (const d of distractors) if (opts.length < 4 && !opts.includes(d)) opts.push(d)
  let guard = 0
  while (opts.length < 4 && guard++ < 50) {
    const d = extra()
    if (!opts.includes(d)) opts.push(d)
  }
  return shuffle(opts)
}

export const randomRatio = () => {
  const [a, b] = coprimePair()
  return r(a * rand(1, 6), b * rand(1, 6))
}

export const ratioWord = (a, b, working, text) => ({
  type: 'word', text, answer: r(a, b), accept: [`${a}:${b}`], placeholder: 'e.g. 3 : 4', working,
})
export const yesNo = (yes, text, working) => ({
  type: 'word', text, answer: yes ? 'Yes' : 'No', accept: [yes ? 'yes' : 'no'], placeholder: 'yes / no', working,
})

// Question n (1-based) from a { level: { quick, word } } set: the first QUICK_COUNT are one-word, then word problems.
export function makeQuestionFrom(sets, level, n = 1) {
  const kind = n <= QUICK_COUNT ? 'quick' : 'word'
  return { ...pick(sets[level][kind])(), kind }
}

// 12-question homework: Section A = 2 one-word per level, Section B = 2 word problems per level.
export function makeHomeworkFrom(sets) {
  const take = (level, kind, n) =>
    shuffle(sets[level][kind]).slice(0, n).map(g => ({ ...g(), level, kind }))
  return [
    ...take('knowledge', 'quick', 2), ...take('understanding', 'quick', 2), ...take('application', 'quick', 2),
    ...take('knowledge', 'word', 2), ...take('understanding', 'word', 2), ...take('application', 'word', 2),
  ]
}
