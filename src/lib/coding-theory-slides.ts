/**
 * coding-theory-slides.ts
 * Teacher theory slides shown before each coding session.
 * Focus: explain specific Scratch block commands per week and introduce the game concept.
 *
 * NOTE: uses its own types — different shape from the build-day TheorySlide/TheoryDeck.
 */

export interface CodingTheorySlide {
  title: string
  subtitle?: string
  body: string[]
  vocab?: { term: string; def: string }[]
  tryThis?: string
  challenge?: string
  speakerNotes?: string
}

export interface CodingTheoryDeck {
  gradeBand: string
  weekNumber: number
  title: string
  color: string
  slides: CodingTheorySlide[]
}

// ── G1-2 Week 1: Welcome to Scratch! ──────────────────────────────────────────
const scratchIntroG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 1, title: 'Welcome to Scratch!', color: '#7c3aed',
  slides: [
    {
      title: 'The Scratch Screen 🖵️',
      subtitle: 'Three main parts — find them on your screen!',
      body: [
        'BLOCK LIBRARY 🧩 (left) — all the blocks are here, sorted by color.',
        'CODE AREA 💻 (middle) — drag blocks here to build your code stack.',
        'STAGE 🎬 (right) — your sprite lives here. This is the game screen!',
        'Click 🚩 GREEN FLAG to run your code. Click 🔴 RED STOP button to stop.',
      ],
      speakerNotes: 'Tour the screen left to right. Ask: "Where do we find blocks? Where do we drag them? Where do we see the game?" Point physically at each panel.',
    },
    {
      title: 'Scratch Blocks Have Colors! 🎨',
      subtitle: 'Each color = a different kind of block',
      body: [
        '🟡 EVENTS (yellow) — make code START! "when 🚩 clicked", "when [key] pressed"',
        '🔵 MOTION (blue) — make sprites MOVE! "go to x: 0 y: -130", "change x by 15"',
        '🟣 LOOKS (purple) — change how sprites LOOK! "set size to 50%", "show", "hide"',
        '🟠 CONTROL + more colors are coming in future weeks! 🎉',
      ],
      speakerNotes: 'Hold up a yellow block, blue block, purple block — ask students what color they are. Point to each color category in the block library panel.',
    },
    {
      title: "Today's Blocks: Events + Motion 🟡🔵",
      subtitle: 'One Events block starts everything — then Motion blocks move the sprite!',
      body: [
        "🟡 'when 🚩 clicked' — ALWAYS the first block. Nothing runs without it!",
        "🔵 'go to x: 0 y: -130' — TELEPORTS the sprite to the bottom instantly (like magic!).",
        "🔵 'when [←] key pressed' → 'change x by -15' — LEFT! 'when [→] key pressed' → 'change x by 15' — RIGHT!",
        "'change x by' ADDS to the current position — perfect for arrow key movement!",
      ],
      speakerNotes: 'Demo: "go to x:200 y:0" (instant jump) vs "glide 2 secs to x:200 y:0" (smooth slide). Ask which to use for a game start. Answer: go to, because it is instant.',
      vocab: [
        { term: 'go to x: y:', def: 'Teleports the sprite instantly to that exact spot — like blinking there!' },
        { term: 'change x by', def: 'Adds a number to the current x position — makes the sprite move left or right' },
      ],
    },
    {
      title: "Let's Build! Space Catcher 🚀",
      subtitle: 'Move the rocket left and right to catch falling asteroids!',
      body: [
        "① Add Rocketship sprite → 'when 🚩 clicked' → 'go to x:0 y:-130' → 'set size to 50%'",
        "② 'when [←] key pressed' → 'change x by -15' — rocket moves LEFT!",
        "② 'when [→] key pressed' → 'change x by 15' — rocket moves RIGHT!",
        "③ Add the asteroid sprite → make it fall with 'change y by -5' inside a 'forever' loop!",
      ],
      tryThis: "What happens if you change 'change x by -15' to '-50'? Faster or harder to control?",
      challenge: "CHALLENGE: Find 'if on edge, bounce' in Motion — add it and see what happens at the screen edge!",
      speakerNotes: 'Walk around and check each student has Rocketship selected before dragging blocks. Most common mistake: dragging code onto the wrong sprite.',
    },
  ],
}

