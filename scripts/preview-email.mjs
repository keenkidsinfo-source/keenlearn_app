#!/usr/bin/env node
/**
 * Generates the actual email HTML for one student so you can open it in a browser.
 * Run: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/preview-email.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const weekStartDate = '2026-08-31'

// Find the g1-2 classroom with the most students
const [classroom] = await sql`
  SELECT cl.id, cl.name, cl.grade_band
  FROM classrooms cl
  WHERE cl.grade_band = 'g1-2'
  ORDER BY (SELECT COUNT(*) FROM users u WHERE u.classroom_id = cl.id AND u.role = 'student' AND u.deleted_at IS NULL) DESC
  LIMIT 1
`
console.log(`Classroom: ${classroom.name} (${classroom.grade_band}) — ${classroom.id}`)

// Get week curriculum
const [weekRow] = await sql`
  SELECT cc.curriculum_id, cur.title, cur.theme
  FROM classroom_curriculum cc
  JOIN curriculum cur ON cur.id = cc.curriculum_id
  WHERE cc.classroom_id = ${classroom.id}
    AND cc.week_start_date::text LIKE ${weekStartDate + '%'}
  LIMIT 1
`
if (!weekRow) { console.error('No curriculum for this week'); process.exit(1) }
console.log(`Week: ${weekRow.title}`)

// Get all content items for this week
const dayItems = await sql`
  SELECT cd.subject, cc_c.content_item_id
  FROM curriculum_days cd
  JOIN curriculum_content cc_c ON cc_c.curriculum_day_id = cd.id
  WHERE cd.curriculum_id = ${weekRow.curriculum_id}
`
const contentItemIds = dayItems.map(d => d.content_item_id)
const subjectByItem  = new Map(dayItems.map(d => [d.content_item_id, d.subject]))

// Get students with notes
const students = await sql`
  SELECT id, name, display_name, parent_name, parent_email
  FROM users
  WHERE classroom_id = ${classroom.id} AND role = 'student' AND deleted_at IS NULL
  ORDER BY name
`
console.log(`Students: ${students.length}`)

// Get sessions
const sessions = await sql`
  SELECT student_id, content_item_id, completed, session_data
  FROM student_sessions
  WHERE student_id = ANY(${students.map(s => s.id)}::uuid[])
    AND content_item_id = ANY(${contentItemIds}::uuid[])
`

const sessionsByStudent = new Map()
for (const s of sessions) {
  if (!sessionsByStudent.has(s.student_id)) sessionsByStudent.set(s.student_id, new Map())
  sessionsByStudent.get(s.student_id).set(s.content_item_id, s)
}

function card(emoji, title, color, body) {
  return `<div style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:8px;padding:14px 16px;margin-bottom:12px">
    <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111">${emoji} ${title}</p>
    <div style="font-size:14px;color:#374151;line-height:1.6">${body}</div>
  </div>`
}

// Preview all students, show what would be in the Build card
console.log('\n=== Build card preview per student ===')
for (const student of students) {
  const studentName = (student.display_name ?? student.name).trim()
  const studentSess = sessionsByStudent.get(student.id) ?? new Map()

  for (const [itemId, subject] of subjectByItem.entries()) {
    if (subject !== 'build') continue

    const sess = studentSess.get(itemId)
    const data = sess?.session_data ?? null
    const done = sess?.completed === true

    console.log(`\n  ${studentName}:`)
    console.log(`    sess found: ${!!sess}`)
    console.log(`    completed: ${done}`)
    console.log(`    data keys: ${data ? Object.keys(data).join(', ') : '(null)'}`)
    console.log(`    gradeBand in data: ${data ? 'gradeBand' in data : false}`)
    console.log(`    data.note: ${data?.note ?? '(none)'}`)

    const teacherSubmitted = done && data && ('gradeBand' in data)
    const studentBuildData = data?.buildResults ?? undefined
    const hasAnyResults    = teacherSubmitted || !!studentBuildData

    let buildCardBody = ''
    if (hasAnyResults) {
      const gradeBand  = data?.gradeBand ?? classroom.grade_band ?? ''
      const buildTitle = data?.buildTitle ?? 'Build Project'
      if (gradeBand === 'g1-2') {
        const minR = data?.minRocks    ?? data?.round1Clips ?? null
        const maxR = data?.maxRocks    ?? data?.maxClips    ?? null
        const r1   = minR != null ? `Minimum rocks to slide: ${minR}` : ''
        const best = maxR != null ? `<strong>Best: ${maxR} rocks carried! 🎉</strong>` : ''
        const note = data?.note ? `<em>${data.note}</em>` : ''
        buildCardBody = [r1, best, note].filter(Boolean).join('<br/>') || 'Completed ✅'
      } else {
        const src = studentBuildData ?? data
        const c1  = src?.cranksNoLoad   != null ? `First attempt: ${src.cranksNoLoad} rocks` : ''
        const c2  = src?.cranksWithLoad != null ? `After adjustment: ${src.cranksWithLoad} rocks` : ''
        const c3  = src?.cranksImproved != null ? `<strong>Best: ${src.cranksImproved} rocks held 🎉</strong>` : ''
        const note = src?.note ? `<em>${src.note}</em>` : ''
        buildCardBody = [c1, c2, c3, note].filter(Boolean).join('<br/>') || 'Completed ✅'
      }
    } else {
      buildCardBody = 'Not recorded yet'
    }
    console.log(`    → card body: "${buildCardBody}"`)
  }
}

// Generate a full HTML email for the first student that has a note
const noteStudent = students.find(s => {
  const studentSess = sessionsByStudent.get(s.id) ?? new Map()
  for (const [itemId, subject] of subjectByItem.entries()) {
    if (subject !== 'build') continue
    const sess = studentSess.get(itemId)
    return sess?.session_data?.note
  }
  return false
})

if (noteStudent) {
  const studentName = (noteStudent.display_name ?? noteStudent.name).trim()
  const studentSess = sessionsByStudent.get(noteStudent.id) ?? new Map()
  const cards = []

  for (const [itemId, subject] of subjectByItem.entries()) {
    if (subject === 'math') continue
    const sess = studentSess.get(itemId)
    const data = sess?.session_data ?? null
    const done = sess?.completed === true

    if (subject === 'build') {
      const teacherSubmitted = done && data && ('gradeBand' in data)
      const studentBuildData = data?.buildResults ?? undefined
      const hasAnyResults = teacherSubmitted || !!studentBuildData
      const buildTitle = data?.buildTitle ?? 'Build Project'
      if (hasAnyResults) {
        const gradeBand = data?.gradeBand ?? classroom.grade_band ?? ''
        let body = ''
        if (gradeBand === 'g1-2') {
          const minR = data?.minRocks ?? data?.round1Clips ?? null
          const maxR = data?.maxRocks ?? data?.maxClips    ?? null
          const r1   = minR != null ? `Minimum rocks to slide: ${minR}` : ''
          const best = maxR != null ? `<strong>Best: ${maxR} rocks carried! 🎉</strong>` : ''
          const note = data?.note ? `<em>${data.note}</em>` : ''
          body = [r1, best, note].filter(Boolean).join('<br/>') || 'Completed ✅'
        }
        cards.push(card('🔨', `Build — ${buildTitle}`, '#f59e0b', body))
      } else {
        cards.push(card('🔨', 'Build', '#d1d5db', 'Not recorded yet'))
      }
    }
  }

  const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
    <h2>🌟 ${studentName}'s Week — ${weekRow.title}</h2>
    ${cards.join('\n')}
  </body></html>`

  const outPath = '/tmp/email-preview.html'
  writeFileSync(outPath, html)
  console.log(`\n✅ Email HTML written to ${outPath}`)
  console.log('   Open in browser: open /tmp/email-preview.html')
} else {
  console.log('\n⚠️  No student with a note found')
}

await sql.end()
