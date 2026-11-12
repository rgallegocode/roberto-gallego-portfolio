import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Rendered at build time (scripts/prerender.mjs) so the page reads without JavaScript:
// search engines, AI tools and applicant-tracking systems get the full text.
export function render() {
  return renderToString(
    <StrictMode>
      <App initial="en" />
    </StrictMode>,
  )
}
