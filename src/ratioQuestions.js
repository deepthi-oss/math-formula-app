// Endless ratio questions modelled on Ganita Prakash Gr 8, Ch 7.3 (simplest form via HCF, "::")
// and 7.4 (problem solving: lemonade, walls, teachers : students, ages, missing terms, filter coffee).
// Each level has 'quick' (one-word answer) and 'word' (word problem) generators.
// Question shape: { text, type: 'mcq' | 'number' | 'word', options?, answer, accept?, unit?, working }
//   'word' = type a single word, ratio or fraction; `accept` lists every spelling we mark right.

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
const simp = (a, b) => { const g = gcd(a, b); return [a / g, b / g] }
const rs = (a, b) => r(...simp(a, b))

export const QUICK_COUNT = 5

// two different whole numbers that share no common factor, e.g. 3 and 4
function coprimePair(max = 9, min = 1) {
  for (;;) {
    const a = rand(min, max), b = rand(min, max)
    if (a !== b && gcd(a, b) === 1) return [a, b]
  }
}

// two different multipliers, e.g. 2 and 6 (6 : 10 and 18 : 30 from 3 : 5)
function twoFactors(max = 9) {
  const k1 = rand(2, max)
  let k2 = rand(2, max)
  if (k2 === k1) k2 = k1 === max ? 2 : k1 + 1
  return [k1, k2]
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
  return r(a * rand(1, 6), b * rand(1, 6))
}

const fmtFrac = (n, d) => {
  const g = gcd(n, d)
  n /= g; d /= g
  return d === 1 ? String(n) : `${n}/${d}`
}
// a fraction answer typed as "3/7"; also take an exact decimal like 1.5
const fracAccept = (n, d) => {
  const acc = [fmtFrac(n, d)]
  const milli = (n / d) * 1000
  if (Math.abs(milli - Math.round(milli)) < 1e-9) acc.push(String(Math.round(milli) / 1000))
  return acc
}

const ratioWord = (a, b, working, text) => ({
  type: 'word', text, answer: r(a, b), accept: [`${a}:${b}`], placeholder: 'e.g. 3 : 4', working,
})
const yesNo = (yes, text, working) => ({
  type: 'word', text, answer: yes ? 'Yes' : 'No', accept: [yes ? 'yes' : 'no'], placeholder: 'yes / no', working,
})
const hcfWorking = (a, b) => {
  const g = gcd(a, b)
  return g === 1
    ? `The HCF of ${a} and ${b} is 1, so ${r(a, b)} is already in its simplest form.`
    : `The HCF of ${a} and ${b} is ${g}. ${a} ÷ ${g} = ${a / g}, ${b} ÷ ${g} = ${b / g}. Simplest form: ${r(a / g, b / g)}.`
}

const NAMES = ['Kesang', 'Nitin', 'Hari', 'Neelima', 'Manjunath', 'Asha', 'Rohan', 'Meera', 'Kabir', 'Priya', 'Arjun', 'Diya']
const twoNames = () => shuffle(NAMES).slice(0, 2)

// "regular" filter coffee in the textbook: 15 mL decoction : 35 mL milk = 3 : 7
const REGULAR = [3, 7]
const COFFEE_MIXES = [[1, 2], [2, 3], [3, 7], [1, 3], [2, 5], [3, 10], [1, 4], [3, 5], [4, 9], [3, 7], [1, 1]]
function coffeeStrength(d, m) {
  const diff = d * REGULAR[1] - m * REGULAR[0]
  return diff === 0 ? 'Regular' : diff > 0 ? 'Strong' : 'Light'
}

