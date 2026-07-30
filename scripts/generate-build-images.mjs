/**
 * generate-build-images.mjs
 * Creates SVG step illustrations for Cable Car (G1-2) and Well Pulley (G3-4)
 * Output: public/images/build/cable-car/step-NN.svg
 *         public/images/build/well-pulley/step-NN.svg
 *
 * Run: node scripts/generate-build-images.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const PUBLIC = resolve(process.cwd(), 'public/images/build')
mkdirSync(`${PUBLIC}/cable-car`, { recursive: true })
mkdirSync(`${PUBLIC}/well-pulley`, { recursive: true })

const W = 960, H = 540

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg:        '#f0f4f8',
  header:    '#1e293b',
  cup:       '#d4956a',
  straw:     '#4ade80',
  rope:      '#3b82f6',
  tape:      '#fbbf24',
  clip:      '#94a3b8',
  cardboard: '#c49a4a',
  wood:      '#8B6914',
  dark:      '#1e293b',
  red:       '#dc2626',
  green:     '#16a34a',
  blue:      '#1d4ed8',
  orange:    '#ea580c',
  purple:    '#7c3aed',
  white:     '#ffffff',
  light:     '#f8fafc',
}

// ── SVG helpers ───────────────────────────────────────────────────────────────
const sq = (s) => s.replace(/"/g, '&quot;')
const bx = (x, y, w, h, fill, stroke=C.dark, sw=3, rx=0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" rx="${rx}"/>`
const ci = (cx, cy, r, fill, stroke=C.dark, sw=3) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
const el = (cx, cy, rx, ry, fill, stroke=C.dark, sw=3) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
const ln = (x1, y1, x2, y2, clr=C.dark, sw=3) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${clr}" stroke-width="${sw}" stroke-linecap="round"/>`
const tx = (x, y, s, sz=22, anc='middle', clr=C.dark, wt='normal') =>
  `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${anc}" fill="${clr}" font-weight="${wt}" font-family="system-ui,-apple-system,sans-serif">${s}</text>`
const pt = (d, fill='none', stroke=C.dark, sw=3) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`

function cup(cx, cy, tw, bw, h, fill=C.cup, stroke=C.dark) {
  const tl=cx-tw/2, tr=cx+tw/2, bl=cx-bw/2, br=cx+bw/2
  return `<polygon points="${tl},${cy} ${tr},${cy} ${br},${cy+h} ${bl},${cy+h}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
}

function cyl(cx, cy, w, h, fill=C.cardboard, stroke=C.dark) {
  const rx=w/2, ry=rx*0.32
  return `${bx(cx-rx, cy, w, h, fill, stroke, 3)}${el(cx,cy,rx,ry,fill,stroke,3)}${el(cx,cy+h,rx,ry,fill,stroke+'99',2)}`
}

function arr(x1, y1, x2, y2, clr=C.red, sw=4) {
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy)
  const ux=dx/len, uy=dy/len, px=-uy, py=ux, al=18
  return `${ln(x1,y1,x2,y2,clr,sw)}<polygon points="${x2},${y2} ${x2-ux*al+px*9},${y2-uy*al+py*9} ${x2-ux*al-px*9},${y2-uy*al-py*9}" fill="${clr}"/>`
}

function badge(x, y, s, bg=C.dark, fg='white', sz=19) {
  const w=s.length*sz*0.56+28
  return `${bx(x-w/2,y-sz-4,w,sz+18,bg,'none',0,10)}${tx(x,y+8,s,sz,'middle',fg,'bold')}`
}

function callout(x, y, w, h, title, lines, bg='#eff6ff', bc=C.blue) {
  let out = `${bx(x,y,w,h,bg,bc,2,10)}`
  if (title) out += tx(x+w/2, y+32, title, 20, 'middle', C.dark, 'bold')
  lines.forEach((l,i) => { out += tx(x+w/2, y+62+i*26, l, 18, 'middle', C.dark) })
  return out
}

function wrap(title, body) {
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect x="0" y="0" width="${W}" height="66" fill="${C.header}"/>
<text x="${W/2}" y="43" font-size="26" font-weight="bold" text-anchor="middle" fill="white" font-family="system-ui,-apple-system,sans-serif">${title}</text>
${body}
</svg>`
}

function save(path, svg) {
  writeFileSync(path, svg, 'utf8')
  console.log(`  ✓ ${path.replace(process.cwd()+'/', '')}`)
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CABLE CAR  (G1-2) — 12 steps
// ═══════════════════════════════════════════════════════════════════════════════

const cableCar = [

// 01 — Meet your materials
wrap('🚡  Step 1 — Meet your materials', `
${tx(W/2, 103, 'Check that you have everything before building:', 22, 'middle', C.dark)}

${/* Straw */bx(55,135,210,38,C.straw,C.dark,3,19)}
${tx(160,125,'STRAW',18,'middle',C.dark,'bold')}${tx(160,148,'(your pulley!)',16,'middle',C.dark)}

${/* Cup */cup(430,125,140,100,115,C.cup)}
${tx(430,118,'Paper cup',18,'middle',C.dark,'bold')}

${/* Paperclips */tx(660,155,'📎📎📎',44,'middle')}
${tx(660,115,'Paperclips',18,'middle',C.dark,'bold')}

${/* String */pt('M60 270 Q100 250 140 270 Q180 290 220 270 Q260 250 300 270 Q340 290 380 270','none',C.rope,4)}
${tx(220,305,'String (~30 cm)',20,'middle',C.dark,'bold')}

${/* Tape */bx(455,250,100,38,C.tape,C.dark,3,19)}
${tx(505,280,'Tape',20,'middle',C.dark,'bold')}

${/* Scissors */tx(660,265,'✂️',54,'middle')}
${tx(660,310,'Scissors',18,'middle',C.dark,'bold')}

