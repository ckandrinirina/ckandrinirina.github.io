import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import workflowSource from '../../.github/workflows/deploy.yml?raw'

interface Step {
  id?: string
  uses?: string
  run?: string
  with?: Record<string, unknown>
}

interface Job {
  'runs-on': string
  needs?: string
  environment?: { name: string; url: string }
  steps: Step[]
}

interface Workflow {
  on: {
    push: { branches: string[] }
    workflow_dispatch: unknown
  }
  permissions: Record<string, string>
  concurrency: { group: string; 'cancel-in-progress': boolean }
  jobs: { build: Job; deploy: Job }
}

const workflow = parse(workflowSource) as Workflow
const { build, deploy } = workflow.jobs

const stepUsing = (job: Job, action: string) =>
  job.steps.find((step) => step.uses === action)

describe('deploy workflow — triggers and guards', () => {
  it('deploys on push to main and on manual dispatch', () => {
    expect(workflow.on.push.branches).toEqual(['main'])
    expect(workflow.on).toHaveProperty('workflow_dispatch')
  })

  it('grants only the permissions Pages deployment needs', () => {
    expect(workflow.permissions).toEqual({
      contents: 'read',
      pages: 'write',
      'id-token': 'write',
    })
  })

  it('cancels an in-flight deploy when a newer push arrives', () => {
    expect(workflow.concurrency).toEqual({
      group: 'pages',
      'cancel-in-progress': true,
    })
  })
})

describe('deploy workflow — build job', () => {
  it('runs on ubuntu-latest', () => {
    expect(build['runs-on']).toBe('ubuntu-latest')
  })

  it('checks out the repository and sets up cached Node 20', () => {
    expect(stepUsing(build, 'actions/checkout@v4')).toBeDefined()
    const node = stepUsing(build, 'actions/setup-node@v4')
    expect(node?.with).toMatchObject({ 'node-version': 20, cache: 'npm' })
  })

  it('installs reproducibly then builds, before packaging the artifact', () => {
    const order = build.steps.map((step) => step.run ?? step.uses)
    const ci = order.indexOf('npm ci')
    const buildIndex = order.indexOf('npm run build')
    const configure = order.indexOf('actions/configure-pages@v5')
    const upload = order.indexOf('actions/upload-pages-artifact@v3')

    expect(order).not.toContain('npm install')
    expect(ci).toBeGreaterThan(-1)
    expect(buildIndex).toBeGreaterThan(ci)
    expect(configure).toBeGreaterThan(-1)
    expect(upload).toBeGreaterThan(configure)
    expect(build.steps[upload].with).toMatchObject({ path: './dist' })
  })
})

describe('deploy workflow — deploy job', () => {
  it('waits for the build job', () => {
    expect(deploy.needs).toBe('build')
    expect(deploy['runs-on']).toBe('ubuntu-latest')
  })

  it('publishes to the github-pages environment with the page URL', () => {
    expect(deploy.environment).toEqual({
      name: 'github-pages',
      url: '${{ steps.deployment.outputs.page_url }}',
    })
    const step = stepUsing(deploy, 'actions/deploy-pages@v4')
    expect(step?.id).toBe('deployment')
  })
})
