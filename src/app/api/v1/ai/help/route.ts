export const dynamic = 'force-dynamic'

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { question, challenge, steps, currentStep, projectSnapshot, history } = await req.json().catch(() => ({}))
    if (!question?.trim()) return NextResponse.json({ error: 'Missing question' }, { status: 400 })

    const stepList = Array.isArray(steps)
      ? steps.map((s: string, i: number) => `Step ${i + 1}: ${s.replace(/[^\x00-\x7F]/g, '').trim()}`).join('\n')
      : ''
    const currentStepText = Array.isArray(steps) && typeof currentStep === 'number'
      ? `The student is currently on Step ${currentStep + 1}: "${steps[currentStep]?.replace(/[^\x00-\x7F]/g, '').trim()}"`
      : ''

    // Build a human-readable project summary from the snapshot
    let projectContext = ''
    if (projectSnapshot) {
      try {
        const targets = JSON.parse(projectSnapshot) as Array<{
          name: string; isStage: boolean; costumes: string[]; blockCategories: string[]; blockCount: number
        }>
        const lines = targets.map(t => {
          const type = t.isStage ? 'Stage' : `Sprite "${t.name}"`
          const cats = t.blockCategories.length ? t.blockCategories.join(', ') : 'no blocks yet'
          const costumes = t.costumes.length ? t.costumes.join(', ') : 'none'
          return `  - ${type}: ${t.blockCount} blocks (${cats}) | costumes: ${costumes}`
        })
        projectContext = `\nWhat the student has built so far:\n${lines.join('\n')}`
      } catch { /* ignore parse errors */ }
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `You are KeeBot, a super friendly coding helper for kids aged 6-10 who are learning Scratch!
The student is working on a project called: "${challenge ?? 'a Scratch project'}".
${currentStepText ? `${currentStepText}\n` : ''}${stepList ? `All project steps:\n${stepList}` : ''}${projectContext}

Scratch block color guide (use this when explaining HOW to do something):
- YELLOW Events blocks: "when green flag clicked", "when this sprite clicked", "when key pressed"
- BLUE Motion blocks: move, turn, go to x/y, glide, point in direction
- PURPLE Looks blocks: say, think, show, hide, switch costume, change size, set color effect
- ORANGE Control blocks: wait, repeat, forever, if-then, if-then-else, stop
- RED Sound blocks: play sound, set volume
- GREEN Sensing blocks: touching?, ask and wait, mouse x/y
- GREY Operators: math (+, -, *, /), comparisons, and/or
- DARK ORANGE Variables: set variable, change variable

When explaining HOW to do a Scratch action:
1. Name the block COLOR first ("Find the yellow Events blocks...")
2. Name the exact block ("...and look for 'when green flag clicked'")
3. Say where to drag it ("Drag it into the big scripts area in the middle")

When the student asks about their project, use the "What the student has built" info to give specific advice.

Your rules:
- Use very simple words a 6-year-old can understand
- Give enough detail that the student can actually follow your instructions
- Always be encouraging and positive
- Use 1-2 fun emojis
- If something is too tricky, say "Ask your teacher to help with this one!"`,
      messages: [
        ...(Array.isArray(history) ? history : []),
        { role: 'user', content: question },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : 'Ask your teacher for help! 🙂'
    return NextResponse.json({ text })

  } catch (err: any) {
    console.error('[KeeBot] error:', err?.message ?? err)
    return NextResponse.json({ error: err?.message ?? 'Something went wrong' }, { status: 500 })
  }
}
