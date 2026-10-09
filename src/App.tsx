/**
 * App — the Atelier Terminal shell orchestrator (04-01).
 *
 * Owns all cross-cutting state (route, navigation direction, project modal,
 * command-palette flag, nav lock) and wires every interaction hook against the
 * active view. Renders the Sidebar + Topbar chrome, the re-keyed view container
 * (which replays the entrance animation per direction), and the global overlays
 * (CommandPalette, ProjectModal, Cursor).
 *
 * Leaf components stay prop-driven: App passes `route`, `navigate`, `onOpenCmdK`,
 * `onOpen`, etc. and maps abstract command descriptors to real handlers here, so
 * the data files (commands.ts) and views never reach into App state.
 *
 * SOLID:
 *   - S: App orchestrates only; rendering/motion live in leaves + CSS.
 *   - O: a new route = a ROUTE_ORDER/ROUTE_META entry + a render branch.
 *   - D: depends on hook/command abstractions, not concrete children's internals.
 */

import { useCallback, useRef, useState } from 'react'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import ScrollHint from './components/ui/ScrollHint'
import CommandPalette from './components/cmdk/CommandPalette'
import type { CommandDescriptor } from './components/cmdk/commands'
import Cursor from './components/cursor/Cursor'
import ProjectModal from './components/projects/ProjectModal'

import HomeView from './views/HomeView'
import WorkView from './views/WorkView'
import ExperienceView from './views/ExperienceView'
import SkillsView from './views/SkillsView'
import ProcessView from './views/ProcessView'
import ContactView from './views/ContactView'

import { useHashRoute } from './hooks/useHashRoute'
import { useScrollToNavigate } from './hooks/useScrollToNavigate'
import { useKeyboardArrows } from './hooks/useKeyboardArrows'
import { useCmdK } from './hooks/useCmdK'
import { useScrollReveal } from './hooks/useScrollReveal'

import { useLanguage } from './i18n/useLanguage'
import type { UiLabels } from './i18n/ui'
import { useTheme } from './theme/useTheme'
import { localizeProjects } from './content/projects'
import type { Project } from './content/types'
import {
  ROUTE_ORDER,
  ROUTE_META,
  SITE_META,
  type RouteId,
} from './lib/constants'
import { cn } from './lib/utils'

/** Milliseconds the shell ignores re-entrant navigation after a nav fires. */
const LOCK_MS = 850

/** Narrow an arbitrary string to a known RouteId. */
function isRouteId(value: string): value is RouteId {
  return (ROUTE_ORDER as readonly string[]).includes(value)
}

