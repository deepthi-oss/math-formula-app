// Endless ratio questions (Ganita Prakash Gr 8, Ch 7.2) — every call makes fresh numbers.
// Each level has 'quick' (one-word answer) and 'word' (word problem) generators.
// Question shape: { text, type: 'mcq' | 'number' | 'word', options?, answer, accept?, unit?, working }
//   'word' = type a single word or ratio; `accept` lists every spelling we mark right.

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const r = (a, b) => `${a} : ${b}`

export const QUICK_COUNT = 5

// two different whole numbers that share no common factor, e.g. 3 and 2
function coprimePair(max = 9, min = 1) {
  for (;;) {
    const a = rand(min, max), b = rand(min, max)
    if (a !== b && gcd(a, b) === 1) return [a, b]
  }
}

// correct answer + unique distractors, topped up from `extra()` until there are 4
function mcq(answer, distractors, extra) {
  const opts = [answer]
  for (const d of distractors) if (opts.length < 4 && !opts.includes(d)) opts.push(d)
  let guard = 0
  while (opts.length < 4 && guard++ < 50) {
    const d = extra()
    if (!opts.includes(d)) opts.push(d)
  }
  return shuffle(opts)
}

const randomRatio = () => {
  const [a, b] = coprimePair()
  const k = rand(1, 6)
  return r(a * k, b * k)
}

const fmtFrac = (n, d) => {
  const g = gcd(n, d)
  n /= g; d /= g
  return d === 1 ? String(n) : `${n}/${d}`
}

const ratioWord = (a, b, working, text) => ({
  type: 'word', text, answer: r(a, b), accept: [`${a}:${b}`], placeholder: 'e.g. 2 : 3', working,
})
const yesNo = (yes, text, working) => ({
  type: 'word', text, answer: yes ? 'Yes' : 'No', accept: [yes ? 'yes' : 'no'], placeholder: 'yes / no', working,
})

const PAIRS = [
  ['red beads', 'blue beads'], ['mangoes', 'apples'], ['girls', 'boys'],
  ['cups of rice', 'cups of water'], ['pencils', 'pens'], ['blue tiles', 'white tiles'],
]
const NAMES = ['Asha', 'Rohan', 'Meera', 'Kabir', 'Priya', 'Arjun', 'Diya', 'Vikram', 'Sana', 'Aditya']

const CONCEPTS = [
  { text: 'The numbers in a ratio are called its ___.', answer: 'terms', accept: ['terms', 'term'],
    working: 'In a ratio like 3 : 2, the numbers 3 and 2 are called its terms.' },
  { text: 'Ratios that show the same comparison, like 3 : 2 and 6 : 4, are called ___ ratios.', answer: 'proportional',
    accept: ['proportional', 'equivalent', 'equal'], working: '3 : 2 and 6 : 4 have the same simplest form, so they are proportional.' },
  { text: 'To write a ratio in simplest form, we ___ both terms by the same number.', answer: 'divide',
    accept: ['divide', 'divided'], working: 'Divide both terms by a common factor, e.g. 6 : 4 → ÷ 2 → 3 : 2.' },
  { text: 'A ratio whose terms have no common factor other than 1 is in its ___ form.', answer: 'simplest',
    accept: ['simplest', 'lowest'], working: 'For example 3 : 2 is in simplest form, because 3 and 2 share no factor except 1.' },
  { text: 'The ratio 3 : 2 is read as "3 ___ 2".', answer: 'to', accept: ['to'],
    working: 'The sign ":" is read as "to". 3 : 2 is read "3 to 2".' },
  { text: 'Does the order of the terms matter in a ratio? (yes / no)', answer: 'Yes', accept: ['yes'],
    working: '3 : 2 and 2 : 3 are different ratios. Order matters!' },
]