// ── G1-2 Week 2: Loops! ────────────────────────────────────────────────────────
const loopsG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 2, title: 'Loops — Repeat & Forever!', color: '#2563eb',
  slides: [
    {
      title: 'New Block Color: CONTROL 🟠',
      subtitle: 'Control blocks WRAP around other blocks — they are the power-ups!',
      body: [
        '🟠 CONTROL (orange) — loops and decisions! Example: "repeat (10)", "forever"',
        'What we already know: 🟡 Events + 🔵 Motion + 🟣 Looks (from Week 1)',
        '"repeat (10)" — runs the blocks inside EXACTLY 10 times, then stops.',
        '"forever" — runs the blocks inside FOREVER — only the 🔴 stop button ends it!',
      ],
      speakerNotes: 'Ask students to jump 5 times (repeat 5). Then ask them to jump forever — keep going until you say stop. That is the red button! Ask: which loop would a bouncing ball use?',
    },
    {
      title: 'repeat vs forever 🔄',
      subtitle: 'Two orange loops — very different jobs!',
      body: [
        "🟠 'repeat (10)' — like saying 'hop 10 times'. Stops when the count is done!",
        "🟠 'forever' — like breathing: never stops! The game uses this for movement.",
        'REPEAT: use when you know EXACTLY how many times. FOREVER: use for the whole game!',
        'Both wrap AROUND other blocks. The blocks inside are what actually runs!',
      ],
      speakerNotes: 'Show side by side: "repeat 5 → move 10" stops after 5 moves. "forever → move 5 → if on edge bounce" never stops. Ask: for a ball that bounces forever, which do we use?',
      vocab: [
        { term: 'repeat (N)', def: 'Runs the blocks inside exactly N times, then stops' },
        { term: 'forever', def: 'Runs the blocks inside non-stop until the red stop button is clicked' },
      ],
    },
    {
      title: 'Motion: change x vs set x 🔵',
      subtitle: 'Both control left-right position — but very different!',
      body: [
        "🔵 'change x by 15' — ADDS 15 to wherever the sprite is now. Perfect for movement!",
        "🔵 'set x to 100' — PLACES sprite at exactly x=100. Ignores where it was before.",
        "Sprite at x=50: 'change x by 15' → now at x=65. 'set x to 15' → now at x=15.",
        "🔵 'if on edge, bounce' — flips direction when sprite hits the screen edge!",
      ],
      speakerNotes: 'Demo: "set x to 100" repeatedly — sprite stays at 100. Then "change x by 10" repeatedly — sprite keeps moving further right. Key question: "Which makes something move?"',
      vocab: [
        { term: 'change x by', def: 'Adds a number to current x position — causes movement' },
        { term: 'set x to', def: 'Places sprite at exactly that x position — ignores where it was before' },
      ],
    },
    {
      title: "Let's Build! Bouncing Dance 💃",
      subtitle: 'A dancer that bounces back and forth forever!',
      body: [
        "① Add any animal or character sprite. 'when 🚩 clicked' → 'forever'",
        "② Inside forever: 'move 5 steps' + 'if on edge, bounce' — dancer bounces all game!",
        "③ Also inside forever: 'next costume' — sprite animates while bouncing! 😄",
        "④ Try TWO dancers with different speeds in two separate forever loops!",
      ],
      tryThis: "Change 'move 5 steps' to 'move 15 steps' — how does it feel? What about 1 step?",
      challenge: 'BONUS: Can you make a dancer go UP and DOWN instead of left-right? Hint: change y!',
      speakerNotes: 'Add "next costume" after "if on edge, bounce" inside the forever. Students love seeing the animation. Challenge: why does the sprite flip upside-down? Set rotation style to left-right only!',
    },
  ],
}