${/* Pencil */tx(800,250,'✏️',54,'middle')}
${tx(800,310,'Pencil',18,'middle',C.dark,'bold')}

${bx(30,345,900,145,'#dbeafe','#3b82f6',2,12)}
${tx(W/2,385,'💡  Your STRAW is ALREADY on the zip line — don\'t remove it!',22,'middle','#1e40af','bold')}
${tx(W/2,418,'Lay out everything else and check it\'s all there.',19,'middle','#1e40af')}
${tx(W/2,448,'Ask your teacher if anything is missing.',19,'middle','#1e40af')}
`),

// 02 — Punch the holes
wrap('✂️  Step 2 — Punch the holes', `
${tx(W/2,103,'Use a pencil to poke 2 holes near the TOP RIM of your cup',21,'middle',C.dark)}

${/* Big cup */cup(W/2,145,230,170,210,C.cup)}

${/* Left hole */ci(385,178,13,C.bg,C.dark,4)}
${tx(260,163,'LEFT',24,'middle','#1e40af','bold')}
${tx(260,192,'hole',24,'middle','#1e40af','bold')}
${arr(300,178,372,178,'#1e40af',4)}

${/* Right hole */ci(575,178,13,C.bg,C.dark,4)}
${tx(700,163,'RIGHT',24,'middle',C.red,'bold')}
${tx(700,192,'hole',24,'middle',C.red,'bold')}
${arr(662,178,590,178,C.red,4)}

${/* Top view inset */bx(700,290,220,180,'white',C.dark,2,10)}
${tx(810,318,'Top view:',18,'middle',C.dark,'bold')}
${el(810,385,85,55,C.cup)}
${ci(725,385,12,C.bg,C.dark,3)}
${ci(895,385,12,C.bg,C.dark,3)}
${ln(725,385,895,385,'#94a3b8',2)}
${tx(810,448,'holes OPPOSITE each other',14,'middle','#475569')}

${badge(W/2,500,'Holes must be as close to the TOP RIM as possible',C.dark,'white',19)}
`),

// 03 — Thread the string
wrap('🧵  Step 3 — Thread the string', `
${tx(W/2,103,'Cut 30 cm of string — thread it through BOTH holes',21,'middle',C.dark)}

${cup(W/2,150,240,180,215,C.cup)}

${/* Holes */ci(380,183,12,C.bg,C.dark,4)}
${ci(580,183,12,C.bg,C.dark,4)}

${/* String entering left */ln(285,183,380,183,C.rope,5)}
<line x1="380" y1="183" x2="580" y2="183" stroke="${C.rope}" stroke-width="4" stroke-dasharray="14 8"/>
${/* String exiting right */ln(580,183,680,183,C.rope,5)}

${arr(225,183,283,183,'#1e40af',4)}
${tx(185,163,'Enter',20,'middle','#1e40af','bold')}
${tx(185,188,'here →',20,'middle','#1e40af','bold')}

${arr(740,183,685,183,C.red,4)}
${tx(790,163,'← Exit',20,'middle',C.red,'bold')}
${tx(790,188,'here',20,'middle',C.red,'bold')}

${/* Hanging ends */ln(285,183,245,380,C.rope,5)}
${tx(220,400,'End 1',20,'middle',C.rope,'bold')}
${ln(680,183,720,380,C.rope,5)}
${tx(750,400,'End 2',20,'middle',C.rope,'bold')}

${badge(W/2,490,'Both ends hang OUTSIDE the cup — ready to tie knots!',C.dark,'white',19)}
`),

// 04 — Hook onto the straw
wrap('🎪  Step 4 — Hook onto the straw', `
${tx(W/2,103,'Bring BOTH string ends UP — one on each side of the straw. Hold them above.',20,'middle',C.dark)}

${/* Zip line */ln(60,155,900,155,'#94a3b8',3)}
${tx(65,143,'zip line →',16,'left','#94a3b8','bold')}

${/* Straw */bx(240,143,480,24,C.straw,C.dark,3,12)}
${tx(480,133,'STRAW',20,'middle',C.dark,'bold')}

${/* Cup */cup(480,310,220,164,185,C.cup)}

${/* Holes */ci(368,314,11,C.bg,C.dark,4)}
${ci(592,314,11,C.bg,C.dark,4)}

${/* Left string going UP past left side of straw */ln(368,314,305,155,C.rope,5)}
${/* End held above */ci(305,140,10,C.rope,C.dark,3)}
${tx(220,135,'hold here',17,'middle',C.rope,'bold')}
${arr(270,138,295,138,C.rope,3)}

${/* Right string going UP past right side of straw */ln(592,314,655,155,C.rope,5)}
${ci(655,140,10,C.rope,C.dark,3)}
${tx(740,135,'hold here',17,'middle',C.rope,'bold')}
${arr(695,138,665,138,C.rope,3)}

${/* LEFT label */tx(155,235,'LEFT end',18,'middle','#1e40af','bold')}
${tx(155,257,'goes up this side',16,'middle','#1e40af')}
${arr(210,246,295,200,'#1e40af',3)}

${/* RIGHT label */tx(805,235,'RIGHT end',18,'middle','#1e40af','bold')}
${tx(805,257,'goes up this side',16,'middle','#1e40af')}
${arr(755,246,666,200,'#1e40af',3)}

${badge(W/2,495,'Don\'t let go yet — you\'ll tie the two ends together in the next step!',C.orange,'white',18)}
`),

// 05 — Tie the knots
wrap('🪢  Step 5 — Tie the knots', `
${tx(W/2,103,'Tie both string ends TOGETHER in one knot on top of the straw.',20,'middle',C.dark)}

${/* Zip line */ln(60,210,900,210,'#94a3b8',3)}
${tx(65,202,'zip line',15,'left','#94a3b8')}

${/* Straw */bx(240,198,480,24,C.straw,C.dark,3,12)}
${tx(130,212,'STRAW →',18,'right',C.dark,'bold')}