/* ================= KNOWLEDGE ================= */
const knowledgeQuick = [
  () => ({ type: 'word', ...pick(CONCEPTS), placeholder: 'one word' }),
  () => {
    const [a, b] = [rand(2, 40), rand(2, 40)]
    if (a === b) return knowledgeQuick[1]()
    const first = Math.random() < 0.5
    return {
      type: 'number',
      text: `In the ratio ${r(a, b)}, what is the ${first ? 'first' : 'second'} term?`,
      answer: first ? a : b,
      working: `In ${r(a, b)}, the first term is ${a} and the second term is ${b}.`,
    }
  },
  () => {
    const [a, b] = [rand(1, 20), rand(1, 20)]
    if (a === b) return knowledgeQuick[2]()
    return ratioWord(a, b, `"${a} to ${b}" is written ${r(a, b)}.`, `Write "${a} to ${b}" as a ratio.`)
  },
  () => {
    const [p, q] = coprimePair()
    const k = rand(2, 9)
    return ratioWord(p, q,
      `Divide both terms by ${k}: ${p * k} ÷ ${k} = ${p}, ${q * k} ÷ ${k} = ${q}.`,
      `Write ${r(p * k, q * k)} in simplest form.`)
  },
  () => {
    const [p, q] = coprimePair(12)
    const k = Math.random() < 0.5 ? 1 : rand(2, 5)
    return yesNo(k === 1, `Is ${r(p * k, q * k)} in its simplest form? (yes / no)`,
      k === 1
        ? `${p} and ${q} have no common factor except 1, so yes.`
        : `No. Both ${p * k} and ${q * k} can be divided by ${k}, giving ${r(p, q)}.`)
  },
]

const knowledgeWord = [
  () => {
    const [x, y] = pick(PAIRS)
    const [a, b] = coprimePair(9, 2)
    return {
      type: 'mcq',
      text: `In a box, for every ${a} ${x} there are ${b} ${y}. What is the ratio of ${x} to ${y}?`,
      options: mcq(r(a, b), [r(b, a), r(a, a + b), r(a + b, b)], randomRatio),
      answer: r(a, b),
      working: `"${x} to ${y}" means ${x} come first: ${r(a, b)}.`,
    }
  },
  () => {
    const [a, b] = coprimePair(9, 2)
    const thing = pick([['width', 'height', 'cm'], ['flour', 'sugar', 'cups'], ['sand', 'cement', 'bags']])
    return {
      type: 'mcq',
      text: `A builder says the ratio of ${thing[0]} to ${thing[1]} is ${r(a, b)}. What does this mean?`,
      options: shuffle([
        `For every ${a} ${thing[2]} of ${thing[0]}, there are ${b} ${thing[2]} of ${thing[1]}`,
        `For every ${b} ${thing[2]} of ${thing[0]}, there are ${a} ${thing[2]} of ${thing[1]}`,
        `There are exactly ${a} ${thing[2]} of ${thing[0]} and nothing more`,
        `There are always exactly ${a + b} ${thing[2]} in total`,
      ]),
      answer: `For every ${a} ${thing[2]} of ${thing[0]}, there are ${b} ${thing[2]} of ${thing[1]}`,
      working: 'In a ratio a : b, for every a units of the first quantity there are b units of the second.',
    }
  },
  () => {
    const name = pick(NAMES)
    const [p, q] = coprimePair(9, 2)
    const k = rand(2, 6)
    return {
      type: 'mcq',
      text: `${name} has ${p * k} pencils and ${q * k} pens. What is the ratio of pencils to pens in simplest form?`,
      options: mcq(r(p, q), [r(q, p), r(p + 1, q), r(p, q + 1)], randomRatio),
      answer: r(p, q),
      working: `Pencils : pens = ${r(p * k, q * k)}. Divide both by ${k}: ${r(p, q)}.`,
    }
  },
  () => {
    const [g, b] = coprimePair(9, 2)
    const k = rand(2, 5)
    return {
      type: 'mcq',
      text: `A class has ${g * k} girls and ${b * k} boys. What is the ratio of boys to girls in simplest form?`,
      options: mcq(r(b, g), [r(g, b), r(b * k, g * k + 1), r(b, g + b)], randomRatio),
      answer: r(b, g),
      working: `Boys come first: ${r(b * k, g * k)}. Divide both by ${k}: ${r(b, g)}.`,
    }
  },
]