const CONCEPTS = [
  { text: 'To write a ratio in its simplest form, we divide both terms by their ___.', answer: 'HCF',
    accept: ['hcf', 'highestcommonfactor', 'gcd'], working: 'Divide both terms by their HCF. For 60 : 40, the HCF is 20, so 60 : 40 = 3 : 2.' },
  { text: 'When two ratios are the same in their simplest forms, we say they are in ___.', answer: 'proportion',
    accept: ['proportion', 'proportional'], working: '60 : 40 and 90 : 60 are both 3 : 2 in simplest form, so they are in proportion.' },
  { text: 'Which symbol do we use to show that two ratios are proportional?', answer: '::',
    accept: ['::'], working: 'We write 60 : 40 :: 90 : 60 to show the two ratios are proportional.' },
  { text: 'If we add the same number to both terms of a ratio, does it always stay proportional to the original ratio? (yes / no)',
    answer: 'No', accept: ['no'], working: 'Neelima\'s age example: 3 : 30 = 1 : 10, but 9 years later 12 : 39 = 4 : 13. Adding the same number changes the ratio.' },
  { text: 'If we multiply both terms of a ratio by the same number, is the new ratio proportional to the original? (yes / no)',
    answer: 'Yes', accept: ['yes'], working: 'Multiplying both terms by the same factor keeps the simplest form the same, e.g. 6 : 10 :: 18 : 30.' },
  { text: 'a : b :: c : d tells us that the ratios a : b and c : d are ___.', answer: 'proportional',
    accept: ['proportional', 'proportion', 'equal', 'equivalent'], working: 'The "::" symbol means the two ratios are proportional.' },
]

/* ================= KNOWLEDGE ================= */
const knowledgeQuick = [
  () => ({ type: 'word', ...pick(CONCEPTS), placeholder: 'one word' }),
  () => {
    const [p, q] = coprimePair()
    const k = rand(2, 24)
    return {
      type: 'number',
      text: `What is the HCF of ${p * k} and ${q * k}?`,
      answer: k,
      working: `${k} is the largest number that divides both ${p * k} (= ${p} × ${k}) and ${q * k} (= ${q} × ${k}).`,
    }
  },
  () => {
    const [p, q] = coprimePair()
    const k = rand(3, 24)
    return ratioWord(p, q, hcfWorking(p * k, q * k), `Write ${r(p * k, q * k)} in its simplest form.`)
  },
  () => {
    const [p, q] = coprimePair(12)
    const k = Math.random() < 0.5 ? 1 : rand(2, 8)
    return yesNo(k === 1, `Is ${r(p * k, q * k)} in its simplest form? (yes / no)`, hcfWorking(p * k, q * k))
  },
]

const knowledgeWord = [
  () => {
    const [p, q] = pick([[2, 1], [1, 1], [3, 2], [4, 3], [5, 3], [3, 4], [5, 2]])
    const k = rand(4, 30)
    return {
      type: 'mcq',
      text: `A photo is ${p * k} mm wide and ${q * k} mm tall. What is the ratio of its width to height in simplest form?`,
      options: mcq(r(p, q), [r(q, p), r(p, q + 1), r(p + 1, q)], randomRatio),
      answer: r(p, q),
      working: hcfWorking(p * k, q * k),
    }
  },
  () => {
    const [p, q] = coprimePair(7, 2)
    const [k1, k2] = twoFactors(10)
    const right = `${r(p * k1, q * k1)} :: ${r(p * k2, q * k2)}`
    const wrongs = [
      `${r(p * k1, q * k1)} :: ${r(q * k2, p * k2)}`,
      `${r(p * k1, q * k1)} :: ${r(p * k1 + 10, q * k1 + 10)}`,
      `${r(p * k1, q * k1)} :: ${r(p * k2, q * k2 + 1)}`,
    ]
    return {
      type: 'mcq',
      text: 'Which of these is written correctly? ("::" means the two ratios are proportional.)',
      options: shuffle([right, ...wrongs]),
      answer: right,
      working: `${r(p * k1, q * k1)} and ${r(p * k2, q * k2)} are both ${r(p, q)} in simplest form, so they are proportional. The others have different simplest forms.`,
    }
  },
  () => {
    const [p, q] = pick([[3, 7], [1, 2], [2, 3], [1, 3], [2, 5], [3, 5]])
    const k = pick([5, 10, 20, 50, 100])
    return {
      type: 'mcq',
      text: `Manjunath mixes ${p * k} mL of coffee decoction with ${q * k} mL of milk. What is the ratio of decoction to milk in simplest form?`,
      options: mcq(r(p, q), [r(q, p), r(p * 5, q * 5), r(p + 1, q + 1)], randomRatio),
      answer: r(p, q),
      working: hcfWorking(p * k, q * k),
    }
  },
  () => {
    const t = rand(3, 9)
    const s = rand(20, 40)
    const [a, b] = simp(t, t * s)
    return {
      type: 'mcq',
      text: `A school has ${t} teachers and ${t * s} students. What is the ratio of teachers to students in simplest form?`,
      options: mcq(r(a, b), [r(b, a), r(t, t * s - 1), r(1, t)], randomRatio),
      answer: r(a, b),
      working: hcfWorking(t, t * s),
    }
  },
]

