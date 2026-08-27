import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { getCurrentLab } from '@/lib/scienceLabs'
import { ScienceLabClient } from './ScienceLabClient'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNavFromClassroom } from '@/lib/student-week-nav'

export default async function ScienceLabPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const lab = getCurrentLab()
  if (!lab) redirect('/dashboard')

  const nav = session.classroomId
    ? await getWeekNavFromClassroom(session.classroomId)
    : { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null }

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar nav={nav} gradeBand={(session.gradeBand as 'g1-2' | 'g3-4') ?? null} name={session.name} />
      <div className="flex-1 overflow-y-auto">
        <ScienceLabClient lab={lab} contentItemId={null} />
      </div>
    </div>
  )
}