/* ================= UNDERSTANDING ================= */
const understandingQuick = [
  () => {
    const [a, b] = coprimePair()
    const yes = Math.random() < 0.5
    const m = rand(2, 6)
    const [c, d] = yes ? [a * m, b * m] : [a + m, b + m]
    return yesNo(yes, `Are ${r(a, b)} and ${r(c, d)} proportional? (yes / no)`,
      yes ? `${c} = ${a} × ${m} and ${d} = ${b} × ${m}. Same factor, so yes.`
        : `${r(c, d)} is ${r(a, b)} with ${m} ADDED to each term. Adding does not keep a ratio the same, so no.`)
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    return {
      type: 'number',
      text: `${r(a, b)} = ${a * k} : ?`,
      answer: b * k,
      working: `${a} × ${k} = ${a * k}, so ${b} × ${k} = ${b * k}.`,
    }
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    return ratioWord(a * k, b * k, `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}.`,
      `Multiply both terms of ${r(a, b)} by ${k}. What is the new ratio?`)
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    return {
      type: 'number',
      text: `By what number do we multiply both terms of ${r(a, b)} to get ${r(a * k, b * k)}?`,
      answer: k,
      working: `${a * k} ÷ ${a} = ${k} and ${b * k} ÷ ${b} = ${k}.`,
    }
  },
  () => {
    const [a, b] = coprimePair()
    return ratioWord(b, a, `Swap the order: ${r(b, a)}.`, `If boys : girls = ${r(a, b)}, then girls : boys = ?`)
  },
]

const understandingWord = [
  () => {
    const [p1, p2] = shuffle(NAMES).slice(0, 2)
    const [a, b] = pick([[3, 2], [4, 3], [5, 4], [3, 4], [5, 3]])
    const m = rand(2, 4), n = m + rand(1, 3)
    const yes = Math.random() < 0.5
    const [c, d] = yes ? [a * n, b * n] : [a * n, b * n + pick([-1, 1, 2])]
    const g = gcd(c, d)
    const second = g === 1 ? `${r(c, d)} is already in simplest form` : `${r(c, d)} = ${r(c / g, d / g)}`
    return {
      type: 'mcq',
      text: `${p1}'s photo is ${a * m} cm × ${b * m} cm. ${p2}'s photo is ${c} cm × ${d} cm. Are the two photos proportional (the same shape)?`,
      options: ['Yes, proportional', 'No, not proportional'],
      answer: yes ? 'Yes, proportional' : 'No, not proportional',
      working: `${r(a * m, b * m)} = ${r(a, b)}. ${second}. ${yes ? 'Same simplest form, so yes.' : 'Different simplest forms, so no.'}`,
    }
  },
  () => {
    const name = pick(NAMES)
    const [a, b] = coprimePair(5)
    const k = rand(2, 4)
    const yes = Math.random() < 0.5
    const sugar = yes ? b * k : b + (a * k - a)
    return {
      type: 'mcq',
      text: `A recipe uses flour and sugar in the ratio ${r(a, b)}. ${name} uses ${a * k} cups of flour and ${sugar} cups of sugar. Did ${name} keep the same ratio?`,
      options: ['Yes', 'No'],
      answer: yes ? 'Yes' : 'No',
      working: yes
        ? `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}. Both multiplied by ${k}, so yes.`
        : `Flour was multiplied by ${k}, so sugar should be ${b} × ${k} = ${b * k}, not ${sugar}. So no.`,
    }
  },
  () => {
    const f = pick([[2, 1], [3, 1], [5, 2], [3, 2], [1, 2], [4, 3]])
    const [x, y] = coprimePair(6, 2)
    const m = f[1] * rand(1, 3)
    const [a, b] = [x * m, y * m]
    const [c, d] = [(a * f[0]) / f[1], (b * f[0]) / f[1]]
    const ans = fmtFrac(f[0], f[1])
    return {
      type: 'mcq',
      text: `A ${a} cm × ${b} cm photo is resized to ${c} cm × ${d} cm without stretching. By what factor was each side multiplied?`,
      options: mcq(ans, [fmtFrac(f[1], f[0]), String(Math.abs(c - a)), fmtFrac(f[0] + 1, f[1])], () => fmtFrac(rand(1, 6), rand(1, 4))),
      answer: ans,
      working: `${c} ÷ ${a} = ${ans} and ${d} ÷ ${b} = ${ans}.`,
    }
  },
  () => {
    const name = pick(NAMES)
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    const add = b + (a * k - a)
    return {
      type: 'mcq',
      text: `${name} says ${r(a, b)} = ${r(a * k, add)}, because ${a * k - a} was added to both terms. ${name} is wrong. What should the second term be?`,
      options: mcq(String(b * k), [String(add), String(b * k + b), String(b * (k - 1))], () => String(rand(2, 90))),
      answer: String(b * k),
      working: `${a} was multiplied by ${k} to get ${a * k}, so ${b} must be multiplied by ${k} too: ${b * k}. Adding does not keep a ratio the same.`,
    }
  },
  () => {
    const [x, y] = pick(PAIRS)
    const [a, b] = coprimePair(9, 2)
    return {
      type: 'mcq',
      text: `In a box, the ratio of ${x} to ${y} is ${r(a, b)}. What is the ratio of ${y} to ${x}?`,
      options: mcq(r(b, a), [r(a, b), r(b, a + b), r(a, a + b)], randomRatio),
      answer: r(b, a),
      working: `Swapping the order of the things swaps the terms: ${r(b, a)}.`,
    }
  },
]