/* ================= UNDERSTANDING ================= */
const understandingQuick = [
  () => {
    const [p, q] = coprimePair(9, 2)
    const k = rand(3, 30)
    const yes = Math.random() < 0.5
    const [c, d] = yes ? [p * k, q * k] : [p * k, q * k + pick([-1, 1, 2])]
    return yesNo(yes, `Are ${r(p, q)} and ${r(c, d)} proportional? (yes / no)`,
      `${r(p, q)} is in simplest form. ${hcfWorking(c, d)} ${yes ? 'Same simplest form, so yes.' : 'Different simplest forms, so no.'}`)
  },
  () => {
    const [p, q] = coprimePair(7, 2)
    const [k1, k2] = twoFactors()
    return {
      type: 'number',
      text: `${r(p * k1, q * k1)} :: ${p * k2} : ?`,
      answer: q * k2,
      working: `The first term changed from ${p * k1} to ${p * k2}, a factor of ${fmtFrac(k2, k1)}. So ${q * k1} × ${fmtFrac(k2, k1)} = ${q * k2}.`,
    }
  },
  () => {
    const [p, q] = coprimePair(7, 2)
    const [k1, k2] = twoFactors()
    return {
      type: 'number',
      text: `? : ${q * k2} :: ${r(p * k1, q * k1)}`,
      answer: p * k2,
      working: `The second term changed from ${q * k1} to ${q * k2}, a factor of ${fmtFrac(k2, k1)}. So ${p * k1} × ${fmtFrac(k2, k1)} = ${p * k2}.`,
    }
  },
  () => {
    const [p] = coprimePair(7, 2)
    const [k1, k2] = twoFactors()
    const [a, b] = [p * k1, p * k2]
    return {
      type: 'word',
      text: `What factor should we multiply ${a} by to get ${b}? (A fraction like 3/7 is fine.)`,
      answer: fmtFrac(b, a), accept: fracAccept(b, a), placeholder: 'e.g. 3/7',
      working: `${a} × y = ${b}, so y = ${b}/${a} = ${fmtFrac(b, a)}.`,
    }
  },
  () => {
    const [p, q] = coprimePair()
    const n = rand(2, 9)
    const add = Math.random() < 0.5
    return yesNo(!add,
      `We ${add ? `add ${n} to both terms of ${r(p, q)}` : `multiply both terms of ${r(p, q)} by ${n}`}. Is the new ratio proportional to ${r(p, q)}? (yes / no)`,
      add
        ? `${r(p + n, q + n)} in simplest form is ${rs(p + n, q + n)}, not ${r(p, q)}. Adding the same number changes the ratio.`
        : `${r(p * n, q * n)} in simplest form is ${r(p, q)}. Multiplying by the same factor keeps the ratio proportional.`)
  },
]

