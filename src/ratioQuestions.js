// Endless ratio questions (Ganita Prakash Gr 8, Ch 7.2) — every call makes fresh numbers.
// Question shape: { text, type: 'mcq' | 'number', options?, answer, unit?, working }

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

const PAIRS = [
  ['red beads', 'blue beads'], ['mangoes', 'apples'], ['girls', 'boys'],
  ['cups of rice', 'cups of water'], ['pencils', 'pens'], ['blue tiles', 'white tiles'],
]

/* ---------- KNOWLEDGE: remember the words and the basic idea ---------- */
const knowledge = [
  () => {
    const [a, b] = [rand(2, 40), rand(2, 40)]
    if (a === b) return knowledge[0]()
    const askFirst = Math.random() < 0.5
    return {
      type: 'mcq',
      text: `In the ratio ${r(a, b)}, what is the ${askFirst ? 'first' : 'second'} term?`,
      options: shuffle([String(a), String(b), String(a + b), r(a, b)]),
      answer: String(askFirst ? a : b),
      working: `The numbers in a ratio are called its terms. In ${r(a, b)}, the first term is ${a} and the second term is ${b}.`,
    }
  },
  () => {
    const [x, y] = pick(PAIRS)
    const [a, b] = coprimePair(9, 2)
    return {
      type: 'mcq',
      text: `For every ${a} ${x} there are ${b} ${y}. What is the ratio of ${x} to ${y}?`,
      options: mcq(r(a, b), [r(b, a), r(a, a + b), r(a + b, b)], randomRatio),
      answer: r(a, b),
      working: `"${x} to ${y}" means ${x} come first: ${r(a, b)}.`,
    }
  },
  () => {
    const [p, q] = coprimePair()
    const k = rand(2, 9)
    const half = k % 2 === 0 ? r((p * k) / 2, (q * k) / 2) : r(p * 2, q * 2)
    return {
      type: 'mcq',
      text: `What is ${r(p * k, q * k)} in its simplest form?`,
      options: mcq(r(p, q), [r(q, p), half, r(p + 1, q)], randomRatio),
      answer: r(p, q),
      working: `Both ${p * k} and ${q * k} can be divided by ${k}: ${p * k} ÷ ${k} = ${p}, ${q * k} ÷ ${k} = ${q}. ${p} and ${q} have no common factor left, so the simplest form is ${r(p, q)}.`,
    }
  },
  () => {
    const [p, q] = coprimePair(12)
    const notSimple = () => {
      const [a, b] = coprimePair()
      const k = rand(2, 6)
      return r(a * k, b * k)
    }
    return {
      type: 'mcq',
      text: 'Which of these ratios is already in its simplest form?',
      options: mcq(r(p, q), [], notSimple),
      answer: r(p, q),
      working: `${p} and ${q} have no common factor except 1, so ${r(p, q)} cannot be made simpler. Each of the other ratios can be divided by a common number.`,
    }
  },
  () => {
    const [a, b] = coprimePair()
    const thing = pick([['width', 'height', 'cm'], ['flour', 'sugar', 'cups'], ['sand', 'cement', 'bags']])
    return {
      type: 'mcq',
      text: `The ratio of ${thing[0]} to ${thing[1]} is ${r(a, b)}. What does this mean?`,
      options: shuffle([
        `For every ${a} ${thing[2]} of ${thing[0]}, there are ${b} ${thing[2]} of ${thing[1]}`,
        `For every ${b} ${thing[2]} of ${thing[0]}, there are ${a} ${thing[2]} of ${thing[1]}`,
        `There are exactly ${a} ${thing[2]} of ${thing[0]} and nothing more`,
        `There is ${Math.abs(a - b)} ${thing[2]} more of one than the other, always`,
      ]),
      answer: `For every ${a} ${thing[2]} of ${thing[0]}, there are ${b} ${thing[2]} of ${thing[1]}`,
      working: `In a ratio a : b, for every a units of the first quantity there are b units of the second. The real amounts can be bigger, as long as they grow by the same factor.`,
    }
  },
]

