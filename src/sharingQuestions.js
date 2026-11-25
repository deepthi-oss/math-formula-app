// Endless questions for Ganita Prakash Gr 8, Ch 7.5 "Sharing, but Not Equally":
// share a whole x in the ratio m : n → split into (m + n) equal groups of size x ÷ (m + n),
// first share m × that, second share n × that. Totals are always built as (m + n) × group size,
// so every answer is a whole number.
import {
  rand, pick, gcd, shuffle, r, simp, rs, coprimePair, mcq, randomRatio, ratioWord, yesNo,
  makeQuestionFrom, makeHomeworkFrom,
} from './questionHelpers.js'

const NAMES = ['Asha', 'Rohan', 'Meera', 'Kabir', 'Priya', 'Arjun', 'Diya', 'Vikram', 'Sana', 'Aditya', 'Kesang', 'Neelima']
const twoNames = () => shuffle(NAMES).slice(0, 2)

// a ratio m : n (simplest form, m ≠ n) and group size g → whole = (m + n) × g.
// `scale` makes friendlier money amounts (group sizes in tens).
function share(maxPart = 7, gMin = 2, gMax = 12, scale = 1) {
  const [m, n] = coprimePair(maxPart)
  const g = rand(gMin, gMax) * scale
  return { m, n, g, x: (m + n) * g, a: m * g, b: n * g }
}
// worked answer; `pre`/`suf` wrap the amounts, e.g. ('₹', '') or ('', ' cm')
const steps = ({ m, n, g, x, a, b }, suf = '', pre = '') =>
  `Total groups = ${m} + ${n} = ${m + n}. Size of each group = ${pre}${x}${suf} ÷ ${m + n} = ${pre}${g}${suf}. Shares: ${m} × ${g} = ${pre}${a}${suf} and ${n} × ${g} = ${pre}${b}${suf}.`

const CONCEPTS = [
  { text: 'To share a quantity in the ratio 3 : 1, we split it into 3 + 1 = 4 equal ___.', answer: 'groups',
    accept: ['groups', 'group', 'parts', 'part'], working: 'In 3 : 1, one person gets 3 groups and the other gets 1 group, so we need 4 equal groups.' },
  { text: 'When we share 12 counters, the number 12 is called the ___.', answer: 'whole',
    accept: ['whole', 'total'], working: 'The full amount being shared is the "whole". Here the whole is 12.' },
  { text: 'The two shares, added together, always give the ___.', answer: 'whole',
    accept: ['whole', 'total'], working: 'Nothing is left over: for 12 in 3 : 1, the shares 9 + 3 = 12, the whole.' },
  { text: 'To find the size of each group, we ___ the whole by the total number of groups.', answer: 'divide',
    accept: ['divide', 'divided'], working: 'For 42 in 4 : 3: 42 ÷ 7 = 6 in each group.' },
  { text: 'If 12 counters are shared equally between two people, what is the ratio in simplest form?', answer: '1 : 1',
    accept: ['1:1'], working: 'Each gets 6. 6 : 6 = 1 : 1.' },
]

/* ================= KNOWLEDGE ================= */
const knowledgeQuick = [
  () => ({ type: 'word', ...pick(CONCEPTS), placeholder: 'one word' }),
  () => {
    const [m, n] = coprimePair()
    return { type: 'number', text: `How many equal groups do we need to share something in the ratio ${r(m, n)}?`, answer: m + n,
      working: `One share has ${m} groups, the other has ${n}. ${m} + ${n} = ${m + n} groups.` }
  },
  () => {
    const x = pick([12, 15, 18, 20, 24, 30])
    const p = rand(1, x - 1)
    return { type: 'number', text: `${x} counters are shared between you and your partner. Your partner gets ${p}. How many do you get?`,
      answer: x - p, working: `${x} − ${p} = ${x - p}.` }
  },
  () => {
    const x = pick([12, 16, 20, 24, 30, 36])
    const p = rand(1, x - 1)
    if (p * 2 === x) return knowledgeQuick[3]()
    return ratioWord(...simp(p, x - p),
      `Partner : you = ${r(p, x - p)} = ${rs(p, x - p)}.`,
      `Out of ${x} counters, your partner has ${p} and you have ${x - p}. What is the ratio of partner's counters to yours in simplest form?`)
  },
]

