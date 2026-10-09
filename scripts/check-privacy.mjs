#!/usr/bin/env node
// Privacy guard: fails when the home street address leaks into the built site,
// and when the intentionally public contact details are missing from it.
//
// Usage: node scripts/check-privacy.mjs [dir]   (default ./dist)
// Exit codes: 0 ok, 1 privacy violation, 2 the scan could not run.
//
// The repository is public, so the real address fragments are NOT stored here.
// They come from, in addition to the generic patterns below:
//   - PRIVACY_FRAGMENTS: fragments separated by ";" (a CI secret), and
//   - scripts/privacy-fragments.local: one per line, "#" comments (gitignored
//     by the *.local rule; override the path with PRIVACY_FRAGMENTS_FILE).
//
// Not covered: text inside the PDF at dist/cv/ is compressed, so a grep cannot
// see it. Confirm by hand, once per CV update, that the PDF's visible text and
// metadata carry only "Antananarivo, Madagascar".
// Last checked 2026-10-09 on public/cv/erick-andrinirina-cv.pdf (2 pages): only
// "Antananarivo, Madagascar" and the school name appear; metadata is the title.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))

// Shapes of an address line that carry no private information themselves.
const GENERIC_PATTERNS = [
  { label: 'lot number', regex: /\blot\s+[ivxl\d]+\b/i },
  { label: 'postal code with city', regex: /\b\d{3}\s+antananarivo\b/i },
]

// Intentionally public: their absence means a build step stripped them.
const PUBLIC_CONTACTS = [
  { label: 'email', needle: 'ckandrinirina@gmail.com' },
  { label: 'WhatsApp number', needle: '261385096664' },
]

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function loadPrivateFragments() {
  const fromEnv = (process.env.PRIVACY_FRAGMENTS ?? '').split(';')
  const filePath =
    process.env.PRIVACY_FRAGMENTS_FILE ??
    join(scriptDir, 'privacy-fragments.local')
  const fromFile = existsSync(filePath)
    ? readFileSync(filePath, 'utf8').split('\n')
    : []

  return [...fromEnv, ...fromFile]
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(join(dir, entry.name))
      : [join(dir, entry.name)],
  )
}

const target = resolve(process.argv[2] ?? './dist')

if (!existsSync(target)) {
  console.error(`check-privacy: ERROR: ${target} does not exist; build first.`)
  process.exit(2)
}

const privateFragments = loadPrivateFragments()
if (privateFragments.length === 0) {
  console.error(
    'check-privacy: WARN: no private fragments configured (PRIVACY_FRAGMENTS or ' +
      'scripts/privacy-fragments.local); only the generic patterns are checked.',
  )
}

// Private fragments are reported by index, never by value, so a CI log
// cannot reveal what the guard is looking for.
const rules = [
  ...GENERIC_PATTERNS,
  ...privateFragments.map((fragment, index) => ({
    label: `private fragment #${index + 1}`,
    regex: new RegExp(escapeRegex(fragment), 'i'),
  })),
]

const files = listFiles(target)
const violations = []
let allContent = ''

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  allContent += `${content}\n`
  content.split('\n').forEach((line, index) => {
    for (const { label, regex } of rules) {
      if (regex.test(line)) {
        violations.push(`${relative(target, file)}:${index + 1}  (${label})`)
      }
    }
  })
}

const missingContacts = PUBLIC_CONTACTS.filter(
  ({ needle }) => !allContent.includes(needle),
)

if (violations.length > 0) {
  console.error(`PRIVACY VIOLATION: address detail found in ${target}`)
  for (const violation of violations) console.error(`  ${violation}`)
}
for (const { label } of missingContacts) {
  console.error(`PRIVACY CHECK: public ${label} missing from ${target}`)
}
if (violations.length > 0 || missingContacts.length > 0) process.exit(1)

console.log(
  `Privacy check passed (${files.length} files scanned in ${target}).`,
)
