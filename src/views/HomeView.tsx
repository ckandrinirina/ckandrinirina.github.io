/**
 * HomeView — the `home` route view.
 *
 * A faithful port of the "Atelier Terminal" reference home (docs/portfolion-ui):
 * a two-column hero (rich serif name with a letter-by-letter reveal + a
 * 220×280 portrait card), an availability greeting pill, a story-driven tagline
 * with serif-italic emphasis, a sliding "also a —" role rotor, two CTAs, a
 * "Now building" card, a 2×2 italic-serif stats grid, and a full-bleed
 * serif-italic marquee.
 *
 * Content is bilingual (EN/FR) and lives in the local HERO map so the hero's
 * inline emphasis (<strong>/<em>) can be expressed as JSX — the reference copy
 * is the source of truth for EN.
 *
 * SOLID notes:
 * - S: composes layout; motion lives in Reveal / CountUp / Marquee primitives.
 * - O: roles/stats/marquee are data arrays — adding items needs no view change.
 * - D: depends on the useLanguage() hook abstraction, not concrete content.
 */

import { useEffect, useState, type ReactNode } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import Marquee from '../components/ui/Marquee'
import DownloadCvButton from '../components/ui/DownloadCvButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HomeViewProps {
  /** App-level navigation callback; HomeView does not own routing. */
  navigate: (route: string) => void
}

interface HeroContent {
  greet: string
  nameFirst: string
  nameRest: string
  tagline: ReactNode
  alsoA: string
  roles: string[]
  ctaWork: string
  ctaContact: string
  avatarAlt: string
  avatarTag: string
  nowHead: string
  nowBody: ReactNode
  nowMetaLabel: string
  nowMetaPeriod: string
  stats: Array<{ n: number; suffix?: string; label: string }>
}

// ---------------------------------------------------------------------------
// Content — EN is exact to the reference; FR is a faithful translation.
// ---------------------------------------------------------------------------

const MARQUEE_ITEMS = [
  'React',
  'Next.js',
  'NestJS',
  'TypeScript',
  'Angular',
  'Symfony',
  'PostgreSQL',
  'MongoDB',
  'Blockchain',
  'OpenAI',
  'Realtime',
  'Docker',
  'Figma',
  'Claude Code',
]

const HERO: Record<'en' | 'fr', HeroContent> = {
  en: {
    greet: 'Hello — currently available for new work · Q3 2026',
    nameFirst: 'Erick',
    nameRest: 'Andrinirina',
    tagline: (
      <>
        Fullstack engineer based in <strong>Antananarivo, Madagascar</strong>.
        Seven years writing software that needs to feel as good as it works —
        from a Malagasy bank&apos;s online onboarding to a{' '}
        <em>USDC-powered points economy</em> at YAS. I write the backend, design
        the frontend, and care about the inch between them.
      </>
    ),
    alsoA: 'also a —',
    roles: [
      'interface designer',
      'systems thinker',
      'OCR & AI tinkerer',
      'realtime engineer',
      'ludo champion',
    ],
    ctaWork: 'See selected work',
    ctaContact: 'Get in touch',
    avatarAlt: 'Erick Andrinirina — profile photo',
    avatarTag: 'online · tnr',
    nowHead: 'Now building',
    nowBody: (
      <>
        <strong>SOKA · Ludoka</strong> — a points economy where you can{' '}
        <em>buy, play, earn, spend</em> in one wallet. USDC, MVola mobile money
        and SOKA points, realtime everywhere.
      </>
    ),
    nowMetaLabel: 'YAS Madagascar',
    nowMetaPeriod: '2025 — present',
    stats: [
      { n: 7, label: 'years shipping' },
      { n: 8, suffix: '+', label: 'flagship projects' },
      { n: 12, label: 'frameworks shipped' },
      { n: 3, label: 'languages spoken' },
    ],
  },
  fr: {
    greet: 'Bonjour — disponible pour de nouveaux projets · T3 2026',
    nameFirst: 'Erick',
    nameRest: 'Andrinirina',
    tagline: (
      <>
        Ingénieur fullstack basé à <strong>Antananarivo, Madagascar</strong>.
        Sept ans à écrire des logiciels qui doivent être aussi agréables
        qu&apos;efficaces — de l&apos;onboarding en ligne d&apos;une banque
        malgache à une <em>économie de points propulsée par l&apos;USDC</em>{' '}
        chez YAS. J&apos;écris le back-end, je conçois le front-end, et je
        soigne le moindre détail entre les deux.
      </>
    ),
    alsoA: 'aussi —',
    roles: [
      "designer d'interface",
      'penseur systèmes',
      'bricoleur OCR & IA',
      'ingénieur temps réel',
      'champion de ludo',
    ],
    ctaWork: 'Voir les projets',
    ctaContact: 'Me contacter',
    avatarAlt: 'Erick Andrinirina — photo de profil',
    avatarTag: 'en ligne · tnr',
    nowHead: 'En cours',
    nowBody: (
      <>
        <strong>SOKA · Ludoka</strong> — une économie de points où vous pouvez{' '}
        <em>acheter, jouer, gagner, dépenser</em> dans un seul portefeuille.
        USDC, mobile money MVola et points SOKA, en temps réel partout.
      </>
    ),
    nowMetaLabel: 'YAS Madagascar',
    nowMetaPeriod: '2025 — aujourd’hui',
    stats: [
      { n: 7, label: 'années de code' },
      { n: 8, suffix: '+', label: 'projets phares' },
      { n: 12, label: 'frameworks livrés' },
      { n: 3, label: 'langues parlées' },
    ],
  },
}

