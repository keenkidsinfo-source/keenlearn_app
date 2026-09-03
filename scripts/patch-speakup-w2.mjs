/**
 * patch-speakup-w2.mjs
 * Patches G1-2 Week 2 and G3-4 Week 2 SpeakUp sessions in the DB
 * with content from SpeakUp_TeacherGuide_v5.
 *
 * Run: node scripts/patch-speakup-w2.mjs
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

const sql = postgres(process.env.DATABASE_URL)

const patches = [
  // ─── G1-2 Week 2: Voice — Big, Slow & Clear ────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    updates: {
      title: 'SpeakUp! Week 2 — Voice: Big, Slow & Clear',
      weekWord: 'Project',
      weekWordDef: 'to send your voice to the back of the room so everyone can hear',
      prompt: 'What is your favourite food? Tell us what it tastes like!',
      timeLimit: 45,
      structure: [
        '🍕 "My favourite food is ___."',
        '😋 "It tastes ___ and ___."  (two describing words)',
        '❤️ "I love it because ___."',
      ],
      improvGame: {
        name: 'Emotion Switch',
        description: 'Students say a sentence in different emotions — builds vocal variety and confidence!',
        instructions: [
          'Give everyone the sentence: "I love Mondays!"',
          'Call out an emotion: HAPPY / SCARED / BORED / EXCITED / ROBOT',
          'Everyone says the sentence in that emotion at the same time.',
          'Do 5 rounds, then try a new sentence.',
          'Keep the pace fast — emotion to emotion with no gap.',
        ],
      },
      sessionPlan: [
        {
          startMin: 0, endMin: 8, label: 'WARM-UP', emoji: '🎭', title: 'Emotion Switch',
          steps: [
            { time: '0:00', action: 'Tell the class: "Today\'s pillar is VOICE — volume, pace, and expression. But first — warm up your voice!" Give everyone the sentence: "I love Mondays!"' },
            { time: '1:00', action: 'Call an emotion: HAPPY. Everyone says "I love Mondays!" in that emotion — all at the same time. Then: SCARED. BORED. EXCITED. ROBOT. Do all 5 in quick succession — one emotion every 20 seconds. No waiting between emotions.' },
            { time: '5:00', action: 'New sentence: "My teacher is amazing!" Run 3 more emotions. Watch for flat students — whisper: "Feel the emotion in your face first, then open your mouth." Expression comes from the body, not just the voice.' },
            { time: '7:30', action: '"You just used your voice 8 different ways! That\'s what we build today — a voice with range." Sit everyone down.' },
          ],
        },
        {
          startMin: 8, endMin: 52, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Voice Dial + Slow-Mo + Food Speeches',
          steps: [
            { time: '8:00', action: 'Draw the Voice Dial on the board: 1 to 5. Label them: 1 = whisper, 3 = just right (classroom), 5 = outdoor shout. Hold up the Voice Dial picture card. "Today\'s Word is PROJECT — sending your voice to the back wall."' },
            { time: '10:00', action: 'VOICE DIAL practice. One student says their name at level 1. Can the back row hear? Then level 3. Then level 5. "Which level do we use inside?" (Level 3.) Repeat with 3–4 students. Physical cue: hand to ear = too quiet. Thumbs up = just right.' },
            { time: '17:00', action: 'SLOW-MO vs. FAST-SPEAK. Say "My favourite food is pizza" three ways — class echoes each. Too fast: rush through it. Too slow: "My……favourite……food……is……pizza." Just right: clear, steady. "THAT\'s the target — medium pace, every word clear."' },
            { time: '24:00', action: 'EXPRESSION PRACTICE. Hold up the Feeling Faces picture card. A student picks one card face-down (surprise!). They say a sentence in that feeling. Class guesses the emotion — write or whisper to a neighbour first, then reveal. Do 5–6 rounds.' },
            { time: '35:00', action: 'FOOD SPEECHES. Write the 3 sentence starters on the board big and clear: "My favourite food is ___." / "It tastes ___ and ___." / "I love it because ___." Each student stands, says all 3 lines at level 3, sits. Audience holds up fingers (1-5) to rate volume after each speech — 3 seconds, then move on.' },
            { time: '37:00', action: 'If a student freezes: point to LINE 1 on the board and say the first three words with them — "My favourite food…" — then stop. Let them continue. Do not finish the sentence for them. A 5-second pause is fine.' },
          ],
        },
        {
          startMin: 52, endMin: 60, label: 'WRAP-UP', emoji: '🌟', title: 'Voice Check-Out',
          steps: [
            { time: '52:00', action: '"Three questions — hands up for each. Who practised VOLUME today?" (all hands). "Who practised PACE?" (all hands). "Who practised EXPRESSION?" (all hands). "That\'s the Voice Pillar — all three in one session."' },
            { time: '54:00', action: 'Star of the Day: name the student whose voice reached the back row most consistently — or who tried the expression activity with the most commitment. Be specific about what you noticed.' },
            { time: '55:30', action: '"Next week: BODY. How you stand and use your hands is half of speaking. Between now and then — notice how people\'s bodies change when they speak in front of a group."' },
            { time: '57:00', action: 'Closing ritual. "I AM A SPEAKER!" — at level 5 (outdoor energy). Then level 1 (whisper). Then level 3 (just right). "Level 3 every time we speak in this room." Fist bump or high five as students leave.' },
          ],
        },
      ],
      pictureCards: [
        { name: 'Voice Dial', emoji: '🎚️', use: 'Draw on board at 8:00; hold up during speeches — hand to ear = too quiet, thumbs up = just right' },
        { name: 'Feeling Faces', emoji: '😄', use: 'Used at 24:00 for Expression Practice — students pick a card and speak in that emotion' },
        { name: 'Three Pillars Poster', emoji: '3️⃣', use: 'Point to VOICE pillar throughout' },
      ],
    },
  },

  // ─── G3-4 Week 2: Voice — Project, Pace & Variety ──────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    updates: {
      title: 'SpeakUp! Week 2 — Voice: Project, Pace & Variety',
      weekWord: 'Projection',
      weekWordDef: 'aiming your voice at the back wall so the whole room can hear',
      prompt: 'Give us "The sky is falling" — five different ways!',
      timeLimit: 90,
      structure: [
        '📢 VOLUME: aim at the back wall, not the front row',
        '🐢 PACE: slow on important words, faster on lists',
        '⏸️ PAUSE: 2 seconds of silence says "this matters"',
        '🎵 PITCH: vary it — monotone puts people to sleep',
        '🔤 CLARITY: over-enunciate consonants; do not swallow endings',
      ],
      improvGame: {
        name: 'Vocal Warm-Up Sequence',
        description: '3-minute sequence — use this at the start of every session to loosen the voice.',
        instructions: [
          'Lip trills for 30 seconds — loosens face and breath.',
          'Hum and feel the vibration in your chest (30 sec).',
          '"The tip of the tongue, the teeth, the lips" — 3 times, getting faster.',
          'Count 1-10, getting louder on each number.',
          'Count 10-1, getting slower on each number.',
        ],
      },
      sessionPlan: [
        {
          startMin: 0, endMin: 8, label: 'WARM-UP', emoji: '🎭', title: 'Vocal Warm-Up Sequence',
          steps: [
            { time: '0:00', action: 'Tell the class: "Today\'s pillar is VOICE — volume, pace, pitch, pause, and clarity as deliberate tools. We start with a 3-minute physical warm-up. This sequence starts every SpeakUp session from now on." Run all five steps back to back with no gap.' },
            { time: '0:30', action: 'Lip trills: 30 seconds — everyone buzzes their lips. Model it without embarrassment. "This loosens your face and connects your breath."' },
            { time: '1:00', action: 'Hum: 30 seconds. "Put your hand on your chest — feel the vibration. That\'s your resonance. The more you feel it, the more the audience feels you."' },
            { time: '1:30', action: '"The tip of the tongue, the teeth, the lips." Say it once slowly, then faster, then fastest. 3 rounds together. Articulation drill.' },
            { time: '2:30', action: 'Count 1-10, one number louder each time. Then 10-1, one number slower each time. Debrief: "Notice how much range you have? That range is your toolkit."' },
          ],
        },
        {
          startMin: 8, endMin: 52, label: 'MAIN ACTIVITY', emoji: '🎤', title: 'Voice Toolkit + Same Sentence 5 Ways + Excerpt Practice',
          steps: [
            { time: '8:00', action: 'Write THE VOICE TOOLKIT on the board — 5 tools: VOLUME (aim at the back wall) / PACE (slow on key words, faster on lists) / PAUSE (2 seconds = "this matters") / PITCH (vary it — monotone loses the room) / CLARITY (over-enunciate consonants; never swallow endings). Read each aloud and give a quick demo. "These are your 5 tools. Today you use all of them."' },
            { time: '13:00', action: 'THE SAME SENTENCE, 5 WAYS. Write on the board: "The sky is falling." Demo each version: (1) Monotone — flat, robotic. (2) Too fast — sprint through it. (3) Too quiet — barely audible. (4) Dramatic pause before "falling" — "The sky is… falling." (5) Full vocal expression — pitch, pace, volume all varied. After each version, students call out which toolkit tool is being demonstrated. Make the contrast obvious.' },
            { time: '20:00', action: '"Now you try. Everyone say \'The sky is falling\' four times in a row — monotone, too fast, pause before \'falling\', then full expression." Do it all together simultaneously. Then pick 3-4 students to perform individually. Give specific feedback on which tool each student used best.' },
            { time: '28:00', action: 'EXCERPT PRACTICE. Each student gets or chooses a 3-4 sentence excerpt (from a book, script, or their own writing). They practise it using at least 3 Voice Toolkit tools. 4 minutes to prepare — annotate the excerpt: underline where to pause, circle words to slow down, mark where to vary pitch.' },
            { time: '32:00', action: 'Partners give feedback using the Voice Toolkit checklist: one tool used well + one tool missing. Then 4-5 students deliver their excerpt to the full group. Class names the toolkit tools they heard after each performance — specifically, not vaguely.' },
          ],
        },
        {
          startMin: 52, endMin: 60, label: 'WRAP-UP', emoji: '🌟', title: 'Voice Toolkit Check-Out',
          steps: [
            { time: '52:00', action: '"Name all 5 toolkit tools — no looking." Call on students: VOLUME, PACE, PAUSE, PITCH, CLARITY. "Which did you use best today? Which is still weakest?" Take 4-5 honest answers. Do not correct — awareness is the goal.' },
            { time: '55:00', action: 'Star of Day: the student with the most deliberate use of the toolkit — someone who made a visible choice to change their voice at a specific moment. Name the exact moment: "At 0:45, they paused for a full 2 seconds before the key word. The room leaned in."' },
            { time: '56:30', action: '"Next week: BODY LANGUAGE. Start noticing this week: how do people\'s bodies change when they speak in front of a group?"' },
            { time: '58:00', action: 'Closing ritual — three versions in a row. "I AM A SPEAKER!" — quiet and slow. Then full volume and expression. Then crisp, articulated, every consonant. "Five tools. One sentence. That\'s the toolkit." Fist bump or high five as students leave.' },
          ],
        },
      ],
      pictureCards: [
        { name: 'Voice Toolkit', emoji: '🎙️', use: 'Written on board at 8:00 — keep visible all session; students refer to it during excerpt practice and partner feedback' },
        { name: 'Three Pillars Poster', emoji: '3️⃣', use: 'Point to VOICE pillar throughout' },
      ],
    },
  },
]

async function run() {
  for (const patch of patches) {
    const [item] = await sql`
      SELECT ci.id, ci.title, ci.metadata
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum cur ON cur.id = cd.curriculum_id
      WHERE ci.subject = 'public_speaking'
        AND ci.grade_band = ${patch.gradeBand}
        AND cur.week_number = ${patch.weekNumber}
        AND cur.grade_band = ${patch.gradeBand}
      LIMIT 1
    `

    if (!item) {
      console.warn(`⚠  No public_speaking item found for ${patch.gradeBand} week ${patch.weekNumber}`)
      continue
    }

    const existingMeta = item.metadata || {}
    const newMeta = { ...existingMeta, ...patch.updates }

    await sql`
      UPDATE content_items
      SET title    = ${patch.updates.title},
          metadata = ${JSON.stringify(newMeta)}
      WHERE id = ${item.id}
    `

    console.log(`✓ ${patch.gradeBand} Week ${patch.weekNumber}: "${item.title}" → "${patch.updates.title}"`)
  }

  await sql.end()
  console.log('\nDone! Week 2 SpeakUp patches applied from v5 doc.')
}

run().catch(e => { console.error(e); process.exit(1) })