${/* Knot on top of straw — label beside, not above */ci(480,193,15,'#fbbf24',C.dark,3)}
${tx(660,175,'← knot',17,'left','#92400e','bold')}
${tx(660,196,'(both ends tied here)',15,'left','#92400e')}
${arr(655,185,500,190,'#92400e',3)}

${/* Strings from knot down to cup holes */ln(480,208,385,325,C.rope,5)}
${ln(480,208,575,325,C.rope,5)}

${/* Holes */ci(385,327,11,C.bg,C.dark,4)}
${ci(575,327,11,C.bg,C.dark,4)}

${/* Cup */cup(480,325,220,164,175,C.cup)}

${/* Level indicator */ln(383,330,577,330,C.green,3)}
${ci(383,330,5,C.green,'none')}${ci(577,330,5,C.green,'none')}
${tx(480,370,'level ✓',18,'middle',C.green,'bold')}

${callout(30,230,260,195,'The loop:',['Straw sits INSIDE','the string loop.','It can\'t fall off!','String pulls tight','around the straw.'],'#f0fdf4',C.green)}

${badge(W/2,492,'Pull tight! If cup tilts, untie and re-tie with equal string on both sides.',C.dark,'white',18)}
`),

// 06 — Reinforce the holes
wrap('🩹  Step 6 — Reinforce the holes', `
${tx(W/2,103,'Put a small piece of tape over each hole — inside AND outside',21,'middle',C.dark)}

${cup(W/2,148,230,172,208,C.cup)}

${/* Left hole */ci(385,181,12,C.bg,C.dark,4)}
${bx(358,165,55,32,C.tape,'#92400e',3,4)}
${tx(265,175,'Tape',22,'middle','#92400e','bold')}
${tx(265,200,'outside',18,'middle','#92400e')}
${arr(305,182,355,182,'#92400e',3)}

${/* Right hole */ci(575,181,12,C.bg,C.dark,4)}
${bx(522,165,55,32,C.tape,'#92400e',3,4)}
${tx(693,175,'Tape',22,'middle','#92400e','bold')}
${tx(693,200,'outside',18,'middle','#92400e')}
${arr(655,182,580,182,'#92400e',3)}

${/* Why box */callout(680,280,250,200,'🤔  Why?',['When cargo is heavy,','the string pulls hard','and can TEAR through','the cup wall.','Tape stops that!'],'#fff7ed','#ea580c')}

${badge(W/2,497,'Press tape firmly. Do BOTH sides of each hole.',C.dark,'white',20)}
`),

// 07 — Dry test
wrap('🚦  Step 7 — Dry test (no cargo yet!)', `
${tx(W/2,103,'Slide your cable car to the TOP and let go — does it reach the end?',20,'middle',C.dark)}

${/* Zip line */ln(65,165,870,445,C.dark,6)}
${tx(65,153,'🔝 START',20,'left',C.dark,'bold')}
${tx(870,460,'END 🏁',20,'right',C.dark,'bold')}

<g transform="rotate(28 450 295)">
  <rect x="412" y="284" width="78" height="22" fill="${C.straw}" stroke="${C.dark}" stroke-width="3" rx="11"/>
</g>

${/* Cup */cup(450,308,115,84,95,C.cup)}
${ln(413,300,395,308,C.rope,3)}
${ln(487,300,505,308,C.rope,3)}

${/* Motion arrow */arr(290,215,420,290,C.red,5)}
${tx(285,200,'SLIDES DOWN',24,'middle',C.red,'bold')}
${tx(285,228,'→',30,'middle',C.red,'bold')}

${callout(600,150,325,230,'✅  Check all three:',['1. Reaches the end?','2. Slides smoothly?','3. Cup stays level?'],'#f0fdf4',C.green)}

${badge(W/2,495,'If it stops: check tape is not catching on the straw',C.orange,'white',19)}
`),

// 08 — Cargo Challenge Round 1
wrap('📎  Step 8 — Cargo Challenge Round 1', `
${tx(W/2,103,'Drop 3 paperclips INTO your cup. Test the zip line again!',21,'middle',C.dark)}

${ln(65,165,830,415,C.dark,5)}
${tx(65,153,'🔝 START',18,'left',C.dark,'bold')}

<g transform="rotate(27 435 280)">
  <rect x="397" y="269" width="78" height="22" fill="${C.straw}" stroke="${C.dark}" stroke-width="3" rx="11"/>
</g>
${cup(435,294,120,88,102,C.cup)}
${ln(400,286,382,294,C.rope,3)}
${ln(470,286,488,294,C.rope,3)}
${tx(435,330,'📎  📎  📎',30,'middle')}
${tx(435,363,'3 paperclips',18,'middle','#475569','bold')}

${arr(275,220,395,284,C.red,4)}

${callout(615,150,310,250,'📋  Class chart:',['Name: __________','Cargo: 3 clips','Made it to end?','⬜ YES    ⬜ NO'],'#eff6ff',C.blue)}

${badge(W/2,497,'💡  GRAVITY pulls the cargo down — heavier = more pull!',C.blue,'white',19)}
`),

// 09 — Cargo Challenge Round 2
wrap('📈  Step 9 — Cargo Challenge Round 2', `
${tx(W/2,103,'Add paperclips ONE AT A TIME. Test after each one. Find your maximum!',20,'middle',C.dark)}

${ln(60,165,740,415,C.dark,5)}
${tx(60,153,'🔝 START',18,'left',C.dark,'bold')}

<g transform="rotate(30 390 272)">
  <rect x="352" y="261" width="78" height="22" fill="${C.straw}" stroke="${C.dark}" stroke-width="3" rx="11"/>
