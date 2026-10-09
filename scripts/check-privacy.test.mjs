// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const scriptPath = resolve(__dirname, 'check-privacy.mjs')

// Placeholder values only: the real address never appears in the repository.
const FAKE_FRAGMENT = 'Zzquartier-Fixture'
const PUBLIC_CONTACTS = 'ckandrinirina@gmail.com wa.me/261385096664'

let workDir
let distDir

function writeDist(relPath, content) {
  const target = join(distDir, relPath)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

function runGuard({ args = [], env = {} } = {}) {
  const result = spawnSync('node', [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PRIVACY_FRAGMENTS: '',
      PRIVACY_FRAGMENTS_FILE: join(workDir, 'absent.local'),
      ...env,
    },
  })
  return { ...result, output: `${result.stdout}${result.stderr}` }
}

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), 'check-privacy-'))
  distDir = join(workDir, 'dist')
  mkdirSync(distDir)
  writeDist('index.html', `<p>Antananarivo, Madagascar ${PUBLIC_CONTACTS}</p>`)
})

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('scripts/check-privacy.mjs', () => {
  it('exits 0 on a clean dist that keeps the public contact details', () => {
    const result = runGuard({
      args: [distDir],
      env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT },
    })

    expect(result.status).toBe(0)
    expect(result.output).toMatch(/privacy check passed/i)
  })

  it('defaults to ./dist when no path argument is given', () => {
    const result = runGuard({ env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT } })

    expect(result.output).toContain(resolve(repoRoot, 'dist'))
  })

  describe('with fragments from the environment', () => {
    it('exits 1 and names the file and line of a match, in a JS chunk', () => {
      writeDist('assets/index-abc.js', `var a=1\nvar addr="${FAKE_FRAGMENT} 7"`)

      const result = runGuard({
        args: [distDir],
        env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT },
      })

      expect(result.status).toBe(1)
      expect(result.output).toContain(join('assets', 'index-abc.js'))
      expect(result.output).toMatch(/:2\b/)
    })

    it.each(['index.css', 'assets/data.json', 'icons.svg', 'app.js.map'])(
      'scans %s',
      (file) => {
        writeDist(file, `x ${FAKE_FRAGMENT} y`)

        const result = runGuard({
          args: [distDir],
          env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT },
        })

        expect(result.status).toBe(1)
      },
    )

    it('matches case-insensitively', () => {
      writeDist('index.css', FAKE_FRAGMENT.toUpperCase())

      const result = runGuard({
        args: [distDir],
        env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT },
      })

      expect(result.status).toBe(1)
    })

    it('never prints the fragment value itself', () => {
      writeDist('index.css', FAKE_FRAGMENT)

      const result = runGuard({
        args: [distDir],
        env: { PRIVACY_FRAGMENTS: FAKE_FRAGMENT },
      })

      expect(result.output).not.toContain(FAKE_FRAGMENT)
    })

    it('accepts several fragments separated by semicolons', () => {
      writeDist('index.css', 'second-secret')

      const result = runGuard({
        args: [distDir],
        env: { PRIVACY_FRAGMENTS: `${FAKE_FRAGMENT};second-secret` },
      })

      expect(result.status).toBe(1)
    })
  })

  describe('with fragments from the local file', () => {
    it('reads one fragment per line, ignoring blanks and # comments', () => {
      const file = join(workDir, 'fragments.local')
      writeFileSync(file, `# private\n\n${FAKE_FRAGMENT}\n`)
      writeDist('index.css', FAKE_FRAGMENT)

      const result = runGuard({
        args: [distDir],
        env: { PRIVACY_FRAGMENTS_FILE: file },
      })

      expect(result.status).toBe(1)
    })
  })

  describe('built-in generic patterns (no private fragments needed)', () => {
    it.each([
      ['a lot number', 'LOT XX 12 B'],
      ['a postal code with the city', '101 Antananarivo'],
    ])('flags %s', (_label, text) => {
      writeDist('index.html', `${PUBLIC_CONTACTS} ${text}`)

      const result = runGuard({ args: [distDir] })

      expect(result.status).toBe(1)
    })

    it('lets the city and country location through', () => {
      const result = runGuard({ args: [distDir] })

      expect(result.status).toBe(0)
    })

    it('warns when no private fragments are configured', () => {
      const result = runGuard({ args: [distDir] })

      expect(result.stderr).toMatch(/no private fragments/i)
    })
  })

  describe('public contact details', () => {
    it('exits 1 when the email is missing from dist', () => {
      writeDist('index.html', 'Antananarivo, Madagascar wa.me/261385096664')

      const result = runGuard({ args: [distDir] })

      expect(result.status).toBe(1)
      expect(result.output).toMatch(/email/i)
    })

    it('exits 1 when the WhatsApp number is missing from dist', () => {
      writeDist(
        'index.html',
        'Antananarivo, Madagascar ckandrinirina@gmail.com',
      )

      const result = runGuard({ args: [distDir] })

      expect(result.status).toBe(1)
      expect(result.output).toMatch(/whatsapp/i)
    })
  })

  it('exits 2 when the target directory does not exist', () => {
    const result = runGuard({ args: [join(workDir, 'missing')] })

    expect(result.status).toBe(2)
  })
})
