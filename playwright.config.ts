import { defineConfig } from '@playwright/test'

const port = 4173
const base = process.env.VITE_BASE ?? '/roberto-gallego-portfolio/'

// Always tests a fresh production build, served under the same base path as GitHub Pages.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${port}${base}`,
    browserName: 'chromium',
    // the deal-on-scroll animation hides elements until they enter the viewport; layout is measured at rest
    contextOptions: { reducedMotion: 'reduce' },
    locale: 'en-US',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://localhost:${port}${base}`,
    timeout: 120_000,
  },
})
