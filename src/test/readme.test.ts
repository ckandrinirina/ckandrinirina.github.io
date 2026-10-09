import { describe, expect, it } from 'vitest'
import readme from '../../README.md?raw'
import { scripts } from '../../package.json'

const LIVE_URL = 'https://ckandrinirina.github.io/'

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

describe('README — project introduction', () => {
  it('identifies the site as Erick Andrinirina’s portfolio and links the live URL', () => {
    expect(readme).toMatch(/^# .+/m)
    expect(readme).toMatch(/Erick Andrinirina/)
    expect(readme).toMatch(/personal portfolio/i)
    expect(readme).toContain(`](${LIVE_URL})`)
  })

  it('states the Node.js 20 LTS prerequisite', () => {
    expect(readme).toMatch(/Node\.js 20 LTS or newer/)
  })
})

describe('README — npm scripts', () => {
  it.each(Object.entries(scripts).filter(([name]) => name !== 'prebuild'))(
    'documents `npm run %s` with its exact command',
    (name, command) => {
      const row = new RegExp(
        `\`npm run ${name}\`.*\`${escapeRegExp(command)}\``,
      )
      expect(readme).toMatch(row)
    },
  )
})
