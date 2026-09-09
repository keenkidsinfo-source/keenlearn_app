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
  weekNumber?: number   // 1-based school week number
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
    weekNumber: 1,
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
    id: 'sep-10-water-bottle',
    date: '2026-09-10',
    weekNumber: 2,
    emoji: '🙃',
    title: 'The Upside-Down Water Bottle',
    conceptShort: 'Air Pressure · Surface Tension · Buoyancy',
    wowFactor: 'A bottle full of water stays full when flipped upside down — and a toothpick floats UP toward the bottom!',
    kidExplanation:
      'Air pushes on everything around us from every direction, all the time — even though we can\'t see it. Water molecules at the surface cling together and form a stretchy invisible skin called surface tension. When we flip a bottle full of water upside down with mesh over the mouth, the air outside pushes UP against the mesh and the surface tension seals the tiny holes — together they hold all the water inside against gravity! And because wood is lighter than water, a toothpick always floats toward the top of the bottle — which is now the bottom!',
    vocab: [
      { word: 'Air Pressure', definition: 'The invisible push of air in all directions', color: 'blue' },
      { word: 'Surface Tension', definition: 'The stretchy skin water forms at its surface', color: 'green' },
      { word: 'Buoyancy', definition: 'The upward push of water on objects inside it', color: 'orange' },
      { word: 'Dense / Less Dense', definition: 'How heavy something is for its size — wood is less dense than water so it floats', color: 'purple' },
      { word: 'Gravity', definition: 'The force pulling everything downward', color: 'red' },
    ],
    realWorld: [
      '🥤 Drinking straws: you remove air from the straw, outside pressure pushes the drink up',
      '🪟 Suction cups: no air inside = pressure holds them to the wall',
      '🦟 Water strider bugs walk on water using the surface tension skin',
      '⛵ Boats and fish stay up because of buoyancy — water pushes them upward',
      '🌊 Raindrops are round because surface tension pulls them into a ball',
    ],
    materials: [
      '1 glass bottle (teacher demo only)',
      '1 plastic bottle per student pair (ideally 500 ml)',
      'Window screen mesh — cut into squares large enough to cover the bottle mouth',
      'Rubber bands (to secure mesh)',
      'Wooden toothpicks — at least 10 per pair',
      'Trays or baking pans (one per pair — to catch water)',
      'Jug of water to refill bottles',
    ],
    setupNotes: [
      '**Fill ALL bottles completely to the brim before class — zero air gap inside.** Any air bubble will cause the water to fall immediately.',
      'Stretch mesh over each bottle mouth and secure tightly with a rubber band.',
      'Practice the flip at home: palm flat over mesh → flip bottle fast → slowly remove palm. Do it 5 times until it feels natural.',
      'Set up a refill station so pairs can top up their bottles between tries.',
      'Have towels or paper towels handy — there WILL be spills.',
      'Do the demo over a tray so water lands safely.',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: 'Hook & Setup Description',
        instructions: [
          'Gather kids in a close semicircle around the demo table.',
          'Hold up the filled bottle with mesh over the top. Ask: *"What is inside this bottle?"* (water, completely full).',
          'Show the mesh: *"I\'ve stretched this screen over the top. What do you think will happen when I flip it upside down?"*',
          'Say: *"But first — make your prediction. Thumbs UP if you think the water falls out. Thumbs DOWN if you think it stays in."*',
          'Count the split. **Do not confirm or deny.**',
        ],
      },
      {
        time: '5–12 min',
        phase: 'Predictions',
        instructions: [
          'Give kids 2 minutes to write their prediction: *"When the teacher flips it, the water will ___ because ___."*',
          'Ask 2–3 kids to share their reason. Accept all answers without confirming.',
          'Second prediction: *"If I push a wooden toothpick through the mesh into the upside-down bottle — which way will it float? UP toward the bottle bottom, or DOWN toward the mouth?"*',
          'Kids write their second prediction. **Hold that thought.**',
        ],
      },
      {
        time: '12–22 min',
        phase: 'Demo',
        instructions: [
          '**STEP 1 — Flip it:** Palm flat over mesh, count 3-2-1, flip the bottle. Slowly remove palm. THE WATER STAYS IN.',
          '**STEP 2 — Toothpick:** While upside down, push a toothpick through the mesh. It floats UP toward the bottle bottom. Ask: *"Why is the toothpick going UP?"* (wood is lighter than water — always floats toward the top, which is now the bottom).',
          '**STEP 3 — Tilt it:** Slowly tilt the bottle sideways. The water immediately falls out. Ask: *"What changed?"* (air got in — once air enters, the pressure is gone and gravity wins).',
          '**STEP 4 — Push it down:** Hold bottle upside down and let a kid try to push it down into a bowl of water — feels the upward push (buoyancy).',
          'Refill and repeat Step 1 so all kids see it clearly.',
        ],
      },
      {
        time: '22–35 min',
        phase: 'Partner Exploration',
        instructions: [
          'Pairs get their bottle (filled to brim), mesh, rubber band, and toothpicks.',
          '**Challenge 1:** Both partners flip and hold the water in.',
          '**Challenge 2:** Push toothpicks in one at a time — count how many before it leaks. Compare counts with the next pair.',
          '**Challenge 3:** Very slowly tilt the bottle — at what point does it leak? Try to find the tipping angle.',
          '**Challenge 4 (G3–4):** Let in one tiny bubble of air with a finger. What happens instantly?',
          'Circulate and ask: *"Why do you think more toothpicks made it leak?"*',
        ],
      },
      {
        time: '35–43 min',
        phase: 'Discussion & Explain the Science',
        instructions: [
          'Come back together. Ask: *"Were you right about the water?"* Kids check predictions.',
          'Ask: *"Why did the water stay in?"* — guide toward: **air outside pushes UP** + **surface tension seals the mesh holes**.',
          'Ask: *"Why did tilting break it?"* — **air snuck in** — once air enters, the upward push is gone.',
          'Ask: *"Why did the toothpick go UP?"* — **wood is less dense than water** — it always floats toward the water\'s top surface.',
          '**Write on board: AIR PRESSURE · SURFACE TENSION · BUOYANCY**',
          '**G3–4:** *"When you let one air bubble in, what happened?"* — immediately fell — shows air pressure was the key.',
        ],
      },
      {
        time: '43–48 min',
        phase: 'Real World Connections',
        instructions: [
          'Guide toward straws: *"When you drink through a straw, you suck air OUT — what happens?"* (outside pressure pushes drink in).',
          'Suction cups: *"Why do suction cups stick?"* (no air inside = pressure difference holds them).',
          'Surface tension bugs: water striders walk on the "skin" of water.',
          'Buoyancy: boats, fish, submarines all use the upward push of water.',
          '**G3–4:** *"What would happen if the mesh holes were bigger?"* (surface tension can\'t seal them — water falls).',
        ],
      },
      {
        time: '48–50 min',
        phase: 'Draw & Write / Share Out',
        instructions: [
          'Kids draw the upside-down bottle with arrows showing: AIR pushing UP from outside, GRAVITY pulling water DOWN, SURFACE TENSION sealing mesh.',
          '**G1–2:** Circle the force that wins (they balance!) and fill in: "The water stayed in because ___."',
          '**G3–4:** Explain all three phenomena in writing.',
          '2–3 kids share. Close with: *"Two invisible forces — air pressure and surface tension — just defied gravity together. You\'ll see them everywhere now."*',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'Why did the water stay in when the bottle was flipped?', answer: 'Air pressure pushes up from outside + surface tension seals the mesh holes' },
      { question: 'What happened the moment the bottle was tilted?', answer: 'Air got in and the water immediately fell — air pressure was lost' },
      { question: 'Why did the toothpick float UP toward the bottle bottom?', answer: 'Wood is less dense than water so it floats — the top of the water is now at the bottom' },
      { question: 'What is surface tension?', answer: 'A stretchy invisible skin that water molecules form at the surface' },
      { question: 'What is air pressure?', answer: 'The invisible push of air in all directions — from above, below, and all sides' },
      { question: 'Where else do we see air pressure at work?', answer: 'Straws, suction cups, vacuum cleaners, blood pressure' },
    ],
    scienceBehindIt:
      'Atmospheric air pressure (~101 kPa at sea level) acts on all surfaces equally from every direction. When the bottle is inverted over a mesh screen with no air gap inside, the upward atmospheric pressure on the outside of the mesh equals or exceeds the downward pressure of the water column. Simultaneously, surface tension at the water-mesh interface forms a meniscus in each tiny mesh hole, sealing them against air entry. The result: the water is supported by the net upward force of atmospheric pressure against the surface tension membrane. When the bottle is tilted, air enters at the rim, breaking the seal — atmospheric pressure on the water\'s new top surface pushes it down, and the water falls. The toothpick floats upward because wood (density ~0.5–0.8 g/cm³) is less dense than water (1.0 g/cm³) — buoyancy always pushes it toward the top of the water body, which is now the inverted bottom of the bottle.',
    safetyNotes:
      'Use a tray under all bottle experiments to catch spills. The glass bottle is for teacher demo only — give students plastic bottles. Keep towels nearby. This experiment is water only — no risk beyond wet floors.',
    referenceVideo: '',
  },

  {
    id: 'sep-17-magnetic-pen',
    date: '2026-09-17',
    weekNumber: 3,
    emoji: '🧲',
    title: 'Spinning Magnetic Pen',
    conceptShort: 'Magnetism · Repulsion · Equilibrium',
    wowFactor: 'A pen floats in mid-air and keeps spinning — held up entirely by invisible magnetic force!',
    kidExplanation:
      'Every magnet has two ends called poles — a North pole and a South pole. Here\'s the rule: SAME poles push each other away (repel), and OPPOSITE poles pull each other together (attract). In today\'s demo, the magnets on the pen and on the base have the SAME pole facing each other — so they push apart. When the push-up force of the magnets exactly balances the pull-down force of gravity, the pen floats in mid-air! Give it a spin and it keeps spinning because there\'s nothing touching it to slow it down.',
    vocab: [
      { word: 'Magnetism', definition: 'An invisible force that makes magnets attract or repel each other', color: 'blue' },
      { word: 'Repulsion', definition: 'When same poles push each other away', color: 'red' },
      { word: 'Attraction', definition: 'When opposite poles pull toward each other', color: 'green' },
      { word: 'Equilibrium', definition: 'When two forces are exactly balanced — the pen floats because the push up equals the pull down', color: 'orange' },
      { word: 'Gravity', definition: 'The force pulling everything downward toward Earth', color: 'purple' },
    ],
    realWorld: [
      '🚄 Maglev trains float above the track using magnetic repulsion — no friction means 600+ km/h!',
      '🧭 Compass needles are tiny magnets that align with Earth\'s magnetic field',
      '🔊 Speakers use magnets to create sound vibrations',
      '🏥 MRI machines use powerful electromagnets to take pictures inside your body',
      '💳 Credit cards have a magnetic strip storing data',
    ],
    materials: [
      '1 magnetic levitation pen kit (pen with ring magnets + base with ring magnets)',
      'Optional: extra ring magnets to show attract vs repel',
      'Small piece of paper for each student (to draw force diagrams)',
    ],
    setupNotes: [
      'Practice the demo before class — finding the sweet spot where the pen floats takes a little feel for it.',
      'The pen must be aligned so the SAME poles face each other (N up on base, N down on pen, or S/S).',
      'Once floating, a gentle spin makes it dramatic — it keeps spinning for a long time.',
      'Let kids push the pen down and feel the invisible force pushing back up — that moment is always memorable.',
      'Keep extra magnets handy to demonstrate attract vs repel before the floating demo.',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: 'Hook — feel the force',
        instructions: [
          'Give each kid two magnets. Ask them to stick them together — that\'s ATTRACT.',
          'Now flip one magnet around. They push apart — that\'s REPEL.',
          'Ask: *"Can you feel the invisible force? What do you think would happen if the repel force was strong enough to fight gravity?"*',
          '**Build mystery: show the pen and base without explaining. "Today we use this force to do something impossible."**',
        ],
      },
      {
        time: '5–10 min',
        phase: 'Predictions',
        instructions: [
          'Ask every kid to write: *"I predict the pen will ___ because ___."*',
          'Thumbs UP if you think it floats. DOWN if you think gravity always wins.',
          'Count the split. **Do not confirm either way.**',
          '**G3–4:** Also ask: *"What force equation would need to be true for the pen to float?"* (Hint: F_up = F_down)',
        ],
      },
      {
        time: '10–20 min',
        phase: 'Demo',
        instructions: [
          '**STEP 1:** Slowly lower the pen toward the base. Kids watch — notice when it starts to resist.',
          '**STEP 2:** Release the pen — it floats! Let the moment land. Give it a gentle spin.',
          '**STEP 3:** Invite a kid to push the pen DOWN. They feel it push back harder the closer it gets.',
          '**STEP 4:** Show attract: flip the pen — it immediately snaps down to the base. *"Same poles repel. Opposite poles attract."*',
          '**STEP 5:** Flip back to repel and float it again.',
        ],
      },
      {
        time: '20–32 min',
        phase: 'Discussion & Science',
        instructions: [
          'Ask: *"Which poles must be facing each other — same or opposite?"* (Same — they repel).',
          '*"What two forces are acting on the pen right now?"* (Magnetic repulsion up, gravity down).',
          '*"When it\'s floating — which force is bigger?"* (Neither — they\'re EQUAL. That\'s equilibrium).',
          '**Write on board: SAME POLES REPEL · EQUILIBRIUM = forces balanced**',
          '**G3–4:** *"Why does the pen stay upright instead of tipping sideways?"* (Gyroscopic effect from spinning)',
        ],
      },
      {
        time: '32–40 min',
        phase: 'Real World — Maglev',
        instructions: [
          'Ask: *"If magnets can float a pen, what else could they float?"*',
          'Introduce MAGLEV trains: same principle, massive electromagnets, 600+ km/h.',
          '*"Why do maglev trains need computers but the pen doesn\'t?"* (Pen sits in a magnetic bowl — stable. Train on a flat track can drift sideways — needs correction).',
          '**G3–4:** Discuss why maglev trains are more common in Asia than the US or Europe (cost, infrastructure).',
        ],
      },
      {
        time: '40–48 min',
        phase: 'Draw & Write',
        instructions: [
          'Kids draw the floating pen and base.',
          'Add TWO arrows: one pointing UP (magnetic repulsion), one pointing DOWN (gravity).',
          'Label both arrows. Write one sentence: *"The pen floats because ___."*',
          '**G3–4:** Draw the N/S poles on both magnets and explain in writing why same poles repel.',
          '3–4 kids share their drawings. Close: *"This invisible force holds a 40-tonne train in the air. You just felt it with your own hands."*',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'What rule do magnets follow?', answer: 'Same poles repel (push apart). Opposite poles attract (pull together).' },
      { question: 'What two forces act on the floating pen?', answer: 'Magnetic repulsion pushing up, and gravity pulling down' },
      { question: 'What does equilibrium mean?', answer: 'The two forces are exactly equal — so the pen doesn\'t move' },
      { question: 'Why does the pen keep spinning?', answer: 'Nothing is touching it to slow it down — no friction' },
      { question: 'How do maglev trains use this same idea?', answer: 'Powerful electromagnets push the train up off the track — no friction means very high speeds' },
      { question: 'What happened when you flipped the pen to attract instead of repel?', answer: 'It snapped down to the base — opposite poles pull toward each other' },
    ],
    scienceBehindIt:
      'Magnetic repulsion occurs when two magnets are oriented with the same poles facing each other (N–N or S–S). The repulsive force follows an inverse-square-like relationship with distance: as the magnets get closer, the force increases rapidly. The floating pen reaches equilibrium when the upward magnetic repulsion exactly equals the downward gravitational force (F_magnetic = mg). The ring magnet geometry creates a magnetic "bowl" — if the pen drifts sideways, the field geometry pushes it back to centre, providing passive lateral stability. Spinning the pen adds gyroscopic stability, keeping it upright rather than tumbling. Maglev trains use the same principle with powerful electromagnets, but require active computer control because the flat track geometry offers no passive lateral stability.',
    safetyNotes:
      'Keep ring magnets away from credit cards, phones and pacemakers. Do not let students snap magnets together hard — they can pinch fingers or chip. Supervise closely when students handle extra magnets.',
    referenceVideo: '',
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

/** Look up a lab by school week number (preferred over date-based lookup) */
export function getLabByWeek(weekNumber: number): ScienceLab | null {
  return scienceLabs.find(l => l.weekNumber === weekNumber) ?? null
}

/** Returns the lab for this week (Mon–Fri), or the most recent past lab */
export function getCurrentLab(): ScienceLab | null {
  const now  = new Date()
  const pad  = (n: number) => String(n).padStart(2, '0')
  const dow  = now.getDay()
  const mon  = new Date(now)
  mon.setDate(now.getDate() + (dow === 0 ? -6 : 1 - dow))
  const fri  = new Date(mon)
  fri.setDate(mon.getDate() + 4)
  const monStr = `${mon.getFullYear()}-${pad(mon.getMonth() + 1)}-${pad(mon.getDate())}`
  const friStr = `${fri.getFullYear()}-${pad(fri.getMonth() + 1)}-${pad(fri.getDate())}`

  // This week's lab first
  const thisWeek = scienceLabs.find(l => l.date >= monStr && l.date <= friStr)
  if (thisWeek) return thisWeek

  // Fall back to most recent past lab
  const today = now.toISOString().slice(0, 10)
  const past  = scienceLabs.filter(l => l.date <= today)
  if (past.length === 0) return scienceLabs[0] ?? null
  return past[past.length - 1]
}

/** Returns the next upcoming lab (date > today) */
export function getUpcomingLab(): ScienceLab | null {
  const today = new Date().toISOString().slice(0, 10)
  return scienceLabs.find(l => l.date > today) ?? null
}