</g>
${cup(390,288,125,92,108,C.cup)}
${ln(355,280,338,288,C.rope,3)}
${ln(425,280,442,288,C.rope,3)}
${tx(390,320,'📎📎📎📎📎',28,'middle')}
${tx(390,348,'📎📎📎',28,'middle')}
${arr(230,330,332,320,C.red,4)}
${tx(190,310,'+1 at',20,'middle',C.red,'bold')}
${tx(190,338,'a time',20,'middle',C.red,'bold')}

${/* Chart */bx(650,140,280,300,'white',C.dark,3,10)}
${bx(650,140,280,44,C.dark,C.dark,0,10)}
${tx(790,168,'Class Chart',20,'middle','white','bold')}
${ln(650,184,930,184,C.dark,2)}
${tx(730,205,'Name',17,'middle',C.dark,'bold')}
${ln(800,184,800,440,C.dark,1)}
${tx(865,205,'Max 📎',17,'middle',C.dark,'bold')}
${[214,240,267,294,321,348,375,402].map((y,i)=>
  i%2===0 ? `${ln(650,y+15,930,y+15,'#e2e8f0',1)}${tx(730,y+10,'__________',16,'middle','#94a3b8')}${tx(865,y+10,'_____',16,'middle','#94a3b8')}` : ''
).join('')}

${badge(W/2,498,'When it stops before the end = your MAX. Write it on the chart!',C.dark,'white',18)}
`),

// 10 — Fix time
wrap('🔧  Step 10 — Fix time!', `
${tx(W/2,103,'Why did it stop? Make ONE change and retest.',21,'middle',C.dark)}

${/* Problems */bx(30,130,410,310,'#fef2f2',C.red,2,12)}
${tx(235,165,'❌  Common problems:',21,'middle',C.red,'bold')}
${tx(120,200,'•  Cup is tilting sideways',19,'left',C.dark)}
${tx(120,230,'•  Tape is touching the straw',19,'left',C.dark)}
${tx(120,260,'•  Cargo is piled on one side',19,'left',C.dark)}
${tx(120,290,'•  String is caught on something',19,'left',C.dark)}
${tx(120,320,'•  Cup is too heavy (too many clips)',19,'left',C.dark)}
${tx(120,350,'•  Zip line has too much sag',19,'left',C.dark)}

${/* Fixes */bx(490,130,440,310,'#f0fdf4',C.green,2,12)}
${tx(710,165,'✅  Try these fixes:',21,'middle',C.green,'bold')}
${tx(580,200,'•  Re-centre cargo evenly',19,'left',C.dark)}
${tx(580,230,'•  Remove 1-2 paperclips',19,'left',C.dark)}
${tx(580,260,'•  Loosen tape near straw',19,'left',C.dark)}
${tx(580,290,'•  Re-thread so cup is level',19,'left',C.dark)}
${tx(580,320,'•  Ask teacher to tighten line',19,'left',C.dark)}
${tx(580,350,'•  Try just ONE fix at a time!',19,'left',C.dark,'bold')}

${badge(W/2,497,'FRICTION is slowing it down. Less friction = more cargo!',C.orange,'white',19)}
`),

// 11 — Update class chart
wrap('📊  Step 11 — Update the class chart', `
${tx(W/2,103,'After your best fix — write your new maximum on the class chart.',21,'middle',C.dark)}

${/* Big chart */bx(90,130,780,320,'white',C.dark,3,12)}
${bx(90,130,780,48,C.dark,C.dark,0,12)}
${tx(480,162,'⭐  Cable Car Class Record  ⭐',24,'middle','white','bold')}
${ln(90,178,870,178,C.dark,2)}
${tx(250,205,'Student Name',18,'middle',C.dark,'bold')}
${ln(420,178,420,450,C.dark,1)}
${tx(560,205,'Round 1',18,'middle',C.dark,'bold')}
${ln(640,178,640,450,C.dark,1)}
${tx(755,205,'Best Score',18,'middle',C.dark,'bold')}
${[0,1,2,3,4,5].map(i => {
  const y=218+i*42
  return `${ln(90,y+30,870,y+30,'#e2e8f0',1)}${tx(250,y+18,'__________________',17,'middle','#94a3b8')}${tx(560,y+18,'_____',17,'middle','#94a3b8')}${tx(755,y+18,'_____',17,'middle','#94a3b8')}`
}).join('')}

${bx(90,458,780,52,'#fef9c3','#ca8a04',2,10)}
${tx(480,482,'🏆  Who carried the most paperclips? Compare with classmates!',20,'middle','#713f12','bold')}

${badge(W/2,530,'',C.dark)}
`),

// 12 — Share out
wrap('🎤  Step 12 — Share out!', `
${tx(W/2,103,'Tell the class what you built and what you discovered!',21,'middle',C.dark)}

${/* Speech template */bx(80,130,800,140,'white',C.dark,3,12)}
${tx(480,165,'"My cable car carried ___ paperclips.',22,'middle',C.dark,'bold')}
${tx(480,198,'I changed ___ and it ___."',22,'middle',C.dark,'bold')}
${tx(480,230,'(fill in your own result!)',17,'middle','#64748b')}

${/* Vocab box */bx(80,290,800,175,'#faf5ff','#7c3aed',2,12)}
${tx(480,322,'📚  Key vocabulary — use these words!',22,'middle',C.purple,'bold')}
${bx(100,340,168,80,'#ede9fe','none',0,8)}${tx(184,370,'PULLEY',20,'middle',C.purple,'bold')}${tx(184,395,'(your straw)',16,'middle',C.purple)}
${bx(282,340,168,80,'#ede9fe','none',0,8)}${tx(366,370,'GRAVITY',20,'middle',C.purple,'bold')}${tx(366,395,'(pulls cargo down)',16,'middle',C.purple)}
${bx(464,340,168,80,'#ede9fe','none',0,8)}${tx(548,370,'LOAD',20,'middle',C.purple,'bold')}${tx(548,395,'(the paperclips)',16,'middle',C.purple)}
${bx(646,340,168,80,'#ede9fe','none',0,8)}${tx(730,370,'FRICTION',20,'middle',C.purple,'bold')}${tx(730,395,'(slows it down)',16,'middle',C.purple)}