// ── G1-2 Week 3: Pokémon Catcher! ─────────────────────────────────────────────
const pokemonG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 3, title: 'Pokémon Catcher!', color: '#dc2626',
  slides: [
    {
      title: 'New Blocks: Sensing + Variables 🔵🟠',
      subtitle: 'Sensing detects! Variables remember!',
      body: [
        '🔵 SENSING (light blue) — detects things: "touching [Caterpie]?", "key [space] pressed?"',
        '🟠 VARIABLES (dark orange) — remembers numbers: Score, Timer, Lives',
        'What we know so far: 🟡 Events + 🔵 Motion + 🟣 Looks + 🟠 Control',
        'With Sensing + Variables we can COUNT points and DETECT when sprites touch! 🎮',
      ],
      speakerNotes: 'Sensing is the "eyes and ears" of your sprite — it can feel when it touches something. Variables are like a scoreboard that remembers a number. Together they make a real game!',
    },
    {
      title: 'Sensing: Is It Touching? 👆',
      subtitle: 'Touching blocks ask YES or NO — put them inside if-then!',
      body: [
        "🔵 'touching [Caterpie]?' — YES if sprites overlap, NO if they don't",
        'Must go INSIDE a 🟠 Control block like "if-then" or "repeat until"!',
        'Touching blocks are HEXAGON shaped — they fit in the hexagon gap of if-then!',
        'Scratch checks 30 times per second — catching feels instant and smooth!',
      ],
      speakerNotes: 'Misconception: students put sensing block alone in code area. Show the hexagon gap and how the sensing block shape fits inside it. Demo: two sprites not touching → touching.',
      vocab: [
        { term: 'touching [Sprite]?', def: 'YES or NO — are the two sprites overlapping right now?' },
        { term: 'Sensing (light blue)', def: 'Blocks that detect the world: touching, keys pressed, position, timer' },
      ],
    },
    {
      title: 'Variables: Score Counter ⭐',
      subtitle: 'Create a variable to track the score!',
      body: [
        "🟠 'set Score to 0' when flag clicked — ALWAYS reset at the start of the game!",
        "🟠 'change Score by 1' — adds 1 each time Pikachu catches Caterpie!",
        "Score appears on the STAGE automatically when you create it in the Variables tab!",
        "'pick random (-180) to (180)' — in OPERATORS (green) — gives a random x or y number!",
      ],
      speakerNotes: 'Quiz: Score is 3. "change by 1" → Score is? (4). "set to 1" → Score is? (1). Demo both live. Key point: SET replaces, CHANGE adds. Always set to 0 at the start!',
      vocab: [
        { term: 'set [var] to', def: 'Replaces the variable completely — use this to RESET at game start' },
        { term: 'change [var] by', def: 'Adds or subtracts from the variable — use this DURING the game' },
      ],
    },
    {
      title: "Let's Build! Pokémon Catcher ⚡",
      subtitle: 'Move Pikachu, catch Caterpie, score goes up!',
      body: [
        "① Pikachu: 'when [←] pressed → change x by -15', 'when [→] pressed → change x by 15'",
        "② On Caterpie sprite: 'when 🚩 clicked' → 'forever' → 'if touching [Pikachu]?'",
        "③ Inside if: 'change Score by 1' + 'go to x:(random -180 to 180) y:(random -130 to 130)'",
        "④ Also: 'set Score to 0' when flag clicked — score resets every game!",
      ],
      tryThis: "What does 'go to [Pikachu]' do differently from 'go to x: y:'?",
      challenge: 'CHALLENGE: Make Caterpie move by itself with its own forever loop — harder to catch!',
      speakerNotes: 'Remind students: Caterpie code goes on the CATERPIE sprite. Pikachu code goes on PIKACHU. Click the sprite in the sprite list to switch.',
    },
  ],
}

