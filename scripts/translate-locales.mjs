import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MESSAGES_DIR = resolve(ROOT, 'src', 'messages')

const envFile = readFileSync('.env.local', 'utf8')
const match = envFile.match(/^DEEPL_API_KEY=(.+)$/m)
const DEEPL_API_KEY = match?.[1]?.trim()
if (!DEEPL_API_KEY) {
  console.error('❌ DEEPL_API_KEY not set in .env.local')
  process.exit(1)
}

const SOURCE_LOCALE = 'en_gb'

// DeepL target codes: https://developers.deepl.com/docs/api-reference/translate
const TARGETS = [
  { file: 'fr_fr.json',  lang: 'FR' },
  { file: 'fr_ca.json',  lang: 'FR-CA' },
  { file: 'de_de.json',  lang: 'DE' },
  { file: 'es_es.json',  lang: 'ES' },
  { file: 'it_it.json',  lang: 'IT' },
  { file: 'nl_nl.json',  lang: 'NL' },
  { file: 'ja_jp.json',  lang: 'JA' },
  { file: 'ko_kr.json',  lang: 'KO' },
  { file: 'pt_br.json',  lang: 'PT-BR' },
  { file: 'es_mx.json',  lang: 'ES' },
  { file: 'zh_hk.json',  lang: 'ZH' },
  // DeepL doesn't support Arabic or Hebrew — skip for now
  // { file: 'ar_ae.json',  lang: 'AR' },
  // { file: 'he_il.json',  lang: 'HE' },
  // English variants — copy of en_gb, no translation needed
  // { file: 'en_au.json',  lang: 'EN-GB' },
  // { file: 'en_nz.json',  lang: 'EN-GB' },
  // { file: 'en_sg.json',  lang: 'EN-GB' },
  // { file: 'en_za.json',  lang: 'EN-GB' },
  // { file: 'en_in.json',  lang: 'EN-GB' },
  // { file: 'en_row.json', lang: 'EN-GB' },
]

function loadJSON(file) {
  return JSON.parse(readFileSync(resolve(MESSAGES_DIR, file), 'utf8'))
}

function collectStrings(obj, prefix = '') {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'object' && v !== null) {
      Object.assign(result, collectStrings(v, key))
    } else if (typeof v === 'string') {
      result[key] = v
    }
  }
  return result
}

function setNested(obj, path, value) {
  const parts = path.split('.')
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {}
    }
    current = current[parts[i]]
  }
  current[parts[parts.length - 1]] = value
}

function protectPlaceholders(texts) {
  // Find all unique {variable} patterns across all texts
  const pattern = /\{(\w+)\}/g
  const vars = new Set()
  for (const t of texts) {
    let m
    while ((m = pattern.exec(t)) !== null) vars.add(m[1])
  }
  const varList = [...vars]
  const replacements = {}
  const reverse = {}
  varList.forEach((v, i) => {
    const ph = `__VAR_${i}__`
    replacements[`{${v}}`] = ph
    reverse[ph] = `{${v}}`
  })
  const protectedTexts = texts.map(t => {
    let result = t
    for (const [orig, ph] of Object.entries(replacements)) {
      result = result.replaceAll(orig, ph)
    }
    return result
  })
  return { protected: protectedTexts, reverse }
}

function restorePlaceholders(texts, reverse) {
  return texts.map(t => {
    let result = t
    for (const [ph, orig] of Object.entries(reverse)) {
      result = result.replaceAll(ph, orig)
    }
    return result
  })
}

async function translateWithDeepL(texts, targetLang) {
  const { protected: protectedTexts, reverse } = protectPlaceholders(texts)

  const params = new URLSearchParams()
  for (const t of protectedTexts) {
    params.append('text', t)
  }
  params.append('target_lang', targetLang)

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`DeepL error (${response.status}): ${err}`)
  }

  const data = await response.json()
  const translated = data.translations.map(t => t.text)
  return restorePlaceholders(translated, reverse)
}

async function main() {
  const source = loadJSON(`${SOURCE_LOCALE}.json`)
  const sourceStrings = collectStrings(source)
  const totalKeys = Object.keys(sourceStrings).length

  console.log(`Source: ${SOURCE_LOCALE}.json — ${totalKeys} keys`)

  for (const target of TARGETS) {
    console.log(`\n--- ${target.file} (${target.lang}) ---`)
    const targetData = loadJSON(target.file)
    const targetStrings = collectStrings(targetData)

    const staleKeys = Object.keys(sourceStrings).filter(k => targetStrings[k] === sourceStrings[k])
    const staleCount = staleKeys.length

    if (staleCount === 0) {
      console.log(`  ✓ All keys already translated`)
      continue
    }

    console.log(`  → ${staleCount}/${totalKeys} keys need translation`)

    try {
      const staleTexts = staleKeys.map(k => sourceStrings[k])
      const translated = await translateWithDeepL(staleTexts, target.lang)

      for (let i = 0; i < staleKeys.length; i++) {
        setNested(targetData, staleKeys[i], translated[i])
      }

      writeFileSync(resolve(MESSAGES_DIR, target.file), JSON.stringify(targetData, null, 2) + '\n')
      console.log(`  ✓ Updated ${target.file}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`)
    }
  }

  console.log('\n✅ Done!')
  console.log('\n⚠️ Skipped (DeepL unsupported): ar_ae.json (Arabic), he_il.json (Hebrew)')
  console.log('   English variants (en_au, en_nz, en_sg, en_za, en_in, en_row) — already English, no translation needed.')
}

main()
