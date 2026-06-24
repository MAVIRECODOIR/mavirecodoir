const fs = require('fs')
const path = require('path')

const APP_DIR = path.join(__dirname, 'src', 'app')
const COUNTRY_DIR = path.join(APP_DIR, '[countryCode]')
const LOCALE_DIR = path.join(COUNTRY_DIR, '[locale]')

// Files/dirs that stay at [countryCode] level
const KEEP_AT_COUNTRY = new Set(['[locale]', 'layout.tsx'])

// Root-level pages to copy into [locale] (admin and api stay at root)
const ROOT_PAGES = [
  'about', 'accessibility', 'appointment', 'archive',
  'careers', 'client', 'client-services', 'collect-in-store',
  'contact', 'cookies', 'craftsmanship', 'email-preview',
  'faq', 'journal', 'new-arrivals', 'order-and-return-tracking',
  'privacy', 'shipping', 'sustainability', 'terms',
  'test-upload', 'unsubscribe',
]

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (fs.existsSync(d)) continue
    entry.isDirectory() ? copyRecursive(s, d) : fs.copyFileSync(s, d)
  }
  return true
}

function moveRecursive(src, dest) {
  copyRecursive(src, dest)
  fs.rmSync(src, { recursive: true, force: true })
}

console.log('\n=== Moving [countryCode] content into [locale] ===\n')
fs.mkdirSync(LOCALE_DIR, { recursive: true })

const countryEntries = fs.readdirSync(COUNTRY_DIR, { withFileTypes: true })
const toMove = countryEntries.filter(e => !KEEP_AT_COUNTRY.has(e.name))

for (const entry of toMove) {
  const src = path.join(COUNTRY_DIR, entry.name)
  const dest = path.join(LOCALE_DIR, entry.name)
  if (fs.existsSync(dest)) { console.log(`  ⏭  skip ${entry.name} (already exists)`); continue }
  entry.isDirectory() ? moveRecursive(src, dest) : fs.copyFileSync(src, dest)
  console.log(`  ✅ moved: ${entry.name} → [locale]/`)
}

console.log('\n=== Copying root-level pages into [locale] ===\n')
for (const page of ROOT_PAGES) {
  const src = path.join(APP_DIR, page)
  if (!fs.existsSync(src)) { console.log(`  ⏭  skip ${page} (not found at root)`); continue }
  const dest = path.join(LOCALE_DIR, page)
  if (fs.existsSync(dest)) { console.log(`  ⏭  skip ${page} (already in [locale])`); continue }
  copyRecursive(src, dest)
  console.log(`  ✅ copied: ${page} → [locale]/${page}`)
}

console.log('\n=== Done! ===')
console.log('\nNow you need to:')
console.log('  1. Replace src/middleware.ts')
console.log('  2. Replace src/app/[countryCode]/layout.tsx (minimal)')
console.log('  3. Create src/app/[countryCode]/[locale]/layout.tsx (full providers)')
console.log('  4. Update all providers and components')
