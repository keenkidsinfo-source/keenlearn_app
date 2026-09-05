// KeenKids STEAM — Science Lab session content
// Instructor Manual: August 2025 · Mattos & Sinnott Elementary

export interface VocabWord {
  word: string
  definition: string
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red'
}

export interface SessionPhase {
  time: string
  phase: string
  /** Key steps for this phase — rendered as a bullet list */
  instructions: string[]
}

export interface DiscussionQuestion {
  question: string
  answer: string
}

export interface ScienceLab {
  id: string
  date: string          // YYYY-MM-DD (Thursday)
  emoji: string
  title: string
  conceptShort: string  // 1-line for students
  wowFactor: string
  kidExplanation: string  // simple paragraph for students
  vocab: VocabWord[]
  realWorld: string[]
  // Teacher-only
  materials: string[]
  setupNotes: string[]
  sessionPlan: SessionPhase[]
  discussionQuestions: DiscussionQuestion[]
  scienceBehindIt: string
  safetyNotes: string
  referenceVideo: string
}

export const scienceLabs: ScienceLab[] = [
  {
    id: 'aug-21-fire-extinguisher',
    date: '2026-09-03',
    emoji: '🔥',
    title: 'The Invisible Fire Extinguisher',
    conceptShort: 'Chemical Reactions · Carbon Dioxide · Combustion',
    wowFactor: 'Invisible gas puts out a candle — with nothing visibly touching it!',
    kidExplanation:
      'When baking soda and vinegar mix together, they have a chemical reaction — they turn into something completely new! One of the things they make is carbon dioxide gas (CO₂) — the same gas you breathe out right now. CO₂ is heavier than air, so it sinks and sits in the bowl like an invisible liquid. When your instructor pours the bowl over the candles, the CO₂ pushes all the oxygen away from the flames. Fire needs oxygen to burn — so when the oxygen disappears, the fire goes out! This is exactly how a real fire extinguisher works.',
    vocab: [
      { word: 'Chemical Reaction', definition: 'When two things mix and turn into something brand new', color: 'orange' },
      { word: 'Carbon Dioxide (CO₂)', definition: 'An invisible gas — heavier than air and made when baking soda meets vinegar', color: 'blue' },
      { word: 'Fire Triangle', definition: 'Fire needs three things to burn: heat, fuel, and oxygen', color: 'red' },
      { word: 'Combustion', definition: 'The scientific word for burning', color: 'purple' },
      { word: 'Oxygen', definition: 'The part of air that fire needs — CO₂ pushes it away!', color: 'green' },
    ],
    realWorld: [
      '🧯 Real fire extinguishers spray CO₂ — same gas, stored under pressure',
      '🥤 The bubbles in fizzy drinks are CO₂',
      '🧊 Dry ice is frozen CO₂',
      '🚒 Firefighters wear breathing tanks because CO₂ replaces oxygen in enclosed spaces',
    ],
    materials: [
      '1 large wide bowl or container (the bigger the better)',
      '1 box baking soda (at least 4 tablespoons)',
      'White vinegar (at least 1 cup)',
      '4–6 tea light candles',
      'Long matches or a lighter',
      'Measuring spoon (tablespoon)',
      'Optional: food colouring to make the vinegar visible',
    ],
    setupNotes: [
      'Set candles in a row on a fireproof surface — tile or a baking tray',
      'Space candles 5–8cm apart so CO₂ can reach each one',
      'Keep a glass of water nearby as a safety precaution',
      'Practice the pour at home first — angle matters',
      'Do NOT do this near curtains, paper displays or anything flammable',
      'Make sure room ventilation is reasonable — CO₂ dissipates quickly but don\'t do this in a sealed tiny room',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: 'Gather & Hook',
        instructions: [
          'Seat kids in a **semicircle** around the demo table — everyone must be able to see.',
          'Show the unlit candles, bowl, baking soda, and vinegar. Do NOT explain yet.',
          'Ask: *"What do you think happens when I mix these two things?"* — take 3–4 answers.',
          'Ask: *"And what do you think this has to do with these candles?"* — let them guess freely.',
          '**Do not confirm or deny anything. Build the mystery.**',
        ],
      },
      {
        time: '5–10 min',
        phase: 'Predictions',
        instructions: [
          'Ask every kid to make a **silent prediction**: 👍 candles go out · 👎 nothing happens · ✋ not sure.',
          'Count and write the split on the whiteboard.',
          'Ask one 👍 kid and one 👎 kid to explain their reasoning.',
          'Tell everyone: *"Remember your prediction — we\'ll come back to it."*',
        ],
      },
      {
        time: '10–22 min',
        phase: 'Demo',
        instructions: [
          '**STEP 1:** Light all candles one by one. Let kids watch for 20 seconds — build anticipation.',
          '**STEP 2:** Add 4 tablespoons of baking soda to the bowl.',
          '**STEP 3:** Slowly pour 1 cup of vinegar into the bowl. It fizzes dramatically — let kids react!',
          '**STEP 4:** Wait 15 seconds for fizzing to settle. CO₂ is now filling the bowl invisibly.',
          '**STEP 5:** Very slowly tilt the bowl toward the candles and pour the invisible CO₂ over them. **Pour slowly and low — angle matters.** Candles go out one by one.',
          '**STEP 6:** If any candles remain lit, repeat with a fresh baking soda + vinegar mix.',
          '⚠️ **Do not rush this step — the slow reveal is everything.**',
        ],
      },
      {
        time: '22–32 min',
        phase: 'Discussion',
        instructions: [
          'Ask immediately: *"What just happened? What put out the candles?"* — take all answers, do not correct yet.',
          'Ask: *"What did you SEE come out of the bowl?"* (nothing — it was invisible).',
          'Guide toward: **fire needs HEAT + FUEL + OXYGEN**.',
          'Ask: *"What did the CO₂ do to the oxygen?"* (pushed it away).',
          'Ask correct predictors: *"Why did you think it would work?"*',
          'Ask wrong predictors: *"What surprised you?"*',
        ],
      },
      {
        time: '32–37 min',
        phase: 'Explain the Science',
        instructions: [
          'Say: *"Baking soda and vinegar have a **chemical reaction** — they turn into something completely new."*',
          'Ask kids to breathe out — tell them that gas is CO₂. *"It\'s the same gas you just breathed out!"*',
          'Say: *"CO₂ is heavier than air, so it sinks in the bowl like an invisible liquid. When I poured it, it pushed the oxygen away — and without oxygen, fire cannot survive."*',
          '**Write on whiteboard: FIRE = HEAT + FUEL + OXYGEN. Remove any one → fire goes out.**',
        ],
      },
      {
        time: '37–42 min',
        phase: 'Real World Connections',
        instructions: [
          'Ask: *"Where have you seen a fire extinguisher?"* (school hallway, kitchen, car).',
          'Many real extinguishers spray **CO₂** — same gas, stored under pressure.',
          '**CO₂ is also in fizzy drinks** (those bubbles = CO₂) and **dry ice** (frozen CO₂).',
          'Ask: *"Why do firefighters wear breathing tanks?"* (CO₂ replaces oxygen — dangerous in enclosed spaces).',
        ],
      },
      {
        time: '42–47 min',
        phase: 'Draw & Write',
        instructions: [
          'Each kid draws what they saw and writes **one sentence** explaining why the candles went out.',
          '**G1–2:** *"The gas pushed the oxygen away."* is perfect.',
          '**G3–4:** Challenge: write the full **fire triangle** (heat, fuel, oxygen) and identify which element CO₂ removed.',
          'Circulate and ask questions as they draw.',
        ],
      },
      {
        time: '47–50 min',
        phase: 'Share Out',
        instructions: [
          '3–4 kids share their drawing and sentence.',
          'Close with: *"Next time you see a fire extinguisher, you\'ll know exactly what\'s inside and why it works."*',
          '**Optional:** Let 2–3 kids add their own baking soda + vinegar to the bowl and watch the fizz — safe and they love it.',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'What do fires need to keep burning?', answer: 'Heat, fuel, and oxygen — the fire triangle' },
      { question: 'What did the baking soda and vinegar make when they mixed?', answer: 'CO₂ gas — a chemical reaction' },
      { question: 'Why did the CO₂ stay in the bowl instead of floating away?', answer: 'It is heavier than air' },
      { question: 'What would happen if I used a smaller bowl?', answer: 'Less CO₂ — might not reach all candles' },
      { question: 'Where else have you seen CO₂ in everyday life?', answer: 'Fizzy drinks, fire extinguishers, dry ice' },
      { question: 'Why do firefighters wear breathing tanks?', answer: 'CO₂ replaces oxygen — dangerous in enclosed spaces' },
    ],
    scienceBehindIt:
      'When baking soda (sodium bicarbonate) and vinegar (acetic acid) combine they undergo an acid-base chemical reaction. One of the products is carbon dioxide (CO₂) gas. CO₂ is approximately 1.5 times denser than air, which means it sinks and collects at the bottom of the bowl rather than floating away. When poured slowly over the candles, the CO₂ layer displaces the oxygen surrounding the flames. Fire requires three things to burn — heat, fuel and oxygen (the fire triangle). By removing oxygen, the CO₂ extinguishes the flame. This is exactly how CO₂ fire extinguishers work in real life.',
    safetyNotes:
      'Always have a glass of water nearby. Keep candles away from paper, curtains and displays. Use long matches. Never leave candles unattended. Have a responsible adult nearby at all times during the candle phase.',
    referenceVideo:
      'https://www.youtube.com/watch?v=Ten3PJDldcg',
  },

  {
    id: 'aug-28-spinning-pen',
    date: '2026-09-04',
    emoji: '🧲',
    title: 'The Spinning Magnetic Pen',
    conceptShort: 'Magnetism · Magnetic Repulsion · Invisible Forces',
    wowFactor: 'A pen spins in mid-air with nothing touching it!',
    kidExplanation:
      'Every magnet has two ends — a north pole and a south pole. When opposite poles face each other they pull together (attract). But when the SAME poles face each other, they push apart (repel)! In this demo, the magnets on the pen and the magnets on the base have the same poles facing each other — so they push apart. When the push-force (magnetic repulsion) exactly balances the pull of gravity, the pen floats in the air! Give it a spin and it keeps spinning because there\'s nothing touching it to slow it down.',
    vocab: [
      { word: 'Magnet', definition: 'An object that pushes or pulls other metals and magnets', color: 'blue' },
      { word: 'North & South Poles', definition: 'The two ends of every magnet', color: 'purple' },
      { word: 'Attract', definition: 'When opposite poles pull toward each other', color: 'green' },
      { word: 'Repel', definition: 'When same poles push each other away', color: 'orange' },
      { word: 'Gravity', definition: 'The force pulling everything downward', color: 'red' },
      { word: 'Equilibrium', definition: 'When two forces are perfectly balanced — like the floating pen!', color: 'blue' },
    ],
    realWorld: [
      '🚄 Maglev trains float above the track using magnetic repulsion — speeds over 600 km/h!',
      '🏥 MRI machines in hospitals use powerful magnets',
      '🧭 A compass always points north because Earth itself is a giant magnet',
      '🔊 Speakers use magnets to make sound',
      '💳 Credit card strips use magnetic fields to store data',
    ],
    materials: [
      '1 pencil or pen',
      '4–6 small neodymium (rare earth) ring magnets — from craft or hardware stores (~$5)',
      '1 small wooden block or thick cardboard base',
      'Tape',
      'Optional: compass to show magnetic field direction',
    ],
    setupNotes: [
      'Stack 2-3 magnets on the base — tape them down with correct pole facing UP',
      'Stack remaining magnets on the pen/pencil — correct pole facing DOWN (same pole as base so they repel)',
      'Test at home: pen should float and spin above base when poles align',
      'Buy neodymium ring magnets not regular fridge magnets — much stronger, far more dramatic effect',
      'If the pen sticks instead of floats, flip one magnet — pole alignment is everything',
      'Keep extra magnets in case some kids want to try it themselves at the end',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: 'Gather & Hook',
        instructions: [
          'Seat kids in a **close semicircle** — they need to see the floating pen clearly.',
          'Hold up two magnets and stick them together. Ask: *"What is this force called?"* (magnetism).',
          'Ask: *"Has anyone felt two magnets push each other away?"* — let kids share.',
          'Say: *"Today I\'m going to make this pen float in mid-air using nothing but magnets — and you\'re going to tell me why it works."*',
        ],
      },
      {
        time: '5–10 min',
        phase: 'Predictions',
        instructions: [
          'Ask: *"Do you think I can make this pen float without touching it?"* 👍 / 👎 / ✋',
          'Count and record the split on the whiteboard.',
          'Ask one kid: *"If magnets can push each other away — how could that make something float?"* Let them reason it out.',
          '**Do not confirm or deny. Tell them to hold that thought.**',
        ],
      },
      {
        time: '10–22 min',
        phase: 'Demo',
        instructions: [
          '**STEP 1:** Show the base with magnets taped to it. Let 2 kids touch the magnets — feel the force.',
          '**STEP 2:** Show the pen with magnets attached. Slowly lower it toward the base — feel the tension build.',
          '**STEP 3:** Release the pen above the base — it floats and wobbles. Give it a gentle spin — it rotates freely.',
          '**STEP 4:** Invite a kid to try pushing it down — it pushes back.',
          '**STEP 5:** Invite another kid to spin it.',
          '**STEP 6 (key teaching moment):** Ask *"What if I flip one magnet?"* — flip it. Pen now **sticks** instead of floats. Flip back — floats again. **Pole alignment is everything.**',
        ],
      },
      {
        time: '22–32 min',
        phase: 'Discussion',
        instructions: [
          'Ask: *"What is stopping the pen from falling?"* (magnetic force pushing up).',
          'Ask: *"Can you see that force?"* (no — invisible). *"So how do we know it\'s there?"* (feel it, see its effect).',
          '**G3–4:** *"If both magnets push each other away, what does that tell you about the poles?"* (same poles facing — N↑N or S↑S).',
          '**G1–2:** *"What word do we use when magnets push each other away?"* (repel).',
          'Ask everyone: *"Where else could magnetic repulsion be useful in real life?"*',
        ],
      },
      {
        time: '32–37 min',
        phase: 'Explain the Science',
        instructions: [
          'Say: *"Every magnet has a north pole and a south pole. Opposite poles attract — pull together. Same poles repel — push apart."*',
          'Say: *"Our pen has the same pole facing down as the base facing up — so they push apart with enough force to hold the pen against gravity."*',
          '**Write on board: SAME POLES REPEL · OPPOSITE POLES ATTRACT**',
          'Ask: *"What other force is the magnetic repulsion fighting?"* (gravity — pen wants to fall, magnets push back up).',
        ],
      },
      {
        time: '37–42 min',
        phase: 'Real World Connections',
        instructions: [
          'Guide toward: **maglev trains** (float above track using magnetic repulsion — no friction → incredible speed).',
          '**MRI machines** in hospitals use powerful magnets.',
          '**Compasses** always point north because Earth itself is a giant magnet.',
          '**Speakers, motors, credit card strips** all use magnetic fields.',
          '**G3–4:** *"If a maglev train floats like our pen, what advantage does that give?"* (no friction = faster, quieter, less wear).',
          'If you have a compass, show it live — always points north.',
        ],
      },
      {
        time: '42–47 min',
        phase: 'Draw & Write',
        instructions: [
          'Each kid draws the floating pen setup and labels the forces.',
          '**G1–2:** Label arrows with words: *push up* / *pull down*.',
          '**G3–4:** Label with: **MAGNETIC REPULSION**, **GRAVITY**, **NORTH POLE**, **SOUTH POLE**.',
          'Circulate and ask: *"Which force is winning — magnetism or gravity? How do you know?"* (balanced — that\'s why it floats, not shoots up or falls down).',
        ],
      },
      {
        time: '47–50 min',
        phase: 'Share Out',
        instructions: [
          '3–4 kids share their diagram.',
          'Close with: *"Next time you see a maglev train, hospital MRI, or compass — you\'ll know the same invisible force is at work."*',
          '**Optional:** Let kids take turns floating and spinning the pen themselves.',
          '⚠️ **Supervise closely** — neodymium magnets can pinch fingers if two snap together suddenly.',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'What are the two poles of a magnet called?', answer: 'North and south' },
      { question: 'What happens when same poles face each other?', answer: 'They repel — push apart' },
      { question: 'What happens when opposite poles face each other?', answer: 'They attract — pull together' },
      { question: 'What two forces are balanced when the pen floats?', answer: 'Magnetic repulsion pushing up, gravity pulling down' },
      { question: 'What would happen if the magnets were much weaker?', answer: 'Pen would fall — gravity would win' },
      { question: 'Where do we see magnetic repulsion used in real life?', answer: 'Maglev trains, magnetic bearings, speakers' },
      { question: 'Can you see the magnetic force? How do we know it is there?', answer: 'Invisible — we detect it by its effects (feeling the push, seeing the pen float)' },
    ],
    scienceBehindIt:
      'Magnets have two poles — north and south. The fundamental rule of magnetism is: opposite poles attract, same poles repel. In this demo, the magnets on the pen and the base are oriented so that the same poles face each other, creating a repulsive force. When the repulsive force exactly balances the downward pull of gravity, the pen floats in a state of equilibrium. The spin helps stabilise the pen (gyroscopic effect) and reduces wobble. This principle is used in maglev (magnetic levitation) trains, where powerful electromagnets create enough repulsive force to lift the entire train off the track, eliminating friction and allowing speeds of over 600km/h.',
    safetyNotes:
      'Neodymium magnets are very strong. Keep them away from phones, credit cards and electronic devices. Do not let small kids put them near their mouths. If two magnets snap together they can pinch fingers — supervise closely when kids handle them.',
    referenceVideo:
      'https://www.youtube.com/watch?v=QeYaoI8t1ws',
  },
]

