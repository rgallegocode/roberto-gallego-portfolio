import { expect, test } from '@playwright/test'
import { copy, homeProjectCount, languages, loadAllImages, openDeck, openIn, projects } from './helpers'

const sectionsOnScreen = async (page: import('@playwright/test').Page, id: string) => {
  await expect(async () => {
    const position = await page.evaluate((target) => {
      const heading = document.querySelector(`#${target} .section-heading`)!.getBoundingClientRect()
      return { top: heading.top, headerBottom: document.querySelector('.topbar')!.getBoundingClientRect().bottom, height: innerHeight }
    }, id)
    expect(position.top).toBeGreaterThanOrEqual(position.headerBottom - 1)
    expect(position.top).toBeLessThan(position.height)
  }).toPass({ timeout: 3000 })
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('loads and scrolls without errors or broken assets', async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message) => { if (message.type() === 'error') problems.push(`console: ${message.text()}`) })
    page.on('pageerror', (error) => problems.push(`exception: ${error.message}`))
    page.on('requestfailed', (request) => problems.push(`failed: ${request.url()}`))
    page.on('response', (response) => {
      const type = response.request().resourceType()
      // vite preview answers missing files with index.html and a 200, so the content type matters too
      const fallback = ['image', 'font', 'script', 'stylesheet'].includes(type) && (response.headers()['content-type'] ?? '').includes('text/html')
      if (response.status() >= 400 || fallback) problems.push(`${response.status()} ${response.url()}`)
    })

    await openIn(page, 'en')
    await loadAllImages(page)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.evaluate(() => document.fonts.ready)

    expect(problems).toEqual([])
  })

  test('every nav link goes to its section and marks it active', async ({ page }) => {
    await openIn(page, 'en')
    const links = page.locator('#main-nav a')
    for (let i = 0; i < await links.count(); i++) {
      const link = links.nth(i)
      const id = (await link.getAttribute('href'))!.slice(1)
      await link.click()
      await sectionsOnScreen(page, id)
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(link).toHaveAttribute('aria-current', 'true')
    }
  })

  test('brand link returns to the top', async ({ page }) => {
    await openIn(page, 'en')
    await page.locator('#main-nav a').last().click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await page.locator('.brand-lockup').click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('hero button goes to the projects', async ({ page }) => {
    await openIn(page, 'en')
    await page.locator('.hero .primary-button').click()
    await sectionsOnScreen(page, 'projects')
  })

  test('skip link is reachable from the keyboard', async ({ page }) => {
    await openIn(page, 'en')
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
  })

  test('gallery thumbnails switch the main screenshot', async ({ page }) => {
    await openIn(page, 'en')
    const galleries = page.locator('.project-gallery')
    expect(await galleries.count()).toBe(projects.en.slice(0, homeProjectCount).filter((project) => project.images.length > 0).length)

    for (let g = 0; g < await galleries.count(); g++) {
      const gallery = galleries.nth(g)
      const thumbs = gallery.locator('.project-thumbs button')
      for (let t = await thumbs.count() - 1; t >= 0; t--) {
        await thumbs.nth(t).click()
        await expect(thumbs.nth(t)).toHaveAttribute('aria-pressed', 'true')
        const label = await thumbs.nth(t).getAttribute('aria-label')
        await expect(gallery.locator('.project-shot img')).toHaveAttribute('alt', label!)
      }
    }
  })

  test('language switch translates the page and survives a reload', async ({ page }) => {
    await openIn(page, 'en')
    for (const language of languages) {
      await page.locator('.language-switcher button', { hasText: new RegExp(`^${language}$`, 'i') }).click()
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(page.locator('h1 span').first()).toHaveText(copy[language].title.split('\n')[0])
      await expect(page).toHaveTitle(`Roberto Gallego Barbarán | ${copy[language].nav[1]}`)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang', language)
    }
  })
})

