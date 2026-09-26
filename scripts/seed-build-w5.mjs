/**
 * seed-build-w5.mjs
 * Seeds Week 5 build content — BOTH teacher and student accounts see this.
 *
 * G1-2 Build: Simple Parachute (plastic bag + paper cup + strings + tan bark weights)
 * G3-4 Build: Origami Parachute (paper dome canopy + origami basket, connected by string)
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-build-w5.mjs
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

// ─────────────────────────────────────────────────────────────────────────────
const builds = [

  // ── G1-2 Week 5: Plastic Bag Parachute ───────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 5,
    title: 'Plastic Bag Parachute',
    theme: 'Flight + Air Resistance',
    tagline: 'Build a parachute and see how air slows things down!',
    resultFields: {
      a:               { label: 'How many tan barks did it carry?', key: 'tanBarkCount'    },
      b:               { label: 'Did it land softly? (Yes / No)',   key: 'softLanding'     },
      unit:            'tan barks',
      leaderboard:     'more',
      showLeaderboard: true,
    },
    steps: [
      {
        emoji: '🎒',
        title: 'Meet your materials',
        text: 'You have: 1 plastic bag (the parachute!), 4 pieces of string (about 30 cm each), tape, 1 small paper cup (the basket), and tan bark pieces (your cargo weights). A parachute works by trapping air underneath it — the more air, the slower it falls!',
        tip: 'Try to get 4 strings the same length — this keeps the cup hanging straight.',
      },
      {
        emoji: '🛍️',
        title: 'Prepare the parachute',
        text: 'Open the plastic bag fully and lay it flat. Find the four corners. Tear or cut a small slit (about 1 cm) near each corner — this is where you will attach the strings. The bag is your parachute canopy!',
        tip: 'If the bag has handles, use the two handle holes as two of your four attachment points!',
      },
      {
        emoji: '✂️',
        title: 'Cut 4 equal strings',
        text: 'Cut 4 pieces of string each about 30 cm long (roughly the distance from your elbow to your fingertips). Lay them side by side to check they are all the same length. Equal strings = the cup hangs straight!',
        tip: 'Use one string as your template — cut the other 3 to match it exactly.',
      },
      {
        emoji: '🔗',
        title: 'Tie strings to the parachute',
        text: 'Thread one end of each string through a corner slit in the bag. Tie a strong knot so it cannot pull out. Do this for all 4 corners — one string per corner. Give each knot a tug to test it!',
        tip: 'Double-knot each one. If a string pulls out while it is falling the whole parachute tips sideways!',
      },
      {
        emoji: '☕',
        title: 'Attach the cup basket',
        text: 'Gather all 4 free string ends together and hold them so the cup hangs below. Tape the strings firmly to the OUTSIDE of the cup near the rim — wrap tape around each string and the cup wall. All 4 strings should be the same height on the cup.',
        tip: 'Tape from outside going inward so the tape grips the string AND the cup wall at the same time.',
      },
      {
        emoji: '🌿',
        title: 'Load the cargo and drop!',
        text: 'Place 3 tan bark pieces inside the cup. Hold the parachute above your head, let the bag open, and let go! Watch what happens. Does it fall slowly or fast? Now add more tan barks one at a time — does it get faster? Count how many it can carry before it collapses or falls too fast.',
        tip: 'Drop from a higher spot for a better test — standing on a chair with a helper works well!',
      },
      {
        emoji: '🔬',
        title: 'Make it better!',
        text: 'Try ONE change and drop again: (A) Use a BIGGER bag — does more canopy = slower fall? (B) Make the strings SHORTER — does that change anything? (C) Cut a small hole in the top of the bag — some real parachutes have a vent hole so they do not spin. Compare results!',
        tip: 'Change only ONE thing at a time so you know which change made the difference!',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My parachute carried ___ tan barks before it failed." And: "When I made the bag bigger / strings shorter / added a hole, the parachute became ___." Science words: AIR RESISTANCE, DRAG, CANOPY, CARGO, GRAVITY.',
        tip: 'Real parachutes use the same principle — a large canopy traps air and creates drag to slow the parachutist down!',
      },
    ],
  },

  // ── G3-4 Week 5: Origami Paper Parachute ─────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 5,
    title: 'Origami Parachute',
    theme: 'Flight + Air Resistance',
    tagline: 'Fold a paper dome and origami basket, connect them with string, and test how well they fly!',
    resultFields: {
      a:               { label: 'Drop height (cm from ground)',  key: 'dropHeight'      },
      b:               { label: 'Weights in basket (# coins)',   key: 'coinCount'       },
      c:               { label: 'Landed upright? (Yes / No) 🏆', key: 'landedUpright'  },
      unit:            'coins',
      leaderboard:     'more',
      showLeaderboard: true,
    },
    steps: [
      {
        emoji: '📋',
        title: 'Meet your materials',
        text: 'You have: 2 square sheets of paper (same size), 4 pieces of string (~25 cm each), glue, a pen or pencil (to poke holes), and coins or small weights. Sheet 1 becomes the dome canopy. Sheet 2 becomes the box basket. Then you connect them with string. Get both sheets and your glue ready!',
        tip: 'Crease every fold SHARPLY by pressing your thumbnail along the fold line — clean creases make the origami hold its shape.',
      },

      // ── SHEET 1: CANOPY (dome parachute) ─────────────────────────────────
      {
        emoji: '📐',
        title: 'Sheet 1 — crease the parachute',
        text: 'Take Sheet 1. Fold it in HALF diagonally (corner to corner) — unfold. Fold diagonally the OTHER way — unfold. Fold in half horizontally (top to bottom) — unfold. Fold in half vertically (left to right) — unfold. You now have 4 crease lines crossing at the centre. These creases are the skeleton of your dome.',
        tip: 'Run your thumbnail along each crease to make it sharp. All 4 folds should cross exactly at the centre point of the paper.',
      },
      {
        emoji: '🔷',
        title: 'Collapse into a flat diamond',
        text: 'Rotate Sheet 1 so a CORNER points toward you (diamond orientation). Pinch the LEFT and RIGHT sides of the paper and push them toward the centre so the paper collapses flat — like squeezing the sides of a square together. You end up with a small flat diamond shape with layers. The OPEN flaps face AWAY from you.',
        tip: 'Use the existing crease lines — they want to fold naturally. If it is not collapsing, check that the crease lines go the right direction (valley vs mountain).',
      },
      {
        emoji: '🔺',
        title: 'Fold the two side flaps to centre',
        text: 'You have a flat diamond. The open side faces AWAY from you. Take the left edge of the TOP layer only and fold it to the centre line. Take the right edge of the TOP layer only and fold it to the centre line. You now have a narrower diamond shape. Flip the whole piece over and repeat — fold left edge and right edge to the centre line on this side too.',
        tip: 'Only fold the TOP layer each time — do not accidentally fold all layers at once. Press flat after each fold.',
      },
      {
        emoji: '↕️',
        title: 'Crease the top flap (both sides)',
        text: 'Find the TOP flap of the diamond. Fold it DOWN to meet the bottom point — crease sharply — then unfold it back up. Flip the whole piece LEFT to RIGHT (like turning a page). Fold the new top flap DOWN — crease sharply — then unfold it back up. These crease lines help the dome pop open.',
        tip: 'You are just making a crease, not a permanent fold. Fold down, press hard, then unfold back to the diamond shape.',
      },
      {
        emoji: '🔄',
        title: 'Rotate and crease the remaining flaps',
        text: 'Flip the left side of the diamond to the right (rotate the whole piece). The new top flap: fold it DOWN, crease sharply, unfold. Flip left to right again. Fold the new top flap DOWN, crease, unfold. You should now have crease lines on all 4 sections of the top.',
        tip: 'Think of it like rotating around the centre — you are creasing each of the 4 outer flap sections one at a time.',
      },
      {
        emoji: '⬆️',
        title: 'Fold the bottom up',
        text: 'Now fold the BOTTOM point of the diamond UP to the top — crease sharply. Unfold it back down. Then UNFOLD everything — open the paper back to a flat square. You will see a pattern of crease lines all over the paper.',
        tip: 'Do not skip the unfold at the end — you need the paper fully flat to do the next step.',
      },
      {
        emoji: '🔺',
        title: 'Shape the dome corners',
        text: 'Now go to each of the 4 corners of the flat square. At EACH corner: pinch the right side of that corner firmly and push it IN until a small triangle forms at the corner tip. Fold that triangle toward the INSIDE of the paper and press flat. Repeat for all 4 corners. The paper will naturally start curving into a dome shape!',
        tip: 'This is the trickiest step — go slowly. The triangle at each corner folds INSIDE, not outside. Watch how the dome shape emerges as you finish each corner.',
      },
      {
        emoji: '✅',
        title: 'Your dome canopy is done!',
        text: 'Gently cup the paper between your hands and press it slightly into a dome shape — the creases will help it hold the curve. Set it aside. This is your parachute canopy! Now pick up Sheet 2 to build the basket.',
        tip: 'Handle the dome carefully — the paper dome keeps its shape from the folds, so pressing it too hard can flatten it again.',
      },

      // ── SHEET 2: BASKET (origami box) ─────────────────────────────────
      {
        emoji: '📐',
        title: 'Sheet 2 — crease the basket',
        text: 'Take Sheet 2. Make the same 4 crease folds: diagonal both ways, horizontal, vertical. Unfold flat. Now fold ALL FOUR corners to the centre point — press each crease flat. The paper is now a smaller square with no corners sticking out.',
        tip: 'All 4 corners must touch the exact centre point. Check by holding it up to the light — all edges should meet.',
      },
      {
        emoji: '📏',
        title: 'Fold into thirds',
        text: 'Fold the TOP edge down to the CENTRE line — crease. Fold the BOTTOM edge up to the CENTRE line — crease. You now have a rectangle (folded into thirds). Flip the whole piece so the folds are now VERTICAL. Fold the left edge to the centre — crease. Fold the right edge to the centre — crease. You now have a small square with a grid of fold lines.',
        tip: 'After all 4 folds your piece should look like a small square — about 1/3 the size of the original sheet.',
      },
      {
        emoji: '🔷',
        title: 'Unfold and rotate to diamond',
        text: 'Unfold ONLY the last 2 side folds (the left and right ones you just did). Keep the top and bottom folds in place. Now rotate the piece so a CORNER points toward you (diamond orientation with the short folded corners still tucked in).',
        tip: 'You should still have the four original corner flaps folded to the centre — those stay folded. Only the wide top and bottom folds open back out.',
      },
      {
        emoji: '📌',
        title: 'Fold and glue two corners',
        text: 'You have a diamond shape with loose flaps at left and right. Take the LEFT flap and fold it toward the centre — crease it. Take the RIGHT flap and fold it toward the centre — crease it. Apply a small drop of glue under each flap to hold them down. Press firmly and hold for 10 seconds.',
        tip: 'Make sure the glue fully covers the overlap area so the corners do not pop open later when you add weights.',
      },
      {
        emoji: '📦',
        title: 'Form the box sides',
        text: 'Pinch the TOP corner of the diamond and fold it INWARD — it will tuck in and the two sides will fold up naturally to create a box wall. Press flat. Repeat on the BOTTOM corner — pinch and fold inward, sides fold up. You should now have a shallow box basket with four walls!',
        tip: 'If a wall flops back down, add a dab of glue at the corner where two walls meet. Hold until dry.',
      },
      {
        emoji: '✅',
        title: 'Your basket is done!',
        text: 'You should have a small open box — your origami basket! Set it next to the dome canopy. Now you will connect them with 4 strings.',
        tip: 'Test the basket by placing a few coins inside — it should hold them without popping open. If it opens, add more glue at the corners.',
      },

      // ── ASSEMBLY ─────────────────────────────────────────────────────────
      {
        emoji: '📍',
        title: 'Poke 4 holes',
        text: 'Use a pen or pencil tip to poke a small hole at each of the 4 corners of the dome canopy. Then poke a small hole at each of the 4 corners of the basket. Be gentle — push slowly to avoid tearing the paper.',
        tip: 'Place each corner on a soft surface (like your palm or an eraser) while poking so the paper does not tear.',
      },
      {
        emoji: '🧵',
        title: 'Cut 4 equal strings',
        text: 'Cut 4 pieces of string each about 25 cm long (roughly the width of your two hands side by side). Lay them next to each other to check they are all the same length. Equal lengths = the basket hangs straight and level under the canopy.',
        tip: 'Unequal strings are the number-one reason a parachute spins and tips. Take the time to make them match!',
      },
      {
        emoji: '🔗',
        title: 'Tie strings to the canopy',
        text: 'Thread one end of each string through a corner hole in the dome canopy. Tie a double knot so it cannot pull out. Attach one string to each of the 4 canopy corners. Give each knot a firm tug to test it.',
        tip: 'If the hole is too small for your knot, make it very slightly larger — but no bigger than you need.',
      },
      {
        emoji: '🏷️',
        title: 'Tie strings to the basket — done!',
        text: 'Thread the free end of each string through the corresponding basket corner hole and tie a double knot. Match up OPPOSITE corners — front-left canopy to front-left basket, back-right to back-right — so the strings do not cross. Pull each knot tight. Hold the canopy above your head and let the basket hang — it should hang flat and level!',
        tip: 'If the basket tilts, check that all 4 strings are the same length and all knots are equally tight.',
      },
      {
        emoji: '🚀',
        title: 'Drop test and challenge!',
        text: 'Drop your parachute from as high as you can safely reach. Does the dome open and the basket hang level? Now place coins in the basket one at a time and drop again after each one. Count how many coins it carries before it collapses or falls too fast. Record your highest count AND your drop height on the class chart!',
        tip: 'Drop from EXACTLY the same height each time so your comparison is fair.',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My parachute carried ___ coins from ___ cm high." And: "The hardest part of the build was ___." Science words: AIR RESISTANCE, DRAG, CANOPY, TENSION, LOAD, GRAVITY.',
        tip: 'Real round parachutes (used by military and cargo drops) work on the same dome principle — air fills the canopy and creates drag!',
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n── Build content items in DB (Week 5) ──')
  const existing = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.step_count,
           c.week_number,
           EXISTS (
             SELECT 1 FROM classroom_curriculum ccl WHERE ccl.curriculum_id = c.id
           ) as is_assigned
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build' AND c.week_number = 5
    ORDER BY ci.grade_band, ci.created_at DESC
  `
  if (existing.length === 0) {
    console.log('  No build content items found for Week 5 — will INSERT.')
  } else {
    for (const r of existing) {
      console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | ${r.step_count ?? 0} steps`)
    }
  }

  for (const build of builds) {
    const metadata = {
      theme:        build.theme,
      tagline:      build.tagline,
      resultFields: build.resultFields,
      steps:        build.steps,
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
  console.log('\n✅ Done! W5 build content seeded (Plastic Bag Parachute + Origami Parachute).')
}

run().catch(e => { console.error(e); process.exit(1) })
