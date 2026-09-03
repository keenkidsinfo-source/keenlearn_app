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
      prompt: 'Pick one object. Hold it up and use your three lines!',
      timeLimit: 45,
      structure: [
        '📦 "I picked a ___."  (hold it up)',
        '🏋️ "It feels ___ in my hand."  (heavy / light / kind of heavy)',
        '🪙 "It is ___ than a coin."  (heavier / lighter / about the same)',
        '✨ BONUS: "I think ___ is heavier because ___."',
      ],
      improvGame: {
        name: 'Pass the Object',
        description: 'An invisible object travels around the circle — but transforms each time. Builds imagination and speaking warmth before speeches.',
        instructions: [
          'Sit or stand in a circle.',
          'Teacher holds an invisible object — mime its weight and size.',
          'Pass to the next person. They transform it into something new.',
          'They describe it in ONE sentence ("This is now a heavy bowling ball!") and mime using it.',
          'Pass it on. Keep going until the full circle is done.',
        ],
      },
      tip: 'Hold the object while you speak — it gives your hands something to do and helps you remember your lines!',
      tipIcon: '📦',
      sessionPlan: [
        {
          startMin: 0, endMin: 10, label: 'WARM-UP', emoji: '🎭', title: 'Week Word + Pass the Object',
          steps: [
            { time: '0:00', action: 'Write BALANCE on the board. Ask: "Has anyone heard this word before?" Take 3 answers. Say: "Balance means when both sides are equal — like a seesaw sitting perfectly in the middle. Our speeches today are about heavy and light — and your seesaw from Build Day is the perfect scientist for the job!"' },
            { time: '2:00', action: 'Run Pass the Object. Sit in a circle. Teacher holds an invisible object and mimes its weight and size. Pass to the next kid — they transform it and describe it in one sentence before passing on. Keep the pace moving. Full circle takes about 5–6 minutes.' },
            { time: '9:00', action: 'Bring everyone back to seats. "Great — you all just spoke in front of the group! That was warm-up. Now we do it for real."' },
          ],
        },
        {
          startMin: 10, endMin: 18, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Teacher Models the Three Lines',
          steps: [
            { time: '10:00', action: 'Write the three lines on the board exactly as they appear in the structure. Point to each line as you read it: LINE 1: "I picked a ___." LINE 2: "It feels ___ in my hand." LINE 3: "It is ___ than a coin." Tell kids: "These three lines are your whole speech. You just fill in the blanks."' },
            { time: '12:00', action: 'Pick up a book. Say the three lines out loud while pointing to each one: "I picked a book. It feels heavy in my hand. It is heavier than a coin." Then do it again with a pencil — make it slightly funny and relaxed so kids laugh and feel the low stakes.' },
            { time: '14:00', action: 'Ask a volunteer to recite the three lines from the board. Point to each line as they say it. Then ask: "Who can do it without me pointing?" Call on 2–3 kids. The goal: kids can say the three lines from memory before partner practice.' },
            { time: '17:00', action: 'Partner practice. Each kid picks ONE object from the room or their bag. They practice the three lines with their partner. Circulate — give a quick thumbs up when the three lines are all there. Give one piece of feedback per pair: "Great! Now say line 2 a bit louder."' },
          ],
        },
        {
          startMin: 18, endMin: 50, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Class Speeches',
          steps: [
            { time: '18:00', action: 'Start class speeches. Each kid stands, holds up their object, and says the three lines. Keep it moving — 30 to 45 seconds each. After each speech: class gives 3 claps.' },
            { time: '19:00', action: 'If a kid freezes: point to LINE 1 on the board and say the first word with them: "I picked a..." and let them fill in the blank. Do NOT complete the sentence for them.' },
            { time: '30:00', action: 'ENGAGEMENT BOOST (use if energy drops): Seesaw Vote — teacher holds one object in each hand, arms out like a seesaw. Class votes which is heavier by leaning left or right in their seats. Then test on the real seesaw to check. Takes 2–3 minutes and re-engages a distracted group.' },
            { time: '40:00', action: 'BONUS challenge for confident speakers who finished early: add the bonus line — "I think ___ is heavier because ___." Let them try it with a second object.' },
          ],
        },
        {
          startMin: 50, endMin: 55, label: 'WRAP-UP', emoji: '🌟', title: 'Reflection + Week Word',
          steps: [
            { time: '50:00', action: 'Ask: "What was easy? What was hard?" Take 2–3 answers. Then: "You all used the three lines — that is a real speech structure. Scientists do the exact same thing: name the thing, describe it, compare it."' },
            { time: '52:00', action: 'Tip of the day: "Pause instead of saying um. Silence sounds CONFIDENT — try it!" Do a quick demo: pause for 3 seconds in silence. Ask: "Did that feel weird to me? Yes. Did it sound confident to you? Also yes."' },
            { time: '54:00', action: 'Week word send-off. "BALANCE." Ask the class to say it together. "Write it on a sticky note when you get home. Next week: new word, new topic."' },
          ],
        },
      ],
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
