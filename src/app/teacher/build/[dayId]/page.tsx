import { redirect } from 'next/navigation'

interface Props { params: Promise<{ dayId: string }> }

export default async function TeacherBuildHubPage({ params }: Props) {
  const { dayId } = await params
  redirect(`/build/day/${dayId}`)
}
