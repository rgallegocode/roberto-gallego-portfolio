import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { languages, openDeck, openIn, projects, techDemand } from './helpers'

const strip = (text: string) => text.replace(/`/g, '')

for (const language of languages) {
  const withStudy = projects[language].filter((project) => project.caseStudy)

  test.describe(`case study ${language}`, () => {
    test.use({ viewport: { width: 1440, height: 900 } })
    test.beforeEach(async ({ page }) => { await openIn(page, language) })

    test('every project with a case study opens it from the deck, with all its sections and tables', async ({ page }) => {
      test.skip(withStudy.length === 0, 'no project has a case study')
      await openDeck(page)
      for (const project of withStudy) {
        const card = page.locator('.deck-card', { has: page.locator('h3', { hasText: project.name }) })
        const opener = card.locator('.case-open')
        await opener.click()
        const dialog = page.locator('.case-dialog[open]')
        await expect(dialog.locator('h2')).toHaveText(project.name)
        const blocks = project.caseStudy!
        await expect(dialog.locator('.case-body h3')).toHaveText(blocks.filter((b) => b.h).map((b) => strip(b.h!)))
        await expect(dialog.locator('.case-body h4')).toHaveText(blocks.filter((b) => b.h3).map((b) => strip(b.h3!)))
        await expect(dialog.locator('table')).toHaveCount(blocks.filter((b) => b.table).length)
        // numbers are shown exactly as written, every row and every cell
        for (const table of blocks.filter((b) => b.table).map((b) => b.table!)) {
          for (const row of table.rows) for (const cell of row) await expect(dialog.locator('td, tbody th', { hasText: strip(cell) }).first()).toBeAttached()
        }
        await expect(dialog.locator('.case-link')).toHaveAttribute('href', project.href)

        // Escape closes only the case study: the deck stays open and focus goes back to the button
        await page.keyboard.press('Escape')
        await expect(page.locator('.case-dialog')).toHaveCount(0)
        await expect(page.locator('.deck-dialog[open]')).toHaveCount(1)
        await expect(opener).toBeFocused()
      }
    })

    test('the home cards open the case study too, and the close button works', async ({ page }) => {
      const opener = page.locator('.project-card .case-open').first()
      test.skip(await opener.count() === 0, 'no home card has a case study')
      await opener.click()
      await expect(page.locator('.case-dialog[open]')).toHaveCount(1)
      await page.locator('.case-dialog .deck-close').click()
      await expect(page.locator('.case-dialog')).toHaveCount(0)
      await expect(opener).toBeFocused()
    })
  })

  for (const [device, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 360, height: 780 }]] as const) {
    test(`case study fits the screen and is accessible on ${device} (${language})`, async ({ page }) => {
      test.skip(withStudy.length === 0, 'no project has a case study')
      await page.setViewportSize(viewport)
      await openIn(page, language)
      await openDeck(page)
      await page.locator('.deck-card .case-open').first().click()
      await page.locator('.case-dialog[open]').waitFor()
      const problems = await page.evaluate(() => {
        const hits: string[] = []
        const dialog = document.querySelector('.case-dialog')!.getBoundingClientRect()
        if (dialog.left < 0 || dialog.right > innerWidth || dialog.top < 0 || dialog.bottom > innerHeight) hits.push('dialog outside the screen')
        const scroller = document.querySelector('.case-dialog .deck-scroll')!
        if (scroller.scrollWidth > scroller.clientWidth) hits.push('case study scrolls sideways (tables must scroll in their own box)')
        document.querySelectorAll<HTMLElement>('.case-body h3, .case-body h4, .case-body p, .case-body li').forEach((el) => {
          if (el.scrollWidth > el.clientWidth + 1) hits.push(`spills: ${el.tagName} "${el.textContent?.slice(0, 30)}"`)
        })
        return hits
      })
      expect(problems).toEqual([])
      const { violations } = await new AxeBuilder({ page }).include('.case-dialog').withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = violations
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
        .flatMap((violation) => violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`))
      expect(serious).toEqual([])
    })
  }
}

test('the deck lists technologies from most to least demanded by recruiters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openIn(page, 'en')
  await openDeck(page)
  if (await page.locator('.tech-more').count()) await page.locator('.tech-more').click()
  const shown = (await page.locator('.tech-chip').allTextContents()).map((text) => text.replace(/\s+\d+$/, '').trim())
  const ranked = shown.filter((tech) => techDemand.includes(tech))
  expect(ranked).toEqual([...ranked].sort((a, b) => techDemand.indexOf(a) - techDemand.indexOf(b)))
  expect(shown.slice(0, ranked.length)).toEqual(ranked) // technologies without data come last
})
