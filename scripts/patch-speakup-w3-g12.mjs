/**
 * patch-speakup-w3-g12.mjs
 * Patches G1-2 Week 3 SpeakUp session — adds sentence starters to the
 * 22:00 speech step so the teacher knows to write them on the board.
 *
 * Run: node scripts/patch-speakup-w3-g12.mjs
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

const newSessionPlan = [
  { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Mirror Me',
    steps:[
      {time:'0:00',action:'Stand at the front. Do NOT say "today is body week" yet. Instead, wordlessly plant your feet wide, throw your shoulders back, and make eye contact with three students one by one. Hold the silence for 5 seconds. Then dramatically slump: cross arms, look at floor, shuffle. "What changed? What did your brain tell you about me?" Take 3-4 answers. Then reveal: "Your body is broadcasting a signal before you say a single word. Today we learn to make that signal work FOR you — not against you."'},
      {time:'1:30',action:'Run Mirror Me. "Find a partner. Face each other. Partner A — move slowly: arms out, head tilt, reach up, step to the side. Partner B — mirror exactly. Every motion. Go." Give 30 seconds, then call "Switch!" Do 2 rounds. Circulate and give quiet encouragement.'},
      {time:'4:30',action:'Bring everyone back. Debrief: "What felt confident? What felt nervous? When your partner stood tall, how did you feel watching them?" Key insight: "Your body is also talking to your OWN brain — not just the audience. Stand strong and even YOU start to feel more ready. That\'s why superhero poses work."'},
      {time:'7:00',action:'"We\'re about to learn four body rules that will change how every single speech you give looks. Let\'s go."'},
    ]},
  { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Power 4 + Superhero Speeches',
    steps:[
      {time:'8:00',action:'Write POSTURE on the board. "Word of the Day: POSTURE — how you hold your body when you stand. Let\'s start with the Spot the Difference." Hold up the Body Language Bingo card (or draw two stick figures on the board): one slouching — feet together, arms crossed, looking down; one confident — feet apart, hands visible, looking out. "Call out what\'s different!" Take responses. "Which speaker would you choose to listen to for 2 full minutes? Why?"'},
      {time:'12:00',action:'Introduce The Power 4. Write each one as you say it. Hold up 1 finger: "STAND TALL — feet shoulder-width apart. Try it." Class stands. 2 fingers: "HANDS READY — at your sides or gesturing. Not in your pockets." Hold up your own hands. 3 fingers: "EYES OUT — look at the audience, not the floor. Pick one person, then shift." 4 fingers: "TAKE UP SPACE — fill your spot. Shy students make themselves small. Today we take up space." Practice each one as you name it.'},
      {time:'16:00',action:'Model the full Power 4 yourself. Do it deliberately — plant feet, show hands, sweep eyes across left-middle-right, stand wide. Then ask: "Did that change how I seemed to you before I said anything?" Then do the opposite: pocket hands, feet together, look at shoes, shrink. "Which version do you trust?" Exaggerate for laughs — students remember the contrast. "TEACHER TIP: If eye contact feels hard — look at their forehead. From 5 feet away, it looks identical to direct eye contact."'},
      {time:'20:00',action:'2 minutes to think about their superhero speech. Walk around and prompt quietly: "Who would you pick? What would you do with the power? What\'s one reason you chose this hero?" Students can sketch if needed — no writing required.'},
      {time:'22:00',action:'Write the 4 sentence starters on the board big and clear: "If I could be any superhero, I would be ___." / "My superpower would be ___." / "I would use it to ___." / "I chose this hero because ___." Speeches begin. Before each speaker: whole class does a quick Power 4 check together (class points to their own feet, hands, eyes, space). Speaker does Power 4, reads the starters on the board, then goes. Use the visible Body Language Bingo card — hold it up silently if a student\'s hands go into pockets or eyes drop to the floor.'},
      {time:'23:30',action:'After each speech: class holds up 1-4 fingers (how many Power 4 rules the speaker hit). No words — just fingers. Speaker gets to see the honest count. Then move to the next speaker. Keep pace at about 2 minutes per student.'},
    ]},
  { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Power 4 Check-Out',
    steps:[
      {time:'52:00',action:'"Name the Power 4 from memory — I\'ll point to four students, one rule each." Then: "All together — stand up, do all four right now." Class does Power 4 together for 10 seconds. "That is your pre-speech checklist from today forward. Before you say anything — Power 4 first."'},
      {time:'54:00',action:'Star of the Day: the student who held the strongest body through their whole speech. Be specific: "I\'m choosing [name] because their feet never moved, their hands were always visible, and they swept their eyes across the whole room. That body is saying: I belong here. Trust me. That is what POSTURE does."'},
      {time:'56:00',action:'"Next week: MIND — the inside game of speaking. We talk about nerves, and why the butterflies in your stomach are actually cheering for you."'},
      {time:'57:00',action:'Closing ritual. Power Pose for 5 seconds (superhero stance — feet wide, hands on hips or arms out). Then: "I AM A SPEAKER!"'},
    ]},
]

async function run() {
  // Find G1-2 W3 speaking session
  const [session] = await sql`
    SELECT ss.id, ss.title
    FROM speaking_sessions ss
    WHERE ss.grade_band = 'g1-2'
      AND ss.week_number = 3
    ORDER BY ss.created_at DESC
    LIMIT 1
  `

  if (!session) {
    console.error('❌ No G1-2 W3 speaking session found — has seed-speakup.mjs been run?')
    await sql.end()
    process.exit(1)
  }

  await sql`
    UPDATE speaking_sessions
    SET session_plan = ${JSON.stringify(newSessionPlan)}
    WHERE id = ${session.id}
  `

  console.log(`✓ Patched G1-2 W3 session: "${session.title}" — sentence starters added to 22:00 step`)
  await sql.end()
  console.log('\n✅ Done.')
}

run().catch(e => { console.error(e); process.exit(1) })