/**
 * General instructor tips that apply to every Science Lab session.
 * Source: KeenKids Science Lab Instructor Manual — August 2025
 */
export const scienceLabGeneralTips: string[] = [
  'Always practice the demo at home the day before. What looks easy on video can go wrong in front of 13 kids.',
  'Never tell kids what will happen before the demo. The prediction phase is what makes the reveal powerful.',
  'Wrong predictions are gold — when kids are surprised, that is when learning sticks. Celebrate being wrong.',
  'Ask questions during the demo, not just after. "What do you think will happen next?" keeps everyone engaged.',
  'Let kids touch, feel and handle materials where safe — the magnetic pen especially benefits from kids feeling the repulsion force themselves.',
  'Draw & Write time is not optional — it forces kids to consolidate what they saw into their own words and images.',
  'G1–2 and G3–4 sitting together is intentional — older kids reinforce learning by explaining to younger ones.',
  'If a demo fails — do not panic. Ask kids: "What went wrong? How would we fix it?" That is real science.',
]

/**
 * Dashboard card: only show a lab during its week or up to 3 days before.
 * Returns null at all other times so the card doesn't appear permanently.
 */
export function getLabForDashboard(): ScienceLab | null {
  const now  = new Date()
  const today = now.toISOString().slice(0, 10)
  const pad  = (n: number) => String(n).padStart(2, '0')

  // Current week Mon–Fri
  const dow  = now.getDay()
  const mon  = new Date(now)
  mon.setDate(now.getDate() + (dow === 0 ? -6 : 1 - dow))
  const fri  = new Date(mon)
  fri.setDate(mon.getDate() + 4)
  const monStr = `${mon.getFullYear()}-${pad(mon.getMonth() + 1)}-${pad(mon.getDate())}`
  const friStr = `${fri.getFullYear()}-${pad(fri.getMonth() + 1)}-${pad(fri.getDate())}`

  // 3 days from now
  const soon = new Date(now)
  soon.setDate(now.getDate() + 3)
  const soonStr = `${soon.getFullYear()}-${pad(soon.getMonth() + 1)}-${pad(soon.getDate())}`

  return scienceLabs.find(l =>
    (l.date >= monStr && l.date <= friStr) ||   // this week
    (l.date > today && l.date <= soonStr)        // coming up within 3 days
  ) ?? null
}

/** Returns the most recent past lab (used on the /science/lab student page) */
export function getCurrentLab(): ScienceLab | null {
  const today = new Date().toISOString().slice(0, 10)
  const past  = scienceLabs.filter(l => l.date <= today)
  if (past.length === 0) return scienceLabs[0] ?? null
  return past[past.length - 1]
}

/** Returns the next upcoming lab (date > today) */
export function getUpcomingLab(): ScienceLab | null {
  const today = new Date().toISOString().slice(0, 10)
  return scienceLabs.find(l => l.date > today) ?? null
}
