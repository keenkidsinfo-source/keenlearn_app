/**
 * patch-speakup-w5.mjs
 * Seeds Week 5 SpeakUp content for both G1-2 and G3-4.
 *
 * G1-2 W5 — "The Hook" (Voice pillar)
 *   Prompt: What is one rule at school you would change, and why?
 *   75-second speech: Hook → Rule → Problem → Fix → Close
 *
 * G3-4 W5 — "The Hook, Your Point & Your Plan" (Mind pillar)
 *   Prompt: Take a position on something you genuinely believe.
 *   90-second intro: Hook → Your Point (thesis) → Your Plan (3-point preview)
 *
 * Run: node scripts/patch-speakup-w5.mjs
 */

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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

// ── G1-2 Week 5 — The Hook ───────────────────────────────────────────────────
const g12W5 = {
  title: 'SpeakUp! Week 5 — The Hook',
  pillar: 'Voice',
  weekWord: 'Hook',
  weekWordDef: "the very first sentence of a speech that grabs everyone's attention",
  tip: 'Your first 5 seconds decide whether people lean in or tune out. Make them INCREDIBLE!',
  tipIcon: '🎣',
  objectives: [
    'Students learn 3 Hook types: Ask a Question, Wow Fact, Tiny Story',
    'Students write and deliver a Hook before their speech',
    'Students evaluate each other\'s Hooks',
  ],
  improvGame: {
    name: 'Hook or No Hook',
    description: 'Teacher starts speeches two ways — class votes on which grabs their attention!',
    instructions: [
      'Teacher gives 10-second opening A: "Today I want to talk about dogs. I have a dog."',
      'Then opening B: "What if your best friend could not talk but loved you more than anyone?"',
      'Class votes: Hook or No Hook? Why?',
      'Do 3 more pairs. Students start to identify what makes a hook work.',
      'Challenge: students write their own hook for today\'s prompt on a sticky note.',
    ],
  },
  prompt: 'What is one rule at school you would change, and why?',
  timeLimit: 75,
  structure: [
    '🎣 YOUR HOOK (question, wow fact, or tiny story)',
    '📌 Your rule ("I would change the rule about...")',
    '💡 Why it\'s a problem ("Right now it\'s a problem because...")',
    '✅ Your fix ("My new rule would be...")',
    '🎤 Close strong',
  ],
  sessionPlan: [
    { startMin: 0, endMin: 8, label: 'WARM-UP', emoji: '🎭', title: 'Hook or No Hook?',
      steps: [
        { time: '0:00', action: '"Today you learn the single most important sentence of any speech — the FIRST ONE." Don\'t explain further. Just start: "Today I want to talk about dogs. I have a dog." Pause. "Was that interesting?" (No.) Try again: "What if your best friend could never tell you any secrets — but loved you more than anyone?" Pause. "Now which one made you want to hear more?" That\'s a hook vs. no hook.' },
        { time: '2:00', action: 'Run two more pairs. Pair 2 — No Hook: "I\'m going to talk about pizza." / Hook: "If you had to eat ONE food for the rest of your life and it had to be perfect every time — what would it be?" Pair 3 — No Hook: "My topic is sports." / Hook: "Did you know the human brain makes you run faster when it\'s scared? That\'s why athletes train for pressure." After each pair: audience physically leans in or leans back. "Your body told you which one worked."' },
        { time: '5:30', action: 'Reveal the 3 Hook Types on the board: (1) ASK A QUESTION — "Have you ever wondered...?" (2) WOW FACT — "Did you know...?" (3) TINY STORY — "One morning I woke up and..." Post the Hook Types card on the wall. "These three live on that wall for the rest of the year."' },
        { time: '7:00', action: '"Before I explain today\'s speech, write your hook sentence — one sentence only. Pick your type first, then write it. You have 90 seconds." Circulate and help stuck students pick a type.' },
      ],
    },
    { startMin: 8, endMin: 52, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Rule-Change Speeches',
      steps: [
        { time: '8:00', action: 'Write HOOK on the board. "Word of the Day: HOOK — the very first sentence that grabs everyone\'s attention. Your first 5 seconds decide whether people lean in or tune out. Today\'s prompt is about a school rule you\'d change. But we\'re not starting with the rule — we\'re starting with the hook." Point to the structure: Hook → Rule → Problem → Fix → Close.' },
        { time: '9:30', action: 'Model a full speech yourself. Start with a strong hook (question type): "Have you ever sat in a class feeling like the rule was made for someone else and not you?" Then: "I would change the rule about..." Follow the structure, pointing to each part as you go. End with a clear closing. "Notice — I had your attention from the first sentence. That\'s the job of the hook."' },
        { time: '12:30', action: '2-minute prep. "Your hook is written. Now fill in the rest: the rule, why it\'s a problem, your fix, and your closing line. One idea per box — you don\'t need full sentences." Walk around and check that every student has their hook sentence ready. Remind: "Start with a question, a wow fact, or a tiny story. Not \'Today I am going to talk about...\'"' },
        { time: '14:30', action: 'Speeches begin. Before each speaker: class checks hook type (hold up 1, 2, or 3 fingers: 1 = question, 2 = wow fact, 3 = tiny story). Speaker says their hook. Audience holds up the number for the type they heard. Then the speech continues.' },
        { time: '16:00', action: 'After each speech: feedback is ONLY about the hook this week. "Did the hook grab you? Which type was it? What made it work — or what would make it stronger?" One observation per speech. Model the first: "I heard a question hook — it made me want to know the answer immediately. Strong choice."' },
      ],
    },
    { startMin: 52, endMin: 60, label: 'WRAP-UP', emoji: '🌟', title: 'Hook Hall of Fame',
      steps: [
        { time: '52:00', action: '"What are the 3 Hook types?" Point to three students — one type each. "Which is hardest to write? Which is most fun to hear?" Quick show of hands for each.' },
        { time: '54:00', action: 'Hook Hall of Fame. "Class vote — whose hook grabbed you the most today? Show of hands for each hook you remember." The winner reads their hook sentence again. "That sentence is now on the board. That\'s the standard."' },
        { time: '56:00', action: '"Next week: THE THREE THINGS — how to build the middle of your speech so every point lands. Your hook got their attention. Now you have to keep it."' },
        { time: '57:30', action: 'Closing ritual: each student says their hook sentence to a partner (fast and energetic). Then whole class: "I AM A SPEAKER!" Send-off.' },
      ],
    },
  ],
  pictureCards: [
    { name: 'Hook Types Card', emoji: '🎣', use: 'Show at warm-up and keep visible all session — 3 types: Ask/Wow Fact/Tiny Story' },
    { name: 'Voice Dial', emoji: '🎚️', use: 'Remind students their Hook needs level 4 volume — it sets the tone' },
  ],
}