// ── G1-2 Week 4: Harry vs Voldemort! ──────────────────────────────────────────
const harryG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 4, title: 'Harry vs Voldemort!', color: '#d97706',
  slides: [
    {
      title: 'Looks: show and hide 🟣',
      subtitle: 'Make sprites appear and disappear — the secret of shooting games!',
      body: [
        "🟣 LOOKS 'hide' — makes sprite invisible. It still exists and code still runs on it!",
        "🟣 LOOKS 'show' — makes a hidden sprite visible again.",
        "THE SHOOTING PATTERN: Start hidden → player fires → show + move → hit → hide again!",
        "ALL projectiles use this: lightning bolt, bullet, Pokéball, snowball, arrow — all hidden at start!",
      ],
      speakerNotes: 'Demo: hide a sprite — it vanishes but you can still see its outline in the sprite list. Show + move = "fire and fly". Ask: why hide first? (So it does not appear in the wrong place before being fired)',
      vocab: [
        { term: 'hide', def: 'Makes the sprite invisible — it still exists and code still runs' },
        { term: 'show', def: 'Makes a hidden sprite visible again' },
      ],
    },
    {
      title: 'The Shooting Pattern 🔫',
      subtitle: 'hide → go to Harry → show → glide → hide again!',
      body: [
        "① 'when 🚩 clicked' → 'hide' — lightning bolt starts invisible at game start.",
        "② 'when [space] pressed' → 'go to [Harry]' → 'show' — bolt appears at Harry's wand!",
        "③ 'glide 1 secs to Voldemort' — we SEE the bolt fly. 'go to' is too fast to see!",
        "④ 'hide' after the glide — bolt disappears when it arrives. Ready to fire again!",
      ],
      speakerNotes: 'Ask: why go to Harry BEFORE show? (If we show first it flashes at old position.) Demo: show before go-to. Then demo the correct order. Ask which looks right.',
      vocab: [
        { term: 'glide N secs to', def: 'Slides the sprite smoothly over N seconds — you can see it move!' },
        { term: 'go to [Sprite]', def: 'Teleports instantly to that sprite — use this BEFORE show for projectiles' },
      ],
    },
    {
      title: 'Variables: Timer Countdown ⏱️',
      subtitle: '"change Timer by -1" counts DOWN!',
      body: [
        "🟠 'set Timer to 30' when flag clicked. 'set Score to 0' too — always reset both!",
        "🟠 'repeat (30)' → 'wait (1) secs' → 'change Timer by (-1)' — one tick per second.",
        "'change by -1' SUBTRACTS 1 each time. 'change by +1' would COUNT UP instead!",
        "'if Timer = 0 → say [Time is Up!] → stop [all]' — game ends automatically!",
      ],
      speakerNotes: 'Draw a number line on the board: +1 goes right (counting up), -1 goes left (counting down). Timer and HP use "change by -1". Score uses "change by 1".',
    },
    {
      title: "Let's Build! Harry vs Voldemort 🧙",
      subtitle: 'How many hits in 30 seconds?',
      body: [
        "① Lightning bolt: 'hide' at start. Space pressed → 'go to [Harry]' → 'show' → 'glide 1 secs to Voldemort' → 'hide'",
        "② Voldemort: 'forever' → 'if touching [Lightning]?' → 'change Score by 1'",
        "③ Timer: 'set Timer to 30' → 'repeat 30' → 'wait 1 sec' → 'change Timer by -1'",
        "④ After repeat: 'say [Time is Up!] for 2 secs' → 'stop [all]'",
      ],
      tryThis: "Change 'glide 1 secs' to 'glide 0.2 secs' — is it easier or harder to score?",
      challenge: "CHALLENGE: Make Voldemort say 'Ouch!' every time he gets hit using the 'say' block!",
      speakerNotes: 'Walk through each sprite: lightning code on lightning sprite, Voldemort code on Voldemort sprite. The timer code can go on any sprite — usually put it on Voldemort or the Stage.',
    },
  ],
}

