import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL)

// ─────────────────────────────────────────────────────────────────────────────
// 12-WEEK PUBLIC SPEAKING CURRICULUM
//
// G3-4: Full formal structure track — Voice, Body, Mind → Formal Speech →
//        Impromptu → Platform → Showcase
//
// G1-2: Picture-based scaffold track — same pillars, simplified language,
//        no reading/writing required
// ─────────────────────────────────────────────────────────────────────────────

const speakingContent = [

  // ══════════════════════════════════════════════════════════════════════════
  // G3-4 TRACK
  // ══════════════════════════════════════════════════════════════════════════

  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'Introduction to Public Speaking',
    meta: {
      sessionType: 'intro',
      weekWord: 'Audience',
      weekWordDef: 'the people listening to your speech — they want you to succeed!',
      prompt: 'Think of a time you saw someone give a speech, presentation, or performance. What made it great? What would you change?',
      timeLimit: 90,
      structure: [
        '🌍 Name the situation ("I saw... at...")',
        '✨ What they did well ("They were great at...")',
        '💡 What could be improved ("I think they could have...")',
        '🎯 What you want to try ("When I speak, I want to...")',
      ],
      tip: 'Great speakers are made, not born. Every expert started exactly where you are today.',
      tipIcon: '🚀',
      improvGame: {
        name: 'Name + Superpower',
        description: 'Students introduce themselves with full confidence — voice, posture, eye contact. Sets the tone for the whole year.',
        instructions: [
          'Everyone stands.',
          'Each student makes eye contact with the class and says: "My name is [name] and my speaking superpower this year is going to be [blank]."',
          'Examples: "staying calm," "using gestures," "telling great stories," "projecting my voice."',
          'Class gives a snap 👏 after each person.',
          'Teacher note: watch who looks down, who rushes, who makes eye contact — you\'ll see their growth by Week 12!',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'Voice — Project, Pace & Variety',
    meta: {
      sessionType: 'skills',
      weekWord: 'Projection',
      weekWordDef: 'sending your voice to the back of the room without yelling — clear and powerful',
      prompt: 'You are the President for one day. Make an announcement to the whole country. What do you say?',
      timeLimit: 90,
      structure: [
        '🎙️ Open strong with authority ("Citizens of this country...")',
        '📢 Your announcement and why it matters to everyone',
        '💪 Close with confidence ("That is why I declare...")',
      ],
      tip: 'Slow. Down. Nervous speakers rush. Pause after your big ideas — silence sounds powerful.',
      tipIcon: '⏸️',
      improvGame: {
        name: 'Volume Dial',
        description: 'Students practice vocal control by saying the same sentence at different volume levels.',
        instructions: [
          'Give the sentence: "Today I will show you something amazing."',
          'Call out a number: 1 = barely a whisper, 5 = classroom voice, 10 = stadium announcement.',
          'Everyone says it at that volume at the same time.',
          'Try the sequence: 1 → 3 → 7 → 10 → 5.',
          'Ask the class: which level felt most confident and natural for speaking to a group?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 3,
    title: 'Body — Posture, Gestures & Eye Contact',
    meta: {
      sessionType: 'skills',
      weekWord: 'Presence',
      weekWordDef: 'how you fill the room with your body, voice, and energy — people feel it before you even speak',
      prompt: 'Stand like you own the room! Then convince us: should your school get a swimming pool?',
      timeLimit: 90,
      structure: [
        '🦸 Superhero stance first: feet shoulder-width, shoulders back, chin up',
        '📌 State your position clearly and confidently',
        '👐 Use your hands to emphasize each reason — gesture on purpose',
        '👀 Make eye contact with 3 different people as you speak',
      ],
      tip: 'Plant your feet. Swaying, pacing, or fidgeting tells the audience you\'re nervous. Go still — go powerful.',
      tipIcon: '🏔️',
      improvGame: {
        name: 'Mirror Mirror',
        description: 'Partners mirror each other\'s gestures — builds body awareness and purposeful movement.',
        instructions: [
          'Pair up students facing each other.',
          'Student A leads with slow, deliberate gestures (no speaking yet).',
          'Student B mirrors them exactly like a reflection.',
          'Switch after 30 seconds.',
          'Now both try to speak while using ONE intentional gesture per sentence.',
          'Debrief: what felt awkward? What felt powerful?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 4,
    title: 'Mind — Confidence, Emotions & Preparation',
    meta: {
      sessionType: 'skills',
      weekWord: 'Composure',
      weekWordDef: 'staying calm and in control even when you\'re nervous — your audience sees your outside, not your inside',
      prompt: 'Tell us about a challenge you faced. How did you stay calm or push through even when it felt hard?',
      timeLimit: 90,
      structure: [
        '😬 Set the scene ("I was nervous when...")',
        '🧠 What you thought and felt in that moment',
        '💪 What you decided to do ("I chose to...")',
        '🌟 What you learned about yourself',
      ],
      tip: '3 deep breaths before you speak. It\'s not just a cliché — your heart rate actually drops and your voice gets steadier.',
      tipIcon: '🌬️',
      improvGame: {
        name: 'Pressure Round',
        description: 'Students answer rapid-fire questions with zero hesitation — builds mental toughness for unexpected moments.',
        instructions: [
          'One student stands. Teacher fires questions rapid-fire.',
          'Rule: answer IMMEDIATELY — no "um," no pause longer than 2 seconds.',
          'If they freeze, the class says "NEXT!" and another question is fired.',
          'Sample questions: "Favorite color?" / "Best day ever?" / "Dogs or cats?" / "What\'s wrong with homework?"',
          'Do 4–5 rounds each, then rotate.',
          'Debrief: how did it feel? What helped you keep going?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 5,
    title: 'Formal Speech: The Introduction',
    meta: {
      sessionType: 'formal',
      weekWord: 'Hook',
      weekWordDef: 'your opening line — it grabs attention before you say anything else. A great hook makes people NEED to hear more.',
      prompt: 'Write and deliver ONLY the introduction of a speech. Topic: "Should kids have phones in school?"',
      timeLimit: 60,
      structure: [
        '🎣 Hook / Attention Grabber: Open with a bold question, surprising fact, or 1-sentence story',
        '📌 Thesis: State your position clearly ("I believe..." / "Today I will argue...")',
        '🗺️ Roadmap: Preview your 3 points ("I will cover: first... second... and third...")',
      ],
      tip: 'Your first sentence is your most important sentence. If you lose them there, you\'ve lost them. Make it count.',
      tipIcon: '💥',
      improvGame: {
        name: 'Hook Factory',
        description: 'Students compete to write the most attention-grabbing opening line.',
        instructions: [
          'Topic: "Should school start later in the morning?"',
          'Students have 60 seconds to write ONE hook sentence only.',
          'Go around the room — each student reads their hook aloud.',
          'Class snaps for the most gripping opener.',
          'Discuss: what made the best hooks work? Question? Fact? Story? Shock?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 6,
    title: 'Formal Speech: The Body — 3 Points',
    meta: {
      sessionType: 'formal',
      weekWord: 'Evidence',
      weekWordDef: 'a fact, example, or story that PROVES your point — not just your opinion',
      prompt: 'Deliver just the BODY of a speech: 3 reasons kids should (or shouldn\'t) have a longer lunch break.',
      timeLimit: 120,
      structure: [
        '1️⃣ First: State your point → give a specific example → explain why it matters',
        '2️⃣ Second: State your point → give a specific example → explain why it matters',
        '3️⃣ Third: State your point → give a specific example → explain why it matters',
      ],
      tip: 'Signal each point out loud: "First... Second... Finally..." — these words are the map your audience follows.',
      tipIcon: '🗺️',
      improvGame: {
        name: 'Point, Illustrate, Explain (PIE)',
        description: 'Rapid-fire practice of the 3-part body point structure.',
        instructions: [
          'Topic: "Dogs make better pets than cats."',
          'Students have 30 seconds to think of ONE point.',
          'They must say it in exactly 3 sentences: "My point is... For example... This shows that..."',
          'Keep it to 3 sentences only — no rambling!',
          'Go around fast — everyone gets one turn.',
          'Debrief: which examples were most convincing? Why?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 7,
    title: 'Formal Speech: The Conclusion',
    meta: {
      sessionType: 'formal',
      weekWord: 'Call to Action',
      weekWordDef: 'asking your audience to do, think, or feel something differently because of your speech',
      prompt: 'Deliver just the CONCLUSION of your phones-in-school speech from Week 5.',
      timeLimit: 60,
      structure: [
        '🔁 Return to your hook ("Remember when I asked you...?" / "Remember the fact I shared...?")',
        '📌 Restate your thesis — but say it in a new way, not word for word',
        '🗺️ Remind your audience of the roadmap ("Through [point 1], [point 2], and [point 3]...")',
        '💭 Leave a lasting impression — a call to action, a challenge, or a powerful final thought',
      ],
      tip: 'Your last words are what people remember most. End with energy, not a fade-out.',
      tipIcon: '🎯',
      improvGame: {
        name: 'Last Line Challenge',
        description: 'Students compete for the most memorable final sentence.',
        instructions: [
          'Topic: "We should have longer recess."',
          'Each student writes ONE final sentence — their most powerful closing line.',
          'Read them all aloud.',
          'Class votes for the most powerful.',
          'Discuss: did it connect back to the beginning? Did it leave a lasting thought? Did it feel final?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 8,
    title: 'Formal Speech: Putting It All Together',
    meta: {
      sessionType: 'formal',
      weekWord: 'Rehearsal',
      weekWordDef: 'practicing your speech out loud before you perform it — at least 3 times',
      prompt: 'Choose your own topic and deliver a complete formal speech: introduction + 3 body points + conclusion.',
      timeLimit: 180,
      structure: [
        '🎣 Introduction: Hook → Thesis → Roadmap',
        '1️⃣ Body Point 1: Point → Example → Why it matters',
        '2️⃣ Body Point 2: Point → Example → Why it matters',
        '3️⃣ Body Point 3: Point → Example → Why it matters',
        '🏁 Conclusion: Return to hook → Restate thesis → Roadmap reminder → Lasting impression',
      ],
      tip: 'Rehearse at least 3 times before you speak. Your confidence comes through when you know your material cold.',
      tipIcon: '🔁',
      improvGame: {
        name: 'Speed Round',
        description: 'One complete formal speech in 90 seconds — forces focus and reveals what\'s truly essential.',
        instructions: [
          'Topic: "School uniforms: yes or no?"',
          'Students have 3 minutes to outline the full 5-part structure.',
          'They deliver all parts (intro + 3 body + conclusion) in under 90 seconds.',
          'Class identifies which parts they heard clearly vs. which got lost.',
          'Debrief: what had to be cut? What stayed? What does that tell you about what matters most?',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 9,
    title: 'Impromptu Speaking — Think Fast!',
    meta: {
      sessionType: 'impromptu',
      weekWord: 'Impromptu',
      weekWordDef: 'speaking with very little preparation — thinking on your feet in real time',
      prompt: 'Your teacher will assign you a topic. You have 7 minutes to prepare, then speak for 1–2 minutes.',
      prepTime: 420,
      timeLimit: 90,
      structure: [
        '🧠 Brainstorm (2 min): What do you know? What\'s your instinct? Write everything — don\'t filter yet.',
        '📋 Outline (3 min): Pick your hook + 2–3 points + closing thought',
        '🗒️ Note card (2 min): Write 5–7 KEY WORDS only — no full sentences on your card',
        '🎤 Speak: Trust your prep. Your first instinct is usually right.',
      ],
      tip: 'Don\'t overthink it. Brainstorm fast, commit to your angle, and go. Second-guessing costs more than a wrong choice.',
      tipIcon: '⚡',
      improvGame: {
        name: 'Table Topics',
        description: 'Classic impromptu format — topic card, brief think time, timed speech.',
        instructions: [
          'Prepare topic cards: a famous quote, a random noun, an idiom or saying, a school-friendly current event.',
          'Students draw a card face-down.',
          '30 seconds to think (silent — no writing).',
          'They speak for exactly 60–90 seconds.',
          'Class evaluates: strong opening? Filled the time? Did they close or just stop?',
          'Sample topics: "A penny saved is a penny earned" / "sunrise" / "What would change if school started at noon?"',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 10,
    title: 'Platform Speech — Memorize & Perform',
    meta: {
      sessionType: 'platform',
      weekWord: 'Memorize',
      weekWordDef: 'knowing your speech so well that the words flow naturally — not like reading, but like talking',
      prompt: 'Choose an informative topic you care about. Write, memorize, and deliver a 2-minute platform speech.',
      timeLimit: 120,
      structure: [
        '📝 Write your complete speech — every word, not just bullet points',
        '🔁 Read it aloud 3× until the rhythm feels natural',
        '🙈 Practice without notes — use key words only if you get stuck',
        '👀 Eyes UP — look at your audience, not the floor or ceiling',
        '💪 Perform it: energy, pauses, gestures — you\'ve prepared for this',
      ],
      tip: 'Don\'t just memorize words — memorize the FEELING. Know WHY you\'re saying each part.',
      tipIcon: '🧠',
      improvGame: {
        name: 'First Line Freeze',
        description: 'Students deliver just their opening line — perfectly memorized and performed with full presence.',
        instructions: [
          'Each student delivers ONLY their first sentence.',
          'It must be from memory, with full eye contact and a strong, confident voice.',
          'Class rates on a 1–5 scale: did it grab attention? Did it sound natural or robotic?',
          'Students adjust and repeat once more — even better.',
          'Goal: the first line should feel effortless, like they\'ve said it 100 times.',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 11,
    title: 'Speech Types — Informative vs. Persuasive',
    meta: {
      sessionType: 'skills',
      weekWord: 'Persuade',
      weekWordDef: 'using words, evidence, and emotion to change someone\'s mind or move them to action',
      prompt: 'Choose your type: deliver a 90-second INFORMATIVE speech (teaches facts) OR a PERSUASIVE speech (convinces us to agree with you).',
      timeLimit: 90,
      structure: [
        '📚 Informative: "Did you know...?" → 3 surprising facts → "Next time you... remember..."',
        '🗣️ Persuasive: Bold position → 3 reasons with evidence → Call to action',
      ],
      tip: 'Know your goal before you speak: am I TEACHING or CONVINCING? Everything — tone, word choice, structure — changes based on that answer.',
      tipIcon: '🎯',
      improvGame: {
        name: 'Inform or Persuade?',
        description: 'Students listen to short speeches and classify them — then try both types.',
        instructions: [
          'Teacher delivers two 30-second mini-speeches on the same topic (e.g., exercise).',
          'Speech 1 (informative): "The human heart beats 100,000 times a day. Regular exercise can add years to your life."',
          'Speech 2 (persuasive): "We all need to exercise more — and schools should make it a daily priority."',
          'Class votes: which is which? What specific words or phrases gave it away?',
          'Students then try one of each type on a topic they choose.',
        ],
      },
    },
  },

  {
    gradeBand: 'g3-4',
    weekNumber: 12,
    title: 'Grand Showcase — Your Best Speech',
    meta: {
      sessionType: 'showcase',
      weekWord: 'Legacy',
      weekWordDef: 'what you leave behind — what your audience thinks, feels, or does because of your words',
      prompt: 'Deliver your BEST speech of the year. Any topic, any type. Show us everything you\'ve learned.',
      timeLimit: 180,
      structure: [
        '🌟 Choose your best format: formal speech, impromptu, or platform',
        '🎣 Open with your most powerful hook',
        '💪 Use your Voice (projection, pace), Body (posture, gestures, eye contact), and Mind (composure, preparation)',
        '🏁 Close with a lasting impression — make us think, feel, or act',
      ],
      tip: 'You are not the same speaker you were in Week 1. Speak with that pride — you\'ve earned every bit of it.',
      tipIcon: '🏆',
      improvGame: {
        name: 'Reflection Circle',
        description: 'Students celebrate each other\'s growth and set intentions for the future.',
        instructions: [
          'Go around the room — everyone stands.',
          'Each student completes: "This year I got better at... and next I want to work on..."',
          'Teacher shares one specific improvement they noticed in each student.',
          'End with a full-class snap for everyone. 👏',
          'Optional: revisit the "superpower" from Week 1 — did it come true?',
        ],
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // G1-2 TRACK  (picture-based scaffolds — no reading/writing required)
  // ══════════════════════════════════════════════════════════════════════════

  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    title: 'What Is Speaking Up?',
    meta: {
      sessionType: 'intro',
      weekWord: 'Speaker',
      weekWordDef: 'someone who stands up and talks to a group of people',
      prompt: 'Have you ever told a story to your family? Shared something at circle time? That\'s speaking! Tell us about a time you talked to a group.',
      timeLimit: 45,
      structure: [
        '🖼️ Show with your hands: "I talked about..."',
        '👥 Tell us who was listening',
        '😊 Tell us how it felt',
      ],
      tip: 'Everyone has a story to tell. YOUR voice matters!',
      tipIcon: '🌟',
      improvGame: {
        name: 'Hello World!',
        description: 'Students practice saying their name loud, slow, and proud — the very first step of every speech.',
        instructions: [
          'Everyone stands in a circle.',
          'Each student says: "Hi! My name is [name] and I like [favorite thing]!"',
          'They must say it LOUD, SLOW, and with a BIG smile.',
          'Class snaps after each person. 👏',
          'Teacher tip: model it first with lots of energy — they\'ll mirror you!',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'Voice — Big, Slow & Clear',
    meta: {
      sessionType: 'skills',
      weekWord: 'Voice',
      weekWordDef: 'the special sound you make when you talk — it belongs only to you!',
      prompt: 'Use your BIGGEST, most excited voice to tell us about your favorite food!',
      timeLimit: 45,
      structure: [
        '🍕 Name your food: "My favorite food is..."',
        '❤️ Why you love it: "I love it because..."',
        '😋 How it tastes or feels: "It tastes like..."',
      ],
      tip: 'Pretend your friend is on the other side of the playground. Talk that loud!',
      tipIcon: '📣',
      improvGame: {
        name: 'Voice Levels',
        description: 'Students practice different voice levels with hand motions.',
        instructions: [
          'Teach the levels with hand motions: 1 = library whisper (hand low), 3 = classroom voice (hand at waist), 5 = outdoor voice (hand at shoulder), 7 = CHEER (arms up!).',
          'Everyone says: "I have an AMAZING voice!"',
          'Call out a level — students say it at that level with the hand motion.',
          'Try 1 → 3 → 7 → 5.',
          'Ask: "Which level sounds best when we\'re sharing with a group?"',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 3,
    title: 'Body — Stand Like a Superhero',
    meta: {
      sessionType: 'skills',
      weekWord: 'Tall',
      weekWordDef: 'standing up straight with your head high — like you\'re proud of who you are!',
      prompt: 'Strike your superhero pose! Then tell us: what superpower would you choose and why?',
      timeLimit: 45,
      structure: [
        '🦸 Superhero pose first: feet apart, shoulders back, chin up — hold it!',
        '⚡ "My superpower would be..."',
        '🌟 "I would use it to..."',
      ],
      tip: 'Look at 3 different people while you talk — they will smile back at you!',
      tipIcon: '👀',
      improvGame: {
        name: 'Superhero Parade',
        description: 'Students walk as different characters to build body awareness and find the confident speaker stance.',
        instructions: [
          'Call out a character: Superhero! Sleepy person! Sad robot! Nervous speaker! Confident speaker!',
          'Students walk around the room AS that character — no talking, just movement.',
          'Freeze! Ask: "What does a confident speaker LOOK like? What does their body do?"',
          'Practice the confident speaker walk and stance together as a class.',
          'Take turns: one student does the confident stance, class gives a thumbs up or one coaching tip.',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 4,
    title: 'Mind — Brave Speaking',
    meta: {
      sessionType: 'skills',
      weekWord: 'Brave',
      weekWordDef: 'trying something even when it feels a little scary — that\'s what real courage looks like',
      prompt: 'Tell us about a time you tried something new that felt scary at first. What happened?',
      timeLimit: 45,
      structure: [
        '😬 "I felt nervous when..."',
        '🌬️ [Take 3 brave breaths together with the class]',
        '💪 "I tried it anyway and..."',
        '🌟 "I felt proud because..."',
      ],
      tip: 'Butterflies in your tummy just mean your body is getting ready to do something amazing!',
      tipIcon: '🦋',
      improvGame: {
        name: 'Brave Breath Circle',
        description: 'Breathing together builds calm and community before speaking.',
        instructions: [
          'Everyone stands in a circle and puts one hand on their tummy.',
          'Together: breathe IN for 4 counts (feel your tummy go out), hold for 2, breathe OUT for 4.',
          'Do it 3 times together.',
          'Then go around: each student shares one brave thing they\'ve tried this week — big or small.',
          'Teacher note: celebrate ALL answers — bravery looks different for everyone.',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 5,
    title: 'Starting Strong — The Hook!',
    meta: {
      sessionType: 'formal',
      weekWord: 'Hook',
      weekWordDef: 'a surprise at the very start that makes everyone wake up and want to listen!',
      prompt: 'Start with a question! Then tell us about your favorite animal.',
      timeLimit: 45,
      structure: [
        '🎣 Start with a question: "Did you ever see a...?" or "Have you ever wondered...?"',
        '🐾 Then tell us your animal: "My favorite animal is..."',
        '❤️ Tell us why you love it',
      ],
      tip: 'When you start with a question, everyone in the room wakes up and thinks — "Ooh, what\'s the answer?"',
      tipIcon: '🎣',
      improvGame: {
        name: 'Question Starters',
        description: 'Students practice turning any topic into an attention-grabbing question.',
        instructions: [
          'Teacher holds up a picture card: cat, pizza, playground, butterfly, snow.',
          'Students race to say a question about it: "Have you ever petted a cat?"',
          'Celebrate creative questions! Teach the starters: "Did you know...?" / "Have you ever...?" / "Can you imagine...?"',
          'Go fast — the energy is the point!',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 6,
    title: 'The Middle — Three Things!',
    meta: {
      sessionType: 'formal',
      weekWord: 'Details',
      weekWordDef: 'the little things that help people picture and understand exactly what you mean',
      prompt: 'Tell us 3 things about your favorite animal. Use your fingers to count!',
      timeLimit: 60,
      structure: [
        '☝️ Hold up 1 finger: "First, did you know that..."',
        '✌️ Hold up 2 fingers: "Second, something cool is..."',
        '🤟 Hold up 3 fingers: "Third, I also love that..."',
      ],
      tip: 'Hold up your fingers as you go — it helps your audience follow along AND helps you remember what\'s next!',
      tipIcon: '🖐️',
      improvGame: {
        name: 'Three Things!',
        description: 'Fast-paced game — students give 3 things about any topic using their fingers.',
        instructions: [
          'Call out a topic: recess / lunch / your bedroom / summer / your pet.',
          'One student stands and says 3 things as fast as they can, using fingers to count.',
          '"First... second... third..."',
          'Class snaps when they hit all three. Rotate to the next student!',
          'Keep it fast and fun — the energy matters more than perfection right now.',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 7,
    title: 'The Ending — A Big Finish!',
    meta: {
      sessionType: 'formal',
      weekWord: 'Closing',
      weekWordDef: 'how you end your speech — it\'s your last chance to make people smile or think!',
      prompt: 'End your animal speech with a BIG finish! Remind us what you said, then say something we\'ll remember.',
      timeLimit: 45,
      structure: [
        '🔁 Remind us: "So I told you about..."',
        '💭 Leaving thought: "Next time you see a [animal], remember..."',
        '👋 Thank the audience: "Thank you for listening to me today!"',
      ],
      tip: 'Don\'t just STOP — LAND your speech! Like a plane touching down smoothly, not crashing.',
      tipIcon: '✈️',
      improvGame: {
        name: 'Landing Zone',
        description: 'Students practice ending sentences with energy — not trailing off or stopping suddenly.',
        instructions: [
          'Everyone stands.',
          'Together, say: "And THAT is why [topic] is amazing!" — with energy and a smile.',
          'Now each student creates their own closing sentence for a topic they choose.',
          'Practice ending with chin up and a pause after the last word.',
          'Debrief: how does it FEEL to land your speech vs. just stopping?',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 8,
    title: 'A Whole Speech!',
    meta: {
      sessionType: 'formal',
      weekWord: 'Speech',
      weekWordDef: 'a talk with a beginning, a middle, and an end — hook + three things + big finish!',
      prompt: 'Give us your WHOLE speech about something you love! Hook → 3 Things → Big Finish!',
      timeLimit: 60,
      structure: [
        '🎣 Start with a question (your hook)',
        '☝️ First thing',
        '✌️ Second thing',
        '🤟 Third thing',
        '✈️ Big finish: "So remember..." or "Next time you see..."',
      ],
      tip: 'You know exactly what to do: hook, three things, big finish. You\'ve got this!',
      tipIcon: '🌟',
      improvGame: {
        name: 'Five-Finger Speech',
        description: 'Students use their hand as a visual map to deliver a complete 5-part speech.',
        instructions: [
          'Show the hand map: 👍 Thumb = Hook, ☝️ Index = Point 1, 🖕 Middle = Point 2, 💍 Ring = Point 3, 🤙 Pinky = Closing.',
          'Give a topic: pizza / dogs / summer / my favorite place.',
          'Students use their hand as a guide and deliver a mini 5-part speech.',
          'Partner activity: one student speaks, the other holds up fingers to track the parts.',
          'Celebrate everyone who reaches all five fingers!',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 9,
    title: 'Quick Speaking — Picture Topics!',
    meta: {
      sessionType: 'impromptu',
      weekWord: 'Impromptu',
      weekWordDef: 'speaking quickly when you don\'t have much time to get ready — thinking out loud!',
      prompt: 'Your teacher shows you a picture card. You get 30 seconds to look and think, then talk about it for 30–45 seconds!',
      prepTime: 30,
      timeLimit: 45,
      structure: [
        '🖼️ Look at the picture — what is it?',
        '🤔 Think: what do you know about it? What\'s something fun or surprising?',
        '🎤 Start talking: "This is a [thing] and I think it\'s interesting because..."',
      ],
      tip: 'Just start! Your brain will keep going once your mouth opens. The hardest part is the very first word.',
      tipIcon: '⚡',
      improvGame: {
        name: 'Picture Talk',
        description: 'Students speak about random picture cards — builds spontaneous speaking confidence.',
        instructions: [
          'Prepare 10–15 picture cards: animals, foods, places, objects, weather, emotions.',
          'Student draws a card (face-down until their turn).',
          '30 seconds to look and think.',
          'They talk about it for 30–45 seconds.',
          'Teacher tip: celebrate STARTING above all else. "You started — that\'s the win!"',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 10,
    title: 'Performing — Practice Makes Perfect!',
    meta: {
      sessionType: 'platform',
      weekWord: 'Practice',
      weekWordDef: 'doing something again and again so you get better and better each time',
      prompt: 'Pick a speech you\'ve done before and make it EVEN BETTER! Practice it twice, then perform it for us.',
      timeLimit: 60,
      structure: [
        '🔁 Practice #1: Try your speech (it\'s okay if it\'s not perfect!)',
        '🤔 Think of ONE thing to do better',
        '🔁 Practice #2: Try again with that one improvement',
        '🌟 Perform: your very best version!',
      ],
      tip: 'Every time you practice, you get a little better. That\'s how all great speakers do it!',
      tipIcon: '🔁',
      improvGame: {
        name: 'Better Each Time',
        description: 'Students give the same speech twice — and the whole class watches it improve.',
        instructions: [
          'One student delivers a speech (any from this year).',
          'Class gives ONE piece of kind, specific feedback: "You could try looking up more" or "Try slowing down on the big parts."',
          'Student delivers the SAME speech again with that one change.',
          'Ask the class: "What got better? What did you notice?"',
          'Celebrate the improvement out loud!',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 11,
    title: 'Teaching & Convincing',
    meta: {
      sessionType: 'skills',
      weekWord: 'Teach',
      weekWordDef: 'sharing what you know so someone else can learn something new from you',
      prompt: 'Choose: TEACH us one cool fact, OR CONVINCE us to try your favorite food!',
      timeLimit: 45,
      structure: [
        '📚 Teaching speech: "Did you know that [fact]? This is cool because..." + one more detail',
        '🍕 Convincing speech: "You HAVE to try [food] because... and also... and the best part is..."',
      ],
      tip: 'Decide first: am I teaching or convincing? That tells you HOW to say everything else.',
      tipIcon: '🎯',
      improvGame: {
        name: 'Teach or Convince?',
        description: 'Students sort speech examples into teaching vs. convincing.',
        instructions: [
          'Teacher says two sentences about the same topic (e.g., dogs):',
          '"Dogs can smell 1,000 times better than humans." (teaching — a fact!)',
          '"Everyone should have a dog because they make you so happy!" (convincing — an opinion!)',
          'Class holds up T (teaching) or C (convincing).',
          'Try 4–5 more examples. Then students make one of each type on a topic they choose.',
        ],
      },
    },
  },

  {
    gradeBand: 'g1-2',
    weekNumber: 12,
    title: 'Our Best Speech — Celebration Day!',
    meta: {
      sessionType: 'showcase',
      weekWord: 'Proud',
      weekWordDef: 'that warm, strong feeling you get when you try hard and do something great',
      prompt: 'Give us your BEST speech — any topic, any type. Show us how far you\'ve come!',
      timeLimit: 60,
      structure: [
        '🌟 Start with your best hook (question, surprise, or story)',
        '☝️✌️🤟 Share your three things using fingers and big body language',
        '✈️ Land with a strong, proud finish',
        '😊 Take a bow — you\'ve earned it!',
      ],
      tip: 'You are SO much better than Week 1. Stand tall and show us — because it\'s true!',
      tipIcon: '🏆',
      improvGame: {
        name: 'Celebration Circle',
        description: 'Students celebrate each other\'s growth with words and snaps.',
        instructions: [
          'Stand in a circle.',
          'Each student completes: "I got better at [speaking skill] this year!"',
          'Class responds with snaps and cheers after each one.',
          'Teacher shares one specific improvement they saw in each student.',
          'End with a whole-class cheer: "We are SPEAKERS!" 🎤',
        ],
      },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Run the update
// ─────────────────────────────────────────────────────────────────────────────

async function run() {
  let updated = 0
  let skipped = 0

  for (const c of speakingContent) {
    const [item] = await sql`
      SELECT ci.id, ci.title
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum cur ON cur.id = cd.curriculum_id
      WHERE ci.subject = 'public_speaking'
        AND ci.grade_band = ${c.gradeBand}
        AND cur.week_number = ${c.weekNumber}
        AND cur.grade_band = ${c.gradeBand}
      LIMIT 1
    `

    if (!item) {
      console.warn(`⚠  No public_speaking item found for ${c.gradeBand} week ${c.weekNumber}`)
      skipped++
      continue
    }

    await sql`
      UPDATE content_items
      SET title    = ${c.title},
          metadata = ${JSON.stringify(c.meta)}
      WHERE id = ${item.id}
    `
    console.log(`✓  ${c.gradeBand} Week ${String(c.weekNumber).padStart(2, ' ')}: "${c.title}"`)
    updated++
  }

  await sql.end()
  console.log(`\nDone! ${updated} updated, ${skipped} skipped.`)
}

run().catch(e => { console.error(e); process.exit(1) })