const understandingWord = [
  () => {
    const name = pick(['Neelima', 'Asha', 'Diya', 'Kabir', 'Rohan'])
    const c = rand(2, 5), m = rand(6, 10), n = rand(5, 12)
    const [mAge, cLater, mLater] = [c * m, c + n, c * m + n]
    const ans = rs(cLater, mLater)
    return {
      type: 'mcq',
      text: `When ${name} was ${c} years old, ${name}'s mother was ${mAge}, which is ${m} times ${name}'s age. What will be the ratio of ${name}'s age to the mother's age after ${n} years, in simplest form?`,
      options: mcq(ans, [r(1, m), rs(c, mLater), rs(cLater, mAge)], randomRatio),
      answer: ans,
      working: `Then: ${r(c, mAge)} = ${r(1, m)}. After ${n} years: ${r(cLater, mLater)} = ${ans}. Adding the same number of years to both ages changes the ratio.`,
    }
  },
  () => {
    const [n1, n2] = twoNames()
    const [len, bags] = pick([[20, 1], [15, 1], [25, 2], [30, 1], [10, 1], [40, 3]])
    const [k1, k2] = twoFactors(5)
    const L1 = len * k1, c1 = bags * k1, L2 = len * k2
    const kind = pick(['same', 'more', 'less'])
    const c2 = kind === 'same' ? bags * k2 : kind === 'more' ? bags * k2 + 1 : Math.max(1, bags * k2 - 1)
    const realKind = c2 * L1 === c1 * L2 ? 'same' : c2 * L1 > c1 * L2 ? 'more' : 'less'
    const label = { same: 'Yes, both walls are equally strong', more: `No, ${n2}'s wall is stronger`, less: `No, ${n2}'s wall is weaker` }
    return {
      type: 'mcq',
      text: `${n1} built a ${L1} ft long wall using ${c1} bags of cement. ${n2} built a ${L2} ft long wall using ${c2} bag${c2 > 1 ? 's' : ''}. Are the walls equally strong?`,
      options: shuffle(Object.values(label)),
      answer: label[realKind],
      working: `${n1}: ${r(L1, c1)} = ${rs(L1, c1)}. ${n2}: ${r(L2, c2)} = ${rs(L2, c2)}. ${realKind === 'same' ? 'Same simplest form, so they are proportional and equally strong.' : realKind === 'more' ? `${n2} used more cement for each foot of wall, so it is stronger.` : `${n2} used less cement for each foot of wall, so it is weaker.`}`,
    }
  },
  () => {
    const [p, q] = coprimePair(7, 2)
    const [k1, k2] = twoFactors()
    const [a, b] = [p * k1, q * k1]
    const ans = r(p * k2, q * k2)
    return {
      type: 'mcq',
      text: `Which ratio is proportional to ${r(a, b)}?`,
      options: mcq(ans, [r(p * k2, q * k2 + 1), r(a + 2, b + 2), r(q * k2, p * k2)], randomRatio),
      answer: ans,
      working: `${hcfWorking(a, b)} ${ans} in simplest form is also ${r(p, q)}, so ${r(a, b)} :: ${ans}.`,
    }
  },
  () => {
    const [d, m] = pick(COFFEE_MIXES)
    const k = pick([10, 20, 50, 100])
    const kind = coffeeStrength(d, m)
    return {
      type: 'mcq',
      text: `Regular filter coffee uses 15 mL decoction with 35 mL milk. Manjunath mixes ${d * k} mL decoction with ${m * k} mL milk. Is this coffee Regular, Strong or Light?`,
      options: ['Regular', 'Strong', 'Light'],
      answer: kind,
      working: `Regular: 15 : 35 = 3 : 7, so 3 mL decoction for every 7 mL milk (about ${(3 / 7).toFixed(2)} mL for each mL of milk). This mix: ${r(d * k, m * k)} = ${r(d, m)} (about ${(d / m).toFixed(2)} mL for each mL of milk). ${kind === 'Regular' ? 'Same as regular.' : kind === 'Strong' ? 'More decoction for the same milk, so stronger.' : 'Less decoction for the same milk, so lighter.'}`,
    }
  },
]

/* ================= APPLICATION ================= */
const applicationQuick = [
  () => {
    const [g, s] = pick([[6, 10], [3, 5], [4, 6], [2, 3], [5, 8]])
    const k = rand(2, 6)
    return { type: 'number', text: `${g} glasses of lemonade need ${s} spoons of sugar. How many spoons for ${g * k} glasses?`,
      answer: s * k, unit: 'spoons', working: `${g} × ${k} = ${g * k}, so ${s} × ${k} = ${s * k} spoons.` }
  },
  () => {
    const [len, bags] = pick([[20, 1], [15, 1], [25, 2], [30, 1], [10, 1]])
    const k = rand(2, 6)
    return { type: 'number', text: `${len} ft of wall needs ${bags} bag${bags > 1 ? 's' : ''} of cement. How many bags for ${len * k} ft?`,
      answer: bags * k, unit: 'bags', working: `${len} × ${k} = ${len * k}, so ${bags} × ${k} = ${bags * k} bags.` }
  },
  () => {
    const s = pick([25, 30, 34, 35, 40])
    const t = rand(2, 9)
    return { type: 'number', text: `A school has 1 teacher for every ${s} students. How many students are there for ${t} teachers?`,
      answer: s * t, unit: 'students', working: `1 : ${s} :: ${t} : ?, multiply by ${t}: ${s} × ${t} = ${s * t}.` }
  },
  () => {
    const k = rand(2, 12)
    return { type: 'number', text: `Regular coffee is 3 mL decoction for every 7 mL milk. How much milk goes with ${3 * k} mL decoction?`,
      answer: 7 * k, unit: 'mL', working: `3 × ${k} = ${3 * k}, so 7 × ${k} = ${7 * k} mL.` }
  },
]