// ---------------------------------------------------------------------------
// Reduced-motion guard (mirrors Reveal / CountUp)
// ---------------------------------------------------------------------------

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ---------------------------------------------------------------------------
// Role rotor — a vertical sliding track; cycles through roles on an interval.
// ---------------------------------------------------------------------------

const ROTOR_INTERVAL_MS = 2600

function RoleRotor({ alsoA, roles }: { alsoA: string; roles: string[] }) {
  const reduced = prefersReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Under reduced motion: freeze on the first role — no interval.
    if (reduced || roles.length <= 1) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, ROTOR_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduced, roles.length])

  return (
    <div className="home-roles reveal r-fade">
      <span>{alsoA}</span>
      <span className="home-rotor" aria-live="polite" aria-atomic="true">
        <span
          className="home-rotor-track"
          style={{ transform: `translateY(-${index * 1.3}em)` }}
        >
          {roles.map((role) => (
            <span key={role} className="home-rotor-item">
              {role}
            </span>
          ))}
        </span>
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// HomeView
// ---------------------------------------------------------------------------

export default function HomeView({ navigate }: HomeViewProps) {
  const { locale } = useLanguage()
  const c = HERO[locale]

  // Profile image path — served from public/ with a stable URL.
  const profileSrc = `${import.meta.env.BASE_URL}profile.jpg`

  // Continue the letter cascade onto the second word (first word + a space).
  const restDelay = (c.nameFirst.length + 1) * 40

  return (
    <div className="view-inner">
      <div className="view-content">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="home-hero">
          <div className="home-hero-text">
            <div className="home-greet reveal r-fade">
              <span className="home-greet-pulse" aria-hidden="true" />
              <span>{c.greet}</span>
            </div>

            <h1 className="home-name">
              <Reveal text={c.nameFirst} italic />{' '}
              <Reveal text={c.nameRest} delay={restDelay} />
              <span className="home-accent" aria-hidden="true">
                .
              </span>
            </h1>

            <p className="home-tagline reveal r-fade">{c.tagline}</p>

            <RoleRotor alsoA={c.alsoA} roles={c.roles} />

            <div className="home-actions reveal r-fade">
              <button
                type="button"
                className="btn btn-primary focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                onClick={() => navigate('work')}
              >
                <span>{c.ctaWork}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                type="button"
                className="btn focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                onClick={() => navigate('contact')}
              >
                <span>{c.ctaContact}</span>
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
              <DownloadCvButton />
            </div>
          </div>

          {/* Avatar column */}
          <div className="avatar-col reveal r-right">
            <div className="avatar-frame">
              <img src={profileSrc} alt={c.avatarAlt} />
              <span className="avatar-ring" aria-hidden="true" />
            </div>
            <span className="avatar-tag">
              <span className="dot" aria-hidden="true" />
              {c.avatarTag}
            </span>
          </div>
        </section>

        {/* ── Home grid (now-card + stats) ───────────────────────────────── */}
        <div className="home-grid">
          <div className="now-card reveal">
            <div className="now-head">
              <span className="now-ico" aria-hidden="true" />
              <span>{c.nowHead}</span>
            </div>
            <div className="now-body">{c.nowBody}</div>
            <div className="now-meta">
              <span>{c.nowMetaLabel}</span>
              <span>{c.nowMetaPeriod}</span>
            </div>
          </div>

          <div className="stats-grid reveal">
            {c.stats.map((stat, i) => (
              <div key={i} className="stat-tile">
                <div className="stat-n">
                  <CountUp to={stat.n} suffix={stat.suffix} inView />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Marquee ────────────────────────────────────────────────────── */}
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </div>
  )
}