function App() {
  const { t, locale, setLocale } = useLanguage()
  const { cycle } = useTheme()

  // ── Cross-cutting state ────────────────────────────────────────────────────
  const [route, setRoute] = useState<RouteId>('home')
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [locked, setLocked] = useState(false)

  // Refs read inside event handlers (never during render).
  const viewRef = useRef<HTMLElement | null>(null)
  const routeRef = useRef<RouteId>('home')
  const lockTimerRef = useRef<number | undefined>(undefined)
  const projectTriggerRef = useRef<HTMLElement | null>(null)

  // ── Navigation ─────────────────────────────────────────────────────────────
  // Accepts a concrete route id (sidebar / cmdk) or a direction (gestures / keys).
  // Param typed `string` so it satisfies every consumer contract; narrowed here.
  const navigate = useCallback((target: string) => {
    const prev = routeRef.current
    const prevIdx = ROUTE_ORDER.indexOf(prev)

    let next: RouteId
    let dir: 'up' | 'down'

    if (target === 'up' || target === 'down') {
      const nextIdx = target === 'down' ? prevIdx + 1 : prevIdx - 1
      if (nextIdx < 0 || nextIdx >= ROUTE_ORDER.length) return // clamp at ends
      next = ROUTE_ORDER[nextIdx]
      dir = target
    } else if (isRouteId(target)) {
      if (target === prev) return
      next = target
      dir = ROUTE_ORDER.indexOf(target) >= prevIdx ? 'down' : 'up'
    } else {
      return // unknown target — ignore
    }

    setDirection(dir)
    setRoute(next)
    routeRef.current = next
    window.history.replaceState(null, '', '#' + next)
    if (viewRef.current) viewRef.current.scrollTop = 0

    setLocked(true)
    window.clearTimeout(lockTimerRef.current)
    lockTimerRef.current = window.setTimeout(() => setLocked(false), LOCK_MS)
  }, [])

  // Hash → route (back/forward button, manual edit). Unknown/empty → home.
  // `replaceState` in navigate does not emit hashchange, so there is no loop.
  const applyHash = useCallback((raw: string) => {
    const next: RouteId = isRouteId(raw) ? raw : 'home'
    const prev = routeRef.current
    if (next === prev) return
    setDirection(
      ROUTE_ORDER.indexOf(next) >= ROUTE_ORDER.indexOf(prev) ? 'down' : 'up',
    )
    setRoute(next)
    routeRef.current = next
  }, [])
  useHashRoute(applyHash)

  // ── Overlay handlers ────────────────────────────────────────────────────────
  const toggleCmd = useCallback(() => setCmdOpen((o) => !o), [])
  const openCmd = useCallback(() => setCmdOpen(true), [])
  const closeCmd = useCallback(() => setCmdOpen(false), [])
  useCmdK(toggleCmd)

  const openProject = useCallback((project: Project) => {
    // Remember the focused trigger so the modal can restore focus on close.
    projectTriggerRef.current =
      (document.activeElement as HTMLElement | null) ?? null
    setActiveProject(project)
  }, [])
  const closeProject = useCallback(() => setActiveProject(null), [])

  const downloadCv = useCallback(() => {
    const href = import.meta.env.BASE_URL + 'cv/erick-andrinirina-cv.pdf'
    const a = document.createElement('a')
    a.href = href
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  // Map an abstract command descriptor to a real handler.
  const runCommand = useCallback(
    (cmd: CommandDescriptor) => {
      switch (cmd.kind) {
        case 'nav':
          navigate(cmd.route)
          break
        case 'quick':
          if (cmd.actionId === 'cycleTheme') cycle()
          else if (cmd.actionId === 'toggleLanguage')
            setLocale(locale === 'fr' ? 'en' : 'fr')
          else if (cmd.actionId === 'copyEmail')
            void navigator.clipboard?.writeText(SITE_META.email)
          else if (cmd.actionId === 'whatsapp')
            window.open(SITE_META.whatsapp, '_blank', 'noopener')
          else downloadCv()
          break
        case 'project': {
          const project = localizeProjects(locale).find(
            (p) => p.id === cmd.projectId,
          )
          if (project) openProject(project)
          break
        }
      }
    },
    [navigate, cycle, setLocale, locale, downloadCv, openProject],
  )

  // ── Interaction hooks (all driven against the active view) ───────────────────
  useScrollToNavigate(viewRef, route, locked, navigate)
  useKeyboardArrows(viewRef, locked, navigate)
  useScrollReveal(viewRef, route)

  // Resolve the inner scroll container (.view-inner, owned by the view) into the
  // ref the hooks read. Callback ref runs at commit (pre-effect), so the route-
  // keyed hook effects see the current view-inner.
  const setViewNode = useCallback((node: HTMLDivElement | null) => {
    viewRef.current = node?.querySelector<HTMLElement>('.view-inner') ?? null
  }, [])

  // ── Derived render values ────────────────────────────────────────────────────
  const enterClass = direction === 'down' ? 'view-enter-down' : 'view-enter-up'
  const nextRoute = ROUTE_ORDER[ROUTE_ORDER.indexOf(route) + 1]
  const nextLabel = nextRoute
    ? t(ROUTE_META[nextRoute].labelKey as keyof UiLabels)
    : null

  function renderView() {
    switch (route) {
      case 'work':
        return <WorkView onOpen={openProject} />
      case 'experience':
        return <ExperienceView />
      case 'skills':
        return <SkillsView />
      case 'process':
        return <ProcessView />
      case 'contact':
        return <ContactView />
      case 'home':
      default:
        return <HomeView navigate={navigate} />
    }
  }

  return (
    <>
      <div className="app">
        <Sidebar route={route} navigate={navigate} onOpenCmdK={openCmd} />

        <main className="flex min-w-0 flex-col overflow-hidden">
          <Topbar route={route} viewRef={viewRef} onOpenCmdK={openCmd} />

          {/* Re-keyed so React remounts → the view-enter keyframe replays and a
              fresh .view-inner starts at scrollTop 0. */}
          <div
            key={route}
            ref={setViewNode}
            className={cn('view min-h-0 flex-1', enterClass)}
          >
            {renderView()}
            <ScrollHint
              nextLabel={nextLabel}
              onClick={() => navigate('down')}
            />
          </div>
        </main>
      </div>

      {/* Global overlays — fixed-position, rendered outside the .app grid. */}
      <CommandPalette open={cmdOpen} onClose={closeCmd} onRun={runCommand} />
      <ProjectModal
        project={activeProject}
        onClose={closeProject}
        returnFocusRef={projectTriggerRef}
      />
      <Cursor />
    </>
  )
}

export default App
