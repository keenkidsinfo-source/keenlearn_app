#!/usr/bin/env node
/**
 * Generates public/scratch-starters/g1-2-w1-starter.sb3
 *
 * Key: sounds are placed on Sprite1 (the cat), NOT the Stage.
 * In TurboWarp, the Sounds tab shows sounds for the SELECTED target.
 * Kids naturally select the cat sprite to code it — so they see the sounds.
 *
 * Run: node scripts/make-starter-sb3.mjs   (from project root)
 */
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import JSZip from 'jszip'

const SR = 22050
const TWO_PI = 2 * Math.PI

function makeWav(samples) {
  const n = samples.length
  const buf = Buffer.alloc(44 + n * 2)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8)
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34)
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40)
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-32767, Math.min(32767, samples[i]))), 44 + i * 2)
  }
  return buf
}

function decay(s, tau) { return s.map((x, i) => x * Math.exp(-i / (SR * tau))) }
function noise(dur, amp = 20000) { return Array.from({length: Math.round(SR*dur)}, () => (Math.random()*2-1)*amp) }
function sine(freq, dur, amp = 22000) {
  const n = Math.round(SR*dur)
  return Array.from({length:n}, (_,i) => {
    const fade = i > n*0.85 ? 1-(i-n*0.85)/(n*0.15) : 1
    return Math.sin(TWO_PI*freq*i/SR)*amp*fade
  })
}

const soundDefs = [
  { name:'Pop',   samples: decay(noise(0.06,28000), 0.02) },
  { name:'Meow',  samples: (() => {
    const n=Math.round(SR*0.35)
    return Array.from({length:n},(_,i)=>{
      const t=i/SR,v=1+0.02*Math.sin(TWO_PI*5*t),f=t<0.05?t/0.05:Math.exp(-(t-0.05)/0.25)
      return Math.sin(TWO_PI*600*v*t)*24000*f
    })
  })() },
  { name:'Boing', samples: (() => {
    const n=Math.round(SR*0.5)
    return Array.from({length:n},(_,i)=>{
      const t=i/SR,freq=400*Math.pow(0.25,t/0.5),fade=Math.exp(-t/0.4)
      return Math.sin(TWO_PI*freq*t)*26000*fade
    })
  })() },
  { name:'Drum',  samples: (() => {
    const d=decay(noise(0.3,24000),0.06),s=decay(sine(80,0.3,16000),0.08)
    const len=Math.max(d.length,s.length),r=new Array(len).fill(0)
    d.forEach((x,i)=>r[i]=(r[i]||0)+x); s.forEach((x,i)=>r[i]=(r[i]||0)+x)
    return r
  })() },
  { name:'Zap',   samples: (() => {
    const n=Math.round(SR*0.2)
    return Array.from({length:n},(_,i)=>{
      const t=i/SR,freq=800*Math.pow(0.25,t/0.2),fade=Math.exp(-t/0.15)
      return Math.sin(TWO_PI*freq*t)*26000*fade
    })
  })() },
  { name:'Cheer', samples: (() => {
    const n=Math.round(SR*0.6)
    return Array.from({length:n},(_,i)=>{
      const t=i/SR,fade=t<0.1?t/0.1:Math.exp(-(t-0.1)/0.4)
      return (Math.sin(TWO_PI*300*t)*0.3+Math.sin(TWO_PI*700*t)*0.2+(Math.random()*2-1)*0.5)*26000*fade
    })
  })() },
]

const zip = new JSZip()

// ── Build sound assets ───────────────────────────────────────────────────────
const soundEntries = soundDefs.map(({name, samples}) => {
  const wav = makeWav(samples)
  const md5 = createHash('md5').update(wav).digest('hex')
  zip.file(`${md5}.wav`, wav)
  return {
    assetId: md5, name, dataFormat: 'wav', format: '',
    rate: SR, sampleCount: samples.length, md5ext: `${md5}.wav`
  }
})

// ── Stage backdrop (blank white) ─────────────────────────────────────────────
const blankSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="360" fill="#ffffff"/></svg>'
const blankSvgBytes = Buffer.from(blankSvg, 'utf8')
const blankMd5 = createHash('md5').update(blankSvgBytes).digest('hex')
zip.file(`${blankMd5}.svg`, blankSvgBytes)

// ── Cat costume SVG (simple, no CDN needed) ──────────────────────────────────
const catSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="56" r="34" fill="#ffab19"/>
  <polygon points="24,32 14,6 38,26" fill="#ffab19"/>
  <polygon points="76,32 86,6 62,26" fill="#ffab19"/>
  <polygon points="27,30 19,11 37,25" fill="#ffccaa"/>
  <polygon points="73,30 81,11 63,25" fill="#ffccaa"/>
  <ellipse cx="37" cy="50" rx="7" ry="8" fill="#222"/>
  <ellipse cx="63" cy="50" rx="7" ry="8" fill="#222"/>
  <circle cx="40" cy="47" r="2.5" fill="white"/>
  <circle cx="66" cy="47" r="2.5" fill="white"/>
  <ellipse cx="50" cy="61" rx="4" ry="3" fill="#ff8080"/>
  <path d="M46,64 Q50,68 54,64" stroke="#555" stroke-width="1.5" fill="none"/>
  <line x1="10" y1="60" x2="36" y2="58" stroke="#aaa" stroke-width="1.2"/>
  <line x1="10" y1="65" x2="36" y2="64" stroke="#aaa" stroke-width="1.2"/>
  <line x1="64" y1="58" x2="90" y2="60" stroke="#aaa" stroke-width="1.2"/>
  <line x1="64" y1="64" x2="90" y2="65" stroke="#aaa" stroke-width="1.2"/>
</svg>`
const catSvgBytes = Buffer.from(catSvg, 'utf8')
const catMd5 = createHash('md5').update(catSvgBytes).digest('hex')
zip.file(`${catMd5}.svg`, catSvgBytes)

// ── project.json ─────────────────────────────────────────────────────────────
const project = {
  targets: [
    {
      isStage: true,
      name: 'Stage',
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [{
        assetId: blankMd5,
        name: 'backdrop1',
        bitmapResolution: 1,
        md5ext: `${blankMd5}.svg`,
        dataFormat: 'svg',
        rotationCenterX: 240,
        rotationCenterY: 180,
      }],
      sounds: [],   // no sounds on Stage — kids won't be looking here
      layerOrder: 0,
      volume: 100,
      tempo: 60,
      videoTransparency: 50,
      videoState: 'on',
      textToSpeechLanguage: null,
    },
    {
      isStage: false,
      name: 'Cat',
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [{
        assetId: catMd5,
        name: 'costume1',
        bitmapResolution: 1,
        md5ext: `${catMd5}.svg`,
        dataFormat: 'svg',
        rotationCenterX: 50,
        rotationCenterY: 50,
      }],
      sounds: soundEntries,   // ← sounds live on the Cat sprite
      layerOrder: 1,
      visible: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: 'all around',
    },
  ],
  monitors: [],
  extensions: [],
  meta: {
    semver: '3.0.0',
    vm: '2.3.4',
    agent: 'KeenKids Starter Generator',
  },
}

zip.file('project.json', JSON.stringify(project))

// ── Write output ──────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'public', 'scratch-starters', 'g1-2-w1-starter.sb3')

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  .then(buf => {
    writeFileSync(outPath, buf)
    console.log(`✓ Wrote ${outPath} (${(buf.length/1024).toFixed(1)} KB)`)
    console.log(`  Cat sprite has ${soundEntries.length} sounds:`, soundEntries.map(s=>s.name).join(', '))
  })
  .catch(err => { console.error(err); process.exit(1) })
