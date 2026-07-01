import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'

export default async function Home() {
  const session = await getSession()

  if (!session) redirect('/login')
  if (session.role === 'teacher' || session.role === 'admin') redirect('/teacher')
  redirect('/dashboard')
}
