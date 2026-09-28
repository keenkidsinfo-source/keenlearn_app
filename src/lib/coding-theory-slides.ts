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
      title: 'EVENTS — the "When" blocks 🟡',
      subtitle: 'Yellow blocks — nothing happens without them!',
      body: [
        '"when 🚩 clicked" — runs your code the moment the green flag is pressed. Always the FIRST block in every stack.',
        '"when [key] pressed" — runs code whenever a specific key is held down. Great for movement.',
        'WITHOUT an Events block: code just sits there doing nothing — the flag is the ON switch!',
        'Think of it like this: Events = the doorbell. The code inside = what you do when someone rings.',
      ],
      speakerNotes: 'Demo: put "move 10 steps" alone in the code area. Click it — it works! Now explain: the green flag is for running the WHOLE project. Show the difference: clicking blocks directly vs clicking the flag.',
    },
    {
      title: 'MOTION — "go to" vs "glide" 🔵',
      subtitle: 'Both move the sprite — but HOW they move is very different!',
      body: [
        '"go to x: 0 y: -130" — TELEPORTS the sprite instantly. No animation, just jumps there.',
        '"glide 1 secs to x: 0 y: 0" — SMOOTHLY slides the sprite over 1 second. You see it moving.',
        'TODAY we use "go to" — it places the rocket at the bottom immediately when flag is clicked.',
        '"set size to 50 %" — makes the sprite 50% of its original size. 100% = normal, 200% = double!',
      ],
      speakerNotes: 'Side-by-side demo: "go to x:200 y:0" (sprite jumps) vs "glide 2 secs to x:200 y:0" (sprite slides). Ask: "Which one would you use to JUMP? Which to SWIM?"',
      vocab: [
        { term: 'go to x: y:', def: 'Teleports the sprite instantly to that position — no sliding, just jumps' },
        { term: 'glide N secs to x: y:', def: 'Smoothly moves the sprite over N seconds — you see the animation' },
      ],
    },
    {
      title: "Today's Game — Your Rocket! 🚀",
      subtitle: 'Space Catcher: move left/right to catch falling asteroids',
      body: [
        '① Add the Rocketship sprite → "go to x:0 y:-130" → set size to 50% → rocket starts at the bottom!',
        '② "when [←] key pressed" → "change x by -15" — rocket slides LEFT. "change x by +15" = RIGHT.',
        '"change x by" ADDS to the current position — different from "set x to" which replaces it entirely.',
        '③ Next step: add the asteroid and make it fall!',
      ],
      tryThis: 'What happens if you change "change x by -15" to "-50"? How does the rocket feel?',
      challenge: 'BONUS: Add "if on edge, bounce" — what happens to the rocket at the screen edge?',
    },
  ],
}

// ── G1-2 Week 2: Loops! ────────────────────────────────────────────────────────
const loopsG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 2, title: 'Loops — Repeat & Forever!', color: '#2563eb',
  slides: [
    {
      title: 'CONTROL — "repeat" vs "forever" 🟠',
      subtitle: 'Two orange loop blocks — very different jobs!',
      body: [
        '"repeat (10)" — runs the blocks inside exactly 10 times, then STOPS. Change 10 to any number.',
        '"forever" — runs the blocks inside endlessly until you click the red STOP button. Never stops on its own!',
        'Use REPEAT when you know exactly how many times: "repeat 5" = do this 5 times.',
        'Use FOREVER when the game needs something always running: sprite always moving, always checking touching.',
      ],
      speakerNotes: 'Physical demo: ask a student to jump REPEAT 5 times. Then say "jump FOREVER" — keep going until you say stop. That is the red button! Ask: which loop would a bouncing ball use?',
    },
    {
      title: 'MOTION — "change x by" vs "set x to" 🔵',
      subtitle: 'Both affect position — completely different behaviour!',
      body: [
        '"change x by 15" — ADDS 15 to wherever the sprite currently is. Use this for movement.',
        '"set x to 150" — PLACES the sprite at exactly x=150 regardless of where it was.',
        'If sprite is at x=50 and you "change x by 15" → now at x=65. If you "set x to 15" → now at x=15.',
        '"if on edge, bounce" — flips direction when the sprite hits the screen edge. Combine with movement!',
      ],
      speakerNotes: 'Demo: "set x to 100" repeatedly — sprite stays at 100. Then "change x by 10" repeatedly — sprite keeps moving. Key question: "Which one makes something MOVE?"',
      vocab: [
        { term: 'change x by', def: 'Adds a number to the current x position — causes movement' },
        { term: 'set x to', def: 'Places the sprite at an exact x position — ignores where it was before' },
      ],
    },
    {
      title: "Today's Game — Bouncing Dance! 💃",
      subtitle: 'Add a dancer sprite that bounces back and forth forever',
      body: [
        '① Add any animal/character sprite. Inside a "forever" block: "move 5 steps" + "if on edge, bounce".',
        '② The dancer walks right → hits the wall → bounces left → bounces right → FOREVER.',
        '③ Add "next costume" inside the forever too → sprite animates while walking!',
        '"next costume" cycles through all the sprite costume images — that is how Scratch fakes walking!',
      ],
      tryThis: 'Change "move 5 steps" to "move 15 steps" — how does it feel? What about 1 step?',
      challenge: 'CHALLENGE: Add TWO dancers with different speeds using two separate forever loops!',
    },
  ],
}

