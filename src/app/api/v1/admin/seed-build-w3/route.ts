/**
 * ONE-TIME seed endpoint for W3 build content (Marble Run) — slowest wins.
 * DELETE THIS FILE after running once.
 * Access: GET /api/v1/admin/seed-build-w3  (admin session required)
 */
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { contentItems, curriculumContent, curriculumDays, curriculum, classroomCurriculum } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

const builds = [
  {
    gradeBand: 'g1-2' as const,
    weekNumber: 3,
    title: 'Marble Run',
    tagline: 'Build a zigzag marble run with 3 shelves and a catcher at the bottom!',
    resultFields: {
      a:               { label: 'Did marble reach catcher? (Round 1)',   key: 'round1'    },
      b:               { label: 'Did marble reach catcher? (After fix)', key: 'afterFix'  },
      unit:            'runs',
      leaderboard:     'more',
      showLeaderboard: false,
    },
    steps: [
      { emoji: '🔭', title: 'The Big Science', text: 'GRAVITY pulls the marble DOWN the ramp. FRICTION slows it — rough surfaces create more friction than smooth ones. ANGLE controls speed: steeper = faster, flatter = slower. Every design decision you make today is a physics decision!', tip: 'Remember: if the marble stops, it usually means too much friction or the ramp is too flat. If it flies off, the ramp is too steep or the gap is too wide.' },
      { emoji: '📦', title: 'Build the base box', text: 'Lay Sheet 1 flat on the desk. Tape Sheet 2 flat on top for extra rigidity. Cut Sheet 3 into 4 wall strips. Tape one strip upright along each edge — LEFT wall, RIGHT wall, and TOP wall only. Leave the BOTTOM open — this is where the catcher cup goes. Tape all corners firmly so walls stand straight.', tip: 'The walls must stand upright without leaning inward. Press the tape down on all edges. A wobbly box = a wobbly marble run.' },
      { emoji: '📐', title: 'Checkpoint 1 — Shelf 1', text: 'Take your FIRST cardboard strip. Tape one end to the LEFT wall, angling DOWN toward the right. Leave a GAP on the right side so the marble can fall off and drop to the next shelf. This is your starting ramp — it should be fairly steep so the marble picks up speed.', tip: "Steeper = faster start. But if it's too steep the marble might fly off the end instead of falling onto Shelf 2. Try about a 30–45° angle." },
      { emoji: '📐', title: 'Checkpoint 2 — Shelf 2', text: "Take your SECOND cardboard strip. Tape one end to the RIGHT wall BELOW Shelf 1, angling DOWN toward the left. Leave a GAP on the LEFT side so the marble can fall to Shelf 3. The marble should fall from Shelf 1's right gap down onto Shelf 2.", tip: "Check that Shelf 2 sits far enough below Shelf 1 — the marble needs room to fall and land on it. If the gap is too small the marble hits the shelf edge instead of landing on top." },
      { emoji: '📐', title: 'Checkpoint 3 — Shelf 3', text: "Take your THIRD cardboard strip. Tape one end to the LEFT wall BELOW Shelf 2, angling DOWN toward the right. Leave a GAP on the RIGHT side. The marble falls from Shelf 2's left gap, lands on Shelf 3, and rolls to the right toward the catcher cup.", tip: "Shelf 3 angle matters most — it's the final ramp into the catcher. Not too steep or the marble overshoots the cup!" },
      { emoji: '🥤', title: 'Add the catcher cup', text: "Place the paper cup at the BOTTOM RIGHT CORNER of the box, open end facing UP. The marble should roll off Shelf 3 and drop straight into the cup. Tape the cup firmly to the base so it doesn't tip over when the marble lands.", tip: "Position the cup so its opening lines up with where the marble will fall off Shelf 3. You can adjust the cup position after your first test." },
      { emoji: '🎱', title: 'Test! Drop the marble', text: 'Hold the box steady. Drop the marble at the TOP of Shelf 1. Watch which shelf it stops on (if it stops). Answer on the class chart: YES or NO — did the marble reach the catcher? Run 2–3 tests.', tip: "If the marble stops: look at which shelf it stopped on — that tells you exactly what to fix. Stopped on Shelf 1 → make Shelf 1 steeper. Missed the catcher → reposition the cup." },
      { emoji: '🔧', title: 'Fix & Improve', text: "Make ONE change and retest. Common fixes: marble stops on a shelf → make that shelf steeper. Marble misses catcher → reposition the cup. Marble flies off the side → add a small cardstock wall as a guard. Record your result after the fix on the class chart.", tip: "Change only ONE thing at a time. If you change two things you won't know which one helped!" },
      { emoji: '🎤', title: 'Share out!', text: 'Tell the class: "My marble ___. I changed ___ and it ___." Ask: Whose marble went fastest? Why? Science words today: GRAVITY, FRICTION, RAMP, ANGLE, MOMENTUM.', tip: 'Real world connections: roller coasters, waterslides, pinball machines, and highway on-ramps all use the same physics as your marble run!' },
    ],
  },
  {
    gradeBand: 'g3-4' as const,
    weekNumber: 3,
    title: 'Marble Run',
    tagline: 'Design and build a winding marble run — meet all 4 requirements, then engineer the SLOWEST run!',
    resultFields: {
      a:               { label: 'All 4 requirements met? (Yes / No)',  key: 'requirementsMet' },
      b:               { label: 'Slowest time (seconds) 🏆',           key: 'bestTime'        },
      unit:            'seconds',
      leaderboard:     'more',
      showLeaderboard: true,
    },
    steps: [
      { emoji: '🔭', title: 'The Big Science', text: 'GRAVITY pulls the marble down. FRICTION slows it — corrugated cardboard has more friction than smooth cardstock. MOMENTUM keeps the marble moving even on flatter sections — a steep starting ramp gives it enough momentum to get through the whole run, including the obstacle. ANGLE = speed: steeper is faster, flatter is slower.', tip: 'The challenge today: make the marble go as SLOWLY as possible while still completing the full run. More shelves, flatter angles, and more friction = slower time!' },
      { emoji: '📝', title: 'Plan your route FIRST', text: 'Before you tape anything, draw arrows on your base showing where the marble will travel. Your run MUST include all 4 requirements: (1) At least 3 track sections. (2) At least 1 curve or turn — marble changes direction. (3) At least 1 obstacle — accordion fold, straw gate, or cup tunnel. (4) A catcher at the end. Mark each of these on your plan.', tip: 'Want a slow run? Plan MORE sections, FLATTER angles, and a more complex accordion obstacle. More friction = more time!' },
      { emoji: '📦', title: 'Build the base', text: 'Lay Sheets 1 and 2 side by side and tape the joining edge on BOTH top and bottom — wider base. Tape Sheet 3 underneath as a support layer. Cut Sheet 4 into wall strips — for the long front and back walls join two strips end to end. Tape all 4 wall strips upright around the base edges. Tape all corners firmly.', tip: "The wider two-sheet base gives you more room for a longer, windier route. The more track the marble travels, the slower the total time." },
      { emoji: '🏗️', title: 'Checkpoint 1 — Starting ramp (3+ sections)', text: 'Fold your corrugated cardboard strip into a V-channel. Tape the raised end to the top corner at an angle. This is Section 1. Tip: a FLATTER starting ramp = slower marble, but make sure it still has enough momentum to reach the end. Check: does the marble roll at all on this angle?', tip: 'REQUIREMENT CHECK: You need at least 3 track sections total. More sections = more time. Can you fit 4 or 5?' },
      { emoji: '🔄', title: 'Checkpoint 2 — Curve or turn (required)', text: 'Cut a paper cup in half lengthwise. Tape it curved — the marble rolls into it and CHANGES DIRECTION. This is your required curve. A tighter curve = more friction = slower marble. Make sure the marble still exits the curve and continues onto the next section.', tip: "REQUIREMENT CHECK: The marble must change direction here. Tighter curves lose more energy to friction — great for slowing things down!" },
      { emoji: '🚧', title: 'Checkpoint 3 — Obstacle (required)', text: 'Build ONE obstacle — the more complex the better for slowing the marble: ACCORDION FOLD: more folds = more friction = slower. STRAW GATE: lower gate = more resistance. CUP TUNNEL: longer tunnel = more contact = more friction. The obstacle is your best tool for adding time!', tip: "REQUIREMENT CHECK: The obstacle must slow the marble without stopping it completely. More accordion folds = more friction = more seconds on the clock!" },
      { emoji: '🥤', title: 'Checkpoint 4 — Catcher (required)', text: "Place the paper cup at the END of your run, open end facing the marble. Tape it firmly to the base so it doesn't tip when the marble lands. The marble's kinetic energy will transfer to the cup — if it's not taped down the cup slides away.", tip: "REQUIREMENT CHECK: All 4 requirements must be met. Count them: 3+ sections ✓ | Curve ✓ | Obstacle ✓ | Catcher ✓" },
      { emoji: '🎱', title: 'Test! Time your marble', text: "Drop the marble at the top. Does it reach the catcher? Time it with a phone stopwatch — run it 3 times. Record your SLOWEST time on the class board. The goal is to have the marble complete the full run in as many seconds as possible. Who can engineer the slowest run that still finishes?", tip: "SLOW CHALLENGE: Most seconds wins! But the marble still has to reach the catcher. A marble that stops doesn't count — it must complete the run." },
      { emoji: '💡', title: 'Engineering debrief', text: "Look at the class chart together. Whose marble was slowest? (more sections, flatter angles, more complex obstacle). Whose was fastest? Ask: what would you add to your run to make it 5 seconds slower? More sections? A longer accordion? A tighter curve? Predict before you test!", tip: 'Making something go slower on purpose requires MORE careful engineering than making it fast. This is real-world engineering — drag systems, speed limiters, braking.' },
      { emoji: '🎤', title: 'Share out!', text: 'Tell the class: "My marble took ___ seconds. The part that slowed it most was ___. If I rebuilt it I would add ___ to make it even slower." Class vote: most creative, slowest, most sections. Science words: GRAVITY, FRICTION, MOMENTUM, ANGLE, KINETIC ENERGY.', tip: 'Real world: speed limiters on cars, drag chutes on dragsters, water resistance on ships — all engineering systems designed to control and slow motion!' },
    ],
  },
]

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const log: string[] = []

  try {
    for (const build of builds) {
      const metadata = {
        tagline: build.tagline,
        resultFields: build.resultFields,
        steps: build.steps,
      }
      const stepCount = build.steps.length

      const assignedCurricula = await db
        .select({ id: curriculum.id })
        .from(curriculum)
        .innerJoin(classroomCurriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
        .where(and(eq(curriculum.gradeBand, build.gradeBand), eq(curriculum.weekNumber, build.weekNumber)))

      const curriculumIds = assignedCurricula.map(r => r.id)
      if (curriculumIds.length === 0) {
        log.push(`⚠ No assigned curriculum for ${build.gradeBand} W${build.weekNumber}`)
        continue
      }

      const days = await db
        .select({ id: curriculumDays.id })
        .from(curriculumDays)
        .where(and(
          inArray(curriculumDays.curriculumId, curriculumIds),
          eq(curriculumDays.subject, 'build'),
        ))

      if (days.length === 0) {
        log.push(`⚠ No build day for ${build.gradeBand} W${build.weekNumber}`)
        continue
      }

      const items = await db
        .select({ id: contentItems.id, title: contentItems.title })
        .from(contentItems)
        .innerJoin(curriculumContent, eq(curriculumContent.contentItemId, contentItems.id))
        .where(and(
          inArray(curriculumContent.curriculumDayId, days.map(d => d.id)),
          eq(contentItems.subject, 'build'),
        ))

      if (items.length === 0) {
        log.push(`⚠ No build content item for ${build.gradeBand} W${build.weekNumber}`)
        continue
      }

      for (const item of items) {
        await db
          .update(contentItems)
          .set({ title: build.title, metadata, stepCount })
          .where(eq(contentItems.id, item.id))
        log.push(`✓ Updated ${build.gradeBand} W${build.weekNumber} → "${build.title}" (${stepCount} steps, slowest wins)`)
      }
    }

    return NextResponse.json({ ok: true, log })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
