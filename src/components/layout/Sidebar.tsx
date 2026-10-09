/**
 * Sidebar — 240px fixed aside that frames every view.
 *
 * Renders:
 *  - Brand mark (logo + title)
 *  - Grouped nav rows (workspace · connect) with glyph, label, optional badge
 *  - Active route visual distinction via `.active` class
 *  - Desktop-only status block (available · tnr · claude-code)
 *  - ThemeSwitcher and LanguageSwitcher controls
 *
 * Props, not global state: Sidebar is presentational and prop-driven.
 * App owns the route state (04-01). Adding a new route requires only a new
 * entry in `constants.ts` — no changes here (Open/Closed principle).
 */

import type { RouteId } from '../../lib/constants'
import { NAV_GROUPS, ROUTE_META, SITE_META } from '../../lib/constants'
import { useLanguage } from '../../i18n/useLanguage'
import type { UiLabels } from '../../i18n/ui'

// ── Props ────────────────────────────────────────────────────────────────────

export type SidebarProps = {
  /** Currently active route id. */
  route: string
  /** Called when the user clicks a nav row. App updates route state. */
  navigate: (id: RouteId) => void
  /** Called when the user activates the ⌘K entry point (optional, unused here
   *  but accepted so callers can pass a unified handler set). */
  onOpenCmdK?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ route, navigate }: SidebarProps) {
  const { t } = useLanguage()

  return (
    <aside className="sidebar">
      {/* Brand mark -------------------------------------------------------- */}
      <button
        type="button"
        className="sb-brand focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
        aria-label="Go to home"
        onClick={() => navigate('home')}
      >
        <span className="sb-mark" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="" />
        </span>
        <span className="sb-brand-text">
          <span className="sb-name">{SITE_META.name}</span>
          <span className="sb-role">{SITE_META.title}</span>
        </span>
      </button>

      {/* Nav groups -------------------------------------------------------- */}
      <nav className="sb-nav" aria-label="Site navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="sb-group">
            <div className="sb-group-label">{group.label}</div>
            {group.routes.map((id) => {
              const meta = ROUTE_META[id]
              const isActive = id === route
              return (
                <button
                  key={id}
                  type="button"
                  data-testid={`nav-row-${id}`}
                  className={['sb-row', isActive ? 'active' : '']
                    .join(' ')
                    .trim()}
                  onClick={() => navigate(id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sb-glyph" aria-hidden="true">
                    {meta.glyph}
                  </span>
                  <span className="sb-label">
                    {t(meta.labelKey as keyof UiLabels)}
                  </span>
                  {meta.badge && <span className="sb-badge">{meta.badge}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Desktop-only status block — two-column key/value rows ------------- */}
      <div className="sb-status" data-testid="sb-status">
        <div className="sb-status-row" data-testid="sb-status-available">
          <span className="sb-status-key">{t('sbStatusKey')}</span>
          <span className="sb-status-live">
            <span
              className="sb-dot"
              data-testid="sb-dot-available"
              aria-hidden="true"
            />
            {t('footerStatus')}
          </span>
        </div>
        <div className="sb-status-row" data-testid="sb-status-region">
          <span className="sb-status-key">{t('sbRegionKey')}</span>
          <span className="sb-status-value">{t('footerRegion')}</span>
        </div>
      </div>
    </aside>
  )
}