// ── G1-2 Week 3: Pokémon Catcher! ─────────────────────────────────────────────
const pokemonG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 3, title: 'Pokémon Catcher!', color: '#dc2626',
  slides: [
    {
      title: 'SENSING — "touching" blocks (light blue) 🔵',
      subtitle: 'Scratch detection: is this sprite touching another sprite?',
      body: [
        '"touching [Caterpie]?" — asks YES or NO: is this sprite touching the named sprite RIGHT NOW?',
        'This question must go INSIDE an "if-then" or "repeat until" block — it only answers true/false.',
        '"touching [mouse-pointer]?" — touching the mouse. "touching [edge]?" — touching the screen edge.',
        'Scratch checks this 30 times per second — so it feels instant!',
      ],
      speakerNotes: 'Misconception: students put sensing block alone in code area. It must go inside a hexagonal gap in IF or REPEAT-UNTIL. Show the hexagon gap and sensing block shape fitting together.',
      vocab: [
        { term: 'touching [Sprite]?', def: 'YES/NO — are the two sprites overlapping even slightly?' },
        { term: 'Sensing (light blue)', def: 'Blocks that detect the state of the world: touching, keys, timer, position' },
      ],
    },
    {
      title: 'CONTROL "if-then" + VARIABLES "change" 🟠',
      subtitle: 'Make things HAPPEN when sprites touch',
      body: [
        '"if <condition> then" — runs the code inside ONLY when the condition is true.',
        'Inside the hexagon gap: drag in "touching [Caterpie]?" → if-block reacts to touching!',
        '"change Score by 1" — each time the if-block fires, Score goes up 1. "change" ADDS to current value.',
        '"set Score to 0" when flag clicked — always RESET variables at the start!',
      ],
      speakerNotes: 'Quiz: Score is 3. You "change by 1" → Score is? (4). You "set to 1" → Score is? (1). Demo both live.',
    },
    {
      title: "Today's Game — Pokémon Catcher! ⚡",
      subtitle: 'Move Pikachu, touch Caterpie → Score goes up!',
      body: [
        '① Pikachu moves left/right: "when [←] pressed → change x by -15" and "when [→] pressed → change x by 15".',
        '② On Caterpie: "forever" → "if touching [Pikachu]?" → "change Score by 1" + "go to x:random y:random".',
        '"go to x: (pick random -180 to 180) y: (pick random -130 to 130)" — teleports to a new random spot!',
        '"pick random" is in OPERATORS (green) — it gives a different number every time it runs.',
      ],
      tryThis: 'What does "go to [Pikachu]" do differently from "go to x: y:"?',
      challenge: 'CHALLENGE: Make Caterpie move by itself using its own forever loop!',
    },
  ],
}

// ── G1-2 Week 4: Harry vs Voldemort! ──────────────────────────────────────────
const harryG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 4, title: 'Harry vs Voldemort!', color: '#d97706',
  slides: [
    {
      title: 'LOOKS — "show" and "hide" 🟣',
      subtitle: 'Control whether a sprite is visible — key for shooting games!',
      body: [
        '"hide" (Looks, purple) — makes the sprite invisible. It still exists and can still move!',
        '"show" (Looks, purple) — makes the sprite visible again.',
        'SHOOTING PATTERN: lightning bolt starts hidden → player presses space → show + move → hide when done.',
        'This is how ALL projectiles work in Scratch: hide at start, show when fired, hide when it hits.',
      ],
      speakerNotes: 'Demo: hide a sprite — you can still see its outline in the sprite list, still there! Show + move = "fire and fly". Ask: why do we hide it first? (So it does not appear in the wrong place before being fired)',
      vocab: [
        { term: 'hide', def: 'Makes the sprite invisible — still exists and code still runs on it' },
        { term: 'show', def: 'Makes a hidden sprite visible again' },
      ],
    },
    {
      title: 'VARIABLES — Timer countdown: "change by -1" 🟠',
      subtitle: '"change" with a negative number = counting DOWN',
      body: [
        'Create variable "Timer". "set Timer to 30" when flag clicked. "set Score to 0" too.',
        '"repeat (30)" → "wait (1) secs" → "change Timer by (-1)" — counts from 30 down to 0.',
        '"change by -1" SUBTRACTS 1 each time. "change by +1" would count UP instead.',
        '"if Timer = 0 then → say [Time is Up!] → stop [all]" — OPERATORS "=" compares two values.',
      ],
      speakerNotes: 'Draw number line on board: +1 goes right (counting up), -1 goes left (counting down). Timer and HP bars count down with "change by -1". Score counts up with "change by 1".',
    },
    {
      title: "Today's Game — Harry vs Voldemort! 🧙",
      subtitle: 'Press SPACE to fire — how many hits in 30 seconds?',
      body: [
        '① Lightning bolt: "hide" at start. "when [space] pressed" → "go to [Harry]" → "show" → "glide 1 secs to Voldemort" → "hide".',
        '② On Voldemort: "forever" → "if touching [Lightning]?" → "change Score by 1".',
        '③ Timer: "repeat 30 → wait 1 sec → change Timer -1". After repeat: "stop all".',
        '"glide N secs" for the bolt so we SEE it move. "go to" is instant — we would not see the bolt fly!',
      ],
      tryThis: 'Change "glide 1 secs" to "glide 0.2 secs" — is it easier or harder to score?',
      challenge: 'CHALLENGE: Make Voldemort say "Ouch!" every time he gets hit using the "say" block.',
    },
  ],
}

