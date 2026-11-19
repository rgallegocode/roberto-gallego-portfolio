import { expect, test } from '@playwright/test'
import { languages, openIn } from './helpers'

// The rank-and-suit corners are aria-hidden decoration, so the layout tests skip them.
// This sweeps every width from phone to wide desktop, because an overlap can appear only in a narrow band.
const widths = Array.from({ length: (2560 - 320) / 16 + 1 }, (_, i) => 320 + i * 16)

for (const language of languages) {
  test(`card corners never cover the card text (${language}, 320–2560px)`, async ({ page }) => {
    test.setTimeout(120_000)
    await openIn(page, language)
    const hits: string[] = []
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      hits.push(...await page.evaluate((w) => {
        const out: string[] = []
        document.querySelectorAll<HTMLElement>('.skill-card, .project-card, .deck-card, .timeline-card, .credential').forEach((card) => {
          const corners = Array.from(card.querySelectorAll<HTMLElement>('.skill-corner'))
          const texts = Array.from(card.querySelectorAll<HTMLElement>('h3, p, li, a, button')).filter((el) => !el.closest('[aria-hidden="true"]') && el.checkVisibility())
          for (const corner of corners) {
            const c = corner.getBoundingClientRect()
            for (const text of texts) {
              const t = text.getBoundingClientRect()
              const overlap = Math.min(c.right, t.right) - Math.max(c.left, t.left) > 0 && Math.min(c.bottom, t.bottom) - Math.max(c.top, t.top) > 0
              if (overlap) out.push(`${w}px: corner "${corner.textContent?.trim()}" covers "${text.textContent?.trim().slice(0, 30)}"`)
            }
          }
        })
        return out
      }, width))
    }
    expect([...new Set(hits)]).toEqual([])
  })
}