// ── G1-2 Week 5: Space Shooter! (simple — no clones) ─────────────────────────
const spaceShooterG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 5, title: 'Space Shooter!', color: '#4f46e5',
  slides: [
    {
      title: 'All Blocks We Know! 🗂️',
      subtitle: '5 weeks of Scratch — look how many block colors we\'ve learned!',
      body: [
        '🟡 EVENTS: "when 🚩 clicked", "when [key] pressed" — starts everything!',
        '🔵 MOTION: "go to", "change x/y", "glide" — moves sprites around the stage!',
        '🟣 LOOKS: "show", "hide", "set size", "next costume" — controls appearance!',
        '🟠 CONTROL: "repeat", "forever", "if-then" + 🔵 SENSING: "touching?" + 🟠 VARIABLES!',
      ],
      speakerNotes: 'This is a celebration slide! Ask students to call out what each color does. They have learned 5 block categories in 5 weeks — that is the foundation of almost every Scratch game!',
    },
    {
      title: 'The Bullet Fire Pattern 🚀',
      subtitle: 'New Event: "when [space] pressed" fires the bullet!',
      body: [
        "① 'when 🚩 clicked' → 'hide' — bullet is invisible at game start.",
        "② 'when [space] pressed' → 'go to [Rocketship]' → 'show' — bullet appears at rocket!",
        "③ 'repeat until y > 170' → 'change y by 15' — bullet shoots UP the screen!",
        "④ After repeat: 'hide' — bullet disappears at the top. Space again = new bullet!",
      ],
      speakerNotes: 'Ask: why go to Rocketship BEFORE show? (If we show first it flashes at old position.) Demo both orders. Ask which looks correct. Space button fires once per press.',
      vocab: [
        { term: 'when [space] pressed', def: 'Fires once each time Space is pressed — each press = one bullet shot' },
        { term: 'repeat until y > 170', def: 'Loops until the bullet flies past the top of the stage, then stops' },
      ],
    },
    {
      title: 'Two Sprites Moving 🔼🔽',
      subtitle: 'Asteroid falls DOWN, bullet shoots UP — at the same time!',
      body: [
        '🔵 Positive y = moves UP the screen. Negative y = moves DOWN. Just like a number line!',
        "Asteroid: 'forever' → 'change y by -5' — falls DOWN (negative y is down!)",
        "Bullet: 'repeat until y > 170' → 'change y by 15' — shoots UP (positive y is up!)",
        'Both sprites run their code at the same time — always click the RIGHT sprite before coding!',
      ],
      speakerNotes: 'Draw a vertical number line: top = positive y (up), bottom = negative y (down). Asteroid moves down so negative. Bullet moves up so positive. They both run simultaneously.',
    },
    {
      title: "Let's Build! Space Shooter 🚀",
      subtitle: 'Press SPACE to fire — hit the asteroid to score!',
      body: [
        "① Rocketship: arrow keys move left/right. Code on Rocketship sprite.",
        "② Asteroid (Rocks): 'forever' → 'go to x:(random) y:180' → 'repeat until y < -150: change y by -5'",
        "③ Bullet: 'when flag → hide'. 'when space → go to Rocketship → show → repeat until y>170: change y 15 → hide'",
        "④ Scoring: inside bullet repeat, 'if touching [Rocks]? → change Score by 1 → hide'",
      ],
      tryThis: "Change 'change y by 15' on bullet to '5' — does a slower bullet feel easier or harder?",
      challenge: 'BONUS: Add a 30-second Timer! How many asteroids can you hit before time runs out?',
      speakerNotes: 'Three sprites: Rocketship (player), Rocks (asteroid), and a bullet sprite (draw a small circle or use a paint sprite). Each has its own code. Code the scoring inside the BULLET sprite.',
    },
  ],
}


// ── G3-4 Week 1: Moving Car! ───────────────────────────────────────────────────
const movingCarG34: CodingTheoryDeck = {
  gradeBand: 'g3-4', weekNumber: 1, title: 'Moving Car — Scratch Deep Dive!', color: '#0891b2',
  slides: [
    {
      title: 'EVENTS + MOTION — Arrow Keys Move the Car 🟡🔵',
      subtitle: '4 separate code stacks — one per direction',
      body: [
        '"when [right arrow] key pressed" → "change x by 15" — RIGHT. (Positive x = right on stage)',
        '"when [left arrow] key pressed" → "change x by -15" — LEFT. (Negative x = left)',
        '"when [up arrow] key pressed" → "change y by 10" — UP. (Positive y = up)',
        '"when [down arrow] key pressed" → "change y by -10" — DOWN. (Negative y = down)',
      ],
      speakerNotes: 'Show 4 floating stacks in code area. Students confused by disconnected stacks — explain: each key is its own Event trigger. Draw the + sign: right=+x, left=-x, up=+y, down=-y.',
      vocab: [
        { term: 'x axis', def: 'Left-right. x=-240 = far left. x=240 = far right. x=0 = centre.' },
        { term: 'y axis', def: 'Up-down. y=180 = top. y=-180 = bottom. y=0 = centre.' },
      ],
    },
    {
      title: 'MOTION — "go to" vs "change x/y" vs "set x/y" 🔵',
      subtitle: 'Three position blocks — know when to use each!',
      body: [
        '"go to x: 0 y: -100" — TELEPORT to an exact spot. Use for RESETTING position at start.',
        '"change x by 15" — ADD 15 to current x. Use for MOVEMENT (arrow key pressed).',
        '"set x to 100" — PLACE at exactly 100. Use for obstacles, targets, snapping to grid.',
        'CAR PATTERN: "go to x:0 y:-100" on flag → "change x by 15" on right key. Reset then move!',
      ],
      speakerNotes: 'Three live demos. Quiz: to make a car START in the middle → which block? To make it DRIVE when key pressed → which? To PLACE an obstacle at a fixed spot → which? Students answer each.',
    },
    {
      title: 'SENSING + PAINT — Detect & Draw! 🔵🎨',
      subtitle: 'Paint your road, sense your obstacle',
      body: [
        'Paint backdrop: click backdrop icon → Paint → Rectangle tool + grey → draw horizontal road across centre.',
        'Paint obstacle sprite: click Paint near sprite icon → draw a red rectangle.',
        '"if touching [Obstacle]?" → "change x by -20" — pushes car BACK 20 pixels on collision.',
        'Why -20? Car hit from right side moving right (+x), so push back means negative direction.',
      ],
      tryThis: 'What does "change x by -20" do when the car hits? Why negative?',
      challenge: 'CHALLENGE: Add "Distance" variable → "change Distance by 1" on every right-key press!',
    },
  ],
}

