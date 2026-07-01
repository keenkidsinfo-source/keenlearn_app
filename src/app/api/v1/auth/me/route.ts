import { NextRequest } from 'next/server'
import { apiOk, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const userId     = req.headers.get('x-user-id')
  const role       = req.headers.get('x-role')
  const classroomId = req.headers.get('x-classroom-id')
  const gradeBand  = req.headers.get('x-grade-band')

  if (!userId || !role) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  return apiOk({ userId, role, classroomId, gradeBand })
}