const knowledgeWord = [
  () => {
    const [a, b] = twoNames()
    // shares that still need simplifying (e.g. 8 and 12 → 2 : 3), never an equal split
    const x = pick([12, 18, 20, 24, 30, 36])
    const p = rand(2, x - 2)
    if (p * 2 === x || gcd(p, x - p) === 1) return knowledgeWord[0]()
    const ans = rs(p, x - p)
    return {
      type: 'mcq',
      text: `${a} and ${b} share ${x} seeds. ${a} gets ${p} seeds. What is the ratio of ${a}'s seeds to ${b}'s seeds in simplest form?`,
      options: mcq(ans, [rs(x - p, p), r(p, x), r(1, 1)], randomRatio),
      answer: ans,
      working: `${b} gets ${x} − ${p} = ${x - p}. ${r(p, x - p)} = ${ans}.`,
    }
  },
  () => {
    const s = share()
    return {
      type: 'mcq',
      text: `To share ${s.x} marbles in the ratio ${r(s.m, s.n)}, what is the first step?`,
      options: shuffle([
        `Split the ${s.x} marbles into ${s.m + s.n} equal groups`,
        `Split the ${s.x} marbles into ${s.m * s.n} equal groups`,
        `Give ${s.m} marbles to one person and ${s.n} to the other, and stop`,
        'Split the marbles into 2 equal halves',
      ]),
      answer: `Split the ${s.x} marbles into ${s.m + s.n} equal groups`,
      working: `For ${r(s.m, s.n)} we need ${s.m} + ${s.n} = ${s.m + s.n} equal groups. ${steps(s)}`,
    }
  },
  () => {
    const s = share(5, 2, 8)
    const right = `${s.a} and ${s.b}`
    return {
      type: 'mcq',
      text: `Which pair of shares divides ${s.x} pencils in the ratio ${r(s.m, s.n)}?`,
      options: mcq(right, [`${s.b} and ${s.a}`, s.x % 2 ? `${s.a + 1} and ${s.b - 1}` : `${s.x / 2} and ${s.x / 2}`, `${s.m} and ${s.n}`], () => {
        const k = rand(1, s.x - 1); return `${k} and ${s.x - k}`
      }),
      answer: right,
      working: `${steps(s)} Check: ${s.a} + ${s.b} = ${s.x} and ${r(s.a, s.b)} = ${r(s.m, s.n)}.`,
    }
  },
]

/* ================= UNDERSTANDING ================= */
const understandingQuick = [
  () => {
    const s = share()
    return { type: 'number', text: `${s.x} is shared in the ratio ${r(s.m, s.n)}. What is the size of each group?`, answer: s.g,
      working: `${s.m} + ${s.n} = ${s.m + s.n} groups. ${s.x} ÷ ${s.m + s.n} = ${s.g}.` }
  },
  () => {
    const s = share()
    const big = Math.max(s.a, s.b)
    return { type: 'number', text: `Share ${s.x} in the ratio ${r(s.m, s.n)}. What is the larger share?`, answer: big, working: steps(s) }
  },
  () => {
    const s = share()
    return ratioWord(s.m, s.n, `${r(s.a, s.b)}: divide both by ${s.g} to get ${r(s.m, s.n)}.`,
      `${s.x} sweets were shared as ${s.a} and ${s.b}. In what ratio were they shared? (simplest form)`)
  },
  () => {
    const s = share(5, 2, 10)
    const right = Math.random() < 0.5
    const [p, q] = right ? [s.a, s.b] : [s.a + 1, s.b - 1]
    return yesNo(right, `Is sharing ${s.x} as ${p} and ${q} the same as sharing it in the ratio ${r(s.m, s.n)}? (yes / no)`,
      right ? `${steps(s)} So yes.` : `${steps(s)} ${p} and ${q} are not these shares, so no.`)
  },
  () => {
    const s = share()
    const rounds = s.g
    return { type: 'number', text: `${s.x} counters are dealt in rounds: each round, one person takes ${s.m} and the other takes ${s.n}. How many rounds until none are left?`,
      answer: rounds, working: `Each round uses ${s.m} + ${s.n} = ${s.m + s.n} counters. ${s.x} ÷ ${s.m + s.n} = ${rounds} rounds.` }
  },
]