${tx(W/2,500,'⚡  Real cable cars + ski lifts use the SAME pulley system you just built!',20,'middle','#475569','bold')}
`),
]

// ═══════════════════════════════════════════════════════════════════════════════
//  WELL PULLEY  (G3-4) — 13 steps
// ═══════════════════════════════════════════════════════════════════════════════

const wellPulley = [

// 01 — Wheel & Axle science
wrap('⚙️  Step 1 — The science: Wheel &amp; Axle', `
${tx(W/2,103,'You are building a SIMPLE MACHINE today. Here\'s how it works:',21,'middle',C.dark)}

${/* Axle */bx(280,210,400,22,C.cardboard,C.dark,3,11)}
${tx(480,200,'AXLE  (skewer)',20,'middle','#92400e','bold')}

${/* Wheel/crank circle */ci(700,221,70,'#fed7aa',C.dark,4)}
${tx(700,225,'WHEEL',22,'middle',C.dark,'bold')}
${tx(700,250,'(crank)',18,'middle','#92400e')}

${/* Handle */bx(768,207,60,28,C.wood,C.dark,3,6)}

${/* String winding */ln(380,232,380,340,C.rope,5)}
${ln(380,232,360,232,C.rope,4)}
${ln(380,250,355,250,C.rope,4)}
${ln(380,268,360,268,C.rope,4)}
${tx(310,285,'string',18,'middle',C.rope,'bold')}
${tx(310,308,'winds up',18,'middle',C.rope)}

${/* Bucket */cup(380,340,80,60,70,C.cup)}
${ln(350,340,340,310,C.rope,4)}
${ln(410,340,420,310,C.rope,4)}
${tx(380,410,'BUCKET',18,'middle',C.dark,'bold')}
${tx(380,433,'(rises!)',18,'middle',C.dark)}
${arr(380,430,380,395,C.green,4)}

${/* Rotation arrow */pt(`M 720 160 A 80 80 0 0 1 780 210`,'none',C.red,3)}
${tx(745,148,'turn',18,'middle',C.red,'bold')}
${tx(745,168,'crank',18,'middle',C.red,'bold')}

${callout(30,160,220,230,'The chain:',['Turn crank','→ axle spins','→ string winds','→ bucket rises!'],'#fff7ed',C.orange)}

${badge(W/2,497,'More crank turns = more string wound = bucket rises higher',C.dark,'white',19)}
`),

// 02 — Build the well body
wrap('🏗️  Step 2 — Build the well body', `
${tx(W/2,103,'Stack 2 cardboard sheets, roll them tightly into a cylinder, tape the seam.',20,'middle',C.dark)}

${/* Step 1: Flat sheets */bx(55,148,200,130,C.cardboard,'#92400e',3,4)}
${bx(65,158,200,130,C.cardboard,'#92400e',3,4)}
${tx(165,200,'2 sheets',18,'middle',C.dark,'bold')}
${tx(165,225,'stacked',18,'middle',C.dark)}

${arr(300,220,390,220,C.red,5)}
${tx(345,208,'roll',18,'middle',C.dark,'bold')}

<path d="M420,148 Q500,148 500,215 Q500,280 420,280" fill="none" stroke="${C.cardboard}" stroke-width="8"/>
${tx(480,230,'roll',18,'middle',C.dark,'bold')}
${tx(480,255,'tightly!',18,'middle',C.dark)}

${arr(560,220,640,220,C.red,5)}
${tx(600,208,'tape',18,'middle',C.dark,'bold')}

${/* Result: cylinder */cyl(750,145,140,160,C.cardboard,C.dark)}
${bx(817,145,5,160,'#fbbf24','none',0)}
${tx(750,135,'CYLINDER',20,'middle',C.dark,'bold')}
${tx(750,330,'tape seam',18,'middle','#92400e')}
${arr(750,345,822,290,'#92400e',3)}

${badge(W/2,455,'Roll from one CORNER — it makes a tighter tube',C.dark,'white',19)}
${tx(W/2,498,'Test it: should hold shape without springing open. Tape more if needed.',18,'middle','#475569')}
`),

// 03 — Attach the base
wrap('🔲  Step 3 — Attach the base', `
${tx(W/2,103,'Stand the cylinder on the flat cardboard square. Tape all the way around.',21,'middle',C.dark)}

${/* Base */bx(330,340,300,130,C.cardboard,'#92400e',3,6)}
${tx(480,415,'CARDBOARD BASE',18,'middle','#92400e','bold')}

${/* Cylinder */cyl(480,165,140,175,C.cardboard,C.dark)}

${/* Tape ring */bx(402,335,156,20,C.tape,'#92400e',3,4)}
${tx(480,330,'tape all around',18,'middle','#92400e','bold')}
${arr(480,322,480,310,'#92400e',3)}

${/* Stability test */bx(640,200,270,190,'#f0fdf4',C.green,2,12)}
${tx(775,233,'Stability test:',20,'middle',C.green,'bold')}
${tx(775,260,'Push the cylinder',18,'middle',C.dark)}
${tx(775,283,'sideways firmly.',18,'middle',C.dark)}
${tx(775,306,'It should NOT',18,'middle',C.dark)}
${tx(775,329,'tip over!',20,'middle',C.red,'bold')}
${arr(570,315,637,315,C.green,3)}

${badge(W/2,497,'Tape a FULL circle — no gaps — or it will tip under cargo weight',C.dark,'white',19)}
`),

// 04 — Add the uprights
wrap('🪵  Step 4 — Add the uprights', `
${tx(W/2,103,'Push one popsicle stick into each SIDE of the cylinder (left &amp; right).',21,'middle',C.dark)}

