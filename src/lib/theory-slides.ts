// KeenKids STEAM — Build Day Theory Slides
// Shown by the teacher BEFORE starting the build activity.
// One set per grade band. Content is rendered inline (no SVG files needed).

export interface TheorySlide {
  emoji: string
  title: string
  /** Headline concept in one punchy sentence */
  headline: string
  /** 3–5 bullet points explaining the concept */
  bullets: string[]
  /** Colour theme for this slide */
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red'
  /** Optional vocab word to highlight */
  vocab?: { word: string; definition: string }
  /** Optional "Try this" prompt for the class */
  tryThis?: string
}

export interface TheoryDeck {
  gradeBand: 'g1-2' | 'g3-4'
  title: string
  subject: string
  slides: TheorySlide[]
}

// ── G1-2 · Cable Car · Pulleys + Gravity + Friction ─────────────────────────

const cableCarDeck: TheoryDeck = {
  gradeBand: 'g1-2',
  title: 'Cable Car Theory',
  subject: 'Simple Machines: Pulleys',
  slides: [
    {
      emoji: '⚙️',
      color: 'orange',
      title: 'Simple Machines',
      headline: '6 tools that make work easier — no engine needed, just physics!',
      bullets: [
        '**Lever · Wheel & Axle · Pulley · Inclined Plane · Wedge · Screw**',
        'Today we use a **PULLEY** ⭐ — a wheel with a rope that redirects force.',
        'Simple machines don\'t need batteries or engines — just YOU!',
      ],
      vocab: { word: 'Simple Machine', definition: 'A tool that makes it easier to move or lift things' },
      tryThis: 'Can you spot any of the 6 machines in this room right now?',
    },
    {
      emoji: '🔄',
      color: 'blue',
      title: 'What is a Pulley?',
      headline: 'A wheel + rope that lets you move things in a new direction.',
      bullets: [
        'Pull DOWN on the rope → the load goes **UP** on the other side.',
        'Our **straw** is the pulley — it rolls smoothly along the zip line.',
        'Real pulleys: flagpoles · cranes · elevators · ski lifts.',
      ],
      vocab: { word: 'Pulley', definition: 'A wheel + rope that redirects force' },
      tryThis: 'Look for the flagpole outside — it uses a pulley to raise the flag!',
    },
    {
      emoji: '🌍',
      color: 'green',
      title: 'Gravity',
      headline: 'Gravity pulls everything toward Earth — it\'s our cable car\'s engine!',
      bullets: [
        'Gravity pulls DOWN on everything — your cup, your cargo, even you.',
        'On the zip line slope, gravity pulls the car **down** toward the end.',
        'Fun fact: the cup always hangs **straight down** even on a diagonal line!',
      ],
      vocab: { word: 'Gravity', definition: 'The invisible force that pulls everything toward Earth' },
      tryThis: 'Drop a pencil — which direction? Gravity ALWAYS goes the same way.',
    },
    {
      emoji: '🛑',
      color: 'red',
      title: 'Friction',
      headline: 'Friction slows the car down — too much and it stops before the end!',
      bullets: [
        'Friction = two surfaces rubbing together and slowing each other down.',
        '**More cargo** = more weight = **more friction** between straw and string.',
        'Smooth straw + smooth string = **less friction** = more cargo carried!',
      ],
      vocab: { word: 'Friction', definition: 'A force that slows things down when surfaces rub' },
      tryThis: 'Rub your hands together fast — feel the heat? That\'s friction!',
    },
    {
      emoji: '🚡',
      color: 'purple',
      title: 'The Big Picture',
      headline: 'Gravity vs. Friction — your experiment finds the balance point.',
      bullets: [
        '**Gravity** pulls the car down the line — it\'s your engine.',
        '**Friction** between straw and string slows it — it\'s your enemy.',
        'Challenge: how many paperclips can you carry before friction wins? **Predict it now!**',
      ],
      tryThis: 'Write down your prediction before you build. Compare at the end!',
    },
  ],
}

// ── G3-4 · Well Pulley · Wheel & Axle + Mechanical Advantage ─────────────────

