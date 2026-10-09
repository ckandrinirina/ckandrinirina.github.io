/**
 * ContactView — key/value card with copy buttons + pitch card.
 *
 * Verbatim port of the "Atelier Terminal" Contact view: an `.eyebrow`, a serif
 * `.section-title` with an accent `.mark` span, a `.section-sub` with `<strong>`
 * emphasis, then a `.contact-grid` (1.2fr / 1fr):
 *  1. `.contact-card` — meta `.row`s (`.key` + `.val`), each value optionally a
 *     link and/or copyable via a trailing `.copy-btn`; plus the languages row.
 *     A status `.row` colours a leading bullet; a region `.row` appends a muted
 *     "· UTC+3" fragment.
 *  2. `.contact-pitch` — a serif `<h3>`, two `<p>` paragraphs and a `.sig`.
 *
 * Copy logic mirrors the reference: navigator.clipboard?.writeText(value) →
 * setCopied(key) → setTimeout(() => setCopied(null), 1400). The copy buttons
 * keep their accessible names and a polite live region announces success.
 * Cards carry `.reveal` for useScrollReveal targeting.
 */

import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import type { ContactMetaRow } from '../content/types'
import DownloadCvButton from '../components/ui/DownloadCvButton'

const COPIED_DURATION_MS = 1400

// ---------------------------------------------------------------------------
// Sub-component: one contact row (optionally a link and/or copyable)
// ---------------------------------------------------------------------------

type ContactRowProps = {
  row: ContactMetaRow
  isCopied: boolean
  onCopy: (value: string, key: string) => void
  copyLabel: string
  copiedLabel: string
}

function ContactRow({
  row,
  isCopied,
  onCopy,
  copyLabel,
  copiedLabel,
}: ContactRowProps) {
  const isMailto = row.href?.startsWith('mailto:') ?? false

  return (
    <div className="row">
      <div className="key">{row.label}</div>
      <div className="val">
        {row.dot && <span style={{ color: 'var(--success)' }}>{'● '}</span>}
        {row.href ? (
          <a
            href={row.href}
            target={isMailto ? undefined : '_blank'}
            rel={isMailto ? undefined : 'noopener noreferrer'}
          >
            {row.value}
          </a>
        ) : (
          row.value
        )}
        {row.muted && (
          <span style={{ color: 'var(--muted)' }}> {row.muted}</span>
        )}
        {row.copy && (
          <button
            type="button"
            className={['copy-btn', isCopied ? 'copied' : ''].join(' ').trim()}
            onClick={() => onCopy(row.copyValue ?? row.value, row.label)}
            aria-label={
              isCopied
                ? `${row.label}: ${copiedLabel}`
                : `${copyLabel} ${row.label}`
            }
          >
            {isCopied ? `✓ ${copiedLabel}` : copyLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

export default function ContactView() {
  const { content, t } = useLanguage()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Mirrors the reference: fire-and-forget the clipboard write, then flip the
  // copied state synchronously so the button reflects success immediately
  // (independent of the async clipboard promise resolving).
  const handleCopy = useCallback((value: string, key: string) => {
    void navigator.clipboard?.writeText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), COPIED_DURATION_MS)
  }, [])

  const copyLabel = t('copy')
  const copiedLabel = t('copied')
  const { pitch } = content.contact

  return (
    <div className="view-inner">
      <p className="eyebrow">{t('eyebrowContact')}</p>
      <h2 className="section-title">
        {t('contactTitleLead')}
        <span className="mark">{t('contactTitleMark')}</span>
        {t('contactTitleTail')}
      </h2>
      <p className="section-sub">
        {t('contactSubLead')}
        <strong>{t('contactSubStrong')}</strong>
        {t('contactSubTail')}
      </p>

      {/* Accessible live region to announce copy success */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {copiedKey ? `${copiedKey}: ${copiedLabel}` : ''}
      </div>

      <div className="contact-grid">
        {/* Key/value card */}
        <div className="contact-card reveal">
          {content.contact.meta.map((row) => (
            <ContactRow
              key={row.label}
              row={row}
              isCopied={copiedKey === row.label}
              onCopy={handleCopy}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
            />
          ))}
          <div className="row">
            <div className="key">{t('navLanguages')}</div>
            <div className="val">{content.contact.languages.join(' · ')}</div>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <DownloadCvButton />
          </div>
        </div>

        {/* Pitch card */}
        <div
          className="contact-pitch reveal"
          style={{ transitionDelay: '0.12s' }}
        >
          <h3>{pitch.heading}</h3>
          {pitch.paragraphs.map((para, i) => (
            <p key={i} style={i === 1 ? { marginTop: 12 } : undefined}>
              {para}
            </p>
          ))}
          <div className="sig">{pitch.signature}</div>
        </div>
      </div>
    </div>
  )
}