// ── G3-4 Week 2: Parallel Code ─────────────────────────────────────────────────
const parallelCodeG34: CodingTheoryDeck = {
  gradeBand: 'g3-4', weekNumber: 2, title: 'Parallel Code + Animation!', color: '#7c3aed',
  slides: [
    {
      title: 'Two Sprites, One Flag — Parallel Code 🚩',
      subtitle: '"When flag clicked" starts EVERY sprite\'s code at the same time',
      body: [
        'Each sprite has its OWN code area. When flag clicked, EVERY "when flag clicked" stack on EVERY sprite starts.',
        'Car sprite runs its code. Dancer runs its code. AT THE SAME TIME — this is parallel execution.',
        'They do not connect or talk — they run independently in their own sprite code areas.',
        'Click each sprite in the sprite list to switch between their code areas — different code per sprite!',
      ],
      speakerNotes: 'Click Car → show car code. Click Dancer → different code! One flag = multiple sprites starting. Surprises students who expect one connected chain of code.',
    },
    {
      title: 'LOOKS — "next costume" and "set costume to" 🟣',
      subtitle: 'How Scratch creates animation — cycling through still poses',
      body: [
        '"next costume" — switches to the next costume. After the last one, cycles back to costume 1.',
        '"forever" → "next costume" → "wait 0.2 secs" — rapid cycling = ANIMATION.',
        '"wait (N) secs" — pauses code for N seconds. 0.05 = fast animation. 0.5 = slow motion.',
        '"set costume to [costume1]" — jump directly to a specific pose. Use this to RESET at start.',
      ],
      speakerNotes: 'Click through a sprite costumes manually — each is a slightly different pose. Run the forever loop — animates! Same idea as movies: 24 still images per second.',
      vocab: [
        { term: 'next costume', def: 'Switch to next pose — cycle through all poses in forever = animation' },
        { term: 'wait (N) secs', def: 'Pause N seconds — controls animation speed and overall game timing' },
      ],
    },
    {
      title: "Today's Project — Car + Dancer! 🕺",
      subtitle: 'Two things at the same time — parallel code in action',
      body: [
        '① Car (same as Week 1): arrow keys move it. Code lives on the Car sprite.',
        '② Dancer: "when flag clicked" → "forever" → "next costume" + "wait 0.2 secs" + "move 3 steps" + "if on edge, bounce".',
        '③ Flag → both start! Car responds to keys. Dancer runs automatically.',
        'Always check sprite list first: which sprite are you coding? Wrong sprite = broken game!',
      ],
      tryThis: 'Add a SOUND block inside dancer forever — does it play with the animation?',
      challenge: 'CHALLENGE: Add a second dancer with a different wait time — different animation speeds!',
    },
  ],
}

