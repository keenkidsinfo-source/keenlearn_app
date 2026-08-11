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
  title: 'Cable Car Science!',
  subject: 'Motion & Transportation',
  slides: [
    {
      emoji: '🚡',
      color: 'blue',
      title: 'What Did We Build?',
      headline: 'A string, a straw, a cup, and rocks — that\'s a real cable car!',
      bullets: [
        'A string stretched between **two chairs** (the zip line).',
        'A **straw** that slides along the string — that\'s the pulley!',
        'A **paper cup** hanging below the straw to carry cargo.',
        'Small **rocks** inside the cup as cargo weight.',
      ],
      tryThis: 'Why does adding MORE rocks make it slide further? Let\'s find out!',
    },
    {
      emoji: '🔄',
      color: 'orange',
      title: 'What is a Pulley?',
      headline: 'A pulley is a wheel that helps things move along a rope or string.',
      bullets: [
        'In our cable car — the **STRAW** is the pulley, the **STRING** is the rope.',
        '🚡 Cable cars carry people up steep hills in San Francisco since 1873!',
        '⛷️ Ski gondola lifts carry skiers up mountains using the same idea.',
        '🏳️ A flagpole pulley raises and lowers the flag.',
      ],
      vocab: { word: 'Pulley', definition: 'A wheel that helps things move along a rope or string' },
      tryThis: 'Look for the flagpole outside — it uses a pulley to raise the flag!',
    },
    {
      emoji: '🌍',
      color: 'green',
      title: 'Force #1: GRAVITY',
      headline: 'Gravity is an invisible force that pulls EVERYTHING downward.',
      bullets: [
        'Apples fall from trees. Balls drop to the ground. Rain falls down.',
        'Our cable car slides **DOWN** the zip line because of gravity.',
        '**More rocks = MORE gravity** pulling the cup down the string!',
        'Gravity ALWAYS pulls down — it never pushes up.',
      ],
      vocab: { word: 'Gravity', definition: 'An invisible force that pulls everything downward toward Earth' },
      tryThis: 'Drop a pencil — which direction? Gravity ALWAYS goes the same way.',
    },
    {
      emoji: '🛑',
      color: 'red',
      title: 'Force #2: FRICTION',
      headline: 'Friction is a force that SLOWS things down when surfaces rub together.',
      bullets: [
        'Socks on carpet → **SLOW** (lots of friction). Ice skates on ice → **FAST** (less friction).',
        'The **straw rubbing on the string** creates friction that slows our car.',
        'Friction fights gravity — if friction wins, the cup stops before the end.',
      ],
      vocab: { word: 'Friction', definition: 'A force that slows things down when two surfaces rub together' },
      tryThis: 'Rub your hands together fast — feel the heat? That\'s friction!',
    },
    {
      emoji: '⚔️',
      color: 'red',
      title: 'The Big Battle!',
      headline: 'Gravity vs. Friction — whoever wins decides what our cable car does!',
      bullets: [
        '**GRAVITY** wants to pull the cup DOWN the zip line.',
        '**FRICTION** wants to HOLD the straw in place and STOP it.',
        'If gravity wins → car slides all the way! If friction wins → car stops early.',
        'Adding rocks makes gravity STRONGER. A smooth string makes friction WEAKER.',
      ],
      tryThis: 'Who do you think will win today — gravity or friction? Make your prediction!',
    },
    {
      emoji: '🏆',
      color: 'purple',
      title: 'Our Big Discovery!',
      headline: 'More rocks = more gravity = beats friction = slides all the way!',
      bullets: [
        '**Empty cup** → Gravity too weak. Friction wins. Car STOPS in the middle.',
        '**1–2 rocks** → Gravity medium. Tied with friction. Car might stop halfway.',
        '**Enough rocks** → Gravity is STRONG! Friction loses. Car SLIDES ALL THE WAY! 🎉',
        'Once gravity beats friction, even MORE rocks = even FASTER!',
      ],
      vocab: { word: 'Force', definition: 'A push or pull that makes things move or stop' },
      tryThis: 'Predict: how many rocks will it take? Write it down before you test!',
    },
    {
      emoji: '🌎',
      color: 'blue',
      title: 'Real World Cable Cars!',
      headline: 'The same science YOU discovered is used in real engineering around the world!',
      bullets: [
        '🚡 **San Francisco** — Famous cable cars carry people up steep hills since **1873**!',
        '⛷️ **Ski Resorts** — Gondola lifts carry skiers up mountains all around the world.',
        '🏔️ **Swiss Alps** — The longest cable car in the world is **30 km** long!',
        '🎢 **Theme Parks & Zip Lines** — Use the same pulley + gravity science we learned!',
      ],
      tryThis: 'Can you think of any other places you\'ve seen a cable car or zip line?',
    },
    {
      emoji: '📚',
      color: 'green',
      title: 'New Words We Learned!',
      headline: 'Five science words you can use to explain your cable car.',
      bullets: [
        '**PULLEY** — A wheel that helps things move along a rope or string.',
        '**GRAVITY** — An invisible force that pulls everything downward.',
        '**FRICTION** — A force that slows things down when surfaces rub together.',
        '**LOAD** — The cargo or weight being carried.',
        '**FORCE** — A push or pull that makes things move or stop.',
      ],
      tryThis: 'Can you use all 5 words in one sentence to explain your cable car?',
    },
    {
      emoji: '🙋',
      color: 'orange',
      title: 'Let\'s Review!',
      headline: 'Four quick questions — shout out the answers!',
      bullets: [
        '❓ What simple machine did the STRAW act as? → **A PULLEY!**',
        '❓ What force pulled our cup DOWN the string? → **GRAVITY!**',
        '❓ What force tried to STOP our cup from sliding? → **FRICTION!**',
        '❓ Why did MORE rocks make the cup slide further? → **More weight = more gravity = beats friction!**',
      ],
    },
    {
      emoji: '🔬',
      color: 'purple',
      title: 'You are ENGINEERS!',
      headline: 'You built it. You tested it. You figured out WHY. That\'s science!',
      bullets: [
        '🔄 A **pulley** is a wheel that helps things move.',
        '🌍 **Gravity** pulls things downward — it\'s our engine.',
        '🛑 **Friction** slows things down — it\'s our challenge.',
        '🏆 **More weight = more gravity = cable car slides!** You discovered this yourself.',
      ],
      tryThis: 'Tell someone at home: "I built a cable car and discovered that gravity beats friction!"',
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
        '**Cardstock strip** taped to one end of the skewer = the CRANK HANDLE. Pinch the far end and sweep it in a circle.',
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