const wellPulleyDeck: TheoryDeck = {
  gradeBand: 'g3-4',
  title: 'Well Pulley Theory',
  subject: 'Simple Machines: Wheel & Axle',
  slides: [
    {
      emoji: '⚙️',
      color: 'orange',
      title: '6 Simple Machines',
      headline: 'Simple machines multiply your force — less effort, more result.',
      bullets: [
        'There are exactly **6 types**: Lever · Wheel & Axle · Pulley · Inclined Plane · Wedge · Screw.',
        'Every complex machine — cars, cranes, bikes — is built from these 6.',
        'Today\'s machine: **WHEEL & AXLE** ⭐',
      ],
      vocab: { word: 'Simple Machine', definition: 'A device that multiplies or redirects force with no engine' },
      tryThis: 'Look around the room right now — can you spot any of the 6?',
    },
    {
      emoji: '🔩',
      color: 'blue',
      title: 'Wheel & Axle',
      headline: 'Big wheel attached to a small rod. Turn the wheel → the axle turns with more force.',
      bullets: [
        '**Wheel** = the large outer part (your crank handle).',
        '**Axle** = the small center rod (your skewer).',
        'Big wheel + small axle = **less effort needed** to lift a heavy load.',
      ],
      vocab: { word: 'Axle', definition: 'The small central rod that turns when the wheel turns' },
      tryThis: 'Tighten a screw with just your fingers, then with a screwdriver — which is easier? Why?',
    },
    {
      emoji: '🎡',
      color: 'green',
      title: 'Your Crank & Skewer',
      headline: 'The cardstock strip IS your crank. The skewer is just the axle.',
      bullets: [
        '**Wooden skewer** = the AXLE. It spins in the popsicle stick holes and winds the string.',
        '**Cardstock strip** (2 cm × 15 cm) taped to one end = the CRANK HANDLE. Pinch the far end and sweep it in a circle.',
        'Each full circle of the cardstock strip = **1 crank**. Count them!',
      ],
      vocab: { word: 'Axle', definition: 'The rod that spins — string wraps around it to lift the bucket' },
      tryThis: 'Predict: how many full circles of the cardstock handle to lift the bucket from bottom to top?',
    },
    {
      emoji: '🔢',
      color: 'purple',
      title: 'Count Your Cranks!',
      headline: '1 crank = 1 full turn of the cardstock handle.',
      bullets: [
        '**Round 1 — empty bucket:** count cranks from bottom to top. Write it down.',
        '**Round 2 — 3 pennies:** count again. Takes more cranks because the load is heavier.',
        '**Round 3 — tape a LONGER cardstock strip:** recount. Fewer cranks = your machine improved!',
      ],
      vocab: { word: 'Crank', definition: 'One full turn of your cardstock handle — your measuring unit today!' },
      tryThis: 'The skewer (axle) stays the same. Only the cardstock strip length changes. Longer strip = bigger "wheel" = fewer cranks!',
    },
    {
      emoji: '🌍',
      color: 'red',
      title: 'Real-World Wheel & Axle',
      headline: 'You just built what humans have used for thousands of years.',
      bullets: [
        '🎣 **Fishing reel** · 🚗 **Steering wheel** · ⛏️ **Winch** · 🔩 **Screwdriver**',
        'Traditional **water wells** use this exact mechanism — crank → axle → rope → bucket.',
        'Key words: **WHEEL · AXLE · CRANK · MECHANICAL ADVANTAGE · ROTATION**',
      ],
      tryThis: 'Before tomorrow: find 3 wheel & axle machines at home. Can you name which part is the wheel and which is the axle?',
    },
  ],
}

export const theoryDecks: TheoryDeck[] = [cableCarDeck, wellPulleyDeck]

export function getTheoryDeck(gradeBand: string): TheoryDeck | null {
  return theoryDecks.find(d => d.gradeBand === gradeBand) ?? null
}

export const SLIDE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; headlineBg: string }> = {
  orange: { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-500', headlineBg: 'bg-orange-100' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-900',   badge: 'bg-blue-600',  headlineBg: 'bg-blue-100'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-900',  badge: 'bg-green-600', headlineBg: 'bg-green-100'  },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600', headlineBg: 'bg-purple-100' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-900',    badge: 'bg-red-600',   headlineBg: 'bg-red-100'    },
}
