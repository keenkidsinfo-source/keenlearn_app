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
  instructions: string
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
    date: '2025-08-21',
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
        instructions: 'Gather all kids in a semicircle around your demo table. Show the unlit candles, the bowl, the baking soda and vinegar. Ask: "What do you think happens when I mix these two things?" Take 3-4 answers. Then ask: "And what do you think has to do with these candles?" Let them guess freely — do not confirm or deny anything yet. Build the mystery.',
      },
      {
        time: '5–10 min',
        phase: 'Predictions',
        instructions: 'Ask every kid to make a silent prediction — thumbs up if they think the candles will go out, thumbs down if they think nothing will happen, sideways if they\'re not sure. Count and note the split on the whiteboard. Ask one "thumbs up" kid and one "thumbs down" kid to explain their prediction. Tell them: "Remember your prediction — we will come back to it."',
      },
      {
        time: '10–22 min',
        phase: 'Demo',
        instructions: 'STEP 1: Light all candles one by one. Let kids watch them burn for 20 seconds — build the anticipation. STEP 2: Add 4 tablespoons of baking soda to the bowl. STEP 3: Slowly pour 1 cup of vinegar into the bowl. It fizzes dramatically — let kids react. STEP 4: Wait 15 seconds for the fizzing to settle — CO₂ is now filling the bowl invisibly. STEP 5: Very slowly tilt the bowl toward the candles and pour the invisible CO₂ over them. Angle matters — pour slowly and low. Candles go out one by one. STEP 6: If any candles remain lit, repeat with another baking soda + vinegar mix. Do not rush this step — the slow reveal is everything.',
      },
      {
        time: '22–32 min',
        phase: 'Discussion',
        instructions: 'Ask immediately: "What just happened? What put out the candles?" Take all answers — do not correct yet. Then ask: "What did you SEE come out of the bowl?" (nothing — it was invisible). "So what do fires need to keep burning?" Guide toward: heat, fuel, and OXYGEN. "What did the CO₂ do to the oxygen?" It pushed it away. Ask the kids who predicted correctly: "Why did you think it would work?" Ask kids who predicted wrong: "What surprised you?"',
      },
      {
        time: '32–37 min',
        phase: 'Explain the Science',
        instructions: 'Say: "When baking soda and vinegar mix, they have a chemical reaction — that means they combine and turn into something completely new. One of the things they make is carbon dioxide gas — the same gas you breathe out right now." Ask kids to breathe out — tell them that gas is CO₂. "CO₂ is heavier than air so it sinks and sits in the bowl like an invisible liquid. When I poured it out, it pushed the oxygen away from the candle flames — and without oxygen, fire cannot survive." Write on whiteboard: FIRE needs HEAT + FUEL + OXYGEN. Remove any one of these and fire goes out.',
      },
      {
        time: '37–42 min',
        phase: 'Real World Connections',
        instructions: 'Ask: "Where have you seen a fire extinguisher in real life?" (school hallway, kitchen, car). "What do you think is inside it?" Many real fire extinguishers spray CO₂ — same gas, just stored under pressure. Also: CO₂ is used in fizzy drinks (the bubbles in soda are CO₂). And dry ice is frozen CO₂. Ask: "Can you think of any reason CO₂ might be dangerous in large amounts?" (it replaces oxygen — that is why firefighters wear breathing tanks).',
      },
      {
        time: '42–47 min',
        phase: 'Draw & Write',
        instructions: 'Each kid draws what they saw and writes one sentence explaining why the candles went out. G1-2: one sentence is fine — "The gas pushed the oxygen away." G3-4: challenge them to write the full fire triangle — heat, fuel, oxygen — and explain which one CO₂ removed. Circulate and ask questions as they draw.',
      },
      {
        time: '47–50 min',
        phase: 'Share Out',
        instructions: '3-4 kids share their drawing and sentence. End with: "Next time you see a fire extinguisher, you will know exactly what is inside it and why it works." Optional: if time allows and you have materials, let 2-3 kids add their own baking soda and vinegar to the bowl and watch the fizz — safe, supervised, and they love it.',
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
      'Search "baking soda vinegar fire extinguisher candle science experiment" on YouTube. Your saved video (Video 8) shows the exact technique. Watch it at least twice before class.',
  },

  {
    id: 'aug-28-spinning-pen',
    date: '2025-08-28',
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
        instructions: 'Gather all kids in a close semicircle — this demo works best when kids are close enough to see the pen floating. Hold up two magnets and stick them together. Ask: "What is this force called?" (magnetism). "What do magnets do to each other?" (attract or repel). "Has anyone ever felt two magnets push each other away?" Let kids share. Then say: "Today I am going to make this pen float in mid-air using nothing but magnets — and you are going to tell me why it works."',
      },
      {
        time: '5–10 min',
        phase: 'Predictions',
        instructions: 'Ask: "Do you think I can make this pen float without touching it?" Thumbs up / down / sideways. Count and record on whiteboard. Ask one kid: "If magnets can push each other away — how could that make something float?" Let them reason it out. Do not confirm or deny. Tell them to hold that thought.',
      },
      {
        time: '10–22 min',
        phase: 'Demo',
        instructions: 'STEP 1: Show the base with magnets taped to it. Let 2 kids touch the magnets — feel the force. STEP 2: Show the pen with magnets attached. Slowly lower it toward the base — kids will feel the tension as you get close. STEP 3: Release the pen above the base — it floats and wobbles. Give it a gentle spin — it rotates freely. STEP 4: Invite a kid to try pushing it down — it pushes back. STEP 5: Invite another kid to try spinning it. STEP 6: Ask: "What would happen if I flipped one of the magnets over?" Flip the base magnet — pen now sticks instead of floats. Flip it back — floats again. This flip is the key teaching moment — pole alignment is everything.',
      },
      {
        time: '22–32 min',
        phase: 'Discussion',
        instructions: 'Ask: "What is stopping the pen from falling?" (the magnetic force pushing up). "Can you see that force?" (no — it is invisible). "So how do we know it is there?" (we can feel it, we can see its effect). Ask G3-4: "If both magnets are pushing each other away, what does that tell you about which poles are facing each other?" (same poles — north to north or south to south). Ask G1-2: "What word do we use when magnets push each other away?" (repel). Ask everyone: "Where else do you think magnetic repulsion might be useful in real life?"',
      },
      {
        time: '32–37 min',
        phase: 'Explain the Science',
        instructions: 'Say: "Every magnet has two ends — a north pole and a south pole. Opposite poles attract each other — they pull together. Same poles repel each other — they push apart. Our pen has the same pole facing down as the base magnet facing up. So they push away from each other with enough force to hold the pen in the air against gravity." Write on board: SAME POLES REPEL. OPPOSITE POLES ATTRACT. Ask: "What other force is the magnetic repulsion fighting against?" (gravity — the pen wants to fall but the magnets push back up).',
      },
      {
        time: '37–42 min',
        phase: 'Real World Connections',
        instructions: 'Ask: "Where do we use magnetism in real life?" Guide toward: maglev trains (they float above the track using magnetic repulsion — no friction, so they go incredibly fast), MRI machines in hospitals, credit card strips, speakers, electric motors, compasses. If you have a compass, show how it always points north — the Earth itself is a giant magnet. Ask G3-4: "If a maglev train floats above the track like our pen, what advantage does that give it?" (no friction = faster speeds, quieter, less wear).',
      },
      {
        time: '42–47 min',
        phase: 'Draw & Write',
        instructions: 'Each kid draws the floating pen setup and labels: magnet on base, magnet on pen, repulsion force arrows pushing up, gravity arrow pulling down. G1-2: label the arrows with words (push up / pull down). G3-4: label with: MAGNETIC REPULSION, GRAVITY, NORTH POLE, SOUTH POLE. Circulate and ask: "Which force is winning — magnetism or gravity? How do you know?" (they are balanced — that is why it floats and does not shoot up or fall down).',
      },
      {
        time: '47–50 min',
        phase: 'Share Out',
        instructions: '3-4 kids share their diagram. End with: "Next time you see a maglev train video, or go through a hospital MRI, or use a compass — you will know the same invisible force is at work." If time allows: let kids take turns floating and spinning the pen themselves. Supervise closely — neodymium magnets are strong and can pinch fingers if two snap together suddenly.',
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
      'Watch your saved video (Video 10) before class. The key technique is aligning the magnet poles correctly — if the pen sticks instead of floats, you have the poles the wrong way. Flip one magnet. Practice at home until you can make it float and spin reliably before class.',
  },
]

/** Returns the lab for a given date string (YYYY-MM-DD), or the upcoming one */
export function getCurrentLab(): ScienceLab | null {
  const today = new Date().toISOString().slice(0, 10)
  // Show today's lab, or the most recent past lab (so students can revisit)
  const past = scienceLabs.filter(l => l.date <= today)
  if (past.length === 0) return scienceLabs[0] ?? null
  return past[past.length - 1]
}

/** Returns the next upcoming lab (date > today) */
export function getUpcomingLab(): ScienceLab | null {
  const today = new Date().toISOString().slice(0, 10)
  return scienceLabs.find(l => l.date > today) ?? null
}