${/* Cylinder + base */bx(360,260,240,100,C.cardboard,'#92400e',3,6)}
${cyl(480,140,140,122,C.cardboard,C.dark)}

${/* Left stick */bx(348,100,18,200,C.wood,'#5c3d0a',3,4)}
${/* Right stick */bx(594,100,18,200,C.wood,'#5c3d0a',3,4)}

${/* Height annotation */ln(635,100,680,100,'#475569',2)}
${ln(635,240,680,240,'#475569',2)}
${ln(657,100,657,240,'#475569',2)}
${arr(657,240,657,102,'#475569',2)}
${tx(700,175,'8–10 cm',18,'middle','#475569','bold')}
${tx(700,200,'above top',16,'middle','#475569')}

${/* Instruction callout */callout(30,130,290,250,'How to insert:',['Push INTO the','corrugated ridges.','No tape needed if','it grips tightly.','Tape base only if','it wobbles.'],'#fff7ed',C.orange)}

${badge(W/2,497,'Sticks must be directly OPPOSITE each other — left and right',C.dark,'white',19)}
`),

// 05 — Install the axle
wrap('🔩  Step 5 — Install the axle', `
${tx(W/2,103,'Rest the wooden skewer across BOTH sticks. Tape ends — but it must still SPIN!',20,'middle',C.dark)}

${/* Left stick */bx(178,130,18,240,C.wood,'#5c3d0a',3,4)}
${/* Right stick */bx(764,130,18,240,C.wood,'#5c3d0a',3,4)}

${/* Axle/skewer */bx(155,210,650,18,C.cardboard,'#5c3d0a',4,9)}
${tx(480,200,'AXLE (skewer)',22,'middle','#92400e','bold')}

${/* Tape at ends */bx(155,206,40,26,C.tape,'#92400e',3,4)}
${bx(765,206,40,26,C.tape,'#92400e',3,4)}
${tx(175,248,'tape',16,'middle','#92400e')}
${tx(785,248,'tape',16,'middle','#92400e')}

<path d="M 430 180 A 50 50 0 0 1 530 180" fill="none" stroke="${C.red}" stroke-width="4"/>
<polygon points="530,180 518,165 540,165" fill="${C.red}"/>
${tx(480,160,'must spin freely!',20,'middle',C.red,'bold')}

${bx(140,330,720,150,'#fef2f2',C.red,2,12)}
${tx(480,363,'⚠️  CRITICAL CHECK:',22,'middle',C.red,'bold')}
${tx(480,393,'Spin the skewer with your fingers right now.',20,'middle',C.dark)}
${tx(480,420,'If it doesn\'t rotate, remove tape and try again with LESS tape.',18,'middle',C.dark)}
${tx(480,447,'The axle MUST spin or the machine won\'t work!',18,'middle',C.red,'bold')}
`),

// 06 — Attach the string
wrap('🧵  Step 6 — Attach the string', `
${tx(W/2,103,'Tie one end to the CENTRE of the skewer. Wind it 3–4 times. Let the rest hang.',20,'middle',C.dark)}

${/* Sticks */bx(178,130,18,240,C.wood,'#5c3d0a',3,4)}
${bx(764,130,18,240,C.wood,'#5c3d0a',3,4)}

${/* Axle */bx(155,210,650,18,C.cardboard,'#5c3d0a',4,9)}
${tx(480,200,'skewer (axle)',18,'middle','#92400e','bold')}

${/* Centre marker */ci(480,219,10,'#fbbf24',C.dark,3)}
${tx(480,180,'tie here',18,'middle','#1e40af','bold')}
${arr(480,175,480,168,'#1e40af',3)}

${/* String wound around */ci(480,219,28,'none',C.rope,5)}
${ci(480,219,36,'none',C.rope,3)}

${/* Hanging string */ln(480,247,480,420,C.rope,5)}
${tx(525,350,'string',18,'middle',C.rope,'bold')}
${tx(525,375,'hangs',18,'middle',C.rope)}
${tx(525,400,'down',18,'middle',C.rope)}
${tx(525,420,'into well',18,'middle',C.rope)}
${arr(510,415,492,410,C.rope,3)}

${callout(640,180,280,230,'Steps:',['1. Tie knot at centre','2. Wind 3–4 times','3. Let rest hang down','4. The bucket attaches','   to the hanging end'],'#eff6ff',C.blue)}

${badge(W/2,497,'Wind in ONE direction — it will unwind cleanly when you lower the bucket',C.dark,'white',18)}
`),

// 07 — Make the bucket
wrap('🪣  Step 7 — Make the bucket', `
${tx(W/2,103,'Roll a small piece of corrugated cardboard into a mini cylinder = your BUCKET!',20,'middle',C.dark)}

${/* Bucket cylinder */cyl(480,180,110,110,'#d4956a',C.dark)}
${tx(480,172,'BUCKET',20,'middle',C.dark,'bold')}

${/* 3 strings attached at rim equally spaced */ln(425,183,360,310,C.rope,4)}
${ln(480,180,480,310,C.rope,4)}
${ln(535,183,600,310,C.rope,4)}
${tx(360,310,'str',14,'middle',C.rope)}
${tx(480,310,'str',14,'middle',C.rope)}
${tx(600,310,'str',14,'middle',C.rope)}

${/* Join to one knot */ln(360,310,480,360,C.rope,4)}
${ln(600,310,480,360,C.rope,4)}
${ln(480,310,480,360,C.rope,4)}
${ci(480,360,12,'#fbbf24',C.dark,3)}
${tx(480,350,'knot',16,'middle','#92400e')}

${/* Main string up */ln(480,372,480,420,C.rope,5)}
${tx(480,440,'to axle',18,'middle',C.rope,'bold')}
${arr(480,444,480,438,C.rope,3)}

