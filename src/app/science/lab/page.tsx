import { redirect } from 'next/navigation'
import { getCurrentLab } from '@/lib/scienceLabs'
import { ScienceLabClient } from './ScienceLabClient'

export default function ScienceLabPage() {
  const lab = getCurrentLab()

  if (!lab) {
    // No lab scheduled for today/soon — go back to dashboard
    redirect('/dashboard')
  }

  return <ScienceLabClient lab={lab} contentItemId={null} />
}