/* ================= APPLICATION ================= */
const applicationQuick = [
  () => {
    const [a, b] = coprimePair()
    return { type: 'number', text: `How many parts in all are there in the ratio ${r(a, b)}?`, answer: a + b,
      working: `${a} + ${b} = ${a + b} parts.` }
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    return { type: 'number', text: `x : y = ${r(a, b)}. If x = ${a * k}, what is y?`, answer: b * k,
      working: `${a} × ${k} = ${a * k}, so y = ${b} × ${k} = ${b * k}.` }
  },
  () => {
    const [a, b] = coprimePair(6)
    const k = rand(2, 10)
    return { type: 'number', text: `Divide ${(a + b) * k} in the ratio ${r(a, b)}. What is the smaller part?`,
      answer: Math.min(a, b) * k,
      working: `${a + b} parts = ${(a + b) * k}, so 1 part = ${k}. Smaller part = ${Math.min(a, b)} × ${k} = ${Math.min(a, b) * k}.` }
  },
  () => {
    const n = rand(2, 9), k = rand(2, 12)
    return { type: 'number', text: `If ${n} parts = ${n * k}, what is 1 part?`, answer: k,
      working: `${n * k} ÷ ${n} = ${k}.` }
  },
]

const applicationWord = [
  () => {
    const [a, b] = coprimePair(6)
    const k = rand(2, 8)
    const [first, second] = pick([['lemon juice', 'water'], ['cement', 'sand'], ['milk', 'water'], ['red paint', 'white paint']])
    return {
      type: 'number',
      text: `A mix uses ${first} and ${second} in the ratio ${r(a, b)}. If ${b * k} cups of ${second} are used, how many cups of ${first} are needed?`,
      answer: a * k, unit: 'cups',
      working: `${second}: ${b} → ${b * k}, so the factor is ${b * k} ÷ ${b} = ${k}. ${first}: ${a} × ${k} = ${a * k} cups.`,
    }
  },
  () => {
    const [p1, p2] = shuffle(NAMES).slice(0, 2)
    const [a, b] = coprimePair(7)
    const unit = pick([10, 20, 50, 100])
    const total = (a + b) * unit
    const askFirst = Math.random() < 0.5
    return {
      type: 'number',
      text: `${p1} and ${p2} share ₹${total} in the ratio ${r(a, b)}. How much does ${askFirst ? p1 : p2} get?`,
      answer: (askFirst ? a : b) * unit, unit: '₹',
      working: `Total parts = ${a} + ${b} = ${a + b}. One part = ${total} ÷ ${a + b} = ₹${unit}. ${askFirst ? p1 : p2} gets ${askFirst ? a : b} × ${unit} = ₹${(askFirst ? a : b) * unit}.`,
    }
  },
  () => {
    const [a, b] = pick([[3, 2], [4, 3], [5, 4], [3, 4], [5, 3], [7, 5]])
    const m = rand(2, 5)
    let n = rand(2, 9)
    if (m === n) n++
    return {
      type: 'number',
      text: `A photo is ${a * m} cm wide and ${b * m} cm tall. It is printed ${a * n} cm wide, without stretching. How tall is the new print?`,
      answer: b * n, unit: 'cm',
      working: `Width : height = ${r(a * m, b * m)} = ${r(a, b)}. New width ${a * n} = ${a} × ${n}, so the height = ${b} × ${n} = ${b * n} cm.`,
    }
  },
  () => {
    const [a, b] = coprimePair(7)
    const k = rand(3, 6)
    const askGirls = Math.random() < 0.5
    return {
      type: 'number',
      text: `In a class of ${(a + b) * k} students, the ratio of girls to boys is ${r(a, b)}. How many ${askGirls ? 'girls' : 'boys'} are there?`,
      answer: (askGirls ? a : b) * k, unit: askGirls ? 'girls' : 'boys',
      working: `Total parts = ${a} + ${b} = ${a + b}. One part = ${(a + b) * k} ÷ ${a + b} = ${k}. ${askGirls ? 'Girls' : 'Boys'} = ${askGirls ? a : b} × ${k} = ${(askGirls ? a : b) * k}.`,
    }
  },
  () => {
    const name = pick(NAMES)
    const [a, b] = pick([[2, 7], [1, 3], [2, 5], [1, 4], [3, 8], [2, 9]])
    const k = rand(3, 6)
    return {
      type: 'number',
      text: `The ratio of ${name}'s age to their grandparent's age is ${r(a, b)}. The grandparent is ${b * k} years old. How old is ${name}?`,
      answer: a * k, unit: 'years',
      working: `${b} → ${b * k}, so the factor is ${k}. ${name}'s age = ${a} × ${k} = ${a * k} years.`,
    }
  },
  () => {
    const [a, b] = coprimePair(9)
    const [lo, hi] = a < b ? [a, b] : [b, a]
    const k = rand(2, 9)
    const [x, y] = pick([['blue marbles', 'green marbles'], ['story books', 'science books'], ['mango trees', 'neem trees']])
    return {
      type: 'number',
      text: `The ratio of ${x} to ${y} is ${r(lo, hi)}. There are ${(hi - lo) * k} more ${y} than ${x}. How many ${x} are there?`,
      answer: lo * k, unit: x,
      working: `The difference in parts is ${hi} − ${lo} = ${hi - lo}. ${hi - lo} parts = ${(hi - lo) * k}, so 1 part = ${k}. ${x} = ${lo} × ${k} = ${lo * k}.`,
    }
  },
]

export const RATIO_SETS = {
  knowledge: { quick: knowledgeQuick, word: knowledgeWord },
  understanding: { quick: understandingQuick, word: understandingWord },
  application: { quick: applicationQuick, word: applicationWord },
}

// Question n (1-based): the first QUICK_COUNT are one-word questions, then word problems.
export function makeRatioQuestion(level, n = 1) {
  const kind = n <= QUICK_COUNT ? 'quick' : 'word'
  return { ...pick(RATIO_SETS[level][kind])(), kind }
}

export function makeRatioHomework() {
  const take = (level, kind, n) =>
    shuffle(RATIO_SETS[level][kind]).slice(0, n).map(g => ({ ...g(), level, kind }))
  return [
    ...take('knowledge', 'quick', 2), ...take('understanding', 'quick', 2), ...take('application', 'quick', 2),
    ...take('knowledge', 'word', 2), ...take('understanding', 'word', 2), ...take('application', 'word', 2),
  ]
}
