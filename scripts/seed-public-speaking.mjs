import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL)

const speakingContent = [
  // ─── G1-2 Week 1: Inventions ───────────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    title: 'Speaking Up: Inventions',
    meta: {
      weekWord: 'Inventor',
      weekWordDef: 'someone who creates something new',
      prompt: 'If you could invent a machine to help at home, what would it do?',
      timeLimit: 60,
      structure: [
        '🔤 Name your invention ("My machine is called...")',
        '⚙️ What does it do? ("It helps by...")',
        '❤️ Why do you love it? ("The best part is...")',
      ],
      improvGame: {
        name: 'Emotion Switch',
        description: 'Students say a sentence in different emotions — builds vocal variety and confidence!',
        instructions: [
          'Ask everyone to stand up.',
          'Give them a sentence: "I love machines!"',
          'Call out an emotion: HAPPY! SCARED! ROBOT! SLEEPY! ANGRY!',
          'All students say the sentence in that emotion at the same time.',
          'Do 4–5 emotions, then give a new sentence and repeat.',
        ],
      },
      tip: 'Look at three different people while you speak — it\'s called making eye contact!',
      tipIcon: '👀',
    },
  },

  // ─── G1-2 Week 2: Heavy & Light ───────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'Speaking Up: Heavy & Light',
    meta: {
      weekWord: 'Balance',
      weekWordDef: 'when both sides are equal — like a see-saw sitting perfectly in the middle',
      prompt: 'Pick something in the room. Is it heavy or light? How can you tell?',
      timeLimit: 60,
      structure: [
        '🎯 Name the object ("I picked...")',
        '🏋️ Heavy or light? ("It feels...")',
        '🤔 How do you know? ("I can tell because...")',
      ],
      improvGame: {
        name: 'Pass the Object',
        description: 'An invisible object travels around the room — but it keeps transforming! Builds imagination and speaking confidence.',
        instructions: [
          'Sit or stand in a circle.',
          'Teacher holds an "invisible ball" — squeeze it, feel its weight, show its size.',
          'Pass it to the next person. They must transform it into something else.',
          'They describe it briefly ("This is now a heavy bowling ball!") and mime using it.',
          'Then pass it on. Keep going until it travels the full circle.',
        ],
      },
      tip: 'Pause instead of saying "um." Silence sounds CONFIDENT — try it!',
      tipIcon: '🤫',
    },
  },

  // ─── G3-4 Week 1: Engineering Solutions ───────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'Table Topics: Engineering Solutions',
    meta: {
      weekWord: 'Engineer',
      weekWordDef: 'someone who designs and builds things to solve real problems in the world',
      prompt: "You're an engineer for one day. What problem at your school would you fix, and how would your solution work?",
      timeLimit: 90,
      structure: [
        '🎯 Open strong ("The problem I want to fix is...")',
        '⚙️ Your solution ("My design would work by...")',
        '🌍 Why it matters ("This would help people because...")',
        '💪 Close with confidence ("So that\'s why I\'d build...")',
      ],
      improvGame: {
        name: 'Yes, And...',
        description: 'Two students build a scene together — each response MUST start with "Yes, and..." Teaches quick thinking and builds on ideas without shutting them down.',
        instructions: [
          'Pick two volunteers to stand up facing each other.',
          'Give them a starting line: "We\'re engineers stuck in a broken elevator."',
          'Student A says something. Student B MUST start with "Yes, and..." and add to the story.',
          'They go back and forth 4–5 times building the scene.',
          'The class can snap when someone says something clever.',
          'Swap pairs and give a new starting scenario.',
        ],
      },
      tip: 'Your FIRST sentence is the most important — start with a bold question or surprising fact!',
      tipIcon: '💥',
    },
  },

  // ─── G3-4 Week 2: Machines vs. People ─────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'Table Topics: Machines vs. People',
    meta: {
      weekWord: 'Force',
      weekWordDef: 'a push or pull that makes something move, stop, or change shape',
      prompt: 'Strong or smart — which would you rather be? Give two reasons.',
      timeLimit: 90,
      structure: [
        '✊ State your side ("I would rather be...")',
        '1️⃣ Reason one ("My first reason is...")',
        '2️⃣ Reason two ("My second reason is...")',
        '🏁 Wrap it up ("That\'s why I choose...")',
      ],
      improvGame: {
        name: 'Hot Seat',
        description: "One student sits facing the class and must answer 3 random questions instantly — no thinking time! Perfect Table Topics training.",
        instructions: [
          'One volunteer sits in the "Hot Seat" facing the class.',
          'Classmates raise their hand to ask any question they want.',
          'The student must answer immediately — no "um", no "I don\'t know"!',
          'The class gives snaps 👏 for a great answer.',
          'After 3 questions, rotate to the next volunteer.',
          'Example starter questions: "What\'s your superpower?" / "If you could change one school rule..." / "Robots or humans — who should cook?"',
        ],
      },
      tip: 'Use your hands to show what you mean — gestures make your speech come alive!',
      tipIcon: '🙌',
    },
  },
]

async function run() {
  for (const c of speakingContent) {
    const [item] = await sql`
      SELECT ci.id, ci.title
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum cur ON cur.id = cd.curriculum_id
      WHERE ci.subject = 'public_speaking'
        AND ci.grade_band = ${c.gradeBand}
        AND cur.week_number = ${c.weekNumber}
        AND cur.grade_band = ${c.gradeBand}
      LIMIT 1
    `
    if (!item) {
      console.warn(`⚠  No public_speaking item for ${c.gradeBand} week ${c.weekNumber}`)
      continue
    }
    await sql`
      UPDATE content_items
      SET title    = ${c.title},
          metadata = ${JSON.stringify(c.meta)}
      WHERE id = ${item.id}
    `
    console.log(`✓ ${c.gradeBand} Week ${c.weekNumber}: "${c.title}" (was: ${item.title})`)
  }
  await sql.end()
  console.log('\nDone! Public speaking content updated.')
}

run().catch(e => { console.error(e); process.exit(1) })
