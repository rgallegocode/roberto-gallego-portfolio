import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { credentials, homeProjectCount, languages, loadAllImages, openDeck, openIn, projects, skills, timeline } from './helpers'

for (const language of languages) {
  test.describe(language, () => {
    test.beforeEach(async ({ page }) => { await openIn(page, language) })

    test('deals the most important projects, in order', async ({ page }) => {
      const best = projects[language].slice(0, homeProjectCount)
      await expect(page.locator('.project-card h3')).toHaveText(best.map((project) => project.name))
      for (const project of best) {
        const card = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: project.name, exact: true }) })
        await expect(card.locator('.project-description')).toHaveText(project.description)
        await expect(card.locator('.stack li')).toHaveText(project.stack)
        await expect(card.locator('a.project-link')).toHaveAttribute('href', project.href)
      }
    })

    test('the deck shows every project with its text, stack and link', async ({ page }) => {
      await openDeck(page)
      await expect(page.locator('.deck-card h3')).toHaveText(projects[language].map((project) => project.name))
      for (const project of projects[language]) {
        const card = page.locator('.deck-card').filter({ has: page.getByRole('heading', { name: project.name, exact: true }) })
        await expect(card.locator('.project-description')).toHaveText(project.description)
        await expect(card.locator('.stack li')).toHaveText(project.stack)
        await expect(card.locator('a.project-link')).toHaveAttribute('href', project.href)
      }
    })

    test('shows every skill group, journey step and credential', async ({ page }) => {
      await expect(page.locator('.skill-card')).toHaveCount(skills[language].length)
      await expect(page.locator('.journey-section .timeline-card')).toHaveCount(timeline[language].length)
      const total = credentials[language].certifications.length + credentials[language].achievements.length
      await expect(page.locator('.credential')).toHaveCount(total)
    })

    test('every image loads', async ({ page }) => {
      await loadAllImages(page)
      const broken = await page.evaluate(() => Array.from(document.images).filter((image) => image.naturalWidth === 0).map((image) => image.src))
      expect(broken).toEqual([])
    })

    test('the CV links serve a real PDF', async ({ page, request }) => {
      const cvLanguage = language === 'es' ? 'es' : 'en'
      const links = page.locator('.hero .cv-link')
      await expect(links).toHaveCount(2)
      for (let i = 0; i < 2; i++) {
        const href = (await links.nth(i).getAttribute('href'))!
        expect(href).toContain(`cv-${cvLanguage}.pdf`)
        const response = await request.get(href)
        expect(response.status()).toBe(200)
        expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
      }
      await expect(links.nth(1)).toHaveAttribute('download', `Roberto-Gallego-CV-${cvLanguage}.pdf`)
    })

    test('document structure and links are sound', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1)
      const problems = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index).map((id) => `duplicate id: ${id}`)
        const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
        const dead = anchors
          .filter((a) => a.getAttribute('href')!.startsWith('#') && !document.getElementById(a.getAttribute('href')!.slice(1)))
          .map((a) => `dead anchor: ${a.getAttribute('href')}`)
        const unsafe = anchors
          .filter((a) => a.target === '_blank' && !a.rel.includes('noreferrer'))
          .map((a) => `missing rel: ${a.href}`)
        const empty = anchors.concat(Array.from(document.querySelectorAll('button')) as never[])
          .filter((el) => !el.textContent?.trim() && !el.getAttribute('aria-label') && !el.querySelector('img[alt]:not([alt=""])') && !el.closest('[aria-hidden="true"]'))
          .map((el) => `unnamed control: ${el.outerHTML.slice(0, 80)}`)
        return [...duplicates, ...dead, ...unsafe, ...empty]
      })
      expect(problems).toEqual([])
    })

    for (const [device, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]] as const) {
      test(`no serious accessibility problems on ${device}`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await loadAllImages(page)
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
        const serious = violations
          .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
          .flatMap((violation) => violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`))
        expect(serious).toEqual([])
      })

      test(`no serious accessibility problems in the deck on ${device}`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await openDeck(page)
        const { violations } = await new AxeBuilder({ page }).include('.deck-dialog').withTags(['wcag2a', 'wcag2aa']).analyze()
        const serious = violations
          .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
          .flatMap((violation) => violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`))
        expect(serious).toEqual([])
      })
    }
  })
}

test('the favicon is served', async ({ request }) => {
  const response = await request.get('favicon.svg')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('svg')
})