/* ---------- UNDERSTANDING: use the idea, explain why ---------- */
const understanding = [
  () => {
    const [a, b] = coprimePair()
    const m = rand(2, 9)
    const yes = Math.random() < 0.5
    const k = rand(1, 5)
    const [c, d] = yes ? [a * m, b * m] : pick([[a * m, b * m + 1], [a + k * 3, b + k * 3]])
    const g = gcd(c, d)
    return {
      type: 'mcq',
      text: `Are the ratios ${r(a * 10, b * 10)} and ${r(c, d)} proportional (do they show the same comparison)?`,
      options: ['Yes, proportional', 'No, not proportional'],
      answer: yes ? 'Yes, proportional' : 'No, not proportional',
      working: `Simplest form of ${r(a * 10, b * 10)} is ${r(a, b)}. Simplest form of ${r(c, d)} is ${r(c / g, d / g)}. ${yes ? 'They are the same, so the ratios are proportional.' : 'They are different, so the ratios are not proportional.'}`,
    }
  },
  () => {
    const f = pick([[2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [3, 2], [5, 2], [2, 3], [1, 4], [4, 3]])
    const [x, y] = coprimePair(6)
    const m = f[1] * rand(1, 3)
    const [a, b] = [x * m, y * m]
    const [c, d] = [(a * f[0]) / f[1], (b * f[0]) / f[1]]
    const ans = fmtFrac(f[0], f[1])
    return {
      type: 'mcq',
      text: `By what factor should we multiply both terms of ${r(a, b)} to get ${r(c, d)}?`,
      options: mcq(ans, [fmtFrac(f[1], f[0]), String(Math.abs(c - a)), fmtFrac(f[0] + 1, f[1])], () => fmtFrac(rand(1, 6), rand(1, 4))),
      answer: ans,
      working: `${c} ÷ ${a} = ${ans} and ${d} ÷ ${b} = ${ans}. So ${a} × ${ans} = ${c} and ${b} × ${ans} = ${d}.`,
    }
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 9)
    const add = b + (a * k - a)
    return {
      type: 'mcq',
      text: `Fill in the blank so the ratios are proportional:  ${r(a, b)} = ${a * k} : ___`,
      options: mcq(String(b * k), [String(add), String(b * k + b), String(b * (k - 1))], () => String(rand(2, 90))),
      answer: String(b * k),
      working: `${a} became ${a * k}, so it was multiplied by ${k}. Multiply ${b} by ${k} too: ${b} × ${k} = ${b * k}. (Adding ${a * k - a} to ${b} gives ${add}, but adding does not keep a ratio the same.)`,
    }
  },
  () => {
    const [a, b] = coprimePair()
    const k = rand(2, 5)
    const wrong = r(a + k, b + k)
    const good = () => { const m = rand(2, 12); return r(a * m, b * m) }
    return {
      type: 'mcq',
      text: `Which ratio is NOT equal to ${r(a, b)}?`,
      options: mcq(wrong, [], good),
      answer: wrong,
      working: `The others are ${a} and ${b} multiplied by the same number. ${wrong} is ${a} and ${b} with ${k} added to each, which changes the comparison.`,
    }
  },
  () => {
    const [x, y] = pick(PAIRS)
    const [a, b] = coprimePair()
    return {
      type: 'mcq',
      text: `In a box, the ratio of ${x} to ${y} is ${r(a, b)}. What is the ratio of ${y} to ${x}?`,
      options: mcq(r(b, a), [r(a, b), r(b, a + b), r(a, a + b)], randomRatio),
      answer: r(b, a),
      working: `Swapping the order of the things swaps the terms: ${y} to ${x} is ${r(b, a)}. Order matters in a ratio!`,
    }
  },
]

/* ---------- APPLICATION: real-life problems, answer is a number ---------- */
const NAMES = ['Asha', 'Rohan', 'Meera', 'Kabir', 'Priya', 'Arjun', 'Diya', 'Vikram', 'Sana', 'Aditya']

const application = [
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
    let m = rand(2, 5), n = rand(2, 9)
    if (m === n) n++
    return {
      type: 'number',
      text: `A photo is ${a * m} cm wide and ${b * m} cm tall. It is printed bigger or smaller, ${a * n} cm wide, without stretching. How tall is the new print?`,
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

export const RATIO_LEVELS = { knowledge, understanding, application }

export function makeRatioQuestion(level) {
  return pick(RATIO_LEVELS[level])()
}

export function makeRatioHomework() {
  const take = (level, n) => shuffle(RATIO_LEVELS[level]).slice(0, n).map(g => ({ ...g(), level }))
  return [...take('knowledge', 3), ...take('understanding', 3), ...take('application', 4)]
}