const understandingWord = [
  () => {
    const [a, b] = twoNames()
    // group size is a multiple of m × n so that the mistaken x ÷ m and x ÷ n are whole numbers too
    const [m, n] = pick([[2, 3], [3, 2], [3, 4], [2, 5], [4, 3]])
    const g = m * n * rand(1, 2)
    const x = (m + n) * g
    const wrong = `${x / m} and ${x / n}`
    const right = `${m * g} and ${n * g}`
    return {
      type: 'mcq',
      text: `${a} wants to share ${x} stickers with ${b} in the ratio ${r(m, n)}. ${a} says: "Just divide ${x} by ${m} and by ${n}." What are the correct shares?`,
      options: mcq(right, [wrong, `${x / 2} and ${x / 2}`, `${n * g} and ${m * g}`], () => { const k = rand(1, x - 1); return `${k} and ${x - k}` }),
      answer: right,
      working: `Dividing by ${m} and by ${n} separately does not work. ${steps({ m, n, g, x, a: m * g, b: n * g })}`,
    }
  },
  () => {
    const x = pick([12, 18, 20, 24, 28, 30, 35, 36, 40, 42, 45, 48, 54, 56, 60, 63, 72])
    const all = [] // every simplest-form ratio with terms up to 7 (1 : 1 included)
    for (let m = 1; m <= 7; m++) for (let n = 1; n <= 7; n++) if (gcd(m, n) === 1) all.push([m, n])
    const fits = shuffle(all.filter(([m, n]) => x % (m + n) === 0))
    const bad = pick(all.filter(([m, n]) => x % (m + n) !== 0))
    const answer = r(...bad)
    return {
      type: 'mcq',
      text: `${x} counters must be shared so that each person gets whole counters. Which ratio will NOT work?`,
      options: shuffle([answer, ...fits.slice(0, 3).map(p => r(...p))]),
      answer,
      working: `For ${answer} we need ${bad[0] + bad[1]} equal groups, but ${x} ÷ ${bad[0] + bad[1]} is not a whole number. For the others, ${x} divides exactly into the groups.`,
    }
  },
  () => {
    const s = share(6, 2, 9)
    const [a, b] = twoNames()
    return {
      type: 'mcq',
      text: `${a} and ${b} share ${s.x} laddoos in the ratio ${r(s.m, s.n)} by dealing rounds: ${a} takes ${s.m}, then ${b} takes ${s.n}, again and again. How many laddoos does ${a} end up with?`,
      options: mcq(String(s.a), [String(s.b), String(s.m), String(s.x - s.m)], () => String(rand(2, s.x - 1))),
      answer: String(s.a),
      working: `Each round uses ${s.m + s.n} laddoos, so there are ${s.x} ÷ ${s.m + s.n} = ${s.g} rounds. ${a} gets ${s.m} × ${s.g} = ${s.a}.`,
    }
  },
]

/* ================= APPLICATION ================= */
const applicationQuick = [
  () => {
    const s = share(5, 2, 10, 10)
    return { type: 'number', text: `Divide ₹${s.x} in the ratio ${r(s.m, s.n)}. What is the smaller share?`, answer: Math.min(s.a, s.b), unit: '₹',
      working: steps(s, '', '₹') }
  },
  () => {
    const s = share(7, 2, 9)
    return { type: 'number', text: `A ${s.x} cm ribbon is cut in the ratio ${r(s.m, s.n)}. How long is the longer piece?`, answer: Math.max(s.a, s.b), unit: 'cm',
      working: steps(s, ' cm') }
  },
  () => {
    const s = share()
    return { type: 'number', text: `Share ${s.x} marbles in the ratio ${r(s.m, s.n)}. How many are in the first share?`, answer: s.a, unit: 'marbles',
      working: steps(s) }
  },
  () => {
    const s = share(6, 2, 9)
    return { type: 'number', text: `${s.x} laddoos are shared in the ratio ${r(s.m, s.n)}. How many more does one person get than the other?`,
      answer: Math.abs(s.a - s.b), unit: 'laddoos', working: `${steps(s)} Difference: ${Math.abs(s.a - s.b)}.` }
  },
]