// ── G3-4 Week 3: Pokémon Battle! ──────────────────────────────────────────────
const pokemonBattleG34: CodingTheoryDeck = {
  gradeBand: 'g3-4', weekNumber: 3, title: 'Pokémon Battle Game!', color: '#b91c1c',
  slides: [
    {
      title: 'VARIABLES — "set" vs "change" — know the difference! 🟠',
      subtitle: 'Three variables in this game: HP, Score, Timer',
      body: [
        '"set [HP] to (100)" — REPLACES the value completely. Use at START (when flag clicked) to RESET.',
        '"change [HP] by (-10)" — SUBTRACTS 10 from current value. Use DURING game when sprite gets hit.',
        '"change [Score] by (1)" — ADDS 1. Use every time a hit/catch happens during play.',
        '"change [Timer] by (-1)" inside "repeat 30 → wait 1 sec" — counts down from 30 to 0.',
      ],
      speakerNotes: 'Quiz: Start of game → set or change? (set). Player gets hit → set or change? (change -10). Time passes → (change -1). Player scores → (change +1). Each question students answer before you continue.',
      vocab: [
        { term: 'set [var] to', def: 'Replace completely — use at START to initialise or reset the game' },
        { term: 'change [var] by', def: 'Add or subtract — use DURING PLAY for HP loss, scoring, timing' },
      ],
    },
    {
      title: 'CONTROL "if-then" + SENSING "touching" inside FOREVER 🟠🔵',
      subtitle: 'The triple combo: forever wraps if-then wraps touching',
      body: [
        '"forever" → "if <touching [Pikachu]?> then" → "change HP by -10" + "change Score by 1".',
        'The IF must be INSIDE FOREVER — otherwise Scratch only checks once, then stops checking.',
        '"if <[HP] = 0>" → "stop [all]" — OPERATORS "=" (green) compares two values.',
        'Order: "change HP by -10" first, THEN "if HP = 0" — update first, then check the result!',
      ],
      speakerNotes: 'Common mistake: if-then outside forever = checks once. Inside forever = checks 30x per second. Demo both. Second mistake: "=" block is in OPERATORS (green), not Variables.',
    },
    {
      title: "Today's Game — Pokémon Battle! 🏆",
      subtitle: 'HP + Score + Timer = full battle system',
      body: [
        '① Start: set HP=100, Score=0, Timer=30. These RESET every time you click the flag.',
        '② Wild Pokémon bounces automatically: forever → move 5 + if on edge bounce.',
        '③ Poké Ball hits: "if touching [Wild Pokémon]?" → "change HP -10" + "change Score +1" + reposition.',
        '④ Timer: repeat 30 → wait 1 → change Timer -1. After repeat ends: stop all.',
      ],
      tryThis: 'What happens if you use "set HP to 90" instead of "change HP by -10"? Try it — what is wrong?',
      challenge: 'CHALLENGE: Add Lives variable. When HP = 0: change Lives -1 + set HP to 100. Game over when Lives = 0!',
    },
  ],
}

// ── G3-4 Week 4: The Dueling Championship! ────────────────────────────────────
const duelG34: CodingTheoryDeck = {
  gradeBand: 'g3-4', weekNumber: 4, title: 'The Dueling Championship!', color: '#6d28d9',
  slides: [
    {
      title: 'MOTION — "point towards" + "move" = AI 🧠',
      subtitle: 'How Voldemort chases Harry — just 2 blocks in a forever loop!',
      body: [
        '"point towards [Harry]" — rotates the sprite to FACE another sprite. Updates every frame!',
        '"move (3) steps" — moves FORWARD in whatever direction the sprite is currently pointing.',
        '"forever" → "point towards [Harry]" → "move 3 steps" → Voldemort always chases the player!',
        '"set rotation style [left-right only]" — stops Voldemort flipping upside-down while chasing.',
      ],
      speakerNotes: 'Demo "point towards" alone — sprite rotates to face the mouse. Add "move 3 steps" — it chases! This IS the Pac-Man ghost algorithm. How does Voldemort know where Harry is? Scratch always knows every sprite position.',
      vocab: [
        { term: 'point towards [Sprite]', def: 'Rotates to face another sprite — combined with move = homing/chasing AI' },
        { term: 'move (N) steps', def: 'Moves N pixels in the direction the sprite is currently pointing' },
      ],
    },
    {
      title: 'EVENTS — "broadcast" to connect sprites 📡',
      subtitle: 'One sprite sends a message, another sprite receives and reacts',
      body: [
        '"broadcast [hit!]" — sends a named message to ALL sprites instantly from Events category.',
        '"when I receive [hit!]" — any sprite with this block reacts when the message is broadcast.',
        'Example: lightning hits Voldemort → Voldemort broadcasts "hit!" → Harry HP bar reacts.',
        'Message name MUST match exactly — "hit!" and "Hit!" are different! Case sensitive.',
      ],
      speakerNotes: 'Walkie-talkie analogy: broadcast = pressing the button and talking. "When I receive" = the other walkie-talkie hearing. No wires — just matching message names. Both sprites must use same message string.',
    },
    {
      title: "Today's Game — The Duel! ⚡",
      subtitle: 'Harry fires, Voldemort chases — code the AI and HP bars',
      body: [
        '① Harry: arrow keys move, space fires lightning → "glide 0.5 secs to Voldemort" → if touching: Voldemort HP -10.',
        '② Voldemort AI: forever → "point towards Harry" → "move 2 steps" → if touching Harry: Harry HP -5.',
        '③ HP checks: if HP = 0 → broadcast [game over] → all sprites react and stop.',
        '"glide" for the lightning so we SEE it. "go to" would be instant — invisible bolt!',
      ],
      tryThis: 'Change Voldemort speed from 2 to 5 steps. Too hard? How would you balance it?',
      challenge: 'CHALLENGE: When Score hits 10, broadcast [level up!] → increase Voldemort move speed with a variable!',
    },
  ],
}

