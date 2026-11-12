// Writes the server-rendered English page into dist/index.html, so the HTML carries the content.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const ssr = resolve('dist-ssr')
const { render } = await import(pathToFileURL(resolve(ssr, 'entry-server.js')).href)

const file = resolve(dist, 'index.html')
const html = readFileSync(file, 'utf8')
const placeholder = '<div id="root"></div>'
if (!html.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in dist/index.html`)

const app = render()
if (!app.includes('<h1')) throw new Error('prerender: the rendered page has no <h1>')
writeFileSync(file, html.replace(placeholder, `<div id="root">${app}</div>`))
rmSync(ssr, { recursive: true, force: true })
console.log(`prerender: wrote ${app.length} characters of HTML into dist/index.html`)
