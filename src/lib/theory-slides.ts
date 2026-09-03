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
  /** Teacher-only speaking notes — what to say aloud while showing this slide */
  speakerNotes?: string[]
}

export interface TheoryDeck {
  gradeBand: 'g1-2' | 'g3-4'
  weekNumber: number
  title: string
  subject: string
  slides: TheorySlide[]
}

// ── G1-2 · Cable Car · Pulleys + Gravity + Friction ─────────────────────────

const cableCarDeck: TheoryDeck = {
  gradeBand: 'g1-2',
  weekNumber: 1,
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
  weekNumber: 1,
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

// ── G1-2 · Seesaw · Levers + Balance ─────────────────────────────────────────

const seesawDeck: TheoryDeck = {
  gradeBand: 'g1-2',
  weekNumber: 2,
  title: 'Seesaw Science!',
  subject: 'Simple Machines: Lever',
  slides: [
    {
      emoji: '🪜',
      color: 'orange',
      title: 'What Did We Build?',
      headline: 'A cardstock beam, a triangle, and two seats — that\'s a real lever!',
      bullets: [
        'A long **beam** (cardstock strip) that can tip left and right.',
        'A **triangle fulcrum** in the middle — it\'s the pivot point.',
        'Two **seat squares** at each end to hold objects.',
        'Small objects like coins, erasers, and rocks as the **load**.',
      ],
      tryThis: 'Before we start — what do you think will happen if one side is heavier?',
      speakerNotes: [
        'Hold up each piece as you name it. "This is the beam — it\'s like the plank on a playground seesaw."',
        'Point to the triangle: "This is the fulcrum. It\'s the most important piece — everything balances on it."',
        '"Today you are going to DISCOVER the rule of balance by testing real objects."',
        'Let the kids predict which side goes down before they build. Write predictions on the board.',
      ],
    },
    {
      emoji: '⚖️',
      color: 'blue',
      title: 'What is a Lever?',
      headline: 'A lever is a beam that pivots on a point — the fulcrum.',
      bullets: [
        '**BEAM** — the long bar that tips up and down (our cardstock strip).',
        '**FULCRUM** — the pivot point the beam rests on (our triangle).',
        '**LOAD** — whatever we place on the ends (coins, erasers, rocks).',
        '⚖️ A seesaw is a lever. 🪓 A crowbar is a lever. ✂️ Scissors are two levers!',
      ],
      vocab: { word: 'Lever', definition: 'A beam that pivots on a fulcrum to lift or balance a load' },
      tryThis: 'Can you spot a lever in the classroom right now?',
      speakerNotes: [
        '"A lever is one of the 6 simple machines — it multiplies or redirects force."',
        '"Every lever has exactly THREE parts: beam, fulcrum, load. Say them with me!"',
        'Draw a quick seesaw sketch on the board — label BEAM, FULCRUM, LOAD.',
        '"Scissors are TWO levers joined at the fulcrum. The hole for your finger is the effort, the blade is the load."',
      ],
    },
    {
      emoji: '🔺',
      color: 'green',
      title: 'Key Word: FULCRUM',
      headline: 'The fulcrum is the pivot — everything balances or tips around it.',
      bullets: [
        'Our **triangle** is the fulcrum. The beam rests on its TIP.',
        'The fulcrum MUST be exactly in the **centre** of the beam to work fairly.',
        'If the fulcrum is off-centre, one side will ALWAYS be lower — even with nothing on it!',
        'The fulcrum does NOT move — only the beam tips around it.',
      ],
      vocab: { word: 'Fulcrum', definition: 'The fixed pivot point that a lever balances or tips around' },
      tryThis: 'Balance a pencil on your finger. Your finger IS the fulcrum!',
      speakerNotes: [
        'Have every kid balance a ruler or pencil on their finger right now. "Feel that? Your finger is the fulcrum!"',
        '"If the fulcrum is in the middle, the beam can tip either way. If it\'s off-centre, it always tips one way."',
        '"When you build today — the most important step is placing the triangle EXACTLY at the centre mark."',
        '"Press and tape the fulcrum firmly. A wobbly fulcrum gives wrong results."',
      ],
    },
    {
      emoji: '⬇️',
      color: 'red',
      title: 'The Rule of Balance',
      headline: 'The HEAVIER side ALWAYS goes down. Equal weight = level beam.',
      bullets: [
        '**One coin on left, nothing on right** → left side goes DOWN. Right side goes UP.',
        '**One coin on each side** → both sides level! The beam BALANCES.',
        '**Two coins on left, one on right** → left side goes DOWN.',
        'The beam is telling you which side is heavier — it\'s a measuring machine!',
      ],
      tryThis: 'Predict: if I put a big eraser on one side and 3 coins on the other — which side goes down?',
      speakerNotes: [
        '"This is THE rule of levers. Heavier side down. Always. No exceptions."',
        '"Your seesaw is not a toy — it\'s a measuring instrument! It tells you which object has more MASS."',
        'Do a live demo with the class before they build: place one object, let kids watch the beam tip.',
        '"Today we use this rule to compare objects — we call that COMPARING MASS."',
      ],
    },
    {
      emoji: '🔍',
      color: 'purple',
      title: 'Size vs. Weight',
      headline: 'A big object is NOT always heavier — size and weight are different!',
      bullets: [
        '🪨 A small **stone** can be HEAVIER than a big **foam cube**.',
        '🎈 A big **balloon** is lighter than a tiny **marble**.',
        '**Size** = how big something looks. **Weight** (mass) = how much matter is inside.',
        'Your seesaw measures WEIGHT — not size. That\'s what makes it surprising!',
      ],
      vocab: { word: 'Mass', definition: 'The amount of matter in an object — what your seesaw measures' },
      tryThis: 'Before you test each object — PREDICT which side goes down. Were you surprised?',
      speakerNotes: [
        '"This is the big reveal moment — hold up a coin and a big eraser. Which looks heavier? Which IS heavier?"',
        '"The seesaw tells the truth. Your eyes can be fooled — the seesaw cannot."',
        '"This is why scientists use balance scales — they don\'t guess, they MEASURE."',
        '"Write down your prediction BEFORE you test each object. Scientists always predict first!"',
      ],
    },
    {
      emoji: '🌍',
      color: 'blue',
      title: 'Levers in the Real World!',
      headline: 'Levers are everywhere — from your kitchen to construction sites!',
      bullets: [
        '🪜 **Playground seesaw** — beam + fulcrum in the middle + two loads!',
        '✂️ **Scissors** — two levers joined at a fulcrum. Effort in, cut load out.',
        '⚖️ **Balance scale** — same as your seesaw, used in science labs for 5,000 years!',
        '🦾 **Crowbar** — a lever that multiplies your push to lift HEAVY loads.',
      ],
      tryThis: 'Find 2 levers at home tonight. Bring one example to share next week!',
      speakerNotes: [
        '"Every one of these is a lever. All have a beam, a fulcrum, and a load."',
        '"Balance scales have been used since Ancient Egypt — 5,000 years ago! Same simple machine."',
        '"The crowbar trick: if the fulcrum is near the heavy end, a small push on the far end moves a huge load. That\'s mechanical advantage — we\'ll learn more about that in Grade 3!"',
        '"Look for levers at home — can openers, scissors, your elbow joint, a door on a hinge."',
      ],
    },
    {
      emoji: '🏆',
      color: 'green',
      title: 'Our Big Discovery!',
      headline: 'Weight decides which side goes down. Balance = equal weight on both sides.',
      bullets: [
        '**Heavier side** → always goes DOWN. **Lighter side** → always goes UP.',
        '**Equal weight** → beam stays LEVEL. That\'s BALANCE!',
        'Big object ≠ heavy object. **Size and weight are not the same.**',
        'Your seesaw is a **measuring machine** — more reliable than your eyes!',
      ],
      tryThis: 'In one sentence — explain what you discovered today to the person next to you!',
      speakerNotes: [
        '"You discovered this by testing, not by being told. That\'s real science."',
        '"The rule is simple: heavier side down. But the SURPRISE was finding out which objects were actually heavier."',
        '"Ask: who was surprised by a result? What surprised you?"',
        '"Next week we build a balance scale — same idea, but we\'ll use it to MEASURE mass precisely."',
      ],
    },
    {
      emoji: '🙋',
      color: 'orange',
      title: 'Let\'s Review!',
      headline: 'Four questions — shout out the answers!',
      bullets: [
        '❓ What simple machine is a seesaw? → **A LEVER!**',
        '❓ What is the pivot point called? → **THE FULCRUM!**',
        '❓ Which side of the seesaw goes DOWN? → **THE HEAVIER SIDE!**',
        '❓ If both sides are level — what does that tell us? → **EQUAL WEIGHT (BALANCE)!**',
      ],
      speakerNotes: [
        '"Hands up for each answer — make sure every kid is engaged."',
        '"For question 4 — "equal weight" is the answer, not "they weigh the same as the beam." Both SIDES equal each other."',
        '"Star of the Day: who found the most surprising result — a light-looking object that was actually heavy?"',
        '"Tell someone at home: I built a seesaw and discovered which side goes down."',
      ],
    },
  ],
}

// ── G3-4 · Balance Scale · Levers + Torque + Measurement ─────────────────────

const balanceScaleDeck: TheoryDeck = {
  gradeBand: 'g3-4',
  weekNumber: 2,
  title: 'Balance Scale Science',
  subject: 'Simple Machines: Lever + Measurement',
  slides: [
    {
      emoji: '⚖️',
      color: 'blue',
      title: 'What Did We Build?',
      headline: 'A balance scale — an equal-arm lever with two hanging pans.',
      bullets: [
        '**Horizontal beam** (skewer) pivoting on an upright stand.',
        'Two identical **pans** hanging from each end at equal height.',
        'A **crank stand** holding the skewer so it can swing freely.',
        'Objects placed in the pans — heavier pan sinks, lighter pan rises.',
      ],
      tryThis: 'Why must the two pans be exactly the same — same size, same strings, same height?',
      speakerNotes: [
        '"This is the same instrument scientists have used for 5,000 years to measure mass — from Ancient Egypt to modern chemistry labs."',
        '"Your scale has 4 critical components — beam, pivot (fulcrum), two pans. Point to each one."',
        '"The pans MUST be identical — same mass, same string length, same height. Any difference = systematic error."',
        '"Today we\'re engineers AND scientists: we build the tool AND use it to collect data."',
      ],
    },
    {
      emoji: '⚙️',
      color: 'orange',
      title: 'Simple Machine: The Lever',
      headline: 'A lever is a rigid beam that rotates around a fixed pivot (the fulcrum).',
      bullets: [
        'Our balance scale is a **Class 1 Lever** — fulcrum in the MIDDLE, load on both ends.',
        '**Beam** = the skewer. **Fulcrum** = the pivot hole in the stand. **Load** = whatever\'s in the pans.',
        'Other Class 1 levers: seesaw, scissors, crowbar, see-saw, balance scale.',
        'Class 2 & 3 levers have the fulcrum at the end — wheelbarrows, tweezers.',
      ],
      vocab: { word: 'Class 1 Lever', definition: 'Fulcrum in the middle, load and effort on opposite ends' },
      tryThis: 'Can you explain what makes OUR scale a Class 1 lever? Where is the fulcrum?',
      speakerNotes: [
        '"There are 3 classes of levers based on WHERE the fulcrum is relative to the load and effort."',
        '"Class 1: fulcrum in middle — see-saw, scissors, balance scale. Class 2: load in middle — wheelbarrow. Class 3: effort in middle — tweezers, your forearm."',
        '"All three multiply or redirect force. The difference is HOW they trade force and distance."',
        '"Draw the three lever classes on the board with F (fulcrum), L (load), E (effort) labels."',
      ],
    },
    {
      emoji: '🔢',
      color: 'purple',
      title: 'Torque: Why the Heavy Side Wins',
      headline: 'Torque = Force × Distance from fulcrum. More torque = that side goes down.',
      bullets: [
        '**Torque** = how much a force ROTATES something around a pivot.',
        'Formula: **Torque = Force (weight) × Distance (from fulcrum)**.',
        'Equal arm lever: distance is the SAME on both sides.',
        '→ So whichever pan has MORE weight has more torque → that side goes DOWN.',
      ],
      vocab: { word: 'Torque', definition: 'Rotational force = force × distance from the pivot point' },
      tryThis: 'If you put 1 coin close to the fulcrum and 1 coin far from the fulcrum — which side goes down?',
      speakerNotes: [
        '"Torque is why levers can FEEL like they\'re multiplying force. Same weight, different distance = different torque."',
        '"For our equal-arm scale: distance is locked in (same on both sides). So the ONLY variable is weight. More weight → more torque → that pan sinks."',
        '"If you slid one pan\'s attachment closer to the fulcrum — even with equal weight, it would rise. That\'s how a balance scale can be rigged — worth discussing why scientists use calibrated weights."',
        '"Torque = force × distance. Write it on the board. This is the equation behind all levers."',
      ],
    },
    {
      emoji: '🎯',
      color: 'green',
      title: 'The True Balance Point',
      headline: 'The geometric centre and the balance point are NOT always the same!',
      bullets: [
        'A wooden skewer or stick is NOT perfectly uniform — wood density varies.',
        'The **geometric centre** (exactly halfway) may NOT be the balance point.',
        'Finding the **true balance point** by feel = more accurate results.',
        'Marking it with a dot ensures your pivot is always at the right spot.',
      ],
      tryThis: 'Balance your skewer on one finger — where is your finger? That\'s the TRUE centre!',
      speakerNotes: [
        '"This is a real precision measurement concept — engineers call it the "centre of mass."',
        '"The centre of mass is where ALL the weight acts as if it were concentrated at one point."',
        '"For a non-uniform object (like a real stick of wood), the centre of mass is NOT the geometric middle."',
        '"Real analytical balances in chemistry labs compensate for this — that\'s why they cost $50,000. Your job: find it by hand."',
      ],
    },
    {
      emoji: '📐',
      color: 'red',
      title: 'Accuracy vs. Precision',
      headline: 'Accuracy = how close to the true value. Precision = consistent results.',
      bullets: [
        '**Accuracy error**: pans not equal mass, strings not equal length, beam off-centre.',
        '**Precision error**: beam doesn\'t swing freely, measurements inconsistent.',
        'Every source of error means your scale tells you **lies** — it tilts even when both pans should be equal.',
        'Scientists call this **systematic error** — it affects every measurement the same way.',
      ],
      tryThis: 'If your empty scale tilts to one side — is that an accuracy problem or precision problem?',
      speakerNotes: [
        '"Empty scale tilts to one side = accuracy error = one pan is heavier than the other, or strings are different lengths."',
        '"Fix: re-tie strings to make pans hang at equal height. Even 1 cm difference makes a visible tilt."',
        '"This is why lab balances use precision-machined parts. Your cardstock pans introduce real measurement error."',
        '"Ask students: how would you redesign the scale to reduce error? What would you change first?"',
      ],
    },
    {
      emoji: '🌍',
      color: 'blue',
      title: 'Real-World Balance Scales',
      headline: 'Balance scales measure mass — used in science, trade, and medicine for 5,000 years.',
      bullets: [
        '⚕️ **Pharmacy scales** — compounding precise drug doses.',
        '🥊 **Boxing / wrestling** — athletes weigh in on balance scales for category fairness.',
        '⚗️ **Chemistry lab** — analytical balance scales accurate to 0.0001 g.',
        '🏛️ **Ancient Egypt** (3,000 BCE) — used to weigh gold and grain. Justice is still symbolised by balance scales!',
      ],
      tryThis: 'Why do you think the symbol for justice is a balance scale?',
      speakerNotes: [
        '"Balance scales measure MASS — the amount of matter. Spring scales measure WEIGHT — the gravitational force."',
        '"On the Moon, a spring scale gives a different reading (gravity is weaker). A balance scale gives the SAME reading — because both pans experience the same weaker gravity."',
        '"Justice symbol: a balance scale means both sides are judged equally — no thumb on the scale. Same root idea as our instrument."',
        '"Lab analytical balances cost $50,000+ and are accurate to 0.1 mg. Yours is accurate to maybe 1 g. Both use the same lever principle."',
      ],
    },
    {
      emoji: '🔬',
      color: 'purple',
      title: 'What You Measured',
      headline: 'Mass comparison: which object has more matter packed inside it?',
      bullets: [
        '**Mass** ≠ **Size** — a small steel bolt has MORE mass than a big sponge.',
        '**Mass** ≠ **Volume** — density explains how much is packed per cm³.',
        'Your scale can\'t tell you HOW MUCH mass — only WHICH IS MORE.',
        'To get exact grams: use a calibrated mass as a reference and count how many fit.',
      ],
      vocab: { word: 'Mass', definition: 'The amount of matter in an object — measured in grams or kilograms' },
      tryThis: 'How many pennies equal one eraser? Add pennies to one pan and the eraser to the other — count until level!',
      speakerNotes: [
        '"Mass vs. size: hold up a marble and a large foam ball. Which is heavier? The scale knows. Your eye guesses."',
        '"This is why scientists use standard masses — known weights to compare against. In your experiment, pennies are the standard."',
        '"Counting pennies to balance an eraser is called "finding mass in penny-units." Scientists use grams for the same reason."',
        '"Extension: if 4 pennies = 1 eraser, and a quarter = 5 pennies, what does the quarter equal in erasers?"',
      ],
    },
    {
      emoji: '🙋',
      color: 'green',
      title: 'Let\'s Review!',
      headline: 'Five key ideas from today — can you name them all?',
      bullets: [
        '❓ What type of simple machine is a balance scale? → **Class 1 Lever!**',
        '❓ What is TORQUE? → **Force × Distance from the fulcrum!**',
        '❓ Why find the true centre before pivoting? → **Wood isn\'t uniform — real balance point ≠ geometric centre!**',
        '❓ What does a balance scale measure? → **MASS — which side has more matter!**',
        '❓ What is systematic error? → **A consistent error that affects ALL measurements the same way!**',
      ],
      speakerNotes: [
        '"Call on different students for each question — not just the fast hands."',
        '"For torque: "force times distance from the pivot." If they remember just that, they understand the core idea."',
        '"Star of the Day: the student who identified a systematic error in their scale and corrected it — or who found the most surprising mass comparison."',
        '"Tell someone at home tonight: I built a balance scale and learned what torque is."',
      ],
    },
  ],
}

export const theoryDecks: TheoryDeck[] = [cableCarDeck, wellPulleyDeck, seesawDeck, balanceScaleDeck]

// Returns null if no deck exists for that week — caller should hide the Theory button
export function getTheoryDeck(gradeBand: string, weekNumber: number): TheoryDeck | null {
  return theoryDecks.find(d => d.gradeBand === gradeBand && d.weekNumber === weekNumber) ?? null
}

export const SLIDE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; headlineBg: string }> = {
  orange: { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-500', headlineBg: 'bg-orange-100' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-900',   badge: 'bg-blue-600',  headlineBg: 'bg-blue-100'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-900',  badge: 'bg-green-600', headlineBg: 'bg-green-100'  },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600', headlineBg: 'bg-purple-100' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-900',    badge: 'bg-red-600',   headlineBg: 'bg-red-100'    },
}
