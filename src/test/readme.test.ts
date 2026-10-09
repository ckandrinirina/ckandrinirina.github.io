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

const section = (heading: RegExp) => {
  const match = heading.exec(readme)
  if (!match) return ''
  const body = readme.slice(match.index + match[0].length)
  const next = body.search(/^## /m)
  return next === -1 ? body : body.slice(0, next)
}

describe('README — deployment runbook', () => {
  const deploy = section(/^## Deploy.*$/m)

  it('lists the one-time GitHub Pages setup steps in order', () => {
    const steps = deploy.match(/^\d+\. .+$/gm) ?? []
    expect(steps[0]).toMatch(/ckandrinirina\.github\.io/)
    expect(steps[1]).toMatch(/`main`/)
    expect(steps[2]).toMatch(/Settings → Pages → Build and deployment → Source/)
    expect(steps[2]).toMatch(/GitHub Actions/)
    expect(steps[3]).toMatch(/`vite\.config\.ts`.*`base`.*`'\/'`/)
  })

  it('explains that the setup is one-time and only the workflow trigger deploys', () => {
    expect(deploy).toMatch(/one-time/i)
    expect(deploy).toMatch(/workflow_dispatch/)
  })

  it('describes the every-deploy flow through the workflow file', () => {
    expect(deploy).toContain('git push origin main')
    expect(deploy).toContain('.github/workflows/deploy.yml')
  })

  it('explains the user-page vs project-page base-path choice', () => {
    expect(deploy).toMatch(/`base: '\/'`/)
    expect(deploy).toMatch(/`base: '\/ck-portfolio\/'`/)
    expect(deploy).toContain('ckandrinirina.github.io/ck-portfolio')
    expect(deploy).toContain('import.meta.env.BASE_URL')
  })
})

describe('README — privacy', () => {
  it('never exposes a street address, postal code or phone number', () => {
    expect(readme).not.toMatch(/\b(lot|rue|avenue|street|bp)\b\s+\S/i)
    expect(readme).not.toMatch(/\b\d{3}\s+Antananarivo\b/i)
    expect(readme).not.toMatch(/\+?\d[\d .-]{8,}\d/)
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
