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
  title: 'SpeakUp! Week 1 — Find Your Voice', pillar: 'All',
  weekWord: 'Speaker', weekWordDef: 'someone who shares ideas and feelings with others',
  tip: 'Celebrate bravery over perfection — the goal is simply to speak in front of the group. Every great speaker was once a nervous beginner.', tipIcon: '🌟',
  objectives: ['Students introduce themselves with name + one fun fact','Students discover where speeches happen using picture cards','Students learn the Three Pillars: Voice · Body · Mind','Students answer their first question aloud in front of the group'],
  improvGame: {
    name: 'Stand Up & Say Hi',
    description: 'Everyone practises the most basic form of public speaking — introducing themselves!',
    instructions: [
      'Each student stands and says their name and one fun fact.',
      'Teacher models first: "My name is [Teacher]. I love [hobby]!"',
      'Class snaps or claps after each introduction.',
      'Keep it fast — no more than 10 seconds each.',
      'No wrong answers — any fun fact counts!',
    ],
  },
  prompt: 'What is one place YOU would like to give a speech someday?',
  timeLimit: 30, structure: ['🙋 Stand up tall','🗣️ "One place I\'d like to give a speech is..."','👏 Sit down — done!'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Stand Up & Say Hi',
      steps:[
        {time:'0:00',action:'Stand at the front with a big smile. "Welcome to SpeakUp! Today you are all going to speak in front of the group. We\'re going to practise the most important skill in the world — sharing your voice." Set a warm, excited tone.'},
        {time:'1:00',action:'Model the warm-up yourself first. Stand tall, say your name and one fun fact. Keep it genuine and a little funny — students relax when the teacher goes first.'},
        {time:'2:00',action:'Set the one rule before we begin: "When your classmate is standing and speaking, it is THEIR moment. Our rule: stay quiet during peer turns — no talking, no side comments. When they finish, we snap or clap. Ready?" Thumbs up from the class.'},
        {time:'2:30',action:'Go around the circle quickly — each student stands, says their name and one fun fact. Class snaps or claps after each. If a student freezes, offer a lifeline: "Your name and one thing you love — anything at all." Keep the pace light and fast. No more than 10 seconds each.'},
        {time:'7:00',action:'Celebrate: "You all just spoke in front of the whole group! That IS public speaking. You\'re already doing it."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'You Already Do This → 3 Pillars → First Try',
      steps:[
        {time:'8:00',action:'YOU ALREADY DO THIS. "Before we start — I have three questions. Raise your hand if you have ever explained something to a friend." Wait for hands. "Raise your hand if you have ever told a story at dinner." Hands again. "Raise your hand if you have ever argued for something you wanted." Hands. Then: "That is a speech. You have already done it. Today we just do it on purpose."'},
        {time:'10:00',action:'"So where do speeches happen?" Take 4-5 answers from students — let them name real places (classroom, sports, dinner table, etc.). Accept everything. "Exactly — speeches happen everywhere. Today, THIS classroom is our stage."'},
        {time:'14:00',action:'If discussion slows, use one of these backup prompts to keep momentum: "Has anyone seen a speech at a wedding, graduation, assembly, or on TV — what were they talking about?" / "If YOU had a microphone for 60 seconds right now, what would you say?" / "Where do you feel most comfortable talking — at home with family, with friends, or somewhere else?" Pick whichever fits the energy. You only need one.'},
        {time:'20:00',action:'THE 3 PILLARS. Write on the board or reveal the Pillar Poster. "Every great speaker uses three things." Touch your throat: "VOICE — speak so everyone can hear." Stretch arms wide: "BODY — stand strong, look at people." Tap your head: "MIND — be brave, be ready." Ask the class to do the three actions with you. Repeat together twice.'},
        {time:'24:00',action:'Point to each pillar and ask students to name one example: "What does VOICE mean? What does a strong BODY look like? What does a brave MIND feel like?" Take 1-2 answers per pillar. Write key words under each one. This anchors the vocabulary for the whole year.'},
        {time:'27:00',action:'SHAKE IT OUT. "Stand up — everyone up! Shake your hands like there\'s water on them. Now shake your whole body — shake those nerves out! 5, 4, 3, 2, 1 — FREEZE! Great. Sit back down. We are READY."'},
        {time:'28:00',action:'FIRST TRY. "Now it\'s your turn. I\'m going to ask you ONE question. You stand up, say your answer out loud, and sit down. That\'s it. One sentence. No wrong answers." Write the question on the board: "What is one place YOU would like to give a speech someday?"'},
        {time:'30:00',action:'Model your own answer first. Keep it genuine — somewhere real. "One place I\'d like to give a speech is at my family\'s dinner table, because I want everyone to listen to me for once!" Students often laugh and relax when the teacher is funny and human.'},
        {time:'32:00',action:'Go around the room one by one. Each student stands, answers the question, sits. Audience snaps or claps after each. If a student freezes, offer quietly: "One place is..." and let them fill in the blank. Don\'t rush them — a 5-second pause is fine. Celebrate whatever they say.'},
        {time:'50:00',action:'After the last student: "Look at that — every single person just gave their first speech. We asked a question, you answered out loud, in front of everyone. That is EXACTLY what speaking is."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Pillar Check + Send-Off',
      steps:[
        {time:'52:00',action:'"Quick quiz — what are the Three Pillars?" Point to three different students. Build to a whole-class response: VOICE — BODY — MIND! Do the three actions together one more time.'},
        {time:'54:00',action:'Star of the Day: pick one student who showed courage — especially someone who looked nervous but answered anyway. Be specific: "I\'m choosing [name] because they took a breath, stood up, and went for it. That is brave speaking."'},
        {time:'55:30',action:'"Next week we learn VOICE — how to make your voice big enough to fill this whole room. Tonight\'s challenge: try it once at dinner! Tell someone at the table the ONE place you\'d like to give a speech someday."'},
        {time:'57:00',action:'Closing ritual — use this every single week. "Repeat after me: I — AM — A — SPEAKER!" Class shouts it back. End with a fist bump or high five as students leave.'},
      ]},
  ],
  pictureCards:[
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Reveal at 20:00 to introduce Voice·Body·Mind framework — keep posted all year'},
  ],
},
// ── WEEK 2 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 2 — Voice: Big, Slow & Clear', pillar: 'Voice',
  weekWord: 'Project', weekWordDef: 'to send your voice to the back of the room so everyone can hear',
  tip: 'Loud voice ≠ rude — frame projection as a skill, not showing off. Physical cue: hand to ear = "I cannot hear you," thumbs up = "perfect volume." For very quiet students: start close, build distance gradually.', tipIcon: '📢',
  objectives: ['Students project their voice to fill the room','Students slow down and speak clearly','Students experiment with pace and expression'],
  improvGame: {
    name: 'Emotion Switch',
    description: 'Students say a sentence in different emotions — builds vocal variety and confidence!',
    instructions: [
      'Give everyone the sentence: "I love Mondays!"',
      'Call out an emotion: HAPPY / SCARED / BORED / EXCITED / ROBOT',
      'Everyone says the sentence in that emotion at the same time.',
      'Do 5 rounds, then try a new sentence.',
      'Keep the pace fast — emotion to emotion with no gap.',
    ],
  },
  prompt: 'What is your favourite food? Tell us what it tastes like!',
  timeLimit: 45,
  structure: [
    '🍕 "My favourite food is ___."',
    '😋 "It tastes ___ and ___."  (two describing words)',
    '❤️ "I love it because ___."',
  ],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Emotion Switch',
      steps:[
        {time:'0:00',action:'Tell the class: "Today\'s pillar is VOICE — volume, pace, and expression. But first — warm up your voice!" Give everyone the sentence: "I love Mondays!"'},
        {time:'1:00',action:'Call an emotion: HAPPY. Everyone says "I love Mondays!" in that emotion — all at the same time. Then: SCARED. BORED. EXCITED. ROBOT. Do all 5 in quick succession — one emotion every 20 seconds. No waiting between emotions.'},
        {time:'5:00',action:'New sentence: "My teacher is amazing!" Run 3 more emotions. Watch for flat students — whisper: "Feel the emotion in your face first, then open your mouth." Expression comes from the body, not just the voice.'},
        {time:'7:30',action:'"You just used your voice 8 different ways! That\'s what we build today — a voice with range." Sit everyone down.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Voice Dial + Slow-Mo + Food Speeches',
      steps:[
        {time:'8:00',action:'Draw the Voice Dial on the board: 1 to 5. Label them: 1 = whisper, 3 = just right (classroom), 5 = outdoor shout. Hold up the Voice Dial picture card. "Today\'s Word is PROJECT — sending your voice to the back wall."'},
        {time:'10:00',action:'VOICE DIAL practice. One student says their name at level 1. Can the back row hear? Then level 3. Then level 5. "Which level do we use inside?" (Level 3.) Repeat with 3–4 students. Use the physical cue throughout: hand to ear = too quiet. Thumbs up = just right.'},
        {time:'17:00',action:'SLOW-MO vs. FAST-SPEAK. Say "My favourite food is pizza" three ways — class echoes each one. Too fast: rush through it. Ask: "Could you understand me?" Too slow: "My……favourite……food……is……pizza." "Awkward, right?" Just right: clear, steady. "THAT\'s the target — medium pace, every word clear."'},
        {time:'24:00',action:'EXPRESSION PRACTICE. Hold up the Feeling Faces picture card. A student picks one card face-down (surprise!). They say a sentence in that feeling. Class guesses the emotion — write or whisper to a neighbour first, then reveal. Do 5–6 rounds. Rotate students quickly.'},
        {time:'35:00',action:'FOOD SPEECHES. Write the 3 sentence starters on the board big and clear: "My favourite food is ___." / "It tastes ___ and ___." / "I love it because ___." Each student stands, says all 3 lines at level 3, sits. Audience holds up fingers (1-5) to rate volume after each speech — 3 seconds, then move on.'},
        {time:'37:00',action:'If a student freezes: point to LINE 1 on the board and say the first three words with them — "My favourite food…" — then stop. Let them continue. Do not finish the sentence for them. A 5-second pause is fine.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Voice Check-Out',
      steps:[
        {time:'52:00',action:'"Three questions — hands up for each. Who practised VOLUME today?" (all hands). "Who practised PACE?" (all hands). "Who practised EXPRESSION?" (all hands). "That\'s the Voice Pillar — all three in one session."'},
        {time:'54:00',action:'Star of the Day: name the student whose voice reached the back row most consistently — or who tried the expression activity with the most commitment. Be specific about what you noticed.'},
        {time:'55:30',action:'"Next week: BODY. How you stand and use your hands is half of speaking. Between now and then — notice how people\'s bodies change when they speak in front of a group."'},
        {time:'57:00',action:'Closing ritual. "I AM A SPEAKER!" — at level 5 (outdoor energy). Then level 1 (whisper). Then level 3 (just right). "Level 3 every time we speak in this room." Fist bump or high five as students leave.'},
      ]},
  ],
  pictureCards:[
    {name:'Voice Dial',emoji:'🎚️',use:'Draw on board at 8:00; hold up during speeches — hand to ear = too quiet, thumbs up = just right'},
    {name:'Feeling Faces',emoji:'😄',use:'Used at 24:00 for Expression Practice — students pick a card and speak in that emotion'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to VOICE pillar throughout'},
  ],
},
// ── WEEK 3 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 3 — Stand Like a Speaker', pillar: 'Body',
  weekWord: 'Posture', weekWordDef: 'how you hold your body when you stand or sit',
  tip: 'Your body speaks before you say a word. Stand tall and the audience already trusts you!', tipIcon: '🧍',
  objectives: ['Students identify confident vs. closed body language','Students practise the 5-point body check (feet, hands, spine, shoulders, chin)','Students use deliberate gestures to reinforce their message'],
  improvGame: {
    name: 'Mirror Me',
    description: 'Partners mirror each other\'s body language — builds real awareness of what your body communicates!',
    instructions: [
      'Find a partner. Face each other about arm\'s length apart.',
      'Partner A: move slowly — arms out, head tilt, step, reach. No fast movements.',
      'Partner B: mirror exactly — every motion, every shift in weight.',
      'Switch after 30 seconds. Do 2 rounds total.',
      'Debrief: "What felt confident? What felt awkward? What made you pay attention to your partner?"',
    ],
  },
  prompt: 'If you could be any superhero for one day, who would you be and why?',
  timeLimit: 75, structure: ['🦸 Name your superhero ("I would be...")','💪 Your superpower ("My power is...")','🌍 What you would do ("I would use it to...")','⚡ Why you chose them ("I chose this hero because...")'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Mirror Me',
      steps:[
        {time:'0:00',action:'Stand at the front. Do NOT say "today is body week" yet. Instead, wordlessly plant your feet wide, throw your shoulders back, and make eye contact with three students one by one. Hold the silence for 5 seconds. Then dramatically slump: cross arms, look at floor, shuffle. "What changed? What did your brain tell you about me?" Take 3-4 answers. Then reveal: "Your body is broadcasting a signal before you say a single word. Today we learn to make that signal work FOR you — not against you."'},
        {time:'1:30',action:'Run Mirror Me. "Find a partner. Face each other. Partner A — move slowly: arms out, head tilt, reach up, step to the side. Partner B — mirror exactly. Every motion. Go." Give 30 seconds, then call "Switch!" Do 2 rounds. Circulate and give quiet encouragement.'},
        {time:'4:30',action:'Bring everyone back. Debrief: "What felt confident? What felt nervous? When your partner stood tall, how did you feel watching them?" Key insight: "Your body is also talking to your OWN brain — not just the audience. Stand strong and even YOU start to feel more ready. That\'s why superhero poses work."'},
        {time:'7:00',action:'"We\'re about to learn four body rules that will change how every single speech you give looks. Let\'s go."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Power 4 + Superhero Speeches',
      steps:[
        {time:'8:00',action:'Write POSTURE on the board. "Word of the Day: POSTURE — how you hold your body when you stand. Let\'s start with the Spot the Difference." Hold up the Body Language Bingo card (or draw two stick figures on the board): one slouching — feet together, arms crossed, looking down; one confident — feet apart, hands visible, looking out. "Call out what\'s different!" Take responses. "Which speaker would you choose to listen to for 2 full minutes? Why?"'},
        {time:'12:00',action:'Introduce The Power 4. Write each one as you say it. Hold up 1 finger: "STAND TALL — feet shoulder-width apart. Try it." Class stands. 2 fingers: "HANDS READY — at your sides or gesturing. Not in your pockets." Hold up your own hands. 3 fingers: "EYES OUT — look at the audience, not the floor. Pick one person, then shift." 4 fingers: "TAKE UP SPACE — fill your spot. Shy students make themselves small. Today we take up space." Practice each one as you name it.'},
        {time:'16:00',action:'Model the full Power 4 yourself. Do it deliberately — plant feet, show hands, sweep eyes across left-middle-right, stand wide. Then ask: "Did that change how I seemed to you before I said anything?" Then do the opposite: pocket hands, feet together, look at shoes, shrink. "Which version do you trust?" Exaggerate for laughs — students remember the contrast. "TEACHER TIP: If eye contact feels hard — look at their forehead. From 5 feet away, it looks identical to direct eye contact."'},
        {time:'20:00',action:'2 minutes to think about their superhero speech. Walk around and prompt quietly: "Who would you pick? What would you do with the power? What\'s one reason you chose this hero?" Students can sketch if needed — no writing required.'},
        {time:'22:00',action:'Speeches begin. Before each speaker: whole class does a quick Power 4 check together (class points to their own feet, hands, eyes, space). Speaker does Power 4, then starts. Use the visible Body Language Bingo card — hold it up silently if a student\'s hands go into pockets or eyes drop to the floor.'},
        {time:'23:30',action:'After each speech: class holds up 1-4 fingers (how many Power 4 rules the speaker hit). No words — just fingers. Speaker gets to see the honest count. Then move to the next speaker. Keep pace at about 2 minutes per student.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Power 4 Check-Out',
      steps:[
        {time:'52:00',action:'"Name the Power 4 from memory — I\'ll point to four students, one rule each." Then: "All together — stand up, do all four right now." Class does Power 4 together for 10 seconds. "That is your pre-speech checklist from today forward. Before you say anything — Power 4 first."'},
        {time:'54:00',action:'Star of the Day: the student who held the strongest body through their whole speech. Be specific: "I\'m choosing [name] because their feet never moved, their hands were always visible, and they swept their eyes across the whole room. That body is saying: I belong here. Trust me. That is what POSTURE does."'},
        {time:'56:00',action:'"Next week: MIND — the inside game of speaking. We talk about nerves, and why the butterflies in your stomach are actually cheering for you."'},
        {time:'57:00',action:'Closing ritual. Power Pose for 5 seconds (superhero stance — feet wide, hands on hips or arms out). Then: "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Body Language Bingo',emoji:'🎯',use:'Show "Spot the Difference" at 8:00 — hold up silently during speeches when body language slips'},
    {name:'Power 4 Card',emoji:'🧍',use:'Post on wall — point to each rule before speakers start; class holds up 1-4 fingers after each speech'},
  ],
},
// ── WEEK 4 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 4 — Mind: Brave Speaking', pillar: 'Mind',
  weekWord: 'Courage', weekWordDef: 'doing something even when you feel scared — especially when you feel scared',
  tip: 'Nervous = excited. Your butterflies aren\'t against you — they\'re cheering for you. Invite them in!', tipIcon: '🦋',
  objectives: ['Students identify physical signs of nervousness and label them as normal','Students practise Brave Breathing and Power Pose before a speech','Students understand that preparation — knowing your topic — builds courage'],
  improvGame: {
    name: 'Brave Breathing',
    description: 'A 60-second breathing exercise that physically calms nerves — use this before every speech from now on!',
    instructions: [
      'Stand up. Hands on your belly.',
      'Breathe IN through your nose for 4 counts — feel your belly push out.',
      'HOLD for 4 counts.',
      'Breathe OUT slowly through your mouth for 4 counts.',
      'Repeat 3 times. Then: Power Pose for 10 seconds. "Notice how different you feel."',
    ],
  },
  prompt: 'What is something you are REALLY good at? Tell us what it is and how you got good at it.',
  timeLimit: 60, structure: ['🎣 Hook','🌟 What you\'re good at ("I am really good at...")','💪 How you learned it ("I got good at it by...")','🏁 Big Finish'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🧘', title:'Brave Breathing + Nerve Check',
      steps:[
        {time:'0:00',action:'"MIND pillar today. Who here gets nervous before speaking?" Raise your own hand too. "Me too — every time. And every professional speaker does. Today we find out why that\'s actually a good thing."'},
        {time:'1:30',action:'Run Brave Breathing together — 3 full rounds. Count out loud: "In… 2… 3… 4. Hold… 2… 3… 4. Out… 2… 3… 4." Pause after the third round. "Notice your shoulders. Notice your breathing. That\'s your body calming itself down on purpose."'},
        {time:'4:00',action:'Power Pose: stand up, feet wide, hands on hips or arms wide — superhero style. Hold for 10 seconds. "Say inside your head: I am ready."'},
        {time:'5:30',action:'"What do nerves feel like in YOUR body?" Take 4-5 answers: heart racing, stomach fluttery, hands shaky, voice wobbly. Write them on the board. "Every single one of those is your body getting READY — not telling you to run away."'},
        {time:'7:00',action:'Point to the Three Pillars Poster at MIND. "MIND means be brave, be ready. Today we practise both."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'I\'m Really Good At — Speeches',
      steps:[
        {time:'8:00',action:'Write COURAGE on the board. "Word of the Day: COURAGE — doing something even when you feel scared. Especially when you feel scared." Ask: "Is courage the same as not being scared?" (No — it\'s acting despite the fear.)'},
        {time:'10:00',action:'Model the prompt yourself first. What are YOU genuinely good at? Include how you learned it — and mention that you failed first. "I wasn\'t good at it on day one. I got good at it by..." Students relax when they see the teacher is human.'},
        {time:'12:00',action:'"Before anyone speaks: Brave Breathing × 1 together. Then Power Pose for 5 seconds." Do it as a class. "This is your pre-speech ritual. We\'ll do this every week from now on."'},
        {time:'13:30',action:'Give students 2 minutes to think. Walk around — whisper encouragement to students who look stuck: "It can be anything — tying shoes, making tacos, being kind to your little brother."'},
        {time:'15:30',action:'Speeches begin. Each speaker does Brave Breathing × 1 silently before stepping up. Audience: thumbs up as each speaker walks to the front.'},
        {time:'16:30',action:'Feedback after each speech: ONE thing that showed courage — something specific. "I noticed you looked at three different people even though you were nervous. That\'s brave speaking."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Courage Circle',
      steps:[
        {time:'52:00',action:'"Finish this sentence out loud: Coming up here today took courage because…" Go around the circle. You go last. Honour every answer — no rushing, no laughing.'},
        {time:'55:00',action:'Star of the Day: the student who visibly pushed through nerves. Be specific: "I\'m choosing [name] because I could see they were nervous, they breathed, and they went for it anyway. That is what brave speaking looks like."'},
        {time:'56:30',action:'"Next week: THE HOOK — how to start your speech so powerfully that everyone leans in immediately."'},
        {time:'58:00',action:'Closing ritual. Brave Breathing × 1, Power Pose 5 seconds, then: "I AM A SPEAKER!" End with a fist bump or high five.'},
      ]},
  ],
  pictureCards:[
    {name:'Brave Breathing Card',emoji:'🌬️',use:'Show steps at warm-up — keep accessible for nervous speakers throughout the session'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to MIND pillar — courage, readiness, and preparation all live here'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Hook or No Hook?',
      steps:[
        {time:'0:00',action:'"Today you learn the single most important sentence of any speech — the FIRST ONE." Don\'t explain further. Just start: "Today I want to talk about dogs. I have a dog." Pause. "Was that interesting?" (No.) Try again: "What if your best friend could never tell you any secrets — but loved you more than anyone?" Pause. "Now which one made you want to hear more?" That\'s a hook vs. no hook.'},
        {time:'2:00',action:'Run two more pairs. Pair 2 — No Hook: "I\'m going to talk about pizza." / Hook: "If you had to eat ONE food for the rest of your life and it had to be perfect every time — what would it be?" Pair 3 — No Hook: "My topic is sports." / Hook: "Did you know the human brain makes you run faster when it\'s scared? That\'s why athletes train for pressure." After each pair: audience physically leans in or leans back. "Your body told you which one worked."'},
        {time:'5:30',action:'Reveal the 3 Hook Types. Write them on the board with an example of each. (1) ASK A QUESTION — "Have you ever wondered...?" (2) WOW FACT — "Did you know...?" (3) TINY STORY — "One morning I woke up and..." Post the Hook Types card on the wall. "These three live on that wall for the rest of the year."'},
        {time:'7:00',action:'"Before I explain today\'s speech, write your hook sentence — one sentence only. Pick your type first, then write it. You have 90 seconds." Circulate and help stuck students pick a type.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Rule-Change Speeches',
      steps:[
        {time:'8:00',action:'Write HOOK on the board. "Word of the Day: HOOK — the very first sentence that grabs everyone\'s attention. Your first 5 seconds decide whether people lean in or tune out. Today\'s prompt is about a school rule you\'d change. But we\'re not starting with the rule — we\'re starting with the hook." Point to the structure on board: Hook → Rule → Problem → Fix → Close.'},
        {time:'9:30',action:'Model a full speech yourself. Start with a strong hook (use the question type): "Have you ever sat in a class feeling like the rule was made for someone else and not you?" Then: "I would change the rule about..." Follow the 4-part structure, pointing to each part as you go. Keep it real — pick an actual rule. End with a clear closing. "Notice — I had your attention from the first sentence. That\'s the job of the hook."'},
        {time:'12:30',action:'2-minute prep. "Your hook is written. Now fill in the rest: the rule, why it\'s a problem, your fix, and your closing line. One idea per box — you don\'t need full sentences." Walk around and check that every student has their hook sentence ready. If not, help them build one. "Remember: start with a question, a wow fact, or a tiny story. Not \'Today I am going to talk about...\'."'},
        {time:'14:30',action:'Speeches begin. Before each speaker: class checks their own hook type (hold up 1, 2, or 3 fingers: 1 = question, 2 = wow fact, 3 = tiny story). Speaker says their hook. Audience holds up the number for the type they heard. Then the speech continues — keep the timer rolling.'},
        {time:'16:00',action:'After each speech: feedback is ONLY about the hook this week. "Did the hook grab you? Which type was it? What made it work — or what would make it stronger?" One observation per speech, keep it specific. Model the first one: "I heard a question hook — it made me want to know the answer immediately. Strong choice."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Hook Hall of Fame',
      steps:[
        {time:'52:00',action:'"What are the 3 Hook types?" Point to three students — one type each. "Which is hardest to write? Which is most fun to hear?" Quick show of hands for each. This reveals their preferences — useful for future sessions.'},
        {time:'54:00',action:'Hook Hall of Fame. "Class vote — whose hook grabbed you the most today? Show of hands for each hook you remember." The winner reads their hook sentence again. "That sentence is now on the board. That\'s the standard."'},
        {time:'56:00',action:'"Next week: THE THREE THINGS — how to build the middle of your speech so every point lands. Your hook got their attention. Now you have to keep it."'},
        {time:'57:30',action:'Closing ritual: each student says their hook sentence to a partner (not the whole class — fast and energetic). Then whole class: "I AM A SPEAKER!" Send-off.'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Transition Train',
      steps:[
        {time:'0:00',action:'"Today is MIND pillar — we\'re building the SKELETON of a speech." Hold up the Three-Part Train card. "See this train? Hook is the engine. Things 1, 2, 3 are the cars in the middle. Big Finish is the caboose. A speech without structure is a train with no tracks — it just crashes." Lay it out simply. Don\'t over-explain.'},
        {time:'1:30',action:'Run Transition Train: practice moving between points using linking words. You start: "My first point is... I love the beach because the waves are huge." Point to next student: "My SECOND point is... you can find amazing shells." Next: "My THIRD point is... and the best part is the food trucks." "Notice the words I used: first, second, third. Those are transition words — they tell the audience where they are in the speech." Do 2-3 rounds with different silly topics.'},
        {time:'5:30',action:'Write on board the Transition Words: FIRST... SECOND... THIRD... and the link words: ALSO... ANOTHER REASON... FINALLY... "Pick one set or the other. They all work. The key is: use SOMETHING between each point so the audience can follow." Students repeat the three transition options aloud together.'},
        {time:'7:30',action:'"Sketch 5 boxes right now: H / 1 / 2 / 3 / F. Write one word in each box for today\'s speech — your favourite day. Go." Give 90 seconds.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Favourite Day Speeches',
      steps:[
        {time:'8:00',action:'Write STRUCTURE on the board. "Word of the Day: STRUCTURE — the plan or shape of your speech. A speech with no structure is like a story that just stops. Nobody knows if you\'re done." Draw the train on the board: Hook (engine) → Thing 1 → Thing 2 → Thing 3 → Big Finish (caboose). "Your job today: fill all 5 cars."'},
        {time:'9:30',action:'Model a full speech yourself using the train. Say your hook first (question type: "What\'s the best day you\'ve ever had — not a birthday, not a holiday, a regular day that turned into something amazing?"). Then: Thing 1 (what happened first), Thing 2 (what happened next), Thing 3 (the best moment). Big Finish ("That\'s why [day] will always be my favourite"). Point to the train card as you hit each car. Then ask: "How many cars did I fill?" Class counts on fingers.'},
        {time:'12:00',action:'"You have 2 minutes to finish your 5-box plan. One keyword per box. If you can\'t think of Thing 3, think of the best single moment of your favourite day — that\'s your Thing 3." Walk around and check every student\'s plan. Nudge students who only have 2 things to add a third — even a tiny detail counts.'},
        {time:'14:00',action:'Speeches begin. While each student speaks, the class silently holds up fingers: 1 when Thing 1 is delivered, 2 for Thing 2, 3 for Thing 3. This keeps the audience actively listening AND gives the speaker real-time feedback that the structure is landing. After the speech: "How many cars did they fill? Did we get all 5?"'},
        {time:'16:00',action:'After each speech: ONE feedback comment about structure only. "Did they use transition words between points? Did I know when Thing 1 ended and Thing 2 began?" Model the feedback language: "I noticed you said \'also\' between each point — that made it easy to follow." Keep moving — pace is about 2 min per student.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Train Check',
      steps:[
        {time:'52:00',action:'"What are the 5 parts of today\'s speech?" Point to 5 students one by one: Hook / Thing 1 / Thing 2 / Thing 3 / Big Finish. Then say them together as a class. "That is the shape of a G1-2 speech from now on. Every single speech has these 5 parts."'},
        {time:'54:00',action:'Star of the Day: the student with the clearest structure — the one where you always knew which car they were in. Ask them to say their 3 Things again (just the 3 point summaries). "That\'s structure in action."'},
        {time:'56:00',action:'"Next week: THE BIG FINISH — how to end your speech so powerfully that people think about it after you\'re done. Right now you know the engine and the middle cars. Next week we build the caboose."'},
        {time:'57:30',action:'Closing ritual: say the full structure together ("Hook — Thing 1 — Thing 2 — Thing 3 — Big Finish!") in rhythm, then: "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Three-Part Train',emoji:'🚂',use:'Keep visible all session — point to each car as speakers deliver their speech parts'},
    {name:'Speech Skeleton',emoji:'🦴',use:'Use as a planning template during 2-min prep time'},
  ],
},
// ── WEEK 7 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 7 — The Big Finish!', pillar: 'Mind',
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Best Ending Ever',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: the last piece — THE BIG FINISH. And I\'m going to show you why it matters in 20 seconds." Give an example speech — any topic. End it by trailing off: "...and that\'s why I like dogs. Um. Yeah. That\'s all." Pause. "How did that feel?" (Awkward, like something\'s missing, anticlimactic.) "Now watch." Give the same speech but end with: "So next time you see a dog, remember — they\'re not just pets. They might be the most loyal thing in your life. Thank you." Pause. "What was different?"'},
        {time:'2:00',action:'Run Best Ending Ever. Give students two endings for the same speech and ask which one feels MORE finished: Weak: "And that\'s all I have to say about dogs." vs. Strong: "So remember — they\'re not just pets. They\'re the best secret-keepers in the world. Thank you." Do 2-3 pairs. Each time ask: "What made the second one better?" List the answers on the board.'},
        {time:'5:00',action:'Show the 3 steps of a Strong Ending on the board: (1) ECHO THE HOOK — say something that reminds people how you started. (2) REMIND YOUR POINTS — "So remember, I told you about..." (3) LASTING IMPRESSION — one sentence the audience will carry with them. "Notice: \'thank you\' is a sign-off, not a conclusion. The conclusion comes FIRST, then thank you."'},
        {time:'7:00',action:'"Write your Big Finish sentence for today\'s speech NOW — before prep time. Just the final line. One powerful sentence." Give 90 seconds. Walk around — help students who write "and that\'s all" replace it with something real.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'New Subject Speeches',
      steps:[
        {time:'8:00',action:'Write CONCLUSION on the board. "Word of the Day: CONCLUSION — the final part of your speech. The LAST thing you say is the thing they remember. Weak endings waste great speeches. Strong endings make people think." Point to the 3-step conclusion on board: Echo Hook → Remind Points → Lasting Impression.'},
        {time:'9:30',action:'Model a full speech yourself about a new school subject you\'d add. Use all 5 parts (hook → 3 things → big finish), but when you reach the ending, deliver it three ways: (1) Weak — trail off, "and yeah, that\'s my idea." (2) Medium — "So those are my three reasons." (3) Strong — echo your hook + one lasting sentence. Ask the class to rate each 1-5 with their fingers. The contrast is what they\'ll remember.'},
        {time:'13:00',action:'"You already wrote your Big Finish sentence. Now build the rest of your speech around it: hook, 3 things, and that final line." Give 2 minutes to fill in their 5-box plan. Walk around — check that every student\'s speech has a real ending written, not just "the end."'},
        {time:'15:00',action:'Speeches begin. Tell the audience: "Your ONE job while each person speaks is to listen for the landing. After each speech, hold up 1-5 fingers: how strong was the ending?" Speaker finishes. Class holds up fingers silently, 3 seconds. Then move on.'},
        {time:'16:30',action:'After each speech, ONE comment about the ending specifically. Was there an echo of the hook? Was there a lasting thought? Avoid "that was great" — push for: "I noticed you brought back the opening question at the end — that made it feel complete." Keep pace at ~2 min per student.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Ending Wall',
      steps:[
        {time:'52:00',action:'Ending Wall. Ask 4-5 volunteers to read ONLY their final line aloud — nothing else. Just the last sentence. Class rates the impact. "Which line will you still be thinking about when you leave today?" Write the best one on the board. "That\'s what a conclusion does."'},
        {time:'54:00',action:'Star of the Day: best Big Finish — the student whose final sentence had the most impact. Read it aloud again. Be specific: "This line worked because it echoed the opening AND left us with something to think about."'},
        {time:'56:00',action:'"Next week: A WHOLE SPEECH — all 5 parts together for the first time. Hook → Thing 1 → Thing 2 → Thing 3 → Big Finish. You now know every piece. Next week you put them all in one speech."'},
        {time:'57:30',action:'Closing ritual — but with a twist. Ask each student to deliver the send-off line ("I AM A SPEAKER!") as their own Big Finish: with a pause, with energy, and a freeze. Make it feel like an ending.'},
      ]},
  ],
  pictureCards:[
    {name:'Three-Part Train',emoji:'🚂',use:'Point to caboose (Big Finish car) — "the ending is as important as the engine"'},
    {name:'Conclusion Checklist',emoji:'🏁',use:'3-box card: Echo Hook ✓ / Restate Topic ✓ / Lasting Impression ✓'},
  ],
},
// ── WEEK 8 ──────────────────────────────────────────────────────────────────
{
  title: 'SpeakUp! Week 8 — A Whole Speech!', pillar: 'All',
  weekWord: 'Polish', weekWordDef: 'making something as smooth and confident as it can be by practising it many times',
  tip: 'A speech is not written — it is rehearsed. Today you prove you know every piece. Put them all together!', tipIcon: '✨',
  objectives: ['Students deliver a complete Hook → 3 Things → Big Finish speech using scaffold cards','Students give and receive specific feedback using the one-star/one-wish model','Students experience the full Prepare-Practice-Perform cycle'],
  improvGame: {
    name: 'Pre-Speech Ritual',
    description: 'Every speaker completes the same 4-step ritual before stepping to the front — from now on, every single week!',
    instructions: [
      'Step 1: Brave Breathing × 1 (in 4 / hold 4 / out 4).',
      'Step 2: Power Pose for 5 seconds.',
      'Step 3: Say inside your head — "I know my speech. I am ready."',
      'Step 4: Walk to the front, plant your feet, look at the audience. Begin.',
      'This ritual gives your body and brain something to DO instead of worrying.',
    ],
  },
  prompt: 'Pick any topic you love. Give us your BEST Hook → 3 Things → Big Finish!',
  timeLimit: 90, structure: ['🎣 Hook — your best opening sentence','📌 Thing 1','📌 Thing 2','📌 Thing 3','🏁 Big Finish — echo your hook + lasting thought'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'⭐', title:'Pre-Speech Ritual',
      steps:[
        {time:'0:00',action:'"TODAY: ALL THREE PILLARS. This is your first complete speech — hook, three things, big finish, all in one. You have trained every part. Today you put it together."'},
        {time:'1:00',action:'Teach and run the Pre-Speech Ritual as a class for the first time: Brave Breathing → Power Pose → inner "I am ready" → feet planted, eyes up. "From now on, every speaker does this ritual before stepping to the front. Every week. Even showcase day."'},
        {time:'4:00',action:'"Draw your Speech Sandwich: top bread = Hook, three fillings = Thing 1, 2, 3, bottom bread = Big Finish." Students air-draw or sketch quickly. Partner check: "Does your partner have both slices of bread and three fillings?"'},
        {time:'7:00',action:'Full body check together: feet wide, hands visible, spine tall, shoulders back, chin up. Then Brave Breathing × 1.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'My Best Speech Yet',
      steps:[
        {time:'8:00',action:'Write POLISH on the board. "Word of the Day: POLISH — making something as smooth as it can be by practising it. A speech sounds like a ramble before you rehearse it. Today it gets polished."'},
        {time:'9:30',action:'Quick reminder of all the skills learned so far: Hook types, level 4 volume, eye contact sweep (left-middle-right), hands visible, Big Finish with a freeze. "You know all of these. Today they go together."'},
        {time:'12:00',action:'2-minute prep. Students can use their Speech Sandwich sketch — just one word per box. Walk around and give quiet encouragement.'},
        {time:'14:00',action:'Speeches begin. Before each speaker: whole class does Pre-Speech Ritual together (30 seconds). Speaker then steps up.'},
        {time:'15:30',action:'After each speech: ONE STAR from one classmate (what specifically worked) + ONE WISH from teacher (one concrete thing to try next time). No vague "that was good" — require a specific observation.'},
        {time:'16:30',action:'Track: for each student, note one strength and one growth area quietly. You\'ll use this for showcase prep.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Strength Spotlight',
      steps:[
        {time:'52:00',action:'"Tell me one thing YOU did well today — not your neighbour, YOU." Go around the circle. If someone says "nothing," prompt: "Name one moment — what did your voice do? What did your body do?"'},
        {time:'55:00',action:'Star of the Day: student who put all three pieces together most cleanly — hook, three things, big finish. Name the specific moment that stood out.'},
        {time:'56:30',action:'"Next week: STORYTELLING — the most powerful type of speech. True stories that make people feel something real."'},
        {time:'58:00',action:'Closing ritual — loudest and most energetic one yet. "You just gave a whole speech. That\'s not small. I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Three-Part Train',emoji:'🚂',use:'Audience tracks which cars the speaker completes: Hook/3 Things/Big Finish'},
    {name:'Voice Dial',emoji:'🎚️',use:'Reminder: level 4 for a full speech'},
    {name:'Body Check Card',emoji:'🧍',use:'Full body check before each speaker steps up'},
    {name:'Hook Types Card',emoji:'🎣',use:'Reference during prep time for students who need a hook reminder'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Story Spine',
      steps:[
        {time:'0:00',action:'"Today we tell STORIES. Here\'s the truth: stories are speeches in disguise. Every great speech has a story inside it." Show the Story Mountain card. "A story has a shape — just like a speech. Today we learn that shape." Then launch straight into the warm-up.'},
        {time:'1:30',action:'Run Story Spine around the circle. You start: "Once upon a time..." Next student: "Every day..." Next: "Until one day..." Next: "Because of that..." Next: "Until finally..." Last: "And ever since then..." Complete the story! "Notice how each line CAUSED the next one — that\'s story structure." Do 2 full rounds with the group.'},
        {time:'5:30',action:'Reveal the Story Mountain on the card or draw it on the board: BEGINNING (who, where, when) → PROBLEM (something goes wrong) → END (how it resolved) → SO WHAT (what you learned or felt). "Every story needs all 4 parts. Without the beginning, we don\'t care. Without the problem, nothing happens. Without the end, we\'re left hanging. Without the \'so what\', it\'s just events — not a story."'},
        {time:'7:30',action:'"Think of a time something went wrong for you — a time you were proud, surprised, or helped someone. That\'s your story today. Put your finger on the peak moment — the most dramatic, surprising, or funny second. That\'s where your speech lives."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'My Story Speeches',
      steps:[
        {time:'8:00',action:'Write NARRATIVE on the board. "Word of the Day: NARRATIVE — a story with a beginning, a problem, an ending, and a \'so what.\' A story speech is DIFFERENT from a 3-point speech. Instead of arguments, you take the audience on a JOURNEY. They come with you. That\'s why stories are the most powerful form of speaking."'},
        {time:'9:30',action:'Model your own personal story first. Pick something real and a little vulnerable — a time you made a mistake, got scared, or were genuinely surprised. Follow the Story Mountain out loud: "So here\'s my beginning: I was [where, who, when]..." then the problem, then the end, then the so what. Make it 60-90 seconds. Don\'t rush the ending. "Did you come with me? Did you feel the \'so what\'?" Vulnerability from the teacher gives students permission to share real moments.'},
        {time:'12:00',action:'"Show, don\'t tell." Write on the board: NOT "I was scared" → YES "My hands were shaking so badly I dropped it twice." NOT "It was a great day" → YES "The kind of afternoon you don\'t want to end." "Details bring stories alive. Use picture words and feeling words — not just \'it was fun\' or \'I was happy.\'  Show me what fun LOOKED like."'},
        {time:'14:00',action:'5 minutes to prepare using the Story Mountain card (or draw 4 boxes on paper). Students fill in: Beginning / Problem / End / So What. "Your hook: start IN the action — not \'Today I will tell you about the time I...\'  Start mid-scene: \'It was 7am and everything was already going wrong.\'"'},
        {time:'19:00',action:'Speeches begin. Each student tells their story — 1 to 1.5 minutes. Audience listens for: Did it have all 4 parts? Could you feel the \'so what\'? After each: one classmate says which moment made them feel something — be specific. Keep feedback short. Coach for details: if a student says "I was scared," quietly prompt: "What did scared feel like in your body?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Story Mountain Check',
      steps:[
        {time:'52:00',action:'"What are the 4 parts of a story?" Point to 4 students — one part each: Beginning / Problem / End / So What. Then together: "What\'s the hardest part to remember?" (Usually the \'so what\' — it requires reflection, not just facts.) "That\'s exactly what makes storytelling an advanced skill. The \'so what\' is what separates a story from a list of events."'},
        {time:'54:00',action:'Star of the Day: the student whose story created the most FEELING in the room — the one that made the audience lean in or go quiet. Name the specific moment: "I\'m choosing [name] because when you said [specific detail], I felt it. That\'s show-don\'t-tell in action."'},
        {time:'56:00',action:'"Next week: THE FUNNY SPEECH — making people laugh ON PURPOSE. This is one of the most advanced speaking skills. We\'re going to learn the exact techniques that work."'},
        {time:'57:30',action:'Closing ritual. End on energy: "I AM A SPEAKER!"'},
      ]},
  ],
  pictureCards:[
    {name:'Story Mountain',emoji:'⛰️',use:'Planning template during prep — 4 stages: Beginning/Problem/End/So What — students draw/stamp their story on the mountain'},
    {name:'Hook Types Card',emoji:'🎣',use:'Remind: Tiny Story hook works especially well — start mid-action, not at the beginning'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Epic Fail Circle',
      steps:[
        {time:'0:00',action:'Go first yourself — share a genuinely embarrassing or ridiculous thing that happened to you. Make it good. Don\'t make it up. The real stuff is always funnier. "One time I..." Let yourself be a little vulnerable. The room will laugh WITH you. Then say: "That happened. It was awful. And it is now one of my best stories. That\'s the secret of comedic speaking — the worst moments become the best material."'},
        {time:'2:00',action:'Epic Fail Circle. Each student shares their most embarrassing or ridiculous moment — 20 seconds max, no more. Go fast around the circle. Class snaps for the funniest ones. "We are laughing WITH each other. Not AT each other. That is the foundation of all good humor. The moment you laugh at someone, you\'ve lost the audience. When you laugh at YOURSELF, you own the room."'},
        {time:'6:00',action:'"Now here\'s what we\'re going to do today: take that epic fail and turn it into a funny speech. But first — the techniques that make things actually funny. Watch."'},
        {time:'7:30',action:'"Today your ONLY job is to make at least one person in this room smile. A laugh is a bonus. A smile is the goal."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Funny Story Speeches',
      steps:[
        {time:'8:00',action:'Write TIMING on the board. "Word of the Day: TIMING — knowing exactly when to speak and when to stay silent. Comedy is not just what you say. It\'s WHEN you say it." Show the Joke Structure picture card: Setup → Setup → PUNCHLINE. "Two setups, one surprise. That\'s the shape of almost every joke ever told."'},
        {time:'9:30',action:'Teach the 4 techniques: (1) SURPRISE — set up one thing, deliver another. (2) EXAGGERATION — make it bigger, longer, more dramatic than real life. (3) THE RULE OF 3 — setup, setup, punchline. (4) THE PAUSE — say the setup... then WAIT... then deliver. Model the Rule of 3 yourself: "Three things I am terrible at: remembering names, cooking eggs, and apparently — keeping plants alive for more than two weeks." Two normal things, one unexpected. Then do it with the pause — say the setup, pause 3 full seconds, grin, then deliver the third thing.'},
        {time:'12:00',action:'Rule of 3 practice. Students build their own Rule of 3: "Three things I am really bad at..." or "Three things about [topic]..." Try it aloud with a partner first. Volunteers share. Class snaps for good pauses. "Did you feel the difference between saying it fast and saying it with the pause? The pause is doing the work."'},
        {time:'14:00',action:'Prep time: students take their epic fail story from the warm-up and plan a 1-minute funny speech. Required elements: (1) one Rule of 3, (2) one pause before the funniest moment, (3) one exaggeration. "Circle the funniest second in your story. That\'s where the pause goes. Mark it with a star." Give 3-4 minutes to plan.'},
        {time:'18:00',action:'Speeches begin. Audience: genuine reactions only — no suppressing laughs. After each speech: "Where was the pause? Did it land? What was the funniest word choice?" If a student rushes through their pause point, physically hold up your hand to make them wait — then nod. This is live coaching and it works.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Best Pause Award',
      steps:[
        {time:'52:00',action:'Class votes: who had the best comedic pause today? Show of hands for each candidate. The winner re-delivers just their punchline moment — setup, pause (hold it...), punchline. Let the room react. "That pause did all the work. That\'s timing."'},
        {time:'54:30',action:'"Humor is one of the most advanced speaking skills in the world. You can study comedy your whole life. Today you used real techniques. That is not a small thing." Celebrate every attempt — even jokes that didn\'t land. "The speaker who tried was braver than the one who played it safe."'},
        {time:'56:00',action:'"Next week: PICTURE TOPICS — you get a card, 30 seconds to prepare, 45 seconds to speak. No script, no warning. The most useful speaking skill in real life — this happens every time a teacher calls on you."'},
        {time:'57:30',action:'Closing: send-off with the pause. Lead the class: "I am a..." PAUSE 2 full seconds. Grin. "...SPEAKER!" Let them feel the timing in their own bodies.'},
      ]},
  ],
  pictureCards:[
    {name:'Pause Power Card',emoji:'⏸️',use:'Hold up to cue students to pause after their punchline — silent coaching'},
    {name:'Rule of Three',emoji:'3️⃣',use:'Show during warm-up and reference for students building their funny moments'},
  ],
},
{
  title: 'SpeakUp! Week 11 — Picture Topics: Quick Speaking', pillar: 'Voice',
  weekWord: 'Impromptu', weekWordDef: 'speaking with very little preparation — thinking on your feet and going for it',
  tip: 'Don\'t try to be perfect. Just START — and keep going. Talking your way through is always better than freezing!', tipIcon: '⚡',
  objectives: ['Students experience impromptu speaking using picture prompts','Students practise the 30-second prep → 45-second speak format','Students learn to keep talking even when they\'re not sure what comes next'],
  improvGame: {
    name: 'One-Sentence Picture',
    description: 'Fast visual warm-up — teacher holds up a picture, students say one sentence about it in 5 seconds!',
    instructions: [
      'Teacher holds up a random picture card: rubber duck, mountain, pizza, rocket, cat.',
      'Students have 5 seconds, then one student says one sentence about it.',
      'Go around the room fast — one picture per student, one sentence per picture.',
      'No wrong answers. Celebrate unusual or funny ideas.',
      'Last round: students have only 3 seconds before speaking.',
    ],
  },
  prompt: 'Draw a picture topic card. You have 30 seconds to look at it and think. Then speak about it for 45 seconds!',
  timeLimit: 45, structure: ['🎣 Start with "This picture makes me think about..."','📌 One idea about the picture','📌 Another idea or a tiny story','🏁 One closing sentence'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'⚡', title:'One-Sentence Picture',
      steps:[
        {time:'0:00',action:'"Today is a different kind of session. You\'re going to speak with almost NO preparation. This is called IMPROMPTU speaking — the most useful speaking skill in real life. This happens every time a teacher calls on you in class. We\'re going to get good at it."'},
        {time:'1:00',action:'Run One-Sentence Picture around the room. Keep the energy fast. Hold up each card for exactly 5 seconds before pointing to the next student. If someone freezes: "Any sentence! Tell me one thing the picture makes you think of." Accept anything and celebrate it.'},
        {time:'6:00',action:'"The secret to impromptu speaking: do not wait until you have the perfect thing to say. Just start talking — your brain will catch up." Write on the board: JUST START.'},
        {time:'7:00',action:'"Today: 30 seconds to look at your picture and think. Then 45 seconds to speak. That\'s it."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Quick Speak Rounds',
      steps:[
        {time:'8:00',action:'Write IMPROMPTU on the board. "Word of the Day: IMPROMPTU — a topic right now, speak very soon. No script, no notes. Just you and your voice."'},
        {time:'10:00',action:'Demo the format yourself: draw a picture card, look at it for 30 seconds (timer visible), then speak for 45 seconds. Use "This picture makes me think about..." as a starter. Model what to do when you run out of ideas: look at a specific detail in the picture and describe it. It buys thinking time.'},
        {time:'12:00',action:'Students draw picture cards face-down. Flip all at once. 30 seconds silent thinking — timer visible. Then go one by one. Use a visible 45-second timer.'},
        {time:'13:30',action:'While each student speaks: if they stop, quietly prompt them. "Tell me more about the [specific thing in their picture]." Or point to a detail. Do NOT let them give up — gently keep them going.'},
        {time:'16:00',action:'After each speaker: ONE positive observation. "I noticed you kept talking even when it got hard — that\'s impromptu speaking." Keep energy positive and specific.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Debrief',
      steps:[
        {time:'52:00',action:'"Three questions: (1) Was it harder to have too much to say or not enough? (2) What did you do when you ran out of ideas? (3) What trick did you discover today?" Take responses from 4-5 students each.'},
        {time:'55:00',action:'Star of the Day: student who kept going the longest without stopping. Name the specific moment: "I noticed [name] ran out of ideas and then looked at one detail in the picture and found something new. That\'s the skill."'},
        {time:'57:00',action:'"Next week: PERFORMING — practising something so well it feels natural. We start getting ready for showcase."'},
        {time:'58:30',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Feeling Faces',emoji:'😊',use:'Optional: hold up mid-session to help a student who freezes pick a feeling to speak about'},
    {name:'Hook Types Card',emoji:'🎣',use:'Reference if students need a starter beyond "This picture makes me think about..."'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Speech Sandwich + Repeat After Me',
      steps:[
        {time:'0:00',action:'"Today is ALL THREE PILLARS. Every skill we\'ve practised — Voice, Body, Mind — goes into one speech today." But before we start: run Repeat After Me. Say "I am a GREAT speaker!" — bored, flat, no energy. Class repeats bored. Now say it with full excitement. Class repeats excited. Now superhero version: chest out, big voice, power pose. "Same words. What changed? That\'s PERFORMANCE. Today you don\'t just speak — you perform."'},
        {time:'2:00',action:'Speech Sandwich. Draw on the board: top bread = HOOK, three fillings = THINGS 1/2/3, bottom bread = BIG FINISH. "Without the top bread, your speech falls apart. Without the bottom, it\'s not a sandwich — it\'s just ingredients." Students air-draw their own sandwich and label it with today\'s topic (teacher for a day).'},
        {time:'5:30',action:'Partner check: "Does your partner have both slices of bread? Does their sandwich have exactly 3 fillings?" Quick Power 4 body check together: feet wide, hands visible, eyes out, take up space. Then Brave Breathing × 1 as a class: "In 2 3 4... hold... out 2 3 4." "You have trained every piece of this. Today it all goes together."'},
        {time:'7:30',action:'"Quick — write one word per box in your sandwich. Hook idea, Thing 1, Thing 2, Thing 3, Big Finish. 90 seconds. Go." Circulate fast.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Teacher-for-a-Day Speeches',
      steps:[
        {time:'8:00',action:'Write POLISH on the board. "Word of the Day: POLISH — making something as smooth and confident as possible by practising it. A speech sounds like a ramble before you rehearse it. Today it gets polished." Quick lightning round of everything learned: "Hook types?" (question, wow fact, tiny story). "Volume?" (level 3-4). "Power 4?" (class does it). "Big Finish?" (echo + lasting thought). "You know all of this. Today it goes in one speech."'},
        {time:'10:00',action:'Model a teacher-for-a-day speech yourself — start with a strong hook, hit all 3 changes, and land a real Big Finish. Point to the sandwich as you go through each layer. After: "Notice what I did with my BODY the whole time — feet planted, hands visible, eyes moving. That\'s not an accident. It\'s a choice."'},
        {time:'12:00',action:'2 minutes prep. Students use their Speech Sandwich plan. Walk around — check that every student has a hook (not "My name is... Today I will tell you about...") and a Big Finish (not "...that\'s all I have to say"). Nudge: "What would your FIRST sentence be? Say it to me right now." Help them refine the hook in the moment.'},
        {time:'14:00',action:'Before the first speaker: the whole class does the Pre-Speech Ritual together — Brave Breathing × 1 (30 seconds), then Power Pose 5 seconds, then students say silently in their heads "I know my speech. I am ready." Speaker then steps up.'},
        {time:'15:30',action:'Speeches begin. After each: ONE STAR from one classmate (what specifically worked — name the exact moment), then ONE WISH from teacher (one concrete thing to try next time). No vague "that was great." Require specificity. "I liked when you..." / "Next time, try..." As you listen, write one strength and one growth area per student quietly — you\'ll use this for showcase prep.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Strength Spotlight',
      steps:[
        {time:'52:00',action:'"Tell me one thing YOU did well today. Not your neighbour — YOU." Go around the full circle. If someone says "nothing," prompt: "Name one moment — what did your voice do? What did your body do? What did you say that surprised you?" Don\'t let anyone off the hook. Every student names one real thing.'},
        {time:'55:00',action:'Star of the Day: the student who put all three pieces together most cleanly — hook, three things, big finish, with Voice + Body + Mind all working. Name the specific moment that stood out. "I\'m choosing [name] because in that one minute, everything we\'ve practised was visible."'},
        {time:'56:30',action:'"Next week: INFORMATIVE vs. PERSUASIVE — the two kinds of speeches you\'ll give for the rest of your life. Teaching vs. convincing. You\'ll try both."'},
        {time:'58:00',action:'Closing ritual — loudest one yet. "You just gave a complete speech with all three pillars. That is not small. I AM A SPEAKER!"'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Teach It or Sell It?',
      steps:[
        {time:'0:00',action:'"MIND pillar. Today: WHY are you giving a speech? Because the purpose completely changes how you speak." Don\'t explain further. Just do it: "Dolphins are mammals. They breathe air and feed their babies milk. They can live up to 50 years." Pause. "What did I just do?" (Taught them something.) Now switch: "We NEED to protect dolphins. Without them, the ocean ecosystem breaks down — and that means OUR food supply breaks down too. You have to care about this." Pause. "Same topic. What was different?"'},
        {time:'2:00',action:'Run Teach It or Sell It. Give 4 quick pairs — one informative, one persuasive. Each time students hold up either TEACH or SELL card (or just shout it). Examples: "Cats sleep 16 hours a day." (Teach) / "Every child should be allowed to have a cat — studies show pet owners have lower anxiety." (Sell). After 4 pairs: "What clues told you which was which?" Collect answers: opinion words (should, must, believe), feeling words, facts vs. arguments.'},
        {time:'5:00',action:'Students try with PIZZA in pairs: 20 seconds informative, then 20 seconds persuasive. Switch roles. "Pizza is made from dough, tomato sauce, and cheese." vs. "Pizza should be served in school every week — it\'s one of the few foods kids actually eat." Share one pair with the class.'},
        {time:'7:00',action:'Write two columns on the board: TEACHING (lightbulb — "I want you to KNOW") vs. CONVINCING (arrow — "I want you to DO or BELIEVE"). Write key language under each: Teach: "Did you know... This means... The reason is..." / Convince: "You should... I believe... We must..."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Two-Sentence Challenge + Full Speeches',
      steps:[
        {time:'8:00',action:'Write PURPOSE on the board. "Word of the Day: PURPOSE — the reason you\'re giving a speech. Without a purpose, your speech goes nowhere. Before every speech for the rest of your life, ask yourself: am I TEACHING or CONVINCING? The answer changes your words, your tone, and your gestures."'},
        {time:'9:30',action:'Two-Sentence Challenge. Each student picks a picture topic card. They give ONE informative sentence, then ONE persuasive sentence about the same topic. Example: "Dogs are mammals with 4 legs and 300 million smell receptors." (Inform) / "Everyone should have a dog because they make you less lonely." (Persuade). Class sorts each: TEACH or SELL? This shows them the difference at the sentence level before we go to full speeches.'},
        {time:'14:00',action:'Full speeches begin. Each student picks one topic they know well and gives TWO 60-second speeches: informative first, then persuasive. Between the two speeches, they can take 30 seconds to adjust their plan. Remind: "Your HOOK will be different for each type. A wow fact hook works for informative. A question hook works for persuasive."'},
        {time:'16:30',action:'After each pair of speeches: audience votes — "Which type suited this topic better? Which was harder to write? Which was more interesting to hear?" Track the class patterns — you\'ll see which students naturally gravitate toward one mode. Note this for showcase guidance.'},
        {time:'44:00',action:'"Before we wrap up — quick show of hands. Who is leaning TEACH for their showcase? Who is leaning CONVINCE?" This is not a commitment — just direction. Note any students who don\'t raise their hand for either; they\'ll need extra guidance in W14-15 to settle on a topic and mode.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Purpose Declaration',
      steps:[
        {time:'52:00',action:'"Finish this sentence — no thinking, just answer: My speeches are usually more..." and point around the room. Note who says TEACH vs. CONVINCE — this reveals their natural voice. Neither is better. Both are needed. "The best speakers can do both — today you proved you can."'},
        {time:'54:00',action:'Each student says out loud: "My showcase speech will be [TEACH / CONVINCE] about ___." Go around the full circle. If a student doesn\'t have a topic yet: "Pick one thing you know more about than anyone in this room. That\'s your topic." This is not final — but it starts the thinking.'},
        {time:'56:00',action:'"Next week: BEING A GREAT AUDIENCE MEMBER — how to listen carefully and give feedback that actually helps the speaker grow. This is harder than it sounds."'},
        {time:'58:00',action:'Closing ritual. "I AM A SPEAKER!" — and this week, say it in the most CONVINCING voice possible.'},
      ]},
  ],
  pictureCards:[
    {name:'Inform vs. Persuade Card',emoji:'🎯',use:'Post on wall — two columns: TEACHING (lightbulb) vs. CONVINCING (arrow) with key language under each'},
    {name:'Hook Types Card',emoji:'🎣',use:'Different hooks suit different purposes — wow fact for inform, question for persuade'},
  ],
},
{
  title: 'SpeakUp! Week 14 — Being a Great Audience Member', pillar: 'Mind',
  weekWord: 'Feedback', weekWordDef: 'specific, kind information you give a speaker to help them grow',
  tip: 'Great feedback is a gift. Vague feedback is wrapping paper with nothing inside. Be specific!', tipIcon: '🎁',
  objectives: ['Students understand that being a great audience member is a learnable skill','Students practise giving specific, kind feedback using the Feedback Sandwich','Students experience both giving and receiving careful feedback'],
  improvGame: {
    name: 'Vague vs. Specific',
    description: 'Two pieces of feedback for the same speech — students vote on which actually helps the speaker!',
    instructions: [
      '"I liked your speech." (Vague — what does the speaker DO with that?)',
      '"I liked how you looked at the audience the whole time." (Specific — useful!)',
      '"Good job." vs. "Your voice was so loud I could hear every word from the back row."',
      'Students practise turning 3 vague pieces of feedback into specific ones in pairs.',
      'Share: what made the specific feedback harder to give? What made it more helpful?',
    ],
  },
  prompt: 'Teacher delivers a 1-minute speech. Students evaluate it using the Feedback Sandwich!',
  timeLimit: 60, structure: ['🍞 TOP BREAD: "What I liked was... [specific thing] because [why it worked]"','🥬 FILLING: "One thing to try next time: [one specific suggestion]"','🍞 BOTTOM BREAD: "I\'m excited to see you..."'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'👂', title:'Vague vs. Specific',
      steps:[
        {time:'0:00',action:'"Today\'s skill might surprise you: being a great audience member is just as important as being a great speaker. The best audiences make speakers better. The best feedback changes how someone grows." Set it up as a serious, respected skill.'},
        {time:'1:00',action:'Run the Vague vs. Specific game. Read each pair aloud — vague first, specific second. "Which helps the speaker? Which could they actually USE?" Students should be clear by pair 2.'},
        {time:'5:00',action:'Pairs practice: Student A gives 30 seconds of anything. Student B gives one vague piece of feedback, then improves it into a specific one. Switch. Circulate and coach.'},
        {time:'7:30',action:'Collect 2-3 specific feedback examples from the class — write them on the board. "This is what we\'re aiming for today."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'The Feedback Sandwich',
      steps:[
        {time:'8:00',action:'Write FEEDBACK on the board. "Word of the Day: FEEDBACK — specific, kind information that helps someone grow. Not just kind. Not just specific. BOTH." Draw the Feedback Sandwich: top bread / filling / bottom bread.'},
        {time:'10:00',action:'Teach the Feedback Sandwich: TOP BREAD = one specific thing you liked + why it worked. FILLING = one thing to try next time (one suggestion only). BOTTOM BREAD = one encouraging closing line. Model the bad version first ("It was OK but you talked too fast"), then the sandwich version.'},
        {time:'12:00',action:'"I\'m going to give a 1-minute speech. Your job: evaluate me using the Feedback Sandwich." Give a real 1-minute speech with deliberate strengths and one area to improve. Make it specific enough that they can actually give feedback.'},
        {time:'14:00',action:'Class evaluates together: "What was my top bread?" Take 3 answers, pick the best. "What\'s the filling?" Take 3 answers. "Bottom bread?" Then 2-3 students deliver their full sandwich aloud.'},
        {time:'17:00',action:'Pairs: one student gives a 60-second speech. Partner gives a full Feedback Sandwich. Switch. Walk around — coach for specificity: "Can you name the moment, not just the skill?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'3 Things Great Audience Members Do',
      steps:[
        {time:'52:00',action:'"Three things a great audience member does." Write as you say them: (1) LISTENS — eyes on the speaker, not looking around. (2) NOTICES — pays attention to voice, body, and what\'s being said. (3) RESPONDS — snaps or claps when the speaker finishes, gives a Feedback Sandwich when asked. "Starting today, I expect all three from everyone in this room."'},
        {time:'55:00',action:'Star of the Day: student who gave the most specific, useful Feedback Sandwich. Read their sandwich aloud as an example of what great feedback sounds like.'},
        {time:'57:00',action:'"Showcase is in 2 weeks. You\'re going to be both a speaker AND a great audience member. Start thinking about your showcase topic."'},
        {time:'58:30',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Feedback Sandwich Card',emoji:'🥪',use:'Show during main activity — keep visible as reference while pairs practise'},
    {name:'Showcase Checklist',emoji:'✅',use:'Briefly introduce: Hook ✓ / Three Things ✓ / Eye Contact ✓ / Volume ✓ / Big Finish ✓'},
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
  title: 'SpeakUp! Week 1 — Introduction to Public Speaking', pillar: 'All',
  weekWord: 'Pillar', weekWordDef: 'a fundamental support — Voice, Body, and Mind are the three pillars of great public speaking',
  objectives: ['Every student stands up and speaks in front of the class on Day 1','Students identify where public speaking lives in the real world','Students learn the 3 Pillars framework through live teacher demos','Students co-create class norms they will own all year'],
  improvGame: {
    name: '30-Second Introductions',
    description: 'No prep, timer strict — every student stands and delivers: name + one surprising fact + why they\'re here.',
    instructions: [
      'Clear a speaking spot at the front. Set a visible 30-second timer.',
      'Teacher goes first: name, one surprising fact, why public speaking matters to you.',
      'After teacher finishes, class snaps — snaps say "I hear you; I honor you."',
      'Each student stands, faces the class, delivers their intro. Timer starts when they begin.',
      'Teacher says only "Thank you, [name]." — no coaching yet. Goal is just standing up.',
      'If a student freezes: "Take your time. Name, one fact, why you\'re here." Wait 5 seconds.',
    ],
  },
  prompt: 'Today\'s activity: 30-Second Introduction. Stand up, face the class, and tell us: your name, one surprising fact about yourself, and why you are here.',
  timeLimit: 30,
  structure: ['👤 Your name','💡 One surprising fact about yourself','🎯 Why you are here / why public speaking matters to you'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'30-Second Introductions',
      steps:[
        {time:'0:00',action:'Clear a speaking spot at the front and set a visible 30-second timer. Tell students: "I\'m going to go first. When I finish, give me snaps — that\'s how we show appreciation in this room. Snaps after every speaker, every time."'},
        {time:'0:30',action:'Model the intro yourself: name + one surprising fact + why public speaking matters to you. Aim for 25–30 seconds. Stop when the timer ends.'},
        {time:'1:00',action:'Before calling anyone up, write three sentence starters on the board — keep them visible for the whole round:\n\n  • "My name is ___"\n  • "One surprising fact about me is ___"\n  • "I\'m here because ___"\n\nTell the class: "These are your lifelines — use all three, or just start with the first one if you freeze. The board stays up for everyone." Then set the ground rules: "Audience stays silent while someone speaks. Snaps after every speaker. No coaching, no laughing — today is only about building the muscle of standing up front."'},
        {time:'1:30',action:'Call students one at a time. Set timer to 30 sec. Student stands, faces the class, and uses the board lines as needed. Class snaps after each. Teacher says only: "Thank you, [name]." No feedback yet. If a student freezes beyond 5 seconds, point calmly to the board and say quietly: "Start with the first line."'},
        {time:'7:00',action:'After everyone has gone: "You just did something many adults avoid their whole lives. That is where we start — and we go further from here every single week."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Where People Speak · The 3 Pillars · Class Norms',
      steps:[
        {time:'8:00',action:'Part 1 — Where Do People Speak Publicly? Ask: "Where in the world do people speak in front of others? Shout it out — I\'ll write everything on the board." Write fast, accept everything. Aim for 20+ ideas in 4–5 minutes.'},
        {time:'13:00',action:'Group the ideas on the board: Justice & government (courtrooms, town halls, rallies) · Business & career (job interviews, pitches, press conferences) · Community & faith (services, funerals, organizing) · Media & entertainment (podcasts, YouTube, TEDx, standup) · Everyday life (wedding toasts, graduation, giving directions). Then: "You are all already public speakers. This class just makes you better at something you are already doing."'},
        {time:'20:00',action:'Part 2 — The 3 Pillars. Say: "Every great public speaker uses three tools. We call them the 3 Pillars: Voice, Body, and Mind. I\'m going to show you each one at its worst — and then at its best. Watch and notice what changes."'},
        {time:'21:00',action:'VOICE demo (6 min): Bad first — drop to a mumble, look at the floor, rush your words. Ask: "What did you notice? What made that hard to listen to?" Good version: project clearly, pause after key words, vary pace, make deliberate eye contact. Ask: "What was different?" Write on board: VOICE = Volume · Pace · Clarity · Expression'},
        {time:'27:00',action:'BODY demo (6 min): Bad first — slump, fidget, avoid eye contact, stand sideways. Good version: plant feet shoulder-width, open posture, make eye contact with three different students across the room. Ask: "Did the second version feel more credible? Why?" Write on board: BODY = Posture · Gestures · Eye Contact · Space'},
        {time:'33:00',action:'MIND (4 min): "The third pillar is invisible — it lives in here." [Point to your head.] "It\'s confidence, emotional connection, preparation, and focus. A speaker with a great voice and great body but a checked-out mind is just performing. The mind is what makes it real." Write on board: MIND = Confidence · Connection · Preparation · Focus'},
        {time:'37:00',action:'"These three pillars are the foundation of everything we\'ll do this year. Every week we\'ll isolate one — but all three work together. Keep them visible." Leave the 3 Pillars on the board for the rest of the year.'},
        {time:'38:00',action:'Part 3 — Co-Create Class Norms. Ask: "What does the best possible audience look like — for a speaker who is scared?" Take answers and write them on a large sticky note or poster sheet at the front. After 8–10 contributions, cluster into 3–5 norms.'},
        {time:'46:00',action:'Read each norm aloud. Ask the class to vote with snaps if they agree. Only adopt norms with near-unanimous snaps. Title the poster: OUR ROOM RULES — put it on the wall today. Norms to guide toward if class gets stuck: "We are silent when someone is speaking." / "We snap or clap — we never laugh at a speaker." / "We give feedback to help, not to show off." / "We try even when it\'s scary."'},
        {time:'51:00',action:'"These are your rules. I did not write them — you did. I\'ll hold you to them, and I expect you to hold each other to them."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'One-Word Reflection + Preview',
      steps:[
        {time:'52:00',action:'One-word reflection: "One word that describes how you feel about this class right now. Just one word. I\'ll go first." Go around quickly — no sentences, just one word each. Accept everything without comment.'},
        {time:'57:00',action:'Preview Week 2: "Next week we zoom in on the first pillar: Voice. You\'ll learn how to project, pace, and use silence as a tool. Between now and then — notice voices. In class, at home, in movies. What makes someone easy or hard to listen to?"'},
        {time:'59:00',action:'Closing ritual: all stand. Class snaps together three times. Teacher: "See you next week."'},
      ]},
  ],
  pictureCards:[
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Post permanently in room for the whole year — Voice/Body/Mind framework'},
    {name:'Our Room Rules',emoji:'📋',use:'Co-created with students today — mount on wall, refer to it every session'},
  ],
},
{
  title: 'SpeakUp! Week 2 — Voice: Project, Pace & Variety', pillar: 'Voice',
  weekWord: 'Projection', weekWordDef: 'aiming your voice at the back wall so the whole room can hear',
  tip: 'Projection = breathe from the diaphragm, open the mouth, aim at the back wall. Time a 2-second pause for the class — it always feels shorter than they expect. Audio-recording one session is powerful: students are shocked by their actual pace.', tipIcon: '🎙️',
  objectives: ['Students project without yelling','Students control pace intentionally','Students use pitch and pause for deliberate effect'],
  improvGame: {
    name: 'Vocal Warm-Up Sequence',
    description: '3-minute sequence — use this at the start of every session to loosen the voice.',
    instructions: [
      'Lip trills for 30 seconds — loosens face and breath.',
      'Hum and feel the vibration in your chest (30 sec).',
      '"The tip of the tongue, the teeth, the lips" — 3 times, getting faster.',
      'Count 1-10, getting louder on each number.',
      'Count 10-1, getting slower on each number.',
    ],
  },
  prompt: 'Give us "The sky is falling" — five different ways!',
  timeLimit: 90, structure: [
    '📢 VOLUME: aim at the back wall, not the front row',
    '🐢 PACE: slow on important words, faster on lists',
    '⏸️ PAUSE: 2 seconds of silence says "this matters"',
    '🎵 PITCH: vary it — monotone puts people to sleep',
    '🔤 CLARITY: over-enunciate consonants; do not swallow endings',
  ],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Vocal Warm-Up Sequence',
      steps:[
        {time:'0:00',action:'Tell the class: "Today\'s pillar is VOICE — volume, pace, pitch, pause, and clarity as deliberate tools. We start with a 3-minute physical warm-up. This sequence starts every SpeakUp session from now on." Run all five steps back to back with no gap.'},
        {time:'0:30',action:'Lip trills: 30 seconds — everyone buzzes their lips. Model it without embarrassment. "This loosens your face and connects your breath."'},
        {time:'1:00',action:'Hum: 30 seconds. "Put your hand on your chest — feel the vibration. That\'s your resonance. The more you feel it, the more the audience feels you."'},
        {time:'1:30',action:'"The tip of the tongue, the teeth, the lips." Say it once slowly, then faster, then fastest. 3 rounds together. Articulation drill.'},
        {time:'2:30',action:'Count 1-10, one number louder each time. Then 10-1, one number slower each time. Debrief: "Notice how much range you have? That range is your toolkit."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Voice Toolkit + Same Sentence 5 Ways + Excerpt Practice',
      steps:[
        {time:'8:00',action:'Write THE VOICE TOOLKIT on the board — 5 tools: VOLUME (aim at the back wall) / PACE (slow on key words, faster on lists) / PAUSE (2 seconds = "this matters") / PITCH (vary it — monotone loses the room) / CLARITY (over-enunciate consonants; never swallow endings). Read each aloud and give a quick demo. "These are your 5 tools. Today you use all of them."'},
        {time:'13:00',action:'THE SAME SENTENCE, 5 WAYS. Write on the board: "The sky is falling." Demo each version: (1) Monotone — flat, robotic. (2) Too fast — sprint through it. (3) Too quiet — barely audible. (4) Dramatic pause before "falling" — "The sky is… falling." (5) Full vocal expression — pitch, pace, volume all varied. After each version, students call out which toolkit tool is being demonstrated. Make the contrast obvious.'},
        {time:'20:00',action:'"Now you try. Everyone say \'The sky is falling\' four times in a row — monotone, too fast, pause before \'falling\', then full expression." Do it all together simultaneously. Then pick 3-4 students to perform individually. Give specific feedback on which tool each student used best.'},
        {time:'28:00',action:'EXCERPT PRACTICE. Each student gets or chooses a 3-4 sentence excerpt (from a book, script, or their own writing). They practise it using at least 3 Voice Toolkit tools. 4 minutes to prepare — annotate the excerpt: underline where to pause, circle words to slow down, mark where to vary pitch.'},
        {time:'32:00',action:'Partners give feedback using the Voice Toolkit checklist: one tool used well + one tool missing. Then 4-5 students deliver their excerpt to the full group. Class names the toolkit tools they heard after each performance — specifically, not vaguely.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Voice Toolkit Check-Out',
      steps:[
        {time:'52:00',action:'"Name all 5 toolkit tools — no looking." Call on students: VOLUME, PACE, PAUSE, PITCH, CLARITY. "Which did you use best today? Which is still weakest?" Take 4-5 honest answers. Do not correct — awareness is the goal.'},
        {time:'55:00',action:'Star of Day: the student with the most deliberate use of the toolkit — someone who made a visible choice to change their voice at a specific moment. Name the exact moment: "At 0:45, they paused for a full 2 seconds before the key word. The room leaned in."'},
        {time:'56:30',action:'"Next week: BODY LANGUAGE. Start noticing this week: how do people\'s bodies change when they speak in front of a group?"'},
        {time:'58:00',action:'Closing ritual — three versions in a row. "I AM A SPEAKER!" — quiet and slow. Then full volume and expression. Then crisp, articulated, every consonant. "Five tools. One sentence. That\'s the toolkit." Fist bump or high five as students leave.'},
      ]},
  ],
  bonusActivities:[
    {
      name:'Hot Seat',
      emoji:'🔥',
      duration:'5–15 min',
      when:'If excerpt practice finishes early or students have energy left after wrap-up',
      instructions:[
        'One student sits in a chair facing the class — this is the Hot Seat.',
        'The class asks any question (teacher filters anything unkind).',
        'The speaker must answer in EXACTLY 3 sentences — no more, no less.',
        'They must use at least 2 Voice Toolkit tools visibly (e.g. pause before a key word, vary pitch).',
        'Class calls out which tools they heard after each answer.',
        'Run until time is up — swap the speaker every 2-3 questions.',
        'Teacher tip: if a student struggles to stop at 3 sentences, hold up fingers as a visible count.',
      ],
    },
  ],
  pictureCards:[
    {name:'Voice Toolkit',emoji:'🎙️',use:'Written on board at 8:00 — keep visible all session; students refer to it during excerpt practice and partner feedback'},
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
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Body Language Speed Read + Mirror Master',
      steps:[
        {time:'0:00',action:'Don\'t explain. Just freeze at the front: slouched, arms crossed, looking at the floor. Hold it for 5 full seconds. Then: ask students to call out what they observe. Write their words on the board: bored, closed, untrustworthy, nervous. Now switch: stand tall, open arms slightly, slow eye contact left-to-right. Hold for 5 seconds. "What changed?" "Same person. Same content. Your brain processed me differently in each version — in under 2 seconds. That is BODY pillar." Then launch Mirror Master.'},
        {time:'1:30',action:'Mirror Master pairs. Face each other. Partner A leads: gestures, posture shifts, head tilts — slow and deliberate. Partner B mirrors exactly. 60 seconds. Switch. "Round 2: both try to achieve commanding presence simultaneously — tall, still, hands open." Let them negotiate non-verbally. Debrief: "What habits did you notice in your partner? In yourself — where did you start to fidget, sway, hide your hands?"'},
        {time:'5:00',action:'Introduce the 5-Point Body Check. Write each one: (1) FEET — shoulder-width, planted. No swaying. (2) CORE — upright, shoulders back and down. (3) HANDS — open and visible. Gestures welcome; fidgeting banned. (4) FACE — expressive, mirrors your words. (5) EYES — slow scan, 3-4 seconds per section of audience. "Three rules from today on: no swaying unless you\'re making a point with it, no hiding hands, no pacing without purpose."'},
        {time:'7:30',action:'"Video this class if possible — body language is nearly impossible to self-diagnose. If you can\'t see it, you can\'t fix it." Do the full 5-Point check together standing. "This is your pre-speech checklist. Every time."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Expert Teaching Speeches',
      steps:[
        {time:'8:00',action:'Write PRESENCE on the board. "Word of the Day: PRESENCE — the feeling that someone owns the space they\'re standing in. It\'s not confidence — it\'s controlled stillness. Stop moving unless the movement means something." Give the Gesture Lab: (1) SIZE — pinch = tiny, arms wide = enormous. (2) LIST — count on fingers as you make each point. (3) EMPHASIS — slow chop on the key word. (4) OPEN — palms up = here is what I\'m offering you. Students air-practice each one.'},
        {time:'11:00',action:'Demo: give a 30-second teaching speech with nervous body — hands in pockets, swaying, eyes down, fidgeting. Ask the class what they noticed: every specific habit. Write them. Then redo the same speech with full presence: 5-point check, 3 deliberate gestures, eye contact sweep. "Which teacher would you listen to for 45 minutes?" The contrast is what makes it land.'},
        {time:'13:30',action:'Prep: 4-5 minutes. Students plan their expert teaching speech — something they know well. Require them to plan: (1) one gesture for each of their 3 points, (2) one intentional position change, (3) where they will sweep eye contact. "These are not accidents — they\'re decisions."'},
        {time:'18:00',action:'Speeches begin. Structure: 5-point check → step into position → pause before speaking → deliver. Audience watches for (1) one deliberate gesture and (2) one nervous habit. After each: name them specifically. "I saw you gesture on Point 2 — that worked. Your hand went to your pocket twice — that\'s the habit to eliminate." Address specific tics directly: "Your hand went to your pocket 3 times — let\'s work on that." Not vague.'},
        {time:'20:30',action:'Eye Contact Challenge. In their next speech round (or as a standalone): speak 60 seconds and shift eye contact to a new person every 4-5 seconds. Debrief after: "How did it feel as the audience member when the speaker looked directly at you? For exactly 4 seconds?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Presence Check',
      steps:[
        {time:'52:00',action:'3 volunteers stand at the front simultaneously. Hold the Power Pose — feet wide, hands visible, eyes out — for 15 full seconds. Silence. Class rates each 1-5 for presence. "Notice: nobody spoke. No content. Just body. And you still made a judgment. That\'s how powerful this is."'},
        {time:'54:30',action:'Star of the Day: the student with the most deliberate, controlled body language. Name the specific habit they broke or the specific gesture that worked. "When you did [gesture] on your key point, the audience leaned in. That was not an accident. That was a choice. That\'s what we\'re building."'},
        {time:'56:00',action:'"Next week: MIND — the internal game. Nerves, emotional authenticity, and how to build a preparation habit that makes you unflappable."'},
        {time:'58:00',action:'Closing: everyone does Power Pose for 5 seconds together. Eyes forward. Hold. Then send-off.'},
      ]},
  ],
  pictureCards:[
    {name:'Body Check Card',emoji:'🧍',use:'5-point check — hold up before each speaker: feet/hands/spine/shoulders/chin'},
    {name:'Gesture Bank',emoji:'🤲',use:'Reference for deliberate gesture planning during prep time'},
    {name:'Body Language Bingo',emoji:'🎯',use:'Audience tracks body skills observed during each speech'},
  ],
},
{
  title: 'SpeakUp! Week 4 — Mind: Confidence, Emotions & Preparation', pillar: 'Mind',
  weekWord: 'Confidence', weekWordDef: 'not the absence of fear — it is choosing to act despite it',
  tip: 'The best cure for nerves is knowing your material so well that your brain has nothing left to worry about.', tipIcon: '🧠',
  objectives: ['Students name their personal pre-speech anxiety pattern and interrupt it','Students understand emotional authenticity makes speeches more powerful','Students build a personal preparation routine they will use all semester'],
  improvGame: {
    name: 'Nerves Check-In',
    description: 'Students map what nervousness feels like in their body — then reframe it as readiness!',
    instructions: [
      'Students think: what does nervousness feel like physically — heart, stomach, hands, voice, legs?',
      'Each student names one physical symptom. Teacher tallies on the board.',
      '"You all feel the same things. Professional speakers feel the same things."',
      '"The difference: they have learned that nerves mean readiness — not danger."',
      'Students write: "When I feel [symptom], I know my body is getting me READY."',
    ],
  },
  prompt: 'Tell us about the hardest mental challenge you\'ve ever faced. How did you deal with it?',
  timeLimit: 90, structure: ['🎣 Hook','📌 Your Point','📋 Your Plan','🥧 PIE 1: the challenge itself','🥧 PIE 2: what you tried','🥧 PIE 3: what changed in your mindset','🏁 Conclusion: what others can take from your experience'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🧘', title:'Nerves Check-In',
      steps:[
        {time:'0:00',action:'"MIND pillar. This is the internal game of public speaking — and it\'s where most people either succeed or give up before they try." Frame it as a technical skill, not a soft one. "Knowing how to manage your mind is as important as knowing your structure."'},
        {time:'1:00',action:'Run the Nerves Check-In. Students think and name physical symptoms. Tally them on the board: racing heart, stomach dropping, shaking hands, voice trembling, forgetting words. "Look at this list. Every person in this room — and every person on a TED stage — experiences some version of this."'},
        {time:'4:00',action:'"Professional speakers do not feel less nervous. They interpret the feeling differently." Introduce the reframe: "Nerves = readiness signal. Your body is allocating resources to help you perform." Run Brave Breathing × 3 together.'},
        {time:'7:00',action:'Students write their personal reframe sentence: "When I feel [their symptom], I know I\'m ready to go." They\'ll use this before every speech from here on.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Mental Challenge Speeches',
      steps:[
        {time:'8:00',action:'Write CONFIDENCE on the board. "Word of the Day: CONFIDENCE — not the absence of fear. Choosing to act despite it." Ask: "What\'s the difference between a confident person and someone who just isn\'t scared?" (The confident person IS scared — and goes anyway.)'},
        {time:'9:30',action:'Teach the Three Mind Pillars on the board: (1) CONFIDENCE — built by doing it more, not by feeling ready first. (2) EMOTIONAL EXPRESSION — emotions are not distractions, they\'re your connection to the audience. "If you feel it, they feel it. Let it show." (3) PREPARATION — the best cure for nerves is knowing your material so deeply that your brain has nothing left to worry about.'},
        {time:'12:00',action:'Introduce the anchor technique: one word, one breath, one focal point. "When your mind wanders mid-speech, breathe and return to your anchor word." Students choose their anchor word and write it on their notes card. They\'ll use it before every speech.'},
        {time:'14:00',action:'Prep: 5 minutes. Students plan their mental challenge speech using the PIE × 3 structure: the challenge / what they tried / what changed. Brief outline only — key words per point.'},
        {time:'19:00',action:'Speeches begin. Each speaker says their anchor phrase silently before stepping up. After each: "What mindset shift did you hear? Which of the three Mind Pillars showed up?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Prep Routine + Anchor',
      steps:[
        {time:'52:00',action:'Every student says their anchor phrase aloud. Class responds with a nod or a snap — no laughter, no commentary. "This is serious. Anchor phrases work because you say them consistently."'},
        {time:'55:00',action:'Build the prep routine together: write on the board: (1) Gather material. (2) OUTLINE — not script. (3) Practise aloud at least 3 times, standing up. (4) Simulate real conditions: audience, timer, standing. "From now on, this is your routine for every speech in this class."'},
        {time:'57:00',action:'"Next week: THE HOOK, YOUR POINT, AND YOUR PLAN — the three-part introduction. We start building the structure of your showcase speech."'},
        {time:'58:30',action:'Closing: Brave Breathing × 1 → anchor phrase silently → send-off ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Brave Breathing Card',emoji:'🌬️',use:'Pre-speech ritual reference — add anchor phrase step after breathing'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to MIND pillar — confidence, expression, and preparation all live here'},
  ],
},
{
  title: 'SpeakUp! Week 5 — The Hook, Your Point & Your Plan', pillar: 'Mind',
  weekWord: 'Introduction', weekWordDef: 'the three-part opening of a formal speech: Hook, Your Point, and Your Plan',
  tip: 'Your hook earns attention. Your Point tells them what you think. Your Plan tells them where you\'re going. All three in under 90 seconds.', tipIcon: '🎣',
  objectives: ['Students write and deliver a three-part introduction with all components','Students understand the distinct function of each: Hook, Your Point, Your Plan','Students can identify what is missing from a weak introduction'],
  improvGame: {
    name: 'Introduction Dissection',
    description: 'Two introductions side by side — students identify what\'s there and what\'s missing!',
    instructions: [
      'Intro A: "Today I am going to talk about social media and how it affects teenagers."',
      '"What\'s there? A topic. What\'s missing? A hook. A clear thesis. A preview of arguments."',
      'Intro B: [Hook story] → "Social media isn\'t just distracting — it\'s redesigning the teenage brain." → "I\'ll show you this through the science of dopamine, the data on sleep, and one story you won\'t forget."',
      'Name the 3 parts together: The Hook (earns attention), Your Point (central argument), Your Plan (previews 3 points).',
      '"Which intro makes you more confident about where the speech is going? Why?"',
    ],
  },
  prompt: 'Take a position on something you genuinely believe. Build and deliver a three-part introduction for that argument.',
  timeLimit: 90, structure: ['🎣 The Hook — question / wow fact / tiny story','📌 Your Point — one sentence stating your central argument ("I argue that...")','📋 Your Plan — "I will show you this through [Point 1], [Point 2], and [Point 3]"'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Introduction Dissection',
      steps:[
        {time:'0:00',action:'Write three words on the board: HOOK · POINT · PLAN. "These are the three parts of every formal introduction. Today you master all three in one session."'},
        {time:'1:00',action:'Read Intro A: "Today I am going to talk about social media and how it affects teenagers." Ask: "What\'s there? What\'s missing?" (Topic only — no hook, no thesis, no preview.) Confirm.'},
        {time:'3:00',action:'Read Intro B aloud with energy — use a real hook story, a sharp thesis, and a 3-point plan. Ask: "Which version makes you more confident about where the speech is going?" Name the three parts together.'},
        {time:'7:00',action:'Students spend 45 seconds brainstorming their position for today\'s prompt. Write one word.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Introduction Workshop',
      steps:[
        {time:'8:00',action:'Write INTRODUCTION on the board. "Word of the Day: INTRODUCTION — the three-part opening that sets everything in motion." Go deep on each part.'},
        {time:'8:30',action:'THE HOOK: "Your first sentence has one job — make the audience NEED to hear what comes next." Three types: ASK A QUESTION ("What would you do if you had one minute to save someone\'s life?") / WOW FACT ("Every 4 seconds, someone goes blind — and most of it is preventable.") / TINY STORY ("When I was seven, I got lost for 45 minutes. That is when I understood what real fear feels like.")'},
        {time:'10:00',action:'YOUR POINT: "One sentence that answers: what do YOU think?" The test — is it arguable? On the board: NOT — "Today I will talk about recycling." (Topic.) YES — "Recycling only works when communities make it mandatory — optional programs fail." (Point.) Students draft their Your Point sentence.'},
        {time:'11:30',action:'YOUR PLAN: "Tell the audience what\'s coming." Template: "I will show you this by looking at [Point 1], [Point 2], and [Point 3]." Students fill in their three points.'},
        {time:'13:00',action:'Prep: students write their full three-part introduction. Partner check: "Can you name all three parts? Is the Point arguable — not just a topic? Does the Plan preview three distinct points?"'},
        {time:'17:00',action:'Introductions delivered — each student delivers only their three-part intro (no full speech yet). After each: audience identifies aloud: hook type, paraphrase of Your Point, the three Plan items.'},
        {time:'20:00',action:'Targeted feedback on the weakest part only: "Your hook landed — now sharpen Your Point. Right now it sounds like a topic, not a position."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Introduction Clinic',
      steps:[
        {time:'52:00',action:'"Without notes — what are the three parts of an introduction?" (Hook / Your Point / Your Plan.) "What is the difference between a topic and a thesis?" Take 3 answers.'},
        {time:'55:00',action:'Star of the Day: the intro with the strongest, most arguable Your Point. Read it aloud as the model.'},
        {time:'57:00',action:'"Next week: THE BODY — three evidence-backed arguments using PIE. You\'ll build the middle of your speech on the foundation you wrote today."'},
        {time:'58:30',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Hook Types Card',emoji:'🎣',use:'Show during main activity — keep visible as students draft their hook type'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'Point to MIND pillar — structure and preparation are mind skills'},
  ],
},
{
  title: 'SpeakUp! Week 6 — The Body: Three Points', pillar: 'Mind',
  weekWord: 'Evidence', weekWordDef: 'the specific facts, stories, or examples that prove your point is true',
  tip: 'Making a point without evidence is just an opinion. Evidence is what turns your opinion into an argument.', tipIcon: '📊',
  objectives: ['Students build 3 full body paragraphs using PIE: Point, Illustrate, Explain','Students distinguish making a point from illustrating it','Students use transition language to connect paragraphs'],
  improvGame: {
    name: 'PIE Relay',
    description: 'Three students build one PIE argument together — one does the Point, one Illustrates, one Explains!',
    instructions: [
      'Topic: "School uniforms reduce distraction."',
      'Student A: POINT — "Uniforms mean students don\'t spend mental energy on clothing choices."',
      'Student B: ILLUSTRATE — "At Lincoln Middle School after uniforms were introduced, peer-pressure incidents dropped by 40%."',
      'Student C: EXPLAIN — "This shows that when appearance is neutralised, students redirect attention to learning — which directly proves uniforms reduce distraction."',
      'Do 3 rounds with different topics and students. After each: "Which part felt hardest? Why?"',
    ],
  },
  prompt: 'Using Your Point from last week, build all three body paragraphs using PIE.',
  timeLimit: 90, structure: ['📌 Point 1 → Illustrate → Explain + transition out','📌 Point 2 → Illustrate → Explain + transition out','📌 Point 3 → Illustrate → Explain'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'PIE Relay',
      steps:[
        {time:'0:00',action:'"MIND pillar. Last week you built your introduction. Today you fill in the body — the part that actually PROVES your thesis." Write PIE on the board: Point / Illustrate / Explain.'},
        {time:'1:30',action:'Run PIE Relay with 3 different topics. Three students per round — one for each PIE component. After each: check — did the Explain sentence connect back to the thesis?'},
        {time:'6:00',action:'Review transition language. Write on the board (leave visible all session): "Let me begin with my first argument... / Building on that... / Most importantly... / Having looked at all three, it is clear that..."'},
        {time:'7:30',action:'Students take out their Your Point from last week. "Today you\'re building THREE paragraphs on that foundation."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Body Builder Workshop',
      steps:[
        {time:'8:00',action:'Write EVIDENCE on the board. "Word of the Day: EVIDENCE — the specific facts, stories, or examples that prove your point is true. Making a claim without evidence is an opinion. Evidence makes it an argument." Types: statistics, quotes, personal stories, examples.'},
        {time:'9:30',action:'Model building all 3 PIE paragraphs on one topic from scratch. Point to the structure as you go. Show how each EXPLAIN sentence connects back to Your Point: "This matters because — and this is the key — it directly proves that [thesis]."'},
        {time:'13:00',action:'Prep: 5 minutes. Students outline all 3 PIE paragraphs — P, I, E for each. Walk around. If a student\'s three Point sentences are too similar, prompt: "Are these truly three different arguments, or three ways of saying the same thing?"'},
        {time:'18:00',action:'Workshop format: students deliver their 3-point body only (no intro or conclusion). After each: partner checks (1) Three distinct points? (2) Illustration specific, not general? (3) Explain closes the loop?'},
        {time:'22:00',action:'Teacher feedback focus: the EXPLAIN sentence. This is where most students are weakest. "Your Explain should say \'this shows that [Your Point].\' Don\'t leave it implied."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'PIE Check',
      steps:[
        {time:'52:00',action:'"Without notes — what does PIE stand for?" (Point / Illustrate / Explain.) "What is the EXPLAIN sentence\'s one job?" (Connect the illustration back to Your Point.)'},
        {time:'55:00',action:'Star of the Day: the student whose EXPLAIN sentences most clearly connected each point to their overall thesis.'},
        {time:'57:00',action:'"Next week: THE CONCLUSION — the four-part ending that echoes your introduction and leaves a lasting impression."'},
        {time:'58:30',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'PIE Card',emoji:'🥧',use:'Keep visible all session — P=claim, I=evidence, E=so what? Use after each speaker to reconstruct'},
    {name:'Hook Types Card',emoji:'🎣',use:'Illustration types reference: story / stat / quote / example'},
  ],
},
{
  title: 'SpeakUp! Week 7 — The Conclusion', pillar: 'Mind',
  weekWord: 'Resolution', weekWordDef: 'the feeling that everything has come together and the journey is complete',
  tip: 'Weak endings waste great speeches. Your last line is the last thing they remember — make it unforgettable.', tipIcon: '🏁',
  objectives: ['Students master the 4-part conclusion: echo hook / restate point / remind plan / lasting impression','Students practise ending with authority — no trailing off, no "um, yeah, that\'s it"','Students critique weak vs. strong conclusions using specific criteria'],
  improvGame: {
    name: 'Three Endings',
    description: 'Three conclusions for the same speech — class ranks them and explains why!',
    instructions: [
      '"In conclusion, I have discussed three points. Thank you." — Rank 3.',
      '"So those were my arguments about recycling." — Rank 2.',
      '"The choice is simple: keep watching plastic pile up, or demand mandatory recycling today. The ocean cannot wait — and neither can we." — Rank 1.',
      '"What does the strongest one do that the others don\'t?"',
      'Students identify: echoes the topic, creates urgency, ends with a challenge — no filler.',
    ],
  },
  prompt: 'Write and deliver a conclusion for a speech you\'ve given this semester. Make it unforgettable.',
  timeLimit: 90, structure: ['🔄 Echo the Hook — return to your opening. Close the loop.','📌 Restate Your Point — rephrase it, do not repeat word for word.','📋 Remind Your Plan — "We have seen that [P1], [P2], and [P3]."','💥 Lasting Impression — a challenge, question, vision, or call to action.'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Three Endings',
      steps:[
        {time:'0:00',action:'"MIND pillar. The last thing you say is the thing they remember. Treat it accordingly."'},
        {time:'1:30',action:'Three Endings: read all 3 aloud, students rank them (fingers 1-3). Discuss: what does Rank 1 do? Common answers: creates urgency, echoes the topic, ends on a challenge, no filler.'},
        {time:'5:30',action:'Write the 4-part conclusion formula: ECHO HOOK / RESTATE POINT / REMIND PLAN / LASTING IMPRESSION. Common mistakes: "In conclusion" is overused — try "So where does this leave us?"; never introduce new evidence; "Thank you" comes after the lasting impression, not instead of it.'},
        {time:'7:30',action:'Students write their conclusion\'s last line first. "What\'s the one sentence you want them to carry home?"'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Conclusion Workshop',
      steps:[
        {time:'8:00',action:'Word of Day: RESOLUTION. "A conclusion is not just an ending — it is a resolution. The audience should feel everything has come together."'},
        {time:'9:30',action:'Model: deliver 3 different conclusions for the same speech — weak, medium, strong. Class rates each 1-5. "What specific thing moved it from 3 to 5?"'},
        {time:'13:00',action:'Students draft their 4-part conclusion. Partners check: (1) Does it echo the hook? (2) Is the Point restated (not repeated word-for-word)? (3) Does it feel FINISHED?'},
        {time:'17:00',action:'Conclusions delivered — only the conclusion, no full speech. Audience rates how "finished" it feels 1-5. Push for: "What exactly made it feel finished or unfinished?"'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Last Line Hall of Fame',
      steps:[
        {time:'52:00',action:'Class votes: the best single last line of the session. Winner delivers it again — slowly, with maximum conviction.'},
        {time:'54:30',action:'Deconstruct the winning line: which of the 4 conclusion elements does it use most powerfully? What makes it stick?'},
        {time:'56:30',action:'"Next week: FULL FORMAL SPEECH — Hook, Your Point, Your Plan, three PIE paragraphs, and your conclusion. Everything in one speech for the first time."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'Conclusion Formula Card',emoji:'🏁',use:'4-part formula: Echo Hook / Restate Point / Remind Plan / Lasting Impression — reference during workshop'},
    {name:'Three-Part Train',emoji:'🚂',use:'Point to the caboose — the conclusion ties the whole train together'},
  ],
},
{
  title: 'SpeakUp! Week 8 — Full Formal Speech', pillar: 'All',
  weekWord: 'Delivery', weekWordDef: 'the way you present your speech — all voice, body, and mind skills working together',
  tip: 'You know every part of this structure. Today you prove it by putting them all together in one polished performance.', tipIcon: '🎯',
  objectives: ['Students deliver their first complete formal speech (Hook + Point + Plan + 3 PIE + Conclusion)','Students receive structured peer feedback on each component','Students identify their personal strength and one growth area'],
  improvGame: {
    name: 'Pre-Speech Ritual Sequence',
    description: 'Full ritual before every major speech from now on — run it as a class before speeches begin!',
    instructions: [
      'Step 1: Review your outline — know your structure cold (1 minute).',
      'Step 2: Say your intro aloud alone (1 minute).',
      'Step 3: Power Pose for 10 seconds.',
      'Step 4: Brave Breathing × 3.',
      'Step 5: Anchor phrase silently: "I know my material. I am ready. Let\'s go."',
    ],
  },
  prompt: 'Pick an argument you believe in. Give your best full formal speech: Hook + Your Point + Your Plan → 3 PIE paragraphs → Conclusion.',
  timeLimit: 120, structure: ['🎣 Hook','📌 Your Point','📋 Your Plan','🥧 PIE 1 + transition','🥧 PIE 2 + transition','🥧 PIE 3','🏁 Conclusion: Echo / Restate / Remind / Lasting Impression'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'⭐', title:'Pre-Speech Ritual Sequence',
      steps:[
        {time:'0:00',action:'"Today is the first time you put everything together in one speech. Not practice — a real formal speech. Full structure, from introduction to conclusion. Seven weeks of skills in one performance."'},
        {time:'1:00',action:'Run the Pre-Speech Ritual as a class: outline review, intro run-through, Power Pose 10 seconds, Brave Breathing × 3, anchor phrase. "From today, every student does this before a major speech. Every time."'},
        {time:'5:00',action:'Quick structure recap: write all 7 components on board: Hook / Your Point / Your Plan / PIE 1 / PIE 2 / PIE 3 / Conclusion. Students check their outline has all 7 marked.'},
        {time:'7:00',action:'"Prep: 5 minutes. Outline only — no reading a script during delivery. Keywords only on your card."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Full Formal Speeches',
      steps:[
        {time:'8:00',action:'Write DELIVERY on the board. "Word of the Day: DELIVERY — all your voice, body, and mind skills working together in one complete speech. This is what the last 7 weeks have been building toward. Today you are not practising one component — you are delivering the whole thing."'},
        {time:'9:00',action:'Pre-speech ritual for the first speaker (done once as a class, then privately before each subsequent speaker): everyone stands. Review outline for 30 seconds silently. Say your intro aloud under your breath. Power Pose 10 seconds. Brave Breathing × 2. Anchor phrase silently. Walk to the front. Plant feet. Pause. Begin.'},
        {time:'11:00',action:'Speeches begin. Timer visible and running. Target 3-4 minutes each. Audience: hands in lap, eyes on speaker, completely silent during the speech. No writing during the speech — watch first, write after.'},
        {time:'14:00',action:'After each speech: peer feedback form. Audience writes for 60 seconds on each component — Hook (did it grab you and why?), Your Point (clear single thesis — yes/no and quote it), Body (3 distinct points with specific evidence?), Conclusion (did it feel finished — and what was the lasting impression?), Voice/Body (one specific observation). One memorable line from the whole speech.'},
        {time:'16:30',action:'Share 2-3 pieces of peer feedback aloud. Teacher probes for specificity: "Which moment exactly did the hook land? Quote the sentence that made the Point clear. What evidence was strongest?"'},
        {time:'18:00',action:'Between speakers: teacher coaching note for the room. Rotate focus: after speaker 1 — hook quality. After speaker 2 — evidence specificity in PIE. After speaker 3 — conclusion impact. After speaker 4 — body language + eye contact. This keeps feedback varied and helps the audience listen with a specific focus.'},
        {time:'49:00',action:'After the last speaker: "Every person in this room just delivered a full formal speech with all 7 components. That is not a small thing. A year ago — many of you could barely speak for 30 seconds. Today you went 3-4 minutes with structure, evidence, and a conclusion."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Self-Reflection',
      steps:[
        {time:'52:00',action:'"Without notes — recite the 7 components of the formal structure." Group challenge. Then: "Which component felt strongest today? Which felt weakest?"'},
        {time:'54:00',action:'Self-reflection: each student writes their #1 proud moment and #1 goal for the next speech. "I was strongest at ___. My goal next time is ___."'},
        {time:'56:00',action:'Star of the Day: student who demonstrated the most complete, coherent formal structure — all 7 components present and connected.'},
        {time:'57:30',action:'"Next week: STORYTELLING — a completely different mode. Personal narrative with vivid detail and a so-what."'},
        {time:'58:30',action:'Closing ritual — deliver the send-off as a formal conclusion: echo, restate, lasting impression.'},
      ]},
  ],
  pictureCards:[
    {name:'Full Speech Map',emoji:'🗺️',use:'Complete 7-part structure reference — keep visible all session'},
    {name:'Brave Breathing Card',emoji:'🌬️',use:'Pre-speech ritual reference — students follow steps before stepping up'},
    {name:'Three Pillars Poster',emoji:'3️⃣',use:'All three pillars active today — point to it as a reminder before speeches begin'},
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
        {time:'0:00',action:'Stand at the front. "VOICE pillar — but today we approach it through storytelling. Stories are the oldest and most powerful form of rhetoric. Every great persuasive speech has a story inside it. Today you learn how to tell them."'},
        {time:'1:00',action:'ROUND 1 — Sensory Sentence. Write on the board: "We ate dinner." "Your job: rewrite this sentence using at least 3 of the 5 senses. 60 seconds — go." Students write individually.'},
        {time:'2:00',action:'Share round: 4-5 students read their version aloud. After each: "Which sense? Was it specific or generic?" Push for specificity: not "smelled good" but "the garlic hit us before we opened the door."'},
        {time:'3:00',action:'ROUND 2 — Raise the stakes. Write on board: "The game ended." "This time: add tension, one unexpected specific detail, and one piece of dialogue. 60 seconds."'},
        {time:'4:00',action:'Share round 2. Celebrate the most vivid, unexpected detail in the room. "That\'s the one that stays in the memory."'},
        {time:'5:30',action:'Introduce in medias res: write it on the board. "Great stories don\'t start at the beginning — they start in the moment. The backstory is earned, not given. Drop the audience into the action."'},
        {time:'7:00',action:'Model the same story two ways: (1) chronological — "Last year I signed up for the spelling bee. I practised for weeks. Then the day came..." (2) in medias res — "My mouth went completely dry. The microphone was an inch from my face and I could not remember a single letter." Ask: "Which one made you lean in? That\'s in medias res." Class votes.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Turning Point Stories',
      steps:[
        {time:'8:00',action:'Write NARRATIVE on the board. "Word of the Day: NARRATIVE — a structured account of events that creates meaning and emotional connection. Persuasive speeches argue. Narratives prove the same point — with feeling. The best speakers do both."'},
        {time:'9:00',action:'Reveal the 5-part story arc on the board: 🔥 START IN THE ACTION → 🌄 BRIEF CONTEXT (only what\'s needed) → ⚡ TURNING POINT → 💭 INTERNAL MOMENT → 🏁 REFLECTION (what changed, why it matters). "Every turning-point story follows this shape. Your job is to find the moment."'},
        {time:'10:00',action:'Model a full 90-second narrative. Choose a real or vivid story: "I was on the wrong bus heading to the wrong school on the first day of a new job." Go straight into action. Use one line of dialogue. Name one sensory detail. Pause at the turning point. End with a reflection: "That\'s when I learned that..." Slow down for the final sentence. Let it land.'},
        {time:'12:00',action:'Ask: "Where did I start the story — beginning, middle, or end?" (Middle.) "What was the sensory detail?" "What was the internal moment?" "What was the reflection?" Map the story onto the arc on the board.'},
        {time:'14:00',action:'Prep: 5 minutes. Students choose their moment and draft their story arc on paper. "Your first sentence must drop us into the action. Write it first — before anything else. No introductions, no backstory. Action." Circulate and push: "Start later in the story. What\'s the most intense moment?"'},
        {time:'19:00',action:'Speeches begin. One by one. After each speech: ask the audience — (1) "What image did we start with?" (2) "Where was the turning point?" (3) "What did this story prove or leave you thinking about?" Teacher adds feedback on the in medias res entry: did the story actually start in the action, or did it drift into backstory?'},
        {time:'30:00',action:'Mid-point coaching note (for the room between speakers): "Show-don\'t-tell. Don\'t say \'I was nervous.\' Say \'my hands wouldn\'t stop moving.\' Don\'t say \'it was exciting.\' Show us the moment your heart rate changed."'},
        {time:'50:00',action:'After the last speaker: "Every single one of you just told a real story with a real arc. That is one of the hardest skills in public speaking — and you all did it."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Story Arc Check',
      steps:[
        {time:'52:00',action:'"Which story stayed with you from today? Name one specific detail — not the topic, the detail." Take 3-4 responses. "Specific details are what make stories stick. Vague stories disappear."'},
        {time:'54:00',action:'Show-don\'t-tell debrief: "Raise your hand if you used a sensory detail. Now — raise your hand if that detail was something you could see, hear, smell, taste, or feel. If your hand went down, that\'s your goal for next time."'},
        {time:'55:30',action:'Star of Day: the student whose story created the strongest emotional moment for the audience — the room went quiet, leaned in, or reacted. Name the specific moment that did it.'},
        {time:'57:00',action:'"Next week: HUMOROUS SPEECH — Toastmasters style. Laughter is not luck, it\'s craft. You will study it like scientists." Preview the 3 techniques: Rule of Three, Callback, Understatement.'},
        {time:'58:30',action:'Closing ritual.'},
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
        {time:'0:00',action:'Stand at the front. "VOICE pillar: TIMING. Comedy is craft, not luck. Professional comedians study and practise their timing the same way musicians practise rhythm. Today you are comedy scientists."'},
        {time:'1:00',action:'TECHNIQUE 1 — RULE OF THREE. Write on board: "I need three things to survive: food, water, and excellent Wi-Fi." Explain: "The third item breaks the pattern — that\'s the joke. Lists of two are boring. Lists of four are too long. Three is the magic number." Students write their own Rule of Three in 30 seconds. Share 3-4 examples.'},
        {time:'2:30',action:'TECHNIQUE 2 — CALLBACK. Write on board: Open with "My dog is very loyal." Close with "So yes — loyal... mostly." "A callback returns to something you said earlier and twists it. The audience feels smart for remembering." Students write a callback pair in 30 seconds. Share 2-3 examples.'},
        {time:'4:00',action:'TECHNIQUE 3 — UNDERSTATEMENT. Write on board: "Being hit by a bus is slightly inconvenient." "Understatement means describing something extreme as if it were minor. The gap between reality and your calm tone is the joke." Students write one in 30 seconds. Share 2-3 examples.'},
        {time:'5:30',action:'"You now have three weapons. Which one are you using in your speech today? Raise your hand when you\'ve decided." Wait for all hands.'},
        {time:'6:30',action:'Teacher delivers a 60-second humorous story using all three techniques — label them as you go. "Did you catch the Rule of Three? The Callback? The Understatement?" Students call them out.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Catastrophic Plans Speeches',
      steps:[
        {time:'8:00',action:'Write TIMING on the board. "Word of the Day: TIMING — the precise control of speed, pause, and delivery that makes comedy land. The pause is the punchline. Silence is your funniest tool. You cannot rush comedy."'},
        {time:'9:00',action:'Ground rules: (1) Audiences may laugh freely — laughter is the goal. (2) Speakers must HOLD their pause until the room settles completely before continuing. (3) If something lands, slow down. If it doesn\'t, move on without showing it.'},
        {time:'10:00',action:'Demonstrate the pause. Tell a 20-second joke and pause after the punchline for a full 5 seconds. "That silence is terrifying and it\'s also your power. Practice it right now." All students say: \'And that\'s when I realised...\' — then PAUSE for 3 seconds. (Do it 2×)'},
        {time:'12:00',action:'Prep: 5 minutes. Students outline their catastrophic-plan story following the structure: Hook (funny or sets up comedy) → Scene → What Went Wrong (×3 — Rule of Three) → Punchline Moment → Callback close. Students physically mark their script: circle the [PAUSE] moments and write [TECHNIQUE: ___] next to their deliberate comedy choice.'},
        {time:'17:00',action:'Model one more time if needed: show a 90-second speech with visible script markings, stopping before the punchline: "Watch the pause." Hold it. Let the room respond. Continue.'},
        {time:'19:00',action:'Speeches begin. Audience holds up a finger silently when they spot a comedic technique. After each: (1) "What technique did you catch?" (2) "Did the pause land — or did the speaker rush?" (3) "What was funnier — the words, or the way they were delivered?"'},
        {time:'22:00',action:'Teacher coaching note after each speech: name one specific moment the delivery made the joke — or one moment where a pause could have made it land harder.'},
        {time:'50:00',action:'After last speech: "Comedy is 10% the joke and 90% the delivery. You all proved that today. Some of those jokes worked because of a look, a pause, a raised eyebrow — not just the words."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Timing Trophy',
      steps:[
        {time:'52:00',action:'Class votes: best comedic pause of the session. Winner re-delivers just that moment.'},
        {time:'54:30',action:'Star of Day: most skillful use of a specific technique.'},
        {time:'56:00',action:'Preview: "Next week: IMPROMPTU SPEAKING — no notes, no prep time beyond 30 seconds. You will speak off the top of your head and make it look intentional."'},
        {time:'58:00',action:'Closing ritual — do it with comedic understatement: "I guess that was... fine."'},
      ]},
  ],
  pictureCards:[
    {name:'Comedic Techniques Card',emoji:'😂',use:'3-panel card: Rule of Three / Callback / Understatement with examples'},
    {name:'Pause Power Card',emoji:'⏸️',use:'Hold up to cue students to pause — silent coaching during speeches'},
  ],
},
{
  title: 'SpeakUp! Week 11 — Impromptu Speaking', pillar: 'Mind',
  weekWord: 'Impromptu', weekWordDef: 'speaking with only 30 seconds of preparation — thinking fast, starting strong, finishing clean',
  tip: 'In impromptu speaking, your first sentence buys you time. Say it with confidence while your brain catches up.', tipIcon: '⚡',
  objectives: ['Students practise the PREP framework: Point, Reason, Example, Point again','Students learn to use 30-second preparation time strategically, not frantically','Students build comfort speaking without notes or extended prep'],
  improvGame: {
    name: 'First Line Duel',
    description: 'Two students get the same random topic — who delivers the stronger first sentence? Class votes!',
    instructions: [
      'Topic: "The best thing about Mondays." Give both students 5 seconds to think.',
      'Student A delivers their first sentence. Student B delivers theirs.',
      'Class votes: which first sentence made you want to hear more?',
      'Repeat × 4 rounds with different topics. Track who has the "best hook" instinct.',
      'Debrief: what made the winning sentences work? (Surprise, specificity, strong opinion.)',
    ],
  },
  prompt: 'Draw a random topic. You have 30 seconds to prepare — then speak for 2 minutes using PREP.',
  timeLimit: 120, structure: ['📌 P — your Point (take a position in sentence 1)','💡 R — one Reason ("The reason I believe this is...")','📖 E — a specific Example ("For instance...")','🔁 P — restate your Point with a twist or call to action'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'First Line Duel',
      steps:[
        {time:'0:00',action:'"MIND pillar: thinking on your feet. Impromptu speaking is the most common speaking situation in real life — interviews, Q&As, debates, conversations with authority. Today you practise doing it well."'},
        {time:'1:00',action:'First Line Duel: 4 rounds. Vote after each pair. Ask: "What made the winner\'s first sentence stronger?"'},
        {time:'5:30',action:'Introduce the PREP framework. Write on board: Point → Reason → Example → Point. "This is your impromptu scaffold. It sounds natural but it gives you structure."'},
        {time:'7:00',action:'"Your 30 seconds of prep time is not for writing sentences — it\'s for deciding your Point and your Example. One of each. That\'s all you need."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Impromptu Rounds',
      steps:[
        {time:'8:00',action:'Write IMPROMPTU on the board. "Word of the Day: IMPROMPTU — prepared in spirit, spontaneous in delivery. The goal isn\'t perfection. The goal is starting with conviction and ending clean."'},
        {time:'9:00',action:'Model: draw a topic card, announce the 30-second prep aloud, think silently (show the thinking face), then deliver using PREP. Walk through the structure as you go.'},
        {time:'11:00',action:'Round 1: Every student draws a topic. 30 seconds prep (silent, all at once). Students go one by one — 90 seconds each. Timer visible. No extensions.'},
        {time:'15:00',action:'After each: quick feedback — "What was their Point?" "Did they give a real Example or a vague one?" "Did they end clean or trail off?"'},
        {time:'25:00',action:'Round 2: same format, new topics. Raise the bar: "Now your Example must be specific — a named person, place, number, or event. No generics."'},
        {time:'40:00',action:'Challenge round (optional): same topic, no prep time at all. Volunteers only. First line must be delivered within 3 seconds of hearing the topic.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'PREP Debrief',
      steps:[
        {time:'52:00',action:'"Without notes — what does PREP stand for?" (Point / Reason / Example / Point.) "What do you use your 30 seconds for?" (Deciding your Point and your Example only.)'},
        {time:'54:00',action:'Star of the Day: the student who sounded most natural while still hitting all 4 PREP steps.'},
        {time:'56:00',action:'"Next week: PLATFORM SPEECH — a speech on a cause you genuinely care about, delivered for maximum impact and audience action."'},
        {time:'58:00',action:'Closing ritual.'},
      ]},
  ],
  pictureCards:[
    {name:'PREP Framework Card',emoji:'⚡',use:'4-step card: Point / Reason / Example / Point — visible during all rounds'},
    {name:'Hook Types Card',emoji:'🎣',use:'Students use during first 10 seconds — pick a hook type as their opening move'},
  ],
},
{
  title: 'SpeakUp! Week 12 — Platform Speech', pillar: 'All',
  weekWord: 'Advocacy', weekWordDef: 'speaking publicly in support of a cause you believe in — with the purpose of moving others to care or act',
  tip: 'A platform speech is the most powerful type you will ever give. Choose a cause you actually care about, because the audience will feel whether you mean it.', tipIcon: '📣',
  objectives: ['Students choose a genuine cause and deliver an advocacy speech using full formal structure','Students deploy Ethos, Pathos, and Logos as deliberate rhetorical choices','Students practise the call to action: giving the audience something specific to do after the speech'],
  improvGame: {
    name: 'Platform in 60',
    description: 'Students have 60 seconds to argue for a cause using one appeal type — then the class names which one!',
    instructions: [
      'Topic: access to clean water. Student A: logos only — statistics, data, facts.',
      'Topic: food waste. Student B: pathos only — one story, vivid details, emotional close.',
      'Topic: school library funding. Student C: ethos — "I am the person most affected by this because..."',
      'Class names the appeal type after each. Discuss: which was most persuasive and why?',
      'Debrief: "Platform speeches use all three — but usually lead with one. Which will you lead with today?"',
    ],
  },
  prompt: 'Choose a cause you genuinely care about. Deliver a platform speech using Hook, Your Point, Your Plan, 3 PIE paragraphs (Logos / Pathos / Ethos), and a Call to Action conclusion.',
  timeLimit: 180, structure: ['🎣 Hook — emotional or provocative, sets the stakes','📌 Your Point — the injustice, need, or truth you are addressing','📋 Your Plan — three arguments you will make','🥧 PIE 1 — Logos (evidence and data)','🥧 PIE 2 — Pathos (story or vivid example)','🥧 PIE 3 — Ethos (your personal connection or authority)','📣 Call to Action conclusion — what specifically should the audience do?'],
  sessionPlan: [
    { startMin:0, endMin:8, label:'WARM-UP', emoji:'🎭', title:'Platform in 60',
      steps:[
        {time:'0:00',action:'"ALL THREE PILLARS today. Platform speech is the most powerful form of public speaking — and it is what leaders, advocates, and change-makers do. Your speech today should move this room."'},
        {time:'1:00',action:'Platform in 60: three students, three topics, three appeal types. Class names the appeal after each. "Which moved you most — and why?"'},
        {time:'5:30',action:'Introduce the structure: Hook → Your Point → Your Plan → Logos → Pathos → Ethos → Call to Action. The Call to Action is the most important part of a platform speech. "Don\'t just raise awareness — tell us what to do."'},
        {time:'7:00',action:'Students choose their cause. One minute to decide and write their cause in one sentence.'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Platform Speeches',
      steps:[
        {time:'8:00',action:'Write ADVOCACY on the board. "Word of the Day: ADVOCACY — speaking publicly on behalf of a cause to move others. Notice: you are not sharing an opinion. You are making a case and asking for action."'},
        {time:'9:00',action:'Model: deliver a short platform speech (3-4 min) on a real issue. Be genuinely invested. Pause on the call to action and slow down. "Notice what I\'m asking you to do. That\'s the most important sentence."'},
        {time:'13:00',action:'Prep: 6 minutes. Students outline all 7 components, with particular attention to: (1) What is your Call to Action? (Make it specific — not "be aware," but "do X by Y.") (2) Which PIE is Logos, which is Pathos, which is Ethos?'},
        {time:'19:00',action:'Speeches begin (3-4 min). After each: "What is the Call to Action?" "Which argument — Logos, Pathos, or Ethos — moved you the most?" "Did you believe the speaker cared about this?"'},
        {time:'23:00',action:'Teacher feedback: the Ethos paragraph. "Did you tell us why YOU specifically are the right person to speak on this? That\'s what makes a Call to Action credible."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Call to Action Wall',
      steps:[
        {time:'52:00',action:'Each student states their Call to Action in one sentence. Write them on the board. "This is what this room is advocating for today."'},
        {time:'54:30',action:'Class votes: the most specific, actionable, and urgent Call to Action.'},
        {time:'56:00',action:'Star of the Day: the speaker who most clearly made the audience feel the stakes — not just understand the issue, but feel it.'},
        {time:'57:00',action:'"Next week: INFORMATIVE vs. PERSUASIVE — you will choose your mode and begin finalising your Showcase speech."'},
        {time:'58:30',action:'Closing ritual — deliver the send-off as a call to action: "Between now and next week, do one thing for a cause you believe in."'},
      ]},
  ],
  pictureCards:[
    {name:'Persuasion Triangle',emoji:'🔺',use:'Ethos/Pathos/Logos poster — students label their 3 PIE paragraphs with which appeal each uses'},
    {name:'Conclusion Formula Card',emoji:'🏁',use:'Adapted for platform speech: Call to Action replaces Lasting Impression — show the difference'},
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
        {time:'0:00',action:'Stand at the front. "MIND pillar — and today it\'s the most important MIND session of the year. Before you speak, you must ask: WHY am I speaking? Because the answer changes every word choice, every structure, every piece of evidence you use."'},
        {time:'1:00',action:'Reveal the Persuasion Triangle: draw a triangle on the board. ETHOS at the top. PATHOS at bottom left. LOGOS at bottom right. "These are Aristotle\'s three modes of persuasion — 2400 years old and still the framework every lawyer, politician, and ad-maker uses."'},
        {time:'2:00',action:'Read 3 statements. After each, class identifies which corner of the triangle it uses. (1) "Studies show 80% of students who read for 20 minutes daily score in the top quartile." → LOGOS. (2) "As someone who failed my first public speaking attempt, I know how terrifying this feels." → ETHOS. (3) "Imagine never being able to tell the people you love how you really feel." → PATHOS.'},
        {time:'4:00',action:'Quick debrief: "Which appeal hit you hardest just now? Raise your hand — logos? ethos? pathos?" Count hands. "Notice how different people respond to different appeals. Strong speakers use all three."'},
        {time:'5:30',action:'Groups of 3 (60 seconds): "For your showcase topic — which appeal is your STRONGEST? Which is your weakest? Discuss." Bring it back to the room: 2-3 groups share.'},
        {time:'7:00',action:'"Today you deliver the same topic twice — once to TEACH, once to PERSUADE. Same topic. Completely different purpose. Watch how everything changes."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Same Topic, Two Modes',
      steps:[
        {time:'8:00',action:'Write ETHOS on the board. "Word of the Day: ETHOS — the credibility and trustworthiness a speaker builds with the audience. The most persuasive thing you can say is: \'I know this because...\' Personal authority changes everything."'},
        {time:'9:00',action:'Model INFORMATIVE on topic SLEEP: "Today I\'m going to tell you three things about sleep. First, the average teenager needs 9 hours. Second, screens reduce melatonin production. Third, chronic sleep deprivation impairs memory the same way alcohol does." Flat structure, neutral tone, three facts, clean conclusion.'},
        {time:'10:30',action:'Model PERSUASIVE on same topic SLEEP: Switch tone completely. "Last Thursday I watched a friend fail a test she had studied 8 hours for. You know what cost her that grade? Three nights of four-hour sleep. (pause) Tonight, you have a choice." Build with logos (stat), pathos (the friend\'s story), ethos ("I have made this mistake too"), and end with a call to action: "Put your phone down at 9:30pm. One week. See what happens." Ask the class: "Which moved you more? What changed?"'},
        {time:'13:00',action:'Prep: 4 minutes. Students pick a topic they know well. They plan both versions: INFORM structure (Hook → Fact 1 → Fact 2 → Fact 3 → Conclusion) vs. PERSUADE structure (Hook → Point → Logos → Pathos → Ethos → Call to Action). They write the first sentence of each version.'},
        {time:'17:00',action:'Speeches: each student delivers both versions back to back (60 sec each). After each pair: (1) "Which was harder to deliver?" (2) "Which convinced you more — and what specifically tipped it?" (3) "Did we hear an ethos moment in the persuasive version?"'},
        {time:'44:00',action:'"Showcase is in two weeks. You must commit NOW: INFORM or PERSUADE? Your structure, your evidence, and your conclusion all depend on this choice." Go around the room — each student states their mode in one word.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Showcase Mode Declaration',
      steps:[
        {time:'52:00',action:'"One sentence. Stand up, say it clearly, then sit." Go around the room: "My Showcase speech will [INFORM / PERSUADE] about ___ and I will mainly use [ethos / pathos / logos] to do it." Every student stands. No skipping.'},
        {time:'55:00',action:'Star of Day: the student whose persuasive speech most clearly felt different from their informative one — the shift in tone and structure was visible and intentional.'},
        {time:'56:30',action:'"Notice: you just practised two speeches each. That\'s real reps. Two weeks from now is Showcase. Rehearse at home. Your first sentence. Your call to action. Your ending. Know them cold."'},
        {time:'57:30',action:'"Next week: THE ART OF EVALUATION — you learn to give Toastmasters-style feedback. Giving a great evaluation is itself a public speech."'},
        {time:'59:00',action:'Closing ritual.'},
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
        {time:'0:00',action:'Stand at the front. "MIND pillar. Today: EVALUATION. In Toastmasters — a world organisation with 300,000 members — the evaluator role is considered as important as the speaker role. Giving a great evaluation is itself an act of public speaking."'},
        {time:'1:00',action:'ROUND 1 — Vague vs. Specific. Write on the board: "Good job." Ask: "Is this useful feedback?" (No.) "Why not?" (Tells them nothing they can do differently.) "Now rewrite it specifically." Model: "Your eye contact during the second point built real trust with the audience — I felt like you were speaking directly to me."'},
        {time:'2:00',action:'Three rounds: write a vague piece of feedback on the board, students rewrite it in 30 seconds, pairs compare, class shares the most actionable version. (1) "You talked too fast." → e.g. "When you slowed down for the statistic at the 2-minute mark, it landed powerfully — try that pacing throughout." (2) "Your hook was great." → e.g. "The question you opened with created immediate buy-in because it was personal and surprising." (3) "Work on your body language." → e.g. "Your hands stilled during the Pathos paragraph — that stillness made the emotion land harder."'},
        {time:'5:00',action:'Introduce the C-R-C Model. Write on the board: COMMENDATION → RECOMMENDATION → COMMENDATION. "Sandwich structure. You open with something specific they did well (and WHY it worked). You give one concrete recommendation (and HOW to do it). You close with encouragement about what you want to see from them next."'},
        {time:'6:30',action:'Model a full C-R-C live: "Sarah, I want to commend you for your opening question — it created immediate buy-in because the entire room leaned forward to think. My one recommendation: try pausing for two full seconds after your punchlines; the room needs time to process before you move on. I am excited to see your pace and your hook working together in Showcase."'},
        {time:'7:30',action:'Distribute the Evaluator\'s Checklist card. Review the 5 categories aloud: Voice / Body / Structure / Content / Impact. "You are watching for all five. When the speaker steps up, your job begins."'},
      ]},
    { startMin:8, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Live Evaluation Practice',
      steps:[
        {time:'8:00',action:'Write EVALUATION on the board. "Word of the Day: EVALUATION — a structured, honest, and constructive assessment of a speech designed to help the speaker grow. A great evaluation is a gift. It is also a speech. You are practising both skills simultaneously today."'},
        {time:'9:00',action:'Ask for 2 volunteer speakers. They will each give a 2-minute speech on any topic of their choice. The rest of the class evaluates INDIVIDUALLY in writing as they listen — Evaluator\'s Checklist in hand. "Your written evaluation must include at least one specific commendation (with WHY it worked) and one specific recommendation (with HOW to implement it)."'},
        {time:'11:00',action:'Speaker 1 delivers their 2-minute speech. Audience writes silently. Teacher models writing — be visibly engaged and noting specifics.'},
        {time:'13:30',action:'Speaker 2 delivers their 2-minute speech. Audience continues writing.'},
        {time:'16:00',action:'Evaluation round 1: 2-3 students each stand and deliver a 60-second C-R-C evaluation aloud. Time strictly — start a visible timer. Hold them to C-R-C structure. After each evaluator: "Was that commendation specific? Could the speaker use that recommendation tomorrow?"'},
        {time:'25:00',action:'Ask for a third volunteer speaker. "This is your chance to practise putting feedback INTO a speech, knowing the whole room is about to evaluate you." Speaker 3 delivers 2 minutes.'},
        {time:'27:30',action:'Evaluation round 2: 3-4 students deliver C-R-C evaluations. Watch for improvement: are evaluations more specific than round 1? More actionable? Give brief coaching between evaluators if needed.'},
        {time:'45:00',action:'Ask for Speaker 3\'s reaction: "Which evaluation was most useful — and specifically what made it useful?" Then ask Speakers 1-2 the same. This models that evaluations have quality levels.'},
        {time:'50:00',action:'Whole-room debrief: "How did it feel to GIVE a specific evaluation? How did it feel to RECEIVE one compared to a vague \'good job\'?" Brief round of hands — majority should prefer specific.'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Evaluator of the Day',
      steps:[
        {time:'52:00',action:'"Notice what happened today: you practised public speaking TWICE. Once when you evaluated. Once when you spoke — or listened with a critical ear. Evaluation IS practice."'},
        {time:'53:00',action:'C-R-C recall. Without notes: "What does C-R-C stand for?" (Commendation → Recommendation → Commendation.) "What makes a commendation useful?" (Specificity + WHY it worked.) "What makes a recommendation useful?" (Specificity + HOW to do it.)'},
        {time:'54:30',action:'Evaluator of the Day: the student whose evaluation was the most specific, actionable, and kind. Name the exact line that made it exceptional.'},
        {time:'56:00',action:'"Showcase is in ONE week. Your speech should be rehearsed enough that you could deliver it again right now if I called your name. Practice tonight. Practice tomorrow. Know your first sentence and your last sentence cold."'},
        {time:'57:30',action:'"Next week: GRAND SHOWCASE PART 1. Half the class presents. Real audience. This is what you have been building toward for 14 weeks."'},
        {time:'59:00',action:'Closing ritual.'},
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
        {time:'0:00',action:'Room is already set: chairs in rows or arc facing the speaking spot, clear walking path to the front. Microphone stand if available — even a prop one helps students feel the weight of the moment.'},
        {time:'2:00',action:'Grand Warm-Up Sequence — run all 5 steps together as a class, no skipping. STEP 1: Vocal warm-up. "Lip trills — motor-boat your lips for 5 seconds." Then: "Hmmm" on a single note, lips closed, feel the vibration. Then: \'red lorry yellow lorry\' articulation drill × 3 (slow, then faster). STEP 2: 5-Point Body Check from Week 3. "FEET — hip-width, planted. CORE — tall, not rigid. HANDS — loose at your sides. FACE — open, forward. EYES — scanning the room." STEP 3: Brave Breathing × 3. Whole class together: in 4 / hold 4 / out 6. Silence after the third round. STEP 4: Power Pose for 10 seconds. Arms wide or hands on hips — superhero stance. Hold it. "Feel the difference in your body." STEP 5: Anchor phrase — said aloud, together, with conviction: "I know my material. I have rehearsed. I am ready."'},
        {time:'8:00',action:'Brief the student MC: "Your job is to introduce each speaker professionally. Template: \'Our next speaker is [Name], Grade [X]. Today they will be speaking about [topic]. Please welcome [Name].\' That\'s it. Say it clearly, pause, then step aside."'},
        {time:'9:30',action:'"Speakers who present today: this is the moment you have been building toward for 14 weeks. Walk to the front. Do your Pre-Speech Ritual. Pause. Make eye contact. Begin. The audience is on your side."'},
      ]},
    { startMin:10, endMin:52, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase — First Half',
      steps:[
        {time:'10:00',action:'MC introduces Speaker 1. Speaker walks to the front — does not begin immediately. Pre-Speech Ritual: Brave Breath (silent) → anchor phrase (silent) → plant feet → scan the room with eye contact → PAUSE for 2 full seconds → begin. Teacher: do not rush this. The pause is part of the performance.'},
        {time:'13:00',action:'After each speech: audience Q&A — 1-2 questions from the audience. Speaker responds: "That is a great question. I would add..." Remind the audience they may ask anything from the speech. Coach speakers to answer in a full sentence, not just "yes" or "I don\'t know."'},
        {time:'14:30',action:'Between speakers: brief appreciation (not just applause — ask one audience member to name one specific thing they noticed). Then MC introduces the next speaker. Pace: approximately 4-5 minutes per speaker including intro, speech, Q&A, and appreciation.'},
        {time:'48:00',action:'Roughly half the class has presented — stop at a natural break after the last speaker finishes their Q&A.'},
        {time:'50:00',action:'Standing ovation for all speakers who presented today. Teacher leads: "These students stood in front of you, prepared for 14 weeks, and delivered. That takes real courage. Let them hear it."'},
      ]},
    { startMin:52, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Celebration + Preview',
      steps:[
        {time:'52:00',action:'"What surprised you most about one of the speeches today? Name something specific — a detail, a moment, a line." Take 3-4 audience responses. Push for specificity: not "it was good" but "when [name] said [line] I felt [response]."'},
        {time:'54:30',action:'To speakers who haven\'t presented yet: "You have spent this entire session watching the standard being set. Next week is your moment. You have seen what\'s possible. Keep rehearsing tonight and tomorrow. Know your first sentence and your last sentence cold."'},
        {time:'56:00',action:'To speakers who presented today: "How does it feel RIGHT NOW compared to Week 1?" Let 3-4 speakers answer honestly. This matters for the group who haven\'t gone yet — they see that the fear was worth it.'},
        {time:'58:30',action:'Closing ritual — together. One final time with full energy.'},
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
        {time:'0:00',action:'Room is set as showcase space. Certificates are hidden (do not reveal until the ceremony). "Last week Group 1 showed you what\'s possible. Group 2: you\'ve had one extra week to prepare, one extra week to watch, one extra week to think. Use it."'},
        {time:'2:00',action:'Grand Warm-Up Sequence — BOTH groups together. "One final time. The same ritual you\'ve done for 16 weeks. Let it be automatic." Run all 5: (1) Vocal warm-up — lip trills, hum, \'red lorry yellow lorry\' × 3. (2) 5-Point Body Check — FEET / CORE / HANDS / FACE / EYES. (3) Brave Breathing × 3 together, in silence on the third round. (4) Power Pose for 10 seconds. (5) Anchor phrase aloud: "I know my material. I have rehearsed. I am ready." Let the silence after that settle before moving on.'},
        {time:'8:00',action:'New MC for today (different from last week). Brief them: same template as last week. "You are part of the showcase. Introduce each speaker clearly, with confidence, with a pause after their name."'},
        {time:'9:30',action:'"Group 2 — this is what you have been building toward. 16 weeks of showing up, practising, failing, trying again. Right now, that\'s all you. Let\'s finish what we started."'},
      ]},
    { startMin:10, endMin:46, label:'MAIN ACTIVITY', emoji:'🎤', title:'Showcase — Second Half + Evaluations',
      steps:[
        {time:'10:00',action:'Remaining speakers present. Same full format as last week: MC introduces → speaker walks to the front → Pre-Speech Ritual (Brave Breath silent / anchor phrase silent / feet planted / eye contact sweep / PAUSE / begin) → speech (no interruptions) → Q&A from audience (1-2 questions). Pace: approximately 4-5 minutes per speaker.'},
        {time:'12:00',action:'Between each speaker: one audience member names one specific thing they noticed — not \'good job\' but \'when you slowed down for [moment], I felt [response].\' MC then introduces the next speaker. Keep momentum — no long gaps between speakers.'},
        {time:'42:00',action:'Final speaker finishes. Pause. Let the room sit with it for 3 seconds. Then: "One more time for everyone who has spoken this year — both groups." Standing ovation, both groups, together. Let it go as long as the room wants.'},
        {time:'44:00',action:'Evaluator Round: distribute paper. "Each of you: write a self-evaluation using C-R-C. Commend yourself on ONE specific thing you did well and WHY it worked. Give yourself ONE concrete recommendation — exactly HOW you would do it differently. Close with what you are PROUD of." Give 2 full minutes of silent writing.'},
      ]},
    { startMin:46, endMin:60, label:'WRAP-UP', emoji:'🌟', title:'Growth Arc + Legacy',
      steps:[
        {time:'46:00',action:'Growth Arc. "One sentence. Stand when you\'re ready and say it: In Week 1 I could not ___, but now I can ___." Every student shares — no skipping. Go around the room. Take your time. These sentences matter. Write 2-3 striking ones on the board as they\'re spoken.'},
        {time:'53:00',action:'Teacher reads 3 of the most remarkable growth arcs aloud — the ones that capture real change. "With your permission, I want to read what [name] said." These should be specific and vulnerable, not just \'I got better.\''},
        {time:'54:30',action:'Certificate ceremony. "When I call your name, come to the front." Call each student individually. "Certified SpeakUp Speaker — Grades 3-4, Fall 2026." Hand the certificate. Pause. Applause. Every single student is called.'},
        {time:'57:00',action:'"You are speakers. That is not something that goes away when you leave this room. You carry this. Next semester, you come back as the people who already know how to stand in front of a room and hold it." Class photo at the speaking spot — everyone standing at the front.'},
        {time:'59:00',action:'Final send-off. Loudest of the semester. All together: "I AM A SPEAKER."'},
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

  // ── RECOVERY: restore classroom_curriculum to enrichment curriculum rows ──
  // The previous seed run may have overwritten classroom_curriculum to point to
  // speaking-only curriculum rows (week_number 101-116). Restore them to the
  // original enrichment curriculum rows (week_number 1-16) so build/science/coding
  // days are accessible again.
  for (const classroom of [clG12, clG34]) {
    if (!classroom) continue
    // Find enrichment curriculum rows (week_number < 100) for this grade band
    const enrichmentRows = await sql`
      SELECT c.id, c.week_number, cc.week_start_date
      FROM curriculum c
      JOIN classroom_curriculum cc ON cc.curriculum_id = c.id
      WHERE cc.classroom_id = ${classroom.id} AND c.week_number < 100
    `
    // Also find orphaned enrichment rows not currently assigned
    const orphaned = await sql`
      SELECT c.id, c.week_number
      FROM curriculum c
      WHERE c.grade_band = ${classroom.grade_band} AND c.week_number BETWEEN 1 AND 16
      AND c.id NOT IN (
        SELECT curriculum_id FROM classroom_curriculum WHERE classroom_id = ${classroom.id}
      )
    `
    if (orphaned.length > 0) {
      console.log(`  Restoring ${orphaned.length} orphaned enrichment curriculum rows for ${classroom.grade_band}...`)
      for (const row of orphaned) {
        const weekStart = WEEK_STARTS[row.week_number - 1]
        if (!weekStart) continue
        await sql`
          INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
          VALUES (${classroom.id}, ${row.id}, ${weekStart})
          ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id
        `
        console.log(`  ✓ Restored ${classroom.grade_band} W${row.week_number} → enrichment curriculum`)
      }
    }
  }

  for (const [sessions, gradeBand, classroom] of [
    [SESSIONS_G12, 'g1-2', clG12],
    [SESSIONS_G34, 'g3-4', clG34],
  ]) {
    if (!classroom) { console.warn(`⚠  No classroom found for ${gradeBand}`); continue }

    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i]
      const weekNum = i + 1
      const weekStart = WEEK_STARTS[i]

      // Find the curriculum already assigned to this classroom for this week
      // (the enrichment curriculum that has build/science/coding days)
      const [cc] = await sql`
        SELECT curriculum_id FROM classroom_curriculum
        WHERE classroom_id = ${classroom.id} AND week_start_date = ${weekStart}
      `
      let curId = cc?.curriculum_id

      if (!curId) {
        // No curriculum assigned yet — create a new one and assign it
        const [ins] = await sql`
          INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
          VALUES (${s.title}, ${gradeBand}, ${weekNum + 100}, ${s.pillar + ' — SpeakUp'}, true)
          ON CONFLICT DO NOTHING
          RETURNING id
        `
        curId = ins?.id
        if (!curId) {
          const [ex] = await sql`SELECT id FROM curriculum WHERE grade_band = ${gradeBand} AND week_number = ${weekNum + 100}`
          curId = ex.id
        }
        await sql`
          INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
          VALUES (${classroom.id}, ${curId}, ${weekStart})
          ON CONFLICT DO NOTHING
        `
      }
      // If a curriculum already exists for this week, we attach the speaking day TO it
      // (never overwrite classroom_curriculum — keeps build/science/coding intact)

      // Upsert speaking curriculum_day within the existing curriculum
      const [existingDay] = await sql`SELECT id FROM curriculum_days WHERE curriculum_id = ${curId} AND subject = 'public_speaking'`
      let dayId = existingDay?.id
      if (!dayId) {
        const [day] = await sql`
          INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
          VALUES (${curId}, 3, 'public_speaking', ${s.title})
          RETURNING id
        `
        dayId = day.id
      } else {
        await sql`UPDATE curriculum_days SET theme = ${s.title} WHERE id = ${dayId}`
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
        bonusActivities: s.bonusActivities,
      }
      const [existingItem] = await sql`
        SELECT ci.id FROM curriculum_content cc2
        JOIN content_items ci ON ci.id = cc2.content_item_id
        WHERE cc2.curriculum_day_id = ${dayId}
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

      console.log(`✓ ${gradeBand} W${weekNum} [${weekStart}]: ${s.title.slice(0,50)}`)
    }
  }

  await sql.end()
  console.log('\n✅ SpeakUp 16-week curriculum seeded for both tracks!')
}

run().catch(e => { console.error(e); process.exit(1) })
