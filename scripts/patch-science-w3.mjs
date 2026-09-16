/**
 * patch-science-w3.mjs
 * Seeds Week 3 Science: "The Water Balloon That Won't Pop" (Heat Absorption)
 * for both G1-2 and G3-4.
 *
 * Run: node scripts/patch-science-w3.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const prepInfo = `Materials: 3–4 balloons for teacher demo, water, candle or tea light, lighter/matches (teacher only), metal tray or baking pan, bowl of water, paper towels, safety goggles for instructor.

BEFORE CLASS:
1. Fill one balloon mostly with air (comparison balloon).
2. Fill a second balloon with water — leave only a tiny air pocket. More water = better result.
3. Place candle in the centre of the metal tray.
4. Keep a bowl of water nearby to extinguish the flame if needed.
5. Have 1–2 backup water balloons ready — they occasionally burst.
6. PRACTICE at home: hold the water-filled part of the balloon directly over the flame, NOT the knot or air pocket.
7. Students stay seated at a safe distance. Only the teacher handles the flame.`

const scienceW4 = [
  // ── G1-2 Week 3: Water Balloon That Won't Pop ──────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 3,
    title: 'The Water Balloon That Won\'t Pop',
    stepCount: 6,
    metadata: {
      prepInfo,
      topics: ['Heat Absorption', 'Heat Transfer', 'Specific Heat Capacity'],
      wowFactor: 'Put a water-filled balloon directly over a flame — and instead of immediately popping, it survives!',
      steps: [
        {
          emoji: '🎈',
          title: 'What do you think will happen?',
          text: 'Teacher holds up an air-filled balloon. Ask: "What will happen if I hold this near the flame?" Most kids say it will pop — and they\'re right! Now teacher holds up a water-filled balloon. "What about this one?" Take a class vote: 👍 Thumbs UP if you think it will pop. 👎 Thumbs DOWN if you think it will NOT pop. Write your prediction: "When the balloon touches the heat, I think it will ___ because ___."',
          tip: 'There is no wrong prediction! Scientists use predictions to test what they think they know.',
        },
        {
          emoji: '💥',
          title: 'Demo Part 1 — the air balloon pops!',
          text: 'Watch! Teacher holds the air-filled balloon near the candle flame. POP! It bursts quickly. Ask: "What happened? Why did it pop?" The flame heated the rubber very fast. The rubber got weak and — POP. That makes sense!',
          tip: 'SAFETY: Only the teacher holds things near the flame. Students stay seated safely away.',
        },
        {
          emoji: '✨',
          title: 'WOW — the water balloon survives!',
          text: 'Now teacher holds the water-filled balloon over the flame. Wait for it... it does NOT pop! Watch the bottom — you might see a black soot mark, but the balloon stays whole. "Why didn\'t it pop? Where did the heat go?" The fire is still there. The balloon is still rubber. So what is different? Write or draw what you see.',
          tip: 'Look carefully at the bottom of the balloon — the flame is touching it, but the rubber is not burning through!',
        },
        {
          emoji: '💧',
          title: 'The water is a heat sponge!',
          text: 'Here is the secret: the heat from the flame travels through the rubber — and straight into the water inside. The water ABSORBS the heat (soaks it up like a sponge). This means the rubber stays much cooler than it would with just air inside. Draw this on your paper:\n🔥 FLAME → 🎈 RUBBER → 💧 WATER\nThe water keeps taking in the heat so the rubber never gets hot enough to pop!',
          tip: 'Water is amazing at absorbing heat. That is why it takes so long to boil a pot of water!',
        },
        {
          emoji: '🌍',
          title: 'Where do we use water to control heat?',
          text: 'Water absorbs heat in many places! 🚒 Firefighters spray water to absorb heat from flames. 🍲 Water in a pot absorbs heat while food cooks — that is why it takes time to boil. 🚗 Car engines use water-based coolant to carry heat away. 🥵 When you sweat, water on your skin absorbs your body heat and cools you down! Ask: "So is water only something we drink?" No — it is also a heat absorber!',
          tip: 'New words for today: HEAT ABSORPTION (soaking up heat) and HEAT TRANSFER (heat moving from one thing to another).',
        },
        {
          emoji: '✏️',
          title: 'Draw and write — show what happened',
          text: 'Draw a flame 🔥, a balloon 🎈, and water inside 💧. Then draw arrows showing: HEAT → BALLOON → WATER. Complete this sentence: "The water balloon did not pop because ___." Share your answer with the class. Scientists celebrate when they find a surprising result — that\'s how we learn!',
          tip: 'Could the water balloon EVER pop? Yes! If the flame heats a part without enough water behind it, or stays too long, it can still burst. That is why we have backup balloons!',
        },
      ],
      vocabulary: [
        { word: 'Heat Energy', definition: 'Energy that moves from something hotter to something cooler.' },
        { word: 'Heat Absorption', definition: 'When a material takes in heat energy — like a sponge soaking up water.' },
        { word: 'Heat Transfer', definition: 'The movement of heat energy from one object to another.' },
        { word: 'Temperature', definition: 'A measure of how hot or cold something is.' },
      ],
      discussionQuestions: [
        'Why did the air-filled balloon pop?',
        'Why did the water balloon NOT pop right away?',
        'Where did the heat go?',
        'Can you think of other times we use water to control heat?',
      ],
      realWorldConnections: [
        { emoji: '🚒', label: 'Firefighting', text: 'Water absorbs heat from burning materials.' },
        { emoji: '🚗', label: 'Car engines', text: 'Coolant carries heat away from hot engines.' },
        { emoji: '🍲', label: 'Cooking', text: 'Water absorbs heat while food cooks.' },
        { emoji: '🌊', label: 'Oceans', text: 'Huge amounts of water absorb heat from the Sun.' },
        { emoji: '🥵', label: 'Sweating', text: 'Water removes heat from our bodies when we sweat.' },
      ],
    },
  },

  // ── G3-4 Week 3: Water Balloon That Won't Pop ──────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 3,
    title: 'The Water Balloon That Won\'t Pop',
    stepCount: 7,
    metadata: {
      prepInfo,
      topics: ['Heat Absorption', 'Heat Transfer', 'Specific Heat Capacity'],
      wowFactor: 'Put a water-filled balloon directly over a flame — and instead of immediately popping, it survives!',
      steps: [
        {
          emoji: '🎈',
          title: 'Predict — and give your reason',
          text: 'Teacher holds an air-filled balloon. "What happens if I hold this near a flame?" Take predictions — everyone expects it to pop. Now teacher holds the water-filled balloon. "What about this one?" Before the demo, write a full prediction: "I think the water balloon will ___ because ___." Also answer: "What is different between the two balloons that might change the result?" Share with a partner.',
          tip: 'A strong prediction uses the word BECAUSE and names a scientific reason — not just a feeling.',
        },
        {
          emoji: '💥',
          title: 'Demo Part 1 — the air balloon pops',
          text: 'Watch the air balloon go near the flame. POP! Quick burst. Write your observation: "The air balloon popped because ___." The rubber absorbed heat fast, got weak, and the air pressure inside caused the burst. Now make a second prediction before Part 2: will the water balloon behave the same, differently, or somewhere in between?',
          tip: 'SAFETY: Teacher only handles the flame. Observe carefully — science is happening right in front of you.',
        },
        {
          emoji: '✨',
          title: 'WOW — the water balloon survives',
          text: 'The water balloon goes over the flame. It does NOT pop. Observe closely: you may see a black soot mark at the bottom. The flame is still burning. The rubber is still rubber. Ask: "Where is the heat going if not into the rubber?" Write: WHAT you see, and WHY you think it is happening. Teacher says: "Let\'s trace the path of the heat."',
          tip: 'Scientific observation = what you actually SEE, not what you think should happen. Keep those two things separate in your notes.',
        },
        {
          emoji: '🔬',
          title: 'Trace the heat path',
          text: 'Heat always travels from HOT → COOL. Here is the path:\n🔥 FLAME → 🎈 RUBBER → 💧 WATER\nThe flame heats the rubber. But directly behind the rubber is water. Water absorbs much of the heat energy — pulling it away from the rubber. So the rubber stays cooler than it would if air were inside. Draw this path with arrows. Label each step with the direction heat is travelling.',
          tip: 'This movement of heat from hot to cold is called HEAT TRANSFER. It always goes the same direction — hot to cool, never the other way.',
        },
        {
          emoji: '💡',
          title: 'The big idea: specific heat capacity',
          text: 'Water is unusually good at absorbing heat. Scientists measure this with specific heat capacity — how much energy is needed to raise 1 gram of a substance by 1°C. Water\'s value is very high. This means water can absorb a LOT of heat before its temperature rises much. So the heat moves into the water, the water\'s temperature rises slowly, and the rubber stays protected. Could the balloon eventually pop? Yes — if the flame heats a spot without water, or stays too long. Ask: "What would happen with only a tiny bit of water inside?"',
          tip: 'Water\'s high specific heat capacity is why oceans stabilise Earth\'s climate — they absorb enormous amounts of heat from the Sun without heating up too fast.',
        },
        {
          emoji: '🌍',
          title: 'Real-world connections — where else does this happen?',
          text: 'Find the heat-absorption principle in each of these: 🚒 Firefighters spray water — why does it work? 🚗 Car coolant systems — what problem do they solve? 🌊 Oceans absorb solar heat — how does this affect climate? 🥵 Sweating — why does it cool your body? For EACH one, write one sentence using the words: heat, absorb, transfer. Then pick the most surprising one and explain it to a partner.',
          tip: 'Challenge: why do coastal cities have milder temperatures than inland cities at the same latitude? (Hint: the ocean nearby...)',
        },
        {
          emoji: '✏️',
          title: 'Write your explanation',
          text: 'Write 2–4 sentences explaining: "Why did the air-filled balloon pop, but the water-filled balloon did not pop immediately?" You MUST use these words: heat, energy, absorb, water. Strong answers also mention: heat transfer, specific heat capacity, rubber. Then draw a force/energy diagram: flame → rubber → water, with arrows and labels showing the direction of heat flow.',
          tip: 'A good scientific explanation tells you WHAT happened, HOW it happened, and WHY using the correct vocabulary. Check your answer against all three.',
        },
      ],
      vocabulary: [
        { word: 'Heat Energy', definition: 'Energy that moves from something hotter to something cooler.' },
        { word: 'Heat Absorption', definition: 'When a material takes in heat energy.' },
        { word: 'Heat Transfer', definition: 'The movement of heat energy from one object or place to another.' },
        { word: 'Specific Heat Capacity', definition: 'How much heat energy a substance can absorb before its temperature rises significantly. Water has a very high specific heat capacity.' },
        { word: 'Temperature', definition: 'A measure of how hot or cold something is.' },
        { word: 'Thermal Energy', definition: 'The energy connected to the movement of particles and heat.' },
      ],
      discussionQuestions: [
        'Why did the air-filled balloon pop?',
        'Why didn\'t the water balloon pop immediately?',
        'Where did the heat go? Trace the full path.',
        'What does it mean to absorb heat?',
        'Why is water especially good at absorbing heat?',
        'Could the water balloon eventually pop? Under what conditions?',
        'Where do we use water to control heat in real life?',
      ],
      realWorldConnections: [
        { emoji: '🚒', label: 'Firefighting', text: 'Water absorbs heat from burning materials, lowering the temperature of the fire.' },
        { emoji: '🚗', label: 'Car engines', text: 'Water-based coolant carries heat away from hot engine parts.' },
        { emoji: '🍲', label: 'Cooking', text: 'Water absorbs heat while food cooks — that is why boiling takes time.' },
        { emoji: '🌊', label: 'Oceans & climate', text: 'Oceans absorb huge amounts of solar heat, stabilising Earth\'s temperature.' },
        { emoji: '🥵', label: 'Sweating', text: 'Sweat absorbs heat from your skin and removes it as it evaporates.' },
        { emoji: '❄️', label: 'Climate regulation', text: 'Water helps slow down temperature changes on Earth.' },
      ],
    },
  },
]

async function run() {
  for (const activity of scienceW4) {
    const [item] = await sql`
      SELECT ci.id, ci.title
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd    ON cd.id = cc.curriculum_day_id
      JOIN curriculum c          ON c.id  = cd.curriculum_id
      WHERE ci.subject    = 'science'
        AND ci.grade_band = ${activity.gradeBand}
        AND c.week_number = ${activity.weekNumber}
        AND c.grade_band  = ${activity.gradeBand}
      ORDER BY ci.created_at DESC
      LIMIT 1
    `

    if (!item) {
      console.warn(`⚠  No science content item found: ${activity.gradeBand} W${activity.weekNumber}`)
      continue
    }

    await sql`
      UPDATE content_items
      SET title      = ${activity.title},
          step_count = ${activity.stepCount},
          metadata   = ${activity.metadata}
      WHERE id = ${item.id}
    `
    console.log(`✓ ${activity.gradeBand} W${activity.weekNumber}: "${activity.title}"`)
  }

  await sql.end()
  console.log('\n✅ Done — W4 science seeded for both grade bands.')
}

run().catch(e => { console.error(e); process.exit(1) })
