/**
 * patch-speakup-w3-g34.mjs
 * Seeds G3-4 Week 3 SpeakUp content (Body Language Mastery) into the DB.
 *
 * Run: node scripts/patch-speakup-w3-g34.mjs
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

const content = {
  title: 'SpeakUp! Week 3 — Body Language Mastery',
  pillar: 'Body',
  weekWord: 'Presence',
  weekWordDef: 'the feeling that someone owns the space they are standing in',
  tip: 'Presence isn\'t confidence — it\'s controlled stillness. Stop moving unless the movement means something.',
  tipIcon: '🧍',
  objectives: [
    'Students distinguish purposeful movement from nervous movement',
    'Students practise the 5-point body check and hold it for 90 seconds',
    'Students use gestures that reinforce — not distract from — their content',
  ],
  improvGame: {
    name: 'Mirror Master',
    description: 'Pairs mirror each other\'s body language in real time — reveals unconscious habits instantly!',
    instructions: [
      'Pairs face each other. Person A is the leader, B mirrors exactly.',
      'A moves slowly — gestures, posture shifts, expressions. B follows.',
      'Switch after 60 seconds.',
      'Round 2: both try to achieve "commanding presence" — tall, still, deliberate.',
      'Debrief: what habits did you notice in your partner? In yourself?',
    ],
  },
  prompt: 'Teach us something — a skill, a fact, a process. Be the expert for 90 seconds.',
  timeLimit: 90,
  structure: [
    '🎣 Hook — step into position BEFORE speaking',
    '📌 Point 1 — use a gesture',
    '📌 Point 2 — change location intentionally',
    '📌 Point 3 — hold eye contact for 3 seconds somewhere',
    '🏁 Conclusion — return to centre, hold the silence',
  ],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Body Language Speed Read + Mirror Master',
      steps:[
        {time:'0:00',action:'Don\'t explain. Just freeze at the front: slouched, arms crossed, looking at the floor. Hold it for 5 full seconds. Then: ask students to call out what they observe. Write their words on the board: bored, closed, untrustworthy, nervous. Now switch: stand tall, open arms slightly, slow eye contact left-to-right. Hold for 5 seconds. "What changed?" "Same person. Same content. Your brain processed me differently in each version — in under 2 seconds. That is BODY pillar." Then launch Mirror Master.'},
        {time:'1:30',action:'Mirror Master pairs. Face each other. Partner A leads: gestures, posture shifts, head tilts — slow and deliberate. Partner B mirrors exactly. 60 seconds. Switch. "Round 2: both try to achieve commanding presence simultaneously — tall, still, hands open." Let them negotiate non-verbally. Debrief: "What habits did you notice in your partner? In yourself — where did you start to fidget, sway, hide your hands?"'},
        {time:'5:00',action:'Introduce the 5-Point Body Check. Write each one: (1) FEET — shoulder-width, planted. No swaying. (2) CORE — upright, shoulders back and down. (3) HANDS — open and visible. Gestures welcome; fidgeting banned. (4) FACE — expressive, mirrors your words. (5) EYES — slow scan, 3-4 seconds per section of audience. "Three rules from today on: no swaying unless you\'re making a point with it, no hiding hands, no pacing without purpose."'},
        {time:'7:30',action:'"Video this class if possible — body language is nearly impossible to self-diagnose. If you can\'t see it, you can\'t fix it." Do the full 5-Point check together standing. "This is your pre-speech checklist. Every time."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Expert Teaching Speeches',
      steps:[
        {time:'8:00',action:'Write PRESENCE on the board. "Word of the Day: PRESENCE — the feeling that someone owns the space they\'re standing in. It\'s not confidence — it\'s controlled stillness. Stop moving unless the movement means something." Give the Gesture Lab: (1) SIZE — pinch = tiny, arms wide = enormous. (2) LIST — count on fingers as you make each point. (3) EMPHASIS — slow chop on the key word. (4) OPEN — palms up = here is what I\'m offering you. Students air-practice each one.'},
        {time:'11:00',action:'Demo: give a 30-second teaching speech with nervous body — hands in pockets, swaying, eyes down, fidgeting. Ask the class what they noticed: every specific habit. Write them. Then redo the same speech with full presence: 5-point check, 3 deliberate gestures, eye contact sweep. "Which teacher would you listen to for 45 minutes?" The contrast is what makes it land.'},
        {time:'13:30',action:'Prep: 4-5 minutes. Students plan their expert teaching speech — something they know well. Require them to plan: (1) one gesture for each of their 3 points, (2) one intentional position change, (3) where they will sweep eye contact. "These are not accidents — they\'re decisions."'},
        {time:'18:00',action:'Speeches begin. Structure: 5-point check → step into position → pause before speaking → deliver. Audience watches for (1) one deliberate gesture and (2) one nervous habit. After each: name them specifically. "I saw you gesture on Point 2 — that worked. Your hand went to your pocket twice — that\'s the habit to eliminate." Address specific tics directly: "Your hand went to your pocket 3 times — let\'s work on that." Not vague.'},
        {time:'20:30',action:'Eye Contact Challenge. In their next speech round (or as a standalone): speak 60 seconds and shift eye contact to a new person every 4-5 seconds. Debrief after: "How did it feel as the audience member when the speaker looked directly at you? For exactly 4 seconds?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Presence Check',
      steps:[
        {time:'52:00',action:'3 volunteers stand at the front simultaneously. Hold the Power Pose — feet wide, hands visible, eyes out — for 15 full seconds. Silence. Class rates each 1-5 for presence. "Notice: nobody spoke. No content. Just body. And you still made a judgment. That\'s how powerful this is."'},
        {time:'54:30',action:'Star of the Day: the student with the most deliberate, controlled body language. Name the specific habit they broke or the specific gesture that worked. "When you did [gesture] on your key point, the audience leaned in. That was not an accident. That was a choice. That\'s what we\'re building."'},
        {time:'56:00',action:'"Next week: MIND — the internal game. Nerves, emotional authenticity, and how to build a preparation habit that makes you unflappable."'},
        {time:'58:00',action:'Closing: everyone does Power Pose for 5 seconds together. Eyes forward. Hold. Then send-off.'},
      ]},
  ],
  pictureCards:[
    {name:'Body Check Card', emoji:'🧍', use:'5-point check — hold up before each speaker: feet/hands/spine/shoulders/chin'},
    {name:'Gesture Bank',    emoji:'🤲', use:'Reference for deliberate gesture planning during prep time'},
    {name:'Body Language Bingo', emoji:'🎯', use:'Audience tracks body skills observed during each speech'},
  ],
}

async function run() {
  const [item] = await sql`
    SELECT ci.id, ci.title, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd    ON cd.id = cc.curriculum_day_id
    JOIN curriculum c          ON c.id  = cd.curriculum_id
    WHERE ci.subject    = 'public_speaking'
      AND ci.grade_band = 'g3-4'
      AND c.week_number = 3
      AND c.grade_band  = 'g3-4'
    ORDER BY ci.created_at DESC
    LIMIT 1
  `

  if (!item) {
    console.error('❌ No G3-4 W3 public_speaking content item found — has seed-speakup.mjs been run?')
    await sql.end()
    process.exit(1)
  }

  const updatedMeta = { ...item.metadata, ...content }

  await sql`
    UPDATE content_items
    SET metadata = ${updatedMeta}
    WHERE id = ${item.id}
  `

  console.log(`✓ Seeded G3-4 W3: "${item.title}" → "Body Language Mastery"`)
  await sql.end()
  console.log('\n✅ Done.')
}

run().catch(e => { console.error(e); process.exit(1) })
