import { expect, test } from '@playwright/test'
import { languages, loadAllImages, openDeck, openIn } from './helpers'

const widths = [360, 768, 1024, 1440, 1920]

for (const width of widths) {
  for (const language of languages) {
    test.describe(`${width}px ${language}`, () => {
      test.use({ viewport: { width, height: 900 } })

      test.beforeEach(async ({ page }) => {
        await openIn(page, language)
        await loadAllImages(page)
      })

      test('no horizontal scroll', async ({ page }) => {
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow).toBeLessThanOrEqual(0)
      })

      // .site-shell clips overflow, so scrollWidth alone would miss content cut off at the screen edge
      test('content stays inside the screen', async ({ page }) => {
        const offenders = await page.evaluate(() => {
          const limit = document.documentElement.clientWidth
          return Array.from(document.querySelectorAll<HTMLElement>('header *, main *, footer *, .deck-dialog *'))
            .filter((el) => !el.closest('[aria-hidden="true"]') && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
            .filter((el) => {
              const box = el.getBoundingClientRect()
              return box.width > 0 && (box.left < -1 || box.right > limit + 1)
            })
            .map((el) => `${el.tagName.toLowerCase()}.${el.className} "${el.textContent?.trim().slice(0, 40)}"`)
        })
        expect(offenders).toEqual([])
      })

      test('text is not cut off or spilling out of its box', async ({ page }) => {
        const offenders = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, a, button'))
            .filter((el) => !el.closest('[aria-hidden="true"]') && el.checkVisibility({ visibilityProperty: true }))
            .filter((el) => {
              const style = getComputedStyle(el)
              if (style.display === 'inline') return false
              const wide = el.scrollWidth > el.clientWidth + 1
              const tall = style.overflowY !== 'visible' && el.scrollHeight > el.clientHeight + 2
              return wide || tall
            })
            .map((el) => `${el.tagName.toLowerCase()}.${el.className} "${el.textContent?.trim().slice(0, 40)}"`),
        )
        expect(offenders).toEqual([])
      })

      test('card content stays inside its card', async ({ page }) => {
        const offenders = await page.evaluate(() => {
          const cards = document.querySelectorAll('.project-card, .skill-card, .timeline-card, .contact-card, .quote-card, .credential')
          return Array.from(cards).flatMap((card) => {
            const outer = card.getBoundingClientRect()
            return Array.from(card.querySelectorAll<HTMLElement>('*'))
              .filter((el) => !el.closest('[aria-hidden="true"]') && el.checkVisibility())
              .filter((el) => {
                const box = el.getBoundingClientRect()
                return box.width > 0 && (box.left < outer.left - 1 || box.right > outer.right + 1 || box.top < outer.top - 1 || box.bottom > outer.bottom + 1)
              })
              .map((el) => `${card.className} > ${el.tagName.toLowerCase()}.${el.className}`)
          })
        })
        expect(offenders).toEqual([])
      })

      test('blocks do not overlap each other', async ({ page }) => {
        const overlaps = await page.evaluate(() => {
          const groups = [
            '.project-grid > *', '.skills-grid > *', '.journey-section .timeline > *', '.credential-tray > *',
            '.topbar > .brand-lockup, .topbar > nav, .topbar > .topbar-tools',
          ]
          const hits: string[] = []
          for (const selector of groups) {
            const items = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
            items.forEach((a, index) => items.slice(index + 1).forEach((b) => {
              const x = a.getBoundingClientRect()
              const y = b.getBoundingClientRect()
              const overlap = Math.min(x.right, y.right) - Math.max(x.left, y.left) > 1 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 1
              if (overlap) hits.push(`${selector}: "${a.textContent?.slice(0, 25)}" / "${b.textContent?.slice(0, 25)}"`)
            }))
          }
          return hits
        })
        expect(overlaps).toEqual([])
      })

      test('the deck fits the screen, with nothing cut off or overlapping', async ({ page }) => {
        await openDeck(page)
        const problems = await page.evaluate(() => {
          const limit = document.documentElement.clientWidth
          const dialog = document.querySelector('.deck-dialog')!.getBoundingClientRect()
          const visible = (el: HTMLElement) => !el.closest('[aria-hidden="true"]') && el.checkVisibility()
          const hits: string[] = []
          if (dialog.left < 0 || dialog.right > limit || dialog.top < 0 || dialog.bottom > innerHeight) hits.push('dialog outside the screen')
          const scroller = document.querySelector('.deck-scroll')!
          if (scroller.scrollWidth > scroller.clientWidth) hits.push('deck scrolls sideways')
          document.querySelectorAll<HTMLElement>('.deck-dialog *').forEach((el) => {
            const box = el.getBoundingClientRect()
            if (visible(el) && box.width > 0 && (box.left < dialog.left - 1 || box.right > dialog.right + 1)) hits.push(`outside: ${el.tagName}.${el.className}`)
          })
          document.querySelectorAll<HTMLElement>('.deck-dialog h2, .deck-dialog h3, .deck-dialog p, .deck-dialog button, .deck-card li').forEach((el) => {
            if (visible(el) && getComputedStyle(el).display !== 'inline' && el.scrollWidth > el.clientWidth + 1) hits.push(`spills: ${el.tagName} "${el.textContent?.slice(0, 30)}"`)
          })
          document.querySelectorAll<HTMLElement>('.deck-card').forEach((card) => {
            const outer = card.getBoundingClientRect()
            card.querySelectorAll<HTMLElement>('*').forEach((el) => {
              const box = el.getBoundingClientRect()
              if (visible(el) && box.width > 0 && (box.left < outer.left - 1 || box.right > outer.right + 1 || box.bottom > outer.bottom + 1)) hits.push(`out of card: ${el.tagName}.${el.className}`)
            })
          })
          return hits
        })
        expect(problems).toEqual([])
      })

      test('navigation is reachable', async ({ page }) => {
        const links = page.locator('#main-nav a').first()
        const toggle = page.locator('.menu-toggle')
        expect(await links.isVisible() || await toggle.isVisible()).toBe(true)
      })
    })
  }
}
