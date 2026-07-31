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
      title: 'What is a Simple Machine?',
      headline: 'Simple machines help us do work with LESS effort.',
      bullets: [
        'A machine is any tool that makes work easier.',
        'There are 6 simple machines: Lever, Wheel & Axle, Pulley, Inclined Plane, Wedge, and Screw.',
        'Simple machines don\'t need an engine — just you and physics!',
        'Today we\'re using a **PULLEY** to build a cable car.',
      ],
      vocab: { word: 'Simple Machine', definition: 'A tool that makes it easier to move things' },
      tryThis: 'Name one machine you use at home. Is it on the list of 6?',
    },
    {
      emoji: '🔄',
      color: 'blue',
      title: 'What is a Pulley?',
      headline: 'A pulley is a wheel with a rope — it changes the direction of a force.',
      bullets: [
        'A pulley has a **wheel** with a groove, and a **rope or string** running through it.',
        'Pulling DOWN on one side of the rope lifts a load UP on the other side.',
        'Our straw IS the pulley — it rolls along the zip line string.',
        'Pulleys are used in flagpoles, cranes, elevators, and ski lifts!',
      ],
      vocab: { word: 'Pulley', definition: 'A wheel + rope that redirects or reduces force' },
      tryThis: 'Look for pulleys in this room. Hint: think about blinds or the flagpole outside.',
    },
    {
      emoji: '🌍',
      color: 'green',
      title: 'What is Gravity?',
      headline: 'Gravity is the invisible force that pulls everything toward Earth.',
      bullets: [
        'Gravity pulls **everything** downward — your cup, your cargo, even you!',
        'On a slope (like our zip line), gravity pulls objects **down the slope**.',
        'The **heavier** the cargo, the **stronger** gravity pulls it.',
        'Fun fact: your cup will always hang **straight down** even on a diagonal zip line!',
      ],
      vocab: { word: 'Gravity', definition: 'The force that pulls everything toward Earth' },
      tryThis: 'Drop a pencil. Which direction did gravity pull it? Always the same direction!',
    },
    {
      emoji: '🛑',
      color: 'red',
      title: 'What is Friction?',
      headline: 'Friction slows things down when two surfaces rub together.',
      bullets: [
        'Friction happens when two surfaces **rub against each other**.',
        'Our straw rubs against the zip line string — that\'s friction slowing the car down.',
        '**More cargo** = more weight pressing down = **more friction**.',
        'If friction wins over gravity → the cable car **stops before the end**!',
        '**Smooth straw + smooth string = less friction = more cargo!**',
      ],
      vocab: { word: 'Friction', definition: 'A force that resists motion when surfaces rub together' },
      tryThis: 'Rub your hands together fast. Feel the heat? That\'s friction making energy!',
    },
    {
      emoji: '🚡',
      color: 'purple',
      title: 'The Science of Our Cable Car',
      headline: 'Gravity and friction compete — the winner decides how much cargo we can carry.',
      bullets: [
        '**Gravity** pulls the car DOWN the zip line — it\'s our engine!',
        '**Friction** between the straw and string slows the car — it\'s our enemy!',
        'Our straw (the pulley) lets the cup roll smoothly instead of dragging.',
        '**Challenge:** find the perfect cargo weight where gravity beats friction all the way to the end.',
        'Key words today: **PULLEY · GRAVITY · FRICTION · LOAD**',
      ],
      tryThis: 'Before you build: predict how many paperclips your cable car can carry. Write it down!',
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
      headline: 'Simple machines multiply your force — do more work with less effort.',
      bullets: [
        'The 6 simple machines: **Lever, Wheel & Axle, Pulley, Inclined Plane, Wedge, Screw**.',
        'Every complex machine (car engine, bicycle, crane) is built from combinations of these 6.',
        'Simple machines trade **distance** for **force** — or force for distance.',
        'Today\'s machine: **WHEEL & AXLE** — used in wells, cranes, and fishing reels.',
      ],
      vocab: { word: 'Mechanical Advantage', definition: 'Using a machine to multiply your force' },
      tryThis: 'Look around the room. Can you spot any of the 6 simple machines hidden in everyday objects?',
    },
    {
      emoji: '🔩',
      color: 'blue',
      title: 'What is a Wheel & Axle?',
      headline: 'A large wheel attached to a small rod (axle) — turning one turns the other.',
      bullets: [
        'The **wheel** is the large outer circle (or crank handle).',
        'The **axle** is the small rod at the center that the wheel is attached to.',
        'When you turn the wheel, the axle turns too — at a **different speed and force**.',
        'A large wheel + small axle = **less force needed** to turn the axle.',
        'Examples: **steering wheel, doorknob, screwdriver, fishing reel, winch**.',
      ],
      vocab: { word: 'Axle', definition: 'The central rod that rotates when the wheel turns' },
      tryThis: 'Try tightening a screw with your fingers vs. a screwdriver. The screwdriver is a wheel & axle!',
    },
    {
      emoji: '🎡',
      color: 'green',
      title: 'How Your Crank Works',
      headline: 'The crank IS the wheel. The skewer IS the axle. Turning one turns the other.',
      bullets: [
        'Your **cardstock crank handle** = the wheel (large, easy to turn).',
        'Your **wooden skewer** = the axle (small, winds the string).',
        'Every turn of the crank **winds the string** around the skewer → bucket rises.',
        'More crank length = **more string wound per turn** = fewer cranks to lift the bucket.',
        'The string acts as the connection between the axle and the load (bucket).',
      ],
      vocab: { word: 'Rotation', definition: 'Spinning around a central point' },
      tryThis: 'Imagine the crank handle is 3× longer. Would you need more cranks or fewer to lift the bucket?',
    },
    {
      emoji: '💪',
      color: 'purple',
      title: 'Mechanical Advantage',
      headline: 'A bigger wheel = less effort needed to turn the axle = greater mechanical advantage.',
      bullets: [
        '**Mechanical Advantage (MA)** = how much a machine multiplies your force.',
        'Formula: **MA = crank radius ÷ axle radius**.',
        'If your crank is 5cm from center and the skewer is 0.5cm radius → **MA = 10×**!',
        'This means you apply 10× less force than the weight you\'re lifting.',
        '**Trade-off:** higher MA → fewer cranks needed but more distance your hand travels.',
      ],
      vocab: { word: 'Mechanical Advantage', definition: 'The force multiplication factor of a machine (output ÷ input)' },
      tryThis: 'If MA = 10 and the bucket weighs 100g, how much force do you actually need to lift it? (Answer: 10g!)',
    },
    {
      emoji: '🌍',
      color: 'red',
      title: 'Real-World Examples',
      headline: 'Wheel & axle machines are everywhere — once you know what to look for.',
      bullets: [
        '🎣 **Fishing reel** — crank (wheel) winds the fishing line (axle) to reel in the fish.',
        '🚗 **Car steering wheel** — a tiny hand movement on the big wheel turns the small axle for a big wheel-turn.',
        '⛽ **Traditional water well** — exactly what you\'re building! Crank → axle → rope → bucket.',
        '🔩 **Screwdriver** — the wide handle is the wheel; the thin shaft is the axle.',
        '🏗️ **Crane winch** — lifts tons of steel using a wheel & axle with massive mechanical advantage.',
        'Key words today: **WHEEL · AXLE · CRANK · MECHANICAL ADVANTAGE · ROTATION · LOAD**',
      ],
      tryThis: 'After class: count how many wheel & axle machines you can find at home before tomorrow.',
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