// ── G1-2 Week 5: Space Shooter! (simple — no clones) ─────────────────────────
const spaceShooterG12: CodingTheoryDeck = {
  gradeBand: 'g1-2', weekNumber: 5, title: 'Space Shooter!', color: '#4f46e5',
  slides: [
    {
      title: "Today's Game — Space Shooter! 🚀",
      subtitle: 'Move with ← → arrows. Press SPACE to fire the bullet!',
      body: [
        'You control a Rocket at the bottom of the screen.',
        'Asteroids fall from the top — shoot them before they pass!',
        'Press SPACE → bullet flies up → hits the asteroid → Score goes up!',
        'One bullet at a time — wait for it to finish before firing again.',
      ],
      speakerNotes: 'Show the finished game first. Let kids watch it run. Then say: "Today we learn HOW this works — piece by piece."',
    },
    {
      title: 'All the Blocks We Know! 🗂️',
      subtitle: 'Week 5 uses ALL the block categories we learned this month',
      body: [
        '🟡 EVENTS (yellow) — "when 🚩 clicked", "when [space] pressed"',
        '🔵 MOTION (blue) — "go to [Rocket]", "change x by 15", "change y by 15"',
        '🟠 CONTROL (orange) — "forever", "repeat until y > 170", "if-then"',
        '🟣 LOOKS (purple) — "show" and "hide" — the invisible bullet trick from W4!',
        '🔵 SENSING (light blue) — "touching [Asteroid]?" — detects the hit and scores!',
      ],
      speakerNotes: 'Point to each color and ask kids to recall which week they first used it. W1=Events+Motion, W2=Control loops, W3=Sensing+Variables, W4=Looks show/hide. W5 brings them all together!',
    },
    {
      title: 'The Bullet Fire Pattern 🔫',
      subtitle: 'hide → wait for SPACE → jump to rocket → show → fly → hide',
      body: [
        '① "when 🚩 clicked → hide" — bullet starts invisible. We never see it at the wrong spot!',
        '② "when [space] pressed → go to [Rocket] → show" — bullet jumps to the rocket FIRST, then appears.',
        '③ "repeat until y > 170: change y by 15" — bullet flies UP until it exits the top of the screen.',
        '④ "hide" after the repeat — bullet disappears. Ready for the next SPACE press!',
      ],
      vocab: [
        { term: 'repeat until', def: 'Keep looping UNTIL the condition becomes true — then stop automatically' },
        { term: 'y > 170', def: 'y is the up-down position. 170 is near the top edge of the Scratch stage' },
      ],
      speakerNotes: 'Key misconception: kids try to "show" before "go to". Demo the wrong order — bullet flashes in the old position. Show correct order: go to Rocket FIRST, then show.',
    },
    {
      title: 'Two Sprites, Two Jobs ⬆️⬇️',
      subtitle: 'Asteroid goes DOWN. Bullet goes UP. At the same time!',
      body: [
        'Positive y (+) = moving UP toward the top of the screen.',
        'Negative y (-) = moving DOWN toward the bottom of the screen.',
        'ASTEROID code: "forever → change y by -5" — keeps falling DOWN.',
        'BULLET code: "repeat until y > 170 → change y by 15" — shoots UP when fired.',
        'Each sprite has its OWN code stack — always click the right sprite in the list!',
      ],
      speakerNotes: 'Draw a vertical line on the board. Label top + and bottom -. Asteroid has change y -5 (arrow down). Bullet has change y +15 (arrow up). Both run at the same time, independently.',
    },
    {
      title: "Let's Build! Space Shooter 🚀",
      subtitle: 'Click the RIGHT sprite before adding code!',
      body: [
        '① ROCKET sprite: "when [←] pressed → change x by -15". "when [→] pressed → change x by 15".',
        '② ASTEROID sprite: "when 🚩 clicked → forever → go to x:(random) y:180 → repeat until y<-150: change y -5".',
        '③ BULLET sprite: "when 🚩 clicked → hide". "when [space] pressed → go to [Rocket] → show → repeat until y>170: change y 15 → hide".',
        '④ SCORING: inside Bullet's repeat, add "if touching [Asteroid]? → change Score 1 → hide".',
      ],
      tryThis: 'Change "change y by 15" on the bullet to 5 — how does a slower bullet feel to play?',
      challenge: 'CHALLENGE: Add a 30-second Timer — how many asteroids can you hit before time runs out?',
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
