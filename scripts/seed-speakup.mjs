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

// Week start dates (Mondays) for each session
const WEEK_STARTS = [
  '2026-08-17','2026-08-24','2026-08-31','2026-09-07',
  '2026-09-14','2026-09-21','2026-09-28','2026-10-05',
  '2026-10-12','2026-10-19','2026-10-26','2026-11-02',
  '2026-11-16','2026-11-30','2026-12-07','2026-12-14',
]

const SESSIONS_G12 = [
// ── WEEK 1 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 1 — Find Your Voice', pillar: 'Voice',
  weekWord: 'Speaker', weekWordDef: 'someone who shares ideas and feelings with others',
  tip: 'Every great speaker started exactly where you are right now!', tipIcon: '🌟',
  objectives: ['Students introduce themselves using a full sentence','Students learn the Three Pillars: Voice · Body · Mind','Students practice standing with confident posture'],
  improvGame: {
    name: 'Name + Feeling Toss',
    description: 'Students say their name and a feeling — builds confidence from minute one!',
    instructions: [
      'Stand in a circle. Teacher starts: "I\'m [Name] and I feel EXCITED!"',
      'Mime-toss an invisible ball to another student.',
      'That student catches it and says their name + feeling.',
      'Round 2: add a gesture that matches the feeling.',
      'Keep energy high — cheer for bold emotions!',
    ],
  },
  prompt: 'Tell us your name, one thing you love, and one thing that makes you nervous.',
  timeLimit: 60, structure: ['🙋 Say your name loud ("My name is...")','❤️ One thing you love ("I love...")','😬 One thing that makes you nervous ("I get nervous when...")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Name + Feeling Toss',
      steps:[
        {time:'0:00',action:'Stand at the front with high energy. "Today is Day 1 of SpeakUp! You are all speakers NOW." Big smile — set the tone that this is a fun, safe space.'},
        {time:'1:00',action:'Hold up 3 fingers. "Every great speaker uses three things: VOICE —" (touch throat) "— BODY —" (stretch arms wide) "— MIND." (tap head). Ask the class to do the actions with you. Repeat once.'},
        {time:'3:00',action:'Show the class how Name + Feeling Toss works. Stand in the circle, say "I\'m [your name] and I feel EXCITED!" then physically pretend to throw a ball to one student — make the throwing motion big and obvious so they know the \'ball\' is coming to them. That student \'catches\' it and takes a turn. (Check the Warm-Up tab for the full step-by-step.)'},
        {time:'4:30',action:'Students take turns around the circle. If a student freezes, show them the Feeling Faces card and say "Pick one — any one — happy, scared, proud, whatever is true right now!"'},
        {time:'7:00',action:'Round 2: same game but add a body gesture that matches the feeling (e.g. jump for excited, slump for sad). Cheer for big, bold choices. Then: "Great work — now let\'s hear your voices. Everyone to your seats."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Introduction Speeches',
      steps:[
        {time:'8:00',action:'Write SPEAKER on the board. "Our Word of the Day is SPEAKER. Repeat after me: A speaker SHARES ideas!" Ask two students to say it loudly.'},
        {time:'10:00',action:'Model the speech prompt yourself first — this is important. Say your name, one thing you love, and one thing that makes you nervous. Keep it real and a little funny (e.g. "I get nervous when I can\'t find parking"). Students relax when they see the teacher is human too.'},
        {time:'12:00',action:'Show the 3-part structure on the board or fingers: (1) My name is... (2) I love... (3) I get nervous when... "I will hold up a finger for each part as you speak — it helps you know where you are."'},
        {time:'13:00',action:'Give students 2 minutes to think quietly or whisper-practise with a partner. Walk around and give quiet encouragement to nervous students.'},
        {time:'15:00',action:'Ask for a volunteer to go first. Before they start: "Feet apart, pick three people in the room to look at — one on the left, one in the middle, one on the right. Ready? Go." Start the 60-second timer.'},
        {time:'16:10',action:'After each speech, ask one classmate: "Give one star — what did you like?" Model the language the first time: "I liked when you said..." Keep feedback short and kind. This is not critique week — just celebration.'},
        {time:'17:00',action:'Keep moving through all students. Aim for about 2 minutes per student (roughly 1 min speech + 1 min feedback). If running short on time, skip the peer feedback and just give a quick "Well done!" yourself.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Reflection + Send-Off',
      steps:[
        {time:'52:00',action:'"Quick quiz — what are the Three Pillars?" Point to students one at a time. Build to a whole-class shout: VOICE — BODY — MIND! Do the actions together one more time.'},
        {time:'54:00',action:'Star of the Day: pick one student who showed courage today — especially someone who was nervous but tried anyway. Be specific: "I\'m choosing [name] because they took a big breath and went for it."'},
        {time:'55:00',action:'"Next week we\'re going to learn about VOLUME — how to fill this entire room with just your voice. Start practising at home — talk loud enough that someone two rooms away can hear you!"'},
        {time:'57:00',action:'Closing ritual — do this every single week. "Repeat after me: I — AM — A — SPEAKER!" Class shouts it back. End with a fist bump or high five as students leave.'},
      ]},
  ],
  pictureCards:[
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Show at 1:00 to introduce Voice·Body·Mind framework'},
    {name:'Feeling Faces',emoji:'😊',use:'Show during warm-up to help students name emotions'},
  ],
},
// ── WEEK 2 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 2 — The Voice Dial', pillar: 'Voice',
  weekWord: 'Volume', weekWordDef: 'how loud or quiet your voice is',
  tip: 'Fill the room! Speak loud enough so the person in the back row can hear every word.', tipIcon: '📢',
  objectives: ['Students identify 5 volume levels on the Voice Dial','Students match volume to audience size and setting','Students practise sustaining level 4 for a full speech'],
  improvGame: {
    name: 'Volume Machine',
    description: 'The whole class calibrates their voice together on a 1–5 scale!',
    instructions: [
      'Show the Voice Dial card — 5 levels (whisper → stadium).',
      'Call a level 1–5. Everyone says "I AM A SPEAKER!" at that level.',
      'Repeat with a new sentence. Call levels randomly — jump between 1 and 5.',
      'Hold up fingers instead of calling numbers for a silent challenge.',
      'Final round: teacher mouths a level silently — class reads the number and responds.',
    ],
  },
  prompt: 'What is your favourite animal? Tell us 3 amazing things about it!',
  timeLimit: 60, structure: ['🐾 Name the animal ("My favourite animal is...")','🌟 Amazing fact 1 ("Did you know...")','🌟 Amazing fact 2 ("Also...")','🌟 Amazing fact 3 ("And the coolest thing is...")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Volume Machine',
      steps:[
        {time:'0:00',action:'Hold up the Voice Dial card so everyone can see it. Point to each level as you name it: "Level 1 is a whisper. Level 5 is stadium loud. Today\'s Pillar is VOICE — and today we\'re going to work on VOLUME."'},
        {time:'1:30',action:'Run Volume Machine. "I\'ll call a number — everyone says \'I AM A SPEAKER!\' at that volume. Ready?" Call out: 1 … 5 … 3 … 2 … 5 … 1 in fast succession. Pause briefly between each so the class can hear the difference. If anyone is obviously off (shouting at level 1, whispering at level 5), name the level again and have just that student retry.'},
        {time:'5:00',action:'Silent round. "Now I won\'t call the number — I\'ll just hold up my fingers. Read my hand and respond." Hold up 3, 1, 5, 2, 4 silently. Students respond at that level without being told which it is. This builds the habit of self-regulating volume without reminders.'},
        {time:'7:00',action:'Hold up 3 fingers and leave them there. "This — level 3 — is our classroom voice. When you\'re speaking in class, aim here." Ask the whole class to say "classroom voice" at exactly level 3 together. Then sit them down.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Animal Speeches',
      steps:[
        {time:'8:00',action:'Write VOLUME on the board. "Our Word of the Day is VOLUME — how loud or quiet your voice is. What level should we use in this room when we\'re speaking?" Take 2-3 hands. Confirm: "Level 3 to 4. Loud enough so the back row hears every word."'},
        {time:'10:00',action:'Give the animal speech yourself — deliberately at level 2, mumbly and quiet. Ask the room: "Could you hear me clearly?" (They\'ll say no, and probably laugh.) Then redo the same speech at level 4. Ask: "Which version would you actually want to listen to?" The contrast is what sticks.'},
        {time:'13:00',action:'Show the 4-part structure on the board or your fingers: (1) My favourite animal is… (2) Did you know… (3) Also… (4) And the coolest thing is… "You have 2 minutes to think. You can draw your animal if that helps you remember what to say." Walk around and encourage quietly.'},
        {time:'15:00',action:'Speeches begin. While each student speaks, hold up the Voice Dial card silently if their volume drops below level 3. Don\'t interrupt — just raise the card and point. The student sees it and adjusts. This is a non-embarrassing way to coach in real time.'},
        {time:'16:30',action:'After each speech, ask the audience to hold up fingers (1-5) to rate the volume — quick, 3 seconds, then move on. "What number? Show me." This gives the speaker instant, honest feedback and keeps the audience actively listening.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Volume Check-Out',
      steps:[
        {time:'52:00',action:'"Quick question — if you\'re speaking to 14 people in this room, what level?" (3-4). "What if you\'re on a stage talking to 100 people?" (4-5). Take a show of hands for each guess, then confirm together. "The bigger the room, the bigger the voice."'},
        {time:'54:00',action:'Star of the Day: name the student who filled the room best all session — someone who hit level 4 consistently without ever shouting. Be specific: "I\'m choosing [name] because their voice reached the back row every single time — even at the start when they were nervous."'},
        {time:'55:30',action:'"Next week we learn PACE — how fast or slow you speak. A speaker who talks too fast loses everyone. Between now and then, notice: how fast do people talk on TV versus in real life?"'},
        {time:'57:00',action:'Closing ritual. "I AM A SPEAKER!" — first at level 4 (full energy). Then everyone whispers it at level 1. The contrast makes it memorable. End with a fist bump or high five as students leave.'},
      ]},
  ],
  pictureCards:[
    {name:'Voice Dial',emoji:'🎚️',use:'Show at 0:00 and hold up silently during speeches to signal volume'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to VOICE pillar each time you mention volume'},
  ],
},
// ── WEEK 3 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 3 — Stand Like a Speaker', pillar: 'Body',
  weekWord: 'Posture', weekWordDef: 'how you hold your body when you stand or sit',
  tip: 'Your body speaks before you say a word. Stand tall and the audience already trusts you!', tipIcon: '🧍',
  objectives: ['Students identify confident vs. closed body language','Students practise the 5-point body check (feet, hands, spine, shoulders, chin)','Students use deliberate gestures to reinforce their message'],
  improvGame: {
    name: 'Statue Gallery',
    description: 'Freeze in a pose — the audience guesses your emotion from your body alone!',
    instructions: [
      'Teacher calls an emotion: PROUD, SCARED, BORED, EXCITED, NERVOUS.',
      'Students freeze in a pose showing that emotion — no words, no sounds.',
      'On "unfreeze," a few students describe what they did with their body.',
      'Round 2: add a job title ("Proud Principal", "Excited Explorer").',
      'Debrief: which poses made you feel powerful just by doing them?',
    ],
  },
  prompt: 'If you could be any superhero for one day, who would you be and why?',
  timeLimit: 75, structure: ['🦸 Name your superhero ("I would be...")','💪 Your superpower ("My power is...")','🌍 What you would do ("I would use it to...")','⚡ Why you chose them ("I chose this hero because...")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Statue Gallery',
      steps:[
        {time:'0:00',action:'"Today is BODY week. Your body is 55% of your message — more than your words!"'},
        {time:'1:00',action:'Run Statue Gallery: PROUD → SCARED → BORED → EXCITED → NERVOUS.'},
        {time:'5:00',action:'Introduce the 5-Point Body Check: feet wide, hands visible, spine tall, shoulders back, chin up.'},
        {time:'7:00',action:'Class does Body Check together, then Power Pose for 10 seconds. "Notice how that feels."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Superhero Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: POSTURE. Demo slumped vs. tall. Ask which speaker they trust more.'},
        {time:'10:00',action:'Introduce gesture rule: "Don\'t hide your hands. Use them to show size, direction, feeling."'},
        {time:'13:00',action:'2-min prep. Encourage students to PLAN one gesture per speech point.'},
        {time:'15:00',action:'Speeches begin. Each speaker does the 5-Point Body Check before starting (class counts along silently).'},
        {time:'16:30',action:'After each: one classmate names a specific gesture they noticed.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Body Language Bingo Debrief',
      steps:[
        {time:'52:00',action:'Quick quiz: teacher stands in 3 poses — students say "confident" or "closed."'},
        {time:'54:00',action:'Star of Day: student with the most deliberate gesture.'},
        {time:'56:00',action:'Preview: "Next week: EYE CONTACT — how to connect with every person in the room."'},
        {time:'57:00',action:'Closing: everyone does Power Pose for 5 seconds, then: "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Body Check Card',emoji:'🧍',use:'Hold up before each speaker so class does the 5-point check together'},
    {name:'Gesture Bank',emoji:'🤲',use:'Show during prep time — students pick 1-2 gestures to plan for their speech'},
    {name:'Body Language Bingo',emoji:'🎯',use:'Optional: audience marks off body skills they observe during speeches'},
  ],
},
// ── WEEK 4 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 4 — Eye Contact', pillar: 'Body',
  weekWord: 'Connection', weekWordDef: 'a feeling of understanding between two people',
  tip: 'Don\'t stare at one person — make eye contact with 3 different people during your speech!', tipIcon: '👀',
  objectives: ['Students understand why eye contact builds trust and connection','Students practise the "3-person sweep" technique','Students distinguish between staring, avoiding, and connecting'],
  improvGame: {
    name: 'Eye Contact Tennis',
    description: 'Passing a silent "ball" of attention with only your eyes — surprisingly hard and hilarious!',
    instructions: [
      'Sit in a circle. No talking allowed.',
      'Teacher makes eye contact with one student and nods — that passes the "ball."',
      'The student looks away (break contact) then finds a NEW person to pass to.',
      'Speed round: try to pass it as fast as possible without words.',
      'Debrief: "What made it easy or hard to hold eye contact?"',
    ],
  },
  prompt: 'What is your favourite season and why? Give us two reasons!',
  timeLimit: 60, structure: ['🌤️ Name your season ("My favourite season is...")','1️⃣ Reason one ("One reason is...")','2️⃣ Reason two ("Another reason is...")','🎯 Close strong ("That\'s why I love...")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Eye Contact Tennis',
      steps:[
        {time:'0:00',action:'"This week is still BODY. Today: the most powerful thing your body can do — eye contact."'},
        {time:'1:00',action:'Run Eye Contact Tennis silently. Keep energy playful.'},
        {time:'5:30',action:'Debrief: how did it feel to hold someone\'s gaze? To have them look away?'},
        {time:'7:00',action:'Teach the 3-person sweep: pick 3 spots in the room and sweep Left → Middle → Right during a speech.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Season Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: CONNECTION. "Eye contact is how you connect without touching."'},
        {time:'10:00',action:'Demo: give 30-sec speech looking at ceiling. Then redo with 3-person sweep. Ask: which felt better?'},
        {time:'12:00',action:'Assign 3 "audience anchors" — students speaker should look at (rotate each speech).'},
        {time:'14:00',action:'Speeches begin. Audience raises hand when they get eye contact.'},
        {time:'16:00',action:'After each: audience reports "I got eye contact: yes/no" — quick show of hands.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Connection Count',
      steps:[
        {time:'52:00',action:'"Why does eye contact matter? What does it tell your audience?" Take 3 responses.'},
        {time:'54:00',action:'Star of Day: student who hit all 3 anchor points.'},
        {time:'56:00',action:'Preview: "Next week: THE HOOK — how to start your speech with a BANG."'},
        {time:'57:30',action:'Closing ritual. Eye contact challenge: everyone makes eye contact with one person and says "I AM A SPEAKER."'},
      ]},
  ],
  pictureCards:[
    {name:'Eye Contact Map',emoji:'👀',use:'Show before speeches — label Left / Middle / Right sweep targets'},
    {name:'Body Check Card',emoji:'🧍',use:'Continue using for 5-point check before each speaker'},
  ],
},
]
// ── WEEK 5 ──────────────────────────────────────────────────────────────────
const G12_W5_8 = [
{
  title: 'SpeakUp! Week 5 — The Hook', pillar: 'Voice',
  weekWord: 'Hook', weekWordDef: 'the very first sentence of a speech that grabs everyone\'s attention',
  tip: 'Your first 5 seconds decide whether people lean in or tune out. Make them INCREDIBLE!', tipIcon: '🎣',
  objectives: ['Students learn 3 Hook types: Ask a Question, Wow Fact, Tiny Story','Students write and deliver a Hook before their speech','Students evaluate each other\'s Hooks'],
  improvGame: {
    name: 'Hook or No Hook',
    description: 'Teacher starts speeches two ways — class votes on which grabs their attention!',
    instructions: [
      'Teacher gives 10-second opening A: "Today I want to talk about dogs. I have a dog."',
      'Then opening B: "What if your best friend could not talk but loved you more than anyone?"',
      'Class votes: Hook or No Hook? Why?',
      'Do 3 more pairs. Students start to identify what makes a hook work.',
      'Challenge: students write their own hook for today\'s prompt on a sticky note.',
    ],
  },
  prompt: 'What is one rule at school you would change, and why?',
  timeLimit: 75, structure: ['🎣 YOUR HOOK (question, wow fact, or tiny story)','📌 Your rule ("I would change the rule about...")','💡 Why it\'s a problem ("Right now it\'s a problem because...")','✅ Your fix ("My new rule would be...")','🎤 Close strong'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Hook or No Hook',
      steps:[
        {time:'0:00',action:'Show Hook Types card. "Today you learn the most important sentence of any speech."'},
        {time:'1:30',action:'Run Hook or No Hook game with 3 pairs. Energy high — audience reacts physically (lean in or lean back).'},
        {time:'5:30',action:'Reveal the 3 Hook Types: Ask a Question / Wow Fact / Tiny Story. Write on board.'},
        {time:'7:00',action:'Students choose their Hook type. Write first sentence only on a sticky note.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Rule-Change Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: HOOK. "Every great speech starts with one."'},
        {time:'9:00',action:'Model: give a full speech with a strong hook. Point to hook on structure card.'},
        {time:'12:00',action:'2-min prep. Remind: hook is written; now build the rest.'},
        {time:'14:00',action:'Speeches begin. After Hook: audience holds up 1, 2, or 3 fingers for Hook type.'},
        {time:'16:00',action:'Feedback focus this week: only comment on the Hook. "Did it grab you? Which type was it?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Hook Hall of Fame',
      steps:[
        {time:'52:00',action:'"What are the 3 Hook types?" Class recites. "Which is hardest? Which is most fun?"'},
        {time:'54:00',action:'Hook Hall of Fame: vote on the best Hook of the day. Winner reads it again.'},
        {time:'56:00',action:'Preview: "Next week: THE THREE THINGS — how to give your speech a middle."'},
        {time:'57:30',action:'Closing ritual: students say their Hook sentence to a partner, then whole class does the send-off.'},
      ]},
  ],
  pictureCards:[
    {name:'Hook Types Card',emoji:'🎣',use:'Show at warm-up and keep visible all session — 3 types: Ask/Wow Fact/Tiny Story'},
    {name:'Voice Dial',emoji:'🎚️',use:'Remind students their Hook needs level 4 volume — it sets the tone'},
  ],
},
// ── WEEK 6 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 6 — The Three Things', pillar: 'Mind',
  weekWord: 'Structure', weekWordDef: 'the plan or shape of your speech — like a skeleton that holds everything up',
  tip: 'Three things is the magic number. Not two, not five — THREE. Our brains love threes!', tipIcon: '🚂',
  objectives: ['Students understand the G1-2 speech shape: Hook → 3 Things → Big Finish','Students label their speeches using the Three-Part Train','Students feel the difference between a structured speech and a ramble'],
  improvGame: {
    name: 'Story Train',
    description: 'Build a story one sentence at a time — each person adds exactly ONE car to the train!',
    instructions: [
      'Teacher starts: "Once there was a dragon who loved pizza." (Engine 🚂)',
      'Next student adds one sentence. Next adds another. Keep going around the circle.',
      'Rule: your sentence must connect to the previous one.',
      'After 6–8 sentences, teacher says "Big Finish!" — next student must end the story.',
      'Debrief: did the story feel organised? Where did it go off the rails?',
    ],
  },
  prompt: 'Tell us about your favourite day ever! What happened?',
  timeLimit: 90, structure: ['🎣 Hook','🚂 Thing 1 — what happened first','🚃 Thing 2 — what happened next','🚃 Thing 3 — the best part','🏁 Big Finish ("That\'s why this was my favourite day!")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Story Train',
      steps:[
        {time:'0:00',action:'"Today: MIND pillar. We\'re building the SKELETON of a speech." Show Three-Part Train card.'},
        {time:'1:30',action:'Run Story Train — teacher starts, round the circle, end with a Big Finish.'},
        {time:'6:00',action:'Show structure: Hook → 3 Things → Big Finish on the board. "This is your speech train today."'},
        {time:'7:30',action:'Students label their sticky note plan: H / 1 / 2 / 3 / F.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Favourite Day Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: STRUCTURE. "A speech with no structure is like a train with no tracks."'},
        {time:'9:30',action:'Model a speech using the train — point to each car as you go.'},
        {time:'12:00',action:'Prep time: students sketch 5 boxes (H/1/2/3/F) and fill in one word per box.'},
        {time:'14:00',action:'Speeches begin. Class counts fingers: 1 (Thing 1), 2 (Thing 2), 3 (Thing 3) as speaker delivers.'},
        {time:'16:00',action:'After each: "Did they have all 3 Things? Did they have a Big Finish?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Train Check',
      steps:[
        {time:'52:00',action:'"What are the 5 parts of today\'s speech?" (Hook / Thing 1 / Thing 2 / Thing 3 / Big Finish)'},
        {time:'54:00',action:'Star of Day: clearest structure. Ask them to say their 3 Things again.'},
        {time:'56:00',action:'Preview: "Next week: FEELINGS — how to make your audience feel something."'},
        {time:'57:30',action:'Closing: say the structure out loud together, then send-off ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Three-Part Train',emoji:'🚂',use:'Keep visible all session — point to each car as speakers deliver their speech parts'},
    {name:'Speech Skeleton',emoji:'🦴',use:'Use as a planning template during 2-min prep time'},
  ],
},
// ── WEEK 7 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 7 — Feelings & Expression', pillar: 'Voice',
  weekWord: 'Expression', weekWordDef: 'showing your feelings through your face, voice, and body',
  tip: 'If YOU feel it, THEY feel it. Let your face and voice show exactly what your words mean!', tipIcon: '🎭',
  objectives: ['Students match vocal tone to emotional content','Students use facial expression intentionally during speeches','Students distinguish a flat delivery from an expressive one'],
  improvGame: {
    name: 'Emotion Translator',
    description: 'Same sentence — totally different emotion each time. Audiences feel the difference instantly!',
    instructions: [
      'Give the class a boring sentence: "I went to the store to buy milk."',
      'Teacher delivers it in: JOY, TERROR, BOREDOM, FURY, LOVE.',
      'Class guesses the emotion after each delivery.',
      'Pairs: one student says the sentence, partner guesses. Then swap.',
      'Challenge: can you make someone laugh using only your voice and face?',
    ],
  },
  prompt: 'Tell us about a time you felt really proud of yourself. What happened?',
  timeLimit: 90, structure: ['🎣 Hook','🌟 What you did ("I felt proud when...")','💪 Why it was hard ("It was hard because...")','😊 How it felt ("When it was done, I felt...")','🏁 Big Finish'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Emotion Translator',
      steps:[
        {time:'0:00',action:'"VOICE pillar again — but today: EXPRESSION. Your voice is a musical instrument."'},
        {time:'1:30',action:'Run Emotion Translator with 5 emotions. Ham it up — model boldness.'},
        {time:'5:00',action:'Pairs practice. Circulate and encourage exaggeration: "Too much expression doesn\'t exist in this room!"'},
        {time:'7:00',action:'Debrief: "Which emotion was hardest to fake? Which was easiest?"'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Proud Moment Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: EXPRESSION. "Today your speech must make US feel what YOU felt."'},
        {time:'9:30',action:'Demo: tell a proud moment story twice — flat, then expressive. Ask which one they believed.'},
        {time:'13:00',action:'Prep: students think of their real proud moment. Encourage emotion words in notes.'},
        {time:'15:00',action:'Speeches begin. After each: audience holds up 1-5 fingers for expressiveness score.'},
        {time:'16:30',action:'Feedback focus: "Did you believe them? What moment felt the most real?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Expression Replay',
      steps:[
        {time:'52:00',action:'Ask 2 students to re-deliver their best moment — this time even MORE expressive.'},
        {time:'54:30',action:'Star of Day: most expressive face + voice combo.'},
        {time:'56:00',action:'Preview: "Next week: NERVES — how to turn butterflies into rocket fuel."'},
        {time:'57:30',action:'Closing ritual with maximum expression: "I AM A SPEAKER!" — say it like you mean it.'},
      ]},
  ],
  pictureCards:[
    {name:'Feeling Faces',emoji:'😊',use:'Show during warm-up — students match face to emotion before they perform it'},
    {name:'Voice Dial',emoji:'🎚️',use:'Remind: expression includes pace and pitch, not just volume'},
  ],
},
// ── WEEK 8 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 8 — Confidence & Nerves', pillar: 'Mind',
  weekWord: 'Courage', weekWordDef: 'doing something even when you feel scared',
  tip: 'Nervous = excited. Your butterflies are cheering for you. Invite them in!', tipIcon: '🦋',
  objectives: ['Students identify physical signs of nervousness','Students reframe nerves as excitement and fuel','Students use Brave Breathing before a speech'],
  improvGame: {
    name: 'Brave Breathing',
    description: 'A 60-second breathwork routine that reduces nerves before any performance!',
    instructions: [
      'Sit up straight. Feet flat. Hands on knees.',
      'Breathe IN through nose for 4 counts (teacher counts).',
      'HOLD for 4 counts.',
      'Breathe OUT slowly through mouth for 6 counts.',
      'Repeat 3 times. Then: Power Pose for 10 seconds. "Notice the difference."',
    ],
  },
  prompt: 'What is something hard you learned to do? (Riding a bike? Reading? A sport?) How did you learn it?',
  timeLimit: 90, structure: ['🎣 Hook','😬 What was hard ("At first I couldn\'t...")','💪 How you practised ("I kept trying by...")','🎉 The breakthrough ("Then one day...")','🏁 Big Finish — what you learned about yourself'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Brave Breathing + Nerve Check',
      steps:[
        {time:'0:00',action:'"MIND pillar today. Who gets nervous before speaking?" Hands up — normalise it completely.'},
        {time:'1:30',action:'"Nervous energy is just excitement without a direction. Let\'s give it one."'},
        {time:'2:00',action:'Run Brave Breathing × 3. Keep voice calm and steady.'},
        {time:'5:30',action:'Power Pose for 10 seconds. "Say inside your head: I am ready."'},
        {time:'7:00',action:'Discuss: "What do nerves feel like in your body? Heart? Stomach? Hands?"'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Hard Thing Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: COURAGE. "Courage is not no fear. Courage is speaking anyway."'},
        {time:'9:30',action:'Share your own nervous moment — a real one. Model vulnerability.'},
        {time:'12:00',action:'Each speaker does Brave Breathing × 1 silently before stepping to the front.'},
        {time:'14:00',action:'Speeches begin. Audience sends silent encouragement: thumbs up before speaker starts.'},
        {time:'16:00',action:'Feedback focus: "Where did they look most confident? When did they seem to forget their nerves?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Courage Circle',
      steps:[
        {time:'52:00',action:'Courage Circle: "Finish this sentence — Coming up here today took courage because..."'},
        {time:'54:30',action:'Star of Day: student who visibly overcame nerves (name the specific moment).'},
        {time:'56:00',action:'Preview: "Next week: STORYTELLING — the most powerful form of speaking."'},
        {time:'57:30',action:'Closing: Brave Breathing × 1, Power Pose, "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Brave Breathing Card',emoji:'🌬️',use:'Show steps at warm-up and keep accessible for nervous speakers throughout session'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to MIND pillar — courage lives here'},
  ],
},
]
SESSIONS_G12.push(...G12_W5_8)
// ── WEEKS 9-12 G1-2 ──────────────────────────────────────────────────────────
const G12_W9_12 = [
{
  title: 'SpeakUp! Week 9 — Storytelling', pillar: 'Mind',
  weekWord: 'Narrative', weekWordDef: 'a story that takes listeners on a journey with a beginning, middle, and end',
  tip: 'The best speeches feel like campfire stories. Pull them in, keep them hooked, stick the landing!', tipIcon: '🔥',
  objectives: ['Students identify the 4 parts of a story (setup, problem, action, resolution)','Students use Story Mountain as a planning tool','Students deliver a personal story with rising tension'],
  improvGame: {
    name: 'One-Sentence Story',
    description: 'Build a complete story arc in exactly 4 sentences — one per student!',
    instructions: [
      'Groups of 4. Person 1: "Once there was a [character] who [wanted something]."',
      'Person 2: "But then [problem happened]."',
      'Person 3: "[Character] tried to fix it by [action]."',
      'Person 4: "In the end [resolution]."',
      'Share the best stories with the class. Applaud complete arcs!',
    ],
  },
  prompt: 'Tell us about a time something went wrong — and how you fixed it (or didn\'t!).',
  timeLimit: 90, structure: ['🎣 Hook (start in the MIDDLE of the action!)','🌄 Setup — who, where, when','⚡ The problem ("But then...")','💪 What happened next','🏁 How it ended + what you learned'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'One-Sentence Story',
      steps:[
        {time:'0:00',action:'"Today we tell STORIES. Stories are speeches in disguise." Show Story Mountain card.'},
        {time:'1:30',action:'One-Sentence Story in groups of 4. Give 90 seconds, then each group shares.'},
        {time:'6:00',action:'Reveal Story Mountain: Setup → Rising Action → Peak → Resolution.'},
        {time:'7:30',action:'Students identify their "peak" moment — the thing that went most wrong.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Something Went Wrong Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: NARRATIVE. "A narrative is a story with a spine — something changes."'},
        {time:'9:30',action:'Model your own "something went wrong" story using Story Mountain. Point to each stage.'},
        {time:'12:00',action:'Prep: students fill in Story Mountain sketch (4 boxes). Hook = start in the action.'},
        {time:'14:30',action:'Speeches begin. After each: "Where was the peak moment? Did you feel the tension?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Story Mountain Check',
      steps:[
        {time:'52:00',action:'"What are the 4 parts of a story?" Class responds: Setup / Problem / Action / Resolution.'},
        {time:'54:00',action:'Star of Day: best tension-builder (most suspenseful story).'},
        {time:'56:00',action:'Preview: "Next week: HUMOROUS SPEECH — making people laugh on purpose!"'},
        {time:'57:30',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Story Mountain',emoji:'⛰️',use:'Planning template during prep — 4 stages: Setup/Problem/Action/Resolution'},
    {name:'Hook Types Card',emoji:'🎣',use:'Remind: Tiny Story hook works especially well for storytelling speeches'},
  ],
},
{
  title: 'SpeakUp! Week 10 — Humorous Speech', pillar: 'Voice',
  weekWord: 'Timing', weekWordDef: 'knowing exactly when to speak — and when to pause — for maximum effect',
  tip: 'The secret to a laugh: say the funny thing, then PAUSE and let the audience catch up!', tipIcon: '😂',
  objectives: ['Students understand the Rule of Three for comedy','Students practise the pause-after-punchline technique','Students deliver one joke or funny story with intentional timing'],
  improvGame: {
    name: 'Comedian\'s Pause',
    description: 'Teacher tells a joke wrong (no pause) then right (with pause). Class votes on what changed!',
    instructions: [
      'Tell the same joke twice: Version A (no pause after punchline), Version B (3-second pause).', 
      'Class votes: which made them laugh more? Why?',
      'Introduce Rule of Three in comedy: "1, 2… and the unexpected 3rd."',
      'Students try: "I packed my bag with: shoes, sandwiches, and a live crocodile."',
      'Practice round: each student finishes "I brought: ___, ___, and ___" with a surprise 3rd.',
    ],
  },
  prompt: 'Tell us about the funniest thing that has ever happened to you (real or imaginary!).',
  timeLimit: 90, structure: ['🎣 Hook (make them smile immediately)','😄 Set the scene ("So there I was...")','😬 The problem or surprise ("And then suddenly...")','😂 The funniest moment — PAUSE after','🏁 Big Finish with a callback to the opening'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Comedian\'s Pause',
      steps:[
        {time:'0:00',action:'"VOICE pillar: today\'s focus is TIMING. Comedy is 50% what you say and 50% when you say it."'},
        {time:'1:30',action:'Run Comedian\'s Pause — exaggerate the difference between V1 and V2.'},
        {time:'4:00',action:'Rule of Three: students try 3 examples with silly surprise 3rd items.'},
        {time:'7:00',action:'"Today your ONLY job is to make someone smile. Laughs are a bonus!"'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Funniest Moment Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: TIMING. "Silence is the funniest sound in comedy."'},
        {time:'9:30',action:'Model a funny story. After the punchline: slow, deliberate 3-second pause. Grin.'},
        {time:'13:00',action:'Prep: students pick their story. Mark the pause point with a star in their notes.'},
        {time:'15:00',action:'Speeches begin. Audience: no laughing suppression — genuine reactions only!'},
        {time:'16:30',action:'After each: "Where did you pause? Did it work? What was the funniest word?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Best Pause Award',
      steps:[
        {time:'52:00',action:'Class votes: who had the best comedic pause today?'},
        {time:'53:30',action:'That student re-delivers just their punchline moment with the pause.'},
        {time:'55:00',action:'Preview: "Next week: THE BIG FINISH — how to end your speech memorably."'},
        {time:'57:30',action:'Closing: do the send-off — but pause for 2 seconds before "SPEAKER!" for laughs.'},
      ]},
  ],
  pictureCards:[
    {name:'Pause Power Card',emoji:'⏸️',use:'Hold up to cue students to pause after their punchline — silent coaching'},
    {name:'Rule of Three',emoji:'3️⃣',use:'Show during warm-up and reference for students building their funny moments'},
  ],
},
{
  title: 'SpeakUp! Week 11 — The Big Finish', pillar: 'Mind',
  weekWord: 'Conclusion', weekWordDef: 'the final part of your speech — the last thing your audience remembers',
  tip: 'End with energy. The last thing you say is the thing they remember. Make it COUNT!', tipIcon: '🏁',
  objectives: ['Students understand the 3 parts of a G1-2 conclusion: echo hook, restate the topic, lasting impression','Students avoid weak endings ("that\'s all", "the end", trailing off")','Students practise delivering their final line with maximum impact'],
  improvGame: {
    name: 'Stuck Landing',
    description: 'Students practise ending on their feet — hands down, chin up, hold the silence!',
    instructions: [
      'Students take turns saying one sentence ending a speech (any topic).',
      'Rule: after the last word, FREEZE. Hands at sides. Count to 3 silently.',
      'No fidgeting. No "um that\'s all." Just land it and own the silence.',
      'Audience claps only after the speaker unfreezes.',
      'Try 2-3 rounds each until the landing feels powerful.',
    ],
  },
  prompt: 'If you could add one new subject to school, what would it be?',
  timeLimit: 90, structure: ['🎣 Hook','📌 Your new subject ("I would add...")','💡 Why we need it ("We need it because...")','🌍 How it would help ("Students would...")','🏁 BIG FINISH: echo your hook + one lasting thought'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Stuck Landing',
      steps:[
        {time:'0:00',action:'"MIND pillar. Last piece of structure: THE BIG FINISH. Strong endings change minds."'},
        {time:'1:30',action:'Run Stuck Landing — everyone tries 2 rounds. Teacher models the freeze first.'},
        {time:'5:00',action:'Show the 3-part conclusion on board: Echo Hook / Restate Topic / Lasting Impression.'},
        {time:'7:00',action:'Students write their Big Finish sentence for today\'s prompt before speeches start.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'New Subject Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: CONCLUSION. "A weak ending wastes a great speech. Don\'t do it."'},
        {time:'9:30',action:'Demo: give a speech with 3 different endings — weak/medium/strong. Class rates each.'},
        {time:'13:00',action:'Prep: students focus on writing their final line. Read it to a partner first.'},
        {time:'15:00',action:'Speeches begin. After each: "How strong was the landing? Scale of 1-5."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Ending Wall',
      steps:[
        {time:'52:00',action:'3 students read only their final line. Class rates the impact.'},
        {time:'54:00',action:'Star of Day: best Big Finish.'},
        {time:'56:00',action:'Preview: "Next week: FULL SPEECH — hook, three things, big finish all together!"'},
        {time:'57:30',action:'Closing ritual — everyone delivers the send-off line as their own Big Finish.'},
      ]},
  ],
  pictureCards:[
    {name:'Three-Part Train',emoji:'🚂',use:'Point to caboose (Big Finish car) — "the ending is as important as the engine"'},
    {name:'Conclusion Checklist',emoji:'🏁',use:'3-box card: Echo Hook ✓ / Restate Topic ✓ / Lasting Impression ✓'},
  ],
},
{
  title: 'SpeakUp! Week 12 — Putting It All Together', pillar: 'All',
  weekWord: 'Polish', weekWordDef: 'making something as smooth and perfect as it can be',
  tip: 'A speech is like a sandwich — every layer matters. Don\'t forget the hook (bread) or the finish (bread)!', tipIcon: '✨',
  objectives: ['Students deliver a complete Hook → 3 Things → Big Finish speech','Students give structured feedback using the one-star/one-wish model','Students identify their personal speaking strengths and one growth area'],
  improvGame: {
    name: 'Speech Sandwich',
    description: 'Students build their speech structure using the sandwich metaphor — visual and memorable!',
    instructions: [
      'Draw a sandwich on the board: top bread = Hook, fillings = 3 Things, bottom bread = Big Finish.',
      '"Without the top bread your speech falls apart. Without the bottom it\'s not a sandwich."',
      'Students air-draw their own sandwich and label it with their speech topic.',
      'Partner check: "Does your partner have both slices of bread?"',
      'Quick share: 2-3 students say their 5-part plan out loud before prep time.',
    ],
  },
  prompt: 'If you were teacher for a day, what would you do differently?',
  timeLimit: 90, structure: ['🎣 Hook','📌 Thing 1 — first change','📌 Thing 2 — second change','📌 Thing 3 — third change','🏁 Big Finish with echo + lasting thought'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Speech Sandwich',
      steps:[
        {time:'0:00',action:'"Today: ALL THREE PILLARS. This is your first complete speech — hook, 3 things, big finish."'},
        {time:'1:30',action:'Speech Sandwich: draw on board, students label their plan.'},
        {time:'5:00',action:'Partner check. Quick body check: feet/hands/spine/shoulders/chin.'},
        {time:'7:00',action:'Brave Breathing × 1. "You\'ve trained for this. You\'re ready."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Teacher-for-a-Day Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: POLISH. "You know all the moves. Today we put them together beautifully."'},
        {time:'9:30',action:'Quick reminder: hook types, voice level 4, eye contact sweep, gestures, big finish.'},
        {time:'12:00',action:'2-min prep. Students can use their Speech Sandwich sketch.'},
        {time:'14:00',action:'Speeches begin. Feedback: ONE STAR (what worked) + ONE WISH (one thing to try next).'},
        {time:'16:30',action:'Teacher tracks: for each student, note 1 strength and 1 growth area in your notes.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Strength Spotlight',
      steps:[
        {time:'52:00',action:'"Tell me one thing YOU did well today. Not your neighbour — YOU." Go around the circle.'},
        {time:'55:00',action:'Preview: "Next week: INFORMATIVE vs. PERSUASIVE — the two main types of speeches."'},
        {time:'57:00',action:'"In 3 weeks: SHOWCASE. You\'ll perform for a real audience. Start thinking about your topic."'},
        {time:'58:30',action:'Closing ritual — loudest send-off yet.'},
      ]},
  ],
  pictureCards:[
    {name:'Speech Sandwich',emoji:'🥪',use:'Planning tool during prep — top/fillings/bottom = Hook/3 Things/Big Finish'},
    {name:'Voice Dial',emoji:'🎚️',use:'Reminder: level 4 for full speech'},
    {name:'Body Check Card',emoji:'🧍',use:'Full body check before each speaker steps up'},
    {name:'Three-Part Train',emoji:'🚂',use:'Audience tracks which cars the speaker completes'},
  ],
},
]
SESSIONS_G12.push(...G12_W9_12)
// ── WEEKS 13-16 G1-2 ─────────────────────────────────────────────────────────
const G12_W13_16 = [
{
  title: 'SpeakUp! Week 13 — Inform or Persuade?', pillar: 'Mind',
  weekWord: 'Purpose', weekWordDef: 'the reason you are giving a speech — to inform, to persuade, or to entertain',
  tip: 'Before every speech, ask yourself: am I teaching, convincing, or entertaining? Different goal = different speech!', tipIcon: '🎯',
  objectives: ['Students distinguish informative (teaches facts) from persuasive (changes minds) speeches','Students practise the same topic two ways — first as a fact, then as an argument','Students choose the right purpose for their showcase speech'],
  improvGame: {
    name: 'Same Topic, Two Speeches',
    description: 'One topic, two completely different speeches — the purpose changes everything!',
    instructions: [
      'Topic: DOGS. Teacher gives 30 seconds informative: "Dogs have 300 million smell receptors..."',
      'Then 30 seconds persuasive: "You NEED a dog. Here\'s why your life is incomplete without one."',
      'Class identifies: which words, tone, and gestures changed?',
      'Students try with topic PIZZA: 20 seconds informative, then 20 seconds persuasive.',
      'Class votes: which type is harder? Which is more fun?',
    ],
  },
  prompt: 'Pick one topic you know a lot about. Give an informative mini-speech, then a persuasive one!',
  timeLimit: 60, structure: ['🎣 Hook (different for each type!)','INFORMATIVE: fact 1, fact 2, fact 3, big finish','PERSUASIVE: reason 1, reason 2, call to action, big finish'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Same Topic, Two Speeches',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: WHY are you giving a speech? Your purpose shapes everything."'},
        {time:'1:30',action:'Run Same Topic Two Speeches with DOGS. Students identify the differences.'},
        {time:'5:00',action:'Students try with PIZZA in pairs.'},
        {time:'7:00',action:'Post two columns on board: INFORM (teaches) vs. PERSUADE (convinces). Examples in each.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Inform then Persuade',
      steps:[
        {time:'8:00',action:'Word of Day: PURPOSE. "Without a purpose your speech goes nowhere."'},
        {time:'9:30',action:'Each student picks their topic and does TWO 60-second speeches: inform first, then persuade.'},
        {time:'13:00',action:'Audience votes after each pair: "Which type suited this topic better?"'},
        {time:'14:00',action:'Speeches begin. Focus: does the language match the purpose?'},
        {time:'44:00',action:'Halfway check-in: "Is anyone planning a persuasive showcase speech? An informative one?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Purpose Declaration',
      steps:[
        {time:'52:00',action:'"What\'s the difference between inform and persuade?" Quick pairs share.'},
        {time:'54:00',action:'Each student says: "My showcase speech will be [INFORM / PERSUADE] about ___."'},
        {time:'56:00',action:'Preview: "Next week: REVIEW — we sharpen every skill. Then SHOWCASE!"'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Inform vs. Persuade Card',emoji:'🎯',use:'Two-column reference — post on wall so students check purpose before speaking'},
    {name:'Hook Types Card',emoji:'🎣',use:'Different hook types suit different purposes — discuss which works for each'},
  ],
},
{
  title: 'SpeakUp! Week 14 — Review & Polish', pillar: 'All',
  weekWord: 'Rehearsal', weekWordDef: 'practising your speech many times so it sounds natural and confident',
  tip: 'A speech isn\'t written — it\'s rehearsed. The more you practise, the more it sounds like YOU!', tipIcon: '🔁',
  objectives: ['Students rehearse their showcase speech with a partner','Students give specific feedback using the Feedback Sandwich','Students identify exactly what they will improve before showcase day'],
  improvGame: {
    name: 'Feedback Sandwich',
    description: 'Bread (compliment) → Filling (suggestion) → Bread (encouragement) — every time!',
    instructions: [
      'Model a bad feedback example: "It was OK but you talked too fast and forgot your hook."',
      'Model a Feedback Sandwich: "You had great eye contact [bread]! Next time, try slowing down for your hook [filling]. I can\'t wait to see it on showcase day [bread]!"',
      'Pairs practice: one student gives 1-min speech, partner gives Feedback Sandwich.',
      'Switch. Teacher circulates to ensure feedback is specific and kind.',
      'Class shares: what\'s the hardest part of giving good feedback?',
    ],
  },
  prompt: 'Deliver your showcase speech (or a version of it). This is your rehearsal!',
  timeLimit: 120, structure: ['🎣 Your Hook (strongest version)','📌 Three Things (in order)','🏁 Big Finish (echo hook + lasting thought)'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Feedback Sandwich',
      steps:[
        {time:'0:00',action:'"Today is REHEARSAL day. Showcase is in 2 weeks. Every second counts."'},
        {time:'1:30',action:'Teach Feedback Sandwich. Model both bad feedback and the sandwich version.'},
        {time:'5:00',action:'Pairs: 1-min practice speech + Feedback Sandwich. Switch.'},
        {time:'7:30',action:'Collect 2-3 pieces of sandwich feedback to share — normalise giving AND receiving feedback.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase Rehearsal',
      steps:[
        {time:'8:00',action:'Word of Day: REHEARSAL. "Professionals rehearse. Today you are professionals."'},
        {time:'9:00',action:'Each student will deliver their showcase speech. Time them — showcase speeches should be 60-90 sec.'},
        {time:'11:00',action:'After each: Feedback Sandwich from one peer + one from teacher. Keep it specific.'},
        {time:'14:00',action:'Students write down the ONE thing they will fix before showcase day.'},
        {time:'48:00',action:'Optional second round: students who want another go can repeat.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Showcase Countdown',
      steps:[
        {time:'52:00',action:'"Showcase is in 2 weeks. Say your topic out loud." Go around the circle.'},
        {time:'54:00',action:'Each student states their ONE improvement goal.'},
        {time:'56:00',action:'"Practise at home. Say it in the mirror. Say it to your family."'},
        {time:'58:00',action:'Most energetic closing ritual yet — building excitement for showcase.'},
      ]},
  ],
  pictureCards:[
    {name:'Feedback Sandwich',emoji:'🥪',use:'Two-sided card: bad feedback example vs. sandwich formula — use during pair work'},
    {name:'Showcase Checklist',emoji:'✅',use:'Hook ✓ / Three Things ✓ / Eye Contact ✓ / Volume ✓ / Big Finish ✓'},
  ],
},
{
  title: 'SpeakUp! Week 15 — Showcase Part 1 🎉', pillar: 'All',
  weekWord: 'Performance', weekWordDef: 'sharing your speech with a real audience who came just to hear you',
  tip: 'This is the moment you have been building toward. You are ready. Walk up, breathe, begin.', tipIcon: '🎤',
  objectives: ['First group delivers their showcase speeches to a real audience','Students practise the Pre-Speech Ritual before performing','Audience members give one-star compliments'],
  improvGame: {
    name: 'Pre-Speech Ritual',
    description: 'Every speaker completes the same 4-step ritual before stepping to the front!',
    instructions: [
      'Step 1: Take one Brave Breath (in 4 / hold 4 / out 6).',
      'Step 2: Power Pose — 5 seconds.',
      'Step 3: Say inside your head: "I know my speech. I am ready."',
      'Step 4: Walk to the front, pause, make eye contact with 3 people, BEGIN.',
      'Practise the ritual together as a class before the first speaker goes.',
    ],
  },
  prompt: 'Deliver your showcase speech.',
  timeLimit: 120, structure: ['🎣 Hook','📌 Thing 1','📌 Thing 2','📌 Thing 3','🏁 Big Finish'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Pre-Speech Ritual + Room Setup',
      steps:[
        {time:'0:00',action:'Set up chairs in rows or arc facing the speaking spot. Audience seats at the front.'},
        {time:'2:00',action:'Teach/review Pre-Speech Ritual. Class does it all together.'},
        {time:'5:00',action:'Introduce MC role (a student). Give them the intro template: "[Name] is in [grade] and will be speaking about [topic]."'},
        {time:'7:00',action:'"Today is real. Audience is real. Your speeches are real. Let\'s go."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase Speeches — Group 1',
      steps:[
        {time:'8:00',action:'MC introduces Speaker 1. Speaker does Pre-Speech Ritual silently, then steps up.'},
        {time:'9:30',action:'After each speech: ONE star compliment from a classmate ("I really liked when you...")'},
        {time:'10:30',action:'Continue. Pace: ~3-4 min per speaker (speech + intro + compliment).'},
        {time:'48:00',action:'Roughly half the class should present today. Stop at a natural break.'},
        {time:'50:00',action:'Standing ovation for all speakers who presented today.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Celebration + Preview',
      steps:[
        {time:'52:00',action:'Ask audience: "What was your favourite moment from today\'s speeches?"'},
        {time:'54:00',action:'To speakers who haven\'t gone yet: "Next week is YOUR day. Keep practising."'},
        {time:'56:00',action:'"Speakers who went today — how do you feel NOW vs. before you started?"'},
        {time:'58:00',action:'Closing ritual — whole class celebrates together.'},
      ]},
  ],
  pictureCards:[
    {name:'Pre-Speech Ritual Card',emoji:'🌬️',use:'Post at the front — each speaker checks off 4 steps before walking up'},
    {name:'Showcase Checklist',emoji:'✅',use:'Audience uses this to notice skills during each speech'},
  ],
},
{
  title: 'SpeakUp! Week 16 — Showcase Part 2 + Celebration 🏆', pillar: 'All',
  weekWord: 'Growth', weekWordDef: 'how much you have changed and improved from where you started',
  tip: 'In Week 1 you introduced yourself nervously. Today you are a certified speaker. Look how far you\'ve come!', tipIcon: '🏆',
  objectives: ['Remaining students deliver their showcase speeches','Whole class reflects on semester-long growth','Students celebrate and receive their Certified SpeakUp Speaker certificates'],
  improvGame: {
    name: 'Growth Arc Reflection',
    description: 'Students finish the sentence: "In Week 1 I could not... but now I can..."',
    instructions: [
      'Give students 1 minute to think quietly.',
      '"Finish this sentence: In Week 1 I could not ___, but now I can ___."',
      'Go around the circle — every student shares.',
      'Teacher notes specific skill growth for each student.',
      '"That change? That\'s called GROWTH. And YOU did it."',
    ],
  },
  prompt: 'Deliver your showcase speech.',
  timeLimit: 120, structure: ['🎣 Hook','📌 Thing 1','📌 Thing 2','📌 Thing 3','🏁 Big Finish'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Pre-Speech Ritual + Final Celebration Setup',
      steps:[
        {time:'0:00',action:'Set up room as showcase space again. Certificates ready (hidden for now).'},
        {time:'2:00',action:'Class Pre-Speech Ritual together. "One more time — all together."'},
        {time:'5:00',action:'New MC for today. Brief them on intro template.'},
        {time:'7:00',action:'"Today we finish what we started 16 weeks ago. Let\'s go out with a BANG."'},
      ]},
    { startMin:8, endMin:44, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase Speeches — Group 2',
      steps:[
        {time:'8:00',action:'Remaining speakers present. Same format: MC intro → Pre-Speech Ritual → speech → one-star compliment.'},
        {time:'42:00',action:'Final speaker finishes. Standing ovation — both groups together.'},
        {time:'43:00',action:'"We just heard ALL of you speak. From the very first time to right now — you are different people."'},
      ]},
    { startMin:44, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Growth Arc + Certificates',
      steps:[
        {time:'44:00',action:'Growth Arc Reflection: every student finishes "In Week 1 I could not... but now I can..."'},
        {time:'52:00',action:'Teacher reads 2-3 remarkable growth arcs aloud (with permission). Celebrate publicly.'},
        {time:'54:00',action:'Certificate ceremony: call each student by name. "Certified SpeakUp Speaker — Grades 1-2, Fall 2026."'},
        {time:'57:00',action:'Class photo at the speaking spot. "You are speakers. Remember this feeling."'},
        {time:'59:00',action:'Final closing ritual — loudest of the semester. "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Pre-Speech Ritual Card',emoji:'🌬️',use:'Same as last week — keep the ritual consistent'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Reference in closing: "You mastered all three — Voice, Body, Mind"'},
  ],
},
]
SESSIONS_G12.push(...G12_W13_16)
// ══════════════════════════════════════════════════════════════
// G3-4 SESSIONS
// ══════════════════════════════════════════════════════════════
const SESSIONS_G34 = [
{
  title: 'SpeakUp! Week 1 — What Makes a Great Speaker?', pillar: 'All',
  weekWord: 'Rhetoric', weekWordDef: 'the art of using language effectively to communicate and persuade',
  tip: 'Great speakers are made, not born. Every technique you learn this semester is a tool you will keep forever.', tipIcon: '🛠️',
  objectives: ['Students articulate what separates effective from ineffective speakers','Students experience the Three Pillars framework firsthand','Students set one personal speaking goal for the semester'],
  improvGame: {
    name: 'Impromptu Introduction',
    description: '30-second off-the-cuff self-introduction — no prep, full effort!',
    instructions: [
      'No preparation. Each student has 30 seconds to introduce themselves to the class.',
      'Must include: name, one fact about themselves, one goal for this class.',
      'Teacher times strictly. Applause after each.',
      'Debrief: who surprised you? What techniques did you already notice?',
      'This is baseline — save a mental snapshot. We will do this again on the last day.',
    ],
  },
  prompt: 'Who is the best communicator you know personally, and what makes them so effective?',
  timeLimit: 90, structure: ['🎣 Hook','👤 Who the person is ("I\'d nominate... because...")','🌟 What they do with VOICE that works','💪 What they do with BODY that works','🧠 What they do with MIND / preparation that works','🏁 Conclusion: what you will take from them this semester'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Impromptu Introductions',
      steps:[
        {time:'0:00',action:'Don\'t do housekeeping first. Walk to the front, make eye contact, and wait for silence. When you have it: "Welcome to SpeakUp. I\'m not going to judge how good you are today — I want to see where you\'re starting from. By December, we\'ll do this exact exercise again and see the difference." Keep your energy high and warm, not nervous.'},
        {time:'1:00',action:'Run Impromptu Introductions. No prep, no notes. Each student has 30 seconds: name, one fact about themselves, one goal for this class. Go first yourself — give a genuine intro including a real goal ("My goal is to make sure every one of you feels confident walking into any room"). Then immediately pass to a student. Timer starts when they begin speaking. Start it strict from day one. Applause after each.'},
        {time:'6:00',action:'After everyone has spoken, hold up three fingers. "What you just did uses one or more of three skills: VOICE, BODY, MIND." Name each pillar and point to the Three Pillars Poster. "Which do you think is hardest to master?" Quick show of hands for each — note the spread. Most will vote MIND or BODY.'},
        {time:'7:30',action:'"By the end of this semester you will have worked on all three. Today is your starting line. Let\'s build from right here."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Great Communicator Speeches',
      steps:[
        {time:'8:00',action:'Write RHETORIC on the board. "Word of the Day: RHETORIC — the art of using language effectively. Aristotle identified the core techniques in ancient Greece, roughly 2,400 years ago. The fact that they still work tells you how fundamental they are." Ask: "What makes someone genuinely effective at communicating — not just loud, but effective?" Take 3 responses. "Hold those ideas while you listen to each other today."'},
        {time:'9:30',action:'Model the speech structure. Point to the structure on the board as you work through each section: hook → who this person is → what they do with Voice → with Body → with Mind → what you\'ll take from them. Give a genuine 90-second version about a real communicator you admire. Then pause: "Notice I started with a sentence that wasn\'t my name — that\'s a hook. We\'ll go deep on hooks in Week 4. For now, just try to open with something that isn\'t \'My person is....\'"'},
        {time:'12:00',action:'5-minute prep. Students can use notes — "Write key words, not full sentences. Notes are a safety net, not a script." Walk around. If someone is writing out every word, prompt: "What are the three most important things you want us to know about this person?"'},
        {time:'17:00',action:'Speeches begin. After each, ask one classmate: "Name one specific technique you noticed — something about their Voice, Body, or Mind." The first few times, model the language: "I noticed she slowed down on the key point — that\'s deliberate pace." Push students toward specifics, not just "I liked it."'},
        {time:'20:00',action:'While each student speaks, keep a quick tracking list on paper: student name + their natural standout strength. Categories to look for: Voice (volume, pace, expression) · Body (eye contact, posture, gestures) · Mind (structure, hook attempt, conviction). You\'ll use this in coming weeks to give targeted individual feedback. Don\'t share it today — just build the picture.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Goal Setting',
      steps:[
        {time:'52:00',action:'"Take two minutes — write one speaking goal for this semester. Something specific: not \'get better at speaking\' but \'stop saying um\' or \'make eye contact with the back row\' or \'write a hook that earns attention.\' One concrete thing. By December you\'ll prove it\'s done."'},
        {time:'54:00',action:'Ask 3-4 students to share their goal. After each, affirm it specifically — not just "great goal" but something that shows you heard it. Example: "\'Stop rushing\' — that\'s going to change how people receive your ideas. I\'ll be watching for that all semester." This signals that you\'re paying attention to them individually.'},
        {time:'56:00',action:'"Next week: VOICE MASTERY. Volume, pace, clarity, expression — four separate skills. Your voice is your instrument. We\'re going to tune it."'},
        {time:'58:00',action:'Closing. "Repeat after me: I AM A SPEAKER." Pause, then: "And this semester — I\'ll prove it." Have them say the second line themselves, without you leading it.'},
      ]},
  ],
  pictureCards:[
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Post permanently in room for the semester — Voice/Body/Mind framework'},
    {name:'Feeling Faces',emoji:'😊',use:'Use during warm-up debrief to name how impromptu speaking felt'},
  ],
},
{
  title: 'SpeakUp! Week 2 — Voice Mastery', pillar: 'Voice',
  weekWord: 'Articulation', weekWordDef: 'forming words clearly and precisely so every syllable is heard',
  tip: 'Volume gets them to listen. Pace keeps them with you. Clarity makes them understand. Expression makes them FEEL it.', tipIcon: '🎙️',
  objectives: ['Students practise all 4 voice dimensions: volume, pace, clarity, expression','Students identify which dimension is their personal weakness','Students deliver a speech with deliberate voice variation'],
  improvGame: {
    name: 'Voice Dimension Drill',
    description: '4-station vocal workout — each dimension gets 90 seconds of dedicated focus!',
    instructions: [
      'VOLUME: say "Good morning, everyone!" at 5 different levels. Class rates each.',
      'PACE: read 2 sentences fast as possible. Then same 2 sentences very slowly. Which was clearer?',
      'CLARITY: tongue twister round — "red lorry yellow lorry" × 5. Speed up each round.',
      'EXPRESSION: say "Really?" in 6 emotions: curious, sarcastic, delighted, terrified, bored, in love.',
      'Debrief: which dimension felt weakest? That\'s your target for today.',
    ],
  },
  prompt: 'What is the most important invention of the last 100 years? Make your case!',
  timeLimit: 90, structure: ['🎣 Hook (a bold claim or surprising stat)','💡 Your invention ("I argue that...")','📊 Evidence 1 with vocal variation (slow down for key facts)','📊 Evidence 2 (pause before your strongest point)','🔥 Evidence 3 (build to maximum expression)','🏁 Conclusion — restate with full vocal power'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Voice Dimension Drill',
      steps:[
        {time:'0:00',action:'Write four words on the board: VOLUME · PACE · CLARITY · EXPRESSION. "Your voice has four separate dials. Today we train each one. Write these down — V, P, C, E. By the end of today you\'ll know which is your weakest."'},
        {time:'1:00',action:'Run all 4 stations back to back, about 90 seconds each. VOLUME: "Say \'Good morning, everyone!\' at levels 1, 3, and 5." Call each level. Class rates with fingers. PACE: Write two sentences on the board. Read them as fast as possible, then as slowly as possible. Ask: "Which was clearer? Why?" CLARITY: Tongue twister round — "Red lorry, yellow lorry" five times, getting faster each round. If anyone nails it cleanly at full speed, have them lead the class. EXPRESSION: "Say the word \'Really?\' in these six emotions — curious, sarcastic, delighted, terrified, bored, in love." Go around the room quickly, one student per emotion.'},
        {time:'7:00',action:'"Out of those four — which felt weakest to you? Write it on the corner of your paper or a sticky note. V, P, C, or E. That\'s your personal target for today\'s speech." Take 3-4 students to share their weakest. Most will say Pace or Clarity.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Greatest Invention Speeches',
      steps:[
        {time:'8:00',action:'Write ARTICULATION on the board. "Word of the Day: ARTICULATION — forming words so precisely that every syllable lands, even in the back row." Demo the difference: say "The greatest invention of the last hundred years is probably the internet because..." in a muddled, rushed way. Then say the exact same sentence with clear articulation and deliberate pace. Ask: "Same words. What changed?" (Pace + clarity.)'},
        {time:'9:30',action:'Give a model speech about your own pick for greatest invention — 90 seconds, real content. As you speak, pause at two deliberate moments and name them aloud: "That was a pace change — I slowed down there because that was the key fact." "And that was expression — I raised my energy because that point matters most to me." Being explicit trains students to listen for the same moments in each other.'},
        {time:'12:00',action:'Prep: 3 minutes. "Mark your notes with V, P, or E at the moments you plan to shift dimension. At least one of each." Walk around. If a student has no markings, stop and prompt: "Where\'s your most important fact? That\'s where you slow down and get louder. Mark it."'},
        {time:'15:00',action:'Speeches begin. Tell the audience before the first speaker: "Raise your hand when you notice a deliberate voice change — any dimension." After 2-3 speeches, ask: "What are you noticing?" This keeps the audience actively listening and builds their vocabulary for the feedback phase.'},
        {time:'17:00',action:'Feedback after each speech: "Name the one voice dimension that was strongest — and be specific. Not \'their voice was good\' but \'their pace slowed down right before the main point\' or \'their expression changed when they described the impact.\'" Push for observation, not evaluation.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Voice Audit',
      steps:[
        {time:'52:00',action:'"Quick self-audit. On your paper — write V, P, C, E and rate yourself 1-5 on each dimension today. Honest scores." Give 90 seconds. Then: "Hands up if you gave yourself a 5 on any dimension?" (Expect few hands.) "Good. A 5 means mastered. That\'s why we have 16 weeks."'},
        {time:'55:00',action:'Star of Day: the student with the most dynamic vocal range — someone who visibly shifted between dimensions during their speech. Name the specific moment you noticed: "I\'m choosing [name] because at 1:05 they slowed right down and the whole room leaned in."'},
        {time:'56:30',action:'"Next week: BODY LANGUAGE. The non-verbal half of your message — and for many people, the harder half to control."'},
        {time:'58:00',action:'Closing ritual — do it three ways in a row. First: say "I AM A SPEAKER!" as a quiet, slow murmur. Then: full volume and expression. Then: crisp, articulated, every syllable. "Three dimensions in one sentence. That\'s what we\'re building toward."'},
      ]},
  ],
  pictureCards:[
    {name:'Voice Dial',emoji:'🎚️',use:'Extended version: 4 dials (volume/pace/clarity/expression) — keep visible all session'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to VOICE pillar throughout'},
  ],
},
{
  title: 'SpeakUp! Week 3 — Body Language Mastery', pillar: 'Body',
  weekWord: 'Presence', weekWordDef: 'the feeling that someone owns the space they are standing in',
  tip: 'Presence isn\'t confidence — it\'s controlled stillness. Stop moving unless the movement means something.', tipIcon: '🧍',
  objectives: ['Students distinguish purposeful movement from nervous movement','Students practise the 5-point body check and hold it for 90 seconds','Students use gestures that reinforce — not distract from — their content'],
  improvGame: {
    name: 'Mirror Master',
    description: 'Pairs mirror each other\'s body language in real time — reveals unconscious habits instantly!',
    instructions: [
      'Pairs face each other. Person A is the leader, B mirrors exactly.',
      'A moves slowly — gestures, posture shifts, expressions. B follows.',
      'Switch after 60 seconds.',
      'Round 2: both try to achieve "commanding presence" — tall, still, deliberate.',
      'Debrief: what habits did you notice in your partner? In yourself?',
    ],
  },
  prompt: 'Teach us something — a skill, a fact, a process. Be the expert for 90 seconds.',
  timeLimit: 90, structure: ['🎣 Hook — step into position BEFORE speaking','📌 Point 1 — use a gesture','📌 Point 2 — change location intentionally','📌 Point 3 — hold eye contact for 3 seconds somewhere','🏁 Conclusion — return to centre, hold the silence'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Mirror Master',
      steps:[
        {time:'0:00',action:'"BODY pillar. 55% of your message is non-verbal. Today you own your space."'},
        {time:'1:30',action:'Mirror Master pairs. 60 seconds each direction.'},
        {time:'5:00',action:'"Commanding Presence" round: pairs achieve stillness + authority together.'},
        {time:'7:00',action:'Introduce 5-point body check + 3 rules: no swaying, no hiding hands, no pacing without purpose.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Expert Teaching Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: PRESENCE. "It\'s not how you feel inside. It\'s how you choose to stand."'},
        {time:'9:30',action:'Demo: give 30-sec speech with nervous body language, then redo with full presence. Ask which they trust.'},
        {time:'13:00',action:'Prep: students plan 2 deliberate gestures and 1 movement for their speech.'},
        {time:'15:00',action:'Speeches begin. Audience watches for: (1) deliberate gesture, (2) unnecessary movement.'},
        {time:'17:00',action:'Feedback: name one purposeful gesture + one nervous habit to eliminate.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Presence Check',
      steps:[
        {time:'52:00',action:'3 students stand in front — hold Power Pose for 15 seconds. Class rates presence 1-5.'},
        {time:'54:30',action:'Star of Day: most deliberate, controlled body language.'},
        {time:'56:00',action:'Preview: "Next week: THE HOOK — the sentence that determines whether anyone listens at all."'},
        {time:'58:00',action:'Closing: everyone Power Poses for 5 seconds before the send-off.'},
      ]},
  ],
  pictureCards:[
    {name:'Body Check Card',emoji:'🧍',use:'5-point check — hold up before each speaker: feet/hands/spine/shoulders/chin'},
    {name:'Gesture Bank',emoji:'🤲',use:'Reference for deliberate gesture planning during prep time'},
    {name:'Body Language Bingo',emoji:'🎯',use:'Audience tracks body skills observed during each speech'},
  ],
},
{
  title: 'SpeakUp! Week 4 — The Hook', pillar: 'Voice',
  weekWord: 'Attention', weekWordDef: 'the focused mental energy an audience gives to a speaker — earn it, then keep it',
  tip: 'You have 7 seconds before the audience decides whether to listen or drift. Your hook is those 7 seconds.', tipIcon: '🎣',
  objectives: ['Students master all 3 Hook types at Grade 3-4 level (question, wow fact, tiny story)','Students craft and workshop a hook before their speech','Students evaluate hooks on clarity, energy, and relevance'],
  improvGame: {
    name: 'Hook Workshop',
    description: 'Students write a hook for a random topic in 60 seconds, then workshop it with the group!',
    instructions: [
      'Give a random topic: PLASTIC WASTE. Students have 60 seconds to write ONE hook sentence.',
      'Read hooks aloud (anonymous or named). Class rates each: 1-5 for "grabs attention."',
      'Workshop the weakest hook together — how can we make it stronger?',
      'Round 2: new topic (SLEEP). 45 seconds. Read and rate.',
      'Pattern: strong hooks are either surprising, personal, or challenge what the audience thinks they know.',
    ],
  },
  prompt: 'What is the biggest problem facing your generation? Convince us it matters.',
  timeLimit: 90, structure: ['🎣 Hook — must be your BEST sentence of the day','📌 The problem (Your Point)','📊 Evidence/example 1','📊 Evidence/example 2','📊 Evidence/example 3','🏁 Conclusion — echo hook + call to action'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Hook Workshop',
      steps:[
        {time:'0:00',action:'"VOICE pillar. Your first sentence. The one that decides everything."'},
        {time:'1:30',action:'Run Hook Workshop with PLASTIC WASTE and SLEEP. Anonymous reads + ratings.'},
        {time:'6:00',action:'Identify the patterns of strong hooks. Write 3 rules on board.'},
        {time:'7:30',action:'Students draft their hook for today\'s prompt. 45 seconds.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Generation Problem Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: ATTENTION. "Attention is the audience\'s gift to you. Don\'t waste it."'},
        {time:'9:30',action:'Model a full speech. Pause after hook: "Is everyone with me?" Continue.'},
        {time:'13:00',action:'Prep: 4 minutes. Stress: hook first, conclusion second, body last.'},
        {time:'17:00',action:'Speeches begin. After each hook: audience signals (lean in = hooked, sit back = not hooked).'},
        {time:'18:30',action:'Feedback focus: hook critique first. "Did it earn their attention? Why?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Hook Hall of Fame',
      steps:[
        {time:'52:00',action:'Class votes: best hook of the session. Winner says it again — from scratch, maximum energy.'},
        {time:'54:00',action:'Deconstruct the winning hook: which type is it? What makes it work?'},
        {time:'56:00',action:'Preview: "Next week: YOUR POINT + YOUR PLAN — thesis and roadmap."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Hook Types Card',emoji:'🎣',use:'G3-4 version — includes examples of strong hooks at this level for each type'},
    {name:'Attention Meter',emoji:'📊',use:'Audience uses this to rate whether the hook earned their attention'},
  ],
},
{
  title: 'SpeakUp! Week 5 — Your Point & Your Plan', pillar: 'Mind',
  weekWord: 'Thesis', weekWordDef: 'your main argument — the single most important idea your whole speech defends',
  tip: 'Your Point tells them WHAT you believe. Your Plan tells them HOW you\'ll prove it. Both in one breath.', tipIcon: '📌',
  objectives: ['Students write a clear, arguable thesis (Your Point)','Students write a 3-part roadmap (Your Plan) that previews their body paragraphs','Students evaluate whether a thesis is specific enough to be interesting'],
  improvGame: {
    name: 'Thesis or Opinion?',
    description: 'Students sort statements into two piles: vague opinions vs. arguable theses!',
    instructions: [
      'Read each statement. Class votes: VAGUE OPINION or ARGUABLE THESIS?',
      '"Dogs are good pets." (Opinion — why is this vague?)',
      '"School lunch should be free because it improves attendance, focus, and equity." (Thesis!)',
      '"Video games are fun." vs. "Video games develop problem-solving skills that schools should embrace."',
      'Pattern: a thesis is specific, arguable (someone could disagree), and previews the argument.',
      'Students rewrite a vague opinion into a thesis in pairs.',
    ],
  },
  prompt: 'Pick a position: should students have homework? Your Point + Your Plan in one sentence — then prove it.',
  timeLimit: 90, structure: ['🎣 Hook','📌 YOUR POINT ("I argue that...")','📋 YOUR PLAN ("I will prove this by exploring: first ___, then ___, and finally ___")','📊 Support 1','📊 Support 2','📊 Support 3','🏁 Conclusion'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Thesis or Opinion?',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today you learn the most important sentence in formal speaking: YOUR POINT."'},
        {time:'1:30',action:'Run Thesis or Opinion? with 4 statements. Move fast — class reacts physically.'},
        {time:'5:30',action:'Write the formula: "I argue that [position] because [3 reasons]." This is Your Point.'},
        {time:'7:00',action:'"Your Plan is the roadmap: First I will show... then... and finally..." Write on board.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Homework Debate Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: THESIS. "Every formal speech has one. It\'s the spine your whole argument hangs on."'},
        {time:'9:30',action:'Model: write Your Point and Your Plan live on the board, then deliver the speech.'},
        {time:'13:00',action:'Prep: 5 minutes. Students must write their thesis AND roadmap before planning anything else.'},
        {time:'18:00',action:'Speeches begin. After each: class restates "What was their Point?" If they can\'t, it wasn\'t clear.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Point & Plan Check',
      steps:[
        {time:'52:00',action:'"Repeat after me: Your Point tells them WHAT. Your Plan tells them HOW."'},
        {time:'54:00',action:'Star of Day: clearest thesis — audience could repeat it verbatim.'},
        {time:'56:00',action:'Preview: "Next week: PIE — how to build ONE perfect body paragraph."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Point & Plan Card',emoji:'📌',use:'Two-line formula card: "I argue that... / I will prove this by exploring..."'},
    {name:'Thesis Checklist',emoji:'✅',use:'3 questions: Is it specific? Is it arguable? Does it preview 3 points?'},
  ],
},
{
  title: 'SpeakUp! Week 6 — PIE: Build a Body Paragraph', pillar: 'Mind',
  weekWord: 'Evidence', weekWordDef: 'a fact, example, or story that proves your point is true',
  tip: 'Never make a claim without evidence. Never give evidence without explaining what it proves. PIE holds it together.', tipIcon: '🥧',
  objectives: ['Students master the PIE structure: Point, Illustrate, Explain','Students deliver one fully developed body paragraph that stands alone','Students give feedback specifically on the I and E (illustration and explanation)'],
  improvGame: {
    name: 'PIE Builder',
    description: 'Class builds a PIE paragraph together on a random topic — live on the board!',
    instructions: [
      'Topic: SLEEP IS IMPORTANT FOR LEARNING.',
      'P — Point: "One reason sleep is crucial is that it consolidates memory."',
      'I — Illustrate: "For example, studies show students who sleep 8+ hours remember 40% more."',
      'E — Explain: "This means a well-rested student is essentially studying for free every night."',
      'Students create a second PIE paragraph in pairs: same topic, different point.',
      'Share: which paragraph was more convincing? Why?',
    ],
  },
  prompt: 'Prove ONE thing about your generation using PIE. One point, one example, one explanation.',
  timeLimit: 75, structure: ['🎣 Hook','📌 Your Point (thesis)','📋 Your Plan','🥧 ONE PIE paragraph (P → I → E)','🏁 Conclusion'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'PIE Builder',
      steps:[
        {time:'0:00',action:'"MIND pillar. PIE is the engine of every formal speech. Today you build one perfectly."'},
        {time:'1:30',action:'PIE Builder on board for SLEEP topic. Class contributes each layer.'},
        {time:'5:30',action:'Pairs build their own PIE paragraph for the same topic.'},
        {time:'7:00',action:'Share: class votes which pair\'s I and E were strongest.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'One-PIE Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: EVIDENCE. "A claim without evidence is just an opinion. Evidence makes it an argument."'},
        {time:'9:30',action:'Model full speech structure — but zoom in on the PIE paragraph. Deliver it slowly, naming each layer.'},
        {time:'13:00',action:'Prep: 5 minutes. Students focus on making their I and E as strong as possible.'},
        {time:'18:00',action:'Speeches begin. After each: "What was the P? What was the I? What was the E?" Class reconstructs.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'PIE Quality Check',
      steps:[
        {time:'52:00',action:'"Which is harder — finding the I or writing the E?" Quick hands poll + brief discussion.'},
        {time:'54:30',action:'Star of Day: strongest E (explanation) that made the argument click.'},
        {time:'56:00',action:'Preview: "Next week: 3 PIE paragraphs — the full body of a formal speech."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'PIE Card',emoji:'🥧',use:'Keep permanently visible — P=claim, I=example, E=so what? Use after each speaker to reconstruct'},
    {name:'Point & Plan Card',emoji:'📌',use:'Students now have Point + Plan + 1 PIE — show how they connect'},
  ],
},
{
  title: 'SpeakUp! Week 7 — PIE × 3: The Full Body', pillar: 'Mind',
  weekWord: 'Coherence', weekWordDef: 'when all the parts of a speech connect logically and flow naturally from one to the next',
  tip: 'Three PIE paragraphs is not three separate speeches. Use transitions to glue them into one argument.', tipIcon: '🔗',
  objectives: ['Students deliver a speech with 3 fully developed PIE paragraphs','Students use transitions between paragraphs (First/In addition/Most importantly)','Students evaluate whether each paragraph reinforces the thesis'],
  improvGame: {
    name: 'Transition Tournament',
    description: 'Students compete to deliver the smoothest transition sentence connecting two ideas!',
    instructions: [
      'Give two random ideas. Student A: "Dogs are loyal." Student B: must transition naturally to "exercise is important."',
      'Examples: "But loyalty isn\'t the only thing that matters..." / "Building on this idea..."',
      'Class rates each transition 1-5 for smoothness.',
      'Round 2: same game but transitions must include signal words: "Furthermore, However, Most importantly, In contrast."',
      'Debrief: which signal words are overused? Which are most powerful?',
    ],
  },
  prompt: 'Make a case for something you genuinely believe in. Three reasons, fully developed.',
  timeLimit: 120, structure: ['🎣 Hook','📌 Your Point','📋 Your Plan (first... then... finally...)','🥧 PIE Paragraph 1 + transition','🥧 PIE Paragraph 2 + transition','🥧 PIE Paragraph 3','🏁 Conclusion (echo hook, restate point, lasting impression)'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Transition Tournament',
      steps:[
        {time:'0:00',action:'"MIND pillar. You know PIE. Today: three of them. The glue between them is TRANSITION."'},
        {time:'1:30',action:'Transition Tournament — 3 rounds, class rates each.'},
        {time:'5:30',action:'Write the transition toolkit on the board: First / In addition / Furthermore / Most importantly / In contrast / Ultimately.'},
        {time:'7:00',action:'"Your speech today has 3 PIE paragraphs. Each one must connect to the next."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'3-PIE Belief Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: COHERENCE. "A coherent speech feels like one idea, not three separate ones."'},
        {time:'9:30',action:'Model: deliver a 3-PIE speech. Pause and name each transition out loud.'},
        {time:'13:00',action:'Prep: 6 minutes. Students outline all 3 PIE paragraphs + transition sentences.'},
        {time:'19:00',action:'Speeches begin (90-120 sec each). After each: class identifies the 3 transitions.'},
        {time:'21:30',action:'Feedback: "Did the 3 paragraphs feel connected? Which was strongest?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Full Structure Check',
      steps:[
        {time:'52:00',action:'Write the full formal structure on board: Hook / Point / Plan / PIE×3 / Conclusion. Class names each part.'},
        {time:'54:00',action:'Star of Day: strongest transition sentence.'},
        {time:'56:00',action:'Preview: "Next week: THE CONCLUSION — the landing that makes the speech unforgettable."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'PIE Card',emoji:'🥧',use:'Full structure reference — now showing 3 PIE paragraphs with transitions between'},
    {name:'Transition Toolkit',emoji:'🔗',use:'Signal words poster — students use during prep and speeches'},
  ],
},
{
  title: 'SpeakUp! Week 8 — The Conclusion', pillar: 'Mind',
  weekWord: 'Impact', weekWordDef: 'the lasting effect your speech has on the audience after you stop speaking',
  tip: 'Echo your hook. Restate your point. Remind them of your plan. Leave them with one thought they can\'t shake.', tipIcon: '🏁',
  objectives: ['Students master the 4-part G3-4 conclusion: echo hook / restate point / remind plan / lasting impression','Students practise ending with authority — no trailing off, no "um, yeah, that\'s it"','Students critique weak vs. strong conclusions using specific criteria'],
  improvGame: {
    name: 'Ending Auction',
    description: 'Students hear 4 different endings to the same speech — and bid on which is worth the most!',
    instructions: [
      'Teacher delivers the same speech body, then 4 different endings (weak/generic/good/excellent).',
      'Ending A: "So yeah... that\'s basically it. Thanks." Class groans.',
      'Ending B: "In conclusion, those are my three points." (Better, but forgettable)',
      'Ending C: Full 4-part conclusion — echo, restate, remind, lasting impression.',
      'Class rates each 1-10. Discuss: what specific elements pushed C to a 10?',
      'Students write the best possible ending for today\'s prompt in 90 seconds.',
    ],
  },
  prompt: 'What should schools do differently to prepare students for the future?',
  timeLimit: 120, structure: ['🎣 Hook','📌 Your Point','📋 Your Plan','🥧 PIE × 3','🏁 CONCLUSION: Echo Hook → Restate Point → Remind Plan → Lasting Impression'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Ending Auction',
      steps:[
        {time:'0:00',action:'"MIND pillar. You have everything except the landing. Today you stick it."'},
        {time:'1:30',action:'Run Ending Auction — deliver 4 endings. Class rates in real time.'},
        {time:'6:00',action:'Write the 4-part conclusion formula: Echo Hook / Restate Point / Remind Plan / Lasting Impression.'},
        {time:'7:30',action:'Students write their conclusion before they write anything else today.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Future of Schools Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: IMPACT. "The conclusion is what they remember when they walk out. Make it count."'},
        {time:'9:30',action:'Model full speech including 4-part conclusion. Slow down on the conclusion — let it land.'},
        {time:'14:00',action:'Prep: 6 minutes. Students must write their conclusion first.'},
        {time:'20:00',action:'Speeches begin. After each: "Could you repeat their Lasting Impression?" If not, it wasn\'t strong enough.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Lasting Impression Wall',
      steps:[
        {time:'52:00',action:'Each student says their Lasting Impression sentence. Class votes on top 3.'},
        {time:'55:00',action:'"You now know the complete formal speech structure. You own it."'},
        {time:'56:00',action:'Preview: "Next week: STORYTELLING — the most powerful form of public speaking."'},
        {time:'58:00',action:'Closing ritual — deliver the send-off as a full 4-part conclusion to the semester so far.'},
      ]},
  ],
  pictureCards:[
    {name:'Conclusion Formula Card',emoji:'🏁',use:'4-step card: Echo Hook / Restate Point / Remind Plan / Lasting Impression'},
    {name:'PIE Card',emoji:'🥧',use:'Full speech map visible — students see how conclusion connects back to hook'},
  ],
},
]
// ── WEEKS 9-16 G3-4 ──────────────────────────────────────────────────────────
const G34_W9_16 = [
{
  title: 'SpeakUp! Week 9 — Storytelling', pillar: 'Voice',
  weekWord: 'Narrative', weekWordDef: 'a structured account of events that creates meaning and emotional connection',
  tip: 'Start in the middle of the action. Backstory is earned, not given. Drop them into the moment first.', tipIcon: '🔥',
  objectives: ['Students master in medias res (starting in the middle of action)','Students use sensory details and dialogue to bring stories alive','Students deliver a 90-second personal narrative with a clear arc'],
  improvGame: {
    name: 'Sensory Sentence',
    description: 'Students transform a flat sentence into a vivid one using all 5 senses!',
    instructions: [
      'Flat sentence: "We ate dinner." Students have 60 seconds to rewrite using at least 3 senses.',
      'Share: which versions created the most vivid image?',
      'Round 2: "The game ended." — add tension, a specific detail, and one piece of dialogue.',
      'Pattern: strong narrative has SPECIFICITY (not "a dog" but "a three-legged basset hound").',
      'Students identify the most vivid sentence from all shared examples.',
    ],
  },
  prompt: 'Tell us about a moment that changed how you see something. Start in the middle of the action.',
  timeLimit: 90, structure: ['🔥 Start in the action (in medias res)','🌄 Brief context — only what\'s needed','⚡ The turning point','💭 Your reaction / internal moment','🏁 Reflection — what changed and why it matters'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Sensory Sentence',
      steps:[
        {time:'0:00',action:'"VOICE pillar through storytelling. Today: the oldest and most powerful form of rhetoric."'},
        {time:'1:30',action:'Sensory Sentence × 2 rounds. Celebrate the most specific, unexpected details.'},
        {time:'5:30',action:'Introduce in medias res: "Great stories don\'t start at the beginning. They start in the moment."'},
        {time:'7:00',action:'Model: start the same story two ways — chronological vs. in medias res. Class votes which grabs them.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Turning Point Stories',
      steps:[
        {time:'8:00',action:'Word of Day: NARRATIVE. "Persuasive speeches argue. Narratives prove the same point — with feeling."'},
        {time:'9:30',action:'Model a 90-sec narrative: in medias res, sensory details, one line of dialogue, reflection.'},
        {time:'14:00',action:'Prep: 5 minutes. First sentence must drop us into the action.'},
        {time:'19:00',action:'Speeches begin. After each: audience identifies (1) starting image, (2) turning point, (3) takeaway.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Story Arc Check',
      steps:[
        {time:'52:00',action:'"Which story stayed with you? Name one specific detail that made it real."'},
        {time:'54:30',action:'Star of Day: most vivid sensory detail.'},
        {time:'56:00',action:'Preview: "Next week: HUMOROUS SPEECH — Toastmasters style. Laughter is a skill."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Story Mountain',emoji:'⛰️',use:'G3-4 version: in medias res entry point marked — start at the rising action'},
    {name:'Sensory Detail Card',emoji:'🔬',use:'5 senses checklist — students tick off which senses appear in their story'},
  ],
},
{
  title: 'SpeakUp! Week 10 — Humorous Speech', pillar: 'Voice',
  weekWord: 'Timing', weekWordDef: 'the precise control of speed, pause, and delivery that makes comedy land',
  tip: 'Comedy is 10% the joke and 90% the delivery. The same sentence said with a different pause lands completely differently.', tipIcon: '😂',
  objectives: ['Students understand 3 comedic techniques: Rule of Three, Callback, Understatement','Students deliver one humorous speech with at least 2 deliberate laugh techniques','Students give feedback specifically on comedic timing and technique identification'],
  improvGame: {
    name: 'Comedic Techniques Lab',
    description: 'Students practise 3 techniques in rapid succession — then pick their favourite to use in their speech!',
    instructions: [
      'RULE OF THREE: "I need three things to survive: food, water, and excellent Wi-Fi." Students write one.',
      'CALLBACK: open with "My dog is very loyal." Close with "So yes — loyal... mostly." Students try.',
      'UNDERSTATEMENT: "Being hit by a bus is slightly inconvenient." Students write one.',
      'Vote: which technique is each student using in their speech today?',
      'Model: demonstrate all 3 in one 60-second speech.',
    ],
  },
  prompt: 'Tell us about something that was absolutely, catastrophically NOT going to plan.',
  timeLimit: 90, structure: ['🎣 Hook — must be funny or set up a comic premise','📖 Set the scene (specific, unexpected details)','😬 What went wrong (Rule of Three of things that failed)','😂 The punchline moment — PAUSE. Let them laugh.','🏁 Callback to hook or understatement conclusion'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Comedic Techniques Lab',
      steps:[
        {time:'0:00',action:'"VOICE pillar: timing. Comedy is craft, not luck. Today we study it like scientists."'},
        {time:'1:30',action:'Comedic Techniques Lab — all 3 techniques, students write examples for each.'},
        {time:'5:30',action:'"Choose your weapon: Rule of Three, Callback, or Understatement. Use it in your speech today."'},
        {time:'7:00',action:'Model 60-second humorous story with all 3 techniques labelled. Class spots them.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Catastrophic Plans Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: TIMING. "The pause is the punchline. Silence is your funniest tool."'},
        {time:'9:30',action:'Rules: (1) audiences may laugh freely, (2) speakers must hold their pause until the room settles.'},
        {time:'14:00',action:'Prep: 5 minutes. Students mark their script: [PAUSE] and [TECHNIQUE: ___].'},
        {time:'19:00',action:'Speeches begin. Audience holds up a finger when they spot a technique.'},
        {time:'21:00',action:'After each: "What technique? Did the pause land? What was funniest — the words or the delivery?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Timing Trophy',
      steps:[
        {time:'52:00',action:'Class votes: best comedic pause of the session. Winner re-delivers just that moment.'},
        {time:'54:30',action:'Star of Day: most skillful use of a specific technique.'},
        {time:'56:00',action:'Preview: "Next week: FULL SPEECH — everything together in one polished performance."'},
        {time:'58:00',action:'Closing ritual — do it with comedic understatement: "I guess that was... fine."'},
      ]},
  ],
  pictureCards:[
    {name:'Comedic Techniques Card',emoji:'😂',use:'3-panel card: Rule of Three / Callback / Understatement with examples'},
    {name:'Pause Power Card',emoji:'⏸️',use:'Hold up to cue students to pause — silent coaching during speeches'},
  ],
},
{
  title: 'SpeakUp! Week 11 — Full Formal Speech Practice', pillar: 'All',
  weekWord: 'Fluency', weekWordDef: 'speaking smoothly and naturally, without long pauses or filler words like um and uh',
  tip: 'You know every part of this structure. Today you prove it by putting them all together seamlessly.', tipIcon: '🎯',
  objectives: ['Students deliver a complete formal speech: Hook / Point / Plan / PIE×3 / Conclusion','Students use filler-word awareness to reduce um, uh, like, you know','Students give structured feedback on the speech as a complete unit'],
  improvGame: {
    name: 'Filler Word Bingo',
    description: 'Audience hunts for filler words — and the speaker tries to deliver a 60-second speech without any!',
    instructions: [
      'Give each student a tally card for: um, uh, like, you know, so, basically, literally.',
      'Volunteer speaks for 60 seconds on any topic. Audience tallies in real time.',
      'Count up fillers. "That\'s X filler words in 60 seconds — one every Y seconds."',
      'Round 2: same speaker tries again, same topic. How much did they reduce?',
      'Debrief: what happens in the brain when we stop saying "um"? (Answer: we pause instead — which sounds more confident!)',
    ],
  },
  prompt: 'Make a case for something you care deeply about. Full formal structure. Your best speech yet.',
  timeLimit: 120, structure: ['🎣 Hook (your best sentence)','📌 Your Point','📋 Your Plan','🥧 PIE 1 + transition','🥧 PIE 2 + transition','🥧 PIE 3','🏁 Conclusion: Echo / Restate / Remind / Lasting Impression'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Filler Word Bingo',
      steps:[
        {time:'0:00',action:'"ALL THREE PILLARS today. This is your first complete formal speech from memory."'},
        {time:'1:30',action:'Filler Word Bingo with a volunteer. Count live, share results, do Round 2.'},
        {time:'5:30',action:'"Filler words = brain load. The more you know your structure, the fewer you use."'},
        {time:'7:00',action:'Full body check + Brave Breathing × 1. "You are ready."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Full Formal Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: FLUENCY. "Fluent doesn\'t mean fast. It means smooth, confident, and purposeful."'},
        {time:'9:30',action:'Quick structure recap: write all 7 components on board. Students confirm they have all 7 in their plan.'},
        {time:'13:00',action:'Prep: 5 minutes. Full outline only — no reading a script during delivery.'},
        {time:'18:00',action:'Speeches begin (90-120 sec). Audience tracks: (1) all 7 components present, (2) filler word tally.'},
        {time:'21:00',action:'Feedback: component check first, then voice/body note, then filler count.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Structure Mastery Check',
      steps:[
        {time:'52:00',action:'"Without looking — recite the 7 components of the formal structure." Group challenge.'},
        {time:'54:30',action:'Star of Day: fewest filler words + complete structure.'},
        {time:'56:00',action:'Preview: "Next week: CONFIDENCE & MIND — the internal game of public speaking."'},
        {time:'58:00',action:'Closing ritual — deliver send-off as a mini-conclusion: echo / restate / lasting impression.'},
      ]},
  ],
  pictureCards:[
    {name:'Full Speech Map',emoji:'🗺️',use:'Complete 7-part structure reference — keep visible all session'},
    {name:'Filler Word Tally Card',emoji:'📊',use:'Audience uses during speeches — convert to feedback at end'},
    {name:'Conclusion Formula Card',emoji:'🏁',use:'Students reference during prep to write their 4-part conclusion'},
  ],
},
{
  title: 'SpeakUp! Week 12 — Confidence & Mind', pillar: 'Mind',
  weekWord: 'Mindset', weekWordDef: 'the way you choose to think about challenges — and how that thinking changes your performance',
  tip: 'Nervousness and excitement feel identical in your body. The only difference is what you tell yourself it means.', tipIcon: '🧠',
  objectives: ['Students understand the science of performance anxiety','Students practise 3 mental tools: reframing, visualisation, and anchor phrases','Students identify their personal pre-speech mental routine'],
  improvGame: {
    name: 'Reframe It',
    description: 'Students transform catastrophic thinking into competitive thinking in real time!',
    instructions: [
      'Teacher says a catastrophic thought: "I\'m going to forget everything and everyone will laugh."',
      'Student must immediately reframe: "I know my material. If I forget, I\'ll pause and find my place."',
      'Round 2: "My voice is going to shake." Reframe: "My voice shakes when I\'m excited — and I\'m excited!"',
      'Round 3: "I\'m not as good as [classmate]." Reframe: "I\'m competing with who I was last week."',
      'Students write their own catastrophic thought + reframe.'],
  },
  prompt: 'What is the hardest mental challenge you have ever faced? How did you deal with it?',
  timeLimit: 90, structure: ['🎣 Hook','📌 Your Point','📋 Your Plan','🥧 PIE 1: the challenge itself','🥧 PIE 2: what you tried','🥧 PIE 3: what changed in your mindset','🏁 Conclusion: what others can take from your experience'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Reframe It',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: the internal game. What you think before you speak shapes everything."'},
        {time:'1:30',action:'Reframe It × 3 rounds. Fast pace, high energy. Celebrate bold reframes.'},
        {time:'5:00',action:'Introduce 3 tools: (1) Reframing, (2) Visualisation — see yourself succeeding, (3) Anchor phrase.'},
        {time:'7:00',action:'Students write their anchor phrase: one sentence that means "I am ready." Use it before every speech.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Mental Challenge Speeches',
      steps:[
        {time:'8:00',action:'Word of Day: MINDSET. "Skills get you 50% of the way. Mindset gets you the other 50%."'},
        {time:'9:30',action:'Each speaker says their anchor phrase silently before stepping up.'},
        {time:'13:00',action:'Prep: students plan their 3 PIE paragraphs around a real mental challenge.'},
        {time:'18:00',action:'Speeches begin. After each: "What mindset shift did they describe? Which tool helped them?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Anchor Phrase Circle',
      steps:[
        {time:'52:00',action:'Every student says their anchor phrase aloud. Class listens and responds: "We believe you."'},
        {time:'55:00',action:'Star of Day: speech that made the audience rethink their own mindset.'},
        {time:'56:30',action:'Preview: "Next week: INFORMATIVE vs. PERSUASIVE — choose your mode for Showcase."'},
        {time:'58:00',action:'Closing: Brave Breathing × 1 → anchor phrase (silently) → send-off ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Brave Breathing Card',emoji:'🌬️',use:'Pre-speech ritual reference — Brave Breath → anchor phrase → begin'},
    {name:'Reframe Card',emoji:'🔄',use:'3 catastrophic thoughts + reframes — post for students who struggle with nerves'},
  ],
},
{
  title: 'SpeakUp! Week 13 — Informative vs. Persuasive', pillar: 'Mind',
  weekWord: 'Ethos', weekWordDef: 'the credibility and trustworthiness a speaker builds with their audience',
  tip: 'Informative: your goal is clarity. Persuasive: your goal is action. Every word choice shifts based on purpose.', tipIcon: '🎯',
  objectives: ['Students distinguish informative from persuasive speeches at the structural level','Students understand Ethos, Pathos, Logos (Aristotle\'s rhetorical triangle)','Students choose the correct mode for their Showcase speech'],
  improvGame: {
    name: 'Persuasion Triangle',
    description: 'Students identify which of Ethos, Pathos, or Logos each speech technique uses!',
    instructions: [
      'Read 3 statements. Class identifies the appeal type.',
      '"Studies show 80% of people who do X achieve Y." → LOGOS (logic/evidence)',
      '"As someone who has lived through this, I know the cost." → ETHOS (credibility)',
      '"Imagine waking up tomorrow and everything you love is gone." → PATHOS (emotion)',
      'Students argue: which appeal is most powerful? Debate in groups of 3.',
      'Deliver a 60-second argument using all 3 appeals — class identifies each one.',
    ],
  },
  prompt: 'Same topic, two speeches: 60 seconds INFORMATIVE, then 60 seconds PERSUASIVE.',
  timeLimit: 60, structure: ['INFORMATIVE: Hook → facts × 3 → conclusion','PERSUASIVE: Hook → Point → Logos evidence → Pathos moment → Ethos close → Call to Action'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Persuasion Triangle',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: purpose. Before you speak — ask WHY. It changes everything."'},
        {time:'1:30',action:'Persuasion Triangle: 3 statements, class identifies appeal types.'},
        {time:'5:00',action:'Groups debate: which appeal is most powerful for THEIR showcase topic?'},
        {time:'7:00',action:'"Today you deliver the same topic twice — once to teach, once to persuade."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Same Topic, Two Modes',
      steps:[
        {time:'8:00',action:'Word of Day: ETHOS. "The most persuasive thing you can say is: I know this because..."'},
        {time:'9:30',action:'Model same topic (SLEEP) informative then persuasive — exaggerate the difference.'},
        {time:'13:00',action:'Prep: 4 min. Students pick topic, plan both versions: inform structure / persuade structure.'},
        {time:'17:00',action:'Speeches × 2 per student. After each pair: "Which was harder? Which convinced you more?"'},
        {time:'44:00',action:'"Which mode are you using for Showcase? Commit now."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Showcase Mode Declaration',
      steps:[
        {time:'52:00',action:'Each student declares: "My Showcase speech will [INFORM / PERSUADE] about ___ and I will use [ethos/pathos/logos] mainly."'},
        {time:'55:00',action:'Star of Day: most effective use of pathos (emotional appeal).'},
        {time:'56:30',action:'Preview: "Next week: ART OF EVALUATION — Toastmasters style. Giving feedback is a speech too."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Persuasion Triangle',emoji:'🔺',use:'Ethos/Pathos/Logos poster — keep visible during speeches for audience analysis'},
    {name:'Inform vs. Persuade Card',emoji:'🎯',use:'Side-by-side structure comparison — helps students commit to their showcase mode'},
  ],
},
{
  title: 'SpeakUp! Week 14 — The Art of Evaluation', pillar: 'Mind',
  weekWord: 'Evaluation', weekWordDef: 'a structured, honest, and constructive assessment of a speech designed to help the speaker grow',
  tip: 'A great evaluation is itself a public speech. Observe → analyse → report with commendation and recommendation.', tipIcon: '🔍',
  objectives: ['Students deliver structured evaluations using the commendation-recommendation-commendation model','Students understand that giving feedback is a form of public speaking','Students identify evaluations as the most powerful tool for rapid improvement'],
  improvGame: {
    name: 'Vague vs. Specific',
    description: 'Students transform useless feedback into actionable, specific evaluation language!',
    instructions: [
      '"Good job" → rewrite as specific: "Your eye contact during the second point built real trust."',
      '"You talked too fast" → rewrite: "When you slowed down for the statistic, it landed — try that throughout."',
      '"Your hook was great" → rewrite: "The question you opened with created immediate buy-in because it was personal."',
      'Pairs: each student writes one vague piece of feedback and hands it to their partner to make specific.',
      'Share: the class votes on the most actionable rewrite.',
    ],
  },
  prompt: 'Two student volunteers give 2-minute speeches. The rest of the class evaluates individually.',
  timeLimit: 120, structure: ['COMMENDATION: "What you did well — specifically — and WHY it worked"','RECOMMENDATION: "One thing to try next time — specifically HOW to do it"','COMMENDATION: "Encouragement — what you\'re excited to see them do next"'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Vague vs. Specific',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: EVALUATION. The Toastmasters evaluator role is one of the most important in the room."'},
        {time:'1:30',action:'Vague vs. Specific × 3 rounds. Students rewrite in pairs.'},
        {time:'5:30',action:'Introduce the C-R-C model (commendation-recommendation-commendation). Model one live.'},
        {time:'7:30',action:'Give everyone the Evaluator\'s Checklist card. Review it before speakers begin.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Live Evaluation Practice',
      steps:[
        {time:'8:00',action:'Word of Day: EVALUATION. "A great evaluation is a gift — it is also a speech."'},
        {time:'9:30',action:'2 volunteer speakers give 2-minute speeches (topic of their choice). Class evaluates individually in writing.'},
        {time:'20:00',action:'2-3 students each deliver a 60-second evaluation aloud using C-R-C. Time them strictly.'},
        {time:'35:00',action:'"Now: a third volunteer speaker." Repeat evaluation round. Focus on whether evaluations improved.'},
        {time:'50:00',action:'Debrief: "How did it feel to give a specific evaluation? To receive one?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Evaluator of the Day',
      steps:[
        {time:'52:00',action:'"Notice: a good evaluation IS a public speech. You practised speaking twice today."'},
        {time:'54:00',action:'Evaluator of the Day: student whose evaluation was most specific and actionable.'},
        {time:'56:00',action:'Preview: "2 weeks until Showcase. Rehearse at home. Bring your best."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Evaluator\'s Checklist',emoji:'🔍',use:'Voice/Body/Structure/Content/Impact — audience uses during all speeches today'},
    {name:'C-R-C Model Card',emoji:'🥪',use:'Commendation→Recommendation→Commendation formula — keep visible during evaluations'},
  ],
},
{
  title: 'SpeakUp! Week 15 — Grand Showcase Part 1 🎉', pillar: 'All',
  weekWord: 'Performance', weekWordDef: 'delivering your speech to a real audience who came specifically to hear you speak',
  tip: 'You have prepared for 14 weeks. Trust your preparation. Walk to the front. Pause. Begin.', tipIcon: '🎤',
  objectives: ['First group delivers showcase speeches to a real audience','Students demonstrate mastery of the full formal speech structure','Audience members practise structured evaluation'],
  improvGame: {
    name: 'Grand Warm-Up Sequence',
    description: 'The complete ritual — every technique from the semester, run in sequence one final time!',
    instructions: [
      'Vocal warm-up: lip trills, hum, articulation drill ("red lorry yellow lorry" × 3).',
      '5-point body check from Week 3.',
      'Brave Breathing × 3 from Week 4.',
      'Power Pose for 10 seconds.',
      '"I know my material. I have rehearsed. I am ready." — anchor phrase, said aloud.',
    ],
  },
  prompt: 'Deliver your showcase speech.',
  timeLimit: 180, structure: ['Your choice: Formal Speech / Platform Speech / Humorous Speech / Storytelling Speech / Impromptu'],
  sessionPlan: [
    { startMin:0, endMin:10, label:'WARM-UP', emoji:'🎭', title:'Grand Warm-Up + Room Setup',
      steps:[
        {time:'0:00',action:'Set up room: chairs in rows, clear speaking area, microphone if available.'},
        {time:'3:00',action:'Grand Warm-Up Sequence — all 5 steps together as a class.'},
        {time:'8:00',action:'Brief the student MC: "You introduce each speaker with: [Name] is in Grade [X]. They are speaking about [topic]."'},
        {time:'9:30',action:'"This is real. The audience is real. Walk up like you own the stage. Because you do."'},
      ]},
    { startMin:10, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase — First Half',
      steps:[
        {time:'10:00',action:'MC introduces Speaker 1. Speaker does Pre-Speech Ritual (breath → anchor phrase → step up → pause → begin).'},
        {time:'12:30',action:'After each speech: Q&A — 1-2 audience questions ("That is a great question — I would add...")'},
        {time:'14:00',action:'Continue. Pace: ~4-5 min per speaker (speech + intro + Q&A).'},
        {time:'50:00',action:'Roughly half the class has presented. Standing ovation.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Celebration + Preview',
      steps:[
        {time:'52:00',action:'"What surprised you most about a speech today? Name something specific."'},
        {time:'54:00',action:'To speakers who haven\'t gone yet: "Next week is your moment. Keep rehearsing."'},
        {time:'56:00',action:'Those who presented: "How does it feel NOW vs. 14 weeks ago?"'},
        {time:'58:00',action:'Closing ritual — together.'},
      ]},
  ],
  pictureCards:[
    {name:'Pre-Speech Ritual Card',emoji:'🌬️',use:'Post at the front — Brave Breath → Anchor Phrase → Walk Up → Pause → Begin'},
    {name:'Evaluator\'s Checklist',emoji:'🔍',use:'Audience uses during each speech — sets expectation of quality observation'},
  ],
},
{
  title: 'SpeakUp! Week 16 — Grand Showcase Part 2 + Celebration 🏆', pillar: 'All',
  weekWord: 'Legacy', weekWordDef: 'what you leave behind — the skills, habits, and confidence that stay with you long after this class ends',
  tip: 'In Week 1 you gave a 30-second unrehearsed introduction. Today you deliver a polished, researched, purposeful speech. That is who you are now.', tipIcon: '🏆',
  objectives: ['Remaining students deliver their showcase speeches','Whole class reflects on semester-long growth using the Growth Arc','Students leave with a personal speaking toolkit and a goal for next semester'],
  improvGame: {
    name: 'Grand Warm-Up Sequence',
    description: 'Same as last week — this is the ritual they own.',
    instructions: [
      'Vocal warm-up sequence.',
      '5-point body check.',
      'Brave Breathing × 3.',
      'Power Pose 10 seconds.',
      'Anchor phrase — said with full conviction.',
    ],
  },
  prompt: 'Deliver your showcase speech.',
  timeLimit: 180, structure: ['Your choice of speech format'],
  sessionPlan: [
    { startMin:0, endMin:10, label:'WARM-UP', emoji:'🎭', title:'Grand Warm-Up + Final Setup',
      steps:[
        {time:'0:00',action:'Set up room. Certificates ready (keep hidden).'},
        {time:'3:00',action:'Grand Warm-Up Sequence — both groups together. "One final time."'},
        {time:'8:00',action:'New MC for today. "The second group has had an extra week to prepare and watch. That\'s an advantage."'},
        {time:'9:30',action:'"Let\'s finish what we started."'},
      ]},
    { startMin:10, endMin:46, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase — Second Half + Evaluations',
      steps:[
        {time:'10:00',action:'Remaining speakers present. Same format: MC → Pre-Speech Ritual → Speech → Q&A.'},
        {time:'44:00',action:'Final speaker finishes. Both groups give a standing ovation together.'},
        {time:'45:00',action:'Evaluator Round: each student writes one self-evaluation using C-R-C. "What I did well / What I will work on / What I\'m proud of."'},
      ]},
    { startMin:46, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Growth Arc + Legacy',
      steps:[
        {time:'46:00',action:'Growth Arc: "In Week 1 I could not ___, but now I can ___." Every student shares.'},
        {time:'53:00',action:'Teacher reads 3 most remarkable growth arcs aloud (with permission).'},
        {time:'55:00',action:'Certificate ceremony: "Certified SpeakUp Speaker — Grades 3-4, Fall 2026." Call each name.'},
        {time:'57:00',action:'"You are speakers. Next semester, you come back as leaders." Class photo at the speaking spot.'},
        {time:'59:00',action:'Final send-off. Loudest of the semester. "I AM A SPEAKER."'},
      ]},
  ],
  pictureCards:[
    {name:'Pre-Speech Ritual Card',emoji:'🌬️',use:'Same as Week 15 — the ritual is now automatic'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Reference in closing: "You mastered all three — Voice, Body, Mind"'},
    {name:'C-R-C Model Card',emoji:'🥪',use:'Self-evaluation round — students apply C-R-C to themselves'},
  ],
},
]
SESSIONS_G34.push(...G34_W9_16)

async function run() {
  // Find classrooms
  const classrooms = await sql`SELECT id, name, grade_band, access_code FROM classrooms WHERE access_code IN ('KEEN01','KEEN02')`
  const clG12 = classrooms.find(c => c.grade_band === 'g1-2')
  const clG34 = classrooms.find(c => c.grade_band === 'g3-4')
  console.log('Classrooms found:', classrooms.map(c => `${c.access_code} (${c.grade_band})`).join(', '))

  // Find mattos school
  const [mattos] = await sql`SELECT id FROM schools WHERE slug = 'mattos'`

  for (const [sessions, gradeBand, classroom] of [
    [SESSIONS_G12, 'g1-2', clG12],
    [SESSIONS_G34, 'g3-4', clG34],
  ]) {
    if (!classroom) { console.warn(`⚠  No classroom found for ${gradeBand}`); continue }

    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i]
      const weekNum = i + 1
      const weekStart = WEEK_STARTS[i]

      // Upsert curriculum row
      const [cur] = await sql`
        INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
        VALUES (${s.title}, ${gradeBand}, ${weekNum + 100}, ${s.pillar + ' — SpeakUp'}, true)
        ON CONFLICT DO NOTHING
        RETURNING id
      `
      let curId = cur?.id
      if (!curId) {
        const [existing] = await sql`SELECT id FROM curriculum WHERE grade_band = ${gradeBand} AND week_number = ${weekNum + 100}`
        curId = existing?.id
        if (!curId) {
          // Use week_number offset 100+ to avoid conflict with existing enrichment weeks
          const [ins] = await sql`
            INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
            VALUES (${s.title}, ${gradeBand}, ${weekNum + 100}, ${s.pillar + ' — SpeakUp'}, true)
            RETURNING id
          `
          curId = ins.id
        }
      }

      // Upsert curriculum_day (Wednesday = day 3)
      const [existingDay] = await sql`SELECT id FROM curriculum_days WHERE curriculum_id = ${curId} AND subject = 'public_speaking'`
      let dayId = existingDay?.id
      if (!dayId) {
        const [day] = await sql`
          INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
          VALUES (${curId}, 3, 'public_speaking', ${s.title})
          RETURNING id
        `
        dayId = day.id
      }

      // Upsert content_item
      const meta = {
        pillar: s.pillar, objectives: s.objectives,
        weekWord: s.weekWord, weekWordDef: s.weekWordDef,
        tip: s.tip, tipIcon: s.tipIcon,
        improvGame: s.improvGame,
        prompt: s.prompt, timeLimit: s.timeLimit, structure: s.structure,
        sessionPlan: s.sessionPlan,
        pictureCards: s.pictureCards,
      }
      const [existingItem] = await sql`
        SELECT ci.id FROM curriculum_content cc
        JOIN content_items ci ON ci.id = cc.content_item_id
        WHERE cc.curriculum_day_id = ${dayId}
      `
      let itemId = existingItem?.id
      if (!itemId) {
        const [item] = await sql`
          INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
          VALUES ('public_speaking', 'illustrated-steps', ${s.title}, ${s.pillar + ' pillar — SpeakUp'}, ${gradeBand}, 60, 3, ${meta})
          RETURNING id
        `
        itemId = item.id
        await sql`INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index) VALUES (${dayId}, ${itemId}, 0)`
      } else {
        await sql`UPDATE content_items SET title = ${s.title}, metadata = ${meta} WHERE id = ${itemId}`
      }

      // Assign to classroom for this week
      await sql`
        INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
        VALUES (${classroom.id}, ${curId}, ${weekStart})
        ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id
      `

      console.log(`✓ ${gradeBand} W${weekNum} [${weekStart}]: ${s.title.slice(0,50)}`)
    }
  }

  await sql.end()
  console.log('\n✅ SpeakUp 16-week curriculum seeded for both tracks!')
}

run().catch(e => { console.error(e); process.exit(1) })
