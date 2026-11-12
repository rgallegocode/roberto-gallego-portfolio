import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/playfair-display/wght.css'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource-variable/dm-sans/wght.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles/index.css'
import App from './App'
import { initialLanguage } from './lib'

const container = document.getElementById('root')!
const language = initialLanguage()
const app = <StrictMode><App initial={language} /></StrictMode>

// The built HTML already holds the English page (scripts/prerender.mjs): hydrate it when the visitor
// reads English, otherwise render their language over it. The dev server serves an empty root.
if (container.hasChildNodes() && language === 'en') hydrateRoot(container, app)
else createRoot(container).render(app)
