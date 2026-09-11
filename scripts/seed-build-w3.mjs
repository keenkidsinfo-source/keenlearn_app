/**
 * seed-build-w3.mjs
 * Seeds Week 3 build content — Marble Run (Sep 14)
 *
 * G1-2: Simple zigzag marble run (3 shelves + catcher)
 * G3-4: Winding marble run with 4 requirements + speed challenge
 *
 * Source: KeenKids_BuildDay_MarbleRun_Sep14
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-build-w3.mjs
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

const builds = [
  // ── G1-2 Week 3: Simple Marble Run ──────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 3,
    title: 'Marble Run',
    tagline: 'Build a zigzag marble run with 3 shelves and a catcher at the bottom!',
    resultFields: {
      a:               { label: 'Did marble reach catcher? (Round 1)',  key: 'round1'     },
      b:               { label: 'Did marble reach catcher? (After fix)', key: 'afterFix'  },
      unit:            'runs',
      leaderboard:     'more',
      showLeaderboard: false,
    },
    steps: [
      {
        emoji: '🔭',
        title: 'The Big Science',
        text: 'GRAVITY pulls the marble DOWN the ramp. FRICTION slows it — rough surfaces create more friction than smooth ones. ANGLE controls speed: steeper = faster, flatter = slower. Every design decision you make today is a physics decision!',
        tip: 'Remember: if the marble stops, it usually means too much friction or the ramp is too flat. If it flies off, the ramp is too steep or the gap is too wide.',
      },
      {
        emoji: '📦',
        title: 'Build the base box',
        text: 'Lay Sheet 1 flat on the desk. Tape Sheet 2 flat on top for extra rigidity. Cut Sheet 3 into 4 wall strips. Tape one strip upright along each edge — LEFT wall, RIGHT wall, and TOP wall only. Leave the BOTTOM open — this is where the catcher cup goes. Tape all corners firmly so walls stand straight.',
        tip: 'The walls must stand upright without leaning inward. Press the tape down on all edges. A wobbly box = a wobbly marble run.',
      },
      {
        emoji: '📐',
        title: 'Checkpoint 1 — Shelf 1',
        text: 'Take your FIRST cardboard strip. Tape one end to the LEFT wall, angling DOWN toward the right. Leave a GAP on the right side so the marble can fall off and drop to the next shelf. This is your starting ramp — it should be fairly steep so the marble picks up speed.',
        tip: 'Steeper = faster start. But if it\'s too steep the marble might fly off the end instead of falling onto Shelf 2. Try about a 30–45° angle.',
      },
      {
        emoji: '📐',
        title: 'Checkpoint 2 — Shelf 2',
        text: 'Take your SECOND cardboard strip. Tape one end to the RIGHT wall BELOW Shelf 1, angling DOWN toward the left. Leave a GAP on the LEFT side so the marble can fall to Shelf 3. The marble should fall from Shelf 1\'s right gap down onto Shelf 2.',
        tip: 'Check that Shelf 2 sits far enough below Shelf 1 — the marble needs room to fall and land on it. If the gap is too small the marble hits the shelf edge instead of landing on top.',
      },
      {
        emoji: '📐',
        title: 'Checkpoint 3 — Shelf 3',
        text: 'Take your THIRD cardboard strip. Tape one end to the LEFT wall BELOW Shelf 2, angling DOWN toward the right. Leave a GAP on the RIGHT side. The marble falls from Shelf 2\'s left gap, lands on Shelf 3, and rolls to the right toward the catcher cup.',
        tip: 'Shelf 3 angle matters most — it\'s the final ramp into the catcher. Not too steep or the marble overshoots the cup!',
      },
      {
        emoji: '🥤',
        title: 'Add the catcher cup',
        text: 'Place the paper cup at the BOTTOM RIGHT CORNER of the box, open end facing UP. The marble should roll off Shelf 3 and drop straight into the cup. Tape the cup firmly to the base so it doesn\'t tip over when the marble lands.',
        tip: 'Position the cup so its opening lines up with where the marble will fall off Shelf 3. You can adjust the cup position after your first test.',
      },
      {
        emoji: '🎱',
        title: 'Test! Drop the marble',
        text: 'Hold the box steady. Drop the marble at the TOP of Shelf 1. Watch which shelf it stops on (if it stops). Answer on the class chart: YES or NO — did the marble reach the catcher? Run 2–3 tests.',
        tip: 'If the marble stops: look at which shelf it stopped on — that tells you exactly what to fix. Stopped on Shelf 1 → make Shelf 1 steeper. Missed the catcher → reposition the cup.',
      },
      {
        emoji: '🔧',
        title: 'Fix & Improve',
        text: 'Make ONE change and retest. Common fixes: marble stops on a shelf → make that shelf steeper. Marble misses catcher → reposition the cup. Marble flies off the side → add a small cardstock wall as a guard. Record your result after the fix on the class chart.',
        tip: 'Change only ONE thing at a time. If you change two things you won\'t know which one helped!',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My marble ___. I changed ___ and it ___." Ask: Whose marble went fastest? Why? Science words today: GRAVITY, FRICTION, RAMP, ANGLE, MOMENTUM.',
        tip: 'Real world connections: roller coasters, waterslides, pinball machines, and highway on-ramps all use the same physics as your marble run!',
      },
    ],
  },

  // ── G3-4 Week 3: Winding Marble Run ─────────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 3,
    title: 'Marble Run',
    tagline: 'Design and build a winding marble run — meet all 4 requirements, then go for the fastest time!',
    resultFields: {
      a:               { label: 'All 4 requirements met? (Yes / No)',    key: 'requirementsMet' },
      b:               { label: 'Best time (seconds)',                    key: 'bestTime'        },
      unit:            'seconds',
      leaderboard:     'less',
      showLeaderboard: true,
    },
    steps: [
      {
        emoji: '🔭',
        title: 'The Big Science',
        text: 'GRAVITY pulls the marble down. FRICTION slows it — corrugated cardboard has more friction than smooth cardstock. MOMENTUM keeps the marble moving even on flatter sections — a steep starting ramp gives it enough momentum to get through the whole run, including the obstacle. ANGLE = speed: steeper is faster.',
        tip: 'Key insight: design your starting ramp to be steep so the marble builds enough momentum to make it through the obstacle. A marble that starts slowly usually dies at the accordion.',
      },
      {
        emoji: '📝',
        title: 'Plan your route FIRST',
        text: 'Before you tape anything, draw arrows on your base showing where the marble will travel. Your run MUST include all 4 requirements: (1) At least 3 track sections. (2) At least 1 curve or turn — marble changes direction. (3) At least 1 obstacle — accordion fold, straw gate, or cup tunnel. (4) A catcher at the end. Mark each of these on your plan.',
        tip: 'Kids who plan first build faster and fail less. 5 minutes planning = 15 minutes saved during building.',
      },
      {
        emoji: '📦',
        title: 'Build the base',
        text: 'Lay Sheets 1 and 2 side by side and tape the joining edge on BOTH top and bottom — wider base. Tape Sheet 3 underneath as a support layer. Cut Sheet 4 into wall strips — for the long front and back walls join two strips end to end. Tape all 4 wall strips upright around the base edges. Tape all corners firmly.',
        tip: 'The wider two-sheet base gives you more room to design a winding route. Make sure the wall joints are taped firmly — the walls hold your track sections in place.',
      },
      {
        emoji: '🏗️',
        title: 'Checkpoint 1 — Starting ramp (3+ sections)',
        text: 'Fold your corrugated cardboard strip into a V-channel. Tape the raised end to the top left corner at a STEEP angle. This is Section 1 — the fastest part. It must be steep enough to give the marble momentum for the rest of the run. Check: is this angle steep enough to make the marble roll quickly?',
        tip: 'REQUIREMENT CHECK: You need at least 3 track sections total. Each section is a separate piece of track. Count your planned sections — make sure you have room for all of them.',
      },
      {
        emoji: '🔄',
        title: 'Checkpoint 2 — Curve or turn (required)',
        text: 'Cut a paper cup in half lengthwise. Tape it curved at the bottom of the ramp — the marble rolls into it and CHANGES DIRECTION. This is your required curve. Make sure the cup half is angled so the marble exits in the new direction and onto your next track section.',
        tip: 'REQUIREMENT CHECK: The marble must visibly change direction here. If it just hits the cup wall and stops, widen the curve opening slightly. The marble should arc smoothly, not bounce off.',
      },
      {
        emoji: '🚧',
        title: 'Checkpoint 3 — Obstacle (required)',
        text: 'Build ONE obstacle — choose from: ACCORDION FOLD: fold a cardstock strip in a zigzag, tape across the track — marble weaves through the folds. STRAW GATE: tape a straw across the track low enough the marble has to squeeze under it. CUP TUNNEL: tape a cup half upside down as a tunnel the marble rolls through.',
        tip: 'REQUIREMENT CHECK: The obstacle must actually challenge the marble, not stop it. Accordion folds should have gaps wide enough for the marble to pass but narrow enough to slow it. If the marble stops here, widen the gaps.',
      },
      {
        emoji: '🥤',
        title: 'Checkpoint 4 — Catcher (required)',
        text: 'Place the paper cup (or cup half) at the END of your run, open end facing the marble. Tape it firmly to the base so it doesn\'t tip when the marble lands. The marble\'s kinetic energy will transfer to the cup — if it\'s not taped down the cup slides away.',
        tip: 'REQUIREMENT CHECK: All 4 requirements must be met before you move to testing. Count them: 3+ sections ✓ | Curve ✓ | Obstacle ✓ | Catcher ✓',
      },
      {
        emoji: '🎱',
        title: 'Test! Does the marble complete the run?',
        text: 'Drop the marble at the top. Does it reach the catcher? Yes or No on the class chart. Then time it: use a phone stopwatch and run it 3 times. Record your BEST time on the class board. Compare with classmates — who\'s fastest, who\'s slowest? Why?',
        tip: 'SPEED CHALLENGE: Fastest time wins! But the marble still has to meet all 4 requirements. A run with only 1 section might be fast but doesn\'t count.',
      },
      {
        emoji: '💡',
        title: 'Engineering debrief',
        text: 'Look at the class chart together. Ask: Whose marble was fastest? (steeper shelves, fewer sections, smoother cardstock). Whose was slowest? (flatter angles, more sections, accordion obstacle adds friction). Can you PREDICT which design change would make YOUR run faster — without rebuilding?',
        tip: 'This is real engineering: analyzing results to predict improvements. Scientists call this "interpreting data."',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My marble took ___ seconds. The part that slowed it most was ___. If I rebuilt it I would ___." Class vote: most creative, fastest, most sections. Science words: GRAVITY, FRICTION, MOMENTUM, VELOCITY, ANGLE, KINETIC ENERGY.',
        tip: 'Real world: roller coasters, ski slopes, highway on-ramps, waterslides, pinball machines — all engineered marble runs at human scale!',
      },
    ],
  },
]

async function run() {
  console.log('\n── Build content items in DB (Week 3) ──')
  const existing = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.subject, ci.step_count,
           c.week_number,
           EXISTS (
             SELECT 1 FROM classroom_curriculum ccl WHERE ccl.curriculum_id = c.id
           ) as is_assigned
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build'
      AND c.week_number = 3
    ORDER BY ci.grade_band, ci.created_at DESC
  `
  if (existing.length === 0) {
    console.log('  No build content items found for Week 3 — will INSERT.')
  } else {
    for (const r of existing) {
      console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | ${r.step_count ?? 0} steps`)
    }
  }

  for (const build of builds) {
    // No images this week — steps are checkpoint-style text only
    const metadata = {
      tagline: build.tagline,
      resultFields: build.resultFields,
      steps: build.steps,
    }
    const stepCount = build.steps.length

    // Find assigned build content item for this week + grade
    const items = await sql`
      SELECT ci.id, ci.title, ci.created_at
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'build'
        AND ci.grade_band = ${build.gradeBand}
        AND c.week_number = ${build.weekNumber}
        AND c.grade_band = ${build.gradeBand}
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
    `

    if (items.length === 0) {
      console.warn(`⚠  No assigned classroom build found for ${build.gradeBand} week ${build.weekNumber} — trying fallback`)
      const [item] = await sql`
        SELECT ci.id, ci.title FROM content_items ci
        JOIN curriculum_content cc ON cc.content_item_id = ci.id
        JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
        JOIN curriculum c ON c.id = cd.curriculum_id
        WHERE ci.subject = 'build'
          AND ci.grade_band = ${build.gradeBand}
          AND c.week_number = ${build.weekNumber}
        ORDER BY ci.created_at DESC LIMIT 1
      `
      if (!item) {
        console.warn(`  Still not found for ${build.gradeBand} W${build.weekNumber} — skipping`)
        continue
      }
      await sql`
        UPDATE content_items
        SET title = ${build.title}, metadata = ${metadata}, step_count = ${stepCount}
        WHERE id = ${item.id}
      `
      console.log(`✓ Updated (fallback): ${build.gradeBand} W${build.weekNumber} — "${build.title}" (${stepCount} steps)`)
      continue
    }

    for (const item of items) {
      await sql`
        UPDATE content_items
        SET title = ${build.title}, metadata = ${metadata}, step_count = ${stepCount}
        WHERE id = ${item.id}
      `
      console.log(`✓ Updated: ${build.gradeBand} W${build.weekNumber} — "${build.title}" (${stepCount} steps, was: "${item.title}")`)
    }
  }

  await sql.end()
  console.log('\n✅ Done! W3 build content seeded (Marble Run — G1-2 + G3-4).')
  console.log('   Steps are checkpoint-style (no images this week).')
}

run().catch(e => { console.error(e); process.exit(1) })
