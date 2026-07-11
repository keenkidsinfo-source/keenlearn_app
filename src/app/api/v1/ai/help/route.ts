import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { question, challenge, steps, currentStep } = await req.json().catch(() => ({}))
    if (!question?.trim()) return NextResponse.json({ error: 'Missing question' }, { status: 400 })

    const stepList = Array.isArray(steps)
      ? steps.map((s: string, i: number) => `Step ${i + 1}: ${s.replace(/[^\x00-\x7F]/g, '').trim()}`).join('\n')
      : ''
    const currentStepText = Array.isArray(steps) && typeof currentStep === 'number'
      ? `The student is currently on Step ${currentStep + 1}: "${steps[currentStep]?.replace(/[^\x00-\x7F]/g, '').trim()}"`
      : ''

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are KeeBot, a super friendly coding helper for kids aged 6-10 who are learning Scratch!
The student is working on a project called: "${challenge ?? 'a Scratch project'}".
${currentStepText ? `${currentStepText}\n` : ''}${stepList ? `All project steps:\n${stepList}` : ''}

Your rules:
- Use very simple words a 6-year-old can understand — no jargon
- Keep your answer to 2-3 SHORT sentences only
- Always be encouraging, warm and positive
- Use 1-2 fun emojis
- If they ask about a step, explain it simply using colors and positions (like "the blue blocks on the left")
- If something is too tricky, tell them "Ask your teacher to help with this one!"`,
      messages: [{ role: 'user', content: question }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : 'Ask your teacher for help! 🙂'
    return NextResponse.json({ text })

  } catch (err: any) {
    console.error('[KeeBot] error:', err?.message ?? err)
    return NextResponse.json({ error: err?.message ?? 'Something went wrong' }, { status: 500 })
  }
}
