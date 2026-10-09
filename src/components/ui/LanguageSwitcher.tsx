/**
 * LanguageSwitcher — compact flag toggle.
 *
 * A single button showing the CURRENT locale's flag + code; clicking it switches
 * to the other locale. Lives in the topbar (top-right). The accessible name comes
 * from `t('languageSwitcher')` and names the current language.
 *
 * No required props — all data comes from useLanguage().
 */

import { useLanguage } from '../../i18n/useLanguage'
import type { Locale } from '../../i18n/LanguageProvider'
import { cn } from '../../lib/utils'

export type LanguageSwitcherProps = {
  className?: string
}

const FLAG: Record<Locale, string> = { fr: '🇫🇷', en: '🇬🇧' }
const NAME: Record<Locale, string> = { fr: 'Français', en: 'English' }

export default function LanguageSwitcher({
  className,
}: LanguageSwitcherProps = {}) {
  const { locale, setLocale, t } = useLanguage()
  const next: Locale = locale === 'fr' ? 'en' : 'fr'

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={`${locale.toUpperCase()} — ${t('languageSwitcher')} (${NAME[locale]})`}
      title={t('languageSwitcher')}
      data-cursor="hover"
      className={cn(
        'tb-lang focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none',
        className,
      )}
    >
      <span className="tb-lang-flag" aria-hidden="true">
        {FLAG[locale]}
      </span>
      <span className="tb-lang-code">{locale.toUpperCase()}</span>
    </button>
  )
}
