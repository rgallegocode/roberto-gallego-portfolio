import { readFileSync } from 'node:fs'
import type { Page } from '@playwright/test'

export const languages = ['en', 'es', 'de'] as const
export type Language = (typeof languages)[number]

// Tests read the generated content, so adding a project or a credential never needs a test change.
const readData = (name: string) => JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'))

type Project = { name: string; description: string; stack: string[]; href: string; images: { src: string; alt: string }[] }

export const homeProjectCount = 3

export const copy: Record<Language, { title: string; nav: string[] }> = readData('copy')
export const projects: Record<Language, Project[]> = readData('projects')
export const skills: Record<Language, { title: string }[]> = readData('skills')
export const timeline: Record<Language, { title: string }[]> = readData('timeline')
export const credentials: Record<Language, { certifications: unknown[]; achievements: unknown[] }> = readData('credentials')

export async function openIn(page: Page, language: Language) {
  await page.addInitScript((value) => {
    if (!sessionStorage.getItem('language-seeded')) {
      localStorage.setItem('portfolio-language', value)
      sessionStorage.setItem('language-seeded', '1')
    }
  }, language)
  await page.goto('./')
  // the h1 is already in the prerendered HTML: wait until React has hydrated it
  await page.locator('html[data-app="ready"]').waitFor({ state: 'attached' })
  await page.evaluate(() => document.fonts.ready)
}

/** Forces lazy images to load and waits until each one has settled. */
export async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images)
    images.forEach((image) => { image.loading = 'eager' })
    // `complete` is also true for an image that already failed: its error event will not fire again
    await Promise.all(images.map((image) => image.complete
      ? undefined
      : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })))
  })
}

export async function openDeck(page: Page) {
  await page.locator('.deck-button').click()
  await page.locator('.deck-dialog[open]').waitFor()
}
