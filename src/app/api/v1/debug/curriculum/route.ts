import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculum, curriculumDays, classroomCurriculum, schoolSchedule, classrooms } from '@/lib/db/schema'
import { eq, and, lte, desc } from 'drizzle-orm'

function getTodayStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'not logged in' }, { status: 401 })

  const week = req.nextUrl.searchParams.get('week')
  const todayStr = getTodayStr()
  const compareDateStr = (week && /^\d{4}-\d{2}-\d{2}$/.test(week)) ? week : todayStr

  const [classroom] = await db.select().from(classrooms).where(eq(classrooms.id, session.classroomId!)).limit(1)

  const scheduleRows = classroom?.schoolId
    ? await db.select().from(schoolSchedule).where(eq(schoolSchedule.schoolId, classroom.schoolId))
    : []

  const dayToSubject = Object.fromEntries(scheduleRows.map(r => [r.dayOfWeek, r.subject]))

  const [assigned] = await db
    .select({ curriculumId: classroomCurriculum.curriculumId, weekStartDate: classroomCurriculum.weekStartDate, title: curriculum.title, gradeBand: curriculum.gradeBand, weekNumber: curriculum.weekNumber })
    .from(classroomCurriculum)
    .innerJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
    .where(and(eq(classroomCurriculum.classroomId, session.classroomId!), lte(classroomCurriculum.weekStartDate, compareDateStr)))
    .orderBy(desc(classroomCurriculum.weekStartDate))
    .limit(1)

  const currDays = assigned
    ? await db.select().from(curriculumDays).where(eq(curriculumDays.curriculumId, assigned.curriculumId))
    : []

  return NextResponse.json({
    studentId: session.sub,
    classroomId: session.classroomId,
    gradeBand: classroom?.gradeBand,
    compareDateStr,
    assigned,
    scheduleRows,
    dayToSubject,
    currDays: currDays.map(d => ({ id: d.id, dayOfWeek: d.dayOfWeek, subject: d.subject, theme: d.theme })),
    subjectsMapped: currDays.map(d => d.subject),
  })
}
