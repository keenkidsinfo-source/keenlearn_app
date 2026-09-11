/**
 * ONE-TIME seed endpoint — W3 Marble Run, corrected G3-4 materials.
 * DELETE THIS FILE after running once.
 * GET /api/v1/admin/seed-build-w3  (admin only)
 */
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { contentItems, curriculumContent, curriculumDays, curriculum, classroomCurriculum } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

const g34Steps = [
  { emoji: '🔭', title: 'The Big Science', text: 'GRAVITY pulls the marble down. FRICTION slows it — corrugated paper has more friction than smooth cardstock, and straws are very smooth. MOMENTUM keeps the marble moving even on flatter sections — a steep starting ramp gives it enough momentum to complete the run. ANGLE = speed: steeper is faster, flatter is slower.', tip: 'The challenge today: make the marble go as SLOWLY as possible while still reaching the catcher. More sections, flatter angles, tighter curves = more seconds on the clock!' },
  { emoji: '📝', title: 'Plan your route FIRST', text: 'Before you tape anything, draw arrows on your base showing where the marble will travel. Your run MUST include all 4 requirements: (1) At least 3 track sections. (2) At least 1 curve or turn. (3) At least 1 obstacle. (4) A catcher at the end. Your materials: 4 cardstock sheets, 1 corrugated paper strip, 1 paper cup, 2 straws, 1 ice cream stick.', tip: 'Want a slow run? Plan MORE sections and FLATTER angles. More track = more friction = more time.' },
  { emoji: '📦', title: 'Build the base', text: 'Lay Sheets 1 and 2 side by side and tape the joining edge on BOTH top and bottom — wider base. Tape Sheet 3 underneath as a support layer. Cut Sheet 4 into wall strips and tape all 4 walls upright around the edges. Tape all corners firmly.', tip: 'The wider two-sheet base gives you more room for a winding route. More winding = slower time.' },
  { emoji: '🏗️', title: 'Checkpoint 1 — Starting ramp', text: 'Fold your corrugated paper strip into a shallow V-channel. Tape the raised end to one corner at an angle. Use the ice cream stick propped underneath as a support leg to hold the ramp at your chosen angle. This is Section 1. Flatter angle = less momentum = slower run (but must still roll!).', tip: 'REQUIREMENT CHECK: You need 3+ track sections total. The corrugated paper strip counts as Section 1. Your 2 straws will be Sections 2 and 3.' },
  { emoji: '🔄', title: 'Checkpoint 2 — Curve (required)', text: 'Cut the paper cup in half lengthwise. Tape one half curved at the bottom of the ramp — the marble rolls into it and CHANGES DIRECTION. This is your required curve AND Section 2. The tighter the curve, the more energy the marble loses — great for slowing things down.', tip: 'REQUIREMENT CHECK: The marble must visibly change direction. Tighter curve = more friction = more time. Keep the other cup half for the catcher.' },
  { emoji: '🚧', title: 'Checkpoint 3 — Obstacle + straw section', text: 'Use one straw as Section 3: bend it into a slight curve or tape it flat as a straight channel. Use the second straw as your OBSTACLE: tape it horizontally across the track as a low gate the marble has to roll under. The marble loses speed squeezing under the gate — perfect for a slow run.', tip: 'REQUIREMENT CHECK: The straw gate is your obstacle. Lower gate = more resistance = slower marble. But if it\'s too low the marble stops — test it!' },
  { emoji: '🥤', title: 'Checkpoint 4 — Catcher (required)', text: 'Use the second cup half as your catcher — open end facing the marble. Tape it firmly to the base so it doesn\'t slide when the marble arrives. All 4 requirements must be met before you test.', tip: 'REQUIREMENT CHECK: 3+ sections ✓ | Curve ✓ | Obstacle ✓ | Catcher ✓. Count them before you test!' },
  { emoji: '🎱', title: 'Test! Time your marble', text: 'Drop the marble at the top. Does it reach the catcher? Time it: use a phone stopwatch, run it 3 times, record your SLOWEST time on the class board. The goal: most seconds wins — but the marble must complete the full run.', tip: 'SLOW CHALLENGE: Most seconds wins! A marble that stops does not count. It must reach the catcher.' },
  { emoji: '💡', title: 'Engineering debrief', text: "Look at the class chart. Whose marble was slowest? (flatter angles, more sections, tighter curves, lower straw gate). Whose was fastest? Ask: what ONE change would add 3 more seconds to your run? Predict it — then test it if there's time.", tip: 'Making something go slower on purpose requires more careful engineering than making it fast. Speed limiters on cars and drag systems on planes use the same principles.' },
  { emoji: '🎤', title: 'Share out!', text: 'Tell the class: "My marble took ___ seconds. The part that slowed it most was ___." Class vote: most creative, slowest run, most sections. Science words: GRAVITY, FRICTION, MOMENTUM, ANGLE, KINETIC ENERGY.', tip: 'Real world: speed limiters, drag chutes on dragsters, water resistance on ships — all engineering systems designed to slow things down on purpose!' },
]

const g34Metadata = {
  tagline: 'Design and build a winding marble run — meet all 4 requirements, then engineer the SLOWEST run!',
  resultFields: {
    a:               { label: 'All 4 requirements met? (Yes / No)',  key: 'requirementsMet' },
    b:               { label: 'Slowest time (seconds) 🏆',           key: 'bestTime'        },
    unit:            'seconds',
    leaderboard:     'more',
    showLeaderboard: true,
  },
  steps: g34Steps,
}

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const log: string[] = []

  try {
    // Only updating G3-4 — G1-2 is already correct
    const assignedCurricula = await db
      .select({ id: curriculum.id })
      .from(curriculum)
      .innerJoin(classroomCurriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
      .where(and(eq(curriculum.gradeBand, 'g3-4'), eq(curriculum.weekNumber, 3)))

    const curriculumIds = assignedCurricula.map(r => r.id)
    if (curriculumIds.length === 0) {
      return NextResponse.json({ ok: false, log: ['⚠ No assigned G3-4 W3 curriculum found'] })
    }

    const days = await db
      .select({ id: curriculumDays.id })
      .from(curriculumDays)
      .where(and(inArray(curriculumDays.curriculumId, curriculumIds), eq(curriculumDays.subject, 'build')))

    const items = await db
      .select({ id: contentItems.id, title: contentItems.title })
      .from(contentItems)
      .innerJoin(curriculumContent, eq(curriculumContent.contentItemId, contentItems.id))
      .where(and(
        inArray(curriculumContent.curriculumDayId, days.map(d => d.id)),
        eq(contentItems.subject, 'build'),
      ))

    for (const item of items) {
      await db
        .update(contentItems)
        .set({ title: 'Marble Run', metadata: g34Metadata, stepCount: g34Steps.length })
        .where(eq(contentItems.id, item.id))
      log.push(`✓ Updated G3-4 W3 "${item.title}" → Marble Run (${g34Steps.length} steps, corrected materials)`)
    }

    return NextResponse.json({ ok: true, log })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