${callout(640,155,285,235,'3-string trick:',['Space strings equally','around the rim','(like a tripod).','Gather all 3 ends','to ONE knot.','Bucket hangs LEVEL!'],'#f0fdf4',C.green)}

${badge(W/2,497,'Test: hold the combined knot — does bucket hang straight?',C.dark,'white',19)}
`),

// 08 — Add the crank
wrap('🎡  Step 8 — Add the crank', `
${tx(W/2,103,'Tape the cardstock strip to ONE END of the skewer — this is your CRANK!',21,'middle',C.dark)}

${/* Sticks */bx(178,130,18,250,C.wood,'#5c3d0a',3,4)}
${bx(764,130,18,250,C.wood,'#5c3d0a',3,4)}

${/* Axle */bx(155,210,650,18,C.cardboard,'#5c3d0a',4,9)}

${/* Crank handle */bx(765,190,90,58,'#fed7aa',C.dark,4,6)}
${tx(810,213,'CRANK',20,'middle',C.dark,'bold')}
${tx(810,235,'(handle)',16,'middle','#92400e')}

${/* Tape fixing crank to axle */bx(763,205,18,28,C.tape,'#92400e',3,4)}
${tx(745,265,'tape',16,'middle','#92400e')}

<path d="M 810 160 A 55 55 0 0 1 870 220" fill="none" stroke="${C.red}" stroke-width="4"/>
<polygon points="870,220 855,210 872,198" fill="${C.red}"/>
${tx(840,152,'TURN',22,'middle',C.red,'bold')}
${tx(840,178,'to wind',18,'middle',C.red)}
${tx(840,200,'string!',18,'middle',C.red)}

${callout(30,160,280,240,'Wheel & Axle:',['Crank = the WHEEL','(big radius)','','Skewer = the AXLE','(small radius)','','Big wheel, small axle','= MECHANICAL ADVANTAGE'],'#fff7ed',C.orange)}

${badge(W/2,497,'The LONGER the crank handle, the easier it is to wind the string!',C.dark,'white',19)}
`),

// 09 — Test your well
wrap('✅  Step 9 — Test your well!', `
${tx(W/2,103,'Turn the crank — does the bucket rise? Both directions should work!',21,'middle',C.dark)}

${bx(360,270,240,100,C.cardboard,'#92400e',3,6)}
${cyl(480,148,140,122,C.cardboard,C.dark)}
${bx(368,130,18,200,C.wood,'#5c3d0a',3,4)}
${bx(594,130,18,200,C.wood,'#5c3d0a',3,4)}
${bx(345,200,290,18,C.cardboard,'#5c3d0a',4,9)}
${bx(633,180,80,58,'#fed7aa',C.dark,4,6)}
${tx(673,210,'CRANK',16,'middle',C.dark,'bold')}

${/* String and bucket */ln(480,218,480,390,C.rope,5)}
${cup(480,390,80,60,65,C.cup)}
${ln(450,390,440,380,C.rope,3)}
${ln(510,390,520,380,C.rope,3)}

<path d="M 700 205 A 40 40 0 0 1 740 165" fill="none" stroke="${C.green}" stroke-width="4"/>
<polygon points="740,165 730,152 748,150" fill="${C.green}"/>
${tx(745,145,'↑ bucket RISES',18,'left',C.green,'bold')}

<path d="M 740 205 A 40 40 0 0 0 700 165" fill="none" stroke="#3b82f6" stroke-width="4"/>
<polygon points="700,165 710,152 692,150" fill="#3b82f6"/>
${tx(640,145,'bucket LOWERS ↓',18,'right','#3b82f6','bold')}

${callout(30,200,290,200,'Test checklist:',['⬜ Clockwise = rises?','⬜ Counter-cw = lowers?','⬜ String stays wound?','⬜ Bucket doesn\'t tip?'],'#f0fdf4',C.green)}

${badge(W/2,497,'Not working? Ask your teacher for an INSTRUCTOR CHECK!',C.orange,'white',19)}
`),

// 10 — Count the cranks
wrap('📊  Step 10 — Count the cranks', `
${tx(W/2,103,'Lower bucket to bottom. Count FULL crank turns to raise it all the way up.',21,'middle',C.dark)}

${/* Well */bx(310,250,240,100,C.cardboard,'#92400e',3,6)}
${cyl(430,140,130,112,C.cardboard,C.dark)}
${bx(318,125,18,195,C.wood,'#5c3d0a',3,4)}
${bx(528,125,18,195,C.wood,'#5c3d0a',3,4)}
${bx(298,195,270,18,C.cardboard,'#5c3d0a',4,9)}
${bx(566,173,70,50,'#fed7aa',C.dark,4,6)}

${/* Bucket at bottom */cup(430,385,80,60,65,C.cup)}
${ln(430,218,430,385,C.rope,4)}
${tx(430,455,'START:\nbucket down',18,'middle','#475569')}

${/* Tally chart */bx(600,130,320,310,'white',C.dark,3,12)}
${bx(600,130,320,46,C.dark,C.dark,0,12)}
${tx(760,160,'My tally',22,'middle','white','bold')}
${tx(760,210,'Count full turns:',18,'middle',C.dark,'bold')}

${/* Tally marks */tx(760,270,'|  |  |  |  |',40,'middle','#475569','bold')}
${tx(760,330,'  |  |  |',40,'middle','#475569','bold')}

${tx(760,390,'= ___ cranks',24,'middle',C.dark,'bold')}

${badge(W/2,497,'Write your count on the class chart! Compare with other groups.',C.dark,'white',19)}
`),

// 11 — Cargo test
wrap('🪙  Step 11 — Cargo test', `
${tx(W/2,103,'Put 3 pennies in your bucket. Count the cranks to raise it. Harder?',21,'middle',C.dark)}

