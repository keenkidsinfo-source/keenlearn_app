#!/usr/bin/env node
/**
 * Generates Week 3 starter .sb3 files with Pokémon-style sprites pre-loaded.
 * Sprites are hand-drawn SVGs — no external download needed.
 *
 * Outputs:
 *   public/scratch-starters/g1-2-w3-starter.sb3  (Pikachu + Poké Ball + Caterpie)
 *   public/scratch-starters/g3-4-w3-starter.sb3  (Pikachu + Poké Ball + Caterpie + Abra + Psyduck)
 *
 * Run: node scripts/make-w3-starter-sb3.mjs
 */
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import JSZip from 'jszip'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── SVG Sprites ───────────────────────────────────────────────────────────────

const sprites = {
  pikachu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <!-- ears -->
  <polygon points="28,42 18,4 42,30" fill="#f5d400"/>
  <polygon points="24,38 20,10 38,28" fill="#1a1a1a"/>
  <polygon points="92,42 102,4 78,30" fill="#f5d400"/>
  <polygon points="96,38 100,10 82,28" fill="#1a1a1a"/>
  <!-- body -->
  <ellipse cx="60" cy="70" rx="38" ry="34" fill="#f5d400"/>
  <!-- head -->
  <circle cx="60" cy="48" r="32" fill="#f5d400"/>
  <!-- eyes -->
  <ellipse cx="44" cy="44" rx="7" ry="8" fill="#1a1a1a"/>
  <ellipse cx="76" cy="44" rx="7" ry="8" fill="#1a1a1a"/>
  <circle cx="47" cy="41" r="2.5" fill="white"/>
  <circle cx="79" cy="41" r="2.5" fill="white"/>
  <!-- cheeks -->
  <circle cx="30" cy="56" r="9" fill="#e84040" opacity="0.85"/>
  <circle cx="90" cy="56" r="9" fill="#e84040" opacity="0.85"/>
  <!-- nose -->
  <ellipse cx="60" cy="54" rx="3" ry="2" fill="#a06020"/>
  <!-- mouth -->
  <path d="M52,60 Q60,68 68,60" stroke="#a06020" stroke-width="2" fill="none"/>
  <!-- tail -->
  <polyline points="98,85 112,72 118,58 106,50 112,38" stroke="#f5d400" stroke-width="8" fill="none" stroke-linejoin="round"/>
  <polygon points="106,50 118,58 112,38" fill="#f5d400"/>
  <!-- tail tip -->
  <polygon points="106,50 118,55 115,38" fill="#f5a800"/>
  <!-- feet -->
  <ellipse cx="44" cy="100" rx="14" ry="10" fill="#f5d400"/>
  <ellipse cx="76" cy="100" rx="14" ry="10" fill="#f5d400"/>
  <!-- toes -->
  <ellipse cx="35" cy="105" rx="5" ry="4" fill="#f5d400"/>
  <ellipse cx="44" cy="108" rx="5" ry="4" fill="#f5d400"/>
  <ellipse cx="53" cy="105" rx="5" ry="4" fill="#f5d400"/>
  <ellipse cx="67" cy="105" rx="5" ry="4" fill="#f5d400"/>
  <ellipse cx="76" cy="108" rx="5" ry="4" fill="#f5d400"/>
  <ellipse cx="85" cy="105" rx="5" ry="4" fill="#f5d400"/>
  <!-- arms -->
  <ellipse cx="26" cy="74" rx="10" ry="7" fill="#f5d400" transform="rotate(-30,26,74)"/>
  <ellipse cx="94" cy="74" rx="10" ry="7" fill="#f5d400" transform="rotate(30,94,74)"/>
  <!-- lightning bolt stripe -->
  <path d="M38,70 L48,70 L44,80 L54,80 L44,96 L44,84 L34,84 Z" fill="#c8a000" opacity="0.4"/>
  <path d="M66,70 L76,70 L72,80 L82,80 L72,96 L72,84 L62,84 Z" fill="#c8a000" opacity="0.4"/>
</svg>`,

  pokeball: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <circle cx="40" cy="40" r="38" fill="#e82020" stroke="#1a1a1a" stroke-width="3"/>
  <rect x="2" y="37" width="76" height="6" fill="#1a1a1a"/>
  <circle cx="40" cy="40" r="38" fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <path d="M2,40 A38,38 0 0,0 78,40 Z" fill="#f0f0f0"/>
  <circle cx="40" cy="40" r="12" fill="white" stroke="#1a1a1a" stroke-width="3"/>
  <circle cx="40" cy="40" r="6" fill="#f0f0f0" stroke="#1a1a1a" stroke-width="2"/>
</svg>`,

  caterpie: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 80" width="130" height="80">
  <!-- body segments -->
  <circle cx="110" cy="50" r="18" fill="#5cb85c"/>
  <circle cx="88" cy="52" r="16" fill="#5cb85c"/>
  <circle cx="68" cy="52" r="16" fill="#5cb85c"/>
  <circle cx="48" cy="50" r="16" fill="#5cb85c"/>
  <!-- head -->
  <circle cx="24" cy="44" r="20" fill="#5cb85c"/>
  <!-- antenna -->
  <line x1="20" y1="26" x2="10" y2="10" stroke="#e82020" stroke-width="3"/>
  <circle cx="10" cy="10" r="5" fill="#e82020"/>
  <!-- eyes -->
  <ellipse cx="16" cy="38" rx="6" ry="7" fill="#fff"/>
  <ellipse cx="32" cy="38" rx="6" ry="7" fill="#fff"/>
  <circle cx="16" cy="39" r="3.5" fill="#1a1a1a"/>
  <circle cx="32" cy="39" r="3.5" fill="#1a1a1a"/>
  <circle cx="17" cy="37" r="1.2" fill="white"/>
  <circle cx="33" cy="37" r="1.2" fill="white"/>
  <!-- mouth -->
  <path d="M18,50 Q24,56 30,50" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
  <!-- segment lines -->
  <path d="M72,38 Q74,52 72,66" stroke="#3a8a3a" stroke-width="2" fill="none"/>
  <path d="M92,38 Q94,52 92,66" stroke="#3a8a3a" stroke-width="2" fill="none"/>
  <!-- feet -->
  <ellipse cx="50" cy="68" rx="6" ry="5" fill="#e82020"/>
  <ellipse cx="70" cy="68" rx="6" ry="5" fill="#e82020"/>
  <ellipse cx="90" cy="68" rx="6" ry="5" fill="#e82020"/>
  <ellipse cx="110" cy="68" rx="6" ry="5" fill="#e82020"/>
  <!-- belly -->
  <ellipse cx="80" cy="56" rx="28" ry="8" fill="#7dcc7d" opacity="0.5"/>
</svg>`,

  abra: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 130" width="110" height="130">
  <!-- body -->
  <ellipse cx="55" cy="80" rx="30" ry="36" fill="#c8a050"/>
  <!-- head -->
  <ellipse cx="55" cy="44" rx="28" ry="26" fill="#c8a050"/>
  <!-- snout -->
  <ellipse cx="55" cy="54" rx="12" ry="8" fill="#b08030"/>
  <!-- eyes (closed/sleepy) -->
  <path d="M38,38 Q44,34 50,38" stroke="#1a1a1a" stroke-width="2.5" fill="none"/>
  <path d="M60,38 Q66,34 72,38" stroke="#1a1a1a" stroke-width="2.5" fill="none"/>
  <!-- ears -->
  <polygon points="30,28 18,4 42,18" fill="#c8a050"/>
  <polygon points="80,28 92,4 68,18" fill="#c8a050"/>
  <polygon points="32,26 22,8 40,18" fill="#b08030"/>
  <polygon points="78,26 88,8 70,18" fill="#b08030"/>
  <!-- star on forehead -->
  <polygon points="55,20 57,26 63,26 58,30 60,36 55,32 50,36 52,30 47,26 53,26" fill="#f0d040" opacity="0.8"/>
  <!-- tail -->
  <path d="M55,114 Q75,120 90,108 Q95,96 82,90" stroke="#c8a050" stroke-width="10" fill="none" stroke-linecap="round"/>
  <ellipse cx="80" cy="88" rx="10" ry="7" fill="#b08030"/>
  <!-- arms -->
  <path d="M26,72 Q12,80 14,96" stroke="#c8a050" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M84,72 Q98,80 96,96" stroke="#c8a050" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- hands -->
  <circle cx="14" cy="97" r="8" fill="#b08030"/>
  <circle cx="96" cy="97" r="8" fill="#b08030"/>
  <!-- belly -->
  <ellipse cx="55" cy="82" rx="18" ry="22" fill="#debb70" opacity="0.6"/>
  <!-- legs -->
  <ellipse cx="40" cy="114" rx="10" ry="8" fill="#c8a050"/>
  <ellipse cx="70" cy="114" rx="10" ry="8" fill="#c8a050"/>
</svg>`,

  psyduck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 120" width="110" height="120">
  <!-- body -->
  <ellipse cx="55" cy="80" rx="32" ry="30" fill="#f5d400"/>
  <!-- head -->
  <circle cx="55" cy="46" r="30" fill="#f5d400"/>
  <!-- bill -->
  <ellipse cx="55" cy="62" rx="14" ry="8" fill="#e07020"/>
  <!-- eyes (dizzy/confused) -->
  <circle cx="40" cy="42" r="9" fill="white"/>
  <circle cx="70" cy="42" r="9" fill="white"/>
  <circle cx="40" cy="43" r="5" fill="#1a1a1a"/>
  <circle cx="70" cy="43" r="5" fill="#1a1a1a"/>
  <circle cx="42" cy="41" r="2" fill="white"/>
  <circle cx="72" cy="41" r="2" fill="white"/>
  <!-- confusion spirals -->
  <circle cx="40" cy="43" r="8" fill="none" stroke="#8080ff" stroke-width="1.5" opacity="0.6"/>
  <circle cx="70" cy="43" r="8" fill="none" stroke="#8080ff" stroke-width="1.5" opacity="0.6"/>
  <!-- hands on head -->
  <path d="M28,28 Q24,18 30,14" stroke="#f5d400" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="31" cy="13" r="7" fill="#e0b000"/>
  <path d="M82,28 Q86,18 80,14" stroke="#f5d400" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="79" cy="13" r="7" fill="#e0b000"/>
  <!-- tail -->
  <path d="M55,108 Q72,116 80,108" stroke="#f5d400" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- feet -->
  <ellipse cx="40" cy="108" rx="14" ry="9" fill="#e07020"/>
  <ellipse cx="70" cy="108" rx="14" ry="9" fill="#e07020"/>
  <!-- wings -->
  <ellipse cx="24" cy="76" rx="12" ry="8" fill="#e0b000" transform="rotate(-20,24,76)"/>
  <ellipse cx="86" cy="76" rx="12" ry="8" fill="#e0b000" transform="rotate(20,86,76)"/>
</svg>`,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function svgAsset(zip, svgString) {
  const bytes = Buffer.from(svgString, 'utf8')
  const md5   = createHash('md5').update(bytes).digest('hex')
  zip.file(`${md5}.svg`, bytes)
  return md5
}

function blankStage(zip) {
  const svg   = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="360" fill="#e8f4f8"/></svg>'
  const bytes = Buffer.from(svg, 'utf8')
  const md5   = createHash('md5').update(bytes).digest('hex')
  zip.file(`${md5}.svg`, bytes)
  return md5
}

function makeCostume(md5, name, cx, cy) {
  return {
    assetId: md5, name,
    bitmapResolution: 1,
    md5ext: `${md5}.svg`,
    dataFormat: 'svg',
    rotationCenterX: cx,
    rotationCenterY: cy,
  }
}

function makeSprite(name, costume, x, y, size, layerOrder) {
  return {
    isStage: false,
    name,
    variables: {}, lists: {}, broadcasts: {}, blocks: {}, comments: {},
    currentCostume: 0,
    costumes: [costume],
    sounds: [],
    layerOrder,
    visible: true,
    x, y, size,
    direction: 90,
    draggable: false,
    rotationStyle: 'all around',
  }
}

// ── Build G1-2 W3 starter: Pikachu + Poké Ball + Caterpie ────────────────────

async function buildG12() {
  const zip     = new JSZip()
  const stageMd5 = blankStage(zip)

  const pikaMd5 = svgAsset(zip, sprites.pikachu)
  const ballMd5 = svgAsset(zip, sprites.pokeball)
  const catMd5  = svgAsset(zip, sprites.caterpie)

  const project = {
    targets: [
      {
        isStage: true, name: 'Stage',
        variables: {}, lists: {}, broadcasts: {}, blocks: {}, comments: {},
        currentCostume: 0,
        costumes: [makeCostume(stageMd5, 'backdrop1', 240, 180)],
        sounds: [],
        layerOrder: 0, volume: 100, tempo: 60,
        videoTransparency: 50, videoState: 'on', textToSpeechLanguage: null,
      },
      makeSprite('Pikachu',  makeCostume(pikaMd5, 'pikachu',  60, 60),   0, -100, 60, 1),
      makeSprite('PokeBall', makeCostume(ballMd5, 'pokeball', 40, 40),   0, -100, 40, 2),
      makeSprite('Caterpie', makeCostume(catMd5,  'caterpie', 65, 40),   0,  120, 55, 3),
    ],
    monitors: [], extensions: [],
    meta: { semver: '3.0.0', vm: '2.3.4', agent: 'KeenKids W3 Starter' },
  }

  zip.file('project.json', JSON.stringify(project))
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  const out = join(__dirname, '..', 'public', 'scratch-starters', 'g1-2-w3-starter.sb3')
  writeFileSync(out, buf)
  console.log(`✓ G1-2 W3: ${out} (${(buf.length/1024).toFixed(1)} KB) — Pikachu + Poké Ball + Caterpie`)
}

// ── Build G3-4 W3 starter: Pikachu + Poké Ball + Caterpie + Abra + Psyduck ──

async function buildG34() {
  const zip      = new JSZip()
  const stageMd5 = blankStage(zip)

  const pikaMd5   = svgAsset(zip, sprites.pikachu)
  const ballMd5   = svgAsset(zip, sprites.pokeball)
  const catMd5    = svgAsset(zip, sprites.caterpie)
  const abraMd5   = svgAsset(zip, sprites.abra)
  const psyMd5    = svgAsset(zip, sprites.psyduck)

  const project = {
    targets: [
      {
        isStage: true, name: 'Stage',
        variables: {}, lists: {}, broadcasts: {}, blocks: {}, comments: {},
        currentCostume: 0,
        costumes: [makeCostume(stageMd5, 'backdrop1', 240, 180)],
        sounds: [],
        layerOrder: 0, volume: 100, tempo: 60,
        videoTransparency: 50, videoState: 'on', textToSpeechLanguage: null,
      },
      makeSprite('Pikachu',  makeCostume(pikaMd5,  'pikachu',  60, 60),  0,  -120, 55, 1),
      makeSprite('PokeBall', makeCostume(ballMd5,  'pokeball', 40, 40),  0,  -120, 40, 2),
      makeSprite('Caterpie', makeCostume(catMd5,   'caterpie', 65, 40), -140, 130, 50, 3),
      makeSprite('Abra',     makeCostume(abraMd5,  'abra',     55, 65),   0,  130, 50, 4),
      makeSprite('Psyduck',  makeCostume(psyMd5,   'psyduck',  55, 60),  140, 130, 50, 5),
    ],
    monitors: [], extensions: [],
    meta: { semver: '3.0.0', vm: '2.3.4', agent: 'KeenKids W3 Starter' },
  }

  zip.file('project.json', JSON.stringify(project))
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  const out = join(__dirname, '..', 'public', 'scratch-starters', 'g3-4-w3-starter.sb3')
  writeFileSync(out, buf)
  console.log(`✓ G3-4 W3: ${out} (${(buf.length/1024).toFixed(1)} KB) — Pikachu + Poké Ball + Caterpie + Abra + Psyduck`)
}

// ── Run ───────────────────────────────────────────────────────────────────────

await buildG12()
await buildG34()
console.log('\n✅ Done! Both W3 starter files written.')
console.log('   Kids open coding → all Pokémon sprites are pre-loaded and ready.')