test.describe('the whole deck', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  const names = (list: typeof projects.en) => list.map((project) => project.name)

  test('searches by name, ignoring case and accents', async ({ page }) => {
    await openIn(page, 'es')
    await openDeck(page)
    const target = projects.es[projects.es.length - 1].name
    const typed = target.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()
    await page.getByRole('searchbox').fill(typed)
    await expect(page.locator('.deck-card h3')).toHaveText([target])
    await expect(page.getByRole('status')).toContainText(`1 de ${projects.es.length}`)
  })

  test('filters by technology, and technologies combine', async ({ page }) => {
    await openIn(page, 'en')
    await openDeck(page)
    if (await page.locator('.tech-more').count()) await page.locator('.tech-more').click()
    const [first, ...others] = projects.en[0].stack
    await page.locator('.tech-chip', { hasText: first }).first().click()
    let wanted = projects.en.filter((project) => project.stack.includes(first))
    await expect(page.locator('.deck-card h3')).toHaveText(names(wanted))

    if (others.length > 0) {
      await page.locator('.tech-chip', { hasText: others[0] }).first().click()
      wanted = wanted.filter((project) => project.stack.includes(others[0]))
      await expect(page.locator('.deck-card h3')).toHaveText(names(wanted))
    }

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.locator('.deck-card')).toHaveCount(projects.en.length)
    await expect(page.locator('.tech-chip[aria-pressed="true"]')).toHaveCount(0)
  })

  test('offers every technology with its project count', async ({ page }) => {
    await openIn(page, 'en')
    await openDeck(page)
    if (await page.locator('.tech-more').count()) await page.locator('.tech-more').click()
    const all = new Set(projects.en.flatMap((project) => project.stack))
    await expect(page.locator('.tech-chip')).toHaveCount(all.size)
    for (const tech of all) {
      const total = projects.en.filter((project) => project.stack.includes(tech)).length
      await expect(page.locator('.tech-chip').filter({ hasText: new RegExp(`^${tech.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')} ${total}$`) })).toHaveCount(1)
    }
  })

  test('says so when nothing matches', async ({ page }) => {
    await openIn(page, 'en')
    await openDeck(page)
    await page.getByRole('searchbox').fill('zzz no such project')
    await expect(page.locator('.deck-card')).toHaveCount(0)
    await expect(page.locator('.deck-empty')).toBeVisible()
  })

  test('closes with the button, Escape and the backdrop, returning focus', async ({ page }) => {
    await openIn(page, 'en')
    const opener = page.locator('.deck-button')
    const dialog = page.locator('.deck-dialog')

    await openDeck(page)
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()

    await openDeck(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()

    await openDeck(page)
    await page.mouse.click(4, 450)
    await expect(dialog).toHaveCount(0)
  })

  test('clicks inside the deck do not close it', async ({ page }) => {
    await openIn(page, 'en')
    await openDeck(page)
    await page.locator('.deck-header h2').click()
    await expect(page.locator('.deck-dialog[open]')).toHaveCount(1)
  })
})

test.describe('deal-on-scroll animation', () => {
  test.use({ viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: 'no-preference' } })

  const expectAllDealt = async (page: import('@playwright/test').Page) => {
    const cards = page.locator('[data-reveal]')
    for (let i = 0; i < await cards.count(); i++) {
      await cards.nth(i).scrollIntoViewIfNeeded()
      await expect(cards.nth(i)).toHaveClass(/is-visible/)
      await expect(cards.nth(i)).toHaveCSS('opacity', '1')
    }
  }

  test('leaves no card hidden, also after changing language', async ({ page }) => {
    await openIn(page, 'en')
    await expectAllDealt(page)
    await page.locator('.language-switcher button', { hasText: /^es$/i }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expectAllDealt(page)
  })
})

test.describe('browser language', () => {
  test.use({ locale: 'de-DE' })

  test('is used on the first visit', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('menu opens, navigates and closes', async ({ page }) => {
    await openIn(page, 'en')
    const toggle = page.locator('.menu-toggle')
    const firstLink = page.locator('#main-nav a').first()
    await expect(toggle).toBeVisible()
    await expect(firstLink).toBeHidden()

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(firstLink).toBeVisible()
    const links = page.locator('#main-nav a')
    for (let i = 0; i < await links.count(); i++) await expect(links.nth(i)).toBeInViewport()

    const last = links.last()
    const id = (await last.getAttribute('href'))!.slice(1)
    await last.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(firstLink).toBeHidden()
    await sectionsOnScreen(page, id)
  })
})
