import { expect, test } from '@playwright/test'
import { copy, homeProjectCount, openIn, projects, skills, timeline } from './helpers'

// Search engines, AI tools and applicant-tracking systems often read the HTML without running JavaScript.
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the page shows its content', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('h1')).toHaveText(copy.en.title.replace(/\n/g, ''))
    await expect(page.locator('.project-card h3')).toHaveText(projects.en.slice(0, homeProjectCount).map((project) => project.name))
    await expect(page.locator('.skill-card')).toHaveCount(skills.en.length)
    await expect(page.locator('.journey-section .timeline-card')).toHaveCount(timeline.en.length)
    for (const card of await page.locator('[data-reveal]').all()) await expect(card).toBeVisible()
  })
})

test('the raw HTML carries the text', async ({ request }) => {
  const html = await (await request.get('./')).text()
  for (const project of projects.en.slice(0, homeProjectCount)) expect(html).toContain(`>${project.name}</h3>`)
  expect(html).not.toContain('enable JavaScript')
})

test('the browser takes over the prerendered page without hydration errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await openIn(page, 'en')
  await page.locator('.language-switcher button', { hasText: 'ES' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  expect(errors).toEqual([])
})