const applicationWord = [
  () => {
    const [a, b] = twoNames()
    const s = share(5, 2, 12, 10)
    const askA = Math.random() < 0.5
    return {
      type: 'number',
      text: `${a} and ${b} get ₹${s.x} as pocket money for the month. It is shared in the ratio of their ages, ${r(s.m, s.n)}. How much does ${askA ? a : b} get?`,
      answer: askA ? s.a : s.b, unit: '₹',
      working: steps(s, '', '₹'),
    }
  },
  () => {
    const [ta, tb] = shuffle(['Team Tiger', 'Team Eagle', 'Team Lotus', 'Team Peacock']).slice(0, 2)
    const [m, n] = coprimePair(5, 2)
    const k = rand(4, 9)
    const g = pick([50, 100, 200])
    const x = (m + n) * g
    const big = m > n ? ta : tb
    return {
      type: 'number',
      text: `In a quiz, ${ta} scored ${m * k} points and ${tb} scored ${n * k} points. A prize of ₹${x} is shared in the ratio of their scores. How much does ${big} get?`,
      answer: Math.max(m, n) * g, unit: '₹',
      working: `Scores ${r(m * k, n * k)} = ${r(m, n)}. Groups = ${m + n}, each = ₹${x} ÷ ${m + n} = ₹${g}. ${big} gets ${Math.max(m, n)} × ${g} = ₹${Math.max(m, n) * g}.`,
    }
  },
  () => {
    const [a, b] = twoNames()
    const [m, n] = coprimePair(5, 1)
    const unit = pick([100, 200, 500])
    const g = pick([50, 75, 100, 150])
    const x = (m + n) * g
    const askA = Math.random() < 0.5
    return {
      type: 'number',
      text: `${a} put ₹${m * unit} and ${b} put ₹${n * unit} into a school stall. They made a profit of ₹${x} and shared it in the ratio of the money they put in. What is ${askA ? a : b}'s share of the profit?`,
      answer: (askA ? m : n) * g, unit: '₹',
      working: `Money put in: ${r(m * unit, n * unit)} = ${r(m, n)}. Groups = ${m + n}, each = ₹${x} ÷ ${m + n} = ₹${g}. ${askA ? a : b} gets ${askA ? m : n} × ${g} = ₹${(askA ? m : n) * g}.`,
    }
  },
  () => {
    const [m, n] = coprimePair(7, 2)
    const g = rand(3, 12)
    const [p1, p2] = pick([['mango', 'neem'], ['tomato', 'chilli'], ['rose', 'marigold']])
    return {
      type: 'number',
      text: `A school garden has ${(m + n) * g} saplings of ${p1} and ${p2} in the ratio ${r(m, n)}. How many ${p1} saplings are there?`,
      answer: m * g, unit: 'saplings',
      working: steps({ m, n, g, x: (m + n) * g, a: m * g, b: n * g }),
    }
  },
  () => {
    const [m, n] = coprimePair(7, 1)
    const [hi, lo] = m > n ? [m, n] : [n, m]
    const g = rand(2, 12)
    const [a, b] = twoNames()
    return {
      type: 'number',
      text: `${a} and ${b} share some marbles in the ratio ${r(hi, lo)}. ${a} gets ${(hi - lo) * g} more marbles than ${b}. How many marbles were there in all?`,
      answer: (hi + lo) * g, unit: 'marbles',
      working: `The difference is ${hi} − ${lo} = ${hi - lo} group${hi - lo > 1 ? 's' : ''} = ${(hi - lo) * g}, so each group = ${g}. Total = (${hi} + ${lo}) × ${g} = ${(hi + lo) * g}.`,
    }
  },
  () => {
    const s = share(6, 2, 10)
    const [a, b] = twoNames()
    return {
      type: 'number',
      text: `A ${s.x} m rope is cut into two pieces in the ratio ${r(s.m, s.n)}. ${a} takes the first piece and ${b} takes the second. How long is ${b}'s piece?`,
      answer: s.b, unit: 'm',
      working: steps(s, ' m'),
    }
  },
]

export const SHARING_SETS = {
  knowledge: { quick: knowledgeQuick, word: knowledgeWord },
  understanding: { quick: understandingQuick, word: understandingWord },
  application: { quick: applicationQuick, word: applicationWord },
}

export const makeSharingQuestion = (level, n) => makeQuestionFrom(SHARING_SETS, level, n)
export const makeSharingHomework = () => makeHomeworkFrom(SHARING_SETS)
