/**
 * Label-in-name regression tests (story 13-03, Lighthouse accessibility).
 *
 * WCAG 2.5.3: a control's accessible name must contain its visible text, so
 * speech-input users can activate it by saying what they see.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'
import Topbar from '../components/layout/Topbar'
import Sidebar from '../components/layout/Sidebar'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'
import { SITE_META } from '../lib/constants'

function withProviders(ui: React.ReactNode) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>,
  )
}

const accessibleName = (el: HTMLElement) => el.getAttribute('aria-label') ?? ''

describe('accessible names contain the visible label', () => {
  it('the ⌘K button name contains its visible "Quick nav" and "⌘K" text', () => {
    withProviders(
      <Topbar route="home" viewRef={{ current: null }} onOpenCmdK={() => {}} />,
    )
    const name = accessibleName(screen.getByTestId('tb-cmdk-btn'))
    expect(name).toContain('Quick nav')
    expect(name).toContain('⌘K')
  })

  it('the sidebar brand button name contains the visible name and role', () => {
    withProviders(<Sidebar route="home" navigate={() => {}} />)
    const brand = document.querySelector<HTMLElement>('.sb-brand')!
    const name = accessibleName(brand)
    expect(name).toContain(SITE_META.name)
    expect(name).toContain(SITE_META.title)
  })

  it('the language toggle name contains its visible locale code', () => {
    withProviders(<LanguageSwitcher />)
    const btn = screen.getByRole('button')
    const code = btn.querySelector('.tb-lang-code')!.textContent!
    expect(accessibleName(btn)).toContain(code)
  })
})
