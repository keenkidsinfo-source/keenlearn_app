import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { curriculum, curriculumDays, curriculumContent, classroomCurriculum } from '@/lib/db/schema'

export async function GET() {
  const curricula = await db.select().from(curriculum)
  const days = await db.select().from(curriculumDays)
  const content = await db.select().from(curriculumContent)
  const assignments = await db.select().from(classroomCurriculum)

  return NextResponse.json({ curricula, days, content, assignments })
}
