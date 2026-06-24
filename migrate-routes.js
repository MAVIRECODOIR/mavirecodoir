/**
 * migrate-routes.js
 * 
 * Moves all content pages into [countryCode] so every URL is prefixed
 * with a region code, matching the Gucci/Dior URL pattern.
 * 
 * Run from inside mavire-website/:
 *   node migrate-routes.js
 * 
 * Safe to run multiple times — skips anything already migrated.
 */

const fs = require('fs')
const path = require('path')

const APP_DIR   = path.join(__dirname, 'src', 'app')
const DEST_DIR  = path.join(APP_DIR, '[countryCode]')

// These stay at the root level — do NOT move them
const SKIP = new Set([
  '[countryCode]', // destination folder
  'api',           // API routes don't need a region
  'admin',         // admin panel doesn't need a region
  'layout.tsx',    // root layout stays
  'not-found.tsx', // 404 page stays
  'globals.css',
  'favicon.ico',
  'page.tsx',      // root page.tsx (shouldn't exist, middleware handles /)
])

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyRecursive(s, d) : fs.copyFileSync(s, d)
  }
}

const entries = fs.readdirSync(APP_DIR, { withFileTypes: true })
const toMove  = entries.filter(e => !SKIP.has(e.name))

console.log('\n📦 Routes to migrate into [countryCode]:\n')
toMove.forEach(e => console.log(`   /${e.name}`))
console.log('\n⏳ Starting...\n')

let moved = 0, skipped = 0, failed = 0

for (const entry of toMove) {
  const src  = path.join(APP_DIR, entry.name)
  const dest = path.join(DEST_DIR, entry.name)

  if (fs.existsSync(dest)) {
    console.log(`⏭️  Already exists — skipping  /${entry.name}`)
    skipped++
    continue
  }

  try {
    if (entry.isDirectory()) {
      copyRecursive(src, dest)
      fs.rmSync(src, { recursive: true, force: true })
    } else {
      fs.copyFileSync(src, dest)
      fs.unlinkSync(src)
    }
    console.log(`✅ Moved  /${entry.name}  →  /[countryCode]/${entry.name}`)
    moved++
  } catch (err) {
    console.error(`❌ Failed /${entry.name}: ${err.message}`)
    failed++
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Moved:   ${moved}
⏭️  Skipped: ${skipped}
❌ Failed:  ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
  1. Restart your dev server
  2. Visit http://localhost:3000 — should redirect to /gb/
  3. Visit http://localhost:3000/contact — should redirect to /gb/contact
  4. Check your [countryCode]/layout.tsx still wraps everything
`)
