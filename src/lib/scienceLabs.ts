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
    id: 'sep-18-water-balloon',
    date: '2026-09-18',
    weekNumber: 3,
    emoji: '🎈',
    title: 'The Water Balloon That Won\'t Pop',
    conceptShort: 'Heat Absorption · Heat Transfer · Specific Heat Capacity',
    wowFactor: 'Put a water-filled balloon directly over a flame — and instead of immediately popping, it survives!',
    kidExplanation:
      'Fire gives off heat energy. When we put an air-filled balloon near the fire, the thin rubber gets hot very quickly and POP — the balloon bursts! But when the balloon is filled with water, the water acts like a giant heat sponge. The heat travels through the rubber and into the water. The water absorbs lots of the heat, so the rubber doesn\'t get hot enough to pop right away. The water inside helps protect the balloon from the fire!',
    vocab: [
      { word: 'Heat Energy', definition: 'Energy that moves from something hotter to something cooler', color: 'red' },
      { word: 'Heat Absorption', definition: 'When a material soaks up heat energy — like a sponge with water', color: 'orange' },
      { word: 'Heat Transfer', definition: 'Heat moving from one object to another — always from hot to cold', color: 'blue' },
      { word: 'Specific Heat Capacity', definition: 'Water can absorb a huge amount of heat before its temperature rises — much more than rubber or air', color: 'purple' },
      { word: 'Temperature', definition: 'A measure of how hot or cold something is', color: 'green' },
    ],
    realWorld: [
      '🚒 Firefighters spray water because water absorbs heat from burning materials',
      '🚗 Car engines use water-based coolant to carry heat away from hot engine parts',
      '🍲 Water absorbs heat while food cooks — that\'s why boiling a pot takes time',
      '🌊 Oceans absorb enormous amounts of heat from the Sun, stabilising Earth\'s climate',
      '🥵 Sweat cools your body because water absorbs heat from your skin as it evaporates',
    ],
    materials: [
      'Balloons — at least 3–4 for the teacher demo',
      'Water',
      'A candle or tea light',
      'Lighter or matches (teacher use only)',
      'Metal tray or baking pan',
      'A bowl or jug of water (to extinguish flame if needed)',
      'Paper towels',
      'Safety goggles for the instructor',
      'Optional: one air-filled balloon for comparison',
      '1–2 backup water balloons per class in case of popping',
    ],
    setupNotes: [
      '**Fill one balloon with water — leave only a tiny air pocket. More water = better result.**',
      'Fill a second balloon with air only (the comparison balloon that will pop dramatically).',
      'Place the candle or tea light in the centre of a metal tray.',
      'Keep a bowl of water nearby to extinguish the flame if needed.',
      'Have 1–2 backup water balloons ready — they occasionally burst.',
      '**PRACTICE at home:** Hold the water-filled part directly over the flame, NOT the knot or air pocket.',
      'Students stay seated at a safe distance. Only the teacher handles the flame.',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: 'Hook & Predictions',
        instructions: [
          'Gather students in a semicircle around the demo table.',
          'Hold up the air-filled balloon. Ask: *"What will happen if I hold this near the flame?"* — let them predict. Most say it will pop.',
          'Now hold up the water-filled balloon. Ask: *"What about this one?"*',
          'Vote: 👍 Thumbs UP if the water balloon will pop. 👎 Thumbs DOWN if it will NOT pop. **Count and write the split on the board — do not reveal the answer.**',
          'Students write: *"When the balloon touches the heat, I think it will ___ because ___."*',
        ],
      },
      {
        time: '5–12 min',
        phase: 'Predictions — deeper',
        instructions: [
          'Ask: *"What is different between the two balloons?"* Guide toward: one has air, one has water.',
          'Ask: *"Could the water change what happens?"* Don\'t confirm. Build suspense.',
          '**G3–4:** Also ask: *"Where do you think the heat will go when it hits the rubber?"*',
        ],
      },
      {
        time: '12–22 min',
        phase: 'Demo',
        instructions: [
          '**STEP 1 — Air balloon:** Hold the air-filled balloon near the flame. POP! It bursts quickly. Ask: *"What happened? Why did it pop?"* (Flame heated rubber → rubber got weak → burst).',
          '**STEP 2 — Water balloon:** Hold up the water-filled balloon. Ask one more time: *"Do you think this one will do the same?"* Then slowly hold the water-filled part over the flame. **It does NOT pop. Let the moment land.**',
          '**STEP 3 — Observe closely:** Ask kids to look at the bottom — they may see a black soot mark. Ask: *"The fire is touching the balloon. Where is the heat going?"*',
          '**STEP 4 — Compare:** Write on board: 🔥→🎈 Air balloon: rubber heats fast → POP. 🔥→💧 Water balloon: heat goes into water → rubber stays cool.',
          '⚠️ **Safety:** Students stay seated. Only teacher handles the flame.',
        ],
      },
      {
        time: '22–35 min',
        phase: 'Discussion & Challenges',
        instructions: [
          '**Challenge 1 — Observe:** "I noticed that ___" — kids share observations (air balloon popped immediately, water balloon survived, soot mark on bottom).',
          '**Challenge 2 — Predict:** "What would happen if there were only a tiny amount of water inside the balloon?" (It might pop faster — less water to absorb heat).',
          '**Challenge 3 — More vs Less:** Show two choices: Balloon A (lots of water) vs Balloon B (tiny bit of water). "Which absorbs more heat?" Guide toward: more water = more absorption.',
          '**G3–4:** Write on board: FLAME → RUBBER → WATER. Ask: "Why doesn\'t all the heat stay in the rubber?" (Water absorbs much of it).',
        ],
      },
      {
        time: '35–43 min',
        phase: 'Explain the Science',
        instructions: [
          'Ask: *"Were your predictions correct?"* Celebrate both right and wrong — *"Scientists make predictions and sometimes discover their original idea was wrong. That\'s how science works!"*',
          'Write on board: 🔥 HEAT → 💧 WATER. Then: **WATER ABSORBS HEAT.**',
          'Explain: *"Water can absorb a lot of heat before its temperature rises much. The water keeps taking in the heat, so the rubber never gets hot enough to pop right away."*',
          '**G3–4:** Introduce "specific heat capacity" — the scientific name for how much heat a material absorbs before its temperature changes. Water\'s value is very high.',
        ],
      },
      {
        time: '43–48 min',
        phase: 'Real World Connections',
        instructions: [
          'Ask: *"Where else do we use water to control heat?"*',
          '🚒 Firefighters spray water — it absorbs heat from flames.',
          '🍲 Water in a pot absorbs heat while food cooks.',
          '🚗 Car engines use water-based coolant to carry heat away.',
          '🥵 Sweat — water on skin absorbs your body heat and evaporates.',
          'Ask: *"So is water only something we drink?"* — No! It also moves and absorbs heat.',
        ],
      },
      {
        time: '48–50 min',
        phase: 'Draw & Write / Share Out',
        instructions: [
          'Kids draw: 🔥 flame, 🎈 balloon, 💧 water inside. Add arrows: HEAT → BALLOON → WATER.',
          '**G1–2:** Complete the sentence: *"The water balloon did not pop because ___."* Circle: 🔥 Heat · 💧 Water · 🎈 Balloon.',
          '**G3–4:** Write 2–4 sentences explaining why the air balloon popped but the water balloon did not. Use: heat, energy, absorb, water.',
          '2–3 students share. Close: *"The fire was trying to heat the balloon, but the water inside acted like a heat sponge. Today, water helped a balloon survive fire!"*',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'Why did the air-filled balloon pop?', answer: 'The flame heated the rubber very quickly — with only air inside, nothing absorbed the heat, so the rubber weakened and burst.' },
      { question: 'Why didn\'t the water balloon pop immediately?', answer: 'The water absorbed much of the heat energy and kept the rubber cooler.' },
      { question: 'Where did the heat go?', answer: 'From the flame → through the balloon rubber → into the water.' },
      { question: 'What does it mean to absorb heat?', answer: 'To take in heat energy — like a sponge soaking up water.' },
      { question: 'Why is water especially good at absorbing heat?', answer: 'Water has a high specific heat capacity — it can absorb a large amount of heat energy before its temperature rises much.' },
      { question: 'Could the water balloon eventually pop?', answer: 'Yes — if the flame heats a part without enough water behind it, or stays too long, the rubber can still burst.' },
      { question: 'Where do we use water to control heat in real life?', answer: 'Car engines (coolant), firefighting, cooking, sweating, oceans stabilising climate.' },
    ],
    scienceBehindIt:
      'A balloon is made from thin rubber or latex. When an air-filled balloon is placed near a flame, the rubber absorbs heat rapidly. The rubber becomes weaker as its temperature rises, and the air pressure inside helps cause it to burst. A water-filled balloon behaves differently: when the flame heats the rubber, much of that thermal energy transfers into the water touching the inside. Water has a high specific heat capacity (~4,186 J/kg·°C), meaning it can absorb a large amount of heat energy without its temperature increasing quickly. Because the water continuously absorbs heat from the rubber, the rubber stays much cooler than it would in an air-filled balloon, allowing it to survive over the flame for much longer. Eventually, if the flame heats a part of the balloon not backed by water, the balloon may still burst.',
    safetyNotes:
      '🔥 Teacher demonstration only — students must not hold balloons over an open flame. Keep all flammable materials away from the candle. Place the candle inside a tray. Keep water nearby to extinguish the flame. Students stay a safe distance from the demo table. Wear safety goggles. Never leave the flame unattended. Extinguish immediately after the experiment.',
    referenceVideo: '',
  },

  {
    id: 'sep-25-food-detective',
    date: '2026-09-25',
    weekNumber: 4,
    emoji: '🕵️',
    title: 'The Food Detective Experiment',
    conceptShort: 'Food Science · Dissolving · Mixtures · Observation',
    wowFactor: 'Students become food detectives and compare cookie cream with real dairy cream to see how differently they behave in water!',
    kidExplanation:
      'Different foods are made from different ingredients. When we put them into water, they can behave differently. Some things mix easily, while others stay in lumps, float, or separate. Today, we are food detectives — using our eyes and observations to look for clues about how cookie cream and dairy cream are different!',
    vocab: [
      { word: 'Observation', definition: 'Something we notice using our senses or tools', color: 'blue' },
      { word: 'Dissolve', definition: 'When a substance mixes evenly into a liquid', color: 'green' },
      { word: 'Mixture', definition: 'Two or more substances combined together', color: 'orange' },
      { word: 'Separate', definition: 'When parts of a mixture move apart instead of staying evenly mixed', color: 'purple' },
      { word: 'Fair Test', definition: 'An experiment where we keep important things the same so we can compare results', color: 'red' },
      { word: 'Evidence', definition: 'Information or observations that help us answer a question', color: 'blue' },
    ],
    realWorld: [
      '🥗 Salad dressing — oil and water separate because fats don\'t mix with water',
      '🥛 Chocolate milk — we stir ingredients together to make a mixture',
      '🧈 Butter — contains a lot of fat and behaves differently from water',
      '🧃 Drink powders — some dissolve in water while others don\'t',
      '🧪 Food scientists test foods to understand their ingredients and properties',
    ],
    materials: [
      'Cream-filled cookies or biscuits',
      'Real dairy cream',
      '2 clear transparent cups per group',
      'Water',
      'Measuring tablespoon',
      'Spoon or small scraper',
      'Stirring sticks or spoons',
      'Labels or masking tape + marker',
      'Timer',
      'Observation worksheet or paper',
    ],
    setupNotes: [
      'Separate the cream from several cookies before class — collect 2 tablespoons.',
      'Measure 2 tablespoons of real dairy cream separately.',
      'Prepare two clear cups labelled: CUP A — COOKIE CREAM · CUP B — DAIRY CREAM.',
      'Add the same amount of water to each cup.',
      '⚠️ Check for food allergies before conducting the experiment.',
      'Keep samples hidden or covered before the prediction stage for more mystery.',
      'Dairy cream should not sit unrefrigerated for long — prepare close to class time.',
      'Have students wash hands after handling food materials.',
      'Dispose of all mixtures after the activity — do not allow eating after mixing.',
    ],
    sessionPlan: [
      {
        time: '0–5 min',
        phase: '🕵️ Hook & Mystery Question',
        instructions: [
          'Hold up a cream-filled cookie. Ask: "What do you think this white cream is made of?" (Students may say: milk, cream, sugar, butter, dairy.)',
          'Ask: "Do you think the cream inside this cookie is the same as real dairy cream?"',
          'Do NOT answer yet. Say: "Today, you are going to become FOOD DETECTIVES!"',
          '"Scientists don\'t just guess — they compare, observe, and collect evidence."',
        ],
      },
      {
        time: '5–10 min',
        phase: '🔮 Predictions',
        instructions: [
          'Show both samples: 🍪 Cookie cream and 🥛 Real dairy cream.',
          'Ask: "If we put both into water, will they behave the same way?"',
          'Students write: "I think the cookie cream and dairy cream will __________ because __________."',
          'Class vote: 👍 Same behaviour / 👎 Different behaviour. Ask 2–3 to explain.',
        ],
      },
      {
        time: '10–20 min',
        phase: '🧪 The Experiment',
        instructions: [
          'CUP A — COOKIE CREAM: Measure 2 tbsp cookie cream into Cup A. Add your chosen equal amount of water. Observe BEFORE stirring: colour, texture, thickness, float/sink.',
          'CUP B — DAIRY CREAM: Measure exactly the same amount of dairy cream into Cup B. Add exactly the same amount of water. Ask: "Does this look the same before stirring?"',
          'STIR: Start timer. Stir both cups for the same 10–20 seconds at similar speed. Ask: "What is happening?"',
          'STOP stirring. Wait and watch — what happens when you stop?',
        ],
      },
      {
        time: '20–32 min',
        phase: '🔍 Detective Observations',
        instructions: [
          'Students compare both cups using an observation chart: colour, mixed easily?, lumps?, separation?, float or sink?, what happened after stirring?',
          'Challenge 1 — Which mixed faster?',
          'Challenge 2 — Look for lumps: "Do you see any pieces left behind?"',
          'Challenge 3 — Wait and watch: observe separation, floating, or settling.',
          'Challenge 4 — The verdict: "Based on evidence, do you think these two creams behave the same way?"',
          'Remind: "One experiment gives us CLUES. Scientists usually need more than one test to prove something."',
        ],
      },
      {
        time: '32–40 min',
        phase: '💡 Explain the Science',
        instructions: [
          'Ask: "Why might these two creams behave differently in water?"',
          '🥛 Dairy cream contains water, fat, and proteins from milk.',
          '🍪 Cookie filling is usually a manufactured mixture — often sugar, vegetable fats/oils, and flavourings.',
          'When put into water, foods may: dissolve, form a mixture, separate, float, sink, or form lumps.',
          'Many fats and oils do NOT mix easily with water — this is why we see differences.',
          'This experiment gives us CLUES, but to know exactly what\'s inside, scientists need additional tests.',
        ],
      },
      {
        time: '40–45 min',
        phase: '🌍 Real-World Connections',
        instructions: [
          'Ask: "Where else do we see things that don\'t mix?"',
          '🥗 Salad dressing — oil and water separate. 🥛 Chocolate milk — stir to mix. 🧈 Butter — lots of fat.',
          '🧃 Some drink powders dissolve; others don\'t. 🧪 Food scientists test foods professionally.',
        ],
      },
      {
        time: '45–50 min',
        phase: '✏️ Draw & Write / Share Out',
        instructions: [
          'Students draw: 🟦 Cup A (Cookie Cream + Water) and 🟩 Cup B (Dairy Cream + Water) — what they actually observed.',
          'G1–2: Complete "The two creams were __________." and "I noticed that __________."',
          'G3–4: Write "My evidence shows that the cookie cream and dairy cream behaved differently because __________."',
          'Encourage use of: observe, mix, dissolve, separate, evidence.',
          'Close: "Today you became food detectives! You tested, compared, and collected evidence — that\'s exactly what scientists do!"',
        ],
      },
    ],
    discussionQuestions: [
      { question: 'Did both creams behave the same way in water?', answer: 'Students answer based on their own observations.' },
      { question: 'Why did we use the same amount of water in both cups?', answer: 'To make it a fair test — so the only difference is the type of cream.' },
      { question: 'Why did we use the same amount of cream?', answer: 'So we could compare the two samples fairly.' },
      { question: 'Why did we stir both cups for the same amount of time?', answer: 'To keep the experiment fair — same stirring, same conditions.' },
      { question: 'Can one experiment tell us everything about what a food contains?', answer: 'No. Scientists often need multiple tests and evidence to draw conclusions.' },
    ],
    scienceBehindIt:
      'Foods are made from different ingredients that interact with water in different ways. Real dairy cream contains water, fat, and proteins — some of which can mix with water. Cookie filling typically contains sugar, vegetable oils or fats, and flavourings. Many fats and oils are hydrophobic (they repel water), which is why they may form lumps, float, or separate rather than dissolving evenly. Observing how a substance behaves in water gives us clues about its composition — a key technique in food science.',
    safetyNotes:
      '⚠️ Check for food allergies before conducting this experiment. Do NOT allow students to eat samples after mixing with water. Use clean utensils when preparing dairy cream. Dairy cream should not sit unrefrigerated for long. Dispose of all mixtures after the activity. Students should wash hands after handling food materials.',
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