// ── G3-4 Week 5 — The Hook, Your Point & Your Plan ──────────────────────────
const g34W5 = {
  title: 'SpeakUp! Week 5 — The Hook, Your Point & Your Plan',
  pillar: 'Mind',
  weekWord: 'Introduction',
  weekWordDef: 'the three-part opening of a formal speech: Hook, Your Point, and Your Plan',
  tip: 'Your hook earns attention. Your Point tells them what you think. Your Plan tells them where you\'re going. All three in under 90 seconds.',
  tipIcon: '🎣',
  objectives: [
    'Students write and deliver a three-part introduction with all components',
    'Students understand the distinct function of each: Hook, Your Point, Your Plan',
    'Students can identify what is missing from a weak introduction',
  ],
  improvGame: {
    name: 'Introduction Dissection',
    description: 'Two introductions side by side — students identify what\'s there and what\'s missing!',
    instructions: [
      'Intro A: "Today I am going to talk about social media and how it affects teenagers."',
      '"What\'s there? A topic. What\'s missing? A hook. A clear thesis. A preview of arguments."',
      'Intro B: [Hook story] → "Social media isn\'t just distracting — it\'s redesigning the teenage brain." → "I\'ll show you this through the science of dopamine, the data on sleep, and one story you won\'t forget."',
      'Name the 3 parts together: The Hook (earns attention), Your Point (central argument), Your Plan (previews 3 points).',
      '"Which intro makes you more confident about where the speech is going? Why?"',
    ],
  },
  prompt: 'Take a position on something you genuinely believe. Build and deliver a three-part introduction for that argument.',
  timeLimit: 90,
  structure: [
    '🎣 The Hook — question / wow fact / tiny story',
    '📌 Your Point — one sentence stating your central argument ("I argue that...")',
    '📋 Your Plan — "I will show you this through [Point 1], [Point 2], and [Point 3]"',
  ],
  sessionPlan: [
    { startMin: 0, endMin: 8, label: 'WARM-UP', emoji: '🎭', title: 'Introduction Dissection',
      steps: [
        { time: '0:00', action: 'Write three words on the board: HOOK · POINT · PLAN. "These are the three parts of every formal introduction. Today you master all three in one session."' },
        { time: '1:00', action: 'Read Intro A: "Today I am going to talk about social media and how it affects teenagers." Ask: "What\'s there? What\'s missing?" (Topic only — no hook, no thesis, no preview.) Confirm.' },
        { time: '3:00', action: 'Read Intro B aloud with energy — use a real hook story, a sharp thesis, and a 3-point plan. Ask: "Which version makes you more confident about where the speech is going?" Name the three parts together.' },
        { time: '7:00', action: 'Students spend 45 seconds brainstorming their position for today\'s prompt. Write one word.' },
      ],
    },
    { startMin: 8, endMin: 52, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Introduction Workshop',
      steps: [
        { time: '8:00', action: 'Write INTRODUCTION on the board. "Word of the Day: INTRODUCTION — the three-part opening that sets everything in motion."' },
        { time: '8:30', action: 'THE HOOK: "Your first sentence has one job — make the audience NEED to hear what comes next." Three types: ASK A QUESTION ("What would you do if you had one minute to save someone\'s life?") / WOW FACT ("Every 4 seconds, someone goes blind — and most of it is preventable.") / TINY STORY ("When I was seven, I got lost for 45 minutes. That is when I understood what real fear feels like.")' },
        { time: '10:00', action: 'YOUR POINT: "One sentence that answers: what do YOU think?" The test — is it arguable? On the board: NOT — "Today I will talk about recycling." (Topic.) YES — "Recycling only works when communities make it mandatory — optional programs fail." (Point.) Students draft their Your Point sentence.' },
        { time: '11:30', action: 'YOUR PLAN: "Tell the audience what\'s coming." Template: "I will show you this by looking at [Point 1], [Point 2], and [Point 3]." Students fill in their three points.' },
        { time: '13:00', action: 'Prep: students write their full three-part introduction. Partner check: "Can you name all three parts? Is the Point arguable — not just a topic? Does the Plan preview three distinct points?"' },
        { time: '17:00', action: 'Introductions delivered — each student delivers only their three-part intro (no full speech yet). After each: audience identifies aloud: hook type, paraphrase of Your Point, the three Plan items.' },
        { time: '20:00', action: 'Targeted feedback on the weakest part only: "Your hook landed — now sharpen Your Point. Right now it sounds like a topic, not a position."' },
      ],
    },
    { startMin: 52, endMin: 60, label: 'WRAP-UP', emoji: '🌟', title: 'Introduction Clinic',
      steps: [
        { time: '52:00', action: '"Without notes — what are the three parts of an introduction?" (Hook / Your Point / Your Plan.) "What is the difference between a topic and a thesis?" Take 3 answers.' },
        { time: '55:00', action: 'Star of the Day: the intro with the strongest, most arguable Your Point. Read it aloud as the model.' },
        { time: '57:00', action: '"Next week: THE BODY — three evidence-backed arguments using PIE. You\'ll build the middle of your speech on the foundation you wrote today."' },
        { time: '58:30', action: 'Closing ritual.' },
      ],
    },
  ],
  pictureCards: [
    { name: 'Hook Types Card', emoji: '🎣', use: 'Show during main activity — keep visible as students draft their hook type' },
    { name: 'Three Pillars Poster', emoji: '3️⃣', use: 'Point to MIND pillar — structure and preparation are mind skills' },
  ],
}

// ── DB update ─────────────────────────────────────────────────────────────────
async function run() {
  for (const [gradeBand, content] of [['g1-2', g12W5], ['g3-4', g34W5]]) {
    const [item] = await sql`
      SELECT ci.id, ci.metadata
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd    ON cd.id = cc.curriculum_day_id
      JOIN curriculum c          ON c.id  = cd.curriculum_id
      WHERE ci.subject    = 'public_speaking'
        AND ci.grade_band = ${gradeBand}
        AND c.week_number = 5
        AND c.grade_band  = ${gradeBand}
      ORDER BY ci.created_at DESC
      LIMIT 1
    `

    if (!item) {
      console.error(`❌ No ${gradeBand} W5 public_speaking content item found — has seed-speakup.mjs been run?`)
      continue
    }

    const updatedMeta = { ...item.metadata, ...content }

    await sql`
      UPDATE content_items
      SET metadata = ${updatedMeta}
      WHERE id = ${item.id}
    `

    console.log(`✓ Seeded ${gradeBand} W5: "${content.title}"`)
  }

  await sql.end()
  console.log('\n✅ Done — W5 speaking content live for both grades.')
}

run().catch(e => { console.error(e); process.exit(1) })