${/* Bucket with cargo */cyl(320,220,110,100,'#d4956a',C.dark)}
${/* Pennies */ci(282,260,16,'#d97706',C.dark,2)}
${ci(320,255,16,'#d97706',C.dark,2)}
${ci(356,260,16,'#d97706',C.dark,2)}
${tx(282,264,'1¢',13,'middle',C.dark)}
${tx(320,259,'1¢',13,'middle',C.dark)}
${tx(356,264,'1¢',13,'middle',C.dark)}
${tx(320,170,'BUCKET',18,'middle',C.dark,'bold')}
${tx(320,195,'with cargo',16,'middle','#475569')}

${/* Comparison */bx(480,140,440,290,'white',C.dark,3,12)}
${bx(480,140,440,46,C.dark,C.dark,0,12)}
${tx(700,165,'Compare:',22,'middle','white','bold')}
${tx(700,215,'Empty bucket:  ___ cranks',20,'middle',C.dark)}
${ln(480,235,920,235,'#e2e8f0',1)}
${tx(700,270,'Loaded bucket:  ___ cranks',20,'middle',C.dark)}
${ln(480,290,920,290,'#e2e8f0',1)}
${tx(700,330,'Difference:  ___ cranks',20,'middle',C.dark,'bold')}

${tx(700,400,'Heavier cargo = more cranks',19,'middle','#475569')}
${tx(700,425,'OR…  it just feels harder!',19,'middle','#475569')}

${badge(W/2,497,'MECHANICAL ADVANTAGE = using a machine to lift heavy loads',C.dark,'white',19)}
`),

// 12 — Improve
wrap('🔧  Step 12 — Improve it!', `
${tx(W/2,103,'Challenge: can you reduce the number of cranks needed? Try ONE thing!',20,'middle',C.dark)}

${/* Option A */bx(30,130,410,310,'#eff6ff',C.blue,2,12)}
${tx(235,162,'Option A:  Pre-wind',22,'middle',C.blue,'bold')}
${tx(235,190,'Wind the string around',19,'middle',C.dark)}
${tx(235,215,'the skewer BEFORE you',19,'middle',C.dark)}
${tx(235,240,'start counting.',19,'middle',C.dark)}
${bx(80,265,310,100,'white',C.dark,2,8)}
${bx(155,295,180,18,C.cardboard,'#5c3d0a',3,9)}
${/* Pre-wound string */ci(200,304,22,'none',C.rope,5)}
${ci(200,304,30,'none',C.rope,3)}
${ci(245,304,22,'none',C.rope,4)}
${ci(245,304,30,'none',C.rope,3)}
${tx(235,350,'string pre-loaded',15,'middle','#475569')}

${/* Option B */bx(520,130,410,310,'#fff7ed',C.orange,2,12)}
${tx(725,162,'Option B:  Longer crank',22,'middle',C.orange,'bold')}
${tx(725,190,'Make the crank handle',19,'middle',C.dark)}
${tx(725,215,'LONGER — each turn',19,'middle',C.dark)}
${tx(725,240,'moves more string.',19,'middle',C.dark)}
${bx(540,265,370,100,'white',C.dark,2,8)}
${bx(610,295,200,18,C.cardboard,'#5c3d0a',3,9)}
${bx(808,277,50,54,'#fed7aa',C.dark,3,4)}
${tx(720,315,'Short crank',14,'middle','#94a3b8')}
${bx(580,265,430,100,'none','none',0)}
${bx(808,277,110,54,'#fde68a',C.dark,3,6)}
${tx(863,308,'Longer!',16,'middle',C.orange,'bold')}

${badge(W/2,497,'Make ONE change → retest → record new count. Did it improve?',C.dark,'white',19)}
`),

// 13 — Share out
wrap('🎤  Step 13 — Share out!', `
${tx(W/2,103,'Tell the class what you built and what you discovered!',21,'middle',C.dark)}

${bx(80,130,800,135,'white',C.dark,3,12)}
${tx(480,168,'"It took ___ cranks before and',22,'middle',C.dark,'bold')}
${tx(480,200,'___ cranks after my improvement."',22,'middle',C.dark,'bold')}
${tx(480,233,'(fill in your real numbers!)',17,'middle','#64748b')}

${bx(80,285,800,185,'#faf5ff','#7c3aed',2,12)}
${tx(480,318,'📚  Key vocabulary:',22,'middle',C.purple,'bold')}
${[
  ['WHEEL','the crank handle'],
  ['AXLE','the skewer'],
  ['CRANK','turns the axle'],
  ['LOAD','the bucket + cargo'],
  ['ROTATION','full turns'],
  ['MECH. ADV.','less force needed'],
].map(([word,def],i) => {
  const x=100+i%3*270, y=338+Math.floor(i/3)*64
  return `${bx(x,y,230,56,'#ede9fe','none',0,8)}${tx(x+115,y+22,word,18,'middle',C.purple,'bold')}${tx(x+115,y+44,def,14,'middle','#6b21a8')}`
}).join('')}

${tx(W/2,498,'⚡  Real wells, cranes, fishing reels + winches all use Wheel & Axle!',19,'middle','#475569','bold')}
`),
]

// ── Write files ───────────────────────────────────────────────────────────────
console.log('\n📁  Generating Cable Car images…')
cableCar.forEach((svg, i) => {
  const n = String(i+1).padStart(2,'0')
  save(`${PUBLIC}/cable-car/step-${n}.svg`, svg)
})

console.log('\n📁  Generating Well Pulley images…')
wellPulley.forEach((svg, i) => {
  const n = String(i+1).padStart(2,'0')
  save(`${PUBLIC}/well-pulley/step-${n}.svg`, svg)
})

console.log('\n✅  Done! 25 SVGs generated.')
console.log('   Cable Car:   public/images/build/cable-car/step-01.svg … step-12.svg')
console.log('   Well Pulley: public/images/build/well-pulley/step-01.svg … step-13.svg')
console.log('\nNext: update seed-build-w1.mjs image paths then run seed.')