const applicationWord = [
  () => {
    const name = pick(['Kesang', 'Meera', 'Diya', 'Asha'])
    const [g, s] = pick([[6, 10], [3, 5], [4, 6], [2, 3], [5, 8], [4, 10]])
    const more = g * rand(2, 5)
    return {
      type: 'number',
      text: `${name} made ${g} glasses of lemonade using ${s} spoons of sugar. More guests came, so ${name} has to make ${more} more glasses with the same sweetness. How many spoons of sugar are needed for them?`,
      answer: (s * more) / g, unit: 'spoons',
      working: `${r(g, s)} :: ${more} : ?. The factor of change is ${more} ÷ ${g} = ${more / g}. So ${s} × ${more / g} = ${(s * more) / g} spoons.`,
    }
  },
  () => {
    const [n1, n2] = twoNames()
    const [len, bags] = pick([[20, 1], [15, 1], [25, 2], [30, 1], [10, 1], [40, 3]])
    const [k1, k2] = twoFactors(5)
    return {
      type: 'number',
      text: `${n1} built a ${len * k1} ft long wall using ${bags * k1} bags of cement. ${n2} is building a ${len * k2} ft long wall. How many bags should ${n2} use so the wall is just as strong?`,
      answer: bags * k2, unit: 'bags',
      working: `${r(len * k1, bags * k1)} = ${r(len, bags)}. For ${len * k2} ft: ${len * k2} ÷ ${len} = ${k2}, so ${bags} × ${k2} = ${bags * k2} bags.`,
    }
  },
  () => {
    const t = rand(3, 8), s = pick([25, 30, 34, 35, 40])
    const t2 = t + rand(2, 6)
    return {
      type: 'number',
      text: `A school has ${t} teachers and ${t * s} students. Another school has ${t2} teachers and wants the same teacher-to-student ratio. How many students should it have?`,
      answer: t2 * s, unit: 'students',
      working: `${r(t, t * s)} = ${r(1, s)}. So ${t2} teachers go with ${t2} × ${s} = ${t2 * s} students.`,
    }
  },
  () => {
    const [w, h] = pick([[4, 3], [3, 2], [2, 1], [5, 3], [5, 2], [8, 5]])
    const big = pick([30, 40, 50, 60])
    const n = rand(2, 4)
    return {
      type: 'number',
      text: `A blackboard is ${w * big} cm wide and ${h * big} cm tall. You draw a proportional rectangle in your notebook that is ${w * n} cm wide. How tall should it be?`,
      answer: h * n, unit: 'cm',
      working: `${r(w * big, h * big)} = ${r(w, h)} (HCF ${big}). ${w * n} = ${w} × ${n}, so the height is ${h} × ${n} = ${h * n} cm.`,
    }
  },
  () => {
    const k = rand(2, 8)
    return {
      type: 'number',
      text: `Manjunath makes regular filter coffee with 15 mL decoction for every 35 mL milk. For a big jug he uses ${35 * k} mL of milk. How much decoction should he use so it tastes the same?`,
      answer: 15 * k, unit: 'mL',
      working: `15 : 35 :: ? : ${35 * k}. ${35 * k} ÷ 35 = ${k}, so 15 × ${k} = ${15 * k} mL.`,
    }
  },
  () => {
    const [p, q] = coprimePair(7, 2)
    const [k1, k2] = twoFactors()
    const thing = pick([['sugar', 'flour', 'g'], ['blue paint', 'white paint', 'mL'], ['rice', 'water', 'cups']])
    return {
      type: 'number',
      text: `A recipe uses ${p * k1} ${thing[2]} of ${thing[0]} with ${q * k1} ${thing[2]} of ${thing[1]}. If you use ${p * k2} ${thing[2]} of ${thing[0]}, how much ${thing[1]} keeps the same ratio?`,
      answer: q * k2, unit: thing[2],
      working: `${r(p * k1, q * k1)} :: ${p * k2} : ?. Factor = ${p * k2}/${p * k1} = ${fmtFrac(k2, k1)}. ${q * k1} × ${fmtFrac(k2, k1)} = ${q * k2} ${thing[2]}.`,
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