// ── G3-4 Week 5: Space Shooter! ───────────────────────────────────────────────
const spaceShooterG34: CodingTheoryDeck = {
  gradeBand: 'g3-4', weekNumber: 5, title: 'Space Shooter — Clones!', color: '#1d4ed8',
  slides: [
    {
      title: 'CONTROL — Clones: One Sprite, Unlimited Copies 🧬',
      subtitle: '"create clone" — most powerful Control block in Scratch',
      body: [
        '"create clone of [myself]" — makes an independent copy. Each clone has its own position and code.',
        '"when I start as a clone" — special Event that runs ONLY on clones, never on the original sprite!',
        'PATTERN: original → "hide" at start → Space key → "create clone" → clone → "show" + move → "delete this clone".',
        '"delete this clone" — ESSENTIAL! Without it, clones pile up and Scratch slows to a crawl.',
      ],
      speakerNotes: 'Most common mistake: code on original instead of "when I start as a clone". Original controls WHEN clones are made. Clone controls WHAT they do. Show two separate stacks side by side clearly.',
      vocab: [
        { term: 'create clone of [myself]', def: 'Creates an independent copy — each clone runs "when I start as a clone" code' },
        { term: 'delete this clone', def: 'Removes this specific clone — always clean up after use or Scratch crashes!' },
      ],
    },
    {
      title: 'SENSING — Collision Detection with Clones 🔵',
      subtitle: 'Both the bullet AND the asteroid check for each other',
      body: [
        'BULLET clone: "forever" → "change y by 20" → "if touching [Asteroid]?" → "change Score by 1" + "delete this clone".',
        'ASTEROID clone: "forever" → "change y by -4" → "if touching [Bullet]?" → "delete this clone".',
        '"if y position > 180 → delete this clone" — clean up bullets that fly off screen without hitting.',
        '"if touching [Rocket]?" on asteroid → "change Lives by -1" + "delete this clone" — lose a life!',
      ],
      speakerNotes: 'Without "delete this clone" on bullets: they pass through asteroids. Demo this so students discover WHY cleanup matters. Ask: what if you deleted asteroid but not bullet? What would player see?',
    },
    {
      title: "Today's Game — Space Shooter! 🚀",
      subtitle: 'Clones + collision detection + lives + Personal Best',
      body: [
        '① Rocket: arrow keys move. "when [space] pressed" → "create clone of [Bullet]".',
        '② Bullet clone: "go to [Rocket]" → show → forever → "change y by 20" → hit check → delete.',
        '③ Asteroid clone: random top spawn → forever → "change y by -4" → collision checks → delete.',
        '④ Personal Best: "if Score > PersonalBest → set PersonalBest to Score → say [New Record! 🏆]".',
      ],
      tryThis: 'Remove "delete this clone" from the bullet. Fire several shots. What happens?',
      challenge: 'ENGINEERING: Add Speed variable. Every 10 secs → change Speed +1. Use "change y by (0-Speed)" for asteroids — difficulty increases over time!',
    },
  ],
}

// ── Lookup table ───────────────────────────────────────────────────────────────
const codingDecks: CodingTheoryDeck[] = [
  scratchIntroG12, loopsG12, pokemonG12, harryG12, spaceShooterG12,
  movingCarG34, parallelCodeG34, pokemonBattleG34, duelG34, spaceShooterG34,
]

export function getCodingTheoryDeck(
  gradeBand: string,
  weekNumber: number,
): CodingTheoryDeck | undefined {
  return codingDecks.find(
    d => d.gradeBand === gradeBand && d.weekNumber === weekNumber,
  )
}
