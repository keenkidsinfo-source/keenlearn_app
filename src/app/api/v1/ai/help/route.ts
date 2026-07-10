import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { question, challenge, steps } = await req.json().catch(() => ({}))
  if (!question?.trim()) return new NextResponse('Missing question', { status: 400 })

  const stepList = Array.isArray(steps)
    ? steps.map((s: string, i: number) => `Step ${i + 1}: ${s.replace(/[^\x00-\x7F]/g, '').trim()}`).join('\n')
    : ''

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: `You are KeeBot, a super friendly coding helper for kids aged 6-10 who are learning Scratch!
The student is working on a project called: "${challenge ?? 'a Scratch project'}".
${stepList ? `The project steps are:\n${stepList}` : ''}

Your rules:
- Use very simple words a 6-year-old can understand — no jargon
- Keep your answer to 2-3 SHORT sentences only
- Always be encouraging, warm and positive 🌟
- Use 1-2 fun emojis
- If they ask about a step, explain it simply using colors and positions (like "the blue blocks on the left")
- If something is too tricky, tell them "Ask your teacher to help with this one!"`,
    messages: [{ role: 'user', content: question }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
